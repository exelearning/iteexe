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
 * File Name: fck_onload.js
 * 	This is the script that is called when the editor page is loaded inside
 * 	its IFRAME. It's the editor startup.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-30 11:38:24
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

// Disable the context menu in the editor (areas outside the editor area).
window.document.oncontextmenu = function( e )
{
	if ( e )
		e.preventDefault() ;	// This is the Gecko way to do that.
	return false ;				// This is the IE way to do that.
}

// Gecko browsers doens't calculate well that IFRAME size so we must 
// recalculate it every time the window size changes.
if ( ! FCKBrowserInfo.IsIE )
{
	window.onresize = function()
	{
		var oFrame = document.getElementById('eEditorArea') ;
		oFrame.height = 0 ;

		var oCell = document.getElementById( FCK.EditMode == FCK_EDITMODE_WYSIWYG ? 'eWysiwygCell' : 'eSource' ) ;	
		var iHeight = oCell.offsetHeight ;
		
		oFrame.height = iHeight - 2 ;
	}
}

// Start the editor as soon as the window is loaded.
window.onload = function()
{
	// There is a bug on Netscape when rendering the frame. It goes over the 
	// right border. So we must correct it.
	if ( FCKBrowserInfo.IsNetscape )
		document.getElementById('eWysiwygCell').style.paddingRight = '2px' ;
	
	FCKScriptLoader.OnEmpty = function()
	{
		FCKScriptLoader.OnEmpty = null ;

		// Override the configurations passed throw the hidden field.
		FCKConfig.LoadHiddenField() ;
		
		// Load the custom configurations file (if defined).
		if ( FCKConfig.CustomConfigurationsPath.length > 0 )
			FCKScriptLoader.AddScript( FCKConfig.CustomConfigurationsPath ) ;
		
		// Load the styles for the configured skin.
		LoadStyles() ;
	}

	// First of all load the configuration file.
	FCKScriptLoader.AddScript( '../fckconfig.js' ) ;
}

function LoadStyles()
{
	FCKScriptLoader.OnEmpty = LoadScripts ;

	// Load the active skin CSS.
	FCKScriptLoader.AddScript( FCKConfig.SkinPath + 'fck_editor.css' ) ;
	FCKScriptLoader.AddScript( FCKConfig.SkinPath + 'fck_contextmenu.css' ) ;
}

function LoadScripts()
{
	FCKScriptLoader.OnEmpty = null ;
	
	
	if ( FCKBrowserInfo.IsIE )
		FCKScriptLoader.AddScript( 'js/fckeditorcode_ie_1.js' ) ;
	else
		FCKScriptLoader.AddScript( 'js/fckeditorcode_gecko_1.js' ) ;
}

function LoadLanguageFile()
{
	FCKScriptLoader.OnEmpty = function()
	{
		// Removes the OnEmpty listener.
		FCKScriptLoader.OnEmpty = null ;
		
		// Correct the editor layout to the correct language direction.
		if ( FCKLang )
			window.document.dir = FCKLang.Dir ;
		
		// Starts the editor.
		FCK.StartEditor() ;
	}
	
	FCKScriptLoader.AddScript( 'lang/' + FCKLanguageManager.ActiveLanguage.Code + '.js' ) ;
}