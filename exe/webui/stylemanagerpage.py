
"""
JR: The StyleManagerPage is responsible for managing styles
"""

import logging
from exe.webui                 import common
from exe.webui.renderable      import RenderableResource


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
        self.styles       = self.webServer.application.config.styles


    def process(self, request):
        """
        Process current package 
        """
        log.debug("process " + repr(request.args))
                   
        if ("action" in request.args and 
             request.args["action"][0] == "exportStyle"):          
            self.__exportStyle()
            
        if ("action" in request.args and 
             request.args["action"][0] == "importStyle"):
            self.__importStyle()
        if ("action" in request.args and 
             request.args["action"][0] == "DeleteStyle"):
            self.__deleteStyle(request)
        
        
    def render_GET(self, request):
        """Called for all requests to this object"""
        
        # Processing 
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
        html += common.hiddenField("object")
        html += common.hiddenField("isChanged", "1") 
        html += "<div id=\"styleManagerButtons\"> \n"     
        html += u'<br/><input class="button" type="button" name="import" '
        html += u' onclick="importStyle()" value="%s" disabled="disabled" />'  % _("Import Style")
        html += u'<br/><input class="button" type="button" name="export" '
        html += u'onclick="exportStyle()" value="%s" disabled="disabled" />'  % _("Export Style")
        html += u'<br/><input class="button" type="button" name="delete" '
        html += u'onclick="deleteStyle()" value="%s" disabled="disabled" />'  % _("Delete Style")
        html += u'<br/><input class="button" type="button" name="quit" '
        html += u'onclick="quitDialog()"'  
        html += u' value="%s" />\n'  % _("Quit")
        html += common.hiddenField("pathpackage")
        html += "</fieldset>"
        html += "</div>\n"
        html += self.renderStyles()
        html += "</div>\n"
        html += "<br/></form>\n"
        html += "</body>\n"
        html += "</html>\n"
        return html.encode('utf8')
    
    render_POST = render_GET
    
    def renderStyles(self):
        """
        Muestra los estilos y sus propiedades
        """
        html = "<div id=\"styleManagerWorkspace\">\n"
        html += "<br/><strong>%s</strong>\n" % _("List of styles in your system:")
        html += "<ul style=\"list-style:none;\">\n"
        styles_sort = sorted(self.styles)
        for style in styles_sort:
            html += "<li style='line-height:2em;'>%s" % style.get_name()
            if (style.hasValidConfig()):
                html += self._styleProperties(style)
            html += "</li>\n" 
        html += "</ul>"
        html += "</div>"
        return html
    
    def _styleProperties(self, style):
        """Anade tooltip de propiedades"""
        id_ = common.newId()
        html  = u'<a onmousedown="Javascript:updateCoords(event);" '
        html += u' title="%s" ' % _(u'Click to view the details of this style')
        html += u'onclick="Javascript:showMe(\'i%s\', 350, 100);" ' % id_
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
