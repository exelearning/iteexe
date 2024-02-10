/**
 * ordena activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeOrdena = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#3334a1',
        green: '#006641',
        red: '#a2241a',
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#3334a1',
        green: '#006641',
        red: '#a2241a',
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
        this.activities = $('.ordena-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeOrdena.supportedBrowser('ordena')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Order') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/ordena-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();

    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeOrdena.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeOrdena.enable()');
        else this.enable();
        $eXeOrdena.mScorm = scorm;
        var callSucceeded = $eXeOrdena.mScorm.init();
        if (callSucceeded) {
            $eXeOrdena.userName = $eXeOrdena.getUserName();
            $eXeOrdena.previousScore = $eXeOrdena.getPreviousScore();
            $eXeOrdena.mScorm.set("cmi.core.score.max", 10);
            $eXeOrdena.mScorm.set("cmi.core.score.min", 0);
            $eXeOrdena.initialScore = $eXeOrdena.previousScore;
        }
    },
    getFixedOrder: function (columns, cards) {

        if (cards > 0) {
            var rept = 0;
            var end = 0;
            var arraynum = [];
            var max = cards - columns;
            while (rept != -1) {
                for (var i = 0; i <= max; i++) {
                    var numaleatorio = Math.floor(Math.random() * (max));
                    if (arraynum.indexOf(numaleatorio) < 0) {
                        arraynum.push(numaleatorio);
                        end++;
                    }
                    end == max ? rept = -1 : false;
                }
            }
        }
        var arraybas = [];
        for (var i = 0; i < columns; i++) {
            arraybas.push(i)
        }
        for (var j = 0; j < arraynum.length; j++) {
            arraynum[j] += columns
        }
        var array = arraybas.concat(arraynum)

        return array
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeOrdena.options[instance],
            text = '';
        $('#ordenaSendScore-' + instance).hide();
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
            $('#ordenaSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#ordenaSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#ordenaRepeatActivity-' + instance).text(text);
        $('#ordenaRepeatActivity-' + instance).fadeIn(1000);
    },
    getUserName: function () {
        var user = $eXeOrdena.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeOrdena.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeOrdena.mScorm.quit();
    },
    enable: function () {
        $eXeOrdena.loadGame();
    },
    loadGame: function () {
        $eXeOrdena.options = [];
        $eXeOrdena.activities.each(function (i) {
            var dl = $(".ordena-DataGame", this),
                mOption = $eXeOrdena.loadDataGame(dl, this),
                msg = mOption.msgs.msgPlayStart;
            $eXeOrdena.options.push(mOption);
            var ordena = $eXeOrdena.createInterfaceOrdena(i);
            dl.before(ordena).remove();
            $('#ordenaGameMinimize-' + i).hide();
            $('#ordenaGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#ordenaGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#ordenaGameContainer-' + i).show();
            }
            $('#ordenaDivFeedBack-' + i).prepend($('.ordena-feedback-game', this));
            $eXeOrdena.showPhrase(0, i);
            $eXeOrdena.addEvents(i);
            $('#ordenaDivFeedBack-' + i).hide();
            if(mOption.type == 0){
                $('#ordenaPhrasesContainer-'+i).hide();
            }
            if (mOption.startAutomatically || (mOption.type == 0 && mOption.time==0)) {
                $('#ordenaStartGame-' + i).click();
            }
            

        });
        if ($eXeOrdena.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeOrdena.loadMathJax();
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
    getPhraseDefault: function () {
        var q = new Object();
        q.cards = [];
        q.msgError = '';
        q.msgHit = '';
        q.definition = '';
        q.phrase='';
        return q;
    },

    getCardDefault: function () {
        var p = new Object();
        p.id = "";
        p.type = 0;
        p.url = '';
        p.audio = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        p.eText = '';
        p.color = '#000000';
        p.backcolor = "#ffffff";
        return p;
    },


    loadDataGame: function (data, sthis) {
        var json = data.text();
        json = $eXeOrdena.Decrypt(json);
        var mOptions = $eXeOrdena.isJsonString(json),
            $audiosDef = $('.ordena-LinkAudiosDef', sthis),
            $audiosError = $('.ordena-LinkAudiosError', sthis),
            $audiosHit = $('.ordena-LinkAudiosHit', sthis),
            hasLatex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeOrdena.hasLATEX = true;
        }
        mOptions.playerAudio = "";
        for (var i = 0; i < mOptions.phrasesGame.length; i++) {
            var $imagesLink = $('.ordena-LinkImages-' + i, sthis),
                $audiosLink = $('.ordena-LinkAudios-' + i, sthis),
                cards = mOptions.phrasesGame[i].cards;
            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < cards.length) {
                    cards[iq].url = $(this).attr('href');
                    if (cards[iq].url < 4) {
                        cards[iq].url = "";
                    }
                }
            });
            $audiosLink.each(function () {
                var iqa = parseInt($(this).text());
                if (!isNaN(iqa) && iqa < cards.length) {
                    cards[iqa].audio = $(this).attr('href');
                    if (cards[iqa].audio.length < 4) {
                        cards[iqa].audio = "";
                    }
                }
            });
            mOptions.phrasesGame[i].phrase= typeof mOptions.phrasesGame[i].phrase=="undefined"?'':mOptions.phrasesGame[i].phrase;
            for (var j = 0; j < cards.length; j++) {
                cards[j].type = 0
                if (cards[j].url.length > 4 && cards[j].eText.trim().length > 0) {
                    cards[j].type = 2
                } else if (cards[j].url.length > 4) {
                    cards[j].type = 0
                } else if (cards[j].eText.trim().length > 0) {
                    cards[j].type = 1
                }
                cards[j].order = j;
            }

        }
        $audiosDef.each(function () {
            var iqa = parseInt($(this).text());
            if (!isNaN(iqa) && iqa < mOptions.phrasesGame.length) {
                mOptions.phrasesGame[iqa].audioDefinition = $(this).attr('href');
                if (mOptions.phrasesGame[iqa].audioDefinition.length < 4) {
                    mOptions.phrasesGame[iqa].audioDefinition = "";
                }
            }
        });
        $audiosError.each(function () {
            var iqa = parseInt($(this).text());
            if (!isNaN(iqa) && iqa < mOptions.phrasesGame.length) {
                mOptions.phrasesGame[iqa].audioError = $(this).attr('href');
                if (mOptions.phrasesGame[iqa].audioError.length < 4) {
                    mOptions.phrasesGame[iqa].audioError = "";
                }
            }
        });
        $audiosHit.each(function () {
            var iqa = parseInt($(this).text());
            if (!isNaN(iqa) && iqa < mOptions.phrasesGame.length) {
                mOptions.phrasesGame[iqa].audioHit = $(this).attr('href');
                if (mOptions.phrasesGame[iqa].audioHit.length < 4) {
                    mOptions.phrasesGame[iqa].audioHit = "";
                }
            }
        });
        
        mOptions.active = 0;
        mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
        mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? '' : mOptions.evaluationID;
        mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
        mOptions.type = typeof mOptions.type == "undefined" ? 1 : mOptions.type;
        mOptions.allPhrases = $.extend(true, {}, mOptions.phrasesGame);
        mOptions.phrasesGame = $eXeOrdena.getQuestions(mOptions.phrasesGame, mOptions.percentajeQuestions);
        mOptions.phrasesGame = $eXeOrdena.shuffleAds(mOptions.phrasesGame);
        mOptions.numberQuestions = mOptions.phrasesGame.length;
        mOptions.gameColumns = typeof mOptions.startAutomatically == "undefined" ? false : mOptions.gameColumns;
        mOptions.maxWidth = typeof mOptions.maxWidth == "undefined" ? false : mOptions.maxWidth;
        mOptions.cardHeight = typeof mOptions.cardHeight == "undefined" ? 0 : mOptions.cardHeight;
        mOptions.startAutomatically = typeof mOptions.startAutomatically == "undefined" ? false : mOptions.startAutomatically;
        mOptions.orderedColumns = typeof mOptions.orderedColumns == "undefined" ? false : mOptions.orderedColumns;
        mOptions.orderedColumns = mOptions.gameColumns < 2 ? false : mOptions.orderedColumns;
        mOptions.fullscreen = false;
        mOptions.numberQuestions = mOptions.phrasesGame.length;
        mOptions.hits = 0;
        return mOptions;

    },



    showPhrase: function (num, instance) {
        var mOptions = $eXeOrdena.options[instance],
            pc = '.ODNP-CardDraw';
        mOptions.active = num;
        mOptions.phrase = mOptions.phrasesGame[num];
        if(mOptions.type == 0){
            $eXeOrdena.showPhraseText(num, instance)
            return;
        }
        $eXeOrdena.randomPhrase(instance);
        $eXeOrdena.stopSound(instance);
        $eXeOrdena.addCards(mOptions.phrase.cards, instance);
        $eXeOrdena.initCards(instance);
        if (num > 0) {
            $('#ordenaMultimedia-' + instance).find('.ODNP-Card1').addClass('flipped');
            $eXeOrdena.showMessage(0, mOptions.phrase.definition, instance);
            if (typeof mOptions.phrase.audioDefinition != "undefined" && mOptions.phrase.audioDefinition.length > 4) {
                $eXeOrdena.playSound(mOptions.phrase.audioDefinition, instance);
            }
        }

        $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').off();
        $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').each(function () {
            var $this = $(this);
            if (mOptions.orderedColumns) {
                var ord = parseInt($this.data('order'))
                if (ord < mOptions.gameColumns) {
                    $this.css('cursor', 'default');
                    return;
                }
            }
            $this.css('cursor', 'pointer');
            $this.draggable({
                revert: true,
                placeholder: false,
                droptarget: pc,
                drop: function (evt, droptarget) {
                    $eXeOrdena.moveCard($(this), droptarget, instance)
                },
            });
        });
        $('#ordenaMultimedia-' + instance).find('.ODNP-Card1').on('mousedown touchstart', function (event) {
            event.preventDefault();
            if (mOptions.gameStarted) {
                $eXeOrdena.checkAudio(this, instance);
            }
        });

    },
    randomPhrase: function (instance) {
        var mOptions = $eXeOrdena.options[instance];
        if (mOptions.orderedColumns) {
            var order = $eXeOrdena.getFixedOrder(mOptions.gameColumns, mOptions.phrase.cards.length);
            var pcards = [];
            for (var i = 0; i < mOptions.phrase.cards.length; i++) {
                pcards.push(mOptions.phrase.cards[order[i]])
            }
            mOptions.phrase.cards = pcards;
        } else {
            mOptions.phrase.cards = $eXeOrdena.shuffleAds(mOptions.phrase.cards);
        }
    },
    moveCard: function ($item, target, instance) {
        var mOptions = $eXeOrdena.options[instance];
        if (!mOptions.gameStarted || mOptions.gameOver) {
            return;
        }

        var $save = $item.prev('.ODNP-CardDraw');
        if (mOptions.orderedColumns) {
            var ord = parseInt($(target).data('order'))
            if (ord < mOptions.gameColumns) {
                return;
            }
        }
        if ($save.data('order') == $(target).data('order')) {
            $item.insertBefore(target);
        } else {
            $item.insertAfter(target);
            if ($save) {
                $(target).insertAfter($save);
            } else {
                $('#ordenaMultimedia-' + instance).append($(target))
            }
        }

        $('#ordenaMultimedia-' + instance).find('.ODNP-Card1').removeClass("ODNP-CardOK ODNP-CardKO");
        $('#ordenaValidatePhrase-' + instance).show();
        $('#ordenaHistsGame-' + instance).text('');
        var html = $('#ordenaMultimedia-' + instance).html(),
            latex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeOrdena.updateLatex('ordenaMultimedia-' + instance)
        }

    },

    checkPhrase: function (instance) {
        var correct = true,
            valids = [];
        $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').each(function (i) {
            var order = parseInt($(this).data('order'));
            if (i != order) {
                correct = false;
            } else {
                valids.push(i);
            }

        });
        return {
            'correct': correct,
            'valids': valids
        };
    },

    checkPhraseColumns: function (instance) {

        var mOptions = $eXeOrdena.options[instance],
            correct = true,
            valids = [],
            validsPos = $eXeOrdena.getPostionsColumns(mOptions.gameColumns, mOptions.phrase.cards.length);
        $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').each(function (i) {
            if (i >= mOptions.gameColumns) {
                var order = parseInt($(this).data('order')),
                    number = i,
                    col = number % mOptions.gameColumns;
                if (validsPos[col].indexOf(order) == -1) {
                    correct = false;

                } else {
                    valids.push(order);
                }
            }
        });
        return {
            'correct': correct,
            'valids': valids
        };
    },

    getPostionsColumns: function (columns, nuncards) {
        var positions = [],
            rows = Math.floor(nuncards / columns);
        for (var i = 0; i < columns; i++) {
            var column = [];
            for (var j = 0; j < rows; j++) {
                column.push((i + (j * columns)))
            }
            positions.push(column);
        }
        return positions;
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
                array = $eXeOrdena.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
        var mOptions = $eXeOrdena.options[instance];
        $eXeOrdena.stopSound(instance);
        selectedFile = $eXeOrdena.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
        mOptions.playerAudio.play().catch(error => console.error("Error playing audio:", error));
    },

    stopSound: function (instance) {
        var mOptions = $eXeOrdena.options[instance];
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
    createInterfaceOrdena: function (instance) {
        var html = '',
            path = $eXeOrdena.idevicePath,
            msgs = $eXeOrdena.options[instance].msgs,
            html = '';
        html += '<div class="ODNP-MainContainer" id="ordenaMainContainer-'+instance+'">\
        <div class="ODNP-GameMinimize" id="ordenaGameMinimize-' + instance + '">\
            <a href="#" class="ODNP-LinkMaximize" id="ordenaLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'ordenaIcon.png"  class="ODNP-IconMinimize ODNP-Activo"  alt="">\
            <div class="ODNP-MessageMaximize" id="ordenaMessageMaximize-' + instance + '">' + msgs.msgPlayStart + '</div>\
            </a>\
        </div>\
        <div class="ODNP-GameContainer" id="ordenaGameContainer-' + instance + '">\
            <div class="ODNP-GameScoreBoard" id="ordenaGameScoreBoard-' + instance + '">\
                <div class="ODNP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number"  id="ordenaPNumberIcon-' + instance + '" title="' + msgs.msgNumbersAttemps + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumbersAttemps + ': </span><span id="ordenaPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumbersAttemps + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="ordenaPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="ordenaPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" id="ordenaPScoreIcon-' + instance + '" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="ordenaPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="Ordenabre-Info" id="ordenaInfo-' + instance + '"></div>\
                <div class="ODNP-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
					<div class="exeQuextIcons  exeQuextIcons-Time" id="ordenaImgTime-' + instance + '" title="' + msgs.msgTime + '"></div>\
                    <p  id="ordenaPTime-' + instance + '" class="ODNP-PTime">00:00</p>\
                    <a href="#" class="ODNP-LinkMinimize" id="ordenaLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  ODNP-Activo"></div>\
                    </a>\
                    <a href="#" class="ODNP-LinkFullScreen" id="ordenaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  ODNP-Activo" id="ordenaFullScreen-' + instance + '"></div>\
                    </a>\
				</div>\
            </div>\
            <div class="ODNP-Information">\
                <p class="ODNP-Message" id="ordenaMessage-' + instance + '"></p>\
                <a href="#" id="ordenaStartGame-' + instance + '">' + msgs.msgPlayStart + '</a>\
            </div>\
            <div class="ODNP-GameButton" id="ordenaGameButtons-' + instance + '">\
                    <p  class="ODNP-MessageDonw" id="ordenaHistsGame-' + instance + '"></p>\
                    <a href="#" id="ordenaValidatePhrase-' + instance + '" title="' + msgs.msgCheck + '">' + msgs.msgCheck + '</a>\
                    <a href="#" id="ordenaNextPhrase-' + instance + '" title="' + msgs.msgNextPhrase + '">' + msgs.msgNextPhrase + '</a>\
            </div>\
            <div class="ODNP-Multimedia" id="ordenaMultimedia-' + instance + '"></div>\
            <div class="ODNP-Tarjet" id="ordenaPhrasesContainer-' + instance + '"></div>\
            <div class="ODNP-Cubierta" id="ordenaCubierta-' + instance + '">\
                <div class="ODNP-GameOverExt" id="ordenaGameOver-' + instance + '">\
                    <div class="ODNP-StartGame" id="ordenaMesasgeEnd-' + instance + '"></div>\
                    <div class="ODNP-GameOver">\
                        <div class="ODNP-DataImage">\
                            <img src="' + path + 'exequextwon.png" class="ODNP-HistGGame" id="ordenaHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                            <img src="' + path + 'exequextlost.png" class="ODNP-LostGGame" id="ordenaLostGame-' + instance + '"  alt="' + msgs.msgTimeOver + '" />\
                        </div>\
                        <div class="ODNP-DataScore">\
                            <p id="ordenaOverNumCards-' + instance + '"></p>\
                            <p id="ordenaOverAttemps-' + instance + '"></p>\
                            <p id="ordenaOverHits-' + instance + '"></p>\
                        </div>\
                    </div>\
                    <div class="ODNP-StartGame"><a href="#" id="ordenaStartGameEnd-' + instance + '">' + msgs.msgPlayAgain + '</a></div>\
                </div>\
                <div class="ODNP-CodeAccessDiv" id="ordenaCodeAccessDiv-' + instance + '">\
                    <div class="ODNP-MessageCodeAccessE" id="ordenaMesajeAccesCodeE-' + instance + '"></div>\
                    <div class="ODNP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="ODNP-CodeAccessE" id="ordenaCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="ordenaCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                        <div class="exeQuextIcons-Submit ODNP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="ODNP-ShowClue" id="ordenaShowClue-' + instance + '">\
                    <p class="sr-av">' + msgs.msgClue + '</p>\
                    <p class="ODNP-PShowClue" id="ordenaPShowClue-' + instance + '"></p>\
                    <a href="#" class="ODNP-ClueBotton" id="ordenaClueButton-' + instance + '" title="' + msgs.msgContinue + '">' + msgs.msgContinue + ' </a>\
                </div>\
            </div>\
            <div class="ODNP-DivFeedBack" id="ordenaDivFeedBack-' + instance + '">\
                <input type="button" id="ordenaFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
            <div class="ODNP-AuthorGame" id="ordenaAuthorGame-' + instance + '"></div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);

        return html;
    },

    addButtonScore: function (instance) {
        var mOptions = $eXeOrdena.options[instance];
        var butonScore = "";
        var fB = '<div class="ODNP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="ODNP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="ordenaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="ODNP-RepeatActivity" id="ordenaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="ODNP-GetScore">';
                fB += '<p><span class="ODNP-RepeatActivity" id="ordenaRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    updateEvaluationIcon: function (instance) {
        var mOptions =  $eXeOrdena.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data =  $eXeOrdena.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                 $eXeOrdena.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
             $eXeOrdena.showEvaluationIcon(instance, state, score);
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#ordenaMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');
        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions =  $eXeOrdena.options[instance];
        var $header = $('#ordenaGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%S', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%S', score);
        }
        $('#ordenaEvaluationIcon-' + instance).remove();
        var sicon = '<div id="ordenaEvaluationIcon-' + instance + '" class="ODNP-EvaluationDivIcon"><img  src="' +  $eXeOrdena.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#ordenaEvaluationIcon-' + instance).find('span').eq(0).text(alt)
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

    saveEvaluation: function (instance) {
        var mOptions =  $eXeOrdena.options[instance],
            score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#ordenaGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text();
            var formattedDate =  $eXeOrdena.getDateString();
            var scorm = {
                'id': mOptions.id,
                'type': mOptions.msgs.msgTypeGame,
                'node': node,
                'name': name,
                'score': score,
                'date': formattedDate,
                'state': (parseFloat(score) >= 5 ? 2 : 1)
            }
            var data =  $eXeOrdena.getDataStorage(mOptions.evaluationID);
            data =  $eXeOrdena.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeOrdena.showEvaluationIcon(instance, scorm.state, scorm.score)
        }
    },
    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data =  $eXeOrdena.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeOrdena.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.phrasesGame.length).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeOrdena.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.repeatActivity && $eXeOrdena.previousScore !== '') {
                        message = $eXeOrdena.userName !== '' ? $eXeOrdena.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeOrdena.previousScore = score;
                        $eXeOrdena.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeOrdena.userName !== '' ? $eXeOrdena.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#ordenaSendScore-' + instance).hide();
                        }
                        $('#ordenaRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#ordenaRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeOrdena.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeOrdena.mScorm.set("cmi.core.score.raw", score);
                    $('#ordenaRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#ordenaRepeatActivity-' + instance).show();
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
    addCards: function (cardsGame, instance, ) {
        var cards = "";
        $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').remove();
        for (var i = 0; i < cardsGame.length; i++) {
            var card = $eXeOrdena.createCard(i, cardsGame[i].type, cardsGame[i].url, cardsGame[i].eText, cardsGame[i].audio, cardsGame[i].x, cardsGame[i].y, cardsGame[i].alt, cardsGame[i].color, cardsGame[i].backcolor, cardsGame[i].order, instance)
            cards += card;
        }
        $('#ordenaMultimedia-' + instance).append(cards);
        $eXeOrdena.setSize(instance);
    },

    showPhraseText: function (num, instance) {
        var mOptions = $eXeOrdena.options[instance];
        mOptions.phrase = mOptions.phrasesGame[num];
        mOptions.correctOrder = mOptions.phrase.phrase.split(' ');
        var words=[];
        for (var i= 0;i <mOptions.correctOrder.length ; i++){
         var word ={
             'text': mOptions.correctOrder[i],
             'order': i
         }
         words.push(word)
        }
        var shuffledWords = [...words].sort(() => Math.random() - 0.5);
        $eXeOrdena.stopSound(instance);
        $eXeOrdena.addCardsPhrase(shuffledWords, instance);
        $('#ordenaPhrasesContainer-' + instance).find('.ODNP-Word').draggable({
            revert: true,
            droptarget: '.ODNP-WordTarget',
            drop: function (evt, target) {
               mOptions.lastDropped = target;
               $('#ordenaPhrasesContainer-' + instance).find('.ODNP-Word').removeClass('ODNP-WordCorrect')
               $('#ordenaValidatePhrase-' + instance).show();
               $('#ordenaHistsGame-' + instance).text('');
            },
        });
        $('#ordenaPhrasesContainer-' + instance).find('.ODNP-WordTarget').droppable({
              drop: function (evt, draggable) {
                $(this).removeClass("ODNP-WordActive");
                if (mOptions.lastDropped) {
                    var tempHTML = $(draggable).html();
                    $(draggable).html($(mOptions.lastDropped).html());
                    $(mOptions.lastDropped).html(tempHTML);
                  }
            },
        });
     },

    addCardsPhrase: function (words, instance, ) {
        var cards = "";
        $('#ordenaPhrasesContainer-' + instance).find('.ODNP-Word').remove();
        for (var i = 0; i < words.length; i++) {
            var card = $eXeOrdena.createCardPhrase(i, words[i].text, words[i].order, instance)
            cards += card;
        }
        $('#ordenaPhrasesContainer-' + instance).append(cards);

    },
    createCardPhrase: function (j,text, order, instance) {
        return '<div class="ODNP-Word ODNP-WordTarget" data-number="' + j + '" data-order="' + order + '" >' + text + '</div>';
    },

    moveCardPharse: function ($item, target, instance) {
        var mOptions = $eXeOrdena.options[instance];
        if (!mOptions.gameStarted || mOptions.gameOver) {
            return;
        }

        var $save = $item.prev('.ODNP-Word');
        if ($save.data('order') == $(target).data('order')) {
            $item.insertBefore(target);
        } else {
            $item.insertAfter(target);
            if ($save) {
                $(target).insertAfter($save);
            } else {
                $('#ordenaPhrasesContainer-' + instance).append($(target))
            }
        }
        $('#ordenaValidatePhrase-' + instance).show();
        $('#ordenaHistsGame-' + instance).text('');

    },

    createCard: function (j, type, url, text, audio, x, y, alt, color, backcolor, order, instance) {
        var malt = alt || '',
            saudio = "";
        if (url.trim().length > 0 && text.trim() > 0) {
            saudio = '<a href="#" data-audio="' + audio + '" class="ODNP-LinkAudio"  title="Audio"><img src="' + $eXeOrdena.idevicePath + 'exequextplayaudio.svg" class="ODNP-Audio"  alt="Audio"></a>';
        } else {
            saudio = '<a href="#" data-audio="' + audio + '" class="ODNP-LinkAudio"  title="Audio"><img src="' + $eXeOrdena.idevicePath + 'exequextplayaudio.svg" class="ODNP-Audio"  alt="Audio"></a>'
        }
        var card = '<div id="ordenaCardDraw-' + instance + '-' + j + '" class="ODNP-CardDraw ODNP-CC-' + j + '" data-number="' + j + '" data-order="' + order + '"  data-type="' + type + '" data-state="-1">\
            <div class="ODNP-CardContainer" >\
                    <div class="ODNP-Card1" data-type="' + type + '" data-state="-1" data-valid="0">\
                        <div class="ODNP-CardFront">\
                        </div>\
                        <div class="ODNP-CardBack">\
                            <div class="ODNP-ImageContain">\
                               <img src="" class="ODNP-Image" data-url="' + url + '" data-x="' + x + '" data-y="' + y + '" alt="' + malt + '" />\
                             <img class="ODNP-Cursor" src="' + $eXeOrdena.idevicePath + 'exequextcursor.gif" alt="" />\
                            </div>\
                            <div class="ODNP-EText" data-color="' + color + '" data-backcolor="' + backcolor + '">' + text + '</div>\
                            ' + saudio + '\
                        </div>\
                    </div>\
                </div>\
                </div>';
        return card
    },

    clear: function (phrase) {
        return phrase.replace(/[&\s\n\r]+/g, " ").trim();
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
        var mOptions = $eXeOrdena.options[instance],
            element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            mOptions.fullscreen = true;
            $eXeOrdena.getFullscreen(element);
        } else {
            mOptions.fullscreen = false;
            $eXeOrdena.exitFullscreen(element);
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
        var mOptions = $eXeOrdena.options[instance];
        $('#ordenaLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#ordenaGameContainer-" + instance).show()
            $("#ordenaGameMinimize-" + instance).hide();
            if(!mOptions.gameStarted && !mOptions.gameOver){
                $eXeOrdena.startGame(instance);
                $('#ordenaStartGame-' + instance).hide();
            }
        });
        $("#ordenaLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#ordenaGameContainer-" + instance).hide();
            $("#ordenaGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        $('#ordenaCubierta-' + instance).hide();
        $('#ordenaGameOver-' + instance).hide();
        $('#ordenaCodeAccessDiv-' + instance).hide();
        $('#ordenaPScore-' + instance).hide();
        $('#ordenaPScoreIcon-' + instance).hide();
        $('#ordenaPNumber-' + instance).hide();
        $('#ordenaPNumberIcon-' + instance).hide();
        $("#ordenaLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('ordenaGameContainer-' + instance);
            $eXeOrdena.toggleFullscreen(element, instance)
        });
        $('#ordenaFeedBackClose-' + instance).on('click', function (e) {
            $('#ordenaDivFeedBack-' + instance).hide();
            $('#ordenaGameOver-' + instance).show();
        });

        if (mOptions.itinerary.showCodeAccess) {
            $('#ordenaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#ordenaCodeAccessDiv-' + instance).show();
            $('#ordenaStartLevels-' + instance).hide();
            $('#ordenaCubierta-' + instance).show();
        }
        $('#ordenaCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeOrdena.enterCodeAccess(instance);
        });

        $('#ordenaCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeOrdena.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#ordenaPNumber-' + instance).text(mOptions.numberQuestions);
        $(window).on('unload', function () {
            if (typeof ($eXeOrdena.mScorm) != "undefined") {
                $eXeOrdena.endScorm();
            }
        });
        if (mOptions.isScorm > 0) {
            $eXeOrdena.updateScorm($eXeOrdena.previousScore, mOptions.repeatActivity, instance);
        }
        $('#ordenaSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeOrdena.sendScore(instance, false);
            $eXeOrdena.saveEvaluation(instance);
        });
        $('#ordenaImage-' + instance).hide();
        window.addEventListener('resize', function () {
            var element = document.getElementById('ordenaGameContainer-' + instance);
            element = element || document.documentElement;
            mOptions.fullscreen = !(!document.fullscreenElement && !document.mozFullScreenElement &&
                !document.webkitFullscreenElement && !document.msFullscreenElement);
                if(!mOptions.refreshCard){
                    $eXeOrdena.refreshCards(instance);

                }
        });
        $('#ordenaStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeOrdena.startGame(instance);
            $(this).hide();
        });
        $('#ordenaStartGameEnd-' + instance).on('click', function (e) {
            e.preventDefault();
            mOptions.phrasesGame = $eXeOrdena.shuffleAds(mOptions.phrasesGame);
            $eXeOrdena.showPhrase(0, instance)
            $eXeOrdena.startGame(instance);
            $('#ordenaCubierta-' + instance).hide();
            $('#ordenaMultimedia-' + instance).find('.ODNP-Card1').addClass('flipped');
            $('#ordenaMultimedia-' + instance).find('.ODNP-Card1').removeClass("ODNP-CardOK ODNP-CardKO");
        });

        $('#ordenaClueButton-' + instance).on('click', function (e) {
            e.preventDefault();
            $('#ordenaShowClue-' + instance).hide();
            $('#ordenaCubierta-' + instance).fadeOut();
        });

        $('#ordenaPErrors-' + instance).text(mOptions.numberQuestions -mOptions.hits);
        if (mOptions.time == 0) {
            $('#ordenaPTime-' + instance).hide();
            $('#ordenaImgTime-' + instance).hide();
            $eXeOrdena.uptateTime(mOptions.time * 60, instance);
        } else {
            $eXeOrdena.uptateTime(mOptions.time * 60, instance);
        }
        if (mOptions.author.trim().length > 0 && !mOptions.fullscreen) {
            $('#ordenaAuthorGame-' + instance).html(mOptions.msgs.msgAuthor + '; ' + mOptions.author);
            $('#ordenaAuthorGame-' + instance).show();
        }
          $('#ordenaNextPhrase-' + instance).hide();
        $('#ordenaGameButtons-' + instance).hide();
        $('#ordenaValidatePhrase-' + instance).on('click', function (e) {
            e.preventDefault();
            var response = {};
            if(mOptions.type == 0){
                response = $eXeOrdena.checkPhraseText(instance)
            }else{
                response = mOptions.columns > 1 && mOptions.orderedColumns ? $eXeOrdena.checkPhraseColumns(instance) : $eXeOrdena.checkPhrase(instance);
            }
            var  valids = mOptions.orderedColumns ? response.valids.length - mOptions.gameColumns : response.valids.length,
                 msg = $eXeOrdena.updateScore(response.correct, instance) + ' ' + mOptions.msgs.msgPositions + ': ' + valids + '. ',
                 color = $eXeOrdena.borderColors.red;
            if (response.correct) {
                msg = mOptions.customMessages ? mOptions.phrasesGame[mOptions.active].msgHit : mOptions.msgs.msgAllOK;
                color = $eXeOrdena.borderColors.green;
                if (typeof mOptions.phrase.audioHit != "undefined" && mOptions.phrase.audioHit.length > 4) {
                    $eXeOrdena.playSound(mOptions.phrase.audioHit, instance);
                }
                $eXeOrdena.nextPhrase(instance);

            } else {
                msg = mOptions.customMessages ? mOptions.phrasesGame[mOptions.active].msgError : msg;
                if (typeof mOptions.phrase.audioError != "undefined" && mOptions.phrase.audioError.length > 4) {
                    $eXeOrdena.playSound(mOptions.phrase.audioError, instance);
                }
            }
            $('#ordenaHistsGame-' + instance).html(msg);
            $('#ordenaHistsGame-' + instance).css({
                'color': color
            });
            if(mOptions.type == 1 && mOptions.showSolution){
                $eXeOrdena.activeCorrects(instance, response.valids);
            }
            $('#ordenaValidatePhrase-' + instance).hide();
            $eXeOrdena.saveEvaluation(instance);

        });
        $eXeOrdena.updateEvaluationIcon(instance);
        mOptions.refreshCard=false;

    },
    checkPhraseText: function(instance){
        var mOptions = $eXeOrdena.options[instance],
            correct = true,
            valids = [];
        const wordsInTargetContainer = $('#ordenaPhrasesContainer-' + instance).find('.ODNP-Word').map(function () {
            return $(this).text();
        }).get();
        for (var i = 0;i < mOptions.correctOrder.length; i++){
            if(mOptions.correctOrder[i]!=wordsInTargetContainer[i]){
                correct = false;
            }else{
                if(mOptions.showSolution){
                  $('#ordenaPhrasesContainer-' + instance).find('.ODNP-Word').eq(i).addClass('ODNP-WordCorrect')
                }
                valids.push(i);
            }
        }
        return {
            'correct': correct,
            'valids': valids
        };
    },
    checkAudio: function (card, instance) {
        var audio = $(card).find('.ODNP-LinkAudio').data('audio');
        if (typeof audio != "undefined" && audio.length > 3) {
            $eXeOrdena.playSound(audio, instance)
        }
    },
    nextPhrase: function (instance) {
        var mOptions = $eXeOrdena.options[instance];
        $eXeOrdena.stopSound(instance);
        setTimeout(function () {
            $('#ordenaHistsGame-' + instance).html('');
            mOptions.active++;
            if (mOptions.active < mOptions.phrasesGame.length) {
                if(mOptions.type == 0){
                    $eXeOrdena.showPhraseText(mOptions.active, instance);
                }else{
                    $eXeOrdena.showPhrase(mOptions.active, instance);

                }
                $('#ordenaValidatePhrase-' + instance).show();
            } else {
                $eXeOrdena.gameOver(0, instance)
            }

        }, mOptions.timeShowSolution * 1000);

    },
    activeCorrects: function (instance, valids) {
        var mOptions = $eXeOrdena.options[instance];
        if (mOptions.orderedColumns) {
            $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').each(function () {
                var $card = $(this).find('.ODNP-Card1').eq(0),
                    order = parseInt($(this).data('order'));
                $card.removeClass("ODNP-CardOK ODNP-CardKO");
                if (valids.indexOf(order) != -1 && order >= mOptions.gameColumns) {
                    $card.addClass("ODNP-CardOK");
                }
            });
        } else {
            $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').each(function () {
                var $card = $(this).find('.ODNP-Card1').eq(0),
                    order = parseInt($(this).data('order'));
                $card.removeClass("ODNP-CardOK ODNP-CardKO");
                if (valids.indexOf(order) != -1) {
                    $card.addClass("ODNP-CardOK");
                }
            });
        }
    },

    getColors: function (number) {
        var colors = [];
        for (var i = 0; i < number; i++) {
            var color = $eXeOrdena.colorRGB();
            colors.push(color);
        }
        return colors;
    },
    colorRGB: function () {
        var color = "(" + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + ")";
        return "rgb" + color;
    },

    updateCovers: function (instance, answers) {
        var $cardContainers = $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw');
        $cardContainers.each(function () {
            var $card = $(this).find('.ODNP-Card1').eq(0);
            $card.removeClass("ODNP-CardActive flipped");
        });
    },
    showCard: function (card) {
        var $card = card,
            $noImage = $card.find('.ODNP-Cover').eq(0),
            $text = $card.find('.ODNP-EText').eq(0),
            $image = $card.find('.ODNP-Image').eq(0),
            $cursor = $card.find('.ODNP-Cursor').eq(0),
            $audio = $card.find('.ODNP-LinkAudio').eq(0),
            type = parseInt($card.data('type')),
            x = parseFloat($image.data('x')),
            y = parseFloat($image.data('y')),
            url = $image.data('url'),
            alt = $image.attr('alt') || "No disponibLe",
            audio = $audio.data('audio') || '',
            text = $text.html() || "",
            color = $text.data('color'),
            backcolor = $text.data('backcolor');
        $text.hide();
        $image.hide();
        $cursor.hide();
        $audio.hide();
        $noImage.show();
        if (type == 1) {
            $text.show();
            $text.css({
                'color': color,
                'background-color': backcolor,
            });
        } else if (type == 0 && url.length > 3) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        $cursor.hide();
                    } else {
                        $image.show();
                        $cursor.hide();
                        $eXeOrdena.positionPointerCard($cursor, x, y);
                        return true;
                    }
                }).on('error', function () {
                    $cursor.hide();
                });
        } else if (type == 2 && url.length > 3) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        $cursor.hide();
                    } else {
                        $image.show();
                        $cursor.hide();
                        $eXeOrdena.positionPointerCard($cursor, x, y);

                        return true;
                    }
                }).on('error', function () {
                    $cursor.hide();
                });
            $text.show();
            $text.css({
                'color': '#000',
                'background-color': 'rgba(255, 255, 255, 0.7)',
            });
        } else if (type == 2 && url.length < 3) {
            $image.attr('alt', 'No image');
            $image.hide();
            $text.show();
            $text.css({
                'color': '#000',
                'background-color': 'white',
            });
        }
        if (type == 2 && text.length == 0) {
            $text.hide();
        }

        $audio.removeClass('ODNP-LinkAudioBig')
        if (audio.length > 0) {
            if (url.trim().length == 0 && text.trim().length == 0) {
                $audio.addClass('ODNP-LinkAudioBig')
            }
            $audio.show();

        }
        $noImage.hide();

    },

    positionPointerCard: function($cursor, x, y) {
        $cursor.hide();
        if(x > 0 || y > 0){
            var parentClass = '.ODNP-ImageContain',
                siblingClass ='.ODNP-Image',
			    containerElement= $cursor.parents(parentClass).eq(0),
                imgElement =$cursor.siblings(siblingClass).eq(0),
                containerPos=containerElement.offset(),
                imgPos = imgElement.offset(),
                marginTop = imgPos.top - containerPos.top,
                marginLeft = imgPos.left - containerPos.left,
                mx = marginLeft + (x * imgElement.width()),
                my = marginTop + (y * imgElement.height());
            $cursor.css({ left: mx, top: my, 'z-index': 30 });
            $cursor.show();
        }
	},


    alfaBColor: function (bcolor) {
        var newBGColor = bcolor.replace('rgb', 'rgba').replace(')', ',.8)'); //rgba(100,100,100,.8)
        return newBGColor
    },

    refreshCards: function (instance) {
        var mOptions = $eXeOrdena.options[instance],
            $flcds = $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw')
        mOptions.refreshCard = true;
        $eXeOrdena.setSize(instance);
        $flcds.each(function () {
            var $card= $(this),
                $imageF = $card.find('.ODNP-Image').eq(0),
                $cursorF = $card.find('.ODNP-Cursor').eq(0),
                xF = parseFloat($imageF.data('x')) || 0,
                yF = parseFloat($imageF.data('y')) || 0;
            $eXeOrdena.positionPointerCard($cursorF, xF, yF)
        });
        mOptions.refreshCard = false;
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeOrdena.options[instance];
        if (mOptions.itinerary.codeAccess == $('#ordenaCodeAccessE-' + instance).val()) {
            $('#ordenaCodeAccessDiv-' + instance).hide();
            $('#ordenaCubierta-' + instance).hide();
            $('#ordenaStartLevels-' + instance).show();

        } else {
            $('#ordenaMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#ordenaCodeAccessE-' + instance).val('');
        }
    },

    setSize: function (instance) {
        var mOptions = $eXeOrdena.options[instance],
            numCards = mOptions.phrase.cards.length,
            size = "12%",
            msize = "12%",
            sizes = [],
            puntos = [],
            h = screen.height - $('#ordenaGameScoreBoard-' + instance).height() - 2 * $('#ordenaStartGame0-' + instance).height();

        for (var i = 2; i < 20; i++) {
            var w = Math.floor((screen.width - (i * 24)) / i),
                nf = Math.floor(h / w)
            puntos.push(i * nf);
            sizes.push(w + 'px');
        }
        for (var i = 0; i < puntos.length; i++) {
            if (numCards < puntos[i]) {
                msize = sizes[i]
                break;
            }
        }

        if (window.innerWidth < 550) {
            size = '36%';
        } else if (window.innerWidth < 800) {
            size = '24%';
        } else if (mOptions.fullscreen) {
            size = parseInt(msize) <= 300 ? msize : '300px';
        } else if (numCards < 13) {
            size = '18%'
        } else if (numCards < 19) {
            size = '16%'
        } else if (numCards < 35) {
            size = '14%'
        } else if (numCards < 49) {
            size = '11%'
        } else if (numCards < 63) {
            size = '10%'
        } else if (numCards < 70) {
            size = '9%'
        } else if (numCards <= 80) {
            size = '8%'
        }
        if (mOptions.gameColumns > 0) {
            $eXeOrdena.gameColumns(instance);
            return;
        }
        $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').each(function () {
            $(this).css({
                'width': size
            });
        });
    },

    gameColumns: function (instance) {
        var mOptions = $eXeOrdena.options[instance],
            wIdevice = $('#ordenaMultimedia-' + instance).width(),
            wCard = 250,
            hCard = 200,
            columns = '1fr',
            fsize = '1em'
        if (mOptions.gameColumns == 'undefined' || mOptions.gameColumns == 0) return;

        if (mOptions.gameColumns == 1) {
            wCard = wIdevice * .9 > 250 ? 250 : wIdevice / 2;
            columns = '1fr',
                fsize = '1.5em'
        } else if (mOptions.gameColumns == 2) {
            wCard = wIdevice * .42 > 250 ? 250 : wIdevice * .42
            columns = '1fr 1fr';
            fsize = '1.4em'
        } else if (mOptions.gameColumns == 3) {
            wCard = wIdevice * .28 > 250 ? 250 : wIdevice * .28
            columns = '1fr 1fr 1fr';
            fsize = '1.3em'
        } else if (mOptions.gameColumns == 4) {
            wCard = wIdevice * .20 > 250 ? 250 : wIdevice * .20
            columns = '1fr 1fr 1fr 1fr';
            fsize = '1.1em'
        } else if (mOptions.gameColumns == 5) {
            wCard = wIdevice * .16 > 250 ? 250 : wIdevice * .16
            columns = '1fr 1fr 1fr 1fr 1fr';
        }
        var wCard1 = mOptions.maxWidth && mOptions.gameColumns > 0 ? '100%' : wCard + 'px';

        hCard = mOptions.maxWidth && mOptions.gameColumns > 0 && mOptions.cardHeight > 0 ? mOptions.cardHeight + 'px' : 'auto';
        if (window.innerWidth < 640 && hCard != 'auto' && parseInt(hCard) > wCard) {
            fsize = '0.8em'
            hCard = wCard + 50 + 'px'
        }
        $('#ordenaMultimedia-' + instance).css({
            'padding': '0 1em',
            'display': 'grid',
            'grid-template-columns': columns,
            'grid-template-rows': 'auto',

        });
        $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').each(function () {
            $(this).css({
                'width': wCard1,
                'max-width': wCard1,
                'justify-self': 'center',
                'height': hCard,
                'margin': 0
            });
        });
        $('#ordenaMultimedia-' + instance).find('.ODNP-EText').css({
            'font-size': fsize,

        });
        if (mOptions.maxWidth && mOptions.gameColumns > 0 && mOptions.cardHeight > 0) {
            if (mOptions.maxWidth && mOptions.cardHeight > 0) {
                $('#ordenaMultimedia-' + instance).find('div.ODNP-CardContainer').addClass('ODNP-Before')
            }
            setTimeout(function () {
                var wOne = $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').eq(0).width();
                $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw').width(wOne);
            }, 1000);
        }



    },

    initCards: function (instance) {
        var $cards = $('#ordenaMultimedia-' + instance).find('.ODNP-CardDraw');
        $cards.each(function (i) {
            $eXeOrdena.showCard($(this));
        });
        var html = $('#ordenaMultimedia-' + instance).html(),
            latex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeOrdena.updateLatex('ordenaMultimedia-' + instance)
        }
    },

    startGame: function (instance) {
        var mOptions = $eXeOrdena.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        if(mOptions.type == 0){
            $('#ordenaPhrasesContainer-'+instance).show();
        }
        if (mOptions.type ==1 ){
            $eXeOrdena.showMessage(3, mOptions.phrase.definition, instance)
        }
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = true;
        mOptions.counter = mOptions.time * 60;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.obtainedClue = false;
        mOptions.nattempts = mOptions.attempts > 0 ? mOptions.attempts : 0;
        $('#ordenaGameButtons-' + instance).css('display', 'flex');
        $('#ordenaGameButtons-' + instance).show();
        $('#ordenaPShowClue-' + instance).text('');
        $('#ordenaShowClue-' + instance).hide();
        $('#ordenaPHits-' + instance).text(mOptions.hits);
        $('#ordenaPErrors-' + instance).text(mOptions.numberQuestions -mOptions.hits);
        $('#ordenaCubierta-' + instance).hide();
        $('#ordenaGameOver-' + instance).hide();
        $eXeOrdena.initCards(instance);
        if (mOptions.time == 0) {
            $('#ordenaPTime-' + instance).hide();
            $('#ordenaImgTime-' + instance).hide();
        }
        if (mOptions.time > 0) {
            mOptions.counterClock = setInterval(function () {
                if (mOptions.gameStarted) {
                    mOptions.counter--;
                    if (mOptions.counter <= 0) {
                        $eXeOrdena.gameOver(2, instance);
                        return;
                    }
                }
                $eXeOrdena.uptateTime(mOptions.counter, instance);
            }, 1000);
            $eXeOrdena.uptateTime(mOptions.time * 60, instance);
        }
        $('#ordenaMultimedia-' + instance).find('.ODNP-Card1').addClass('flipped');
        if (typeof mOptions.phrase.audioDefinition != "undefined" && mOptions.phrase.audioDefinition.length > 4) {
            $eXeOrdena.playSound(mOptions.phrase.audioDefinition, instance);
        }
        mOptions.gameStarted = true;
    },

    uptateTime: function (tiempo, instance) {
        var mOptions = $eXeOrdena.options[instance];
        if (mOptions.time == 0) return;
        var mTime = $eXeOrdena.getTimeToString(tiempo);
        $('#ordenaPTime-' + instance).text(mTime);
    },

    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
 
    gameOver: function (type, instance) {
        var mOptions = $eXeOrdena.options[instance];
        if (!mOptions.gameStarted) {
            return;
        }
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        mOptions.gameOver = true;
        clearInterval(mOptions.counterClock);
        $eXeOrdena.stopSound(instance);
        $('#ordenaCubierta-' + instance).show();
        $eXeOrdena.showScoreGame(type, instance);
        $eXeOrdena.saveEvaluation(instance);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeOrdena.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeOrdena.sendScore(instance, true);
                $('#ordenaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeOrdena.initialScore = score;
            }
        }
        $eXeOrdena.showFeedBack(instance);
    },

    showFeedBack: function (instance) {
        var mOptions = $eXeOrdena.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.phrasesGame.length;
        if (mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#ordenaGameOver-' + instance).hide();
                $('#ordenaDivFeedBack-' + instance).find('.ordena-feedback-game').show();
                $('#ordenaDivFeedBack-' + instance).show();
            } else {
                $eXeOrdena.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance, false);
            }
        }
    },

    isMobile: function () {
        return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i))
    },

    showScoreGame: function (type, instance) {
        var mOptions = $eXeOrdena.options[instance],
            msgs = mOptions.msgs,
            $ordenaHistGame = $('#ordenaHistGame-' + instance),
            $ordenaLostGame = $('#ordenaLostGame-' + instance),
            $ordenaOverNumCards = $('#ordenaOverNumCards-' + instance),
            $ordenaOverHits = $('#ordenaOverHits-' + instance),
            $ordenaOverAttemps = $('#ordenaOverAttemps-' + instance),
            $ordenaCubierta = $('#ordenaCubierta-' + instance),
            $ordenaGameOver = $('#ordenaGameOver-' + instance),
            message = "",
            messageColor = 1;
        $ordenaHistGame.hide();
        $ordenaLostGame.hide();
        $ordenaOverNumCards.show();
        $ordenaOverHits.show();
        $ordenaOverAttemps.show();
        var mclue = '';
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.mgsAllPhrases;
                messageColor = 2;
                $ordenaHistGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#ordenaPShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        mclue = text;
                    } else {
                        mclue = msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
                    }
                }
                break;
            case 1:
                messageColor = 3;
                $ordenaLostGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#ordenaPShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        mclue = text;
                    } else {
                        mclue = msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
                    }
                }
                break;
            case 2:
                messageColor = 3;
                message = msgs.msgTimeOver;
                $ordenaLostGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#ordenaPShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        mclue = text;
                    } else {
                        mclue = msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
                    }
                }
                break;
            case 3:
                messageColor = 3;
                message = msgs.msgAllAttemps;
                $ordenaLostGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#ordenaPShowClue-' + instance).text();
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
        var attemps = mOptions.attempts > 0 ? mOptions.attempts - mOptions.nattempts : mOptions.nattempts;
        $eXeOrdena.showMessage(messageColor, message, instance, true);
        $ordenaOverNumCards.html(msgs.msgActivities + ': ' + mOptions.phrasesGame.length);
        if(mOptions.type == 0){
            $ordenaOverNumCards.html(msgs.msgPhrases + ': ' + mOptions.phrasesGame.length);
        }
        $ordenaOverHits.html(msgs.msgHits + ': ' + mOptions.hits);
        $ordenaOverAttemps.html(msgs.msgAttempts + ': ' + attemps);
        $ordenaGameOver.show();
        $ordenaCubierta.show();
        $ordenaOverAttemps.hide();
        $('#ordenaShowClue-' + instance).hide();
        if (mOptions.itinerary.showClue) {
            $eXeOrdena.showMessage(3, mclue, instance, true)
        }
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

    getRetroFeedMessages: function (iHit, instance) {
        var mOptions = $eXeOrdena.options[instance],
            sMessages = iHit ? mOptions.msgs.msgSuccesses : mOptions.msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
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
        var mOptions = $eXeOrdena.options[instance],
            message = "",
            obtainedPoints = 0,
            sscore = 0;
        if (correctAnswer) {
            mOptions.hits++
            obtainedPoints = (10 / mOptions.phrasesGame.length);
        }
        if (mOptions.attempts > 0) {
            mOptions.nattempts--;
        } else {
            mOptions.nattempts++;
        }
        mOptions.score = mOptions.score + obtainedPoints;
        sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#ordenaPErrors-' + instance).text(mOptions.numberQuestions  -mOptions.hits);
        $('#ordenaPScore-' + instance).text(sscore);
        $('#ordenaPHits-' + instance).text(mOptions.hits);
        if (mOptions.attempts > 0 && mOptions.nattempts == 0 && mOptions.hits < mOptions.phrasesGame.length) {
            mOptions.gameActived = false;
            setTimeout(function () {
                $eXeOrdena.gameOver(3, instance)
            }, mOptions.timeShowSolution)
        }
        message = $eXeOrdena.getMessageAnswer(correctAnswer, instance);
        return message;
    },
    getMessageAnswer: function (correctAnswer, instance) {
        var message = "";
        if (correctAnswer) {
            message = $eXeOrdena.getMessageCorrectAnswer(instance);
        } else {
            message = $eXeOrdena.getMessageErrorAnswer(instance);
        }
        return message;
    },
    getMessageCorrectAnswer: function (instance) {
        var mOptions = $eXeOrdena.options[instance],
            messageCorrect = $eXeOrdena.getRetroFeedMessages(true, instance),
            message = messageCorrect + ' ' + mOptions.msgs.msgCompletedPair;
        if (mOptions.customMessages && mOptions.phrasesGame[mOptions.active].msgHit.length > 0) {
            message = mOptions.phrasesGame[mOptions.active].msgHit
        }
        return message;
    },
    getMessageErrorAnswer: function (instance) {
        return $eXeOrdena.getRetroFeedMessages(false, instance);
    },
    showMessage: function (type, message, instance, end) {
        var colors = ['#555555', $eXeOrdena.borderColors.red, $eXeOrdena.borderColors.green, $eXeOrdena.borderColors.blue, $eXeOrdena.borderColors.yellow],
            color = colors[type],
            $ordenaMessage = $('#ordenaMessage-' + instance);
        $ordenaMessage.html(message);
        $ordenaMessage.css({
            'color': color,
            'font-style': 'bold'
        });
        $ordenaMessage.show();
        if (end) {
            $ordenaMessage.hide();
            $('#ordenaMesasgeEnd-' + instance).text(message);
            $('#ordenaMesasgeEnd-' + instance).css({
                'color': color
            });
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
        if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }
}
$(function () {
    $eXeOrdena.init();
});