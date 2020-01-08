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
    fontSize:'13px',
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
            message = '',
            score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeVideoQuExt.mScorm != 'undefined') {
                if (!auto) {
                    $('#vquextSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeVideoQuExt.previousScore !== '') {
                        message = $eXeVideoQuExt.userName !== '' ? $eXeVideoQuExt.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeVideoQuExt.previousScore = score;
                        $eXeVideoQuExt.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeVideoQuExt.userName !== '' ? $eXeVideoQuExt.userName + ', tu puntuación es :' + score : 'Tu puntuación es : ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#vquextSendScore-' + instance).hide();
                        }
                        $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgSaveScoreButton + ': ' + score)
                        $('#vquextRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeVideoQuExt.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeVideoQuExt.mScorm.set("cmi.core.score.raw", score);
                    $('#vquextRepeatActivity-' + instance).text('Tu puntuación es : ' + score)
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
            var dl = $(".vquext-DataGame", this),
                mOption = $eXeVideoQuExt.loadDataGame(dl),
                msg = mOption.msgs.msgPlayStart;

            $eXeVideoQuExt.options.push(mOption);
            var vquext = $eXeVideoQuExt.createInterfaceVideoQuExt(i);
            dl.before(vquext).remove();
            $('#vquextGameMinimize-' + i).hide();
            $('#vquextGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#vquextGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#vquextGameContainer-' + i).show();
            }
            $('#vquextMessageMaximize-' + i).text(msg);
            $eXeVideoQuExt.addEvents(i);
            $eXeVideoQuExt.createPointsVideo(i);
        });
        setTimeout(function(){
            if(typeof(YT)!=="undefined"){
                $eXeVideoQuExt.youTubeReady();
            }else{
                $eXeVideoQuExt.loadYoutubeApi();
                
            }
        },3000);

        

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
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">' + msgs.msgHits + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Hit"></div>\
                        <p id="vquextPHits-' + instance + '">0</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">' + msgs.msgErrors + ':</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Error"></div>\
                        <p id="vquextPErrors-' + instance + '">0</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">' + msgs.msgScore + ':</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Score"></div>\
                        <p id="vquextPScore-' + instance + '">0</p>\
                    </div>\
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
                    <div class="vquext-TimeQuestion">\
                        <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Time"></div>\
                        <p id="vquextPTime-' + instance + '">00:00</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">' + msgs.msgNumQuestions + ':</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Number"></div>\
                        <p id="vquextPNumber-' + instance + '">0</p>\
                    </div>\
                    	<a href="#" class="vquext-LinkFullScreen" id="vquextLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen" id="vquextFullScreen-' + instance + '">\
                        </div>\
                    </a>\
                </div>\
            </div>\
            <div class="vquext-ShowClue" id="vquextShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="vquext-PShowClue" id="vquextPShowClue-' + instance + '"></p>\
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
            <div class="vquext-AutorLicence" id="vquextAutorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="vquextPAuthor-' + instance + '"></p>\
            </div>\
            <div class="vquext-CodeAccessDiv" id="vquextCodeAccessDiv-' + instance + '">\
                <div class="vquext-MessageCodeAccessE" id="vquextMesajeAccesCodeE-' + instance + '"></div>\
                <div class="vquext-DataCodeAccessE">\
                    <label>' + msgs.msgCodeAccess + ':</label><input type="text" class="vquext-CodeAccessE"  id="vquextCodeAccessE-' + instance + '">\
                    <input type="button" class="vquext-CodeAccessButton" id="vquextCodeAccessButton-' + instance + '"   value="' + msgs.msgSubmit + '" />\
                </div>\
            </div>\
            <div class="sr-av" id="vquextStarGameSRAV-' + instance + '">' + msgs.msgPlayStart + ':</div>\
            <a href="#" class="vquext-StarGame" id="vquextStarGame-' + instance + '">\</a>\
            <div class="vquext-QuestionDiv" id="vquextQuestionDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <h2 class="vquext-Question" id="vquextQuestion-' + instance + '">\
                </h2>\
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
            <div class="vquext-VideoIntroContainer" id="vquextVideoIntroContainer-' + instance + '">\
                <a href="#" class="vquext-LinkVideoIntroShow" id="vquextLinkVideoIntroShow-' + instance + '" title="' + msgs.msgVideoIntro + '">\
                    <strong><span class="sr-av">' + msgs.msgVideoIntro + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Video"></div>\
                </a>\
            </div>\
            <div class="vquext-VideoIntroDiv" id="vquextVideoIntroDiv-' + instance + '">\
                <div class="vquext-VideoIntro" id="vquextVideoIntro-' + instance + '"></div>\
                <input type="button" class="vquext-VideoIntroClose" id="vquextVideoIntroClose-' + instance + '" value="' + msgs.msgClose + '" />\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
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
                    fB += '<p><input type="button" id="vquextSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="vquext-RepeatActivity" id="vquextRepeatActivity-' + instance + '"></span></p>';
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
    loadDataGame: function (data) {
        var json = data.text(),
            mOptions = $eXeVideoQuExt.isJsonString(json);
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
            $('#vquextStarGame-' + i).css('color',$eXeVideoQuExt.borderColors.red);
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
        $('#vquextStarGame-' + instance).css('color',$eXeVideoQuExt.borderColors.blue);

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
        if (mOptions.itinerary.showCodeAccess) {
            $('#vquextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#vquextMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#vquextCodeAccessDiv-' + instance).show();
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
        $('#vquextShowClue-' + instance).hide();
        mOptions.gameOver = false;
        $('#vquextStarGame-' + instance).show();
        $('#vquextStarGameSRAV-' + instance).show();
        $('#vquextQuestionDiv-' + instance).hide();


    },
    maximizeMultimedia: function (maximize, instance) {
        var css = {
                "height": "315px",
                "width": "560px",
                "margin": "auto"
            },
            hQ = 45;
            $eXeVideoQuExt.fontSize="13px";

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
            $eXeVideoQuExt.fontSize="16px";
        }
        $('#vquextQuestion-' + instance).css({
            "height": hQ + "px",
            "font-size": $eXeVideoQuExt.fontSize,
            "font-weight": "bold"
        });
        $('#vquextOptionsDiv-' + instance + '>.vquext-Options').css({
            "height": hQ + "px",
            "font-size": $eXeVideoQuExt.fontSize,
            "font-weight": "bold"
        });
        $('#vquextPAuthor-' + instance).css({
            'font-size':$eXeVideoQuExt.fontSize
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
            messageColor=2;
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
                messageColor=1;
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
        $('#vquextShowClue-' + instance).hide();
        $eXeVideoQuExt.showMessage(messageColor, message, instance);
        $vquextOverPoint.text(msgs.msgScore + ': ' + mOptions.score);
        $vquextOverHits.text(msgs.msgHits + ': ' + mOptions.hits);
        $vquextOverErrors.text(msgs.msgErrors + ': ' + mOptions.errors);
        $vquextGamerOver.show();
    },
    startGame: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (!$eXeVideoQuExt.youtubeLoaded) {
            $eXeVideoQuExt.showMessage(1,  mOptions.msgs.msgLoadInterface,instance)
            return;
        }
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.obtainedClue = false;
        $('#vquextShowClue-'+instance).hide();
        $('#vquextPShowClue-'+instance).text("");
        $('#vquextQuestion-'+instance).css({
            'color': $eXeVideoQuExt.colors.black,
            'text-align': 'center',
            'vertical-align': 'middle',
            'cursor': 'default',
            'font-weight': 'bold',
            'font-size': $eXeVideoQuExt.fontSize
        });
        $('#vquextStarGame-' + instance).hide();
        $('#vquextStarGameSRAV-' + instance).hide();
        $('#vquextQuestionDiv-' + instance).show();
        $('#vquextQuestion-' + instance).text('');
        if (window.innerWidth > 560) {
            $('#vquextProgressBar-'+instance).show();
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
        $eXeVideoQuExt.showQuestion(mOptions.activeQuestion,instance);
        $eXeVideoQuExt.startVideo(mOptions.idVideoQuExt, mOptions.startVideoQuExt, mOptions.endVideoQuExt,instance);
        $('#vquextPNumber-'+instance).text(mOptions.numberQuestions);
        mOptions.counterClock = setInterval(function () {
            switch (mOptions.stateReproduction) {
                case 0:
                    mOptions.gameActived = false;
                    var timeVideo = mOptions.player.getCurrentTime();
                    var pointVideo = timeVideo + 2;
                    $eXeVideoQuExt.updataProgressBar(timeVideo,instance);
                    if (mOptions.activeQuestion < mOptions.questionsGame.length) {
                        pointVideo = mOptions.questionsGame[mOptions.activeQuestion].pointVideo;
                    }
                    if (timeVideo >= mOptions.endVideoQuExt) {
                        mOptions.stateReproduction = -1;
                        $eXeVideoQuExt.gameOver(0,instance);
                        return;
                    }
                    if (timeVideo >= pointVideo) {
                        $eXeVideoQuExt.drawQuestions(instance);
                        mOptions.counter = $eXeVideoQuExt.getTimeSeconds(mOptions.questionsGame[mOptions.activeQuestion].time);
                        mOptions.stateReproduction = 1;
                        $eXeVideoQuExt.stopVideo(instance);
                        $eXeVideoQuExt.updataProgressBar(mOptions.questionsGame[mOptions.activeQuestion].pointVideo,instance);
                        mOptions.gameActived = true;
                    }
                    break;
                case 1:
                    mOptions.gameActived = true;
                    mOptions.counter--;
                    $eXeVideoQuExt.uptateTime(mOptions.counter,instance);
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
                        $eXeVideoQuExt.showQuestion(mOptions.activeQuestion,instance);
                    }
                    mOptions.stateReproduction = 0;
                    $eXeVideoQuExt.playVideo(instance);

                    break;
                default:
                    break;
            }
        }, 1000);
        $eXeVideoQuExt.uptateTime(0,instance);
        $('#vquextQuestion-'+instance).css({
            'color': $eXeVideoQuExt.borderColors.black,
            'text-align': 'center',
            'cursor': 'default',
            'font-weight': '600',
            'vertical-align': 'middle',
        });
        $('#vquextGamerOver-'+instance).hide();
        $('#vquextPHits-'+instance).text(mOptions.hits);
        $('#vquextPErrors-'+instance).text(mOptions.errors);
        $('#vquextPScore-'+instance).text(mOptions.score);
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
        clearInterval(mOptions.counterClock);
        $('#vquextVideo-' + instance).hide();
        $('#vquextProgressBar-' + instance).hide();
        $('#vquextCursor-' + instance).hide();
        $('#vquextCover-' + instance).hide();
        var message = type === 0 ? mOptions.msgs.mgsAllQuestions : mOptions.msgs.msgLostLives;
        $eXeVideoQuExt.showMessage(2, message, instance);
        $eXeVideoQuExt.showScoreGame(type, instance);
        $eXeVideoQuExt.clearQuestions(instance);
        $eXeVideoQuExt.uptateTime(0, instance);
        $('#vquextPNumber-' + instance).text('0');
        $('#vquextStarGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#vquextStarGame-' + instance).show();
        $('#vquextStarGameSRAV-' + instance).show();
        $('#vquextQuestionDiv-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true, instance);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeVideoQuExt.initialScore = score;
            }
        }
        mOptions.gameOver = true;
    },
    drawText: function (texto, color) {},
    showQuestion: function (i,instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            mQuextion = mOptions.questionsGame[i];
        $('#vquextPNumber-' + instance).text(mOptions.numberQuestions - mOptions.activeQuestion)
        mOptions.question = mQuextion
        if (mQuextion.imageVideo === 0) {
            $('#vquextVideo-' + instance).hide();
            $('#vquextCover-' + instance).show();

        } else {
            $('#vquextVideo-' + instance).show();
            $('#vquextCover-' + instance).hide();
        }
        $eXeVideoQuExt.showMessage(0, mOptions.authorVideo, instance);
        if (mQuextion.soundVideo === 0) {
            $eXeVideoQuExt.muteVideo(true,instance);
        } else {
            $eXeVideoQuExt.muteVideo(false,instance);
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
    answerQuestion: function (answer,instance) {
        var mOptions = $eXeVideoQuExt.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        if (mOptions.showSolution) {
            $eXeVideoQuExt.drawSolution(instance);
        } 
        mOptions.gameActived = false;

        var message = "";
        var solution = $.trim(mOptions.question.options[mOptions.question.solution]).toUpperCase();
        var answord = $.trim(answer.toUpperCase());
        var obtainedPoints = 0;
        var type = 1;
        if (solution === answord) {
            mOptions.hits++
            color = $eXeVideoQuExt.colors.green;
            obtainedPoints = 1000 + mOptions.counter * 10;
            message = $eXeVideoQuExt.getRetroFeedMessages(true,instance) + ' ' + obtainedPoints + ' '+mOptions.msgs.mgsPoints;
            type = 2;
        } else {
            mOptions.errors++;
            if (mOptions.useLives) {
                mOptions.livesLeft--;
                $eXeVideoQuExt.updateLives(instance);
                message = $eXeVideoQuExt.getRetroFeedMessages(false, instance) + ' ' +mOptions.msgs.msgLoseLive;
            } else {
                obtainedPoints = -330;
                message = $eXeVideoQuExt.getRetroFeedMessages(false, instance)  + ' ' +mOptions.msgs.msgLoseT;
            }
        }

        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        $('#vquextPScore-' + instance).text(mOptions.score);
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        $('#vquextPHits-' + instance).text(mOptions.hits);
        $('#vquextPErrors-' + instance).text(mOptions.errors);
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                message += " "+mOptions.msgs.msgUseFulInformation;
                $('#vquextShowClue-' + instance).show();
                $('#vquextPShowClue-' + instance).text(mOptions.msgs.msgInformation +": " + mOptions.itinerary.clueGame);
            }
        }
        mOptions.counter = 1;

        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeVideoQuExt.gameOver(1,instance);
            return;
        }
        $eXeVideoQuExt.showMessage(type, message,instance);
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeVideoQuExt.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeVideoQuExt.sendScore(true);
                $('#vquextRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
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
            'font-weight': weight,
            'font-size':$eXeVideoQuExt.fontSize
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
        $('#vquextOptionsDiv-' + instance+'>.vquext-Options').each(function (index) {
            var option = mQuextion.options[index]
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': colors[index],
                'cursor': 'pointer'
            }).text(option);
            if (option) {
                $(this).show();
            } else {
                $(this).hide()
            }
        });
    },
    drawSolution: function (instance) {
        var mOptions = $eXeVideoQuExt.options[instance],
            colors = [$eXeVideoQuExt.colors.red, $eXeVideoQuExt.colors.blue, $eXeVideoQuExt.colors.green, $eXeVideoQuExt.colors.yellow],
            bordeColors = [$eXeVideoQuExt.borderColors.red, $eXeVideoQuExt.borderColors.blue, $eXeVideoQuExt.borderColors.green, $eXeVideoQuExt.borderColors.yellow];
        $('#vquextOptionsDiv-' + instance + '>.vquext-Options').each(function (index) {
            if (index === mOptions.question.solution) {
                $(this).css({
                    'border-color': '#00ff00',
                    'background-color': '#dcffdc',
                    'cursor': 'default'
                });
            } else {
                $(this).css({
                    'border-color': '#cccccc',
                    'background-color': '#ffffff',
                    'cursor': 'default'
                });
            }
        });
    },
    clearQuestions: function (instance) {
        var colors = [$eXeVideoQuExt.colors.red, $eXeVideoQuExt.colors.blue, $eXeVideoQuExt.colors.green, $eXeVideoQuExt.colors.yellow];
        var bordeColors = [$eXeVideoQuExt.borderColors.red, $eXeVideoQuExt.borderColors.blue, $eXeVideoQuExt.borderColors.green, $eXeVideoQuExt.borderColors.yellow];
        $('#vquextOptionsDiv-' + instance + '>.vquext-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': colors[index],
                'cursor': 'default'
            }).text('');
        });
        $('#vquextQuestion-' + instance).text("");
        $('#vquextPTime--' + instance).text("00:00");
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