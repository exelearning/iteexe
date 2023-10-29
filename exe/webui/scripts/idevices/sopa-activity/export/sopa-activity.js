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
        mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
        mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? '' : mOptions.evaluationID;
        mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
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
        html += '<div class="SPP-MainContainer" id="sopaMainContainer">\
        <div class="SPP-GameMinimize" id="sopaGameMinimize">\
            <a href="#" class="SPP-LinkMaximize" id="sopaLinkMaximize" title="' + msgs.msgMaximize + '"><img src="' + path + "sopaIcon.svg" + '" class="SPP-IconMinimize SPP-Activo"  alt="">\
            <div class="SPP-MessageMaximize" id="sopaMessageMaximize"></div></a>\
        </div>\
        <div class="SPP-GameContainer" id="sopaGameContainer">\
            <div class="SPP-GameScoreBoard" id="sopaGameScoreBoard">\
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
            <div class="SPP-ShowClue" id="sopaShowClue">\
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
        if (mode === false) {
            $('#sopaCubierta').fadeOut(function () {
                $('#sopaGameContainer').css('height', 'auto');
                $('#sopaMainContainer').css('height', 'auto');
            });
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
                setTimeout(function () {
                    var max = Math.max($('#sopaMFDetails').innerHeight() + 50, $('#sopaGameContainer').innerHeight() + 50);
                    $('#sopaCubierta').height(max);
                }, 0)


                break;
            default:

                break;
        }
        $('#sopaCubierta').fadeIn(function () {
            var max = Math.max($('#sopaCubierta').innerHeight(), $('#sopaGameContainer').innerHeight());
            $('#sopaGameContainer').height(max);
            $('#sopaMainContainer').height(max + $('.SSP-GameScoreBoard').eq(0).innerHeight() + $('.SSP-ShowClue').eq(0).innerHeight() + 30);

        });
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
                        <img class="SPP-Images" id="sopaMImagePoint"  alt="' + msgs.msgNoImage + '" />\
                        <img class="SPP-Cursor" id="sopaMCursor" src="' + $eXeSopa.idevicePath + 'exequextcursor.gif" alt="" />\
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
        if (mOptions.showResolve) {
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
        $eXeSopa.showImagePoint(q.url, q.x, q.y, q.author, q.alt);

        if (q.author.length > 0) {
            $('#sopaMAuthorPoint').show();
        }
        var html = $('#sopaFDetails').html(),
            latex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeSopa.updateLatex('sopaFDetails');
        }

    },
    positionPointerCard: function($cursor, x, y) {
        $cursor.hide();
        if(x > 0 || y > 0){
            var parentClass = '.SPP-MultimediaPoint',
                siblingClass ='.SPP-Images',
			    containerElement = $cursor.parents(parentClass).eq(0),
                imgElement = $cursor.siblings(siblingClass).eq(0),
                containerPos = containerElement.offset(),
                imgPos = imgElement.offset(),
                marginTop = imgPos.top - containerPos.top,
                marginLeft = imgPos.left - containerPos.left,
                mx = marginLeft + (x * imgElement.width()),
                my = marginTop + (y * imgElement.height());
            $cursor.css({ left: mx, top: my, 'z-index': 1004 });
            $cursor.show();
        }
	},
    showImagePoint: function (url, x, y, author, alt) {
        var $Image = $('#sopaMImagePoint'),
            $cursor = $('#sopaMCursor'),
            $Author = $('#sopaMAuthorPoint');
        $Author.html(author);
        $Image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $Image.hide();
                    $Image.attr('alt', $eXeSopa.options.msgs.msgNoImage);
                    $noImage.show();
                    $eXeSopa.showCubiertaOptions(2);
                    return false;
                } else {
                    $Image.show();
                    $Image.attr('alt', alt);
                    $eXeSopa.showCubiertaOptions(2);
                    $eXeSopa.positionPointerCard($cursor, x, y)
                    return true;
                }
            }).on('error', function () {
                $Image.hide();
                $Image.attr('alt', $eXeSopa.options.msgs.msgNoImage);
                $eXeSopa.showCubiertaOptions(2)
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


    updateEvaluationIcon: function () {
        var mOptions = $eXeSopa.options;
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data = $eXeSopa.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                $eXeSopa.showEvaluationIcon(state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
            $eXeSopa.showEvaluationIcon(state, score);
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#sopaMainContainer').parents('article').prepend('<div id="' + ancla + '"></div>');

        }
    },
    showEvaluationIcon: function (state, score) {
        var mOptions = $eXeSopa.options;
        var $header = $('#sopaGameContainer').parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
        }
        $('#sopaEvaluationIcon').remove();
        var sicon = '<div id="sopaEvaluationIcon" class="SPP-EvaluationDivIcon"><img  src="' + $eXeSopa.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#sopaEvaluationIcon').find('span').eq(0).text(alt)
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

    saveEvaluation: function () {
        var mOptions = $eXeSopa.options;
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#sopaGameContainer').parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text(),
                score = ((10 * $eXeSopa.hits) / mOptions.wordsGame.length).toFixed(2),
                formattedDate = $eXeSopa.getDateString(),
                scorm = {
                    'id': mOptions.id,
                    'type': mOptions.msgs.msgTypeGame,
                    'node': node,
                    'name': name,
                    'score': score,
                    'date': formattedDate,
                    'state': (parseFloat(score) >= 5 ? 2 : 1)
                }
            var data = $eXeSopa.getDataStorage(mOptions.evaluationID);
            data = $eXeSopa.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeSopa.showEvaluationIcon(scorm.state, scorm.score)
        }
    },
    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data = $eXeSopa.isJsonString(localStorage.getItem(id));
        return data;
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
            message = mOptions.msgs.msgEndGameScore;
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

        $('#sopaInstructions').text(mOptions.instructions);
        $('#sopaSendScore').click(function (e) {
            e.preventDefault();
            $eXeSopa.sendScore(false);
            $eXeSopa.saveEvaluation();
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
        $('#sopaPTimeTitle').hide();
        $('.exeQuextIcons-Time').hide();
        $('#sopaPTime').hide();
        $('#sopaStartGame').hide();
        $('#sopaDivImgHome').hide();
        if (mOptions.showResolve) {
            $('#sopaResolve').show();
        }
        mOptions.gameStarted = true;
        if (mOptions.time > 0) {
            mOptions.gameStarted = false;
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

        if (mOptions.isScorm > 0) {
            $eXeSopa.updateScorm($eXeSopa.previousScore, mOptions.repeatActivity);
        }
        $eXeSopa.updateEvaluationIcon();
    },

    refreshImageActive: function () {
        var mOptions = $eXeSopa.options;
        if (mOptions.gameOver) {
            return;
        }
        if (mOptions.gameStarted) {
            var q = mOptions.wordsGame[mOptions.activeQuestion];
            if(typeof q !="undefined"){
                $eXeSopa.positionPointerCard($('sopaMCursor'), q.x, q.y);
            }
        }
    },
    enterCodeAccess: function () {
        var mOptions = $eXeSopa.options;
        if (mOptions.itinerary.codeAccess.toLowerCase() == $('#sopaCodeAccessE').val().toLowerCase()) {
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
        $eXeSopa.saveEvaluation();
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
        var message = $eXeSopa.getRetroFeedMessages(true) + ' ' + mOptions.msgs.msgWordsFind.replace('%s', score);
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
        message = $eXeSopa.getRetroFeedMessages(true) + ' ' + msgs.msgWordsFind.replace('%s', $eXeSopa.score.toFixed(2));
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
        obtainedPoints = (10 / mOptions.wordsGame.length) || 0;
        points = obtainedPoints % 1 == 0 ? obtainedPoints : obtainedPoints.toFixed(2);
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
        var percentageHits = ($eXeSopa.hits / mOptions.wordsGame.length) * 100;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                $('#sopaPShowClue').show();
            }
        }
        var score = (percentageHits / 10).toFixed(2);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeSopa.initialScore === '') {
                $eXeSopa.sendScore(true);
                $('#sopaRepeatActivity').text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeSopa.initialScore = score;
            }
            $('#sopaRepeatActivity').text(mOptions.msgs.msgYouScore + ': ' + score);
        }
        $eXeSopa.saveEvaluation();
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
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $eXeSopa.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $eXeSopa.getURLAudioMediaTeca(urlmedia);
        }
        return sUrl;
    }
}
$(function () {

    $eXeSopa.init();
});