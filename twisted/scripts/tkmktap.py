
# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.

#

"""Implementation module for the graphical version of the `mktap` command.
"""

# System imports
import tkinter, tkinter.messagebox, tkinter.filedialog, io, os
import traceback

# Twisted imports
from twisted.application import service
from twisted.internet import tksupport, reactor
from twisted.scripts import mktap
from twisted.python import usage, reflect
from twisted.copyright import version


class TkMkAppFrame(tkinter.Frame):
    """
    A frame with all the necessary widgets to configure a Twisted Application.
    """

    # Plugin currently selected
    coil = None
    
    # Options instance currently displayed
    options = None

    # Frame options are displayed in
    optFrame = None

    def __init__(self, master, coil):
        tkinter.Frame.__init__(self, master)

        self.setupMkTap()
        self.reset(coil)


    def setupMkTap(self):
        # Create all of the "mktap" option widgets
        appFrame = tkinter.Frame(self)

        f = tkinter.Frame(appFrame)
        listLabel = tkinter.Label(f, text='TAp Format')
        self.typeList = tkinter.Listbox(f, background='white')
        self.typeList['height'] = 3
        for t in ('pickle', 'xml', 'source'):
            self.typeList.insert(tkinter.END, t)
        self.typeList.selection_set(0)

        listLabel.pack(side=tkinter.TOP)
        self.typeList.pack(side=tkinter.TOP)
        f.pack(side=tkinter.LEFT, anchor=tkinter.N)

        f = tkinter.Frame(appFrame)
        tapLabel = tkinter.Label(f, text='TAp Filename')
        tapButton = tkinter.Button(f, text="Choose", command=self.pickTapFile)
        self.tapfile = tkinter.Entry(f, background='white')

        tapLabel.pack(side=tkinter.LEFT)
        self.tapfile.pack(side=tkinter.LEFT)
        tapButton.pack(side=tkinter.LEFT)
        f.pack(side=tkinter.TOP, anchor=tkinter.E)

        f = tkinter.Frame(appFrame)
        nameLabel = tkinter.Label(f, text='Application Process Name')
        self.appname = tkinter.Entry(f, background='white')

        nameLabel.pack(side=tkinter.LEFT)
        self.appname.pack(side=tkinter.LEFT)
        f.pack(side=tkinter.TOP, anchor=tkinter.E)

        f = tkinter.Frame(appFrame)
        encLabel = tkinter.Label(f, text='Passphrase')
        self.passphrase = tkinter.Entry(f, background='white')

        encLabel.pack(side=tkinter.LEFT)
        self.passphrase.pack(side=tkinter.LEFT)
        f.pack(side=tkinter.TOP, anchor=tkinter.E)

        f = tkinter.Frame(appFrame)
        self.append = tkinter.BooleanVar()
        appLabel = tkinter.Label(f, text='Append')
        appButton = tkinter.Checkbutton(f, variable=self.append)

        appLabel.pack(side=tkinter.LEFT)
        appButton.pack(side=tkinter.LEFT)
        f.pack(side=tkinter.LEFT, anchor=tkinter.E)

        f = tkinter.Frame(appFrame)
        s = tkinter.StringVar()
        s.set(not hasattr(os, 'getuid') and '0' or str(os.getuid()))
        uidLabel = tkinter.Label(f, text='UID')
        self.uid = tkinter.Entry(f, text=s, background='white')

        uidLabel.pack(side=tkinter.LEFT)
        self.uid.pack(side=tkinter.LEFT)
        f.pack(side=tkinter.BOTTOM)

        f = tkinter.Frame(appFrame)
        s = tkinter.StringVar()
        s.set(not hasattr(os, 'getgid') and '0' or str(os.getgid()))
        gidLabel = tkinter.Label(f, text='GID')
        self.gid = tkinter.Entry(f, text=s, background='white')

        gidLabel.pack(side=tkinter.LEFT)
        self.gid.pack(side=tkinter.LEFT)
        f.pack(side=tkinter.BOTTOM)

        appFrame.grid(row=0, column=0, columnspan=3, sticky=tkinter.N + tkinter.S)


    def pickTapFile(self):
        r = tkinter.filedialog.askopenfilename()
        if r:
            self.tapfile.delete(0, tkinter.END)
            self.tapfile.insert(tkinter.END, r)


    def reset(self, coil):
        """
        Remove the existing coil-specific widgets and then create and add
        new ones based on the given plugin object.
        """
        if coil is self.coil:
            return

        try:
            opt = coil.load().Options()
        except:
            f = io.StringIO()
            traceback.print_exc(file=f)
            # XXX - Why is this so narrow?
            tkinter.messagebox.showerror(title="Options Error", message=f.getvalue(), parent=self)
            return

        if self.optFrame:
            self.optFrame.forget()
            self.optFrame.destroy()
            self.optFrame = None

        self.coil = coil
        self.options = opt
        self.optFrame = TkConfigFrame(self, self.options)
        self.optFrame.grid(row=1, column=0)

#        self.tapfile.delete(0, Tkinter.END)
#        try:
#            self.tapfile.insert(Tkinter.END, self.coil.tapname)
#        except AttributeError:
#            self.tapfile.insert(Tkinter.END, self.coil.name)
    
    
    def copyOptions(self):
        # Snarf the data out of the widgets and place them into the Options
        # instance.
        extra = self.optFrame.updateConfig(self.options)
    
        self.options['filename'] = self.tapfile.get()
        self.options['appname'] = self.appname.get()
        self.options['passphrase'] = self.passphrase.get()

        self.options['append'] = self.append.get()
        self.options['encrypted'] = len(self.options['passphrase'])

        self.options['uid'] = int(self.uid.get())
        self.options['gid'] = int(self.gid.get())
        
        try:
            self.options['type'] = self.typeList.curselection()[0]
        except IndexError:
            raise usage.UsageError("Select a TAp Format")
        self.options['help'] = 0
        
        if extra:
            try:
                # XXX - this is wrong.  It needs to respect quotes, etc.
                self.options.parseArgs(extra.split())
            except TypeError:
                raise usage.UsageError("Wrong number of extra arguments")
        self.options.postOptions()


    def createApplication(self):
        if not self.options:
            tkinter.messagebox.showerror(message="Select an Application first")
            return

        try:
            self.copyOptions()
        except usage.UsageError as e:
            tkinter.messagebox.showerror(message=str(e))
            return

        exists = os.path.exists(self.options['filename'])
        if self.options['append'] and exists:
            a = service.loadApplication(
                self.options['filename'],
                self.options['type'],
                self.options['passphrase']
            )
        else:
            if exists:
                overwrite = tkinter.messagebox.askyesno(title='File Exists', message='Overwrite?')
                if not overwrite:
                    return
            a = service.Application(self.coil.name, self.options['uid'], self.options['gid'])

        try:
            s = mktap.makeService(
                self.coil.load(),
                self.options['appname'],
                self.options
            )
        except usage.UsageError:
            f = io.StringIO()
            traceback.print_stack(file=f)
            tkinter.messagebox.showerror(title="Usage Error", message=f.getvalue(), parent=self)
        else:
            try:
                mktap.addToApplication(
                    s, self.coil.name, self.options['append'],
                    self.options['appname'], self.options['type'],
                    self.options['encrypted'], self.options['uid'],
                    self.options['gid'],
                )
            except:
                f = io.StringIO()
                traceback.print_exc(file=f)
                print(f.getvalue())
                tkinter.messagebox.showerror(title="Usage Error", message=f.getvalue(), parent=self)
            else:
                filename = self.options['filename']
                if not filename:
                    filename = self.coil.name
                tkinter.messagebox.showinfo(message="Wrote " + filename)


    def destroy(self):
        reactor.crash()
        tkinter.Frame.destroy(self)


#
# This class was written based on code from Drew "drewp" Pertulla
# (<drewp (at) bigasterisk (dot) com>) - without his help, tkmktap
# would be an ugly POS.
#
class ParameterLine(tkinter.Frame):
    def __init__(self, master, lines, label, desc, default, cmd, **kw):
        tkinter.Frame.__init__(self, master, relief='raised', bd=1, **kw)
        
        self.lines = lines

        l = tkinter.Label(
            self, text=label, wraplen=200,
            width=30, anchor='w', justify='left'
        )

        s = tkinter.StringVar()
        if default:
            s.set(default)
        self.entry = tkinter.Entry(self, text=s, background='white')
        self.flag = label

        more = tkinter.Button(
            self, text='+',
            command=lambda f = cmd, a = label, b = default, c = desc: f(a, b, c)
        )

        l.pack(side=tkinter.LEFT, fill='y')
        self.entry.pack(side=tkinter.LEFT)
        more.pack(side=tkinter.LEFT)

        l.bind("<Enter>", self.highlight)
        l.bind("<Leave>", self.unhighlight)

        l.bind("<ButtonPress-1>", self.press)
        l.bind("<B1-ButtonRelease>", self.release)
        l.bind("<B1-Motion>", self.motion)


    def highlight(self, ev, hicolor = 'gray90'):
        # make the label light up when you mouseover
        ev.widget._oldcolor = self.cget('bg')
        ev.widget.config(bg=hicolor)


    def unhighlight(self, ev):
        # make the label return to its old setting
        try:
            ev.widget.config(bg=ev.widget._oldcolor)
            del ev.widget._oldcolor
        except:
            pass


    # make the frame change order when you drag it (by its label)
    def press(self, ev):
        # save old attrs
        self._oldrelief = self.cget('relief'), self.cget('bd')
        # thicken the border
        self.config(relief='raised', bd=3)
    
    
    def motion(self, ev):
        this = self.lines.index(self)
        framey = ev.y + self.winfo_y()   # get mouse y coord in parent frame
        replace = this   # replace will be the index of the row to swap with
        for i, l in zip(list(range(len(self.lines))), self.lines):
            y1 = l.winfo_y()
            y2 = y1 + l.winfo_height()
            if y1 < framey < y2:
                replace = i
        if replace != this:
            # we moved over another row-- swap them
            self.lines[replace], self.lines[this] = self.lines[this], self.lines[replace]

            # and re-assign all rows in the new order
            for i, l in zip(list(range(len(self.lines))), self.lines):
                l.grid(row=i, column=0)


    def release(self, ev):
        # restore the old border width
        try:
            rel, bd = self._oldrelief
            self.config(relief=rel, bd=bd)
            del self._oldrelief
        except:
            pass


class TkConfigFrame(tkinter.Frame):
    optFrame = None
    paramFrame = None
    commandFrame = None

    subCmdFrame = None
    previousCommand = None

    optFlags = None
    paramLines = None
    
    def __init__(self, master, options):
        tkinter.Frame.__init__(self, master)
        self.options = options
        
        self.setupOptFlags()
        self.setupOptParameters()
        self.setupSubCommands()
        self.setupExtra()


    def getOptFlags(self):
        return self.optFlags
    
    
    def getOptParameters(self):
        r = []
        for p in self.paramLines:
            r.append((p.flag, p.entry.get()))
        return r


    def updateConfig(self, options):
        for (opt, var) in self.getOptFlags():
            var = var.get()

            if not var:
                continue # XXX - this is poor - add a '-' button to remove options 

            f = getattr(options, 'opt_' + opt, None)
            if f:
                f()
            else:
                options[opt] = var

        for (opt, var) in self.getOptParameters():

            if not var:
                continue # XXX - this is poor - add a '-' button to remove options 

            f = getattr(options, 'opt_' + opt, None)
            if f:
                f(var)
            else:
                options[opt] = var
        return self.extra.get()


    def setupOptFlags(self):
        self.optFlags = []
        flags = []
        if hasattr(self.options, 'optFlags'):
            flags.extend(self.options.optFlags)

        d = {}
        soFar = {}
        for meth in reflect.prefixedMethodNames(self.options.__class__, 'opt_'):
            full = 'opt_' + meth
            func = getattr(self.options, full)

            if not usage.flagFunction(func) or meth in ('help', 'version'):
                continue
            
            if func in soFar:
                continue
            soFar[func] = 1
            
            existing = d.setdefault(func, meth)
            if existing != meth:
                if len(existing) < len(meth):
                    d[func] = meth
            
            for (func, name) in list(d.items()):
                flags.append((name, None, func.__doc__))
            
            if len(flags):
                self.optFrame = f = tkinter.Frame(self)
                for (flag, _, desc) in flags:
                    b = tkinter.BooleanVar()
                    c = tkinter.Checkbutton(f, text=desc, variable=b, wraplen=200)
                    c.pack(anchor=tkinter.W)
                    self.optFlags.append((flag, b))
                f.grid(row=1, column=1)


    def setupOptParameters(self):
        params = []
        if hasattr(self.options, 'optParameters'):
            params.extend(self.options.optParameters)

        d = {}
        soFar = {}
        for meth in reflect.prefixedMethodNames(self.options.__class__, 'opt_'):
            full = 'opt_' + meth
            func = getattr(self.options, full)

            if usage.flagFunction(func) or func in soFar:
                continue
            
            soFar[func] = 1

            existing = d.setdefault(func, meth)
            if existing != meth:
                if len(existing) < len(meth):
                    d[func] = meth
        for (func, name) in list(d.items()):
            params.append((name, None, None, func.__doc__))

        if len(params):
            self.paramFrame = tkinter.Frame(self)
            self.paramLines = []
            for (flag, _, default, desc) in params:
                try:
                    default = self.options[flag]
                except KeyError:
                    pass
                self.makeField(flag, default, desc)
            self.paramFrame.grid(row=1, column=2)



    def makeField(self, flag, default, desc):
        line = ParameterLine(
            self.paramFrame, self.paramLines, flag, desc, default,
            cmd=self.makeField
        )
        self.paramLines.append(line)
        line.grid(row=len(self.paramLines), column=0)


    def setupSubCommands(self):
        self.optMap = {}
        if hasattr(self.options, 'subCommands'):
            self.commandFrame = f = tkinter.Frame(self)
            self.cmdList = tkinter.Listbox(f)
            for (cmd, _, opt, desc) in self.options.subCommands:
                self.cmdList.insert(tkinter.END, cmd)
                self.optMap[cmd] = opt()
            self.cmdList.pack()
            self.subCmdPoll = reactor.callLater(0.1, self.pollSubCommands)
            f.grid(row=1, column=3)


    def setupExtra(self):
        f = tkinter.Frame(self)
        l = tkinter.Label(f, text='Extra Options')
        self.extra = tkinter.Entry(f, background='white')
        l.pack()
        self.extra.pack(fill='y')
        f.grid(row=2, column=1, columnspan=2)


    def pollSubCommands(self):
        s = self.cmdList.curselection()
        if len(s):
            s = s[0]
            if s != self.previousCommand:
                if self.subOptFrame:
                    self.subOptFrame.forget()
                    self.subOptFrame.destroy()
                    self.subOptFrame = TkConfigFrame(self.commandFrame, self.optMap[s])
                    self.subOptFrame.pack()
        self.subCmdPoll = reactor.callLater(0.1, self.pollSubCommands)
    
    
class TkAppMenu(tkinter.Menu):
    def __init__(self, master, create, callback, items):
        tkinter.Menu.__init__(self, master)

        cmdMenu = tkinter.Menu(self)
        self.add_cascade(label="Actions", menu=cmdMenu)
        
        cmdMenu.add_command(label='Create', command=create)
        cmdMenu.add_separator()
        cmdMenu.add_command(label='Quit', command=reactor.crash)

        tapMenu = tkinter.Menu(self)
        self.add_cascade(label="Applications", menu=tapMenu)

        for item in items:
            tapMenu.add_command(
                label=item, command=lambda i=item, c = callback: c(i)
            )


def run():
    taps = mktap.loadPlugins()
    r = tkinter.Tk()
    r.withdraw()
    
    keyList = list(taps.keys())
    keyList.sort()

    config = TkMkAppFrame(r, None)
    menu = TkAppMenu(
        r,
        config.createApplication,
        lambda i, d = taps, c = config: c.reset(d[i]),
        keyList
    )

    config.pack()
    r['menu'] = menu

    r.title('Twisted Application Maker ' + version)
    r.deiconify()
    tksupport.install(r)
    reactor.run()

if __name__ == '__main__':
    run()
