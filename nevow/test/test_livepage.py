
from twisted.trial import unittest

from nevow import livepage, tags, context, events, util


fakeId = 'fake-id'


class TestLive(livepage.ClientHandle):
    def __init__(self):
        self.refreshInterval = 30
        self.targetTimeoutCount = 3
        self.timeoutCount = 0
        self.handleId = 'fake-test'
        self.events = events.EventNotification()
        self.events.nextId = lambda: fakeId
        self.outputBuffer = []
        self.closed = False
        self.closeNotifications = []
        self.firstTime = True

    def sendScript(self, script):
        self.sent = str(script)


class LiveGatherer(TestLive):
    def __init__(self):
        TestLive.__init__(self)
        self.heard = []

    def sendScript(self, script):
        self.heard.append(script)


class Quoting(unittest.TestCase):
    def setUp(self):
        self.livepage = TestLive()
        self.ctx = context.WovenContext()
        self.ctx.remember(self.livepage, livepage.IClientHandle)

    def flt(self, what):
        return livepage.flt(what, quote=False, client=self.livepage)

    def testCall(self):
        self.livepage.call("concat", "1", "2")
        self.assertEqual(self.livepage.sent, "concat('1','2');")
        self.livepage.call("bloop", r"a\b\c")
        self.assertEqual(self.livepage.sent, r"bloop('a\\b\\c');")
        self.livepage.call("zoop", "a'b'c")
        self.assertEqual(self.livepage.sent, r"zoop('a\'b\'c');")
        self.livepage.call("floop", "a\nb\nc")
        self.assertEqual(self.livepage.sent, r"floop('a\nb\nc');")

    def test_callWithJS(self):
        self.livepage.call("add", 1, 2)
        self.assertEqual(self.livepage.sent, "add(1,2);")
        self.livepage.call("amIEvil", True)
        self.assertEqual(self.livepage.sent, "amIEvil(true);")
        self.livepage.call("add", 1.4, 2.4)
        self.assertEqual(self.livepage.sent, "add(1.4,2.4);")
        self.livepage.call('alert', livepage.js('document.title'))
        self.assertEqual(self.livepage.sent, 'alert(document.title);')
        self.livepage.call('alert', livepage.document.title)
        self.assertEqual(self.livepage.sent, 'alert(document.title);')

    def test_callWithStan(self):
        self.livepage.call("replace", tags.span)
        self.assertEqual(self.livepage.sent, "replace('<span />');")

        self.livepage.call('fun', tags.span["'"])
        self.assertEqual(self.livepage.sent, r"fun('<span>\'</span>');")

        self.livepage.call('fun', tags.span["\""])
        self.assertEqual(self.livepage.sent, "fun('<span>\"</span>');")

        self.livepage.call('fun', tags.span["\\"])
        self.assertEqual(self.livepage.sent, r"fun('<span>\\</span>');")

    def test_js(self):
        foo = livepage.js('foo')
        self.livepage.call('alert', foo('1'))
        self.assertEqual(self.livepage.sent, "alert(foo('1'));")
        self.livepage.sendScript(foo(1))
        self.assertEqual(self.livepage.sent, "foo(1)")

        window = livepage.js('window')
        self.livepage.sendScript(window.open('http://google.com'))
        self.assertEqual(self.livepage.sent, "window.open('http://google.com')")
        array = livepage.js('array')
        self.livepage.sendScript(array[5])
        self.assertEqual(self.livepage.sent, "array[5]")
        self.livepage.sendScript(livepage.js[1,2,3])
        self.assertEqual(self.livepage.sent, "[1,2,3]")

    def test_setAndAppend(self):
        for apiName in ['set', 'append']:
            api = getattr(self.livepage, apiName)
            funcName = "nevow_%sNode" % (apiName, )
            api('node', 'value')
            self.assertEqual(self.livepage.sent, funcName + "('node', 'value');")
            api('node', 1)
            self.assertEqual(self.livepage.sent, funcName + "('node', '1');")
            api('node', tags.span["Hello"])
            self.assertEqual(self.livepage.sent, funcName + "('node', '<span>Hello</span>');")
            api('node', livepage.document.title)
            self.assertEqual(self.livepage.sent, funcName + "('node', document.title);")
            api('node', '\\')
            self.assertEqual(self.livepage.sent, funcName + r"('node', '\\');")
            api('node', "'")
            self.assertEqual(self.livepage.sent, funcName + r"('node', '\'');")
            api('node', '"')
            self.assertEqual(self.livepage.sent, funcName + "('node', '\"');")
            api('\\', '')
            self.assertEqual(self.livepage.sent, funcName + "('\\\\', '');")

    def test_alert(self):
        self.livepage.alert('Hello')
        self.assertEqual(self.livepage.sent, "alert('Hello');")
        self.livepage.alert(5)
        self.assertEqual(self.livepage.sent, "alert('5');")
        self.livepage.alert(livepage.document.title)
        self.assertEqual(self.livepage.sent, "alert(document.title);")
        self.livepage.alert('\\')
        self.assertEqual(self.livepage.sent, "alert('\\\\');")
        self.livepage.alert("'")
        self.assertEqual(self.livepage.sent, r"alert('\'');")
        self.livepage.alert('"')
        self.assertEqual(self.livepage.sent, "alert('\"');")

    def test_handler(self):
        result = livepage.handler(onClick)
        self.assertEqual(self.flt(result),
            livepage.ctsTemplate % (fakeId, '', livepage.handledEventPostlude))
        self.livepage.handleInput(fakeId)
        self.assertEqual(self.livepage.sent, 'null;')

    def test_closedOverHandler(self):
        closedOver = 'hello'
        def closuredHandler(client):
            client.sendScript(closedOver)

        ## We have to "render" the result because the event handler has to be
        ## subscribed to at render time.
        result = livepage.handler(closuredHandler)(self.ctx, None)
        ## The closured handler will have been assigned a unique id.
        self.assertEqual(result.content,
            livepage.ctsTemplate % (fakeId, '', livepage.handledEventPostlude))

        self.livepage.handleInput(fakeId)
        self.assertEqual(self.livepage.sent, 'hello')

    def test_handlerWithArgs(self):
        options = [
            dict(bubble=True, outsideAttribute=True),
            dict(bubble=False, outsideAttribute=True),
            dict(bubble=False, outsideAttribute=False),
            dict(bubble=True, outsideAttribute=False)]

        for opts in options:
            if opts['bubble']:
                postlude = ''
            else:
                postlude = livepage.handledEventPostlude

            self.assertEqual(
                self.flt(livepage.handler(argsHandler, 'hello', **opts)),
                livepage.ctsTemplate % (fakeId, ",'hello'", postlude))

            self.assertEqual(
                self.flt(livepage.handler(argsHandler, "'", **opts)),
                livepage.ctsTemplate % (fakeId, ",'\\''", postlude))

            self.assertEqual(
                self.flt(livepage.handler(argsHandler, "\\", **opts)),
                livepage.ctsTemplate % (fakeId, ",'\\\\'", postlude))

            self.assertEqual(
                self.flt(livepage.handler(argsHandler, "\n", **opts)),
                livepage.ctsTemplate % (fakeId, ",'\\n'", postlude))

    def test_handlerWithArgsQuoting(self):
        self.assertEqual(
            self.flt(livepage.handler(argsHandler, '"')),
            livepage.ctsTemplate % (fakeId, ",'&quot;'", livepage.handledEventPostlude))

        self.assertEqual(
            self.flt(livepage.handler(argsHandler, '&')),
            livepage.ctsTemplate % (fakeId, ",'&amp;'", livepage.handledEventPostlude))

    def test_outsideAttributeArgsQuoting(self):
        self.assertEqual(
           self.flt( livepage.handler(argsHandler, '"', outsideAttribute=True)),
            livepage.ctsTemplate % (fakeId, ",'\"'", livepage.handledEventPostlude))

        self.assertEqual(
            self.flt(livepage.handler(argsHandler, '&', outsideAttribute=True)),
            livepage.ctsTemplate % (fakeId, ",'&'", livepage.handledEventPostlude))

    def test_bubble(self):
        self.assertEqual(
            self.flt(livepage.handler(onClick, bubble=True)),
            livepage.ctsTemplate % (fakeId, '', ''))

    def test_handlerWithIdentifier(self):
        gatherer = LiveGatherer()
        ctx = context.WovenContext()
        ctx.remember(gatherer, livepage.IClientHandle)

        oneQual = util.qual(oneHandler)
        twoQual = util.qual(twoHandler)

        ## Subscribe both handlers to the same identifier
        livepage.handler(oneHandler, identifier='same')(ctx, None)
        livepage.handler(twoHandler, identifier='same')(ctx, None)

        gatherer.handleInput('same')

        self.assertEqual(gatherer.heard, ['one', 'two'])

    def test_decoratorLike(self):
        decorator = livepage.handler(livepage.document)
        self.assertEqual(
            self.flt(decorator(argsHandler)),
            livepage.ctsTemplate % (fakeId, ',document', livepage.handledEventPostlude))


def onClick(client):
    client.sendScript('null;')


def argsHandler(client, *args):
    client.sendScript(','.join(args))


def oneHandler(client):
    client.sendScript('one')


def twoHandler(client):
    client.sendScript('two')

