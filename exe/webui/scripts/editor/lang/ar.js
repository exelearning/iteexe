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
 * File Name: ar.js
 * 	Arabic language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-24 23:37:18
 * 
 * File Authors:
 * 		Abdul-Aziz Abdul-Kareem Al-Oraij (http://aziz.oraij.com)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "rtl",

ToolbarCollapse		: "ضم شريط الأدوات",
ToolbarExpand		: "تمدد شريط الأدوات",

// Toolbar Items and Context Menu
Save				: "حفظ",
NewPage				: "صفحة جديدة",
Preview				: "معاينة الصفحة",
Cut					: "قص",
Copy				: "نسخ",
Paste				: "لصق",
PasteText			: "لصق كنص بسيط",
PasteWord			: "لصق من وورد",
Print				: "طباعة",
SelectAll			: "تحديد الكل",
RemoveFormat		: "إزالة التنسيقات",
InsertLinkLbl		: "رابط",
InsertLink			: "إدراج/تحرير رابط",
RemoveLink			: "إزالة رابط",
InsertImageLbl		: "صورة",
InsertImage			: "إدراج/تحرير صورة",
InsertTableLbl		: "جدول",
InsertTable			: "إدراج/تحرير جدول",
InsertLineLbl		: "خط فاصل",
InsertLine			: "إدراج خط فاصل",
InsertSpecialCharLbl: "رموز",
InsertSpecialChar	: "إدراج  رموز..ِ",
InsertSmileyLbl		: "ابتسامات",
InsertSmiley		: "إدراج ابتسامات",
About				: "حول FCKeditor",
Bold				: "غامق",
Italic				: "مائل",
Underline			: "تسطير",
StrikeThrough		: "يتوسطه خط",
Subscript			: "منخفض",
Superscript			: "مرتفع",
LeftJustify			: "محاذاة إلى اليسار",
CenterJustify		: "توسيط",
RightJustify		: "محاذاة إلى اليمين",
BlockJustify		: "ضبط",
DecreaseIndent		: "إنقاص المسافة البادئة",
IncreaseIndent		: "زيادة المسافة البادئة",
Undo				: "تراجع",
Redo				: "إعادة",
NumberedListLbl		: "تعداد رقمي",
NumberedList		: "إدراج/إلغاء تعداد رقمي",
BulletedListLbl		: "تعداد نقطي",
BulletedList		: "إدراج/إلغاء تعداد نقطي",
ShowTableBorders	: "معاينة حدود الجداول",
ShowDetails			: "معاينة التفاصيل",
Style				: "نمط",
FontFormat			: "تنسيق",
Font				: "خط",
FontSize			: "حجم الخط",
TextColor			: "لون النص",
BGColor				: "لون الخلفية",
Source				: "شفرة المصدر",
Find				: "بحث",
Replace				: "استبدال",

// Context Menu
EditLink			: "تحرير رابط",
InsertRow			: "إدراج صف",
DeleteRows			: "حذف صفوف",
InsertColumn		: "إدراج عمود",
DeleteColumns		: "حذف أعمدة",
InsertCell			: "إدراج خلية",
DeleteCells			: "حذف خلايا",
MergeCells			: "دمج خلايا",
SplitCell			: "تقسيم خلية",
CellProperties		: "خصائص الخلية",
TableProperties		: "خصائص الجدول",
ImageProperties		: "خصائص الصورة",

FontFormats			: "عادي;منسّق;دوس;العنوان 1;العنوان  2;العنوان  3;العنوان  4;العنوان  5;العنوان  6",

// Alerts and Messages
ProcessingXHTML		: "انتظر قليلاً ريثما تتم   معالَجة‏ XHTML. لن يستغرق طويلاً...",
Done				: "تم",
PasteWordConfirm	: "يبدو أن النص المراد لصقه منسوخ من برنامج وورد. هل تود تنظيفه قبل الشروع في عملية اللصق؟",
NotCompatiblePaste	: "هذه الميزة تحتاج لمتصفح من النوعInternet Explorer إصدار 5.5 فما فوق. هل تود اللصق دون تنظيف الكود؟",
UnknownToolbarItem	: "عنصر شريط أدوات غير معروف \"%1\"",
UnknownCommand		: "أمر غير معروف \"%1\"",
NotImplemented		: "لم يتم دعم هذا الأمر",
UnknownToolbarSet	: "لم أتمكن من العثور على طقم الأدوات \"%1\" ",

// Dialogs
DlgBtnOK			: "موافق",
DlgBtnCancel		: "إلغاء الأمر",
DlgBtnClose			: "إغلاق",
DlgAdvancedTag		: "متقدم",

// General Dialogs Labels
DlgGenNotSet		: "&lt;بدون تحديد&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "اتجاه النص",
DlgGenLangDirLtr	: "اليسار لليمين (LTR)",
DlgGenLangDirRtl	: "اليمين لليسار (RTL)",
DlgGenLangCode		: "رمز اللغة",
DlgGenAccessKey		: "مفاتيح الاختصار",
DlgGenName			: "الاسم",
DlgGenTabIndex		: "الترتيب",
DlgGenLongDescr		: "عنوان الوصف المفصّل",
DlgGenClass			: "فئات التنسيق",
DlgGenTitle			: "تلميح الشاشة",
DlgGenContType		: "نوع التلميح",
DlgGenLinkCharset	: "ترميز المادة المرطلوبة",
DlgGenStyle			: "نمط",

// Image Dialog
DlgImgTitle			: "خصائص الصورة",
DlgImgInfoTab		: "معلومات الصورة",
DlgImgBtnUpload		: "أرسلها للخادم",
DlgImgURL			: "موقع الصورة",
DlgImgUpload		: "رفع",
DlgImgBtnBrowse		: "تصفح صور الموقع",
DlgImgAlt			: "الوصف",
DlgImgWidth			: "العرض",
DlgImgHeight		: "الارتفاع",
DlgImgLockRatio		: "تناسق الحجم",
DlgBtnResetSize		: "استعادة الحجم الأصلي",
DlgImgBorder		: "سمك الحدود",
DlgImgHSpace		: "تباعد أفقي",
DlgImgVSpace		: "تباعد عمودي",
DlgImgAlign			: "محاذاة",
DlgImgAlignLeft		: "يسار",
DlgImgAlignAbsBottom: "أسفل النص",
DlgImgAlignAbsMiddle: "وسط السطر",
DlgImgAlignBaseline	: "على السطر",
DlgImgAlignBottom	: "أسفل",
DlgImgAlignMiddle	: "وسط",
DlgImgAlignRight	: "يمين",
DlgImgAlignTextTop	: "أعلى النص",
DlgImgAlignTop		: "أعلى",
DlgImgPreview		: "معاينة",
DlgImgMsgWrongExt	: "عفواً، لا يسمح برفع الملفات غير المطابقة لأنواع الملفات التالية:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\n تم تجاهل العملية.",
DlgImgAlertSelect	: "فضلاً اختر صورة ليتم رفعها.",
DlgImgAlertUrl		: "فضلاً اكتب الموقع الذي توجد عليه هذه الصورة.",

// Link Dialog
DlgLnkWindowTitle	: "ارتباط تشعبي",
DlgLnkInfoTab		: "معلومات الرابط",
DlgLnkTargetTab		: "الهدف",

DlgLnkType			: "نوع الربط",
DlgLnkTypeURL		: "العنوان",
DlgLnkTypeAnchor	: "مكان في هذا المستند",
DlgLnkTypeEMail		: "بريد إلكتروني",
DlgLnkProto			: "البروتوكول",
DlgLnkProtoOther	: "&lt;أخرى&gt;",
DlgLnkURL			: "الموقع",
DlgLnkBtnBrowse		: "تصفح الموقع",
DlgLnkAnchorSel		: "اختر علامة مرجعية",
DlgLnkAnchorByName	: "حسب اسم العلامة",
DlgLnkAnchorById	: "حسب تعريف العنصر",
DlgLnkNoAnchors		: "&lt;لا يوجد علامات مرجعية في هذا المستند&gt;",
DlgLnkEMail			: "عنوان بريد إلكتروني",
DlgLnkEMailSubject	: "موضوع الرسالة",
DlgLnkEMailBody		: "محتوى الرسالة",
DlgLnkUpload		: "رفع",
DlgLnkBtnUpload		: "أرسلها للخادم",

DlgLnkTarget		: "الهدف",
DlgLnkTargetFrame	: "&lt;إطار&gt;",
DlgLnkTargetPopup	: "&lt;نافذة منبثقة&gt;",
DlgLnkTargetBlank	: "إطار جديد (_blank)",
DlgLnkTargetParent	: "الإطار الأصل (_parent)",
DlgLnkTargetSelf	: "نفس الإطار (_self)",
DlgLnkTargetTop		: "صفحة كاملة (_top)",
DlgLnkTargetFrame	: "اسم الإطار المستهدف",
DlgLnkPopWinName	: "تسمية النافذة المنبثقة",
DlgLnkPopWinFeat	: "خصائص النافذة المنبثقة",
DlgLnkPopResize		: "قابلة للتحجيم",
DlgLnkPopLocation	: "شريط العنوان",
DlgLnkPopMenu		: "القوائم الرئيسية",
DlgLnkPopScroll		: "أشرطة التمرير",
DlgLnkPopStatus		: "شريط الحالة السفلي",
DlgLnkPopToolbar	: "شريط الأدوات",
DlgLnkPopFullScrn	: "ملئ الشاشة (IE)",
DlgLnkPopDependent	: "تابع (Netscape)",
DlgLnkPopWidth		: "العرض",
DlgLnkPopHeight		: "الارتفاع",
DlgLnkPopLeft		: "التمركز لليسار",
DlgLnkPopTop		: "التمركز للأعلى",

DlgLnkMsgWrongExtA	: "عفواً، لا يسمح برفع الملفات غير المطابقة لأنواع الملفات التالية:\n\n"  + FCKConfig.LinkUploadAllowedExtensions + "\n\n تم تجاهل العملية.",
DlgLnkMsgWrongExtD	: "عفواً، لا يسمح برفع الملفات ذات أنواع الملفات التالية:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\n تم تجاهل العملية.",

DlnLnkMsgNoUrl		: "فضلاً أدخل عنوان الموقع الذي يشير إليه الرابط",
DlnLnkMsgNoEMail	: "فضلاً أدخل عنوان البريد الإلكتروني",
DlnLnkMsgNoAnchor	: "فضلاً حدد العلامة المرجعية المرغوبة",

// Color Dialog
DlgColorTitle		: "اختر لوناً",
DlgColorBtnClear	: "مسح",
DlgColorHighlight	: "تحديد",
DlgColorSelected	: "اختيار",

// Smiley Dialog
DlgSmileyTitle		: "إدراج ابتسامات ",

// Special Character Dialog
DlgSpecialCharTitle	: "إدراج رمز",

// Table Dialog
DlgTableTitle		: "إدراج جدول",
DlgTableRows		: "صفوف",
DlgTableColumns		: "أعمدة",
DlgTableBorder		: "سمك الحدود",
DlgTableAlign		: "المحاذاة",
DlgTableAlignNotSet	: "<بدون تحديد>",
DlgTableAlignLeft	: "يسار",
DlgTableAlignCenter	: "وسط",
DlgTableAlignRight	: "يمين",
DlgTableWidth		: "العرض",
DlgTableWidthPx		: "بكسل",
DlgTableWidthPc		: "بالمئة",
DlgTableHeight		: "الارتفاع",
DlgTableCellSpace	: "تباعد الخلايا",
DlgTableCellPad		: "المسافة البادئة",
DlgTableCaption		: "الوصف",

// Table Cell Dialog
DlgCellTitle		: "خصائص الخلية",
DlgCellWidth		: "العرض",
DlgCellWidthPx		: "بكسل",
DlgCellWidthPc		: "بالمئة",
DlgCellHeight		: "الارتفاع",
DlgCellWordWrap		: "التفاف النص",
DlgCellWordWrapNotSet	: "<بدون تحديد>",
DlgCellWordWrapYes	: "نعم",
DlgCellWordWrapNo	: "لا",
DlgCellHorAlign		: "المحاذاة الأفقية",
DlgCellHorAlignNotSet	: "<بدون تحديد>",
DlgCellHorAlignLeft	: "يسار",
DlgCellHorAlignCenter	: "وسط",
DlgCellHorAlignRight: "يمين",
DlgCellVerAlign		: "المحاذاة العمودية",
DlgCellVerAlignNotSet	: "<بدون تحديد>",
DlgCellVerAlignTop	: "أعلى",
DlgCellVerAlignMiddle	: "وسط",
DlgCellVerAlignBottom	: "أسفل",
DlgCellVerAlignBaseline	: "على السطر",
DlgCellRowSpan		: "امتداد الصفوف",
DlgCellCollSpan		: "امتداد الأعمدة",
DlgCellBackColor	: "لون الخلفية",
DlgCellBorderColor	: "لون الحدود",
DlgCellBtnSelect	: "حدّد...",

// Find Dialog
DlgFindTitle		: "بحث",
DlgFindFindBtn		: "ابحث",
DlgFindNotFoundMsg	: "لم يتم العثور على النص المحدد.",

// Replace Dialog
DlgReplaceTitle			: "استبدال",
DlgReplaceFindLbl		: "البحث عن:",
DlgReplaceReplaceLbl	: "استبدال بـ:",
DlgReplaceCaseChk		: "مطابقة حالة الأحرف",
DlgReplaceReplaceBtn	: "استبدال",
DlgReplaceReplAllBtn	: "استبدال الكل",
DlgReplaceWordChk		: "الكلمة بالكامل فقط",

// Paste Operations / Dialog
PasteErrorPaste	: "الإعدادات الأمنية للمتصفح الذي تستخدمه تمنع اللصق التلقائي. فضلاً استخدم لوحة المفاتيح لفعل ذلك (Ctrl+V).",
PasteErrorCut	: "الإعدادات الأمنية للمتصفح الذي تستخدمه تمنع القص التلقائي. فضلاً استخدم لوحة المفاتيح لفعل ذلك (Ctrl+X).",
PasteErrorCopy	: "الإعدادات الأمنية للمتصفح الذي تستخدمه تمنع النسخ التلقائي. فضلاً استخدم لوحة المفاتيح لفعل ذلك (Ctrl+C).",

PasteAsText		: "لصق كنص بسيط",
PasteFromWord	: "لصق من وورد",

DlgPasteMsg		: "لم يتمكن المحرر من القيام باللصق تلقائياً، نظراً <STRONG>لإعدادت متصفحك الأمنية</STRONG>.<BR>فضلاً إلصق داخل المربع التالي باستخدام لوحة المفاتيح (<STRONG>Ctrl+V</STRONG>) ثم اضغط <STRONG>موافق</STRONG>.",

// Color Picker
ColorAutomatic	: "تلقائي",
ColorMoreColors	: "ألوان إضافية...",

// About Dialog
DlgAboutVersion	: "الإصدار",
DlgAboutLicense	: "مرخّص بحسب قانون  GNU LGPL",
DlgAboutInfo	: "لمزيد من المعلومات تفضل بزيارة"
}