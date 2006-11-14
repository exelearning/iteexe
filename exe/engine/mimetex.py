import sys, os, shutil
import signal
import logging
import warnings
from exe.engine.path import Path
from subprocess import Popen, PIPE
warnings.filterwarnings('ignore', 'tmpnam is a potential security risk to your program')
log = logging.getLogger(__name__)

def compile(latex, fontsize=4):
    """
    Takes a latex string and returns the path to a gif rendering
    'latex' is the latex string
    'gifFileName' if passed is where the gif will be generated
    The caller is responsible for deleting the temp file after.
    'fontsize' is 1-10

    Call like so:
    if self.resource is not None:
        self.resource.delete()
    tempFileName = compile('x^y')
    self.resource = Resource(self, tempFileName)
    Path(tempFileName).remove()

    to render:
        '<img src="%s"/>' self.resource.path
        (or copy image with text idevice if this doesn't work)
    """
    # Import global application instance
    from exe.application import application
    if os.name == 'nt':
        cmd = application.config.webDir/'templates'/'mimetex.exe'
    elif sys.platform[:6] == "darwin":
        cmd = application.config.webDir/'templates'/'mimetex-darwin.cgi'
    else:
        cmd = application.config.webDir/'templates'/'mimetex.cgi'
    log.debug(u"mimetex command=%s" % cmd)
    # Twisted uses SIGCHLD in a way that conflicts with the Popen() family
    # (see Twisted FAQ)  So save their handler and temporarily restore default.
    if hasattr(signal, 'SIGCHLD'):
        oldsig = signal.getsignal(signal.SIGCHLD)
        signal.signal(signal.SIGCHLD, signal.SIG_DFL)
    try:
        process = Popen([cmd, '-d', latex, '-s', str(int(fontsize)-1)], bufsize=8192, stdout=PIPE, stderr=PIPE)
        returnCode = process.wait()
        log.debug(u"mimetex returnCode=%d", returnCode)
        if returnCode != 0:
            raise Exception("Couldn't parse latex:\n%s" % process.stderr)
    finally:
        if hasattr(signal, 'SIGCHLD'):
            signal.signal(signal.SIGCHLD, oldsig)
    outputFileName = os.tmpnam()
    outputFile = open(outputFileName, 'wb')
    shutil.copyfileobj(process.stdout, outputFile)
    outputFile.close()
    process.stderr.close()
    process.stdout.close()
    outputFileName = Path(outputFileName).rename(outputFileName+'.gif')
    return outputFileName

if __name__ == '__main__':
    outname = compile(sys.argv[1], sys.argv[2])
    shutil.move(outname, 'x.gif')
