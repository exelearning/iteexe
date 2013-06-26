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
    extend: 'Ext.form.Panel',
    alias: 'widget.lomdata',

    requires: [
        'eXe.view.forms.HelpContainer',
        'eXe.view.forms.InsertDeleteFieldSet',
        'eXe.view.forms.LangContainer',
        'eXe.view.forms.LomSections',
        'eXe.view.forms.LomWidgets'
    ],

    clear: function() {
        var widgets = eXe.view.forms.LomWidgets, removed;

        Ext.suspendLayouts();
        Ext.destroy(this.removeAll(true));
        this.add([
            widgets.section(_('General'), this.prefix + 'general', false, true, true ),
            widgets.section(_('Life Cycle'), this.prefix + 'lifeCycle', false, false, true),
            widgets.section(_('Meta-Metadata'), this.prefix + 'metaMetadata', false, true, true),
            widgets.section(_('Technical'), this.prefix + 'technical', false, false, true),
            widgets.section(_('Educational'), this.prefix + 'educational', true, true, false),
            widgets.section(_('Rights'), this.prefix + 'rights', false, true, true),
            widgets.section(_('Relation'), this.prefix + 'relation', true, false, false),
            widgets.section(_('Annotation'), this.prefix + 'annotation', true, false, false),
            widgets.section(_('Classification'), this.prefix + 'classification', true, false, false),
            {
                xtype: 'button',
                text: _('Save'),
                itemId: 'save_properties'
            }
        ]);
        Ext.resumeLayouts(true);
    },

    initComponent: function() {
        var me = this,
            widgets = eXe.view.forms.LomWidgets;

        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            defaults: {
                margin: 20
            },
            items: [
                widgets.section(_('General'), this.prefix + 'general', false, true, true ),
                widgets.section(_('Life Cycle'), this.prefix + 'lifeCycle', false, false, true),
                widgets.section(_('Meta-Metadata'), this.prefix + 'metaMetadata', false, true, true),
                widgets.section(_('Technical'), this.prefix + 'technical', false, false, true),
                widgets.section(_('Educational'), this.prefix + 'educational', true, true, false),
                widgets.section(_('Rights'), this.prefix + 'rights', false, true, true),
                widgets.section(_('Relation'), this.prefix + 'relation', true, false, false),
                widgets.section(_('Annotation'), this.prefix + 'annotation', true, false, false),
                widgets.section(_('Classification'), this.prefix + 'classification', true, false, false),
                {
                    xtype: 'button',
                    text: _('Save'),
                    itemId: 'save_properties'
                }
            ]
        });

        me.callParent(arguments);
    }
});
