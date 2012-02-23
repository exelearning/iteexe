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
'''
@author: Pedro Peña Pérez
'''
from exe.engine.package import Package


class CmdlineImporter(object):
    '''
    classdocs
    '''
    def __init__(self, config):
        '''
        Constructor
        '''
        self.config = config

    def do_import(self, ftype, inputf, outputf):
        '''
        '''
        if hasattr(self, 'import_' + ftype):
            return getattr(self, 'import_' + ftype)(inputf, outputf)
        else:
            print _(u"Import format not implemented")

    def import_xml(self, inputf, outputf):
        if not outputf:
            outputf = inputf.rsplit(".xml")[0]
        xml = open(inputf).read()
        pkg = Package.load(outputf, xml=xml)
        if not pkg:
            raise Exception(_("Invalid output package"))
        pkg.save()
        return outputf
