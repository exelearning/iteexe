/**
 * Sopa activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeSopa = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#3a518b',
        green: '#036354',
        red: '#660101',
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
    hits: 0,
    score: 0,
    options: {},
    hasSCORMbutton: false,
    isInExe: false,
    userName: '',
    previousScore: '',
    initialScore: '',
    hasLATEX: false,
    game: null,
    optionsPuzzle: {},
    init: function () {
        this.activities = $('.sopa-IDevice');
        if (this.activities.length == 0) return;

        if (!$eXeSopa.supportedBrowser('sopa')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Word Guessing') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/sopa-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeSopa.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeSopa.enable()');
        else this.enable();
        $eXeSopa.mScorm = scorm;
        var callSucceeded = $eXeSopa.mScorm.init();
        if (callSucceeded) {
            $eXeSopa.userName = $eXeSopa.getUserName();
            $eXeSopa.previousScore = $eXeSopa.getPreviousScore();
            $eXeSopa.mScorm.set("cmi.core.score.max", 10);
            $eXeSopa.mScorm.set("cmi.core.score.min", 0);
            $eXeSopa.initialScore = $eXeSopa.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity) {
        var mOptions = $eXeSopa.options,
            text = '';
        $('#sopaSendScore').hide();
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
            $('#sopaSendScore').show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#sopaSendScore').hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#sopaRepeatActivity').text(text);
        $('#sopaRepeatActivity').fadeIn(1000);
    },
    getUserName: function () {
        var user = $eXeSopa.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeSopa.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeSopa.mScorm.quit();
    },
    enable: function () {
        $eXeSopa.loadGame();
    },
    loadGame: function () {
        $eXeSopa.options = {};
        $eXeSopa.activities.each(function (i) {
            if (i == 0) {
                var version = $(".sopa-version", this).eq(0).text(),
                    dl = $(".sopa-DataGame", this),
                    imagesLink = $('.sopa-LinkImages', this),
                    audioLink = $('.sopa-LinkAudios', this),
                    mOption = $eXeSopa.loadDataGame(dl, imagesLink, audioLink, version),
                    msg = mOption.msgs.msgPlayStart;

                $eXeSopa.options = mOption;
                var sopa = $eXeSopa.createInterfaceSopa(i);
                dl.before(sopa).remove();
                $('#sopaGameMinimize').hide();
                $('#sopaGameContainer').hide();
                if (mOption.showMinimize) {
                    $('#sopaGameMinimize').css({
                        'cursor': 'pointer'
                    }).show();
                } else {
                    $('#sopaGameContainer').show();
                }
                $('#sopaMessageMaximize').text(msg);
                $('#sopaDivFeedBack').prepend($('.sopa-feedback-game', this));
                $eXeSopa.addEvents();
                $('#sopaDivFeedBack').hide();

            } else {
                alert('Only one Word Search game per page.')
            }


        });
        for (var i = 0; i < $eXeSopa.options.wordsGame.length; i++) {
            var word = $eXeSopa.options.wordsGame[i].word,
                definition = $eXeSopa.options.wordsGame[i].definition,
                image = $eXeSopa.options.wordsGame[i].url.length > 4,
                audio = $eXeSopa.options.wordsGame[i].audio.length > 4;
            WordFindGame.append($('#sopaWords'), word, definition, i, image, audio);
        }
        $eXeSopa.recreatePuzzle()
        if ($eXeSopa.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeSopa.loadMathJax();
        }
    },
    recreatePuzzle: function () {
        try {
            $eXeSopa.game = new WordFindGame('#sopaPuzzle', {
                maxGridGrowth: 6,
                maxAttempts: 100,
                orientations: $eXeSopa.optionsPuzzle
            });
        } catch (error) {
            $('#sopaMessage').text(`😞 ${error}, Intenta con menos palabras`).css({
                color: 'red'
            });
            return;
        }
        if (window.game) {
            var emptySquaresCount = WordFindGame.emptySquaresCount();
            $('#sopaMessage').text(`😃 ${emptySquaresCount ? 'pero hay casillas vacías' : ''}`).css({
                color: ''
            });
        }
        window.game = $eXeSopa.game;
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
    loadDataGame: function (data, imgsLink, audioLink, version) {
        var json = data.text();
        version = typeof version == "undefined" || version == '' ? 0 : parseInt(version);
        if (version > 0) {
            json = $eXeSopa.Decrypt(json);
        }
        var mOptions = $eXeSopa.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeSopa.hasLATEX = true;
        }
        mOptions.percentajeQuestions = typeof mOptions.percentajeQuestions != 'undefined' ? mOptions.percentajeQuestions : 100;
        for (var i = 0; i < mOptions.wordsGame.length; i++) {
            var p = mOptions.wordsGame[i];
            p.url = $eXeSopa.extractURLGD(p.url);
        }
        mOptions.playerAudio = "";
        mOptions.percentajeFB = typeof mOptions.percentajeFB != 'undefined' ? mOptions.percentajeFB : 100;
        mOptions.gameOver = false;
        mOptions.obtainedClue = false;
        imgsLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                mOptions.wordsGame[iq].url = $(this).attr('href');
                if (mOptions.wordsGame[iq].url.length < 4) {
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
        mOptions.wordsGame = $eXeSopa.getQuestions(mOptions.wordsGame, mOptions.percentajeQuestions);
        mOptions.numberQuestions = mOptions.wordsGame.length;
        $eXeSopa.optionsPuzzle = {};
        var ors = ['horizontal', 'vertical'];
        if (mOptions.reverses && mOptions.diagonals) {
            ors = ['horizontal', 'vertical', 'horizontalBack', 'verticalUp', 'diagonal', 'diagonalUp', 'diagonalBack', 'diagonalUpBack'];
        } else if (mOptions.diagonals) {
            ors = ['horizontal', 'vertical', 'diagonal', 'diagonalUp']
        } else if (mOptions.reverses) {
            ors = ['horizontal', 'vertical', 'horizontalBack', 'verticalUp']
        }
        $eXeSopa.optionsPuzzle.orientations = ors;
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
                array = $eXeSopa.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
    playSound: function (selectedFile) {
        $eXeSopa.stopSound();
        var mOptions = $eXeSopa.options;
        selectedFile = $eXeSopa.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile); 
        mOptions.playerAudio.autoplay = true;
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });
    },
    stopSound: function () {
        var mOptions = $eXeSopa.options;
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
    createInterfaceSopa: function () {
        var html = '',
            path = $eXeSopa.idevicePath,
            msgs = $eXeSopa.options.msgs,
            html = '';
        html += '<div class="SPP-MainContainer">\
        <div class="SPP-GameMinimize" id="sopaGameMinimize">\
            <a href="#" class="SPP-LinkMaximize" id="sopaLinkMaximize" title="' + msgs.msgMaximize + '"><img src="' + path + "sopaIcon.svg" + '" class="SPP-IconMinimize SPP-Activo"  alt="">\
            <div class="SPP-MessageMaximize" id="sopaMessageMaximize"></div></a>\
        </div>\
        <div class="SPP-GameContainer" id="sopaGameContainer">\
            <div class="SPP-GameScoreBoard">\
                <div class="SPP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="sopaPNumber">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="sopaPHits">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="sopaPScore">0</span></p>\
                </div>\
                <div class="SPP-LifesGame" id="sopaLifesSopa">\
                </div>\
                <div class="SPP-TimeNumber">\
                    <strong sopaPTimeTitle><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
                    <div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
                    <p  id="sopaPTime" class="SPP-PTime">00:00</p>\
                     <a href="#" class="SPP-LinkMinimize" id="sopaLinkMinimize" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  SPP-Activo"></div>\
                    </a>\
                    <a href="#" class="SPP-LinkFullScreen" id="sopaLinkFullScreen" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  SPP-Activo" id="sopaFullScreen"></div>\
					</a>\
				</div>\
            </div>\
            <div class="SPP-ShowClue">\
                <div class="sr-av">' + msgs.msgClue + '</div>\
                <p class="SPP-PShowClue SPP-parpadea" id="sopaPShowClue"></p>\
           </div>\
           <div class="SPP-Flex" id="sopaDivImgHome">\
                <img src="' + path + "sopaIcon.svg" + '" class="SPP-ImagesHome" id="sopaPHome"  alt="' + msgs.msgNoImage + '" />\
           </div>\
           <div class="SPP-StartGame"><a href="#" id="sopaStartGame">' + msgs.msgPlayStart + '</a></div>\
           <div class="SPP-Message" id="sopaMessage"></div>\
           <div class="SPP-Multimedia" id="sopaMultimedia">\
                <div id="sopaPuzzle" class="SPP-Puzzle"></div>\
                <ul id="sopaWords"  class="SPP-Words"></ul>\
            </div>\
            <button id="sopaResolve">' + msgs.msgEnd + '</button>\
            <div class="SPP-Cubierta" id="sopaCubierta">\
                 <div class="SPP-CodeAccessDiv" id="sopaCodeAccessDiv">\
                    <div class="SPP-MessageCodeAccessE" id="sopaMesajeAccesCodeE"></div>\
                    <div class="SPP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="SPP-CodeAccessE" id="sopaCodeAccessE">\
                        <a href="#" id="sopaCodeAccessButton" title="' + msgs.msgReply + '">\
                        <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Submit SPP-Activo"></div>\
                        </a>\
                    </div>\
                    </div>\
                <div class="SPP-DivFeedBack" id="sopaDivFeedBack">\
                    <input type="button" id="sopaFeedBackClose" value="' + msgs.msgClose + '" class="feedbackbutton" />\
                </div>\
                ' + this.getDetailMedia() + '\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore();
        return html;
    },
    showCubiertaOptions(mode) {
        if(mode===false){
            $('#sopaCubierta').fadeOut();
            return;
        }
        $('#sopaCodeAccessDiv').hide();
        $('#sopaDivFeedBack').hide();
        $('#sopaMFDetails').hide();
        switch (mode) {
            case 0:
                $('#sopaCodeAccessDiv').show();
                break;
            case 1:
                $('#sopaDivFeedBack').find('.sopa-feedback-game').show();
                $('#sopaDivFeedBack').show();
                break;
            case 2:
                $('#sopaMFDetails').show();
                break;
            default:
                
                break;
        }
        $('#sopaCubierta').fadeIn(); 
    },
    getDetailMedia: function () {
        var html = '',
            msgs = $eXeSopa.options.msgs;
        html = '<div class="SPP-Detail" id="sopaMFDetails">\
                    <div class="SPP-Flex">\
                        <a href="#" class="SPP-LinkClose" id="sopaMLinkClose1" title="' + msgs.msgClose + '">\
                            <strong class="sr-av">' + msgs.msgClose + ':</strong>\
                            <div class="SPP-IconsToolBar exeQuextIcons-CWGame SPP-Activo"></div>\
                        </a>\
                    </div>\
                    <div class="SPP-MultimediaPoint" id="sopaMMultimediaPoint">\
                        <img src="" class="SPP-Images" id="sopaMImagePoint"  alt="' + msgs.msgNoImage + '" />\
                    </div>\
                    <div class="SPP-AuthorPoint" id="sopaMAuthorPoint"></div>\
                    <div class="SPP-Footer" id="sopaMFooterPoint"></div>\
                </div>';
        return html;
    },
    startGame: function () {
        var mOptions = $eXeSopa.options;
        if (mOptions.gameStarted) {
            return;
        };
        if(mOptions.showResolve){
            $('#sopaResolve').show();
        }
        $('#sopaMessage').fadeIn();
        $('#sopaMultimedia').fadeIn();
        $('#sopaDivImgHome').hide();
        $('#sopaPHits').text(mOptions.hits);
        $('#sopaPScore').text(mOptions.score);
        $('#sopaStartGame').hide();
        $eXeSopa.hits = 0;
        $eXeSopa.score = 0;
        mOptions.counter = 0;
        mOptions.gameOver = false;
        mOptions.obtainedClue = false;
        mOptions.counter = mOptions.time * 60;
        mOptions.activeCounter = true;
        mOptions.gameStarted = true
        $eXeSopa.uptateTime(mOptions.counter);
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeSopa.uptateTime(mOptions.counter);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    $eXeSopa.game.solve();
                    $eXeSopa.gameOver(2);
                }
            }

        }, 1000);
    },
    uptateTime: function (tiempo) {
        var mTime = $eXeSopa.getTimeToString(tiempo);
        $('#sopaPTime').text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    showMessage: function (type, message) {
        var colors = ['#555555', $eXeSopa.borderColors.red, $eXeSopa.borderColors.green, $eXeSopa.borderColors.blue, $eXeSopa.borderColors.yellow],
            mcolor = colors[type];
        $('#sopaMessage').text(message);
        $('#sopaMessage').css({
            'color': mcolor,
        });
    },
    showPoint: function (num) {
        var mOptions = $eXeSopa.options,
            q = mOptions.wordsGame[num],
            w = 0,
            t = 0;
        $('#sopaMFDetails').show();
        $('#sopaMAuthorPoint').html(q.author);
        $('#sopaMFooterPoint').text(q.definition);
        if (q.definition.length > 0) {
            $('#sopaMFooterPoint').show();
        }
        $eXeSopa.showImagePoint(q.url, q.author, q.alt);

        if (q.author.length > 0) {
            $('#sopaMAuthorPoint').show();
        }
        var html = $('#sopaFDetails').html(),
            latex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeSopa.updateLatex('sopaFDetails');
        }
        $eXeSopa.showCubiertaOptions(2)
    },
    showImagePoint: function (url, author, alt) {
        var $Image = $('#sopaMImagePoint'),
            $Author = $('#sopaMAuthorPoint');
        $Author.html(author);
        $Image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $Image.hide();
                    $Image.attr('alt', $eXeSopa.options.msgs.msgNoImage);
                    $noImage.show();
                    return false;
                } else {
                    var mData = $eXeSopa.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeSopa.drawImage(this, mData);
                    $Image.show();
                    $Image.attr('alt', alt);
                    return true;
                }
            }).on('error', function () {
                $Image.hide();
                $Image.attr('alt', $eXeSopa.options.msgs.msgNoImage);
                return false;
            });

        $('#sopaMMultimediaPoint').show();
    },
    isFullScreen: function () {
        var isFull = !(!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement);
        return isFull;
    },
    addButtonScore: function () {
        var mOptions = $eXeSopa.options;
        var butonScore = "";
        var fB = '<div class="SPP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="SPP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="sopaSendScore" value="' + buttonText + '" class="feedbackbutton" /> <span class="SPP-RepeatActivity" id="sopaRepeatActivity"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="SPP-GetScore">';
                fB += '<p><span class="SPP-RepeatActivity" id="sopaRepeatActivity"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    sendScore: function (auto) {
        var mOptions = $eXeSopa.options,
            message = '',
            score = (($eXeSopa.hits * 10) / mOptions.wordsGame.length).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeSopa.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.repeatActivity && $eXeSopa.previousScore !== '') {
                        message = $eXeSopa.userName !== '' ? $eXeSopa.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeSopa.previousScore = score;
                        $eXeSopa.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeSopa.userName !== '' ? $eXeSopa.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#sopaSendScore').hide();
                        }
                        $('#sopaRepeatActivity').text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#sopaRepeatActivity').show();
                    }
                } else {
                    $eXeSopa.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeSopa.mScorm.set("cmi.core.score.raw", score);
                    $('#sopaRepeatActivity').text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#sopaRepeatActivity').show();
                    message = "";
                }
            } else {
                message = mOptions.msgs.msgScoreScorm;
            }

        } else {
            message= mOptions.msgs.msgEndGameScore;
        }
        if (!auto) alert(message);
    },
    clear: function (phrase) {
        return phrase.replace(/[&\s\n\r]+/g, " ").trim();
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
    toggleFullscreen: function (element) {
        var element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $eXeSopa.getFullscreen(element);
        } else {
            $eXeSopa.exitFullscreen(element);
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
    addEvents: function () {
        var mOptions = $eXeSopa.options;
        $('#sopaLinkMaximize').on('click touchstart', function (e) {
            e.preventDefault();
            $("#sopaGameContainer").show()
            $("#sopaGameMinimize").hide();
        });
        $("#sopaLinkMinimize").on('click touchstart', function (e) {
            e.preventDefault();
            $("#sopaGameContainer").hide();
            $("#sopaGameMinimize").css('visibility', 'visible').show();
        });

        $('#sopaGamerOver').hide();
        document.onfullscreenchange = function (event) {
            var id = event.target.id.split('-')[1];
            $eXeSopa.refreshImageActive(id)
        };
        $("#sopaLinkFullScreen").on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('sopaGameContainer');
            $eXeSopa.toggleFullscreen(element)
        });
        $('#sopaFeedBackClose').on('click', function (e) {
            $eXeSopa.showCubiertaOptions(false)
        });
        $('#sopaLinkAudio').on('click', function (e) {
            e.preventDefault();
            var audio = mOptions.wordsGame[mOptions.activeQuestion].audio;
            $eXeSopa.stopSound();
            $eXeSopa.playSound(audio);
        });
        $('#sopaMShowClue').hide();
        if (mOptions.itinerary.showCodeAccess) {
            $('#sopaMesajeAccesCodeE').text(mOptions.itinerary.messageCodeAccess);
            $($eXeSopa.showCubiertaOptions(0))

        }
        $('#sopaCodeAccessButton').on('click touchstart', function (e) {
            e.preventDefault();
            $eXeSopa.enterCodeAccess();
        });
        $('#sopaCodeAccessE').on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeSopa.enterCodeAccess();
                return false;
            }
            return true;
        });
        $('#sopaPNumber').text(mOptions.numberQuestions);
        $(window).on('unload', function () {
            if (typeof ($eXeSopa.mScorm) != "undefined") {
                $eXeSopa.endScorm();
            }
        });
        if (mOptions.isScorm > 0) {
            $eXeSopa.updateScorm($eXeSopa.previousScore, mOptions.repeatActivity);
        }
        $('#sopaInstructions').text(mOptions.instructions);
        $('#sopaSendScore').click(function (e) {
            e.preventDefault();
            $eXeSopa.sendScore(false);
        });
        window.addEventListener('resize', function () {
            $eXeSopa.refreshImageActive();
        });


        $('#sopaResolve').on('click', function (e) {
            e.preventDefault();
            $eXeSopa.game.solve();
            $eXeSopa.gameOver(1);
        });
        $('#sopaWords').on('click', '.SPP-LinkSound', function (e) {
            e.preventDefault();
            var num = $(this).data('mnumber'),
                sound = mOptions.wordsGame[num].audio;
            $eXeSopa.playSound(sound);
        });
        $('#sopaWords').on('click', '.SPP-LinkImage', function (e) {
            e.preventDefault();
            var num = $(this).data('mnumber');
            $eXeSopa.showPoint(num)
        });
        $('#sopaMLinkClose1').on('click', function (e) {
            e.preventDefault();
            $eXeSopa.showCubiertaOptions(false)
        });
        $eXeSopa.showMessage(3, mOptions.msgs.mgsGameStart);
        $('#sopaStartGame').on('click', function (e) {
            e.preventDefault();
            $eXeSopa.startGame();
        });
        $('#sopaShowClue').html(mOptions.itinerary.clueGame);
        $('#sopaPTimeTitle').hide();
        $('.exeQuextIcons-Time').hide();
        $('#sopaPTime').hide();
        $('#sopaStartGame').hide();
        $('#sopaDivImgHome').hide();
        if(mOptions.showResolve){
            $('#sopaResolve').show();
        }
        mOptions.gameStarted=true;
        if (mOptions.time > 0) {
            mOptions.gameStarted=false;
            $('#sopaDivImgHome').show();
            $('#sopaResolve').hide();
            $('#sopaMessage').hide();
            $('#sopaMultimedia').hide();
            $('#sopaPTimeTitle').show();
            $('.exeQuextIcons-Time').show();
            $('#sopaPTime').show();
            $('#sopaStartGame').show();
        }
        $('#sopaPShowClue').text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
        $('#sopaPShowClue').hide();
        

    },

    refreshImageActive: function () {
        var mOptions = $eXeSopa.options;
        if (mOptions.gameOver) {
            return;
        }
        if (mOptions.gameStarted) {
            var q = mOptions.wordsGame[mOptions.activeQuestion];
            $eXeSopa.showImagePoint(q.url, q.x, q.y, q.author, q.alt);
        }
    },
    enterCodeAccess: function () {
        var mOptions = $eXeSopa.options;
        if (mOptions.itinerary.codeAccess == $('#sopaCodeAccessE').val()) {
            $eXeSopa.showCubiertaOptions(false)

        } else {
            $('#sopaMesajeAccesCodeE').fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#sopaCodeAccessE').val('');
        }
    },

    gameOver: function (mode) {
        var mOptions = $eXeSopa.options;
        mOptions.gameStarted = false;
        mOptions.gameOver = true;
        $eXeSopa.stopSound();
        clearInterval(mOptions.counterClock);
        mOptions.activeCounter = false;
        var score = (($eXeSopa.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeSopa.initialScore === '') {
                $eXeSopa.sendScore(true);
                $('#sopaRepeatActivity').text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeSopa.initialScore = score;
            }
        }
        if (mOptions.itinerary.showClue) {
            var text = $('#sopaPShowClue').text();
            if (mOptions.obtainedClue) {
                mclue = text;
            } else {
                mclue = mOptions.msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
            }
            $('#sopaPShowClue').text(mclue);
            $('#sopaPShowClue').show();
        }
        var message = $eXeSopa.getRetroFeedMessages(true) + ' ' + mOptions.msgs.msgWordsFind.replace('%s',score);

        if (mode == 1) {
            message = mOptions.msgs.msgEndGameM.replace('%s', score);
        } else if (mode == 2) {
            message = mOptions.msgs.msgEndTime.replace('%s', score);
        }
        type = (($eXeSopa.hits * 10) / mOptions.numberQuestions) >= 5 ? 2 : 1;
        $eXeSopa.showMessage(type, message)
        $eXeSopa.showFeedBack();
    },
    showFeedBack: function () {
        var mOptions = $eXeSopa.options;
        var puntos = $eXeSopa.hits * 100 / mOptions.wordsGame.length;
        if (mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $eXeSopa.showCubiertaOptions(1)
            } else {
                $eXeSopa.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB));
            }
        }
    },

    showScoreGame: function () {
        var mOptions = $eXeSopa.options,
            msgs = mOptions.msgs,
            $sopaHistGame = $('#sopaHistGame'),
            $sopaLostGame = $('#sopaLostGame'),
            $sopaOverPoint = $('#sopaOverScore'),
            $sopaOverHits = $('#sopaOverHits'),
            $sopaGamerOver = $('#sopaGamerOver'),
            message = "",
            messageColor = 1;
        $sopaHistGame.hide();
        $sopaLostGame.hide();
        $sopaOverPoint.show();
        $sopaOverHits.show();
        var mclue = '';
        message = $eXeSopa.getRetroFeedMessages(true) + ' ' + msgs.msgWordsFind.replace('%s',$eXeSopa.score.toFixed(2));
        messageColor = 2;
        $sopaHistGame.show();
        $eXeSopa.showMessage(messageColor, message);
        var msscore = '<strong>' + msgs.msgScore + ':</strong> ' + $eXeSopa.score.toFixed(2);
        $sopaOverPoint.html(msscore);
        $sopaOverHits.html('<strong>' + msgs.msgHits + ':</strong> ' + $eXeSopa.hits);
        $sopaGamerOver.show();
    },

    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
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
    updateScore: function (num, mCurWord, number) {
        var mOptions = $eXeSopa.options,
            message = "",
            obtainedPoints = 0,
            sscore = 0,
            points = 0;
        if (mOptions.gameOver) {
            return
        }
        $eXeSopa.hits = num + 1;
        obtainedPoints = (10 / mOptions.wordsGame.length);
        points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
        type = 2;
        $eXeSopa.score = ($eXeSopa.score + obtainedPoints > 0) ? $eXeSopa.score + obtainedPoints : 0;
        sscore = $eXeSopa.score;
        sscore = $eXeSopa.score % 1 == 0 ? $eXeSopa.score : $eXeSopa.score.toFixed(2);
        $('#sopaPScore').text(sscore);
        $('#sopaPHits').text($eXeSopa.hits);
        $('input.SSP-Word[value="' + mCurWord + '"]').siblings('span').css('color', '#de1111')
        $('input.SSP-Word[value="' + mCurWord + '"]').addClass('SPP-WordFound');
        message = $eXeSopa.getMessageAnswer(true, points);

        $eXeSopa.showMessage(2, message);
        if (mOptions.wordsGame[number].audio.length > 4) {
            $eXeSopa.playSound(mOptions.wordsGame[number].audio)
        }
        var percentageHits = ($eXeSopa.hits /mOptions.wordsGame.length) * 100;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                $('#sopaPShowClue').show();
            }
        }
        var score = (percentageHits/10).toFixed(2); 
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeSopa.initialScore === '') {
                $eXeSopa.sendScore(true);
                $('#sopaRepeatActivity').text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeSopa.initialScore = score;
            }
            $('#sopaRepeatActivity').text(mOptions.msgs.msgYouScore + ': ' + score);
        }
    },
    getRetroFeedMessages: function (iHit) {
        var mOptions = $eXeSopa.options,
            sMessages = iHit ? mOptions.msgs.msgSuccesses : mOptions.msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    getMessageAnswer: function (correctAnswer, npts) {
        var mOptions = $eXeSopa.options;
        var message = "",
            q = mOptions.wordsGame[mOptions.activeQuestion];
        if (correctAnswer) {
            message = $eXeSopa.getMessageCorrectAnswer(npts);
        } else {
            message = $eXeSopa.getMessageErrorAnswer(npts);
        }
        return message;
    },
    getMessageCorrectAnswer: function (npts) {
        var mOptions = $eXeSopa.options,
            messageCorrect = $eXeSopa.getRetroFeedMessages(true),
            message = messageCorrect + ' ' + npts + ' ' + mOptions.msgs.msgPoints;
        return message;
    },
    getMessageErrorAnswer: function (npts) {
        return $eXeSopa.getRetroFeedMessages(false);
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
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }
}
$(function () {

    $eXeSopa.init();
});

/**
 * Wordfind.js 0.0.1
 * (c) 2012 Bill, BunKat LLC.
 * Wordfind is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/wordfind
 */
(function(){"use strict";("undefined"!=typeof exports&&null!==exports?exports:window).wordfind=function(){let t="abcdefghijklmnoprstuvwy";var n=["horizontal","horizontalBack","vertical","verticalUp","diagonal","diagonalUp","diagonalBack","diagonalUpBack"],r={horizontal:function(t,n,r){return{x:t+r,y:n}},horizontalBack:function(t,n,r){return{x:t-r,y:n}},vertical:function(t,n,r){return{x:t,y:n+r}},verticalUp:function(t,n,r){return{x:t,y:n-r}},diagonal:function(t,n,r){return{x:t+r,y:n+r}},diagonalBack:function(t,n,r){return{x:t-r,y:n+r}},diagonalUp:function(t,n,r){return{x:t+r,y:n-r}},diagonalUpBack:function(t,n,r){return{x:t-r,y:n-r}}},e={horizontal:function(t,n,r,e,o){return e>=t+o},horizontalBack:function(t,n,r,e,o){return t+1>=o},vertical:function(t,n,r,e,o){return r>=n+o},verticalUp:function(t,n,r,e,o){return n+1>=o},diagonal:function(t,n,r,e,o){return e>=t+o&&r>=n+o},diagonalBack:function(t,n,r,e,o){return t+1>=o&&r>=n+o},diagonalUp:function(t,n,r,e,o){return e>=t+o&&n+1>=o},diagonalUpBack:function(t,n,r,e,o){return t+1>=o&&n+1>=o}},o={horizontal:function(t,n,r){return{x:0,y:n+1}},horizontalBack:function(t,n,r){return{x:r-1,y:n}},vertical:function(t,n,r){return{x:0,y:n+100}},verticalUp:function(t,n,r){return{x:0,y:r-1}},diagonal:function(t,n,r){return{x:0,y:n+1}},diagonalBack:function(t,n,r){return{x:r-1,y:t>=r-1?n+1:n}},diagonalUp:function(t,n,r){return{x:0,y:n<r-1?r-1:n+1}},diagonalUpBack:function(t,n,r){return{x:r-1,y:t>=r-1?n+1:n}}},a=function(t,n){var r,e,o,a=[];for(r=0;r<n.height;r++)for(a.push([]),e=0;e<n.width;e++)a[r].push("");for(r=0,o=t.length;r<o;r++)if(!i(a,n,t[r]))return null;return a},i=function(t,n,e){var o=l(t,n,e);if(0===o.length)return!1;var a=o[Math.floor(Math.random()*o.length)];return f(t,e,a.x,a.y,r[a.orientation]),!0},l=function(t,n,a){for(var i=[],l=n.height,f=n.width,d=a.length,c=0,h=0,v=n.orientations.length;h<v;h++)for(var g=n.orientations[h],p=e[g],$=r[g],P=o[g],S=0,x=0;x<l;)if(p(S,x,l,f,d)){var w=u(a,t,S,x,$);(w>=c||!n.preferOverlap&&w>-1)&&(c=w,i.push({x:S,y:x,orientation:g,overlap:w})),++S>=f&&(S=0,x++)}else{var z=P(S,x,d);S=z.x,x=z.y}return n.preferOverlap?s(i,c):i},u=function(t,n,r,e,o){for(var a=0,i=0,l=t.length;i<l;i++){var u=o(r,e,i),s=n[u.y][u.x];if(s===t[i])a++;else if(""!==s)return -1}return a},s=function(t,n){for(var r=[],e=0,o=t.length;e<o;e++)t[e].overlap>=n&&r.push(t[e]);return r},f=function(t,n,r,e,o){for(var a=0,i=n.length;a<i;a++){var l=o(r,e,a);t[l.y][l.x]=n[a]}};return{validOrientations:n,orientations:r,newPuzzle:function(r,e){if(!r.length)throw Error("Zero words provided");for(var o,i,l=0,u=0,s=e||{},f=(o=r.slice(0).sort())[0].length,d={height:s.height||f,width:s.width||f,orientations:s.orientations||n,fillBlanks:void 0===s.fillBlanks||s.fillBlanks,allowExtraBlanks:void 0===s.allowExtraBlanks||s.allowExtraBlanks,maxAttempts:s.maxAttempts||3,maxGridGrowth:void 0!==s.maxGridGrowth?s.maxGridGrowth:10,preferOverlap:void 0===s.preferOverlap||s.preferOverlap};!i;){for(;!i&&l++<d.maxAttempts;)i=a(o,d);if(!i){if(++u>d.maxGridGrowth)throw Error(`No valid ${d.width}x${d.height} grid found and not allowed to grow more`);console.log(`No valid ${d.width}x${d.height} grid found after ${l-1} attempts, trying with bigger grid`),d.height++,d.width++,l=0}}if(d.fillBlanks){var c,h,v=0;"function"==typeof d.fillBlanks?h=d.fillBlanks:"string"==typeof d.fillBlanks?(c=d.fillBlanks.toLowerCase().split(""),h=()=>c.pop()||v++&&""):h=()=>t[Math.floor(Math.random()*t.length)];var g=this.fillBlanks({puzzle:i,extraLetterGenerator:h});if(c&&c.length)throw Error(`Some extra letters provided were not used: ${c}`);if(c&&v&&!d.allowExtraBlanks)throw Error(`${v} extra letters were missing to fill the grid`);var p=100*(1-g/(d.width*d.height));console.log(`Blanks filled with ${g} random letters - Final grid is filled at ${p.toFixed(0)}%`)}return i},newPuzzleLax:function(t,n){try{return this.newPuzzle(t,n)}catch(r){if(!n.allowedMissingWords)throw r;var n=Object.assign({},n);n.allowedMissingWords--;for(var e=0;e<t.length;e++){var o=t.slice(0);o.splice(e,1);try{return this.newPuzzleLax(o,n)}catch(a){}}throw r}},fillBlanks:function({puzzle:t,extraLetterGenerator:n}){for(var r=0,e=0,o=t.length;e<o;e++)for(var a=t[e],i=0,l=a.length;i<l;i++)!t[e][i]&&(t[e][i]=n(),r++);return r},solve:function(t,r){for(var e={height:t.length,width:t[0].length,orientations:n,preferOverlap:!0},o=[],a=[],i=0,u=r.length;i<u;i++){var s=r[i],f=l(t,e,s);f.length>0&&f[0].overlap===s.length?(f[0].word=s,o.push(f[0])):a.push(s)}return{found:o,notFound:a}},print:function(t){for(var n="",r=0,e=t.length;r<e;r++){for(var o=t[r],a=0,i=o.length;a<i;a++)n+=(""===o[a]?" ":o[a])+" ";n+="\n"}return console.log(n),n}}}()}).call(this),function(t,n,r){"use strict";var e=function(t,r){for(var e="",o=0,a=r.length;o<a;o++){var i=r[o];e+="<div>";for(var l=0,u=i.length;l<u;l++)e+='<button class="SPP-PuzzleSquare" x="'+l+'" y="'+o+'">',e+=i[l]||"&nbsp;",e+="</button>";e+="</div>"}n(t).html(e)},o=function(t,n,e,o){for(var a in r.orientations){var i=(0,r.orientations[a])(t,n,1);if(i.x===e&&i.y===o)return a}return null},a=function(a,i){var l,u,s,f,d,c=[],h="",v=function(t){t.preventDefault(),n(this).addClass("selected"),f=this,c.push(this),h=n(this).text()},g=function(n){n.preventDefault();var r=n.originalEvent.touches[0]||n.originalEvent.changedTouches[0],e=r.clientX,o=r.clientY;$(t.elementFromPoint(e,o))},p=function(t){t.preventDefault(),$(this)},$=function(t){if(f){var r,e=c[c.length-1];if(e!=t){for(var a=0,i=c.length;a<i;a++)if(c[a]==t){r=a+1;break}for(;r<c.length;)n(c[c.length-1]).removeClass("selected"),c.splice(r,1),h=h.substr(0,h.length-1);var l=o(n(f).attr("x")-0,n(f).attr("y")-0,n(t).attr("x")-0,n(t).attr("y")-0);l&&(c=[f],h=n(f).text(),e!==f&&(n(e).removeClass("selected"),e=f),d=l);var u=o(n(e).attr("x")-0,n(e).attr("y")-0,n(t).attr("x")-0,n(t).attr("y")-0);u&&(d&&d!==u||(d=u,P(t)))}}},P=function(t){for(var r=0,e=l.length;r<e;r++)if(0===l[r].indexOf(h+n(t).text())){n(t).addClass("selected"),c.push(t),h+=n(t).text();break}},S=function(t){t.preventDefault();for(var r="",e=0,o=0,a=l.length;o<a;o++){if(l[o]===h){for(var i=0;i<s.length;i++)s[i].toLowerCase()==h&&(r=s[i],e=i);n(".selected").addClass("found"),$eXeSopa.updateScore(s.length-l.length,r,e),l.splice(o,1)}0===l.length&&($eXeSopa.gameOver(0),n(".SPP-PuzzleSquare").addClass("complete"))}n(".selected").removeClass("selected"),f=null,c=[],h="",d=null};n("input.SSP-Word").removeClass("SPP-WordFound"),l=n("input.SSP-Word").toArray().map(t=>t.value.toLowerCase()).filter(t=>t).sort(),s=n("input.SSP-Word").toArray().map(t=>t.value).filter(t=>t),e(a,u=r.newPuzzleLax(l,$eXeSopa.optionsPuzzle)),n(".SPP-PuzzleSquare").click(function(t){t.preventDefault()}),window.navigator.msPointerEnabled?(n(".SPP-PuzzleSquare").on("MSPointerDown",v),n(".SPP-PuzzleSquare").on("MSPointerOver",$),n(".SPP-PuzzleSquare").on("MSPointerUp",S)):(n(".SPP-PuzzleSquare").mousedown(v),n(".SPP-PuzzleSquare").mouseenter(p),n(".SPP-PuzzleSquare").mouseup(S),n(".SPP-PuzzleSquare").on("touchstart",v),n(".SPP-PuzzleSquare").on("touchmove",g),n(".SPP-PuzzleSquare").on("touchend",S)),this.solve=function(){for(var t=r.solve(u,l).found,e=0,o=t.length;e<o;e++){var a=t[e].word,i=t[e].orientation,s=t[e].x,f=t[e].y,d=r.orientations[i],c=n('input.SSP-Word[value="'+a+'"]');if(!c.hasClass("SPP-WordFound")){for(var h=0,v=a.length;h<v;h++){var g=d(s,f,h);n('[x="'+g.x+'"][y="'+g.y+'"]').addClass("solved")}c.addClass("SPP-WordFound")}}}};a.emptySquaresCount=function(){var t=n(".SPP-PuzzleSquare").toArray();return t.length-t.filter(t=>t.textContent.trim()).length},a.insertWordBefore=function(t,r){n('<li><input class="SSP-Word" value="'+(r||"")+'"></li>').insertBefore(t)},a.append=function(t,r,e,o,a,i){n('<li class="Sopa-Li"><span>'+(o+1)+".-  </span>"+(a?'<a href="#" data-mnumber="'+o+'" class="SPP-LinkImage" title="">      <div class="SopaIcons SopaIcon-Image SPP-Activo"></div>      </a>':"")+" "+(i?'<a href="#" data-mnumber="'+o+'" class="SPP-LinkSound" title="">      <div class="SopaIcons SopaIcon-Audio SPP-Activo"></div>      </a>':"")+"<span>"+(e||"")+'</span><input class="SSP-Word SPP-WordsHide" value="'+(r||"")+'"></li>').appendTo(t)},window.WordFindGame=a}(document,jQuery,wordfind);