// ===========================================================================
// eXe
Ext.define('eXe.controller.StyleManager', {
    extend: 'Ext.app.Controller',
    
    requires: ['eXe.view.forms.StyleManagerPanel'],
    
    init: function() {
        this.control({
            '#style_download': {
                click:	this.onStyleDownloadClick
            }
        });
    },
    
    onStyleDownloadClick: function(view, record, item, index, e, eOpts) {
        var formpanel = view.up('form');
        var form, field, url;
        
        form = formpanel.getForm();
        field = form.findField('style_download_url');
        url = field.value;
        
        nevow_clientToServerEvent('styleDownload', this, '', url);
    },
});