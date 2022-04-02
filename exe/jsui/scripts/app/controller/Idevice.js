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

Ext.define('eXe.controller.Idevice', {
    extend: 'Ext.app.Controller',

    stores: ['IdeviceXmlStore'],
    
    init: function() {
        this.control({
            '#idevice_panel': {
                itemclick:	this.onIdeviceClick
            }
        });
    },
    
    checkActiveIdevice: function(){
        var iframe = document.getElementsByTagName('iframe');
        if (iframe.length==1) {
            iframe = iframe[0];
            var doc = iframe.contentWindow.document;
            var btn = doc.getElementById("exe-submitButton");
            if (btn) {
                Ext.Msg.alert(
                    _('Info'),
                    _("Cannot leave the iDevice editor. The changes you made will be lost if you navigate away from this page.")
                );				
                return false;
            } else {
                return true;
            }
        }		
        return true;
    },    
    
    onIdeviceClick: function(view, record, item, index, e, eOpts) {
        if (this.checkActiveIdevice()==false) return false;
        var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
        if (authoring && authoring.submitLink && !view.panel.editing) {
            var outlineTreePanel = eXe.app.getController("Outline").getOutlineTreePanel(),
                selected = outlineTreePanel.getSelectionModel().getSelection();
            authoring.submitLink("AddIdevice", record.data.id, 1, selected !== 0? selected[0].data.id : '0');
        }
    },
    
    reload: function() {
        var store = this.getIdeviceXmlStoreStore();
        store.load();
    }
});