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

var ICON_MAP = {
	"directory": "../jsui/extjs/resources/themes/images/gray/tree/folder.gif"
};
var DEFAULT_ICON = "../jsui/extjs/resources/themes/images/gray/tree/leaf.gif";

Ext.define('eXe.view.ui.FileList', {
    extend: 'Ext.grid.Panel',
	alias: "widget.filelist",
	id: "filelist",
	title: 'Directory',
	autoScroll:true,
	collapsible: false,
	closeOnTab: true,
	viewConfig: {
        plugins: {
            ddGroup: 'FileGrid',
            ptype: 'gridviewdragdrop',
            enableDrop: false
        }
    },
    enableDragDrop   : true,
	stores: ['File', 'DirectoryTree'],
    initComponent: function() {
    	var me = this;
    	
        Ext.applyIf(me, {
        	store: 'File',
        	selModel: {
        		mode: "MULTI"
        	},
			defaults: {
				sortable: true
			},
			columns: [{
	           header: "Name",
	           dataIndex: 'name',
	           width: 250,
			   sortable: true,
	           renderer: function(value, p, record){
   			        var t = new Ext.Template("<img src=\"{0}\" alt=\"* \" align=\"absmiddle\" />&nbsp;<b>{1}</b>"),
   			        	icon;
   			        
   			        icon = ICON_MAP[record.get('type')];
					if (!icon)
						icon = DEFAULT_ICON;
			        return t.apply([icon, value] );
			    },
			    doSort: function(state) {
			        var ds = this.up('tablepanel').store;
			        ds.sort({
			            property: this.getSortParam(),
			            direction: state,
			    		sorterFn: ds.getSorter(this.getSortParam(), state)
			        });
			    }
	        },{
	           header: "Size",
	           dataIndex: 'size',
	           flex: 1,
	           maxWidth: 80,
	           align: 'right',
   	           renderer:  function(value){
   	           		sizes = [ "bytes", "KiB", "MiB", "GiB", "TiB" ];
   	           		for (i in sizes) {
   	           			if (value < 1024)
   	           				return value.toFixed(1) + " " + sizes[i];
   	           			value /= 1024;
   	           		}
   	           },
			   sortable: true,
			    doSort: function(state) {
			        var ds = this.up('tablepanel').store;
			        ds.sort({
			            property: this.getSortParam(),
			            direction: state,
			    		sorterFn: ds.getSorter(this.getSortParam(), state)
			        });
			    }
	        },{
	           header: "Type",
	           dataIndex: 'type',
	           hidden: true,
	           hideable: false
	        },{
	           header: "Modified",
	           dataIndex: 'modified',
	           flex: 1,
	           maxWidth: 200,
	           xtype: "datecolumn",
	           format: "D j M Y H:i:s T",
			   sortable: true,
			    doSort: function(state) {
			        var ds = this.up('tablepanel').store;
			        ds.sort({
			            property: this.getSortParam(),
			            direction: state,
			    		sorterFn: ds.getSorter(this.getSortParam(), state)
			        });
			    }
	        },{
	           header: "Perms",
	           dataIndex: 'perms',
	           hidden: true,
			   hideable: false
	        },{
	           header: "Owner",
	           dataIndex: 'owner',
	           hidden: true,
	           hideable: false
	        },{ 
	        	dataIndex: 'is_deletable', header: "is_deletable", hidden: true, hideable: false 
	        },{
	        	dataIndex: 'is_file', hidden: true, hideable: false 
	        },{
	        	dataIndex: 'is_archive', hidden: true, hideable: false 
	        },{
	        	dataIndex: 'is_writable', hidden: true, hideable: false 
	        },{
	        	dataIndex: 'is_chmodable', hidden: true, hideable: false 
	        },{
	        	dataIndex: 'is_readable', hidden: true, hideable: false 
	        },{	
	        	dataIndex: 'is_deletable', hidden: true, hideable: false 
	        },{	
	        	dataIndex: 'is_editable', hidden: true, hideable: false 
	        }
		    ]
        });

        me.callParent(arguments);
	}
});