<p>
<?php
    $useragent = strtolower($_SERVER['HTTP_USER_AGENT']);
    $eduforge  = "http://eduforge.org/frs/download.php/99";

    if (strstr($useragent, "win")) 
    {
        print "Download eXe for Windows<br/>\n";
        print "<a href=\"http://eduforge.org/frs/download.php/193/eXe-install-0.14.exe\">";
        print "eXe_install_0.14.exe</a><br/>\n";
    }
    else if (strstr($useragent, "linux")) 
    {
        print "Download eXe for Linux<br/>\n";
        if (strstr($useragent, "ubuntu")) 
        {
            print "<a href=\"http://eduforge.org/frs/download.php/191/python2.4-exe_0.14-0.1ubuntu1_all.deb\">";
            print "python2.4-exe_0.14-0.1ubuntu1_all.deb</a><br/>\n";
            print "<a href=\"http://eduforge.org/frs/download.php/141/python2.4-twisted_2.0.1-999_all.deb\">";
            print "python2.4-twisted_2.0.1-999_all.deb</a><br/>\n";
            print "</p><p>or</p>";
            print "<p>add this line to your /etc/apt/sources.list:</p>";
            print "<p><code>deb ftp ftp://ftp.eduforge.org/pub/exe/ubuntu current contrib</code></p>";
            print "<p>And then type <code>apt-get install python2.4-exe</code> as root.</p><p>";
        }
        else
        {
            print "<a href=\"http://eduforge.org/frs/download.php/190/exe-0.14-1.noarch.rpm\">";
            print "exe-0.14-1.noarch.rpm</a><br/>\n";
            print "<a href=\"http://eduforge.org/frs/download.php/108/exe-twisted-2.0-2.noarch.rpm\">";
            print "exe-twisted-2.0-1.noarch.rpm</a><br/>\n";
        }
    }
    else if (strstr($useragent, "mac")) 
    {
        print "Download eXe for Mac OSX<br/>\n";
        print "<a href=\"http://eduforge.org/frs/download.php/136/exe.mac.experimental.0.11.zip\">";
        print "exe.mac.experimental.0.11.zip</a><br/>\n";
    } 
    else
    {
        print "Sorry I didn't recognize your operating system.<br/>\n";
        print "Download eXe sourcecode<br/>\n";
        print "<a href=\"http://eduforge.org/frs/download.php/195/exe-0.14-source.tgz\">";
        print "exe-source-0.14.tgz</a><br/>\n";
    }
?>
</p>
<p>
Other eXe files are available on
<a href="http://eduforge.org/frs/?group_id=20">Eduforge</a> or
<a href="http://sourceforge.net/project/showfiles.php?group_id=94655">Sourceforge</a> 
</p>

