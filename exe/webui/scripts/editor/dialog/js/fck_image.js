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
 * File Name: fck_image.js
 * 	Scripts related to the Link dialog window (see fck_link.html).
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 14:11:04
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

var oEditor = window.parent.InnerDialogLoaded() ;
var FCK		= oEditor.FCK ;

//#### Dialog Tabs

// Set the dialog tabs.
window.parent.AddTab( 'Info', oEditor.FCKLang.DlgImgInfoTab ) ;
// TODO : Enable File Upload (1/3).
//window.parent.AddTab( 'Upload', 'Upload', true ) ;
window.parent.AddTab( 'Advanced', oEditor.FCKLang.DlgAdvancedTag ) ;

// Function called when a dialog tag is selected.
function OnDialogTabChange( tabCode )
{
	ShowE('divInfo'		, ( tabCode == 'Info' ) ) ;
// TODO : Enable File Upload (2/3).
//	ShowE('divUpload'	, ( tabCode == 'Upload' ) ) ;
	ShowE('divAdvanced'	, ( tabCode == 'Advanced' ) ) ;
}

// Get the selected image (if available).
var oImage = FCK.Selection.GetSelectedElement( 'IMG' ) ;

var oImageOriginal ;

function UpdateOriginal( resetSize )
{
	oImageOriginal = document.createElement( 'IMG' ) ;	// new Image() ;
	
	if ( resetSize )
	{
		oImageOriginal.onload = function()
		{
			this.onload = null ;
			ResetSizes() ;
		}
	}

	oImageOriginal.src = GetE('imgPreview').src ;
}

window.onload = function()
{
	// Translate the dialog box texts.
	oEditor.FCKLanguageManager.TranslatePage(document) ;
	
	GetE('btnLockSizes').title = oEditor.FCKLang.DlgImgLockRatio ;
	GetE('btnResetSize').title = oEditor.FCKLang.DlgBtnResetSize ;

	// Load the selected element information (if any).
	LoadSelection() ;
	
	// Show/Hide the "Browse Server" button.
	GetE('tdBrowse').style.display = oEditor.FCKConfig.ImageBrowser ? '' : 'none' ;
	
	UpdateOriginal() ;

	window.parent.SetAutoSize( true ) ;
	
	// Activate the "OK" button.
	window.parent.SetOkButton( true ) ;
}

function LoadSelection()
{
	if ( ! oImage ) return ;

	var sUrl = GetAttribute( oImage, 'src', '' ) ;

	// TODO: Wait stable version and remove the following commented lines.
//	if ( sUrl.startsWith( FCK.BaseUrl ) )
//		sUrl = sUrl.remove( 0, FCK.BaseUrl.length ) ;
	
	GetE('txtUrl').value    = sUrl ;
	GetE('txtAlt').value    = GetAttribute( oImage, 'alt', '' ) ;
	GetE('txtVSpace').value	= GetAttribute( oImage, 'vspace', '' ) ;
	GetE('txtHSpace').value	= GetAttribute( oImage, 'hspace', '' ) ;
	GetE('txtBorder').value	= GetAttribute( oImage, 'border', '' ) ;
	GetE('cmbAlign').value	= GetAttribute( oImage, 'align', '' ) ;

	if ( oImage.style.pixelWidth > 0 )
		GetE('txtWidth').value  = oImage.style.pixelWidth ;
	else
		GetE('txtWidth').value  = GetAttribute( oImage, "width", '' ) ;
		
	if ( oImage.style.pixelHeight > 0 )
		GetE('txtHeight').value  = oImage.style.pixelHeight ;
	else
		GetE('txtHeight').value = GetAttribute( oImage, "height", '' ) ;
	
	// Get Advances Attributes
	GetE('txtAttId').value			= oImage.id ;
	GetE('cmbAttLangDir').value		= oImage.dir ;
	GetE('txtAttLangCode').value	= oImage.lang ;
	GetE('txtAttTitle').value		= oImage.title ;
	GetE('txtAttClasses').value		= oImage.getAttribute('class',2) || '' ;
	GetE('txtLongDesc').value		= oImage.longDesc ;
	
	if ( oEditor.FCKBrowserInfo.IsIE ) 
		GetE('txtAttStyle').value	= oImage.style.cssText ;
	else
		GetE('txtAttStyle').value	= oImage.getAttribute('style',2) ;
		
	UpdatePreview() ;
}

//#### The OK button was hit.
function Ok()
{
	if ( GetE('txtUrl').value.length == 0 )
	{
		window.parent.SetSelectedTab( 'Info' ) ;
		GetE('txtUrl').focus() ;
		
		alert( oEditor.FCKLang.DlgImgAlertUrl ) ;
		
		return false ;
	}

	if ( !oImage )
		oImage = FCK.CreateElement( 'IMG' ) ;

	UpdateImage( oImage ) ;

	return true ;
}

function UpdateImage( e, skipId )
{
	e.src = GetE('txtUrl').value ;
	SetAttribute( e, "alt"   , GetE('txtAlt').value ) ;		
	SetAttribute( e, "width" , GetE('txtWidth').value ) ;		
	SetAttribute( e, "height", GetE('txtHeight').value ) ;		
	SetAttribute( e, "vspace", GetE('txtVSpace').value ) ;		
	SetAttribute( e, "hspace", GetE('txtHSpace').value ) ;		
	SetAttribute( e, "border", GetE('txtBorder').value ) ;		
	SetAttribute( e, "align" , GetE('cmbAlign').value ) ;
	
	// Advances Attributes
	
	if ( ! skipId )
		SetAttribute( e, 'id', GetE('txtAttId').value ) ;
	
	SetAttribute( e, 'dir'		, GetE('cmbAttLangDir').value ) ;
	SetAttribute( e, 'lang'		, GetE('txtAttLangCode').value ) ;
	SetAttribute( e, 'title'	, GetE('txtAttTitle').value ) ;
	SetAttribute( e, 'class'	, GetE('txtAttClasses').value ) ;
	SetAttribute( e, 'longDesc'	, GetE('txtLongDesc').value ) ;

	if ( oEditor.FCKBrowserInfo.IsIE ) 
		e.style.cssText = GetE('txtAttStyle').value ;
	else
		SetAttribute( e, 'style', GetE('txtAttStyle').value ) ;
}

function UpdatePreview()
{
	if ( GetE('txtUrl').value.length == 0 )
		GetE('imgPreview').style.display = 'none' ;
	else
		UpdateImage( GetE('imgPreview'), true ) ;
}

var bLockRatio = true ;

function SwitchLock( lockButton )
{
	bLockRatio = !bLockRatio ;
	lockButton.className = bLockRatio ? 'BtnLocked' : 'BtnUnlocked' ;
	lockButton.title = bLockRatio ? 'Lock sizes' : 'Unlock sizes' ;
	
	if ( bLockRatio )
	{
		if ( GetE('txtWidth').value.length > 0 )
			OnSizeChanged( 'Width', GetE('txtWidth').value ) ;
		else
			OnSizeChanged( 'Height', GetE('txtHeight').value ) ;
	}
}

// Fired when the width or height input texts change
function OnSizeChanged( dimension, value ) 
{
	// Verifies if the aspect ration has to be mantained
	if ( oImageOriginal && bLockRatio )
	{
		if ( value.length == 0 || isNaN( value ) )
		{
			GetE('txtHeight').value = GetE('txtWidth').value = '' ;
			return ;
		}
	
		if ( dimension == 'Width' )
			GetE('txtHeight').value = Math.round( oImageOriginal.height * ( value  / oImageOriginal.width ) ) ;
		else
			GetE('txtWidth').value  = Math.round( oImageOriginal.width  * ( value / oImageOriginal.height ) ) ;
	}
	
	UpdatePreview() ;
}

// Fired when the Reset Size button is clicked
function ResetSizes()
{
	if ( ! oImageOriginal ) return ;

	GetE('txtWidth').value  = oImageOriginal.width ;
	GetE('txtHeight').value = oImageOriginal.height ;
	
	UpdatePreview() ;
}

function BrowseServer()
{
	// Set the browser window feature.
	var iWidth	= oEditor.FCKConfig.ImageBrowserWindowWidth ;
	var iHeight	= oEditor.FCKConfig.ImageBrowserWindowHeight ;
	
	var iLeft = (screen.width  - iWidth) / 2 ;
	var iTop  = (screen.height - iHeight) / 2 ;

	var sOptions = "toolbar=no,status=no,resizable=yes,dependent=yes" ;
	sOptions += ",width=" + iWidth ; 
	sOptions += ",height=" + iHeight ;
	sOptions += ",left=" + iLeft ;
	sOptions += ",top=" + iTop ;

	// Open the browser window.
	var oWindow = window.open( oEditor.FCKConfig.ImageBrowserURL, "FCKBrowseWindow", sOptions ) ;
}

function SetUrl( url )
{
	document.getElementById('txtUrl').value = url ;
	GetE('txtHeight').value = GetE('txtWidth').value = '' ;
	UpdatePreview() ;
	UpdateOriginal( true ) ;
}