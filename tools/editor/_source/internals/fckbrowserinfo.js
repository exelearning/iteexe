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
 * File Name: fckbrowserinfo.js
 * 	Defines the FCKBrowserInfo object that hold some browser informations.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-26 01:20:34
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var FCKBrowserInfo = new Object() ;

var sAgent = navigator.userAgent.toLowerCase() ;

FCKBrowserInfo.IsIE			= sAgent.indexOf("msie") != -1 ;
FCKBrowserInfo.IsGecko		= !FCKBrowserInfo.IsIE ;
FCKBrowserInfo.IsNetscape	= sAgent.indexOf("netscape") != -1 ;

if ( FCKBrowserInfo.IsIE )
{
	FCKBrowserInfo.MajorVer = navigator.appVersion.match(/MSIE (.)/)[1] ;
	FCKBrowserInfo.MinorVer = navigator.appVersion.match(/MSIE .\.(.)/)[1] ;
}
else
{
	// TODO: Other browsers
	FCKBrowserInfo.MajorVer = 0 ;
	FCKBrowserInfo.MinorVer = 0 ;
}

FCKBrowserInfo.IsIE55OrMore = FCKBrowserInfo.IsIE && ( FCKBrowserInfo.MajorVer > 5 || FCKBrowserInfo.MinorVer >= 5 ) ;