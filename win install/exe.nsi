; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "exe"
!define APPNAMEANDVERSION "exe 0.7"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$PROGRAMFILES\exe"
InstallDirRegKey HKLM "Software\${APPNAME}" ""
Icon "c:\exe\dist\icon1.ico"
OutFile "exeinstall.exe"

; Modern interface settings
!include "MUI.nsh"

!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\server.exe"
!define MUI_FINISHPAGE_RUN_PARAMETERS package12.elp
;!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.txt, $INSTDIR\package8.elp"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\exe\dist\exeLicense.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Set languages (first is default language)
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_RESERVEFILE_LANGDLL

Section "exe" Section1

	; Set Section properties
	SetOverwrite ifnewer

	; Set Section Files and Shortcuts
	SetOutPath "$INSTDIR\"
	File /r "C:\exe\dist\*.*"
	CreateShortCut "$DESKTOP\exe.lnk" "$INSTDIR\server.exe" "" "$INSTDIR\icon1.ico"
	CreateDirectory "$SMPROGRAMS\exe"
	CreateShortCut "$SMPROGRAMS\exe\exe.lnk" "$INSTDIR\server.exe" "" "$INSTDIR\icon1.ico"
	CreateShortCut "$SMPROGRAMS\exe\Uninstall.lnk" "$INSTDIR\uninstall.exe"
	
	; Associtate elp files with server.exe
	!define Index "Line${__LINE__}"
  ReadRegStr $1 HKCR ".elp" ""
  StrCmp $1 "" "${Index}-NoBackup"
  StrCmp $1 "exePackageFile" "${Index}-NoBackup"
  WriteRegStr HKCR ".elp" "backup_val" $1
	"${Index}-NoBackup:"
    WriteRegStr HKCR ".elp" "" "exePackageFile"
    ReadRegStr $0 HKCR "exePackageFile" ""
    StrCmp $0 "" 0 "${Index}-Skip"
	  WriteRegStr HKCR "exePackageFile" "" "eXe Package File"
	  WriteRegStr HKCR "exePackageFile\shell" "" "open"
	  WriteRegStr HKCR "exePackageFile\DefaultIcon" "" "$INSTDIR\icon1.ico"
  "${Index}-Skip:"
    WriteRegStr HKCR "exePackageFile\shell\open\command" "" \
    '$INSTDIR\server.exe "%1"'
    ;;WriteRegStr HKCR "exePackageFile\shell\edit" "" "Edit Options File"
    ;;WriteRegStr HKCR "exePackageFile\shell\edit\command" "" \
    ;;'$INSTDIR\server.exe "%1"'
  !undef Index

SectionEnd

Section -FinishSection

	WriteRegStr HKLM "Software\${APPNAME}" "" "$INSTDIR"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\uninstall.exe"
	WriteUninstaller "$INSTDIR\uninstall.exe"

SectionEnd

; Modern install component descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${Section1} ""
!insertmacro MUI_FUNCTION_DESCRIPTION_END

;Uninstall section
Section Uninstall

	;Remove from registry...
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
	DeleteRegKey HKLM "SOFTWARE\${APPNAME}"

	; Delete self
	Delete "$INSTDIR\uninstall.exe"

	; Delete Shortcuts
	Delete "$DESKTOP\exe.lnk"
	Delete "$SMPROGRAMS\exe\exe.lnk"
	Delete "$SMPROGRAMS\exe\Uninstall.lnk"
	
	; Unassociate elp files
	!define Index "Line${__LINE__}"
  ReadRegStr $1 HKCR ".elp" ""
  StrCmp $1 "exePackageFile" 0 "${Index}-NoOwn" ; only do this if we own it
    ReadRegStr $1 HKCR ".elp" "backup_val"
    StrCmp $1 "" 0 "${Index}-Restore" ; if backup="" then delete the whole key
		DeleteRegKey HKCR ".elp"
    Goto "${Index}-NoOwn"
  "${Index}-Restore:"
		WriteRegStr HKCR ".elp" "" $1
		DeleteRegValue HKCR ".elp" "backup_val"
    DeleteRegKey HKCR "exePackageFile" ;Delete key with association settings
  "${Index}-NoOwn:"
  !undef Index

	; Clean up exe
	RMDir /r "$INSTDIR"

SectionEnd

BrandingText "EXE"

; eof