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
        # Get the original exe dir
        origDir = Path(sys.argv[0]).abspath().dirname()
        # Make the temp dir
        tmp = TempDirPath()
        os.chdir(tmp)
        # Do the export
        os.system('svn export %s exe' % branch)
        # Copy firefox accross
        (origDir/'../../exe/webui/firefox').copytree(tmp/'exe/webui/firefox')
        import pdb
        pdb.set_trace()
        # Now make the tarball
        os.chdir(tmp/'exe')
        tarball = Path('../exe-%s-source.tgz' % version).abspath()
        os.system('tar czf %s *' % tarball)
        os.chdir(tmp)
        # Upload it
        if '--local' not in sys.argv:
            open('sftpbatch.tmp', 'w').write(
                'cd /home/pub/exe\n'
                'put %s\n' % tarball)
            os.system('sftp -b sftpbatch.tmp matiu@shell.eduforge.org')
        # If we're root, copy the tarball to the portage cache dir to save
        # downloading it when emerging (for me anyway)
        if os.getuid() == 0:
            tarball.copyfile('/usr/portage/distfiles/' + tarball.basename())
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
            # Copy the patch file
            filesDir = ebuildDir/'files'
            filesDir.makedirs()
            Path(tmp/'exe/installs/gentoo/all-config.patch').copy(filesDir)
            # Remove any old source if it exists and we're supposed to download
            # it
            if '--local' not in sys.argv:
                oldTarball = Path('/usr/portage/distfiles/')/tarball.basename()
                if oldTarball.exists():
                    oldTarball.remove()
                os.environ['GENTOO_MIRRORS']=''
                os.system('ebuild %s fetch' % newEbuildFilename.basename())
            os.system('ebuild %s manifest' % newEbuildFilename.basename())
            os.system('ebuild %s digest' % newEbuildFilename.basename())
            if '--install' in sys.argv:
                os.system('ebuild %s install' % newEbuildFilename.basename())


if __name__ == '__main__':
    main()
