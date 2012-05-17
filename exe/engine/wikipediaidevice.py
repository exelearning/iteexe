# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2008 eXe Project, http://eXeLearning.org/
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
A Wikipedia Idevice is one built from a Wikipedia article.
"""

import re
from exe.engine.beautifulsoup import BeautifulSoup
from exe.engine.idevice       import Idevice
from exe.engine.field         import TextAreaField
from exe.engine.translate     import lateTranslate
from exe.engine.path          import Path, TempDirPath
from exe.engine.resource      import Resource

import urllib
class UrlOpener(urllib.FancyURLopener):
    """
    Set a distinctive User-Agent, so Wikipedia.org knows we're not spammers
    """
    version = "eXe/exe@exelearning.org"
urllib._urlopener = UrlOpener()

import logging
log = logging.getLogger(__name__)

# ===========================================================================
class WikipediaIdevice(Idevice):
    """
    A Wikipedia Idevice is one built from a Wikipedia article.
    """
    persistenceVersion = 8

    def __init__(self, defaultSite):
        Idevice.__init__(self, x_(u"Wiki Article"), 
                         x_(u"University of Auckland"), 
                         x_(u"""<p>The Wikipedia iDevice allows you to locate 
existing content from within Wikipedia and download this content into your eXe 
resource. The Wikipedia Article iDevice takes a snapshot copy of the article 
content. Changes in Wikipedia will not automatically update individual snapshot 
copies in eXe, a fresh copy of the article will need to be taken. Likewise, 
changes made in eXe will not be updated in Wikipedia. </p> <p>Wikipedia content 
is covered by the GNU free documentation license.</p>"""), 
                         u"", u"")
        self.emphasis         = Idevice.NoEmphasis
        self.articleName      = u""
        self.article          = TextAreaField(x_(u"Article"))
        self.article.idevice  = self
        self.images           = {}
        self.site             = defaultSite
        self.icon             = u"inter"
        self.systemResources += ["fdl.html"]
        self._langInstruc      = x_(u"""Select the appropriate language version 
of Wikipedia to search and enter search term.""")
        self._searchInstruc    = x_("""Enter a phrase or term you wish to search 
within Wikipedia.""")
        self.ownUrl               = ""
        
    # Properties
    langInstruc      = lateTranslate('langInstruc')
    searchInstruc    = lateTranslate('searchInstruc')
   
    def loadArticle(self, name):
        """
        Load the article from Wikipedia
        """
        self.articleName = name
        url = ""
        name = urllib.quote(name.replace(" ", "_").encode('utf-8'))
        try:
            url  = (self.site or self.ownUrl)
            if not url.endswith('/') and name <> '': url += '/'
            if '://' not in url: url = 'http://' + url
            url += name
            net  = urllib.urlopen(url)
            page = net.read()
            net.close()
        except IOError, error:
            log.warning(unicode(error))
            self.article.content = _(u"Unable to download from %s <br/>Please check the spelling and connection and try again.") % url
            self.article.content_w_resourcePaths = self.article.content
            self.article.content_wo_resourcePaths = self.article.content
            return

        page = unicode(page, "utf8")
        # FIXME avoid problems with numeric entities in attributes
        page = page.replace(u'&#160;', u'&nbsp;')
        # avoidParserProblems is set to False because BeautifulSoup's
        # cleanup was causing a "concatenating Null+Str" error,
        # and Wikipedia's HTML doesn't need cleaning up.
        # BeautifulSoup is faster this way too.
        soup = BeautifulSoup(page, False)
        content = soup.first('div', {'id': "content"})

        # remove the wiktionary, wikimedia commons, and categories boxes
        #  and the protected icon and the needs citations box
        if content:
            infoboxes = content.findAll('div',
                    {'class' : 'infobox sisterproject'})
            [infobox.extract() for infobox in infoboxes]
            catboxes = content.findAll('div', {'id' : 'catlinks'})
            [catbox.extract() for catbox in catboxes]
            amboxes = content.findAll('table',
                    {'class' : re.compile(r'.*\bambox\b.*')})
            [ambox.extract() for ambox in amboxes]
            protecteds = content.findAll('div', {'id' : 'protected-icon'})
            [protected.extract() for protected in protecteds]
        else:
            content = soup.first('body')

        if not content:
            log.error("no content")
            self.article.content = _(u"Unable to download from %s <br/>Please check the spelling and connection and try again.") % url
            # set the other elements as well
            self.article.content_w_resourcePaths = self.article.content
            self.article.content_wo_resourcePaths = self.article.content
            return

        # clear out any old images
        while self.userResources:
            self.userResources[0].delete()
        self.images        = {}

        # Download the images
        bits = url.split('/')
        netloc = '%s//%s' % (bits[0], bits[2])
        path = '/'.join(bits[3:-1])
        tmpDir = TempDirPath()
        for imageTag in content.fetch('img'):
            imageSrc  = unicode(imageTag['src'])
            imageName = imageSrc.split('/')[-1]
            imageName = imageName.replace('&gt;', '>')
            imageName = imageName.replace('&lt;', '<')
            imageName = imageName.replace('&quot;', '"')
            imageName = imageName.replace('&nbsp;', '')
            imageName = imageName.replace('%2C', ',')
            imageName = imageName.replace('%22', '"')
            imageName = imageName.replace('%28', '(')
            imageName = imageName.replace('%29', ')')
            # Search if we've already got this image
            if imageName not in self.images:
                if not imageSrc.startswith("http://"):
                    if imageSrc.startswith("/"):
                        # imageSrc = netloc + imageSrc
                        imageSrc = bits[0] + imageSrc
                    else:
                        imageSrc = '%s/%s/%s' % (netloc, path, imageSrc)
                urllib.urlretrieve(imageSrc, tmpDir/imageName)
                new_resource = Resource(self, tmpDir/imageName)
                if new_resource._storageName != imageName:
                    # looks like it was changed due to a possible conflict,
                    # so reset the imageName accordingly for the content:
                    imageName = new_resource._storageName
                self.images[imageName] = True
            # We have to use absolute URLs if we want the images to
            # show up in edit mode inside FCKEditor
            imageTag['src'] = (u"/" + self.parentNode.package.name + u"/resources/" + imageName)
            # imageTag['src'] = (u"/" + self.parentNode.package.name + u"/" + imageName)
        self.article.content = self.reformatArticle(netloc, unicode(content))
        # now that these are supporting images, any direct manipulation
        # of the content field must also store this updated information
        # into the other corresponding fields of TextAreaField:
        # (perhaps eventually a property should be made for TextAreaField 
        #  such that these extra set's are not necessary, but for now, here:)
        self.article.content_w_resourcePaths = self.article.content
        self.article.content_wo_resourcePaths = self.article.content
        
        # Include wikipedia's license document as resourceFile in self.userResources: 
        from exe import globals
        licenseFile = globals.application.config.webDir/'templates/fdl.html'
        license = Resource(self, licenseFile)
        self.userResources = []
        self.userResources.append(license)


    def reformatArticle(self, netloc, content):
        """
        Changes links, etc
        """
        content = re.sub(r'href="/', r'href="%s/' % netloc, content)
        content = re.sub(r'<(span|div)\s+(id|class)="(editsection|jump-to-nav)".*?</\1>', '', content)
        #TODO Find a way to remove scripts without removing newlines
        content = content.replace("\n", " ")
        content = re.sub(r'<script.*?</script>', '', content)
        return content


    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'article') and hasattr(self.article, 'images'):
            for this_image in self.article.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.article

        # NOTE that WikipediaIdevices list their images 
        # in the idevice's .userResources, not in its .article.images...  
        # a slightly different (and earlier) approach to embedding images: 
        for this_image in self.userResources: 
            if this_resource == this_image: 
                return self.article
        
        return None

    def getRichTextFields(self):
        """
        Like getResourcesField(), a general helper to allow nodes to search 
        through all of their fields without having to know the specifics of each
        iDevice type.  
        """
        fields_list = []
        if hasattr(self, 'article'):
            fields_list.append(self.article)

        return fields_list


    def burstHTML(self, i):
        """
        takes a BeautifulSoup fragment (i) and bursts its contents to 
        import this idevice from a CommonCartridge export
        """
      # Wiki Article Idevice:
        # option title for Wikipedia, with mode emphasis:
        title = i.find(name='h2', attrs={'class' : 'iDeviceTitle' })
        if title is not None: 
            self.title = title.renderContents().decode('utf-8')
            self.emphasis=Idevice.SomeEmphasis

        wiki = i.find(name='div', attrs={'id' : re.compile('^ta') })
        self.article.content_wo_resourcePaths = \
                wiki.renderContents().decode('utf-8')
        # and add the LOCAL resource paths back in:
        self.article.content_w_resourcePaths = \
                self.article.MassageResourceDirsIntoContent( \
                    self.article.content_wo_resourcePaths)
        self.article.content = self.article.content_w_resourcePaths

        site = i.find(name='div', attrs={'class' : 'wiki_site' })
        if site is not None: 
            self.site = site.attrMap['value'].decode('utf-8')

        name = i.find(name='div', attrs={'class' : 'article_name' })
        if name is not None: 
            # WARNING: the following crashes on accented characters, eg:
            #  'ascii' codec can't encode character u'\xe8' in 
            #  position 11: ordinal not in range(128)
            self.articleName = name.attrMap['value'].decode('utf-8')

        own_url = i.find(name='div', attrs={'class' : 'own_url' })
        if own_url is not None: 
            self.own_url = own_url.attrMap['value'].decode('utf-8')

        
    def __getstate__(self):
        """
        Re-write the img URLs just in case the class name has changed
        """
        log.debug("in __getstate__ " + repr(self.parentNode))

        # need to check parentNode because __getstate__ is also called by 
        # deepcopy as well as Jelly.
        if self.parentNode:
            self.article.content = re.sub(r'/[^/]*?/', 
                                          u"/" + self.parentNode.package.name +
                                          u"/",
                                          self.article.content)
            #self.article.content = re.sub(r'/[^/]*?/resources/', 
            #                              u"/" + self.parentNode.package.name + 
            #                              u"/resources/", 
            #                              self.article.content)

        return Idevice.__getstate__(self)


    def delete(self):
        """
        Clear out any old images when this iDevice is deleted
        """
        self.images = {}
        Idevice.delete(self)

        
    def upgradeToVersion1(self):
        """
        Called to upgrade from 0.6 release
        """
        self.site        = _('http://en.wikipedia.org/')


    def upgradeToVersion2(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False
        

    def upgradeToVersion3(self):
        """
        Upgrades exe to v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._site = self.__dict__['site']


    def upgradeToVersion4(self):
        """
        Upgrades exe to v0.11... what was I thinking?
        """
        self.site = self.__dict__['_site']


    def upgradeToVersion5(self):
        """
        Upgrades exe to v0.11... forgot to change the icon
        """
        self.icon = u"inter"


    def upgradeToVersion6(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        self.systemResources += ["fdl.html"]
        if self.images and self.parentNode:
            for image in self.images:
                imageResource = Resource(self, Path(image))

    def upgradeToVersion7(self):
        """
        Upgrades to v0.12
        """
        self._langInstruc   = x_(u"""Select the appropriate language version 
of Wikipedia to search and enter search term.""")
        self._searchInstruc = x_("""Enter a phrase or term you wish to search 
within Wikipedia.""")
        
    def upgradeToVersion8(self):
        """
        Upgrades to v0.19
        """
        self.ownUrl = ""
# ===========================================================================
