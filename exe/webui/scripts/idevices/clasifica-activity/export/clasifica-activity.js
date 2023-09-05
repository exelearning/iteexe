/**
 * Clasifica activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeClasifica = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#3334a1',
        green: '#006641',
        red: '#a2241a',
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#3334a1',
        green: '#006641',
        red: '#a2241a',
        white: '#ffffff',
        yellow: '#fcf4d3'
    },
    options: [],
    hasSCORMbutton: false,
    isInExe: false,
    userName: '',
    previousScore: '',
    initialScore: '',
    hasLATEX: false,

    init: function () {
        this.activities = $('.clasifica-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeClasifica.supportedBrowser('clasifica')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Clasifica') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/clasifica-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();

    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeClasifica.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeClasifica.enable()');
        else this.enable();
        $eXeClasifica.mScorm = scorm;
        var callSucceeded = $eXeClasifica.mScorm.init();
        if (callSucceeded) {
            $eXeClasifica.userName = $eXeClasifica.getUserName();
            $eXeClasifica.previousScore = $eXeClasifica.getPreviousScore();
            $eXeClasifica.mScorm.set("cmi.core.score.max", 10);
            $eXeClasifica.mScorm.set("cmi.core.score.min", 0);
            $eXeClasifica.initialScore = $eXeClasifica.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeClasifica.options[instance],
            text = '';
        $('#clasificaSendScore-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgSaveGameAuto + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
                if (mOptions.gameLevel == 2) {
                    text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
                }
            } else if (repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveGameAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes
                if (mOptions.gameLevel == 2) {
                    text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
                }
            } else if (!repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgOnlySaveGameAuto;
                if (mOptions.gameLevel == 2) {
                    text = mOptions.msgs.msgOnlySaveAuto;
                }
            } else if (!repeatActivity && prevScore !== "") {
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            }
            $('#clasificaRepeatActivity-' + instance).fadeIn(1000);
        } else if (mOptions.isScorm === 2) {
            $('#clasificaSendScore-' + instance).hide();
            $('#clasificaRepeatActivity-' + instance).hide();
            if (mOptions.gameLevel == 2) {
                $('#clasificaRepeatActivity-' + instance).fadeIn(1000);
                $('#clasificaSendScore-' + instance).show();
            }
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#clasificaSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#clasificaRepeatActivity-' + instance).text(text);

    },
    getUserName: function () {
        var user = $eXeClasifica.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeClasifica.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeClasifica.mScorm.quit();
    },
    enable: function () {
        if (typeof (Draggable) == 'undefined') $exe.loadScript($eXeClasifica.idevicePath + 'draganddrop.js', '$eXeClasifica.enable1()');
        else this.loadGame();
    },
    enable1: function () {

        $eXeClasifica.loadGame();
    },
    loadGame: function () {
        $eXeClasifica.options = [];
        $eXeClasifica.activities.each(function (i) {
            var dl = $(".clasifica-DataGame", this),
                $imagesLink = $('.clasifica-LinkImages', this),
                $audiosLink = $('.clasifica-LinkAudios', this),
                mOption = $eXeClasifica.loadDataGame(dl, $imagesLink, $audiosLink),
                msg = mOption.msgs.msgPlayStart;

            $eXeClasifica.options.push(mOption);
            var clasifica = $eXeClasifica.createInterfaceClasifica(i);
            dl.before(clasifica).remove();
            $('#clasificaGameMinimize-' + i).hide();
            $('#clasificaGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#clasificaGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#clasificaGameContainer-' + i).show();
            }
            $('#clasificaMessageMaximize-' + i).text(msg);
            $('#clasificaDivFeedBack-' + i).prepend($('.clasifica-feedback-game', this));
            $eXeClasifica.addCards(i, mOption.cardsGame);
            $eXeClasifica.addEvents(i);
            $('#clasificaDivFeedBack-' + i).hide();
        });
        if ($eXeClasifica.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeClasifica.loadMathJax();
        }
    },
    Decrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        str = unescape(str)
        try {
            var key = 146,
                pos = 0,
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
    loadDataGame: function (data, imgsLink, audioLink) {
        var json = data.text();
        json = $eXeClasifica.Decrypt(json);
        var mOptions = $eXeClasifica.isJsonString(json),
            hasLatex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeClasifica.hasLATEX = true;
        }
        mOptions.playerAudio = "";
        mOptions.gameOver = false;
        mOptions.refreshCard = false;
        imgsLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                mOptions.wordsGame[iq].url = $(this).attr('href');
                if (mOptions.wordsGame[iq].url.length < 4 && mOptions.wordsGame[iq].type == 0) {
                    mOptions.wordsGame[iq].url = "";
                }
            }
        });
        audioLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                mOptions.wordsGame[iq].audio = $(this).attr('href');
                if (mOptions.wordsGame[iq].audio.length < 4) {
                    mOptions.wordsGame[iq].audio = "";
                }
            }
        });
        mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
        mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? '' : mOptions.evaluationID;
        mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
        mOptions.wordsGame = $eXeClasifica.getQuestions(mOptions.wordsGame, mOptions.percentajeQuestions);
        mOptions.numberQuestions = mOptions.wordsGame.length;
        mOptions.wordsGameFix = [...mOptions.wordsGame];
        mOptions.cardsGame = mOptions.wordsGame
        mOptions.fullscreen = false;
        mOptions.attempts = 0;
        return mOptions;
    },
    loadMathJax: function () {
        if (!window.MathJax) {
            window.MathJax = $exe.math.engineConfig;
        }
        var script = document.createElement('script');
        script.src = $exe.math.engine;
        script.async = true;
        document.head.appendChild(script);
    },
    updateLatex: function (mnodo) {
        setTimeout(function () {
            if (typeof (MathJax) != "undefined") {
                try {
                    if (MathJax.Hub && typeof MathJax.Hub.Queue == "function") {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, '#' + mnodo]);
                    } else if (typeof MathJax.typeset == "function") {
                        var nodo = document.getElementById(mnodo);
                        MathJax.typesetClear([nodo]);
                        MathJax.typeset([nodo]);
                    }
                } catch (error) {
                    console.log('Error al refrescar cuestiones')
                }
            }

        }, 100);
    },
    getQuestions: function (questions, percentaje) {
        var mQuestions = questions;
        if (percentaje < 100) {
            var num = Math.round((percentaje * questions.length) / 100);
            num = num < 1 ? 1 : num;
            if (num < questions.length) {
                var array = [];
                for (var i = 0; i < questions.length; i++) {
                    array.push(i);
                }
                array = $eXeClasifica.shuffleAds(array).slice(0, num).sort(function (a, b) {
                    return a - b;
                });
                mQuestions = [];
                for (var i = 0; i < array.length; i++) {
                    mQuestions.push(questions[array[i]]);
                }
            }
        }
        return mQuestions;
    },
    playSound1: function (selectedFile, instance) {
        var mOptions = $eXeClasifica.options[instance];
        $eXeClasifica.stopSound(instance);
        selectedFile = $eXeClasifica.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile);
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });
    },
    playSound: function (selectedFile, instance) {
        var mOptions = $eXeClasifica.options[instance];
        $eXeClasifica.stopSound(instance);
        selectedFile = $eXeClasifica.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile);
        mOptions.playerAudio.play().catch(error => console.error("Error playing audio:", error));
    },
    
    stopSound: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        if (mOptions.playerAudio && typeof mOptions.playerAudio.pause == "function") {
            mOptions.playerAudio.pause();
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
    createInterfaceClasifica: function (instance) {
        var html = '',
            path = $eXeClasifica.idevicePath,
            msgs = $eXeClasifica.options[instance].msgs,
            groups = $eXeClasifica.options[instance].groups,
            html = '';
        html += '<div class="CQP-MainContainer">\
        <div class="CQP-GameMinimize" id="clasificaGameMinimize-' + instance + '">\
            <a href="#" class="CQP-LinkMaximize" id="clasificaLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + "clasificaIcon.png" + '" class="CQP-IconMinimize CQP-Activo"  alt="">\
            <div class="CQP-MessageMaximize" id="clasificaMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="CQP-GameContainer" id="clasificaGameContainer-' + instance + '">\
            <div class="CQP-GameScoreBoard" id="clasificaGameScoreBoard-' + instance + '">\
                <div class="CQP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number"  id="clasificaPNumberIcon-' + instance + '" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="clasificaPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="clasificaPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgsErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="clasificaPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" id="clasificaPScoreIcon-' + instance + '" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="clasificaPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="CQP-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
					<div class="exeQuextIcons  exeQuextIcons-Time" id="clasificaImgTime-' + instance + '" title="' + msgs.msgTime + '"></div>\
                    <p  id="clasificaPTime-' + instance + '" class="CQP-PTime">00:00</p>\
                    <a href="#" class="CQP-LinkFullScreen" id="clasificaLinkReboot-' + instance + '" title="' + msgs.msgReboot + '">\
                        <strong><span class="sr-av">' + msgs.msgReboot + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-IconReboot  CQP-Activo" id="clasificaReboot-' + instance + '"></div>\
                    </a>\
                    <a href="#" class="CQP-LinkMinimize" id="clasificaLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  CQP-Activo"></div>\
                    </a>\
                    <a href="#" class="CQP-LinkFullScreen" id="clasificaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  CQP-Activo" id="clasificaFullScreen-' + instance + '"></div>\
                    </a>\
				</div>\
            </div>\
           <div class="CQP-Message" id="clasificaMessage-' + instance + '"></p>\
            </div>\
            <div class="CQP-Multimedia" id="clasificaMultimedia-' + instance + '">\
                <div class="CQP-StartGame">\
                    <a href="#" id="clasificaStartGame-' + instance + '">' + msgs.msgPlayStart + '</a>\
                    <a href="#" id="clasificaValidateAnswers-' + instance + '">' + msgs.msgShowAnswers + '</a>\
                </div>\
                <div id="clasificaSlide-' + instance + '" class="CQP-Slide">\
                </div>\
                <div id="clasificaContainer" class="CQP-Container" >\
                    <div class="CQP-CC CQP-CC-' + instance + '" id="clasifcaCC0" data-group="0">\
                        <span id="clasificaTitle0-' + instance + '" class="CQP-Title noselect">' + groups[0] + '</span>\
                        <div class="CQP-Container0 CQP-Line"></div>\
                    </div>\
                    <div class="CQP-CC CQP-CC-' + instance + '" id="clasifcaCC1-' + instance + '" data-group="1">\
                        <span id="clasificaTitle1-' + instance + '" class="CQP-Title noselect">' + groups[1] + '</span>\
                        <div class="CQP-Container1 CQP-Line"></div>\
                    </div>\
                    <div class="CQP-CC CQP-CC-' + instance + '" id="clasifcaCC2-' + instance + '" data-group="2">\
                        <span id="clasificaTitle2-' + instance + '" class="CQP-Title noselect">' + groups[2] + '</span>\
                        <div class="CQP-Container2  CQP-Line"></div>\
                    </div>\
                    <div class="CQP-CC CQP-CC-' + instance + '" id="clasifcaCC3-' + instance + '" data-group="3">\
                        <span id="clasificaTitle3-' + instance + '" class=" CQP-Title noselect">' + groups[3] + '</span>\
                        <div class="CQP-Container3  CQP-Line"></div>\
                    </div>\
                </div>\
            </div>\
            <div class="CQP-Cubierta" id="clasificaCubierta-' + instance + '">\
                <div class="CQP-CodeAccessDiv" id="clasificaCodeAccessDiv-' + instance + '">\
                    <div class="CQP-MessageCodeAccessE" id="clasificaMesajeAccesCodeE-' + instance + '"></div>\
                    <div class="CQP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="CQP-CodeAccessE" id="clasificaCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="clasificaCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                        <div class="exeQuextIcons-Submit CQP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="CQP-ShowClue" id="clasificaShowClue-' + instance + '">\
                    <p class="sr-av">' + msgs.msgClue + '</p>\
                    <p class="CQP-PShowClue" id="clasificaPShowClue-' + instance + '"></p>\
                    <a href="#" class="CQP-ClueBotton" id="clasificaClueButton-' + instance + '" title="' + msgs.msgContinue + '">' + msgs.msgContinue + ' </a>\
                </div>\
                <div class="CQP-RebootGame" id="clasificaRebootGame-' + instance + '">\
                    <p>' + msgs.msgRebootGame + '</p>\
                    <p class="CQP-RebootButtons">\
                        <a href="#" class="CQP-ClueBotton" id="clasificaRebootYes-' + instance + '" title="' + msgs.msgYes + '">' + msgs.msgYes + '</a>\
                        <a href="#" class="CQP-ClueBotton" id="clasificaRebootNo-' + instance + '" title="' + msgs.msgNo + '">' + msgs.msgNo + ' </a>\
                    </p>\
                </div>\
            </div>\
            <div class="CQP-DivFeedBack" id="clasificaDivFeedBack-' + instance + '">\
                <input type="button" id="clasificaFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
            <div class="CQP-AuthorGame" id="clasificaAuthorGame-' + instance + '"></div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },

    addButtonScore: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        var butonScore = "";
        var fB = '<div class="CQP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="CQP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="clasificaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="CQP-RepeatActivity" id="clasificaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="CQP-GetScore">';
                fB += '<p><span class="CQP-RepeatActivity" id="clasificaRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    updateEvaluationIcon: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data = $eXeClasifica.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                $eXeClasifica.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
            $eXeClasifica.showEvaluationIcon(instance, state, score);
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#clasificaMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');
        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions = $eXeClasifica.options[instance];
        var $header = $('#clasificaGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
        }
        $('#clasificaEvaluationIcon-' + instance).remove();
        var sicon = '<div id="clasificaEvaluationIcon-' + instance + '" class="CQP-EvaluationDivIcon"><img  src="' + $eXeClasifica.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#clasificaEvaluationIcon-' + instance).find('span').eq(0).text(alt)
    },
    updateEvaluation: function (obj1, obj2, id1) {
        if (!obj1) {
            obj1 = {
                id: id1,
                activities: []
            };
        }
        const findObject = obj1.activities.find(
            obj => obj.id === obj2.id && obj.node === obj2.node
        );

        if (findObject) {
            findObject.state = obj2.state;
            findObject.score = obj2.score;
            findObject.name = obj2.name;
            findObject.date = obj2.date;
        } else {
            obj1.activities.push({
                'id': obj2.id,
                'type': obj2.type,
                'node': obj2.node,
                'name': obj2.name,
                'score': obj2.score,
                'date': obj2.date,
                'state': obj2.state,
            });
        }
        return obj1;
    },
    getDateString: function () {
        var currentDate = new Date();
        var formattedDate = currentDate.getDate().toString().padStart(2, '0') + '/' +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
            currentDate.getFullYear().toString().padStart(4, '0') + ' ' +
            currentDate.getHours().toString().padStart(2, '0') + ':' +
            currentDate.getMinutes().toString().padStart(2, '0') + ':' +
            currentDate.getSeconds().toString().padStart(2, '0');
        return formattedDate;

    },

    saveEvaluation: function (instance, score) {
        var mOptions = $eXeClasifica.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#clasificaGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text();
            var formattedDate = $eXeClasifica.getDateString();
            var scorm = {
                'id': mOptions.id,
                'type': mOptions.msgs.msgTypeGame,
                'node': node,
                'name': name,
                'score': score,
                'date': formattedDate,
                'state': (parseFloat(score) >= 5 ? 2 : 1)
            }
            var data = $eXeClasifica.getDataStorage(mOptions.evaluationID);
            data = $eXeClasifica.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeClasifica.showEvaluationIcon(instance, scorm.state, scorm.score)
        }
    },
    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data = $eXeClasifica.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeClasifica.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.cardsGame.length).toFixed(2);
        if (mOptions.gameLevel == 0) {
            score = (((mOptions.hits * 10) / mOptions.numberQuestions) * (mOptions.hits / mOptions.attempts)).toFixed(2);
        }
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeClasifica.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.repeatActivity && $eXeClasifica.previousScore !== '') {
                        message = $eXeClasifica.userName !== '' ? $eXeClasifica.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeClasifica.previousScore = score;
                        $eXeClasifica.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeClasifica.userName !== '' ? $eXeClasifica.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#clasificaSendScore-' + instance).hide();
                        }
                        $('#clasificaRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#clasificaRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeClasifica.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeClasifica.mScorm.set("cmi.core.score.raw", score);
                    $('#clasificaRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#clasificaRepeatActivity-' + instance).show();
                    message = "";
                }
            } else {
                message = mOptions.msgs.msgScoreScorm;
            }

        } else {
            var hasClass = $("body").hasClass("exe-scorm");
            message = (hasClass) ? mOptions.msgs.msgEndGameScore : mOptions.msgs.msgScoreScorm;
        }
        if (!auto) alert(message);
    },
    addCards: function (instance, cardsGame) {
        var cards = "";
        cardsGame = $eXeClasifica.shuffleAds(cardsGame);
        $('#clasificaSlide-' + instance).find('.CQP-CardContainer').remove();
        for (var i = 0; i < cardsGame.length; i++) {
            cardsGame[i].answer = -1;
            var card = $eXeClasifica.createCard(i, cardsGame[i].type, cardsGame[i].url, cardsGame[i].eText, cardsGame[i].audio, cardsGame[i].x, cardsGame[i].y, cardsGame[i].alt, cardsGame[i].group, cardsGame[i].color, cardsGame[i].backcolor, instance);
            cards += card;
        }
        $('#clasificaSlide-' + instance).append(cards);
    },
    createCard: function (j, type, url, text, audio, x, y, alt, group, color, backcolor, instance) {
        var mOptions = $eXeClasifica.options[instance],
            malt = alt || '',
            saudio = "";
        if (url.trim().length > 0 && text.trim() > 0) {
            saudio = '<a href="#" data-audio="' + audio + '" class="CQP-LinkAudio"  title="' + mOptions.msgs.msgAudio + '"><img src="' + $eXeClasifica.idevicePath + 'exequextplayaudio.svg" class="CQP-Audio"  alt="' + mOptions.msgs.msgAudio + '"></a>';
        } else {
            saudio = '<a href="#" data-audio="' + audio + '" class="CQP-LinkAudio"  title="' + mOptions.msgs.msgAudio + '"><img src="' + $eXeClasifica.idevicePath + 'exequextplayaudio.svg" class="CQP-Audio"  alt="' + mOptions.msgs.msgAudio + '"></a>'
        }
        var card = '<div class="CQP-CardContainer noselect" data-number="' + j + '" data-group="' + group + '" data-type="' + type + '" data-state="-1">\
                    <div class="CQP-Card noselect" data-type="' + type + '" data-state="-1" data-valid="0">\
                        <div class="CQP-CardFront noselect">\
                        </div>\
                        <div class="CQP-CardBack noselect">\
                            <div class="CQP-ImageContain">\
                                <img src="" class="CQP-Image noselect" data-url="' + url + '" data-x="' + x + '" data-y="' + y + '" alt="' + malt + '" />\
                                <img class="CQP-Cursor noselect" src="' + $eXeClasifica.idevicePath + 'exequextcursor.gif" alt="" />\
                            </div>\
                            <div class="CQP-EText noselect" data-color="' + color + '" data-backcolor="' + backcolor + '">' + text + '</div>\
                            ' + saudio + '\
                        </div>\
                    </div>\
                </div>';
        return card
    },

    clear: function (phrase) {
        return phrase.replace(/[&\s\n\r]+/g, " ").trim();
    },
    getFullscreen: function (element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    toggleFullscreen: function (element, instance) {
        var mOptions = $eXeClasifica.options[instance],
            element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            mOptions.fullscreen = true;
            $eXeClasifica.getFullscreen(element);
        } else {
            mOptions.fullscreen = false;
            $eXeClasifica.exitFullscreen(element);
        }
        $eXeClasifica.refreshCards(instance)
    },
    exitFullscreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    addEvents: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        $('#clasificaLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#clasificaGameContainer-" + instance).show()
            $("#clasificaGameMinimize-" + instance).hide();
        });
        $("#clasificaLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#clasificaGameContainer-" + instance).hide();
            $("#clasificaGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        $('#clasificaCubierta-' + instance).hide();
        $('#clasificaGameOver-' + instance).hide();
        $('#clasificaCodeAccessDiv-' + instance).hide();
        $("#clasificaLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('clasificaGameContainer-' + instance);
            $eXeClasifica.toggleFullscreen(element, instance)
        });
        $('#clasificaFeedBackClose-' + instance).on('click', function (e) {
            $('#clasificaDivFeedBack-' + instance).hide();
            $('#clasificaGameOver-' + instance).show();
        });
        if (mOptions.itinerary.showCodeAccess) {
            $('#clasificaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#clasificaCodeAccessDiv-' + instance).show();
            $('#clasificaCubierta-' + instance).show();
            $('#clasificaStartGame-' + instance).hide();
        }
        $('#clasificaCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeClasifica.enterCodeAccess(instance);
        });
        $('#clasificaCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeClasifica.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#clasificaPNumber-' + instance).text(mOptions.numberQuestions);
        $(window).on('unload', function () {
            if (typeof ($eXeClasifica.mScorm) != "undefined") {
                $eXeClasifica.endScorm();
            }
        });
        if (mOptions.isScorm > 0) {
            $eXeClasifica.updateScorm($eXeClasifica.previousScore, mOptions.repeatActivity, instance);
        }
        $('#clasificaSendScore-' + instance).click(function (e) {
            e.preventDefault();
            var score = ((mOptions.hits * 10) / mOptions.cardsGame.length).toFixed(2);
            if (mOptions.gameLevel == 0) {
                score = (((mOptions.hits * 10) / mOptions.numberQuestions) * (mOptions.hits / mOptions.attempts)).toFixed(2);
            }
            if (mOptions.gameLevel == 2 || mOptions.gameOver) {
                $eXeClasifica.sendScore(instance, false);
                $eXeClasifica.saveEvaluation(instance,score);
            } else {
                window.alert(mOptions.msgs.msgEndGamerScore);
            }

        });
        $('#clasificaImage-' + instance).hide();
        window.addEventListener('resize', function () {
            var element = document.getElementById('clasificaGameContainer-' + instance);
            element = element || document.documentElement;
            mOptions.fullscreen = !(!document.fullscreenElement && !document.mozFullScreenElement &&
                !document.webkitFullscreenElement && !document.msFullscreenElement);
            $eXeClasifica.refreshCards(instance);
        });
        $('#clasificaStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeClasifica.startGame(instance);
        });
        $('#clasificaClueButton-' + instance).on('click', function (e) {
            e.preventDefault();
            $('#clasificaShowClue-' + instance).hide();
            $('#clasificaCubierta-' + instance).fadeOut();
        });
        $('#clasificaLinkReboot-' + instance).hide()
        $('#clasificaLinkReboot-' + instance).on('click', function (e) {
            e.preventDefault();
            if (!mOptions.gameStarted) return;
            $('#clasificaRebootGame-' + instance).show();
            $('#clasificaCubierta-' + instance).fadeIn();
        });
        $('#clasificaRebootYes-' + instance).on('click', function (e) {
            e.preventDefault();
            mOptions.gameOver = true;
            mOptions.gameStarted = false;
            clearInterval(mOptions.counterClock);
            $eXeClasifica.startGame(instance);
            $('#clasificaRebootGame-' + instance).hide();
            $('#clasificaCubierta-' + instance).fadeOut();
        });
        $('#clasificaRebootNo-' + instance).on('click', function (e) {
            e.preventDefault();
            $('#clasificaRebootGame-' + instance).hide();
            $('#clasificaCubierta-' + instance).fadeOut();
        }); -
        $('#clasificaMultimedia-' + instance).on('click', '.CQP-LinkAudio', function (e) {
            e.preventDefault();
            var audio = $(this).data('audio');
            $eXeClasifica.playSound(audio, instance);
        });
        $('#clasificaMultimedia-' + instance).on('click', '.CQP-LinkAudioBig', function (e) {
            e.preventDefault();
            var audio = $(this).data('audio');
            $eXeClasifica.playSound(audio, instance);
        });
        $('#clasificaPErrors-' + instance).text(0);
        if (mOptions.time == 0) {
            $('#clasificaPTime-' + instance).hide();
            $('#clasificaImgTime-' + instance).hide();
            $eXeClasifica.uptateTime(mOptions.time * 60, instance);
        } else {
            $eXeClasifica.uptateTime(mOptions.time * 60, instance);
        }
        if (mOptions.author.trim().length > 0 && !mOptions.fullscreen) {
            $('#clasificaAuthorGame-' + instance).html(mOptions.msgs.msgAuthor + ': ' + mOptions.author);
            $('#clasificaAuthorGame-' + instance).show();
        }
        $('#clasificaValidateAnswers-' + instance).hide();
        $(' #clasificaMultimedia-' + instance + ' img').on('dragstart', function (event) {
            event.preventDefault();
        });
        $('#clasificaMultimedia-' + instance).find('.CQP-CardContainer').on('mousedown touchstart', function (event) {
            $(this).parent('.CQP-CC').css({
                'z-index': '100',
            });
            $(this).css({
                'z-index': '1000',
            });
            if (mOptions.gameStarted) {
                $eXeClasifica.checkAudio(this, instance);
            }
        });
        $(' #clasificaMultimedia-' + instance).find('.CQP-CardContainer').on('mouseup touchend', function (event) {
            $(this).parent('.CQP-CC').css({
                'z-index': '1',
            });
            $(this).css({
                'z-index': '1'
            });
        });
        $('#clasificaValidateAnswers-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeClasifica.gameOver(instance);
        });
        $('.CQP-CC-' + instance).each(function (i) {
            $(this).hide();
            if (i < mOptions.numberGroups) {
                $(this).show();
            }
        });
        if (mOptions.gameLevel < 2) {
            $('#clasificaPHits-' + instance).hide();
            $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Hit').hide();
            $('#clasificaPErrors-' + instance).hide();
            $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Error').hide();
            $('#clasificaPScore-' + instance).hide();
            $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Score').hide();
        }
        $eXeClasifica.updateEvaluationIcon(instance)
    },
    checkAudio: function (card, instance) {
        var audio = $(card).find('.CQP-LinkAudio').data('audio');
        if (typeof audio != "undefined" && audio.length > 3) {
            $eXeClasifica.playSound(audio, instance)
        }
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    moveCard: function ($item, $container, instance) {
        var mOptions = $eXeClasifica.options[instance],
            $header = $($container).find('.CQP-Line').eq(0);
        $header.after($item);
        mOptions.attempts++;
        var group = $item.data('group'),
            groupp = $item.parent().data('group'),
            type = 1,
            correctAnswer = false,
            message = '',
            number = parseInt($item.data("number"));
        if (mOptions.gameLevel == 2) {
            $item.draggable('destroy');
            if (group == groupp) {
                $item.find('.CQP-Card').addClass('CQP-CardOK');
                type = 2;
                correctAnswer = true;
            } else {
                $item.find('.CQP-Card').addClass('CQP-CardKO');
            }
            message = $eXeClasifica.getMessageAnswer(correctAnswer, number, instance);
            $item.css({
                'cursor': 'default'
            });
        } else {
            if (group == groupp) {
                correctAnswer = true;
                type = 2;
            }
            if (mOptions.gameLevel == 0) {
                $item.find('.CQP-Card').removeClass('CQP-CardOK CQP-CardKO');
                var mclass = correctAnswer ? 'CQP-CardOK' : 'CQP-CardKO'
                $item.find('.CQP-Card').addClass(mclass);
                message = $eXeClasifica.getMessageAnswer(correctAnswer, number, instance);
            }
            $item.css({
                'cursor': 'pointer'
            });
        }
        $eXeClasifica.showMessage(type, message, instance);
        $eXeClasifica.updateScore($item, correctAnswer, instance);
        $eXeClasifica.showCard($item, instance);
        $eXeClasifica.updateQuestionNumber(instance);
        var html = $('#clasificaMultimedia-' + instance).html(),
            latex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeClasifica.updateLatex('clasificaMultimedia-' + instance)
        }
    },
    updateScore: function ($card, answer, instance) {
        var mOptions = $eXeClasifica.options[instance],
            state = parseInt($card.data('state'));
        if (state == -1) {
            if (answer) {
                mOptions.hits++
                $card.data('state', 1);
            } else {
                mOptions.errors++;
                $card.data('state', 0);
            }
        } else if (state == 0) {
            if (answer) {
                mOptions.hits++;
                mOptions.errors--;
                $card.data('state', 1);
            }
        } else if (state == 1) {
            if (!answer) {
                mOptions.hits--;
                mOptions.errors++;
                $card.data('state', 1);
            }
        }
        if (mOptions.gameLevel == 2) {
            mOptions.score = (mOptions.hits * 10 / mOptions.cardsGame.length).toFixed(2);
            $('#clasificaPHits-' + instance).text(mOptions.hits);
            $('#clasificaPErrors-' + instance).text(mOptions.errors);
            $('#clasificaPScore-' + instance).text(mOptions.score);
            var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
            if (mOptions.isScorm == 1) {
                if (mOptions.repeatActivity || $eXeClasifica.initialScore === '') {
                    $eXeClasifica.sendScore(instance, true);
                    $('#clasificaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                    $eXeClasifica.initialScore = score;
                }
            }
            $eXeClasifica.saveEvaluation(instance, score);
        }

    },
    updateQuestionNumber: function (instance) {
        var mOptions = $eXeClasifica.options[instance],
            numch = $('#clasificaSlide-' + instance).children().length;
        $('#clasificaPNumber-' + instance).text(numch);
        $eXeClasifica.checkClueGame(instance);
        if (mOptions.gameLevel == 0) {
            if (mOptions.hits == mOptions.cardsGame.length) {
                $eXeClasifica.gameOver(instance);
                return
            }
        }
        if (numch == 0) {
            if (mOptions.gameLevel == 2) {
                $eXeClasifica.gameOver(instance);
            } else if (mOptions.gameLevel == 1) {
                $('#clasificaValidateAnswers-' + instance).show();
            } else if (mOptions.gameLevel == 0) {
                if ($eXeClasifica.getNumberCorrectsAnswers(instance) == mOptions.cardsGame.length) {
                    $eXeClasifica.gameOver(instance);
                }
            }
        }
    },
    gameOverLevel0: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        $eXeClasifica.showLevel0Score(instance);
         var score = (((mOptions.hits * 10) / mOptions.numberQuestions) * (mOptions.hits / mOptions.attempts)).toFixed(2);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeClasifica.initialScore === '') {
                $eXeClasifica.sendScore(instance, true);
                $('#clasificaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeClasifica.initialScore = score;
            }
        }
        $eXeClasifica.saveEvaluation(instance, score);
    },
    gameOverLevel1: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        $eXeClasifica.showLevel1Score(instance);
        var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeClasifica.initialScore === '') {
                $eXeClasifica.sendScore(instance, true);
                $('#clasificaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeClasifica.initialScore = score;
            }
        }
        $eXeClasifica.saveEvaluation(instance, score);
    },
    gameOverLevel2: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        $eXeClasifica.showCustomScore(instance);
        var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeClasifica.initialScore === '') {
                $eXeClasifica.sendScore(instance, true);
                $('#clasificaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeClasifica.initialScore = score;
            }
        }
       $eXeClasifica.saveEvaluation(instance, score);

    },
    checkClueGame: function (instance) {
        var mOptions = $eXeClasifica.options[instance],
            percentageHits = (mOptions.hits / mOptions.cardsGame.length) * 100;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                $('#clasificaPShowClue-' + instance).text(mOptions.itinerary.clueGame);
                $('#clasificaShowClue-' + instance).show();
                $('#clasificaCubierta-' + instance).show();
            }
        }
    },
    gameOver: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        if (!mOptions.gameStarted) {
            return;
        }
        mOptions.gameOver = true;
        mOptions.gameStarted = false;
        clearInterval(mOptions.counterClock);
        $('#clasificaSlide-' + instance).find('.CQP-CardContainer').draggable('destroy');
        if ($('#clasificaSlide-' + instance).children().length == 0) {
            $('#clasificaSlide-' + instance).hide();
        }
        if (mOptions.gameLevel == 0) {
            $eXeClasifica.gameOverLevel0(instance);
        } else if (mOptions.gameLevel == 1) {
            $eXeClasifica.gameOverLevel1(instance);
        } else if (mOptions.gameLevel == 2) {
            $eXeClasifica.gameOverLevel2(instance);
        }
        $eXeClasifica.checkClueGame(instance);
        $eXeClasifica.showFeedBack(instance);
        if (mOptions.isScorm == 2) {
            $('#clasificaRepeatActivity-' + instance).fadeIn(1000);
            $('#clasificaSendScore-' + instance).show();
        }

    },
    setSize: function ($cc, instance) {
        var $text = $cc.find('.CQP-EText'),
            hasLatex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test($text.text()),
            minw = 48,
            maxw = 128,
            wcp = $('#clasificaMultimedia-' + instance).width(),
            wcc = Math.round(wcp / 6);
        if (wcc <= minw) {
            wcc = minw;
        } else if (wcc >= maxw) {
            wcc = maxw;
        }
        var font = Math.floor(18 * wcc / 120);
        if (hasLatex) {
            var font = Math.floor(14 * wcc / 120);
        }
        if (font > 20) {
            font = 20;
        } else if (font < 8) {
            font = 8;
        }
        $cc.css({
            'width': wcc + 'px',
            'min-width': wcc + 'px',
        });
        $text.css({
            'font-size': font + 'px'
        })
    },
    showCustomScore: function (instance) {
        var mOptions = $eXeClasifica.options[instance],
            $cc = $('#clasificaMultimedia-' + instance).find('.CQP-CardContainer');
        $('#clasificaPHits-' + instance).text(mOptions.hits);
        $('#clasificaPErrors-' + instance).text(mOptions.errors);
        $('#clasificaPScore-' + instance).text(mOptions.score);
        $('#clasificaPHits-' + instance).show();
        $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Hit').show();
        $('#clasificaPErrors-' + instance).show();
        $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Error').show();
        $('#clasificaPScore-' + instance).show();
        $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Score').show();
        $('#clasificaStartGame-' + instance).show();
        mOptions.hits = $eXeClasifica.getNumberCorrectsAnswers(instance);
        mOptions.score = (mOptions.hits * 10 / mOptions.cardsGame.length).toFixed(2);
        var msg = '',
            type = 1;
        if (mOptions.hits / mOptions.cardsGame.length < 0.5) {
            msg = mOptions.msgs.msgQ5.replace("%s", mOptions.cardsGame.length - mOptions.hits);
        } else if (mOptions.hits / mOptions.cardsGame.length < 0.7) {
            msg = mOptions.msgs.msgQ7.replace("%s", mOptions.cardsGame.length - mOptions.hits);
        } else if (mOptions.hits / mOptions.cardsGame.length < 1) {
            msg = mOptions.msgs.msgQ9.replace("%s", mOptions.cardsGame.length - mOptions.hits);
        } else {
            type = 1;
            msg = mOptions.msgs.msgAllCorrect;
        }
        $eXeClasifica.showMessage(type, msg, instance);
    },
    showLevel1Score: function (instance) {
        var mOptions = $eXeClasifica.options[instance],
            $cc = $('#clasificaMultimedia-' + instance).find('.CQP-CardContainer');
        mOptions.gameOver = true;
        mOptions.gameStarted = false;
        $cc.draggable('destroy');
        $cc.css({
            'cursor': 'default'
        });
        mOptions.score = 0;
        mOptions.hits = 0;
        mOptions.errors = 0;
        $cc.each(function () {
            var group = $(this).data('group'),
                groupp = $(this).parent().data('group');
            if (group == groupp) {
                mOptions.hits++;
                $(this).find('.CQP-Card').addClass('CQP-CardOK');

            } else {
                mOptions.errors++;
                $(this).find('.CQP-Card').addClass('CQP-CardKO');
            }
        });
        $eXeClasifica.showCustomScore(instance);
        $('#clasificaStartGame-' + instance).text(mOptions.msgs.msgPlayAgain);
        $('#clasificaStartGame-' + instance).show();
        $('#clasificaValidateAnswers-' + instance).hide();
    },


    showLevel0Score: function (instance) {
        var mOptions = $eXeClasifica.options[instance],
            $cc = $('#clasificaMultimedia-' + instance).find('.CQP-CardContainer');
        $cc.draggable('destroy');
        $cc.css({
            'cursor': 'default'
        });
        mOptions.hits = 0;
        $cc.each(function () {
            var group = $(this).data('group'),
                groupp = $(this).parent().data('group');
            if (group === groupp) {
                mOptions.hits++;
                $(this).find('.CQP-Card').addClass('CQP-CardOK');
            } else {
                $(this).find('.CQP-Card').addClass('CQP-CardKO');
            }
        });
        var msg = '',
            type = 1;
        if (mOptions.hits < mOptions.cardsGame.length) {
            msg = mOptions.msgs.msgUnansweredQuestions.replace("%s", mOptions.cardsGame.length - mOptions.hits)
        } else {
            type = 1;
            if (mOptions.attempts == mOptions.cardsGame.length) {
                msg = mOptions.msgs.msgAllCorrect;
            } else {
                msg = mOptions.msgs.msgTooManyTries.replace("%s", mOptions.attempts);
            }
        }
        $('#clasificaStartGame-' + instance).text(mOptions.msgs.msgPlayAgain);
        $('#clasificaStartGame-' + instance).show();
        $('#clasificaValidateAnswers-' + instance).hide();
        $eXeClasifica.showMessage(type, msg, instance);
    },
    getColors: function (number) {
        var colors = [];
        for (var i = 0; i < number; i++) {
            var color = $eXeClasifica.colorRGB();
            colors.push(color);
        }
        return colors;
    },
    colorRGB: function () {
        var color = "(" + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + ")";
        return "rgb" + color;
    },
    showCard: function (card, instance) {
        var mOptions = $eXeClasifica.options[instance],
            $card = card,
            $text = $card.find('.CQP-EText').eq(0),
            $image = $card.find('.CQP-Image').eq(0),
            $cursor = $card.find('.CQP-Cursor').eq(0),
            $audio = $card.find('.CQP-LinkAudio').eq(0),
            type = parseInt($card.data('type')),
            x = parseFloat($image.data('x')),
            y = parseFloat($image.data('y')),
            url = $image.data('url'),
            alt = $image.attr('alt') || '',
            audio = $audio.data('audio') || '',
            number = parseInt($card.data('number')),
            text = $text.text() || "",
            color = $text.data('color'),
            backcolor = $text.data('backcolor');
        $text.hide();
        $image.hide();
        $cursor.hide();
        $audio.hide();
        if (type == 1) {
            $text.show();
            $text.css({
                'color': color,
                'background-color': backcolor,
            });

        } else if (type == 0 && url.length > 0) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        $cursor.hide();
                    } else {
                        var mData = $eXeClasifica.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeClasifica.drawImage(this, mData);
                        $image.show();
                        $cursor.hide();
                        if (x > 0 && y > 0) {
                            var left = Math.round(mData.x + (x * mData.w));
                            var top = Math.round(mData.y + (y * mData.h));
                            $cursor.css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            $cursor.show();
                        }
                    }
                }).on('error', function () {
                    $cursor.hide();
                });
        } else if (type == 2 && url.length > 0) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        $cursor.hide();
                    } else {
                        var mData = $eXeClasifica.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeClasifica.drawImage(this, mData);
                        $image.show();
                        $cursor.hide();
                        if (x > 0 && y > 0) {
                            var left = Math.round(mData.x + (x * mData.w));
                            var top = Math.round(mData.y + (y * mData.h));
                            $cursor.css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            $cursor.show();
                        }
                    }
                }).on('error', function () {
                    $cursor.hide();
                });
            $text.show();
            $text.css({
                'color': '#000',
                'background-color': 'rgba(255, 255, 255, 0.7)',
            });
        }
        $audio.removeClass('CQP-LinkAudioBig')
        if (audio.length > 0) {
            if (url.trim().length == 0 && text.trim().length == 0) {
                $audio.addClass('CQP-LinkAudioBig')
            }
            $audio.show();
        }

        $text.text(mOptions.cardsGame[number].eText);
        $eXeClasifica.setSize($card, instance);


    },

    getNumberCorrectsAnswers: function (instance) {
        var $cc = $('#clasificaMultimedia-' + instance).find('.CQP-CardContainer'),
            hits = 0;
        $cc.each(function () {
            var group = $(this).data('group'),
                groupp = $(this).parent().data('group');
            if (group === groupp) {
                hits++;
            }

        });
        return hits;
    },
    refreshCards: function (instance) {
        var mOptions = $eXeClasifica.options[instance],
            $cards = $('#clasificaMultimedia-' + instance).find('.CQP-CardContainer');
        mOptions.refreshCard = true;
        $cards.each(function () {
            $eXeClasifica.showCard($(this), instance)
        });

        mOptions.refreshCard = false;

    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        if (mOptions.itinerary.codeAccess == $('#clasificaCodeAccessE-' + instance).val()) {
            $('#clasificaCodeAccessDiv-' + instance).hide();
            $('#clasificaCubierta-' + instance).hide();
            $eXeClasifica.startGame(instance);

        } else {
            $('#clasificaMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#clasificaCodeAccessE-' + instance).val('');
        }
    },
    initCards: function (instance) {

        var $cards = $('#clasificaMultimedia-' + instance).find('.CQP-CardContainer');
        $cards.each(function () {
            $(this).data('state', '-1');
            $eXeClasifica.showCard($(this), instance, this);
        });
        var html = $('#clasificaMultimedia-' + instance).html(),
            latex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeClasifica.updateLatex('clasificaMultimedia-' + instance)
        }
    },
    startGame: function (instance) {
        var mOptions = $eXeClasifica.options[instance],
            $cc = $('#clasificaGameContainer-' + instance).find('.CQP-CardContainer'),
            pc = '.CQP-CC-' + instance;
        if (mOptions.gameStarted) {
            return;
        };
        if (mOptions.gameOver) {
            $cc.detach().appendTo('#clasificaSlide-' + instance);
        }
        $cc.find('.CQP-Card').removeClass('CQP-CardOK CQP-CardKO');
        $cc.data('state', -1);
        $cc.css('cursor', 'pointer');
        $cc.draggable({
            revert: true,
            placeholder: false,
            droptarget: pc,
            drop: function (evt, droptarget) {
                $(this).parent(pc).css({
                    'z-index': '1',
                });
                $(this).css({
                    'z-index': '1',
                });
                $eXeClasifica.moveCard($(this), droptarget, instance);
            },
        });
        $('#clasificaStartGame-' + instance).hide();
        $('#clasificaSlide-' + instance).show();
        $cc.find('.CQP-Card').addClass('flipped');
        $eXeClasifica.showMessage(3, mOptions.msgs.mgsGameStart, instance, false);
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.attempts = 0;
        mOptions.counter = mOptions.time * 60;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.obtainedClue = false;
        $('#clasificaPShowClue-' + instance).text('');
        $('#clasificaShowClue-' + instance).hide();
        $('#clasificaPHits-' + instance).text(mOptions.hits);
        $('#clasificaPErrors-' + instance).text(mOptions.errors);
        $('#clasificaPScore-' + instance).text(mOptions.score);
        $('#clasificaPNumber-' + instance).text(mOptions.numberQuestions);
        $('#clasificaCubierta-' + instance).hide();
        $('#clasificaGameOver-' + instance).hide();
        $('#clasificaMessage-' + instance).hide();
        if (mOptions.gameLevel < 2) {
            $('#clasificaPHits-' + instance).hide();
            $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Hit').hide();
            $('#clasificaPErrors-' + instance).hide();
            $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Error').hide();
            $('#clasificaPScore-' + instance).hide();
            $('#clasificaGameScoreBoard-' + instance).find('div.exeQuextIcons-Score').hide();
        }
        if (mOptions.isScorm == 2 && mOptions.gameLevel != 2) {
            $('#clasificaRepeatActivity-' + instance).hide();
            $('#clasificaSendScore-' + instance).hide();
        }
        $eXeClasifica.initCards(instance);
        if (mOptions.time == 0) {
            $('#clasificaPTime-' + instance).hide();
            $('#clasificaImgTime-' + instance).hide();
        }
        if (mOptions.time > 0) {
            mOptions.counterClock = setInterval(function () {
                if (mOptions.gameStarted) {
                    mOptions.counter--;
                    $eXeClasifica.uptateTime(mOptions.counter, instance);
                    if (mOptions.counter <= 0) {
                        clearInterval(mOptions.counterClock);
                        $eXeClasifica.gameOver(instance);
                        return;
                    }
                }
            }, 1000);
            $eXeClasifica.uptateTime(mOptions.time * 60, instance);
        }

        mOptions.gameStarted = true;
    },
    uptateTime: function (tiempo, instance) {
        var mOptions = $eXeClasifica.options[instance];
        if (mOptions.time == 0) return;
        var mTime = $eXeClasifica.getTimeToString(tiempo);
        $('#clasificaPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },


    showFeedBack: function (instance) {
        var mOptions = $eXeClasifica.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.cardsGame.length;
        if (mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#clasificaGameOver-' + instance).hide();
                $('#clasificaDivFeedBack-' + instance).find('.clasifica-feedback-game').show();
                $('#clasificaDivFeedBack-' + instance).show();
            } else {
                $eXeClasifica.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance, false);
            }
        }
    },
    isMobile: function () {
        return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i))
    },

    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },

    paintMouse: function (image, cursor, x, y) {
        x = parseFloat(x) || 0;
        y = parseFloat(y) || 0;
        $(cursor).hide();
        if (x > 0 || y > 0) {
            var wI = $(image).width() > 0 ? $(image).width() : 1,
                hI = $(image).height() > 0 ? $(image).height() : 1,
                lI = $(image).position().left + (wI * x),
                tI = $(image).position().top + (hI * y);
            $(cursor).css({
                left: lI + 'px',
                top: tI + 'px',
                'z-index': 230
            });
            $(cursor).show();
        }
    },
    getRetroFeedMessages: function (iHit, instance) {
        var mOptions = $eXeClasifica.options[instance],
            sMessages = iHit ? mOptions.msgs.msgSuccesses : mOptions.msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    getMessageAnswer: function (correctAnswer, number, instance) {
        var message = "";
        if (correctAnswer) {
            message = $eXeClasifica.getMessageCorrectAnswer(number, instance);
        } else {
            message = $eXeClasifica.getMessageErrorAnswer(number, instance);
        }
        return message;
    },
    getMessageCorrectAnswer: function (number, instance) {
        var mOptions = $eXeClasifica.options[instance],
            messageCorrect = $eXeClasifica.getRetroFeedMessages(true, instance),
            message = messageCorrect;
        if (!isNaN(number) && number < mOptions.cardsGame.length && mOptions.customMessages && mOptions.cardsGame[number].msgHit.length > 0) {
            message = mOptions.cardsGame[number].msgHit
        }
        return message;
    },
    getMessageErrorAnswer: function (number, instance) {
        var mOptions = $eXeClasifica.options[instance],
            messageUnCorrect = $eXeClasifica.getRetroFeedMessages(false, instance),
            message = messageUnCorrect;
        if (!isNaN(number) && number < mOptions.cardsGame.length && mOptions.customMessages && mOptions.cardsGame[number].msgError.length > 0) {
            message = mOptions.cardsGame[number].msgError
        }
        return message
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeClasifica.borderColors.red, $eXeClasifica.borderColors.green, $eXeClasifica.borderColors.blue, $eXeClasifica.borderColors.yellow],
            color = colors[type];
        $('#clasificaMessage-' + instance).text(message);
        $('#clasificaMessage-' + instance).css({
            'color': color
        });
        $('#clasificaMessage-' + instance).show();
    },
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    placeImageWindows: function (image, naturalWidth, naturalHeight) {
        var wDiv = $(image).parent().width() > 0 ? $(image).parent().width() : 1,
            hDiv = $(image).parent().height() > 0 ? $(image).parent().height() : 1,
            varW = naturalWidth / wDiv,
            varH = naturalHeight / hDiv,
            wImage = wDiv,
            hImage = hDiv,
            xImagen = 0,
            yImagen = 0;
        if (varW > varH) {
            wImage = parseInt(wDiv);
            hImage = parseInt(naturalHeight / varW);
            yImagen = parseInt((hDiv - hImage) / 2);
        } else {
            wImage = parseInt(naturalWidth / varH);
            hImage = parseInt(hDiv);
            xImagen = parseInt((wDiv - wImage) / 2);
        }
        return {
            w: wImage,
            h: hImage,
            x: xImagen,
            y: yImagen
        }
    },
    supportedBrowser: function (idevice) {
        var ua = window.navigator.userAgent,
            msie = ua.indexOf('MSIE '),
            sp = true;
        if (msie > 0) {
            var ie = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            if (ie < 10) {
                var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
                $('.' + idevice + '-instructions').text(bns);
                sp = false;
            }
        }
        return sp;
    },
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }
}
$(function () {
    $eXeClasifica.init();
});