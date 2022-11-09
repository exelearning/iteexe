/**
 * flip flcds activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeFlipCards = {
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
    scorm: '',
    previousScore: '',
    initialScore: '',
    hasLATEX: false,
    init: function () {
        this.activities = $('.flipcards-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeFlipCards.supportedBrowser('flcds')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Word Guessing') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/flipcards-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();

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

    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeFlipCards.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeFlipCards.enable()');
        else this.enable();
        $eXeFlipCards.mScorm = scorm;
        var callSucceeded = $eXeFlipCards.mScorm.init();
        if (callSucceeded) {
            $eXeFlipCards.userName = $eXeFlipCards.getUserName();
            $eXeFlipCards.previousScore = $eXeFlipCards.getPreviousScore();
            $eXeFlipCards.mScorm.set("cmi.core.score.max", 10);
            $eXeFlipCards.mScorm.set("cmi.core.score.min", 0);
            $eXeFlipCards.initialScore = $eXeFlipCards.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeFlipCards.options[instance],
            text = '';
        $('#flcdsSendScore-' + instance).hide();
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
            $('#flcdsSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#flcdsSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#flcdsRepeatActivity-' + instance).text(text);
        $('#flcdsRepeatActivity-' + instance).fadeIn(1000);
    },

    getUserName: function () {
        var user = $eXeFlipCards.mScorm.get("cmi.core.student_name");
        return user
    },

    getPreviousScore: function () {
        var score = $eXeFlipCards.mScorm.get("cmi.core.score.raw");
        return score;
    },

    endScorm: function () {
        $eXeFlipCards.mScorm.quit();
    },

    enable: function () {
        $eXeFlipCards.loadGame();
    },

    loadGame: function () {
        $eXeFlipCards.options = [];
        $eXeFlipCards.activities.each(function (i) {
            var dl = $(".flipcards-DataGame", this),
                mOption = $eXeFlipCards.loadDataGame(dl, this);
            $eXeFlipCards.options.push(mOption);
            var flcds = $eXeFlipCards.createInterfaceCards(i);
            dl.before(flcds).remove();
            $('#flcdsGameMinimize-' + i).hide();
            $('#flcdsGameContainer-' + i).hide();
            $('#flcdsNavigation-' + i).hide();
            $('#flcdsCubierta-' + i).hide();
            if (mOption.showMinimize) {
                $('#flcdsGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#flcdsGameContainer-' + i).show();
            }
            $eXeFlipCards.showActivity(i);
            $eXeFlipCards.addEvents(i);
            if (!mOption.gameMode) {
                $('#flcdsGameContainer-' + i).find('.exeQuextIcons-Hit').hide();
                $('#flcdsGameContainer-' + i).find('.exeQuextIcons-Error').hide();
                $('#flcdsGameContainer-' + i).find('.exeQuextIcons-Score').hide();
                $('#flcdsPHits-' + i).hide();
                $('#flcdsPErrors-' + i).hide();
                $('#flcdsPScore-' + i).hide();

            }
        });
        if ($eXeFlipCards.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeFlipCards.loadMathJax();
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

    getCardDefault: function () {
        var p = new Object();
        p.id = "";
        p.type = 2;
        p.url = '';
        p.audio = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        p.eText = '';
        p.color = '#000000';
        p.backcolor = "#ffffff";
        p.correct = 0
        p.urlBk = '';
        p.audioBk = '';
        p.xBk = 0;
        p.yBk = 0;
        p.authorBk = '';
        p.altBk = '';
        p.eTextBk = '';
        p.colorBk = '#000000';
        p.backcolorBk = "#ffffff";
        return p;
    },

    loadDataGame: function (data, sthis) {
        var json = data.text(),
            mOptions = $eXeFlipCards.isJsonString(json),
            $imagesLink = $('.flipcards-LinkImages', sthis),
            $audiosLink = $('.flipcards-LinkAudios', sthis),
            $imagesLinkBack = $('.flipcards-LinkImagesBack', sthis),
            $audiosLinkBack = $('.flipcards-LinkAudiosBack', sthis);
        mOptions.playerAudio = "";
        $imagesLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.cardsGame.length) {
                var flipcard = mOptions.cardsGame[iq];
                flipcard.url = $(this).attr('href');
                if (flipcard.url.length < 4) {
                    flipcard.url = "";
                }
            }
        });
        $imagesLinkBack.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.cardsGame.length) {
                var flipcard = mOptions.cardsGame[iq];
                flipcard.urlBk = $(this).attr('href');
                if (flipcard.urlBk.length < 4) {
                    flipcard.urlBk = "";
                }
            }
        });
        $audiosLink.each(function () {
            var iqa = parseInt($(this).text());
            if (!isNaN(iqa) && iqa < mOptions.cardsGame.length) {
                var flipcard = mOptions.cardsGame[iqa];
                flipcard.audio = $(this).attr('href');
                if (flipcard.audio.length < 4) {
                    flipcard.audio = "";
                }
            }
        });
        $audiosLinkBack.each(function () {
            var iqa = parseInt($(this).text());
            if (!isNaN(iqa) && iqa < mOptions.cardsGame.length) {
                var flipcard = mOptions.cardsGame[iqa];
                flipcard.audioBk = $(this).attr('href');
                if (flipcard.audioBk.length < 4) {
                    flipcard.audioBk = "";
                }
            }
        });
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.active = 0;
        mOptions.activedGame = false;
        mOptions.visiteds = [];
        mOptions.obtainedClue = false;
        mOptions.gameMode = typeof mOptions.gameMode == "undefined" ? false : mOptions.gameMode;
        mOptions.cardsGame = $eXeFlipCards.getCards(mOptions.cardsGame, mOptions.percentajeCards);
        mOptions.cardsGame = mOptions.randomCards ? $eXeFlipCards.shuffleAds(mOptions.cardsGame) : mOptions.cardsGame;
        mOptions.numberCards = mOptions.cardsGame.length;
        for (var i = 0; i < mOptions.cardsGame.length; i++) {
            mOptions.cardsGame[i].isCorrect = true;
            mOptions.cardsGame[i].eText = $eXeFlipCards.decodeURIComponentSafe(mOptions.cardsGame[i].eText);
            mOptions.cardsGame[i].eTextBk = $eXeFlipCards.decodeURIComponentSafe(mOptions.cardsGame[i].eTextBk);
            if (/(?:\\\(|\\\[|\\begin\{.*?})/.test(mOptions.cardsGame[i].eText) || /(?:\\\(|\\\[|\\begin\{.*?})/.test(mOptions.cardsGame[i].eTextBk)) {
                $eXeFlipCards.hasLATEX = true;
            }
        }
        mOptions.fullscreen = false;
        return mOptions;
    },
    decodeURIComponentSafe: function (s) {

        if (!s) {
            return s;
        }
        return decodeURIComponent(s).replace("&percnt;", "%");

    },
    activeGameMode(instance) {
        var mOptions = $eXeFlipCards.options[instance];
        for (var i = 0; i < mOptions.cardsGame.length; i++) {
            var card = mOptions.cardsGame[i];
            var a = Math.random();
            if (a >= 0.5) {
                card.isCorrect = true;
            } else {
                card.isCorrect = false;
                var num = Math.floor(Math.random() * mOptions.cardsGame.length);
                if (num == i) {
                    num = num > 0 ? num - 1 : mOptions.cardsGame.length - 1;
                }
                var cb = mOptions.cardsGame[num];
                card.urlBk = cb.urlBk;
                card.audioBk = cb.audioBk;
                card.xBk = cb.xBk;
                card.yBk = cb.yBk;
                card.authorBk = card.authorBk;
                card.altBk = cb.altBk;
                card.eTextBk = cb.eTextBk;
                card.colorBk = cb.colorBk;
                card.backcolorBk = cb.backcolorBk;
            }
        }
        return mOptions.cardsGame;
    },
    showActivity: function (instance) {
        var mOptions = $eXeFlipCards.options[instance];
        mOptions.active = 0;
        mOptions.cardsGame = mOptions.randomCards ? $eXeFlipCards.shuffleAds(mOptions.cardsGame) : mOptions.cardsGame;
        if (mOptions.gameMode) mOptions.cardsGame = $eXeFlipCards.activeGameMode(instance);
        $eXeFlipCards.stopSound(instance);
        $eXeFlipCards.addCards(mOptions.cardsGame, instance);
        $eXeFlipCards.initCards(instance);
        var $cards = $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw');
        $cards.off();
        $cards.css('cursor', 'pointer');
        $cards.on('click touchstart', function (e) {
            e.preventDefault();
            $(this).find('.FLCDSP-LinkAudio-Front').hide();
            $(this).find('.FLCDSP-LinkAudio-Back').hide();
            if (!$(this).find('.flip-card-inner').eq(0).hasClass('flipped')) {
                if (mOptions.gameMode) {
                    $('#flcdsLinkV-' + instance).css('visibility', 'visible');
                    $('#flcdsLinkF-' + instance).css('visibility', 'visible');
                }
                $(this).find('.flip-card-inner').eq(0).addClass('flipped');
                var number = $(this).data('number'),
                    audioBk = $(this).find('.FLCDSP-LinkAudio-Back').data('audio');
                mOptions.visiteds.push(number);
                if (audioBk.length > 3) {
                    $(this).find('.FLCDSP-LinkAudio-Back').show();
                }

                if (mOptions.isScorm === 1 && !mOptions.gameMode) {
                    if (mOptions.repeatActivity || $eXeFlipCards.initialScore === '') {
                        $eXeFlipCards.showScoreFooter(instance);
                        $eXeFlipCards.sendScore(instance, true);
                    }

                }
                if (!mOptions.gameMode) $eXeFlipCards.showClue(instance);
            } else {
                $(this).find('.flip-card-inner').eq(0).removeClass('flipped');
                var audio = $(this).find('.FLCDSP-LinkAudio-Front').data('audio');
                if (audio.length > 3) {
                    $(this).find('.FLCDSP-LinkAudio-Front').show();
                }
            }
            $eXeFlipCards.stopSound(instance);
            $eXeFlipCards.checkAudio($(this), 1000, instance);
        });
        $cards.on('mouseenter', function () {
            if (!$eXeFlipCards.isMobile()) {
                $eXeFlipCards.checkAudio($(this), 50, instance);
            }
        });
        if (mOptions.gameMode || (mOptions.navigation && mOptions.cardsGame.length > 1)) {
            $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw').hide();
            mOptions.activeCard = $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw').eq(0);
            mOptions.activeCard.show();
            $('#flcdsCardNumber-' + instance).text(mOptions.active + 1);
            $('#flcdsNavigation-' + instance).show();
            $eXeFlipCards.showNavigationButtons(instance);
            if (mOptions.gameMode) {
                $('#flcdsNavigation-' + instance).hide();
            }


        }
        $('#flcdsMultimedia-' + instance).on('click touchstart', '.FLCDSP-LinkAudio-Back', function (e) {
            e.preventDefault();
            var audioBk = $(this).data('audio');
            if (typeof audioBk != "undefined" && audioBk.length > 3) {
                $eXeFlipCards.playSound(audioBk, instance);
            }
        });
    },
    nextCard: function (instance) {
        $eXeFlipCards.stopSound(instance);
        var mOptions = $eXeFlipCards.options[instance];
        if (mOptions.active < mOptions.cardsGame.length - 1) {
            mOptions.active++;
            if (window.innerWidth < 700) {
                mOptions.activeCard.hide();
            } else {
                mOptions.activeCard.animate({
                    width: 'toggle'
                }, 400);
            }

            mOptions.activeCard = mOptions.activeCard.next();
            $eXeFlipCards.showCard(mOptions.activeCard, instance)
            if (window.innerWidth < 700) {
                mOptions.activeCard.show();
            } else {
                mOptions.activeCard.animate({
                    width: 'toggle'
                }, 400);
            }

            var audio = mOptions.activeCard.find('.FLCDSP-LinkAudio-Front').data('audio'),
                audioBK = mOptions.activeCard.find('.FLCDSP-LinkAudio-Back').data('audio');
            if (mOptions.activeCard.find('.flip-card-inner').eq(0).hasClass('flipped')) {
                if (audioBK && typeof audioBK != "undefined" && audioBK.length > 3) {
                    mOptions.activeCard.find('.FLCDSP-LinkAudio-Back').show();
                }
            } else {
                if (audio && typeof audio != "undefined" && audio.length > 3) {
                    mOptions.activeCard.find('.FLCDSP-LinkAudio-Front').show();
                }
            }
            $('#flcdsCardNumber-' + instance).text(mOptions.active + 1);
        }
        $eXeFlipCards.showNavigationButtons(instance);
    },
    previousCard: function (instance) {
        var mOptions = $eXeFlipCards.options[instance];
        if (mOptions.active > 0) {
            mOptions.active--;
            if (window.innerWidth < 700) {
                mOptions.activeCard.hide();
            } else {
                mOptions.activeCard.animate({
                    width: 'toggle'
                }, 400);
            }

            mOptions.activeCard = mOptions.activeCard.prev();
            $eXeFlipCards.showCard(mOptions.activeCard, instance);
            if (window.innerWidth < 700) {
                mOptions.activeCard.show();
            } else {
                mOptions.activeCard.animate({
                    width: 'toggle'
                }, 400);
            }

            $('#flcdsCardNumber-' + instance).text(mOptions.active + 1);
            mOptions.activeCard.find('.FLCDSP-LinkAudio-Front').hide();
            mOptions.activeCard.find('.FLCDSP-LinkAudio-Back').hide();
            var audio = mOptions.activeCard.find('.FLCDSP-LinkAudio-Front').data('audio'),
                audioBK = mOptions.activeCard.find('.FLCDSP-LinkAudio-Back').data('audio');
            if (mOptions.activeCard.find('.flip-card-inner').eq(0).hasClass('flipped')) {
                if (typeof audioBK != "undefined" && audioBK.length > 3) {
                    mOptions.activeCard.find('.FLCDSP-LinkAudio-Back').show();
                }
            } else {
                if (typeof audio != "undefined" && audio.length > 3) {
                    mOptions.activeCard.find('.FLCDSP-LinkAudio-Front').show();
                }
            }
        }
        $eXeFlipCards.showNavigationButtons(instance);
    },

    showNavigationButtons: function (instance) {
        var mOptions = $eXeFlipCards.options[instance];
        $('#flcdsPreviousCard-' + instance).fadeTo(100, 1);
        $('#flcdsNextCard-' + instance).fadeTo(200, 1);
        if (mOptions.active <= 0) {
            $('#flcdsPreviousCard-' + instance).fadeTo(300, 0.2);
        }
        if (mOptions.active >= mOptions.cardsGame.length - 1) {
            $('#flcdsNextCard-' + instance).fadeTo(300, 0.2);
        }


    },
    getCards: function (cards, percentaje) {
        var mCards = cards;
        if (percentaje < 100) {
            var num = Math.round((percentaje * cards.length) / 100);
            num = num < 1 ? 1 : num;
            if (num < cards.length) {
                var array = [];
                for (var i = 0; i < cards.length; i++) {
                    array.push(i);
                }
                array = $eXeFlipCards.shuffleAds(array).slice(0, num).sort(function (a, b) {
                    return a - b;
                });
                mCards = [];
                for (var i = 0; i < array.length; i++) {
                    mCards.push(cards[array[i]]);
                }
            }
        }
        return mCards;
    },

    playSound: function (selectedFile, instance) {
        $eXeFlipCards.stopSound(instance);
        var mOptions = $eXeFlipCards.options[instance];
        $eXeFlipCards.stopSound(instance);
        selectedFile = $eXeFlipCards.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile);
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });

    },
    stopSound: function (instance) {
     
        var mOptions = $eXeFlipCards.options[instance];
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
    createInterfaceCards: function (instance) {
        var html = '',
            path = $eXeFlipCards.idevicePath,
            msgs = $eXeFlipCards.options[instance].msgs,
            html = '';
        html += '<div class="FLCDSP-MainContainer">\
        <div class="FLCDSP-GameMinimize" id="flcdsGameMinimize-' + instance + '">\
            <a href="#" class="FLCDSP-LinkMaximize" id="flcdsLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'flipcardsIcon.png"  class="FLCDSP-IconMinimize FLCDSP-Activo"  alt="">\
            <div class="FLCDSP-MessageMaximize" id="flcdsMessageMaximize-' + instance + '">' + msgs.msgPlayStart + '</div>\
            </a>\
        </div>\
        <div class="FLCDSP-GameContainer" id="flcdsGameContainer-' + instance + '">\
            <div class="FLCDSP-GameScoreBoard" id="flcdsGameScoreBoard-' + instance + '">\
                <div class="FLCDSP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number"  id="flcdsPNumberIcon-' + instance + '" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="flcdsPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="flcdsPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="flcdsPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="flcdsPScore-' + instance + '">0</span></p>\
                 </div>\
                <div class="FLCDSP-Info" id="flcdsInfo-' + instance + '"></div>\
                <div class="FLCDSP-TimeNumber">\
                    <a href="#" class="FLCDSP-LinkMinimize" id="flcdsLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  FLCDSP-Activo"></div>\
                    </a>\
				</div>\
            </div>\
            <div class="FLCDSP-Information">\
                <p class="FLCDSP-Message" id="flcdsMessage-' + instance + '"></p>\
            </div>\
            <div class="FLCDSP-Multimedia" id="flcdsMultimedia-' + instance + '">\
                <div class="FLCDSP-GameButtons" id="flcdsGameButtons-' + instance + '">\
                    <div>\
                        <a href="#"  id="flcdsLinkV-' + instance + '" title="' + msgs.msgTrue + '">\
                            <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                            <div class="exeQuextButtonsF exeQuextIcons-ButtonOk  FLCDSP-Activo"></div>\
                        </a>\
                    </div>\
                    <div>\
                        <a href="#" id="flcdsLinkF-' + instance + '" title="' + msgs.msgFalse + '">\
                            <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                            <div class="exeQuextButtonsF exeQuextIcons-ButtonKO FLCDSP-Activo"></div>\
                        </a>\
                    </dvi>\
                </div>\
            </div>\
            <div class="FLCDSP-Navigation" id="flcdsNavigation-' + instance + '">\
                <a href="#" id="flcdsPreviousCard-' + instance + '" title="' + msgs.msgPreviousCard + '">&laquo;&nbsp;' + msgs.msgPreviousCard + '</a>\
                <span class="sr-av">' + msgs.numberCards + ':</span><span class="FLCDSP-CardsNumber" id="flcdsCardNumber-' + instance + '">' + msgs.numberCards + ':</span>\
                <a href="#" id="flcdsNextCard-' + instance + '" title="' + msgs.msgNextCard + '">' + msgs.msgNextCard + '&nbsp;&raquo</a>\
            </div>\
            <div class="FLCDSP-Cover" id="flcdsCubierta-' + instance + '">\
                <div class="FLCDSP-CodeAccessDiv" id="flcdsCodeAccessDiv-' + instance + '">\
                    <div class="FLCDSP-MessageCodeAccessE" id="flcdsMesajeAccesCodeE-' + instance + '"></div>\
                    <div class="FLCDSP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="FLCDSP-CodeAccessE" id="flcdsCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="flcdsCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                        <div class="exeQuextIcons-Submit FLCDSP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="FLCDSP-GameOverExt" id="flcdsGameOver-' + instance + '">\
                    <div class="FLCDSP-StartGame" id="flcdsMesasgeEnd-' + instance + '"></div>\
                    <div class="FLCDSP-GameOver">\
                        <div class="FLCDSP-DataImage">\
                            <img src="' + path + 'exequextwon.png" class="FLCDSP-HistGGame" id="flcdsHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                            <img src="' + path + 'exequextlost.png" class="FLCDSP-LostGGame" id="flcdsLostGame-' + instance + '"  alt="' + msgs.msgAllQuestions + '" />\
                        </div>\
                        <div class="FLCDSP-DataScore">\
                            <p id="flcdsOverNumCards-' + instance + '"></p>\
                            <p id="flcdsOverErrors-' + instance + '"></p>\
                            <p id="flcdsOverHits-' + instance + '"></p>\
                            <p id="flcdsOverScore-' + instance + '"></p>\
                        </div>\
                    </div>\
                    <div class="FLCDSP-StartGame"><a href="#" id="flcdsReboot-' + instance + '">' + msgs.msgPlayAgain + '</a></div>\
                </div>\
                <div class="FLCDSP-ShowClue" id="flcdsShowClue-' + instance + '">\
                    <p class="sr-av">' + msgs.msgClue + '</p>\
                    <p class="FLCDSP-PShowClue" id="flcdsPShowClue-' + instance + '"></p>\
                    <a href="#" class="FLCDSP-ClueBotton" id="flcdsClueButton-' + instance + '" title="' + msgs.msgClose + '">' + msgs.msgClose + ' </a>\
                </div>\
            </div>\
            <div class="FLCDSP-AuthorGame" id="flcdsAuthorGame-' + instance + '"></div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },

    addButtonScore: function (instance) {
        var mOptions = $eXeFlipCards.options[instance];
        var butonScore = "";
        var fB = '<div class="FLCDSP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="FLCDSP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="flcdsSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="FLCDSP-RepeatActivity" id="flcdsRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="FLCDSP-GetScore">';
                fB += '<p><span class="FLCDSP-RepeatActivity" id="flcdsRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeFlipCards.options[instance];
        $eXeFlipCards.stopSound(instance);
        $('#flcdsPNumber-' + instance).text('0');
        $eXeFlipCards.showScoreGame(type, instance);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeFlipCards.initialScore === '') {
                $eXeFlipCards.sendScore(instance, true);
                $eXeFlipCards.initialScore = $eXeFlipCards.showScoreFooter(instance);
            }
        }
        $('#flcdsReboot-' + instance).show();
        console.log(mOptions.isScorm, !mOptions.repeatActivity)
        if (mOptions.isScorm > 0 && !mOptions.repeatActivity) {
            $('#flcdsReboot-' + instance).hide();
        }
    },
    showScoreFooter: function (instance) {
        var mOptions = $eXeFlipCards.options[instance],
            score = mOptions.gameMode ? mOptions.hits * 10 / mOptions.cardsGame.length : $eXeFlipCards.getScoreVisited(instance);
        score = score.toFixed(2);
        $('#flcdsRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
        return score;
    },
    showScoreGame: function (type, instance) {
        var mOptions = $eXeFlipCards.options[instance],
            msgs = mOptions.msgs,
            $flcdsHistGame = $('#flcdsHistGame-' + instance),
            $flcdsLostGame = $('#flcdsLostGame-' + instance),
            $flcdsOverNumCards = $('#flcdsOverNumCards-' + instance),
            $flcdsOverHits = $('#flcdsOverHits-' + instance),
            $flcdsOverErrors = $('#flcdsOverErrors-' + instance),
            $flcdsOverScore = $('#flcdsOverScore-' + instance),
            $flcdsCubierta = $('#flcdsCubierta-' + instance),
            $flcdsGameOver = $('#flcdsGameOver-' + instance),
            message = "",
            messageColor = 1;
        $flcdsHistGame.hide();
        $flcdsLostGame.hide();
        $flcdsOverNumCards.show();
        $flcdsOverHits.show();
        $flcdsOverErrors.show();
        $flcdsOverScore.show();
        var mclue = '';
        message = msgs.msgCool + ' ' + msgs.mgsAllQuestions;
        messageColor = 0;
        $flcdsHistGame.show();

        var score = ((mOptions.hits * 10) / mOptions.cardsGame.length).toFixed(2);
        $eXeFlipCards.showMessage(messageColor, message, instance, true);
        $flcdsOverNumCards.html(msgs.msgNumQuestions + ': ' + mOptions.cardsGame.length);
        $flcdsOverHits.html(msgs.msgHits + ': ' + mOptions.hits);
        $flcdsOverErrors.html(msgs.msgErrors + ': ' + mOptions.errors);
        $flcdsOverScore.html(msgs.msgScore + ': ' + score);
        $flcdsGameOver.show();
        $flcdsCubierta.show();
        if (mOptions.itinerary.showClue) {
            var text = $('#flcdsPShowClue-' + instance).text();
            if (score * 100 > mOptions.itinerary.percentageClue) {
                mclue = mOptions.itinerary.clueGame;
            } else {
                mclue = msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
            }
        }
        $('#flcdsShowClue-' + instance).hide();
        if (mOptions.itinerary.showClue) {
            $eXeFlipCards.showMessage(3, mclue, instance, true)
        }

    },
    rebootGame: function (instance) {
        var mOptions = $eXeFlipCards.options[instance];
        $('#flcdsMultimedia-' + instance).find('.flip-card-inner').removeClass('flipped');
        $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw').hide();
        mOptions.activeCard = $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw').eq(0);
        mOptions.activeCard.show();
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.active = 0;
        mOptions.obtainedClue = false;
        $('#flcdsPShowClue-' + instance).text('');
        $('#flcdsPNumber-' + instance).text(mOptions.cardsGame.length);
        $('#flcdsShowClue-' + instance).hide();
        $('#flcdsPHits-' + instance).text(mOptions.hits);
        $('#flcdsPErrors-' + instance).text(mOptions.errors);
        $('#flcdsPScore-' + instance).text(0);
        $('#flcdsCubierta-' + instance).hide();
        $('#flcdsGameOver-' + instance).hide();
        $('#flcdsMessage-' + instance).hide();
        $('#flcdsLinkV-' + instance).css('opacity', 1);
        $('#flcdsLinkF-' + instance).css('opacity', 1);
        $('#flcdsRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': 0.00');

        $eXeFlipCards.refreshCards(instance);

    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeFlipCards.options[instance],
            message = '',
            score = (mOptions.gameMode ? mOptions.hits * 10 / mOptions.cardsGame.length : $eXeFlipCards.getScoreVisited(instance)).toFixed(2);

        if (typeof ($eXeFlipCards.mScorm) != 'undefined') {
            if (!auto) {
                if (!mOptions.repeatActivity && $eXeFlipCards.previousScore !== '') {
                    message = $eXeFlipCards.userName !== '' ? $eXeFlipCards.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                } else {
                    $eXeFlipCards.previousScore = score;
                    $eXeFlipCards.mScorm.set("cmi.core.score.raw", score);
                    message = $eXeFlipCards.userName !== '' ? $eXeFlipCards.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                    if (!mOptions.repeatActivity) {
                        $('#flcdsSendScore-' + instance).hide();
                    }
                    $('#flcdsRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#flcdsRepeatActivity-' + instance).show();
                }
            } else {
                $eXeFlipCards.previousScore = score;
                score = score === "" ? 0 : score;
                $eXeFlipCards.mScorm.set("cmi.core.score.raw", score);
                $('#flcdsRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                $('#flcdsRepeatActivity-' + instance).show();
                message = "";
            }
        } else {
            message = mOptions.msgs.msgScoreScorm;
        }
        if (!auto) alert(message);
    },
    addCards: function (cardsGame, instance, ) {
        var flcds = "";
        $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw').remove();
        for (var i = 0; i < cardsGame.length; i++) {
            var card = $eXeFlipCards.createCard(i, cardsGame[i])
            flcds += card;
        }
        $('#flcdsMultimedia-' + instance).prepend(flcds);

        $eXeFlipCards.setSize(instance);

    },



    showClue: function (instance) {
        var mOptions = $eXeFlipCards.options[instance],
            percentageHits = (mOptions.gameMode ? mOptions.hits * 10 / mOptions.cardsGame.length : $eXeFlipCards.getScoreVisited(instance)) * 10;
        if (mOptions.itinerary.showClue) {
            if (percentageHits >= mOptions.itinerary.percentageClue) {
                if (!mOptions.obtainedClue) {
                    mOptions.obtainedClue = true;
                    var msg = mOptions.msgs.msgInformation + ': ' + mOptions.itinerary.clueGame;
                    $('#flcdsPShowClue-' + instance).text(msg);
                    $('#flcdsShowClue-' + instance).show();
                    $('#flcdsCubierta-' + instance).show();
                    $('#flcdsGameOver-' + instance).hide();
                    $eXeFlipCards.refreshCards(instance);
                }
            }
        }
    },


    createCard: function (j, card) {
        var imgmgs = card.isCorrect ? 'FLCDSP-ImageMessageOK' : 'FLCDSP-ImageMessageKO';
        var card = '<div id="flcdsCardDraw-' + j + '" data-number="' + j + '" class="FLCDSP-CardDraw" >\
            <div class="flip-card" >\
                <div class="flip-card-inner">\
                    <div class="flip-card-front">\
                        <div class="FLCDSP-ImageContain">\
                                <img src="' + card.url + '" class="FLCDSP-Image FLCDSP-Image-Front" data-url="' + card.url + '" data-x="' + card.x + '" data-y="' + card.y + '" alt="' + card.alt + '" />\
                                <img class="FLCDSP-Cursor FLCDSP-Cursor-Front" src="' + $eXeFlipCards.idevicePath + 'exequextcursor.gif" alt="" />\
                        </div>\
                        <div class="FLCDSP-EText  FLCDSP-EText-Front" data-color="' + card.color + '" data-backcolor="' + card.backcolor + '">' + card.eText + '</div>\
                        <a href="#" data-audio="' + card.audio + '" class="FLCDSP-LinkAudio FLCDSP-LinkAudio-Front"  title="Audio"><img src="' + $eXeFlipCards.idevicePath + 'exequextplayaudio.svg" class="FLCDSP-Audio"  alt="Audio"></a>\
                    </div>\
                    <div class="flip-card-back">\
                        <div class="FLCDSP-ImageContain">\
                            <img src="' + card.urlBk + '" class="FLCDSP-Image FLCDSP-Image-Back" data-url="' + card.urlBk + '" data-x="' + card.xBk + '" data-y="' + card.yBk + '" alt="' + card.altBk + '" />\
                            <img class="FLCDSP-Cursor FLCDSP-Cursor-Back" src="' + $eXeFlipCards.idevicePath + 'exequextcursor.gif" alt="" />\
                        </div>\
                        <div class="FLCDSP-EText FLCDSP-EText-Back" data-color="' + card.colorBk + '" data-backcolor="' + card.backcolorBk + '">' + card.eTextBk + '</div>\
                        <a href="#" data-audio="' + card.audioBk + '" class="FLCDSP-LinkAudio FLCDSP-LinkAudio-Back"  title="Audio"><img src="' + $eXeFlipCards.idevicePath + 'exequextplayaudio.svg" class="FLCDSP-Audio"  alt="Audio"></a>\
                     </div>\
                </div>\
            </div>\
            <div class="FLCDSP-ImageMessage ' + imgmgs + '"></div>\
        </div>';
        return card
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
        var mOptions = $eXeFlipCards.options[instance],
            element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            mOptions.fullscreen = true;
            $eXeFlipCards.getFullscreen(element);
        } else {
            mOptions.fullscreen = false;
            $eXeFlipCards.exitFullscreen(element);
        }
        $eXeFlipCards.refreshCards(instance)
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
        var mOptions = $eXeFlipCards.options[instance];
        $('#flcdsLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#flcdsGameContainer-" + instance).show()
            $("#flcdsGameMinimize-" + instance).hide();
            $eXeFlipCards.refreshCards(instance);
        });
        $("#flcdsLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#flcdsGameContainer-" + instance).hide();
            $("#flcdsGameMinimize-" + instance).css('visibility', 'visible').show();
        });

        $("#flcdsLinkV-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeFlipCards.validateReponseGame(instance, true);
        });
        $("#flcdsLinkF-" + instance).on('click touchstart', function (e) {
            e.preventDefault();

            $eXeFlipCards.validateReponseGame(instance, false);
        });
        $('#flcdsReboot-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeFlipCards.rebootGame(instance);
        })
        $('#flcdsGameButtons-' + instance).hide();
        if (mOptions.gameMode) {
            $eXeFlipCards.showMessage(0, mOptions.msgs.mgsClickCard, instance);
            $('#flcdsGameButtons-' + instance).show();

        }
        $('#flcdsCubierta-' + instance).hide();
        $('#flcdsCodeAccessDiv-' + instance).hide();
        $('#flcdsLinkV-' + instance).css('vibility', 'hidden');
        $('#flcdsLinkF-' + instance).css('vibility', 'hidden');
        if (mOptions.itinerary.showCodeAccess) {
            $('#flcdsMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#flcdsCodeAccessDiv-' + instance).show();
            $('#flcdsGameOver-' + instance).hide();
            $('#flcdsShowClue-' + instance).hide();
            $('#flcdsCubierta-' + instance).show();

        }
        $('#flcdsCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeFlipCards.enterCodeAccess(instance);
        });

        $('#flcdsCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeFlipCards.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#flcdsPNumber-' + instance).text(mOptions.numberCards);
        $(window).on('unload', function () {
            if (typeof ($eXeFlipCards.mScorm) != "undefined") {
                $eXeFlipCards.endScorm();
            }
        });
        if (mOptions.isScorm > 0) {
            $eXeFlipCards.updateScorm($eXeFlipCards.previousScore, mOptions.repeatActivity, instance);
        }
        $('#flcdsSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeFlipCards.sendScore(instance, false);
        });
        $('#flcdsImage-' + instance).hide();
        window.addEventListener('resize', function () {
            var element = document.getElementById('flcdsGameContainer-' + instance);
            element = element || document.documentElement;
            mOptions.fullscreen = !(!document.fullscreenElement && !document.mozFullScreenElement &&
                !document.webkitFullscreenElement && !document.msFullscreenElement);
            $eXeFlipCards.refreshCards(instance);
        });

        $('#flcdsClueButton-' + instance).on('click', function (e) {
            e.preventDefault();
            $('#flcdsShowClue-' + instance).hide();
            $('#flcdsCubierta-' + instance).fadeOut();
            $eXeFlipCards.refreshCards(instance);
        });

        $('#flcdsPErrors-' + instance).text(mOptions.hits);
        if (mOptions.author.trim().length > 0 && !mOptions.fullscreen) {
            $('#flcdsAuthorGame-' + instance).html(mOptions.msgs.msgAuthor + ': ' + mOptions.author);
            $('#flcdsAuthorGame-' + instance).show();
        }
        $('#flcdsNextCard-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeFlipCards.nextCard(instance);
        });
        $('#flcdsPreviousCard-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeFlipCards.previousCard(instance);
        });
        if (mOptions.isScorm > 0) {
            $eXeFlipCards.updateScorm($eXeFlipCards.previousScore, mOptions.repeatActivity, instance);
        }


    },

    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeFlipCards.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },

    validateReponseGame: function (instance, response) {
        var mOptions = $eXeFlipCards.options[instance],
            message = "",
            type = 2,
            correctAnswer = true;
        if (mOptions.activedGame) return
        $('#flcdsLinkV-' + instance).css('opacity', 0.1);
        $('#flcdsLinkF-' + instance).css('opacity', 0.1);
        mOptions.activedGame = true;
        if (response)
            if (mOptions.cardsGame[mOptions.active].isCorrect) {
                message = mOptions.msgs.msgTrue1;
            } else {
                message = mOptions.msgs.msgTrue2;
                type = 1;
                correctAnswer = false;
            }
        else {
            if (mOptions.cardsGame[mOptions.active].isCorrect) {
                message = mOptions.msgs.msgFalse2;
                type = 1;
                correctAnswer = false;
            } else {
                message = mOptions.msgs.msgFalse1;
            }
        }
        $eXeFlipCards.updateScore(correctAnswer, instance)
        $eXeFlipCards.showMessage(type, message, instance);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeFlipCards.initialScore === '') {
                $eXeFlipCards.showScoreFooter(instance)
                $eXeFlipCards.sendScore(instance, true);
            }

        }

        mOptions.activeCard.find('.FLCDSP-ImageMessage').stop().fadeIn(500).delay(2000).fadeOut(500, function () {
            if (mOptions.active < mOptions.cardsGame.length - 1) {
                message = mOptions.msgs.mgsClickCard;
                $('#flcdsLinkV-' + instance).css('opacity', 1);
                $('#flcdsLinkF-' + instance).css('opacity', 1);
                if (mOptions.gameMode) $eXeFlipCards.showClue(instance);
                $eXeFlipCards.showMessage(0, message, instance);
                $eXeFlipCards.nextCard(instance);

            } else {
                $eXeFlipCards.gameOver(0, instance)
            }
            mOptions.activedGame = false;

        })

    },

    checkAudio: function (card, time, instance) {
        var audio = $(card).find('.FLCDSP-LinkAudio-Front').data('audio'),
            audioBK = $(card).find('.FLCDSP-LinkAudio-Back').data('audio');

        //$(card).find('.FLCDSP-LinkAudio-Back').hide();
        
        if ($(card).find('.flip-card-inner').eq(0).hasClass('flipped')) {
            if (typeof audioBK != "undefined" && audioBK.length > 3) {

                setTimeout(function () {
                    $eXeFlipCards.playSound(audioBK, instance);
                }, time);

            }
        } else {
            if (typeof audio != "undefined" && audio.length > 3) {
                setTimeout(function () {
                    $eXeFlipCards.playSound(audio, instance);
                }, time);

            }
        }
    },

    getScoreVisited: function (instance) {
        var mOptions = $eXeFlipCards.options[instance];
        var num = $eXeFlipCards.getNumberVisited(mOptions.visiteds),
            score = (num * 10) / mOptions.cardsGame.length;
        return score;
    },
    getNumberVisited: function (visiteds) {
        var visiteds = visiteds.filter(function (valor, indice) {
            return visiteds.indexOf(valor) === indice;
        });
        return visiteds.length;
    },

    getColors: function (number) {
        var colors = [];
        for (var i = 0; i < number; i++) {
            var color = $eXeFlipCards.colorRGB();
            colors.push(color);
        }
        return colors;
    },
    colorRGB: function () {
        var color = "(" + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + ")";
        return "rgb" + color;
    },

    showFrontCard: function (card) {
        var $card = card,
            $text = $card.find('.FLCDSP-EText-Front').eq(0),
            $image = $card.find('.FLCDSP-Image-Front').eq(0),
            $cursor = $card.find('.FLCDSP-Cursor-Front').eq(0),
            $audio = $card.find('.FLCDSP-LinkAudio-Front').eq(0),
            x = parseFloat($image.data('x')) || 0,
            y = parseFloat($image.data('y')) || 0,
            url = $image.data('url') || '',
            alt = $image.attr('alt') || "No disponible",
            audio = $audio.data('audio') || '',
            text = $text.html() || "",
            color = $text.data('color') || '#000000',
            backcolor = $text.data('backcolor') || '#ffffff';

        $text.hide();
        $image.hide();
        $cursor.hide();
        $audio.hide();
        if (url.length > 3 && text.length > 0) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        $cursor.hide();
                    } else {
                        var mData = $eXeFlipCards.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeFlipCards.drawImage(this, mData);
                        $image.show();
                        $cursor.hide();
                        if (x > 0 && y > 0) {
                            var left = Math.round(mData.x + (x * mData.w));
                            var top = Math.round(mData.y + (y * mData.h));
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
                });
            $text.show();
            $text.css({
                'color': color,
                'background-color': $eXeFlipCards.hexToRgba(backcolor, 0.70)
            });


        } else if (text.length > 0) {
            $text.show();
            $text.css({
                'color': color,
                'background-color': backcolor,
            });
        } else if (url.length > 3) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        $cursor.hide();
                    } else {
                        var mData = $eXeFlipCards.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeFlipCards.drawImage(this, mData);
                        $image.show();
                        $cursor.hide();
                        if (x > 0 && y > 0) {
                            var left = Math.round(mData.x + (x * mData.w));
                            var top = Math.round(mData.y + (y * mData.h));
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
                });
        }

        $audio.removeClass('FLCDSP-LinkAudioBig');
        if (audio.length > 0) {
            if (url.trim().length == 0 && text.trim().length == 0) {
                $audio.addClass('FLCDSP-LinkAudioBig')
            }
            $audio.show();

        }
    },

    hexToRgba: function (hex, opacity) {
        return 'rgba(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function (l) {
            return parseInt(hex.length % 2 ? l + l : l, 16)
        }).concat(isFinite(opacity) ? opacity : 1).join(',') + ')';
    },

    showBackCard: function (card) {
        var $card = card,
            $text = $card.find('.FLCDSP-EText-Back').eq(0),
            $image = $card.find('.FLCDSP-Image-Back').eq(0),
            $audio = $card.find('.FLCDSP-LinkAudio-Back').eq(0),
            $cursor = $card.find('.FLCDSP-Cursor-Back').eq(0),
            url = $image.data('url') || '',
            alt = $image.attr('alt') || "No disponible",
            audio = $audio.data('audio') || '',
            text = $text.html() || "",
            color = $text.data('color') || '#000000',
            backcolor = $text.data('backcolor') || '#ffffff';
        $text.hide();
        $image.hide();
        $audio.hide();
        if (url.length > 3 && text.length > 0) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        $cursor.hide();
                    } else {
                        var mData = $eXeFlipCards.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeFlipCards.drawImage(this, mData);
                        $image.show();
                        return true;
                    }
                }).on('error', function () {
                    $cursor.hide();
                });
            $text.show();
            $text.css({
                'color': color,
                'background-color': $eXeFlipCards.hexToRgba(backcolor, 0.70)
            });


        } else if (text.length > 0) {
            $text.show();
            $text.css({
                'color': color,
                'background-color': backcolor,
            });
        } else if (url.length > 3) {
            $image.attr('alt', alt);
            $image.show();
            $image.prop('src', url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        //$cursor.hide();
                    } else {
                        var mData = $eXeFlipCards.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeFlipCards.drawImage(this, mData);
                        $image.show();
                        return true;
                    }
                }).on('error', function () {
                    //$cursor.hide();
                });
        }

        $audio.removeClass('FLCDSP-LinkAudioBig');
        if (audio.length > 0) {
            if (url.trim().length == 0 && text.trim().length == 0) {
                $audio.addClass('FLCDSP-LinkAudioBig')
            }

        }
    },
    showCard: function (card, instance) {
        $eXeFlipCards.showFrontCard(card);
        $eXeFlipCards.showBackCard(card);

    },

    alfaBColor: function (bcolor) {
        var newBGColor = bcolor.replace('rgb', 'rgba').replace(')', ',.8)'); //rgba(100,100,100,.8)
        return newBGColor
    },

    refreshCards: function (instance) {
        var mOptions = $eXeFlipCards.options[instance],
            $flcds = $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw');
        mOptions.refreshCard = true;
        $eXeFlipCards.setSize(instance);
        $flcds.each(function () {
            $eXeFlipCards.showCard($(this), instance);

        });
        if (mOptions.navigation) {
            var audio = mOptions.activeCard.find('.FLCDSP-LinkAudio-Front').data('audio');
            if (typeof audio != "undefined" && audio.length > 3) {
                $eXeFlipCards.playSound(audio, instance);
            }
        }
        mOptions.refreshCard = false;
    },

    enterCodeAccess: function (instance) {
        var mOptions = $eXeFlipCards.options[instance];
        if (mOptions.itinerary.codeAccess == $('#flcdsCodeAccessE-' + instance).val()) {
            $('#flcdsCodeAccessDiv-' + instance).hide();
            $('#flcdsCubierta-' + instance).hide();

        } else {
            $('#flcdsMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#flcdsCodeAccessE-' + instance).val('');
        }
    },

    setSize: function (instance) {
        var mOptions = $eXeFlipCards.options[instance],
            fontsz = 26;

        var $pw = $('#flcdsGameButtons-' + instance).parents('.FLCDSP-MainContainer').eq(0).width();
        var swidth = $pw < 450 ? $pw * 0.8 : 300;
        swidth = swidth > 300 ? 300 : swidth;
        if (mOptions.navigation || mOptions.gameMode) {


            if ($pw > 450) {
                $('#flcdsGameButtons-' + instance).removeClass('FLCDSP-GameButtons-Movil');
                $('.FLCDSP-GameContainer').find('div.exeQuextButtonsF').removeClass('exeQuextButtonsF-movil');

                fontsz = 26;
                $('#flcdsGameButtons-' + instance)
                $('#flcdsGameButtons-' + instance).height(swidth);


            } else {
                $('#flcdsGameButtons-' + instance).height($('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw').eq(0).height());

                $('#flcdsGameButtons-' + instance).addClass('FLCDSP-GameButtons-Movil');
                $('.FLCDSP-GameContainer').find('div.exeQuextButtonsF').addClass('exeQuextButtonsF-movil');
                $('#flcdsGameButtons-' + instance).height(70);
                fontsz = 26;
            }
            $('#flcdsNavigation-' + instance).width(screen.width);

        } else {
            $('#flcdsGameButtons-' + instance).height($('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw').eq(0).height());

        }

        $('#flcdsMultimedia-' + instance).find('.flip-card').each(function () {
            $(this).width(swidth);
            $(this).height(swidth);
        })


        $('#flcdsMultimedia-' + instance).find('.flip-card-back').each(function () {
            $eXeFlipCards.textfill(this, fontsz, instance);

        })


        $('#flcdsMultimedia-' + instance).find('.flip-card-front').each(function () {
            $eXeFlipCards.textfill(this, fontsz, instance);

        });
    },

    textfill: function (that, maxsize, instance) {
        var pw = $('#flcdsGameButtons-' + instance).parents('.FLCDSP-MainContainer').eq(0).width();

        var fontSize = pw > 450 ? maxsize : 24,
            t = $(".FLCDSP-EText", that),
            maxHeight = $(that).height(),
            textHeight;
        do {
            t.css({
                'font-size': fontSize
            });
            textHeight = t.height();
            fontSize = fontSize - 1;
        } while (textHeight > maxHeight);
    },

    initCards: function (instance) {
        var $flcds = $('#flcdsMultimedia-' + instance).find('.FLCDSP-CardDraw');
        $flcds.each(function () {
            $eXeFlipCards.showCard($(this), instance);
        });
        if($eXeFlipCards.hasLATEX){
            $eXeFlipCards.updateLatex('flcdsMultimedia-' + instance);
        }
        

    },

    isMobile: function () {

        return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i))
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

    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeFlipCards.options[instance],
            obtainedPoints = 0,
            sscore = 0;
        if (correctAnswer) {
            mOptions.hits++;
            obtainedPoints = 10 / mOptions.cardsGame.length;

        } else {
            mOptions.errors++;
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        sscore = mOptions.score.toFixed(2)
        $('#flcdsPScore-' + instance).text(sscore);
        $('#flcdsPHits-' + instance).text(mOptions.hits);
        $('#flcdsPErrors-' + instance).text(mOptions.errors);
        $('#flcdsPNumber-' + instance).text(mOptions.cardsGame.length - mOptions.hits - mOptions.errors);

    },


    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeFlipCards.borderColors.red, $eXeFlipCards.borderColors.green, $eXeFlipCards.borderColors.blue, $eXeFlipCards.borderColors.yellow],
            color = colors[type],
            $flcdsMessage = $('#flcdsMessage-' + instance);
        $flcdsMessage.html(message);
        $flcdsMessage.css({
            'color': color,
            'font-style': 'bold'
        });
        $flcdsMessage.show();
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
        if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }
}
$(function () {
    $eXeFlipCards.init();
});