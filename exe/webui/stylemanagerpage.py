
"""
JR: The StyleManagerPage is responsible for managing styles
"""

import logging
import os
import sys
import shutil
from zipfile                       import ZipFile, ZIP_DEFLATED
import json
from twisted.web.resource import Resource
from exe.webui.livepage import allSessionClients
from exe.webui.renderable      import RenderableResource
from exe.engine.path           import toUnicode
from exe.engine.style          import Style
import locale
import base64


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
        self.action       = ""
        self.properties   = ""
        self.style        = ""
        self.client       = None

    def getChild(self, name, request):
        """
        Try and find the child for the name given
        """
        if name == "":
            return self
        else:
            return Resource.getChild(self, name, request)
        
    def render_GET(self, request):
        """Called for all requests to this object"""

        if (self.action == 'Properties'):
            self.action     = 'List'
            return json.dumps({'success': True, 'properties': self.properties, 'style': self.style, 'action': 'Properties'})
            
        elif  (self.action == 'PreExport'):
            self.action     = 'List'
            return json.dumps({'success': True, 'properties': self.properties, 'style': self.style, 'action': 'PreExport'})
        else:
            return json.dumps({'success': True, 'styles': self.renderListStyles(), 'action': 'List'})
        

    
    def render_POST(self, request):

        self.reloadPanel(request.args['action'][0])
        
        if (request.args['action'][0] == 'doExport'):
            self.doExportStyle(request.args['style'][0], request.args['filename'][0],request.args['xdata'][0])
        elif (request.args['action'][0] == 'doDelete'):
            self.doDeleteStyle(request.args['style'][0])
        elif (request.args['action'][0] == 'doImport'):
            self.doImportStyle(request.args['filename'][0])
        elif (request.args['action'][0] == 'doProperties'):
            self.doPropertiesStyle(request.args['style'][0])
        elif (request.args['action'][0] == 'doPreExport'):
            self.doPreExportStyle(request.args['style'][0])
        elif (request.args['action'][0] == 'doList'):
            self.doList()
        #return self.render_GET(None)
    
    def reloadPanel(self,action):
        self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").reload("'+action+'")', filter_func=allSessionClients)
        
    def alert(self, title, mesg):
        self.client.sendScript("Ext.Msg.alert('%s','%s')" % (title, mesg), filter_func=allSessionClients)
        
    
    def renderListStyles(self):
        """
        Devuelve una respuesta JSON con la lista de estilos y los botones asociados
        """
        styles = []
        styles_sort = self.config.styleStore.getStyles()

        def sortfunc(s1, s2):
            return locale.strcoll(s1.get_name(), s2.get_name())
        locale.setlocale(locale.LC_ALL, "")
        styles_sort.sort(sortfunc)
        for style in styles_sort:
            export = True
            delete = False
            properties = False
            if (style.get_dirname() != 'INTEF' and style.get_dirname() != "standardwhite"):
                delete = True
            if (style.hasValidConfig()):
                properties = True
            styles.append({'style': style.get_dirname(), 'name': style.get_name(), 'exportButton': export, 'deleteButton': delete, 'propertiesButton': properties})
        return styles
    
    
    def doImportStyle(self, filename):
        """
        Importa un estilo desde un fichero ZIP
        Comprueba si es un estilo valido (contiene content.css), 
            si el directorio no existe (para no machacar)
            y si tiene config.xml que el nombre no exista ya.
        """
        styleDir    = self.config.stylesDir
        log.debug("Import style from %s" % filename)
        filename=filename.decode('utf-8')       
        BaseFile=os.path.basename(filename)
        targetDir=BaseFile[0:-4:]
        absoluteTargetDir=styleDir/targetDir 
        try:
            sourceZip = ZipFile( filename ,  'r')
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
                    self.alert(_(u'Success'), _(u'Successfully imported style: %s') % style.get_name())  
            else:
                absoluteTargetDir.rmtree()
                self.alert(_(u'Error'), _(u'Incorrect style format (does not include content.css)'))
        self.action = ""

    def doExportStyle(self, stylename, filename,cfgxml):

        if filename != '':
            styleDir    = self.config.stylesDir
            style = Style(styleDir/stylename)
            log.debug("dir %s" % style.get_style_dir())
            self.__exportStyle(style.get_style_dir(), unicode(filename),cfgxml)
            

    
        
    def __exportStyle(self, dirstylename, filename,cfgxml):
        """
        Exporta un estilo a un archivo ZIP
        """
        if not filename.lower().endswith('.zip'):
            filename += '.zip' 
        sfile=os.path.basename(filename)
        log.debug("Export style %s" % dirstylename)
        try:
            zippedFile = ZipFile(filename, "w")
            try:
                if cfgxml!='':
                    for contFile in dirstylename.files():
                        if contFile.basename()!= 'config.xml':
                            zippedFile.write(unicode(contFile.normpath()), contFile.basename(), ZIP_DEFLATED)
                else:
                    for contFile in dirstylename.files():
                            zippedFile.write(unicode(contFile.normpath()), contFile.basename(), ZIP_DEFLATED)
            finally:
                if cfgxml!='':
                    zippedFile.writestr('config.xml', cfgxml)
                zippedFile.close()
                self.alert(_(u'Correct'), _(u'Style exported correctly: %s') % sfile)

        except IOError:
            self.alert(_(u'Error'), _(u'Could not export style : %s') % filename.basename())
        self.action = ""
            
    def doDeleteStyle(self, style):
        styleDir    = self.config.stylesDir
        styleDelete = Style(styleDir/style)
        self.__deleteStyle(styleDelete)
    
    def __deleteStyle(self,  style):
        """Borra un estilo pasado por parametro"""
        log.debug("delete style")
        try:
            shutil.rmtree(style.get_style_dir())
            self.config.styleStore.delStyle(style)
            log.debug("delete style: %s" % style.get_name())
            self.alert(_(u'Correct'), _(u'Style deleted correctly'))
            self.reloadPanel('doList')
        except:
            self.alert(_(u'Error'), _(u'An unexpected error has occurred'))
        self.action = ""
        
    def doPropertiesStyle(self, style):
        styleDir        = self.config.stylesDir
        styleProperties = Style(styleDir/style)
        self.properties = styleProperties.renderPropertiesJSON()
        self.action     = 'Properties'
        self.style      = styleProperties.get_name()
    def doPreExportStyle(self, style):
        styleDir        = self.config.stylesDir
        styleProperties = Style(styleDir/style)
        self.properties = styleProperties.renderPropertiesJSON()
        self.action     = 'PreExport'
        self.style      = style
        
    def doList(self):
        self.action     = 'List'
        self.style      = ''

    
