# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2017, Pedro Peña Pérez, Open Phoenix IT
#
#  This program is free software; you can redistribute it and/or modify
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
from exe.engine.packagestore import PackageStore
from exe.webui.renderable import Renderable
from exe.engine.version import release, revision
from nevow import rend, tags, inevow

import urllib2
import tempfile
import os


class OpenPackagePage(Renderable, rend.Page):
    name = 'openpackage'
    _templateFileName = 'openpackage.html'

    def __init__(self, parent):
        parent.putChild(self.name, self)
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)

    def render_openresult(self, ctx, data):
        msg = ''
        request = inevow.IRequest(ctx)
        session = request.getSession()
        url = request.args.get('url', [None])[0]

        if url:
            req = urllib2.Request(url)

            try:
                response = urllib2.urlopen(req)
                (fd, name) = tempfile.mkstemp()
                os.write(fd, response.read())
                os.close(fd)
                package_store = PackageStore()
                if session.user:
                    package_store = session.user.packageStore
                package = package_store.loadPackage(name)
                package.filename = u''
                session.packageStore = package_store
                self.root.packagePath = name
                self.root.package = package

                return [tags.script(type='text/javascript')['window.location = "%s"' % package.name]]
            except urllib2.URLError as e:
                msg = e.reason[1]
            except Exception as e:
                msg = e.message

        return [tags.p()[msg]]

    def render_version(self, ctx, data):
        return [tags.p()["Version: %s" % release],
                tags.p()["Revision: ",
                         tags.a(href='%s/commits/%s' % (self.config.baseGitWebURL, revision),
                                target='_blank')[revision]
                        ]
               ]