# -*- test-case-name: twisted.test.test_banana -*-
#
# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.


"""Banana -- s-exp based protocol.

Stability: semi-stable

Future Plans: This module is almost entirely stable.  The same caveat applies
to it as applies to L{twisted.spread.jelly}, however.  Read its future plans
for more details.

@author: U{Glyph Lefkowitz<mailto:glyph@twistedmatrix.com>}
"""

__version__ = "$Revision: 1.37 $"[11:-2]

from twisted.internet import protocol
from twisted.persisted import styles
from twisted.python import log

import types, copy, cStringIO, struct

class BananaError(Exception):
    pass

def int2b128(integer, stream):
    if integer == 0:
        stream(chr(0))
        return
    assert integer > 0, "can only encode positive integers"
    while integer:
        stream(chr(integer & 0x7f))
        integer = integer >> 7

def b1282int(st):
    oneHundredAndTwentyEight = 128l
    i = 0
    place = 0
    for char in st:
        num = ord(char)
        i = i + (num * (oneHundredAndTwentyEight ** place))
        place = place + 1
    if i <= 2147483647:
        return int(i)
    else:
        return i

# delimiter characters.
LIST     = chr(0x80)
INT      = chr(0x81)
STRING   = chr(0x82)
NEG      = chr(0x83)
FLOAT    = chr(0x84)
# "optional" -- these might be refused by a low-level implementation.
LONGINT  = chr(0x85)
LONGNEG  = chr(0x86)
# really optional; this is is part of the 'pb' vocabulary
VOCAB    = chr(0x87)

HIGH_BIT_SET = chr(0x80)

SIZE_LIMIT = 640 * 1024   # 640k is all you'll ever need :-)

class Pynana(protocol.Protocol, styles.Ephemeral):
    knownDialects = ["pb", "none"]

    def connectionReady(self):
        """Surrogate for connectionMade
        Called after protocol negotiation.
        """

    def _selectDialect(self, dialect):
        self.currentDialect = dialect
        self.connectionReady()

    def callExpressionReceived(self, obj):
        if self.currentDialect:
            self.expressionReceived(obj)
        else:
            # this is the first message we've received
            if self.isClient:
                # if I'm a client I have to respond
                for serverVer in obj:
                    if serverVer in self.knownDialects:
                        self.sendEncoded(serverVer)
                        self._selectDialect(serverVer)
                        break
                else:
                    # I can't speak any of those dialects.
                    log.msg('error losing')
                    self.transport.loseConnection()
            else:
                if obj in self.knownDialects:
                    self._selectDialect(obj)
                else:
                    # the client just selected a protocol that I did not suggest.
                    log.msg('freaky losing')
                    self.transport.loseConnection()


    def connectionMade(self):
        self.currentDialect = None
        if not self.isClient:
            self.sendEncoded(self.knownDialects)

    def gotItem(self, item):
        l = self.listStack
        if l:
            l[-1][1].append(item)
        else:
            self.callExpressionReceived(item)

    buffer = ''

    def dataReceived(self, chunk):
        buffer = self.buffer + chunk
        listStack = self.listStack
        gotItem = self.gotItem
        while buffer:
            assert self.buffer != buffer, "This ain't right: %s %s" % (repr(self.buffer), repr(buffer))
            self.buffer = buffer
            pos = 0
            for ch in buffer:
                if ch >= HIGH_BIT_SET:
                    break
                pos = pos + 1
            else:
                if pos > 64:
                    raise BananaError("Security precaution: more than 64 bytes of prefix")
                return
            num = buffer[:pos]
            typebyte = buffer[pos]
            rest = buffer[pos+1:]
            if len(num) > 64:
                raise BananaError("Security precaution: longer than 64 bytes worth of prefix")
            if typebyte == LIST:
                num = b1282int(num)
                if num > SIZE_LIMIT:
                    raise BananaError("Security precaution: List too long.")
                listStack.append((num, []))
                buffer = rest
            elif typebyte == STRING:
                num = b1282int(num)
                if num > SIZE_LIMIT:
                    raise BananaError("Security precaution: String too long.")
                if len(rest) >= num:
                    buffer = rest[num:]
                    gotItem(rest[:num])
                else:
                    return
            elif typebyte == INT:
                buffer = rest
                num = b1282int(num)
                gotItem(int(num))
            elif typebyte == LONGINT:
                buffer = rest
                num = b1282int(num)
                gotItem(long(num))
            elif typebyte == LONGNEG:
                buffer = rest
                num = b1282int(num)
                gotItem(-long(num))
            elif typebyte == NEG:
                buffer = rest
                num = -b1282int(num)
                gotItem(num)
            elif typebyte == VOCAB:
                buffer = rest
                num = b1282int(num)
                gotItem(self.incomingVocabulary[num])
            elif typebyte == FLOAT:
                if len(rest) >= 8:
                    buffer = rest[8:]
                    gotItem(struct.unpack("!d", rest[:8])[0])
                else:
                    return
            else:
                raise NotImplementedError(("Invalid Type Byte %r" % (typebyte,)))
            while listStack and (len(listStack[-1][1]) == listStack[-1][0]):
                item = listStack.pop()[1]
                gotItem(item)
        self.buffer = ''


    def expressionReceived(self, lst):
        """Called when an expression (list, string, or int) is received.
        """
        raise NotImplementedError()


    outgoingVocabulary = {
        # Jelly Data Types
        'None'           :  1,
        'class'          :  2,
        'dereference'    :  3,
        'reference'      :  4,
        'dictionary'     :  5,
        'function'       :  6,
        'instance'       :  7,
        'list'           :  8,
        'module'         :  9,
        'persistent'     : 10,
        'tuple'          : 11,
        'unpersistable'  : 12,

        # PB Data Types
        'copy'           : 13,
        'cache'          : 14,
        'cached'         : 15,
        'remote'         : 16,
        'local'          : 17,
        'lcache'         : 18,

        # PB Protocol Messages
        'version'        : 19,
        'login'          : 20,
        'password'       : 21,
        'challenge'      : 22,
        'logged_in'      : 23,
        'not_logged_in'  : 24,
        'cachemessage'   : 25,
        'message'        : 26,
        'answer'         : 27,
        'error'          : 28,
        'decref'         : 29,
        'decache'        : 30,
        'uncache'        : 31,
        }

    incomingVocabulary = {}
    for k, v in outgoingVocabulary.items():
        incomingVocabulary[v] = k

    def __init__(self, isClient=1):
        self.listStack = []
        self.outgoingSymbols = copy.copy(self.outgoingVocabulary)
        self.outgoingSymbolCount = 0
        self.isClient = isClient

    def sendEncoded(self, obj):
        io = cStringIO.StringIO()
        self._encode(obj, io.write)
        value = io.getvalue()
        self.transport.write(value)

    def _encode(self, obj, write):
        if isinstance(obj, types.ListType) or isinstance(obj, types.TupleType):
            if len(obj) > SIZE_LIMIT:
                raise BananaError, \
                      "list/tuple is too long to send (%d)" % len(obj)
            int2b128(len(obj), write)
            write(LIST)
            for elem in obj:
                self._encode(elem, write)
        elif isinstance(obj, types.IntType):
            if obj >= 0:
                int2b128(obj, write)
                write(INT)
            else:
                int2b128(-obj, write)
                write(NEG)
        elif isinstance(obj, types.LongType):
            if obj >= 0l:
                int2b128(obj, write)
                write(LONGINT)
            else:
                int2b128(-obj, write)
                write(LONGNEG)
        elif isinstance(obj, types.FloatType):
            write(FLOAT)
            write(struct.pack("!d", obj))
        elif isinstance(obj, types.StringType):
            # TODO: an API for extending banana...
            if (self.currentDialect == "pb") and self.outgoingSymbols.has_key(obj):
                symbolID = self.outgoingSymbols[obj]
                int2b128(symbolID, write)
                write(VOCAB)
            else:
                if len(obj) > SIZE_LIMIT:
                    raise BananaError, \
                          "string is too long to send (%d)" % len(obj)
                int2b128(len(obj), write)
                write(STRING)
                write(obj)
        else:
            raise BananaError, "could not send object: %s" % repr(obj)
Banana = Pynana


class Canana(Pynana):

    def connectionMade(self):
        self.state = cBanana.newState()
        self.cbuf = cBanana.newBuf()
        Pynana.connectionMade(self)

    def sendEncoded(self, obj):
        self.cbuf.clear()
        cBanana.encode(obj, self.cbuf)
        rv = self.cbuf.get()
        self.transport.write(rv)

    def dataReceived(self, chunk):
        buffer = self.buffer + chunk
        processed = cBanana.dataReceived(self.state, buffer, self.callExpressionReceived)
        self.buffer = buffer[processed:]

#try:
#    import cBanana
#    cBanana.pyb1282int = b1282int
#    cBanana.pyint2b128 = int2b128
#except ImportError:
#    pass
#else:
#    Banana = Canana


# For use from the interactive interpreter
_i = Banana()
_i.connectionMade()
_i._selectDialect("none")


def encode(lst):
    """Encode a list s-expression."""
    io = cStringIO.StringIO()
    _i.transport = io
    _i.sendEncoded(lst)
    return io.getvalue()


def decode(st):
    """Decode a banana-encoded string."""
    l=[]
    _i.expressionReceived = l.append
    _i.dataReceived(st)
    _i.buffer = ''
    del _i.expressionReceived
    return l[0]
