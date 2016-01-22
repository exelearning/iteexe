"""Helper functions and classes related to SSL contexts to disable SSL certificate checks until Procomun publication
service is in production.
"""

import ssl
from urllib2 import HTTPSHandler
import suds.transport.http


def create_ssl_context(verify=True, cafile=None, capath=None):
    """Set up the SSL context.
    """
    # This is somewhat tricky to do it right and still keep it
    # compatible across various Python versions.

    try:
        # The easiest and most secure way.
        # Requires either Python 2.7.9 or 3.4 or newer.
        context = ssl.create_default_context(cafile=cafile, capath=capath)
        if not verify:
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
    except AttributeError:
        # ssl.create_default_context() is not available.
        try:
            context = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
        except AttributeError:
            # We don't even have the SSLContext class.  This smells
            # Python 2.7.8 or 3.1 or older.  Bad luck.
            return None
        context.options |= ssl.OP_NO_SSLv2
        context.options |= ssl.OP_NO_SSLv3
        if verify:
            context.verify_mode = ssl.CERT_REQUIRED
            if cafile or capath:
                context.load_verify_locations(cafile, capath)
            else:
                context.set_default_verify_paths()
        else:
            context.verify_mode = ssl.CERT_NONE
    return context


class HTTPSTransport(suds.transport.http.HttpTransport):
    """A modified HttpTransport using an explicit SSL context.
    """

    def __init__(self, context, **kwargs):
        """Initialize the HTTPSTransport instance.

        :param context: The SSL context to use.
        :type context: :class:`ssl.SSLContext`
        :param kwargs: keyword arguments.
        :see: :class:`suds.transport.http.HttpTransport` for the
            keyword arguments.
        """
        suds.transport.http.HttpTransport.__init__(self, **kwargs)
        self.ssl_context = context
        self.verify = (context and context.verify_mode != ssl.CERT_NONE)

    def u2handlers(self):
        """Get a collection of urllib handlers.
        """
        handlers = suds.transport.http.HttpTransport.u2handlers(self)
        if self.ssl_context:
            try:
                handlers.append(HTTPSHandler(context=self.ssl_context, 
                                             check_hostname=self.verify))
            except TypeError:
                # Python 2.7.9 HTTPSHandler does not accept the
                # check_hostname keyword argument.
                #
                # Note that even older Python versions would also
                # croak on the context keyword argument.  But these
                # old versions do not have SSLContext either, so we
                # will not end up here in the first place.
                handlers.append(HTTPSHandler(context=self.ssl_context))
        return handlers
