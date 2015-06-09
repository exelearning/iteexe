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
			$('.'+k+'-accordion-title',"#"+aID).removeClass('active');
			$('.'+k+'-accordion-content',"#"+aID).slideUp(300).removeClass('open');		
		},
		enable : function(x){
			var k = $exeFX.baseClass;
			$('.'+k+'-accordion-title',x).click(function(e) {
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
				html = html.replace(/<\/H2>/g, '</H2>\n<div class="'+k+'-accordion-content">');				
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2')
				html = html.replace(/<\/h2>/g, '</h2>\n<div class="'+k+'-accordion-content">');
			}

			html = html + '</div>';
			e.html('<div id="'+k+'-accordion-'+i+'">\n<div class="'+k+'-accordion-section">\n'+html+'\n</div>\n</div>\n');
			var h2 = $("h2",e);
			$("."+k+"-accordion-content",e).each(function(y){
				var id = k+"-accordion-"+i+"-"+y;
				this.id = id;
				h2.eq(y).wrap('<a class="'+k+'-accordion-title" href="#'+id+'" id="'+id.replace("-","_").replace("-","_")+'-trigger"></a>');
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
			$(".tabs li",g).removeClass("current");
			$("#"+id+"-link").addClass("current");
			$(".tab-content",g).removeClass("current");
			$("#"+id).addClass("current");
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
				html = html.replace(/<H2/g, '<div class="fx-content tab-content">\n<H2 class="sr-av"');
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2');
				html = html.replace(/<h2/g, '<div class="fx-content tab-content">\n<h2 class="sr-av"');
			}
			html = html + '</div>';
			e.attr("id",gID).html(html);
			
			var ul = '<ul class="fx-nav tabs">\n';
			$(".tab-content",e).each(function(y){
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
					c += ' class="current"';
					this.className += " current default-panel";
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
				prevLi.addClass("disabled");
				prevA.onclick = function(){ return false }
				// Next
				nextLi.removeClass("disabled");
				nextA.onclick = function(){
					$exeFX.paginated.show(gID,gID+"-1",1);
					return false;
				}
			} else {
				// Prev
				prevLi.removeClass("disabled");
				prevA.onclick = function(){
					$exeFX.paginated.show(gID,gID+"-"+(n-1),(n-1));
					return false;
				}	
				// Next
				if ((n+2)>l) {
					nextLi.addClass("disabled");
					nextA.onclick = function(){ return false }
				} else {
					nextLi.removeClass("disabled");
					nextA.onclick = function(){
						$exeFX.paginated.show(gID,gID+"-"+(n+1),(n+1));
						return false;					
					}
				}
			}
			
			lis.removeClass("current");
			$("#"+id+"-link").addClass("current");
			$(".page-content",g).removeClass("current");
			$("#"+id).addClass("current");
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
				html = html.replace(/<H2/g, '<div class="fx-content page-content">\n<H2');				
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2');
				html = html.replace(/<h2/g, '<div class="fx-content page-content">\n<h2');
			}
			html = html + '</div>';
			e.attr("id",gID).html(html);
			
			var counter = 0;
			var hasNext = false;
			var ul = '<ul class="fx-nav fx-pagination">\n';
			ul += '<li id="'+k+'-paginated-'+i+'-prev" class="fx-pg fx-prev disabled"><a href="#" id="'+k+'-paginated-'+i+'-prev-lnk" title="'+$exe_i18n.previous+'">&#9668;</a></li>';
			$(".page-content",e).each(function(y){
				var t = $("H2",this).eq(0).text();
				t = t.replace(/\"/g, '&quot;');
				var id = k+"-paginated-"+i+"-"+y;
				var c = "";
				if (y==0) {
					c += ' class="current"';
					this.className += " current";
				}
				ul += '<li'+c+' id="'+id+'-link"><a href="#'+id+'" onclick="$exeFX.paginated.show(\''+gID+'\',\''+id+'\','+y+');return false" title="'+t+'">'+(y+1)+'</a></li>\n';
				this.id = id;
				counter ++;
			});
			if (counter>1) hasNext = true;
			ul += '<li id="'+k+'-paginated-'+i+'-next" class="fx-pg fx-next';
			if (!hasNext) ul += ' disabled';
			ul +='"><a href="#" id="'+k+'-paginated-'+i+'-next-lnk" title="'+$exe_i18n.next+'"';
			if (hasNext) ul += ' onclick="$exeFX.paginated.show(\''+gID+'\',\''+gID+'-1\',1);return false"'
			ul += '>&#9658;</a></li>';
			ul += '</ul>';
			e.prepend(ul);
		}
	},
	carousel : {
		show : function(gID,id,n){
			var g = $("#"+gID);
			var lis = $(".carousel-pagination li",g);
			
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
				prevLi.addClass("disabled");
				prevA.onclick = function(){ return false }
				// Next
				nextLi.removeClass("disabled");
				nextA.onclick = function(){
					$exeFX.carousel.show(gID,gID+"-1",1);
					return false;
				}
			} else {
				// Prev
				prevLi.removeClass("disabled");
				prevA.onclick = function(){
					$exeFX.carousel.show(gID,gID+"-"+(n-1),(n-1));
					return false;
				}	
				// Next
				if ((n+2)>l) {
					nextLi.addClass("disabled");
					nextA.onclick = function(){ return false }
				} else {
					nextLi.removeClass("disabled");
					nextA.onclick = function(){
						$exeFX.carousel.show(gID,gID+"-"+(n+1),(n+1));
						return false;					
					}
				}
			}
			
			lis.removeClass("current");
			$("#"+id+"-link").addClass("current");
			$(".carousel-page-content",g).hide();
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
				html = html.replace(/<H2/g, '<div class="fx-content carousel-page-content">\n<H2');
			} else {
				html = html.replace(/<h2/g, '</div>\n<h2');
				html = html.replace('</div>\n<h2','<h2');
				html = html.replace(/<h2/g, '<div class="fx-content carousel-page-content">\n<h2');
			}
			html = html + '</div>';
			e.attr("id",gID).html(html);
			
			var counter = 0;
			var hasNext = false;
			var ul = '<ul class="fx-nav carousel-pagination">\n';
			ul += '<li id="'+k+'-carousel-'+i+'-prev" class="'+k+'-carousel-pg '+k+'-carousel-prev disabled"><a href="#" id="exe-carousel-'+i+'-prev-lnk" title="'+$exe_i18n.previous+'"><span>&#9668;</span></a></li>';
			$(".carousel-page-content",e).each(function(y){
				var t = $("H2",this).eq(0).text();
				t = t.replace(/\"/g, '&quot;');
				var id = k+"-carousel-"+i+"-"+y;
				var c = "";
				if (y==0) {
					c += ' class="current"';
					this.className += " current";
				}
				ul += '<li'+c+' id="'+id+'-link"><a href="#'+id+'" onclick="$exeFX.carousel.show(\''+gID+'\',\''+id+'\','+y+');return false" title="'+t+'">'+(y+1)+'</a></li>\n';
				this.id = id;
				counter ++;
			});
			if (counter>1) hasNext = true;
			ul += '<li id="'+k+'-carousel-'+i+'-next" class="'+k+'-carousel-pg '+k+'-carousel-next';
			if (!hasNext) ul += ' disabled';
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