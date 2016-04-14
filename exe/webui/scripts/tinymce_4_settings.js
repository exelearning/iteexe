var $exeTinyMCE = {
    
	init : function(mode,criteria,hide){
		tinymce.init({
			language: "en",
			selector: "textarea",
			convert_urls: false,
			plugins: [
				"advlist autolink lists link charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				"insertdatetime table contextmenu paste example spellchecker"
			],
			toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link"
		});
	}
	
}

$(function(){
	$exeTinyMCE.init("specific_textareas","mceEditor");
});