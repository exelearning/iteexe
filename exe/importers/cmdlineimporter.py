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
from exe.importers.xliffimport import XliffImport


class CmdlineImporter(object):
    '''
    classdocs
    '''
    def __init__(self, config, options):
        '''
        Constructor
        '''
        self.config = config
        self.options = options

    def do_import(self, inputf, outputf):
        '''
        '''
        if hasattr(self, 'import_' + self.options['import']):
            return getattr(self, 'import_' + self.options['import'])(inputf, outputf)
        else:
            print((_("Import format not implemented")))

    def import_xml(self, inputf, outputf):
        if not outputf:
            outputf = inputf.rsplit(".xml")[0]
        xml = open(inputf).read()
        pkg = Package.load(outputf, fromxml=xml)
        if not pkg:
            raise Exception(_("Invalid output package '%s'") % outputf)
        pkg.save()
        return outputf

    def import_xliff(self, inputf, outputf):
        if not outputf:
            outputf = inputf.rsplit(".xlf")[0]
        pkg = Package.load(outputf)
        if not pkg:
            raise Exception(_("Invalid output package '%s'") % outputf)
        importer = XliffImport(pkg, inputf)
        importer.parseAndImport(self.options["from-source"])
        pkg.save()
        return outputf
