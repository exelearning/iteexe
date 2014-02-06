#===========================================================================
'''
Render HTML SCORM pages
'''
import logging
import re
from cgi                      import escape
from urllib                   import quote
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.export.pages         import Page, uniquifyNames
from exe.webui                import common 
from exe                      import globals as G
from exe.engine.version       import release

log = logging.getLogger(__name__)

# ===========================================================================
class ScormPage(Page):
    """
    This class transforms an eXe node into a SCO
    """
    def __init__(self, name, depth, node, scormType, metadataType):
        self.scormType = scormType
        self.metadataType = metadataType
        super(ScormPage, self).__init__(name, depth, node)

    def save(self, outputDir):
        """
        This is the main function.  It will render the page and save it to a
        file.  
        'outputDir' is the name of the directory where the node will be saved to,
        the filename will be the 'self.node.id'.html or 'index.html' if
        self.node is the root node. 'outputDir' must be a 'Path' instance
        """
        out = open(outputDir/self.name+".html", "wb")
        out.write(self.render())
        out.close()


    def render(self):
        """
        Returns an XHTML string rendering this page.
        """
        dT = common.getExportDocType()
        lb = "\n" #Line breaks
        sectionTag = "div"
        headerTag = "div"
        if dT == "HTML5":
            sectionTag = "section"
            headerTag = "header"
        html  = common.docType()
        lenguaje = G.application.config.locale
        style = G.application.config.styleStore.getStyle(self.node.package.style)
        if self.node.package.dublinCore.language!="":
            lenguaje = self.node.package.dublinCore.language
        html += u"<html lang=\"" + lenguaje + "\" xml:lang=\"" + lenguaje + "\" xmlns=\"http://www.w3.org/1999/xhtml\">"+lb
        html += u"<head>"+lb
        html += u"<title>"
        if self.node.id=='0':
            if self.node.package.title!='':
                html += escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        else:
            if self.node.package.title!='':
                html += escape(self.node.titleLong)+" | "+escape(self.node.package.title)
            else:
                html += escape(self.node.titleLong)
        html += u" </title>"+lb
        html += u"<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />"+lb
        if dT != "HTML5" and self.node.package.dublinCore.language!="":
            html += '<meta http-equiv="content-language" content="'+lenguaje+'" />'+lb
        if self.node.package.author!="":
            html += '<meta name="author" content="'+self.node.package.author+'" />'+lb
        html += '<meta name="generator" content="eXeLearning '+release+' - exelearning.net" />'+lb
        if self.node.id=='0':
            if self.node.package.description!="":
                html += '<meta name="description" content="'+self.node.package.description+'" />'+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"base.css\" />"+lb
        if common.hasWikipediaIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_wikipedia.css\" />"+lb
        if common.hasGalleryIdevice(self.node):
            html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"exe_lightbox.css\" />"+lb
        html += u"<link rel=\"stylesheet\" type=\"text/css\" href=\"content.css\" />"+lb
        if dT == "HTML5" or common.nodeHasMediaelement(self.node):
            html += u'<!--[if lt IE 9]><script type="text/javascript" src="exe_html5.js"></script><![endif]-->'+lb
        
        # jQuery
        if style.hasValidConfig:
            if style.get_jquery() == True:
                html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
            else:
                html += u'<script type="text/javascript" src="'+style.get_jquery()+'"></script>'+lb
        else:
            html += u'<script type="text/javascript" src="exe_jquery.js"></script>'+lb
        
        if common.hasGalleryIdevice(self.node):
            html += u'<script type="text/javascript" src="exe_lightbox.js"></script>'+lb
        html += common.getJavaScriptStrings()+lb
        html += u'<script type="text/javascript" src="common.js"></script>'+lb
        if common.hasMagnifier(self.node):
            html += u'<script type="text/javascript" src="mojomagnify.js"></script>'+lb
        if self.scormType == 'commoncartridge':
            html += u'<script type="text/javascript" src="lernmodule_net.js"></script>'+lb
            if style.hasValidConfig:
                html += style.get_extra_head()        
            html += u"</head>"+lb
            html += u"<body class=\"exe-scorm\">"+lb
        else:
            html += u"<script type=\"text/javascript\" src=\"SCORM_API_wrapper.js\"></script>"+lb
            html += u"<script type=\"text/javascript\" src=\"SCOFunctions.js\"></script>"+lb
            html += u'<script type="text/javascript" src="lernmodule_net.js"></script>'+lb
            if style.hasValidConfig:
                html += style.get_extra_head()
            html += u"</head>"+lb            
            html += u'<body class=\"exe-scorm\" onload="loadPage()" '
            html += u'onunload="unloadPage()">'+lb
        html += u"<"+sectionTag+" id=\"outer\">"+lb
        html += u"<"+sectionTag+" id=\"main\">"+lb
        html += u"<"+headerTag+" id=\"nodeDecoration\">"
        html += u"<h1 id=\"nodeTitle\">"
        html += escape(self.node.titleLong)
        html += u'</h1></'+headerTag+'>'+lb

        for idevice in self.node.idevices:
            if idevice.klass != 'NotaIdevice':
                e=" em_iDevice"
                if unicode(idevice.emphasis)=='0':
                    e=""
                html += u'<'+sectionTag+' class="iDevice_wrapper %s%s" id="id%s">%s' % (idevice.klass, e, idevice.id, lb)
                block = g_blockFactory.createBlock(None, idevice)
                if not block:
                    log.critical("Unable to render iDevice.")
                    raise Error("Unable to render iDevice.")
                if hasattr(idevice, "isQuiz"):
                    html += block.renderJavascriptForScorm()
                html += self.processInternalLinks(
                    block.renderView(self.node.package.style))
                html += u'</'+sectionTag+'>'+lb # iDevice div

        html += u"</"+sectionTag+">"+lb # /#main
        themeHasXML = common.themeHasConfigXML(self.node.package.style)
        if themeHasXML:
        #if style.hasValidConfig:
            html += self.renderLicense()
            html += self.renderFooter()
        html += u"</"+sectionTag+">"+lb # /#outer
        if self.node.package.scolinks:
            html += u'<'+sectionTag+' class="previousnext">'+lb
            html += u'<a class="previouslink" '
            html += u'href="javascript:goBack();">%s</a> | <a class="nextlink" ' % _('Previous')
            html += u'href="javascript:goForward();">%s</a>' % _('Next')
            html += u'</'+sectionTag+'>'+lb
        if not themeHasXML:
        #if not style.hasValidConfig:
            html += self.renderLicense()
            html += self.renderFooter()
        else:
            html += style.get_extra_body()
        html += u'<'+sectionTag+' id="lmsubmit"></'+sectionTag+'><script type="text/javascript" language="javascript">doStart();</script>'+lb
        html += u'</body></html>'
        html = html.encode('utf8')
        # JR: Eliminamos los atributos de las ecuaciones
        aux = re.compile("exe_math_latex=\"[^\"]*\"")
        html = aux.sub("", html)
        aux = re.compile("exe_math_size=\"[^\"]*\"")
        html = aux.sub("", html)
        #JR: Cambio el & en los enlaces del glosario
        html = html.replace("&concept", "&amp;concept")
        # Remove "resources/" from data="resources/ and the url param
        html = html.replace("video/quicktime\" data=\"resources/", "video/quicktime\" data=\"")
        html = html.replace("application/x-mplayer2\" data=\"resources/", "application/x-mplayer2\" data=\"")
        html = html.replace("audio/x-pn-realaudio-plugin\" data=\"resources/", "audio/x-pn-realaudio-plugin\" data=\"")
        html = html.replace("<param name=\"url\" value=\"resources/", "<param name=\"url\" value=\"")
        return html


    def processInternalLinks(self, html):
        """
        take care of any internal links which are in the form of:
           href="exe-node:Home:Topic:etc#Anchor"
        For this SCORM Export, go ahead and remove the link entirely,
        leaving only its text, since such links are not to be in the LMS.
        """
        return common.removeInternalLinks(html)
        

# ===========================================================================