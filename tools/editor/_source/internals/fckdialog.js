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
 * File Name: fckdialog.js
 * 	Dialog windows operations.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-19 23:28:55
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKDialog = new Object() ;

// This method opens a dialog window using the standard dialog template.
FCKDialog.OpenDialog = function( dialogName, dialogTitle, dialogPage, width, height, customValue, parentWindow )
{
	// Setup the dialog info.
	var oDialogInfo = new Object() ;
	oDialogInfo.Title = dialogTitle ;
	oDialogInfo.Page = dialogPage ;
	oDialogInfo.Editor = window ;
	oDialogInfo.CustomValue = customValue ;		// Optional
	
	var sUrl = FCKConfig.BasePath + 'fckdialog.html' ;
	this.Show( oDialogInfo, dialogName, sUrl, width, height, parentWindow ) ;
}

