#!/usr/bin/python

from coursemanager import CourseManager
from xmlreader import readConfig
from os.path import exists
from  shutil import rmtree, copyfile
from os import sep
class Unit(CourseManager):


	def unit_read_form( self, form ):
		self.read_unit_dict()
		for item in self.unit_dict:
			if item[-7:]<>"graphic" and item[-5:]<>"_file":
				try:
					self.unit_dict[item]= form[item].value
				except:
					pass

	def save_unit_file( self, action ):
	
		self.unitxmlfilepath = self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"]+ "/" + self.unit_dict["sectionidentifier"] + "/" + self.unitxmlfile
		self.savexmlfile( action, "units", self.unit_dict, "unitidentifier", self.unitxmlfilepath, self.unit_xml_template  )
				
	
	def process_unit(self, form, action ):

		try:
			self.get_course_detail( form["courseidentifier"].value )
		except:
			print "Error, cant get course detail of this unit"
			return
		
		try:
			self.get_topic_detail( form["topicidentifier"].value )
		except:
			print "Error, can't get topic detail of this unit"
			return
		
		try:	
			self.get_section_detail( form["sectionidentifier"].value )
		except:
			print "Error, can't get section detail of this unit"
			return
		
		#read the course identifier#
		self.unit_read_form( form )
		
		if action == "view":
			self.get_unit_detail( self.unit_dict["unitidentifier"] )
			self.show_unit_content()
			return
			
		if action == "add":
			#determine the max identifier#
			self.unitxmlfilepath = self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"] +  '/' + self.unit_dict["sectionidentifier"]+  '/' + self.unitxmlfile
			maxidentifier = self.max_identifier( self.unitxmlfilepath, "units", "unitidentifier" ) + 1
			
		
			#create directory#
			unit_directory = self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"] + '/' + self.unit_dict["sectionidentifier"] + '/'+ str( maxidentifier)
	
			while exists( unit_directory ):	
				maxidentifier = maxidentifier + 1
				unit_directory = self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"] + '/' + self.unit_dict["sectionidentifier"] + '/'+ str( maxidentifier)
				
			self.unit_dict["unitidentifier"] = str( maxidentifier )
			#read course picture if file uploaded#
			image_dir = unit_directory + "/images/"
			file_dir = unit_directory + "/files/"
			if self.create_dir( unit_directory ):
				self.unit_dict["graphic"] = self.process_graphic( form, image_dir, "graphic", "graphic" )
				for item in self.unit_dict:
					if item[-5:]=="_file":
						self.unit_dict[item] = self.process_file( form, file_dir, item, item )
			else:
				print "Error while creating unit directory"
				return

		if action == "edit":

			if form.has_key( "unitidentifier" ):
				#self.unit_dict[ "unitidentifier" ] =  form["unitidentifier"].value
				self.get_unit_detail( form["unitidentifier"].value )
				heading = ""
				content = self.xml_string( self.unitForm, self.unit_dict )
				crumb = "<H3><a href=%s?cmd=view_course&courseidentifier=%s>%s</a> ->\
			 	<a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s>%s</a> ->\
			 	<a href=%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s>%s</a>\
			  	->Edit %s</H3>\n"\
					 % ( self.startcgi, self.dict["courseidentifier"], self.dict["title"],\
						 self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], self.topic_dict["title"],\
					 	self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], self.section_dict["title"],\
					  	self.unit_dict["title"] )

			else:
				heading = ""
				content = self.xml_string( self.unitForm, self.unit_dict )
				crumb = "<H3><a href=%s?cmd=view_course&courseidentifier=%s>%s</a> ->\
			 	<a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s>%s</a> ->\
			 	<a href=%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s>%s</a>\
			  	-> Add a new unit</H3>\n"\
					 % ( self.startcgi, self.dict["courseidentifier"], self.dict["title"],\
						 self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], self.topic_dict["title"],\
					 	self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], self.section_dict["title"] )
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s" % self.dict["courseidentifier"]
			self.showexe( self.theme_template, heading, content, crumb, preview, outline )
			return

		if action=="update":
			#read topic picture if file uploaded#
			target_dir = self.doc_root  + self.unit_dict["courseidentifier"] + '/'+ self.unit_dict["topicidentifier"] + '/'+ self.unit_dict["sectionidentifier"] + '/' + self.unit_dict["unitidentifier"]+ "/images/"
			file_dir = self.doc_root  + self.unit_dict["courseidentifier"] + '/'+ self.unit_dict["topicidentifier"] + '/'+ self.unit_dict["sectionidentifier"] + '/' + self.unit_dict["unitidentifier"]+ "/files/"
			if form.has_key("new_graphic"):
				self.unit_dict["graphic"] = self.process_graphic( form, target_dir, "graphic", "new_graphic" )
			else:
				self.unit_dict["graphic"] = self.process_graphic( form, target_dir, "graphic", "graphic" )	
			for item in self.unit_dict:
				if item[-5:]=="_file":
					self.unit_dict[item] = self.process_file( form, file_dir, item, item )
		
		if action == "delete":
			if self.unit_dict["unitidentifier"] and self.unit_dict["courseidentifier"] and self.unit_dict["topicidentifier"] and self.unit_dict["sectionidentifier"]:
				rm_identifier = self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"]+ "/" + self.unit_dict["sectionidentifier"]+ "/" + self.unit_dict["unitidentifier"]
				rm_identifier_dest = self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"]+ "/" + self.unit_dict["sectionidentifier"]+ "/." + self.unit_dict["unitidentifier"]
				#print "directory to be removed:%s" %rm_identifier
				#print "directory to move to:%s" %rm_identifier_dest
				#try:
				#removedirs( rm_identifier )
				rmtree( rm_identifier)

				
		self.save_unit_file( action )
		
		if action=="up" or action =="down" or action=="delete" or action=="add":
			self.view_section(form)
		else:
			self.view_unit( form )
