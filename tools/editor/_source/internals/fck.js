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
 * File Name: fck.js
 * 	Creation and initialization of the "FCK" object. This is the main object
 * 	that represents an editor instance.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-05-31 23:07:48
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

// FCK represents the active editor instance
var FCK = new Object() ;
FCK.Name			= FCKURLParams[ 'InstanceName' ] ;
FCK.LinkedField		= window.parent.document.getElementById( FCK.Name ) ;

FCK.Status			= FCK_STATUS_NOTLOADED ;
FCK.EditMode		= FCK_EDITMODE_WYSIWYG ;

FCK.PasteEnabled	= false ;
