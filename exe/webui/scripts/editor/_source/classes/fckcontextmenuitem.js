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
 * File Name: fckcontextmenuitem.js
 * 	FCKContextMenuItem Class: represents a item in the context menu.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-10 17:14:48
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKContextMenuItem = function( contextMenu, commandName, label, hasIcon )
{
	this.ContextMenu	= contextMenu ;
	this.Command		= FCKCommands.GetCommand( commandName ) ;
	this.Label			= label ? label : commandName ;
	this.HasIcon		= hasIcon ? true : false ;
}

FCKContextMenuItem.prototype.CreateTableRow = function( targetTable )
{
	// Creates the <TR> element.
	this._Row = targetTable.insertRow(-1) ;
	this._Row.className = 'CM_Disabled' ;
	this._Row.FCKContextMenuItem = this ;
	
	// Sets the mouse over event.
	this._Row.onmouseover = function()
	{
		if ( this.className != 'CM_Disabled' )
			this.className = 'CM_Over' ;
	}
	
	// Sets the mouse out event.
	this._Row.onmouseout = function()
	{
		if ( this.className != 'CM_Disabled' )
			this.className = 'CM_Option' ;
	}
	
	this._Row.onclick = function()
	{
		this.FCKContextMenuItem.ContextMenu.Hide() ;
		this.FCKContextMenuItem.Command.Execute() ;
		return false ;
	}
	
	var oCell = this._Row.insertCell(-1) ;
	oCell.className = 'CM_Icon' ;
	
	if ( this.HasIcon ) oCell.innerHTML = '<img alt="" src="' + FCKConfig.SkinPath + 'toolbar/button.' + this.Command.Name.toLowerCase() + '.gif" width="21" height="20" unselectable="on">' ;
	
	oCell = this._Row.insertCell(-1) ;
	oCell.className		= 'CM_Label' ;
	oCell.unselectable	= 'on' ;
	oCell.noWrap		= true ;
	oCell.innerHTML		= this.Label ;
}

FCKContextMenuItem.prototype.SetVisible = function( isVisible )
{
	this._Row.style.display = isVisible ? '' : 'none' ;
}

FCKContextMenuItem.prototype.RefreshState = function()
{
	switch ( this.Command.GetState() )
	{
		case FCK_TRISTATE_ON :
		case FCK_TRISTATE_OFF :
			this._Row.className = 'CM_Option' ;
			break ;
		default :
			this._Row.className = 'CM_Disabled' ;
			break ;
	}
} 

/*
Sample output.
-----------------------------------------
<tr class="CM_Disabled">
	<td class="CM_Icon"><img alt="" src="icons/button.cut.gif" width="21" height="20" unselectable="on"></td>
	<td class="CM_Label" unselectable="on">Cut</td>
</tr>
-----------------------------------------
<tr class="CM_Option" onmouseover="OnOver(this);" onmouseout="OnOut(this);">
	<td class="CM_Icon"></td>
	<td class="CM_Label">Do Something</td>
</tr>
*/