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

const Cc = Components.classes;
const Ci = Components.interfaces;

// js/lang.js is needed for Function.prototype.inherts
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


// This is the code used to interact with data encoded in the
// goog-black-enchash format. The format is basically a map from
// hashed hostnames to encrypted sequences of regular expressions
// where the encryption key is derived from the hashed
// hostname. Encoding lists like this raises the bar slightly on
// deriving complete table data from the db. This data format is NOT
// our idea; we would've raise the bar higher :)
//
// Anyway, this code is a port of the original C++ implementation by
// Garret. To ease verification, I mirrored that code as closely as
// possible.  As a result, you'll see some C++-style variable naming
// and roundabout (C++) ways of doing things. Additionally, I've
// omitted the comments.
//
// This code should not change, except to fix bugs.
//
// TODO: verify that using encodeURI() in getCanonicalHost is OK
// TODO: accommodate other kinds of perl-but-not-javascript qualifiers


/**
 * This thing knows how to generate lookup keys and decrypt values found in
 * a table of type enchash.
 */
function PROT_EnchashDecrypter() {
  this.debugZone = "enchashdecrypter";
  this.REs_ = PROT_EnchashDecrypter.REs;
  this.hasher_ = new G_CryptoHasher();
  this.base64_ = new G_Base64();
  this.streamCipher_ = Cc["@mozilla.org/security/streamcipher;1"]
                       .createInstance(Ci.nsIStreamCipher);
}

PROT_EnchashDecrypter.DATABASE_SALT = "oU3q.72p";
PROT_EnchashDecrypter.SALT_LENGTH = PROT_EnchashDecrypter.DATABASE_SALT.length;

PROT_EnchashDecrypter.MAX_DOTS = 5;

PROT_EnchashDecrypter.REs = {};
PROT_EnchashDecrypter.REs.FIND_DODGY_CHARS = 
  new RegExp("[\x01-\x1f\x7f-\xff]+");
PROT_EnchashDecrypter.REs.FIND_DODGY_CHARS_GLOBAL = 
  new RegExp("[\x01-\x1f\x7f-\xff]+", "g");
PROT_EnchashDecrypter.REs.FIND_END_DOTS = new RegExp("^\\.+|\\.+$");
PROT_EnchashDecrypter.REs.FIND_END_DOTS_GLOBAL = 
  new RegExp("^\\.+|\\.+$", "g");
PROT_EnchashDecrypter.REs.FIND_MULTIPLE_DOTS = new RegExp("\\.{2,}");
PROT_EnchashDecrypter.REs.FIND_MULTIPLE_DOTS_GLOBAL = 
  new RegExp("\\.{2,}", "g");
PROT_EnchashDecrypter.REs.FIND_TRAILING_SPACE =
  new RegExp("^(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}) ");
PROT_EnchashDecrypter.REs.FIND_TRAILING_DOTS = new RegExp("\\.+$");
PROT_EnchashDecrypter.REs.POSSIBLE_IP = 
  new RegExp("^((?:0x[0-9a-f]+|[0-9\\.])+)$", "i");
PROT_EnchashDecrypter.REs.FIND_BAD_OCTAL = new RegExp("(^|\\.)0\\d*[89]");
PROT_EnchashDecrypter.REs.IS_OCTAL = new RegExp("^0[0-7]*$");
PROT_EnchashDecrypter.REs.IS_DECIMAL = new RegExp("^[0-9]+$");
PROT_EnchashDecrypter.REs.IS_HEX = new RegExp("^0[xX]([0-9a-fA-F]+)$");

// Regexps are given in perl regexp format. Unfortunately, JavaScript's
// library isn't completely compatible. For example, you can't specify
// case-insensitive matching by using (?i) in the expression text :(
// So we manually set this bit with the help of this regular expression.
PROT_EnchashDecrypter.REs.CASE_INSENSITIVE = /\(\?i\)/g;

/**
 * Helper function 
 *
 * @param str String to get chars from
 * 
 * @param n Number of characters to get
 *
 * @returns String made up of the last n characters of str
 */ 
PROT_EnchashDecrypter.prototype.lastNChars_ = function(str, n) {
  n = -n;
  return str.substr(n);
}

/**
 * We have to have our own hex-decoder because decodeURIComponent
 * expects UTF-8 (so it will barf on invalid UTF-8 sequences).
 *
 * @param str String to decode
 * 
 * @returns The decoded string
 */
PROT_EnchashDecrypter.prototype.hexDecode_ = function(str) {
  var output = [];

  var i = 0;
  while (i < str.length) {
    var c = str.charAt(i);
  
    if (c == "%" && i + 2 < str.length) {

      var asciiVal = Number("0x" + str.charAt(i + 1) + str.charAt(i + 2));
      
      if (!isNaN(asciiVal)) {
        i += 2;
        c = String.fromCharCode(asciiVal);
      }
    }
    
    output[output.length] = c;
    ++i;
  }
  
  return output.join("");
}

/**
 * Translate a plaintext enchash value into regular expressions
 *
 * @param data String containing a decrypted enchash db entry
 *
 * @returns An array of RegExps
 */
PROT_EnchashDecrypter.prototype.parseRegExps = function(data) {
  var res = data.split("\t");
  
  G_Debug(this, "Got " + res.length + " regular rexpressions");
  
  for (var i = 0; i < res.length; i++) {
    // Could have leading (?i); if so, set the flag and strip it
    var flags = (this.REs_.CASE_INSENSITIVE.test(res[i])) ? "i" : "";
    res[i] = res[i].replace(this.REs_.CASE_INSENSITIVE, "");
    res[i] = new RegExp(res[i], flags);
  }

  return res;
}

/**
 * Get the canonical version of the given URL for lookup in a table of 
 * type -url.
 *
 * @param url String to canonicalize
 *
 * @returns String containing the canonicalized url (maximally url-decoded
 *          with hostname normalized, then specially url-encoded)
 */
PROT_EnchashDecrypter.prototype.getCanonicalUrl = function(url) {
  var urlUtils = Cc["@mozilla.org/url-classifier/utils;1"]
                 .getService(Ci.nsIUrlClassifierUtils);
  var escapedUrl = urlUtils.canonicalizeURL(url);
  // Normalize the host
  var host = this.getCanonicalHost(escapedUrl);
  if (!host) {
    // Probably an invalid url, return what we have so far.
    return escapedUrl;
  }

  // Combine our normalized host with our escaped url.
  var ioService = Cc["@mozilla.org/network/io-service;1"]
                  .getService(Ci.nsIIOService);
  var urlObj = ioService.newURI(escapedUrl, null, null);
  urlObj.host = host;
  return urlObj.asciiSpec;
}

/**
 * @param opt_maxDots Number maximum number of dots to include.
 */
PROT_EnchashDecrypter.prototype.getCanonicalHost = function(str, opt_maxDots) {
  var ioService = Cc["@mozilla.org/network/io-service;1"]
                  .getService(Ci.nsIIOService);
  try {
    var urlObj = ioService.newURI(str, null, null);
    var asciiHost = urlObj.asciiHost;
  } catch (e) {
    G_Debug(this, "Unable to get hostname: " + str);
    return "";
  }

  var unescaped = this.hexDecode_(asciiHost);

  unescaped = unescaped.replace(this.REs_.FIND_DODGY_CHARS_GLOBAL, "")
              .replace(this.REs_.FIND_END_DOTS_GLOBAL, "")
              .replace(this.REs_.FIND_MULTIPLE_DOTS_GLOBAL, ".");

  var temp = this.parseIPAddress_(unescaped);
  if (temp)
    unescaped = temp;

  // TODO: what, exactly is it supposed to escape? This doesn't esecape 
  // ":", "/", ";", and "?"
  var escaped = encodeURI(unescaped);

  if (opt_maxDots) {
    // Limit the number of dots
    var k;
    var index = escaped.length;
    for (k = 0; k < opt_maxDots + 1; k++) {
      temp = escaped.lastIndexOf(".", index - 1);
      if (temp == -1) {
        break;
      } else {
        index = temp;
      }
    }
    
    if (k == opt_maxDots + 1 && index != -1) {
      escaped = escaped.substring(index + 1);
    }
  }

  escaped = escaped.toLowerCase();
  return escaped;
}

PROT_EnchashDecrypter.prototype.parseIPAddress_ = function(host) {

  host = host.replace(this.REs_.FIND_TRAILING_DOTS_GLOBAL, "");

  if (host.length <= 15) {
    // The Windows resolver allows a 4-part dotted decimal IP address to
    // have a space followed by any old rubbish, so long as the total length
    // of the string doesn't get above 15 characters. So, "10.192.95.89 xy"
    // is resolved to 10.192.95.89.
    // If the string length is greater than 15 characters, e.g.
    // "10.192.95.89 xy.wildcard.example.com", it will be resolved through
    // DNS.
    var match = this.REs_.FIND_TRAILING_SPACE.exec(host);
    if (match) {
      host = match[1];
    }
  }

  if (!this.REs_.POSSIBLE_IP.test(host))
    return "";

  var parts = host.split(".");
  if (parts.length > 4)
    return "";

  var allowOctal = !this.REs_.FIND_BAD_OCTAL.test(host);

  for (var k = 0; k < parts.length; k++) {
    var canon;
    if (k == parts.length - 1) {
      canon = this.canonicalNum_(parts[k], 5 - parts.length, allowOctal);
    } else {
      canon = this.canonicalNum_(parts[k], 1, allowOctal);
    }
    if (canon != "") 
      parts[k] = canon;
    else
      return "";
  }

  return parts.join(".");
}

PROT_EnchashDecrypter.prototype.canonicalNum_ = function(num, bytes, octal) {
  if (bytes < 0) 
    return "";
  var temp_num;

  if (octal && this.REs_.IS_OCTAL.test(num)) {

    num = this.lastNChars_(num, 11);

    temp_num = parseInt(num, 8);
    if (isNaN(temp_num))
      temp_num = -1;

  } else if (this.REs_.IS_DECIMAL.test(num)) {

    num = this.lastNChars_(num, 32);

    temp_num = parseInt(num, 10);
    if (isNaN(temp_num))
      temp_num = -1;

  } else if (this.REs_.IS_HEX.test(num)) {
    var matches = this.REs_.IS_HEX.exec(num);
    if (matches) {
      num = matches[1];
    }

    temp_num = parseInt(num, 16);
    if (isNaN(temp_num))
      temp_num = -1;

  } else {
    return "";
  }

  if (temp_num == -1) 
    return "";

  // Since we mod the number, we're removing the least significant bits.  We
  // Want to push them into the front of the array to preserve the order.
  var parts = [];
  while (bytes--) {
    parts.unshift("" + (temp_num % 256));
    temp_num -= temp_num % 256;
    temp_num /= 256;
  }

  return parts.join(".");
}

PROT_EnchashDecrypter.prototype.getLookupKey = function(host) {
  var dataKey = PROT_EnchashDecrypter.DATABASE_SALT + host;
  dataKey = this.base64_.arrayifyString(dataKey);

  this.hasher_.init(G_CryptoHasher.algorithms.MD5);
  var lookupDigest = this.hasher_.updateFromArray(dataKey);
  var lookupKey = this.hasher_.digestHex();

  return lookupKey.toUpperCase();
}

PROT_EnchashDecrypter.prototype.decryptData = function(data, host) {
  // XXX: base 64 decoding should be done in C++
  var asciiArray = this.base64_.decodeString(data);
  var ascii = this.base64_.stringifyArray(asciiArray);

  var random_salt = ascii.slice(0, PROT_EnchashDecrypter.SALT_LENGTH);
  var encrypted_data = ascii.slice(PROT_EnchashDecrypter.SALT_LENGTH);
  var temp_decryption_key = PROT_EnchashDecrypter.DATABASE_SALT
      + random_salt + host;
  this.hasher_.init(G_CryptoHasher.algorithms.MD5);
  this.hasher_.updateFromString(temp_decryption_key);

  var keyFactory = Cc["@mozilla.org/security/keyobjectfactory;1"]
                   .getService(Ci.nsIKeyObjectFactory);
  var key = keyFactory.keyFromString(Ci.nsIKeyObject.RC4,
                                     this.hasher_.digestRaw());

  this.streamCipher_.init(key);
  this.streamCipher_.updateFromString(encrypted_data);

  return this.streamCipher_.finish(false /* no base64 */);
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
 *   Tony Chang <tony@google.com> (original author)
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

/**
 * This class helps us batch a series of async calls to the db.
 * If any of the tokens is in the database, we fire callback with
 * true as a param.  If all the tokens are not in the  database,
 * we fire callback with false as a param.
 * This is an "Abstract" base class.  Subclasses need to supply
 * the condition_ method.
 *
 * @param tokens Array of strings to lookup in the db
 * @param tableName String name of the table
 * @param callback Function callback function that takes true if the condition
 *        passes.
 */
function MultiQuerier(tokens, tableName, callback) {
  this.tokens_ = tokens;
  this.tableName_ = tableName;
  this.callback_ = callback;
  this.dbservice_ = Cc["@mozilla.org/url-classifier/dbservice;1"]
                    .getService(Ci.nsIUrlClassifierDBService);
  // We put the current token in this variable.
  this.key_ = null;
}

/**
 * Run the remaining tokens against the db.
 */
MultiQuerier.prototype.run = function() {
  if (this.tokens_.length == 0) {
    this.callback_.handleEvent(false);
    this.dbservice_ = null;
    this.callback_ = null;
    return;
  }
  
  this.key_ = this.tokens_.pop();
  G_Debug(this, "Looking up " + this.key_ + " in " + this.tableName_);
  this.dbservice_.exists(this.tableName_, this.key_,
                         BindToObject(this.result_, this));
}

/**
 * Callback from the db.  If the returned value passes the this.condition_
 * test, go ahead and call the main callback.
 */
MultiQuerier.prototype.result_ = function(value) {
  if (this.condition_(value)) {
    this.callback_.handleEvent(true)
    this.dbservice_ = null;
    this.callback_ = null;
  } else {
    this.run();
  }
}

// Subclasses must override this.
MultiQuerier.prototype.condition_ = function(value) {
  throw "MultiQuerier is an abstract base class";
}


/**
 * Concrete MultiQuerier that stops if the key exists in the db.
 */
function ExistsMultiQuerier(tokens, tableName, callback) {
  MultiQuerier.call(this, tokens, tableName, callback);
  this.debugZone = "existsMultiQuerier";
}
ExistsMultiQuerier.inherits(MultiQuerier);

ExistsMultiQuerier.prototype.condition_ = function(value) {
  return value.length > 0;
}


/**
 * Concrete MultiQuerier that looks up a key, decrypts it, then
 * checks the the resulting regular expressions for a match.
 * @param tokens Array of hosts
 */
function EnchashMultiQuerier(tokens, tableName, callback, url) {
  MultiQuerier.call(this, tokens, tableName, callback);
  this.url_ = url;
  this.enchashDecrypter_ = new PROT_EnchashDecrypter();
  this.debugZone = "enchashMultiQuerier";
}
EnchashMultiQuerier.inherits(MultiQuerier);

EnchashMultiQuerier.prototype.run = function() {
  if (this.tokens_.length == 0) {
    this.callback_.handleEvent(false);
    this.dbservice_ = null;
    this.callback_ = null;
    return;
  }
  var host = this.tokens_.pop();
  this.key_ = host;
  var lookupKey = this.enchashDecrypter_.getLookupKey(host);
  this.dbservice_.exists(this.tableName_, lookupKey,
                         BindToObject(this.result_, this));
}

EnchashMultiQuerier.prototype.condition_ = function(encryptedValue) {
  if (encryptedValue.length > 0) {
    // We have encrypted regular expressions for this host. Let's 
    // decrypt them and see if we have a match.
    var decrypted = this.enchashDecrypter_.decryptData(encryptedValue,
                                                       this.key_);
    var res = this.enchashDecrypter_.parseRegExps(decrypted);
    for (var j = 0; j < res.length; j++) {
      if (res[j].test(this.url_)) {
        return true;
      }
    }
  }
  return false;
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

// XXX: This should all be moved into the dbservice class so it happens
// in the background thread.

/**
 * Abstract base class for a lookup table.
 * @construction
 */
function UrlClassifierTable() {
  this.debugZone = "urlclassifier-table";
  this.name = '';
  this.needsUpdate = false;
  this.enchashDecrypter_ = new PROT_EnchashDecrypter();
}

UrlClassifierTable.prototype.QueryInterface = function(iid) {
  if (iid.equals(Components.interfaces.nsISupports) ||
      iid.equals(Components.interfaces.nsIUrlClassifierTable))
    return this;                                              
  Components.returnCode = Components.results.NS_ERROR_NO_INTERFACE;
  return null;
}

/**
 * Subclasses need to implment this method.
 */
UrlClassifierTable.prototype.exists = function(url, callback) {
  throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
}

/////////////////////////////////////////////////////////////////////
// Url table implementation
function UrlClassifierTableUrl() {
  UrlClassifierTable.call(this);
}
UrlClassifierTableUrl.inherits(UrlClassifierTable);

/**
 * Look up a URL in a URL table
 */
UrlClassifierTableUrl.prototype.exists = function(url, callback) {
  // nsIUrlClassifierUtils.canonicalizeURL is the old way of canonicalizing a
  // URL.  Unfortunately, it doesn't normalize numeric domains so alternate IP
  // formats (hex, octal, etc) won't trigger a match.
  // this.enchashDecrypter_.getCanonicalUrl does the right thing and
  // normalizes a URL to 4 decimal numbers, but the update server may still be
  // giving us encoded IP addresses.  So to be safe, we check both cases.
  var urlUtils = Cc["@mozilla.org/url-classifier/utils;1"]
                 .getService(Ci.nsIUrlClassifierUtils);
  var oldCanonicalized = urlUtils.canonicalizeURL(url);
  var canonicalized = this.enchashDecrypter_.getCanonicalUrl(url);
  G_Debug(this, "Looking up: " + url + " (" + oldCanonicalized + " and " +
                canonicalized + ")");
  (new ExistsMultiQuerier([oldCanonicalized, canonicalized],
                          this.name,
                          callback)).run();
}

/////////////////////////////////////////////////////////////////////
// Domain table implementation

function UrlClassifierTableDomain() {
  UrlClassifierTable.call(this);
  this.debugZone = "urlclassifier-table-domain";
  this.ioService_ = Cc["@mozilla.org/network/io-service;1"]
                    .getService(Ci.nsIIOService);
}
UrlClassifierTableDomain.inherits(UrlClassifierTable);

/**
 * Look up a URL in a domain table
 * We also try to lookup domain + first path component (e.g.,
 * www.mozilla.org/products).
 *
 * @returns Boolean true if the url domain is in the table
 */
UrlClassifierTableDomain.prototype.exists = function(url, callback) {
  var canonicalized = this.enchashDecrypter_.getCanonicalUrl(url);
  var urlObj = this.ioService_.newURI(canonicalized, null, null);
  var host = '';
  try {
    host = urlObj.host;
  } catch (e) { }
  var hostComponents = host.split(".");

  // Try to get the path of the URL.  Pseudo urls (like wyciwyg:) throw
  // errors when trying to convert to an nsIURL so we wrap in a try/catch
  // block.
  var path = ""
  try {
    urlObj.QueryInterface(Ci.nsIURL);
    path = urlObj.filePath;
  } catch (e) { }

  var pathComponents = path.split("/");

  // We don't have a good way map from hosts to domains, so we instead try
  // each possibility. Could probably optimize to start at the second dot?
  var possible = [];
  for (var i = 0; i < hostComponents.length - 1; i++) {
    host = hostComponents.slice(i).join(".");
    possible.push(host);

    // The path starts with a "/", so we are interested in the second path
    // component if it is available
    if (pathComponents.length >= 2 && pathComponents[1].length > 0) {
      host = host + "/" + pathComponents[1];
      possible.push(host);
    }
  }

  // Run the possible domains against the db.
  (new ExistsMultiQuerier(possible, this.name, callback)).run();
}

/////////////////////////////////////////////////////////////////////
// Enchash table implementation

function UrlClassifierTableEnchash() {
  UrlClassifierTable.call(this);
  this.debugZone = "urlclassifier-table-enchash";
}
UrlClassifierTableEnchash.inherits(UrlClassifierTable);

/**
 * Look up a URL in an enchashDB.  We try all sub domains (up to MAX_DOTS).
 */
UrlClassifierTableEnchash.prototype.exists = function(url, callback) {
  url = this.enchashDecrypter_.getCanonicalUrl(url);
  var host = this.enchashDecrypter_.getCanonicalHost(url,
                                               PROT_EnchashDecrypter.MAX_DOTS);

  var possible = [];
  for (var i = 0; i < PROT_EnchashDecrypter.MAX_DOTS + 1; i++) {
    possible.push(host);

    var index = host.indexOf(".");
    if (index == -1)
      break;
    host = host.substring(index + 1);
  }
  // Run the possible domains against the db.
  (new EnchashMultiQuerier(possible, this.name, callback, url)).run();
}
//@line 46 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/toolkit/components/url-classifier/src/nsUrlClassifierTable.js"

var modScope = this;
function Init() {
  // Pull the library in.
  var jslib = Cc["@mozilla.org/url-classifier/jslib;1"]
              .getService().wrappedJSObject;
  modScope.G_Preferences = jslib.G_Preferences;
  modScope.G_PreferenceObserver = jslib.G_PreferenceObserver;
  modScope.G_Debug = jslib.G_Debug;
  modScope.G_CryptoHasher = jslib.G_CryptoHasher;
  modScope.G_Base64 = jslib.G_Base64;
  modScope.BindToObject = jslib.BindToObject;

  // We only need to call Init once.
  modScope.Init = function() {};
}


function UrlClassifierTableMod() {
  this.components = {};
  this.addComponent({
      cid: "{43399ee0-da0b-46a8-9541-08721265981c}",
      name: "UrlClassifier Table Url Module",
      progid: "@mozilla.org/url-classifier/table;1?type=url",
      factory: new UrlClassifierTableFactory(UrlClassifierTableUrl)
    });
  this.addComponent({
      cid: "{3b5004c6-3fcd-4b12-b311-a4dfbeaf27aa}",
      name: "UrlClassifier Table Domain Module",
      progid: "@mozilla.org/url-classifier/table;1?type=domain",
      factory: new UrlClassifierTableFactory(UrlClassifierTableDomain)
    });
  this.addComponent({
      cid: "{04f15d1d-2db8-4b8e-91d7-82f30308b434}",
      name: "UrlClassifier Table Enchash Module",
      progid: "@mozilla.org/url-classifier/table;1?type=enchash",
      factory: new UrlClassifierTableFactory(UrlClassifierTableEnchash)
    });
}

UrlClassifierTableMod.prototype.addComponent = function(comp) {
  this.components[comp.cid] = comp;
};

UrlClassifierTableMod.prototype.registerSelf = function(compMgr, fileSpec, loc, type) {
  compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
  // Register all the components
  for (var cid in this.components) {
    var comp = this.components[cid];
    compMgr.registerFactoryLocation(Components.ID(comp.cid),
                                    comp.name,
                                    comp.progid,
                                    fileSpec,
                                    loc,
                                    type);
  }
};

UrlClassifierTableMod.prototype.getClassObject = function(compMgr, cid, iid) {
  var comp = this.components[cid.toString()];

  if (!comp)
    throw Components.results.NS_ERROR_NO_INTERFACE;
  if (!iid.equals(Ci.nsIFactory))
    throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

  return comp.factory;
};

UrlClassifierTableMod.prototype.canUnload = function(compMgr) {
  return true;
};

/**
 * Create a factory.
 * @param ctor Function constructor for the object we're creating.
 */
function UrlClassifierTableFactory(ctor) {
  this.ctor = ctor;
}

UrlClassifierTableFactory.prototype.createInstance = function(outer, iid) {
  if (outer != null)
    throw Components.results.NS_ERROR_NO_AGGREGATION;
  Init();
  return (new this.ctor()).QueryInterface(iid);
};

var modInst = new UrlClassifierTableMod();

function NSGetModule(compMgr, fileSpec) {
  return modInst;
}
