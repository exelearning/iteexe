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
 * File Name: hr.js
 * 	Croatian language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-24 23:38:22
 * 
 * File Authors:
 * 		Alex Varga (avarga@globaldizajn.hr)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Smanji trake s alatima",
ToolbarExpand		: "Proširi trake s alatima",

// Toolbar Items and Context Menu
Save				: "Snimi",
NewPage				: "Nova stranica",
Preview				: "Pregledaj",
Cut					: "Izreži",
Copy				: "Kopiraj",
Paste				: "Zaljepi",
PasteText			: "Zaljepi kao čisti tekst",
PasteWord			: "Zaljepi iz Worda",
Print				: "Ispiši",
SelectAll			: "Odaberi sve",
RemoveFormat		: "Ukloni formatiranje",
InsertLinkLbl		: "Link",
InsertLink			: "Ubaci/promjeni link",
RemoveLink			: "Ukloni link",
InsertImageLbl		: "Slika",
InsertImage			: "Ubaci/promjeni sliku",
InsertTableLbl		: "Tablica",
InsertTable			: "Ubaci/promjeni tablicu",
InsertLineLbl		: "Linija",
InsertLine			: "Ubaci vodoravnu liniju",
InsertSpecialCharLbl: "Posebni karakteri",
InsertSpecialChar	: "Ubaci posebne karaktere",
InsertSmileyLbl		: "Smješko",
InsertSmiley		: "Ubaci smješka",
About				: "O FCKeditor",
Bold				: "Bold",
Italic				: "Italic",
Underline			: "Podcrtano",
StrikeThrough		: "Precrtano",
Subscript			: "Subscript",
Superscript			: "Superscript",
LeftJustify			: "Lijevo poravnanje",
CenterJustify		: "Središnje poravnanje",
RightJustify		: "Desno poravnanje",
BlockJustify		: "Blok poravnanje",
DecreaseIndent		: "Pomakni ulijevo",
IncreaseIndent		: "Pomakni udesno",
Undo				: "Poništi",
Redo				: "Ponovi",
NumberedListLbl		: "Brojčana lista",
NumberedList		: "Ubaci/ukloni brojčanu listu",
BulletedListLbl		: "Obična lista",
BulletedList		: "Ubaci/ukloni običnu listu",
ShowTableBorders	: "Prikaži okvir tablice",
ShowDetails			: "Prikaži detalje",
Style				: "Stil",
FontFormat			: "Format",
Font				: "Font",
FontSize			: "Veličina",
TextColor			: "Boja teksta",
BGColor				: "Boja pozadine",
Source				: "K&ocirc;d",
Find				: "Pronađi",
Replace				: "Zamijeni",

// Context Menu
EditLink			: "Promjeni link",
InsertRow			: "Ubaci red",
DeleteRows			: "Izbriši redove",
InsertColumn		: "Ubaci kolonu",
DeleteColumns		: "Izbriši kolone",
InsertCell			: "Ubaci ćelije",
DeleteCells			: "Izbriši ćelije",
MergeCells			: "Spoji ćelije",
SplitCell			: "Razdvoji ćelije",
CellProperties		: "Svojstva ćelije",
TableProperties		: "Svojstva tablice",
ImageProperties		: "Svojstva slike",

FontFormats			: "Normal;Formatirano;Adresa;Heading 1;Heading 2;Heading 3;Heading 4;Heading 5;Heading 6",

// Alerts and Messages
ProcessingXHTML		: "Obrađujem XHTML. Molimo pričekajte...",
Done				: "Završio",
PasteWordConfirm	: "Tekst koji želite zalijepiti čini se da je kopiran iz Worda. Želite li prije očistiti tekst?",
NotCompatiblePaste	: "Ova naredba je dostupna samo u Internet Exploreru 5.5 ili novijem. Želite li nastaviti bez čišćenja?",
UnknownToolbarItem	: "Nepoznata član trake s alatima \"%1\"",
UnknownCommand		: "Nepoznata naredba \"%1\"",
NotImplemented		: "Naredba nije implementirana",
UnknownToolbarSet	: "Traka s alatima \"%1\" ne postoji",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Poništi",
DlgBtnClose			: "Zatvori",
DlgAdvancedTag		: "Napredno",

// General Dialogs Labels
DlgGenNotSet		: "&lt;nije postavljeno&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Smjer jezika",
DlgGenLangDirLtr	: "S lijeva na desno (LTR)",
DlgGenLangDirRtl	: "S desna na lijevo (RTL)",
DlgGenLangCode		: "K&ocirc;d jezika",
DlgGenAccessKey		: "Pristupna tipka",
DlgGenName			: "Naziv",
DlgGenTabIndex		: "Tab Indeks",
DlgGenLongDescr		: "Dugački opis URL",
DlgGenClass			: "Stylesheet klase",
DlgGenTitle			: "Advisory naslov",
DlgGenContType		: "Advisory vrsta sadržaja",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Stil",

// Image Dialog
DlgImgTitle			: "Svojstva slika",
DlgImgInfoTab		: "Info slike",
DlgImgBtnUpload		: "Pošalji na server",
DlgImgURL			: "URL",
DlgImgUpload		: "Pošalji",
DlgImgBtnBrowse		: "Pretraži server",
DlgImgAlt			: "Alternativni tekst",
DlgImgWidth			: "Širina",
DlgImgHeight		: "Visina",
DlgImgLockRatio		: "Zaključaj odnos",
DlgBtnResetSize		: "Obriši veličinu",
DlgImgBorder		: "Okvir",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Poravnja",
DlgImgAlignLeft		: "Lijevo",
DlgImgAlignAbsBottom: "Abs dolje",
DlgImgAlignAbsMiddle: "Abs sredina",
DlgImgAlignBaseline	: "Bazno",
DlgImgAlignBottom	: "Dolje",
DlgImgAlignMiddle	: "Sredina",
DlgImgAlignRight	: "Desno",
DlgImgAlignTextTop	: "Vrh teksta",
DlgImgAlignTop		: "Vrh",
DlgImgPreview		: "Pregledaj",
DlgImgMsgWrongExt	: "Žao nam je, dozvoljeno je slanje samo sljedećih vrsta datoteka::\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperacija je poništena.",
DlgImgAlertSelect	: "Odaberite sliku za slanje.",
DlgImgAlertUrl		: "Unesite URL slike",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "Link Info",
DlgLnkTargetTab		: "Meta",

DlgLnkType			: "Link vrsta",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Sidro na ovoj stranici",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protokol",
DlgLnkProtoOther	: "&lt;drugo&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Pretraži server",
DlgLnkAnchorSel		: "Odaberi sidro",
DlgLnkAnchorByName	: "Po nazivu sidra",
DlgLnkAnchorById	: "Po Id elementa",
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
DlgLnkTargetTop		: "Vršni prozor (_top)",
DlgLnkTargetFrame	: "Naziv ciljanog okvira",
DlgLnkPopWinName	: "Naziv popup prozora",
DlgLnkPopWinFeat	: "Mogućnosti popup prozora",
DlgLnkPopResize		: "Promjenjljive veličine",
DlgLnkPopLocation	: "Traka za lokaciju",
DlgLnkPopMenu		: "Izborna traka",
DlgLnkPopScroll		: "Scroll traka",
DlgLnkPopStatus		: "Statusna traka",
DlgLnkPopToolbar	: "Traka s alatima",
DlgLnkPopFullScrn	: "Cijeli ekran (IE)",
DlgLnkPopDependent	: "Ovisno (Netscape)",
DlgLnkPopWidth		: "Širina",
DlgLnkPopHeight		: "Visina",
DlgLnkPopLeft		: "Lijeva pozicija",
DlgLnkPopTop		: "Gornja pozicija",

DlgLnkMsgWrongExtA	: "Žao nam je, dozvoljeno je slanje samo sljedećih datoteka:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperacija je poništena.",
DlgLnkMsgWrongExtD	: "Žao nam je, slanje sljedećih vrsta datoteka nije dozvoljeno:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperacija je poništena.",

DlnLnkMsgNoUrl		: "Molimo upišite URL link",
DlnLnkMsgNoEMail	: "Molimo upišite e-mail adresu",
DlnLnkMsgNoAnchor	: "Molimo odaberite sidro",

// Color Dialog
DlgColorTitle		: "Odaberite boju",
DlgColorBtnClear	: "Obriši",
DlgColorHighlight	: "Osvijetli",
DlgColorSelected	: "Odaberi",

// Smiley Dialog
DlgSmileyTitle		: "Ubaci smješka",

// Special Character Dialog
DlgSpecialCharTitle	: "Odaberite posebni karakter",

// Table Dialog
DlgTableTitle		: "Svojstva tablice",
DlgTableRows		: "Redova",
DlgTableColumns		: "Kolona",
DlgTableBorder		: "Veličina okvira",
DlgTableAlign		: "Poravnanje",
DlgTableAlignNotSet	: "<nije postavljeno>",
DlgTableAlignLeft	: "Lijevo",
DlgTableAlignCenter	: "Središnje",
DlgTableAlignRight	: "Desno",
DlgTableWidth		: "Širina",
DlgTableWidthPx		: "piksela",
DlgTableWidthPc		: "postotaka",
DlgTableHeight		: "Visina",
DlgTableCellSpace	: "Prostornost ćelija",
DlgTableCellPad		: "Razmak ćelija",
DlgTableCaption		: "Naslov",

// Table Cell Dialog
DlgCellTitle		: "Svojstva ćelije",
DlgCellWidth		: "Širina",
DlgCellWidthPx		: "piksela",
DlgCellWidthPc		: "postotaka",
DlgCellHeight		: "Visina",
DlgCellWordWrap		: "Word Wrap",
DlgCellWordWrapNotSet	: "<nije postavljeno>",
DlgCellWordWrapYes	: "Da",
DlgCellWordWrapNo	: "Ne",
DlgCellHorAlign		: "Vodoravno poravnanje",
DlgCellHorAlignNotSet	: "<nije postavljeno>",
DlgCellHorAlignLeft	: "Lijevo",
DlgCellHorAlignCenter	: "Središnje",
DlgCellHorAlignRight: "Desno",
DlgCellVerAlign		: "Okomito poravnanje",
DlgCellVerAlignNotSet	: "<nije postavljeno>",
DlgCellVerAlignTop	: "Gornje",
DlgCellVerAlignMiddle	: "Srednišnje",
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
DlgReplaceTitle			: "Zamijeni",
DlgReplaceFindLbl		: "Pronađi:",
DlgReplaceReplaceLbl	: "Zamijeni sa:",
DlgReplaceCaseChk		: "Usporedi mala/velika slova",
DlgReplaceReplaceBtn	: "Zamijeni",
DlgReplaceReplAllBtn	: "Zamijeni sve",
DlgReplaceWordChk		: "Usporedi cijele riječi",

// Paste Operations / Dialog
PasteErrorPaste	: "Sigurnosne postavke Vašeg pretraživača ne dozvoljavaju operacije automatskog ljepljenja. Molimo koristite kraticu na tipkovnici (Ctrl+V).",
PasteErrorCut	: "Sigurnosne postavke Vašeg pretraživača ne dozvoljavaju operacije automatskog izrezivanja. Molimo koristite kraticu na tipkovnici (Ctrl+X).",
PasteErrorCopy	: "Sigurnosne postavke Vašeg pretraživača ne dozvoljavaju operacije automatskog kopiranja. Molimo koristite kraticu na tipkovnici (Ctrl+C).",

PasteAsText		: "Zaljepi kao čisti tekst",
PasteFromWord	: "Zaljepi iz Worda",

DlgPasteMsg		: "Editor nije mogao automatski zaljepiti zbog  <STRONG>sigurnosnih postavki</STRONG> Vašeg pretraživača.<BR>Molimo zaljepite unutar sljedeće kocke koristeći tipkovnicu (<STRONG>Ctrl+V</STRONG>) i pritisnite na <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatski",
ColorMoreColors	: "Više boja...",

// About Dialog
DlgAboutVersion	: "inačica",
DlgAboutLicense	: "Licencirano pod uvijetima GNU Lesser General Public License",
DlgAboutInfo	: "Za više informacija posjetite"
}