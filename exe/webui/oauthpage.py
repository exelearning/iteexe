# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2016, Pedro Peña Pérez, Open Phoenix IT
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
from exe.webui.renderable import Renderable
from nevow import rend, inevow


class ProcomunOauth(Renderable, rend.Page):
    CLIENT_ID = 'qJjpq2uU2dDlp4a3teMTXPILrHMqYOoI'
    CLIENT_SECRET = '1RVxCfU4XeFhGkwf1zMVhA5ySPDJIiz7wjZjK4O0wUH5MFRc'
    BASE_URL = 'https://agrega2-front-pre.emergya.es'
    REDIRECT_URI = 'https://exe.open-phoenix.com/oauth/procomun/callback'
    AUTHORIZATION_BASE_URL = BASE_URL + '/oauth2/authorize'
    TOKEN_URL = BASE_URL + '/oauth2/token'
    name = 'procomun'
    _templateFileName = 'oauth.html'

    def __init__(self, parent):
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)
        self.states = {}

    def child_callback(self, ctx):
        return self

    def saveState(self, state, oauth2Session, client):
        self.states[state] = (oauth2Session, client)

    def render_start(self, ctx, data):
        request = inevow.IRequest(ctx)
        state = self.states.get(request.args.get('state', [None])[0])
        script = (
          '''top.Ext.getCmp('oauthprocomun').close()'''
        )
        if state:
            code = request.args.get('code', [None])[0]
            oauth2Session, client = state
            client.session.oauthToken['procomun'] = oauth2Session.fetch_token(self.TOKEN_URL, client_secret=self.CLIENT_SECRET, code=code)
            script = ('''
                top.eXe.controller.eXeViewport.prototype.eXeNotificationStatus(top._('Publishing document to Procomún'), top._('Exporting package as SCORM'));
                top.nevow_clientToServerEvent('exportProcomun', this, '');
                top.Ext.getCmp('oauthprocomun').close()
            ''')
        return ctx.tag()[script]


class GDriveOauth(Renderable, rend.Page):
    name = 'gdrive'
    _templateFileName = 'oauth.html'

    def __init__(self, parent):
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)

    def render_start(self, ctx, data):
        script = ('''
            <html>
              <head>
                <title>Export Package to Google Drive</title>
                <script type="text/javascript">
                  function getAuthResult() {
                      var authResult = {};
                      var paramsString =  window.location.hash.substring(1);
                      var paramsArray = paramsString.split('&');
                      for (var i = 0; i < paramsArray.length; i++) {
                        var kvp = paramsArray[i].split('=');
                        console.log(kvp);

                        // Check multiple values
                        value = decodeURIComponent(kvp[1]).split('+');
                        if (value.length == 1) {
                          value = value[0];
                        }

                        key = decodeURIComponent(kvp[0]);

                        authResult[key] = value;
                      }
                      return authResult;
                  }
                  authResult = getAuthResult();
                  opener.eXe.controller.Toolbar.prototype.processExportGoogleDrive(authResult);
                  window.close();
                </script>
              </head>
              <body>
                <h1>Export Package to Google Drive</h1>
              </body>
            </html>''')
        return ctx.tag()[script]


class OauthPage(Renderable, rend.Page):
    name = 'oauth'
    _templateFileName = 'oauth.html'

    def __init__(self, parent):
        parent.putChild(self.name, self)
        Renderable.__init__(self, parent)
        rend.Page.__init__(self)
        self.procomun = ProcomunOauth(self)

    def child_procomun(self, ctx):
        return self.procomun