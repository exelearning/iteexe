# ===========================================================================
# testresources
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

import unittest
from exe.importers.scanresources import Resources
import utils


class TestResources(utils.SuperTestCase):
    def printLinks(self, url, depth=0):
        if url in self.visited:
            return
        self.visited.append(url)
        if url.links:
            print
            print "%s%s %s" % (''.join(['   ' for n in range(0, depth)]), url, url.links)
        for link in url.links:
            self.printLinks(link.url, depth + 1)

    def test2(self):
        r = Resources('testing/html/test2', self.package.root)
        r.insertNode(['cab_contenidos.htm'])
        self.visited = []
        self.printLinks(r.resources['urls']['cab_contenidos.htm'])
        testlinks = [str(link.url) for link in r.resources['urls']['cab_contenidos.htm'].links]
        testcontent = r.resources['urls']['cab_contenidos.htm'].content
        for f in ['Imgs_cab/indice.jpg', 'Imgs_cab/contenidos.jpg', 'Imgs_cab/anexos.jpg',
                     'Imgs_cab/recursos.jpg', 'Imgs_cab/proyectos.jpg', "images/cabecera_fnd.gif",
                     "Imgs_cab/cabecera_01.jpg", "Imgs_cab/cabecera_02.jpg", 'Imgs_cab/indice.jpg',
                     "Imgs_cab/cabecera_03.jpg", 'Imgs_cab/contenidos.jpg', "Imgs_cab/contenidos.jpg",
                     'Imgs_cab/anexos.jpg', "Imgs_cab/cabecera_05.jpg",
                     "Imgs_cab/cabecera_06.jpg", "Imgs_cab/cabecera_07.jpg", "Imgs_cab/cabecera_08.jpg",
                     'Imgs_cab/recursos.jpg', "Imgs_cab/cabecera_09.jpg",
                     'Imgs_cab/proyectos.jpg', "Imgs_cab/cabecera_10.jpg",
                     "Imgs_cab/cabecera_11.jpg", "images/cabecera_fnd.gif", "imgs/final_cabecera.jpg",
                     "recursos.htm"
                     ]:
            assert f in testlinks
            resource = r.resources['urls'][f].storageName
            assert '###resources###/%s' % resource in testcontent

if __name__ == "__main__":
    unittest.main()
