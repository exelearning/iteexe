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

Ext.define('eXe.view.forms.HelpContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.helpcontainer',
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            xtype: 'container',
            layout: 'anchor',
            items: [
                {
		            xtype: 'container',
		            layout: 'hbox',
                    anchor: '100%',
		            items: [
		                {
		                    xtype: 'container',
		                    layout: 'anchor',
		                    flex: this.flex != undefined? this.flex : 1,
		                    items: this.item
		                },
		                {
		                    xtype: 'container',
		                    layout: 'anchor',
		                    flex: 0,
		                    items: [
		                        {
		                            xtype: 'image',
		                            src: '/images/info.png',
		                            margin: '3 0 0 4',
		                            height: 16,
		                            width: 16,
		                            anchor: '100%',
                                    listeners: {
                                        afterrender: function(c) {
                                            c.el.on('click', function(a) {
                                                var help = this.items.getByKey(this.item.inputId + "_help");
                                                if (help.isVisible())
                                                    help.hide();
                                                else
                                                    help.show();
                                            }, me);
                                        }
                                    }
		                        }
		                    ]
		                }
		            ] 
                },{
                    xtype: 'component',
                    itemId: this.item.inputId + "_help",
                    html: this.help,
                    margin: '0 0 20 120',
                    hidden: true,
                    anchor: '100%'
                }
            ]
        });
        
        me.callParent(arguments);
    }
});

