// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================

Ext.define('eXe.controller.eXeViewport', {
    extend: 'Ext.app.Controller',
    
    gDriveNotificationStatus : function(message) {
        notif = Ext.ComponentQuery.query("#gDriveNotification")[0];
        notif.update(message);
        notif.show();
    },

    gDriveNotificationNotice : function(message, errLevel) {
        switch (errLevel) {
        case 'info' :
        case 'notice' :
            windowTitle = 'Google Drive';
            windowClass = 'ux-notification-icon-information';
            break;

        case 'warning' :
        case 'error' :
            windowTitle = 'Google Drive error';
            windowClass = 'ux-notification-icon-error';
            break;

        default :
            windowTitle = 'Google Drive';
            windowClass = 'ux-notification-icon-error';
            break;
        }
        
        Ext.create('widget.uxNotification', {
            title: windowTitle,
            position: 'br',
            cls: 'ux-notification-light',
            iconCls: windowClass,
            autoClose: false,
            spacing: 20,
            html: message
        }).show();
    }
});