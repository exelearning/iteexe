/*
 * File: DateTimePicker.js
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This is part of the UX for DateTimeField developed by Guilherme Portela 
 */
 Ext.define('Ext.ux.DateTimePicker', {
    extend: 'Ext.picker.Date',
    alias: 'widget.datetimepicker',
    requires: [
    'Ext.picker.Date',
    'Ext.slider.Single',
    'Ext.form.field.Time',
    'Ext.form.Label'
    ],
    todayText : 'Current Date',
    childEls: [
        'innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl', 'footerEl'
    ],
    renderTpl: [
      '<tpl if="Ext.getVersion().major &gt; 4">',
      '<div id="{id}-innerEl" data-ref="innerEl">',
      '<div class="{baseCls}-header">',
      '<div id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="button" title="{prevText}"></div>',
      '<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month" role="heading">{%this.renderMonthBtn(values, out)%}</div>',
      '<div id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="button" title="{nextText}"></div>',
      '</div>',
      '<table role="grid" id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" {%',
      // If the DatePicker is focusable, make its eventEl tabbable.
      'if (values.$comp.focusable) {out.push("tabindex=\\\"0\\\"");}',
      '%} cellspacing="0">',
      '<thead><tr role="row">',
      '<tpl for="dayNames">',
      '<th role="columnheader" class="{parent.baseCls}-column-header" aria-label="{.}">',
      '<div role="presentation" class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
      '</th>',
      '</tpl>',
      '</tr></thead>',
      '<tbody><tr role="row">',
      '<tpl for="days">',
      '{#:this.isEndOfWeek}',
      '<td role="gridcell" id="{[Ext.id()]}">',
      '<div hidefocus="on" class="{parent.baseCls}-date"></div>',
      '</td>',
      '</tpl>',
      '</tr></tbody>',
      '</table>',
      '<tpl if="showToday">',
      '<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
      '</tpl>',
      '</div>',
      '<tpl else>',
      '<div id="{id}-innerEl" role="grid">',
      '<div role="presentation" class="{baseCls}-header">',
     // the href attribute is required for the :hover selector to work in IE6/7/quirks
      '<a id="{id}-prevEl" class="{baseCls}-prev {baseCls}-arrow" href="#" role="button" title="{prevText}" hidefocus="on" ></a>',
      '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
       // the href attribute is required for the :hover selector to work in IE6/7/quirks
      '<a id="{id}-nextEl" class="{baseCls}-next {baseCls}-arrow" href="#" role="button" title="{nextText}" hidefocus="on" ></a>',
      '</div>',
      '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
      '<thead role="presentation"><tr role="row">',
      '<tpl for="dayNames">',
      '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
      '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
      '</th>',
      '</tpl>',
      '</tr></thead>',
      '<tbody role="presentation"><tr role="row">',
      '<tpl for="days">',
      '{#:this.isEndOfWeek}',
      '<td role="gridcell" id="{[Ext.id()]}">',
      // the href attribute is required for the :hover selector to work in IE6/7/quirks
      '<a role="button" hidefocus="on" class="{parent.baseCls}-date" href="#"></a>',
      '</td>',
      '</tpl>',
      '</tr></tbody>',
      '</table>',
      '<tpl if="showToday">',
      '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
      '</tpl>',
      '</div>',
      '</tpl>',
      {
        firstInitial: function(value) {
            return Ext.picker.Date.prototype.getDayInitial(value);
        },
        isEndOfWeek: function(value) {
            // convert from 1 based index to 0 based
            // by decrementing value once.
            value--;
            var end = value % 7 === 0 && value !== 0;
            return end ? '</tr><tr role="row">' : '';
        },
        renderTodayBtn: function(values, out) {
            Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
        },
        renderMonthBtn: function(values, out) {
            Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
        }
    }],
    initComponent : function() {
        var me = this,
        dtAux = me.value ? new Date(me.value) : new Date();

        me.selectedCls = me.baseCls + '-selected';
        me.disabledCellCls = me.baseCls + '-disabled';
        me.prevCls = me.baseCls + '-prevday';
        me.activeCls = me.baseCls + '-active';
        me.cellCls = me.baseCls + '-cell';
        me.nextCls = me.baseCls + '-prevday';
        me.todayCls = me.baseCls + '-today';
        dtAux.setSeconds(0);

        if (!me.format) {
            me.format = Ext.Date.defaultFormat;
        }
        if (!me.dayNames) {
            me.dayNames = Ext.Date.dayNames;
        }
        me.dayNames = me.dayNames.slice(me.startDay).concat(me.dayNames.slice(0, me.startDay));

        me.callParent();

        me.value = new Date(dtAux);

        //me.addEvents (
            /**
             * @event select
             * Fires when a date is selected
             * @param {Ext.picker.Date} this DatePicker
             * @param {Date} date The selected date
             */
         //   'select'
        //);

        Ext.apply(me,{
            timeFormat: ~me.format.indexOf("h") ? 'h' : 'H',
            changeTimeValue : function (slider, e, eOpts) {
                var label =  slider.up().down('toolbar').down('label'),
                hourPrefix = '',
                minutePrefix = me.minuteSlider.getValue() < 10 ? '0' : ''
                timeSufix = '',
                hourDisplay = me.hourSlider.getValue(),
                auxDate = new Date();

                if (me.timeFormat == 'h') {
                    timeSufix = me.hourSlider.getValue() < 12 ? ' AM' : ' PM';
                    hourDisplay = me.hourSlider.getValue() < 13 ? hourDisplay : hourDisplay - 12;
                    hourDisplay = hourDisplay || '12';
                }
                hourPrefix = hourDisplay < 10 ? '0' : ''

                label.setText(hourPrefix + hourDisplay + ':' + minutePrefix + me.minuteSlider.getValue() + timeSufix);

                if(me.pickerField && me.pickerField.getValue()) {
                    me.pickerField.setValue(new Date(me.pickerField.getValue().setHours(me.hourSlider.getValue(),me.minuteSlider.getValue())))
                }
            }
        }); 
        
        me.initDisabledDays();
    },
    beforeRender: function () {
        var me = this;
        me.hourSlider = new Ext.slider.Single({
            xtype: 'slider',
            fieldLabel: 'Hour',
            labelAlign: 'top',
            labelSeparator: ' ',
            value: 0,
            minValue: 0,
            maxValue: 23,
            vertical: true,
            listeners: {
                change : me.changeTimeValue
            },
            scope: me
        });

        me.minuteSlider = new Ext.slider.Single({
            fieldLabel: 'Minutes',
            labelAlign: 'top',
            labelSeparator: ' ',
            value: 0,
            increment: 1,
            minValue: 0,
            maxValue: 59,
            vertical: true,
            listeners: {
                change : me.changeTimeValue
            },
            scope: me
        });       
        me.callParent();
    },
    afterRender: function() {
        var me = this,
            el = me.el;
        
        me.timePicker = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            border: false,
            defaults: {
                flex: 1,
                margin: 10
            },
            width: 130,
            floating: true,
            
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                ui: 'footer',
                items: [
                    '->',
                    {
                        xtype: 'label',
                        text: me.timeFormat == 'h' ? '12:00 AM' : '00:00'
                    },
                    '->'
                ]
            }],
            items: [me.hourSlider,me.minuteSlider]
        });
        
        me.callParent();
    },
    onShow: function () {
        var me = this;
        me.showTimePicker();
        me.callParent();
    },
    showTimePicker: function() {
      var me = this,
          el = me.el,
          timePicker = me.timePicker;
      Ext.defer(function() {
          var body = Ext.getBody(),
              bodyWidth = body.getViewSize().width,
              xPos = (bodyWidth < (el.getX()+el.getWidth() + 140)) ? (el.getX() - 140) : (el.getX()+el.getWidth() + 10);
            
            me.timePicker.setHeight(el.getHeight());
            me.timePicker.setPosition(xPos, el.getY());
            me.timePicker.show();
        },1);
    },
    onHide: function () {
        var me = this;
        me.timePicker.hide();
        me.callParent();
    },
    beforeDestroy: function() {
        var me = this;

        if (me.rendered) {
            Ext.destroy(
                me.timePicker,
                me.minuteSlider,
                me.hourSlider
            );
        }
        me.callParent();
    },
    setValue : function(value){
        value.setSeconds(0);
        this.value = new Date(value);
        return this.update(this.value);
    },
    selectToday : function(){
        var me = this,
            btn = me.todayBtn,
            handler = me.handler
            auxDate = new Date;

        if(btn && !btn.disabled){
            me.setValue(new Date(auxDate.setSeconds(0)));
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;
    },
    handleDateClick : function(e, t){
        var me = this,
            handler = me.handler,
            hourSet = me.timePicker.items.items[0].getValue(),
            minuteSet = me.timePicker.items.items[1].getValue(),
            auxDate = new Date(t.dateValue);
        e.stopEvent();
        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
            me.doCancelFocus = me.focusOnSelect === false;
            auxDate.setHours(hourSet, minuteSet,0);
            me.setValue(new Date(auxDate));
            delete me.doCancelFocus;
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    },
    selectedUpdate: function(date){
        var me          = this,
            dateOnly    = Ext.Date.clearTime(date, true),
            t           = dateOnly.getTime(),
            currentDate = (me.pickerField && me.pickerField.getValue()) || new Date(),
            cells       = me.cells,
            cls         = me.selectedCls,
            cellItems   = cells.elements,
            c,
            cLen        = cellItems.length,
            cell;

        cells.removeCls(cls);

        for (c = 0; c < cLen; c++) {
            cell = Ext.fly(cellItems[c]);

            if (cell.dom.firstChild.dateValue == t) {
                me.fireEvent('highlightitem', me, cell);
                cell.addCls(cls);

                if(me.isVisible() && !me.doCancelFocus){
                    Ext.fly(cell.dom.firstChild).focus(50);
                }

                break;
            }
        }
        if(currentDate) {
            me.timePicker.items.items[0].setValue(currentDate.getHours());
            me.timePicker.items.items[1].setValue(currentDate.getMinutes());
            me.changeTimeValue(me.timePicker.items.items[0]);
        }
        
    }    
});

