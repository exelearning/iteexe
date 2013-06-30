
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
                   
        if ("action" in request.args and request.args["action"][0] == "exportStyle"): 
            stylename = request.args["filename"][0] 
            self.action = 'exportStyle'
        elif ("action" in request.args and request.args["action"][0] == "importStyle"):
            stylename = request.args["filename"][0] 
            self.__importStyle(stylename)
        elif ("action" in request.args and request.args["action"][0] == "deleteStyles"):
            self.action = 'deleteStyles'
        elif ("action" in request.args and request.args["action"][0] == "doExport"):
            styleValue = request.args["styleExport"][1]
            filenameTarget = request.args["filename"][0]
            styleDir    = self.config.stylesDir
            style = Style(styleDir/styleValue)
            self.__exportStyle(style.get_style_dir(), filenameTarget)
        elif ("action" in request.args and request.args["action"][0] == "doDelete"):
            stylesDelete = []
            styleDir    = self.config.stylesDir
            for i in request.args.keys():
                if (request.args[i] == ['on']):
                    style = Style(styleDir/i)
                    stylesDelete.append(style)
            self.__deleteStyles(stylesDelete)
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
        if self.action != "":
            disabled = 'disabled="disabled"' 
        else:
            disabled = ''
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
        html += "<div id=\"styleManagerButtons\"> \n"     
        html += '<br/><input class="button" type="button" name="import" '
        html += ' onclick="importStyle()" value="%s" %s />'  % (_("Import Style"), disabled)
        html += '<br/><input class="button" type="button" name="export" '
        html += 'onclick="exportStyle()" value="%s" %s />'  % (_("Export Style"), disabled)
        html += '<br/><input class="button" type="button" name="delete" '
        html += 'onclick="deleteStyles()" value="%s" %s />'  % (_("Delete Style"), disabled)
        html += '<br/><input class="button" type="button" name="quit" '
        html += 'onclick="quitDialog()"'  
        html += ' value="%s" />\n'  % _("Quit")
        html += common.hiddenField("filename")
        html += common.hiddenField("styleExport")
        html += "</fieldset>"
        html += "</div>\n"
        if self.action == 'exportStyle':
            html += self.renderExport()   
        elif self.action == 'deleteStyles':
            html += self.renderDelete()
        else:
            html += self.renderListStyles()
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
        html += "<br/><strong>%s</strong>\n" % _("List of styles in your system:")
        html += "<ul style=\"list-style:none;\">\n"
        styles_sort = sorted(self.config.styleStore.getStyles())
        for style in styles_sort:
            html += "<li style='line-height:2em;'>%s" % style.get_name()
            if (style.hasValidConfig()):
                html += self._styleProperties(style)
            html += "</li>\n" 
        html += "</ul>"
        html += "</div>"
        return html
    
    def renderExport(self):
        """
        Muestra una lista de radio botones con los estilos para elegir el estilo a exportar
        """
        html = "<div id=\"styleManagerWorkspace\">\n"
        html += "<br/><strong>%s</strong>\n" % _("Choose the style to export:")
        html += "<ul style=\"list-style:none;\">\n"
        styles_sort = sorted(self.config.styleStore.getStyles())
        for style in styles_sort:
            if (style.get_name() == 'INTEF'):
                html += "<li style='line-height:2em;'><input type='radio' name='styleExport' value='%s' checked='checked'>%s" % (style.get_dirname(), style.get_name())
            else:
                html += "<li style='line-height:2em;'><input type='radio' name='styleExport' value='%s'>%s" % (style.get_dirname(), style.get_name())
            html += "</li>\n" 
        html += "</ul>"
        html += u'<br/><input class="button" type="button" name="Export" '
        html += u'onclick="doExport()" value="%s" />'  % _("Export")
        html += u'<input class="button" type="button" name="Cancel" '
        html += u'onclick="doCancel()" value="%s" />'  % _("Cancel")
        html += "</div>"
        return html
    
    def renderDelete(self):
        """
        Muestra una lista de check botones con los estilos para elegir los estilos a borrar
        """
        html = "<div id=\"styleManagerWorkspace\">\n"
        html += "<br/><strong>%s</strong>\n" % _("Choose the style to delete:")
        html += "<ul style=\"list-style:none;\">\n"
        styles_sort = sorted(self.config.styleStore.getStyles())
        for style in styles_sort:
            if (style.get_dirname() == 'INTEF' or style.get_dirname() == "standardwhite"):
                html += "<li style='line-height:2em;'><input id='style' type=checkbox name='%s\' disabled='disabled'>%s</input>\n" % (style.get_dirname(), style.get_name())
            else:
                html += "<li style='line-height:2em;'><input id='style' type=checkbox name='%s\'>%s</input>\n" % (style.get_dirname(), style.get_name())
            html += "</li>\n" 
        html += "</ul>"
        html += u'<br/><input class="button" type="button" name="Delete" '
        html += u'onclick="doDelete()" value="%s" />'  % _("Delete")
        html += u'<input class="button" type="button" name="Cancel" '
        html += u'onclick="doCancel()" value="%s" />'  % _("Cancel")
        html += "</div>"
        return html
    
    def _styleProperties(self, style):
        """Anade tooltip de propiedades"""
        id_ = common.newId()
        html  = u'<a onmousedown="Javascript:updateCoords(event);" '
        html += u' title="%s" ' % _(u'Click to view the details of this style')
        html += u'onclick="Javascript:showMe(\'i%s\', 300, 100);" ' % id_
        html += u'href="Javascript:void(0)" style="cursor:help;"> ' 
        html += u'<img class="help" alt="%s" ' \
                % _(u'Click to view the details of this style')
        html += u'src="/images/help.gif" style="vertical-align:middle;"/>'
        html += u'</a>\n'
        html += u'<div id="i%s" style="display:none;">' % id_
        html += u'<div style="float:right;" >'
        html += u'<img alt="%s" ' % _("Close")
        html += u'src="/images/stock-stop.png" title="%s" ' % _("Close")
        html += u' onmousedown="Javascript:hideMe();"/></div>'
        html += u'<div class="popupDivLabel">%s</div>%s' % (style.get_name(), style.renderPropertiesHTML())
        html += u'</div>\n'
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
            
 
    
    def __deleteStyles(self,  styles):
        """Borra una lista de estilos pasados por parametro"""
        log.debug("delete styles")
        for style in styles:
            try:
                shutil.rmtree(style.get_style_dir())
                self.config.styleStore.delStyle(style)
                log.debug("delete style: %s" % style.get_name())
                self.alert(_(u'Correct'), _(u'Styles deleted correctly'))
            except:
                self.alert(_(u'Error'), _(u'An unexpected error has occurred'))
        self.action = ""

    
