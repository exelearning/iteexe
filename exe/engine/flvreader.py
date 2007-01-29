from struct import unpack
from datetime import *
from datetime import timedelta

#from time import strftime
import logging

log = logging.getLogger(__name__)

class FixedOffset(tzinfo):
    """Fixed offset in minutes east from UTC."""
    def __init__(self, offset): self.__offset = timedelta(minutes = offset)
    def utcoffset(self, dt): return self.__offset
    def tzname(self, dt): return self.__name
    def dst(self, dt): return ZERO


class FLVReader(dict):
    """
    Reads metadata from FLV files
    """

    # Tag types
    AUDIO = 8
    VIDEO = 9
    META = 18
    UNDEFINED = 0

    def __init__(self, filename):
        """
        Pass the filename of an flv file and it will return a dictionary of meta
        data.
        """
        # Lock on to the file
        self.filename = filename
        self.file = open(filename, 'rb')
        self.signature = self.file.read(3)
        print  " Signature:", self.signature
        #assert self.signature == 'FLV', 'Not an flv file'
        self.version = self.readbyte()
        print "Version:", self.version
        flags = self.readbyte()
        self.typeFlagsReserved = flags >> 3
        self.typeFlagsAudio = (flags & 0x07) >> 2
        self.typeFlagsReserved2 = (flags & 0x03) >> 1
        self.typeFlagsVideo = (flags & 0x01)
        print "TypeFlagsReserved:",self.typeFlagsReserved
     
        print "TypeFlagsAudio:",self.typeFlagsAudio
        print "TypeFlagsReserved2:",self.typeFlagsReserved2  
        print "TypeFlagsVideo:",self.typeFlagsVideo
 
        self.dataOffset = self.readint()
        print "dataOffset:",self.dataOffset
        extraDataLen = self.dataOffset - self.file.tell()
        self.extraData = self.file.read(extraDataLen)
        self.readtag()

    def readtag(self):
        previousTagSize = self.readint()
        tagType = self.readbyte()
        dataSize = self.read24bit()
        timeStamp = self.read24bit()
        print timeStamp
        timeStampExtended = self.readbyte()
        streamID = self.read24bit()
        if tagType == self.AUDIO:
            print "Can't handle audio tags yet"
        elif tagType == self.VIDEO:
            print "Can't handle video tags yet"
        elif tagType == self.META:
            endpos = self.file.tell() + dataSize
            event = self.readAMFData()
            metaData = self.readAMFData()
            # We got the meta data.
            # Our job is done.
            # We are complete
            self.update(metaData)
        elif tagType == self.UNDEFINED:
            print "Can't handle undefined tags yet"

    def readint(self):
        data = self.file.read(4)
        return unpack('>I', data)[0]

    def readshort(self):
        data = self.file.read(2)
        return unpack('>H', data)[0]

    def readbyte(self):
        data = self.file.read(1)
        return unpack('B', data)[0]

    def read24bit(self):
        b1, b2, b3 = unpack('3B', self.file.read(3))
        return (b1 << 16) + (b2 << 8) + b3

    def readAMFData(self, dataType=None):
        if dataType is None:
            dataType = self.readbyte()
        print ('type(%s)' % dataType),
        funcs = {
            0: self.readAMFDouble,
            1: self.readAMFBoolean,
            2: self.readAMFString,
            3: self.readAMFObject,
            8: self.readAMFMixedArray,
           10: self.readAMFArray,
           11: self.readAMFDate
        }
        func = funcs.get(dataType)
        if func is None:
            log.warn("Unknown data type '%s' in '%s'" % (dataType, self.filename))
            raise Exception('Corrupt mate')
            return None
        else:
            if callable(func):
                val = func()
                print val
                return val

    def readAMFDouble(self):
        return unpack('>d', self.file.read(8))[0]

    def readAMFBoolean(self):
        return self.readbyte() == 1

    def readAMFString(self):
        size = self.readshort()
        return self.file.read(size)

    def readAMFObject(self):
        name = self.readAMFString()
        data = self.readAMFData()
        result = name, data

    def readAMFMixedArray(self):
        size = self.readint()
        result = {}
        for i in range(size):
            key = self.readAMFString()
            dataType = self.readbyte()
            if not key and dataType == 9:
                break
            print key, '=',
            result[key] = self.readAMFData(dataType)
        return result

    def readAMFArray(self):
        size = self.readint()
        result = []
        for i in range(size):
            result.append(self.readAMFData())
        return result

    def readAMFDate(self):
        
        delta = self.readAMFDouble()
        localOffsetMins = self.readshort()
        try:
            
            td = timedelta(milliseconds=delta)
            localOffset = FixedOffset(localOffsetMins)
            
            beg = datetime(1970, 1, 1, tzinfo=localOffset)
            
            timestamp = td + beg
         
            #timestamp = datetime.fromtimestamp(delta)
            return timestamp
            
        except ValueError:
            log.warning('Failed to convert %s to date' % delta)
            return datetime.fromtimestamp(0) # in relation to platform time 
        

if __name__ == '__main__':
    import sys
    from pprint import pprint
    if len(sys.argv) == 1:
        print 'Usage: %s filename [filename]...' % sys.argv[0]
        print 'Where filename is a .flv file'
        print 'eg. %s myfile.flv' % sys.argv[0]
    for fn in sys.argv[1:]:
        x = FLVReader(fn)
        pprint(x)
