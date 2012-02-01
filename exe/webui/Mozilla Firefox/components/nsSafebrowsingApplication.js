const Cc = Components.classes;
const Ci = Components.interfaces;

// This is copied from toolkit/components/content/js/lang.js.
// It seems cleaner to copy this rather than #include from so far away.
Function.prototype.inherits = function(parentCtor) {
  var tempCtor = function(){};
  tempCtor.prototype = parentCtor.prototype;
  this.superClass_ = parentCtor.prototype;
  this.prototype = new tempCtor();
}  

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// This file implements an event registrar, an object with which you
// can register handlers for arbitrary programmer-defined
// events. Events are arbitrary strings and listeners are functions
// taking an object (stuffed with arguments) as a parameter. When you
// fire an event through the registrar, all listeners are invoked in
// an unspecified order. The firing function takes an object to be
// passed into each handler (it is _not_ copied, so be careful). We
// chose this calling convention so we don't have to change handler
// signatures when adding new information.
//
// Why not just use notifier/observers? Because passing data around
// with them requires either serialization or a new xpcom interface,
// both of which are a pain in the ass.
//
// Example:
//
// // Set up a listener
// this.handleTabload = function(e) {
//   foo(e.url);
//   bar(e.browser);
// };
//
// // Set up the registrar
// var eventTypes = ["tabload", "tabunload", "tabswitch"];
// var registrar = new EventRegistrar(eventTypes);
// var handler = BindToObject(this.handleTabload, this);
//
// // Register a listener
// registrar.registerListener("tabload", handler);
//
// // Fire an event and remove the listener
// var event = { "url": "http://www", "browser": browser };
// registrar.fire("tabload", event);
// registrar.removeListener("tabload", handler);
//
// TODO: could add ability to cancel further handlers by having listeners
//       return a boolean

/**
 * EventRegistrars are used to manage user-defined events. 
 *
 * @constructor
 * @param eventTypes {Array or Object} Array holding names of events or
 *                   Object holding properties the values of which are 
 *                   names (strings) for which listeners can register
 */
function EventRegistrar(eventTypes) {
  this.eventTypes = [];
  this.listeners_ = {};          // Listener sets, index by event type

  if (eventTypes instanceof Array) {
    var events = eventTypes;
  } else if (typeof eventTypes == "object") {
    var events = [];
    for (var e in eventTypes)
      events.push(eventTypes[e]);
  } else {
    throw new Error("Unrecognized init parameter to EventRegistrar");
  }

  for (var i = 0; i < events.length; i++) {
    this.eventTypes.push(events[i]);          // Copy in case caller mutates
    this.listeners_[events[i]] = 
      new ListDictionary(events[i] + "Listeners");
  }
}

/**
 * Indicates whether the given event is one the registrar can handle.
 * 
 * @param eventType {String} The name of the event to look up
 * @returns {Boolean} false if the event type is not known or the 
 *          event type string itself if it is
 */
EventRegistrar.prototype.isKnownEventType = function(eventType) {
  for (var i=0; i < this.eventTypes.length; i++)
    if (eventType == this.eventTypes[i])
      return eventType;
  return false;
}

/**
 * Add an event type to listen for.
 * @param eventType {String} The name of the event to add
 */
EventRegistrar.prototype.addEventType = function(eventType) {
  if (this.isKnownEventType(eventType))
    throw new Error("Event type already known: " + eventType);

  this.eventTypes.push(eventType);
  this.listeners_[eventType] = new ListDictionary(eventType + "Listeners");
}

/**
 * Register to receive events of the type passed in. 
 * 
 * @param eventType {String} indicating the event type (one of this.eventTypes)
 * @param listener {Function} to invoke when the event occurs.
 */
EventRegistrar.prototype.registerListener = function(eventType, listener) {
  if (this.isKnownEventType(eventType) === false)
    throw new Error("Unknown event type: " + eventType);

  this.listeners_[eventType].addMember(listener);
}

/**
 * Unregister a listener.
 * 
 * @param eventType {String} One of EventRegistrar.eventTypes' members
 * @param listener {Function} Function to remove as listener
 */
EventRegistrar.prototype.removeListener = function(eventType, listener) {
  if (this.isKnownEventType(eventType) === false)
    throw new Error("Unknown event type: " + eventType);

  this.listeners_[eventType].removeMember(listener);
}

/**
 * Invoke the handlers for the given eventType. 
 *
 * @param eventType {String} The event to fire
 * @param e {Object} Object containing the parameters of the event
 */
EventRegistrar.prototype.fire = function(eventType, e) {
  if (this.isKnownEventType(eventType) === false)
    throw new Error("Unknown event type: " + eventType);

  var invoke = function(listener) {
    listener(e);
  };

  this.listeners_[eventType].forEach(invoke);
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// This file implements a Dictionary data structure using a list
// (array). We could instead use an object, but using a list enables
// us to have ordering guarantees for iterators. The interface it exposes 
// is:
// 
// addMember(item)
// removeMember(item)
// isMember(item)
// forEach(func)
//
// TODO: this class isn't really a Dictionary, it's more like a 
//       membership set (i.e., a set without union and whatnot). We
//       should probably change the name to avoid confusion.

/**
 * Create a new Dictionary data structure.
 *
 * @constructor
 * @param name A string used to name the dictionary
 */
function ListDictionary(name) {
  this.name_ = name;
  this.members_ = [];
}

/**
 * Look an item up.
 *
 * @param item An item to look up in the dictionary
 * @returns Boolean indicating if the parameter is a member of the dictionary
 */
ListDictionary.prototype.isMember = function(item) {
  for (var i=0; i < this.members_.length; i++)
    if (this.members_[i] == item)
      return true;
  return false;
}

/**
 * Add an item
 *
 * @param item An item to add (does not check for dups)
 */
ListDictionary.prototype.addMember = function(item) {
  this.members_.push(item);
}

/**
 * Remove an item
 *
 * @param item The item to remove (doesn't check for dups)
 * @returns Boolean indicating if the item was removed
 */
ListDictionary.prototype.removeMember = function(item) {
  for (var i=0; i < this.members_.length; i++) {
    if (this.members_[i] == item) {
      for (var j=i; j < this.members_.length; j++)
        this.members_[j] = this.members_[j+1];

      this.members_.length--;
      return true;
    }
  }
  return false;
}

/**
 * Apply a function to each of the members. Does NOT replace the members
 * in the dictionary with results -- it just calls the function on each one.
 *
 * @param func Function to apply to the dictionary's members
 */
ListDictionary.prototype.forEach = function(func) {
  if (typeof func != "function")
    throw new Error("argument to forEach is not a function, it's a(n) " + 
                    typeof func);

  for (var i=0; i < this.members_.length; i++)
    func(this.members_[i]);
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// This file implements a G_TabbedBrowserWatcher, an object
// encapsulating and abstracting the mechanics of working with tabs
// and the documents within them. The watcher provides notification of
// various DOM-related events (a document loaded, a document unloaded,
// tab was created/destroyed, user switched tabs, etc.) as well as
// commonly required methods (get me the current tab, find the tab to
// which this document belongs, etc.).
//
// This class does not do progresslistener-based notifications; for that,
// use the NavWatcher.
//
// Note: I use "browser" and "tab" interchangeably.
//
// This class adds a level of indirection to event registration. You
// initialize it with a tabbedbrowser, and then register to hear
// events from it instead of from the tabbedbrowser or browser itself.
// Your handlers are invoked with a custom object as an argument (see
// below). This object contains useful information such as a reference
// to the browser in which the event is happening and whether the
// event is occurring on the top-level document in that browser.
//
// The events you can register to hear are:
//
// EVENT             DESCRIPTION
// -----             -----------
// load              Fires when a page is shown in the browser window and
//                   this page wasn't in the bfcache
//
// unload            Fires when a page is nav'd away from in the browser window
//                   and the page isn't going into the bfcache
//
// pageshow          Fires when a page is shown in the browser window, whether
//                   it came from bfcache or not. (There is a "persisted"
//                   property we can get from the event object if we'd like.
//                   It indicates whether the page was loaded from bfcache.
//                   If false then we known load recently fired).
//
// pagehide          Fires when a page is nav'd away from in the browser,
//                   whether its going into the bfcache or not. (There is
//                   a persisted property here as well that we're not
//                   propagating -- when its true the page is going into
//                   the bfcache, else it's not, and unload will shortly
//                   fire).
//
// domcontentloaded  BROKEN BROKEN BROKEN BROKEN BROKEN BROKEN BROKEN BROKEN
//                   Fires when a doc's DOM is ready, but its externally linked
//                   content hasn't necessarily loaded. This event is
//                   currently broken: it doesn't fire when using the
//                   forward/back buttons in conjunction with the bfcache.
//                   Bryner is working on a fix.
//
// tabload           Fires when a new tab has been created (but doesn't
//                   necessarily have content loaded in it)
//
// tabunload         Fires when a tab is being destroyed (and might have had
//                   the content it contains destroyed)
//
// tabswitch         Fires when the user switches tabs
//
// tabmove           Fires when a user drags a tab to a different position
//
//
// For pageshow, pagehide, load, unload, and domcontentloaded, the event
// object you'll receive has the following properties:
//
//      doc -- reference to Document on which the event fired
//      browser -- the browser in which the document resides
//      isTop -- boolean indicating if it is the top-level document
//      inSelected -- boolean indicating if it is in the currently selected tab
//
// For tabload and unload it has:
//
//      browser -- reference to the browser that is loading or closing
//
// For tabswitch it has:
//
//      fromBrowser -- reference to the browser user is switching from
//      toBrowser -- reference to the browser user is switching to
//
// For tabmove it has:
//
//      tab -- the tab that was moved (Note that this is the actual
//             tab widget that holds the document title, not the
//             browser object.  We use this because it's the target
//             of the DOMNodeInserted event.)
//      fromIndex -- the tab index before the move
//      toIndex -- the tab index after the move
//
//
// The order of events is:                   tabload
//                                           domcontentloaded
//                                           load
//                                           pageshow
//                                           --  --
//                                           pagehide
//                                           unload
//                                           tabunload
//
// Example:
//
// function handler(e /*event object*/) {
//   foo(e.browser);
// };
// var watcher = new G_TabbedBrowserWatcher(document.getElementById(gBrowser));
// watcher.registerListener("load", handler);      // register for events
// watcher.removeListener("load", handler);        // unregister
//
//
// TODO, BUGS, ISSUES, COMPLICATIONS:
//
// The only major problem is in closing tabs:
//
//     + When you close a tab, the reference to the Document you get in the
//       unload event is undefined. We pass this along. This could easily
//       be fixed by not listening for unload at all, but instead inferring
//       it from the information in pagehide, and then firing our own "fake"
//       unload after firing pagehide.
//
//     + There's no docshell during the pagehide event, so we can't determine
//       if the document is top-level. We pass undefined in this case.
//
//     + Though the browser reference during tabunload will be valid, its
//       members most likely have already been torn down. Use it in an
//       objectsafemap to keep state if you need its members.
//
//     + The event listener DOMNodeInserted has the potential to cause
//       performance problems if there are too many events fired.  It
//       should be ok, since we inserted it as far as possible into
//       the xul tree.
//
//
// TODO: need better enforcement of unique names. Two tabbedbrowserwatchers
//       with the same name will clobber each other because they use that
//       name to mark browsers they've seen.
// 
// TODO: the functions that iterate of windows and documents badly need
//       to be made cleaner. Right now we have multiple implementations
//       that essentially do the same thing :(
//
// But good enough for government work.

/**
 * Encapsulates tab-related information. You can use the
 * G_TabbedBrowserWatcher to watch for events on tabs as well as to
 * retrieve tab-related data (such as what tab is currently showing).
 * It receives many event notifications from G_BrowserWatchers it
 * attaches to newly opening tabs.
 *
 * @param tabBrowser A reference to the tabbed browser you wish to watch.
 *
 * @param name String containing a probabilistically unique name. Used to
 *             ensure that each tabbedbrowserwatcher can uniquely mark
 *             browser it has "seen."
 *
 * @param opt_filterAboutBlank Boolean indicating whether to filter events
 *                             for about:blank. These events are often
 *                             spurious since about:blank is the default
 *                             page for an empty browser.
 *
 * @constructor
 */

function G_TabbedBrowserWatcher(tabBrowser, name, opt_filterAboutBlank) {
  this.debugZone = "tabbedbrowserwatcher";
  this.registrar_ = new EventRegistrar(G_TabbedBrowserWatcher.events);
  this.tabBrowser_ = tabBrowser;
  this.filterAboutBlank_ = !!opt_filterAboutBlank;
  this.events = G_TabbedBrowserWatcher.events;      // Convenience pointer

  // We need some way to tell if we've seen a browser before, so we
  // set a property on it with a probabilistically unique string. The
  // string is a combination of a static string and one passed in by
  // the caller.
  G_Assert(this, typeof name == "string" && !!name,
           "Need a probabilistically unique name");
  this.name_ = name;
  this.mark_ = G_TabbedBrowserWatcher.mark_ + "-" + this.name_;

  this.tabbox_ = this.getTabBrowser().mTabBox;

  // There's no tabswitch event in Firefox, so we fake it by watching
  // for selects on the tabbox.
  this.onTabSwitchClosure_ = BindToObject(this.onTabSwitch, this);
  this.tabbox_.addEventListener("select",
                                this.onTabSwitchClosure_, true);

  // Used to determine when the user has switched tabs
  this.lastTab_ = this.getCurrentBrowser();
}

// Events for which listeners can register
G_TabbedBrowserWatcher.events = {
   TABSWITCH: "tabswitch",
   };

// We mark new tabs as we see them
G_TabbedBrowserWatcher.mark_ = "watcher-marked";

/**
 * Remove all the event handlers and clean up circular refs.
 */
G_TabbedBrowserWatcher.prototype.shutdown = function() {
  G_Debug(this, "Removing event listeners");
  if (this.tabbox_) {
    this.tabbox_.removeEventListener("select",
                                     this.onTabSwitchClosure_, true);
    // Break circular ref so we can be gc'ed.
    this.tabbox_ = null;
  }
  // Break circular ref so we can be gc'ed.
  if (this.lastTab_) {
    this.lastTab_ = null;
  }

  if (this.tabBrowser_) {
    this.tabBrowser_ = null;
  }
}

/**
 * Check to see if we've seen a browser before
 *
 * @param browser Browser to check
 * @returns Boolean indicating if we've attached a BrowserWatcher to this
 *          browser
 */
G_TabbedBrowserWatcher.prototype.isInstrumented_ = function(browser) {
  return !!browser[this.mark_];
}

/**
 * Attaches a BrowserWatcher to a browser and marks it as seen
 *
 * @param browser Browser to which to attach a G_BrowserWatcher
 */
G_TabbedBrowserWatcher.prototype.instrumentBrowser_ = function(browser) {
  G_Assert(this, !this.isInstrumented_(browser),
           "Browser already instrumented!");

  // The browserwatcher will hook itself into the browser and its parent (us)
  new G_BrowserWatcher(this, browser);
  browser[this.mark_] = true;
}

/**
 * Register to receive events of a particular type
 *
 * @param eventType String indicating the event (see
 *                  G_TabbedBrowserWatcher.events)
 * @param listener Function to invoke when the event occurs. See top-
 *                 level comments for parameters.
 */
G_TabbedBrowserWatcher.prototype.registerListener = function(eventType,
                                                             listener) {
  this.registrar_.registerListener(eventType, listener);
}

/**
 * Unregister a listener.
 *
 * @param eventType String one of G_TabbedBrowserWatcher.events' members
 * @param listener Function to remove as listener
 */
G_TabbedBrowserWatcher.prototype.removeListener = function(eventType,
                                                           listener) {
  this.registrar_.removeListener(eventType, listener);
}

/**
 * Send an event to all listeners for that type.
 *
 * @param eventType String indicating the event to trigger
 * @param e Object to pass to each listener (NOT copied -- be careful)
 */
G_TabbedBrowserWatcher.prototype.fire = function(eventType, e) {
  this.registrar_.fire(eventType, e);
}

/**
 * Convenience function to send a document-related event. We use this
 * convenience function because the event constructing logic and
 * parameters are the same for all these events. (Document-related
 * events are load, unload, pagehide, pageshow, and domcontentloaded).
 *
 * @param eventType String indicating the type of event to fire (one of
 *                  the document-related events)
 *
 * @param doc Reference to the HTMLDocument the event is occuring to
 *
 * @param browser Reference to the browser in which the document is contained
 */
G_TabbedBrowserWatcher.prototype.fireDocEvent_ = function(eventType,
                                                          doc,
                                                          browser) {
  // If we've already shutdown, don't bother firing any events.
  if (!this.tabBrowser_) {
    G_Debug(this, "Firing event after shutdown: " + eventType);
    return;
  }

  try {
    // Could be that the browser's contentDocument has already been torn
    // down. If so, this throws, and we can't tell without keeping more
    // state whether doc was the top frame.
    var isTop = (doc == browser.contentDocument);
  } catch(e) {
    var isTop = undefined;
  }

  var inSelected = (browser == this.getCurrentBrowser());

  var location = doc ? doc.location.href : undefined;

  // Only send notifications for about:config's if we're supposed to
  if (!this.filterAboutBlank_ || location != "about:blank") {

    G_Debug(this, "firing " + eventType + " for " + location +
            (isTop ? " (isTop)" : "") + (inSelected ? " (inSelected)" : ""));
    this.fire(eventType, { "doc": doc,
                           "isTop": isTop,
                           "inSelected": inSelected,
                           "browser": browser});
  }
}

/**
 * Invoked when the user might have switched tabs
 *
 * @param e Event object
 */
G_TabbedBrowserWatcher.prototype.onTabSwitch = function(e) {
  // Filter spurious events
  // The event target is usually tabs but can be tabpanels when tabs were opened
  // programatically via tabbrowser.addTab().
  if (e.target == null || 
      (e.target.localName != "tabs" && e.target.localName != "tabpanels"))
    return;

  var fromBrowser = this.lastTab_;
  var toBrowser = this.getCurrentBrowser();

  if (fromBrowser != toBrowser) {
    this.lastTab_ = toBrowser;
    G_Debug(this, "firing tabswitch");
    this.fire(this.events.TABSWITCH, { "fromBrowser": fromBrowser,
                                       "toBrowser": toBrowser });
  }
}

// Utility functions

/**
 * Returns a reference to the tabbed browser this G_TabbedBrowserWatcher
 * was initialized with.
 */
G_TabbedBrowserWatcher.prototype.getTabBrowser = function() {
  return this.tabBrowser_;
}

/**
 * Returns a reference to the currently selected tab.
 */
G_TabbedBrowserWatcher.prototype.getCurrentBrowser = function() {
  return this.getTabBrowser().selectedBrowser;
}

/**
 * Returns a reference to the top window in the currently selected tab.
 */
G_TabbedBrowserWatcher.prototype.getCurrentWindow = function() {
  return this.getCurrentBrowser().contentWindow;
}

/**
 * Find the browser corresponding to a Document
 *
 * @param doc Document we want the browser for
 * @returns Reference to the browser in which the given document is found
 *          or null if not found
 */
G_TabbedBrowserWatcher.prototype.getBrowserFromDocument = function(doc) {
  // Could instead get the top window of the browser in which the doc
  // is found via doc.defaultView.top, but sometimes the document
  // isn't in a browser at all (it's being unloaded, for example), so
  // defaultView won't be valid.

  // Helper: return true if doc is a sub-document of win
  function docInWindow(doc, win) {
    if (win.document == doc)
      return true;

    if (win.frames)
      for (var i = 0; i < win.frames.length; i++)
        if (docInWindow(doc, win.frames[i]))
          return true;

    return false;
  }

  var browsers = this.getTabBrowser().browsers;
  for (var i = 0; i < browsers.length; i++)
    if (docInWindow(doc, browsers[i].contentWindow))
      return browsers[i];

  return null;
}

/**
 * Find the Document that has the given URL loaded. Returns on the
 * _first_ such document found, so be careful.
 *
 * TODO make doc/window searches more elegant, and don't use inner functions
 *
 * @param url String indicating the URL we're searching for
 * @param opt_browser Optional reference to a browser. If given, the
 *                    search will be confined to only this browser.
 * @returns Reference to the Document with that URL or null if not found
 */
G_TabbedBrowserWatcher.prototype.getDocumentFromURL = function(url,
                                                               opt_browser) {

  // Helper function: return the Document in win that has location of url
  function docWithURL(win, url) {
    if (win.document.location.href == url)
      return win.document;

    if (win.frames)
      for (var i = 0; i < win.frames.length; i++) {
        var rv = docWithURL(win.frames[i], url);
  	if (rv)
          return rv;
      }

    return null;
  }

  if (opt_browser)
    return docWithURL(opt_browser.contentWindow, url);

  var browsers = this.getTabBrowser().browsers;
  for (var i=0; i < browsers.length; i++) {
    var rv = docWithURL(browsers[i].contentWindow, url);
    if (rv)
      return rv;
  }

  return null;
}

/**
 * Find the all Documents that have the given URL loaded.
 *
 * TODO make doc/window searches more elegant, and don't use inner functions
 *
 * @param url String indicating the URL we're searching for
 *
 * @param opt_browser Optional reference to a browser. If given, the
 *                    search will be confined to only this browser.
 *
 * @returns Array of Documents with the given URL (zero length if none found)
 */
G_TabbedBrowserWatcher.prototype.getDocumentsFromURL = function(url,
                                                                opt_browser) {

  var docs = [];

  // Helper function: add Docs in win with the location of url
  function getDocsWithURL(win, url) {
    if (win.document.location.href == url)
      docs.push(win.document);

    if (win.frames)
      for (var i = 0; i < win.frames.length; i++)
        getDocsWithURL(win.frames[i], url);
  }

  if (opt_browser)
    return getDocsWithURL(opt_browser.contentWindow, url);

  var browsers = this.getTabBrowser().browsers;
  for (var i=0; i < browsers.length; i++)
    getDocsWithURL(browsers[i].contentWindow, url);

  return docs;
}


/**
 * Finds the browser in which a Window resides.
 *
 * @param sub Window to find
 * @returns Reference to the browser in which sub resides, else null
 *          if not found
 */
G_TabbedBrowserWatcher.prototype.getBrowserFromWindow = function(sub) {

  // Helpfer function: return true if sub is a sub-window of win
  function containsSubWindow(sub, win) {
    if (win == sub)
      return true;

    if (win.frames)
      for (var i=0; i < win.frames.length; i++)
        if (containsSubWindow(sub, win.frames[i]))
          return true;

    return false;
  }

  var browsers = this.getTabBrowser().browsers;
  for (var i=0; i < browsers.length; i++)
    if (containsSubWindow(sub, browsers[i].contentWindow))
      return browsers[i];

  return null;
}

/**
 * Finds the XUL <tab> tag corresponding to a given browser.
 *
 * @param tabBrowser Reference to the tabbed browser in which browser lives
 * @param browser Reference to the browser we wish to find the tab of
 * @returns Reference to the browser's tab element, or null
 * @static
 */
G_TabbedBrowserWatcher.getTabElementFromBrowser = function(tabBrowser,
                                                           browser) {

  for (var i=0; i < tabBrowser.browsers.length; i++)
    if (tabBrowser.browsers[i] == browser)
      return tabBrowser.mTabContainer.childNodes[i];

  return null;
}
//@line 16 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/browser/components/safebrowsing/src/nsSafebrowsingApplication.js"

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// We instantiate this variable when we create the application.
var gDataProvider = null;

// An instance of our application is a PROT_Application object. It
// basically just populates a few globals and instantiates wardens and
// the listmanager.

/**
 * An instance of our application. There should be exactly one of these.
 * 
 * Note: This object should instantiated only at profile-after-change
 * or later because the listmanager and the cryptokeymanager need to
 * read and write data files. Additionally, NSS isn't loaded until
 * some time around then (Moz bug #321024).
 *
 * @constructor
 */
function PROT_Application() {
  this.debugZone= "application";

//@line 88 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/browser/components/safebrowsing/src/../content/application.js"
  
  // expose some classes
  this.G_TabbedBrowserWatcher = G_TabbedBrowserWatcher;
  this.PROT_Controller = PROT_Controller;
  this.PROT_PhishingWarden = PROT_PhishingWarden;

  // Load data provider pref values
  gDataProvider = new PROT_DataProvider();

  // expose the object
  this.wrappedJSObject = this;
}

/**
 * @return String the report phishing URL (localized).
 */
PROT_Application.prototype.getReportPhishingURL = function() {
  return gDataProvider.getReportPhishURL();
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// There is one BrowserView per browser window, and each BrowserView
// is responsible for keeping track of problems (phishy documents)
// within that window. The BrowserView is also responsible for
// figuring out what to do about such problems, for example, whether
// the tab with a phishy page is currently showing and therefore if we
// should be showing a warning.
// 
// The BrowserView receives information from three places:
//
// - from the phishing warden. When the phishing warden notices a
//   problem, it queries all browser views to see which one (if any)
//   has the Document that is problematic. It then hands the problem
//   off to the appropriate BrowserView.
// 
// - from the controller. The controller responds to explicit user 
//   actions (tab switches, requests to hide the warning message, 
//   etc.) and let's the BrowserView know about any user action 
//   having to do with the problems it is tracking.
//
// - from the TabbedBrowserWatcher. When the BrowserView is keeping
//   track of a problematic document it listens for interesting
//   events affecting it, for example pagehide (at which point
//   we presumably hide the warning if we're showing it).
//
// The BrowserView associates at most one "problem" with each Document
// in the browser window. It keeps state about which Documents are 
// problematic by storing a "problem queue" on each browser (tab).
// At most one problematic document per browser (tab) is active
// at any time. That is, we show the warning for at most one phishy
// document at any one time. If another phishy doc loads in that tab,
// it goes onto the end of the queue to be activated only when the
// currently active document goes away.
//
// If we had multiple types of warnings (one for after the page had
// loaded, one for when the user clicked a link, etc) here's where
// we'd select the appropate one to use. As it stands, we only have
// one displayer (an "afterload" displayer). A displayer knows _how_
// to display a warning, whereas as the BrowserView knows _what_ and
// _when_.
//
// To keep things (relatively) easy to reason about and efficient (the
// phishwarden could be querying us inside a progresslistener
// notification, or the controller inside an event handler), we have
// the following rules:
//
// - at most one of a displayer's start() or stop() methods is called
//   in any iteration (if calling two is required, the second is run in 
//   the next event loop)
// - displayers should run their operations synchronously so we don't have
//   to look two places (here and in the displayer) to see what is happening 
//   when
// - displayer actions are run after cleaning up the browser view state
//   in case they have consequences
//
// TODO: this could use some redesign, but I don't have time.
// TODO: the queue needs to be abstracted, but we want another release fast,
//       so I'm not going to touch it for the time being
// TODO: IDN issues and canonical URLs?
// TODO: Perhaps we should blur the page before showing a warning in order
//       to prevent stray keystrokes?

/**
 * The BrowerView is responsible for keeping track of and figuring out
 * what to do with problems within a single browser window.
 * 
 * TODO 
 * Unify all browser-related state here. Currently it's split
 * between two objects, this object and the controller. We could have
 * this object be solely responsible for UI hide/show decisions, which
 * would probably make it easier to reason about what's going on.
 * 
 * TODO 
 * Investigate an alternative model. For example, we could factor out
 * the problem signaling stuff from the tab/UI logic into a
 * ProblemRegistry. Attach listeners to new docs/requests as they go
 * by and have these listeners periodically check in with a
 * ProblemRegistry to see if they're watching a problematic
 * doc/request. If so, then have them flag the browser view to be
 * aware of the problem.
 *
 * @constructor
 * @param tabWatcher Reference to the TabbedBrowserWatcher we'll use to query 
 *                   for information about active tabs/browsers.
 * @param doc Reference to the XUL Document (browser window) in which the 
 *            tabwatcher is watching
 */ 
function PROT_BrowserView(tabWatcher, doc) {
  this.debugZone = "browserview";
  this.tabWatcher_ = tabWatcher;
  this.doc_ = doc;
}

/**
 * See if we have any Documents with a given (problematic) URL that
 * haven't yet been marked as problems. Called as a subroutine by
 * tryToHandleProblemRequest().
 *
 * @param url String containing the URL to look for
 *
 * @returns Reference to an unhandled Document with the problem URL or null
 */
PROT_BrowserView.prototype.getFirstUnhandledDocWithURL_ = function(url) {
  var docs = this.tabWatcher_.getDocumentsFromURL(url);
  if (!docs.length)
    return null;

  for (var i = 0; i < docs.length; i++) {
    // We only care about top level documents (i.e., we don't care about
    // frames).
    if (docs[i].defaultView.top != docs[i].defaultView)
      continue;

    var browser = this.tabWatcher_.getBrowserFromDocument(docs[i]);
    G_Assert(this, !!browser, "Found doc but can't find browser???");
    var alreadyHandled = this.getProblem_(docs[i], browser);

    if (!alreadyHandled)
      return docs[i];
  }
  return null;
}

/**
 * Invoked by the warden to give us the opportunity to handle a
 * problem.  A problem is signaled once per request for a problem
 * Document and is handled at most once, so there's no issue with us
 * "losing" a problem due to multiple concurrently loading Documents
 * with the same URL.
 *
 * @param warden Reference to the warden signalling the problem. We'll
 *               need him to instantiate one of his warning displayers
 * 
 * @param request The nsIRequest that is problematic
 *
 * @returns Boolean indicating whether we handled problem
 */
PROT_BrowserView.prototype.tryToHandleProblemRequest = function(warden,
                                                                request) {

  var doc = this.getFirstUnhandledDocWithURL_(request.name);
  if (doc) {
    var browser = this.tabWatcher_.getBrowserFromDocument(doc);
    G_Assert(this, !!browser, "Couldn't get browser from problem doc???");
    G_Assert(this, !this.getProblem_(doc, browser),
             "Doc is supposedly unhandled, but has state?");
    
    this.isProblemDocument_(browser, doc, warden);
    return true;
  }
  return false;
}

/**
 * We're sure a particular Document is problematic, so let's instantiate
 * a dispalyer for it and add it to the problem queue for the browser.
 *
 * @param browser Reference to the browser in which the problem doc resides
 *
 * @param doc Reference to the problematic document
 * 
 * @param warden Reference to the warden signalling the problem.
 */
PROT_BrowserView.prototype.isProblemDocument_ = function(browser, 
                                                         doc, 
                                                         warden) {

  G_Debug(this, "Document is problem: " + doc.location.href);
 
  var url = doc.location.href;

  // We only have one type of displayer right now
  var displayer = new warden.displayers_["afterload"]("Phishing afterload",
                                                      browser,
                                                      this.doc_,
                                                      url);

  // We listen for the problematic document being navigated away from
  // so we can remove it from the problem queue

  var hideHandler = BindToObject(this.onNavAwayFromProblem_, 
                                 this, 
                                 doc, 
                                 browser);
  doc.defaultView.addEventListener("pagehide", hideHandler, true);

  // More info than we technically need, but it comes in handy for debugging
  var problem = {
    "browser_": browser,
    "doc_": doc,
    "displayer_": displayer,
    "url_": url,
    "hideHandler_": hideHandler,
  };
  var numInQueue = this.queueProblem_(browser, problem);

  // If the queue was empty, schedule us to take something out
  if (numInQueue == 1)
    new G_Alarm(BindToObject(this.unqueueNextProblem_, this, browser), 0);
}

/**
 * Invoked when a problematic document is navigated away from. 
 *
 * @param doc Reference to the problematic Document navigated away from

 * @param browser Reference to the browser in which the problem document
 *                unloaded
 */
PROT_BrowserView.prototype.onNavAwayFromProblem_ = function(doc, browser) {

  G_Debug(this, "User nav'd away from problem.");
  var problem = this.getProblem_(doc, browser);
  (new PROT_Reporter).report("phishnavaway", problem.url_);

  G_Assert(this, doc === problem.doc_, "State doc not equal to nav away doc?");
  G_Assert(this, browser === problem.browser_, 
           "State browser not equal to nav away browser?");
  
  this.problemResolved(browser, doc);
}

/**
 * @param browser Reference to a browser we'd like to know about
 * 
 * @returns Boolean indicating if the browser in question has 
 *          problematic content
 */
PROT_BrowserView.prototype.hasProblem = function(browser) {
  return this.hasNonemptyProblemQueue_(browser);
}

/**
 * @param browser Reference to a browser we'd like to know about
 *
 * @returns Boolean indicating if the browser in question has a
 *          problem (i.e., it has a non-empty problem queue)
 */
PROT_BrowserView.prototype.hasNonemptyProblemQueue_ = function(browser) {
  try {
    return !!browser.PROT_problemState__ && 
      !!browser.PROT_problemState__.length;
  } catch(e) {
    // We could be checking a browser that has just been closed, in
    // which case its properties will not be valid, causing the above
    // statement to throw an error. Since this case handled elsewhere,
    // just return false.
    return false;
  }
}

/**
 * Invoked to indicate that the problem for a particular problematic
 * document in a browser has been resolved (e.g., by being navigated
 * away from).
 *
 * @param browser Reference to the browser in which resolution is happening
 *
 * @param opt_doc Reference to the problematic doc whose problem was resolved
 *                (if absent, assumes the doc assocaited with the currently
 *                active displayer)
 */
PROT_BrowserView.prototype.problemResolved = function(browser, opt_doc) {
  var problem;
  var doc;
  if (!!opt_doc) {
    doc = opt_doc;
    problem = this.getProblem_(doc, browser);
  } else {
    problem = this.getCurrentProblem_(browser);
    doc = problem.doc_;
  }

  problem.displayer_.done();
  var wasHead = this.deleteProblemFromQueue_(doc, browser);

  // Peek at the next problem (if any) in the queue for this browser
  var queueNotEmpty = this.getCurrentProblem_(browser);

  if (wasHead && queueNotEmpty) {
    G_Debug(this, "More problems pending. Scheduling unqueue.");
    new G_Alarm(BindToObject(this.unqueueNextProblem_, this, browser), 0);
  }
}

/**
 * Peek at the top of the problem queue and if there's something there,
 * make it active. 
 *
 * @param browser Reference to the browser we should activate a problem
 *                displayer in if one is available
 */
PROT_BrowserView.prototype.unqueueNextProblem_ = function(browser) {
  var problem = this.getCurrentProblem_(browser);
  if (!problem) {
    G_Debug(this, "No problem in queue; doc nav'd away from? (shrug)");
    return;
  }

  // Two problem docs that load in rapid succession could both schedule 
  // themselves to be unqueued before this method is called. So ensure 
  // that the problem at the head of the queue is not, in fact, active.
  if (!problem.displayer_.isActive()) {

    // It could be the case that the server is really slow to respond,
    // so there might not yet be anything in the problem Document. If
    // we show the warning when that's the case, the user will see a
    // blank document greyed out, and if they cancel the dialog
    // they'll see the page they're navigating away from because it
    // hasn't been painted over yet (b/c there's no content for the
    // problem page). So here we ensure that we have content for the
    // problem page before showing the dialog.
    var haveContent = false;
    try {
      // This will throw if there's no content yet
      var h = problem.doc_.defaultView.getComputedStyle(problem.doc_.body, "")
              .getPropertyValue("height");
      G_Debug(this, "body height: " + h);

      if (Number(h.substring(0, h.length - 2)))
        haveContent = true;

    } catch (e) {
      G_Debug(this, "Masked in unqueuenextproblem: " + e);
    }
    
    if (!haveContent) {

      G_Debug(this, "Didn't get computed style. Re-queueing.");

      // One stuck problem document in a page shouldn't prevent us
      // warning on other problem frames that might be loading or
      // loaded. So stick the Document that doesn't have content
      // back at the end of the queue.
      var p = this.removeProblemFromQueue_(problem.doc_, browser);
      G_Assert(this, p === problem, "Unqueued wrong problem?");
      this.queueProblem_(browser, problem);

      // Try again in a bit. This opens us up to a potential
      // vulnerability (put tons of hanging frames in a page
      // ahead of your real phishy frame), but the risk at the
      // moment is really low (plus it is outside our threat
      // model).
      new G_Alarm(BindToObject(this.unqueueNextProblem_, 
                               this, 
                               browser),
                  200 /*ms*/);
      return;
    }

    problem.displayer_.start();

    // OK, we have content, but there there is an additional
    // issue. Due to a bfcache bug, if we show the warning during
    // paint suppression, the collapsing of the content pane affects
    // the doc we're naving from :( The symptom is a page with grey
    // screen on navigation to or from a phishing page (the
    // contentDocument will have width zero).
    //
    // Paint supression lasts at most 250ms from when the parser sees
    // the body, and the parser sees the body well before it has a
    // height. We err on the side of caution.
    //
    // Thanks to bryner for helping to track the bfcache bug down.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=319646
    
    if (this.tabWatcher_.getCurrentBrowser() === browser)
      new G_Alarm(BindToObject(this.problemBrowserMaybeSelected, 
                               this, 
                               browser),
                  350 /*ms*/);
  }
}

/**
 * Helper function that adds a new problem to the queue of problems pending
 * on this browser.
 *
 * @param browser Browser to which we should add state
 *
 * @param problem Object (structure, really) encapsulating the problem
 *
 * @returns Number indicating the number of items in the queue (and from
 *          which you can infer whether the recently added item was
 *          placed at the head, and hence should be active.
 */
PROT_BrowserView.prototype.queueProblem_ = function(browser, problem) {
  G_Debug(this, "Adding problem state for " + problem.url_);

  if (this.hasNonemptyProblemQueue_(browser))
    G_Debug(this, "Already has problem state. Queueing this problem...");

  // First problem ever signaled on this browser? Make a new queue!
  if (browser.PROT_problemState__ == undefined)
    browser.PROT_problemState__ = [];

  browser.PROT_problemState__.push(problem);
  return browser.PROT_problemState__.length;
}

/**
 * Helper function that removes a problem from the queue and deactivates
 * it.
 *
 * @param doc Reference to the doc for which we should remove state
 *
 * @param browser Reference to the browser from which we should remove
 *                state
 *
 * @returns Boolean indicating if the remove problem was currently active
 *          (that is, if it was at the head of the queue)
 */
PROT_BrowserView.prototype.deleteProblemFromQueue_ = function(doc, browser) {
  G_Debug(this, "Deleting problem state for " + browser);
  G_Assert(this, !!this.hasNonemptyProblemQueue_(browser),
           "Browser has no problem state");

  var problem = this.getProblem_(doc, browser);
  G_Assert(this, !!problem, "Couldnt find state in removeproblemstate???");

  var wasHead = browser.PROT_problemState__[0] === problem;
  this.removeProblemFromQueue_(doc, browser);

  var hideHandler = problem.hideHandler_;
  G_Assert(this, !!hideHandler, "No hidehandler in state?");
  problem.doc_.defaultView.removeEventListener("pagehide",
                                               hideHandler,
                                               true);
  return wasHead;
}

/**
 * Helper function that removes a problem from the queue but does 
 * NOT deactivate it.
 *
 * @param doc Reference to the doc for which we should remove state
 *
 * @param browser Reference to the browser from which we should remove
 *                state
 *
 * @returns Boolean indicating if the remove problem was currently active
 *          (that is, if it was at the head of the queue)
 */
PROT_BrowserView.prototype.removeProblemFromQueue_ = function(doc, browser) {
  G_Debug(this, "Removing problem state for " + browser);
  G_Assert(this, !!this.hasNonemptyProblemQueue_(browser),
           "Browser has no problem state");

  var problem = null;
  // TODO Blech. Let's please have an abstraction here instead.
  for (var i = 0; i < browser.PROT_problemState__.length; i++)
    if (browser.PROT_problemState__[i].doc_ === doc) {
      problem = browser.PROT_problemState__.splice(i, 1)[0];
      break;
    }
  return problem;
}

/**
 * Retrieve (but do not remove) the problem state for a particular
 * problematic Document in this browser
 *
 * @param doc Reference to the problematic doc to get state for
 *
 * @param browser Reference to the browser from which to get state
 *
 * @returns Object encapsulating the state we stored, or null if none
 */
PROT_BrowserView.prototype.getProblem_ = function(doc, browser) {
  if (!this.hasNonemptyProblemQueue_(browser))
    return null;

  // TODO Blech. Let's please have an abstraction here instead.
  for (var i = 0; i < browser.PROT_problemState__.length; i++)
    if (browser.PROT_problemState__[i].doc_ === doc)
      return browser.PROT_problemState__[i];
  return null;
}

/**
 * Retrieve the problem state for the currently active problem Document 
 * in this browser
 *
 * @param browser Reference to the browser from which to get state
 *
 * @returns Object encapsulating the state we stored, or null if none
 */
PROT_BrowserView.prototype.getCurrentProblem_ = function(browser) {
  return browser.PROT_problemState__[0];
}

/**
 * Invoked by the controller when the user switches tabs away from a problem 
 * tab. 
 *
 * @param browser Reference to the tab that was switched from
 */
PROT_BrowserView.prototype.problemBrowserUnselected = function(browser) {
  var problem = this.getCurrentProblem_(browser);
  G_Assert(this, !!problem, "Couldn't get state from browser");
  problem.displayer_.browserUnselected();
}

/**
 * Checks to see if the problem browser is selected, and if so, 
 * tell it it to show its warning.
 *
 * @param browser Reference to the browser we wish to check
 */
PROT_BrowserView.prototype.problemBrowserMaybeSelected = function(browser) {
  var problem = this.getCurrentProblem_(browser);

  if (this.tabWatcher_.getCurrentBrowser() === browser &&
      problem &&
      problem.displayer_.isActive()) 
    this.problemBrowserSelected(browser);
}

/**
 * Invoked by the controller when the user switches tabs to a problem tab
 *
 * @param browser Reference to the tab that was switched to
 */
PROT_BrowserView.prototype.problemBrowserSelected = function(browser) {
  G_Debug(this, "Problem browser selected");
  var problem = this.getCurrentProblem_(browser);
  G_Assert(this, !!problem, "No state? But we're selected!");
  problem.displayer_.browserSelected();
}

/**
 * Invoked by the controller when the user accepts our warning. Passes
 * the accept through to the message displayer, which knows what to do
 * (it will be displayer-specific).
 *
 * @param browser Reference to the browser for which the user accepted
 *                our warning
 */
PROT_BrowserView.prototype.acceptAction = function(browser) {
  var problem = this.getCurrentProblem_(browser);

  // We run the action only after we're completely through processing
  // this event. We do this because the action could cause state to be
  // cleared (e.g., by navigating the problem document) that we need
  // to finish processing the event.

  new G_Alarm(BindToObject(problem.displayer_.acceptAction, 
                           problem.displayer_), 
              0);
}

/**
 * Invoked by the controller when the user declines our
 * warning. Passes the decline through to the message displayer, which
 * knows what to do (it will be displayer-specific).
 *
 * @param browser Reference to the browser for which the user declined
 *                our warning
 */
PROT_BrowserView.prototype.declineAction = function(browser) {
  var problem = this.getCurrentProblem_(browser);
  G_Assert(this, !!problem, "User declined but no state???");

  // We run the action only after we're completely through processing
  // this event. We do this because the action could cause state to be
  // cleared (e.g., by navigating the problem document) that we need
  // to finish processing the event.

  new G_Alarm(BindToObject(problem.displayer_.declineAction, 
                           problem.displayer_), 
              0);
}

/**
 * The user wants to see the warning message. So let em! At some point when
 * we have multiple types of warnings, we'll have to mediate them here.
 *
 * @param browser Reference to the browser that has the warning the user 
 *                wants to see. 
 */
PROT_BrowserView.prototype.explicitShow = function(browser) {
  var problem = this.getCurrentProblem_(browser);
  G_Assert(this, !!problem, "Explicit show on browser w/o problem state???");
  problem.displayer_.explicitShow();
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// This is our controller -- the thingy that listens to what the user
// is doing. There is one controller per browser window, and each has
// a BrowserView that manages information about problems within the
// window. The controller figures out when the browser might want to
// know about something, but the browser view figures out what exactly
// to do (and the BrowserView's displayer figures out how to do it).
//
// For example, the controller might notice that the user has switched
// to a tab that has something problematic in it. It would tell its 
// BrowserView this, and the BrowserView would figure out whether it 
// is appropriate to show a warning (e.g., perhaps the user previously
// dismissed the warning for that problem). If so, the BrowserView tells
// the displayer to show the warning. Anyhoo...
//
// TODO Could move all browser-related hide/show logic into the browser
//      view. Need to think about this more.

/**
 * Handles user actions, translating them into messages to the view
 *
 * @constructor
 * @param win Reference to the Window (browser window context) we should
 *            attach to
 * @param tabWatcher  Reference to the TabbedBrowserWatcher object 
 *                    the controller should use to receive events about tabs.
 * @param phishingWarden Reference to the PhishingWarden we should register
 *                       our browserview with
 */
function PROT_Controller(win, tabWatcher, phishingWarden) {
  this.debugZone = "controller";

  this.win_ = win;
  this.phishingWarden_ = phishingWarden;

  // Use this to query preferences
  this.prefs_ = new G_Preferences();

  // Set us up to receive the events we want.
  this.tabWatcher_ = tabWatcher;
  this.onTabSwitchCallback_ = BindToObject(this.onTabSwitch, this);
  this.tabWatcher_.registerListener("tabswitch",
                                    this.onTabSwitchCallback_);


  // Install our command controllers. These commands are issued from
  // various places in our UI, including our preferences dialog, the
  // warning dialog, etc.
  var commandHandlers = { 
    "safebrowsing-show-warning" :
      BindToObject(this.onUserShowWarning, this),
    "safebrowsing-accept-warning" :
      BindToObject(this.onUserAcceptWarning, this),
    "safebrowsing-decline-warning" :
      BindToObject(this.onUserDeclineWarning, this),
  };

  this.commandController_ = new PROT_CommandController(commandHandlers);
  this.win_.controllers.appendController(this.commandController_);

  // This guy embodies the logic of when to display warnings
  // (displayers embody the how).
  this.browserView_ = new PROT_BrowserView(this.tabWatcher_, 
                                           this.win_.document);

  // We need to let the phishing warden know about this browser view so it 
  // can be given the opportunity to handle problem documents. We also need
  // to let the warden know when this window and hence this browser view
  // is going away.
  this.phishingWarden_.addBrowserView(this.browserView_);

  this.windowWatcher_ = 
    Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
    .getService(Components.interfaces.nsIWindowWatcher);

  G_Debug(this, "Controller initialized.");
}

/**
 * Invoked when the browser window is closing. Do some cleanup.
 */
PROT_Controller.prototype.shutdown = function(e) {
  G_Debug(this, "Browser window closing. Shutting controller down.");
  if (this.browserView_) {
    this.phishingWarden_.removeBrowserView(this.browserView_);
  }

  if (this.commandController_) {
    this.win_.controllers.removeController(this.commandController_);
    this.commandController_ = null;
  }


  // No need to drain the browser view's problem queue explicitly; it will
  // receive pagehides for all the browsers in its queues as they're torn
  // down, and it will remove them.
  this.browserView_ = null;

  if (this.tabWatcher_) {
    this.tabWatcher_.removeListener("tabswitch", 
                                    this.onTabSwitchCallback_);
    this.tabWatcher_.shutdown();
  }

  this.win_.removeEventListener("unload", this.onShutdown_, false);
  this.prefs_ = null;

  this.windowWatcher_ = null;

  G_Debug(this, "Controller shut down.");
}

/**
 * The user clicked the urlbar icon; they want to see the warning message
 * again.
 */
PROT_Controller.prototype.onUserShowWarning = function() {
  var browser = this.tabWatcher_.getCurrentBrowser();
  this.browserView_.explicitShow(browser);
}

/**
 * Deal with a user accepting our warning. 
 *
 * TODO the warning hide/display instructions here can probably be moved
 * into the browserview in the future, given its knowledge of when the
 * problem doc hides/shows.
 */
PROT_Controller.prototype.onUserAcceptWarning = function() {
  G_Debug(this, "User accepted warning.");
  var browser = this.tabWatcher_.getCurrentBrowser();
  G_Assert(this, !!browser, "Couldn't get current browser?!?");
  G_Assert(this, this.browserView_.hasProblem(browser),
           "User accept fired, but browser doesn't have warning showing?!?");

  this.browserView_.acceptAction(browser);
  this.browserView_.problemResolved(browser);
}

/**
 * Deal with a user declining our warning. 
 *
 * TODO the warning hide/display instructions here can probably be moved
 * into the browserview in the future, given its knowledge of when the
 * problem doc hides/shows.
 */
PROT_Controller.prototype.onUserDeclineWarning = function() {
  G_Debug(this, "User declined warning.");
  var browser = this.tabWatcher_.getCurrentBrowser();
  G_Assert(this, this.browserView_.hasProblem(browser),
           "User decline fired, but browser doesn't have warning showing?!?");
  this.browserView_.declineAction(browser);
  // We don't call problemResolved() here because all declining does it
  // hide the message; we still have the urlbar icon showing, giving
  // the user the ability to bring the warning message back up if they
  // so desire.
}

/**
 * Notice tab switches, and display or hide warnings as appropriate.
 *
 * TODO this logic can probably move into the browser view at some
 * point. But one thing at a time.
 */
PROT_Controller.prototype.onTabSwitch = function(e) {
  if (this.browserView_.hasProblem(e.fromBrowser)) 
    this.browserView_.problemBrowserUnselected(e.fromBrowser);

  if (this.browserView_.hasProblem(e.toBrowser))
    this.browserView_.problemBrowserSelected(e.toBrowser);
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// Some misc command-related plumbing used by the controller.


/**
 * A tiny wrapper class for super-simple command handlers.
 *
 * @param commandHandlerMap An object containing name/value pairs where
 *                          the name is command name (string) and value
 *                          is the function to execute for that command
 */
function PROT_CommandController(commandHandlerMap) {
  this.debugZone = "commandhandler";
  this.cmds_ = commandHandlerMap;
}

/**
 * @param cmd Command to query support for
 * @returns Boolean indicating if this controller supports cmd
 */
PROT_CommandController.prototype.supportsCommand = function(cmd) { 
  return (cmd in this.cmds_); 
}

/**
 * Trivial implementation
 *
 * @param cmd Command to query status of
 */
PROT_CommandController.prototype.isCommandEnabled = function(cmd) { 
  return true; 
}
  
/**
 * Execute a command
 *
 * @param cmd Command to execute
 */
PROT_CommandController.prototype.doCommand = function(cmd) {
  return this.cmds_[cmd](); 
}
 
/**
 * Trivial implementation
 */
PROT_CommandController.prototype.onEvent = function(cmd) { }

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *   J. Paul Reed <preed@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// A class that encapsulates data provider specific values.  The
// root of the provider pref tree is browser.safebrowsing.provider.
// followed by a number, followed by specific properties.  The properties
// that a data provider can supply are:
//
// name: The name of the provider
// lookupURL: The URL to send requests to in enhanced mode
// keyURL: Before we send URLs in enhanced mode, we need to encrypt them
// reportURL: When shown a warning bubble, we send back the user decision
//            (get me out of here/ignore warning) to this URL (strip cookies
//            first).  This is optional.
// reportGenericURL: HTML page for general user feedback
// reportPhishURL: HTML page for notifying the provider of a new phishing page
// reportErrorURL: HTML page for notifying the provider of a false positive

const kDataProviderIdPref = 'browser.safebrowsing.dataProvider';
const kProviderBasePref = 'browser.safebrowsing.provider.';

//@line 58 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/browser/components/safebrowsing/src/../content/globalstore.js"
const MOZ_OFFICIAL_BUILD = true;
//@line 62 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/browser/components/safebrowsing/src/../content/globalstore.js"

const MOZ_PARAM_LOCALE = /\{moz:locale\}/g;
const MOZ_PARAM_CLIENT = /\{moz:client\}/g;
const MOZ_PARAM_BUILDID = /\{moz:buildid\}/g;
const MOZ_PARAM_VERSION = /\{moz:version\}/g;

/**
 * Information regarding the data provider.
 */
function PROT_DataProvider() {
  this.prefs_ = new G_Preferences();

  this.loadDataProviderPrefs_();
  
  // Watch for changes in the data provider and update accordingly.
  this.prefs_.addObserver(kDataProviderIdPref,
                          BindToObject(this.loadDataProviderPrefs_, this));

  // Watch for when anti-phishing is toggled on or off.
  this.prefs_.addObserver(kPhishWardenEnabledPref,
                          BindToObject(this.loadDataProviderPrefs_, this));

  // Watch for when remote lookups are toggled on or off.
  this.prefs_.addObserver(kPhishWardenRemoteLookups,
                          BindToObject(this.loadDataProviderPrefs_, this));
}

/**
 * Populate all the provider variables.  We also call this when whenever
 * the provider id changes.
 */
PROT_DataProvider.prototype.loadDataProviderPrefs_ = function() {
  // Currently, there's no UI for changing local list provider so we
  // hard code the value for provider 0.
  this.updateURL_ = this.getUrlPref_(
        'browser.safebrowsing.provider.0.updateURL');

  var id = this.prefs_.getPref(kDataProviderIdPref, null);

  // default to 0
  if (null == id)
    id = 0;
  
  var basePref = kProviderBasePref + id + '.';

  this.name_ = this.prefs_.getPref(basePref + "name", "");

  // Urls used to get data from a provider
  this.lookupURL_ = this.getUrlPref_(basePref + "lookupURL");
  this.keyURL_ = this.getUrlPref_(basePref + "keyURL");
  this.reportURL_ = this.getUrlPref_(basePref + "reportURL");

  // Urls to HTML report pages
  this.reportGenericURL_ = this.getUrlPref_(basePref + "reportGenericURL");
  this.reportErrorURL_ = this.getUrlPref_(basePref + "reportErrorURL");
  this.reportPhishURL_ = this.getUrlPref_(basePref + "reportPhishURL");

  // Propogate the changes to the list-manager.
  this.updateListManager_();
}

/**
 * The list manager needs urls to operate.  It needs a url to know where the
 * table updates are, and it needs a url for decrypting enchash style tables.
 */
PROT_DataProvider.prototype.updateListManager_ = function() {
  var listManager = Cc["@mozilla.org/url-classifier/listmanager;1"]
                      .getService(Ci.nsIUrlListManager);

  // If we add support for changing local data providers, we need to add a
  // pref observer that sets the update url accordingly.
  listManager.setUpdateUrl(this.getUpdateURL());

  // setKeyUrl has the side effect of fetching a key from the server.
  // This shouldn't happen if anti-phishing is disabled or we're in local
  // list mode, so we need to check for that.
  var isEnabled = this.prefs_.getPref(kPhishWardenEnabledPref, false);
  var remoteLookups = this.prefs_.getPref(kPhishWardenRemoteLookups, false);
  if (isEnabled && remoteLookups) {
    listManager.setKeyUrl(this.getKeyURL());
  } else {
    // Clear the key to stop updates.
    listManager.setKeyUrl("");
  }
}

/**
 * Lookup the value of a URL from prefs file and do parameter substitution.
 */
PROT_DataProvider.prototype.getUrlPref_ = function(prefName) {
  var url = this.prefs_.getPref(prefName);

  var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
                          .getService(Components.interfaces.nsIXULAppInfo);

  var mozClientStr = MOZ_OFFICIAL_BUILD ? 'navclient-auto-ffox' : appInfo.name;

  // Parameter substitution
  url = url.replace(MOZ_PARAM_LOCALE, this.getLocale_());
  url = url.replace(MOZ_PARAM_CLIENT, mozClientStr);
  url = url.replace(MOZ_PARAM_BUILDID, appInfo.appBuildID);
  url = url.replace(MOZ_PARAM_VERSION, appInfo.version);
  return url;
}

/**
 * @return String the browser locale (similar code is in nsSearchService.js)
 */
PROT_DataProvider.prototype.getLocale_ = function() {
  const localePref = "general.useragent.locale";
  var locale = this.getLocalizedPref_(localePref);
  if (locale)
    return locale;

  // Not localized
  var prefs = new G_Preferences();
  return prefs.getPref(localePref, "");
}

/**
 * @return String name of the localized pref, null if none exists.
 */
PROT_DataProvider.prototype.getLocalizedPref_ = function(aPrefName) {
  // G_Preferences doesn't know about complex values, so we use the
  // xpcom object directly.
  var prefs = Cc["@mozilla.org/preferences-service;1"]
              .getService(Ci.nsIPrefBranch);
  try {
    return prefs.getComplexValue(aPrefName, Ci.nsIPrefLocalizedString).data;
  } catch (ex) {
  }
  return "";
}

//////////////////////////////////////////////////////////////////////////////
// Getters for the remote provider pref values mentioned above.
PROT_DataProvider.prototype.getName = function() {
  return this.name_;
}

PROT_DataProvider.prototype.getUpdateURL = function() {
  return this.updateURL_;
}

PROT_DataProvider.prototype.getLookupURL = function() {
  return this.lookupURL_;
}
PROT_DataProvider.prototype.getKeyURL = function() {
  return this.keyURL_;
}
PROT_DataProvider.prototype.getReportURL = function() {
  return this.reportURL_;
}

PROT_DataProvider.prototype.getReportGenericURL = function() {
  return this.reportGenericURL_;
}
PROT_DataProvider.prototype.getReportErrorURL = function() {
  return this.reportErrorURL_;
}
PROT_DataProvider.prototype.getReportPhishURL = function() {
  return this.reportPhishURL_;
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Niels Provos <niels@google.com> (original author)d

 *   Fritz Schneider <fritz@google.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// A warden that knows how to register lists with a listmanager and keep them
// updated if necessary.  The ListWarden also provides a simple interface to
// check if a URL is evil or not.  Specialized wardens like the PhishingWarden
// inherit from it.
//
// Classes that inherit from ListWarden are responsible for calling
// enableTableUpdates or disableTableUpdates.  This usually entails
// registering prefObservers and calling enable or disable in the base
// class as appropriate.
//

/**
 * Abtracts the checking of user/browser actions for signs of
 * phishing. 
 *
 * @constructor
 */
function PROT_ListWarden() {
  this.debugZone = "listwarden";
  var listManager = Cc["@mozilla.org/url-classifier/listmanager;1"]
                      .getService(Ci.nsIUrlListManager);
  this.listManager_ = listManager;

  // Once we register tables, their respective names will be listed here.
  this.blackTables_ = [];
  this.whiteTables_ = [];
}

PROT_ListWarden.IN_BLACKLIST = 0
PROT_ListWarden.IN_WHITELIST = 1
PROT_ListWarden.NOT_FOUND = 2

/**
 * Tell the ListManger to keep all of our tables updated
 */

PROT_ListWarden.prototype.enableBlacklistTableUpdates = function() {
  for (var i = 0; i < this.blackTables_.length; ++i) {
    this.listManager_.enableUpdate(this.blackTables_[i]);
  }
}

/**
 * Tell the ListManager to stop updating our tables
 */

PROT_ListWarden.prototype.disableBlacklistTableUpdates = function() {
  for (var i = 0; i < this.blackTables_.length; ++i) {
    this.listManager_.disableUpdate(this.blackTables_[i]);
  }
}

/**
 * Tell the ListManager to update whitelist tables.  They may be enabled even
 * when other updates aren't, for performance reasons.
 */
PROT_ListWarden.prototype.enableWhitelistTableUpdates = function() {
  for (var i = 0; i < this.whiteTables_.length; ++i) {
    this.listManager_.enableUpdate(this.whiteTables_[i]);
  }
}

/**
 * Tell the ListManager to stop updating whitelist tables.
 */
PROT_ListWarden.prototype.disableWhitelistTableUpdates = function() {
  for (var i = 0; i < this.whiteTables_.length; ++i) {
    this.listManager_.disableUpdate(this.whiteTables_[i]);
  }
}

/**
 * Register a new black list table with the list manager
 * @param tableName - name of the table to register
 * @returns true if the table could be registered, false otherwise
 */

PROT_ListWarden.prototype.registerBlackTable = function(tableName) {
  var result = this.listManager_.registerTable(tableName, false);
  if (result) {
    this.blackTables_.push(tableName);
  }
  return result;
}

/**
 * Register a new white list table with the list manager
 * @param tableName - name of the table to register
 * @returns true if the table could be registered, false otherwise
 */

PROT_ListWarden.prototype.registerWhiteTable = function(tableName) {
  var result = this.listManager_.registerTable(tableName, false);
  if (result) {
    this.whiteTables_.push(tableName);
  }
  return result;
}

/**
 * Method that looks up a url on the whitelist.
 *
 * @param url The URL to check
 * @param callback Function with a single param:
 *       PROT_ListWarden.IN_BLACKLIST, PROT_ListWarden.IN_WHITELIST,
 *       or PROT_ListWarden.NOT_FOUND
 */
PROT_ListWarden.prototype.isWhiteURL = function(url, callback) {
  (new MultiTableQuerier(url,
                         this.whiteTables_,
                         [] /* no blacklists */,
                         callback)).run();
}

/**
 * Method that looks up a url in both the white and black lists.
 *
 * If there is conflict, the white list has precedence over the black list.
 *
 * This is tricky because all database queries are asynchronous.  So we need
 * to chain together our checks against white and black tables.  We use
 * MultiTableQuerier (see below) to manage this.
 *
 * @param url URL to look up
 * @param callback Function with a single param:
 *       PROT_ListWarden.IN_BLACKLIST, PROT_ListWarden.IN_WHITELIST,
 *       or PROT_ListWarden.NOT_FOUND
 */
PROT_ListWarden.prototype.isEvilURL = function(url, callback) {
  (new MultiTableQuerier(url,
                         this.whiteTables_,
                         this.blackTables_,
                         callback)).run();
}

/**
 * This class helps us query multiple tables even though each table check
 * is asynchronous.  It provides callbacks for each listManager lookup
 * and decides whether we need to continue querying or not.  After
 * instantiating the method, use run() to invoke.
 *
 * @param url String The url to check
 * @param whiteTables Array of strings with each white table name
 * @param blackTables Array of strings with each black table name
 * @param callback Function to call with result 
 *       PROT_ListWarden.IN_BLACKLIST, PROT_ListWarden.IN_WHITELIST,
 *       or PROT_ListWarden.NOT_FOUND
 */
function MultiTableQuerier(url, whiteTables, blackTables, callback) {
  this.debugZone = "multitablequerier";
  this.url_ = url;

  this.whiteTables_ = whiteTables;
  this.blackTables_ = blackTables;
  this.whiteIdx_ = 0;
  this.blackIdx_ = 0;

  this.callback_ = callback;
  this.listManager_ = Cc["@mozilla.org/url-classifier/listmanager;1"]
                      .getService(Ci.nsIUrlListManager);
}

/**
 * We first query the white tables in succession.  If any contain
 * the url, we stop.  If none contain the url, we query the black tables
 * in succession.  If any contain the url, we call callback and
 * stop.  If none of the black tables contain the url, then we just stop
 * (i.e., it's not black url).
 */
MultiTableQuerier.prototype.run = function() {
  var whiteTable = this.whiteTables_[this.whiteIdx_];
  var blackTable = this.blackTables_[this.blackIdx_];
  if (whiteTable) {
    //G_Debug(this, "Looking in whitetable: " + whiteTable);
    ++this.whiteIdx_;
    this.listManager_.safeExists(whiteTable, this.url_,
                                 BindToObject(this.whiteTableCallback_,
                                              this));
  } else if (blackTable) {
    //G_Debug(this, "Looking in blacktable: " + blackTable);
    ++this.blackIdx_;
    this.listManager_.safeExists(blackTable, this.url_,
                                 BindToObject(this.blackTableCallback_,
                                              this));
  } else {
    // No tables left to check, so we quit.
    G_Debug(this, "Not found in any tables: " + this.url_);
    this.callback_(PROT_ListWarden.NOT_FOUND);

    // Break circular ref to callback.
    this.callback_ = null;
    this.listManager_ = null;
  }
}

/**
 * After checking a white table, we return here.  If the url is found,
 * we can stop.  Otherwise, we call run again.
 */
MultiTableQuerier.prototype.whiteTableCallback_ = function(isFound) {
  //G_Debug(this, "whiteTableCallback_: " + isFound);
  if (!isFound)
    this.run();
  else {
    G_Debug(this, "Found in whitelist: " + this.url_)
    this.callback_(PROT_ListWarden.IN_WHITELIST);

    // Break circular ref to callback.
    this.callback_ = null;
    this.listManager_ = null;
  }
}

/**
 * After checking a black table, we return here.  If the url is found,
 * we can call the callback and stop.  Otherwise, we call run again.
 */
MultiTableQuerier.prototype.blackTableCallback_ = function(isFound) {
  //G_Debug(this, "blackTableCallback_: " + isFound);
  if (!isFound) {
    this.run();
  } else {
    // In the blacklist, must be an evil url.
    G_Debug(this, "Found in blacklist: " + this.url_)
    this.callback_(PROT_ListWarden.IN_BLACKLIST);

    // Break circular ref to callback.
    this.callback_ = null;
    this.listManager_ = null;
  }
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// Implementation of the warning message we show users when we
// notice navigation to a phishing page after it has loaded. The
// browser view encapsulates all the hide/show logic, so the displayer
// doesn't need to know when to display itself, only how.
//
// Displayers implement the following interface:
//
// start() -- fired to initialize the displayer (to make it active). When
//            called, this displayer starts listening for and responding to
//            events. At most one displayer per tab should be active at a 
//            time, and start() should be called at most once.
// declineAction() -- fired when the user declines the warning.
// acceptAction() -- fired when the user declines the warning
// explicitShow() -- fired when the user wants to see the warning again
// browserSelected() -- the browser is the top tab
// browserUnselected() -- the browser is no long the top tab
// done() -- clean up. May be called once (even if the displayer wasn't
//           activated).
//
// At the moment, all displayers share access to the same xul in 
// safebrowsing-overlay.xul. Hence the need for at most one displayer
// to be active per tab at a time.

/**
 * Factory that knows how to create a displayer appropriate to the
 * user's platform. We use a clunky canvas-based displayer for all
 * platforms until such time as we can overlay semi-transparent
 * areas over browser content.
 *
 * See the base object for a description of the constructor args
 *
 * @constructor
 */
function PROT_PhishMsgDisplayer(msgDesc, browser, doc, url) {

  // TODO: Change this to return a PhishMsgDisplayerTransp on windows
  // (and maybe other platforms) when Firefox 2.0 hits.

  return new PROT_PhishMsgDisplayerCanvas(msgDesc, browser, doc, url);
}


/**
 * Base class that implements most of the plumbing required to hide
 * and show a phishing warning. Subclasses implement the actual
 * showMessage and hideMessage methods. 
 *
 * This class is not meant to be instantiated directly.
 *
 * @param msgDesc String describing the kind of warning this is
 * @param browser Reference to the browser over which we display the msg
 * @param doc Reference to the document in which browser is found
 * @param url String containing url of the problem document
 * @constructor
 */
function PROT_PhishMsgDisplayerBase(msgDesc, browser, doc, url) {
  this.debugZone = "phishdisplayer";
  this.msgDesc_ = msgDesc;                                // currently unused
  this.browser_ = browser;
  this.doc_ = doc;
  this.url_ = url;

  // We'll need to manipulate the XUL in safebrowsing-overlay.xul
  this.messageId_ = "safebrowsing-palm-message";
  this.messageTailId_ = "safebrowsing-palm-message-tail-container";
  this.messageContentId_ = "safebrowsing-palm-message-content";
  this.extendedMessageId_ = "safebrowsing-palm-extended-message";
  this.showmoreLinkId_ = "safebrowsing-palm-showmore-link";
  this.faqLinkId_ = "safebrowsing-palm-faq-link";
  this.urlbarIconId_ = "safebrowsing-urlbar-icon";
  this.refElementId_ = this.urlbarIconId_;

  // We use this to report user actions to the server
  this.reporter_ = new PROT_Reporter();

  // The active UI elements in our warning send these commands; bind them
  // to their handlers but don't register the commands until we start
  // (because another displayer might be active)
  this.commandHandlers_ = {
    "safebrowsing-palm-showmore":
      BindToObject(this.showMore_, this),
  };

  this.windowWatcher_ = 
    Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
    .getService(Components.interfaces.nsIWindowWatcher);
}

/**
 * @returns The default background color of the browser
 */
PROT_PhishMsgDisplayerBase.prototype.getBackgroundColor_ = function() {
  var pref = Components.classes["@mozilla.org/preferences-service;1"].
             getService(Components.interfaces.nsIPrefBranch);
  return pref.getCharPref("browser.display.background_color");
}

/**
 * Fired when the user declines our warning. Report it!
 */
PROT_PhishMsgDisplayerBase.prototype.declineAction = function() {
  G_Debug(this, "User declined warning.");
  G_Assert(this, this.started_, "Decline on a non-active displayer?");
  this.reporter_.report("phishdecline", this.url_);

  this.messageShouldShow_ = false;
  if (this.messageShowing_)
    this.hideMessage_();
}

/**
 * Fired when the user accepts our warning
 */
PROT_PhishMsgDisplayerBase.prototype.acceptAction = function() {
  G_Assert(this, this.started_, "Accept on an unstarted displayer?");
  G_Assert(this, this.done_, "Accept on a finished displayer?");
  G_Debug(this, "User accepted warning.");
  this.reporter_.report("phishaccept", this.url_);

  var url = this.getMeOutOfHereUrl_();
  this.browser_.loadURI(url);
}

/**
 * Get the url for "Get me out of here."  This is the browser's default home
 * page, or, about:blank.
 * @return String url
 */
PROT_PhishMsgDisplayerBase.prototype.getMeOutOfHereUrl_ = function() {
  // Try to get their homepage from prefs.
  var prefs = Cc["@mozilla.org/preferences-service;1"]
              .getService(Ci.nsIPrefService).getDefaultBranch(null);

  var url = "about:blank";
  try {
    url = prefs.getComplexValue("browser.startup.homepage",
                                Ci.nsIPrefLocalizedString).data;
    // If url is a pipe-delimited set of pages, just take the first one.
    // This will need to change once bug 221445 is fixed.
    if (url.indexOf("|") != -1)
      url = url.split("|")[0];
  } catch(e) {
    G_Debug(this, "Couldn't get homepage pref: " + e);
  }
  
  return url;
}

/**
 * Invoked when the browser is resized
 */
PROT_PhishMsgDisplayerBase.prototype.onBrowserResized_ = function(event) {
  G_Debug(this, "Got resize for " + event.target);

  if (this.messageShowing_) {
    this.hideMessage_(); 
    this.showMessage_();
  }
}

/**
 * Invoked by the browser view when our browser is switched to
 */
PROT_PhishMsgDisplayerBase.prototype.browserSelected = function() {
  G_Assert(this, this.started_, "Displayer selected before being started???");

  // If messageshowing hasn't been set, then this is the first time this
  // problematic browser tab has been on top, so do our setup and show
  // the warning.
  if (this.messageShowing_ === undefined) {
    this.messageShouldShow_ = true;
  }

  this.hideLockIcon_();        // Comes back when we are unselected or unloaded
  this.addWarningInUrlbar_();  // Goes away when we are unselected or unloaded

  // messageShouldShow might be false if the user dismissed the warning, 
  // switched tabs, and then switched back. We're still active, but don't
  // want to show the warning again. The user can cause it to show by
  // clicking our icon in the urlbar.
  if (this.messageShouldShow_)
    this.showMessage_();
}

/**
 * Invoked to display the warning message explicitly, for example if the user
 * clicked the url warning icon.
 */
PROT_PhishMsgDisplayerBase.prototype.explicitShow = function() {
  this.messageShouldShow_ = true;
  if (!this.messageShowing_)
    this.showMessage_();
}

/** 
 * Invoked by the browser view when our browser is switched away from
 */
PROT_PhishMsgDisplayerBase.prototype.browserUnselected = function() {
  this.removeWarningInUrlbar_();
  this.unhideLockIcon_();
  if (this.messageShowing_)
    this.hideMessage_();
}

/**
 * Invoked to make this displayer active. The displayer will now start
 * responding to notifications such as commands and resize events. We
 * can't do this in the constructor because there might be many 
 * displayers instantiated waiting in the problem queue for a particular
 * browser (e.g., a page has multiple framed problem pages), and we
 * don't want them all responding to commands!
 *
 * Invoked zero (the page we're a warning for was nav'd away from
 * before it reaches the head of the problem queue) or one (we're
 * displaying this warning) times by the browser view.
 */
PROT_PhishMsgDisplayerBase.prototype.start = function() {
  G_Assert(this, this.started_ == undefined, "Displayer started twice?");
  this.started_ = true;

  this.commandController_ = new PROT_CommandController(this.commandHandlers_);
  this.doc_.defaultView.controllers.appendController(this.commandController_);

  // Add an event listener for when the browser resizes (e.g., user
  // shows/hides the sidebar).
  this.resizeHandler_ = BindToObject(this.onBrowserResized_, this);
  this.browser_.addEventListener("resize",
                                 this.resizeHandler_, 
                                 false);
}

/**
 * @returns Boolean indicating whether this displayer is currently
 *          active
 */
PROT_PhishMsgDisplayerBase.prototype.isActive = function() {
  return !!this.started_;
}

/**
 * Invoked by the browser view to clean up after the user is done 
 * interacting with the message. Should be called once by the browser
 * view. 
 */
PROT_PhishMsgDisplayerBase.prototype.done = function() {
  G_Assert(this, !this.done_, "Called done more than once?");
  this.done_ = true;

  // If the Document we're showing the warning for was nav'd away from
  // before we had a chance to get started, we have nothing to do.
  if (this.started_) {

    // If we were started, we must be the current problem, so these things
    // must be showing
    this.removeWarningInUrlbar_();
    this.unhideLockIcon_();

    // Could be though that they've closed the warning dialog
    if (this.messageShowing_)
      this.hideMessage_();

    if (this.resizeHandler_) {
      this.browser_.removeEventListener("resize", 
                                        this.resizeHandler_, 
                                        false);
      this.resizeHandler_ = null;
    }
    
    var win = this.doc_.defaultView;
    win.controllers.removeController(this.commandController_);
    this.commandController_ = null;
  }
}

/**
 * Helper function to remove a substring from inside a string.
 *
 * @param orig String to remove substring from
 * 
 * @param toRemove String to remove (if it is present)
 *
 * @returns String with the substring removed
 */
PROT_PhishMsgDisplayerBase.prototype.removeIfExists_ = function(orig,
                                                                toRemove) {
  var pos = orig.indexOf(toRemove);
  if (pos != -1)
    orig = orig.substring(0, pos) + orig.substring(pos + toRemove.length);

  return orig;
}

/**
 * We don't want to confuse users if they land on a phishy page that uses
 * SSL, so ensure that the lock icon never shows when we're showing our 
 * warning.
 */
PROT_PhishMsgDisplayerBase.prototype.hideLockIcon_ = function() {
  var lockIcon = this.doc_.getElementById("lock-icon");
  if (!lockIcon)
    return;
  lockIcon.hidden = true;
}

/**
 * Ensure they can see it after our warning is finished.
 */
PROT_PhishMsgDisplayerBase.prototype.unhideLockIcon_ = function() {
  var lockIcon = this.doc_.getElementById("lock-icon");
  if (!lockIcon)
    return;
  lockIcon.hidden = false;
}

/**
 * This method makes our warning icon visible in the location bar. It will
 * be removed only when the problematic document is navigated awy from 
 * (i.e., when done() is called), and not when the warning is dismissed.
 */
PROT_PhishMsgDisplayerBase.prototype.addWarningInUrlbar_ = function() {
  var urlbarIcon = this.doc_.getElementById(this.urlbarIconId_);
  if (!urlbarIcon)
    return;
  urlbarIcon.setAttribute('level', 'warn');
}

/**
 * Hides our urlbar icon
 */
PROT_PhishMsgDisplayerBase.prototype.removeWarningInUrlbar_ = function() {
  var urlbarIcon = this.doc_.getElementById(this.urlbarIconId_);
  if (!urlbarIcon)
    return;
  urlbarIcon.setAttribute('level', 'safe');
}

/**
 * VIRTUAL -- Displays the warning message
 */
PROT_PhishMsgDisplayerBase.prototype.showMessage_ = function() { };

/**
 * VIRTUAL -- Hide the warning message from the user.
 */
PROT_PhishMsgDisplayerBase.prototype.hideMessage_ = function() { };

/**
 * Reposition the message relative to refElement in the parent window
 *
 * @param message Reference to the element to position
 * @param tail Reference to the message tail
 * @param refElement Reference to element relative to which we position
 *                   ourselves
 */
PROT_PhishMsgDisplayerBase.prototype.adjustLocation_ = function(message,
                                                                tail,
                                                                refElement) {
  var refX = refElement.boxObject.x;
  var refY = refElement.boxObject.y;
  var refHeight = refElement.boxObject.height;
  var refWidth = refElement.boxObject.width;
  G_Debug(this, "Ref element is at [window-relative] (" + refX + ", " + 
          refY + ")");

  var pixelsIntoRefY = -2;
  var tailY = refY + refHeight - pixelsIntoRefY;
  var tailPixelsLeftOfRefX = tail.boxObject.width;
  var tailPixelsIntoRefX = Math.round(refWidth / 2);
  var tailX = refX - tailPixelsLeftOfRefX + tailPixelsIntoRefX;

  // Move message up a couple pixels so the tail overlaps it.
  var messageY = tailY + tail.boxObject.height - 2;
  var messagePixelsLeftOfRefX = 375;
  var messageX = refX - messagePixelsLeftOfRefX;
  G_Debug(this, "Message is at [window-relative] (" + messageX + ", " + 
          messageY + ")");
  G_Debug(this, "Tail is at [window-relative] (" + tailX + ", " + 
          tailY + ")");

  if (messageX < 0) {
    // We're hanging off the left edge, switch to floating mode
    tail.style.display = "none";
    this.adjustLocationFloating_(message);
    return;
  }

  tail.style.top = tailY + "px";
  tail.style.left = tailX + "px";
  message.style.top = messageY + "px";
  message.style.left = messageX + "px";
  
  this.maybeAddScrollbars_();
}

/**
 * Position the warning bubble with no reference element.  In this case we
 * just center the warning bubble at the top of the users window.
 * @param message XULElement message bubble XUL container.
 */
PROT_PhishMsgDisplayerBase.prototype.adjustLocationFloating_ = function(message) {
  // Compute X offset
  var browserX = this.browser_.boxObject.x;
  var browserXCenter = browserX + this.browser_.boxObject.width / 2;
  var messageX = browserXCenter - (message.boxObject.width / 2);

  // Compute Y offset (top of the browser window)
  var messageY = this.browser_.boxObject.y;

  // Position message
  message.style.top = messageY + "px";
  message.style.left = messageX + "px";

  this.maybeAddScrollbars_();
}

/**
 * Add a vertical scrollbar if we're falling out of the browser window.
 */
PROT_PhishMsgDisplayerBase.prototype.maybeAddScrollbars_ = function() {
  var message = this.doc_.getElementById(this.messageId_);
  
  var content = this.doc_.getElementById(this.messageContentId_);
  var bottom = content.boxObject.y + content.boxObject.height;
  var maxY = this.doc_.defaultView.innerHeight;
  G_Debug(this, "bottom: " + bottom + ", maxY: " + maxY
                + ", new height: " + (maxY - content.boxObject.y));
  if (bottom > maxY) {
    var newHeight = maxY - content.boxObject.y;
    if (newHeight < 1)
      newHeight = 1;

    content.style.height = newHeight + "px";
    content.style.overflow = "auto";
  }
}

/**
 * Show the extended warning message
 */
PROT_PhishMsgDisplayerBase.prototype.showMore_ = function() {
  this.doc_.getElementById(this.extendedMessageId_).hidden = false;
  this.doc_.getElementById(this.showmoreLinkId_).style.display = "none";

  // set FAQ URL
  var formatter = Components.classes["@mozilla.org/toolkit/URLFormatterService;1"]
                            .getService(Components.interfaces.nsIURLFormatter);
  var faqURL = formatter.formatURLPref("browser.safebrowsing.warning.infoURL");
  var labelEl = this.doc_.getElementById(this.faqLinkId_);
  labelEl.setAttribute("href", faqURL);
  
  this.maybeAddScrollbars_();
}

/**
 * The user clicked on one of the links in the buble.  Display the
 * corresponding page in a new window with all the chrome enabled.
 *
 * @param url The URL to display in a new window
 */
PROT_PhishMsgDisplayerBase.prototype.showURL_ = function(url) {
  this.windowWatcher_.openWindow(this.windowWatcher_.activeWindow,
                                 url,
                                 "_blank",
                                 null,
                                 null);
}

/**
 * If the warning bubble came up in error, this url goes to a form
 * to notify the data provider.
 * @return url String
 */
PROT_PhishMsgDisplayerBase.prototype.getReportErrorURL_ = function() {
  var badUrl = this.url_;

  var url = gDataProvider.getReportErrorURL();
  url += "&url=" + encodeURIComponent(badUrl);
  return url;
}

/**
 * URL for the user to report back to us.  This is to provide the user
 * with an action after being warned.
 */
PROT_PhishMsgDisplayerBase.prototype.getReportGenericURL_ = function() {
  var badUrl = this.url_;

  var url = gDataProvider.getReportGenericURL();
  url += "&url=" + encodeURIComponent(badUrl);
  return url;
}


/**
 * A specific implementation of the dislpayer using a canvas. This
 * class is meant for use on platforms that don't support transparent
 * elements over browser content (currently: all platforms). 
 *
 * The main ugliness is the fact that we're hiding the content area and
 * painting the page to canvas. As a result, we must periodically
 * re-paint the canvas to reflect updates to the page. Otherwise if
 * the page was half-loaded when we showed our warning, it would
 * stay that way even though the page actually finished loading. 
 *
 * See base constructor for full details of constructor args.
 *
 * @constructor
 */
function PROT_PhishMsgDisplayerCanvas(msgDesc, browser, doc, url) {
  PROT_PhishMsgDisplayerBase.call(this, msgDesc, browser, doc, url);

  this.dimAreaId_ = "safebrowsing-dim-area-canvas";
  this.pageCanvasId_ = "safebrowsing-page-canvas";
  this.xhtmlNS_ = "http://www.w3.org/1999/xhtml";     // we create html:canvas
}

PROT_PhishMsgDisplayerCanvas.inherits(PROT_PhishMsgDisplayerBase);

/**
 * Displays the warning message.  First we make sure the overlay is loaded
 * then call showMessageAfterOverlay_.
 */
PROT_PhishMsgDisplayerCanvas.prototype.showMessage_ = function() {
  G_Debug(this, "Showing message.");

  // Load the overlay if we haven't already.
  var dimmer = this.doc_.getElementById('safebrowsing-dim-area-canvas');
  if (!dimmer) {
    var onOverlayMerged = BindToObject(this.showMessageAfterOverlay_,
                                       this);
    var observer = new G_ObserverWrapper("xul-overlay-merged",
                                         onOverlayMerged);

    this.doc_.loadOverlay(
        "chrome://browser/content/safebrowsing/warning-overlay.xul",
        observer);
  } else {
    // The overlay is already loaded so we go ahead and call
    // showMessageAfterOverlay_.
    this.showMessageAfterOverlay_();
  }
}

/**
 * This does the actual work of showing the warning message.
 */
PROT_PhishMsgDisplayerCanvas.prototype.showMessageAfterOverlay_ = function() {
  this.messageShowing_ = true;

  // Position the canvas overlay. Order here is significant, but don't ask me
  // why for some of these. You need to:
  // 1. get browser dimensions
  // 2. add canvas to the document
  // 3. unhide the dimmer (gray out overlay)
  // 4. display to the canvas
  // 5. unhide the warning message
  // 6. update link targets in warning message
  // 7. focus the warning message

  // (1)
  var w = this.browser_.boxObject.width;
  G_Debug(this, "browser w=" + w);
  var h = this.browser_.boxObject.height;
  G_Debug(this, "browser h=" + h);
  var x = this.browser_.boxObject.x;
  G_Debug(this, "browser x=" + w);
  var y = this.browser_.boxObject.y;
  G_Debug(this, "browser y=" + h);

  var win = this.browser_.contentWindow;
  var scrollX = win.scrollX;
  G_Debug(this, "win scrollx=" + scrollX);
  var scrollY = win.scrollY;
  G_Debug(this, "win scrolly=" + scrollY);

  // (2)
  // We add the canvas dynamically and remove it when we're done because
  // leaving it hanging around consumes a lot of memory.
  var pageCanvas = this.doc_.createElementNS(this.xhtmlNS_, "html:canvas");
  pageCanvas.id = this.pageCanvasId_;
  pageCanvas.style.left = x + 'px';
  pageCanvas.style.top = y + 'px';

  var dimarea = this.doc_.getElementById(this.dimAreaId_);
  this.doc_.getElementById('main-window').insertBefore(pageCanvas,
                                                       dimarea);

  // (3)
  dimarea.style.left = x + 'px';
  dimarea.style.top = y + 'px';
  dimarea.style.width = w + 'px';
  dimarea.style.height = h + 'px';
  dimarea.hidden = false;
  
  // (4)
  pageCanvas.setAttribute("width", w);
  pageCanvas.setAttribute("height", h);

  var bgcolor = this.getBackgroundColor_();

  var cx = pageCanvas.getContext("2d");
  cx.drawWindow(win, scrollX, scrollY, w, h, bgcolor);

  // Now repaint the window every so often in case the content hasn't fully
  // loaded at this point.
  var debZone = this.debugZone;
  function repaint() {
    G_Debug(debZone, "Repainting canvas...");
    cx.drawWindow(win, scrollX, scrollY, w, h, bgcolor);
  };
  this.repainter_ = new PROT_PhishMsgCanvasRepainter(repaint);

  // (5)
  this.showAndPositionWarning_();

  // (6)
  var link = this.doc_.getElementById('safebrowsing-palm-falsepositive-link');
  link.href = this.getReportErrorURL_();

  // (7)
  this.doc_.getElementById(this.messageContentId_).focus();
}

/**
 * Show and position the warning message.  We position the waring message
 * relative to the icon in the url bar, but if the element doesn't exist,
 * (e.g., the user remove the url bar from her/his chrome), we anchor at the
 * top of the window.
 */
PROT_PhishMsgDisplayerCanvas.prototype.showAndPositionWarning_ = function() {
  var refElement = this.doc_.getElementById(this.refElementId_);
  var message = this.doc_.getElementById(this.messageId_);
  var tail = this.doc_.getElementById(this.messageTailId_);

  message.hidden = false;
  message.style.display = "block";

  // Determine if the refElement is visible.
  if (this.isVisibleElement_(refElement)) {
    // Show tail and position warning relative to refElement.
    tail.hidden = false;
    tail.style.display = "block";
    this.adjustLocation_(message, tail, refElement);
  } else {
    // No ref element, position in the top center of window.
    tail.hidden = true;
    tail.style.display = "none";
    this.adjustLocationFloating_(message);
  }
}

/**
 * @return Boolean true if elt is a visible XUL element.
 */
PROT_PhishMsgDisplayerCanvas.prototype.isVisibleElement_ = function(elt) {
  if (!elt)
    return false;
  
  // If it's on a collapsed/hidden toolbar, the x position is set to 0.
  if (elt.boxObject.x == 0)
    return false;

  return true;
}

/**
 * Hide the warning message from the user.
 */
PROT_PhishMsgDisplayerCanvas.prototype.hideMessage_ = function() {
  G_Debug(this, "Hiding phishing warning.");
  G_Assert(this, this.messageShowing_, "Hide message called but not showing?");

  this.messageShowing_ = false;
  this.repainter_.cancel();
  this.repainter_ = null;

  // Hide the warning popup.
  var message = this.doc_.getElementById(this.messageId_);
  message.hidden = true;
  message.style.display = "none";
  var content = this.doc_.getElementById(this.messageContentId_);
  content.style.height = "";
  content.style.overflow = "";

  var tail = this.doc_.getElementById(this.messageTailId_);
  tail.hidden = true;
  tail.style.display = "none";

  // Remove the canvas element from the chrome document.
  var pageCanvas = this.doc_.getElementById(this.pageCanvasId_);
  pageCanvas.parentNode.removeChild(pageCanvas);

  // Hide the dimmer.
  var dimarea = this.doc_.getElementById(this.dimAreaId_);
  dimarea.hidden = true;
}


/**
 * Helper class that periodically repaints the canvas. We repaint
 * frequently at first, and then back off to a less frequent schedule
 * at "steady state," and finally just stop altogether. We have to do
 * this because we're not sure if the page has finished loading when
 * we first paint the canvas, and because we want to reflect any
 * dynamically written content into the canvas as it appears in the
 * page after load.
 *
 * @param repaintFunc Function to call to repaint browser.
 *
 * @constructor
 */
function PROT_PhishMsgCanvasRepainter(repaintFunc) {
  this.count_ = 0;
  this.repaintFunc_ = repaintFunc;
  this.initPeriodMS_ = 500;             // Initially repaint every 500ms
  this.steadyStateAtMS_ = 10 * 1000;    // Go slowly after 10 seconds,
  this.steadyStatePeriodMS_ = 3 * 1000; // repainting every 3 seconds, and
  this.quitAtMS_ = 20 * 1000;           // stop after 20 seconds
  this.startMS_ = (new Date).getTime();
  this.alarm_ = new G_Alarm(BindToObject(this.repaint, this), 
                            this.initPeriodMS_);
}

/**
 * Called periodically to repaint the canvas
 */
PROT_PhishMsgCanvasRepainter.prototype.repaint = function() {
  this.repaintFunc_();

  var nextRepaint;
  // If we're in "steady state", use the slow repaint rate, else fast
  if ((new Date).getTime() - this.startMS_ > this.steadyStateAtMS_)
    nextRepaint = this.steadyStatePeriodMS_;
  else 
    nextRepaint = this.initPeriodMS_;

  if (!((new Date).getTime() - this.startMS_ > this.quitAtMS_))
    this.alarm_ = new G_Alarm(BindToObject(this.repaint, this), nextRepaint);
}

/**
 * Called to stop repainting the canvas
 */
PROT_PhishMsgCanvasRepainter.prototype.cancel = function() {
  if (this.alarm_) {
    this.alarm_.cancel();
    this.alarm_ = null;
  }
  this.repaintFunc_ = null;
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// The warden checks request to see if they are for phishy pages. It
// does so by either querying a remote server with the URL (advanced
// protectoin mode) or querying our locally stored blacklists (privacy
// mode).
// 
// When the warden notices a problem, it queries all browser views
// (each of which corresopnds to an open browser window) to see
// whether one of them can handle it. A browser view can handle a
// problem if its browser window has an HTMLDocument loaded with the
// given URL and that Document hasn't already been flagged as a
// problem. For every problematic URL we notice loading, at most one
// Document is flagged as problematic. Otherwise you can get into
// trouble if multiple concurrent phishy pages load with the same URL.
//
// Since we check URLs very early in the request cycle (in a progress
// listener), the URL might not yet be associated with a Document when
// we determine that it is phishy. So the the warden retries finding
// a browser view to handle the problem until one can, or until it
// determines it should give up (see complicated logic below).
//
// The warden has displayers that the browser view uses to render
// different kinds of warnings (e.g., one that's shown before a page
// loads as opposed to one that's shown after the page has already
// loaded).
//
// Note: There is a single warden for the whole application.
//
// TODO better way to expose displayers/views to browser view

const kPhishWardenEnabledPref = "browser.safebrowsing.enabled";
const kPhishWardenRemoteLookups = "browser.safebrowsing.remoteLookups";

// We have hardcoded URLs that we let people navigate to in order to 
// check out the warning.
const kTestUrls = {
  "http://www.google.com/tools/firefox/safebrowsing/phish-o-rama.html": true,
  "http://www.mozilla.org/projects/bonecho/anti-phishing/its-a-trap.html": true,
  "http://www.mozilla.com/firefox/its-a-trap.html": true,
}

/**
 * Abtracts the checking of user/browser actions for signs of
 * phishing. 
 *
 * @param progressListener nsIDocNavStartProgressListener
 * @constructor
 */
function PROT_PhishingWarden(progressListener) {
  PROT_ListWarden.call(this);

  this.debugZone = "phishwarden";
  this.testing_ = false;
  this.browserViews_ = [];

  // Use this to query preferences
  this.prefs_ = new G_Preferences();

  // Only one displayer so far; perhaps we'll have others in the future
  this.displayers_ = {
    "afterload": PROT_PhishMsgDisplayer,
  };

  // We use this dude to do lookups on our remote server
  this.fetcher_ = new PROT_TRFetcher();

  // We need to know whether we're enabled and whether we're in advanced
  // mode, so reflect the appropriate preferences into our state.

  // Read state: should we be checking remote preferences?
  this.checkRemote_ = this.prefs_.getPref(kPhishWardenRemoteLookups, null);
  
  // true if we should use whitelists to suppress remote lookups
  this.checkWhitelists_ = false;

  // Get notifications when the remote check preference changes
  var checkRemotePrefObserver = BindToObject(this.onCheckRemotePrefChanged,
                                             this);
  this.prefs_.addObserver(kPhishWardenRemoteLookups, checkRemotePrefObserver);

  // Global preference to enable the phishing warden
  this.phishWardenEnabled_ = this.prefs_.getPref(kPhishWardenEnabledPref, null);

  // Get notifications when the phishing warden enabled pref changes
  var phishWardenPrefObserver = 
    BindToObject(this.onPhishWardenEnabledPrefChanged, this);
  this.prefs_.addObserver(kPhishWardenEnabledPref, phishWardenPrefObserver);
  
  // Get notifications when the data provider pref changes
  var dataProviderPrefObserver =
    BindToObject(this.onDataProviderPrefChanged, this);
  this.prefs_.addObserver(kDataProviderIdPref, dataProviderPrefObserver);

  // hook up our browser listener
  this.progressListener_ = progressListener;
  this.progressListener_.callback = this;
  this.progressListener_.enabled = this.phishWardenEnabled_;
  // ms to wait after a request has started before firing JS callback
  this.progressListener_.delay = 1500;

  // object to keep track of request errors if we're in remote check mode
  this.requestBackoff_ = new RequestBackoff(3 /* num errors */,
                                   10*60*1000 /* error time, 10min */,
                                   10*60*1000 /* backoff interval, 10min */,
                                   6*60*60*1000 /* max backoff, 6hr */);

  G_Debug(this, "phishWarden initialized");
}

PROT_PhishingWarden.inherits(PROT_ListWarden);

/**
 * We implement nsIWebProgressListener
 */
PROT_PhishingWarden.prototype.QueryInterface = function(iid) {
  if (iid.equals(Ci.nsISupports) || 
      iid.equals(Ci.nsIWebProgressListener) ||
      iid.equals(Ci.nsISupportsWeakReference))
    return this;
  throw Components.results.NS_ERROR_NO_INTERFACE;
}

/**
 * Cleanup on shutdown.
 */
PROT_PhishingWarden.prototype.shutdown = function() {
  this.progressListener_.callback = null;
  this.progressListener_ = null;
  this.listManager_ = null;
}

/**
 * When a preference (either advanced features or the phishwarden
 * enabled) changes, we might have to start or stop asking for updates. 
 * 
 * This is a little tricky; we start or stop management only when we
 * have complete information we can use to determine whether we
 * should.  It could be the case that one pref or the other isn't set
 * yet (e.g., they haven't opted in/out of advanced features). So do
 * nothing unless we have both pref values -- we get notifications for
 * both, so eventually we will start correctly.
 */ 
PROT_PhishingWarden.prototype.maybeToggleUpdateChecking = function() {
  if (this.testing_)
    return;

  var phishWardenEnabled = this.prefs_.getPref(kPhishWardenEnabledPref, null);

  this.checkRemote_ = this.prefs_.getPref(kPhishWardenRemoteLookups, null);

  G_Debug(this, "Maybe toggling update checking. " +
          "Warden enabled? " + phishWardenEnabled + " || " +
          "Check remote? " + this.checkRemote_);

  // Do nothing unless both prefs are set.  They can be null (unset), true, or
  // false.
  if (phishWardenEnabled === null || this.checkRemote_ === null)
    return;

  // We update and save to disk all tables if we don't have remote checking
  // enabled.
  if (phishWardenEnabled === true) {
    // If anti-phishing is enabled, we always download the local files to
    // use in case remote lookups fail.
    this.enableBlacklistTableUpdates();
    this.enableWhitelistTableUpdates();

    if (this.checkRemote_ === true) {
      // Remote lookup mode
      // We check to see if the local list update host is the same as the
      // remote lookup host.  If they are the same, then we don't bother
      // to do a remote url check if the url is in the whitelist.
      var ioService = Cc["@mozilla.org/network/io-service;1"]
                     .getService(Ci.nsIIOService);
      var updateHost = '';
      var lookupHost = '';
      try {
        var url = ioService.newURI(gDataProvider.getUpdateURL(),
                                         null, null);
        updateHost = url.asciiHost;
      } catch (e) { }
      try {
        var url = ioService.newURI(gDataProvider.getLookupURL(),
                                         null, null);
        lookupHost = url.asciiHost;
      } catch (e) { }

      if (updateHost && lookupHost && updateHost == lookupHost) {
        // The data provider for local lists and remote lookups is the
        // same, enable whitelist lookup suppression.
        this.checkWhitelists_ = true;
      } else {
        // hosts don't match, don't use whitelist suppression
        this.checkWhitelists_ = false;
      }
    }
  } else {
    // Anti-phishing is off, disable table updates
    this.disableBlacklistTableUpdates();
    this.disableWhitelistTableUpdates();
  }
}

/**
 * Controllers register their browser views with us
 *
 * @param view Reference to a browser view 
 */
PROT_PhishingWarden.prototype.addBrowserView = function(view) {
  G_Debug(this, "New browser view registered.");
  this.browserViews_.push(view);
}

/**
 * Controllers unregister their views when their window closes
 *
 * @param view Reference to a browser view 
 */
PROT_PhishingWarden.prototype.removeBrowserView = function(view) {
  for (var i = 0; i < this.browserViews_.length; i++)
    if (this.browserViews_[i] === view) {
      G_Debug(this, "Browser view unregistered.");
      this.browserViews_.splice(i, 1);
      return;
    }
  G_Assert(this, false, "Tried to unregister non-existent browser view!");
}

/**
 * Deal with a user changing the pref that says whether we should check
 * the remote server (i.e., whether we're in advanced mode)
 *
 * @param prefName Name of the pref holding the value indicating whether
 *                 we should check remote server
 */
PROT_PhishingWarden.prototype.onCheckRemotePrefChanged = function(prefName) {
  this.checkRemote_ = this.prefs_.getBoolPrefOrDefault(prefName,
                                                       this.checkRemote_);
  this.requestBackoff_.reset();
  this.maybeToggleUpdateChecking();
}

/**
 * Deal with a user changing the pref that says whether we should 
 * enable the phishing warden (i.e., that SafeBrowsing is active)
 *
 * @param prefName Name of the pref holding the value indicating whether
 *                 we should enable the phishing warden
 */
PROT_PhishingWarden.prototype.onPhishWardenEnabledPrefChanged = function(
                                                                    prefName) {
  this.phishWardenEnabled_ = 
    this.prefs_.getBoolPrefOrDefault(prefName, this.phishWardenEnabled_);
  this.requestBackoff_.reset();
  this.maybeToggleUpdateChecking();
  this.progressListener_.enabled = this.phishWardenEnabled_;
}

/**
 * Event fired when the user changes data providers.
 */
PROT_PhishingWarden.prototype.onDataProviderPrefChanged = function(prefName) {
  // We want to reset request backoff state since it's a different provider.
  this.requestBackoff_.reset();

  // If we have a new data provider and we're doing remote lookups, then
  // we may want to use whitelist lookup suppression or change which
  // tables are being downloaded.
  if (this.checkRemote_) {
    this.maybeToggleUpdateChecking();
  }
}

/**
 * A request for a Document has been initiated somewhere. Check it!
 *
 * @param request
 * @param url
 */ 
PROT_PhishingWarden.prototype.onDocNavStart = function(request, url) {
  G_Debug(this, "checkRemote: " +
          (this.checkRemote_ ? "yes" : "no"));

  // If we're on a test page, trigger the warning.
  // XXX Do we still need a test url or should each provider just put
  // it in their local list?
  if (this.isBlacklistTestURL(url)) {
    this.houstonWeHaveAProblem_(request);
    return;
  }

  // Make a remote lookup check if the pref is selected and if we haven't
  // triggered server backoff.  Otherwise, make a local check.
  if (this.checkRemote_ && this.requestBackoff_.canMakeRequest()) {
    // If we can use whitelists to suppress remote lookups, do so.
    if (this.checkWhitelists_) {
      var maybeRemoteCheck = BindToObject(this.maybeMakeRemoteCheck_,
                                          this,
                                          url,
                                          request);
      this.isWhiteURL(url, maybeRemoteCheck);
    } else {
      // Do a remote lookup (don't check whitelists)
      this.fetcher_.get(url,
                        BindToObject(this.onTRFetchComplete,
                                     this,
                                     url,
                                     request));
    }
  } else {
    // Check the local lists for a match.
    var evilCallback = BindToObject(this.localListMatch_,
                                    this,
                                    url,
                                    request);
    this.isEvilURL(url, evilCallback);
  }
}

/** 
 * Callback from whitelist check when remote lookups is on.
 * @param url String url to lookup
 * @param request nsIRequest object
 * @param status int enum from callback (PROT_ListWarden.IN_BLACKLIST,
 *    PROT_ListWarden.IN_WHITELIST, PROT_ListWarden.NOT_FOUND)
 */
PROT_PhishingWarden.prototype.maybeMakeRemoteCheck_ = function(url, request, status) {
  if (PROT_ListWarden.IN_WHITELIST == status)
    return;

  G_Debug(this, "Local whitelist lookup failed");
  this.fetcher_.get(url,
                    BindToObject(this.onTRFetchComplete,
                                 this,
                                 url,
                                 request));
}

/**
 * Invoked with the result of a lookupserver request.
 *
 * @param url String the URL we looked up
 * @param request The nsIRequest in which we're interested
 * @param trValues Object holding name/value pairs parsed from the
 *                 lookupserver's response
 * @param status Number HTTP status code or NS_ERROR_NOT_AVAILABLE if there's
 *               an HTTP error
 */
PROT_PhishingWarden.prototype.onTRFetchComplete = function(url,
                                                           request,
                                                           trValues,
                                                           status) {
  // Did the remote http request succeed?  If not, we fall back on
  // local lists.
  if (status == Components.results.NS_ERROR_NOT_AVAILABLE ||
      this.requestBackoff_.isErrorStatus_(status)) {
    this.requestBackoff_.noteServerResponse(status);

    G_Debug(this, "remote check failed, using local lists instead");
    var evilCallback = BindToObject(this.localListMatch_,
                                    this,
                                    url,
                                    request);
    this.isEvilURL(url, evilCallback);
  } else {
    var callback = BindToObject(this.houstonWeHaveAProblem_, this, request);
    this.checkRemoteData(callback, trValues);
  }
}

/**
 * One of our Check* methods found a problem with a request. Why do we
 * need to keep the nsIRequest (instead of just passing in the URL)? 
 * Because we need to know when to stop looking for the URL its
 * fetching, and to know this we need the nsIRequest.isPending flag.
 *
 * @param request nsIRequest that is problematic
 */
PROT_PhishingWarden.prototype.houstonWeHaveAProblem_ = function(request) {

  // We have a problem request that might or might not be associated
  // with a Document that's currently in a browser. If it is, we 
  // want that Document. If it's not, we want to give it a chance to 
  // be loaded. See below for complete details.

  if (this.maybeLocateProblem_(request))       // Cases 1 and 2 (see below)
    return;

  // OK, so the request isn't associated with any currently accessible
  // Document, and we want to give it the chance to be. We don't want
  // to retry forever (e.g., what if the Document was already displayed
  // and navigated away from?), so we'll use nsIRequest.isPending to help
  // us decide what to do.
  //
  // A complication arises because there is a lag between when a
  // request transitions from pending to not-pending and when it's
  // associated with a Document in a browser. The transition from
  // pending to not occurs just before the notification corresponding
  // to NavWatcher.DOCNAVSTART (see NavWatcher), but the association
  // occurs afterwards. Unfortunately, we're probably in DOCNAVSTART.
  // 
  // Diagnosis by Darin:
  // ---------------------------------------------------------------------------
  // Here's a summary of what happens:
  //
  //   RestorePresentation() {
  //     Dispatch_OnStateChange(dummy_request, STATE_START)
  //     PostCompletionEvent()
  //   }
  //
  //   CompletionEvent() {
  //     ReallyRestorePresentation()
  //     Dispatch_OnStateChange(dummy_request, STATE_STOP)
  //   }
  //
  // So, now your code receives that initial OnStateChange event and sees
  // that the dummy_request is not pending and not loaded in any window.
  // So, you put a timeout(0) event in the queue.  Then, the CompletionEvent
  // is added to the queue.  The stack unwinds....
  //
  // Your timeout runs, and you find that the dummy_request is still not
  // pending and not loaded in any window.  Then the CompletionEvent
  // runs, and it hooks up the cached presentation.
  // 
  // https://bugzilla.mozilla.org/show_bug.cgi?id=319527
  // ---------------------------------------------------------------------------
  //
  // So the logic is:
  //
  //         request     found an unhandled          
  //  case   pending?    doc with the url?         action
  //  ----------------------------------------------------------------
  //   1      yes             yes           Use that doc (handled above)
  //   2      no              yes           Use that doc (handled above)
  //   3      yes             no            Retry
  //   4      no              no            Retry twice (case described above)
  //
  // We don't get into trouble with Docs with the same URL "stealing" the 
  // warning because there is exactly one warning signaled per nav to 
  // a problem URL, and each Doc can be marked as problematic at most once.

  if (request.isPending()) {        // Case 3

    G_Debug(this, "Can't find problem Doc; Req pending. Retrying.");
    new G_Alarm(BindToObject(this.houstonWeHaveAProblem_, 
                             this, 
                             request), 
                200 /*ms*/);

  } else {                          // Case 4

    G_Debug(this, 
            "Can't find problem Doc; Req completed. Retrying at most twice.");
    new G_ConditionalAlarm(BindToObject(this.maybeLocateProblem_, 
                                        this, 
                                        request),
                           0 /* next event loop */, 
                           true /* repeat */, 
                           2 /* at most twice */);
  }
}

/**
 * Query all browser views we know about and offer them the chance to
 * handle the problematic request.
 *
 * @param request nsIRequest that is problematic
 * 
 * @returns Boolean indicating if someone decided to handle it
 */
PROT_PhishingWarden.prototype.maybeLocateProblem_ = function(request) {
  G_Debug(this, "Trying to find the problem.");

  G_Debug(this, this.browserViews_.length + " browser views to check.");
  for (var i = 0; i < this.browserViews_.length; i++) {
    if (this.browserViews_[i].tryToHandleProblemRequest(this, request)) {
      G_Debug(this, "Found browser view willing to handle problem!");
      return true;
    }
    G_Debug(this, "wrong browser view");
  }
  return false;
}

/**
 * Indicates if this URL is one of the possible blacklist test URLs.
 * These test URLs should always be considered as phishy.
 *
 * @param url URL to check 
 * @return A boolean indicating whether this is one of our blacklist
 *         test URLs
 */
PROT_PhishingWarden.prototype.isBlacklistTestURL = function(url) {
  // Explicitly check for URL so we don't get JS warnings in strict mode.
  if (kTestUrls[url])
    return true;
  return false;
}

/**
 * Callback for found local blacklist match.  First we report that we have
 * a blacklist hit, then we bring up the warning dialog.
 * @param status Number enum from callback (PROT_ListWarden.IN_BLACKLIST,
 *    PROT_ListWarden.IN_WHITELIST, PROT_ListWarden.NOT_FOUND)
 */
PROT_PhishingWarden.prototype.localListMatch_ = function(url, request, status) {
  if (PROT_ListWarden.IN_BLACKLIST != status)
    return;

  // Maybe send a report
  (new PROT_Reporter).report("phishblhit", url);
  this.houstonWeHaveAProblem_(request);
}

/**
 * Examine data fetched from a lookup server for evidence of a
 * phishing problem. 
 *
 * @param callback Function to invoke if there is a problem. 
 * @param trValues Object containing name/value pairs the server returned
 */
PROT_PhishingWarden.prototype.checkRemoteData = function(callback, 
                                                         trValues) {

  if (!trValues) {
    G_Debug(this, "Didn't get TR values from the server.");
    return;
  }
  
  G_Debug(this, "Page has phishiness " + trValues["phishy"]);

  if (trValues["phishy"] == 1) {     // It's on our blacklist 
    G_Debug(this, "Remote blacklist hit");
    callback(this);
  } else {
    G_Debug(this, "Remote blacklist miss");
  }
}

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// A tiny class to do reporting for us. We report interesting user actions
// such as the user hitting a blacklisted page, and the user accepting
// or declining the warning.
//
// Each report has a subject and data. Current reports are:
//
// subject         data     meaning
// --------------------------------
// phishnavaway    url      the user navigated away from a phishy page
// phishdecline    url      the user declined our warning
// phishaccept     url      the user accepted our warning
// phishblhit      url      the user loaded a phishing page
//
// We only send reports in advanced protection mode, and even then we
// strip cookies from the request before sending it.

/**
 * A very complicated class to send pings to the provider. The class does
 * nothing if we're not in advanced protection mode.
 *
 * @constructor
 */
function PROT_Reporter() {
  this.debugZone = "reporter";
  this.prefs_ = new G_Preferences();
}

/**
 * Send a report!
 *
 * @param subject String indicating what this report is about (will be 
 *                urlencoded)
 * @param data String giving extra information about this report (will be 
 *                urlencoded)
 */
PROT_Reporter.prototype.report = function(subject, data) {
  // Send a report iff we're in advanced protection mode
  if (!this.prefs_.getPref(kPhishWardenRemoteLookups, false))
    return;
  // Make sure a report url is defined
  var url = gDataProvider.getReportURL();

  // Report url is optional, so we just ignore the request if a report
  // url isn't provided.
  if (!url)
    return;

  url += "evts=" + encodeURIComponent(subject)
         + "&evtd=" + encodeURIComponent(data);
  G_Debug(this, "Sending report: " + url);
  (new PROT_XMLFetcher(true /* strip cookies */)).get(url, null /* no cb */);
}
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Google Safe Browsing.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Fritz Schneider <fritz@google.com> (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


// A helper class that does "trustrank" lookups on a remote
// server. Right now this lookup just indicates if a page is
// phishing. The response format is protocol4 name/value pairs.
// 
// Since we're sending full URLs to the server, we try to encrypt
// them before transmission. Else HTTPS query params could leak.

/**
 * A helper class that fetches trustrank values, parses them, and
 * passes them via an object to a callback.
  * 
 * @constructor
 */
function PROT_TRFetcher(opt_noCrypto) {
  this.debugZone = "trfetcher";
  this.useCrypto_ = !opt_noCrypto;
  this.protocol4Parser_ = new G_Protocol4Parser();

  // We lazily instantiate the UrlCrypto object due to:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=321024
  //
  // Otherwise here we would use:
  // this.urlCrypto_ = new PROT_UrlCrypto();
}

PROT_TRFetcher.TRY_REKEYING_RESPONSE = "pleaserekey";

/**
 * Get the URL of the request that will fetch us TR for the argument URL
 *
 * @param url String containing the URL we'd like to fetch info about
 *
 * @returns String containing the url we should use to fetch tr info
 */
PROT_TRFetcher.prototype.getRequestURL_ = function(url) {

  if (!this.urlCrypto_)
    this.urlCrypto_ = new PROT_UrlCrypto();

  G_Debug(this, "Fetching for " + url);
    
  var requestURL = gDataProvider.getLookupURL();
  if (!requestURL)
    return null;

  if (this.useCrypto_) {
    var maybeCryptedParams = this.urlCrypto_.maybeCryptParams({ "q": url});
    
    for (var param in maybeCryptedParams) 
      requestURL += param + "=" + 
                    encodeURIComponent(maybeCryptedParams[param]) + "&";
  } else {
    requestURL += "q=" + encodeURIComponent(url);
  }

  G_Debug(this, "Request URL: " + requestURL);

  return requestURL;
};

/**
 * Fetches information about a page.
 * 
 * @param forPage URL for which to fetch info
 *
 * @param callback Function to call back when complete.
 */
PROT_TRFetcher.prototype.get = function(forPage, callback) {
  
  var url = this.getRequestURL_(forPage);
  if (!url) {
    G_Debug(this, "No remote lookup url.");
    return;
  }
  var closure = BindToObject(this.onFetchComplete_, this, callback);
  (new PROT_XMLFetcher()).get(url, closure);
};

/**
 * Invoked when a fetch has completed.
 *
 * @param callback Function to invoke with parsed response object
 * @param responseText Text of the protocol4 message
 * @param httpStatus Number HTTP status code or NS_ERROR_NOT_AVAILABLE if the
 *     request failed
 */
PROT_TRFetcher.prototype.onFetchComplete_ = function(callback, responseText,
                                                     httpStatus) {
  
  var responseObj = this.extractResponse_(responseText);

  // The server might tell us to rekey, for example if it sees that
  // our request was unencrypted (meaning that we might not yet have
  // a key). If so, pass this hint along to the crypto key manager.

  if (responseObj[PROT_TRFetcher.TRY_REKEYING_RESPONSE] == "1" &&
      this.urlCrypto_) {
    G_Debug(this, "We're supposed to re-key. Trying.");
    var manager = this.urlCrypto_.getManager();
    if (manager)
      manager.maybeReKey();
  }

  G_Debug(this, "TR Response:");
  for (var field in responseObj)
    G_Debug(this, field + "=" + responseObj[field]);

  callback(responseObj, httpStatus);
};

/**
 * Parse a protocol4 message (lookup server response)
 * 
 * @param responseText String containing the server's response
 *
 * @returns Object containing the returned values or null if no
 *          response was received
 */
PROT_TRFetcher.prototype.extractResponse_ = function(responseText) {
  return this.protocol4Parser_.parse(responseText);
};

//@line 27 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/browser/components/safebrowsing/src/nsSafebrowsingApplication.js"

var modScope = this;
function Init() {
  var jslib = Cc["@mozilla.org/url-classifier/jslib;1"]
              .getService().wrappedJSObject;
  modScope.String.prototype.startsWith = jslib.String.prototype.startsWith;
  modScope.G_Debug = jslib.G_Debug;
  modScope.G_Assert = jslib.G_Assert;
  modScope.G_Alarm = jslib.G_Alarm;
  modScope.G_ConditionalAlarm = jslib.G_ConditionalAlarm;
  modScope.G_ObserverWrapper = jslib.G_ObserverWrapper;
  modScope.G_Preferences = jslib.G_Preferences;
  modScope.PROT_XMLFetcher = jslib.PROT_XMLFetcher;
  modScope.BindToObject = jslib.BindToObject;
  modScope.G_Protocol4Parser = jslib.G_Protocol4Parser;
  modScope.G_ObjectSafeMap = jslib.G_ObjectSafeMap;
  modScope.PROT_UrlCrypto = jslib.PROT_UrlCrypto;
  modScope.RequestBackoff = jslib.RequestBackoff;
  
  // We only need to call Init once
  modScope.Init = function() {};
}

// Module object
function SafebrowsingApplicationMod() {
  this.firstTime = true;
  this.cid = Components.ID("{c64d0bcb-8270-4ca7-a0b3-3380c8ffecb5}");
  this.progid = "@mozilla.org/safebrowsing/application;1";
}

SafebrowsingApplicationMod.prototype.registerSelf = function(compMgr, fileSpec, loc, type) {
  if (this.firstTime) {
    this.firstTime = false;
    throw Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
  }
  compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
  compMgr.registerFactoryLocation(this.cid,
                                  "Safebrowsing Application Module",
                                  this.progid,
                                  fileSpec,
                                  loc,
                                  type);
};

SafebrowsingApplicationMod.prototype.getClassObject = function(compMgr, cid, iid) {  
  if (!cid.equals(this.cid))
    throw Components.results.NS_ERROR_NO_INTERFACE;
  if (!iid.equals(Ci.nsIFactory))
    throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

  return this.factory;
}

SafebrowsingApplicationMod.prototype.canUnload = function(compMgr) {
  return true;
}

SafebrowsingApplicationMod.prototype.factory = {
  createInstance: function(outer, iid) {
    if (outer != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    Init();
    return new PROT_Application();
  }
};

var ApplicationModInst = new SafebrowsingApplicationMod();

function NSGetModule(compMgr, fileSpec) {
  return ApplicationModInst;
}
