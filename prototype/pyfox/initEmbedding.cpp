#include <Python.h>
#include <nsEmbedAPI.h>
#include <nscore.h>
#include <nsDependentString.h>
#include <assert.h>
void doInitEmbedding();

/* Use the code below as a template for the implementation class for this interface. */

/* Header file */
class MyDirServiceProvider : public nsIDirectoryServiceProvider
{
 public:
    NS_DECL_ISUPPORTS
        NS_DECL_NSIDIRECTORYSERVICEPROVIDER

        MyDirServiceProvider();

 private:
    virtual ~MyDirServiceProvider();

 protected:
    /* additional members */
};

/* Implementation file */
NS_IMPL_ISUPPORTS1(MyDirServiceProvider, nsIDirectoryServiceProvider)

MyDirServiceProvider::MyDirServiceProvider()
{
}

MyDirServiceProvider::~MyDirServiceProvider()
{
}

/* nsIFile getFile (in string prop, out PRBool persistent); */
NS_IMETHODIMP MyDirServiceProvider::GetFile(const char *prop, 
                                            PRBool *persistent, 
                                            nsIFile **_retval)
{
    return NS_ERROR_NOT_IMPLEMENTED;
}

/* End of implementation class template. */


static PyObject * initEmbedding(PyObject *self, PyObject *args) 
{
    const char *filename;

    if (!PyArg_ParseTuple(args, "s", &filename)) {
        return NULL;
    }

    doInitEmbedding();

    // return the address to the LocalFile 
    return Py_None;
}

void doInitEmbedding()
{
    const char* path = "/home/djm/uoa/firefox/mozilla/dist/firefox";
    nsCOMPtr<nsILocalFile> mreAppDir;
    nsresult rv;
    //    rv = NS_NewNativeLocalFile(nsDependentCString(T2A(path)), TRUE, getter_AddRefs(mreAppDir));
    rv = NS_NewNativeLocalFile(nsDependentCString(path), PR_TRUE, 
                               getter_AddRefs(mreAppDir));
    NS_ASSERTION(NS_SUCCEEDED(rv), "failed to create mreAppDir localfile");

    // Take a look at 
    // http://www.mozilla.org/projects/xpcom/file_locations.html
    // for more info on File Locations
    MyDirServiceProvider *provider = new MyDirServiceProvider;
    assert(provider);

    rv = NS_InitEmbedding(mreAppDir, provider);
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
