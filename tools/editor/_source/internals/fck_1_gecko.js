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
 * File Name: fck_1_gecko.js
 * 	This is the first part of the "FCK" object creation. This is the main
 * 	object that represents an editor instance.
 * 	(Gecko specific implementations)
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-15 13:26:29
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

FCK.Description = "FCKeditor for Gecko Browsers" ;

FCK.InitializeBehaviors = function()
{
	// Disable Right-Click
	var oOnContextMenu = function( e )
	{
		e.preventDefault() ;
		FCK.ShowContextMenu( e.clientX, e.clientY ) ;
	}
	this.EditorDocument.addEventListener( 'contextmenu', oOnContextMenu, true ) ;

	var oOnKeyDown = function( e )
	{
		if ( e.ctrlKey && !e.shiftKey && !e.altKey )
		{
			// Char 86/118 = V/v
			if ( e.which == 86 || e.which == 118 )
			{
				if ( FCK.Status == FCK_STATUS_COMPLETE )
				{
					if ( !FCK.Events.FireEvent( "OnPaste" ) )
						e.preventDefault() ;
				}
				else
					e.preventDefault() ;
			}
		}
	}
	this.EditorDocument.addEventListener( 'keydown', oOnKeyDown, true ) ;
	
	var oOnSelectionChange = function( e )
	{
		/*
		var bIsDifferent = false ;
		var oActualSel = FCK.EditorWindow.getSelection() ;

		if ( FCK.LastSelection )
		{
			if ( FCK.LastSelection.rangeCount != oActualSel.rangeCount )
			{
				bIsDifferent = true ;
			}
			else
			{
				if ( oActualSel.rangeCount == 1 )
				{
					var oRangeA = oActualSel.getRangeAt(0) ;
					var oRangeB = FCK.LastSelection.getRangeAt(0) ;
					
					FCKDebug.Output( 'collapsed: ' + oRangeA.collapsed ) ;
					if ( oRangeA.collapsed )
					{
						FCKDebug.Output( 'startContainerBranch: ' + oRangeA.startContainerBranch + ' == ' + oRangeB.startContainerBranch ) ;
						FCKDebug.Output( 'Container: ' + oRangeA.startContainer.childNodes[ oRangeA.startOffset ] + ' == ' + oRangeB.commonAncestorContainer.parent ) ;
						if 
						( 
							!oRangeB.collapsed ||
							oRangeA.startContainer.childNodes[ oRangeA.startOffset ] != oRangeB.startContainer.childNodes[ oRangeB.startOffset ] ||
							oRangeA.commonAncestorContainer.parent != oRangeB.commonAncestorContainer.parent )
						{
							bIsDifferent = true ;
						}
					}
					else
					{
						bIsDifferent = true ;
					}
				}
				else
				{
					bIsDifferent == true ;
				}
			}
		}
		else
		{
			bIsDifferent = true ;
		}
		
		FCK.LastSelection = oActualSel ;
		
		FCKDebug.Output( 'bIsDifferent: ' + bIsDifferent ) ;
		
		if ( bIsDifferent )
		{*/
			FCK.Events.FireEvent( "OnSelectionChange" ) ;
		//}
	}
	
	this.EditorDocument.addEventListener( 'mouseup', oOnSelectionChange, false ) ;
	this.EditorDocument.addEventListener( 'keyup', oOnSelectionChange, false ) ;

	this.MakeEditable() ;

	this.SetStatus( FCK_STATUS_ACTIVE ) ;
}

FCK.MakeEditable = function()
{
	this.EditorDocument.designMode = 'on' ;

	// Tell Gecko to use or not the <SPAN> tag for the bold, italic and underline.
	this.EditorDocument.execCommand( 'useCSS', false, !FCKConfig.GeckoUseSPAN ) ;
}

FCK.Focus = function()
{
	try
	{
		FCK.EditorWindow.focus() ;
	}
	catch(e) {}
}

FCK.SetHTML = function( html, forceWYSIWYG )
{
	if ( forceWYSIWYG || FCK.EditMode == FCK_EDITMODE_WYSIWYG )
	{
		// On Gecko we must disable editing before setting the innerHTML.
//		FCK.EditorDocument.designMode = "off" ;

		FCK.EditorDocument.body.innerHTML = html ;
	
		// On Gecko we must set the desingMode on again after setting the innerHTML.
//		FCK.EditorDocument.designMode = 'on' ;
			
		// Tell Gecko to use or not the <SPAN> tag for the bold, italic and underline.
//		FCK.EditorDocument.execCommand( "useCSS", false, !FCKConfig.GeckoUseSPAN ) ;
	}
	else
		document.getElementById('eSourceField').value = html ;
}

