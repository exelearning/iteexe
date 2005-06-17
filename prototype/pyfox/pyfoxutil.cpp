#include <Python.h>
#include <nsEmbedAPI.h>
#include <nscore.h>
#include <nsDependentString.h>
#include <assert.h>
#include <iostream>
#include <iomanip>
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
    PyObject* baseWindow;
    int hNativeWindow;
    int x;
    int y;
    int width;
    int height;

    if (!PyArg_ParseTuple(args, "Oiiiii", &baseWindow, &hNativeWindow, 
                          &x, &y, &width, &height)) {
        return NULL;
    }

    cout << hex << baseWindow << endl;
    cout << hex << hNativeWindow << endl;
    cout << x << ", " << y << endl;
    
    nsIBaseWindow* browserWindow = NULL;
    Py_nsISupports convertor(*baseWindow);
    Py_nsISupports::InterfaceFromPyObject(baseWindow,
                                          NS_GET_IID(nsIBaseWindow),
                                          &browserWindow,
                                          PR_FALSE);

    // NB: nativeWindow is just void*
    browserWindow->InitWindows((nativeWindow)hNativeWindow, nsnull, 
                               x, y, width, height);

    // return the address to the LocalFile 
    return Py_None;
}

void doInitWindow(PyObject* baseWindow, int hNativeWindow, 
                  int x, int y, int width, int height)
{
}

// Set up the method table. 
static PyMethodDef _pyfoxutil_methods[] = {
    {"initEmbedding", initEmbedding, METH_VARARGS, "Initialize embedding"},
    {"initWindow",    initWindow,    METH_VARARGS, "Initialize native window"},
    {NULL, NULL, 0, NULL},
};

// This function must be named "init" + <modulename> Because the module is
// "_pyfoxuntil" the function is "init_pyfoxutil"
PyMODINIT_FUNC init_pyfoxutil(void) 
{
    (void)Py_InitModule("_pyfoxutil", _pyfoxutil_methods);
}
