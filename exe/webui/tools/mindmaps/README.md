# mindmaps in eXeLearning
[mindmaps](https://www.mindmaps.app/), by [David Richard](http://drichard.org/) is licensed under AGPL V3.
It's included in eXeLearning (which is under the GPL open source license) with the developer's consent. 
For a different use of mindmaps, read the LICENSE file or contact his author.

# mindmaps
mindmaps is a HTML5 based mind mapping application. It lets you create neat looking mind maps in the browser.

This project started in 2011 as an exploration into what's possible to do in browsers using modern APIs. Nowadays, most of this stuff is pretty common and the code base is a bit outdated. This was way before React, ES6, webpack. Heck, it doesn't even use Backbone.

However, there is no reason to change any of that and it makes the code base quite easy to grok. There is no compilation step, no babel plugins, no frameworks. Just a JavaScript application and a very simple Model-View-Presenter pattern.

## HTML5 stuff which was cool in 2011
- 100% offline capable via ApplicationCache
- Stores mind maps in LocalStorage
- FileReader API reads stored mind maps from the hard drive
- Canvas API draws the mind map

## Try it out
The latest stable build is hosted [here](https://www.mindmaps.app).

## Build
Download mindmaps from https://github.com/drichard/mindmaps and follow the instructions.
eXeLearning includes only the static files with some small modifications.

## License
mindmaps is licensed under AGPL V3, see LICENSE for more information.
