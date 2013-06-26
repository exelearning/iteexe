"""
JR: Almacen de los estilos disponibles
"""

from exe.engine.style         import Style
import logging

log = logging.getLogger(__name__)

# ===========================================================================
class StyleStore:
    """
    Almacen de los estilos disponibles
    """
    def __init__(self, config):
        self._config         = config
        self._styles         = []
        self._listeners      = []
        
        self.__load()
        
    def getStyles(self):
        """
        Devuelve la lista de estilos
        """
        return self._styles
    
    def getStyle(self, styleDirName):
        """
        Devuelve un estilo dado su dirname
        """
        for style in self._styles:
            if style._dirname == styleDirName:
                return style
        return None
    
            
    def delStyle(self, style):
        """
        Borra un estilo
        """
        if (style in self._styles):
            self._styles.remove(style)
            for listener in self._listeners:
                listener.delStyle(style)
    
    
    def addStyle(self, style):
        """
        Anade un estilo
        """
        if (style not in self._styles):
            self._styles.append(style)
            for listener in self._listeners:
                listener.addStyle(style)  
    
    
    def register(self, listener):
        """
        Registra un escuchador interesado en informar de los cambios producidos en StyleStore
        """
        self.listeners.append(listener)
  

    def __load(self):
        """
        Carga los estilos desde el directorio de estilos definido en config
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
