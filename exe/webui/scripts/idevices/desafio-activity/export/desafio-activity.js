/**
 * QuExt Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
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
    userName: '',
    scorm: '',
    previousScore: '',
    initialScore: '',
    msgs: '',
    hasSCORMbutton: false,
    fontSize: '18px',
    isInExe: false,
    init: function () {
        this.activities = $('.desafio-IDevice');
        if (this.activities.length == 0) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('QuExt') + '</p>');
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
    enable: function () {
        $eXeDesafio.loadGame();
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
        if ($eXeDesafio.mScorm) {
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
    sendScore: function (auto, instance) {
        var mOptions = $eXeDesafio.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeDesafio.mScorm != 'undefined') {
                if (!auto) {
                    $('#desafioSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeDesafio.previousScore !== '') {
                        message = $eXeDesafio.userName !== '' ? $eXeDesafio.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeDesafio.previousScore = score;
                        $eXeDesafio.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeDesafio.userName !== '' ? $eXeDesafio.userName + ', tu puntuación es :' + score : 'Tu puntuación es : ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#desafioSendScore-' + instance).hide();
                        }
                        $('#desafioRepeatActivity-' + instance).text(mOptions.msgs.msgSaveScoreButton + ': ' + score)
                        $('#desafioRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeDesafio.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeDesafio.mScorm.set("cmi.core.score.raw", score);
                    $('#desafioRepeatActivity-' + instance).text('Tu puntuación es : ' + score)
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
    loadGame: function () {
        $eXeDesafio.options = [];
        $eXeDesafio.activities.each(function (i) {
            var dl = $(".desafio-DataGame", this),
                mOption = $eXeDesafio.loadDataGame(dl),
                msg = mOption.msgs.msgPlayStart;
            mOption.desafioDescription = $(".desafio-Description", this).eq(0).html();
            $('.desafio-ChallengeDescription', this).each(function (i) {
                mOption.challengesGame[i].description = $(this).html();
            })
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
            $eXeDesafio.addEvents(i);
        });

    },
    createInterfaceQuExt: function (instance) {
        var html = '',
            path = $eXeDesafio.idevicePath,
            msgs = $eXeDesafio.options[instance].msgs;
        html += '<div class="desafio-MainContainer">\
                <div class="desafio-GameMinimize" id="desafioGameMinimize-' + instance + '">\
                    <a href="#" class="desafio-LinkMaximize" id="desafioLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'desafioIcon.png" class="desafio-Icons desafio-IconMinimize" alt="Mostrar actividad">\
                        <div class="desafio-MessageMaximize" id="desafioMessageMaximize-' + instance + '"></div>\
                    </a>\
                </div>\
                <div class="desafio-GameContainer" id="desafioGameContainer-' + instance + '">\
                    <div class="desafio-GameScoreBoard">\
                        <div class="desafio-GameChallenges" id="desafioGameChallenges-' + instance + '">\
                            <a href="#" class="desafio-LinkDesafio" id="desafioDesafio-' + instance + '" title="Desafio">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="desafio-GameDesafio"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="0" id="desafioLink0-' + instance + '" title="Reto 1">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C0"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="1" id="desafioLink1-' + instance + '" title="Reto 2">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C1"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="2" id="desafioLink2-' + instance + '" title="Reto 3">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C2"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="3" id="desafioLink3-' + instance + '" title="Reto 4">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C3"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="4"  id="desafioLink4-' + instance + '" title="Reto 5">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C4"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="5"  id="desafioLink5-' + instance + '" title="Reto 6">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C5"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="6" id="desafioLink6-' + instance + '" title="Reto 7">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C6"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="7"  id="desafioLink7-' + instance + '" title="Reto 8">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C7"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="8" id="desafioLink8-' + instance + '" title="Reto 9">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C8"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkChallenge" data-number="9" id="desafioLink9-' + instance + '" title="Reto 10">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextRetos exeQuextRetos-C9"></div>\
                            </a>\
                        </div>\
                        <div class="desafio-TimeNumber">\
                            <div class="desafio-TimeQuestion">\
                                <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                                <div class="exeQuextIcons34  exeQuextIcons34-Time"></div>\
                                <p id="desafioPTime-' + instance + '">00:00</p>\
                            </div>\
                            <a href="#" class="desafio-LinkMinimize" id="desafioLinkMinimize-' + instance + '" title="Minimizar">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextIcons34 exeQuextIcons34-Minimize"></div>\
                            </a>\
                            <a href="#" class="desafio-LinkFullScreen" id="desafioLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                                <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                                <div class="exeQuextIcons34 exeQuextIcons34-FullScreen" id="desafioFullScreen-' + instance + '">\
                                </div>\
                            </a>\
                        </div>\
                    </div>\
                    <div class="desafio-ShowClue" id="desafioShowClue-' + instance + '">\
                        <div class="sr-av">' + msgs.msgClue + ':</div>\
                        <p class="desafio-PShowClue" id="desafioPShowClue-' + instance + '"></p>\
                    </div>\
                    <div class="desafio-Multimedia" id="desafioMultimedia-' + instance + '">\
                        <img class="desafio-Cursor" id="desafioCursor-' + instance + '" src="' + path + 'desafioCursor.gif" alt="Cursor" />\
                        <img  src="" class="desafio-Images" id="desafioImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                        <img src="' + path + 'desafioHome.png" class="desafio-Images" id="desafioCover-' + instance + '" alt="' + msgs.msImage + '" />\
                        <div class="desafio-GameOver" id="desafioGamerOver-' + instance + '">\
                            <div class="desafio-TextClueGGame" id="desafioTextClueGGame-' + instance + '"></div>\
                            <div class="desafio-DataImageGameOver">\
                                <img src="' + path + 'quextGameWon.png" class="desafio-HistGGame" id="desafioHistGGame-' + instance + '" alt="' + msgs.mgsAllQuestions + '" />\
                                <img src="' + path + 'quextGameLost.png" class="desafio-LostGGame" id="desafioLostGGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                                <div class="desafio-DataGame" id="desafioDataGame-' + instance + '">\
                                    <p id="desafioOverScore-' + instance + '">Score: 0</p>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="desafio-Title" id="desafioTitle-' + instance + '"></div>\
                    <div class="desafio-Description" id="desafioDescription-' + instance + '"></div>\
                    <div class="desafio-MessageInfo" id="desafioMessageInfo-' + instance + '">\
                    <div class="sr-av">Information</div>\
                    <p id="desafioPInformation-' + instance + '"></p>\
                    </div>\
                    <div class="desafio-SolutionDiv" id="desafioSolutionDiv-' + instance + '">\
                        <label>Solution:<input type="text" class="desafio-Solution"  id="desafioSolution-' + instance + '"></label>\
                        <input type="button" class="desafio-SolutionButton" id="desafioSolutionButton-' + instance + '"   value="' + msgs.msgSubmit + '" />\
                    </div>\
                    <div class="desafio-CodeAccessDiv" id="desafioCodeAccessDiv-' + instance + '">\
                        <div class="desafio-MessageCodeAccessE" id="desafioMesajeAccesCodeE-' + instance + '"></div>\
                        <div class="desafio-DataCodeAccessE">\
                            <label>' + msgs.msgCodeAccess + ':</label><input type="text" class="desafio-CodeAccessE"  id="desafioCodeAccessE-' + instance + '">\
                            <input type="button" class="desafio-CodeAccessButton" id="desafioCodeAccessButton-' + instance + '"   value="' + msgs.msgSubmit + '" />\
                        </div>\
                    </div>\
                    <div class="desafio-StartGameDiv" id="desafioStartGameDiv-' + instance + '">\
                        <a href="#" class="desafio-StartGame"  id="desafioStartGame-' + instance + '" title="Comenzar">Pulsa aquí para comenzar</a>\
                    </div>\
                    <div class="desafio-DateDiv" id="desafioDateDiv-' + instance + '">\
                        <p class="desafio-Date"  id="desafioDate-' + instance + '">Fecha:</p>\
                        <a href="#" class="desafio-LinkReboot" id="desafioRebootButton-' + instance + '" title="Reiniciar">\
                            <strong><span class="sr-av">Reiniciar:</span></strong>\
                                <div class="desafio-RebootImg exeDesafio-IconReboot"></div>\
                        </a>\
                    </div>\
                </div>\
            </div>\
    ' + this.addButtonScore(instance);
        return html;
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



    addButtonScore: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        var butonScore = "";
        var fB = '<div class="desafio-BottonContainer">';
        if (mOptions.isScorm == 2) {
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
        } else if (mOptions.isScorm == 1) {
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
    loadDataGame: function (data) {
        var json = data.text(),
            mOptions = $eXeDesafio.isJsonString(json);
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
        mOptions.stateChallenges = $eXeDesafio.createArrayStateChallenges(mOptions.desafioType, mOptions.challengesGame.length);
        return mOptions;
    },
    changeImageButtonState: function (instance, type) {
        var mOptions = $eXeDesafio.options[instance],
            imgDesafio = "desafioIcon0.png";
        if (type == 0) {
            imgDesafio = "desafioIcon1.png";
        }
        imgDesafio = "url(" + $eXeDesafio.idevicePath + imgDesafio + ") no-repeat 0 0";
        $('#desafioDesafio-' + instance).find(".desafio-GameDesafio").css({
            "background": imgDesafio
        })
        var $buttonChalleng = $('#desafioGameChallenges-' + instance).find('.desafio-LinkChallenge')
        $buttonChalleng.each(function (i) {
            if (i < mOptions.stateChallenges.length) {
                var state = mOptions.stateChallenges[i].state,
                    left = (-34 * i) + "px",
                    top = (-34 * state) + 'px';
                mcss = "url(" + $eXeDesafio.idevicePath + "exeRetosIcons.png) no-repeat " + left + " " + top;
                $(this).find(".exeQuextRetos").css({
                    "background": mcss
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
            $eXeDesafio.endScorm();
            if (mOptions.gameStarted || mOptions.gameOver) {
               $eXeDesafio.saveDataStorage(instance);
            }
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
        $('#desafioSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeDesafio.sendScore(false, instance);
        });
        $('#desafioGamerOver-' + instance).hide();
        $('#desafioCodeAccessDiv-' + instance).hide();
        $('#desafioVideo-' + instance).hide();
        $('#desafioImagen-' + instance).hide();
        $('#desafioCursor-' + instance).hide();
        $('#desafioCover-' + instance).show();
        $('#desafioCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeDesafio.enterCodeAccess(instance);
        });
        $('#desafioCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeDesafio.enterCodeAccess(instance);
                return false;
            }
            return true;
        });

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
            if (window.confirm("Esto reiniciará el juego y modificará su hora de inicio. ¿Deseas continuar?")) {
                $eXeDesafio.rebootGame(instance);
            }

        });
        $('#desafioStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#desafioStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
             $eXeDesafio.startGame(instance,0);
        });
        $('#desafioSolutionButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var dstate = $('#desafioSolution-' + instance).prop('readonly');
            if (dstate) return;
            $eXeDesafio.answerChallenge(instance);
        });
        $("#desafioLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('desafioGameContainer-' + instance);
            $eXeDesafio.toggleFullscreen(element, instance);
        });
        $('#desafioInstructions-' + instance).text(mOptions.instructions);
        $('#desafioPNumber-' + instance).text(mOptions.numberQuestions);
        if (mOptions.itinerary.showCodeAccess) {
            $('#desafioMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#desafioMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#desafioCodeAccessDiv-' + instance).show();
            $('#desafioStartGameDiv-' + instance).hide();
        }
        $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function (e) {
            var fullScreenElement =
                document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            $eXeDesafio.maximizeMultimedia(typeof fullScreenElement != "undefined", instance);
        });
        $('#desafioInstruction-' + instance).text(mOptions.instructions);
        $('#desafioSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#desafioSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeDesafio.updateScorm($eXeDesafio.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#desafioShowClue-' + instance).hide();
        mOptions.gameOver = false;
        mOptions.counter = parseInt(mOptions.desafioTime) * 60;
        mOptions.activeChallenge = 0;
        var dataDesafio = $eXeDesafio.getDataStorage(instance);
         if (dataDesafio) {
             if (mOptions.desafioType != dataDesafio.desafioType || dataDesafio.numberChallenges != mOptions.challengesGame.length || dataDesafio.desafioTime != mOptions.desafioTime) {
                localStorage.removeItem('dataDesafio-' + instance);
             } else {
                $eXeDesafio.reloadGame(instance, dataDesafio);
             }
         }

    },

    rebootGame: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        clearInterval(mOptions.counterClock);
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
        mOptions.solvedsChallenges=[];
        $eXeDesafio.startGame(instance, mOptions.typeQuestion, mOptions.activeChallenge);
    },
    showDesafio: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            message = '¡Genial! Has completado todos los retos. Resuelve ahora este desafío',
            type = 2;
        mOptions.typeQuestion = 0;
        mOptions.activeChallenge = 0;
        $('#desafioSolution-' + instance).prop('readonly', false);
        $('#desafioSolution-' + instance).val('');
        $("#desafioSolutionDiv-" + instance).show();
        $('#desafioTitle-' + instance).text(mOptions.desafioTitle);
        $('#desafioDescription-' + instance).html(mOptions.desafioDescription);
        for (var i = 0; i < mOptions.stateChallenges.length; i++) {
            if (i < mOptions.challengesGame.length) {
                var mc = mOptions.stateChallenges[i];
                if (mc.state > 0) {
                    if (mc.solved == 0) {
                        mc.state = 1
                        type = 1;
                        $("#desafioSolution-" + instance).prop('readonly', true);
                        $("#desafioSolutionDiv-" + instance).hide();
                        message = 'Debes completar todos los retos antes de resolver el desafío';
                    } else {
                        mc.state = 2
                    }
                }
            }
        }
        $eXeDesafio.showMessage(type, message, instance);
        $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);

    },
    showChallenge: function (number, instance) {
        var mOptions = $eXeDesafio.options[instance],
            solution = mOptions.challengesGame[number].solution,
            description = mOptions.challengesGame[number].description,
            title = mOptions.challengesGame[number].title,
            solved = mOptions.stateChallenges[number].solved,
            type = 0,
            message = 'Resuelve este reto  e indica su solución';
        if (mOptions.stateChallenges[number].state == 0) {
            return;
        };
        $eXeDesafio.changeStateButton(instance);
        $("#desafioSolutionDiv-" + instance).show();
        mOptions.typeQuestion = 1;
        mOptions.activeChallenge = number;
        mOptions.stateChallenges[number].state = 3;
        $('#desafioSolution-' + instance).prop('readonly', false);
        $('#desafioTitle-' + instance).text(title);
        $('#desafioDescription-' + instance).html(description);
        $('#desafioSolution-' + instance).val('');
        if (solved == 1) {
            $('#desafioSolution-' + instance).val(solution);
            $("#desafioSolution-" + instance).prop('readonly', true);
            type = 1;
            message = 'Ya has completado este reto';
        }
        $eXeDesafio.showMessage(type, message, instance);
        $eXeDesafio.changeImageButtonState(instance, mOptions.typeQuestion);
    },

    saveDataStorage: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        if (mOptions.desafioDate == "") {
            mOptions.desafioDate = $eXeDesafio.getActualFullDate();
            $('#desafioDate-' + instance).text('Inicio desafio: ' + mOptions.desafioDate);
        }

        var data = {
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
            'stateChallenges':mOptions.stateChallenges
        }
        localStorage.setItem('dataDesafio-' + instance, JSON.stringify(data));
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
    getDataStorage: function (instance) {
        var data = $eXeDesafio.isJsonString(localStorage.getItem('dataDesafio-' + instance));
        return data;
    },
    maximizeMultimedia: function (maximize, instance) {
        var css = {
            "height": "315px",
            "width": "560px",
            "margin": "auto"
        };
        $eXeDesafio.fontSize = "18px";
        if (maximize) {
            var h = window.innerHeight - 365 > 750 ? 750 : window.innerHeight - 365;
            h = window.innerHeight <= 768 ? window.innerHeight - 345 : h;
            var p = (h / 315),
                w = p * 560;
            css = {
                "height": h + 'px',
                "width": w + 'px',
                "margin": "auto"
            };
            p = p > 1.5 ? 1.5 : p;
            hQ = 45 * p;
            $eXeDesafio.fontSize = "24px";
        }
        $('#desafioMultimedia-' + instance).css(css);
        $eXeDesafio.refreshImageActive(instance);
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            mQuextion = mOptions.challengesGame[mOptions.activeChallenge];
        $("#desafioCover-" + instance).prop('src', $eXeDesafio.idevicePath + 'desafioHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error loading image');
                } else {
                    var mData = $eXeDesafio.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeDesafio.drawImage(this, mData);

                }
            });
        if (typeof mQuextion == "undefined") {
            return;
        }
        if (mQuextion.type === 1) {
            $("#desafioImagen-" + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = mOptions.msgs.msgNoImage;
                    } else {
                        var mData = $eXeDesafio.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeDesafio.drawImage(this, mData);
                        $('#desafioImagen-' + instance).show();
                        $('#desafioCover-' + instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#desafioCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                        }
                    }
                });
            $('#desafioImagen-' + instance).attr('alt', mQuextion.alt);
        }
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
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeDesafio.options[instance];
        if (mOptions.itinerary.codeAccess === $('#desafioCodeAccessE-' + instance).val()) {
            $('#desafioCodeAccessDiv-' + instance).hide();
            $eXeDesafio.startGame(instance, mOptions.typeQuestion, mOptions.activeChallenge);
        } else {
            $('#desafioMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#desafioCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeDesafio.options[instance],
            msgs = mOptions.msgs,
            $desafioHistGGame = $('#desafioHistGGame-' + instance),
            $desafioLostGGame = $('#desafioLostGGame-' + instance),
            $desafioClueGGame = $('#desafioClueGGame-' + instance),
            $desafioOverPoint = $('#desafioOverScore-' + instance),
            $desafioTextClueGGame = $('#desafioTextClueGGame-' + instance),
            $desafioGamerOver = $('#desafioGamerOver-' + instance),
            message = "",
            mtype = 2;
        $desafioHistGGame.hide();
        $desafioLostGGame.hide();
        $desafioClueGGame.hide();
        $desafioOverPoint.show();
        $desafioTextClueGGame.hide();
        switch (parseInt(type)) {
            case 0:
                message = $eXeDesafio.getRetroFeedMessages(true, instance) + ' Has resuelto el desafío. Pulsa sobre el botón reiniciar para una nueva partida';
                $desafioHistGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        message = msgs.mgsAllQuestions;
                        $desafioTextClueGGame.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $desafioTextClueGGame.show();
                    } else {
                        $desafioTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $desafioTextClueGGame.show();
                    }
                }
                break;
            case 1:
                mtype = 1;
                message = '¡Lo siento! Tu tiempo ha finalizado y no has resuelto el desafío. Pulsa sobre el botón reiniciar para intentarlo de nuevo';
                $desafioLostGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        $desafioTextClueGGame.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $desafioTextClueGGame.show();
                    } else {
                        $desafioTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $desafioTextClueGGame.show();
                    }
                }
                break;
            case 2:
                message = msgs.msgInformationLooking
                $desafioOverPoint.hide();
                $desafioClueGGame.show();
                $desafioTextClueGGame.text(mOptions.itinerary.clueGame);
                $desafioTextClueGGame.show();
                break;
            default:
                break;
        }
        $('#desafioShowClue-' + instance).hide();
        $eXeDesafio.showMessage(mtype, message, instance);
        $desafioOverPoint.text('Retos completados: ' + $eXeDesafio.getSolvedChallenges(instance));
        $desafioGamerOver.show();
        $('#desafioDescription-' + instance).hide();

    },
    getSolvedChallenges: function (instance) {
        var mOptions = $eXeDesafio.options[instance],
            $buttonChalleng = $('#desafioGameChallenges-' + instance).find('.desafio-LinkChallenge'),
            numSolved = 0;

        $buttonChalleng.each(function (i) {
            if (i < mOptions.challengesGame.length) {
                var solved = parseInt($(this).data('solved'))
                if (solved == 1) {
                    numSolved++;
                }
            }
        });
        return numSolved;

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
        mOptions.solvedsChallenges=dataDesafio.solvedsChallenges;
        console.log('estados',mOptions.stateChallenges)
        console.log('solucionados',mOptions.solvedsChallenges)
        console.log('activo',mOptions.activeChallenge)
        $('#desafioDate-' + instance).text('Inicio desafio: ' + dataDesafio.desafioDate);
        var ds = dataDesafio.desafioSolved ? 0 : 1;
        if (mOptions.endGame) {
            var message = 'Has resuelto el desafío. Pulsa sobre reiniciar para nueva partida',
                colorMessge = 2;

            if (!dataDesafio.desafioSolved) {
                message = "Tu tiempo ha finalizado y no has resuelta el desafío. Pulsa sobre reiniciar para intentarlo de nuevo";
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
        var imgDesafio = "desafioIcon0.png";
        imgDesafio = "url(" + $eXeDesafio.idevicePath + imgDesafio + ") no-repeat 0 0";
        $('desafioDesafio-' + instance).css({
            "background": imgDesafio
        });
        $('#desafioDescription-' + instance).show();
        $('#desafioTitle-' + instance).show();
        mOptions.obtainedClue = false;
        $('#desafioShowClue-' + instance).hide();
        $('#desafioPShowClue-' + instance).text("");
        $('#desafioMultimedia-' + instance).hide();
        $('#desafioStartGameDiv-' + instance).hide();
        mOptions.gameActived = false;
        mOptions.gameStarted = false;
        $eXeDesafio.uptateTime(0, instance);
        $('#desafioGamerOver-' + instance).hide();

        if (type == 0) {
            var message = 'Lee el desafío y, cuando estés listo, haz clic sobre un reto para jugar';
            if ($eXeDesafio.getSolvedChallenges(instance) >= mOptions.challengesGame.length) {
                var message = 'Has resuelto todos los retos. Completa ahora el desafío';
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
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
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
        var message = type === 0 ? "!Genial! Has resuelto este desafío. Pulsa reiniciar para nueva partida" : "!Lo siento! El tiempo ha finalizado.  Pulsa reiniciar para nueva partida";
        $eXeDesafio.showMessage(2, message, instance);
        $eXeDesafio.showScoreGame(type, instance);
        //$('#desafioStartGame-' + instance).text(mOptions.msgs.msgNewGame);
        //$('#desafioStartGameDiv-' + instance).show();
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeDesafio.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeDesafio.sendScore(true, instance);
                $('#desafioRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeDesafio.initialScore = score;
            }
        }
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
            solution = "",
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
            solution = ((mOptions.desafioSolution).toUpperCase()).replace(/\s+/g, " ").trim()
            if (answord == solution) {
                message = $eXeDesafio.getRetroFeedMessages(true, instance) + 'Has resuelto este desafío. Eres el mejor';
                typeMessage = 1;
                mOptions.desafioSolved = true;
                $eXeDesafio.saveDataStorage(instance);
                $eXeDesafio.gameOver(0, instance);
                return;
            } else {
                message = $eXeDesafio.getRetroFeedMessages(false, instance) + 'La solución al desafío no es correcta';
                $('#desafioSolution-' + instance).val('');
                typeMessage = 0;
            }
        } else {
            solution = ((challengeGame.solution).toUpperCase()).replace(/\s+/g, " ").trim()
            if (answord == solution) {
                typeMessage = 2;
                mOptions.stateChallenges[active].solved = 1;
                mOptions.solvedsChallenges.push(active);
                if (mOptions.desafioType == 0) {
                    if (active < mOptions.challengesGame.length - 1) {
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + '¡Has resuelto este reto! ¡Selecciona otro!';
                        $eXeDesafio.showChallenge(active,instance);
                    } else {
                        $eXeDesafio.showDesafio(instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + '¡Has resuelto todos los retos! ¡Completa el desafío!';
                        $('#desafioSolution-' + instance).val('');
                    }

                } else if (mOptions.desafioType == 1) {
                    if ($eXeDesafio.getSolvedChallenges(instance) >= mOptions.challengesGame.length) {
                        $eXeDesafio.showDesafio(instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + '¡Has resuelto todos los retos! ¡Completa el desafío!';
                        $('#desafioSolution-' + instance).val('');
                    } else {
                        $eXeDesafio.showChallenge(active,instance);
                        message = $eXeDesafio.getRetroFeedMessages(true, instance) + '¡Has resuelto este reto! ¡Selecciona otro!';
                    }
                }
                $eXeDesafio.saveDataStorage(instance);
            } else {
                message = $eXeDesafio.getRetroFeedMessages(false, instance) + 'La solución no es correcta';
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
        color = colors[type];
        $("#desafioPInformation-" + instance).text(message);
        $("#desafioPInformation-" + instance).css({
            'color': color,
            'font-weight': 'bold',
            'font-size': $eXeDesafio.fontSize
        });
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
        var mOptions = $eXeDesafio.options[instance],
            alt = mOptions.msgs.msgFullScreen;
        element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $('#desafioFullScreen-' + instance).removeClass('exeQuextIcons34-FullScreen');
            $('#desafioFullScreen-' + instance).addClass('exeQuextIcons34-FullScreenExit');
            alt = mOptions.msgs.msgExitFullScreen;
            $eXeDesafio.getFullscreen(element);
        } else {
            $('#desafioFullScreen-' + instance).addClass('exeQuextIcons34-FullScreen');
            $('#desafioFullScreen-' + instance).removeClass('exeQuextIcons34-FullScreenExit');
            $eXeDesafio.exitFullscreen(element);
        }
        $('#desafioLinkFullScreen-' + instance).find('span').text(alt + ':')
        $('#desafioLinkFullScreen-' + instance).attr('title', alt);
    },
}
$(function () {

    $eXeDesafio.init();
});