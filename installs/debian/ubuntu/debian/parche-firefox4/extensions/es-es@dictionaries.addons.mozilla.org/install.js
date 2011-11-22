const APP_NAME			= "Diccionario de Español/España";
const APP_PACKAGE		= "es-es@dictionaries.addons.mozilla.org";
const APP_VERSION		= "1.5";

var err = initInstall(APP_NAME, APP_PACKAGE, APP_VERSION);
if (err != SUCCESS)
    cancelInstall();

var fProgram = getFolder("Program");
err = addDirectory("", "es-es@dictionaries.addons.mozilla.org",
		   "dictionaries", fProgram, "dictionaries", true);
if (err != SUCCESS)
    cancelInstall();

performInstall();
