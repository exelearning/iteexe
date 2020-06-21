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
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#071717",
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
    msgs:'',
    youtubeLoaded: false,
    hasSCORMbutton: false,
    isInExe: false,
    init: function () {
        this.activities = $('.selecciona-IDevice');
        if (this.activities.length == 0) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Select Activity') + '</p>');
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
    loadJSCSSFile: function (filename, filetype){
        if (filetype=="js"){ //if filename is a external JavaScript file
            var fileref=document.createElement('script')
            fileref.setAttribute("type","text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype=="css"){ //if filename is an external CSS file
            var fileref=document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref!="undefined")
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
        if ($eXeSelecciona.mScorm) {
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
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeSelecciona.mScorm != 'undefined') {
                if (!auto) {
                    $('#seleccionaSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeSelecciona.previousScore !== '') {
                        message = $eXeSelecciona.userName !== '' ? $eXeSelecciona.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeSelecciona.previousScore = score;
                        $eXeSelecciona.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeSelecciona.userName !== '' ? $eXeSelecciona.userName + '. ' +mOptions.msgs.msgYouScore+ ': ' + score : mOptions.msgs.msgYouScore+ ': ' + score
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
                    $('#seleccionaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore+ ': ' + score)
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
            var dl = $(".selecciona-DataGame", this),
                imagesLink = $('.selecciona-LinkImages', this),
                mOption = $eXeSelecciona.loadDataGame(dl, imagesLink),
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
            $eXeSelecciona.addEvents(i);
        });
        if(typeof(MathJax)=="undefined"){
            $eXeSelecciona.loadMathJax();
        }
        setTimeout(function () {
            if (typeof (YT) !== "undefined") {
                $eXeSelecciona.youTubeReady();
            } else {
                $eXeSelecciona.loadYoutubeApi();
            }
        }, 4000);

    },
    loadMathJax: function () {
        var tag = document.createElement('script');
        //tag.src = "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS-MML_CHTML";
        tag.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML";
        tag.async=true;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    createInterfaceSelecciona: function (instance) {
        var html = '',
            path = $eXeSelecciona.idevicePath,
            msgs = $eXeSelecciona.options[instance].msgs;
        html += '<div class="selecciona-MainContainer">\
        <div class="selecciona-GameMinimize" id="seleccionaGameMinimize-' + instance + '">\
            <a href="#" class="selecciona-LinkMaximize" id="seleccionaLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'seleccionaIcon.png" class="selecciona-Icons selecciona-IconMinimize" alt="Mostrar actividad">\
                <div class="selecciona-MessageMaximize" id="seleccionaMessageMaximize-' + instance + '"></div>\
            </a>\
        </div>\
        <div class="selecciona-GameContainer" id="seleccionaGameContainer-' + instance + '">\
            <div class="selecciona-GameScoreBoard">\
                <div class="selecciona-GameScores">\
                    <a href="#" class="selecciona-LinkMinimize" id="seleccionaLinkMinimize-' + instance + '" title="Minimizar">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize"></div>\
                    </a>\
                    <strong><span class="sr-av">' + msgs.msgHits + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Hit"></div>\
                    <p id="seleccionaPHits-' + instance + '">0</p>\
                    <strong><span class="sr-av">' + msgs.msgErrors + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Error"></div>\
                    <p id="seleccionaPErrors-' + instance + '">0</p>\
                    <strong><span class="sr-av">' + msgs.msgScore + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Score"></div>\
                    <p id="seleccionaPScore-' + instance + '">0</p>\
                </div>\
                <div class="selecciona-LifesGame" id="seleccionaLifesGame-' + instance + '">\
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
                <div class="selecciona-NumberLifesGame" id="seleccionaNumberLivesGame-' + instance + '">\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="seleccionaPLifes-' + instance + '">0</p>\
                </div>\
                <div class="selecciona-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Time"></div>\
                    <p id="seleccionaPTime-' + instance + '" class="selecciona-PTime">00:00</p>\
                    <strong><span class="sr-av">' + msgs.msgNumQuestions + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Number"></div>\
                    <p id="seleccionaPNumber-' + instance + '">0</p>\
                    <a href="#" class="selecciona-LinkFullScreen" id="seleccionaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen" id="seleccionaFullScreen-' + instance + '">\
                     </div>\
                    </a>\
                </div>\
            </div>\
            <div class="selecciona-ShowClue" id="seleccionaShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="selecciona-PShowClue selecciona-parpadea" id="seleccionaPShowClue-' + instance + '"></p>\
            </div>\
            <div class="selecciona-Multimedia" id="seleccionaMultimedia-' + instance + '">\
                <img class="selecciona-Cursor" id="seleccionaCursor-' + instance + '" src="' + path + 'seleccionaCursor.gif" alt="Cursor" />\
                <img  src="" class="selecciona-Images" id="seleccionaImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                <div class="selecciona-EText" id="seleccionaEText-' + instance + '"></div>\
                <img src="' + path + 'seleccionaHome.png" class="selecciona-Images" id="seleccionaCover-' + instance + '" alt="' + msgs.msImage + '" />\
                <div class="selecciona-Video" id="seleccionaVideo-' + instance + '"></div>\
                <div class="selecciona-Protector" id="seleccionaProtector-' + instance + '"></div>\
                <div class="selecciona-GameOver" id="seleccionaGamerOver-' + instance + '">\
                    <div class="selecciona-TextClueGGame" id="seleccionaTextClueGGame-' + instance + '"></div>\
                    <div class="selecciona-DataImageGameOver">\
                        <img src="' + path + 'seleccionaGameWon.png" class="selecciona-HistGGame" id="seleccionaHistGGame-' + instance + '" alt="' + msgs.mgsAllQuestions + '" />\
                        <img src="' + path + 'seleccionaGameLost.png" class="selecciona-LostGGame" id="seleccionaLostGGame-' + instance + '"  alt="' + msgs.msgLostLives + '" />\
                        <div class="selecciona-DataGame" id="seleccionaDataGame-' + instance + '">\
                            <p id="seleccionaOverScore-' + instance + '">Score: 0</p>\
                            <p id="seleccionaOverHits-' + instance + '">Hits: 0</p>\
                            <p id="seleccionaOverErrors-' + instance + '">Errors: 0</p>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="selecciona-AuthorLicence" id="seleccionaAutorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="seleccionaPAuthor-' + instance + '"></p>\
            </div>\
            <div class="selecciona-CodeAccessDiv" id="seleccionaCodeAccessDiv-' + instance + '">\
                <div class="selecciona-MessageCodeAccessE" id="seleccionaMesajeAccesCodeE-' + instance + '"></div>\
                <div class="selecciona-DataCodeAccessE">\
                    <label>' + msgs.msgCodeAccess + ':</label><input type="text" class="selecciona-CodeAccessE"  id="seleccionaCodeAccessE-' + instance + '" readonly>\
                    <a href="#" id="seleccionaCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                        <div class="exeQuextIcons-Submit"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="sr-av" id="seleccionaStarGameSRAV-' + instance + '">' + msgs.msgPlayStart + ':</div>\
            <div class="selecciona-StartGame"><a href="#" id="seleccionaStarGame-' + instance + '"></a></div>\
            <div class="selecciona-QuestionDiv" id="seleccionaQuestionDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="selecciona-Question" id="seleccionaQuestion-' + instance + '"></div>\
                <div class="selecciona-OptionsDiv" id="seleccionaOptionsDiv-' + instance + '">\
                    <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                    <a href="#" class="selecciona-Option1 selecciona-Options" id="seleccionaOption1-' + instance + '" data-number="0"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                    <a href="#" class="selecciona-Option2 selecciona-Options" id="seleccionaOption2-' + instance + '" data-number="1"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                    <a href="#" class="selecciona-Option3 selecciona-Options" id="seleccionaOption3-' + instance + '" data-number="2"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                    <a href="#" class="selecciona-Option4 selecciona-Options" id="seleccionaOption4-' + instance + '" data-number="3"></a>\
                </div>\
            </div>\
            <div class="selecciona-BottonContainerDiv" id="seleccionaBottonContainer-' + instance + '">\
                <a href="#" class="selecciona-LinkVideoIntroShow" id="seleccionaLinkVideoIntroShow-' + instance + '" title="' + msgs.msgVideoIntro + '">\
                    <strong><span class="sr-av">' + msgs.msgVideoIntro + ':</span></strong>\
                    <div class="exeQuextIcons exeQuextIcons-Video"></div>\
                </a>\
                <div class="selecciona-AnswersDiv" id="seleccionaAnswerDiv-' + instance + '">\
                    <div class="selecciona-Answers" id="seleccionaAnswers-' + instance + '"></div>\
                    <a href="#" id="seleccionaButtonAnswer-' + instance + '" title="' + msgs.msgAnswer + '">\
                        <strong><span class="sr-av">' + msgs.msgAnswer + '</span></strong>\
                        <div class="exeQuextIcons-Submit"></div>\
                    </a>\
                </div>\
            </div>\
             <div class="selecciona-VideoIntroDiv" id="seleccionaVideoIntroDiv-' + instance + '">\
                <div class="selecciona-VideoIntro" id="seleccionaVideoIntro-' + instance + '"></div>\
                <input type="button" class="selecciona-VideoIntroClose feedbackbutton" id="seleccionaVideoIntroClose-' + instance + '" value="' + msgs.msgClose + '"/>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        var butonScore = "";
        var fB = '<div class="selecciona-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="selecciona-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="seleccionaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="selecciona-RepeatActivity" id="seleccionaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="selecciona-GetScore">';
                fB += '<p><span class="selecciona-RepeatActivity" id="seleccionaRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    loadDataGame: function (data, imgsLink) {
        var json = $eXeSelecciona.Decrypt(data.text()),
            mOptions = $eXeSelecciona.isJsonString(json);
        mOptions.gameOver = false;
        mOptions.scoreGame=0;
        imgsLink.each(function (index) {
            mOptions.selectsGame[index].url = $(this).attr('href');
            if(mOptions.selectsGame[index].url.length<10){
                mOptions.selectsGame[index].url="";
            }
        });
        mOptions.scoreTotal=0;
        for (var i=0;i< mOptions.selectsGame.length;i++){
            if(mOptions.customScore){
                mOptions.scoreTotal +=mOptions.selectsGame[i].customScore;
            }else{
                mOptions.selectsGame[i].customScore=1
                mOptions.scoreTotal +=mOptions.selectsGame[i].customScore
            }
        }
        mOptions.selectsGame = mOptions.optionsRamdon ? $eXeSelecciona.shuffleAds(mOptions.selectsGame) : mOptions.selectsGame;
        mOptions.numberQuestions = mOptions.selectsGame.length;
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
            $('#seleccionaStarGame-' + i).text(mOptions.msgs.msgStartGame);
            if ($eXeSelecciona.getIDYoutube($eXeSelecciona.options[i].idVideo) !== '') {
                $('#seleccionaVideoIntroContainer-' + i).css('display', 'flex');
                $('#seleccionaVideoIntroContainer-' + i).show();
                $('#seleccionaLinkVideoIntroShow-' + i).show();
            }
            $('#seleccionaCodeAccessE-'+ i).prop('readonly',false);
        }
    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeSelecciona.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        $eXeSelecciona.youtubeLoaded = true;
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideo: function (id, start, end, instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.player) {
            mOptions.player.loadVideoById({
                'videoId': id,
                'startSeconds': start,
                'endSeconds': end
            });
        }
    },
    startVideoIntro: function (id, start, end, instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.playerIntro) {
            mOptions.playerIntro.loadVideoById({
                'videoId': id,
                'startSeconds': start,
                'endSeconds': end
            });
        }
    },
    stopVideoIntro: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.playerIntro) {
            mOptions.playerIntro.pauseVideo();
        }
    },
    playVideo: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.player) {
            mOptions.player.playVideo();
        }
    },
    stopVideo: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.player) {
            mOptions.player.pauseVideo();
        }
    },
    muteVideo: function (mute, instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.player) {
            if (mute) {
                mOptions.player.mute();
            } else {
                mOptions.player.unMute();
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
        $('#seleccionaCover-' + instance).prop('src', $eXeSelecciona.idevicePath + 'seleccionaHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error al cargar imagen');
                } else {
                    var mData = $eXeSelecciona.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeSelecciona.drawImage(this, mData);
                }
            });
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
        mOptions.livesLeft = mOptions.numberLives;
        $('#seleccionaStarGame-' + instance).text(mOptions.msgs.msgLoading);
        $('#seleccionaStarGame-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeSelecciona.startGame(instance);
        })
        $('#seleccionaOptionsDiv-' + instance).find('.selecciona-Options').on('click touchstart', function (e) {
            e.preventDefault();
            $eXeSelecciona.changeQuextion(instance,this);
        })
        $('#seleccionaLinkFullScreen-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('seleccionaGameContainer-' + instance);
            $eXeSelecciona.toggleFullscreen(element, instance);
        });
        $eXeSelecciona.updateLives(instance);
        $('#seleccionaInstructions-' + instance).text(mOptions.instructions);

        $('#seleccionaPNumber-' + instance).text(mOptions.numberQuestions);
        $('#seleccionaGameContainer-' + instance+' .selecciona-StartGame').show();
        $('#seleccionaQuestionDiv-' + instance).hide();
        $('#seleccionaBottonContainer-' + instance).addClass('selecciona-BottonContainerDivEnd');

        if (mOptions.itinerary.showCodeAccess) {
            $('#seleccionaAnswerDiv-' + instance).hide();
            $('#seleccionaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#seleccionaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#seleccionaCodeAccessDiv-' + instance).show();
            $('#seleccionaGameContainer-' + instance+' .selecciona-StartGame').hide();
        }
        $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function (e) {
            var fullScreenElement =
                document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            $eXeSelecciona.maximizeMultimedia(typeof fullScreenElement != "undefined", instance);
        });
        $('#seleccionaInstruction-' + instance).text(mOptions.instructions);
        $('#seleccionaSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#seleccionaSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeSelecciona.updateScorm($eXeSelecciona.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#seleccionaShowClue-' + instance).hide();
        mOptions.gameOver = false;


        $('#seleccionaLinkVideoIntroShow-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#seleccionaVideoIntroDiv-' + instance).show();
            var idVideo = $eXeSelecciona.getIDYoutube(mOptions.idVideo);
            mOptions.endVideo = mOptions.endVideo <= mOptions.startVideo ? 36000 : mOptions.endVideo;
            $eXeSelecciona.startVideoIntro(idVideo, mOptions.startVideo, mOptions.endVideo, instance);
        });

        $('#seleccionaVideoIntroClose-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#seleccionaVideoIntroDiv-' + instance).hide();
            $eXeSelecciona.startVideoIntro('', 0, 0, instance);
        });
        $('#seleccionaButtonAnswer-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeSelecciona.answerQuestion(instance);
        });
    },
    changeQuextion: function (instance,button) {
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
        var colors = [$eXeSelecciona.colors.red, $eXeSelecciona.colors.blue, $eXeSelecciona.colors.green, $eXeSelecciona.colors.yellow],
            bordeColors = [$eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.yellow],
            css = {
                'border-size': 2,
                'border-color': bordeColors[numberButton],
                'background-color': colors[numberButton],
                'cursor': 'default',
                'color': $eXeSelecciona.colors.black
            }
        if (type) {
            css = {
                'border-size': 2,
                'border-color': $eXeSelecciona.colors.black,
                'background-color': bordeColors[numberButton],
                'cursor': 'point',
                'color': '#ffffff'
            }
        }
        $(button).css(css);
        $('#seleccionaAnswers-' + instance +' .selecciona-AnswersOptions').remove();
        for (var i = 0; i < mOptions.respuesta.length; i++) {
            if (mOptions.respuesta[i] === 'A') {
                $('#seleccionaAnswers-' + instance).append('<div class="selecciona-AnswersOptions selecciona-Answer1"></div>');

            } else if (mOptions.respuesta[i] === 'B') {
                $('#seleccionaAnswers-' + instance).append('<div class="selecciona-AnswersOptions selecciona-Answer2"></div>');

            } else if (mOptions.respuesta[i] === 'C') {
                $('#seleccionaAnswers-' + instance).append('<div class="selecciona-AnswersOptions selecciona-Answer3"></div>');

            } else if (mOptions.respuesta[i] === 'D') {
                $('#seleccionaAnswers-' + instance).append('<div class="selecciona-AnswersOptions selecciona-Answer4"></div>');
            }
        }

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
        $('#seleccionaQuestion-' + instance).css({
            "height": hQ + "px",
            'text-aling':'center'
        });
        $('#seleccionaOptionsDiv-' + instance + '>.selecciona-Options').css({
            "height": hQ + "px",
            'text-aling':'center'
        });
        $('#seleccionaMultimedia-' + instance).css(css);
        $eXeSelecciona.refreshImageActive(instance);
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            author = '';
        $('#seleccionaCover-' + instance).prop('src', $eXeSelecciona.idevicePath + 'seleccionaHome.png')
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                    console.log('Error loading image');
                } else {
                    var mData = $eXeSelecciona.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeSelecciona.drawImage(this, mData);

                }
            });
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
        if (mOptions.itinerary.codeAccess === $('#seleccionaCodeAccessE-' + instance).val()) {
            $('#seleccionaQuestionDiv-' + instance).show();
            $('#seleccionaCodeAccessDiv-' + instance).hide();
            $('#seleccionaAnswerDiv-' + instance).show();
            $eXeSelecciona.startGame(instance);
        } else {
            $('#seleccionaMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#seleccionaCodeAccessE-' + instance).val('');
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            msgs = mOptions.msgs,
            $seleccionaHistGGame = $('#seleccionaHistGGame-' + instance),
            $seleccionaLostGGame = $('#seleccionaLostGGame-' + instance),
            $seleccionaClueGGame = $('#seleccionaClueGGame-' + instance),
            $seleccionaOverPoint = $('#seleccionaOverScore-' + instance),
            $seleccionaOverHits = $('#seleccionaOverHits-' + instance),
            $seleccionaOverErrors = $('#seleccionaOverErrors-' + instance),
            $seleccionaTextClueGGame = $('#seleccionaTextClueGGame-' + instance),
            $seleccionaGamerOver = $('#seleccionaGamerOver-' + instance),
            message = "",
            messageColor=2;
        $seleccionaHistGGame.hide();
        $seleccionaLostGGame.hide();
        $seleccionaClueGGame.hide();
        $seleccionaOverPoint.show();
        $seleccionaOverHits.show();
        $seleccionaOverErrors.show();
        $seleccionaTextClueGGame.hide();
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.mgsAllQuestions;
                $seleccionaHistGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        message = msgs.mgsAllQuestions;
                        $seleccionaTextClueGGame.text(msgs.msgInformation+": " + mOptions.itinerary.clueGame);
                        $seleccionaTextClueGGame.show();
                    } else {
                        $seleccionaTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $seleccionaTextClueGGame.show();
                    }
                }
                break;
            case 1:
                message = msgs.msgLostLives;
                messageColor=1;
                $seleccionaLostGGame.show();
                if (mOptions.itinerary.showClue) {
                    if (mOptions.obtainedClue) {
                        $seleccionaTextClueGGame.text(msgs.msgInformation+": " + mOptions.itinerary.clueGame);
                        $seleccionaTextClueGGame.show();
                    } else {
                        $seleccionaTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                        $seleccionaTextClueGGame.show();
                    }
                }
                break;
            case 2:
                message = msgs.msgInformationLooking
                $seleccionaOverPoint.hide();
                $seleccionaOverHits.hide();
                $seleccionaOverErrors.hide();
                $seleccionaClueGGame.show();
                $seleccionaTextClueGGame.text(mOptions.itinerary.clueGame);
                $seleccionaTextClueGGame.show();
                break;
            default:
                break;
        }
        $('#seleccionaShowClue-' + instance).hide();
        $eXeSelecciona.showMessage(messageColor, message, instance);
        $seleccionaOverPoint.text(msgs.msgScore + ': ' + mOptions.score);
        $seleccionaOverHits.text(msgs.msgHits + ': ' + mOptions.hits);
        $seleccionaOverErrors.text(msgs.msgErrors + ': ' + mOptions.errors);
        $seleccionaGamerOver.show();
    },
    startGame: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (!$eXeSelecciona.youtubeLoaded) {
            $eXeSelecciona.showMessage(1, mOptions.msgs.msgLoadInterface, instance)
            return;
        }
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.scoreGame=0;
        mOptions.obtainedClue = false;
        $('#seleccionaVideoIntroContainer-' + instance).hide();
        $('#seleccionaLinkVideoIntroShow-' + instance).hide();
        $('#seleccionaShowClue-' + instance).hide();
        $('#seleccionaPShowClue-' + instance).text("");
        $('#seleccionaGameContainer-' + instance+' .selecciona-StartGame').hide();
        $('#seleccionaQuestionDiv-' + instance).show();
        $('#seleccionaQuestion-' + instance).text('');
        $('#seleccionaAnswerDiv-' + instance).show();
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
                        $eXeSelecciona.drawSolution(instance);
                    }
                    setTimeout(function () {
                        $eXeSelecciona.newQuestion(instance)
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
        $('seleccionaQuestion-' + instance).css('color', $eXeSelecciona.colors.black);
        mOptions.gameStarted = true;
        $eXeSelecciona.newQuestion(instance);
    },
    updateSoundVideo: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if(mOptions.activeSilent){
            if (mOptions.player && typeof mOptions.player.getCurrentTime === "function"){
                var time=Math.round(mOptions.player.getCurrentTime());
                if (time==mOptions.question.silentVideo){
                    mOptions.player.mute(instance);
                }else if (time==mOptions.endSilent){
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
        $('#seleccionaVideo-' + instance).hide();
        $eXeSelecciona.startVideo('', 0, 0, instance);
        $eXeSelecciona.stopVideo(instance)
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
        $('#seleccionaStarGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#seleccionaGameContainer-' + instance+' .selecciona-StartGame').show();
        $('#seleccionaQuestionDiv-' + instance).hide();
        $('#seleccionaAnswerDiv-' + instance).hide();
        if ($eXeSelecciona.getIDYoutube(mOptions.idVideo) !== '') {
            $('#seleccionaVideoIntroContainer-' + instance).css('display', 'flex');
            $('#seleccionaVideoIntroContainer-' + instance).show();
            $('#seleccionaLinkVideoIntroShow-' + instance).show();
        }
        mOptions.gameOver = true;
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeSelecciona.initialScore === '') {
                var score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
                $eXeSelecciona.sendScore(true, instance);
                $('#seleccionaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeSelecciona.initialScore = score;
            }
        }
    },
    drawText: function (texto, color) {},
    showQuestion: function (i,instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mQuextion = mOptions.selectsGame[i],
            q=mQuextion;
        $eXeSelecciona.clearQuestions(instance);
        mOptions.gameActived = true;
        mOptions.question = mQuextion
        mOptions.respuesta = '';
        var tiempo = $eXeSelecciona.getTimeToString($eXeSelecciona.getTimeSeconds(mQuextion.time)),
            author = '',
            alt = '';
        $('#seleccionaPTime-'+instance).text(tiempo);
        $('#seleccionaQuestion-'+instance).text(mQuextion.quextion);
        $('#seleccionaImagen-'+instance).hide();
        $('#seleccionaCover-'+instance).show();
        $('#seleccionaEText-'+instance).hide();
        $('#seleccionaVideo-'+instance).hide();
        $eXeSelecciona.startVideo('', 0, 0,instance);
        $eXeSelecciona.stopVideo(instance)
        $('#seleccionaCursor-'+instance).hide();
        $eXeSelecciona.showMessage(0, '', instance);
        if(mOptions.answersRamdon){
            $eXeSelecciona.ramdonOptions(instance);
        }
        mOptions.activeSilent=(q.type==2) &&(q.soundVideo==1)  && (q.tSilentVideo>0) && (q.silentVideo>=q.iVideo) && (q.iVideo<q.fVideo);
        var endSonido=parseInt(q.silentVideo)+parseInt(q.tSilentVideo);
        mOptions.endSilent=endSonido>q.fVideo?q.fVideo: endSonido;
        $('#seleccionaAuthor-'+instance).text('');
        if (mQuextion.type === 1) {
            $('#seleccionaImagen-'+instance).prop('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = $eXeSelecciona.msgs.msgNoImage;
                        $('#seleccionaAuthor-'+instance).text('');
                    } else {
                        var mData = $eXeSelecciona.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeSelecciona.drawImage(this, mData);
                        $('#seleccionaImagen-'+instance).show();
                        $('#seleccionaCover-'+instance).hide();
                        $('#seleccionaCursor-'+instance).hide();
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#seleccionaCursor-'+instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            author = mQuextion.author;
                            $('#seleccionaCursor-'+instance).show();
                        }
                    }
                    $eXeSelecciona.showMessage(0, author, instance);
                });
            $('#seleccionaImagen-'+instance).attr('alt', alt);
        } else if (mQuextion.type === 3) {
            var text = unescape(mQuextion.eText);
            if (window.innerWidth < 401) {
                //text = $eXeSelecciona.reduceText(text);
            }
            $('#seleccionaEText-'+instance).html(text);
            $('#seleccionaCover-'+instance).hide();
            $('#seleccionaEText-'+instance).show();
            $eXeSelecciona.showMessage(0, mQuextion.author, instance);

        } else if (mQuextion.type === 2) {
            $('#seleccionaVideo-'+instance).show();
            var idVideo = $eXeSelecciona.getIDYoutube(mQuextion.url);
            $eXeSelecciona.startVideo(idVideo, mQuextion.iVideo, mQuextion.fVideo, instance);
            $eXeSelecciona.showMessage(0, mQuextion.author, instance);
            if (mQuextion.imageVideo === 0) {
                $('#seleccionaVideo-'+instance).hide();
                $('#seleccionaCover-'+instance).show();

            } else {
                $('#seleccionaVideo-'+instance).show();
                $('#seleccionaCover-'+instance).hide();
            }
            if (mQuextion.soundVideo === 0) {
                $eXeSelecciona.muteVideo(true, instance);
            } else {
                $eXeSelecciona.muteVideo(false, instance);
            }
        }
        $eXeSelecciona.drawQuestions(instance);
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeSelecciona.initialScore === '') {
                var score = ((mOptions.scoreGame * 10) / mOptions.scoreTotal).toFixed(2);
                $eXeSelecciona.sendScore(true,instance);
                $('#seleccionaRepeatActivity-'+instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        mOptions.gameOver = true;
        if(typeof(MathJax)!="undefined"){
           MathJax.Hub.Queue(["Typeset", MathJax.Hub,'#seleccionaGameContainer-'+instance]);
        }

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
    },

    newQuestion: function (instance) {
        var mOptions = $eXeSelecciona.options[instance];
        if (mOptions.useLives && mOptions.livesLeft <= 0) {
            $eXeSelecciona.gameOver(1,instance);
            return;
        }
        var mActiveQuestion = $eXeSelecciona.updateNumberQuestion(mOptions.activeQuestion,instance);
        if (mActiveQuestion === -10) {
            $('seleccionaPNumber-' + instance).text('0');
            $eXeSelecciona.gameOver(0,instance);
            return;
        } else {
            mOptions.counter = $eXeSelecciona.getTimeSeconds(mOptions.selectsGame[mActiveQuestion].time);
            if(mOptions.selectsGame[mActiveQuestion].type===2){
                var durationVideo=mOptions.selectsGame[mActiveQuestion].fVideo -mOptions.selectsGame[mActiveQuestion].iVideo;
                mOptions.counter+=durationVideo;
            }
            $eXeSelecciona.showQuestion(mActiveQuestion,instance)
            mOptions.activeCounter = true;
            var numQ = mOptions.numberQuestions - mActiveQuestion;
            $('#seleccionaPNumber-' + instance).text(numQ);
        };
    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600]
        return times[iT];
    },
    updateNumberQuestion: function (numq, instance) {
        var mOptions = $eXeSelecciona.options[instance],
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10
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
        var mOptions = $eXeSelecciona.options[instance];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        var message = "",
            solution = mOptions.selectsGame[mOptions.activeQuestion].solution,
            answer = mOptions.respuesta.toUpperCase(),
            correct = true;
        if (mOptions.selectsGame[mOptions.activeQuestion].typeSelect === 1) {
            if (answer.length !== solution.length) {
                $eXeSelecciona.showMessage(1,mOptions.msgs.mgsOrders,instance);
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
        var obtainedPoints = 0
        type = 1;
        if (correct) {
            mOptions.hits++
            color = $eXeSelecciona.colors.green;
            obtainedPoints = 1000 + mOptions.counter * 10;
            if(mOptions.selectsGame[mOptions.activeQuestion].type===2){
                var realTime=$eXeSelecciona.getTimeSeconds(mOptions.selectsGame[mOptions.activeQuestion].time);
                realTime=mOptions.counter>realTime?realTime:mOptions.counter
                obtainedPoints =  (1000 + realTime * 10);

            }
            obtainedPoints=mOptions.selectsGame[mOptions.activeQuestion].customScore *obtainedPoints;
            mOptions.scoreGame+=mOptions.selectsGame[mOptions.activeQuestion].customScore;

            message = $eXeSelecciona.getRetroFeedMessages(true, instance) + ' ' + obtainedPoints + ' '+mOptions.msgs.mgsPoints;            type = 2;
        } else {
            mOptions.errors++;
            if (mOptions.useLives) {
                mOptions.livesLeft--;
                $eXeSelecciona.updateLives(instance);
                message = $eXeSelecciona.getRetroFeedMessages(false, instance)+ ' ' +mOptions.msgs.msgLoseLive;            
            } else {
                obtainedPoints = -330 * mOptions.selectsGame[mOptions.activeQuestion].customScore ;
                message = $eXeSelecciona.getRetroFeedMessages(false, instance)  + ' ' +mOptions.msgs.msgLoseT;
            }
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        $('#seleccionaPScore-' + instance).text(mOptions.score);
        var timeShowSolution = 1000;
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            $eXeSelecciona.drawSolution(instance);
        }
        var percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        $('#seleccionaPHits-' + instance).text(mOptions.hits);
        $('#seleccionaPErrors-' + instance).text(mOptions.errors);
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                timeShowSolution = 5000;
                message += " "+mOptions.msgs.msgUseFulInformation;
                $('#seleccionaShowClue-' + instance).show();
                $('#seleccionaPShowClue-' + instance).text(mOptions.msgs.msgInformation+": " + mOptions.itinerary.clueGame);                mOptions.obtainedClue = true;
            }
        }
        $eXeSelecciona.showMessage(type, message,instance);
        setTimeout(function () {
            $eXeSelecciona.newQuestion(instance)
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
        return rText;
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.yellow];
        color = colors[type];
        var weight = type == 0 ? 'normal' : 'bold';
        $('#seleccionaPAuthor-' + instance).text(message);
        $('#seleccionaPAuthor-' + instance).css({
            'color': color,
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
        var respuestasNuevas=[];
        var respuestaCorrectas=[];
        for (var i = 0; i < soluciones.length; i++) {
            var sol = soluciones.charCodeAt(i) - 65;
            respuestaCorrectas.push(respuestas[sol]);
        }
        var respuestasNuevas = mOptions.question.options.slice(0, l)
        respuestasNuevas = $eXeSelecciona.shuffleAds(respuestasNuevas);
        var solucionesNuevas ="";
        for (var j = 0; j < respuestasNuevas.length; j++) {
            for (var z = 0; z < respuestaCorrectas.length; z++) {
                if (respuestasNuevas[j] == respuestaCorrectas[z]) {
                    solucionesNuevas=solucionesNuevas.concat(letras[j]);
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
        mOptions.question.solution=solucionesNuevas;
    },
    drawQuestions: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            colors = [$eXeSelecciona.colors.red, $eXeSelecciona.colors.blue, $eXeSelecciona.colors.green, $eXeSelecciona.colors.yellow],
            bordeColors = [$eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.yellow];
        $('#seleccionaOptionsDiv-' + instance + '>.selecciona-Options').each(function (index) {
            var option = mOptions.question.options[index]
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': colors[index],
                'cursor': 'pointer',
                'color': $eXeSelecciona.colors.black
            }).text(option);
              if (option) {
                $(this).show();
            } else {
                $(this).hide()
            }
        });
    },
    drawSolution: function (instance) {
        var mOptions = $eXeSelecciona.options[instance],
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            colors = [$eXeSelecciona.colors.red, $eXeSelecciona.colors.blue, $eXeSelecciona.colors.green, $eXeSelecciona.colors.yellow],
            bordeColors = [$eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.yellow],
            solution = mQuextion.solution,
            letters = 'ABCD';
            mOptions.gameActived = false;
        $('#seleccionaOptionsDiv-' + instance).find('.selecciona-Options').each(function (i) {
            var css = {};
            if (mQuextion.typeSelect === 1) {
                css = {
                    'border-color': '#00ff00',
                    'background-color': '#dcffdc',
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
                    'border-color': '#777777',
                    'border-size': '1',
                    'background-color': 'transparent',
                    'cursor': 'pointer',
                    'color': '#777777'
                };
                if (solution.indexOf(letters[i]) !== -1) {
                    css = {
                        'border-color': '#00ff00',
                        'background-color': '#dcffdc',
                        'border-size': '2',
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
        $('#seleccionaAnswers-' + instance + '> .selecciona-AnswersOptions').remove();
        var colors = [$eXeSelecciona.colors.red, $eXeSelecciona.colors.blue, $eXeSelecciona.colors.green, $eXeSelecciona.colors.yellow];
        var bordeColors = [$eXeSelecciona.borderColors.red, $eXeSelecciona.borderColors.blue, $eXeSelecciona.borderColors.green, $eXeSelecciona.borderColors.yellow];
        $('#seleccionaOptionsDiv-' + instance + '>.selecciona-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': colors[index],
                'cursor': 'default'
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
	}
}
$(function () {
    $eXeSelecciona.init();
});
