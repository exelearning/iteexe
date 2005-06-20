#include <Python.h>
#include <nsEmbedAPI.h>
#include <nscore.h>
#include <nsDependentString.h>
#include <nsIBaseWindow.h>
#include <assert.h>
#include <PyXPCOM_std.h>
#include <iostream>
#include <iomanip>
#include <nsIWidget.h>
#include <nsIWebBrowser.h>
#include <nsIWebBrowserListener.h>
#include <nscore.h>
using namespace std;

void doInitEmbedding(const char* path);

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
    nsresult rv = NS_OK;
    nsCOMPtr<nsIWebBrowserListener> listenerI = do_QueryInterface(webBrowserSupports, &rv);
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to call QueryInterface for nsIWebBrowserListener");

    // Get a weak reference to the listener
    nsWeakPtr weakling (dont_AddRef(NS_GetWeakReference(NS_STATIC_CAST, 
                       (nsIWebBrowserListener*, webBrowserI))));
    void webBrowserI->AddWebBrowserListener(weakling, NS_GET_IID(nsIWebProgressListener));
}


// Set up the method table. 
static PyMethodDef _pyfoxutil_methods[] = {
    {"initEmbedding", initEmbedding, METH_VARARGS, "Initialize embedding"},
    {"initWindow",    initWindow,    METH_VARARGS, "Initialize native window"},
    {NULL, NULL, 0, NULL},
};

// This function must be named "init" + <modulename> Because the module is
// "_pyfoxutil" the function is "init_pyfoxutil"
PyMODINIT_FUNC init_pyfoxutil(void) 
{
    (void)Py_InitModule("_pyfoxutil", _pyfoxutil_methods);
}
