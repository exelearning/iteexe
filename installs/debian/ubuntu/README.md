# Building from source on Debian/Ubuntu

## Build tools installation
First of all, you must install build tools:
```console
$ apt-get install build-essential debhelper xsltproc docbook-xml docbook-xsl python-all python-setuptools
```

## Python modules installation
Next, you need to install the required python modules:
```console
$ apt-get install python-feedparser python-beautifulsoup python-zope python-imaging python-suds python-requests-oauthlib python-dateutil python-lxml mimetex
```
#### Important note! (Ubuntu versions below 14.04)
The python package `python-requests-oauthlib` is not available on the official Ubuntu repositories for any Ubuntu version below 14.04. For this case, you must remove this package from the commando like so:
```console
$ apt-get install python-feedparser python-beautifulsoup python-zope python-imaging python-suds python-dateutil python-lxml mimetex
```
Then you must install a Python Package Manager like [pip](https://pip.pypa.io/) and install the package from there:
```console
$ apt-get install python-pip
$ pip install requests_oauthlib
```

## Code download
Once you have all the requirements set up, you have to download the source code. There is two methods to this:
1. Using **GIT** (You must have *git* installed in your system):
		First you have to navigate to the folder you want the source code to download into. And then you have to execute this command:
        
	```console
	$ git clone https://github.com/exelearning/iteexe.git
	```
    
2. Downloading a **ZIP file** with the source code:
		You can do this by going to the [GitHub homepage of this project](https://github.com/exelearning/iteexe), pressing on *Clone or download* and then on *Download ZIP*. Unzip the file in your desired folder.

#### Important note! (Ubuntu versions below 14.04)
To be able to install the generated package you need to remove `python-requests-oauthlib` from its depedencies. This can be acomplished by editing the file "debian/control" and changing this line:
```
Depends: ${python:Depends}, ${misc:Depends}, python-setuptools, python-zopeinterface (>=3.0.0-6) | python-zope.interface, python-imaging, python-chardet, python-lxml, iceweasel | www-browser, python-feedparser, mimetex, python-beautifulsoup, python-suds, python-requests-oauthlib, python-dateutil
```
For this one:
```
Depends: ${python:Depends}, ${misc:Depends}, python-setuptools, python-zopeinterface (>=3.0.0-6) | python-zope.interface, python-imaging, python-chardet, python-lxml, iceweasel | www-browser, python-feedparser, mimetex, python-beautifulsoup, python-suds, python-dateutil
```

## .deb file creation
Now that you have the code, either by downloading a **ZIP file** or by using **GIT**, we can proceed to the *.deb* file making process.
First you have to navigate to the folder where we downloaded the source code and then to this folder: "installs/debian/ubuntu"
Once you are there, you can simply execute:
```console
$ python make.py
```

Now you have a .deb package that you can install either by doing double click on it or by executing:
```console
$ dpkg -i intef-exe_<version>.deb
```