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
 * File Name: sr.js
 * 	Serbian (Cyrillic) language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-26 02:03:06
 * 
 * File Authors:
 * 		Zoran Subić (zoran@tf.zr.ac.yu)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

// Toolbar Items and Context Menu
Save				: "Сачувај",
NewPage				: "Нова страница",
Preview				: "Изглед странице",
Cut					: "Исеци",
Copy				: "Копирај",
Paste				: "Залепи",
PasteText			: "Залепи као неформатиран текст",
PasteWord			: "Залепи из Worda",
Print				: "Штампа",
SelectAll			: "Означи све",
RemoveFormat		: "Уклони форматирање",
InsertLinkLbl		: "Линк",
InsertLink			: "Унеси/измени линк",
RemoveLink			: "Уклони линк",
InsertImageLbl		: "Слика",
InsertImage			: "Унеси/измени слику",
InsertTableLbl		: "Табела",
InsertTable			: "Унеси/измени табелу",
InsertLineLbl		: "Линија",
InsertLine			: "Унеси хоризонталну линију",
InsertSpecialCharLbl: "Специјални карактери",
InsertSpecialChar	: "Унеси специјални карактер",
InsertSmileyLbl		: "Смајли",
InsertSmiley		: "Унеси смајлија",
About				: "О ФЦКедитору",
Bold				: "Подебљано",
Italic				: "Курзив",
Underline			: "Подвучено",
StrikeThrough		: "Прецртано",
Subscript			: "Индекс",
Superscript			: "Степен",
LeftJustify			: "Лево равнање",
CenterJustify		: "Центриран текст",
RightJustify		: "Десно равнање",
BlockJustify		: "Обострано равнање",
DecreaseIndent		: "Смањи леву маргину",
IncreaseIndent		: "Увећај леву маргину",
Undo				: "Поништи акцију",
Redo				: "Понови акцију",
NumberedListLbl		: "Набројиву листу",
NumberedList		: "Унеси/уклони набројиву листу",
BulletedListLbl		: "Ненабројива листа",
BulletedList		: "Унеси/уклони ненабројиву листу",
ShowTableBorders	: "Прикажи оквир табеле",
ShowDetails			: "Прикажи детаље",
Style				: "Стил",
FontFormat			: "Формат",
Font				: "Фонт",
FontSize			: "Величина фонта",
TextColor			: "Боја текста",
BGColor				: "Боја позадине",
Source				: "K&ocirc;д",
Find				: "Претрага",
Replace				: "Замена",

// Context Menu
EditLink			: "Промени линк",
InsertRow			: "Унеси ред",
DeleteRows			: "Обриши редове",
InsertColumn		: "Унеси колону",
DeleteColumns		: "Обриши колоне",
InsertCell			: "Унеси ћелије",
DeleteCells			: "Обриши ћелије",
MergeCells			: "Спој ћелије",
SplitCell			: "Раздвоји ћелије",
CellProperties		: "Особине ћелије",
TableProperties		: "Особине табеле",
ImageProperties		: "Особине слике",

FontFormats			: "Normal;Formatirano;Adresa;Heading 1;Heading 2;Heading 3;Heading 4;Heading 5;Heading 6",

// Alerts and Messages
ProcessingXHTML		: "Обрађујем XHTML. Maлo стрпљења...",
Done				: "Завршио",
PasteWordConfirm	: "Текст који желите да налепите копиран је из Worda. Да ли желите да буде очишћен од формата пре лепљења?",
NotCompatiblePaste	: "Ова команда је доступна само за Интернет Екплорер од верзије 5.5. Да ли желите да налепим текст без чишћења?",
UnknownToolbarItem	: "Непозната ставка toolbara \"%1\"",
UnknownCommand		: "Непозната наредба \"%1\"",
NotImplemented		: "Наредба није имплементирана",
UnknownToolbarSet	: "Toolbar \"%1\" не постоји",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Oткажи",
DlgBtnClose			: "Затвори",
DlgAdvancedTag		: "Напредни тагови",

// General Dialogs Labels
DlgGenNotSet		: "&lt;није постављено&gt;",
DlgGenId			: "Ид",
DlgGenLangDir		: "Смер језика",
DlgGenLangDirLtr	: "С лева на десно (LTR)",
DlgGenLangDirRtl	: "С десна на лево (RTL)",
DlgGenLangCode		: "K&ocirc;д језика",
DlgGenAccessKey		: "Приступни тастер",
DlgGenName			: "Назив",
DlgGenTabIndex		: "Таб индекс",
DlgGenLongDescr		: "Пун опис УРЛ",
DlgGenClass			: "Stylesheet класе",
DlgGenTitle			: "Advisory наслов",
DlgGenContType		: "Advisory врста садржаја",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Стил",

// Image Dialog
DlgImgTitle			: "Особине слика",
DlgImgInfoTab		: "Инфо слике",
DlgImgBtnUpload		: "Пошаљи на сервер",
DlgImgURL			: "УРЛ",
DlgImgUpload		: "Пошаљи",
DlgImgBtnBrowse		: "Претражи сервер",
DlgImgAlt			: "Алтернативни текст",
DlgImgWidth			: "Ширина",
DlgImgHeight		: "Висина",
DlgImgLockRatio		: "Закључај однос",
DlgBtnResetSize		: "Ресетуј величину",
DlgImgBorder		: "Оквир",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Равнање",
DlgImgAlignLeft		: "Лево",
DlgImgAlignAbsBottom: "Abs доле",
DlgImgAlignAbsMiddle: "Abs средина",
DlgImgAlignBaseline	: "Базно",
DlgImgAlignBottom	: "Доле",
DlgImgAlignMiddle	: "Средина",
DlgImgAlignRight	: "Десно",
DlgImgAlignTextTop	: "Врх текста",
DlgImgAlignTop		: "Врх",
DlgImgPreview		: "Изглед",
DlgImgMsgWrongExt	: "Дозвољено је слање само следећих врста датотека::\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nОперација је отказана.",
DlgImgAlertSelect	: "Одаберите слику за слање.",
DlgImgAlertUrl		: "Унесите УРЛ слике",

// Link Dialog
DlgLnkWindowTitle	: "Линк",
DlgLnkInfoTab		: "Линк инфо",
DlgLnkTargetTab		: "Мета",

DlgLnkType			: "Врста линка",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Сидро на овој странициц",
DlgLnkTypeEMail		: "Eлектронска пошта",
DlgLnkProto			: "Протокол",
DlgLnkProtoOther	: "&lt;друго&gt;",
DlgLnkURL			: "УРЛ",
DlgLnkBtnBrowse		: "Претражи сервер",
DlgLnkAnchorSel		: "Одабери сидро",
DlgLnkAnchorByName	: "По називу сидра",
DlgLnkAnchorById	: "Пo Ид-jу елемента",
DlgLnkNoAnchors		: "&lt;Нема доступних сидра&gt;",
DlgLnkEMail			: "Адреса електронске поште",
DlgLnkEMailSubject	: "Наслов",
DlgLnkEMailBody		: "Садржај поруке",
DlgLnkUpload		: "Пошаљи",
DlgLnkBtnUpload		: "Пошаљи на сервер",

DlgLnkTarget		: "Meтa",
DlgLnkTargetFrame	: "&lt;оквир&gt;",
DlgLnkTargetPopup	: "&lt;искачући прозор&gt;",
DlgLnkTargetBlank	: "Нови прозор (_blank)",
DlgLnkTargetParent	: "Родитељски прозор (_parent)",
DlgLnkTargetSelf	: "Исти прозор (_self)",
DlgLnkTargetTop		: "Прозор на врху (_top)",
DlgLnkTargetFrame	: "Оквир (фрејм)",
DlgLnkPopWinName	: "Назив искачућег прозора",
DlgLnkPopWinFeat	: "Могућности искачућег прозора",
DlgLnkPopResize		: "Променљива величина",
DlgLnkPopLocation	: "Локација",
DlgLnkPopMenu		: "Контекстни мени",
DlgLnkPopScroll		: "Скрол бар",
DlgLnkPopStatus		: "Статусна линија",
DlgLnkPopToolbar	: "Toolbar",
DlgLnkPopFullScrn	: "Приказ преко целог екрана (ИE)",
DlgLnkPopDependent	: "Зависно (Netscape)",
DlgLnkPopWidth		: "Ширина",
DlgLnkPopHeight		: "Висина",
DlgLnkPopLeft		: "Од леве ивице екрана (пиксела)",
DlgLnkPopTop		: "Од врха екрана (пиксела)",

DlgLnkMsgWrongExtA	: "Дозвољено је слање само следећих датотека:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nОперација је отказана.",
DlgLnkMsgWrongExtD	: "Slanje sledećih vrsta datoteka nije dozvoljeno:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nОперација је отказана.",

// Color Dialog
DlgColorTitle		: "Одаберите боју",
DlgColorBtnClear	: "Обриши",
DlgColorHighlight	: "Посветли",
DlgColorSelected	: "Одабери",

// Smiley Dialog
DlgSmileyTitle		: "Унеси смајлија",

// Special Character Dialog
DlgSpecialCharTitle	: "Одаберите специјални карактер",

// Table Dialog
DlgTableTitle		: "Особине табеле",
DlgTableRows		: "Редова",
DlgTableColumns		: "Kолона",
DlgTableBorder		: "Величина оквира",
DlgTableAlign		: "Равнање",
DlgTableAlignNotSet	: "<није постављено>",
DlgTableAlignLeft	: "Лево",
DlgTableAlignCenter	: "Средина",
DlgTableAlignRight	: "Десно",
DlgTableWidth		: "Ширина",
DlgTableWidthPx		: "пиксела",
DlgTableWidthPc		: "процената",
DlgTableHeight		: "Висина",
DlgTableCellSpace	: "Ћелијски простор",
DlgTableCellPad		: "Размак ћелија",
DlgTableCaption		: "Наслов табеле",

// Table Cell Dialog
DlgCellTitle		: "Особине ћелије",
DlgCellWidth		: "Ширина",
DlgCellWidthPx		: "пиксела",
DlgCellWidthPc		: "процената",
DlgCellHeight		: "Висина",
DlgCellWordWrap		: "Дељење речи",
DlgCellWordWrapNotSet	: "<није постављено>",
DlgCellWordWrapYes	: "Да",
DlgCellWordWrapNo	: "Не",
DlgCellHorAlign		: "Водоравно равнање",
DlgCellHorAlignNotSet	: "<није постављено>",
DlgCellHorAlignLeft	: "Лево",
DlgCellHorAlignCenter	: "Средина",
DlgCellHorAlignRight	: "Десно",
DlgCellVerAlign		: "Вертикално равнање",
DlgCellVerAlignNotSet	: "<није постављено>",
DlgCellVerAlignTop	: "Горње",
DlgCellVerAlignMiddle	: "Средина",
DlgCellVerAlignBottom	: "Доње",
DlgCellVerAlignBaseline	: "Базно",
DlgCellRowSpan		: "Спајање редова",
DlgCellCollSpan		: "Спајање колона",
DlgCellBackColor	: "Боја позадине",
DlgCellBorderColor	: "Боја оквира",
DlgCellBtnSelect	: "Oдабери...",

// Find Dialog
DlgFindTitle		: "Пронађи",
DlgFindFindBtn		: "Пронађи",
DlgFindNotFoundMsg	: "Тражени текст није пронађен.",

// Replace Dialog
DlgReplaceTitle		: "Замени",
DlgReplaceFindLbl	: "Пронађи:",
DlgReplaceReplaceLbl	: "Замени са:",
DlgReplaceCaseChk	: "Разликуј велика и мала слова",
DlgReplaceReplaceBtn	: "Замени",
DlgReplaceReplAllBtn	: "Замени све",
DlgReplaceWordChk	: "Упореди целе речи",

// Paste Operations / Dialog
PasteErrorPaste	: "Сигурносна подешавања Вашег претраживача не дозвољавају операције аутоматског лепљења текста. Молимо Вас да користите пречицу са тастатуре (Ctrl+V).",
PasteErrorCut	: "Сигурносна подешавања Вашег претраживача не дозвољавају операције аутоматског исецања текста. Молимо Вас да користите пречицу са тастатуре (Ctrl+X).",
PasteErrorCopy	: "Сигурносна подешавања Вашег претраживача не дозвољавају операције аутоматског копирања текста. Молимо Вас да користите пречицу са тастатуре (Ctrl+C).",

PasteAsText		: "Залепи као чист текст",
PasteFromWord		: "Залепи из Worda",

DlgPasteMsg		: "Едитор није могао да изврши аутоматско лепљење због <STRONG>сигурносних поставки</STRONG> Вашег претраживача.<BR>Молимо да залепите садржај унутар следеће површине користећи тастатурну пречицу (<STRONG>Ctrl+V</STRONG>), a затим кликните на <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Аутоматски",
ColorMoreColors	: "Више боја...",

// About Dialog
DlgAboutVersion	: "верзија",
DlgAboutLicense	: "Лиценцирано под условима GNU Lesser General Public License",
DlgAboutInfo	: "За више информација посетите"
}