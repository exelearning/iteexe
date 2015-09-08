# CodeMagic

CodeMagic is a replacement source code editor plugin for Tinymce which integrates the [CodeMirror] (http://www.codemirror.net/) library for syntax highlighting.

## Usage

1. Drop the plugin folder in to your tinymce plugin directory
2. In the *plugins* section of your *tinyMCE.init* add **codemagic**
3. In your *buttons* configuration (eg, *theme\_advanced\_buttons3*) add **codemagic** (you would usually replace the *code* entry)

By default the key used for localStorage is 'tinymce:codemagic' and every instance of TinyMCE you use with the CodeMagic plugin will retain the same theme (if your browser supports localStorage).  If you'd like to have different themes saved for different instances, then in your *tinyMCE.init* you should add:

    codemagic_storage_key : 'your_key_name_here'

## Changes in this fork from original CodeMagic plugin

1. Uses latest version of CodeMirror which is included as a complete package and not within the CodeMirror js itself
2. Relies on CodeMirror to perform the search/replace and screen wrap functionality
3. Uses CodeMirror's themes and, if you have local storage capabilities in your browser, will remember your choice
4. Currently doesn't use JS Beautifier
5. Various other bits and bobs
