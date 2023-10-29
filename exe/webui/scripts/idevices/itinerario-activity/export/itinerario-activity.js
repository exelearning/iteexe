/**
 * Select Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeItinerario = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#00a300',
        red: '#b3092f',
        white: '#f9f9f9',
        yellow: '#f3d55a',
        grey: '#777777',
        incorrect: '#d9d9d9',
        correct: '#00ff00',
        violet: 'rgb(105, 3, 105)',
        orange: 'rgb(0, 0, 0)'

    },
    colors: {
        black: "#1c1b1b",
        blue: '#dfe3f1',
        green: '#caede8',
        red: '#fbd2d6',
        white: '#f9f9f9',
        yellow: '#fcf4d3',
        correct: '#dcffdc',
        violet: 'rgb(218, 78, 218)',
        orange: '(0, 0, 0);'
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
    previousScore: '',
    initialScore: '',
    msgs: '',
    youtubeLoaded: false,
    isInExe: false,
    hasLATEX: false,
    idItinerario: '',
    initialEvaluation: false,
    idevicesTitles: [],
    init: function () {
        this.activities = $('.itinerario-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeItinerario.supportedBrowser('itn')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Multiple Choice Quiz') + '</p>');
            return;
        }
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/itinerario-activity/export/" : "";
        this.enable();
    },

    enable: function () {
        $eXeItinerario.loadGame();
    },

    loadGame: function () {
        $eXeItinerario.options = {};
        $eXeItinerario.activities.each(function (i) {
            if (i == 0) {
                var version = $(".itinerario-version", this).eq(0).text(),
                    dl = $(".itinerario-DataGame", this),
                    imagesLink = $('.itinerario-LinkImages', this),
                    audioLink = $('.itinerario-LinkAudios', this),
                    mOption = $eXeItinerario.loadDataGame(dl, imagesLink, audioLink, version),
                    msg = mOption.msgs.msgPlayStart;
                $eXeItinerario.options = mOption;
                var itn = "";
                if (mOption.ideviceType == 1) {
                    itn = $eXeItinerario.createInterfaceTest();
                    dl.before(itn).remove();
                    $('#itnGameMinimize').hide();
                    $('#itnGameContainer').hide();
                    if (mOption.showMinimize) {
                        $('#itnGameMinimize').css({
                            'cursor': 'pointer'
                        }).show();
                    } else {
                        $('#itnGameContainer').show();
                    }
                    $('#itnMessageMaximize').text(msg);
                    $eXeItinerario.addEvents();
                    if ($eXeItinerario.hasLATEX && typeof (MathJax) == "undefined") {
                        var math = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML";
                        $exe.loadScript(math);
                    }
                    if (!mOption.useTime) {
                        $('#itnIconTime').hide();
                        $('#itnPTime').hide();
                        $('#itnPTime').siblings('strong').hide();
                    }
                } else if (mOption.ideviceType == 3) {

                    itn = $eXeItinerario.createInterfaceSlide();
                    dl.before(itn).remove();
                    $('section#main').find('article.ItinerarioIdevice').show();
                    $('section#main').find('.itinerario-instructions').show();
                    $eXeItinerario.sortIdeviceSlide();
                    $eXeItinerario.addEventsSlide();

                } else {
                    itn = $eXeItinerario.createInterfaceNode();
                    dl.before(itn).remove();
                    $('section#main').find('article.ItinerarioIdevice').hide();
                    $('section#main').find('.itinerario-instructions').hide();

                }
                if (mOption.ideviceType == 1 || mOption.ideviceType == 2) {
                    if (typeof mOption.itenerayID != "undefined" || mOption.itenerayID.length > 0) {
                        var dataIts = $eXeItinerario.getDataStorage(mOption.itenerayID);
                        if (dataIts) {
                            mOption.itinerary = dataIts.itinerary;
                            if (mOption.ideviceType == 1) {
                                mOption.score = dataIts.score;
                                mOption.hits = dataIts.hits;
                                mOption.errors = dataIts.errors;
                                $eXeItinerario.showTest(mOption)
                            } else {
                                $('section#main').find('article.ItinerarioIdevice').hide();
                            }
                        }
                    }
                    $eXeItinerario.sortIdevicePage(mOption.itineraries, mOption.itinerary)
                }

                if (mOption.ideviceType != 1) {
                    $('.itinerario-instructions').hide();
                    $('.itinerario-feedback-game').hide();
                }
                if (mOption.ideviceType == 3) {
                    $('.itinerario-instructions').show();
                } else {
                    $eXeItinerario.colapsedIdevices(mOption.collapsedIdi);
                }

            } else {
                alert('Sólo puede haber un iDevice tipo Itinerario por página');
            }
        });

    },
    sortIdevicePage: function (itineraries, itin) {
        if (typeof itin == "undefined" || itin >= itineraries.length) {
            $eXeItinerario.showIdevices(itineraries, itinerary)
            return;
        }
        var itinerary = itin;
        var idvs = JSON.parse(JSON.stringify(itineraries[itinerary].idevices)),
            titles = idvs.map(object => object["title"]),
            $articles = $('section#main article:not(.ItinerarioIdevice)');

        $articles.sort(function (a, b) {
            var titleA = $(a).find("h1").text();
            var titleB = $(b).find("h1").text();
            return titles.indexOf(titleA) - titles.indexOf(titleB);
        });
        var $main = $('section#main');
        $.each($articles, function (index, article) {
            $main.append(article);
        });
        $main.append($('#packageLicense'));
        $eXeItinerario.showIdevices(itineraries, itinerary)
    },
    sortIdeviceSlide: function () {
        var $articles = $('section#main article:not(.ItinerarioIdevice)'),
            $main = $('section#main');
        $.each($articles, function (index, article) {
            $main.append(article);
        });
        $main.append($('#packageLicense'));

    },
    showIdevices: function (itineraries, itinerary) {
        var mOptions = $eXeItinerario.options;
        var titles = [];
        if (typeof itinerary != "undefined" && itinerary <= mOptions.numItineraries) {
            titles = $.map(itineraries[itinerary].idevices, function (objeto) {
                if (objeto.state) {
                    return objeto.title;
                }
            });
        }
        $('section#main').find('article').hide();
        $('section#main').find('article').each(function () {
            var title = $(this).find('h1.iDeviceTitle').eq(0).text()
            if (titles.indexOf(title) != -1) {
                $(this).show();
            }
        })
        $('section#main').find('article.ItinerarioIdevice').eq(0).hide();
        if (mOptions.ideviceType == 1 || mOptions.ideviceType == 3) {
            $('section#main').find('article.ItinerarioIdevice').eq(0).show();
        }

    },
    colapsedIdevices: function (collapsed) {
        $('section#main article').find('.iDeviceTitle').each(function () {
            if (collapsed.indexOf($(this).text()) != -1) {
                $(this).parents('header').find('p.toggle-idevice a').click();
            }
        });

    },
    showTest: function (options) {
        if (options.itinerary >= options.itineraries.length) {
            return;
        }
        var sscore = options.score.toFixed(2);
        if (options.repeatTest == 0) {
            $('section#main').find('article.ItinerarioIdevice').eq(0).hide();
            $('#itnLinkVideoIntroShow').hide();
            $('#itnStartGame').hide();
            $('.itinerario-instructions').hide();
            $('#itnMultimedia').hide();
            $('#itnGameScoreBoard').hide();
            $('#itnCodeAccessDiv').hide();
            var msg = options.msgs.msgNotRepeat,
                msg1 = options.itineraries[options.itinerary].message
            if (msg1.length > 0) {
                msg = '<p>' + msg1 + '</p>' + msg;
            }
            $eXeItinerario.showMessage(0, msg)

        } else if (options.repeatTest == 1) {
            $('#itnPNumber').text('0');
            $('#itnStartGame').text(options.msgs.msgNewGame);
            $('#itnGameContainer .ITNP-StartGame').show();
            $('#itnStartGame').show();
            $('.itinerario-instructions').hide();
            $('#itnMultimedia').hide();
            $('#itnPScore').text(sscore);
            $('#itnPHits').text(options.hits);
            $('#itnPErrors').text(options.errors);

            if (options.evaluationType == 0) {
                $('#itnMultimedia').hide();
                $('#itnGameScoreBoard').hide();
            }
            var msg = options.msgs.msgRepeat,
                msg1 = options.itineraries[options.itinerary].message
            if (msg1.length > 0) {
                msg = '<p>' + msg1 + '</p>' + msg;
            }
            $eXeItinerario.showMessage(0, msg)

        } else if (options.repeatTest == 2) {
            $('section#main').find('article.ItinerarioIdevice').eq(0).hide();
            $('#itnStartGame').hide();
            $('.itinerario-instructions').hide();
            $('#itnMultimedia').hide();
            $('#itnGameScoreBoard').hide();
            var msg = options.msgs.msgRepeat,
                msg1 = options.itineraries[options.itinerary].message
            if (msg1.length > 0) {
                msg = '<p>' + msg1 + '</p>' + msg;
            }
            $eXeItinerario.showMessage(0, msg)
            $('#itnCodeAccessDiv').show();
        }

    },

    loadMathJax: function () {
        var tag = document.createElement('script');
        tag.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML";
        tag.async = true;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    createInterfaceNode: function () {
        var msgs = $eXeItinerario.options.msgs,
            html = '<div class="ITNP-MainContainer">\
                    <div id="itnNode">' + msgs.msgNode + '</div>\
                </div>'
        return html;
    },

    createInterfaceSlide: function () {
        var msgs = $eXeItinerario.options.msgs,
            html = '<div class="ITNP-MainContainer">\
                    <div id="itnSilde" class="ITNP-SlideDiv">\
                        <div class="ITNP-SlideDiv">\
                            <a https="#" id="itnFirst" class="ITNP-SlideButtons">\u00AB\u00AB</a>\
                            <a https="#" id="itnPrevious" class="ITNP-SlideButtons">\u00AB</a>\
                        </div>\
                        <div id="itnNumSlideDiv" class="ITNP-SlideDiv"></div>\
                        <divclass="ITNP-SlideDiv" >\
                            <a https="#" id="itnNext" class="ITNP-SlideButtons">\u00BB</a>\
                            <a https="#" id="itnLast" class="ITNP-SlideButtons">\u00BB\u00BB</a>\
                        </div>\
                    </div>\
                </div>'
        return html;
    },
    addNumberIdevice: function () {
        var mOptions = $eXeItinerario.options;
        var html = ''
        for (var i = 0; i < mOptions.numSlides; i++) {
            html += '<a https="#"  data-number="' + i + '"class="ITNP-SlideButtonsN ITNP-NumberID">' + (i + 1) + '</a>'
        }
        $('#itnNumSlideDiv').empty();
        $('#itnNumSlideDiv').append(html)
    },
    createInterfaceTest: function () {
        var html = '',
            path = $eXeItinerario.idevicePath,
            msgs = $eXeItinerario.options.msgs;
        html += '<div class="ITNP-MainContainer">\
        <div class="ITNP-GameMinimize" id="itnGameMinimize">\
            <a href="#" class="ITNP-LinkMaximize" id="itnLinkMaximize" title="' + msgs.msgMaximize + '"><img src="' + path + 'itinerarioIcon.svg" class="ITNP-IconMinimize ITNP-Activo" alt="">\
            <div class="ITNP-MessageMaximize" id="itnMessageMaximize"></div></a>\
        </div>\
        <div class="ITNP-GameContainer" id="itnGameContainer">\
            <div class="ITNP-GameScoreBoard" id="itnGameScoreBoard">\
                <div class="ITNP-GameScores">\
                    <div class="ITNP-Icons  ITNP-Icons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="itnPNumber">0</span></p>\
                    <div class="ITNP-Icons ITNP-Icons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="itnPHits">0</span></p>\
                    <div class="ITNP-Icons  ITNP-Icons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="itnPErrors">0</span></p>\
                    <div class="ITNP-Icons  ITNP-Icons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="itnPScore">0</span></p>\
                </div>\
                <div class="ITNP-TimeNumber">\
                    <strong class="sr-av">' + msgs.msgTime + ':</strong>\
                    <div id="itnIconTime" class="ITNP-Icons ITNP-Icons-Time" title="' + msgs.msgTime + '"></div>\
                    <p id="itnPTime" class="ITNP-PTime">00:00</p>\
                    <a href="#" class="ITNP-LinkMinimize" id="itnLinkMinimize" title="' + msgs.msgMinimize + '">\
                        <strong class="sr-av">' + msgs.msgMinimize + ':</strong>\
                        <div class="ITNP-Icons ITNP-Icons-Minimize ITNP-Activo"></div>\
                    </a>\
                    <a href="#" class="ITNP-LinkFullScreen" id="itnLinkFullScreen" title="' + msgs.msgFullScreen + '">\
                        <strong class="sr-av">' + msgs.msgFullScreen + ':</strong>\
                        <div class="ITNP-Icons ITNP-Icons-FullScreen ITNP-Activo" id="itnFullScreen"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="ITNP-ShowClue" id="itnShowClue">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="ITNP-PShowClue ITNP-parpadea" id="itnPShowClue"></p>\
            </div>\
            <div class="ITNP-Multimedia" id="itnMultimedia">\
                <img class="ITNP-Cursor" id="itnCursor" src="' + path + 'exequextcursor.gif" alt="" />\
                <img  src="' + path + 'itinerarioHome.svg" class="ITNP-Image" id="itnImagen" alt="' + msgs.msgNoImage + '" />\
                <div class="ITNP-EText" id="itnEText"></div>\
                <img src="' + path + 'itinerarioHome.svg" class="ITNP-Cover" id="itnCover" alt="' + msgs.msgNoImage + '" />\
                <div class="ITNP-Video" id="itnVideo"></div>\
                <div class="ITNP-Protector" id="itnProtector"></div>\
                <a href="#" class="ITNP-LinkAudio" id="itnLinkAudio" title="' + msgs.msgAudio + '"><img src="' + path + 'exequextaudio.png" class="ITNP-Activo" alt="' + msgs.msgAudio + '">\</a>\
                <div class="ITNP-GameOver" id="itnGamerOver">\
                        <div class="ITNP-DataImage">\
                            <img src="' + path + 'exequextwon.png" class="ITNP-HistGGame" id="itnHistGame" alt="' + msgs.msgAllQuestions + '" />\
                            <img src="' + path + 'exequextlost.png" class="ITNP-LostGGame" id="itnLostGame"  alt="' + msgs.msgAllQuestions + '" />\
                        </div>\
                        <div class="ITNP-DataScore">\
                            <p id="itnOverScore"><strong>Score:</strong> 0</p>\
                            <p id="itnOverHits"><strong>Hits:</strong> 0</p>\
                            <p id="itnOverErrors"><strong>Errors:</strong> 0</p>\
                        </div>\
                </div>\
            </div>\
            <div class="ITNP-AuthorLicence" id="itnAuthorLicence">\
                <div class="sr-av">' + msgs.msgAuthor + ':</div>\
                <p id="itnPAuthor"></p>\
            </div>\
            <div class="sr-av" id="itnStartGameSRAV">' + msgs.msgPlayStart + ':</div>\
            <div class="ITNP-StartGame"><a href="#" id="itnStartGame"></a></div>\
            <div class="ITNP-QuestionDiv" id="itnQuestionDiv">\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="ITNP-Question" id="itnQuestion"></div>\
                <div class="ITNP-OptionsDiv" id="itnOptionsDiv">\
                    <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                    <a href="#" class="ITNP-Option1 ITNP-Options" id="itnOption1" data-number="0"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                    <a href="#" class="ITNP-Option2 ITNP-Options" id="itnOption2" data-number="1"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                    <a href="#" class="ITNP-Option3 ITNP-Options" id="itnOption3" data-number="2"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                    <a href="#" class="ITNP-Option4 ITNP-Options" id="itnOption4" data-number="3"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' E:</div>\
                    <a href="#" class="ITNP-Option5 ITNP-Options" id="itnOption5" data-number="4"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' F:</div>\
                    <a href="#" class="ITNP-Option6 ITNP-Options" id="itnOption6" data-number="5"></a>\
                </div>\
            </div>\
            <div class="ITNP-WordsDiv" id="itnWordDiv">\
                <div class="sr-av">' + msgs.msgAnswer + ':</div>\
                <div class="ITNP-Prhase" id="itnEPhrase"></div>\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="ITNP-Definition" id="itnDefinition"></div>\
                <div class="ITNP-DivReply" id="itnDivResponder">\
                    <input type="text" value="" class="ITNP-EdReply" id="itnEdAnswer" autocomplete="off">\
                    <a href="#" id="itnBtnReply" title="' + msgs.msgAnswer + '">\
                        <strong class="sr-av">' + msgs.msgAnswer + '</strong>\
                        <div class="ITNP-Icons-Submit ITNP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="ITNP-BottonContainerDiv" id="itnBottonContainer">\
                <a href="#" class="ITNP-LinkVideoIntroShow" id="itnLinkVideoIntroShow" title="' + msgs.msgVideoIntro + '">\
                    <strong class="sr-av">' + msgs.msgVideoIntro + ':</strong>\
                    <div class="ITNP-Icons ITNP-Icons-Video"></div>\
                </a>\
                <div class="ITNP-AnswersDiv" id="itnAnswerDiv">\
                    <div class="ITNP-Answers" id="itnAnswers"></div>\
                    <a href="#" id="itnButtonAnswer" title="' + msgs.msgAnswer + '">\
                        <strong class="sr-av">' + msgs.msgAnswer + '</strong>\
                        <div class="ITNP-Icons-Submit ITNP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="ITNP-CodeAccessDiv" id="itnCodeAccessDiv">\
               <p class="ITNP-MessageCodeAccessE" id="itnMesajeAccesCodeE"></p>\
                <div class="ITNP-DataCodeAccessE">\
                    <label for="itnCodeAccessE" class="sr-av">' + msgs.msgAccessCode + ':</label><input type="text" class="ITNP-CodeAccessE"  id="itnCodeAccessE" >\
                    <a href="#" id="itnCodeAccessButton" title="' + msgs.msgSubmit + '">\
                        <strong class="sr-av">' + msgs.msgSubmit + '</strong>\
                        <div class="ITNP-Icons ITNP-Icons-Submit ITNP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
             <div class="ITNP-VideoIntroDiv" id="itnVideoIntroDiv">\
                <div class="ITNP-VideoIntro" id="itnVideoIntro"></div>\
                <input type="button" class="ITNP-VideoIntroClose" id="itnVideoIntroClose" value="' + msgs.msgClose + '"/>\
            </div>\
        </div>\
    </div>'

        return html;
    },

    centerImage: function (image) {
        var $image = $(image),
            wDiv =$image.parent().width() > 0 ? $image.parent().width() : 1,
            hDiv = $image.parent().height() > 0 ? $image.parent().height() : 1,
            naturalWidth = $image[0].naturalWidth,
            naturalHeight = $image[0].naturalHeight,
            varW = naturalWidth / wDiv,
            varH = naturalHeight / hDiv,
            wImage = wDiv,
            hImage = hDiv,
            xImage = 0,
            yImage = 0;
        if (varW > varH) {
            wImage = parseInt(wDiv);
            hImage = parseInt(naturalHeight / varW);
            yImage = parseInt((hDiv - hImage) / 2);
        } else {
            wImage = parseInt(naturalWidth / varH);
            hImage = parseInt(hDiv);
            xImage = parseInt((wDiv - wImage) / 2);
        }
        $image.css({
            width: wImage,
            height: hImage,
            position: 'absolute',
            left: xImage,
            top: yImage
        });
        $eXeItinerario.positionPointer()
    },

    loadDataGame: function (data, imgsLink, audioLink, version) {
        var json = $eXeItinerario.Decrypt(data.text()),
            mOptions = $eXeItinerario.isJsonString(json);
        version = typeof version == "undefined" || version == '' ? 0 : parseInt(version);
        var hasLatex = /\\\((.*)\\\)|\\\[(.*)\\\]/.test(json);
        if (hasLatex) {
            $eXeItinerario.hasLATEX = true;
        }
        mOptions.gameOver = false;
        mOptions.hasVideo = false;
        mOptions.waitStart = false;
        mOptions.waitPlayIntro = false;
        mOptions.hasVideoIntro = false;
        mOptions.gameStarted = false;
        mOptions.score = 0;
        mOptions.itinerary = 0;
        mOptions.percentajeQuestions = typeof mOptions.percentajeQuestions != 'undefined' ? mOptions.percentajeQuestions : 100;
        for (var i = 0; i < mOptions.selectsGame.length; i++) {
            mOptions.selectsGame[i].audio = typeof mOptions.selectsGame[i].audio == 'undefined' ? '' : mOptions.selectsGame[i].audio
            mOptions.selectsGame[i].hit = typeof mOptions.selectsGame[i].hit == "undefined" ? 0 : mOptions.selectsGame[i].hit;
            mOptions.selectsGame[i].error = typeof mOptions.selectsGame[i].error == "undefined" ? 0 : mOptions.selectsGame[i].error;
            mOptions.selectsGame[i].msgHit = typeof mOptions.selectsGame[i].msgHit == "undefined" ? "" : mOptions.selectsGame[i].msgHit;
            mOptions.selectsGame[i].msgError = typeof mOptions.selectsGame[i].msgError == "undefined" ? "" : mOptions.selectsGame[i].msgError;
            mOptions.selectsGame[i].url = $eXeItinerario.extractURLGD(mOptions.selectsGame[i].url);
            if (mOptions.selectsGame[i].type == 2) {
                mOptions.hasVideo = true;
            }
        }
        mOptions.playerAudio = "";
        mOptions.percentajeFB = typeof mOptions.percentajeFB != 'undefined' ? mOptions.percentajeFB : 100;
        mOptions.customMessages = typeof mOptions.customMessages != "undefined" ? mOptions.customMessages : false;
        mOptions.gameOver = false;
        mOptions.url = mOptions.url == "undefined" ? '' : mOptions.url;
        mOptions.poolOptions = [0, 0, 0, 0, 0, 0];
        imgsLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.selectsGame.length) {
                mOptions.selectsGame[iq].url = $(this).attr('href');
                if (mOptions.selectsGame[iq].url.length < 4 && mOptions.selectsGame[iq].type == 1) {
                    mOptions.selectsGame[iq].url = "";
                }
            }
        });
        audioLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.selectsGame.length) {
                mOptions.selectsGame[iq].audio = $(this).attr('href');
                if (mOptions.selectsGame[iq].audio.length < 4) {
                    mOptions.selectsGame[iq].audio = "";
                }
            }
        });
        mOptions.selectsGame = mOptions.randomQuestions ? $eXeItinerario.shuffleAds(mOptions.selectsGame) : mOptions.selectsGame;
        mOptions.numberQuestions = mOptions.selectsGame.length;
        return mOptions;
    },
    saveDataStorage: function () {
        var mOptions = $eXeItinerario.options;
        if (typeof mOptions.itenerayID == "undefined" || mOptions.itenerayID.length == 0) return;
        var data = {
            'score': mOptions.score,
            'itinerary': mOptions.itinerary,
            'evaluationType': mOptions.evaluationType,
            'numItineraries': mOptions.numItineraries,
            'itinerayPoints': mOptions.itinerayPoints,
            'score': mOptions.score,
            'hits': mOptions.hits,
            'errors': mOptions.errors,
        };
        localStorage.setItem('iteneraryData-' + mOptions.itenerayID, JSON.stringify(data));

    },

    getArticleTitles: function () {
        var titles = [];
        $("article").each(function () {
            var header = $(this).find("h1");
            if (header.length) {
                titles.push(header.text());
            }
        });
        return titles;
    },

    sortInvers: function (array) {

        array.sort(function (a, b) {
            return b.localeCompare(a);
        });
        return array;
    },
    sortArticlesByTitle: function (titles) {
        //var titles = getArticleTitles();
        $.each(titles, function (index, title) {
            $("article").each(function () {
                var header = $(this).find('.iDeviceTitle');
                if (header.length && header.text() === title) {
                    $(this).appendTo($(this).parent());
                    return false;
                }
            });
        });
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
                array = $eXeItinerario.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
        var mOptions = $eXeItinerario.options;
        mOptions.player = new YT.Player('itnVideo', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onReady': $eXeItinerario.onPlayerReady,
                'onError': $eXeItinerario.onPlayerError
            }
        });

        mOptions.playerIntro = new YT.Player('itnVideoIntro', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 1
            },
            events: {
                'onReady': $eXeItinerario.onPlayerReady1,
                'onError': $eXeItinerario.onPlayerError
            }
        });
        $('#itnVideo').hide();
        $('#itnCodeAccessE').prop('readonly', false);
    },
    youTubeReadyOne: function () {
        var mOptions = $eXeItinerario.options;
        mOptions.player = new YT.Player('itnVideo', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 0
            },
            events: {
                'onReady': $eXeItinerario.onPlayerReady,
                'onError': $eXeItinerario.onPlayerError
            }
        });
        $('#itnVideo').hide();

        mOptions.playerIntro = new YT.Player('itnVideoIntro', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 1
            },
            events: {
                'onReady': $eXeItinerario.onPlayerReady1,
                'onError': $eXeItinerario.onPlayerError1
            }
        });
    },

    preloadGame: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.ideviceType != 1) return;
        if (mOptions.waitStart) {
            mOptions.waitStart = false;
            setTimeout(function () {
                $eXeItinerario.startGame();
            }, 1000);
        }
        if (mOptions.waitPlayIntro) {
            mOptions.waitPlayIntro = false;
            setTimeout(function () {
                $eXeItinerario.playVideoIntro();
                $('#itnStartGame').text(mOptions.msgs.msgPlayStart);
            }, 1000);

        }
    },

    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    },
    playSound: function (selectedFile) {
        var mOptions = $eXeItinerario.options;
        selectedFile = $eXeItinerario.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
        mOptions.playerAudio.addEventListener("canplaythrough", function (event) {
            mOptions.playerAudio.play();
        });

    },
    stopSound: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.playerAudio && typeof mOptions.playerAudio.pause == "function") {
            mOptions.playerAudio.pause();
        }
    },

    playVideoIntro: function () {
        $('#itnVideoIntroDiv').show();
        var mOptions = $eXeItinerario.options,
            idVideo = $eXeItinerario.getIDYoutube(mOptions.idVideo);
        mOptions.endVideo = mOptions.endVideo <= mOptions.startVideo ? 36000 : mOptions.endVideo;
        $eXeItinerario.startVideoIntro(idVideo, mOptions.startVideo, mOptions.endVideo);
    },

    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeItinerario.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        var video = event.target.h.id;
        if (video == "itnVideo") {
            $eXeItinerario.preloadGame();
        }
    },
    onPlayerReady1: function (event) {
        var video = event.target.h.id;
        if (video == "itnVideoIntro") {
            $eXeItinerario.preloadGame();
        }
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideoIntro: function (id, start, end) {
        var mOptions = $eXeItinerario.options,
            mstart = start < 1 ? 0.1 : start;
        if (mOptions.playerIntro) {
            if (typeof mOptions.playerIntro.loadVideoById == "function") {
                mOptions.playerIntro.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
        }
    },
    stopVideoIntro: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.playerIntro) {
            if (typeof mOptions.playerIntro.pauseVideo == "function") {
                mOptions.playerIntro.pauseVideo();
            }
        }
    },
    startVideo: function (id, start, end) {
        var mOptions = $eXeItinerario.options,
            mstart = start < 1 ? 0.1 : start;
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
    playVideo: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.player) {
            if (typeof mOptions.player.playVideo == "function") {
                mOptions.player.playVideo();
            }
        }
    },
    stopVideo: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.player) {
            if (typeof mOptions.player.pauseVideo == "function") {
                mOptions.player.pauseVideo();
            }
        }
    },
    muteVideo: function (mute) {
        var mOptions = $eXeItinerario.options;
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

    addEventsSlide: function () {
        var mOptions = $eXeItinerario.options;
        mOptions.activeSlide = -1;
        mOptions.slides = $('section#main article:not(.ItinerarioIdevice)');
        mOptions.numSlides = mOptions.slides.toArray().length;
        mOptions.slides.hide();
        //mOptions.slides.eq(mOptions.activeSlide).show();
        $eXeItinerario.addNumberIdevice();
        ///$('#itnNumSlide').text((mOptions.activeSlide + 1) + '/' + mOptions.numSlides);
        $('.ITNP-SlideButtons').css('color', '#333');
        $('#itnFirst').on('click', function () {
            $eXeItinerario.firtSlide();
        });
        $('#itnPrevious').on('click', function () {
            $eXeItinerario.previousSlide();
        });
        $('#itnNext').on('click', function () {
            $eXeItinerario.nextSlide();
        });
        $('#itnLast').on('click', function () {
            $eXeItinerario.lastSlide();
        });
        $('.ITNP-SlideButtonsN').on('click', function () {
            var numslide = parseInt($(this).data('number'))
            $eXeItinerario.toSlide(numslide);
        })

        $eXeItinerario.colorSlideButtons(-1, mOptions.numSlides);

    },

    firtSlide: function () {
        var mOptions = $eXeItinerario.options;
        mOptions.activeSlide = 0;
        if (mOptions.numSlides == 0) return;
        mOptions.slides.hide();
        mOptions.slides.eq(mOptions.activeSlide).show();
        $eXeItinerario.colorSlideButtons(0, mOptions.numSlides);

    },
    nextSlide: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.numSlides == 0) return;

        if (mOptions.activeSlide < mOptions.numSlides - 1) {
            mOptions.slides.hide();
            mOptions.activeSlide++;
            mOptions.slides.eq(mOptions.activeSlide).fadeIn();
        }
        $eXeItinerario.colorSlideButtons(mOptions.activeSlide, mOptions.numSlides);

    },
    previousSlide: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.numSlides == 0) return;
        if (mOptions.activeSlide > 0) {
            mOptions.slides.hide();
            mOptions.activeSlide--;
            mOptions.slides.eq(mOptions.activeSlide).fadeIn();
        }
        $eXeItinerario.colorSlideButtons(mOptions.activeSlide, mOptions.numSlides);


    },
    lastSlide: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.numSlides == 0) return;
        mOptions.activeSlide = mOptions.numSlides - 1;
        mOptions.slides.hide();
        mOptions.slides.eq(mOptions.activeSlide).fadeIn();
        $eXeItinerario.colorSlideButtons(mOptions.activeSlide, mOptions.numSlides);

    },
    toSlide: function (active) {
        var mOptions = $eXeItinerario.options;
        if (mOptions.numSlides == 0) return;
        if (active < 0 || active >= mOptions.numSlides) return;
        mOptions.activeSlide = active;
        mOptions.slides.hide();
        mOptions.slides.eq(active).show();
        $eXeItinerario.colorSlideButtons(active, mOptions.numSlides);
    },
    colorSlideButtons: function (active, num) {
        $('.ITNP-SlideButtons').css('color', '#333');
        $('.ITNP-SlideButtonsN').css('color', '#333');

        if (num == 0) return;
        if (active < 0) {
            $('.ITNP-SlideButtons').eq(2).css('color', '#3398bd');
            $('.ITNP-SlideButtons').eq(3).css('color', '#3398bd');
        } else if (active == 0 && num == 1) {
            $('.ITNP-SlideButtons').css('color', '#333');
        } else if (active == 0 && num > 1) {
            $('.ITNP-SlideButtons').eq(2).css('color', '#3398bd');
            $('.ITNP-SlideButtons').eq(3).css('color', '#3398bd');
        } else if (active > 0) {
            $('.ITNP-SlideButtons').eq(0).css('color', '#3398bd');
            $('.ITNP-SlideButtons').eq(1).css('color', '#3398bd');
            if (active < num - 1) {
                $('.ITNP-SlideButtons').eq(2).css('color', '#3398bd');
                $('.ITNP-SlideButtons').eq(3).css('color', '#3398bd');
            }
        }

        $('.ITNP-SlideButtonsN').css('color', '#333');
        if (active < num && active >= 0) {
            $('.ITNP-SlideButtonsN').eq(active).css('color', '#3398bd');
        }
    },

    addEvents: function () {
        var mOptions = $eXeItinerario.options;
        mOptions.respuesta = '';

        window.addEventListener('resize', function () {
            $eXeItinerario.refreshImageActive();
        });
        $('#itnCodeAccessButton').on('click touchstart', function (e) {
            e.preventDefault();
            $eXeItinerario.enterCodeAccess();
        });
        $('#itnCodeAccessE').on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeItinerario.enterCodeAccess();
                return false;
            }
            return true;
        });
        $('videoitnGamerOver').css('display', 'flex');
        $('#itnLinkMaximize').on('click touchstart', function (e) {
            e.preventDefault();
            $('#itnGameContainer').show()
            $('#itnGameMinimize').hide();
            $eXeItinerario.refreshImageActive();
        });
        $('#itnLinkMinimize').on('click touchstart', function (e) {
            e.preventDefault();
            $('#itnGameContainer').hide();
            $('#itnGameMinimize').css('visibility', 'visible').show();
            return true;
        });

        $('#itnGamerOver').hide();
        $('#itnCodeAccessDiv').hide();
        $('#itnVideo').hide();
        $('#itnImagen').hide();
        $('#itnCursor').hide();
        $('#itnCover').show();
        $('#itnAnswerDiv').hide();

        $('#itnBtnMoveOn').on('click', function (e) {
            e.preventDefault();
            $eXeItinerario.newQuestion(false, false)
        });
        $('#itnBtnReply').on('click', function (e) {
            e.preventDefault();
            $eXeItinerario.answerQuestion();
        });
        $('#itnEdAnswer').on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeItinerario.answerQuestion();
                return false;
            }
            return true;
        });
        $('#itnOptionsDiv').find('.ITNP-Options').on('click', function (e) {
            e.preventDefault();
            $eXeItinerario.changeQuextion(this);
        })
        $('#itnLinkFullScreen').on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('itnGameContainer');
            $eXeItinerario.toggleFullscreen(element);
        });
        $('#itnMesajeAccesCodeE').text(mOptions.messageCodeTest);
        $('#itnInstructions').text(mOptions.instructions);
        $('#itnPNumber').text(mOptions.selectsGame.length);
        $('#itnGameContainer .ITNP-StartGame').show();
        $('#itnQuestionDiv').hide();
        $('#itnBottonContainer').addClass('ITNP-BottonContainerDivEnd');
        $('#itnInstruction').text(mOptions.instructions);
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#itnPShowClue').hide();
        mOptions.gameOver = false;
        $('#itnButtonAnswer').on('click touchstart', function (e) {
            e.preventDefault();
            $eXeItinerario.answerQuestion();
        });
        $('#itnStartGame').text(mOptions.msgs.msgPlayStart);
        $('#itnStartGame').on('click', function (e) {
            e.preventDefault();
            $eXeItinerario.getYTAPI();
        });
        $('#itnVideoIntroClose').on('click', function (e) {
            e.preventDefault();
            $('#itnVideoIntroDiv').hide();
            $('#selecionaStartGame').text(mOptions.msgs.msgPlayStart);
            $eXeItinerario.startVideoIntro('', 0, 0);
        });

        $('#itnLinkAudio').on('click', function (e) {
            e.preventDefault();
            var audio = mOptions.selectsGame[mOptions.activeQuestion].audio;
            $eXeItinerario.stopSound();
            $eXeItinerario.playSound(audio);
        });
        $('#itnLinkVideoIntroShow').on('click touchstart', function (e) {

            e.preventDefault();
            $eXeItinerario.getYTVideoIntro();
        });
        if (mOptions.evaluationType == 0) {
            $('#itnGameContainer').find('.ITNP-Icons-Hit').hide();
            $('#itnGameContainer').find('.ITNP-Icons-Error').hide();
            $('#itnPErrors').hide();
            $('#itnPHits').hide();
            $('#itnGameContainer').find('.ITNP-Icons-Score').hide();
            $('#itnPScore').hide();
        }
        if ($eXeItinerario.getIDYoutube(mOptions.idVideo) !== '') {
            mOptions.hasVideoIntro = true;
            $('#itnLinkVideoIntroShow').show();
        }
        $('#itnWordDiv').hide();

    },
    enterCodeAccess: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.codeTest.toLowerCase() === $('#itnCodeAccessE').val().toLowerCase()) {
            $eXeItinerario.startGame()
        } else {
            $('#itnMesajeAccesCodeE').fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#itnCodeAccessE').val('');
        }
    },
    getDataStorage: function (id) {
        var ids = 'iteneraryData-' + id,
            data = $eXeItinerario.isJsonString(localStorage.getItem(ids));

        return data;
    },
    getYTAPI: function () {
        var mOptions = $eXeItinerario.options;
        if (mOptions.idevice == 1) return;
        mOptions.randomQuestions ? $eXeItinerario.shuffleAds(mOptions.selectsGame) : mOptions.selectsGame;
        if ((typeof (mOptions.player) == "undefined") && mOptions.hasVideo) {
            $('#itnStartGame').text(mOptions.msgs.msgLoading);
            mOptions.waitStart = true;
            if (typeof (YT) !== "undefined") {
                $eXeItinerario.youTubeReadyOne();

            } else {
                $eXeItinerario.loadYoutubeApi();
            }
        } else {
            $eXeItinerario.startGame();
        }
    },
    getYTVideoIntro: function () {

        var mOptions = $eXeItinerario.options;
        if ((typeof (mOptions.playerIntro) == "undefined") && mOptions.hasVideoIntro) {
            mOptions.waitPlayIntro = true;
            $('#itnStartGame').text(mOptions.msgs.msgLoading);
            if (typeof (YT) !== "undefined") {
                $eXeItinerario.youTubeReadyOne();
            } else {
                $eXeItinerario.loadYoutubeApi();
            }
        } else {
            $eXeItinerario.playVideoIntro();
        }
    },
    changeQuextion: function (button) {
        var mOptions = $eXeItinerario.options;
        if (!mOptions.gameActived) {
            return;
        }
        var numberButton = parseInt($(button).data("number")),
            letters = 'ABCDEF',
            letter = letters[numberButton],
            type = false;
        if (mOptions.respuesta.indexOf(letter) === -1) {
            mOptions.respuesta = mOptions.respuesta + letter;
            type = true;
        } else {
            mOptions.respuesta = mOptions.respuesta.replace(letter, '');
        }
        var bordeColors = [$eXeItinerario.borderColors.red, $eXeItinerario.borderColors.blue, $eXeItinerario.borderColors.green, $eXeItinerario.borderColors.yellow, $eXeItinerario.borderColors.violet, $eXeItinerario.borderColors.orange],
            css = {
                'border-size': 1,
                'background-color': "transparent",
                'cursor': 'default',
                'color': $eXeItinerario.colors.black
            }
        if (type) {
            css = {
                'border-size': 1,
                'border-color': bordeColors[numberButton],
                'background-color': bordeColors[numberButton],
                'cursor': 'pointer',
                'color': '#ffffff'
            }
        }
        $(button).css(css);
        $('#itnAnswers .ITNP-AnswersOptions').remove();
        for (var i = 0; i < mOptions.respuesta.length; i++) {
            if (mOptions.respuesta[i] === 'A') {
                $('#itnAnswers').append('<div class="ITNP-AnswersOptions ITNP-Answer1"></div>');
            } else if (mOptions.respuesta[i] === 'B') {
                $('#itnAnswers').append('<div class="ITNP-AnswersOptions ITNP-Answer2"></div>');
            } else if (mOptions.respuesta[i] === 'C') {
                $('#itnAnswers').append('<div class="ITNP-AnswersOptions ITNP-Answer3"></div>');

            } else if (mOptions.respuesta[i] === 'D') {
                $('#itnAnswers').append('<div class="ITNP-AnswersOptions ITNP-Answer4"></div>');
            } else if (mOptions.respuesta[i] === 'E') {
                $('#itnAnswers').append('<div class="ITNP-AnswersOptions ITNP-Answer5"></div>');
            } else if (mOptions.respuesta[i] === 'F') {
                $('#itnAnswers').append('<div class="ITNP-AnswersOptions ITNP-Answer6"></div>');
            }
        }
    },
    showImage: function (url) {
		var mOptions = $eXeItinerario.options,
			mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
		    $cursor = $('#itnCursor'),
			$noImage = $('#itnCover'),
			$Image = $('#itnImagen'),
			$Author = $('#itnAuthor');
            $Protect = $('#itnProtector');
        $Image.attr('alt', 'No image');
		$cursor.hide();
		$Image.hide();
		$noImage.hide();
        $Protect.hide();
		if ($.trim(url).length == 0) {
			$cursor.hide();
			$Image.hide();
			$noImage.show();
			$Author.text('');
			return false;
		};
		$Image.attr('src', ''); 
		$Image.attr('src', url)
			.on('load', function () {
				if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
					$cursor.hide();
					$Image.hide();
					$noImage.show();
					$Author.text('');
				} else {
					$Image.show();
					$cursor.show();
					$noImage.hide();
					$Author.text(mQuextion.author);
					$Image.attr('alt', mQuextion.alt);
                    $eXeItinerario.centerImage(this);
				}
			}).on('error', function () {
				$cursor.hide();
				$Image.hide();
				$noImage.show();
				$Author.text('');
				return false;
			});
            $eXeItinerario.showMessage(0,mQuextion.author);
	},
    refreshImageActive: function () {
        var mOptions = $eXeItinerario.options,
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion];
        if (mOptions.gameOver || typeof mQuextion == "undefined" ) {
            return;
        }
        if (mQuextion.type === 1) {
            if (mQuextion.url && mQuextion.url.length > 3 ) {
                $('#itnCursor').hide();
                $eXeItinerario.centerImage('#itnImagen')
            }
        }
    },

    showscore: function (type) {
        var mOptions = $eXeItinerario.options,
            msgs = mOptions.msgs,
            $itnHistGame = $('#itnHistGame'),
            $itnLostGame = $('#itnLostGame'),
            $itnOverPoint = $('#itnOverScore'),
            $itnOverHits = $('#itnOverHits'),
            $itnOverErrors = $('#itnOverErrors'),
            $itnPShowClue = $('#itnPShowClue'),
            $itnGamerOver = $('#itnGamerOver'),
            message = "",
            messageColor = 2;
        $itnHistGame.hide();
        $itnLostGame.hide();
        $itnOverPoint.show();
        $itnOverHits.show();
        $itnOverErrors.show();
        $itnPShowClue.hide();
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.msgAllQuestions;
                $itnHistGame.show();
                break;
            case 1:
                messageColor = 1;
                $itnLostGame.show();
                break;
            case 2:
                message = msgs.msgInformationLooking
                $itnOverPoint.hide();
                $itnOverHits.hide();
                $itnOverErrors.hide();
            default:
                break;
        }
        $eXeItinerario.showMessage(messageColor, message);
        var msscore = '<strong>' + msgs.msgScore + ':</strong> ' + mOptions.score.toFixed(2);
        $itnOverPoint.html(msscore);
        $itnOverHits.html('<strong>' + msgs.msgHits + ':</strong> ' + mOptions.hits);
        $itnOverErrors.html('<strong>' + msgs.msgErrors + '</strong>: ' + mOptions.errors);
        $itnGamerOver.show();
    },

    getItinerary: function () {
        var mOptions = $eXeItinerario.options,
            itinerary = 0;
        if (mOptions.evaluationType == 0) {
            itinerary = $eXeItinerario.getItineraryByOption(mOptions.poolOptions)
        } else {
            itinerary = $eXeItinerario.getItineraryByScore(mOptions.itinerayPoints, mOptions.score)
        }
        return itinerary + 1
    },
    getItineraryByOption: function (options) {
        var maxValue = Math.max(...options),
            maxValueIndex = options.indexOf(maxValue);
        return maxValueIndex + 1;
    },
    getItineraryByScore: function (points, score) {
        var itinerary = 0;
        for (var i = 0; i < points.length - 1; i++) {
            points[i] = points[i] == 10 ? 10.1 : points[i];
            if (score < points[i]) {
                itinerary = i - 1;
                return itinerary
            }
        }
        return itinerary + 1
    },
    startGame: function () {
        var mOptions = $eXeItinerario.options
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.poolOptions = [0, 0, 0, 0, 0, 0];
        $('#itnVideoIntroContainer').hide();
        $('#itnLinkVideoIntroShow').hide();
        $('#itnPShowClue').hide();
        $('#itnGameContainer .ITNP-StartGame').hide();
        $('#itnQuestion').text('');
        $('#itnQuestionDiv').show();
        if (mOptions.ideviceType > 0) {
            $('.itinerario-instructions').show();
        }

        $('#itnWordDiv').hide();
        $('#itnLinkFullScreen').show();
        $('#itnCodeAccessDiv').hide();
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = false;
        mOptions.activeQuestion = -1;
        mOptions.validQuestions = mOptions.numberQuestions;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        $('#itnPNumber').text(mOptions.numberQuestions);
        for (var i = 0; i < mOptions.selectsGame.length; i++) {
            mOptions.selectsGame[i].answerScore = -1;
        }
        if (mOptions.useTime) {
            mOptions.counterClock = setInterval(function () {
                if (mOptions.gameStarted && mOptions.activeCounter) {
                    mOptions.counter--;
                    $eXeItinerario.uptateTime(mOptions.counter);
                    $eXeItinerario.updateSoundVideo();
                    if (mOptions.counter <= 0) {
                        mOptions.activeCounter = false;
                        var timeShowSolution = 1000;
                        if (mOptions.evaluationType == 0 && mOptions.showSolution) {
                            timeShowSolution = mOptions.timeShowSolution * 1000;
                            if (mOptions.selectsGame[mOptions.activeQuestion].typeSelect != 2) {
                                $eXeItinerario.drawSolution();
                            } else {
                                $eXeItinerario.drawPhrase(mOptions.selectsGame[mOptions.activeQuestion].solutionQuestion, mOptions.selectsGame[mOptions.activeQuestion].quextion, 100, 1, false)
                            }
                        }
                        setTimeout(function () {
                            $eXeItinerario.newQuestion()
                        }, timeShowSolution);
                        return;
                    }
                }
            }, 1000);
        }

        $('#itnMultimedia').show();
        $('#itnGameScoreBoard').show();
        $eXeItinerario.uptateTime(0);
        $('#itnGamerOver').hide();
        $('#itnPHits').text(mOptions.hits);
        $('#itnPErrors').text(mOptions.errors);
        $('#itnPScore').text(mOptions.score);
        mOptions.gameStarted = true;
        $eXeItinerario.newQuestion();
    },
    updateSoundVideo: function () {
        var mOptions = $eXeItinerario.options;
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
    uptateTime: function (tiempo) {
        var mOptions = $eXeItinerario.options;
        var mTime = $eXeItinerario.getTimeToString(tiempo);
        $('#itnPTime').text(mTime);
        if (mOptions.gameActived) {}
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type) {
        var mOptions = $eXeItinerario.options;
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        clearInterval(mOptions.counterClock);
        $('#itnVideo').hide();
        $('#itnLinkAudio').hide();
        $eXeItinerario.startVideo('', 0, 0);
        $eXeItinerario.stopVideo();
        $eXeItinerario.stopSound();
        $eXeItinerario.showImage('')
        $('#itnImagen').hide();
        $('#itnEText').hide();
        $('#itnCursor').hide();
        $('#itnCover').hide();
        var message = mOptions.msgs.msgAllQuestions;
        $eXeItinerario.showMessage(2, message);
        $eXeItinerario.showscore(type);
        $eXeItinerario.clearQuestions();
        $eXeItinerario.uptateTime(0);
        if ($eXeItinerario.getIDYoutube(mOptions.idVideo) !== '') {
            $('#itnLinkVideoIntroShow').show();
        }
        mOptions.gameOver = true;
        $('#itnQuestionDiv').hide();
        $('#itnAnswerDiv').hide();
        $('#itnWordDiv').hide();
        var score = ((mOptions.hits * 10) / mOptions.selectsGame.length).toFixed(2);
        mOptions.score = parseFloat(score);
        mOptions.itinerary = $eXeItinerario.getItinerary();
        $eXeItinerario.saveDataStorage();
        $eXeItinerario.showTest(mOptions);
        $eXeItinerario.sortIdevicePage(mOptions.itineraries, mOptions.itinerary)

    },


    drawPhrase: function (phrase, definition, nivel, type, casesensitive) {
        $('#itnEPhrase').find('.ITNP-Word').remove();
        $('#itnBtnReply').prop('disabled', true);
        $('#itnBtnMoveOn').prop('disabled', true);
        $('#itnEdAnswer').prop('disabled', true);
        $('#itnQuestionDiv').hide();
        $('#itnWordDiv').show();
        $('#itnAnswerDiv').hide();
        if (!casesensitive) {
            phrase = phrase.toUpperCase();
        }
        var cPhrase = $eXeItinerario.clear(phrase),
            letterShow = $eXeItinerario.getShowLetter(cPhrase, nivel),
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
                $('<div class="ITNP-Word"></div>').appendTo('#itnEPhrase');
                for (var j = 0; j < cleanWord.length; j++) {
                    var letter = '<div class="ITNP-Letter blue">' + cleanWord[j] + '</div>';
                    if (type == 1) {
                        letter = '<div class="ITNP-Letter red">' + cleanWord[j] + '</div>';
                    } else if (type == 2) {
                        letter = '<div class="ITNP-Letter green">' + cleanWord[j] + '</div>';
                    }
                    $('#itnEPhrase').find('.ITNP-Word').last().append(letter);
                }
            }
        }
        $('#itnDefinition').text(definition);
        if (typeof (MathJax) != "undefined") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, '#itnGameContainer']);
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

    drawText: function (texto, color) {},
    showQuestion: function (i) {
        var mOptions = $eXeItinerario.options,
            mQuextion = mOptions.selectsGame[i],
            q = mQuextion;
        $eXeItinerario.clearQuestions();
        mOptions.gameActived = true;
        mOptions.question = mQuextion
        mOptions.respuesta = '';
        var tiempo = $eXeItinerario.getTimeToString($eXeItinerario.getTimeSeconds(mQuextion.time)),
            author = '',
            alt = '';
        $('#itnPTime').text(tiempo);
        $('#itnQuestion').text(mQuextion.quextion);
        $('#itnImagen').hide();
        $('#itnCover').show();
        $('#itnEText').hide();
        $('#itnVideo').hide();
        $('#itnLinkAudio').hide();
        $eXeItinerario.startVideo('', 0, 0);
        $eXeItinerario.stopVideo()
        $('#itnCursor').hide();
        $eXeItinerario.showMessage(0, '');
        mOptions.activeSilent = (q.type == 2) && (q.soundVideo == 1) && (q.tSilentVideo > 0) && (q.silentVideo >= q.iVideo) && (q.iVideo < q.fVideo);
        var endSonido = parseInt(q.silentVideo) + parseInt(q.tSilentVideo);
        mOptions.endSilent = endSonido > q.fVideo ? q.fVideo : endSonido;
        $('#itnAuthor').text('');
        if (mQuextion.type === 1) {
            $eXeItinerario.showImage(mQuextion.url);
        } else if (mQuextion.type === 3) {
            var text = unescape(mQuextion.eText);
            $('#itnEText').html(text);
            $('#itnCover').hide();
            $('#itnEText').show();
            $eXeItinerario.showMessage(0, '');

        } else if (mQuextion.type === 2) {
            $('#itnVideo').show();
            var idVideo = $eXeItinerario.getIDYoutube(mQuextion.url);
            $eXeItinerario.startVideo(idVideo, mQuextion.iVideo, mQuextion.fVideo);
            $eXeItinerario.showMessage(0, '');
            if (mQuextion.imageVideo === 0) {
                $('#itnVideo').hide();
                $('#itnCover').show();
            } else {
                $('#itnVideo').show();
                $('#itnCover').hide();
            }
            if (mQuextion.soundVideo === 0) {
                $eXeItinerario.muteVideo(true);
            } else {
                $eXeItinerario.muteVideo(false);
            }
        }
        if (mQuextion.typeSelect != 2) {
            $eXeItinerario.drawQuestions();
        } else {
            $eXeItinerario.drawPhrase(mQuextion.solutionQuestion, mQuextion.quextion, mQuextion.percentageShow, 0, false)
            $('#itnBtnReply').prop('disabled', false);
            $('#itnBtnMoveOn').prop('disabled', false);
            $('#itnEdAnswer').prop('disabled', false);
            $('#itnEdAnswer').focus();
            $('#itnEdAnswer').val('');
        }

        if (q.audio.length > 4 && q.type != 2 && !mOptions.audioFeedBach) {
            $('#itnLinkAudio').show();
        }
        $eXeItinerario.stopSound();
        if (q.type != 2 && q.audio.trim().length > 5 && !mOptions.audioFeedBach) {
            $eXeItinerario.playSound(q.audio.trim());
        }
        if (typeof (MathJax) != "undefined") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, '#itnGameContainer']);
        }
        var score = ((mOptions.hits * 10) / mOptions.selectsGame.length).toFixed(2);
        mOptions.score = parseFloat(score);
        mOptions.itinerary = $eXeItinerario.getItinerary();
        $eXeItinerario.saveDataStorage();

    },
    positionPointer: function() {
		var mOptions = $eXeItinerario.options,
			mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
		    x = parseFloat(mQuextion.x) || 0;
		    y = parseFloat(mQuextion.y) || 0, 
			$cursor=$('#itnCursor');
			$cursor.hide();
		if(x > 0 || y > 0){
			var containerElement = document.getElementById('itnMultimedia'),
			    containerPos = containerElement.getBoundingClientRect(),
			    imgElement = document.getElementById('itnImagen'),
			    imgPos = imgElement.getBoundingClientRect(),
  		        marginTop = imgPos.top - containerPos.top,
			    marginLeft = imgPos.left - containerPos.left,
			    x = marginLeft + (x * imgPos.width),
			    y = marginTop + (y * imgPos.height);
				$cursor.show();
				$cursor.css({ left: x, top: y, 'z-index': 30 });
		}
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
    getIDYoutube: function (url) {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
            match = url.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return "";
        }
    },
    newQuestion: function () {
        var mOptions = $eXeItinerario.options;
        var mActiveQuestion = $eXeItinerario.updateNumberQuestion(mOptions.activeQuestion);
        if (mActiveQuestion === -10) {
            $('#itnPNumber').text('0');
            $eXeItinerario.gameOver(0);
            return;
        } else {
            mOptions.counter = $eXeItinerario.getTimeSeconds(mOptions.selectsGame[mActiveQuestion].time);
            if (mOptions.selectsGame[mActiveQuestion].type === 2) {
                var durationVideo = mOptions.selectsGame[mActiveQuestion].fVideo - mOptions.selectsGame[mActiveQuestion].iVideo;
                mOptions.counter += durationVideo;
            }
            $eXeItinerario.showQuestion(mActiveQuestion)
            mOptions.activeCounter = true;
            var numQ = mOptions.numberQuestions - mActiveQuestion;
            $('#itnPNumber').text(numQ);
        };
    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600];
        return times[iT];
    },
    updateNumberQuestion: function (numq) {
        var mOptions = $eXeItinerario.options,
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },
    getRetroFeedMessages: function (iHit) {
        var msgs = $eXeItinerario.options.msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },

    answerQuestion: function () {
        var mOptions = $eXeItinerario.options,
            quextion = mOptions.selectsGame[mOptions.activeQuestion];
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        var solution = quextion.solution,
            answer = mOptions.respuesta.toUpperCase(),
            correct = true,
            timeShowSolution = 1000;
        mOptions.activeCounter = false;

        if (mOptions.evaluationType == 0) {
            $eXeItinerario.updatePoolAnswers(answer);
        } else {

            if (quextion.typeSelect === 2) {
                solution = quextion.solutionQuestion.toUpperCase();
                answer = $.trim($('#itnEdAnswer').val()).toUpperCase();
                correct = solution == answer;
                if (answer.length == 0) {
                    $eXeItinerario.showMessage(1, mOptions.msgs.msgIndicateWord);
                    mOptions.gameActived = true;
                    return;
                }

            } else if (quextion.typeSelect === 1) {
                if (answer.length !== solution.length) {
                    $eXeItinerario.showMessage(1, mOptions.msgs.msgOrders);
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
            $eXeItinerario.updateScore(correct);
            if (mOptions.showSolution & quextion.audio.trim().length > 5 && mOptions.audioFeedBach) {
                $eXeItinerario.playSound(quextion.audio.trim());
                $('#itnLinkAudio').show();
            }
            $('#itnPHits').text(mOptions.hits);
            $('#itnPErrors').text(mOptions.errors);
            if (mOptions.showSolution) {
                timeShowSolution = mOptions.timeShowSolution * 1000;
                if (quextion.typeSelect != 2) {
                    $eXeItinerario.drawSolution();
                } else {
                    var mtipe = correct ? 2 : 1;
                    $eXeItinerario.drawPhrase(quextion.solutionQuestion, quextion.quextion, 100, mtipe, false)
                }
            }
        }
        setTimeout(function () {
            $eXeItinerario.newQuestion()
        }, timeShowSolution);
    },
    updatePoolAnswers: function (answer) {
        var mOptions = $eXeItinerario.options;
        if (answer.toUpperCase().indexOf('A') != -1) {
            mOptions.poolOptions[0]++;
        }
        if (answer.toUpperCase().indexOf('B') != -1) {
            mOptions.poolOptions[1]++;
        }
        if (answer.toUpperCase().indexOf('C') != -1) {
            mOptions.poolOptions[2]++;
        }
        if (answer.toUpperCase().indexOf('D') != -1) {
            mOptions.poolOptions[3]++;
        }
        if (answer.toUpperCase().indexOf('E') != -1) {
            mOptions.poolOptions[4]++;
        }
        if (answer.toUpperCase().indexOf('F') != -1) {
            mOptions.poolOptions[5]++;
        }
    },
    updateScore: function (correctAnswer) {
        var mOptions = $eXeItinerario.options,
            message = "",
            type = 1,
            sscore = 0,
            points = 0;
        if (mOptions.evaluationType === 0) return;
        if (correctAnswer) {
            points = (10 / mOptions.selectsGame.length).toFixed(2);
            mOptions.hits++;
            type = 2;
        } else {
            mOptions.errors++;
            message = "";

        }
        mOptions.score = (mOptions.hits * 10) / mOptions.selectsGame.length
        sscore = mOptions.score;
        sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#itnPScore').text(sscore);
        $('#itnPHits').text(mOptions.hits);
        $('#itnPErrors').text(mOptions.errors);
        message = $eXeItinerario.getMessageAnswer(correctAnswer, points);
        $eXeItinerario.showMessage(type, message);

    },

    getMessageAnswer: function (correctAnswer, npts) {
        var message = "";
        if (correctAnswer) {
            message = $eXeItinerario.getMessageCorrectAnswer(npts);
        } else {
            message = $eXeItinerario.getMessageErrorAnswer(npts);
        }
        return message;
    },
    getMessageCorrectAnswer: function (npts) {
        var mOptions = $eXeItinerario.options,
            messageCorrect = $eXeItinerario.getRetroFeedMessages(true),
            message = messageCorrect + ' ' + npts + ' ' + mOptions.msgs.msgPoints;
        return message;
    },

    getMessageErrorAnswer: function (npts) {
        var mOptions = $eXeItinerario.options,
            messageError = $eXeItinerario.getRetroFeedMessages(false),
            message = "",
            pts = typeof mOptions.msgs.msgPoints == 'undefined' ? 'puntos' : mOptions.msgs.msgPoints;
        message = messageError + ' ' + npts + ' ' + pts;
        return message;
    },
    getMessageErrorAnswerRepeat: function () {
        var mOptions = $eXeItinerario.options,
            message = $eXeItinerario.getRetroFeedMessages(false);
        if (mOptions.customMessages && mOptions.selectsGame[mOptions.activeQuestion].msgError.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgError;
        }
        return message;
    },
    getMessageCorrectAnswerRepeat: function () {
        var mOptions = $eXeItinerario.options,
            message = $eXeItinerario.getRetroFeedMessages(true);
        if (mOptions.customMessages && mOptions.selectsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgHit
        }
        return message;
    },

    showMessage: function (type, message) {
        var colors = ['#555555', $eXeItinerario.borderColors.red, $eXeItinerario.borderColors.green, $eXeItinerario.borderColors.blue, $eXeItinerario.borderColors.yellow, $eXeItinerario.borderColors.violet, $eXeItinerario.borderColors.orange],
            mcolor = colors[type],
            weight = type == 0 ? 'normal' : 'normal';
        $('#itnPAuthor').html(message);
        $('#itnPAuthor').css({
            'color': mcolor,
            'font-weight': weight,
        });
    },

    ramdonOptions: function () {
        var mOptions = $eXeItinerario.options,
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
        var respuestasNuevas = [];
        var respuestaCorrectas = [];
        for (var i = 0; i < soluciones.length; i++) {
            var sol = soluciones.charCodeAt(i) - 65;
            respuestaCorrectas.push(respuestas[sol]);
        }
        var respuestasNuevas = mOptions.question.options.slice(0, l)
        respuestasNuevas = $eXeItinerario.shuffleAds(respuestasNuevas);
        var solucionesNuevas = "";
        for (var j = 0; j < respuestasNuevas.length; j++) {
            for (var z = 0; z < respuestaCorrectas.length; z++) {
                if (respuestasNuevas[j] == respuestaCorrectas[z]) {
                    solucionesNuevas = solucionesNuevas.concat(letras[j]);
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
        mOptions.question.solution = solucionesNuevas;
    },

    drawQuestions: function () {
        var mOptions = $eXeItinerario.options,
            bordeColors = [$eXeItinerario.borderColors.red, $eXeItinerario.borderColors.blue, $eXeItinerario.borderColors.green, $eXeItinerario.borderColors.yellow, $eXeItinerario.borderColors.violet, $eXeItinerario.borderColors.orange];
        $('#itnQuestionDiv').show();
        $('#itnWordDiv').hide();
        $('#itnAnswerDiv').show();
        $('#itnOptionsDiv>.ITNP-Options').each(function (index) {
            var option = mOptions.question.options[index]
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer',
                'color': $eXeItinerario.colors.black
            }).text(option);
            if (option) {
                $(this).show();
            } else {
                $(this).hide()
            }
        });
    },

    drawSolution: function () {
        var mOptions = $eXeItinerario.options,
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            solution = mQuextion.solution,
            letters = 'ABCDEF';
        mOptions.gameActived = false;
        $('#itnOptionsDiv').find('.ITNP-Options').each(function (i) {
            var css = {};
            if (mQuextion.typeSelect === 1) {
                css = {
                    'border-color': $eXeItinerario.borderColors.correct,
                    'background-color': $eXeItinerario.colors.correct,
                    'border-size': '1',
                    'cursor': 'pointer',
                    'color': $eXeItinerario.borderColors.black
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
                } else if (solution[i] === "E") {
                    text = mQuextion.options[4];
                } else if (solution[i] === "F") {
                    text = mQuextion.options[5];
                }
                $(this).text(text);
            } else {
                css = {
                    'border-color': $eXeItinerario.borderColors.incorrect,
                    'border-size': '1',
                    'background-color': 'transparent',
                    'cursor': 'pointer',
                    'color': $eXeItinerario.borderColors.grey
                };
                if (solution.indexOf(letters[i]) !== -1) {
                    css = {
                        'border-color': $eXeItinerario.borderColors.correct,
                        'background-color': $eXeItinerario.colors.correct,
                        'border-size': '1',
                        'cursor': 'pointer',
                        'color': $eXeItinerario.borderColors.black
                    }
                }
            }
            $(this).css(css);
        });
    },

    clearQuestions: function () {
        var mOptions = $eXeItinerario.options;
        mOptions.respuesta = "";
        $('#itnAnswers> .ITNP-AnswersOptions').remove();
        var bordeColors = [$eXeItinerario.borderColors.red, $eXeItinerario.borderColors.blue, $eXeItinerario.borderColors.green, $eXeItinerario.borderColors.yellow, $eXeItinerario.borderColors.violet, $eXeItinerario.borderColors.orange];
        $('#itnOptionsDiv>.ITNP-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer'
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
    toggleFullscreen: function (element) {
        var element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $eXeItinerario.getFullscreen(element);
        } else {
            $eXeItinerario.exitFullscreen(element);
        }
    },
    supportedBrowser: function (idevice) {
        var sp = !(window.navigator.appName == 'Microsoft Internet Explorer' || window.navigator.userAgent.indexOf('MSIE ') > 0);
        if (!sp) {
            var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
            $('.' + idevice + '-instructions').text(bns);
        }
        return sp;
    }
}
$(function () {
    $eXeItinerario.init();
});