Ext.define('Ext.ux.form.DateTimeField', {
	  extend: 'Ext.form.field.Date',
	  alias: 'widget.datetimefield',
	  requires: ['Ext.ux.DateTimePicker'],

	  // overwrite
	  createPicker: function() {
		  var me = this,
			  format = Ext.String.format;

		  return Ext.create('Ext.ux.DateTimePicker', {
			    ownerCt: me.ownerCt,
			    renderTo: document.body,
			    floating: true,
			    hidden: true,
			    focusOnShow: true,
			    minDate: me.minValue,
			    maxDate: me.maxValue,
			    disabledDatesRE: me.disabledDatesRE,
			    disabledDatesText: me.disabledDatesText,
			    disabledDays: me.disabledDays,
			    disabledDaysText: me.disabledDaysText,
			    format: me.format,
			    showToday: me.showToday,
			    startDay: me.startDay,
			    minText: format(me.minText, me.formatDate(me.minValue)),
			    maxText: format(me.maxText, me.formatDate(me.maxValue)),
			    listeners: {
				    scope: me,
				    select: me.onSelect
			    },
			    keyNavConfig: {
				    esc: function() {
					    me.collapse();
				    }
			    }
		    });
	  }
  });