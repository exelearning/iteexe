
# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.


from twisted.trial import unittest
from twisted.python import usage
import string

class WellBehaved(usage.Options):
    optParameters = [['long', 'w', 'default', 'and a docstring'],
                     ['another', 'n', 'no docstring'],
                     ['longonly', None, 'noshort'],
                     ['shortless', None, 'except',
                      'this one got docstring'],
                  ]
    optFlags = [['aflag', 'f',
                 """

                 flagallicious docstringness for this here

                 """],
                ['flout', 'o'],
                ]

    def opt_myflag(self):
        self.opts['myflag'] = "PONY!"

    def opt_myparam(self, value):
        self.opts['myparam'] = "%s WITH A PONY!" % (value,)


class ParseCorrectnessTest(unittest.TestCase):
    """Test Options.parseArgs for correct values under good conditions.
    """
    def setUp(self):
        """Instantiate and parseOptions a well-behaved Options class.
        """

        self.niceArgV = string.split("--long Alpha -n Beta "
                                     "--shortless Gamma -f --myflag "
                                     "--myparam Tofu")

        self.nice = WellBehaved()

        self.nice.parseOptions(self.niceArgV)

    def test_checkParameters(self):
        """Checking that parameters have correct values.
        """
        self.assertEqual(self.nice.opts['long'], "Alpha")
        self.assertEqual(self.nice.opts['another'], "Beta")
        self.assertEqual(self.nice.opts['longonly'], "noshort")
        self.assertEqual(self.nice.opts['shortless'], "Gamma")

    def test_checkFlags(self):
        """Checking that flags have correct values.
        """
        self.assertEqual(self.nice.opts['aflag'], 1)
        self.assertEqual(self.nice.opts['flout'], 0)

    def test_checkCustoms(self):
        """Checking that custom flags and parameters have correct values.
        """
        self.assertEqual(self.nice.opts['myflag'], "PONY!")
        self.assertEqual(self.nice.opts['myparam'], "Tofu WITH A PONY!")

class InquisitionOptions(usage.Options):
    optFlags = [
        ('expect', 'e'),
        ]
    optParameters = [
        ('torture-device', 't',
         'comfy-chair',
         'set preferred torture device'),
        ]

class HolyQuestOptions(usage.Options):
    optFlags = [('horseback', 'h',
                 'use a horse'),
                ('for-grail', 'g'),
                ]

class SubCommandOptions(usage.Options):
    optFlags = [('europian-swallow', None,
                 'set default swallow type to Europian'),
                ]
    subCommands = [
        ('inquisition', 'inquest', InquisitionOptions, 'Perform an inquisition'),
        ('holyquest', 'quest', HolyQuestOptions, 'Embark upon a holy quest'),
        ]

class SubCommandTest(unittest.TestCase):

    def test_simpleSubcommand(self):
        o=SubCommandOptions()
        o.parseOptions(['--europian-swallow', 'inquisition'])
        self.assertEqual(o['europian-swallow'], True)
        self.assertEqual(o.subCommand, 'inquisition')
        self.assertTrue(isinstance(o.subOptions, InquisitionOptions))
        self.assertEqual(o.subOptions['expect'], False)
        self.assertEqual(o.subOptions['torture-device'], 'comfy-chair')

    def test_subcommandWithFlagsAndOptions(self):
        o=SubCommandOptions()
        o.parseOptions(['inquisition', '--expect', '--torture-device=feather'])
        self.assertEqual(o['europian-swallow'], False)
        self.assertEqual(o.subCommand, 'inquisition')
        self.assertTrue(isinstance(o.subOptions, InquisitionOptions))
        self.assertEqual(o.subOptions['expect'], True)
        self.assertEqual(o.subOptions['torture-device'], 'feather')

    def test_subcommandAliasWithFlagsAndOptions(self):
        o=SubCommandOptions()
        o.parseOptions(['inquest', '--expect', '--torture-device=feather'])
        self.assertEqual(o['europian-swallow'], False)
        self.assertEqual(o.subCommand, 'inquisition')
        self.assertTrue(isinstance(o.subOptions, InquisitionOptions))
        self.assertEqual(o.subOptions['expect'], True)
        self.assertEqual(o.subOptions['torture-device'], 'feather')

    def test_anotherSubcommandWithFlagsAndOptions(self):
        o=SubCommandOptions()
        o.parseOptions(['holyquest', '--for-grail'])
        self.assertEqual(o['europian-swallow'], False)
        self.assertEqual(o.subCommand, 'holyquest')
        self.assertTrue(isinstance(o.subOptions, HolyQuestOptions))
        self.assertEqual(o.subOptions['horseback'], False)
        self.assertEqual(o.subOptions['for-grail'], True)

    def test_noSubcommand(self):
        o=SubCommandOptions()
        o.parseOptions(['--europian-swallow'])
        self.assertEqual(o['europian-swallow'], True)
        self.assertEqual(o.subCommand, None)
        self.assertFalse(hasattr(o, 'subOptions'))

    def test_defaultSubcommand(self):
        o=SubCommandOptions()
        o.defaultSubCommand = 'inquest'
        o.parseOptions(['--europian-swallow'])
        self.assertEqual(o['europian-swallow'], True)
        self.assertEqual(o.subCommand, 'inquisition')
        self.assertTrue(isinstance(o.subOptions, InquisitionOptions))
        self.assertEqual(o.subOptions['expect'], False)
        self.assertEqual(o.subOptions['torture-device'], 'comfy-chair')

    def test_subCommandParseOptionsHasParent(self):
        class SubOpt(usage.Options):
            def parseOptions(self, *a, **kw):
                self.sawParent = self.parent
                usage.Options.parseOptions(self, *a, **kw)
        class Opt(usage.Options):
            subCommands = [
                ('foo', 'f', SubOpt, 'bar'),
                ]
        o=Opt()
        o.parseOptions(['foo'])
        self.assertTrue(hasattr(o.subOptions, 'sawParent'))
        self.assertEqual(o.subOptions.sawParent , o)

    def test_subCommandInTwoPlaces(self):
        """The .parent pointer is correct even when the same Options class is used twice."""
        class SubOpt(usage.Options):
            pass
        class OptFoo(usage.Options):
            subCommands = [
                ('foo', 'f', SubOpt, 'quux'),
                ]
        class OptBar(usage.Options):
            subCommands = [
                ('bar', 'b', SubOpt, 'quux'),
                ]
        oFoo=OptFoo()
        oFoo.parseOptions(['foo'])
        oBar=OptBar()
        oBar.parseOptions(['bar'])
        self.assertTrue(hasattr(oFoo.subOptions, 'parent'))
        self.assertTrue(hasattr(oBar.subOptions, 'parent'))
        self.failUnlessIdentical(oFoo.subOptions.parent, oFoo)
        self.failUnlessIdentical(oBar.subOptions.parent, oBar)

class HelpStringTest(unittest.TestCase):
    def setUp(self):
        """Instantiate a well-behaved Options class.
        """

        self.niceArgV = string.split("--long Alpha -n Beta "
                                     "--shortless Gamma -f --myflag "
                                     "--myparam Tofu")

        self.nice = WellBehaved()

    def test_noGoBoom(self):
        """__str__ shouldn't go boom.
        """

        try:
            self.nice.__str__()
        except Exception as e:
            self.fail(e)

    def test_whitespaceStripFlagsAndParameters(self):
        """Extra whitespace in flag and parameters docs is stripped"""
        # We test this by making sure aflag and it's help string are on the same line.
        lines = [s for s in str(self.nice).splitlines() if s.find("aflag")>=0]
        self.assertTrue(len(lines) > 0)
        self.assertTrue(lines[0].find("flagallicious") >= 0)

if __name__ == '__main__':
    unittest.main()
