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
 * File Name: cs.js
 * 	Czech language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 15:54:32
 * 
 * File Authors:
 * 		David Horák (david.horak@email.cz)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Skrýt panel nástrojů",
ToolbarExpand		: "Zobrazit panel nástrojů",

// Toolbar Items and Context Menu
Save				: "Uložit",
NewPage				: "Nová stránka",
Preview				: "Náhled",
Cut					: "Vyjmout",
Copy				: "Kopírovat",
Paste				: "Vložit",
PasteText			: "Vložit jako čistý text",
PasteWord			: "Vložit z Wordu",
Print				: "Tisk",
SelectAll			: "Vybrat vše",
RemoveFormat		: "Odstranit formátování",
InsertLinkLbl		: "Odkaz",
InsertLink			: "Vložit/změnit odkaz",
RemoveLink			: "Odstranit odkaz",
InsertImageLbl		: "Obrázek",
InsertImage			: "Vložit/změnit obrázek",
InsertTableLbl		: "Tabulka",
InsertTable			: "Vložit/změnit tabulku",
InsertLineLbl		: "Linka",
InsertLine			: "Vložit vodorovnou linku",
InsertSpecialCharLbl: "Speciální znaky",
InsertSpecialChar	: "Vložit speciální znaky",
InsertSmileyLbl		: "Smajlíky",
InsertSmiley		: "Vložit smajlík",
About				: "O aplikaci FCKeditor",
Bold				: "Tučné",
Italic				: "Kurzíva",
Underline			: "Podtržené",
StrikeThrough		: "Přeškrtnuté",
Subscript			: "Dolní index",
Superscript			: "Horní index",
LeftJustify			: "Zarovnat vlevo",
CenterJustify		: "Zarovnat na střed",
RightJustify		: "Zarovnat vpravo",
BlockJustify		: "Zarovnat do bloku",
DecreaseIndent		: "Zmenšit odsazení",
IncreaseIndent		: "Zvětšit odsazení",
Undo				: "Zpět",
Redo				: "Znovu",
NumberedListLbl		: "Číslování",
NumberedList		: "Vložit/odstranit číslovaný seznam",
BulletedListLbl		: "Odrážky",
BulletedList		: "Vložit/odstranit odrážky",
ShowTableBorders	: "Zobrzit okraje tabulek",
ShowDetails			: "Zobrazit podrobnosti",
Style				: "Styl",
FontFormat			: "Formát",
Font				: "Písmo",
FontSize			: "Velikost",
TextColor			: "Barva textu",
BGColor				: "Barva pozadí",
Source				: "Zdroj",
Find				: "Hledat",
Replace				: "Nahradit",

// Context Menu
EditLink			: "Změnit odkaz",
InsertRow			: "Vložit řádek",
DeleteRows			: "Smazat řádek",
InsertColumn		: "Vložit sloupec",
DeleteColumns		: "Smazat sloupec",
InsertCell			: "Vložit buňku",
DeleteCells			: "Smazat buňky",
MergeCells			: "Sloučit buňky",
SplitCell			: "Rozdělit buňku",
CellProperties		: "Vlastnosti buňky",
TableProperties		: "Vlastnosti tabulky",
ImageProperties		: "Vlastnosti obrázku",

FontFormats			: "Normální;Formátovaný;Adresa;Nadpis 1;Nadpis 2;Nadpis 3;Nadpis 4;Nadpis 5;Nadpis 6",

// Alerts and Messages
ProcessingXHTML		: "Probíhá zpracování XHTML. Prosím čekejte...",
Done				: "Hotovo",
PasteWordConfirm	: "Jak je vidět, vkládaný text je kopírován z Wordu. Chceet jej před vložením vyčistit?",
NotCompatiblePaste	: "Tento příkaz je dostupný pouze v Internet Exploreru verze 5.5 nebo vyšší. Chcete vložit text bez vyčištění?",
UnknownToolbarItem	: "Neznámá položka panelu nástrojů \"%1\"",
UnknownCommand		: "Neznámý příkaz \"%1\"",
NotImplemented		: "Příkaz není implementován",
UnknownToolbarSet	: "Panel nástrojů \"%1\" neexistuje",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Storno",
DlgBtnClose			: "Zavřít",
DlgAdvancedTag		: "Rozšířené",

// General Dialogs Labels
DlgGenNotSet		: "&lt;nenastaveno&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Orientace jazyka",
DlgGenLangDirLtr	: "Zleva do prava (LTR)",
DlgGenLangDirRtl	: "Zprava do leva (RTL)",
DlgGenLangCode		: "Kód jazyka",
DlgGenAccessKey		: "Přístupový klíč",
DlgGenName			: "Jméno",
DlgGenTabIndex		: "Pořadí prvku",
DlgGenLongDescr		: "Dlouhý popis URL",
DlgGenClass			: "Třída stylu",
DlgGenTitle			: "Pomocný titulek",
DlgGenContType		: "Pomocný typ obsahu",
DlgGenLinkCharset	: "Přiřazená znaková sada",
DlgGenStyle			: "Styl",

// Image Dialog
DlgImgTitle			: "Vlastosti obrázku",
DlgImgInfoTab		: "Informace o obrázku",
DlgImgBtnUpload		: "Odeslat na server",
DlgImgURL			: "URL",
DlgImgUpload		: "Odeslat",
DlgImgBtnBrowse		: "Procházet server",
DlgImgAlt			: "Alternativní text",
DlgImgWidth			: "Šířka",
DlgImgHeight		: "Výška",
DlgImgLockRatio		: "Zámek",
DlgBtnResetSize		: "Původní velikost",
DlgImgBorder		: "Okraje",
DlgImgHSpace		: "H-mezera",
DlgImgVSpace		: "V-mezera",
DlgImgAlign			: "Zarovnání",
DlgImgAlignLeft		: "Vlevo",
DlgImgAlignAbsBottom: "Zcela dolů",
DlgImgAlignAbsMiddle: "Doprostřed",
DlgImgAlignBaseline	: "Na účaří",
DlgImgAlignBottom	: "Dolů",
DlgImgAlignMiddle	: "Na střed",
DlgImgAlignRight	: "Vpravo",
DlgImgAlignTextTop	: "Na horní okraj textu",
DlgImgAlignTop		: "Nahoru",
DlgImgPreview		: "Náhled",
DlgImgMsgWrongExt	: "Promiňte, na server je povoleno odesílat pouze tyto typy souborů:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nAkce přerušena.",
DlgImgAlertSelect	: "Vyberte prosím obrázek pro odeslání na server.",
DlgImgAlertUrl		: "Zadejte prosím URL obrázku",

// Link Dialog
DlgLnkWindowTitle	: "Odkaz",
DlgLnkInfoTab		: "Informace o odkazu",
DlgLnkTargetTab		: "Cíl",

DlgLnkType			: "Typ odkazu",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Kotva v této stránce",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protokol",
DlgLnkProtoOther	: "&lt;jiný&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Procházet server",
DlgLnkAnchorSel		: "Vybrat kotvu",
DlgLnkAnchorByName	: "Podle jména kotvy",
DlgLnkAnchorById	: "Podle Id objektu",
DlgLnkNoAnchors		: "&lt;Ve stránce žádná kotva není definována&gt;",
DlgLnkEMail			: "E-Mailová adresa",
DlgLnkEMailSubject	: "Předmět zprávy",
DlgLnkEMailBody		: "Tělo zprávy",
DlgLnkUpload		: "Odeslat",
DlgLnkBtnUpload		: "Odeslat na Server",

DlgLnkTarget		: "Cíl",
DlgLnkTargetFrame	: "&lt;rámec&gt;",
DlgLnkTargetPopup	: "&lt;vyskakovací okno&gt;",
DlgLnkTargetBlank	: "Nové okno (_blank)",
DlgLnkTargetParent	: "Rodičovské okno (_parent)",
DlgLnkTargetSelf	: "Stejné okno (_self)",
DlgLnkTargetTop		: "Hlavní okno (_top)",
DlgLnkTargetFrame	: "Název cílového rámce",
DlgLnkPopWinName	: "Název vyskakovacího okna",
DlgLnkPopWinFeat	: "Vlastnosti vyskakovacího okna",
DlgLnkPopResize		: "Měnitelná velikost",
DlgLnkPopLocation	: "Panel umístění",
DlgLnkPopMenu		: "Panel nabídky",
DlgLnkPopScroll		: "Posuvníky",
DlgLnkPopStatus		: "Stavový řádek",
DlgLnkPopToolbar	: "Panel nástrojů",
DlgLnkPopFullScrn	: "Celá obrazovka (IE)",
DlgLnkPopDependent	: "Závislost (Netscape)",
DlgLnkPopWidth		: "Šířka",
DlgLnkPopHeight		: "Výška",
DlgLnkPopLeft		: "Levý okraj",
DlgLnkPopTop		: "Horní okraj",

DlgLnkMsgWrongExtA	: "Promiňte, na server je povoleno odesílat pouze tyto typy souborů:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nAkce přerušena.",
DlgLnkMsgWrongExtD	: "Promiňte, tyto typy souborů nejsou povoleny odesílat na server:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nAkce přerušena.",

DlnLnkMsgNoUrl		: "Zadejte prosím URL odkazu",
DlnLnkMsgNoEMail	: "Zadejte prosím e-mailovou adresu",
DlnLnkMsgNoAnchor	: "Vyberte prosím kotvu",

// Color Dialog
DlgColorTitle		: "Výběr barvy",
DlgColorBtnClear	: "Vymazat",
DlgColorHighlight	: "Zvýrazněná",
DlgColorSelected	: "Vybraná",

// Smiley Dialog
DlgSmileyTitle		: "Vkládání smajlíků",

// Special Character Dialog
DlgSpecialCharTitle	: "Výběr speciálního znaku",

// Table Dialog
DlgTableTitle		: "Vlastnosti tabulky",
DlgTableRows		: "Řádky",
DlgTableColumns		: "Sloupce",
DlgTableBorder		: "Ohraničení",
DlgTableAlign		: "Zarovnání",
DlgTableAlignNotSet	: "<nenastaveno>",
DlgTableAlignLeft	: "Vlevo",
DlgTableAlignCenter	: "Na střed",
DlgTableAlignRight	: "Vpravo",
DlgTableWidth		: "Šířka",
DlgTableWidthPx		: "bodů",
DlgTableWidthPc		: "procent",
DlgTableHeight		: "Výška",
DlgTableCellSpace	: "Vzdálenost buněk",
DlgTableCellPad		: "Odsazení obsahu",
DlgTableCaption		: "Popis",

// Table Cell Dialog
DlgCellTitle		: "Vlastnosti buňky",
DlgCellWidth		: "Šířka",
DlgCellWidthPx		: "bodů",
DlgCellWidthPc		: "procent",
DlgCellHeight		: "Výška",
DlgCellWordWrap		: "Zalamování",
DlgCellWordWrapNotSet	: "<nenanstaveno>",
DlgCellWordWrapYes	: "Ano",
DlgCellWordWrapNo	: "Ne",
DlgCellHorAlign		: "Vodorovné zarovnání",
DlgCellHorAlignNotSet	: "<nenastaveno>",
DlgCellHorAlignLeft	: "Vlevo",
DlgCellHorAlignCenter	: "Na střed",
DlgCellHorAlignRight: "Vpravo",
DlgCellVerAlign		: "Svislé zarovnání",
DlgCellVerAlignNotSet	: "<nenastaveno>",
DlgCellVerAlignTop	: "Nahoru",
DlgCellVerAlignMiddle	: "Doprostřed",
DlgCellVerAlignBottom	: "Dolů",
DlgCellVerAlignBaseline	: "Na účaří",
DlgCellRowSpan		: "Sloučené řádky",
DlgCellCollSpan		: "Sloučené sloupce",
DlgCellBackColor	: "Barva pozadí",
DlgCellBorderColor	: "Rarva ohraničení",
DlgCellBtnSelect	: "Výběr...",

// Find Dialog
DlgFindTitle		: "Hledat",
DlgFindFindBtn		: "Hledat",
DlgFindNotFoundMsg	: "Hledaný text nebyl nalezen.",

// Replace Dialog
DlgReplaceTitle			: "Nahradit",
DlgReplaceFindLbl		: "Co hledat:",
DlgReplaceReplaceLbl	: "Čím nahradit:",
DlgReplaceCaseChk		: "Rozlišovat velikost písma",
DlgReplaceReplaceBtn	: "Nahradit",
DlgReplaceReplAllBtn	: "Nahradit vše",
DlgReplaceWordChk		: "Pouze celá slova",

// Paste Operations / Dialog
PasteErrorPaste	: "Bezpečnostní nastavení Vašeho prohlížeče nedovolují editoru spustit funkci pro vložení textu ze schránky. Prosím vložte text ze schránky pomocí klávesnice (Ctrl+V).",
PasteErrorCut	: "Bezpečnostní nastavení Vašeho prohlížeče nedovolují editoru spustit funkci pro vyjmutí zvoleného textu do schránky. Prosím vyjměte zvolený text do schránky pomocí klávesnice (Ctrl+X).",
PasteErrorCopy	: "Bezpečnostní nastavení Vašeho prohlížeče nedovolují editoru spustit funkci pro kopírování zvoleného textu do schránky. Prosím zkopírujte zvolený text do schránky pomocí klávesnice (Ctrl+C).",

PasteAsText		: "Vložit jako čistý text",
PasteFromWord	: "Vložit text z Wordu",

DlgPasteMsg		: "<STRONG>Bezpečnostní nastavení</STRONG> Vašeho prohlížeče nedovolují editoru spustit funkci pro vložení textu ze schránky.<BR>Text ze schránky prosím vložte pomocí klávesnice do tohoto pole (<STRONG>Ctrl+V</STRONG>) a pak stiskněte tlačítko <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automaticky",
ColorMoreColors	: "Více barev...",

// About Dialog
DlgAboutVersion	: "verze",
DlgAboutLicense	: "Licensed under the terms of the GNU Lesser General Public License",
DlgAboutInfo	: "Více informací získáte na"
}
