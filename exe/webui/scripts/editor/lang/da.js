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
 * File Name: da.js
 * 	Danish language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-21 01:38:30
 * 
 * File Authors:
 * 		Jesper Michelsen (jm@i-deVision.dk)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

// Toolbar Items and Context Menu
Save				: "Gem",
NewPage				: "Ny side",
Preview				: "Vis eksempel",
Cut					: "Klip",
Copy				: "Kopier",
Paste				: "Indsæt",
PasteText			: "Indsæt som ren tekst",
PasteWord			: "Indsæt fra Word",
Print				: "Udskriv",
SelectAll			: "Vælg alt",
RemoveFormat		: "Slet formatering",
InsertLinkLbl		: "Link",
InsertLink			: "Indsæt/rediger Link",
RemoveLink			: "Slet Link",
InsertImageLbl		: "Billede",
InsertImage			: "Indsæt/rediger billede",
InsertTableLbl		: "Table",
InsertTable			: "Indsæt/rediger tabel",
InsertLineLbl		: "Linie",
InsertLine			: "Indsæt horisontal linie",
InsertSpecialCharLbl: "Special karakter",
InsertSpecialChar	: "Indslt special karakter",
InsertSmileyLbl		: "Smiley",
InsertSmiley		: "Indsæt Smiley",
About				: "Om FCKeditor",
Bold				: "Fed",
Italic				: "Kursiv",
Underline			: "Understreget",
StrikeThrough		: "Overstreget",
Subscript			: "Sænket skrift",
Superscript			: "Hævet skrift",
LeftJustify			: "Venstrestillet",
CenterJustify		: "Centreret",
RightJustify		: "Højrestillet",
BlockJustify		: "Lige margener",
DecreaseIndent		: "Forøg indrykning",
IncreaseIndent		: "Formindsk indrykning",
Undo				: "Fortryd",
Redo				: "Anuller fortryd",
NumberedListLbl		: "Opstilling med tal",
NumberedList		: "Indsæt/slet opstilling med tal",
BulletedListLbl		: "Opstilling med punkttegn",
BulletedList		: "Indsæt/slet opstilling med punkttegn",
ShowTableBorders	: "Vis tabel kanter",
ShowDetails			: "Vis detaljer",
Style				: "Typografi",
FontFormat			: "Formatering",
Font				: "Skrifttype",
FontSize			: "Skriftstørrelse",
TextColor			: "Tekstfarve",
BGColor				: "Baggrundsfarve",
Source				: "Kilde",
Find				: "Søg",
Replace				: "Erstat",

// Context Menu
EditLink			: "Rediger link",
InsertRow			: "Indsæt række",
DeleteRows			: "Slet rækker",
InsertColumn		: "Indsæt kolonne",
DeleteColumns		: "Slet kolonner",
InsertCell			: "Indsæt celle",
DeleteCells			: "Slet celle",
MergeCells			: "Flet celler",
SplitCell			: "Opdel celler",
CellProperties		: "Celleegenskaber",
TableProperties		: "Tabelegenskaber",
ImageProperties		: "Billedegenskaber",

FontFormats			: "Normal;Formateret;Adresse;Overskrift 1;Overskrift 2;Overskrift 3;Overskrift 4;Overskrift 5;Overskrift 6",

// Alerts and Messages
ProcessingXHTML		: "Behandler XHTML. Vent venligst...",
Done				: "Færdig",
PasteWordConfirm	: "Den tekst du forsøger at indsætte ser ud til at komme fra Word. Vil du rense teksten før den indsættes ?",
NotCompatiblePaste	: "Denne kommando er tilgændelig i Internet Explorer 5.5 og senere. Vil du indsætte teksten uden at rense den ?",
UnknownToolbarItem	: "Ukendt værktøjslinje objekt \"%1\"",
UnknownCommand		: "Ukendt kommando navn \"%1\"",
NotImplemented		: "Kommandoen er ikke implementeret",
UnknownToolbarSet	: "Værktøjslinjen \"%1\" eksisterer ikke",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Anuller",
DlgBtnClose			: "Luk",
DlgAdvancedTag		: "Avanceret",

// General Dialogs Labels
DlgGenNotSet		: "&lt;ikke sat&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Tekstretning",
DlgGenLangDirLtr	: "Venstre mod højre (LTR)",
DlgGenLangDirRtl	: "Højre mod venstre (RTL)",
DlgGenLangCode		: "Sprog kode",
DlgGenAccessKey		: "Adgangsnøgle",
DlgGenName			: "Navn",
DlgGenTabIndex		: "Tabulator Indeks",
DlgGenLongDescr		: "Udvidet beskrivelse",
DlgGenClass			: "Typografiark",
DlgGenTitle			: "Titel",
DlgGenContType		: "Indholdstype",
DlgGenLinkCharset	: "Tegnsæt",
DlgGenStyle			: "Typografi",

// Image Dialog
DlgImgTitle			: "Billed egenskaber",
DlgImgInfoTab		: "Billed info",
DlgImgBtnUpload		: "Send til serveren",
DlgImgURL			: "URL",
DlgImgUpload		: "Upload",
DlgImgBtnBrowse		: "Gennemse server",
DlgImgAlt			: "Alternativ tekst",
DlgImgWidth			: "Bredde",
DlgImgHeight		: "Højde",
DlgImgLockRatio		: "Lås størrelsesforhold",
DlgBtnResetSize		: "Nulstil størrelse",
DlgImgBorder		: "Ramme",
DlgImgHSpace		: "HMargin",
DlgImgVSpace		: "VMargin",
DlgImgAlign			: "Justering",
DlgImgAlignLeft		: "Venstre",
DlgImgAlignAbsBottom: "Abs bund",
DlgImgAlignAbsMiddle: "Abs Midte",
DlgImgAlignBaseline	: "Bundlinje",
DlgImgAlignBottom	: "Bund",
DlgImgAlignMiddle	: "Midte",
DlgImgAlignRight	: "Højre",
DlgImgAlignTextTop	: "Tekst top",
DlgImgAlignTop		: "Top",
DlgImgPreview		: "Vis eksempel",
DlgImgMsgWrongExt	: "Der kan kun uploades følgende filtyper:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperation canceled.",
DlgImgAlertSelect	: "Vælg det billede der skal uploades",
DlgImgAlertUrl		: "Indtast stien til billedet",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "Link info",
DlgLnkTargetTab		: "Mål",

DlgLnkType			: "Link type",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Anker på denne side",
DlgLnkTypeEMail		: "Email",
DlgLnkProto			: "Protokol",
DlgLnkProtoOther	: "&lt;anden&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Gennemse serveren",
DlgLnkAnchorSel		: "Vælg et anker",
DlgLnkAnchorByName	: "Efter anker navn",
DlgLnkAnchorById	: "Efter element Id",
DlgLnkNoAnchors		: "&lt;Der er ingen ankre tilgængelige i dette dokument&gt;",
DlgLnkEMail			: "Email Adresse",
DlgLnkEMailSubject	: "Emne",
DlgLnkEMailBody		: "Besked",
DlgLnkUpload		: "Upload",
DlgLnkBtnUpload		: "Send til serveren",

DlgLnkTarget		: "Mål",
DlgLnkTargetFrame	: "&lt;ramme&gt;",
DlgLnkTargetPopup	: "&lt;popup vindue&gt;",
DlgLnkTargetBlank	: "Nyt vindue (_blank)",
DlgLnkTargetParent	: "Overliggende vindue (_parent)",
DlgLnkTargetSelf	: "Samme vindue (_self)",
DlgLnkTargetTop		: "Øverste vindue (_top)",
DlgLnkTargetFrame	: "Målrammens navn",
DlgLnkPopWinName	: "Popup vinduets navn",
DlgLnkPopWinFeat	: "Popup vinduets egenskaber",
DlgLnkPopResize		: "Skalering",
DlgLnkPopLocation	: "Lokationslinje",
DlgLnkPopMenu		: "Menulinje",
DlgLnkPopScroll		: "Scrollbars",
DlgLnkPopStatus		: "Statuslinje",
DlgLnkPopToolbar	: "Værktøjslinje",
DlgLnkPopFullScrn	: "Fuld skærm (IE)",
DlgLnkPopDependent	: "Afhængig (Netscape)",
DlgLnkPopWidth		: "Bredde",
DlgLnkPopHeight		: "Højde",
DlgLnkPopLeft		: "Position fra venstre",
DlgLnkPopTop		: "Position fra toppen",

DlgLnkMsgWrongExtA	: "Kun de følgende filtyper kan uploades:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperation canceled.",
DlgLnkMsgWrongExtD	: "Følgende filtyper kan ikke uploades:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperation canceled.",

// Color Dialog
DlgColorTitle		: "Vælg farve",
DlgColorBtnClear	: "Slet alt",
DlgColorHighlight	: "Marker",
DlgColorSelected	: "valgt",

// Smiley Dialog
DlgSmileyTitle		: "Insæt en smiley",

// Special Character Dialog
DlgSpecialCharTitle	: "Vælg specialkarakter",

// Table Dialog
DlgTableTitle		: "Tabel egenskaber",
DlgTableRows		: "Rækker",
DlgTableColumns		: "Kolonner",
DlgTableBorder		: "Ramme størrelse",
DlgTableAlign		: "Justering",
DlgTableAlignNotSet	: "<Ikke sat>",
DlgTableAlignLeft	: "Venstrestillet",
DlgTableAlignCenter	: "Centreret",
DlgTableAlignRight	: "Højrestillet",
DlgTableWidth		: "Bredde",
DlgTableWidthPx		: "pixels",
DlgTableWidthPc		: "procent",
DlgTableHeight		: "Højde",
DlgTableCellSpace	: "Afstand mellem celler",
DlgTableCellPad		: "Celle margin",
DlgTableCaption		: "Titel",

// Table Cell Dialog
DlgCellTitle		: "Celle egenskaber",
DlgCellWidth		: "Bredde",
DlgCellWidthPx		: "pixels",
DlgCellWidthPc		: "procent",
DlgCellHeight		: "Højde",
DlgCellWordWrap		: "Orddeling",
DlgCellWordWrapNotSet	: "<Ikke sat>",
DlgCellWordWrapYes	: "Ja",
DlgCellWordWrapNo	: "Nej",
DlgCellHorAlign		: "Horisontal justering",
DlgCellHorAlignNotSet	: "<Ikke sat>",
DlgCellHorAlignLeft	: "Venstrestillet",
DlgCellHorAlignCenter	: "Centreret",
DlgCellHorAlignRight: "Højrestillet",
DlgCellVerAlign		: "Vertikal Justering",
DlgCellVerAlignNotSet	: "<Ikke sat>",
DlgCellVerAlignTop	: "Top",
DlgCellVerAlignMiddle	: "Midte",
DlgCellVerAlignBottom	: "Bund",
DlgCellVerAlignBaseline	: "Bundlinje",
DlgCellRowSpan		: "Antal rækker cellen spænder over",
DlgCellCollSpan		: "Antal kolonner cellen spænder over",
DlgCellBackColor	: "Baggrundsfarve",
DlgCellBorderColor	: "rammefarve",
DlgCellBtnSelect	: "Vælg...",

// Find Dialog
DlgFindTitle		: "Find",
DlgFindFindBtn		: "Find",
DlgFindNotFoundMsg	: "Den angivne tekst blev ikke fundet",

// Replace Dialog
DlgReplaceTitle			: "Erstat",
DlgReplaceFindLbl		: "Find:",
DlgReplaceReplaceLbl	: "Erstat med:",
DlgReplaceCaseChk		: "Forskel på store og små bogstaver",
DlgReplaceReplaceBtn	: "Erstat",
DlgReplaceReplAllBtn	: "Erstat alle",
DlgReplaceWordChk		: "Kun hele ord",

// Paste Operations / Dialog
PasteErrorPaste	: "Din browsers sikkerhedsindstillinger tillader ikke editoren at indsætte tekst automatisk. Brug i stedet tastaturet til at indsætte teksten (Ctrl+V).",
PasteErrorCut	: "Din browsers sikkerhedsindstillinger tillader ikke editoren at klippe tekst automatisk. Brug i stedet tastaturet til at klippe teksten (Ctrl+X).",
PasteErrorCopy	: "Din browsers sikkerhedsindstillinger tillader ikke editoren at kopiere tekst automatisk. Brug i stedet tastaturet til at kopiere teksten (Ctrl+V).",

PasteAsText		: "Indsæt som ren tekst",
PasteFromWord	: "Indsæt fra Word",

DlgPasteMsg		: "Editoren kunne ikke indsætte teksten automatisk på grund af din browsers <STRONG>sikkerhedsindstillinger</STRONG>.<BR>Indsæt i stedet teksten i den følgende boks ved hjælp af tastaturet (<STRONG>Ctrl+V</STRONG>) og klik <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatisk",
ColorMoreColors	: "Flere farver...",

// About Dialog
DlgAboutVersion	: "version",
DlgAboutLicense	: "Licenseret under vilkårene for GNU Lesser General Public License",
DlgAboutInfo	: "For yderligere informationer gå til"
}