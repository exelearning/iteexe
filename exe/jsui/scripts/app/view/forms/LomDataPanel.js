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

Ext.define('eXe.view.forms.LomDataPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.lomdata',

    requires: ['eXe.view.forms.HelpContainer'],
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
	            {
	                xtype: 'panel',
	                title: _('General')
	            },
	            {
	                xtype: 'panel',
	                title: _('Life Cycle')
	            },
	            {
	                xtype: 'panel',
	                title: _('Meta-Metadata')
	            },
	            {
	                xtype: 'panel',
	                title: _('Technical')
	            },
	            {
	                xtype: 'panel',
	                title: _('Educational')
	            },
	            {
	                xtype: 'panel',
	                title: _('Rights')
	            },
	            {
	                xtype: 'panel',
	                title: _('Relation')
	            },
	            {
	                xtype: 'panel',
	                title: _('Annotation')
	            },
	            {
	                xtype: 'panel',
	                title: _('Classification')
	            }
            ]
        });

        me.callParent(arguments);
    }

});