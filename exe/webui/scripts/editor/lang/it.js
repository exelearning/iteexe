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
 * File Name: it.js
 * 	Italian language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-05 22:24:11
 * 
 * File Authors:
 * 		Simone Chiaretta (simone@piyosailing.com)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Nasconti la barra degli strumenti",
ToolbarExpand		: "Mostra la barra degli strumenti",

// Toolbar Items and Context Menu
Save			: "Salva",
NewPage			: "Nuova pagina vuota",
Preview			: "Anteprima",
Cut				: "Taglia",
Copy			: "Copia",
Paste			: "Incolla",
PasteText		: "Incolla come testo semplice",
PasteWord		: "Incolla da Word",
Print			: "Stampa",
SelectAll		: "Seleziona tutto",
RemoveFormat	: "Elimina formattazione",
InsertLinkLbl	: "Collegamento",
InsertLink		: "Inserisci/Modifica collegamento",
RemoveLink		: "Elimina collegamento",
InsertImageLbl	: "Immagine",
InsertImage		: "Inserisci/Modifica immagine",
InsertTableLbl	: "Tabella",
InsertTable		: "Inserisci/Modifica tabella",
InsertLineLbl	: "Riga orizzontale",
InsertLine		: "Inserisci riga orizzontale",
InsertSpecialCharLbl	: "Caratteri speciali",
InsertSpecialChar	: "Inserisci carattere speciale",
InsertSmileyLbl		: "Emoticon",
InsertSmiley		: "Inserisci emoticon",
About			: "Informazioni su FCKeditor",
Bold			: "Grassetto",
Italic			: "Corsivo",
Underline		: "Sottolineato",
StrikeThrough	: "Barrato",
Subscript		: "Pedice",
Superscript		: "Apice",
LeftJustify		: "Allinea a sinistra",
CenterJustify		: "Centra",
RightJustify		: "Allinea a destra",
BlockJustify		: "Giustifica",
DecreaseIndent		: "Riduci rientro",
IncreaseIndent		: "Aumenta rientro",
Undo			: "Annulla",
Redo			: "Ripristina",
NumberedListLbl		: "Elenco numerato",
NumberedList		: "Inserisci/Modifica elenco numerato",
BulletedListLbl		: "Elenco puntato",
BulletedList		: "Inserisci/Modifica elenco puntato",
ShowTableBorders	: "Mostra bordi tabelle",
ShowDetails		: "Mostra dettagli",
Style			: "Stile",
FontFormat		: "Formato",
Font			: "Font",
FontSize		: "Dimensione",
TextColor		: "Colore testo",
BGColor			: "Colore sfondo",
Source			: "Codice",
Find			: "Trova",
Replace			: "Sostituisci",

// Context Menu
EditLink		: "Modifica collegamento",
InsertRow		: "Inserisci riga",
DeleteRows		: "Elimina righe",
InsertColumn		: "Inserisci colonna",
DeleteColumns		: "Elimina colonne",
InsertCell		: "Inserisci cella",
DeleteCells		: "Elimina celle",
MergeCells		: "Unisce celle",
SplitCell		: "Dividi celle",
CellProperties		: "Proprietà cella",
TableProperties		: "Proprietà tabella",
ImageProperties		: "Proprietà immagine",

FontFormats		: "Normale;Formattato;Indirizzo;Titolo 1;Titolo 2;Titolo 3;Titolo 4;Titolo 5;Titolo 6;Paragrafo (DIV)",

// Alerts and Messages
ProcessingXHTML		: "Elaborazione XHTML in corso. Attendere prego...",
Done			: "Completato",
PasteWordConfirm	: "Il testo da incollare sembra provenire da Word. Desideri pulirlo prima di incollare?",
NotCompatiblePaste	: "Questa funzione è disponibile solo per Internet Explorer 5.5 o superiore. Desideri incollare il testo senza pulirlo?",
UnknownToolbarItem	: "Elemento della barra strumenti sconosciuto \"%1\"",
UnknownCommand		: "Comando sconosciuto \"%1\"",
NotImplemented		: "Commando non implementato",
UnknownToolbarSet	: "La barra di strumenti \"%1\" non esiste",

// Dialogs
DlgBtnOK		: "OK",
DlgBtnCancel		: "Annulla",
DlgBtnClose		: "Chiudi",
DlgAdvancedTag		: "Avanzate",

// General Dialogs Labels
DlgGenNotSet		: "&lt;non impostato&gt;",
DlgGenId		: "Id",
DlgGenLangDir		: "Direzione scrittura",
DlgGenLangDirLtr	: "Da Sinistra a Destra (LTR)",
DlgGenLangDirRtl	: "Da Destra a Sinistra (RTL)",
DlgGenLangCode		: "Codice Lingua",
DlgGenAccessKey		: "Scorciatoria<br>da tastiera",
DlgGenName		: "Nome",
DlgGenTabIndex		: "Ordine di tabulazione",
DlgGenLongDescr		: "URL descrizione estesa",
DlgGenClass		: "Nome classe CSS",
DlgGenTitle		: "Titolo",
DlgGenContType		: "Tipo della risorsa collegata",
DlgGenLinkCharset	: "Set di caretteri della risorsa collegata",
DlgGenStyle		: "Stile",

// Image Dialog
DlgImgTitle		: "Proprietà immagine",
DlgImgInfoTab		: "Informazioni immagine",
DlgImgBtnUpload		: "Invia al server",
DlgImgURL		: "URL",
DlgImgUpload		: "Carica",
DlgImgBtnBrowse		: "Cerca sul Server",
DlgImgAlt		: "Testo alternativo",
DlgImgWidth		: "Larghezza",
DlgImgHeight		: "Altezza",
DlgImgLockRatio		: "Blocca rapporto",
DlgBtnResetSize		: "Reimposta dimensione",
DlgImgBorder		: "Bordo",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign		: "Allineamento",
DlgImgAlignLeft		: "Sinistra",
DlgImgAlignAbsBottom	: "In basso assoluto",
DlgImgAlignAbsMiddle	: "Centrato assoluto",
DlgImgAlignBaseline	: "Linea base",
DlgImgAlignBottom	: "In Basso",
DlgImgAlignMiddle	: "Centrato",
DlgImgAlignRight	: "Destra",
DlgImgAlignTextTop	: "In alto al testo",
DlgImgAlignTop		: "In Alto",
DlgImgPreview		: "Anteprima",
DlgImgMsgWrongExt	: "Sono consentiti solo i seguenti formati di immagini:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperazione Annullata.",
DlgImgAlertSelect	: "Scegli l'immagine da caricare",
DlgImgAlertUrl		: "Inserisci il tipo di URL per l'immagine",

// Link Dialog
DlgLnkWindowTitle	: "Collegamento",
DlgLnkInfoTab		: "Informazioni collegamento",
DlgLnkTargetTab		: "Destinazione",

DlgLnkType		: "Tipo di Collegamento",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Ancora nella pagina",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto		: "Protocollo",
DlgLnkProtoOther	: "&lt;altro&gt;",
DlgLnkURL		: "URL",
DlgLnkBtnBrowse		: "Cerca sul Server",
DlgLnkAnchorSel		: "Scegli Ancora",
DlgLnkAnchorByName	: "By Anchor Nome",
DlgLnkAnchorById	: "By Element Id",
DlgLnkNoAnchors		: "&lt;Nessuna ancora disponibile nel documento&gt;",
DlgLnkEMail		: "Indirizzo E-Mail",
DlgLnkEMailSubject	: "Oggetto del messaggio",
DlgLnkEMailBody		: "Corpo del messaggio",
DlgLnkUpload		: "Carica",
DlgLnkBtnUpload		: "Invia al Server",

DlgLnkTarget		: "Destinazione",
DlgLnkTargetFrame	: "&lt;riquadro&gt;",
DlgLnkTargetPopup	: "&lt;finestra popup&gt;",
DlgLnkTargetBlank	: "Nuova finestra (_blank)",
DlgLnkTargetParent	: "Finestra padre (_parent)",
DlgLnkTargetSelf	: "Stessa finestra (_self)",
DlgLnkTargetTop		: "Finestra superiore (_top)",
DlgLnkTargetFrame	: "Nome del riquadro di destinazione",
DlgLnkPopWinName	: "Nome finestra popup",
DlgLnkPopWinFeat	: "Caratteristiche finestra popup",
DlgLnkPopResize		: "Ridimensionabile",
DlgLnkPopLocation	: "Barra degli indirizzi",
DlgLnkPopMenu		: "Barra del menu",
DlgLnkPopScroll		: "Barre di scorrimento",
DlgLnkPopStatus		: "Barra di stato",
DlgLnkPopToolbar	: "Barra degli strumenti",
DlgLnkPopFullScrn	: "A tutto schermo (IE)",
DlgLnkPopDependent	: "Dipendente (Netscape)",
DlgLnkPopWidth		: "Larghezza",
DlgLnkPopHeight		: "Altezza",
DlgLnkPopLeft		: "Posizione da sinistra",
DlgLnkPopTop		: "Posizione dall'alto",

DlgLnkMsgWrongExtA	: "Sono consentiti soltanto i seguenti tipi di file:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperazione annullata.",
DlgLnkMsgWrongExtD	: "Non sono consentiti i seguenti tipi di file:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperazione annullata.",

DlnLnkMsgNoUrl		: "Devi inserire l'URL del collegamento",
DlnLnkMsgNoEMail	: "Devi inserire un'indirizzo e-mail",
DlnLnkMsgNoAnchor	: "Devi selezionare un'ancora",

// Color Dialog
DlgColorTitle		: "Seleziona colore",
DlgColorBtnClear	: "Vuota",
DlgColorHighlight	: "Evidenziato",
DlgColorSelected	: "Selezionato",

// Smiley Dialog
DlgSmileyTitle		: "Inserisci emoticon",

// Special Character Dialog
DlgSpecialCharTitle	: "Seleziona carattere speciale",

// Table Dialog
DlgTableTitle		: "Proprietà tabella",
DlgTableRows		: "Righe",
DlgTableColumns		: "Colonne",
DlgTableBorder		: "Dimensione bordo",
DlgTableAlign		: "Allineamento",
DlgTableAlignNotSet	: "&lt;non impostato&gt;",
DlgTableAlignLeft	: "Sinistra",
DlgTableAlignCenter	: "Centrato",
DlgTableAlignRight	: "Destra",
DlgTableWidth		: "Larghezza",
DlgTableWidthPx		: "pixel",
DlgTableWidthPc		: "percento",
DlgTableHeight		: "Altezza",
DlgTableCellSpace	: "Spaziatura celle",
DlgTableCellPad		: "Padding celle",
DlgTableCaption		: "Intestazione",

// Table Cell Dialog
DlgCellTitle		: "Proprietà cella",
DlgCellWidth		: "Larghezza",
DlgCellWidthPx		: "pixel",
DlgCellWidthPc		: "percento",
DlgCellHeight		: "Altezza",
DlgCellWordWrap		: "A capo automatico",
DlgCellWordWrapNotSet	: "&lt;non impostato&gt;",
DlgCellWordWrapYes	: "Si",
DlgCellWordWrapNo	: "No",
DlgCellHorAlign		: "Allineamento orizzontale",
DlgCellHorAlignNotSet	: "&lt;non impostato&gt;",
DlgCellHorAlignLeft	: "Sinistra",
DlgCellHorAlignCenter	: "Centrato",
DlgCellHorAlignRight	: "Destra",
DlgCellVerAlign		: "Allineamento verticale",
DlgCellVerAlignNotSet	: "&lt;non impostato&gt;",
DlgCellVerAlignTop	: "In Alto",
DlgCellVerAlignMiddle	: "Centrato",
DlgCellVerAlignBottom	: "In Basso",
DlgCellVerAlignBaseline	: "Linea base",
DlgCellRowSpan		: "Righe occupate",
DlgCellCollSpan		: "Colonne occupate",
DlgCellBackColor	: "Colore sfondo",
DlgCellBorderColor	: "Colore bordo",
DlgCellBtnSelect	: "Scegli...",

// Find Dialog
DlgFindTitle		: "Trova",
DlgFindFindBtn		: "Trova",
DlgFindNotFoundMsg	: "L'elemento cercato non è stato trovato.",

// Replace Dialog
DlgReplaceTitle		: "Sostituisci",
DlgReplaceFindLbl	: "Trova:",
DlgReplaceReplaceLbl	: "Sostituisci con:",
DlgReplaceCaseChk	: "Maiuscole/minuscole",
DlgReplaceReplaceBtn	: "Sostituisci",
DlgReplaceReplAllBtn	: "Sostituisci tutto",
DlgReplaceWordChk	: "Solo parole intere",

// Paste Operations / Dialog
PasteErrorPaste		: "Le impostazioni di sicurezza del browser non permettono di incollare automaticamente il testo. Usa la tastiera (Ctrl+V).",
PasteErrorCut		: "Le impostazioni di sicurezza del browser non permettono di tagliare automaticamente il testo. Usa la tastiera (Ctrl+X).",
PasteErrorCopy		: "Le impostazioni di sicurezza del browser non permettono di copiare automaticamente il testo. Usa la tastiera (Ctrl+C).",

PasteAsText		: "Incolla come testo semplice",
PasteFromWord		: "Incolla da Word",

DlgPasteMsg		: "Impossibile incollare automaticamente a causa delle <STRONG>impostazioni di sicurezza</STRONG> del browser.<BR>Incolla nel riquadro sottostante (<STRONG>Ctrl+V</STRONG>) e premi <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic		: "Automatico",
ColorMoreColors		: "Altri colori...",

// About Dialog
DlgAboutVersion		: "versione",
DlgAboutLicense		: "Rilasciato sotto la licensa GNU Lesser General Public License",
DlgAboutInfo		: "Per maggiori informazioni visitare"
}