#include <Python.h>
#include <nsEmbedAPI.h>
#include <nscore.h>
#include <nsDependentString.h>
#include <nsIBaseWindow.h>
#include <assert.h>
#include <PyXPCOM_std.h>
#include <iostream>
#include <iomanip>
#include <nsIWebBrowser.h>
#include <nsIWebNavigation.h>
#include <nsIWebProgressListener.h>
#include <nsIWidget.h>
#include <nsIURI.h>
#include <gtkmozembed.h>
#include <gtkmozembed_internal.h>
#include "gtkmoz.h"

using namespace std;

void doInitEmbedding(const char* path);

static PyObject *_wrap_gtk_moz_get_nsIWebBrowser(PyGObject *self) 
{ 
    cerr << "Calling _wrap_gtk_moz_get_nsIWebBrowser";
    cerr << "\n";
    nsIWebBrowser* pWebBrowser = NULL;
    cerr << "Calling gtk_moz_embed_get_nsIWebBrowser";
    cerr << "\n";
    NS_ASSERTION(self->obj, "obj is null");
	NS_PRECONDITION(self!=NULL, "null result pointer in PyXPCOM_NSGetModule!");
	NS_PRECONDITION(self->obj!=NULL, "null result pointer in PyXPCOM_NSGetModule!");
    gtk_moz_embed_get_nsIWebBrowser(GTK_MOZ_EMBED(self->obj), &pWebBrowser);
    NS_ASSERTION(pWebBrowser, "pWebBrowser is null");
	NS_PRECONDITION(pWebBrowser!=NULL, "null result pointer in PyXPCOM_NSGetModule!");

    cerr << "Initing Type";
    cerr << "\n";
    Py_nsISupports::InitType();
    cerr << "Converting";
    cerr << "\n";
    cerr << "Getting nsiSupports";
    cerr << "\n";
    nsresult rv;
    //nsCOMPtr<nsISupports> webBrowserSupports = do_QueryInterface(pWebBrowser, &rv);
    nsISupports* webBrowserSupports = NULL;
    rv = pWebBrowser->QueryInterface(NS_GET_IID(nsISupports), (void**)&webBrowserSupports);
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to get nsISupports");
    //nsCOMPtr<nsIWebNavigation> webNav = do_QueryInterface(pWebBrowser, &rv);
    //nsIWebNavigation * webNav = do_QueryInterface(pWebBrowser, &rv);
    //NS_ASSERTION(NS_SUCCEEDED(rv), "failed to get web nav");
    //cerr << "Got WebNavigation Interface";
    //cerr << "\n";
    //nsCOMPtr<nsIURI> uri;
    //rv = webNav->GetCurrentURI(getter_AddRefs(uri));
    //NS_ASSERTION(NS_SUCCEEDED(rv), "failed to get current uri");
    //cerr << "Got URI";
    //cerr << "\n";
    //cerr << uri;
    //cerr << "\n";
    //nsCAutoString uristr;
    //rv = uri->GetAsciiSpec(uristr);
    //NS_ASSERTION(NS_SUCCEEDED(rv), "failed to get ascii spec");
    //cerr << uristr.get();
    //cerr << "\n";
    //cerr << pWebBrowser;
    //cerr << "\n";
    //cerr << webBrowserSupports;
    //cerr << "\n";
    //nsCOMPtr<nsISupports> webBrowserGlobal = NULL;
    //nsISupports *webBrowserGlobal = NULL;

    cerr << webBrowserSupports;
    cerr << "\n";
    PyObject *result = NULL;
    //cerr << "Converting\n";
    /*
    result = Py_nsISupports::PyObjectFromInterface(webBrowserSupports,
                                                   NS_GET_IID(nsISupports),
                                                   PR_FALSE,
                                                   PR_TRUE);
    cerr << "Converted\n";
    */
    cerr << "Wrapping\n";
    result = Py_nsISupports::PyObjectFromInterface(webBrowserSupports,
                                                 NS_GET_IID(nsISupports),
                                                 PR_FALSE,
                                                 PR_FALSE);
    cerr << "Wrapped\n";
    return result;
}

// initEmbedding takes the path to the firefox dist directory
// e.g. /home/djm/uoa/firefox/mozilla/dist/firefox
static PyObject * initEmbedding(PyObject *self, PyObject *args) 
{
    const char *path;

    if (!PyArg_ParseTuple(args, "s", &path)) {
        return NULL;
    }

    doInitEmbedding(path);

    // return the address to the LocalFile 
    return Py_None;
}

void doInitEmbedding(const char* path)
{
    nsCOMPtr<nsILocalFile> mreAppDir;

    nsresult rv = NS_NewNativeLocalFile(nsDependentCString(path), PR_TRUE, 
                                        getter_AddRefs(mreAppDir));
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to create mreAppDir localfile");

    // Take a look at 
    // http://www.mozilla.org/projects/xpcom/file_locations.html
    // for more info on File Locations

    rv = NS_InitEmbedding(mreAppDir, nsnull);
    assert(NS_SUCCEEDED(rv));
}

// initEmbedding takes the path to the firefox dist directory
// e.g. /home/djm/uoa/firefox/mozilla/dist/firefox
static PyObject * initWindow(PyObject *self, PyObject *args) 
{
    PyObject* webBrowser;
    int hNativeWindow;
    int x;
    int y;
    int width;
    int height;

    cerr << "Starting...\n";

    if (!PyArg_ParseTuple(args, "Oiiiii", &webBrowser, &hNativeWindow, 
                          &x, &y, &width, &height)) {
        return NULL;
    }

    nsISupports* webBrowserSupports = NULL;
    Py_nsISupports::InterfaceFromPyObject(webBrowser,
                                          NS_GET_IID(nsIBaseWindow),
                                          &webBrowserSupports,
                                          PR_FALSE);
    nsresult rv = NS_OK;
    nsCOMPtr<nsIBaseWindow> baseWindow = do_QueryInterface(webBrowserSupports, &rv);
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to call QueryInterface for nsIBaseWindow");

    // NB: nativeWindow is just void*
    //baseWindow->InitWindow((nativeWindow)hNativeWindow, nsnull, x, y, width, height);
    cerr << "Calling InitWindow\n";
    rv = baseWindow->InitWindow(nsNativeWidget(hNativeWindow), nsnull, x, y, width, height);
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to call InitWindow");
    cerr << "Called Init Window OK\n";
    //rv = baseWindow->Create();
    //NS_ASSERTION(NS_SUCCEEDED(rv), "failed to call Create");
    //cerr << "Created Window OK\n";

    cerr << "Showing window\n";
    baseWindow->SetVisibility(PR_TRUE);
    cerr << "Window Showing\n";
    cerr << "Can't you see it?\n";

    return Py_None;
}

static PyObject * addListener(PyObject *self, PyObject *args) 
{
    PyObject* webBrowser;
    PyObject* listener;

    if (!PyArg_ParseTuple(args, "OO", &webBrowser, &listener)) {
        return NULL;
    }

    // Get each of the com objects
    nsISupports* webBrowserSupports = NULL;
    Py_nsISupports::InterfaceFromPyObject(webBrowser,
                                          NS_GET_IID(nsIBaseWindow),
                                          &webBrowserSupports,
                                          PR_FALSE);
    nsresult rv = NS_OK;
    nsCOMPtr<nsIWebBrowser> webBrowserI = do_QueryInterface(webBrowserSupports, &rv);
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to call QueryInterface for nsIWebBrowser");

    nsISupports* listenerSupports = NULL;
    Py_nsISupports::InterfaceFromPyObject(listener,
                                          NS_GET_IID(nsIBaseWindow),
                                          &webBrowserSupports,
                                          PR_FALSE);
    nsCOMPtr<nsIWebProgressListener> listenerI = do_QueryInterface(webBrowserSupports, &rv);
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to call QueryInterface for nsIWebProgressListener");

    // Get a weak reference to the listener
    nsWeakPtr weakling (dont_AddRef(NS_GetWeakReference(NS_STATIC_CAST(nsIWebProgressListener*, listenerI))));
    webBrowserI->AddWebBrowserListener(weakling, NS_GET_IID(nsIWebProgressListener));
}


// Set up the method table. 
static PyMethodDef _pyromonkey_methods[] = {
    {"initEmbedding", initEmbedding, METH_VARARGS, "Initialize embedding"},
    {"initWindow",    initWindow,    METH_VARARGS, "Initialize native window"},
    {"addListener",   addListener,   METH_VARARGS, "(webBrowser, nsIWebProgressListener implementation)"},
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
    { "get_xpcom_browser", (PyCFunction)_wrap_gtk_moz_get_nsIWebBrowser, METH_NOARGS },
    { NULL, NULL, 0 }
};


PyMethodDef _pyromonkey_functions[] = {
    { "gtk_moz_embed_push_startup", (PyCFunction)_wrap_gtk_moz_embed_push_startup, METH_NOARGS },
    { "gtk_moz_embed_pop_startup", (PyCFunction)_wrap_gtk_moz_embed_pop_startup, METH_NOARGS },
    { "gtk_moz_embed_set_comp_path", (PyCFunction)_wrap_gtk_moz_embed_set_comp_path, METH_VARARGS|METH_KEYWORDS },
    { "gtk_moz_embed_set_profile_path", (PyCFunction)_wrap_gtk_moz_embed_set_profile_path, METH_VARARGS|METH_KEYWORDS },
    { NULL, NULL, 0 }
};


PyTypeObject PyroMonkey_Type = {
    PyObject_HEAD_INIT(NULL)
    0,					/* ob_size */
    "_pyromonkey.PyroMonkey",			/* tp_name */
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
    _pyromonkey_methods,			/* tp_methods */
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

/* ---------- types from other modules ---------- */
static PyTypeObject *_PyGObject_Type;
#define PyGObject_Type (*_PyGObject_Type)
static PyTypeObject *_PyGtkBin_Type;
#define PyGtkBin_Type (*_PyGtkBin_Type)


/* initialise stuff extension classes */
void
pyromonkey_register_classes(PyObject *d)
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

    pygobject_register_class(d, "PyroMonkey", GTK_TYPE_MOZ_EMBED, &PyroMonkey_Type, Py_BuildValue("(O)", &PyGtkBin_Type));
}

void
pyromonkey_add_constants(PyObject *module, const gchar *strip_prefix)
{
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_START", strip_prefix), GTK_MOZ_EMBED_FLAG_START);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_REDIRECTING", strip_prefix), GTK_MOZ_EMBED_FLAG_REDIRECTING);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_TRANSFERRING", strip_prefix), GTK_MOZ_EMBED_FLAG_TRANSFERRING);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_NEGOTIATING", strip_prefix), GTK_MOZ_EMBED_FLAG_NEGOTIATING);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_STOP", strip_prefix), GTK_MOZ_EMBED_FLAG_STOP);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_IS_REQUEST", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_REQUEST);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_IS_DOCUMENT", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_DOCUMENT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_IS_NETWORK", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_NETWORK);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_IS_WINDOW", strip_prefix), GTK_MOZ_EMBED_FLAG_IS_WINDOW);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_STATUS_FAILED_DNS", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_DNS);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_STATUS_FAILED_CONNECT", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_CONNECT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_STATUS_FAILED_TIMEOUT", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_TIMEOUT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_STATUS_FAILED_USERCANCELED", strip_prefix), GTK_MOZ_EMBED_STATUS_FAILED_USERCANCELED);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_RELOADNORMAL", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADNORMAL);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_RELOADBYPASSCACHE", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADBYPASSCACHE);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_RELOADBYPASSPROXY", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADBYPASSPROXY);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_RELOADBYPASSPROXYANDCACHE", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADBYPASSPROXYANDCACHE);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_RELOADCHARSETCHANGE", strip_prefix), GTK_MOZ_EMBED_FLAG_RELOADCHARSETCHANGE);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_DEFAULTCHROME", strip_prefix), GTK_MOZ_EMBED_FLAG_DEFAULTCHROME);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_WINDOWBORDERSON", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWBORDERSON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_WINDOWCLOSEON", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWCLOSEON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_WINDOWRESIZEON", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWRESIZEON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_MENUBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_MENUBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_TOOLBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_TOOLBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_LOCATIONBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_LOCATIONBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_STATUSBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_STATUSBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_PERSONALTOOLBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_PERSONALTOOLBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_SCROLLBARSON", strip_prefix), GTK_MOZ_EMBED_FLAG_SCROLLBARSON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_TITLEBARON", strip_prefix), GTK_MOZ_EMBED_FLAG_TITLEBARON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_EXTRACHROMEON", strip_prefix), GTK_MOZ_EMBED_FLAG_EXTRACHROMEON);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_ALLCHROME", strip_prefix), GTK_MOZ_EMBED_FLAG_ALLCHROME);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_WINDOWRAISED", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWRAISED);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_WINDOWLOWERED", strip_prefix), GTK_MOZ_EMBED_FLAG_WINDOWLOWERED);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_CENTERSCREEN", strip_prefix), GTK_MOZ_EMBED_FLAG_CENTERSCREEN);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_DEPENDENT", strip_prefix), GTK_MOZ_EMBED_FLAG_DEPENDENT);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_MODAL", strip_prefix), GTK_MOZ_EMBED_FLAG_MODAL);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_OPENASDIALOG", strip_prefix), GTK_MOZ_EMBED_FLAG_OPENASDIALOG);
    PyModule_AddIntConstant(module, pyg_constant_strip_prefix("GTK_MOZ_FLAG_OPENASCHROME", strip_prefix), GTK_MOZ_EMBED_FLAG_OPENASCHROME);

  if (PyErr_Occurred())
    PyErr_Print();
}

// This function must be named "init" + <modulename> Because the module is
// "_pyromonkey" the function is "init_pyromonkey"
/*PyMODINIT_FUNC init_pyromonkey(void) 
{
    (void)Py_InitModule("_pyromonkey", _pyromonkey_methods);
}
*/
PyMODINIT_FUNC init_pyromonkey(void)
{
    PyObject *m, *dict;
    
    init_pygobject();

    m = Py_InitModule("_pyromonkey", _pyromonkey_functions);
    dict = PyModule_GetDict (m);

    pyromonkey_add_constants(m, "GTK_MOZ_");

    pyromonkey_register_classes(dict);

    if (PyErr_Occurred ()) {
        Py_FatalError("");
    }
}
