# ===========================================================================
# eXe 
# Copyright 2010-2011, Pedro Pena Perez
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

import os
import mimetypes
from chardet import universaldetector
from chardet import latin1prober
import re
import sys
from exe.engine.beautifulsoup import BeautifulSoup, UnicodeDammit
from urllib import quote, unquote
from exe.engine.freetextidevice import FreeTextIdevice
from exe.engine.resource import Resource
from exe.engine.path import Path
import logging

log = logging.getLogger(__name__)

class FixedLatin1Prober(latin1prober.Latin1Prober):
    """La clase Latin1Prober baja a la mitad la confidencia para mejorar los resultados de
     otros probers. Dejamos la confidencia en su valor real."""
    def get_confidence(self):
        return latin1prober.Latin1Prober.get_confidence(self)*2

class FixedUniversalDetector(universaldetector.UniversalDetector):
    """Para usar FixedLatin1Prober"""
    def __init__(self):
        from chardet.mbcsgroupprober import MBCSGroupProber # multi-byte character sets
        from chardet.sbcsgroupprober import SBCSGroupProber # single-byte character sets
        universaldetector.UniversalDetector.__init__(self)
        self._mCharSetProbers = [MBCSGroupProber(), SBCSGroupProber(), FixedLatin1Prober()]

def detect(aBuf):
    """Autodetecta la codificacion de una cadena usando FixedUniversalDetector"""
    u = FixedUniversalDetector()
    u.reset()
    u.feed(aBuf)
    u.close()
    return u.result
    
def relpath(path, start):
    """Implementa os.path.relpath independientemente del sistema y arregla un fallo cuando start una unidad en windows"""
    if sys.platform[:3] == 'win':
        if not hasattr(os.path,'relpath'):
            r = nt_relpath(path,start).replace(os.sep,os.altsep)
        else:
            r = os.path.relpath(path, start).replace(os.sep,os.altsep)
        if os.path.splitdrive(start)[1] in ['',os.curdir,os.sep,os.sep + os.curdir]:
            r = r.replace(os.pardir + os.altsep,'')
        return r
    else:
        return os.path.relpath(path, start)

curdir = '.'
def nt_relpath(path, start=curdir):
    """Implementa os.path.relpath para Windows ya que en python 2.5 no esta implementada"""

    from ntpath import abspath, splitunc, sep, pardir, join
    
    if not path:
        raise ValueError("no path specified")
    start_list = abspath(start).split(sep)
    path_list = abspath(path).split(sep)
    if start_list[0].lower() != path_list[0].lower():
        unc_path, rest = splitunc(path)
        unc_start, rest = splitunc(start)
        if bool(unc_path) ^ bool(unc_start):
            raise ValueError("Cannot mix UNC and non-UNC paths (%s and %s)" % (path, start))
        else:
            raise ValueError("path is on drive %s, start on drive %s" % (path_list[0], start_list[0]))
    # Work out how much of the filepath is shared by start and path.
    for i in range(min(len(start_list), len(path_list))):
        if start_list[i].lower() != path_list[i].lower():
            break
    else:
        i += 1

    rel_list = [pardir] * (len(start_list)-i) + path_list[i:]
    if not rel_list:
        return curdir
    return join(*rel_list)

class Link:
    def __init__(self, url, relative, referrer, tag = None, key = None, match = None):
        self.url = url
        self.referrer = referrer
        self.tag = tag
        self.key = key
        self.relative = relative
        self.match = match
    def __repr__(self):
        if self.tag and self.tag.name:
            return "<%s %s=%s>" % (self.tag.name,self.key,str(self.url))
        else:
            return "<%s>" % (str(self.url))

class Url:
    def __init__(self, path, start='.'):
        self.path = path
        self.start = start
        self.relpath = relpath(self.path,self.start)
        parent = os.path.split(self.relpath)[0]
        self.parentpath = u"." if parent == u"" else parent
        self.basename = os.path.basename(self.relpath)
        if os.path.isdir(self.path):
            self.type = 'dir'
        elif os.path.isfile(self.path):
            self.type = 'file'
        self.mime, self.dataencoding = mimetypes.guess_type(self.path)
        self.links = []
        self.plinks = []
        self.rlinks = set()
        self.soup = None
        self.content = None
        self.contentUpdated = []
        self.l = unquote(self.relpath)
        self.absl = self.start + os.path.sep + self.l
    def setSoup(self,soup):
        if self.mime == 'text/html':
            self.soup = soup
    def getSoup(self):
        return self.soup
    def setContent(self,content,encoding):
        self.content = content
        self.contentEncoding = encoding
    def getContent(self):
        return self.content
    def createNode(self,parent, name = None):
        self.node = parent.createChild()
        self.node.setTitle(name if name else self.basename)
    def createIdevice(self):
        self.idevice = FreeTextIdevice()
        self.idevice.edit = False
        self.node.addIdevice(self.idevice)
        return self.idevice
    def __str__(self):
        return self.relpath
    def __repr__(self):
        return self.relpath
    def addLink(self,link):
        self.links.append(link)
    def addPLink(self,link):
        self.plinks.append(link)
    def addRLink(self,link):
        self.rlinks.add(link)

class Resources:
    cancel = False
    @classmethod
    def cancelImport(cls):
        cls.cancel = True
        #TODO Deshacer todo lo que se lleve hecho
    def __init__(self, baseurl, node, client=None):
        self.baseurl = baseurl.decode(sys.getfilesystemencoding())
        self.node = node
        self.client = client
        self.numdirs = 0
        resources = {}
        resources['mimes'] = {}
        resources['urls'] = {}
        
        url = Url(self.baseurl, self.baseurl)
        url.createNode(node, 'Contenidos por directorio')
        resources['urls'][url.relpath] = url
        try:
            for root, dirs, files in self._safewalk(self.baseurl):
                if self.cancel:
                    return
                self.numdirs += 1
        except UnicodeDecodeError:
            raise
        i = 1
        for root, dirs, files in self._safewalk(self.baseurl):
            html = u""
            idevice = None
            if self.client:
                self.client.call('XHupdateImportProgressWindow','Analizando directorio %d de %d: %s' % (i, self.numdirs,root.encode(sys.getfilesystemencoding())))
            for dir in dirs:
                if self.cancel:
                    return
                path = root + os.path.sep + dir
                url = Url(path, self.baseurl)
                url.createNode(resources['urls'][url.parentpath].node)
                resources['urls'][url.relpath] = url
            for file in files:
                if self.cancel:
                    return
                path = root + os.path.sep + file
                url = Url(path, self.baseurl)
                parent = resources['urls'][url.parentpath]
                if not idevice:
                    idevice = parent.createIdevice()
                try:
                    p = Path(path)
                    p.setSalt(str(url))
                    r = Resource(idevice,p)
                except:
                    continue
                url.href = 'resources/%s' % (quote(r.storageName))
                html += u"<p><a href=%s>%s</p>\n" % (url.href,url.basename)
                resources['urls'][url.relpath] = url
                if url.mime in resources['mimes'].keys():
                    resources['mimes'][url.mime].append(url)
                else:
                    resources['mimes'][url.mime] = [ url ]
            if idevice:
                idevice.setContent(html)
            i += 1
        self.resources = resources
    def _safewalk(self, top):
        try:
            names = os.listdir(top)
        except error, err:
            return
    
        dirs, nondirs = [], []
        for name in names:
            try:
                name.encode(sys.getfilesystemencoding())
            except:
                return
            if os.path.isdir(os.path.join(top, name)):
                dirs.append(name)
            else:
                nondirs.append(name)
    
        yield top, dirs, nondirs
        for name in dirs:
            path = os.path.join(top, name)
            if not os.path.islink(path):
                for x in self._safewalk(path):
                    yield x
    def _computeRelpaths(self):
        i = 1
        for url in self.resources['urls'].values():
            if url.type == 'dir':
                if self.client:
                    self.client.call('XHupdateImportProgressWindow','Calculando rutas relativas para directorio %d de %d: %s' % (i, self.numdirs, url.relpath.encode(sys.getfilesystemencoding())))
                url.relpaths = []
                absd = ''.join([self.baseurl, os.path.sep, url.relpath])
                for link in self.resources['urls'].values():
                    if self.cancel:
                        return
                    if link.relpath.encode(sys.getfilesystemencoding()) == '.':
                        continue
                    rl = relpath(link.absl,absd)
                    url.relpaths.append((link.l,rl))
                i += 1
    def _computeLinks(self):
        self._computeRelpaths()
        htmls = self.resources['mimes']['text/html']
        total = len(htmls)
        i = 1
        for url in htmls:
            if self.cancel:
               return
            if self.client:
                self.client.call('XHupdateImportProgressWindow','Analizando etiquetas de fichero HTML %d de %d: %s' % (i, total, str(url)))
            content = open(url.path).read()
            encoding = detect(content)['encoding']
            ucontent = unicode(content,encoding)
            soup = BeautifulSoup(ucontent,fromEncoding=encoding)
            declaredHTMLEncoding = getattr(soup, 'declaredHTMLEncoding')
            if declaredHTMLEncoding:
                ucontent = UnicodeDammit(content,[declaredHTMLEncoding]).unicode
                encoding = declaredHTMLEncoding
            else:
                pass
            url.setContent(ucontent,encoding)
            url.setSoup(soup)
            if str(url) == 'introduccion4.htm':
                pass
            for tag in soup.findAll():
                if self.cancel:
                    return
                if not tag.attrs:
                    continue
                matches = []
                for key, value in tag.attrs:
                    if value == "":
                        continue
                    unq_value = unquote(value)
                    unq_low_value = unquote(value.lower())
                    for l, rl in self.resources['urls'][url.parentpath].relpaths:
                        low_rl = rl.lower()
                        if rl in unq_value:
                            L = Link(self.resources['urls'][l],rl,url,tag,key,rl)
                            matches.append(L)
                        elif low_rl in unq_value:
                            L = Link(self.resources['urls'][l],rl,url,tag,key,low_rl)
                            matches.append(L)
                        elif l in unq_value:
                            L = Link(self.resources['urls'][l],rl,url,tag,key,l)
                            matches.append(L)
                matches_final = []
                for l1 in matches:
                    matches_ = [ m for m in matches if m != l1 ]
                    found = False
                    for l2 in matches_:
                        if re.search(re.escape(l1.relative),l2.relative):
                            found = True
                    if not found:
                        matches_final.append(l1)
                if matches_final:
                    for match in matches_final:
                        url.addLink( match )
                        url.addRLink( str(match.url) )
            i += 1
        csss = self.resources['mimes']['text/css'] if 'text/css' in self.resources['mimes'].keys() else None
        csss_and_htmls = csss + htmls if csss else htmls
        total = len(csss_and_htmls)
        i = 1
        for url in csss_and_htmls:
            if self.cancel:
                return
            if url.mime == 'text/css':
                tipo = 'CSS'
            else:
                tipo = 'HTML'
            content = url.getContent()
            if not content:
                content = open(url.path).read()
                encoding = detect(content)['encoding']
                content = unicode(content,encoding)
                url.setContent(content,encoding)                
            if self.client:
                self.client.call('XHupdateImportProgressWindow','Analizando exhaustivamente fichero %s %d de %d: %s' % (tipo, i, total, str(url)))
            matches = []
            for l, rl in self.resources['urls'][url.parentpath].relpaths:
                low_rl = rl.lower()
                if rl in content:
                    L = Link(self.resources['urls'][l],rl,url,match=rl)
                    matches.append(L)
                elif low_rl in content:
                    L = Link(self.resources['urls'][l],rl,url,match=low_rl)
                    matches.append(L)                    
            matches_final = []
            for l1 in matches:
                matches_ = [ m for m in matches if m != l1 ]
                found = False
                for l2 in matches_:
                    if re.search(re.escape(l1.relative),l2.relative):
                        found = True
                if not found:
                    matches_final.append(l1)
            if matches_final:
                for match in matches_final:
                    if not [ link for link in url.links if link.relative == match.relative ]:
                        url.addLink( match )
                        url.addRLink( str(match.url) )
            i += 1
    def _computeDepths(self,url):
        from collections import deque
        q = deque()
        q.append(([url],0))
        while q:
            if self.cancel:
                return
            links, depth = q.pop()
            for link in links:
                if link in self.depths.keys():
                    self.depths[link] = depth if self.depths[link] > depth else self.depths[link]
                else:
                    self.depths[link] = depth
                if self.depths[link] < depth:
                    continue
                q.appendleft((self.resources['urls'][link].rlinks,depth + 1))
    def insertNode(self,urls=['index.html','index.htm']):
        if self.cancel:
            return
        for url in urls:
            if url not in self.resources['urls'].keys():
                continue
            else:
                self.depths = {}
                self._computeLinks()
                if self.cancel:
                    return
                if self.client:
                    self.client.call('XHupdateImportProgressWindow','Calculando profundidad de enlaces')
                self._computeDepths(url)
                if self.cancel:
                    return
                self._insertNode(None,url)
    def _guessName(self,url):
        return str(url)
        soup = url.getSoup()
        if soup.title:
            return str(soup.title.string)
        names = {}
        for link in url.plinks:
            if link.tag.contents and isinstance(link.tag.contents[0],unicode) and link.tag.contents[0].lstrip() != u"":
                if link.tag.contents[0] in names.keys():
                    names[link.tag.contents[0]] += 1
                else:
                    names[link.tag.contents[0]] = 1
        max = 0
        max_name_ocurr = str(url)
        for name in names.keys():
            if names[name] > max:
                max_name_ocurr = name
                max = names[name]
        return unquote(max_name_ocurr)
    def _insertNode(self, node, url, depth=0, idevice=None):
        if self.cancel:
            return
        if isinstance(url,str):
            link = None
            url = self.resources['urls'][url]
        elif isinstance(url,Link):
            link = url
            url = link.url

        if url.mime == 'text/html' and self.depths[str(url)] >= depth:
            if self.client:
                self.client.call('XHupdateImportProgressWindow','Insertando %s' % (str(url)))
            
            type = link.tag.name if link and link.tag else 'a'
            if type not in ['frame','iframe'] and node:
                node = node.createChild()
                node.setTitle(self._guessName(url))
                if depth == 1:
                    node.up()
            if not node:
                node = self.node
            parent = idevice if type in ['frame','iframe'] else None
            idevice = FreeTextIdevice(type=type,parent=parent)
            idevice.edit = False
            node.addIdevice(idevice)
        
        if url.type == "file":
            p = Path(self.baseurl + os.path.sep + str(url))
            p.setSalt(str(url))
            r = Resource(idevice,p)
            url.storageName = quote(r.storageName)
            if link and link.relative not in link.referrer.contentUpdated:
                if link.match:
                    link.referrer.content = link.referrer.content.replace(link.match,'###resources###/%s' % (url.storageName))                    
                else:
                    link.referrer.content = link.referrer.content.replace(link.relative,'###resources###/%s' % (url.storageName))
                link.referrer.contentUpdated.append(link.relative)

        if self.depths[str(url)] < depth:
            return        

        for l in url.links:
            if self.cancel:
                return
            self._insertNode(node, l, depth+1, idevice)
        
        content = url.getContent()
        if content:
            content_w_resourcePaths = re.sub('###resources###/','resources/',content)
            content_wo_resourcePaths = re.sub('###resources###/','',content) 
            if url.mime == "text/html" and idevice:
                soup = url.getSoup()
                if soup and soup.declaredHTMLEncoding:
                    content_w_resourcePaths = re.sub(soup.declaredHTMLEncoding,'utf-8',content_w_resourcePaths,re.IGNORECASE)
                    content_wo_resourcePaths = re.sub(soup.declaredHTMLEncoding,'utf-8',content_wo_resourcePaths,re.IGNORECASE)
                if soup and soup.find('frameset'):
                    idevice.type = 'frameset'
                idevice.setContent(content_w_resourcePaths,content_wo_resourcePaths)
            f = open(r.path,"w")
            f.write(content_wo_resourcePaths.encode('utf-8'))
            f.close()
