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
 * File Name: commands.asp
 * 	This file include the functions that handle the Command requests
 * 	in the ASP Connector.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-10 17:00:56
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
-->
<%
Sub GetFolders( resourceType, currentFolder )
	' Map the virtual path to the local server path.
	Dim sServerDir
	sServerDir = ServerMapFolder( resourceType, currentFolder )

	' Open the "Folders" node.
	Response.Write "<Folders>"

	Dim oFSO, oCurrentFolder, oFolders, oFolder
	Set oFSO = Server.CreateObject( "Scripting.FileSystemObject" )
	Set oCurrentFolder = oFSO.GetFolder( sServerDir )
	Set oFolders = oCurrentFolder.SubFolders

	For Each oFolder in oFolders
		Response.Write "<Folder name=""" & ConvertToXmlAttribute( oFolder.name ) & """ />"
	Next
	
	Set oFSO = Nothing
	
	' Close the "Folders" node.
	Response.Write "</Folders>"
End Sub

Sub GetFoldersAndFiles( resourceType, currentFolder )
	' Map the virtual path to the local server path.
	Dim sServerDir
	sServerDir = ServerMapFolder( resourceType, currentFolder )

	Dim oFSO, oCurrentFolder, oFolders, oFolder, oFiles, oFile
	Set oFSO = Server.CreateObject( "Scripting.FileSystemObject" )
	Set oCurrentFolder = oFSO.GetFolder( sServerDir )
	Set oFolders	= oCurrentFolder.SubFolders
	Set oFiles		= oCurrentFolder.Files
	
	' Open the "Folders" node.
	Response.Write "<Folders>"
	
	For Each oFolder in oFolders
		Response.Write "<Folder name=""" & ConvertToXmlAttribute( oFolder.name ) & """ />"
	Next
	
	' Close the "Folders" node.
	Response.Write "</Folders>"
		
	' Open the "Files" node.
	Response.Write "<Files>"
	
	For Each oFile in oFiles
		Dim iFileSize
		iFileSize = Round( oFile.size / 1024 )
		If ( iFileSize < 1 AND oFile.size <> 0 ) Then iFileSize = 1
		
		Response.Write "<File name=""" & ConvertToXmlAttribute( oFile.name ) & """ size=""" & iFileSize & """ />"
	Next
	
	' Close the "Files" node.
	Response.Write "</Files>"
End Sub

Sub CreateFolder( resourceType, currentFolder )
	Dim sErrorNumber

	Dim sNewFolderName
	sNewFolderName = Request.QueryString( "NewFolderName" )

	If ( sNewFolderName = "" ) Then
		sErrorNumber = "102"
	Else
		' Map the virtual path to the local server path of the current folder.
		Dim sServerDir
		sServerDir = ServerMapFolder( resourceType, currentFolder & "/" & sNewFolderName )
		
		On Error Resume Next

		CreateServerFolder sServerDir
		
		Dim iErrNumber, sErrDescription
		iErrNumber		= err.number
		sErrDescription	= err.Description
		
		On Error Goto 0
		
		Select Case iErrNumber
			Case 0
				sErrorNumber = "0"
			Case 52
				sErrorNumber = "102"	' Invalid Folder Name.
			Case 70
				sErrorNumber = "103"	' Security Error.
			Case 76
				sErrorNumber = "102"	' Path too long.
			Case Else
				sErrorNumber = "110"
		End Select
	End If

	' Create the "Error" node.
	Response.Write "<Error number=""" & sErrorNumber & """ originalNumber=""" & iErrNumber & """ originalDescription=""" & ConvertToXmlAttribute( sErrDescription ) & """ />"
End Sub

Sub FileUpload( resourceType, currentFolder )
	Dim oUploader
	Set oUploader = New FileUploader
	oUploader.Upload

	Dim oFile
	
	If ( oUploader.Files.Count > 0 ) Then
		' Get the first file (this was the only way it worked).
		For Each oFile in oUploader.Files.Items
			Exit For
		Next
	End If

	Dim sErrorNumber
	sErrorNumber = "0"
	
	Dim sFileName, sOriginalFileName
	sFileName = ""

	If ( IsEmpty( oFile ) = False ) Then
		' Map the virtual path to the local server path.
		Dim sServerDir
		sServerDir = ServerMapFolder( resourceType, currentFolder )

		Dim oFSO
		Set oFSO = Server.CreateObject( "Scripting.FileSystemObject" )
	
		' Get the uploaded file name.
		sFileName = oFSO.GetFileName( oFile.FileName )
		sOriginalFileName = sFileName

		Dim iCounter
		iCounter = 0

		Do While ( True )
			Dim sFilePath
			sFilePath = sServerDir & sFileName

			If ( oFSO.FileExists( sFilePath ) ) Then
				iCounter = iCounter + 1
				sFileName = RemoveExtension( sOriginalFileName ) & "(" & iCounter & ")." & oFSO.GetExtensionName( sFileName )
				sErrorNumber = "201"
			Else
				oFile.SaveToDisk( sFilePath )
				Exit Do
			End If
		Loop
	Else
		sErrorNumber = "202"
	End If

	Response.Clear

	Response.Write "<script type=""text/javascript"">"
	Response.Write "window.parent.frames['frmUpload'].OnUploadCompleted(" & sErrorNumber & ",'" & Replace( sFileName, "'", "\'" ) & "') ;"
	Response.Write "</script>"

	Response.End
End Sub
%>