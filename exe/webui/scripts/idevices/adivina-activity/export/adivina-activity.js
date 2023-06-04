/**
 * Adivina activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Author: Ignacio Gros
 * Ricardo Málaga Floriano
 * Ana María Zamora Moreno
 * Iconos_: Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeAdivina = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#00a300',
        red: '#b3092f',
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#dfe3f1',
        green: '#caede8',
        red: '#fbd2d6',
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
        this.activities = $('.adivina-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeAdivina.supportedBrowser('adivina')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Word Guessing') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/adivina-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeAdivina.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeAdivina.enable()');
        else this.enable();
        $eXeAdivina.mScorm = scorm;
        var callSucceeded = $eXeAdivina.mScorm.init();
        if (callSucceeded) {
            $eXeAdivina.userName = $eXeAdivina.getUserName();
            $eXeAdivina.previousScore = $eXeAdivina.getPreviousScore();
            $eXeAdivina.mScorm.set("cmi.core.score.max", 10);
            $eXeAdivina.mScorm.set("cmi.core.score.min", 0);
            $eXeAdivina.initialScore = $eXeAdivina.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeAdivina.options[instance],
            text = '';
        $('#adivinaSendScore-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgOnlySaveAuto;
            } else if (!repeatActivity && prevScore !== "") {
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            }
        } else if (mOptions.isScorm === 2) {
            $('#adivinaSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#adivinaSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }


        $('#adivinaRepeatActivity-' + instance).text(text);
        $('#adivinaRepeatActivity-' + instance).fadeIn(1000);
    },
    getUserName: function () {
        var user = $eXeAdivina.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeAdivina.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeAdivina.mScorm.quit();
    },
    enable: function () {
        $eXeAdivina.loadGame();
    },
    loadGame: function () {
        $eXeAdivina.options = [];
        $eXeAdivina.activities.each(function (i) {
            var version = $(".adivina-version", this).eq(0).text(),
                dl = $(".adivina-DataGame", this),
                imagesLink = $('.adivina-LinkImages', this),
                audioLink = $('.adivina-LinkAudios', this),
                mOption = $eXeAdivina.loadDataGame(dl, imagesLink, audioLink, version),
                msg = mOption.msgs.msgPlayStart;

            $eXeAdivina.options.push(mOption);
            var adivina = $eXeAdivina.createInterfaceAdivina(i);
            dl.before(adivina).remove();
            $('#adivinaGameMinimize-' + i).hide();
            $('#adivinaGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#adivinaGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#adivinaGameContainer-' + i).show();
            }
            $('#adivinaMessageMaximize-' + i).text(msg);
            $('#adivinaDivFeedBack-' + i).prepend($('.adivina-feedback-game', this));
            $eXeAdivina.addEvents(i);

            $('#adivinaDivFeedBack-' + i).hide();
        });
        if ($eXeAdivina.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeAdivina.loadMathJax();
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
    updateSoundVideo: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.activeSilent) {
            if (mOptions.player && typeof mOptions.player.getCurrentTime === "function") {
                var time = Math.round(mOptions.player.getCurrentTime());
                if (time == mOptions.question.silentVideo) {
                    mOptions.player.mute();
                } else if (time == mOptions.endSilent) {
                    mOptions.player.unMute();
                }
            }
        }
    },
    loadDataGame: function (data, imgsLink, audioLink, version) {
        var json = data.text();
        version = typeof version == "undefined" || version == '' ? 0 : parseInt(version);
        if (version > 0) {
            json = $eXeAdivina.Decrypt(json);
        }
        var mOptions = $eXeAdivina.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeAdivina.hasLATEX = true;
        }
        mOptions.hasVideo = false;
        mOptions.waitStart = false;
        mOptions.percentajeQuestions = typeof mOptions.percentajeQuestions != 'undefined' ? mOptions.percentajeQuestions : 100;
        mOptions.modeBoard = typeof mOptions.modeBoard == "undefined" ? false : mOptions.modeBoard;
        for (var i = 0; i < mOptions.wordsGame.length; i++) {
            var p = mOptions.wordsGame[i];
            if (mOptions.wordsGame[i].type != 2) {
                p.url = $eXeAdivina.extractURLGD(p.url);
            }
            if (version < 2) {
                if (p.type == 2) {
                    p.type = 1
                }
                p.iVideo = 0;
                p.fVideo = 0;
                p.eText = '';
                p.silentVideo = 0;
                p.tSilentVideo = 0;
                p.audio = '';
                p.soundVideo = 1;
                p.imageVideo = 1;
                p.percentageShow = typeof mOptions.percentageShow == 'undefined' ? 35 : mOptions.percentageShow;
                p.time = typeof mOptions.timeQuestion == 'undefined' ? 1 : mOptions.timeQuestion;
            }
            var idyt = $eXeAdivina.getIDYoutube(p.url)
            if (p.type == 2 && idyt) {
                mOptions.hasVideo = true;
            }
            p.time = p.time < 0 ? 0 : p.time;
        }

        mOptions.playerAudio = "";
        mOptions.gameMode = typeof mOptions.gameMode != 'undefined' ? mOptions.gameMode : 0;
        mOptions.percentajeFB = typeof mOptions.percentajeFB != 'undefined' ? mOptions.percentajeFB : 100;
        mOptions.customMessages = typeof mOptions.customMessages != 'undefined' ? mOptions.customMessages : false;
        mOptions.useLives = mOptions.gameMode != 0 ? false : mOptions.useLives;
        mOptions.gameOver = false;
        imgsLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                mOptions.wordsGame[iq].url = $(this).attr('href');
                if (mOptions.wordsGame[iq].url.length < 4 && mOptions.wordsGame[iq].type == 1) {
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
        mOptions.wordsGame = $eXeAdivina.getQuestions(mOptions.wordsGame, mOptions.percentajeQuestions);
        mOptions.numberQuestions = mOptions.wordsGame.length;
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
                array = $eXeAdivina.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
        var mOptions = $eXeAdivina.options[instance];
        selectedFile = $eXeAdivina.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });

    },
    stopSound: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
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
    createInterfaceAdivina: function (instance) {
        var html = '',
            path = $eXeAdivina.idevicePath,
            msgs = $eXeAdivina.options[instance].msgs,
            html = '';
        html += '<div class="gameQP-MainContainer">\
        <div class="gameQP-GameMinimize" id="adivinaGameMinimize-' + instance + '">\
            <a href="#" class="gameQP-LinkMaximize" id="adivinaLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + "adivinaIcon.png" + '" class="gameQP-IconMinimize gameQP-Activo"  alt="">\
            <div class="gameQP-MessageMaximize" id="adivinaMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="gameQP-GameContainer" id="adivinaGameContainer-' + instance + '">\
            <div class="gameQP-GameScoreBoard">\
                <div class="gameQP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="adivinaPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="adivinaPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="adivinaPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="adivinaPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="gameQP-LifesGame" id="adivinaLifesAdivina-' + instance + '">\
                    <strong class="sr-av">' + msgs.msgLive + '</strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + '</strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + '</strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + '</strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                    <strong class="sr-av">' + msgs.msgLive + '</strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life" title="' + msgs.msgLive + '"></div>\
                </div>\
                <div class="gameQP-NumberLifesGame" id="adivinaNumberLivesAdivina-' + instance + '">\
                    <strong class="sr-av">' + msgs.msgLive + '</strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="adivinaPLifes-' + instance + '">0</p>\
                </div>\
                <div class="gameQP-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
					<div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
                    <p  id="adivinaPTime-' + instance + '" class="gameQP-PTime">00:00</p>\
                    <a href="#" class="gameQP-LinkMinimize" id="adivinaLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  gameQP-Activo"></div>\
                    </a>\
                    <a href="#" class="gameQP-LinkFullScreen" id="adivinaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  gameQP-Activo" id="adivinaFullScreen-' + instance + '"></div>\
					</a>\
				</div>\
            </div>\
            <div class="gameQP-ShowClue" id="adivinaShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + '</div>\
                <p class=" gameQP-PShowClue gameQP-parpadea" id="adivinaPShowClue-' + instance + '"></p>\
           </div>\
           <div class="gameQP-Multimedia" id="adivinaMultimedia-' + instance + '">\
                <img class="gameQP-Cursor" id="adivinaCursor-' + instance + '" src="' + path + 'exequextcursor.gif" alt="" />\
                <img  src="" class="gameQP-Images" id="adivinaImage-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <div class="gameQP-EText" id="adivinaEText-' + instance + '"></div>\
                <img src="' + path + 'adivinaHome.png" class="gameQP-Cover" id="adivinaCover-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <div class="gameQP-Video" id="adivinaVideo-' + instance + '"></div>\
                <video class="gameQP-Video" id = "adivinaVideoLocal-' + instance + '" preload="auto" controls></video>\
                <div class="gameQP-Protector" id="adivinaProtector-' + instance + '"></div>\
                <a href="#" class="gameQP-LinkAudio" id="adivinaLinkAudio-' + instance + '" title="' + msgs.msgAudio + '"><img src="' + path + 'exequextaudio.png" class="gameQP-Activo" alt="' + msgs.msgAudio + '">\</a>\
                <div class="gameQP-GameOver" id="adivinaGamerOver-' + instance + '">\
                        <div class="gameQP-DataImage">\
                            <img src="' + path + 'exequextwon.png" class="gameQP-HistGGame" id="adivinaHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                            <img src="' + path + 'exequextlost.png" class="gameQP-LostGGame" id="adivinaLostGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                        </div>\
                        <div class="gameQP-DataScore">\
                            <p id="adivinaOverScore-' + instance + '">Score: 0</p>\
                            <p id="adivinaOverHits-' + instance + '">Hits: 0</p>\
                            <p id="adivinaOverErrors-' + instance + '">Errors: 0</p>\
                        </div>\
                </div>\
            </div>\
            <div class="gameQP-AuthorLicence" id="adivinaAutorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="adivinaPAuthor-' + instance + '"></p>\
            </div>\
            <div class="sr-av" id="adivinaStartGameSRAV-' + instance + '">' + msgs.msgPlayStart + ':</div>\
            <div class="gameQP-StartGame"><a href="#" id="adivinaStartGame-' + instance + '"></a></div>\
            <div class="gameQP-QuestionDiv" id="adivinaQuestion-' + instance + '">\
                <div class="sr-av">' + msgs.msgAnswer + ':</div>\
                <div class="gameQP-Prhase" id="adivinaEPhrase-' + instance + '"></div>\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="gameQP-Question" id="adivinaDefinition-' + instance + '"></div>\
                <div class="gameQP-DivReply" id="adivinaDivReply-' + instance + '">\
                    <a href="#" id="adivinaBtnMoveOn-' + instance + '" title="' + msgs.msgMoveOne + '">\
                        <strong><span class="sr-av">' + msgs.msgMoveOne + '</span></strong>\
                        <div class="exeQuextIcons-MoveOne  gameQP-Activo"></div>\
                    </a>\
                    <input type="text" value="" class="gameQP-EdReply" id="adivinaEdAnswer-' + instance + '" autocomplete="off">\
                    <a href="#" id="adivinaBtnReply-' + instance + '" title="' + msgs.msgReply + '">\
                        <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                        <div class="exeQuextIcons-Submit  gameQP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="gameQP-DivInstructions" id="adivinaDivInstructions-' + instance + '">' + msgs.msgWrote + '</div>\
            <div class="gameQP-DivFeedBack" id="adivinaDivFeedBack-' + instance + '">\
                <input type="button" id="adivinaFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
            <div class="gameQP-DivModeBoard" id="adivinaDivModeBoard-' + instance + '">\
                <a class="gameQP-ModeBoard" href="#" id="adivinaModeBoardOK-' + instance + '" title="' + msgs.msgCorrect + '">' + msgs.msgCorrect + '</a>\
                <a class="gameQP-ModeBoard" href="#" id="adivinaModeBoardMoveOn-' + instance + '" title="' + msgs.msgMoveOne + '">' + msgs.msgMoveOne + '</a>\
                <a class="gameQP-ModeBoard" href="#" id="adivinaModeBoardKO-' + instance + '" title="' + msgs.msgIncorrect + '">' + msgs.msgIncorrect + '</a>\
            </div>\
            <div class="gameQP-Cubierta" id="adivinaCubierta-' + instance + '" style="display:none">\
                <div class="gameQP-CodeAccessDiv" id="adivinaCodeAccessDiv-' + instance + '">\
                    <div class="gameQP-MessageCodeAccessE" id="adivinaMesajeAccesCodeE-' + instance + '"></div>\
                    <div class="gameQP-DataCodeAccessE">\
                        <label for="adivinaCodeAccessE-' + instance + '" class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="gameQP-CodeAccessE" id="adivinaCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="adivinaCodeAccessButton-' + instance + '" title="' + msgs.msgReply + '">\
                        <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                        <div class="exeQuextIcons-Submit gameQP-Activo"></div>\
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
            $('#adivinaCubierta-' + instance).fadeOut();
            return;
        }
        $('#adivinaCubierta-' + instance).fadeIn();
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        var butonScore = "";
        var fB = '<div class="gameQP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="gameQP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="adivinaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="gameQP-RepeatActivity" id="adivinaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="gameQP-GetScore">';
                fB += '<p><span class="gameQP-RepeatActivity" id="adivinaRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeAdivina.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.wordsGame.length).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeAdivina.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.repeatActivity && $eXeAdivina.previousScore !== '') {
                        message = $eXeAdivina.userName !== '' ? $eXeAdivina.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeAdivina.previousScore = score;
                        $eXeAdivina.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeAdivina.userName !== '' ? $eXeAdivina.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#adivinaSendScore-' + instance).hide();
                        }
                        $('#adivinaRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#adivinaRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeAdivina.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeAdivina.mScorm.set("cmi.core.score.raw", score);
                    $('#adivinaRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#adivinaRepeatActivity-' + instance).show();
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
    drawPhrase: function (phrase, definition, nivel, type, casesensitive, instance, solution) {
        $('#adivinaEPhrase-' + instance).find('.gameQP-Word').remove();
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
        if (!casesensitive) {
            phrase = phrase.toUpperCase();
        }
        var cPhrase = $eXeAdivina.clear(phrase),
            letterShow = $eXeAdivina.getShowLetter(cPhrase, nivel),
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
                $('<div class="gameQP-Word"></div>').appendTo('#adivinaEPhrase-' + instance);
                for (var j = 0; j < cleanWord.length; j++) {
                    var letter = '<div class="gameQP-Letter blue">' + cleanWord[j] + '</div>';
                    if (type == 1) {
                        letter = '<div class="gameQP-Letter red">' + cleanWord[j] + '</div>';
                    } else if (type == 2) {
                        letter = '<div class="gameQP-Letter green">' + cleanWord[j] + '</div>';
                    }
                    $('#adivinaEPhrase-' + instance).find('.gameQP-Word').last().append(letter);
                }
            }
        }
        if (!solution) {
            $('#adivinaDefinition-' + instance).text(definition);
        }

        var html = $('#adivinaDefinition-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeAdivina.updateLatex('adivinaDefinition-' + instance)
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
            $eXeAdivina.getFullscreen(element);
        } else {
            $eXeAdivina.exitFullscreen(element);
        }
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
        var mOptions = $eXeAdivina.options[instance];
        $('#adivinaLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#adivinaGameContainer-" + instance).show()
            $("#adivinaGameMinimize-" + instance).hide();
        });
        $("#adivinaLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#adivinaGameContainer-" + instance).hide();
            $("#adivinaGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        mOptions.localPlayer = document.getElementById('adivinaVideoLocal-' + instance)
        $('#adivinaEPhrase-' + instance).hide();
        $('#adivinaBtnReply-' + instance).hide();
        $('#adivinaBtnMoveOn-' + instance).hide();
        $('#adivinaEdAnswer-' + instance).hide();
        $('#adivinaDefinition-' + instance).hide();
        $('#adivinaVideo-' + instance).hide();
        $('#adivinaVideoLocal-' + instance).hide();
        $('#adivinaEdAnswer-' + instance).val("");
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
        $('#adivinaGamerOver-' + instance).hide();
        $('#adivinaCodeAccessDiv-' + instance).hide();
        if (mOptions.gameMode == 2) {
            $('#adivinaGameContainer-' + instance).find('.exeQuextIcons-Hit').hide();
            $('#adivinaGameContainer-' + instance).find('.exeQuextIcons-Error').hide();
            $('#adivinaPErrors-' + instance).hide();
            $('#adivinaPHits-' + instance).hide();
            $('#adivinaGameContainer-' + instance).find('.exeQuextIcons-Score').hide();
            $('#adivinaPScore-' + instance).hide();
        }
        $('#adivinaBtnMoveOn-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeAdivina.newQuestion(instance)
        });
        document.onfullscreenchange = function (event) {
            var id = event.target.id.split('-')[1];
            $eXeAdivina.refreshImageActive(id)
        };
        $('#adivinaBtnReply-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeAdivina.answerQuestion(instance);
        });
        $("#adivinaLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('adivinaGameContainer-' + instance);
            $eXeAdivina.toggleFullscreen(element, instance)
        });
        $('#adivinaEdAnswer-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeAdivina.answerQuestion(instance);
                return false;
            }
            return true;
        });

        $('#adivinaFeedBackClose-' + instance).on('click', function (e) {
            $('#adivinaDivFeedBack-' + instance).hide();
        });

        $('#adivinaLinkAudio-' + instance).on('click', function (e) {
            e.preventDefault();
            var audio = mOptions.wordsGame[mOptions.activeQuestion].audio;
            $eXeAdivina.stopSound(instance);
            $eXeAdivina.playSound(audio, instance);
        });
        $('#adivinaPShowClue-' + instance).hide();
        $('#adivinaStartGame-' + instance).show();

        mOptions.livesLeft = mOptions.numberLives;
        $eXeAdivina.updateLives(instance);
        if (mOptions.itinerary.showCodeAccess) {
            $('#adivinaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#adivinaCodeAccessDiv-' + instance).show();
            $('#adivinaStartGame-' + instance).hide();
            $('#adivinaQuestion-' + instance).hide();
            $('#adivinaDefinition-' + instance).hide();
            $('#adivinaDivInstructions-' + instance).hide();
            $eXeAdivina.showCubiertaOptions(true, instance)

        }
        if (!mOptions.useLives) {
            $('#adivinaLifesAdivina-' + instance).hide();
            $('#adivinaNumberLivesAdivina-' + instance).hide();
        }
        $('#adivinaCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeAdivina.enterCodeAccess(instance);
        });
        $('#adivinaCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeAdivina.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#adivinaPNumber-' + instance).text(mOptions.numberQuestions);
        $(window).on('unload', function () {
            if (typeof ($eXeAdivina.mScorm) != "undefined") {
                $eXeAdivina.endScorm();
            }
        });
        if (mOptions.isScorm > 0) {
            $eXeAdivina.updateScorm($eXeAdivina.previousScore, mOptions.repeatActivity, instance);
        }
        $('#adivinaInstructions-' + instance).text(mOptions.instructions);
        $('#adivinaSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeAdivina.sendScore(instance, false);
        });
        $('#adivinaImage-' + instance).hide();
        window.addEventListener('resize', function () {
            $eXeAdivina.refreshImageActive(instance);
        });
        $('#adivinaStartGame-' + instance).text(mOptions.msgs.msgPlayStart);

        $('#adivinaStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeAdivina.getYTAPI(instance);
        });
        $('#adivinaModeBoardOK-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeAdivina.answerQuestionBoard(true, instance)

        });
        $('#adivinaModeBoardKO-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeAdivina.answerQuestionBoard(false, instance)

        });
        $('#adivinaModeBoardMoveOn-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeAdivina.newQuestion(instance)
        });


    },
    getYTAPI: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        mOptions.wordsGame = mOptions.optionsRamdon ? $eXeAdivina.shuffleAds(mOptions.wordsGame) : mOptions.wordsGame;
        if ((typeof (mOptions.player) == "undefined") && mOptions.hasVideo) {
            $('#adivinaStartGame-' + instance).text(mOptions.msgs.msgLoading);
            mOptions.waitStart = true;
            if (typeof (YT) !== "undefined") {
                $eXeAdivina.youTubeReadyOne(instance);
            } else {
                $eXeAdivina.loadYoutubeApi();
            }

        } else {
            $eXeAdivina.startGame(instance);
        }
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.gameOver) {
            return;
        }
        if (mOptions.gameStarted) {
            var q = mOptions.wordsGame[mOptions.activeQuestion];
            $eXeAdivina.showImage(q.url, q.x, q.y, q.author, q.alt, instance);
        } else {
            $eXeAdivina.showImage("", 0, 0, '', '', instance);
        }

    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() == $('#adivinaCodeAccessE-' + instance).val().toLowerCase()) {
            $eXeAdivina.showCubiertaOptions(false, instance);
            $eXeAdivina.getYTAPI(instance);

        } else {
            $('#adivinaMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#adivinaCodeAccessE-' + instance).val('');
        }
    },
    startGame: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        $("#adivinaDivReply-" + instance).show();
        $("#adivinaDivInstructions-" + instance).hide();
        $('#adivinaStartGame-' + instance).hide();
        $('#adivinaStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = false;
        mOptions.activeQuestion = -1;
        mOptions.validQuestions = mOptions.numberQuestions;
        mOptions.counter = 0;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.livesLeft = mOptions.numberLives;
        $eXeAdivina.updateLives(instance);
        mOptions.obtainedClue = false;

        $('#adivinaPShowClue-' + instance).text('');
        $('#adivinaGamerOver-' + instance).hide();
        $('#adivinaPNumber-' + instance).text(mOptions.numberQuestions);
        $('#adivinaPHits-' + instance).text(mOptions.hits);
        $('#adivinaPErrors-' + instance).text(mOptions.errors);
        $('#adivinaPScore-' + instance).text(mOptions.score);
        mOptions.counter = $eXeAdivina.getTimeSeconds(mOptions.wordsGame[0].time);
        if (mOptions.wordsGame[0].type === 2) {
            var durationVideo = mOptions.wordsGame[0].fVideo - mOptions.wordsGame[0].iVideo;
            mOptions.counter += durationVideo;
        }
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeAdivina.uptateTime(mOptions.counter, instance);
                $eXeAdivina.updateSoundVideo(instance);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    var timeShowSolution = 1000;
                    if (mOptions.showSolution) {
                        timeShowSolution = mOptions.timeShowSolution * 1000;
                        var question = mOptions.wordsGame[mOptions.activeQuestion];
                        $eXeAdivina.drawPhrase(question.word, question.definition, 100, 1, mOptions.caseSensitive, instance, true)
                    }
                    setTimeout(function () {
                        $eXeAdivina.newQuestion(instance)
                    }, timeShowSolution);
                    return;
                }
            }

        }, 1000);
        $eXeAdivina.uptateTime($eXeAdivina.getTimeSeconds(mOptions.wordsGame[0].time), instance);
        mOptions.gameStarted = true;
        $('#adivinaDefinition-' + instance).show();
        $('#adivinaBtnReply-' + instance).show();
        $('#adivinaBtnMoveOn-' + instance).show();
        $('#adivinaEdAnswer-' + instance).show();
        $('#adivinaEPhrase-' + instance).show();
        $('#adivinaQuestion-' + instance).show();
        $eXeAdivina.newQuestion(instance);
    },
    uptateTime: function (tiempo, instance) {
        var mOptions = $eXeAdivina.options[instance],
            mTime = $eXeAdivina.getTimeToString(tiempo);
        $('#adivinaPTime-' + instance).text(mTime);
        if (mOptions.gameActived) {
            //$eXeAdivina.drawLetterActive($eXeAdivina.gameData.activeWord, instance);
        }
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeAdivina.options[instance];
        $eXeAdivina.showImage("", 0, 0, '', '', instance);
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        mOptions.gameOver = true;
        $('#adivinaLinkAudio-' + instance).hide();
        $eXeAdivina.stopSound(instance);
        $('#adivinaDivModeBoard-' + instance).hide()
        clearInterval(mOptions.counterClock);
        $('#adivinaEPhrase-' + instance).find('.gameQP-Word').hide();
        $('#adivinaEdAnswer-' + instance).val('');
        $('#adivinaEdAnswer-' + instance).hide();
        $('#adivinaImage-' + instance).hide();
        $('#adivinaCover-' + instance).hide();
        $('#adivinaVideo-' + instance).hide();
        $('#adivinaVideoLocal-' + instance).hide();
        $('#adivinaStartGame-' + instance).show();
        $eXeAdivina.showScoreGame(type, instance);
        $eXeAdivina.startVideo('', 0, 0, instance, 0);
        $eXeAdivina.stopVideo(instance)
        $eXeAdivina.uptateTime(0, instance);
        $eXeAdivina.stopSound(instance)
        $('#adivinaBtnReply-' + instance).hide();
        $('#adivinaBtnMoveOn-' + instance).hide();
        $('#adivinaEdAnswer-' + instance).hide();
        $('#adivinaDefinition-' + instance).hide();
        $('#adivinaQuestion-' + instance).hide();
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeAdivina.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeAdivina.sendScore(instance, true);
                $('#adivinaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeAdivina.initialScore = score;
            }
        }
        $eXeAdivina.showFeedBack(instance);
    },
    showFeedBack: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.wordsGame.length;
        if (mOptions.gameMode == 2 || mOptions.feedBack) {

            if (puntos >= mOptions.percentajeFB) {
                $('#adivinaDivFeedBack-' + instance).find('.adivina-feedback-game').show();
                $('#adivinaDivFeedBack-' + instance).show();
            } else {
                $eXeAdivina.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance);
            }
        }
    },

    showScoreGame: function (type, instance) {
        var mOptions = $eXeAdivina.options[instance],
            msgs = mOptions.msgs,
            $adivinaHistGame = $('#adivinaHistGame-' + instance),
            $adivinaLostGame = $('#adivinaLostGame-' + instance),
            $adivinaOverPoint = $('#adivinaOverScore-' + instance),
            $adivinaOverHits = $('#adivinaOverHits-' + instance),
            $adivinaOverErrors = $('#adivinaOverErrors-' + instance),
            $adivinaGamerOver = $('#adivinaGamerOver-' + instance),
            message = "",
            messageColor = 1;
        $adivinaHistGame.hide();
        $adivinaLostGame.hide();
        $adivinaOverPoint.show();
        $adivinaOverHits.show();
        $adivinaOverErrors.show();
        var mclue = '';
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.mgsAllQuestions;
                messageColor = 2;
                $adivinaHistGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#adivinaPShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        mclue = text;
                    } else {
                        mclue = msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
                    }
                }
                break;
            case 1:
                message = msgs.msgLostLives;
                $adivinaLostGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#adivinaPShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        mclue = text;
                    } else {
                        mclue = msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
                    }
                }
                break;
            default:
                break;
        }
        $eXeAdivina.showMessage(messageColor, message, instance);
        var msscore = mOptions.gameMode == 0 ? '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score : '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score.toFixed(2);
        $adivinaOverPoint.html(msscore);
        $adivinaOverHits.html('<strong>' + msgs.msgHits + ':</strong> ' + mOptions.hits);
        $adivinaOverErrors.html('<strong>' + msgs.msgErrors + ':</strong> ' + mOptions.errors);
        if (mOptions.gameMode == 2) {
            $('#adivinaGameContainer-' + instance).find('.gameQP-DataScore').hide();
        }
        $adivinaGamerOver.show();
        $('#adivinaPShowClue-' + instance).hide();
        if (mOptions.itinerary.showClue) {
            $('#adivinaPShowClue-' + instance).text(mclue);
            $('#adivinaPShowClue-' + instance).show();
        }
    },
    changeTextInit: function (bg, message, instance, msgs) {
        var html = message;
        if (bg) {
            var msg = '';
            if (msgs) {
                if (msgs.msgWrote && msgs.msgWrote != "") {
                    msg = msgs.msgWrote;
                }
            }
            html = '<a href="#">' + message + '</a>';
            var instructions = $("#adivinaDivInstructions-" + instance);
            var answerForm = $("#adivinaDivReply-" + instance);
            if (instructions.length == 0) {
                answerForm.before('<p class="adivinaDivInstructions" id="adivinaDivInstructions-' + instance + '">' + msg + '</p>').hide();
            } else {
                if ($('#adivinaGameContainer-' + instance).width() > 540) {
                    instructions.show();
                }
                answerForm.hide();
            }
        }
        $('#adivinaDefinition-' + instance).html(html);

    },
    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },

    showQuestion: function (i, instance) {
        var mOptions = $eXeAdivina.options[instance],
            q = mOptions.wordsGame[i],
            tiempo = $eXeAdivina.getTimeToString($eXeAdivina.getTimeSeconds(q.time)),
            author = '',
            alt = '';
        mOptions.gameActived = true;
        mOptions.question = q;
        $eXeAdivina.showMessage(0, '', instance);

        $('#adivinaEPhrase-' + instance).find('.gameQP-Letter').css('color', $eXeAdivina.borderColors.blue);
        $eXeAdivina.drawPhrase(q.word, q.definition, q.percentageShow, 0, $eXeAdivina.options[instance].caseSensitive, instance, false);
        $('#adivinaEdAnswer-' + instance).val("");
        $('#adivinaBtnReply-' + instance).prop('disabled', false);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', false);
        $('#adivinaEdAnswer-' + instance).prop('disabled', false);
        $('#adivinaEdAnswer-' + instance).focus();
        $('#adivinaPTime-' + instance).text(tiempo);
        $('#adivinaImage-' + instance).hide();
        $('#adivinaCover-' + instance).show();
        $('#adivinaEText-' + instance).hide();
        $('#adivinaVideo-' + instance).hide();
        $('#adivinaVideoLocal-' + instance).hide();
        $('#adivinaLinkAudio-' + instance).hide();
        $eXeAdivina.startVideo('', 0, 0, instance, 0);
        $eXeAdivina.stopVideo(instance)
        $('#adivinaCursor-' + instance).hide();
        $eXeAdivina.showMessage(0, '', instance);
        mOptions.activeSilent = (q.type == 2) && (q.soundVideo == 1) && (q.tSilentVideo > 0) && (q.silentVideo >= q.iVideo) && (q.iVideo < q.fVideo);
        var endSonido = parseInt(q.silentVideo) + parseInt(q.tSilentVideo);
        mOptions.endSilent = endSonido > q.fVideo ? q.fVideo : endSonido;
        $('#adivinaAuthor-' + instance).text('');
        if (q.type === 1) {
            $eXeAdivina.showImage(q.url, q.x, q.y, q.author, q.alt, instance);
            $('#adivinaPAuthor-' + instance).text(q.author);
        } else if (q.type === 3) {
            var text = unescape(q.eText);
            if (window.innerWidth < 401) {
                //text = $eXeAdivina.reduceText(text);
            }
            $('#adivinaEText-' + instance).html(text);
            $('#adivinaCover-' + instance).hide();
            $('#adivinaEText-' + instance).show();
            $eXeAdivina.showMessage(0, '', instance);

        } else if (q.type === 2) {
            var urllv = $eXeAdivina.getURLVideoMediaTeca(q.url),
                idVideo = $eXeAdivina.getIDYoutube(q.url),
                type = urllv ? 1 : 0,
                id = type === 0 ? idVideo : urllv;
            $eXeAdivina.startVideo(id, q.iVideo, q.fVideo, instance, type);
            if (type === 0) {
                $('#adivinaVideo-' + instance).show();
            } else {
                $('#adivinaVideoLocal-' + instance).show();
            }
            $eXeAdivina.showMessage(0, '', instance);
            $('#adivinaVideo-' + instance).hide();
            $('#adivinaVideoLocal-' + instance).hide();
            if (q.imageVideo === 0) {
                $('#adivinaCover-' + instance).show();
            } else {
                if (type == 1) {
                    $('#adivinaVideoLocal-' + instance).show();
                } else {
                    $('#adivinaVideo-' + instance).show();
                }
                $('#adivinaCover-' + instance).hide();
            }
            if (q.soundVideo === 0) {
                $eXeAdivina.muteVideo(true, instance, type);
            } else {
                $eXeAdivina.muteVideo(false, instance, type);
            }
        }

        if (q.audio.length > 4 && q.type != 2) {
            $('#adivinaLinkAudio-' + instance).show();
        }

        $eXeAdivina.stopSound(instance);
        if (q.type != 2 && q.audio.trim().length > 5) {
            $eXeAdivina.playSound(q.audio.trim(), instance);
        }

        $('#adivinaBtnReply-' + instance).prop('disabled', false);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', false);
        $('#adivinaEdAnswer-' + instance).prop('disabled', false);
        $('#adivinaEdAnswer-' + instance).focus();
        $('#adivinaEdAnswer-' + instance).val('');

        if (q.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeAdivina.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.wordsGame.length).toFixed(2);
                $eXeAdivina.sendScore(true, instance);
                $('#adivinaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        if (mOptions.modeBoard) {
            $('#adivinaDivModeBoard-' + instance).css('display', 'flex');
            $('#adivinaDivModeBoard-' + instance).fadeIn();
        }

    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600]
        if ((iT) < times.length) {
            return times[iT];
        } else {
            return iT;
        }

    },
    startVideo: function (id, start, end, instance, type) {
        var mOptions = $eXeAdivina.options[instance],
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
                $eXeAdivina.updateTimerDisplayLocal(instance);
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
    youTubeReady: function () {
        for (var i = 0; i < $eXeAdivina.options.length; i++) {
            var mOptions = $eXeAdivina.options[i];
            mOptions.player = new YT.Player('adivinaVideo-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 0
                },
                events: {
                    'onReady': $eXeAdivina.onPlayerReady,
                }
            });
            $('#adivinaVideo-' + i).hide();
        }
    },

    updateTimerDisplayLocal: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.localPlayer) {
            var currentTime = mOptions.localPlayer.currentTime;
            if (currentTime) {
                $eXeAdivina.updateSoundVideoLocal(instance);
                if (Math.ceil(currentTime) == mOptions.pointEnd || Math.ceil(currentTime) == mOptions.durationVideo) {
                    mOptions.localPlayer.pause();
                    mOptions.pointEnd = 100000;
                }
            }
        }
    },
    updateSoundVideoLocal: function (instance) {
        var mOptions = $eXeAdivina.options[instance];

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
    youTubeReadyOne: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        mOptions.player = new YT.Player('adivinaVideo-' + instance, {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onReady': $eXeAdivina.onPlayerReady,
            }
        });
        $('#adivinaVideo-' + instance).hide();
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
    getIDYoutube: function (url) {
        if (url) {
            var match = url.match(regExp);
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    preloadGame: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.waitStart) {
            mOptions.waitStart = false;
            setTimeout(function () {
                $eXeAdivina.startGame(instance);
            }, 1000);
        }
    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeAdivina.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        var video = 'adivinaVideo-0';
        if ((event.target.h) && (event.target.h.id)) {
            video = event.target.h.id;
        } else if ((event.target.i) && (event.target.i.id)) {
            video = event.target.i.id;
        }else if ((event.target.g) && (event.target.g.id)) {
            video = event.target.g.id;
        }
        video = video.split("-");
        if (video.length == 2 && video[0] == "adivinaVideo") {
            var instance = parseInt(video[1]);
            if (!isNaN(instance)) {
                $eXeAdivina.preloadGame(instance);
            }
        }
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    stopVideo: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
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
    muteVideo: function (mute, instance, type) {
        var mOptions = $eXeAdivina.options[instance];
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

    showImage: function (url, x, y, author, alt, instance) {
        var $cursor = $('#adivinaCursor-' + instance),
            $noImage = $('#adivinaCover-' + instance),
            $Image = $('#adivinaImage-' + instance),
            $Author = $('#adivinaPAuthor-' + instance);
        if ($.trim(url).length == 0) {
            $cursor.hide();
            $Image.hide();
            $noImage.show();
            return false;
        };

        $Image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $cursor.hide();
                    $Image.hide();
                    $Image.attr('alt', $eXeAdivina.options[instance].msgs.msgNoImage);
                    $noImage.show();
                    return false;
                } else {
                    var mData = $eXeAdivina.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeAdivina.drawImage(this, mData);
                    $Image.show();
                    $cursor.hide();
                    $noImage.hide();
                    $Image.attr('alt', alt);
                    if (x > 0 && y > 0) {
                        var left = mData.x + (x * mData.w);
                        var top = mData.y + (y * mData.h);
                        $cursor.css({
                            'left': left + 'px',
                            'top': top + 'px'
                        });
                        $cursor.show();
                    }
                    return true;
                }
            }).on('error', function () {
                $cursor.hide();
                $Image.hide();
                $Image.attr('alt', $eXeAdivina.options[instance].msgs.msgNoImage);
                $noImage.show();
                return false;
            });
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
    updateLives: function (instance) {
        var mOptions = $eXeAdivina.options[instance],
            classIconLife = '.exeQuextIcons-Life';
        $('#adivinaPLifes-' + instance).text(mOptions.livesLeft);
        $('#adivinaLifesAdivina-' + instance).find(classIconLife).each(function (index) {
            $(this).hide();
            if (mOptions.useLives) {
                $(this).show();
                if (index >= mOptions.livesLeft) {
                    $(this).hide();
                }
            }
        });
        if (!mOptions.useLives) {
            $('#adivinaLifesAdivina-' + instance).hide();
            $('#adivinaNumberLivesAdivina-' + instance).hide();
        }
    },
    newQuestion: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.livesLeft <= 0 && mOptions.useLives) {
            $eXeAdivina.gameOver(1, instance);
            return;
        }
        var mActiveQuestion = $eXeAdivina.updateNumberQuestion(mOptions.activeQuestion, instance),
            $adivinaPNumber = $('#adivinaPNumber-' + instance);
        if (mActiveQuestion == -10) {
            $adivinaPNumber.text('0');
            $eXeAdivina.gameOver(0, instance);
            return;
        } else {
            mOptions.counter = $eXeAdivina.getTimeSeconds(mOptions.wordsGame[mActiveQuestion].time);
            if (mOptions.wordsGame[mActiveQuestion].type === 2) {
                var durationVideo = mOptions.wordsGame[mActiveQuestion].fVideo - mOptions.wordsGame[mActiveQuestion].iVideo;
                mOptions.counter += durationVideo;
            }
            $eXeAdivina.showQuestion(mActiveQuestion, instance);
            mOptions.activeCounter = true;
            $adivinaPNumber.text(mOptions.numberQuestions - mActiveQuestion);
        };
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeAdivina.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeAdivina.sendScore(instance, true);
                $('#adivinaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
    },
    updateNumberQuestion: function (numq, instance) {
        var mOptions = $eXeAdivina.options[instance],
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10;
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },
    getRetroFeedMessages: function (iHit, instance) {
        var mOptions = $eXeAdivina.options[instance],
            sMessages = iHit ? mOptions.msgs.msgSuccesses : mOptions.msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    answerQuestion: function (instance) {
        var mOptions = $eXeAdivina.options[instance],
            question = mOptions.wordsGame[mOptions.activeQuestion],
            answord = $.trim($('#adivinaEdAnswer-' + instance).val()),
            solution = $.trim(question.word);
        if (!mOptions.gameActived) {
            return;
        }
        if (answord.length == 0) {
            $eXeAdivina.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
            return;
        }
        mOptions.gameActived = false;
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
        answord = mOptions.caseSensitive ? answord : answord.toUpperCase();
        solution = mOptions.caseSensitive ? solution : solution.toUpperCase();
        var type = $eXeAdivina.updateScore(solution == answord, instance),
            percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        mOptions.activeCounter = false;
        var timeShowSolution = 1000;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                timeShowSolution = 3000;
                $('#adivinaPShowClue-' + instance).show();
                $('#adivinaPShowClue-' + instance).text(mOptions.msgs.msgInformation + ': ' + mOptions.itinerary.clueGame);
            }
        }
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            $eXeAdivina.drawPhrase(question.word, question.definition, 100, type, mOptions.caseSensitive, instance, true)
        }
        setTimeout(function () {
            $eXeAdivina.newQuestion(instance)
        }, timeShowSolution);
    },
    answerQuestionBoard: function (value, instance) {
        var mOptions = $eXeAdivina.options[instance],
            question = mOptions.wordsGame[mOptions.activeQuestion];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
        var type = $eXeAdivina.updateScore(value, instance),
            percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        mOptions.activeCounter = false;
        var timeShowSolution = 1000;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                timeShowSolution = 3000;
                $('#adivinaPShowClue-' + instance).show();
                $('#adivinaPShowClue-' + instance).text(mOptions.msgs.msgInformation + ': ' + mOptions.itinerary.clueGame);
            }
        }
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            $eXeAdivina.drawPhrase(question.word, question.definition, 100, type, mOptions.caseSensitive, instance, true)
        }
        setTimeout(function () {
            $eXeAdivina.newQuestion(instance)
        }, timeShowSolution);
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

    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeAdivina.options[instance],
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
                points = obtainedPoints;
            } else if (mOptions.gameMode == 1) {
                obtainedPoints = (10 / mOptions.wordsGame.length);
                points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
            } else if (mOptions.gameMode == 2) {
                obtainedPoints = (10 / mOptions.wordsGame.length);
                points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
            }
            type = 2;
        } else {
            mOptions.errors++;
            if (mOptions.gameMode != 0) {
                message = "";
            } else {
                obtainedPoints = -330;
                points = obtainedPoints;
                if (mOptions.useLives) {
                    mOptions.livesLeft--;
                    $eXeAdivina.updateLives(instance);
                }
            }
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        sscore = mOptions.score;
        if (mOptions.gameMode != 0) {
            sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        }
        $('#adivinaPScore-' + instance).text(sscore);
        $('#adivinaPHits-' + instance).text(mOptions.hits);
        $('#adivinaPErrors-' + instance).text(mOptions.errors);
        message = $eXeAdivina.getMessageAnswer(correctAnswer, points, instance);
        $eXeAdivina.showMessage(type, message, instance);
    },
    getMessageAnswer: function (correctAnswer, npts, instance) {
        var mOptions = $eXeAdivina.options[instance];
        var message = "",
            q = mOptions.wordsGame[mOptions.activeQuestion];
        if (correctAnswer) {
            message = $eXeAdivina.getMessageCorrectAnswer(npts, instance);
        } else {
            message = $eXeAdivina.getMessageErrorAnswer(npts, instance);
        }
        if (mOptions.showSolution && q.typeQuestion == 1) {
            message += ': ' + q.solutionQuestion;
        }
        return message;
    },
    getMessageCorrectAnswer: function (npts, instance) {
        var mOptions = $eXeAdivina.options[instance],
            messageCorrect = $eXeAdivina.getRetroFeedMessages(true, instance),
            message = "",
            pts = typeof mOptions.msgs.msgPoints == 'undefined' ? 'puntos' : mOptions.msgs.msgPoints;
        if (mOptions.customMessages && mOptions.wordsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.wordsGame[mOptions.activeQuestion].msgHit
            message = mOptions.gameMode < 2 ? message + '. ' + npts + ' ' + pts : message;
        } else {
            message = mOptions.gameMode == 2 ? messageCorrect : messageCorrect + ' ' + npts + ' ' + pts;
        }
        return message;
    },
    getMessageErrorAnswer: function (npts, instance) {
        var mOptions = $eXeAdivina.options[instance],
            messageError = $eXeAdivina.getRetroFeedMessages(false, instance),
            message = "",
            pts = typeof mOptions.msgs.msgPoints == 'undefined' ? 'puntos' : mOptions.msgs.msgPoints;
        if (mOptions.customMessages && mOptions.wordsGame[mOptions.activeQuestion].msgError.length > 0) {
            message = mOptions.wordsGame[mOptions.activeQuestion].msgError;
            if (mOptions.gameMode != 2) {
                message = mOptions.useLives ? message + '. ' + mOptions.msgs.msgLoseLive : message + '. ' + npts + ' ' + pts;
            }
        } else {
            message = mOptions.useLives ? messageError + ' ' + mOptions.msgs.msgLoseLive : messageError + ' ' + npts + ' ' + pts;
            message = mOptions.gameMode > 0 ? messageError : message;

        }
        return message;
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeAdivina.borderColors.red, $eXeAdivina.borderColors.green, $eXeAdivina.borderColors.blue, $eXeAdivina.borderColors.yellow],
            color = colors[type];
        $('#adivinaPAuthor-' + instance).text(message);
        $('#adivinaPAuthor-' + instance).css({
            'color': color
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
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $eXeAdivina.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $eXeAdivina.getURLAudioMediaTeca(urlmedia);
        }
        return sUrl;
    }
}
$(function () {
    $eXeAdivina.init();
});