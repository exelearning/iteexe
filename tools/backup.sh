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
DBNAME=mantis
DBUSER=root
DBPASS=""
MOIN=/local/web/moin/reptilehouse

mkdir -p $TOP/$YYMMDD

# Backup the Subversion repositories
for REPO in $SVNPARENT/*; do
    if [ -d $REPO ]; then
        echo $REPO
        $SVNTOOLS/backup/hot-backup.py $REPO $TOP/$YYMMDD
    fi
done

# Backup the database (Mantis)
cd $TOP/$YYMMDD
mysqldump --add-drop-table -e -u$DBUSER $DBNAME > db$YYMMDD.sql
gzip db$YYMMDD.sql

# Backup the wiki (Reptile House)
cd $MOIN
tar cjvf $TOP/$YYMMDD/moin$YYMMDD.tar.bz2 data
