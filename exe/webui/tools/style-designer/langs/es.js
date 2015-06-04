function _(str){
	return str;
}
var $i18n = {
	// Style Designer
	Style_Designer : _("Diseñador de Estilos"),
	// #1
	General : _("General"),
	General_settings : _("Opciones generales"),
	Page_width : _("Ancho página"),
	Percentage : _("Porcentaje"),
	Pixels : _("Ancho fijo"),
	Page_position : _("Posición página"),
	Center : _("Centro"),
	Left : _("Izquierda"),
	Shadow_color : _("Color sombra"),
	Border_width : _("Ancho borde"),
	Border_color : _("Color borde"),
	Text_and_Links : _("Texto y enlaces"),
	Font : _("Tipografía"),
	Text_color : _("Color"),
	Text_color_FULL : _("Color texto"),
	Text_size : _("Tamaño"),
	Links_color : _("Enlaces"),
	Links_color_FULL : _("Color enlaces"),
	// #2
	Page : _("Página"),
	Page_background : _("Fondo de página (solo sitio web)"), // Fondo de p&aacute;gina (solo sitio web)
	Background_color : _("Color"),
	Background_color_FULL : _("Color fondo"),
	Select_image : _("Seleccionar imagen"),
	Browse : _("Examinar"),
	Background_image : _("Imagen"),
	Background_position : _("Posición"),
	_Left_Top : _("Izquierda / Arriba"),
	_Left_Center : _("Izquierda / Centro"),
	_Left_Bottom : _("Izquierda / Abajo"),
	_Center : _("Centro total"),
	_Center_Top : _("Centro / Arriba"),
	_Center_Bottom : _("Centro / Abajo"),
	_Right_Top : _("Derecha / Arriba"),
	_Right_Center : _("Derecha / Centro"),
	_Right_Bottom : _("Derecha / Abajo	"),
	Background_repeat : _("Repetir"),
	Yes : _("Sí"),
	No : _("No"),
	_Only_vertical : _("Solo verticalmente"),
	_Only_horizontal : _("Solo horizontalmente"),
	Contents_area_background : _("Fondo de la zona de los contenidos"),
	Background_instructions_1 : _('El fondo de página solo afecta a la exportación como sitio web.'),
	Background_instructions_2 : _('El apartado "Fondo de la zona de los contenidos" también afecta a la exportación como página sola, IMS, SCORM o ePub3.'),
	// #3	
	Header_and_Footer : _("Cabecera y pie"),
	Header : _("Cabecera"),
	Footer : _("Pie de página"),
	Height : _("Altura"),
	Project_title : _("Título del proyecto"),
	Hide_the_title : _("Ocultar el título"),
	Default_font : _("Predeterminada"),
	use_the_page_font : _("la misma que la página"),
	Alignment : _("Alineación"),
	Right : _("Derecha"),
	Top_margin : _("Margen superior"),
	Font_size : _("Tamaño fuente"),
	// #4
	Navigation : _("Navegación"),
	Main_menu : _("Menú"),
	Hide_the_menu : _("Ocultar el menú"),
	Horizontal_navigation : _("Menú horizontal"),
	Active_background : _("Fondo activo"),
	Active_link_color : _("Enlace activo"),
	Other_navigation_options : _("Otras opciones de navegación"),
	Use_icons : _("Usar iconos"),
	Icons_color : _("Color"),
	Icons_color_FULL : _("Color de los iconos"),
	Grey : _("Gris"),
	White : _("Blanco"),
	Black : _("Negro"),
	// #5
	With_emphasis : _("Con énfasis"),
	Title_color : _("Color título"),
	Title_background : _("Fondo título"),
	No_emphasis : _("Sin énfasis (Texto libre, etc.)"),
	Show_box : _("Mostrar caja"),
	Toggler_icon_color : _("Icono para mostar/ocultar iDevice"),
	// #6
	Advanced : _("Avanzado"),
	content_css_1 : _("Este código se incluirá al final de content.css"),
	content_css_2 : _("content.css se carga en todas las exportaciones, y siempre después de base.css"),
	nav_css_1 : _("Este código se incluirá al final de nav.css"),
	nav_css_2 : _("nav.css se incluye solo al exportar como sitio web, y siempre después de content.css"),
	content_css_content : _("Contenido del archivo content.css"),
	nav_css_content : _("Contenido del archivo nav.css"),
	css3_warning : _("Las sombras no se verán en IE6, IE7, IE8 y otros navegadores antiguos."),
	// Common
	Reset : _("Restablecer"),
	Finish : _("Finalizar"),
	Finish_confirmation : _("¿Guardar el diseño actual y cerrar el Diseñador de Estilos?"),
	Browser_Incompatible : _("Tu navegador no es compatible con esta herramienta."),
	Hide_Show_Menu_Disabled : _("Ocultar/mostrar el menú no está disponible en el Diseñador de Estilos"),
	Not_Enough_Resolution : _("Por favor, haz tu navegador más grande. El Diseñador de Estilos necesita al menos 1024x768 píxeles."),
	No_Opener_Error : _("En Diseñador de Estilos no está abierto."),
	Quit_Warning : _("Esta ventana se va a cerrar. Por favor, vuelve a abrir el Diseñador de Estilos."),
	Restore_Instructions : _('Solo tienes que cerrar esta ventana y la vista preliminar sin pulsar en "Finalizar".'),
	// Color Picker
	Color_Picker : _("Selector de color"),
	Color_Picker_Strings : {
		text : {
			title : _('Arrastra los marcadores para seleccionar un color'),
			newColor : _('Nuevo'),
			currentColor : _('Actual'),
			ok : _('OK'),
			cancel : _('Cancelar')
		},
		tooltips:{
			colors :{
				newColor : _('Nuevo color - Pulsa OK para enviar'),
				currentColor : _('Clic para volver al color original')
			},
			buttons : {
				ok : _('Seleccionar color'),
				cancel : _('Cancelar y volver al color original')
			},
			hue:{
				radio : _('Cambiar al modo Matiz'),
				textbox : _('Introduce un valor (0-360º)')
			},
			saturation :{
				radio : _('Cambiar al modo Saturación'),
				textbox : _('Introduce un valor (0-100%)')
			},
			value :{
				radio : _('Cambiar al modo Valor'),
				textbox : _('Introduce un valor (0-100%)')
			},
			red :{
				radio : _('Cambiar al modo de color Rojo'),
				textbox : _('Introduce un valor (0-255)')
			},
			green :{
				radio : _('Cambiar al modo de color Verde'),
				textbox : _('Introduce un valor (0-255)')
			},
			blue :{
				radio : _('Cambiar al modo de color Azul'),
				textbox : _('Enter a Blue value (0-255)')
			},
			alpha :{
				radio : _('Cambiar al modo Transparencia'),
				textbox : _('Introduce un valor (0-100)')
			},
			hex :{
				textbox : _('Introduce un código hexadecimal (#000000-#ffffff)'),
				alpha : _('Introduce un valor de transparencia (0-100)')
			}
		}			
	}
	// / Color Picker
}