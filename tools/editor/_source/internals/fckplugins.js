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
 * File Name: fckplugins.js
 * 	Defines the FCKPlugins object that is responsible for loading the Plugins.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-22 11:05:05
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKPlugins = FCK.Plugins = new Object() ;
FCKPlugins.Loaded = false ;
FCKPlugins.Items = new Array() ;

// Set the defined plugins scripts paths.
for ( var i = 0 ; i < FCKConfig.Plugins.Items.length ; i++ )
{
	var oItem = FCKConfig.Plugins.Items[i] ;
	FCKPlugins.Items.addItem( new FCKPlugin( oItem[0], oItem[1] ) ) ;
}
	
FCKPlugins.Load = function()
{
	// Load all items.
	for ( var i = 0 ; i < this.Items.length ; i++ )
		this.Items[i].Load() ;
	
	// Mark as loaded.
	this.Loaded = true ;
	
	// This is a self destroyable function (must be called once).
	FCKPlugins.Load = null ;
}