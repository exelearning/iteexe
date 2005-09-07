"""
This class is both a renderable and a LivePage/Resource
"""

from exe.webui.renderable import Renderable
from nevow.livepage       import LivePage
from twisted.web.resource import Resource

class RenderableLivePage(_RenderablePage, LivePage):
    """
    This class is both a renderable and a LivePage/Resource
    """

    def __init__(self, parent, package=None, config=None):
        """
        Same as Renderable.__init__ but
        """
        LivePage.__init__(self)
        _RenderablePage.__init__(self, parent, package, config)
