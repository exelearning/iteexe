/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * Barebones iframe implementation. For serious iframe work, see the ManagedIFrame extension
 * (http://www.sencha.com/forum/showthread.php?71961).
 *
 * @class Ext.ux.IFrame
 */
Ext.define('Ext.ux.IFrame', {
    extend: 'Ext.Component',

    alias: 'widget.uxiframe',

    loadMask: 'Loading...',

    src: 'about:blank',

    renderTpl: [
        '<iframe src="{src}" name="{frameName}" width="100%" height="100%" frameborder="0"></iframe>'
    ],

    initComponent: function () {
        this.callParent();

        this.frameName = this.frameName || this.id + '-frame';

        this.addEvents(
            'beforeload',
            'load'
        );

        Ext.apply(this.renderSelectors, {
            iframeEl: 'iframe'
        });
    },

    initEvents : function() {
        var me = this,
            iframeEl = me.iframeEl.dom,
            frameEl = me.getFrame();
        me.callParent();
        me.iframeEl.on('load', me.onLoad, me);
    },

    initRenderData: function() {
        return Ext.apply(this.callParent(), {
            src: this.src,
            frameName: this.frameName
        });
    },

    getBody: function() {
        var doc = this.getDoc();
        return doc.body || doc.documentElement;
    },

    getDoc: function() {
        try {
            return this.getWin().document;
        } catch (ex) {
            return null;
        }
    },

    getWin: function() {
        var me = this,
            name = me.frameName,
            win = Ext.isIE
                ? me.iframeEl.dom.contentWindow
                : window.frames[name];
        return win;
    },

    getFrame: function() {
        var me = this;
        return me.iframeEl.dom;
    },

    beforeDestroy: function () {
        var me = this,
            doc, prop;

        if (me.rendered) {
            try {
                doc = me.getDoc();
                if (doc) {
                    me.removeAll(doc);
                    for (prop in doc) {
                        if (doc.hasOwnProperty && doc.hasOwnProperty(prop)) {
                            delete doc[prop];
                        }
                    }
                }
            } catch(e) { }
        }

        me.callParent();
    },

    removeListener : function(element, eventName, fn, scope) {
        
        if (typeof eventName !== 'string') {
            EventManager.prepareListenerConfig(element, eventName, true);
            return;
        }

        var dom = Ext.getDom(element),
            el = element.dom ? element : dom,
            cache = EventManager.getEventListenerCache(el, eventName),
            bindName = EventManager.normalizeEvent(eventName).eventName,
            i = cache.length, j,
            listener, wrap, tasks;


        while (i--) {
            listener = cache[i];

            if (listener && (!fn || listener.fn == fn) && (!scope || listener.scope === scope)) {
                wrap = listener.wrap;

                
                if (wrap.task) {
                    clearTimeout(wrap.task);
                    delete wrap.task;
                }

                
                j = wrap.tasks && wrap.tasks.length;
                if (j) {
                    while (j--) {
                        clearTimeout(wrap.tasks[j]);
                    }
                    delete wrap.tasks;
                }

                if (dom.detachEvent) {
                    dom.detachEvent('on' + bindName, wrap);
                } else {
                    dom.removeEventListener(bindName, wrap, false);
                }

                if (wrap && dom == doc && eventName == 'mousedown') {
                    EventManager.stoppedMouseDownEvent.removeListener(wrap);
                }

                
                Ext.Array.erase(cache, i, 1);
            }
        }
    },

    //Replacement of Ext.EventManager.removeAll to fix memory leaks
    removeAll : function(element) {
        var el = element.dom ? element : Ext.getDom(element),
            cache, events, eventName;

        if (!el) {
            return;
        }
        cache = (el.$cache || el.getCache());
        events = cache.events;

        for (eventName in events) {
            if (events.hasOwnProperty(eventName)) {
            	//Use our removeListener to avoid memory leaks
                this.removeListener(el, eventName);
            }
        }
        cache.events = {};
    },
    
    onLoad: function() {
        var me = this,
            doc = me.getDoc(),
            fn = me.onRelayedEvent;

        if (doc) {
            try {
                me.removeAll(doc);

                // These events need to be relayed from the inner document (where they stop
                // bubbling) up to the outer document. This has to be done at the DOM level so
                // the event reaches listeners on elements like the document body. The effected
                // mechanisms that depend on this bubbling behavior are listed to the right
                // of the event.
                Ext.EventManager.on(doc, {
                    mousedown: fn, // menu dismisal (MenuManager) and Window onMouseDown (toFront)
                    mousemove: fn, // window resize drag detection
                    mouseup: fn,   // window resize termination
                    click: fn,     // not sure, but just to be safe
                    dblclick: fn,  // not sure again
                    keypress: fn,
                    keydown: fn,
                    keyup: fn,
                    scope: me
                });
            } catch(e) {
                // cannot do this xss
            }

            // We need to be sure we remove all our events from the iframe on unload or we're going to LEAK!
            Ext.EventManager.on(me.getWin(), 'unload', me.beforeDestroy, me);

            this.el.unmask();
            this.fireEvent('load', this);

        } else if(me.src && me.src != '') {

            this.el.unmask();
            this.fireEvent('error', this);
        }


    },

    onRelayedEvent: function (event) {
        // relay event from the iframe's document to the document that owns the iframe...

        var iframeEl = this.iframeEl,
            iframeXY = iframeEl.getXY(),
            eventXY = event.getXY();

        // the event from the inner document has XY relative to that document's origin,
        // so adjust it to use the origin of the iframe in the outer document:
        event.xy = [iframeXY[0] + eventXY[0], iframeXY[1] + eventXY[1]];

        event.injectEvent(iframeEl); // blame the iframe for the event...

        event.xy = eventXY; // restore the original XY (just for safety)
    },

    load: function (src) {
        var me = this,
            text = me.loadMask,
            frame = me.getFrame();

        if (me.fireEvent('beforeload', me, src) !== false) {
            if (text && me.el) {
                me.el.mask(text);
            }

            frame.src = me.src = (src || me.src);
        }
    }
});
