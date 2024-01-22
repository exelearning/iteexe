/**
 * Select Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 * Versión: 3.1
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Multilingual Activity'),
        alt: _('Multilingual')
    },
    iDevicePath: "/scripts/idevices/multilingual-activity/edition/",
    langsPath: "/scripts/i18n/",
    msgs: {},
    options: {},
    numberLanguages: 2,
    idevicesTitleState: [],
    activeLang: 0,
    proyectTitles: ['', '', '', ''],
    translations: [{
            Menu: "Men\\u00fa",
            Next: "Siguiente",
            Previous: "Anterior",
            Hide: "Ocultar",
            Show: "Mostrar",
            "Licensed under the": "Obra publicada con",
            "Creative Commons Attribution Share Alike License 4.0": "Licencia Creative Commons Reconocimiento Compartir igual 4.0"
        },
        {
            Menu: "Men\\u00fa",
            Next: "Siguiente",
            Previous: "Anterior",
            Hide: "Ocultar",
            Show: "Mostrar",
            "Licensed under the": "Obra publicada con",
            "Creative Commons Attribution Share Alike License 4.0": "Licencia Creative Commons Reconocimiento Compartir igual 4.0"
        },
        {
            Menu: "Men\\u00fa",
            Next: "Siguiente",
            Previous: "Anterior",
            Hide: "Ocultar",
            Show: "Mostrar",
            "Licensed under the": "Obra publicada con",
            "Creative Commons Attribution Share Alike License 4.0": "Licencia Creative Commons Reconocimiento Compartir igual 4.0"
        },
        {
            Menu: "Men\\u00fa",
            Next: "Siguiente",
            Previous: "Anterior",
            Hide: "Ocultar",
            Show: "Mostrar",
            "Licensed under the": "Obra publicada con",
            "Creative Commons Attribution Share Alike License 4.0": "Licencia Creative Commons Reconocimiento Compartir igual 4.0"
        }
    ],
    langs: [{
        code: 'es',
        lang: (_('Spanish '))
    }, {
        code: 'es',
        lang: (_('Spanish '))
    }, {
        code: 'es',
        lang: (_('Spanish '))
    }, {
        code: 'es',
        lang: (_('Spanish '))
    }],
    words: ['Menu', 'Next', 'Previous',
        'Hide', 'Show', 'Licensed under the', 'Creative Commons Attribution Share Alike License 4.0'
    ],
    ci18n: {
        "msgNode": _("Mensaje para el autor: Este iDevice permite crear elp multilingües. En previsualización o exportado no será visible."),
    },

    init: function () {
        this.setMessagesInfo();
        this.createForm();
    },
    enableForm: function (field) {
        $exeDevice.readIdevicesPage();
        $exeDevice.loadLanguagesSelects();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgOnlyOneIdevice = _("Sólo puedes añadir un iDevice tipo Multilingual por página");
    },

    arrayMove: function (arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            var k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    },

    showMultilinguals: function (number) {
        $('.MTLE-MultilingualName').each(function (j) {
            $(this).show();
            $('.MTLE-MultilingualNameLB').eq(j).show();
            if (j >= number) {
                $(this).hide();
                $('.MTLE-MultilingualNameLB').eq(j).hide();
            }
        });
    },

    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Permite crear elp mutilingües.") + ' <a href="https://youtu.be/sILaHXJJiWQ" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                        <fieldset class="exe-fieldset">\
                            <legend><a href="#">' + _("Multilinguals") + '</a></legend>\
                            <div>\
                                <div class="MTLE-Flex1">\
                                    <div class="MTLE-PanelLeft" >\
                                        <p class="MTLE-selector">\
                                            <label for="mtlNumLangs">Número de idiomas: </label>\
                                            <select id="mtlNumLangs">\
                                                <option value="2">2</option>\
                                                <option value="3">3</option>\
                                                <option value="4">4</option>\
                                            </select>\
                                        </p>\
                                        <p>' + _('Selecciona el idioma, completa los títulos de los menús y haz clic sobre el botón Asignar para marcar los iDevices que se mostrarán en el idioma elegido.') + '</p>\
                                        <div id="mtlEIELanguajeMenusDiv" style="display:block;" >\
                                            ' + $exeDevice.createTableMenus() + '\
                                        </div>\
                                        <div style="display:flex; justify-content:right; margin-top:.6em">\
                                            <a href="#" class="MTLE-BtnCopy">' + _("Guardar") + '</a>\
                                            <a href="#" class="MTLE-BtnPaste">' + _("Cargar") + '</a>\
                                        </div>\
                                        <div>' + _('Título del proyecto')+'</div>\
                                        <div >\
                                            <div class="MTLE-Flex MTLE-EInputVideo MTLE-ProyectTitleDiv">\
                                                <label  for="mtlProyectTitle-0">' + _("Idioma") + ' 1:</label>\
                                                <input  class="MTLE-ProyectTitle" id="mtlProyectTitle-0" type="text" />\
                                            </div>\
                                            <div class="MTLE-Flex MTLE-EInputVideo MTLE-ProyectTitleDiv">\
                                                <label for="mtlProyectTitle-1">' + _("Idioma") + ' 2:</label>\
                                                <input class="MTLE-ProyectTitle" id="mtlProyectTitle-1"  type="text" />\
                                            </div>\
                                            <div class="MTLE-Flex MTLE-EInputVideo MTLE-ProyectTitleDiv">\
                                                <label for="mtlProyectTitle-2">' + _("Idioma") + ' 3:</label>\
                                                <input class="MTLE-ProyectTitle" id="mtlProyectTitle-2" type="text" />\
                                            </div>\
                                            <div class="MTLE-Flex MTLE-EInputVideo MTLE-ProyectTitleDiv">\
                                                <label for="mtlProyectTitle-3">' + _("Idioma") + ' 4:</label>\
                                                <input class="MTLE-ProyectTitle"  id="mtlProyectTitle-3" type="text" />\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div id="mtlPanelRight" class="MTLE-PanelRight">\
                                      <div class="MTLE-TapsRightDiv" style="display:none;">\
                                           <a href="#" id="mtlShowIdevices" class="GameModeHelpLink" title="' + _('Configurar el orden y la visibilidad de los menús') + '">' + _("IDevices") + '</a> \
                                           <a href="#" id="mtlShowMenus" class="GameModeHelpLink" title="' + _('Configurar el orden y la visibilidad de los menús') + '">' + _("Menús") + '</a>\
                                      </div>\
                                    <div id="mtlMessageIDevices" class="MTLE-MessagesIdevices">' + _("Selecciona idioma") + '</div>\
                                      <div id="mtlIDevicesPageDiv" class="list MTLE-IDevicesPageDiv"></div>\
                                    </div>\
                                </div>\
                            </div>\
                        </fieldset>\
                    </div>\
                    ' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
		        </div>\
			    ';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeDevice.enableForm(field);

    },
    getTranslations: async function (langCode, texts, number) {
        if (langCode == 'en') {
            return {
                Menu: "Menu",
                Next: "Next",
                Previous: "Previous",
                Hide: "Hide",
                Show: "Show",
                "Licensed under the": "Licensed under the",
                "Creative Commons Attribution Share Alike License 4.0": "Creative Commons Attribution Share Alike License 4.0"
            }
        }
        let filePath = $exeDevice.langsPath + langCode + ".js";
        let translations = {};
        let result = {};

        try {
            let response = await fetch(filePath);
            let fileContents = await response.text();
            let matches = fileContents.match(/"(.+?)":\s*"(.+?)"/g);

            if (!matches) {
                console.error(`No matches found in file ${filePath}`);
                return result;
            }

            for (let i = 0; i < matches.length; i++) {
                let match = matches[i].match(/"(.+?)":\s*"(.+?)"/);
                translations[match[1]] = match[2];
            }

            for (let i = 0; i < texts.length; i++) {
                let text = texts[i];
                result[text] = translations[text] || "";
            }
            $exeDevice.translations[number] = result;
            return result;

        } catch (error) {
            console.error(`Error loading file ${filePath}: ${error}`);
            return result;
        }
    },
    getChexboxChecked: function (checkboxes) {
        var checks = checkboxes.filter(':checked').map(function () {
            return $(this).val();
        }).get();
        return checks;
    },

    getChexboxTitleState: function ($checkboxes) {
        var titles = [];
        $checkboxes.each(function () {
            var obj = {
                'title': $(this).val(),
                'state': $(this).is(':checked')
            }
            titles.push(obj)

        })
        return titles;
    },

    updateTitles: function (array1, array2, i) {
        $.each(array1, function (index1, obj1) {
            $.each(array2, function (index2, obj2) {
                if (obj1.title === obj2.title) {
                    obj1.state = obj2.state
                }
            });
        });
        return array1;
    },
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $exeDevice.Decrypt($('.multilingual-DataGame', wrapper).text()),
                version = $('.multilingual-version', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json)
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.translations = dataGame.translations || $exeDevice.translations;
            $exeDevice.langs = dataGame.langs || $exeDevice.langs;
            $exeDevice.updateFieldGame(dataGame);
        }
    },

    updateFieldGame: function (game) {

        game.idevicesLanguajes = typeof game.idevicesLanguajes == "undefined" ? game.Languajes : game.idevicesLanguajes;
        game.numberLanguages = typeof game.numberLanguages == "undefined" ? 2 : game.numberLanguages;
        game.presentationMode = typeof game.presentationMode == "undefined" ? false : game.presentationMode;
        for (var i = 0; i < game.idevicesLanguajes.length; i++) {
            $exeDevice.idevicesTitleState[i] = $exeDevice.updateTitles($exeDevice.idevicesTitleState[i], game.idevicesLanguajes[i].idevices, i)
        }

        if (typeof game.menus == "undefined" || (game.menus.length == 0)) {
            game.menus = [
                [
                    [],
                    [],
                    [],
                    []
                ],
            ];

        }
        if (typeof game.proyectTitles == "undefined" || (game.proyectTitles.length == 0)) {
            game.proyectTitles = ['', '', '', ''];
        }

        for (var i = 0; i < game.menus.length; i++) {
            if (game.menus[i].length < 4) {
                game.menus[i].push('')
            }
        }

        if (game.langs.length < 4) {
            game.langs.push({
                code: '',
                lang: ''
            })
        }
        $exeDevice.langs = game.langs;
        $exeDevice.setSelectedLanguages(game.langs);
        $exeDevice.setProyectTitles(game.proyectTitles, game.langs);
        $exeDevice.setMenuData(game.menus);
        $exeDevice.activeLang = 0;
        $exeDevice.numberLanguages = game.numberLanguages;
        $exeDevice.changeLanguaje($exeDevice.activeLang);
        $exeDevice.updateLanguajeIdevices($exeDevice.activeLang);
    },

    readIdevicesPage: function () {
        var idevices = [],
            $IDevicePageDiv = $('#mtlIDevicesPageDiv'),
            idevices = $('.iDeviceTitle').map(function () {
                return $(this).text();
            }).get();
        if ($exeDevice.idevicesTitleState.length == 0) {
            for (var i = 0; i < 5; i++) {
                var grupo = [];
                for (var j = 0; j < idevices.length; j++) {
                    var obj = {
                        'title': idevices[j],
                        'state': false
                    }
                    grupo.push(obj)
                }
                $exeDevice.idevicesTitleState[i] = grupo.slice();
            }
        }
        for (var i = 0; i < idevices.length; i++) {
            var itext = idevices[i],
                checkbox = '<div class="MTLE-IDeviceTitleDiv" data-order=' + i + '><input type="checkbox" data-number=' + i + 'name="itititle" class="MTLE-IDeviceTitle" value="' + itext + '"/><label class="MTLE-IDeviceTitlelBL" >' + itext + '</label></div>';
            $IDevicePageDiv.append(checkbox);
        }
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

    save: function () {
        var dataGame = this.validateData();
        if (!dataGame) {
            return false;
        }
        var fields = this.ci18n,
            i18n = fields;
        for (var i in fields) {
            var fVal = $("#ci18n_" + i).val();
            if (fVal != "") i18n[i] = fVal;
        }
        dataGame.msgs = i18n;
        var json = JSON.stringify(dataGame);
        var html = '<div class="multilingual-IDevice">';
        html += '<div class="multilingual-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="multilingual-DataGame js-hidden" >' + $exeDevice.Encrypt(json) + '</div>';
        html += '<div class="multilingual-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },
    Encrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        try {
            var key = 146;
            var pos = 0;
            var ostr = '';
            while (pos < str.length) {
                ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
                pos += 1;
            }
            return escape(ostr);
        } catch (ex) {
            return '';
        }
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

    exportGame: function () {
        var dataGame = this.validateData();
        if (!dataGame) {
            return;
        }
        var blob = JSON.stringify(dataGame),
            newBlob = new Blob([blob], {
                type: "text/plain"
            });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = _("Game") + "Multilingual.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },

    validateData: function () {
        var idevicesLanguajes = [],
            menus = $exeDevice.getMenuData(),
            numberLanguages = $('#mtlNumLangs').find("option:selected").val(),
            proyectTitles = $exeDevice.getProyectTitles();
        for (var i = 0; i < $exeDevice.idevicesTitleState.length; i++) {
            var it = {
                'itinerary': i,
                'idevices': $exeDevice.idevicesTitleState[i]
            }
            idevicesLanguajes.push(it)
        }

        var data = {
            'typeGame': 'Multilingual',
            'version': 1,
            'idevicesLanguajes': idevicesLanguajes,
            'menus': menus,
            'numberLanguages': numberLanguages,
            'proyectTitles': proyectTitles,
            'translations': $exeDevice.translations,
            'langs': $exeDevice.langs,
            'presentationMode':false
        }
        return data;
    },

    addEvents: function () {

        $(document).on('click', 'input.MTLE-IDeviceTitle', function (e) {
            var checkbosex = $("input.MTLE-IDeviceTitle");
            $exeDevice.idevicesTitleState[$exeDevice.activeLang] = $exeDevice.getChexboxTitleState(checkbosex);
        });
        $(document).on('change', '.MTLE-Languajes', function (e) {

            var languaje = $(this).find("option:selected").text();
            var select = $exeDevice.checkLanguages();
            if (select) {
                $exeDevice.showMessage(('Ya ha seleccionado el idioma %s').replace('%s', languaje));
                $(this).val('');
                return
            }
            var code = $(this).val(),
                lang = $(this).find("option:selected").text(),
                number = parseInt($(this).data('iti'));

            languaje = code != '' ? lang : 'Idioma ' + (number + 1);
            $('label[for="mtlProyectTitle-' + number + '"]').text(languaje + ': ');

            if ($(this).val() == '') {
                code = 'es'
                lang = _('Spanish')
            }
            var ob = {
                'code': code,
                'lang': lang
            }
            $exeDevice.langs[number] = ob;
            $exeDevice.getTranslations(code, $exeDevice.words, number);


        });
        $(document).on('click','.MTLE-Asignar', function (e) {
            e.preventDefault();
            var num = parseInt($(this).data('num'));
            $exeDevice.changeLanguaje(num)
            $exeDevice.activeLang = num
            $exeDevice.updateLanguajeIdevices($exeDevice.activeLang);
        });
        $(document).on('click', '.MTLE-Add', function (e) {
            e.preventDefault();
            var row = $('<tr><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td> <a href="#" class="MTLE-Add MTLE-ENavigationButton" title="' + _("Añadir") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEAdd.png" alt="' + _("Añadir") + '" class="MTLE-EButtonImage" /></a><a href="#" class="MTLE-Delete MTLE-ENavigationButton" title="' + _("Eliminar") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEDelete.png" alt="' + _("Eliminar") + '" class="MTLE-EButtonImage" /></a>\</td></tr>');
            row.insertAfter($(this).closest('tr'));
            $('#mtlNumLangs').val($exeDevice.numberLanguages).trigger('change');
        });

        $(document).on('click', '.MTLE-Delete', function (e) {
            e.preventDefault();
            $(this).closest('tr').remove();
        });
        $(document).on('click', '.MTLE-BtnCopy', function (e) {
            e.preventDefault();
            var mtlIdiomasMenu = {
                html: $('#mtlEIELanguajeMenusDiv').html(),
                langs: $exeDevice.obtenerValoresSeleccionados(),
                proyectTitles: $exeDevice.getProyectTitles(),
                numberLanguages: $('#mtlNumLangs').find("option:selected").val(),
                menus:$exeDevice.getMenuData()
            }

            localStorage.setItem('mtlIdiomasMenu', JSON.stringify(mtlIdiomasMenu));

        });
        $(document).on('click', '.MTLE-BtnPaste', function (e) {
            e.preventDefault()
            if (localStorage.getItem('mtlIdiomasMenu')) {
                var mtlIdiomasMenu = localStorage.getItem('mtlIdiomasMenu');
                mtlIdiomasMenu = JSON.parse(mtlIdiomasMenu);
                $('#mtlEIELanguajeMenusDiv').html(mtlIdiomasMenu.html);
                $exeDevice.selectOptions(mtlIdiomasMenu.langs);
                var idms = $exeDevice.getLanguageObjects(mtlIdiomasMenu.langs);
                $exeDevice.langs=idms;
                $exeDevice.activeLang = 0;
                $exeDevice.numberLanguages = mtlIdiomasMenu.numberLanguages;
                $exeDevice.setProyectTitles(mtlIdiomasMenu.proyectTitles, idms);
                $exeDevice.setMenuData(mtlIdiomasMenu.menus);
                $exeDevice.setSelectedLanguages(idms);
                $exeDevice.changeLanguaje($exeDevice.activeLang);
                $exeDevice.updateLanguajeIdevices($exeDevice.activeLang);

                $('#mtlNumLangs').val(mtlIdiomasMenu.numberLanguages).trigger('change');
            } else {
                console.error('La variable mtlIdiomasMenu no está definida en localStorage');
            }
        });
        $('#mtlNumLangs').on('change', function () {
            var numColsToShow = parseInt($(this).val());
            $('.MTLE-ProyectTitleDiv').hide();
            for (var i = 0; i < numColsToShow; i++) {
                $('.MTLE-ProyectTitleDiv').eq(i).show();
            }
            $('#mtlIdiomasMenu th, #mtlIdiomasMenu td').hide();
            for (var i = 0; i < numColsToShow; i++) {
                $('#mtlIdiomasMenu th:nth-child(' + (i + 1) + '), #mtlIdiomasMenu td:nth-child(' + (i + 1) + ')').show();
            }
            $('#mtlAcciones').show();
            $('td:nth-child(5)').show();
            $exeDevice.numberLanguages = numColsToShow;

        });
        $('#mtlNumLangs').val($exeDevice.numberLanguages).trigger('change');

    },

    getLanguageObjects: function (langs) {
        var languages = $exeDevice.getLangs(),
            alangs = [];
        for (var i = 0; i < langs.length; i++) {
            var foundLanguage = languages[langs[i]];
            foundLanguage = typeof foundLanguage != "undefined" ? {
                'code': langs[i],
                'lang': _(foundLanguage)
            } : {
                'code': '',
                'lang': _('Idioma') + ' ' + (i + 1)
            };
            alangs.push(foundLanguage)
        }
        return alangs;
    },

    obtenerValoresSeleccionados: function () {
        var valores = [];
        $('#mtlIdiomasMenu select').each(function () {
            var valorSeleccionado = $(this).val();
            valores.push(valorSeleccionado);
        });
        return valores;
    },
    selectOptions: function (array) {
        $('#mtlIdiomasMenu select').each(function (index) {
            $(this).val(array[index]);
        });
    },

    checkLanguages: function () {
        var langs = {},
            duplicates = false;
        $('select.MTLE-Languajes').each(function (i) {
            if (i < $exeDevice.numberLanguages) {
                var code = $(this).find("option:selected").val().trim();

                if (code === '') {
                    return true;
                }
                if (code in langs) {
                    duplicates = true;
                    return false;
                }
                langs[code] = true;
            }
        });
        return duplicates;
    },

    getSelectedLanguages: function () {
        var selectedValues = [];
        $('select.MTLE-Languajes').each(function () {
            var lang = {
                'code': $(this).val(),
                'lang': $(this).find("option:selected").text()
            };
            selectedValues.push(lang);
        });
        return selectedValues;
    },

    getProyectTitles: function () {
        var selectedValues = [];
        $('input.MTLE-ProyectTitle').each(function () {
            selectedValues.push($(this).val());
        });
        return selectedValues;
    },


    setSelectedLanguages: function (selectedValues) {
        $('select.MTLE-Languajes').each(function (index) {
            var selectElement = $(this); //
            var selectedValue = selectedValues[index].code;
            selectElement.find('option[value="' + selectedValue + '"]').prop('selected', true);
        });
        var msg2 = _('<span style="color:red;font-weight:bolder;">Selecciona los idevices que se mostrarán en <span style="color:red;font-weight:bolder;">%s</span>').replace('%s', selectedValues[0].idioma);
        $("#mtlMessageIDevices").html(msg2);
    },
    setProyectTitles: function (selectedValues, langs) {
        $('input.MTLE-ProyectTitle').each(function (index) {
            if (index < selectedValues.length && index < langs.length) {
                $(this).val(selectedValues[index]);

                if (typeof langs[index] != "undefined" && langs[index].lang.length > 0) {
                    $('label[for="mtlProyectTitle-' + index + '"]').text(langs[index].lang + ': ');
                }
            }

        });
    },

    changeLanguaje: function (number) {
        var $select = $('select.MTLE-Languajes[data-iti="' + number + '"]').eq(0),
            val = $select.val(),
            lng = $select.find('option:selected').text() || 'Idioma ' + (i + 0);
        if (val == '') {
            $exeDevice.showMessage('Selecciona el idioma al que quieres asociar los idevices');
            return;
        }
        var msg2 = _('Selecciona los iDevices que se mostrarán en %s').replace('%s', '<span style="color:red;font-weight:bolder;">'+lng+'</span>');
        $("#mtlMessageIDevices").html(msg2);

    },


    createTableMenus: function () {
        var path = $exeDevice.iDevicePath;
        var table = '<table id="mtlIdiomasMenu">\
            <thead>\
                <tr>\
                    <th>\
                        <div class="MTLE-TH">\
                            <select id="mtlELanguaje-0" class="MTLE-Languajes"  data-iti="0"></select>\
                            <a href="#" data-num="0" class="MTLE-Asignar MTLE-ENavigationButton MTLE-EPlayVideo" title="' + _("Asignar Devices") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Asignar iDevices") + '" class="MTLE-EButtonPlay" /></a>\
                        </div>\
                    </th>\
                    <th>\
                        <div class="MTLE-TH">\
                            <select id="mtlELanguaje-1" class="MTLE-Languajes"  data-iti="1"></select>\
                            <a href="#" data-num="1" class="MTLE-Asignar MTLE-ENavigationButton MTLE-EPlayVideo" title="' + _("Asignar Devices") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Asignar iDevices") + '" class="MTLE-EButtonPlay" /></a>\
                        </div>\
                    </th>\
                    <th>\
                        <div class="MTLE-TH">\
                            <select id="mtlELanguaje-2" class="MTLE-Languajes"  data-iti="2"></select>\
                            <a href="#" data-num="2" class="MTLE-Asignar MTLE-ENavigationButton MTLE-EPlayVideo" title="' + _("Asignar Devices") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Asignar iDevices") + '" class="MTLE-EButtonPlay" /></a>\
                        </div>\
                    </th>\
                    <th>\
                        <div class="MTLE-TH">\
                            <select id="mtlELanguaje-3" class="MTLE-Languajes"  data-iti="3"></select>\
                            <a href="#" data-num="3" class="MTLE-Asignar MTLE-ENavigationButton MTLE-EPlayVideo" title="' + _("Asignar Devices") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Asignar iDevices") + '" class="MTLE-EButtonPlay" /></a>\
                        </div>\
                    </th>\
                    <th id="mtlAcciones"></th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr>\
                    <td contenteditable="true"></td>\
                    <td contenteditable="true"></td>\
                    <td contenteditable="true"></td>\
                    <td contenteditable="true"></td>\
                    <td>\
                        <a href="#"  class="MTLE-Add MTLE-ENavigationButton" title="' + _("Añadir") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Añadir") + '" class="MTLE-EButtonImage" /></a>\
                        <a href="#"  class="MTLE-Delete MTLE-ENavigationButton" title="' + _("Eliminar") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Eliminar") + '" class="MTLE-EButtonImage" /></a>\
                    </td>\
                </tr>\
            </tbody>\
        </table>'
        return table;
    },
    getMenuData: function () {
        var menus = [];
        $('#mtlIdiomasMenu tr:not(:first)').each(function () {
            var fila = [];
            $(this).find('td:not(:last)').each(function () {
                fila.push($(this).text());
            });
            menus.push(fila);
        });

        return menus;
    },


    setMenuData: function (menus) {
        $('#mtlIdiomasMenu tbody').empty();

        $.each(menus, function (indice, fila) {
            var nuevaFila = $('<tr></tr>');
            $.each(fila, function (indice, celda) {
                nuevaFila.append('<td>' + celda + '</td>');
                nuevaFila.attr('contenteditable', true);
            });
            nuevaFila.append('<td> <a href="#" class="MTLE-Add MTLE-ENavigationButton" title="' + _("Añadir") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEAdd.png" alt="' + _("Añadir") + '" class="MTLE-EButtonImage" /></a><a href="#" class="MTLE-Delete MTLE-ENavigationButton" title="' + _("Eliminar") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEDelete.png" alt="' + _("Eliminar") + '" class="MTLE-EButtonImage" /></a>\</td>');
            $('#mtlIdiomasMenu tbody').append(nuevaFila);
        });

    },

    updateLanguajeIdevices: function (number) {
        var idevices = $exeDevice.idevicesTitleState[number];
        if (idevices.length <= 0) return;
        var $IDevicePageDiv = $('#mtlIDevicesPageDiv');
        $IDevicePageDiv.empty();
        for (var i = 0; i < idevices.length; i++) {
            var itext = idevices[i].title,
                state = idevices[i].state,
                checkbox = '<div class="MTLE-IDeviceTitleDiv" data-order=' + i + '><input type="checkbox" data-number=' + i + 'name="itititle" class="MTLE-IDeviceTitle" value="' + itext + '"/><label class="MTLE-IDeviceTitlelBL" >' + itext + '</label></div>';
            if (state) {
                checkbox = '<div class="MTLE-IDeviceTitleDiv" data-order=' + i + '><input type="checkbox" checked data-number=' + i + 'name="itititle" class="MTLE-IDeviceTitle" value="' + itext + '"/><label class="MTLE-IDeviceTitlelBL" >' + itext + '</label></div>';
            }
            $IDevicePageDiv.append(checkbox);
        }


    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'Multilingual') {
            $exeDevice.updateFieldGame(game);

        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $('.exe-form-tabs li:first-child a').click();
    },

    getLangs: function () {
        const languageNames = {
            "am": "Amharic ",
            "ar": "Arabic ",
            "ast": "Asturiano ",
            "bg": "Bulgarian ",
            "bn": "Bengali ",
            "ca": "Catalan ",
            "ca_ES@valencia": "Valencian ",
            "cs": "Czech ",
            "da": "Danish ",
            "de": "German ",
            "dz": "Dzongkha ",
            "ee": "Ewe ",
            "el": "Greek ",
            "en": "English ",
            "es": "Spanish ",
            "et": "Estonian ",
            "eu": "Basque ",
            "fa": "Persian ",
            "fi": "Finnish ",
            "fr": "French ",
            "gl": "Galician ",
            "hu": "Hungarian ",
            "id": "Indonesian ",
            "is": "Icelandic ",
            "it": "Italian ",
            "ja": "Japanese ",
            "km": "Cambodian ",
            "nb": "Norwegian Bokmål ",
            "nl": "Dutch ",
            "pl": "Polish ",
            "pt": "Portuguese ",
            "pt_BR": "Brazilian Portuguese ",
            "ru": "Russian ",
            "sk": "Slovak ",
            "sl": "Slovenian ",
            "sr": "Serbian ",
            "sv": "Swedish ",
            "th": "Thai ",
            "tl": "Tagalog ",
            "tr": "Turkish ",
            "uk": "Ukrainian ",
            "vi": "Vietnamese ",
            "zh": "Simplified Chinese ",
            "zh_TW": "Traditional Chinese ",
            "zu": "Zulu "
        };

        return languageNames;

    },

    loadLanguagesSelects: function () {
        $('.MTLE-Languajes').each(function (i) {
            $exeDevice.loadLanguageSelect($(this))
        });
    },
    loadLanguageSelect: function ($this) {
        const select = $this;
        var langs = $exeDevice.getLangs();
        select.append('<option value="">' + _('Selecciona') + '</option>');
        for (const code in langs) {
            var option = $('<option>').val(code).text(_(langs[code]));
            select.append(option);
        }
        return select;
    },
    generateDivWithLanguageFlags: function (languageCodes) {
        const div = $('<div>');
        languageCodes.forEach(function (languageCode) {
            const img = $('<img>').attr('src', `https://www.countryflags.io/${languageCode}/flat/64.png`).attr('alt', languageCode).addClass('flag');
            const a = $('<a>').attr('href', `https://www.google.com/search?q=${languageCode}`).attr('target', '_blank').append(img);
            div.append(a);
        });

        return div;
    }
}