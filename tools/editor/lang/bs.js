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
 * File Name: bs.js
 * 	Bosnian language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-27 15:13:10
 * 
 * File Authors:
 * 		Muris Trax (www.elektronika.ba)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Skupi trake sa alatima",
ToolbarExpand		: "Otvori trake sa alatima",

// Toolbar Items and Context Menu
Save				: "Snimi",
NewPage				: "Novi dokument",
Preview				: "Prikaži",
Cut					: "Izreži",
Copy				: "Kopiraj",
Paste				: "Zalijepi",
PasteText			: "Zalijepi kao obièan tekst",
PasteWord			: "Zalijepi iz Word-a",
Print				: "Štampaj",
SelectAll			: "Selektuj sve",
RemoveFormat		: "Poništi format",
InsertLinkLbl		: "Link",
InsertLink			: "Ubaci/Izmjeni link",
RemoveLink			: "Izbriši link",
InsertImageLbl		: "Slika",
InsertImage			: "Ubaci/Izmjeni sliku",
InsertTableLbl		: "Tabela",
InsertTable			: "Ubaci/Izmjeni tabelu",
InsertLineLbl		: "Linija",
InsertLine			: "Ubaci horizontalnu liniju",
InsertSpecialCharLbl: "Specijalni karakter",
InsertSpecialChar	: "Ubaci specijalni karater",
InsertSmileyLbl		: "Smješko",
InsertSmiley		: "Ubaci smješka",
About				: "O FCKeditor-u",
Bold				: "Boldiraj",
Italic				: "Ukosi",
Underline			: "Podvuci",
StrikeThrough		: "Precrtaj",
Subscript			: "Subscript",
Superscript			: "Superscript",
LeftJustify			: "Lijevo poravnanje",
CenterJustify		: "Centralno poravnanje",
RightJustify		: "Desno poravnanje",
BlockJustify		: "Puno poravnanje",
DecreaseIndent		: "Smanji uvod",
IncreaseIndent		: "Poveæaj uvod",
Undo				: "Vrati",
Redo				: "Ponovi",
NumberedListLbl		: "Numerisana lista",
NumberedList		: "Ubaci/Izmjeni numerisanu listu",
BulletedListLbl		: "Lista",
BulletedList		: "Ubaci/Izmjeni listu",
ShowTableBorders	: "Pokaži okvire tabela",
ShowDetails			: "Pokaži detalje",
Style				: "Stil",
FontFormat			: "Format",
Font				: "Font",
FontSize			: "Velièina",
TextColor			: "Boja teksta",
BGColor				: "Boja pozadine",
Source				: "HTML kôd",
Find				: "Naði",
Replace				: "Zamjeni",

// Context Menu
EditLink			: "Izmjeni link",
InsertRow			: "Ubaci red",
DeleteRows			: "Briši redove",
InsertColumn		: "Ubaci kolonu",
DeleteColumns		: "Briši kolone",
InsertCell			: "Ubaci æeliju",
DeleteCells			: "Briši æelije",
MergeCells			: "Spoji æelije",
SplitCell			: "Razdvoji æeliju",
CellProperties		: "Svojstva æelije",
TableProperties		: "Svojstva tabele",
ImageProperties		: "Svojstva slike",

FontFormats			: "Normal;Formatted;Address;Heading 1;Heading 2;Heading 3;Heading 4;Heading 5;Heading 6",

// Alerts and Messages
ProcessingXHTML		: "Procesiram XHTML. Molim saèekajte...",
Done				: "Gotovo",
PasteWordConfirm	: "Tekst koji želite zalijepiti èini se da je kopiran iz Worda. Da li želite da se prvo oèisti?",
NotCompatiblePaste	: "Ova komanda je podržana u Internet Explorer-u verzijama 5.5 ili novijim. Da li želite da izvršite lijepljenje teksta bez èišæenja?",
UnknownToolbarItem	: "Nepoznata stavka sa trake sa alatima \"%1\"",
UnknownCommand		: "Nepoznata komanda \"%1\"",
NotImplemented		: "Komanda nije implementirana",
UnknownToolbarSet	: "Traka sa alatima \"%1\" ne postoji",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Odustani",
DlgBtnClose			: "Zatvori",
DlgAdvancedTag		: "Naprednije",

// General Dialogs Labels
DlgGenNotSet		: "&lt;nije podešeno&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Smjer pisanja",
DlgGenLangDirLtr	: "S lijeva na desno (LTR)",
DlgGenLangDirRtl	: "S desna na lijevo (RTL)",
DlgGenLangCode		: "Jezièni kôd",
DlgGenAccessKey		: "Pristupna tipka",
DlgGenName			: "Naziv",
DlgGenTabIndex		: "Tab indeks",
DlgGenLongDescr		: "Dugaèki opis URL-a",
DlgGenClass			: "Klase CSS stilova",
DlgGenTitle			: "Advisory title",
DlgGenContType		: "Advisory vrsta sadržaja",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Stil",

// Image Dialog
DlgImgTitle			: "Svojstva slike",
DlgImgInfoTab		: "Info slike",
DlgImgBtnUpload		: "Šalji na server",
DlgImgURL			: "URL",
DlgImgUpload		: "Šalji",
DlgImgBtnBrowse		: "Listaj Server",
DlgImgAlt			: "Tekst na slici",
DlgImgWidth			: "Širina",
DlgImgHeight		: "Visina",
DlgImgLockRatio		: "Zakljuèaj odnos",
DlgBtnResetSize		: "Resetuj dimenzije",
DlgImgBorder		: "Okvir",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Poravnanje",
DlgImgAlignLeft		: "Lijevo",
DlgImgAlignAbsBottom: "Abs dole",
DlgImgAlignAbsMiddle: "Abs sredina",
DlgImgAlignBaseline	: "Bazno",
DlgImgAlignBottom	: "Dno",
DlgImgAlignMiddle	: "Sredina",
DlgImgAlignRight	: "Desno",
DlgImgAlignTextTop	: "Vrh teksta",
DlgImgAlignTop		: "Vrh",
DlgImgPreview		: "Prikaz",
DlgImgMsgWrongExt	: "Žao nam je, dopušteno je uploadovati ove tipove fajlova:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperacija prekinuta.",
DlgImgAlertSelect	: "Molimo izaberite sliku za slanje.",
DlgImgAlertUrl		: "Molimo ukucajte URL od slike.",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "Link info",
DlgLnkTargetTab		: "Prozor",

DlgLnkType			: "Tip linka",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Sidro na ovoj stranici",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protokol",
DlgLnkProtoOther	: "&lt;drugi&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Listaj server",
DlgLnkAnchorSel		: "Izaberi sidro",
DlgLnkAnchorByName	: "Po nazivu sidra",
DlgLnkAnchorById	: "Po Id-u elementa",
DlgLnkNoAnchors		: "&lt;Nema dostupnih sidra na stranici&gt;",
DlgLnkEMail			: "E-Mail Adresa",
DlgLnkEMailSubject	: "Subjekt poruke",
DlgLnkEMailBody		: "Poruka",
DlgLnkUpload		: "Šalji",
DlgLnkBtnUpload		: "Šalji na server",

DlgLnkTarget		: "Prozor",
DlgLnkTargetFrame	: "&lt;frejm&gt;",
DlgLnkTargetPopup	: "&lt;popup prozor&gt;",
DlgLnkTargetBlank	: "Novi prozor (_blank)",
DlgLnkTargetParent	: "Glavni prozor (_parent)",
DlgLnkTargetSelf	: "Isti prozor (_self)",
DlgLnkTargetTop		: "Najgornji prozor (_top)",
DlgLnkTargetFrame	: "Naziv prozora",
DlgLnkPopWinName	: "Naziv popup prozora",
DlgLnkPopWinFeat	: "Moguænosti popup prozora",
DlgLnkPopResize		: "Promjenljive velièine",
DlgLnkPopLocation	: "Traka za lokaciju",
DlgLnkPopMenu		: "Izborna traka",
DlgLnkPopScroll		: "Scroll traka",
DlgLnkPopStatus		: "Statusna traka",
DlgLnkPopToolbar	: "Traka sa alatima",
DlgLnkPopFullScrn	: "Cijeli ekran (IE)",
DlgLnkPopDependent	: "Ovisno (Netscape)",
DlgLnkPopWidth		: "Širina",
DlgLnkPopHeight		: "Visina",
DlgLnkPopLeft		: "Lijeva pozicija",
DlgLnkPopTop		: "Gornja pozicija",

DlgLnkMsgWrongExtA	: "Žao nam je, dopušteno je uploadovati ove tipove fajlova:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperacija prekinuta.",
DlgLnkMsgWrongExtD	: "Žao nam je, nije dopušteno slati ove tipove fajlova:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperacija prekinuta.",

DlnLnkMsgNoUrl		: "Molimo ukucajte URL link",
DlnLnkMsgNoEMail	: "Molimo ukucajte e-mail adresu",
DlnLnkMsgNoAnchor	: "Molimo izaberite sidro",

// Color Dialog
DlgColorTitle		: "Izaberi boju",
DlgColorBtnClear	: "Oèisti",
DlgColorHighlight	: "Igled",
DlgColorSelected	: "Selektovana",

// Smiley Dialog
DlgSmileyTitle		: "Ubaci smješka",

// Special Character Dialog
DlgSpecialCharTitle	: "Izaberi specijalni karakter",

// Table Dialog
DlgTableTitle		: "Svojstva tabele",
DlgTableRows		: "Redova",
DlgTableColumns		: "Kolona",
DlgTableBorder		: "Okvir",
DlgTableAlign		: "Poravnanje",
DlgTableAlignNotSet	: "<Nije podešeno>",
DlgTableAlignLeft	: "Lijevo",
DlgTableAlignCenter	: "Centar",
DlgTableAlignRight	: "Desno",
DlgTableWidth		: "Širina",
DlgTableWidthPx		: "piksela",
DlgTableWidthPc		: "posto",
DlgTableHeight		: "Visina",
DlgTableCellSpace	: "Razmak æelija",
DlgTableCellPad		: "Uvod æelija",
DlgTableCaption		: "Naslov",

// Table Cell Dialog
DlgCellTitle		: "Svojstva æelije",
DlgCellWidth		: "Širina",
DlgCellWidthPx		: "piksela",
DlgCellWidthPc		: "posto",
DlgCellHeight		: "Visina",
DlgCellWordWrap		: "Vrapuj tekst",
DlgCellWordWrapNotSet	: "<Nije podešeno>",
DlgCellWordWrapYes	: "Da",
DlgCellWordWrapNo	: "Ne",
DlgCellHorAlign		: "Horizontalno poravnanje",
DlgCellHorAlignNotSet	: "<Nije podešeno>",
DlgCellHorAlignLeft	: "Lijevo",
DlgCellHorAlignCenter	: "Centar",
DlgCellHorAlignRight: "Desno",
DlgCellVerAlign		: "Vertikalno poravnanje",
DlgCellVerAlignNotSet	: "<Nije podešeno>",
DlgCellVerAlignTop	: "Gore",
DlgCellVerAlignMiddle	: "Sredina",
DlgCellVerAlignBottom	: "Dno",
DlgCellVerAlignBaseline	: "Bazno",
DlgCellRowSpan		: "Spajanje æelija",
DlgCellCollSpan		: "Spajanje kolona",
DlgCellBackColor	: "Boja pozadine",
DlgCellBorderColor	: "Boja okvira",
DlgCellBtnSelect	: "Selektuj...",

// Find Dialog
DlgFindTitle		: "Naði",
DlgFindFindBtn		: "Naði",
DlgFindNotFoundMsg	: "Traženi tekst nije pronaðen.",

// Replace Dialog
DlgReplaceTitle			: "Zamjeni",
DlgReplaceFindLbl		: "Naði šta:",
DlgReplaceReplaceLbl	: "Zamjeni sa:",
DlgReplaceCaseChk		: "Uporeðuj velika/mala slova",
DlgReplaceReplaceBtn	: "Zamjeni",
DlgReplaceReplAllBtn	: "Zamjeni sve",
DlgReplaceWordChk		: "Uporeðuj samo cijelu rijeè",

// Paste Operations / Dialog
PasteErrorPaste	: "Sigurnosne postavke vašeg pretraživaèa ne dozvoljavaju operacije automatskog lijepljenja. Molimo koristite kraticu na tastaturi (Ctrl+V).",
PasteErrorCut	: "Sigurnosne postavke vašeg pretraživaèa ne dozvoljavaju operacije automatskog rezanja. Molimo koristite kraticu na tastaturi (Ctrl+X).",
PasteErrorCopy	: "Sigurnosne postavke Vašeg pretraživaèa ne dozvoljavaju operacije automatskog kopiranja. Molimo koristite kraticu na tastaturi (Ctrl+C).",

PasteAsText		: "Zalijepi kao obièan tekst",
PasteFromWord	: "Zalijepi iz Word-a",

DlgPasteMsg		: "Editor nije mogao automatski zaljepiti zbog  <STRONG>sigurnosnih postavki</STRONG> vašeg pretraživaèa.<BR>Molimo zalijepite unutar slijedeæe kocke koristeæi tastaturu (<STRONG>Ctrl+V</STRONG>) i pritisnite <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatska",
ColorMoreColors	: "Više boja...",

// About Dialog
DlgAboutVersion	: "verzija",
DlgAboutLicense	: "Licencirano pod uslovima GNU Lesser General Public License",
DlgAboutInfo	: "Za više informacija posjetite"
}