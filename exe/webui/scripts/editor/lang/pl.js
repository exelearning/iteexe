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
 * File Name: pl.js
 * 	Polish language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 01:16:06
 * 
 * File Authors:
 * 		Jakub Boesche (jboesche@gazeta.pl)
 */

var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Zwiń pasek narzędzi",
ToolbarExpand		: "Rozwiń pasek narzędzi",

// Toolbar Items and Context Menu
Save				: "Zapisz",
NewPage				: "Nowa strona",
Preview				: "Podgląd",
Cut					: "Wytnij",
Copy				: "Kopiuj",
Paste				: "Wklej",
PasteText			: "Wklej jako czysty tekst",
PasteWord			: "Wklej z Worda",
Print				: "Drukuj",
SelectAll			: "Zaznacz wszystko",
RemoveFormat		: "Usuń formatowanie",
InsertLinkLbl		: "Hiperłącze",
InsertLink			: "Wstaw/edytuj hiperłącze",
RemoveLink			: "Usuń hiperłącze",
InsertImageLbl		: "Obrazek",
InsertImage			: "Wstaw/edytuj obrazek",
InsertTableLbl		: "Tabela",
InsertTable			: "Wstaw/edytuj tabelę",
InsertLineLbl		: "Linia pozioma",
InsertLine			: "Wstaw poziomą linię",
InsertSpecialCharLbl: "Znak specjalny",
InsertSpecialChar	: "Wstaw znak specjalny",
InsertSmileyLbl		: "Emotikona",
InsertSmiley		: "Wstaw emotikonę",
About				: "O programie FCKeditor",
Bold				: "Pogrubienie",
Italic				: "Kursywa",
Underline			: "Podkreślenie",
StrikeThrough		: "Przekreślenie",
Subscript			: "Indeks dolny",
Superscript			: "Indeks górny",
LeftJustify			: "Wyrównaj do lewej",
CenterJustify		: "Wyrównaj do środka",
RightJustify		: "Wyrównaj do prawej",
BlockJustify		: "Wyrównaj do lewej i prawej",
DecreaseIndent		: "Zmniejsz wcięcie",
IncreaseIndent		: "Zwiększ wcięcie",
Undo				: "Cofnij",
Redo				: "Ponów",
NumberedListLbl		: "Lista numerowana",
NumberedList		: "Wstaw/usuń numerowanie listy",
BulletedListLbl		: "Lista wypunktowana",
BulletedList		: "Wstaw/usuń wypunktowanie listy",
ShowTableBorders	: "Pokazuj ramkę tabeli",
ShowDetails			: "Pokaż szczegóły",
Style				: "Styl",
FontFormat			: "Format",
Font				: "Czcionka",
FontSize			: "Rozmiar",
TextColor			: "Kolor tekstu",
BGColor				: "Kolor tła",
Source				: "Źródło dokumentu",
Find				: "Znajdź",
Replace				: "Zamień",

// Context Menu
EditLink			: "Edytuj hiperłącze",
InsertRow			: "Wstaw wiersz",
DeleteRows			: "Usuń wiersze",
InsertColumn		: "Wstaw kolumnę",
DeleteColumns		: "Usuń kolumny",
InsertCell			: "Wstaw komórkę",
DeleteCells			: "Usuń komórki",
MergeCells			: "Połącz komórki",
SplitCell			: "Podziel komórkę",
CellProperties		: "Właściwości komórki",
TableProperties		: "Właściwości tabeli",
ImageProperties		: "Właściwości obrazka",

FontFormats			: "Normalny;Tekst sformatowany;Adres;Nagłówek 1;Nagłówek 2;Nagłówek 3;Nagłówek 4;Nagłówek 5;Nagłówek 6",

// Alerts and Messages
ProcessingXHTML		: "Przetwarzanie XHTML. Proszę czekać...",
Done				: "Gotowe",
PasteWordConfirm	: "Tekst, który chcesz wkleić, prawdopodobnie pochodzi z programu Word. Czy chcesz go wyczyścic przed wklejeniem?",
NotCompatiblePaste	: "Ta funkcja jest dostępna w programie Internet Explorer w wersji 5.5 lub wyższej. Czy chcesz wkleić tekst bez czyszczenia?",
UnknownToolbarItem	: "Nieznany element paska narzędzi \"%1\"",
UnknownCommand		: "Nieznana komenda \"%1\"",
NotImplemented		: "Komenda niezaimplementowana",
UnknownToolbarSet	: "Pasek narzędzi \"%1\" nie istnieje",

// Dialogs
DlgBtnOK			: "OK",
DlgBtnCancel		: "Anuluj",
DlgBtnClose			: "Zamknij",
DlgAdvancedTag		: "Zaawansowane",

// General Dialogs Labels
DlgGenNotSet		: "&lt;nieustawione&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Kierunek tekstu",
DlgGenLangDirLtr	: "Od lewej do prawej (LTR)",
DlgGenLangDirRtl	: "Od prawej do lewej (RTL)",
DlgGenLangCode		: "Kod języka",
DlgGenAccessKey		: "Klawisz dostępu",
DlgGenName			: "Nazwa",
DlgGenTabIndex		: "Indeks tabeli",
DlgGenLongDescr		: "Long Description URL",
DlgGenClass			: "Stylesheet Classes",
DlgGenTitle			: "Advisory Title",
DlgGenContType		: "Advisory Content Type",
DlgGenLinkCharset	: "Linked Resource Charset",
DlgGenStyle			: "Styl",

// Image Dialog
DlgImgTitle			: "Właściwości obrazka",
DlgImgInfoTab		: "Informacje o obrazku",
DlgImgBtnUpload		: "Syślij",
DlgImgURL			: "Adres URL",
DlgImgUpload		: "Wyślij",
DlgImgBtnBrowse		: "Przeglądaj",
DlgImgAlt			: "Tekst zastępczy",
DlgImgWidth			: "Szerokość",
DlgImgHeight		: "Wysokość",
DlgImgLockRatio		: "Zablokuj proporcje",
DlgBtnResetSize		: "Przywróć rozmiar",
DlgImgBorder		: "Ramka",
DlgImgHSpace		: "Odstęp poziomy",
DlgImgVSpace		: "Odstęp pionowy",
DlgImgAlign			: "Wyrównaj",
DlgImgAlignLeft		: "Do lewej",
DlgImgAlignAbsBottom: "Do dołu",
DlgImgAlignAbsMiddle: "Do środka w pionie",
DlgImgAlignBaseline	: "Do linii bazowej",
DlgImgAlignBottom	: "Do dołu",
DlgImgAlignMiddle	: "Do środka",
DlgImgAlignRight	: "Do prawej",
DlgImgAlignTextTop	: "Do góry tekstu",
DlgImgAlignTop		: "Do góry",
DlgImgPreview		: "Podgląd",
DlgImgMsgWrongExt	: "Niestety dozwolone są tylko następujące typy plików:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperacja nie powiodła się.",
DlgImgAlertSelect	: "Wybierz obrazek do wysłania.",
DlgImgAlertUrl		: "Podaj adres obrazka.",

// Link Dialog
DlgLnkWindowTitle	: "Hiperłącze",
DlgLnkInfoTab		: "Informacje ",
DlgLnkTargetTab		: "Cel",

DlgLnkType			: "Typ hiperłącza",
DlgLnkTypeURL		: "Adres URL",
DlgLnkTypeAnchor	: "Odnośnik wewnątrz strony",
DlgLnkTypeEMail		: "Adres e-mail",
DlgLnkProto			: "Protokół",
DlgLnkProtoOther	: "&lt;inny&gt;",
DlgLnkURL			: "Adres URL",
DlgLnkBtnBrowse		: "Przeglądaj",
DlgLnkAnchorSel		: "Wybierz etykietę",
DlgLnkAnchorByName	: "Wg etykiety",
DlgLnkAnchorById	: "Wg identyfikatora elementu",
DlgLnkNoAnchors		: "&lt;W dokumencie nie zdefiniowano żadnych etykiet&gt;",
DlgLnkEMail			: "Adres e-mail",
DlgLnkEMailSubject	: "Temat",
DlgLnkEMailBody		: "Treść",
DlgLnkUpload		: "Upload",
DlgLnkBtnUpload		: "Wyślij",

DlgLnkTarget		: "Cel",
DlgLnkTargetFrame	: "&lt;ramka&gt;",
DlgLnkTargetPopup	: "&lt;wyskakujące okno&gt;",
DlgLnkTargetBlank	: "Nowe okno (_blank)",
DlgLnkTargetParent	: "Okno nadrzędne (_parent)",
DlgLnkTargetSelf	: "To samo okno (_self)",
DlgLnkTargetTop		: "Okno najwyższe w hierarchii (_top)",
DlgLnkTargetFrame	: "Nazwa ramki docelowej",
DlgLnkPopWinName	: "Nazwa wyskakującego okna",
DlgLnkPopWinFeat	: "Właściwości wyskakującego okna",
DlgLnkPopResize		: "Możliwa zmiana rozmiaru",
DlgLnkPopLocation	: "Pasek adresu",
DlgLnkPopMenu		: "Pasek menu",
DlgLnkPopScroll		: "Paski przewijania",
DlgLnkPopStatus		: "Pasek statusu",
DlgLnkPopToolbar	: "Pasek narzędzi",
DlgLnkPopFullScrn	: "Pełny ekran (IE)",
DlgLnkPopDependent	: "Okno zależne (Netscape)",
DlgLnkPopWidth		: "Szerokość",
DlgLnkPopHeight		: "Wysokość",
DlgLnkPopLeft		: "Pozycja w poziomie",
DlgLnkPopTop		: "Pozycja w pionie",

DlgLnkMsgWrongExtA	: "Dozwolone są tylko nastepujące typy plików:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperacja nie powiodła się.",
DlgLnkMsgWrongExtD	: "Niedozwolone typy plików:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperacja nie powiodła się.",

DlnLnkMsgNoUrl		: "Podaj adres URL",
DlnLnkMsgNoEMail	: "Podaj adres e-mail",
DlnLnkMsgNoAnchor	: "Wybierz etykietę",

// Color Dialog
DlgColorTitle		: "Wybierz kolor",
DlgColorBtnClear	: "Wyczyść",
DlgColorHighlight	: "Podgląd",
DlgColorSelected	: "Wybrane",

// Smiley Dialog
DlgSmileyTitle		: "Wstaw emotikonę",

// Special Character Dialog
DlgSpecialCharTitle	: "Wybierz znak specjalny",

// Table Dialog
DlgTableTitle		: "Właściwości tabeli",
DlgTableRows		: "Liczba wierszy",
DlgTableColumns		: "Liczba kolumn",
DlgTableBorder		: "Grubość ramki",
DlgTableAlign		: "Wyrównanie",
DlgTableAlignNotSet	: "<brak ustawień>",
DlgTableAlignLeft	: "Do lewej",
DlgTableAlignCenter	: "Do środka",
DlgTableAlignRight	: "Do prawej",
DlgTableWidth		: "Szerokość",
DlgTableWidthPx		: "piksele",
DlgTableWidthPc		: "%",
DlgTableHeight		: "Wysokość",
DlgTableCellSpace	: "Odstęp pomiędzy komórkami",
DlgTableCellPad		: "Margines wewnętrzny komórek",
DlgTableCaption		: "Tytuł",

// Table Cell Dialog
DlgCellTitle		: "Właściwości komórki",
DlgCellWidth		: "Szerokość",
DlgCellWidthPx		: "piksele",
DlgCellWidthPc		: "%",
DlgCellHeight		: "Wysokość",
DlgCellWordWrap		: "Zawijanie tekstu",
DlgCellWordWrapNotSet	: "<brak ustawień>",
DlgCellWordWrapYes	: "Tak",
DlgCellWordWrapNo	: "Nie",
DlgCellHorAlign		: "Wyrównanie poziome",
DlgCellHorAlignNotSet	: "<brak ustawień>",
DlgCellHorAlignLeft	: "Do lewej",
DlgCellHorAlignCenter	: "Do środka",
DlgCellHorAlignRight: "Do prawej",
DlgCellVerAlign		: "Wyrównanie pionowe",
DlgCellVerAlignNotSet	: "<brak ustawień>",
DlgCellVerAlignTop	: "Do góry",
DlgCellVerAlignMiddle	: "Do środka",
DlgCellVerAlignBottom	: "Do dołu",
DlgCellVerAlignBaseline	: "Do linii bazowej",
DlgCellRowSpan		: "Zajętość wierszy",
DlgCellCollSpan		: "Zajętość kolumn",
DlgCellBackColor	: "Kolor tła",
DlgCellBorderColor	: "Kolor ramki",
DlgCellBtnSelect	: "Wybierz...",

// Find Dialog
DlgFindTitle		: "Znajdź",
DlgFindFindBtn		: "Znajdź",
DlgFindNotFoundMsg	: "Nie znaleziono szukanego hasła.",

// Replace Dialog
DlgReplaceTitle			: "Zamień",
DlgReplaceFindLbl		: "Znajdź:",
DlgReplaceReplaceLbl	: "Zastąp przez:",
DlgReplaceCaseChk		: "Uwzględnij wielkość liter",
DlgReplaceReplaceBtn	: "Zastąp",
DlgReplaceReplAllBtn	: "Zastąp wszystko",
DlgReplaceWordChk		: "Całe słowa",

// Paste Operations / Dialog
PasteErrorPaste	: "Ustawienia bezpieczeństwa Twojej przeglądarki nie pozwalają na automatyczne wklejanie tekstu. Użyj skrótu klawiszowego Ctrl+V.",
PasteErrorCut	: "Ustawienia bezpieczeństwa Twojej przeglądarki nie pozwalają na automatyczne wycinanie tekstu. Użyj skrótu klawiszowego Ctrl+X.",
PasteErrorCopy	: "Ustawienia bezpieczeństwa Twojej przeglądarki nie pozwalają na automatyczne kopiowanie tekstu. Użyj skrótu klawiszowego Ctrl+C.",

PasteAsText		: "Wklej jako czysty tekst",
PasteFromWord	: "Wklej z Worda",

DlgPasteMsg		: "Automatyczne wklejenie tekstu nie było możliwe z powodu <STRONG>restrykcyjnych</STRONG> ustawień bezpieczeństwa Twojej przeglądarki.<BR>Wklej tekst w poniższe pole używając skrótu klawiszowego (<STRONG>Ctrl+V</STRONG>) i wciśnij <STRONG>OK</STRONG>.",

// Color Picker
ColorAutomatic	: "Automatycznie",
ColorMoreColors	: "Więcej kolorów...",

// About Dialog
DlgAboutVersion	: "wersja",
DlgAboutLicense	: "na licencji GNU Lesser General Public License",
DlgAboutInfo	: "Więcej informacji uzyskasz pod adresem"
}
