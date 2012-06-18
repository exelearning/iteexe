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

Ext.define('eXe.controller.Toolbar', {
    extend: 'Ext.app.Controller',
    
    init: function() {
        this.control({
        	'#file_open': {
        		click: this.onFileOpen
        	}
        });
    },
    
    onFileOpen: function() {
		var f = Ext.create("eXe.view.ui.FilePicker", { title: "Open File", modal: true, callback: this.onFileOpenSelected });
		f.show();
    },
    
    onFileOpenSelected: function(fp, eOpts) {
    	switch (fp.status) {
    		case eXe.view.ui.FilePicker.returnOk:
    			nevow_clientToServerEvent('loadPackage', this, '', fp.file.path)
    			break;
    	}
    }
});