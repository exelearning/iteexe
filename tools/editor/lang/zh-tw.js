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
 * File Name: zh-tw.js
 * 	Chinese Traditional (Taiwan) language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 16:15:49
 * 
 * File Authors:
 * 		NetRube (NetRube@126.com)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "折疊工具欄",
ToolbarExpand		: "展開工具欄",

// Toolbar Items and Context Menu
Save				: "保存",
NewPage				: "新建",
Preview				: "預覽",
Cut					: "剪切",
Copy				: "複製",
Paste				: "粘貼",
PasteText			: "粘貼為無格式文本",
PasteWord			: "從 MS Word 粘貼",
Print				: "列印",
SelectAll			: "全選",
RemoveFormat		: "清除格式",
InsertLinkLbl		: "超鏈結",
InsertLink			: "插入/編輯超鏈結",
RemoveLink			: "取消超鏈結",
InsertImageLbl		: "圖像",
InsertImage			: "插入/編輯圖像",
InsertTableLbl		: "表格",
InsertTable			: "插入/編輯表格",
InsertLineLbl		: "水平線",
InsertLine			: "插入水平線",
InsertSpecialCharLbl: "特殊符號",
InsertSpecialChar	: "插入特殊符號",
InsertSmileyLbl		: "圖釋",
InsertSmiley		: "插入圖釋",
About				: "關於 FCKeditor",
Bold				: "加粗",
Italic				: "傾斜",
Underline			: "下劃線",
StrikeThrough		: "刪除線",
Subscript			: "下標",
Superscript			: "上標",
LeftJustify			: "左對齊",
CenterJustify		: "居中對齊",
RightJustify		: "右對齊",
BlockJustify		: "兩端對齊",
DecreaseIndent		: "減少縮進量",
IncreaseIndent		: "增加縮進量",
Undo				: "撤銷",
Redo				: "重做",
NumberedListLbl		: "編號列表",
NumberedList		: "插入/刪除編號列表",
BulletedListLbl		: "項目列表",
BulletedList		: "插入/刪除項目列表",
ShowTableBorders	: "顯示表格邊框",
ShowDetails			: "顯示詳細資料",
Style				: "樣式",
FontFormat			: "格式",
Font				: "字體",
FontSize			: "大小",
TextColor			: "文本顏色",
BGColor				: "背景顏色",
Source				: "代碼",
Find				: "查找",
Replace				: "替換",

// Context Menu
EditLink			: "編輯超鏈結",
InsertRow			: "插入行",
DeleteRows			: "刪除行",
InsertColumn		: "插入列",
DeleteColumns		: "刪除列",
InsertCell			: "插入單格",
DeleteCells			: "刪除單格",
MergeCells			: "合併單格",
SplitCell			: "拆分單格",
CellProperties		: "單格屬性",
TableProperties		: "表格屬性",
ImageProperties		: "圖像屬性",

FontFormats			: "普通;帶格式的;地址;標題 1;標題 2;標題 3;標題 4;標題 5;標題 6",

// Alerts and Messages
ProcessingXHTML		: "正在處理 XHTML，請稍等...",
Done				: "完成",
PasteWordConfirm	: "您要粘貼的內容好像是來自 MS Word，是否要清除 MS Word 格式後再粘貼？",
NotCompatiblePaste	: "該命令需要 Internet Explorer 5.5 或更高版本的支持，是否是否按常規粘貼進行？",
UnknownToolbarItem	: "未知工具欄項目 \"%1\"",
UnknownCommand		: "未知命令名稱 \"%1\"",
NotImplemented		: "命令無法執行",
UnknownToolbarSet	: "工具欄設置 \"%1\" 不存在",

// Dialogs
DlgBtnOK			: "確定",
DlgBtnCancel		: "取消",
DlgBtnClose			: "關閉",
DlgAdvancedTag		: "高級",

// General Dialogs Labels
DlgGenNotSet		: "&lt;沒有設置&gt;",
DlgGenId			: "ID",
DlgGenLangDir		: "語言方向",
DlgGenLangDirLtr	: "從左到右 (LTR)",
DlgGenLangDirRtl	: "從右到左 (RTL)",
DlgGenLangCode		: "語言編碼",
DlgGenAccessKey		: "訪問鍵",
DlgGenName			: "名稱",
DlgGenTabIndex		: "Tab 鍵次序",
DlgGenLongDescr		: "詳細說明地址",
DlgGenClass			: "類",
DlgGenTitle			: "標題",
DlgGenContType		: "類型",
DlgGenLinkCharset	: "編碼",
DlgGenStyle			: "樣式",

// Image Dialog
DlgImgTitle			: "圖像屬性",
DlgImgInfoTab		: "圖像",
DlgImgBtnUpload		: "發送到伺服器上",
DlgImgURL			: "原始檔案",
DlgImgUpload		: "上傳",
DlgImgBtnBrowse		: "流覽伺服器",
DlgImgAlt			: "替換文本",
DlgImgWidth			: "寬度",
DlgImgHeight		: "高度",
DlgImgLockRatio		: "鎖定比例",
DlgBtnResetSize		: "恢復尺寸",
DlgImgBorder		: "邊框",
DlgImgHSpace		: "水準間距",
DlgImgVSpace		: "垂直間距",
DlgImgAlign			: "對齊",
DlgImgAlignLeft		: "左對齊",
DlgImgAlignAbsBottom: "絕對底邊",
DlgImgAlignAbsMiddle: "絕對居中",
DlgImgAlignBaseline	: "基線",
DlgImgAlignBottom	: "底邊",
DlgImgAlignMiddle	: "居中",
DlgImgAlignRight	: "右對齊",
DlgImgAlignTextTop	: "文本上方",
DlgImgAlignTop		: "頂端",
DlgImgPreview		: "預覽",
DlgImgMsgWrongExt	: "對不起，只能上傳下列格式的檔：\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\n操作被取消。",
DlgImgAlertSelect	: "請選擇要上傳的圖像",
DlgImgAlertUrl		: "請輸入圖像位址",

// Link Dialog
DlgLnkWindowTitle	: "超鏈結",
DlgLnkInfoTab		: "超鏈結資訊",
DlgLnkTargetTab		: "目標",

DlgLnkType			: "超鏈結類型",
DlgLnkTypeURL		: "網址",
DlgLnkTypeAnchor	: "頁內錨點鏈結",
DlgLnkTypeEMail		: "電子郵件",
DlgLnkProto			: "協議",
DlgLnkProtoOther	: "&lt;其他&gt;",
DlgLnkURL			: "地址",
DlgLnkBtnBrowse		: "流覽伺服器",
DlgLnkAnchorSel		: "選擇一個錨點",
DlgLnkAnchorByName	: "按錨點名稱",
DlgLnkAnchorById	: "按錨點 ID",
DlgLnkNoAnchors		: "&lt;此文檔沒有可用的錨點&gt;",
DlgLnkEMail			: "地址",
DlgLnkEMailSubject	: "主題",
DlgLnkEMailBody		: "內容",
DlgLnkUpload		: "上傳",
DlgLnkBtnUpload		: "發送到伺服器上",

DlgLnkTarget		: "目標",
DlgLnkTargetFrame	: "&lt;框架&gt;",
DlgLnkTargetPopup	: "&lt;彈出窗口&gt;",
DlgLnkTargetBlank	: "新窗口 (_blank)",
DlgLnkTargetParent	: "父窗口 (_parent)",
DlgLnkTargetSelf	: "本窗口 (_self)",
DlgLnkTargetTop		: "整頁 (_top)",
DlgLnkTargetFrame	: "目標框架名稱",
DlgLnkPopWinName	: "彈出窗口名稱",
DlgLnkPopWinFeat	: "彈出視窗屬性",
DlgLnkPopResize		: "調整大小",
DlgLnkPopLocation	: "地址欄",
DlgLnkPopMenu		: "菜單欄",
DlgLnkPopScroll		: "捲軸",
DlgLnkPopStatus		: "狀態欄",
DlgLnkPopToolbar	: "工具欄",
DlgLnkPopFullScrn	: "全屏 (IE)",
DlgLnkPopDependent	: "依附 (NS)",
DlgLnkPopWidth		: "寬",
DlgLnkPopHeight		: "高",
DlgLnkPopLeft		: "左",
DlgLnkPopTop		: "右",

DlgLnkMsgWrongExtA	: "對不起，只能上傳下列格式的檔：\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\n操作被取消。",
DlgLnkMsgWrongExtD	: "對不起，下列格式的檔不允許上傳：\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\n操作被取消。",

DlnLnkMsgNoUrl		: "請輸入超鏈結位址",
DlnLnkMsgNoEMail	: "請輸入電子郵件位址",
DlnLnkMsgNoAnchor	: "請選擇一個錨點",

// Color Dialog
DlgColorTitle		: "選擇顏色",
DlgColorBtnClear	: "清除",
DlgColorHighlight	: "預覽",
DlgColorSelected	: "選擇",

// Smiley Dialog
DlgSmileyTitle		: "插入一個圖釋",

// Special Character Dialog
DlgSpecialCharTitle	: "選擇特殊符號",

// Table Dialog
DlgTableTitle		: "表格屬性",
DlgTableRows		: "行數",
DlgTableColumns		: "列數",
DlgTableBorder		: "邊框",
DlgTableAlign		: "對齊",
DlgTableAlignNotSet	: "<沒有設置>",
DlgTableAlignLeft	: "左對齊",
DlgTableAlignCenter	: "居中",
DlgTableAlignRight	: "右對齊",
DlgTableWidth		: "寬度",
DlgTableWidthPx		: "圖元",
DlgTableWidthPc		: "百分比",
DlgTableHeight		: "高度",
DlgTableCellSpace	: "間距",
DlgTableCellPad		: "邊距",
DlgTableCaption		: "標題",

// Table Cell Dialog
DlgCellTitle		: "單格屬性",
DlgCellWidth		: "寬",
DlgCellWidthPx		: "圖元",
DlgCellWidthPc		: "百分比",
DlgCellHeight		: "高",
DlgCellWordWrap		: "自動換行",
DlgCellWordWrapNotSet	: "<沒有設置>",
DlgCellWordWrapYes	: "是",
DlgCellWordWrapNo	: "否",
DlgCellHorAlign		: "水準",
DlgCellHorAlignNotSet	: "<沒有設置>",
DlgCellHorAlignLeft	: "左對齊",
DlgCellHorAlignCenter	: "居中",
DlgCellHorAlignRight: "右對齊",
DlgCellVerAlign		: "垂直",
DlgCellVerAlignNotSet	: "<沒有設置>",
DlgCellVerAlignTop	: "頂端",
DlgCellVerAlignMiddle	: "居中",
DlgCellVerAlignBottom	: "底部",
DlgCellVerAlignBaseline	: "基線",
DlgCellRowSpan		: "跨行",
DlgCellCollSpan		: "跨列",
DlgCellBackColor	: "背景顏色",
DlgCellBorderColor	: "邊框顏色",
DlgCellBtnSelect	: "選擇...",

// Find Dialog
DlgFindTitle		: "查找",
DlgFindFindBtn		: "查找",
DlgFindNotFoundMsg	: "指定文本沒有找到。",

// Replace Dialog
DlgReplaceTitle			: "替換",
DlgReplaceFindLbl		: "查找：",
DlgReplaceReplaceLbl	: "替換：",
DlgReplaceCaseChk		: "區分大小寫",
DlgReplaceReplaceBtn	: "替換",
DlgReplaceReplAllBtn	: "全部替換",
DlgReplaceWordChk		: "全字匹配",

// Paste Operations / Dialog
PasteErrorPaste	: "您的流覽器安全設置不允許編輯器自動執行粘貼操作，請使用鍵盤快捷鍵(Ctrl+V)來完成。",
PasteErrorCut	: "您的流覽器安全設置不允許編輯器自動執行剪切操作，請使用鍵盤快捷鍵(Ctrl+X)來完成。",
PasteErrorCopy	: "您的流覽器安全設置不允許編輯器自動執行複製操作，請使用鍵盤快捷鍵(Ctrl+C)來完成。",

PasteAsText		: "粘貼為無格式文本",
PasteFromWord	: "從 MS Word 粘貼",

DlgPasteMsg		: "因為您的流覽器編輯器 <STRONG>安全設置</STRONG> 原因，不能自動執行粘貼。<BR>請使用鍵盤快捷鍵(<STRONG>Ctrl+V</STRONG>)粘貼到下面並按 <STRONG>確定</STRONG>。",

// Color Picker
ColorAutomatic	: "自動",
ColorMoreColors	: "其他顏色...",

// About Dialog
DlgAboutVersion	: "版本",
DlgAboutLicense	: "基於 GNU 通用公共許可證授權發佈 ",
DlgAboutInfo	: "要獲得更多資訊請訪問 "
}