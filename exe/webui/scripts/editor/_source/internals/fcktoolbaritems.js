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
 * File Name: fcktoolbaritems.js
 * 	Toolbar items definitions.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-23 19:42:05
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKToolbarItems = new Object() ;
FCKToolbarItems.LoadedItems = new Object() ;

FCKToolbarItems.RegisterItem = function( itemName, item )
{
	this.LoadedItems[ itemName ] = item ;
}

FCKToolbarItems.GetItem = function( itemName )
{
	var oItem = FCKToolbarItems.LoadedItems[ itemName ] ;
	
	if ( oItem )
		return oItem ;

	switch ( itemName )
	{
		case 'Source'			: oItem = new FCKToolbarButton( 'Source'	, FCKLang.Source, null, FCK_TOOLBARITEM_ICONTEXT, true ) ; break ;
		case 'Save'				: oItem = new FCKToolbarButton( 'Save'		, FCKLang.Save, null, null, true  ) ; break ;
		case 'NewPage'			: oItem = new FCKToolbarButton( 'NewPage'	, FCKLang.NewPage, null, null, true  ) ; break ;
		case 'Preview'			: oItem = new FCKToolbarButton( 'Preview'	, FCKLang.Preview, null, null, true  ) ; break ;
		case 'About'			: oItem = new FCKToolbarButton( 'About'		, FCKLang.About ) ; break ;

		case 'Cut'				: oItem = new FCKToolbarButton( 'Cut'		, FCKLang.Cut, null, null, true ) ; break ;
		case 'Copy'				: oItem = new FCKToolbarButton( 'Copy'		, FCKLang.Copy, null, null, true ) ; break ;
		case 'Paste'			: oItem = new FCKToolbarButton( 'Paste'		, FCKLang.Paste, null, null, true ) ; break ;
		case 'PasteText'		: oItem = new FCKToolbarButton( 'PasteText'	, FCKLang.PasteText ) ; break ;
		case 'PasteWord'		: oItem = new FCKToolbarButton( 'PasteWord'	, FCKLang.PasteWord ) ; break ;
		case 'Print'			: oItem = new FCKToolbarButton( 'Print'		, FCKLang.Print, null, null, true ) ; break ;
		case 'Undo'				: oItem = new FCKToolbarButton( 'Undo'		, FCKLang.Undo, null, null, true ) ; break ;
		case 'Redo'				: oItem = new FCKToolbarButton( 'Redo'		, FCKLang.Redo, null, null, true ) ; break ;
		case 'SelectAll'		: oItem = new FCKToolbarButton( 'SelectAll'	, FCKLang.SelectAll, null, null, true ) ; break ;
		case 'RemoveFormat'		: oItem = new FCKToolbarButton( 'RemoveFormat', FCKLang.RemoveFormat ) ; break ;

		case 'Bold'				: oItem = new FCKToolbarButton( 'Bold'		, FCKLang.Bold ) ; break ;
		case 'Italic'			: oItem = new FCKToolbarButton( 'Italic'	, FCKLang.Italic ) ; break ;
		case 'Underline'		: oItem = new FCKToolbarButton( 'Underline'	, FCKLang.Underline ) ; break ;
		case 'StrikeThrough'	: oItem = new FCKToolbarButton( 'StrikeThrough'	, FCKLang.StrikeThrough ) ; break ;
		case 'Subscript'		: oItem = new FCKToolbarButton( 'Subscript'		, FCKLang.Subscript ) ; break ;
		case 'Superscript'		: oItem = new FCKToolbarButton( 'Superscript'	, FCKLang.Superscript ) ; break ;

		case 'OrderedList'		: oItem = new FCKToolbarButton( 'InsertOrderedList'		, FCKLang.NumberedListLbl, FCKLang.NumberedList ) ; break ;
		case 'UnorderedList'	: oItem = new FCKToolbarButton( 'InsertUnorderedList'	, FCKLang.BulletedListLbl, FCKLang.BulletedList ) ; break ;
		case 'Outdent'			: oItem = new FCKToolbarButton( 'Outdent'	, FCKLang.DecreaseIndent ) ; break ;
		case 'Indent'			: oItem = new FCKToolbarButton( 'Indent'	, FCKLang.IncreaseIndent ) ; break ;

		case 'Link'				: oItem = new FCKToolbarButton( 'Link'		, FCKLang.InsertLinkLbl, FCKLang.InsertLink ) ; break ;
		case 'Unlink'			: oItem = new FCKToolbarButton( 'Unlink'	, FCKLang.RemoveLink ) ; break ;

		case 'Image'			: oItem = new FCKToolbarButton( 'Image'			, FCKLang.InsertImageLbl, FCKLang.InsertImage ) ; break ;
		case 'Table'			: oItem = new FCKToolbarButton( 'Table'			, FCKLang.InsertTableLbl, FCKLang.InsertTable ) ; break ;
		case 'SpecialChar'		: oItem = new FCKToolbarButton( 'SpecialChar'	, FCKLang.InsertSpecialCharLbl, FCKLang.InsertSpecialChar ) ; break ;
		case 'Smiley'			: oItem = new FCKToolbarButton( 'Smiley'		, FCKLang.InsertSmileyLbl, FCKLang.InsertSmiley ) ; break ;

		case 'Rule'				: oItem = new FCKToolbarButton( 'InsertHorizontalRule', FCKLang.InsertLineLbl, FCKLang.InsertLine ) ; break ;

		case 'JustifyLeft'		: oItem = new FCKToolbarButton( 'JustifyLeft'	, FCKLang.LeftJustify ) ; break ;
		case 'JustifyCenter'	: oItem = new FCKToolbarButton( 'JustifyCenter'	, FCKLang.CenterJustify ) ; break ;
		case 'JustifyRight'		: oItem = new FCKToolbarButton( 'JustifyRight'	, FCKLang.RightJustify ) ; break ;
		case 'JustifyFull'		: oItem = new FCKToolbarButton( 'JustifyFull'	, FCKLang.BlockJustify ) ; break ;

		case 'Style'			: oItem = new FCKToolbarStyleCombo() ; break ;
		case 'FontName'			: oItem = new FCKToolbarFontsCombo() ; break ;
		case 'FontSize'			: oItem = new FCKToolbarFontSizeCombo() ; break ;
		case 'FontFormat'		: oItem = new FCKToolbarFontFormatCombo() ; break ;

		case 'TextColor'		: oItem = new FCKToolbarPanelButton( 'TextColor', FCKLang.TextColor ) ; break ;
		case 'BGColor'			: oItem = new FCKToolbarPanelButton( 'BGColor'	, FCKLang.BGColor ) ; break ;
		
		case 'Find'				: oItem = new FCKToolbarButton( 'Find'		, FCKLang.Find ) ; break ;
		case 'Replace'			: oItem = new FCKToolbarButton( 'Replace'	, FCKLang.Replace ) ; break ;
		
		default:
			alert( FCKLang.UnknownToolbarItem.replace( /%1/g, itemName ) ) ;
			return ;
	}
	
	FCKToolbarItems.LoadedItems[ itemName ] = oItem ;
	
	return oItem ;
}