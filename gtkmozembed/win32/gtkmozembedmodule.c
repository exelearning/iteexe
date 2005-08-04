#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

/* include this first, before NO_IMPORT_PYGOBJECT is defined */
#include <pygobject.h>

#include <stdlib.h>
#include <stdio.h>

void pygtkmozembed_register_classes (PyObject *d);
void pygtkmozembed_add_constants(PyObject *module, const gchar *strip_prefix);

extern PyMethodDef pygtkmozembed_functions[];

DL_EXPORT(void)
initgtkmozembed(void)
{
    PyObject *m, *d;

    init_pygobject();

	m = Py_InitModule ("gtkmozembed", pygtkmozembed_functions);
	d = PyModule_GetDict (m);

	pygtkmozembed_register_classes (d);
	pygtkmozembed_add_constants(m, "GTK_MOZ_EMBED_");

	if (PyErr_Occurred ()) {
        Py_FatalError ("can't initialise module gtkmozembed");
    }
}
