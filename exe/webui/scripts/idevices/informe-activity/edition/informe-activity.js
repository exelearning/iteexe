/**
/**
 * informe Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Informe de progreso')
    },
    msgs: {
    },
    id: '',

    ci18n: {
        "msgSummary": _("Resumen de las actividades"),
        "msgNoCompletedActivities": _("Aún no has realizado ninguna de las actividades evaluables propuestas en este recurso educativo."),
        "msgNoPendientes": _("Número de actividades pendientes: %s."),
        "msgCompletedActivities": _("La siguiente tabla recoge los resultados que has obtenido en las actividades evaluables propuestas en este recurso educativo que ya has completado."),
        "msgAverageScore": _("Nota media"),
        "msgReboot": _("Reiniciar"),
        "msgReload": _("Actualizar"),
        "mssActivitiesNumber": _("Nº Actividades: %s"),
        "msgActivitiesCompleted": _("Completadas: %s"),
        "msgAverageScore1": _("Nota media: %s"),
        "msgAverageScoreCompleted": _("Nota media completadas: %s"),
        "msgDelete": _("Esto eliminará las puntuaciones almacenadas de todas las actividades ¿Estás seguro de que deseas continuar?"),
        "msgSections": _("Secciones del recurso educativo"),
        "msgSave": _("Guardar"),
        "msgReport": _("informe_de_progreso"),
        "msgReportTitle": _("Informe de progreso"),
        "msgType": _("Tipo"),
        "msgSeeActivity": _("Ir a la actividad"),
        "mgsSections": _("Secciones del recurso educativo"),
        "msgName": _("Nombre"),
        "msgDate": _("Fecha")
    },
    init: function () {
        this.createForm();
        this.addEvents();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideID = _("Tienes que introducir el identificador de este informe de progreso");
    },
    createForm: function () {
        // Adivina, Completa, Identifica, Mapa, Operaciones matemáticas, Problemas matemáticos, QuExt, Rosco, Selecciona, Sopa de letras, Tarjetas de memoria, VídeoQuExt, Geogebra, Lista desordenada y Vídeo Interactivo
		var iDeviceList = "";
			iDeviceList += _("Word Guessing");
			iDeviceList += ", ";
			iDeviceList += _("Complete");
			iDeviceList += ", ";
			iDeviceList += _("Identify");
			iDeviceList += ", ";
			iDeviceList += _("Map");
			iDeviceList += ", ";
			iDeviceList += _("Math Operations");
			iDeviceList += ", ";
			iDeviceList += _("Math Problems");
			iDeviceList += ", ";
			iDeviceList += _("QuExt");
			iDeviceList += ", ";
			iDeviceList += _("A-Z Quiz Game");
			iDeviceList += ", ";
			iDeviceList += _("Multiple Choice Quiz");
			iDeviceList += ", ";
			iDeviceList += _("Word Search");
			iDeviceList += ", ";
			iDeviceList += _("Memory Cards");
			iDeviceList += ", ";
			iDeviceList += _("VideoQuExt");
			iDeviceList += ", ";
			iDeviceList += _("Geogebra");
			iDeviceList += ", ";
			iDeviceList += _("Scrambled List");
			iDeviceList += ", ";
			iDeviceList += _("Interactive Video");
			iDeviceList += ".";
		var html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Muestra los resultados obtenidos por en alumnos en las actividades asociadas al mismo y su nota media.") + ' <a href="https://youtu.be/t1tGpTuHN5k" hreflang="es" rel="lightbox" target="_blank">' + _("Use Instructions") + '</a></div>\				<div class="exe-form-tab" title="' + _('General settings') + '">\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                           <p>' + _("El identificador puede ser un número o una palabra de más de cuatro caracteres. Debes utilizar este mismo identificador en todas las actividades que deseas evaluar en este informe de progreso.") + '</p>\
                            <p>\
								<label for="informeEEvaluationID">' + _("Identificador") + ':\
								<input type="text" id="informeEEvaluationID"/> </label>\
                            </p>\
                            <p>\
								<label for="informeENumber">' + _("Nº de actividades evaluables") + ':\
								<input type="number" name="informeENumber" id="informeENumber" value="1" min="1" max="99" step="1" /> </label>\
                            </p>\
                            <p>\
                                <label for="informeEShowDate"><input type="checkbox" id="informeEShowDate">' + _("Mostrar fecha y hora") + '. </label>\
                            </p>\
                            <p>\
                                <label for="informeEShowTypeGame"><input type="checkbox" id="informeEShowTypeGame">' + _("Mostrar tipo de iDevice") + '. </label>\
                            </p>\
                            <p>\
                                <label for="informeEActiveLinks"><input type="checkbox" id="informeEActiveLinks">' + _("Enlazar actividades del informe") + '. </label>\
                            </p>\
                            <p>\
                                <label for="informeUserData"><input type="checkbox" id="informeUserData" /> ' +   _("Datos del usuario") + '. </label>\
                            </p>\
                            <p class="exe-idevice-info"><strong>' + _("iDevices compatibles con el informe:") + " </strong>" + iDeviceList + '</p>\
                         </div>\
                    </fieldset>\
                </div>\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
		    </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeDevice.loadPreviousValues(field);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.informe-DataGame', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json);
            $exeDevice.updateFieldGame(dataGame);
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
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
        var dataGame = $exeDevice.validateData();

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
        var json = JSON.stringify(dataGame),
            html = '<div class="informe-IDevice">';
        html += '<div class="informe-DataGame js-hidden">' + json + '</div>';
        html += '<div class="informe-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },


    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    validateData: function () {
        var evaluationID = $('#informeEEvaluationID').val(),
            number = parseInt($('#informeENumber').val()),
            showDate = $('#informeEShowDate').is(':checked');
            showTypeGame = $('#informeEShowTypeGame').is(':checked');
            activeLinks = $('#informeEActiveLinks').is(':checked');
            userData = $("#informeUserData").is(":checked");
        if (!evaluationID || evaluationID.length < 5) {
            $exeDevice.showMessage(_('El identificador del informe debe tener al menos 5 caracteres'));
            return false;

        }
        var
            data = {
                'typeGame': 'Evaluación',
                'evaluationID': evaluationID,
                'number': number,
                'showDate':showDate,
                'showTypeGame':showTypeGame,
                'activeLinks':activeLinks,
                'userData': userData
            }
        return data;
    },

    addEvents: function () {
        $('#informeENumber').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 2);
            this.value = v;
        });
        $('#informeENumber').on('focusout', function () {
            this.value = this.value.trim() == '' ? 1 : this.value;
            this.value = this.value > 99 ? 99 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

    },

    updateFieldGame: function (game) {
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        game.number = typeof game.number != "undefined" ? game.number : 1;
        game.number = typeof game.number != "undefined" ? game.number : 1;
        game.showDate = typeof game.showDate != "undefined" ? game.showDate : false;
        game.showTypeGame = typeof game.showTypeGame != "undefined" ? game.showTypeGame : false;
        game.activeLinks = typeof game.activeLinks != "undefined" ? game.activeLinks : false;
        game.userData= typeof  game.userData=="undefined"?false: game.userData;
        $('#informeEEvaluationID').val(game.evaluationID);
        $('#informeENumber').val(game.number);
        $('#informeEShowDate').prop('checked', game.showDate);
        $('#informeEShowTypeGame').prop('checked', game.showTypeGame);
        $('#informeEActiveLinks').prop('checked', game.activeLinks);
        $("#informeUserData").prop("checked", game.userData);
    },

}