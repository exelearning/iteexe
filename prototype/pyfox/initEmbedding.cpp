#include <Python.h>
#include <nsEmbedAPI.h>
#include <nscore.h>
#include <nsDependentString.h>
#include <assert.h>
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


// Set up the method table. 
static PyMethodDef _initEmbedding_methods[] = {
    {"initEmbedding", initEmbedding, METH_VARARGS, "Initialize embedding"},
    {NULL, NULL, 0, NULL},
};

// This function must be named "init" + <modulename> Because the module is
// "_initEmbedding" the function is "init_initEmbedding"
PyMODINIT_FUNC init_initEmbedding(void) 
{
    (void)Py_InitModule("_initEmbedding", _initEmbedding_methods);
}
