#!/bin/sh

cd exe/locale || { echo "run tools/cleani18n.sh from top level exe directory"; exit 1 ; }

svn status | awk '/^\?/ { print $2 }' | xargs rm -r
