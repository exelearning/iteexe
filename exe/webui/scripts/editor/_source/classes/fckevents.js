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
 * File Name: fckevents.js
 * 	FCKEvents Class: used to handle events is a advanced way.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-04 16:52:36
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKEvents = function( eventsOwner )
{
	this.Owner = eventsOwner ;
	this.RegisteredEvents = new Object() ;
}

FCKEvents.prototype.AttachEvent = function( eventName, functionPointer, params )
{
	if ( ! this.RegisteredEvents[ eventName ] ) this.RegisteredEvents[ eventName ] = new Array() ;
	
	this.RegisteredEvents[ eventName ][ this.RegisteredEvents[ eventName ].length ] = functionPointer ;
}

FCKEvents.prototype.FireEvent = function( eventName, params )
{
	var bReturnValue = true ;
	
	FCKDebug.Output( 'Firing event: ' + eventName, 'Fuchsia' ) ;
	
	var oCalls = this.RegisteredEvents[ eventName ] ;
	if ( oCalls ) 
	{
		for ( var i = 0 ; i < oCalls.length ; i++ )
		{
			if ( typeof( oCalls[ i ] ) == "function" )	// A Function Pointer
				bReturnValue = ( bReturnValue && oCalls[ i ]( params ) ) ;
			else										// A string (code to run)
				bReturnValue = ( bReturnValue && eval( oCalls[ i ] ) ) ;
		}
	}
	
	return bReturnValue ;
}

