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
 * File Name: fcktablehandler_gecko.js
 * 	Manage table operations (IE specific).
 * 
 * Version:  2.0 RC2
 * Modified: 2004-09-07 00:52:56
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

FCKTableHandler.GetSelectedCells = function()
{
	var aCells = new Array() ;

	var oSelection = FCK.EditorWindow.getSelection() ;

	// If the selection is a text.
	if ( oSelection.rangeCount == 1 && oSelection.anchorNode.nodeType == 3 )
	{
		var oParent = FCKTools.GetElementAscensor( oSelection.anchorNode, 'TD' ) ;
		
		if ( oParent )
		{
			aCells[0] = oParent ;
			return aCells ;
		}	
	}

	for ( var i = 0 ; i < oSelection.rangeCount ; i++ )
	{
		var oRange = oSelection.getRangeAt(i) ;
		var oCell = oRange.startContainer.childNodes[ oRange.startOffset ] ;
		
		if ( oCell.tagName == 'TD' )
			aCells[aCells.length] = oCell ;
	}

	return aCells ;
}
