from os.path import exists
from os import mkdir
from os import rename
from urllib import quote
from cgi import escape
from string import strip
from course import course
from storage import Storage
from Cheetah.Template import Template
from xmlreader import readConfig
from xml.dom.ext.reader.Sax2 import FromXmlFile
import jaxml

courseForm     = "/var/www/html/python/courses1/course_template.html" 
topicForm      = "/var/www/html/python/courses1/topic_template.html" 
sectionForm    = "/var/www/html/python/courses1/section_template.html" 
unitForm    = "/var/www/html/python/courses1/unit_template.html"

course_content_template = "/var/www/html/python/courses1/course_content_template.html"
topic_content_template = "/var/www/html/python/courses1/topic_content_template.html"
section_content_template = "/var/www/html/python/courses1/section_content_template.html"

coursexmlfile  = "/var/www/html/python/courses1/courses.xml"
coursexmltemplate = "/var/www/html/python/courses1/courses_template.xml"

topicxmlfilename = "topics.xml"
sectionxmlfilename = "sections.xml"
unitxmlfilename = "units.xml"

doc_root       = "/var/www/html/python/courses1/"
startcgi = "/python/courses1/start1.pyg"

class CourseManager:
	"""Manages courses for the web page.
	
	Responsible for creating, loading, saving, and displaying courses."""
	def __init__( self ):
		self.reset()
		
	def reset( self ):
		self.title = ""
		self.shorttitle = ""
		self.identifier = ""
		self.graphic = ""
		#self.author = ""
		#self.contributor = ""
		self.description = ""
		self.course_topicxmlfile = ""
		self.course_sectionxmlfile = ""
		##keep the flexibility for future to create dict automatically from reading through xml template file#
		self.read_course_dict()
		
		#self.dict = { "title":"", "shorttitle":"", "graphic":"", "identifier":"", "description":"" }
		self.topic_dict = { "courseidentifier":"","name":"", "graphic":"","identifier":"", "description":"" }
		self.section_dict = { "courseidentifier":"","topicidentifier":"", "value":"", "graphic":"","identifier":"", "description":"" }	
		self.unit_dict = { "courseidentifier":"","topicidentifier":"","sectionidentifier":"", "value":"", "graphic":"","identifier":"", "description":"" }	
	
	def read_course_dict(self):
		self.dict = {}
		doc = readConfig( coursexmltemplate )
		for item in doc["general"]:
			self.dict[item] = ""
			
	def showallcourse( self ):
		"""Read the courses.xml and display their link to the course homepage"""
		print "<p>All Courses<br><br>"
		if exists( coursexmlfile):
						
			doc = readConfig( coursexmlfile )
			try:		
				#show course template can be put here
				for node in doc["courses"]:
					print '<br><a href="start1.pyg?cmd=view_course&identifier=%s">%s</a>\
					&nbsp;<a href="start1.pyg?cmd=up_course&identifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
					<a href="start1.pyg?cmd=down_course&identifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
					<a href="start1.pyg?cmd=edit_course&identifier=%s">edit course info</a>&nbsp;\
					<a href="start1.pyg?cmd=delete_course&identifier=%s">delete course</a>&nbsp;\
					<br>\n' % (  node["identifier"] ,  node["title"], \
								 node["identifier"],\
								 node["identifier"],\
								 node["identifier"],\
								 node["identifier"]  )
			except:
				print "File cannot open"

	def view_course( self, form ):
		"""Take an course file name as a parameter and creates and displays an course object for it"""
		try:
			course_identifier = form["identifier"].value
			self.get_course_detail( course_identifier )
		except:
			pass
		#get the course topics#
		self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/' + topicxmlfilename	
		self.show_course_content()
	
	def show_course_content(self):
		#Write HTML fo browser (standard output), read from template file+Cheetah		
		if exists( course_content_template ):
			FormHandle = open(course_content_template, "r")
			FormInput = FormHandle.read()
			FormHandle.close()
			t = Template( FormInput, searchList=[self.dict] )
			print t
			print '<center><br><a href="start.pyg?cmd=edit_topic&identifier=%s">Add a new topic</a></center><br>\n' %(self.dict["identifier"])	
			self.show_course_topics( )
		else:
			print "template file:%s not exist"  %course_content_template
	
	def xml_string( self, template_file, dict ):
		if exists( template_file ):
			FormHandle = open(template_file, "r")
			FormInput = FormHandle.read()
			FormHandle.close()
			t = Template( FormInput, searchList=[dict] )
			return str(t)
		else:
			print "template file:%s not exist"  %template_file
			
	def showaddcourse( self ):
		"""Displays the course posting form."""
		FormHandle = open(courseForm, "r")
		FormInput = FormHandle.read()
		FormHandle.close()
		t = Template( FormInput, searchList=[self.dict] )
		print t
		#print FormInput
		
	def get_course_detail( self, course_identifier ):
		if exists( coursexmlfile): 
			doc = readConfig( coursexmlfile )
			try:		
				for node in doc["courses"]:
					if node["identifier"] == course_identifier:
						for item in self.dict.keys():
							try:
								self.dict[item] = node[item].encode('utf-8')
							except:
								pass
						break
			except:
				print "Error!! Can't get course detail for course identifier %s" % (course_identifier)
				return
		
	def save_new_course( self, form ):
		"""Accept actual posted form data, creates identifier and update the courses.xml"""
		
		for item in self.dict:
			if item[:7]<>"graphic":
				try:
					self.dict[item]=escape(form[item].value).strip()
				except:
					pass
				
		if exists( coursexmlfile ):
			try:		
				doc = readConfig( coursexmlfile )
			except:
				doc = None
			
		#caculate the identifier for the course
		import locale
		maxidentifier = 0
		if exists( coursexmlfile ) and doc:				
			for node in doc["courses"]:
				t = locale.atoi( '%s' %( node["identifier"]) )
				if t > maxidentifier:
					maxidentifier = t
		self.dict["identifier"] = str( maxidentifier + 1 )
		"""
		#create identifier#
		tmpidentifier = doc_root  + self.dict["identifier"]
		
		if exists( tmpidentifier ) :
			print "Error, conflict while creating course identifier<br>\n"
			return
		else: 
			#create identifier
			try:
				mkdir( tmpidentifier )
				tmp_img_dir = tmpidentifier + '/images/'
				mkdir( tmp_img_dir )
			except:
				print "Error while creating course identifier %s" %( tmpidentifier)
			#create the course_name.xml from template somewhere
			
		#read course picture if file uploaded#
		graphic_file = ""
		try:		
			fs = form["graphic"]
			if fs.file and fs.filename<>"": 
				import tempfile
				tmpfile = tempfile.mktemp()
				#print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break		
				f.close()	
				#copy tmpfile to topic identifierectory
				targetfile = tmp_img_dir + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					graphic_file = fs.filename
					self.dict["graphic"] = graphic_file
				except:
					print "Error while creating upload file"
			else:
				pass
		except:
			pass
		"""
		#put new course data into courses.xml=> add node#
		self.save_course_file( action="add" )

		self.showallcourse()
	
	def save_course_file( self, action ):
		##create courses.xml file
		"""
		x = jaxml.XML_document()
		x.courses(multiple="true")
		"""
		x = '<?xml version="1.0" encoding="iso-8859-1"?>\n<courses multiple="true">'

		if exists( coursexmlfile ):
			doc = readConfig( coursexmlfile )			
			if action == "up" or action == "down":
				found = 0
				index = 0
				for node in doc["courses"]:
					index = index + 1
					if node["identifier"] == self.dict["identifier"]:
						found = index
						
				if found == 0:
					print "Sorry, this course identifier %s is not found <br>\n" % ( course_identifier )
					return
				elif action == "up" and found == 1: 
					#the node is the first node, so can not move upward#
					print "First course can not move upward <br>\n"
					return				
				elif action =="down":
					if found == index:
						print "Last course can not move upward <br>\n"
						return
		
			i = 1
			try:				
				for node in doc["courses"]:
					if action == "update" and node["identifier"]==self.dict["identifier"]:
						t = self.xml_string( coursexmltemplate, self.dict )
						print t
						x = x + t
						"""
						x._push()				
						x.general()
						x.title( '%s' %(self.dict["title"] ) ) 
						x.shorttitle( '%s' %(self.dict["shorttitle"] ) ) 
						x.graphic( '%s' %(self.dict["graphic"] ) ) 
						x.identifier( '%s' %(self.dict["identifier"] ) ) 
						x.description( '%s' %(self.dict["description"] ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						"""
					elif action=="delete" and node["identifier"]==self.dict["identifier"]:
						i = i + 1
						continue
					elif ( action=="up" and i==(found-1) ) or (action=="down" and i==found ) :
							#the previous node, save for next usage
							up_t = self.xml_string( coursexmltemplate, node )
							#print up_t
							"""
							up_title = node["title"]
							up_shorttitle = node["shorttitle"]
							up_graphic = node["graphic"]
							up_identifier = node["identifier"]
							up_description = node["description"].encode('utf-8')
							"""
					elif ( action=="up" and i == found ) or ( action=="down" and i ==(found+1) ):
						down_t = self.xml_string( coursexmltemplate, node )
						print down_t
						print up_t
						x = x + down_t + up_t
						"""
						tmp_description = node["description"].encode('utf-8')
						x._push()				
						x.general()
						x.title( '%s' %(node["title"] ) ) 
						x.shorttitle( '%s' %(node["shorttitle"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %(escape(tmp_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						
						x._push()				
						x.general()
						x.title( '%s' %(up_title ) ) 
						x.shorttitle( '%s' %(up_shorttitle ) ) 
						x.graphic( '%s' %(up_graphic) ) 
						x.identifier( '%s' %(up_identifier ) ) 
						x.description( '%s' %(escape(up_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						"""

					else: 
						t = self.xml_string( coursexmltemplate, self.dict )
						print t
						x = x + t
						"""
						tmp_description = node["description"].encode('utf-8')
						x._push()				
						x.general()
						x.title( '%s' %(node["title"] ) ) 
						x.shorttitle( '%s' %(node["shorttitle"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %(escape(tmp_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						"""
					i = i + 1
			except:
				pass
		if action == "add":
			t = self.xml_string( coursexmltemplate, self.dict )
			print t
			x = x + t
			"""
			x.general()
			x.title( '%s' %(self.dict["title"]) )
			x.shorttitle( '%s' %(self.dict["shorttitle"]) )
			x.identifier( '%s' %(self.dict["identifier"]) )
			x.graphic( '%s' %(self.dict["graphic"]) )
			x.description( '%s' %(self.dict["description"]) )
			x.language( 'en' )
			x._push()
			x.aggregationlevel()
			x._push()
			x.source()
			x.langstring( "LOMv1.0",  xml_lang="x-none"  )
			x._pop()
			x._push()
			x.value()
			x.langstring( "3" , xml_lang="x-none"  )
			x._pop()
			x._pop()
			x._pop()
			"""
		#backup first#
		
		try:
			coursexmlfile_dst = doc_root + '/.courses.xml_' + action + self.dict["identifier"]
			import shutil
			shutil.copyfile( coursexmlfile, coursexmlfile_dst )
		except:
			pass
		"""
		try:
		
			x._output( coursexmlfile )
		except:
		"""
		#data = "" + x.__str__()
		x = x + "\n</courses>"
		f = open( coursexmlfile ,"w" )
		f.write( "%s" %x )
		f.flush()
		f.close
		
	def update_course( self, form ):
		"""Accept actual posted form data, creates identifier and update the courses.xml"""
		if exists( coursexmlfile ):
			try:		
				doc = readConfig( coursexmlfile )
			except:
				doc = None
		
		for item in self.dict:
			if item[:7]<>"graphic":
				try:
					self.dict[item]=escape(form[item].value).strip()
				except:
					pass
			#else:
			#	self.dict[item] = form[item].value
			#	new_graphic = "new_" + item
			#	self.graphic_upload( item, )
		#read course picture if file uploaded#
		self.dict["graphic"] = form["graphic"].value
		graphic_file = ""
		try:		
			fs = form["new_graphic"]
			if fs.file and fs.filename<>"": 
				import tempfile
				tmpfile = tempfile.mktemp()
				print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break		
				f.close()	
				#copy tmpfile to topic identifierectory
				targetfile = doc_root  + self.dict["identifier"] + "/images/" + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					graphic_file = fs.filename
					self.dict["graphic"] = graphic_file
				except:
					print "Error while creating upload file"
			else:
				pass
		except:
			pass

		self.save_course_file(action="update")
		self.view_course( form )
				
	def edit_course( self, form ):
		#read the course.xml and print out the topics
		course_identifier = form["identifier"].value
		self.get_course_detail( course_identifier )
		#show the course detail for edit if necessary
		print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> -> Course Information</H3><p>\n" % ( startcgi, self.dict["identifier"], self.dict["title"])
		self.showaddcourse()
		
	def delete_course( self, form ):
		"""delete the course info from courses.xml and delete the course identifier
		"""
		course_identifier = form["identifier"].value
		self.get_course_detail( course_identifier )
		
		#regenerate the courses.xml
		self.save_course_file( action="delete" )
		
		if course_identifier:
			rm_identifier = doc_root + course_identifier
			rm_identifier_dest = doc_root +'.' + course_identifier
			print "directory to be removed:%s" %rm_identifier
			print "directory to move to:%s" %rm_identifier_dest
			#try:
			#removedirs( rm_identifier )
			rename( rm_identifier, rm_identifier_dest )
			#except:
			#	pass
		#show all courses
		self.showallcourse()

		
	def up_course( self, form ):
		"""move up the course info from courses.xml
		"""
		#get the course identifier
		course_identifier = form["identifier"].value
		self.dict["identifier"] = course_identifier
		self.save_course_file( action="up")
		#show all courses
		self.showallcourse()
		
	def down_course( self, form ):
		"""mode down the course infor from coruses.xml
		"""
		#get the course identifier
		course_identifier = form["identifier"].value
		self.dict["identifier"] = course_identifier
		self.save_course_file( action="down")
		#show all courses
		self.showallcourse()
		
	"""
	##Topic 	##################################################################################
	##Topic 	##################################################################################
	##Topic 	##################################################################################
	"""		
	def get_topic_detail( self, topic_identifier ):
		"""given course identifier and topic_identifier to decide where and read the topics.xml		
		"""
		self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/' + topicxmlfilename
		#print "topicxmlfile: %s" %self.course_topicxmlfile
		if exists( self.course_topicxmlfile): 
			doc = readConfig( self.course_topicxmlfile )
			
		try:		
			for node in doc["topics"]:
				if node["identifier"] == topic_identifier:
					self.topic_dict["courseidentifier"]= self.dict["identifier"]
					self.topic_dict["name"] = node["name"]
					self.topic_dict["graphic"] = node["graphic"]
					self.topic_dict["identifier"] = node["identifier"]
					self.section_dict["topicidentifier"] = self.unit_dict["topicidentifier"] = self.topic_dict["identifier"]
					self.topic_dict["description"] = node["description"].encode('utf-8')
					break
		except:
			print "Error, can't get the detail of this topic"
	
	def view_topic( self, form ):
		"""Take an course file name as a parameter and creates and displays an course object for it"""
		if self.topic_dict["identifier"]=="" or self.dict["identifier"]=="":
			course_identifier = form["identifier"].value
			topic_identifier = form["topic_identifier"].value		
			self.get_course_detail( course_identifier )
			self.get_topic_detail( topic_identifier )
		else:
			self.get_topic_detail( self.topic_dict["identifier"] )
			#self.topic_dict["description"]=self.topic_dict["description"].encode('utf-8')
			
		print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> ->%s</H3><p>\n" % ( startcgi, self.identifier, self.title, self.topic_dict["name"])
		#get the course topics#
		#self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/' + topicxmlfilename
		self.show_topic_content()
	
	def show_topic_content(self):
		#Write HTML fo browser (standard output), read from template file+Cheetah		
		#print "<center><a href="start.pyg?cmd=edit_section&identifier=%s&topic_identifier=%s">edit section</a>&nbsp </center><br>\n"
		
		if exists( topic_content_template ):
			FormHandle = open(topic_content_template, "r")
			FormInput = FormHandle.read()
			FormHandle.close()
			t = Template( FormInput, searchList=[self.topic_dict] )
			print t
			print '<center><br><a href="start.pyg?cmd=edit_section&identifier=%s&topic_identifier=%s">Add a new section</a></center><br>\n' %(self.dict["identifier"], self.topic_dict["identifier"])	
			self.show_topic_sections( )
		else:
			print "template file:%s not exist"  %course_content_template
	
				
		
	def edit_topic( self, form ):
		#read the course information
		try:
			self.topic_dict["courseidentifier"] = form["identifier"].value
			self.get_course_detail( self.topic_dict["courseidentifier"] )		
		except:
			print "Error, cant get course detail of this topic"
			return
			
		#read topic form data into FormInput
		FormHandle = open(topicForm, "r")
		FormInput = FormHandle.read()
		FormHandle.close()		
		
		try:
			self.topic_dict[ "identifier" ] =  form["topic_identifier"].value
			#read from topicxmlfile to get topic information
			self.get_topic_detail( self.topic_dict[ "identifier" ] )
			print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> -><a href=%s?cmd=view_topic&identifier=%s&topic_identifier=%s> %s</a> ->Edit topic info</H3><p>\n" % ( startcgi, self.dict["identifier"], self.dict["title"], startcgi, self.dict["identifier"], self.topic_dict[ "identifier" ], self.topic_dict[ "name" ] )
		except:			
			print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> ->Add a new topics</H3><p>\n" % ( startcgi, self.dict["identifier"], self.dict["title"])
			#self.show_course_topics()
		t = Template( FormInput, searchList=[self.topic_dict] )
		# show the course_detail form		
		
		print t

	def show_course_topics( self ):
		
		if self.dict["identifier"]:
			topicxmlfile = doc_root + self.dict["identifier"] + '/topics.xml'
		else:
			print "Error while processing %s course topic <br>\n" % ( self.dict["title"] )
			return
		#print '<center><br><a href="start.pyg?cmd=edit_topic&identifier=%s">Add a new topic</a></center><br>\n' %(self.dict["identifier"])	
		if exists( topicxmlfile ):
						
			doc = readConfig( topicxmlfile )

			try:		
				for node in doc["topics"]:
					print '<br><a href="start.pyg?cmd=view_topic&identifier=%s&topic_identifier=%s">%s</a>\
					&nbsp;<a href="start.pyg?cmd=up_topic&identifier=%s&topic_identifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
					<a href="start.pyg?cmd=down_topic&identifier=%s&topic_identifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
					<a href="start.pyg?cmd=edit_topic&identifier=%s&topic_identifier=%s">edit topic</a>&nbsp;\
					<a href="start.pyg?cmd=delete_topic&identifier=%s&topic_identifier=%s">delete</a>&nbsp;\
					<br>\n' % ( self.dict["identifier"], node["identifier"],  node["name"], \
								self.dict["identifier"], node["identifier"],\
								self.dict["identifier"], node["identifier"],\
								self.dict["identifier"], node["identifier"],\
								self.dict["identifier"], node["identifier"]  )
			except:
				pass
			
				
	def save_new_topic(self, form):
		#read the course identifier#
		try: 
			self.dict["identifier"]  = form["courseidentifier"].value
			#read the course detail from courses.xml#
			self.get_course_detail( self.dict["identifier"] )
		except:
			print "Error! Can not find the identifier of the course"
			return
		
		#read topic name#
		try:
			self.topic_dict["name"] = form["name"].value
		except:
			print "Error! Please specify the topic"
			return
				
		#decide the identifier for the topic
		self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/' + topicxmlfilename
		
		import locale
		maxidentifier = 0
		if exists( self.course_topicxmlfile ):
			doc = readConfig( self.course_topicxmlfile )
			for node in doc["topics"]:
				t = locale.atoi( '%s' %( node["identifier"]) )
				if t > maxidentifier:
					maxidentifier = t
		maxidentifier = maxidentifier + 1
		self.topic_dict["identifier"] = str( maxidentifier )
		topic_dir = doc_root + self.dict["identifier"] + '/' + str( maxidentifier )
		topic_img_dir = doc_root + self.dict["identifier"] +'/images/' + str( maxidentifier )
		#create the dir for the topic
		try:
			mkdir( topic_dir )			
		except:
			print "Error while creating this topic directory %s" %( topic_dir)	
			return
		
		try:
			mkdir( topic_img_dir )
		except:
			print "Error while creating this topic images directory %s" %( topic_img_dir)	
			return

		
		try:	
			self.topic_dict["description"] = escape( form["description"].value )
			self.topic_dict["description"] = self.topic_dict["description"].strip()
		except:
			self.description = ""

		
		#read topic picture if file uploaded#		
		graphic_file = ""
		try:		
			fs = form["graphic"]
			if fs.file and fs.filename<>"": 
				import tempfile
				tmpfile = tempfile.mktemp()
				print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break		
				f.close()	
				#copy tmpfile to topic identifierectory
				targetfile = topic_img_dir + "/" + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					self.topic_dict["graphic"] = fs.filename
				except:
					print "Error while creating upload file"
			else:
				pass
			#print "filename: %s <br>\n" % (form["graphic"].headers)
			#print "tmpfilename: %s <br>\n" % (tmpfile)
			#move tmp file to 
		except:
			pass
		
		self.save_topic_file(action="add")
		self.view_course( form )
		#self.show_course_topics( )

	def save_topic_file( self, action ):
		##create courses.xml file
		x = jaxml.XML_document()
		x.topics(multiple="true")
		
		if exists( self.course_topicxmlfile ):
			doc = readConfig(  self.course_topicxmlfile )			
			if action == "up" or action == "down":
				found = 0
				index = 0
				for node in doc["topics"]:
					index = index + 1
					if node["identifier"] == self.topic_dict["identifier"]:
						found = index
						
				if found == 0:
					print "Sorry, this topic identifier %s is not found <br>\n" % ( self.topic_dict["identifier"] )
					return
				elif action == "up" and found == 1: 
					#the node is the first node, so can not move upward#
					print "First topic can not move upward <br>\n"
					return				
				elif action =="down":
					if found == index:
						print "Last topic can not move downward <br>\n"
						return
		
			i = 1
			try:				
				for node in doc["topics"]:
					if action == "update" and node["identifier"]==self.topic_dict["identifier"]:
						x._push()				
						x.topic()
						x.name( '%s' %(self.topic_dict["name"] ) ) 
						x.graphic( '%s' %(self.topic_dict["graphic"] ) ) 
						x.identifier( '%s' %(self.topic_dict["identifier"] ) ) 
						x.description( '%s' %(self.topic_dict["description"] ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
					elif action=="delete" and node["identifier"]==self.topic_dict["identifier"]:
						i = i + 1
						continue
					elif ( action=="up" and i==(found-1) ) or (action=="down" and i==found ) :
							#the previous node, save for next usage
							up_name = node["name"]
							up_graphic = node["graphic"]
							up_identifier = node["identifier"]
							up_description = node["description"].encode('utf-8')
					elif ( action=="up" and i == found ) or ( action=="down" and i ==(found+1) ):
						tmp_description = node["description"].encode('utf-8')
						x._push()				
						x.topic()
						x.name( '%s' %(node["name"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %(escape(tmp_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						
						x._push()				
						x.topic()
						x.name( '%s' %(up_name ) ) 
						x.graphic( '%s' %(up_graphic) ) 
						x.identifier( '%s' %(up_identifier ) ) 
						x.description( '%s' %(escape(up_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						

					else: 
						tmp_description = node["description"].encode('utf-8')
						x._push()				
						x.topic()
						x.name( '%s' %(node["name"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %(escape(tmp_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
					i = i + 1
			except:
				pass
		if action == "add":
			x.topic()
			x.name( '%s' %(self.topic_dict["name"]) )
			x.identifier( '%s' %(self.topic_dict["identifier"]) )
			x.graphic( '%s' %(self.topic_dict["graphic"]) )
			x.description( '%s' %(self.topic_dict["description"]) )
			x.language( 'en' )
			x._push()
			x.aggregationlevel()
			x._push()
			x.source()
			x.langstring( "LOMv1.0",  xml_lang="x-none"  )
			x._pop()
			x._push()
			x.value()
			x.langstring( "3" , xml_lang="x-none"  )
			x._pop()
			x._pop()
			x._pop()
				
		try:
			x._output( self.course_topicxmlfile )
		except:
			data = "" + x.__str__()
			f = open( self.course_topicxmlfile ,"w" )
			f.write( "%s" %str(data) )
			f.flush()
			f.close

				
	def update_topic(self, form):
		#read the course identifier#
		try: 
			self.dict["identifier"] =  self.topic_dict["courseidentifier"]=form["courseidentifier"].value
			#print "Course identifier: %s <br>\n"  % self.dict["identifier"]
			self.get_course_detail( self.dict["identifier"] )
		except:
			print "Error! Can not find the identifier of the course"
			return
			
		#read the topic identifier#
		try: 
			self.topic_dict["identifier"] = form["topicidentifier"].value
			#print "Topic identifier: %s <br>\n"  % self.topic_dict["identifier"]

		except:
			print "Error! Can not find the identifier of the topic"
			return

		#read topic title#
		try:
			self.topic_dict["name"] = form["name"].value
			#print "Title: %s <br>\n"  % self.topic_dict["name"]
		except:
			print "Error! Please specify the topic"
			return
				
		try:	
			self.topic_dict["description"] = escape( form["description"].value )
			self.topic_dict["description"] = self.topic_dict["description"].strip()
		except:
			self.description = ""
		#decide the identifier for the topic
		self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/' + topicxmlfilename
		#print "course_topicxmlfile : %s <br>\n" %( self.course_topicxmlfile )

		
		#read course picture if file uploaded#
		self.topic_dict["graphic"] = form["graphic"].value
		graphic_file = ""
		try:		
			fs = form["new_graphic"]
			if fs.file and fs.filename<>"": 
				import tempfile
				tmpfile = tempfile.mktemp()
				print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break		
				f.close()	
				#copy tmpfile to topic identifierectory
				targetfile = doc_root  + self.dict["identifier"] + "/images/" + self.topic_dict["identifier"]+ '/' + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					graphic_file = fs.filename
					self.topic_dict["graphic"] = graphic_file
				except:
					print "Error while creating upload file"
			else:
				pass
		except:
			pass
			
		self.save_topic_file(action="update")
		##show all the topics in the course
		#self.show_course_topics( )
		self.view_topic( form )
		
	def up_topic( self, form ):
		"""move up the topic info from topics.xml
		"""
		#get the course identifier
		self.dict["identifier"] = form["identifier"].value
		#print "Course identifier: %s <br>\n"  % course_identifier
		self.get_course_detail( self.dict["identifier"] )
		#print "get_course_detail and course identifier: %s\n" %(self.identifier)
		
		#get the topic identifier
		self.topic_dict["identifier"] = form["topic_identifier"].value
		#get_topic_detail(topic_identifier)
		self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/topics.xml'
		self.save_topic_file( action="up" )
		#self.show_course_topics( )
		self.view_course( form )
		
	def down_topic( self, form ):
		"""move down the topic info from topics.xml
		"""
		#get the course identifier
		self.dict["identifier"] = form["identifier"].value
		#print "Course identifier: %s <br>\n"  % course_identifier
		self.get_course_detail( self.dict["identifier"] )
		#print "get_course_detail and course identifier: %s\n" %(self.identifier)
		
		#get the topic identifier
		self.topic_dict["identifier"] = form["topic_identifier"].value
		self.get_topic_detail( self.topic_dict["identifier"] )
		#get_topic_detail(topic_identifier)
		self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/topics.xml'
		self.save_topic_file( action="down" )
		#show all courses
		#self.show_course_topics( )
		self.view_course( form )
	
	def delete_topic( self, form ):
		"""delete the course info from courses.xml and delete the course identifier
		"""
		course_identifier = self.dict["identifier"] = form["identifier"].value
		topic_identifier =self.topic_dict["identifier"]= form["topic_identifier"].value
		#print "topic identifier: %s <br>\n" % topic_identifier
		self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/topics.xml'
		#print "course_topicxmlfile:%s <br>\n" %(self.course_topicxmlfile)
		#self.get_topic_detail(topic_identifier)
		
		
		if self.topic_dict["identifier"]:
			rm_topic_identifier = doc_root + self.dict["identifier"] + '/' + self.topic_dict["identifier"]
			rm_topic_identifier_dest = doc_root + self.dict["identifier"] + '/.' + self.topic_dict["identifier"]
			#print "directory to be removed:%s" %rm_topic_identifier
			#print "directory to move to:%s" %rm_topic_identifier_dest
			rename( rm_topic_identifier, rm_topic_identifier_dest )
			
			#remove image file#
			rm_topic_img_identifier = doc_root + self.dict["identifier"] + '/images/' + self.topic_dict["identifier"]
			rm_topic_img_identifier_dest = doc_root + self.dict["identifier"] + '/images/.' + self.topic_dict["identifier"]
			#print "directory to be removed:%s" %rm_topic_img_identifier
			#print "directory to move to:%s" %rm_topic_img_identifier_dest
			rename( rm_topic_img_identifier, rm_topic_img_identifier_dest )
			
		self.save_topic_file( action="delete" )
		self.view_course( form )
		
##########################################################################################################
	"""
	##Section 	##################################################################################
	##Section	##################################################################################
	##Section 	##################################################################################
	"""		
	def get_section_detail( self, section_identifier ):
		"""given course identifier and topic_identifier to decide where and read the topics.xml		
		"""
		course_sectionxmlfile = doc_root + self.dict["identifier"] + '/'+ self.topic_dict["identifier"]+'/'+ sectionxmlfilename
		#self.section_dict["name"] = node["name"]
		self.section_dict["courseidentifier"] = self.identifier
		self.section_dict["topicidentifier"] = self.topic_dict["identifier"]
		if exists( course_sectionxmlfile): 
			doc = readConfig( course_sectionxmlfile )
		try:		
			for node in doc["sections"]:
				if node["identifier"] == section_identifier:
					self.section_dict["value"] = node["value"]
					self.section_dict["graphic"] = node["graphic"]
					self.section_dict["identifier"] = node["identifier"]
					self.unit_dict["sectionidentifier"] = self.section_dict["identifier"]
					self.section_dict["description"] = node["description"].encode('utf-8')
					break

		except:
			print "Error while reading section xml file"
	
	def view_section( self, form ):
		"""Take an course file name as a parameter and creates and displays an course object for it"""
		if self.section_dict["identifier"] or self.topic_dict["identifier"]=="" or self.dict["identifier"]=="":
			course_identifier = form["identifier"].value
			topic_identifier = form["topic_identifier"].value		
			section_identifier = form["section_identifier"].value
			self.get_course_detail( course_identifier )
			self.get_topic_detail( topic_identifier )
			self.get_section_detail( section_identifier )
		else:
			self.get_section_detail( self.section_dict["identifier"] )
			#self.topic_dict["description"]=self.topic_dict["description"].encode('utf-8')
			
		print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> -><a href=%s?cmd=view_topic&identifier=%s&topic_identifier=%s>%s</a> ->%s</H3><p>\n"\
		 % (                 startcgi, self.dict["identifier"], self.dict[ "title"], startcgi, self.dict["identifier"], self.topic_dict["identifier"], self.topic_dict["name"], self.section_dict["value"])
		#get the course topics#
		#self.course_topicxmlfile = doc_root + self.dict["identifier"] + '/' + topicxmlfilename
		self.show_topic_content()
	
	def show_topic_content(self):
		#Write HTML fo browser (standard output), read from template file+Cheetah		
		#print "<center><a href="start.pyg?cmd=edit_section&identifier=%s&topic_identifier=%s">edit section</a>&nbsp </center><br>\n"
		
		if exists( topic_content_template ):
			FormHandle = open(topic_content_template, "r")
			FormInput = FormHandle.read()
			FormHandle.close()
			t = Template( FormInput, searchList=[self.topic_dict] )
			print t
			print '<center><br><a href="start.pyg?cmd=edit_section&identifier=%s&topic_identifier=%s">Add a new section</a></center><br>\n' %(self.dict["identifier"], self.topic_dict["identifier"])	
			self.show_topic_sections( )
		else:
			print "template file:%s not exist"  %course_content_template
	
				

			
			
					
	def edit_section( self, form ):
		#read the course information
		course_identifier = form["identifier"].value
		topic_identifier  = form["topic_identifier"].value
		self.get_course_detail( course_identifier )
		self.get_topic_detail( topic_identifier )
		
		#self.section_dict["courseidentifier"] = course_identifier
		#self.section_dict["topicidentifier"] = topic_identifier
				
		#read topic form data into FormInput
		FormHandle = open(sectionForm, "r")
		FormInput = FormHandle.read()
		FormHandle.close()		
		
		try:
			section_identifier =  form["section_identifier"].value
			#if the topic_identifier was specified, =>show form to edit topic			
			self.section_dict[ "identifier" ] = section_identifier						
			self.get_section_detail( section_identifier )		
			#                            course name               ->         topic name                                   ->  section name                   
			print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> -><a href=%s?cmd=view_topic&identifier=%s&topic_identifier=%s> %s</a> -><a href=%s?cmd=view_section&identifier=%s&topic_identifier=%s&section_identifier=%s>  %s</a>-> Edit section</H3><p>\n" % ( startcgi, self.dict["identifier"], self.dict["title"], startcgi, self.dict["identifier"], self.topic_dict[ "identifier" ], self.topic_dict[ "topic" ], startcgi, self.dict["identifier"], self.topic_dict[ "identifier" ], self.section_dict[ "identifier" ], self.section_dict[ "value" ] )
		except:			
			print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> -><a href=%s?cmd=view_topic&identifier=%s&topic_identifier=%s> %s</a> ->Section</H3><p>\n" % ( startcgi, self.dict["identifier"], self.dict["title"], startcgi, self.dict["identifier"], self.topic_dict[ "identifier" ], self.topic_dict[ "name" ] )
			self.show_topic_sections()
		t = Template( FormInput, searchList=[self.section_dict] )
		# show the course_detail form				
		print t

	def show_topic_sections( self ):
		#print "<h2>Course:%s </h2><br>\n" % (self.title)
		#print "<p><H3>%s section Information</H3><p>\n" %(self.topic_dict["topic"])
		#if self.identifier and self.topic_dict["identifier"]:
		sectionxmlfile = doc_root + self.identifier + '/'+ self.topic_dict["identifier"]+'/'+ sectionxmlfilename
		print "section xml file: %s <br>\n" %(sectionxmlfile)
		#else:
		#	print "Error while processing %s course topic <br>\n" % ( self.title )
		#	return
			
		if exists( sectionxmlfile ):
						
			doc = readConfig( sectionxmlfile )
			#<a href="start.pyg?cmd=edit_unit&identifier=%s&topic_identifier=%s&section_identifier=%s">edit unit</a>&nbsp;\
			for node in doc["sections"]:
				print '<br><a href="start.pyg?cmd=view_section&identifier=%s&topic_identifier=%s&section_identifier=%s">%s</a>\
				&nbsp;<a href="start.pyg?cmd=up_section&identifier=%s&topic_identifier=%s&section_identifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
				<a href="start.pyg?cmd=down_section&identifier=%s&topic_identifier=%s&section_identifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
				<a href="start.pyg?cmd=edit_section&identifier=%s&topic_identifier=%s&section_identifier=%s">edit section</a>&nbsp;\
				<a href="start.pyg?cmd=delete_section&identifier=%s&topic_identifier=%s&section_identifier=%s">delete</a>&nbsp;\
				<br>\n' % ( self.identifier ,self.topic_dict["identifier"],node["identifier"],node["value"], \
							self.identifier, self.topic_dict["identifier"],node["identifier"],\
							self.identifier, self.topic_dict["identifier"],node["identifier"],\
							self.identifier, self.topic_dict["identifier"],node["identifier"],\
							self.identifier, self.topic_dict["identifier"],node["identifier"]  )
			#except:
			#	pass
				
	def save_new_section(self, form):
		#read the course identifier#
		try: 
			self.dict["identifier"] = form["courseidentifier"].value
			#read the course detail from courses.xml#
			self.get_course_detail( self.dict["identifier"] )
		except:
			print "Error! Can not find the identifier of the course"
			return
			
		#read the topic identifier#
		try: 
			self.topic_dict["identifier"] = form["topicidentifier"].value
			#read the course detail from courses.xml#
			
			#print "topic identifier: %s <br>\n"  % topic_identifier
			self.get_topic_detail( self.topic_dict["identifier"] )
		except:
			print "Error! Can not find the topic identifier"
			return
			
		#read section name#
		try:
			self.section_dict["value"] = form["value"].value
			print "Title: %s <br>\n"  % self.section_dict["value"]
		except:
			print "Error! Please specify the name of the section"
			return
				
		#decide the identifier for the topic
		self.course_sectionxmlfile = doc_root + self.dict["identifier"] + '/' + self.topic_dict["identifier"] + '/' + sectionxmlfilename
		print "course_sectionxmlfile : %s <br>\n" %( self.course_sectionxmlfile )
		
		import locale
		maxidentifier = 0
		if exists( self.course_sectionxmlfile ):
			doc = readConfig( self.course_sectionxmlfile )
			for node in doc["sections"]:
				t = locale.atoi( '%s' %( node["identifier"]) )
				if t > maxidentifier:
					maxidentifier = t
		maxidentifier = maxidentifier + 1
		
		sectionidentifier = doc_root + self.dict["identifier"] + '/' + self.topic_dict["identifier"] + '/' + str(maxidentifier)
		self.section_dict["identifier"] = str( maxidentifier )
		print "sectionidentifier:%s <br>\n" %(sectionidentifier)
		#create the identifier for the topic
		try:
			mkdir( sectionidentifier )
		except:
			print "Error while creating section identifier %s" %( sectionidentifier )	
		
		#read topic picture if file uploaded#
		graphic_file = ""
		try:		
			fs = form["graphic"]
			if fs.file and fs.filename<>"": 
				import tempfile
				tmpfile = tempfile.mktemp()
				print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break		
				f.close()	
				#copy tmpfile to topic directory
				targetfile = doc_root + self.dict["identifier"] + "/images/"+ self.topic_dict["identifier"] + "/" + self.section_dict["identifier"] + "/" + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					graphic_file = fs.filename
				except:
					print "Error while creating upload file"
			else:
				pass
			#print "filename: %s <br>\n" % (form["graphic"].headers)
			#print "tmpfilename: %s <br>\n" % (tmpfile)
			#move tmp file to 
		except:
			pass
			
		try:
			description = escape( form["description"].value )
			description = description.strip()
			self.section_dict["description"] = description
		except:
			pass

		self.save_section_file( action = "add" )   
		##show all the topics in the course
		self.show_topic_sections( )
#########################
	def save_section_file( self, action ):
		##create courses.xml file
		x = jaxml.XML_document()
		x.sections(multiple="true")
		
		if exists( self.course_sectionxmlfile ):
			doc = readConfig(  self.course_sectionxmlfile )			
			if action == "up" or action == "down":
				found = 0
				index = 0
				for node in doc["sections"]:
					index = index + 1
					if node["identifier"] == self.section_dict["identifier"]:
						found = index
						
				if found == 0:
					print "Sorry, this section identifier %s is not found <br>\n" % ( self.section_dict["identifier"] )
					return
				elif action == "up" and found == 1: 
					#the node is the first node, so can not move upward#
					print "First topic can not move upward <br>\n"
					return				
				elif action =="down":
					if found == index:
						print "Last topic can not move downward <br>\n"
						return
		
			i = 1
			try:				
				for node in doc["sections"]:
					if action == "update" and node["identifier"]==self.section_dict["identifier"]:
						x._push()				
						x.section()
						x.value( '%s' %(self.section_dict["value"] ) ) 
						x.graphic( '%s' %(self.section_dict["graphic"] ) ) 
						x.identifier( '%s' %(self.section_dict["identifier"] ) ) 
						x.description( '%s' %(self.section_dict["description"] ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
					elif action=="delete" and node["identifier"]==self.section_dict["identifier"]:
						i = i + 1
						continue
					elif ( action=="up" and i==(found-1) ) or (action=="down" and i==found ) :
							#the previous node, save for next usage
							up_name = node["value"]
							up_graphic = node["graphic"]
							up_identifier = node["identifier"]
							up_description = node["description"].encode('utf-8')
					elif ( action=="up" and i == found ) or ( action=="down" and i ==(found+1) ):
						tmp_description = node["description"].encode('utf-8')
						x._push()				
						x.section()
						x.value( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %(escape(tmp_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						
						x._push()				
						x.section()
						x.value( '%s' %(up_name ) ) 
						x.graphic( '%s' %(up_graphic) ) 
						x.identifier( '%s' %(up_identifier ) ) 
						x.description( '%s' %(escape(up_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
						

					else: 
						tmp_description = node["description"].encode('utf-8')
						x._push()				
						x.section()
						x.value( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %(escape(tmp_description) ) ) 
						x.language( 'en' )
						x._push()
						x.aggregationlevel()
						x._push()
						x.source()
						x.langstring( "LOMv1.0",  xml_lang="x-none"  )
						x._pop()
						x._push()
						x.value()
						x.langstring( "3" , xml_lang="x-none"  )
						x._pop()
						x._pop()
						x._pop()
					i = i + 1
			except:
				pass
		if action == "add":
			x.section()
			x.value( '%s' %(self.section_dict["value"]) )
			x.identifier( '%s' %(self.section_dict["identifier"]) )
			x.graphic( '%s' %(self.section_dict["graphic"]) )
			x.description( '%s' %(self.section_dict["description"]) )
			x.language( 'en' )
			x._push()
			x.aggregationlevel()
			x._push()
			x.source()
			x.langstring( "LOMv1.0",  xml_lang="x-none"  )
			x._pop()
			x._push()
			x.value()
			x.langstring( "3" , xml_lang="x-none"  )
			x._pop()
			x._pop()
			x._pop()
				
		try:
			x._output( self.course_sectionxmlfile )
		except:
			data = "" + x.__str__()
			f = open( self.course_sectionxmlfile ,"w" )
			f.write( "%s" %str(data) )
			f.flush()
			f.close

####################
		
				
	def update_section(self, form):
		#read the course identifier#
		try: 
			self.identifier = course_identifier = form["courseidentifier"].value
			print "Course identifier: %s <br>\n"  % course_identifier
			self.get_course_detail( course_identifier )
		except:
			print "Error! Can not find the identifier of the course"
			return
			
		#read the topic identifier#
		try: 
			topic_identifier = form["topicidentifier"].value
			print "Topic identifier: %s <br>\n"  % topic_identifier
			self.get_topic_detail( topic_identifier )
		except:
			print "Error! Can not find the identifier of the topic"
			return
		
		#read the section identifier#
		try: 
			section_identifier = form["sectionidentifier"].value
			print "Section identifier: %s <br>\n"  % section_identifier

		except:
			print "Error! Can not find the identifier of the section"
			return

			
		#read section title#
		try:
			name = form["value"].value
			print "name: %s <br>\n"  % name
		except:
			print "Error! Please specify the name of the section"
			return
				
		#decide the identifier for the topic
		course_sectionxmlfile = doc_root + course_identifier + '/' + topic_identifier + '/' + sectionxmlfilename
		print "course_sectionxmlfile : %s <br>\n" %( course_sectionxmlfile )
		
		#read topic picture if file uploaded#
		try:
			fs = form["graphic"]
			if fs.file: 
				import tempfile
				tmpfile = tempfile.mktemp()
				print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break			
				f.close()
				#copy tmpfile to topic directory
				targetfile = doc_root + course_identifier + '/' + topic_identifier + "/" + section_identifier + '/' + fs.filename
				print "targetfile:%s <br>\n" %(targetfile)
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
				except:
					print "Error while creating upload file"

			#print "filename: %s <br>\n" % (form["graphic"].headers)
			#print "tmpfilename: %s <br>\n" % (tmpfile)
			#move tmp file to 
		except:
			pass
		
		##create topicxml file
		x = jaxml.XML_document()
		x.sections(multiple="true")
		if exists( course_sectionxmlfile ):
			doc = readConfig( course_sectionxmlfile )
			for node in doc["sections"]:
				if node["identifier"]<>section_identifier:
					x._push()				
					x.topic()
					x.name( '%s' %(node["value"] ) ) 
					x.graphic( '%s' %(node["graphic"] ) ) 
					x.identifier( '%s' %(node["identifier"] ) ) 
					x._pop()
				else:				
					x._push()						
					x.section()
					x.name( '%s' %( name ) ) 
					if fs.filename:
						x.graphic( '%s' %(fs.filename ) ) 
					else:
						x.graphic( '%s' %(node["graphic"] ) ) 
					x.identifier( '%s' %( section_identifier ) ) 
					x._pop()
		try:
			x._output( course_sectionxmlfile )
		except:
			data = "" + x.__str__()
			f = open( course_sectionxmlfile ,"w" )
			f.write( "%s" %str(data) )
			f.flush()
			f.close
			pass

			#x._output( course_sectionxmlfile )
		##show all the topics in the course
		self.show_topic_sections( )
		
	def up_section( self, form ):
		"""move up the topic info from topics.xml
		"""
		#get the course identifier
		course_identifier = form["identifier"].value
		print "Course identifier: %s <br>\n"  % course_identifier
		self.get_course_detail(course_identifier)
		print "get_course_detail and course identifier: %s\n" %(self.identifier)
		
		#get the topic identifier
		topic_identifier = form["topic_identifier"].value
		#get_topic_detail(topic_identifier)
		self.get_topic_detail(topic_identifier)
		#course_topicxmlfile = doc_root + self.identifier + '/topics.xml'
		#print "course_topicxmlfile:%s <br>\n" %(course_topicxmlfile)
		
		#get the section identifier
		section_identifier = form["section_identifier"].value		
		self.get_topic_detail(topic_identifier)
		course_sectionxmlfile = doc_root + self.identifier + '/' + topic_identifier + '/' + sectionxmlfilename
		
		if exists( course_sectionxmlfile ): 
			doc = readConfig( course_sectionxmlfile )
			#try:		
			found = 0
			index = 0
			for node in doc["sections"]:
				index = index + 1
				if node["identifier"] == section_identifier:
					found = index
			
			if found == 1:
				#the node is the first node, so can not move upward#
				print "First node can not move upward <br>\n"
			elif found == 0:	
				print "Sorry, this section identifier %s is not found <br>\n" % ( topic_identifier )
			else:	
				#regenerate the courses.xml
				x = jaxml.XML_document()
				x.sections(multiple="true")			
				i = 1			
				for node in doc["sections"]:
					if  i == ( found - 1 ):
						#the previous node, save for next usage
						tmp_name = node["value"]
						tmp_graphic = node["graphic"]
						tmp_identifier = node["identifier"] 
					elif  i == found  :
						#print content of itself then print the previous one
						x._push()				
						x.section()
						x.name( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) )  
						x._pop()
						
						x._push()				
						x.section()
						x.name( '%s' %( tmp_name ) ) 
						x.graphic( '%s' %( tmp_graphic ) ) 
						x.identifier( '%s' %( tmp_identifier ) ) 
						x._pop()
					else:
						x._push()				
						x.section()
						x.name( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x._pop()
					i = i + 1
				#generate the output
				try:
					x._output( course_sectionxmlfile )
				except:
					data = "" + x.__str__()
					f = open( course_sectionxmlfile ,"w" )
					f.write( "%s" %str(data) )
					f.flush()
					f.close
					pass
		#except:
		#	print "Cannot open courses xml file"

		#show all courses
		self.show_topic_sections( )

	def down_section( self, form ):
		"""move down the topic info from topics.xml
		"""
		#get the course identifier
		course_identifier = form["identifier"].value
		print "Course identifier: %s <br>\n"  % course_identifier
		self.get_course_detail(course_identifier)
		print "get_course_detail and course identifier: %s\n" %(self.identifier)
		
		#get the topic identifier
		topic_identifier = form["topic_identifier"].value
		self.get_topic_detail(topic_identifier)
		
		#get the section identifier
		section_identifier = form["section_identifier"].value		
		self.get_topic_detail(topic_identifier)
		course_sectionxmlfile = doc_root + self.identifier + '/' + topic_identifier + '/' + sectionxmlfilename
		
		if exists( course_sectionxmlfile ): 
			doc = readConfig( course_sectionxmlfile )
			#try:		
			found = 0
			index = 0
			for node in doc["sections"]:
				index = index + 1
				if node["identifier"] == section_identifier:
					found = index
			
			if found == index:
				#the node is the first node, so can not move upward#
				print "Last node can not move downward <br>\n"
			elif found == 0:	
				print "Sorry, this section identifier %s is not found <br>\n" % ( section_identifier )
			else:	
				#regenerate the courses.xml
				x = jaxml.XML_document()
				x.sections(multiple="true")			
				i = 1			
				for node in doc["sections"]:
					if  i == found:
						#the previous node, save for next usage
						tmp_name = node["value"]
						tmp_graphic = node["graphic"]
						tmp_identifier = node["identifier"] 
					elif  i == ( found + 1 ) :
						#print content of itself then print the previous one 
						x._push()				
						x.section()
						x.name( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) )  
						x._pop()
						
						x._push()				
						x.topic()
						x.name( '%s' %( tmp_name ) ) 
						x.graphic( '%s' %( tmp_graphic ) ) 
						x.identifier( '%s' %( tmp_identifier ) ) 
						x._pop()
						

					else:
						x._push()				
						x.section()
						x.name( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x._pop()
					i = i + 1
				#generate the output
				try:
					x._output( course_sectionxmlfile )
				except:
					data = "" + x.__str__()
					f = open( course_sectionxmlfile ,"w" )
					f.write( "%s" %str(data) )
					f.flush()
					f.close
					pass
		#except:
		#	print "Cannot open courses xml file"

		#show all courses
		self.show_topic_sections( )

	
	def delete_section( self, form ):
		"""delete the course info from courses.xml and delete the course identifier
		"""
		course_identifier = form["identifier"].value
		self.identifier = course_identifier
		self.get_course_detail(course_identifier)
		
		topic_identifier = form["topic_identifier"].value
		self.get_topic_detail( topic_identifier )
		#get the section identifier
		section_identifier = form["section_identifier"].value		
		#self.get_topic_detail(topic_identifier)
		course_sectionxmlfile = doc_root + self.identifier + '/' + topic_identifier + '/' + sectionxmlfilename

				
		print "course_sectionxmlfile:%s <br>\n" %(course_sectionxmlfile)
		doc = readConfig( course_sectionxmlfile )
		#regenerate the courses.xml
		x = jaxml.XML_document()
		x.sections(multiple="true")
		
		for node in doc["sections"]:
			if node["identifier"]<>section_identifier:
				x._push()				
				x.section()
				x.name( '%s' %(node["value"] ) ) 
				x.graphic( '%s' %(node["graphic"] ) ) 
				x.identifier( '%s' %(node["identifier"] ) ) 
				x._pop()			
		#generate the output
		try:
			x._output( course_sectionxmlfile )
		except:
			data = "" + x.__str__()
			f = open( course_sectionxmlfile ,"w" )
			f.write( "%s" %str(data) )
			f.flush()
			f.close
			pass

		#delete the identifier ==>move the identifier to /var/tmp/courses		
		#except:
		#	print "Cannot open courses xml file"
		if section_identifier:
			rm_identifier = doc_root + course_identifier + "/" + topic_identifier + '/' + section_identifier
			try:
				removedirs( rm_identifier )
			except:
				pass
		#show all courses
		self.show_topic_sections()

##########################################################################################################
	"""
	##unit 	##################################################################################
	##unit	##################################################################################
	##unit 	##################################################################################
	"""		
	def get_unit_detail( self, unit_identifier ):
		"""given course identifier and topic_identifier to decide where and read the topics.xml		
		"""
		course_unitxmlfile = doc_root + self.identifier + '/'+ self.topic_dict["identifier"]+'/'+ self.section_dict["identifier"] + '/' + unitxmlfilename
		if exists( course_unitxmlfile): 
			doc = readConfig( course_unitxmlfile )
		try:		
			for node in doc["classification"]:
				if node["identifier"] == unit_identifier:
					self.unit_dict["value"] = node["value"]["langstring"]
					self.unit_dict["graphic"] = node["graphic"]
					self.unit_dict["identifier"] = node["identifier"]
					self.unit_dict["description"] = node["description"].encode('utf-8')
					break
		except:
			pass
	
		
	def edit_unit( self, form ):
		#read the course information
		course_identifier = form["identifier"].value
		topic_identifier  = form["topic_identifier"].value
		section_identifier = form["section_identifier"].value
		
		self.get_course_detail( course_identifier )
		self.get_topic_detail( topic_identifier )
		self.get_section_detail( section_identifier )
		
		self.unit_dict["courseidentifier"] = course_identifier
		self.unit_dict["topicidentifier"] =  topic_identifier
		self.unit_dict["sectionidentifier"] =  section_identifier
				
				
		#read topic form data into FormInput
		FormHandle = open(unitForm, "r")
		FormInput = FormHandle.read()
		FormHandle.close()		
		
		try:
			unit_identifier =  form["unit_identifier"].value
			#if the topic_identifier was specified, =>show form to edit topic			
			self.unit_dict[ "identifier" ] = unit_identifier						
			self.get_unit_detail( unit_identifier )		
			#                            course name               ->         topic name                                                        ->  section name                   
			print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> -><a href=%s?cmd=view_topic&identifier=%s&topic_identifier=%s> %s</a> -><a href=%s?cmd=view_section&identifier=%s&topic_identifier=%s&unit_identifier=%s>  %s</a>-> Edit unit</H3><p>\n" % ( startcgi, self.identifier, self.title, startcgi, self.identifier, self.topic_dict[ "identifier" ], self.topic_dict[ "topic" ], startcgi, self.identifier, self.topic_dict[ "identifier" ], self.unit_dict[ "identifier" ], self.unit_dict[ "value" ] )
		except:			
			print "<p><H3><a href=%s?cmd=view_course&identifier=%s>%s</a> -><a href=%s?cmd=view_topic&identifier=%s&topic_identifier=%s> %s</a> ->unit</H3><p>\n" % ( startcgi, self.identifier, self.title, startcgi, self.identifier, self.topic_dict[ "identifier" ], self.topic_dict[ "topic" ] )
			self.show_section_units()
		t = Template( FormInput, searchList=[self.unit_dict] )
		# show the course_detail form		
		
		print t

	def show_section_units( self ):
		
		unitxmlfile = doc_root + self.identifier + '/'+ self.topic_dict["identifier"]+'/'+ self.section_dict["identifier"]+'/'+ unitxmlfilename
		print "unit xml file: %s <br>\n" %(unitxmlfile)
		#else:
		#	print "Error while processing %s course topic <br>\n" % ( self.title )
		#	return
			
		if exists( unitxmlfile ):
						
			doc = readConfig( unitxmlfile )
			try:		
				for node in doc["classification"]:
					print '<br><a href="start.pyg?cmd=view_unit&identifier=%s&topic_identifier=%s&section_identifier=%s&unit_identifier=%s">%s</a>\
					&nbsp;<a href="start.pyg?cmd=up_unit&identifier=%s&topic_identifier=%s&section_identifier=%s&unit_identifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
					<a href="start.pyg?cmd=down_unit&identifier=%s&topic_identifier=%s&section_identifier=%s&unit_identifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
					<a href="start.pyg?cmd=edit_unit&identifier=%s&topic_identifier=%s&section_identifier=%s&unit_identifier=%s">edit unit</a>&nbsp;\
					<a href="start.pyg?cmd=delete_unit&identifier=%s&topic_identifier=%s&section_identifier=%s&unit_identifier=%s">delete</a>&nbsp;\
					<br>\n' % ( self.identifier ,self.topic_dict["identifier"],self.section_dict["identifier"],node["identifier"],node["value"]["langstring"], \
							self.identifier, self.topic_dict["identifier"],self.section_dict["identifier"],node["identifier"],\
							self.identifier, self.topic_dict["identifier"],self.section_dict["identifier"],node["identifier"],\
							self.identifier, self.topic_dict["identifier"],self.section_dict["identifier"],node["identifier"],\
							self.identifier, self.topic_dict["identifier"],self.section_dict["identifier"],node["identifier"]  )
			except:
				pass
				
	def save_new_unit(self, form):
		#read the course identifier#
		try: 
			self.identifier = self.topic_dict["courseidentifier"] = self.section_dict["courseidentifier"] = self.unit_dict["courseidentifier"]= form["courseidentifier"].value
			#read the course detail from courses.xml#=			
			print "Course identifier: %s <br>\n"  % self.identifier
			self.get_course_detail( self.identifier )
		except:
			print "Error! Can not find the identifier of the course"
			return
			
		#read the topic identifier#
		try: 
			self.topic_dict["identifier"] = self.section_dict["topicidentifier"] = self.unit_dict["topicidentifier"] = form["topicidentifier"].value
			#read the course detail from courses.xml#			
			print "Topic identifier: %s <br>\n"  % self.topic_dict["identifier"]
			self.get_topic_detail( self.topic_dict["identifier"] )
		except:
			print "Error! Can not find the topic identifier"
			return
		
		#read the section identifier#
		try: 
			self.section_dict["identifier"] = self.unit_dict["sectionidentifier"] = form["sectionidentifier"].value
			#read the course detail from courses.xml#
			
			print "section identifier: %s <br>\n"  % self.section_dict["identifier"]
			self.get_section_detail( self.section_dict["identifier"] )
		except:
			print "Error! Can not find the section identifier"
			return

						
		#read unit name#
		try:
			
			self.unit_dict["value"] = form["value"].value
			print "Value: %s <br>\n"  % self.unit_dict["value"]
		except:
			print "Error! Please specify the value name of the unit"
			return
				
		#decide the identifier for the topic
		course_unitxmlfile = doc_root + self.identifier + '/' + self.topic_dict["identifier"] + '/' + self.section_dict["identifier"]+ '/' + unitxmlfilename
		print "course_unitxmlfile : %s <br>\n" %( course_unitxmlfile )
		
		import locale
		maxidentifier = 0
		if exists( course_unitxmlfile ):
			doc = readConfig( course_unitxmlfile )
			try:
				for node in doc["classification"]:
					t = locale.atoi( '%s' %( node["identifier"]) )
					if t > maxidentifier:
						maxidentifier = t
			except:
				pass
		maxidentifier = maxidentifier + 1
		self.unit_dict["identifier"] = "%d" % maxidentifier
						
		#read topic picture if file uploaded#
		graphic_file = ""
		try:		
			fs = form["graphic"]
			if fs.file and fs.filename<>"": 
				import tempfile
				tmpfile = tempfile.mktemp()
				print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break		
				f.close()	
				#copy tmpfile to topic directory
				targetfile = doc_root + self.identifier + '/' + self.topic_dict["identifier"] + '/' + self.section_dict["identifier"]+ '/' + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					graphic_file = fs.filename
				except:
					print "Error while creating upload file"
			else:
				pass
			self.unit_dict["graphic"] = graphic_file
			#print "filename: %s <br>\n" % (form["graphic"].headers)
			#print "tmpfilename: %s <br>\n" % (tmpfile)
			#move tmp file to 
		except:
			pass
			
		try:
			description = escape( form["description"].value )
			description = description.strip()
			self.unit_dict["description"] = description
		except:
			pass
			
		self.save_unit_file( action="add" )

		##show all the topics in the course
		self.show_section_units( )
	
		
	def update_unit(self, form):
		#read the course identifier#
		try: 
			self.identifier = course_identifier = form["courseidentifier"].value
			print "Course identifier: %s <br>\n"  % course_identifier
			self.get_course_detail( course_identifier )
		except:
			print "Error! Can not find the identifier of the course"
			return
			
		#read the topic identifier#
		try: 
			topic_identifier = form["topicidentifier"].value
			print "Topic identifier: %s <br>\n"  % topic_identifier
			self.get_topic_detail( topic_identifier )
		except:
			print "Error! Can not find the identifier of the topic"
			return
		
		#read the section identifier#
		try: 
			self.section_dict["identifier"] = self.unit_dict["sectionidentifier"] = form["sectionidentifier"].value
			#read the course detail from courses.xml#
			
			print "section identifier: %s <br>\n"  % self.section_dict["identifier"]
			self.get_section_detail( self.section_dict["identifier"] )
		except:
			print "Error! Can not find the section identifier"
			return

					
		#read the unit identifier#
		try: 
			self.unit_dict["identifier"] = form["unitidentifier"].value
			
		except:
			print "Error! Can not find the identifier of the unit"
			return

			
		#read unit title#
		try:
			self.unit_dict["value"] = form["value"].value			
		except:
			print "Error! Please specify the name of the unit"
			return
				
		#decide the identifier for the topic
		course_unitxmlfile = doc_root + self.identifier + '/' + self.topic_dict["identifier"] + '/' + self.section_dict["identifier"]+ '/' + unitxmlfilename
		print "course_unitxmlfile : %s <br>\n" %( course_unitxmlfile )
		
		#read topic picture if file uploaded#
		graphic_file = ""
		try:		
			fs = form["graphic"]
			if fs.file and fs.filename<>"": 
				import tempfile
				tmpfile = tempfile.mktemp()
				print "tmpfile:%s" %(tmpfile)
				f = open(tmpfile, 'wb')
			
				while 1:
					line = fs.file.readline()
					if line:
						f.write(line)
					else:
						break		
				f.close()	
				#copy tmpfile to topic directory
				targetfile = doc_root + self.identifier + '/' + self.topic_dict["identifier"] + '/' + self.section_dict["identifier"]+ '/' + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					graphic_file = fs.filename
					self.unit_dict["graphic"] = graphic_file
				except:
					print "Error while creating upload file"
				
			else:
				pass
			#print "filename: %s <br>\n" % (form["graphic"].headers)
			#print "tmpfilename: %s <br>\n" % (tmpfile)
			#move tmp file to 
		except:
			pass
		
		try:
			description = escape( form["description"].value )
			description = description.strip()
			self.unit_dict["description"] = description
		except:
			pass
			
		self.save_unit_file( action="update" )
		##show all the topics in the course
		self.show_section_units()
		
		
		
	def up_unit( self, form ):
		"""move up the topic info from topics.xml
		"""
		self.unit_read_cgi( form )
		course_unitxmlfile = doc_root + self.identifier + '/' + self.topic_dict["identifier"] + '/' + self.section_dict["identifier"] + '/' + unitxmlfilename
		print "course_unitxmlfile:%s <br>\n" %(course_unitxmlfile)
		
		if exists( course_unitxmlfile ): 
			doc = readConfig( course_unitxmlfile )
			#try:		
			found = 0
			index = 0
			for node in doc["classification"]:
				index = index + 1
				if node["identifier"] == self.unit_dict["identifier"]:
					found = index
					break
			
			if found == 1:
				#the node is the first node, so can not move upward#
				print "First node can not move upward <br>\n"
			elif found == 0:	
				print "Sorry, this unit identifier %s is not found <br>\n" % ( self.unit_dict["identifier"] )
			else:	
				#regenerate the courses.xml
				x = jaxml.XML_document()
				x.classification(multiple="true")			
				i = 1			
				for node in doc["classification"]:
					if  i == ( found - 1 ):
						#the previous node, save for next usage
						tmp_name = node["value"]["langstring"]
						tmp_graphic = node["graphic"]
						tmp_identifier = node["identifier"] 
						tmp_description = node["description"] 
					elif  i == found  :
						#print content of itself then print the previous one
						x._push() 
						x.purpose()
						x._push()
						x.source()
						x.langstring( 'LOMv1.0', xml_lang="x-none" )
						x._pop()
						x._push()
						x.value()
						x.langstring( '%s' %node["value"]["langstring"], xml_lang="x-none")
						x._pop()				
						x.graphic( '%s' %(node["graphic"]) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %node["description"] )
						x._pop()
						
						x._push() 
						x.purpose()
						x._push()
						x.source()
						x.langstring( 'LOMv1.0', xml_lang="x-none" )
						x._pop()
						x._push()
						x.value()
						x.langstring( '%s' % tmp_name, xml_lang="x-none")
						x._pop()				
						x.graphic( '%s' %(tmp_graphic) ) 
						x.identifier( '%s' %(tmp_identifier ) ) 
						x.description( '%s' %tmp_description )
						x._pop()

					else:
						x._push() 
						x.purpose()
						x._push()
						x.source()
						x.langstring( 'LOMv1.0', xml_lang="x-none" )
						x._pop()
						x._push()
						x.value()
						x.langstring( '%s' %node["value"]["langstring"], xml_lang="x-none")
						x._pop()				
						x.graphic( '%s' %(node["graphic"]) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' %node["description"] )
						x._pop()
					i = i + 1
				#generate the output
				try:
					x._output( course_unitxmlfile )
				except:
					data = "" + x.__str__()
					f = open( course_unitxmlfile ,"w" )
					f.write( "%s" %str(data) )
					f.flush()
					f.close					
		#except:
		#	print "Cannot open courses xml file"

		#show all courses
		self.show_section_units( )

	def down_unit( self, form ):
		"""move down the topic info from topics.xml
		"""
		#get the course identifier
		course_identifier = form["identifier"].value
		print "Course identifier: %s <br>\n"  % course_identifier
		self.get_course_detail(course_identifier)
		print "get_course_detail and course identifier: %s\n" %(self.identifier)
		
		#get the topic identifier
		topic_identifier = form["topic_identifier"].value
		self.get_topic_detail(topic_identifier)
		
		#get the unit identifier
		unit_identifier = form["unit_identifier"].value		
		self.get_topic_detail(topic_identifier)
		course_unitxmlfile = doc_root + self.identifier + '/' + topic_identifier + '/' + unitxmlfilename
		
		if exists( course_unitxmlfile ): 
			doc = readConfig( course_unitxmlfile )
			#try:		
			found = 0
			index = 0
			for node in doc["units"]:
				index = index + 1
				if node["identifier"] == unit_identifier:
					found = index
			
			if found == index:
				#the node is the first node, so can not move upward#
				print "Last node can not move downward <br>\n"
			elif found == 0:	
				print "Sorry, this unit identifier %s is not found <br>\n" % ( unit_identifier )
			else:	
				#regenerate the courses.xml
				x = jaxml.XML_document()
				x.units(multiple="true")			
				i = 1			
				for node in doc["units"]:
					if  i == found:
						#the previous node, save for next usage
						tmp_name = node["value"]
						tmp_graphic = node["graphic"]
						tmp_identifier = node["identifier"] 
					elif  i == ( found + 1 ) :
						#print content of itself then print the previous one 
						x._push()				
						x.unit()
						x.name( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) )  
						x._pop()
						
						x._push()				
						x.topic()
						x.name( '%s' %( tmp_name ) ) 
						x.graphic( '%s' %( tmp_graphic ) ) 
						x.identifier( '%s' %( tmp_identifier ) ) 
						x._pop()
						

					else:
						x._push()				
						x.unit()
						x.name( '%s' %(node["value"] ) ) 
						x.graphic( '%s' %(node["graphic"] ) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x._pop()
					i = i + 1
				#generate the output
				try:
					x._output( course_unitxmlfile )
				except:
					data = "" + x.__str__()
					f = open( course_unitxmlfile ,"w" )
					f.write( "%s" %str(data) )
					f.flush()
					f.close
					pass
		#except:
		#	print "Cannot open courses xml file"

		#show all courses
		self.show_topic_units( )
	
	
	def delete_unit( self, form ):
		"""delete the course info from courses.xml and delete the course identifier
		"""
		self.unit_read_cgi( form )
		course_unitxmlfile = doc_root + self.identifier + '/' + self.topic_dict["identifier"] + '/' + self.section_dict["identifier"] + '/' + unitxmlfilename

		print "course_unitxmlfile:%s <br>\n" %(course_unitxmlfile)
		doc = readConfig( course_unitxmlfile )
		#regenerate the units.xml

		x = jaxml.XML_document()
		x.classification(multiple="true")
		if exists( course_unitxmlfile ) and doc:
			for node in doc["classification"]:
				if node["identifier"] <> self.unit_dict["identifier"]:
					x._push() 
					x.purpose()
					x._push()
					x.source()
					x.langstring( 'LOMv1.0', xml_lang="x-none" )
					x._pop()
					x._push()
					x.value()
					x.langstring( '%s' %node["value"]["langstring"], xml_lang="x-none")
					x._pop()				
					x.graphic( '%s' %(node["graphic"]) ) 
					x.identifier( '%s' %(node["identifier"] ) ) 
					x.description( '%s' %node["description"] )
					x._pop()
		
				
			try:
				x._output( course_unitxmlfile )
			except:
				data = "" + x.__str__()
				f = open( course_unitxmlfile ,"w" )
				f.write( "%s" %str(data) )
				f.flush()
				f.close
			

		#show all units
		self.show_section_units()

	
	def unit_read_cgi( self, form ):
		try:
			course_identifier = form["identifier"].value
			self.identifier = course_identifier
			self.get_course_detail(course_identifier)
		except:
			print "Course identifier not specified" 
			return
		
		try:
			topic_identifier = form["topic_identifier"].value
			self.get_topic_detail( topic_identifier )
		except:
			print "Topic identifier not specified" 
			return
		
		try:
			section_identifier = form["section_identifier"].value
			self.get_section_detail( section_identifier )
		except:
			print "Section identifier not specified"
			return
		try:
			unit_identifier = form["unit_identifier"].value
			self.get_unit_detail( unit_identifier )		
		except:
			print "unit identifier not specified"
			return
				
	def save_unit_file( self, action ):
		##create unitxml file
		course_unitxmlfile = doc_root + self.identifier + '/' + self.topic_dict["identifier"] + '/' + self.section_dict["identifier"] + '/' + unitxmlfilename
		x = jaxml.XML_document()
		x.classification(multiple="true")
		if exists( course_unitxmlfile ):			
			try:
				doc = readConfig( course_unitxmlfile )			
				for node in doc["classification"]:
					if action == "update" and node["identifier"]==self.unit_dict["identifier"]:
						x._push() 
						x.purpose()
						x._push()
						x.source()
						x.langstring( 'LOMv1.0', xml_lang="x-none" )
						x._pop()
						x._push()
						x.value()
						x.langstring( '%s' %self.unit_dict["value"], xml_lang="x-none")
						x._pop()				
						x.graphic( '%s' % self.unit_dict["graphic"] ) 
						x.identifier( '%s' %self.unit_dict["identifier"]  ) 
						x.description( '%s' %self.unit_dict["description"] )
						x._pop()
					else: 
						tmp_description = node["description"].encode('utf-8')
						x._push() 
						x.purpose()
						x._push()
						x.source()
						x.langstring( 'LOMv1.0', xml_lang="x-none" )
						x._pop()
						x._push()
						x.value()
						x.langstring( '%s' %node["value"]["langstring"], xml_lang="x-none")
						x._pop()				
						x.graphic( '%s' %(node["graphic"]) ) 
						x.identifier( '%s' %(node["identifier"] ) ) 
						x.description( '%s' % escape(tmp_description) )
						x._pop()
			except:
				pass
		if action == "add":
			x._push() 
			x.purpose()
			x._push()
			x.source()
			x.langstring( 'LOMv1.0', xml_lang="x-none" )
			x._pop()
			x._push()
			x.value()
			x.langstring( '%s' %(self.unit_dict["value"]), xml_lang="x-none")
			x._pop()				
			x.graphic( '%s' % self.unit_dict["graphic"] ) 
			x.identifier( '%s' %self.unit_dict["identifier"]  ) 
			x.description( '%s' %self.unit_dict["description"] )
			x._pop()
				
		try:
			x._output( course_unitxmlfile )
		except:
			data = "" + x.__str__()
			f = open( course_unitxmlfile ,"w" )
			f.write( "%s" %str(data) )
			f.flush()
			f.close
			
