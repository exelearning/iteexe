# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
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

class HtmlToText(object):
  
  def __init__(self, html):
    self.html = html
    
  def convertToText(self):
    lastch = ""
    text   = ""
    whitespace = (' ', '\t', '\n' '\r')
    inBrackets = False
    for ch in self.html:
      if ch == "<":
        inBrackets = True
      elif inBrackets:
        if ch == ">":
          inBrackets = False
        elif ch.lower() == "p" and lastch == "<":
          text += "\r\n\r\n"
      elif not (lastch in whitespace and ch in whitespace):         
        text += ch
      lastch = ch
    text = text.replace('&nbsp;','')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')
    return text
    
    
  
