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
 * File Name: fcktoolbarspecialcombo.js
 * 	FCKToolbarSpecialCombo Class: This is a "abstract" base class to be used
 * 	by the special combo toolbar elements like font name, font size, paragraph format, etc...
 * 	
 * 	The following properties and methods must be implemented when inheriting from
 * 	this class:
 * 		- Property:	Command								[ The command to be executed ]
 * 		- Method:	GetLabel()							[ Returns the label ]
 * 		-			CreateItems( targetSpecialCombo )	[ Add all items in the special combo ]
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-15 10:53:54
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKToolbarSpecialCombo = function()
{}

FCKToolbarSpecialCombo.prototype.CreateInstance = function( parentToolbar )
{
	this._Combo = new FCKSpecialCombo( this.GetLabel() ) ;
	this._Combo.FieldWidth = 100 ;
	this._Combo.PanelWidth = 150 ;
	this._Combo.PanelMaxHeight = 150 ;

	this.CreateItems( this._Combo ) ;

	this._Combo.Create( parentToolbar.DOMRow.insertCell(-1) ) ;

	this._Combo.Command = this.Command ;
	
	this._Combo.OnSelect = function( itemId, item )
	{
		this.Command.Execute( itemId, item ) ;
	}
}

FCKToolbarSpecialCombo.prototype.RefreshState = function()
{
	// Gets the actual state.
	var eState ;
	
	if ( FCK.EditMode == FCK_EDITMODE_SOURCE && ! this.SourceView )
		eState = FCK_TRISTATE_DISABLED ;
	else
	{
		var sValue = this.Command.GetState() ;

		if ( sValue != FCK_TRISTATE_DISABLED )
		{
			eState = FCK_TRISTATE_ON ;
			
			if ( typeof( this.RefreshActiveItems ) == 'function' )
				this.RefreshActiveItems( this._Combo ) ;
			else
			{
				this._Combo.DeselectAll() ;
				this._Combo.SelectItem( sValue ) ;
				this._Combo.SetLabelById( sValue ) ;
			}
		}
		else
			eState = FCK_TRISTATE_DISABLED ;
	}
	
	// If there are no state changes then do nothing and return.
	if ( eState == this.State ) return ;
	
	if ( eState == FCK_TRISTATE_DISABLED )
	{
		this._Combo.DeselectAll() ;
		this._Combo.SetLabel( '' ) ;
	}

	// Sets the actual state.
	this.State = eState ;

	// Updates the graphical state.
	this._Combo.SetEnabled( eState != FCK_TRISTATE_DISABLED ) ;
}