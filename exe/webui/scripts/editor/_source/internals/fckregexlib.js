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
 * File Name: fckregexlib.js
 * 	These are some Regular Expresions used by the editor.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-22 11:04:22
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKRegexLib = new Object() ;

// This is the Regular expression used by the SetHTML method for the "&apos;" entity.
FCKRegexLib.AposEntity		= /&apos;/gi ;

// Used by the Styles combo to identify styles that can't be applied to text.
FCKRegexLib.ObjectElements	= /^(?:IMG|TABLE|TR|TD|INPUT|SELECT|TEXTAREA|HR|OBJECT)$/i ;

// List all named commands (commands that can be interpreted by the browser "execCommand" method.
FCKRegexLib.NamedCommands	= /^(?:Cut|Copy|Paste|Print|SelectAll|RemoveFormat|Unlink|Undo|Redo|Bold|Italic|Underline|StrikeThrough|Subscript|Superscript|JustifyLeft|JustifyCenter|JustifyRight|JustifyFull|Outdent|Indent|InsertOrderedList|InsertUnorderedList|InsertHorizontalRule)$/i ;