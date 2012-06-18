// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================

Ext.define('eXe.model.Directory', {
    extend: 'eXe.model.filepicker.File',
    fields: [
        {name: "text"},
        {name: "cls"},
        {name: "size"},
        {name: "type"},
        {name: "modified"},
        {name: "perms"},
        {name: "icon"},
        {name: "owner"},
        {name: "is_deletable"},
        {name: "is_file"},
        {name: "is_archive"},
        {name: "is_writable"},
        {name: "is_chmodable"},
        {name: "is_readable"},
        {name: "is_deletable"},
        {name: "is_editable"}
    ]
});