var dO=new Object();
dO.snapthresh=20;    // THIS VALUE IS THE SNAPTO INCREMENT.
dO.snapto=false;       // SET TO true TO ENABLE SNAPTO, false TO DISABLE IT.

dO.currID=null;
dO.z=0;
dO.xo=0;
dO.yo=0;
dO.ns4=(document.layers)?true:false;
dO.ns6=(document.getElementById&&!document.all)?true:false;
dO.ie4=(document.all&&!document.getElementById)?true:false;
dO.ie5=(document.all&&document.getElementById)?true:false;
dO.w3c=(document.getElementById)?true:false;

function invsnap(){
dO.snapto=!dO.snapto;
}

//NEAT FUNCTION BY MIKE HALL (OF BRAINJAR.COM) THAT FINDS NESTED LAYERS FOR NS4.x
function findnestedlayer(name,doc){
var i,layer;
for(i=0;i<doc.layers.length;i++){
layer=doc.layers[i];
if(layer.name==name)return layer;
if(layer.document.layers.length>0)
if((layer=findlayer(name,layer.document))!=null)
return layer;
}
return null;
}

function trckM(e){
if(dO.currID!=null){
var x=(dO.ie4||dO.ie5)?event.clientX+document.body.scrollLeft:e.pageX;
var y=(dO.ie4||dO.ie5)?event.clientY+document.body.scrollTop:e.pageY;
if(dO.snapto){
x=Math.ceil(x/dO.snapthresh)*dO.snapthresh;
y=Math.ceil(y/dO.snapthresh)*dO.snapthresh;
}
if(dO.ns4)dO.currID.moveTo(x-dO.xo, y-dO.yo);
else{
dO.currID.style.top=y-dO.yo+'px';
dO.currID.style.left=x-dO.xo+'px'; 
}}
return false;
}

function drgI(e){
if(dO.currID==null){
var tx=(dO.ns4)? this.left : parseInt(this.style.left);
var ty=(dO.ns4)? this.top : parseInt(this.style.top);
dO.currID=this;
if(dO.ns4)this.zIndex=document.images.length+(dO.z++);
else this.style.zIndex=document.images.length+(dO.z++);
dO.xo=((dO.ie4||dO.ie5)?event.clientX+document.body.scrollLeft:e.pageX)-tx;
dO.yo=((dO.ie4||dO.ie5)?event.clientY+document.body.scrollTop:e.pageY)-ty;
if(dO.snapto){
dO.xo=Math.ceil(dO.xo/dO.snapthresh)*dO.snapthresh;
dO.yo=Math.ceil(dO.yo/dO.snapthresh)*dO.snapthresh;
}
return false;
}}

function dragElement(id){
this.idRef=(dO.ns4)? findnestedlayer(id,document) : (dO.ie4)? document.all[id] : document.getElementById(id);
if(dO.ns4)this.idRef.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP);
this.idRef.onmousedown=drgI;
this.idRef.onmouseup=function(){dO.currID=null}
}

if(dO.ns4)document.captureEvents(Event.MOUSEMOVE);
document.onmousemove=trckM;


window.onresize=function(){
if(dO.ns4)setTimeout('history.go(0)',300);
}