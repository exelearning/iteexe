#!/bin/bash

# ===========================================================================
# backup.sh
# Copyright 2004, D J Moore (info@linuxsoftware.co.nz)
# ===========================================================================
set -x

SVNTOOLS=/usr/share/doc/subversion-1.1.1/tools/
SVNPARENT=/svn
TOP=/local/backup
YYMMDD=$(date "+%y%m%d")
DBUSER=root
DBPASS=""
MOIN=/local/web/moin/reptilehouse

mkdir -p $TOP/$YYMMDD

# Backup the Subversion repositories
for REPO in $SVNPARENT/*; do
    if [ -d $REPO ] && [ "$REPO" != "lost+found" ]; then
        echo $REPO
        $SVNTOOLS/backup/hot-backup.py $REPO $TOP/$YYMMDD
    fi
done

# Backup the databases (mantis and exe)
cd $TOP/$YYMMDD
mysqldump --add-drop-table -e -u$DBUSER mantis > mantis$YYMMDD.sql
gzip mantis$YYMMDD.sql
mysqldump --add-drop-table -e -u$DBUSER exe > exe$YYMMDD.sql
gzip exe$YYMMDD.sql

# Backup the wiki (Reptile House)
cd $MOIN
tar cjvf $TOP/$YYMMDD/moin$YYMMDD.tar.bz2 data

# Copy to another machine
scp -r $TOP/$YYMMDD getback@d.moore.cfdl.auckland.ac.nz:/local/backup

