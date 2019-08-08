/**
 * Rubrics iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// i18n
	title : _("Rubric"),
	
	rubrics : {
		"example01" : 
		{
			"title" : "Rúbrica de ejemplo 1",
			"categories" : [
				"Criterio 1",
				"Criterio 2",
				"Criterio 3"
			],
			"score" : [
				"1",
				"2",
				"3"
			],
			"descriptions" : [
				[
					{
						"weight" : "X",
						"text" : "Describo el criterio 1.1"
					},
					{
						"weight" : "Y",
						"text" : "Describo el criterio 1.2"
					},
					{
						"weight" : "Z",
						"text" : "Describo el criterio 1.3"
					}
				],
				[
					{
						"weight" : "X",
						"text" : "Describo el criterio 2.1"
					},
					{
						"weight" : "Y",
						"text" : "Describo el criterio 2.2"
					},
					{
						"weight" : "Z",
						"text" : "Describo el criterio 2.3"
					}
				],
				[
					{
						"weight" : "X",
						"text" : "Describo el criterio 3.1"
					},
					{
						"weight" : "Y",
						"text" : "Describo el criterio 3.2"
					},
					{
						"weight" : "Z",
						"text" : "Describo el criterio 3.3"
					}
				]
			]
		}
	},

	init : function(){
		this.createForm();
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var html = '\
			<div id="eXeRubricForm">\
				<p>'+_("The user will see your name when clicking on the button.")+'</p>\
			</div>\
		';
		
		var field = $("textarea.jsContentEditor").eq(0);
		field.before(html);
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){

		var originalHTML = field.val();
		if (originalHTML != '') {
			
			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);
			
			alert(originalHTML);
			
		}		
		
	},
	
	save : function(){
		
		var html = '<div class="exe-rubric">';
		
			html += 'Contenido';
		
		html += '</div>';
		
		// Return the HTML to save
		return html;
		
	}

}