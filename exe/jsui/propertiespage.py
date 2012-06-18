# -- coding: utf-8 --
# ===========================================================================
# eXe 
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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
PropertiesPage maps properties forms to Package options
"""

import logging
import json
from exe.webui.renderable import Renderable
from twisted.web.resource import Resource
from exe.engine.path import toUnicode
log = logging.getLogger(__name__)

# ===========================================================================
class PropertiesPage(Renderable, Resource):
    """
    PropertiesPage maps properties forms to Package options
    """
    name = 'properties'

    def __init__(self, parent):
        """ 
        Initialize
        """ 
        Renderable.__init__(self, parent)
        if parent:
            self.parent.putChild(self.name, self)
        Resource.__init__(self)

    def fieldId2obj(self, fieldId):
        """
        Takes a field id of the form xx_name and returns the object associated
        with xx and name. These can be used with getattr and setattr
        """
        if '_' in fieldId:
            part, name = fieldId.split('_', 1)
            # Get the object
            if part == 'pp':
                obj = self.package
            if part == 'dc':
                obj = self.package.dublinCore
            if part == 'eo':
                obj = self.package.exportOptions
            if hasattr(obj, name):
                return obj, name
        raise ValueError("field id '%s' doesn't refer "
                         "to a valid object attribute" % fieldId)

    def render_GET(self, request=None):
        log.debug("render_GET")
        
        data = {}
        try:
            for key in request.args.keys():
                if key != "_dc":
                    obj, name = self.fieldId2obj(key)
                    data[key] = getattr(obj, name)
        except:
            return json.dumps({'success': False, 'errorMessage': _("Failed to get properties")})
        return json.dumps({'success': True, 'data': data})

    def render_POST(self, request=None):
        log.debug("render_POST")
        
        try:
            for key, value in request.args.items():
                obj, name = self.fieldId2obj(key)
                setattr(obj, name, toUnicode(value[0]))
        except:
            return json.dumps({'success': False, 'errorMessage': _("Failed to save properties")})
        return json.dumps({'success': True})
    
# ===========================================================================
