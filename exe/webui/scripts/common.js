
var objBrowse=navigator.appName;var exe_isTouchScreenDev=false;var addedAudioTags=false;var audioTagInterval=null;function exeWriteSFXAudioTags(){if(addedAudioTags==false){if(audioTagInterval==null){audioTagInterval=setInterval("exeWriteSFXAudioTags()",30);}
if(document.body!=null){var x=0;clearInterval(audioTagInterval);audioTagInterval=null;addedAudioTags=true;var audioElements=makeSoundDOMElements();var y=0;for(var i=0;i<audioElements.length;i++){document.body.appendChild(audioElements[i]);}}}}
exeWriteSFXAudioTags();function findAllMediaInElement(domElement){var foundElements=new Array();for(var i=0;i<domElement.childNodes.length;i++){var currentChild=domElement.childNodes[i];if(currentChild.childNodes.length>0){var subMediaElements=findAllMediaInElement(currentChild);for(var j=0;j<subMediaElements.length;j++){foundElements[foundElements.length]=subMediaElements[j];}
if(currentChild.nodeName=="AUDIO"|currentChild.nodeName=="VIDEO"){foundElements[foundElements.length]=currentChild;}}}
return foundElements;}
var mediaLoadInterval=null;var mediaCheckElement=null;var mediaCallback=null;var mediaToWaitFor=null;function checkAllMediaLoaded(domElement,callbackFunction){if(mediaCheckElement==null){mediaCheckElement=domElement;}
if(mediaLoadInterval==null){mediaToWaitFor=findAllMediaInElement(domElement);mediaCallback=callbackFunction;mediaLoadInterval=setInterval("checkAllMediaLoaded(null,'"+callbackFunction+"')",300);}else{var allLoaded=true;for(var i=0;i<mediaToWaitFor.length;i++){if(mediaToWaitFor[i].readyState<4){allLoaded=false;}}
if(allLoaded==true){mediaCheckElement=null;clearInterval(mediaLoadInterval);mediaLoadInterval=null;setTimeout(new String(callbackFunction),10);mediaCallback=null;}}
return 1;}
function getMaxMediaDuration(domElement,autoplay){var longestClipLength=0;var mediaItems=findAllMediaInElement(domElement);for(var i=0;i<mediaItems.length;i++){if(autoplay==true){mediaItems[i].play();}
if(mediaItems[i].duration>longestClipLength){longestClipLength=mediaItems[i].duration;}}
return longestClipLength;}
function playAndReset(audioElement){if(audioElement.paused==true&&audioElement.currentTime==0){try{audioElement.play();}catch(err){}}else{try{audioElement.pause();audioElement.addEventListener("seeked",function(){audioElement.play();},true);audioElement.currentTime=0;}catch(err2){}}}
function playPositiveFeedbackDefault(){var sndToPlayIndex=Math.floor(Math.random()*3);var audioElementToPlay=document.getElementById("exesfx_good"+sndToPlayIndex);playAndReset(audioElementToPlay);}
function playNegativeFeedbackDefault(){var audioElementToPlay=document.getElementById("exesfx_wrong");playAndReset(audioElementToPlay);}
function playClickSound(){}
function makeSoundDOMElements(){var soundElementsArr=new Array();for(var i=0;i<3;i++){soundElementsArr[i]=document.createElement('audio');soundElementsArr[i].setAttribute("src","exesfx_good"+i+".ogg");soundElementsArr[i].setAttribute("id","exesfx_good"+i);soundElementsArr[i].setAttribute("preload","auto");}
soundElementsArr[3]=document.createElement("audio");soundElementsArr[3].setAttribute("src","exesfx_wrong.ogg");soundElementsArr[3].setAttribute("id","exesfx_wrong");soundElementsArr[3].setAttribute("preload","auto");return soundElementsArr;}
function appendSoundHTML(){var htmlSound=makeSoundHTML();document.body.innerHTML+=htmlSound;}
var touchScreenDetectDone=false;function doTouchScreenDetect(){if(touchScreenDetectDone==true){return;}
var userAgent=navigator.userAgent;if(userAgent.indexOf("Android")!=-1){exe_isTouchScreenDev=true;}}
doTouchScreenDetect();function convertToDropType(){if(exe_isTouchScreenDev){$(".ClozeIdevice INPUT.clozeblank").each(function(){$(this).css("display","none");var myId=$(this).attr("id");var blankId=myId.substring(10);var myOnclick="setClozeBlankFromCurrentValue('"+blankId+"')";$(this).after("<span id='span_"+myId+"' onclick=\""+myOnclick+"\" class='idevicesubblank'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");});$(".ClozeInstructions LI").css("display","none");}}
var lastTouch;function showMe(ident,w,h)
{var elmDiv=document.getElementById('popupmessage');hideMe();if(!elmDiv||elmDiv.innerHTML!=document.getElementById(ident).innerHTML){elmDiv=document.createElement('div');elmDiv.id='popupmessage';elmDiv.className="popupDiv";var xloc=(xpos+w>740)?Math.max(0,xpos-w-15):xpos;elmDiv.style.cssText='position:absolute; left: '+
(xloc)+'px; top: '+(ypos-h/2)+'px; width: '+w+'px;';elmDiv.innerHTML=document.getElementById(ident).innerHTML;document.body.appendChild(elmDiv);new dragElement('popupmessage');}}
function hideMe(){var elmDiv=document.getElementById('popupmessage');if(elmDiv){elmDiv.parentNode.removeChild(elmDiv);}}
function updateCoords(e){if(e.pageX==null&&e.clientX!=null){var b=document.body;e.pageX=e.clientX+(e&&e.scrollLeft||b.scrollLeft||0);e.pageY=e.clientY+(e&&e.scrollTop||b.scrollTop||0);}
xpos=e.pageX;ypos=e.pageY;}
function getFeedback(optionId,optionsNum,ideviceId,mode){var i,id;for(i=0;i<optionsNum;i++){if(mode=="multi")
id="sa"+i+"b"+ideviceId
else
id="s"+i+"b"+ideviceId
if(i==optionId)
document.getElementById(id).style.display="block";else
document.getElementById(id).style.display="None";}
if(mode=='truefalse'){var sfbk=document.getElementById("sfbk"+ideviceId);if(sfbk)sfbk.style.display="block";}}
NOT_ATTEMPTED=0
WRONG=1
CORRECT=2
function onClozeChange(ele){var ident=getClozeIds(ele)[0];var instant=eval(document.getElementById('clozeFlag'+ident+'.instantMarking').value);if(instant){checkAndMarkClozeWord(ele);var scorePara=document.getElementById('clozeScore'+ident);scorePara.innerHTML="";}}
function clozeSubmit(ident){showClozeScore(ident,1);toggleElementVisible('submit'+ident);toggleElementVisible('restart'+ident);toggleElementVisible('showAnswersButton'+ident);toggleClozeFeedback(ident);}
function clozeRestart(ident){toggleClozeFeedback(ident);toggleClozeAnswers(ident,true);toggleElementVisible('restart'+ident);toggleElementVisible('showAnswersButton'+ident);toggleElementVisible('submit'+ident);}
function toggleClozeAnswers(ident,clear){var allCorrect=true;var inputs=getCloseInputs(ident)
if(!clear){for(var i=0;i<inputs.length;i++){var input=inputs[i];if(getClozeMark(input)!=2){allCorrect=false;break;}}}
if(allCorrect){clearClozeInputs(ident,inputs);}else{fillClozeInputs(ident,inputs);}
var scorePara=document.getElementById('clozeScore'+ident);scorePara.innerHTML="";var getScoreButton=document.getElementById('getScore'+ident);if(getScoreButton){getScoreButton.disabled=!allCorrect;}}
function fillClozeInputs(ident,inputs){if(!inputs){var inputs=getCloseInputs(ident)}
for(var i=0;i<inputs.length;i++){var input=inputs[i];input.value=getClozeAnswer(input);markClozeWord(input,CORRECT);input.setAttribute('readonly','readonly');}}
function clearClozeInputs(ident,inputs){if(!inputs){var inputs=getCloseInputs(ident)}
for(var i=0;i<inputs.length;i++){var input=inputs[i];input.value="";markClozeWord(input,NOT_ATTEMPTED);input.removeAttribute('readonly');}}
function checkAndMarkClozeWord(ele){var result=checkClozeWord(ele);if(result!=''){markClozeWord(ele,CORRECT);ele.value=result;return CORRECT;}else if(!ele.value){markClozeWord(ele,NOT_ATTEMPTED);return NOT_ATTEMPTED;}else{markClozeWord(ele,WRONG);return WRONG;}}
function markClozeWord(ele,mark){switch(mark){case 0:ele.style.backgroundColor="";break;case 1:ele.style.backgroundColor="#FF9999";break;case 2:ele.style.backgroundColor="#CCFF99";break;}
return mark}
function getClozeMark(ele){var result=checkClozeWord(ele);if(result!=''){return CORRECT;}else if(!ele.value){return NOT_ATTEMPTED;}else{return WRONG;}}
function getClozeAnswer(ele){var idents=getClozeIds(ele)
var ident=idents[0]
var inputId=idents[1]
var answerSpan=document.getElementById('clozeAnswer'+ident+'.'+inputId);var code=answerSpan.innerHTML;code=decode64(code)
code=unescape(code)
result='';var key='X'.charCodeAt(0);for(var i=0;i<code.length;i++){var letter=code.charCodeAt(i);key^=letter
result+=String.fromCharCode(key);}
return result}
function decode64(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2);}
if(enc4!=64){output=output+String.fromCharCode(chr3);}}while(i<input.length);return output;}
function checkClozeWord(ele){var guess=ele.value;var original=getClozeAnswer(ele);var answer=original;var guess=ele.value
var ident=getClozeIds(ele)[0]
var strictMarking=eval(document.getElementById('clozeFlag'+ident+'.strictMarking').value);var checkCaps=eval(document.getElementById('clozeFlag'+ident+'.checkCaps').value);if(!checkCaps){guess=guess.toLowerCase();answer=original.toLowerCase();}
if(guess==answer)
return original
else if(strictMarking||answer.length<=4)
return"";else{var i=0;var j=0;var orders=[[answer,guess],[guess,answer]];var maxMisses=Math.floor(answer.length/6)+1;var misses=0;if(guess.length<=maxMisses){misses=Math.abs(guess.length-answer.length);for(i=0;i<guess.length;i++){if(answer.search(guess[i])==-1){misses+=1;}}
if(misses<=maxMisses){return answer;}else{return"";}}
for(i=0;i<2;i++){var string1=orders[i][0];var string2=orders[i][1];while(string1){misses=Math.floor((Math.abs(string1.length-string2.length)+
Math.abs(guess.length-answer.length))/2)
var max=Math.min(string1.length,string2.length)
for(j=0;j<max;j++){var a=string2.charAt(j);var b=string1.charAt(j);if(a!=b)
misses+=1;if(misses>maxMisses)
break;}
if(misses<=maxMisses)
return answer;string1=string1.substr(1);}}
return"";}}
function getClozeIds(ele){var id=ele.id.slice(10);var dotindex=id.indexOf('.')
var ident=id.slice(0,dotindex)
var inputId=id.slice(id.indexOf('.')+1)
return[ident,inputId]}
function showClozeScore(ident,mark){var score=0
var div=document.getElementById('cloze'+ident)
var inputs=getCloseInputs(ident)
for(var i=0;i<inputs.length;i++){var input=inputs[i];if(mark){var result=checkAndMarkClozeWord(input);}else{var result=getClozeMark(input);}
if(result==2){score++;}}
var scorePara=document.getElementById('clozeScore'+ident);scorePara.innerHTML=YOUR_SCORE_IS+score+"/"+inputs.length+".";}
function getCloseInputs(ident){var result=new Array;var clozeDiv=document.getElementById('cloze'+ident)
recurseFindClozeInputs(clozeDiv,ident,result)
return result}
function recurseFindClozeInputs(dad,ident,result){for(var i=0;i<dad.childNodes.length;i++){var ele=dad.childNodes[i];if(ele.id){if(ele.id.search('clozeBlank'+ident)==0){result.push(ele);continue;}}
if(ele.hasChildNodes()){recurseFindClozeInputs(ele,ident,result);}}}
function toggleClozeFeedback(ident){var feedbackIdEle=document.getElementById('clozeVar'+ident+'.feedbackId');if(feedbackIdEle){var feedbackId=feedbackIdEle.value;toggleElementVisible(feedbackId);}}
function toggleElementVisible(ident){var element=document.getElementById(ident);if(element){var c=element.className;if(c.indexOf("iDevice_hidden_content")!=-1){element.style.display="none";element.className=c.replace("iDevice_hidden_content","iDevice_content");}
if(element.style.display!="none"){element.style.display="none";}else{element.style.display="";}}}
function showAnswer(id,isShow){if(isShow==1){document.getElementById("s"+id).style.display="block";document.getElementById("hide"+id).style.display="block";document.getElementById("view"+id).style.display="none";}else{document.getElementById("s"+id).style.display="none";document.getElementById("hide"+id).style.display="none";document.getElementById("view"+id).style.display="block";}}
function toggleFeedback(id){var ele=document.getElementById('fb'+id);if(ele.style.display=="block"){ele.style.display="none";}else{ele.style.display="block";}}
function insertAtCursor(myField,myValue,num){if(myField.selectionStart||myField.selectionStart=='0'){var startPos=myField.selectionStart;var endPos=myField.selectionEnd;myField.value=myField.value.substring(0,startPos)
+myValue
+myField.value.substring(endPos,myField.value.length);myField.selectionStart=startPos+myValue.length-num}else{myField.value+=myValue;}
myField.selectionEnd=myField.selectionStart
myField.focus();}
function insertSymbol(id,string,num){var ele=document.getElementById(id);insertAtCursor(ele,string,num)}
function calcScore(num,ident){var score=0,i,chk;for(i=0;i<num;i++){var chkele=document.getElementById(ident+i.toString());var ansele=document.getElementById("ans"+ident+i.toString())
chk="False"
if(chkele.checked==1)
chk="True"
if(chk==chkele.value){score++
ansele.style.color="black"}else{ansele.style.color="red"}}
var fele=document.getElementById("f"+ident)
fele.style.display="block"
alert(YOUR_SCORE_IS+score+"/"+num)}
function showFeedback(num,ident){var i,chk;for(i=0;i<num;i++){var ele=document.getElementById("op"+ident+i.toString())
var ele0=document.getElementById("op"+ident+i.toString()+"_0")
var ele1=document.getElementById("op"+ident+i.toString()+"_1")
var ansele=document.getElementById("ans"+ident+i.toString())
chk="False"
if(ele.checked==1)
chk="True"
if(chk==ele.value){ele1.style.display="block"
ele0.style.display="none"}else{ele0.style.display="block"
ele1.style.display="none"}}
var fele=document.getElementById("f"+ident)
fele.style.display="block"}
function detectQuickTime(){pluginFound=detectPlugin('QuickTime');return pluginFound;}
function detectReal(){pluginFound=detectPlugin('RealPlayer');return pluginFound;}
function detectFlash(){pluginFound=detectPlugin('Shockwave','Flash');return pluginFound;}
function detectDirector(){pluginFound=detectPlugin('Shockwave','Director');return pluginFound;}
function detectWindowsMedia(){pluginFound=detectPlugin('Windows Media');return pluginFound;}
function detectPlugin(){var daPlugins=detectPlugin.arguments;var pluginFound=false;if(navigator.plugins&&navigator.plugins.length>0){var pluginsArrayLength=navigator.plugins.length;for(var pluginsArrayCounter=0;pluginsArrayCounter<pluginsArrayLength;pluginsArrayCounter++){var numFound=0;for(var namesCounter=0;namesCounter<daPlugins.length;namesCounter++){if((navigator.plugins[pluginsArrayCounter].name.indexOf(daPlugins[namesCounter])>=0)||(navigator.plugins[pluginsArrayCounter].description.indexOf(daPlugins[namesCounter])>=0)){numFound++;}}
if(numFound==daPlugins.length){pluginFound=true;break;}}}
return pluginFound;}
NOT_ATTEMPTED=0
WRONG=1
CORRECT=2
function onClozelangChange(ele){var ident=getClozelangIds(ele)[0];var instant=eval(document.getElementById('clozelangFlag'+ident+'.instantMarking').value);if(instant){checkAndMarkClozelangWord(ele);var scorePara=document.getElementById('clozelangScore'+ident);scorePara.innerHTML="";}}
function clozelangSubmit(ident){showClozelangScore(ident,1);toggleElementVisible('submit'+ident);toggleClozelangFeedback(ident);}
function clozelangRestart(ident){toggleClozelangFeedback(ident);toggleClozelangAnswers(ident,true);toggleElementVisible('restart'+ident);toggleElementVisible('showAnswersButton'+ident);toggleElementVisible('submit'+ident);}
function toggleClozelangAnswers(ident,clear){var allCorrect=true;var inputs=getCloseInputsCloze(ident)
if(!clear){for(var i=0;i<inputs.length;i++){var input=inputs[i];if(getClozelangMark(input)!=2){allCorrect=false;break;}}}
if(allCorrect){clearClozelangInputs(ident,inputs);}else{fillClozelangInputs(ident,inputs);}
var scorePara=document.getElementById('clozelangScore'+ident);scorePara.innerHTML="";var getScoreButton=document.getElementById('getScore'+ident);if(getScoreButton){getScoreButton.disabled=!allCorrect;}}
function fillClozelangInputs(ident,inputs){if(!inputs){var inputs=getCloseInputsCloze(ident)}
for(var i=0;i<inputs.length;i++){var input=inputs[i];input.value=getClozelangAnswer(input);markClozeWord(input,CORRECT);input.setAttribute('readonly','readonly');}}
function clearClozelangInputs(ident,inputs){if(!inputs){var inputs=getCloseInputsCloze(ident)}
for(var i=0;i<inputs.length;i++){var input=inputs[i];input.value="";markClozeWord(input,NOT_ATTEMPTED);input.removeAttribute('readonly');}}
function checkAndMarkClozelangWord(ele){var result=checkClozelangWord(ele);if(result!=''){markClozelangWord(ele,CORRECT);ele.value=result;return CORRECT;}else if(!ele.value){markClozelangWord(ele,NOT_ATTEMPTED);return NOT_ATTEMPTED;}else{markClozelangWord(ele,WRONG);return WRONG;}}
function markClozelangWord(ele,mark){switch(mark){case 0:ele.style.backgroundColor="";break;case 1:ele.style.backgroundColor="#FF9999";break;case 2:ele.style.backgroundColor="#CCFF99";break;}
return mark}
function getClozelangMark(ele){switch(ele.style.backgroundColor){case'#FF9999':return 1;case'#CCFF99':return 2;default:return 0;}}
function getClozelangAnswer(ele){var idents=getClozelangIds(ele)
var ident=idents[0]
var inputId=idents[1]
var answerSpan=document.getElementById('clozelangAnswer'+ident+'.'+inputId);var code=answerSpan.innerHTML;code=decode64(code)
code=unescape(code)
result='';var key='X'.charCodeAt(0);for(var i=0;i<code.length;i++){var letter=code.charCodeAt(i);key^=letter
result+=String.fromCharCode(key);}
return result}
function checkClozelangWord(ele){var guess=ele.value;var original=getClozelangAnswer(ele);var answer=original;var guess=ele.value
var ident=getClozelangIds(ele)[0]
var strictMarking=eval(document.getElementById('clozelangFlag'+ident+'.strictMarking').value);var checkCaps=eval(document.getElementById('clozelangFlag'+ident+'.checkCaps').value);if(!checkCaps){guess=guess.toLowerCase();answer=original.toLowerCase();}
if(guess==answer)
return original
else if(strictMarking||answer.length<=4)
return"";else{var i=0;var j=0;var orders=[[answer,guess],[guess,answer]];var maxMisses=Math.floor(answer.length/6)+1;var misses=0;if(guess.length<=maxMisses){misses=Math.abs(guess.length-answer.length);for(i=0;i<guess.length;i++){if(answer.search(guess[i])==-1){misses+=1;}}
if(misses<=maxMisses){return answer;}else{return"";}}
for(i=0;i<2;i++){var string1=orders[i][0];var string2=orders[i][1];while(string1){misses=Math.floor((Math.abs(string1.length-string2.length)+
Math.abs(guess.length-answer.length))/2)
var max=Math.min(string1.length,string2.length)
for(j=0;j<max;j++){var a=string2.charAt(j);var b=string1.charAt(j);if(a!=b)
misses+=1;if(misses>maxMisses)
break;}
if(misses<=maxMisses)
return answer;string1=string1.substr(1);}}
return"";}}
function getClozelangIds(ele){var id=ele.id.slice(14);var dotindex=id.indexOf('.')
var ident=id.slice(0,dotindex)
var inputId=id.slice(id.indexOf('.')+1)
return[ident,inputId]}
function showClozelangScore(ident,mark){var showScore=eval(document.getElementById('clozelangFlag'+ident+'.showScore').value);if(showScore){var score=0
var div=document.getElementById('clozelang'+ident)
var inputs=getCloseInputsCloze(ident)
for(var i=0;i<inputs.length;i++){var input=inputs[i];if(mark){var result=checkAndMarkClozelangWord(input);}else{var result=getClozelangMark(input);}
if(result==2){score++;}}
var scorePara=document.getElementById('clozelangScore'+ident);scorePara.innerHTML=YOUR_SCORE_IS+score+"/"+inputs.length+".";}}
function getCloseInputsCloze(ident){var result=new Array;var clozeDiv=document.getElementById('clozelang'+ident)
recurseFindClozelangInputs(clozeDiv,ident,result)
return result}
function recurseFindClozelangInputs(dad,ident,result){for(var i=0;i<dad.childNodes.length;i++){var ele=dad.childNodes[i];if(ele.id){if(ele.id.search('clozelangBlank'+ident)==0){result.push(ele);continue;}}
if(ele.hasChildNodes()){recurseFindClozelangInputs(ele,ident,result);}}}
function toggleClozelangFeedback(ident){var feedbackIdEle=document.getElementById('clozelangVar'+ident+'.feedbackId');if(feedbackIdEle){var feedbackId=feedbackIdEle.value;toggleElementVisible(feedbackId);}}
sfHover=function(){var nav=document.getElementById("siteNav");if(nav){var sfEls=nav.getElementsByTagName("LI");for(var i=0;i<sfEls.length;i++){sfEls[i].onmouseover=function(){this.className="sfhover";}
sfEls[i].onmouseout=function(){this.className="sfout";}}
var mcEls=nav.getElementsByTagName("A");for(var i=0;i<mcEls.length;i++){mcEls[i].onfocus=function(){this.className+=(this.className.length>0?" ":"")+"sffocus";this.parentNode.className+=(this.parentNode.className.length>0?" ":"")+"sfhover";if(this.parentNode.parentNode.parentNode.nodeName=="LI"){this.parentNode.parentNode.parentNode.className+=(this.parentNode.parentNode.parentNode.className.length>0?" ":"")+"sfhover";if(this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName=="LI"){this.parentNode.parentNode.parentNode.parentNode.parentNode.className+=(this.parentNode.parentNode.parentNode.parentNode.parentNode.className.length>0?" ":"")+"sfhover";}}}
mcEls[i].onblur=function(){this.className=this.className.replace(new RegExp("( ?|^)sffocus\\b"),"");this.parentNode.className=this.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"),"");if(this.parentNode.parentNode.parentNode.nodeName=="LI"){this.parentNode.parentNode.parentNode.className=this.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"),"");if(this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName=="LI"){this.parentNode.parentNode.parentNode.parentNode.parentNode.className=this.parentNode.parentNode.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"),"");}}}}}}
if(document.addEventListener){window.addEventListener('load',sfHover,false);}else{window.attachEvent('onload',sfHover);}
var ie_media_replace=function(){var objs=document.getElementsByTagName("OBJECT");var i=objs.length;while(i--){if(objs[i].type=="video/quicktime"||objs[i].type=="audio/x-pn-realaudio-plugin"){if(typeof(objs.classid)=='undefined'){objs[i].style.display="none";var clsid="02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";if(objs[i].type=="audio/x-pn-realaudio-plugin")clsid="CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA";var h=objs[i].height;var w=objs[i].width;var s=objs[i].data;var e=document.createElement("DIV");e.innerHTML='<object classid="clsid:'+clsid+'" data="'+s+'" width="'+w+'" height="'+h+'"><param name="controller" value="true" /><param name="src" value="'+s+'" /><param name="autoplay" value="false" /></object>';objs[i].parentNode.insertBefore(e,objs[i]);}}}}
if(navigator.appName=="Microsoft Internet Explorer"){if(document.addEventListener){window.addEventListener('load',ie_media_replace,false);}else{window.attachEvent('onload',ie_media_replace);}}
var dO=new Object();dO.snapthresh=20;dO.snapto=false;dO.currID=null;dO.z=0;dO.xo=0;dO.yo=0;dO.ns4=(document.layers)?true:false;dO.ns6=(document.getElementById&&!document.all)?true:false;dO.ie4=(document.all&&!document.getElementById)?true:false;dO.ie5=(document.all&&document.getElementById)?true:false;dO.w3c=(document.getElementById)?true:false;function invsnap(){dO.snapto=!dO.snapto;}
function findnestedlayer(name,doc){var i,layer;for(i=0;i<doc.layers.length;i++){layer=doc.layers[i];if(layer.name==name)return layer;if(layer.document.layers.length>0)
if((layer=findlayer(name,layer.document))!=null)
return layer;}
return null;}
function trckM(e){if(dO.currID!=null){var x=(dO.ie4||dO.ie5)?event.clientX+document.body.scrollLeft:e.pageX;var y=(dO.ie4||dO.ie5)?event.clientY+document.body.scrollTop:e.pageY;if(dO.snapto){x=Math.ceil(x/dO.snapthresh)*dO.snapthresh;y=Math.ceil(y/dO.snapthresh)*dO.snapthresh;}
if(dO.ns4)dO.currID.moveTo(x-dO.xo,y-dO.yo);else{dO.currID.style.top=y-dO.yo+'px';dO.currID.style.left=x-dO.xo+'px';}}
return false;}
function drgI(e){if(dO.currID==null){var tx=(dO.ns4)?this.left:parseInt(this.style.left);var ty=(dO.ns4)?this.top:parseInt(this.style.top);dO.currID=this;if(dO.ns4)this.zIndex=document.images.length+(dO.z++);else this.style.zIndex=document.images.length+(dO.z++);dO.xo=((dO.ie4||dO.ie5)?event.clientX+document.body.scrollLeft:e.pageX)-tx;dO.yo=((dO.ie4||dO.ie5)?event.clientY+document.body.scrollTop:e.pageY)-ty;if(dO.snapto){dO.xo=Math.ceil(dO.xo/dO.snapthresh)*dO.snapthresh;dO.yo=Math.ceil(dO.yo/dO.snapthresh)*dO.snapthresh;}
return false;}}
function dragElement(id){this.idRef=(dO.ns4)?findnestedlayer(id,document):(dO.ie4)?document.all[id]:document.getElementById(id);if(dO.ns4)this.idRef.captureEvents(Event.MOUSEDOWN|Event.MOUSEUP);this.idRef.onmousedown=drgI;this.idRef.onmouseup=function(){dO.currID=null}}
if(dO.ns4)document.captureEvents(Event.MOUSEMOVE);document.onmousemove=trckM;window.onresize=function(){if(dO.ns4)setTimeout('history.go(0)',300);}
var $exe={init:function(){var d=document.body.className;d+=' js';if(d!='exe-single-page js'){var ie_v=$exe.isIE();if(ie_v){if(ie_v>7)$exe.iDeviceToggler.init();}else $exe.iDeviceToggler.init();}
var h=document.body.innerHTML;if(h.indexOf(' class="mediaelement"')!=-1||h.indexOf(" class='mediaelement")!=-1){$exe.loadMediaPlayer.getPlayer()}},isIE:function(){var n=navigator.userAgent.toLowerCase();return(n.indexOf('msie')!=-1)?parseInt(n.split('msie')[1]):false;},iDeviceToggler:{init:function(){var em=$(".iDevice_header,.iDevice.emphasis0");em.each(function(){var t=$exe_i18n.hide;e=$(this),c=e.hasClass('iDevice_header')?'em1':'em0',eP=e.parents('.iDevice_wrapper');if(eP.length){var l='<p class="toggle-idevice toggle-'+c+'"><a href="#" onclick="$exe.iDeviceToggler.toggle(this,\''+eP.attr('id')+'\',\''+c+'\')" title="'+t+'"><span>'+t+'</span></a></p>';if(c=='em1'){var h=e.html();e.html(h+l);}
else
e.before(l);}});},toggle:function(e,id,em){var t=$exe_i18n.hide;var i=$("#"+id);var sel=".iDevice_content";if(em=="em1")sel=".iDevice_inner";var iC=$(sel,i);var c=i.attr("class");if(typeof(c)=='undefined')return false;if(c.indexOf(" hidden-idevice")==-1){t=$exe_i18n.show;c+=" hidden-idevice";iC.slideUp("fast");e.className="show-idevice";e.title=t;e.innerHTML="<span>"+t+"</span>";}else{c=c.replace(" hidden-idevice","");iC.slideDown("fast");e.className="hide-idevice";e.title=t;e.innerHTML="<span>"+t+"</span>";}
i.attr("class",c);}},loadMediaPlayer:{getPlayer:function(){$("VIDEO").hide();$exe.loadScript("exe_media.js","$exe.loadMediaPlayer.getCSS()");},getCSS:function(){$exe.loadScript("exe_media.css","$exe.loadMediaPlayer.init()");},init:function(){$('.mediaelement').mediaelementplayer();}},loadScript:function(url,callback){var s;if(url.split('.').pop()=="css"){s=document.createElement("link");s.type="text/css";s.rel="stylesheet";s.href=url;}else{s=document.createElement("script");s.type="text/javascript";s.src=url;}
if(s.readyState){s.onreadystatechange=function(){if(s.readyState=="loaded"||s.readyState=="complete"){s.onreadystatechange=null;if(callback)eval(callback);}};}else{s.onload=function(){if(callback)eval(callback);};}
document.getElementsByTagName("head")[0].appendChild(s);}}
$(function(){$exe.init();});