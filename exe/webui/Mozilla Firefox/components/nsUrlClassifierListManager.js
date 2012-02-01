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
 *   Niels Provos <niels@google.com> (original author)
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


// A class that manages lists, namely white and black lists for
// phishing or malware protection. The ListManager knows how to fetch,
// update, and store lists, and knows the "kind" of list each is (is
// it a whitelist? a blacklist? etc). However it doesn't know how the
// lists are serialized or deserialized (the wireformat classes know
// this) nor the specific format of each list. For example, the list
// could be a map of domains to "1" if the domain is phishy. Or it
// could be a map of hosts to regular expressions to match, who knows?
// Answer: the trtable knows. List are serialized/deserialized by the
// wireformat reader from/to trtables, and queried by the listmanager.
//
// There is a single listmanager for the whole application.
//
// The listmanager is used only in privacy mode; in advanced protection
// mode a remote server is queried.
//
// How to add a new table:
// 1) get it up on the server
// 2) add it to tablesKnown
// 3) if it is not a known table type (trtable.js), add an implementation
//    for it in trtable.js
// 4) add a check for it in the phishwarden's isXY() method, for example
//    isBlackURL()
//
// TODO: obviously the way this works could use a lot of improvement. In
//       particular adding a list should just be a matter of adding
//       its name to the listmanager and an implementation to trtable
//       (or not if a talbe of that type exists). The format and semantics
//       of the list comprise its name, so the listmanager should easily
//       be able to figure out what to do with what list (i.e., no
//       need for step 4).
// TODO more comprehensive update tests, for example add unittest check 
//      that the listmanagers tables are properly written on updates

/**
 * The base pref name for where we keep table version numbers.
 * We add append the table name to this and set the value to
 * the version.  E.g., tableversion.goog-black-enchash may have
 * a value of 1.1234.
 */
const kTableVersionPrefPrefix = "urlclassifier.tableversion.";

// How frequently we check for updates (30 minutes)
const kUpdateInterval = 30 * 60 * 1000;

/**
 * A ListManager keeps track of black and white lists and knows
 * how to update them.
 *
 * @constructor
 */
function PROT_ListManager() {
  this.debugZone = "listmanager";
  G_debugService.enableZone(this.debugZone);

  this.currentUpdateChecker_ = null;   // set when we toggle updates
  this.prefs_ = new G_Preferences();

  this.updateserverURL_ = null;

  // The lists we know about and the parses we can use to read
  // them. Default all to the earlies possible version (1.-1); this
  // version will get updated when successfully read from disk or
  // fetch updates.
  this.tablesKnown_ = {};
  this.isTesting_ = false;
  
  if (this.isTesting_) {
    // populate with some tables for unittesting
    this.tablesKnown_ = {
      // A major version of zero means local, so don't ask for updates       
      "test1-foo-domain" : new PROT_VersionParser("test1-foo-domain", 0, -1),
      "test2-foo-domain" : new PROT_VersionParser("test2-foo-domain", 0, -1),
      "test-white-domain" : 
        new PROT_VersionParser("test-white-domain", 0, -1, true /* require mac*/),
      "test-mac-domain" :
        new PROT_VersionParser("test-mac-domain", 0, -1, true /* require mac */)
    };
    
    // expose the object for unittesting
    this.wrappedJSObject = this;
  }

  this.tablesData = {};

  this.observerServiceObserver_ = new G_ObserverServiceObserver(
                                          'xpcom-shutdown',
                                          BindToObject(this.shutdown_, this),
                                          true /*only once*/);

  // Lazily create urlCrypto (see tr-fetcher.js)
  this.urlCrypto_ = null;
  
  this.requestBackoff_ = new RequestBackoff(3 /* num errors */,
                                   10*60*1000 /* error time, 10min */,
                                   60*60*1000 /* backoff interval, 60min */,
                                   6*60*60*1000 /* max backoff, 6hr */);
}

/**
 * xpcom-shutdown callback
 * Delete all of our data tables which seem to leak otherwise.
 */
PROT_ListManager.prototype.shutdown_ = function() {
  for (var name in this.tablesData) {
    delete this.tablesData[name];
  }
}

/**
 * Set the url we check for updates.  If the new url is valid and different,
 * update our table list.
 * 
 * After setting the update url, the caller is responsible for registering
 * tables and then toggling update checking.  All the code for this logic is
 * currently in browser/components/safebrowsing.  Maybe it should be part of
 * the listmanger?
 */
PROT_ListManager.prototype.setUpdateUrl = function(url) {
  G_Debug(this, "Set update url: " + url);
  if (url != this.updateserverURL_) {
    this.updateserverURL_ = url;
    this.requestBackoff_.reset();
    
    // Remove old tables which probably aren't valid for the new provider.
    for (var name in this.tablesData) {
      delete this.tablesData[name];
      delete this.tablesKnown_[name];
    }
  }
}

/**
 * Set the crypto key url.
 * @param url String
 */
PROT_ListManager.prototype.setKeyUrl = function(url) {
  G_Debug(this, "Set key url: " + url);
  if (!this.urlCrypto_)
    this.urlCrypto_ = new PROT_UrlCrypto();
  
  this.urlCrypto_.manager_.setKeyUrl(url);
}

/**
 * Register a new table table
 * @param tableName - the name of the table
 * @param opt_requireMac true if a mac is required on update, false otherwise
 * @returns true if the table could be created; false otherwise
 */
PROT_ListManager.prototype.registerTable = function(tableName, 
                                                    opt_requireMac) {
  var table = new PROT_VersionParser(tableName, 1, -1, opt_requireMac);
  if (!table)
    return false;
  this.tablesKnown_[tableName] = table;
  this.tablesData[tableName] = newUrlClassifierTable(tableName);

  return true;
}

/**
 * Enable updates for some tables
 * @param tables - an array of table names that need updating
 */
PROT_ListManager.prototype.enableUpdate = function(tableName) {
  var changed = false;
  var table = this.tablesKnown_[tableName];
  if (table) {
    G_Debug(this, "Enabling table updates for " + tableName);
    table.needsUpdate = true;
    changed = true;
  }

  if (changed === true)
    this.maybeToggleUpdateChecking();
}

/**
 * Disables updates for some tables
 * @param tables - an array of table names that no longer need updating
 */
PROT_ListManager.prototype.disableUpdate = function(tableName) {
  var changed = false;
  var table = this.tablesKnown_[tableName];
  if (table) {
    G_Debug(this, "Disabling table updates for " + tableName);
    table.needsUpdate = false;
    changed = true;
  }

  if (changed === true)
    this.maybeToggleUpdateChecking();
}

/**
 * Determine if we have some tables that need updating.
 */
PROT_ListManager.prototype.requireTableUpdates = function() {
  for (var type in this.tablesKnown_) {
    // All tables with a major of 0 are internal tables that we never
    // update remotely.
    if (this.tablesKnown_[type].major == 0)
      continue;
     
    // Tables that need updating even if other tables dont require it
    if (this.tablesKnown_[type].needsUpdate)
      return true;
  }

  return false;
}

/**
 * Start managing the lists we know about. We don't do this automatically
 * when the listmanager is instantiated because their profile directory
 * (where we store the lists) might not be available.
 */
PROT_ListManager.prototype.maybeStartManagingUpdates = function() {
  if (this.isTesting_)
    return;

  // We might have been told about tables already, so see if we should be
  // actually updating.
  this.maybeToggleUpdateChecking();
}

/**
 * Determine if we have any tables that require updating.  Different
 * Wardens may call us with new tables that need to be updated.
 */ 
PROT_ListManager.prototype.maybeToggleUpdateChecking = function() {
  // If we are testing or dont have an application directory yet, we should
  // not start reading tables from disk or schedule remote updates
  if (this.isTesting_)
    return;

  // We update tables if we have some tables that want updates.  If there
  // are no tables that want to be updated - we dont need to check anything.
  if (this.requireTableUpdates() === true) {
    G_Debug(this, "Starting managing lists");
    this.startUpdateChecker();

    // Multiple warden can ask us to reenable updates at the same time, but we
    // really just need to schedule a single update.
    if (!this.currentUpdateChecker_) {
      // If the user has never downloaded tables, do the check now.
      // If the user has tables, add a fuzz of a few minutes.
      this.loadTableVersions_();
      var hasTables = false;
      for (var table in this.tablesKnown_) {
        if (this.tablesKnown_[table].minor != -1) {
          hasTables = true;
          break;
        }
      }

      var initialUpdateDelay = 3000;
      if (hasTables) {
        // Add a fuzz of 0-5 minutes.
        initialUpdateDelay += Math.floor(Math.random() * (5 * 60 * 1000));
      }
      this.currentUpdateChecker_ =
        new G_Alarm(BindToObject(this.checkForUpdates, this),
                    initialUpdateDelay);
    }
  } else {
    G_Debug(this, "Stopping managing lists (if currently active)");
    this.stopUpdateChecker();                    // Cancel pending updates
  }
}

/**
 * Start periodic checks for updates. Idempotent.
 * We want to distribute update checks evenly across the update period (an
 * hour).  To do this, we pick a random number of time between 0 and 30
 * minutes.  The client first checks at 15 + rand, then every 30 minutes after
 * that.
 */
PROT_ListManager.prototype.startUpdateChecker = function() {
  this.stopUpdateChecker();
  
  // Schedule the first check for between 15 and 45 minutes.
  var repeatingUpdateDelay = kUpdateInterval / 2;
  repeatingUpdateDelay += Math.floor(Math.random() * kUpdateInterval);
  this.updateChecker_ = new G_Alarm(BindToObject(this.initialUpdateCheck_,
                                                 this),
                                    repeatingUpdateDelay);
}

/**
 * Callback for the first update check.
 * We go ahead and check for table updates, then start a regular timer (once
 * every 30 minutes).
 */
PROT_ListManager.prototype.initialUpdateCheck_ = function() {
  this.checkForUpdates();
  this.updateChecker_ = new G_Alarm(BindToObject(this.checkForUpdates, this), 
                                    kUpdateInterval, true /* repeat */);
}

/**
 * Stop checking for updates. Idempotent.
 */
PROT_ListManager.prototype.stopUpdateChecker = function() {
  if (this.updateChecker_) {
    this.updateChecker_.cancel();
    this.updateChecker_ = null;
  }
  // Cancel the oneoff check from maybeToggleUpdateChecking.
  if (this.currentUpdateChecker_) {
    this.currentUpdateChecker_.cancel();
    this.currentUpdateChecker_ = null;
  }
}

/**
 * Provides an exception free way to look up the data in a table. We
 * use this because at certain points our tables might not be loaded,
 * and querying them could throw.
 *
 * @param table String Name of the table that we want to consult
 * @param key String Key for table lookup
 * @param callback nsIUrlListManagerCallback (ie., Function) given false or the
 *        value in the table corresponding to key.  If the table name does not
 *        exist, we return false, too.
 */
PROT_ListManager.prototype.safeExists = function(table, key, callback) {
  try {
    G_Debug(this, "safeExists: " + table + ", " + key);
    var map = this.tablesData[table];
    map.exists(key, callback);
  } catch(e) {
    G_Debug(this, "safeExists masked failure for " + table + ", key " + key + ": " + e);
    callback.handleEvent(false);
  }
}

/**
 * We store table versions in user prefs.  This method pulls the values out of
 * the user prefs and into the tablesKnown objects.
 */
PROT_ListManager.prototype.loadTableVersions_ = function() {
  // Pull values out of prefs.
  var prefBase = kTableVersionPrefPrefix;
  for (var table in this.tablesKnown_) {
    var version = this.prefs_.getPref(prefBase + table, "1.-1");
    G_Debug(this, "loadTableVersion " + table + ": " + version);
    var tokens = version.split(".");
    G_Assert(this, tokens.length == 2, "invalid version number");
    
    this.tablesKnown_[table].major = tokens[0];
    this.tablesKnown_[table].minor = tokens[1];
  }
}

/**
 * Callback from db update service.  As new tables are added to the db,
 * this callback is fired so we can update the version number.
 * @param versionString String containing the table update response from the
 *        server
 */
PROT_ListManager.prototype.setTableVersion_ = function(versionString) {
  G_Debug(this, "Got version string: " + versionString);
  var versionParser = new PROT_VersionParser("");
  if (versionParser.fromString(versionString)) {
    var tableName = versionParser.type;
    var versionNumber = versionParser.versionString();
    var prefBase = kTableVersionPrefPrefix;

    this.prefs_.setPref(prefBase + tableName, versionNumber);
    
    if (!this.tablesKnown_[tableName]) {
      this.tablesKnown_[tableName] = versionParser;
    } else {
      this.tablesKnown_[tableName].ImportVersion(versionParser);
    }
    
    if (!this.tablesData[tableName])
      this.tablesData[tableName] = newUrlClassifierTable(tableName);
  }

  // Since this is called from the update server, it means there was
  // a successful http request.  Make sure to notify the request backoff
  // object.
  this.requestBackoff_.noteServerResponse(200 /* ok */);
}

/**
 * Prepares a URL to fetch upates from. Format is a squence of 
 * type:major:minor, fields
 * 
 * @param url The base URL to which query parameters are appended; assumes
 *            already has a trailing ?
 * @returns the URL that we should request the table update from.
 */
PROT_ListManager.prototype.getRequestURL_ = function(url) {
  url += "version=";
  var firstElement = true;
  var requestMac = false;

  for (var type in this.tablesKnown_) {
    // All tables with a major of 0 are internal tables that we never
    // update remotely.
    if (this.tablesKnown_[type].major == 0)
      continue;

    // Check if the table needs updating
    if (this.tablesKnown_[type].needsUpdate == false)
      continue;

    if (!firstElement) {
      url += ","
    } else {
      firstElement = false;
    }
    url += type + ":" + this.tablesKnown_[type].toUrl();

    if (this.tablesKnown_[type].requireMac)
      requestMac = true;
  }

  // Request a mac only if at least one of the tables to be updated requires
  // it
  if (requestMac) {
    // Add the wrapped key for requesting macs
    if (!this.urlCrypto_)
      this.urlCrypto_ = new PROT_UrlCrypto();

    url += "&wrkey=" +
      encodeURIComponent(this.urlCrypto_.getManager().getWrappedKey());
  }

  G_Debug(this, "getRequestURL returning: " + url);
  return url;
}

/**
 * Updates our internal tables from the update server
 *
 * @returns true when a new request was scheduled, false if an old request
 *          was still pending.
 */
PROT_ListManager.prototype.checkForUpdates = function() {
  // Allow new updates to be scheduled from maybeToggleUpdateChecking()
  this.currentUpdateChecker_ = null;

  if (!this.updateserverURL_) {
    G_Debug(this, 'checkForUpdates: no update server url');
    return false;
  }

  // See if we've triggered the request backoff logic.
  if (!this.requestBackoff_.canMakeRequest())
    return false;

  // Check to make sure our tables still exist (maybe the db got corrupted or
  // the user deleted the file).  If not, we need to reset the table version
  // before sending the update check.
  var tableNames = [];
  for (var tableName in this.tablesKnown_) {
    tableNames.push(tableName);
  }
  var dbService = Cc["@mozilla.org/url-classifier/dbservice;1"]
                  .getService(Ci.nsIUrlClassifierDBService);
  dbService.checkTables(tableNames.join(","),
                        BindToObject(this.makeUpdateRequest_, this));
  return true;
}

/**
 * Method that fires the actual HTTP update request.
 * First we reset any tables that have disappeared.
 * @param tableNames String comma separated list of tables that
 *   don't exist
 */
PROT_ListManager.prototype.makeUpdateRequest_ = function(tableNames) {
  // Clear prefs that track table version if they no longer exist in the db.
  var tables = tableNames.split(",");
  for (var i = 0; i < tables.length; ++i) {
    G_Debug(this, "Table |" + tables[i] + "| no longer exists, clearing pref.");
    this.prefs_.clearPref(kTableVersionPrefPrefix + tables[i]);
  }

  // Ok, now reload the table version.
  this.loadTableVersions_();

  G_Debug(this, 'checkForUpdates: scheduling request..');
  var url = this.getRequestURL_(this.updateserverURL_);
  var streamer = Cc["@mozilla.org/url-classifier/streamupdater;1"]
                 .getService(Ci.nsIUrlClassifierStreamUpdater);
  try {
    streamer.updateUrl = url;
  } catch (e) {
    G_Debug(this, 'invalid url');
    return;
  }

  if (!streamer.downloadUpdates(BindToObject(this.setTableVersion_, this),
                                BindToObject(this.downloadError_, this))) {
    G_Debug(this, "pending update, wait until later");
  }
}

/**
 * Callback function if there's a download error.
 * @param status String http status or an empty string if connection refused.
 */
PROT_ListManager.prototype.downloadError_ = function(status) {
  G_Debug(this, "download error: " + status);
  // If status is empty, then we assume that we got an NS_CONNECTION_REFUSED
  // error.  In this case, we treat this is a http 500 error.
  if (!status) {
    status = 500;
  }
  status = parseInt(status, 10);
  this.requestBackoff_.noteServerResponse(status);

  // Try again in a minute
  this.currentUpdateChecker_ =
    new G_Alarm(BindToObject(this.checkForUpdates, this), 60000);
}

PROT_ListManager.prototype.QueryInterface = function(iid) {
  if (iid.equals(Ci.nsISupports) ||
      iid.equals(Ci.nsIUrlListManager) ||
      iid.equals(Ci.nsITimerCallback))
    return this;

  Components.returnCode = Components.results.NS_ERROR_NO_INTERFACE;
  return null;
}

// A simple factory function that creates nsIUrlClassifierTable instances based
// on a name.  The name is a string of the format
// provider_name-semantic_type-table_type.  For example, goog-white-enchash
// or goog-black-url.
function newUrlClassifierTable(name) {
  G_Debug("protfactory", "Creating a new nsIUrlClassifierTable: " + name);
  var tokens = name.split('-');
  var type = tokens[2];
  var table = Cc['@mozilla.org/url-classifier/table;1?type=' + type]
                .createInstance(Ci.nsIUrlClassifierTable);
  table.name = name;
  return table;
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
 *   Niels Provos <niels@google.com> (original author)
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


// A class that serializes and deserializes opaque key/value string to
// string maps to/from maps (trtables). It knows how to create
// trtables from the serialized format, so it also understands
// meta-information like the name of the table and the table's
// version. See docs for the protocol description.
// 
// TODO: wireformatreader: if you have multiple updates for one table
//       in a call to deserialize, the later ones will be merged 
//       (all but the last will be ignored). To fix, merge instead
//       of replace when you have an existing table, and only do so once.
// TODO must have blank line between successive types -- problem?
// TODO doesn't tolerate blank lines very well
//
// Maybe: These classes could use a LOT more cleanup, but it's not a
//       priority at the moment. For example, the tablesData/Known
//       maps should be combined into a single object, the parser
//       for a given type should be separate from the version info,
//       and there should be synchronous interfaces for testing.


/**
 * A class that knows how to serialize and deserialize meta-information.
 * This meta information is the table name and version number, and 
 * in its serialized form looks like the first line below:
 * 
 * [name-of-table X.Y update?]                
 * ...key/value pairs to add or delete follow...
 * <blank line ends the table>
 *
 * The X.Y is the version number and the optional "update" token means 
 * that the table is a differential from the curent table the extension
 * has. Its absence means that this is a full, new table.
 */
function PROT_VersionParser(type, opt_major, opt_minor, opt_requireMac) {
  this.debugZone = "versionparser";
  this.type = type;
  this.major = 0;
  this.minor = 0;

  this.badHeader = false;

  // Should the wireformatreader compute a mac?
  this.mac = false;
  this.macval = "";
  this.macFailed = false;
  this.requireMac = !!opt_requireMac;

  this.update = false;
  this.needsUpdate = false;  // used by ListManager to determine update policy
  // Used by ListerManager to see if we have read data for this table from
  // disk.  Once we read a table from disk, we are not going to do so again
  // but instead update remotely if necessary.
  this.didRead = false;
  if (opt_major)
    this.major = parseInt(opt_major);
  if (opt_minor)
    this.minor = parseInt(opt_minor);
}

/** Import the version information from another VersionParser
 * @params version a version parser object
 */
PROT_VersionParser.prototype.ImportVersion = function(version) {
  this.major = version.major;
  this.minor = version.minor;

  this.mac = version.mac;
  this.macFailed = version.macFailed;
  this.macval = version.macval;
  // Don't set requireMac, since we create vparsers from scratch and doesn't
  // know about it
}

/** 
 * Creates a string like [goog-white-black 1.1] from internal information
 * 
 * @returns String
 */
PROT_VersionParser.prototype.toString = function() {
  var s = "[" + this.type + " " + this.major + "." + this.minor + "]";
  return s;
}

/**
 * Creates a string like 1.123 with the version number.  This is the
 * format we store in prefs.
 * @return String
 */
PROT_VersionParser.prototype.versionString = function() {
  return this.major + "." + this.minor;
}

/** 
 * Creates a string like 1:1 from internal information used for
 * fetching updates from the server. Called by the listmanager.
 * 
 * @returns String
 */
PROT_VersionParser.prototype.toUrl = function() {
  return this.major + ":" + this.minor;
}

/**
 * Process the old format, [type major.minor [update]]
 *
 * @returns true if the string could be parsed, false otherwise
 */
PROT_VersionParser.prototype.processOldFormat_ = function(line) {
  if (line[0] != '[' || line.slice(-1) != ']')
    return false;

  var description = line.slice(1, -1);

  // Get the type name and version number of this table
  var tokens = description.split(" ");
  this.type = tokens[0];
  var majorminor = tokens[1].split(".");
  this.major = parseInt(majorminor[0]);
  this.minor = parseInt(majorminor[1]);
  if (isNaN(this.major) || isNaN(this.minor))
    return false;

  if (tokens.length >= 3) {
     this.update = tokens[2] == "update";
  }

  return true;
}

/**
 * Takes a string like [name-of-table 1.1 [update]][mac=MAC] and figures out the
 * type and corresponding version numbers.
 * @returns true if the string could be parsed, false otherwise
 */
PROT_VersionParser.prototype.fromString = function(line) {
  G_Debug(this, "Calling fromString with line: " + line);
  if (line[0] != '[' || line.slice(-1) != ']')
    return false;

  // There could be two [][], so take care of it
  var secondBracket = line.indexOf('[', 1);
  var firstPart = null;
  var secondPart = null;

  if (secondBracket != -1) {
    firstPart = line.substring(0, secondBracket);
    secondPart = line.substring(secondBracket);
    G_Debug(this, "First part: " + firstPart + " Second part: " + secondPart);
  } else {
    firstPart = line;
    G_Debug(this, "Old format: " + firstPart);
  }

  if (!this.processOldFormat_(firstPart))
    return false;

  if (secondPart && !this.processOptTokens_(secondPart))
    return false;

  return true;
}

/**
 * Process optional tokens
 *
 * @param line A string [token1=val1 token2=val2...]
 * @returns true if the string could be parsed, false otherwise
 */
PROT_VersionParser.prototype.processOptTokens_ = function(line) {
  if (line[0] != '[' || line.slice(-1) != ']')
    return false;
  var description = line.slice(1, -1);
  // Get the type name and version number of this table
  var tokens = description.split(" ");

  for (var i = 0; i < tokens.length; i++) {
    G_Debug(this, "Processing optional token: " + tokens[i]);
    var tokenparts = tokens[i].split("=");
    switch(tokenparts[0]){
    case "mac":
      this.mac = true;
      if (tokenparts.length < 2) {
        G_Debug(this, "Found mac flag but not mac value!");
        return false;
      }
      // The mac value may have "=" in it, so we can't just use tokenparts[1].
      // Instead, just take the rest of tokens[i] after the first "="
      this.macval = tokens[i].substr(tokens[i].indexOf("=")+1);
      break;
    default:
      G_Debug(this, "Found unrecognized token: " + tokenparts[0]);
      break;
    }
  }

  return true;
}

//@line 43 "/cygdrive/c/builds/tinderbox/Fx-Mozilla1.8-release/WINNT_5.2_Depend/mozilla/toolkit/components/url-classifier/src/nsUrlClassifierListManager.js"

var modScope = this;
function Init() {
  // Pull the library in.
  var jslib = Cc["@mozilla.org/url-classifier/jslib;1"]
              .getService().wrappedJSObject;
  Function.prototype.inherits = jslib.Function.prototype.inherits;
  modScope.G_Preferences = jslib.G_Preferences;
  modScope.G_PreferenceObserver = jslib.G_PreferenceObserver;
  modScope.G_ObserverServiceObserver = jslib.G_ObserverServiceObserver;
  modScope.G_Debug = jslib.G_Debug;
  modScope.G_Assert = jslib.G_Assert;
  modScope.G_debugService = jslib.G_debugService;
  modScope.G_Alarm = jslib.G_Alarm;
  modScope.BindToObject = jslib.BindToObject;
  modScope.PROT_XMLFetcher = jslib.PROT_XMLFetcher;
  modScope.PROT_UrlCrypto = jslib.PROT_UrlCrypto;
  modScope.RequestBackoff = jslib.RequestBackoff;

  // We only need to call Init once.
  modScope.Init = function() {};
}

// Module object
function UrlClassifierListManagerMod() {
  this.firstTime = true;
  this.cid = Components.ID("{ca168834-cc00-48f9-b83c-fd018e58cae3}");
  this.progid = "@mozilla.org/url-classifier/listmanager;1";
}

UrlClassifierListManagerMod.prototype.registerSelf = function(compMgr, fileSpec, loc, type) {
  if (this.firstTime) {
    this.firstTime = false;
    throw Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
  }
  compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
  compMgr.registerFactoryLocation(this.cid,
                                  "UrlClassifier List Manager Module",
                                  this.progid,
                                  fileSpec,
                                  loc,
                                  type);
};

UrlClassifierListManagerMod.prototype.getClassObject = function(compMgr, cid, iid) {  
  if (!cid.equals(this.cid))
    throw Components.results.NS_ERROR_NO_INTERFACE;
  if (!iid.equals(Ci.nsIFactory))
    throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

  return this.factory;
}

UrlClassifierListManagerMod.prototype.canUnload = function(compMgr) {
  return true;
}

UrlClassifierListManagerMod.prototype.factory = {
  createInstance: function(outer, iid) {
    if (outer != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    Init();
    return (new PROT_ListManager()).QueryInterface(iid);
  }
};

var ListManagerModInst = new UrlClassifierListManagerMod();

function NSGetModule(compMgr, fileSpec) {
  return ListManagerModInst;
}
