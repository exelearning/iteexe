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
from exe.engine.path import toUnicode, Path
from exe.engine.lom import lomsubs
import re
log = logging.getLogger(__name__)


def get_nodeFromList(root, onum):
    index = 0
    for element in root:
        if isinstance(element, dict) and element['__numberid__'] == onum:
            return index
        index += 1
    return False


def get_nameNum(name):
    c = True
    i = len(name) - 1
    while c and i >= 0:
        c = name[i].isdigit()
        if c and i > 0:
            i -= 1
        else:
            c = False
    if i == 0:
        n = False
    else:
        n = name[:i + 1]
    if i == 0:
        num = name
    elif i < len(name) - 1:
        num = name[i + 1:]
    else:
        num = False
    if n == '':
        n = False
    return n, num


def _pass_field(fields, field, val):
    """
    @return:
        True: not process field (continue)
        False:  process field
    """
    ret = False
    if val.strip() == '':
        #Entity Control
        if re.findall("_entity[0-9]*_[name,organization,email]+$", field):
            field2 = field
            cnt = False
            for r in ['name', 'email', 'organization']:
                a = re.sub('[name,organization,email]+$', r, field2)
                if a in fields.keys() and fields[a][0].strip() != '':
                    cnt = True
            if not cnt:
                ret = True
        else:
            #Duration Control
            if re.findall("_[duration,typicalLearningTime]+_[years,months,days,hours,minutes,seconds]+$", field):
                field2 = field
                cnt = False
                for r in ['years', 'months', 'days', 'hours', 'minutes', 'seconds']:
                    a = re.sub('[years,months,days,hours,minutes,seconds]+$', r, field2)
                    if a in fields.keys() and fields[a][0].strip() != '':
                        cnt = True
                if not cnt:
                    ret = True
            else:
                # Other fields with value ''
                ret = True
    return ret


def processForm2Lom(fields, label, source):
    lomdict = {}
    for field in sorted(fields.iterkeys()):
        #print field
        val = fields[field]
        if not field.startswith('%s_' % label):
            continue
        else:
            val = val[0].strip()
            if _pass_field(fields, field, val):
                continue
            nodes = field.split('_')
            nodes.remove(label)
            rootvalue = lomdict
            i = 0
            rootparentparent = False
            rootparent = False
            for node in nodes:
                index = False
                parentindex = False
                value = {}
                if node[-1].isdigit():
                    name, num = get_nameNum(node)
                    node = name
                    if name not in rootvalue:
                        value = {'__numberid__': num}
                        index = 0
                    else:
                        index = get_nodeFromList(rootvalue[name], num)
                        if  isinstance(index, bool):
                            value = {'__numberid__': num}
                            index = len(rootvalue)
                else:
                    value = {}
                if isinstance(rootvalue, list):
                    name, num = get_nameNum(nodes[i - 1])
                    parentindex = get_nodeFromList(rootvalue, num)
                    rootparentparent = rootparent
                    rootparent = rootvalue
                    if not isinstance(index, bool):
                        if node not in rootvalue[parentindex]:
                            rootvalue[parentindex][node] = []
                            rootvalue[parentindex][node].append(value)
                        else:
                            if '__numberid__' in value:
                                b = get_nodeFromList(rootvalue[parentindex][node], value['__numberid__'])
                                if isinstance(b, bool):
                                    rootvalue[parentindex][node].append(value)
                    else:
                        if node not in rootvalue[parentindex]:
                            rootvalue[parentindex][node] = value
                    rootvalue = rootvalue[parentindex][node]
                else:
                    if not isinstance(index, bool):
                        if node not in rootvalue:
                            rootvalue[node] = []
                            rootvalue[node].append(value)
                        else:
                            if '__numberid__' in value:
                                b = get_nodeFromList(rootvalue[node], value['__numberid__'])
                                if isinstance(b, bool):
                                    rootvalue[node].append(value)
                    else:
                        if node not in rootvalue:
                            rootvalue[node] = value
                    rootparentparent = rootparent
                    rootparent = rootvalue
                    rootvalue = rootvalue[node]
                i += 1

            pnodes = [node]
            if node == 'value':
                pnodes.append('source')
            for node in pnodes:
                if node == 'source':
                    val = source
                if  isinstance(rootvalue, list):
                    if node.startswith('string'):
                        rootvalue = rootvalue[index]
                        rootvalue['valueOf_'] = val
                    else:
                        if isinstance(rootparent, list):
                            rootparent[parentindex][node].append(val)
                            for e in rootparent[parentindex][node]:
                                if isinstance(e, dict):
                                    rootparent[parentindex][node].remove(e)
                        else:
                            rootparent[node].append(val)
                            for e in rootparent[node]:
                                if isinstance(e, dict):
                                    rootparent[node].remove(e)
                else:
                    if isinstance(rootparent, list):
                        if re.findall("_date$", field):
                            rootparent[parentindex][node]['dateTime'] = val
                        elif re.findall("_entity[0-9]*_[name,organization,email]+$", field):
                            rootparent[parentindex][node] = val
                            if 'name' in rootparent[parentindex] and 'organization' in rootparent[parentindex] and \
                            'email' in rootparent[parentindex]:
                                val2 = 'BEGIN:VCARD VERSION:3.0 FN:%s EMAIL;TYPE=INTERNET:%s ORG:%s END:VCARD' \
                                % (rootparent[parentindex]['name'], rootparent[parentindex]['email'],
                                   rootparent[parentindex]['organization'])
                                rootparent.pop(parentindex)
                                rootparent.append(val2)
                        else:
                            rootparent[parentindex][node] = val
                    else:
                        if re.findall("_date$", field):
                            rootparent[node]['dateTime'] = val
                        elif re.findall("_entity[0-9]*_[name,organization,email]+$", field):
                            rootparent[node] = val
                            if 'name' in rootparent and 'organization' in rootparent and 'email' in rootparent:
                                val2 = 'BEGIN:VCARD VERSION:3.0 FN:%s EMAIL;TYPE=INTERNET:%s ORG:%s END:VCARD' \
                                % (rootparent['name'], rootparent['email'], rootparent['organization'])
                                name, num = get_nameNum(nodes[len(nodes) - 3])
                                parentindex = get_nodeFromList(rootparentparent, num)
                                rootparentparent[parentindex]['entity'] = val2
                        elif re.findall("_[duration,typicalLearningTime]+_[years,months,days,hours,minutes,seconds]+$", field):
                            rootparent[node] = val
                            if 'years' in rootparent and 'months' in rootparent and 'days' in rootparent\
                            and 'hours' in rootparent and 'minutes' in rootparent and 'seconds' in rootparent:
                                val2 = 'P%sY%sM%sDT%sH%sM%sS' % (rootparent['years'] or '0', rootparent['months'] or '0', rootparent['days'] or '0',\
                                                             rootparent['hours'] or '0', rootparent['minutes'] or '0', rootparent['seconds'] or '0')
                                rootparent['duration'] = val2
                                for key in ['years', 'months', 'days', 'hours', 'minutes', 'seconds']:
                                    del rootparent[key]
                        else:
                            rootparent[node] = val
    return lomdict


def processLom2Form2(form, lom):
    data = {}
    for field in form:
        if field.startswith('lom'):
            data[field] = lom.getval(field)
    return data


# ===========================================================================
class PropertiesPage(Renderable, Resource):
    """
    PropertiesPage maps properties forms to Package options
    """
    name = 'properties'

    booleanFieldNames = ('pp_scolinks', 'pp_backgroundImgTile', 'pp_scowsinglepage', 'pp_scowwebsite', 'pp_scowsource',
                         'pp_intendedEndUserRoleGroup', 'pp_intendedEndUserRoleTutor')

    imgFieldNames = ('pp_backgroundImg')

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
            else:
                if fieldId in ['pp_scowsinglepage', 'pp_scowwebsite', 'pp_scowsource']:
                    setattr(obj, name, False)
                    return obj, name

        raise ValueError("field id '%s' doesn't refer "
                         "to a valid object attribute" % fieldId)

    def setLom(self, fields):
        lom = processForm2Lom(fields, 'lom', 'LOMv1.0')
        rootLom = lomsubs.lomSub.factory()
        rootLom.addChilds(lom)
        self.package.lom = rootLom
        return True

    def setLomes(self, fields):
        lom = processForm2Lom(fields, 'lomes', 'LOM-ESv1.0')
        rootLom = lomsubs.lomSub.factory()
        rootLom.addChilds(lom)
        self.package.lomEs = rootLom
        return True

    def render_GET(self, request=None):
        log.debug("render_GET")
        data = {}
        try:
            if 'lom_general_title_string1' in request.args.keys():
                self.package.lom.genForm('lom', self.package.lom, data)
            elif 'lomes_general_title_string1' in request.args.keys():
                self.package.lom.genForm('lomes', self.package.lomEs, data)
            else:
                for key in request.args.keys():
                    if key != "_dc":
                        obj, name = self.fieldId2obj(key)
                        if key in self.imgFieldNames:
                            if getattr(obj, name):
                                data[key] = getattr(obj, name).basename()
                        else:
                            data[key] = getattr(obj, name)
        except Exception as e:
            log.exception(e)
            return json.dumps({'success': False, 'errorMessage': _("Failed to get properties")})
        return json.dumps({'success': True, 'data': data})

    def render_POST(self, request=None):
        log.debug("render_POST")

        data = {}
        try:
            if 'lom_general_title_string1' in request.args:
                self.setLom(request.args)
            elif 'lomes_general_title_string1' in request.args:
                self.setLomes(request.args)
            else:
                items = request.args.items()
                if 'pp_lang' in request.args:
                    value = request.args['pp_lang']
                    item = ('pp_lang', value)
                    items.remove(item)
                    items.insert(0, item)
                for key, value in items:
                    obj, name = self.fieldId2obj(key)
                    if key in self.booleanFieldNames:
                        setattr(obj, name, value[0] == 'true')
                    else:
                        if key in self.imgFieldNames:
                            path = Path(value[0])
                            if path.isfile():
                                setattr(obj, name, toUnicode(value[0]))
                                data[key] = getattr(obj, name).basename()
                            else:
                                if getattr(obj, name):
                                    if getattr(obj, name).basename() != path:
                                        setattr(obj, name, None)
                        else:
                            setattr(obj, name, toUnicode(value[0]))
        except Exception as e:
            log.exception(e)
            return json.dumps({'success': False, 'errorMessage': _("Failed to save properties")})
        if self.package.filename == u'':
            self.package.isChanged = True
        else:
            self.package.save()
        return json.dumps({'success': True, 'data': data})

# ===========================================================================
