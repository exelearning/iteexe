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
 * File Name: fcktoolbarfontsizecombo.js
 * 	FCKToolbarPanelButton Class: Handles the Fonts combo selector.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-19 07:50:29
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKToolbarFontSizeCombo = function()
{
	this.Command =  FCKCommands.GetCommand( 'FontSize' ) ;
}

// Inherit from FCKToolbarSpecialCombo.
FCKToolbarFontSizeCombo.prototype = new FCKToolbarSpecialCombo ;

FCKToolbarFontSizeCombo.prototype.GetLabel = function()
{
	return FCKLang.FontSize ;
}

FCKToolbarFontSizeCombo.prototype.CreateItems = function( targetSpecialCombo )
{
	targetSpecialCombo.FieldWidth = 70 ;
	
	var aSizes = FCKConfig.FontSizes.split(';') ;
	
	for ( var i = 0 ; i < aSizes.length ; i++ )
	{
		var aSizeParts = aSizes[i].split('/') ;
		this._Combo.AddItem( aSizeParts[0], '<font size="' + aSizeParts[0] + '">' + aSizeParts[1] + '</font>', aSizeParts[1] ) ;
	}
}