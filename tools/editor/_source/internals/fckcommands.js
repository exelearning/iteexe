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
 * File Name: fckcommands.js
 * 	Define all commands available in the editor.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-19 22:51:46
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKCommands = FCK.Commands = new Object() ;
FCKCommands.LoadedCommands = new Object() ;

FCKCommands.RegisterCommand = function( commandName, command )
{
	this.LoadedCommands[ commandName ] = command ;
}

FCKCommands.GetCommand = function( commandName )
{
	var oCommand = FCKCommands.LoadedCommands[ commandName ] ;
	
	if ( oCommand )
		return oCommand ;

	switch ( commandName )
	{
		case 'Link'			: oCommand = new FCKDialogCommand( 'Link'		, FCKLang.DlgLnkWindowTitle		, 'dialog/fck_link.html'		, 400, 330, FCK.GetNamedCommandState, 'CreateLink' ) ; break ;
		case 'About'		: oCommand = new FCKDialogCommand( 'About'		, FCKLang.About					, 'dialog/fck_about.html'		, 400, 330 ) ; break ;

		case 'Find'			: oCommand = new FCKDialogCommand( 'Find'		, FCKLang.DlgFindTitle			, 'dialog/fck_find.html'		, 340, 170 ) ; break ;
		case 'Replace'		: oCommand = new FCKDialogCommand( 'Replace'	, FCKLang.DlgReplaceTitle		, 'dialog/fck_replace.html'		, 340, 200 ) ; break ;

		case 'Image'		: oCommand = new FCKDialogCommand( 'Image'		, FCKLang.DlgImgTitle			, 'dialog/fck_image.html'		, 450, 400, FCK.GetNamedCommandState, 'InsertImage' ) ; break ;
		case 'SpecialChar'	: oCommand = new FCKDialogCommand( 'SpecialChar', FCKLang.DlgSpecialCharTitle	, 'dialog/fck_specialchar.html'	, 400, 300, FCK.GetNamedCommandState, 'InsertImage' ) ; break ;
		case 'Smiley'		: oCommand = new FCKDialogCommand( 'Smiley'		, FCKLang.DlgSmileyTitle		, 'dialog/fck_smiley.html'		, FCKConfig.SmileyWindowWidth, FCKConfig.SmileyWindowHeight, FCK.GetNamedCommandState, 'InsertImage' ) ; break ;
		case 'Table'		: oCommand = new FCKDialogCommand( 'Table'		, FCKLang.DlgTableTitle			, 'dialog/fck_table.html'		, 400, 250 ) ; break ;
		case 'TableProp'	: oCommand = new FCKDialogCommand( 'Table'		, FCKLang.DlgTableTitle			, 'dialog/fck_table.html?Parent', 400, 250 ) ; break ;
		case 'TableCellProp': oCommand = new FCKDialogCommand( 'TableCell'	, FCKLang.DlgCellTitle			, 'dialog/fck_tablecell.html'	, 500, 250 ) ; break ;

		case 'Style'		: oCommand = new FCKStyleCommand() ; break ;

		case 'FontName'		: oCommand = new FCKFontNameCommand() ; break ;
		case 'FontSize'		: oCommand = new FCKFontSizeCommand() ; break ;
		case 'FontFormat'	: oCommand = new FCKFormatBlockCommand() ; break ;

		case 'Source'		: oCommand = new FCKSourceCommand() ; break ;
		case 'Preview'		: oCommand = new FCKPreviewCommand() ; break ;
		case 'Save'			: oCommand = new FCKSaveCommand() ; break ;
		case 'NewPage'		: oCommand = new FCKNewPageCommand() ; break ;

		case 'TextColor'	: oCommand = new FCKTextColorCommand('ForeColor') ; break ;
		case 'BGColor'		: oCommand = new FCKTextColorCommand('BackColor') ; break ;

		case 'PasteText'	: oCommand = new FCKPastePlainTextCommand() ; break ;
		case 'PasteWord'	: oCommand = new FCKPasteWordCommand() ; break ;

		case 'TableInsertRow'		: oCommand = new FCKTableCommand('TableInsertRow') ; break ;
		case 'TableDeleteRows'		: oCommand = new FCKTableCommand('TableDeleteRows') ; break ;
		case 'TableInsertColumn'	: oCommand = new FCKTableCommand('TableInsertColumn') ; break ;
		case 'TableDeleteColumns'	: oCommand = new FCKTableCommand('TableDeleteColumns') ; break ;
		case 'TableInsertCell'		: oCommand = new FCKTableCommand('TableInsertCell') ; break ;
		case 'TableDeleteCells'		: oCommand = new FCKTableCommand('TableDeleteCells') ; break ;
		case 'TableMergeCells'		: oCommand = new FCKTableCommand('TableMergeCells') ; break ;
		case 'TableSplitCell'		: oCommand = new FCKTableCommand('TableSplitCell') ; break ;

		// Generic Undefined command (usually used when a command is under development).
		case 'Undefined'	: oCommand = new FCKUndefinedCommand() ; break ;
		
		// By default we assume that it is a named command.
		default:
			if ( FCKRegexLib.NamedCommands.test( commandName ) )
				oCommand = new FCKNamedCommand( commandName ) ;
			else
			{
				alert( FCKLang.UnknownCommand.replace( /%1/g, commandName ) ) ;
				return ;
			}
	}
	
	FCKCommands.LoadedCommands[ commandName ] = oCommand ;
	
	return oCommand ;
}

