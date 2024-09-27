from getpass import getpass
import sys
sys.path.insert(0, '../..')
from exe.engine.path import Path
from exe.engine.version import release

def upFile(sftp, filename):
    print('Uploading', filename)
    rFilename = str(filename.basename())
    if rFilename in sftp.listdir():
        sftp.remove(rFilename)
    sftp.put(filename, rFilename)
    sftp.chmod(rFilename, 0x774)

def renameFile(oldName, newName):
    if oldName.exists():
        if newName.exists():
            newName.remove()
        oldName.rename(newName)
    elif not newName.exists():
        raise Exception('No install file found. You have to build it first!')
    return newName

def main():
    try:
        from paramiko import Transport
    except ImportError:
        print()
        print('To upload you need to install paramiko python library from:')
        print('http://www.lag.net/paramiko', end=' ')
        print('or on ubuntu go: apt-get install python2.4-paramiko')
        print()
        sys.exit(2)
    # Setup for eduforge
    server = 'shell.eduforge.org'
    basedir = '/home/pub/exe/'
    print('Please enter password for %s@%s:' % (sys.argv[-1], server))
    password = getpass()
    # Get the version
    # Rename the files
    print('Renaming files')
    install = Path('eXe_install_windows.exe')
    newName = Path('eXe-install-%s.exe' % release)
    install = renameFile(install, newName)
    ready2run = Path('exes.exe')
    newName = Path('eXe-ready2run-%s.exe' % release)
    ready2run = renameFile(ready2run, newName)
    # Upload
    print('Uploading')
    print('connecting to %s...' % server)
    from socket import socket, gethostbyname
    s = socket()
    s.connect((gethostbyname(server), 22))
    t = Transport(s)
    t.connect()
    t.auth_password(sys.argv[-1], password)
    sftp = t.open_sftp_client()
    sftp.chdir(basedir)
    upFile(sftp, install)
    upFile(sftp, ready2run)

if len(sys.argv) != 2:
    print('Please call passing your eduforge username')
else:
    main()
from getpass import getpass
import sys
sys.path.insert(0, '../..')
from exe.engine.path import Path
from exe.engine.version import release

def upFile(sftp, filename):
    print('Uploading', filename)
    rFilename = str(filename.basename())
    if rFilename in sftp.listdir():
        sftp.remove(rFilename)
    sftp.put(filename, rFilename)
    sftp.chmod(rFilename, 0x774)

def renameFile(oldName, newName):
    if oldName.exists():
        if newName.exists():
            newName.remove()
        oldName.rename(newName)
    elif not newName.exists():
        raise Exception('No install file found. You have to build it first!')
    return newName

def main():
    try:
        from paramiko import Transport
    except ImportError:
        print()
        print('To upload you need to install paramiko python library from:')
        print('http://www.lag.net/paramiko', end=' ')
        print('or on ubuntu go: apt-get install python2.4-paramiko')
        print()
        sys.exit(2)
    # Setup for eduforge
    server = 'shell.eduforge.org'
    basedir = '/home/pub/exe/'
    print('Please enter password for %s@%s:' % (sys.argv[-1], server))
    password = getpass()
    # Get the version
    # Rename the files
    print('Renaming files')
    install = Path('eXe_install_windows.exe')
    newName = Path('eXe-install-%s.exe' % release)
    install = renameFile(install, newName)
    ready2run = Path('exes.exe')
    newName = Path('eXe-ready2run-%s.exe' % release)
    ready2run = renameFile(ready2run, newName)
    # Upload
    print('Uploading')
    print('connecting to %s...' % server)
    from socket import socket, gethostbyname
    s = socket()
    s.connect((gethostbyname(server), 22))
    t = Transport(s)
    t.connect()
    t.auth_password(sys.argv[-1], password)
    sftp = t.open_sftp_client()
    sftp.chdir(basedir)
    upFile(sftp, install)
    upFile(sftp, ready2run)

if len(sys.argv) != 2:
    print('Please call passing your eduforge username')
else:
    main()
