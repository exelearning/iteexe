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
 * File Name: fckxml.js
 * 	FCKXml Class: class to load and manipulate XML files.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-22 11:13:07
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKXml = function()
{}

FCKXml.prototype.GetHttpRequest = function()
{
	if ( window.XMLHttpRequest )		// Gecko
		return new XMLHttpRequest() ;
	else if ( window.ActiveXObject )	// IE
		return new ActiveXObject("MsXml2.XmlHttp") ;
}

FCKXml.prototype.LoadUrl = function( urlToCall, asyncFunctionPointer )
{
	var oFCKXml = this ;

	var bAsync = ( typeof(asyncFunctionPointer) == 'function' ) ;

	var oXmlHttp = this.GetHttpRequest() ;

	oXmlHttp.open( "GET", urlToCall, bAsync ) ;
	
	if ( bAsync )
	{	
		oXmlHttp.onreadystatechange = function() 
		{
			if ( oXmlHttp.readyState == 4 )
			{
				oFCKXml.DOMDocument = oXmlHttp.responseXML ;
				asyncFunctionPointer( oFCKXml ) ;
			}
		}
	}
	
	oXmlHttp.send( null ) ;
	
	if ( ! bAsync && oXmlHttp.status && oXmlHttp.status == 200 )
		this.DOMDocument = oXmlHttp.responseXML ;
	else
		throw( 'Error loading "' + urlToCall + '"' ) ;
}

FCKXml.prototype.SelectNodes = function( xpath, contextNode )
{
	if ( document.all )		// IE
	{
		if ( contextNode )
			return contextNode.selectNodes( xpath ) ;
		else
			return this.DOMDocument.selectNodes( xpath ) ;
	}
	else					// Gecko
	{
		var aNodeArray = new Array();

		var xPathResult = this.DOMDocument.evaluate( xpath, contextNode ? contextNode : this.DOMDocument, 
				this.DOMDocument.createNSResolver(this.DOMDocument.documentElement), XPathResult.ORDERED_NODE_ITERATOR_TYPE, null) ;
		if ( xPathResult ) 
		{
			var oNode = xPathResult.iterateNext() ;
 			while( oNode )
 			{
 				aNodeArray[aNodeArray.length] = oNode ;
 				oNode = xPathResult.iterateNext();
 			}
		} 
		return aNodeArray ;
	}
}

FCKXml.prototype.SelectSingleNode = function( xpath, contextNode ) 
{
	if ( document.all )		// IE
	{
		if ( contextNode )
			return contextNode.selectSingleNode( xpath ) ;
		else
			return this.DOMDocument.selectSingleNode( xpath ) ;
	}
	else					// Gecko
	{
		var xPathResult = this.DOMDocument.evaluate( xpath, contextNode ? contextNode : this.DOMDocument,
				this.DOMDocument.createNSResolver(this.DOMDocument.documentElement), 9, null);

		if ( xPathResult && xPathResult.singleNodeValue )
			return xPathResult.singleNodeValue ;
		else	
			return null ;
	}
}
