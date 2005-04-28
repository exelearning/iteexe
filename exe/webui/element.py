# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================
"""
Classes to XHTML elements.  Used by GenericBlock
"""
import logging
from exe.webui                  import common
from os                         import mkdir
from os.path                    import exists, splitext, basename, join, sep
from  shutil                    import copyfile

log = logging.getLogger(__name__)

# ===========================================================================

def createElement(elementType, name, class_, blockId, instruc):
    """
    Factory method for creating Elements
    """
    # This dict will convert an element type name to an actual element class
    elementTypeMap = {'Text':     TextElement,
                      'TextArea': TextAreaElement,
                      'Photo':    ImageElement,
                      'Audio':    AudioElement}
    # Get the appropriate class
    cls = elementTypeMap.get(elementType)
    if cls:
        # Create an instance of the appropriate element class
        return cls(name, class_, blockId, instruc)
    else:
        return None

def getUploadedFileDir():
    """Returns the directory where files will be uploaded to"""
    # TODO!!!
    return "TODO"
    
    
# ===========================================================================
class Element(object):
    """
    Base class for a XHTML element.  Used by GenericBlock
    """
    def __init__(self, name, class_, blockId, instruc):
        """
        Initialize
        """
        self.name     = name
        self.class_   = class_
        self.blockId  = blockId
        self.id       = class_+blockId
        self.instruc  = instruc

    def process(self, request):
        """
        Process arguments from the webserver.  Return any which apply to this 
        element.
        """
        if self.id in request.args:
            return request.args[self.id][0]
        else:
            return None


    def renderView(self, content):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        html  = "<p class=\""+ self.class_ + "\">\n"
        html += content
        html += "</p>\n"
        return html


    def renderEdit(self, content):
        """
        Returns an XHTML string for editing this element
        """
        log.error("renderEdit called directly")
        return "ERROR: Element.renderEdit called directly"


# ===========================================================================
class TextElement(Element):
    """ 
    TextElement is a single line of text
    """
    def renderEdit(self, content):
        """
        Returns an XHTML string with the form element for editing this field
        """
        html  = "<b>"+self.name
        html += common.elementInstruc(self.name+self.id, self.instruc)
        html += ":</b><br/>\n"
        html += common.textInput(self.id, content)
        html += "<br/>\n"
        return html
    

# ===========================================================================
class TextAreaElement(Element):
    """
    TextAreaElement is responsible for a block of text
    """
    def renderEdit(self, content, width="100%", height=100):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit content="+content+", height="+str(height))
        content = content.replace("\r", "")
        content = content.replace("\n","\\n")
        content = content.replace("'","\\'")

        html  = "<b>"+self.name
        html += common.elementInstruc(self.name+self.id, self.instruc)
        html += ":</b><br/>\n"
        html += common.richTextArea(self.id, content, width, height)
        
        return html


# ===========================================================================
class ImageElement(Element):
    """
    for image element processing
    """
    def __init__(self, name, class_, blockId, 
                 instruc, titleMessage="Image",
                 width="200px", height="150px", border="0"):
        """ Initialize """
        Element.__init__(self, name, class_, blockId , instruc)
        self.titleMessage = titleMessage
        self.width = width
        self.height = height
        self.border = border
        
        
    def process(self, request):
        """
        process audio field information from http request
        """
        
        fileExtension = ""
        filename = ""

        # get the package name,store uploaded file into that package
        # subdirectory
        # TODO: Wen or David must fix this or explain it to me (MS)
        packageName = request.prepath[0]
        if packageName == "":
            errmsg = "package not specified while processing audio element"
            log.debug(errmsg)
            return errmsg
            
        if self.id in request.args:            
            
            #if file is choosen#
            if ((self.id + "_filename") in request.args and 
                request.args[ self.id + "_filename"][0].strip() != ""): 
                
                ##get the audio file extension
                fileExtension = splitext(basename(request.args[ self.id + \
                "_filename" ][0]))[1].lower()
                
                ##assign path + id + fileExtension (.xxx) to filename
                filename =   packageName  + sep + self.id +  fileExtension 
                
                ##use this image data directory to store file, a mock up way
                imgDir = getUploadedFileDir()
                
                ##check if the image directory for this package exist or not
                if not exists(join (imgDir, packageName)):
                    try:
                        mkdir(join(imgDir, packageName) )
                    except OSError:
                        errmsg = "Error while creating audio directory: %s" \
                                          % (join (imgDir, packageName))
                        log.debug(errmsg)
                        return errmsg
                        
                ##copy file to ImageDataDir
                try:    
                    copyfile(request.args[ self.id + "_filename" ][0], \
                                join(imgDir,  filename))
                except OSError:
                    return "%s image file not copied" % filename
            
            ##if file not chosen, then see if there is old file
            elif ("old_%s"%self.id in request.args and 
                    request.args[ "old_%s" % self.id ][0] != ""):
                filename = request.args[ "old_"+self.id][0]
                
            return filename
        else:
            return None                
        
        
    def renderEdit(self, filename):
        """
        Returns an XHTML string with the form element for editing this field
        """
        imgDir = getUploadedFileDir()
        
        html = ""        
        ## if file exists=>update, else, add
        if filename.strip() != "" and exists(join(imgDir, filename)):
            ##update, show previous file 
            html += """<strong>Previous %s</strong>:<br /><img src="images/%s" \
            class="%s" width="%s" height="%s" border="%s" /><br />\n""" \
            %(self.titleMessage, filename, self.class_, self.width, \
              self.height, self.border)
              
            html += """<strong>Change to</strong>:<input type="file" name="%s"\
                 onchange="document.contentForm.%s_filename.value=this.value"/>\
                    <br />\n"""  % (self.id, self.id)
                    
            html += """<input type="hidden" name="old_%s" value="%s" />""" \
                        % (self.id, filename)
        else:     
            ##add
            html += """<strong>%s</strong>:<input type="file" name="%s"  \
            onchange="document.contentForm.%s_filename.value=this.value"/> \
            <br />\n""" % (self.titleMessage, self.id, self.id)
        
        html += """<input type="hidden" name="%s_filename">""" % self.id
        return html
        
    def renderView(self, filename):
        """
        return the xhtml component of this image element
        """
        
        if filename.strip() != "":
            return """<img src="images/%s" class="%s" width="%s" height="%s"\
            border="%s" align="left" style="margin-right: 5px;" />\n"""\
            % (filename.replace("\\", "/") , 
               self.class_, 
               self.width, 
               self.height, 
               self.border)
        else:
            return ""
        
# ===========================================================================
class AudioElement(Element):
    """
    for audio element processing
    """
    
    def __init__(self, name, class_, blockId, 
                 instruc, titleMessage="Audio File"):
        """initial function for audio element
        """
        Element.__init__(self, name, class_, blockId, instruc)
        self.titleMessage = titleMessage
        
    def process(self, request):
        """
        process audio field information from http request
        """
        
        fileExtension = ""
        filename = ""
        # get the package name,store uploaded file into that package
        # subdirectory
        # TODO: Wen or David must fix this or explain it to me (MS)
        packageName = request.prepath[0]
        if packageName == "":
            errmsg = "package not specified while processing audio element"
            log.debug(errmsg)
            return errmsg
            
        if self.id in request.args:            
            
            #if file is choosen#
            if (self.id + "_filename") in request.args and \
                request.args[ self.id + "_filename"][0].strip() != "": 
                
                ##get the audio file extension
                fileExtension = splitext(basename(request.args[ self.id + \
                "_filename" ][0]))[1].lower()
                
                ##assign path + id + fileExtension (.xxx) to filename
                filename =   packageName  + sep + self.id +  fileExtension 
                
                ##use this image data directory to store file, a mock up way
                imgDir = getUploadedFileDir()
                
                ##check if the image directory for this package exist or not
                if not exists(join (imgDir, packageName)):
                    try:
                        mkdir(join(imgDir, packageName) )
                    except OSError:
                        errmsg = "Error while creating audio directory: %s" \
                                          % (join (imgDir, packageName))
                        log.debug(errmsg)
                        return errmsg
                        
                ##copy file to ImageDataDir
                try:    
                    copyfile(request.args[ self.id + "_filename" ][0], \
                                join(imgDir,  filename))
                except OSError:
                    return "%s image file not copied" % filename
                ##resize image file
                #im = Image.open(filename)
            
            ##if file not chosen, then see if there is old file
            elif "old_%s"%self.id in request.args and \
                    request.args[ "old_%s" % self.id ][0] != "":
                filename = request.args[ "old_"+self.id][0]
                
            return filename
        else:
            return None                
            
    def renderEdit(self, filename):
        """Renders ourselves with edit controls"""
 
        ## if file exists=>update, else, add
        imgDir = getUploadedFileDir()
        html = ""
        if filename.strip()!="" and exists(join(imgDir, filename)):
            ##update, show previous file 
            html += """<strong>Previous %s</strong>: %s<br />\n""" \
                    %(self.titleMessage, self.renderView(filename))
            html += """<strong>Change to</strong>:<input type="file" name="%s"\
                  onchange="document.contentForm.%s_filename.value=this.value"/> \
                    <br />\n""" % (self.id, self.id)
            html += """<input type=hidden name="old_%s" value="%s" />"""\
                         %(self.id, filename)
        else:     
            ##add
            html += """<strong>%s</strong>:<input type="file" name="%s" \
             onchange="document.contentForm.%s_filename.value=this.value"/>\
              <br />\n""" % (self.titleMessage, self.id, self.id)
        html += """<input type="hidden" name="%s_filename">""" % self.id
        
        return html
                
    def renderView(self, filename):
        if filename.strip() != "":
            tmp_array = {}
            tmp_array["id"] = self.id
            tmp_array["hostUrl"] = "images"
            tmp_array["audiofile"] = filename.replace("\\", "/")
            filterStr = self.mmfilter(filename)
            html = filterStr % (tmp_array)
        else:
            html = ""
        return html
        
    def mmfilter(self, filename):
        """
        generate html code bits according to the uploaded file type
        """
        
        fileExtension = splitext(filename)[ 1 ].lower()
        
        mp3String = """
<object class="mediaplugin mp3" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
 codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"
 id="mp3player" height="15" width="90"> 
<param name="movie" value="%(hostUrl)s/mp3player.swf?src=%(hostUrl)s/%(audiofile)s"> 
<param name="quality" value="high"> 
<param name="bgcolor" value="#333333"> 
<param name="flashvars" value="bgColour=000000&amp;btnColour=ffffff&amp;
btnBorderColour=cccccc&amp;iconColour=000000&amp;iconOverColour=00cc00&amp;
trackColour=cccccc&amp;handleColour=ffffff&amp;loaderColour=ffffff&amp;">
<embed src="%(hostUrl)s/mp3player.swf?src=%(hostUrl)s/%(audiofile)s" quality="high"
 bgcolor="#333333" name="mp3player" type="application/x-shockwave-flash"
  flashvars="bgColour=000000&amp;btnColour=ffffff&amp;btnBorderColour=cccccc&amp;
 iconColour=000000&amp;iconOverColour=00cc00&amp;trackColour=cccccc&amp;
 handleColour=ffffff&amp;loaderColour=ffffff&amp;"
  pluginspage="http://www.macromedia.com/go/getflashplayer" height="15" width="90">
</object>&nbsp;&nbsp;
                
<object id="mp3player" 
codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"
 classid="D27CDB6E-AE6D-11cf-96B8-444553540000" height="15" width="90">
<!--param value="741" name="_cx">
<param value="381" name="_cy"-->
<param value="741" name="FlashVars">
<param value="%(hostUrl)s/mp3player.swf?src=%(hostUrl)s/%(audiofile)s" name="Movie">
<param value="%(hostUrl)s/mp3player.swf?src=%(hostUrl)s/%(audiofile)s" name="Src">
<param value="Window" name="WMode">
<param value="0" name="Play">
<param value="-1" name="Loop">
<param value="High" name="Quality">
<param name="SAlign">
<param value="-1" name="Menu">
<param name="Base">
<param value="always" name="AllowScriptAccess">
<param value="ShowAll" name="Scale">
<param value="0" name="DeviceFont">
<param value="0" name="EmbedMovie">
<param value="333333" name="BGColor">
<param name="SWRemote">
</object>"""

        wavString = """
        <input type="button" value="Hear it" 
 OnClick="document.getElementById('dummy_%(id)s').innerHTML='<embed src=images/%(audiofile)s hidden=true loop=false>';"
        <div id="dummy_%(id)s"></div>
        """
        
        wmvString = """
         <p class="mediaplugin">
           <object id="MediaPlayer1"
 classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95"
 standby="Loading Microsoft Windows Media Player components...">
<param name="Filename" value="images/%(audiofile)s">
<param name="AnimationAtStart" value="true">
<param name="TransparentAtStart" value="false">
<param name="ShowControls" value="true">
<param name="PlayCount" value="true">
<embed width="320" height="285" src="images/%(audiofile)s" controller=true autoplay=false  playeveryframe=false pluginspage="plugin.html">
</object></p>
        """
        
        movString = """
        <p class="mediaplugin"><object classid="CLSID:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B"
                codebase="http://www.apple.com/qtactivex/qtplugin.cab" 
                height="300" width="400"
                id="quicktime" align="" type="application/x-oleobject">
        <param name="src" value="images/%(audiofile)s" />
        <param name="autoplay" value=false />
        <param name="loop" value=true />
        <param name="controller" value=true />
        <param name="scale" value="aspect" />
        <embed src="images/%(audiofile)s" name="quicktime" type="video/quicktime" 
         height="300" width="400" scale="aspect" 
         autoplay="false" controller="true" loop="true" 
         pluginspage="http://quicktime.apple.com/">
        </embed>
        </object></p>
        """
        
        mpgString = """
        <p class="mediaplugin"><object width="240" height="180">
        <param name="src" value="images/%(audiofile)s">
        <param name="controller" value="true">
        <param name="autoplay" value="false">
        <embed src="images/%(audiofile)s" width="240" height="180"
        controller="true" autoplay="false"> </embed>
        </object></p>
        """
        
        aviString = """
        <p class="mediaplugin"><object width="240" height="180">
        <param name="src" value="images/%(audiofile)s">
        <param name="controller" value="true">
        <param name="autoplay" value="false">
        <embed src="images/%(audiofile)s" width="240" height="180" 
        controller="true" autoplay="false"> </embed>
        </object></p>
        """
        
        swfString = """
        <p class="mediaplugin">
        <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
 codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" 
         width="20" height="15" id="mp3player" align="">
         <param name=movie value="images/%(audiofile)s">
         <param name=quality value=high>
         <embed src="images/%(audiofile)s" 
          quality=high width="20" height="15" name="flashfilter" 
         type="application/x-shockwave-flash" 
         pluginspage="http://www.macromedia.com/go/getflashplayer">
        </embed>
        </object></p>
        """
        if fileExtension == ".mp3":
            return mp3String
        elif fileExtension == ".wav":
            return wavString
        elif fileExtension == ".wmv" or fileExtension == ".wma":
            return wmvString
        elif fileExtension == ".mov":
            return movString
        elif fileExtension == ".mpg":
            return mpgString
        elif fileExtension == ".avi":
            return aviString 
        elif fileExtension == ".swf":
            return swfString 
        else:
            return ""

# ===========================================================================
