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
 * File Name: fckselection_gecko.js
 * 	Active selection functions. (Gecko specific implementation)
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-15 13:33:14
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

// Get the selection type (like document.select.type in IE).
FCKSelection.GetType = function()
{
//	if ( ! this._Type )
//	{
		// By default set the type to "Text".
		this._Type = 'Text' ;
		
		// Check if the actual selection is a Control (IMG, TABLE, HR, etc...).
		var oSel = FCK.EditorWindow.getSelection() ;
		if ( oSel && oSel.rangeCount == 1 )
		{
			var oRange = oSel.getRangeAt(0) ;
			if ( oRange.startContainer == oRange.endContainer && (oRange.endOffset - oRange.startOffset) == 1 )
				this._Type = 'Control' ;
		}
//	}
	return this._Type ;
}

// Retrieves the selected element (if any), just in the case that a single 
// element (object like and image or a table) is selected.
FCKSelection.GetSelectedElement = function()
{
	if ( this.GetType() == 'Control' )
	{
		var oSel = FCK.EditorWindow.getSelection() ;
		return oSel.anchorNode.childNodes[ oSel.anchorOffset ] ;
	}
}

FCKSelection.GetParentElement = function()
{
	if ( this.GetType() == 'Control' )
		return FCKSelection.GetSelectedElement().parentElement ;
	else
	{
		var oNode = FCK.EditorWindow.getSelection().anchorNode ;

		while ( oNode && oNode.nodeType != 1 )
			oNode = oNode.parentNode ;

		return oNode ;
	}
}

FCKSelection.MoveToNode = function( node )
{
	var oSel = FCK.EditorWindow.getSelection() ;

	for ( i = oSel.rangeCount - 1 ; i >= 0 ; i-- )
	{
		if ( i == 0 )
			oSel.getRangeAt(i).selectNodeContents( node ) ;
		else
			oSel.removeRange( oSel.getRangeAt(i) ) ;
	}
}

// The "nodeTagName" parameter must be Upper Case.
FCKSelection.HasAncestorNode = function( nodeTagName )
{
	var oContainer = this.GetSelectedElement() ;
	if ( ! oContainer && FCK.EditorWindow )
	{
		try		{ oContainer = FCK.EditorWindow.getSelection().getRangeAt(0).startContainer ; }
		catch(e){}
	}

	while ( oContainer )
	{
		if ( oContainer.tagName == nodeTagName ) return true ;
		oContainer = oContainer.parentNode ;
	}

	return false ;
}

// The "nodeTagName" parameter must be Upper Case.
FCKSelection.MoveToAncestorNode = function( nodeTagName )
{
	var oNode ;
	
	var oContainer = this.GetSelectedElement() ;
	if ( ! oContainer )
		oContainer = FCK.EditorWindow.getSelection().getRangeAt(0).startContainer ;

	while ( oContainer )
	{
		if ( oContainer.tagName == nodeTagName ) return oContainer ;
		oContainer = oContainer.parentNode ;
	}
}

FCKSelection.Delete = function()
{
	// Gets the actual selection.
	var oSel = FCK.EditorWindow.getSelection() ;

	// Deletes the actual selection contents.
	for ( var i = 0 ; i < oSel.rangeCount ; i++ )
	{
		oSel.getRangeAt(i).deleteContents() ;
	}
	
	return oSel ;
}