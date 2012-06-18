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

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    name: 'eXe',

    stores: [
        'OutlineXmlTreeStore',
        'IdeviceXmlStore',
        'DirectoryTree',
        'File'
    ],

    models: [
    	'Directory',
    	'File'
    ],
    
    controllers: [
    	'Idevice',
    	'Outline',
    	'Toolbar',
    	'Directory',
    	'File'
    ],
    
    launch: function() {
        Ext.QuickTips.init();

        eXe.app = this;
        var cmp1 = Ext.create('eXe.view.eXeViewport', {
            renderTo: Ext.getBody()
        });
        cmp1.show();
    },

    appFolder: "jsui/app"
});