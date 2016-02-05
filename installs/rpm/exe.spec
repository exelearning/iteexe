%define ver 0.95.1

%define pyver  %(%{__python} -c 'import sys ; print sys.version[:3]')

%define debug_package %{nil}

Summary: The EXtremely Easy to use eLearning authoring tool
Name: intef-exe
Version: %{?clversion}%{!?clversion:%{ver}}
Release: %{?clrelease}%{?dist:%{dist}}%{!?clrelease:1%{?dist:%{dist}}}
Epoch: 1
Source0: intef-exe-%{version}-source.tgz
License: GPL
Group: Applications/Editors
Vendor: The INTEF-eXe Project <admin@exelearning.net>
Url: http://exelearning.net/
BuildRoot: %{_tmppath}/exe-buildroot
Prefix: %{_prefix}
ExclusiveArch: i686
BuildRequires: python-devel
BuildRequires: python >= %{pyver}
Requires: python >= %{pyver}, python-setuptools, python-imaging, python-zope-interface, python-chardet, python-lxml, python-feedparser, mimetex, python-BeautifulSoup, google-api-python-client, python-suds, python-requests-oauthlib, python-dateutil
Obsoletes: exe-twisted, exe

%description
eXe, the eLearning editor, is an authoring environment which enables
teachers to publish web content in standard package formats (like IMS
Content Packages and SCORM) without the need to become proficient in HTML
or XML markup.  Content generated using eXe can be used by any Learning
Management System.

%prep
%setup -n exe
# remove the other platform binaries
rm -f exe/webui/templates/mimetex.exe
rm -f exe/webui/templates/mimetex-darwin.cgi
rm -f twisted/spread/cBanana.so
rm -f twisted/protocols/_c_urlarg.so

%build
rm -rf $RPM_BUILD_ROOT
python rpm-setup.py build

%install
python rpm-setup.py install --root=$RPM_BUILD_ROOT
cp -a twisted nevow formless $RPM_BUILD_ROOT%{_datadir}/exe
mkdir -p $RPM_BUILD_ROOT%{_datadir}/icons/hicolor/48x48/apps
cp exe.png $RPM_BUILD_ROOT%{_datadir}/icons/hicolor/48x48/apps/
mkdir -p $RPM_BUILD_ROOT%{_datadir}/applications/
cp exe.desktop $RPM_BUILD_ROOT%{_datadir}/applications/
mkdir -p $RPM_BUILD_ROOT%{_datadir}/mime/packages/
cp exe.xml $RPM_BUILD_ROOT%{_datadir}/mime/packages/

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,root,root)
%{_bindir}/exe
%{_bindir}/exe_do
%{_libdir}/python%{pyver}/site-packages/exe
%{_libdir}/python%{pyver}/site-packages/exe-%{version}*-py%{pyver}.egg-info
%{_datadir}/exe
%{_datadir}/icons/hicolor/48x48/apps/exe.png
%config %{_datadir}/mime/packages/exe.xml
%config %{_datadir}/applications/exe.desktop
%doc COPYING NEWS README

%post
/usr/bin/update-mime-database /usr/share/mime &> /dev/null

%changelog
* Tue Nov 18 2008 Jim Tittsler <jim@exelearning.org>
- update spec file to work with Fedora 9

* Mon Jul 09 2007 Jim Tittsler <jim@exelearning.org>
- update spec file to work with Fedora 7
- use files list instead of recording INSTALLED_FILES in setup.py to catch .pyo files

* Mon May 28 2007 Jim Tittsler <jim@exelearning.org>
- add desktop file and icon
- add MIME type and .elp glob to associate file types

* Thu May 24 2007 Jim Tittsler <jim@exelearning.org>
- remove temp_print_dirs workaround from datadir/exe

* Tue May 22 2007 Jim Tittsler <jim@exelearning.org>
- optional clversion and clrelease defines to improve automation
- remove more spurious binaries for other platforms
- require firefox

* Mon May 21 2007 Jim Tittsler <jim@exelearning.org>
- make 'Release:' distribution specific

* Wed May 09 2007 Jim Tittsler <jim@exelearning.org>
- bring up to date, including our custom twisted/nevow

