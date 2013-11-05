# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================
"""
BuiltInBlocks imports the iDevice blocks which are built-in (i.e. not
plugins) to eXe
"""

from exe.webui.freetextblock          import FreeTextBlock
from exe.webui.genericblock           import GenericBlock
from exe.webui.multichoiceblock       import MultichoiceBlock
from exe.webui.reflectionblock        import ReflectionBlock
from exe.webui.casestudyblock         import CasestudyBlock
from exe.webui.truefalseblock         import TrueFalseBlock
from exe.webui.imagewithtextblock     import ImageWithTextBlock
from exe.webui.wikipediablock         import WikipediaBlock
from exe.webui.attachmentblock        import AttachmentBlock
from exe.webui.galleryblock           import GalleryBlock
from exe.webui.clozeblock             import ClozeBlock
#from exe.webui.clozelangblock             import ClozelangBlock
from exe.webui.flashwithtextblock     import FlashWithTextBlock
from exe.webui.externalurlblock       import ExternalUrlBlock
from exe.webui.imagemagnifierblock    import ImageMagnifierBlock
from exe.webui.mathblock              import MathBlock
from exe.webui.multimediablock        import MultimediaBlock
from exe.webui.rssblock               import RssBlock
from exe.webui.multiselectblock       import MultiSelectBlock
from exe.webui.appletblock            import AppletBlock
from exe.webui.flashmovieblock        import FlashMovieBlock
from exe.webui.quiztestblock          import QuizTestBlock
from exe.webui.listablock             import ListaBlock
from exe.webui.notablock             import NotaBlock

from exe.webui.sortblock import SortBlockInc
from exe.webui.hangmanblock import HangmanBlockInc
from exe.webui.clickinorderblock import ClickInOrderBlockInc
from exe.webui.memorymatchblock import MemoryMatchBlockInc
from exe.webui.placetheobjectsblock import PlaceTheObjectsBlockInc
from exe.webui.fileattachblock import FileAttachBlockInc
# JR
# Necesarios para la FPD
from exe.webui.clozefpdblock		import ClozefpdBlock
from exe.webui.clozelangfpdblock	import ClozelangfpdBlock
from exe.webui.reflectionfpdblock	import ReflectionfpdBlock
from exe.webui.reflectionfpdmodifblock	import ReflectionfpdmodifBlock
from exe.webui.parasabermasfpdblock	import ParasabermasfpdBlock
from exe.webui.debesconocerfpdblock	import DebesconocerfpdBlock
from exe.webui.citasparapensarfpdblock	import CitasparapensarfpdBlock
from exe.webui.recomendacionfpdblock	import RecomendacionfpdBlock
from exe.webui.verdaderofalsofpdblock	import VerdaderofalsofpdBlock
from exe.webui.seleccionmultiplefpdblock	import SeleccionmultiplefpdBlock
from exe.webui.eleccionmultiplefpdblock	import EleccionmultiplefpdBlock
from exe.webui.casopracticofpdblock	import CasopracticofpdBlock
from exe.webui.ejercicioresueltofpdblock	import EjercicioresueltofpdBlock
from exe.webui.destacadofpdblock	import DestacadofpdBlock
#from exe.webui.correccionfpdblock	import CorreccionfpdBlock
from exe.webui.orientacionesalumnadofpdblock	import OrientacionesalumnadofpdBlock
from exe.webui.orientacionestutoriafpdblock	import OrientacionestutoriafpdBlock
from exe.webui.freetextfpdblock	import FreeTextfpdBlock

#modification by lernmodule.net
from exe.webui.scormdropdownblock     import ScormDropDownBlock
from exe.webui.scormclozeblock        import ScormClozeBlock
from exe.webui.scormmultiselectblock  import ScormMultiSelectBlock
from exe.webui.scormmulticlozeblock   import ScormMultiClozeBlock
#end modification
# ===========================================================================


