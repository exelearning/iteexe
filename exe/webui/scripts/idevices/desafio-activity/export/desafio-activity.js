/**
 * QuExt Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeDesafio = {
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
    widthImage: 0,
    heightImage: 0,
    options: {},
    msgs: '',
    fontSize: '1em',
    isInExe: false,
    hasLatex: false,
    userName: '',
    scorm: '',
    hasSCORMbutton: false,
    previousScore: '',
    initialScore: '',
    init: function () {
        this.activities = $('.desafio-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeDesafio.supportedBrowser('desafio')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Challenge') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/desafio-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();

    },
    loadSCORM_API_wrapper: function () {

        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeDesafio.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeDesafio.enable()');
        else this.enable();
        $eXeDesafio.mScorm = scorm;
        var callSucceeded = $eXeDesafio.mScorm.init();
        if (callSucceeded) {
            $eXeDesafio.userName = $eXeDesafio.getUserName();
            $eXeDesafio.previousScore = $eXeDesafio.getPreviousScore();
            $eXeDesafio.mScorm.set("cmi.core.score.max", 10);
            $eXeDesafio.mScorm.set("cmi.core.score.min", 0);
            $eXeDesafio.initialScore = $eXeDesafio.previousScore;
        }
    },
    loadJSCSSFile: function (filename, filetype) {
        if (filetype == "js") { //if filename is a external JavaScript file
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
        } else if (filetype == "css") { //if filename is an external CSS file
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    },
    getUserName: function () {
        var user = $eXeDesafio.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeDesafio.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        if ($eXeDesafio.mScorm && typeof $eXeDesafio.mScorm.quit == "function") {
            $eXeDesafio.mScorm.quit();
        }

    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeDesafio.options[instance],
            text = '';
        $('#desafioSendScore-' + instance).hide();
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
            $('#desafioSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#desafioSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#desafioRepeatActivity-' + instance).text(text);
        $('#desafioRepeatActivity-' + instance).fadeIn(1000);
    },


    updateEvaluationIcon: function (instance) {
        var mOptions = $eXeDesafio.options[instance];

        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data = $eXeDesafio.getDataStorage1(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                $eXeDesafio.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
            $eXeDesafio.showEvaluationIcon(instance, state, score);
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#desafioMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');


        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions = $eXeDesafio.options[instance];
        var $header = $('#desafioGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
        }
        $('#desafioEvaluationIcon-' + instance).remove();
        var sicon = '<div id="desafioEvaluationIcon-' + instance + '" class="desafio-EvaluationDivIcon"><img  src="' + $eXeDesafio.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#desafioEvaluationIcon-' + instance).find('span').eq(0).text(alt)
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

    saveEvaluation: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            points = mOptions.desafioSolved ? mOptions.solvedsChallenges.length + 1 : mOptions.solvedsChallenges.length,
            score = (10 * (points / (mOptions.challengesGame.length + 1))).toFixed(2);
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#desafioGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text();
            var formattedDate = $eXeDesafio.getDateString();
            var scorm = {
                'id': mOptions.id,
                'type': mOptions.msgs.msgTypeGame,
                'node': node,
                'name': name,
                'score': score,
                'date': formattedDate,
                'state': (parseFloat(score) >= 5 ? 2 : 1)
            }
            var data = $eXeDesafio.getDataStorage1(mOptions.evaluationID);
            data = $eXeDesafio.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeDesafio.showEvaluationIcon(instance, scorm.state, scorm.score)
        }

    },
    getDataStorage1: function (id) {
        var id = 'dataEvaluation-' + id,
            data = $eXeDesafio.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeDesafio.options[instance],
            message = '',
            points = mOptions.desafioSolved ? mOptions.solvedsChallenges.length + 1 : mOptions.solvedsChallenges.length,
            score = 10 * (points / (mOptions.challengesGame.length + 1));
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeDesafio.mScorm != 'undefined') {
                if (!auto) {
                    $('#desafioSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeDesafio.previousScore !== '') {
                        message = $eXeDesafio.userName !== '' ? $eXeDesafio.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeDesafio.previousScore = score;
                        $eXeDesafio.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeDesafio.userName !== '' ? $eXeDesafio.userName + '. ' + mOptions.msgs.msgYouScore + ': ' + score.toFixed(2) : mOptions.msgs.msgYouScore + ': ' + score.toFixed(2)
                        if (!mOptions.repeatActivity) {
                            $('#desafioSendScore-' + instance).hide();
                        }
                        $('#desafioRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score.toFixed(2))
                        $('#desafioRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeDesafio.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeDesafio.mScorm.set("cmi.core.score.raw", score);
                    $('#desafioRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score.toFixed(2))
                    $('#desafioRepeatActivity-' + instance).show();
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
    enable: function () {
        $eXeDesafio.loadGame();
    },

    loadGame: function () {
        $eXeDesafio.options = [];
        $eXeDesafio.activities.each(function (i) {
            var version = $(".desafio-version", this).eq(0).text(),
                dl = $(".desafio-DataGame", this),
                mOption = $eXeDesafio.loadDataGame(dl, version),
                msg = mOption.msgs.msgPlayStart;
            $eXeDesafio.options.push(mOption);
            var desafio = $eXeDesafio.createInterfaceQuExt(i);
            dl.before(desafio).remove();
            $('#desafioGameMinimize-' + i).hide();
            $('#desafioGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#desafioGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#desafioGameContainer-' + i).show();
            }
            $('#desafioMessageMaximize-' + i).text(msg);
            $('#desafioDescription-' + i).append($(".desafio-EDescription", this));
            $('.desafio-ChallengeDescription', this).each(function () {
                $('#desafioFeedBacks-' + i).append($(this));
            });
            $('#desafioDescription-' + i).hide();
            $('#desafioFeedBacks-' + i).hide();
            $eXeDesafio.addEvents(i);
            var hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test($('#desafioGameContainer-' + i).html());
            if (hasLatex) {
                $eXeDesafio.hasLATEX = true;
            }
        });
        if ($eXeDesafio.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeDesafio.loadMathJax();
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
                    console.log('Error al refrescar cuestiones')
                }
            }

        }, 100);
    },
    createInterfaceQuExt: function (instance) {
        var html = '',
            path = $eXeDesafio.idevicePath,
            msgs = $eXeDesafio.options[instance].msgs;
        html += '<div class="desafio-MainContainer"  id="desafioMainContainer-' + instance + '">\
                <div class="desafio-GameMinimize" id="desafioGameMinimize-' + instance + '">\
                    <a href="#" class="desafio-LinkMaximize " id="desafioLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'desafioicon.png" class="desafio-Icons desafio-IconMinimize desafio-Activo" alt="Mostrar actividad">\
                        <div class="desafio-MessageMaximize" id="desafioMessageMaximize-' + instance + '"></div>\
                    </a>\
                </div>\
                <div class="desafio-GameContainer" id="desafioGameContainer-' + instance + '">\
                    <div class="desafio-GameScoreBoard">\
                        <div class="desafio-GameChallenges" id="desafioGameChallenges-' + instance + '">\
                            <a href="#" class="desafio-LinkDesafio" id="desafioDesafio-' + instance + '" title="' + msgs.msgDesafio + '">\
                                <strong><span class="sr-av">' + msgs.msgDesafio + ':</span></strong>\
                                <div class="desafio-GameDesafio desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="0" id="desafioLink0-' + instance + '" title="' + msgs.msgChallenge + ' 1">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C0 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="1" id="desafioLink1-' + instance + '" title="' + msgs.msgChallenge + ' 2">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C1 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="2" id="desafioLink2-' + instance + '" title="' + msgs.msgChallenge + ' 3">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C2 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="3" id="desafioLink3-' + instance + '" title="' + msgs.msgChallenge + ' 4">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C3 desafio-Activo" ></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="4"  id="desafioLink4-' + instance + '" title="' + msgs.msgChallenge + ' 5">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C4 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="5"  id="desafioLink5-' + instance + '" title="' + msgs.msgChallenge + ' 6">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C5 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="6" id="desafioLink6-' + instance + '" title="' + msgs.msgChallenge + ' 7">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C6 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="7"  id="desafioLink7-' + instance + '" title="' + msgs.msgChallenge + ' 8">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C7 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="8" id="desafioLink8-' + instance + '" title="' + msgs.msgChallenge + ' 9">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C8 desafio-Activo"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="9" id="desafioLink9-' + instance + '" title="' + msgs.msgChallenge + ' 10">\
                                <strong><span class="sr-av">' + msgs.msgChallenge + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C9 desafio-Activo"></div>\
                            </a>\
                        </div>\
                        <div class="desafio-TimeNumber">\
                                <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                                <div class="exeQuextIcons34 exeQuextIcons34-Time"></div>\
                                <p id="desafioPTime-' + instance + '" class="desafio-PTime">00:00:00</p>\
                                <a href="#" class="desafio-LinkMinimize" id="desafioLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextIcons34 exeQuextIcons34-Minimize desafio-Activo"></div>\
                                </a>\
                        </div>\
                    </div>\
                    <div class="desafio-Multimedia" id="desafioMultimedia-' + instance + '">\
                        <img  src="" class="desafio-Images" id="desafioImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                        <img src="' + path + 'desafioHome.png" class="desafio-Images" id="desafioCover-' + instance + '" alt="' + msgs.msImage + '" />\
                        <div class="desafio-GameOver" id="desafioGamerOver-' + instance + '">\
                            <div class="desafio-SolvedChallenges">\
                                    <p id="desafioOverScore-' + instance + '">Score: 0</p>\
                            </div>\
                                <div class="desafio-DataImageGameOver">\
                                <div class="desafio-HistGGame" id="desafioHistGGame-' + instance + '"></div>\
                                <div class="desafio-LostGGame" id="desafioLostGGame-' + instance + '"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="desafio-Title" id="desafioTitle-' + instance + '"></div>\
                    <div class="desafio-Description" id="desafioDescription-' + instance + '"></div>\
                    <div class="desafio-FeedBacks" id="desafioFeedBacks-' + instance + '"></div>\
                    <div class="desafio-MessageInfo" id="desafioMessageInfo-' + instance + '">\
                    <div class="sr-av">Information</div>\
                    <p id="desafioPInformation-' + instance + '"></p>\
                    </div>\
                    <div class="desafio-SolutionDiv" id="desafioSolutionDiv-' + instance + '">\
                        <label for="desafioSolution-' + instance + '" >' + msgs.mgsSolution + ':</label>\
                        <input type="text" class="desafio-Solution"  id="desafioSolution-' + instance + '">\
                        <a href="#" id="desafioSolutionButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                            <div class="exeQuextIcons-Submit desafio-Activo"></div>\
                        </a>\
                    </div>\
                    <div class="desafio-StartGameDiv" id="desafioStartGameDiv-' + instance + '">\
                        <a href="#" class="desafio-StartGame"  id="desafioStartGame-' + instance + '" title="' + msgs.Play + '">' + msgs.msgStartGame + '</a>\
                    </div>\
                    <div class="desafio-Clues" id="desafioClues-' + instance + '">\
                    </div>\
                    <div class="desafio-DateDiv" id="desafioDateDiv-' + instance + '">\
                        <p class="desafio-Date"  id="desafioDate-' + instance + '">' + msgs.msgDate + ':</p>\
                        <a href="#" class="desafio-LinkReboot " id="desafioRebootButton-' + instance + '" title="' + msgs.msgReboot + '">\
                            <strong><span class="sr-av">' + msgs.msgReboot + ':</span></strong>\
                                <div class="exeDesafio-IconReboot desafio-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
            </div>\
            ' + this.addButtonScore(instance);
        return html;
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        var butonScore = "";
        var fB = '<div class="desafio-BottonContainer">';
        if (mOptions.isScorm === 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="desafio-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="desafioSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="desafio-RepeatActivity" id="desafioRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm === 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="desafio-GetScore">';
                fB += '<p><span class="desafio-RepeatActivity" id="desafioRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    createArrayStateChallenges: function (type, mlength) {
        var chs = []
        for (var i = 0; i < mlength; i++) {
            var state = 0;
            if (i == 0) {
                state = 3;
            } else if (type == 1) {
                state = 1;
            }
            var p = {
                solved: 0,
                state: state
            }
            chs.push(p)
        }
        return chs;
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

    loadDataGame: function (data, version) {
        var json = data.text();
        if (version == 1 || !json.startsWith('{')) {
            json = $eXeDesafio.Decrypt(json);
        }
        var mOptions = $eXeDesafio.isJsonString(json);
        mOptions.gameOver = false;
        mOptions.numberQuestions = mOptions.challengesGame.length;
        mOptions.typeQuestion = 0;
        mOptions.activeChallenge = 0;
        mOptions.desafioDate = "";
        mOptions.started = false;
        mOptions.counter = 0;
        mOptions.endGame = false;
        mOptions.desafioSolved = false;
        mOptions.solvedsChallenges = [];
        mOptions.timesShow = [];
        mOptions.stateChallenges = $eXeDesafio.createArrayStateChallenges(mOptions.desafioType, mOptions.challengesGame.length);
        mOptions.clueTimes = [];
        mOptions.desafioID = typeof mOptions.desafioID == "undefined" ? 0 : mOptions.desafioID;
        mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
        mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? '' : mOptions.evaluationID;
        mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
        for (var i = 0; i < mOptions.challengesGame.length; i++) {
            mOptions.challengesGame[i].clueTimes = [];
            mOptions.challengesGame[i].clueTexts = [];
            mOptions.timesShow.push(10000000);
            if (typeof mOptions.challengesGame[i].clues != "undefined") {
                for (var z = 0; z < mOptions.challengesGame[i].clues.length; z++) {
                    if (mOptions.challengesGame[i].clues[z].clue.length > 0) {
                        mOptions.challengesGame[i].clueTimes.push(mOptions.challengesGame[i].clues[z].time * 60)
                        mOptions.challengesGame[i].clueTexts.push(mOptions.challengesGame[i].clues[z].clue);
                    }
                }
            }
        }

        return mOptions;
    },
    changeImageButtonState: function (instance, type) {
        var mOptions = $eXeDesafio.options[instance],
            imgDesafio = "desafioicon0.png";
        if (type == 0) {
            imgDesafio = "desafioicon1.png";
        }
        imgDesafio = "url(" + $eXeDesafio.idevicePath + imgDesafio + ") no-repeat";
        $('#desafioDesafio-' + instance).find(".desafio-GameDesafio").css({
            "background": imgDesafio,
            "background-size": "100% 100%"
        });
        var $buttonChalleng = $('#desafioGameChallenges-' + instance).find('.desafio-LinkChallenge')
        var l = 24,
            t = 24,
            file = "exequextretosicos.png";

        $('#desafioDesafio-' + instance).find(".desafio-GameDesafio").css({
            "background": imgDesafio,
            "background-size": "100% 100%",
            "width": l + 'px',
            "height": t + 'px',
        });
        $buttonChalleng.each(function (i) {
            if (i < mOptions.stateChallenges.length) {
                var state = mOptions.stateChallenges[i].state,
                    left = (-l * i) + "px",
                    top = (-t * state) + 'px',
                    mcss = "url(" + $eXeDesafio.idevicePath + file + ") no-repeat " + left + " " + top;
                $(this).find(".exeQuextRetos").css({
                    "background": mcss,
                    "width": l + 'px',
                    "height": t + 'px',
                    "flex-glow": 0
                })
            }
        });
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
    getActualFullDate: function () {
        var d = new Date();
        var day = $eXeDesafio.addZero(d.getDate());
        var month = $eXeDesafio.addZero(d.getMonth() + 1);
        var year = $eXeDesafio.addZero(d.getFullYear());
        var h = $eXeDesafio.addZero(d.getHours());
        var m = $eXeDesafio.addZero(d.getMinutes());
        var s = $eXeDesafio.addZero(d.getSeconds());
        return day + "/" + month + "/" + year + " (" + h + ":" + m + ":" + s + ")";
    },
    addEvents: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        window.addEventListener('unload', function () {
            if (mOptions.gameStarted || mOptions.gameOver) {
                $eXeDesafio.saveDataStorage(instance);
                $eXeDesafio.endScorm();
            }
        });
        window.addEventListener('resize', function () {
            $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);
        });
        $("#desafioSolutionDiv-" + instance).hide();
        var $buttonChalleng = $('#desafioGameChallenges-' + instance).find('.desafio-LinkChallenge')
        $buttonChalleng.each(function (i) {
            $(this).hide();
            if (i < mOptions.challengesGame.length) {
                $(this).show();
            }
        });
        $('#desafioGamerOver-' + instance).css('display', 'flex');
        $('#desafioLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#desafioGameContainer-" + instance).show()
            $("#desafioGameMinimize-" + instance).hide();
        });
        $("#desafioLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#desafioGameContainer-" + instance).hide();
            $("#desafioGameMinimize-" + instance).css('visibility', 'visible').show();
        });

        $('#desafioGamerOver-' + instance).hide();
        $('#desafioVideo-' + instance).hide();
        $('#desafioImagen-' + instance).hide();
        $('#desafioCursor-' + instance).hide();
        $('#desafioCover-' + instance).show();


        $('#desafioSolution-' + instance).on("keydown", function (event) {
            var dstate = $('#desafioSolution-' + instance).prop('readonly');
            if (dstate) return;
            if (event.which === 13 || event.keyCode === 13) {
                $eXeDesafio.answerChallenge(instance);
                return false;
            }
            return true;
        });

        $('#desafioGameChallenges-' + instance).on('click touchstart', '.desafio-LinkChallenge', function (e) {
            e.preventDefault();
            if (!mOptions.gameStarted) {
                return;
            }
            var number = parseInt($(this).data('number'));
            $eXeDesafio.showChallenge(number, instance);

        });

        $('#desafioDesafio-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            if (mOptions.gameStarted) {
                $eXeDesafio.showDesafio(instance);
            };
        });
        $('#desafioRebootButton-' + instance).on('click touchstart', function (e) {

            e.preventDefault();
            if (window.confirm(mOptions.msgs.msgDesafioReboot)) {
                $eXeDesafio.rebootGame(instance);
            }

        });
        $('#desafioStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#desafioStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeDesafio.startGame(instance, 0);
        });
        $('#desafioSolutionButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var dstate = $('#desafioSolution-' + instance).prop('readonly');
            if (dstate) return;
            $eXeDesafio.answerChallenge(instance);
        });

        $('#desafioInstructions-' + instance).text(mOptions.instructions);
        $('#desafioPNumber-' + instance).text(mOptions.numberQuestions);
        $('#desafioInstruction-' + instance).text(mOptions.instructions);
        $('#desafioSendScore-' + instance).hide();
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        mOptions.gameOver = false;
        mOptions.counter = parseInt(mOptions.desafioTime) * 60;
        mOptions.activeChallenge = 0;
        if (typeof mOptions.desafioID != "undefined") {
            var dataDesafio = $eXeDesafio.getDataStorage(mOptions.desafioID);
            if (dataDesafio) {
                if (mOptions.desafioType != dataDesafio.desafioType || dataDesafio.numberChallenges != mOptions.challengesGame.length || dataDesafio.desafioTime != mOptions.desafioTime) {
                    localStorage.removeItem('dataDesafio-' + mOptions.desafioID);
                } else {
                    $eXeDesafio.reloadGame(instance, dataDesafio);
                }
            }
        }
        $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);
        $('#desafioSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#desafioSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeDesafio.updateScorm($eXeDesafio.previousScore, mOptions.repeatActivity, instance);
        }
        $('#desafioSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeDesafio.sendScore(false, instance);
            $eXeDesafio.saveEvaluation(instance);
            return true;
        });
        $eXeDesafio.updateEvaluationIcon(instance)
    },

    rebootGame: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        clearInterval(mOptions.counterClock);
        localStorage.removeItem('dataDesafio-' + mOptions.desafioID);
        mOptions.stateChallenges = $eXeDesafio.createArrayStateChallenges(mOptions.desafioType, mOptions.challengesGame.length);
        mOptions.gameOver = false;
        mOptions.counter = parseInt(mOptions.desafioTime) * 60;
        mOptions.activeChallenge = 0;
        localStorage.removeItem('dataDesafio-' + instance);
        mOptions.gameStarted = false;
        mOptions.started = false;
        mOptions.endGame = false;
        mOptions.desafioDate = "";
        mOptions.desafioSolved = false;
        mOptions.typeQuestion = 0;
        mOptions.solvedsChallenges = [];
        mOptions.timesShow = [];
        for (var i = 0; i < mOptions.challengesGame.length; i++) {
            mOptions.timesShow.push(10000000);
        }
        $eXeDesafio.startGame(instance, mOptions.typeQuestion, mOptions.activeChallenge);
    },
    showDesafio: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            message = mOptions.msgs.msgChallengesAllCompleted,
            type = 2;
        mOptions.typeQuestion = 0;
        mOptions.activeChallenge = 0;
        $('#desafioSolution-' + instance).prop('readonly', false);
        $('#desafioSolution-' + instance).val('');
        $("#desafioSolutionDiv-" + instance).show();
        $('#desafioTitle-' + instance).text(mOptions.desafioTitle);
        $('#desafioDescription-' + instance).show();
        $('#desafioFeedBacks-' + instance).hide();
        for (var i = 0; i < mOptions.stateChallenges.length; i++) {
            if (i < mOptions.challengesGame.length) {
                var mc = mOptions.stateChallenges[i];
                if (mc.state > 0) {
                    if (mc.solved == 0) {
                        mc.state = 1
                        type = 1;
                        $("#desafioSolution-" + instance).prop('readonly', true);
                        $("#desafioSolutionDiv-" + instance).hide();
                        message = mOptions.msgs.msgCompleteAllChallenged;
                    } else {
                        mc.state = 2
                    }
                }
            }
        }
        $eXeDesafio.showMessage(type, message, instance);
        $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);
        $('#desafioClues-' + instance).html('');
    },
    showChallenge: function (number, instance) {
        var mOptions = $eXeDesafio.options[instance],
            solution = mOptions.challengesGame[number].solution,
            title = mOptions.challengesGame[number].title,
            solved = mOptions.stateChallenges[number].solved,
            type = 0,
            message = mOptions.msgs.msgWriteChallenge;
        if (mOptions.stateChallenges[number].state == 0) {
            return;
        };
        if (mOptions.timesShow[number] == 10000000) {
            mOptions.timesShow[number] = mOptions.counter;
        }
        $eXeDesafio.changeStateButton(instance);
        $("#desafioSolutionDiv-" + instance).show();
        mOptions.typeQuestion = 1;
        mOptions.activeChallenge = number;
        mOptions.stateChallenges[number].state = 3;
        $('#desafioSolution-' + instance).prop('readonly', false);
        $('#desafioTitle-' + instance).text(title);
        $('#desafioFeedBacks-' + instance).show();
        var $chs = $('#desafioFeedBacks-' + instance).children('div');
        $chs.hide();
        $chs.eq(number).show();

        $('#desafioDescription-' + instance).hide();
        $('#desafioSolution-' + instance).val('');
        if (solved == 1) {
            $('#desafioSolution-' + instance).val(solution);
            $("#desafioSolution-" + instance).prop('readonly', true);
            type = 1;
            message = mOptions.msgs.msgSolvedChallenge;
        }
        $eXeDesafio.showMessage(type, message, instance);
        $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);
        $eXeDesafio.showClues(number, instance)
    },
    showClues(number, instance) {
        var mOptions = $eXeDesafio.options[instance],
            text = "";

        if (typeof mOptions.challengesGame[number].clueTimes != "undefined") {
            var tmp = mOptions.timesShow[number] - mOptions.counter;
            for (var i = 0; i < mOptions.challengesGame[number].clueTimes.length; i++) {
                if (mOptions.challengesGame[number].clueTimes[i] <= tmp) {
                    text += '<p><strong>' + mOptions.msgs.msgHelp + ' ' + (i + 1) + ': </strong>' + mOptions.challengesGame[number].clueTexts[i] + '</p>';
                }
            }
        }
        $('#desafioClues-' + instance).html(text);
    },

    saveDataStorage: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        if (typeof mOptions.desafioID == "undefined") return;
        if (mOptions.desafioDate == "") {
            mOptions.desafioDate = $eXeDesafio.getActualFullDate();
            $('#desafioDate-' + instance).text(mOptions.msgs.msgStartTime + ': ' + mOptions.desafioDate);
        }
        var data = {
            'desafioID': mOptions.desafioID,
            'started': mOptions.gameStarted || mOptions.gameOver,
            'endGame': mOptions.endGame,
            'desafioSolved': mOptions.desafioSolved,
            'counter': mOptions.counter,
            'desafioDate': mOptions.desafioDate,
            'desafioTime': mOptions.desafioTime,
            'activeChallenge': mOptions.activeChallenge,
            'desafioType': mOptions.desafioType,
            'numberChallenges': mOptions.challengesGame.length,
            'typeQuestion': mOptions.typeQuestion,
            'solvedsChallenges': mOptions.solvedsChallenges,
            'stateChallenges': mOptions.stateChallenges,
            'timesShow': mOptions.timesShow
        }
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeDesafio.initialScore === '') {
                var points = mOptions.desafioSolved ? mOptions.solvedsChallenges.length + 1 : mOptions.solvedsChallenges.length,
                    score = 10 * (points / (mOptions.challengesGame.length + 1));
                score = score.toFixed(2)
                $eXeDesafio.sendScore(true, instance);
                $('#desafioRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        localStorage.setItem('dataDesafio-' + mOptions.desafioID, JSON.stringify(data));
    },
    changeStateButton: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        for (var i = 0; i < mOptions.stateChallenges.length; i++) {
            if (mOptions.desafioType == 0) {
                if (i < mOptions.solvedsChallenges.length) {
                    mOptions.stateChallenges[i].state = 2;
                } else if (mOptions.solvedsChallenges.length < mOptions.stateChallenges.length) {
                    mOptions.stateChallenges[mOptions.solvedsChallenges.length].state = 1;
                }
            } else {
                if (mOptions.stateChallenges[i].state > 0) {
                    mOptions.stateChallenges[i].state = 1;
                    if (mOptions.stateChallenges[i].solved == 1) {
                        mOptions.stateChallenges[i].state = 2;
                    }
                }
            }

        }
    },
    getDataStorage: function (id) {
        var data = $eXeDesafio.isJsonString(localStorage.getItem('dataDesafio-' + id));
        return data;
    },

    showScoreGame: function (type, instance) {
        var mOptions = $eXeDesafio.options[instance],
            msgs = mOptions.msgs,
            $desafioHistGGame = $('#desafioHistGGame-' + instance),
            $desafioLostGGame = $('#desafioLostGGame-' + instance),
            $desafioOverPoint = $('#desafioOverScore-' + instance),
            $desafioGamerOver = $('#desafioGamerOver-' + instance),
            message = "",
            mtype = 2;
        $desafioHistGGame.hide();
        $desafioLostGGame.hide();
        $desafioOverPoint.show();
        switch (parseInt(type)) {
            case 0:
                message = $eXeDesafio.getRetroFeedMessages(true, instance) + ' ' + mOptions.msgs.msgDesafioSolved;
                $desafioHistGGame.show();
                break;
            case 1:
                mtype = 1;
                message = mOptions.msgs.msgEndTimeRestart;
                $desafioLostGGame.show();
                break;
            case 2:
                message = msgs.msgInformationLooking
                $desafioOverPoint.hide();
                break;
            default:
                break;
        }
        $eXeDesafio.showMessage(mtype, message, instance);
        $desafioOverPoint.text(msgs.msgChallengesCompleted + ': ' + mOptions.solvedsChallenges.length);
        $desafioGamerOver.show();
        $('#desafioDescription-' + instance).hide();

    },
    reloadGame: function (instance, dataDesafio) {
        var mOptions = $eXeDesafio.options[instance],
            colorMessge = 1;
        mOptions.started = dataDesafio.started;
        mOptions.counter = dataDesafio.counter;
        mOptions.activeChallenge = dataDesafio.activeChallenge;
        mOptions.desafioDate = dataDesafio.desafioDate;
        mOptions.typeQuestion = dataDesafio.typeQuestion;
        mOptions.endGame = dataDesafio.endGame;
        mOptions.desafioSolved = dataDesafio.desafioSolved;
        mOptions.stateChallenges = dataDesafio.stateChallenges;
        mOptions.solvedsChallenges = dataDesafio.solvedsChallenges;
        if (typeof dataDesafio.timesShow != "undefined") {
            mOptions.timesShow = dataDesafio.timesShow;
        }
        $('#desafioDate-' + instance).text(mOptions.msgs.msgStartTime + ': ' + dataDesafio.desafioDate);
        var ds = dataDesafio.desafioSolved ? 0 : 1;
        if (mOptions.endGame) {
            var message = mOptions.msgs.msgDesafioSolved,
                colorMessge = 2;

            if (!dataDesafio.desafioSolved) {
                message = mOptions.msgs.msgEndTimeRestart;
                colorMessge = 1;
            }
            $eXeDesafio.gameOver(ds, instance);
            $('#desafioStartGameDiv-' + instance).hide();
            $eXeDesafio.showMessage(colorMessge, message, instance);
        } else {
            $eXeDesafio.startGame(instance, mOptions.typeQuestion, mOptions.activeChallenge);
        }
    },
    startGame: function (instance, type, numberButton) {
        var mOptions = $eXeDesafio.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        var imgDesafio = "desafioicon0.png";
        imgDesafio = "url(" + $eXeDesafio.idevicePath + imgDesafio + ") no-repeat";
        $('desafioDesafio-' + instance).css({
            "background": imgDesafio,
            "background-size": "cover"
        });
        $('#desafioDescription-' + instance).show();
        $('#desafioTitle-' + instance).show();
        $('#desafioMultimedia-' + instance).hide();
        $('#desafioStartGameDiv-' + instance).hide();
        mOptions.gameActived = false;
        mOptions.gameStarted = false;
        $eXeDesafio.uptateTime(0, instance);
        $('#desafioGamerOver-' + instance).hide();
        if (type == 0) {
            var message = mOptions.msgs.msgReadTime;
            if (mOptions.solvedsChallenges.length >= mOptions.challengesGame.length) {
                var message = mOptions.msgs.msgChallengesAllCompleted;
            }
            $eXeDesafio.showDesafio(instance);
            $eXeDesafio.showMessage(2, message, instance);
        } else if (type == 1) {
            $eXeDesafio.showChallenge(numberButton, instance);

        }
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted) {
                mOptions.counter--;
                $eXeDesafio.uptateTime(mOptions.counter, instance);
                if (mOptions.counter <= 0) {
                    $eXeDesafio.gameOver(1, instance);
                }
                if (mOptions.typeQuestion == 1) {
                    var tmp = mOptions.timesShow[mOptions.activeChallenge] - mOptions.counter;
                    if (mOptions.challengesGame[mOptions.activeChallenge].clueTimes.indexOf(tmp) != -1) {
                        $eXeDesafio.showClues(mOptions.activeChallenge, instance);
                    }
                }
            }

        }, 1000);

        mOptions.gameStarted = true;
        mOptions.gameActived = true;
        $eXeDesafio.saveDataStorage(instance);
    },

    uptateTime: function (tiempo, instance) {
        var mTime = $eXeDesafio.getTimeToString(tiempo);
        $('#desafioPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mHours = Math.floor(parseInt(iTime) / 3600);
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mHours < 10 ? "0" + mHours : mHours) + ":" + (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeDesafio.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        clearInterval(mOptions.counterClock);
        $('#desafioTitle-' + instance).hide();
        $('#desafioDescription-' + instance).hide();
        $('#desafioSolutionDiv-' + instance).hide();
        $('#desafioMultimedia-' + instance).show();
        $('#desafioCover-' + instance).hide();
        $('#desafioImagen-' + instance).hide();
        $('#desafioFeedBacks-' + instance).hide();
        $('#desafioClues-' + instance).html('');

        var message = type === 0 ? mOptions.msgs.msgDesafioSolved : mOptions.msgs.msgEndTime;
        $eXeDesafio.showMessage(2, message, instance);
        $eXeDesafio.showScoreGame(type, instance);
        mOptions.gameOver = true;
        mOptions.endGame = true;

    },

    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeDesafio.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    answerChallenge: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            challengeGame = mOptions.challengesGame[mOptions.activeChallenge],
            active = mOptions.activeChallenge,
            answord = $('#desafioSolution-' + instance).val().toUpperCase(),
            message = "",
            typeMessage = 0;
        answord = answord.replace(/\s+/g, " ").trim();
        if (!mOptions.gameStarted) {
            return;
        }
        if (answord.length == 0) {
            $eXeDesafio.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
            return;
        }
        if (mOptions.typeQuestion == 0) {
            if ($eXeDesafio.checkWord(mOptions.desafioSolution, answord)) {
                message = $eXeDesafio.getRetroFeedMessages(true, instance) + mOptions.msgs.msgDesafioSolved;
                typeMessage = 1;
                mOptions.desafioSolved = true;
                $eXeDesafio.saveDataStorage(instance);
                $eXeDesafio.saveEvaluation(instance);
                $eXeDesafio.gameOver(0, instance);
                return;
            } else {
                message = $eXeDesafio.getRetroFeedMessages(false, instance) + mOptions.msgs.msgSolutionError;
                $('#desafioSolution-' + instance).val('');
                typeMessage = 0;
            }
        } else {
            if ($eXeDesafio.checkWord(challengeGame.solution, answord)) {
                typeMessage = 2;
                mOptions.stateChallenges[active].solved = 1;
                mOptions.solvedsChallenges.push(active);
                if (mOptions.desafioType == 0) {
                    if (active < mOptions.challengesGame.length - 1) {
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + mOptions.msgs.msgChallengeSolved;
                        $eXeDesafio.showChallenge(active, instance);
                    } else {
                        $eXeDesafio.showDesafio(instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + mOptions.msgs.msgChallengesAllCompleted;;
                        $('#desafioSolution-' + instance).val('');
                    }

                } else if (mOptions.desafioType == 1) {
                    if (mOptions.solvedsChallenges.length >= mOptions.challengesGame.length) {
                        $eXeDesafio.showDesafio(instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + mOptions.msgs.msgChallengesAllCompleted;
                        $('#desafioSolution-' + instance).val('');
                    } else {
                        $eXeDesafio.showChallenge(active, instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + mOptions.msgs.msgChallengeSolved;
                    }
                }
                $eXeDesafio.saveDataStorage(instance);
                $eXeDesafio.saveEvaluation(instance);
            } else {
                message = $eXeDesafio.getRetroFeedMessages(false, instance) + mOptions.msgs.msgSolutionCError;
                typeMessage = 1;
                $('#desafioSolution-' + instance).val('');
            }
        }

        $eXeDesafio.showMessage(typeMessage, message, instance);
    },
    showMessageAlert: function (tmsg) {
        window.alert(tmsg)
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeDesafio.borderColors.red, $eXeDesafio.borderColors.green, $eXeDesafio.borderColors.blue, $eXeDesafio.borderColors.yellow];
        var color = colors[type];
        $("#desafioPInformation-" + instance).text(message);
        $("#desafioPInformation-" + instance).css({
            'color': color,
            'font-weight': 'normal',
            'font-size': $eXeDesafio.fontSize
        });
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

    $eXeDesafio.init();


});