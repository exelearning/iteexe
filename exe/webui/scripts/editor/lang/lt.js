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
 * File Name: lt.js
 * 	Lithuanian language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-24 23:40:53
 * 
 * File Authors:
 * 		Tauras Paliulis (tauras.paliulis@tauras.com)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Sutraukti mygtukų juostą",
ToolbarExpand		: "Išplėsti mygtukų juostą",

// Toolbar Items and Context Menu
Save				: "Išsaugoti",
NewPage				: "Naujas puslapis",
Preview				: "Peržiūra",
Cut					: "Iškirpti",
Copy				: "Kopijuoti",
Paste				: "Įdėti",
PasteText			: "Įdėti kaip gryną tekstą",
PasteWord			: "Įdėti iš Word",
Print				: "Spausdinti",
SelectAll			: "Pažymėti viską",
RemoveFormat		: "Panaikinti formatą",
InsertLinkLbl		: "Nuoroda",
InsertLink			: "Įterpti/taisyti nuorodą",
RemoveLink			: "Panaikinti nuorodą",
InsertImageLbl		: "Vaizdas",
InsertImage			: "Įterpti/taisyti vaizdą",
InsertTableLbl		: "Lentelė",
InsertTable			: "Įterpti/taisyti lentelę",
InsertLineLbl		: "Linija",
InsertLine			: "Įterpti horizontalią liniją",
InsertSpecialCharLbl: "Spec. simbolis",
InsertSpecialChar	: "Įterpti specialų simbolį",
InsertSmileyLbl		: "Veideliai",
InsertSmiley		: "Įterpti veidelį",
About				: "Apie FCKeditor",
Bold				: "Pusjuodis",
Italic				: "Kursyvas",
Underline			: "Pabrauktas",
StrikeThrough		: "Perbrauktas",
Subscript			: "Apatinis indeksas",
Superscript			: "Viršutinis indeksas",
LeftJustify			: "Lygiuoti kairę",
CenterJustify		: "Centruoti",
RightJustify		: "Lygiuoti dešinę",
BlockJustify		: "Lygiuoti abi puses",
DecreaseIndent		: "Sumažinti įtrauką",
IncreaseIndent		: "Padidinti įtrauką",
Undo				: "Atšaukti",
Redo				: "Atstatyti",
NumberedListLbl		: "Numeruotas sąrašas",
NumberedList		: "Įterpti/Panaikinti numeruotą sąrašą",
BulletedListLbl		: "Suženklintas sąrašas",
BulletedList		: "Įterpti/Panaikinti suženklintą sąrašą",
ShowTableBorders	: "Rodyti lentelės rėmus",
ShowDetails			: "Rodyti detales",
Style				: "Stilius",
FontFormat			: "Šrifto formatas",
Font				: "Šriftas",
FontSize			: "Šrifto dydis",
TextColor			: "Teksto spalva",
BGColor				: "Fono spalva",
Source				: "Šaltinis",
Find				: "Rasti",
Replace				: "Pakeisti",

// Context Menu
EditLink			: "Taisyti nuorodą",
InsertRow			: "Įterpti eilutę",
DeleteRows			: "Šalinti eilutes",
InsertColumn		: "Įterpti stulpelį",
DeleteColumns		: "Šalinti stulpelius",
InsertCell			: "Įterpti langelį",
DeleteCells			: "Šalinti langelius",
MergeCells			: "Sujungti langelius",
SplitCell			: "Skaidyti langelius",
CellProperties		: "Langelio savybės",
TableProperties		: "Lentelės savybės",
ImageProperties		: "Vaizdo savybės",

FontFormats			: "Normalus;Formuotas;Kreipinio;Antraštinis 1;Antraštinis 2;Antraštinis 3;Antraštinis 4;Antraštinis 5;Antraštinis 6",

// Alerts and Messages
ProcessingXHTML		: "Apdorojamas XHTML. Prašome palaukti...",
Done				: "Baigta",
PasteWordConfirm	: "Įdedamas tekstas yra panašus į kopiją iš Word. Ar Jūs norite prieš įdėjimą išvalyti jį?",
NotCompatiblePaste	: "Ši komanda yra prieinama tik per Internet Explorer 5.5 ar aukštesnę versiją. Ar Jūs norite įterpti be valymo?",
UnknownToolbarItem	: "Nežinomas mygtukų juosta elementas \"%1\"",
UnknownCommand		: "Nežinomas komandos vardas \"%1\"",
NotImplemented		: "Komanda nėra įgyvendinta",
UnknownToolbarSet	: "Mygtukų juostos rinkinys \"%1\" neegzistuoja",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Nutraukti",
DlgBtnClose			: "Uždaryti",
DlgAdvancedTag		: "Papildomas",

// General Dialogs Labels
DlgGenNotSet		: "&lt;nėra nustatyta&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Teksto kryptis",
DlgGenLangDirLtr	: "Iš kairės į dešinę (LTR)",
DlgGenLangDirRtl	: "Iš dešinės į kairę (RTL)",
DlgGenLangCode		: "Kalbos kodas",
DlgGenAccessKey		: "Prieigos raktas",
DlgGenName			: "Vardas",
DlgGenTabIndex		: "Tabuliavimo indeksas",
DlgGenLongDescr		: "Ilgas aprašymas URL",
DlgGenClass			: "Stilių lentelės klasės",
DlgGenTitle			: "Konsultacinė antraštė",
DlgGenContType		: "Konsultacinio turinio tipas",
DlgGenLinkCharset	: "Susietų išteklių simbolių lentelė",
DlgGenStyle			: "Stilius",

// Image Dialog
DlgImgTitle			: "Vaizdo savybės",
DlgImgInfoTab		: "Vaizdo informacija",
DlgImgBtnUpload		: "Siųsti į serverį",
DlgImgURL			: "URL",
DlgImgUpload		: "Nusiųsti",
DlgImgBtnBrowse		: "Naršyti po serverį",
DlgImgAlt			: "Alternatyvus Tekstas",
DlgImgWidth			: "Plotis",
DlgImgHeight		: "Aukštis",
DlgImgLockRatio		: "Išlaikyti proporciją",
DlgBtnResetSize		: "Atstatyti dydį",
DlgImgBorder		: "Rėmelis",
DlgImgHSpace		: "Hor.Erdvė",
DlgImgVSpace		: "Vert.Erdvė",
DlgImgAlign			: "Lygiuoti",
DlgImgAlignLeft		: "Kairę",
DlgImgAlignAbsBottom: "Absoliučią apačią",
DlgImgAlignAbsMiddle: "Absoliutų vidurį",
DlgImgAlignBaseline	: "Apatinę liniją",
DlgImgAlignBottom	: "Apačią",
DlgImgAlignMiddle	: "Vidurį",
DlgImgAlignRight	: "Dešinę",
DlgImgAlignTextTop	: "Teksto viršūnę",
DlgImgAlignTop		: "Viršūnę",
DlgImgPreview		: "Peržiūra",
DlgImgMsgWrongExt	: "Atleiskite, tačiau leidžiama siųsti tik šių tipų failus:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperacija nutraukiama.",
DlgImgAlertSelect	: "Prašom pasirinkti vaizdą siuntimui.",
DlgImgAlertUrl		: "Prašome įvesti vaizdo URL",

// Link Dialog
DlgLnkWindowTitle	: "Nuoroda",
DlgLnkInfoTab		: "Nuorodos informacija",
DlgLnkTargetTab		: "Paskirtis",

DlgLnkType			: "Nuorodos tipas",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Žymė šiame puslapyje",
DlgLnkTypeEMail		: "El.paštas",
DlgLnkProto			: "Protokolas",
DlgLnkProtoOther	: "&lt;kitas&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Naršyti po serverį",
DlgLnkAnchorSel		: "Pasirinkite žymę",
DlgLnkAnchorByName	: "Pagal žymės vardą",
DlgLnkAnchorById	: "Pagal žymės Id",
DlgLnkNoAnchors		: "&lt;Šiame dokumente žymių nėra&gt;",
DlgLnkEMail			: "El.pašto adresas",
DlgLnkEMailSubject	: "Žinutės tema",
DlgLnkEMailBody		: "Žinutės turinys",
DlgLnkUpload		: "Siųsti",
DlgLnkBtnUpload		: "Siųsti į serverį",

DlgLnkTarget		: "Paskirties vieta",
DlgLnkTargetFrame	: "&lt;kadras&gt;",
DlgLnkTargetPopup	: "&lt;išskleidžiamas langas&gt;",
DlgLnkTargetBlank	: "Naujas langas (_blank)",
DlgLnkTargetParent	: "Pirminis langas (_parent)",
DlgLnkTargetSelf	: "Tas pats langas (_self)",
DlgLnkTargetTop		: "Svarbiausias langas (_top)",
DlgLnkTargetFrame	: "Paskirties kadro vardas",
DlgLnkPopWinName	: "Paskirties lango vardas",
DlgLnkPopWinFeat	: "Išskleidžiamo lango savybės",
DlgLnkPopResize		: "Keičiamas dydis",
DlgLnkPopLocation	: "Adreso juosta",
DlgLnkPopMenu		: "Meniu juosta",
DlgLnkPopScroll		: "Slinkties juostos",
DlgLnkPopStatus		: "Būsenos juosta",
DlgLnkPopToolbar	: "Mygtukų juosta",
DlgLnkPopFullScrn	: "Visas ekranas (IE)",
DlgLnkPopDependent	: "Priklausomas (Netscape)",
DlgLnkPopWidth		: "Plotis",
DlgLnkPopHeight		: "Aukštis",
DlgLnkPopLeft		: "Kairė pozicija",
DlgLnkPopTop		: "Viršutinė pozicija",

DlgLnkMsgWrongExtA	: "Atleiskite, tačiau leidžiama siųsti tik šių tipų failus:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperacija nutraukiama.",
DlgLnkMsgWrongExtD	: "Atleiskite, tačiau šių tipų failų siuntimas yra neleistinas:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperacija nutraukiama.",

DlnLnkMsgNoUrl		: "Prašome įvesti nuorodos URL",
DlnLnkMsgNoEMail	: "Prašome įvesti el.pašto adresą",
DlnLnkMsgNoAnchor	: "Prašome pasirinkti žymę",

// Color Dialog
DlgColorTitle		: "Pasirinkite spalvą",
DlgColorBtnClear	: "Trinti",
DlgColorHighlight	: "Paryškinta",
DlgColorSelected	: "Pažymėta",

// Smiley Dialog
DlgSmileyTitle		: "Įterpti veidelį",

// Special Character Dialog
DlgSpecialCharTitle	: "Pasirinkite specialų simbolį",

// Table Dialog
DlgTableTitle		: "Lentelės savybės",
DlgTableRows		: "Eilutės",
DlgTableColumns		: "Stulpeliai",
DlgTableBorder		: "Rėmelio dydis",
DlgTableAlign		: "Lygiuoti",
DlgTableAlignNotSet	: "<Nenustatyta>",
DlgTableAlignLeft	: "Kairę",
DlgTableAlignCenter	: "Centrą",
DlgTableAlignRight	: "Dešinę",
DlgTableWidth		: "Plotis",
DlgTableWidthPx		: "taškais",
DlgTableWidthPc		: "procentais",
DlgTableHeight		: "Aukštis",
DlgTableCellSpace	: "Tarpas tarp langelių",
DlgTableCellPad		: "Trapas nuo langelio rėmo iki teksto",
DlgTableCaption		: "Antraštė",

// Table Cell Dialog
DlgCellTitle		: "Langelio savybės",
DlgCellWidth		: "Plotis",
DlgCellWidthPx		: "taškais",
DlgCellWidthPc		: "procentais",
DlgCellHeight		: "Aukštis",
DlgCellWordWrap		: "Teksto laužymas",
DlgCellWordWrapNotSet	: "<Nenustatyta>",
DlgCellWordWrapYes	: "Taip",
DlgCellWordWrapNo	: "Ne",
DlgCellHorAlign		: "Horizontaliai lygiuoti",
DlgCellHorAlignNotSet	: "<Nenustatyta>",
DlgCellHorAlignLeft	: "Kairę",
DlgCellHorAlignCenter	: "Centrą",
DlgCellHorAlignRight: "Dešinę",
DlgCellVerAlign		: "Vertikaliai lygiuoti",
DlgCellVerAlignNotSet	: "<Nenustatyta>",
DlgCellVerAlignTop	: "Viršų",
DlgCellVerAlignMiddle	: "Vidurį",
DlgCellVerAlignBottom	: "Apačią",
DlgCellVerAlignBaseline	: "Apatinę liniją",
DlgCellRowSpan		: "Eilučių apjungimas",
DlgCellCollSpan		: "Stulpelių apjungimas",
DlgCellBackColor	: "Fono spalva",
DlgCellBorderColor	: "Rėmelio spalva",
DlgCellBtnSelect	: "Pažymėti...",

// Find Dialog
DlgFindTitle		: "Paieška",
DlgFindFindBtn		: "Surasti",
DlgFindNotFoundMsg	: "Nurodytas tekstas nerastas.",

// Replace Dialog
DlgReplaceTitle			: "Pakeisti",
DlgReplaceFindLbl		: "Surasti tekstą:",
DlgReplaceReplaceLbl	: "Pakeisti tekstu:",
DlgReplaceCaseChk		: "Skirti didžiąsias ir mažąsias raides",
DlgReplaceReplaceBtn	: "Pakeisti",
DlgReplaceReplAllBtn	: "Pakeisti viską",
DlgReplaceWordChk		: "Atitikti pilną žodį",

// Paste Operations / Dialog
PasteErrorPaste	: "Jūsų naršyklės saugumo nustatymai neleidžia redaktoriui automatiškai įvykdyti įdėjimo operacijų. Tam prašome naudoti klaviatūrą (Ctrl+V).",
PasteErrorCut	: "Jūsų naršyklės saugumo nustatymai neleidžia redaktoriui automatiškai įvykdyti iškirpimo operacijų. Tam prašome naudoti klaviatūrą (Ctrl+X).",
PasteErrorCopy	: "Jūsų naršyklės saugumo nustatymai neleidžia redaktoriui automatiškai įvykdyti kopijavimo operacijų. Tam prašome naudoti klaviatūrą (Ctrl+C).",

PasteAsText		: "Įdėti kaip gryną tekstą",
PasteFromWord	: "Įdėti iš Word",

DlgPasteMsg		: "Redaktorius nesugeba automatiškai įvykdyti įdėjimo dėl <STRONG>saugumo nustatymų</STRONG> jūsų naršyklėje.<BR>Prašome įdėti tekstą šiame langelyje naudojantis klaviatūra (<STRONG>Ctrl+V</STRONG>) ir paspauskite <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatinis",
ColorMoreColors	: "Daugiau spalvų...",

// About Dialog
DlgAboutVersion	: "versija",
DlgAboutLicense	: "Licencijuota pagal GNU mažesnės atsakomybės pagrindinės viešos licencijos sąlygas",
DlgAboutInfo	: "Papildomą informaciją galima gauti"
}