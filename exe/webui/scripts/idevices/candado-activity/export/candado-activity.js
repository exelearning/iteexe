/**
 * Lock iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeCandado = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#2a9315',
        red: '#ff0000',
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#d5dcec',
        green: '#cce1c8',
        red: '#f7c4c4',
        white: '#ffffff',
        yellow: '#f5efd6'
    },
    image: '',
    options: {},
    msgs: '',
    hasSCORMbutton: false,
    isInExe: false,
    init: function () {
        this.activities = $('.candado-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeCandado.supportedBrowser('candado')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Lock') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/candado-activity/export/" : "";
        $eXeCandado.loadGame();
    },
    loadGame: function () {
        $eXeCandado.options = [];
        $eXeCandado.activities.each(function (i) {
            var version=$(".candado-version", this).eq(0).text(),
                dl = $(".candado-DataGame", this),
                mOption = $eXeCandado.loadDataGame(dl,version),
                msg = mOption.msgs.msgPlayStart;
            mOption.candadoInstructions= $(".candado-instructions", this).eq(0).html();
            mOption.counter=mOption.candadoTime* 60;
            mOption.candadoStarted=false;
            mOption.candadoSolved=false;
            mOption.candadoErrors=0;
            $eXeCandado.options.push(mOption);
            var candado = $eXeCandado.createInterfaceQuExt(i);
            dl.before(candado).remove();
            $('#candadoGameMinimize-' + i).hide();
            $('#candadoGameContainer-' + i).hide();
            if (mOption.candadoShowMinimize) {
                $('#candadoGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#candadoGameContainer-' + i).show();
            }
            $('#candadoMessageMaximize-' + i).text(msg);
            $eXeCandado.addEvents(i);
            $( '#candadoInstructions-' + i).append($(".candado-instructions", this));
            $( '#candadoFeedRetro-' + i).append($(".candado-retro", this));
        });
    },
    createInterfaceQuExt: function (instance) {
        var html = '',
            path = $eXeCandado.idevicePath,
            msgs = $eXeCandado.options[instance].msgs;
            html += '<div class="candado-MainContainer">\
                <div class="candado-GameMinimize" id="candadoGameMinimize-' + instance + '">\
                    <a href="#" class="candado-LinkMaximize " id="candadoLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'candadoIcon.png" class="candado-Icons candado-IconMinimize candado-Activo" alt="">\
                        <span class="candado-MessageMaximize " id="candadoMessageMaximize-' + instance + '">' + msgs.msgEShowActivity + '</span>\
                    </a>\
                </div>\
                <div class="candado-GameContainer" id="candadoGameContainer-' + instance + '">\
                    <div class="candado-GameScoreBoard">\
                        <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                        <div class="exeQuextIcons34-Time" title="'+msgs.msgTime+'"></div>\
                        <p id="candadoPTime-' + instance + '" class="candado-PTime">00:00</p>\
                        <a href="#" class="candado-LinkMinimize candado-Activo" id="candadoLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                            <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                            <div class="exeQuextIcons34-Minimize"></div>\
                        </a>\
                    </div>\
                    <div class="candado-Instructiones exe-text" id="candadoInstructions-' + instance + '"></div>\
                    <div class="candado-FeedRetro exe-text" id="candadoFeedRetro-' + instance + '"></div>\
                    <div class="candado-MessageInfo" id="candadoMessageInfo-' + instance + '">\
                    <div class="sr-av">'+msgs.msgInstructions+'</div>\
                        <p id="candadoPInformation-' + instance + '"></p>\
                    </div>\
                    <div class="candado-SolutionDiv" id="candadoSolutionDiv-' + instance + '">\
                        <label for="candadoSolution-' + instance + '" class="labelSolution">'+msgs.msgCodeAccess+':</label><input type="text" class="candado-Solution"  id="candadoSolution-' + instance + '">\
                        <a href="#" id="candadoSolutionButton-' + instance + '" title="' + msgs.msgSubmit + '" class="candado-SolutionButton candado-Activo">\
                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                            <div class="exeQuextIcons-Submit"></div>\
                        </a>\
                    </div>\
                    <div class="candado-SolutionDiv" id="candadoNavigator-' + instance + '">\
                        <input type="button" class="candado-ShowIntro feedbackbutton" id="candadoShowIntro-' + instance + '"   value="'+msgs.msgInstructions+'" />\
                        <input type="button" class="candado-ShowRetro feedbackbutton" id="candadoShowRetro-' + instance + '"   value="'+msgs.msgFeedback+'" />\
                    </div>\
                </div>\
            </div>'
        return html;
    },
    Decrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        str=unescape(str)
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
    loadDataGame: function (data, version) {
        var json = data.text();
        if (version==1 || !json.startsWith('{')){
            json=$eXeCandado.Decrypt(json);
        }
        var mOptions = $eXeCandado.isJsonString(json);
        return mOptions;
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
    addZero: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    saveDataStorage: function (instance) {
        var mOptions = $eXeCandado.options[instance],
        tiempo=mOptions.counter<0?0:mOptions.counter;
        var data = {
            'candadoStarted': mOptions.candadoStarted,
            'candadoSolved': mOptions.candadoSolved,
            'counter': tiempo,
            'candadoTime': mOptions.candadoTime,
            'candadoReboot':mOptions.candadoReboot,
            'candadoErrors':mOptions.candadoErrors
        }
        localStorage.setItem('dataCandado-' + instance, JSON.stringify(data));
    },
        getDataStorage: function (instance) {
        var data = $eXeCandado.isJsonString(localStorage.getItem('dataCandado-' + instance));
        return data;
    },
    addEvents: function (instance) {
        var mOptions = $eXeCandado.options[instance];
        window.addEventListener('unload', function () {
            if (mOptions.candadoStarted) {
               $eXeCandado.saveDataStorage(instance);
            }
        });
        $('#candadoLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#candadoGameContainer-" + instance).show()
            $("#candadoGameMinimize-" + instance).hide();
            if(!mOptions.candadoStarted){
                $eXeCandado.startGame(instance);
            };
            $('#candadoSolution-' + instance).focus();
        });
        $("#candadoLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#candadoGameContainer-" + instance).hide();
            $("#candadoGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        $('#candadoSolution-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeCandado.answerActivity(instance);
                return false;
            }
            return true;
        });
        $('#candadoSolutionButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeCandado.answerActivity(instance);
        });
        $('#candadoShowIntro-' + instance).on('click touchstart', function (e) {
            $('#candadoInstructions-' + instance).show();
            $('#candadoFeedRetro-' + instance).hide();
            $('#candadoSolutionDiv-' + instance).hide();
        });
        $('#candadoShowRetro-' + instance).on('click touchstart', function (e) {
            $('#candadoInstructions-' + instance).hide();
            $('#candadoFeedRetro-' + instance).show();
            $('#candadoSolutionDiv-' + instance).hide();
        });
        $('#candadoSolution-' + instance).focus();
        $('#candadoMessageInfo-'+ instance).show();
        $('#candadoNavigator-' + instance).hide();
        if(mOptions.candadoShowMinimize){
            $("#candadoGameContainer-" + instance).hide();
            $("#candadoGameMinimize-" + instance).css('visibility', 'visible').show();
        }
        if(mOptions.candadoTime==0){
            $('#candadoTimeQuestion-'+ instance).hide();
            $('#candadoTimeNumber-' + instance).css('width','32px');
        }
        var dataCandado = $eXeCandado.getDataStorage(instance);
        mOptions.candadoSolved=false;
        mOptions.counter=mOptions.candadoTime*60;
        if (dataCandado) {
            if(mOptions.candadoTime!=dataCandado.candadoTime || mOptions.candadoReboot!=dataCandado.candadoReboot  || (mOptions.candadoReboot && dataCandado.candadoSolved) ){
                localStorage.removeItem('dataCandado-' + instance);
            }else{
                mOptions.candadoSolved=dataCandado.candadoSolved;
                mOptions.counter=dataCandado.counter;
            }
        }
        if(!mOptions.candadoShowMinimize){
            $eXeCandado.startGame(instance);
        }
        $('#candadoSolution-' + instance).focus();
    },
    startGame: function (instance) {
       var mOptions = $eXeCandado.options[instance];
       mOptions.candadoStarted=true;
       if(mOptions.candadoSolved && !mOptions.candadoReboot){
            $eXeCandado.showFeedback(instance);
            return;
       }
       if(mOptions.candadoTime==0){
            return;
       }
       $eXeCandado.uptateTime(0, instance);
        mOptions.counterClock = setInterval(function () {
            mOptions.counter--;
            $eXeCandado.uptateTime(mOptions.counter, instance);
            if (mOptions.counter <= 0 || mOptions.candadoSolved) {
                $eXeCandado.showFeedback(instance);
            }
        }, 1000);
    },
    showFeedback:function(instance){
        var mOptions = $eXeCandado.options[instance];
        clearInterval(mOptions.counterClock);
        mOptions.candadoSolved=true;
        $eXeCandado.uptateTime(mOptions.counter, instance);
        $('#candadoInstructions-' + instance).hide().attr("aria-labelledby","candadoShowIntro-" + instance);
         $('#candadoFeedRetro-' + instance).show().attr("aria-labelledby","candadoShowRetro-" + instance);
        $('#candadoSolutionDiv-' + instance).hide();
        $('#candadoNavigator-' + instance).show();
        $('#candadoMessageInfo-' + instance).hide();
        $("#candadoShowRetro-" + instance).focus();
    },
    uptateTime: function (tiempo, instance) {
        tiempo=tiempo<0?0:tiempo;
        var mTime = $eXeCandado.getTimeToString(tiempo);
        $('#candadoPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    answerActivity: function (instance) {
        var mOptions = $eXeCandado.options[instance],
            answord = $('#candadoSolution-' + instance).val(),
            message = "",
            typeMessage = 0;
        if (answord.length == 0) {
            $eXeCandado.showMessage(1, mOptions.msgs.msgEnterCode, instance);
            return;
        }
        if ($eXeCandado.checkWord(answord, mOptions.candadoSolution))  {
            $eXeCandado.showFeedback(instance);
        } else {
            message = $eXeCandado.getRetroFeedMessages(false, instance) + " " + mOptions.msgs.msgErrorCode;
            typeMessage = 1;
            mOptions.candadoErrors++;
            if( mOptions.candadoAttemps>0 && mOptions.candadoErrorMessage.length>0 && mOptions.candadoErrors>=mOptions.candadoAttemps){
                typeMessage = 0;
                message=mOptions.candadoErrorMessage;
            }
            $('#candadoSolution-' + instance).val('');
        }
        $eXeCandado.showMessage(typeMessage, message, instance);
    },
    checkWord: function (answord,word) {
        var sWord = $.trim(word).replace(/\s+/g, " ").toUpperCase().replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, ""),
            sAnsWord = $.trim(answord).replace(/\s+/g, " ").toUpperCase().replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
        sWord = $.trim(sWord);
        sAnsWord = $.trim(sAnsWord);
        if (sWord.indexOf('|') == -1) {
            return sWord == sAnsWord;
        }
        var words = sWord.split('|');
        for (var i = 0; i < words.length; i++) {
            var mword = $.trim(words[i]).replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
            if (mword == sAnsWord) {
                return true;
            }
        }
        return false;
    },
    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeCandado.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    showMessageAlert: function (tmsg) {
        window.alert(tmsg)
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeCandado.borderColors.red, $eXeCandado.borderColors.green, $eXeCandado.borderColors.blue, $eXeCandado.borderColors.yellow];
        var color = colors[type];
        $("#candadoPInformation-" + instance).text(message);
        $("#candadoPInformation-" + instance).css({
            'color': color,
            'font-weight': 'bold'
        });
    },
    supportedBrowser: function (idevice) {
        var sp = !(window.navigator.appName == 'Microsoft Internet Explorer'  || window.navigator.userAgent.indexOf('MSIE ')>0);
        if (!sp) {
            var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
            $('.' + idevice + '-instructions').text(bns);
        }
        return sp;
    }
}
$(function () {
    $eXeCandado.init();
});