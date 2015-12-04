M.util.get_string = function (term, pkg) {
    var string = [];
    string['pluginname'] = 'TinyMCE Mathslate';
    string['title'] = 'MathSlate Editor';
    string['inline'] = 'Inline Math';
    string['inline_desc'] = 'Insert math within a sentence or paragraph';
    string['display'] = 'Display Math';
    string['display_desc'] = 'Insert math on a separate line';
    string['cancel'] = 'Cancel';
    string['cancel_desc'] = 'Quit and do not save work';
    string['undo'] = 'Undo previous action';
    string['redo'] = 'Redo the action just undone';
    string['clear'] = 'Delete selection or the entire expression';
    string['help'] = 'Access documentation';
    string['mathslate'] = 'MathSlate';
    string['requiretex'] = 'Require TeX filter';
    string['requiretex_desc'] = 'If enabled the Mathslate button is visible only when the TeX filter is enabled in the editor context. Disable if you want it to appear globally (normal if MathJax is included in header sitewide).';
    string['mathjaxurl'] = 'MathJax url';
    string['mathjaxurl_desc'] = 'The url for the MathJax.js file that mathslate should load if MathJax is not already present and configured (probably true if you are using the Moodle TeX filter). The default downloads from the internet using http. If your site uses https use "https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js" or better install a local copy.';
    string['nomathjax'] = '<p>MathJax does not seem to be present on this site. In order to use this plugin MathJax needs to be configured. MathJax is an opensource software library that is capable of displaying mathmatics in any javascript enabled browser.  Mathslate uses it to render mathematics within the editor. Therefore you should check with the system administrator of this site to see whether MathJax may be installed. See <a href="http://mathjax.org" target="_blank">mathjax.org</a> for more instructions.</p>';
    string['mathslate:desc'] = 'Insert equation';
    
    return string[term];
}

