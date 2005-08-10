# Uses a specified branch of the svn tree to make and upload an ebuild
from exe.engine.path import Path, TempDirPath
import os, sys

def main():
    if len(sys.argv) < 2:
        print 'Usage: %s [version]' % sys.argv[0]
        print 'Where [version] is the branch you want to checkout'
        print 'Eg. %s 0.7' % sys.argv[0]
    else:
        version = sys.argv[1]
        # Calc the svn branch name
        branch = 'http://exe.cfdl.auckland.ac.nz/svn/exe/branches/%s' % version
        # Make the temp dir
        tmp = TempDirPath()
        os.chdir(tmp)
        # Do the export
        os.system('svn export %s exe' % branch)
        # Now make the tarball
        os.chdir(tmp/'exe')
        tarball = Path('../exe-%s-source.tgz' % version)
        os.system('tar czf %s *' % tarball)
        # Upload it
        open('sftpbatch.tmp', 'w').write(
            'cd /home/pub/exe\n'
            'put %s\n' % tarball)
        os.system('sftp -b sftpbatch.tmp matiu@shell.eduforge.org')
        # Copy the ebuild file
        os.chdir(tmp/'exe/installs/gentoo')
        newEbuildFilename = Path('exe-%s.ebuild' % version).abspath()
        if not newEbuildFilename.exists():
            Path('exe-0.7.ebuild').copy(newEbuildFilename)
        # If we're root, rebuild the digests and remake the install
        if os.getuid() == 0:
            ebuildDir = Path('/usr/local/portage/dev-python/exe')
            if ebuildDir.exists():
                ebuildDir.rmtree()
            ebuildDir.makedirs()
            os.chdir(ebuildDir)
            newEbuildFilename.copy(ebuildDir)
            # Remove any old source if it exists
            oldTarball = Path('/usr/portage/distfiles/')/tarball.basename()
            if oldTarball.exists():
                oldTarball.remove()
            os.environ['GENTOO_MIRRORS']=''
            os.system('ebuild %s fetch' % newEbuildFilename.basename())
            os.system('ebuild %s manifest' % newEbuildFilename.basename())
            os.system('ebuild %s digest' % newEbuildFilename.basename())


if __name__ == '__main__':
    main()
