"""
Get's all external libs into extern directory
"""

import sys, os
if '.' not in sys.path:
    sys.path.insert(0, '.')
import urllib2
import tarfile
from shutil import copyfileobj
from exe.engine.path import Path

EXTERN_DIR = Path('extern/src')
if not EXTERN_DIR.exists():
    EXTERN_DIR.makedirs()


def download(url, filename=None):
    """
    Downloads a url to a filename.
    True if it is downloaded.
    """
    # If already exists, just return the existing file
    if filename and os.path.isfile(filename):
        return open(filename, 'rb')
    req = urllib2.Request(url=url)
    input = urllib2.urlopen(req)
    if filename:
        output = file(filename, 'wb')
        copyfileobj(input, output)
        input.close()
        output.close()
    else:
        return input

def extract(fileobj, mode='r|gz'):
    """
    Extracts a tar.gz file.
    For 'tar' file set mode to 'r|'.
    For 'tar.bz2' file set mode to 'r|bz2'.
    """
    tar = tarfile.open(mode=mode, fileobj=fileobj)
    for input in tar:
        print '==>', input.name, input.size
        tar.extract(input, EXTERN_DIR)
    return (EXTERN_DIR/input.name).splitpath()[0]

def build(dirname, buildInstruction):
    """
    Builds 'dirname' (extern/src/xxx) into extern/build/xxx
    """
    srcDir, modName = dirname.splitpath()
    buildDir = srcDir.splitpath()[0]/'build'
    if not buildDir.exists():
        buildDir.makedirs()
    buildDir = (buildDir/modName).abspath()
    oldDir = Path('.').abspath()
    os.chdir(dirname)
    try:
        os.system(buildInstruction % buildDir)
    finally:
        os.chdir(oldDir)

def get(name):
    """
    Downloads and extracts a URL automagically
    """
    dirname, buildInstruction, url = deps[name]
    if (EXTERN_DIR/dirname).isdir():
        print '%s already downloaded' % name
        srcDir = Path('extern/src')/dirname
    else:
        print "Downloading and extracting %s" % name
        # Check the extension of the url
        ext = url.rsplit('.', 1)[-1]
        if ext == 'tar':
            mode = 'r|'
        elif ext in ('gz', 'bz2', 'tgz', 'tbz2'):
            mode = 'r|' + ext
        else:
            raise Exception("Don't know how to extract files of type '%s'." % ext)
        stream = download(url)
        srcDir = extract(stream, mode)
    ##build(srcDir, buildInstruction)
    return srcDir

deps = {
    # Name                   # archive 1st dir       # Build instruction        # URL       
    'Zope Interfaces 3.0.0':('zope.interface-3.3.0', 'python setup.py build -b %s',   
    'http://www.zope.org/Products/ZopeInterface/3.3.0/zope.interface-3.3.0.tar.gz'),
    'Twisted 2.4':          ('Twisted-2.4.0',        'python setup.py build -b %s',   
    'http://tmrc.mit.edu/mirror/twisted/Twisted/2.4/Twisted-2.4.0.tar.bz2'),
    'PIL 1.1.6':            ('Imaging-1.1.6',        'python setup.py build -b %s',   
    'http://effbot.org/downloads/Imaging-1.1.6.tar.gz'),
    'nevow 0.4.1':          ('nevow-0.4.1',          'python setup.py build -b %s',   
    'http://exelearning.org/BuildingFromSource?action=AttachFile&do=get&target=nevow-0.4.1.tar.gz'),
    'CTypes':               ('ctypes-1.0.1',         'python setup.py build -b %s',   
    'http://optusnet.dl.sourceforge.net/sourceforge/ctypes/ctypes-1.0.1.tar.gz'),
    'Python 2.5':           ('Python-2.5',           './configure --prefix=%s; make; make install',   
    'http://www.python.org/ftp/python/2.5/Python-2.5.tar.bz2')}

for key in deps:
    get(key)
