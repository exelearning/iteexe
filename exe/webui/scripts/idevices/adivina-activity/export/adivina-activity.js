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
    init: function () {
        this.activities = $('.adivina-IDevice');
        if (this.activities.length == 0) return;
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
            var dl = $(".adivina-DataGame", this),
                imagesLink = $('.adivina-LinkImages', this),
                mOption = $eXeAdivina.loadDataGame(dl, imagesLink),
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
            $eXeAdivina.addEvents(i);
        });

    },
    loadDataGame: function (data, imgsLink) {
        var json = data.text(),
            mOptions = $eXeAdivina.isJsonString(json);
        mOptions.gameOver = false;
        imgsLink.each(function (index) {
            mOptions.wordsGame[index].url = $(this).attr('href');
        });
        mOptions.wordsGame = mOptions.optionsRamdon ? $eXeAdivina.shuffleAds(mOptions.wordsGame) : mOptions.wordsGame;
        mOptions.numberQuestions = mOptions.wordsGame.length;
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
    createInterfaceAdivina: function (instance) {
        var html = '',
            path = $eXeAdivina.idevicePath,
            msgs = $eXeAdivina.options[instance].msgs,
            html = '';
        html += '<div class="adivina-MainContainer">\
        <div class="adivina-GameMinimize" id="adivinaGameMinimize-' + instance + '">\
            <a href="#" class="adivina-LinkMaximize" id="adivinaLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + "adivinaIcon.png" + '" class="adivina-Icons adivina-IconMinimize"  alt="' + msgs.msgMaximize + '">\
            <div class="adivina-MessageMaximize" id="adivinaMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="adivina-GameContainer" id="adivinaGameContainer-' + instance + '">\
            <div class="adivina-GameScoreBoard">\
                <div class="adivina-GameScores">\
                    <a href="#" class="adivina-LinkMinimize" id="adivinaLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize"></div>\
                    </a>\
                    <div class="exeQuext-ResultGame">\
						<strong><span class="sr-av">' + msgs.msgHits + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-Hit"></div>\
					    <p  id="adivinaPHits-' + instance + '">0</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">' + msgs.msgErrors + ':</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Error"></div>\
                        <p id="adivinaPErrors-' + instance + '">0</p>\
                    </div>\
                    <div class="exeQuext-ResultGame">\
                        <strong><span class="sr-av">' + msgs.msgScore + ':</span></strong>\
                        <div class="exeQuextIcons  exeQuextIcons-Score"></div>\
                        <p id="adivinaPScore-' + instance + '">0</p>\
                    </div>\
                </div>\
                <div class="adivina-LifesGame" id="adivinaLifesGame-' + instance + '">\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life"></div>\
                </div>\
                <div class="adivina-NumberLifesGame" id="adivinaNumberLivesGame-' + instance + '">\
                    <strong><span class="sr-av">' + msgs.msgLive + ':</span></strong>\
                    <div  class="exeQuextIcons exeQuextIcons-Life"></div>\
                    <p id="adivinaPLifes-' + instance + '">0</p>\
                </div>\
                <div class="adivina-TimeNumber">\
					<div  class="adivina-TimeQuestion">\
						<strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
						<div class="exeQuextIcons  exeQuextIcons-Time"></div>\
						<p  id="adivinaPTime-' + instance + '">00:00</p>\
                    </div>\
                    <div  class="exeQuext-ResultGame">\
						<strong><span class="sr-av">' + msgs.msgNumQuestions + ':</span></strong>\
						<div class="exeQuextIcons  exeQuextIcons-Number"></div>\
						<p  id="adivinaPNumber-' + instance + '">0</p>\
					</div>\
                        <a href="#" class="adivina-LinkFullScreen" id="adivinaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						    <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
							<div class="exeQuextIcons exeQuextIcons-FullScreen" id="adivinaFullScreen-' + instance + '"></div>\
						</a>\
				</div>\
            </div>\
            <div class="adivina-ShowClue" id="adivinaShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="adivina-PShowClue" id="adivinaPShowClue-' + instance + '"></p>\
           </div>\
            <div class="adivina-Multimedia" id="adivinaMultimedia-' + instance + '">\
                <img src="' + path + 'adivinaCursor.gif" class="adivina-Cursor" alt="Cursor" id="adivinaCursor-' + instance + '" /> \
                <img src="" class="adivina-Image" alt="' + msgs.msgNoImage + '" id="adivinaImage-' + instance + '" />\
                <img src="' + path + 'adivinaHome.png" class="adivina-NoImage" alt="' + msgs.msgNoImage + '" id="adivinaNoImage-' + instance + '" /> \
                <div class="adivina-GameOver" id="adivinaGamerOver-' + instance + '">\
                    <div class="adivina-TextClueGGame" id="adivinaTextClueGGame-' + instance + '"></div>\
                    <div class="adivina-DataImageGameOver">\
                         <img src="' + path + 'adivinaGameWon.png" class="adivina-HistGGame" id="adivinaHistGGame-' + instance + '" alt="' + msgs.mgsAllQuestions + '"/> \
                         <img src="' + path + 'adivinaGameLost.png" class="adivina-LostGGame"  id="adivinaLostGGame-' + instance + '" alt="' + msgs.msgLostLives + '"/> \
                        <div class="adivina-DataGame" id="adivinaDataGame-' + instance + '">\
                            <p id="adivinaOverScore-' + instance + '">Score: 0</p>\
                            <p id="adivinaOverHits-' + instance + '">Hists: 0</p>\
                            <p id="adivinaOverErrors-' + instance + '">Errors: 0</p>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div class="adivina-AutorLicence" id="adivinaAutorLicence-' + instance + '">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="adivinaPAuthor-' + instance + '"></p>\
            </div>\
            <div class="adivina-Question" id="adivinaQuestion-' + instance + '">\
                <div class="sr-av">' + msgs.msgAnswer + ':</div>\
                <div class="adivina-Prhase" id="adivina-Phrase-' + instance + '"></div>\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="adivina-Definition" id="adivinaDefinition-' + instance + '"></div>\
                <div class="adivina-DivReply" id="adivinaDivResponder-' + instance + '">\
                    <input type="button" class="adivina-Button" value="' + msgs.msgMoveOne + '" id="adivinaBtnMoveOn-' + instance + '">\
                    <label class="sr-av">' + msgs.msgIndicateWord + ':</label><input type="text" value="" class="adivina-EdReply" id="adivinaEdAnswer-' + instance + '" autocomplete="false">\
                    <input type="button" class="adivina-Button" value="' + msgs.msgReply + '" id="adivinaBtnReply-' + instance + '">\
                </div>\
            </div>\
            <div class="adivina-CodeAccessDiv" id="adivinaCodeAccessDiv-' + instance + '">\
                <div class="adivina-MessageCodeAccessE" id="adivinaMesajeAccesCodeE-' + instance + '"></div>\
                <div class="adivina-DataCodeAccessE">\
                    <label>' + msgs.msgCodeAccess + ':</label><input type="text" class="adivina-CodeAccessE" id="adivinaCodeAccessE-' + instance + '">\
                    <input type="button" class="adivina-CodeAccessButton" id="adivinaCodeAccessButton-' + instance + '" value="' + msgs.msgSubmit + '"/>\
                </div>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        var butonScore = "";
        var fB = '<div class="adivina-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="adivina-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="adivinaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="adivina-RepeatActivity" id="adivinaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        }else if (mOptions.isScorm == 1) {
			if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
				this.hasSCORMbutton = true;
                fB += '<div class="adivina-GetScore">';
                fB += '<p><span class="adivina-RepeatActivity" id="adivinaRepeatActivity-' + instance + '"></span></p>';
				fB += '</div>';
				butonScore = fB;
			}
		}
        fB = +'</div>';
        return butonScore;
    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeAdivina.options[instance],
            message = ''
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
    drawPhrase: function (phrase, definition, nivel, type, instance) {
        $('#adivina-Phrase-' + instance).find('.adivina-Word').remove();
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
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
                $('<div class="adivina-Word"></div>').appendTo('#adivina-Phrase-' + instance);
                for (var j = 0; j < cleanWord.length; j++) {
                    var letter = '<div class="adivina-Letter blue">' + cleanWord[j] + '</div>';
                    if (type == 1) {
                        letter = '<div class="adivina-Letter red">' + cleanWord[j] + '</div>';
                    } else if (type == 2) {
                        letter = '<div class="adivina-Letter green">' + cleanWord[j] + '</div>';
                    }
                    $('#adivina-Phrase-' + instance).find('.adivina-Word').last().append(letter);
                }
            }
        }
        $('#adivinaDefinition-' + instance).text(definition);
        return cPhrase;
    },
    clear: function (phrase) {
        return phrase.replace(/[&\s\n\r]+/g, " ").trim().toUpperCase();
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
        $eXeAdivina.changeTextInit(true, mOptions.msgs.msgStartGame, instance, mOptions.msgs);
        $('#adivinaEdAnswer-' + instance).val("");
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
        $('#adivinaGamerOver-' + instance).hide();
        $('#adivinaCodeAccessDiv-' + instance).hide();
        $('#adivinaDefinition-' + instance).show();
        $('#adivinaBtnMoveOn-' + instance).on('click', function () {
            $eXeAdivina.newQuestion(instance)
        });
        document.onfullscreenchange = function (event) {
            var id = event.target.id.split('-')[1];
            $eXeAdivina.refreshImageActive(id)
        };
        $('#adivinaBtnReply-' + instance).on('click', function () {
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
        mOptions.livesLeft = mOptions.numberLives;
        $eXeAdivina.updateLives(instance);
        if (mOptions.itinerary.showCodeAccess) {
            $('#adivinaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#adivinaCodeAccessDiv-' + instance).show();
            $('#adivinaDefinition-' + instance).hide();
            $('#adivinaQuestion-' + instance).hide();
        }
        if (!mOptions.useLives) {
            $('#adivinaLifesGame-' + instance).hide();
            $('#adivinaNumberLivesGame-' + instance).hide();
        }
        $('#adivinaCodeAccessButton-' + instance).on('click touchstart', function (e) {
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
        $('#adivinaDefinition-' + instance).on('click', 'a', function (e) {
            e.preventDefault();
            $eXeAdivina.startGame(instance);

        });
        if (mOptions.isScorm >0) {
            $eXeAdivina.updateScorm($eXeAdivina.previousScore, mOptions.repeatActivity, instance);
        }
        $('#adivinaInstructions-' + instance).text(mOptions.instructions);
        $('#adivinaSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeAdivina.sendScore(instance, false);
        });
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.itinerary.codeAccess == $('#adivinaCodeAccessE-' + instance).val()) {
            $('#adivinaDefinition-' + instance).show();
            $('#adivinaCodeAccessDiv-' + instance).hide();
            $('#adivinaQuestion-' + instance).show();
            $eXeAdivina.startGame(instance);
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
        $("#adivinaDivResponder-" + instance).show();
        $("#adivinaDivInstructions-"+instance).hide();
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
        mOptions.wordsGame = mOptions.optionsRamdon ? $eXeAdivina.shuffleAds(mOptions.wordsGame) : mOptions.wordsGame;
        $eXeAdivina.updateLives(instance);
        $eXeAdivina.changeTextInit(false, '', instance,mOptions.msgs);
        mOptions.obtainedClue = false;
        $('#adivinaPShowClue-' + instance).text('');
        $('#adivinaGamerOver-' + instance).hide();
        $('#adivinaPNumber-' + instance).text(mOptions.numberQuestions);
        $('#adivinaPHits-' + instance).text(mOptions.hits);
        $('#adivinaPErrors-' + instance).text(mOptions.errors);
        $('#adivinaPScore-' + instance).text(mOptions.score);
        mOptions.counter = mOptions.timeQuestion;
        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeAdivina.uptateTime(mOptions.counter, instance);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    var timeShowSolution = 1000;
                    if (mOptions.showSolution) {
                        timeShowSolution = mOptions.timeShowSolution * 1000;
                        var question = mOptions.wordsGame[mOptions.activeQuestion];
                        $eXeAdivina.drawPhrase(question.word, question.definition, 100, 1, instance)
                    }
                    setTimeout(function () {
                        $eXeAdivina.newQuestion(instance)
                    }, timeShowSolution);
                    return;
                }
            }

        }, 1000);
        $eXeAdivina.uptateTime(mOptions.timeQuestion, instance);
        mOptions.gameStarted = true;
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
        clearInterval(mOptions.counterClock);
        $('#adivina-Phrase-' + instance).find('.adivina-Word').hide();
        $('#adivinaEdAnswer-' + instance).val('');
        $eXeAdivina.showScoreGame(type, instance);
        $eXeAdivina.changeTextInit(true, mOptions.msgs.msgNewGame, instance,mOptions.msgs);
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeAdivina.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeAdivina.sendScore(instance, true);
                $('#adivinaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeAdivina.initialScore = score;
            }
        }
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeAdivina.options[instance],
            msgs = mOptions.msgs,
            $adivinaHistGGame = $('#adivinaHistGGame-' + instance),
            $adivinaLostGGame = $('#adivinaLostGGame-' + instance),
            $adivinaOverPoint = $('#adivinaOverScore-' + instance),
            $adivinaOverHits = $('#adivinaOverHits-' + instance),
            $adivinaOverErrors = $('#adivinaOverErrors-' + instance),
            $adivinaTextClueGGame = $('#adivinaTextClueGGame-' + instance),
            $adivinaGamerOver = $('#adivinaGamerOver-' + instance),
            message = "",
            messageColor=1;
        $adivinaHistGGame.hide();
        $adivinaLostGGame.hide();
        $adivinaOverPoint.show();
        $adivinaOverHits.show();
        $adivinaOverErrors.show();
        $adivinaTextClueGGame.hide();
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.mgsAllQuestions;
                messageColor=2;
                $adivinaHistGGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#adivinaPShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        $adivinaTextClueGGame.text(text);
                    } else {
                        $adivinaTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                    }
                    $adivinaTextClueGGame.show();
                }
                break;
            case 1:
                message = msgs.msgLostLives;
                $adivinaLostGGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#adivinaPShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        $adivinaTextClueGGame.text(text);
                    } else {
                        $adivinaTextClueGGame.text(msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue));
                    }
                    $adivinaTextClueGGame.show();
                }
                break;
            default:
                break;
        }
        $eXeAdivina.showMessage(messageColor, message, instance);
        $adivinaOverPoint.text(msgs.msgScore + ': ' + mOptions.score);
        $adivinaOverHits.text(msgs.msgHits + ': ' + mOptions.hits);
        $adivinaOverErrors.text(msgs.msgErrors + ': ' + mOptions.errors);
        $adivinaGamerOver.show();
        $('#adivinaPShowClue-' + instance).text('');
    },
    changeTextInit: function (big, message, instance, msgs) {
		var html = message;
		if (big) {
			var msg = '';
			if (msgs) {
				if (msgs.msgWrote && msgs.msgWrote!="") msg = msgs.msgWrote;
			}
			html = '<a href="#">' + message + '</a>';
			var instructions = $("#adivinaDivInstructions-"+instance);
			var answerForm = $("#adivinaDivResponder-" + instance);
			if (instructions.length==0){
				answerForm.before('<p class="adivinaDivInstructions" id="adivinaDivInstructions-'+instance+'">'+msg+'</p>').hide();
			} else {
				instructions.show();
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
        var mQuestion = $eXeAdivina.options[instance].wordsGame[i];
        $eXeAdivina.options[instance].gameActived = true;
        $eXeAdivina.showMessage(0, '', 0);
        $eXeAdivina.showMessage(0, '', 0);
        $('#adivina-Phrase-' + instance).find('.adivina-Letter').css('color', $eXeAdivina.borderColors.blue);
        $eXeAdivina.drawPhrase(mQuestion.word, mQuestion.definition, $eXeAdivina.options[instance].percentageShow, 0, instance);
        $('#adivinaEdAnswer-' + instance).val("");
        $('#adivinaBtnReply-' + instance).prop('disabled', false);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', false);
        $('#adivinaEdAnswer-' + instance).prop('disabled', false);
        $eXeAdivina.showImage(mQuestion.url, mQuestion.x, mQuestion.y, mQuestion.author, mQuestion.alt, instance)
        $('#adivinaEdAnswer-' + instance).focus();

    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeAdivina.options[instance];
        if (mOptions.gameStarted) {
            var q = mOptions.wordsGame[mOptions.activeQuestion];
            $eXeAdivina.showImage(q.url, q.x, q.y, q.author, q.alt, instance);
        } else {
            $eXeAdivina.showImage("", 0, 0, '', '', instance);
        }


    },
    showImage: function (url, x, y, author, alt, instance) {
        var $cursor = $('#adivinaCursor-' + instance),
            $noImage = $('#adivinaNoImage-' + instance),
            $Image = $('#adivinaImage-' + instance),
            $Author = $('#adivinaPAuthor-' + instance);
        if ($.trim(url).length == 0) {
            $cursor.hide();
            $Image.hide();
            $noImage.show();
            $Author.text('');
            return false;
        };
        $Image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $cursor.hide();
                    $Image.hide();
                    $Image.attr('alt', $eXeAdivina.options[instance].msgs.msgNoImage);
                    $noImage.show();
                    $Author.text('');
                    return false;
                } else {
                    var mData = $eXeAdivina.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeAdivina.drawImage(this, mData);
                    $Image.show();
                    $cursor.hide();
                    $noImage.hide();
                    $Author.text(author);
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
                $Author.text('');
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
                'z-index': 30000
            });
            $(cursor).show();
        }
    },
    updateLives:function (instance) {
    	var mOptions=$eXeAdivina.options[instance];
        $('#adivinaPLifes-' + instance).text(mOptions.livesLeft);
        $('#adivinaLifesGame-' + instance).find('.exeQuextIcons-Life').each(function (index) {
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
            mOptions.counter = mOptions.timeQuestion;
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
        var mOptions = $eXeAdivina.options[instance];
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
            answord = $.trim($('#adivinaEdAnswer-' + instance).val().toUpperCase());
        if (answord.length == 0) {
            $eXeAdivina.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
            return;
        }
        $('#adivinaBtnReply-' + instance).prop('disabled', true);
        $('#adivinaBtnMoveOn-' + instance).prop('disabled', true);
        $('#adivinaEdAnswer-' + instance).prop('disabled', true);
        if (!mOptions.gameActived) {
            return;
        }
        var answord = $.trim($('#adivinaEdAnswer-' + instance).val().toUpperCase());
        if (answord.length == 0) {
            $eXeAdivina.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
            return;
        }
        mOptions.gameActived = false;
        var solution = $.trim(question.word).toUpperCase(),
            type = $eXeAdivina.updateScore(solution == answord, instance),
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
            $eXeAdivina.drawPhrase(question.word, question.definition, 100, type, instance)
        }
        setTimeout(function () {
            $eXeAdivina.newQuestion(instance)
        }, timeShowSolution);
    },

    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeAdivina.options[instance],
            message = "",
            obtainedPoints = 0,
            type = 1,
            msgs = mOptions.msgs;
        if (correctAnswer) {
            mOptions.hits++
            var pointsTemp = mOptions.counter < 60 ? mOptions.counter * 10 : 60;
            obtainedPoints = 1000 + pointsTemp;
            message = $eXeAdivina.getRetroFeedMessages(obtainedPoints > 0, instance) + ' ' + obtainedPoints + ' puntos';
            type = 2;

        } else {
            mOptions.errors++;
            obtainedPoints = -330;
            message = ' ' + msgs.msgLoseT;
            if (mOptions.useLives) {
                mOptions.livesLeft--;
                $eXeAdivina.updateLives(instance);
                message = ' ' + msgs.msgLoseLive;
            }
            message = $eXeAdivina.getRetroFeedMessages(obtainedPoints > 0, instance) + message;
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        $('#adivinaPScore-' + instance).text(mOptions.score);
        $('#adivinaPHits-' + instance).text(mOptions.hits);
        $('#adivinaPErrors-' + instance).text(mOptions.errors);
        $eXeAdivina.showMessage(type, message, instance);
        return type;

    },
    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeAdivina.borderColors.red, $eXeAdivina.borderColors.green, $eXeAdivina.borderColors.blue, $eXeAdivina.borderColors.yellow],
            weight = type == 0 ? 'normal' : 'bold',
            fontsize = type == 0 ? '14px' : '14px',
            color = colors[type];
        $('#adivinaPAuthor-' + instance).text(message);
        $('#adivinaPAuthor-' + instance).css({
            'color': color,
            'font-weight': weight,
            'font-size': fontsize
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
}
$(function () {


    $eXeAdivina.init();
});