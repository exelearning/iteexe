#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor,
# Boston, MA  02110-1301, USA.
# ===========================================================================
"""
Functions that help with translation
We'll have three builtins:
_() translates a string into the language chosen in preferences
c_() for content strings, into the language of properties->package
x_() for late translation
"""

# Install x_() as the fake/late translate mechanism before doing any serious
# importing
__builtins__['x_'] = lambda x: x


def lateTranslate(propName, content=False):
    """
    Given a property name, returns a read/write property that is translated
    every time it is read
    Parameter 'content' and c_() added by Pedro Peña 2012-05-22.
    c_() function to translate 'content strings', into the language
    chosen at properties->package
    """
    propName = '_%s' % propName

    def set_prop(self, value):
        """
        Used to write the property
        """
        # return lambda self, value: setattr(self, propName, value)
        transFunc = c_ if content else _
        if (not hasattr(self, propName)
                or transFunc(getattr(self, propName)) != value):
            setattr(self, propName, value)

    def get_prop(self):
        """
        Translates a property value on the fly
        """
        value = getattr(self, propName)
        # Don't try to translate empty strings
        if value:
            transFunc = c_ if content else _
            return transFunc(value)
        else:
            return value
    return property(get_prop, set_prop)


def installSafeTranslate():
    """
    Makes '_' do safe translating
    Assumes '_' is already installed as the normal translate method
    """
    def checkInstall():
        return __builtins__['_'] is installSafeTranslate

    if checkInstall():
        return
    else:
        __builtins__['__old_translate__'] = __builtins__['_']
        __builtins__['_'] = safeTranslate


def safeTranslate(message, encoding='utf-8'):
    """
    Safely translates a string
    """
    # Allow translating from foreign strings
    # Had a prob, trying to translate the "purpose"
    # of an idevice from Spanish to Spanish. Unicode couldn't
    # decode the accents, because it was assuming that it was
    # in ASCII codec
    if message == "":
        return message
    try:
        return __old_translate__(message)
    except UnicodeDecodeError, e:
        try:
            return __old_translate__(unicode(message, encoding))
        except Exception:
            raise e
