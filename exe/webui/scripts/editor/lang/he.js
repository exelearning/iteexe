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
 * File Name: he.js
 * 	Hebrew language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-26 13:01:45
 * 
 * File Authors:
 * 		Ophir Radnitz (ophir@liqweed.net)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "rtl",

ToolbarCollapse		: "כיווץ סרגל הכלים",
ToolbarExpand		: "פתיחת סרגל הכלים",

// Toolbar Items and Context Menu
Save				: "שמירה",
NewPage				: "דף חדש",
Preview				: "תצוגה מקדימה",
Cut					: "גזירה",
Copy				: "העתקה",
Paste				: "הדבקה",
PasteText			: "הדבקה כטקסט פשוט",
PasteWord			: "הדבקה מ-Word",
Print				: "הדפסה",
SelectAll			: "בחירת הכל",
RemoveFormat		: "הסרת העיצוב",
InsertLinkLbl		: "קישור",
InsertLink			: "הוספת/עריכת קישור",
RemoveLink			: "הסרת הקישור",
InsertImageLbl		: "תמונה",
InsertImage			: "הוספת/עריכת תמונה",
InsertTableLbl		: "טבלה",
InsertTable			: "הוספת/עריכת טבלה",
InsertLineLbl		: "קו",
InsertLine			: "הוספת קו אופקי",
InsertSpecialCharLbl: "תו מיוחד",
InsertSpecialChar	: "הוספת תו מיוחד",
InsertSmileyLbl		: "סמיילי",
InsertSmiley		: "הוספת סמיילי",
About				: "אודות FCKeditor",
Bold				: "מודגש",
Italic				: "נטוי",
Underline			: "קו תחתון",
StrikeThrough		: "כתיב מחוק",
Subscript			: "כתיב תחתון",
Superscript			: "כתיב עליון",
LeftJustify			: "יישור לשמאל",
CenterJustify		: "מרכוז",
RightJustify		: "יישור לימין",
BlockJustify		: "יישור לשוליים",
DecreaseIndent		: "הקטנת אינדנטציה",
IncreaseIndent		: "הגדלת אינדנטציה",
Undo				: "ביטול צעד אחרון",
Redo				: "חזרה על צעד אחרון",
NumberedListLbl		: "רשימה ממוספרת",
NumberedList		: "הוספת/הסרת רשימה ממוספרת",
BulletedListLbl		: "רשימת נקודות",
BulletedList		: "הוספת/הסרת רשימת נקודות",
ShowTableBorders	: "הצגת מסגרת הטבלה",
ShowDetails			: "הצגת פרטים",
Style				: "סגנון",
FontFormat			: "עיצוב",
Font				: "גופן",
FontSize			: "גודל",
TextColor			: "צבע טקסט",
BGColor				: "צבע רקע",
Source				: "מקור",
Find				: "חיפוש",
Replace				: "החלפה",

// Context Menu
EditLink			: "עריכת קישור",
InsertRow			: "הוספת שורה",
DeleteRows			: "מחיקת שורות",
InsertColumn		: "הוספת עמודה",
DeleteColumns		: "מחיקת עמודות",
InsertCell			: "הוספת תא",
DeleteCells			: "מחיקת תאים",
MergeCells			: "מיזוג תאים",
SplitCell			: "פיצול תאים",
CellProperties		: "תכונות התא",
TableProperties		: "תכונות הטבלה",
ImageProperties		: "תכונות התמונה",

FontFormats			: "נורמלי;קוד;כתובת;כותרת;כותרת 2;כותרת 3;כותרת 4;כותרת 5;כותרת 6",

// Alerts and Messages
ProcessingXHTML		: "מעבד XHTML, נא להמתין...",
Done				: "המשימה הושלמה",
PasteWordConfirm	: "נראה הטקסט שבכוונתך להדביק מקורו בקובץ Word. האם ברצונך לנקות אותו טרם ההדבקה?",
NotCompatiblePaste	: "פעולה זו זמינה לדפדפן Internet Explorer מגירסא 5.5 ומעלה. האם להמשיך בהדבקה ללא הניקוי?",
UnknownToolbarItem	: "פריט לא ידוע בסרגל הכלים \"%1\"",
UnknownCommand		: "שם פעולה לא ידוע \"%1\"",
NotImplemented		: "הפקודה לא מיושמת",
UnknownToolbarSet	: "ערכת סרגל הכלים \"%1\" לא קיימת",

// Dialogs
DlgBtnOK			: "אישור",
DlgBtnCancel		: "ביטול",
DlgBtnClose			: "סגירה",
DlgAdvancedTag		: "אפשרויות מתקדמות",

// General Dialogs Labels
DlgGenNotSet		: "&lt;לא נקבע&gt;",
DlgGenId			: "זיהוי (Id)",
DlgGenLangDir		: "כיוון שפה",
DlgGenLangDirLtr	: "שמאל לימין (LTR)",
DlgGenLangDirRtl	: "ימין לשמאל (RTL)",
DlgGenLangCode		: "קוד שפה",
DlgGenAccessKey		: "מקש גישה",
DlgGenName			: "שם",
DlgGenTabIndex		: "מספר טאב",
DlgGenLongDescr		: "קישור לתיאור מפורט",
DlgGenClass			: "Stylesheet Classes",
DlgGenTitle			: "כותרת מוצעת",
DlgGenContType		: "Content Type מוצע",
DlgGenLinkCharset	: "קידוד המשאב המקושר",
DlgGenStyle			: "סגנון",

// Image Dialog
DlgImgTitle			: "תכונות התמונה",
DlgImgInfoTab		: "מידע על התמונה",
DlgImgBtnUpload		: "שליחה לשרת",
DlgImgURL			: "כתובת (URL)",
DlgImgUpload		: "העלאה",
DlgImgBtnBrowse		: "דפדוף בשרת",
DlgImgAlt			: "טקסט חלופי",
DlgImgWidth			: "רוחב",
DlgImgHeight		: "גובה",
DlgImgLockRatio		: "נעילת היחס",
DlgBtnResetSize		: "איפוס הגודל",
DlgImgBorder		: "מסגרת",
DlgImgHSpace		: "מרווח אופקי",
DlgImgVSpace		: "מרווח אנכי",
DlgImgAlign			: "יישור",
DlgImgAlignLeft		: "לשמאל",
DlgImgAlignAbsBottom: "לתחתית האבסולוטית",
DlgImgAlignAbsMiddle: "מרכוז אבסולוטי",
DlgImgAlignBaseline	: "לקו התחתית",
DlgImgAlignBottom	: "לתחתית",
DlgImgAlignMiddle	: "לאמצע",
DlgImgAlignRight	: "לימין",
DlgImgAlignTextTop	: "לראש הטקסט",
DlgImgAlignTop		: "למעלה",
DlgImgPreview		: "תצוגה מקדימה",
DlgImgMsgWrongExt	: "מצטערים, אך טיפוסי הקבצים היחידים אותם ניתן להעלות הם:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nהפעולה בוטלה.",
DlgImgAlertSelect	: "נא לבחור תמונה להעלאה.",
DlgImgAlertUrl		: "נא להקליד את כתובת התמונה",

// Link Dialog
DlgLnkWindowTitle	: "קישור",
DlgLnkInfoTab		: "מידע על הקישור",
DlgLnkTargetTab		: "מטרה",

DlgLnkType			: "סוג קישור",
DlgLnkTypeURL		: "כתובת (URL)",
DlgLnkTypeAnchor	: "עוגן בעמוד זה",
DlgLnkTypeEMail		: "דוא''ל",
DlgLnkProto			: "פרוטוקול",
DlgLnkProtoOther	: "&lt;אחר&gt;",
DlgLnkURL			: "כתובת (URL)",
DlgLnkBtnBrowse		: "דפדוף בשרת",
DlgLnkAnchorSel		: "בחירת עוגן",
DlgLnkAnchorByName	: "עפ''י שם העוגן",
DlgLnkAnchorById	: "עפ''י זיהוי (Id) הרכיב",
DlgLnkNoAnchors		: "&lt;אין עוגנים זמינים בדף&gt;",
DlgLnkEMail			: "כתובת הדוא''ל",
DlgLnkEMailSubject	: "נושא ההודעה",
DlgLnkEMailBody		: "גוף ההודעה",
DlgLnkUpload		: "העלאה",
DlgLnkBtnUpload		: "שליחה לשרת",

DlgLnkTarget		: "מטרה",
DlgLnkTargetFrame	: "&lt;frame&gt;",
DlgLnkTargetPopup	: "&lt;חלון קופץ&gt;",
DlgLnkTargetBlank	: "חלון חדש (_blank)",
DlgLnkTargetParent	: "חלון האב (_parent)",
DlgLnkTargetSelf	: "באותו החלון (_self)",
DlgLnkTargetTop		: "חלון ראשי (_top)",
DlgLnkTargetFrame	: "Frame בשם מסויים",
DlgLnkPopWinName	: "שם החלון הקופץ",
DlgLnkPopWinFeat	: "תכונות החלון הקופץ",
DlgLnkPopResize		: "בעל גודל ניתן לשינוי",
DlgLnkPopLocation	: "סרגל כתובת",
DlgLnkPopMenu		: "סרגל תפריט",
DlgLnkPopScroll		: "ניתן לגלילה",
DlgLnkPopStatus		: "סרגל חיווי",
DlgLnkPopToolbar	: "סרגל הכלים",
DlgLnkPopFullScrn	: "מסך מלא (IE)",
DlgLnkPopDependent	: "תלוי (Netscape)",
DlgLnkPopWidth		: "רוחב",
DlgLnkPopHeight		: "גובה",
DlgLnkPopLeft		: "מיקום צד שמאל",
DlgLnkPopTop		: "מיקום צד עליון",

DlgLnkMsgWrongExtA	: "מצטערים, אך טיפוסי הקבצים היחידים אותם ניתן להעלות הם:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nהפעולה בוטלה.",
DlgLnkMsgWrongExtD	: "מצטערים, אך את טיפוסי הקבצים הבאים לא ניתן להעלות:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nהפעולה בוטלה.",

DlnLnkMsgNoUrl		: "נא להקליד את כתובת הקישור (URL)",
DlnLnkMsgNoEMail	: "נא להקליד את כתובת הדוא''ל",
DlnLnkMsgNoAnchor	: "נא לבחור עוגן במסמך",

// Color Dialog
DlgColorTitle		: "בחירת צבע",
DlgColorBtnClear	: "איפוס",
DlgColorHighlight	: "נוכחי",
DlgColorSelected	: "נבחר",

// Smiley Dialog
DlgSmileyTitle		: "הוספת סמיילי",

// Special Character Dialog
DlgSpecialCharTitle	: "בחירת תו מיוחד",

// Table Dialog
DlgTableTitle		: "תכונות טבלה",
DlgTableRows		: "שורות",
DlgTableColumns		: "עמודות",
DlgTableBorder		: "גודל מסגרת",
DlgTableAlign		: "יישור",
DlgTableAlignNotSet	: "<לא נקבע>",
DlgTableAlignLeft	: "שמאל",
DlgTableAlignCenter	: "מרכז",
DlgTableAlignRight	: "ימין",
DlgTableWidth		: "רוחב",
DlgTableWidthPx		: "פיקסלים",
DlgTableWidthPc		: "אחוז",
DlgTableHeight		: "גובה",
DlgTableCellSpace	: "מרווח תא",
DlgTableCellPad		: "ריפוד תא",
DlgTableCaption		: "כיתוב",

// Table Cell Dialog
DlgCellTitle		: "תכונות תא",
DlgCellWidth		: "רוחב",
DlgCellWidthPx		: "פיקסלים",
DlgCellWidthPc		: "אחוז",
DlgCellHeight		: "גובה",
DlgCellWordWrap		: "גלילת שורות",
DlgCellWordWrapNotSet	: "<לא נקבע>",
DlgCellWordWrapYes	: "כן",
DlgCellWordWrapNo	: "לא",
DlgCellHorAlign		: "יישור אופקי",
DlgCellHorAlignNotSet	: "<לא נקבע>",
DlgCellHorAlignLeft	: "שמאל",
DlgCellHorAlignCenter	: "מרכז",
DlgCellHorAlignRight: "ימין",
DlgCellVerAlign		: "יישור אנכי",
DlgCellVerAlignNotSet	: "<לא נקבע>",
DlgCellVerAlignTop	: "למעלה",
DlgCellVerAlignMiddle	: "לאמצע",
DlgCellVerAlignBottom	: "לתחתית",
DlgCellVerAlignBaseline	: "קו תחתית",
DlgCellRowSpan		: "טווח שורות",
DlgCellCollSpan		: "טווח עמודות",
DlgCellBackColor	: "צבע רקע",
DlgCellBorderColor	: "צבע מסגרת",
DlgCellBtnSelect	: "בחירה...",

// Find Dialog
DlgFindTitle		: "חיפוש",
DlgFindFindBtn		: "חיפוש",
DlgFindNotFoundMsg	: "הטקסט המבוקש לא נמצא.",

// Replace Dialog
DlgReplaceTitle			: "החלפה",
DlgReplaceFindLbl		: "חיפוש מחרוזת:",
DlgReplaceReplaceLbl	: "החלפה במחרוזת:",
DlgReplaceCaseChk		: "התאמת סוג אותיות (Case)",
DlgReplaceReplaceBtn	: "החלפה",
DlgReplaceReplAllBtn	: "החלפה בכל העמוד",
DlgReplaceWordChk		: "התאמה למילה המלאה",

// Paste Operations / Dialog
PasteErrorPaste	: "הגדרות האבטחה בדפדפן שלך לא מאפשרות לעורך לבצע פעולות הדבקה אוטומטיות. יש להשתמש במקלדת לשם כך (Ctrl+V).",
PasteErrorCut	: "הגדרות האבטחה בדפדפן שלך לא מאפשרות לעורך לבצע פעולות גזירה  אוטומטיות. יש להשתמש במקלדת לשם כך (Ctrl+X).",
PasteErrorCopy	: "הגדרות האבטחה בדפדפן שלך לא מאפשרות לעורך לבצע פעולות העתקה אוטומטיות. יש להשתמש במקלדת לשם כך (Ctrl+C).",

PasteAsText		: "הדבקה כטקסט פשוט",
PasteFromWord	: "הדבקה מ-Word",

DlgPasteMsg		: "העורך לא הצליח לבצע הדבקה אוטומטית בגלל<STRONG>הגדרות האבטחה</STRONG> של הדפדפן שלך.<BR>נא להדביק לתוך התיבה הבאה באמצעות המקלדת (<STRONG>Ctrl+V</STRONG>) וללחוץ על <STRONG>אישור</STRONG>.",

// Color Picker
ColorAutomatic	: "אוטומטי",
ColorMoreColors	: "צבעים נוספים...",

// About Dialog
DlgAboutVersion	: "גירסא",
DlgAboutLicense	: "ברשיון תחת תנאי GNU Lesser General Public License",
DlgAboutInfo	: "מידע נוסף ניתן למצוא כאן:"
}