
"""
JR: The StyleManagerPage is responsible for managing styles
"""

import logging
import os
import sys
import shutil
import zipfile
from exe.engine.path           import toUnicode, Path
from exe.webui                 import common
from exe.webui.renderable      import RenderableResource
from exe.engine.style          import Style


log = logging.getLogger(__name__)


class StyleManagerPage(RenderableResource):
    """
    The StyleManagerPage is responsible for managing styles
    import / export / delete
    """

    name = 'stylemanager'

    def __init__(self, parent):
        """
        Initialize
        """
        RenderableResource.__init__(self, parent)
        self.url          = ""
        self.alertHTML    = ""
        self.action        = ""


    def process(self, request=None):
        """
        Process current package 
        """
        log.debug("process " + repr(request.args))
                   
        if ("action" in request.args and request.args["action"][0] == "importStyle"):
            stylename = request.args["filename"][0] 
            self.__importStyle(stylename)
        elif ("action" in request.args and request.args["action"][0] == "doExport"):
            styleValue = request.args["style"][0]
            filenameTarget = request.args["filename"][0]
            styleDir    = self.config.stylesDir
            style = Style(styleDir/styleValue)
            self.__exportStyle(style.get_style_dir(), filenameTarget)
        elif ("action" in request.args and request.args["action"][0] == "doDelete"):
            styleDelete = request.args["style"][0]
            styleDir    = self.config.stylesDir
            styleDelete = Style(styleDir/request.args["style"][0])
            self.__deleteStyle(styleDelete)
        elif ("action" in request.args and request.args["action"][0] == "doProperties"):
            self.action = 'doProperties'
        elif ("action" in request.args and request.args["action"][0] == "doCancel"):
            self.action = ""
            self.alertHTML = ""
        else:
            self.alertHTML = ''
        
        
    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
        if self.action == "": self.alertHTML = ""
        log.debug("render_GET")
        self.process(request)
        # Rendering
        html  = common.docType()
        html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
        html += "<head>\n"
        html += "<style type=\"text/css\">\n"
        html += "@import url(/css/exe.css);\n"
        html += '@import url(/style/base.css);\n'
        html += "@import url(/style/standardwhite/content.css);</style>\n"
        html += '<script type="text/javascript" src="/scripts/common.js">'
        html += '</script>\n'
        html += '<script type="text/javascript" src="/scripts/stylemanager.js">'
        html += '</script>\n'
        html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
        html += "<meta http-equiv=\"content-type\" content=\"text/html; "
        html += " charset=UTF-8\"></meta>\n";
        html += "</head>\n"
        html += "<body>\n"
        html += "<div id=\"main\"> \n"     
        html += "<form method=\"post\" action=\""+self.url+"\" "
        html += "id=\"contentForm\" >"  
        html += common.hiddenField("action")
        html += common.hiddenField("filename")
        html += common.hiddenField("style")
        if self.action == 'doProperties' and "style" in request.args:
            styleDirname = request.args["style"][0]
            style = self.config.styleStore.getStyle(styleDirname)
            html += self.__styleProperties(style)
        else:
            html += self.renderListStyles()
            html += '<br/><input class="button" type="button" name="import" style="float:center" '
            html += ' onclick="importStyle()" value="%s" />'  % _("Import Style")
        html += "</div>\n"
        html += "</div>\n"
        html += "<br/></form>\n"
        html += self.alertHTML
        html += "</body>\n"
        html += "</html>\n"
        return html.encode('utf8')
    
    render_POST = render_GET
    
    def alert(self,title, mesg):
        self.alertHTML = '<script type="text/javascript">Ext.Msg.alert("' +title+'", "'+mesg+'");</script>'
    
    def renderListStyles(self):
        """
        Muestra los estilos y sus propiedades
        """
        html = "<div id=\"styleManagerWorkspace\">\n"
        html += "<br/><h2><strong>%s</strong></h2>\n" % _("List of styles in your system:")
        html += "<ul style=\"list-style:none;\">\n"
        styles_sort = sorted(self.config.styleStore.getStyles())
        for style in styles_sort:
            html += "<li style='line-height:2em;'>%s &nbsp;&nbsp;" % style.get_name()
            html += self.__renderButtons(style)
            html += "</li>\n" 
        html += "</ul>"
        
        return html
    
    def __renderButtons(self, style):
        html = '<a title="%s" href="#" onclick="doExport(\'%s\');">\n' % (_("Export Style"), style.get_dirname())
        html += '<img alt="%s" class="submit" style="vertical-align:middle;" src="/images/stock-save.png">\n' % _("Export Style")
        html += '</a>&nbsp;\n'
        if (style.get_dirname() != 'INTEF' and style.get_dirname() != "standardwhite"):
            html += '<a title="%s" href="#" onclick="doDelete(\'%s\');">\n' % (_("Delete Style"), style.get_dirname())
            html += '<img alt="%s" class="submit" style="vertical-align:middle;" src="/images/stock-delete.png">\n' % _("Delete Style")
            html += '</a>&nbsp;\n'
        if (style.hasValidConfig()):
            html += '<a title="%s" href="#" onclick="doProperties(\'%s\');">\n' % (_("Style Properties"), style.get_dirname())
            html += '<img alt="%s" class="submit" style="vertical-align:middle;" src="/images/info.png">\n' % _("Style Properties")
            html += '</a>&nbsp;\n'
        return html
    
    def __styleProperties(self, style):
        """Muestra las propiedades de un estilo"""
        html = "<div id=\"styleManagerWorkspace\">\n"
        html += "<h2><strong>%s:</strong></h2>" % _("This style properties")
        html += '%s' % style.renderPropertiesHTML()
        html += u'<input class="button" type="button" name="Back" '
        html += u'onclick="doCancel()" value="%s" />'  % _("Back")
        html += '</div>\n'
        return html
    
    
    def __importStyle(self, filename):
        """
        Importa un estilo desde un fichero ZIP
        Comprueba si es un estilo valido (contiene content.css), 
            si el directorio no existe (para no machacar)
            y si tiene config.xml que el nombre no exista ya.
        """
        styleDir    = self.config.stylesDir
        log.debug("Import style from %s" % filename)
        encoding = sys.getfilesystemencoding()
        if encoding is None:
            encoding = 'utf-8'
        filename = toUnicode(filename, encoding)
        BaseFile=os.path.basename(filename)
        targetDir=BaseFile[0:-4:]
        absoluteTargetDir=styleDir/targetDir             
        try:
            sourceZip = zipfile.ZipFile( filename ,  'r')
        except IOError:
            filename = toUnicode(filename, 'utf-8')
            try:                    
                sourceZip = zipfile.ZipFile( filename ,  'r')                 
            except IOError:
                self.alert(_(u'Error'), _(u'File %s does not exist or is not readable.') % filename)
                return None
        if os.path.isdir(absoluteTargetDir):
            self.alert(_(u'Error'), _(u'Style directory already exists: %s') % targetDir)
        else:
            os.mkdir(absoluteTargetDir)
            for name in sourceZip.namelist():
                sourceZip.extract(name, absoluteTargetDir )
            sourceZip.close() 
            style = Style(absoluteTargetDir)
            if style.isValid(): 
                if not self.config.styleStore.addStyle(style):
                    absoluteTargetDir.rmtree()
                    self.alert(_(u'Error'), _(u'The style name already exists: %s') % style.get_name())
                else:         
                    self.alert(_(u'Success'), _(u'Successfully imported style: %s') % targetDir)  
            else:
                absoluteTargetDir.rmtree()
                self.alert(_(u'Error'), _(u'Incorrect style format (does not include content.css)'))
        self.action = ""

    def __exportStyle(self,  dirstylename, filename):
        """
        Exporta un estilo a un archivo ZIP
        """
        if not filename.lower().endswith('.zip'):
            filename += '.zip'
        sfile=os.path.basename(filename)
        log.debug("Export style %s" % dirstylename)
        try:
            zippedFile = zipfile.ZipFile(filename, "w", zipfile.ZIP_DEFLATED)
            try:
                for contFile in dirstylename.files():
                    zippedFile.write(unicode(contFile.normpath()),
                    contFile.name.encode('utf8'), zipfile.ZIP_DEFLATED)
            finally:
                zippedFile.close()
                self.alert(_(u'Correct'), _(u'Style exported correctly: %s') % sfile.encode('utf8'))
        except IOError:
            self.alert(_(u'Error'), _(u'Could not export style : %s') % filename)
        self.action = ""
            
 
    
    def __deleteStyle(self,  style):
        """Borra un estilo pasado por parametro"""
        log.debug("delete style")
        try:
            shutil.rmtree(style.get_style_dir())
            self.config.styleStore.delStyle(style)
            log.debug("delete style: %s" % style.get_name())
            self.alert(_(u'Correct'), _(u'Style deleted correctly'))
        except:
            self.alert(_(u'Error'), _(u'An unexpected error has occurred'))
        self.action = ""

    
