#!/usr/bin/python

from coursemanager import CourseManager
from xmlreader import readConfig
from os.path import exists
from  shutil import rmtree, copyfile
class Topic(CourseManager):
	


	def topic_read_form( self, form ):
		for item in self.topic_dict:
			if item[:7]<>"graphic":
				try:
					self.topic_dict[item]= form[item].value
				except  KeyError:
					pass
					
				#print "%s:%s <p>\n" %(item, self.topic_dict[item].decode())					#print "%s:%s <p>\n" %(item, self.topic_dict[item])
					
	def edit_topic( self, form ):
		#show the course detail for edit if necessary
		#initialize the topic dictionary#
		
		try:
			self.get_course_detail( form["courseidentifier"].value )
		except:
			print "Error, cant get course detail of this topic"
			return
		
		self.read_topic_dict()
		self.topic_read_form( form )
		
		if form.has_key( "topicidentifier" ):
			self.topic_dict[ "topicidentifier" ] =  form["topicidentifier"].value
			self.get_topic_detail( self.topic_dict[ "topicidentifier" ] )
			heading = ""
			content = self.xml_string( self.topicForm, self.topic_dict )
			crumb = "<H3><a href=%s?cmd=view_course&courseidentifier=%s>%s</a> -> Edit %s</H3>\n" % ( self.startcgi, self.dict["courseidentifier"], self.dict["title"], self.topic_dict["title"])
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s" % self.dict["courseidentifier"]
			self.showexe( self.theme_template, heading, content, crumb, preview, outline )

		else:
			heading = ""
			content = self.xml_string( self.topicForm, self.topic_dict )
			crumb = "<p><H3><a href=%s?cmd=view_course&courseidentifier=%s>%s</a> -> Add a new topics</H3><p>\n" % ( self.startcgi, self.dict["courseidentifier"], self.dict["title"])
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s" % self.dict["courseidentifier"]
			self.showexe( self.theme_template, heading, content, crumb, preview, outline )
		
	def save_new_topic(self, form):
		#read the course identifier#
		
		try: 
			#read the course detail from courses.xml#
			self.get_course_detail( form["courseidentifier"].value )
		except:
			print "Error! Can not find the identifier of the course"
			return
			
		self.read_topic_dict()	
		self.topic_read_form( form )
		
		#determine the max identifier#
		self.topicxmlfilepath = self.doc_root + self.topic_dict["courseidentifier"] + "/" + self.topicxmlfile
		maxidentifier = self.max_identifier( self.topicxmlfilepath, "topics", "topicidentifier" ) + 1
		
		#create directory#
		topic_directory = self.doc_root  + self.topic_dict["courseidentifier"] + "/" + str( maxidentifier )
		while exists( topic_directory ):
			maxidentifier = maxidentifier + 1
			topic_directory = self.doc_root  + self.topic_dict["courseidentifier"] + "/" + str( maxidentifier )
		
		self.topic_dict["topicidentifier"] = str( maxidentifier )
		#read course picture if file uploaded#
		image_dir = topic_directory + "/images/"
		file_dir  = topic_directory + "/files/"
		if self.create_dir( topic_directory ):
			self.topic_dict["graphic"] = self.process_graphic( form, image_dir, "graphic", "graphic" )
			for item in self.topic_dict:
				if item[-5:]=="_file":
					self.topic_dict[item] = self.process_file( form, file_dir, item, item )
			#self.savexmlfile( self, action, roottag, dict, index_identifier, targetxmlfile, xml_template ):
			self.save_topic_file(action="add")
			#self.savexmlfile( "add", "topics", self.topic_dict, "topicidentifier", self.topicxmlfilepath, self.topic_xml_template  )
		else:
			print "Error while creating topic directory"
			return
		self.view_course( form )
			

	def save_topic_file( self, action ):
		##create courses.xml file
		self.topicxmlfilepath = self.doc_root + self.topic_dict["courseidentifier"] + "/" + self.topicxmlfile
		self.savexmlfile( action, "topics", self.topic_dict, "topicidentifier", self.topicxmlfilepath, self.topic_xml_template )
				
	def update_topic(self, form):
		#read the course identifier#
			
		try:
			#print "Course identifier: %s <br>\n"  % self.dict["courseidentifier"]
			self.get_course_detail( form["courseidentifier"].value )
		except:
			print "Error! Can not find the identifier of the course"
			return
			
		self.read_topic_dict( )
		self.topic_read_form( form )
		
		#read topic picture if file uploaded#
		target_dir = self.doc_root  + self.topic_dict["courseidentifier"] + '/'+ self.topic_dict["topicidentifier"] + "/images/"
		file_dir   = self.doc_root  + self.topic_dict["courseidentifier"] + '/'+ self.topic_dict["topicidentifier"] + "/files/"
		if form.has_key("new_graphic"):
			self.topic_dict["graphic"] = self.process_graphic( form, target_dir, "graphic", "new_graphic" )
		else:
			self.topic_dict["graphic"] = self.process_graphic( form, target_dir, "graphic", "graphic" )
		for item in self.topic_dict:
			if item[-5:]=="_file":
				if form.has_key( "new_%s" %item ):
					self.topic_dict[item] = self.process_file( form, file_dir, item, "new_%s" % item )
				else:
					self.topic_dict[item] = self.process_file( form, file_dir, item, item )
		
		#targetxmlfile = target_dir + '/' + self.coursexmlfile
		#self.savexmlfile( "update", "courses", self.dict, "identifier", self.coursexmlfile, self.course_xml_template )
		self.save_topic_file("update")
		self.view_topic( form )
		
	def up_topic( self, form ):
		"""move up the topic info from topics.xml
		"""
		self.read_topic_dict()
		self.topic_read_form(form)
		
		self.get_course_detail( self.topic_dict["courseidentifier"] )
		
		self.save_topic_file( action="up" )
		self.view_course( form )
		
	def down_topic( self, form ):
		#get the course identifier
		self.read_topic_dict()
		self.topic_read_form(form)
		
		self.get_course_detail( self.topic_dict["courseidentifier"] )
		
		self.save_topic_file( action="down" )
		self.view_course( form )
	
	def delete_topic( self, form ):
		"""delete the course info from courses.xml and delete the course identifier
		"""
		self.read_topic_dict()
		self.topic_read_form( form )
		
		self.get_course_detail( self.topic_dict["courseidentifier"] )
		
		if self.topic_dict["topicidentifier"] and self.topic_dict["courseidentifier"]:
			rm_identifier = self.doc_root + self.topic_dict["courseidentifier"] + "/" + self.topic_dict["topicidentifier"]
			rmtree( rm_identifier )

		self.save_topic_file( action="delete" )
		self.view_course( form )
		
