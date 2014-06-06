/**
 * 时间输入框, 三个整数框分别输入时,分,秒.
 * @author wangzilong
 * update Ext - 4.1 2012/04/27
 */
Ext.define('Ext.ux.form.TimePickerField', {
	  extend: 'Ext.form.field.Base',
	  alias: 'widget.timepicker',
	  alternateClassName: 'Ext.form.field.TimePickerField',
	  requires: ['Ext.form.field.Number'],

	  // 隐藏BaseField的输入框 , hidden basefield's input
	  inputType: 'hidden',

	  style: 'padding:4px 0 0 0;margin-bottom:0px',

	  /**
	   * @cfg {String} value
	   * initValue, format: 'H:i:s'
	   */
	  value: null,

	  /**
	  * @cfg {Object} spinnerCfg
	  * 数字输入框参数, number input config
	  */
	  spinnerCfg: {
		  width: 40
	  },

	  /** Override. */
	  initComponent: function() {
		  var me = this;

		  me.value = me.value || Ext.Date.format(new Date(), 'H:i:s');

		  me.callParent();// called setValue

		  me.spinners = [];
		  var cfg = Ext.apply({}, me.spinnerCfg, {
			    readOnly: me.readOnly,
			    disabled: me.disabled,
			    style: 'float: left',
			    listeners: {
				    change: {
					    fn: me.onSpinnerChange,
					    scope: me
				    }
			    }
		    });

		  me.hoursSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, cfg, {
			      minValue: 0,
			      maxValue: 23
		      }));
		  me.minutesSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, cfg, {
			      minValue: 0,
			      maxValue: 59
		      }));
		  // TODO 使用timeformat 判断是否创建秒输入框, maybe second field is not always need.
		  me.secondsSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, cfg, {
			      minValue: 0,
			      maxValue: 59
		      }));

		  me.spinners.push(me.hoursSpinner, me.minutesSpinner, me.secondsSpinner);

	  },
	  /**
	      * @private
	      * Override.
	      */
	  onRender: function() {
		  var me = this, spinnerWrapDom, spinnerWrap;
		  me.callParent(arguments);

		  // render to original BaseField input td
		  // spinnerWrap = Ext.get(Ext.DomQuery.selectNode('div', this.el.dom)); // 4.0.2
		  spinnerWrapDom = Ext.dom.Query.select('td', this.getEl().dom)[1]; // 4.0 ->4.1 div->td
		  spinnerWrap = Ext.get(spinnerWrapDom);
		  me.callSpinnersFunction('render', spinnerWrap);

		  Ext.core.DomHelper.append(spinnerWrap, {
			    tag: 'div',
			    cls: 'x-form-clear-left'
		    });

		  this.setRawValue(this.value);
	  },

	  _valueSplit: function(v) {
		  if(Ext.isDate(v)) {
			  v = Ext.Date.format(v, 'H:i:s');
		  }
		  var split = v.split(':');
		  return {
			  h: split.length > 0 ? split[0] : 0,
			  m: split.length > 1 ? split[1] : 0,
			  s: split.length > 2 ? split[2] : 0
		  };
	  },
	  onSpinnerChange: function() {
		  if(!this.rendered) {
			  return;
		  }
		  this.fireEvent('change', this, this.getValue(), this.getRawValue());
	  },
	  // 依次调用各输入框函数, call each spinner's function
	  callSpinnersFunction: function(funName, args) {
		  for(var i = 0; i < this.spinners.length; i++) {
			  this.spinners[i][funName](args);
		  }
	  },
	  // @private get time as object,
	  getRawValue: function() {
		  if(!this.rendered) {
			  var date = this.value || new Date();
			  return this._valueSplit(date);
		  } else {
			  return {
				  h: this.hoursSpinner.getValue(),
				  m: this.minutesSpinner.getValue(),
				  s: this.secondsSpinner.getValue()
			  };
		  }
	  },

	  // private
	  setRawValue: function(value) {
		  value = this._valueSplit(value);
		  if(this.hoursSpinner) {
			  this.hoursSpinner.setValue(value.h);
			  this.minutesSpinner.setValue(value.m);
			  this.secondsSpinner.setValue(value.s);
		  }
	  },
	  // overwrite
	  getValue: function() {
		  var v = this.getRawValue();
		  return Ext.String.leftPad(v.h, 2, '0') + ':' + Ext.String.leftPad(v.m, 2, '0') + ':'
		    + Ext.String.leftPad(v.s, 2, '0');
	  },
	  // overwrite
	  setValue: function(value) {
		  this.value = Ext.isDate(value) ? Ext.Date.format(value, 'H:i:s') : value;
		  if(!this.rendered) {
			  return;
		  }
		  this.setRawValue(this.value);
		  this.validate();
	  },
	  // overwrite
	  disable: function() {
		  this.callParent(arguments);
		  this.callSpinnersFunction('disable', arguments);
	  },
	  // overwrite
	  enable: function() {
		  this.callParent(arguments);
		  this.callSpinnersFunction('enable', arguments);
	  },
	  // overwrite
	  setReadOnly: function() {
		  this.callParent(arguments);
		  this.callSpinnersFunction('setReadOnly', arguments);
	  },
	  // overwrite
	  clearInvalid: function() {
		  this.callParent(arguments);
		  this.callSpinnersFunction('clearInvalid', arguments);
	  },
	  // overwrite
	  isValid: function(preventMark) {
		  return this.hoursSpinner.isValid(preventMark) && this.minutesSpinner.isValid(preventMark)
		    && this.secondsSpinner.isValid(preventMark);
	  },
	  // overwrite
	  validate: function() {
		  return this.hoursSpinner.validate() && this.minutesSpinner.validate() && this.secondsSpinner.validate();
	  }
  });