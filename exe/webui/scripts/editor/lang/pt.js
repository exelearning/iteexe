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
 * File Name: pt.js
 * 	Portuguese language file.
 * 
 * Version:  2.0 RC2
 * Modified: 2004-12-20 23:34:06
 * 
 * File Authors:
 * 		Francisco Pereira (fjpereira@netcabo.pt)
 */


var FCKLang =
{
// Language direction : "ltr" (left to right) or "rtl" (right to left).
Dir					: "ltr",

ToolbarCollapse		: "Fechar Barra",
ToolbarExpand		: "Expandir Barra",

// Itens da barra de ferramentas e menu de contexto
Save				: "Guardar",
NewPage				: "Nova Página",
Preview				: "Pré-visualizar",
Cut					: "Cortar",
Copy				: "Copiar",
Paste				: "Colar",
PasteText			: "Colar como texto não formatado",
PasteWord			: "Colar do Word",
Print				: "Imprimir",
SelectAll			: "Seleccionar Tudo",
RemoveFormat		: "Eliminar Formato",
InsertLinkLbl		: "Hiperligação",
InsertLink			: "Inserir/Editar Hiperligação",
RemoveLink			: "Eliminar Hiperligação",
InsertImageLbl		: "Imagem",
InsertImage			: "Inserir/Editar Imagem",
InsertTableLbl		: "Tabela",
InsertTable			: "Inserir/Editar Tabela",
InsertLineLbl		: "Linha",
InsertLine			: "Inserir Linha Horizontal",
InsertSpecialCharLbl: "Caracter Especial",
InsertSpecialChar	: "Inserir Caracter Especial",
InsertSmileyLbl		: "Emoticons",
InsertSmiley		: "Inserir Emoticons",
About				: "Acerca do FCKeditor",
Bold				: "Negrito",
Italic				: "Itálico",
Underline			: "Sublinhado",
StrikeThrough		: "Rasurado",
Subscript			: "Superior à Linha",
Superscript			: "Inferior à Linha",
LeftJustify			: "Alinhar à Esquerda",
CenterJustify		: "Alinhar ao Centro",
RightJustify		: "Alinhar à Direita",
BlockJustify		: "Justificado",
DecreaseIndent		: "Diminuir Avanço",
IncreaseIndent		: "Aumentar Avanço",
Undo				: "Anular",
Redo				: "Repetir",
NumberedListLbl		: "Numeração",
NumberedList		: "Inserir/Eliminar Numeração",
BulletedListLbl		: "Marcas",
BulletedList		: "Inserir/Eliminar Marcas",
ShowTableBorders	: "Mostrar Limites da Tabelas",
ShowDetails			: "Mostrar Parágrafo",
Style				: "Estilo",
FontFormat			: "Formato",
Font				: "Tipo de Letra",
FontSize			: "Tamanho",
TextColor			: "Cor do Texto",
BGColor				: "Cor de Fundo",
Source				: "Fonte",
Find				: "Procurar",
Replace				: "Substituir",

// Menu de Contexto
EditLink			: "Editar Hiperligação",
InsertRow			: "Inserir Linha",
DeleteRows			: "Eliminar Linhas",
InsertColumn		: "Inserir Coluna",
DeleteColumns		: "Eliminar Coluna",
InsertCell			: "Inserir Célula",
DeleteCells			: "Eliminar Célula",
MergeCells			: "Unir Células",
SplitCell			: "Dividir Célula",
CellProperties		: "Propriedades da Célula",
TableProperties		: "Propriedades da Tabela",
ImageProperties		: "Propriedades da Imagem",

FontFormats			: "Normal;Formatado;Endereço;Título 1;Título 2;Título 3;Título 4;Título 5;Título 6",

// Alertas e Mensagens
ProcessingXHTML		: "A Processar XHTML. Por favor, espere...",
Done				: "Concluído",
PasteWordConfirm	: "O texto que deseja parece ter sido copiado do Word. Deseja limpar a formatação antes de colar?",
NotCompatiblePaste	: "Este comando só está disponível para Internet Explorer versão 5.5 ou superior. Deseja colar sem limpar a formatação?",
UnknownToolbarItem	: "Item de barra desconhecido \"%1\"",
UnknownCommand		: "Nome de comando desconhecido \"%1\"",
NotImplemented		: "Comando não implementado",
UnknownToolbarSet	: "Nome de barra \"%1\" não definido",

// Janelas de Diálogo
DlgBtnOK			: "OK",
DlgBtnCancel		: "Cancelar",
DlgBtnClose			: "Fechar",
DlgAdvancedTag		: "Avançado",

// Títulos de Janela de Diálogo
DlgGenNotSet		: "&lt;Não definido&gt;",
DlgGenId			: "Id",
DlgGenLangDir		: "Orientação de idioma",
DlgGenLangDirLtr	: "Esquerda à Direita (LTR)",
DlgGenLangDirRtl	: "Direita a Esquerda (RTL)",
DlgGenLangCode		: "Código de Idioma",
DlgGenAccessKey		: "Chave de Accesso",
DlgGenName			: "Nome",
DlgGenTabIndex		: "Índice de Tubulação",
DlgGenLongDescr		: "Descrição Completa do URL",
DlgGenClass			: "Classes de Estilo de Folhas Classes",
DlgGenTitle			: "Título",
DlgGenContType		: "Tipo de Conteúdo",
DlgGenLinkCharset	: "Fonte de caracteres vinculado",
DlgGenStyle			: "Estilo",

// Janelas de Diálogo de Imagens
DlgImgTitle			: "Propriedades da Imagem",
DlgImgInfoTab		: "Informação da Imagem",
DlgImgBtnUpload		: "Enviar para o Servidor",
DlgImgURL			: "URL",
DlgImgUpload		: "Carregar",
DlgImgBtnBrowse		: "Visualizar Servidor",
DlgImgAlt			: "Texto Alternativo",
DlgImgWidth			: "Largura",
DlgImgHeight		: "Altura",
DlgImgLockRatio		: "Proporcional",
DlgBtnResetSize		: "Tamanho Original",
DlgImgBorder		: "Limite",
DlgImgHSpace		: "Esp.Horiz",
DlgImgVSpace		: "Esp.Vert",
DlgImgAlign			: "Alinhamento",
DlgImgAlignLeft		: "Esquerda",
DlgImgAlignAbsBottom: "Abs inferior",
DlgImgAlignAbsMiddle: "Abs centro",
DlgImgAlignBaseline	: "Linha de base",
DlgImgAlignBottom	: "Fundo",
DlgImgAlignMiddle	: "Centro",
DlgImgAlignRight	: "Direita",
DlgImgAlignTextTop	: "Topo do texto",
DlgImgAlignTop		: "Topo",
DlgImgPreview		: "Pré-visualizar",
DlgImgMsgWrongExt	: "Só se aceitam os seguintes tipos de ficheiro:\n\n" + FCKConfig.ImageUploadAllowedExtensions + "\n\nOperação cancelada.",
DlgImgAlertSelect	: "Por favor seleccione uma imagem para carregar",
DlgImgAlertUrl		: "Por favor introduza o URL da imagem",

// Janela de Diálogo de Hiperligações
DlgLnkWindowTitle	: "Hiperligação",
DlgLnkInfoTab		: "Informação de Hiperligação",
DlgLnkTargetTab		: "Destino",

DlgLnkType			: "Tipo de Hiperligação",
DlgLnkTypeURL		: "URL",
DlgLnkTypeAnchor	: "Referencia a esta página",
DlgLnkTypeEMail		: "E-Mail",
DlgLnkProto			: "Protocolo",
DlgLnkProtoOther	: "&lt;outro&gt;",
DlgLnkURL			: "URL",
DlgLnkBtnBrowse		: "Visualizar Servidor",
DlgLnkAnchorSel		: "Seleccionar una referencia",
DlgLnkAnchorByName	: "Por Nome de Referencia",
DlgLnkAnchorById	: "Por ID de elemento",
DlgLnkNoAnchors		: "&lt;Não há referências disponíveis no documento&gt;",
DlgLnkEMail			: "Endereço de E-Mail",
DlgLnkEMailSubject	: "Título de Mensagem",
DlgLnkEMailBody		: "Corpo da Mensagem",
DlgLnkUpload		: "Carregar",
DlgLnkBtnUpload		: "Enviar ao Servidor",

DlgLnkTarget		: "Destino",
DlgLnkTargetFrame	: "&lt;Frame&gt;",
DlgLnkTargetPopup	: "&lt;Janela de popup&gt;",
DlgLnkTargetBlank	: "Nova Janela(_blank)",
DlgLnkTargetParent	: "Janela Pai (_parent)",
DlgLnkTargetSelf	: "Mesma janela (_self)",
DlgLnkTargetTop		: "Janela primaria (_top)",
DlgLnkTargetFrame	: "Nome do Frame de Destino",
DlgLnkPopWinName	: "Nome da Janela de Popup",
DlgLnkPopWinFeat	: "Características de Janela de Popup",
DlgLnkPopResize		: "Ajustável",
DlgLnkPopLocation	: "Barra de localização",
DlgLnkPopMenu		: "Barra de Menu",
DlgLnkPopScroll		: "Barras de deslocamento",
DlgLnkPopStatus		: "Barra de Estado",
DlgLnkPopToolbar	: "Barra de Ferramentas",
DlgLnkPopFullScrn	: "Janela Completa (IE)",
DlgLnkPopDependent	: "Dependente (Netscape)",
DlgLnkPopWidth		: "Largura",
DlgLnkPopHeight		: "Altura",
DlgLnkPopLeft		: "Posição Esquerda",
DlgLnkPopTop		: "Posição Direita",

DlgLnkMsgWrongExtA	: "Só se aceitam os seguintes tipos de ficheiro:\n\n" + FCKConfig.LinkUploadAllowedExtensions + "\n\nOperação cancelada.",
DlgLnkMsgWrongExtD	: "Os seguintes tipos de ficheiros não são aceites:\n\n" + FCKConfig.LinkUploadDeniedExtensions + "\n\nOperação cancelada.",

DlnLnkMsgNoUrl		: "Por favor insira a hiperligação URL",
DlnLnkMsgNoEMail	: "Por favor insira o endereço de e-mail",
DlnLnkMsgNoAnchor	: "Por favor seleccione una referencia",

// Janela de Diálogo de Cor
DlgColorTitle		: "Seleccionar Cor",
DlgColorBtnClear	: "Nenhuma",
DlgColorHighlight	: "Destacado",
DlgColorSelected	: "Seleccionado",

// Janela de Diálogo de Emoticons
DlgSmileyTitle		: "Inserir um Emoticon",

// Janela de Diálogo de Caracteres Especiais
DlgSpecialCharTitle	: "Seleccione um caracter especial",

// Janela de Diálogo de Tabelas
DlgTableTitle		: "Propriedades da Tabela",
DlgTableRows		: "Linhas",
DlgTableColumns		: "Colunas",
DlgTableBorder		: "Tamanho do Limite",
DlgTableAlign		: "Alinhamento",
DlgTableAlignNotSet	: "<Não definido>",
DlgTableAlignLeft	: "Esquerda",
DlgTableAlignCenter	: "Centrado",
DlgTableAlignRight	: "Direita",
DlgTableWidth		: "Largura",
DlgTableWidthPxinsira: "pixeis",
DlgTableWidthPc		: "percentagem",
DlgTableHeight		: "Altura",
DlgTableCellSpace	: "Esp. e/células",
DlgTableCellPad		: "Esp. interior",
DlgTableCaption		: "Título",

// Janelas de Diálogo de Células de Tabelas
DlgCellTitle		: "Propriedades da Célula",
DlgCellWidth		: "Largura",
DlgCellWidthPx		: "pixeis",
DlgCellWidthPc		: "percentagem",
DlgCellHeight		: "Altura",
DlgCellWordWrap		: "Moldar Texto",
DlgCellWordWrapNotSet: "<Não definido>",
DlgCellWordWrapYes	: "Sim",
DlgCellWordWrapNo	: "Não",
DlgCellHorAlign		: "Alinhamento Horizontal",
DlgCellHorAlignNotSet: "<Não definido>",
DlgCellHorAlignLeft	: "Esquerda",
DlgCellHorAlignCenter: "Centrado",
DlgCellHorAlignRight: "Direita",
DlgCellVerAlign		: "Alinhamento Vertical",
DlgCellVerAlignNotSet: "<Não definido>",
DlgCellVerAlignTop	: "Topo",
DlgCellVerAlignMiddle: "Médio",
DlgCellVerAlignBottom: "Fundi",
DlgCellVerAlignBaseline: "Linha de Base",
DlgCellRowSpan		: "Unir Linhas",
DlgCellCollSpan		: "Unir Colunas",
DlgCellBackColor	: "Cor do Fundo",
DlgCellBorderColor	: "Cor do Limite",
DlgCellBtnSelect	: "Seleccione...",

// Janela de Diálogo de Procura
DlgFindTitle		: "Procurar",
DlgFindFindBtn		: "Procurar",
DlgFindNotFoundMsg	: "O texto especificado não foi encontrado.",

// Janela de Diálogo de Substituir
DlgReplaceTitle		: "Substituir",
DlgReplaceFindLbl	: "Texto a Procurar:",
DlgReplaceReplaceLbl: "Substituir por:",
DlgReplaceCaseChk	: "Maiúsculas/Minúsculas",
DlgReplaceReplaceBtn: "Substituir",
DlgReplaceReplAllBtn: "Substituir Tudo",
DlgReplaceWordChk	: "Coincidir com toda a palavra",

// Janelas de Diálogo de Operações de colar
PasteErrorPaste		: "A configuração de segurança do navegador não permite a execução automática de operações de colar. Por favor use o teclado (Ctrl+V).",
PasteErrorCut		: "A configuração de segurança do navegador não permite a execução automática de operações de cortar. Por favor use o teclado (Ctrl+X).",
PasteErrorCopy		: "A configuração de segurança do navegador não permite a execução automática de operações de copiar. Por favor use o teclado (Ctrl+C).",

PasteAsText			: "Colar como Texto Simples",
PasteFromWord		: "Colar do Word",

DlgPasteMsg			: "O editor não pode executar automaticamente o colar devido à <STRONG>configuração de segurança</STRONG> do navegador.<BR>Por favor cole dentro do seguinte quadro usando o teclado (<STRONG>Ctrl+V</STRONG>) e pressione <STRONG>OK</STRONG>.",

// Selector de Cor
ColorAutomatic		: "Automático",
ColorMoreColors		: "Mais Cores...",

// Janela de Diálogo Acerca de
DlgAboutVersion		: "versão",
DlgAboutLicense		: "Licenciado segundo os términos de GNU Lesser General Public License",
DlgAboutInfo        : "Para mais informações por favor dirija-se a"
}