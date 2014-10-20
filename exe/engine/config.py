# ===========================================================================
# eXe config
# Copyright 2004-2006, University of Auckland
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

"""
Config settings loaded from exe.conf
Is responsible for the system-wide settings we use
O/S specific config classes are derieved from here
"""

from exe.engine.configparser import ConfigParser
from exe.engine.path import Path
from exe.engine.locales import chooseDefaultLocale
from exe.engine import version
import logging
from logging.handlers import RotatingFileHandler
import sys
import os
import gettext
import tempfile
import twisted
import shutil
from exe                      import globals as G
from exe.engine.stylestore  import StyleStore
from exe.webui import common

x_ = lambda s: s


class Config(object):
    """
    The Config class contains the configuration information for eXe.
    """

    # To build link to git revision
    baseGitWebURL = 'https://forja.cenatic.es/plugins/scmgit/cgi-bin/gitweb.cgi?p=iteexe/iteexe.git'

    # Class attributes
    optionNames = {
        'system': ('webDir', 'jsDir', 'port', 'dataDir',
                   'configDir', 'localeDir', 'browser', 'mediaProfilePath',
                   'videoMediaConverter_ogv', 'videoMediaConverter_3gp',
                   'videoMediaConverter_mpg',
                   'videoMediaConverter_avi', 'audioMediaConverter_ogg',
                   'audioMediaConverter_au', 'audioMediaConverter_mp3',
                   'audioMediaConverter_wav', 'ffmpegPath'),
        'user': ('locale', 'lastDir', 'showPreferencesOnStart','defaultStyle', 'showIdevicesGrouped','docType','editorMode'),
    }

    idevicesCategories = {
        'activity': [x_('Non-Interactive Activities')],
        'reading activity': [x_('Non-Interactive Activities')],
        'dropdown activity': [x_('Interactive Activities')],
        'java applet': [x_('Non-Textual Information')],
        'wiki article': [x_('Non-Textual Information')],
        'case study': [x_('Non-Interactive Activities')],
        'preknowledge': [x_('Textual Information')],
        'scorm quiz': [x_('Interactive Activities')],
        'fpd - multi choice activity': [x_('FPD')],
        'fpd - cloze activity': [x_('FPD')],
        'fpd - cloze activity (modified)': [x_('FPD')],
        'fpd - multi select activity': [x_('FPD')],
        'fpd - true/false activity': [x_('FPD')],
        'fpd - situation': [x_('FPD')],
        'fpd - quotation': [x_('FPD')],
        'fpd - you should know': [x_('FPD')],
        'fpd - highlighted': [x_('FPD')],
        'fpd - translation': [x_('FPD')],
        'fpd - guidelines students': [x_('FPD')],
        'fpd - guidelines teacher': [x_('FPD')],
        'fpd - a step ahead': [x_('FPD')],
        'fpd - a piece of advice': [x_('FPD')],
        'fpd - think about it (with feedback)': [x_('FPD')],
        'fpd - think about it (without feedback)': [x_('FPD')],
        'fpd - free text': [x_('FPD')],
        'image gallery': [x_('Non-Textual Information')],
        'image magnifier': [x_('Non-Textual Information')],
        'note': [x_('Textual Information')],
        'objectives': [x_('Textual Information')],
        'multi-choice': [x_('Interactive Activities')],
        'multi-select': [x_('Interactive Activities')],
        'true-false question': [x_('Interactive Activities')],
        'reflection': [x_('Non-Interactive Activities')],
        'cloze activity': [x_('Interactive Activities')],
        'rss': [x_('Non-Textual Information')],
        'external web site': [x_('Non-Textual Information')],
        'free text': [x_('Textual Information')],
        'click in order game': [x_('Experimental')],
        'hangman game': [x_('Experimental')],
        'place the objects': [x_('Interactive Activities')],
        'memory match game': [x_('Experimental')],
        'file attachments': [x_('Non-Textual Information')],
        'sort items': [x_('Experimental')]
    }
    
    @classmethod
    def getConfigPath(cls):
        obj = cls.__new__(cls)
        obj.configParser = ConfigParser()
        obj._overrideDefaultVals()
        obj.__setConfigPath()
        return obj.configPath

    def __init__(self):
        """
        Initialise
        """
        self.configPath = None
        self.configParser = ConfigParser(self.onWrite)
        # Set default values
        # exePath is the whole path and filename of the exe executable
        self.exePath     = Path(sys.argv[0]).abspath()
        # webDir is the parent directory for styles,scripts and templates
        self.webDir      = self.exePath.dirname()
        self.jsDir       = self.exePath.dirname()
        # localeDir is the base directory where all the locales are stored
        self.localeDir   = self.exePath.dirname()/"locale"
        # port is the port the exe webserver will listen on 
        # (previous default, which earlier users might still use, was 8081)
        self.port        = 51235
        # dataDir is the default directory that is shown to the user
        # to save packages and exports in
        self.dataDir     = Path(".")
        # configDir is the dir for storing user profiles
        # and user made idevices and the config file
        self.configDir   = Path(".")
		#FM: New Styles Directory path
        self.stylesDir =Path(self.configDir/'style').abspath()
        #FM: Default Style name
        self.defaultStyle= u"INTEF"
        # browser is the name of a predefined browser specified at http://docs.python.org/library/webbrowser.html.
        # None for system default
        self.browser = None
        # docType  is the HTML export format
        self.docType = 'XHTML' 
        # locale is the language of the user
        self.locale = chooseDefaultLocale(self.localeDir)
        # internalAnchors indicate which exe_tmp_anchor tags to generate for each tinyMCE field
        # available values = "enable_all", "disable_autotop", or "disable_all"
        self.internalAnchors = "enable_all"
        self.lastDir = None
        self.showPreferencesOnStart = "1"
        self.showIdevicesGrouped = "1"
        # tinymce option
        self.editorMode = 'permissive' 
        # styleSecureMode : if this [user] key is = 0  , exelearning can run python files in styles
        # as websitepage.py , ... ( deactivate secure mode )
        self.styleSecureMode="1"
        # styles is the list of style names available for loading
        self.styles      = []
        # The documents that we've recently looked at
        self.recentProjects = []
        # canonical (English) names of iDevices not to show in the iDevice pane
        self.hiddeniDevices = []
        #Media conversion programs used for XML export system
        self.videoMediaConverter_ogv = ""
        self.videoMediaConverter_3gp = ""
        self.videoMediaConverter_avi = ""
        self.videoMediaConverter_mpg = ""
        self.audioMediaConverter_ogg = ""
        self.audioMediaConverter_au = ""
        self.audioMediaConverter_mp3 = ""
        self.audioMediaConverter_wav = ""
        self.ffmpegPath = ""
        self.mediaProfilePath = self.exePath.dirname()/'mediaprofiles'
        
        # likewise, a canonical (English) names of iDevices not to show in the
        # iDevice pane but, contrary to the hiddens, these are ones that the 
        # configuration can specify to turn ON:
        self.deprecatediDevices = [ "flash with text", "flash movie", "mp3", \
                                    "attachment"]
        # by default, only allow embedding of media types for which a 
        # browser plugin is found:
        self.assumeMediaPlugins = False;
        # Let our children override our defaults depending
        # on the OS that we're running on
        self._overrideDefaultVals()
        # Try to make the defaults a little intelligent
        # Under devel trees, webui is the default webdir
        self.webDir = Path(self.webDir)
        if not (self.webDir/'scripts').isdir() \
           and (self.webDir/'webui').isdir():
            self.webDir /= 'webui'
        self.jsDir = Path(self.jsDir)
        if not (self.jsDir/'scripts').isdir() \
           and (self.jsDir/'jsui').isdir():
            self.jsDir /= 'jsui'
        # Find where the config file will be saved
        self.__setConfigPath()
        # Fill in any undefined config options with our defaults
        self._writeDefaultConfigFile()
        # Now we are ready to serve the application
        self.loadSettings()
        self.setupLogging()
        self.loadLocales()
        self.loadStyles()



    def _overrideDefaultVals(self):
        """
        Override this to override the
        default config values
        """

    def _getConfigPathOptions(self):
        """
        Override this to give a list of
        possible config filenames
        in order of preference
        """
        return ['exe.conf']


    def _writeDefaultConfigFile(self):
        """
        [Over]writes 'self.configPath' with a default config file 
        (auto write is on so we don't need to write the file at the end)
        """
        if not G.application.portable:
            for sectionName, optionNames in self.optionNames.items():
                for optionName in optionNames:
                    defaultVal = getattr(self, optionName)
                    self.configParser.setdefault(sectionName, 
                                             optionName, 
                                             defaultVal)
                    # Logging can't really be changed from inside the program at the moment...
            self.configParser.setdefault('logging', 'root', 'INFO')


    def __setConfigPath(self):
        """
        sets self.configPath to the filename of the config file that we'll
        use.
        In descendant classes set self.configFileOptions to a list
        of directories where the configDir should be in order of preference.
        If no config files can be found in these dirs, it will
        force creation of the config file in the top dir
        """
        # If there's an EXECONF environment variable, use it
        self.configPath = None
        configFileOptions = map(Path, self._getConfigPathOptions())
        if "EXECONF" in os.environ:
            envconf = Path(os.environ["EXECONF"])
            if envconf.isfile():
                self.configPath = os.environ["EXECONF"]
        # Otherwise find the most appropriate existing file
        if self.configPath is None:
            for confPath in configFileOptions:
                if confPath.isfile():
                    self.configPath = confPath
                    break
            else:
                # If no config files exist, create and use the
                # first one on the list
                self.configPath = configFileOptions[0]
                folder = self.configPath.abspath().dirname()
                if not folder.exists():
                    folder.makedirs()
                self.configPath.touch()
        # Now make our configParser
        self.configParser.read(self.configPath)
        self.configParser.autoWrite = True


    def upgradeFile(self):
        """
        Called before loading the config file,
        removes or upgrades any old settings.
        """
        if self.configParser.has_section('system'):
            system = self.configParser.system
            if system.has_option('appDataDir'):
                # Older config files had configDir stored as appDataDir
                self.configDir = Path(system.appDataDir)
                self.stylesDir =Path(self.configDir)/'style'
                # We'll just upgrade their config file for them for now...
                system.configDir = self.configDir
                system.stylesDir =Path(self.configDir)/'style'
                del system.appDataDir
                
                self.audioMediaConverter_au = system.audioMediaConverter_au
                self.audioMediaConverter_wav = system.audioMediaConverter_wav
                self.videoMediaConverter_ogv = system.videoMediaConverter_ogv
                self.videoMediaConverter_3gp = system.videoMediaConverter_3gp
                self.videoMediaConverter_avi = system.videoMediaConverter_avi
                self.videoMediaConverter_mpg = system.videoMediaConverter_mpg
                self.audioMediaConverter_ogg = system.audioMediaConverter_ogg
                self.audioMediaConverter_mp3 = system.audioMediaConverter_mp3
                self.ffmpegPath = system.ffmpegPath
            
            self.mediaProfilePath = system.mediaProfilePath
                
            if system.has_option('greDir'):
                # No longer used, system should automatically support
                del system.greDir


    def loadSettings(self):
        """
        Loads the settings from the exe.conf file.
        Overrides the defaults set in __init__
        """
        # Set up the parser so that if a certain value is not in the config
        # file, it will use the value from our default values
        def defVal(dummy, option):
            """If something is not in the config file, just use the default in
            'self'"""
            return getattr(self, option)
        self.configParser.defaultValue = defVal
        self.upgradeFile()
        # System Section
        if self.configParser.has_section('system'):
            system = self.configParser.system

            
            self.port           = int(system.port)
            self.browser        = None if system.browser == u"None" else system.browser
            
            
            if not G.application.portable:
                self.dataDir        = Path(system.dataDir)
                self.configDir      = Path(system.configDir)
                self.webDir         = Path(system.webDir)
                self.stylesDir      = Path(self.configDir)/'style'
                self.jsDir          = Path(system.jsDir)
            else:
                self.stylesDir      = Path(self.webDir/'style').abspath()
            
            self.assumeMediaPlugins = False;
            if self.configParser.has_option('system', \
                    'assumeMediaPlugins'):
               value = system.assumeMediaPlugins.strip().lower()
               if value == "1" or value == "yes" or value == "true" or \
                   value == "on":
                       self.assumeMediaPlugins = True;

        # If the dataDir points to some other dir, fix it
        if not self.dataDir.isdir():
            self.dataDir = tempfile.gettempdir()
        # make the webDir absolute, to hide path joins of relative paths
        self.webDir = self.webDir.expand().abspath()
        # If the configDir doesn't exist (as it may be a default setting with a
        # new installation) create it
        if not self.configDir.exists():
            self.configDir.mkdir()
		
        if not G.application.standalone: 
             #FM: Copy styles         
            if not os.path.exists(self.stylesDir) or not os.listdir(self.stylesDir):
                self.copyStyles() 
            else:
                self.updateStyles()                      
        else:
            if G.application.portable:
                if os.name == 'posix': 
                    self.stylesDir      = Path(self.webDir/'..'/'..'/'..'/'style')
                else: 
                    self.stylesDir      = Path(self.webDir/'..'/'style')
                if not os.path.exists(self.stylesDir) or not os.listdir(self.stylesDir): 
                    self.copyStyles()
            else:
                self.stylesDir     = Path(self.webDir/'style').abspath()
            
               
        # Get the list of recently opened projects
        self.recentProjects = []
        if self.configParser.has_section('recent_projects'):
            recentProjectsSection = self.configParser.recent_projects
            # recentProjectsSection.items() is in the wrong order, keys are alright.
            # Sorting list by key before adding to self.recentProjects, to avoid wrong ordering
            # in Recent Projects menu list
            recentProjectsItems = recentProjectsSection.items();
            recentProjectsItems.sort()
            for key, path in recentProjectsItems:
                self.recentProjects.append(path)
                
        # Load the list of "hidden" iDevices
        self.hiddeniDevices = []
        if self.configParser.has_section('idevices'):
            idevicesSection = self.configParser.idevices
            for key,value in idevicesSection.items():
                # emulate standard library's getboolean()
                value = value.strip().lower()
                if value == "0" or value == "no" or value == "false" or \
                        value == "off":
                    self.hiddeniDevices.append(key.lower())

        #self.deprecatediDevices = [ "flash with text", "flash movie", ...]
        # and UN-Load from the list of "deprecated" iDevices
        if self.configParser.has_section('deprecated'):
            deprecatedSection = self.configParser.deprecated
            for key,value in deprecatedSection.items():
                # emulate standard library's getboolean()
                value = value.strip().lower()
                if value == "1" or value == "yes" or value == "true" or \
                        value == "on":
                    if key.lower() in self.deprecatediDevices:
                        self.deprecatediDevices.remove(key.lower())

        # Load the "user" section
        if self.configParser.has_section('user'):
            if self.configParser.user.has_option('editorMode'):
                self.editorMode = self.configParser.user.editorMode
            if self.configParser.user.has_option('docType'):
                self.docType = self.configParser.user.docType
                common.setExportDocType(self.configParser.user.docType)
            if self.configParser.user.has_option('defaultStyle'):
                self.defaultStyle= self.configParser.user.defaultStyle
            if self.configParser.user.has_option('styleSecureMode'):
                self.styleSecureMode= self.configParser.user.styleSecureMode
            if self.configParser.user.has_option('internalAnchors'):
                self.internalAnchors = self.configParser.user.internalAnchors
            if self.configParser.user.has_option('lastDir'):
                self.lastDir = self.configParser.user.lastDir
            if self.configParser.user.has_option('showPreferencesOnStart'):
                self.showPreferencesOnStart = self.configParser.user.showPreferencesOnStart
            if self.configParser.user.has_option('showIdevicesGrouped'):
                self.showIdevicesGrouped = self.configParser.user.showIdevicesGrouped
            if self.configParser.user.has_option('locale'):
                self.locale = self.configParser.user.locale
                return
        self.locale = chooseDefaultLocale(self.localeDir)

    def onWrite(self, configParser):
        """
        Called just before the config file is written.
        We use it to fill out any settings that are stored here and 
        not in the config parser itself
        """
        # Recent projects
        self.configParser.delete('recent_projects')
        recentProjectsSection = self.configParser.addSection('recent_projects')
        for num, path in enumerate(self.recentProjects):
            recentProjectsSection[str(num)] = path

    def setupLogging(self):
        """
        setup logging file
        """
        try:
            hdlr = RotatingFileHandler(self.configDir/'exe.log', 'a', 
                                       500000, 10)
            hdlr.doRollover()
        except OSError:
            # ignore the error we get if the log file is logged
            hdlr = logging.FileHandler(self.configDir/'exe.log')

        format = "%(asctime)s %(name)s %(levelname)s %(message)s"
        log    = logging.getLogger()
        hdlr.setFormatter(logging.Formatter(format))
        log.addHandler(hdlr)

        loggingLevels = {"DEBUG"    : logging.DEBUG,
                         "INFO"     : logging.INFO,
                         "WARNING"  : logging.WARNING,
                         "ERROR"    : logging.ERROR,
                         "CRITICAL" : logging.CRITICAL }

    
        if self.configParser.has_section('logging'):
            for logger, level in self.configParser._sections["logging"].items():
                if logger == "root":
                    logging.getLogger().setLevel(loggingLevels[level])
                else:
                    logging.getLogger(logger).setLevel(loggingLevels[level])
        if not G.application.portable:
            log.info("************** eXe logging started **************")
            log.info("version     = %s" % version.version)
            log.info("configPath  = %s" % self.configPath)
            log.info("exePath     = %s" % self.exePath)
            log.info("libPath     = %s" % Path(twisted.__path__[0]).splitpath()[0])
            log.info("browser     = %s" % self.browser)
            log.info("webDir      = %s" % self.webDir)
            log.info("jsDir       = %s" % self.jsDir)
            log.info("localeDir   = %s" % self.localeDir)
            log.info("port        = %d" % self.port)
            log.info("dataDir     = %s" % self.dataDir)
            log.info("configDir   = %s" % self.configDir)
            log.info("locale      = %s" % self.locale)
            log.info("internalAnchors = %s" % self.internalAnchors)
                    

    def loadStyles(self):
        """
        Scans the eXe style directory and builds a list of styles
        """
        self.styleStore = StyleStore(self)
        listStyles = self.styleStore.getStyles()
        for style in listStyles:
            self.styles.append(style)
            #print style
            
    def copyStyles(self):
        bkstyle=self.webDir/'style'
        dststyle=self.stylesDir
        if os.path.exists(bkstyle):            
            if os.path.exists(dststyle) and not os.listdir(self.stylesDir): shutil.rmtree(dststyle)                 
            shutil.copytree(bkstyle,dststyle )
            
    def updateStyles(self):
        bkstyle=self.webDir/'style'
        dststyle=self.stylesDir
        if os.stat(bkstyle).st_mtime - os.stat(dststyle).st_mtime > 1:
            for name in os.listdir(bkstyle):
                bksdirstyle=os.path.join(bkstyle, name)
                dstdirstyle=os.path.join(dststyle, name)
                if os.path.isdir(bksdirstyle):
                    if os.path.exists(dstdirstyle):shutil.rmtree(dstdirstyle)
                    shutil.copytree(bksdirstyle, dstdirstyle)
                else:
                    shutil.copy(bksdirstyle, dstdirstyle)                    
                    

    def loadLocales(self):
        """
        Scans the eXe locale directory and builds a list of locales
        """
        log = logging.getLogger()
        log.debug("loadLocales")
        gettext.install('exe', self.localeDir, True)
        self.locales = {}
        for subDir in self.localeDir.dirs():
            if (subDir/'LC_MESSAGES'/'exe.mo').exists():
                self.locales[subDir.basename()] = \
                    gettext.translation('exe', 
                                        self.localeDir, 
                                        languages=[str(subDir.basename())])
                if subDir.basename() == self.locale:
                    locale = subDir.basename()
                    log.debug(" loading locale %s" % locale)
                    self.locales[locale].install(unicode=True)
                    __builtins__['c_'] = lambda s: self.locales[locale].ugettext(s) if s else s



# ===========================================================================
