#!/usr/bin/env python
#-*- coding: utf-8 -*-

"""
path.py - An object representing a path to a file or directory.

Example:

from path import Path
d = Path('/home/guido/bin')
for file_ in d.files('*.py'):
    file_.chmod(0755)

This module requires Python 2.2 or later.

Licensed under GPL.

URL:     http://www.jorendorff.com/articles/python/path
Author:  Jason Orendorff <jason@jorendorff.com> (and others - see the url!)
Date:    7 Mar 2004
"""


# TODO
#   - Bug in write_text().  It doesn't support Universal newline mode.
#   - Better error message in listdir() when self isn't a
#     directory. (On Windows, the error message really sucks.)
#   - Make sure everything has a good docstring.
#   - Add methods for regex find and replace.
#   - guess_content_type() method?
#   - Perhaps support arguments to touch().
#   - Could add split() and join() methods that generate warnings.
#   - Note:  __add__() technically has a bug, I think, where
#     it doesn't play nice with other types that implement
#     __radd__().  Test this.

from __future__ import generators

import sys, os, fnmatch, glob, shutil, codecs
try:
        import hashlib
except ImportError:
        import md5 as hashlib
from tempfile import mkdtemp
import logging
log = logging.getLogger(__name__)

__version__ = '2.0.4'
__all__ = ['Path', 'TempDirPath']

# Universal newline support
_textmode = 'r'
if hasattr(file, 'newlines'):
    _textmode = 'U'

def getFileSystemEncoding():
    """
    Returns file system default encoding name,
    eg. Ascii, mbcs, utf-8, etc...
    """
    encoding = sys.getfilesystemencoding()
    if encoding is None:
        return 'utf-8'
    else:
        return encoding


class Path(unicode):
    """ Represents a filesystem Path.

    For documentation on individual methods, consult their
    counterparts in os.path.
    """

    # --- Special Python methods.

    fileSystemEncoding = getFileSystemEncoding()

    def __new__(cls, filename=u'', encoding=None):
        """
        Gently converts the filename to unicode
        """
        if encoding is None:
            encoding = Path.fileSystemEncoding

        if os.name == 'nt' and len(filename) >= 256: # Fix MAX_PATH limit in windows
            device_namespace_prefix = '\\\\?\\'
            if filename[:4] != device_namespace_prefix:
                filename = device_namespace_prefix+filename
        
        return unicode.__new__(cls, toUnicode(filename, encoding))

    def __repr__(self):
        return 'Path(%s)' % unicode.__repr__(self)

    def __str__(self):
        return self.encode(Path.fileSystemEncoding)

    # Adding a Path and a string yields a Path.
    def __add__(self, more):
        return Path(toUnicode(self) + toUnicode(more))

    def __radd__(self, other):
        return Path(toUnicode(other) + toUnicode(self))

    # The / operator joins paths.
    def __div__(self, rel):
        """ fp.__div__(rel) == fp / rel == fp.joinpath(rel)

        Join two Path components, adding a separator character if
        needed.
        """
        return Path(os.path.join(toUnicode(self), toUnicode(rel)))

    # Make the / operator work even when true division is enabled.
    __truediv__ = __div__

    @staticmethod
    def getcwd():
        """ Return the current working directory as a path object. """
        return Path(os.getcwd())

    # --- Operations on path strings.

    def abspath(self):
        """Wraps os.path.abspath"""
        return Path(os.path.abspath(self))
    def normcase(self):
        """Wraps os.path.normcase"""
        return Path(os.path.normcase(self))
    def normpath(self):
        """Wraps os.path.normpath"""
        return Path(os.path.normpath(self))
    def realpath(self):
        """Wraps os.path.realpath"""
        return Path(os.path.realpath(self))
    def expanduser(self):
        """Wraps os.path.expanduser"""
        return Path(os.path.expanduser(self))
    def expandvars(self):
        """Wraps os.path.expandvars"""
        return Path(os.path.expandvars(self))
    def dirname(self):
        """Wraps os.path.dirname"""
        return Path(os.path.dirname(self))
    def basename(self):
        """Wraps os.path.basename"""
        return Path(os.path.basename(self))

    def expand(self):
        """ Clean up a filename by calling expandvars(),
        expanduser(), and normpath() on it.

        This is commonly everything needed to clean up a filename
        read from a configuration file, for example.
        """
        return self.expandvars().expanduser().normpath()

    def _get_namebase(self):
        """Returns everything before the . in the extension"""
        return Path(os.path.splitext(self.name)[0])

    def _get_ext(self):
        """Returns the extension only (including the dot)"""
        return os.path.splitext(toUnicode(self))[1]

    def _get_drive(self):
        """Returns the drive letter (in dos & win)"""
        drive = os.path.splitdrive(self)[0]
        return Path(drive)

    parent = property(
        dirname, None, None,
        """ This path's parent directory, as a new path object.

        For example,
        Path('/usr/local/lib/libpython.so').parent == Path('/usr/local/lib')
        """)

    name = property(
        basename, None, None,
        """ The name of this file or directory without the full path.

        For example, Path('/usr/local/lib/libpython.so').name == 'libpython.so'
        """)

    namebase = property(
        _get_namebase, None, None,
        """ The same as path.name, but with one file extension stripped off.

        For example,
            Path('/home/guido/python.tar.gz').name     == 'python.tar.gz',
        but Path('/home/guido/python.tar.gz').namebase == 'python.tar'
        """)

    ext = property(
        _get_ext, None, None,
        """ The file extension, for example '.py'. """)

    drive = property(
        _get_drive, None, None,
        """ The drive specifier, for example 'C:'.
        This is always empty on systems that don't use drive specifiers.
        """)

    def splitpath(self):
        """ p.splitpath() -> Return (p.parent, p.name). """
        parent, child = os.path.split(self)
        return Path(parent), Path(child)

    def splitdrive(self):
        """ p.splitdrive() -> Return (p.drive, <the rest of p>).

        Split the drive specifier from this path.  If there is
        no drive specifier, p.drive is empty, so the return value
        is simply (Path(''), p).  This is always the case on Unix.
        """
        drive, rel = os.path.splitdrive(self)
        return Path(drive), rel

    def splitext(self):
        """ p.splitext() -> Return (p.stripext(), p.ext).

        Split the filename extension from this path and return
        the two parts.  Either part may be empty.

        The extension is everything from '.' to the end of the
        last path segment.  This has the property that if
        (a, b) == p.splitext(), then a + b == p.
        """
        filename, ext = os.path.splitext(self)
        return Path(filename), ext

    def stripext(self):
        """ p.stripext() -> Remove one file extension from the path.

        For example, Path('/home/guido/python.tar.gz').stripext()
        returns Path('/home/guido/python.tar').
        """
        return self.splitext()[0]

    if hasattr(os.path, 'splitunc'):
        def splitunc(self):
            """NT Only: Split a pathname into UNC mount point and relative path
            specifiers.
            eg. Path(r'\\dbserver\homes\matthew\work\stuff.py').splitunc() == \
            (Path(r'\\dbserver\homes'), Path(r'\\matthew\work\stuff.py'))"""
            unc, rest = os.path.splitunc(self)
            return Path(unc), Path(rest)

        def _get_uncshare(self):
            """NT Only: Returns only the server and share name from a unc path
            name.
            eg. Path(r'\\dbserver\homes\matthew\work\stuff.py').uncshare() == \
            Path(r'\\dbserver\homes')"""
            return Path(os.path.splitunc(self)[0])

        uncshare = property(
            _get_uncshare, None, None,
            """ The UNC mount point for this path.
            This is empty for paths on local drives. """)

    def joinpath(self, *args):
        """ Join two or more path components, adding a separator
        character (os.sep) if needed.  Returns a new path
        object.
        """
        return Path(os.path.join(toUnicode(self), *args))

    def splitall(self):
        """ Return a list of the path components in this path.

        The first item in the list will be a path.  Its value will be
        either os.curdir, os.pardir, empty, or the root directory of
        this path (for example, '/' or 'C:\\').  The other items in
        the list will be strings.

        path.path.joinpath(*result) will yield the original path.
        """
        parts = []
        loc = self
        while loc != os.curdir and loc != os.pardir:
            prev = loc
            loc, child = prev.splitpath()
            if loc == prev:
                break
            parts.append(child)
        parts.append(loc)
        parts.reverse()
        return parts

    def relpath(self):
        """ Return this path as a relative path,
        based from the current working directory.
        """
        cwd = Path(os.getcwd())
        return cwd.relpathto(self)

    def relpathto(self, dest):
        """ Return a relative path from self to dest.

        If there is no relative path from self to dest, for example if
        they reside on different drives in Windows, then this returns
        dest.abspath().
        """
        origin = self.abspath()
        dest = Path(dest).abspath()

        orig_list = origin.normcase().splitall()
        # Don't normcase dest!  We want to preserve the case.
        dest_list = dest.splitall()

        if orig_list[0] != os.path.normcase(dest_list[0]):
            # Can't get here from there.
            return dest

        # Find the location where the two paths start to differ.
        i = 0
        for start_seg, dest_seg in zip(orig_list, dest_list):
            if start_seg != os.path.normcase(dest_seg):
                break
            i += 1

        # Now i is the point where the two paths diverge.
        # Need a certain number of "os.pardir"s to work up
        # from the origin to the point of divergence.
        segments = [os.pardir] * (len(orig_list) - i)
        # Need to add the diverging part of dest_list.
        segments += dest_list[i:]
        if len(segments) == 0:
            # If they happen to be identical, use os.curdir.
            return Path(os.curdir)
        else:
            return Path(os.path.join(*segments))


    # --- Listing, searching, walking, and matching

    def listdir(self, pattern=None):
        """ D.listdir() -> List of items in this directory.

        Use D.files() or D.dirs() instead if you want a listing
        of just files or just subdirectories.

        The elements of the list are path objects.

        With the optional 'pattern' argument, this only lists
        items whose names match the given pattern.
        """
        names = os.listdir(self)
        if pattern is not None:
            names = fnmatch.filter(names, pattern)
        return [self / child for child in names]

    def dirs(self, pattern=None):
        """ D.dirs() -> List of this directory's subdirectories.

        The elements of the list are path objects.
        This does not walk recursively into subdirectories
        (but see path.walkdirs).

        With the optional 'pattern' argument, this only lists
        directories whose names match the given pattern.  For
        example, d.dirs('build-*').
        """
        return [pth for pth in self.listdir(pattern) if pth.isdir()]

    def files(self, pattern=None):
        """ D.files() -> List of the files in this directory.

        The elements of the list are path objects.
        This does not walk into subdirectories (see path.walkfiles).

        With the optional 'pattern' argument, this only lists files
        whose names match the given pattern.  For example,
        d.files('*.pyc').
        """

        return [pth for pth in self.listdir(pattern) if pth.isfile()]

    def walk(self, pattern=None):
        """ D.walk() -> iterator over files and subdirs, recursively.

        The iterator yields path objects naming each child item of
        this directory and its descendants.  This requires that
        D.isdir().

        This performs a depth-first traversal of the directory tree.
        Each directory is returned just before all its children.
        """
        for child in self.listdir():
            if pattern is None or child.fnmatch(pattern):
                yield child
            if child.isdir():
                for item in child.walk(pattern):
                    yield item

    def walkdirs(self, pattern=None):
        """ D.walkdirs() -> iterator over subdirs, recursively.

        With the optional 'pattern' argument, this yields only
        directories whose names match the given pattern.  For
        example, mydir.walkdirs('*test') yields only directories
        with names ending in 'test'.
        """
        for child in self.dirs():
            if pattern is None or child.fnmatch(pattern):
                yield child
            for subsubdir in child.walkdirs(pattern):
                yield subsubdir

    def walkfiles(self, pattern=None):
        """ D.walkfiles() -> iterator over files in D, recursively.

        The optional argument, pattern, limits the results to files
        with names that match the pattern.  For example,
        mydir.walkfiles('*.tmp') yields only files with the .tmp
        extension.
        """
        for child in self.listdir():
            if child.isfile():
                if pattern is None or child.fnmatch(pattern):
                    yield child
            elif child.isdir():
                for pth in child.walkfiles(pattern):
                    yield pth

    def fnmatch(self, pattern):
        """ Return True if self.name matches the given pattern.

        pattern - A filename pattern with wildcards,
            for example '*.py'.
        """
        return fnmatch.fnmatch(self.name, pattern)

    def glob(self, pattern):
        """Return a list of path objects that match the pattern.

        pattern - a path relative to this directory, with wildcards.

        For example, Path('/users').glob('*/bin/*') returns a list
        of all the files users have in their bin directories.
        """
        return map(Path, glob.glob(toUnicode(self / pattern)))


    # --- Reading or writing an entire file at once.

    def open(self, mode='r'):
        """ Open this file.  Return a file object. """
        return file(self, mode)

    def bytes(self):
        """ Open this file, read all bytes, return them as a string. """
        file_ = self.open('rb')
        try:
            return file_.read()
        finally:
            file_.close()

    def write_bytes(self, bytes, append=False):
        """ Open this file and write the given bytes to it.

        Default behavior is to overwrite any existing file.
        Call this with write_bytes(bytes, append=True) to append instead.
        """
        if append:
            mode = 'ab'
        else:
            mode = 'wb'
        file_ = self.open(mode)
        try:
            file_.write(bytes)
        finally:
            file_.close()

    def text(self, encoding=None, errors='strict'):
        """ Open this file, read it in, return the content as a string.

        This uses 'U' mode in Python 2.3 and later, so '\r\n' and '\r'
        are automatically translated to '\n'.

        Optional arguments:

        encoding - The Unicode encoding (or character set) of
            the file.  If present, the content of the file is
            decoded and returned as a unicode object; otherwise
            it is returned as an 8-bit str.
        errors - How to handle Unicode errors; see help(str.decode)
            for the options.  Default is 'strict'.
        """
        if encoding is None:
            # 8-bit
            file_ = self.open(_textmode)
            try:
                return file_.read()
            finally:
                file_.close()
        else:
            # Unicode
            file_ = codecs.open(self, 'r', encoding, errors)
            # (Note - Can't use 'U' mode here, since codecs.open
            # doesn't support 'U' mode, even in Python 2.3.)
            try:
                data = file_.read()
            finally:
                file_.close()
            return (data.replace(u'\r\n', u'\n')
                        .replace(u'\r\x85', u'\n')
                        .replace(u'\r', u'\n')
                        .replace(u'\x85', u'\n')
                        .replace(u'\u2028', u'\n'))

    def write_text(self, text, encoding=None,
                   errors='strict', linesep=os.linesep,
                   append=False):
        """ Write the given text to this file.

        The default behavior is to overwrite any existing file;
        to append instead, use the 'append=True' keyword argument.

        There are two differences between path.write_text() and
        path.write_bytes(): newline handling and Unicode handling.
        See below.

        Parameters:

          - text - str/unicode - The text to be written.

          - encoding - str - The Unicode encoding that will be used.
            This is ignored if 'text' isn't a Unicode string.

          - errors - str - How to handle Unicode encoding errors.
            Default is 'strict'.  See help(unicode.encode) for the
            options.  This is ignored if 'text' isn't a Unicode
            string.

          - linesep - keyword argument - str/unicode - The sequence of
            characters to be used to mark end-of-line.  The default is
            os.linesep.  You can also specify None; this means to
            leave all newlines as they are in 'text'.

          - append - keyword argument - bool - Specifies what to do if
            the file already exists (True: append to the end of it;
            False: overwrite it.)  The default is False.


        --- Newline handling.

        write_text() converts all standard end-of-line sequences
        ('\n', '\r', and '\r\n') to your platform's default end-of-line
        sequence (see os.linesep; on Windows, for example, the
        end-of-line marker is '\r\n').

        If you don't like your platform's default, you can override it
        using the 'linesep=' keyword argument.  If you specifically want
        write_text() to preserve the newlines as-is, use 'linesep=None'.

        This applies to Unicode text the same as to 8-bit text, except
        there are three additional standard Unicode end-of-line sequences:
        u'\x85', u'\r\x85', and u'\u2028'.

        (This is slightly different from when you open a file for
        writing with fopen(filename, "w") in C or file(filename, 'w')
        in Python.)


        --- Unicode

        If 'text' isn't Unicode, then apart from newline handling, the
        bytes are written verbatim to the file.  The 'encoding' and
        'errors' arguments are not used and must be omitted.

        If 'text' is Unicode, it is first converted to bytes using the
        specified 'encoding' (or the default encoding if 'encoding'
        isn't specified).  The 'errors' argument applies only to this
        conversion.
        """
        if isinstance(text, unicode):
            if linesep is not None:
                # Convert all standard end-of-line sequences to
                # ordinary newline characters.
                text = (text.replace(u'\r\n', u'\n')
                            .replace(u'\r\x85', u'\n')
                            .replace(u'\r', u'\n')
                            .replace(u'\x85', u'\n')
                            .replace(u'\u2028', u'\n'))
                text = text.replace(u'\n', linesep)
            if encoding is None:
                encoding = sys.getdefaultencoding()
            bytes = text.encode(encoding, errors)
        else:
            # It is an error to specify an encoding if 'text' is
            # an 8-bit string.
            assert encoding is None

            if linesep is not None:
                text = (text.replace('\r\n', '\n')
                            .replace('\r', '\n'))
                bytes = text.replace('\n', linesep)

        self.write_bytes(bytes, append)

    def safeSave(self, saveFunc, endOfWorld, *args):
        """
        Saves to this file, keeping the old one available, and not trashing it
        if save fails.
        'saveFunc' takes a file like object and writes data to it.
        'endOfWorld' is a message to show to the user if their data is stuck in 'filename.old.ext'
        '*args' will be passed to 'saveFunc', after the 'fileObj'
        """
        if not self.exists():
            # Normal save
            saveFunc(self, *args)
        else:
            # If original exists, back it up
            try:
                backupName = self.dirname() / self.namebase + '.old' + self.ext
                i = 0
                while backupName.exists():
                    i += 1
                    backupName = self.dirname() / self.namebase + '.old' + str(i) + self.ext
                self.rename(backupName)
            except Exception, e:
                log.warn('Failed to rename file on saving: %s -> %s -- %s' % (repr(self), repr(backupName), str(e)))
                backupName = None
            try:
                # Begin saving
                saveFunc(self, *args)
            except Exception, e:
                # Restore the backup if available
                if backupName is not None and backupName.exists():
                    if self.exists():
                        try:
                            crashedFilename = self.dirname() / self.namebase + '.crashed' + self.ext
                            i = 0
                            while crashedFilename.exists():
                                i += 1
                                crashedFilename = self.dirname() / self.namebase + '.crashed' + str(i) + self.ext
                            self.rename(crashedFilename)
                        except Exception, e:
                            log.warn('Failed to rename crashed file on saving: %s -> %s -- %s' % (self, crashedFilename, str(e)))
                            try:
                                self.remove()
                            except Exception, e:
                                raise Exception(endOfWorld % backupName)
                    backupName.rename(self)
                raise Exception(_("%s\n%s unchanged" % (e, self)))
            # If save completed ok, delete backup
            if backupName and backupName.exists():
                try:
                    backupName.remove()
                except Exception, e:
                    log.warn('Save completed but unable to delete backup "%s"' % backupName)

    def unique(self):
        """
        Returns a unique file name in the current dir,
        by adding a dot and a number just before the extension.
        """
        dirname = self.dirname()
        if not dirname.isdir() and not dirname.ismount():
            raise Exception('Use self.dirname.makedirs() first')
        i = 1
        path = Path(self)
        while path.exists():
            path = Path(self.dirname()/self.namebase + '.' + str(i) + self.ext)
            i = i + 1
        return path

    def lines(self, encoding=None, errors='strict', retain=True):
        """ Open this file, read all lines, return them in a list.

        Optional arguments:
            encoding - The Unicode encoding (or character set) of
                the file.  The default is None, meaning the content
                of the file is read as 8-bit characters and returned
                as a list of (non-Unicode) str objects.
            errors - How to handle Unicode errors; see help(str.decode)
                for the options.  Default is 'strict'
            retain - If true, retain newline characters; but all newline
                character combinations ('\r', '\n', '\r\n') are
                translated to '\n'.  If false, newline characters are
                stripped off.  Default is True.

        This uses 'U' mode in Python 2.3 and later.
        """
        if encoding is None and retain:
            file_ = self.open(_textmode)
            try:
                return file_.readlines()
            finally:
                file_.close()
        else:
            return self.text(encoding, errors).splitlines(retain)

    def write_lines(self, lines, encoding=None, errors='strict',
                    linesep=os.linesep, append=False):
        """ Write the given lines of text to this file.

        By default this overwrites any existing file at this path.

        This puts a platform-specific newline sequence on every line.
        See 'linesep' below.

        lines - A list of strings.

        encoding - A Unicode encoding to use.  This applies only if
            'lines' contains any Unicode strings.

        errors - How to handle errors in Unicode encoding.  This
            also applies only to Unicode strings.

        linesep - The desired line-ending.  This line-ending is
            applied to every line.  If a line already has any
            standard line ending ('\r', '\n', '\r\n', u'\x85',
            u'\r\x85', u'\u2028'), that will be stripped off and
            this will be used instead.  The default is os.linesep,
            which is platform-dependent ('\r\n' on Windows, '\n' on
            Unix, etc.)  Specify None to write the lines as-is,
            like file.writelines().

        Use the keyword argument append=True to append lines to the
        file.  The default is to overwrite the file.  Warning:
        When you use this with Unicode data, if the encoding of the
        existing data in the file is different from the encoding
        you specify with the encoding= parameter, the result is
        mixed-encoding data, which can really confuse someone trying
        to read the file later.
        """
        if append:
            mode = 'ab'
        else:
            mode = 'wb'
        file_ = self.open(mode)
        try:
            for line in lines:
                isUnicode = isinstance(line, unicode)
                if linesep is not None:
                    # Strip off any existing line-end and add the
                    # specified linesep string.
                    if isUnicode:
                        if line[-2:] in (u'\r\n', u'\x0d\x85'):
                            line = line[:-2]
                        elif line[-1:] in (u'\r', u'\n',
                                           u'\x85', u'\u2028'):
                            line = line[:-1]
                    else:
                        if line[-2:] == '\r\n':
                            line = line[:-2]
                        elif line[-1:] in ('\r', '\n'):
                            line = line[:-1]
                    line += linesep
                if isUnicode:
                    if encoding is None:
                        encoding = sys.getdefaultencoding()
                    line = line.encode(encoding, errors)
                file_.write(line)
        finally:
            file_.close()

    # --- Methods for querying the filesystem.

    # N.B. On some platforms, the os.path functions may be implemented in C
    # (e.g. isdir on Windows, Python 3.2.2), and compiled functions don't get
    # bound. Playing it safe and wrapping them all in method calls.
    def isabs(self): return os.path.isabs(self)
    def exists(self): return os.path.exists(self)
    def isdir(self): return os.path.isdir(self)
    def isfile(self): return os.path.isfile(self)
    def islink(self): return os.path.islink(self)
    def ismount(self): return os.path.ismount(self)

    if hasattr(os.path, 'samefile'):
        samefile = os.path.samefile
    else:
        def samefile(self, filename):
            """
            This is a hacky windows version.
            """
            return toUnicode(self.abspath()) == toUnicode(Path(filename).abspath())

    getatime = os.path.getatime
    atime = property(
        getatime, None, None,
        """ Last access time of the file. """)

    getmtime = os.path.getmtime
    mtime = property(
        getmtime, None, None,
        """ Last-modified time of the file. """)

    if hasattr(os.path, 'getctime'):
        getctime = os.path.getctime
        ctime = property(
            getctime, None, None,
            """ Creation time of the file. """)

    getsize = os.path.getsize
    size = property(
        getsize, None, None,
        """ Size of the file, in bytes. """)

    if hasattr(os, 'access'):
        def access(self, mode):
            """ Return true if current user has access to this path.

            mode - One of the constants os.F_OK, os.R_OK, os.W_OK, os.X_OK
            """
            return os.access(self, mode)

    def stat(self):
        """ Perform a stat() system call on this path. """
        return os.stat(self)

    def lstat(self):
        """ Like path.stat(), but do not follow symbolic links. """
        return os.lstat(self)

    if hasattr(os, 'statvfs'):
        def statvfs(self):
            """ Perform a statvfs() system call on this path. """
            return os.statvfs(self)

    if hasattr(os, 'pathconf'):
        def pathconf(self, name):
            """Wraps os.pathconf"""
            return os.pathconf(self, name)

    # --- Modifying operations on files and directories

    def utime(self, times):
        """ Set the access and modified times of this file. """
        os.utime(self, times)

    def chmod(self, mode):
        """Change the permissions of the file"""
        os.chmod(self, mode)

    def chdir(self):
        """Change the current working directory
        to self"""
        os.chdir(toUnicode(self))

    if hasattr(os, 'chown'):
        def chown(self, uid, gid):
            """Change the owner (uid) and owning group
            (gid) of the file"""
            os.chown(self, uid, gid)

    def rename(self, new):
        """Rename the file.
        Returns a new path object with the new name"""
        os.rename(self, new)
        return Path(new)

    def renames(self, new):
        """Renames creating directories if necessary.
        Returns a new path object with the new name"""
        os.renames(self, new)
        return Path(new)

    # --- Create/delete operations on directories

    def mkdir(self, mode=0777):
        """Make a new directory with
        this pathname"""
        os.mkdir(self, mode)

    def makedirs(self, mode=0777):
        """Make directories with this pathname
        will create multiple dirs as necessary"""
        os.makedirs(self, mode)

    def rmdir(self):
        """Remove the directory with this pathname"""
        os.rmdir(self)

    def removedirs(self):
        """Remove all the empty dirs mentioned in this pathname"""
        os.removedirs(self)

    # --- Modifying operations on files

    def touch(self):
        """ Set the access/modified times of this file to the current time.
        Create the file if it does not exist.
        """
        fd = os.open(self, os.O_WRONLY | os.O_CREAT, 0666)
        os.close(fd)
        os.utime(self, None)

    def remove(self):
        """Delete this file"""
        os.remove(self)

    def unlink(self):
        """Unlink this symlink"""
        os.unlink(self)

    # --- Links

    if hasattr(os, 'link'):
        def link(self, newpath):
            """ Create a hard link at 'newpath', pointing to this file. """
            os.link(self, newpath)

    if hasattr(os, 'symlink'):
        def symlink(self, newlink):
            """ Create a symbolic link at 'newlink', pointing here. """
            os.symlink(self, newlink)

    if hasattr(os, 'readlink'):
        def readlink(self):
            """ Return the path to which this symbolic link points.

            The result may be an absolute or a relative path.
            """
            return Path(os.readlink(self))

        def readlinkabs(self):
            """ Return the path to which this symbolic link points.

            The result is always an absolute path.
            """
            pth = self.readlink()
            if pth.isabs():
                return pth
            else:
                return (self.parent / pth).abspath()


    # --- High-level functions from shutil

    def copyfile(self, dst):
        """Wraps shutil.copyfile"""
        return shutil.copyfile(toUnicode(self), toUnicode(dst))
    def copymode(self, dst):
        """Wraps shutil.copymode"""
        return shutil.copymode(toUnicode(self), toUnicode(dst))
    def copystat(self, dst):
        """Wraps shutil.copystat"""
        return shutil.copystat(toUnicode(self), toUnicode(dst))
    def copy(self, dst):
        """Wraps shutil.copy"""
        return shutil.copy(toUnicode(self), toUnicode(dst))
    def copy2(self, dst):
        """Wraps shutil.copy2"""
        return shutil.copy2(toUnicode(self), toUnicode(dst))
    def copytree(self, dst):
        """Wraps shutil.copytree"""
        return shutil.copytree(toUnicode(self), toUnicode(dst))

    def copytreeFilter(self, dst, symlinks=False, filterDir=None, filterFile=None):
        """Recursively copy a directory tree using copy2().

        The destination directory must not already exist.
        If exception(s) occur, an Error is raised with a list of reasons.

        If the optional symlinks flag is true, symbolic links in the
        source tree result in symbolic links in the destination tree; if
        it is false, the contents of the files pointed to by symbolic
        links are copied.

        XXX Consider this example code rather than the ultimate tool.

        'filterDir' will be called passing each source directory name, if it returns False, the directory will not be copied.
        'filterFile' will be called passing each source file name, if it returns False, the file will not be copied.
        """
        dst = Path(dst)
        names = self.listdir()
        dst.mkdir()
        errors = []
        for name in names:
            srcname = self/self.relpathto(name)
            dstname = dst/self.relpathto(name)
            try:
                if symlinks and os.path.islink(srcname):
                    linkto = os.readlink(srcname)
                    os.symlink(linkto, dstname)
                elif os.path.isdir(srcname):
                    if filterDir is not None:
                        if not filterDir(srcname):
                            continue
                    srcname.copytreeFilter(dstname, symlinks, filterDir, filterFile)
                else:
                    if filterFile is not None:
                        if not filterFile(srcname):
                            continue
                    srcname.copy2(dstname)
                # XXX What about devices, sockets etc.?
            except (IOError, os.error), why:
                import pdb
                pdb.set_trace()
                errors.append((srcname, dstname, why))
            # catch the Error from the recursive copytree so that we can
            # continue with other files
            except shutil.Error, err:
                import pdb
                pdb.set_trace()
                errors.extend(err.args[0])
        if errors:
            import pdb
            pdb.set_trace()
            raise shutil.Error, errors

    if hasattr(shutil, 'move'):
        def move(self, dst):
            """Wraps shutil.move"""
            return shutil.move(toUnicode(self), toUnicode(dst))
    def rmtree(self):
        """Wraps shutil.rmtree"""
        path = toUnicode(self)
        if os.name == 'nt': # Fix MAX_PATH limit in windows
            try:
                device_namespace_prefix = '\\\\?\\'
                if path[:4] != device_namespace_prefix:
                    path = device_namespace_prefix+path
                return shutil.rmtree(path)
            except:
                path = toUnicode(self)
                return shutil.rmtree(path)
        else:
            return shutil.rmtree(path)

    # --- Special stuff from os

    if hasattr(os, 'chroot'):
        def chroot(self):
            """Change the root dir to this path name"""
            os.chroot(self)

    if hasattr(os, 'startfile'):
        def startfile(self):
            """Run this file with the appropriate program"""
            os.startfile(self)

    # Extra icing

    def copyglob(self, globStr, destination):
        """
        >>> x = Path('~')
        >>> Path('~/tmp').mkdir()
        >>> x.copyglob('.*', '~/tmp')
        # Copies all invisible files (and dirs) recursively to ~/tmp
        """
        for fn in self.glob(globStr):
            fn.copy(destination)

    def copylist(self, fnlist, destination):
        """
        Given a sequence of relative file names ('fnlist')
        copies them to 'destination'
        """
        for fn in fnlist:
            (self / fn).copy(destination)

    def copyfiles(self, destination):
        """
        Copies the content of files to 'destination' directory
        """
        if self.exists():
            for fn in self.files():
                fn.copy(destination)

    def setSalt(self, salt):
        self.salt = salt

    def getMd5(self):
        """Returns an md5 hash for an object with read() method."""
        try:
            file_ = file(self, 'rb')
        except:
            raise Exception("Could not open %s" % self)
        hasher = hashlib.md5()
        if hasattr(self, 'salt'):
            hasher.update(self.salt)
        while True:
            block = file_.read(8096)
            if not block:
                break
            hasher.update(block)
        file_.close()
        return hasher.hexdigest()
    md5 = property(getMd5)


class TempDirPath(Path):
    """
    This object, when created gives you a Path object
    pointing to a newly created temporary directory.
    When this object goes out of scope, the directory
    is obliterated.
    You can call 'rmtree' yourself if you want before
    dropping the object to make sure.
    """

    def __new__(cls):
        return Path.__new__(cls, mkdtemp())

    def __del__(self):
        """Destroy the temporary directory"""
        if self.exists():
            self.rmtree()

def toUnicode(string, encoding='utf8'):
    """
    Turns everything passed to it to unicode.
    """
    if isinstance(string, str):
        return unicode(string, encoding)
    elif isinstance(string, unicode):
        return unicode(string)
    elif string is None:
        return u''
    else:
        return unicode(str(string), encoding)
