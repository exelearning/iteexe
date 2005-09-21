#!/bin/bash

# ===========================================================================
# backup.sh
# Copyright 2004, D J Moore (info@linuxsoftware.co.nz)
# ===========================================================================
set -x

SVNTOOLS=/usr/share/doc/subversion-1.2.1/tools/
SVNPARENT=/svn
TOP=/local/backup
YYMMDD=$(date "+%y%m%d")
DBUSER=root
DBPASS=""
MOIN=/local/web/moin/reptilehouse

mkdir -p $TOP/$YYMMDD

# Backup the Subversion repositories
#for REPO in $SVNPARENT/*; do
#    if [ -d $REPO ] && [ "$REPO" != "lost+found" ]; then
#        echo $REPO
#        $SVNTOOLS/backup/hot-backup.py $REPO $TOP/$YYMMDD
#        svnadmin dump $REPO
#        svnadmin dump /svn/$REPO > $REPO.$YYMMDD
#        gzip $REPO.$YYMMDD
#    fi
#done
/etc/init.d/httpd stop
cd $TOP/$YYMMDD
svnadmin dump /svn/exe > exe.$YYMMDD
gzip exe.$YYMMDD

# Backup the databases (drupal, mantis and exe)
mysqldump --add-drop-table -e -u$DBUSER drupal > drupal$YYMMDD.sql
gzip drupal$YYMMDD.sql
mysqldump --add-drop-table -e -u$DBUSER mantis > mantis$YYMMDD.sql
gzip mantis$YYMMDD.sql
mysqldump --add-drop-table -e -u$DBUSER exe > exe$YYMMDD.sql
gzip exe$YYMMDD.sql

# Backup the wiki (Reptile House)
cd $MOIN
tar cjvf $TOP/$YYMMDD/moin$YYMMDD.tar.bz2 data
/etc/init.d/httpd start

# Copy to another machine
scp -r $TOP/$YYMMDD getback@d.moore.cfdl.auckland.ac.nz:/local/backup

