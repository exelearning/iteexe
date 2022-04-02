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

Ext.define('eXe.controller.Outline', {
    extend: 'Ext.app.Controller',

    stores: ['OutlineXmlTreeStore'],
    
    refs: [{
	    	selector: '#outline_treepanel',
	    	ref: 'outlineTreePanel'
    	}, {
    		selector: '#outline_add_node',
    		ref: 'outlineAddNodeBtn'
    	}, {
    		selector: '#outline_del_node',
    		ref: 'outlineDelNodeBtn'
    	}, {
    		selector: '#outline_ren_node',
    		ref: 'outlineRenNodeBtn'
    	}, {
    		selector: 'outlinetoolbar1',
    		ref: 'outlineToolBar1'
    	}
    ],
    
    init: function() {
        this.control({
        	'#outline_treepanel': {
        		itemclick:	this.onNodeClick,
                itemdblclick: this.onNodeRename,
                itemcontextmenu: this.onNodeContextMenu
        	},
        	'#outline_add_node': {
        		click: this.onNodeAdd
        	},
        	'#outline_del_node': {
        		click: this.onNodeDel
        	},
        	'#outline_ren_node': {
        		click: this.onNodeRename
        	},
            '#outline_promote_node': {
                click: { fn: this.processNodeEvent, action: 'PromoteNode' }
            },
            '#outline_demote_node': {
                click: { fn: this.processNodeEvent, action: 'DemoteNode' }
            },
            '#outline_up_node': {
                click: { fn: this.processNodeEvent, action: 'UpNode' }
            },
            '#outline_down_node': {
                click: { fn: this.processNodeEvent, action: 'DownNode' }
            }
        });
        
        var keymap = new Ext.util.KeyMap(Ext.getBody(), [
	        {
               	 key: Ext.EventObject.INSERT,
		    	 handler: function() {
		    		 this.onNodeAdd();
		    	 },
		         ctrl: true,
		    	 scope: this,
		    	 defaultEventAction: "stopEvent"
		     },
		     {
		    	 key: Ext.EventObject.DELETE,
		    	 handler: function() {
		    		 this.onNodeDel();
		    	 },
		         ctrl: true,
		    	 scope: this,
		    	 defaultEventAction: "stopEvent"
		     },
		     {
		    	 key: Ext.EventObject.R,
                 ctrl: true,
		    	 handler: function() {
		    		 this.onNodeRename();
		    	 },
		    	 scope: this,
		    	 defaultEventAction: "stopEvent"
		     },
		     {
		    	 key: Ext.EventObject.UP,
                 ctrl: true,
		    	 handler: function() {
		    		 this.nodeAction('PromoteNode');
		    	 },
		    	 scope: this,
		    	 defaultEventAction: "stopEvent"
		     },
		     {
		    	 key: Ext.EventObject.DOWN,
                 ctrl: true,
		    	 handler: function() {
		    		 this.nodeAction('DemoteNode');
		    	 },
		    	 scope: this,
		    	 defaultEventAction: "stopEvent"
		     },
		     {
		    	 key: Ext.EventObject.U,
                 ctrl: true,
		    	 handler: function() {
		    		 this.nodeAction('UpNode');
		    	 },
		    	 scope: this,
		    	 defaultEventAction: "stopEvent"
		     },
		     {
		    	 key: Ext.EventObject.D,
                 ctrl: true,
		    	 handler: function() {
		    		 this.nodeAction('DownNode');
		    	 },
		    	 scope: this,
		    	 defaultEventAction: "stopEvent"
		     }
        ]);        
    },

    onNodeContextMenu: function(view, record, item, index, e, eOpts) {
        if (this.checkActiveIdevice()==false) return false;
        e.preventDefault();
        this.onNodeClick(view, record, item, index, e, eOpts);
        var contextMenu = new Ext.menu.Menu({
		  items: [
            {
			    text: _('Insert elp in this page'),
			    handler: this.getController('Toolbar').insertPackage
		    },{
			    text: _('Export this page as elp'),
			    handler: this.getController('Toolbar').extractPackage
            }
          ]
		});
        var x = e.browserEvent.clientX;
        var y = e.browserEvent.clientY;
        contextMenu.showAt([x, y]);
    },

    processNodeEvent: function(menu, item, e, eOpts) {
        if (this.checkActiveIdevice()==false) return false;
        this.nodeAction(e.action)
    },
    
    nodeAction: function(action) {
        var outlineTreePanel = this.getOutlineTreePanel(),
            selected = outlineTreePanel.getSelectionModel().getSelection(),
            nodeid = '0';
        
        if (selected != 0)
            nodeid = selected[0].data.id;
        this.disableButtons();
        nevow_clientToServerEvent(action, this, '', nodeid);
    },
    
    onLaunch: function() {
    	this.reload();
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
    
    onNodeClick: function(view, record, item, index, e, eOpts) {
    	if (this.checkActiveIdevice()==false) return false;
    	this.loadNodeOnAuthoringPage(record.data.id);
        document.title = "eXe : " + record.data.text;
    },
    
    onNodeAdd: function(button, e, eOpts) {
		if (this.checkActiveIdevice()==false) return false;
		var outlineTreePanel = this.getOutlineTreePanel(),
    		selected = outlineTreePanel.getSelectionModel().getSelection(),
    		nodeid = '0';
    	
    	if (selected != 0)
    		nodeid = selected[0].data.id;
    	this.disableButtons();
		nevow_clientToServerEvent('AddChild', this, '', nodeid);    		
    },
    
    onNodeDel: function(button, e, eOpts) {
		var outlineTreePanel = this.getOutlineTreePanel(),
    		selected = outlineTreePanel.getSelectionModel().getSelection(),
    		nodeid = '0', msg;
    	
    	if (selected != 0)
    		nodeid = selected[0].data.id;
    	if (nodeid != '0') { 
    		msg = new Ext.Template(_('Delete "{node}" node and all its children?')).apply({node: selected[0].data.text});
    		Ext.Msg.show( {
    			title: _('Confirm'),
    			msg: msg,
    			scope: this,
    			modal: true,
    			buttons: Ext.Msg.YESNO,
    			fn: function(button) {
					if (button == "yes")	{
						this.disableButtons();
						nevow_clientToServerEvent('DelNode', this, '', nodeid);
			    	}
    			}
    		});
    	}
	},

    onNodeRename: function() {
    	if (this.checkActiveIdevice()==false) return false;
    	var outlineTreePanel = this.getOutlineTreePanel(),
    		selected = outlineTreePanel.getSelectionModel().getSelection(),
    		nodeid = '0', title;
    	
    	if (selected != 0)
    		nodeid = selected[0].data.id;
		title = new Ext.Template(_('Rename "{node}" node')).apply({node: selected[0].data.text});
		Ext.Msg.show({
			prompt: true,
			title: title,
			msg: _('Enter the new name:'),
			buttons: Ext.Msg.OKCANCEL,
			multiline: false,
			value: selected[0].data.text,
			scope: this,
			fn: function(button, text) {
				if (button == "ok")	{
					if (text) {
						this.disableButtons();
						nevow_clientToServerEvent('RenNode', this, '', nodeid, text);
					}
		    	}
			}
		});
    },

    loadNodeOnAuthoringPage: function(node) {
        var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
        if (authoring && authoring.submitLink)
    		authoring.submitLink('changeNode', node, 0);
    },
    
    //called from exe.jsui.outlinepane.OutlinePane.handleSetTreeSelection
    select: function(nodeid) {
    	var outlineTreePanel = this.getOutlineTreePanel(),
    		selmodel = outlineTreePanel.getSelectionModel(),
    		store = this.getOutlineXmlTreeStoreStore(), node;
    		
        outlineTreePanel.expandAll();
    	node = store.getNodeById(nodeid);
    	if (node) {
    		selmodel.select(node);
            document.title = "eXe : " + node.data.text;
    	}
    	this.enableButtons();
    },
    
    enableButtons: function() {
    	this.getOutlineAddNodeBtn().enable();
    	this.getOutlineDelNodeBtn().enable();
    	this.getOutlineRenNodeBtn().enable();
    },
    
    disableButtons: function() {
    	this.getOutlineAddNodeBtn().disable();
    	this.getOutlineDelNodeBtn().disable();
    	this.getOutlineRenNodeBtn().disable();
    },

    reload: function() {
    	var store = this.getOutlineXmlTreeStoreStore();
    	store.load();
    }
});