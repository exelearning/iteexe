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
 * The Original Code is Url Classifier code
 *
 * The Initial Developer of the Original Code is
 * Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Tony Chang <tony@ponderer.org>
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

// We wastefully reload the same JS files across components.  This puts all
// the common JS files used by safebrowsing and url-classifier into a
// single component.

const Cc = Components.classes;
const Ci = Components.interfaces;
const G_GDEBUG = false;

// TODO: get rid of application.js and filesystem.js (not used much)
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
 *   Aaron Boodman <aa@google.com> (original author)
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

// This file has pure js helper functions. Hence you'll find metion
// of browser-specific features in here.


/**
 * lang.js - The missing JavaScript language features
 *
 * WARNING: This class adds members to the prototypes of String, Array, and
 * Function for convenience.
 *
 * The tradeoff is that the for/in statement will not work properly for those
 * objects when this library is used.
 *
 * To work around this for Arrays, you may want to use the forEach() method,
 * which is more fun and easier to read.
 */

/**
 * Returns true if the specified value is |null|
 */
function isNull(val) {
  return val === null;
}

/**
 * Returns true if the specified value is an array
 */
function isArray(val) {
  return isObject(val) && val.constructor == Array;
}

/**
 * Returns true if the specified value is a string
 */
function isString(val) {
  return typeof val == "string";
}

/**
 * Returns true if the specified value is a boolean
 */
function isBoolean(val) {
  return typeof val == "boolean";
}

/**
 * Returns true if the specified value is a number
 */
function isNumber(val) {
  return typeof val == "number";
}

/**
 * Returns true if the specified value is a function
 */
function isFunction(val) {
  return typeof val == "function";
}

/**
 * Returns true if the specified value is an object
 */
function isObject(val) {
  return val && typeof val == "object";
}

/**
 * Returns an array of all the properties defined on an object
 */
function getObjectProps(obj) {
  var ret = [];

  for (var p in obj) {
    ret.push(p);
  }

  return ret;
}

/**
 * Returns true if the specified value is an object which has no properties
 * defined.
 */
function isEmptyObject(val) {
  if (!isObject(val)) {
    return false;
  }

  for (var p in val) {
    return false;
  }

  return true;
}

var getHashCode;
var removeHashCode;

(function () {
  var hashCodeProperty = "lang_hashCode_";

  /**
   * Adds a lang_hashCode_ field to an object. The hash code is unique for the
   * given object.
   * @param obj {Object} The object to get the hash code for
   * @returns {Number} The hash code for the object
   */
  getHashCode = function(obj) {
    // In IE, DOM nodes do not extend Object so they do not have this method.
    // we need to check hasOwnProperty because the proto might have this set.
    if (obj.hasOwnProperty && obj.hasOwnProperty(hashCodeProperty)) {
      return obj[hashCodeProperty];
    }
    if (!obj[hashCodeProperty]) {
      obj[hashCodeProperty] = ++getHashCode.hashCodeCounter_;
    }
    return obj[hashCodeProperty];
  };

  /**
   * Removes the lang_hashCode_ field from an object.
   * @param obj {Object} The object to remove the field from. 
   */
  removeHashCode = function(obj) {
    obj.removeAttribute(hashCodeProperty);
  };

  getHashCode.hashCodeCounter_ = 0;
})();

/**
 * Fast prefix-checker.
 */
String.prototype.startsWith = function(prefix) {
  if (this.length < prefix.length) {
    return false;
  }

  if (this.substring(0, prefix.length) == prefix) {
    return true;
  }

  return false;
}

/**
 * Removes whitespace from the beginning and end of the string
 */
String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
}

/**
 * Does simple python-style string substitution.
 * "foo%s hot%s".subs("bar", "dog") becomes "foobar hotdot".
 * For more fully-featured templating, see template.js.
 */
String.prototype.subs = function() {
  var ret = this;

  // this appears to be slow, but testing shows it compares more or less equiv.
  // to the regex.exec method.
  for (var i = 0; i < arguments.length; i++) {
    ret = ret.replace(/\%s/, String(arguments[i]));
  }

  return ret;
}

/**
 * Returns the last element on an array without removing it.
 */
Array.prototype.peek = function() {
  return this[this.length - 1];
}

// TODO(anyone): add splice the first time someone needs it and then implement
// push, pop, shift, unshift in terms of it where possible.

// TODO(anyone): add the other neat-o functional methods like map(), etc.

/**
 * Partially applies this function to a particular "this object" and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of |this| "pre-specified".
 *
 * Remaining arguments specified at call-time are appended to the pre-
 * specified ones.
 *
 * Also see: partial().
 *
 * Note that bind and partial are optimized such that repeated calls to it do 
 * not create more than one function object, so there is no additional cost for
 * something like:
 *
 * var g = bind(f, obj);
 * var h = partial(g, 1, 2, 3);
 * var k = partial(h, a, b, c);
 *
 * Usage:
 * var barMethBound = bind(myFunction, myObj, "arg1", "arg2");
 * barMethBound("arg3", "arg4");
 *
 * @param thisObj {object} Specifies the object which |this| should point to
 * when the function is run. If the value is null or undefined, it will default
 * to the global object.
 *
 * @returns {function} A partially-applied form of the function bind() was
 * invoked as a method of.
 */
function bind(fn, self, opt_args) {
  var boundargs = (typeof fn.boundArgs_ != "undefined") ? fn.boundArgs_ : [];
  boundargs = boundargs.concat(Array.prototype.slice.call(arguments, 2));

  if (typeof fn.boundSelf_ != "undefined") {
    self = fn.boundSelf_;
  }

  if (typeof fn.boundFn_ != "undefined") {
    fn = fn.boundFn_;
  }

  var newfn = function() {
    // Combine the static args and the new args into one big array
    var args = boundargs.concat(Array.prototype.slice.call(arguments));
    return fn.apply(self, args);
  }

  newfn.boundArgs_ = boundargs;
  newfn.boundSelf_ = self;
  newfn.boundFn_ = fn;

  return newfn;
}

/**
 * An alias to the bind() global function.
 *
 * Usage:
 * var g = f.bind(obj, arg1, arg2);
 * g(arg3, arg4);
 */
Function.prototype.bind = function(self, opt_args) {
  return bind.apply(
    null, [this, self].concat(Array.prototype.slice.call(arguments, 1)));
}

/**
 * Like bind(), except that a "this object" is not required. Useful when the
 * target function is already bound.
 * 
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 */
function partial(fn, opt_args) {
  return bind.apply(
    null, [fn, null].concat(Array.prototype.slice.call(arguments, 1)));
}

/**
 * An alias to the partial() global function.
 *
 * Usage:
 * var g = f.partial(arg1, arg2);
 * g(arg3, arg4);
 */
Function.prototype.partial = function(opt_args) {
  return bind.apply(
    null, [this, null].concat(Array.prototype.slice.call(arguments)));
}

/**
 * Convenience. Binds all the methods of obj to itself. Calling this in the
 * constructor before referencing any methods makes things a little more like
 * Java or Python where methods are intrinsically bound to their instance.
 */
function bindMethods(obj) {
  for (var p in obj) {
    if (isFunction(obj[p])) {
      obj[p] = obj[p].bind(obj);
    }
  }
}

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   ParentClass.call(this, a, b);
 * }
 *
 * ChildClass.inherits(ParentClass);
 *
 * var child = new ChildClass("a", "b", "see");
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 */
Function.prototype.inherits = function(parentCtor) {
  var tempCtor = function(){};
  tempCtor.prototype = parentCtor.prototype;
  this.superClass_ = parentCtor.prototype;
  this.prototype = new tempCtor();
}
//@line 48 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/toolkit/components/url-classifier/src/nsUrlClassifierLib.js"

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


// Class for manipulating preferences. Aside from wrapping the pref
// service, useful functionality includes:
//
// - abstracting prefobserving so that you can observe preferences
//   without implementing nsIObserver 
// 
// - getters that return a default value when the pref doesn't exist 
//   (instead of throwing)
// 
// - get-and-set getters
//
// Example:
// 
// var p = new PROT_Preferences();
// alert(p.getPref("some-true-pref"));     // shows true
// alert(p.getPref("no-such-pref", true)); // shows true   
// alert(p.getPref("no-such-pref", null)); // shows null
//
// function observe(prefThatChanged) {
//   alert("Pref changed: " + prefThatChanged);
// };
//
// p.addObserver("somepref", observe);
// p.setPref("somepref", true);            // alerts
// p.removeObserver("somepref", observe);
//
// TODO: should probably have the prefobserver pass in the new and old
//       values

// TODO(tc): Maybe remove this class and just call natively since we're no
//           longer an extension.

/**
 * A class that wraps the preferences service.
 *
 * @param opt_startPoint        A starting point on the prefs tree to resolve 
 *                              names passed to setPref and getPref.
 *
 * @param opt_useDefaultPranch  Set to true to work against the default 
 *                              preferences tree instead of the profile one.
 *
 * @constructor
 */
function G_Preferences(opt_startPoint, opt_getDefaultBranch) {
  this.debugZone = "prefs";
  this.observers_ = {};
  this.getDefaultBranch_ = !!opt_getDefaultBranch;

  this.startPoint_ = opt_startPoint || null;
}

G_Preferences.setterMap_ = { "string": "setCharPref",
                             "boolean": "setBoolPref",
                             "number": "setIntPref" };

G_Preferences.getterMap_ = {};
G_Preferences.getterMap_[Ci.nsIPrefBranch.PREF_STRING] = "getCharPref";
G_Preferences.getterMap_[Ci.nsIPrefBranch.PREF_BOOL] = "getBoolPref";
G_Preferences.getterMap_[Ci.nsIPrefBranch.PREF_INT] = "getIntPref";

G_Preferences.prototype.__defineGetter__('prefs_', function() {
  var prefs;
  var prefSvc = Cc["@mozilla.org/preferences-service;1"]
                  .getService(Ci.nsIPrefService);

  if (this.getDefaultBranch_) {
    prefs = prefSvc.getDefaultBranch(this.startPoint_);
  } else {
    prefs = prefSvc.getBranch(this.startPoint_);
  }

  // QI to prefs in case we want to add observers
  prefs.QueryInterface(Ci.nsIPrefBranchInternal);
  return prefs;
});

/**
 * Stores a key/value in a user preference. Valid types for val are string,
 * boolean, and number. Complex values are not yet supported (but feel free to
 * add them!).
 */
G_Preferences.prototype.setPref = function(key, val) {
  var datatype = typeof(val);

  if (datatype == "number" && (val % 1 != 0)) {
    throw new Error("Cannot store non-integer numbers in preferences.");
  }

  var meth = G_Preferences.setterMap_[datatype];

  if (!meth) {
    throw new Error("Pref datatype {" + datatype + "} not supported.");
  }

  return this.prefs_[meth](key, val);
}

/**
 * Retrieves a user preference. Valid types for the value are the same as for
 * setPref. If the preference is not found, opt_default will be returned 
 * instead.
 */
G_Preferences.prototype.getPref = function(key, opt_default) {
  var type = this.prefs_.getPrefType(key);

  // zero means that the specified pref didn't exist
  if (type == Ci.nsIPrefBranch.PREF_INVALID) {
    return opt_default;
  }

  var meth = G_Preferences.getterMap_[type];

  if (!meth) {
    throw new Error("Pref datatype {" + type + "} not supported.");
  }

  // If a pref has been cleared, it will have a valid type but won't
  // be gettable, so this will throw.
  try {
    return this.prefs_[meth](key);
  } catch(e) {
    return opt_default;
  }
}

/**
 * Set a boolean preference
 *
 * @param which Name of preference to set
 * @param value Boolean indicating value to set
 *
 * @deprecated  Just use setPref.
 */
G_Preferences.prototype.setBoolPref = function(which, value) {
  return this.setPref(which, value);
}

/**
 * Get a boolean preference. WILL THROW IF PREFERENCE DOES NOT EXIST.
 * If you don't want this behavior, use getBoolPrefOrDefault.
 *
 * @param which Name of preference to get.
 *
 * @deprecated  Just use getPref.
 */
G_Preferences.prototype.getBoolPref = function(which) {
  return this.prefs_.getBoolPref(which);
}

/**
 * Get a boolean preference or return some default value if it doesn't
 * exist. Note that the default doesn't have to be bool -- it could be
 * anything (e.g., you could pass in null and check if the return
 * value is === null to determine if the pref doesn't exist).
 *
 * @param which Name of preference to get.
 * @param def Value to return if the preference doesn't exist
 * @returns Boolean value of the pref if it exists, else def
 *
 * @deprecated  Just use getPref.
 */
G_Preferences.prototype.getBoolPrefOrDefault = function(which, def) {
  return this.getPref(which, def);
}

/**
 * Get a boolean preference if it exists. If it doesn't, set its value
 * to a default and return the default. Note that the default will be
 * coherced to a bool if it is set, but not in the return value.
 *
 * @param which Name of preference to get.
 * @param def Value to set and return if the preference doesn't exist
 * @returns Boolean value of the pref if it exists, else def
 *
 * @deprecated  Just use getPref.
 */
G_Preferences.prototype.getBoolPrefOrDefaultAndSet = function(which, def) {
  try {
    return this.prefs_.getBoolPref(which);
  } catch(e) {
    this.prefs_.setBoolPref(which, !!def);  // The !! forces boolean conversion
    return def;
  }
}

/**
 * Delete a preference. 
 *
 * @param which Name of preference to obliterate
 */
G_Preferences.prototype.clearPref = function(which) {
  try {
    // This throws if the pref doesn't exist, which is fine because a 
    // non-existent pref is cleared
    this.prefs_.clearUserPref(which);
  } catch(e) {}
}

/**
 * Add an observer for a given pref.
 *
 * @param which String containing the pref to listen to
 * @param callback Function to be called when the pref changes. This
 *                 function will receive a single argument, a string 
 *                 holding the preference name that changed
 */
G_Preferences.prototype.addObserver = function(which, callback) {
  var observer = new G_PreferenceObserver(callback);
  // Need to store the observer we create so we can eventually unregister it
  if (!this.observers_[which])
    this.observers_[which] = new G_ObjectSafeMap();
  this.observers_[which].insert(callback, observer);
  this.prefs_.addObserver(which, observer, false /* strong reference */);
}

/**
 * Remove an observer for a given pref.
 *
 * @param which String containing the pref to stop listening to
 * @param callback Function to remove as an observer
 */
G_Preferences.prototype.removeObserver = function(which, callback) {
  var observer = this.observers_[which].find(callback);
  G_Assert(this, !!observer, "Tried to unregister a nonexistant observer"); 
  this.prefs_.removeObserver(which, observer);
  this.observers_[which].erase(callback);
}


/**
 * Helper class that knows how to observe preference changes and
 * invoke a callback when they do
 *
 * @constructor
 * @param callback Function to call when the preference changes
 */
function G_PreferenceObserver(callback) {
  this.debugZone = "prefobserver";
  this.callback_ = callback;
}

/**
 * Invoked by the pref system when a preference changes. Passes the
 * message along to the callback.
 *
 * @param subject The nsIPrefBranch that changed
 * @param topic String "nsPref:changed" (aka 
 *              NS_PREFBRANCH_PREFCHANGE_OBSERVER_ID -- but where does it
 *              live???)
 * @param data Name of the pref that changed
 */
G_PreferenceObserver.prototype.observe = function(subject, topic, data) {
  G_Debug(this, "Observed pref change: " + data);
  this.callback_(data);
}

/**
 * XPCOM cruft
 *
 * @param iid Interface id of the interface the caller wants
 */
G_PreferenceObserver.prototype.QueryInterface = function(iid) {
  var Ci = Ci;
  if (iid.equals(Ci.nsISupports) || 
      iid.equals(Ci.nsIObserves) ||
      iid.equals(Ci.nsISupportsWeakReference))
    return this;
  throw Components.results.NS_ERROR_NO_INTERFACE;
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
 *   Aaron Boodman <aa@google.com> (original author)
 *   Raphael Moll <raphael@google.com>
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


// Utilities for working with nsIFile and related interfaces.

/**
 * Stub for an nsIFile wrapper which doesn't exist yet. Perhaps in the future
 * we could add functionality to nsILocalFile which would be useful to us here,
 * but for now, no need for such. This could be done by setting 
 * __proto__ to an instance of nsIFile, for example. Neat.
 */
var G_File = {};

/**
 * Returns an nsIFile pointing to the user's home directory, or optionally, a
 * file inside that dir.
 */
G_File.getHomeFile = function(opt_file) {
  return this.getSpecialFile("Home", opt_file);
}

/**
 * Returns an nsIFile pointing to the current profile folder, or optionally, a
 * file inside that dir.
 */
G_File.getProfileFile = function(opt_file) {
  return this.getSpecialFile("ProfD", opt_file);
}

/**
 * returns an nsIFile pointing to the temporary dir, or optionally, a file 
 * inside that dir.
 */
G_File.getTempFile = function(opt_file) {
  return this.getSpecialFile("TmpD", opt_file);
}

/**
 * Returns an nsIFile pointing to one of the special named directories defined 
 * by Firefox, such as the user's home directory, the profile directory, etc. 
 * 
 * As a convenience, callers may specify the opt_file argument to get that file
 * within the special directory instead.
 *
 * http://lxr.mozilla.org/seamonkey/source/xpcom/io/nsDirectoryServiceDefs.h
 * http://kb.mozillazine.org/File_IO#Getting_special_files
 */
G_File.getSpecialFile = function(loc, opt_file) {
  var file = Cc["@mozilla.org/file/directory_service;1"]
             .getService(Ci.nsIProperties)
             .get(loc, Ci.nsILocalFile);

  if (opt_file) {
    file.append(opt_file);
  }

  return file;
}

/**
 * Creates and returns a pointer to a unique file in the temporary directory
 * with an optional base name.
 */
G_File.createUniqueTempFile = function(opt_baseName) {
  var baseName = (opt_baseName || (new Date().getTime())) + ".tmp";

  var file = this.getSpecialFile("TmpD", baseName);
  file.createUnique(file.NORMAL_FILE_TYPE, 0644);

  return file;
}

/**
 * Creates and returns a pointer to a unique temporary directory, with
 * an optional base name.
 */
G_File.createUniqueTempDir = function(opt_baseName) {
  var baseName = (opt_baseName || (new Date().getTime())) + ".tmp";

  var dir = this.getSpecialFile("TmpD", baseName);
  dir.createUnique(dir.DIRECTORY_TYPE, 0744);

  return dir;
}

/**
 * Static method to retrieve an nsIFile from a file:// URI.
 */
G_File.fromFileURI = function(uri) {
  // Ensure they use file:// url's: discourages platform-specific paths
  if (uri.indexOf("file://") != 0)
    throw new Error("File path must be a file:// URL");

  var fileHandler = Cc["@mozilla.org/network/protocol;1?name=file"]
                    .getService(Ci.nsIFileProtocolHandler);
  return fileHandler.getFileFromURLSpec(uri);
}

// IO Constants

G_File.PR_RDONLY = 0x01;      // read-only
G_File.PR_WRONLY = 0x02;      // write only
G_File.PR_RDWR = 0x04;        // reading and writing
G_File.PR_CREATE_FILE = 0x08; // create if it doesn't exist
G_File.PR_APPEND = 0x10;      // file pntr reset to end prior to writes
G_File.PR_TRUNCATE = 0x20;    // file exists its length is set to zero
G_File.PR_SYNC = 0x40;        // writes wait for data to be physically written
G_File.PR_EXCL = 0x80;        // file does not exist ? created : no action

// The character(s) to use for line-endings, which are platform-specific.
// This doesn't work for mac os9, but I don't know of a good way to detect
// OS9-ness from JS.
G_File.__defineGetter__("LINE_END_CHAR", function() {
  var end_char = Cc["@mozilla.org/xre/app-info;1"]
                 .getService(Ci.nsIXULRuntime)
                 .OS == "WINNT" ? "\r\n" : "\n";

  // Cache result
  G_File.__defineGetter__("LINE_END_CHAR", function() { return end_char; });
  return end_char;
});

/**
 * A class which can read a file incrementally or all at once. Parameter can be
 * either an nsIFile instance or a string file:// URI.
 * Note that this class is not compatible with non-ascii data.
 */
function G_FileReader(file) {
  this.file_ = isString(file) ? G_File.fromFileURI(file) : file;
}

/**
 * Utility method to read the entire contents of a file. Parameter can be either
 * an nsIFile instance or a string file:// URI.
 */
G_FileReader.readAll = function(file) { 
  var reader = new G_FileReader(file);

  try {
    return reader.read();
  } finally {
    reader.close();
  }
}

/**
 * Read up to opt_maxBytes from the stream. If opt_maxBytes is not specified, 
 * the entire file is read.
 */
G_FileReader.prototype.read = function(opt_maxBytes) {
  if (!this.stream_) {
    var fs = Cc["@mozilla.org/network/file-input-stream;1"]
               .createInstance(Ci.nsIFileInputStream);
    fs.init(this.file_, G_File.PR_RDONLY, 0444, 0);

    this.stream_ = Cc["@mozilla.org/scriptableinputstream;1"]
                     .createInstance(Ci.nsIScriptableInputStream);
    this.stream_.init(fs);
  }
  
  if (typeof opt_maxBytes == "undefined") {
    opt_maxBytes = this.stream_.available();
  }

  return this.stream_.read(opt_maxBytes);
}

/**
 * Close the stream. This step is required when reading is done.
 */
G_FileReader.prototype.close = function(opt_maxBytes) {
  if (this.stream_) {
    this.stream_.close();
    this.stream_ = null;
  }
}


// TODO(anyone): Implement G_LineReader. The interface should be something like:
// for (var line = null; line = reader.readLine();) {
//   // do something with line
// }


/**
 * Writes a file incrementally or all at once.
 * Note that this class is not compatible with non-ascii data.
 */
function G_FileWriter(file, opt_append) {
  this.file_ = typeof file == "string" ? G_File.fromFileURI(file) : file;
  this.append_ = !!opt_append;
}

/**
 * Helper to write to a file in one step.
 */
G_FileWriter.writeAll = function(file, data, opt_append) { 
  var writer = new G_FileWriter(file, opt_append);

  try {
    return writer.write(data);
  } finally {
    writer.close();
    return 0;
  }
}

/**
 * Write bytes out to the file. Returns the number of bytes written.
 */
G_FileWriter.prototype.write = function(data) {
  if (!this.stream_) {
    this.stream_ = Cc["@mozilla.org/network/file-output-stream;1"]
                     .createInstance(Ci.nsIFileOutputStream);

    var flags = G_File.PR_WRONLY | 
                G_File.PR_CREATE_FILE | 
                (this.append_ ? G_File.PR_APPEND : G_File.PR_TRUNCATE);


    this.stream_.init(this.file_, 
                      flags, 
                      -1 /* default perms */, 
                      0 /* no special behavior */);
  }

  return this.stream_.write(data, data.length);
}

/**
 * Writes bytes out to file followed by the approriate line-ending character for
 * the current platform.
 */
G_FileWriter.prototype.writeLine = function(data) {
  this.write(data + G_File.LINE_END_CHAR);
}


/**
 * Closes the file. This must becalled when writing is done.
 */
G_FileWriter.prototype.close = function() {
  if (this.stream_) {
    this.stream_.close();
    this.stream_ = null;
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
 *   Annie Sullivan <sullivan@google.com>
 *   Aaron Boodman <aa@google.com>
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

// Generic logging/debugging functionality that:
//
// (*) when disabled compiles to no-ops at worst (for calls to the service) 
//     and to nothing at best (calls to G_Debug() and similar are compiled
//     away when you use a jscompiler that strips dead code)
//
// (*) has dynamically configurable/creatable debugging "zones" enabling 
//     selective logging
// 
// (*) hides its plumbing so that all calls in different zones are uniform,
//     so you can drop files using this library into other apps that use it
//     without any configuration 
//
// (*) can be controlled programmatically or via preferences.  The
//     preferences that control the service and its zones are under
//     the preference branch "safebrowsing-debug-service."
//
// (*) outputs function call traces when the "loggifier" zone is enabled
// 
// (*) can write output to logfiles so that you can get a call trace
//     from someone who is having a problem
//
// Example:
//
// var G_GDEBUG = true                           // Enable this module
// var G_debugService = new G_DebugService();    // in global context
//
// // You can use it with arbitrary primitive first arguement
// G_Debug("myzone", "Yo yo yo");   // outputs: [myzone] Yo yo yo\n
//
// // But it's nice to use it with an object; it will probe for the zone name
// function Obj() {
//   this.debugZone = "someobj";
// }
// Obj.prototype.foo = function() {
//   G_Debug(this, "foo called");
// }
// (new Obj).foo();                        // outputs: [someobj] foo called\n
//
// G_debugService.loggifier.loggify(Obj.prototype);  // enable call tracing
//
// // En/disable specific zones programmatically (you can also use preferences)
// G_debugService.enableZone("somezone");
// G_debugService.disableZone("someotherzone");
// G_debugService.enableAllZones();
//
// // We also have asserts and errors:
// G_Error(this, "Some error occurred");                    // will throw
// G_Assert(this, (x > 3), "x not greater than three!");    // will throw
//
// See classes below for more methods. 
//
// TODO add abililty to alert() instead of dump()? Should be easy.
// TODO add code to set prefs when not found to the default value of a tristate
// TODO add error level support
// TODO add ability to turn off console output
//
// -------> TO START DEBUGGING: set G_GDEBUG to true

// These are the functions code will typically call. Everything is
// wrapped in if's so we can compile it away when G_GDEBUG is false.


if (typeof G_GDEBUG == "undefined") {
  throw new Error("G_GDEBUG constant must be set before loading debug.js");
}


/**
 * Write out a debugging message.
 *
 * @param who The thingy to convert into a zone name corresponding to the 
 *            zone to which this message belongs
 * @param msg Message to output
 */
function G_Debug(who, msg) {
  if (G_GDEBUG) {
    G_GetDebugZone(who).debug(msg);
  }
}

/**
 * Debugs loudly
 */
function G_DebugL(who, msg) {
  if (G_GDEBUG) {
    var zone = G_GetDebugZone(who);

    if (zone.zoneIsEnabled()) {
      G_debugService.dump(
        G_File.LINE_END_CHAR +
        "************************************************************" +
        G_File.LINE_END_CHAR);

      G_Debug(who, msg);

      G_debugService.dump(
        "************************************************************" +
        G_File.LINE_END_CHAR +
        G_File.LINE_END_CHAR);
    }
  }
}

/**
 * Write out a call tracing message
 *
 * @param who The thingy to convert into a zone name corresponding to the 
 *            zone to which this message belongs
 * @param msg Message to output
 */
function G_TraceCall(who, msg) {
  if (G_GDEBUG) {
    if (G_debugService.callTracingEnabled()) {
      G_debugService.dump(msg + G_File.LINE_END_CHAR);
    }
  }
}

/**
 * Write out an error (and throw)
 *
 * @param who The thingy to convert into a zone name corresponding to the 
 *            zone to which this message belongs
 * @param msg Message to output
 */
function G_Error(who, msg) {
  if (G_GDEBUG) {
    G_GetDebugZone(who).error(msg);
  }
}

/**
 * Assert something as true and signal an error if it's not
 *
 * @param who The thingy to convert into a zone name corresponding to the 
 *            zone to which this message belongs
 * @param condition Boolean condition to test
 * @param msg Message to output
 */
function G_Assert(who, condition, msg) {
  if (G_GDEBUG) {
    G_GetDebugZone(who).assert(condition, msg);
  }
}

/**
 * Assert two things are equal (as in ==).
 */
function G_AssertEqual(who, expected, actual, msg) {
  if (G_GDEBUG) {
    G_GetDebugZone(who).assert(
        expected == actual,
        msg + " Expected: {%s}, got: {%s}".subs(expected, actual));
  }
}

/**
 * Helper function that takes input and returns the DebugZone
 * corresponding to it.
 *
 * @param who Arbitrary input that will be converted into a zone name. Most
 *            likely an object that has .debugZone property, or a string.
 * @returns The DebugZone object corresponding to the input
 */
function G_GetDebugZone(who) {
  if (G_GDEBUG) {
    var zone = "?";

    if (who && who.debugZone) {
      zone = who.debugZone;
    } else if (isString(who)) {
      zone = who;
    }

    return G_debugService.getZone(zone);
  }
}

// Classes that implement the functionality.

/**
 * A debug "zone" is a string derived from arbitrary types (but
 * typically derived from another string or an object). All debugging
 * messages using a particular zone can be enabled or disabled
 * independent of other zones. This enables you to turn on/off logging
 * of particular objects or modules. This object implements a single
 * zone and the methods required to use it.
 *
 * @constructor
 * @param service Reference to the DebugService object we use for 
 *                registration
 * @param prefix String indicating the unique prefix we should use
 *               when creating preferences to control this zone
 * @param zone String indicating the name of the zone
 */
function G_DebugZone(service, prefix, zone) {
  if (G_GDEBUG) {
    this.debugService_ = service;
    this.prefix_ = prefix;
    this.zone_ = zone;
    this.zoneEnabledPrefName_ = prefix + ".zone." + this.zone_;
    this.settings_ = new G_DebugSettings();
  }
}
  
/**
 * @returns Boolean indicating if this zone is enabled
 */
G_DebugZone.prototype.zoneIsEnabled = function() {
  if (G_GDEBUG) {
    var explicit = this.settings_.getSetting(this.zoneEnabledPrefName_, null);

    if (explicit !== null) {
      return explicit;
    } else {
      return this.debugService_.allZonesEnabled();
    }
  }
}

/**
 * Enable this logging zone
 */
G_DebugZone.prototype.enableZone = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.zoneEnabledPrefName_, true);
  }
}

/**
 * Disable this logging zone
 */
G_DebugZone.prototype.disableZone = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.zoneEnabledPrefName_, false);
  }
}

/**
 * Write a debugging message to this zone
 *
 * @param msg String of message to write
 */
G_DebugZone.prototype.debug = function(msg) {
  if (G_GDEBUG) {
    if (this.zoneIsEnabled()) {
      this.debugService_.dump("[%s] %s%s".subs(this.zone_,
                                               msg,
                                               G_File.LINE_END_CHAR));
    }
  }
}

/**
 * Write an error to this zone and throw
 *
 * @param msg String of error to write
 */
G_DebugZone.prototype.error = function(msg) {
  if (G_GDEBUG) {
    this.debugService_.dump("[%s] %s%s".subs(this.zone_,
                                             msg,
                                             G_File.LINE_END_CHAR));
    throw new Error(msg);
    debugger;
  }
}

/**
 * Assert something as true and error if it is not
 *
 * @param condition Boolean condition to test
 * @param msg String of message to write if is false
 */
G_DebugZone.prototype.assert = function(condition, msg) {
  if (G_GDEBUG) {
    if (condition !== true) {
      G_Error(this.zone_, "ASSERT FAILED: " + msg);
    }
  }
}


/**
 * The debug service handles auto-registration of zones, namespacing
 * the zones preferences, and various global settings such as whether
 * all zones are enabled.
 *
 * @constructor
 * @param opt_prefix Optional string indicating the unique prefix we should 
 *                   use when creating preferences
 */
function G_DebugService(opt_prefix) {
  if (G_GDEBUG) {
    this.prefix_ = opt_prefix ? opt_prefix : "safebrowsing-debug-service";
    this.consoleEnabledPrefName_ = this.prefix_ + ".alsologtoconsole";
    this.allZonesEnabledPrefName_ = this.prefix_ + ".enableallzones";
    this.callTracingEnabledPrefName_ = this.prefix_ + ".trace-function-calls";
    this.logFileEnabledPrefName_ = this.prefix_ + ".logfileenabled";
    this.logFileErrorLevelPrefName_ = this.prefix_ + ".logfile-errorlevel";
    this.zones_ = {};

    this.loggifier = new G_Loggifier();
    this.settings_ = new G_DebugSettings();

    // We observe the console service so that we can echo errors that get 
    // reported there to the file log.
    Cc["@mozilla.org/consoleservice;1"]
      .getService(Ci.nsIConsoleService)
      .registerListener(this);
  }
}

// Error levels for reporting console messages to the log.
G_DebugService.ERROR_LEVEL_INFO = "INFO";
G_DebugService.ERROR_LEVEL_WARNING = "WARNING";
G_DebugService.ERROR_LEVEL_EXCEPTION = "EXCEPTION";


/**
 * @returns Boolean indicating if we should send messages to the jsconsole
 */
G_DebugService.prototype.alsoDumpToConsole = function() {
  if (G_GDEBUG) {
    return this.settings_.getSetting(this.consoleEnabledPrefName_, false);
  }
}

/**
 * @returns whether to log output to a file as well as the console.
 */
G_DebugService.prototype.logFileIsEnabled = function() {
  if (G_GDEBUG) {
    return this.settings_.getSetting(this.logFileEnabledPrefName_, false);
  }
}

/**
 * Turns on file logging. dump() output will also go to the file specified by
 * setLogFile()
 */
G_DebugService.prototype.enableLogFile = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.logFileEnabledPrefName_, true);
  }
}

/**
 * Turns off file logging
 */
G_DebugService.prototype.disableLogFile = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.logFileEnabledPrefName_, false);
  }
}

/**
 * @returns an nsIFile instance pointing to the current log file location
 */
G_DebugService.prototype.getLogFile = function() {
  if (G_GDEBUG) {
    return this.logFile_;
  }
}

/**
 * Sets a new log file location
 */
G_DebugService.prototype.setLogFile = function(file) {
  if (G_GDEBUG) {
    this.logFile_ = file;
  }
}

/**
 * Enables sending messages to the jsconsole
 */
G_DebugService.prototype.enableDumpToConsole = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.consoleEnabledPrefName_, true);
  }
}

/**
 * Disables sending messages to the jsconsole
 */
G_DebugService.prototype.disableDumpToConsole = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.consoleEnabledPrefName_, false);
  }
}

/**
 * @param zone Name of the zone to get
 * @returns The DebugZone object corresopnding to input. If not such
 *          zone exists, a new one is created and returned
 */
G_DebugService.prototype.getZone = function(zone) {
  if (G_GDEBUG) {
    if (!this.zones_[zone]) 
      this.zones_[zone] = new G_DebugZone(this, this.prefix_, zone);
    
    return this.zones_[zone];
  }
}

/**
 * @param zone Zone to enable debugging for
 */
G_DebugService.prototype.enableZone = function(zone) {
  if (G_GDEBUG) {
    var toEnable = this.getZone(zone);
    toEnable.enableZone();
  }
}

/**
 * @param zone Zone to disable debugging for
 */
G_DebugService.prototype.disableZone = function(zone) {
  if (G_GDEBUG) {
    var toDisable = this.getZone(zone);
    toDisable.disableZone();
  }
}

/**
 * @returns Boolean indicating whether debugging is enabled for all zones
 */
G_DebugService.prototype.allZonesEnabled = function() {
  if (G_GDEBUG) {
    return this.settings_.getSetting(this.allZonesEnabledPrefName_, false);
  }
}

/**
 * Enables all debugging zones
 */
G_DebugService.prototype.enableAllZones = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.allZonesEnabledPrefName_, true);
  }
}

/**
 * Disables all debugging zones
 */
G_DebugService.prototype.disableAllZones = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.allZonesEnabledPrefName_, false);
  }
}

/**
 * @returns Boolean indicating whether call tracing is enabled
 */
G_DebugService.prototype.callTracingEnabled = function() {
  if (G_GDEBUG) {
    return this.settings_.getSetting(this.callTracingEnabledPrefName_, false);
  }
}

/**
 * Enables call tracing
 */
G_DebugService.prototype.enableCallTracing = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.callTracingEnabledPrefName_, true);
  }
}

/**
 * Disables call tracing
 */
G_DebugService.prototype.disableCallTracing = function() {
  if (G_GDEBUG) {
    this.settings_.setDefault(this.callTracingEnabledPrefName_, false);
  }
}

/**
 * Gets the minimum error that will be reported to the log.
 */
G_DebugService.prototype.getLogFileErrorLevel = function() {
  if (G_GDEBUG) {
    var level = this.settings_.getSetting(this.logFileErrorLevelPrefName_, 
                                          G_DebugService.ERROR_LEVEL_EXCEPTION);

    return level.toUpperCase();
  }
}

/**
 * Sets the minimum error level that will be reported to the log.
 */
G_DebugService.prototype.setLogFileErrorLevel = function(level) {
  if (G_GDEBUG) {
    // normalize case just to make it slightly easier to not screw up.
    level = level.toUpperCase();

    if (level != G_DebugService.ERROR_LEVEL_INFO &&
        level != G_DebugService.ERROR_LEVEL_WARNING &&
        level != G_DebugService.ERROR_LEVEL_EXCEPTION) {
      throw new Error("Invalid error level specified: {" + level + "}");
    }

    this.settings_.setDefault(this.logFileErrorLevelPrefName_, level);
  }
}

/**
 * Internal dump() method
 *
 * @param msg String of message to dump
 */
G_DebugService.prototype.dump = function(msg) {
  if (G_GDEBUG) {
    dump(msg);
    
    if (this.alsoDumpToConsole()) {
      try {
        var console = Components.classes['@mozilla.org/consoleservice;1']
                      .getService(Components.interfaces.nsIConsoleService);
        console.logStringMessage(msg);
      } catch(e) {
        dump("G_DebugZone ERROR: COULD NOT DUMP TO CONSOLE" +
             G_File.LINE_END_CHAR);
      }
    }

    this.maybeDumpToFile(msg);
  }
}

/**
 * Writes the specified message to the log file, if file logging is enabled.
 */
G_DebugService.prototype.maybeDumpToFile = function(msg) {
  if (this.logFileIsEnabled() && this.logFile_) {
    if (!this.logWriter_) {
      this.logWriter_ = new G_FileWriter(this.logFile_, true);
    }

    this.logWriter_.write(msg);
  }
}

/**
 * Implements nsIConsoleListener.observe(). Gets called when an error message
 * gets reported to the console and sends it to the log file as well.
 */
G_DebugService.prototype.observe = function(consoleMessage) {
  if (G_GDEBUG) {
    var errorLevel = this.getLogFileErrorLevel();

    // consoleMessage can be either nsIScriptError or nsIConsoleMessage. The
    // latter does not have things like line number, etc. So we special case 
    // it first. 
    if (!(consoleMessage instanceof Ci.nsIScriptError)) {
      // Only report these messages if the error level is INFO.
      if (errorLevel == G_DebugService.ERROR_LEVEL_INFO) {
        this.maybeDumpToFile(G_DebugService.ERROR_LEVEL_INFO + ": " + 
                             consoleMessage.message + G_File.LINE_END_CHAR);
      }

      return;
    }

    // We make a local copy of these fields because writing to it doesn't seem
    // to work.
    var flags = consoleMessage.flags;
    var sourceName = consoleMessage.sourceName;
    var lineNumber = consoleMessage.lineNumber;

    // Sometimes, a scripterror instance won't have any flags set. We 
    // default to exception.
    if (!flags) {
      flags = Ci.nsIScriptError.exceptionFlag;
    }

    // Default the filename and line number if they aren't set.
    if (!sourceName) {
      sourceName = "<unknown>";
    }

    if (!lineNumber) {
      lineNumber = "<unknown>";
    }

    // Report the error in the log file.
    if (flags & Ci.nsIScriptError.warningFlag) {
      // Only report warnings if the error level is warning or better. 
      if (errorLevel == G_DebugService.ERROR_LEVEL_WARNING ||
          errorLevel == G_DebugService.ERROR_LEVEL_INFO) {
        this.reportScriptError_(consoleMessage.message,
                                sourceName,
                                lineNumber,
                                G_DebugService.ERROR_LEVEL_WARNING);
      }
    } else if (flags & Ci.nsIScriptError.exceptionFlag) {
      // Always report exceptions.
      this.reportScriptError_(consoleMessage.message,
                              sourceName,
                              lineNumber,
                              G_DebugService.ERROR_LEVEL_EXCEPTION);
    }
  }
}

/**
 * Private helper to report an nsIScriptError instance to the log/console.
 */
G_DebugService.prototype.reportScriptError_ = function(message, sourceName, 
                                                       lineNumber, label) {
  var message = ["",
                 "------------------------------------------------------------",
                 label + ": " + message,
                 "location: " + sourceName + ", " + "line: " + lineNumber,
                 "------------------------------------------------------------",
                 "",
                 ""].join(G_File.LINE_END_CHAR);

  dump(message);
  this.maybeDumpToFile(message);
}



/**
 * A class that instruments methods so they output a call trace,
 * including the values of their actual parameters and return value.
 * This code is mostly stolen from Aaron Boodman's original
 * implementation in clobber utils.
 *
 * Note that this class uses the "loggifier" debug zone, so you'll see 
 * a complete call trace when that zone is enabled.
 *
 * @constructor
 */
function G_Loggifier() {
  if (G_GDEBUG) {
    // Careful not to loggify ourselves!
    this.mark_(this);  
  }
}

/**
 * Marks an object as having been loggified. Loggification is not 
 * idempotent :)
 *
 * @param obj Object to be marked
 */
G_Loggifier.prototype.mark_ = function(obj) {
  if (G_GDEBUG) {
    obj.__loggified_ = true;
  }
}

/**
 * @param obj Object to be examined
 * @returns Boolean indicating if the object has been loggified
 */
G_Loggifier.prototype.isLoggified = function(obj) {
  if (G_GDEBUG) {
    return !!obj.__loggified_;
  }
}

/**
 * Attempt to extract the class name from the constructor definition.
 * Assumes the object was created using new.
 *
 * @param constructor String containing the definition of a constructor,
 *                    for example what you'd get by examining obj.constructor
 * @returns Name of the constructor/object if it could be found, else "???"
 */
G_Loggifier.prototype.getFunctionName_ = function(constructor) {
  if (G_GDEBUG) {
    return constructor.name || "???";
  }
}

/**
 * Wraps all the methods in an object so that call traces are
 * automatically outputted.
 *
 * @param obj Object to loggify. SHOULD BE THE PROTOTYPE OF A USER-DEFINED
 *            object. You can get into trouble if you attempt to 
 *            loggify something that isn't, for example the Window.
 *
 * Any additional parameters are considered method names which should not be
 * loggified.
 *
 * Usage:
 * G_debugService.loggifier.loggify(MyClass.prototype,
 *                                  "firstMethodNotToLog",
 *                                  "secondMethodNotToLog",
 *                                  ... etc ...);
 */
G_Loggifier.prototype.loggify = function(obj) {
  if (G_GDEBUG) {
    if (!G_debugService.callTracingEnabled()) {
      return;
    }

    if (typeof window != "undefined" && obj == window || 
        this.isLoggified(obj))   // Don't go berserk!
      return;

    var zone = G_GetDebugZone(obj);
    if (!zone || !zone.zoneIsEnabled()) {
      return;
    }

    this.mark_(obj);

    // Helper function returns an instrumented version of
    // objName.meth, with "this" bound properly. (BTW, because we're
    // in a conditional here, functions will only be defined as
    // they're encountered during execution, so declare this helper
    // before using it.)

    function wrap(meth, objName, methName) {
      return function() {
        
        // First output the call along with actual parameters
        var args = new Array(arguments.length);
        var argsString = "";
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
          argsString += (i == 0 ? "" : ", ");
          
          if (isFunction(args[i])) {
            argsString += "[function]";
          } else {
            argsString += args[i];
          }
        }

        G_TraceCall(this, "> " + objName + "." + methName + "(" + 
                    argsString + ")");
        
        // Then run the function, capturing the return value and throws
        try {
          var retVal = meth.apply(this, arguments);
          var reportedRetVal = retVal;

          if (typeof reportedRetVal == "undefined")
            reportedRetVal = "void";
          else if (reportedRetVal === "")
            reportedRetVal = "\"\" (empty string)";
        } catch (e) {
          if (e && !e.__logged) {
            G_TraceCall(this, "Error: " + e.message + ". " + 
                        e.fileName + ": " + e.lineNumber);
            try {
              e.__logged = true;
            } catch (e2) {
              // Sometimes we can't add the __logged flag because it's an
              // XPC wrapper
              throw e;
            }
          }
          
          throw e;      // Re-throw!
        }

        // And spit it out already
        G_TraceCall(
          this, 
          "< " + objName + "." + methName + ": " + reportedRetVal);

        return retVal;
      };
    };

    var ignoreLookup = {};

    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        ignoreLookup[arguments[i]] = true;
      }
    }
    
    // Wrap each method of obj
    for (var p in obj) {
      // Work around bug in Firefox. In ffox typeof RegExp is "function",
      // so make sure this really is a function. Bug as of FFox 1.5b2.
      if (typeof obj[p] == "function" && obj[p].call && !ignoreLookup[p]) {
        var objName = this.getFunctionName_(obj.constructor);
        obj[p] = wrap(obj[p], objName, p);
      }
    }
  }
}


/**
 * Simple abstraction around debug settings. The thing with debug settings is
 * that we want to be able to specify a default in the application's startup,
 * but have that default be overridable by the user via their prefs.
 *
 * To generalize this, we package up a dictionary of defaults with the 
 * preferences tree. If a setting isn't in the preferences tree, then we grab it
 * from the defaults.
 */
function G_DebugSettings() {
  this.defaults_ = {};
  this.prefs_ = new G_Preferences();
}

/**
 * Returns the value of a settings, optionally defaulting to a given value if it
 * doesn't exist. If no default is specified, the default is |undefined|.
 */
G_DebugSettings.prototype.getSetting = function(name, opt_default) {
  var override = this.prefs_.getPref(name, null);

  if (override !== null) {
    return override;
  } else if (typeof this.defaults_[name] != "undefined") {
    return this.defaults_[name];
  } else {
    return opt_default;
  }
}

/**
 * Sets the default value for a setting. If the user doesn't override it with a
 * preference, this is the value which will be returned by getSetting().
 */
G_DebugSettings.prototype.setDefault = function(name, val) {
  this.defaults_[name] = val;
}

var G_debugService = new G_DebugService(); // Instantiate us!

if (G_GDEBUG) {
  G_debugService.enableAllZones();
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


// An Alarm fires a callback after a certain amount of time, or at
// regular intervals. It's a convenient replacement for
// setTimeout/Interval when you don't want to bind to a specific
// window.
//
// The ConditionalAlarm is an Alarm that cancels itself if its callback 
// returns a value that type-converts to true.
//
// Example:
//
//  function foo() { alert('hi'); };
//  new G_Alarm(foo, 10*1000);                   // Fire foo in 10 seconds
//  new G_Alarm(foo, 10*1000, true /*repeat*/);  // Fire foo every 10 seconds
//  new G_Alarm(foo, 10*1000, true, 7);          // Fire foo every 10 seconds
//                                               // seven times
//  new G_ConditionalAlarm(foo, 1000, true); // Fire every sec until foo()==true
//
//  // Fire foo every 10 seconds until foo returns true or until it fires seven
//  // times, whichever happens first.
//  new G_ConditionalAlarm(foo, 10*1000, true /*repeating*/, 7);
//
// TODO: maybe pass an isFinal flag to the callback if they opted to
// set maxTimes and this is the last iteration?


/**
 * Set an alarm to fire after a given amount of time, or at specific 
 * intervals.
 *
 * @param callback Function to call when the alarm fires
 * @param delayMS Number indicating the length of the alarm period in ms
 * @param opt_repeating Boolean indicating whether this should fire 
 *                      periodically
 * @param opt_maxTimes Number indicating a maximum number of times to 
 *                     repeat (obviously only useful when opt_repeating==true)
 */
function G_Alarm(callback, delayMS, opt_repeating, opt_maxTimes) {
  this.debugZone = "alarm";
  this.callback_ = callback;
  this.repeating_ = !!opt_repeating;
  this.timer_ = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
  var type = opt_repeating ? 
             this.timer_.TYPE_REPEATING_SLACK : 
             this.timer_.TYPE_ONE_SHOT;
  this.maxTimes_ = opt_maxTimes ? opt_maxTimes : null;
  this.nTimes_ = 0;

  this.observerServiceObserver_ = new G_ObserverServiceObserver(
                                        'xpcom-shutdown',
                                        BindToObject(this.cancel, this));

  // Ask the timer to use nsITimerCallback (.notify()) when ready
  this.timer_.initWithCallback(this, delayMS, type);
}

/**
 * Cancel this timer 
 */
G_Alarm.prototype.cancel = function() {
  if (!this.timer_) {
    return;
  }

  this.timer_.cancel();
  // Break circular reference created between this.timer_ and the G_Alarm
  // instance (this)
  this.timer_ = null;
  this.callback_ = null;

  // We don't need the shutdown observer anymore
  this.observerServiceObserver_.unregister();
}

/**
 * Invoked by the timer when it fires
 * 
 * @param timer Reference to the nsITimer which fired (not currently 
 *              passed along)
 */
G_Alarm.prototype.notify = function(timer) {
  // fire callback and save results
  var ret = this.callback_();
  
  // If they've given us a max number of times to fire, enforce it
  this.nTimes_++;
  if (this.repeating_ && 
      typeof this.maxTimes_ == "number" 
      && this.nTimes_ >= this.maxTimes_) {
    this.cancel();
  } else if (!this.repeating_) {
    // Clear out the callback closure for TYPE_ONE_SHOT timers
    this.cancel();
  }
  // We don't cancel/cleanup timers that repeat forever until either
  // xpcom-shutdown occurs or cancel() is called explicitly.

  return ret;
}

/**
 * XPCOM cruft
 */
G_Alarm.prototype.QueryInterface = function(iid) {
  if (iid.equals(Components.interfaces.nsISupports) ||
      iid.equals(Components.interfaces.nsITimerCallback))
    return this;

  throw Components.results.NS_ERROR_NO_INTERFACE;
}


/**
 * An alarm with the additional property that it cancels itself if its 
 * callback returns true.
 *
 * For parameter documentation, see G_Alarm
 */
function G_ConditionalAlarm(callback, delayMS, opt_repeating, opt_maxTimes) {
  G_Alarm.call(this, callback, delayMS, opt_repeating, opt_maxTimes);
  this.debugZone = "conditionalalarm";
}

G_ConditionalAlarm.inherits(G_Alarm);

/**
 * Invoked by the timer when it fires
 * 
 * @param timer Reference to the nsITimer which fired (not currently 
 *              passed along)
 */
G_ConditionalAlarm.prototype.notify = function(timer) {
  // Call G_Alarm::notify
  var rv = G_Alarm.prototype.notify.call(this, timer);

  if (this.repeating_ && rv) {
    G_Debug(this, "Callback of a repeating alarm returned true; cancelling.");
    this.cancel();
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


// Base64 en/decoding. Not much to say here except that we work with
// decoded values in arrays of bytes. By "byte" I mean a number in [0,
// 255].


/**
 * Base64 en/decoder. Useful in contexts that don't have atob/btoa, or
 * when you need a custom encoding function (e.g., websafe base64).
 *
 * @constructor
 */
function G_Base64() {
  this.byteToCharMap_ = {};
  this.charToByteMap_ = {};
  this.byteToCharMapWebSafe_ = {};
  this.charToByteMapWebSafe_ = {};
  this.init_();
}

/**
 * Our default alphabet. Value 64 (=) is special; it means "nothing."
 */ 
G_Base64.ENCODED_VALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                        "abcdefghijklmnopqrstuvwxyz" +
                        "0123456789+/=";

/**
 * Our websafe alphabet. Value 64 (=) is special; it means "nothing."
 */ 
G_Base64.ENCODED_VALS_WEBSAFE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                                "abcdefghijklmnopqrstuvwxyz" +
                                "0123456789-_=";

/**
 * We want quick mappings back and forth, so we precompute two maps.
 */
G_Base64.prototype.init_ = function() {
  for (var i = 0; i < G_Base64.ENCODED_VALS.length; i++) {
    this.byteToCharMap_[i] = G_Base64.ENCODED_VALS.charAt(i);
    this.charToByteMap_[this.byteToCharMap_[i]] = i;
    this.byteToCharMapWebSafe_[i] = G_Base64.ENCODED_VALS_WEBSAFE.charAt(i);
    this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
  }
}

/**
 * Base64-encode an array of bytes.
 *
 * @param input An array of bytes (numbers with value in [0, 255]) to encode
 *
 * @param opt_webSafe Boolean indicating we should use the alternative alphabet 
 *
 * @returns String containing the base64 encoding
 */
G_Base64.prototype.encodeByteArray = function(input, opt_webSafe) {

  if (!(input instanceof Array))
    throw new Error("encodeByteArray takes an array as a parameter");

  var byteToCharMap = opt_webSafe ? 
                      this.byteToCharMapWebSafe_ :
                      this.byteToCharMap_;

  var output = [];

  var i = 0;
  while (i < input.length) {

    var byte1 = input[i];
    var haveByte2 = i + 1 < input.length;
    var byte2 = haveByte2 ? input[i + 1] : 0;
    var haveByte3 = i + 2 < input.length;
    var byte3 = haveByte3 ? input[i + 2] : 0;

    var outByte1 = byte1 >> 2;
    var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
    var outByte3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
    var outByte4 = byte3 & 0x3F;

    if (!haveByte3) {
      outByte4 = 64;
      
      if (!haveByte2)
        outByte3 = 64;
    }
    
    output.push(byteToCharMap[outByte1]);
    output.push(byteToCharMap[outByte2]);
    output.push(byteToCharMap[outByte3]);
    output.push(byteToCharMap[outByte4]);

    i += 3;
  }

  return output.join("");
}

/**
 * Base64-decode a string.
 *
 * @param input String to decode
 *
 * @param opt_webSafe Boolean indicating we should use the alternative alphabet 
 * 
 * @returns Array of bytes representing the decoded value.
 */
G_Base64.prototype.decodeString = function(input, opt_webSafe) {

  if (input.length % 4)
    throw new Error("Length of b64-encoded data must be zero mod four");

  var charToByteMap = opt_webSafe ? 
                      this.charToByteMapWebSafe_ :
                      this.charToByteMap_;

  var output = [];

  var i = 0;
  while (i < input.length) {

    var byte1 = charToByteMap[input.charAt(i)];
    var byte2 = charToByteMap[input.charAt(i + 1)];
    var byte3 = charToByteMap[input.charAt(i + 2)];
    var byte4 = charToByteMap[input.charAt(i + 3)];

    if (byte1 === undefined || byte2 === undefined ||
        byte3 === undefined || byte4 === undefined)
      throw new Error("String contains characters not in our alphabet: " +
                      input);

    var outByte1 = (byte1 << 2) | (byte2 >> 4);
    output.push(outByte1);
    
    if (byte3 != 64) {
      var outByte2 = ((byte2 << 4) & 0xF0) | (byte3 >> 2);
      output.push(outByte2);
      
      if (byte4 != 64) {
        var outByte3 = ((byte3 << 6) & 0xC0) | byte4;
        output.push(outByte3);
      }
    }

    i += 4;
  }

  return output;
}

/**
 * Helper function that turns a string into an array of numbers. 
 *
 * @param str String to arrify
 *
 * @returns Array holding numbers corresponding to the UCS character codes
 *          of each character in str
 */
G_Base64.prototype.arrayifyString = function(str) {
  var output = [];
  for (var i = 0; i < str.length; i++)
    output.push(str.charCodeAt(i));
  return output;
}

/**
 * Helper function that turns an array of numbers into the string
 * given by the concatenation of the characters to which the numbesr
 * correspond (got that?).
 *
 * @param array Array of numbers representing characters
 *
 * @returns Stringification of the array
 */ 
G_Base64.prototype.stringifyArray = function(array) {
  var output = [];
  for (var i = 0; i < array.length; i++)
    output[i] = String.fromCharCode(array[i]);
  return output.join("");
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


// A very thin wrapper around nsICryptoHash. It's not strictly
// necessary, but makes the code a bit cleaner and gives us the
// opportunity to verify that our implementations give the results that
// we expect, for example if we have to interoperate with a server.
//
// The digest* methods reset the state of the hasher, so it's
// necessary to call init() explicitly after them.
//
// Works only in Firefox 1.5+.
//
// IMPORTANT NOTE: Due to https://bugzilla.mozilla.org/show_bug.cgi?id=321024
// you cannot use the cryptohasher before app-startup. The symptom of doing
// so is a segfault in NSS.

/**
 * Instantiate a new hasher. You must explicitly call init() before use!
 */
function G_CryptoHasher() {
  this.debugZone = "cryptohasher";
  this.decoder_ = new G_Base64();
  this.hasher_ = null;
}

G_CryptoHasher.algorithms = {
  MD2: Ci.nsICryptoHash.MD2,
  MD5: Ci.nsICryptoHash.MD5,
  SHA1: Ci.nsICryptoHash.SHA1,
  SHA256: Ci.nsICryptoHash.SHA256,
  SHA384: Ci.nsICryptoHash.SHA384,
  SHA512: Ci.nsICryptoHash.SHA512,
};

/**
 * Initialize the hasher. This function must be called after every call
 * to one of the digest* methods.
 *
 * @param algorithm Constant from G_CryptoHasher.algorithms specifying the
 *                  algorithm this hasher will use
 */ 
G_CryptoHasher.prototype.init = function(algorithm) {
  var validAlgorithm = false;
  for (var alg in G_CryptoHasher.algorithms)
    if (algorithm == G_CryptoHasher.algorithms[alg])
      validAlgorithm = true;

  if (!validAlgorithm)
    throw new Error("Invalid algorithm: " + algorithm);

  this.hasher_ = Cc["@mozilla.org/security/hash;1"]
                 .createInstance(Ci.nsICryptoHash);
  this.hasher_.init(algorithm);
}

/**
 * Update the hash's internal state with input given in a string. Can be
 * called multiple times for incrementeal hash updates. Note that this function
 * is slllloooowww since it uses the a javascript implementation to convert the
 * string to an array. If you need something faster, use updateFromStream() with
 * an XPCOM stream.
 *
 * @param input String containing data to hash.
 */ 
G_CryptoHasher.prototype.updateFromString = function(input) {
  if (!this.hasher_)
    throw new Error("You must initialize the hasher first!");

  this.hasher_.update(this.decoder_.arrayifyString(input), input.length);
}

/**
 * Update the hash's internal state with input given in an array. Can be
 * called multiple times for incremental hash updates.
 *
 * @param input Array containing data to hash.
 */ 
G_CryptoHasher.prototype.updateFromArray = function(input) {
  if (!this.hasher_)
    throw new Error("You must initialize the hasher first!");

  this.hasher_.update(input, input.length);
}

/**
 * Update the hash's internal state with input given in a stream. Can be
 * called multiple times from incremental hash updates.
 */
G_CryptoHasher.prototype.updateFromStream = function(stream) {
  if (!this.hasher_)
    throw new Error("You must initialize the hasher first!");

  this.hasher_.updateFromStream(stream, stream.available());
}

/**
 * @returns The hash value as a string (sequence of 8-bit values)
 */ 
G_CryptoHasher.prototype.digestRaw = function() {
  var digest = this.hasher_.finish(false /* not b64 encoded */);
  this.hasher_ = null;
  return digest;
}

/**
 * @returns The hash value as a base64-encoded string
 */ 
G_CryptoHasher.prototype.digestBase64 = function() {
  var digest = this.hasher_.finish(true /* b64 encoded */);
  this.hasher_ = null;
  return digest;
}

/**
 * @returns The hash value as a hex-encoded string
 */ 
G_CryptoHasher.prototype.digestHex = function() {
  var raw = this.digestRaw();
  return this.toHex_(raw);
}

/**
 * Converts a sequence of values to a hex-encoded string. The input is a
 * a string, so you can stick 16-bit values in each character.
 *
 * @param str String to conver to hex. (Often this is just a sequence of
 *            16-bit values)
 *
 * @returns String containing the hex representation of the input
 */ 
G_CryptoHasher.prototype.toHex_ = function(str) {
  var hexchars = '0123456789ABCDEF';
  var hexrep = new Array(str.length * 2);

  for (var i = 0; i < str.length; ++i) {
    hexrep[i * 2] = hexchars.charAt((str.charCodeAt(i) >> 4) & 15);
    hexrep[i * 2 + 1] = hexchars.charAt(str.charCodeAt(i) & 15);
  }
  return hexrep.join('');
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
 *   Aaron Boodman <aa@google.com> (original author)
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


// Firefox-specific additions to lib/js/lang.js.


/**
 * The always-useful alert. 
 */
function alert(msg, opt_title) {
  opt_title |= "message";

  Cc["@mozilla.org/embedcomp/prompt-service;1"]
    .getService(Ci.nsIPromptService)
    .alert(null, opt_title, msg.toString());
}


/**
 * The instanceof operator cannot be used on a pure js object to determine if 
 * it implements a certain xpcom interface. The QueryInterface method can, but
 * it throws an error which makes things more complex.
 */
function jsInstanceOf(obj, iid) {
  try {
    obj.QueryInterface(iid);
    return true;
  } catch (e) {
    if (e == Components.results.NS_ERROR_NO_INTERFACE) {
      return false;
    } else {
      throw e;
    }
  }
}


/**
 * Unbelievably, Function inheritence is broken in chrome in Firefox
 * (still as of FFox 1.5b1). Hence if you're working in an extension
 * and not using the subscriptloader, you can't use the method
 * above. Instead, use this global function that does roughly the same
 * thing.
 *
 ***************************************************************************
 *   NOTE THE REVERSED ORDER OF FUNCTION AND OBJECT REFERENCES AS bind()   *
 ***************************************************************************
 * 
 * // Example to bind foo.bar():
 * var bound = BindToObject(bar, foo, "arg1", "arg2");
 * bound("arg3", "arg4");
 * 
 * @param func {string} Reference to the function to be bound
 *
 * @param obj {object} Specifies the object which |this| should point to
 * when the function is run. If the value is null or undefined, it will default
 * to the global object.
 *
 * @param opt_{...} Dummy optional arguments to make a jscompiler happy
 *
 * @returns {function} A partially-applied form of the speficied function.
 */
function BindToObject(func, obj, opt_A, opt_B, opt_C, opt_D, opt_E, opt_F) {
  // This is the sick product of Aaron's mind. Not for the feint of heart.
  var args = Array.prototype.splice.call(arguments, 1, arguments.length);
  return Function.prototype.bind.apply(func, args);
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


// ObjectSafeMap is, shockingly, a Map with which it is safe to use
// objects as keys. It currently uses parallel arrays for storage,
// rendering it inefficient (linear) for large maps. We can always
// swap out the implementation if this becomes a problem. Note that
// this class uses strict equality to determine equivalent keys.
// 
// Interface:
//
//   insert(key, value)
//   erase(key)          // Returns true if key erased, false if not found
//   find(key)           // Returns undefined if key not found
//   replace(otherMap)   // Clones otherMap, replacing the current map
//   forEach(func)
//   size()              // Returns number of items in the map
//
// TODO: should probably make it iterable by implementing getList();


/**
 * Create a new ObjectSafeMap.
 *
 * @param opt_name A string used to name the map
 *
 * @constructor
 */
function G_ObjectSafeMap(opt_name) {
  this.debugZone = "objectsafemap";
  this.name_ = opt_name ? opt_name : "noname";
  this.keys_ = [];
  this.values_ = [];
}

/**
 * Helper function to return the index of a key. 
 *
 * @param key An key to find
 *
 * @returns Index in the keys array where the key is found, -1 if not
 */
G_ObjectSafeMap.prototype.indexOfKey_ = function(key) {
  for (var i = 0; i < this.keys_.length; i++)
    if (this.keys_[i] === key)
      return i;
  return -1;
}

/**
 * Add an item
 *
 * @param key An key to add (overwrites previous key)
 *
 * @param value The value to store at that key
 */
G_ObjectSafeMap.prototype.insert = function(key, value) {
  if (key === null)
    throw new Error("Can't use null as a key");
  if (value === undefined)
    throw new Error("Can't store undefined values in this map");

  var i = this.indexOfKey_(key);
  if (i == -1) {
    this.keys_.push(key);
    this.values_.push(value);
  } else {
    this.keys_[i] = key;
    this.values_[i] = value;
  }

  G_Assert(this, this.keys_.length == this.values_.length, 
           "Different number of keys than values!");
}

/**
 * Remove a key from the map
 *
 * @param key The key to remove
 *
 * @returns Boolean indicating if the key was removed
 */
G_ObjectSafeMap.prototype.erase = function(key) {
  var keyLocation = this.indexOfKey_(key);
  var keyFound = keyLocation != -1;
  if (keyFound) {
    this.keys_.splice(keyLocation, 1);
    this.values_.splice(keyLocation, 1);
  }
  G_Assert(this, this.keys_.length == this.values_.length, 
           "Different number of keys than values!");

  return keyFound;
}

/**
 * Look up a key in the map
 *
 * @param key The key to look up
 * 
 * @returns The value at that key or undefined if it doesn't exist
 */
G_ObjectSafeMap.prototype.find = function(key) {
  var keyLocation = this.indexOfKey_(key);
  return keyLocation == -1 ? undefined : this.values_[keyLocation];
}

/**
 * Replace one map with the content of another
 *
 * @param map input map that needs to be merged into our map
 */
G_ObjectSafeMap.prototype.replace = function(other) {
  this.keys_ = [];
  this.values_ = [];
  for (var i = 0; i < other.keys_.length; i++) {
    this.keys_.push(other.keys_[i]);
    this.values_.push(other.values_[i]);
  }

  G_Assert(this, this.keys_.length == this.values_.length, 
           "Different number of keys than values!");
}

/**
 * Apply a function to each of the key value pairs.
 *
 * @param func Function to apply to the map's key value pairs
 */
G_ObjectSafeMap.prototype.forEach = function(func) {
  if (typeof func != "function")
    throw new Error("argument to forEach is not a function, it's a(n) " + 
                    typeof func);

  for (var i = 0; i < this.keys_.length; i++)
    func(this.keys_[i], this.values_[i]);
}

/**
 * @returns The number of keys in the map
 */
G_ObjectSafeMap.prototype.size = function() {
  return this.keys_.length;
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


// A couple of classes to simplify creating observers. 
//
// // Example1:
//
// function doSomething() { ... }
// var observer = new G_ObserverWrapper(topic, doSomething);
// someObj.addObserver(topic, observer);
//
// // Example2: 
//
// function doSomething() { ... }
// new G_ObserverServiceObserver("profile-after-change", 
//                               doSomething,
//                               true /* run only once */);


/**
 * This class abstracts the admittedly simple boilerplate required of
 * an nsIObserver. It saves you the trouble of implementing the
 * indirection of your own observe() function.
 *
 * @param topic String containing the topic the observer will filter for
 *
 * @param observeFunction Reference to the function to call when the 
 *                        observer fires
 *
 * @constructor
 */
function G_ObserverWrapper(topic, observeFunction) {
  this.debugZone = "observer";
  this.topic_ = topic;
  this.observeFunction_ = observeFunction;
}

/**
 * XPCOM
 */
G_ObserverWrapper.prototype.QueryInterface = function(iid) {
  if (iid.equals(Ci.nsISupports) || iid.equals(Ci.nsIObserver))
    return this;
  throw Components.results.NS_ERROR_NO_INTERFACE;
}

/**
 * Invoked by the thingy being observed
 */
G_ObserverWrapper.prototype.observe = function(subject, topic, data) {
  if (topic == this.topic_)
    this.observeFunction_(subject, topic, data);
}


/**
 * This class abstracts the admittedly simple boilerplate required of
 * observing an observerservice topic. It implements the indirection
 * required, and automatically registers to hear the topic.
 *
 * @param topic String containing the topic the observer will filter for
 *
 * @param observeFunction Reference to the function to call when the 
 *                        observer fires
 *
 * @param opt_onlyOnce Boolean indicating if the observer should unregister
 *                     after it has fired
 *
 * @constructor
 */
function G_ObserverServiceObserver(topic, observeFunction, opt_onlyOnce) {
  this.debugZone = "observerserviceobserver";
  this.topic_ = topic;
  this.observeFunction_ = observeFunction;
  this.onlyOnce_ = !!opt_onlyOnce;
  
  this.observer_ = new G_ObserverWrapper(this.topic_, 
                                         BindToObject(this.observe_, this));
  this.observerService_ = Cc["@mozilla.org/observer-service;1"]
                          .getService(Ci.nsIObserverService);
  this.observerService_.addObserver(this.observer_, this.topic_, false);
}

/**
 * Unregister the observer from the observerservice
 */
G_ObserverServiceObserver.prototype.unregister = function() {
  this.observerService_.removeObserver(this.observer_, this.topic_);
  this.observerService_ = null;
}

/**
 * Invoked by the observerservice
 */
G_ObserverServiceObserver.prototype.observe_ = function(subject, topic, data) {
  this.observeFunction_(subject, topic, data);
  if (this.onlyOnce_)
    this.unregister();
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


// A helper class that knows how to parse from and serialize to
// protocol4. This is a simple, historical format used by some Google
// interfaces, for example the Toolbar (i.e., ancient services).
//
// Protocol4 consists of a newline-separated sequence of name/value
// pairs (strings). Each line consists of the name, the value length,
// and the value itself, all separated by colons. Example:
//
// foo:6:barbaz\n
// fritz:33:issickofdynamicallytypedlanguages\n


/**
 * This class knows how to serialize/deserialize maps to/from their
 * protocol4 representation.
 *
 * @constructor
 */
function G_Protocol4Parser() {
  this.debugZone = "protocol4";

  this.protocol4RegExp_ = new RegExp("([^:]+):\\d+:(.*)$");
  this.newlineRegExp_ = new RegExp("(\\r)?\\n");
}

/**
 * Create a map from a protocol4 string. Silently skips invalid lines.
 *
 * @param text String holding the protocol4 representation
 * 
 * @returns Object as an associative array with keys and values 
 *          given in text. The empty object is returned if none
 *          are parsed.
 */
G_Protocol4Parser.prototype.parse = function(text) {

  var response = {};
  if (!text)
    return response;

  // Responses are protocol4: (repeated) name:numcontentbytes:content\n
  var lines = text.split(this.newlineRegExp_);
  for (var i = 0; i < lines.length; i++)
    if (this.protocol4RegExp_.exec(lines[i]))
      response[RegExp.$1] = RegExp.$2;

  return response;
}

/**
 * Create a protocol4 string from a map (object). Throws an error on 
 * an invalid input.
 *
 * @param map Object as an associative array with keys and values 
 *            given as strings.
 *
 * @returns text String holding the protocol4 representation
 */
G_Protocol4Parser.prototype.serialize = function(map) {
  if (typeof map != "object")
    throw new Error("map must be an object");

  var text = "";
  for (var key in map) {
    if (typeof map[key] != "string")
      throw new Error("Keys and values must be strings");
    
    text += key + ":" + map[key].length + ":" + map[key] + "\n";
  }
  
  return text;
}

//@line 59 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/toolkit/components/url-classifier/src/nsUrlClassifierLib.js"

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

// TODO: We don't use this class very much.  Try to use native nsIFile instead
//       and remove this file.

/**
 * A simple helper class that enables us to get or create the
 * directory in which our app will store stuff.
 */
function PROT_ApplicationDirectory() {
  this.debugZone = "appdir";
  this.appDir_ = G_File.getProfileFile();
  G_Debug(this, "Application directory is " + this.appDir_.path);
}

/**
 * @returns Boolean indicating if the directory exists
 */
PROT_ApplicationDirectory.prototype.exists = function() {
  return this.appDir_.exists() && this.appDir_.isDirectory();
}

/**
 * Creates the directory
 */
PROT_ApplicationDirectory.prototype.create = function() {
  G_Debug(this, "Creating app directory: " + this.appDir_.path);
  try {
    this.appDir_.create(Ci.nsIFile.DIRECTORY_TYPE, 0700);
  } catch(e) {
    G_Error(this, this.appDir_.path + " couldn't be created.");
  }
}

/**
 * @returns The nsIFile interface of the directory
 */
PROT_ApplicationDirectory.prototype.getAppDirFileInterface = function() {
  return this.appDir_;
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
 *   Tony Chang <tc@google.com> (original author)
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

// This implements logic for stopping requests if the server starts to return
// too many errors.  If we get MAX_ERRORS errors in ERROR_PERIOD minutes, we
// back off for TIMEOUT_INCREMENT minutes.  If we get another error
// immediately after we restart, we double the timeout and add
// TIMEOUT_INCREMENT minutes, etc.
// 
// This is similar to the logic used by the search suggestion service.

// HTTP responses that count as an error.  We also include any 5xx response
// as an error.
const HTTP_FOUND                 = 302;
const HTTP_SEE_OTHER             = 303;
const HTTP_TEMPORARY_REDIRECT    = 307;

/**
 * @param maxErrors Number the number of errors needed to trigger backoff
 * @param errorPeriod Number time (ms) in which maxErros have to occur to
 *     trigger the backoff behavior
 * @param timeoutIncrement Number time (ms) the starting timeout period
 *     we double this time for consecutive errors
 * @param maxTimeout Number time (ms) maximum timeout period
 */
function RequestBackoff(maxErrors, errorPeriod, timeoutIncrement, maxTimeout) {
  this.MAX_ERRORS_ = maxErrors;
  this.ERROR_PERIOD_ = errorPeriod;
  this.TIMEOUT_INCREMENT_ = timeoutIncrement;
  this.MAX_TIMEOUT_ = maxTimeout;

  // Queue of ints keeping the time of errors.
  this.errorTimes_ = [];
  this.errorTimeout_ = 0;
  this.nextRequestTime_ = 0;
  this.backoffTriggered_ = false;
}

/**
 * Reset the object for reuse.
 */
RequestBackoff.prototype.reset = function() {
  this.errorTimes_ = [];
  this.errorTimeout_ = 0;
  this.nextRequestTime_ = 0;
  this.backoffTriggered_ = false;
}

/**
 * Check to see if we can make a request.
 */
RequestBackoff.prototype.canMakeRequest = function() {
  return Date.now() > this.nextRequestTime_;
}

/**
 * Notify this object of the last server response.  If it's an error,
 */
RequestBackoff.prototype.noteServerResponse = function(status) {
  if (this.isErrorStatus_(status)) {
    var now = Date.now();
    this.errorTimes_.push(now);

    // We only care about keeping track of MAX_ERRORS
    if (this.errorTimes_.length > this.MAX_ERRORS_)
      this.errorTimes_.shift();

    // See if we hit the backoff case
    // This either means we hit MAX_ERRORS in ERROR_PERIOD
    // *or* we were already in a backoff state, in which case we
    // increase our timeout.
    if ((this.errorTimes_.length == this.MAX_ERRORS_ &&
         now - this.errorTimes_[0] < this.ERROR_PERIOD_)
        || this.backoffTriggered_) {
      this.errorTimeout_ = (this.errorTimeout_ * 2)  + this.TIMEOUT_INCREMENT_;
      this.errorTimeout_ = Math.min(this.errorTimeout_, this.MAX_TIMEOUT_);
      this.nextRequestTime_ = now + this.errorTimeout_;
      this.backoffTriggered_ = true;
    }
  } else {
    // Reset error timeout, allow requests to go through, and switch out
    // of backoff state.
    this.errorTimeout_ = 0;
    this.nextRequestTime_ = 0;
    this.backoffTriggered_ = false;
  }
}

/**
 * We consider 302, 303, 307, and 5xx http responses to be errors.
 * @param status Number http status
 * @return Boolean true if we consider this http status an error
 */
RequestBackoff.prototype.isErrorStatus_ = function(status) {
  return ((500 <= status && status <= 599) ||
          HTTP_FOUND == status ||
          HTTP_SEE_OTHER == status ||
          HTTP_TEMPORARY_REDIRECT == status);
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
 *   Monica Chew <mmc@google.com>
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


// This file implements our query param encryption. You hand it a set
// of query params, and it will hand you a set of (maybe) encrypted
// query params back. It takes the query params you give it, 
// encodes and encrypts them into a encrypted query param, and adds
// the extra query params the server will need to decrypt them
// (e.g., the version of encryption and the decryption key).
// 
// The key manager provides the keys we need; this class just focuses
// on encrypting query params. See the url crypto key manager for
// details of our protocol, but essentially encryption is
// RC4_key(input) with key == MD5(K_C || nonce) where nonce is a
// 32-bit integer appended big-endian and K_C is the client's key.
//
// If for some reason we don't have an encryption key, encrypting is the 
// identity function.

/**
 * This class knows how to encrypt query parameters that will be
 * understood by the lookupserver.
 * 
 * @constructor
 */
function PROT_UrlCrypto() {
  this.debugZone = "urlcrypto";
  this.hasher_ = new G_CryptoHasher();
  this.base64_ = new G_Base64();
  this.streamCipher_ = Cc["@mozilla.org/security/streamcipher;1"]
                       .createInstance(Ci.nsIStreamCipher);

  if (!this.manager_) {
    // Create a UrlCryptoKeyManager to reads keys from profile directory if
    // one doesn't already exist.  UrlCryptoKeyManager puts a reference to
    // itself on PROT_UrlCrypto.prototype (this also prevents garbage
    // collection).
    new PROT_UrlCryptoKeyManager();
  }

  // Convenience properties
  this.VERSION = PROT_UrlCrypto.VERSION;
  this.RC4_DISCARD_BYTES = PROT_UrlCrypto.RC4_DISCARD_BYTES;
  this.VERSION_QUERY_PARAM_NAME = PROT_UrlCrypto.QPS.VERSION_QUERY_PARAM_NAME;
  this.ENCRYPTED_PARAMS_PARAM_NAME = 
    PROT_UrlCrypto.QPS.ENCRYPTED_PARAMS_PARAM_NAME;
  this.COUNT_QUERY_PARAM_NAME = PROT_UrlCrypto.QPS.COUNT_QUERY_PARAM_NAME;
  this.WRAPPEDKEY_QUERY_PARAM_NAME = 
    PROT_UrlCrypto.QPS.WRAPPEDKEY_QUERY_PARAM_NAME;

  // Properties for computing macs
  this.macer_ = new G_CryptoHasher(); // don't use hasher_
  this.macInitialized_ = false;
  // Separator to prevent leakage between key and data when computing mac
  this.separator_ = ":coolgoog:";
  this.separatorArray_ = this.base64_.arrayifyString(this.separator_);
}

// The version of encryption we implement
PROT_UrlCrypto.VERSION = "1";

PROT_UrlCrypto.RC4_DISCARD_BYTES = 1600;

// The query params are we going to send to let the server know what is
// encrypted, and how
PROT_UrlCrypto.QPS = {};
PROT_UrlCrypto.QPS.VERSION_QUERY_PARAM_NAME = "encver";
PROT_UrlCrypto.QPS.ENCRYPTED_PARAMS_PARAM_NAME = "encparams";
PROT_UrlCrypto.QPS.COUNT_QUERY_PARAM_NAME = "nonce";
PROT_UrlCrypto.QPS.WRAPPEDKEY_QUERY_PARAM_NAME = "wrkey";

/**
 * @returns Reference to the keymanager (if one exists), else undefined
 */
PROT_UrlCrypto.prototype.getManager = function() {
  return this.manager_;
}

/**
 * Helper method that takes a map of query params (param name ->
 * value) and turns them into a query string. Note that it encodes
 * the values as it writes the string.
 *
 * @param params Object (map) of query names to values. Values should
 *               not be uriencoded.
 *
 * @returns String of query params from the map. Values will be uri
 *          encoded
 */
PROT_UrlCrypto.prototype.appendParams_ = function(params) {
  var queryString = "";
  for (var param in params)
    queryString += "&" + param + "=" + encodeURIComponent(params[param]);
                   
  return queryString;
}

/**
 * Encrypt a set of query params if we can. If we can, we return a new
 * set of query params that should be added to a query string. The set
 * of query params WILL BE different than the input query params if we
 * can encrypt (e.g., there will be extra query params with meta-
 * information such as the version of encryption we're using). If we
 * can't encrypt, we just return the query params we're passed.
 *
 * @param params Object (map) of query param names to values. Values should
 *               not be uriencoded.
 *
 * @returns Object (map) of query param names to values. Values are NOT
 *          uriencoded; the caller should encode them as it writes them
 *          to a proper query string.
 */
PROT_UrlCrypto.prototype.maybeCryptParams = function(params) {
  if (!this.manager_)
    throw new Error("Need a key manager for UrlCrypto");
  if (typeof params != "object")
    throw new Error("params is an associative array of name/value params");

  var clientKeyArray = this.manager_.getClientKeyArray();
  var wrappedKey = this.manager_.getWrappedKey();

  // No keys? Can't encrypt. Damn.
  if (!clientKeyArray || !wrappedKey) {
    G_Debug(this, "No key; can't encrypt query params");
    return params;
  }

  // Serialize query params to a query string that we will then
  // encrypt and place in a special query param the front-end knows is
  // encrypted.
  var queryString = this.appendParams_(params);
  
  // Nonce, really. We want 32 bits; make it so.
  var counter = this.getCount_();
  counter = counter & 0xFFFFFFFF;
  
  var encrypted = this.encryptV1(clientKeyArray, 
                                 this.VERSION,
                                 counter,
                                 queryString);

  params = {};
  params[this.VERSION_QUERY_PARAM_NAME] = this.VERSION;
  params[this.COUNT_QUERY_PARAM_NAME] = counter;
  params[this.WRAPPEDKEY_QUERY_PARAM_NAME] = wrappedKey;
  params[this.ENCRYPTED_PARAMS_PARAM_NAME] = encrypted;

  return params;
}

/**
 * Encrypts text and returns a base64 string of the results.
 *
 * This method runs in about ~2ms on a 2Ghz P4. (Turn debugging off if
 * you see it much slower).
 *
 * @param clientKeyArray Array of bytes (numbers in [0,255]) composing K_C
 *
 * @param version String indicating the version of encryption we should use.
 *
 * @param counter Number that acts as a nonce for this encryption
 *
 * @param text String to be encrypted
 *
 * @returns String containing the websafe base64-encoded ciphertext
 */
PROT_UrlCrypto.prototype.encryptV1 = function(clientKeyArray,
                                              version, 
                                              counter,
                                              text) {

  // We're a version1 encrypter, after all
  if (version != "1") 
    throw new Error("Unknown encryption version");

  var key = this.deriveEncryptionKey(clientKeyArray, counter);

  this.streamCipher_.init(key);

  if (this.RC4_DISCARD_BYTES > 0)
    this.streamCipher_.discard(this.RC4_DISCARD_BYTES);
  
  this.streamCipher_.updateFromString(text);

  var encrypted = this.streamCipher_.finish(true /* base64 encoded */);
  // The base64 version we get has new lines, we want to remove those.
  
  return encrypted.replace(/\r\n/g, "");
}
  
/**
 * Create an encryption key from K_C and a nonce
 *
 * @param clientKeyArray Array of bytes comprising K_C
 *
 * @param count Number that acts as a nonce for this key
 *
 * @return nsIKeyObject
 */
PROT_UrlCrypto.prototype.deriveEncryptionKey = function(clientKeyArray, 
                                                        count) {
  G_Assert(this, clientKeyArray instanceof Array,
           "Client key should be an array of bytes");
  G_Assert(this, typeof count == "number", "Count should be a number");
  
  // Don't clobber the client key by appending the nonce; use another array
  var paddingArray = [];
  paddingArray.push(count >> 24);
  paddingArray.push((count >> 16) & 0xFF);
  paddingArray.push((count >> 8) & 0xFF);
  paddingArray.push(count & 0xFF);

  this.hasher_.init(G_CryptoHasher.algorithms.MD5);
  this.hasher_.updateFromArray(clientKeyArray);
  this.hasher_.updateFromArray(paddingArray);

  // Create the nsIKeyObject
  var keyFactory = Cc["@mozilla.org/security/keyobjectfactory;1"]
                   .getService(Ci.nsIKeyObjectFactory);
  var key = keyFactory.keyFromString(Ci.nsIKeyObject.RC4,
                                     this.hasher_.digestRaw());
  return key;
}

/**
 * Return a new nonce for us to use. Rather than keeping a counter and
 * the headaches that entails, just use the low ms since the epoch.
 *
 * @returns 32-bit number that is the nonce to use for this encryption
 */
PROT_UrlCrypto.prototype.getCount_ = function() {
  return ((new Date).getTime() & 0xFFFFFFFF);
}

/**
 * Init the mac.  This function is called by WireFormatReader if the update
 * server has sent along a mac param.  The caller must not call initMac again
 * before calling finishMac; instead, the caller should just use another
 * UrlCrypto object.
 *
 * @param opt_clientKeyArray Optional clientKeyArray, for testing
 */
PROT_UrlCrypto.prototype.initMac = function(opt_clientKeyArray) {
  if (this.macInitialized_) {
    throw new Error("Can't interleave calls to initMac.  Please use another " +
                    "UrlCrypto object.");
  }

  this.macInitialized_ = true;

  var clientKeyArray = null;

  if (!!opt_clientKeyArray) {
    clientKeyArray = opt_clientKeyArray;
  } else {
    clientKeyArray = this.manager_.getClientKeyArray();
  }

  // Don't re-use this.hasher_, in case someone calls deriveEncryptionKey
  // between initMac and finishMac
  this.macer_.init(G_CryptoHasher.algorithms.MD5);

  this.macer_.updateFromArray(clientKeyArray);
  this.macer_.updateFromArray(this.separatorArray_);
}

/**
 * Add a line to the mac.  Called by WireFormatReader.processLine.  Not thread
 * safe.
 *
 * @param s The string to add
 */
PROT_UrlCrypto.prototype.updateMacFromString = function(s) {
  if (!this.macInitialized_) {
    throw new Error ("Initialize mac first");
  }

  var arr = this.base64_.arrayifyString(s);
  this.macer_.updateFromArray(arr);
}

/**
 * Finish up computing the mac.  Not thread safe.
 *
 * @param opt_clientKeyArray Optional clientKeyArray, for testing
 */
PROT_UrlCrypto.prototype.finishMac = function(opt_clientKeyArray) {
  var clientKeyArray = null;
  if (!!opt_clientKeyArray) {
    clientKeyArray = opt_clientKeyArray;
  } else {
    clientKeyArray = this.manager_.getClientKeyArray();
  }

  if (!this.macInitialized_) {
    throw new Error ("Initialize mac first");
  }
  this.macer_.updateFromArray(this.separatorArray_);
  this.macer_.updateFromArray(clientKeyArray);

  this.macInitialized_ = false;

  return this.macer_.digestBase64();
}

/**
 * Compute a mac over the whole data string, and return the base64-encoded
 * string
 *
 * @param data A string
 * @param opt_outputRaw True for raw output, false for base64
 * @param opt_clientKeyArray An optional key to pass in for testing
 * @param opt_separatorArray An optional separator array to pass in for testing
 * @returns MD5(key+separator+data+separator+key)
 */
PROT_UrlCrypto.prototype.computeMac = function(data, 
                                               opt_outputRaw,
                                               opt_clientKeyArray,
                                               opt_separatorArray) {
  var clientKeyArray = null;
  var separatorArray = null;

  // Get keys and such for testing
  if (!!opt_clientKeyArray) {
    clientKeyArray = opt_clientKeyArray;
  } else {
    clientKeyArray = this.manager_.getClientKeyArray();
  }

  if (!!opt_separatorArray) {
    separatorArray = opt_separatorArray;
  } else {
    separatorArray = this.separatorArray_;
  }

  this.macer_.init(G_CryptoHasher.algorithms.MD5);

  this.macer_.updateFromArray(clientKeyArray);
  this.macer_.updateFromArray(separatorArray);

  // Note to self: calling G_CryptoHasher.updateFromString ain't the same as
  // arrayifying the string and then calling updateFromArray.  Not sure if
  // that's a bug in G_CryptoHasher or not.  Niels, what do you think?
  var arr = this.base64_.arrayifyString(data);
  this.macer_.updateFromArray(arr);

  this.macer_.updateFromArray(separatorArray);
  this.macer_.updateFromArray(clientKeyArray);

  if (!!opt_outputRaw) {
    return this.macer_.digestRaw();
  }
  return this.macer_.digestBase64();
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


// This file implements the tricky business of managing the keys for our 
// URL encryption. The protocol is:
//
// - Server generates secret key K_S
// - Client starts up and requests a new key K_C from the server via HTTPS
// - Server generates K_C and WrappedKey, which is K_C encrypted with K_S
// - Server resonse with K_C and WrappedKey
// - When client wants to encrypt a URL, it encrypts it with K_C and sends
//   the encrypted URL along with WrappedKey
// - Server decrypts WrappedKey with K_S to get K_C, and the URL with K_C
//
// This is, however, trickier than it sounds for two reasons. First,
// we want to keep the number of HTTPS requests to an aboslute minimum
// (like 1 or 2 per browser session). Second, the HTTPS request at
// startup might fail, for example the user might be offline or a URL
// fetch might need to be issued before the HTTPS request has
// completed.
//
// We implement the following policy:
// 
// - Firefox will issue at most two HTTPS getkey requests per session
// - Firefox will issue one HTTPS getkey request at startup if more than 24
//   hours has passed since the last getkey request.
// - Firefox will serialize to disk any key it gets
// - Firefox will fall back on this serialized key until it has a
//   fresh key
// - The front-end can respond with a flag in a lookup request that tells
//   the client to re-key. Firefox will issue a new HTTPS getkey request
//   at this time if it has only issued one before

// We store the user key in this file.  The key can be used to verify signed
// server updates.
const kKeyFilename = "kf.txt";

/**
 * A key manager for UrlCrypto. There should be exactly one of these
 * per appplication, and all UrlCrypto's should share it. This is
 * currently implemented by having the manager attach itself to the
 * UrlCrypto's prototype at startup. We could've opted for a global
 * instead, but I like this better, even though it is spooky action
 * at a distance.
 * XXX: Should be an XPCOM service
 *
 * @param opt_keyFilename String containing the name of the 
 *                        file we should serialize keys to/from. Used
 *                        mostly for testing.
 *
 * @param opt_testing Boolean indicating whether we are testing. If we 
 *                    are, then we skip trying to read the old key from
 *                    file and automatically trying to rekey; presumably
 *                    the tester will drive these manually.
 *
 * @constructor
 */
function PROT_UrlCryptoKeyManager(opt_keyFilename, opt_testing) {
  this.debugZone = "urlcryptokeymanager";
  this.testing_ = !!opt_testing;
  this.base64_ = new G_Base64();
  this.clientKey_ = null;          // Base64-encoded, as fetched from server
  this.clientKeyArray_ = null;     // Base64-decoded into an array of numbers
  this.wrappedKey_ = null;         // Opaque websafe base64-encoded server key
  this.rekeyTries_ = 0;

  // Don't do anything until keyUrl_ is set.
  this.keyUrl_ = null;

  this.keyFilename_ = opt_keyFilename ? 
                      opt_keyFilename : kKeyFilename;

  // Convenience properties
  this.MAX_REKEY_TRIES = PROT_UrlCryptoKeyManager.MAX_REKEY_TRIES;
  this.CLIENT_KEY_NAME = PROT_UrlCryptoKeyManager.CLIENT_KEY_NAME;
  this.WRAPPED_KEY_NAME = PROT_UrlCryptoKeyManager.WRAPPED_KEY_NAME;

  if (!this.testing_) {
    G_Assert(this, !PROT_UrlCrypto.prototype.manager_,
             "Already have manager?");
    PROT_UrlCrypto.prototype.manager_ = this;

    this.maybeLoadOldKey();
  }
}

// Do ***** NOT ***** set this higher; HTTPS is expensive
PROT_UrlCryptoKeyManager.MAX_REKEY_TRIES = 2;

// Base pref for keeping track of when we updated our key.
// We store the time as seconds since the epoch.
PROT_UrlCryptoKeyManager.NEXT_REKEY_PREF = "urlclassifier.keyupdatetime.";

// Once a day (interval in seconds)
PROT_UrlCryptoKeyManager.KEY_MIN_UPDATE_TIME = 24 * 60 * 60;

// These are the names the server will respond with in protocol4 format
PROT_UrlCryptoKeyManager.CLIENT_KEY_NAME = "clientkey";
PROT_UrlCryptoKeyManager.WRAPPED_KEY_NAME = "wrappedkey";


/**
 * Called by a UrlCrypto to get the current K_C
 *
 * @returns Array of numbers making up the client key or null if we 
 *          have no key
 */
PROT_UrlCryptoKeyManager.prototype.getClientKeyArray = function() {
  return this.clientKeyArray_;
}

/**
 * Called by a UrlCrypto to get WrappedKey
 *
 * @returns Opaque base64-encoded WrappedKey or null if we haven't
 *          gotten one
 */
PROT_UrlCryptoKeyManager.prototype.getWrappedKey = function() {
  return this.wrappedKey_;
}

/**
 * Change the key url.  When we do this, we go ahead and rekey.
 * @param keyUrl String
 */
PROT_UrlCryptoKeyManager.prototype.setKeyUrl = function(keyUrl) {
  // If it's the same key url, do nothing.
  if (keyUrl == this.keyUrl_)
    return;

  this.keyUrl_ = keyUrl;
  this.rekeyTries_ = 0;

  // Check to see if we should make a new getkey request.
  var prefs = new G_Preferences(PROT_UrlCryptoKeyManager.NEXT_REKEY_PREF);
  var nextRekey = prefs.getPref(this.getPrefName_(this.keyUrl_), 0);
  if (nextRekey < parseInt(Date.now() / 1000, 10)) {
    this.reKey();
  }
}

/**
 * Given a url, return the pref value to use (pref contains last update time).
 * We basically use the url up until query parameters.  This avoids duplicate
 * pref entries as version number changes over time.
 * @param url String getkey URL
 */
PROT_UrlCryptoKeyManager.prototype.getPrefName_ = function(url) {
  var queryParam = url.indexOf("?");
  if (queryParam != -1) {
    return url.substring(0, queryParam);
  }
  return url;
}

/**
 * Tell the manager to re-key. For safety, this method still obeys the
 * max-tries limit. Clients should generally use maybeReKey() if they
 * want to try a re-keying: it's an error to call reKey() after we've
 * hit max-tries, but not an error to call maybeReKey().
 */
PROT_UrlCryptoKeyManager.prototype.reKey = function() {
  
  if (this.rekeyTries_ > this.MAX_REKEY_TRIES)
    throw new Error("Have already rekeyed " + this.rekeyTries_ + " times");

  this.rekeyTries_++;

  G_Debug(this, "Attempting to re-key");
  // If the keyUrl isn't set, we don't do anything.
  if (!this.testing_ && this.keyUrl_) {
    (new PROT_XMLFetcher()).get(this.keyUrl_,
                                BindToObject(this.onGetKeyResponse, this));

    // Calculate the next time we're allowed to re-key.
    var prefs = new G_Preferences(PROT_UrlCryptoKeyManager.NEXT_REKEY_PREF);
    var nextRekey = parseInt(Date.now() / 1000, 10)
                  + PROT_UrlCryptoKeyManager.KEY_MIN_UPDATE_TIME;
    prefs.setPref(this.getPrefName_(this.keyUrl_), nextRekey);
  }
}

/**
 * Try to re-key if we haven't already hit our limit. It's OK to call
 * this method multiple times, even if we've already tried to rekey
 * more than the max. It will simply refuse to do so.
 *
 * @returns Boolean indicating if it actually issued a rekey request (that
 *          is, if we haven' already hit the max)
 */
PROT_UrlCryptoKeyManager.prototype.maybeReKey = function() {
  if (this.rekeyTries_ > this.MAX_REKEY_TRIES) {
    G_Debug(this, "Not re-keying; already at max");
    return false;
  }

  this.reKey();
  return true;
}

/**
 * @returns Boolean indicating if we have a key we can use 
 */
PROT_UrlCryptoKeyManager.prototype.hasKey_ = function() {
  return this.clientKey_ != null && this.wrappedKey_ != null;
}

/**
 * Set a new key and serialize it to disk.
 *
 * @param clientKey String containing the base64-encoded client key 
 *                  we wish to use
 *
 * @param wrappedKey String containing the opaque base64-encoded WrappedKey
 *                   the server gave us (i.e., K_C encrypted with K_S)
 */
PROT_UrlCryptoKeyManager.prototype.replaceKey_ = function(clientKey, 
                                                          wrappedKey) {
  if (this.clientKey_)
    G_Debug(this, "Replacing " + this.clientKey_ + " with " + clientKey);

  this.clientKey_ = clientKey;
  this.clientKeyArray_ = this.base64_.decodeString(this.clientKey_);
  this.wrappedKey_ = wrappedKey;

  this.serializeKey_(this.clientKey_, this.wrappedKey_);
}

/**
 * Try to write the key to disk so we can fall back on it. Fail
 * silently if we cannot. The keys are serialized in protocol4 format.
 *
 * @returns Boolean indicating whether we succeeded in serializing
 */
PROT_UrlCryptoKeyManager.prototype.serializeKey_ = function() {

  var map = {};
  map[this.CLIENT_KEY_NAME] = this.clientKey_;
  map[this.WRAPPED_KEY_NAME] = this.wrappedKey_;
  
  try {  

    var appDir = new PROT_ApplicationDirectory();
    if (!appDir.exists())
      appDir.create();
    var keyfile = appDir.getAppDirFileInterface();
    keyfile.append(this.keyFilename_);
    G_FileWriter.writeAll(keyfile, (new G_Protocol4Parser).serialize(map));
    return true;

  } catch(e) {

    G_Error(this, "Failed to serialize new key: " + e);
    return false;

  }
}

/**
 * Invoked when we've received a protocol4 response to our getkey
 * request. Try to parse it and set this key as the new one if we can.
 *
 *  @param responseText String containing the protocol4 getkey response
 */ 
PROT_UrlCryptoKeyManager.prototype.onGetKeyResponse = function(responseText) {

  var response = (new G_Protocol4Parser).parse(responseText);
  var clientKey = response[this.CLIENT_KEY_NAME];
  var wrappedKey = response[this.WRAPPED_KEY_NAME];

  if (response && clientKey && wrappedKey) {
    G_Debug(this, "Got new key from: " + responseText);
    this.replaceKey_(clientKey, wrappedKey);
  } else {
    G_Debug(this, "Not a valid response for /getkey");
  }
}

/**
 * Attempt to read a key we've previously serialized from disk, so
 * that we can fall back on it in case we can't get one from the
 * server. If we get a key, only use it if we don't already have one
 * (i.e., if our startup HTTPS request died or hasn't yet completed).
 *
 * This method should be invoked early, like when the user's profile
 * becomes available.
 */ 
PROT_UrlCryptoKeyManager.prototype.maybeLoadOldKey = function() {
  
  var oldKey = null;
  try {  
    var appDir = new PROT_ApplicationDirectory();
    var keyfile = appDir.getAppDirFileInterface();
    keyfile.append(this.keyFilename_);
    if (keyfile.exists())
      oldKey = G_FileReader.readAll(keyfile);
  } catch(e) {
    G_Debug(this, "Caught " + e + " trying to read keyfile");
    return;
  }
   
  if (!oldKey) {
    G_Debug(this, "Couldn't find old key.");
    return;
  }

  oldKey = (new G_Protocol4Parser).parse(oldKey);
  var clientKey = oldKey[this.CLIENT_KEY_NAME];
  var wrappedKey = oldKey[this.WRAPPED_KEY_NAME];

  if (oldKey && clientKey && wrappedKey && !this.hasKey_()) {
    G_Debug(this, "Read old key from disk.");
    this.replaceKey_(clientKey, wrappedKey);
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

// A simple class that encapsulates a request. You'll notice the
// style here is different from the rest of the extension; that's
// because this was re-used from really old code we had. At some
// point it might be nice to replace this with something better
// (e.g., something that has explicit onerror handler, ability
// to set headers, and so on).
//
// The only interesting thing here is its ability to strip cookies
// from the request.

/**
 * Because we might be in a component, we can't just assume that
 * XMLHttpRequest exists. So we use this tiny factory function to wrap the
 * XPCOM version.
 *
 * @return XMLHttpRequest object
 */
function PROT_NewXMLHttpRequest() {
  var Cc = Components.classes;
  var Ci = Components.interfaces;
  var request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"]
                .createInstance(Ci.nsIXMLHttpRequest);
  // Need the following so we get onerror/load/progresschange
  request.QueryInterface(Ci.nsIJSXMLHttpRequest);
  return request;
}

/**
 * A helper class that does HTTP GETs and calls back a function with
 * the content it receives. Asynchronous, so uses a closure for the
 * callback.
 *
 * @param opt_stripCookies Boolean indicating whether we should strip
 *                         cookies from this request
 * 
 * @constructor
 */
function PROT_XMLFetcher(opt_stripCookies) {
  this.debugZone = "xmlfetcher";
  this._request = PROT_NewXMLHttpRequest();
  this._stripCookies = !!opt_stripCookies;
}

PROT_XMLFetcher.prototype = {
  /**
   * Function that will be called back upon fetch completion.
   */
  _callback: null,
  

  /**
   * Fetches some content.
   * 
   * @param page URL to fetch
   * @param callback Function to call back when complete.
   */
  get: function(page, callback) {
    this._request.abort();                // abort() is asynchronous, so
    this._request = PROT_NewXMLHttpRequest();
    this._callback = callback;
    var asynchronous = true;
    this._request.open("GET", page, asynchronous);

    if (this._stripCookies)
      new PROT_CookieStripper(this._request.channel);

    // Create a closure
    var self = this;
    this._request.onreadystatechange = function() {
      self.readyStateChange(self);
    }

    this._request.send(null);
  },

  /**
   * Called periodically by the request to indicate some state change. 4
   * means content has been received.
   */
  readyStateChange: function(fetcher) {
    if (fetcher._request.readyState != 4)
      return;

    // If the request fails, on trunk we get status set to
    // NS_ERROR_NOT_AVAILABLE.  On 1.8.1 branch we get an exception
    // forwarded from nsIHttpChannel::GetResponseStatus.  To be consistent
    // between branch and trunk, we send back NS_ERROR_NOT_AVAILABLE for
    // http failures.
    var responseText = null;
    var status = Components.results.NS_ERROR_NOT_AVAILABLE;
    try {
      G_Debug(this, "xml fetch status code: \"" + 
              fetcher._request.status + "\"");
      status = fetcher._request.status;
      responseText = fetcher._request.responseText;
    } catch(e) {
      G_Debug(this, "Caught exception trying to read xmlhttprequest " +
              "status/response.");
      G_Debug(this, e);
    }
    if (fetcher._callback)
      fetcher._callback(responseText, status);
  }
};


/**
 * This class knows how to strip cookies from an HTTP request. It
 * listens for http-on-modify-request, and modifies the request
 * accordingly. We can't do this using xmlhttprequest.setHeader() or
 * nsIChannel.setRequestHeader() before send()ing because the cookie
 * service is called after send().
 * 
 * @param channel nsIChannel in which the request is happening
 * @constructor
 */
function PROT_CookieStripper(channel) {
  this.debugZone = "cookiestripper";
  this.topic_ = "http-on-modify-request";
  this.channel_ = channel;

  var Cc = Components.classes;
  var Ci = Components.interfaces;
  this.observerService_ = Cc["@mozilla.org/observer-service;1"]
                          .getService(Ci.nsIObserverService);
  this.observerService_.addObserver(this, this.topic_, false);

  // If the request doesn't issue, don't hang around forever
  var twentySeconds = 20 * 1000;
  this.alarm_ = new G_Alarm(BindToObject(this.stopObserving, this), 
                            twentySeconds);
}

/**
 * Invoked by the observerservice. See nsIObserve.
 */
PROT_CookieStripper.prototype.observe = function(subject, topic, data) {
  if (topic != this.topic_ || subject != this.channel_)
    return;

  G_Debug(this, "Stripping cookies for channel.");

  this.channel_.QueryInterface(Components.interfaces.nsIHttpChannel);
  this.channel_.setRequestHeader("Cookie", "", false /* replace, not add */);
  this.alarm_.cancel();
  this.stopObserving();
}

/**
 * Remove us from the observerservice
 */
PROT_CookieStripper.prototype.stopObserving = function() {
  G_Debug(this, "Removing observer");
  this.observerService_.removeObserver(this, this.topic_);
  this.channel_ = this.alarm_ = this.observerService_ = null;
}

/**
 * XPCOM cruft
 */
PROT_CookieStripper.prototype.QueryInterface = function(iid) {
  var Ci = Components.interfaces;
  if (iid.equals(Ci.nsISupports) || iid.equals(Ci.nsIObserve))
    return this;
  throw Components.results.NS_ERROR_NO_INTERFACE;
}

//@line 65 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/toolkit/components/url-classifier/src/nsUrlClassifierLib.js"

// Expose this whole component.
var lib = this;

function UrlClassifierLib() {
  this.wrappedJSObject = lib;
}

// Module object
function UrlClassifierLibMod() {
  this.firstTime = true;
  this.cid = Components.ID("{26a4a019-2827-4a89-a85c-5931a678823a}");
  this.progid = "@mozilla.org/url-classifier/jslib;1";
}

UrlClassifierLibMod.prototype.registerSelf = function(compMgr, fileSpec, loc, type) {
  if (this.firstTime) {
    this.firstTime = false;
    throw Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
  }
  compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
  compMgr.registerFactoryLocation(this.cid,
                                  "UrlClassifier JS Lib",
                                  this.progid,
                                  fileSpec,
                                  loc,
                                  type);
};

UrlClassifierLibMod.prototype.getClassObject = function(compMgr, cid, iid) {  
  if (!cid.equals(this.cid))
    throw Components.results.NS_ERROR_NO_INTERFACE;
  if (!iid.equals(Ci.nsIFactory))
    throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

  return this.factory;
}

UrlClassifierLibMod.prototype.canUnload = function(compMgr) {
  return true;
}

UrlClassifierLibMod.prototype.factory = {
  createInstance: function(outer, iid) {
    if (outer != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return new UrlClassifierLib();
  }
};

var LibModInst = new UrlClassifierLibMod();

function NSGetModule(compMgr, fileSpec) {
  return LibModInst;
}
