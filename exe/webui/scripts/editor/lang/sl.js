/*
 * FCKeditor - The text editor for internet
 * Copyright (C) 2003-2004 Frederico Caldeira Knabben
 * 
 * Licensed under the terms of the GNU Lesser General Public License:
 * 		http://www.opensource.org/licenses/lgpl-license.php
 * 
 * For further information visit:
 * 		http://www.fckeditor.net/
 * 
 * File Name: sl.js
 * 	Slovenian language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 21:05:30
 * 
 * File Authors:
 * 		Boris Volarič (vol@rutka.net)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Zloži orodno vrstico",
ToolbarExpand		: "Razširi orodno vrstico",

// Toolbar Items and Context Menu
Save				: "Shrani",
NewPage				: "Nova stran",
Preview				: "Predogled",
Cut					: "Izreži",
Copy				: "Kopiraj",
Paste				: "Prilepi",
PasteText			: "Prilepi kot golo besedilo",
PasteWord			: "Prilepi iz Worda",
Print				: "Natisni",
SelectAll			: "Izberi vse",
RemoveFormat		: "Odstrani oblikovanje",
InsertLinkLbl		: "Povezava",
InsertLink			: "Vstavi/uredi povezavo",
RemoveLink			: "Odstrani povezavo",
InsertImageLbl		: "Slika",
InsertImage			: "Vstavi/uredi sliko",
InsertTableLbl		: "Tabela",
InsertTable			: "Vstavi/uredi tabelo",
InsertLineLbl		: "Črta",
InsertLine			: "Vstavi vodoravno črto",
InsertSpecialCharLbl: "Posebni znak",
InsertSpecialChar	: "Vstavi posebni znak",
InsertSmileyLbl		: "Smeško",
InsertSmiley		: "Vstavi smeška",
About				: "O FCKeditorju",
Bold				: "Krepko",
Italic				: "Ležeče",
Underline			: "Podčrtano",
StrikeThrough		: "Prečrtano",
Subscript			: "Podpisano",
Superscript			: "Nadpisano",
LeftJustify			: "Leva poravnava",
CenterJustify		: "Sredinska poravnava",
RightJustify		: "Desna poravnava",
BlockJustify		: "Obojestranska poravnava",
DecreaseIndent		: "Zmanjšaj zamik",
IncreaseIndent		: "Povečaj zamik",
Undo				: "Razveljavi",
Redo				: "Ponovi",
NumberedListLbl		: "Oštevilčen seznam",
NumberedList		: "Vstavi/odstrani oštevilčevanje",
BulletedListLbl		: "Označen seznam",
BulletedList		: "Vstavi/odstrani označevanje",
ShowTableBorders	: "Pokaži meje tabele",
ShowDetails			: "Pokaži podrobnosti",
Style				: "Slog",
FontFormat			: "Oblika",
Font				: "Pisava",
FontSize			: "Velikost",
TextColor			: "Barva besedila",
BGColor				: "Barva ozadja",
Source				: "Izvor",
Find				: "Najdi",
Replace				: "Zamenjaj",

// Context Menu
EditLink			: "Uredi povezavo",
InsertRow			: "Vstavi vrstico",
DeleteRows			: "Izbriši vrstice",
InsertColumn		: "Vstavi stolpec",
DeleteColumns		: "Izbriši stolpce",
InsertCell			: "Vstavi celico",
DeleteCells			: "Izbriši celice",
MergeCells			: "Združi celice",
SplitCell			: "Razdeli celico",
CellProperties		: "Lastnosti celice",
TableProperties		: "Lastnosti tabele",
ImageProperties		: "Lastnosti slike",

FontFormats			: "Navaden;Oblikovan;Napis;Naslov 1;Naslov 2;Naslov 3;Naslov 4;Naslov 5;Naslov 6",

// Alerts and Messages
ProcessingXHTML		: "Obdelujem XHTML. Prosim počakajte...",
Done				: "Narejeno",
PasteWordConfirm	: "Izgleda, da želite prilepiti besedilo iz Worda. Ali ga želite očistiti, preden ga prilepite?",
NotCompatiblePaste	: "Ta ukaz deluje le v Internet Explorerje različice 5.5 ali višje. Ali želite prilepiti brez čiščenja?",
UnknownToolbarItem	: "Neznan element orodne vrstice \"%1\"",
UnknownCommand		: "Neznano ime ukaza \"%1\"",
NotImplemented		: "Ukaz ni izdelan",
UnknownToolbarSet	: "Skupina orodnih vrstic \"%1\" ne obstoja",

// Dialogs
DlgBtnOK			: "V redu",
DlgBtnCancel		: "Prekliči",
DlgBtnClose			: "Zapri",
DlgAdvancedTag		: "Napredno",

// General Dialogs Labels
DlgGenNotSet		: "&lt;ni postavljen&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Smer jezika",
DlgGenLangDirLtr	: "Od leve proti desni (LTR)",
DlgGenLangDirRtl	: "Od desne proti levi (RTL)",
DlgGenLangCode		: "Oznaka jezika",
DlgGenAccessKey		: "Vstopno geslo",
DlgGenName			: "Ime",
DlgGenTabIndex		: "Številka tabulatorja",
DlgGenLongDescr		: "Dolg opis URL-ja",
DlgGenClass			: "Razred stilne predloge",
DlgGenTitle			: "Predlagani naslov",
DlgGenContType		: "Predlagani tip vsebine (content-type)",
DlgGenLinkCharset	: "Kodna tabela povezanega vira",
DlgGenStyle			: "Slog",

// Image Dialog
DlgImgTitle			: "Lastnosti slike",
DlgImgInfoTab		: "Podatki o sliki",
DlgImgBtnUpload		: "Pošlji na strežnik",
DlgImgURL			: "URL",
DlgImgUpload		: "Pošlji",
DlgImgBtnBrowse		: "Prebrskaj na strežniku",
DlgImgAlt			: "Nadomestno besedilo",
DlgImgWidth			: "Širina",
DlgImgHeight		: "Višina",
DlgImgLockRatio		: "Zakleni razmerje",
DlgBtnResetSize		: "Ponastavi velikost",
DlgImgBorder		: "Obroba",
DlgImgHSpace		: "Vodoravni razmik",
DlgImgVSpace		: "Navpišni razmik",
DlgImgAlign			: "Poravnava",
DlgImgAlignLeft		: "Levo",
DlgImgAlignAbsBottom	: "Popolnoma na dno",
DlgImgAlignAbsMiddle	: "Popolnoma v sredino",
DlgImgAlignBaseline	: "Na osnovno črto",
DlgImgAlignBottom	: "Na dno",
DlgImgAlignMiddle	: "V sredino",
DlgImgAlignRight	: "Desno",
DlgImgAlignTextTop	: "Besedilo na vrh",
DlgImgAlignTop		: "Na vrh",
DlgImgPreview		: "Predogled",
DlgImgMsgWrongExt	: "Dovoljen je prenos le naslednjih tipov datotek:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nDejanje je bilo preklicano.",
DlgImgAlertSelect	: "Izberite sliko za prenos.",
DlgImgAlertUrl		: "Vnesite URL slike",

// Link Dialog
DlgLnkWindowTitle	: "Povezava",
DlgLnkInfoTab		: "Podatki o povezavi",
DlgLnkTargetTab		: "Cilj",

DlgLnkType			: "Vrsta povezave",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Zaznamek na tej strani",
DlgLnkTypeEMail		: "Elektronski naslov",
DlgLnkProto			: "Protokol",
DlgLnkProtoOther	: "&lt;drugo&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Prebrskaj na strežniku",
DlgLnkAnchorSel		: "Izberi zaznamek",
DlgLnkAnchorByName	: "Po imenu zaznamka",
DlgLnkAnchorById	: "Po ID-ju elementa",
DlgLnkNoAnchors		: "&lt;V tem dokumentu ni zaznamkov&gt;",
DlgLnkEMail			: "Elektronski naslov",
DlgLnkEMailSubject	: "Predmet sporočila",
DlgLnkEMailBody		: "Vsebina sporočila",
DlgLnkUpload		: "Prenesi",
DlgLnkBtnUpload		: "Pošlji na strežnik",

DlgLnkTarget		: "Cilj",
DlgLnkTargetFrame	: "&lt;okvir&gt;",
DlgLnkTargetPopup	: "&lt;pojavno okno&gt;",
DlgLnkTargetBlank	: "Novo okno (_blank)",
DlgLnkTargetParent	: "Starševsko okno (_parent)",
DlgLnkTargetSelf	: "Isto okno (_self)",
DlgLnkTargetTop		: "Najvišje okno (_top)",
DlgLnkTargetFrame	: "Ime ciljnega okvirja",
DlgLnkPopWinName	: "Ime pojavnega okna",
DlgLnkPopWinFeat	: "Značilnosti pojavnega okna",
DlgLnkPopResize		: "Spremenljive velikosti",
DlgLnkPopLocation	: "Naslovna vrstica",
DlgLnkPopMenu		: "Menijska vrstica",
DlgLnkPopScroll		: "Drsniki",
DlgLnkPopStatus		: "Vrstica stanja",
DlgLnkPopToolbar	: "Orodna vrstica",
DlgLnkPopFullScrn	: "Celozaslonska slika (IE)",
DlgLnkPopDependent	: "Podokno (Netscape)",
DlgLnkPopWidth		: "Širina",
DlgLnkPopHeight		: "Višina",
DlgLnkPopLeft		: "Lega levo",
DlgLnkPopTop		: "Lega na vrhu",

DlgLnkMsgWrongExtA	: "Dovoljen je prenos le naslednjih tipov datotek:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nDejanje je bilo preklicano.",
DlgLnkMsgWrongExtD	: "Prepovedan je prenos naslednjih tipov datotek:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nDejanje je bilo preklicano.",

DlnLnkMsgNoUrl		: "Vnesite URL povezave",
DlnLnkMsgNoEMail	: "Vnesite elektronski naslov",
DlnLnkMsgNoAnchor	: "Izberite zaznamek",

// Color Dialog
DlgColorTitle		: "Izberite barvo",
DlgColorBtnClear	: "Počisti",
DlgColorHighlight	: "Označi",
DlgColorSelected	: "Izbrano",

// Smiley Dialog
DlgSmileyTitle		: "Vstavi smeška",

// Special Character Dialog
DlgSpecialCharTitle	: "Izberi posebni znak",

// Table Dialog
DlgTableTitle		: "Lastnosti tabele",
DlgTableRows		: "Vrstice",
DlgTableColumns		: "Stolpci",
DlgTableBorder		: "Velikost obrobe",
DlgTableAlign		: "Poravnava",
DlgTableAlignNotSet	: "<Ni nastavljeno>",
DlgTableAlignLeft	: "Levo",
DlgTableAlignCenter	: "Sredinsko",
DlgTableAlignRight	: "Desno",
DlgTableWidth		: "Širina",
DlgTableWidthPx		: "pik",
DlgTableWidthPc		: "procentov",
DlgTableHeight		: "Višina",
DlgTableCellSpace	: "Razmik med celicami",
DlgTableCellPad		: "Polnilo med celicami",
DlgTableCaption		: "Naslov",

// Table Cell Dialog
DlgCellTitle		: "Lastnosti celice",
DlgCellWidth		: "Širina",
DlgCellWidthPx		: "pik",
DlgCellWidthPc		: "procentov",
DlgCellHeight		: "Višina",
DlgCellWordWrap		: "Pomikanje besedila",
DlgCellWordWrapNotSet	: "<Ni nastavljeno>",
DlgCellWordWrapYes	: "Da",
DlgCellWordWrapNo	: "Ne",
DlgCellHorAlign		: "Vodoravna poravnava",
DlgCellHorAlignNotSet	: "<Ni nastavljeno>",
DlgCellHorAlignLeft	: "Levo",
DlgCellHorAlignCenter	: "Sredinsko",
DlgCellHorAlignRight	: "Desno",
DlgCellVerAlign		: "Navpična poravnava",
DlgCellVerAlignNotSet	: "<Ni nastavljeno>",
DlgCellVerAlignTop	: "Na vrh",
DlgCellVerAlignMiddle	: "V sredino",
DlgCellVerAlignBottom	: "Na dno",
DlgCellVerAlignBaseline	: "Na osnovno črto",
DlgCellRowSpan		: "Spojenih vrstic (row-span)",
DlgCellCollSpan		: "Spojenih stolpcev (col-span)",
DlgCellBackColor	: "Barva ozadja",
DlgCellBorderColor	: "Barva obrobe",
DlgCellBtnSelect	: "Izberi...",

// Find Dialog
DlgFindTitle		: "Najdi",
DlgFindFindBtn		: "Najdi",
DlgFindNotFoundMsg	: "Navedeno besedilo ni bilo najdeno.",

// Replace Dialog
DlgReplaceTitle		: "Zamenjaj",
DlgReplaceFindLbl	: "Najdi:",
DlgReplaceReplaceLbl	: "Zamenjaj z:",
DlgReplaceCaseChk	: "Razlikuj velike in male črke",
DlgReplaceReplaceBtn	: "Zamenjaj",
DlgReplaceReplAllBtn	: "Zamenjaj vse",
DlgReplaceWordChk	: "Samo cele besede",

// Paste Operations / Dialog
PasteErrorPaste		: "Varnostne nastavitve brskalnika ne dopuščajo samodejnega lepljenja. Uporabite kombinacijo tipk na tipkovnici (Ctrl+V).",
PasteErrorCut		: "Varnostne nastavitve brskalnika ne dopuščajo samodejnega izrezovanja. Uporabite kombinacijo tipk na tipkovnici (Ctrl+X).",
PasteErrorCopy		: "Varnostne nastavitve brskalnika ne dopuščajo samodejnega kopiranja. Uporabite kombinacijo tipk na tipkovnici (Ctrl+C).",

PasteAsText			: "Prilepi kot golo besedilo",
PasteFromWord		: "Prilepi iz Worda",

DlgPasteMsg			: "Ni bilo mogoče izvesti lepljenja zaradi <STRONG>varnostnih nastavitev</STRONG> vašega brskalnika.<BR>Prilepite v sledeče okno s kombinacijo tipk na tipkovnici (<STRONG>Ctrl+V</STRONG>) in pritisnite <STRONG>V redu</STRONG>.",

// Color Picker
ColorAutomatic		: "Samodejno",
ColorMoreColors		: "Več barv...",

// About Dialog
DlgAboutVersion		: "različica",
DlgAboutLicense		: "Pravica za uporabo pod pogoji GNU Lesser General Public License",
DlgAboutInfo		: "Za več informacij obiščite"
}
