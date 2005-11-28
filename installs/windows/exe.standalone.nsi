; EXE Standalone EXE Wrapper.
; Wraps the py2exe output and firefox and everything.
; When running extracts them all to a temp dir and runs from there.

!define EXE_VERSION "0.11"
!define APPNAMEANDVERSION "eXe Standalone ${EXE_VERSION}"

; Main Install settings
Name "${APPNAMEANDVERSION}"
Icon "..\..\dist\eXe_icon.ico"
OutFile "exes.exe"
ShowInstDetails nevershow
SilentInstall silent

Section main
    ; Show a nice splash screen
    newadvsplash::show 60000 1 1 0x000000 /NOCANCEL logo.jpeg
    ; Get a temp dir
    SetOutPath "$TEMP\exe"
    ; Decompress the stuff
    File "..\..\dist\exe.exe"
    File /R "..\..\exe\webui\firefox"
    ; Remove the splash screen
    newadvsplash::stop
    ; Launch exe
    ExecWait '"$TEMP\exe\exe.exe" --standalone'
    ; Clean up
    RMDir /r "$TEMP\exe"
SectionEnd
