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
 * File Name: fcktoolbarpanelbutton.js
 * 	FCKToolbarPanelButton Class: represents a special button in the toolbar
 * 	that shows a panel when pressed.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-30 09:26:22
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKToolbarPanelButton = function( commandName, label, tooltip, style )
{
	this.Command	= FCKCommands.GetCommand( commandName ) ;
	this.Label		= label ? label : commandName ;
	this.Tooltip	= tooltip ? tooltip : ( label ? label : commandName) ;
	this.Style		= style ? style : FCK_TOOLBARITEM_ONLYICON ;
	this.State		= FCK_UNKNOWN ;
}

FCKToolbarPanelButton.prototype.CreateInstance = function( parentToolbar )
{
/*
	<td title="Bold" class="TB_Button_Off" unselectable="on" onmouseover="Button_OnMouseOver(this);" onmouseout="Button_OnMouseOut(this);">
		<table class="TB_ButtonType_Icon" cellspacing="0" cellpadding="0" border="0">
			<tr>
				<td class="TB_Icon"><img src="icons/button.redo.gif" width="21" height="21" style="VISIBILITY: hidden" onload="this.style.visibility = '';"></td>
				<td class="TB_Text" unselectable="on">Redo</td>
				<td class="TB_ButtonArrow"><img src="skin/images/toolbar_buttonarrow.gif" width="5" height="3"></td>
			</tr>
		</table>
	</td>
*/	
	this.DOMDiv = document.createElement( 'div' ) ;
	this.DOMDiv.className = 'TB_Button_Off' ;

	this.DOMDiv.FCKToolbarButton = this ;
	
	this.DOMDiv.onmouseover = function()
	{
		if ( this.FCKToolbarButton.State != FCK_TRISTATE_DISABLED )
		{
			this.className = 'TB_Button_On' ;
		}
	}
	
	this.DOMDiv.onmouseout	= function()
	{
		if ( this.FCKToolbarButton.State != FCK_TRISTATE_DISABLED &&  this.FCKToolbarButton.State != FCK_TRISTATE_ON )
		{
			this.className = 'TB_Button_Off' ;
		}
	}
	
	this.DOMDiv.onclick = function( e )
	{
		// For Mozilla we must stop the event propagation to avoid it hiding 
		// the panel because of a click outside of it.
		if ( e )
		{
			e.stopPropagation() ;
			FCKPanelEventHandlers.OnDocumentClick( e ) ;
		}

		if ( this.FCKToolbarButton.State != FCK_TRISTATE_DISABLED )
		{
			this.FCKToolbarButton.Command.Execute(0, this.FCKToolbarButton.DOMDiv.offsetHeight, this.FCKToolbarButton.DOMDiv) ;
//			this.FCKToolbarButton.HandleOnClick( this.FCKToolbarButton, e ) ;
		}
			
		return false ;
	}

	// Gets the correct CSS class to use for the specified style (param).
	var sClass ;
	switch ( this.Style )
	{
		case FCK_TOOLBARITEM_ONLYICON :
			sClass = 'TB_ButtonType_Icon' ;
			break ;
		case FCK_TOOLBARITEM_ONLYTEXT :
			sClass = 'TB_ButtonType_Text' ;
			break ;
		case FCK_TOOLBARITEM_ICONTEXT :
			sClass = '' ;
			break ;
	}

	this.DOMDiv.innerHTML = 
		'<table title="' + this.Tooltip + '" class="' + sClass + '" cellspacing="0" cellpadding="0" border="0" unselectable="on">' +
			'<tr>' +
				'<td class="TB_Icon" unselectable="on"><img src="' + FCKConfig.SkinPath + 'toolbar/button.' + this.Command.Name.toLowerCase() + '.gif" width="21" height="21" unselectable="on"></td>' +
				'<td class="TB_Text" unselectable="on">' + this.Label + '</td>' +
				'<td class="TB_ButtonArrow" unselectable="on"><img src="' + FCKConfig.SkinPath + 'images/toolbar.buttonarrow.gif" width="5" height="3"></td>' +
			'</tr>' +
		'</table>' ;
	

	var oCell = parentToolbar.DOMRow.insertCell(-1) ;
	oCell.appendChild( this.DOMDiv ) ;
	
	this.RefreshState() ;
}

// The Panel Button works like a normal button so the refresh state function
// defined for the normal button can be reused here.
FCKToolbarPanelButton.prototype.RefreshState = FCKToolbarButton.prototype.RefreshState ;