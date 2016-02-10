Don't forget to add these styles to your content_css file:

.pre-code,.highlighted-code{background:#112C4A;font-family:Monaco,Courier,monospace;border-radius:9px;margin:2em 1em;overflow:auto;padding:20px}
.pre-code code,.highlighted-code code{color:#E7ECF1;font-size:12px}
.highlighted-code{background:#F5F2F0}
.highlighted-code code{color:#000}
.code-style-2{background:#333029}
.code-style-2 code{color:#FFF}

Your site should also have the Styles, as well as these files:
	/cms_tools/src/main/webapp/html/templates/files/highlighter/scribe_highlighter.js
	/cms_tools/src/main/webapp/html/templates/files/highlighter/scribe_highlighter.css
Those files are part of Prism, by Lea Verou (http://lea.verou.me), under the MIT license http://www.opensource.org/licenses/mit-license.php/
scribe_highlighter.css: okaidia theme for JavaScript, CSS and HTML (loosely based on Monokai textmate theme by http://www.monokai.nl/) by ocodia