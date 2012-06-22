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

Ext.define('eXe.view.ui.MainTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.maintabpanel',
    requires: [
        'eXe.view.forms.MetadataPanel',
        'eXe.view.forms.ExportPanel',
        'eXe.view.forms.PackagePanel'
    ],
    activeTab: 0,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'component',
                    itemId: 'authoring_panel',
                    contentEl: 'authoringIFrame',
                    title: _('Authoring')
                },
                {
                    xtype: 'tabpanel',
                    title: _('Properties'),
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'package',
                            itemId: 'package_properties',
                            title: _('Package')
                        },
                        {
                            xtype: 'tabpanel',
                            title: _('Metadata'),
                            items: [
	                            {
		                            xtype: 'metadata',
                                    itemId: 'metadata_properties',
	                                title: _('Dublin Core')
	                            },
                                {
                                    xtype: 'tabpanel',
                                    title: _('LOM'),
                                    items: [
	                                    {
	                                        xtype: 'panel',
	                                        title: _('General')
	                                    },
                                        {
                                            xtype: 'panel',
                                            title: _('Ciclo de vida')
                                        },
	                                    {
	                                        xtype: 'panel',
	                                        title: _('MetaMetadatos')
	                                    },
                                        {
                                            xtype: 'panel',
                                            title: _('Técnica')
                                        },
	                                    {
	                                        xtype: 'panel',
	                                        title: _('Uso educativo')
	                                    },
                                        {
                                            xtype: 'panel',
                                            title: _('Derechos')
                                        },
	                                    {
	                                        xtype: 'panel',
	                                        title: _('Relación')
	                                    },
                                        {
                                            xtype: 'panel',
                                            title: _('Anotación')
                                        },
	                                    {
	                                        xtype: 'panel',
	                                        title: _('Clasificación')
	                                    }
                                    ]
                                },
                                {
                                    xtype: 'tabpanel',
                                    title: _('LOM.es'),
                                    items: [
                                        {
                                            xtype: 'panel',
                                            title: _('General')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('Ciclo de vida')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('MetaMetadatos')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('Técnica')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('Uso educativo')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('Derechos')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('Relación')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('Anotación')
                                        },
                                        {
                                            xtype: 'panel',
                                            title: _('Clasificación')
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'export',
                            itemId: 'export_properties',
                            title: _('Export')
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});