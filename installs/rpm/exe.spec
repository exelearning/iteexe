%define pyver  %(%{__python} -c 'import sys ; print sys.version[:3]')
Summary: EXELearning SCORM course editor
Name: exe
Version: 0.23.1
Release: 7
Source0: exe-%{version}-source.tgz
License: GPL
Group: Applications/Editors
Vendor: The eXeLearning Project <exe@exelearning.org>
Url: http://exelearning.org/
BuildRoot: %{_tmppath}/exe-twisted-buildroot
Prefix: %{_prefix}
BuildArch: i386
BuildRequires: python-devel
Requires: python-abi = %(%{__python} -c "import sys ; print sys.version[:3]"), python-imaging, python-zope-interface

%description
eXe, the eLearning XHTML editor, is an authoring environment which enables
teachers to publish web content in standard package formats without the
need to become proficient in HTML or XML markup.  Content generated using
eXe can be used by any Learning Management System.

%prep
%setup -n exe
rm -f exe/webui/templates/mimetex.64.cgi exe/webui/templates/mimetex.exe
rm -f exe/webui/templates/mimetex-darwin.cgi
rm -f exe/msvcr71.dll

%build
python rpm-setup.py build

%install
python rpm-setup.py install --root=$RPM_BUILD_ROOT --record=INSTALLED_FILES
cp -a twisted nevow formless $RPM_BUILD_ROOT/usr/share/exe
rm -rf $RPM_BUILD_ROOT/usr/share/exe/temp_print_dirs
mkdir -p $RPM_BUILD_ROOT/usr/share/exe/temp_print_dirs
echo /usr/share/exe/twisted >> INSTALLED_FILES
echo /usr/share/exe/nevow >> INSTALLED_FILES
echo /usr/share/exe/formless >> INSTALLED_FILES
echo /usr/share/exe/temp_print_dirs >> INSTALLED_FILES

sed -i.bak -e 's/ /\ /g' INSTALLED_FILES

%clean
rm -rf $RPM_BUILD_ROOT

%files -f INSTALLED_FILES
%defattr(-,root,root)
%attr(755,root,root) /usr/share/exe/templates/mimetex.cgi
%attr(777,root,root) /usr/share/exe/temp_print_dirs
%doc COPYING NEWS README

%changelog
* Wed May 09 2007 Jim Tittsler <jim@exelearning.org>
- bring up to date, including our custom twisted/nevow

