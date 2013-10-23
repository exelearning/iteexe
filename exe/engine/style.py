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
    _attributes = {
                   'name': 'Name',
                   'version': 'Version', 
                   'compatibility': 'Compatibility', 
                   'author': 'Author', 
                   'author-url': 'Author URL', 
                   'license': 'License', 
                   'license-url': 'License URL', 
                   'description': 'Description',
                   'extra-head': 'Extra head',
                   'jquery': 'Path to jQuery (if different)',
                   'extra-body': 'Extra body'
                   }
    
    _attributesCode = ['extra-head', 'extra-body']

    def __init__(self, styleDir):
        """Initialize a new Style"""
        log.debug("Creating Style")
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
        self._extra_head    = ''
        self._jquery    = True
        self._extra_body    = ''
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
                    for attribute in self._attributes.keys():
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
        return _(self._name)
    
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
    
    def get_extra_head(self):
        return self._extra_head
        
    def get_jquery(self):
        return self._jquery
        
    def get_extra_body(self):
        return self._extra_body
    
    
    def renderPropertiesHTML(self):
        html = ''
        for attribute in self._attributes.keys():
            if hasattr(self, '_'+attribute.replace('-', '_')) and getattr(self, '_'+attribute.replace('-', '_')) != '':
                html += '<p><strong>' + _(self._attributes[attribute]) + ': </strong>'
                if attribute in self._attributesCode:
                    html += '<code>' + getattr(self, '_'+attribute.replace('-', '_')).replace('<', '&lt') + '</code>' + '</p>'
                else:
                    html += getattr(self, '_'+attribute.replace('-', '_')).replace('\n','<br/>') + '</p>'
        return html
    
    def renderPropertiesJSON(self):
        properties = []
        for attribute in self._attributes.keys():
            if hasattr(self, '_'+attribute.replace('-', '_')) and getattr(self, '_'+attribute.replace('-', '_')) != '':
                if attribute in self._attributesCode:
                    value = getattr(self, '_'+attribute.replace('-', '_')).replace('"',"'")
                else:
                    value = getattr(self, '_'+attribute.replace('-', '_'))
                properties.append({'name': _(self._attributes[attribute]), 'value': value})
        return properties  
    
    def __str__(self):
        string = ''
        for attribute in self._attributes.keys():
            if hasattr(self, '_'+attribute.replace('-', '_')) and getattr(self, '_'+attribute.replace('-', '_')) != '':
                string += _(self._attributes[attribute]) + ': ' + getattr(self, '_'+attribute.replace('-', '_')) + '\n'
        return string
    
    def __cmp__(self, other):
        return cmp(self._name, other._name)


# ===========================================================================
