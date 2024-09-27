#!/usr/bin/env python
#-*- coding: utf-8 -*-

"""
JRJ: Almacén de los estilos disponibles
(Store of available styles)
"""

from exe.engine.style         import Style
import logging

log = logging.getLogger(__name__)

# ===========================================================================
class StyleStore:
    """
    Almacén de los estilos disponibles
    (store of available styles)
    """
    def __init__(self, config):
        self._config         = config
        self._styles         = []
        self._listeners      = []
        
        self.__load()
        
    def getStyles(self):
        """
        Devuelve la lista de estilos
        (returns the list of styles)
        """
        return self._styles
    
    def getStyle(self, styleDirName):
        """
        Devuelve un estilo dado su dirname
        (returns a style given its dirname)
        """
        for style in self._styles:
            if style._dirname == styleDirName:
                return style
        return None
    
            
    def delStyle(self, style):
        """
        Borra un estilo
        (deletes a style)
        """
        if (style in self._styles):
            self._styles.remove(style)
            for listener in self._listeners:
                listener.delStyle(style)
    
    
    def addStyle(self, style):
        """
        Añade un estilo
        (adds a style)
        """
        if (style not in self._styles):
            self._styles.append(style)
            for listener in self._listeners:
                listener.addStyle(style) 
            return True
        else:
            return False 
    
    
    def register(self, listener):
        """
        Registra un escuchador interesado en ser informado de los cambios producidos en StyleStore
        (registers a listener interested in being informed of the changes in StyleStore)
        """
        self._listeners.append(listener)
  

    def __load(self):
        """
        Carga los estilos desde el directorio de estilos definido en config
        (loads the styles from the directory defined in config)
        """
        styleDir    = self._config.stylesDir

        log.debug("loadStyles from %s" % styleDir)
        for subDir in styleDir.dirs():
            style = Style(subDir)
            if style.isValid():
                log.debug(" loading style %s" % style.get_name())
                self.addStyle(style)
                #print style
            else:
                log.debug(" style %s is not valid")
    

# ===========================================================================
