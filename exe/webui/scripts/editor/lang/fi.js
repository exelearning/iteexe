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
 * File Name: fi.js
 * 	Finnish language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-29 12:38:11
 * 
 * File Authors:
 * 		Marko Korhonen (marko.korhonen@datafisher.com)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

// Toolbar Items and Context Menu
Save				: "Tallenna",
NewPage				: "Uusi sivu",
Preview				: "Esikatsele",
Cut					: "Leikkaa",
Copy				: "Kopioi",
Paste				: "Liitä",
PasteText			: "Liitä tekstinä",
PasteWord			: "Liitä Wordista",
Print				: "Tulosta",
SelectAll			: "Valitse kaikki",
RemoveFormat		: "Poista muotoilu",
InsertLinkLbl		: "Linkki",
InsertLink			: "Lisää linkki/muokkaa linkkiä",
RemoveLink			: "Poista linkki",
InsertImageLbl		: "Kuva",
InsertImage			: "Lisää kuva/muokkaa kuvaa",
InsertTableLbl		: "Taulu",
InsertTable			: "Lisää taulu/muokkaa taulua",
InsertLineLbl		: "Murtoviiva",
InsertLine			: "Lisää murtoviiva",
InsertSpecialCharLbl: "Erikoismerkki",
InsertSpecialChar	: "Lisää erikoismerkki",
InsertSmileyLbl		: "Hymiö",
InsertSmiley		: "Lisää hymiö",
About				: "FCKeditorista",
Bold				: "Lihavoitu",
Italic				: "Kursivoitu",
Underline			: "Alleviivattu",
StrikeThrough		: "Yliviivattu",
Subscript			: "Alaindeksi",
Superscript			: "Yläindeksi",
LeftJustify			: "Tasaa vasemmat reunat",
CenterJustify		: "Keskitä",
RightJustify		: "Tasaa oikeat reunat",
BlockJustify		: "Tasaa molemmat reunat",
DecreaseIndent		: "Pienennä sisennystä",
IncreaseIndent		: "Suurenna sisennystä",
Undo				: "Kumoa",
Redo				: "Toista",
NumberedListLbl		: "Numerointi",
NumberedList		: "Lisää/poista numerointi",
BulletedListLbl		: "Luottelomerkit",
BulletedList		: "Lisää/poista luottelomerkit",
ShowTableBorders	: "Näytä taulun rajat",
ShowDetails			: "Näytä muotoilu",
Style				: "Tyyli",
FontFormat			: "Muotoilu",
Font				: "Fontti",
FontSize			: "Koko",
TextColor			: "Tekstiväri",
BGColor				: "Taustaväri",
Source				: "Koodi",
Find				: "Etsi",
Replace				: "Korvaa",

// Context Menu
EditLink			: "Muokkaa linkkiä",
InsertRow			: "Lisää rivi",
DeleteRows			: "Poista rivit",
InsertColumn		: "Lisää sarake",
DeleteColumns		: "Poista sarakkeet",
InsertCell			: "Lisää solu",
DeleteCells			: "Poista solut",
MergeCells			: "Yhdistä solut",
SplitCell			: "Jaa solu",
CellProperties		: "Solun ominaisuudet",
TableProperties		: "Taulun ominaisuudet",
ImageProperties		: "Kuvan ominaisuudet",

FontFormats			: "Normaali;Muotoiltu;Osoite;Otsikko 1;Otsikko 2;Otsikko 3;Otsikko 4;Otsikko 5;Otsikko 6",

// Alerts and Messages
ProcessingXHTML		: "Prosessoidaan XHTML:ää. Odota hetki...",
Done				: "Valmis",
PasteWordConfirm	: "Teksti, jonka haluat liittää, näyttää olevan kopioitu Wordista. Haluatko puhdistaa sen ennen liittämistä?",
NotCompatiblePaste	: "This command is available for Internet Explorer version 5.5 or more. Do you want to paste without cleaning?",
UnknownToolbarItem	: "Unknown toolbar item \"%1\"",
UnknownCommand		: "Unknown command name \"%1\"",
NotImplemented		: "Command not implemented",
UnknownToolbarSet	: "Toolbar set \"%1\" doesn't exist",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Peruuta",
DlgBtnClose			: "Sulje",
DlgAdvancedTag		: "Lisäominaisuudet",

// General Dialogs Labels
DlgGenNotSet		: "&lt;ei asetettu&gt;",
DlgGenId			: "Tunniste",
DlgGenLangDir		: "Kielen suunta",
DlgGenLangDirLtr	: "Vasemmalta oikealle (LTR)",
DlgGenLangDirRtl	: "Oikealta vasemmalle (RTL)",
DlgGenLangCode		: "Kielikoodi",
DlgGenAccessKey		: "Access Key",
DlgGenName			: "Nimi",
DlgGenTabIndex		: "Tab Index",
DlgGenLongDescr		: "Long Description URL",
DlgGenClass			: "Stylesheet Classes",
DlgGenTitle			: "Avustava otsikko",
DlgGenContType		: "Advisory Content Type",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Tyyli",

// Image Dialog
DlgImgTitle			: "Kuvan ominaisuudet",
DlgImgInfoTab		: "Kuvan tiedot",
DlgImgBtnUpload		: "Lähetä palvelimelle",
DlgImgURL			: "Osoite",
DlgImgUpload		: "Lisää kuva",
DlgImgBtnBrowse		: "Selaa palvelinta",
DlgImgAlt			: "Kuvateksti",
DlgImgWidth			: "Leveys",
DlgImgHeight		: "Korkeus",
DlgImgLockRatio		: "Lukitse suhteet",
DlgBtnResetSize		: "Alkuperäinen koko",
DlgImgBorder		: "Raja",
DlgImgHSpace		: "Vaakatila",
DlgImgVSpace		: "Pystytila",
DlgImgAlign			: "Kohdistus",
DlgImgAlignLeft		: "Vasemmalle",
DlgImgAlignAbsBottom: "Aivan alas",
DlgImgAlignAbsMiddle: "Aivan keskelle",
DlgImgAlignBaseline	: "Alas (teksti)",
DlgImgAlignBottom	: "Alas",
DlgImgAlignMiddle	: "Keskelle",
DlgImgAlignRight	: "Oikealle",
DlgImgAlignTextTop	: "Ylös (teksti)",
DlgImgAlignTop		: "Ylös",
DlgImgPreview		: "Esikatselu",
DlgImgMsgWrongExt	: "Vain seuraavat tiedostotyypit ovat sallittuja:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nToiminto peruutettu.",
DlgImgAlertSelect	: "Valitse kuva, jonka haluat lisätä.",
DlgImgAlertUrl		: "Kirjoita kuvan osoite (URL)",

// Link Dialog
DlgLnkWindowTitle	: "Linkki",
DlgLnkInfoTab		: "Linkin tiedot",
DlgLnkTargetTab		: "Kohde",

DlgLnkType			: "Linkkityyppi",
DlgLnkTypeURL		: "Osoite",
DlgLnkTypeAnchor	: "Ankkuri tässä sivussa",
DlgLnkTypeEMail		: "Sähköposti",
DlgLnkProto			: "Protokolla",
DlgLnkProtoOther	: "&lt;muu&gt;",
DlgLnkURL			: "Osoite",
DlgLnkBtnBrowse		: "Selaa palvelinta",
DlgLnkAnchorSel		: "Valitse ankkuri",
DlgLnkAnchorByName	: "Ankkurin nimen mukaan",
DlgLnkAnchorById	: "Ankkurin ID:n mukaan",
DlgLnkNoAnchors		: "&lt;Ei ankkureita tässä dokumentissa&gt;",
DlgLnkEMail			: "Sähköpostiosoite",
DlgLnkEMailSubject	: "Aihe",
DlgLnkEMailBody		: "Viesti",
DlgLnkUpload		: "Lisää tiedosto",
DlgLnkBtnUpload		: "Lähetä palvelimelle",

DlgLnkTarget		: "Kohde",
DlgLnkTargetFrame	: "&lt;kehys&gt;",
DlgLnkTargetPopup	: "&lt;popup ikkuna&gt;",
DlgLnkTargetBlank	: "Uusi ikkuna (_blank)",
DlgLnkTargetParent	: "Emoikkuna (_parent)",
DlgLnkTargetSelf	: "Sama ikkuna (_self)",
DlgLnkTargetTop		: "Päällimmäisin ikkuna (_top)",
DlgLnkTargetFrame	: "Kohdekehyksen nimi",
DlgLnkPopWinName	: "Popup ikkunan nimi",
DlgLnkPopWinFeat	: "Popup ikkunan ominaisuudet",
DlgLnkPopResize		: "Venytettävä",
DlgLnkPopLocation	: "Osoiterivi",
DlgLnkPopMenu		: "Valikkorivi",
DlgLnkPopScroll		: "Vierityspalkit",
DlgLnkPopStatus		: "Tilarivi",
DlgLnkPopToolbar	: "Vakiopainikkeet",
DlgLnkPopFullScrn	: "Täysi ikkuna (IE)",
DlgLnkPopDependent	: "Riippuva (Netscape)",
DlgLnkPopWidth		: "Leveys",
DlgLnkPopHeight		: "Korkeus",
DlgLnkPopLeft		: "Vasemmalta (px)",
DlgLnkPopTop		: "Ylhäältä (px)",

DlgLnkMsgWrongExtA	: "Vain seuraavat tiedostotyypit ovat sallittuja:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nToiminto peruutettu.",
DlgLnkMsgWrongExtD	: "Seuraavat tiedostotyypit eivät ole sallittuja:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nToiminto peruutettu.",

// Color Dialog
DlgColorTitle		: "Valitse väri",
DlgColorBtnClear	: "Tyhjennä",
DlgColorHighlight	: "Kohdalla",
DlgColorSelected	: "Valittu",

// Smiley Dialog
DlgSmileyTitle		: "Lisää hymiö",

// Special Character Dialog
DlgSpecialCharTitle	: "Valitse erikoismerkki",

// Table Dialog
DlgTableTitle		: "Taulun ominaisuudet",
DlgTableRows		: "Rivit",
DlgTableColumns		: "Sarakkeet",
DlgTableBorder		: "Rajan paksuus",
DlgTableAlign		: "Kohdistus",
DlgTableAlignNotSet	: "<ei asetettu>",
DlgTableAlignLeft	: "Vasemmalle",
DlgTableAlignCenter	: "Keskelle",
DlgTableAlignRight	: "Oikealle",
DlgTableWidth		: "Leveys",
DlgTableWidthPx		: "pikseliä",
DlgTableWidthPc		: "prosenttia",
DlgTableHeight		: "Korkeus",
DlgTableCellSpace	: "Solujen väli",
DlgTableCellPad		: "Solujen sisennys",
DlgTableCaption		: "Otsikko",

// Table Cell Dialog
DlgCellTitle		: "Solun ominaisuudet",
DlgCellWidth		: "Leveys",
DlgCellWidthPx		: "pikseliä",
DlgCellWidthPc		: "prosenttia",
DlgCellHeight		: "Korkeus",
DlgCellWordWrap		: "Tekstikierrätys",
DlgCellWordWrapNotSet	: "<Ei asetettu>",
DlgCellWordWrapYes	: "Kyllä",
DlgCellWordWrapNo	: "Ei",
DlgCellHorAlign		: "Vaakakohdistus",
DlgCellHorAlignNotSet	: "<Ei asetettu>",
DlgCellHorAlignLeft	: "Vasemmalle",
DlgCellHorAlignCenter	: "Keskelle",
DlgCellHorAlignRight: "Oikealle",
DlgCellVerAlign		: "Pystykohdistus",
DlgCellVerAlignNotSet	: "<Ei asetettu>",
DlgCellVerAlignTop	: "Ylös",
DlgCellVerAlignMiddle	: "Keskelle",
DlgCellVerAlignBottom	: "Alas",
DlgCellVerAlignBaseline	: "Tekstin alas",
DlgCellRowSpan		: "Rivin jatkuvuus",
DlgCellCollSpan		: "Sarakkeen jatkuvuus",
DlgCellBackColor	: "Taustaväri",
DlgCellBorderColor	: "Rajan väri",
DlgCellBtnSelect	: "Valitse...",

// Find Dialog
DlgFindTitle		: "Etsi",
DlgFindFindBtn		: "Etsi",
DlgFindNotFoundMsg	: "Etsittyä tekstiä ei löytynyt.",

// Replace Dialog
DlgReplaceTitle			: "Korvaa",
DlgReplaceFindLbl		: "Etsi mitä:",
DlgReplaceReplaceLbl	: "Korvaa tällä:",
DlgReplaceCaseChk		: "Sama kirjainkoko",
DlgReplaceReplaceBtn	: "Korvaa",
DlgReplaceReplAllBtn	: "Korvaa kaikki",
DlgReplaceWordChk		: "Koko sana",

// Paste Operations / Dialog
PasteErrorPaste	: "Selaimesi turva-asetukset eivät salli editorin toteuttaa liittämistä. Käytä näppäimistöä liittämiseen (Ctrl+V).",
PasteErrorCut	: "Selaimesi turva-asetukset eivät salli editorin toteuttaa leikkaamista. Käytä näppäimistöä leikkaamiseen (Ctrl+X).",
PasteErrorCopy	: "Selaimesi turva-asetukset eivät salli editorin toteuttaa kopioimista. Käytä näppäimistöä kopioimiseen (Ctrl+C).",

PasteAsText		: "Liitä tekstinä",
PasteFromWord	: "Liitä Wordista",

DlgPasteMsg		: "Editori ei voinut toteuttaa liittämistä selaimesi <STRONG>turva-asetusten</STRONG> takia.<BR>Suorita liittäminen käyttäen näppäimistöä (<STRONG>Ctrl+V</STRONG>) ja valitse <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automaattinen",
ColorMoreColors	: "Lisää värejä...",

// About Dialog
DlgAboutVersion	: "versio",
DlgAboutLicense	: "Lisenssi: GNU Lesser General Public License",
DlgAboutInfo	: "Lisää tietoa osoitteesta"
}