window.addEventListener('DOMContentLoaded', function () {
  var Vue = window.Vue;
  var URL = window.URL || window.webkitURL;
  var XMLHttpRequest = window.XMLHttpRequest;
  var Compressor = window.Compressor;

  new Vue({
    el: '#app',

    data: function () {
      var vm = this;

      return {
        options: {
          strict: true,
          checkOrientation: true,
          maxWidth: 800,
          maxHeight: 800,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          quality: 0.95,
          mimeType: '',
          convertSize: 5000000,
          success: function (result) {
			var reader = new FileReader();
				reader.readAsDataURL(result); 
				reader.onloadend = function() {
			var base64data = reader.result;                
				vm.outputURL = base64data;
			}
            console.log('Output: ', result);

            if (URL) {
              vm.outputURL = URL.createObjectURL(result);
            }

            vm.output = result;
            // See #487 vm.$refs.input.value = '';
          },
          error: function (err) {
            window.alert(err.message);
          },
        },
        inputURL: '',
        outputURL: '',
        input: {},
        output: {},
      };
    },

    filters: {
      prettySize: function (size) {
        var kilobyte = 1024;
        var megabyte = kilobyte * kilobyte;

        if (size > megabyte) {
          return (size / megabyte).toFixed(2) + ' MB';
        } else if (size > kilobyte) {
          return (size / kilobyte).toFixed(2) + ' KB';
        } else if (size >= 0) {
          return size + ' B';
        }

        return 'N/A';
      },
    },

    methods: {
      compress: function (file) {
        if (!file) {
          return;
        }

        console.log('Input: ', file);

        if (URL) {
          this.inputURL = URL.createObjectURL(file);
        }

        this.input = file;
        new Compressor(file, this.options);
      },

      change: function (e) {
        this.compress(e.target.files ? e.target.files[0] : null);
      },

      dragover: function(e) {
        e.preventDefault();
      },

      drop: function(e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
      },
    },

    watch: {
      options: {
        deep: true,
        handler: function () {
          this.compress(this.input);
        },
      },
    },

    mounted: function () {
      if (!XMLHttpRequest) {
        return;
      }

	// eXeLearning
	var name = "exelearning.png";
	var url = "images/"+name;
	var originalSrc = top.imgCompressor.originalSrc;
	if (originalSrc.indexOf("resources/")==0) {
		var parts = originalSrc.split("/");
		parts = parts[1];
		if (parts!="") {
			url = top.window.location+"/"+originalSrc;
			name = parts;
			var backupWarning = $i18n.backupWarning;
				backupWarning = backupWarning.replace("%s",'<a href="'+url+'" download="'+name+'">');
				backupWarning = backupWarning.replace("%s",'</a>');
			$("#imageEditorBackupMessage").html(backupWarning);
		}
	} else if (originalSrc.indexOf("/previews/")==0) {
		top.eXe.app.alert($i18n.newImageWarning);
	}

      var vm = this;
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var blob = xhr.response;
        var date = new Date();

        blob.lastModified = date.getTime();
        blob.lastModifiedDate = date;
        blob.name = name;
        vm.compress(blob);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    },
  });
});
// eXeLearning
var eXeImageCompressor = {
	type : "file", // base64 or file
	init : function(){
		this.i18n();
		setTimeout(function(){
			jQuery("#imageEditorSaveImg").fadeIn().click(function(){
      
				var img = jQuery("#imageEditorOutputImg")
				var src = img.attr("src");					
				
				// This will upload the image before inserting it in TinyMCE
				// You'll insert /previews/image_name.png instead of a Base64 image
				if (eXeImageCompressor.type=="file") {
					if (src.indexOf("data:image/")==0) {
						var ext = src.replace("data:image/","");
							ext = ext.split(";");
							ext = ext[0];
						if (ext!="") {
							ext = ext.toLowerCase();
							if (ext=="jpeg") ext = "jpg";
							if (ext=='png' || ext=='gif' || ext=='jpg') {
								var editor = top.imgCompressor.editor.getBody();
								var imgs = editor.getElementsByTagName("IMG");
								var n = imgs.length;
								var name = "img"+n+"."+ext;
								top.imgCompressor.fileToSave = name;
								top.$exeAuthoring.fileUpload("uploadCompressedImage",src,name);
								return false;									
							}
						}
					}	
				}
						
				// This will return a base64 image
				// previewTinyMCEimageDragDrop will do the rest
				// But it will always be a PNG image...
				var tmp = new Image();
				tmp.onload = function() {
					var width = this.width || "";
					var height = this.height || "";
					try {
						top.imgCompressor.callback(src+"?v="+Date.now(),width,height);
					} catch(e) {}
				}
				tmp.src = src;			
				return false;
				
			});
		},1000);
		
	},
	i18n : function(){

		document.title = $i18n.imageOptimizer;
		var e = $("#imageEditorUploader p");
		var html = $i18n.uploadInstructions;
			html = html.replace("%s",'<label for="file">');
			html = html.replace("%s",'<input type="file" id="file" accept="image/*" class="sr-only"></label>');
			e.html(html)
		$("label[for='inputMaxWidth']").html($i18n.maxWidth+":");
		$("label[for='inputMaxHeight']").html($i18n.maxHeight+":");
		$("label[for='inputWidth']").html($i18n.width+":");
		$("label[for='inputHeight']").html($i18n.height+":");
		$("label[for='inputQuality']").html($i18n.quality+":");
		$("#imageEditorLabelName").html($i18n.name+":");
		$("#imageEditorLabelOriginalSize").html($i18n.originalSize+":");
		$("#imageEditorLabelResultSize").html($i18n.resultSize+":");	
		$("#imageEditorSaveImg").html($i18n.finish);
    
	}	
}
jQuery(function(){
	eXeImageCompressor.init();
});