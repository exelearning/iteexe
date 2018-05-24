# Building from source on Mac OS X

## Prerequisites
First of all, you must install [XCode](https://developer.apple.com/xcode/) by executing:

```console
$ xcode-select --install
```

Also install [Git](https://git-scm.com/) from: https://git-scm.com/download/mac

And finally, you should install [Homebrew](https://brew.sh/) from : https://brew.sh/

Note: Homebrew is not required to generate eXe packages, but is used for simplicity on installing its prerequisites.


## Python environment preparation
Py2app won't create a standalone app if you use the default version of Python shipped with OS X, so you need to install a new one in order to be able to do it.

The easiest way of doing this is by using [pyenv](https://github.com/pyenv/pyenv).

Install it by executing:

```console
$ brew install pyenv
```

Install Python 2.7 by executing:

```console
$ env PYTHON_CONFIGURE_OPTS="--enable-framework" pyenv install 2.7.13
$ pyenv shell 2.7.13
$ easy_install pip
```

#### Note
This should be done only once. For future builds of eXe you should only have to execute the following command to use the new Python environment:

```console
$ pyenv shell 2.7.13
```

## libjpeg installation
Before installing Pillow you must make sure to have "libjpeg" installed. Otherwise eXe won't be able to generate image thumbnails for JPEG images.
You can install it with HomeBrew using:

```console
$ brew install libjpeg
```

## Python modules installation
Once you have the new Python environment setup, you must install all the required packages:


```console
$ pip install py2app
$ pip install Pillow
$ pip install zope.interface
$ pip install libxml2
$ pip install chardet
$ pip install gitpython
$ pip install lxml==2.2.8
$ pip install suds
$ pip install requests-oauthlib
$ pip install python-dateutil
$ pip install httplib2
$ pip install BeautifulSoup
$ pip install feedparser
$ pip install oauthlib
$ pip install webassets
$ pip install cssmin
$ pip install python-dateutil
```

#### Important note!
You should at least version 0.14 of py2app installed for eXe to work properly.

## Empty image creation
In order to build a .dmg image for distribution you will have to create a new empty disk image.

Open Disk utility and create a new image with the following options:
* Save as: exe
* Where: installs/osx/
* Name: exe
* Size: 500 MB
* Format: Mac OS Extended (Journaled)
* Encryption: None
* Partitions: Single partition - GUID Partition Map
* Image format: read/write disk image

## Code download
Once you have all the requirements set up, you have to download the source code. There is two methods to this:

1. Using **GIT** (You must have *git* installed in your system):

  First you have to navigate to the folder you want the source code to download into. And then you have to execute this command:
  ```console
  $ git clone https://github.com/exelearning/iteexe.git
  ```

2. Downloading a **ZIP file** with the source code:

  You can do this by going to the [GitHub homepage of this project](https://github.com/exelearning/iteexe), pressing on *Clone or download* and then on *Download ZIP*. Unzip the file in your desired folder.

## Package generation
With everything ready, the only thing left to do is to generate the package. For this you simply have to execute the following commands:

```console
$ cd installs/osx
$ python make.py -p
```

#### Note
If you don't want to create a .dmg image, you can build only the App by removing the "-p" argument like this:

```console
$ python make.py
```
