# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2015, Mercedes Cotelo Lois <mclois@gmail.com>
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
StyleDesigner provides the functions to create and save the Styles edited with the Styles Designer tool
"""

import logging
import re
import os
import shutil
import json
import unicodedata
import cgi
try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET
from xml.dom import minidom
from twisted.web.resource import Resource
from exe.webui.renderable import Renderable
from exe.engine import version
from exe.engine.style import Style

log = logging.getLogger(__name__)


class StyleDesignerError(Exception):
    def __init__(self, message=''):
        if message == '':
            self.message = _('Error saving style. ')
        else:
            self.message = message
    
    pass

class CreateStyleError(StyleDesignerError):
    def __init__(self, message=''):
        if message == '':
            self.message = _('Error creating style. ')
        else:
            self.message = message
    
    pass

class CreateStyleExistsError(CreateStyleError):
    def __init__(self, absolute_style_dir, message=''):
        self.absolute_style_dir = absolute_style_dir
        if message == '':
            self.message = _('Error creating style, local style already exists. ')
        else:
            self.message = message

    def __str__(self):
        return repr(self.message)

    pass

class StyleDesigner(Renderable, Resource):
    """
    StyleDesigner provides the functions to create and save the Styles edited with the Styles Designer tool
    """
    name = 'styleDesigner'

    def __init__(self, parent):
        """ 
        Initialize
        """ 
        parent.putChild(self.name, self)
        Renderable.__init__(self, parent)
        Resource.__init__(self)
        
    def styleIdFromName(self, style_name):
        """
        Gets the style ID from the style full name
        
        Replaces ' ', '\t', '\f', '\r' with '_', accented with non accented characters,
        cleans non alphanumeric chars and converts to lower case
        """
        style_id = str(style_name)
        style_id = style_id.lower()
        style_id = unicodedata.normalize('NFKD', unicode(style_id))
        style_id = style_id.encode('ascii', 'ignore')
        
        clean_non_alphanum = re.compile('\W+')
        style_id = clean_non_alphanum.sub(' ', style_id).strip()
        style_id = style_id.replace(' ', '_')
                
        return style_id

    def render(self, request=None):
        """
        Saves the style and returns a JSON string with the result
        """
        try :
            action = request.args['action'][0]
            log.debug("StyleDesigner, action: %s" % (action))
            response = {}
                
            if action == 'createStyle':
                # Get style directory (which is also the style ID) from the style name
                style_dirname = self.styleIdFromName(request.args['style_name'][0])
                style = self.createStyle(style_dirname, request.args)
                response['style_dirname'] = style.get_dirname()
                response['success'] = True
                response['message'] = _('Style %s successfully created!') % (style.get_name())
                
            if action == 'saveStyle':
                # Style directory must has been explicitly set
                style_dirname = request.args['style_dirname'][0]
                style = self.saveStyle(style_dirname, request.args)
                response['style_dirname'] = style.get_dirname()
                response['success'] = True
                response['message'] = _('Style %s successfully saved!') % (style.get_name())
        
        except Exception, e:
                # Operation has failed, but we can inform the user about the error
                response['success'] = False
                response['message'] = e.message
        
        return json.dumps(response)
    
    def updateStyle(self, styleDir, contentcss, navcss, style_config):
        """
        Overwrite content.css, nav.css and config.xml files with the data given
        """
        contentcss_file = open(styleDir / 'content.css', 'w')
        contentcss_file.write(contentcss)
        contentcss_file.close()
        
        navcss_file = open(styleDir / 'nav.css', 'w')
        navcss_file.write(navcss)
        navcss_file.close()
        
        theme = ET.Element('theme')
        ET.SubElement(theme, 'name').text = style_config['name']
        ET.SubElement(theme, 'version').text = style_config['version']
        ET.SubElement(theme, 'compatibility').text = style_config['compatibility']
        ET.SubElement(theme, 'author').text = style_config['author']
        ET.SubElement(theme, 'author-url').text = style_config['author-url']
        ET.SubElement(theme, 'license').text = style_config['license']
        ET.SubElement(theme, 'license-url').text = style_config['license-url']
        ET.SubElement(theme, 'description').text = style_config['description']
        
        # 'extra-head' and 'extra-body' can contain scripts and headers, they
        # must be enclosed on <![CDATA[ ]]> tags and HTML entities should not
        # be escaped
        #ET.SubElement(theme, 'extra-head').text = '<![CDATA[' + style_config['extra-head'] + ']]>'
        #ET.SubElement(theme, 'extra-body').text = '<![CDATA[' + style_config['extra-body'] + ']]>'
        
        configxml = ET.tostring(theme, 'utf-8')
        configxml_parsed = minidom.parseString(configxml)
        configxml_pretty = configxml_parsed.toprettyxml(indent = "    ")
        
        # UGLY HACK (mclois): 'extra-head' and 'extra-body' can contain HTML headers and scripts,
        # they must be wrapped on <![CDATA[ ]] tags, and HTML entities should not be escaped
        # ElementTree escapes HTML entities, so I add those attributes here
        extra = '<extra-head><![CDATA[' + style_config['extra-head'] + ']]></extra-head>'
        extra = extra + '<extra-body><![CDATA[' + style_config['extra-body'] + ']]></extra-body>'
        extra = extra + '</theme>'
        configxml_pretty = configxml_pretty.replace('</theme>', extra)
        
        configxml_file = open(styleDir / 'config.xml', 'w')
        configxml_file.write(configxml_pretty)
        configxml_file.close()
    
    def createStyle(self, style_dirname, style_data):
        """
        Creates a new style with the name and data given
        """
        # Check that the target dir does not already exists and create
        copy_from = 'base'
        if 'copy_from' in style_data :
            copy_from = style_data['copy_from'][0];
            
        styleDir = self.config.stylesDir / style_dirname
        if os.path.isdir(styleDir):
            raise CreateStyleExistsError(styleDir, _(u'Style directory %s already exists') % (style_dirname))
        else:
            try:
                os.mkdir(styleDir)
                
                # Copy ALL files from the base style
                baseStyleDir = self.config.stylesDir / copy_from
                base_files = os.listdir(baseStyleDir)
                for file_name in base_files:
                    full_file_name = os.path.join(baseStyleDir, file_name)
                    if (os.path.isfile(full_file_name)):
                        shutil.copy(full_file_name, styleDir)
                        
                # Save all uploaded files to style dir
                self.saveUploadedFiles(styleDir, style_data)
                
                # Overwrite content.css, nav.css and config.xml files with the data
                # from the style designer
                contentcss = style_data['contentcss'][0]
                navcss = style_data['navcss'][0]
                
                author = 'exeLearning.net'
                if 'author' in style_data :
                    author = cgi.escape(style_data['author'][0], True)
                    
                author_url = 'http://exelearning.net'
                if 'author_url' in style_data :
                    author_url = cgi.escape(style_data['author_url'][0], True)
                    
                description = ''
                if 'description' in style_data :
                    description = cgi.escape(style_data['description'][0], True)
                
                # extra-head and extra-body attributes can contain user defined scripts or headers
                # ('base' style contains scripts and parameters needed for responsiveness).
                # The UI has no fields to modify these attributes, so they will never be in
                # 'style_data', but since user can edit 'config.xml' any time, the values
                # present in there must be kept 
                config_base = ET.parse(baseStyleDir / 'config.xml')
                extra_head = config_base.find('extra-head').text
                extra_body = config_base.find('extra-body').text
                configxml = {
                    'name':  style_data['style_name'][0],
                    'version': '1.0',
                    'compatibility': version.version,
                    'author': author,
                    'author-url': author_url,
                    'license': 'Creative Commons by-sa',
                    'license-url': 'http://creativecommons.org/licenses/by-sa/3.0/',
                    'description': description,
                    'extra-head': extra_head,
                    'extra-body': extra_body,
                }
                self.updateStyle(styleDir, contentcss, navcss, configxml)
                
                # New style dir has been created, add style to eXe Styles store
                style = Style(styleDir)
                if style.isValid():
                    if not self.config.styleStore.addStyle(style):
                        styleDir.rmtree()
                        raise CreateStyleExistsError(styleDir, _('The style name already exists'))
                
                return style
                
            except Exception, e:
                if os.path.isdir(styleDir):
                    styleDir.rmtree()
                raise CreateStyleError(e.message)
    
    def saveStyle(self, style_dirname, style_data):
        """
        Updates the style with data given from Styles Designer
        """
        styleDir = self.config.stylesDir / style_dirname
        
        # Check that the target dir already exists and update files
        if not os.path.isdir(styleDir):
            raise StyleDesignerError(_('Error saving style, style directory does not exist'))
        else:
            try:
                style = Style(styleDir)
                
                # Save all uploaded files to style dir
                self.saveUploadedFiles(styleDir, style_data)
                
                # Overwrite content.css, nav.css and config.xml files with the data
                # from the style designer
                contentcss = style_data['contentcss'][0]
                navcss = style_data['navcss'][0]
                
                author = 'exeLearning.net'
                if 'author' in style_data :
                    author = cgi.escape(style_data['author'][0], True)
                    
                author_url = 'http://exelearning.net'
                if 'author_url' in style_data :
                    author_url = cgi.escape(style_data['author_url'][0], True)
                    
                description = ''
                if 'description' in style_data :
                    description = cgi.escape(style_data['description'][0], True)
                    
                new_version = style.get_version()
                if 'version' in style_data :
                    new_version = style_data['version'][0];
                # If user has chosen a new version, use it
                # otherwise autoincrement minor version
                if new_version != style.get_version() :
                    next_version = new_version
                else :
                    current_version = tuple(map(int, style.get_version().split('.')));
                    next_version = (current_version[0], current_version[1] + 1);
                    next_version = '.'.join(map(str, next_version))
                    
                # extra-head and extra-body attributes can contain user defined scripts or headers
                # ('base' style contains scripts and parameters needed for responsiveness).
                # The UI has no fields to modify these attributes, so they will never be in
                # 'style_data', but since user can edit 'config.xml' any time, the values
                # present in there must be kept 
                config_org = ET.parse(styleDir / 'config.xml')
                extra_head = config_org.find('extra-head').text
                extra_body = config_org.find('extra-body').text
                configxml = {
                    'name':  style_data['style_name'][0],
                    'version': next_version,
                    'compatibility': version.version,
                    'author': author,
                    'author-url': author_url,
                    'license': 'Creative Commons by-sa',
                    'license-url': 'http://creativecommons.org/licenses/by-sa/3.0/',
                    'description': description,
                    'extra-head': extra_head,
                    'extra-body': extra_body,
                }
                self.updateStyle(styleDir, contentcss, navcss, configxml)
                return style
                
            except Exception, e:
                raise StyleDesignerError(e.message)
            
    def saveUploadedFiles(self, targetDir, uploaded):
        """
        Saves to a given directory the uploaded files
        """
        
        if 'bodyBGURLFile_0' in uploaded :
            out = open(targetDir / uploaded['bodyBGURLFilename_0'][0], 'w')
            out.write(uploaded['bodyBGURLFile_0'][0])
            out.close()
        
        if 'contentBGURLFile_0' in uploaded :
            out = open(targetDir / uploaded['contentBGURLFilename_0'][0], 'w')
            out.write(uploaded['contentBGURLFile_0'][0])
            out.close()
        
        if 'headerBGURLFile_0' in uploaded :
            out = open(targetDir / uploaded['headerBGURLFilename_0'][0], 'w')
            out.write(uploaded['headerBGURLFile_0'][0])
            out.close()
        