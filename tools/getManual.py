#!/usr/bin/python -u
#
# Make a snapshot of the eXe Online Manual for offline use
#
# Copyright (c) 2008 James W. Tittsler <jwt@OnJapan.net>
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation
# files (the "Software"), to deal in the Software without
# restriction, including without limitation the rights to use,
# copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following
# conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
# OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
# HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
# WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
# OTHER DEALINGS IN THE SOFTWARE.
#
#
# 20080118 jwt@OnJapan.net -- package WikiEducator collection as
#               Common Cartridge or Content Package
# 20080414 jim@exelearning.org -- snapshot eXe manual from WikiEducator
"""make a snapshot of the eXe manual from WikiEducator"""

# All of the articles in this collection will be downloaded
url = 'http://wikieducator.org/WikiEducator:Collections/EXe_Manual'
manual_dir = 'exe/webui/docs/manual'

import os
import sys
import re
from fnmatch import fnmatch
from urllib import unquote
import urllib2
import cgi
# Try to work even with no python path
try:
    from exe.engine.beautifulsoup import BeautifulSoup, Tag
except ImportError, error:
    if str(error) == "No module named exe.engine.beautifulsoup":
        exePath = os.path.abspath(sys.argv[0])
        exeDir  = os.path.dirname(exePath)
        pythonPath = os.path.split(exeDir)[0]
        sys.path.insert(0, pythonPath)
        from exe.engine.beautifulsoup import BeautifulSoup, Tag
    else:
        raise error

# remove old HTML and image files
for file in os.listdir(manual_dir):
    if fnmatch(file, '*.html') or fnmatch(file, '*.jpg') \
            or fnmatch(file, '*.jpeg') or fnmatch(file, '*.gif') \
            or fnmatch(file, '*.png'):
        os.remove(os.path.join(manual_dir, file))

def url_join(a, b):
    url = a
    if not a.endswith('/'):
        url += '/'
    if b.startswith('/'):
        url += b[1:]
    else:
        url += b
    return url

def page_name(a, suffix=''):
    """make filesystem name based on unquoted base part of URL"""
    pn = unquote(a.split('/')[-1])
    if suffix <> '' and not pn.endswith(suffix):
        pn += suffix
    return cgi.escape(pn, True)

def fix_link(url):
    if url.startswith('http://'):
        return url
    elif url.startswith('User:'):
        return 'http://wikieducator.org/' + url
    return url.split('/')[-1] + '.html'

if not url.startswith('http://wikieducator.org/') \
  and not url.startswith('http://www.wikieducator.org/'):
    print "URL must start with http://wikieducator.org/"
    sys.exit(-1)

html_prologue = '''<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>eXe</title>
<style type="text/css">
@import url(eXe_manual.css);
</style>
</head>
<body>
'''
html_epilogue = '''</body></html>
'''

base_url = 'http://wikieducator.org/'
collection = urllib2.urlopen(url)
soup = BeautifulSoup(collection)

# make sure the URL is a collection, and not a "page not found" page
if not soup.find('span', {'class': 'mw-headline'}):
    print 'missing or malformed collection page'
    sys.exit()

collection_title = str(soup.find('span', {'class': 'mw-headline'}).string).strip()

print "fetching manual..."
sys.stdout.flush()

for page in soup('dd'):
    if not page.a:
        continue
    print '  ', page.a.string,
    sys.stdout.flush()
    page_url = url_join(base_url, page.a['href'])
    #print page_url,"</li>"
    sys.stdout.flush()
    p1 = urllib2.urlopen(page_url)
    p1_soup = BeautifulSoup(p1)
    #print p1_soup.find(id = 'bodyContent')
    body = p1_soup.find(id = 'content')
    # remove some bits
    body.find(id = 'siteNotice').extract()
    body.find(id = 'siteSub').extract()
    body.find(id = 'contentSub').extract()
    body.find(id = 'jump-to-nav').extract()
    #if body.find(id = 'toc'):
    #    body.find(id = 'toc').extract()
    if body.find(id = 'printfooter'):
        body.find(id = 'printfooter').extract()
    #if body.find('div', {'class': 'navigation'}):
    #    body.find('div', {'class': 'navigation'}).extract()
    if body.find('div', {'class': 'printfooter'}):
        body.find('div', {'class': 'printfooter'}).extract()
    if body.find('table', {'class': 'workinprogress'}):
        body.find('table', {'class': 'workinprogress'}).extract()
    if body.find(id = 'catlinks'):
        body.find(id = 'catlinks').extract()
    # disable local links
    for link in body.findAll('a'):
        if not link.has_key('class'):
            if link.has_key('name'):
                continue
            link['href'] = fix_link(link['href'])
        elif link['class'].find('external') > -1:
            link['target'] = '_blank'
        elif link['class'].find('image') > -1:
            #print "      image link:", link
            tag = Tag(soup, 'span', [('class', 'removed_img_link')])
            tag.insert(0, link.contents[0])
            link.replaceWith(tag)
        else:
            #print "      non-ext link:",link
            tag = Tag(soup, 'span', [('class', 'removed_link')])
            tag.insert(0, link.contents[0])
            link.replaceWith(tag)

    # fetch all the images
    for img in body.findAll('img'):
        img_url = str(img['src'])
        if not img_url.startswith('http://'):
            img_url = url_join(base_url, img_url)
        #print "  ", img_url
        img_contents = urllib2.urlopen(img_url)
        open(os.path.join(manual_dir, page_name(img_url)), 'wb').write(img_contents.read())
        img['src'] = page_name(img_url)
        #print "    ", img
        print '.',
        sys.stdout.flush()

    f = open(os.path.join(manual_dir, page_name(page_url, '.html')), 'wt')
    f.write(html_prologue)
    f.write(str(body))
    f.write(html_epilogue)
    f.close()

    print
