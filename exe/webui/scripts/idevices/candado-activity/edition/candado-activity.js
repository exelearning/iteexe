/**
 * candado Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Candado Activity'),
    },
    iDevicePath: "/scripts/idevices/candado-activity/edition/",
    msgs: {},
    active: 0,
    typeActive:0,
    challengesGame: [],
    candadoInstructions: '',
    candadoRetro: '',
    candadoTime: 40,
    candadoSolution: '',
    candadoShowMinimize:false,
    candadoReboot:false,
    candadoAttemps:0,
    candadoErrorMessage:'',
    ci18n: {
        "msgOk": _("Accept"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Max time"),
        "msgInstructions": _("Instructions"),
        "msgFeedback": _("Feedback"),
        "msgCodeAccess": _("Access code"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgRequiredAccessKey": _("Access code required"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgEShowActivity" :_("Show activity")
    },

    init: function () {
        this.setMessagesInfo();
        this.createForm();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEGeneralSettings = _("General settings");
        msgs.msgEIntrucctions = _("Please write some instructions.");
        msgs.msgTime= _("Max time");
        msgs.msgERetro= _("Please write the feedback.");
        msgs.msgCodeAccess=_("Access code"),
        msgs.msgEnterCodeAccess= _("Enter the access code");
        msgs.msgEInstructions = _("Instructions");
        msgs.msgEREtroalimatacion = _("Feedback");
        msgs.msgEShowMinimize =_("Show minimized.");
        msgs.msgERebootActivity  =_("Repeat activity")
        msgs.msgCustomMessage=_("Error message");
        msgs.msgNumFaildedAttemps=_("Errors to display the message");
        msgs.msgEnterCustomMessage=_("Please write the error message.");

    },
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    createForm: function () {
        var msgs=this.msgs;
        var html = '\
			<div id="candadoIdeviceForm">\
				<div class="exe-form-tab" title="' +  msgs.msgEGeneralSettings+ '">\
                        <div class="candado-EPanel" id="candadoEPanel">\
                            <div class="candadoToggle">\
                                <input class="candado-Type" checked="checked" id="candadoECandado" type="radio" name="dsfDesRet" value="0" />\
                                <label for="candadoECandado">' + msgs.msgEInstructions + '</label>\
                                <input class="candado-Type"  id="candadoERetro" type="radio" name="dsfDesRet" value="1" />\
                                <label for="candadoERetro">' +  msgs.msgEREtroalimatacion + '</label>\
                            </div>\
                            <div class="candado-EDAtaGame">\
                                <div class="candado-ERadioDatos">\
                                    <textarea id="candadoEDescription" class="exe-html-editor"\></textarea>\
                                </div>\
                                <div class="candado-EOptions">\
                                        <label for="candadoEDSolution">' + msgs.msgCodeAccess + ': <input type="text" id="candadoEDSolution" /></label>\
                                        <label id="candadolblEDTime" for="candadoEDTime">' + msgs.msgTime+ ':\
                                        <select id="candadoEDTime">\
                                            <option value="0"></option>\
                                            <option value="1">1m</option>\
                                            <option value="3">3m</option>\
                                            <option value="5">5m</option>\
                                            <option value="10" selected>10m</option>\
                                            <option value="15">15m</option>\
                                            <option value="20">20m</option>\
                                            <option value="25">25m</option>\
                                            <option value="30">30m</option>\
                                            <option value="35">35m</option>\
                                            <option value="40" >40m</option>\
                                            <option value="40">45m</option>\
                                            <option value="50">50m</option>\
                                            <option value="55">55m</option>\
                                            <option value="60">60m</option>\
                                        </select>\
                                        </label>\
                                        <label for="candadoEShowMinimize"><input type="checkbox" id="candadoEShowMinimize"> ' + msgs.msgEShowMinimize + ' </label>\
                                        <label for="candadoEReboot"><input type="checkbox" id="candadoEReboot" checked> ' + msgs.msgERebootActivity + ' </label>\
                                </div>\
                                <div class="candado-EMessage">\
                                        <label for="candadoEAttemps">' + msgs.msgNumFaildedAttemps + ':  <input type="number"  name="candadoEAttemps" id="candadoEAttemps" value="0" min="0" max="10" step="1" required /></label> \
			                            <label for="candadoEErrorMessage">' + msgs.msgCustomMessage + ': </label><input type="text" disabled id="candadoEErrorMessage" />\
                                </div>\
                            </div>\
                        </div>\
                </div>\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
		    </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("candadoIdeviceForm");
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
        $exeAuthoring.iDevice.gamification.scorm.init();


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
    loadPreviousValues: function (field) {

        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.candado-DataGame', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json);
            $exeDevice.candadoInstructions=dataGame.candadoInstructions;
            $exeDevice.candadoRetro=dataGame.candadoRetro;
            $exeDevice.candadoSolution=dataGame.candadoSolution;
            $exeDevice.candadoTime=dataGame.candadoTime;
            $exeDevice.candadoAttemps=dataGame.candadoAttemps;
            $exeDevice.candadoErrorMessage=dataGame.candadoErrorMessage;
            $exeDevice.candadoInstructions = $(".candado-instructions", wrapper).eq(0).html();
            $exeDevice.candadoRetro= $(".candado-retro", wrapper).eq(0).html();
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.typeActive=0;
            $('#candadoEDSolution').val(dataGame.candadoSolution);
            $('#candadoEDTime').val(dataGame.candadoTime);
            $('#candadoEShowMinimize').prop("checked", dataGame.candadoShowMinimize);
            $('#candadoEReboot').prop("checked", dataGame.candadoReboot);
            $('#candadoEAttemps').val(dataGame.candadoAttemps);
            $('#candadoEErrorMessage').val(dataGame.candadoErrorMessage);
            $('#candadoEErrorMessage').prop("disabled",dataGame.candadoAttemps==0);


            if(tinyMCE.get('candadoEDescription')){
                tinyMCE.get('candadoEDescription').setContent($exeDevice.candadoInstructions);
            }else{
                $('#candadoEDescription').val($exeDevice.candadoInstructions)
            }

        }
    },

    save: function () {
        if(!$exeDevice.validateCandado()){
            return;
        }
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
        var html = '<div class="candado-IDevice">';
        html += '<div class="candado-instructions js-hidden">' + $exeDevice.candadoInstructions + '</div>';
        html += '<div class="candado-retro js-hidden">' + $exeDevice.candadoRetro+ '</div>';
        html += '<div class="candado-DataGame">' + json + '</div>';
        html += '</div>';
        return html;
    },

    validateCandado: function () {
        var message = '';
        $exeDevice.candadoTime = parseInt($('#candadoEDTime option:selected').val());
        $exeDevice.candadoSolution=$('#candadoEDSolution').val();
        $exeDevice.candadoShowMinimize = $('#candadoEShowMinimize').is(':checked');
        $exeDevice.candadoReboot = $('#candadoEReboot').is(':checked');
        $exeDevice.candadoAttemps=$('#candadoEAttemps').val();
        $exeDevice.candadoErrorMessage=$('#candadoEErrorMessage').val();
        
        if($exeDevice.typeActive==0){
            $exeDevice.candadoInstructions=tinymce.editors[0].getContent();
        }else if($exeDevice.typeActive==1){
            $exeDevice.candadoRetro=tinymce.editors[0].getContent();
        }
        if ($exeDevice.candadoInstructions.length==0){
            message = $exeDevice.msgs.msgEIntrucctions;
        } else if ($exeDevice.candadoRetro.length==0){
            message = $exeDevice.msgs.msgERetro;
        } else if ($exeDevice.candadoSolution.length == 0) {
            message = $exeDevice.msgs.msgEnterCodeAccess;
        } else if($exeDevice.candadoAttemps>0 && $exeDevice.candadoErrorMessage.length==0){
            message = $exeDevice.msgs.msgEnterCustomMessage;
        }
        if (message.length != 0) {
            $exeDevice.showMessage(message);
            message = false;
        } else {
            message=true;
        }
        return message;
    },

    validateData: function () {
           var data = {
            'candadoTime': $exeDevice.candadoTime,
            'candadoSolution': $exeDevice.candadoSolution,
            'candadoInstructions': $exeDevice.candadoInstructions,
            'candadoRetro': $exeDevice.candadoRetro,
            'candadoShowMinimize': $exeDevice.candadoShowMinimize,
            'candadoReboot': $exeDevice.candadoReboot,
            'candadoAttemps': $exeDevice.candadoAttemps,
            'candadoErrorMessage': $exeDevice.candadoErrorMessage
        }
        return data;
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    addEvents: function () {
        $('#candadoERetro').on('click', function (e) {
            if($exeDevice.typeActive==0){
                $exeDevice.typeActive=1;
                $exeDevice.candadoInstructions=tinymce.editors[0].getContent();
                tinymce.editors[0].setContent( $exeDevice.candadoRetro);
            }
        });
        $('#candadoECandado').on('click', function (e) {
            if($exeDevice.typeActive==1){
                $exeDevice.candadoRetro=tinymce.editors[0].getContent();
                tinymce.editors[0].setContent( $exeDevice.candadoInstructions);
                $exeDevice.typeActive=0;
            }
        });
        
        $('#candadoEAttemps').on('focusout', function () {
			this.value = this.value.trim() == '' ? 0 : this.value;
			this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
            var d=this.value==0?true:false;
            $('#candadoEErrorMessage').prop("disabled",d);
          

        });
        $("#candadoEAttemps").bind('keyup mouseup', function () {
            var d=this.value==0?true:false;
            $('#candadoEErrorMessage').prop("disabled",d);
        });
    }
}