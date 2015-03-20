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

Ext.define('eXe.store.OutlineXmlTreeStore', {
    extend: 'Ext.data.TreeStore',

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'OutlineXmlTreeStore',
            root: {
            	loaded: true
            },
            
            proxy: {
                type: 'ajax',
                url: 'outlinePane', //Modified on beforeload
                reader: {
                    type: 'xml',
                    rootProperty: 'nodes',
                    record: 'node'
                }
            }
        }, cfg)]);
    },
    listeners: {
    	beforeload: function(store, operation, eOpts){
    		this.proxy.url = location.pathname + "/" + 'outlinePane';
    		return true;
    	},
    	
    	load: function() {
			nevow_clientToServerEvent('setTreeSelection', this, '');
    	}
    }    
});