; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "eXe flashmovie iDevice update"

!define EXE_VERSION "0.17"
!define APPNAMEANDVERSION "${APPNAME} ${EXE_VERSION}"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$APPDATA\exe\idevices"
Icon "..\..\eXe_icon.ico"
OutFile "eXe_flashmovie_update.exe"

Section Install
   SetOutPath "$APPDATA\exe\idevices"
   File "..\..\exe\idevices\flashmovie*.py"
SectionEnd

BrandingText "EXE"
