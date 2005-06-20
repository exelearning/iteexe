import os
from distutils.core import setup, Extension

Moz="/home/matthew/work/downloads/mozilla"
MozDist=Moz+"/dist"

setup(name='pyfoxutil',
      version='1.0',
      ext_modules=[Extension('_pyfoxutil', ['pyfoxutil.cpp'],
                             include_dirs=[MozDist+"/include/embed_base",
                                           MozDist+"/include/string",
                                           MozDist+"/include/xpcom",
                                           MozDist+"/include/widget",
                                           MozDist+"/include/nspr",
                                           MozDist+"/include/gfx",
                                           MozDist+"/include/webbrwsr",
                                           MozDist+"/include/uriloader",
                                           Moz+"/extensions/python/xpcom/src",
                                           ],
                             library_dirs = [Moz+"/extensions/python/xpcom/src",
                                             MozDist+"/lib"],
                             libraries = ["nspr4", "plc4", "plds4", 
                                          "xpcomcomponents_s", 
                                          "embed_base_s", "_xpcom",
                                          ])
                   ],
      )
