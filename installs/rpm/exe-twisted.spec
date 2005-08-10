Summary: Web server for eXe
Name: exe-twisted
Version: 2.0
Release: 1
Source0: exe-twisted-2.0.tgz
License: GPL
Group: Development/Libraries
BuildRoot: %{_tmppath}/exe-twisted-buildroot
Prefix: %{_prefix}
BuildArch: noarch
Vendor: University of Auckland <exe@cfdl.auckland.ac.nz>
Url: http://exe.cfdl.auckland.ac.nz

%description
Installs ZopeInterface-3.0.1, Twisted-2.0.0 (with jelly.patch)
TwistedWeb-0.5.0 and nevow-0.4.1

%prep
%setup

%build
cd ZopeInterface-3.0.1/
python setup.py build
cd ..
cd Twisted-2.0.0/
python setup.py build
cd ..
cd TwistedWeb-0.5.0/
python setup.py build
cd ..
cd nevow-0.4.1/
python setup.py build
cd ..

%install
cd ZopeInterface-3.0.1/
python setup.py install --root=$RPM_BUILD_ROOT
cd ..
cd Twisted-2.0.0/
python setup.py install --root=$RPM_BUILD_ROOT
cd ..
cd TwistedWeb-0.5.0/
python setup.py install --root=$RPM_BUILD_ROOT
cd ..
cd nevow-0.4.1/
python setup.py install --root=$RPM_BUILD_ROOT 
cd ..

%clean
rm -rf $RPM_BUILD_ROOT


