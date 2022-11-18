/**
 * Select Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeSelecciona = {
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
    videos: [],
    video: {
        player: '',
        duration: 0,
        id: ''
    },
    player: '',
    playerIntro: '',
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
        this.activities = $('.selecciona-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeSelecciona.supportedBrowser('selecciona')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Multiple Choice Quiz') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/selecciona-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeSelecciona.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeSelecciona.enable()');
        else this.enable();
        $eXeSelecciona.mScorm = scorm;
        var callSucceeded = $eXeSelecciona.mScorm.init();
        if (callSucceeded) {
            $eXeSelecciona.userName = $eXeSelecciona.getUserName();
            $eXeSelecciona.previousScore = $eXeSelecciona.getPreviousScore();
            $eXeSelecciona.mScorm.set("cmi.core.score.max", 10);
            $eXeSelecciona.mScorm.set("cmi.core.score.min", 0);
            $eXeSelecciona.initialScore = $eXeSelecciona.previousScore;
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

    enable: function () {
        $eXeSelecciona.loadGame();
    },
    getUserName: function () {
        var user = $eXeSelecciona.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeSelecciona.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        if ($eXeSelecciona.mScorm && typeof $eXeSelecciona.mScorm.quit == "function") {
            $eXeSelecciona.mScorm.quit();
        }

    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            text = '';
        $('#seleccionaSendScore-' + instance).hide();
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
            $('#seleccionaSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#seleccionaSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#seleccionaRepeatActivity-' + instance).text(text);
        $('#seleccionaRepeatActivity-' + instance).fadeIn(1000);
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            message = '',
            score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
        if (mOptions.order == 2) {
            score = mOptions.score / 10;
        }
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeSelecciona.mScorm != 'undefined') {
                if (!auto) {
                    $('#seleccionaSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeSelecciona.previousScore !== '') {
                        message = $eXeSelecciona.userName !== '' ? $eXeSelecciona.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeSelecciona.previousScore = score;
                        $eXeSelecciona.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeSelecciona.userName !== '' ? $eXeSelecciona.userName + '. ' + mOptions.msgs.msgYouScore + ': ' + score : mOptions.msgs.msgYouScore + ': ' + score
                        if (!mOptions.repeatActivity) {
                            $('#seleccionaSendScore-' + instance).hide();
                        }
                        $('#seleccionaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score)
                        $('#seleccionaRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeSelecciona.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeSelecciona.mScorm.set("cmi.core.score.raw", score);
                    $('#seleccionaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score)
                    $('#seleccionaRepeatActivity-' + instance).show();
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
        $eXeSelecciona.options = [];
        $eXeSelecciona.activities.each(function (i) {
            var version = $(".selecciona-version", this).eq(0).text(),
                dl = $(".selecciona-DataGame", this),
                imagesLink = $('.selecciona-LinkImages', this),
                audioLink = $('.selecciona-LinkAudios', this),
                mOption = $eXeSelecciona.loadDataGame(dl, imagesLink, audioLink, version),
                msg = mOption.msgs.msgPlayStart;

            $eXeSelecciona.options.push(mOption);
            var selecciona = $eXeSelecciona.createInterfaceSelecciona(i);
            dl.before(selecciona).remove();
            $('#seleccionaGameMinimize-' + i).hide();
            $('#seleccionaGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#seleccionaGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#seleccionaGameContainer-' + i).show();
            }
            $('#seleccionaMessageMaximize-' + i).text(msg);
            $('#seleccionaDivFeedBack-' + i).prepend($('.selecciona-feedback-game', this));
            $eXeSelecciona.addEvents(i);
            $('#seleccionaDivFeedBack-' + i).hide();
            if (mOption.order == 2) {
                $('#seleccionaGameContainer-' + i).find('.exeQuextIcons-Number').hide();
                $('#seleccionaPNumber-' + i).hide();
            }

        });
        if ($eXeSelecciona.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeSelecciona.loadMathJax();
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
    createInterfaceSelecciona: function (instance) {
        var html = '',
            path = $eXeSelecciona.idevicePath,
            msgs = $eXeSelecciona.options[instance].msgs;
        html += '<div class="gameQP-MainContainer">\
        <div class="gameQP-GameMinimize" id="seleccionaGameMinimize-' + instance + '">\
            <a href="#" class="gameQP-LinkMaximize" id="seleccionaLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'seleccionaIcon.png" class="gameQP-IconMinimize gameQP-Activo" alt="">\
            <div class="gameQP-MessageMaximize" id="seleccionaMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="gameQP-GameContainer" id="seleccionaGameContainer-' + instance + '">\
            <div class="gameQP-GameScoreBoard">\
                <div class="gameQP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="seleccionaPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="seleccionaPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="seleccionaPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="seleccionaPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="gameQP-LifesGame" id="seleccionaLifesGame-' + instance + '">\
                    <strong class="sr-av">' + msgs.msgLive + ':</strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + ':</strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + ':</strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + ':</strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + ':</strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                </div>\
                <div class="gameQP-NumberLifesGame" id="seleccionaNumberLivesGame-' + instance + '">\
                    <strong class="sr-av">' + msgs.msgLive + ':</strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="seleccionaPLifes-' + instance + '">0</p>\
                </div>\
                <div class="gameQP-TimeNumber">\
                    <strong class="sr-av">' + msgs.msgTime + ':</strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
                    <p id="seleccionaPTime-' + instance + '" class="gameQP-PTime">00:00</p>\
                    <a href="#" class="gameQP-LinkMinimize" id="seleccionaLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong class="sr-av">' + msgs.msgMinimize + ':</strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize gameQP-Activo"></div>\
                    </a>\
                    <a href="#" class="gameQP-LinkFullScreen" id="seleccionaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong class="sr-av">' + msgs.msgFullScreen + ':</strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen gameQP-Activo" id="seleccionaFullScreen-' + instance + '"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="gameQP-ShowClue" id="seleccionaShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="gameQP-PShowClue gameQP-parpadea" id="seleccionaPShowClue-' + instance + '"></p>\
            </div>\
            <div class="gameQP-Multimedia" id="seleccionaMultimedia-' + instance + '">\
                <img class="gameQP-Cursor" id="seleccionaCursor-' + instance + '" src="' + path + 'exequextcursor.gif" alt="" />\
                <img  src="" class="gameQP-Images" id="seleccionaImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <div class="gameQP-EText" id="seleccionaEText-' + instance + '"></div>\
                <img src="' + path + 'seleccionaHome.png" class="gameQP-Cover" id="seleccionaCover-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <div class="gameQP-Video" id="seleccionaVideo-' + instance + '"></div>\
                <div class="gameQP-Protector" id="seleccionaProtector-' + instance + '"></div>\
                <a href="#" class="gameQP-LinkAudio" id="seleccionaLinkAudio-' + instance + '" title="' + msgs.msgAudio + '"><img src="' + path + 'exequextaudio.png" class="gameQP-Activo" alt="' + msgs.msgAudio + '">\</a>\
                <div class="gameQP-GameOver" id="seleccionaGamerOver-' + instance + '">\
                        <div class="gameQP-DataImage">\
                            <img src="' + path + 'exequextwon.png" class="gameQP-HistGGame" id="seleccionaHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                            <img src="' + path + 'exequextlost.png" class="gameQP-LostGGame" id="seleccionaLostGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                        </div>\
                        <div class="gameQP-DataScore">\
                            <p id="seleccionaOverScore-' + instance + '"><strong>Score:</strong> 0</p>\
                            <p id="seleccionaOverHits-' + instance + '"><strong>Hits:</strong> 0</p>\
                            <p id="seleccionaOverErrors-' + instance + '"><strong>Errors:</strong> 0</p>\
                        </div>\
                </div>\
            </div>\
            <div class="gameQP-AuthorLicence" id="seleccionaAuthorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="seleccionaPAuthor-' + instance + '"></p>\
            </div>\
            <div class="sr-av" id="seleccionaStartGameSRAV-' + instance + '">' + msgs.msgPlayStart + ':</div>\
            <div class="gameQP-StartGame"><a href="#" id="seleccionaStartGame-' + instance + '"></a></div>\
            <div class="gameQP-QuestionDiv" id="seleccionaQuestionDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="gameQP-Question" id="seleccionaQuestion-' + instance + '"></div>\
                <div class="gameQP-OptionsDiv" id="seleccionaOptionsDiv-' + instance + '">\
                    <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                    <a href="#" class="gameQP-Option1 gameQP-Options" id="seleccionaOption1-' + instance + '" data-number="0"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                    <a href="#" class="gameQP-Option2 gameQP-Options" id="seleccionaOption2-' + instance + '" data-number="1"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                    <a href="#" class="gameQP-Option3 gameQP-Options" id="seleccionaOption3-' + instance + '" data-number="2"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                    <a href="#" class="gameQP-Option4 gameQP-Options" id="seleccionaOption4-' + instance + '" data-number="3"></a>\
                </div>\
            </div>\
            <div class="gameQP-WordsDiv" id="seleccionaWordDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgAnswer + ':</div>\
                <div class="gameQP-Prhase" id="seleccionaEPhrase-' + instance + '"></div>\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="gameQP-Definition" id="seleccionaDefinition-' + instance + '"></div>\
                <div class="gameQP-DivReply" id="seleccionaDivResponder-' + instance + '">\
                    <input type="text" value="" class="gameQP-EdReply" id="seleccionaEdAnswer-' + instance + '" autocomplete="off">\
                    <a href="#" id="seleccionaBtnReply-' + instance + '" title="' + msgs.msgAnswer + '">\
                        <strong class="sr-av">' + msgs.msgAnswer + '</strong>\
                        <div class="exeQuextIcons-Submit gameQP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="gameQP-BottonContainerDiv" id="seleccionaBottonContainer-' + instance + '">\
                <a href="#" class="gameQP-LinkVideoIntroShow" id="seleccionaLinkVideoIntroShow-' + instance + '" title="' + msgs.msgVideoIntro + '">\
                    <strong class="sr-av">' + msgs.msgVideoIntro + ':</strong>\
                    <div class="exeQuextIcons exeQuextIcons-Video"></div>\
                </a>\
                <div class="gameQP-AnswersDiv" id="seleccionaAnswerDiv-' + instance + '">\
                    <div class="gameQP-Answers" id="seleccionaAnswers-' + instance + '"></div>\
                    <a href="#" id="seleccionaButtonAnswer-' + instance + '" title="' + msgs.msgAnswer + '">\
                        <strong class="sr-av">' + msgs.msgAnswer + '</strong>\
                        <div class="exeQuextIcons-Submit gameQP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
             <div class="gameQP-VideoIntroDiv" id="seleccionaVideoIntroDiv-' + instance + '">\
                <div class="gameQP-VideoIntro" id="seleccionaVideoIntro-' + instance + '"></div>\
                <input type="button" class="gameQP-VideoIntroClose" id="seleccionaVideoIntroClose-' + instance + '" value="' + msgs.msgClose + '"/>\
            </div>\
            <div class="gameQP-DivFeedBack" id="seleccionaDivFeedBack-' + instance + '">\
                <input type="button" id="seleccionaFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
            <div class="gameQP-DivModeBoard" id="seleccionaDivModeBoard-' + instance + '">\
                <a class="gameQP-ModeBoard" href="#" id="seleccionaModeBoardOK-' + instance + '" title="' + msgs.msgCorrect + '">' + msgs.msgCorrect + '</a>\
                <a class="gameQP-ModeBoard" href="#" id="seleccionaModeBoardMoveOn-' + instance + '" title="' + msgs.msgMoveOne + '">' + msgs.msgMoveOne + '</a>\
                <a class="gameQP-ModeBoard" href="#" id="seleccionaModeBoardKO-' + instance + '" title="' + msgs.msgIncorrect + '">' + msgs.msgIncorrect + '</a>\
            </div>\
                <div class="gameQP-Cubierta" id="seleccionaCubierta-' + instance + '" style="display:none">\
                    <div class="gameQP-CodeAccessDiv" id="seleccionaCodeAccessDiv-' + instance + '">\
                    <p class="gameQP-MessageCodeAccessE" id="seleccionaMesajeAccesCodeE-' + instance + '"></p>\
                    <div class="gameQP-DataCodeAccessE">\
                        <label for="seleccionaCodeAccessE-' + instance + '" class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="gameQP-CodeAccessE"  id="seleccionaCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="seleccionaCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                            <strong class="sr-av">' + msgs.msgSubmit + '</strong>\
                            <div class="exeQuextIcons exeQuextIcons-Submit gameQP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },
    showCubiertaOptions(mode, instance) {
        if (mode === false) {
            $('#seleccionaCubierta-' + instance).fadeOut();
            return;
        }
        $('#seleccionaCubierta-' + instance).fadeIn();
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        var butonScore = "";
        var fB = '<div class="gameQP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="gameQP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="seleccionaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="gameQP-RepeatActivity" id="seleccionaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="gameQP-GetScore">';
                fB += '<p><span class="gameQP-RepeatActivity" id="seleccionaRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    loadDataGame: function (data, imgsLink, audioLink, version) {
        var json = $eXeSelecciona.Decrypt(data.text()),
            mOptions = $eXeSelecciona.isJsonString(json);
        version = typeof version == "undefined" || version == '' ? 0 : parseInt(version);
        var hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeSelecciona.hasLATEX = true;
        }
        mOptions.gameOver = false;
        mOptions.hasVideo = false;
        mOptions.waitStart = false;
        mOptions.waitPlayIntro = false;
        mOptions.hasVideoIntro = false;
        mOptions.gameStarted = false;
        mOptions.scoreGame = 0;
        mOptions.percentajeQuestions = typeof mOptions.percentajeQuestions != 'undefined' ? mOptions.percentajeQuestions : 100;
        mOptions.modeBoard = typeof mOptions.modeBoard == "undefined" ? false : mOptions.modeBoard;
        for (var i = 0; i < mOptions.selectsGame.length; i++) {
            mOptions.selectsGame[i].audio = typeof mOptions.selectsGame[i].audio == 'undefined' ? '' : mOptions.selectsGame[i].audio
            mOptions.selectsGame[i].hit = typeof mOptions.selectsGame[i].hit == "undefined" ? 0 : mOptions.selectsGame[i].hit;
            mOptions.selectsGame[i].error = typeof mOptions.selectsGame[i].error == "undefined" ? 0 : mOptions.selectsGame[i].error;
            mOptions.selectsGame[i].msgHit = typeof mOptions.selectsGame[i].msgHit == "undefined" ? "" : mOptions.selectsGame[i].msgHit;
            mOptions.selectsGame[i].msgError = typeof mOptions.selectsGame[i].msgError == "undefined" ? "" : mOptions.selectsGame[i].msgError;
            mOptions.selectsGame[i].url = $eXeSelecciona.extractURLGD(mOptions.selectsGame[i].url);
            if (mOptions.selectsGame[i].type == 2) {
                mOptions.hasVideo = true;
            }

        }
        mOptions.scoreGame = 0;
        mOptions.scoreTotal = 0;
        mOptions.playerAudio = "";
        mOptions.gameMode = typeof mOptions.gameMode != 'undefined' ? mOptions.gameMode : 0;
        mOptions.percentajeFB = typeof mOptions.percentajeFB != 'undefined' ? mOptions.percentajeFB : 100;
        mOptions.useLives = mOptions.gameMode != 0 ? false : mOptions.useLives;
        mOptions.customMessages = typeof mOptions.customMessages != "undefined" ? mOptions.customMessages : false;
        mOptions.audioFeedBach = typeof mOptions.audioFeedBach != "undefined" ? mOptions.audioFeedBach : false;
        mOptions.customMessages = mOptions.order == 2 ? true : mOptions.customMessages;
        mOptions.gameOver = false;
        imgsLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.selectsGame.length) {
                mOptions.selectsGame[iq].url = $(this).attr('href');
                if (mOptions.selectsGame[iq].url.length < 4 && mOptions.selectsGame[iq].type == 1) {
                    mOptions.selectsGame[iq].url = "";
                }
            }
        });

        audioLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.selectsGame.length) {
                mOptions.selectsGame[iq].audio = $(this).attr('href');
                if (mOptions.selectsGame[iq].audio.length < 4) {
                    mOptions.selectsGame[iq].audio = "";
                }
            }
        });
        if (typeof mOptions.order == "undefined") {
            mOptions.order = mOptions.optionsRamdon ? 1 : 0;
        }
        if (mOptions.order != 2) {
            mOptions.selectsGame = $eXeSelecciona.getQuestions(mOptions.selectsGame, mOptions.percentajeQuestions);
        }
        for (var i = 0; i < mOptions.selectsGame.length; i++) {
            if (mOptions.customScore || mOptions.order == 2) {
                mOptions.scoreTotal += mOptions.selectsGame[i].customScore;
            } else {
                mOptions.selectsGame[i].customScore = 1
                mOptions.scoreTotal += mOptions.selectsGame[i].customScore
            }
        }
        mOptions.selectsGame = mOptions.order == 1 ? $eXeSelecciona.shuffleAds(mOptions.selectsGame) : mOptions.selectsGame;
        mOptions.numberQuestions = mOptions.selectsGame.length;
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
                array = $eXeSelecciona.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
        for (var i = 0; i < $eXeSelecciona.options.length; i++) {
            var mOptions = $eXeSelecciona.options[i];
            mOptions.player = new YT.Player('seleccionaVideo-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 0
                },
                events: {
                    'onReady': $eXeSelecciona.onPlayerReady,
                    'onError': $eXeSelecciona.onPlayerError
                }
            });

            mOptions.playerIntro = new YT.Player('seleccionaVideoIntro-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 1
                }
            });
            $('#seleccionaVideo-' + i).hide();
            $('#seleccionaCodeAccessE-' + i).prop('readonly', false);
        }
    },
    youTubeReadyOne: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        mOptions.player = new YT.Player('seleccionaVideo-' + instance, {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onReady': $eXeSelecciona.onPlayerReady,
                'onError': $eXeSelecciona.onPlayerError
            }
        });
        $('#seleccionaVideo-' + instance).hide();

        mOptions.playerIntro = new YT.Player('seleccionaVideoIntro-' + instance, {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 1
            }
        });
    },

    preloadGame: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.waitStart) {
            mOptions.waitStart = false;
            setTimeout(function () {
                $eXeSelecciona.startGame(instance);
            }, 1000);
        }
        if (mOptions.waitPlayIntro) {
            mOptions.waitPlayIntro = false;
            setTimeout(function () {
                $eXeSelecciona.playVideoIntro(instance);
                $('#seleccionaStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
            }, 1000);

        }
    },

    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    },
    playSound: function (selectedFile, instance) {
        var mOptions = $eXeSelecciona.options[instance];
        selectedFile = $eXeSelecciona.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });

    },
    stopSound: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.playerAudio && typeof mOptions.playerAudio.pause == "function") {
            mOptions.playerAudio.pause();
        }
    },

    playVideoIntro: function (instance) {
        $('#seleccionaVideoIntroDiv-' + instance).show();
        var mOptions = $eXeSelecciona.options[instance],
            idVideo = $eXeSelecciona.getIDYoutube(mOptions.idVideo);
        mOptions.endVideo = mOptions.endVideo <= mOptions.startVideo ? 36000 : mOptions.endVideo;
        $eXeSelecciona.startVideoIntro(idVideo, mOptions.startVideo, mOptions.endVideo, instance);
    },

    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeSelecciona.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        var video='seleccionaVideo-0';
        if((event.target.h) && (event.target.h.id) ){
            video=event.target.h.id;
        }else if ((event.target.i ) && (event.target.i.id)) {
            video=event.target.i.id;
        }
        video = video.split("-");
        if (video.length == 2 && (video[0] == "seleccionaVideo" || video[0] == "seleccionaVideoIntro")) {
            var instance = parseInt(video[1]);
            if (!isNaN(instance)) {
                $eXeSelecciona.preloadGame(instance);
            }

        }
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideoIntro: function (id, start, end, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mstart = start < 1 ? 0.1 : start;
        if (mOptions.playerIntro) {
            if (typeof mOptions.playerIntro.loadVideoById == "function") {
                mOptions.playerIntro.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
        }
    },
    stopVideoIntro: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.playerIntro) {
            if (typeof mOptions.playerIntro.pauseVideo == "function") {
                mOptions.playerIntro.pauseVideo();
            }
        }
    },
    startVideo: function (id, start, end, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mstart = start < 1 ? 0.1 : start;
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
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.player) {
            if (typeof mOptions.player.playVideo == "function") {
                mOptions.player.playVideo();
            }
        }
    },
    stopVideo: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.player) {
            if (typeof mOptions.player.pauseVideo == "function") {
                mOptions.player.pauseVideo();
            }
        }
    },
    muteVideo: function (mute, instance) {
        var mOptions = $eXeSelecciona.options[instance];
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
    addEvents: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        mOptions.respuesta = '';
        window.addEventListener('unload', function () {
            $eXeSelecciona.endScorm();
        });
        window.addEventListener('resize', function () {
            $eXeSelecciona.refreshImageActive(instance);
        });
        $('videoseleccionaGamerOver-' + instance).css('display', 'flex');
        $('#seleccionaLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#seleccionaGameContainer-' + instance).show()
            $('#seleccionaGameMinimize-' + instance).hide();
            $eXeSelecciona.refreshImageActive(instance);
        });
        $('#seleccionaLinkMinimize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#seleccionaGameContainer-' + instance).hide();
            $('#seleccionaGameMinimize-' + instance).css('visibility', 'visible').show();
            return true;
        });

        $('#seleccionaSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeSelecciona.sendScore(false, instance);
            return true;
        });
        $('#seleccionaGamerOver-' + instance).hide();
        $('#seleccionaCodeAccessDiv-' + instance).hide();
        $('#seleccionaVideo-' + instance).hide();
        $('#seleccionaImagen-' + instance).hide();
        $('#seleccionaCursor-' + instance).hide();
        $('#seleccionaCover-' + instance).show();
        $('#seleccionaAnswerDiv-' + instance).hide();
        $('#seleccionaCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeSelecciona.enterCodeAccess(instance);
        });
        $('#seleccionaCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeSelecciona.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#seleccionaBtnMoveOn-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeSelecciona.newQuestion(instance, false, false)
        });
        $('#seleccionaBtnReply-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeSelecciona.answerQuestion(instance);
        });
        $('#seleccionaEdAnswer-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeSelecciona.answerQuestion(instance);
                return false;
            }
            return true;
        });
        mOptions.livesLeft = mOptions.numberLives;
        $('#seleccionaOptionsDiv-' + instance).find('.gameQP-Options').on('click', function (e) {
            e.preventDefault();
            $eXeSelecciona.changeQuextion(instance, this);
        })
        $('#seleccionaLinkFullScreen-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('seleccionaGameContainer-' + instance);
            $eXeSelecciona.toggleFullscreen(element, instance);
        });
        $eXeSelecciona.updateLives(instance);
        $('#seleccionaInstructions-' + instance).text(mOptions.instructions);

        $('#seleccionaPNumber-' + instance).text(mOptions.numberQuestions);
        $('#seleccionaGameContainer-' + instance + ' .gameQP-StartGame').show();
        $('#seleccionaQuestionDiv-' + instance).hide();
        $('#seleccionaBottonContainer-' + instance).addClass('gameQP-BottonContainerDivEnd');

        if (mOptions.itinerary.showCodeAccess) {
            $('#seleccionaAnswerDiv-' + instance).hide();
            $('#seleccionaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#seleccionaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#seleccionaCodeAccessDiv-' + instance).show();
            $('#seleccionaGameContainer-' + instance + ' .gameQP-StartGame').hide();
            $eXeSelecciona.showCubiertaOptions(true,instance)

        }
        $('#seleccionaInstruction-' + instance).text(mOptions.instructions);
        $('#seleccionaSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#seleccionaSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeSelecciona.updateScorm($eXeSelecciona.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#seleccionaPShowClue-' + instance).hide();
        mOptions.gameOver = false;

        $('#seleccionaButtonAnswer-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeSelecciona.answerQuestion(instance);
        });

        $('#seleccionaStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#seleccionaStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeSelecciona.getYTAPI(instance);

        });

        $('#seleccionaVideoIntroClose-' + instance).on('click', function (e) {
            e.preventDefault();
            $('#seleccionaVideoIntroDiv-' + instance).hide();
            $('#selecionaStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
            $eXeSelecciona.startVideoIntro('', 0, 0, instance);
        });
        $('#seleccionaFeedBackClose-' + instance).on('click', function (e) {
            $('#seleccionaDivFeedBack-' + instance).hide();
        });
        $('#seleccionaLinkAudio-' + instance).on('click', function (e) {
            e.preventDefault();
            var audio = mOptions.selectsGame[mOptions.activeQuestion].audio;
            $eXeSelecciona.stopSound(instance);
            $eXeSelecciona.playSound(audio, instance);
        });

        $('#seleccionaLinkVideoIntroShow-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeSelecciona.getYTVideoIntro(instance);
        });


        if (mOptions.gameMode == 2) {
            $('#seleccionaGameContainer-' + instance).find('.exeQuextIcons-Hit').hide();
            $('#seleccionaGameContainer-' + instance).find('.exeQuextIcons-Error').hide();
            $('#seleccionaPErrors-' + instance).hide();
            $('#seleccionaPHits-' + instance).hide();
            $('#seleccionaGameContainer-' + instance).find('.exeQuextIcons-Score').hide();
            $('#seleccionaPScore-' + instance).hide();
        }
        if ($eXeSelecciona.getIDYoutube(mOptions.idVideo) !== '') {
            mOptions.hasVideoIntro = true;
            $('#seleccionaLinkVideoIntroShow-' + instance).show();
        }
        $('#seleccionaWordDiv-' + instance).hide();
        $('#seleccionaModeBoardOK-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeSelecciona.answerQuestionBoard(true, instance)

		});
		$('#seleccionaModeBoardKO-' + instance).on('click', function (e) {
			e.preventDefault();
			$eXeSelecciona.answerQuestionBoard(false, instance)

		});
		$('#seleccionaModeBoardMoveOn-' + instance).on('click', function (e) {
			e.preventDefault();
            $eXeSelecciona.newQuestion(instance)
		});
    },
    getYTAPI: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        mOptions.selectsGame = mOptions.order == 1 ? $eXeSelecciona.shuffleAds(mOptions.selectsGame) : mOptions.selectsGame;
        if ((typeof (mOptions.player) == "undefined") && mOptions.hasVideo) {
            $('#seleccionaStartGame-' + instance).text(mOptions.msgs.msgLoading);
            mOptions.waitStart = true;
            if (typeof (YT) !== "undefined") {
                $eXeSelecciona.youTubeReadyOne(instance);
            } else {
                $eXeSelecciona.loadYoutubeApi();
            }
        } else {
            $eXeSelecciona.startGame(instance);
        }
    },
    getYTVideoIntro: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if ((typeof (mOptions.playerIntro) == "undefined") && mOptions.hasVideoIntro) {
            mOptions.waitPlayIntro = true;
            $('#seleccionaStartGame-' + instance).text(mOptions.msgs.msgLoading);
            if (typeof (YT) !== "undefined") {
                $eXeSelecciona.youTubeReadyOne(instance);
            } else {
                $eXeSelecciona.loadYoutubeApi();
            }

        } else {
            $eXeSelecciona.playVideoIntro(instance);
        }
    },
    changeQuextion: function (instance, button) {
        var mOptions = $eXeSelecciona.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        var numberButton = parseInt($(button).data("number")),
            letters = 'ABCD',
            letter = letters[numberButton],
            type = false;

        if (mOptions.respuesta.indexOf(letter) === -1) {
            mOptions.respuesta = mOptions.respuesta + letter;
            type = true;
        } else {
            mOptions.respuesta = mOptions.respuesta.replace(letter, '');
        }
        var bordeColors = [$eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.yellow],
            css = {
                'border-size': 1,
                'border-color': bordeColors[numberButton],
                'background-color': "transparent",
                'cursor': 'default',
                'color': $eXeSelecciona.colors.black
            }
        if (type) {
            css = {
                'border-size': 1,
                'border-color': bordeColors[numberButton],
                'background-color': bordeColors[numberButton],
                'cursor': 'pointer',
                'color': '#ffffff'
            }
        }
        $(button).css(css);
        $('#seleccionaAnswers-' + instance + ' .gameQP-AnswersOptions').remove();
        for (var i = 0; i < mOptions.respuesta.length; i++) {
            if (mOptions.respuesta[i] === 'A') {
                $('#seleccionaAnswers-' + instance).append('<div class="gameQP-AnswersOptions gameQP-Answer1"></div>');

            } else if (mOptions.respuesta[i] === 'B') {
                $('#seleccionaAnswers-' + instance).append('<div class="gameQP-AnswersOptions gameQP-Answer2"></div>');

            } else if (mOptions.respuesta[i] === 'C') {
                $('#seleccionaAnswers-' + instance).append('<div class="gameQP-AnswersOptions gameQP-Answer3"></div>');

            } else if (mOptions.respuesta[i] === 'D') {
                $('#seleccionaAnswers-' + instance).append('<div class="gameQP-AnswersOptions gameQP-Answer4"></div>');
            }
        }

    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            author = '';
        if (mOptions.gameOver) {
            return;
        }
        if (typeof mQuextion == "undefined") {
            return;
        }
        if (mQuextion.type === 1) {

            $('#seleccionaImagen-' + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = mOptions.msgs.msgNoImage;
                        $('#seleccionaAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeSelecciona.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeSelecciona.drawImage(this, mData);
                        $('#seleccionaImagen-' + instance).show();
                        $('#seleccionaCover-' + instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#seleccionaCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            author = mQuextion.author;
                            $('#seleccionaCursor-' + instance).show();
                        }
                    }
                    $eXeSelecciona.showMessage(0, author, instance);
                });
            $('#seleccionaImagen-' + instance).attr('alt', mQuextion.alt);
        }
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() === $('#seleccionaCodeAccessE-' + instance).val().toLowerCase()) {
            $eXeSelecciona.showCubiertaOptions(false,instance);
            $eXeSelecciona.getYTAPI(instance);
        } else {
            $('#seleccionaMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#seleccionaCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            msgs = mOptions.msgs,
            $seleccionaHistGame = $('#seleccionaHistGame-' + instance),
            $seleccionaLostGame = $('#seleccionaLostGame-' + instance),
            $seleccionaOverPoint = $('#seleccionaOverScore-' + instance),
            $seleccionaOverHits = $('#seleccionaOverHits-' + instance),
            $seleccionaOverErrors = $('#seleccionaOverErrors-' + instance),
            $seleccionaPShowClue = $('#seleccionaPShowClue-' + instance),
            $seleccionaGamerOver = $('#seleccionaGamerOver-' + instance),
            message = "",
            messageColor = 2;
        $seleccionaHistGame.hide();
        $seleccionaLostGame.hide();
        $seleccionaOverPoint.show();
        $seleccionaOverHits.show();
        $seleccionaOverErrors.show();
        $seleccionaPShowClue.hide();
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.msgAllQuestions;
                $seleccionaHistGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        message = msgs.msgAllQuestions;
                        $seleccionaPShowClue.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $seleccionaPShowClue.show();
                    } else {
                        $seleccionaPShowClue.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $seleccionaPShowClue.show();
                    }
                }
                break;
            case 1:
                message = msgs.msgLostLives;
                messageColor = 1;
                $seleccionaLostGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        $seleccionaPShowClue.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $seleccionaPShowClue.show();
                    } else {
                        $seleccionaPShowClue.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $seleccionaPShowClue.show();
                    }
                }
                break;
            case 2:
                message = msgs.msgInformationLooking
                $seleccionaOverPoint.hide();
                $seleccionaOverHits.hide();
                $seleccionaOverErrors.hide();
                $seleccionaPShowClue.text(mOptions.itinerary.clueGame);
                $seleccionaPShowClue.show();
                break;
            default:
                break;
        }
        $eXeSelecciona.showMessage(messageColor, message, instance);
        var msscore = mOptions.gameMode == 0 ? '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score : '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score.toFixed(2);
        $seleccionaOverPoint.html(msscore);
        $seleccionaOverHits.html('<strong>' + msgs.msgHits + ':</strong> ' + mOptions.hits);
        $seleccionaOverErrors.html('<strong>' + msgs.msgErrors + '</strong>: ' + mOptions.errors);
        if (mOptions.gameMode == 2) {
            $('#seleccionaGameContainer-' + instance).find('.gameQP-DataGameScore').hide();
        }
        $seleccionaGamerOver.show();
    },
    startGame: function (instance) {
        var mOptions = $eXeSelecciona.options[instance]
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.scoreGame = 0;
        mOptions.obtainedClue = false;
        $('#seleccionaVideoIntroContainer-' + instance).hide();
        $('#seleccionaLinkVideoIntroShow-' + instance).hide();
        $('#seleccionaPShowClue-' + instance).hide();
        $('#seleccionaGameContainer-' + instance + ' .gameQP-StartGame').hide();
        $('#seleccionaQuestion-' + instance).text('');
        $('#seleccionaQuestionDiv-' + instance).show();
        $('#seleccionaWordDiv-' + instance).hide();
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = false;
        mOptions.activeQuestion = -1;
        mOptions.validQuestions = mOptions.numberQuestions;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        mOptions.livesLeft = mOptions.numberLives;
        $eXeSelecciona.updateLives(instance);
        $('#seleccionaPNumber-' + instance).text(mOptions.numberQuestions);
        for (var i = 0; i < mOptions.selectsGame.length; i++) {
            mOptions.selectsGame[i].answerScore = -1;
        }
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeSelecciona.uptateTime(mOptions.counter, instance);
                $eXeSelecciona.updateSoundVideo(instance);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    var timeShowSolution = 1000;
                    if (mOptions.showSolution) {
                        timeShowSolution = mOptions.timeShowSolution * 1000;
                        if (!$eXeSelecciona.sameQuestion(false, instance)) {
                            if (mOptions.selectsGame[mOptions.activeQuestion].typeSelect != 2) {
                                $eXeSelecciona.drawSolution(instance);
                            } else {
                                $eXeSelecciona.drawPhrase(mOptions.selectsGame[mOptions.activeQuestion].solutionQuestion, mOptions.selectsGame[mOptions.activeQuestion].quextion, 100, 1, false, instance, true)
                            }
                        }
                    }
                    setTimeout(function () {
                        $eXeSelecciona.newQuestion(instance, false, false)
                    }, timeShowSolution);
                    return;
                }
            }

        }, 1000);
        $eXeSelecciona.uptateTime(0, instance);
        $('#seleccionaGamerOver-' + instance).hide();
        $('#seleccionaPHits-' + instance).text(mOptions.hits);
        $('#seleccionaPErrors-' + instance).text(mOptions.errors);
        $('#seleccionaPScore-' + instance).text(mOptions.score);
        mOptions.gameStarted = true;
        $eXeSelecciona.newQuestion(instance, false, true);
    },
    updateSoundVideo: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.activeSilent) {
            if (mOptions.player && typeof mOptions.player.getCurrentTime === "function") {
                var time = Math.round(mOptions.player.getCurrentTime());
                if (time == mOptions.question.silentVideo) {
                    mOptions.player.mute(instance);
                } else if (time == mOptions.endSilent) {
                    mOptions.player.unMute(instance);
                }
            }
        }
    },
    uptateTime: function (tiempo, instance) {
        var mOptions = $eXeSelecciona.options;
        var mTime = $eXeSelecciona.getTimeToString(tiempo);
        $('#seleccionaPTime-' + instance).text(mTime);
        if (mOptions.gameActived) {

        }
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeSelecciona.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        clearInterval(mOptions.counterClock);
        $('#seleccionaDivModeBoard-' + instance).hide()
        $('#seleccionaVideo-' + instance).hide();
        $('#seleccionaLinkAudio-' + instance).hide();
        $eXeSelecciona.startVideo('', 0, 0, instance);
        $eXeSelecciona.stopVideo(instance);
        $eXeSelecciona.stopSound(instance);
        $('#seleccionaImagen-' + instance).hide();
        $('#seleccionaEText-' + instance).hide();
        $('#seleccionaCursor-' + instance).hide();
        $('#seleccionaCover-' + instance).hide();
        var message = type === 0 ? mOptions.msgs.mgsAllQuestions : mOptions.msgs.msgLostLives;
        $eXeSelecciona.showMessage(2, message, instance);
        $eXeSelecciona.showScoreGame(type, instance);
        $eXeSelecciona.clearQuestions(instance);
        $eXeSelecciona.uptateTime(0, instance);
        $('#seleccionaPNumber-' + instance).text('0');
        $('#seleccionaStartGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#seleccionaGameContainer-' + instance + ' .gameQP-StartGame').show();
        $('#seleccionaQuestionDiv-' + instance).hide();
        $('#seleccionaAnswerDiv-' + instance).hide();
        $('#seleccionaWordDiv-' + instance).hide();
        mOptions.gameOver = true;
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeSelecciona.initialScore === '') {
                var score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
                $eXeSelecciona.sendScore(true, instance);
                $('#seleccionaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeSelecciona.initialScore = score;
            }
        }
        $eXeSelecciona.showFeedBack(instance);
        if ($eXeSelecciona.getIDYoutube(mOptions.idVideo) !== '') {
            $('#seleccionaLinkVideoIntroShow-' + instance).show();
        }
    },

    showFeedBack: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.selectsGame.length;
        if (mOptions.order == 2) {
            puntos = mOptions.score * 10;
        }
        if (mOptions.gameMode == 2 || mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#seleccionaDivFeedBack-' + instance).find('.selecciona-feedback-game').show();
                $('#seleccionaDivFeedBack-' + instance).show();
            } else {
                $eXeSelecciona.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance);
            }
        }
    },
    drawPhrase: function (phrase, definition, nivel, type, casesensitive, instance, solution) {
        $('#seleccionaEPhrase-' + instance).find('.gameQP-Word').remove();
        $('#seleccionaBtnReply-' + instance).prop('disabled', true);
        $('#seleccionaBtnMoveOn-' + instance).prop('disabled', true);
        $('#seleccionaEdAnswer-' + instance).prop('disabled', true);
        $('#seleccionaQuestionDiv-' + instance).hide();
        $('#seleccionaWordDiv-' + instance).show();
        $('#seleccionaAnswerDiv-' + instance).hide();
        if (!casesensitive) {
            phrase = phrase.toUpperCase();
        }
        var cPhrase = $eXeSelecciona.clear(phrase),
            letterShow = $eXeSelecciona.getShowLetter(cPhrase, nivel),
            h = cPhrase.replace(/\s/g, '&'),
            nPhrase = [];
        for (var z = 0; z < h.length; z++) {
            if (h[z] != '&' && letterShow.indexOf(z) == -1) {
                nPhrase.push(' ')
            } else {
                nPhrase.push(h[z]);
            }
        }
        nPhrase = nPhrase.join('');
        var phrase_array = nPhrase.split('&');
        for (var i = 0; i < phrase_array.length; i++) {
            var cleanWord = phrase_array[i];
            if (cleanWord != '') {
                $('<div class="gameQP-Word"></div>').appendTo('#seleccionaEPhrase-' + instance);
                for (var j = 0; j < cleanWord.length; j++) {
                    var letter = '<div class="gameQP-Letter blue">' + cleanWord[j] + '</div>';
                    if (type == 1) {
                        letter = '<div class="gameQP-Letter red">' + cleanWord[j] + '</div>';
                    } else if (type == 2) {
                        letter = '<div class="gameQP-Letter green">' + cleanWord[j] + '</div>';
                    }
                    $('#seleccionaEPhrase-' + instance).find('.gameQP-Word').last().append(letter);
                }
            }
        }
        if(!solution){
            $('#seleccionaDefinition-' + instance).text(definition);
        }
        
        var html = $('#seleccionaWordDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeSelecciona.updateLatex('seleccionaWordDiv-' + instance)
        }
        return cPhrase;
    },
    clear: function (phrase) {
        return phrase.replace(/[&\s\n\r]+/g, " ").trim();
    },
    getShowLetter: function (phrase, nivel) {
        var numberLetter = parseInt(phrase.length * nivel / 100);
        var arrayRandom = [];
        while (arrayRandom.length < numberLetter) {
            var numberRandow = parseInt(Math.random() * phrase.length);

            if (arrayRandom.indexOf(numberRandow) != -1) {
                continue;
            } else {
                arrayRandom.push(numberRandow)
            }
        };
        return arrayRandom.sort()
    },

    drawText: function (texto, color) {},
    showQuestion: function (i, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mQuextion = mOptions.selectsGame[i],
            q = mQuextion;
        $eXeSelecciona.clearQuestions(instance);
        mOptions.gameActived = true;
        mOptions.question = mQuextion
        mOptions.respuesta = '';
        var tiempo = $eXeSelecciona.getTimeToString($eXeSelecciona.getTimeSeconds(mQuextion.time)),
            author = '',
            alt = '';
        $('#seleccionaPTime-' + instance).text(tiempo);
        $('#seleccionaQuestion-' + instance).text(mQuextion.quextion);
        $('#seleccionaImagen-' + instance).hide();
        $('#seleccionaCover-' + instance).show();
        $('#seleccionaEText-' + instance).hide();
        $('#seleccionaVideo-' + instance).hide();
        $('#seleccionaLinkAudio-' + instance).hide();
        $eXeSelecciona.startVideo('', 0, 0, instance);
        $eXeSelecciona.stopVideo(instance)
        $('#seleccionaCursor-' + instance).hide();
        $eXeSelecciona.showMessage(0, '', instance);
        if (mOptions.answersRamdon) {
            $eXeSelecciona.ramdonOptions(instance);
        }
        mOptions.activeSilent = (q.type == 2) && (q.soundVideo == 1) && (q.tSilentVideo > 0) && (q.silentVideo >= q.iVideo) && (q.iVideo < q.fVideo);
        var endSonido = parseInt(q.silentVideo) + parseInt(q.tSilentVideo);
        mOptions.endSilent = endSonido > q.fVideo ? q.fVideo : endSonido;
        $('#seleccionaAuthor-' + instance).text('');
        if (mQuextion.type === 1) {
            $('#seleccionaImagen-' + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = $eXeSelecciona.msgs.msgNoImage;
                        $('#seleccionaAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeSelecciona.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeSelecciona.drawImage(this, mData);
                        $('#seleccionaImagen-' + instance).show();
                        $('#seleccionaCover-' + instance).hide();
                        $('#seleccionaCursor-' + instance).hide();
                        alt = mQuextion.alt;
                        author = mQuextion.author;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#seleccionaCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            $('#seleccionaCursor-' + instance).show();
                        }
                    }
                    $eXeSelecciona.showMessage(0, author, instance);
                });
            $('#seleccionaImagen-' + instance).attr('alt', alt);
        } else if (mQuextion.type === 3) {
            var text = unescape(mQuextion.eText);
            if (window.innerWidth < 401) {
                //text = $eXeSelecciona.reduceText(text);
            }
            $('#seleccionaEText-' + instance).html(text);
            $('#seleccionaCover-' + instance).hide();
            $('#seleccionaEText-' + instance).show();
            $eXeSelecciona.showMessage(0, '', instance);

        } else if (mQuextion.type === 2) {
            $('#seleccionaVideo-' + instance).show();
            var idVideo = $eXeSelecciona.getIDYoutube(mQuextion.url);
            $eXeSelecciona.startVideo(idVideo, mQuextion.iVideo, mQuextion.fVideo, instance);
            $eXeSelecciona.showMessage(0, '', instance);
            if (mQuextion.imageVideo === 0) {
                $('#seleccionaVideo-' + instance).hide();
                $('#seleccionaCover-' + instance).show();
            } else {
                $('#seleccionaVideo-' + instance).show();
                $('#seleccionaCover-' + instance).hide();
            }
            if (mQuextion.soundVideo === 0) {
                $eXeSelecciona.muteVideo(true, instance);
            } else {
                $eXeSelecciona.muteVideo(false, instance);
            }

        }
        $('#seleccionaDivModeBoard-' + instance).hide();
        if (mQuextion.typeSelect != 2) {
            $eXeSelecciona.drawQuestions(instance);
        } else {
            $eXeSelecciona.drawPhrase(mQuextion.solutionQuestion, mQuextion.quextion, mQuextion.percentageShow, 0, false, instance, false)
            $('#seleccionaBtnReply-' + instance).prop('disabled', false);
            $('#seleccionaBtnMoveOn-' + instance).prop('disabled', false);
            $('#seleccionaEdAnswer-' + instance).prop('disabled', false);
            $('#seleccionaEdAnswer-' + instance).focus();
            $('#seleccionaEdAnswer-' + instance).val('');
            if (mOptions.modeBoard) {
                $('#seleccionaDivModeBoard-' + instance).css('display', 'flex');
                $('#seleccionaDivModeBoard-' + instance).fadeIn();
            }
    
        }

        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeSelecciona.initialScore === '') {
                var score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
                $eXeSelecciona.sendScore(true, instance);
                $('#seleccionaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        if (q.audio.length > 4 && q.type != 2 && !mOptions.audioFeedBach) {
            $('#seleccionaLinkAudio-' + instance).show();
        }

        $eXeSelecciona.stopSound(instance);
        if (q.type != 2 && q.audio.trim().length > 5 && !mOptions.audioFeedBach) {
            $eXeSelecciona.playSound(q.audio.trim(), instance);
        }
 


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
        var mOptions = $eXeSelecciona.options[instance];
        $('#seleccionaPLifes-' + instance).text(mOptions.livesLeft);
        $('#seleccionaLifesGame-' + instance).find('.exeQuextIcons-Life').each(function (index) {
            $(this).hide();
            if (mOptions.useLives) {
                $(this).show();
                if (index >= mOptions.livesLeft) {
                    $(this).hide();
                }
            }
        });
        if (!mOptions.useLives) {
            $('#seleccionaNumberLivesGame-' + instance).hide();
        }
    },

    newQuestion: function (instance, correctAnswer, start) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeSelecciona.gameOver(1, instance);
            return;
        }
        var mActiveQuestion = $eXeSelecciona.updateNumberQuestion(mOptions.activeQuestion, correctAnswer, start, instance);
        if (mActiveQuestion === -10) {
            $('#seleccionaPNumber-' + instance).text('0');
            $eXeSelecciona.gameOver(0, instance);
            return;
        } else {
            mOptions.counter = $eXeSelecciona.getTimeSeconds(mOptions.selectsGame[mActiveQuestion].time);
            if (mOptions.selectsGame[mActiveQuestion].type === 2) {
                var durationVideo = mOptions.selectsGame[mActiveQuestion].fVideo - mOptions.selectsGame[mActiveQuestion].iVideo;
                mOptions.counter += durationVideo;
            }
            $eXeSelecciona.showQuestion(mActiveQuestion, instance)
            mOptions.activeCounter = true;
            var numQ = mOptions.numberQuestions - mActiveQuestion;
            $('#seleccionaPNumber-' + instance).text(numQ);
        };
    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600]
        return times[iT];
    },
    updateNumberQuestion: function (numq, correct, start, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            numActiveQuestion = numq;
        if (mOptions.order == 2) {
            if (start) {
                numq = 0;
            }
            if(mOptions.activeQuestion<0){
                numActiveQuestion=0;
            }else if ((correct && mOptions.selectsGame[numq].hit == -2) || (!correct && mOptions.selectsGame[numq].error == -2)) {
                return -10
            } else if ((correct && mOptions.selectsGame[numq].hit == -1) || (!correct && mOptions.selectsGame[numq].error == -1)) {
                numActiveQuestion++;
                if (numActiveQuestion >= mOptions.numberQuestions) {
                    return -10
                }
            } else if (correct && mOptions.selectsGame[numq].hit >= 0) {
                numActiveQuestion = mOptions.selectsGame[numq].hit;
                if (numActiveQuestion >= mOptions.numberQuestions) {
                    return -10
                }
            } else if (!correct && mOptions.selectsGame[numq].error >= 0) {
                numActiveQuestion = mOptions.selectsGame[numq].error;
                if (numActiveQuestion >= mOptions.numberQuestions) {
                    return -10
                }
            }

        } else {
            numActiveQuestion++;
            if (numActiveQuestion >= mOptions.numberQuestions) {
                return -10
            }
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },
    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeSelecciona.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },

    answerQuestion: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            quextion = mOptions.selectsGame[mOptions.activeQuestion];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        var message = "",
            solution = quextion.solution,
            answer = mOptions.respuesta.toUpperCase(),
            correct = true;

        if (quextion.typeSelect === 2) {
            solution = quextion.solutionQuestion.toUpperCase();
            answer = $.trim($('#seleccionaEdAnswer-' + instance).val()).toUpperCase();
            correct = solution == answer;
            if (answer.length == 0) {
                $eXeSelecciona.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
                mOptions.gameActived = true;
                return;
            }

        } else if (quextion.typeSelect === 1) {
            if (answer.length !== solution.length) {
                $eXeSelecciona.showMessage(1, mOptions.msgs.msgOrders, instance);
                mOptions.gameActived = true;
                return;
            }
            if (solution !== answer) {
                correct = false;
            }
        } else {
            if (answer.length !== solution.length) {
                correct = false;
            } else {
                for (var i = 0; i < answer.length; i++) {
                    var letter = answer[i];
                    if (solution.indexOf(letter) === -1) {
                        correct = false;
                        break;
                    }
                }
            }
        }
        mOptions.activeCounter = false;
        if (mOptions.order != 2) {
            $eXeSelecciona.updateScore(correct, instance);
        } else {
            $eXeSelecciona.updateScoreThree(correct, instance);
        }
        if (mOptions.showSolution & quextion.audio.trim().length > 5 && mOptions.audioFeedBach) {
            $eXeSelecciona.playSound(quextion.audio.trim(), instance);
            $('#seleccionaLinkAudio-' + instance).show();
        }

        var timeShowSolution = 1000;
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        $('#seleccionaPHits-' + instance).text(mOptions.hits);
        $('#seleccionaPErrors-' + instance).text(mOptions.errors);
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                timeShowSolution = 5000;
                message += " " + mOptions.msgs.msgUseFulInformation;
                $('#seleccionaPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                mOptions.obtainedClue = true;
                $('#seleccionaPShowClue-' + instance).show();
            }
        }
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            if (!$eXeSelecciona.sameQuestion(correct, instance)) {
                if (quextion.typeSelect != 2) {
                    $eXeSelecciona.drawSolution(instance);
                } else {
                    var mtipe = correct ? 2 : 1;
                    $eXeSelecciona.drawPhrase(quextion.solutionQuestion, quextion.quextion, 100, mtipe, false, instance, true)
                }
            }

        }

        setTimeout(function () {
            $eXeSelecciona.newQuestion(instance, correct, false)
        }, timeShowSolution);
    },
    answerQuestionBoard: function ( value, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            quextion = mOptions.selectsGame[mOptions.activeQuestion];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        mOptions.activeCounter = false;
        if (mOptions.order != 2) {
            $eXeSelecciona.updateScore(value, instance);
        } else {
            $eXeSelecciona.updateScoreThree(value, instance);
        }
        if (mOptions.showSolution & quextion.audio.trim().length > 5 && mOptions.audioFeedBach) {
            $eXeSelecciona.playSound(quextion.audio.trim(), instance);
            $('#seleccionaLinkAudio-' + instance).show();
        }

        var timeShowSolution = 1000;
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        $('#seleccionaPHits-' + instance).text(mOptions.hits);
        $('#seleccionaPErrors-' + instance).text(mOptions.errors);
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                timeShowSolution = 5000;
                message += " " + mOptions.msgs.msgUseFulInformation;
                $('#seleccionaPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                mOptions.obtainedClue = true;
                $('#seleccionaPShowClue-' + instance).show();
            }
        }
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            if (!$eXeSelecciona.sameQuestion(value, instance)) {
                if (quextion.typeSelect != 2) {
                    $eXeSelecciona.drawSolution(instance);
                } else {
                    var mtipe = value ? 2 : 1;
                    $eXeSelecciona.drawPhrase(quextion.solutionQuestion, quextion.quextion, 100, mtipe, false, instance, true)
                }
            }

        }

        setTimeout(function () {
            $eXeSelecciona.newQuestion(instance, value, false)
        }, timeShowSolution);
    },
    sameQuestion: function (correct, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            q = mOptions.selectsGame[mOptions.activeQuestion];
        return ((correct && q.hits == mOptions.activeQuestion) || (!correct && q.error == mOptions.activeQuestion))
    },

    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            quextion = mOptions.selectsGame[mOptions.activeQuestion],
            message = "",
            obtainedPoints = 0,
            type = 1,
            sscore = 0,
            points = 0;
        if (correctAnswer) {
            mOptions.hits++;
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
                    $eXeSelecciona.updateLives(instance);
                }
            }
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        sscore = mOptions.score;
        if (mOptions.gameMode != 0) {
            sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        }
        $('#seleccionaPScore-' + instance).text(sscore);
        $('#seleccionaPHits-' + instance).text(mOptions.hits);
        $('#seleccionaPErrors-' + instance).text(mOptions.errors);
        message = $eXeSelecciona.getMessageAnswer(correctAnswer, points, instance);
        $eXeSelecciona.showMessage(type, message, instance);

    },
    updateScoreThree: function (correctAnswer, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            quextion = mOptions.selectsGame[mOptions.activeQuestion],
            message = "",
            obtainedPoints = 0,
            type = 1,
            sscore = 0,
            points = 0,
            answerScore = quextion.answerScore;
        if (correctAnswer) {
            quextion.answerScore = quextion.customScore;

            if (answerScore == -1) {
                mOptions.hits++;
                if (mOptions.gameMode == 0) {
                    var pointsTemp = mOptions.counter < 60 ? mOptions.counter * 10 : 600;
                    obtainedPoints = 1000 + pointsTemp;
                    obtainedPoints = quextion.customScore * obtainedPoints;
                    points = obtainedPoints;
                } else {
                    obtainedPoints = quextion.customScore;
                    points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
                }
                type = 2;
                mOptions.scoreGame += quextion.customScore;

            } else if (answerScore == 0) {
                mOptions.hits++;
                mOptions.errors--;
                if (mOptions.gameMode == 0) {
                    var pointsTemp = mOptions.counter < 60 ? mOptions.counter * 10 : 600;
                    obtainedPoints = 1000 + pointsTemp;
                    obtainedPoints = quextion.customScore * obtainedPoints;
                    points = obtainedPoints;
                } else {
                    obtainedPoints = quextion.customScore;
                    points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
                }
                type = 2;
                mOptions.scoreGame += quextion.customScore;

            }
            mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
            sscore = mOptions.score;
            if (mOptions.gameMode != 0) {
                sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
            }
            message = $eXeSelecciona.getMessageAnswer(correctAnswer, points, instance);

        } else {
            quextion.answerScore = 0;
            message = $eXeSelecciona.getMessageErrorAnswerRepeat(instance);
            if (answerScore == -1) {
                mOptions.errors++;
                if (mOptions.gameMode != 0) {
                    message = "";
                } else {
                    obtainedPoints = -330 * quextion.customScore;
                    points = obtainedPoints;
                    if (mOptions.useLives) {
                        mOptions.livesLeft--;
                        $eXeSelecciona.updateLives(instance);
                    }
                }
                message = $eXeSelecciona.getMessageAnswer(correctAnswer, points, instance);
            } else if (answerScore > 0) {
                mOptions.errors++;
                mOptions.hits--;
                if (mOptions.gameMode != 0) {
                    message = "";
                } else {
                    obtainedPoints = -330 * quextion.customScore;
                    points = obtainedPoints;
                    if (mOptions.useLives) {
                        mOptions.livesLeft--;
                        $eXeSelecciona.updateLives(instance);
                    }
                }
                mOptions.scoreGame -= quextion.customScore;
                message = $eXeSelecciona.getMessageAnswer(correctAnswer, points, instance);

            }
            mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
            sscore = mOptions.score;
            if (mOptions.gameMode != 0) {
                sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
            }
        }
        $('#seleccionaPScore-' + instance).text(sscore);
        $('#seleccionaPHits-' + instance).text(mOptions.hits);
        $('#seleccionaPErrors-' + instance).text(mOptions.errors);
        $eXeSelecciona.showMessage(type, message, instance);

    },
    getMessageAnswer: function (correctAnswer, npts, instance) {
        var message = "";
        if (correctAnswer) {
            message = $eXeSelecciona.getMessageCorrectAnswer(npts, instance);
        } else {
            message = $eXeSelecciona.getMessageErrorAnswer(npts, instance);
        }
        return message;
    },
    getMessageCorrectAnswer: function (npts, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            messageCorrect = $eXeSelecciona.getRetroFeedMessages(true, instance),
            message = "",
            pts = typeof mOptions.msgs.msgPoints == 'undefined' ? 'puntos' : mOptions.msgs.msgPoints;
        if (mOptions.customMessages && mOptions.selectsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgHit
            message = mOptions.gameMode < 2 ? message + '. ' + npts + ' ' + pts : message;
        } else {
            message = mOptions.gameMode == 2 ? messageCorrect : messageCorrect + ' ' + npts + ' ' + pts;
        }
        return message;
    },

    getMessageErrorAnswer: function (npts, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            messageError = $eXeSelecciona.getRetroFeedMessages(false, instance),
            message = "",
            pts = typeof mOptions.msgs.msgPoints == 'undefined' ? 'puntos' : mOptions.msgs.msgPoints;
        if (mOptions.customMessages && mOptions.selectsGame[mOptions.activeQuestion].msgError.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgError;
            if (mOptions.gameMode != 2) {
                message = mOptions.useLives ? message + '. ' + mOptions.msgs.msgLoseLive : message + '. ' + npts + ' ' + pts;
            }
        } else {
            message = mOptions.useLives ? messageError + ' ' + mOptions.msgs.msgLoseLive : messageError + ' ' + npts + ' ' + pts;
            message = mOptions.gameMode > 0 ? messageError : message;

        }
        return message;
    },
    getMessageErrorAnswerRepeat: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            message = $eXeSelecciona.getRetroFeedMessages(false, instance);
        if (mOptions.customMessages && mOptions.selectsGame[mOptions.activeQuestion].msgError.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgError;
        }
        return message;
    },
    getMessageCorrectAnswerRepeat: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            message = $eXeSelecciona.getRetroFeedMessages(true, instance);
        if (mOptions.customMessages && mOptions.selectsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgHit
        }
        return message;
    },

    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.yellow],
            mcolor = colors[type],
            weight = type == 0 ? 'normal' : 'normal';
        $('#seleccionaPAuthor-' + instance).text(message);
        $('#seleccionaPAuthor-' + instance).css({
            'color': mcolor,
            'font-weight': weight,
        });
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
    ramdonOptions: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            l = 0,
            letras = "ABCD";
        if (mOptions.question.typeSelect == 1) {
            return;
        }
        var soluciones = mOptions.question.solution;
        for (var j = 0; j < mOptions.question.options.length; j++) {
            if (!(mOptions.question.options[j].trim() == "")) {
                l++;
            }
        }
        var respuestas = mOptions.question.options;
        var respuestasNuevas = [];
        var respuestaCorrectas = [];
        for (var i = 0; i < soluciones.length; i++) {
            var sol = soluciones.charCodeAt(i) - 65;
            respuestaCorrectas.push(respuestas[sol]);
        }
        var respuestasNuevas = mOptions.question.options.slice(0, l)
        respuestasNuevas = $eXeSelecciona.shuffleAds(respuestasNuevas);
        var solucionesNuevas = "";
        for (var j = 0; j < respuestasNuevas.length; j++) {
            for (var z = 0; z < respuestaCorrectas.length; z++) {
                if (respuestasNuevas[j] == respuestaCorrectas[z]) {
                    solucionesNuevas = solucionesNuevas.concat(letras[j]);
                    break;
                }
            }
        }
        mOptions.question.options = [];
        for (var i = 0; i < 4; i++) {
            if (i < respuestasNuevas.length) {
                mOptions.question.options.push(respuestasNuevas[i])
            } else {
                mOptions.question.options.push('');
            }
        }
        mOptions.question.solution = solucionesNuevas;
    },

    drawQuestions: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            bordeColors = [$eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.yellow];
        $('#seleccionaQuestionDiv-' + instance).show();
        $('#seleccionaWordDiv-' + instance).hide();
        $('#seleccionaAnswerDiv-' + instance).show();
        $('#seleccionaOptionsDiv-' + instance + '>.gameQP-Options').each(function (index) {
            var option = mOptions.question.options[index]
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer',
                'color': $eXeSelecciona.colors.black
            }).text(option);
            if (option) {
                $(this).show();
            } else {
                $(this).hide()
            }
        });
        var html = $('#seleccionaQuestionDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeSelecciona.updateLatex('seleccionaQuestionDiv-' + instance)
        }
    },

    drawSolution: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            solution = mQuextion.solution,
            letters = 'ABCD';
        mOptions.gameActived = false;
        $('#seleccionaOptionsDiv-' + instance).find('.gameQP-Options').each(function (i) {
            var css = {};
            if (mQuextion.typeSelect === 1) {
                css = {
                    'border-color': $eXeSelecciona.borderColors.correct,
                    'background-color': $eXeSelecciona.colors.correct,
                    'border-size': '1',
                    'cursor': 'pointer',
                    'color': $eXeSelecciona.borderColors.black
                };
                var text = ''
                if (solution[i] === "A") {
                    text = mQuextion.options[0];
                } else if (solution[i] === "B") {
                    text = mQuextion.options[1];
                } else if (solution[i] === "C") {
                    text = mQuextion.options[2];
                } else if (solution[i] === "D") {
                    text = mQuextion.options[3];
                }
                $(this).text(text);
            } else {
                css = {
                    'border-color': $eXeSelecciona.borderColors.incorrect,
                    'border-size': '1',
                    'background-color': 'transparent',
                    'cursor': 'pointer',
                    'color': $eXeSelecciona.borderColors.grey
                };
                if (solution.indexOf(letters[i]) !== -1) {
                    css = {
                        'border-color': $eXeSelecciona.borderColors.correct,
                        'background-color': $eXeSelecciona.colors.correct,
                        'border-size': '1',
                        'cursor': 'pointer',
                        'color': $eXeSelecciona.borderColors.black
                    }
                }
            }
            $(this).css(css);
        });
    },

    clearQuestions: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        mOptions.respuesta = "";
        $('#seleccionaAnswers-' + instance + '> .gameQP-AnswersOptions').remove();
        var bordeColors = [$eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.yellow];
        $('#seleccionaOptionsDiv-' + instance + '>.gameQP-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer'
            }).text('');
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
        var element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $eXeSelecciona.getFullscreen(element);
        } else {
            $eXeSelecciona.exitFullscreen(element);
        }
        $eXeSelecciona.refreshImageActive(instance);
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
    $eXeSelecciona.init();
});