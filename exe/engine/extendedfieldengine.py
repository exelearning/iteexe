#
# Extended field engine for eXe - handles fields and elements easier.  This has a standard
# array format that can be used to generate forms / reduce the coding needed for each
# idevice.
#
#


import logging
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField
from exe.engine.field   import TextField
from exe.engine.field   import ImageField
from exe.engine.field   import Field
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui.element          import TextElement
from exe.webui.element          import ImageElement
from exe.webui.element          import Element
from string                     import Template
from exe.webui              import common
from exe.engine.path          import Path, toUnicode
from exe.engine.persist       import Persistable
from exe.engine.resource      import Resource
from exe                     import     globals

import os,sys
log = logging.getLogger(__name__)


EXEFIELDINFO_TYPE = 0
EXEFIELDINFO_DESC = 1
EXEFIELDINFO_HELP = 2
EXEFIELDINFO_EXTRAINFODICT = 3

EXEFIELD_JQUERYUI_EFFECTLIST = [ ["blind" , "Blind"], ["bounce" , "Bounce"], \
    ["drop" , "Drop"], ["explode", "Explode"], ["fold", "Fold"], ["highlight", "Highlight"], ["puff", "Puff"], \
    ["pulsate", "Pulsate"], ["scale", "Scale"], ["shake", "Shake"], ["size", "Size"], ["slide", "Slide"], \
    ["transfer",  "Transfer"] ]

"""
Field that contains a bunch of fields with utility methods
"""
class ExtendedFieldSet(Field):

    persistenceVersion = 3

    # Pass a dictionary in the format of:
    # fieldId => ["<field type - text|textarea|image|choice", "Field title text to show in editor", {options dict}]
    # fieldOrder - list of fieldids in order that they should be displayed in form, processed, etc
    def __init__(self, idevice, fieldOrder = [], fieldInfoDict = {}):
        Field.__init__(self, "fieldgroup", "group")
        self.idevice = idevice
        #list in order of id keys from the dictionary
        self.fieldOrder = fieldOrder
        self.fieldInfoDict = fieldInfoDict
        self.fields = {}
        

    def getFieldOrderList(self):
        return self.fieldOrder

    def getFieldInfoDict(self):
        return self.fieldInfoDict

    def makeFields(self):
        field_engine_build_fields_on_idevice(self.fieldInfoDict, self.fields, self.idevice)

    def makeElementDict(self):
        elementDict = field_engine_build_elements_on_block(self.fieldInfoDict, self.fields, self.idevice)
        return elementDict

    def renderEditInOrder(self, elementDict, request = None):
        html = ""
        #when field has a "type" go and render those types with a show/hide option to simplify editing
        otherFieldTypeDict = {}
        for fieldId in self.fieldOrder:
            currentElement = elementDict[fieldId]
            isOtherType = False
            if len(self.fieldInfoDict[fieldId]) > EXEFIELDINFO_EXTRAINFODICT:
                if "type" in self.fieldInfoDict[fieldId][EXEFIELDINFO_EXTRAINFODICT]:
                    isOtherType = True
            
            if isOtherType is False:        
                html += currentElement.renderEdit()
            else:
                fieldType = self.fieldInfoDict[fieldId][EXEFIELDINFO_EXTRAINFODICT]['type']
                if not fieldType in otherFieldTypeDict:
                    otherFieldTypeDict[fieldType] = []
                
                otherFieldTypeDict[fieldType].append(fieldId)
        
        for fieldType in otherFieldTypeDict:
            divId = "fieldtype_" + fieldType + self.id
            sectionChecked = False
            if request is not None:
                if "showbox" + divId in request.args:
                    sectionChecked = True
            
            
            html += "<input name='showbox" + divId + "' type='checkbox' onchange='$(\"#" + divId + "\").toggle()'"
            if sectionChecked is True:
                html += " checked='checked' "
            html += "/>"
            
            html += _("Show") + " " +  fieldType + " " + _("options")
            html += "<div id='" + divId + "' "
            if sectionChecked is False:
                html += " style='display: none' "
            html += ">"
            
            for fieldId in otherFieldTypeDict[fieldType]:
                currentElement = elementDict[fieldId]
                html += currentElement.renderEdit()
            html += "</div>"
        
        return html

    def getRenderDictionary(self, elementDict, keyPrefix, previewMode):
        ourDict = make_dictionary_from_element_dict(keyPrefix, elementDict, \
                self.fieldInfoDict, self, previewMode)
        return ourDict
        
    def applyFileTemplateToDict(self, dictToApply, templateFileName, pathIsAbsolute = False):
        #see if it is in our base directory (e.g. ~/.exe/idevices)
        templateLoadFileBaseName1 = os.path.dirname(__file__) + "/" + templateFileName
        if os.path.isfile(templateLoadFileBaseName1):
           templateLoadFileName = templateLoadFileBaseName1
        else:
            templateLoadFileName = globals.application.config.webDir/"templates"/templateFileName
        
        
        templateFile = open(templateLoadFileName)
        
        #if file_exists()
        templateStr = templateFile.read()
        templateFile.close()
        template = Template(templateStr)
        templateResult = template.safe_substitute(dictToApply)
        return templateResult


"""
Field for storing dropdown selection text
"""        
class ChoiceField(Field): 
    
    persistenceVersion = 3

    #options should be a 2 dimensional list [index][val, desc]
    def __init__(self, idevice, options, name, helptext, defaultText=""):
        Field.__init__(self, name, helptext)
        self.idevice = idevice
        self.options = options
        self.content = defaultText
        
"""
Element for dropdown choice items
Makes a drop down list for renderEdit
"""
class ChoiceElement(Element):
        
    def __init__(self, field):
        Element.__init__(self, field)
        
 
    def process(self, request):
        is_cancel = common.requestHasCancel(request)
        if self.id in request.args and not is_cancel:
            self.field.content = request.args[self.id][0]

    def renderEdit(self):
        html = ""
        html += "<b>" + self.field.name + "</b><br/>"
        html += "<select id='%(elementid)s' name='%(elementid)s'>\"" % {'elementid' : str(self.id) }
        for currentOption in self.field.options:
            selectStr = ""
            if self.field.content == currentOption[0]:
                selectStr = " selected='selected' "

            html += "<option value='%(elementval)s' %(selectstr)s >%(elementdesc)s</option>\n" \
                % {'elementval' : currentOption[0], 'elementdesc' : _(currentOption[1]), 'selectstr' : selectStr }
        html += "</select><br/><br/>"
        return html

    def renderView(self):
        return self.field.content

    def renderPreview(self):
        return self.field.content

"""
Field for storing an individual file
"""
class FileField(Field):
    persistenceVersion = 4
    
    """
    alwaysNameTo - make sure that this file always a certain final name
    """
    def __init__(self, idevice, alwaysNameTo = None, desc="File Field", help="File Field Help"):
        Field.__init__(self, desc, help)
        self.idevice = idevice
        self.fileResource = None
        self.fileInstruc = "Upload a file"
        self.alwaysNameTo = alwaysNameTo
        self.fileDescription = TextField("Description")
        
    def uploadFile(self, filePath):
        if self.fileResource is not None:
            self.fileResource.delete()
        
        finalName = str(filePath)
        if self.alwaysNameTo is not None:
            from os.path import dirname
            from shutil import copyfile
            dirName = dirname(filePath)
            finalName = dirName + "/" + self.alwaysNameTo
            copyfile(filePath, finalName)
            
        resourceFile = Path(finalName)
        if resourceFile.isfile():
            self.idevice.message = ""
            self.fileResource = Resource(self.idevice, resourceFile)
    
    def deleteFile(self):
        if self.fileResource is not None:
            self.fileResource.delete()
            self.fileResource = None
    
    def upgradeToVersion4(self):
        self.fileDescription = TextField("Description")

class FileElement(Element):
    
    def __init__(self, field):
        Element.__init__(self, field)
        self.fileDescriptionElement = TextElement(field.fileDescription)
    
        
    
    """
    Check and see if a new file has been uploaded
    or if we need to delete a file on user request
    """
    def process(self, request):
        self.fileDescriptionElement.process(request)
        
        if "upload" + self.id in request.args:
            if "path" + self.id in request.args:
                filePath = request.args["path"+self.id][0]
                self.field.uploadFile(filePath)
                self.field.idevice.edit = True    
                self.field.idevice.undo = False
                
        if "action" in request.args and request.args["action"][0] == self.id:
            self.field.deleteFile()
            self.field.idevice.edit = True
            self.field.idevice.undo = False
                
    
    def renderEdit(self):
        html  = u"<div>\n"
        
        
        html += common.textInput("path"+self.id, "", 50, \
                    onclick="addFile('%s')" % self.id, readonly="readonly" )
        html += u'<input type="button" onclick="addFile(\'%s\')"' % self.id
        html += u'value="%s" />\n' % _(u"Browse")
        
        buttonName = _(u"Replace")
        if self.field.fileResource is None:
            buttonName = _(u"Upload") 
        
        html += u'<input type="submit" name="%s" value="%s"' % ("upload"+self.id,
                                                                buttonName)
        html += common.elementInstruc(self.field.fileInstruc)
        
        html += self.fileDescriptionElement.renderEdit()
        
        if self.field.fileResource is not None:
            html += "<div class='block'><strong>"
            html += "File %s " % self.field.fileResource.storageName
            html += "</strong></div>"
            
            html += common.submitImage(self.id, self.field.fileResource.storageName,
                                           "/images/stock-cancel.png",
                                           _("Delete File"))
            html += "<hr/>"    
        else:
            html += "<i>No File Uploaded Currently</i>"
        html += "<br/></div>"
        return html
        
        
    def renderView(self):
        return ""
        
    """
    Return the filename of this item if there is one now
    """
    def getFileName(self):
        if self.field.fileResource is not None:
            return self.field.fileResource.storageName
        
        return ""
    
    """
    Return the description if there is one now
    """
    def getDescription(self):
        return self.fileDescriptionElement.renderView()
    
        
    def renderPreview(self):
        html = ""
        if self.field.fileResource is not None:
            html += "Attachment: %s " % self.field.fileResource.storageName
        else:
            html += "Attachment: <i>Empty</i>"
        html += "<br/>"
        return html
"""
This method will add fields to the field array in accordance with fieldInfoArr

fieldOrder is a list of field ids that are in the field dictionary
fieldDict is a dictionary of those ids -> an array of information about
 that field - type, name, instruction (optional: further info dict)
"""
def field_engine_build_fields_on_idevice(fieldInfoDict, fieldDict, idevice):
    
    for fieldInfoKey, fieldInfoArr in fieldInfoDict.items():
        field_engine_check_field(fieldInfoKey, fieldInfoDict, fieldDict, idevice)

    
"""
This method will create new elements on the basis of info from the fieldInfoArr 
as per the format above and connect it with the corresponding fieldArr.  Everything 
must remain in the same order.
"""
def field_engine_build_elements_on_block(fieldInfoDict, fieldDict, idevice):
    fieldCounter = 0
    elementDict = {}
    for fieldInfoKey, fieldInfoArr in fieldInfoDict.items():
        elementTypeName = fieldInfoArr[EXEFIELDINFO_TYPE]
        
        #check the field - if this is a new one or src code edit etc. then add this field...
        field_engine_check_field(fieldInfoKey, fieldInfoDict, fieldDict, idevice)
        newElement = ""
        if elementTypeName == 'image':
            newElement = ImageElement(fieldDict[fieldInfoKey])
        elif elementTypeName == 'text':
            newElement = TextElement(fieldDict[fieldInfoKey])
        elif elementTypeName == 'textarea':
            newElement = TextAreaElement(fieldDict[fieldInfoKey])
        elif elementTypeName == 'choice':
            newElement = ChoiceElement(fieldDict[fieldInfoKey])

        if newElement != "":
            elementDict[fieldInfoKey] = newElement

    return elementDict


"""
This method will take a given http request and process all elements in the array
"""
def field_engine_process_all_elements(elementDict, request):
    for elementId, element in elementDict.items():
        element.process(request)

def getFieldDefaultVal(fieldId, fieldInfoDict):
    if len(fieldInfoDict[fieldId]) > EXEFIELDINFO_EXTRAINFODICT:
        if "defaultval" in fieldInfoDict[fieldId][EXEFIELDINFO_EXTRAINFODICT]:
            return fieldInfoDict[fieldId][EXEFIELDINFO_EXTRAINFODICT]['defaultval']
        
    return None

#
#Check and see if this field is already in the master fieldDict for this
# idevice - if not then create the field and set the parent idevice
#
def field_engine_check_field(fieldId, fieldInfoDict, fieldDict, idevice):
    if fieldId in fieldDict.keys():
        return

    fieldTypeName = fieldInfoDict[fieldId][EXEFIELDINFO_TYPE]
    defaultVal = getFieldDefaultVal(fieldId, fieldInfoDict)
    
    newField = 0
    if fieldTypeName == 'image':
        newField = ImageField(fieldInfoDict[fieldId][EXEFIELDINFO_DESC], fieldInfoDict[fieldId][EXEFIELDINFO_HELP])
    elif fieldTypeName == 'text':
        newField = TextField(fieldInfoDict[fieldId][EXEFIELDINFO_DESC], fieldInfoDict[fieldId][EXEFIELDINFO_HELP])
        if defaultVal is not None:
            newField.content = defaultVal
        
    elif fieldTypeName == 'textarea':
        newField = TextAreaField(fieldInfoDict[fieldId][EXEFIELDINFO_DESC], fieldInfoDict[fieldId][EXEFIELDINFO_HELP])
    elif fieldTypeName == 'choice':
        newField = ChoiceField(idevice, fieldInfoDict[fieldId][EXEFIELDINFO_EXTRAINFODICT]['choices'], fieldInfoDict[fieldId][EXEFIELDINFO_DESC], fieldInfoDict[fieldId][EXEFIELDINFO_HELP])

    newField.idevice = idevice
    
    

    if newField != 0:
        fieldDict[fieldId] = newField   
            
"""
Turns an array of elements into a dictionary mapped prefix.id = element.renderView 
or element.renderPreview if previewMode = true
"""
def make_dictionary_from_element_dict(dictkeyPrefix, elementDict, fieldInfoDict, extendedFieldSet, previewMode):
    ourDict = {}
 
    if previewMode == True:
        ourDict['RESPATH'] = 'resources/'
    else:
        ourDict['RESPATH'] = ''

    for fieldId, element in elementDict.items():
        dictKeyName = ""
        if dictkeyPrefix != "":
            dictKeyName = dictkeyPrefix + "_"
        dictKeyName += str(fieldId)
        dictEntryVal = ""
        if fieldInfoDict[fieldId][EXEFIELDINFO_TYPE] == 'image' and element.field.imageResource is None:
            #catch this to make sure that we dont have that nasty crash if no image yet selected
            dictEntryVal = "<img src='' alt='' width='0' height='0' />"
        else:
            if previewMode == True:
                dictEntryVal = element.renderPreview()
            else:
                dictEntryVal = element.renderView()

        #special kinds of fields - set extra keys for more info
        if fieldInfoDict[fieldId][EXEFIELDINFO_TYPE] == 'image':
            if element.field.imageResource and element.field.imageResource is not None:
                ourDict[dictKeyName + "_imgsrc"] = ourDict['RESPATH'] + element.field.imageResource.storageName
                ourDict[dictKeyName + "_imgwidth"] = element.field.width
                ourDict[dictKeyName + "_imgheight"] = element.field.height
            else:
                ourDict[dictKeyName + "_imgsrc"] = ""
                ourDict[dictKeyName + "_imgwidth"] = "0"
                ourDict[dictKeyName + "_imgheight"] = "0"
            

        ourDict[dictKeyName] = dictEntryVal
        ourDict[dictKeyName + "_elementid"] = str(element.id)
    
    mainElementKey = "elementid"
    if dictkeyPrefix != "":
        mainElementKey = dictkeyPrefix + "_" + mainElementKey
    ourDict[mainElementKey] = str(extendedFieldSet.id)

    ourDict['ideviceid'] = str(extendedFieldSet.idevice.id)
    

    return ourDict

"""
Check and see if there is a reques to delete this element given by
common.submitButton with teh element id

If there is delete it from the given field list that would be associated
with the idevice
"""
def field_engine_check_delete(element, request, fieldList):
    if "action" in request.args and request.args["action"][0] == element.id:
        fieldList.remove(element.field)
        element.field.idevice.undo = False
        element.field.idevice.edit = True

"""
Go through all the elements in the given list and check to see
if they need deleted
"""
def field_engine_check_delete_all(elementList, request, fieldList):
    for element in elementList:
        field_engine_check_delete(element, request, fieldList)
    
"""
Utility method to make a delete button for elements in an idevice to remove
them from a list - works together with field_engine_check_delete
"""
def field_engine_make_delete_button(element, imgAltText = "Delete Item"):
    html = ""
    html += common.submitImage(element.id, element.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _(imgAltText))
    return html

"""
Check to see if this request means to delete the idevice
"""
def field_engine_is_delete_request(request):
    if 'action' in request.args and "delete" in request.args['action']:
        return True
    
    return False

"""

"""
def field_engine_apply_template_to_element_arr(templateString, elementArr, fieldInfoArr):
    template = Template(templateString)
    ourDict = make_dictionary_from_element_array("", elementArr, fieldInfoArr)
    retVal = template.safe_substitute(ourDict)
    return retVal

