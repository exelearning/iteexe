# Set the C flags to include the GTK+ and Python libraries

# Note: if you want to build the module, run "make gtkmoz.so", but
# you'll need to edit the next line to point to the right path, this
# is not the recommended way of doing things, see the README file
# for proper installation directions. 

CFLAGS = `pkg-config --cflags gtk+-2.0 pygtk-2.0 mozilla-gtkmozembed ` -I/usr/include/python2.3/ -I.
LDFLAGS = `pkg-config --libs gtk+-2.0 pygtk-2.0 mozilla-gtkmozembed`

all: gtkmoz.c

# Build the shared object
gtkmoz.so: gtkmoz.o gtkmozmodule.o
	$(CC) $(LDFLAGS) -shared $^ -o $@

# The path to the GTK+ python types
DEFS=`pkg-config --variable=defsdir pygtk-2.0`

# Generate the C wrapper from the defs and our override file
gtkmoz.c: gtkmoz.defs gtkmoz.override
	pygtk-codegen-2.0 --prefix gtkmoz \
	--register $(DEFS)/gdk-types.defs \
	--register $(DEFS)/gtk-types.defs \
	--override gtkmoz.override \
	gtkmoz.defs > $@

# A rule to clean the generated files
clean:
	rm -f gtkmoz.so *.o gtkmoz.c *~ 

.PHONY: clean
