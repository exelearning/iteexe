var err = initInstall("United States English Dictionary", "en-us@dictionaries.addons.mozilla.org", "2.0.0.1");
if (err != SUCCESS)
    cancelInstall();

var fProgram = getFolder("Program");
err = addDirectory("", "en-US@dictionaries.addons.mozilla.org",
		   "dictionaries", fProgram, "dictionaries", true);
if (err != SUCCESS)
    cancelInstall();

performInstall();