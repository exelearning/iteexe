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
 * File Name: zh-cn.js
 * 	Chinese Simplified language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 16:17:07
 * 
 * File Authors:
 * 		NetRube (NetRube@126.com)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "折叠工具栏",
ToolbarExpand		: "展开工具栏",

// Toolbar Items and Context Menu
Save				: "保存",
NewPage				: "新建",
Preview				: "预览",
Cut					: "剪切",
Copy				: "复制",
Paste				: "粘贴",
PasteText			: "粘贴为无格式文本",
PasteWord			: "从 MS Word 粘贴",
Print				: "打印",
SelectAll			: "全选",
RemoveFormat		: "清除格式",
InsertLinkLbl		: "超链接",
InsertLink			: "插入/编辑超链接",
RemoveLink			: "取消超链接",
InsertImageLbl		: "图象",
InsertImage			: "插入/编辑图象",
InsertTableLbl		: "表格",
InsertTable			: "插入/编辑表格",
InsertLineLbl		: "水平线",
InsertLine			: "插入水平线",
InsertSpecialCharLbl: "特殊符号",
InsertSpecialChar	: "插入特殊符号",
InsertSmileyLbl		: "图释",
InsertSmiley		: "插入图释",
About				: "关于 FCKeditor",
Bold				: "加粗",
Italic				: "倾斜",
Underline			: "下划线",
StrikeThrough		: "删除线",
Subscript			: "下标",
Superscript			: "上标",
LeftJustify			: "左对齐",
CenterJustify		: "居中对齐",
RightJustify		: "右对齐",
BlockJustify		: "两端对齐",
DecreaseIndent		: "减少缩进量",
IncreaseIndent		: "增加缩进量",
Undo				: "撤消",
Redo				: "重做",
NumberedListLbl		: "编号列表",
NumberedList		: "插入/删除编号列表",
BulletedListLbl		: "项目列表",
BulletedList		: "插入/删除项目列表",
ShowTableBorders	: "显示表格边框",
ShowDetails			: "显示详细资料",
Style				: "样式",
FontFormat			: "格式",
Font				: "字体",
FontSize			: "大小",
TextColor			: "文本颜色",
BGColor				: "背景颜色",
Source				: "代码",
Find				: "查找",
Replace				: "替换",

// Context Menu
EditLink			: "编辑超链接",
InsertRow			: "插入行",
DeleteRows			: "删除行",
InsertColumn		: "插入列",
DeleteColumns		: "删除列",
InsertCell			: "插入单元格",
DeleteCells			: "删除单元格",
MergeCells			: "合并单元格",
SplitCell			: "拆分单元格",
CellProperties		: "单元格属性",
TableProperties		: "表格属性",
ImageProperties		: "图象属性",

FontFormats			: "普通;带格式的;地址;标题 1;标题 2;标题 3;标题 4;标题 5;标题 6",

// Alerts and Messages
ProcessingXHTML		: "正在处理 XHTML，请稍等...",
Done				: "完成",
PasteWordConfirm	: "您要粘贴的内容好像是来自 MS Word，是否要清除 MS Word 格式后再粘贴？",
NotCompatiblePaste	: "该命令需要 Internet Explorer 5.5 或更高版本的支持，是否是否按常规粘贴进行？",
UnknownToolbarItem	: "未知工具栏项目 \"%1\"",
UnknownCommand		: "未知命令名称 \"%1\"",
NotImplemented		: "命令无法执行",
UnknownToolbarSet	: "工具栏设置 \"%1\" 不存在",

// Dialogs
DlgBtnOK			: "确定",
DlgBtnCancel		: "取消",
DlgBtnClose			: "关闭",
DlgAdvancedTag		: "高级",

// General Dialogs Labels
DlgGenNotSet		: "&lt;没有设置&gt;",
DlgGenId			: "ID",
DlgGenLangDir		: "语言方向",
DlgGenLangDirLtr	: "从左到右 (LTR)",
DlgGenLangDirRtl	: "从右到左 (RTL)",
DlgGenLangCode		: "语言编码",
DlgGenAccessKey		: "访问键",
DlgGenName			: "名称",
DlgGenTabIndex		: "Tab 键次序",
DlgGenLongDescr		: "详细说明地址",
DlgGenClass			: "类",
DlgGenTitle			: "标题",
DlgGenContType		: "类型",
DlgGenLinkCharset	: "编码",
DlgGenStyle			: "样式",

// Image Dialog
DlgImgTitle			: "图象属性",
DlgImgInfoTab		: "图象",
DlgImgBtnUpload		: "发送到服务器上",
DlgImgURL			: "源文件",
DlgImgUpload		: "上传",
DlgImgBtnBrowse		: "浏览服务器",
DlgImgAlt			: "替换文本",
DlgImgWidth			: "宽度",
DlgImgHeight		: "高度",
DlgImgLockRatio		: "锁定比例",
DlgBtnResetSize		: "恢复尺寸",
DlgImgBorder		: "边框",
DlgImgHSpace		: "水平间距",
DlgImgVSpace		: "垂直间距",
DlgImgAlign			: "对齐",
DlgImgAlignLeft		: "左对齐",
DlgImgAlignAbsBottom: "绝对底边",
DlgImgAlignAbsMiddle: "绝对居中",
DlgImgAlignBaseline	: "基线",
DlgImgAlignBottom	: "底边",
DlgImgAlignMiddle	: "居中",
DlgImgAlignRight	: "右对齐",
DlgImgAlignTextTop	: "文本上方",
DlgImgAlignTop		: "顶端",
DlgImgPreview		: "预览",
DlgImgMsgWrongExt	: "对不起，只能上传下列格式的文件：\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\n操作被取消。",
DlgImgAlertSelect	: "请选择要上传的图象",
DlgImgAlertUrl		: "请输入图象地址",

// Link Dialog
DlgLnkWindowTitle	: "超链接",
DlgLnkInfoTab		: "超链接信息",
DlgLnkTargetTab		: "目标",

DlgLnkType			: "超链接类型",
DlgLnkTypeURL		: "网址",
DlgLnkTypeAnchor	: "页内锚点链接",
DlgLnkTypeEMail		: "电子邮件",
DlgLnkProto			: "协议",
DlgLnkProtoOther	: "&lt;其它&gt;",
DlgLnkURL			: "地址",
DlgLnkBtnBrowse		: "浏览服务器",
DlgLnkAnchorSel		: "选择一个锚点",
DlgLnkAnchorByName	: "按锚点名称",
DlgLnkAnchorById	: "按锚点 ID",
DlgLnkNoAnchors		: "&lt;此文档没有可用的锚点&gt;",
DlgLnkEMail			: "地址",
DlgLnkEMailSubject	: "主题",
DlgLnkEMailBody		: "内容",
DlgLnkUpload		: "上传",
DlgLnkBtnUpload		: "发送到服务器上",

DlgLnkTarget		: "目标",
DlgLnkTargetFrame	: "&lt;框架&gt;",
DlgLnkTargetPopup	: "&lt;弹出窗口&gt;",
DlgLnkTargetBlank	: "新窗口 (_blank)",
DlgLnkTargetParent	: "父窗口 (_parent)",
DlgLnkTargetSelf	: "本窗口 (_self)",
DlgLnkTargetTop		: "整页 (_top)",
DlgLnkTargetFrame	: "目标框架名称",
DlgLnkPopWinName	: "弹出窗口名称",
DlgLnkPopWinFeat	: "弹出窗口属性",
DlgLnkPopResize		: "调整大小",
DlgLnkPopLocation	: "地址栏",
DlgLnkPopMenu		: "菜单栏",
DlgLnkPopScroll		: "滚动条",
DlgLnkPopStatus		: "状态栏",
DlgLnkPopToolbar	: "工具栏",
DlgLnkPopFullScrn	: "全屏 (IE)",
DlgLnkPopDependent	: "依附 (NS)",
DlgLnkPopWidth		: "宽",
DlgLnkPopHeight		: "高",
DlgLnkPopLeft		: "左",
DlgLnkPopTop		: "右",

DlgLnkMsgWrongExtA	: "对不起，只能上传下列格式的文件：\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\n操作被取消。",
DlgLnkMsgWrongExtD	: "对不起，下列格式的文件不允许上传：\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\n操作被取消。",

DlnLnkMsgNoUrl		: "请输入超链接地址",
DlnLnkMsgNoEMail	: "请输入电子邮件地址",
DlnLnkMsgNoAnchor	: "请选择一个锚点",

// Color Dialog
DlgColorTitle		: "选择颜色",
DlgColorBtnClear	: "清除",
DlgColorHighlight	: "预览",
DlgColorSelected	: "选择",

// Smiley Dialog
DlgSmileyTitle		: "插入一个图释",

// Special Character Dialog
DlgSpecialCharTitle	: "选择特殊符号",

// Table Dialog
DlgTableTitle		: "表格属性",
DlgTableRows		: "行数",
DlgTableColumns		: "列数",
DlgTableBorder		: "边框",
DlgTableAlign		: "对齐",
DlgTableAlignNotSet	: "<没有设置>",
DlgTableAlignLeft	: "左对齐",
DlgTableAlignCenter	: "居中",
DlgTableAlignRight	: "右对齐",
DlgTableWidth		: "宽度",
DlgTableWidthPx		: "像素",
DlgTableWidthPc		: "百分比",
DlgTableHeight		: "高度",
DlgTableCellSpace	: "间距",
DlgTableCellPad		: "边距",
DlgTableCaption		: "标题",

// Table Cell Dialog
DlgCellTitle		: "单元格属性",
DlgCellWidth		: "宽",
DlgCellWidthPx		: "像素",
DlgCellWidthPc		: "百分比",
DlgCellHeight		: "高",
DlgCellWordWrap		: "自动换行",
DlgCellWordWrapNotSet	: "<没有设置>",
DlgCellWordWrapYes	: "是",
DlgCellWordWrapNo	: "否",
DlgCellHorAlign		: "水平",
DlgCellHorAlignNotSet	: "<没有设置>",
DlgCellHorAlignLeft	: "左对齐",
DlgCellHorAlignCenter	: "居中",
DlgCellHorAlignRight: "右对齐",
DlgCellVerAlign		: "垂直",
DlgCellVerAlignNotSet	: "<没有设置>",
DlgCellVerAlignTop	: "顶端",
DlgCellVerAlignMiddle	: "居中",
DlgCellVerAlignBottom	: "底部",
DlgCellVerAlignBaseline	: "基线",
DlgCellRowSpan		: "跨行",
DlgCellCollSpan		: "跨列",
DlgCellBackColor	: "背景颜色",
DlgCellBorderColor	: "边框颜色",
DlgCellBtnSelect	: "选择...",

// Find Dialog
DlgFindTitle		: "查找",
DlgFindFindBtn		: "查找",
DlgFindNotFoundMsg	: "指定文本没有找到。",

// Replace Dialog
DlgReplaceTitle			: "替换",
DlgReplaceFindLbl		: "查找：",
DlgReplaceReplaceLbl	: "替换：",
DlgReplaceCaseChk		: "区分大小写",
DlgReplaceReplaceBtn	: "替换",
DlgReplaceReplAllBtn	: "全部替换",
DlgReplaceWordChk		: "全字匹配",

// Paste Operations / Dialog
PasteErrorPaste	: "您的浏览器安全设置不允许编辑器自动执行粘贴操作，请使用键盘快捷键(Ctrl+V)来完成。",
PasteErrorCut	: "您的浏览器安全设置不允许编辑器自动执行剪切操作，请使用键盘快捷键(Ctrl+X)来完成。",
PasteErrorCopy	: "您的浏览器安全设置不允许编辑器自动执行复制操作，请使用键盘快捷键(Ctrl+C)来完成。",

PasteAsText		: "粘贴为无格式文本",
PasteFromWord	: "从 MS Word 粘贴",

DlgPasteMsg		: "因为您的浏览器编辑器 <STRONG>安全设置</STRONG> 原因，不能自动执行粘贴。<BR>请使用键盘快捷键(<STRONG>Ctrl+V</STRONG>)粘贴到下面并按 <STRONG>确定</STRONG>。",

// Color Picker
ColorAutomatic	: "自动",
ColorMoreColors	: "其它颜色...",

// About Dialog
DlgAboutVersion	: "版本",
DlgAboutLicense	: "基于 GNU 通用公共许可证授权发布 ",
DlgAboutInfo	: "要获得更多信息请访问 "
}