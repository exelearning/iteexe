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
 * File Name: sr-latn.js
 * 	Serbian (Latin) language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-26 02:03:24
 * 
 * File Authors:
 * 		Zoran Subić (zoran@tf.zr.ac.yu)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

// Toolbar Items and Context Menu
Save				: "Sačuvaj",
NewPage				: "Nova stranica",
Preview				: "Izgled stranice",
Cut					: "Iseci",
Copy				: "Kopiraj",
Paste				: "Zalepi",
PasteText			: "Zalepi kao neformatiran tekst",
PasteWord			: "Zalepi iz Worda",
Print				: "Štampa",
SelectAll			: "Označi sve",
RemoveFormat		: "Ukloni formatiranje",
InsertLinkLbl		: "Link",
InsertLink			: "Unesi/izmeni link",
RemoveLink			: "Ukloni link",
InsertImageLbl		: "Slika",
InsertImage			: "Unesi/izmeni sliku",
InsertTableLbl		: "Tabela",
InsertTable			: "Unesi/izmeni tabelu",
InsertLineLbl		: "Linija",
InsertLine			: "Unesi horizontalnu liniju",
InsertSpecialCharLbl: "Specijalni karakteri",
InsertSpecialChar	: "Unesi specijalni karakter",
InsertSmileyLbl		: "Smajli",
InsertSmiley		: "Unesi smajlija",
About				: "O FCKeditoru",
Bold				: "Podebljano",
Italic				: "Kurziv",
Underline			: "Podvučeno",
StrikeThrough		: "Precrtano",
Subscript			: "Indeks",
Superscript			: "Stepen",
LeftJustify			: "Levo ravnanje",
CenterJustify		: "Centriran tekst",
RightJustify		: "Desno ravnanje",
BlockJustify		: "Obostrano ravnanje",
DecreaseIndent		: "Smanji levu marginu",
IncreaseIndent		: "Uvećaj levu marginu",
Undo				: "Poništi akciju",
Redo				: "Ponovi akciju",
NumberedListLbl		: "Nabrojiva lista",
NumberedList		: "Unesi/ukloni nabrojivu listu",
BulletedListLbl		: "Nenabrojiva lista",
BulletedList		: "Unesi/ukloni nenabrojivu listu",
ShowTableBorders	: "Prikaži okvir tabele",
ShowDetails			: "Prikaži detalje",
Style				: "Stil",
FontFormat			: "Format",
Font				: "Font",
FontSize			: "Veličina fonta",
TextColor			: "Boja teksta",
BGColor				: "Boja pozadine",
Source				: "K&ocirc;d",
Find				: "Pretraga",
Replace				: "Zamena",

// Context Menu
EditLink			: "Izmeni link",
InsertRow			: "Unesi red",
DeleteRows			: "Obriši redove",
InsertColumn		: "Unesi kolonu",
DeleteColumns		: "Obriši kolone",
InsertCell			: "Unesi ćelije",
DeleteCells			: "Obriši ćelije",
MergeCells			: "Spoj ćelije",
SplitCell			: "Razdvoji ćelije",
CellProperties		: "Osobine ćelije",
TableProperties		: "Osobine tabele",
ImageProperties		: "Osobine slike",

FontFormats			: "Normal;Formatirano;Adresa;Heading 1;Heading 2;Heading 3;Heading 4;Heading 5;Heading 6",

// Alerts and Messages
ProcessingXHTML		: "Obrađujem XHTML. Malo strpljenja...",
Done				: "Završio",
PasteWordConfirm	: "Tekst koji želite da nalepite kopiran je iz Worda. Da li želite da bude očišćen od formata pre lepljenja?",
NotCompatiblePaste	: "Ova komanda je dostupna samo za Internet Explorer od verzije 5.5. Da li želite da nalepim tekst bez čišćenja?",
UnknownToolbarItem	: "Nepoznata stavka toolbara \"%1\"",
UnknownCommand		: "Nepoznata naredba \"%1\"",
NotImplemented		: "Naredba nije implementirana",
UnknownToolbarSet	: "Toolbar \"%1\" ne postoji",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Otkaži",
DlgBtnClose			: "Zatvori",
DlgAdvancedTag		: "Napredni tagovi",

// General Dialogs Labels
DlgGenNotSet		: "&lt;nije postavljeno&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Smer jezika",
DlgGenLangDirLtr	: "S leva na desno (LTR)",
DlgGenLangDirRtl	: "S desna na levo (RTL)",
DlgGenLangCode		: "K&ocirc;d jezika",
DlgGenAccessKey		: "Pristupni taster",
DlgGenName			: "Naziv",
DlgGenTabIndex		: "Tab indeks",
DlgGenLongDescr		: "Pun opis URL",
DlgGenClass			: "Stylesheet klase",
DlgGenTitle			: "Advisory naslov",
DlgGenContType		: "Advisory vrsta sadržaja",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Stil",

// Image Dialog
DlgImgTitle			: "Osobine slika",
DlgImgInfoTab		: "Info slike",
DlgImgBtnUpload		: "Pošalji na server",
DlgImgURL			: "URL",
DlgImgUpload		: "Pošalji",
DlgImgBtnBrowse		: "Pretraži server",
DlgImgAlt			: "Alternativni tekst",
DlgImgWidth			: "Širina",
DlgImgHeight		: "Visina",
DlgImgLockRatio		: "Zaključaj odnos",
DlgBtnResetSize		: "Resetuj veličinu",
DlgImgBorder		: "Okvir",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Ravnanje",
DlgImgAlignLeft		: "Levo",
DlgImgAlignAbsBottom: "Abs dole",
DlgImgAlignAbsMiddle: "Abs sredina",
DlgImgAlignBaseline	: "Bazno",
DlgImgAlignBottom	: "Dole",
DlgImgAlignMiddle	: "Sredina",
DlgImgAlignRight	: "Desno",
DlgImgAlignTextTop	: "Vrh teksta",
DlgImgAlignTop		: "Vrh",
DlgImgPreview		: "Izgled",
DlgImgMsgWrongExt	: "Dozvoljeno je slanje samo sledećih vrsta datoteka::\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperacija je otkazana.",
DlgImgAlertSelect	: "Odaberite sliku za slanje.",
DlgImgAlertUrl		: "Unesite URL slike",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "Link Info",
DlgLnkTargetTab		: "Meta",

DlgLnkType			: "Vrsta linka",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Sidro na ovoj stranici",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protokol",
DlgLnkProtoOther	: "&lt;drugo&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Pretraži server",
DlgLnkAnchorSel		: "Odaberi sidro",
DlgLnkAnchorByName	: "Po nazivu sidra",
DlgLnkAnchorById	: "Po Id-ju elementa",
DlgLnkNoAnchors		: "&lt;Nema dostupnih sidra&gt;",
DlgLnkEMail			: "E-Mail adresa",
DlgLnkEMailSubject	: "Naslov",
DlgLnkEMailBody		: "Sadržaj poruke",
DlgLnkUpload		: "Pošalji",
DlgLnkBtnUpload		: "Pošalji na server",

DlgLnkTarget		: "Meta",
DlgLnkTargetFrame	: "&lt;okvir&gt;",
DlgLnkTargetPopup	: "&lt;popup prozor&gt;",
DlgLnkTargetBlank	: "Novi prozor (_blank)",
DlgLnkTargetParent	: "Roditeljski prozor (_parent)",
DlgLnkTargetSelf	: "Isti prozor (_self)",
DlgLnkTargetTop		: "Prozor na vrhu (_top)",
DlgLnkTargetFrame	: "Okvir (frejm)",
DlgLnkPopWinName	: "Naziv popup prozora",
DlgLnkPopWinFeat	: "Mogućnosti popup prozora",
DlgLnkPopResize		: "Promenljiva veličina",
DlgLnkPopLocation	: "Lokacija",
DlgLnkPopMenu		: "Kontekstni meni",
DlgLnkPopScroll		: "Scroll bar",
DlgLnkPopStatus		: "Statusna linija",
DlgLnkPopToolbar	: "Toolbar",
DlgLnkPopFullScrn	: "Prikaz preko celog ekrana (IE)",
DlgLnkPopDependent	: "Zavisno (Netscape)",
DlgLnkPopWidth		: "Širina",
DlgLnkPopHeight		: "Visina",
DlgLnkPopLeft		: "Od leve ivice ekrana (px)",
DlgLnkPopTop		: "Od vrha ekrana (px)",

DlgLnkMsgWrongExtA	: "Dozvoljeno je slanje samo sledećih datoteka:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperacija je otkazana.",
DlgLnkMsgWrongExtD	: "Slanje sledećih vrsta datoteka nije dozvoljeno:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperacija je otkazana.",

// Color Dialog
DlgColorTitle		: "Odaberite boju",
DlgColorBtnClear	: "Obriši",
DlgColorHighlight	: "Posvetli",
DlgColorSelected	: "Odaberi",

// Smiley Dialog
DlgSmileyTitle		: "Unesi smajlija",

// Special Character Dialog
DlgSpecialCharTitle	: "Odaberite specijalni karakter",

// Table Dialog
DlgTableTitle		: "Osobine tabele",
DlgTableRows		: "Redova",
DlgTableColumns		: "Kolona",
DlgTableBorder		: "Veličina okvira",
DlgTableAlign		: "Ravnanje",
DlgTableAlignNotSet	: "<nije postavljeno>",
DlgTableAlignLeft	: "Levo",
DlgTableAlignCenter	: "Sredina",
DlgTableAlignRight	: "Desno",
DlgTableWidth		: "Širina",
DlgTableWidthPx		: "piksela",
DlgTableWidthPc		: "procenata",
DlgTableHeight		: "Visina",
DlgTableCellSpace	: "Ćelijski prostor",
DlgTableCellPad		: "Razmak ćelija",
DlgTableCaption		: "Naslov tabele",

// Table Cell Dialog
DlgCellTitle		: "Osobine ćelije",
DlgCellWidth		: "Širina",
DlgCellWidthPx		: "piksela",
DlgCellWidthPc		: "procenata",
DlgCellHeight		: "Visina",
DlgCellWordWrap		: "Deljenje reči",
DlgCellWordWrapNotSet	: "<nije postavljeno>",
DlgCellWordWrapYes	: "Da",
DlgCellWordWrapNo	: "Ne",
DlgCellHorAlign		: "Vodoravno ravnanje",
DlgCellHorAlignNotSet	: "<nije postavljeno>",
DlgCellHorAlignLeft	: "Levo",
DlgCellHorAlignCenter	: "Sredina",
DlgCellHorAlignRight	: "Desno",
DlgCellVerAlign		: "Vertikalno ravnanje",
DlgCellVerAlignNotSet	: "<nije postavljeno>",
DlgCellVerAlignTop	: "Gornje",
DlgCellVerAlignMiddle	: "Sredina",
DlgCellVerAlignBottom	: "Donje",
DlgCellVerAlignBaseline	: "Bazno",
DlgCellRowSpan		: "Spajanje redova",
DlgCellCollSpan		: "Spajanje kolona",
DlgCellBackColor	: "Boja pozadine",
DlgCellBorderColor	: "Boja okvira",
DlgCellBtnSelect	: "Odaberi...",

// Find Dialog
DlgFindTitle		: "Pronađi",
DlgFindFindBtn		: "Pronađi",
DlgFindNotFoundMsg	: "Traženi tekst nije pronađen.",

// Replace Dialog
DlgReplaceTitle		: "Zameni",
DlgReplaceFindLbl	: "Pronađi:",
DlgReplaceReplaceLbl	: "Zameni sa:",
DlgReplaceCaseChk	: "Razlikuj mala i velika slova",
DlgReplaceReplaceBtn	: "Zameni",
DlgReplaceReplAllBtn	: "Zameni sve",
DlgReplaceWordChk	: "Uporedi cele reči",

// Paste Operations / Dialog
PasteErrorPaste	: "Sigurnosna podešavanja Vašeg pretraživača ne dozvoljavaju operacije automatskog lepljenja teksta. Molimo Vas da koristite prečicu sa tastature (Ctrl+V).",
PasteErrorCut	: "Sigurnosna podešavanja Vašeg pretraživača ne dozvoljavaju operacije automatskog isecanja teksta. Molimo Vas da koristite prečicu sa tastature (Ctrl+X).",
PasteErrorCopy	: "Sigurnosna podešavanja Vašeg pretraživača ne dozvoljavaju operacije automatskog kopiranja teksta. Molimo Vas da koristite prečicu sa tastature (Ctrl+C).",

PasteAsText		: "Zalepi kao čist tekst",
PasteFromWord		: "Zalepi iz Worda",

DlgPasteMsg		: "Editor nije mogao izvršiti automatsko lepljenje zbog  <STRONG>sigurnosnih postavki</STRONG> Vašeg pretraživača.<BR>Molimo da zalepite sadržaj unutar sledeće površine koristeći tastaturnu prečicu (<STRONG>Ctrl+V</STRONG>), a zatim kliknite na <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatski",
ColorMoreColors	: "Više boja...",

// About Dialog
DlgAboutVersion	: "verzija",
DlgAboutLicense	: "Licencirano pod uslovima GNU Lesser General Public License",
DlgAboutInfo	: "Za više informacija posetite"
}