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

import sys
import logging
from exe.engine.persistxml import encodeObjectToXML
from exe.engine.path import Path
from exe.engine.package import Package
from exe.export.scormexport import ScormExport
from exe.export.imsexport import IMSExport
from exe.export.websiteexport import WebsiteExport
from exe.export.singlepageexport import SinglePageExport
from exe.export.xliffexport import XliffExport
from exe.export.epub3export import Epub3Export

LOG = logging.getLogger(__name__)


class CmdlineExporter(object):
    extensions = {'xml': '.xml',
                  'scorm12': '.zip',
                  'scorm2004': '.zip',
                  'agrega': '.zip',
                  'ims': '.zip',
                  'website': '',
                  'webzip': '.zip',
                  'singlepage': '',
                  'xliff': '.xlf',
                  'epub3': '.epub',
                  'report': '.csv'
                  }

    def __init__(self, config, options):
        self.config = config
        self.options = options
        self.web_dir = Path(self.config.webDir)
        self.styles_dir = None

    def do_export(self, inputf, outputf):
        if hasattr(self, 'export_' + self.options["export"]):
            LOG.debug("Exporting to type %s, in: %s, out: %s, overwrite: %s" \
            % (self.options["export"], inputf, outputf, str(self.options["overwrite"])))
            if not outputf:
                if self.options["export"] in ('website', 'singlepage'):
                    outputf = inputf.rsplit(".elp")[0]
                else:
                    outputf = inputf + self.extensions[self.options["export"]]
            outputfp = Path(outputf)
            if outputfp.exists() and not self.options["overwrite"]:
                error = _(u'"%s" already exists.\nPlease try again \
with a different filename') % outputf
                raise Exception(error.encode(sys.stdout.encoding))
            else:
                if outputfp.exists() and self.options["overwrite"]:
                    if outputfp.isdir():
                        for filen in outputfp.walkfiles():
                            filen.remove()
                        outputfp.rmdir()
                    else:
                        outputfp.remove()
                pkg = Package.load(inputf)
                LOG.debug("Package %s loaded" % (inputf))
                if not pkg:
                    error = _(u"Invalid input package")
                    raise Exception(error.encode(sys.stdout.encoding))
                self.styles_dir = self.config.stylesDir / pkg.style
                LOG.debug("Styles dir: %s" % (self.styles_dir))
                pkg.exportSource = self.options['editable']
                getattr(self, 'export_' + self.options["export"])(pkg, outputf)
                return outputf
        else:
            raise Exception(_(u"Export format not implemented")\
.encode(sys.stdout.encoding))

    def export_xml(self, pkg, outputf):
        open(outputf, "w").write(encodeObjectToXML(pkg))

    def export_scorm12(self, pkg, outputf):
        scormExport = ScormExport(self.config, self.styles_dir, outputf,
'scorm1.2')
        pkg.scowsinglepage = self.options['single-page']
        pkg.scowwebsite = self.options['website']
        scormExport.export(pkg)

    def export_scorm2004(self, pkg, outputf):
        scormExport = ScormExport(self.config, self.styles_dir, outputf,
'scorm2004')
        pkg.scowsinglepage = self.options['single-page']
        pkg.scowwebsite = self.options['website']
        scormExport.export(pkg)

    def export_agrega(self, pkg, outputf):
        scormExport = ScormExport(self.config, self.styles_dir, outputf,
'agrega')
        pkg.scowsinglepage = self.options['single-page']
        pkg.scowwebsite = self.options['website']
        scormExport.export(pkg)

    def export_ims(self, pkg, outputf):
        imsExport = IMSExport(self.config, self.styles_dir, outputf)
        imsExport.export(pkg)

    def export_website(self, pkg, outputf):
        outputfp = Path(outputf)
        outputfp.makedirs()
        websiteExport = WebsiteExport(self.config, self.styles_dir, outputf)
        websiteExport.export(pkg)

    def export_webzip(self, pkg, outputf):
        websiteExport = WebsiteExport(self.config, self.styles_dir, outputf)
        websiteExport.exportZip(pkg)

    def export_singlepage(self, pkg, outputf, print_flag=0):
        images_dir = self.web_dir.joinpath('images')
        scripts_dir = self.web_dir.joinpath('scripts')
        css_dir = self.web_dir.joinpath('css')
        templates_dir = self.web_dir.joinpath('templates')
        singlePageExport = SinglePageExport(self.styles_dir, outputf, \
                             images_dir, scripts_dir, css_dir, templates_dir)
        singlePageExport.export(pkg, print_flag)

    def export_xliff(self, pkg, outputf):
        xliff = XliffExport(self.config, outputf, \
                            source_copied_in_target=self.options["copy-source"], \
                            wrap_cdata=self.options["wrap-cdata"])
        xliff.export(pkg)

    def export_epub3(self, pkg, outputf):
        epub3Export = Epub3Export(self.config, self.styles_dir, outputf)
        epub3Export.export(pkg)

    def export_report(self, pkg, outputf):
        websiteExport = WebsiteExport(self.config, self.styles_dir, outputf, report=True)
        websiteExport.export(pkg)
