/**
 * VideoQuExt iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeVideoQuExt = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#00a300',
        red: '#b3092f',
        white: '#f9f9f9',
        yellow: '#f3d55a',
        grey: '#777777',
        incorrect: '#d9d9d9',
        correct: '#00ff00'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#dfe3f1',
        green: '#caede8',
        red: '#fbd2d6',
        white: '#f9f9f9',
        yellow: '#fcf4d3',
        correct: '#dcffdc'
    },
    image: '',
    widthImage: 0,
    heightImage: 0,
    options: {},
    userName: '',
    scorm: '',
    previousScore: '',
    initialScore: '',
    msgs: '',
    youtubeLoaded: false,
    hasSCORMbutton: false,
    isInExe: false,
    hasLATEX: false,
    init: function () {
        this.activities = $('.vquext-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeVideoQuExt.supportedBrowser('vquext')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>VideoQuExt</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/videoquext-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeVideoQuExt.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeVideoQuExt.enable()');
        else this.enable();
        $eXeVideoQuExt.mScorm = scorm;
        var callSucceeded = $eXeVideoQuExt.mScorm.init();
        if (callSucceeded) {
            $eXeVideoQuExt.userName = $eXeVideoQuExt.getUserName();
            $eXeVideoQuExt.previousScore = $eXeVideoQuExt.getPreviousScore();
            $eXeVideoQuExt.mScorm.set("cmi.core.score.max", 10);
            $eXeVideoQuExt.mScorm.set("cmi.core.score.min", 0);
            $eXeVideoQuExt.initialScore = $eXeVideoQuExt.previousScore;
        }
    },
    enable: function () {
        $eXeVideoQuExt.loadGame();
    },
    getUserName: function () {
        var user = $eXeVideoQuExt.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeVideoQuExt.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        if ($eXeVideoQuExt.mScorm) {
            $eXeVideoQuExt.mScorm.quit();
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            text = '';
        $('#vquextSendScore-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgOnlySaveAuto;
            } else if (!repeatActivity && prevScore !== "") {
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            }
        } else if (mOptions.isScorm === 2) {
            $('#vquextSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#vquextSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#vquextRepeatActivity-' + instance).text(text);
        $('#vquextRepeatActivity-' + instance).fadeIn(1000);
    },
    updateEvaluationIcon: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data = $eXeVideoQuExt.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                $eXeVideoQuExt.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
            $eXeVideoQuExt.showEvaluationIcon(instance, state, score);
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#vquextMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');

        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions = $eXeVideoQuExt.options[instance];
        var $header = $('#vquextGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
        }
        $('#vquextEvaluationIcon-' + instance).remove();
        var sicon = '<div id="vquextEvaluationIcon-' + instance + '" class="VQXTP-EvaluationDivIcon"><img  src="' + $eXeVideoQuExt.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#vquextEvaluationIcon-' + instance).find('span').eq(0).text(alt)
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
getDirectoryURL:function() {
        var fullURL = window.location.href;
        var lastIndex = fullURL.lastIndexOf("/");
        return fullURL.substring(0, lastIndex + 1);
    },
    getDataAccess: function (id) {
        var id = 'dataAccess-' + id,
            data = $eXeVideoQuExt.isJsonString(localStorage.getItem(id));
        return data;
    },

    saveEvaluation: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            score = ((mOptions.hits * 10) / mOptions.questionsGame.length).toFixed(2);
        	var dataAccess=$eXeVideoQuExt.getDataAccess(mOptions.evaluationID);
        if ((mOptions.evaluationID && dataAccess) || (mOptions.evaluation && mOptions.evaluationID.length > 0)) {
            if (mOptions.isNavigable) {
                score = 0;
                for (var i = 0; i < mOptions.questionsGame.length; i++) {
                    score = mOptions.questionsGame[i].answerScore > 0 ? score + 1 : score;
                }
                score = ((score * 10) / mOptions.questionsGame.length).toFixed(2);
            }
            var name = $('#vquextGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text(),
                formattedDate = $eXeVideoQuExt.getDateString(),
                scorm = {
                    'id': mOptions.id,
                    'type': mOptions.msgs.msgTypeGame,
                    'node': node,
                    'name': name,
                    'score': score,
                    'date': formattedDate,
                    'state': (parseFloat(score) >= 5 ? 2 : 1)
                }
            var data = $eXeVideoQuExt.getDataStorage(mOptions.evaluationID);
            data = $eXeVideoQuExt.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeVideoQuExt.showEvaluationIcon(instance, scorm.state, scorm.score)
        }


    },
    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data = $eXeVideoQuExt.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            message = '';
        var score = ((mOptions.hits * 10) / mOptions.questionsGame.length).toFixed(2);
        if (mOptions.isNavigable) {
            score = 0;
            for (var i = 0; i < mOptions.questionsGame.length; i++) {
                score = mOptions.questionsGame[i].answerScore > 0 ? score + 1 : score;
            }
            score = ((score * 10) / mOptions.questionsGame.length).toFixed(2);
        }
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeVideoQuExt.mScorm != 'undefined') {
                if (!auto) {
                    $('#vquextSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeVideoQuExt.previousScore !== '') {
                        message = $eXeVideoQuExt.userName !== '' ? $eXeVideoQuExt.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeVideoQuExt.previousScore = score;
                        $eXeVideoQuExt.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeVideoQuExt.userName !== '' ? $eXeVideoQuExt.userName + '. ' + mOptions.msgs.msgYouScore + ': ' + score : mOptions.msgs.msgYouScore + ': ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#vquextSendScore-' + instance).hide();
                        }
                        $('#vquextRepeatActivity-' + instance).text(message);
                        $('#vquextRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeVideoQuExt.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeVideoQuExt.mScorm.set("cmi.core.score.raw", score);
                    $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score)
                    $('#vquextRepeatActivity-' + instance).show();
                    message = "";
                }
            } else {
                message = mOptions.msgs.msgScoreScorm;
            }
        } else {
            message = mOptions.msgs.msgEndGameScore;
        }
        if (!auto) alert(message);
    },
    loadGame: function () {
        $eXeVideoQuExt.options = [];
        $eXeVideoQuExt.activities.each(function (i) {
            var version = $(".vquext-version", this).eq(0).text(),
                dl = $(".vquext-DataGame", this),
                videoLocal = $(".vquext-LinkLocalVideo", this).eq(0).attr('href'),
                mOption = $eXeVideoQuExt.loadDataGame(dl, version, videoLocal),
                msg = mOption.msgs.msgPlayStart;
            $eXeVideoQuExt.options.push(mOption);
            var vquext = $eXeVideoQuExt.createInterfaceVideoQuExt(i);
            dl.before(vquext).remove();
            $('#vquextGameMinimize-' + i).hide();
            $('#vquextGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#vquextGameMinimize-' + i).show();
            } else {
                $('#vquextGameContainer-' + i).show();
            }
            $('#vquextMessageMaximize-' + i).text(msg);
            $('#vquextOptionsDiv-' + i).hide();
            $('#vquextDivReply-' + i).hide();
            $('#vquextDivFeedBack-' + i).prepend($('.vquext-feedback-game', this));
            $('#vquextDivFeedBack-' + i).hide();
            mOption.localPlayer = document.getElementById('vquextVideoLocal-' + i);
            $eXeVideoQuExt.addEvents(i);

        });
        if ($eXeVideoQuExt.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeVideoQuExt.loadMathJax();
        }
    },
    getQuestions: function (questions, percentaje) {
        var num = questions.length;
        var mQuestions = questions;
        if (percentaje < 100) {
            num = Math.round((percentaje * questions.length) / 100);
            num = num < 1 ? 1 : num;
            if (num < questions.length) {
                var array = [];
                for (var i = 0; i < questions.length; i++) {
                    array.push(i);
                }
                array = $eXeVideoQuExt.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
    Decrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        str = unescape(str);
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
    createPointsVideo: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            widthBar = $('#vquextProgressBar-' + instance).width(),
            duratioVideo = mOptions.endVideoQuExt - mOptions.startVideoQuExt,
            widthIntBar = 0;
        $('#vquextProgressBar-' + instance + ' a.VQXTP-PointBar').remove();
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            widthIntBar = ((mOptions.questionsGame[i].pointVideo - mOptions.startVideoQuExt) * widthBar) / duratioVideo;
            var bcolor = $eXeVideoQuExt.borderColors.blue;
            switch (mOptions.questionsGame[i].answerScore) {
                case 0:
                    bcolor = $eXeVideoQuExt.borderColors.red;
                    break;
                case 1:
                    bcolor = $eXeVideoQuExt.borderColors.green;
                    break;
                default:
                    break;
            }
            $('#vquextProgressBar-' + instance).append('<a href="#" class="VQXTP-PointBar" title="' + (i + 1) + '"><strong class="sr-av">' + (i + 1) + '</strong></a>');
            $('#vquextProgressBar-' + instance + ' a.VQXTP-PointBar').last().css({
                'left': widthIntBar - 3 + 'px',
                'cursor': (mOptions.isNavigable) ? 'pointer' : 'default',
                'background-color': bcolor,
                'border': 'solid 1px ' + $eXeVideoQuExt.colors.black
            });
            $('#vquextProgressBar-' + instance + ' a.VQXTP-PointBar').last().data('number', i);
            $('#vquextProgressBar-' + instance).css({
                'cursor': (mOptions.isNavigable) ? 'pointer' : 'default',
            });
        }
    },
    createInterfaceVideoQuExt: function (instance) {
        var html = '',
            path = $eXeVideoQuExt.idevicePath,
            msgs = $eXeVideoQuExt.options[instance].msgs;
        msgs.msgFirstQuestion = msgs.msgFirstQuestion || "First question";
        msgs.msgPreviousQuestion = msgs.msgPreviousQuestion || "Previous question";
        msgs.msgNextQuestion = msgs.msgNextQuestion || "Next question";
        msgs.msgLastQuestion = msgs.msgLastQuestion || "Last question";
        msgs.msgQuestionNumber = msgs.msgQuestionNumber || "Question number";
        html += '<div class="VQXTP-MainContainer"  id="vquextMainContainer-' + instance + '">\
        <div class="VQXTP-GameMinimize" id="vquextGameMinimize-' + instance + '">\
            <a href="#" class="VQXTP-LinkMaximize" id="vquextLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'vquextIcon.png" class="VQXTP-IconMinimize VQXTP-Activo" alt="' + msgs.msgMaximize + '">\
                <div class="VQXTP-MessageMaximize" id="vquextMessageMaximize-' + instance + '"></div>\
            </a>\
        </div>\
        <div class="VQXTP-GameContainer" id="vquextGameContainer-' + instance + '">\
            <div class="VQXTP-GameScoreBoard">\
                <div class="VQXTP-GameScores">\
                    <strong><span class="sr-av">' + msgs.msgNumQuestions + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Number"></div>\
                    <p id="vquextPNumber-' + instance + '">0</p>\
                    <strong><span class="sr-av">' + msgs.msgHits + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Hit"></div>\
                    <p id="vquextPHits-' + instance + '">0</p>\
                    <strong><span class="sr-av">' + msgs.msgErrors + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Error"></div>\
                    <p id="vquextPErrors-' + instance + '">0</p>\
                    <strong><span class="sr-av">' + msgs.msgScore + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Score"></div>\
                    <p id="vquextPScore-' + instance + '">0</p>\
                </div>\
                <div class="VQXTP-LifesGame" id="vquextLifesGame-' + instance + '">\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                </div>\
                <div class="VQXTP-NumberLifesGame" id="vquextNumberLivesGame-' + instance + '">\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="vquextPLifes-' + instance + '">0</p>\
                </div>\
                <div class="VQXTP-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Time"></div>\
                    <p id="vquextPTime-' + instance + '" class="VQXTP-PTime">00:00</p>\
                    <a href="#" class="VQXTP-LinkMinimize" id="vquextLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize VQXTP-Activo"></div>\
                    </a>\
                    <a href="#" class="VQXTP-LinkFullScreen" id="vquextLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen VQXTP-Activo" id="quextFullScreen-' + instance + '">\
                        </div>\
                    </a>\
                </div>\
            </div>\
            <div class="VQXTP-ShowClue" id="vquextShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="VQXTP-PShowClue VQXTP-parpadea" id="vquextPShowClue-' + instance + '"></p>\
            </div>\
            <div class="VQXTP-Multimedia" id="vquextMultimedia-' + instance + '">\
                <img src="' + path + 'quextImageVideo.png" class="VQXTP-Image" id="vquextImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <img src="' + path + 'vquextHome.png" class="VQXTP-Image" id="vquextCover-' + instance + '" alt="' + msgs.msImage + '" />\
                <video class="VQXTP-Video" id="vquextVideoLocal-' + instance + '"></video>\
                <div class="VQXTP-Video" id="vquextVideo-' + instance + '"></div>\
                <div class="VQXTP-Protector" id="vquextProtector-' + instance + '"></div>\
                <div class="VQXTP-GameOver" id="vquextGamerOver-' + instance + '">\
                    <div class="VQXTP-DataImage">\
                        <img src="' + path + 'exequextwon.png" class="VQXTP-HistGGame" id="vquextHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                        <img src="' + path + 'exequextlost.png" class="VQXTP-LostGGame" id="vquextLostGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                    </div>\
                    <div class="VQXTP-DataScore">\
                        <p id="vquextOverNumber-' + instance + '">Score: 0</p>\
                        <p id="vquextOverHits-' + instance + '">Hits: 0</p>\
                        <p id="vquextOverErrors-' + instance + '">Errors: 0</p>\
                        <p id="vquextOverScore-' + instance + '">Score: 0</p>\
                    </div>\
                </div>\
            </div>\
            <div class="VQXTP-ProgressBar" id="vquextProgressBar-' + instance + '">\
                <div class="VQXTP-InterBar" id="vquextInterBar-' + instance + '"></div>\
            </div>\
            <div class="VQXTP-AuthorLicence" id="vquextAuthorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="vquextPAuthor-' + instance + '"></p>\
            </div>\
            <div class="sr-av">' + msgs.msgPlayStart + '</div>\
            <div class="VQXTP-StartGame"><a href="#" id="vquextStartGame-' + instance + '">' + msgs.msgPlayStart + '</a></div>\
            <div class="VQXTP-QuestionDiv" id="vquextQuestionDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgQuestions + ':</div>\
                <div class="VQXTP-Question" id="vquextQuestion-' + instance + '">\
                </div>\
                <div class="VQXTP-DivReply" id="vquextDivReply-' + instance + '">\
                    <label class="sr-av">' + msgs.msgIndicateSolution + ':</label><input type="text" value="" class="VQXTP-EdReply" id="vquextEdAnswer-' + instance + '" autocomplete="off">\
                    <a href="#" id="vquextBtnReply-' + instance + '" title="' + msgs.msgReply + '">\
                        <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                        <div class="exeQuextIcons-Submit"></div>\
                    </a>\
                </div>\
                <div class="VQXTP-DivModeBoard" id="vquextDivModeBoard-' + instance + '">\
                    <a class="VQXTP-ModeBoard" href="#" id="vquextModeBoardOK-' + instance + '" title="' + msgs.msgCorrect + '">' + msgs.msgCorrect + '</a>\
                    <a class="VQXTP-ModeBoard" href="#" id="vquextModeBoardKO-' + instance + '" title="' + msgs.msgIncorrect + '">' + msgs.msgIncorrect + '</a>\
                </div>\
                <div class="VQXTP-OptionsDiv" id="vquextOptionsDiv-' + instance + '">\
                    <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                    <a href="#"  class="VQXTP-Option1 VQXTP-Options" id="vquextOption1-' + instance + '" data-number="0"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                    <a href="#"  class="VQXTP-Option2 VQXTP-Options" id="vquextOption2-' + instance + '" data-number="1"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                    <a href="#"  class="VQXTP-Option3 VQXTP-Options" id="vquextOption3-' + instance + '" data-number="2"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                    <a href="#"  class="VQXTP-Option4 VQXTP-Options" id="vquextOption4-' + instance + '" data-number="3"></a>\
                </div>\
            </div>\
            <div class="VQXTP-ReloadContainer" id="vquextVideoReloadContainer-' + instance + '">\
                <a href="#" class="VQXTP-LinkReload" id="vquextReeload-' + instance + '" title="' + msgs.msgReloadVideo + '">\
                    <strong><span class="sr-av">' + msgs.msgReloadVideo + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Reload VQXTP-Activo"></div>\
                </a>\
                <a href="#" id="vquextFirst-' + instance + '" title="' + msgs.msgFirstQuestion + '">\
                    <strong><span class="sr-av">' + msgs.msgFirstQuestion + ':</span></strong>\
                    <div class=" exeQuextIcons exeQuextIcons-First VQXTP-Activo"></div>\
                </a>\
                <a href="#" id="vquextPrevious-' + instance + '" title="' + msgs.msgPreviousQuestion + '">\
                    <strong><span class="sr-av">' + msgs.msgPreviousQuestion + ':</span></strong>\
                    <div class=" exeQuextIcons exeQuextIcons-Previous VQXTP-Activo"></div>\
                </a>\
                <span class="sr-av">' + msgs.msgQuestionNumber + '</span><span class="VQXTP-NumberQuestion" id="vquextNumberQuestion-' + instance + '">1</span>\
                <a href="#" id="vquextPauseVideo-' + instance + '" title="' + msgs.msgPauseVideo + '">\
                    <strong><span class="sr-av">' + msgs.msgPauseVideo + ':</span></strong>\
                    <div class=" exeQuextIcons exeQuextIcons-PauseVideo VQXTP-Activo"></div>\
                </a>\
                <a href="#" id="vquextNext-' + instance + '" title="' + msgs.msgNextQuestion + '">\
                    <strong><span class="sr-av">' + msgs.msgNextQuestion + ':</span></strong>\
                    <div class=" exeQuextIcons exeQuextIcons-Next VQXTP-Activo"></div>\
                </a>\
                <a href="#" id="vquextLast-' + instance + '" title="' + msgs.msgLastQuestion + '">\
                    <strong><span class="sr-av">' + msgs.msgLastQuestion + ':</span></strong>\
                    <div class=" exeQuextIcons exeQuextIcons-Last VQXTP-Activo"></div>\
                </a>\
                <a href="#" id="vquextPreview-' + instance + '" title="' + msgs.msgPreviewQuestions + '">\
                    <strong><span class="sr-av">' + msgs.msgPreviewQuestions + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Preview VQXTP-Activo"></div>\
                </a>\
            </div>\
            <div class="VQXTP-previewQuestionsDiv" id="vquextpreviewQuestionsDiv-' + instance + '">\
                <p class="VQXTP-PreviewQuestionsTitle">' + msgs.msgQuestions + '</p>\
                <strong><span class="sr-av">' + msgs.msgQuestions + ':</span></strong>\
                <input type="button" class="feedbackbutton VQXTP-previewQuestionsClose"  id="vquextpreviewQuestionsClose-' + instance + '" value="' + msgs.msgClose + '" />\
            </div>\
            <div class="VQXTP-DivFeedBack" id="vquextDivFeedBack-' + instance + '">\
                <input type="button" id="vquextFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
        </div>\
        <div class="VQXTP-Cubierta" id="vquextCubierta-' + instance + '" style="display:none">\
            <div class="VQXTP-CodeAccessDiv" id="vquextCodeAccessDiv-' + instance + '">\
                <p class="VQXTP-MessageCodeAccessE" id="vquextMesajeAccesCodeE-' + instance + '"></p>\
                <div class="VQXTP-DataCodeAccessE">\
                    <label for="vquextCodeAccessE-' + instance + '" class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="VQXTP-CodeAccessE"  id="vquextCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                    <a href="#" id="vquextCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                        <div class="exeQuextIcons-Submit VQXTP-Activo "></div>\
                    </a>\
                </div>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },
    showCubiertaOptions(mode, instance) {
        if (mode === false) {
            $('#vquextCubierta-' + instance).fadeOut();
            return;
        }
        $('#vquextCubierta-' + instance).fadeIn();
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        var butonScore = "";
        var fB = '<div class="VQXTP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="VQXTP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="vquextSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton VQXTP-SendScore" /> <span class="VQXTP-RepeatActivity" id="vquextRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="VQXTP-GetScore">';
                fB += '<p><span class="VQXTP-RepeatActivity" id="vquextRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    loadDataGame: function (data, version, videoLocal) {
        var json = data.text();
        version = typeof version == "undefined" || version == '' ? 0 : parseInt(version);
        if (version > 0) {
            json = $eXeVideoQuExt.Decrypt(json);
        }
        var mOptions = $eXeVideoQuExt.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);

        if (hasLatex) {
            $eXeVideoQuExt.hasLATEX = true;
        }
        mOptions.waitStart = false;
        mOptions.videoLocal = videoLocal;
        mOptions.questionAnswer = false;
        mOptions.percentajeQuestions = typeof mOptions.percentajeQuestions != 'undefined' ? mOptions.percentajeQuestions : 100;
        mOptions.gameMode = typeof mOptions.gameMode != 'undefined' ? mOptions.gameMode : 0;
        mOptions.authorVideo = typeof mOptions.authorVideo != 'undefined' ? mOptions.authorVideo : "";
        mOptions.percentajeFB = typeof mOptions.percentajeFB != 'undefined' ? mOptions.percentajeFB : 100;
        mOptions.isNavigable = typeof mOptions.isNavigable != 'undefined' ? mOptions.isNavigable : false;
        mOptions.repeatQuestion = typeof mOptions.repeatQuestion != 'undefined' ? mOptions.repeatQuestion : false;
        mOptions.customMessages = typeof mOptions.customMessages != 'undefined' ? mOptions.customMessages : false;
        mOptions.useLives = mOptions.gameMode != 0 ? false : mOptions.useLives;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.scoreGame = 0;
        mOptions.scoreTotal = 0;
        mOptions.questionsGame = $eXeVideoQuExt.getQuestions(mOptions.questionsGame, mOptions.percentajeQuestions);
        mOptions.numberQuestions = mOptions.questionsGame.length;
        mOptions.modeBoard = typeof mOptions.modeBoard == "undefined" ? false : mOptions.modeBoard;
        mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
        mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? '' : mOptions.evaluationID;
        mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;

        if (mOptions.videoType == 1 || mOptions.videoType == 2) {
            mOptions.idVideoQuExt = mOptions.videoLocal;
        } else if (mOptions.videoType == 3) {
            mOptions.idVideoQuExt = $eXeVideoQuExt.getIDMediaTeca(mOptions.videoLocal);
        } else {
            mOptions.idVideoQuExt = $eXeVideoQuExt.getIDYoutube(mOptions.idVideoQuExt);
        }
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            if (mOptions.customScore) {
                mOptions.scoreTotal += mOptions.questionsGame[i].customScore;
            } else {
                mOptions.questionsGame[i].customScore = 1
                mOptions.scoreTotal += mOptions.questionsGame[i].customScore
            }
        }
        return mOptions;
    },
    getIDMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;
            if (matc) {
                var id = url.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
                id = 'http://mediateca.educa.madrid.org/streaming.php?id=' + id;
                return id;
            } else {
                return '';
            }
        } else {
            return '';
        }
    },
    getQuestions: function (questions, percentaje) {
        var num = questions.length;
        var mQuestions = questions;
        if (percentaje < 100) {
            num = Math.round((percentaje * questions.length) / 100);
            num = num < 1 ? 1 : num;
            if (num < questions.length) {
                var array = [];
                for (var i = 0; i < questions.length; i++) {
                    array.push(i);
                }
                array = $eXeVideoQuExt.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
    isJsonString: function (str) {
        try {
            var o = JSON.parse(str, null, 2);
            if (o && typeof o === "object") {
                return o;
            }
        } catch (e) {}
        return false;
    },
    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },
    youTubeReady: function () {
        for (var i = 0; i < $eXeVideoQuExt.options.length; i++) {
            var mOptions = $eXeVideoQuExt.options[i];
            mOptions.player = new YT.Player('vquextVideo-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 0
                },
                events: {
                    'onReady': $eXeVideoQuExt.onPlayerReady,
                    'onError': $eXeVideoQuExt.onPlayerError,
                    'onStateChange': $eXeVideoQuExt.onPlayerStateChange
                }
            });
        }
    },
    onPlayerStateChange: function (event) {
        if (event.data == YT.PlayerState.ENDED) {
            var video = 'vquextVideo-0';
            if ((event.target.h) && (event.target.h.id)) {
                video = event.target.h.id;
            } else if ((event.target.i) && (event.target.i.id)) {
                video = event.target.i.id;
            } else if ((event.target.g) && (event.target.g.id)) {
                video = event.target.g.id;
            }
            video = video.split("-");
            if (video.length == 2 && video[0] == "vquextVideo") {
                var instance = parseInt(video[1]);
                if (!isNaN(instance)) {
                    var mOptions = $eXeVideoQuExt.options[instance]
                    mOptions.stateReproduction = -1;
                    $eXeVideoQuExt.gameOver(0, instance);
                }
            }
        }
    },
    youTubeReadyOne: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        mOptions.player = new YT.Player('vquextVideo-' + instance, {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onReady': $eXeVideoQuExt.onPlayerReady,
                'onError': $eXeVideoQuExt.onPlayerError
            }
        });

    },
    getYTAPI: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if ((typeof (mOptions.player) == "undefined")) {
            $('#vquextStartGame-' + instance).text(mOptions.msgs.msgLoading);
            mOptions.waitStart = true;
            if (typeof (YT) !== "undefined") {
                $eXeVideoQuExt.youTubeReadyOne(instance);
            } else {
                $eXeVideoQuExt.loadYoutubeApi();

            }
        } else {
            $eXeVideoQuExt.startGame(instance);
        }
    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeVideoQuExt.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        var video = 'vquextVideo-0';
        if ((event.target.h) && (event.target.h.id)) {
            video = event.target.h.id;
        } else if ((event.target.i) && (event.target.i.id)) {
            video = event.target.i.id;
        }
        video = video.split("-");
        if (video.length == 2 && video[0] == "vquextVideo") {
            var instance = parseInt(video[1]);
            if (!isNaN(instance)) {
                $eXeVideoQuExt.preloadGame(instance);
            }
        }
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideo: function (id, start, end, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            mstart = start < 1 ? 0.1 : start;
        if (mOptions.videoType > 0) {
            mOptions.localPlayer.src = $eXeVideoQuExt.extractURLGD(id);
            if (mOptions.localPlayer) {
                mOptions.localPlayer.currentTime = mstart;
                mOptions.localPlayer.play();
            }
            return;
        }
        if (mOptions.player) {
            if (typeof mOptions.player.loadVideoById == "function") {
                mOptions.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
        }
    },
    playVideo: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.videoType > 0) {
            if (mOptions.localPlayer) {
                mOptions.localPlayer.play();
            }
            return;
        }
        if (mOptions.player) {
            if (typeof mOptions.player.playVideo == "function") {
                mOptions.player.playVideo();
            }
        }
    },
    stopVideo: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.videoType > 0) {
            if (mOptions.localPlayer) {
                mOptions.localPlayer.pause();
            }
            return;
        }
        if (mOptions.player) {
            if (typeof mOptions.player.pauseVideo == "function") {
                mOptions.player.pauseVideo();
            }
        }
    },
    endVideoYoutube: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.player) {
            if (typeof mOptions.player.stopVideo == "function") {
                mOptions.player.stopVideo();
            }
        }
    },
    muteVideo: function (mute, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        mute = mOptions.videoType == 2 ? false : mute;
        if (mOptions.videoType > 0) {
            if (mOptions.localPlayer) {
                mOptions.localPlayer.muted = mute;
            }
            return;
        }
        if (mOptions.player) {
            if (mute) {
                if (typeof mOptions.player.mute == "function") {
                    mOptions.player.mute();
                }
            } else {
                if (typeof mOptions.player.unMute == "function") {
                    mOptions.player.unMute();
                }
            }
        }
    },
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    },
    addEvents: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        window.addEventListener('unload', function () {
            $eXeVideoQuExt.endScorm();
        });
        $('videovquextGamerOver-' + instance).css('display', 'flex');
        $('#vquextLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#vquextGameContainer-" + instance).show()
            $("#vquextGameMinimize-" + instance).hide();
            $eXeVideoQuExt.refreshImageActive(instance);
        });
        $("#vquextLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#vquextGameContainer-" + instance).hide();
            $("#vquextGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        $('#vquextSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeVideoQuExt.sendScore(false, instance);
            $eXeVideoQuExt.saveEvaluation(instance);

        });
        $('#vquextReeload-' + instance).click(function (e) {
            e.preventDefault();
            $eXeVideoQuExt.reloadQuestion(instance, false, false);
        });
        $('#vquextPreview-' + instance).click(function (e) {
            e.preventDefault();
            $eXeVideoQuExt.previewQuestions(instance);
        });
        $('#vquextEdAnswer-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                var answer = $(this).val();
                $eXeVideoQuExt.answerQuestion(answer, instance);
                return false;
            }
            return true;
        });
        $('#vquextBtnReply-' + instance).on("click", function (event) {
            event.preventDefault();
            var answer = $('#vquextEdAnswer-' + instance).val();
            $eXeVideoQuExt.answerQuestion(answer, instance);
        });
        $('#vquextPauseVideo-' + instance).click(function (e) {
            e.preventDefault();
            var pause = $('#vquextPauseVideo-' + instance).find('div').hasClass('exeQuextIcons-PauseVideo');
            $eXeVideoQuExt.pauseVideoQuestion(instance, pause);

        });
        $('#vquextpreviewQuestionsClose-' + instance).click(function (e) {
            e.preventDefault();
            $('#vquextpreviewQuestionsDiv-' + instance).slideUp();
        });

        $('#vquextGamerOver-' + instance).hide();
        $('#vquextCodeAccessDiv-' + instance).hide();
        $('#vquextVideo-' + instance).hide();
        $('#vquextVideoLocal-' + instance).hide();
        $('#vquextImagen-' + instance).hide();
        $('#vquextCursor-' + instance).hide();
        $('#vquextCover-' + instance).show();
        $('#vquextCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.enterCodeAccess(instance);
        });
        $('#vquextCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeVideoQuExt.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        mOptions.livesLeft = mOptions.numberLives;
        $('#vquextStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#vquextStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            if (mOptions.videoType > 0) {
                $eXeVideoQuExt.startGame(instance)
            } else {
                $eXeVideoQuExt.getYTAPI(instance);
            }
        });
        $("#vquextOptionsDiv-" + instance).on('click touchstart', '.VQXTP-Options', function (e) {
            e.preventDefault();
            var answer = $(this).data('number');
            $eXeVideoQuExt.answerQuestion(answer, instance);
        });
        $("#vquextLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('vquextGameContainer-' + instance);
            $eXeVideoQuExt.toggleFullscreen(element, instance);
        });
        $eXeVideoQuExt.updateLives(instance);
        $('#vquextInstructions-' + instance).text(mOptions.instructions);
        $('#vquextPNumber-' + instance).text(mOptions.numberQuestions);
        $('#vquextGameContainer-' + instance + ' .VQXTP-StartGame').show();
        $('#vquextQuestionDiv-' + instance).hide();
        if (mOptions.itinerary.showCodeAccess) {
            $('#vquextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#vquextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#vquextCodeAccessDiv-' + instance).show();
            $('#vquextGameContainer-' + instance + ' .VQXTP-StartGame').hide();
            $('#vquextQuestionDiv-' + instance).hide();
            $eXeVideoQuExt.showCubiertaOptions(true, instance);
        }
        $('#vquextInstruction-' + instance).text(mOptions.instructions);
        $('#vquextSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#vquextSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeVideoQuExt.updateScorm($eXeVideoQuExt.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#vquextPShowClue-' + instance).hide();
        mOptions.gameOver = false;
        window.addEventListener('resize', function () {
            $eXeVideoQuExt.refreshImageActive(instance);
        });
        if (mOptions.gameMode == 2) {
            $('#vquextGameContainer-' + instance).find('.exeQuextIcons-Hit').hide();
            $('#vquextGameContainer-' + instance).find('.exeQuextIcons-Error').hide();
            $('#vquextPErrors-' + instance).hide();
            $('#vquextPHits-' + instance).hide();
            $('#vquextGameContainer-' + instance).find('.exeQuextIcons-Score').hide();
            $('#vquextPScore-' + instance).hide();
        }
        $('#vquextFeedBackClose-' + instance).on('click', function (e) {
            $('#vquextDivFeedBack-' + instance).hide();
        });
        $('#vquextFirst-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.goQuestion(instance, 0, 0, false);
        });
        $('#vquextPrevious-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.goQuestion(instance, 1, 0, false);
        });
        $('#vquextNext-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.goQuestion(instance, 2, 0, false);
        });
        $('#vquextLast-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.goQuestion(instance, 3, 0, false);
        });
        $('#vquextProgressBar-' + instance).on('click', 'a.VQXTP-PointBar', function (e) {
            if (mOptions.isNavigable) {
                var number = $(this).data('number');
                $eXeVideoQuExt.goQuestion(instance, 4, number)
            }
        });
        $('#vquextProgressBar-' + instance).on('mouseenter', 'a.VQXTP-PointBar', function (e) {
            e.preventDefault();
            if (mOptions.isNavigable || mOptions.previewQuestions) {
                var number = $(this).data('number');
                var textoTooltip = mOptions.questionsGame[number].quextion;
                if (textoTooltip.length > 0) {
                    $(this).append('<div class="VQXTP-Tooltip">' + textoTooltip + '</div>');
                    $(this).find("div.VQXTP-Tooltip").css("left", '-121px');
                    var html = $('#vquextProgressBar-' + instance).html(),
                        latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
                    if (latex) {
                        $eXeVideoQuExt.updateLatex('vquextProgressBar-' + instance)
                    }
                    $(this).find("div.VQXTP-Tooltip").fadeIn(300);
                }
            }
        });
        $('#vquextProgressBar-' + instance).on('mouseleave', 'a.VQXTP-PointBar', function (e) {
            e.preventDefault();
            if (mOptions.isNavigable || mOptions.previewQuestions) {
                $(".VQXTP-PointBar > div.VQXTP-Tooltip").fadeOut(300).delay(300).queue(function () {
                    $(this).remove();
                    $(this).dequeue();
                });
            }
        });

        $('#vquextProgressBar-' + instance).on('click', function (e) {
            e.preventDefault();
            if (mOptions.isNavigable && !$(e.target).hasClass('VQXTP-PointBar')) {
                var mx = Math.floor(e.pageX - $(this).offset().left),
                    widthBar = $(this).width(),
                    duratioVideo = mOptions.endVideoQuExt - mOptions.startVideoQuExt,
                    active = 0,
                    ctime = Math.floor((mx * duratioVideo) / widthBar) + mOptions.startVideoQuExt;
                for (var i = mOptions.questionsGame.length - 1; i >= 0; i--) {
                    if (ctime > mOptions.questionsGame[i].pointVideo) {
                        active = i + 1;
                        break;
                    }
                }
                if (active < mOptions.questionsGame.length) {
                    $eXeVideoQuExt.goQuestion(instance, 4, active, ctime)
                } else {
                    $eXeVideoQuExt.goEnd(instance, ctime)
                }

            }
        });
        $('#vquextModeBoardOK-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.answerQuestionBoard(true, instance)

        });
        $('#vquextModeBoardKO-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.answerQuestionBoard(false, instance)

        });

        $eXeVideoQuExt.showNavigationButtons(instance, 0);
        $eXeVideoQuExt.updateEvaluationIcon(instance);
    },
    goEnd: function (instance, time) {
        var mOptions = $eXeVideoQuExt.options[instance];
        mOptions.activeQuestion = mOptions.questionsGame.length
        mOptions.stateReproduction = 4;
        if (mOptions.videoType > 0) {
            mOptions.localPlayer.currentTime = parseFloat(time);
            $('#vquextVideoLocal-' + instance).show();
        } else {
            mOptions.player.seekTo(time);
            $('#vquextVideo-' + instance).show();
        }
    },
    goQuestion: function (instance, type, number, time) {
        var mOptions = $eXeVideoQuExt.options[instance]

        switch (type) {
            case 0:
                mOptions.activeQuestion = 0;
                break;
            case 1:
                mOptions.activeQuestion = mOptions.activeQuestion > 0 ? mOptions.activeQuestion - 1 : 0;
                break;
            case 2:
                mOptions.activeQuestion = mOptions.activeQuestion < mOptions.questionsGame.length - 1 ? mOptions.activeQuestion + 1 : mOptions.questionsGame.length - 1;
                break;
            case 3:
                mOptions.activeQuestion = mOptions.questionsGame.length - 1;
                break;
            case 4:
                mOptions.activeQuestion = number;
                break;
            default:
                break;
        }
        mOptions.stateReproduction = 0;
        $eXeVideoQuExt.reloadQuestion(instance, type == 4, time);
        $eXeVideoQuExt.showNumbersQuestions(instance);
    },

    pauseVideoQuestion: function (instance, pause) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.stateReproduction > 0) return;
        var $this = $('#vquextPauseVideo-' + instance).find('div');
        if (pause) {
            $this.removeClass('exeQuextIcons-PauseVideo');
            $this.addClass('exeQuextIcons-PlayVideo');
            $eXeVideoQuExt.stopVideo(instance);
        } else {
            $this.addClass('exeQuextIcons-PauseVideo');
            $this.removeClass('exeQuextIcons-PlayVideo');
            $eXeVideoQuExt.playVideo(instance);
        }
    },
    previewQuestions: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        $('#vquextpreviewQuestionsDiv-' + instance).find('.VQXTP-prevQuestP').remove();
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            $('#vquextpreviewQuestionsDiv-' + instance).append('<p class="VQXTP-prevQuestP">' + (i + 1) + '.- ' + mOptions.questionsGame[i].quextion + '</p>');
        }
        $('#vquextpreviewQuestionsDiv-' + instance).slideToggle();
        var html = $('#vquextpreviewQuestionsDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeVideoQuExt.updateLatex('vquextpreviewQuestionsDiv-' + instance)
        }
    },
    reloadQuestion: function (instance, free, time) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.stateReproduction > 1) return;
        $eXeVideoQuExt.pauseVideoQuestion(instance, false);

        var pointVideo = mOptions.activeQuestion > 0 ? mOptions.questionsGame[mOptions.activeQuestion - 1].pointVideo : mOptions.startVideoQuExt;
        if (free) {
            pointVideo = mOptions.questionsGame[mOptions.activeQuestion].pointVideo - 1;
        }
        if (time) {
            if (mOptions.videoType > 0) {
                mOptions.localPlayer.currentTime = parseFloat(time);
            } else {
                mOptions.player.seekTo(time);
            }
        } else {
            if (mOptions.videoType > 0) {
                mOptions.localPlayer.currentTime = parseFloat(pointVideo + 1);
            } else {
                mOptions.player.seekTo(pointVideo + 1);
            }
        }
        mOptions.stateReproduction = 0;
        $eXeVideoQuExt.clearQuestions(instance);
        if (mOptions.activeQuestion < mOptions.questionsGame.length) {
            $eXeVideoQuExt.showQuestion(mOptions.activeQuestion, instance);
        } else {
            if (mOptions.videoType > 0) {
                $('#vquextVideoLocal-' + instance).show();
            } else {
                $('#vquextVideo-' + instance).show();
            }
            $('#vquextCover-' + instance).hide();
            $eXeVideoQuExt.muteVideo(false, instance);
        }
        $eXeVideoQuExt.playVideo(instance);
        mOptions.counter = $eXeVideoQuExt.getTimeSeconds(mOptions.questionsGame[mOptions.activeQuestion].time);
        $eXeVideoQuExt.uptateTime(0, instance);
    },
    refreshImageActive: function (instance) {
        $('#vquextProgressBar-' + instance).width($('#vquextVideo-' + instance).width());
        $eXeVideoQuExt.createPointsVideo(instance);
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() === $('#vquextCodeAccessE-' + instance).val().toLowerCase()) {
            $('#vquextCodeAccessDiv-' + instance).hide();
            $eXeVideoQuExt.showCubiertaOptions(false, instance);
            if (mOptions.videoType > 0) {
                $eXeVideoQuExt.startGame(instance)
            } else {
                $eXeVideoQuExt.getYTAPI(instance);
            }
        } else {
            $('#vquextMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#vquextCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            msgs = mOptions.msgs,
            $quextHistGame = $('#vquextHistGame-' + instance),
            $quextLostGame = $('#vquextLostGame-' + instance),
            $quextOverPoint = $('#vquextOverScore-' + instance),
            $quextOverHits = $('#vquextOverHits-' + instance),
            $quextOverErrors = $('#vquextOverErrors-' + instance),
            $quextPShowClue = $('#vuextPShowClue-' + instance),
            $quextGamerOver = $('#vquextGamerOver-' + instance),
            $quextOverNumber = $('#vquextOverNumber-' + instance),
            message = "",
            messageColor = 2;
        $quextHistGame.hide();
        $quextLostGame.hide();
        $quextOverPoint.show();
        $quextOverHits.show();
        $quextOverErrors.show();
        $quextPShowClue.hide();
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.msgAllQuestions;
                $quextHistGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        message = msgs.msgAllQuestions;
                        $quextPShowClue.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $quextPShowClue.show();
                    } else {
                        $quextPShowClue.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $quextPShowClue.show();
                    }
                }
                break;
            case 1:
                message = msgs.msgLostLives;
                messageColor = 1;
                $quextLostGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        $quextPShowClue.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $quextPShowClue.show();
                    } else {
                        $quextPShowClue.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $quextPShowClue.show();
                    }
                }
                break;
            case 2:
                message = msgs.msgInformationLooking
                $quextOverPoint.hide();
                $quextOverHits.hide();
                $quextOverErrors.hide();
                $quextPShowClue.text(mOptions.itinerary.clueGame);
                $quextPShowClue.show();
                break;
            default:
                break;
        }
        $eXeVideoQuExt.showMessage(messageColor, message, instance);
        var msscore = mOptions.gameMode == 0 ? msgs.msgScore + ': ' + mOptions.score : msgs.msgScore + ': ' + mOptions.score.toFixed(2);
        $quextOverPoint.text(msscore);
        $quextOverHits.text(msgs.msgHits + ': ' + mOptions.hits);
        $quextOverErrors.text(msgs.msgErrors + ': ' + mOptions.errors);
        $quextOverNumber.text(msgs.msgNumQuestions + ': ' + mOptions.questionsGame.length);

        if (mOptions.gameMode == 2) {
            $('#vquextGameContainer-' + instance).find('.VQXTP-DataGameScore').hide();
        }
        $quextGamerOver.show();
    },
    showNavigationButtons(instance, time) {
        var mOptions = $eXeVideoQuExt.options[instance];
        $('#vquextFirst-' + instance).hide();
        $('#vquextPrevious-' + instance).hide();
        $('#vquextPauseVideo-' + instance).hide();
        $('#vquextNumberQuestion-' + instance).hide();
        $('#vquextNext-' + instance).hide();
        $('#vquextLast-' + instance).hide();
        $('#vquextPreview-' + instance).hide();
        $('#vquextReeload-' + instance).hide();
        $('#vquextVideoReloadContainer-' + instance).hide();
        if (mOptions.reloadQuestion || mOptions.previewQuestions || mOptions.pauseVideo || mOptions.isNavigable) {
            $('#vquextVideoReloadContainer-' + instance).show();
        }
        if (time == 0) {
            if (mOptions.previewQuestions) {
                $('#vquextPreview-' + instance).show();
            }

        } else if (time == 1) {
            if (mOptions.previewQuestions) {
                $('#vquextPreview-' + instance).show();
            }
            if (mOptions.reloadQuestion && !mOptions.isNavigable) {
                $('#vquextReeload-' + instance).show();
            }
            if (mOptions.pauseVideo) {
                $('#vquextPauseVideo-' + instance).show();
            }
            if (mOptions.isNavigable) {
                $('#vquextFirst-' + instance).show();
                $('#vquextPrevious-' + instance).show();
                $('#vquextPauseVideo-' + instance).show();
                $('#vquextNumberQuestion-' + instance).show();
                $('#vquextNext-' + instance).show();
                $('#vquextLast-' + instance).show();
            }

        }
    },
    startGame: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.obtainedClue = false;
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            mOptions.questionsGame[i].answerScore = -1;
        }
        $('#vquextProgressBar-' + instance).width($('#vquextVideo-' + instance).width());
        $eXeVideoQuExt.createPointsVideo(instance);
        $('#vquextPShowClue-' + instance).hide();
        $('#vquextPShowClue-' + instance).text("");
        $('#vquextGameContainer-' + instance + ' .VQXTP-StartGame').hide();
        $('#vquextQuestionDiv-' + instance).show();
        $('#vquextQuestion-' + instance).text('');
        $('#vquextProgressBar-' + instance).show();
        $eXeVideoQuExt.showNavigationButtons(instance, 1);
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = false;
        mOptions.validQuestions = mOptions.numberQuestions;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        mOptions.livesLeft = mOptions.numberLives;
        $eXeVideoQuExt.updateLives(instance);
        mOptions.stateReproduction = 0;
        mOptions.activeQuestion = 0;
        $eXeVideoQuExt.showQuestion(mOptions.activeQuestion, instance);
        $eXeVideoQuExt.startVideo(mOptions.idVideoQuExt, mOptions.startVideoQuExt, mOptions.endVideoQuExt, instance);
        //
        //$eXeVideoQuExt.showNumbersQuestions(instance);
        $('#vquextPNumber-' + instance).text(mOptions.numberQuestions);
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            mOptions.questionsGame[i].answerScore = -1;
        }
        mOptions.counterClock = setInterval(function () {
            switch (mOptions.stateReproduction) {
                case 0:
                    mOptions.gameActived = false;
                    var timeVideo = 0;
                    if (mOptions.videoType > 0) {
                        if (mOptions.localPlayer) {
                            timeVideo = mOptions.localPlayer.currentTime;
                        };
                    } else {
                        if (mOptions.player && typeof mOptions.player.getCurrentTime == "function") {
                            timeVideo = mOptions.player.getCurrentTime();
                        };
                    }
                    var pointVideo = timeVideo + 2;
                    $eXeVideoQuExt.updataProgressBar(timeVideo, instance);
                    if (mOptions.activeQuestion < mOptions.questionsGame.length) {
                        pointVideo = mOptions.questionsGame[mOptions.activeQuestion].pointVideo;
                    }
                    if (timeVideo >= mOptions.endVideoQuExt) {
                        mOptions.stateReproduction = -1;
                        $eXeVideoQuExt.gameOver(0, instance);
                        return;
                    }
                    if (timeVideo >= pointVideo) {
                        var sSolution = false;
                        if (mOptions.isNavigable) {
                            if (!mOptions.repeatQuestion && mOptions.questionsGame[mOptions.activeQuestion].answerScore != -1) {
                                sSolution = true;
                            }
                        }
                        if (sSolution) {
                            mOptions.gameActived = false;
                            $eXeVideoQuExt.drawQuestions(instance);
                            $eXeVideoQuExt.stopVideo(instance);
                            mOptions.counter = 0
                            mOptions.stateReproduction = 1;
                            mOptions.gameActived = false;
                        } else {
                            $eXeVideoQuExt.drawQuestions(instance);
                            mOptions.counter = $eXeVideoQuExt.getTimeSeconds(mOptions.questionsGame[mOptions.activeQuestion].time);
                            mOptions.stateReproduction = 1;
                            $eXeVideoQuExt.stopVideo(instance);
                            $eXeVideoQuExt.updataProgressBar(mOptions.questionsGame[mOptions.activeQuestion].pointVideo, instance);
                            mOptions.gameActived = true;
                        }
                    }
                    break;
                case 1:
                    mOptions.gameActived = true;
                    mOptions.counter--;
                    $eXeVideoQuExt.uptateTime(mOptions.counter, instance);
                    if (mOptions.counter <= 0) {
                        mOptions.gameActived = false;
                        if (mOptions.showSolution) {
                            mOptions.counter = mOptions.timeShowSolution;
                            $eXeVideoQuExt.drawSolution(instance);
                            mOptions.stateReproduction = 2;
                        } else {
                            mOptions.stateReproduction = 3;
                        }
                    }
                    break;
                case 2:
                    mOptions.counter--;
                    if (mOptions.counter <= 0) {
                        mOptions.stateReproduction = 3;
                    }
                    break;
                case 3:
                    $eXeVideoQuExt.clearQuestions(instance);
                    mOptions.activeQuestion++;
                    if (mOptions.activeQuestion < mOptions.questionsGame.length) {
                        $eXeVideoQuExt.showQuestion(mOptions.activeQuestion, instance);
                    } else {
                        if (mOptions.videoType > 0) {
                            $('#vquextVideoLocal-' + instance).show();
                        } else {
                            $('#vquextVideo-' + instance).show();
                        }
                        $('#vquextCover-' + instance).hide();
                        $eXeVideoQuExt.muteVideo(false, instance);
                        var mesaut = mOptions.authorVideo.length > 0 ? mOptions.msgs.msgAuthor + ': ' + mOptions.authorVideo : '';
                        $eXeVideoQuExt.showMessage(0, mesaut, instance);

                    }
                    mOptions.stateReproduction = 0;
                    $eXeVideoQuExt.playVideo(instance);
                    break;
                case 4:
                    $eXeVideoQuExt.clearQuestions(instance);
                    if (mOptions.activeQuestion < mOptions.questionsGame.length) {
                        $eXeVideoQuExt.showQuestion(mOptions.activeQuestion, instance);
                    } else {
                        if (mOptions.videoType > 0) {
                            $('#vquextVideoLocal-' + instance).show();
                        } else {
                            $('#vquextVideo-' + instance).show();
                        }
                        $('#vquextCover-' + instance).hide();
                        $eXeVideoQuExt.muteVideo(false, instance);
                        var mesaut = mOptions.authorVideo.length > 0 ? mOptions.msgs.msgAuthor + ': ' + mOptions.authorVideo : '';
                        $eXeVideoQuExt.showMessage(0, mesaut, instance);

                    }
                    mOptions.stateReproduction = 0;
                    $eXeVideoQuExt.playVideo(instance);
                    break;
                default:
                    break;
            }
        }, 1000);
        $eXeVideoQuExt.uptateTime(0, instance);
        $('#vquextGamerOver-' + instance).hide();
        $('#vquextPHits-' + instance).text(mOptions.hits);
        $('#vquextPErrors-' + instance).text(mOptions.errors);
        $('#vquextPScore-' + instance).text(mOptions.score);
        /*if (mOptions.isNavigable) {
            $('#vquextNavigationButtons-' + instance).css('display', 'flex');
            $('#vquextNavigationButtons-' + instance).show();
        }*/
        mOptions.gameStarted = true;
    },
    updataProgressBar: function (ntime, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            widthBar = $('#vquextProgressBar-' + instance).width(),
            duratioVideo = mOptions.endVideoQuExt - mOptions.startVideoQuExt,
            timeRelative = ntime - mOptions.startVideoQuExt,
            widthIntBar = (timeRelative * widthBar) / duratioVideo;
        $('#vquextInterBar-' + instance).css("width", widthIntBar + "px");

    },
    uptateTime: function (tiempo, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        var mTime = $eXeVideoQuExt.getTimeToString(tiempo);
        $('#vquextPTime-' + instance).text(mTime);
        if (mOptions.gameActived) {}
    },
    getTimeToString: function (iTime) {
        iTime = iTime < 0 ? 0 : iTime;
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;

        clearInterval(mOptions.counterClock);
        $('#vquextDivModeBoard-' + instance).hide();
        $('#vquextVideo-' + instance).hide();
        $('#vquextVideoLocal-' + instance).hide();
        $('#vquextProgressBar-' + instance).hide();
        $('#vquextCursor-' + instance).hide();
        $('#vquextCover-' + instance).hide();
        $('#vquextImagen-' + instance).hide();
        var message = type === 0 ? mOptions.msgs.msgAllQuestions : mOptions.msgs.msgLostLives;
        $eXeVideoQuExt.showMessage(0, message, instance);
        $eXeVideoQuExt.showScoreGame(type, instance);
        $eXeVideoQuExt.clearQuestions(instance);
        $eXeVideoQuExt.uptateTime(0, instance);
        $eXeVideoQuExt.stopVideo(instance);
        if (mOptions.videoType == 0) {
            $eXeVideoQuExt.endVideoYoutube(instance);
        }
        $eXeVideoQuExt.showNumbersQuestions(instance);
        $('#vquextStartGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#vquextGameContainer-' + instance + ' .VQXTP-StartGame').show();
        $('#vquextQuestionDiv-' + instance).hide();
        $eXeVideoQuExt.showNavigationButtons(instance, 0);
        mOptions.gameOver = true;
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeVideoQuExt.initialScore = score;
            }
        }
        $eXeVideoQuExt.saveEvaluation(instance);
        $eXeVideoQuExt.showFeedBack(instance);
    },
    showFeedBack: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.questionsGame.length;
        if (mOptions.gameMode == 2 || mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#vquextDivFeedBack-' + instance).find('.vquext-feedback-game').show();
                $('#vquextDivFeedBack-' + instance).show();
            } else {
                $eXeVideoQuExt.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance);
            }
        }
        if (mOptions.gameMode == 2) {
            $('#vquextGamerOver-' + instance).find('.VQXTP-DataScore').hide();
        }
    },
    showNumbersQuestions: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        $('#vquextNumberQuestion-' + instance).text(mOptions.activeQuestion + 1);
        $('#vquextPNumber-' + instance).text(mOptions.numberQuestions - mOptions.activeQuestion);
        if (mOptions.isNavigable) {
            var numleft = 0;
            for (var i = 0; i < mOptions.questionsGame.length; i++) {
                if (mOptions.questionsGame[i].answerScore != -1) {
                    numleft++;
                }
            }
            $('#vquextPNumber-' + instance).text(mOptions.numberQuestions - numleft);
        }

    },
    drawText: function (texto, color) {},
    showQuestion: function (i, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            mQuextion = mOptions.questionsGame[i];
        mOptions.questionAnswer = false;
        $eXeVideoQuExt.showNumbersQuestions(instance);
        mOptions.question = mQuextion;
        if (mOptions.answersRamdon) {
            $eXeVideoQuExt.ramdonOptions(instance);
        }
        $('#vquextImagen-' + instance).hide();
        if (mQuextion.imageVideo == 0) {
            $('#vquextVideo-' + instance).hide();
            $('#vquextCover-' + instance).show();
            $('#vquextVideoLocal-' + instance).hide();
        } else {
            if (mOptions.videoType == 1 || mOptions.videoType == 3) {
                $('#vquextVideoLocal-' + instance).show();
                $('#vquextCover-' + instance).hide();
            } else if (mOptions.videoType == 2) {
                $('#vquextVideoLocal-' + instance).hide();
                $('#vquextCover-' + instance).hide();
                $('#vquextImagen-' + instance).show();
            } else {
                $('#vquextVideo-' + instance).show();
                $('#vquextCover-' + instance).hide();
            }
        }
        var mesaut = mOptions.authorVideo.length > 0 ? mOptions.msgs.msgAuthor + ': ' + mOptions.authorVideo : '';
        $eXeVideoQuExt.showMessage(0, mesaut, instance);
        if (mQuextion.soundVideo === 0) {
            $eXeVideoQuExt.muteVideo(true, instance);
        } else {
            $eXeVideoQuExt.muteVideo(false, instance);
        }
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                if (mOptions.isNavigable) {
                    score = 0;
                    for (var i = 0; i < mOptions.questionsGame.length; i++) {
                        score = mOptions.questionsGame[i].answerScore > 0 ? score + 1 : score;
                    }
                    score = ((score * 10) / mOptions.numberQuestions).toFixed(2);
                }
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
        $eXeVideoQuExt.saveEvaluation(instance);
    },
    getIDYoutube: function (url) {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
            match = url.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return "";
        }
    },
    updateLives: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        $('#vquextPLifes-' + instance).text(mOptions.livesLeft);
        $('#vquextLifesGame-' + instance).find('.exeQuextIcons-Life').each(function (index) {
            $(this).hide();
            if (mOptions.useLives) {
                $(this).show();
                if (index >= mOptions.livesLeft) {
                    $(this).hide();
                }
            }
        });
        if (!mOptions.useLives) {
            $('#vquextNumberLivesGame-' + instance).hide();
        }
    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600]
        return times[iT];
    },
    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeVideoQuExt.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    answerQuestion: function (answer, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        if (mOptions.question.typeQuestion == 1 && $.trim(answer).length == 0) {
            $eXeVideoQuExt.showMessage(1, mOptions.msgs.msgIndicateSolution, instance);
            return;
        }
        mOptions.gameActived = false;
        var valid = false;
        if (mOptions.question.typeQuestion == 1) {
            valid = $eXeVideoQuExt.checkWord(mOptions.question.solutionQuestion, answer);
        } else {
            valid = answer === mOptions.question.solution;
        }
        mOptions.questionAnswer = true;
        mOptions.questionsGame[mOptions.activeQuestion].answerScore = valid ? 1 : 0;
        if (mOptions.showSolution) {
            $eXeVideoQuExt.drawSolution(instance);
        }
        $eXeVideoQuExt.updateScore(valid, instance);
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100,
            color = valid ? $eXeVideoQuExt.borderColors.green : $eXeVideoQuExt.borderColors.red;
        $('#vquextPHits-' + instance).text(mOptions.hits);
        $('#vquextPErrors-' + instance).text(mOptions.errors);

        $('#vquextProgressBar-' + instance + ' .VQXTP-PointBar').eq(mOptions.activeQuestion).css({
            'background-color': color
        });
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                $('#vquextPShowClue-' + instance).show();
                $('#vquextPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
            }
        }
        mOptions.counter = 1;
        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeVideoQuExt.gameOver(1, instance);
            return;
        }
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
        $eXeVideoQuExt.saveEvaluation(instance);

    },
    answerQuestionBoard: function (value, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        var valid = value;
        mOptions.questionAnswer = true;
        mOptions.questionsGame[mOptions.activeQuestion].answerScore = valid ? 1 : 0;
        if (mOptions.showSolution) {
            $eXeVideoQuExt.drawSolution(instance);
        }
        $eXeVideoQuExt.updateScore(valid, instance);
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100,
            color = valid ? $eXeVideoQuExt.borderColors.green : $eXeVideoQuExt.borderColors.red;
        $('#vquextPHits-' + instance).text(mOptions.hits);
        $('#vquextPErrors-' + instance).text(mOptions.errors);
        $('#vquextProgressBar-' + instance + ' .VQXTP-PointBar').eq(mOptions.activeQuestion).css({
            'background-color': color
        });
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                $('#vquextPShowClue-' + instance).show();
                $('#vquextPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
            }
        }
        mOptions.counter = 1;
        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeVideoQuExt.gameOver(1, instance);
            return;
        }
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
        $eXeVideoQuExt.saveEvaluation(instance);
    },
    preloadGame: function (instance) {
        var x = instance,
            mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.waitStart) {
            mOptions.waitStart = false;
            $eXeVideoQuExt.startGame(x);
        }
    },
    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            quextion = mOptions.questionsGame[mOptions.activeQuestion],
            message = "",
            obtainedPoints = 0,
            type = 1,
            sscore = 0,
            points = 0;
        if (correctAnswer) {
            mOptions.hits++
            if (mOptions.gameMode == 0) {
                var pointsTemp = mOptions.counter < 60 ? mOptions.counter * 10 : 600;
                obtainedPoints = 1000 + pointsTemp;
                obtainedPoints = quextion.customScore * obtainedPoints;
                points = obtainedPoints;
            } else if (mOptions.gameMode == 1) {
                obtainedPoints = ((10 * quextion.customScore) / mOptions.scoreTotal);
                if (mOptions.order == 2) {
                    obtainedPoints = ((quextion.customScore) / 10);
                }
                points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
            } else if (mOptions.gameMode == 2) {
                obtainedPoints = ((10 * quextion.customScore) / mOptions.scoreTotal);
                if (mOptions.order == 2) {
                    obtainedPoints = ((quextion.customScore) / 10);
                }
                points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
            }
            type = 2;
            mOptions.scoreGame += quextion.customScore;
        } else {
            mOptions.errors++;
            if (mOptions.gameMode != 0) {
                message = "";
            } else {
                obtainedPoints = -330 * quextion.customScore;
                points = obtainedPoints;
                if (mOptions.useLives) {
                    mOptions.livesLeft--;
                    $eXeVideoQuExt.updateLives(instance);
                }
            }
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        sscore = mOptions.score;
        if (mOptions.gameMode != 0) {
            sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        }
        $('#vquextPScore-' + instance).text(sscore);
        $('#vquextPHits-' + instance).text(mOptions.hits);
        $('#vquextPErrors-' + instance).text(mOptions.errors);
        message = $eXeVideoQuExt.getMessageAnswer(correctAnswer, points, instance);
        $eXeVideoQuExt.showMessage(type, message, instance);
    },
    getMessageAnswer: function (correctAnswer, npts, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        var message = "",
            q = mOptions.questionsGame[mOptions.activeQuestion];
        if (correctAnswer) {
            message = $eXeVideoQuExt.getMessageCorrectAnswer(npts, instance);
        } else {
            message = $eXeVideoQuExt.getMessageErrorAnswer(npts, instance);
        }
        if (mOptions.showSolution && q.typeQuestion == 1) {
            message += ': ' + q.solutionQuestion;
        }
        return message;
    },
    getMessageCorrectAnswer: function (npts, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            messageCorrect = $eXeVideoQuExt.getRetroFeedMessages(true, instance),
            message = "",
            pts = typeof mOptions.msgs.msgPoints == 'undefined' ? 'puntos' : mOptions.msgs.msgPoints;
        if (mOptions.customMessages && mOptions.questionsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.questionsGame[mOptions.activeQuestion].msgHit
            message = mOptions.gameMode < 2 ? message + '. ' + npts + ' ' + pts : message;
        } else {
            message = mOptions.gameMode == 2 ? messageCorrect : messageCorrect + ' ' + npts + ' ' + pts;
        }
        return message;
    },
    getMessageErrorAnswer: function (npts, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            messageError = $eXeVideoQuExt.getRetroFeedMessages(false, instance),
            message = "",
            pts = typeof mOptions.msgs.msgPoints == 'undefined' ? 'puntos' : mOptions.msgs.msgPoints;
        if (mOptions.customMessages && mOptions.questionsGame[mOptions.activeQuestion].msgError.length > 0) {
            message = mOptions.questionsGame[mOptions.activeQuestion].msgError;
            if (mOptions.gameMode != 2) {
                message = mOptions.useLives ? message + '. ' + mOptions.msgs.msgLoseLive : message + '. ' + npts + ' ' + pts;
            }
        } else {
            message = mOptions.useLives ? messageError + ' ' + mOptions.msgs.msgLoseLive : messageError + ' ' + npts + ' ' + pts;
            message = mOptions.gameMode > 0 ? messageError : message;

        }
        return message;
    },
    checkWord: function (word, answord) {
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
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeVideoQuExt.borderColors.red, $eXeVideoQuExt.borderColors.green, $eXeVideoQuExt.borderColors.blue, $eXeVideoQuExt.borderColors.yellow];
        var color = colors[type];
        $('#vquextPAuthor-' + instance).html(message);
        $('#vquextPAuthor-' + instance).css({
            'color': color
        });
    },
   
    ramdonOptions: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            arrayRamdon = mOptions.question.options.slice(0, mOptions.question.numberOptions),
            sSolution = mOptions.question.options[mOptions.question.solution];
        arrayRamdon = $eXeVideoQuExt.shuffleAds(arrayRamdon);
        mOptions.question.options = [];
        for (var i = 0; i < 4; i++) {
            if (i < arrayRamdon.length) {
                mOptions.question.options.push(arrayRamdon[i])
            } else {
                mOptions.question.options.push('');
            }
            if (mOptions.question.options[i] == sSolution) {
                mOptions.question.solution = i;
            }
        }
    },
    drawQuestions: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            mQuextion = mOptions.questionsGame[mOptions.activeQuestion],
            ntime = $eXeVideoQuExt.getTimeToString($eXeVideoQuExt.getTimeSeconds(mQuextion.time))
        $('#vquextQuestion-' + instance).text(mQuextion.quextion).show();
        $('#vquextPTime-' + instance).text(ntime);
        $('#vquextDivModeBoard-' + instance).hide();
        if (mQuextion.typeQuestion == 1) {
            $('#vquextDivReply-' + instance).show();
            $('#vquextOptionsDiv-' + instance).hide();
            $('#vquextSolutionWord').focus();
            if (mOptions.modeBoard) {
                $('#vquextDivModeBoard-' + instance).css('display', 'flex');
                $('#vquextDivModeBoard-' + instance).fadeIn();
            }
        } else {
            $('#vquextOptionsDiv-' + instance + '>.VQXTP-Options').each(function (index) {
                var option = mQuextion.options[index]
                $(this).css({
                    'border-color': $eXeVideoQuExt.borderColors.grey,
                    'background-color': 'transparent',
                    'cursor': 'pointer',
                    "text-aling": "center"
                }).text(option);
                if (option) {
                    $(this).show();
                } else {
                    $(this).hide()
                }
            });
            $('#vquextOptionsDiv-' + instance).show();
            $('#vquextDivReply-' + instance).hide();
        }
        var html = $('#vquextQuestionDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeVideoQuExt.updateLatex('vquextQuestionDiv-' + instance)
        }
    },
    drawSolution: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            message = '';
        if ((mOptions.question.typeQuestion == 1) && (mOptions.questionAnswer === false)) {
            message = mOptions.msgs.msgSolution + ': ' + mOptions.question.solutionQuestion;
            $eXeVideoQuExt.showMessage(1, message, instance);
            $('#vquextDivReply-' + instance).hide();
            $('#vquextDivModeBoard-' + instance).hide();

        } else {
            $('#vquextOptionsDiv-' + instance + '>.VQXTP-Options').each(function (index) {
                if (index === mOptions.question.solution) {
                    $(this).css({
                        'border-color': $eXeVideoQuExt.borderColors.correct,
                        'background-color': $eXeVideoQuExt.colors.correct,
                        'cursor': 'default',
                        "text-aling": "center"
                    });
                } else {
                    $(this).css({
                        'border-color': $eXeVideoQuExt.borderColors.incorrect,
                        'background-color': 'transparent',
                        'cursor': 'default',
                        "text-aling": "center"
                    });
                }
            });
        }
        var html = $('#vquextQuestionDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeVideoQuExt.updateLatex('vquextQuestionDiv-' + instance)
        }

    },
    clearQuestions: function (instance) {
        $('#vquextOptionsDiv-' + instance + '>.VQXTP-Options').each(function (index) {
            $(this).css({
                'border-color': $eXeVideoQuExt.borderColors.grey,
                'background-color': 'transparent',
                'cursor': 'default',
                'text-aling': 'center'
            }).text('');
        });
        $('#vquextQuestion-' + instance).text("");
        $('#vquextPTime--' + instance).text("00:00");
        $('#vquextOptionsDiv-' + instance).hide();
        $('#vquextDivReply-' + instance).hide();
        $('#vquextDivModeBoard-' + instance).hide();
        $('#vquextEdAnswer-' + instance).val("");
    },
    exitFullscreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
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
        var element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $eXeVideoQuExt.getFullscreen(element);
        } else {
            $eXeVideoQuExt.exitFullscreen(element);
        }
    },
    supportedBrowser: function (idevice) {
        var sp = !(window.navigator.appName == 'Microsoft Internet Explorer' || window.navigator.userAgent.indexOf('MSIE ') > 0);
        if (!sp) {
            var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
            $('.' + idevice + '-instructions').text(bns);
        }
        return sp;
    }
}

$(function () {
    $eXeVideoQuExt.init();
});