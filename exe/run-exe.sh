#!/bin/sh

# eXe
# Copyright 2004-2005, University of Auckland

# Just sets LD_LIBRARY_PATH before starting eXe

export LD_LIBRARY_PATH=/usr/lib/mozilla-1.7.8
python $(dirname $0)/exe
