<%@ CodePage=65001 Language="VBScript"%>
<%
Option Explicit
%>
<!--
 * FCKeditor - The text editor for internet
 * Copyright (C) 2003-2004 Frederico Caldeira Knabben
 * 
 * Licensed under the terms of the GNU Lesser General Public License:
 * 		http://www.opensource.org/licenses/lgpl-license.php
 * 
 * For further information visit:
 * 		http://www.fckeditor.net/
 * 
 * File Name: connector.asp
 * 	This is the File Manager Connector for ASP.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-10 16:43:33
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
-->
<!--#include file="util.asp"-->
<!--#include file="io.asp"-->
<!--#include file="basexml.asp"-->
<!--#include file="commands.asp"-->
<!--#include file="class_upload.asp"-->
<%
' Get the "UserFiles" path.
Dim sUserFilesPath
sUserFilesPath = Request.QueryString("ServerPath")

If ( sUserFilesPath = "" ) Then 
	sUserFilesPath = "/UserFiles/"
ElseIf ( Right( sUserFilesPath, 1 ) <> "/" ) Then
	sUserFilesPath = sUserFilesPath & "/"
End If

' Map the "UserFiles" path to a local directory.
Dim sUserFilesDirectory
sUserFilesDirectory = Server.MapPath( sUserFilesPath )

If ( Right( sUserFilesDirectory, 1 ) <> "\" ) Then
	sUserFilesDirectory = sUserFilesDirectory & "\"
End If

DoResponse

Sub DoResponse()
	Dim sCommand, sResourceType, sCurrentFolder
	
	' Get the main request informaiton.
	sCommand = Request.QueryString("Command")
	If ( sCommand = "" ) Then Exit Sub

	sResourceType = Request.QueryString("Type")
	If ( sResourceType = "" ) Then Exit Sub

	sCurrentFolder = Request.QueryString("CurrentFolder")
	If ( sCurrentFolder = "" ) Then Exit Sub

	' Check the current folder syntax (must begin and start with a slash).
	If ( Right( sCurrentFolder, 1 ) <> "/" ) Then sCurrentFolder = sCurrentFolder & "/"
	If ( Left( sCurrentFolder, 1 ) <> "/" ) Then sCurrentFolder = "/" & sCurrentFolder

	' File Upload doesn't have to Return XML, so it must be intercepted before anything.
	If ( sCommand = "FileUpload" ) Then
		FileUpload sResourceType, sCurrentFolder
		Exit Sub
	End If

	' Cleans the response buffer.
	Response.Clear()

	' Prevent the browser from caching the result.
	Response.CacheControl = "no-cache"

	' Set the response format.
	Response.CharSet		= "UTF-8"
	Response.ContentType	= "text/xml"

	CreateXmlHeader sCommand, sResourceType, sCurrentFolder

	' Execute the required command.
	Select Case sCommand
		Case "GetFolders"
			GetFolders sResourceType, sCurrentFolder
		Case "GetFoldersAndFiles"
			GetFoldersAndFiles sResourceType, sCurrentFolder
		Case "CreateFolder"
			CreateFolder sResourceType, sCurrentFolder
	End Select

	CreateXmlFooter

	Response.End
End Sub
%>