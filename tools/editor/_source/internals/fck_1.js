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
 * File Name: fck_1.js
 * 	This is the first part of the "FCK" object creation. This is the main
 * 	object that represents an editor instance.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 12:47:38
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

FCK.Events	= new FCKEvents( FCK ) ;
FCK.Toolbar	= null ;

FCK.StartEditor = function()
{
	// Get the editor's window and document (DOM)
	this.EditorWindow	= window.frames[ 'eEditorArea' ] ;
	this.EditorDocument	= this.EditorWindow.document ;

	// TODO: Wait stable version and remove the following commented lines.
	// The Base Path of the editor is saved to rebuild relative URL (IE issue).
//	this.BaseUrl = this.EditorDocument.location.protocol + '//' + this.EditorDocument.location.host ;

	// Set the editor's startup contents
	this.SetHTML( FCKTools.GetLinkedFieldValue() ) ;
	
	// Set the editor area CSS file.
	FCKTools.AppendStyleSheet( this.EditorDocument, FCKConfig.EditorAreaCSS ) ;

	// Attach the editor to the form onsubmit event
	FCKTools.AttachToLinkedFieldFormSubmit( this.UpdateLinkedField ) ;
	
	// Initialize the default browser behaviors (browser specific).
	this.InitializeBehaviors() ;
}

FCK.SetStatus = function( newStatus )
{
	this.Status = newStatus ;
	
	if ( newStatus == FCK_STATUS_ACTIVE )
	{
		// Force the focus in the window to go to the editor.
		window.onfocus = window.document.body.onfocus = FCK.Focus ;
		
		// Force the focus in the editor.
		if ( FCKConfig.StartupFocus )
			FCK.Focus() ;
	
	
		
		if ( FCKBrowserInfo.IsIE )
			FCKScriptLoader.AddScript( 'js/fckeditorcode_ie_2.js' ) ;
		else
			FCKScriptLoader.AddScript( 'js/fckeditorcode_gecko_2.js' ) ;
			
	}
	
	this.Events.FireEvent( 'OnStatusChange', newStatus ) ;
	if ( this.OnStatusChange ) this.OnStatusChange( newStatus ) ;
	
}

FCK.GetHTML = function()
{
	if ( FCK.EditMode == FCK_EDITMODE_WYSIWYG )
	{
		// TODO: Wait stable version and remove the following commented lines.
//		if ( FCKBrowserInfo.IsIE )
//			FCK.CheckRelativeLinks() ;

		return this.EditorDocument.body.innerHTML ;
	}
	else
		return document.getElementById('eSourceField').value ;
}

FCK.GetXHTML = function()
{
	var bSource = ( FCK.EditMode == FCK_EDITMODE_SOURCE ) ;
	
	if ( bSource )
		this.SwitchEditMode() ;

	// TODO: Wait stable version and remove the following commented lines.
//	if ( FCKBrowserInfo.IsIE )
//		FCK.CheckRelativeLinks() ;
	
	var sXHTML = FCKXHtml.GetXHTML( this.EditorDocument.body ) ;
	
	if ( bSource )
		this.SwitchEditMode() ;
		
	return sXHTML ;
}

FCK.UpdateLinkedField = function()
{
	if ( FCKConfig.EnableXHTML )
		FCKTools.SetLinkedFieldValue( FCK.GetXHTML() ) ;
	else
		FCKTools.SetLinkedFieldValue( FCK.GetHTML() ) ;
}

FCK.ShowContextMenu = function( x, y )
{
	if ( this.Status != FCK_STATUS_COMPLETE ) 
		return ;
		
	FCKContextMenu.Show( x, y ) ;
	this.Events.FireEvent( "OnContextMenu" ) ;
}

