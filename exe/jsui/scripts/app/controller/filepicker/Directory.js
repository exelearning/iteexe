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

Ext.define('eXe.controller.filepicker.Directory', {
	stores: ['filepicker.DirectoryTree'],
    extend: 'Ext.app.Controller',
    refs: [{
        ref: 'filesList',
        selector: 'filelist'
    },{
        ref: 'dirTree',
        selector: 'dirtree'
    },{
    	ref: 'placeField',
    	selector: '#file_place_field'
    }
    ],
    
    init: function() {
		this.control({
			'dirtree': {
				selectionchange: this.onDirSelect
			}
		});
		
		this.application.on({
			dirchange: this.loadDirectory,
			scope: this
		});
	},
	loadDirectory: function(selection, clear) {
        var dirtree = this.getDirTree(),
            sep = '_RRR_', path;

        if (clear === true)
            this.getPlaceField().setValue("");
        this.getPlaceField().focus();
        if (selection[0] == "/")
	        path = sep + '/' + selection.replace(/\//g, sep);
	    else {
        	path = sep + '/' + sep + selection.replace(/\\/g, sep);
			path = path.replace(/_RRR_$/, '');	    	
	    }
        dirtree.expandPath(path, "text", sep, function() {
            if (selection == "/")
                dirtree.getSelectionModel().select(dirtree.getRootNode());
            else {
                dirtree.selectPath(path, "text", sep);
            }
        }, this);
	},
	
	onDirSelect: function( selModel, selection ) {
        var dir = selection[0].data.id == "root"? "/": selection[0].data.id;

        if (!selection[0].data.icon)
            this.application.fireEvent('dirchange', dir);
        else
            this.application.fireEvent('error', _('You do not have the permissions to open folder') + ' ' + dir);
    }
});
