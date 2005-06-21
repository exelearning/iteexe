/* -- THIS FILE IS GENERATED - DO NOT EDIT *//* -*- Mode: C; c-basic-offset: 4 -*- */

#ifndef gtkmoz_h__
#define gtkmoz_h__

#include <Python.h>               
#include <pygobject.h>
#include <gtk/gtk.h>
#include <gtkmozembed.h>

extern "C" {


/* ---------- forward type declarations ---------- */
//PyTypeObject PyGtkMozEmbed_Type;


/* ----------- GtkMozEmbed ----------- */

int
_wrap_gtk_moz_embed_new(PyGObject *self, PyObject *args, PyObject *kwargs);


PyObject *
_wrap_gtk_moz_embed_load_url(PyGObject *self, PyObject *args, PyObject *kwargs);

PyObject *
_wrap_gtk_moz_embed_stop_load(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_can_go_back(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_can_go_forward(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_go_back(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_go_forward(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_render_data(PyGObject *self, PyObject *args, PyObject *kwargs);

PyObject *
_wrap_gtk_moz_embed_open_stream(PyGObject *self, PyObject *args, PyObject *kwargs);

PyObject *
_wrap_gtk_moz_embed_append_data(PyGObject *self, PyObject *args, PyObject *kwargs);

PyObject *
_wrap_gtk_moz_embed_close_stream(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_get_link_message(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_get_js_status(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_get_title(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_get_location(PyGObject *self);

PyObject *
_wrap_gtk_moz_embed_reload(PyGObject *self, PyObject *args, PyObject *kwargs);

PyObject *
_wrap_gtk_moz_embed_set_chrome_mask(PyGObject *self, PyObject *args, PyObject *kwargs);

PyObject *
_wrap_gtk_moz_embed_get_chrome_mask(PyGObject *self);


/* ----------- functions ----------- */

PyObject *
_wrap_gtk_moz_embed_push_startup(PyObject *self);

PyObject *
_wrap_gtk_moz_embed_pop_startup(PyObject *self);

PyObject *
_wrap_gtk_moz_embed_set_comp_path(PyObject *self, 
                                  PyObject *args, 
                                  PyObject *kwargs);

PyObject *
_wrap_gtk_moz_embed_set_profile_path(PyObject *self, 
                                     PyObject *args, 
                                     PyObject *kwargs);


/* ----------- enums and flags ----------- */

void
gtkmoz_add_constants(PyObject *module, const gchar *strip_prefix);

void
gtkmoz_register_classes(PyObject *d);

}; // end extern "C"

#endif 
// gtkmoz_h__
