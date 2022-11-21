/**
 * Lock iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeCompleta = {
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
    options: {},
    msgs: '',
    hasSCORMbutton: false,
    isInExe: false,
    userName: '',
    previousScore: '',
    initialScore: '',
    hasLATEX: false,
    init: function () {
        this.activities = $('.completa-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeCompleta.supportedBrowser('cmpt')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Lock') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/completa-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeCompleta.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeCompleta.enable()');
        else this.enable();
        $eXeCompleta.mScorm = scorm;
        var callSucceeded = $eXeCompleta.mScorm.init();
        if (callSucceeded) {
            $eXeCompleta.userName = $eXeCompleta.getUserName();
            $eXeCompleta.previousScore = $eXeCompleta.getPreviousScore();
            $eXeCompleta.mScorm.set("cmi.core.score.max", 10);
            $eXeCompleta.mScorm.set("cmi.core.score.min", 0);
            $eXeCompleta.initialScore = $eXeCompleta.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeCompleta.options[instance],
            text = '';
        $('#cmptSendScore-' + instance).hide();
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
            $('#cmptSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#cmptSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }

        $('#cmptRepeatActivity-' + instance).text(text);
        $('#cmptRepeatActivity-' + instance).fadeIn(1000);
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeCompleta.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.number).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeCompleta.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.repeatActivity && $eXeCompleta.previousScore !== '') {
                        message = $eXeCompleta.userName !== '' ? $eXeCompleta.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeCompleta.previousScore = score;
                        $eXeCompleta.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeCompleta.userName !== '' ? $eXeCompleta.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#cmptSendScore-' + instance).hide();
                        }
                        $('#cmptRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#cmptRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeCompleta.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeCompleta.mScorm.set("cmi.core.score.raw", score);
                    $('#cmptRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#cmptRepeatActivity-' + instance).show();
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
    getUserName: function () {
        var user = $eXeCompleta.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeCompleta.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeCompleta.mScorm.quit();
    },
    enable: function () {
        $eXeCompleta.loadGame();
    },
    loadGame: function () {
        $eXeCompleta.options = [];
        $eXeCompleta.activities.each(function (i) {
            var version = $(".completa-version", this).eq(0).text(),
                dl = $(".completa-DataGame", this),
                mOption = $eXeCompleta.loadDataGame(dl),
                msg = mOption.msgs.msgPlayStart;

            $eXeCompleta.options.push(mOption);
            var completa = $eXeCompleta.createInterfaceCompleta(i);
            dl.before(completa).remove();
            $('#cmptGameMinimize-' + i).hide();
            $('#cmptGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#cmptGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#cmptGameContainer-' + i).show();
            }
            $('#cmptMessageMaximize-' + i).text(msg);
            $('#cmptMultimedia-' + i).prepend($('.completa-text-game', this));
            $('#cmptDivFeedBack-' + i).prepend($('.completa-feedback-game', this));
            $('#cmptDivFeedBack-' + i).hide();
            mOption.text = $('.completa-text-game', this).html();
            var hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(mOption.text);
            if (hasLatex) {
                $eXeCompleta.hasLATEX = true;
            }

            $eXeCompleta.addEvents(i);

        });
        if ($eXeCompleta.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeCompleta.loadMathJax();
        }

    },
    loadDataGame: function (data) {
        var json = data.text();
        json = $eXeCompleta.Decrypt(json);
        var mOptions = $eXeCompleta.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {

            $eXeCompleta.hasLATEX = true;
        }
        mOptions.wordsLimit = typeof mOptions.wordsLimit == "undefined" ? false : mOptions.wordsLimit;
        mOptions.words = [];
        mOptions.wordsErrors = mOptions.wordsErrors || '';
        mOptions.oWords = {};
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.obtainedClue = false;
        mOptions.gameActived = false;
        mOptions.validQuestions = mOptions.number;
        mOptions.counter = 0;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        return mOptions;
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
    createInterfaceCompleta: function (instance) {
        var html = '',
            path = $eXeCompleta.idevicePath,
            msgs = $eXeCompleta.options[instance].msgs,
            html = '';
        html += '<div class="CMPT-MainContainer">\
        <div class="CMPT-GameMinimize" id="cmptGameMinimize-' + instance + '">\
            <a href="#" class="CMPT-LinkMaximize" id="cmptLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + "completaIcon.svg" + '" class="CMPT-IconMinimize CMPT-Activo"  alt="">\
            <div class="CMPT-MessageMaximize" id="cmptMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="CMPT-GameContainer" id="cmptGameContainer-' + instance + '">\
            <div class="CMPT-GameScoreBoard">\
                <div class="CMPT-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="cmptPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="cmptPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="cmptPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="cmptPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="CMPT-LifesGame" id="cmptLifescmpt-' + instance + '">\
                </div>\
                <div class="CMPT-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
					<div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
                    <p  id="cmptPTime-' + instance + '" class="CMPT-PTime">00:00</p>\
                    <a href="#" class="CMPT-LinkMinimize" id="cmptLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  CMPT-Activo"></div>\
                    </a>\
                    <a href="#" class="CMPT-LinkFullScreen" id="cmptLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  CMPT-Activo" id="cmptFullScreen-' + instance + '"></div>\
					</a>\
				</div>\
            </div>\
            <div class="CMPT-ShowClue" id="cmptShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + '</div>\
                <p class=" CMPT-PShowClue CMPT-parpadea" id="cmptPShowClue-' + instance + '"></p>\
           </div>\
           <div id="cmptButonsDiv-' + instance + '" class="CMPT-ButtonsDiv"></div>\
           <div class="CMPT-Multimedia" id="cmptMultimedia-' + instance + '"></div>\
           <div class="CMPT-Flex" id="cmptDivImgHome-' + instance + '">\
                <img src="' + path + "completaIcon.svg" + '" class="CMPT-ImagesHome" id="cmptPHome-' + instance + '"  alt="' + msgs.msgNoImage + '" />\
            </div>\
            <div class="CMPT-StartGame"><a href="#" id="cmptStartGame-' + instance + '">' + msgs.msgPlayStart + '</a></div>\
           <div id="cmptMensaje-' + instance + '" class="CMPT-Message"></div>\
           <div class="CMPT-ButtonsDiv">\
                <button id="cmptCheckPhrase-' + instance + '" class="CMPT-ButtonsComands">' + msgs.msgCheck + '</button>\
                <button id="cmptReloadPhrase-' + instance + '"  class="CMPT-ButtonsComands CMPT-Hide">' + msgs.msgTry + '</button>\
           </div>\
           <div class="CMPT-Hide" id="cmptSolutionDiv-' + instance + '">\
                <p>' + msgs.msgSolution + ':</p>\
                <div id="cmptSolution-' + instance + '"></div>\
           </div>\
            <div class="CMPT-Cubierta" id="cmptCubierta-' + instance + '">\
                <div class="CMPT-CodeAccessDiv" id="cmptCodeAccessDiv' + instance + '">\
                    <div class="CMPT-MessageCodeAccessE" id="cmptMesajeAccesCodeE-' + instance + '"></div>\
                    <div class="CMPT-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="CMPT-CodeAccessE" id="cmptCodeAccessE-' + instance + '">\
                        <a href="#" id="cmptCodeAccessButton-' + instance + '" title="' + msgs.msgReply + '">\
                        <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Submit CMPT-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="CMPT-DivFeedBack" id="cmptDivFeedBack-' + instance + '">\
                    <input type="button" id="cmptFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
                </div>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },

    addButtonScore: function (instance) {
        var mOptions = $eXeCompleta.options[instance];
        var butonScore = "";
        var fB = '<div class="CMPT-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="CMPT-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="cmptSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="CMPT-RepeatActivity" id="cmptRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="CMPT-GetScore">';
                fB += '<p><span class="CMPT-RepeatActivity" id="cmptRepeatActivity-' + instance + '"></span></p>';
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

    addEvents: function (instance) {
        var mOptions = $eXeCompleta.options[instance];
        $('#cmptLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#cmptGameContainer-" + instance).show()
            $("#cmptGameMinimize-" + instance).hide();
            if (!mOptions.cmptStarted) {
                $eXeCompleta.startGame(instance);
            };
            $('#cmptSolution-' + instance).focus();
        });
        $("#cmptLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#cmptGameContainer-" + instance).hide();
            $("#cmptGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        $("#cmptButonsDiv-" + instance).hide();
        $('#cmptSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeCompleta.sendScore(false, instance);
        });

        $eXeCompleta.loadText(instance);
        $eXeCompleta.updateGameBoard(instance);


        $('#cmptCheckPhrase-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeCompleta.checkPhrase(instance);
        });

        if (mOptions.time > 0) {
            $("#cmptGameContainer-" + instance).find('.exeQuextIcons-Time ').show();
            $("#cmptPTime-" + instance).show();
        }
        $('#cmptReloadPhrase-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeCompleta.reloadGame(instance)

        });
        $("#cmptLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('cmptGameContainer-' + instance);
            $eXeCompleta.toggleFullscreen(element, instance)
        });

        var html = $('#cmptGameContainer-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (mOptions.isScorm > 0) {
            $eXeCompleta.updateScorm($eXeCompleta.previousScore, mOptions.repeatActivity, instance);
        }
        if (latex) {
            $eXeCompleta.updateLatex('cmptGameContainer-' + instance)
        }
        $('#cmptStartGame-' + instance).on('click', function (e) {
            e.preventDefault();

            $eXeCompleta.startGame(instance);
        });
        $('#cmptPTimeTitle-' + instance).hide();
        $('#cmptGameContainer-' + instance).find('.exeQuextIcons-Time').hide();
        $('#cmptPTime-' + instance).hide();
        $('#cmptStartGame-' + instance).hide();
        $('#cmptDivImgHome-' + instance).hide();
        mOptions.gameStarted = true;

        if (mOptions.itinerary.showCodeAccess) {
            mOptions.gameStarted = false;
            $('#cmptMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $($eXeCompleta.showCubiertaOptions(0, instance))

        }

        $('#cmptCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeCompleta.enterCodeAccess(instance);
        });
        $('#cmptCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeCompleta.enterCodeAccess(instance);
                return false;
            }
            return true;
        });

        if (mOptions.time > 0) {
            mOptions.gameStarted = false;
            $('#cmptGameContainer-' + instance).find('.CMPT-ButtonsDiv').hide();
            $('#cmptButonsDiv-' + instance).hide();
            $('#cmptDivImgHome-' + instance).show();
            $('#cmptMultimedia-' + instance).hide();
            $('#cmptPTimeTitle-' + instance).show();
            $('#cmptGameContainer-' + instance).find('.exeQuextIcons-Time').show();
            $('#cmptPTime-' + instance).show();
            $('#cmptStartGame-' + instance).show();
        }
        $('#cmptGameContainer-' + instance).find('.CMPT-Input').on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                return false;
            }
            return true;
        });
        $('#cmptFeedBackClose-' + instance).on('click', function (e) {
            $eXeCompleta.showCubiertaOptions(false, instance)
        });
        $('#cmptLinkMaximize-' + instance).focus()
        $('#cmptPShowClue-' + instance).hide();
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeCompleta.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() == $('#cmptCodeAccessE-' + instance).val().toLowerCase() ) {
            $eXeCompleta.showCubiertaOptions(false, instance)
            if (mOptions.time > 0) {
                $eXeCompleta.startGame(instance)
            } else {
                mOptions.gameStarted = true;
            }

        } else {
            $('#cmptMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#cmptCodeAccessE-' + instance).val('');
        }
    },

    showCubiertaOptions(mode, instance) {
        if (mode === false) {
            $('#cmptCubierta-' + instance).fadeOut();
            return;
        }
        $('#cmptCodeAccessDiv-' + instance).hide();
        $('#cmptDivFeedBack-' + instance).hide();
        switch (mode) {
            case 0:
                $('#cmptCodeAccessDiv-' + instance).show();
                break;
            case 1:
                $('#cmptDivFeedBack-' + instance).find('.completa-feedback-game').show();
                $('#cmptDivFeedBack-' + instance).show();
                break;
            default:

                break;
        }
        $('#cmptCubierta-' + instance).fadeIn();
    },

    startGame: function (instance) {
        var mOptions = $eXeCompleta.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        
        $('#cmptGameContainer-' + instance).find('.CMPT-ButtonsDiv').fadeIn();
        $('#cmptButonsDiv-' + instance).hide();
        if (mOptions.type == 1) {
            $('#cmptButonsDiv-' + instance).show();
        }
        $('#cmptMultimedia-' + instance).fadeIn();
        $('#cmptDivImgHome-' + instance).hide();
        $('#cmptPHits-' + instance).text(mOptions.hits);
        $('#cmptPScore-' + instance).text(mOptions.score);
        $('#cmptStartGame-' + instance).hide();
        $eXeCompleta.hits = 0;
        $eXeCompleta.score = 0;
        mOptions.counter = 0;
        mOptions.gameOver = false;
        mOptions.obtainedClue = false;
        mOptions.counter = mOptions.time * 60;
        mOptions.activeCounter = true;
        mOptions.gameStarted = true
        $eXeCompleta.uptateTime(mOptions.counter, instance);
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeCompleta.uptateTime(mOptions.counter, instance);
                if (mOptions.counter <= 0) {
                    $eXeCompleta.checkPhrase(instance)
                    $eXeCompleta.gameOver(2, instance)
                }
            }

        }, 1000);
    },

    gameOver: function (type, instance) {
        var mOptions = $eXeCompleta.options[instance],
            typem = 1,
            message = '';
        mOptions.gameOver = true;
        mOptions.gameStarted = false;
        $('#cmptButonsDiv-' + instance).hide();
        mOptions.activeCounter = false;
        clearInterval(mOptions.counterClock);
        mOptions.attempsNumber = 0;
        typem = mOptions.hits >= mOptions.errors ? 2 : 1;
        if (type == 2) {
            message = mOptions.msgs.msgEndTime + '. ' + mOptions.msgs.msgEndScore.replace('%s', mOptions.hits).replace('%d', mOptions.errors)
        } else if (type == 1) {
            message = mOptions.msgs.msgGameEnd + '. ' + mOptions.msgs.msgEndScore.replace('%s', mOptions.hits).replace('%d', mOptions.errors)
        }
        $eXeCompleta.showMessage(typem, message, instance)
        if (mOptions.showSolution) {
            $("#cmptSolution-" + instance).html(mOptions.solution)
            $("#cmptSolutionDiv-" + instance).show();
        }
        $eXeCompleta.showFeedBack(instance);
        var html = $('#cmptGameContainer-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeCompleta.updateLatex('cmptGameContainer-' + instance)
        }
        if (mOptions.itinerary.showClue) {
            var text = $('#cmptPShowClue').text();
            if (mOptions.obtainedClue) {
                mclue = text;
            } else {
                mclue = mOptions.msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
            }
            $('#cmptPShowClue').text(mclue);
            $('#cmptPShowClue').show();
        }
    },

    reloadGame: function (instance) {
        var mOptions = $eXeCompleta.options[instance];
        $('#cmptReloadPhrase-' + instance).hide();
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.blacks = 0;
        $eXeCompleta.showMessage(1, '', instance)
        $eXeCompleta.updateGameBoard(instance);
        $('#cmptMultimedia-' + instance).find('.CMPT-Input').val('');
        if(mOptions.type==1){
            $('#cmptMultimedia-' + instance).find('.CMPT-Input').addClass('CMPT-Drag');
            $eXeCompleta.createButtons(instance);
        }
        
        $('#cmptMultimedia-' + instance).find('.CMPT-Input').css({
            'color': '#333333'
        });
        $('#cmptMultimedia-' + instance).find('.CMPT-Input').attr('disabled', false);
        $('#cmptMultimedia-' + instance).find('.CMPT-Select').attr('disabled', false);
        $('#cmptMultimedia-' + instance).find('.CMPT-Select').css({
            'color': '#333333'
        })
        $('#cmptMultimedia-' + instance).find('.CMPT-Select').prop('selectedIndex', 0);
        if (mOptions.type == 1) {
            $eXeCompleta.getWordArrayJson(instance)
        }
        $('#cmptCheckPhrase-' + instance).show();

    },
    checkPhrase: function (instance) {
        var mOptions = $eXeCompleta.options[instance];
        if (!mOptions.gameStarted) return;
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.blacks = 0;
        if (mOptions.type < 2) {
            $('#cmptMultimedia-' + instance).find('.CMPT-Input').each(function () {
                $(this).css({
                    'color': '#000',
                })
                var number = parseInt($(this).data('number')),
                    word = mOptions.words[number],
                    answord = $(this).val();
                if (answord.length == 0) {
                    mOptions.errors++;
                } else if ($eXeCompleta.checkWord(word, answord, instance)) {
                    mOptions.hits++;
                    $(this).css('color', '#036354')
                } else {
                    mOptions.errors++;
                    $(this).css('color', '#660101')
                }
            });
        } else {
            $('#cmptMultimedia-' + instance).find('.CMPT-Select').each(function () {
                $(this).css({
                    'color': '#000',
                })
                var number = parseInt($(this).data('number')),
                    word = mOptions.words[number],
                    answord = $(this).find("option:selected").text();
                if (answord.length == 0) {
                    mOptions.errors++;
                } else if (mOptions.wordsLimit && $eXeCompleta.checkWordLimit(word, answord, instance)) {
                    mOptions.hits++;
                    $(this).css('color', '#036354')
                } else if (!mOptions.wordsLimit && $eXeCompleta.checkWord(word, answord, instance)) {
                    mOptions.hits++;
                    $(this).css('color', '#036354')
                } else {
                    mOptions.errors++;
                    $(this).css('color', '#660101')
                }
            });

        }
        var type = mOptions.hits >= mOptions.errors ? 2 : 1;
        var message = mOptions.msgs.msgEndScore.replace('%s', mOptions.hits).replace('%d', mOptions.errors)

        $eXeCompleta.showMessage(type, message, instance);
        $eXeCompleta.updateGameBoard(instance);
        $('#cmptPNumber-' + instance).text(0);
        $('#cmptMultimedia-' + instance).find('.CMPT-Input').attr('disabled', true);
        $('#cmptMultimedia-' + instance).find('.CMPT-Select').attr('disabled', true);
        mOptions.attempsNumber--;
        $('#cmptCheckPhrase-' + instance).hide();
        var score = ((mOptions.hits * 10) / mOptions.number).toFixed(2);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeCompleta.initialScore === '') {
                $eXeCompleta.sendScore(true, instance);
                $('#cmptRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeCompleta.initialScore = score;
            }
        }
        var percentageHits = (mOptions.hits * 100) / mOptions.number;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {

            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                $('#cmptPShowClue-' + instance).text(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame);
                $('#cmptPShowClue-' + instance).show();
            }
        }
        if (mOptions.attempsNumber <= 0 || mOptions.hits == mOptions.number) {
            $eXeCompleta.gameOver(1, instance);
            return
        }
        $('#cmptReloadPhrase-' + instance).text(mOptions.msgs.msgTry + " (" + mOptions.attempsNumber + ")")
        $('#cmptReloadPhrase-' + instance).show();
    },

    checkWordLimit: function (word, answord, instance) {
        var sWord = $.trim(word).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, ""),
            sAnsWord = $.trim(answord).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/,
                "");
        sWord = $.trim(sWord);
        sAnsWord = $.trim(sAnsWord);
        if (sWord.indexOf('|') == -1) {
            return sWord == sAnsWord;
        }
        var words = sWord.split('|'),
            mword = $.trim(words[0]).replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
        return mword == sAnsWord

    },

    checkWord: function (word, answord, instance) {
        var mOptions = $eXeCompleta.options[instance];
        var sWord = $.trim(word).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, ""),
            sAnsWord = $.trim(answord).replace(/\s+/g, " ").replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/,
                ""),
            proba = 1 - mOptions.percentajeError / 100;
        sWord = $.trim(sWord);
        sAnsWord = $.trim(sAnsWord);
        if (!mOptions.caseSensitive) {
            sWord = sWord.toLowerCase();
            sAnsWord = sAnsWord.toLowerCase();
        }
        if (sWord.indexOf('|') == -1) {
            //console.log(sWord, sAnsWord, mOptions.estrictCheck, proba, $eXeCompleta.similarity(sWord, sAnsWord))
            return !mOptions.estrictCheck ? sWord == sAnsWord : $eXeCompleta.similarity(sWord, sAnsWord) >= proba;
        }

        var words = sWord.split('|');
        for (var i = 0; i < words.length; i++) {

            var mword = $.trim(words[i]).replace(/\.$/, "").replace(/\,$/, "").replace(/\;$/, "");
            if ((!mOptions.estrictCheck && mword == sAnsWord) || (mOptions.estrictCheck && $eXeCompleta.similarity(mword, sAnsWord) >= proba)) {
                return true
            }
        }

    },
    similarity: function (s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
        }
        return (longerLength - $eXeCompleta.editDistance(longer, shorter)) / parseFloat(longerLength);
    },

    editDistance: function (s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i == 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    },
    loadText: function (instance) {
        var mOptions = $eXeCompleta.options[instance],
            frase = mOptions.text,
            find = 0,
            inicio = true;
        mOptions.solution = frase.replace(/@@/g, '');
        while (find != -1) {
            find = frase.indexOf('@@')
            if (find != -1) {
                frase = inicio ? frase.replace('@@', '@€') : frase.replace('@@', '€@');
                inicio = !inicio;
            }
        }
        const reg = /@€([^€@]*)€@/gm;
        mOptions.text = frase.replace(reg, '#X#');
        var words = frase.match(reg);
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].replace('@€', '').replace('€@', '');
        }
        mOptions.words = [...words];
        mOptions.number = mOptions.words.length;
        if (mOptions.type == 0) {
            $eXeCompleta.replacePhrase(instance);
        } else if (mOptions.type == 1) {
            $eXeCompleta.replacePhrase(instance);
            var $inputs = $('#cmptMultimedia-' + instance).find('input.CMPT-Input');
            //$inputs.attr('disabled', true)
            $eXeCompleta.getWordArrayJson(instance);
        } else if (mOptions.type == 2) {
            $eXeCompleta.createInputSelect(instance);
        }
        $('#cmptPNumber-' + instance).text(mOptions.number);
        $('#cmptCheckPhrase-' + instance).show();

    },
    replacePhrase: function (instance) {
        var mOptions = $eXeCompleta.options[instance],
            html = mOptions.text.trim();
        for (var i = 0; i < mOptions.words.length; i++) {
            var word = mOptions.words[i],
                word = word.split('|')[0].trim();
            var size = mOptions.wordsSize ? word.length : 10;
            var input = '<input type="text" data-number="' + i + '" class="CMPT-Input CMPT-Drag" size="' + (size + 3) +
                '"/>';
            html = html.replace('#X#', input)
        }
        $('#cmptMultimedia-' + instance).empty();
        $('#cmptMultimedia-' + instance).append(html);
    },

    createInputSelect: function (instance) {
        var mOptions = $eXeCompleta.options[instance],
            html = mOptions.text.trim(),
            solution = mOptions.text.trim();

        for (var i = 0; i < mOptions.words.length; i++) {
            var word = mOptions.words[i],
                word = word.split('|')[0].trim();
            if (mOptions.wordsLimit) {
                var input = $eXeCompleta.createSelectLimit(i, instance);
            } else {
                var input = $eXeCompleta.createSelect(i, instance);
            }
            solution = solution.replace('#X#', word);
            html = html.replace('#X#', input);
        }
        if (mOptions.wordsLimit) {
            mOptions.solution = solution;
        }
        $('#cmptMultimedia-' + instance).empty();
        $('#cmptMultimedia-' + instance).append(html);
    },
    createSelectLimit: function (num, instance) {
        var mOptions = $eXeCompleta.options[instance],
            wl = [],
            word = mOptions.words[num],
            wordsL = word.split('|')
        for (var i = 0; i < wordsL.length; i++) {
            var wd = wordsL[i].trim();
            wl.push(wd)
        }
        var unique = (value, index, self) => {
            return self.indexOf(value) === index
        }
        wl = wl.filter(unique);
        wl.sort();
        s = '<select data-number="' + num + '" class="CMPT-Select">';
        s += '<option val="0"></option>'
        for (var j = 0; j < wl.length; j++) {
            s += '<option val="' + (j + 1) + '">' + wl[j] + '</option>'
        }
        s += '</select>'
        return s;

    },
    createSelect: function (num, instance) {
        var mOptions = $eXeCompleta.options[instance],
            words = mOptions.wordsErrors,
            we = [],
            wp = [];
        for (var i = 0; i < mOptions.words.length; i++) {
            var wd = mOptions.words[i];
            wd = wd.split('|')[0].trim();
            wp.push(wd)
        }
        if (words.length > 0) {
            words = words.split(',');
            for (var i = 0; i < words.length; i++) {
                var p = words[i].trim().split('|');
                for (var j = 0; j < p.length; j++) {
                    p[j] = p[j].trim();
                }
                we = we.concat(p)
            }
            words = we.concat(wp);
        } else {
            words = [...wp]
        }
        var unique = (value, index, self) => {
            return self.indexOf(value) === index
        }
        words = words.filter(unique);
        words.sort();
        s = '<select data-number="' + num + '" class="CMPT-Select">';
        s += '<option val="0"></option>'
        for (var j = 0; j < words.length; j++) {
            s += '<option val="' + (j + 1) + '">' + words[j] + '</option>'
        }
        s += '</select>'
        return s;

    },
    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },
    updateGameBoard(instance) {
        var mOptions = $eXeCompleta.options[instance];
        mOptions.score = mOptions.hits * 10 / mOptions.words.length;
        var sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#cmptPHits-' + instance).text(mOptions.hits);
        $('#cmptPErrors-' + instance).text(mOptions.errors);
        $('#cmptPNumber-' + instance).text(mOptions.number);
        $('#cmptPScore-' + instance).text(sscore);
    },
    getWordArrayJson: function (instance) {
        var mOptions = $eXeCompleta.options[instance],
            wordsa = [],
            wordsCorrect = [],
            wordsErrors = [];
        mOptions.oWords = {};
        $('#cmptButonsDiv-' + instance).empty();
        for (var i = 0; i < mOptions.words.length; i++) {
            var wd = mOptions.words[i];
            wd = wd.split('|')[0].trim();
            wordsCorrect.push(wd)
        }
        if (mOptions.wordsErrors.length > 0) {
            we = mOptions.wordsErrors.split(',');
            for (var i = 0; i < we.length; i++) {
                var p = we[i].trim().split('|');
                for (var j = 0; j < p.length; j++) {
                    p[j] = p[j].trim();
                }
                wordsErrors = wordsErrors.concat(p)
            }
            wordsCorrect = wordsCorrect.concat(wordsErrors);
        }
        mOptions.oWords = {};
        wordsCorrect.sort();
        wordsa = [...wordsCorrect];
        if (mOptions.caseSensitive) {
            wordsa = wds.map(name => name.toLowerCase());
        }
        wordsa.forEach(el => (mOptions.oWords[el] = mOptions.oWords[el] + 1 || 1));
        $eXeCompleta.createButtons(instance)
    },
    createButtons: function (instance) {
        var mOptions = $eXeCompleta.options[instance],
            html = '';
        for (const [key, value] of Object.entries(mOptions.oWords)) {
            var button = '<a href="@" class="CMPT-WordsButton" draggable="true" dat-number="' + value + '">' + key +
                '<div class="CMPT-WordsButtonNumber">' + value + '</div></a>';
            html += button;
        }

        $('#cmptButonsDiv-' + instance).empty();
        $('#cmptButonsDiv-' + instance).append(html);

        var $cc = $('#cmptButonsDiv-' + instance).find('.CMPT-WordsButton'),
            pc = '.CMPT-Drag';
        $cc.each(function () {
            var v = parseInt($(this).find('.CMPT-WordsButtonNumber').eq(0).text());
            if (v == 1) {
                $(this).find('.CMPT-WordsButtonNumber').eq(0).hide();
            }
        });
        $cc.css('cursor', 'pointer');
        $cc.draggable({
            revert: true,
            placeholder: false,
            droptarget: pc,
            drop: function (evt, droptarget) {
                $(this).parent(pc).css({
                    'z-index': '1',
                });
                $(this).css({
                    'z-index': '1',
                });
                $eXeCompleta.moveCard($(this), droptarget, instance);
            },
        });
        $("#cmptButonsDiv-" + instance).show();
    },
    moveCard: function ($item, destino, instance) {

        if ($(destino).attr('disabled')) return;
        var mOptions = $eXeCompleta.options[instance],
            $hijo = $item.find('.CMPT-WordsButtonNumber').eq(0),
            number = parseInt($hijo.text()),
            num = $(destino).data('number'),
            $clone = $item.clone(),
            dword = mOptions.words[num];
        $clone.find('.CMPT-WordsButtonNumber').remove();
        var oword = $clone.text();
        $(destino).val(oword);
        number--;
        $hijo.text(number);
        if (number == 0) {
            $hijo.remove();
            $item.css({
                'text-decoration': 'line-through'
            });
            $item.draggable('destroy');
        }
        $(destino).attr('disabled', true);
        $(destino).removeClass('CMPT-Drag')

    },

    showFeedBack: function (instance) {
        var mOptions = $eXeCompleta.options[instance],
            puntos = mOptions.hits * 100 / mOptions.number;
        if (mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $eXeCompleta.showCubiertaOptions(1, instance)
            } else {
                $eXeCompleta.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB));
            }
        }
    },
    uptateTime: function (tiempo, instance) {
        tiempo = tiempo < 0 ? 0 : tiempo;
        var mTime = $eXeCompleta.getTimeToString(tiempo);
        $('#cmptPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },

    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeCompleta.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    showMessageAlert: function (tmsg) {
        window.alert(tmsg)
    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeCompleta.borderColors.red, $eXeCompleta.borderColors.green, $eXeCompleta.borderColors.blue, $eXeCompleta.borderColors.yellow];
        var color = colors[type];
        $("#cmptMensaje-" + instance).text(message);
        $("#cmptMensaje-" + instance).css({
            'color': color,
            'font-weight': 'bold'
        });
    },
    supportedBrowser: function (idevice) {
        var sp = !(window.navigator.appName == 'Microsoft Internet Explorer' || window.navigator.userAgent.indexOf('MSIE ') > 0);
        if (!sp) {
            var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
            $('.' + idevice + '-instructions').text(bns);
        }
        return sp;
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
            $eXeCompleta.getFullscreen(element);
        } else {
            $eXeCompleta.exitFullscreen(element);
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
    }
}
$(function () {
    $eXeCompleta.init();
});

function factory(e) {
    "use strict";

    function t(t, o) {
        var r = this,
            n = e(t),
            a = n[0].nodeName,
            s = "OL" == a || "UL" == a ? "LI" : "DIV";
        r.$sortable = n.data("sortable", r), r.options = e.extend({}, {
            handle: !1,
            container: a,
            container_type: a,
            same_depth: !1,
            make_unselectable: !1,
            nodes: s,
            nodes_type: s,
            placeholder_class: null,
            auto_container_class: "sortable_container",
            autocreate: !1,
            group: !1,
            scroll: !1,
            update: null
        }, o), r.init()
    }

    function o(t, o) {
        var r = this;
        r.$draggable = e(t).data("draggable", r), r.options = e.extend({}, {
            handle: !1,
            delegate: !1,
            revert: !1,
            placeholder: !1,
            droptarget: !1,
            container: !1,
            scroll: !1,
            update: null,
            drop: null
        }, o), r.init()
    }

    function r(t, o) {
        var r = this;
        r.$droppable = e(t).data("droppable", r), r.options = e.extend({}, {
            accept: !1,
            drop: null
        }, o), r.init()
    }

    function n(t, o) {
        var r, n = e(t),
            a = null,
            s = null,
            i = null;

        function l(e) {
            return "touch" === (e = window.hasOwnProperty("event") ? window.event : e).type.substr(0, 5) && (e = (e = e.hasOwnProperty("originalEvent") ? e.originalEvent : e).touches[0]), {
                pageX: e.pageX,
                pageY: e.pageY,
                clientX: e.clientX,
                clientY: e.clientY,
                dX: s ? e.pageX - s.pageX : 0,
                dY: s ? e.pageY - s.pageY : 0
            }
        }

        function d(e) {
            if (i = l(e), o.scroll && function e(t) {
                    var a = n.scrollParent(),
                        s = {
                            x: t.pageX,
                            y: t.pageY
                        },
                        i = a.offset(),
                        l = a.scrollLeft(),
                        d = a.scrollTop(),
                        c = a.width(),
                        p = a.height();
                    if (window.clearTimeout(r), l > 0 && s.x < i.left) a.scrollLeft(l - o.scrollspeed);
                    else if (l < a.prop("scrollWidth") - c && s.x > i.left + c) a.scrollLeft(l + o.scrollspeed);
                    else if (d > 0 && s.y < i.top) a.scrollTop(d - o.scrollspeed);
                    else {
                        if (!(d < a.prop("scrollHeight") - p) || !(s.y > i.top + p)) return;
                        a.scrollTop(d + o.scrollspeed)
                    }
                    r = window.setTimeout(function () {
                        e(t)
                    }, o.scrolltimeout)
                }(i), a.trigger("dragging"), o.drag) return o.drag.call(a, e, i), !1
        }

        function c(t) {
            return window.clearTimeout(r), o.dragstop && o.dragstop.call(a, t, i), a.removeClass("dragging"), a.trigger("dragstop"), s = !1, i = !1, a = !1, e(document).off(".dragaware"), !1
        }
        o = e.extend({}, {
            handle: null,
            delegate: null,
            scroll: !1,
            scrollspeed: 15,
            scrolltimeout: 50,
            dragstart: null,
            drag: null,
            dragstop: null
        }, o), n.addClass("dragaware").on("touchstart.dragaware mousedown.dragaware", o.delegate, function t(r) {
            var p = e(r.target);
            if (a = o.delegate ? p.closest(o.delegate) : n, p.closest(o.handle || "*").length && ("touchstart" == r.type || 0 == r.button)) return s = i = l(r), o.dragstart && o.dragstart.call(a, r, i), a.addClass("dragging"), a.trigger("dragstart"), e(document).on("touchend.dragaware mouseup.dragaware click.dragaware", c).on("touchmove.dragaware mousemove.dragaware", d), !1
        }), n.on("destroy.dragaware", function () {
            n.removeClass("dragaware").off(".dragaware")
        })
    }

    function a(e) {
        this.origin = e
    }
    return t.prototype.invoke = function (e) {
        return "destroy" === e ? this.destroy() : "serialize" === e ? this.serialize(this.$sortable) : void 0
    }, t.prototype.init = function () {
        var t, o, r, n = this;

        function s(r, a) {
            var s, i, l;
            if (a) return s = n.$sortable.add(n.$sortable.find(n.options.container)).not(r.find(n.options.container)).not(t.find(n.options.container)).not(n.find_nodes()), n.options.same_depth && (l = r.parent().nestingDepth("ul"), s = s.filter(function () {
                return e(this).nestingDepth("ul") == l
            })), o.hide(), s.each(function (t, o) {
                var r, s, l, d = e(n.create_placeholder()).appendTo(o),
                    c = e(o).children(n.options.nodes).not(".sortable_clone");
                for (s = 0; s < c.length; s++) r = c.eq(s), l = n.square_dist(r.offset(), a), (!i || i.dist > l) && (i = {
                    container: o,
                    before: r[0],
                    dist: l
                });
                d.remove()
            }), o.show(), i
        }

        function i(t, o) {
            var r = e(o.container);
            o.before && o.before.closest("html") ? t.insertBefore(o.before) : t.appendTo(r)
        }
        n.options.make_unselectable && e("html").unselectable(), n.$sortable.addClass("sortable").on("destroy.sortable", function () {
            n.destroy()
        }), n.$sortable.dragaware(e.extend({}, n.options, {
            delegate: n.options.nodes,
            dragstart: function (s) {
                var i = e(this);
                t = i.clone().removeAttr("id").addClass("sortable_clone").css({
                    position: "absolute"
                }).insertAfter(i).offset(i.offset()), o = n.create_placeholder().css({
                    height: i.outerHeight(),
                    width: i.outerWidth()
                }).insertAfter(i), i.hide(), r = new a(t.offset()), n.options.autocreate && n.find_nodes().filter(function (t, o) {
                    return 0 == e(o).find(n.options.container).length
                }).append("<" + n.options.container_type + ' class="' + n.options.auto_container_class + '"/>')
            },
            drag: function (n, a) {
                var l = e(this),
                    d = r.absolutize(a),
                    c = s(l, d);
                t.offset(d), i(o, c)
            },
            dragstop: function (a, l) {
                var d = e(this),
                    c = r.absolutize(l),
                    p = s(d, c);
                p && i(d, p), d.show(), t && t.remove(), o && o.remove(), t = null, o = null, p && n.options.update && n.options.update.call(n.$sortable, a, n), n.$sortable.trigger("update")
            }
        }))
    }, t.prototype.destroy = function () {
        this.options.make_unselectable && e("html").unselectable("destroy"), this.$sortable.removeClass("sortable").off(".sortable").dragaware("destroy")
    }, t.prototype.serialize = function (t) {
        var o = this;
        return t.children(o.options.nodes).not(o.options.container).map(function (t, r) {
            var n = e(r),
                a = n.clone().children().remove().end().text().trim(),
                s = {
                    id: n.attr("id") || a
                };
            return n.find(o.options.nodes).length && (s.children = o.serialize(n.children(o.options.container))), s
        }).get()
    }, t.prototype.find_nodes = function () {
        return this.$sortable.find(this.options.nodes).not(this.options.container)
    }, t.prototype.create_placeholder = function () {
        return e("<" + this.options.nodes_type + "/>").addClass("sortable_placeholder").addClass(this.options.placeholder_class)
    }, t.prototype.square_dist = function (e, t) {
        return Math.pow(t.left - e.left, 2) + Math.pow(t.top - e.top, 2)
    }, o.prototype.init = function () {
        var t, o, r = this;

        function n(o) {
            var n;
            if (e(".hovering").removeClass("hovering"), t.hide(), n = e(document.elementFromPoint(o.clientX, o.clientY)).closest(r.options.droptarget), t.show(), n.length) return n.addClass("hovering"), n
        }
        r.$draggable.addClass("draggable").on("destroy.draggable", function () {
            r.destroy()
        }), r.$draggable.dragaware(e.extend({}, r.options, {
            dragstart: function (n) {
                var s = e(this);
                r.options.placeholder || r.options.revert ? (t = s.clone().removeAttr("id").addClass("draggable_clone").css({
                    position: "absolute"
                }).appendTo(r.options.container || s.parent()).offset(s.offset()), r.options.placeholder || e(this).invisible()) : t = s, o = new a(t.offset())
            },
            drag: function (e, r) {
                n(r), t.offset(o.absolutize(r))
            },
            dragstop: function (a, s) {
                var i = e(this),
                    l = n(s);
                (r.options.revert || r.options.placeholder) && (i.visible(), r.options.revert || i.offset(o.absolutize(s)), t.remove()), t = null, r.options.update && r.options.update.call(i, a, r), i.trigger("update"), l ? (r.options.drop && r.options.drop.call(i, a, l[0]), l.trigger("drop", [i]), l.removeClass("hovering")) : r.options.onrevert && r.options.onrevert.call(i, a)
            }
        }))
    }, o.prototype.destroy = function () {
        this.$draggable.dragaware("destroy").removeClass("draggable").off(".draggable")
    }, r.prototype.init = function () {
        var e = this;
        e.$droppable.addClass("droppable").on("drop", function (t, o) {
            (!e.options.accept || o.is(e.options.accept)) && e.options.drop && e.options.drop.call(e.$droppable, t, o)
        }).on("destroy.droppable", function () {
            e.destroy()
        })
    }, r.prototype.destroy = function () {
        this.$droppable.removeClass("droppable").off(".droppable")
    }, a.prototype.absolutize = function (e) {
        return e ? {
            top: this.origin.top + e.dY,
            left: this.origin.left + e.dX
        } : this.origin
    }, e.fn.sortable = function (o) {
        var r = this.not(function () {
            return e(this).is(".sortable") || e(this).closest(".sortable").length
        });
        return this.data("sortable") && "string" == typeof o ? this.data("sortable").invoke(o) : (r.length && o && o.group ? new t(r, o) : r.each(function (e, r) {
            new t(r, o)
        }), this)
    }, e.fn.draggable = function (e) {
        return "destroy" === e ? this.trigger("destroy.draggable") : this.not(".draggable").each(function (t, r) {
            new o(r, e)
        }), this
    }, e.fn.droppable = function (e) {
        return "destroy" === e ? this.trigger("destroy.droppable") : this.not(".droppable").each(function (t, o) {
            new r(o, e)
        }), this
    }, e.fn.dragaware = function (e) {
        return "destroy" === e ? this.trigger("destroy.dragaware") : this.not(".dragaware").each(function (t, o) {
            new n(o, e)
        }), this
    }, e.fn.unselectable = function (e) {
        function t() {
            return !1
        }
        return "destroy" == e ? this.removeClass("unselectable").removeAttr("unselectable").off("selectstart.unselectable") : this.addClass("unselectable").attr("unselectable", "on").on("selectstart.unselectable", t)
    }, e.fn.invisible = function () {
        return this.css({
            visibility: "hidden"
        })
    }, e.fn.visible = function () {
        return this.css({
            visibility: "visible"
        })
    }, e.fn.scrollParent = function () {
        return this.parents().addBack().filter(function () {
            var t = e(this);
            return /(scroll|auto)/.test(t.css("overflow-x") + t.css("overflow-y") + t.css("overflow"))
        })
    }, e.fn.nestingDepth = function (e) {
        var t = this.parent().closest(e || "*");
        return t.length ? t.nestingDepth(e) + 1 : 0
    }, {
        Sortable: t,
        Draggable: o,
        Droppable: r,
        Dragaware: n,
        PositionHelper: a
    }
}
"undefined" != typeof define ? define(["jquery"], factory) : factory(jQuery, factory);