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
 * File Name: gr.js
 * 	Greek language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-11-29 09:51:40
 * 
 * File Authors:
 * 		Spyros Barbatos (sbarbatos{at}users.sourceforge.net)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Απόκρυψη Μπάρας Εργαλείων",
ToolbarExpand		: "Εμφάνιση Μπάρας Εργαλείων",

// Toolbar Items and Context Menu
Save				: "Αποθήκευση",
NewPage				: "Νέα Σελίδα",
Preview				: "Προεπισκόπιση",
Cut					: "Αποκοπή",
Copy				: "Αντιγραφή",
Paste				: "Επικόλληση",
PasteText			: "Επικόλληση (απλό κείμενο)",
PasteWord			: "Επικόλληση από το Word",
Print				: "Εκτύπωση",
SelectAll			: "Επιλογή όλων",
RemoveFormat		: "Αφαίρεση Μορφοποίησης",
InsertLinkLbl		: "Σύνδεσμος (Link)",
InsertLink			: "Εισαγωγή/Μεταβολή Συνδέσμου (Link)",
RemoveLink			: "Αφαίρεση Συνδέσμου (Link)",
InsertImageLbl		: "Εικόνα",
InsertImage			: "Εισαγωγή/Μεταβολή Εικόνας",
InsertTableLbl		: "Πίνακας",
InsertTable			: "Εισαγωγή/Μεταβολή Πίνακα",
InsertLineLbl		: "Γραμμή",
InsertLine			: "Εισαγωγή Οριζόντιας Γραμμής",
InsertSpecialCharLbl: "Ειδικό Σύμβολο",
InsertSpecialChar	: "Εισαγωγή Ειδικού Συμβόλου",
InsertSmileyLbl		: "Smiley",
InsertSmiley		: "Εισαγωγή Smiley",
About				: "Περί του FCKeditor",
Bold				: "Έντονα",
Italic				: "Πλάγια",
Underline			: "Υπογράμμιση",
StrikeThrough		: "Διαγράμμιση",
Subscript			: "Δείκτης",
Superscript			: "Εκθέτης",
LeftJustify			: "Στοίχιση Αριστερά",
CenterJustify		: "Στοίχιση στο Κέντρο",
RightJustify		: "Στοίχιση Δεξιά",
BlockJustify		: "Πλήρης Στοίχιση (Block)",
DecreaseIndent		: "Μείωση Εσοχής",
IncreaseIndent		: "Αύξηση Εσοχής",
Undo				: "Undo",
Redo				: "Redo",
NumberedListLbl		: "Λίστα με Αριθμούς",
NumberedList		: "Εισαγωγή/Διαγραφή Λίστας με Αριθμούς",
BulletedListLbl		: "Λίστα με Bullets",
BulletedList		: "Εισαγωγή/Διαγραφή Λίστας με Bullets",
ShowTableBorders	: "Προβολή Ορίων Πίνακα",
ShowDetails			: "Προβολή Λεπτομερειών",
Style				: "Style",
FontFormat			: "Μορφή Γραμματοσειράς",
Font				: "Γραμματοσειρά",
FontSize			: "Μέγεθος",
TextColor			: "Χρώμα Γραμμάτων",
BGColor				: "Χρώμα Υποβάθρου",
Source				: "HTML κώδικας",
Find				: "Αναζήτηση",
Replace				: "Αντικατάσταση",

// Context Menu
EditLink			: "Μεταβολή Συνδέσμου (Link)",
InsertRow			: "Εισαγωγή Γραμμής",
DeleteRows			: "Διαγραφή Γραμμών",
InsertColumn		: "Εισαγωγή Κολώνας",
DeleteColumns		: "Διαγραφή Κολωνών",
InsertCell			: "Εισαγωγή Κελιού",
DeleteCells			: "Διαγραφή Κελιών",
MergeCells			: "Ενοποίηση Κελιών",
SplitCell			: "Διαχωρισμός Κελιού",
CellProperties		: "Ιδιότητες Κελιού",
TableProperties		: "Ιδιότητες Πίνακα",
ImageProperties		: "Ιδιότητες Εικόνας",

FontFormats			: "Normal;Formatted;Address;Heading 1;Heading 2;Heading 3;Heading 4;Heading 5;Heading 6",

// Alerts and Messages
ProcessingXHTML		: "Επεξεργασία XHTML. Παρακαλώ περιμένετε...",
Done				: "Έτοιμο",
PasteWordConfirm	: "Το κείμενο που θέλετε να επικολήσετε, φαίνεται πως προέρχεται από το Word. Θέλετε να καθαριστεί πριν επικοληθεί;",
NotCompatiblePaste	: "Αυτή η επιλογή είναι διαθέσιμη στον Internet Explorer έκδοση 5.5+. Θέλετε να γίνει η επικόλληση χωρίς καθαρισμό;",
UnknownToolbarItem	: "Άγνωστο αντικείμενο της μπάρας εργαλείων \"%1\"",
UnknownCommand		: "Άγνωστή εντολή \"%1\"",
NotImplemented		: "Η εντολή δεν έχει ενεργοποιηθεί",
UnknownToolbarSet	: "Η μπάρα εργαλείων \"%1\" δεν υπάρχει",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Ακύρωση",
DlgBtnClose			: "Κλείσιμο",
DlgAdvancedTag		: "Για προχωρημένους",

// General Dialogs Labels
DlgGenNotSet		: "&lt;χωρίς&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Κατεύθυνση κειμένου",
DlgGenLangDirLtr	: "Αριστερά προς Δεξιά (LTR)",
DlgGenLangDirRtl	: "Δεξιά προς Αριστερά (RTL)",
DlgGenLangCode		: "Κωδικός Γλώσσας",
DlgGenAccessKey		: "Συντόμευση (Access Key)",
DlgGenName			: "Name",
DlgGenTabIndex		: "Tab Index",
DlgGenLongDescr		: "Long Description URL",
DlgGenClass			: "Stylesheet Classes",
DlgGenTitle			: "Advisory Title",
DlgGenContType		: "Advisory Content Type",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Style",

// Image Dialog
DlgImgTitle			: "Ιδιότητες Εικόνας",
DlgImgInfoTab		: "Πληροφορίες Εικόνας",
DlgImgBtnUpload		: "Αποστολή στον Διακομιστή",
DlgImgURL			: "URL",
DlgImgUpload		: "Αποστολή",
DlgImgBtnBrowse		: "Προβολή Αρχείων Διακομιστή",
DlgImgAlt			: "Εναλλακτικό Κείμενο (ALT)",
DlgImgWidth			: "Πλάτος",
DlgImgHeight		: "Ύψος",
DlgImgLockRatio		: "Κλείδωμα Αναλογίας",
DlgBtnResetSize		: "Επαναφορά Αρχικού Μεγέθους",
DlgImgBorder		: "Περιθώριο",
DlgImgHSpace		: "Οριζόντιος Χώρος (HSpace)",
DlgImgVSpace		: "Κάθετος Χώρος (VSpace)",
DlgImgAlign			: "Ευθυγράμμιση (Align)",
DlgImgAlignLeft		: "Αριστερά",
DlgImgAlignAbsBottom: "Απόλυτα Κάτω (Abs Bottom)",
DlgImgAlignAbsMiddle: "Απόλυτα στη Μέση (Abs Middle)",
DlgImgAlignBaseline	: "Γραμμή Βάσης (Baseline)",
DlgImgAlignBottom	: "Κάτω (Bottom)",
DlgImgAlignMiddle	: "Μέση (Middle)",
DlgImgAlignRight	: "Δεξιά (Right)",
DlgImgAlignTextTop	: "Κορυφή Κειμένου (Text Top)",
DlgImgAlignTop		: "Πάνω (Top)",
DlgImgPreview		: "Προεπισκόπιση",
DlgImgMsgWrongExt	: "Δυστυχώς μόνο οι παρακάτω τύποι αρχείων επιτρέπεται να αποσταλλούν:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nΗ εργασία ακυρώθηκε.",
DlgImgAlertSelect	: "Επιλέξτε μία εικόνα για μεταφορά.",
DlgImgAlertUrl		: "Εισάγετε την τοποθεσία (URL) της εικόνας",

// Link Dialog
DlgLnkWindowTitle	: "Υπερσύνδεσμος (Link)",
DlgLnkInfoTab		: "Link",
DlgLnkTargetTab		: "Παράθυρο Στόχος (Target)",

DlgLnkType			: "Τύπος Υπερσυνδέσμου (Link)",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Anchor in this page",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protocol",
DlgLnkProtoOther	: "&lt;άλλο&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Προβολή Αρχείων Διακομιστή",
DlgLnkAnchorSel		: "Επιλέξτε ένα Anchor",
DlgLnkAnchorByName	: "Βάσει του Ονόματος (Name)του Anchor",
DlgLnkAnchorById	: "Βάσει του Element Id",
DlgLnkNoAnchors		: "&lt;Δεν υπάρχουν Anchors στο κείμενο&gt;",
DlgLnkEMail			: "Διεύθυνση Ηλεκτρονικού Ταχυδρομείου",
DlgLnkEMailSubject	: "Θέμα Μηνύματος",
DlgLnkEMailBody		: "Κείμενο Μηνύματος",
DlgLnkUpload		: "Αποστολή",
DlgLnkBtnUpload		: "Αποστολή στον Διακομιστή",

DlgLnkTarget		: "Παράθυρο Στόχος (Target)",
DlgLnkTargetFrame	: "&lt;frame&gt;",
DlgLnkTargetPopup	: "&lt;popup window&gt;",
DlgLnkTargetBlank	: "Νέο Παράθυρο (_blank)",
DlgLnkTargetParent	: "Γονικό Παράθυρο (_parent)",
DlgLnkTargetSelf	: "Ίδιο Παράθυρο (_self)",
DlgLnkTargetTop		: "Ανώτατο Παράθυρο (_top)",
DlgLnkTargetFrame	: "Όνομα Target Frame",
DlgLnkPopWinName	: "Όνομα Popup Window",
DlgLnkPopWinFeat	: "Επιλογές Popup Window",
DlgLnkPopResize		: "Με αλλαγή Μεγέθους",
DlgLnkPopLocation	: "Μπάρα Τοποθεσίας",
DlgLnkPopMenu		: "Μπάρα Menu",
DlgLnkPopScroll		: "Μπάρες Κύλισης",
DlgLnkPopStatus		: "Μπάρα Status",
DlgLnkPopToolbar	: "Μπάρα Εργαλείων",
DlgLnkPopFullScrn	: "Ολόκληρη η Οθόνη (IE)",
DlgLnkPopDependent	: "Dependent (Netscape)",
DlgLnkPopWidth		: "Πλάτος",
DlgLnkPopHeight		: "Ύψος",
DlgLnkPopLeft		: "Τοποθεσία Αριστερής Άκρης",
DlgLnkPopTop		: "Τοποθεσία Πάνω Άκρης",

DlgLnkMsgWrongExtA	: "Δυστυχώς μόνο οι παρακάτω τύποι αρχείων επιτρέπεται να αποσταλλούν:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nΗ εργασία ακυρώθηκε.",
DlgLnkMsgWrongExtD	: "Δυστυχώς οι παρακάτω τύποι αρχείων δεν επιτρέπεται να αποσταλλούν:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nΗ εργασία ακυρώθηκε.",

DlnLnkMsgNoUrl		: "Εισάγετε την τοποθεσία (URL) του υπερσυνδέσμου (Link)",
DlnLnkMsgNoEMail	: "Εισάγετε την διεύθυνση ηλεκτρονικού ταχυδρομείου",
DlnLnkMsgNoAnchor	: "Επιλέξτε ένα Anchor",

// Color Dialog
DlgColorTitle		: "Επιλογή χρώματος",
DlgColorBtnClear	: "Καθαρισμός",
DlgColorHighlight	: "Προεπισκόπιση",
DlgColorSelected	: "Επιλεγμένο",

// Smiley Dialog
DlgSmileyTitle		: "Επιλέξτε ένα Smiley",

// Special Character Dialog
DlgSpecialCharTitle	: "Επιλέξτε ένα Ειδικό Σύμβολο",

// Table Dialog
DlgTableTitle		: "Ιδιότητες Πίνακα",
DlgTableRows		: "Γραμμές",
DlgTableColumns		: "Κολώνες",
DlgTableBorder		: "Μέγεθος Περιθωρίου",
DlgTableAlign		: "Στοίχιση",
DlgTableAlignNotSet	: "<χωρίς>",
DlgTableAlignLeft	: "Αριστερά",
DlgTableAlignCenter	: "Κέντρο",
DlgTableAlignRight	: "Δεξιά",
DlgTableWidth		: "Πλάτος",
DlgTableWidthPx		: "pixels",
DlgTableWidthPc		: "\%",
DlgTableHeight		: "Ύψος",
DlgTableCellSpace	: "Cell spacing",
DlgTableCellPad		: "Cell padding",
DlgTableCaption		: "Υπέρτιτλος",

// Table Cell Dialog
DlgCellTitle		: "Ιδιότητες Κελιού",
DlgCellWidth		: "Πλάτος",
DlgCellWidthPx		: "pixels",
DlgCellWidthPc		: "\%",
DlgCellHeight		: "Ύψος",
DlgCellWordWrap		: "Με αλλαγή γραμμής",
DlgCellWordWrapNotSet	: "<χωρίς>",
DlgCellWordWrapYes	: "Ναι",
DlgCellWordWrapNo	: "Όχι",
DlgCellHorAlign		: "Οριζόντια Στοίχιση",
DlgCellHorAlignNotSet	: "<χωρίς>",
DlgCellHorAlignLeft	: "Αριστερά",
DlgCellHorAlignCenter	: "Κέντρο",
DlgCellHorAlignRight: "Δεξιά",
DlgCellVerAlign		: "Κάθετη Στοίχιση",
DlgCellVerAlignNotSet	: "<χωρίς>",
DlgCellVerAlignTop	: "Πάνω (Top)",
DlgCellVerAlignMiddle	: "Μέση (Middle)",
DlgCellVerAlignBottom	: "Κάτω (Bottom)",
DlgCellVerAlignBaseline	: "Γραμμή Βάσης (Baseline)",
DlgCellRowSpan		: "Αριθμός Γραμμών (Rows Span)",
DlgCellCollSpan		: "Αριθμός Κολωνών (Columns Span)",
DlgCellBackColor	: "Χρώμα Υποβάθρου",
DlgCellBorderColor	: "Χρώμα Περιθωρίου",
DlgCellBtnSelect	: "Επιλογή...",

// Find Dialog
DlgFindTitle		: "Αναζήτηση",
DlgFindFindBtn		: "Αναζήτηση",
DlgFindNotFoundMsg	: "Το κείμενο δεν βρέθηκε.",

// Replace Dialog
DlgReplaceTitle			: "Αντικατάσταση",
DlgReplaceFindLbl		: "Αναζήτηση:",
DlgReplaceReplaceLbl	: "Αντικατάσταση με:",
DlgReplaceCaseChk		: "Έλεγχος πεζών/κεφαλαίων",
DlgReplaceReplaceBtn	: "Αντικατάσταση",
DlgReplaceReplAllBtn	: "Αντικατάσταση Όλων",
DlgReplaceWordChk		: "Εύρεση πλήρους λέξης",

// Paste Operations / Dialog
PasteErrorPaste	: "Οι ρυθμίσεις ασφαλείας του φυλλομετρητή σας δεν επιτρέπουν την επιλεγμένη εργασία επικόλλησης. Χρησιμοποιείστε το πληκτρολόγιο (Ctrl+V).",
PasteErrorCut	: "Οι ρυθμίσεις ασφαλείας του φυλλομετρητή σας δεν επιτρέπουν την επιλεγμένη εργασία αποκοπής. Χρησιμοποιείστε το πληκτρολόγιο (Ctrl+X).",
PasteErrorCopy	: "Οι ρυθμίσεις ασφαλείας του φυλλομετρητή σας δεν επιτρέπουν την επιλεγμένη εργασία αντιγραφής. Χρησιμοποιείστε το πληκτρολόγιο (Ctrl+C).",

PasteAsText		: "Επικόλληση ως Απλό Κείμενο",
PasteFromWord	: "Επικόλληση από το Word",

DlgPasteMsg		: "Ο επεξεργαστής κειμένου δεν μπορεί να εκτελέσει αυτόματα την επικόλληση λόγω των <STRONG>τυθμίσεων ασφαλείας</STRONG> του φυλλομετρητή σας.<BR>Εισάγετε το κείμενο στο πιο κάτω περιθώριο χρησιμοποιώντας το πληκτρολόγιο (<STRONG>Ctrl+V</STRONG>) και πιέστε <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Αυτόματο",
ColorMoreColors	: "Περισσότερα χρώματα...",

// About Dialog
DlgAboutVersion	: "έκδοση",
DlgAboutLicense	: "Άδεια χρήσης υπό τους όρους της GNU Lesser General Public License",
DlgAboutInfo	: "Για περισσότερες πληροφορίες"
}