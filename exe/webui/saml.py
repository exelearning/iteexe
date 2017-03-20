# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2015, Pedro Peña Pérez, Open Phoenix IT
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
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from nevow import rend, inevow, url
from twisted.web import http
from exe import globals as G

import logging

log = logging.getLogger(__name__)


def init_saml_auth(req, configDir):
    saml_config_dir = configDir/'saml'
    if not saml_config_dir.isdir():
        template_config = G.application.config.exePath.parent/'saml_template'
        if template_config.exists():
            template_config.copytree(saml_config_dir)
        else:
            return None
    auth = OneLogin_Saml2_Auth(req, custom_base_path=saml_config_dir)
    return auth


def prepare_nevow_request(request):
    get_data, post_data = {}, {}
    for k, v in request.args.iteritems():
        get_data[k] = v[0]
        post_data[k] = v[0]
    scheme = request.received_headers.get('x-forwarded-proto', 'http')
    host = request.received_headers.get('x-forwarded-host', request.getHeader('host'))
    port = host.split(':')
    port = int(port[1]) if len(port) > 1 else (80 if scheme == 'http' else 443)
    return {
        'http_host': host,
        'scheme': scheme,
        'server_port': port,
        'script_name': request.path,
        'get_data': get_data,
        'post_data': post_data
    }


class SLSPage(rend.Page):
    def __init__(self, name, configDir):
        self.configDir = configDir
        rend.Page.__init__(self, name)

    def renderHTTP(self, context):
        request = inevow.IRequest(context)
        req = prepare_nevow_request(request)
        auth = init_saml_auth(req, self.configDir)
        auth.process_slo()
        errors = auth.get_errors()
        if len(errors) == 0:
            session = request.getSession()
            session.user = None
            return url.URL.fromString('%s://%s/quit' % (req['scheme'], req['http_host']))
        request.setResponseCode(http.INTERNAL_SERVER_ERROR)
        return auth.get_last_error_reason()


class ACSPage(rend.Page):
    def __init__(self, name, configDir):
        self.configDir = configDir
        rend.Page.__init__(self, name)

    def renderHTTP(self, context):
        request = inevow.IRequest(context)
        req = prepare_nevow_request(request)
        auth = init_saml_auth(req, self.configDir)
        auth.process_response()
        errors = auth.get_errors()
        if len(errors) == 0 and auth.is_authenticated():
            attributes = auth.get_attributes()
            session = request.getSession()
            session.samlNameId = auth.get_nameid()
            session.samlSessionIndex = auth.get_session_index()
            session.setUser(attributes['email'][0], attributes.get('picture', [None])[0])
            return url.URL.fromString(req['post_data']['RelayState'])
        request.setResponseCode(http.INTERNAL_SERVER_ERROR)
        return auth.get_last_error_reason()


class SAMLPage(rend.Page):
    name = 'saml'

    def __init__(self, parent, configDir):
        parent.putChild(self.name, self)
        self.configDir = configDir
        rend.Page.__init__(self)

    def child_acs(self, context):
        return ACSPage('acs', self.configDir)

    def child_sls(self, context):
        return SLSPage('sls', self.configDir)

    def renderHTTP(self, context):
        request = inevow.IRequest(context)
        req = prepare_nevow_request(request)
        auth = init_saml_auth(req, self.configDir)
        if auth:
            start_url = auth.login('%s://%s%s' % (req['scheme'], req['http_host'], req['script_name']))
            return url.URL.fromString(start_url)
        else:
            return 'SAML authentication needs a saml configuration directory at %s. See an example ' \
                   '<a href="https://github.com/exelearning/iteexe/tree/ws/saml_template">' \
                   'here</a>' % (G.application.defaultConfig/'saml').encode('utf-8')