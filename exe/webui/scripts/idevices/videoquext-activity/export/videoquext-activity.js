/**
 * VideoQuExt Activity iDevice (export code)
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
    init: function () {
        this.activities = $('.vquext-IDevice');
        if (this.activities.length == 0) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('VideoQuExt Activity') + '</p>');
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
    sendScore: function (auto, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            message = '';
        var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
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
            var version=$(".vquext-version", this).eq(0).text(),
                dl = $(".vquext-DataGame", this),
                mOption = $eXeVideoQuExt.loadDataGame(dl,version),
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
            $eXeVideoQuExt.addEvents(i);
            $eXeVideoQuExt.createPointsVideo(i);
        });
        setTimeout(function () {
            if (typeof (YT) !== "undefined") {
                $eXeVideoQuExt.youTubeReady();
            } else {
                $eXeVideoQuExt.loadYoutubeApi();
            }
        }, 3000);

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
    createPointsVideo: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            widthBar = $('#vquextProgressBar-' + instance).width(),
            duratioVideo = mOptions.endVideoQuExt - mOptions.startVideoQuExt,
            widthIntBar = 0;
        $('#vquextProgressBar-' + instance + ' .vquext-PointBar').remove();
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            widthIntBar = ((mOptions.questionsGame[i].pointVideo - mOptions.startVideoQuExt) * widthBar) / duratioVideo;
            $('#vquextProgressBar-' + instance).append('<div class="vquext-PointBar"></div>');
            $('#vquextProgressBar-' + instance + ' .vquext-PointBar').last().css('left', widthIntBar + 'px');
        }
    },
    createInterfaceVideoQuExt: function (instance) {
        var html = '',
            path = $eXeVideoQuExt.idevicePath,
            msgs = $eXeVideoQuExt.options[instance].msgs;
        html += '<div class="vquext-MainContainer">\
        <div class="vquext-GameMinimize" id="vquextGameMinimize-' + instance + '">\
            <a href="#" class="vquext-LinkMaximize" id="vquextLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'vquextIcon.png" class="vquext-Icons vquext-IconMinimize" alt="Mostrar actividad">\
                <div class="vquext-MessageMaximize" id="vquextMessageMaximize-' + instance + '"></div>\
            </a>\
        </div>\
        <div class="vquext-GameContainer" id="vquextGameContainer-' + instance + '">\
            <div class="vquext-GameScoreBoard">\
                <div class="vquext-GameScores">\
                    <a href="#" class="vquext-LinkMinimize" id="vquextLinkMinimize-' + instance + '" title="Minimizar">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize"></div>\
                    </a>\
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
                <div class="vquext-LifesGame" id="vquextLifesGame-' + instance + '">\
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
                <div class="vquext-NumberLifesGame" id="vquextNumberLivesGame-' + instance + '">\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="vquextPLifes-' + instance + '">0</p>\
                </div>\
                <div class="vquext-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Time"></div>\
                    <p id="vquextPTime-' + instance + '" class="vquext-PTime">00:00</p>\
                    <strong><span class="sr-av">' + msgs.msgNumQuestions + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Number"></div>\
                    <p id="vquextPNumber-' + instance + '">0</p>\
                    <a href="#" class="vquext-LinkFullScreen" id="vquextLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen" id="vquextFullScreen-' + instance + '">\
                        </div>\
                    </a>\
                </div>\
            </div>\
            <div class="vquext-ShowClue" id="vquextShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="vquext-PShowClue vquext-parpadea" id="vquextPShowClue-' + instance + '"></p>\
            </div>\
            <div class="vquext-Multimedia" id="vquextMultimedia-' + instance + '">\
                <img  src="" class="vquext-Images" id="vquextImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <img src="' + path + 'vquextHome.png" class="vquext-Images" id="vquextCover-' + instance + '" alt="' + msgs.msImage + '" />\
                <div class="vquext-Video" id="vquextVideo-' + instance + '"></div>\
                <div class="vquext-Protector" id="vquextProtector-' + instance + '"></div>\
                <div class="vquext-GameOver" id="vquextGamerOver-' + instance + '">\
                    <div class="vquext-TextClueGGame" id="vquextTextClueGGame-' + instance + '"></div>\
                    <div class="vquext-DataImageGameOver">\
                        <img src="' + path + 'quextGameWon.png" class="vquext-HistGGame" id="vquextHistGGame-' + instance + '" alt="' + msgs.mgsAllQuestions + '" />\
                        <img src="' + path + 'quextGameLost.png" class="vquext-LostGGame" id="vquextLostGGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                        <div class="vquext-DataGame" id="vquextDataGame-' + instance + '">\
                            <p id="vquextOverScore-' + instance + '">Score: 0</p>\
                            <p id="vquextOverHits-' + instance + '">Hits: 0</p>\
                            <p id="vquextOverErrors-' + instance + '">Errors: 0</p>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="vquext-ProgressBar" id="vquextProgressBar-' + instance + '">\
                <div class="vquext-InterBar" id="vquextInterBar-' + instance + '"></div>\
            </div>\
            <div class="vquext-AuthorLicence" id="vquextAuthorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="vquextPAuthor-' + instance + '"></p>\
            </div>\
            <div class="vquext-CodeAccessDiv" id="vquextCodeAccessDiv-' + instance + '">\
                <p class="vquext-MessageCodeAccessE" id="vquextMesajeAccesCodeE-' + instance + '"></p>\
                <div class="vquext-DataCodeAccessE">\
                    <label for="vquextCodeAccessE">' + msgs.msgCodeAccess + ':</label><input type="text" class="vquext-CodeAccessE"  id="vquextCodeAccessE-' + instance + '" readonly>\
                    <a href="#" id="vquextCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                        <div class="exeQuextIcons-Submit"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="sr-av" id="vquextStarGameSRAV-' + instance + '">' + msgs.msgPlayStart + ':</div>\
            <div class="vquext-StartGame"><a href="#" id="vquextStarGame-' + instance + '"></a></div>\
            <div class="vquext-QuestionDiv" id="vquextQuestionDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgQuestions + ':</div>\
                <div class="vquext-Question" id="vquextQuestion-' + instance + '">\
                </div>\
                <div class="vquext-DivReply" id="vquextDivReply-' + instance + '">\
                    <label class="sr-av">' + msgs.msgIndicateSolution + ':</label><input type="text" value="" class="vquext-EdReply" id="vquextEdAnswer-' + instance + '" autocomplete="false">\
                    <a href="#" id="vquextBtnReply-' + instance + '" title="' + msgs.msgReply + '">\
                        <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                        <div class="exeQuextIcons-Submit"></div>\
                    </a>\
                </div>\
                <div class="vquext-OptionsDiv" id="vquextOptionsDiv-' + instance + '">\
                    <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                    <a href="#"  class="vquext-Option1 vquext-Options" id="vquextOption1-' + instance + '"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                    <a href="#"  class="vquext-Option2 vquext-Options" id="vquextOption2-' + instance + '"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                    <a href="#"  class="vquext-Option3 vquext-Options" id="vquextOption3-' + instance + '"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                    <a href="#"  class="vquext-Option4 vquext-Options" id="vquextOption4-' + instance + '"></a>\
                </div>\
            </div>\
            <div class="vquext-ReloadContainer" id="vquextVideoReloadContainer-' + instance + '">\
                <a href="#" class="vquext-LinkReload" id="vquextReeload-' + instance + '" title="' + msgs.msgReloadVideo + '">\
                    <strong><span class="sr-av">' + msgs.msgReloadVideo + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Reload"></div>\
                </a>\
                <a href="#" class="vquext-LinkPauseVideo" id="vquextPauseVideo-' + instance + '" title="' + msgs.msgPauseVideo + '">\
                    <strong><span class="sr-av">' + msgs.msgPauseVideo + ':</span></strong>\
                    <div class=" exeQuextIcons exeQuextIcons-PauseVideo"></div>\
                </a>\
                <a href="#" class="vquext-LinkPreview" id="vquextPreview-' + instance + '" title="' + msgs.msgPreviewQuestions + '">\
                    <strong><span class="sr-av">' + msgs.msgPreviewQuestions + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Preview"></div>\
                </a>\
            </div>\
            <div class="vquext-previewQuestionsDiv" id="vquextpreviewQuestionsDiv-' + instance + '">\
                <p class="vquext-PreviewQuestionsTitle">' + msgs.msgQuestions + '</p>\
                <strong><span class="sr-av">' + msgs.msgQuestions + ':</span></strong>\
                <input type="button" class="vquext-previewQuestionsClose feedbackbutton"  id="vquextpreviewQuestionsClose-' + instance + '" value="' + msgs.msgClose + '" />\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance)
        return html;
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        var butonScore = "";
        var fB = '<div class="vquext-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="vquext-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="vquextSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton vquext-SendScore" /> <span class="vquext-RepeatActivity" id="vquextRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="vquext-GetScore">';
                fB += '<p><span class="vquext-RepeatActivity" id="vquextRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    loadDataGame: function (data,version) {
        var json = data.text();
        if (version==1){
            json=$eXeVideoQuExt.Decrypt(json);
        }
        var mOptions = $eXeVideoQuExt.isJsonString(json);
        mOptions.gameOver = false;
        mOptions.idVideoQuExt = $eXeVideoQuExt.getIDYoutube(mOptions.idVideoQuExt);
        mOptions.numberQuestions = mOptions.questionsGame.length;
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
                    'onError': $eXeVideoQuExt.onPlayerError
                }
            });
            $('#vquextStarGame-' + i).text(mOptions.msgs.msgStartGame);
            $('#vquextCodeAccessE-' + i).prop("readonly", false);


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
        $eXeVideoQuExt.youtubeLoaded = true;
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideo: function (id, start, end, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.player) {
            mOptions.player.loadVideoById({
                'videoId': id,
                'startSeconds': start,
                'endSeconds': end
            });
        }
    },
    playVideo: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.player) {
            mOptions.player.playVideo();
        }
    },
    stopVideo: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.player) {
            mOptions.player.pauseVideo();
        }
    },
    muteVideo: function (mute, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.player) {
            if (mute) {
                mOptions.player.mute();
            } else {
                mOptions.player.unMute();
            }
        }
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
        });
        $("#vquextLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#vquextGameContainer-" + instance).hide();
            $("#vquextGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        $('#vquextSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeVideoQuExt.sendScore(false, instance);
        });
        $('#vquextReeload-' + instance).click(function (e) {
            e.preventDefault();
            $eXeVideoQuExt.reloadQuestion(instance);

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
        $('#vquextPreview-' + instance).hide();
        $('#vquextReeload-' + instance).hide();
        $('#vquextPauseVideo-' + instance).hide();
        $('#vquextVideoReloadContainer-' + instance).hide();
        if (mOptions.previewQuestions) {
            $('#vquextVideoReloadContainer-' + instance).show();
            $('#vquextPreview-' + instance).show();
        }
        $('#vquextGamerOver-' + instance).hide();
        $('#vquextCodeAccessDiv-' + instance).hide();
        $('#vquextVideo-' + instance).hide();
        $('#vquextImagen-' + instance).hide();
        $('#vquextCursor-' + instance).hide();
        $('#vquextCover-' + instance).show();
        $("#vquextCover-" + instance).prop('src', $eXeVideoQuExt.idevicePath + 'vquextHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error al cargar imagen');
                } else {
                    var mData = $eXeVideoQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeVideoQuExt.drawImage(this, mData);
                }
            });
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
        $('#vquextStarGame-' + instance).text(mOptions.msgs.msgLoading);
        $('#vquextStarGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeVideoQuExt.startGame(instance);
        })
        $("#vquextOptionsDiv-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            if ($(e.target).hasClass('vquext-Options')) {
                var answer = $(e.target).text();
                $eXeVideoQuExt.answerQuestion(answer, instance);
            }
        });
        $("#vquextLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('vquextGameContainer-' + instance);
            $eXeVideoQuExt.toggleFullscreen(element, instance);
        });
        $eXeVideoQuExt.updateLives(instance);
        $('#vquextInstructions-' + instance).text(mOptions.instructions);

        $('#vquextPNumber-' + instance).text(mOptions.numberQuestions);
        $('#vquextGameContainer-' + instance+' .vquext-StartGame').show();
        $('#vquextQuestionDiv-' + instance).hide();
        if (mOptions.itinerary.showCodeAccess) {
            $('#vquextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#vquextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#vquextCodeAccessDiv-' + instance).show();
            $('#vquextGameContainer-' + instance+' .vquext-StartGame').hide();
            $('#vquextQuestionDiv-' + instance).hide();

        }
        $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function (e) {
            var fullScreenElement =
                document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            $eXeVideoQuExt.maximizeMultimedia(typeof fullScreenElement != "undefined", instance);
        });
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
            $eXeVideoQuExt.createPointsVideo(instance);
            $eXeVideoQuExt.refreshImageActive(instance);
        });
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
        $('#vquextpreviewQuestionsDiv-' + instance).find('.vquext-prevQuestP').remove();
        for (var i = 0; i < mOptions.questionsGame.length; i++) {
            $('#vquextpreviewQuestionsDiv-' + instance).append('<p class="vquext-prevQuestP">' + (i + 1) + '.- ' + mOptions.questionsGame[i].quextion + '</p>');
        }
        $('#vquextpreviewQuestionsDiv-' + instance).slideToggle();
    },
    reloadQuestion: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.stateReproduction > 1) return;
        $eXeVideoQuExt.pauseVideoQuestion(instance, false);
        pointVideo = mOptions.activeQuestion > 0 ? mOptions.questionsGame[mOptions.activeQuestion - 1].pointVideo : mOptions.startVideoQuExt;
        mOptions.player.seekTo(pointVideo + 1);
        mOptions.stateReproduction = 0;
        $eXeVideoQuExt.clearQuestions(instance);
        if (mOptions.activeQuestion < mOptions.questionsGame.length) {
            $eXeVideoQuExt.showQuestion(mOptions.activeQuestion, instance);
        } else {
            $('#vquextVideo-' + instance).show();
            $('#vquextCover-' + instance).hide();
            $eXeVideoQuExt.muteVideo(false, instance);
        }

        $eXeVideoQuExt.playVideo(instance);
        mOptions.counter = $eXeVideoQuExt.getTimeSeconds(mOptions.questionsGame[mOptions.activeQuestion].time);
        $eXeVideoQuExt.uptateTime(0, instance);
    },
    maximizeMultimedia: function (maximize, instance) {
        var css = {
                "height": "315px",
                "width": "560px",
                "margin": "auto"
            },
            hQ = 45;
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
        }
        $('#vquextQuestion-' + instance).css({
            "height": hQ + "px",
            'text-aling':'center'
        });
        $('#vquextOptionsDiv-' + instance + '>.vquext-Options').css({
            "height": hQ + "px",
            'text-aling':'center'
        });
        $('#vquextMultimedia-' + instance).css(css);
        $eXeVideoQuExt.refreshImageActive(instance);
    },
    refreshImageActive: function (instance) {
        $("#vquextCover-" + instance).prop('src', $eXeVideoQuExt.idevicePath + 'vquextHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error loading image');
                } else {
                    var mData = $eXeVideoQuExt.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeVideoQuExt.drawImage(this, mData);

                }
            });
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.itinerary.codeAccess === $('#vquextCodeAccessE-' + instance).val()) {
            $('#vquextQuestionDiv-' + instance).show();
            $('#vquextCodeAccessDiv-' + instance).hide();
            $eXeVideoQuExt.startGame(instance);
        } else {
            $('#vquextMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#vquextCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            msgs = mOptions.msgs,
            $vquextHistGGame = $('#vquextHistGGame-' + instance),
            $vquextLostGGame = $('#vquextLostGGame-' + instance),
            $vquextClueGGame = $('#vquextClueGGame-' + instance),
            $vquextOverPoint = $('#vquextOverScore-' + instance),
            $vquextOverHits = $('#vquextOverHits-' + instance),
            $vquextOverErrors = $('#vquextOverErrors-' + instance),
            $vquextTextClueGGame = $('#vquextTextClueGGame-' + instance),
            $vquextGamerOver = $('#vquextGamerOver-' + instance),
            message = "",
            messageColor = 2;
        $vquextHistGGame.hide();
        $vquextLostGGame.hide();
        $vquextClueGGame.hide();
        $vquextOverPoint.show();
        $vquextOverHits.show();
        $vquextOverErrors.show();
        $vquextTextClueGGame.hide();
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.mgsAllQuestions;
                $vquextHistGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        message = msgs.mgsAllQuestions;
                        $vquextTextClueGGame.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $vquextTextClueGGame.show();
                    } else {
                        $vquextTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $vquextTextClueGGame.show();
                    }
                }
                break;
            case 1:
                message = msgs.msgLostLives;
                messageColor = 1;
                $vquextLostGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        $vquextTextClueGGame.text(msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                        $vquextTextClueGGame.show();
                    } else {
                        $vquextTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $vquextTextClueGGame.show();
                    }
                }
                break;
            case 2:
                message = msgs.msgInformation;
                $vquextOverPoint.hide();
                $vquextOverHits.hide();
                $vquextOverErrors.hide();
                $vquextClueGGame.show();
                $vquextTextClueGGame.text(mOptions.itinerary.clueGame);
                $vquextTextClueGGame.show();
                break;
            default:
                break;
        }
        $('#vquextPShowClue-' + instance).hide();
        $eXeVideoQuExt.showMessage(messageColor, message, instance);
        $vquextOverPoint.text(msgs.msgScore + ': ' + mOptions.score);
        $vquextOverHits.text(msgs.msgHits + ': ' + mOptions.hits);
        $vquextOverErrors.text(msgs.msgErrors + ': ' + mOptions.errors);
        $vquextGamerOver.show();
    },
    startGame: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (!$eXeVideoQuExt.youtubeLoaded) {
            $eXeVideoQuExt.showMessage(1, mOptions.msgs.msgLoadInterface, instance)
            return;
        }
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.obtainedClue = false;
        $('#vquextPShowClue-' + instance).hide();
        $('#vquextPShowClue-' + instance).text("");
        $('#vquextGameContainer-' + instance+' .vquext-StartGame').hide();
        $('#vquextQuestionDiv-' + instance).show();
        $('#vquextQuestion-' + instance).text('');
        $('#vquextProgressBar-' + instance).show();
        if (mOptions.reloadQuestion || mOptions.previewQuestions || mOptions.pauseVideo) {
            $('#vquextVideoReloadContainer-' + instance).show();
            if (mOptions.previewQuestions) {
                $('#vquextPreview-' + instance).show();
            }
            if (mOptions.reloadQuestion) {
                $('#vquextReeload-' + instance).show();
            }
            if (mOptions.pauseVideo) {
                $('#vquextPauseVideo-' + instance).show();
            }
        }
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
        $('#vquextPNumber-' + instance).text(mOptions.numberQuestions);
        mOptions.counterClock = setInterval(function () {
            switch (mOptions.stateReproduction) {
                case 0:
                    mOptions.gameActived = false;
                    var timeVideo = mOptions.player.getCurrentTime();
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
                        $eXeVideoQuExt.drawQuestions(instance);
                        mOptions.counter = $eXeVideoQuExt.getTimeSeconds(mOptions.questionsGame[mOptions.activeQuestion].time);
                        mOptions.stateReproduction = 1;
                        $eXeVideoQuExt.stopVideo(instance);
                        $eXeVideoQuExt.updataProgressBar(mOptions.questionsGame[mOptions.activeQuestion].pointVideo, instance);
                        mOptions.gameActived = true;
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
                            $eXeVideoQuExt.drawSolution(instance, false);
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
                        $('#vquextVideo-' + instance).show();
                        $('#vquextCover-' + instance).hide();
                        $eXeVideoQuExt.muteVideo(false, instance);
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
        if (mOptions.gameActived) {

        }
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        $('#vquextVideoReloadContainer-' + instance).hide();
        clearInterval(mOptions.counterClock);
        $('#vquextVideo-' + instance).hide();
        $('#vquextProgressBar-' + instance).hide();
        $('#vquextCursor-' + instance).hide();
        $('#vquextCover-' + instance).hide();
        var message = type === 0 ? mOptions.msgs.mgsAllQuestions : mOptions.msgs.msgLostLives;
        $eXeVideoQuExt.showMessage(0, message, instance);
        $eXeVideoQuExt.showScoreGame(type, instance);
        $eXeVideoQuExt.clearQuestions(instance);
        $eXeVideoQuExt.uptateTime(0, instance);
        $('#vquextPNumber-' + instance).text('0');
        $('#vquextStarGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#vquextGameContainer-' + instance+' .vquext-StartGame').show();
        $('#vquextQuestionDiv-' + instance).hide();
        mOptions.gameOver = true;
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeVideoQuExt.initialScore = score;
            }
        }
    },
    drawText: function (texto, color) {},
    showQuestion: function (i, instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            mQuextion = mOptions.questionsGame[i];
        $('#vquextPNumber-' + instance).text(mOptions.numberQuestions - mOptions.activeQuestion)
        mOptions.question = mQuextion;
        if (mOptions.answersRamdon) {
            $eXeVideoQuExt.ramdonOptions(instance);
        }
        if (mQuextion.imageVideo === 0) {
            $('#vquextVideo-' + instance).hide();
            $('#vquextCover-' + instance).show();

        } else {
            $('#vquextVideo-' + instance).show();
            $('#vquextCover-' + instance).hide();
        }
        $eXeVideoQuExt.showMessage(0, mOptions.authorVideo, instance);
        if (mQuextion.soundVideo === 0) {
            $eXeVideoQuExt.muteVideo(true, instance);
        } else {
            $eXeVideoQuExt.muteVideo(false, instance);
        }
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
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
        var answord = $.trim(answer.toUpperCase());
        if (mOptions.question.typeQuestion == 1 && answord.length == 0) {
            $eXeAdivina.showMessage(1, mOptions.msgs.msgIndicateSolution, instance);
            return;
        }
        mOptions.gameActived = false;
        var message = "",
            solution = $.trim(mOptions.question.options[mOptions.question.solution]).toUpperCase(),
            valid = false;
        if (mOptions.question.typeQuestion == 1) {
            valid = $eXeVideoQuExt.checkWord(mOptions.question.solutionQuestion, answer);
        } else {
            valid = solution === answord;
        }
        if (mOptions.showSolution) {
            $eXeVideoQuExt.drawSolution(instance);
        }
        var obtainedPoints = 0,
            type = 1;
        if (valid) {
            mOptions.hits++
            color = $eXeVideoQuExt.colors.green;
            obtainedPoints = 1000 + mOptions.counter * 10;
            message = $eXeVideoQuExt.getRetroFeedMessages(true, instance) + ' ' + obtainedPoints + ' ' + mOptions.msgs.mgsPoints;
            type = 2;
        } else {
            mOptions.errors++;
            if (mOptions.useLives) {
                mOptions.livesLeft--;
                $eXeVideoQuExt.updateLives(instance);
                message = $eXeVideoQuExt.getRetroFeedMessages(false, instance) + ' ' + mOptions.msgs.msgLoseLive;
            } else {
                obtainedPoints = -330;
                message = $eXeVideoQuExt.getRetroFeedMessages(false, instance) + ' ' + mOptions.msgs.msgLoseT;
            }
        }
        var tmsg=message;
        if (mOptions.question.typeQuestion == 1) {
            tmsg = message + ': ' + mOptions.question.solutionQuestion;
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        $('#vquextPScore-' + instance).text(mOptions.score);
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        $('#vquextPHits-' + instance).text(mOptions.hits);
        $('#vquextPErrors-' + instance).text(mOptions.errors);
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                tmsg=message + " " + mOptions.msgs.msgUseFulInformation;
                $('#vquextPShowClue-' + instance).show();
                $('#vquextPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
            }
        }
        mOptions.counter = 1;

        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeVideoQuExt.gameOver(1, instance);
            return;
        }
        $eXeVideoQuExt.showMessage(type, tmsg, instance);
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
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
    reduceText: function (text) {
        var rText = text;
        for (var i = 8; i < 40; i++) {
            var normal = i + 'pt';
            var re = new RegExp(normal, "gi");
            var reducido = (i - 3) + 'pt';
            rText = rText.replace(re, reducido)
        }
        return rText;
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeVideoQuExt.borderColors.red, $eXeVideoQuExt.borderColors.green, $eXeVideoQuExt.borderColors.blue, $eXeVideoQuExt.borderColors.yellow];
        color = colors[type];
        var weight = type == 0 ? 'normal' : 'bold';
        $('#vquextPAuthor-' + instance).text(message);
        $('#vquextPAuthor-' + instance).css({
            'color': color,
            'font-weight': weight
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
            colors = [$eXeVideoQuExt.colors.red, $eXeVideoQuExt.colors.blue, $eXeVideoQuExt.colors.green, $eXeVideoQuExt.colors.yellow],
            bordeColors = [$eXeVideoQuExt.borderColors.red, $eXeVideoQuExt.borderColors.blue, $eXeVideoQuExt.borderColors.green, $eXeVideoQuExt.borderColors.yellow],
            ntime = $eXeVideoQuExt.getTimeToString($eXeVideoQuExt.getTimeSeconds(mQuextion.time))
        $('#vquextQuestion-' + instance).text(mQuextion.quextion).show();
        $('#vquextPTime-' + instance).text(ntime);
        if (mQuextion.typeQuestion == 1) {
            $('#vquextDivReply-' + instance).show();
            $('#vquextOptionsDiv-' + instance).hide();
            $('#vquextSolutionWord').focus();
        } else {
            $('#vquextOptionsDiv-' + instance + '>.vquext-Options').each(function (index) {
                var option = mQuextion.options[index]
                $(this).css({
                    'border-color': bordeColors[index],
                    'background-color': colors[index],
                    'cursor': 'pointer',
                    "text-aling":"center"
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
    },
    drawSolution: function (instance, valid) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (mOptions.question.typeQuestion == 1) {

        } else {
            $('#vquextOptionsDiv-' + instance + '>.vquext-Options').each(function (index) {
                if (index === mOptions.question.solution) {
                    $(this).css({
                        'border-color': '#00ff00',
                        'background-color': '#dcffdc',
                        'cursor': 'default',
                        "text-aling":"center"
                    });
                } else {
                    $(this).css({
                        'border-color': '#cccccc',
                        'background-color': 'transparent',
                        'cursor': 'default',
                        "text-aling":"center"
                    });
                }
            });
        }

    },
    clearQuestions: function (instance) {
        var colors = [$eXeVideoQuExt.colors.red, $eXeVideoQuExt.colors.blue, $eXeVideoQuExt.colors.green, $eXeVideoQuExt.colors.yellow];
        var bordeColors = [$eXeVideoQuExt.borderColors.red, $eXeVideoQuExt.borderColors.blue, $eXeVideoQuExt.borderColors.green, $eXeVideoQuExt.borderColors.yellow];
        $('#vquextOptionsDiv-' + instance + '>.vquext-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': colors[index],
                'cursor': 'default',
                'text-aling':'center'
            }).text('');
        });
        $('#vquextQuestion-' + instance).text("");
        $('#vquextPTime--' + instance).text("00:00");
        $('#vquextOptionsDiv-' + instance).hide();
        $('#vquextDivReply-' + instance).hide();
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
    }
}
$(function () {
    $eXeVideoQuExt.init();
});