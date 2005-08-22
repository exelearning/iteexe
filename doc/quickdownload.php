<p>
<?php
    $useragent = strtolower($_SERVER['HTTP_USER_AGENT']);
    $eduforge  = "http://eduforge.org/frs/download.php/99";

    if (strstr($useragent, "win")) 
    {
        print "Download eXe for Windows<br/>\n";
        print "<a href=\"$eduforge/eXe_install_windows.exe\">";
        print "eXe_install_windows.exe</a><br/>\n";
    }
    else if (strstr($useragent, "linux")) 
    {
        print "Download eXe for Linux<br/>\n";
        print "<a href=\"$eduforge/exe-0.6.1-2.noarch.rpm\">";
        print "exe-0.6.1-2.noarch.rpm</a><br/>\n";
        print "<a href=\"$eduforge/exe-twisted-2.0-1.noarch.rpm\">";
        print "exe-twisted-2.0-1.noarch.rpm</a><br/>\n";
    }
    else 
    {
        if (strstr($useragent, "mac")) 
        {
            print "Creating a Mac install is something we're still working ";
            print "towards.<br/>\n";
            print "(There's more information in the README if you're ";
            print "interested in helping.)<br/>\n";
        } 
        else
        {
            print "Sorry I didn't recognize your operating system.<br/>\n";
        }
        print "Download eXe sourcecode<br/>\n";
        print "<a href=\"$eduforge/exe-source-0.6.1.tgz\">";
        print "exe-source-0.6.1.tgz</a><br/>\n";
    }
?>
</p>
<p>
Other eXe files are available on
<a href="http://eduforge.org/frs/?group_id=20">Eduforge</a> or
<a href="http://sourceforge.net/project/showfiles.php?group_id=94655">Sourceforge</a> 
</p>
