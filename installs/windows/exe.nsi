; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "exe"

!define EXE_VERSION "0.11"
!define APPNAMEANDVERSION "eXe ${EXE_VERSION}"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$PROGRAMFILES\exe"
InstallDirRegKey HKLM "Software\${APPNAME}" ""
Icon "C:\eXe branches\0.11\dist\eXe_icon.ico"
OutFile "eXe_install_windows.exe"

; Modern interface settings
!include "MUI.nsh"

!define MUI_ABORTWARNING
;!define MUI_FINISHPAGE_RUN "$INSTDIR\exe.exe"
;!define MUI_FINISHPAGE_RUN_PARAMETERS eXe-tutorial.elp

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "C:\eXe branches\0.11\dist\exeLicense.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Set languages (first is default language)
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_RESERVEFILE_LANGDLL

!define SHCNE_ASSOCCHANGED 0x08000000
!define SHCNF_IDLIST 0

Function RefreshShellIcons
  ; By jerome tremblay - april 2003
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v \
  (${SHCNE_ASSOCCHANGED}, ${SHCNF_IDLIST}, 0, 0)'
FunctionEnd

Function UninstallMSI
  ; $R0 should contain the GUID of the application
  push $R1
  ReadRegStr $R1 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\$R0" "UninstallString"
  StrCmp $R1 "" UninstallMSI_nomsi
    ExecWait '"msiexec.exe" /x $R0 /qn /passive'
UninstallMSI_nomsi: 
  pop $R1
FunctionEnd

Section "Remove Old Version" Section1
	; Remove any previous nsis install...
	; Read where the last nsis install was
	ReadRegStr $R1 HKLM "Software\${APPNAME}" ""
	StrCmp $R1 "" SetR1 DoUninstall
	SetR1:
	  StrCpy $R1 "$PROGRAMFILES\exe"
	DoUninstall:
		IfFileExists "$R1\uninstall.exe" 0 Next
			ExecWait '"$R1\uninstall.exe" /S _?=$R1'
			Delete "$R1\uninstall.exe"
			RMDir "$R1"
	Next:
	; Uninstall previous msi packages...
  StrCpy $R0 "{053B45FD-255C-4E20-AA9D-218BB8A2B215}";  the MSI's ProductID of my package
  Call UninstallMSI
  StrCpy $R0 "{B4E5B5BC-087B-44D3-AD94-9DA209C70979}";  the MSI's ProductID of my package
  Call UninstallMSI
	StrCpy $R0 "{3BEEE1AE-B96C-4E83-A63A-5886E4C1707C}";  the MSI's ProductID of my package
	Call UninstallMSI
	; If still there, tell them to manually uninstall it!
  IfFileExists "$PROGRAMFILES\exe\server.exe" 0 Done
	  MessageBox MB_OK "Before continuing please manually uninstall the old version of exe using the controla panel, 'add remove programs' utility. Press OK when this is done"
	Done:
SectionEnd
	


Section "exe" Section2

	; Set Section properties
	SetOverwrite ifnewer

	; Set Section Files and Shortcuts
	SetOutPath "$INSTDIR\"
	File /r "C:\eXe branches\0.11\dist\*.*"
	CreateShortCut "$DESKTOP\exe-${EXE_VERSION}.lnk" "$INSTDIR\exe.exe" "" "$INSTDIR\eXe_icon.ico"
	CreateDirectory "$SMPROGRAMS\exe"
	CreateShortCut "$SMPROGRAMS\exe\exe.lnk" "$INSTDIR\exe.exe" "" "$INSTDIR\eXe_icon.ico"
	CreateShortCut "$SMPROGRAMS\exe\Uninstall.lnk" "$INSTDIR\uninstall.exe"
	
	; Associtate elp files with exe.exe
	!define Index "Line${__LINE__}"
  ReadRegStr $1 HKCR ".elp" ""
  StrCmp $1 "" "${Index}-NoBackup"
  StrCmp $1 "exePackageFile" "${Index}-NoBackup"
  WriteRegStr HKCR ".elp" "backup_val" $1
	"${Index}-NoBackup:"
    WriteRegStr HKCR ".elp" "" "exePackageFile"
    ReadRegStr $0 HKCR "exePackageFile" ""
	  WriteRegStr HKCR "exePackageFile" "" "eXe Package File"
	  WriteRegStr HKCR "exePackageFile\shell" "" "open"
	  WriteRegStr HKCR "exePackageFile\DefaultIcon" "" "$INSTDIR\eXe_icon.ico"
    WriteRegStr HKCR "exePackageFile\shell\open\command" "" \
    '$INSTDIR\exe.exe "%1"'
		Call RefreshShellIcons
    ;;WriteRegStr HKCR "exePackageFile\shell\edit" "" "Edit Options File"
    ;;WriteRegStr HKCR "exePackageFile\shell\edit\command" "" \
    ;;'$INSTDIR\server.exe "%1"'
  !undef Index
	
	IfFileExists "$APPDATA\exe\exe.conf" 0 NoIniUpdate
		WriteINIStr "$APPDATA\exe\exe.conf" system webDir "$INSTDIR"
	NoIniUpdate:

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
	Delete "$DESKTOP\exe-${EXE_VERSION}.lnk"
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
