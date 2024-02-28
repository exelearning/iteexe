/**
 * QuExt Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeIdentifica = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#45085f',
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
    options: {},
    userName: '',
    scorm: '',
    previousScore: '',
    initialScore: '',
    msgs: '',
    hasSCORMbutton: false,
    isInExe: false,
    hasLATEX: false,
    init: function () {
        this.activities = $('.identifica-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeIdentifica.supportedBrowser('identifica')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Identify') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/identifica-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeIdentifica.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeIdentifica.enable()');
        else this.enable();
        $eXeIdentifica.mScorm = scorm;
        var callSucceeded = $eXeIdentifica.mScorm.init();
        if (callSucceeded) {
            $eXeIdentifica.userName = $eXeIdentifica.getUserName();
            $eXeIdentifica.previousScore = $eXeIdentifica.getPreviousScore();
            $eXeIdentifica.mScorm.set("cmi.core.score.max", 10);
            $eXeIdentifica.mScorm.set("cmi.core.score.min", 0);
            $eXeIdentifica.initialScore = $eXeIdentifica.previousScore;
        }
    },
    enable: function () {
        $eXeIdentifica.loadGame();
    },
    getUserName: function () {
        var user = $eXeIdentifica.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeIdentifica.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        if ($eXeIdentifica.mScorm && typeof $eXeIdentifica.mScorm.quit == "function") {
            $eXeIdentifica.mScorm.quit();
        }

    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeIdentifica.options[instance],
            text = '';
        $('#idfSendScore-' + instance).hide();
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
            $('#idfSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#idfSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#idfRepeatActivity-' + instance).text(text);
        $('#idfRepeatActivity-' + instance).fadeIn(1000);
    },
    saveEvaluation: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#idfGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text(),
                score = mOptions.score.toFixed(2)
            var formattedDate = $eXeIdentifica.getDateString();
            var scorm = {
                'id': mOptions.id,
                'type': mOptions.msgs.msgTypeGame,
                'node': node,
                'name': name,
                'score': score,
                'date': formattedDate,
                'state': (parseFloat(score) >= 5 ? 2 : 1)

            }
            var data = $eXeIdentifica.getDataStorage(mOptions.evaluationID);
            data = $eXeIdentifica.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeIdentifica.showEvaluationIcon(instance, scorm.state, scorm.score)
        }
    },
    updateEvaluationIcon: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data = $eXeIdentifica.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                $eXeIdentifica.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
            $eXeIdentifica.showEvaluationIcon(instance, state, score);
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#idfMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');

        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions = $eXeIdentifica.options[instance];
        var $header = $('#idfGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
        }
        $('#idfEvaluationIcon-' + instance).remove();
        var sicon = '<div id="idfEvaluationIcon-' + instance + '" class="IDFP-EvaluationDivIcon"><img  src="' + $eXeIdentifica.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#idfEvaluationIcon-' + instance).find('span').eq(0).text(alt)
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

    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data = $eXeIdentifica.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeIdentifica.options[instance],
            message = '',
            score = mOptions.score.toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeIdentifica.mScorm != 'undefined') {
                if (!auto) {
                    $('#idfSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeIdentifica.previousScore !== '') {
                        message = $eXeIdentifica.userName !== '' ? $eXeIdentifica.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeIdentifica.previousScore = score;
                        $eXeIdentifica.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeIdentifica.userName !== '' ? $eXeIdentifica.userName + '. ' + mOptions.msgs.msgYouScore + ': ' + score : mOptions.msgs.msgYouScore + ': ' + score
                        if (!mOptions.repeatActivity) {
                            $('#idfSendScore-' + instance).hide();
                        }
                        $('#idfRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score)
                        $('#idfRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeIdentifica.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeIdentifica.mScorm.set("cmi.core.score.raw", score);
                    $('#idfRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score)
                    $('#idfRepeatActivity-' + instance).show();
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
        $eXeIdentifica.options = [];
        $eXeIdentifica.activities.each(function (i) {
            var dl = $(".identifica-DataGame", this),
                imagesLink = $('.identifica-LinkImages', this),
                audioLink = $('.identifica-LinkAudios', this),
                mOption = $eXeIdentifica.loadDataGame(dl, imagesLink, audioLink),
                msg = mOption.msgs.msgPlayStart;
            $eXeIdentifica.options.push(mOption);
            var idf = $eXeIdentifica.createInterface(i);
            dl.before(idf).remove();
            $('#idfGameMinimize-' + i).hide();
            $('#idfGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#idfGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#idfGameContainer-' + i).show();
            }
            $('#idfMessageMaximize-' + i).text(msg);
            $('#idfDivFeedBack-' + i).prepend($('.identifica-feedback-game', this));
            $eXeIdentifica.addEvents(i);
            $('#idfDivFeedBack-' + i).hide();
            $eXeIdentifica.startGame(i)
        });
        if ($eXeIdentifica.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeIdentifica.loadMathJax();
        }

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
                    console.log('Error al refrescar mathjax')
                }
            }
        }, 100);
    },
    createInterface: function (instance) {
        var html = '',
            path = $eXeIdentifica.idevicePath,
            msgs = $eXeIdentifica.options[instance].msgs;
        html += '<div class="IDFP-MainContainer"  id="idfMainContainer-' + instance + '">\
        <div class="IDFP-GameMinimize" id="idfGameMinimize-' + instance + '">\
            <a href="#" class="IDFP-LinkMaximize" id="idfLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'identificaIcon.png" class="IDFP-IconMinimize IDFP-Activo" alt="">\
                <div class="IDFP-MessageMaximize" id="idfMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="IDFP-GameContainer" id="idfGameContainer-' + instance + '">\
            <div class="IDFP-GameScoreBoard">\
                <div class="IDFP-GameScores">\
                    <div class="IDFPIcons  IDFPIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="idfPNumber-' + instance + '">0</span></p>\
                    <div class="IDFPIcons IDFPIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="idfPHits-' + instance + '">0</span></p>\
                    <div class="IDFPIcons  IDFPIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="idfPErrors-' + instance + '">0</span></p>\
                    <div class="IDFPIcons  IDFPIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="idfPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="IDFP-LifesGame" id="idfLifesGame-' + instance + '">\
                </div>\
                <div class="IDFP-TimeNumber">\
                    <div class="IDFPIcons IDFPIcons-Life" title="' + msgs.msgAttempts + '"></div>\
                    <p><span class="sr-av">' + msgs.msgAttempts + ': </span><span id="idfAttempts-' + instance + '">1</span></p>\
                    <div class="IDFPIcons IDFPIcons-PointsClue" title="' + msgs.msgScoreQuestion + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScoreQuestion + ': </span><span id="idfPoints-' + instance + '">1.00</span></p>\
                        <a href="#" class="IDFP-LinkMinimize" id="idfLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="IDFPIcons IDFPIcons-Minimize IDFP-Activo"></div>\
                    </a>\
                    <a href="#" class="IDFP-LinkFullScreen" id="idfLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                        <div class="IDFPIcons IDFPIcons-FullScreen IDFP-Activo" id="idfFullScreen-' + instance + '"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="IDFP-ShowClue" id="idfShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + '</div>\
                <p class="IDFP-PShowClue IDFP-parpadea" id="idfPShowClue-' + instance + '"></p>\
           </div>\
            <div id="idfMessageClue-' + instance + '" class="IDFP-MessageClue"></div>\
             <div class="IDFP-Multimedia" id="idfMultimedia-' + instance + '">\
                <div class="IDFP-Left">\
                    ' + $eXeIdentifica.getClues(0, instance) + '\
                </div>\
                <div class="IDFP-Media" >\
                    <div id="idfCardDraw-' + instance + '" class="IDFP-CardDraw">\
                        <div class="IDFP-card">\
                            <div class="IDFP-card-inner" id="idfcardinner-' + instance + '">\
                                <div class="IDFP-card-front">\
                                    <div class="IDFP-ImageContain" >\
                                        <img src="' + path + 'identificaHome.png" class="IDFP-Image  IDFP-Image-Front" alt="" />\
                                    </div>\
                                </div>\
                                <div class="IDFP-card-back">\
                                    <div class="IDFP-ImageContain" id="idfImageContainerBack-' + instance + '">\
                                        <img src="" id="idfBackImage-' + instance + '" class="IDFP-Image IDFP-Image-Back" alt="" />\
                                        <img class="IDFP-Cursor IDFP-Cursor-Back" id="idfBackCursor-' + instance + '" src="' + path + 'exequextcursor.gif" alt="Cursor" />\
                                        <a href="#" class="IDFP-LinkAudio IDFP-LinkAudio-Back" id="idfBackAudio-' + instance + '"   title="Audio"><img src="' + path + 'exequextaudio.png" class="IDFP-Audio" alt="Audio"></a>\
                                    </div>\
                                    <div class="IDFP-AuthorLicence" id="idfAuthorLicence-' + instance + '">\
                                        <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                                        <p id="idfPAuthor-' + instance + '"></p>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="IDFP-GameOver" id="idfGamerOver-' + instance + '">\
                        <div class="IDFP-DataImage">\
                            <img src="' + path + 'exequextlost.png" class="IDFP-HistGGame" id="idfHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                       </div>\
                        <div class="IDFP-DataScore">\
                            <p id="idfOverScore-' + instance + '">Score: 0</p>\
                            <p id="idfOverHits-' + instance + '">Hits: 0</p>\
                            <p id="idfOverErrors-' + instance + '">Errors: 0</p>\
                        </div>\
                    </div>\
                </div>\
                <div class="IDFP-Right">\
                    ' + $eXeIdentifica.getClues(1, instance) + '\
                </div>\
            </div>\
            <div class="IDFP-Botton">\
            ' + $eXeIdentifica.getCluesBotton(instance) + '\
            </div>\
            <div class="IDFP-ButtonClue">\
                <a  href="#" id="idfUseClue-' + instance + '" class="IDFP-BClue">\
                ' + msgs.msgShowClue + '\
                </a>\
            </div>\
            <div id="idfMessageAnswer-' + instance + '" class="IDFP-MessageClue"></div>\
            <div class="IDFP-DivSubmit" id="idfDivSubmit-' + instance + '">\
                <a href="#" id="idfBtnMoveOn-' + instance + '" title="' + msgs.msgMoveOne + '">\
                    <strong><span class="sr-av">' + msgs.msgMoveOne + '</span></strong>\
                    <div class="exeQuextIcons-MoveOne  IDFP-Activo"></div>\
                </a>\
                <label for="idfAnswer-' + instance + '" class="sr-av">' + msgs.msgReply + '</label><input id="idfAnswer-' + instance + '" type="text">\
                <a href="#" id="idfSubmit-' + instance + '" title="' + msgs.msgReply + '">\
                    <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                    <div class="exeQuextIcons-Submit  IDFP-Activo"></div>\
                </a>\
            </div>\
            <div class="IDFP-Cubierta" id="idfCubierta-' + instance + '">\
                <div class="IDFP-CodeAccessDiv" id="idfCodeAccessDiv-' + instance + '">\
                    <p class="IDFP-MessageCodeAccessE" id="idfMesajeAccesCodeE-' + instance + '"></p>\
                    <div class="IDFP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="IDFP-CodeAccessE"  id="idfCodeAccessE-' + instance + '">\
                        <a href="#" id="idfCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                            <div class="IDFPIcons IDFPIcons-Submit IDFP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="IDFP-DivFeedBack" id="idfDivFeedBack-' + instance + '">\
                    <input type="button" id="idfFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
                </div>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        var butonScore = "";
        var fB = '<div class="IDFP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="IDFP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="idfSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton IDFP-SendScore" /> <span class="IDFP-RepeatActivity" id="idfRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="IDFP-GetScore">';
                fB += '<p><span class="IDFP-RepeatActivity" id="idfRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    showCubiertaOptions(mode, instance) {
        if (mode === false) {
            $('#idfCubierta-' + instance).fadeOut();
            return;
        }
        $('#idfCodeAccessDiv-' + instance).hide();
        $('#idfDivFeedBack-' + instance).hide();
        switch (mode) {
            case 0:
                $('#idfCodeAccessDiv-' + instance).show();
                break;
            case 1:
                $('#idfDivFeedBack-' + instance).find('.identifica-feedback-game').show();
                $('#idfDivFeedBack-' + instance).css('display', 'flex')
                $('#idfDivFeedBack-' + instance).show();
                break;
            default:

                break;
        }
        $('#idfCubierta-' + instance).fadeIn();
    },
    getCluesBotton: function (instance) {
        var mOptions = $eXeIdentifica.options[instance],
            html = '';
        for (var i = 0; i < 8; i++) {
            var clue = ' <a href="#" data-number="' + i + '" class="IDFP-LinkClue">\
                <img class="IDFP-Clue" src="' + $eXeIdentifica.idevicePath + 'identificaPistaI.svg" alt="' + mOptions.msgs.msgClue + ' ' + i + '">\
            </a>'
            html += clue;
        }
        return html;
    },
    getClues: function (num, instance) {
        var mOptions = $eXeIdentifica.options[instance],
            html = '';
        for (var i = 0; i < 5; i++) {
            var clue = ' <a href="#" data-number="' + (i * 2 + num) + '" class="IDFP-LinkClue">\
                <img class="IDFP-Clue" src="' + $eXeIdentifica.idevicePath + 'identificaPistaI.svg" alt="' + mOptions.msgs.msgClue + ' ' + (2 * i + num) + '">\
            </a>'
            html += clue;
        }
        return html;
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

    loadDataGame: function (data, imgsLink, audioLink) {
        var json = data.text();
        json = $eXeIdentifica.Decrypt(json);
        var mOptions = $eXeIdentifica.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeIdentifica.hasLATEX = true;
        }
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.activeClue = 0;
        mOptions.activeQuestion = 0;
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            mOptions.questionsGame[i].url = $eXeIdentifica.extractURLGD(mOptions.questionsGame[i].url);
            mOptions.questionsGame[i].audio = $eXeIdentifica.extractURLGD(mOptions.questionsGame[i].audio);
        }
        mOptions.scoreGame = 0;
        mOptions.scoreTotal = 0;
        mOptions.score = 0;
        mOptions.playerAudio = "";
        mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
        mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? '' : mOptions.evaluationID;
        mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
        imgsLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.questionsGame.length) {
                mOptions.questionsGame[iq].url = $(this).attr('href');
                if (mOptions.questionsGame[iq].url.length < 4 && mOptions.questionsGame[iq].type == 1) {
                    mOptions.questionsGame[iq].url = "";
                }
            }
        });

        audioLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.questionsGame.length) {
                mOptions.questionsGame[iq].audio = $(this).attr('href');
                if (mOptions.questionsGame[iq].audio.length < 4) {
                    mOptions.questionsGame[iq].audio = "";
                }
            }
        });
        mOptions.questionsGame = $eXeIdentifica.getQuestions(mOptions.questionsGame, mOptions.percentajeQuestions);
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            mOptions.scoreTotal += 1;
        }
        mOptions.questionsGame = mOptions.questionsRamdon ? $eXeIdentifica.shuffleAds(mOptions.questionsGame) : mOptions.questionsGame;
        mOptions.numberQuestions = mOptions.questionsGame.length;
        return mOptions;
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
                array = $eXeIdentifica.shuffleAds(array).slice(0, num).sort(function (a, b) {
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

    playSound: function (selectedFile, instance) {
        var mOptions = $eXeIdentifica.options[instance];
        selectedFile = $eXeIdentifica.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile);
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });

    },
    stopSound: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
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
    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },

    addEvents: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        window.addEventListener('unload', function () {
            $eXeIdentifica.endScorm();
        });
        $('#idfLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#idfGameContainer-" + instance).show()
            $("#idfGameMinimize-" + instance).hide();
            setTimeout(function () {
                $eXeIdentifica.showBackCard(mOptions.questionsGame[mOptions.activeQuestion], instance);
            }, 200)
        });
        $("#idfLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#idfGameContainer-" + instance).hide();
            $("#idfGameMinimize-" + instance).css('visibility', 'visible').show();
            return true;
        });
        $('#idfSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeIdentifica.sendScore(false, instance);
            $eXeIdentifica.saveEvaluation(instance);
            return true;
        });
        $('#idfGamerOver-' + instance).hide();
        $('#idfCodeAccessDiv-' + instance).hide();
        $('#idfCursor-' + instance).hide();
        $('#idfCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeIdentifica.enterCodeAccess(instance);
        });
        $('#idfCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeIdentifica.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $("#idfLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('idfGameContainer-' + instance);
            $eXeIdentifica.toggleFullscreen(element, instance);
        });
        $('#idfInstructions-' + instance).text(mOptions.instructions);
        $('#idfPNumber-' + instance).text(mOptions.numberQuestions);
        $('#idfGameContainer-' + instance + ' .IDFP-StartGame').show();
        $('#idfQuestionDiv-' + instance).hide();
        if (mOptions.itinerary.showCodeAccess) {
            $('#idfMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $eXeIdentifica.showCubiertaOptions(0, instance)
        }

        $('#idfInstruction-' + instance).text(mOptions.instructions);
        $('#idfSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#idfSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeIdentifica.updateScorm($eXeIdentifica.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#idfShowClue-' + instance).hide();
        mOptions.gameOver = false;
        $('#idfStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#idfFeedBackClose-' + instance).on('click', function (e) {
            $eXeIdentifica.showCubiertaOptions(false, instance)
        });
        $('#idfLinkAudio-' + instance).on('click', function (e) {
            e.preventDefault();
            var audio = mOptions.questionsGame[mOptions.activeQuestion].audio;
            $eXeIdentifica.stopSound(instance);
            $eXeIdentifica.playSound(audio, instance);
        });
        $('#idfGameContainer-' + instance).on('click', '.IDFP-LinkClue', function (e) {
            e.preventDefault();
            if (!$(this).hasClass('IDFP-ActivoClue')) return;
            var num = parseInt($(this).data('number')),
                $pulsados = $('#idfGameContainer-' + instance).find(".IDFP-LinkClue[data-number='" + num + "']"),
                message = mOptions.questionsGame[mOptions.activeQuestion].clues[num];
            $pulsados.each(function () {
                $(this).attr('title', message);
            })
            $('#idfMessageClue-' + instance).html(message);
            $('#idfMessageClue-' + instance).fadeOut(400).fadeIn(300).fadeOut(400).fadeIn(300);
            $eXeIdentifica.updateLatex('idfGameContainer-' + instance);
        });
        $('#idfSubmit-' + instance).on('click', function (e) {
            e.preventDefault();
            var solution = mOptions.questionsGame[mOptions.activeQuestion].solution,
                answer = $('#idfAnswer-' + instance).val().trim();
            if (answer.length == 0) {
                $eXeIdentifica.showMessage(0, mOptions.msgs.msgAnswer, instance);
                return;
            }
            var correct = $eXeIdentifica.checkWord(solution, answer);
            $eXeIdentifica.answerWord(correct, instance);

        });
        $('#idfAnswer-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                var solution = mOptions.questionsGame[mOptions.activeQuestion].solution,
                    answer = $('#idfAnswer-' + instance).val().trim();
                if (answer.length == 0) {
                    $eXeIdentifica.showMessage(0, mOptions.msgs.msgAnswer, instance);
                    return true;
                }
                var correct = $eXeIdentifica.checkWord(solution, answer);
                $eXeIdentifica.answerWord(correct, instance);
                return false;
            }
            return true;
        });
        $('#idfBtnMoveOn-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeIdentifica.newQuestion(instance)
        });
        $('#idfCardDraw-' + instance).on('click', function (e) {
            e.preventDefault();
            if (!mOptions.gameStarted) return;
            $('#idfMessageClue-' + instance).html(mOptions.questionsGame[mOptions.activeQuestion].question);
        });
        $('#idfUseClue-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeIdentifica.showClue(instance)
        });
        $('#idfUseClue-' + instance).hide();
        window.addEventListener('resize', function () {
            $eXeIdentifica.refreshImageActive(instance);
        });
        $eXeIdentifica.updateEvaluationIcon(instance)
    },

    showClue(instance) {
        var mOptions = $eXeIdentifica.options[instance],
            numclues = mOptions.questionsGame[mOptions.activeQuestion].numberClues,
            clue = mOptions.questionsGame[mOptions.activeQuestion].clues[mOptions.activeClue],
            message = mOptions.msgs.msgUseClue;
        $pulsados = $('#idfGameContainer-' + instance).find(".IDFP-LinkClue[data-number='" + mOptions.activeClue + "']");
        $pulsados.each(function () {
            $(this).find('.IDFP-Clue').eq(0).attr('src', $eXeIdentifica.idevicePath + 'identificaPistaOpen.svg');
            $(this).attr('title', clue);
            $(this).addClass('IDFP-ActivoClue');
            $(this).css('cursor', 'pointer');
        })
        $('#idfMessageClue-' + instance).html(clue);
        $('#idfMessageClue-' + instance).fadeOut(400).fadeIn(300).fadeOut(400).fadeIn(300);
        mOptions.pointsClue = mOptions.pointsQuestion - ((mOptions.activeClue + 1) * mOptions.pointsQuestion / ((mOptions.questionsGame[mOptions.activeQuestion].numberClues * 2)));
        message = mOptions.msgs.msgUseClue.replace('%s', mOptions.pointsClue.toFixed(2));
        $('#idfPoints-' + instance).text(mOptions.pointsClue.toFixed(2))
        mOptions.activeClue++;
        $('#idfUseClue-' + instance).html(mOptions.msgs.msgShowNewClue);
        if (mOptions.activeClue >= numclues) {
            $('#idfUseClue-' + instance).hide();
            message = mOptions.msgs.msgUseAllClues.replace('%s', mOptions.pointsClue.toFixed(2));
            $('#idfUseClue-' + instance).html(mOptions.msgs.msgShowClue);
        }
        $eXeIdentifica.showMessage(0, message, instance);
        $eXeIdentifica.updateLatex('idfGameContainer-' + instance);


    },
    checkWord: function (word, answord) {
        var sWord = $.trim(word).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, ""),
            sAnsWord = $.trim(answord).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
        sWord = $.trim(sWord).toLowerCase();
        sAnsWord = $.trim(sAnsWord).toLowerCase();
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
    answerWord: function (correct, instance) {
        var mOptions = $eXeIdentifica.options[instance];
        if (correct) {
            message = $eXeIdentifica.getMessageAnswer(true, instance);
            $eXeIdentifica.showMessage(2, message, instance);
            $eXeIdentifica.endQuestion(true, instance);

        } else {
            mOptions.attempts--
            var message = mOptions.attempts > 0 ? $eXeIdentifica.getRetroFeedMessages(false, instance) + mOptions.msgs.msgYouCanTryAgain : $eXeIdentifica.getMessageAnswer(false, instance);
            $eXeIdentifica.showMessage(1, message, instance);
            if (mOptions.attempts <= 0) {
                $eXeIdentifica.endQuestion(false, instance);
            }
        }
        $('#idfAttempts-' + instance).text(mOptions.attempts);
        $('#idfPoints-' + instance).text(mOptions.pointsClue.toFixed(2));
        $('#idfAnswer-' + instance).val('');
    },
    endQuestion: function (respuesta, instance) {
        var mOptions = $eXeIdentifica.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        $('#idfUseClue-' + instance).hide();
        $eXeIdentifica.updateScore(respuesta, instance);
        mOptions.gameActived = false;
        var timeShowSolution = 1000;
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                timeShowSolution = 5000;
                $('#idfShowClue-' + instance).show();
                $('#idfPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                mOptions.obtainedClue = true;
            }
        }
        if (mOptions.showSolution || respuesta) {
            $('#idfBackImage-' + instance).show();
            timeShowSolution = mOptions.timeShowSolution * 1000;
            if (!$('#idfCardDraw-' + instance).find('.IDFP-card-inner').eq(0).addClass('flipped')) {
                $('#idfCardDraw-' + instance).find('.IDFP-card-inner').eq(0).addClass('flipped');
            }
        }
        $('#idfPAuthor-' + instance).show();
        $('#idfAnswer-' + instance).prop('disabled', true);
        $('#idfAnswer-' + instance).hide();
        $('#idfSubmit-' + instance).focus();
        $('#idfSubmit-' + instance).prop('disabled', true);
        $('#idfSubmit-' + instance).blur();
        $('#idfSubmit-' + instance).hide();
        $('#idfBtnMoveOn-' + instance).prop('disabled', true);
        $('#idfBtnMoveOn-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeIdentifica.initialScore === '') {
                var score = mOptions.score.toFixed(2);;
                $eXeIdentifica.sendScore(true, instance);
                $('#idfRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        $eXeIdentifica.saveEvaluation(instance);
        setTimeout(function () {
            $eXeIdentifica.newQuestion(instance)
        }, timeShowSolution);
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeIdentifica.options[instance],
            mQuextion = mOptions.questionsGame[mOptions.activeQuestion];      
        if (mOptions.gameOver ||typeof mQuextion == "undefined" ) {
            return;
        }
        $eXeIdentifica.positionPointerCard(instance)
    },
    positionPointerCard: function(instance) {
		var mOptions = $eXeIdentifica.options[instance],
			mQuextion = mOptions.questionsGame[mOptions.activeQuestion],
		    x = parseFloat(mQuextion.x) || 0;
		    y = parseFloat(mQuextion.y) || 0, 
			$cursor=$('#idfBackCursor-' + instance);
			$cursor.hide();
		if(x > 0 || y > 0){
			var containerElement = document.getElementById('idfImageContainerBack-' + instance),
			    containerPos = containerElement.getBoundingClientRect(),
			    imgElement = document.getElementById('idfBackImage-' + instance),
			    imgPos = imgElement.getBoundingClientRect(),
  		        marginTop = imgPos.top - containerPos.top,
			    marginLeft = imgPos.left - containerPos.left,
			    x = marginLeft + (x * imgPos.width),
			    y = marginTop + (y * imgPos.height);
				$cursor.show();
				$cursor.css({ left: x, top: y, 'z-index': 30 });
		}
	},
    enterCodeAccess: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() === $('#idfCodeAccessE-' + instance).val().toLowerCase()) {
            $eXeIdentifica.showCubiertaOptions(false, instance)
        } else {
            $('#idfMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#idfCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (instance) {
        var mOptions = $eXeIdentifica.options[instance],
            msgs = mOptions.msgs,
            $idfHistGame = $('#idfHistGame-' + instance),
            $idfLostGame = $('#idfLostGame-' + instance),
            $idfOverPoint = $('#idfOverScore-' + instance),
            $idfOverHits = $('#idfOverHits-' + instance),
            $idfOverErrors = $('#idfOverErrors-' + instance),
            $idfShowClue = $('#idfShowClue-' + instance),
            $idfPShowClue = $('#idfPShowClue-' + instance),
            $idfGamerOver = $('#idfGamerOver-' + instance),
            $idfCardDraw = $('#idfCardDraw-' + instance);
        $idfHistGame.hide();
        $idfLostGame.hide();
        $idfOverPoint.show();
        $idfOverHits.show();
        $idfOverErrors.show();
        $idfShowClue.hide();
        $idfHistGame.show();
        if (mOptions.itinerary.showClue) {
            if (mOptions.obtainedClue) {
                $idfPShowClue.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                $idfShowClue.show();
            } else {
                $idfPShowClue.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                $idfShowClue.show();
            }
        }

        var msscore = '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score.toFixed(2);
        $idfOverPoint.html(msscore);
        $idfOverHits.html('<strong>' + msgs.msgHits + ':</strong> ' + mOptions.hits);
        $idfOverErrors.html('<strong>' + msgs.msgErrors + ':</strong> ' + mOptions.errors);
        $idfGamerOver.show();
        $idfCardDraw.hide();

    },
    startGame: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.scoreGame = 0;
        mOptions.obtainedClue = false;
        $('#idfShowClue-' + instance).hide();
        $('#idfPShowClue-' + instance).text("");
        $('#idfGameContainer-' + instance + ' .IDFP-StartGame').hide();
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.activeClue = 0;
        mOptions.gameActived = false;
        mOptions.activeQuestion = -1;
        mOptions.validQuestions = mOptions.numberQuestions;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        mOptions.scoreQuestion = 10 / mOptions.questionsGame.length;
        $('#idfPNumber-' + instance).text(mOptions.numberQuestions);
        $('#idfPHits-' + instance).text(mOptions.hits);
        $('#idfPErrors-' + instance).text(mOptions.errors);
        $('#idfPScore-' + instance).text(mOptions.score.toFixed(2));
        mOptions.gameStarted = true;
        $eXeIdentifica.newQuestion(instance);
        setTimeout(function () {
            var h = $('#idfMultimedia-' + instance).height() + 'px'
            $('#idfMultimedia-' + instance).find('.IDFP-Left').css({
                'height': h
            });
            $('#idfMultimedia-' + instance).find('.IDFP-Right').css({
                'height': h
            });
        }, 200);
        $eXeIdentifica.showMessage(3, mOptions.msgs.msgGameStarted, instance)
    },

    gameOver: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        mOptions.gameStarted = false;
        $eXeIdentifica.showCluesLinks(0, instance)
        $('#idfLinkAudio-' + instance).hide();
        $eXeIdentifica.stopSound(instance);
        $('#idfCursor-' + instance).hide();
        var message = mOptions.msgs.msgGameEnd;
        $eXeIdentifica.showMessage(1, message, instance);
        $eXeIdentifica.showScoreGame(instance);
        $('#idfPNumber-' + instance).text('0');
        $('#idfAnswer-' + instance).hide();
        $('#idfSubmit-' + instance).hide();
        $('#idfBtnMoveOn-' + instance).hide();
        $('#idfMessageClue-' + instance).hide();
        $('#idfUseClue-' + instance).hide();

        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeIdentifica.initialScore === '') {
                var score = mOptions.score.toFixed(2);
                $eXeIdentifica.sendScore(true, instance);
                $('#idfRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeIdentifica.initialScore = score;
            }
        }
        $eXeIdentifica.saveEvaluation(instance);
        $eXeIdentifica.showFeedBack(instance);
    },
    showFeedBack: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.questionsGame.length;
        if (mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#idfDivFeedBack-' + instance).find('.identifica-feedback-game').show();
                $eXeIdentifica.showCubiertaOptions(1, instance)
            } else {
                $eXeIdentifica.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance);
            }
        }
    },
    showCluesLinks: function (numclues, instance) {
        var mOptions = $eXeIdentifica.options[instance],
            $clues = $('#idfGameContainer-' + instance).find('.IDFP-LinkClue'),
            img = $eXeIdentifica.idevicePath + 'identificaPistaA.svg';
        $clues.removeClass('IDFP-ActivoClue')
        $clues.hide();
        $clues.find('.IDFP-Clue').attr('src', img);
        $clues.each(function (i) {
            var mn = parseInt($(this).data('number'));
            if (mn < numclues) {
                $(this).fadeIn();
            }
            if (mOptions.avancedMode) {
                $(this).css({
                    'cursor': 'default'
                });
                $(this).attr('title', 'Pista ' + (mn + 1));
            } else {
                var actimg = $eXeIdentifica.idevicePath + 'identificaPistaOpen.svg';
                $(this).find('.IDFP-Clue').attr('src', actimg);
                $(this).css({
                    'cursor': 'pointer'
                });
                $(this).addClass('IDFP-ActivoClue');
                $(this).attr('title', mOptions.questionsGame[mOptions.activeQuestion].clues[mn]);
            }

        });

    },

    showBackCard: function (q, instance) {
        var $image = $('#idfBackImage-' + instance),
            $audio = $('#idfBackAudio-' + instance),
            $cursor = $('#idfBackCursor-' + instance);
        $audio.hide();
        $cursor.hide();
        var url = q.url.length > 3 ? q.url : $eXeIdentifica.idevicePath + 'identificaHome.png';
        $image.attr('alt', q.alt);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $cursor.hide();
                } else {
                    $image.show();
                    $eXeIdentifica.positionPointerCard(instance)
                    return true;
                }
            }).on('error', function () {
                $cursor.hide();
            });

        $image.hide();




    },

    showQuestion: function (i, instance) {
        var mOptions = $eXeIdentifica.options[instance],
            q = mOptions.questionsGame[i];
        mOptions.gameActived = true;
        mOptions.question = q;
        mOptions.attempts = q.attempts;
        mOptions.activeClue = 0;
        mOptions.pointsQuestion = 10 / mOptions.questionsGame.length;
        mOptions.pointsClue = mOptions.pointsQuestion;
        $('#idfCardDraw-' + instance).find('.IDFP-card-inner').eq(0).removeClass('flipped')
        $('#idfAttempts-' + instance).text(q.attempts);
        $('#idfPoints-' + instance).text(mOptions.pointsClue.toFixed(2));
        $('#idfUseClue-' + instance).text(mOptions.msgs.msgShowClue);
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeIdentifica.initialScore === '') {
                var score = mOptions.score.toFixed(2);;
                $eXeIdentifica.sendScore(true, instance);
                $('#idfRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }

        $eXeIdentifica.stopSound(instance);
        if (q.audio.trim().length > 4) {
            $eXeIdentifica.playSound(q.audio.trim(), instance);
        }

        $('#idfMessageClue-' + instance).html(q.question);
        $('#idfPAuthor-' + instance).html(q.author);
        $eXeIdentifica.showCluesLinks(q.numberClues, instance);
        $eXeIdentifica.showMessage(0, '', instance);
        var html = $('#idfGameContainer-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeIdentifica.updateLatex('idfGameContainer-' + instance);
        }

        setTimeout(function () {
            $eXeIdentifica.showBackCard(q, instance);
        }, 1000);
        if (mOptions.avancedMode) {
            $('#idfUseClue-' + instance).show();
        }
    },

    newQuestion: function (instance) {
        var mOptions = $eXeIdentifica.options[instance];
        var mActiveQuestion = $eXeIdentifica.updateNumberQuestion(mOptions.activeQuestion, instance);
        if (mActiveQuestion === -10) {
            $('idfPNumber-' + instance).text('0');
            $eXeIdentifica.gameOver(instance);
        } else {
            $eXeIdentifica.showQuestion(mActiveQuestion, instance)
            mOptions.activeCounter = true;
            var numQ = mOptions.numberQuestions - mActiveQuestion;
            $('#idfPNumber-' + instance).text(numQ);
            $('#idfAnswer-' + instance).prop('disabled', false);
            $('#idfSubmit-' + instance).prop('disabled', false);
            $('#idfAnswer-' + instance).show();
            $('#idfSubmit-' + instance).show();
            $('#idfBtnMoveOn-' + instance).prop('disabled', false);
            $('#idfBtnMoveOn-' + instance).show();
        };
    },

    updateNumberQuestion: function (numq, instance) {
        var mOptions = $eXeIdentifica.options[instance],
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },

    getRetroFeedMessages: function (hit, instance) {
        var msgs = $eXeIdentifica.options[instance].msgs;
        var sMessages = hit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },

    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeIdentifica.options[instance],
            sscore = 0;
        if (correctAnswer) {
            mOptions.hits++
            mOptions.score += mOptions.pointsClue;
        } else {
            mOptions.errors++;

        }
        sscore = mOptions.score.toFixed(2);
        $('#idfPScore-' + instance).text(sscore);
        $('#idfPHits-' + instance).text(mOptions.hits);
        $('#idfPErrors-' + instance).text(mOptions.errors);
    },



    getMessageAnswer: function (correctAnswer, instance) {
        var mOptions = $eXeIdentifica.options[instance];
        var message = "",
            q = mOptions.questionsGame[mOptions.activeQuestion];
        if (correctAnswer) {
            message = $eXeIdentifica.getMessageCorrectAnswer(instance);
        } else {
            message = $eXeIdentifica.getMessageErrorAnswer(instance);
        }
        if (mOptions.showSolution && q.typeQuestion == 1) {
            message += ': ' + q.solution;
        }
        if (mOptions.showSolution) {
            message = message + '. ' + mOptions.msgs.msgCorrectAnswer + ' ' + mOptions.questionsGame[mOptions.activeQuestion].solution;
        }
        return message;
    },

    getMessageCorrectAnswer: function (instance) {
        var mOptions = $eXeIdentifica.options[instance],
            messageCorrect = $eXeIdentifica.getRetroFeedMessages(true, instance),
            message = "";
        if (mOptions.customMessages && mOptions.questionsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.questionsGame[mOptions.activeQuestion].msgHit + ' ' + mOptions.pointsClue.toFixed(2) + ' ' + mOptions.msgs.msgPoints;
        } else {
            message = messageCorrect + ' ' + mOptions.pointsClue.toFixed(2) + ' ' + mOptions.msgs.msgPoints;
        }

        return message;
    },

    getMessageErrorAnswer: function (instance) {
        var mOptions = $eXeIdentifica.options[instance],
            messageError = $eXeIdentifica.getRetroFeedMessages(false, instance),
            message = "";
        if (mOptions.customMessages && mOptions.questionsGame[mOptions.activeQuestion].msgError.length > 0) {
            message = mOptions.questionsGame[mOptions.activeQuestion].msgError;
        } else {
            message = messageError;

        }
        return message;
    },

    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeIdentifica.borderColors.red, $eXeIdentifica.borderColors.green, $eXeIdentifica.borderColors.blue, $eXeIdentifica.borderColors.yellow],
            mcolor = colors[type],
            weight = type == 0 ? 'normal' : 'normal';
        $('#idfMessageAnswer-' + instance).text(message);
        $('#idfMessageAnswer-' + instance).css({
            'color': mcolor,
            'font-weight': weight
        });
        $('#idfMessageAnswer-' + instance).show();
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
            $eXeIdentifica.getFullscreen(element);
        } else {
            $eXeIdentifica.exitFullscreen(element);
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
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }
}
$(function () {
    $eXeIdentifica.init();
});