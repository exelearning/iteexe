
"""
JR: The StyleManagerPage is responsible for managing styles
"""

import logging
import os
import sys
import shutil
from zipfile                   import ZipFile, ZIP_DEFLATED
import json
from twisted.internet          import threads, reactor
from twisted.web.resource      import Resource
from twisted.web.xmlrpc        import Proxy
from exe.webui.livepage        import allSessionClients
from exe.webui.renderable      import RenderableResource
from exe.engine.path           import Path, toUnicode, TempDirPath
from exe.engine.style          import Style
from urllib                    import unquote, urlretrieve
from urlparse                  import urlparse, urlsplit
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
        # Remote XML-RPC server
        self.proxy = Proxy(self.config.stylesRepository.encode("ascii"))

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
        """ Every JSON response sent must have an 'action' field, which value will determine
            the panel to be displayed in the WebUI """
        
        if (self.action == 'Properties'):
            response = json.dumps({'success': True, 'properties': self.properties, 'style': self.style, 'action': 'Properties'})
            
        elif  (self.action == 'PreExport'):
            response = json.dumps({'success': True, 'properties': self.properties, 'style': self.style, 'action': 'PreExport'})
            
        elif  (self.action == 'StylesRepository'):
            response = json.dumps({'success': True, 'rep_styles': self.rep_styles, 'action' : 'StylesRepository'})
        
        else:
            response = json.dumps({'success': True, 'styles': self.renderListStyles(), 'action': 'List'})
            
        # self.action must be reset to 'List'. If user exits the Style Manager window and
        # opens it again, it must show the styles list panel, not the last panel opened
        self.action = 'List'
        return response
    
    def render_POST(self, request):
        """ Called on client form submit """
        """ Every form received must have an 'action' field, which value determines
            the function to be executed in the server side.
            The self.action attribute will be sent back to the client (see render_GET) """
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
        elif (request.args['action'][0] == 'doStylesRepository'):
            self.doStylesRepository()
        elif (request.args['action'][0] == 'doStyleImportURL'):
            self.doStyleImportURL(request.args['style_import_url'][0])
        elif (request.args['action'][0] == 'doStyleImportRepository'):
            self.doStyleImportRepository(request.args['style_name'][0])
        elif (request.args['action'][0] == 'doList'):
            self.doList()
        #return self.render_GET(None)
    
    def reloadPanel(self, action):
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
        
    def doStylesRepository(self):
        def getStylesList(styles_list) :
            """
            Update styles list with data got from repository and send to client order to refresh styles list in the UI
            """
            self.rep_styles = styles_list
            self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(' + json.dumps(self.rep_styles) + ')')
            self.client.sendScript("Ext.Msg.close();")
            
        def errorStylesList(value):
            self.rep_styles = []
            self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(' + json.dumps(self.rep_styles) + ')')
            self.alert(_(u'Error'), _(u'Error while getting styles list from the repository'))
        
        self.client.sendScript("Ext.Msg.wait(_('Updating styles list from repository...'));")
        self.proxy.callRemote('exe_styles.listStyles').addCallbacks(getStylesList, errorStylesList)
        
        self.action = 'StylesRepository'
        
    def doStyleImportURL(self, url, style_name = ''):
        """
        Download style from url and import into styles directory
        """
        def successDownload(result):
            filename = result[0]
            try:
                log.debug(filename)
                self.doImportStyle(filename)
                self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(' + json.dumps(self.rep_styles) + ', \'' + style_name + '\')')
                self.alert(_(u'Success'), _(u'Style successfully downloaded and installed'))
            finally:
                Path(filename).remove()
            
        def errorDownload(value):
            log.debug("Error when downloading style from %s" % url)
            self.rep_styles = []
            self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(' + json.dumps(self.rep_styles) + ', \'' + style_name + '\')')
            self.alert(_(u'Error'), _(u'Error when downloading style from repository'))
                
        log.debug("Download style from %s" % url)
        
        # urlparse() returns a tuple, which elements are:
        #  0: schema -> http
        #  1: netloc -> exelearning.net
        #  2: path   -> path/to/file.zip
        url_parts = urlsplit(url)
        if (not url_parts[0]) or (not url_parts[1]) or (not url_parts[2]):
            self.alert(_(u'Error'), _(u'URL not valid. '))
            
        path_splited = url_parts[2].split('/')
        filename = path_splited[-1]
        filename_parts = filename.split('.')
        if (filename_parts[-1].lower() != 'zip') :
            self.client.sendScript('Ext.getCmp("stylemanagerwin").down("form").refreshStylesList(' + json.dumps(self.rep_styles) + ', \'' + style_name + '\')')
            self.alert(_(u'Error'), _(u'URL not valid. '))
            self.action = 'StylesRepository'
            return;
        
        self.client.sendScript('Ext.MessageBox.progress("Style Download", "Connecting to style URL...")')
        
        # Downloaded ZIP file must have the same name than the remote file, 
        # otherwise file would be saved to a random temporary name, that   
        # 'doImportStyle' would use as style target directory
        d = threads.deferToThread(urlretrieve, url, filename, lambda n, b, f: self.progressDownload(n, b, f, self.client))
        d.addCallbacks(successDownload, errorDownload)
        
        self.action = 'StylesRepository'
        
    def doStyleImportRepository(self, style_name):
        """
        Download style from repository and import into styles directory
        """     
        url = ''
        for style in self.rep_styles :
            if style.get('name', 'not found') == style_name :
                url = style.get('download_url', '')
                self.doStyleImportURL(url, style_name)
                break

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
        
    def progressDownload(self, numblocks, blocksize, filesize, client):
        try:
            percent = min((numblocks * blocksize * 100) / filesize, 100)
        except:
            percent = 100
        client.sendScript('Ext.MessageBox.updateProgress(%f, "%d%%", "Downloading...")' % (float(percent) / 100, percent))
        log.info('%3d' % (percent))

    
