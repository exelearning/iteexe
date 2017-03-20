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
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================
"""
Functions that help with translation
"""

# Install x_ as the fake/late translate mechanism before doing any serious
# importing
__builtins__['x_'] = lambda x: x


def lateTranslate(propName, content=False):
    """
    Given a property name, returns a read/write property that is translated
    every time it is read
    """
    propName = '_%s' % propName
    def set_prop(self, value):
        """
        Used to write the property
        """
        transFunc = c_ if content else _
        if not hasattr(self, propName) or transFunc(getattr(self, propName)) != value:
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

