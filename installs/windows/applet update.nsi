; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "eXe Applet iDevice update"

!define EXE_VERSION "0.15"
!define APPNAMEANDVERSION "${APPNAME} ${EXE_VERSION}"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$APPDATA\exe\idevices"
Icon "..\..\eXe_icon.ico"
OutFile "eXe_applet_update.exe"

Section Install
   SetOutPath "$APPDATA\exe\idevices"
   File "..\..\exe\idevices\applet*.py"
SectionEnd

BrandingText "EXE"
