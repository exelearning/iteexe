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

var sorterFNS = function(o1, o2){
	var o1type = o1.get("type"), o2type = o2.get("type"),
		o1name = o1.get(this.property), o2name = o2.get(this.property);
		
    if (o1type == o2type) {
    	if (this.property == "name")
    		return o1name.localeCompare(o2name);
    	else
    		return o1name - o2name;
    }
    else if (o1type == "directory") {
    	if (this.direction == "ASC")
    		return -1;
    	else
    		return 1;
    }
    else if (o2type == "directory") {
    	if (this.direction == "ASC")
    		return 1;
    	else
    		return -1;
    }
	if (this.property == "name")
		return o1name.localeCompare(o2name);
	else
		return o1name - o2name;
};

Ext.define('eXe.store.filepicker.File', {
    extend: 'Ext.data.Store',
    model: 'eXe.model.filepicker.File',
    remoteSort: false,
    currentDir: "",
    proxy: {
		type: "ajax",
        url: "dirtree",
        extraParams:{ action:"getdircontents" },
		reader: {
			type: "json",
			rootProperty: "items",
			totalProperty: "totalCount"
		}
    },
    /* ExtJS Upgrade: Check if this is the cause of an error message
    getSorter: function(name, direction) {
    	return sorterFNS;
    },
    sorters: [
    	{
    		property: "name",
    		direction: "ASC",
    		sorterFn: sorterFNS
    	}
    ],*/
    
    listeners: {
        load: {
            fn: function(store, records, successful) {
            	var combo = eXe.app.getController('filepicker.File').getPlaceField();
            	if (combo)
            		delete combo.prevqe;
		        if (successful) {
                    var combo = eXe.app.getController('filepicker.File').getFiletypeCombo();
					store.filterBy( function(record, id) {
					    if (record.get("type") == "directory" || !combo)
					        return true;
					    return record.get("name").match(combo.value);
					});
		        }
		    }
        },
    	beforeload: {
    		fn: function( store, operation, opts ) {
    			if( operation.params && operation.params.dir ) {
    			 	this.currentDir = operation.params.dir
        		}
                else {
    				operation.params["dir"] = this.currentDir
        		}
    		},
    		scope: this
    	}
    }
});