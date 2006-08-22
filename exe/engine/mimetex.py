import sys, os, shutil

def compile(latex):
    """
    Takes a latex string and returns the path to a gif rendering
    'latex' is the latex string
    'gifFileName' if passed is where the gif will be generated
    The caller is responsible for deleting the temp file after.

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
    if os.name == 'posix':
        processOutput = os.popen('./mimetex.cgi -d "%s"' % latex, 'rb')
    else:
        processOutput = os.spawnv(os.P_WAIT, 'mimetex', ('-d', latex))
    outputFileName = os.tmpnam()
    outputFile = open(outputFileName, 'w')
    shutil.copyfileobj(processOutput, outputFile)
    outputFile.close()
    return outputFileName

