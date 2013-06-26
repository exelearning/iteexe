"""
JR: Representacion de un estilo
"""


import logging
from exe.engine.persist   import Persistable
from xml.dom              import minidom

log = logging.getLogger(__name__)

# ===========================================================================
class Style(Persistable):
    """
    Clase base para todos los estilos
    """

    # Atributos
    _attributes = ('name', 'version', 'compatibility', 'author', 'author-url', 'license', 'license-url', 'description')

    def __init__(self, styleDir):
        """Initialize a new iDevice, setting a unique id"""
        log.debug("Creating iDevice")
        self._styleDir      = styleDir
        self._name          = styleDir.basename()
        self._dirname       = styleDir.basename()
        self._version       = '0.0'
        self._compatibility = '7.1'
        self._author        = ''
        self._author_url    = ''
        self._license       = ''
        self._license_url   = ''
        self._description   = ''
        self._validConfig   = False
        self._valid         = False
        self._checkValid()
        self._loadStyle()

    def _loadStyle(self):
        if self._valid:
            configStyle = self._styleDir/'config.xml'
            if configStyle.exists():
                xmldoc = minidom.parse( configStyle )
        
                theme = xmldoc.getElementsByTagName('theme')
                if (len(theme) > 0):
                    for attribute in self._attributes:
                        attr = theme[0].getElementsByTagName(attribute)
                        if (len(attr) > 0):
                            attrName = attr[0].nodeName
                            if (len(attr[0].childNodes) > 0):
                                attrValue = attr[0].firstChild.nodeValue
                                if hasattr(self, '_'+attribute.replace('-', '_')):
                                    setattr(self, '_'+attribute.replace('-', '_'), attrValue)
                self._validConfig = True
    
    def _checkValid(self):
        content = self._styleDir/'content.css'
        if content.exists():
            self._valid = True
        else:
            self._valid = False
            

    # Metodos publicos de acceso
    def isValid(self):
        return self._valid
    
    
    def hasValidConfig(self):
        return self._validConfig
    
    
    def get_style_dir(self):
        return self._styleDir
    
    
    def get_name(self):
        return self._name
    
    def get_dirname(self):
        return self._dirname


    def get_version(self):
        return self._version


    def get_compatibility(self):
        return self._compatibility


    def get_author(self):
        return self._author


    def get_author_url(self):
        return self._author_url


    def get_license(self):
        return self._license


    def get_license_url(self):
        return self._license_url


    def get_description(self):
        return self._description
    
    def renderPropertiesHTML(self):
        html = ''
        for attribute in self._attributes:
            if hasattr(self, '_'+attribute.replace('-', '_')) and getattr(self, '_'+attribute.replace('-', '_')) != '':
                html += '<p><strong>' + attribute + ': </strong>' + getattr(self, '_'+attribute.replace('-', '_')).replace('\n','<br/>') + '</p>'
        return html
    
    
    def __str__(self):
        string = ''
        for attribute in self._attributes:
            if hasattr(self, '_'+attribute.replace('-', '_')) and getattr(self, '_'+attribute.replace('-', '_')) != '':
                string += attribute + ': ' + getattr(self, '_'+attribute.replace('-', '_')) + '\n'
        return string
    
    def __cmp__(self, other):
        return cmp(self._name, other._name)


# ===========================================================================
