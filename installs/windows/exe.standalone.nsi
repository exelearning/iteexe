; EXE Standalone EXE Wrapper.
; Wraps the py2exe output and firefox and everything.
; When running extracts them all to a temp dir and runs from there.

!ifndef EXE_VERSION
  !define EXE_VERSION "0.23.1"
!endif
!define APPNAMEANDVERSION "eXe Standalone ${EXE_VERSION}"
!ifndef EXE_BUILD
  !define EXE_BUILD "${EXE_VERSION}.${EXE_REVISION}"
!endif
!ifndef EXE_SPLASH
  !define EXE_SPLASH "splash1.jpg"
!endif

; Main Install settings
SetCompressor /SOLID /FINAL lzma
Name "${APPNAMEANDVERSION}"
Icon "..\..\dist\eXe_icon.ico"
OutFile "INTEF-exe-ready2run-${EXE_VERSION}.exe"

# Cool progress bar
Subcaption 3 " "
XPStyle on
AutoCloseWindow true
ChangeUI all "${NSISDIR}\Contrib\UIs\LoadingBar.exe"
!include "${NSISDIR}\Examples\System\System.nsh"

Function repositionWindow
	; Reposition window in the lower left
	; Create RECT struct
	System::Call "*${stRECT} .r1"
	; Find Window info for the window we're displaying
	System::Call "User32::GetWindowRect(i, i) i ($HWNDPARENT, r1) .r2"
	; Get left/top/right/bottom
	System::Call "*$1${stRECT} (.r2, .r3, .r4, .r5)"
	; Calculate width/height of our window
	IntOp $2 $4 - $2 ; $2 now contains the width
	IntOp $3 $5 - $3 ; $3 now contains the height
	; Determine the screen work area
	System::Call "User32::SystemParametersInfo(i, i, i, i) i (${SPI_GETWORKAREA}, 0, r1, 0) .r4" 
	; Get left/top/right/bottom
	System::Call "*$1${stRECT} (.r4, .r5, .r6, .r7)"
	System::Free $1
	; Get the right side of the screen
	IntOp $0 $6 - $2
	; Get the horizontal center of the screen
	IntOp $0 $0 / 2
        ; Subtract half our width
	IntOp $1 $4 / 2
	IntOp $0 $0 - $1
	; Vertical Center - half of image with (240/2=120)
	IntOp $1 $7 / 2
	IntOp $1 $1 + 120
	System::Call "User32::SetWindowPos(i, i, i, i, i, i, i) b ($HWNDPARENT, 0, $0, $1, 0, 0, 0x201)"
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
    ExecWait '"$TEMP\exe\vcredist2008_x86.exe" /q' $0
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

Section main
    InitPluginsDir
    Call repositionWindow
    ; Get a temp dir
    SetOutPath "$TEMP\exe"
    ; Check if exe exists in the temp dir
    IfFileExists "$TEMP\exe\exe.exe" 0 Extract
    ; Get its version
    FileOpen $R0 "$TEMP\exe\version" r
    FileRead $R0 $0
    FileClose $R0
    ; If its version is ok
    StrCmp "$0" ${EXE_BUILD} Splash CleanUp
  CleanUp:
    ; Clean up
    RMDir /r "$TEMP\exe"
  Extract:
    ; Show a nice splash screen
    File ${EXE_SPLASH}
    newadvsplash::show /NOUNLOAD 99999 1 1 -1 /BANNER /NOCANCEL "$TEMP\exe\${EXE_SPLASH}"
    ; Decompress the stuff
    File /R "..\..\dist\*.*"
    Call vcredist2008installer
    SetOutPath "$TEMP\exe\config\idevices"
    File "..\..\exe\idevices\*.*"
    ; Remove the splash screen
    newadvsplash::stop
    Goto Run
  Splash:
    ; Show a short splash screen
    InitPluginsDir
    File ${EXE_SPLASH}
    newadvsplash::show /NOUNLOAD 4000 1 1 -1 /BANNER "$TEMP\exe\${EXE_SPLASH}"
  Run:
    HideWindow
    ; Launch exe
    ExecWait '"$TEMP\exe\exe.exe" --standalone'
    ; Remove the splash screen
    newadvsplash::stop
SectionEnd
