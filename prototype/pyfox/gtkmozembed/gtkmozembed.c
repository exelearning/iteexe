/* -- THIS FILE IS GENERATED - DO NOT EDIT *//* -*- Mode: C; c-basic-offset: 4 -*- */

#include <Python.h>



#line 4 "gtkmozembed.override"
#include <Python.h>

#include "pygobject.h"
#include <gtkmozembed.h>

#line 14 "gtkmozembed.c"


/* ---------- types from other modules ---------- */
static PyTypeObject *_PyGObject_Type;
#define PyGObject_Type (*_PyGObject_Type)
static PyTypeObject *_PyGtkObject_Type;
#define PyGtkObject_Type (*_PyGtkObject_Type)
static PyTypeObject *_PyGtkBin_Type;
#define PyGtkBin_Type (*_PyGtkBin_Type)


/* ---------- forward type declarations ---------- */
PyTypeObject PyGtkMozEmbed_Type;


/* ----------- GtkMozEmbed ----------- */

static int
_wrap_gtk_moz_embed_new(PyGObject *self, PyObject *args, PyObject *kwargs)
{
    GType obj_type = pyg_type_from_object((PyObject *) self);
    static char* kwlist[] = { NULL };

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, ":gtkmozembed.MozEmbed.__init__", kwlist))
        return -1;

    self->obj = g_object_newv(obj_type, 0, NULL);
    if (!self->obj) {
        PyErr_SetString(PyExc_RuntimeError, "could not create %(typename)s object");
        return -1;
    }

    pygobject_register_wrapper((PyObject *)self);
    return 0;
}


static PyObject *
_wrap_gtk_moz_embed_load_url(PyGObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "url", NULL };
    char *url;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "s:GtkMozEmbed.load_url", kwlist, &url))
        return NULL;
    gtk_moz_embed_load_url(GTK_MOZ_EMBED(self->obj), url);
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_stop_load(PyGObject *self)
{
    gtk_moz_embed_stop_load(GTK_MOZ_EMBED(self->obj));
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_can_go_back(PyGObject *self)
{
    int ret;

    ret = gtk_moz_embed_can_go_back(GTK_MOZ_EMBED(self->obj));
    return PyBool_FromLong(ret);

}

static PyObject *
_wrap_gtk_moz_embed_can_go_forward(PyGObject *self)
{
    int ret;

    ret = gtk_moz_embed_can_go_forward(GTK_MOZ_EMBED(self->obj));
    return PyBool_FromLong(ret);

}

static PyObject *
_wrap_gtk_moz_embed_go_back(PyGObject *self)
{
    gtk_moz_embed_go_back(GTK_MOZ_EMBED(self->obj));
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_go_forward(PyGObject *self)
{
    gtk_moz_embed_go_forward(GTK_MOZ_EMBED(self->obj));
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_render_data(PyGObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "data", "len", "base_uri", "mime_type", NULL };
    char *data, *base_uri, *mime_type;
    PyObject *py_len = NULL;
    gulong len;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "sO!ss:GtkMozEmbed.render_data", kwlist, &data, &PyLong_Type, &py_len, &base_uri, &mime_type))
        return NULL;
    len = PyLong_AsUnsignedLong(py_len);
    gtk_moz_embed_render_data(GTK_MOZ_EMBED(self->obj), data, len, base_uri, mime_type);
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_open_stream(PyGObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "base_uri", "mime_type", NULL };
    char *base_uri, *mime_type;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "ss:GtkMozEmbed.open_stream", kwlist, &base_uri, &mime_type))
        return NULL;
    gtk_moz_embed_open_stream(GTK_MOZ_EMBED(self->obj), base_uri, mime_type);
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_append_data(PyGObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "data", "len", NULL };
    char *data;
    PyObject *py_len = NULL;
    gulong len;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "sO!:GtkMozEmbed.append_data", kwlist, &data, &PyLong_Type, &py_len))
        return NULL;
    len = PyLong_AsUnsignedLong(py_len);
    gtk_moz_embed_append_data(GTK_MOZ_EMBED(self->obj), data, len);
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_close_stream(PyGObject *self)
{
    gtk_moz_embed_close_stream(GTK_MOZ_EMBED(self->obj));
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_get_link_message(PyGObject *self)
{
    gchar *ret;

    ret = gtk_moz_embed_get_link_message(GTK_MOZ_EMBED(self->obj));
    if (ret) {
        PyObject *py_ret = PyString_FromString(ret);
        g_free(ret);
        return py_ret;
    }
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_get_js_status(PyGObject *self)
{
    gchar *ret;

    ret = gtk_moz_embed_get_js_status(GTK_MOZ_EMBED(self->obj));
    if (ret) {
        PyObject *py_ret = PyString_FromString(ret);
        g_free(ret);
        return py_ret;
    }
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_get_title(PyGObject *self)
{
    gchar *ret;

    ret = gtk_moz_embed_get_title(GTK_MOZ_EMBED(self->obj));
    if (ret) {
        PyObject *py_ret = PyString_FromString(ret);
        g_free(ret);
        return py_ret;
    }
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_get_location(PyGObject *self)
{
    gchar *ret;

    ret = gtk_moz_embed_get_location(GTK_MOZ_EMBED(self->obj));
    if (ret) {
        PyObject *py_ret = PyString_FromString(ret);
        g_free(ret);
        return py_ret;
    }
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_reload(PyGObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "flags", NULL };
    int flags;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "i:GtkMozEmbed.reload", kwlist, &flags))
        return NULL;
    gtk_moz_embed_reload(GTK_MOZ_EMBED(self->obj), flags);
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_set_chrome_mask(PyGObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "flags", NULL };
    PyObject *py_flags = NULL;
    gulong flags;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "O!:GtkMozEmbed.set_chrome_mask", kwlist, &PyLong_Type, &py_flags))
        return NULL;
    flags = PyLong_AsUnsignedLong(py_flags);
    gtk_moz_embed_set_chrome_mask(GTK_MOZ_EMBED(self->obj), flags);
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_get_chrome_mask(PyGObject *self)
{
    gulong ret;

    ret = gtk_moz_embed_get_chrome_mask(GTK_MOZ_EMBED(self->obj));
    return PyLong_FromUnsignedLong(ret);
}

static PyMethodDef _PyGtkMozEmbed_methods[] = {
    { "load_url", (PyCFunction)_wrap_gtk_moz_embed_load_url, METH_VARARGS|METH_KEYWORDS },
    { "stop_load", (PyCFunction)_wrap_gtk_moz_embed_stop_load, METH_NOARGS },
    { "can_go_back", (PyCFunction)_wrap_gtk_moz_embed_can_go_back, METH_NOARGS },
    { "can_go_forward", (PyCFunction)_wrap_gtk_moz_embed_can_go_forward, METH_NOARGS },
    { "go_back", (PyCFunction)_wrap_gtk_moz_embed_go_back, METH_NOARGS },
    { "go_forward", (PyCFunction)_wrap_gtk_moz_embed_go_forward, METH_NOARGS },
    { "render_data", (PyCFunction)_wrap_gtk_moz_embed_render_data, METH_VARARGS|METH_KEYWORDS },
    { "open_stream", (PyCFunction)_wrap_gtk_moz_embed_open_stream, METH_VARARGS|METH_KEYWORDS },
    { "append_data", (PyCFunction)_wrap_gtk_moz_embed_append_data, METH_VARARGS|METH_KEYWORDS },
    { "close_stream", (PyCFunction)_wrap_gtk_moz_embed_close_stream, METH_NOARGS },
    { "get_link_message", (PyCFunction)_wrap_gtk_moz_embed_get_link_message, METH_NOARGS },
    { "get_js_status", (PyCFunction)_wrap_gtk_moz_embed_get_js_status, METH_NOARGS },
    { "get_title", (PyCFunction)_wrap_gtk_moz_embed_get_title, METH_NOARGS },
    { "get_location", (PyCFunction)_wrap_gtk_moz_embed_get_location, METH_NOARGS },
    { "reload", (PyCFunction)_wrap_gtk_moz_embed_reload, METH_VARARGS|METH_KEYWORDS },
    { "set_chrome_mask", (PyCFunction)_wrap_gtk_moz_embed_set_chrome_mask, METH_VARARGS|METH_KEYWORDS },
    { "get_chrome_mask", (PyCFunction)_wrap_gtk_moz_embed_get_chrome_mask, METH_NOARGS },
    { NULL, NULL, 0 }
};

PyTypeObject PyGtkMozEmbed_Type = {
    PyObject_HEAD_INIT(NULL)
    0,					/* ob_size */
    "gtkmozembed.MozEmbed",			/* tp_name */
    sizeof(PyGObject),	        /* tp_basicsize */
    0,					/* tp_itemsize */
    /* methods */
    (destructor)0,	/* tp_dealloc */
    (printfunc)0,			/* tp_print */
    (getattrfunc)0,	/* tp_getattr */
    (setattrfunc)0,	/* tp_setattr */
    (cmpfunc)0,		/* tp_compare */
    (reprfunc)0,		/* tp_repr */
    (PyNumberMethods*)0,     /* tp_as_number */
    (PySequenceMethods*)0, /* tp_as_sequence */
    (PyMappingMethods*)0,   /* tp_as_mapping */
    (hashfunc)0,		/* tp_hash */
    (ternaryfunc)0,		/* tp_call */
    (reprfunc)0,		/* tp_str */
    (getattrofunc)0,	/* tp_getattro */
    (setattrofunc)0,	/* tp_setattro */
    (PyBufferProcs*)0,	/* tp_as_buffer */
    Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,                      /* tp_flags */
    NULL, 				/* Documentation string */
    (traverseproc)0,	/* tp_traverse */
    (inquiry)0,		/* tp_clear */
    (richcmpfunc)0,	/* tp_richcompare */
    offsetof(PyGObject, weakreflist),             /* tp_weaklistoffset */
    (getiterfunc)0,		/* tp_iter */
    (iternextfunc)0,	/* tp_iternext */
    _PyGtkMozEmbed_methods,			/* tp_methods */
    0,					/* tp_members */
    0,		       	/* tp_getset */
    NULL,				/* tp_base */
    NULL,				/* tp_dict */
    (descrgetfunc)0,	/* tp_descr_get */
    (descrsetfunc)0,	/* tp_descr_set */
    offsetof(PyGObject, inst_dict),                 /* tp_dictoffset */
    (initproc)_wrap_gtk_moz_embed_new,		/* tp_init */
    (allocfunc)0,           /* tp_alloc */
    (newfunc)0,               /* tp_new */
    (freefunc)0,             /* tp_free */
    (inquiry)0              /* tp_is_gc */
};



/* ----------- functions ----------- */

static PyObject *
_wrap_gtk_moz_embed_push_startup(PyObject *self)
{
    gtk_moz_embed_push_startup();
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_pop_startup(PyObject *self)
{
    gtk_moz_embed_pop_startup();
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_set_comp_path(PyObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "aPath", NULL };
    char *aPath;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "s:gtk_moz_embed_set_comp_path", kwlist, &aPath))
        return NULL;
    gtk_moz_embed_set_comp_path(aPath);
    Py_INCREF(Py_None);
    return Py_None;
}

static PyObject *
_wrap_gtk_moz_embed_set_profile_path(PyObject *self, PyObject *args, PyObject *kwargs)
{
    static char *kwlist[] = { "aDir", "aName", NULL };
    char *aDir, *aName;

    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "ss:gtk_moz_embed_set_profile_path", kwlist, &aDir, &aName))
        return NULL;
    gtk_moz_embed_set_profile_path(aDir, aName);
    Py_INCREF(Py_None);
    return Py_None;
}

PyMethodDef pygtkmozembed_functions[] = {
    { "push_startup", (PyCFunction)_wrap_gtk_moz_embed_push_startup, METH_NOARGS },
    { "pop_startup", (PyCFunction)_wrap_gtk_moz_embed_pop_startup, METH_NOARGS },
    { "gtk_moz_embed_set_comp_path", (PyCFunction)_wrap_gtk_moz_embed_set_comp_path, METH_VARARGS|METH_KEYWORDS },
    { "gtk_moz_embed_set_profile_path", (PyCFunction)_wrap_gtk_moz_embed_set_profile_path, METH_VARARGS|METH_KEYWORDS },
    { NULL, NULL, 0 }
};


/* ----------- enums and flags ----------- */

void
pygtkmozembed_add_constants(PyObject *module, const gchar *strip_prefix)
{
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_START", strip_prefix), GTK_MOZ_EMBED_FLAG_START);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_REDIRECTING", strip_prefix), GTK_MOZ_EMBED_FLAG_REDIRECTING);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_TRANSFERRING", strip_prefix), GTK_MOZ_EMBED_FLAG_TRANSFERRING);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_NEGOTIATING", strip_prefix), GTK_MOZ_EMBED_FLAG_NEGOTIATING);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_STOP", strip_prefix), GTK_MOZ_EMBED_FLAG_STOP);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_IS_REQUEST", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_REQUEST);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_IS_DOCUMENT", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_DOCUMENT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_IS_NETWORK", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_NETWORK);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_IS_WINDOW", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_WINDOW);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_STATUS_FAILED_DNS", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_DNS);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_STATUS_FAILED_CONNECT", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_CONNECT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_STATUS_FAILED_TIMEOUT", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_TIMEOUT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_STATUS_FAILED_USERCANCELED", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_USERCANCELED);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_RELOADNORMAL", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADNORMAL);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_RELOADBYPASSCACHE", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADBYPASSCACHE);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_RELOADBYPASSPROXY", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADBYPASSPROXY);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_RELOADBYPASSPROXYANDCACHE", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADBYPASSPROXYANDCACHE);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_RELOADCHARSETCHANGE", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADCHARSETCHANGE);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_DEFAULTCHROME", strip_prefix), GTK_MOZ_EMBED_FLAG_DEFAULTCHROME);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_WINDOWBORDERSON", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWBORDERSON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_WINDOWCLOSEON", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWCLOSEON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_WINDOWRESIZEON", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWRESIZEON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_MENUBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_MENUBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_TOOLBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_TOOLBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_LOCATIONBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_LOCATIONBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_STATUSBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_STATUSBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_PERSONALTOOLBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_PERSONALTOOLBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_SCROLLBARSON", strip_prefix), GTK_MOZ_EMBED_FLAG_SCROLLBARSON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_TITLEBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_TITLEBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_EXTRACHROMEON", strip_prefix), GTK_MOZ_EMBED_FLAG_EXTRACHROMEON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_ALLCHROME", strip_prefix), GTK_MOZ_EMBED_FLAG_ALLCHROME);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_WINDOWRAISED", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWRAISED);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_WINDOWLOWERED", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWLOWERED);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_CENTERSCREEN", strip_prefix), GTK_MOZ_EMBED_FLAG_CENTERSCREEN);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_DEPENDENT", strip_prefix), GTK_MOZ_EMBED_FLAG_DEPENDENT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_MODAL", strip_prefix), GTK_MOZ_EMBED_FLAG_MODAL);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_OPENASDIALOG", strip_prefix), GTK_MOZ_EMBED_FLAG_OPENASDIALOG);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_EMBED_FLAG_OPENASCHROME", strip_prefix), GTK_MOZ_EMBED_FLAG_OPENASCHROME);

  if (PyErr_Occurred())
    PyErr_Print();
}

/* initialise stuff extension classes */
void
pygtkmozembed_register_classes(PyObject *d)
{
    PyObject *module;

    if ((module = PyImport_ImportModule("gobject")) != NULL) {
        PyObject *moddict = PyModule_GetDict(module);

        _PyGObject_Type = (PyTypeObject *)PyDict_GetItemString(moddict, "GObject");
        if (_PyGObject_Type == NULL) {
            PyErr_SetString(PyExc_ImportError,
                "cannot import name GObject from gobject");
            return;
        }
    } else {
        PyErr_SetString(PyExc_ImportError,
            "could not import gobject");
        return;
    }
    if ((module = PyImport_ImportModule("gtk")) != NULL) {
        PyObject *moddict = PyModule_GetDict(module);

        _PyGtkObject_Type = (PyTypeObject *)PyDict_GetItemString(moddict, "Object");
        if (_PyGtkObject_Type == NULL) {
            PyErr_SetString(PyExc_ImportError,
                "cannot import name Object from gtk");
            return;
        }
        _PyGtkBin_Type = (PyTypeObject *)PyDict_GetItemString(moddict, "Bin");
        if (_PyGtkBin_Type == NULL) {
            PyErr_SetString(PyExc_ImportError,
                "cannot import name Bin from gtk");
            return;
        }
    } else {
        PyErr_SetString(PyExc_ImportError,
            "could not import gtk");
        return;
    }


#line 470 "gtkmozembed.c"
    pygobject_register_class(d, "GtkMozEmbed", GTK_TYPE_MOZ_EMBED, &PyGtkMozEmbed_Type, Py_BuildValue("(O)", &PyGtkBin_Type));
}
