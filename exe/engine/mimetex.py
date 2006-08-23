import sys, os, shutil
import warnings
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
    if os.name == 'posix':
        pout = os.popen('./mimetex.cgi -d "%s" -s %s' % (latex, fontsize-1), 'rb')
    else:
        pout = os.popen('mimetex -d "%s" -s "%s"' % (latex, fontsize-1), 'rb')
    outputFileName = os.tmpnam()
    outputFile = open(outputFileName, 'wb')
    shutil.copyfileobj(pout, outputFile)
    outputFile.close()
    return outputFileName

if __name__ == '__main__':
    outname = compile(sys.argv[1], sys.argv[2])
    shutil.move(outname, 'x.gif')
