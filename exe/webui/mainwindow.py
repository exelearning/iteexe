#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
#
# This module is for the TwiSteD web server.
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
Browser module
"""

import os
import sys
import shutil
import webbrowser
from exe.engine.path              import Path
from exe.export.scormexport       import ScormExport
from exe.export.imsexport         import IMSExport
from exe.export.websiteexport     import WebsiteExport
from exe.export.singlepageexport  import SinglePageExport
from exe.engine                   import version
import gtk
import gtkmozembed

import logging
log = logging.getLogger(__name__)

class MainWindow(gtk.Window):
    """
    Main window class
    """
    def __init__(self, application, packageName):
        """
        Initialize
        """
        self.application = application
        self.config      = application.config
        self.url         = "http://localhost:%d" % self.config.port
        self.packageName = packageName

        gtkmozembed.gtk_moz_embed_set_comp_path(self.config.greDir)

        if sys.platform[:3] == u"win":
            profileDir = self.config.webDir
            profile    = "win-profile"
        else:
            profileDir = Path(os.environ["HOME"])/'.exe'
            profile    = "linux-profile"
            self.createProfile(self.config)

        log.info(u"profileDir "+profileDir+u" profile "+profile)
        print u"profileDir "+profileDir+u" profile "+profile
        gtkmozembed.gtk_moz_embed_set_profile_path(profileDir, profile)

        gtk.Window.__init__(self)
        self.connect("delete-event", self.quit)
        self.set_title("eXe version "+version.release)
#        iconFile = self.config.webDir / "exe_icon.ico"
        iconFile = self.config.webDir / "mr_x.gif"
        self.set_icon(gtk.gdk.pixbuf_new_from_file(iconFile))
        self.set_size_request(800, 700)

        # VBox
        self.vbox = gtk.VBox()
        self.add(self.vbox)

        # Menu 
        # TODO think about changing to gtk.UIManager
        menuItems = [
            # path                  key   callback      actn type
            (_("/_File"),             None,         None, 0, "<Branch>" ),
            (_("/File/_New"),         "<control>N", self.newFile, 0, None ),
            (_("/File/_Open"),        "<control>O", self.openFile, 0, None ),
            (_("/File/sep1"),         None,         None, 0, "<Separator>" ),
            (_("/File/_Save"),        "<control>S", self.saveFile, 0, None ),
            (_("/File/Save _As"),     None,         self.saveFileAs, 0, None ),
            (_("/File/sep2"),         None,         None, 0, "<Separator>" ),
            (_("/File/_Export"),      None, None,         0, "<Branch>" ),
            (_("/File/Export/_SCORM 1.2"), None, self.exportScorm, 
                                                        0, None ),
            (_("/File/Export/IMS Content Package"), None, self.exportIms, 
                                                        0, None ),
            (_("/File/Export/Web Site"), "<control>W", self.exportWebsite, 
                                                        0, None ),
            (_("/File/Export/Single Page"), None, self.exportSinglePage, 
                                                        0, None ),
            (_("/File/sep3"),         None,         None, 0, "<Separator>" ),
            (_("/File/Quit"),         "<control>Q", gtk.main_quit, 0, None ),

            (_("/_Tools"),            None, None,         0, "<Branch>" ),
            (_("/Tools/iDevice Editor"),     None, self.editorTool, 0, None),

            (_("/_Styles"),           None, None,         0, "<Branch>" ),
            ] 
        for i, style in enumerate(self.config.styles):
            menuItems += [(_("/Styles/")+style, 
                           None, 
                           self.changeStyle, 
                           i,
                           None), ]
        menuItems += [
            (_("/_View"),             None, None,         0, "<Branch>" ),
            (_("/View/Refresh"),      None, self.refreshView, 0, None)]
        if log.getEffectiveLevel() == logging.DEBUG:
            menuItems += [
            (_("/_Debug"),            None, None,         0, "<Branch>" ),
            (_("/Debug/View _HTML"),  None, self.viewHtml,0, None)]

        menuItems += [
            (_("/_Help"),             None, None,         0, "<LastBranch>" ),
            (_("/_Help/Tutorial"),    None, self.loadTutorial, 0, None),
            (_("/_Help/About"),       None, self.about,    0, None),
            ]
        accelGrp = gtk.AccelGroup()
        self.itemFactory = gtk.ItemFactory(gtk.MenuBar, "<main>", accelGrp)
        self.itemFactory.create_items(tuple(menuItems))
        self.add_accel_group(accelGrp)
        self.menu = self.itemFactory.get_widget("<main>")
        self.vbox.pack_start(self.menu,    expand=False)

        # Browser
        self.browser = gtkmozembed.MozEmbed()
        self.browser.connect("location", self.newLocation, "location")
        self.browser.load_url(self.url+"/"+self.packageName)
        self.vbox.pack_start(self.browser)

        # Status Bar
        self.statusbar = gtk.Statusbar()
        self.statusbar.set_has_resize_grip(True)
        self.vbox.pack_end(self.statusbar, expand=False)
        self.statusContext = self.statusbar.get_context_id("MainWindow")


    def createProfile(self, config):
        """
        Create a profile for the user to use based on the one in /usr/share/exe
        """
        appDir  = Path(os.environ["HOME"])/'.exe'
        log.info("Creating FireFox profile copied from"+
                 config.webDir+"/linux-profile to "+appDir+"/linux-profile")
        if not appDir.exists():
            appDir.mkdir()
        shutil.rmtree(appDir/"linux-profile", True)
        (config.webDir/'linux-profile').copytree(appDir/'linux-profile')


    def newFile(self, *dummy):
        """
        Create a new package
        TODO: check if the package was dirty
        """
        self.packageName = ""
        self.browser.load_url(self.url)

        
    def openFile(self, *dummy):
        """
        load a new package
        """
        chooser = gtk.FileChooserDialog("Select the package to open", 
                                        self,
                                        gtk.FILE_CHOOSER_ACTION_OPEN,
                                        (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                         gtk.STOCK_OK,     gtk.RESPONSE_OK))
        response = chooser.run()

        if response == gtk.RESPONSE_OK:
            filename = chooser.get_filename()
            package  = self.application.packageStore.loadPackage(filename)
            self.application.server.root.bindNewPackage(package)
            self.browser.load_url(self.url+"/"+package.name)

        chooser.destroy()
            

    def saveFile(self, *dummy):
        """
        save the current package
        """
        assert self.packageName
        package = self.application.packageStore.getPackage(self.packageName)

        if package.filename:
            package.save()
        else:
            self.saveFileAs()


    def saveFileAs(self, *dummy):
        """
        save the current package with a new name
        """
        assert self.packageName
        package = self.application.packageStore.getPackage(self.packageName)

        chooser = gtk.FileChooserDialog("Save the package as", 
                                        self,
                                        gtk.FILE_CHOOSER_ACTION_SAVE,
                                        (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                         gtk.STOCK_OK,     gtk.RESPONSE_OK))
        response = chooser.run()

        if response == gtk.RESPONSE_OK:
            filename = chooser.get_filename()
            # Add the extension if its not already there
            if not filename.lower().endswith('.elp'):
                filename += '.elp'
            package.save(filename)
            self.browser.load_url(self.url+"/"+package.name)

            if package.name != self.packageName:
                # Redirect the client if the package name has changed
                self.application.server.root.bindNewPackage(package)
                self.browser.load_url(self.url+"/"+package.name)

        chooser.destroy()


    def exportScorm(self, *dummy):
        """
        Export a SCORM package
        """
        assert self.packageName
        package    = self.application.packageStore.getPackage(self.packageName)
        webDir     = Path(self.config.webDir)
        stylesDir  = webDir.joinpath('style', package.style)

        chooser = gtk.FileChooserDialog("Export the package as", 
                                        self,
                                        gtk.FILE_CHOOSER_ACTION_SAVE,
                                        (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                         gtk.STOCK_OK,     gtk.RESPONSE_OK))
        response = chooser.run()

        if response == gtk.RESPONSE_OK:
            filename = chooser.get_filename()
            # Add the extension if its not already there
            if not filename.lower().endswith('.zip'):
                filename += '.zip'
            # Remove any old existing files
            filename = Path(filename)
            if filename.exists(): 
                filename.remove()
            scormExport = ScormExport(self.config, stylesDir, filename)
            scormExport.export(package)

            if package.name != self.packageName:
                # Redirect the client if the package name has changed
                self.application.server.root.bindNewPackage(package)
                self.browser.load_url(self.url+"/"+package.name)

        chooser.destroy()


    def exportIms(self, *dummy):
        """
        export as an IMS package
        """
        assert self.packageName
        package    = self.application.packageStore.getPackage(self.packageName)
        webDir     = Path(self.config.webDir)
        stylesDir  = webDir.joinpath('style', package.style)

        chooser = gtk.FileChooserDialog("Export the package as", 
                                        self,
                                        gtk.FILE_CHOOSER_ACTION_SAVE,
                                        (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                         gtk.STOCK_OK,     gtk.RESPONSE_OK))
        response = chooser.run()

        if response == gtk.RESPONSE_OK:
            filename = chooser.get_filename()
            # Add the extension if its not already there
            if not filename.lower().endswith('.zip'):
                filename += '.zip'
            # Remove any old existing files
            filename = Path(filename)
            if filename.exists(): 
                filename.remove()
            imsExport = IMSExport(self.config, stylesDir, filename)
            imsExport.export(package)

            if package.name != self.packageName:
                # Redirect the client if the package name has changed
                self.application.server.root.bindNewPackage(package)
                self.browser.load_url(self.url+"/"+package.name)

        chooser.destroy()


    def exportWebsite(self, *dummy):
        """
        export as a self contained website
        """
        assert self.packageName
        package    = self.application.packageStore.getPackage(self.packageName)
        webDir     = Path(self.config.webDir)
        stylesDir  = webDir/'style'/package.style
        imagesDir  = webDir/'images'
        scriptsDir = webDir/'scripts'

        chooser = gtk.FileChooserDialog("Export the package as", 
                                        self,
                                        gtk.FILE_CHOOSER_ACTION_CREATE_FOLDER,
                                        (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                         gtk.STOCK_OK,     gtk.RESPONSE_OK))
        response = chooser.run()

        if response == gtk.RESPONSE_OK:
            filename = chooser.get_filename()
            # TODO!!! filename should be called exportDir???
            # filename is a directory where we will export the website to
            # We assume that the user knows what they are doing
            # and don't check if the directory is already full or not
            # and we just overwrite what's already there
            filename = Path(filename)
            # Append the package name to the folder path if necessary
            if not filename.exists():
                filename.makedirs()
            elif not filename.isdir():
                log.error("Couldn't export web page: "+
                          "Filename %s is a file, cannot replace it" % filename)
                return
            else:
                # Wipe it out
                filename.rmtree()
                filename.mkdir()
            # Now do the export
            websiteExport = WebsiteExport(stylesDir, filename, 
                                          imagesDir, scriptsDir)
            websiteExport.export(package)
            # Show the newly exported web site in a new window
            webbrowser.open(filename/"index.html")

        chooser.destroy()


    def exportSinglePage(self, *dummy):
        """
        export as a self contained website
        """
        assert self.packageName
        package    = self.application.packageStore.getPackage(self.packageName)
        webDir     = Path(self.config.webDir)
        stylesDir  = webDir/'style'/package.style
        imagesDir  = webDir/'images'
        scriptsDir = webDir/'scripts'

        chooser = gtk.FileChooserDialog("Export the package as", 
                                        self,
                                        gtk.FILE_CHOOSER_ACTION_CREATE_FOLDER,
                                        (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                         gtk.STOCK_OK,     gtk.RESPONSE_OK))
        response = chooser.run()

        if response == gtk.RESPONSE_OK:
            filename = chooser.get_filename()
            # filename is a directory where we will export the website to
            # We assume that the user knows what they are doing
            # and don't check if the directory is already full or not
            # and we just overwrite what's already there
            filename = Path(filename)
            # Append the package name to the folder path if necessary
            if not filename.exists():
                filename.makedirs()
            elif not filename.isdir():
                log.error("Couldn't export web page: "+
                          "Filename %s is a file, cannot replace it" % filename)
                return
            else:
                # Wipe it out
                filename.rmtree()
                filename.mkdir()
            # Now do the export
            singlePageExport = SinglePageExport(stylesDir, filename, 
                                                imagesDir, scriptsDir)
            singlePageExport.export(package)
            # Show the newly exported web site in a new window
            webbrowser.open(filename/"index.html")

        chooser.destroy()


    def editorTool(self, *dummy):
        """
        Show the editor HTML window
        """
        editorWindow = gtk.Window()
        editorWindow.set_size_request(700, 700)
        browser = gtkmozembed.MozEmbed()
        browser.load_url(self.url+"/editor")
        editorWindow.add(browser)
        editorWindow.show_all()

    def changeStyle(self, action, dummy):
        """
        Change the style to that chosen
        """
        assert self.packageName
        package = self.application.packageStore.getPackage(self.packageName)
        package.style = self.config.styles[action]
        self.browser.load_url(self.url+"/"+self.packageName)


    def refreshView(self, *dummy):
        """
        reload the current page
        """
        assert self.packageName
        self.browser.load_url(self.url+"/"+self.packageName)
 

    def viewHtml(self, *dummy):
        """
        Shows the HTML in gvim
        """
        package = self.application.packageStore.getPackage(self.packageName)
        redirectPage = self.application.server.root
        authoringPage = redirectPage.renderChildren[package.name].authoringPage
        open('tmp.html', 'w').write(authoringPage.render_GET())
        os.system('gvim tmp.html')


    def about(self, *dummy):
        """
        Show the about XUL window
        """
        aboutWindow = gtk.Window()
        aboutWindow.set_size_request(320, 600)
        browser = gtkmozembed.MozEmbed()
        browser.load_url(self.url+"/about")
        aboutWindow.add(browser)
        aboutWindow.show_all()


    def loadTutorial(self, *dummy):
        """Load the tutorial"""
        try:
            filename = self.config.webDir/"eXe-tutorial.elp"
            package  = self.application.packageStore.loadPackage(filename)
            self.application.server.root.bindNewPackage(package)
            self.browser.load_url(self.url+"/"+package.name)
        except Exception, exc:
            log.error(u'Error loading package "%s": %s' % \
                      (filename, unicode(exc)))

    def newLocation(self, *dummy):
        """
        Note we've changed location
        """
        self.packageName = self.browser.get_location().split('/')[3]
        self.statusbar.pop(self.statusContext)
        self.statusbar.push(self.statusContext, self.packageName)


    def quit(self, *dummy):
        """
        Quit out of the application
        """
        gtk.main_quit()
        return False


