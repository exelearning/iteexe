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
 * File Name: et.js
 * 	Estonian language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-26 02:00:18
 * 
 * File Authors:
 * 		Kristjan Kivikangur (kristjan@ttrk.ee)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Voldi tööriistariba",
ToolbarExpand		: "Laienda tööriistariba",


// Toolbar Items and Context Menu
Save				: "Salvesta",
NewPage				: "Uus leht",
Preview				: "Eelvaade",
Cut					: "Lõika",
Copy				: "Kopeeri",
Paste				: "Kleebi",
PasteText			: "Kleebi tavalise tekstina",
PasteWord			: "Kleebi Wordist",
Print				: "Prindi",
SelectAll			: "Vali kõik",
RemoveFormat		: "Eemalda vorming",
InsertLinkLbl		: "Link",
InsertLink			: "Sisesta/Muuda link",
RemoveLink			: "Eemalda link",
InsertImageLbl		: "Pilt",
InsertImage			: "Sisesta/Muuda pilt",
InsertTableLbl		: "Tabel",
InsertTable			: "Sisesta/Muuda tabel",
InsertLineLbl		: "Joon",
InsertLine			: "Sisesta horisontaaljoon",
InsertSpecialCharLbl: "Erimärgid",
InsertSpecialChar	: "Sisesta erimärk",
InsertSmileyLbl		: "Smiley",
InsertSmiley		: "Sisesta Smiley",
About				: "FCKeditor kohta",
Bold				: "Paks",
Italic				: "Kursiiv",
Underline			: "Allajoonitud",
StrikeThrough		: "Läbijoonitud",
Subscript			: "Allindeks",
Superscript			: "Ülaindeks",
LeftJustify			: "Vasakjoondus",
CenterJustify		: "Keskjoondus",
RightJustify		: "Paremjoondus",
BlockJustify		: "Rööpjoondus",
DecreaseIndent		: "Vähenda taanet",
IncreaseIndent		: "Suurenda taanet",
Undo				: "Võta tagasi",
Redo				: "Tee uuesti",
NumberedListLbl		: "Nummerdatud loetelu",
NumberedList		: "Sisesta/Eemalda nummerdatud loetelu",
BulletedListLbl		: "Täpitud loetelu",
BulletedList		: "Sisesta/Eemalda täpitud loetelu",
ShowTableBorders	: "Nöita tabeli jooni",
ShowDetails			: "Näita üksikasju",
Style				: "Laad",
FontFormat			: "Vorming",
Font				: "Font",
FontSize			: "Suurus",
TextColor			: "Teksti värv",
BGColor				: "Tausta värv",
Source				: "Lähtekood",
Find				: "Otsi",
Replace				: "Asenda",

// Context Menu
EditLink			: "Muuda linki",
InsertRow			: "Lisa rida",
DeleteRows			: "Eemalda ridu",
InsertColumn		: "Lisa veerg",
DeleteColumns		: "Eemalda veerud",
InsertCell			: "Lisa lahter",
DeleteCells			: "Eemalda lahtrid",
MergeCells			: "Ühenda lahtrid",
SplitCell			: "Lahuta lahtrid",
CellProperties		: "Lahtri atribuudid",
TableProperties		: "Tabeli atribuudid",
ImageProperties		: "Pildi  atribuudid",

FontFormats			: "Tavaline;Vormindatud;Aadress;Pealkiri 1;Pealkiri 2;Pealkiri 3;Pealkiri 4;Pealkiri 5;Pealkiri 6",

// Alerts and Messages
ProcessingXHTML		: "Töötlen XHTML. Palun oota...",
Done				: "Tehtud",
PasteWordConfirm	: "Tekst, mida soovid lisada paistab pärinevat Wordist. Kas soovid seda enne kleepimist puhastada?",
NotCompatiblePaste	: "See käsk on saadaval ainult Internet Explorer versioon 5.5 või rohkem puhul. Kas soovid kleepida ilma puhastamata?",
UnknownToolbarItem	: "Tundmatu tööriistariba üksus \"%1\"",
UnknownCommand		: "Tundmatu käsunimi \"%1\"",
NotImplemented		: "Käsku ei täidetud",
UnknownToolbarSet	: "Tööriistariba \"%1\" ei eksisteeri",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Loobu",
DlgBtnClose			: "Sule",
DlgAdvancedTag		: "Täpsemalt",

// General Dialogs Labels
DlgGenNotSet		: "&lt;määramata&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Keele suund",
DlgGenLangDirLtr	: "Vasakult paremale (LTR)",
DlgGenLangDirRtl	: "Paremalt vasakule (RTL)",
DlgGenLangCode		: "Keele kood",
DlgGenAccessKey		: "Juurdepääsu võti",
DlgGenName			: "Nimi",
DlgGenTabIndex		: "Tab Index",
DlgGenLongDescr		: "Pikk kirjeldus URL",
DlgGenClass			: "Stiilistiku klassid",
DlgGenTitle			: "Advisory Title",
DlgGenContType		: "Advisory Content Type",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Laad",

// Image Dialog
DlgImgTitle			: "Pildi atribuudid",
DlgImgInfoTab		: "Pildi info",
DlgImgBtnUpload		: "Saada serverile",
DlgImgURL			: "URL",
DlgImgUpload		: "Lae üles",
DlgImgBtnBrowse		: "Sirvi serverist",
DlgImgAlt			: "Alternatiivne tekst",
DlgImgWidth			: "Laius",
DlgImgHeight		: "Kõrgus",
DlgImgLockRatio		: "Lukusta kuvasuhe",
DlgBtnResetSize		: "Lähtesta suurus",
DlgImgBorder		: "Joon",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Joondus",
DlgImgAlignLeft		: "Vasak",
DlgImgAlignAbsBottom: "Abs alla",
DlgImgAlignAbsMiddle: "Abs keskele",
DlgImgAlignBaseline	: "Baasjoonele",
DlgImgAlignBottom	: "Alla",
DlgImgAlignMiddle	: "Keskele",
DlgImgAlignRight	: "Paremale",
DlgImgAlignTextTop	: "Teksti üles",
DlgImgAlignTop		: "Üles",
DlgImgPreview		: "Eelvaade",
DlgImgMsgWrongExt	: "Vabandust, üles laadida tohib ainult järgmist tüüpi faile:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nTehing tühistati.",
DlgImgAlertSelect	: "Palun vali pilt, mida üles laadida.",
DlgImgAlertUrl		: "Palun kirjuta pildi URL",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "Lingi info",
DlgLnkTargetTab		: "Sihtkoht",

DlgLnkType			: "Lingi tüüp",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Ankur sellel lehel",
DlgLnkTypeEMail		: "E-Post",
DlgLnkProto			: "Protokoll",
DlgLnkProtoOther	: "&lt;muu&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Sirvi serverist",
DlgLnkAnchorSel		: "Vali ankur",
DlgLnkAnchorByName	: "Ankru nime järgi",
DlgLnkAnchorById	: "Elemendi Id järgi",
DlgLnkNoAnchors		: "&lt;Selles dokumendis ei ole ankruid&gt;",
DlgLnkEMail			: "E-Posti aadress",
DlgLnkEMailSubject	: "Sõnumi teema",
DlgLnkEMailBody		: "Sõnumi tekst",
DlgLnkUpload		: "Lae üles",
DlgLnkBtnUpload		: "Saada serverile",

DlgLnkTarget		: "Sihtkoht",
DlgLnkTargetFrame	: "&lt;raam&gt;",
DlgLnkTargetPopup	: "&lt;hüpikaken&gt;",
DlgLnkTargetBlank	: "Uus aken (_blank)",
DlgLnkTargetParent	: "Vanem aken (_parent)",
DlgLnkTargetSelf	: "Sama aken (_self)",
DlgLnkTargetTop		: "Pealmine aken (_top)",
DlgLnkTargetFrame	: "Sihtraami nimi",
DlgLnkPopWinName	: "Hüpikakna nimi",
DlgLnkPopWinFeat	: "Hüpikakna omadused",
DlgLnkPopResize		: "Suurendatav",
DlgLnkPopLocation	: "Aadressiriba",
DlgLnkPopMenu		: "Menüüriba",
DlgLnkPopScroll		: "Kerimisribad",
DlgLnkPopStatus		: "Olekuriba",
DlgLnkPopToolbar	: "Tööriistariba",
DlgLnkPopFullScrn	: "Täisekraan (IE)",
DlgLnkPopDependent	: "Sõltuv (Netscape)",
DlgLnkPopWidth		: "Laius",
DlgLnkPopHeight		: "Kõrgus",
DlgLnkPopLeft		: "Vasak asukoht",
DlgLnkPopTop		: "Ülemine asukoht",

DlgLnkMsgWrongExtA	: "Vabandust, üles laadida tohib ainult järgmist tüüpi faile:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nTehing tühistati.",
DlgLnkMsgWrongExtD	: "Vabandust, järgmisi failitüüpe ei tohi üles laadida:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nTehing tühistati.",

DlnLnkMsgNoUrl		: "Palun kirjuta lingi URL",
DlnLnkMsgNoEMail	: "Palun kirjuta E-Posti aadress",
DlnLnkMsgNoAnchor	: "Palun vali ankur",


// Color Dialog
DlgColorTitle		: "Vali värv",
DlgColorBtnClear	: "Tühjenda",
DlgColorHighlight	: "Märgi",
DlgColorSelected	: "Valitud",

// Smiley Dialog
DlgSmileyTitle		: "Sisesta Smiley",

// Special Character Dialog
DlgSpecialCharTitle	: "Vali erimärk",

// Table Dialog
DlgTableTitle		: "Tabeli atribuudid",
DlgTableRows		: "Read",
DlgTableColumns		: "Veerud",
DlgTableBorder		: "Joone suurus",
DlgTableAlign		: "Joondus",
DlgTableAlignNotSet	: "<Määramata>",
DlgTableAlignLeft	: "Vasak",
DlgTableAlignCenter	: "Kesk",
DlgTableAlignRight	: "Parem",
DlgTableWidth		: "Laius",
DlgTableWidthPx		: "pikslit",
DlgTableWidthPc		: "protsenti",
DlgTableHeight		: "Kõrgus",
DlgTableCellSpace	: "Lahtri vahe",
DlgTableCellPad		: "Lahtri täidis",
DlgTableCaption		: "Seletiitel",

// Table Cell Dialog
DlgCellTitle		: "Lahtri atribuudid",
DlgCellWidth		: "Laius",
DlgCellWidthPx		: "pikslit",
DlgCellWidthPc		: "protsenti",
DlgCellHeight		: "Kõrgus",
DlgCellWordWrap		: "Murra ridu",
DlgCellWordWrapNotSet	: "<Määramata>",
DlgCellWordWrapYes	: "Jah",
DlgCellWordWrapNo	: "Ei",
DlgCellHorAlign		: "Horisontaaljoondus",
DlgCellHorAlignNotSet	: "<Määramata>",
DlgCellHorAlignLeft	: "Vasak",
DlgCellHorAlignCenter	: "Kesk",
DlgCellHorAlignRight: "Parem",
DlgCellVerAlign		: "Vertikaaljoondus",
DlgCellVerAlignNotSet	: "<Määramata>",
DlgCellVerAlignTop	: "Üles",
DlgCellVerAlignMiddle	: "Keskele",
DlgCellVerAlignBottom	: "Alla",
DlgCellVerAlignBaseline	: "Baasjoonele",
DlgCellRowSpan		: "Reaulatus",
DlgCellCollSpan		: "Veeruulatus",
DlgCellBackColor	: "Tausta värv",
DlgCellBorderColor	: "Joone värv",
DlgCellBtnSelect	: "Vali...",

// Find Dialog
DlgFindTitle		: "Otsi",
DlgFindFindBtn		: "Otsi",
DlgFindNotFoundMsg	: "Valitud teksti ei leitud.",

// Replace Dialog
DlgReplaceTitle			: "Asenda",
DlgReplaceFindLbl		: "Leia mida:",
DlgReplaceReplaceLbl	: "Asenda millega:",
DlgReplaceCaseChk		: "Erista suurtähti",
DlgReplaceReplaceBtn	: "Asenda",
DlgReplaceReplAllBtn	: "Asenda kõik",
DlgReplaceWordChk		: "Otsi terveid sõnu",

// Paste Operations / Dialog
PasteErrorPaste	: "Sinu brauseri turvaseaded ei luba redaktoril automaatselt kleepida. Palun kasutage selleks klaviatuuri (Ctrl+V).",
PasteErrorCut	: "Sinu brauseri turvaseaded ei luba redaktoril automaatselt lõigata. Palun kasutage selleks klaviatuuri (Ctrl+X).",
PasteErrorCopy	: "Sinu brauseri turvaseaded ei luba redaktoril automaatselt kopeerida. Palun kasutage selleks klaviatuuri (Ctrl+C).",

PasteAsText		: "Kleebi tavalise tekstina",
PasteFromWord	: "Kleebi Wordist",

DlgPasteMsg		: "Redaktor ei saanud sinu brauseri <STRONG>turvaseadete</STRONG> pärast automatselt kleepida.<BR>Palun kleebi järgmisse kasti kasutades klaviatuuri(<STRONG>Ctrl+V</STRONG>) ja vajuta <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automaatne",
ColorMoreColors	: "Rohkem värve...",

// About Dialog
DlgAboutVersion	: "versioon",
DlgAboutLicense	: "Litsenseeritud GNU Lesser General Public License litsentsiga",
DlgAboutInfo	: "Täpsema info saamiseks mine"
}
