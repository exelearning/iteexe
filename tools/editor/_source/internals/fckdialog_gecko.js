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
 * File Name: fckdialog_gecko.js
 * 	Dialog windows operations. (Gecko specific implementations)
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 00:48:06
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

FCKDialog.Show = function( dialogInfo, dialogName, pageUrl, dialogWidth, dialogHeight, parentWindow )
{
	var iTop  = (screen.height - dialogHeight) / 2 ;
	var iLeft = (screen.width  - dialogWidth)  / 2 ;

	var sOption  = "location=no,menubar=no,resizable=no,toolbar=no,dependent=yes,dialog=yes,minimizable=no,modal=yes,alwaysRaised=yes" +
		",width="  + dialogWidth +
		",height=" + dialogHeight +
		",top="  + iTop +
		",left=" + iLeft ;

	if ( !parentWindow )
		parentWindow = window ;
	
	var oWindow = parentWindow.open( '', 'FCKEditorDialog_' + dialogName, sOption, true ) ;
	oWindow.moveTo( iLeft, iTop ) ;
	oWindow.resizeTo( dialogWidth, dialogHeight ) ;
	oWindow.focus() ;
	oWindow.location.href = pageUrl ;
	
	oWindow.dialogArguments = dialogInfo ;
	
	// On some Gecko browsers (probably over slow connections) the 
	// "dialogArguments" are not set to the target window so we must
	// put it in the opener window so it can be used by the target one.
	parentWindow.FCKLastDialogInfo = dialogInfo ;
	
	this.Window = oWindow ;
	
	window.top.captureEvents( Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS ) ;
	window.top.parent.addEventListener( 'mousedown', this.CheckFocus, true ) ;
	window.top.parent.addEventListener( 'mouseup', this.CheckFocus, true ) ;
	window.top.parent.addEventListener( 'click', this.CheckFocus, true ) ;
	window.top.parent.addEventListener( 'focus', this.CheckFocus, true ) ;		
}

FCKDialog.CheckFocus = function()
{
	if ( FCKDialog.Window && !FCKDialog.Window.closed )
	{
		FCKDialog.Window.focus() ;
		return false ;
	}
	else
	{
		window.top.releaseEvents(Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS) ;
		window.top.parent.removeEventListener( 'onmousedown', FCKDialog.CheckFocus, true ) ;
		window.top.parent.removeEventListener( 'mouseup', FCKDialog.CheckFocus, true ) ;
		window.top.parent.removeEventListener( 'click', FCKDialog.CheckFocus, true ) ;
		window.top.parent.removeEventListener( 'onfocus', FCKDialog.CheckFocus, true ) ;
	}
}

