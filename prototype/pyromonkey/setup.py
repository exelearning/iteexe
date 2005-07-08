import os
from distutils.core import setup, Extension
import string
Moz="/home/matthew/work/downloads/mozilla"
MozDist=Moz+"/dist"


CFLAGS = os.popen("pkg-config --cflags gtk+-2.0 pygtk-2.0 mozilla-gtkmozembed").read()[:-1]
LDFLAGS = os.popen("pkg-config --libs gtk+-2.0 pygtk-2.0 mozilla-gtkmozembed").read()[:-1]

CFLAGS = string.split(CFLAGS)
LDFLAGS = string.split(LDFLAGS)


setup(name='pyromonkey',
      version='1.0',
      ext_modules=[Extension('_pyromonkey', ['pyromonkey.cpp', 'gtkmoz.c'],
                             include_dirs=[MozDist+"/include/embed_base",
                                           MozDist+"/include/string",
                                           MozDist+"/include/xpcom",
                                           MozDist+"/include/widget",
                                           MozDist+"/include/docshell",
                                           MozDist+"/include/nspr",
                                           MozDist+"/include/gfx",
                                           MozDist+"/include/webbrwsr",
                                           MozDist+"/include/uriloader",
                                           MozDist+"/include/necko",
                                           Moz+"/extensions/python/xpcom/src",
                                           ],
                             library_dirs = [Moz+"/extensions/python/xpcom/src",
                                             MozDist+"/lib"],
                             libraries = ["nspr4", "plc4", "plds4", 
                                          "xpcomcomponents_s", 
                                          "embed_base_s", "_xpcom",
                                          ],
                             extra_compile_args=CFLAGS, extra_link_args=LDFLAGS)
                   ],
      )
