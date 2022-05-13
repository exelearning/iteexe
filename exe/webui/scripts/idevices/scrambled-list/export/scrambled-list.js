/**
 * Scrambled List iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 * It includes the HTML5 Sortable jQuery Plugin, released under the MIT license (details below)
 */
var $exeScrambledList = {
    
	init : function(){
        $(".exe-sortableList").each(function(instance){
			if ($('body').hasClass("exe-epub3")) {
				$(this).prepend('<p>'+$exe_i18n.epubDisabled+'</p><p><strong>'+$exe_i18n.solution+':</strong></p>')
            } else {
				$exeScrambledList.enableList(this,instance);
			}
        });
	},
    
    enableList : function(activity,instance){
		var lists = $("ul.exe-sortableList-list",activity);
		var btn = $("p.exe-sortableList-buttonText",activity);
		if (lists.length==1&&btn.length==1) {
			lists.css("visibility","hidden");
			lists.each(
				function(){
					var lis = [];
					$("LI",this).each(function(){
						lis.push(this.innerHTML);
					});
					lis = $exeScrambledList.randomizeArray(lis);
					$exeScrambledList.getListHTML(activity,lis,this,instance,btn);
				}
			);
		}        
    },
    
	getLinksHTML : function(i,listOrder){
		return '<span> <a href="#" class="up exe-sortableList-sorter exe-sortableList-sort-'+i+'_'+(i-1)+'_'+listOrder+'" title="'+(i+1)+' &rarr; '+i+'"><span class="sr-av">'+(i+1)+' &rarr; '+i+'</span></a> <a href="#" class="down exe-sortableList-sorter exe-sortableList-sort-'+i+'_'+(i+1)+'_'+listOrder+'" title="'+(i+1)+' &rarr; '+(i+2)+'"><span class="sr-av">'+(i+1)+' &rarr; '+(i+2)+'</span></a></span>';
	},
    
	getListLinks : function(listOrder) {
		var ul = $("#exe-sortableList-"+listOrder);
		var lis = $("li",ul);
		$("SPAN",ul).remove();
		lis.each(function(i){
			this.className = "";
			if (i==0) this.className = "first";
			if ((i+1)==lis.length) this.className = "last";
			this.innerHTML += $exeScrambledList.getLinksHTML(i,listOrder);
		});
		// No inline JavaScript (onclick, etc.)
		$('a.exe-sortableList-sorter',ul).each(function(){
			var c = this.className;
				c = c.split("exe-sortableList-sort-");
				if (c.length==2) {
					c = c[1].split('_');
					if (c.length==3) {
						this.onclick = function(){
							$exeScrambledList.sortList(this,parseInt(c[0]),parseInt(c[1]),parseInt(c[2]));
							return false;
						}
					}
				}
		});		
	},
    
	sortList : function(e,a,b,listOrder){ // LI - FROM - TO
		var list = $("#exe-sortableList-"+listOrder);
		list.sortable("destroy");
		var lis = $("LI",list);
		if (b<0 || b>(lis.length-1)) return false;
		var newList = [];
		var li, prev, current, next;
		for (var i=0;i<lis.length;i++) {
			li = lis[i].innerHTML.split("<span>")[0].split("<SPAN>")[0];
			newList.push(li);
			if (i==(a-1)) prev = li;
			else if (i==a) current = li;
			else if (i==(a+1)) next = li;
		}
		newList[b] = current;
		if (b<a) { // Up
			newList[a] = prev;
		} else { // Down
			newList[a] = next;
		}
		list.html($exeScrambledList.getULhtml(newList,listOrder)).sortable();
	},	
    
	getULhtml : function(lis,listOrder){
		html = '';
		for (var i=0;i<lis.length;i++) {
			html += '<li>'+lis[i]+'</li>';
		}
		$("#exe-sortableList-"+listOrder).html(html).sortable();
		$exeScrambledList.getListLinks(listOrder);
	},
    
	getListHTML : function(activity,lis,list,listOrder,btn) {
		var html = '<ul class="exe-sortableList-options" id="exe-sortableList-'+listOrder+'">';
		for (var i=0;i<lis.length;i++) {
			html += '<li>'+lis[i]+'</li>';
		}
		html += "</ul>";
		html += '<p id="exe-sortableListButton-'+listOrder+'"><input type="button" class="feedbackbutton exe-sortableList-check-'+listOrder+'" value="'+btn.text()+'" /></p>';
		html += '<div id="exe-sortableList-'+listOrder+'-feedback"></div>';
		$(list).hide().attr("id","exe-sortableListResults-"+listOrder).before(html);
		$("#exe-sortableList-"+listOrder).sortable().bind('sortupdate', function(e, ui) {
			$exeScrambledList.getListLinks(listOrder);
		});			
		$exeScrambledList.getListLinks(listOrder);
		// Event handlers
		$("#exe-sortableListButton-"+listOrder).click(function(){
			$exeScrambledList.check(this,listOrder);
		});
		// / Event handlers		
	},
    
	check : function(e,listOrder){
		// No more sorting 
		$("#exe-sortableListButton-"+listOrder).hide();
		var list = $("#exe-sortableList-"+listOrder);
		$("a",list).hide();
		list.sortable("destroy");
		// Check the answers
		var activity = $(e).parents(".exe-sortableList");
        var right = true;
		var userList = $("#exe-sortableList-"+listOrder);
		var rightAnswers = $("#exe-sortableListResults-"+listOrder);
		var rightAnswersLis = $("li",rightAnswers);
		$("LI",userList).each(function(i){
			var currentText = $(this).html().split("<span>")[0].split("<SPAN>")[0];
			if (currentText != rightAnswersLis.eq(i).html()) right = false;
		});
        var feedback = $('#exe-sortableList-'+listOrder+'-feedback');
		// Show the feedback
		if (right) feedback.html("<p>"+$(".exe-sortableList-rightText",activity).text()+"</p>").hide().attr("class","feedback feedback-right").fadeIn();
		else feedback.html("<p>"+$(".exe-sortableList-wrongText",activity).text()+"</p><ul>"+rightAnswers.html()+"</ul>").hide().attr("class","feedback feedback-wrong").fadeIn();
	},
    
	randomizeArray : function(o){
		var original = [];
		for (var w=0;w<o.length;w++) original.push(o[w]);
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		var hasChanged = false;
		for (var y=0;y<o.length;y++){
			if (!hasChanged && original[y]!=o[y]) hasChanged = true;
		}
		if (hasChanged) return o;
		else return this.randomizeArray(original);
	}
    
}

$(function(){
	$exeScrambledList.init();
});

/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
 *
 *
 * Released under the MIT license.
 */
!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports?module.exports=t(require("jquery")):e.sortable=t(e.jQuery)}(this,function(e){"use strict";var t,a,r=e(),n=[],i=function(e){e.off("dragstart.h5s"),e.off("dragend.h5s"),e.off("selectstart.h5s"),e.off("dragover.h5s"),e.off("dragenter.h5s"),e.off("drop.h5s")},o=function(e){e.off("dragover.h5s"),e.off("dragenter.h5s"),e.off("drop.h5s")},d=function(e,t){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text",""),e.dataTransfer.setDragImage&&e.dataTransfer.setDragImage(t.item,t.x,t.y)},s=function(e,t){return t.x||(t.x=parseInt(e.pageX-t.draggedItem.offset().left)),t.y||(t.y=parseInt(e.pageY-t.draggedItem.offset().top)),t},l=function(e){return{item:e[0],draggedItem:e}},f=function(e,t){var a=l(t);a=s(e,a),d(e,a)},h=function(e,t){return"undefined"==typeof e?t:e},g=function(e){e.removeData("opts"),e.removeData("connectWith"),e.removeData("items"),e.removeAttr("aria-dropeffect")},c=function(e){e.removeAttr("aria-grabbed"),e.removeAttr("draggable"),e.removeAttr("role")},u=function(e,t){return e[0]===t[0]?!0:void 0!==e.data("connectWith")?e.data("connectWith")===t.data("connectWith"):!1},p=function(e){var t=e.data("opts")||{},a=e.children(t.items),r=t.handle?a.find(t.handle):a;o(e),g(e),r.off("mousedown.h5s"),i(a),c(a)},m=function(t){var a=t.data("opts"),r=t.children(a.items),n=a.handle?r.find(a.handle):r;t.attr("aria-dropeffect","move"),n.attr("draggable","true");var i=(document||window.document).createElement("span");"function"!=typeof i.dragDrop||a.disableIEFix||n.on("mousedown.h5s",function(){-1!==r.index(this)?this.dragDrop():e(this).parents(a.items)[0].dragDrop()})},v=function(e){var t=e.data("opts"),a=e.children(t.items),r=t.handle?a.find(t.handle):a;e.attr("aria-dropeffect","none"),r.attr("draggable",!1),r.off("mousedown.h5s")},b=function(e){var t=e.data("opts"),a=e.children(t.items),r=t.handle?a.find(t.handle):a;i(a),r.off("mousedown.h5s"),o(e)},x=function(i,o){var s=e(i),l=String(o);return o=e.extend({connectWith:!1,placeholder:null,dragImage:null,
// The New eXeLearning
// #305 (disable disableIEFix for IE11)
// Original code: disableIEFix:!1,
// / The New eXeLearning
disableIEFix:(!!window.MSInputMethodContext && !!document.documentMode) == true ? 1 : !1,
placeholderClass:"sortable-placeholder",draggingClass:"sortable-dragging",hoverClass:!1},o),s.each(function(){var i=e(this);if(/enable|disable|destroy/.test(l))return void x[l](i);o=h(i.data("opts"),o),i.data("opts",o),b(i);var s,g,c,p=i.children(o.items),v=null===o.placeholder?e("<"+(/^ul|ol$/i.test(this.tagName)?"li":"div")+' class="'+o.placeholderClass+'"/>'):e(o.placeholder).addClass(o.placeholderClass);if(!i.attr("data-sortable-id")){var I=n.length;n[I]=i,i.attr("data-sortable-id",I),p.attr("data-item-sortable-id",I)}if(i.data("items",o.items),r=r.add(v),o.connectWith&&i.data("connectWith",o.connectWith),m(i),p.attr("role","option"),p.attr("aria-grabbed","false"),o.hoverClass){var C="sortable-over";"string"==typeof o.hoverClass&&(C=o.hoverClass),p.hover(function(){e(this).addClass(C)},function(){e(this).removeClass(C)})}p.on("dragstart.h5s",function(r){r.stopImmediatePropagation(),o.dragImage?(d(r.originalEvent,{item:o.dragImage,x:0,y:0}),console.log("WARNING: dragImage option is deprecated and will be removed in the future!")):f(r.originalEvent,e(this),o.dragImage),t=e(this),t.addClass(o.draggingClass),t.attr("aria-grabbed","true"),s=t.index(),a=t.height(),g=e(this).parent(),t.parent().triggerHandler("sortstart",{item:t,placeholder:v,startparent:g})}),p.on("dragend.h5s",function(){t&&(t.removeClass(o.draggingClass),t.attr("aria-grabbed","false"),t.show(),r.detach(),c=e(this).parent(),t.parent().triggerHandler("sortstop",{item:t,startparent:g}),(s!==t.index()||g.get(0)!==c.get(0))&&t.parent().triggerHandler("sortupdate",{item:t,index:c.children(c.data("items")).index(t),oldindex:p.index(t),elementIndex:t.index(),oldElementIndex:s,startparent:g,endparent:c}),t=null,a=null)}),e(this).add([v]).on("drop.h5s",function(a){return u(i,e(t).parent())?(a.stopPropagation(),r.filter(":visible").after(t),t.trigger("dragend.h5s"),!1):void 0}),p.add([this]).on("dragover.h5s dragenter.h5s",function(n){if(u(i,e(t).parent())){if(n.preventDefault(),n.originalEvent.dataTransfer.dropEffect="move",p.is(this)){var d=e(this).height();if(o.forcePlaceholderSize&&v.height(a),d>a){var s=d-a,l=e(this).offset().top;if(v.index()<e(this).index()&&n.originalEvent.pageY<l+s)return!1;if(v.index()>e(this).index()&&n.originalEvent.pageY>l+d-s)return!1}t.hide(),v.index()<e(this).index()?e(this).after(v):e(this).before(v),r.not(v).detach()}else r.is(this)||e(this).children(o.items).length||(r.detach(),e(this).append(v));return!1}})})};return x.destroy=function(e){p(e)},x.enable=function(e){m(e)},x.disable=function(e){v(e)},e.fn.sortable=function(e){return x(this,e)},x});