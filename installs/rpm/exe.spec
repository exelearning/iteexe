Summary: EXELearning SCORM course editor
Name: exe
Version: 0.17
Release: 1
Source0: exe.tgz
License: GPL
Group: Applications/Editors
BuildRoot: %{_tmppath}/exe-twisted-buildroot Prefix: %{_prefix}
BuildArch: noarch
Vendor: The EXELearning project <exe@exelearning.org>
Url: http://exelearning.org

%description
The eXe project is an authoring environment to enable teachers to publish
web content without the need to become proficient in HTML or XML markup.
Content generated using eXe can be used by any Learning Management System.

%prep
%setup

%build
cd exe
python2.4 setup.py build
cd ..
cd nevow
python2.4 /usr/lib/python2.4/compileall.sh .
python2.4 -O /usr/lib/python2.4/compileall.sh .
cd ..

%install
cd nevow/
python setup.py install --root=$RPM_BUILD_ROOT  --record=INSTALLED_FILES
cat INSTALLED_FILES > ../INSTALLED_FILES
cd ..
cd exe
python2.4 setup.py install --root=$RPM_BUILD_ROOT --record=INSTALLED_FILES
cat INSTALLED_FILES >> ../INSTALLED_FILES
cd ..

%clean
rm -rf $RPM_BUILD_ROOT

%files -f INSTALLED_FILES
%defattr(-,root,root)
