# -*- test-case-name: twisted.test.test_persisted -*-
# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.



"""
Different styles of persisted objects.
"""

# System Imports
import types
import copy_reg
import copy

try:
    import cStringIO as StringIO
except ImportError:
    import StringIO

from exe                import globals as G
from exe.engine.path    import Path

# Use the eXe logger directly:
import logging
log = logging.getLogger(__name__)


try:
    from new import instancemethod
except:
    from org.python.core import PyMethod
    instancemethod = PyMethod

oldModules = {}

## First, let's register support for some stuff that really ought to
## be registerable...

def pickleMethod(method):
    'support function for copy_reg to pickle method refs'
    return unpickleMethod, (method.im_func.__name__,
                             method.im_self,
                             method.im_class)

def unpickleMethod(im_name,
                    im_self,
                    im_class):
    'support function for copy_reg to unpickle method refs'
    try:
        unbound = getattr(im_class,im_name)
        if im_self is None:
            return unbound
        bound=instancemethod(unbound.im_func,
                                 im_self,
                                 im_class)
        return bound
    except AttributeError:
        log.error("Method" + im_name + "not on class" + im_class)
        assert im_self is not None,"No recourse: no instance to guess from."
        # Attempt a common fix before bailing -- if classes have
        # changed around since we pickled this method, we may still be
        # able to get it by looking on the instance's current class.
        unbound = getattr(im_self.__class__,im_name)
        log.error("Attempting fixup with" + unbound)
        if im_self is None:
            return unbound
        bound=instancemethod(unbound.im_func,
                                 im_self,
                                 im_self.__class__)
        return bound

copy_reg.pickle(types.MethodType,
                pickleMethod,
                unpickleMethod)

def pickleModule(module):
    'support function for copy_reg to pickle module refs'
    return unpickleModule, (module.__name__,)

def unpickleModule(name):
    'support function for copy_reg to unpickle module refs'
    if oldModules.has_key(name):
        log.info("Module has moved: " + name)
        name = oldModules[name]
        log.info(name)
    return __import__(name,{},{},'x')


copy_reg.pickle(types.ModuleType,
                pickleModule,
                unpickleModule)

def pickleStringO(stringo):
    'support function for copy_reg to pickle StringIO.OutputTypes'
    return unpickleStringO, (stringo.getvalue(), stringo.tell())

def unpickleStringO(val, sek):
    x = StringIO.StringIO()
    x.write(val)
    x.seek(sek)
    return x

if hasattr(StringIO, 'OutputType'):
    copy_reg.pickle(StringIO.OutputType,
                    pickleStringO,
                    unpickleStringO)

def pickleStringI(stringi):
    return unpickleStringI, (stringi.getvalue(), stringi.tell())

def unpickleStringI(val, sek):
    x = StringIO.StringIO(val)
    x.seek(sek)
    return x


if hasattr(StringIO, 'InputType'):
    copy_reg.pickle(StringIO.InputType,
                pickleStringI,
                unpickleStringI)

class Ephemeral:
    """
    This type of object is never persisted; if possible, even references to it
    are eliminated.
    """

    def __getstate__(self):
        log.warn( "WARNING: serializing ephemeral " + self )
        import gc
        for r in gc.get_referrers(self):
            log.warn( " referred to by " + (r,))
        return None

    def __setstate__(self, state):
        log.warn( "WARNING: unserializing ephemeral " + self.__class__ )
        self.__class__ = Ephemeral


versionedsToUpgrade = {}
upgraded = {}

def doUpgrade(newPackage=None, isMerge=False, preMergePackage=None):
    global versionedsToUpgrade, upgraded

    # prepare to save the maximum field ID seen upon load,
    # so that it can be set AFTER load, when the Field class is available:
    G.application.maxFieldId = 1 

    try: 
        # Two-pass system for merges, to be sure that no old/corrupt files
        # cause any problems, since we don't actually have a rollback system:
        if isMerge:
            # just check all the objects, but don't actually change any, 
            # letting any exception stop this before the real requireUpgrade()
            log.debug("doUpgrade performing a pre-Merge safety check.")
            for versioned in versionedsToUpgrade.values(): 
                requireUpgrade(versioned, newPackage, 
                    isMerge, preMergePackage, mergeCheck=True)
            log.debug("doUpgrade completed the pre-Merge safety check.")
        for versioned in versionedsToUpgrade.values(): 
            requireUpgrade(versioned, newPackage, 
                    isMerge, preMergePackage, mergeCheck=False)
    except Exception, exc:
        # clear out any remaining upgrades before continuing:
        versionedsToUpgrade = {}
        upgraded = {}
        raise
    versionedsToUpgrade = {}
    upgraded = {}

def requireUpgrade(obj, newPackage=None, 
        isMerge=False, preMergePackage=None, mergeCheck=False):
    """Require that a Versioned instance be upgraded completely first.
    """
    objID = id(obj)
    if objID in versionedsToUpgrade and objID not in upgraded:
        if not mergeCheck: 
            upgraded[objID] = 1
        obj.versionUpgrade(newPackage, isMerge, preMergePackage, mergeCheck)
        return obj

from twisted.python import reflect

def _aybabtu(c):
    l = []
    for b in reflect.allYourBase(c, Versioned):
        if b not in l and b is not Versioned:
            l.append(b)
    return l

class Versioned:
    """
    This type of object is persisted with versioning information.

    I have a single class attribute, the int persistenceVersion.  After I am
    unserialized (and styles.doUpgrade() is called), self.upgradeToVersionX()
    will be called for each version upgrade I must undergo.

    For example, if I serialize an instance of a Foo(Versioned) at version 4
    and then unserialize it when the code is at version 9, the calls::

      self.upgradeToVersion5()
      self.upgradeToVersion6()
      self.upgradeToVersion7()
      self.upgradeToVersion8()
      self.upgradeToVersion9()

    will be made.  If any of these methods are undefined, a warning message
    will be printed.
    """
    persistenceVersion = 0
    persistenceForgets = ()

    def __setstate__(self, state):
        # Do NOT flag this object ToUpgrade if this setstate is called 
        # during a deepcopy during a package merge's copyToPackage().
        # This is because the object has already been upgraded during its
        # initial load, and does not need to be flagged for another upgrade:
        if not G.application.persistNonPersistants: 
            versionedsToUpgrade[id(self)] = self

        self.__dict__ = state

    def __getstate__(self, dict=None):
        """Get state, adding a version number to it on its way out.
        """
        dct = copy.copy(dict or self.__dict__)
        bases = _aybabtu(self.__class__)
        bases.reverse()
        bases.append(self.__class__) # don't forget me!!
        for base in bases:
            if base.__dict__.has_key('persistenceForgets'):
                for slot in base.persistenceForgets:
                    if dct.has_key(slot):
                        del dct[slot]
            if base.__dict__.has_key('persistenceVersion'):
                dct['%s.persistenceVersion' % reflect.qual(base)] = base.persistenceVersion
        return dct

    def versionUpgrade(self, newPackage=None, 
                       isMerge=False, preMergePackage=None, mergeCheck=False):
        """(internal) Do a version upgrade.
        """
        bases = _aybabtu(self.__class__)
        # put the bases in order so superclasses' persistenceVersion methods
        # will be called first.
        bases.reverse()
        bases.append(self.__class__) # don't forget me!!

        # first let's look for old-skool versioned's
        if self.__dict__.has_key("persistenceVersion"):
            
            # Hacky heuristic: if more than one class subclasses Versioned,
            # we'll assume that the higher version number wins for the older
            # class, so we'll consider the attribute the version of the older
            # class.  There are obviously possibly times when this will
            # eventually be an incorrect assumption, but hopefully old-school
            # persistenceVersion stuff won't make it that far into multiple
            # classes inheriting from Versioned.
            
            pver = self.__dict__['persistenceVersion']
            del self.__dict__['persistenceVersion']
            highestVersion = 0
            highestBase = None
            for base in bases:
                if not base.__dict__.has_key('persistenceVersion'):
                    continue
                if base.persistenceVersion > highestVersion:
                    highestBase = base
                    highestVersion = base.persistenceVersion
            if highestBase:
                self.__dict__['%s.persistenceVersion' % reflect.qual(highestBase)] = pver

        for base in bases:
            #################################
            # bogus-extraction support: 
            # (for extracted elps from v0.21? maybe r2556?-r2665? see node.py)
            # Apparently some versions of the eXe code had problems
            # with Extract Package, and would still generate all of the
            # available objects, even if only a small subset were in use
            # by the newly extracted package.  Those objects which were
            # not in use would still be saved, linked to the old, complete,
            # package object.  Look for any of these Resources or Nodes and
            # force them to use the new, proper, package object.  Their
            # subsequent afterUpgradeHandlers (for Resources) will take
            # care of the rest.  
            # Please note that this fix will merely allow such corrupt .elps
            # to load without error, but all the old objects will still exist.
            # To trim down the size and loading time of this .elp, then
            # be sure to do another Extract Package on the root node
            # of this file, which will NOW work properly ;-)
            #
            # Note: this now also applies to the merging of packages,
            # automatically reconnecting these objects to the new package:
            #
            if repr(base)=="<class 'exe.engine.resource.Resource'>":
                # print out the elp objects:
                if not mergeCheck: 
                    log.debug("LOADING RESOURCE = \"" + repr(self) + "\"")
                #
                if newPackage is not None and self._package != newPackage:
                    # The following more extreme package comparison really only
                    # applies to resources, since other objects that might need
                    # their packages switched are "simple enough" to do it here
                    if self._package is not None: 
                        if isMerge and self._package == preMergePackage:
                            # doing a valid merge, from the preMerge-load.
                            # requires that resources have already been
                            # upgraded to at LEAST have their checksum,
                            if not hasattr(self, 'checksum'):
                                log.error("Old package: unable to "
                                        + "relink old Resource (w/o checksum) "
                                        + repr(self)
                                        + " to new merge package. "
                                        + " Please upgrade package first!")
                                #  May want to include the package name here:
                                raise Exception(_(u"Package is old. Please upgrade it (using File..Open followed by File..Save As) before attempting to insert it into another package!"))
                        elif isMerge:
                            # this is a merge with a resource that is
                            # pointing to an old package, not even the
                            # preMergePackage.  Whether or not it has
                            # the checksum attribute, this needs to be
                            # upgraded and corrected via a straight LOAD:
                            log.error("Old package: unable to "
                                    + "relink old Resource (w/ wrong package) "
                                    + repr(self)
                                    + " to new merge package. "
                                    + " Please upgrade package first!")
                            #  May want to include the package name here:
                            raise Exception(_(u"Package is old. Please upgrade it (using File..Open followed by File..Save As) before attempting to insert it into another package!"))
                        else:
                            # This appears to be a corrupt resource, pointing 
                            # to an invalid package.  For non-merge loads, we
                            # can just reset its package directly, and any
                            # subsequent upgrades can handle the rest.
                            if not mergeCheck:
                                # try WITHOUT relinking,
                                # since zombie checks are now done:
                                log.warn("NOT relinking corrupt Resource " \
                                    +repr(self) + " to new package."
                                    + " (letting zombie check correct it)") 
                    else:
                        log.debug("ignoring Resource "+repr(self) \
                            + " as it no longer applies to any package.") 

                # check for the merging of duplicate resources/names
                if mergeCheck:
                    if self.checksum in newPackage.resources:
                        log.warn("this Resource \"" + self._storageName
                            + "\" already exists in the "
                            + "destination merge package")
                        # Be careful, though, as it might have assumed a
                        # different name in the destination .elp:
                        existing_name = newPackage.resources[self.checksum][0]\
                                ._storageName
                        if self._storageName == existing_name:
                            log.warn(".... and shares the same name.  easy!")
                        else:
                            log.warn(".... but Resource \"" 
                                    + self._storageName
                                    + "\" was called \"" + existing_name
                                    + "\" in the destination"
                                    + " package.")
                            # go ahead and run through the "rename" anyhow,
                            # one which will rename it to the existing name:
                            from exe.engine.appletidevice import AppletIdevice
                            if not isinstance(self._idevice, AppletIdevice):
                                self.renameForMerging(newPackage)
                            else:
                                log.error("Unable to merge duplicate resource "
                                    + "with different name in iDevice = "
                                    + repr(self._idevice)
                                    + ", Node = " 
                                    + self._idevice.parentNode.title
                                    + ", name: \""
                                    + self.storageName
                                    + "\", and original name = \""
                                    + existing_name + "\".")
                                # and, as with the below....
                                # Allow the log.error to list EACH and EVERY
                                # problem duplicate-name resource BEFORE
                                # actually throwing the exception below,
                                # during the isMerge (and not mergeCheck)

                    else: 
                        # ensure a unique name in the merged package: 
                        this_res = newPackage.findResourceByName(
                                self.storageName)
                        if this_res is not None \
                        and self.storageName == this_res.storageName:
                            log.warn("merging into package that already"
                                + " has another resource of this name.")
                            # when trying to merge in a duplicate-name resource,
                            # ensure that it is part of an iDevice that we
                            # CAN properly update all occurrences:
                            from exe.engine.appletidevice import AppletIdevice
                            if not isinstance(self._idevice, AppletIdevice):
                                self.renameForMerging(newPackage)
                            else:
                                log.error("Unable to merge duplicate resource "
                                        + "name in iDevice = "
                                        + repr(self._idevice)
                                        + ", Node = " 
                                        + self._idevice.parentNode.title
                                        + ", name: \""
                                        + self.storageName
                                        + "\".")
                                # Allow the log.error to list EACH and EVERY
                                # problem duplicate-name resource BEFORE
                                # actually throwing the exception below,
                                # during the isMerge (and not mergeCheck)

                # continue check for the merging of duplicate resource names
                elif isMerge:
                    # either of the above two log.error cases, once they
                    # have printed out all of the log messages during the 
                    # the mergeCheck pass.  Now in the final isMerge pass,
                    # go ahead and terminate the process with an exception:
                    if (self.checksum in newPackage.resources \
                    and self.storageName != \
                    newPackage.resources[self.checksum][0]._storageName) \
                    or ( not self.checksum in newPackage.resources \
                    and newPackage.findResourceByName(self.storageName) \
                    is not None):
                        # Merely throw the exception here:
                        # all handle-able duplicate resource names
                        # are already taken care of above, during the mergeCheck
                        # where the warnings have already been logged for
                        # any and ALL non-handle-able ones.
                        # i.e., all problem resources are now listed in the log,
                        # so it's reasonable to stop the merge with an exception
                        #
                        # @ least for now, include the specific Java Applet info
                        # since it is the ONLY iDevice unable to handle this.
                        raise Exception(_(u"Unable to merge: duplicate Java Applet resource names exist (including: \"" + self.storageName + "\"). Please see the log file for the names of ALL such problem resources."))



                # launch zombie check for Resources,
                # to be done AFTER the all objects have been updated....
                #
                if not mergeCheck: 
                    # first pass test, to see if a potential zombie resource
                    # and to fix it if not, but don't delete it quite yet,
                    # but call it a second time after going through all other
                    # resources....
                    # (for random timing issues in loading resources, etc.)
                    if base.__dict__.has_key("launch_testForZombies"): 
                        method = base.__dict__.get("launch_testForZombies") 
                        method(self)



            elif repr(base) == "<class 'exe.engine.node.Node'>":
                # print out the elp objects:
                if not mergeCheck: 
                    log.debug("LOADING NODE = \"" + self.getTitle() + "\", "
                         + "nodeId=" + str(self.getId()) + ", @ \"" 
                         + str(id(self)) + "\"")
                #
                # Note: some VERY old and corrupt packages have come in that
                # don't even have the proper ._package attribute, nor ._id,
                # or ._title, etc.  So ensure that the node at least has that:
                if hasattr(self, '_package') \
                and newPackage is not None and self._package != newPackage:
                    if isMerge and self._package != preMergePackage:
                        # This appears to be a corrupt Node.
                        # Refer them to the standard LOAD procedure
                        # to fix the elp before trying to MERGE:
                        log.error("Old package: unable to "
                                + "relink old Node (w/ wrong package) "
                                + repr(self)
                                + " to new merge package. "
                                + " Please upgrade package first!")
                        #  May want to include the package name here:
                        raise Exception(_(u"Package is old. Please upgrade it (using File..Open followed by File..Save As) before attempting to insert it into another package!"))
                    elif not isMerge:
                        # swap to a proper package on Nodes, IF the current
                        # package is NOT the one that we're really using:

                        log.debug("TRY relinking Node \""+ self.getTitle() 
                            + "\""  +" to new package." 
                            + " (and zombie check will later confirm it)") 
                        self._package = newPackage

                # launch zombie check for Nodes,
                # to be done AFTER the all objects have been updated....
                #
                if not mergeCheck: 
                    if base.__dict__.has_key("launch_testForZombies"): 
                        method = base.__dict__.get("launch_testForZombies") 
                        method(self)

            elif repr(base)=="<class 'exe.engine.package.Package'>":
                # print out the elp objects:
                if not mergeCheck: 
                    log.debug("LOADING PACKAGE = \"" + self._name + "\"")
                #
                # see here if this package is the same as the newPackage
                if newPackage is not None and self != newPackage:
                    if not mergeCheck:
                        log.debug("ignoring old Package object \"" 
                            + self._name + "\" " + repr(self))

            elif repr(base)=="<class 'exe.engine.field.Field'>":
                # do not normally print out each field object (way too many).
                # but DO check its ID, to find the largest current field id #:
                if not mergeCheck: 
                    # Beware: some of the initial objects are not ints,
                    # but strings, and have an ._id with "#_##"
                    # even though its _id should JUST be the ## field id.
                    if type(self._id) is int:
                        this_id = self._id
                    else:
                        found_under = self._id.find('_')
                        if found_under >= 0:
                            this_id = (int)(self._id[found_under+1:])
                        else:
                            this_id = (int)(self._id)
                    if this_id > G.application.maxFieldId:
                        G.application.maxFieldId = this_id 
                #
            #
            # end of bogus-extraction support (with new merging support!)
            # but note that a mergeCheck will now continue on through,
            # since merge will not be used if any object upgrades required:
            ################################# 

            # ugly hack, but it's what the user expects, really
            if (Versioned not in base.__bases__ and
                not base.__dict__.has_key('persistenceVersion')):
                continue
            currentVers = base.persistenceVersion
            pverName = '%s.persistenceVersion' % reflect.qual(base)
            persistVers = (self.__dict__.get(pverName) or 0)
            if persistVers:
                if not mergeCheck: 
                    del self.__dict__[pverName]
            assert persistVers <=  currentVers, x_("Either your idevices/generic.data file or the package you are loading was created with a newer version of eXe.  Please upgrade eXe and try again.")
            while persistVers < currentVers:
                persistVers = persistVers + 1
                method = base.__dict__.get('upgradeToVersion%s' % persistVers, None)
                if method:
                    if mergeCheck or isMerge: 
                        log.error("Old package with updates necessary:"
                                + " unable to insert.  " 
                                + " Please upgrade package first!") 
                        #  May want to include the package name here: 
                        raise Exception(_(u"Package is old. Please upgrade it (using File..Open followed by File..Save As) before attempting to insert it into another package!"))

                    log.debug( "Upgrading " + reflect.qual(base) + " (of " \
                            +  reflect.qual(self.__class__) + " @ " \
                            +  str(id(self)) + ") to version " \
                            + str(persistVers) )
                    method(self)
                else:
                    if not mergeCheck: 
                        log.debug( 'no upgrade method for ' \
                               + reflect.qual(base)\
                               + ' to version ' + str(persistVers) )


            # new eXe re-persistence handler to be called here after any and 
            # all upgrades of this base class, but, BEFORE any registered
            # afterUpgradeHandlers, which occur after ALL the object upgrades.
            # (Note: persistenceVersion must be defined to even make it here)
            if not mergeCheck: 
                if base.__dict__.has_key("TwistedRePersist"): 
                    method = base.__dict__.get("TwistedRePersist") 
                    method(self)

