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
 * File Name: nl.js
 * 	Dutch language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 01:54:22
 * 
 * File Authors:
 * 		Bram Crins (bcrins@realdesign.nl)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Menubar inklappen",
ToolbarExpand		: "Menubar uitklappen",

// Toolbar Items and Context Menu
Save				: "Opslaan",
NewPage				: "Nieuwe pagina",
Preview				: "Voorbeeld",
Cut					: "Knippen",
Copy				: "Kopiëren",
Paste				: "Plakken",
PasteText			: "Plakken als pure tekst",
PasteWord			: "Plakken van Word-gegevens",
Print				: "Printen",
SelectAll			: "Alles selecteren",
RemoveFormat		: "Verwijderen opmaak",
InsertLinkLbl		: "Link",
InsertLink			: "Invoegen/Wijzigen link",
RemoveLink			: "Verwijderen link",
InsertImageLbl		: "Afbeelding",
InsertImage			: "Invoegen/Wijzigen afbeelding",
InsertTableLbl		: "Tabel",
InsertTable			: "Invoegen/Wijzigen tabel",
InsertLineLbl		: "Lijn",
InsertLine			: "Invoegen horizontale lijn",
InsertSpecialCharLbl: "Speciale tekens",
InsertSpecialChar	: "Speciaal teken invoegen",
InsertSmileyLbl		: "Smiley",
InsertSmiley		: "Smiley Invoegen",
About				: "Over FCKeditor",
Bold				: "Vet",
Italic				: "Schuingedrukt",
Underline			: "Onderstreept",
StrikeThrough		: "Doorhalen",
Subscript			: "Subscript",
Superscript			: "Superscript",
LeftJustify			: "Links uitlijnen",
CenterJustify		: "Centreren",
RightJustify		: "Rechts uitlijnen",
BlockJustify		: "Uitvullen",
DecreaseIndent		: "Oplopenend",
IncreaseIndent		: "Aflopend",
Undo				: "Ongedaan maken",
Redo				: "Herhalen",
NumberedListLbl		: "Genummerde lijst",
NumberedList		: "Invoegen/Verwijderen genummerde lijst",
BulletedListLbl		: "Opsomming",
BulletedList		: "Invoegen/Verwijderen opsomming",
ShowTableBorders	: "Rnden tabel weergeven",
ShowDetails			: "Details weergeven",
Style				: "Style",
FontFormat			: "Format",
Font				: "Lettertype",
FontSize			: "Grootte",
TextColor			: "Tekst kleur",
BGColor				: "Achtergrond kleur",
Source				: "Code",
Find				: "Zoeken",
Replace				: "Vervangen",

// Context Menu
EditLink			: "Link wijzigen",
InsertRow			: "Rij invoegen",
DeleteRows			: "Rijen verwijderen",
InsertColumn		: "Kolom invoegen",
DeleteColumns		: "Kolommen verwijderen",
InsertCell			: "Cel",
DeleteCells			: "Cellen verwijderen",
MergeCells			: "Cellen samenvoegen",
SplitCell			: "Cellen splitsen",
CellProperties		: "Eigenschappen cel",
TableProperties		: "Eigenschappen tabel",
ImageProperties		: "Eigenschappen afbeelding",

FontFormats			: "Normaal;Met format;Adres;Heading 1;Heading 2;Heading 3;Heading 4;Heading 5;Heading 6",

// Alerts and Messages
ProcessingXHTML		: "Verwerken XHTML. Even geduld aub...",
Done				: "Klaar",
PasteWordConfirm	: "De tekst die je plat lijkt gekopiëerd uit Word. Wil je de tekst opschonen voordat er geplakt wordt?",	
NotCompatiblePaste	: "Deze opdracht is beschikbaar voor Inernet Explorer versie 5.5 of hoger. Wil je plakken zonder opschonen?",
UnknownToolbarItem	: "Onbekende item op menubalk \"%1\"",
UnknownCommand		: "Onbekende opdracht naam \"%1\"",
NotImplemented		: "Opdracht niet geimplementeerd.",
UnknownToolbarSet	: "Menubalk \"%1\" bestaat niet.",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Annuleren",
DlgBtnClose			: "Afsluiten",
DlgAdvancedTag		: "Geavanceerd",

// General Dialogs Labels
DlgGenNotSet		: "&lt;niet ingevuld&gt;",
DlgGenId			: "Kenmerk",
DlgGenLangDir		: "Richting taal",
DlgGenLangDirLtr	: "Links naar Rechts (LTR)",
DlgGenLangDirRtl	: "Rechts naar Links (RTL)",
DlgGenLangCode		: "Code taal",
DlgGenAccessKey		: "Toegangs toets",
DlgGenName			: "Naam",
DlgGenTabIndex		: "Tab Index",
DlgGenLongDescr		: "Lange omschrijving URL",
DlgGenClass			: "Stylesheet Klassen",
DlgGenTitle			: "Advisory titel",
DlgGenContType		: "Advisory Content type",
DlgGenLinkCharset	: "Gelinkte bron karakterset",
DlgGenStyle			: "Stijl",

// Image Dialog
DlgImgTitle			: "Eigenschappen afbeelding",
DlgImgInfoTab		: "Informatie afbeelding",
DlgImgBtnUpload		: "Naar server verzenden",
DlgImgURL			: "URL",
DlgImgUpload		: "Upload",
DlgImgBtnBrowse		: "Bladeren op server",
DlgImgAlt			: "Alternatieve tekst",
DlgImgWidth			: "Breedte",
DlgImgHeight		: "Hoogte",
DlgImgLockRatio		: "Afmetingen vergrendelen",
DlgBtnResetSize		: "Afmetingen resetten",
DlgImgBorder		: "Rand",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Uitlijning",
DlgImgAlignLeft		: "Links",
DlgImgAlignAbsBottom: "Abs beneden",
DlgImgAlignAbsMiddle: "Abs midden",
DlgImgAlignBaseline	: "Basislijn",
DlgImgAlignBottom	: "Beneden",
DlgImgAlignMiddle	: "Midden",
DlgImgAlignRight	: "Rechts",
DlgImgAlignTextTop	: "Tekst boven",
DlgImgAlignTop		: "Boven",
DlgImgPreview		: "Voorbeeld",
DlgImgMsgWrongExt	: "Alleen de upload van de volgende bestandstypes zijn geoorloofd :\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nHandeling geannuleerd.",
DlgImgAlertSelect	: "Selecteer een afbeelding om te verzenden.",
DlgImgAlertUrl		: "Geeft de URL van de afbeelding",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "Informatie link",
DlgLnkTargetTab		: "Doel",

DlgLnkType			: "Type link",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Interne link in pagina",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protocol",
DlgLnkProtoOther	: "&lt;anders&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Bladeren op server",
DlgLnkAnchorSel		: "Kies een interne link",
DlgLnkAnchorByName	: "Op naam interne link",
DlgLnkAnchorById	: "Op kenmerk interne link",
DlgLnkNoAnchors		: "&lt;Geen interne links in document gevonden.&gt;",
DlgLnkEMail			: "E-Mail adres",
DlgLnkEMailSubject	: "Onderwerp bericht",
DlgLnkEMailBody		: "Inhoud bericht",
DlgLnkUpload		: "Upload",
DlgLnkBtnUpload		: "Naar de server versturen.",

DlgLnkTarget		: "Doel",
DlgLnkTargetFrame	: "&lt;frame&gt;",
DlgLnkTargetPopup	: "&lt;popup window&gt;",
DlgLnkTargetBlank	: "Nieuw venster (_blank)",
DlgLnkTargetParent	: "Ouder venster (_parent)",
DlgLnkTargetSelf	: "Zelfde venster (_self)",
DlgLnkTargetTop		: "Browser venster (_top)",
DlgLnkTargetFrame	: "Naam doel frame",
DlgLnkPopWinName	: "Naam popup venster",
DlgLnkPopWinFeat	: "Instellingen popup venster",
DlgLnkPopResize		: "Grootte wijzigen",
DlgLnkPopLocation	: "Locatie menu",
DlgLnkPopMenu		: "Menu balk",
DlgLnkPopScroll		: "Schuifbalken",
DlgLnkPopStatus		: "Statusbalk",
DlgLnkPopToolbar	: "Menubalk",
DlgLnkPopFullScrn	: "Volledig scherm (IE)",
DlgLnkPopDependent	: "Afhankelijk (Netscape)",
DlgLnkPopWidth		: "Breedte",
DlgLnkPopHeight		: "Hoogte",
DlgLnkPopLeft		: "Positie links",
DlgLnkPopTop		: "Positie top",

DlgLnkMsgWrongExtA	: "Alleen de upload van de volgende bestandstypes zijn geoorloofd:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nHandeling geannuleerd.",
DlgLnkMsgWrongExtD	: "Alleen de upload van de volgende bestandstypes zijn geoorloofd:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nHandeling geannuleerd.",

DlnLnkMsgNoUrl		: "Geeft de link van de URL",
DlnLnkMsgNoEMail	: "Geef een e-mail adres",
DlnLnkMsgNoAnchor	: "Selecteer een interne link",

// Color Dialog
DlgColorTitle		: "Selecteer kleur",
DlgColorBtnClear	: "Opschonen",
DlgColorHighlight	: "Accentueren",
DlgColorSelected	: "Geselecteerd",

// Smiley Dialog
DlgSmileyTitle		: "Invoegen smiley",

// Special Character Dialog
DlgSpecialCharTitle	: "Selecteer speciaal karakter",

// Table Dialog
DlgTableTitle		: "Eigenschappen tabel",
DlgTableRows		: "Rijen",
DlgTableColumns		: "Kolommen",
DlgTableBorder		: "Breedte rand",
DlgTableAlign		: "Uitlijning",
DlgTableAlignNotSet	: "<Niet ingegven>",
DlgTableAlignLeft	: "Links",
DlgTableAlignCenter	: "Centreren",
DlgTableAlignRight	: "Rechts",
DlgTableWidth		: "Breedte",
DlgTableWidthPx		: "pixels",
DlgTableWidthPc		: "procent",
DlgTableHeight		: "Hoogte",
DlgTableCellSpace	: "Afstand tussen cellen",
DlgTableCellPad		: "Afstand vanaf rand cel",
DlgTableCaption		: "Naam",

// Table Cell Dialog
DlgCellTitle		: "Eigenschappen cel",
DlgCellWidth		: "Breedte",
DlgCellWidthPx		: "pixels",
DlgCellWidthPc		: "procent",
DlgCellHeight		: "Hoogte",
DlgCellWordWrap		: "Afbreken woorden",
DlgCellWordWrapNotSet	: "<Niet ingegeven>",
DlgCellWordWrapYes	: "Ja",
DlgCellWordWrapNo	: "Nee",
DlgCellHorAlign		: "Horizontale uitlijning",
DlgCellHorAlignNotSet	: "<Niet ingegeven>",
DlgCellHorAlignLeft	: "Links",
DlgCellHorAlignCenter	: "Centreren",
DlgCellHorAlignRight: "Reechts",
DlgCellVerAlign		: "Verticale uitlijning",
DlgCellVerAlignNotSet	: "<Niet ingegeven>",
DlgCellVerAlignTop	: "Boven",
DlgCellVerAlignMiddle	: "Midden",
DlgCellVerAlignBottom	: "Beneden",
DlgCellVerAlignBaseline	: "Basislijn",
DlgCellRowSpan		: "Overkoepeling rijen",
DlgCellCollSpan		: "Overkoepeling kolommen",
DlgCellBackColor	: "Kleur achterrond",
DlgCellBorderColor	: "Kleur rand",
DlgCellBtnSelect	: "Selecteren...",

// Find Dialog
DlgFindTitle		: "Vinden",
DlgFindFindBtn		: "Vinden",
DlgFindNotFoundMsg	: "De opgegeven tekst is niet gevonden.",

// Replace Dialog
DlgReplaceTitle			: "Vervangen",
DlgReplaceFindLbl		: "Zoeken naar:",
DlgReplaceReplaceLbl	: "Vervangen met:",
DlgReplaceCaseChk		: "Hoofdlettergevoelig",
DlgReplaceReplaceBtn	: "Vervangen",
DlgReplaceReplAllBtn	: "Allesvervangen",
DlgReplaceWordChk		: "Hele woord moet voorkomen",

// Paste Operations / Dialog
PasteErrorPaste	: "De beveiligingsinstelling van de browser verhinderen het automatisch plakken. Gebruik Ctrl+V op het toetsenbord.",
PasteErrorCut	: "De beveiligingsinstelling van de browser verhinderen het automatisch knippen. Gebruik Ctrl+X op het toetsenbord.",
PasteErrorCopy	: "De beveiligingsinstelling van de browser verhinderen het automatisch kopieëren. Gebruik Ctrl+C op het toetsenbord.",

PasteAsText		: "Plakken als platte tekst",
PasteFromWord	: "Plakken van Word-gegevens",

DlgPasteMsg		: "The editor was not able to automaticaly execute pasting because of the <STRONG>security settings</STRONG> of your browser.<BR>Please paste inside the following box using the keyboard (<STRONG>Ctrl+V</STRONG>) and hit <STRONG>OK</STRONG>.",
DlgPasteMsg		: "De <STRONG>beveiligingsinstelling</STRONG> van de browser verhinderen het automatisch plakken. <BR>Plak de data in de volgende pagina door gebruik te maken van toetsenbord(<STRONG>Ctrl+V</STRONG>).  Klik hierna op <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatisch",
ColorMoreColors	: "Meer kleuren...",

// About Dialog
DlgAboutVersion	: "Versie",
DlgAboutLicense	: "Gelicenceerd onder de condities van de GNU Lesser General Public License",
DlgAboutInfo	: "Voor meer informatie ga naar "
}