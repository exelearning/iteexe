/**
 * QuExt Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeQuExt = {
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
        this.activities = $('.quext-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeQuExt.supportedBrowser('quext')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('QuExt') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/quext-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeQuExt.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeQuExt.enable()');
        else this.enable();
        $eXeQuExt.mScorm = scorm;
        var callSucceeded = $eXeQuExt.mScorm.init();
        if (callSucceeded) {
            $eXeQuExt.userName = $eXeQuExt.getUserName();
            $eXeQuExt.previousScore = $eXeQuExt.getPreviousScore();
            $eXeQuExt.mScorm.set("cmi.core.score.max", 10);
            $eXeQuExt.mScorm.set("cmi.core.score.min", 0);
            $eXeQuExt.initialScore = $eXeQuExt.previousScore;
        }
    },
    enable: function () {
        $eXeQuExt.loadGame();
    },
    getUserName: function () {
        var user = $eXeQuExt.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeQuExt.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        if ($eXeQuExt.mScorm && typeof $eXeQuExt.mScorm.quit == "function") {
            $eXeQuExt.mScorm.quit();
        }

    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeQuExt.options[instance],
            text = '';
        $('#quextSendScore-' + instance).hide();
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
            $('#quextSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#quextSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#quextRepeatActivity-' + instance).text(text);
        $('#quextRepeatActivity-' + instance).fadeIn(1000);
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeQuExt.options[instance],
            message = '',
            score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeQuExt.mScorm != 'undefined') {
                if (!auto) {
                    $('#quextSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeQuExt.previousScore !== '') {
                        message = $eXeQuExt.userName !== '' ? $eXeQuExt.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeQuExt.previousScore = score;
                        $eXeQuExt.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeQuExt.userName !== '' ? $eXeQuExt.userName + '. ' + mOptions.msgs.msgYouScore + ': ' + score : mOptions.msgs.msgYouScore + ': ' + score
                        if (!mOptions.repeatActivity) {
                            $('#quextSendScore-' + instance).hide();
                        }
                        $('#quextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score)
                        $('#quextRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeQuExt.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeQuExt.mScorm.set("cmi.core.score.raw", score);
                    $('#quextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score)
                    $('#quextRepeatActivity-' + instance).show();
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
        $eXeQuExt.options = [];
        $eXeQuExt.activities.each(function (i) {
            var version = $(".quext-version", this).eq(0).text(),
                dl = $(".quext-DataGame", this),
                imagesLink = $('.quext-LinkImages', this),
                audioLink = $('.quext-LinkAudios', this),
                mOption = $eXeQuExt.loadDataGame(dl, imagesLink, audioLink, version),
                msg = mOption.msgs.msgPlayStart;
            $eXeQuExt.options.push(mOption);
            var quext = $eXeQuExt.createInterfaceQuExt(i);
            dl.before(quext).remove();
            $('#quextGameMinimize-' + i).hide();
            $('#quextGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#quextGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#quextGameContainer-' + i).show();
            }
            $('#quextMessageMaximize-' + i).text(msg);
            $('#quextDivFeedBack-' + i).prepend($('.quext-feedback-game', this));
            $eXeQuExt.addEvents(i);
            $('#quextDivFeedBack-' + i).hide();
        });
        if ($eXeQuExt.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeQuExt.loadMathJax();
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
    createInterfaceQuExt: function (instance) {
        var html = '',
            path = $eXeQuExt.idevicePath,
            msgs = $eXeQuExt.options[instance].msgs;
        html += '<div class="gameQP-MainContainer">\
        <div class="gameQP-GameMinimize" id="quextGameMinimize-' + instance + '">\
            <a href="#" class="gameQP-LinkMaximize" id="quextLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'quextIcon.png" class="gameQP-IconMinimize gameQP-Activo" alt="">\
                <div class="gameQP-MessageMaximize" id="quextMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="gameQP-GameContainer" id="quextGameContainer-' + instance + '">\
            <div class="gameQP-GameScoreBoard">\
                <div class="gameQP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="quextPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="quextPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="quextPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="quextPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="gameQP-LifesGame" id="quextLifesGame-' + instance + '">\
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
                <div class="gameQP-NumberLifesGame" id="quextNumberLivesGame-' + instance + '">\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="quextPLifes-' + instance + '">0</p>\
                </div>\
                <div class="gameQP-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
                    <p id="quextPTime-' + instance + '" class="gameQP-PTime">00:00</p>\
                    <a href="#" class="gameQP-LinkMinimize" id="quextLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize gameQP-Activo"></div>\
                    </a>\
                    <a href="#" class="gameQP-LinkFullScreen" id="quextLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen gameQP-Activo" id="quextFullScreen-' + instance + '"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="gameQP-ShowClue" id="quextShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="gameQP-PShowClue gameQP-parpadea" id="quextPShowClue-' + instance + '"></p>\
            </div>\
            <div class="gameQP-Multimedia" id="quextMultimedia-' + instance + '">\
                <img class="gameQP-Cursor" id="quextCursor-' + instance + '" src="' + path + 'exequextcursor.gif" alt="" />\
                <img  src="" class="gameQP-Images" id="quextImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <div class="gameQP-EText" id="quextEText-' + instance + '"></div>\
                <img src="' + path + 'quextHome.png" class="gameQP-Cover" id="quextCover-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <div class="gameQP-Video" id="quextVideo-' + instance + '"></div>\
                <video class="gameQP-Video" id = "quextVideoLocal-' + instance + '" preload="auto" controls></video>\
                <div class="gameQP-Protector" id="quextProtector-' + instance + '"></div>\
                <a href="#" class="gameQP-LinkAudio" id="quextLinkAudio-' + instance + '" title="' + msgs.msgAudio + '"><img src="' + path + 'exequextaudio.png" class="gameQP-Activo" alt="' + msgs.msgAudio + '">\</a>\
                <div class="gameQP-GameOver" id="quextGamerOver-' + instance + '">\
                        <div class="gameQP-DataImage">\
                            <img src="' + path + 'exequextwon.png" class="gameQP-HistGGame" id="quextHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                            <img src="' + path + 'exequextlost.png" class="gameQP-LostGGame" id="quextLostGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                        </div>\
                        <div class="gameQP-DataScore">\
                            <p id="quextOverScore-' + instance + '">Score: 0</p>\
                            <p id="quextOverHits-' + instance + '">Hits: 0</p>\
                            <p id="quextOverErrors-' + instance + '">Errors: 0</p>\
                        </div>\
                </div>\
            </div>\
            <div class="gameQP-AuthorLicence" id="quextAuthorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="quextPAuthor-' + instance + '"></p>\
            </div>\
            <div class="sr-av" id="quextStartGameSRAV-' + instance + '">' + msgs.msgPlayStart + ':</div>\
            <div class="gameQP-StartGame"><a href="#" id="quextStartGame-' + instance + '"></a></div>\
            <div class="gameQP-QuestionDiv" id="quextQuestionDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <p class="gameQP-Question" id="quextQuestion-' + instance + '"></p>\
                <div class="gameQP-OptionsDiv" id="quextOptionsDiv-' + instance + '">\
                    <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                    <a href="#" class="gameQP-Option1 gameQP-Options" id="quextOption1-' + instance + '" data-number="0"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                    <a href="#" class="gameQP-Option2 gameQP-Options" id="quextOption2-' + instance + '" data-number="1" ></a>\
                    <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                    <a href="#" class="gameQP-Option3 gameQP-Options" id="quextOption3-' + instance + '" data-number="2" ></a>\
                    <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                    <a href="#" class="gameQP-Option4 gameQP-Options" id="quextOption4-' + instance + '" data-number="3"></a>\
                </div>\
            </div>\
            <div class="gameQP-VideoIntroContainer" id="quextVideoIntroContainer-' + instance + '">\
                <a href="#" class="gameQP-LinkVideoIntroShow" id="quextLinkVideoIntroShow-' + instance + '" title="' + msgs.msgVideoIntro + '">\
                    <strong><span class="sr-av">' + msgs.msgVideoIntro + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Video gameQP-Activo"></div>\
                </a>\
            </div>\
            <div class="gameQP-VideoIntroDiv" id="quextVideoIntroDiv-' + instance + '">\
                <div class="gameQP-VideoIntro" id="quextVideoIntro-' + instance + '"></div>\
                <video class="gameQP-VideoIntro" id = "quextVideoIntroLocal-' + instance + '" preload="auto" controls width="100%" height="100%" ></video>\
                <input type="button" class="gameQP-VideoIntroClose" id="quextVideoIntroClose-' + instance + '" value="' + msgs.msgClose + '" />\
            </div>\
            <div class="gameQP-DivFeedBack" id="quextDivFeedBack-' + instance + '">\
                <input type="button" id="quextFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
            <div class="gameQP-Cubierta" id="quextCubierta-' + instance + '" style="display:none">\
                <div class="gameQP-CodeAccessDiv" id="quextCodeAccessDiv-' + instance + '">\
                    <p class="gameQP-MessageCodeAccessE" id="quextMesajeAccesCodeE-' + instance + '"></p>\
                    <div class="gameQP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="gameQP-CodeAccessE"  id="quextCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="quextCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
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
            $('#quextCubierta-' + instance).fadeOut();
            return;
        }
        $('#quextCubierta-' + instance).fadeIn();
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        var butonScore = "";
        var fB = '<div class="gameQP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="gameQP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="quextSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton gameQP-SendScore" /> <span class="gameQP-RepeatActivity" id="quextRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="gameQP-GetScore">';
                fB += '<p><span class="gameQP-RepeatActivity" id="quextRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
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

    loadDataGame: function (data, imgsLink, audioLink, version) {
        var json = data.text();
        version = typeof version == "undefined" || version == '' ? 0 : parseInt(version);
        if (version > 0) {
            json = $eXeQuExt.Decrypt(json);
        }
        var mOptions = $eXeQuExt.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeQuExt.hasLATEX = true;
        }
        mOptions.gameOver = false;
        mOptions.hasVideo = false;
        mOptions.waitStart = false;
        mOptions.waitPlayIntro = false;
        mOptions.hasVideoIntro = false;
        mOptions.gameStarted = false;
        mOptions.durationVideoIntro = mOptions.endVideo + 100;
        mOptions.percentajeQuestions = typeof mOptions.percentajeQuestions != 'undefined' ? mOptions.percentajeQuestions : 100;
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            mOptions.questionsGame[i].audio = typeof mOptions.questionsGame[i].audio == 'undefined' ? '' : mOptions.questionsGame[i].audio
            if (mOptions.questionsGame[i].type != 2) {
                mOptions.questionsGame[i].url = $eXeQuExt.extractURLGD(mOptions.questionsGame[i].url);
            }
            var idyt = $eXeQuExt.getIDYoutube(mOptions.questionsGame[i].url)
            if (mOptions.questionsGame[i].type == 2 && idyt) {
                mOptions.hasVideo = true;
            }
        }
        mOptions.scoreGame = 0;
        mOptions.scoreTotal = 0;
        mOptions.playerAudio = "";
        mOptions.gameMode = typeof mOptions.gameMode != 'undefined' ? mOptions.gameMode : 0;
        mOptions.percentajeFB = typeof mOptions.percentajeFB != 'undefined' ? mOptions.percentajeFB : 100;
        mOptions.customMessages = typeof mOptions.customMessages != 'undefined' ? mOptions.customMessages : false;
        mOptions.useLives = mOptions.gameMode != 0 ? false : mOptions.useLives;
        mOptions.gameOver = false;
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
        mOptions.questionsGame = $eXeQuExt.getQuestions(mOptions.questionsGame, mOptions.percentajeQuestions);
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            if (mOptions.customScore) {
                mOptions.scoreTotal += mOptions.questionsGame[i].customScore;
            } else {
                mOptions.questionsGame[i].customScore = 1
                mOptions.scoreTotal += mOptions.questionsGame[i].customScore
            }
        }
        mOptions.questionsGame = mOptions.optionsRamdon ? $eXeQuExt.shuffleAds(mOptions.questionsGame) : mOptions.questionsGame;
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
                array = $eXeQuExt.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
    preloadGame: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.waitStart) {
            mOptions.waitStart = false;
            setTimeout(function () {
                $eXeQuExt.startGame(instance);
                $('#quextStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
            }, 1000);
        } else if (mOptions.waitPlayIntro) {
            mOptions.waitPlayIntro = false;
            setTimeout(function () {
                $eXeQuExt.playVideoIntro(instance);
                $('#quextStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
            }, 1000);
        }
    },

    playSound: function (selectedFile, instance) {
        var mOptions = $eXeQuExt.options[instance];
        selectedFile = $eXeQuExt.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile);
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });

    },
    stopSound: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
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
    getYTAPI: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        mOptions.questionsGame = mOptions.optionsRamdon ? $eXeQuExt.shuffleAds(mOptions.questionsGame) : mOptions.questionsGame;
        if ((typeof (mOptions.player) == "undefined") && mOptions.hasVideo) {
            $('#quextStartGame-' + instance).text(mOptions.msgs.msgLoading);
            mOptions.waitStart = true;
            if (typeof (YT) !== "undefined") {
                $eXeQuExt.youTubeReadyOne(instance);
            } else {
                $eXeQuExt.loadYoutubeApi();
            }
        } else {
            $eXeQuExt.startGame(instance);
        }
    },
    getYTVideoIntro: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if ((typeof (mOptions.playerIntro) == "undefined") && mOptions.hasVideoIntro) {
            $('#quextStartGame-' + instance).text(mOptions.msgs.msgLoading);
            mOptions.waitPlayIntro = true;
            if (typeof (YT) !== "undefined") {
                $eXeQuExt.youTubeReadyOne(instance);
            } else {
                $eXeQuExt.loadYoutubeApi();
            }

        } else {
            $eXeQuExt.playVideoIntro(instance);
        }
    },
    youTubeReady: function () {
        for (var i = 0; i < $eXeQuExt.options.length; i++) {
            var mOptions = $eXeQuExt.options[i];
            mOptions.player = new YT.Player('quextVideo-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 0
                },
                events: {
                    'onReady': $eXeQuExt.onPlayerReady,
                    'onError': $eXeQuExt.onPlayerError
                }
            });

            mOptions.playerIntro = new YT.Player('quextVideoIntro-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 1
                },
            });
            $('#quextVideo-' + i).hide();

        }
    },
    youTubeReadyOne: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        mOptions.player = new YT.Player('quextVideo-' + instance, {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onReady': $eXeQuExt.onPlayerReady,
                'onError': $eXeQuExt.onPlayerError
            }
        });
        $('#quextVideo-' + instance).hide();
        mOptions.playerIntro = new YT.Player('quextVideoIntro-' + instance, {
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
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeQuExt.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        var video = 'quextVideo-0';
        if ((event.target.h) && (event.target.h.id)) {
            video = event.target.h.id;
        } else if ((event.target.i) && (event.target.i.id)) {
            video = event.target.i.id;
        }else if ((event.target.g) && (event.target.g.id)) {
            video = event.target.g.id;
        }
        video = video.split("-");
        if (video.length == 2 && (video[0] == "quextVideo" || video[0] == "quextVideoIntro")) {
            var instance = parseInt(video[1]);
            if (!isNaN(instance)) {
                $eXeQuExt.preloadGame(instance);
            }

        }
    },
    updateTimerDisplayLocal: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.localPlayer) {
            var currentTime = mOptions.localPlayer.currentTime;
            if (currentTime) {
                $eXeQuExt.updateSoundVideoLocal(instance);
                if (Math.ceil(currentTime) == mOptions.pointEnd || Math.ceil(currentTime) == mOptions.durationVideo) {
                    mOptions.localPlayer.pause();
                    mOptions.pointEnd = 100000;
                }
            }
        }
    },
    updateTimerDisplayLocalIntro: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.localPlayerIntro) {
            var currentTime = mOptions.localPlayerIntro.currentTime;

            if (currentTime) {
                if (Math.ceil(currentTime) == mOptions.pointEndIntro || Math.ceil(currentTime) == mOptions.durationVideoIntro) {
                    mOptions.localPlayerIntro.pause();
                    mOptions.pointEndIntro = 100000;
                    clearInterval(mOptions.timeUpdateIntervalIntro);
                }
            }
        }
    },
    updateSoundVideoLocal: function (instance) {
        var mOptions = $eXeQuExt.options[instance];

        if (mOptions.activeSilent) {
            if (mOptions.localPlayer) {
                if (mOptions.localPlayer.currentTime) {
                    var time = Math.round(mOptions.localPlayer.currentTime);
                    if (time == mOptions.question.silentVideo) {
                        mOptions.localPlayer.muted = true;
                    } else if (time == mOptions.endSilent) {
                        mOptions.localPlayer.muted = false;
                    }
                }
            }
        }
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideoIntro: function (id, start, end, instance, type) {
        var mOptions = $eXeQuExt.options[instance],
            mstart = start < 1 ? 0.1 : start;
            $('#quextVideoIntro-' + instance).hide();
            $('#quextVideoIntroLocal-' + instance).hide();

        if (type == 1) {
            if (mOptions.localPlayerIntro) {
                mOptions.pointEndIntro = end;
                mOptions.localPlayerIntro.src = id
                mOptions.localPlayerIntro.currentTime = parseFloat(start)
                if (typeof mOptions.localPlayerIntro.play == "function") {
                    mOptions.localPlayerIntro.play();
                }
            }
            clearInterval(mOptions.timeUpdateIntervalIntro);
            mOptions.timeUpdateIntervalIntro = setInterval(function () {
                $eXeQuExt.updateTimerDisplayLocalIntro(instance);
            }, 1000);
         
            $('#quextVideoIntroLocal-' + instance).show();
            return
        }
        if (mOptions.playerIntro) {
            if (typeof mOptions.playerIntro.loadVideoById == "function") {
                mOptions.playerIntro.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
            $('#quextVideoIntro-' + instance).show();
        }
    },
    startVideo: function (id, start, end, instance, type) {
        var mOptions = $eXeQuExt.options[instance],
            mstart = start < 1 ? 0.1 : start;
        if (type == 1) {
            if (mOptions.localPlayer) {
                mOptions.pointEnd = end;
                mOptions.localPlayer.src = id
                mOptions.localPlayer.currentTime = parseFloat(start)
                if (typeof mOptions.localPlayer.play == "function") {
                    mOptions.localPlayer.play();
                }
            }
            clearInterval(mOptions.timeUpdateInterval);
            mOptions.timeUpdateInterval = setInterval(function () {
                $eXeQuExt.updateTimerDisplayLocal(instance);
            }, 1000);
            return
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
    stopVideo: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.localPlayer) {
            if (typeof mOptions.localPlayer.pause == "function") {
                mOptions.localPlayer.pause();
            }
        }
        if (mOptions.player) {
            if (typeof mOptions.player.pauseVideo == "function") {
                mOptions.player.pauseVideo();
            }
        }
    },
    stopVideoIntro: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.localPlayerIntro) {
            if (typeof mOptions.localPlayerIntro.pause == "function") {
                mOptions.localPlayerIntro.pause();
            }
        }
        if (mOptions.playerIntro) {
            if (typeof mOptions.playerIntro.pauseVideo == "function") {
                mOptions.playerIntro.pauseVideo();
            }
        }
    },
    muteVideo: function (mute, instance, type) {
        var mOptions = $eXeQuExt.options[instance];
        if (type == 1) {
            if (mOptions.localPlayer) {
                if (mute) {
                    mOptions.localPlayer.muted = true;
                } else {
                    mOptions.localPlayer.muted = false;;
                }
            }
            return
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
    addEvents: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        window.addEventListener('unload', function () {
            $eXeQuExt.endScorm();
        });
        window.addEventListener('resize', function () {
            $eXeQuExt.refreshImageActive(instance);
        });
        mOptions.localPlayer = document.getElementById('quextVideoLocal-' + instance);
        mOptions.localPlayerIntro = document.getElementById('quextVideoIntroLocal-' + instance);
        $('videoquextGamerOver-' + instance).css('display', 'flex');
        $('#quextLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#quextGameContainer-" + instance).show()
            $("#quextGameMinimize-" + instance).hide();
            $eXeQuExt.refreshImageActive(instance);
        });
        $("#quextLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#quextGameContainer-" + instance).hide();
            $("#quextGameMinimize-" + instance).css('visibility', 'visible').show();
            return true;
        });
        $('#quextSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeQuExt.sendScore(false, instance);
            return true;
        });
        $('#quextGamerOver-' + instance).hide();
        $('#quextCodeAccessDiv-' + instance).hide();
        $('#quextVideo-' + instance).hide();
        $('#quextVideoLocal-' + instance).hide();
        $('#quextImagen-' + instance).hide();
        $('#quextCursor-' + instance).hide();
        $('#quextCover-' + instance).show();
        $('#quextCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeQuExt.enterCodeAccess(instance);
        });
        $('#quextCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeQuExt.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        mOptions.livesLeft = mOptions.numberLives;

        $("#quextOptionsDiv-" + instance).on('click touchstart', '.gameQP-Options', function (e) {
            e.preventDefault();
            var respuesta = $(this).data('number');
            $eXeQuExt.answerQuestion(respuesta, instance);
        });

        $("#quextLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('quextGameContainer-' + instance);
            $eXeQuExt.toggleFullscreen(element, instance);
        });
        $eXeQuExt.updateLives(instance);
        $('#quextInstructions-' + instance).text(mOptions.instructions);

        $('#quextPNumber-' + instance).text(mOptions.numberQuestions);
        $('#quextGameContainer-' + instance + ' .gameQP-StartGame').show();
        $('#quextQuestionDiv-' + instance).hide();
        if (mOptions.itinerary.showCodeAccess) {
            $('#quextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#quextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#quextCodeAccessDiv-' + instance).show();
            $('#quextGameContainer-' + instance + ' .gameQP-StartGame').hide();
            $eXeQuExt.showCubiertaOptions(true, instance)
        }
        $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function (e) {
            var fullScreenElement =
                document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            $eXeQuExt.refreshImageActive(instance);
        });
        $('#quextInstruction-' + instance).text(mOptions.instructions);
        $('#quextSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#quextSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeQuExt.updateScorm($eXeQuExt.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#quextPShowClue-' + instance).hide();
        mOptions.gameOver = false;
        $('#quextLinkVideoIntroShow-' + instance).hide();
        if ($eXeQuExt.getIDYoutube(mOptions.idVideo) !== '' || $eXeQuExt.getURLVideoMediaTeca(mOptions.idVideo)) {
            if ($eXeQuExt.getIDYoutube(mOptions.idVideo) !== '') {
                mOptions.hasVideoIntro = true;
            }
            $('#quextVideoIntroContainer-' + instance).css('display', 'flex');
            $('#quextVideoIntroContainer-' + instance).show();
            $('#quextLinkVideoIntroShow-' + instance).show();
        }

        $('#quextLinkVideoIntroShow-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            if ($eXeQuExt.getURLVideoMediaTeca(mOptions.idVideo)) {
                $eXeQuExt.playVideoIntroLocal(instance)
            } else {
                $eXeQuExt.getYTVideoIntro(instance)
            }
        });

        $('#quextVideoIntroClose-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#quextVideoIntroDiv-' + instance).hide();

            $('#quextStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
            $eXeQuExt.stopVideoIntro(instance);
        });

        $('#quextStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#quextStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeQuExt.getYTAPI(instance);

        });
        $('#quextFeedBackClose-' + instance).on('click', function (e) {
            $('#quextDivFeedBack-' + instance).hide();
        });
        $('#quextLinkAudio-' + instance).on('click', function (e) {
            e.preventDefault();
            var audio = mOptions.questionsGame[mOptions.activeQuestion].audio;
            $eXeQuExt.stopSound(instance);
            $eXeQuExt.playSound(audio, instance);
        });


        if (mOptions.gameMode == 2) {
            $('#quextGameContainer-' + instance).find('.exeQuextIcons-Hit').hide();
            $('#quextGameContainer-' + instance).find('.exeQuextIcons-Error').hide();
            $('#quextPErrors-' + instance).hide();
            $('#quextPHits-' + instance).hide();
            $('#quextGameContainer-' + instance).find('.exeQuextIcons-Score').hide();
            $('#quextPScore-' + instance).hide();
        }

    },
    playVideoIntro: function (instance) {
        $('#quextVideoIntroDiv-' + instance).show();
        var mOptions = $eXeQuExt.options[instance],
            idVideo = $eXeQuExt.getIDYoutube(mOptions.idVideo);
        mOptions.endVideo = mOptions.endVideo <= mOptions.startVideo ? 36000 : mOptions.endVideo;
        $eXeQuExt.startVideoIntro(idVideo, mOptions.startVideo, mOptions.endVideo, instance, 0);
    },
    playVideoIntroLocal(instance) {
        $('#quextVideoIntroDiv-' + instance).show();
        var mOptions = $eXeQuExt.options[instance],
            idVideo = $eXeQuExt.getURLVideoMediaTeca(mOptions.idVideo);
        mOptions.endVideo = mOptions.endVideo <= mOptions.startVideo ? 36000 : mOptions.endVideo;

        $eXeQuExt.startVideoIntro(idVideo, mOptions.startVideo, mOptions.endVideo, instance, 1);
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeQuExt.options[instance],
            mQuextion = mOptions.questionsGame[mOptions.activeQuestion],
            author = '';
        if (mOptions.gameOver) {
            return;
        }
        if (typeof mQuextion == "undefined") {
            return;
        }
        if (mQuextion.type === 1) {
            $('#quextImagen-' + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = mOptions.msgs.msgNoImage;
                        $('#quextAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeQuExt.drawImage(this, mData);
                        $('#quextImagen-' + instance).show();
                        $('#quextCover-' + instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#quextCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            author = mQuextion.author;
                            $('#quextCursor-' + instance).show();
                        }
                    }
                    $eXeQuExt.showMessage(0, author, instance);
                });
            $('#quextImagen-' + instance).attr('alt', mQuextion.alt);
        }
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() === $('#quextCodeAccessE-' + instance).val().toLowerCase()) {
            $eXeQuExt.showCubiertaOptions(false, instance);
            $eXeQuExt.getYTAPI(instance);
        } else {
            $('#quextMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#quextCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeQuExt.options[instance],
            msgs = mOptions.msgs,
            $quextHistGame = $('#quextHistGame-' + instance),
            $quextLostGame = $('#quextLostGame-' + instance),
            $quextOverPoint = $('#quextOverScore-' + instance),
            $quextOverHits = $('#quextOverHits-' + instance),
            $quextOverErrors = $('#quextOverErrors-' + instance),
            $quextPShowClue = $('#quextPShowClue-' + instance),
            $quextGamerOver = $('#quextGamerOver-' + instance),
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
        $eXeQuExt.showMessage(messageColor, message, instance);
        var msscore = mOptions.gameMode == 0 ? '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score : '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score.toFixed(2);
        $quextOverPoint.html(msscore);
        $quextOverHits.html('<strong>' + msgs.msgHits + ':</strong> ' + mOptions.hits);
        $quextOverErrors.html('<strong>' + msgs.msgErrors + ':</strong> ' + mOptions.errors);
        if (mOptions.gameMode == 2) {
            $('#quextGameContainer-' + instance).find('.gameQP-DataGameScore').hide();
        }
        $quextGamerOver.show();
    },
    startGame: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.scoreGame = 0;
        mOptions.obtainedClue = false;
        $('#quextVideoIntroContainer-' + instance).hide();
        $('#quextLinkVideoIntroShow-' + instance).hide();
        $('#quextPShowClue-' + instance).hide();
        $('#quextPShowClue-' + instance).text("");
        $('#quextGameContainer-' + instance + ' .gameQP-StartGame').hide();
        $('#quextQuestionDiv-' + instance).show();
        $('#quextQuestion-' + instance).text('');
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = false;
        mOptions.activeQuestion = -1;
        mOptions.validQuestions = mOptions.numberQuestions;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        mOptions.livesLeft = mOptions.numberLives;
        $eXeQuExt.updateLives(instance);
        $('#quextPNumber-' + instance).text(mOptions.numberQuestions);
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeQuExt.uptateTime(mOptions.counter, instance);
                $eXeQuExt.updateSoundVideo(instance);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    var timeShowSolution = 1000;
                    if (mOptions.showSolution) {
                        timeShowSolution = mOptions.timeShowSolution * 1000;
                        $eXeQuExt.drawSolution(instance);
                    }
                    setTimeout(function () {
                        $eXeQuExt.newQuestion(instance)
                    }, timeShowSolution);
                    return;
                }
            }

        }, 1000);
        $eXeQuExt.uptateTime(0, instance);
        $('#quextGamerOver-' + instance).hide();
        $('#quextPHits-' + instance).text(mOptions.hits);
        $('#quextPErrors-' + instance).text(mOptions.errors);
        $('#quextPScore-' + instance).text(mOptions.score);
        mOptions.gameStarted = true;
        $eXeQuExt.newQuestion(instance);
    },
    updateSoundVideo: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
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
        var mTime = $eXeQuExt.getTimeToString(tiempo);
        $('#quextPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeQuExt.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        clearInterval(mOptions.counterClock);
        $('#quextVideo-' + instance).hide();
        $('#quextVideoLocal-' + instance).hide();
        $('#quextLinkAudio-' + instance).hide();
        $eXeQuExt.startVideo('', 0, 0, instance, 0);
        $eXeQuExt.stopVideo(instance);
        $eXeQuExt.stopSound(instance);
        $('#quextImagen-' + instance).hide();
        $('#quextEText-' + instance).hide();
        $('#quextCursor-' + instance).hide();
        $('#quextCover-' + instance).hide();
        var message = type === 0 ? mOptions.msgs.msgAllQuestions : mOptions.msgs.msgLostLives;
        $eXeQuExt.showMessage(0, message, instance);
        $eXeQuExt.showScoreGame(type, instance);
        $eXeQuExt.clearQuestions(instance);
        $('#quextPNumber-' + instance).text('0');
        $('#quextStartGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#quextGameContainer-' + instance + ' .gameQP-StartGame').show();
        $('#quextQuestionDiv-' + instance).hide();
        if ($eXeQuExt.getIDYoutube(mOptions.idVideo) !== '' || $eXeQuExt.getURLVideoMediaTeca(mOptions.idVideo)) {
            $('#quextVideoIntroContainer-' + instance).css('display', 'flex');
            $('#quextVideoIntroContainer-' + instance).show();
            $('#quextLinkVideoIntroShow-' + instance).show();
        }
        mOptions.gameOver = true;
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeQuExt.initialScore === '') {
                var score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
                $eXeQuExt.sendScore(true, instance);
                $('#quextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeQuExt.initialScore = score;
            }
        }
        clearInterval(mOptions.timeUpdateInterval);
        clearInterval(mOptions.timeUpdateIntervalIntro);
        $eXeQuExt.showFeedBack(instance);
    },
    showFeedBack: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.questionsGame.length;
        if (mOptions.gameMode == 2 || mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#quextDivFeedBack-' + instance).find('.quext-feedback-game').show();
                $('#quextDivFeedBack-' + instance).show();
            } else {
                $eXeQuExt.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance);
            }
        }
    },
    drawText: function (texto, color) {},
    showQuestion: function (i, instance) {
        var mOptions = $eXeQuExt.options[instance],
            mQuextion = mOptions.questionsGame[i],
            q = mQuextion;
        mOptions.gameActived = true;
        mOptions.question = mQuextion
        if (mOptions.answersRamdon) {
            $eXeQuExt.ramdonOptions(instance);
        }
        var tiempo = $eXeQuExt.getTimeToString($eXeQuExt.getTimeSeconds(mQuextion.time)),
            author = '',
            alt = '';
        $('#quextPTime-' + instance).text(tiempo);
        $('#quextQuestion-' + instance).text(mQuextion.quextion);
        $('#quextImagen-' + instance).hide();
        $('#quextCover-' + instance).show();
        $('#quextEText-' + instance).hide();
        $('#quextVideo-' + instance).hide();
        $('#quextVideoLocal-' + instance).hide();
        $('#quextLinkAudio-' + instance).hide();
        $('#quextPAuthor-' + instance).text('');
        $eXeQuExt.stopVideo(instance)
        $('#quextCursor-' + instance).hide();
        $eXeQuExt.showMessage(0, '', instance);
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeQuExt.initialScore === '') {
                var score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
                $eXeQuExt.sendScore(true, instance);
                $('#quextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        mOptions.activeSilent = (q.type == 2) && (q.soundVideo == 1) && (q.tSilentVideo > 0) && (q.silentVideo >= q.iVideo) && (q.iVideo < q.fVideo);
        var endSonido = parseInt(q.silentVideo) + parseInt(q.tSilentVideo);
        mOptions.endSilent = endSonido > q.fVideo ? q.fVideo : endSonido;
        if (mQuextion.type === 1) {
            $("#quextImagen-" + instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        alt = mOptions.msgs.msgNoImage;
                        $('#quextPAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeQuExt.drawImage(this, mData);
                        $('#quextImagen-' + instance).show();
                        $('#quextCover-' + instance).hide();
                        $('#quextCursor-' + instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#quextCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            $('#quextCursor-' + instance).show();
                        }
                    }
                    author = mQuextion.author;
                    $eXeQuExt.showMessage(0, author, instance);
                });
            $('#quextImagen-' + instance).attr('alt', alt);
        } else if (mQuextion.type === 3) {
            var text = unescape(mQuextion.eText);
            if (window.innerWidth < 401) {
                //text = $eXeQuExt.reduceText(text);
            }
            $("#quextEText-" + instance).html(text);
            $('#quextEText-' + instance).show();
            $('#quextCover-' + instance).hide();
            $eXeQuExt.showMessage(0, '', instance);
        } else if (mQuextion.type === 2) {
            $('#quextVideo-' + instance).show();
            var idVideo = $eXeQuExt.getIDYoutube(mQuextion.url),
                urllv = $eXeQuExt.getURLVideoMediaTeca(mQuextion.url),
                type = urllv ? 1 : 0,
                id = type == 0 ? idVideo : urllv;
            $eXeQuExt.startVideo(id, mQuextion.iVideo, mQuextion.fVideo, instance, type);
            $eXeQuExt.showMessage(0, '', instance);
            $('#quextVideo-' + instance).hide();
            $('#quextVideoLocal-' + instance).hide();
            $('#quextCover-' + instance).hide();
            if (mQuextion.imageVideo === 0) {
                $('#quextCover-' + instance).show();
            } else {
                if (type == 1) {
                    $('#quextVideoLocal-' + instance).show();
                } else {
                    $('#quextVideo-' + instance).show();
                }
            }
            if (mQuextion.soundVideo === 0) {
                $eXeQuExt.muteVideo(true, instance, type);
            } else {
                $eXeQuExt.muteVideo(false, instance, type);
            }
        }
        if (q.audio.length > 4 && q.type != 2) {
            $('#quextLinkAudio-' + instance).show();
        }

        $eXeQuExt.stopSound(instance);
        if (q.type != 2 && q.audio.trim().length > 5) {
            $eXeQuExt.playSound(q.audio.trim(), instance);
        }
        $eXeQuExt.drawQuestions(instance);
        var html = $('#quextQuestionDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeQuExt.updateLatex('quextQuestionDiv-' + instance)
        }
    },
    getURLVideoMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;
            if (matc) {
                var id = url.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
                id = 'http://mediateca.educa.madrid.org/streaming.php?id=' + id;
                return id;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    getURLAudioMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/audio/") != -1;
            var matc1 = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;

            if (matc) {
                var id = url.split("https://mediateca.educa.madrid.org/audio/")[1].split("?")[0];
                id = 'https://mediateca.educa.madrid.org/streaming.php?id=' + id;
                return id;
            }
            if (matc1) {
                var id = url.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
                id = 'https://mediateca.educa.madrid.org/streaming.php?id=' + id;
                return id;
            } else {
                return false;
            }
        } else {
            return false;
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
        var mOptions = $eXeQuExt.options[instance];
        $('#quextPLifes-' + instance).text(mOptions.livesLeft);
        $('#quextLifesGame-' + instance).find('.exeQuextIcons-Life').each(function (index) {
            $(this).hide();
            if (mOptions.useLives) {
                $(this).show();
                if (index >= mOptions.livesLeft) {
                    $(this).hide();
                }
            }
        });
        if (!mOptions.useLives) {
            $('#quextNumberLivesGame-' + instance).hide();
        }
    },

    newQuestion: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeQuExt.gameOver(1, instance);
            return;
        }
        var mActiveQuestion = $eXeQuExt.updateNumberQuestion(mOptions.activeQuestion, instance);
        if (mActiveQuestion === -10) {
            $('quextPNumber-' + instance).text('0');
            $eXeQuExt.gameOver(0, instance);
            return;
        } else {
            mOptions.counter = $eXeQuExt.getTimeSeconds(mOptions.questionsGame[mActiveQuestion].time);
            if (mOptions.questionsGame[mActiveQuestion].type === 2) {
                var durationVideo = mOptions.questionsGame[mActiveQuestion].fVideo - mOptions.questionsGame[mActiveQuestion].iVideo;
                mOptions.counter += durationVideo;
            }
            $eXeQuExt.showQuestion(mActiveQuestion, instance)
            mOptions.activeCounter = true;
            var numQ = mOptions.numberQuestions - mActiveQuestion;
            $('#quextPNumber-' + instance).text(numQ);
        };
    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600]
        return times[iT];
    },
    updateNumberQuestion: function (numq, instance) {
        var mOptions = $eXeQuExt.options[instance],
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },
    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeQuExt.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },


    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeQuExt.options[instance],
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
                    $eXeQuExt.updateLives(instance);
                }
            }
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        sscore = mOptions.score;
        if (mOptions.gameMode != 0) {
            sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        }
        $('#quextPScore-' + instance).text(sscore);
        $('#quextPHits-' + instance).text(mOptions.hits);
        $('#vquextPErrors-' + instance).text(mOptions.errors);
        message = $eXeQuExt.getMessageAnswer(correctAnswer, points, instance);
        $eXeQuExt.showMessage(type, message, instance);
    },

    getMessageAnswer: function (correctAnswer, npts, instance) {
        var mOptions = $eXeQuExt.options[instance];
        var message = "",
            q = mOptions.questionsGame[mOptions.activeQuestion];
        if (correctAnswer) {
            message = $eXeQuExt.getMessageCorrectAnswer(npts, instance);
        } else {
            message = $eXeQuExt.getMessageErrorAnswer(npts, instance);
        }
        if (mOptions.showSolution && q.typeQuestion == 1) {
            message += ': ' + q.solutionQuestion;
        }
        return message;
    },
    getMessageCorrectAnswer: function (npts, instance) {
        var mOptions = $eXeQuExt.options[instance],
            messageCorrect = $eXeQuExt.getRetroFeedMessages(true, instance),
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
        var mOptions = $eXeQuExt.options[instance],
            messageError = $eXeQuExt.getRetroFeedMessages(false, instance),
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
    answerQuestion: function (respuesta, instance) {
        var mOptions = $eXeQuExt.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        var solution = mOptions.question.solution;
        var answord = parseInt(respuesta);
        mOptions.activeCounter = false;
        $eXeQuExt.updateScore(solution == answord, instance);
        mOptions.activeCounter = false;
        var timeShowSolution = 1000;
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        $('#quextPHits-' + instance).text(mOptions.hits);
        $('#quextPErrors-' + instance).text(mOptions.errors);
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                timeShowSolution = 5000;
                //message += " "+mOptions.msgs.msgUseFulInformation;
                $('#quextPShowClue-' + instance).show();
                $('#quextPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                mOptions.obtainedClue = true;
            }
        }
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            $eXeQuExt.drawSolution(instance);
        }

        setTimeout(function () {
            $eXeQuExt.newQuestion(instance)
        }, timeShowSolution);
    },
    reduceText: function (text) {
        var rText = text;
        for (var i = 8; i < 40; i++) {
            var normal = i + 'pt';
            var re = new RegExp(normal, "gi");
            var reducido = (i - 3) + 'pt';
            rText = rText.replace(re, reducido)
        }
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeQuExt.borderColors.red, $eXeQuExt.borderColors.green, $eXeQuExt.borderColors.blue, $eXeQuExt.borderColors.yellow],
            mcolor = colors[type],
            weight = type == 0 ? 'normal' : 'normal';
        $('#quextPAuthor-' + instance).text(message);
        $('#quextPAuthor-' + instance).css({
            'color': mcolor,
            'font-weight': weight
        });
        $('#quextPAuthor-' + instance).show();
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
        var mOptions = $eXeQuExt.options[instance],
            arrayRamdon = mOptions.question.options.slice(0, mOptions.question.numberOptions),
            sSolution = mOptions.question.options[mOptions.question.solution];
        arrayRamdon = $eXeQuExt.shuffleAds(arrayRamdon);
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
        var mOptions = $eXeQuExt.options[instance];
        $('#quextOptionsDiv-' + instance + '>.gameQP-Options').each(function (index) {
            var option = mOptions.question.options[index];
            $(this).css({
                'border-color': $eXeQuExt.borderColors.grey,
                'background-color': "transparent",
                'cursor': 'pointer',
                'color': $eXeQuExt.colors.black,
                'border-width': '1px'
            }).text(option);
            if (option) {
                $(this).show();
            } else {
                $(this).hide()
            }
        });
    },
    drawSolution: function (instance) {
        var mOptions = $eXeQuExt.options[instance];
        mOptions.gameActived = false;
        $('#quextOptionsDiv-' + instance + '>.gameQP-Options').each(function (index) {
            if (index === mOptions.question.solution) {
                $(this).css({
                    'border-color': $eXeQuExt.borderColors.correct,
                    'background-color': $eXeQuExt.colors.correct,
                    'cursor': 'default'

                });
            } else {
                $(this).css({
                    'border-color': $eXeQuExt.borderColors.incorrect,
                    'background-color': 'transparent',
                    'cursor': 'default'
                });
            }
        });
    },
    clearQuestions: function (instance) {
        $('#quextOptionsDiv-' + instance + '>.gameQP-Options').each(function (index) {
            $(this).css({
                'border-color': $eXeQuExt.borderColors.grey,
                'background-color': "transparent",
                'cursor': 'pointer',
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
            $eXeQuExt.getFullscreen(element);
        } else {
            $eXeQuExt.exitFullscreen(element);
        }
        $eXeQuExt.refreshImageActive(instance);
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
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $eXeQuExt.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $eXeQuExt.getURLAudioMediaTeca(urlmedia);
        }

        return sUrl;
    }
}
$(function () {

    $eXeQuExt.init();
});