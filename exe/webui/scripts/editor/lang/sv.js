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
 * File Name: sv.js
 * 	Swedish language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-30 12:16:30
 * 
 * File Authors:
 * 		Kristoffer Malvefors (kristoffer@intema.ws)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir				: "ltr",

// Toolbar Items and Context Menu
Save				: "Spara",
NewPage				: "Ny sida",
Preview				: "Förhandsgranska",
Cut				: "Klipp ut",
Copy				: "Kopiera",
Paste				: "Klistra in",
PasteText			: "Klistra in som text",
PasteWord			: "Klistra in från Word",
Print				: "Skriv ut",
SelectAll			: "Markera allt",
RemoveFormat			: "Radera formatering",
InsertLinkLbl			: "Länk",
InsertLink			: "Infoga/Editera länk",
RemoveLink			: "Radera länk",
InsertImageLbl			: "Bild",
InsertImage			: "Infoga/Editera bild",
InsertTableLbl			: "Tabell",
InsertTable			: "Infoga/Editera tabell",
InsertLineLbl			: "Linje",
InsertLine			: "Infoga horisontal linje",
InsertSpecialCharLbl		: "Utökade tecken",
InsertSpecialChar		: "Klistra in utökat tecken",
InsertSmileyLbl			: "Smiley",
InsertSmiley			: "Infoga Smiley",
About				: "Om FCKeditor",
Bold				: "Fet",
Italic				: "Kursiv",
Underline			: "Understruken",
StrikeThrough			: "Genomstruken",
Subscript			: "Nedsänkta tecken",
Superscript			: "Upphöjda tecken",
LeftJustify			: "Vänsterjustera",
CenterJustify			: "Centrera",
RightJustify			: "Högerjustera",
BlockJustify			: "Justera till marginaler",
DecreaseIndent			: "Minska indrag",
IncreaseIndent			: "Öka indrag",
Undo				: "Ångra",
Redo				: "Gör om",
NumberedListLbl			: "Numrerad lista",
NumberedList			: "Infoga/Radera numrerad lista",
BulletedListLbl			: "Punktlista",
BulletedList			: "Infoga/Radera punktlista",
ShowTableBorders		: "Visa tabellkant",
ShowDetails			: "Visa radbrytningar",
Style				: "Anpassad stil",
FontFormat			: "Teckenformat",
Font				: "Typsnitt",
FontSize			: "Storlek",
TextColor			: "Textfärg",
BGColor				: "Bakgrundsfärg",
Source				: "Källa",
Find				: "Sök",
Replace				: "Ersätt",

// Context Menu
EditLink			: "Editera länk",
InsertRow			: "Infoga rad",
DeleteRows			: "Radera rad",
InsertColumn			: "Infoga kolumn",
DeleteColumns			: "Radera kolumn",
InsertCell			: "Infoga cell",
DeleteCells			: "Radera celler",
MergeCells			: "Sammanfoga celler",
SplitCell			: "Separera celler",
CellProperties			: "Cellegenskaper",
TableProperties			: "Tabellegenskaper",
ImageProperties			: "Bildegenskaper",

FontFormats			: "Normal;Formaterad;Adress;Rubrik 1;Rubrik 2;Rubrik 3;Rubrik 4;Rubrik 5;Rubrik 6",

// Alerts and Messages
ProcessingXHTML			: "Bearbetar XHTML. Var god vänta...",
Done				: "Klar",
PasteWordConfirm		: "Texten du vill klistra in verkar vara kopierad från Word. Vill du rensa innan du klistar in?",
NotCompatiblePaste		: "Denna åtgärd är inte tillgängligt för Internet Explorer version 5.5 eller högre. Vill du klistra in utan att rensa?",
UnknownToolbarItem		: "Okänt verktygsfält \"%1\"",
UnknownCommand			: "Okänt kommando \"%1\"",
NotImplemented			: "Kommandot finns ej",
UnknownToolbarSet		: "Verktygsfält \"%1\" finns ej",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel			: "Avbryt",
DlgBtnClose			: "Stäng",
DlgAdvancedTag			: "Avancerad",

// General Dialogs Labels
DlgGenNotSet			: "&lt;ej angivet&gt;",
DlgGenId			: "Id",
DlgGenLangDir			: "Språkriktning",
DlgGenLangDirLtr		: "Vänster till Höger (VTH)",
DlgGenLangDirRtl		: "Höger till Vänster (HTV)",
DlgGenLangCode			: "Språkkod",
DlgGenAccessKey			: "Behörighetsnyckel",
DlgGenName			: "Namn",
DlgGenTabIndex			: "Tabindex",
DlgGenLongDescr			: "URL-beskrivning",
DlgGenClass			: "Stylesheet class",
DlgGenTitle			: "Titel",
DlgGenContType			: "Innehållstyp",
DlgGenLinkCharset		: "Teckenuppställning",
DlgGenStyle			: "Style",

// Image Dialog
DlgImgTitle			: "Bildegenskaper",
DlgImgInfoTab			: "Bildinformation",
DlgImgBtnUpload			: "Skicka till server",
DlgImgURL			: "URL",
DlgImgUpload			: "Ladda upp",
DlgImgBtnBrowse			: "Bläddra på servern",
DlgImgAlt			: "Alternativ text",
DlgImgWidth			: "Bredd",
DlgImgHeight			: "Höjd",
DlgImgLockRatio			: "Lås höjd/bredd förhållanden",
DlgBtnResetSize			: "Återställ storlek",
DlgImgBorder			: "Kant",
DlgImgHSpace			: "Horis. marginal",
DlgImgVSpace			: "Vert. marginal",
DlgImgAlign			: "Justering",
DlgImgAlignLeft			: "Vänster",
DlgImgAlignAbsBottom		: "Absolut nederkant",
DlgImgAlignAbsMiddle		: "Absolut centrering",
DlgImgAlignBaseline		: "Baslinje",
DlgImgAlignBottom		: "Nederkant",
DlgImgAlignMiddle		: "Mitten",
DlgImgAlignRight		: "Höger",
DlgImgAlignTextTop		: "Text överkant",
DlgImgAlignTop			: "Överkant",
DlgImgPreview			: "Förhandsgranska",
DlgImgMsgWrongExt		: "Tyvärr, endast dessa filtyper kan laddas upp:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nÅtgärden avbröts.",
DlgImgAlertSelect		: "Var god välj en bild att ladda upp.",
DlgImgAlertUrl			: "Var god och ange bildens URL",

// Link Dialog
DlgLnkWindowTitle		: "Länk",
DlgLnkInfoTab			: "Länkinformation",
DlgLnkTargetTab			: "Mål",

DlgLnkType			: "Länktyp",
DlgLnkTypeURL			: "URL",
DlgLnkTypeAnchor		: "Ankare i sidan",
DlgLnkTypeEMail			: "E-post",
DlgLnkProto			: "Protokoll",
DlgLnkProtoOther		: "&lt;övrigt&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse			: "Bläddra på servern",
DlgLnkAnchorSel			: "Välj ett ankare",
DlgLnkAnchorByName		: "efter ankarnamn",
DlgLnkAnchorById		: "efter objektid",
DlgLnkNoAnchors			: "&lt;Inga ankare kunde hittas&gt;",
DlgLnkEMail			: "E-post adress",
DlgLnkEMailSubject		: "Ämne",
DlgLnkEMailBody			: "Innehåll",
DlgLnkUpload			: "Ladda upp",
DlgLnkBtnUpload			: "Skicka till servern",

DlgLnkTarget			: "Mål",
DlgLnkTargetFrame		: "&lt;ram&gt;",
DlgLnkTargetPopup		: "&lt;popup-fönster&gt;",
DlgLnkTargetBlank		: "Nytt fönster (_blank)",
DlgLnkTargetParent		: "Föregående Window (_parent)",
DlgLnkTargetSelf		: "Detta fönstret (_self)",
DlgLnkTargetTop			: "Översta fönstret (_top)",
DlgLnkTargetFrame		: "Målets ram namn",
DlgLnkPopWinName		: "Popup-fönstrets namn",
DlgLnkPopWinFeat		: "Popup-fönstrets egenskaper",
DlgLnkPopResize			: "Kan ändra storlek",
DlgLnkPopLocation		: "Adressfält",
DlgLnkPopMenu			: "Menyfält",
DlgLnkPopScroll			: "Scrolllista",
DlgLnkPopStatus			: "Statusfält",
DlgLnkPopToolbar		: "Verktygsfält",
DlgLnkPopFullScrn		: "Helskärm (endast IE)",
DlgLnkPopDependent		: "Beroende (endest Netscape)",
DlgLnkPopWidth			: "Bredd",
DlgLnkPopHeight			: "Höjd",
DlgLnkPopLeft			: "Position från vänster",
DlgLnkPopTop			: "Position från sidans topp",

DlgLnkMsgWrongExtA		: "Tyvärr, endast dessa filtyper kan laddas upp:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nÅtgärden avbröts.",
DlgLnkMsgWrongExtD		: "Tyvärr, dessa filtyper kan ej laddas upp:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nÅtgärden avbröts.",

// Color Dialog
DlgColorTitle			: "Välj färg",
DlgColorBtnClear		: "Rensa",
DlgColorHighlight		: "Markera",
DlgColorSelected		: "Vald",

// Smiley Dialog
DlgSmileyTitle			: "Infoga en smiley",

// Special Character Dialog
DlgSpecialCharTitle		: "Välj utökat tecken",

// Table Dialog
DlgTableTitle			: "Tabellegenskaper",
DlgTableRows			: "Rader",
DlgTableColumns			: "Kolumner",
DlgTableBorder			: "Kantstorlek",
DlgTableAlign			: "Justering",
DlgTableAlignNotSet		: "<ej angivet>",
DlgTableAlignLeft		: "Vänster",
DlgTableAlignCenter		: "Centrerad",
DlgTableAlignRight		: "Höger",
DlgTableWidth			: "Bredd",
DlgTableWidthPx			: "pixlar",
DlgTableWidthPc			: "procent",
DlgTableHeight			: "Höjd",
DlgTableCellSpace		: "Cellavstånd",
DlgTableCellPad			: "Cellutfyllnad",
DlgTableCaption			: "Rubrik",

// Table Cell Dialog
DlgCellTitle			: "Cellegenskaper",
DlgCellWidth			: "Bredd",
DlgCellWidthPx			: "pixlar",
DlgCellWidthPc			: "procent",
DlgCellHeight			: "Höjd",
DlgCellWordWrap			: "Automatisk radbrytning",
DlgCellWordWrapNotSet		: "<Ej angivet>",
DlgCellWordWrapYes		: "Ja",
DlgCellWordWrapNo		: "Nej",
DlgCellHorAlign			: "Horisontal justering",
DlgCellHorAlignNotSet		: "<Ej angivet>",
DlgCellHorAlignLeft		: "Vänster",
DlgCellHorAlignCenter		: "Centrerad",
DlgCellHorAlignRight		: "Höger",
DlgCellVerAlign			: "Vertikal justering",
DlgCellVerAlignNotSet		: "<Ej angivet>",
DlgCellVerAlignTop		: "Topp",
DlgCellVerAlignMiddle		: "Mitten",
DlgCellVerAlignBottom		: "Nederkant",
DlgCellVerAlignBaseline		: "Underst",
DlgCellRowSpan			: "Radomfång",
DlgCellCollSpan			: "Kolumnomfång",
DlgCellBackColor		: "Bakgrundsfärg",
DlgCellBorderColor		: "Kantfärg",
DlgCellBtnSelect		: "Välj...",

// Find Dialog
DlgFindTitle			: "Sök",
DlgFindFindBtn			: "Sök",
DlgFindNotFoundMsg		: "Angiven text kunde ej hittas.",

// Replace Dialog
DlgReplaceTitle			: "Ersätt",
DlgReplaceFindLbl		: "Sök efter:",
DlgReplaceReplaceLbl		: "Ersätt med:",
DlgReplaceCaseChk		: "Skiftläge",
DlgReplaceReplaceBtn		: "Ersätt",
DlgReplaceReplAllBtn		: "Ersätt alla",
DlgReplaceWordChk		: "Inkludera hela ord",

// Paste Operations / Dialog
PasteErrorPaste			: "Säkerhetsinställningar i Er webläsare tillåter inte åtgården Klistra in. Använd (Ctrl+V) istället.",
PasteErrorCut			: "Säkerhetsinställningar i Er webläsare tillåter inte åtgården Klipp ut. Använd (Ctrl+X) istället.",
PasteErrorCopy			: "Säkerhetsinställningar i Er webläsare tillåter inte åtgården Kopiera. Använd (Ctrl+C) istället",

PasteAsText			: "Klistra in som vanlig text",
PasteFromWord			: "Klistra in från Word",

DlgPasteMsg			: "Editorn tilläts ej att Klistra in p.g.a webläsarens <STRONG>säkerhetsinställning</STRONG>.<BR>Var god och Klistra in i fältet nedan genom att använda (<STRONG>Ctrl+V</STRONG>). Klicka sen på <STRONG>OK</STRONG>",

// Color Picker
ColorAutomatic			: "Automatisk",
ColorMoreColors			: "Fler färger...",

// About Dialog
DlgAboutVersion			: "version",
DlgAboutLicense			: "Licensierad under villkoren av GNU Lesser General Public License",
DlgAboutInfo			: "För mer information se"
}