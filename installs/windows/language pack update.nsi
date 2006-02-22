; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "eXe Language Pack update"

!define EXE_VERSION "0.13.1"
!define APPNAMEANDVERSION "${APPNAME} ${EXE_VERSION}"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$PROGRAMFILES\exe"
InstallDirRegKey HKLM "Software\${APPNAME}" ""
Icon "..\..\eXe_icon.ico"
OutFile "eXe_language_update.exe"

Section Install
   SetOutPath "$INSTDIR\locale"
   File /r "..\..\exe\locale\??"
SectionEnd

BrandingText "EXE Language Pack Update"
