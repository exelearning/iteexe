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
 * File Name: ca.js
 * 	Catalan language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-28 19:53:54
 * 
 * File Authors:
 * 		Jordi Cerdan (nan@myp.ad)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

// Toolbar Items and Context Menu
Save				: "Guardar",
NewPage				: "Nova Pàgina",
Preview				: "Vista Prèvia",
Cut					: "Tallar",
Copy				: "Copiar",
Paste				: "Enganxar",
PasteText			: "Enganxar com text planer",
PasteWord			: "Enganxar des de Word",
Print				: "Imprimir",
SelectAll			: "Seleccionar tot",
RemoveFormat		: "Eliminar Format",
InsertLinkLbl		: "Enllaç",
InsertLink			: "Afegir/Editar Enllaç",
RemoveLink			: "Eliminar Enllaç",
InsertImageLbl		: "Imatge",
InsertImage			: "Afegir/Editar Imatge",
InsertTableLbl		: "Taula",
InsertTable			: "Afegir/Editar Taula",
InsertLineLbl		: "Línia",
InsertLine			: "Afegir Línia Horitzontal",
InsertSpecialCharLbl: "Caràcter Especial",
InsertSpecialChar	: "Afegir Caràcter Especial",
InsertSmileyLbl		: "Icona",
InsertSmiley		: "Afegir Icona",
About				: "Sobre FCKeditor",
Bold				: "Negreta",
Italic				: "Itàlica",
Underline			: "Subratllat",
StrikeThrough		: "Tatxat",
Subscript			: "Subscript",
Superscript			: "Superscript",
LeftJustify			: "Justificar Esquerra",
CenterJustify		: "Justificar Centrat",
RightJustify		: "Justificar Dreta",
BlockJustify		: "Justificar Bloc",
DecreaseIndent		: "Disminuir Indentació",
IncreaseIndent		: "Augmentar Indentació",
Undo				: "Desfer",
Redo				: "Refer",
NumberedListLbl		: "Llista Numerada",
NumberedList		: "Afegir/Eliminar Llista Numerada",
BulletedListLbl		: "Llista Marcada",
BulletedList		: "Afegir/Eliminar Llista Marcada",
ShowTableBorders	: "Mostrar Costats de Taules",
ShowDetails			: "Mostrar Detalls",
Style				: "Estil",
FontFormat			: "Format",
Font				: "Font",
FontSize			: "Tamany",
TextColor			: "Color de Text",
BGColor				: "Color de Fons",
Source				: "Font",
Find				: "Cercar",
Replace				: "Remplaçar",

// Context Menu
EditLink			: "Editar Enllaç",
InsertRow			: "Afegir Fila",
DeleteRows			: "Eliminar Files",
InsertColumn		: "Afegir Columna",
DeleteColumns		: "Eliminar Columnes",
InsertCell			: "Afegir Cel·la",
DeleteCells			: "Eliminar Cel·les",
MergeCells			: "Fusionar Cel·les",
SplitCell			: "Separar Cel·les",
CellProperties		: "Proprietats de Cel·la",
TableProperties		: "Proprietats de Taula",
ImageProperties		: "Proprietats d'Image",

FontFormats			: "Normal;Formatejat;Adreça;Capçalera 1;Capçalera 2;Capçalera 3;Capçalera 4;Capçalera 5;Capçalera 6",

// Alerts and Messages
ProcessingXHTML		: "Processant XHTML. Si us plau esperi...",
Done				: "Fet",
PasteWordConfirm	: "El text que voleu enganxar sembla provenir de Word. Voleu netejar aquest text abans que sigui enganxat?",
NotCompatiblePaste	: "Aquesta funció és disponible per a Internet Explorer versió 5.5 o superior. Voleu enganxar sense netejar?",
UnknownToolbarItem	: "Element de la Barra d'eines desconegut \"%1\"",
UnknownCommand		: "Nom de comanda desconegut \"%1\"",
NotImplemented		: "Mètode no implementat",
UnknownToolbarSet	: "Conjunt de barra d'eines \"%1\" inexistent",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Cancelar",
DlgBtnClose			: "Tancar",
DlgAdvancedTag		: "Avançat",

// General Dialogs Labels
DlgGenNotSet		: "&lt;no definit&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Direcció Idioma",
DlgGenLangDirLtr	: "Esquerra a Dreta (LTR)",
DlgGenLangDirRtl	: "Dreta a Esquerra (RTL)",
DlgGenLangCode		: "Codi de Llengua",
DlgGenAccessKey		: "Clau d'accés",
DlgGenName			: "Nom",
DlgGenTabIndex		: "Index de Tab",
DlgGenLongDescr		: "Descripció Llarga URL",
DlgGenClass			: "Classes del Full d'Estils",
DlgGenTitle			: "Títol Consultiu",
DlgGenContType		: "Tipus de Contingut Consultiu",
DlgGenLinkCharset	: "Conjunt de Caràcters Font Enllaçat",
DlgGenStyle			: "Estil",

// Image Dialog
DlgImgTitle			: "Proprietats d'Imatge",
DlgImgInfoTab		: "Informació d'Imatge",
DlgImgBtnUpload		: "Enviar-la al servidor",
DlgImgURL			: "URL",
DlgImgUpload		: "Pujar",
DlgImgBtnBrowse		: "Veure Servidor",
DlgImgAlt			: "Text Alternatiu",
DlgImgWidth			: "Amplada",
DlgImgHeight		: "Alçada",
DlgImgLockRatio		: "Bloquejar Proporcions",
DlgBtnResetSize		: "Restaurar Tamany",
DlgImgBorder		: "Costat",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Alineació",
DlgImgAlignLeft		: "Left",
DlgImgAlignAbsBottom: "Abs Bottom",
DlgImgAlignAbsMiddle: "Abs Middle",
DlgImgAlignBaseline	: "Baseline",
DlgImgAlignBottom	: "Bottom",
DlgImgAlignMiddle	: "Middle",
DlgImgAlignRight	: "Right",
DlgImgAlignTextTop	: "Text Top",
DlgImgAlignTop		: "Top",
DlgImgPreview		: "Vista Prèvia",
DlgImgMsgWrongExt	: "Només els següents tipus d'imatge poden ser pujats al servidor:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperació Cancelada.",
DlgImgAlertSelect	: "Si us plau, seleccioni una imatge per pujar.",
DlgImgAlertUrl		: "Si us plau, escriviu la URL de la imatge",

// Link Dialog
DlgLnkWindowTitle	: "Enllaç",
DlgLnkInfoTab		: "Informació d'Enllaç",
DlgLnkTargetTab		: "Destí",

DlgLnkType			: "Tipus de Link",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Àncora en aquesta pàgina",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protocol",
DlgLnkProtoOther	: "&lt;altra&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Veure Servidor",
DlgLnkAnchorSel		: "Seleccionar una àncora",
DlgLnkAnchorByName	: "Per nom d'àncora",
DlgLnkAnchorById	: "Per Id d'element",
DlgLnkNoAnchors		: "&lt;No hi ha àncores disponibles en aquest document&gt;",
DlgLnkEMail			: "Adreça d'E-Mail",
DlgLnkEMailSubject	: "Subjecte del Missatge",
DlgLnkEMailBody		: "Cos del Missatge",
DlgLnkUpload		: "Pujar",
DlgLnkBtnUpload		: "Enviar al Servidor",

DlgLnkTarget		: "Destí",
DlgLnkTargetFrame	: "&lt;marc&gt;",
DlgLnkTargetPopup	: "&lt;finestra popup&gt;",
DlgLnkTargetBlank	: "Nova Finestra (_blank)",
DlgLnkTargetParent	: "Finestra Pare (_parent)",
DlgLnkTargetSelf	: "Mateixa Finestra (_self)",
DlgLnkTargetTop		: "Finestra Major (_top)",
DlgLnkTargetFrame	: "Nom Marc Destí",
DlgLnkPopWinName	: "Nom Finestra Popup",
DlgLnkPopWinFeat	: "Característiques Finestra Popup",
DlgLnkPopResize		: "Redimensionable",
DlgLnkPopLocation	: "Barra d'Adreça",
DlgLnkPopMenu		: "Barra de Menú",
DlgLnkPopScroll		: "Barres d'Scroll",
DlgLnkPopStatus		: "Barra d'Estat",
DlgLnkPopToolbar	: "Barra d'Eines",
DlgLnkPopFullScrn	: "Pantalla completa (IE)",
DlgLnkPopDependent	: "Depenent (Netscape)",
DlgLnkPopWidth		: "Amplada",
DlgLnkPopHeight		: "Alçada",
DlgLnkPopLeft		: "Posició Esquerra",
DlgLnkPopTop		: "Posició Dalt",

DlgLnkMsgWrongExtA	: "Només els següents tipus d'arxiu poden ser pujats al servidor:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperació cancelada.",
DlgLnkMsgWrongExtD	: "Els següents tipus d'arxiu no poden ser pujats al servidor:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperació cancelada.",

// Color Dialog
DlgColorTitle		: "Seleccioni Color",
DlgColorBtnClear	: "Netejar",
DlgColorHighlight	: "Realçar",
DlgColorSelected	: "Seleccionat",

// Smiley Dialog
DlgSmileyTitle		: "Afegir una Icona",

// Special Character Dialog
DlgSpecialCharTitle	: "Seleccioneu Caràcter Especial",

// Table Dialog
DlgTableTitle		: "Proprietats de Taula",
DlgTableRows		: "Files",
DlgTableColumns		: "Columnes",
DlgTableBorder		: "Tamany de Costat",
DlgTableAlign		: "Alineació",
DlgTableAlignNotSet	: "<No Definit>",
DlgTableAlignLeft	: "Esquerra",
DlgTableAlignCenter	: "Centre",
DlgTableAlignRight	: "Dreta",
DlgTableWidth		: "Amplada",
DlgTableWidthPx		: "píxels",
DlgTableWidthPc		: "percentatge",
DlgTableHeight		: "Alçada",
DlgTableCellSpace	: "Cell spacing",
DlgTableCellPad		: "Cell padding",
DlgTableCaption		: "Capçalera",

// Table Cell Dialog
DlgCellTitle		: "Proprietats de Cel·la",
DlgCellWidth		: "Amplada",
DlgCellWidthPx		: "píxels",
DlgCellWidthPc		: "percentatge",
DlgCellHeight		: "Alçada",
DlgCellWordWrap		: "Word Wrap",
DlgCellWordWrapNotSet	: "<No Definit>",
DlgCellWordWrapYes	: "Si",
DlgCellWordWrapNo	: "No",
DlgCellHorAlign		: "Alineació Horitzontal",
DlgCellHorAlignNotSet	: "<No Definit>",
DlgCellHorAlignLeft	: "Esquerra",
DlgCellHorAlignCenter	: "Centre",
DlgCellHorAlignRight: "Dreta",
DlgCellVerAlign		: "Alineació Vertical",
DlgCellVerAlignNotSet	: "<No definit>",
DlgCellVerAlignTop	: "Top",
DlgCellVerAlignMiddle	: "Middle",
DlgCellVerAlignBottom	: "Bottom",
DlgCellVerAlignBaseline	: "Baseline",
DlgCellRowSpan		: "Rows Span",
DlgCellCollSpan		: "Columns Span",
DlgCellBackColor	: "Color de Fons",
DlgCellBorderColor	: "Colr de Costat",
DlgCellBtnSelect	: "Seleccioni...",

// Find Dialog
DlgFindTitle		: "Cercar",
DlgFindFindBtn		: "Cercar",
DlgFindNotFoundMsg	: "El text especificat no ha estat trobat.",

// Replace Dialog
DlgReplaceTitle			: "Remplaçar",
DlgReplaceFindLbl		: "Cercar:",
DlgReplaceReplaceLbl	: "Remplaçar per:",
DlgReplaceCaseChk		: "Sensible a Majúscules",
DlgReplaceReplaceBtn	: "Remplaçar",
DlgReplaceReplAllBtn	: "Remplaçar Tot",
DlgReplaceWordChk		: "Cercar Paraula Completa",

// Paste Operations / Dialog
PasteErrorPaste	: "La seguretat del vostre navigador no permet executar automàticament les operacions d'enganxat. Si us plau, utilitzeu el teclat (Ctrl+V).",
PasteErrorCut	: "La seguretat del vostre navigador no permet executar automàticament les operacions de tallar. Si us plau, utilitzeu el teclat (Ctrl+X).",
PasteErrorCopy	: "La seguretat del vostre navigador no permet executar automàticament les operacions de copiar. Si us plau, utilitzeu el teclat (Ctrl+C).",

PasteAsText		: "Enganxar com Text Planer",
PasteFromWord	: "Enganxar com Word",

DlgPasteMsg		: "L'editor no ha pogut executar automàticament l'operació d'enganxar a causa de la <STRONG>configuració de seguretat</STRONG> del seu navigador.<BR>Si us plau, enganxi en el següent cuadre de text utilitzant el teclat (<STRONG>Ctrl+V</STRONG>) i premeu <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automàtic",
ColorMoreColors	: "Més Colors...",

// About Dialog
DlgAboutVersion	: "versió",
DlgAboutLicense	: "Sota els termes de la Llicència GNU Lesser General Public License",
DlgAboutInfo	: "Per a més informació aneu a"
}