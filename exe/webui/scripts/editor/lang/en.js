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
 * File Name: en.js
 * 	English language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-19 23:51:20
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Collapse Toolbar",
ToolbarExpand		: "Expand Toolbar",

// Toolbar Items and Context Menu
Save				: "Save",
NewPage				: "New Page",
Preview				: "Preview",
Cut					: "Cut",
Copy				: "Copy",
Paste				: "Paste",
PasteText			: "Paste as plain text",
PasteWord			: "Paste from Word",
Print				: "Print",
SelectAll			: "Select All",
RemoveFormat		: "Remove Format",
InsertLinkLbl		: "Link",
InsertLink			: "Insert/Edit Link",
RemoveLink			: "Remove Link",
InsertImageLbl		: "Image",
InsertImage			: "Insert/Edit Image",
InsertTableLbl		: "Table",
InsertTable			: "Insert/Edit Table",
InsertLineLbl		: "Line",
InsertLine			: "Insert Horizontal Line",
InsertSpecialCharLbl: "Special Char",
InsertSpecialChar	: "Insert Special Character",
InsertSmileyLbl		: "Smiley",
InsertSmiley		: "Insert Smiley",
About				: "About FCKeditor",
Bold				: "Bold",
Italic				: "Italic",
Underline			: "Underline",
StrikeThrough		: "Strike Through",
Subscript			: "Subscript",
Superscript			: "Superscript",
LeftJustify			: "Left Justify",
CenterJustify		: "Center Justify",
RightJustify		: "Right Justify",
BlockJustify		: "Block Justify",
DecreaseIndent		: "Decrease Indent",
IncreaseIndent		: "Increase Indent",
Undo				: "Undo",
Redo				: "Redo",
NumberedListLbl		: "Numbered List",
NumberedList		: "Insert/Remove Numbered List",
BulletedListLbl		: "Bulleted List",
BulletedList		: "Insert/Remove Bulleted List",
ShowTableBorders	: "Show Table Borders",
ShowDetails			: "Show Details",
Style				: "Style",
FontFormat			: "Format",
Font				: "Font",
FontSize			: "Size",
TextColor			: "Text Color",
BGColor				: "Background Color",
Source				: "Source",
Find				: "Find",
Replace				: "Replace",

// Context Menu
EditLink			: "Edit Link",
InsertRow			: "Insert Row",
DeleteRows			: "Delete Rows",
InsertColumn		: "Insert Column",
DeleteColumns		: "Delete Columns",
InsertCell			: "Insert Cell",
DeleteCells			: "Delete Cells",
MergeCells			: "Merge Cells",
SplitCell			: "Split Cell",
CellProperties		: "Cell Properties",
TableProperties		: "Table Properties",
ImageProperties		: "Image Properties",

FontFormats			: "Normal;Formatted;Address;Heading 1;Heading 2;Heading 3;Heading 4;Heading 5;Heading 6;Paragraph (DIV)",	// 2.0: The last entry has been added.

// Alerts and Messages
ProcessingXHTML		: "Processing XHTML. Please wait...",
Done				: "Done",
PasteWordConfirm	: "The text you want to paste seems to be copied from Word. Do you want to clean it before pasting?",
NotCompatiblePaste	: "This command is available for Internet Explorer version 5.5 or more. Do you want to paste without cleaning?",
UnknownToolbarItem	: "Unknown toolbar item \"%1\"",
UnknownCommand		: "Unknown command name \"%1\"",
NotImplemented		: "Command not implemented",
UnknownToolbarSet	: "Toolbar set \"%1\" doesn't exist",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Cancel",
DlgBtnClose			: "Close",
DlgAdvancedTag		: "Advanced",

// General Dialogs Labels
DlgGenNotSet		: "&lt;not set&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Language Direction",
DlgGenLangDirLtr	: "Left to Right (LTR)",
DlgGenLangDirRtl	: "Right to Left (RTL)",
DlgGenLangCode		: "Language Code",
DlgGenAccessKey		: "Access Key",
DlgGenName			: "Name",
DlgGenTabIndex		: "Tab Index",
DlgGenLongDescr		: "Long Description URL",
DlgGenClass			: "Stylesheet Classes",
DlgGenTitle			: "Advisory Title",
DlgGenContType		: "Advisory Content Type",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Style",

// Image Dialog
DlgImgTitle			: "Image Properties",
DlgImgInfoTab		: "Image Info",
DlgImgBtnUpload		: "Send it to the Server",
DlgImgURL			: "URL",
DlgImgUpload		: "Upload",
DlgImgBtnBrowse		: "Browse Server",
DlgImgAlt			: "Alternative Text",
DlgImgWidth			: "Width",
DlgImgHeight		: "Height",
DlgImgLockRatio		: "Lock Ratio",
DlgBtnResetSize		: "Reset Size",
DlgImgBorder		: "Border",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Align",
DlgImgAlignLeft		: "Left",
DlgImgAlignAbsBottom: "Abs Bottom",
DlgImgAlignAbsMiddle: "Abs Middle",
DlgImgAlignBaseline	: "Baseline",
DlgImgAlignBottom	: "Bottom",
DlgImgAlignMiddle	: "Middle",
DlgImgAlignRight	: "Right",
DlgImgAlignTextTop	: "Text Top",
DlgImgAlignTop		: "Top",
DlgImgPreview		: "Preview",
DlgImgMsgWrongExt	: "Sorry, only the following file types uploads are allowed:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperation canceled.",
DlgImgAlertSelect	: "Please select an image to upload.",
DlgImgAlertUrl		: "Please type the image URL",

// Link Dialog
DlgLnkWindowTitle	: "Link",
DlgLnkInfoTab		: "Link Info",
DlgLnkTargetTab		: "Target",

DlgLnkType			: "Link Type",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Anchor in this page",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protocol",
DlgLnkProtoOther	: "&lt;other&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Browse Server",
DlgLnkAnchorSel		: "Select an Anchor",
DlgLnkAnchorByName	: "By Anchor Name",
DlgLnkAnchorById	: "By Element Id",
DlgLnkNoAnchors		: "&lt;No anchors available in the document&gt;",
DlgLnkEMail			: "E-Mail Address",
DlgLnkEMailSubject	: "Message Subject",
DlgLnkEMailBody		: "Message Body",
DlgLnkUpload		: "Upload",
DlgLnkBtnUpload		: "Send it to the Server",

DlgLnkTarget		: "Target",
DlgLnkTargetFrame	: "&lt;frame&gt;",
DlgLnkTargetPopup	: "&lt;popup window&gt;",
DlgLnkTargetBlank	: "New Window (_blank)",
DlgLnkTargetParent	: "Parent Window (_parent)",
DlgLnkTargetSelf	: "Same Window (_self)",
DlgLnkTargetTop		: "Topmost Window (_top)",
DlgLnkTargetFrame	: "Target Frame Name",
DlgLnkPopWinName	: "Popup Window Name",
DlgLnkPopWinFeat	: "Popup Window Features",
DlgLnkPopResize		: "Resizable",
DlgLnkPopLocation	: "Location Bar",
DlgLnkPopMenu		: "Menu Bar",
DlgLnkPopScroll		: "Scroll Bars",
DlgLnkPopStatus		: "Status Bar",
DlgLnkPopToolbar	: "Toolbar",
DlgLnkPopFullScrn	: "Full Screen (IE)",
DlgLnkPopDependent	: "Dependent (Netscape)",
DlgLnkPopWidth		: "Width",
DlgLnkPopHeight		: "Height",
DlgLnkPopLeft		: "Left Position",
DlgLnkPopTop		: "Top Position",

DlgLnkMsgWrongExtA	: "Sorry, only the following file types uploads are allowed:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperation canceled.",
DlgLnkMsgWrongExtD	: "Sorry, the following file types uploads are not allowed:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperation canceled.",

DlnLnkMsgNoUrl		: "Please type the link URL",
DlnLnkMsgNoEMail	: "Please type the e-mail address",
DlnLnkMsgNoAnchor	: "Please select an anchor",

// Color Dialog
DlgColorTitle		: "Select Color",
DlgColorBtnClear	: "Clear",
DlgColorHighlight	: "Highlight",
DlgColorSelected	: "Selected",

// Smiley Dialog
DlgSmileyTitle		: "Insert a Smiley",

// Special Character Dialog
DlgSpecialCharTitle	: "Select Special Character",

// Table Dialog
DlgTableTitle		: "Table Properties",
DlgTableRows		: "Rows",
DlgTableColumns		: "Columns",
DlgTableBorder		: "Border size",
DlgTableAlign		: "Alignment",
DlgTableAlignNotSet	: "<Not set>",
DlgTableAlignLeft	: "Left",
DlgTableAlignCenter	: "Center",
DlgTableAlignRight	: "Right",
DlgTableWidth		: "Width",
DlgTableWidthPx		: "pixels",
DlgTableWidthPc		: "percent",
DlgTableHeight		: "Height",
DlgTableCellSpace	: "Cell spacing",
DlgTableCellPad		: "Cell padding",
DlgTableCaption		: "Caption",

// Table Cell Dialog
DlgCellTitle		: "Cell Properties",
DlgCellWidth		: "Width",
DlgCellWidthPx		: "pixels",
DlgCellWidthPc		: "percent",
DlgCellHeight		: "Height",
DlgCellWordWrap		: "Word Wrap",
DlgCellWordWrapNotSet	: "&lt;Not set&gt;",
DlgCellWordWrapYes	: "Yes",
DlgCellWordWrapNo	: "No",
DlgCellHorAlign		: "Horizontal Alignment",
DlgCellHorAlignNotSet	: "&lt;Not set&gt;",
DlgCellHorAlignLeft	: "Left",
DlgCellHorAlignCenter	: "Center",
DlgCellHorAlignRight: "Right",
DlgCellVerAlign		: "Vertical Alignment",
DlgCellVerAlignNotSet	: "&lt;Not set&gt;",
DlgCellVerAlignTop	: "Top",
DlgCellVerAlignMiddle	: "Middle",
DlgCellVerAlignBottom	: "Bottom",
DlgCellVerAlignBaseline	: "Baseline",
DlgCellRowSpan		: "Rows Span",
DlgCellCollSpan		: "Columns Span",
DlgCellBackColor	: "Background Color",
DlgCellBorderColor	: "Border Color",
DlgCellBtnSelect	: "Select...",

// Find Dialog
DlgFindTitle		: "Find",
DlgFindFindBtn		: "Find",
DlgFindNotFoundMsg	: "The specified text was not found.",

// Replace Dialog
DlgReplaceTitle			: "Replace",
DlgReplaceFindLbl		: "Find what:",
DlgReplaceReplaceLbl	: "Replace with:",
DlgReplaceCaseChk		: "Match case",
DlgReplaceReplaceBtn	: "Replace",
DlgReplaceReplAllBtn	: "Replace All",
DlgReplaceWordChk		: "Match whole word",

// Paste Operations / Dialog
PasteErrorPaste	: "Your browser security settings don't permit the editor to automaticaly execute pasting operations. Please use the keyboard for that (Ctrl+V).",
PasteErrorCut	: "Your browser security settings don't permit the editor to automaticaly execute cutting operations. Please use the keyboard for that (Ctrl+X).",
PasteErrorCopy	: "Your browser security settings don't permit the editor to automaticaly execute copying operations. Please use the keyboard for that (Ctrl+C).",

PasteAsText		: "Paste as Plain Text",
PasteFromWord	: "Paste from Word",

DlgPasteMsg		: "The editor was not able to automaticaly execute pasting because of the <STRONG>security settings</STRONG> of your browser.<BR>Please paste inside the following box using the keyboard (<STRONG>Ctrl+V</STRONG>) and hit <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatic",
ColorMoreColors	: "More Colors...",

// About Dialog
DlgAboutVersion	: "version",
DlgAboutLicense	: "Licensed under the terms of the GNU Lesser General Public License",
DlgAboutInfo	: "For further information go to"
}