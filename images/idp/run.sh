#!/bin/bash

rm /var/run/apache2/* -rf

exec apache2ctl -D FOREGROUND
