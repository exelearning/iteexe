#!/usr/bin/python
import sys, os
exeDir = '../../..'
sys.path.insert(0, exeDir)
from exe.engine.path import Path, TempDirPath
exeDir = Path(exeDir).abspath()


usage = """
Build ubuntu and debian packages of exe script.

Usage: %s [build] [index] [sftp username password]

build - Builds the package
index - Downloads cusomtized twisted package and generates Packages.gz file
sftp - Uploads indexes and package to eduforge
username and pasword for your eduforge account are needed for sftp and should
always be the last two parameters

Debugging options:
copy - Copies the index files, so you can use just copy instead of index next time instead of re-indexing.
       Ie. First time use "index copy". Next time just use "copy"
checkDirs - Checks that a nice directory structure exists on the server
"""

if len(sys.argv) == 1:
    print usage
    sys.exit(1)


if 'build' in sys.argv:
    newDir = exeDir/'debian'
    if newDir.islink():
        print 'Removing old link'
        newDir.remove()
    elif newDir.exists():
        raise Exception('exe/debian directory/file already exists, aborting....')
    Path('debian').abspath().symlink(newDir)
    exeDir.chdir()
    if os.path.exists(exeDir/'exe/webui/firefox'):
        os.system('fakeroot debian/rules binary')
    else:
        raise Exception('You need to copy the firefox installation to "exe/webui/firefox"')

packages = (exeDir/'..').glob('*.deb')
if not packages:
    print 'No packages found'
    sys.halt(1)
packages.sort()
package = packages[-1]

tmp = None
if 'index' in sys.argv:
    print 'Creating Index...'
    # Update Packages.gz
    tmp = TempDirPath()
    pool = tmp/'pool'
    pool.mkdir()
    pool.chdir()
    print 'Downloading customised twisted package for "breezy users"...'
    os.system('ncftpget ftp://ftp.eduforge.org/pub/exe/ubuntu/pool/python2.4-twisted_2.0.1-999_all.deb')
    package.copyfile(pool/package.basename())
    print 'Downloading old nevow 0.4.1 package for "dapper users"...'
    os.system('ncftpget ftp://ftp.eduforge.org/pub/exe/ubuntu/pool/python2.4-nevow_0.4.1-1.1ubuntu1_all.deb')
    package.copyfile(pool/package.basename())
    tmp.chdir()
    os.system('dpkg-scanpackages pool /dev/null | gzip -9c > pool/Packages.gz')


if 'copy' in sys.argv:
    if 'index' in sys.argv:
        print 'copying index file to', exeDir
        (pool/'Packages.gz').copy(exeDir)
    pool = exeDir

if 'sftp' in sys.argv:
    # Connect with sftp
    try:
        from paramiko import Transport
    except ImportError:
        print 'To upload you need to install paramiko python library from:'
        print 'http://www.lag.net/paramiko'
        sys.exit(2)
    print 'connecting to sftp server...'
    from socket import socket, gethostbyname
    s = socket()
    s.connect((gethostbyname('shell.eduforge.org'), 22))
    t = Transport(s)
    t.connect()
    t.auth_password(sys.argv[-2], sys.argv[-1])
    f = t.open_sftp_client()
    # See that the directory structure looks good
    f.chdir('/home/pub/exe')
    poolDir = 'ubuntu/pool'
    packageDirs = [
        'ubuntu/dists/current/main/binary-i386',
        'ubuntu/dists/current/main/binary-arm',
        'ubuntu/dists/current/main/binary-alpha',
        ]
    if 'checkDirs' in sys.argv:
        print 'Checking directory structure...'
        for fn in packageDirs + [poolDir]:
            for part in fn.split('/'):
                files = f.listdir()
                if part not in files:
                    print 'Creating Dir on server:', fn, ':', part
                    f.mkdir(part)
                f.chdir(part)
            f.chdir('/home/pub/exe')
    # Upload the binary package twice
    print 'Uploading Package %s to main dir...' % package
    f.put(package.encode('utf-8'), package.basename().encode('utf-8'))
    f.chmod(package.basename().encode('utf-8'), 0x774)
    print 'Uploading Package %s to pool dir...' % package
    f.chdir('/home/pub/exe/' + poolDir)
    f.put(package.encode('utf-8'), package.basename().encode('utf-8'))
    f.chmod(package.basename().encode('utf-8'), 0x774)
    # Replace Packages.gz files
    print 'Uploading indexes...'
    for fn in packageDirs:
        print '  ', fn.split('/')[-1], '...'
        f.chdir('/home/pub/exe/'+fn)
        if 'Packages.gz' in f.listdir():
            f.remove('Packages.gz')
        f.put((pool/'Packages.gz').encode('utf-8'), 'Packages.gz')
        f.chmod('Packages.gz', 0x774)
    print 'done'

