#!/usr/bin/python
#-*- coding: UTF-8 -*-
import Cookie, time, sys, traceback, os
import cgi, string
from os.path import exists

#the script to deal with login request#
logincgi = 'login.pyg'

host =  os.environ.get( 'HTTP_HOST', '' )
if not host:
	host =  os.environ.get( 'SERVER_NAME', 'localhost' )
	port = os.environ.get( 'SERVER_PORT', '80' )

#the password file for eXe login, should move to config later#
exepasswdfile = "/home/djm/work/exe/exepasswd"

def islogin( form, referer="" ):
	""" return u_id if login; otherwise return 0"""
	u_id=0
	if form.has_key("session_id"):
	
		if ( form.has_key("logout") ):
			delete_session( form["session_id"].value )
		else:
			u_id = fetch_username( form["session_id"].value, referer )
	else:
		u_id = read_client_cookie( "u_id" ) 
	
	return u_id
	
def require_login(message="", referer=""):
	if referer == "":
		referer= host + "/python/eXe/start.pyg"
				
	print """
	<html>
	<head><meta HTTP-EQUIV="Pragma" CONTENT="no-cache"><meta HTTP-EQUIV="Expires" CONTENT="-1"></head>
	<body>
	%s<p>
	<form action=%s method=post>
	Please input your name and password:<p>
	User Name:<input type=text name=user value="test"><p>
	Password:<input type=password name=passwd value="test"><p>
	<input type=hidden name=referer value="%s">
	<input type=submit name=checklogin value="Login"><input type=reset>
	</form>
	</body></head></html>
	""" %( message, logincgi, referer )


def read_client_cookie( searchkey ):
	c = Cookie.SimpleCookie( os.environ.get("HTTP_COOKIE") )
	if c.has_key( searchkey ):
		return c[searchkey].value
	else:
		return 0
		

def fetch_username( session_id, referer="" ):
	
	session_file = "/var/tmp/%s" % session_id
	if exists(session_file):
		fp = open( session_file , "r" ) 
		line = fp.readline()
		fp.close()
		pair = string.split( line, ":")
		return pair[1]
	else:
		require_login( "Oop, session id not exist! Please login again" , referer )

def create_session( id ):
	import time,whrandom,md5
	"""Build a new Session ID"""
	t1 = time.time()
	time.sleep( whrandom.random() )
	t2 = time.time()
	base = md5.new( id + str(t1 +t2) )
	sid = id + '_' + base.hexdigest()
	session_file = open( "/var/tmp/%s" %sid , 'a' )
	session_file.write( "u_id:%s" % id )
	session_file.close()
	return sid
		
def checklogin( form ):
	#print "Enter check login"
	result = 0
	if ( form.has_key( "user" ) and form.has_key("passwd") ):
		if exists( exepasswdfile ):
			fp = open( exepasswdfile , "r" ) 
			for line in fp:
				line = string.strip(line)
				pair = string.split( line, ":")
				#print "%s:%s<p>" %( pair[0], pair[1])
				#print "%s:%s<p>" %( form["user"].value, form["passwd"].value)
				if ( (pair[0] == form["user"].value) and (pair[1]== form["passwd"].value) ):
					result = 1
					break
			fp.close()
			if result:
				#setup the session id#
				""" #session for python is not yet ready for implement#
				session_id = create_session( form["user"].value )
				if form["referer"].value.find( "?" )  ==-1:
					form["referer"].value += "?session_id=%s" % session_id
				else:
					form["referer"].value += "&session_id=%s" % session_id
				"""
				#setup the cookie and return to original referer
				c = Cookie.SimpleCookie()
				c["u_id"] = form["user"].value
				print c.output()
				print "Location:%s\n\n" %(form["referer"].value)
		else:
			print "Error, user password file not exist. Please contact the web administrator"
	else:
		if form.has_key("referer"):
			referer=form["referer"].value
		else:
			referer=""
		require_login("Either username or password incorrect, please login again!", referer )
	
#####################################################################################
if __name__=="__main__":
	
	
	query = cgi.FieldStorage()
	if query.has_key( "checklogin" ):
		checklogin( query )
	else:
		print "Content-type:text/html"
		print
		require_login()
