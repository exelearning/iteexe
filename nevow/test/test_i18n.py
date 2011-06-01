from twisted.trial import unittest
from cStringIO import StringIO
from nevow import inevow, flat, context, tags, loaders, rend
from nevow import i18n

def mockTranslator(s, domain=None):
    args = {}
    if domain is not None:
        args['domain'] = domain
    return 'MOCK(%s)[%s]' % (', '.join(['%s=%r' % (k,v)
                                        for k,v in args.items()]),
                             s)

class Misc(unittest.TestCase):
    def test_simple(self):
        s = i18n._('foo')

    def test_simple_flat(self):
        s = i18n._('foo')
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, 'foo')

    def test_translator(self):
        _ = i18n.Translator(translator=mockTranslator)
        s = _('foo')
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, 'MOCK()[foo]')

class Config(unittest.TestCase):
    def test_remember(self):
        ctx = context.WebContext()
        cfg = i18n.I18NConfig(domain='foo')
        ctx.remember(cfg)

class Domain(unittest.TestCase):
    def test_classInit(self):
        _ = i18n.Translator(translator=mockTranslator,
                            domain='bar')
        s = _('foo')
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, "MOCK(domain='bar')[foo]")

    def test_runTime(self):
        _ = i18n.Translator(translator=mockTranslator)
        s = _('foo', domain='baz')
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, "MOCK(domain='baz')[foo]")

    def test_context(self):
        _ = i18n.Translator(translator=mockTranslator)
        ctx = context.WebContext()
        cfg = i18n.I18NConfig(domain='thud')
        ctx.remember(cfg)
        s = _('foo')
        r = flat.ten.flatten(s, ctx)
        self.assertEquals(r, "MOCK(domain='thud')[foo]")

    def test_runTime_beats_all(self):
        _ = i18n.Translator(translator=mockTranslator,
                            domain='not-used1')
        ctx = context.WebContext()
        cfg = i18n.I18NConfig(domain='not-used2')
        ctx.remember(cfg)
        s = _('foo', domain='baz')
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, "MOCK(domain='baz')[foo]")


    def test_classInit_beats_context(self):
        _ = i18n.Translator(translator=mockTranslator,
                            domain='baz')
        ctx = context.WebContext()
        cfg = i18n.I18NConfig(domain='not-used')
        ctx.remember(cfg)
        s = _('foo')
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, "MOCK(domain='baz')[foo]")

class Format(unittest.TestCase):
    def test_simple(self):
        _ = i18n.Translator(translator=mockTranslator)
        s = _('foo %s') % 'bar'
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, "MOCK()[foo bar]")

    def test_multiple(self):
        _ = i18n.Translator(translator=mockTranslator)
        s = _('foo %s')
        s = s % 'bar %s'
        s = s % 'baz'
        r = flat.ten.flatten(s, None)
        self.assertEquals(r, "MOCK()[foo bar baz]")

class FakeRequest(object):
    __implements__ = inevow.IRequest,
    def __init__(self, headers):
        self.headers = headers
    def getHeader(self, key):
        return self.headers.get(key, None)

class Languages(unittest.TestCase):
    def test_noLanguages(self):
        request = FakeRequest(headers={})
        ctx = context.RequestContext(tag=request)
        r = inevow.ILanguages(ctx)
        self.assertEquals(r, [])

    def test_oneLanguage(self):
        request = FakeRequest(headers={
            'accept-language': 'fo',
            })
        ctx = context.RequestContext(tag=request)
        r = inevow.ILanguages(ctx)
        self.assertEquals(r, ['fo'])

    def test_multipleLanguages(self):
        request = FakeRequest(headers={
            'accept-language': 'fo,ba,th',
            })
        ctx = context.RequestContext(tag=request)
        r = inevow.ILanguages(ctx)
        self.assertEquals(r, ['fo', 'ba', 'th'])

    def test_quality_simple(self):
        request = FakeRequest(headers={
            'accept-language': 'fo;q=0.4',
            })
        ctx = context.RequestContext(tag=request)
        r = inevow.ILanguages(ctx)
        self.assertEquals(r, ['fo'])

    def test_quality_sort(self):
        request = FakeRequest(headers={
            'accept-language': 'fo;q=0.4,ba;q=0.2,xy;q=0.9',
            })
        ctx = context.RequestContext(tag=request)
        r = inevow.ILanguages(ctx)
        self.assertEquals(r, ['xy', 'fo', 'ba'])

    def test_quality_invalid_notQ(self):
        request = FakeRequest(headers={
            'accept-language': 'fo;q=0.4,ba;z=0.2',
            })
        ctx = context.RequestContext(tag=request)
        r = inevow.ILanguages(ctx)
        self.assertEquals(r, ['ba', 'fo'])

    def test_quality_invalid_notFloat(self):
        request = FakeRequest(headers={
            'accept-language': 'fo;q=0.4,ba;q=junk',
            })
        ctx = context.RequestContext(tag=request)
        r = inevow.ILanguages(ctx)
        self.assertEquals(r, ['ba', 'fo'])

class Render(unittest.TestCase):
    def makePage(self, content):
        _ = i18n.Translator(translator=mockTranslator)
        page = rend.Page(
            docFactory=loaders.stan(tags.invisible(render=tags.directive('i18n'))[content]))
        page.render_i18n = i18n.render(_)
        doc = page.docFactory.load()
        ctx = context.WovenContext(context.PageContext(tag=page),
                                   tags.invisible[doc])
        page.rememberStuff(ctx)

        io = StringIO()
        writer = io.write

        def finisher(result):
            return io.getvalue()

        d = page.flattenFactory(doc, ctx, writer, finisher)
        r = unittest.deferredResult(d, 1)
        return r

    def test_empty(self):
        r = self.makePage([''])
        self.assertEquals(r, 'MOCK()[]')

    def test_simple(self):
        r = self.makePage(['foo'])
        self.assertEquals(r, 'MOCK()[foo]')

    def test_stan(self):
        r = self.makePage([tags.p['You should really avoid tags in i18n input.']])
        self.assertEquals(r, 'MOCK()[<p>You should really avoid tags in i18n input.</p>]')

class InterpolateTests:
    def test_mod_string(self):
        self.check('foo %s', 'bar',
                   'foo bar')

    def test_mod_unicode(self):
        self.check('foo %s', u'bar',
                   'foo bar')

    # Tuples are a special case, 'foo %s' % ('bar', 'baz') does not
    # work. Also, 'foo %s %s' only works with tuples.

    def test_mod_tuple_two(self):
        self.check('foo %s %s', ('bar', 'baz'),
                   "foo bar baz")

    def test_mod_tuple_complex(self):
        self.check('foo %s %s %s', ([1, 2], (3, 4), {5: 6}),
                   "foo [1, 2] (3, 4) {5: 6}")

    def test_mod_list_stringify(self):
        self.check('foo %s', ['bar', 'baz'],
                   "foo ['bar', 'baz']")

    def test_mod_list_reprify(self):
        self.check('foo %r', ['bar', 'baz'],
                   "foo ['bar', 'baz']")

    def test_mod_dict_stringify(self):
        self.check('foo %s', {'bar': 1, 'baz': 2},
                   "foo {'bar': 1, 'baz': 2}",
                   "foo {'baz': 2, 'bar': 1}")

    def test_mod_dict_reprify(self):
        self.check('foo %r', {'bar': 1, 'baz': 2},
                   "foo {'bar': 1, 'baz': 2}",
                   "foo {'baz': 2, 'bar': 1}")

    def test_mod_dict_two(self):
        self.check('foo %(bar)s %(baz)s', {'bar': 1, 'baz': 2},
                   "foo 1 2")

class InterpolateMixin:
    def setUp(self):
        self._ = i18n.Translator(translator=mockTranslator)

    def mangle(self, s):
        raise NotImplementedError, 'override mangle somewhere'

    def check(self, fmt, args, *wants):
        got = self.mangle(self._(fmt) % args)
        self.failUnlessIn(got, wants)

class Repr(InterpolateMixin, unittest.TestCase, InterpolateTests):
    def mangle(self, s):
        return repr(s)

    def check(self, fmt, args, *wants):
        InterpolateMixin.check(self, fmt, args,
                               "PlaceHolder(translator=%r, original=%r) %% %r" % \
                               (mockTranslator, fmt, args))

class Str(InterpolateMixin, unittest.TestCase, InterpolateTests):
    def mangle(self, s):
        return str(s)

    def check(self, fmt, args, *wants):
        InterpolateMixin.check(self, fmt, args,
                               "PlaceHolder(translator=%r, original=%r) %% %r" % \
                               (mockTranslator, fmt, args))

class Interpolation(InterpolateMixin, unittest.TestCase, InterpolateTests):
    def mangle(self, s):
        r = flat.ten.flatten(s, None)
        return r

    def check(self, fmt, args, *wants):
        InterpolateMixin.check(self, fmt, args,
                               *['MOCK()[%s]' % x for x in wants])

