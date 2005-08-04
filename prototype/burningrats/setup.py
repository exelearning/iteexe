# setup.py
import glob
from distutils.core import setup
import py2exe
      
      
opts = {
 "py2exe": {
   "includes": ["pango", "atk", "gobject", "gtk"],
   "dll_excludes": [ "gtkmozembed.dll", "iconv.dll", "intl.dll", 
"libatk-1.0-0.dll", "libgdk-win32-2.0-0.dll", "libgdk_pixbuf-2.0-0.dll", 
"libglib-2.0-0.dll", "libgmodule-2.0-0.dll", "libgobject-2.0-0.dll", 
"libgthread-2.0-0.dll", "libgtk-win32-2.0-0.dll", "libpango-1.0-0.dll", 
"libpangowin32-1.0-0.dll", "nspr4.dll", "plc4.dll", "plds4.dll", "xpcom.dll" ]
 }
}
setup(windows=["burningrats.py"],
      version="1.1",
      options=opts,
     )

