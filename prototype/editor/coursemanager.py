from os.path import exists
from os import mkdir, sep, environ
from urllib import quote
import sys
from cgi import escape
from string import strip, join
from Cheetah.Template import Template
from xmlreader import readConfig
from  shutil import rmtree, copyfile
import marshal


##enable cgi traceback
import cgitb
cgitb.enable( display=1, logdir="/var/tmp/httpd/exe" )

debug = 0
class CourseManager:
	"""Manages courses for the web page.
	
	Responsible for creating, loading, saving, and displaying courses."""
	def __init__( self, preview_dir="", coursetype="" ):
		#if environ.has_key('HTTP_REFERER'):
   		#	self.referer = environ.get('HTTP_REFERER')
		#else:
   		#	self.referer = None
		if environ.has_key('QUERY_STRING'):
   			self.referer = environ.get('QUERY_STRING')
		else:
   			self.referer = None
		if debug: print "script: %s <br>\n" % self.referer

		self.reset()
		self.www_eXe_root     		= "/python/eXe/"
		self.doc_root      		= "/var/www/html" + self.www_eXe_root
		self.cmd			=	""
		self.startcgi 			= "start.pyg"
		self.previewcgi			= self.www_eXe_root + "preview.pyg"
		self.preview_start_cgi		= self.www_eXe_root + "start.pyg"
		self.speakitcgi			= self.www_eXe_root + "speak_it.pyg"
		
		self.publish_template		= self.doc_root + "idevices" + sep + "publish_content.template"
		
		#the course xml file path#
		self.coursexmlfile	  		= self.doc_root + "courses.xml"
		
		#xml file for the list of available idevices#
		self.idevice_templatexmlfile= self.doc_root + "idevices_template.xml"
		
		#name of each xml file#
		self.topicxmlfile			= "topics.xml"
		self.sectionxmlfile			= "sections.xml"
		self.unitxmlfile			= "units.xml"
		self.idevicexmlfile			= "idevices.xml"
		
		self.preview_cgi_string = ""
		self.settemplate( preview_dir, coursetype )
		
		self.page_counter = 0
		self.current_page = 0
		#the list to remember each page's url#
		#save result to file url_dump#
		self.url_dump_path = ""
		self.page_url_list = []
		
		
	def reset( self ):
		reload(sys)
		sys.setdefaultencoding( 'iso-8859-1' )
		del sys.setdefaultencoding
		self.content_dict={ "heading":"", "content":"", "crumb":"" }
		#set the default course dict, could be varied#
		self.dict = {"title":"", "shorttitle":"", "coursetype":"", "graphic":"","courseidentifier":"","description":"" , "parse_h3":""}
		self.topic_dict = {}
		self.section_dict = {}
		self.unit_dict = {}
		self.idevice_dict = {}
		self.orderby = {}
		
	def settemplate( self, preview_dir="", coursetype="" ):
		self.preview_dir = preview_dir
		
		#if preview/publish mode#
		base_directory = ""
		if coursetype<>"":
			base_directory += coursetype + sep
		
		if preview_dir<>"":
			self.content_template_directory	= base_directory + "preview" + sep + preview_dir + sep
			self.preview_cgi_string = "&preview_dir=%s" % preview_dir
			self.content_dict["preview_dir"] = preview_dir
		else:
			self.content_template_directory	= base_directory + "idevices" + sep 
				
		self.template_directory = base_directory + "idevices" + sep 
		
		#get the theme template#
		self.theme_template = self.content_template_directory + "index_content.template"
			
		if debug:
			print "Theme template:%s<br> \n" % self.theme_template
			print "preview_cgi_string=%s\n" %( self.preview_cgi_string )
			
		#define the eXe theme#
		#self.theme_template			= self.doc_root + self.template_directory + "index_content.template"
		#form template here#
		self.courseForm   			= self.doc_root + self.template_directory + "course_form.template" 
		self.topicForm     			= self.doc_root + self.template_directory + "topic_form.template" 
		self.sectionForm  			= self.doc_root + self.template_directory + "section_form.template" 
		self.unitForm  				= self.doc_root + self.template_directory + "unit_form.template" 

		#content template here#
		self.eXe_content_template 	= self.doc_root + self.content_template_directory + "index_content.template"
		self.course_content_template = self.doc_root + self.content_template_directory + "course_content.template"
		self.topic_content_template	= self.doc_root + self.content_template_directory + "topic_content.template"
		self.section_content_template= self.doc_root + self.content_template_directory + "section_content.template"
		self.unit_content_template 	= self.doc_root + self.content_template_directory + "unit_content.template"

		#xml template here#
		self.course_xml_template 	= self.doc_root + self.template_directory + "course_xml.template"
		self.topic_xml_template		= self.doc_root + self.template_directory + "topic_xml.template"
		self.section_xml_template 	= self.doc_root + self.template_directory + "section_xml.template"
		self.unit_xml_template 		= self.doc_root + self.template_directory + "unit_xml.template"
		
		#self.idevices_content_template	= self.doc_root + self.template_directory + "idevices_content.template"
		
	def showexe( self, templatefile, heading="", content="", crumb="", preview="", outline="", speakit="", return_str=0, parse_h3=0, publish_mode=0, current_url="" ):
		if exists( templatefile ):
			if debug: print "in showexe<br>\n"
				
			self.content_dict["header_string"] = self.dict["title"]
			self.content_dict["course_banner"] = self.dict["graphic"]
			if debug: print "course graphic:%s<br>\n" %self.content_dict["course_banner"]
			
			self.content_dict["rightnav_string"] = ""
			self.content_dict["footer_string"] = ""
			
			#generatenthe nextpage previous page url#
			if debug: print "in showexe: current_url=%s<br>\n" % current_url
			self.set_related_urls( publish_mode=publish_mode, current_url="%s"%(current_url) )
			if self.preview_dir<>"":
				self.content_dict["leftnav_string"]= """<ul id="menu">\n""" + self.show_course_topics( ret_str=1, for_topic_tree=1, publish_mode=publish_mode )+"</ul>\n" 
				self.content_dict["preview_dir"] = self.preview_dir
			else:
				self.content_dict["leftnav_string"] = ""
			
			
			#self.content_dict["www_eXe_root"] = sele.www_eXe_root
			self.content_dict["heading"]= heading
			
			if self.dict["parse_h3"]=="yes" or parse_h3<>0:
				#content = self.extract_h3( content )
				content = self.extract_header( content )
				if debug: print "content after parse_h3=%s <br>\n" % content

			#content = self.extract_h3( content )
			self.content_dict["content"] = content
			if debug:	print content
			
			#print "content_dict[content]:%s<br>\n" % self.content_dict["content"]
			#special treatment for hebrew, because wording from right to left#
			if self.dict["coursetype"]=="hebrew":
				crumb = self.process_breadcrumb( crumb )
			self.content_dict["crumb"] = crumb
			self.content_dict["preview"] = preview
			if speakit<>"":
				self.content_dict["speakit"] = speakit
			self.content_dict["outline"] = outline
			FormHandle = open(templatefile, "r")
			FormInput = FormHandle.read()
			FormHandle.close()
			x = Template( FormInput, searchList=[self.content_dict, self.dict, self.topic_dict, self.section_dict, self.unit_dict, self.orderby])
			
			if return_str:
				return x
			else:
				print x
		else:
			print "Error, template file:%s not exist!! \n" %templatefile
			return
	
	
	def process_breadcrumb( self, crumb ):
		"""in case some title's wording is from right to left, use this function to solve ordering problem"""
		
		crumb_list = crumb.split( '->' )
		tmp_crum = "<table><tr>"
		for item in crumb_list[:-1]:
			tmp_crum += """<td>%s</td><td>-&gt;</td>""" % item
		tmp_crum += """<td>%s</td> """ %crumb_list[-1]
		tmp_crum += "</tr></table>"
		return tmp_crum
			
	def xml_string( self, template_file, dict, action="" ):
		
		dict["www_eXe_root"] = self.www_eXe_root
		
		if exists( template_file ):
			#print "template_file:%s <br>\n" %template_file
			if action=="encode+escape":
				for item in dict.keys():
					if item[:7]<>"graphic" and item[:5]<>"_file":
						try:
							dict[item]= escape( dict[item].encode() )
						except UnicodeError:
							dict[item]= escape( dict[item] )
			elif action=="escape":
				for item in dict.keys():
					if item[:7]<>"graphic" and item[:5]<>"_file":
						try:
							dict[item]= escape( dict[item].strip() )
						except:
							##in case item is a list with multiple values
							if debug: print "dict[%s]:%s<p>\n" %( item, dict[item])
							dict[item] = ', '.join( [ escape(tmp_item) for tmp_item in dict[item] ] )
						#dict[item]= dict[item].strip()
						
			elif action=="encode":
				for item in dict.keys():
					if item[:7]<>"graphic" and item[:5]<>"_file":
						dict[item]= dict[item].encode()
						
			FormHandle = open(template_file, "r")
			FormInput = FormHandle.read()
			FormHandle.close()
			t = Template( FormInput, searchList=[dict,  self.dict, self.topic_dict, self.section_dict, self.unit_dict, self.content_dict] )
			
			#import string
			#identity = string.maketrans('','')
			return str(t)
		else:
			print "template file:%s not exist"  %template_file
	
	def savexmlfile( self, action, roottag, dict, index_identifier, targetxmlfile, xml_template, parse_h3=0 ):
		##create courses.xml file
		if debug: print "in savexmlfile parse_h3=%d <br>\n" %parse_h3
		x = '<?xml version="1.0" encoding="iso-8859-1"?>\n<%s multiple="true">\n' % roottag
		
		if exists( targetxmlfile ):
			doc = readConfig( targetxmlfile )
			if doc.has_key(roottag):
				if action == "up" or action == "down":
					found = 0
					index = 0
					for node in doc[roottag]:
						index = index + 1
						if node[index_identifier] == dict[index_identifier]:
							found = index
							break
							
					if found == 0:
						print "Sorry, this %s identifier:%s is not found <br>\n" % ( roottag, index_identifier )
						return
					elif action == "up" and found == 1: 
						#the node is the first node, so can not move upward#
						print "First item can not be moved upward <br>\n"
						return				
					elif action =="down":
						#if found == index:
						if found == doc[roottag].__len__():
							print "Last one can not be moved downward <br>\n"
							return
		
				i = 1
				#try:				
				for node in doc[roottag]:
					if action == "update" and node[index_identifier]==dict[index_identifier]:
						t = self.xml_string( xml_template, dict, "escape" )
						x = x + t
					elif action=="delete" and node[index_identifier]==dict[index_identifier]:
						i = i + 1
						continue
					elif ( action=="up" and i==(found-1) ) or (action=="down" and i==found ) :
							#the previous node, save for next usage
							#up_t = self.xml_string( xml_template, node, "encode+escape" )
							up_t = self.xml_string( xml_template, node, "escape" )
					elif ( action=="up" and i == found ) or ( action=="down" and i ==(found+1) ):
						#down_t = self.xml_string( xml_template, node, "encode+escape" )
						down_t = self.xml_string( xml_template, node, "escape" )
						x = x + down_t + up_t
					else: 
						#t = self.xml_string( xml_template, node, "encode+escape" )
						t = self.xml_string( xml_template, node, "escape" )
						
						#print "else add %s \n" % t
						x = x + t
					i = i + 1
				#except:
				#	pass
		if action == "add":
			t = self.xml_string( xml_template, dict, "escape" )
			x = x + t
		
		#backup first#
		try:
			bkup_targetxmlfile = targetxmlfile + action + dict[index_identifier]
			import shutil
			shutil.copyfile( targetxmlfile, bkup_targetxmlfile )
		except:
			pass
		
		x = x + "\n</%s>" %roottag
		f = open( targetxmlfile ,"w" )
		f.write( "%s" %x )
		f.flush()
		f.close
		
		self.create_manifest_xml()
		#update page_url_list
		self.update_url_list()
	
	def update_url_list( self ):
		"""use this function to update url_list dictionary"""
	
		#initialize list and pointer value#
		self.page_url_list = []
		#append the url tuple ( cgiurl , local_url_for_publish )#
		self.page_url_list.append( ( "courseidentifier=%s"%self.dict["courseidentifier"], ".", sep + "index.html" ) )
		
		#determine the url_dump_path: course_dir/url_dump #
		if self.url_dump_path=="":
			self.url_dump_path = self.doc_root + self.dict["courseidentifier"] + sep + 'url_dump'
		
		if self.dict["courseidentifier"]:
			topicxmlfilepath = self.doc_root + self.dict["courseidentifier"] + sep + 'topics.xml'
			interactivexmlfilepath = self.doc_root + self.dict["courseidentifier"] + sep + 'interactive_devices.xml'
		else:
			print "Error while processing %s course topic <br>\n" % ( self.dict["title"] )
			return
		
		#check if course xml contain orderby tag, if so create the index list file#
		#tmp_list store tupled order_by information:name, url_dump_path, []#
		tmp_list = []
		if exists( interactivexmlfilepath ):
			interactive_doc = readConfig( interactivexmlfilepath )
			if interactive_doc.has_key( "interactive_devices" ) and interactive_doc.__len__()>0:
				for item in interactive_doc["interactive_devices"]:
					if debug: print "item[0:8]:%s<br>\n" % item[0:8]
					if item[0:8] =="orderby_": #save the field name, url_dump_path and a #
						order_name = item[8:]
						if debug: print "Order_name:%s<br>\n" % order_name
						# tuple format( order_name, order_index_file_path, list[(cgiurl,local_url_for_publish) ])#
						tmp_tuple = ( order_name, "%s_%s"% (self.url_dump_path, order_name), [] )
						tmp_list.append( tmp_tuple )
				if debug: print "Orderby list:%s<br>\n" %tmp_list
				
		if exists( topicxmlfilepath ):
			#get the topic record#
			doc = readConfig( topicxmlfilepath )
			###first parse topic###
			if doc.has_key( "topics" ) and doc.__len__()>0:
				for node in doc["topics"]:
					#store url into self.page_url_list
					tmp_url = "courseidentifier=%s&topicidentifier=%s"%( self.dict["courseidentifier"], node["topicidentifier"] )
					local_tmp_url = "%s" % node["topicidentifier"]
					local_url_name = sep + "topic%s.html"  % node["topicidentifier"]
					#append the url tuple #
					self.page_url_list.append( ( tmp_url, local_tmp_url, local_url_name ) ) 
					
					#store url for orderby field#
					if tmp_list.__len__()>0:
						for item in tmp_list:
							#append the tuple (keyword , url, localurl)  into tmp_list->order_name->list#
							tmp_tuple = ( node[ item[0] ], tmp_url, local_tmp_url, local_url_name )
							item[2].append( tmp_tuple )
							if debug: print "1:%s 2:%s 3:%s<br>\n" %( item[0], item[1], item[2] )
							
					### second parse  section ###
					sectionxmlfilepath = self.doc_root + self.dict["courseidentifier"] + sep + node["topicidentifier"] + sep + 'sections.xml'
					if exists( sectionxmlfilepath ):
						#get the topic record#
						doc1 = readConfig( sectionxmlfilepath )
						if doc1.has_key( "sections" ) and doc1.__len__()>0:
							#first parse sections#
							for node1 in doc1["sections"]:
								#store url into self.page_url_list
								tmp_url1 = "courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s"%( self.dict["courseidentifier"], node["topicidentifier"], node1["sectionidentifier"] )
								
								#local_tmp_url1 = "%s/%s"%( node["topicidentifier"], node1["sectionidentifier"] )
								local_tmp_url1 =  node["topicidentifier"] + sep +  node1["sectionidentifier"]
								local_url1_name = sep + "section%s.html" % node1["sectionidentifier"]
								#append the url tuple to list#
								self.page_url_list.append( ( tmp_url1, local_tmp_url1, local_url1_name ) ) 

								if tmp_list.__len__() > 0:
									for item in tmp_list:
										#put the keyword , url into list#
										tmp_tuple = ( node1[ item[0] ], tmp_url1, local_tmp_url1, local_url1_name )
										
										item[2].append( tmp_tuple )
										
										if debug: print "1:%s 2:%s 3:%s<br>\n" %( item[0]	, item[1], item[2])
							
								### third parse units ###
								unitxmlfilepath = self.doc_root + self.dict["courseidentifier"] + sep + node["topicidentifier"] + sep + node1["sectionidentifier"] + sep +'units.xml'
								if exists( unitxmlfilepath ):
									#get the unit record#
									doc2 = readConfig( unitxmlfilepath )
									if doc2.has_key( "units" ) and doc2.__len__()>0:
										#first parse units#
										for node2 in doc2["units"]:
											#store url into self.page_url_list
											tmp_url2 = "courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s"%( self.dict["courseidentifier"], node["topicidentifier"], node1["sectionidentifier"], node2["unitidentifier"] )
											#local_tmp_url2 = "%s/%s/%s"%( node["topicidentifier"], node1["sectionidentifier"], node2["unitidentifier"] )
											local_tmp_url2 = node["topicidentifier"] + sep + node1["sectionidentifier"] + sep + node2["unitidentifier"]
											local_url2_name = sep + "unit%s.html"% node2["unitidentifier"]
											#append the url tuple to list#
											self.page_url_list.append( ( tmp_url2, local_tmp_url2, local_url2_name ) ) 
											
											if tmp_list.__len__()>0:
												for item in tmp_list:
													#put the keyword , url into list#
													tmp_tuple = ( node2[ item[0] ], tmp_url2, local_tmp_url2, local_url2_name )
													item[2].append( tmp_tuple )
													if debug: print "1:%s 2:%s 3:%s<br>\n" %( item[0]	, item[1], item[2] )
			
		if debug:
			print "page_url_list: %s<br>\n" % self.page_url_list
			print "Url_dump_path: %s<br>\n" %self.url_dump_path
		
		FileHandle = open( self.url_dump_path, "w")
		marshal.dump( self.page_url_list, FileHandle )
		FileHandle.close
		
		#save list file for orderby keyword#
		if tmp_list.__len__()>0:
			for item in tmp_list:
				#put the keyword , url into list#
				FileHandle = open( item[1], "w")
				item[2].sort()  #item[2] is a list containing sort_field, url, local_url#
				#tmp_url_list = tmp_url_list[1]
				#item[1] is the index file path of the sorted field#
				if debug: print "keyword index file after sort:%s list:%s<br>\n" %( item[1], item[2] )
				marshal.dump( item[2], FileHandle )
				FileHandle.close
		pass
	
	def create_menu_file(self, preview_dir):
		#update menu_file#
		tmp_menu_string = """<ul id="menu">\n""" + self.show_course_topics( ret_str=1, for_topic_tree=1, for_menu=1 )+"</ul>\n" 
		menu_file = self.doc_root + self.dict["courseidentifier"] + sep + "menu_string." + preview_dir
		f = open( menu_file ,"w" )
		f.write( "%s" %tmp_menu_string )
		f.flush()
		f.close
		return tmp_menu_string
		
	def read_topic_dict(self):
		#read coursexml file to gain field
		doc = readConfig( self.topic_xml_template )
		for item in doc["topic"]:
			self.topic_dict[item] = ""
			
	def read_section_dict(self):
		#read coursexml file to gain field
		doc = readConfig( self.section_xml_template )
		for item in doc["section"]:
			self.section_dict[item] = ""
	
	def read_unit_dict(self):
		#read coursexml file to gain field
		doc = readConfig( self.unit_xml_template )
		for item in doc["unit"]:
			self.unit_dict[item] = ""
	
	#####################################################################################
	def get_course_detail( self, course_identifier ):
		"""get course_detail and get the page_url_list"""
		
		if exists( self.coursexmlfile): 
			#print "courses.xml:%s<br>\n" % self.coursexmlfile
			#coursexmlfile is independent to preview_dir or coursetype#
			doc = readConfig( self.coursexmlfile )
			#try:		
			#print "course_identifier:%s<br>\n" % course_identifier
			if doc.__len__()>0:
				for node in doc["courses"]:
					#print "courseidentifier:%s<br>\n" %node["courseidentifier"]
					if node["courseidentifier"] == course_identifier:
						#set the path for file url_dump#
						
						if node["coursetype"]<>"":
							self.settemplate( preview_dir=self.preview_dir, coursetype=node["coursetype"])
						#read course field definition#
						#self.read_course_dict()
						#print "found the course in courses.xml <br>\n"
						for item in node.keys():
							try:
								self.dict[item] = node[item]
							except:
								pass
						interactivexmlfilepath = self.doc_root + course_identifier + sep + 'interactive_devices.xml'
						helpxmlfilepath = self.doc_root + course_identifier + sep + 'help_devices.xml'
						#deal with help devices#
						if exists( helpxmlfilepath ):
							help_doc = readConfig( helpxmlfilepath )
							if help_doc.has_key("help_devices"):
								for item in help_doc["help_devices"]:
									pass

						"""get the page_url_list"""
						self.url_dump_path = self.doc_root + self.dict["courseidentifier"] + sep + 'url_dump'
							
						if not exists( self.url_dump_path ):
							self.update_url_list()
						FileHandle = open( self.url_dump_path, "r")
						self.page_url_list = marshal.load( FileHandle )
						FileHandle.close()

						#deal with interactive devices#
						if exists( interactivexmlfilepath ):
							interactive_doc = readConfig( interactivexmlfilepath )
							if interactive_doc.has_key( "interactive_devices" ) and interactive_doc.__len__()>0:
								for item in interactive_doc["interactive_devices"]:
									if debug: print "item[0:8]:%s<br>\n" % item[0:8]
									if item[0:8] =="orderby_": #save the field name, url_dump_path and a #
										#self.dict[item] = """<a href="%s?cmd=view_course&courseidentifier=%s&orderby=%s%s">Order by %s</a>""" %( self.startcgi, course_identifier, item[8:], self.preview_cgi_string, item[8:] )
										"""get the page_url_list"""
										orderby_url_dump_path = self.url_dump_path + item[7:]
										if debug: print "orderby_url_dump_path: %s<br/>\n"%orderby_url_dump_path
										if exists( orderby_url_dump_path ):
											FileHandle = open( orderby_url_dump_path, "r")
											#store the orderby list [ (name, url, localurl, localfilename), ()....]#
											self.orderby[item[8:]] = marshal.load( FileHandle )
											FileHandle.close()
											#if debug: print "order by item: %s<br/>\n"%self.dict[item]
											#self.dict[item]= """<a href="%s?cmd=view_course&courseidentifier=%s&orderby=%s%s">Order by %s</a>""" %( self.startcgi, course_identifier, item[8:], self.preview_cgi_string, item[8:] )
						#break
					
	def set_related_urls( self, publish_mode=0, current_url="" ):
	
		if debug: print "page_url_list:%s <br>\n" % self.page_url_list
		if debug: print "publish_mode:%d <br>\n" % publish_mode
		if debug: print "current_url:%s <br>\n" % current_url
		
		query_string = self.referer.split( "?" )[-1]
		if debug: print "query_string: %s <br>\n" % query_string
		
		if publish_mode==0:
			if query_string.strip()=="":
				return
			query_items = query_string.split( "&" )
			for item in query_items:
				key, value = item.split( "=" )
				if key.__contains__("identifier"):
					current_url += "%s&" %item
					self.content_dict[key]=value
			current_url = current_url[0:-1] #get rid of last "&" char in url#
		
		#in publish mode, current_url is already passed in the function call#
		self.current_url = current_url
		
		if self.current_url =="":
			self.current_url = "."
		if debug: print "current_url: %s <br>\n" % self.current_url
			
		try:
			#determin the current page number in non_order_by list#
			i = 0
			self.current_page = 0
			for item in self.page_url_list:
				if item[ publish_mode ] == self.current_url:
					self.current_page = i 
					break
				i = i + 1
					
			if self.current_page <> i: #no match url#
				if debug: print "current page not found"
				return
			
			if debug: print "current page: %s <br>\n" % self.current_page
			#if debug: print "url length: %d <br>\n" % self.page_url_list.__len__()
			
			
			if self.current_page == 0: #the first page#
				if publish_mode==1:
					#if publishing, nextpage = 	local path + local_filename <--the naming scheme could be determined in later version
					self.content_dict["nextpage"] = self.page_url_list[1][1] + self.page_url_list[1][2]
				else:
					cmd = "cmd=view_" + self.page_url_list[ 1 ][0].split( "&" )[-1].split( "=" )[0].replace( "identifier","" ) 
					self.content_dict["nextpage"] = self.startcgi + "?" + cmd + "&" + self.page_url_list[ 1 ][0] + self.preview_cgi_string
				self.content_dict["previouspage"]=""
				if debug :
					print "next page: %s <br>\n" % self.content_dict["nextpage"]
			elif self.current_page<(self.page_url_list.__len__() - 1) :
				if publish_mode==1:
					self.content_dict["nextpage"] = "../"*(self.page_url_list[self.current_page][1].count("/")+1 ) +self.page_url_list[ self.current_page + 1 ][1]  + self.page_url_list[ self.current_page + 1][2]
					self.content_dict["previouspage"] = "../"*(self.page_url_list[self.current_page][1].count("/") +1 ) +self.page_url_list[ self.current_page - 1 ][1] +self.page_url_list[ self.current_page - 1 ][2]
				else:
					cmd = "cmd=view_" + self.page_url_list[ self.current_page + 1 ][0].split("&" )[-1].split( "=" )[0].replace( "identifier","" )
					self.content_dict["nextpage"] = self.startcgi + "?" +  cmd + "&" + self.page_url_list[ self.current_page + 1 ][0] + self.preview_cgi_string
					cmd = "cmd=view_" + self.page_url_list[ self.current_page -1  ][0].split( "&" )[-1].split( "=" )[0].replace( "identifier","" )
					self.content_dict["previouspage"] = self.startcgi + "?" + cmd +  "&" + self.page_url_list[ self.current_page - 1 ][0] + self.preview_cgi_string
				if debug :
					print "next page: %s <br>\n" % self.content_dict["nextpage"]
					print "previous page: %s <br>\n" % self.content_dict["previouspage"]
			elif self.current_page==(self.page_url_list.__len__() - 1 ): #the last page#
				if publish_mode==1:
					self.content_dict["previouspage"] = "../"*( self.page_url_list[self.current_page][1].count("/") +1 ) +self.page_url_list[ self.current_page - 1 ][1] + self.page_url_list[ self.current_page - 1 ][2]
				else:
					cmd = "cmd=view_" + self.page_url_list[ self.current_page - 1 ][0].split( "&" )[-1].split( "=" )[0].replace( "identifier","" )
					self.content_dict["previouspage"] = self.startcgi + "?" + cmd + "&" + self.page_url_list[ self.current_page - 1 ][0] + self.preview_cgi_string
				self.content_dict["nextpage"]=""
				if debug :
					print "previous page: %s <br>\n" % self.content_dict["previouspage"]
			else:
				if debug: print "No previous, next page<br>\n"
		except:
			pass
		
		##determine order by keyword's next previous link
		if self.orderby.__len__() >0:
			for item in self.orderby:
				tmp_current_page = 0
				#read the next item#
				for item1 in self.orderby[item]:
					if debug: print item1[0] + ', ' + item1[1] + ', '+item1[2]+ "<br>\n"
					if item1[publish_mode+1]==self.current_url:
						if debug:
							print "order_by_%s current_page:%s<br>\n" % ( item, tmp_current_page )
						if tmp_current_page == 0 :
							if publish_mode==1:
								self.content_dict["nextpage_orderby_%s" % item ] = "../"*(self.orderby[item][1][2].count("/")+1 ) +self.orderby[item][1][2]  + self.orderby[item][1][3]
							else:
								cmd = "cmd=view_" + self.orderby[item][ tmp_current_page + 1 ][1].split("&" )[-1].split( "=" )[0].replace( "identifier","" )
								self.content_dict["nextpage_orderby_%s" % item ] = self.startcgi + "?" + cmd + "&" + self.orderby[item][1][1] + self.preview_cgi_string
							self.content_dict["previouspage_orderby_%s" %item ] = ""
						elif  tmp_current_page < ( self.orderby[item].__len__() - 1 ):
							if publish_mode==1:
								self.content_dict[ "nextpage_orderby_%s" % item ] = "../"*(self.orderby[item][tmp_current_page][2].count("/")+1 ) +self.orderby[item][ tmp_current_page + 1 ][2]  + self.orderby[item][ tmp_current_page + 1][3]
								self.content_dict[ "previouspage_orderby_%s" %item ] = "../"*(self.orderby[item][tmp_current_page][2].count("/") +1 ) +self.orderby[item][ tmp_current_page - 1 ][2] +self.orderby[item][ tmp_current_page - 1 ][3]
							else:
								cmd = "cmd=view_" + self.orderby[item][ tmp_current_page + 1 ][1].split("&" )[-1].split( "=" )[0].replace( "identifier","" )
								self.content_dict[ "nextpage_orderby_%s" % item ] = self.startcgi + "?" +  cmd + "&" + self.orderby[item][tmp_current_page+1][1] + self.preview_cgi_string
								cmd = "cmd=view_" + self.orderby[item][ tmp_current_page - 1  ][1].split("&" )[-1].split( "=" )[0].replace( "identifier","" )
								self.content_dict["previouspage_orderby_%s" % item ] = self.startcgi + "?" + cmd +  "&" + self.orderby[item][tmp_current_page - 1 ][1] + self.preview_cgi_string
						else:
							if publish_mode==1:
								self.content_dict["previouspage_orderby_%s" %item ] = "../"*(self.orderby[item][tmp_current_page][2].count("/") +1 ) +self.orderby[item][ tmp_current_page - 1 ][2] +self.orderby[item][ tmp_current_page - 1 ][3]
							else:
								cmd = "cmd=view_" + self.orderby[item][ tmp_current_page - 1 ][1].split( "&" )[-1].split( "=" )[0].replace( "identifier","" )
								self.content_dict["previouspage_orderby_%s" % item ] = self.startcgi + "?" + cmd +  "&" + self.orderby[item][tmp_current_page - 1 ][1] + self.preview_cgi_string
							self.content_dict[ "nextpage_orderby_%s" % item ] = ""
						if debug :
							print "next page orderby_%s: %s <br>\n" % ( item, self.content_dict["nextpage_orderby_%s"%item] )
							print "previous page orderby_%s: %s <br>\n" % ( item, self.content_dict["previouspage_orderby_%s" % item]	 )
						break
					else:
						tmp_current_page += 1

	def get_topic_detail( self, topicidentifier ):
		"""given course identifier and topic_identifier to decide where and read the topics.xml		
		"""
		course_topicxmlfile = self.doc_root + self.dict["courseidentifier"] + '/' + self.topicxmlfile
		#print "coursetopicxml:%s topicidentifier:%s" %(course_topicxmlfile, topicidentifier)
		
		try:
			if exists( course_topicxmlfile ): 
				self.read_topic_dict()
				doc = readConfig( course_topicxmlfile )
				if doc.__len__()>0:
					for node in doc["topics"]:
						if node["topicidentifier"] == topicidentifier:
							for item in self.topic_dict.keys():
								try:
									self.topic_dict[item] = node[item]
								except:
									pass
							break
			else:
				print "Error, can't get the detail of this topic"
		except:
			print "Error, can't get the detail of this topic"
			return
			
	def get_section_detail( self, sectionidentifier ):
		"""given courseidentifier, topicidentifier and sectionidentifier to decide where and read the sections.xml		
		"""
		course_sectionxmlfile = self.doc_root + self.topic_dict["courseidentifier"] + '/'+ self.topic_dict["topicidentifier"]+'/'+ self.sectionxmlfile
		#print "coursesectionxml:%s " %(course_sectionxmlfile)
		try:
			if exists( course_sectionxmlfile ): 
				self.read_section_dict()
				doc = readConfig( course_sectionxmlfile )
				if doc.__len__()>0:
					for node in doc["sections"]:
						if node["sectionidentifier"] == sectionidentifier:
							for item in self.section_dict.keys():
								try:
									self.section_dict[item] = node[item]
								except:
									pass
							break
			else:
				print "Error, can't get the detail of this section"
		except:
			print "Error, can't get the detail of this section"
			return
			
	def get_unit_detail( self, unitidentifier ):
		"""given courseidentifier, topicidentifier, topicidentifier and unitidentifier to decide where and read the units.xml
		"""
		course_unitxmlfile = self.doc_root + self.section_dict["courseidentifier"] + '/'+ self.section_dict["topicidentifier"]+'/'+ self.section_dict["sectionidentifier"] + '/' + self.unitxmlfile

		try:
			if exists( course_unitxmlfile ): 
				self.read_unit_dict()
				doc = readConfig( course_unitxmlfile )
				if doc.__len__()>0:
					for node in doc["units"]:
						if node["unitidentifier"] == unitidentifier:
							for item in self.unit_dict.keys():
								try:
									self.unit_dict[item] = node[item]
								except:
									pass
							break
			else:
				print "Error, can't get the detail of this unit"
		except:
			print "Error, can't get the detail of this unit"
			return
	
	################################################################################################		
	def create_manifest_xml( self ):
		"""Generate imsmanifest.xml for content packaging"""
		imsmanifest_xml 	= self.doc_root + "manifest/imsmanifest_xml.template"
		metadata_xml 		= self.doc_root + "manifest/metadata_xml.template"
		organizations_xml 	= self.doc_root + "manifest/organizations_xml.template"
		organization_xml	= self.doc_root + "manifest/organization_xml.template"
		resources_xml 		= self.doc_root + "manifest/resources_xml.template"
		resource_xml 		= self.doc_root + "manifest/resource_xml.template"
		item_xml 			= self.doc_root + "manifest/item_xml.template"
		unit_item_xml		= self.doc_root + "manifest/unit_item_xml.template"
		
		organizations_dict = { "default":"", "organization":"" }
		resources_dict = {"resource":""}
		
		#get the metadata_xml part#
		manifest_dict = {}
		
		manifest_dict["metadata"] = self.xml_string( metadata_xml, self.dict )
		manifest_dict["organizations"] = ""
		manifest_dict["resources"] = ""
		
		organization = 1
		item = 0
		resource = 0
		#process topics#
		##############################################################################################
		course_topicxmlfile = self.doc_root + self.dict["courseidentifier"] + '/' + self.topicxmlfile
		if exists( course_topicxmlfile ): 
			organizations_dict["default"] = "TOC1"
			organizations_dict["organization"] = ""
			
			doc = readConfig( course_topicxmlfile )
			if doc.__len__()>0:
				for node in doc["topics"]:
					#initialize the dictionary for the topic#
					organization_dict =  {}
					resource_dict = {}
				
					#read topic date into organization_dict#
					organization_dict["identifier"] =  "TOC%d" % organization
					organization += 1
				
					resource += 1
					organization_dict["idref"] = "RESOURCE%d" % resource
				
					organization_dict["title"] = node["title"]
					organization_dict["item"] = ""
				
					#put data into resource_dict#
					resource_dict["identifier"] = organization_dict["idref"]
					resource_dict["href"] = resource_dict["filehref"] = "%s.htm" % node["topicidentifier"]
				
					#add the topic's resource#
					resources_dict["resource"] += self.xml_string( resource_xml, resource_dict )
				
					#process item string in organization tag and its child resource string
					##############################################################################################
					course_sectionxmlfile = self.doc_root + self.dict["courseidentifier"] + '/' + node["topicidentifier"] + '/' + self.sectionxmlfile
					if exists( course_sectionxmlfile ): 
						doc_section = readConfig( course_sectionxmlfile )
						if doc_section.__len__()>0:
							for node_section in doc_section["sections"]:
								#deal with section item tag#
								#title#	
								section_item_dict = {}
								section_item_dict["title"] = node_section["title"]
								#identifier: TOPIC?_SECTION?#
						
								item += 1
								section_item_dict["identifier"] = "ITEM%d" % ( item )
						
								#identifierref#
								resource += 1
								section_item_dict["idref"] = "RESOURCE%d" %( resource )
								section_item_dict["title"]= node_section["title"]
						
								#unit item#
								section_item_dict["item"] = ""
						
								#put data into resource_dict#
								resource_dict["identifier"] = section_item_dict["idref"]
								resource_dict["href"] = resource_dict["filehref"] = "%s/%s.htm" % ( node["topicidentifier"], node_section["sectionidentifier"] )
						
								resources_dict["resource"] += self.xml_string( resource_xml, resource_dict )
								#process unit #
								##############################################################################################
								course_unitxmlfile = self.doc_root + self.dict["courseidentifier"] + '/' + node["topicidentifier"] + '/' + node_section["sectionidentifier"] +'/'+ self.unitxmlfile
								#print "course_unitxml:%s" %(course_unitxmlfile)
								#try:
								if exists( course_unitxmlfile ): 
									doc_unit = readConfig( course_unitxmlfile )
									try:
										for node_unit in doc_unit["units"]:
											unit_item_dict = {}
											unit_item_dict["title"] = node_unit["title"]
									
											item += 1
											unit_item_dict["identifier"] = "ITEM%d" % ( item )
						
											#identifierref#
											resource += 1
											unit_item_dict["idref"] = "RESOURCE%d" %( resource )
											#put unit_item string into section_item#
											section_item_dict["item"] += self.xml_string( unit_item_xml, unit_item_dict )
									
									
											#put data into resource_dict#
											resource_dict["identifier"] = unit_item_dict["idref"]
											resource_dict["href"] = resource_dict["filehref"] = "%s/%s/%s.htm" % ( node["topicidentifier"], node_section["sectionidentifier"], node_unit["unitidentifier"] )
											
											resources_dict["resource"] += self.xml_string( resource_xml, resource_dict )
									
											#process unit #
									except:
										pass
						
								#end unit
								organization_dict["item"] += self.xml_string( item_xml, section_item_dict )
						
						##end section
						organizations_dict["organization"] +=  self.xml_string( organization_xml, organization_dict )
				##end of for topic
			
			manifest_dict["resources"] = self.xml_string( resources_xml, resources_dict )
			manifest_dict["organizations"] = self.xml_string( organizations_xml, organizations_dict )
			
		manifest_string = self.xml_string( imsmanifest_xml, manifest_dict )
		#print manifest_string
		targetxmlfile =  self.doc_root + self.dict["courseidentifier"] + '/imsmanifest.xml'
		f = open( targetxmlfile ,"w" )
		f.write( "%s" %manifest_string )
		f.flush()
		f.close
	
	################################################################################################
	##########################################

	def max_identifier( self, xmlfile, root_name,  identifier_name ):
		if exists( xmlfile ):
			try:		
				doc = readConfig( xmlfile )
			except:
				doc = None
		
		#caculate the identifier for the course
		import locale
		maxidentifier = 0
		if exists( xmlfile ) and doc:
			if doc.__len__()>0:
				for node in doc[root_name]:
					t = locale.atoi( '%s' %( node[identifier_name]) )
					if t > maxidentifier:
						maxidentifier = t
		return maxidentifier

	def create_dir( self, tmpidentifier ):
		if tmpidentifier<>"":
			if exists( tmpidentifier ) :
				print "Error, %s directory already exists" % tmpidentifier
				return 0
			#create this directory
			else:
				try:
					mkdir( tmpidentifier )
					try:
						tmp_img_dir = tmpidentifier + '/images/'
						tmp_file_dir = tmpidentifier + '/files/'
						mkdir( tmp_img_dir )
						mkdir( tmp_file_dir )
						return 1
					except:
						print "Error while creating directory %s" %tmp_img_dir
						return 1
				except:
					print "Error while creating course directory %s" %( tmpidentifier)
					return 0
		else:
			return 0
			
	
	def process_graphic( self, form, target_dir , graphic, new_graphic ):
		graphic_file = form[graphic].value
		
		try:		
			fs = form[new_graphic]
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
				#targetfile = self.doc_root  + self.dict["courseidentifier"] + "/images/" + fs.filename
				##deal with fs.filename to get rid of dir list
				import re
				reslash = re.compile( r'\\')
				graph_name_list = reslash.split( fs.filename ) 
				#print "graph_last_name:%s \n" %graph_name_list[-1] 
				fs.filename = graph_name_list[-1]
				targetfile = target_dir + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					graphic_file = fs.filename
					#self.dict["graphic"] = graphic_file
				except:
					print "Error while creating upload file"
			else:
				pass
		except:
			pass
		
		return graphic_file
		
	def process_file( self, form, target_dir , processfile, new_processfile ):
		resultfile = form[processfile].value
		
		try:		
			fs = form[new_processfile]
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
				#targetfile = self.doc_root  + self.dict["courseidentifier"] + "/images/" + fs.filename
				import re
				reslash = re.compile( r'\\')
				graph_name_list = reslash.split( fs.filename ) 
				#print "graph_last_name:%s \n" %graph_name_list[-1] 
				fs.filename = graph_name_list[-1]
				
				targetfile = target_dir + fs.filename
				import shutil
				try:
					shutil.copyfile( tmpfile, targetfile )
					resultfile = fs.filename
					if debug: print "UPload file::%s" % resultfile
					#self.dict["graphic"] = graphic_file
				except:
					print "Error while creating upload file"
			else:
				pass
		except:
			pass
		
		return resultfile
		
##########################################################################################################
	def show_course_topics( self, ret_str=0, for_topic_tree=0, publish_course=0, for_course="", for_menu=0, for_url_list=0, publish_mode=0 ):
		
		if self.dict["courseidentifier"]:
			topicxmlfilepath = self.doc_root + self.dict["courseidentifier"] + '/topics.xml'
		else:
			print "Error while processing %s course topic <br>\n" % ( self.dict["title"] )
			return
		#print '<center><br><a href="start.pyg?cmd=edit_topic&identifier=%s">Add a new topic</a></center><br>\n' %(self.dict["courseidentifier"])	
		
		if not self.content_dict.has_key("sectionidentifier") and self.content_dict.has_key("topicidentifier"):
			#the active document reside in this topic#
			check_active = 1
		else:
			check_active = 0
			
		x = ""
		if exists( topicxmlfilepath ):
		
			if debug:
				print "preview_cgi_string=%s<br>\n" %( self.preview_cgi_string )

			doc = readConfig( topicxmlfilepath )
			
			if doc.has_key( "topics" ):
				x+= "<ul>\n"
				if publish_course<>0:  ##"""show the topic links in the content"""
					for node in doc["topics"]:
						self.get_topic_detail( node["topicidentifier"] )
						if self.dict["coursetype"]=="hebrew":
							tmp_topic_sections = ""
						else:
							tmp_topic_sections = self.show_topic_sections(  ret_str=1, for_topic_tree=1, publish_course="%s" %publish_course, for_course="%s"%for_course )
						
						if tmp_topic_sections<>"":
							tmp_span="&gt;&gt;"
						else:
							tmp_span=""
						x = x +'<li><a href="%s/topic%s.html">%s %s</a>\n'\
							 % ( node["topicidentifier"], node["topicidentifier"], node["title"], tmp_span )
						if for_topic_tree>0:
							#self.get_topic_detail( node["topicidentifier"] )
							#x += self.show_topic_sections(  ret_str=1, for_topic_tree=1, publish_course="%s" %publish_course, for_course="%s"%for_course )
							x += tmp_topic_sections
						x += "</li>\n"
				
				elif self.preview_cgi_string =="" and for_menu==0: ##"""edit mode"""
					for node in doc["topics"]:
						x = x +'<p><a href="%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s">%s</a>\
								&nbsp;<a href="%s?cmd=up_topic&courseidentifier=%s&topicidentifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
								<a href="%s?cmd=down_topic&courseidentifier=%s&topicidentifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
								<a href="%s?cmd=edit_topic&courseidentifier=%s&topicidentifier=%s">edit</a>&nbsp;\
								<a href="%s?cmd=delete_topic&courseidentifier=%s&topicidentifier=%s">delete</a>&nbsp;\
								</p>\n' % ( self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],  node["title"], \
										self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],\
										self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],\
										self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],\
										self.startcgi, self.dict["courseidentifier"], node["topicidentifier"]  )
						if for_topic_tree>0:
							self.get_topic_detail( node["topicidentifier"] )
							x += self.show_topic_sections(  ret_str=1, for_topic_tree=1 )
				
				
				else:  ##"""preview mode or publish mode for leftnav_string """
					if publish_mode<>0:
						if self.current_page ==0 :
							tmp_padding =""
						else:
							tmp_padding = "../"*(self.page_url_list[self.current_page][1].count("/")+1 )

					for node in doc["topics"]:
						self.get_topic_detail( node["topicidentifier"] )
						if self.dict["coursetype"]=="hebrew":
							tmp_topic_sections = ""
						else:
							tmp_topic_sections = self.show_topic_sections(  ret_str=1, for_topic_tree=1, for_menu=1, publish_mode=publish_mode  )
						
						if tmp_topic_sections<>"":
							tmp_span="&gt;&gt;"
						else:
							tmp_span=""
						
						#x = x +'<br><a href="%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s%s">%s</a><br>\n'\
						#	 % ( self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], self.preview_cgi_string, node["title"] )
						if publish_mode==0:
							if check_active and self.content_dict["topicidentifier"]==node["topicidentifier"] :
								x = x + """<li id="active">"""
							else:
								x = x + "<li>"

							x = x +'<a href="%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s%s">%s %s</a>\n'\
							 % ( self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], self.preview_cgi_string, node["title"], tmp_span )
						else: #generating leftnav_string#
							if ( tmp_span=="" and self.content_dict.has_key("topicidentifier") and  self.content_dict["topicidentifier"]==node["topicidentifier"] ) or self.page_url_list[self.current_page][1]==node["topicidentifier"] :
								x = x + """<li id="active">"""
							else:
								x = x + "<li>"
							x = x +'<a href="%s%s/topic%s.html">%s %s</a>\n' % ( tmp_padding ,node["topicidentifier"], node["topicidentifier"], node["title"], tmp_span)
						if for_topic_tree>0:
							x += tmp_topic_sections
						x += "</li>\n"
				x+= "</ul>\n"
		if ret_str:
			return x
		else:
			print x

	def show_orderby( self, ret_str=0, for_topic_tree=0, publish_course=0, for_course="", for_menu=0, for_url_list=0, orderby="" ):
		
		#get the orderby url list#
		tmp_url_dump_path = self.doc_root + self.dict["courseidentifier"] + sep + 'url_dump_' + orderby
		
		if debug: print "tmp_url_dump_path:%s<br>\n" %tmp_url_dump_path
			
		if not exists( tmp_url_dump_path ):
			if debug: print "tmp_url_dump_path: Not exit<br>\n" 
			return ""
		
		
		FileHandle = open( tmp_url_dump_path, "r")
		tmp_page_url_list = marshal.load( FileHandle )
		FileHandle.close()
		
		if debug: print "tmp_page_url_list:%s<br>\n" % tmp_page_url_list
		x = ""
		whitespace = "&nbsp;"*8*for_topic_tree
		
		for item in tmp_page_url_list:
			#format is "keyword", "url"
			node = {}
			node["title"] = item[0].encode()
			tmp_url = item[1].encode()
			
			args = tmp_url.split("&")
			for arg in args:
				key, value = arg.split("=")
				node[key] = value
			
			x+= "<ul>\n"
			
			if publish_course<>0:  ##"""publish mode"""
				
				if node.has_key("unitidentifier"):
					x = x +'<li><a href="%s/%s/%s/unit%s.html">%s</a>\n'\
						 % ( node["topicidentifier"], node["sectionidentifier"], node["unitidentifier"], node["unitidentifier"], node["title"] )

				elif node.has_key("sectionidentifier"):
					x = x +'<li><a href="%s/%s/section%s.html">%s</a>\n'\
						 % ( node["topicidentifier"], node["sectionidentifier"], node["sectionidentifier"], node["title"] )

				elif node.has_key("topicidentifier"):
					x = x +'<li><a href="%s/topic%s.html">%s</a>\n'\
						 % ( node["topicidentifier"], node["topicidentifier"], node["title"] )
				
				x += "</li>\n"
				
				
			elif self.preview_cgi_string =="" and for_menu==0: ##"""edit mode"""
				if node.has_key("unitidentifier"):
					x = x + '		<p>%s<a href="%s?cmd=view_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">%s</a>\
						&nbsp;<a href="%s?cmd=up_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=down_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=edit_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">edit</a>&nbsp;\
						<a href="%s?cmd=delete_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">delete</a>&nbsp;\
						</p>\n' % ( whitespace, self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], node["sectionidentifier"], node["unitidentifier"],node["title"], \
								self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], node["sectionidentifier"], node["unitidentifier"],\
								self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], node["sectionidentifier"], node["unitidentifier"],\
								self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], node["sectionidentifier"], node["unitidentifier"],\
								self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], node["sectionidentifier"], node["unitidentifier"]  )

				elif node.has_key("sectionidentifier"):
					x = x + '	<p>%s<a href="%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">%s</a>\
						&nbsp;<a href="%s?cmd=up_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=down_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=edit_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">edit</a>&nbsp;\
						<a href="%s?cmd=delete_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">delete</a>&nbsp;\
						</p>\n' % ( whitespace, self.startcgi, self.dict["courseidentifier"] ,node["topicidentifier"],node["sectionidentifier"],node["title"], \
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],node["sectionidentifier"],\
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],node["sectionidentifier"],\
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],node["sectionidentifier"],\
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],node["sectionidentifier"]  )

				elif node.has_key("topicidentifier"):
					x = x +'<p><a href="%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s">%s</a>\
							&nbsp;<a href="%s?cmd=up_topic&courseidentifier=%s&topicidentifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
							<a href="%s?cmd=down_topic&courseidentifier=%s&topicidentifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
							<a href="%s?cmd=edit_topic&courseidentifier=%s&topicidentifier=%s">edit</a>&nbsp;\
							<a href="%s?cmd=delete_topic&courseidentifier=%s&topicidentifier=%s">delete</a>&nbsp;\
							</p>\n' % ( self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],  node["title"], \
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],\
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],\
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"],\
									self.startcgi, self.dict["courseidentifier"], node["topicidentifier"]  )
					
			
			else:  ##"""preview mode """
				if node.has_key("unitidentifier"):
					x = x + '		<li><a href="%s?cmd=view_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s%s">%s</a></li> \n'\
						 % ( self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], node["sectionidentifier"], node["unitidentifier"], self.preview_cgi_string, node["title"] )

				
				elif node.has_key("sectionidentifier"):
					x = x + '	<li><a href="%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s%s">%s</a>\n'\
						 % ( self.startcgi, self.dict["courseidentifier"] , node["topicidentifier"],node["sectionidentifier"], self.preview_cgi_string, node["title"] )
				
				elif node.has_key("topicidentifier"):
					x = x +'<li><a href="%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s%s">%s</a>\n'\
						 % ( self.startcgi, self.dict["courseidentifier"], node["topicidentifier"], self.preview_cgi_string, node["title"] )
				x += "</li>\n"
			x+= "</ul>\n"
		if ret_str:
			return x
		else:
			print x

			
	def show_course_content(self, return_str=0, return_content=0, orderby="" ):
		#Write HTML fo browser (standard output), read from template file+Cheetah		
		if exists( self.course_content_template ):
			content = self.xml_string( self.course_content_template, self.dict )
			if self.preview_cgi_string=="":
				adminlink = '<center><a href="start.pyg?cmd=edit_course&courseidentifier=%s">edit course info</a></center><br>\n' % (  self.dict["courseidentifier"] )
				content = adminlink + content
				if self.dict["coursetype"]=="hebrew":
					content = content + '<center><br><a href="start.pyg?cmd=edit_topic&courseidentifier=%s">Add a new word</a></center><br>\n' %(self.dict["courseidentifier"])
				else:
					content = content + '<center><br><a href="start.pyg?cmd=edit_topic&courseidentifier=%s">Add a new topic</a></center><br>\n' %(self.dict["courseidentifier"])
			
			#for text to speech , return the content#
			if return_content:
				return content
			else:
				if orderby<>"":
					x = "<center><H1>Show words by %s</H1><p></center>" % orderby + str( self.show_orderby( ret_str=1, orderby="%s"%orderby ) )
				else:
					x = str( self.show_course_topics( 1 ) )
				content = content + x
			
			if self.preview_dir=="":
				heading = self.dict["title"] 
			else:
				heading = self.dict["title"] + " <span style='color: #ccc;'>Preview</span>" #bas: lightens preview tag
			crumb = ""
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			speakit = self.speakitcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s%s" % ( self.dict["courseidentifier"], self.preview_cgi_string )
			to_parse_h3 = 0
			try:
				if self.dict["parse_h3"]=="yes":
					to_parse_h3=1
			except:
				pass
				
			if return_str:
				return	self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, return_str=1, parse_h3=to_parse_h3 )
			else:
				self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, parse_h3=to_parse_h3 )
		else:
			print "Error:template file:%s not exist"  %self.course_content_template
		
			
	def show_topic_content(self, return_str=0, return_content=0 ):
		
		if exists( self.topic_content_template ):
			if debug:
				print "topic_content_template:%s <br>\n" % self.topic_content_template
			content = self.xml_string( self.topic_content_template, self.topic_dict )
			#print "content: %s <br>\n" %content
			if self.preview_cgi_string=="":
				
				if self.dict["coursetype"]=="hebrew":  #ugly, will change in new version#
					adminlink = '<center><a href="start.pyg?cmd=edit_topic&courseidentifier=%s&topicidentifier=%s">edit this word</a></center><br>\n'\
			 	% ( self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"])
				else:
					adminlink = '<center><a href="start.pyg?cmd=edit_topic&courseidentifier=%s&topicidentifier=%s">edit this topic</a></center><br>\n'\
			 	% ( self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"])
				#content = adminlink + self.xml_string( self.topic_content_template, self.topic_dict, "encode" )
				content = adminlink + content
				id_string = "courseidentifier=%s&topicidentifier=%s" %( self.topic_dict["courseidentifier"],self.topic_dict["topicidentifier"] )
				if self.dict["coursetype"]<>"hebrew":
					content +=  self.show_idevices_option( id_string )
			if self.dict["coursetype"]<>"hebrew":
				content += "\n<br>" + self.show_idevices("topic")
			if self.preview_cgi_string=="":
				if self.dict["coursetype"]=="hebrew":
					content += '\n<center><br><a href="%s?cmd=edit_section&courseidentifier=%s&topicidentifier=%s">Add a new word</a></center><br>\n' %(self.startcgi, self.dict["courseidentifier"], self.topic_dict["topicidentifier"])
				else:
					content += '\n<center><br><a href="%s?cmd=edit_section&courseidentifier=%s&topicidentifier=%s">Add a new section</a></center><br>\n' %(self.startcgi, self.dict["courseidentifier"], self.topic_dict["topicidentifier"])
			
			if not return_content:
				if self.dict["coursetype"]<>"hebrew":
					x = str( self.show_topic_sections( 1 ) )
					content = content + x
			else:
				return content
				
			heading = ""
			crumb = "<a href=%s?cmd=view_course&courseidentifier=%s%s>%s</a> -> %s \n" % ( self.startcgi, self.dict["courseidentifier"], self.preview_cgi_string, self.dict["title"], self.topic_dict["title"])
			#preview = self.previewcgi + "?&courseidentifier=%s&topicidentifier=%s" %( self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"])
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			speakit = self.speakitcgi + "?courseidentifier=%s&topicidentifier=%s" % ( self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"] )
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s%s" % ( self.dict["courseidentifier"], self.preview_cgi_string )
			to_parse_h3 = 0
			try:
				if self.dict["parse_h3"]=="yes":
					to_parse_h3=1
			except:
				pass

			if return_str:
				return self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, return_str=1, parse_h3=to_parse_h3 )
			else:
				self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, parse_h3=to_parse_h3 )
		else:
			print "Error:topic template file:%s not exist"  %self.topic_content_template
		
					
	def show_section_content(self, return_str=0, return_content=0 ):
		#Write HTML fo browser (standard output), read from template file+Cheetah		
		#print "<center><a href="start.pyg?cmd=edit_section&identifier=%s&topic_identifier=%s">edit section</a>&nbsp </center><br>\n"
		#Write HTML fo browser (standard output), read from template file+Cheetah		
		if exists( self.section_content_template ):
			content = self.xml_string( self.section_content_template, self.section_dict )
			if debug:
				print "content:%s <br>\n" %content
				
			if self.preview_cgi_string=="":
				if self.dict["coursetype"]=="hebrew":
					adminlink = '<center><a href="%s?cmd=edit_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">edit this word</a></center><br>\n'\
			 	% ( self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"])
				else:
					adminlink = '<center><a href="%s?cmd=edit_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">edit this section</a></center><br>\n'\
			 	% ( self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"])
				#content = adminlink + self.xml_string( self.section_content_template, self.section_dict, "encode" )
				content = adminlink + content
				id_string = "courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s" %( self.section_dict["courseidentifier"],self.section_dict["topicidentifier"],self.section_dict["sectionidentifier"] )
				if self.dict["coursetype"]<>"hebrew":
					content = content + self.show_idevices_option( id_string )
					
			content += "\n<br>" + self.show_idevices("section")
			if self.preview_cgi_string=="":
				if self.dict["coursetype"]=="hebrew":
					content += '<center><br><a href="%s?cmd=edit_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">Add a new word</a></center><br>\n' %(self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"])	
				else:
					content += '<center><br><a href="%s?cmd=edit_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">Add a new unit</a></center><br>\n' %(self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"])	
			if not return_content:
				if  self.dict["coursetype"]<>"hebrew":
					content +=  str( self.show_section_units( 1 ) )
			else:
				return content
			
			heading = ""
			crumb = "<a href=%s?cmd=view_course&courseidentifier=%s%s>%s</a> -> <a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s%s>%s</a> -> %s \n" \
							 % ( self.startcgi, self.dict["courseidentifier"], self.preview_cgi_string, self.dict["title"],\
								 self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], self.preview_cgi_string, self.topic_dict["title"],\
								self.section_dict["title"])
			#preview = self.previewcgi + "?&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s" %( self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"])
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			speakit = self.speakitcgi + "?courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s" % ( self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"] )
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s%s" % ( self.dict["courseidentifier"], self.preview_cgi_string )
			
			to_parse_h3 = 0
			try:
				if self.dict["parse_h3"]=="yes":
					to_parse_h3=1
			except:
				pass
			
			if return_str:
				return self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, return_str=1, parse_h3=to_parse_h3 )
			else:
				self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, parse_h3=to_parse_h3 )
			
		else:
			print "Error:section template file:%s not exist"  %self.section_content_template

	def show_unit_content(self, return_str=0, return_content=0 ):
		#Write HTML fo browser (standard output), read from template file+Cheetah		
		if exists( self.unit_content_template ):
			content = self.xml_string( self.unit_content_template, self.unit_dict )
			if self.preview_cgi_string =="":
				if self.dict["coursetype"]=="hebrew":
					adminlink = '<center><a href="start.pyg?cmd=edit_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">edit this word</a></center><br>\n'\
			 		% ( self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"], self.unit_dict["unitidentifier"])
				else:
					adminlink = '<center><a href="start.pyg?cmd=edit_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">edit this unit</a></center><br>\n'\
			 		% ( self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"], self.unit_dict["unitidentifier"])
				#content = adminlink + self.xml_string( self.unit_content_template, self.unit_dict, "encode" )
				content = adminlink + content
				#content = content + '<center><br><a href="start.pyg?cmd=edit_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">Add a new unit</a></center><br>\n' %(self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"], self.unit_dict["unitidentifier"])	
				id_string = "courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s" %( self.unit_dict["courseidentifier"],self.unit_dict["topicidentifier"],self.unit_dict["sectionidentifier"],self.unit_dict["unitidentifier"] )
				if self.dict["coursetype"]<>"hebrew":
					content = content + self.show_idevices_option( id_string )
			content += "\n<br>" + self.show_idevices("unit")
			heading = ""
			crumb = "<a href=%s?cmd=view_course&courseidentifier=%s%s>%s</a> ->\
						 <a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s%s>%s</a>->\
						 <a href=%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s%s>%s</a>\
						  -> %s\n" \
							 % ( self.startcgi, self.dict["courseidentifier"], self.preview_cgi_string, self.dict["title"],\
								 self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"],self.preview_cgi_string,  self.topic_dict["title"],\
								 self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], self.preview_cgi_string,  self.section_dict["title"],\
								self.unit_dict["title"])
			#preview = self.previewcgi + "?&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s" %( self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"], self.unit_dict["unitidentifier"])
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			speakit = self.speakitcgi + "?courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s" % ( self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"], self.unit_dict["unitidentifier"]  )
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s%s" % ( self.dict["courseidentifier"], self.preview_cgi_string )
			
			to_parse_h3 = 0
			try:
				if self.dict["parse_h3"]=="yes":
					to_parse_h3=1
			except:
				pass

			if return_content:
				return content
			elif return_str:
				return self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, return_str=1, parse_h3=to_parse_h3 )
			else:
				self.showexe( self.theme_template, heading, content, crumb, preview, outline, speakit, parse_h3=to_parse_h3 )
		else:
			print "Error:unit template file:%s not exist"  %self.unit_content_template
##########################################################################################################
	def view_course( self, form, return_str=0, return_content=0 ):
		"""Take an course file name as a parameter and creates and displays an course object for it"""
		#read course content from courses.xml#
		try:
			course_identifier = form["courseidentifier"].value
			self.get_course_detail( course_identifier )
			if form.has_key("orderby"):
				order_key = form["orderby"].value
			else:
				order_key = ""
			if debug: print "order_key:%s <br />\n" % order_key
		except:
			print "Can't get the course detail \n"
			return
		#show course content#
		if return_str:
			return self.show_course_content( return_str=1 )
		elif return_content: #return the content for text to speech#
			return self.show_course_content( return_content=1 )
		else:
			self.show_course_content( return_str, orderby="%s" % order_key )

	def view_topic( self, form, return_str=0, return_content=0 ):
		"""Take an course file name as a parameter and creates and displays an course object for it"""
		#read course topic information#
		courseidentifier = form["courseidentifier"].value
		topicidentifier = form["topicidentifier"].value		
		self.get_course_detail( courseidentifier )
		self.get_topic_detail( topicidentifier )
		#print self.topic_dict["description"]
		#display topic content#
		if return_str:
			return self.show_topic_content( return_str=1 )
		elif return_content:
			return self.show_course_content( return_content=1 )
		else:
			self.show_topic_content( return_str )
	
	def view_section( self, form, return_str=0, return_content=0  ):
		#read course topic information#
		courseidentifier = form["courseidentifier"].value
		topicidentifier = form["topicidentifier"].value
		sectionidentifier = form["sectionidentifier"].value
		self.get_course_detail( courseidentifier )
		self.get_topic_detail( topicidentifier )
		self.get_section_detail( sectionidentifier )
		
		#display topic content#
		if return_str:
			return self.show_section_content( return_str=1 )
		elif return_content:
			return self.show_course_content( return_content=1 )
		else:
			self.show_section_content( return_str )
	
	def view_unit( self, form, return_str=0, return_content=0  ):
		#read course topic information#
		
		self.get_course_detail( form["courseidentifier"].value )
		
		self.get_topic_detail( form["topicidentifier"].value )
		
		self.get_section_detail( form["sectionidentifier"].value )
		
		self.get_unit_detail( form["unitidentifier"].value )
		
		#display unit content#
		if return_str:
			return self.show_unit_content( return_str=1 )
		elif return_content:
			return self.show_course_content( return_content=1 )
		else:
			 self.show_unit_content( return_str )
##########################################################################################################
	def show_topic_sections( self, ret_str = 0, for_topic_tree=0, publish_course=0, for_course="", for_topic="", for_menu=0, publish_mode=0):
		
		self.sectionxmlfilepath = self.doc_root + self.topic_dict["courseidentifier"] + '/'+ self.topic_dict["topicidentifier"]+'/'+ self.sectionxmlfile
		x = ""
		whitespace = "&nbsp;"*8*for_topic_tree
		
		if  not self.content_dict.has_key("unitidentifier") and self.content_dict.has_key("sectionidentifier") :
			#the active document reside in this topic#
			check_active = 1
		else:
			check_active = 0
		
		
		
		if exists( self.sectionxmlfilepath ):
			
			doc = readConfig( self.sectionxmlfilepath )
			if doc.has_key("sections"):
				#to distinguish if the dealing topic is in the same topic of the showing page#
			    
				if self.content_dict.has_key("topicidentifier"):
					if self.topic_dict["topicidentifier"]==self.content_dict["topicidentifier"]:
						x += """	<ul id="submenu_topic">\n"""
					else:
						x += """	<ul id="hidden">\n"""
				else:
					x += """	<ul id="hidden">\n"""
				
				
				if publish_course<>0:  ##"""publish mode"""
				
					for node in doc["sections"]:
						self.get_section_detail( node["sectionidentifier"] )
						tmp_section_units = self.show_section_units(ret_str=1, for_topic_tree=1, publish_course="%s" % publish_course, for_course="%s"%for_course, for_topic="%s" %for_topic, publish_mode=publish_mode )
						if tmp_section_units<>"":
							tmp_span= "&gt;&gt;"
						else:
							tmp_span=""
						#publish mode , always show atcive id#	
						if check_active and self.content_dict["sectionidentifier"]==node["sectionidentifier"]:
							x = x + """	<li id="active">"""
						else:
							x = x + "	<li>"

						if for_course<>"":
							x = x + '<a href="%s/%s/section%s.html">%s</a> \n'\
							 % ( self.topic_dict["topicidentifier"], node["sectionidentifier"] , node["sectionidentifier"],node["title"] )
						if for_topic<>"":
							x = x + '<a href="%s/section%s.html">%s\n'\
							 % (  node["sectionidentifier"] , node["sectionidentifier"],node["title"] )
						else:
							x = x + '<a href="%s/%s/section%s.html">%s %s</a> \n'\
							 % (  self.topic_dict["topicidentifier"], node["sectionidentifier"], node["sectionidentifier"],node["title"], tmp_span )
						if for_topic_tree>0:
							x += tmp_section_units
						x += "	</li>\n"
				elif self.preview_cgi_string=="" and for_menu==0: ##"""edit_mode"""
					for node in doc["sections"]:
						x = x + '	<p>%s<a href="%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">%s</a>\
						&nbsp;<a href="%s?cmd=up_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=down_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=edit_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">edit</a>&nbsp;\
						<a href="%s?cmd=delete_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s">delete</a>&nbsp;\
						</p>\n' % ( whitespace, self.startcgi, self.topic_dict["courseidentifier"] ,self.topic_dict["topicidentifier"],node["sectionidentifier"],node["title"], \
									self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"],node["sectionidentifier"],\
									self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"],node["sectionidentifier"],\
									self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"],node["sectionidentifier"],\
									self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"],node["sectionidentifier"]  )
						if for_topic_tree>0:
							self.get_section_detail( node["sectionidentifier"] )
							x += self.show_section_units(ret_str=1, for_topic_tree=1 )
				else: ##"""preview_mode"""
					if debug:
						print "publish_mode:%s<br>\n" % publish_mode
					if publish_mode<>0:
						if self.current_page ==0 :
							tmp_padding =""
						else:
							tmp_padding = "../"*(self.page_url_list[self.current_page][1].count("/")+1 )
						if debug:
							print "tmp_padding in publish unit:%s<br>\n" % tmp_padding
					
					for node in doc["sections"]:
						self.get_section_detail( node["sectionidentifier"] )
						tmp_section_units = self.show_section_units(ret_str=1, for_topic_tree=1, for_menu=1, publish_mode=publish_mode )
						#tmp_section_units = self.show_section_units(ret_str=1, for_topic_tree=1, publish_course="%s" % publish_course,  for_menu=1, publish_mode=publish_mode )
						if tmp_section_units<>"":
							tmp_span= "&gt;&gt;"
						else:
							tmp_span=""
						#x = x + '	<br>%s<a href="%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s%s">%s</a><br>\n'\
						#	 % ( whitespace, self.startcgi, self.topic_dict["courseidentifier"] ,self.topic_dict["topicidentifier"],node["sectionidentifier"], self.preview_cgi_string, node["title"] )
						
							
						if publish_mode==0:
							if check_active and self.content_dict["sectionidentifier"]==node["sectionidentifier"]:
								x = x + """	<li id="active">"""
							else:
								x = x + "	<li>"
							x = x + '<a href="%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s%s">%s %s</a>\n'\
							 % ( self.startcgi, self.topic_dict["courseidentifier"] ,self.topic_dict["topicidentifier"],node["sectionidentifier"], self.preview_cgi_string, node["title"], tmp_span )		
						else:
							if self.page_url_list[self.current_page][1].count("/")==1 and self.page_url_list[self.current_page][1]=="%s/%s"%(self.topic_dict["topicidentifier"],node["sectionidentifier"] ) :
								x = x + """<li id="active">"""
							else:
								x = x + "<li>"
							x = x +'<a href="%s%s/%s/section%s.html">%s %s</a>\n' % ( tmp_padding, self.topic_dict["topicidentifier"] ,node["sectionidentifier"], node["sectionidentifier"], node["title"], tmp_span)

						
						if for_topic_tree>0:
							#self.get_section_detail( node["sectionidentifier"] )
							x += tmp_section_units
						x += "	</li>\n"
				x += "	</ul>\n"
		if ret_str:
			return x
		else:
			print x
			


	def show_section_units( self, ret_str = 0, for_topic_tree=0, publish_course=0, for_course="", for_topic="" , for_section="", for_menu=0, publish_mode=0 ):
		#print "entering show_section_units: section:%s <br>\n" % self.section_dict["sectionidentifier"]
		self.unitxmlfilepath = self.doc_root + self.section_dict["courseidentifier"] + '/'+ self.section_dict["topicidentifier"]+'/'+ self.section_dict["sectionidentifier"]+'/'+ self.unitxmlfile
		if debug: print "in show_section_units: unixxmlfile:%s<br>\n"  %self.unitxmlfilepath
		
		whitespace = "&nbsp;"*16*for_topic_tree
		x = ""
		
		
		if exists( self.unitxmlfilepath ):
			doc = readConfig( self.unitxmlfilepath )
			
			if doc.has_key("units"): 
			
				if self.content_dict.has_key("sectionidentifier"):
					if self.section_dict["sectionidentifier"]==self.content_dict["sectionidentifier"]:
						x += """	<ul id="submenu_section">\n"""
					else:
						x += """	<ul id="hidden">\n"""
				else:
					x += """	<ul id="hidden">\n"""

					
				#x += "		<ul>\n"
				if publish_course<>0 and publish_mode==0:   ##"""publish mode"""
					for node in doc["units"]:
						#publish mode , always show atcive id#	
						if self.content_dict.has_key("unitidentifier") and self.content_dict["unitidentifier"]==node["unitidentifier"]:
							x = x + """		<li id="active">"""
						else:
							x = x + "		<li>"

					
						if for_section<>"":
							x = x + '<a href="%s/unit%s.html">%s</a></a> \n'\
							% ( node["unitidentifier"], node["unitidentifier"],  node["title"] )
						elif for_topic<>"":
							x = x + '<a href="%s/%s/unit%s.html">%s</a> \n'\
							% ( self.section_dict["sectionidentifier"], node["unitidentifier"], node["unitidentifier"],  node["title"] )
						elif for_course<>"":
							x = x + '<a href="%s/%s/%s/unit%s.html">%s</a>\n'\
							% ( self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"], node["unitidentifier"],  node["title"] )
						else:
							x = x + '<a href="%s/%s/%s/unit%s.html">%s</a>\n'\
							% ( self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"],node["unitidentifier"],  node["title"] )
						x+= "		</li>\n"
				elif self.preview_cgi_string=="" and for_menu==0 and publish_mode==0: ##"""edit mode"""
					for node in doc["units"]:
						x = x + '		<p>%s<a href="%s?cmd=view_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">%s</a>\
						&nbsp;<a href="%s?cmd=up_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=down_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=edit_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">edit</a>&nbsp;\
						<a href="%s?cmd=delete_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s">delete</a>&nbsp;\
						</p>\n' % ( whitespace, self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"],node["title"], \
								self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"],\
								self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"],\
								self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"],\
								self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"]  )
				else: ##"""previewmode"""
					if debug: print "in show_section_units, publish_mode=%d, current_page=%d <br><br>\n" % (publish_mode, self.current_page)
					tmp_padding = ""
					if publish_mode<>0:
						if self.current_page ==0 :
							tmp_padding =""
						else:
							tmp_padding = "../"*(self.page_url_list[self.current_page][1].count("/")+1 )
					
						if debug: print "tmp_padding=%s <br><br>\n" % tmp_padding
					
					for node in doc["units"]:
						if debug: print "unixidentifier=%s <br><br>\n" % node["unitidentifier"]
						if publish_mode==0:
							
							if self.content_dict.has_key("unitidentifier") and self.content_dict["unitidentifier"]==node["unitidentifier"]:
								x = x + """		<li id="active">"""
							else:
								x = x + "		<li>"
							x = x + '<a href="%s?cmd=view_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s%s">%s</a></li> \n'\
							 % ( self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["unitidentifier"], self.preview_cgi_string, node["title"] )
							#if debug: print " ooooooo...<br>\n"
							 
							
						else:
							if debug: print " ooooooo...<br>\n"
							if self.page_url_list[self.current_page][1].count("/")==2 and self.page_url_list[self.current_page][1]=="%s/%s/%s"%(self.topic_dict["topicidentifier"],self.section_dict["sectionidentifier"], node["unitidentifier"]) :
								x = x + """<li id="active">"""
								x = x +'<a href="%s%s/%s/%s/unit%s.html">%s</a>\n' % ( tmp_padding, self.topic_dict["topicidentifier"] , self.section_dict["sectionidentifier"], node["unitidentifier"],node["unitidentifier"], node["title"] )
								if debug: print "<p> x=%s<br>\n" % x
							
							else:
								x = x + "<li>"
								x = x +'<a href="%s%s/%s/%s/unit%s.html">%s</a>\n' % ( tmp_padding, self.topic_dict["topicidentifier"] , self.section_dict["sectionidentifier"], node["unitidentifier"],node["unitidentifier"], node["title"] )
								
							#if debug: print "<p> x=%s<br>\n" % x
						
						x += "	</li>\n"
						
				x += "		</ul>\n"
		if ret_str:
			return x
		else:
			print x
		
				

##########################################################################################################

	def	show_idevices_option( self, id_string ):
		""" read files from idevices directory and generate the select list"""
		x = """<center>Add <select style="width:120px;font:10px verdana, arial, sans-serif;text-decoration:none;background-color:#cccccc;" name=url onchange="javascript:if( options[selectedIndex].value != 'Idevices') document.location = options[selectedIndex].value">\n"""
		x += '<option value="Idevices" selected>Idevices</option>\n'
		#try:
		doc = readConfig( self.idevice_templatexmlfile )
		for node in doc["idevices"]:
			x += '<option value="%s?cmd=show_idev_form&idevice_shortname=%s&%s">%s</option>\n' %( self.startcgi, node["idevice_shortname"], id_string, node["idevice_name"] )
			
		x += '</select></center>\n'
		return x
		#except:
		#	return "Error, idevice template xml:%s file not find !!<p>\n" % self.idevice_templatexmlfile
	

##########################################################################################################
	def show_idev_form( self, form ):

		if form.has_key("unitidentifier"):
			place="unit"
			self.read_unit_dict()
			#read parameter from cgi url: courseidentifier, topicidentifier, sectionidentifier, unitidentifier
			self.unit_read_form( form )
			#read unit detail#
		elif form.has_key("sectionidentifier"):
			place="section"
			self.read_section_dict()
			#read parameter from cgi url: courseidentifier, topicidentifier, sectionidentifier
			self.section_read_form( form )
		else:
			place="topic"
			self.read_topic_dict()
			self.topic_read_form( form )
		
		crumb = "<H3>"
		if form.has_key("courseidentifier"):
			self.get_course_detail( form["courseidentifier"].value )
			crumb += "<a href=%s?cmd=view_course&courseidentifier=%s>%s</a> ->"% ( self.startcgi, self.dict["courseidentifier"], self.dict["title"])
		else:
			print "Error, cant get course detail of this unit"
			return
		
		if form.has_key("topicidentifier") and form["topicidentifier"].value<>"" :
			self.get_topic_detail( form["topicidentifier"].value )
			crumb += "<a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s>%s</a> ->" % (self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], self.topic_dict["title"] )
		else:
			print "Error, can't get topic detail of this unit"
			return
		
		if form.has_key("sectionidentifier") and form["sectionidentifier"].value<>"" :
			self.get_section_detail( form["sectionidentifier"].value )
			crumb += "<a href=%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s>%s</a> ->"\
			 %(self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], self.section_dict["title"] )
		
		if form.has_key("unitidentifier") and form["unitidentifier"].value<>"":
			self.get_unit_detail( form["unitidentifier"].value )
			crumb += "<a href=%s?cmd=view_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s>%s</a> ->"\
			 	%(self.startcgi, self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"], self.unit_dict["unitidentifier"], self.unit_dict["title"])
		
		heading = ""
		content = ""
		#display different form according to form paramenter#
		if form.has_key("idevice_shortname"):
			idevice_xml_file = self.doc_root + "/idevices/" + form["idevice_shortname"].value + "_xml.template"
			idevice_form = self.doc_root + "/idevices/" + form["idevice_shortname"].value + "_form.template"
			##
			if exists( idevice_xml_file ):
				doc = readConfig( idevice_xml_file )
				for item in doc["idevice"]:
					self.idevice_dict[item] = ""
					if debug: print item + "<br>\n"
				if form.has_key( "subunitidentifier" ):
					crumb += "Update %s</h3>\n" % form["idevice_shortname"].value
					#to update objectives, read objectives form #
					## go to unit directory to read the content of objectives
					self.get_idevice_detail( form["subidentifier"].value, form["idevice_shortname"].value, place )
				else:
					try:
						crumb += "Add new %s</h3>\n" % form["idevice_shortname"].value
					except:
						print doc
						return
				content = self.xml_string( idevice_form, self.idevice_dict )

		preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
		outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s" % self.dict["courseidentifier"]
		self.showexe( self.theme_template, heading, content, crumb, preview, outline )
		
	def get_idevice_detail( self, subunitidentifier, tagname, place ):
		if place=="topic":
			idevicesxmlfilepath = self.doc_root  + self.topic_dict["courseidentifier"] + '/'+ self.topic_dict["topicidentifier"] + '/'+ self.idevicexmlfile
		if place=="section":
			idevicesxmlfilepath = self.doc_root  + self.section_dict["courseidentifier"] + '/'+ self.section_dict["topicidentifier"] + '/'+ self.section_dict["sectionidentifier"] + '/' + self.idevicexmlfile
		elif place=="unit":
			idevicesxmlfilepath = self.doc_root  + self.unit_dict["courseidentifier"] + '/'+ self.unit_dict["topicidentifier"] + '/'+ self.unit_dict["sectionidentifier"] + '/' + self.unit_dict["unitidentifier"]+ "/" + self.idevicexmlfile
			
		#try:
		if exists( idevicesxmlfilepath ): 
			doc = readConfig( idevicesxmlfilepath )
			
			for node in doc["idevices"]:
				if node.has_key("title"):
					node["idevice_name"]= node["title"]
				node["idevice_shortname"] = node["idevice_name"].replace(" ","_")
				#node["idevice_shortname"] = "".join( node["idevice_name"].split() )
				if node["idevice_shortname"] == tagname and node["subunitidentifier"]==subunitidentifier:
					self.idevice_dict.update( node )	
					return self.idevice_dict
				
					
			else:
				print "Error, can't get the detail of this resource:%s, tag:%s" %( idevicesxmlfilepath, tagname )
		
	
				
	def process_idevice( self, form, action ):
		
		#initialize the tmp resouce dict#
		resource_dict = {}
		
		#read the course identifier#
		self.read_unit_dict()
		for item in form.keys():
			try:
				resource_dict[item]=form[item].value
			except:  #item is a list#
				resource_dict[item]= form.getlist( item )
		
		#print "resource dict:%s <br>\n" %resource_dict
		
		if resource_dict.has_key("courseidentifier"):
			self.get_course_detail( resource_dict["courseidentifier"] )
		else:
			print "Error, cant get course detail of this unit"
			return
		
		if resource_dict.has_key("topicidentifier") and resource_dict["topicidentifier"]<>"":
			self.get_topic_detail( resource_dict["topicidentifier"] )
			place="topic"
		else:
			print "Error, can't get topic detail of this unit"
			return
		
		if resource_dict.has_key("sectionidentifier") and resource_dict["sectionidentifier"]<>"":
			self.get_section_detail( resource_dict["sectionidentifier"] )
			place = "section"
			
		
		if resource_dict.has_key("unitidentifier") and resource_dict["unitidentifier"]<>"":
			self.get_unit_detail( resource_dict["unitidentifier"] )
			place= "unit"
		
		#print "place:%s <br>\n" % place
		resource = form["idevice_shortname"].value
		#resource = form["idevice_name"].value
		if debug: print "idevice_name:%s<br>\n" % resource
		
		#read all the rest information about that idevice#
		if form.has_key("subunitidentifier") and action<>"update":
			resource_dict.update( self.get_idevice_detail( form["subunitidentifier"].value, resource, place ) )

		if place =="section":
			base_dir = self.doc_root  + resource_dict["courseidentifier"] + '/'+ resource_dict["topicidentifier"] + '/'+ resource_dict["sectionidentifier"] + "/"
		elif place=="unit":
			base_dir = self.doc_root  + resource_dict["courseidentifier"] + '/'+ resource_dict["topicidentifier"] + '/'+ resource_dict["sectionidentifier"] + '/' + resource_dict["unitidentifier"]+ "/"
		elif place=="topic":
			base_dir = self.doc_root  + resource_dict["courseidentifier"] + '/'+ resource_dict["topicidentifier"] + '/'

		if resource=="multimedia" and ( action == "add" or action == "update" ):
			#dealing with file upload: mediafile, thumbnail#
			#read thumbnail picture if file uploaded#
			target_dir = base_dir + "/images/"
				
			if form.has_key("new_thumbnail"):
				resource_dict["thumbnail"] = self.process_graphic( form, target_dir, "thumbnail", "new_thumbnail" )
			else :
				resource_dict["thumbnail"] = self.process_graphic( form, target_dir, "thumbnail", "thumbnail" )	
						
			if form.has_key("new_mediafile"):
				resource_dict["mediafile"] = self.process_graphic( form, target_dir, "mediafile", "new_mediafile" )
			else :
				resource_dict["mediafile"] = self.process_graphic( form, target_dir, "mediafile", "mediafile" )	
								
		if action == "add":
			#determine the max identifier#
			self.idevicexmlfilepath = base_dir + self.idevicexmlfile
			maxidentifier = self.max_identifier( self.idevicexmlfilepath, "idevices", "subunitidentifier" )
			resource_dict["subunitidentifier"] = str( maxidentifier + 1 )
			
		elif action == "edit":
			if form.has_key( "subunitidentifier" ):
				heading = ""
				form = self.doc_root + self.template_directory + resource + "_form.template"				
				content = self.xml_string( form, resource_dict )
				if place=="topic":
					crumb = "<H3><a href=%s?cmd=view_course&courseidentifier=%s>%s</a> ->\
			 		<a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s>%s</a> ->Edit %s"\
						 % ( self.startcgi, self.dict["courseidentifier"], self.dict["title"],\
							 self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], self.topic_dict["title"], resource)
			
				elif place=="section":
					crumb = "<H3><a href=%s?cmd=view_course&courseidentifier=%s>%s</a> ->\
			 		<a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s>%s</a> ->\
			 		<a href=%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s>%s</a>->Edit %s"\
						 % ( self.startcgi, self.dict["courseidentifier"], self.dict["title"],\
							 self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], self.topic_dict["title"],\
						 	 self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], self.section_dict["title"], resource)
			
				elif place=="unit":
					crumb = "<H3><a href=%s?cmd=view_course&courseidentifier=%s>%s</a> ->\
			 		<a href=%s?cmd=view_topic&courseidentifier=%s&topicidentifier=%s>%s</a> ->\
			 		<a href=%s?cmd=view_section&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s>%s</a>->\
					<a href=%s?cmd=view_unit&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s>%s</a> ->Edit %s"\
						 % ( self.startcgi, self.dict["courseidentifier"], self.dict["title"],\
							 self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], self.topic_dict["title"],\
						 	self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], self.section_dict["title"],\
						 	self.startcgi, self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"], self.unit_dict["unitidentifier"], self.unit_dict["title"], resource)
							
			preview = self.previewcgi + "?courseidentifier=%s" % self.dict["courseidentifier"]
			outline = self.startcgi + "?cmd=outline_course&courseidentifier=%s" % self.dict["courseidentifier"]
			self.showexe( self.theme_template, heading, content, crumb, preview, outline )
			return
			
		if debug:	print "go to function save_idevice_file( action=%s, resource_dict=%s, resource=%s, place=%s)<br>\n" %( action, resource_dict, resource, place )
		self.save_idevice_file( action, resource_dict, resource, place )
		
		if place=="topic":
			self.view_topic( form )
		elif place=="section":
			self.view_section( form )
		elif place=="unit":
			self.view_unit( form )
	
	def save_idevice_file( self, action, resource_dict, resource, place ):
		if place=="topic":
			self.idevicexmlfilepath = self.doc_root + self.topic_dict["courseidentifier"] + "/" + self.topic_dict["topicidentifier"]+ "/" + self.idevicexmlfile
		elif place=="section":
			self.idevicexmlfilepath = self.doc_root + self.section_dict["courseidentifier"] + "/" + self.section_dict["topicidentifier"]+ "/" + self.section_dict["sectionidentifier"] + "/" + self.idevicexmlfile
		elif place=="unit":
			self.idevicexmlfilepath = self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"]+ "/" + self.unit_dict["sectionidentifier"] + "/" + self.unit_dict["unitidentifier"] + "/" + self.idevicexmlfile
		self.saveidevicexmlfile( action, "idevices", resource_dict, "subunitidentifier", self.idevicexmlfilepath, resource  )
		
	def saveidevicexmlfile( self, action, roottag, dict, index_identifier, targetxmlfile, resource ):
		##create idevices.xml file
		x = '<?xml version="1.0" encoding="iso-8859-1"?>\n<%s multiple="true">\n' % roottag
		
		if debug: print "in saveidevicexmlfile(action=%s,roottag=%s, dict=%s,index_identifier=%s, targetxmlfile=%s, resource=%s) <p>\n" %(  action, roottag, dict, index_identifier, targetxmlfile, resource )
		if exists( targetxmlfile ):
			doc = readConfig( targetxmlfile )
			try:
				item_list = doc[roottag]
				if debug:
					for item in item_list:
						print "%s <br>\n" %item
					
				if action == "up" or action == "down":
					found = 0
					index = 0
					for node in doc[roottag]:
						index = index + 1
						if node[index_identifier] == dict[index_identifier]:
							found = index
						
					if found == 0:
						print "Sorry, this %s identifier:%s is not found <br>\n" % ( roottag, index_identifier )
						return
					elif action == "up" and found == 1: 
						#the node is the first node, so can not move upward#
						print "First item can not be moved upward <br>\n"
						return				
					elif action =="down":
						if found == index:
							print "Last one can not be moved downward <br>\n"
							return
		
				i = 1
				#try:				
				for node in doc[roottag]:
					if node.has_key("idevice_name"):
						node["title"] = node["idevice_name"]
					elif node.has_key("title"):
						node["idevice_name"] = node["title"]
					node["idevice_shortname"] = node["idevice_name"].replace( " ", "_" )
					#node["idevice_shortname"] = "".join( node["idevice_name"].split() )
					if action == "update" and node[index_identifier]==dict[index_identifier]:
						xml_template = self.doc_root + self.template_directory + resource + "_xml.template"
						#t = self.xml_string( xml_template, dict, "encode+escape" )
						t = self.xml_string( xml_template, dict, "escape" )
						#print "updateing %s\n" %t
						x = x + t
					elif action=="delete" and node[index_identifier]==dict[index_identifier]:
						i = i + 1
						continue
					elif ( action=="up" and i==(found-1) ) or (action=="down" and i==found ) :
						
							xml_template = self.doc_root + self.template_directory + node["idevice_shortname"] + "_xml.template"
							#the previous node, save for next usage
							up_t = self.xml_string( xml_template, node, "escape" )
					elif ( action=="up" and i == found ) or ( action=="down" and i ==(found+1) ):
					
						xml_template = self.doc_root + self.template_directory + node["idevice_shortname"] + "_xml.template"
						down_t = self.xml_string( xml_template, node, "escape" )
						x = x + down_t + up_t
					else: 
						xml_template = self.doc_root + self.template_directory + node["idevice_shortname"] + "_xml.template"
						t = self.xml_string( xml_template, node, "escape" )
						#print t
						x = x + t
					i = i + 1
			except KeyError:
				pass
		if action == "add":
			xml_template = self.doc_root + self.template_directory + resource + "_xml.template"
			t = self.xml_string( xml_template, dict, "escape" )
			#print t
			x = x + t
		#backup first#
		
		try:
			bkup_targetxmlfile = targetxmlfile + action + dict[index_identifier]
			import shutil
			shutil.copyfile( targetxmlfile, bkup_targetxmlfile )
		except:
			pass
		
		x = x + "\n</%s>" %roottag
		f = open( targetxmlfile ,"w" )
		f.write( "%s" %x )
		f.flush()
		f.close

	def show_idevices( self, place, icon_dir="" ):
		x = ""
		if place=="topic":
			self.idevicexmlfilepath= self.doc_root + self.topic_dict["courseidentifier"] + "/" + self.topic_dict["topicidentifier"]+  "/" + self.idevicexmlfile
		elif place=="section":
			self.idevicexmlfilepath= self.doc_root + self.section_dict["courseidentifier"] + "/" + self.section_dict["topicidentifier"]+ "/" + self.section_dict["sectionidentifier"] + "/" + self.idevicexmlfile
		elif place=="unit":
			self.idevicexmlfilepath= self.doc_root + self.unit_dict["courseidentifier"] + "/" + self.unit_dict["topicidentifier"]+ "/" + self.unit_dict["sectionidentifier"] + "/" + self.unit_dict["unitidentifier"] + "/" + self.idevicexmlfile
			
		if exists( self.idevicexmlfilepath ):
			doc= readConfig( self.idevicexmlfilepath )
			if doc.has_key("idevices"):
				for node in doc["idevices"]:
					if node.has_key("title"):
						node["idevice_name"] = node["title"]
					node["idevice_shortname"] = node["idevice_name"].replace( " ", "_" )
					#node["idevice_shortname"] = "".join( node["idevice_name"].split() )
					if place=="topic":
						admin_link = '<br><a href="%s?cmd=up_idevice&courseidentifier=%s&topicidentifier=%s&subunitidentifier=%s&idevice_shortname=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=down_idevice&courseidentifier=%s&topicidentifier=%s&subunitidentifier=%s&idevice_shortname=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=edit_idevice&courseidentifier=%s&topicidentifier=%s&subunitidentifier=%s&idevice_shortname=%s">edit</a>&nbsp;\
						<a href="%s?cmd=delete_idevice&courseidentifier=%s&topicidentifier=%s&subunitidentifier=%s&idevice_shortname=%s">delete</a>&nbsp;\
						<br>\n' % ( self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.topic_dict["courseidentifier"], self.topic_dict["topicidentifier"], node["subunitidentifier"],node["idevice_shortname"]  )
					elif place=="section":
						admin_link = '<br><a href="%s?cmd=up_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&subunitidentifier=%s&idevice_shortname=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=down_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&subunitidentifier=%s&idevice_shortname=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=edit_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&subunitidentifier=%s&idevice_shortname=%s">edit</a>&nbsp;\
						<a href="%s?cmd=delete_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&subunitidentifier=%s&idevice_shortname=%s">delete</a>&nbsp;\
						<br>\n' % ( self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.section_dict["courseidentifier"], self.section_dict["topicidentifier"], self.section_dict["sectionidentifier"], node["subunitidentifier"],node["idevice_shortname"]  )
					elif place=="unit":
						admin_link = '<br><a href="%s?cmd=up_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s&subunitidentifier=%s&idevice_shortname=%s"><img src=/moodle/pix/t/up.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=down_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s&subunitidentifier=%s&idevice_shortname=%s"><img src=/moodle/pix/t/down.gif height="11" width="11" border="0"></a>&nbsp;\
						<a href="%s?cmd=edit_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s&subunitidentifier=%s&idevice_shortname=%s">edit</a>&nbsp;\
						<a href="%s?cmd=delete_idevice&courseidentifier=%s&topicidentifier=%s&sectionidentifier=%s&unitidentifier=%s&subunitidentifier=%s&idevice_shortname=%s">delete</a>&nbsp;\
						<br>\n' % ( self.startcgi, self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"],self.unit_dict["unitidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"],self.unit_dict["unitidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"],self.unit_dict["unitidentifier"], node["subunitidentifier"],node["idevice_shortname"],\
									self.startcgi, self.unit_dict["courseidentifier"], self.unit_dict["topicidentifier"], self.unit_dict["sectionidentifier"],self.unit_dict["unitidentifier"], node["subunitidentifier"],node["idevice_shortname"]  )	
					
					
					template_file = self.doc_root + self.content_template_directory + node["idevice_shortname"] + "_content.template"
					
					if debug:
						print "idevice template file:%s <br>\n" % template_file
					#dealing with publish function bit#
					if icon_dir<>"":
						node["icon_dir"] = icon_dir
					else:
						node["icon_dir"] = ""
					#print "idevice template file: %s <br>\n" %template_file
					if self.preview_cgi_string=="":
						x += admin_link + self.xml_string( template_file, node )
					else:
						x += self.xml_string( template_file, node )
		return x
	
	
	def	extract_h3( self, target_string ):
		#use split and replace funcs to extract h3 tags and add id to these h3#
	
		#first check if there is <div id="about_nab_sub"></div> exist
		tmp_list = target_string.split( '<div id="about_nab_sub">' )
		if tmp_list.__len__() > 1:
			tmp_headers = tmp_list[1].split('</div>')[0]
		else:
			tmp_headers = ""
		#second split the content by h3#
		if debug: print "previous h3 titles:%s" % tmp_headers
		
		tmp_content = target_string.split( '<h3>' )
			
		if tmp_content.__len__() > 1:
			#deal with each content that contain h3 tag#	
			h3_title = []   #use this to store each h3 title#
			result = tmp_content[0]
			if debug: print " h3 tag 0: %s <br>\n" % result
			for subcontent in tmp_content[1:]:
				#split it by</h3>#
				tmp_subcontent = subcontent.split( '</h3>' )
				if tmp_subcontent.__len__() > 1 :
					
					#tmp_id = tmp_subcontent[0].replace( ' ', '_' )
					tmp_id = "".join( tmp_subcontent[0].split() )
					h3_title.append( """<a href="#%s">%s</a>""" %( tmp_id, tmp_subcontent[0] ) )
					if debug: print " tmp_id: %s <br>\n" % tmp_id
					
					#cat all the splited content together#
					result += """<h3 id="%s">%s</h3>%s""" %( tmp_id, tmp_subcontent[0], "".join( tmp_subcontent[1:]) )
					if debug: print " result: %s <br>\n" % result
				else:
					#not well formed, which means no </h3> ending tag#
					result += "<h3>" + subcontent
			#add these h3 title to the head of the content#
			"""<div id="about_nav_sub">...	</div>"""
			result = """<div id="about_nav_sub">%s &nbsp;&nbsp; %s</div>""" %( tmp_headers, "&nbsp;&nbsp;".join( h3_title) ) + result
			
			return result	
		else: #no h3 tag return the orginal content#
			return target_string

			
	def	extract_header( self, target_string ):
		#use split and replace funcs to extract h3 tags and add id to these h3#
	
		#first check if there is <div id="about_nab_sub"></div> exist
		tmp_list = target_string.split( '<div id="about_nav_sub">' )
		if tmp_list.__len__() > 1:
			tmp_headers = tmp_list[1].split('</div>')[0]
		else:
			tmp_headers = ""
		#second split the content by h3#
		if debug: print "previous header titles:%s" % tmp_headers
		
		tmp_content = target_string.split( '<h' )
			
		if tmp_content.__len__() > 1:
			#deal with each content that contain header tag#	
			header_title = []   #use this to store each header title#
			result = tmp_content[0]
			for subcontent in tmp_content[1:]:
				#split it by</h3>#
				tmp_subcontent1 = subcontent.split( '>' )
				if tmp_subcontent1[0].__len__() == 0:
					result += "<h>"
					continue  #this is not a legal tag <h>#
				elif tmp_subcontent1[0][0] in ( "1", "2", "3", "4" ):
					tmp_tag = "h" + tmp_subcontent1[0][0]  #strip tag : h1 or h2 or h3 ...#
				else:
					result += "<h" + subcontent
					continue
					
				if debug: print "tmp_tag:%s <br>\n" % tmp_tag
				
				try:
					tmp_attribute = tmp_subcontent1[0][1:] #others like style=....#
				except:
					tmp_attribute = ""
					
				if debug: print "tmp_attribute:%s <br>\n" % tmp_attribute
				
				endtmp_tag = "</%s>" % tmp_tag
				tmp_subcontent_string = ">".join( tmp_subcontent1[1:])
				if debug: print "tmp_subcontent string: %s" % tmp_subcontent_string
				tmp_subcontent = tmp_subcontent_string.split( endtmp_tag )
				if debug: print "tmp_subcontent list: %s" % tmp_subcontent
				if tmp_subcontent.__len__() > 1 :
					
					tmp_id = "".join( tmp_subcontent[0].split() )
					header_title.append( """<a href="#%s">%s</a>""" %( tmp_id, tmp_subcontent[0] ) )
					if debug: print " tmp_id: %s <br>\n" % tmp_id
					
					#cat all the splited content together#
					result += """<%s %s id="%s">%s</%s>%s""" %( tmp_tag, tmp_attribute, tmp_id, tmp_subcontent[0], tmp_tag, "".join( tmp_subcontent[1:]) )
					if debug: print " result: %s <br>\n" % result
				else:
					#not well formed, which means no ending tag#
					result += "<%s %s>" %( tmp_tag, tmp_attribute) + subcontent
			#add these h3 title to the head of the content#
			"""<div id="about_nav_sub">...	</div>"""
			result = """<div id="about_nav_sub">%s &nbsp;&nbsp; %s</div><p><p>""" %( tmp_headers, "&nbsp;&nbsp;".join( header_title) ) + result
			
			return result	
		else: #no h3 tag return the orginal content#
			return target_string
