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
 * File Name: de.js
 * 	German language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 01:02:38
 * 
 * File Authors:
 * 		Maik Unruh (m.unruh@mm-concept.de)
 * 		Hendrik Kramer (HK@lwd.de)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Toolbar einklappen",
ToolbarExpand		: "Toolbar ausklappen",

// Toolbar Items and Context Menu
Save				: "Speichern",
NewPage				: "Neue Seite",
Preview				: "Vorschau",
Cut					: "Ausschneiden",
Copy				: "Kopieren",
Paste				: "Einfuegen",
PasteText			: "aus Textdatei einfuegen",
PasteWord			: "aus Word einfuegen",
Print				: "Drucken",
SelectAll			: "Alles auswaehlen",
RemoveFormat		: "Formatierungen entfernen",
InsertLinkLbl		: "Link",
InsertLink			: "Link einfuegen/editieren",
RemoveLink			: "Link entfernen",
InsertImageLbl		: "Bild",
InsertImage			: "Bild einfuegen/editieren",
InsertTableLbl		: "Tabelle",
InsertTable			: "Tabelle einfuegen/editieren",
InsertLineLbl		: "Linie",
InsertLine			: "Horizontale Linie einfuegen",
InsertSpecialCharLbl: "Sonderzeichen",
InsertSpecialChar	: "Sonderzeichen einfuegen/editieren",
InsertSmileyLbl		: "Smiley",
InsertSmiley		: "Smiley einfuegen",
About				: "Ueber FCKeditor",
Bold				: "Fett",
Italic				: "Kursiv",
Underline			: "Unterstrichen",
StrikeThrough		: "Durchgestrichen",
Subscript			: "Tiefgestellt",
Superscript			: "Hochgestellt",
LeftJustify			: "Linksbuendig",
CenterJustify		: "Zentriert",
RightJustify		: "Rechtsbuendig",
BlockJustify		: "Blocksatz",
DecreaseIndent		: "Einzug verringern",
IncreaseIndent		: "Einzug erhoehen",
Undo				: "Rueckgaengig",
Redo				: "Wiederherstellen",
NumberedListLbl		: "Nummerierte Liste",
NumberedList		: "Nummerierte Liste einfuegen/entfernen",
BulletedListLbl		: "Liste",
BulletedList		: "Liste einfuegen/entfernen",
ShowTableBorders	: "Zeige Tabellenrahmen",
ShowDetails			: "Zeige Details",
Style				: "Style",
FontFormat			: "Format",
Font				: "Font",
FontSize			: "Size",
TextColor			: "Textfarbe",
BGColor				: "Hintergrundfarbe",
Source				: "Quellcode",
Find				: "Finden",
Replace				: "Ersetzen",

// Context Menu
EditLink			: "Link editieren",
InsertRow			: "Zeile einfuegen",
DeleteRows			: "Zeile entfernen",
InsertColumn		: "Spalte einfuegen",
DeleteColumns		: "Spalte loeschen",
InsertCell			: "Zelle einfuegen",
DeleteCells			: "Zelle loeschen",
MergeCells			: "Zellen vereinen",
SplitCell			: "Zelle teilen",
CellProperties		: "Zellen Eigenschaften",
TableProperties		: "Tabellen Eigenschaften",
ImageProperties		: "Bild Eigenschaften",

FontFormats			: "Normal;Formattiert; Addresse;Kopfzeile 1;Kopfzeile 2;Kopfzeile 3;Kopfzeile 4;Kopfzeile 5;Kopfzeile 6",

// Alerts and Messages
ProcessingXHTML		: "Bearbeite XHTML. Bitte warten...",
Done				: "Fertig",
PasteWordConfirm	: "Den Text, den Sie einfuegen moechten, scheint aus Word kopiert zu sein. Moechten Sie ihn zuvor bereinigen lassen?",
NotCompatiblePaste	: "Diese Funktion steht nur im Internet Explorer ab Version 5.5 zur Verfuegung. Moechten Sie den Text unbereinigt einfuegen?",
UnknownToolbarItem	: "Unbekanntes Menueleisten-Objekt \"%1\"",
UnknownCommand		: "Unbekannter Befehl \"%1\"",
NotImplemented		: "Befehl nicht implementiert",
UnknownToolbarSet	: "Menueleiste \"%1\" existiert nicht",

// Dialogs
DlgBtnOK			: "ok",
DlgBtnCancel		: "abbrechen",
DlgBtnClose			: "schliessen",
DlgAdvancedTag		: "erweitert",

// General Dialogs Labels
DlgGenNotSet		: "&lt; nichts &gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Schreibrichtung",
DlgGenLangDirLtr	: "Links nach Rechts (LTR)",
DlgGenLangDirRtl	: "Rechts nach Links (RTL)",
DlgGenLangCode		: "Sprachenkuerzel",
DlgGenAccessKey		: "Schluessel",
DlgGenName			: "Name",
DlgGenTabIndex		: "Tab Index",
DlgGenLongDescr		: "Langform URL",
DlgGenClass			: "Stylesheet Klasse",
DlgGenTitle			: "Titel Beschreibung",
DlgGenContType		: "Content Beschreibung",
DlgGenLinkCharset	: "Ziel-Zechensatz",
DlgGenStyle			: "Style",

// Image Dialog
DlgImgTitle			: "Bild Eigenschaften",
DlgImgInfoTab		: "bild info",
DlgImgBtnUpload		: "zum Server senden",
DlgImgURL			: "Bildauswahl",
DlgImgUpload		: "Upload",
DlgImgBtnBrowse		: "Server durchsuchen",
DlgImgAlt			: "Alternativer Text",
DlgImgWidth			: "Breite",
DlgImgHeight		: "Hoehe",
DlgImgLockRatio		: "Groessenverhaeltniss beibehalten",
DlgBtnResetSize		: "Groesse zuruecksetzen",
DlgImgBorder		: "Rahmen",
DlgImgHSpace		: "H-Freiraum",
DlgImgVSpace		: "V-Freiraum",
DlgImgAlign			: "Ausrichtung",
DlgImgAlignLeft		: "Links",
DlgImgAlignAbsBottom: "Abs Unten",
DlgImgAlignAbsMiddle: "Abs Mitte",
DlgImgAlignBaseline	: "Baseline",
DlgImgAlignBottom	: "Unten",
DlgImgAlignMiddle	: "Mitte",
DlgImgAlignRight	: "Rechts",
DlgImgAlignTextTop	: "Text Oben",
DlgImgAlignTop		: "Oben",
DlgImgPreview		: "Vorschau",
DlgImgMsgWrongExt	: "Nur Bilder mit folgenden Formaten duerfen hochgeladen werden:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nVorgang abgebrochen.",
DlgImgAlertSelect	: "Bitte Bild zum upload auswaehlen.",
DlgImgAlertUrl		: "Bitte geben Sie die Bild-URL an",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "link info",
DlgLnkTargetTab		: "zielseite",

DlgLnkType			: "Link Typ",
DlgLnkTypeURL		: "URL",
DlgLnkTypeCMSTarget  :  "CMS Target",
DlgLnkTypeDownload  :  "Datei Download",
DlgLnkTypeAnchor	: "Anker in dieser Seite",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protokol",
DlgLnkProtoOther	: "&lt;anderes&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Server durchsuchen",
DlgLnkAnchorSel		: "Anker auswaehlen",
DlgLnkAnchorByName	: "nach Anker Name",
DlgLnkAnchorById	: "nach Element Id",
DlgLnkNoAnchors		: "&lt;keine Anker im Dokument vorhanden&gt;",
DlgLnkEMail			: "E-Mail Addresse",
DlgLnkEMailSubject	: "Betreffzeile",
DlgLnkEMailBody		: "Nachrichtentext",
DlgLnkUpload		: "Upload",
DlgLnkBtnUpload		: "zum Server senden",

DlgLnkTarget		: "Zielseite",
DlgLnkTargetFrame	: "&lt;frame&gt;",
DlgLnkTargetPopup	: "&lt;Pop-up Fenster&gt;",
DlgLnkTargetBlank	: "Neues Fenster (_blank)",
DlgLnkTargetParent	: "oberes Fenster (_parent)",
DlgLnkTargetSelf	: "gleiches Fenster (_self)",
DlgLnkTargetTop		: "oberstes Fenster (_top)",
DlgLnkTargetFrame	: "Ziel Frame-Name",
DlgLnkPopWinName	: "Pop-up Fenster Name",
DlgLnkPopWinFeat	: "Pop-up Fenster Eigenschaften",
DlgLnkPopResize		: "Vergroesserbar",
DlgLnkPopLocation	: "Adress-Leiste",
DlgLnkPopMenu		: "Menue-Leiste",
DlgLnkPopScroll		: "Scroll-Leisten",
DlgLnkPopStatus		: "Status-Leiste",
DlgLnkPopToolbar	: "Werkzeugleiste",
DlgLnkPopFullScrn	: "Vollbild (IE)",
DlgLnkPopDependent	: "Abhaengig (Netscape)",
DlgLnkPopWidth		: "Breite",
DlgLnkPopHeight		: "Hoehe",
DlgLnkPopLeft		: "Linke Position",
DlgLnkPopTop		: "Obere Position",


DlgLnkMsgWrongExtA	: "Nur Dateien der folgenden Formate duerfen hochgeladen werden\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nVorgang abgebrochen.",
DlgLnkMsgWrongExtD	: "Dateien der folgenden Formate sind nicht erlaubt:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nVorgang abgebrochen.",

DlnLnkMsgNoUrl		: "Bitte geben Sie die Link-URL an",
DlnLnkMsgNoEMail	: "Bitte geben Sie e-Mail Adresse an",
DlnLnkMsgNoAnchor	: "Bitte waehlen Sie einen Anker aus",

// Color Dialog
DlgColorTitle		: "Farbauswahl",
DlgColorBtnClear	: "keine Farbe",
DlgColorHighlight	: "Vorschau",
DlgColorSelected	: "ausgewaehlt",

// Smiley Dialog
DlgSmileyTitle		: "Smiley auswaehlen",

// Special Character Dialog
DlgSpecialCharTitle	: "Sonderzeichen auswaehlen",

// Table Dialog
DlgTableTitle		: "Tabellen Eigenschaften",
DlgTableRows		: "Zeile",
DlgTableColumns		: "Spalte",
DlgTableBorder		: "Rahmen",
DlgTableAlign		: "Ausrichtung",
DlgTableAlignNotSet	: "<nichts>",
DlgTableAlignLeft	: "Links",
DlgTableAlignCenter	: "Zentriert",
DlgTableAlignRight	: "Rechts",
DlgTableWidth		: "Breite",
DlgTableWidthPx		: "Pixel",
DlgTableWidthPc		: "%",
DlgTableHeight		: "Hoehe",
DlgTableCellSpace	: "Zellenabstand aussen",
DlgTableCellPad		: "Zellenabstand innen",
DlgTableCaption		: "Ueberschrift",

// Table Cell Dialog
DlgCellTitle		: "Zellen Eigenschaften",
DlgCellWidth		: "Breite",
DlgCellWidthPx		: "Pixel",
DlgCellWidthPc		: "%",
DlgCellHeight		: "Hoehe",
DlgCellWordWrap		: "Umbruch",
DlgCellWordWrapNotSet	: "<nichts>",
DlgCellWordWrapYes	: "Ja",
DlgCellWordWrapNo	: "Nein",
DlgCellHorAlign		: "Horizontale Ausrichtung",
DlgCellHorAlignNotSet	: "<nichts>",
DlgCellHorAlignLeft	: "Links",
DlgCellHorAlignCenter	: "Zentriert",
DlgCellHorAlignRight: "Rechts",
DlgCellVerAlign		: "Vertikale Ausrichtung",
DlgCellVerAlignNotSet	: "<nichts>",
DlgCellVerAlignTop	: "Oben",
DlgCellVerAlignMiddle	: "Mitte",
DlgCellVerAlignBottom	: "Unten",
DlgCellVerAlignBaseline	: "Baseline",
DlgCellRowSpan		: "Zeilen zusammenfassen",
DlgCellCollSpan		: "Spalten zusammenfassen",
DlgCellBackColor	: "Hintergrundfarbe",
DlgCellBorderColor	: "Rahmenfarbe",
DlgCellBtnSelect	: "Auswahl...",

// Find Dialog
DlgFindTitle		: "Finden",
DlgFindFindBtn		: "Finden",
DlgFindNotFoundMsg	: "Der Suchtext wurde nicht gefunden.",

// Replace Dialog
DlgReplaceTitle			: "Ersetzen",
DlgReplaceFindLbl		: "Suche nach:",
DlgReplaceReplaceLbl	: "Ersetze mit:",
DlgReplaceCaseChk		: "Gross-Kleinschreibung beachten",
DlgReplaceReplaceBtn	: "Ersetzen",
DlgReplaceReplAllBtn	: "Alle Ersetzen",
DlgReplaceWordChk		: "nur ganze Worte suchen",

// Paste Operations / Dialog
PasteErrorPaste	: "Die Sicherheitseinstellungen Ihres Browsers lassen es nicht zu, den Text automatisch einzufuegen. Bitte Benutzen Sie die System-Zwischenablage ueber STRG-C (kopieren) und STRG-V (einfuegen).",
PasteErrorCut	: "Die Sicherheitseinstellungen Ihres Browsers lassen es nicht zu, den Text automatisch auszuschneiden. Bitte Benutzen Sie die System-Zwischenablage ueber STRG-X (ausschneiden) und STRG-V (einfuegen).",
PasteErrorCopy	: "Die Sicherheitseinstellungen Ihres Browsers lassen es nicht zu, den Text automatisch kopieren. Bitte Benutzen Sie die System-Zwischenablage ueber STRG-C (kopieren)",

PasteAsText		: "Als Text einfuegen",
PasteFromWord	: "Aus Word einfuegen",

DlgPasteMsg		: "Der Text konnte nicht automatisch eingefuegt werden, da die Sicherheitseinstellungen Ihres Browsers dies nicht zulassen.<BR>Bitte nutzen Sie in der folgenden Box die System-Zwischenablage ueber STRG-C (kopieren) und STRG-V (einfuegen).",

// Color Picker
ColorAutomatic	: "Automatisch",
ColorMoreColors	: "weitere Farben...",

// About Dialog
DlgAboutVersion	: "version",
DlgAboutLicense	: "Lizensiert unter den Richtlinien der GNU Lesser General Public License",
DlgAboutInfo	: "Fuer weitere Informationen siehe"
}