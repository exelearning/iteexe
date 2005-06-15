import os
from distutils.core import setup, Extension

MozDist="/home/djm/uoa/firefox/mozilla/dist"

setup(name='initEmbedding',
      version='1.0',
      ext_modules=[Extension('_initEmbedding', ['initEmbedding.cpp'],
                             include_dirs=[MozDist+"/include/embed_base",
                                           MozDist+"/include/string",
                                           MozDist+"/include/xpcom",
                                           MozDist+"/include/nspr"],
                             library_dirs = [MozDist+"/lib"],
                             libraries = ["xpcom", "plc4", "plds4", "nspr4",
                                          "xpcomcomponents_s", 
                                          "embed_base_s"])
                   ],
      )
