// Effects Plugin for eXeLearning
// By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
// Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
$exeFX = {
	baseClass : "exe",
	h2 : "h2",
	isOldBrowser : false,	
	init : function(){
		var ie = $exeFX.checkIE();
		if ((!isNaN(parseFloat(ie)) && isFinite(ie)) && ie<9) {
			$exeFX.isOldBrowser = true;	
			$exeFX.h2 = "H2";	
		}		
		var k = $exeFX.baseClass;
		var f = $("."+k+"-fx");
		$("."+k+"-fx").each(function(i){
			var c = this.className;
			if (c.indexOf(" "+k+"-accordion")!=-1) $exeFX.accordion.init(this,i);
			else if (c.indexOf(" "+k+"-tabs")!=-1) $exeFX.tabs.init(this,i);
			else if (c.indexOf(" "+k+"-paginated")!=-1) $exeFX.paginated.init(this,i);
			else if (c.indexOf(" "+k+"-carousel")!=-1) $exeFX.carousel.init(this,i);
		});
	},
	rftTitles : function(t) {
		// Replace <h2 title=""></h2> by <h2><span title=""></span></h2>. That's how TinyMCE inserts the title when using the Insert/Edit Attributes option
		var s = t.split('<'+$exeFX.h2+' title="');
		var n ="";
		for (var i=0;i<s.length;i++) {
		  n += s[i];
		  if (i<(s.length-1))n += '<'+$exeFX.h2+'><span title="';
		  n = n.replace("</"+$exeFX.h2+">","</span></"+$exeFX.h2+">");
		}
		return n;
	},
	accordion : {
		closeBlock : function(aID){
			var k = $exeFX.baseClass;
			$('.fx-accordion-title',"#"+aID).removeClass('active');
			$('.fx-accordion-content',"#"+aID).slideUp(300).removeClass('open');		
		},
		enable : function(x){
			var k = $exeFX.baseClass;
			var t = $('.fx-accordion-title',x);
			// Get the box shadow color
			var color = t.eq(0).css("background-color");
			color = color.replace("rgb(","rgba(").replace(")",",0.5)");
			if (color.indexOf("rgba(")==0) x.css("box-shadow","0px 1px 3px "+color);
			// Get border color (titles)
			color = x.css("background-color");
			color = color.replace("rgb(","rgba(").replace(")",",0.2)");
			if (color.indexOf("rgba(")==0) {
				t.each(function(){
					this.style.borderColor=color;
				});
			}
			// onclick
			t.click(function(e) {
				var aID = this.id.split("-")[0];
				aID = aID.replace("_","-").replace("_","-");
				var currentAttrValue = $(this).attr('href');
				
				// IE7 retrieves link#hash instead of #hash
				currentAttrValue = currentAttrValue.split("#");
				currentAttrValue = "#"+currentAttrValue[1];
				// / IE7
				
				var target = $(e.target);
				var targetName;

				if ($exeFX.isOldBrowser) targetName = target[0].nodeName;
				else targetName = target[0].localName;
				
				if (targetName==$exeFX.h2) target = target.parent();
				
				if(target.is('.active')) {
					$exeFX.accordion.closeBlock(aID);
				} else {
					$exeFX.accordion.closeBlock(aID);
					$(this).addClass('active');
					$('.'+k+'-accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
				}
				e.preventDefault();
			});		
		},
		rft : function(e,i){
			var html = "";
			var h = e.html();
			h = $exeFX.rftTitles(h);
			var p = h.split('<'+$exeFX.h2+'>');
			if (p.length==h.split('</'+$exeFX.h2+'>').length) {
				for (var x=1; x<p.length; x++) {
					html += '<'+$exeFX.h2+'>'+p[x];
				}
			}			

			var k = $exeFX.baseClass;
			if ($exeFX.isOldBrowser) {
				html = html.replace(/<H2/g, '</div>\n<H2');
				html = html.replace('</div>\n<H2','<H2')
				html = html.replace(/<\/H2>/g, '</H2>\n<div class="fx-accordion-content">');				
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2')
				html = html.replace(/<\/h2>/g, '</h2>\n<div class="fx-accordion-content">');
			}

			html = html + '</div>';
			e.html('<div id="'+k+'-accordion-'+i+'">\n<div class="fx-accordion-section">\n'+html+'\n</div>\n</div>\n');
			var h2 = $("h2",e);
			$(".fx-accordion-content",e).each(function(y){
				var id = k+"-accordion-"+i+"-"+y;
				this.id = id;
				h2.eq(y).wrap('<a class="fx-accordion-title fx-accordion-title-'+y+' fx-C1" href="#'+id+'" id="'+id.replace("-","_").replace("-","_")+'-trigger"></a>');
			});
			$exeFX.accordion.enable(e);
		},
		init : function(x,i){
			var e = $(x);
			var a = $("h2",e);
			if (a.length>0) $exeFX.accordion.rft(e,i);
		}
	},
	tabs : {
		show : function(gID,id){
			var g = $("#"+gID);
			$(".fx-tabs li",g).removeClass("fx-current").removeClass("fx-C2");
			$("#"+id+"-link").addClass("fx-current fx-C2");
			$(".fx-tab-content",g).removeClass("fx-current");
			$("#"+id).addClass("fx-current");
		},
		rft : function(e,i){
			var html = "";
			var k = $exeFX.baseClass;
			var gID = k+"-tabs-"+i;
			var h = e.html();
			h = $exeFX.rftTitles(h);
			var p = h.split('<'+$exeFX.h2+'>');
			if (p.length==h.split('</'+$exeFX.h2+'>').length) {
				for (var x=1; x<p.length; x++) {
					html += '<'+$exeFX.h2+'>'+p[x];
				}
			}
			if ($exeFX.isOldBrowser) {
				html = html.replace(/<H2/g, '</div>\n<H2');
				html = html.replace('</div>\n<H2','<H2');
				html = html.replace(/<H2/g, '<div class="fx-tab-content fx-C2">\n<H2 class="sr-av"');
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2');
				html = html.replace(/<h2/g, '<div class="fx-tab-content fx-C2">\n<h2 class="sr-av"');
			}
			html = html + '</div>';
			e.attr("id",gID).html(html);
			
			var ul = '<ul class="fx-tabs">\n';
			$(".fx-tab-content",e).each(function(y){
				var h2 = $("H2",this).eq(0);
				var t = h2.text();
				var hT = $("SPAN",h2);
				if (hT.length==1) {
					hT = hT.eq(0).attr("title");
					if (hT) {
						t = hT;
						h2.removeClass("sr-av")
					}
				}
				var id = k+"-tab-"+i+"-"+y;
				var c = "";
				if (y==0) {
					c += ' class="fx-current fx-C2"';
					this.className += " fx-current fx-default-panel";
				}
				ul += '<li'+c+' id="'+id+'-link"><a href="#'+id+'" onclick="$exeFX.tabs.show(\''+gID+'\',\''+id+'\');return false">'+t+'</a></li>\n';
				this.id = id;
			});
			ul += '</ul>';
			e.prepend(ul);
		},	
		init : function(x,i){
			var e = $(x);
			var a = $("h2",e);
			if (a.length>0) $exeFX.tabs.rft(e,i);
		}
	},
	paginated : {
		show : function(gID,id,n){
			var g = $("#"+gID);
			var lis = $(".fx-pagination li",g);
			
			// Pagination
			var l = (lis.length-2);
			if (l==1) return false;
			var prevLi = $("#"+gID+"-prev");
			var prevA = document.getElementById(gID+"-prev-lnk");
			var nextLi = $("#"+gID+"-next");
			var nextA = document.getElementById(gID+"-next-lnk");
			if (!prevA || !nextA) return false;
			if (n==0) {
				// Prev
				prevLi.addClass("fx-disabled");
				prevA.onclick = function(){ return false }
				// Next
				nextLi.removeClass("fx-disabled");
				nextA.onclick = function(){
					$exeFX.paginated.show(gID,gID+"-1",1);
					return false;
				}
			} else {
				// Prev
				prevLi.removeClass("fx-disabled");
				prevA.onclick = function(){
					$exeFX.paginated.show(gID,gID+"-"+(n-1),(n-1));
					return false;
				}	
				// Next
				if ((n+2)>l) {
					nextLi.addClass("fx-disabled");
					nextA.onclick = function(){ return false }
				} else {
					nextLi.removeClass("fx-disabled");
					nextA.onclick = function(){
						$exeFX.paginated.show(gID,gID+"-"+(n+1),(n+1));
						return false;					
					}
				}
			}
			
			lis.removeClass("fx-current").removeClass("fx-C1");
			$("#"+id+"-link").addClass("fx-current fx-C1");
			$(".fx-page-content",g).removeClass("fx-current");
			$("#"+id).addClass("fx-current");
		},	
		init : function(x,i){
			var e = $(x);
			var a = $("h2",e);
			if (a.length>0) $exeFX.paginated.rft(e,i);
		},
		rft : function(e,i){
			var html = "";
			var k = $exeFX.baseClass;
			var gID = k+"-paginated-"+i;
			var h = e.html();
			h = $exeFX.rftTitles(h);
			var p = h.split('<'+$exeFX.h2+'>');
			if (p.length==h.split('</'+$exeFX.h2+'>').length) {
				for (var x=1; x<p.length; x++) {
					html += '<'+$exeFX.h2+'>'+p[x];
				}
			}
			if ($exeFX.isOldBrowser) {
				html = html.replace(/<H2/g, '</div>\n<H2');
				html = html.replace('</div>\n<H2','<H2');
				html = html.replace(/<H2/g, '<div class="fx-page-content fx-C2">\n<H2');				
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2');
				html = html.replace(/<h2/g, '<div class="fx-page-content fx-C2">\n<h2');
			}
			html = html + '</div>';
			e.attr("id",gID).html(html);
			
			var counter = 0;
			var hasNext = false;
			var ul = '<ul class="fx-pagination">\n';
			ul += '<li id="'+k+'-paginated-'+i+'-prev" class="fx-prev-next fx-prev fx-disabled"><a href="#" id="'+k+'-paginated-'+i+'-prev-lnk" title="'+$exe_i18n.previous+'" onclick="return false"><span>&#9668;</span></a></li>';
			$(".fx-page-content",e).each(function(y){
				var t = $("H2",this).eq(0).text();
				t = t.replace(/\"/g, '&quot;');
				var id = k+"-paginated-"+i+"-"+y;
				var c = "";
				if (y==0) {
					c += ' class="fx-current fx-C1"';
					this.className += " fx-current";
				}
				ul += '<li'+c+' id="'+id+'-link"><a href="#'+id+'" onclick="$exeFX.paginated.show(\''+gID+'\',\''+id+'\','+y+');return false" title="'+t+'">'+(y+1)+'</a></li>\n';
				this.id = id;
				counter ++;
			});
			if (counter>1) hasNext = true;
			ul += '<li id="'+k+'-paginated-'+i+'-next" class="fx-prev-next fx-next';
			if (!hasNext) ul += ' fx-disabled';
			ul +='"><a href="#" id="'+k+'-paginated-'+i+'-next-lnk" title="'+$exe_i18n.next+'"';
			if (hasNext) ul += ' onclick="$exeFX.paginated.show(\''+gID+'\',\''+gID+'-1\',1);return false"'
			ul += '><span>&#9658;</span></a></li>';
			ul += '</ul>';
			e.prepend(ul);
		}
	},
	carousel : {
		show : function(gID,id,n){
			var g = $("#"+gID);
			var lis = $(".fx-carousel-pagination li",g);
			
			// Pagination
			var l = (lis.length-2);
			if (l==1) return false;
			var prevLi = $("#"+gID+"-prev");
			var prevA = document.getElementById(gID+"-prev-lnk");
			var nextLi = $("#"+gID+"-next");
			var nextA = document.getElementById(gID+"-next-lnk");
			if (!prevA || !nextA) return false;
			if (n==0) {
				// Prev
				prevLi.addClass("fx-disabled");
				prevA.onclick = function(){ return false }
				// Next
				nextLi.removeClass("fx-disabled");
				nextA.onclick = function(){
					$exeFX.carousel.show(gID,gID+"-1",1);
					return false;
				}
			} else {
				// Prev
				prevLi.removeClass("fx-disabled");
				prevA.onclick = function(){
					$exeFX.carousel.show(gID,gID+"-"+(n-1),(n-1));
					return false;
				}	
				// Next
				if ((n+2)>l) {
					nextLi.addClass("fx-disabled");
					nextA.onclick = function(){ return false }
				} else {
					nextLi.removeClass("fx-disabled");
					nextA.onclick = function(){
						$exeFX.carousel.show(gID,gID+"-"+(n+1),(n+1));
						return false;					
					}
				}
			}
			
			lis.removeClass("fx-current").removeClass("fx-C1");
			$("#"+id+"-link").addClass("fx-current fx-C1");
			$(".fx-carousel-content",g).hide();
			$("#"+id).fadeIn("slow");
		},	
		init : function(x,i){
			var e = $(x);
			var a = $("h2",e);
			if (a.length>0) $exeFX.carousel.rft(e,i);
		},
		rft : function(e,i){
			var html = "";
			var k = $exeFX.baseClass;
			var gID = k+"-carousel-"+i;
			var h = e.html();
			h = $exeFX.rftTitles(h);
			var p = h.split('<'+$exeFX.h2+'>');
			if (p.length==h.split('</'+$exeFX.h2+'>').length) {
				for (var x=1; x<p.length; x++) {
					html += '<'+$exeFX.h2+'>'+p[x];
				}
			}
			if ($exeFX.isOldBrowser) {
				html = html.replace(/<H2/g, '</div>\n<H2');
				html = html.replace('</div>\n<H2','<H2');
				html = html.replace(/<H2/g, '<div class="fx-carousel-content fx-C2">\n<H2');
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2');
				html = html.replace(/<h2/g, '<div class="fx-carousel-content fx-C2">\n<h2');
			}
			html = html + '</div>';
			e.attr("id",gID).html(html);
			
			var counter = 0;
			var hasNext = false;
			var ul = '<ul class="fx-pagination fx-carousel-pagination">\n';
			ul += '<li id="'+k+'-carousel-'+i+'-prev" class="fx-carousel-prev-next fx-carousel-prev fx-disabled fx-C2"><a href="#" id="exe-carousel-'+i+'-prev-lnk" title="'+$exe_i18n.previous+'" onclick="return false"><span>&#9668;</span></a></li>';
			$(".fx-carousel-content",e).each(function(y){
				var t = $("H2",this).eq(0).text();
				t = t.replace(/\"/g, '&quot;');
				var id = k+"-carousel-"+i+"-"+y;
				var c = "";
				if (y==0) {
					c += ' class="fx-current fx-C1"';
					this.className += " fx-current";
				}
				ul += '<li'+c+' id="'+id+'-link"><a href="#'+id+'" onclick="$exeFX.carousel.show(\''+gID+'\',\''+id+'\','+y+');return false" title="'+t+'">'+(y+1)+'</a></li>\n';
				this.id = id;
				counter ++;
			});
			if (counter>1) hasNext = true;
			ul += '<li id="'+k+'-carousel-'+i+'-next" class="fx-carousel-prev-next fx-carousel-next fx-C2';
			if (!hasNext) ul += ' fx-disabled';
			ul +='"><a href="#" id="'+k+'-carousel-'+i+'-next-lnk" title="'+$exe_i18n.next+'"';
			if (hasNext) ul += ' onclick="$exeFX.carousel.show(\''+gID+'\',\''+gID+'-1\',1);return false"'
			ul += '><span>&#9658;</span></a></li>';
			ul += '</ul>';
			e.append(ul);
		}
	},
	checkIE : function(){
		var n = navigator.userAgent.toLowerCase();
		return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
	}	
}
$(function(){
	$exeFX.init();
});