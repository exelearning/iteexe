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
 * File Name: fckcontextmenu.js
 * 	Defines the FCKContextMenu object that is responsible for all 
 * 	Context Menu operations.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 00:19:50
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKContextMenu = new Object() ;

// This property is internally used to indicate that the context menu has been created.
FCKContextMenu._IsLoaded = false ;

// This method creates the context menu inside a DIV tag. Take a look at the end of this file for a sample output.
FCKContextMenu.Reload = function()
{
	// Create the Main DIV that holds the Context Menu.
	this._Div = this._Document.createElement( 'DIV' ) ;
	this._Div.className			= 'CM_ContextMenu' ;
	this._Div.style.position	= 'absolute' ;
	this._Div.style.visibility	= 'hidden' ;
	this._Document.body.appendChild( this._Div );
	
	// Create the main table for the menu items.
	var oTable = this._Document.createElement( 'TABLE' ) ;
	oTable.cellSpacing = 0 ;
	oTable.cellPadding = 0 ;
	oTable.border = 0 ;
	this._Div.appendChild( oTable ) ;

	// Create arrays with all Items to add.
	
	this.Groups = new Object() ;
	
	// Generic items that are always available.
	this.Groups['Generic'] = new FCKContextMenuGroup() ;
	with ( this.Groups['Generic'] )
	{
		Add( new FCKContextMenuItem( this, 'Cut'	, FCKLang.Cut	, true ) ) ;
		Add( new FCKContextMenuItem( this, 'Copy'	, FCKLang.Copy	, true ) ) ;
		Add( new FCKContextMenuItem( this, 'Paste'	, FCKLang.Paste	, true ) ) ;
	}
	
	// Link operations.
	this.Groups['Link'] = new FCKContextMenuGroup() ;
	with ( this.Groups['Link'] )
	{
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'Link'	, FCKLang.EditLink	, true ) ) ;
		Add( new FCKContextMenuItem( this, 'Unlink'	, FCKLang.RemoveLink, true ) ) ;
	}

	// Table Cell operations.	
	this.Groups['TableCell'] = new FCKContextMenuGroup() ;
	with ( this.Groups['TableCell'] )
	{
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'TableInsertRow'		, FCKLang.InsertRow, true ) ) ;
		Add( new FCKContextMenuItem( this, 'TableDeleteRows'	, FCKLang.DeleteRows, true ) ) ;
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'TableInsertColumn'	, FCKLang.InsertColumn, true ) ) ;
		Add( new FCKContextMenuItem( this, 'TableDeleteColumns'	, FCKLang.DeleteColumns, true ) ) ;
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'TableInsertCell'	, FCKLang.InsertCell, true ) ) ;
		Add( new FCKContextMenuItem( this, 'TableDeleteCells'	, FCKLang.DeleteCells, true ) ) ;
		Add( new FCKContextMenuItem( this, 'TableMergeCells'	, FCKLang.MergeCells, true ) ) ;
		Add( new FCKContextMenuItem( this, 'TableSplitCell'		, FCKLang.SplitCell, true ) ) ;
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'TableCellProp'		, FCKLang.CellProperties, true ) ) ;
		Add( new FCKContextMenuItem( this, 'TableProp'			, FCKLang.TableProperties, true ) ) ;
	}

	// Table operations.	
	this.Groups['Table'] = new FCKContextMenuGroup() ;
	with ( this.Groups['Table'] )
	{
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'Table', FCKLang.TableProperties, true ) ) ;
	}
	
	// Image operations.
	this.Groups['Image'] = new FCKContextMenuGroup() ;
	with ( this.Groups['Image'] )
	{
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'Image', FCKLang.ImageProperties, true ) ) ;
	}
	
	// Select field operations.
	this.Groups['Select'] = new FCKContextMenuGroup() ;
	with ( this.Groups['Select'] )
	{
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'Undefined', "Selection Field Properties" ) ) ;
	}

	// Textarea operations.
	this.Groups['Textarea'] = new FCKContextMenuGroup() ;
	with ( this.Groups['Textarea'] )
	{
		Add( new FCKContextMenuSeparator() ) ;
		Add( new FCKContextMenuItem( this, 'Undefined', "Textarea Properties" ) ) ;
	}
	
	// Create all table rows (representing the items) in the context menu.
	for ( var o in this.Groups )
	{
		this.Groups[o].CreateTableRows( oTable ) ;
	}

	this._IsLoaded = true ;
}

FCKContextMenu.RefreshState = function()
{
  	// Get the actual selected tag (if any).
	var oTag = FCKSelection.GetSelectedElement() ;
	var sTagName ;
	
	if ( oTag )
	{
		sTagName = oTag.tagName ;
	}

	// Set items visibility.
	this.Groups['Link'].SetVisible( FCK.GetNamedCommandState( 'Unlink' ) != FCK_TRISTATE_DISABLED ) ;
	this.Groups['TableCell'].SetVisible( sTagName != 'TABLE' && FCKSelection.HasAncestorNode('TABLE') ) ;
	this.Groups['Table'].SetVisible( sTagName == 'TABLE' ) ;
	this.Groups['Image'].SetVisible( sTagName == 'IMG' ) ;
	this.Groups['Select'].SetVisible( sTagName == 'SELECT' ) ;
	this.Groups['Textarea'].SetVisible( sTagName == 'TEXTAREA' ) ;
	
	// Refresh the state of all visible items (active/disactive)	
	for ( var o in this.Groups )
	{
		this.Groups[o].RefreshState() ;
	}
}

/*
Sample Context Menu Output
-----------------------------------------
<div class="CM_ContextMenu">
	<table cellSpacing="0" cellPadding="0" border="0">
		<tr class="CM_Disabled">
			<td class="CM_Icon"><img alt="" src="icons/button.cut.gif" width="21" height="20" unselectable="on"></td>
			<td class="CM_Label" unselectable="on">Cut</td>
		</tr>
		<tr class="CM_Disabled">
			<td class="CM_Icon"><img height="20" alt="" src="icons/button.copy.gif" width="21"></td>
			<td class="CM_Label">Copy</td>
		</tr>
		<tr class="CM_Option" onmouseover="OnOver(this);" onmouseout="OnOut(this);">
			<td class="CM_Icon"><img height="20" alt="" src="icons/button.paste.gif" width="21"></td>
			<td class="CM_Label">Paste</td>
		</tr>
		<tr class="CM_Separator">
			<td class="CM_Icon"></td>
			<td class="CM_Label"><div></div></td>
		</tr>
		<tr class="CM_Option" onmouseover="OnOver(this);" onmouseout="OnOut(this);">
			<td class="CM_Icon"><img height="20" alt="" src="icons/button.print.gif" width="21"></td>
			<td class="CM_Label">Print</td>
		</tr>
		<tr class="CM_Separator">
			<td class="CM_Icon"></td>
			<td class="CM_Label"><div></div></td>
		</tr>
		<tr class="CM_Option" onmouseover="OnOver(this);" onmouseout="OnOut(this);">
			<td class="CM_Icon"></td>
			<td class="CM_Label">Do Something</td>
		</tr>
		<tr class="CM_Option" onmouseover="OnOver(this);" onmouseout="OnOut(this);">
			<td class="CM_Icon"></td>
			<td class="CM_Label">Just Testing</td>
		</tr>
	</table>
</div>
*/