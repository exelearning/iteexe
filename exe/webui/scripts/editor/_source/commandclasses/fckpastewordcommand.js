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
 * File Name: fckpastewordcommand.js
 * 	FCKPasteWordCommand Class: represents the "Paste from Word" command.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-08-30 23:20:46
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKPasteWordCommand = function() 
{
	this.Name = 'PasteWord' ;
}

FCKPasteWordCommand.prototype.Execute = function()
{
	FCK.PasteFromWord() ;
}

FCKPasteWordCommand.prototype.GetState = function()
{
	return FCK.GetNamedCommandState( 'Paste' ) ;
}
