%define ver 0.23.1

%define pyver  %(%{__python} -c 'import sys ; print sys.version[:3]')

Summary: EXELearning SCORM course editor
Name: exe
Version: %{?clversion}%{!?clversion:%{ver}}
Release: %{?clrelease}%{!?clrelease:1%{?dist:.%{dist}}}
Source0: exe-%{version}-source.tgz
License: GPL
Group: Applications/Editors
Vendor: The eXeLearning Project <exe@exelearning.org>
Url: http://exelearning.org/
BuildRoot: %{_tmppath}/exe-buildroot
Prefix: %{_prefix}
ExclusiveArch: i386
BuildRequires: python-devel
BuildRequires: python >= 2.4
Requires: python-abi = %{pyver}
Requires: python-imaging, python-zope-interface
Requires: firefox
Obsoletes: exe-twisted

%description
eXe, the eLearning XHTML editor, is an authoring environment which enables
teachers to publish web content in standard package formats without the
need to become proficient in HTML or XML markup.  Content generated using
eXe can be used by any Learning Management System.

%prep
%setup -n exe
# remove the other platform binaries
rm -f exe/webui/templates/mimetex.64.cgi exe/webui/templates/mimetex.exe
rm -f exe/webui/templates/mimetex-darwin.cgi
rm -f exe/msvcr71.dll
rm -f twisted/spread/cBanana.so
rm -f twisted/protocols/_c_urlarg.so

%build
rm -rf $RPM_BUILD_ROOT
python rpm-setup.py build

%install
python rpm-setup.py install --root=$RPM_BUILD_ROOT --record=INSTALLED_FILES
cp -a twisted nevow formless $RPM_BUILD_ROOT%{_datadir}/exe
rm -rf $RPM_BUILD_ROOT%{_datadir}/exe/temp_print_dirs
mkdir -p $RPM_BUILD_ROOT%{_datadir}/exe/temp_print_dirs
echo %{_datadir}/exe/twisted >> INSTALLED_FILES
echo %{_datadir}/exe/nevow >> INSTALLED_FILES
echo %{_datadir}/exe/formless >> INSTALLED_FILES
echo %{_datadir}/exe/temp_print_dirs >> INSTALLED_FILES

sed -i.bak -e 's/ /\ /g' INSTALLED_FILES

%clean
rm -rf $RPM_BUILD_ROOT

%files -f INSTALLED_FILES
%defattr(-,root,root)
%attr(755,root,root) %{_datadir}/exe/templates/mimetex.cgi
%attr(777,root,root) %{_datadir}/exe/temp_print_dirs
%doc COPYING NEWS README

%changelog
* Tue May 22 2007 Jim Tittsler <jim@exelearning.org>
- optional clversion and clrelease defines to improve automation
- remove more spurious binaries for other platforms
- require firefox

* Mon May 21 2007 Jim Tittsler <jim@exelearning.org>
- make 'Release:' distribution specific

* Wed May 09 2007 Jim Tittsler <jim@exelearning.org>
- bring up to date, including our custom twisted/nevow

