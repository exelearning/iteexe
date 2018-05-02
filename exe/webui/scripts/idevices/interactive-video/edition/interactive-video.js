/**
 * Interactive Video iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
 
// Provisional:
var myVideo = "https://mediateca.educa.madrid.org/video/l7l76swf6hggd2hu";
	myVideo = "https://youtu.be/EW72hU1Rp7g";
 
function fieldHasChangedTest(e){
    $("#interactiveVideoFile").fadeIn();
}

function uploadToServerTest(){
    $("#interactiveVideoFile").hide();
	try {
        exe_tinymce.chooseImage("interactiveVideoFile", "", "media", window);
    } catch(e) {
        alert(e);
    }
} 
 
var $exeDevice = {
	
	init : function(){
		
		 this.createForm();
		 
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var html = '\
			<div id="interactiveVideoIdeviceForm">\
				<p>'+_("Soon...")+'</p>\
				<p>\
					<label for="interactiveVideoFile">'+_("File")+':</label> \
					<input type="text" id="interactiveVideoFile" class="exe-file-picker" />\
				</p>\
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
			
			// To do
			
		}	
		
	},
	
	save : function(){
		
		var html = '\
			<div class="exe-interactive-video">\
				<p id="exe-interactive-video-file" class="js-hidden">\
					<a href="'+myVideo+'">'+myVideo+'</a>\
				</p>\
				<script type="text/javascript">//<![CDATA[\
					var InteractiveVideo = {\
						"slides":[\
							{\
								"startTime":2,\
								"type":"text",\
								"text":"<p>Texto del <strong>2</strong> al <strong>10</strong>.</p>",\
								"endTime":10,\
								"results":{\
									"viewed":true\
								},\
								"current":false\
							},\
							{\
								"type":"singleChoice",\
								"question":"<p>¿De qué color era el caballo <strong>blanco</strong> de Santiago?</p>",\
								"answers":[\
									[ "Rojo con puntos verdes", 0],\
									[ "Azul", 0 ],\
									[ "Blanco", 1 ]\
								],\
								"startTime":15,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"image",\
								"url":"http://ipsumimage.appspot.com/800x600",\
								"description":"Imagen en el 20",\
								"startTime":20,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"multipleChoice",\
								"question":"<p>El <strong>5</strong> es...</p>",\
								"answers":[\
									[ "Un número", 1 ],\
									[ "Un número par", 0 ],\
									[ "Un número impar", 1 ],\
									[ "Un número entero", 1 ]\
								],\
								"startTime":25,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"dropdown",\
								"text":"<p>En <span style=\"text-decoration: line-through;\">primavera</span> y <span style=\"text-decoration: line-through;\">verano</span>, en la mitad <span style=\"text-decoration: line-through;\">sur</span> de España, el petirrojo cría en bosques ribereños y montaña.</p><p>En la misma época, pero en la mitad <span style=\"text-decoration: line-through;\">norte</span>, se reproduce en cualquier tipo de bosque, campiña, huerto, parque, jardines, exceptuando los parajes <span style=\"text-decoration: line-through;\">bajos</span>, deforestados, secos, del valle del Ebro o de la depresión del Duero.</p>",\
								"startTime":30,\
								"additionalWords":[\
									"cinco",\
									"seis"\
								],\
								"results":null,\
								"current":true\
							},\
							{\
								"type":"cloze",\
								"text":"<p>En un lugar de la <span style=\"text-decoration: line-through;\">Mancha</span>, de cuyo nombre no quiero acordarme, no ha mucho tiempo que <span style=\"text-decoration: line-through;\">vivía</span> un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y <span style=\"text-decoration: line-through;\">galgo</span> corredor.</p>",\
								"startTime":40,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"matchElements",\
								"text":"<p>Relaciona <strong>nombres</strong> y <strong>apellidos</strong>.</p>",\
								"startTime":45,\
								"pairs":[\
									[ "LMS", "Moodle" ],\
									[ "Blog", "WordPress" ],\
									[ "Framework PHP", "Symfony" ]\
								],\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"sortableList",\
								"text":"<p>Ordena la frase de <strong>El Quijote</strong>.</p>",\
								"startTime":50,\
								"items":[\
									"En un lugar de la Mancha, ",\
									"de cuyo nombre no quiero acordarme, ",\
									"no ha mucho tiempo que vivía un hidalgo ",\
									"de los de lanza en astillero, ",\
									"adarga antigua, ",\
									"rocín flaco y galgo corredor."\
								],\
								"results":null,\
								"current":false\
							}\
						]\
					};\
				//]]></script>\
			</div>';
			
		var html = '\
			<div class="exe-interactive-video">\
				<p id="exe-interactive-video-file" class="js-hidden">\
					<a href="'+myVideo+'">'+myVideo+'</a>\
				</p>\
				<script type="text/javascript">//<![CDATA[\
					\nvar InteractiveVideo = {\
						"slides":[\
							{\
								"startTime":2,\
								"type":"text",\
								"text":"<p>Texto del <strong>2</strong> al <strong>10</strong>.</p>",\
								"endTime":10,\
								"results":{\
									"viewed":true\
								},\
								"current":false\
							},\
							{\
								"type":"singleChoice",\
								"question":"<p>¿De qué color era el caballo <strong>blanco</strong> de Santiago?</p>",\
								"answers":[\
									[ "Rojo con puntos verdes", 0],\
									[ "Azul", 0 ],\
									[ "Blanco", 1 ]\
								],\
								"startTime":15,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"image",\
								"url":"http://ipsumimage.appspot.com/800x600",\
								"description":"Imagen en el 20",\
								"startTime":20,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"multipleChoice",\
								"question":"<p>El <strong>5</strong> es...</p>",\
								"answers":[\
									[ "Un número", 1 ],\
									[ "Un número par", 0 ],\
									[ "Un número impar", 1 ],\
									[ "Un número entero", 1 ]\
								],\
								"startTime":25,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"dropdown",\
								"text":"<p>En <span style=\\"text-decoration: line-through;\\">primavera</span> y <span style=\\"text-decoration: line-through;\\">verano</span>, en la mitad <span style=\\"text-decoration: line-through;\\">sur</span> de España, el petirrojo cría en bosques ribereños y montaña.</p><p>En la misma época, pero en la mitad <span style=\\"text-decoration: line-through;\\">norte</span>, se reproduce en cualquier tipo de bosque, campiña, huerto, parque, jardines, exceptuando los parajes <span style=\\"text-decoration: line-through;\\">bajos</span>, deforestados, secos, del valle del Ebro o de la depresión del Duero.</p>",\
								"startTime":30,\
								"additionalWords":[\
									"cinco",\
									"seis"\
								],\
								"results":null,\
								"current":true\
							},\
							{\
								"type":"cloze",\
								"text":"<p>En un lugar de la <span style=\\"text-decoration: line-through;\\">Mancha</span>, de cuyo nombre no quiero acordarme, no ha mucho tiempo que <span style=\\"text-decoration: line-through;\\">vivía</span> un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y <span style=\\"text-decoration: line-through;\\">galgo</span> corredor.</p>",\
								"startTime":40,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"matchElements",\
								"text":"<p>Relaciona <strong>nombres</strong> y <strong>apellidos</strong>.</p>",\
								"startTime":45,\
								"pairs":[\
									[ "LMS", "Moodle" ],\
									[ "Blog", "WordPress" ],\
									[ "Framework PHP", "Symfony" ]\
								],\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"sortableList",\
								"text":"<p>Ordena la frase de <strong>El Quijote</strong>.</p>",\
								"startTime":50,\
								"items":[\
									"En un lugar de la Mancha, ",\
									"de cuyo nombre no quiero acordarme, ",\
									"no ha mucho tiempo que vivía un hidalgo ",\
									"de los de lanza en astillero, ",\
									"adarga antigua, ",\
									"rocín flaco y galgo corredor."\
								],\
								"results":null,\
								"current":false\
							}\
						]\
					};\
				//]]></script>\
			</div>';			
			
		/*
		html = '\
			<div class="exe-interactive-video">\
				<p id="exe-interactive-video-file" class="js-hidden">\
					<a href="'+myVideo+'">'+myVideo+'</a>\
				</p>\
				<script type="text/javascript">//<![CDATA[/\
					\nvar InteractiveVideo = {\
						"slides":[\
							{\
								"startTime":2,\
								"type":"text",\
								"text":"<p>Texto del <strong>2</strong> al <strong>10</strong>.</p>",\
								"endTime":10,\
								"results":{\
									"viewed":true\
								},\
								"current":false\
							},\
							{\
								"type":"singleChoice",\
								"question":"<p>¿De qué color era el caballo <strong>blanco</strong> de Santiago?</p>",\
								"answers":[\
									[ "Rojo con puntos verdes", 0],\
									[ "Azul", 0 ],\
									[ "Blanco", 1 ]\
								],\
								"startTime":15,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"image",\
								"url":"http://ipsumimage.appspot.com/800x600",\
								"description":"Imagen en el 20",\
								"startTime":20,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"multipleChoice",\
								"question":"<p>El <strong>5</strong> es...</p>",\
								"answers":[\
									[ "Un número", 1 ],\
									[ "Un número par", 0 ],\
									[ "Un número impar", 1 ],\
									[ "Un número entero", 1 ]\
								],\
								"startTime":25,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"dropdown",\
								"text":"<p>En <span style=\\"text-decoration: line-through;\\">primavera</span> y <span style=\\"text-decoration: line-through;\\">verano</span>, en la mitad <span style=\\"text-decoration: line-through;\\">sur</span> de España, el petirrojo cría en bosques ribereños y montaña.</p><p>En la misma época, pero en la mitad <span style=\\"text-decoration: line-through;\\">norte</span>, se reproduce en cualquier tipo de bosque, campiña, huerto, parque, jardines, exceptuando los parajes <span style=\\"text-decoration: line-through;\\">bajos</span>, deforestados, secos, del valle del Ebro o de la depresión del Duero.</p>",\
								"startTime":30,\
								"additionalWords":[\
									"cinco",\
									"seis"\
								],\
								"results":null,\
								"current":true\
							},\
							{\
								"type":"cloze",\
								"text":"<p>En un lugar de la <span style=\\"text-decoration: line-through;\\">Mancha</span>, de cuyo nombre no quiero acordarme, no ha mucho tiempo que <span style=\\"text-decoration: line-through;\\">vivía</span> un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y <span style=\\"text-decoration: line-through;\\">galgo</span> corredor.</p>",\
								"startTime":40,\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"matchElements",\
								"text":"<p>Relaciona <strong>nombres</strong> y <strong>apellidos</strong>.</p>",\
								"startTime":45,\
								"pairs":[\
									[ "LMS", "Moodle" ],\
									[ "Blog", "WordPress" ],\
									[ "Framework PHP", "Symfony" ]\
								],\
								"results":null,\
								"current":false\
							},\
							{\
								"type":"sortableList",\
								"text":"<p>Ordena la frase de <strong>El Quijote</strong>.</p>",\
								"startTime":50,\
								"items":[\
									"En un lugar de la Mancha, ",\
									"de cuyo nombre no quiero acordarme, ",\
									"no ha mucho tiempo que vivía un hidalgo ",\
									"de los de lanza en astillero, ",\
									"adarga antigua, ",\
									"rocín flaco y galgo corredor."\
								],\
								"results":null,\
								"current":false\
							}\
						]\
					};\
				//]]></script>\
			</div>';
		*/
		
		// Return the HTML to save
		var videoFile = $("#interactiveVideoFile").val();
		if (videoFile!="") {
			var videoFileName = videoFile.split("/");
				videoFileName = videoFileName[videoFileName.length-1];			
			html += '<video width="320" height="240" controls="controls" class="mediaelement"><source src="'+videoFile+'" /></video>';
		}
		return html;
		
	}

}