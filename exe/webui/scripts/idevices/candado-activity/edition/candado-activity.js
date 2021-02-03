/**
 * Lock iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Lock'),
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
    candadoVersion:1,
    ci18n: {
        "msgOk": _("Accept"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time Limit (mm:ss)"),
        "msgInstructions": _("Instructions"),
        "msgFeedback": _("Feedback"),
        "msgCodeAccess": _("Access code"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgRequiredAccessKey": _("Access code required"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgEShowActivity" :_("Show activity"),
        "msgSubmit" : _("Check")
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
        msgs.msgNumFaildedAttemps=_("Errors (number of attempts) to display the message");
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
                            <p class="candadoToggle">\
                                <input checked id="candadoECandado" type="radio" name="dsfDesRet" value="0" />\
                                <label for="candadoECandado">' + msgs.msgEInstructions + '</label>\
                                <input id="candadoERetro" type="radio" name="dsfDesRet" value="1" />\
                                <label for="candadoERetro">' +  msgs.msgEREtroalimatacion + '</label>\
                            </p>\
                            <p id="divCandadoInstructions">\
                                <label for="candadoEDescription" class="sr-av">'+_('Instructions')+'":</label>\
                                <textarea id="candadoEDescription" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p id="divCandadoFeebBack">\
                                <label for="candadoEFeedBack" class="sr-av">'+_('Feedback')+'":</label>\
                                <textarea  id="candadoEFeedBack" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p class="candado-EDataAccess">\
                                <label for="candadoEDSolution">' + msgs.msgCodeAccess + ':</label><input type="text" id="candadoEDSolution"/>\
                                <label id="candadolblEDTime" for="candadoEDTime">' + msgs.msgTime+ ':</label>\
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
                                <input type="checkbox" id="candadoEShowMinimize"><label for="candadoEShowMinimize">' + msgs.msgEShowMinimize + ' </label>\
                                <input type="checkbox" id="candadoEReboot" checked><label for="candadoEReboot">' + msgs.msgERebootActivity + ' </label>\
                            </p>\
                            <p class="candado-EDataAccess">\
                                <label for="candadoEAttemps">' + msgs.msgNumFaildedAttemps + ':</label><input type="number"  name="candadoEAttemps" id="candadoEAttemps" value="0" min="0" max="10" step="1" required />\
                                <label for="candadoEErrorMessage">' + msgs.msgCustomMessage + ':</label><input type="text" disabled id="candadoEErrorMessage" />\
                            </p>\
                        </div>\
                    </div>\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
		      </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $('#divCandadoFeebBack').hide();
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
        var originalHTML = field.val(),
        candadoInstructions='',
        candadoRetro='';
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.candado-DataGame', wrapper).text(),
                version=$('.candado-version', wrapper).text();
            if (version.length==1 || !json.startsWith('{')){
                json=$exeDevice.Decrypt(json);
            }
            var dataGame = $exeDevice.isJsonString(json);
            $exeDevice.candadoSolution=dataGame.candadoSolution;
            $exeDevice.candadoTime=dataGame.candadoTime;
            $exeDevice.candadoAttemps=dataGame.candadoAttemps;
            $exeDevice.candadoErrorMessage=dataGame.candadoErrorMessage;
            candadoInstructions = $(".candado-instructions", wrapper).eq(0).html();
            candadoRetro= $(".candado-retro", wrapper).eq(0).html();
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
                tinyMCE.get('candadoEDescription').setContent(candadoInstructions);
            }else{
                $('#candadoEDescription').val(candadoInstructions)
            }
            if(tinyMCE.get('candadoEFeedBack')){
                tinyMCE.get('candadoEFeedBack').setContent(candadoRetro);
            }else{
                $('#candadoEFeedBack').val(candadoRetro);
            }
        }
    },
    Encrypt :function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        try {
            var key = 146;
            var pos = 0;
            ostr = '';
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
        str=unescape(str)
        try {
            var key = 146;
            var pos = 0;
            ostr = '';
            while (pos < str.length) {
                ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
                pos += 1;
            }

            return ostr;
        } catch (ex) {
            return '';
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
        json=$exeDevice.Encrypt(json);
        var html = '<div class="candado-IDevice">';
        html += '<div class="candado-version js-hidden">' + $exeDevice.candadoVersion + '</div>';
        html += '<div class="candado-instructions">' + tinymce.editors[0].getContent() + '</div>';
        html += '<div class="candado-retro">' + tinymce.editors[1].getContent() + '</div>';
        html += '<div class="candado-DataGame" js-hidden>' +  json + '</div>';
        html += '</div>';
        return html;
    },

    validateCandado: function () {
        var message = '',
        candadoInstructions=tinymce.editors[0].getContent(),
        candadoRetro=tinymce.editors[1].getContent();
        $exeDevice.candadoTime = parseInt($('#candadoEDTime option:selected').val());
        $exeDevice.candadoSolution=$('#candadoEDSolution').val();
        $exeDevice.candadoShowMinimize = $('#candadoEShowMinimize').is(':checked');
        $exeDevice.candadoReboot = $('#candadoEReboot').is(':checked');
        $exeDevice.candadoAttemps=$('#candadoEAttemps').val();
        $exeDevice.candadoErrorMessage=$('#candadoEErrorMessage').val();
        if (candadoInstructions.length==0){
            message = $exeDevice.msgs.msgEIntrucctions;
        } else if (candadoRetro.length==0){
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
            'candadoInstructions': '',
            'candadoRetro': '',
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
            $('#divCandadoInstructions').hide();
            $('#divCandadoFeebBack').show();
        });
        $('#candadoECandado').on('click', function (e) {
            $('#divCandadoInstructions').show();
            $('#divCandadoFeebBack').hide();
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