#!/usr/bin/env python
"""Makes sure configParser does what it's surposed to

Copyright 2005 Matthew Sherborne. All rights reserved.

Released under the GPL2 license found at
http://www.fsf.org/licensing/licenses/gpl.txt
"""

import unittest
from exe.engine.configparser import ConfigParser, Section
from StringIO import StringIO
from pprint import pprint
import sys, os

TEST_TEXT = ('nosection=here\n'
             '[main]\n'
             'level=5\n'
             'power : on\t\n'
             'testing= false\n'
             'running =on\t\xc4\x80\xc4\x900   \n'
             ' two words = \tare better than one\t   \n'
             'no_value = \n'
             '\n'
             '\n'
             '[second]\n'
             'good :yes\n'
             ' bad:\tno\n'
             '# comment=1\n'
             '~comment2=2\n'
             ' available\t=   yes\n'
             'funny-name_mate: crusty the clown')


class TestConfigParser(unittest.TestCase):
    """
    Tests the main ConfigParser class
    """

    def setUp(self):
        """
        Creates a ConfigParser to play with
        """
        self.c = ConfigParser()

    def testRead(self):
        """Ensures that it can read from a file correctly"""
        file_ = StringIO(TEST_TEXT)
        self.c.read(file_)
        assert self.c._sections == {'second':
                                       {'good': 'yes',
                                        'bad': 'no',
                                         'available': 'yes',
                                         'funny-name_mate': 'crusty the clown'}, 
                                    'main': 
                                        {'running': 'on\t\xc4\x80\xc4\x900',
                                         'testing': 'false',
                                         'two words': 'are better than one',
                                         'no_value': '',
                                         'power': 'on', 'level': '5'}
                                    }, self.c._sections

    def testReadFileName(self):
        """Can read text"""
        goodDict = {'second': 
                        {'good': 'yes',
                         'bad': 'no',
                          'available': 'yes',
                          'funny-name_mate': 'crusty the clown'}, 
                    'main': 
                        {'running': 'on\t\xc4\x80\xc4\x900',
                         'testing': 'false',
                         'two words': 'are better than one',
                         'no_value': '',
                         'power': 'on',
                         'level': '5'}}
        file_ = open('temp.ini', 'w')
        file_.write(TEST_TEXT)
        file_.close()
        self.c.read('temp.ini')
        assert self.c._sections == goodDict, self.c._sections
        # Can read unicode filenames
        self.c = ConfigParser()
        self.c.read(u'temp.ini')
        assert self.c._sections == goodDict, self.c._sections
        # Can read funny string object filenames
        class MyStr(str):
            """Simply overrides string to make it a different type"""
        self.c.read(MyStr('temp.ini'))
        assert self.c._sections == goodDict, self.c._sections

    def testWrite(self):
        """Test that it writes the file nicely"""
        file_ = StringIO(TEST_TEXT)
        self.c.read(file_)
        # Remove an option
        del self.c._sections['main']['testing']
        # Change an option
        self.c._sections['second']['bad'] = 'definately not!   '
        # Add an option
        self.c._sections['second']['squishy'] = 'Indeed'
        # Add a section at the end
        self.c._sections['middle'] = {'is here': 'yes'}
        # write the file
        file_.seek(0)
        self.c.write(file_)
        file_.seek(0)
        result = file_.readlines()
        goodResult = ['nosection=here\n',
                      '[main]\n',
                      'level=5\n',
                      'power : on\n',
                      'running =on\t\xc4\x80\xc4\x900\n',
                      'two words = \tare better than one\n',
                      'no_value = \n',
                      '\n', '\n',
                      '[second]\n',
                      'good :yes\n',
                      'bad:\tdefinately not!   \n',
                      '# comment=1\n',
                      '~comment2=2\n',
                      'available\t=   yes\n',
                      'funny-name_mate: crusty the clown\n',
                      'squishy = Indeed\n',
                      '\n',
                      '[middle]\n',
                      'is here = yes']
        if result != goodResult:
            pprint(zip(goodResult, result))
            pprint(result)
            self.fail('See above printout')

    def testWriteNewFile(self):
        """Shouldn't have any trouble writing a write only file"""
        file_ = open('temp.ini', 'w')
        self.c.set('main', 'testing', 'de repente')
        self.c.write(file_)
        file_.close()
        file_ = open('temp.ini')
        try:
            data = file_.read()
            assert data == '[main]\ntesting = de repente', data
        finally:
            file_.close()
            os.remove('temp.ini')

    def testWriteFromFileName(self):
        """If we pass write a file name, it should open or create that file
        and write or update it"""
        if os.path.exists('temp.ini'):
            os.remove('temp.ini')
        self.c.set('main', 'testing', 'de repente')
        self.c.write('temp.ini')
        file_ = open('temp.ini')
        try:
            data = file_.read()
            assert data == '[main]\ntesting = de repente', data
        finally:
            file_.close()
            os.remove('temp.ini')
        # Test updating an existing file
        self.c.set('main', 'testing', 'ok')
        self.c.write('temp.ini')
        file_ = open('temp.ini')
        try:
            data = file_.read()
            assert data == '[main]\ntesting = ok', data
        finally:
            file_.close()
            os.remove('temp.ini')

    def testGet(self):
        """Tests the get method"""
        file_ = StringIO(TEST_TEXT)
        self.c.read(file_)
        assert self.c.get('main', 'testing') == 'false'
        assert self.c.get('main', 'not exists', 'default') == 'default'
        self.failUnlessRaises(ValueError, self.c.get, 'main', 'not exists')

    def testSet(self):
        """Test the set method"""
        file_ = StringIO(TEST_TEXT)
        self.c.read(file_)
        # An existing option
        self.c.set('main', 'testing', 'perhaps')
        assert self.c._sections['main']['testing'] == 'perhaps'
        # A new and numeric option
        self.c.set('main', 'new option', 4.1)
        assert self.c._sections['main']['new option'] == '4.1'
        # A new option in a new section
        self.c.set('new section', 'new option', 4.1)
        assert self.c._sections['new section']['new option'] == '4.1'

    def testDel(self):
        """Should be able to delete a section and/or a value in a section"""
        file_ = StringIO(TEST_TEXT)
        self.c.read(file_)
        assert self.c._sections['main']['level'] == '5'
        self.c.delete('main', 'level')
        assert not self.c._sections['main'].has_key('level')
        self.c.delete('main')
        assert not self.c._sections.has_key('main')

    def testShortening(self):
        """There was a bug (Issue 66) where when a longer name was read
        and a shorter name was written, the extra characters of the 
        longer name would remain in the entry"""
        file_ = open('temp.ini', 'w')
        file_.write(TEST_TEXT)
        file_.close()
        self.c.read('temp.ini')
        self.c.set('second', 'available', 'abcdefghijklmnop')
        self.c.write('temp.ini')
        c2 = ConfigParser()
        c2.read('temp.ini')
        c2.set('second', 'available', 'short')
        c2.write('temp.ini')
        self.c.read('temp.ini')
        assert self.c.get('second', 'available', '') == 'short', \
            self.c.get('second', 'available', '')

class TestAutoWrite(unittest.TestCase):
    """
    Tests the autowrite feature
    Should remember where the file was last written or read
    and be able to autowrite new changes there.
    But should ignore autoWrite if compatible file is not available
    """

    def testStringIO(self):
        file_ = StringIO(TEST_TEXT)
        c = ConfigParser()
        c.read(file_)
        c.autoWrite = True
        assert 'Matthew' not in file_.getvalue()
        c.main.name = 'Matthew'
        assert 'name = Matthew' in file_.getvalue(), file_.getvalue()
        del c.main.name
        assert 'Matthew' not in file_.getvalue()
        

class TestSections(unittest.TestCase):
    """
    Tests Section objects.
    Section objects allow an easy way to read and write
    """

    def setUp(self):
        """
        Creates a ConfigParser to play with and
        reads in the test text
        """
        self.c = ConfigParser()
        file_ = StringIO(TEST_TEXT)
        self.c.read(file_)

    def testSectionCreation(self):
        """
        Tests that the configuration object
        creates the section objects ok
        """
        assert isinstance(self.c.main, Section)
        assert isinstance(self.c.second, Section)
        self.failUnlessRaises(AttributeError, lambda: self.c.notexist)

    def testFromScratch(self):
        """
        Tests adding stuff from nothing
        """
        x = ConfigParser()
        testing = x.addSection('testing')
        assert x.testing is testing
        testing.myval = 4
        assert x.get('testing', 'myval') == '4'

    def testAttributeRead(self):
        """
        Tests that we can read attributes from sections
        """
        assert self.c.main.level == '5'
        assert self.c.main.power == 'on'
        self.failUnlessRaises(AttributeError, lambda: self.c.main.notexist)

    def testAttributeWrite(self):
        """
        Tests that we can set attributes with sections
        """
        self.c.main.level = 7
        # Should be automatically converted to string also :)
        assert self.c.get('main', 'level') == '7'
        self.c.main.new = 'hello'
        assert self.c.get('main', 'new') == 'hello'

    def testAttributeDel(self):
        """
        Tests that we can remove attributes from the config file
        by removing the sections
        """
        del self.c.main.level
        assert not self.c.has_option('main', 'level')

    def testSectionDel(self):
        """
        Tests that we can remove whole sections
        by deleting them
        """
        del self.c.main
        assert not self.c.has_section('main')
        def delete(): del self.c.notexist
        self.failUnlessRaises(AttributeError, delete)

    def testParserIn(self):
        """
        To test if a section exists, use the in operator
        """
        assert 'main' in self.c
        assert 'notexist' not in self.c
        # Dotted format
        assert 'main.level' in self.c
        assert 'main.notexist' not in self.c
        # And the sections can do it too
        assert 'notexist' not in self.c.main
        # Also the hasattr should give the same result
        assert hasattr(self.c, 'main')
        assert not hasattr(self.c, 'notexist')
        assert hasattr(self.c, 'main.level')
        assert hasattr(self.c.main, 'level')
        assert not hasattr(self.c.main, 'notexist')

    def testGet(self):
        """
        System should have a get section for those funny
        names that can't be attributes
        """
        assert self.c.second.get('funny-name_mate') == 'crusty the clown'

    def testCreation(self):
        """
        When one creates a section with the same name
        as an existing section the existing section should
        just be returned
        """
        mysec = Section('main', self.c)
        assert mysec is self.c.main
        othersec = Section('main', self.c)
        assert othersec is mysec is self.c.main is self.c._sections['main']
        newsec = Section('newsection', self.c)
        assert newsec is \
               self.c.addSection('newsection') is \
               self.c.newsection is \
               self.c._sections['newsection']
        newsec2 = self.c.addSection('newsection2')
        assert newsec2 is \
               self.c.addSection('newsection2') is \
               Section('newsection2', self.c) is \
               self.c.newsection2 is \
               self.c._sections['newsection2'] and \
               newsec2 is not newsec
        # Different parent should create new object
        otherConf = ConfigParser()
        sec1 = otherConf.addSection('x')
        sec2 = self.c.addSection('x')
        assert sec1 is not sec2

    def testDynamicDefaultValues(self):
        """
        Should be able to set the default value.
        Default default is to raise ValueError or AttributeError
        """
        # Default default behaviour
        self.failUnlessRaises(ValueError, self.c.get, 'main', 'not exists')
        self.failUnlessRaises(AttributeError, lambda: self.c.main.notexists)
        self.failUnlessRaises(AttributeError, lambda: self.c.notexists.notexists)
        # Try with default as None
        self.c.defaultValue = None
        assert self.c.get('main', 'not exists') is None, self.c.get('main', 'not exists')
        assert self.c.main.notexists is None
        self.failUnlessRaises(AttributeError, lambda: self.c.notexists.notexists) # This cannot be helped
        # Try with a string default
        self.c.defaultValue = 'Happy Face'
        assert self.c.get('main', 'not exists') == 'Happy Face'
        assert self.c.main.notexists == 'Happy Face'
        # Now try with a callable default!. Freaky!
        self.c.defaultValue = lambda opt, val: '%s.%s' % (opt, val)
        assert self.c.get('main', 'not exists') == 'main.not exists'
        assert self.c.main.notexists == 'main.notexists'
        assert self.c.second.notexists == 'second.notexists'



    
if __name__ == '__main__':
    unittest.main()
