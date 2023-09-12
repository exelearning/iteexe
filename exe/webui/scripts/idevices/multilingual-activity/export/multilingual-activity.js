/**
 * Select Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeMutilingual = {
    idevicePath: "",
    options: {},
    isInExe: false,
    idMutilingual: '',
    idevicesTitles: [],
    langs: [],
    init: function () {
        this.activities = $('.multilingual-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeMutilingual.supportedBrowser('mtl')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Multilingua') + '</p>');
            return;
        }
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/multilingual-activity/export/" : "";
        this.enable();

    },

    enable: function () {
        $eXeMutilingual.loadGame();
        $eXeMutilingual.addEvents();
    },

    createFlags: function (arr, number) {
        var $flagContainer = $('<div></div>').addClass('MTLP-Flags')
        for (var i = 0; i < number; i++) {
            var $link = $('<a></a>').addClass('MTLP-LinFlag').attr('href', '#').attr('data-number', i).attr('title', arr[i].lang).attr('title', arr[i].lang);
            var $img = $('<img/>').addClass('MTLP-Flag').attr('src', $eXeMutilingual.idevicePath + arr[i].code + '.png').attr('alt', arr[i].lang);
            $link.append($img);
            $flagContainer.append($link);
        }
        $('#nodeDecoration').before($flagContainer);
    },

    changeMenuLanguage: function (menus, index, trelements, tproyects) {
        $('#siteNav ul li a').each(function (i) {
            if (i < menus.length) {
                const text = menus[i][index] !== "" ? menus[i][index] : menus[i][0];
                $(this).text(text);
            }
        });
        var title = $('#nodeTitle').text();
        for (var i = 0; i < menus.length; i++) {
            for (var j = 0; j < menus[i].length; j++) {
                if (menus[i][j] == title) {
                    $('#nodeTitle').text(menus[i][index]);
                }
            }
        }

    },


    changeScormMenuLanguage: function (menus, index, tproyects) {
        $('a').each(function () {
            const mtext = $(this).text().trim();
            menus.forEach(function (subArr) {
                if (subArr.includes(mtext)) {
                    $(this).text(subArr[index]);
                }
            }, this);
        });
        var title = $('#nodeTitle').text();
        for (var i = 0; i < menus.length; i++) {
            for (var j = 0; j < menus[i].length; j++) {
                if (menus[i][j] == title) {
                    $('#nodeTitle').text(menus[i][index]);
                }
            }
        }
        $eXeMutilingual.replaceEscholariumTextLink(menus, index);
        $eXeMutilingual.replaceMoodleTextLink(menus, index, tproyects);
    },

    replaceEscholariumTextLink: function (menus, index) {
        setTimeout(function () {
            var sbody = $("body", window.parent.document);
            sbody.find('a.js-title').find('span.title').each(function () {
                const mtext = $(this).text().trim();
                menus.forEach(function (subArr) {
                    if (subArr.includes(mtext)) {
                        $(this).text(subArr[index]);
                    }
                }, this);
            });
            var title = sbody.find('.navbar').find('ul').find('li').find('span.title').text();
            for (var i = 0; i < menus.length; i++) {
                for (var j = 0; j < menus[i].length; j++) {
                    if (menus[i][j] == title) {
                        sbody.find('.navbar').find('ul').find('li').find('span.title').text(menus[i][index]);
                    }
                }
            }
            /*sbody.find('#book-index').find('.title-buttons').find(".btn-primary").text(trelements.actividades);
            sbody.find('.nota_revision').find('label[for="nota_revision"]').find(".btn-primary").text(trelements.nota);
            sbody.find('#text-revision').find('p.mod_rev').eq(0).text(trelements.revision);
            sbody.find('a#boton_reiniciar').attr('title', trelements.repetir);
            sbody.find('a#boton_buscar').attr('title', trelements.buscar);
            sbody.find('a#bactivity_prevr').attr('title', trelements.anterior);
            sbody.find('a#activity_next').attr('title', trelements.siguiente);
            sbody.find('a#close-back-wrapper-button').attr('title', trelements.regresar);
            sbody.find('a#boton_compartir').attr('title', trelements.compartir);*/
        }, 100);
    },

    replaceMoodleTextLink: function (menus, index, tproyects) {
        var $parent = $("body", window.parent.document),
            $tree = $parent.find("#scorm_tree"),
            $links = $tree.find(".yui3-treeview-children").find("a");
        $parent.find("#scorm_toc_title").text(tproyects[index]);
        $links.each(function (i) {
            var tlink = $(this).clone().children("i").remove().end().text().trim();
            if (i < menus.length) {
                for (var j = 0; j < menus[i].length; j++) {
                    var ts = menus[i][j];
                    if (ts.trim() == tlink) {
                        var tt = menus[i][index] !== "" ? menus[i][index] : menus[i][0];
                        $(this).html($(this).html().replace(tlink, tt));
                    }
                }
            }
        });
    },

    loadGame: function () {
        $eXeMutilingual.options = {};
        $eXeMutilingual.activities.each(function (i) {
            if (i == 0) {
                var dl = $(".multilingual-DataGame", this),
                    mOption = $eXeMutilingual.loadDataGame(dl),
                    lang = navigator.language.substring(0, 2),
                    index = $eXeMutilingual.getLangIndex(mOption.langs, lang)
                $eXeMutilingual.options = mOption;
                mtl = $eXeMutilingual.createInterfaceNode();
                dl.before(mtl).remove();
                $eXeMutilingual.createFlags(mOption.langs, mOption.numberLanguages);
                $eXeMutilingual.showIdevices(mOption.idevicesLanguajes, index);

            } else {
                alert('Sólo puede haber un iDevice tipo Mutilingual por página');
            }
        });
    },

    showIdevices: function (langs, index) {
        var mOptions = $eXeMutilingual.options;
        var titles = [];
        if (typeof index != "undefined" && index <= 4) {
            titles = $.map(langs[index].idevices, function (objeto) {
                if (objeto.state) {
                    return objeto.title;
                }
            });
        }
        $('section#main').find('article').hide();
        var colores = ['#FFC107', '#3F51B5', '#4CAF50', '#FF5722', '#9C27B0', '#795548', '#00BCD4', '#E91E63', '#607D8B', '#8BC34A']
        $('section#main').find('article').each(function (i) {
            var title = $(this).find('h1.iDeviceTitle').eq(0).text()
            if (titles.indexOf(title) != -1) {
                $(this).show();
            }
        });
        $eXeMutilingual.tranaslatePageElements(mOptions.menus, index, mOptions.proyectTitles)
        $('section#main').find('article.MutilingualIdevice').eq(0).hide();
        if (mOptions.presentationMode && !$eXeMutilingual.isInExe) {
            $('section#main').find('article').each(function () {
                $(this).find('h1.iDeviceTitle').hide();
            });
        }
    },


    tranaslatePageElements: function (menus, index, tproyects) {
        if ($("body").hasClass("exe-scorm")) {
            $eXeMutilingual.changeScormMenuLanguage(menus, index, tproyects)
        } else {
            $eXeMutilingual.changeMenuLanguage(menus, index, tproyects)
        }
        var trs = $eXeMutilingual.options.translations[index];
        if (index < tproyects.length) {
            if (tproyects[index].trim().length > 0) {
                $('div#content #header #headerContent').text(tproyects[index])
            }
        }
        $('a#toggle-nav span').html(JSON.parse(`"${trs['Menu']}"`))
        $('a.next span').html(JSON.parse(`"${trs['Next']}"`));
        $('a.prev span').html(JSON.parse(`"${trs['Previous']}"`));
        $('div#packageLicense p span').html(JSON.parse(`"${trs['Licensed under the']}"`));
        $('div#packageLicense a[rel="license"]').html(JSON.parse(`"${trs['Creative Commons Attribution Share Alike License 4.0']}"`));
    },

    createInterfaceNode: function () {
        var msgs = $eXeMutilingual.options.msgs,
            html = '<div class="MTLP-MainContainer">\
                    <div id="mtlNode">' + msgs.msgNode + '</div>\
                </div>'
        return html;
    },

    loadDataGame: function (data) {
        var json = $eXeMutilingual.Decrypt(data.text()),
            mOptions = $eXeMutilingual.isJsonString(json);
        mOptions.langs = mOptions.langs.slice(0, mOptions.numberLanguages);
        mOptions.presentationMode = typeof mOptions.presentationMode == "undefined" ? false : mOptions.presentationMode;
        for (var i = 0; i < mOptions.menus.length; i++) {
            mOptions.menus[i] = mOptions.menus[i].slice(0, mOptions.numberLanguages)
        }
        return mOptions;
    },

    saveDataStorage: function (index) {
        localStorage.setItem('langMultiLingual', index);
    },

    isJsonString: function (str) {
        try {
            var o = JSON.parse(str, null, 2);
            if (o && typeof o === "object") {
                return o;
            }
        } catch (e) {}
        return false;
    },

    addEvents: function () {
        var mOptions = $eXeMutilingual.options;
        $('.MTLP-Flags').on('click', '.MTLP-LinFlag', function (e) {
            e.preventDefault();
            var num = $(this).data('number');
            $eXeMutilingual.saveDataStorage(num);
            $eXeMutilingual.showIdevices(mOptions.idevicesLanguajes, num);
        });
    },

    getLangIndex: function (arr, code) {
        var savelang = $eXeMutilingual.getDataStorage();
        var index = 0;
        var langs = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].code === code) {
                index = i;
            }
            langs.push(arr[i].code)
        }
        if (savelang !== null && savelang < arr.length) {
            index = savelang;

        }
        $eXeMutilingual.langs = langs
        return index;
    },

    getDataStorage: function () {
        return localStorage.getItem('langMultiLingual');
    },

    Decrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        str = unescape(str)
        try {
            var key = 146;
            var pos = 0;
            var ostr = '';
            while (pos < str.length) {
                ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
                pos += 1;
            }
            return ostr;
        } catch (ex) {
            return '';
        }
    },

    supportedBrowser: function (idevice) {
        var sp = !(window.navigator.appName == 'Microsoft Internet Explorer' || window.navigator.userAgent.indexOf('MSIE ') > 0);
        if (!sp) {
            var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
            $('.' + idevice + '-instructions').text(bns);
        }
        return sp;
    },

}
$(function () {
    $eXeMutilingual.init();
});
