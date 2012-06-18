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

Ext.define('eXe.view.forms.ExportPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.export',

    requires: ['eXe.view.forms.HelpContainer'],
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            autoScroll: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: _('SCORM 1.2 Options'),
                    margin: 10,
                    items: [
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'checkboxfield',
	                            inputId: 'pp_scolinks',
	                            boxLabel: _('Add Previous/Next links within SCOs?'),
                                inputValue: true,
                                uncheckedValue: false,
	                            tooltip: _('Checking this box will cause eXe to add Previous and Next links to individual pages within your SCO. The LMS will also still add this kind of functionality.'),
                            },
                            flex: 0,
                            help: _('Checking this box will cause eXe to add Previous and Next links to individual pages within your SCO.  This requires a non-standard extension to SCORM 1.2 and is only known to work with some versions of Moodle.')
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: _('Apply'),
                    margin: 10,
                    itemId: 'apply'
                }
            ]
        });

        me.callParent(arguments);
    }

});