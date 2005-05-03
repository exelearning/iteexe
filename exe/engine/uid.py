#!/usr/bin/env python

"""
Generation of relatively unique IDs.
Released under GPL.
http://www.alcyone.com/software/uid/
"""

__program__ = 'uid'
__version__ = '1.0.3'
__author__ = 'Erik Max Francis <max@alcyone.com>'
__copyright__ = 'Copyright (C) 2002 Erik Max Francis'
__license__ = 'GPL'


import getopt
import os
if os.name == 'posix':
    import grp
    import pwd
import md5
import os
import random
import socket
import string
import sys
import time
import types


class Hash:

    """A base class which can be derived to handle new types of
    hashes; this is the same kind of interface that is used by the md5
    and sha modules (the moduels themselves act as hashers, see to
    below).  A hash is fed new data with the update method; the
    current state of the hash can be requested with the digest method,
    or in a text-printable version with hexdigest."""
    
    def __init__(self, data=None):
        """Create a new hash; if data is presented, start with that."""
        if self.__class__ is Hash:
            raise NotImplemenetedError
        if data is not None:
            self.update(data)

    def update(self, data):
        """Update the hash by sending it more information."""
        raise NotImplemenetedError

    def digest(self):
        """Get the current digest of the hash in binary form."""
        raise NotImplemenetedError

    def hexdigest(self):
        """Get the current digest, hopefully in a readable ASCII form."""
        raise NotImplemenetedError

class IdentityHash(Hash):

    """The identity hash just displays the data it's been fed."""
    
    def __init__(self, data=None):
        Hash.__init__(self, data)
        self.buffer = ''

    def update(self, data):
        self.buffer += data

    def digest(self):
        return self.buffer

    def hexdigest(self):
        return self.buffer

    
class HashGenerator:

    """A hash generator (or hasher) is a sort of factory for hashes;
    it will create a fresh hash object by calling it with no arguments
    (ideal if it is, say, a class).  Clients need only create a new
    Hasher object with the factory as the constructor, or derive from
    and override its class member HashFactory."""

    HashFactory = None

    def __init__(self, factory=None):
        """Instantiate a new hasher object, with the optional factory."""
        if factory is not None:
            self.HashFactory = factory
    
    def new(self):
        """Create a new instance of the hasher."""
        return self.HashFactory()


class UIDGenerator:

    """The class which generates new UID hashes, via the generate
    method.  The constructor takes a extra argument that should be
    different for different instances created concurrently, and a
    hasher object; both are optional.  Finally, the updateCustom
    method can be overridden by subclasses to include special
    behavior."""

    Hasher = md5 # default hasher is md5
    
    def __init__(self, extra=None, hasher=None):
        """Create a new generator.  If multiple generators will be in
        existence at the same time, it is best that they be given different
        extra arguments."""
        self.extra = extra
        if hasher is not None:
            self.Hasher = hasher
        self.index = 0
        self.dict = None

    def generate(self):
        """Generate, create the state, process it, and return a hash object."""
        self.reset()
        self.update()
        return self.process()

    def process(self):
        """After the state has been updated, build and return a hash object."""
        hash = self.Hasher.new()
        keys = self.dict.keys()
        keys.sort()
        for key in keys:
            datum = '%s %s\n' % (key, self.dict[key])
            hash.update(datum)
        return hash

    def reset(self):
        """Reset the state."""
        self.dict = {}

    def set(self, key, value):
        """Update one bit of information."""
        assert type(key) is types.StringType
        self.dict[key] = value

    def update(self):
        """Update the state with current information."""
        self.updateSystem()
        self.updateHost()
        self.updateUser()
        self.updateEnvironment()
        self.updateProcess()
        self.updateLocals()
        self.updateCustom()
        self.updateEphemeral() # do this last

    def updateSystem(self):
        """The operating system and the Python system."""
        self.set('version', string.split(sys.version, ' ', 1)[0])
        self.set('platform', sys.platform)
        self.set('executable', sys.executable)
        self.set('prefix', sys.prefix)
        self.set('pythonpath', string.join(sys.path, ':'))

    def updateHost(self):
        """The current host."""
        self.set('uname', string.join(os.uname(), ':'))
        hostname = socket.getfqdn(socket.gethostname())
        self.set('hostname', hostname)
        self.set('ip', socket.gethostbyname(hostname))

    def updateUser(self):
        """The current user, as he/she is executing this process."""
        self.set('uid', os.getuid())
        self.set('gid', os.getgid())
        self.set('euid', os.geteuid())
        self.set('egid', os.getegid())
        if os.name == 'posix':
            self.set('pwd', pwd.getpwuid(os.getuid()))
            self.set('grp', grp.getgrgid(os.getgid()))

    def updateEnvironment(self):
        """The operating environment."""
        self.set('home', os.environ.get('HOME'))
        self.set('term', os.environ.get('TERM'))
        self.set('display', os.environ.get('DISPLAY'))
        self.set('path', os.environ.get('PATH'))
        self.set('termid', os.ctermid())
        self.set('cwd', os.getcwd())

    def updateProcess(self):
        """The current process."""
        self.set('pid', os.getpid())
        self.set('pgrp', os.getpgrp())
        self.set('ppid', os.getppid())

    def updateLocals(self):
        """Local information."""
        if self.extra is not None:
            self.set('extra', str(self.extra))
        self.set('index', self.index)
        self.index = self.index + 1

    def updateCustom(self):
        """Custom information -- override to extend."""
        pass

    def updateEphemeral(self):
        """Ephemeral information to throw into the mix."""
        self.set('id', hex(id(self)))
        self.set('time', '%.17f' % time.time())
        self.set('random', '%.17f' % random.random())
        self.set('times', string.join(map(repr, os.times()), ':')) # very last


_generator = None

def UID():
    """A standalone function that will generate UIDs; if used multiple
    times, pass in different arguments for the perGeneration
    argument."""
    global _generator
    if _generator is None:
        _generator = UIDGenerator()
    return _generator.generate()


def usage():
    def say(message):
        print >> sys.stderr, message
    say("Usage: %s [options]" % sys.argv[0])
    say("")
    say("Generate simulated unique IDs based on the local environment.")
    say("")
    say("Valid options:")
    say("  -V --version                     print version and exit")
    say("  -h --help                        print usage and exit")
    say("  -v --verbose                     show the input for the hash")
    say("  -H --hasher=<module>             use the specified hasher [md5]")
    say("  -n --number=<count>              generate <count> UIDs")
    say("  -p --per --per-generator=<data>  seed with the given data")

def main():
    # Initialize the options.
    _count = 1
    _extra = None
    _hasher = None
    # Parse the command line.
    pairs, remainder = getopt.getopt(sys.argv[1:], 'vhVH:n:m:x:', ['version', 'help', 'verbose', 'hasher=', 'number=', 'extra='])
    for option, argument in pairs:
        if option in ('-V',  '--version'):
            sys.stderr.write("%s version %s\n" % (__program__, __version__))
            return
        elif option in ('-h', '--help'):
            usage()
            return
        elif option in ('-v', '--verbose'):
            _hasher = HashGenerator(IdentityHash)
        elif option in ('-H', '--hasher'):
            _hasher = __import__(argument)
        elif option in ('-n', '--number'):
            _count = int(argument)
        elif option in ('-x', '--extra'):
            _extra = argument
    if remainder:
        raise ValueError, "unexpected remaining arguments"
    # Go.
    generator = UIDGenerator(_extra, _hasher)
    for i in range(_count):
        hash = generator.generate()
        print hash.hexdigest()

if __name__ == '__main__': main()
