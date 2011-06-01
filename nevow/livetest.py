
from twisted.internet import defer, reactor
from nevow import livepage, loaders, tags, rend, static, entities
from nevow.livepage import js, document


testFrameNode = js.testFrameNode
contentDocument = testFrameNode.contentDocument


import os.path
resourceDirectory = os.path.dirname(__file__)


class Driver(object):
    def __init__(self, suite):
        self.suite = suite
        self.results = {}
        self.state = 0
        self.iterator = self.drive()
        self._notifications = []

    passes = 0
    failures = 0
    _handle = None
    def setHandle(self, handle):
        self._handle = handle

    def action_post(self, action, target, parameter, callWhenDone=None):
        if callWhenDone is None:
            callWhenDone = "function (){}"
        def observePosting(client, location, destination):
            if location.endswith(destination):
                self.passed()
            else:
                self.failed()
        return [
            "var targetForm = ", contentDocument[target], ";",
            "var postTarget = ", js.targetForm.action, ";",
            [(js.targetForm[key].value, ' = "', value, '";')
            for (key, value) in parameter.items()],
            "addLoadObserver(function () {",
            livepage.handler(
                observePosting,
                contentDocument.location,
                js.postTarget),
            "});",
            js.sendSubmitEvent(js.targetForm, js(callWhenDone))]

    def action_submit(self, action, target, parameter):
        def observeSubmission(client):
            self.passed()
        return self.action_post(action, target, parameter, self._handle.flt([
            "function() {",
                livepage.handler(observeSubmission),
            "}"], quote=False))

    def action_follow(self, action, target, parameter):
        def observeFollowing(client, location, destination):
            if location.endswith(destination):
                self.passed()
            else:
                self.failed()
        return [
            "var theTargetNode = ",
            contentDocument.getElementById(target), ";",
            "var theDestinationAddress = theTargetNode.href;",
            "addLoadObserver(function() {",
            livepage.handler(
                observeFollowing,
                contentDocument.location,
                js.theDestinationAddress),
            "});",
            js.setContentLocation(js.theDestinationAddress)]

    def action_click(self, action, target, parameter):
        def observeClicking(client):
            self.passed()
        return [
            "var theClickObservation = function() {",
            livepage.handler(observeClicking), "};",
            js.sendClickEvent(
                target,
                js.theClickObservation)]

    def action_visit(self, action, target, parameter):
        ## TODO: Figure out how to detect a 404 using javascript
        def observeLoading(client, location):
            if location.endswith(target):
                self.passed()
            else:
                self.failed()

        return ["addLoadObserver(function() {", 
                livepage.handler(
                    observeLoading,
                    contentDocument.location),
                "});",
                js.setContentLocation(target)]

    def action_assert(self, action, target, parameter):
        def observeNodeContents(client, contents):
            if contents == parameter:
                self.passed()
            else:
                self.failed()

        return [livepage.handler(
            observeNodeContents,
            contentDocument.getElementById(target).innerHTML, bubble=True)]

    def action_call(self, action, target, parameter):
        target(self._handle).addCallback(
            lambda result: self.passed()
        ).addErrback(
            lambda result: self.failed())
        return ''

    def drive(self):
        for i, test in enumerate(self.suite):
            self.state = i
            self.action, self.target, self.parameter = test
            yield getattr(self, 'action_%s' % self.action)(*test)
        for notify in self._notifications:
            notify.callback(self.results)

    def notifyWhenTestsComplete(self):
        self._notifications.append(defer.Deferred())
        return self._notifications[-1]

    def nextTest(self):
        try:
            test = self.iterator.next()
        except StopIteration:
            return
        assert self._handle is not None, "nextTest cannot be called before handle is set!"
        self._handle.sendScript(
            self._handle.flt(
                test, quote=False))

    def passed(self):
        self.results[self.state] = True
        self.passes += 1
        self._handle.set(
            'test-passes', self.passes)
        self._handle.sendScript(
            js.passed(self.state))
        self.nextTest()

    def failed(self):
        self.results[self.state] = False
        self.failures += 1
        self._handle.set(
            'test-failures', self.failures)
        self._handle.sendScript(
            js.failed(self.state))
        self.nextTest()


class Tester(livepage.LivePage):
    addSlash = True
    child_css = static.File(os.path.join(resourceDirectory, 'livetest.css'))
    child_scripts = static.File(os.path.join(resourceDirectory, 'livetest.js'))
    child_postscripts = static.File(os.path.join(resourceDirectory, 'livetest-postscripts.js'))
    docFactory = loaders.stan(tags.html[
        tags.head[
            tags.script(src="scripts"),
            tags.link(rel="stylesheet", type="text/css", href="css")],
        tags.body[
            tags.table(id="testprogress")[
                tags.tr[
                    tags.th["Tests"], tags.th["Pass"], tags.th["Fail"]],
                tags.tr[
                    tags.td(id="test-status")["Running"],
                    tags.td(id="test-passes", _class="test-passes")[entities.nbsp],
                    tags.td(id="test-failures", _class="test-failures")[entities.nbsp]]],
            tags.table(id="testresults", render=tags.directive('table'))[
                tags.tr(pattern="item", render=tags.directive('test'))[
                    tags.td[tags.slot('action')], tags.td[tags.slot('target')], tags.td[tags.slot('parameter')]]],
            tags.iframe(id="testframe", src="asdf"),
            tags.script(src="postscripts"),
            livepage.glue]])

    def render_table(self, ctx, suite):
        self.testId = 0
        driver = Driver(suite)
        handle = livepage.IClientHandle(ctx)
        driver.notifyWhenTestsComplete().addCallback(self.testsComplete, handle)
        driver.setHandle(handle)
        driver.nextTest()
        return rend.sequence(ctx, suite)

    def render_test(self, ctx, test):
        ctx.tag(id=("test-", self.testId))
        action, target, parameter = test
        ctx.fillSlots('action', action)
        ctx.fillSlots('target', str(target))
        ctx.fillSlots('parameter', parameter)
        self.testId += 1
        return ctx.tag

    def testsComplete(self, results, handle):
        handle.set('test-status', 'Complete')


def callMe(client):
    d = defer.Deferred()
    def callMePlease(client):
        d.callback('success')

    client.sendScript(client.flt(
        livepage.handler(callMePlease, bubble=True), quote=False))
    return d


class TestTests(rend.Page):
    docFactory = loaders.stan(tags.html[tags.a(href="/testtests/tests/")["Run tests"]])
    child_foo = '<html><body><div id="body">foo</div><form method="POST", name="theForm" action="postTarget"><input name="blah" /></form></body></html>'
    child_bar = "bar"
    child_baz = '<html><body onclick="alert(event.clientX);alert( event.clientY);"><div id="body">toot</div><a id="nextPage" href="foo" onclick="alert(\'clicked\')">Foo</a></body></html>'

    child_clickHandler = """<html>
    <body>
        <a id="theClicker" onclick="this.innerHTML='Clicked'">Click me!</a>
    </body>
</html>"""

    def child_postTarget(self, ctx):
        return rend.Page(docFactory=loaders.stan(tags.html[tags.body(id="body")[str(ctx.arg('blah'))]]))

    def child_tests(self, ctx):
        return self

    child_tests = Tester([
    ('visit', '/testtests/foo', ''),
    ('visit', '/testtests/bar', ''),
    ('visit', '/testtests/baz', ''),
    ('assert', 'body', 'toot'),
    ('follow', 'nextPage', ''),
    ('assert', 'body', 'foo'),
    ('post', 'theForm', dict(blah="blah")),
    ('assert', 'body', 'blah'),
    ('visit', '/testtests/clickHandler', ''),
    ('click', 'theClicker', ''),
    ('assert', 'theClicker', 'Clicked'),
    ('call', callMe, ''),
])


def createResource():
    return TestTests()

