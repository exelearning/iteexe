; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "exe"

!ifndef EXE_VERSION
  !define EXE_VERSION "0.24"
!endif
!define APPNAMEANDVERSION "eXe ${EXE_VERSION}"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$PROGRAMFILES\exe"
InstallDirRegKey HKLM "Software\${APPNAME}" ""
Icon "..\..\dist\eXe_icon.ico"
OutFile "INTEF-eXe-install-${EXE_VERSION}.exe"

; Modern interface settings
!include "MUI.nsh"

!define MUI_ABORTWARNING

;!define MUI_FINISHPAGE_RUN "$INSTDIR\exe.exe"
;!define MUI_FINISHPAGE_RUN_PARAMETERS eXe-tutorial.elp
!define MUI_WELCOMEFINISHPAGE_BITMAP "win.bmp"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\dist\exeLicense.txt"
!insertmacro MUI_PAGE_DIRECTORY
;Page custom IdevicePage
!insertmacro MUI_PAGE_INSTFILES 
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Set languages (first is default language)
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_RESERVEFILE_LANGDLL

;ReserveFile "idevices.ini"
;!insertmacro MUI_RESERVEFILE_INSTALLOPTIONS

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

Function CheckeXeRunning
   nsProcess::_FindProcess "exe.exe"
   Pop $R0
   IntCmp $R0 603 ok ko ko
   ko:
     MessageBox MB_OK|MB_ICONEXCLAMATION "eXe is running. Please close it first or reboot before install" /SD IDOK
     Abort
   ok:
FunctionEnd

Function un.CheckeXeRunning
   nsProcess::_FindProcess "exe.exe"
   Pop $R0
   IntCmp $R0 603 ok ko ko
   ko:
     MessageBox MB_OK|MB_ICONEXCLAMATION "eXe is running. Please close it first or reboot before uninstall" /SD IDOK
     Abort
   ok:
FunctionEnd

Function .onInit
   Call CheckeXeRunning
FunctionEnd

Function un.onInit
   Call un.CheckeXeRunning
FunctionEnd

Function vcredist2008installer
  ;Check if VC++ 2008 runtimes are already installed.
  ;NOTE Both the UID in the registry key and the DisplayName string must be updated here (and below)
  ;whenever the Redistributable package is upgraded:
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{9BE518E6-ECC6-35A9-88E4-87755C07200F}" "DisplayName"
  StrCmp $0 "Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.6161" vcredist2008_done vcredist2008_check_wow6432node
  ;On x64 systems we need to check the Wow6432Node registry key instead
  vcredist2008_check_wow6432node:
    ReadRegStr $0 HKLM "SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\{9BE518E6-ECC6-35A9-88E4-87755C07200F}" "DisplayName"
    StrCmp $0 "Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.6161" vcredist2008_done vcredist2008_silent_install
  ;If VC++ 2008 runtimes are not installed...
  vcredist2008_silent_install:
    DetailPrint "Installing Microsoft Visual C++ 2008 Redistributable"
    File vcredist2008_x86.exe
    ExecWait '"$INSTDIR\vcredist2008_x86.exe" /q' $0
    ;Check for successful installation of our 2008 version of vcredist_x86.exe...
    ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{9BE518E6-ECC6-35A9-88E4-87755C07200F}" "DisplayName"
    StrCmp $0 "Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.6161" vcredist2008_success vcredist2008_not_present_check_wow6432node
    vcredist2008_not_present_check_wow6432node:
      ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{9BE518E6-ECC6-35A9-88E4-87755C07200F}" "DisplayName"
      StrCmp $0 "Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.6161" vcredist2008_success vcredist2008_not_present
    vcredist2008_not_present:
      DetailPrint "Microsoft Visual C++ 2008 Redistributable failed to install"
      IfSilent vcredist2008_done vcredist2008_messagebox
      vcredist2008_messagebox:
        MessageBox MB_OK "Microsoft Visual C++ 2008 Redistributable Package (x86) failed to install ($INSTDIR\vcredist2008_x86.exe). Please ensure your system meets the minimum requirements before running the installer again."
        Goto vcredist2008_done
    vcredist2008_success:
      Delete "$INSTDIR\vcredist2008_x86.exe" 
      DetailPrint "Microsoft Visual C++ 2008 Redistributable was successfully installed"
  vcredist2008_done:
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
				;delete old plugins
				Delete "$APPDATA\exe\idevices\applet*.py*"
				Delete "$APPDATA\exe\idevices\flash*.py*"
				Delete "$APPDATA\exe\idevices\*test*.py*"
				Delete "$APPDATA\exe\idevices\*.jar"
            
    Next:
        ; Uninstall previous msi packages...
        StrCpy $R0 "{053B45FD-255C-4E20-AA9D-218BB8A2B215}";  the MSI's ProductID of my package
        Call UninstallMSI
        StrCpy $R0 "{B4E5B5BC-087B-44D3-AD94-9DA209C70979}";  the MSI's ProductID of my package
        Call UninstallMSI
        StrCpy $R0 "{3BEEE1AE-B96C-4E83-A63A-5886E4C1707C}";  the MSI's ProductID of my package
        Call UninstallMSI
        ; If still there, tell them to manually uninstall it!
        IfFileExists "$PROGRAMFILES\exe\exe.exe" 0 Done
          MessageBox MB_OK "Before continuing please manually uninstall the old version of exe using the control panel, 'add remove programs' utility. Press OK when this is done."
    Done:
SectionEnd
    
Section "exe" Section2
    ; Set Section properties
    SetOverwrite ifnewer

    ; Set Section Files and Shortcuts
    SetOutPath "$INSTDIR\"
    File /r "..\..\dist\*.*"
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
        WriteRegStr HKCR "exePackageFile\shell\open\command" "" '$INSTDIR\exe.exe "%1"'
        Call RefreshShellIcons
        ;;WriteRegStr HKCR "exePackageFile\shell\edit" "" "Edit Options File"
        ;;WriteRegStr HKCR "exePackageFile\shell\edit\command" "" '$INSTDIR\server.exe "%1"'
    !undef Index
    
    IfFileExists "$APPDATA\exe\exe.conf" 0 NoIniUpdate
        WriteINIStr "$APPDATA\exe\exe.conf" system webDir "$INSTDIR"
        WriteINIStr "$APPDATA\exe\exe.conf" system jsDir "$INSTDIR"
        WriteINIStr "$APPDATA\exe\exe.conf" system localeDir "$INSTDIR\locale"
        WriteINIStr "$APPDATA\exe\exe.conf" system mediaProfilePath "$INSTDIR\mediaprofiles"
    NoIniUpdate:
	Call vcredist2008installer
SectionEnd


Section -FinishSection
    WriteRegStr HKLM "Software\${APPNAME}" "" "$INSTDIR"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "eXe -- eLearning XHTML editor"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayIcon" "$INSTDIR\eXe_icon.ico,0"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "eXe Project"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "HelpLink" "http://exelearning.org/support.php"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLInfoAbout" "http://exelearning.org/"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLUpdateInfo" "http://exelearning.org/"

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
		RMDir  "$SMPROGRAMS\exe"
    
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
