#!C:\Python25\python

# specify any options necessary when building installers
nsis_options = ''

# if makensis.exe is not in your PATH, specify explicit pathname here
nsis = 'c:\Program Files\NSIS\makensis.exe'

import subprocess

# get the version
import sys
sys.path.insert(0, '../..')
from exe.engine import version
versions = "/DEXE_VERSION=%s /DEXE_REVISION=%s" % (version.release,
                                                   version.revision)

print versions

# make the installers
for installer in ('exe.nsi', 'exe.standalone.nsi'):
	try:
	    pnsis = subprocess.Popen('%s %s %s %s' %
				     ('makensis', nsis_options, versions, installer))
	except OSError:
	    try:
		pnsis = subprocess.Popen('%s %s %s %s' %
					 (nsis, nsis_options, versions, installer))
	    except OSError:
		print '*** unable to run makensis, check PATH or explicit pathname'
		print '    in make.py'

