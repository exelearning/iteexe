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
 * File Name: fr.js
 * 	French language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 01:57:31
 * 
 * File Authors:
 * 		Hubert Garrido (webmaster@liane.net)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Masquer Outils",
ToolbarExpand		: "Afficher Outils",	

// Toolbar Items and Context Menu
Save				: "Enregistrer",
NewPage				: "Nouvelle Page",
Preview				: "Prévisualisation",
Cut					: "Couper",
Copy				: "Copier",
Paste				: "Coller",
PasteText			: "Coller comme texte",
PasteWord			: "Coller de Word",
Print				: "Imprimer",
SelectAll			: "Tout sélectionner",
RemoveFormat		: "Supprimer Format",
InsertLinkLbl		: "Lien",
InsertLink			: "Insérer/Modifier Lien",
RemoveLink			: "Supprimer Lien",
InsertImageLbl		: "Image",
InsertImage			: "Insérer/Modifier Image",
InsertTableLbl		: "Tableau",
InsertTable			: "Insérer/Modifier Tableau",
InsertLineLbl		: "Séparateur",
InsertLine			: "Insérer Séparateur",
InsertSpecialCharLbl: "Caractère Spécial",
InsertSpecialChar	: "Insérer Caractère Spécial",
InsertSmileyLbl		: "Smiley",
InsertSmiley		: "Insérer Smiley",
About				: "A propos de FCKeditor",
Bold				: "Gras",
Italic				: "Italique",
Underline			: "Souligné",
StrikeThrough		: "Barré",
Subscript			: "Indice",
Superscript			: "Exposant",
LeftJustify			: "Aligné à Gauche",
CenterJustify		: "Centré",
RightJustify		: "Aligné à Droite",
BlockJustify		: "Texte Justifié",
DecreaseIndent		: "Diminuer le Retrait",
IncreaseIndent		: "Augmenter le Retrait",
Undo				: "Annuler",
Redo				: "Refaire",
NumberedListLbl		: "Liste Numérotée",
NumberedList		: "Insérer/Supprimer Liste Numérotée",
BulletedListLbl		: "Liste à puces",
BulletedList		: "Insérer/Supprimer Liste à puces",
ShowTableBorders	: "Afficher Bordures de Tableau",
ShowDetails			: "Afficher Caractères Invisibles",
Style				: "Style",
FontFormat			: "Format",
Font				: "Police",
FontSize			: "Taille",
TextColor			: "Couleur de Caractère",
BGColor				: "Couleur de Fond",
Source				: "Source",
Find				: "Chercher",
Replace				: "Remplacer",

// Context Menu
EditLink			: "Modifier Lien",
InsertRow			: "Insérer une Ligne",
DeleteRows			: "Supprimer des Lignes",
InsertColumn		: "Insérer une Colonne",
DeleteColumns		: "Supprimer des Colonnes",
InsertCell			: "Insérer une Cellule",
DeleteCells			: "Supprimer des Cellules",
MergeCells			: "Fusionner les Cellules",
SplitCell			: "Scinder les Cellules",
CellProperties		: "Propriétés de Cellule",
TableProperties		: "Propriétés de Tableau",
ImageProperties		: "Propriétés d'Image",

FontFormats			: "Normal;Formatted;Address;Titre 1;Titre 2;Heading 3;Titre 4;Titre 5;Titre 6",

// Alerts and Messages
ProcessingXHTML		: "Calcul XHTML. Veuillez patienter...",
Done				: "Terminé",
PasteWordConfirm	: "Le texte à coller semble provenir de Word. Désirez-vous le nettoyer avant de coller?",
NotCompatiblePaste	: "Cette commande nécessite Internet Explorer version 5.5 minimum. Souhaitez-vous coller sans nettoyage?",
UnknownToolbarItem	: "Elément de barre d'outil inconnu \"%1\"",
UnknownCommand		: "Nom de commande inconnu \"%1\"",
NotImplemented		: "Commande non encore écrite",
UnknownToolbarSet	: "La barre d'outils \"%1\" n'existe pas",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Annuler",
DlgBtnClose			: "Fermer",
DlgAdvancedTag		: "Avancé",

// General Dialogs Labels
DlgGenNotSet		: "&lt;Par Défaut&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Sens d'Ecriture",
DlgGenLangDirLtr	: "Gauche vers Droite (LTR)",
DlgGenLangDirRtl	: "Droite vers Gauche (RTL)",
DlgGenLangCode		: "Code Langue",
DlgGenAccessKey		: "Equivalent Clavier",
DlgGenName			: "Nom",
DlgGenTabIndex		: "Ordre de Tabulation",
DlgGenLongDescr		: "URL de Description Longue",
DlgGenClass			: "Classes de Feuilles de Style",
DlgGenTitle			: "Titre Indicatif",
DlgGenContType		: "Type de Contenu Indicatif",
DlgGenLinkCharset	: "Encodage de Caractère de la cible",
DlgGenStyle			: "Style",

// Image Dialog
DlgImgTitle			: "Propriétés d'Image",
DlgImgInfoTab		: "Informations sur l'Image",
DlgImgBtnUpload		: "Envoyer au Serveur",
DlgImgURL			: "URL",
DlgImgUpload		: "Upload",
DlgImgBtnBrowse		: "Parcourir le Serveur",
DlgImgAlt			: "Texte de Remplacement",
DlgImgWidth			: "Largeur",
DlgImgHeight		: "Hauteur",
DlgImgLockRatio		: "Garder proportions",
DlgBtnResetSize		: "Taille Originale",
DlgImgBorder		: "Bordure",
DlgImgHSpace		: "HSpace",
DlgImgVSpace		: "VSpace",
DlgImgAlign			: "Alignement",
DlgImgAlignLeft		: "Gauche",
DlgImgAlignAbsBottom: "Abs Bas",
DlgImgAlignAbsMiddle: "Abs Milieu",
DlgImgAlignBaseline	: "Bas du texte",
DlgImgAlignBottom	: "Bas",
DlgImgAlignMiddle	: "Milieu",
DlgImgAlignRight	: "Droite",
DlgImgAlignTextTop	: "Haut du texte",
DlgImgAlignTop		: "Haut",
DlgImgPreview		: "Prévisualisation",
DlgImgMsgWrongExt	: "Désolé, seuls les types de fichiers suivants sont permis:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOpération annulée.",
DlgImgAlertSelect	: "Veuillez sélectionner une image à envoyer.",
DlgImgAlertUrl		: "Veuillez saisir l'URL de l'image",

// Link Dialog
DlgLnkWindowTitle	: "Propriétés de Lien",
DlgLnkInfoTab		: "Informations sur le Lien",
DlgLnkTargetTab		: "Destination",

DlgLnkType			: "Type de Lien",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Ancre dans cette page",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protocole",
DlgLnkProtoOther	: "&lt;autre&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Parcourir le Serveur",
DlgLnkAnchorSel		: "Sélectionner une Ancre",
DlgLnkAnchorByName	: "Par Nom d'Ancre",
DlgLnkAnchorById	: "Par Id d'Elément",
DlgLnkNoAnchors		: "&lt;Pas d'ancre disponible dans le document&gt;",
DlgLnkEMail			: "Adresse E-Mail",
DlgLnkEMailSubject	: "Sujet du Message",
DlgLnkEMailBody		: "Corps du Message",
DlgLnkUpload		: "Upload",
DlgLnkBtnUpload		: "Envoyer au Serveur",

DlgLnkTarget		: "Destination",
DlgLnkTargetFrame	: "&lt;cadre&gt;",
DlgLnkTargetPopup	: "&lt;fenêtre popup&gt;",
DlgLnkTargetBlank	: "Nouvelle Fenêtre (_blank)",
DlgLnkTargetParent	: "Fenêtre Mère (_parent)",
DlgLnkTargetSelf	: "Même Fenêtre (_self)",
DlgLnkTargetTop		: "Fenêtre Supérieure (_top)",
DlgLnkTargetFrame	: "Nom du Cadre de Destination",
DlgLnkPopWinName	: "Nom de la Fenêtre Popup",
DlgLnkPopWinFeat	: "Caractéristiques de la Fenêtre Popup",
DlgLnkPopResize		: "Taille Modifiable",
DlgLnkPopLocation	: "Barre d'Adresses",
DlgLnkPopMenu		: "Barre de Menu",
DlgLnkPopScroll		: "Barres de Défilement",
DlgLnkPopStatus		: "Barre d'Etat",
DlgLnkPopToolbar	: "Barre d'Outils",
DlgLnkPopFullScrn	: "Plein Ecran (IE)",
DlgLnkPopDependent	: "Dépendante (Netscape)",
DlgLnkPopWidth		: "Largeur",
DlgLnkPopHeight		: "Hauteur",
DlgLnkPopLeft		: "Position Gauche",
DlgLnkPopTop		: "Position Haut",

DlgLnkMsgWrongExtA	: "Désolé, seuls les types de fichiers suivants sont permis:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOpération annulée.",
DlgLnkMsgWrongExtD	: "Désolé, les types de fichiers suivants sont interdits:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOpération annulée.",

DlnLnkMsgNoUrl		: "Veuillez saisir l'URL",		
DlnLnkMsgNoEMail	: "Veuillez saisir l'adresse e-mail",	
DlnLnkMsgNoAnchor	: "Veuillez sélectionner une ancre",		

// Color Dialog
DlgColorTitle		: "Sélectionner",
DlgColorBtnClear	: "Effacer",
DlgColorHighlight	: "Highlight",
DlgColorSelected	: "Sélectionné",

// Smiley Dialog
DlgSmileyTitle		: "Insérer Smiley",

// Special Character Dialog
DlgSpecialCharTitle	: "Insérer Caractère Spécial",

// Table Dialog
DlgTableTitle		: "Propriétés de Tableau",
DlgTableRows		: "Lignes",
DlgTableColumns		: "Colonnes",
DlgTableBorder		: "Bordure",
DlgTableAlign		: "Alignement",
DlgTableAlignNotSet	: "<Par Défaut>",
DlgTableAlignLeft	: "Gauche",
DlgTableAlignCenter	: "Centré",
DlgTableAlignRight	: "Droite",
DlgTableWidth		: "Largeur",
DlgTableWidthPx		: "pixels",
DlgTableWidthPc		: "pourcentage",
DlgTableHeight		: "Hauteur",
DlgTableCellSpace	: "Espacement",
DlgTableCellPad		: "Contour",
DlgTableCaption		: "Titre",

// Table Cell Dialog
DlgCellTitle		: "Propriétés de cellule",
DlgCellWidth		: "Largeur",
DlgCellWidthPx		: "pixels",
DlgCellWidthPc		: "pourcentage",
DlgCellHeight		: "Hauteur",
DlgCellWordWrap		: "Retour à la ligne",
DlgCellWordWrapNotSet	: "<Par Défaut>",
DlgCellWordWrapYes	: "Oui",
DlgCellWordWrapNo	: "Non",
DlgCellHorAlign		: "Alignement Horizontal",
DlgCellHorAlignNotSet	: "<Par Défaut>",
DlgCellHorAlignLeft	: "Gauche",
DlgCellHorAlignCenter	: "Centré",
DlgCellHorAlignRight: "Droite",
DlgCellVerAlign		: "Alignement Vertical",
DlgCellVerAlignNotSet	: "<Par Défaut>",
DlgCellVerAlignTop	: "Haut",
DlgCellVerAlignMiddle	: "Milieu",
DlgCellVerAlignBottom	: "Bas",
DlgCellVerAlignBaseline	: "Bas du texte",
DlgCellRowSpan		: "Lignes Fusionnées",
DlgCellCollSpan		: "Colonnes Fusionnées",
DlgCellBackColor	: "Fond",
DlgCellBorderColor	: "Bordure",
DlgCellBtnSelect	: "Choisir...",

// Find Dialog
DlgFindTitle		: "Chercher",
DlgFindFindBtn		: "Chercher",
DlgFindNotFoundMsg	: "Le texte indiqué est introuvable.",

// Replace Dialog
DlgReplaceTitle			: "Remplacer",
DlgReplaceFindLbl		: "Rechercher:",
DlgReplaceReplaceLbl	: "Remplacer par:",
DlgReplaceCaseChk		: "Respecter la casse",
DlgReplaceReplaceBtn	: "Remplacer",
DlgReplaceReplAllBtn	: "Tout remplacer",
DlgReplaceWordChk		: "Mot entier",

// Paste Operations / Dialog
PasteErrorPaste	: "Les paramètres de sécurité de votre navigateur empêchent l'éditeur de coller automatiquement vos données. Veuillez utiliser les équivalents claviers (Ctrl+V).",
PasteErrorCut	: "Les paramètres de sécurité de votre navigateur empêchent l'éditeur de couper automatiquement vos données. Veuillez utiliser les équivalents claviers (Ctrl+X).",
PasteErrorCopy	: "Les paramètres de sécurité de votre navigateur empêchent l'éditeur de copier automatiquement vos données. Veuillez utiliser les équivalents claviers (Ctrl+C).",

PasteAsText		: "Coller comme texte",
PasteFromWord	: "Coller à partir de Word",

DlgPasteMsg		: "L'éditeur n'a pu coller automatiquement vos données à cause des <STRONG>paramètres de sécurité</STRONG> de votre navigateur.<BR>Veuillez coller dans la zone suivante en utilisant le clavier (<STRONG>Ctrl+V</STRONG>) et cliquez sur <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatique",
ColorMoreColors	: "Plus de Couleurs...",

// About Dialog
DlgAboutVersion	: "version",
DlgAboutLicense	: "License selon les termes de GNU Lesser General Public License",
DlgAboutInfo	: "Pour plus d'informations, aller à"
}