#!/bin/sh
xgettext -L Python -o po/newFr.po page.py
xgettext -L Python -o po/newGe.po page.py
xgettext -L Python -o po/newCh.po page.py
msgmerge -U po/fr.po po/newfr.po
msgmerge -U po/ge.po po/newGe.po
msgmerge -U po/ch.po po/newCh.po
rm po/new*.po