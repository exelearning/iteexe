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

Ext.define('eXe.store.filepicker.DirectoryTree', {
    extend: 'Ext.data.TreeStore',
    sorters: [
    	{
    		sorterFn: function(o1, o2){
    			var o1name = o1.get("text"), o2name = o2.get("text");
    				
	            return o1name.localeCompare(o2name);
        	}
    	}
    ],
    proxy: {
		type: "ajax",
        url: "dirtree",
        extraParams:{ action:"getdircontents", sendWhat: "dirs" },
		reader: {
			type: "json",
			root: "items",
			totalProperty: "totalCount"
		}
    },
    fields: [{ name: 'realtext' }, { name: 'text' }],
   	root: {
        text: '/',
        realtext: '/'
    },
    listeners: {
        beforeload: {
            fn: function(store, operation) {
            	var params = operation.getParams();
            	if(operation.node && operation.node.id === "root") {
            		params.node = "/";
            		operation.setParams(params);
            	}
            }
        }
    }
});