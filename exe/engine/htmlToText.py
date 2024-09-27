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
import os
import re
from html.entities import name2codepoint

class HtmlToText(object):
  
  def __init__(self, html):
    self.html = html
    
  def convertToText(self):
    
    lastch = ""
    text   = ""
    tag    = ""
    whitespace = (' ', '\t', '\n' '\r')
    inBrackets = False
    for ch in self.html:
      if ch == "<":
        inBrackets = True
        tag = ch
      elif inBrackets:
        tag += ch
        if ch == ">":
          inBrackets = False
          if tag.lower() == "<br/>":
              text += os.linesep
        elif ch.lower() == "p" and lastch == "<":
          text += os.linesep * 2
      elif not (lastch in whitespace and ch in whitespace):         
        text += ch
      lastch = ch
      
    text = self.unescape(text)
    #text = text.replace('&nbsp;','')
    #text = text.replace('&lt;', '<')
    #text = text.replace('&gt;', '>')
    #text = text.replace('&quot;', '"')
    return text
  
  def unescape(self, data):
      """
      convert html entitydefs into unicode characters
      """
      chunks = re.split("&(#?\w+);", data)
      for i in range(1, len(chunks), 2):
          if chunks[i] in name2codepoint:
              chunks[i] = chr(name2codepoint[chunks[i]])
          elif re.match("#\d+$", chunks[i]):
              chunks[i] = chr(int(chunks[i][1:]))
          elif re.match("#x[0-9a-fA-F]+$", chunks[i]):
              chunks[i] = chr(int(chunks[i][2:], 16))
      return "".join(chunks)
    
    
  
