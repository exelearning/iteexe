var err = initInstall("Dictionnaire Dicollecte Classique", "fr-classique@dictionaries.addons.mozilla.org", "3.9.5");
if (err != SUCCESS)
    cancelInstall();

var fProgram = getFolder("Program");
err = addDirectory("", "fr-classique@dictionaries.addons.mozilla.org",
		   "dictionaries", fProgram, "dictionaries", true);
if (err != SUCCESS)
    cancelInstall();

performInstall();
