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
        name: _('Progress report')
    },
    msgs: {
    },
    id: '',

    ci18n: {
        "msgSummary": _("Summary of activities"),
        "msgNoCompletedActivities": _("You didn\'t finish any of the evaluable activities proposed in this educational resource."),
        "msgNoPendientes": _("Number of pending activities: %s"),
        "msgCompletedActivities": _("The following table collects the results you have obtained in the evaluable activities proposed in this educational resource that you have already completed."),
        "msgAverageScore": _("Average score"),
        "msgReboot": _("Restart"),
        "msgReload": _("Update"),
        "mssActivitiesNumber": _("No. of activities: %S"),
        "msgActivitiesCompleted": _("Completed: %s"),
        "msgAverageScore1": _("Average score: %s"),
        "msgAverageScoreCompleted": _("Average note completed: %s"),
        "msgDelete": _("This will eliminate the stored scores of all activities. Do you want to continue?"),
        "msgSections": _("Educational resource sections"),
        "msgSave": _("Save"),
        "msgReport": _("progress_report"),
        "msgReportTitle": _("Progress report"),
        "msgType": _("Type"),
        "msgSeeActivity": _("Go to the activity"),
        "mgsSections": _("Educational resource sections"),
        "msgName": _("Name"),
        "msgDate": _("Date")
    },
    init: function () {
        this.createForm();
        this.addEvents();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideID = _("You have to provide the identifier of this progress report");
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
                <div class="exe-idevice-info">' + _("It shows the results obtained by students in the activities associated with it and its average note.") + ' <a href="https://youtu.be/t1tGpTuHN5k" hreflang="es" rel="lightbox" target="_blank">' + _("Use Instructions") + '</a></div>\				<div class="exe-form-tab" title="' + _('General settings') + '">\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                           <p>' + _("The identifier can be a number or word of more than four characters. You must use the same identifier in all the activities you want to evaluate in this progress report.") + '</p>\
                            <p>\
								<label for="informeEEvaluationID">' + _("Identifier") + ':\
								<input type="text" id="informeEEvaluationID"/> </label>\
                            </p>\
                            <p>\
								<label for="informeENumber">' + _("Number of evaluable activities") + ':\
								<input type="number" name="informeENumber" id="informeENumber" value="1" min="1" max="99" step="1" /> </label>\
                            </p>\
                            <p>\
                                <label for="informeEShowDate"><input type="checkbox" id="informeEShowDate">' + _("Show date and time") + '. </label>\
                            </p>\
                            <p>\
                                <label for="informeEShowTypeGame"><input type="checkbox" id="informeEShowTypeGame">' + _("Show iDevice type") + '. </label>\
                            </p>\
                            <p>\
                                <label for="informeEActiveLinks"><input type="checkbox" id="informeEActiveLinks">' + _("Link report activities") + '. </label>\
                            </p>\
                            <p>\
                                <label for="informeUserData"><input type="checkbox" id="informeUserData" /> ' +   _("User data") + '. </label>\
                            </p>\
                            <p class="exe-idevice-info"><strong>' + _("Report compatible iDevices:") + " </strong>" + iDeviceList + '</p>\
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
            $exeDevice.showMessage(_('The report identifier must have at least 5 characters'));
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