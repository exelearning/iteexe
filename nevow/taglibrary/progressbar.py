from nevow import static, tags as t

_progress_glue = """
function setPercProgress(nodeName, val) {
    var node = document.getElementById(nodeName+'_meter');
    if (!node.hasAttribute('style')) {
        node.setAttribute('style', 'width: 0%');
    }
    node.style['width'] = val+'%';
}
"""
_progress_css = """
.progressbar {
    width: 50%;
    height: 15px;
    border-style: solid;
    border-width: 1px;
}
.progressbar div {
    height: 15px;
    background-color: #aaaaaa;
}
"""

progressGlueJS = static.File(_progress_glue, 'text/javascript')
progressGlue = t.inlineJS(_progress_glue)

progressCSSFile = static.File(_progress_css, 'text/css')
progressCSS = t.style(type_='text/css')[_progress_css]

class ProgressBarComponent(object):
    def progressBar(self, ctx, data):
        name = data.get('name', 'progressbar')
        start_perc = data.get('start', 0)
        bar = t.div(id_=str(name), class_="progressbar")
        meter = t.div(id_="%s_meter" % str(name))
        return bar[meter(style="width:%s%%" % (start_perc))]
            
progressBar = ProgressBarComponent().progressBar


__all__ = ["progressGlueJS", "progressGlue", "progressBar",
           "progressCSS", "progressCSSFile"]
