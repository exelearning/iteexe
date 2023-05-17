#!/bin/bash
versionOS=$(cat /etc/os-release | grep ^NAME | grep Ubuntu  | cut -d\" -f2)
releaseOS=$(cat /etc/os-release | grep ^VERSION_ID |  cut -d\" -f2 | cut -d"." -f1)
#Also we can use  ID_LIKE="ubuntu debian" and ubuntu_codename
#VERSION_CODENAME=vanessa
#UBUNTU_CODENAME=jammy
if [ "$versionOS" = "Ubuntu" -a $releaseOS -ge 22 ]; then
        /usr/bin/eXe-2.8.glibc2.28-x86_64.AppImage --appimage-extract-and-run 
  else
	/usr/bin/eXe-2.8.glibc2.28-x86_64.AppImage
  fi
