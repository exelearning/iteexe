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

EXTERN_DIR = Path('extern')
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
        tar.extract(input, EXTERN_DIR/input.name)
    return (EXTERN_DIR/input.name).split

def get(name, dirname, url):
    """
    Downloads and extracts a URL automagically
    """
    if (EXTERN_DIR/dirname).isdir():
        print '%s already downloaded' % name
        return
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
    return extract(stream, mode)

# Zope-interfaces
get('Zope Interfaces 3.0.0', 'zope.interface-3.3.0', 'http://www.zope.org/Products/ZopeInterface/3.3.0/zope.interface-3.3.0.tar.gz')

# Twisted 2.4
get('Twisted 2.4', 'Twisted-2.4.0', 'http://tmrc.mit.edu/mirror/twisted/Twisted/2.4/Twisted-2.4.0.tar.bz2')

# PIL
get('PIL 1.1.6', 'Imaging-1.1.6', 'http://effbot.org/downloads/Imaging-1.1.6.tar.gz')

# Nevow 0.4
get('nevow 0.4.1', 'nevow-0.4.1', 'http://exelearning.org/BuildingFromSource?action=AttachFile&do=get&target=nevow-0.4.1.tar.gz')

# CTypes
get('CTypes', 'ctypes-1.0.1', 'http://optusnet.dl.sourceforge.net/sourceforge/ctypes/ctypes-1.0.1.tar.gz')
