; EXE Standalone EXE Wrapper.
; Wraps the py2exe output and firefox and everything.
; When running extracts them all to a temp dir and runs from there.

!define EXE_VERSION "0.20.alpha"
!define APPNAMEANDVERSION "eXe Standalone ${EXE_VERSION}"

; Main Install settings
SetCompressor /SOLID /FINAL lzma
Name "${APPNAMEANDVERSION}"
Icon "..\..\dist\eXe_icon.ico"
OutFile "exe-ready2run-${EXE_VERSION}.exe"

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
	; Verical Center - half of image with (240/2=120)
	IntOp $1 $7 / 2
	IntOp $1 $1 + 120
	System::Call "User32::SetWindowPos(i, i, i, i, i, i, i) b ($HWNDPARENT, 0, $0, $1, 0, 0, 0x201)"
FunctionEnd

Section main
    InitPluginsDir
    Call repositionWindow
    ; Get a temp dir
    SetOutPath "$TEMP\exe"
    ; Check if exe exists in the temp dir
    IfFileExists "$TEMP\exe\exe.exe" 0 Extract
    ; Get its version
    GetDllVersion "$TEMP\exe\exe.exe" $0 $1
    ; If its version is ok
    StrCmp "$1.$0" ${EXE_VERSION} Splash CleanUp
  CleanUp:
    ; Clean up
    RMDir /r "$TEMP\exe"
  Extract:
    ; Show a nice splash screen
    File "splash1.jpg"
    newadvsplash::show /NOUNLOAD 99999 1 1 -1 /BANNER /NOCANCEL "$TEMP\exe\splash1.jpg"
    ; Decompress the stuff
    File /R "..\..\dist\*.*"
    SetOutPath "$TEMP\exe\firefox"
    File /R "..\..\exe\webui\Mozilla Firefox\*.*"
    ; Remove the splash screen
    newadvsplash::stop
    Goto Run
  Splash:
    ; Show a short splash screen
    InitPluginsDir
    File "splash1.jpg"
    newadvsplash::show /NOUNLOAD 4000 1 1 -1 /BANNER "$TEMP\exe\splash1.jpg"
  Run:
    HideWindow
    ; Launch exe
    ExecWait '"$TEMP\exe\exe.exe" --standalone'
    ; Remove the splash screen
    newadvsplash::stop
SectionEnd
