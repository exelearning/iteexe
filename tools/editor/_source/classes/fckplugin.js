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
 * File Name: fckplugin.js
 * 	FCKPlugin Class: Represents a single plugin.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-22 11:12:10
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

// Certifies that the "PluginsPath" configuration ends with a slash.
if ( !FCKConfig.PluginsPath.endsWith('/') )
	FCKConfig.PluginsPath += '/' ;

var FCKPlugin = function( name, availableLangs )
{
	this.Name = name ;
	this.Path = FCKConfig.PluginsPath + name + '/' ;
	
	if ( availableLangs.length == 0 )
		this.AvailableLangs = new Array() ;
	else
		this.AvailableLangs = availableLangs.split(',') ;
}

FCKPlugin.prototype.Load = function()
{
	// Load the language file, if defined.
	if ( this.AvailableLangs.length > 0 )
	{
		// Check if the plugin has the language file for the active language.
		if ( this.AvailableLangs.indexOf( FCKLanguageManager.ActiveLanguage.Code ) >= 0 )
			var sLang = FCKLanguageManager.ActiveLanguage.Code ;
		else
			// Load the default language file (first one) if the current one is not available.
			var sLang = this.AvailableLangs[0] ;
		
		// Add the main plugin script.
		FCKScriptLoader.AddScript( this.Path + 'lang/' + sLang + '.js' ) ;		
	}
		
	// Add the main plugin script.
	FCKScriptLoader.AddScript( this.Path + 'fckplugin.js' ) ;
}