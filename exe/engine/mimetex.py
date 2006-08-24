import sys, os, shutil
import warnings
from subprocess import Popen, PIPE
warnings.filterwarnings('ignore', 'tmpnam is a potential security risk to your program')

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
    self.resource = Resource(self.package, tempFileName)
    Path(tempFileName).remove()

    to render:
        '<img src="%s"/>' self.resource.path
        (or copy image with text idevice if this doesn't work)
    """
    # Must pass 0-9 to api
    if os.name == 'nt':
        cmd = 'mimetex.exe'
    else:
        cmd = './mimetex.cgi'
    process = Popen([cmd, cmd, '-d', latex, '-s', str(int(fontsize)-1)], bufsize=8092, stdout=PIPE, stderr=PIPE)
    returnCode = process.wait()
    if returnCode != 0:
        raise Exception("Couldn't parse latex:\n%s" % process.stderr)
    outputFileName = os.tmpnam()
    outputFile = open(outputFileName, 'wb')
    shutil.copyfileobj(process.stdout, outputFile)
    outputFile.close()
    process.stderr.close()
    process.stdout.close()
    return outputFileName

if __name__ == '__main__':
    outname = compile(sys.argv[1], sys.argv[2])
    shutil.move(outname, 'x.gif')
