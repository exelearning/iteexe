"""
This unit provides a base class for something that is rendered, this can be
a page, a pane, a block, even part of XUL like the outlinePane but not really
going down to the element level. We'll call them rendering components.

It provides a way to get at your parent rendering component, the top bieng the
mainpage, who has no parent. It also it provides you with a config instance and
a package instance.  Finally it makes you a LivePage and a Resource descendant,
but you don't have to use that functionality. It means you can use a rendering
template to do your rendering, even if you're part of a bigger block.
"""

from nevow import loaders
from nevow.livepage import LivePage
from twisted.web.resource import Resource

# Constants
# This constant is used as a special variable like None but this means that an
# attribute is Unset it tells __getattribute__ that it needs to really return
# this value.  We do all this complicated stuff to stop pylint complaining about
# our magically gotten variables.
Unset = object()
# This is a constant that means, we don't have an attribute of this name
DontHave = object()


class Renderable(object):
    """
    A base class for all things rendered
    """

    # Set this to a template filename if you are use a template page to do 
    # your rendering
    _templateFileName = ''
    name = None # Must provide a name in dervied classes, or pass one to
    #__init__

    # Default attribute values
    docFactory = None

    def __init__(self, parent, package=None, webserver=None, name=None):
        """
        Pass me a 'parent' rendering component,
        a 'package' that I'm rendering for
        and a 'webserver' instance reference (from webserver.py)
        If you don't pass 'webserver' and 'package' I'll
        get them from 'parent'
        'name' is a identifier to distuniguish us from the other children of our
        parent
        """
        self.parent = parent # This is the same for both blocks and pages
        if name:
            self.name = name
        elif not self.name:
            raise AssertionError('Element of class "%s" created with no name.' %
                                 self.__class__.__name__)
            
        # Make pylint happy. These attributes will be gotten from
        # self.application
        self.config = Unset
        self.ideviceStore = Unset
        self.packageStore = Unset

        # Overwrite old instances with same name
        if parent:
            parent.renderChildren[self.name] = self
        self.renderChildren = {}
        if package:
            self.package = package
        elif parent:
            self.package = parent.package
        else:
            self.package = None
        if webserver:
            self.webserver = webserver
        elif parent:
            self.webserver = parent.webserver
        else:
            self.webserver = None
        if self._templateFileName:
            if hasattr(self, 'config') and self.config:
                pth = self.config.webDir/'templates'/self._templateFileName
                self.docFactory = loaders.xmlfile(pth)
            else:
                # Assume directory is included in the filename
                self.docFactory = loaders.xmlfile(self._templateFileName)

    # Properties
    def getRoot(self):
        """
        Returns the highest renderable in the tree
        that doesn't have a parent.
        Basically 'PackageRedirector'
        """
        renderable = self
        while renderable.parent:
            renderable = renderable.parent
        return renderable
    root = property(getRoot)

    def delete(self):
        """
        Removes our self from our parents tree
        """
        del self.parent.renderChildren[self.name]

    def __getattribute__(self, attr):
        """
        Sets unset attributes.
        """
        def baseget(name):
            """
            Gets values the old proper way
            but instead of raising AttributeErro
            returns the constant 'DontHave'
            """
            try:
                return object.__getattribute__(self, name)
            except AttributeError:
                return DontHave
        res = baseget(attr)
        if res is Unset or res is DontHave:
            if attr.startswith('render_'):
                name = attr.split('_', 1)[-1]
                res = baseget('renderChildren')[name].render
            elif baseget('webserver'):
                # If not, see if what they're looking for is in the app object
                res = getattr(baseget('webserver').application, attr)
            setattr(self, attr, res)
        return res

    def process(self, request):
        """
        Called when a request comes in.
        This implementation automatically
        passes on the request to all our
        child renderables
        """
        # Pass the request on to each rendering component
        # child that is not a seperate page in itself
        for rc in self.renderChildren.values():
            if not isinstance(rc, _RenderablePage):
                # Only sub pages need to have process passed to them
                rc.process(request)


class _RenderablePage(Renderable):
    """
    For internal use only
    """

    def __init__(self, parent, package=None, config=None):
        """
        Same as Renderable.__init__ but uses putChild to put ourselves
        in our parents sub-page tree
        """
        Renderable.__init__(self, parent, package, config)
        if parent:
            self.parent.putChild(self.name, self)


class RenderableResource(_RenderablePage, Resource):
    """
    It is a page and renderable, but not live
    """

    def __init__(self, parent, package=None, config=None):
        """
        See Renderable.__init__ docstring
        """
        Resource.__init__(self)
        _RenderablePage.__init__(self, parent, package, config)


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
