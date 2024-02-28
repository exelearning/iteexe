/**
 * Descubre activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeDescubre = {
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
    id: false,
    init: function () {
        this.activities = $('.descubre-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeDescubre.supportedBrowser('descubre')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Word Guessing') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/descubre-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();

    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeDescubre.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeDescubre.enable()');
        else this.enable();
        $eXeDescubre.mScorm = scorm;
        var callSucceeded = $eXeDescubre.mScorm.init();
        if (callSucceeded) {
            $eXeDescubre.userName = $eXeDescubre.getUserName();
            $eXeDescubre.previousScore = $eXeDescubre.getPreviousScore();
            $eXeDescubre.mScorm.set("cmi.core.score.max", 10);
            $eXeDescubre.mScorm.set("cmi.core.score.min", 0);
            $eXeDescubre.initialScore = $eXeDescubre.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeDescubre.options[instance],
            text = '';
        $('#descubreSendScore-' + instance).hide();
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
            $('#descubreSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#descubreSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }


        $('#descubreRepeatActivity-' + instance).text(text);
        $('#descubreRepeatActivity-' + instance).fadeIn(1000);
    },
    getUserName: function () {
        var user = $eXeDescubre.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeDescubre.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeDescubre.mScorm.quit();
    },
    enable: function () {
        $eXeDescubre.loadGame();
    },
    loadGame: function () {
        $eXeDescubre.options = [];
        $eXeDescubre.activities.each(function (i) {
            var dl = $(".descubre-DataGame", this),
                $imagesLink0 = $('.descubre-LinkImages-0', this),
                $audiosLink0 = $('.descubre-LinkAudios-0', this),
                $imagesLink1 = $('.descubre-LinkImages-1', this),
                $audiosLink1 = $('.descubre-LinkAudios-1', this),
                $imagesLink2 = $('.descubre-LinkImages-2', this),
                $audiosLink2 = $('.descubre-LinkAudios-2', this),
                $imagesLink3 = $('.descubre-LinkImages-3', this),
                $audiosLink3 = $('.descubre-LinkAudios-3', this),
                mOption = $eXeDescubre.loadDataGame(dl, $imagesLink0, $audiosLink0, $imagesLink1, $audiosLink1, $imagesLink2, $audiosLink2, $imagesLink3, $audiosLink3),
                msg = mOption.msgs.msgPlayStart;
            $eXeDescubre.options.push(mOption);
            var descubre = $eXeDescubre.createInterfaceDescubre(i);
            dl.before(descubre).remove();
            $('#descubreGameMinimize-' + i).hide();
            $('#descubreGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#descubreGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#descubreGameContainer-' + i).show();
            }
            $('#descubreMessageMaximize-' + i).text(msg);
            $('#descubreDivFeedBack-' + i).prepend($('.descubre-feedback-game', this));
            $eXeDescubre.addCards(i, mOption.cardsGame);
            $eXeDescubre.addEvents(i);
            $('#descubreDivFeedBack-' + i).hide();
        });
        if ($eXeDescubre.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeDescubre.loadMathJax()
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

    getCuestionDefault: function () {
        var q = new Object();
        q.data = [];
        for (var i = 0; i < 4; i++) {
            var p = new Object();
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
            q.data.push(p)
        }

        q.msgError = '';
        q.msgHit = '';

        return q;
    },


    loadDataGame: function (data, imgsLink0, audioLink0, imgsLink1, audioLink1, imgsLink2, audioLink2, imgsLink3, audioLink3) {
        var json = data.text(),
            linkImages = [imgsLink0, imgsLink1, imgsLink2, imgsLink3],
            linkAudios = [audioLink0, audioLink1, audioLink2, audioLink3];
        json = $eXeDescubre.Decrypt(json);
        var mOptions = $eXeDescubre.isJsonString(json),
            hasLatex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeDescubre.hasLATEX = true;
        }
        mOptions.percentajeQuestions = typeof mOptions.percentajeQuestions != 'undefined' ? mOptions.percentajeQuestions : 100;
        mOptions.playerAudio = "";
        mOptions.percentajeFB = typeof mOptions.percentajeFB != 'undefined' ? mOptions.percentajeFB : 100;
        mOptions.timeShowSolution = typeof mOptions.timeShowSolution != 'undefined' ? mOptions.timeShowSolution * 1000 : 3000;
        mOptions.showSolution = typeof mOptions.showSolution != 'undefined' ? mOptions.showSolution : true;
        mOptions.author = typeof mOptions.author != 'undefined' ? mOptions.author : "";
        mOptions.gameMode = typeof mOptions.gameMode != 'undefined' ? mOptions.gameMode : 0;
        mOptions.gameLevels = typeof mOptions.gameLevels != 'undefined' ? mOptions.gameLevels : 1;
        mOptions.showCards = typeof mOptions.showCards != 'undefined' ? mOptions.showCards : false;
        mOptions.customMessages = typeof mOptions.customMessages != 'undefined' ? mOptions.customMessages : false;
        mOptions.timeShowSolution = mOptions.showCards ? 2000 : mOptions.timeShowSolution;

        if (typeof mOptions.version == "undefined" || mOptions.version < 1) {

            imgsLink0.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                    mOptions.wordsGame[iq].url0 = $(this).attr('href');
                    if (mOptions.wordsGame[iq].url0.length < 4 && mOptions.wordsGame[iq].type == 0) {
                        mOptions.wordsGame[iq].url0 = "";
                    }
                }
            });

            audioLink0.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                    mOptions.wordsGame[iq].audio0 = $(this).attr('href');
                    if (mOptions.wordsGame[iq].audio0.length < 4) {
                        mOptions.wordsGame[iq].audio0 = "";
                    }
                }
            });
            imgsLink1.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                    mOptions.wordsGame[iq].url1 = $(this).attr('href');
                    if (mOptions.wordsGame[iq].url1.length < 4 && mOptions.wordsGame[iq].type1 == 0) {
                        mOptions.wordsGame[iq].url1 = "";
                    }
                }
            });

            audioLink1.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                    mOptions.wordsGame[iq].audio1 = $(this).attr('href');
                    if (mOptions.wordsGame[iq].audio1.length < 4) {
                        mOptions.wordsGame[iq].audio1 = "";
                    }
                }
            });
            if (mOptions.gameMode > 0) {
                imgsLink2.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                        mOptions.wordsGame[iq].url2 = $(this).attr('href');
                        if (mOptions.wordsGame[iq].url2.length < 4 && mOptions.wordsGame[iq].type2 == 0) {
                            mOptions.wordsGame[iq].url2 = "";
                        }
                    }
                });

                audioLink2.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                        mOptions.wordsGame[iq].audio1 = $(this).attr('href');
                        if (mOptions.wordsGame[iq].audio2.length < 4) {
                            mOptions.wordsGame[iq].audio2 = "";
                        }
                    }
                });
            }
            var words = [];
            for (var j = 0; j < mOptions.wordsGame.length; j++) {
                var p = $eXeDescubre.getCuestionDefault();
                p.data[0].type = mOptions.wordsGame[j].type0 || 0;
                p.data[1].type = mOptions.wordsGame[j].type1 || 0;
                p.data[2].type = mOptions.wordsGame[j].type2 || 0;
                p.data[3].type = 0;

                p.data[0].url = mOptions.wordsGame[j].url0 || '';
                p.data[1].url = mOptions.wordsGame[j].url1 || '';
                p.data[2].url = mOptions.wordsGame[j].url2 || '';
                p.data[3].url = '';

                p.data[0].audio = mOptions.wordsGame[j].audio0 || '';
                p.data[1].audio = mOptions.wordsGame[j].audio1 || '';
                p.data[2].audio = mOptions.wordsGame[j].audio2 || '';
                p.data[3].audio = '';

                p.data[0].x = mOptions.wordsGame[j].x0 || 0;
                p.data[1].x = mOptions.wordsGame[j].x1 || 0;
                p.data[2].x = mOptions.wordsGame[j].x2 || 0;
                p.data[3].x = 0;

                p.data[0].y = mOptions.wordsGame[j].y0 || 0;
                p.data[1].y = mOptions.wordsGame[j].y1 || 0;
                p.data[2].y = mOptions.wordsGame[j].y2 || 0;
                p.data[3].y = 0;

                p.data[0].author = mOptions.wordsGame[j].autmor0 || '';
                p.data[1].author = mOptions.wordsGame[j].autmor1 || '';
                p.data[2].author = mOptions.wordsGame[j].autmor2 || '';
                p.data[3].author = '';

                p.data[0].alt = mOptions.wordsGame[j].alt0 || '';
                p.data[1].alt = mOptions.wordsGame[j].alt1 || '';
                p.data[2].alt = mOptions.wordsGame[j].alt2 || '';
                p.data[3].alt = '';

                p.data[0].eText = mOptions.wordsGame[j].eText0 || '';
                p.data[1].eText = mOptions.wordsGame[j].eText1 || '';
                p.data[2].eText = mOptions.wordsGame[j].eText2 || '';
                p.data[3].eText = '';

                p.data[0].backcolor = "#ffffff";
                p.data[1].backcolor = "#ffffff";
                p.data[2].backcolor = "#ffffff";
                p.data[3].backcolor = "#ffffff";

                p.data[0].color = "#ffffff";
                p.data[1].color = "#ffffff";
                p.data[2].color = "#ffffff";
                p.data[3].color = "#ffffff";
                p.msgError = '';
                p.msgHit = '';
                words.push(p)

            }
            mOptions.wordsGame = words;
        } else {
            for (var k = 0; k < linkImages.length; k++) {
                var $linImg = linkImages[k];
                $linImg.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                        var p = mOptions.wordsGame[iq].data[k];
                        p.url = $(this).attr('href');
                        if (p.url.length < 4 && p.type == 1) {
                            p.url = "";
                        }
                    }
                });
                var $linkAudio = linkAudios[k];
                $linkAudio.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < mOptions.wordsGame.length) {
                        var p = mOptions.wordsGame[iq].data[k];
                        p.audio = $(this).attr('href');
                        if (p.audio.length < 4) {
                            p.audio = "";
                        }
                    }
                });

            }

        }
        mOptions.wordsGame = $eXeDescubre.getQuestions(mOptions.wordsGame, mOptions.percentajeQuestions);
        mOptions.numberQuestions = mOptions.wordsGame.length;
        mOptions.wordsGameFix = mOptions.wordsGame;
        mOptions.cardsGame = $eXeDescubre.createCardsData(mOptions.wordsGame, mOptions.gameMode);
        mOptions.fullscreen = false;
        mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
        mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? '' : mOptions.evaluationID;
        mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;

        return mOptions;

    },

    createCardsData: function (wordsGame, gameMode) {
        var cardsGame = [],
            d = 0,
            j = 0;
        if (gameMode == 0) {
            while (j < wordsGame.length) {
                var p = new Object();
                if (d % 2 == 0) {
                    p.number = j;
                    p.type = wordsGame[j].data[0].type;
                    p.url = wordsGame[j].data[0].url;
                    p.eText = wordsGame[j].data[0].eText;
                    p.audio = wordsGame[j].data[0].audio;
                    p.x = wordsGame[j].data[0].x;
                    p.y = wordsGame[j].data[0].y;
                    p.alt = wordsGame[j].data[0].alt;
                    p.color = wordsGame[j].data[0].color;
                    p.backcolor = wordsGame[j].data[0].backcolor;
                    p.correct = 0;
                } else {
                    p.number = j;
                    p.type = wordsGame[j].data[1].type;
                    p.url = wordsGame[j].data[1].url;
                    p.eText = wordsGame[j].data[1].eText;
                    p.audio = wordsGame[j].data[1].audio;
                    p.x = wordsGame[j].data[1].x;
                    p.y = wordsGame[j].data[1].y;
                    p.alt = wordsGame[j].data[1].alt;
                    p.color = wordsGame[j].data[1].color;
                    p.backcolor = wordsGame[j].data[1].backcolor;
                    j++;
                }
                d++;
                cardsGame.push(p);
            }

        } else if (gameMode == 1) {
            while (j < wordsGame.length) {
                var p = new Object();
                if (d % 3 == 0) {
                    p.number = j;
                    p.type = wordsGame[j].data[0].type;
                    p.url = wordsGame[j].data[0].url;
                    p.eText = wordsGame[j].data[0].eText;
                    p.audio = wordsGame[j].data[0].audio;
                    p.x = wordsGame[j].data[0].x;
                    p.y = wordsGame[j].data[0].y;
                    p.alt = wordsGame[j].data[0].alt;
                    p.color = wordsGame[j].data[0].color;
                    p.backcolor = wordsGame[j].data[0].backcolor;
                    p.correct = 0;
                } else if (d % 3 == 1) {
                    p.number = j;
                    p.type = wordsGame[j].data[1].type;
                    p.url = wordsGame[j].data[1].url;
                    p.eText = wordsGame[j].data[1].eText;
                    p.audio = wordsGame[j].data[1].audio;
                    p.x = wordsGame[j].data[1].x;
                    p.y = wordsGame[j].data[1].y;
                    p.alt = wordsGame[j].data[1].alt;
                    p.color = wordsGame[j].data[1].color;
                    p.backcolor = wordsGame[j].data[1].backcolor;
                    p.correct = 0;
                } else if (d % 3 == 2) {
                    p.number = j;
                    p.type = wordsGame[j].data[2].type;
                    p.url = wordsGame[j].data[2].url;
                    p.eText = wordsGame[j].data[2].eText;
                    p.audio = wordsGame[j].data[2].audio;
                    p.x = wordsGame[j].data[2].x;
                    p.y = wordsGame[j].data[2].y;
                    p.alt = wordsGame[j].data[2].alt;
                    p.color = wordsGame[j].data[2].color;
                    p.backcolor = wordsGame[j].data[2].backcolor;
                    p.correct = 0;
                    j++;
                }
                d++;
                cardsGame.push(p);
            }
        } else if (gameMode == 2) {
            while (j < wordsGame.length) {
                var p = new Object();
                if (d % 4 == 0) {
                    p.number = j;
                    p.type = wordsGame[j].data[0].type;
                    p.url = wordsGame[j].data[0].url;
                    p.eText = wordsGame[j].data[0].eText;
                    p.audio = wordsGame[j].data[0].audio;
                    p.x = wordsGame[j].data[0].x;
                    p.y = wordsGame[j].data[0].y;
                    p.alt = wordsGame[j].data[0].alt;
                    p.color = wordsGame[j].data[0].color;
                    p.backcolor = wordsGame[j].data[0].backcolor;
                    p.correct = 0;
                } else if (d % 4 == 1) {
                    p.number = j;
                    p.type = wordsGame[j].data[1].type;
                    p.url = wordsGame[j].data[1].url;
                    p.eText = wordsGame[j].data[1].eText;
                    p.audio = wordsGame[j].data[1].audio;
                    p.x = wordsGame[j].data[1].x;
                    p.y = wordsGame[j].data[1].y;
                    p.alt = wordsGame[j].data[1].alt;
                    p.color = wordsGame[j].data[1].color;
                    p.backcolor = wordsGame[j].data[1].backcolor;
                    p.correct = 0;
                } else if (d % 4 == 2) {
                    p.number = j;
                    p.type = wordsGame[j].data[2].type;
                    p.url = wordsGame[j].data[2].url;
                    p.eText = wordsGame[j].data[2].eText;
                    p.audio = wordsGame[j].data[2].audio;
                    p.x = wordsGame[j].data[2].x;
                    p.y = wordsGame[j].data[2].y;
                    p.alt = wordsGame[j].data[2].alt;
                    p.color = wordsGame[j].data[2].color;
                    p.backcolor = wordsGame[j].data[2].backcolor;
                    p.correct = 0;
                } else if (d % 4 == 3) {
                    p.number = j;
                    p.type = wordsGame[j].data[3].type;
                    p.url = wordsGame[j].data[3].url;
                    p.eText = wordsGame[j].data[3].eText;
                    p.audio = wordsGame[j].data[3].audio;
                    p.x = wordsGame[j].data[3].x;
                    p.y = wordsGame[j].data[3].y;
                    p.alt = wordsGame[j].data[3].alt;
                    p.color = wordsGame[j].data[3].color;
                    p.backcolor = wordsGame[j].data[3].backcolor;
                    p.correct = 0;
                    j++;
                }
                d++;
                cardsGame.push(p);
            }
        }
        return cardsGame;
    },

    setFontSize: function($text, instance){
        var latex = $text.find('mjx-container').length > 0 ||  /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test($text.text());
        if(!latex){
            $text.css({'font-size':'18px'});
            $eXeDescubre.setFontSizeNormal($text)
        }else{
            $eXeDescubre.setFontSizeMath($text, instance)
        }
    },
    setFontSizeNormal: function($text) {
        var maxHeight = $text.height(); 
        var fontSize = parseInt($text.css("font-size")); 
        while ($text[0].scrollHeight > maxHeight && fontSize > 8) {
            fontSize--;
            $text.css("font-size", fontSize + "px");
        }
    },
    setFontSizeMath:function($text, instance){
        var numCardsl=$eXeDescubre.getNumberCards(instance),
            fontsz = '16px';
        if($eXeDescubre.isFullScreen()){
            fontsz = '16px'
            if(numCardsl > 34){
                fontsz ='8px'
            } else if(numCardsl > 24){
                fontsz ='10px'
            } else if(numCardsl > 18){
                fontsz ='12px'
            } else if(numCardsl > 10){
                fontsz = '14px'
            }
        }else{
            fontsz='14px'
            if(numCardsl > 34){
                fontsz ='6px'
            } else if(numCardsl > 24){
                fontsz='8px'
            } else if(numCardsl > 18){
                fontsz='10px'
            } else if(numCardsl > 10){
                fontsz = '12px'
            }
        }
        $text.css({'font-size':fontsz});
    },
    getNumberCards: function(instance){
        var mOptions = $eXeDescubre.options[instance];
        return mOptions.wordsGame.length * (mOptions.gameMode +2);

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
                array = $eXeDescubre.shuffleAds(array).slice(0, num).sort(function (a, b) {
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
        var mOptions = $eXeDescubre.options[instance];
        $eXeDescubre.stopSound(instance);
        selectedFile = $eXeDescubre.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
        mOptions.playerAudio.play().catch(error => console.error("Error playing audio:", error));
    },
    stopSound: function (instance) {
        var mOptions = $eXeDescubre.options[instance];
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
    createInterfaceDescubre: function (instance) {
        var html = '',
            path = $eXeDescubre.idevicePath,
            msgs = $eXeDescubre.options[instance].msgs,
            html = '';
        html += '<div class="DescubreQP-MainContainer">\
        <div class="DescubreQP-GameMinimize" id="descubreGameMinimize-' + instance + '">\
            <a href="#" class="DescubreQP-LinkMaximize" id="descubreLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + "descubreIcon.png" + '" class="DescubreQP-IconMinimize DescubreQP-Activo"  alt="">\
            <div class="DescubreQP-MessageMaximize" id="descubreMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="DescubreQP-GameContainer" id="descubreGameContainer-' + instance + '">\
            <div class="DescubreQP-GameScoreBoard" id="descubreGameScoreBoard-' + instance + '">\
                <div class="DescubreQP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number"  id="descubrePNumberIcon-' + instance + '" title="' + msgs.msgNumbersAttemps + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="descubrePNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumbersAttemps + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="descubrePErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="descubrePHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" id="descubrePScoreIcon-' + instance + '" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="descubrePScore-' + instance + '">0</span></p>\
                </div>\
                <div class="Descubrebre-Info" id="descubreInfo-' + instance + '">' + msgs.msgSelectLevel + '</div>\
                <div class="DescubreQP-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
					<div class="exeQuextIcons  exeQuextIcons-Time" id="descubreImgTime-' + instance + '" title="' + msgs.msgTime + '"></div>\
                    <p  id="descubrePTime-' + instance + '" class="DescubreQP-PTime">00:00</p>\
                    <a href="#" class="DescubreQP-LinkFullScreen" id="descubreLinkReboot-' + instance + '" title="' + msgs.msgReboot + '">\
                        <strong><span class="sr-av">' + msgs.msgReboot + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-IconReboot  DescubreQP-Activo" id="descubreReboot-' + instance + '"></div>\
                    </a>\
                    <a href="#" class="DescubreQP-LinkMinimize" id="descubreLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  DescubreQP-Activo"></div>\
                    </a>\
                    <a href="#" class="DescubreQP-LinkFullScreen" id="descubreLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  DescubreQP-Activo" id="descubreFullScreen-' + instance + '"></div>\
                    </a>\
				</div>\
            </div>\
           <div class="DescubreQP-Message" id="descubreMessage-' + instance + '"></div>\
            <div class="DescubreQP-StartNivel" id="descubreStartLevels-' + instance + '">\
                <a href="#" id="descubreStartGame0-' + instance + '">' + msgs.msgRookie + '</a>\
                <a href="#" id="descubreStartGame1-' + instance + '">' + msgs.msgExpert + '</a>\
                <a href="#" id="descubreStartGame2-' + instance + '">' + msgs.msgMaster + '</a>\
            </div>\
            <div class="DescubreQP-Multimedia" id="descubreMultimedia-' + instance + '"></div>\
            <div class="DescubreQP-Cubierta"id="descubreCubierta-' + instance + '">\
                <div class="DescubreQP-GameOverExt" id="descubreGameOver-' + instance + '">\
                    <div class="DescubreQP-StartGame" id="descubreMesasgeEnd-' + instance + '"></div>\
                    <div class="DescubreQP-GameOver">\
                        <div class="DescubreQP-DataImage">\
                            <img src="' + path + 'exequextwon.png" class="DescubreQP-HistGGame" id="descubreHistGame-' + instance + '" alt="' + msgs.msgAllQuestions + '" />\
                            <img src="' + path + 'exequextlost.png" class="DescubreQP-LostGGame" id="descubreLostGame-' + instance + '"  alt="' + msgs.msgTimeOver + '" />\
                        </div>\
                        <div class="DescubreQP-DataScore">\
                            <p id="descubreOverNumCards-' + instance + '"></p>\
                            <p id="descubreOverAttemps-' + instance + '"></p>\
                            <p id="descubreOverHits-' + instance + '"></p>\
                        </div>\
                    </div>\
                    <div class="DescubreQP-StartGame"><a href="#" id="descubreShowSolution-' + instance + '">Mostrar soluciones</a></div>\
                    <div class="DescubreQP-StartGame"><a href="#" id="descubreStartGameEnd-' + instance + '">' + msgs.msgPlayAgain + '</a></div>\
                </div>\
                <div class="DescubreQP-CodeAccessDiv" id="descubreCodeAccessDiv-' + instance + '">\
                    <div class="DescubreQP-MessageCodeAccessE" id="descubreMesajeAccesCodeE-' + instance + '"></div>\
                    <div class="DescubreQP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="DescubreQP-CodeAccessE" id="descubreCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="descubreCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                        <div class="exeQuextIcons-Submit DescubreQP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="DescubreQP-ShowClue" id="descubreShowClue-' + instance + '">\
                    <p class="sr-av">' + msgs.msgClue + '</p>\
                    <p class="DescubreQP-PShowClue" id="descubrePShowClue-' + instance + '">Esta es la pista que necesitas</p>\
                    <a href="#" class="DescubreQP-ClueBotton" id="descubreClueButton-' + instance + '" title="Continuar">Continuar </a>\
                </div>\
            </div>\
            <div class="DescubreQP-DivFeedBack" id="descubreDivFeedBack-' + instance + '">\
                <input type="button" id="descubreFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
            <div class="DescubreQP-AuthorGame" id="descubreAuthorGame-' + instance + '"></div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },

    addButtonScore: function (instance) {
        var mOptions = $eXeDescubre.options[instance];
        var butonScore = "";
        var fB = '<div class="DescubreQP-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="DescubreQP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="descubreSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="DescubreQP-RepeatActivity" id="descubreRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="DescubreQP-GetScore">';
                fB += '<p><span class="DescubreQP-RepeatActivity" id="descubreRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    updateEvaluationIcon: function (instance) {
        var mOptions =  $eXeDescubre.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data =  $eXeDescubre.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                 $eXeDescubre.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
             $eXeDescubre.showEvaluationIcon(instance, state, score);
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#descubreMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');
        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions =  $eXeDescubre.options[instance];
        var $header = $('#descubreGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
        }
        $('#descubreEvaluationIcon-' + instance).remove();
        var sicon = '<div id="descubreEvaluationIcon-' + instance + '" class="DescubreQP-EvaluationDivIcon"><img  src="' +  $eXeDescubre.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#descubreEvaluationIcon-' + instance).find('span').eq(0).text(alt)
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
        var mOptions =  $eXeDescubre.options[instance],
        score = ((mOptions.hits * 10) / mOptions.wordsGame.length).toFixed(2);
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#descubreGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text();
            var formattedDate =  $eXeDescubre.getDateString();
            var scorm = {
                'id': mOptions.id,
                'type': mOptions.msgs.msgTypeGame,
                'node': node,
                'name': name,
                'score': score,
                'date': formattedDate,
                'state': (parseFloat(score) >= 5 ? 2 : 1)
            }
            var data =  $eXeDescubre.getDataStorage(mOptions.evaluationID);
            data =  $eXeDescubre.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeDescubre.showEvaluationIcon(instance, scorm.state, scorm.score)
        }
    },
    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data =  $eXeDescubre.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeDescubre.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.wordsGame.length).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeDescubre.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.repeatActivity && $eXeDescubre.previousScore !== '') {
                        message = $eXeDescubre.userName !== '' ? $eXeDescubre.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeDescubre.previousScore = score;
                        $eXeDescubre.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeDescubre.userName !== '' ? $eXeDescubre.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#descubreSendScore-' + instance).hide();
                        }
                        $('#descubreRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#descubreRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeDescubre.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeDescubre.mScorm.set("cmi.core.score.raw", score);
                    $('#descubreRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#descubreRepeatActivity-' + instance).show();
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
    addCards: function (instance, cardsGame) {
        var cards = "";
        cardsGame = $eXeDescubre.shuffleAds(cardsGame);
        $('#descubreMultimedia-' + instance).find('.DescubreQP-CardContainer').remove();
        for (var i = 0; i < cardsGame.length; i++) {
            var card = $eXeDescubre.createCard(cardsGame[i].number, cardsGame[i].type, cardsGame[i].url, cardsGame[i].eText, cardsGame[i].audio, cardsGame[i].x, cardsGame[i].y, cardsGame[i].alt, cardsGame[i].color, cardsGame[i].backcolor)
            cards += card;
        }
        $('#descubreMultimedia-' + instance).append(cards);
        $eXeDescubre.setSize(instance);

    },

    createCard: function (j, type, url, text, audio, x, y, alt, color, backcolor) {
        var malt = alt || '',
            saudio = "";
        if (url.trim().length > 0 && text.trim() > 0) {
            saudio = '<a href="#" data-audio="' + audio + '" class="DescubreQP-LinkAudio"  title="Audio"><img src="' + $eXeDescubre.idevicePath + 'exequextplayaudio.svg" class="DescubreQP-Audio"  alt="Audio"></a>';
        } else {
            saudio = '<a href="#" data-audio="' + audio + '" class="DescubreQP-LinkAudio"  title="Audio"><img src="' + $eXeDescubre.idevicePath + 'exequextplayaudio.svg" class="DescubreQP-Audio"  alt="Audio"></a>'

        }
        var card = '<div class="DescubreQP-CardContainer" data-number="' + j + '" data-type="' + type + '" data-state="-1">\
                    <div class="DescubreQP-Card1" data-type="' + type + '" data-state="-1" data-valid="0">\
                        <div class="DescubreQP-CardFront">\
                        </div>\
                        <div class="DescubreQP-CardBack">\
                            <div class="DescubreQP-ImageContain">\
                                <img src="" class="DescubreQP-Image" data-url="' + url + '" data-x="' + x + '" data-y="' + y + '" alt="' + malt + '" />\
                                <img class="DescubreQP-Cursor" src="' + $eXeDescubre.idevicePath + 'exequextcursor.gif" alt="" />\
                            </div>\
                            <div class="DescubreQP-EText" data-color="' + color + '" data-backcolor="' + backcolor + '">' + text + '</div>\
                            ' + saudio + '\
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
    isFullScreen: function () {
        return document.fullscreenElement ||
               document.webkitFullscreenElement ||
               document.mozFullScreenElement ||
               document.msFullscreenElement != null;
    },
    toggleFullscreen: function (element, instance) {
        var mOptions = $eXeDescubre.options[instance],
            element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            mOptions.fullscreen = true;
            $eXeDescubre.getFullscreen(element);
        } else {
            mOptions.fullscreen = false;
            $eXeDescubre.exitFullscreen(element);
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
        var mOptions = $eXeDescubre.options[instance];
        $('#descubreLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#descubreGameContainer-" + instance).show()
            $("#descubreGameMinimize-" + instance).hide();
        });
        $("#descubreLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#descubreGameContainer-" + instance).hide();
            $("#descubreGameMinimize-" + instance).css('visibility', 'visible').show();
        });
        $('#descubreCubierta-' + instance).hide();
        $('#descubreGameOver-' + instance).hide();
        $('#descubreCodeAccessDiv-' + instance).hide();
        $('#descubrePScore-' + instance).hide();
        $('#descubrePScoreIcon-' + instance).hide();
        $('#descubrePNumber-' + instance).hide();
        $('#descubrePNumberIcon-' + instance).hide();
        $eXeDescubre.showStartGame(instance, true);
        $('#descubreStartLevels-' + instance).show();
        $("#descubreLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('descubreGameContainer-' + instance);
            $eXeDescubre.toggleFullscreen(element, instance)
        });
        $('#descubreFeedBackClose-' + instance).on('click', function (e) {
            $('#descubreDivFeedBack-' + instance).hide();
            $('#descubreGameOver-' + instance).show();
        });

        if (mOptions.itinerary.showCodeAccess) {
            $('#descubreMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#descubreCodeAccessDiv-' + instance).show();
            $('#descubreStartLevels-' + instance).hide();
            $('#descubreCubierta-' + instance).show();

        }
        $('#descubreCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeDescubre.enterCodeAccess(instance);
        });

        $('#descubreCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeDescubre.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#descubrePNumber-' + instance).text(mOptions.numberQuestions);
        $(window).on('unload', function () {
            if (typeof ($eXeDescubre.mScorm) != "undefined") {
                $eXeDescubre.endScorm();
            }
        });
        if (mOptions.isScorm > 0) {
            $eXeDescubre.updateScorm($eXeDescubre.previousScore, mOptions.repeatActivity, instance);
        }
        $('#descubreSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeDescubre.sendScore(instance, false);
            $eXeDescubre.saveEvaluation(instance);

        });
        $('#descubreImage-' + instance).hide();
        window.addEventListener('resize', function () {
            var element = document.getElementById('descubreGameContainer-' + instance);
            element = element || document.documentElement;
            mOptions.fullscreen = !(!document.fullscreenElement && !document.mozFullScreenElement &&
                !document.webkitFullscreenElement && !document.msFullscreenElement);
            $eXeDescubre.refreshCards(instance);
        });
        $('#descubreStartGame0-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeDescubre.startGame(instance, 0);
        });
        $('#descubreStartGame1-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeDescubre.startGame(instance, 1);
        });
        $('#descubreStartGame2-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeDescubre.startGame(instance, 2);
        });
        $('#descubreStartGameEnd-' + instance).on('click', function (e) {
            e.preventDefault();
            if (mOptions.gameLevels == 1) {
                $eXeDescubre.startGame(instance, 0);
                return;
            }
            $('#descubreCubierta-' + instance).hide();
            $('#descubreStartLevels-' + instance).show();
            $('#descubreMultimedia-' + instance).find('.DescubreQP-Card1').removeClass('flipped');
        });

        $('#descubreReboot-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeDescubre.rebootGame(instance);
        });
        $('#descubreShowSolution-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeDescubre.showSolutions(instance);
        });
        $('#descubreClueButton-' + instance).on('click', function (e) {
            e.preventDefault();
            $('#descubreShowClue-' + instance).hide();
            $('#descubreCubierta-' + instance).fadeOut();
        }); -
        $('#descubreMultimedia-' + instance).on('click', '.DescubreQP-CardContainer', function (e) {
            $eXeDescubre.cardClick(this, instance);
        });

        $('#descubreMultimedia-' + instance).on('click', '.DescubreQP-LinkAudio', function (e) {
            e.preventDefault();
            var audio = $(this).data('audio');
            $eXeDescubre.playSound(audio, instance);
        });
        $('#descubrePErrors-' + instance).text(mOptions.attempts);
        if (mOptions.time == 0) {
            $('#descubrePTime-' + instance).hide();
            $('#descubreImgTime-' + instance).hide();
            $eXeDescubre.uptateTime(mOptions.time * 60, instance);
        } else {
            $eXeDescubre.uptateTime(mOptions.time * 60, instance);
        }
        if (mOptions.author.trim().length > 0 && !mOptions.fullscreen) {
            $('#descubreAuthorGame-' + instance).html(mOptions.msgs.msgAuthor + '; ' + mOptions.author);
            $('#descubreAuthorGame-' + instance).show();
        }
        if (!mOptions.showSolution) {
            $('#descubreShowSolution-' + instance).hide();

        }
        $eXeDescubre.updateEvaluationIcon(instance)

    },
    showStartGame: function (instance, show) {
        var mOptions = $eXeDescubre.options[instance];
        $('#descubreStartGame0-' + instance).hide();
        $('#descubreStartGame1-' + instance).hide();
        $('#descubreStartGame2-' + instance).hide();
        $('#descubreInfo-' + instance).show();
        if (show) {
            if (mOptions.gameLevels == 1) {
                $('#descubreStartGame2-' + instance).show();
                $('#descubreStartGame2-' + instance).text(mOptions.msgs.msgPlayStart);
                $('#descubreInfo-' + instance).hide();

            } else if (mOptions.gameLevels == 2) {
                $('#descubreStartGame0-' + instance).show();
                $('#descubreStartGame2-' + instance).show();

            }
            if (mOptions.gameLevels == 3) {
                $('#descubreStartGame0-' + instance).show();
                $('#descubreStartGame1-' + instance).show();
                $('#descubreStartGame2-' + instance).show();
            }
        }
    },
    cardClick: function (cc, instance) {
        $eXeDescubre.stopSound(instance);
        var mOptions = $eXeDescubre.options[instance],
            $cc = $(cc),
            maxsel = 1;
        if (mOptions.gameMode == 1) {
            maxsel = 2;
        } else if (mOptions.gameMode == 2) {
            maxsel = 3;
        }

        if (!mOptions.gameActived || !mOptions.gameStarted || mOptions.selecteds.length > maxsel) return;
        var state = parseInt($cc.data('state'));
        if (state != 0) return;
        var $card = $cc.find('.DescubreQP-Card1').eq(0);
        if (!$card.hasClass('flipped') && !mOptions.showCards) {
            $card.addClass('flipped');
        }
        mOptions.gameActived = false;
        $cc.data('state', '1');
        var num = parseInt($cc.data('number'));
        mOptions.selecteds.push(num);
        if (mOptions.selecteds.length <= maxsel) {
            var message = mOptions.msgs.msgSelectCard;
            $eXeDescubre.showMessage(3, message, instance, false)
        }
        var sound = $cc.find('.DescubreQP-LinkAudio').data('audio') || '';
        if (sound.length > 3) {
            $eXeDescubre.playSound(sound, instance)
        }
        var $text = $cc.find('.DescubreQP-EText').eq(0);
        $eXeDescubre.setFontSize($text, instance);
        $card.addClass("DescubreQP-CardActive");
        mOptions.gameActived = true;
        if (mOptions.gameMode == 0) {
            if (mOptions.selecteds.length == 2) {
                if (mOptions.selecteds[0] == mOptions.selecteds[1]) {
                    $eXeDescubre.correctPair(mOptions.selecteds[0], instance);
                } else {
                    $eXeDescubre.uncorrectPair(instance);
                }
            } else {
                var $marcados = $('#descubreMultimedia-' + instance).find('.DescubreQP-Card1');
                $marcados.each(function () {
                    var valid = parseInt($(this).data('valid'));
                    if (valid == 1 && !mOptions.showCards) {
                        $(this).find('.DescubreQP-CardBack').css("opacity", .3);
                    }
                });
            }
        } else if (mOptions.gameMode == 1) {
            if (mOptions.selecteds.length == 3) {
                if ((mOptions.selecteds[0] == mOptions.selecteds[1]) && mOptions.selecteds[0] == mOptions.selecteds[2]) {
                    $eXeDescubre.correctPair(mOptions.selecteds[0], instance);
                } else {
                    $eXeDescubre.uncorrectPair(instance);
                }
            } else {
                var $marcados = $('#descubreMultimedia-' + instance).find('.DescubreQP-Card1');
                $marcados.each(function () {
                    var valid = parseInt($(this).data('valid'));
                    if (valid == 1 && !mOptions.showCards) {
                        $(this).find('.DescubreQP-CardBack').css("opacity", .3);
                    }
                });
            }
        } else if (mOptions.gameMode == 2) {
            if (mOptions.selecteds.length == 4) {
                if ((mOptions.selecteds[0] == mOptions.selecteds[1]) && mOptions.selecteds[0] == mOptions.selecteds[2] && mOptions.selecteds[0] == mOptions.selecteds[3]) {
                    $eXeDescubre.correctPair(mOptions.selecteds[0], instance);
                } else {
                    $eXeDescubre.uncorrectPair(instance);
                }
            } else {
                var $marcados = $('#descubreMultimedia-' + instance).find('.DescubreQP-Card1');
                $marcados.each(function () {
                    var valid = parseInt($(this).data('valid'));
                    if (valid == 1 && !mOptions.showCards) {
                        $(this).find('.DescubreQP-CardBack').css("opacity", .3);
                    }
                });
            }
        }


    },
    showSolutions: function (instance) {
        var mOptions = $eXeDescubre.options[instance],
            colors = $eXeDescubre.getColors(mOptions.wordsGame.length);
        mOptions.gameOver = true;
        $('#descubreGameOver-' + instance).hide();
        var $cards = $('#descubreMultimedia-' + instance).find('.DescubreQP-CardContainer');
        $cards.each(function () {
            var $card = $(this).find('.DescubreQP-Card1').eq(0),
                number = parseInt($(this).data('number'));
            $card.removeClass("DescubreQP-CardOK DescubreQP-CardKO");
            if (!$card.hasClass('flipped')) {
                if (!mOptions.showCard) {
                    $card.addClass('flipped');
                }
                $card.addClass("DescubreQP-CardKO");
            } else {
                $card.addClass("DescubreQP-CardOK");
            }
            if (!isNaN(number) && number < colors.length) {
                var color = colors[number];
                $card.css({
                    'border-color': color
                });

                $('#descubreCubierta-' + instance).hide();
                $('#descubreStartGame-' + instance).show();
            }

        });
        $('#descubreStartLevels-' + instance).show();
    },
    getColors: function (number) {
        var colors = [];
        for (var i = 0; i < number; i++) {
            var color = $eXeDescubre.colorRGB();
            colors.push(color);
        }
        return colors;
    },
    colorRGB: function () {
        var color = "(" + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + "," + (Math.random() * 255).toFixed(0) + ")";
        return "rgb" + color;
    },
    uncorrectPair: function (instance) {
        var mOptions = $eXeDescubre.options[instance];
        $eXeDescubre.updateScore(false, instance);
        setTimeout(function () {
            $eXeDescubre.updateCovers(instance, false);
            mOptions.selecteds = [];
            mOptions.gameActived = true;
            $eXeDescubre.showMessage(3, mOptions.msgs.msgSelectCardOne, instance)
        }, mOptions.timeShowSolution);

    },
    correctPair: function (number, instance) {
        var mOptions = $eXeDescubre.options[instance];
        mOptions.activeQuestion = mOptions.selecteds[0];
        mOptions.selecteds = [];
        $eXeDescubre.updateCovers(instance, true);
        $eXeDescubre.updateScore(true, instance);
        var percentageHits = (mOptions.hits / mOptions.wordsGame.length) * 100;
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                mOptions.obtainedClue = true;
                $('#descubrePShowClue-' + instance).text(mOptions.itinerary.clueGame);
                $('#descubreCubierta-' + instance).show();
                $('#descubreShowClue-' + instance).fadeIn();
            }
        }

        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeDescubre.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeDescubre.sendScore(instance, true);
                $('#descubreRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeDescubre.initialScore = score;
            }
        }
        $eXeDescubre.saveEvaluation(instance);
        var $marcados = $('#descubreMultimedia-' + instance).find('.DescubreQP-CardContainer[data-number="' + number + '"]').find('.DescubreQP-Card1')
        $marcados.each(function () {
            $(this).data('valid', '1');
            $(this).animate({
                zoom: '110%'
            }, "slow");
        });
        var opacity = mOptions.showCards ? 0.25 : 0.3;
        if (mOptions.showCards) {
            $marcados.find('.DescubreQP-CardBack').css("opacity", opacity);
        }
        if (mOptions.hits >= mOptions.wordsGame.length) {
            var message = mOptions.msgs.msgCool + ' ' + mOptions.msgs.mgsAllCards;
            if (mOptions.gameMode == 1) {
                message = mOptions.msgs.msgCool + ' ' + mOptions.msgs.mgsAllTrios;
            } else if (mOptions.gameMode == 2) {
                message = mOptions.msgs.msgCool + ' ' + mOptions.msgs.mgsAllQuartets;
            }
            $eXeDescubre.showMessage(3, message, instance)
            setTimeout(function () {
                $marcados.find('.DescubreQP-CardBack').css("opacity", opacity);
                $eXeDescubre.gameOver(0, instance);
                mOptions.gameActived = true;
            }, mOptions.timeShowSolution);

        } else {
            mOptions.gameActived = true;
        }
    },
    updateCovers: function (instance, answers) {
        var mOptions = $eXeDescubre.options[instance],
            $cardContainers = $('#descubreMultimedia-' + instance).find('.DescubreQP-CardContainer');
        $cardContainers.each(function () {
            var state = $(this).data('state'),
                $card = $(this).find('.DescubreQP-Card1').eq(0);

            $card.removeClass("DescubreQP-CardActive");
            if (state == 1) {
                if (answers) {
                    state = 2;
                } else {
                    state = 0;
                }
                $(this).data('state', state);
            }
            if (state == 0) {
                $(this).css('cursor', 'pointer');
                if (!mOptions.showCards) {
                    $card.removeClass('flipped')
                }
            } else {
                $(this).css('cursor', 'default');
            }
        });
    },
    showCard: function (card, instance) {
        var mOptions = $eXeDescubre.options[instance],
            $card = card,
            $noImage = $card.find('.DescubreQP-Cover').eq(0),
            $text = $card.find('.DescubreQP-EText').eq(0),
            $image = $card.find('.DescubreQP-Image').eq(0),
            $cursor = $card.find('.DescubreQP-Cursor').eq(0),
            $audio = $card.find('.DescubreQP-LinkAudio').eq(0),
            type = parseInt($card.data('type')),
            state = $noImage.data('state'),
            x = parseFloat($image.data('x')),
            y = parseFloat($image.data('y')),
            url = $image.data('url'),
            alt = $image.attr('alt') || "No disponibLe",
            audio = $audio.data('audio') || '',
            text = $text.html() || "",
            color = $text.data('color'),
            backcolor = $text.data('backcolor');
        $eXeDescubre.setFontSize($text, instance);
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
                        $eXeDescubre.positionPointerCard($cursor, x, y)
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
                        $eXeDescubre.positionPointerCard($cursor, x, y)
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
        }

        $audio.removeClass('DescubreQP-LinkAudioBig')
        if (audio.length > 0) {
            if (url.trim().length == 0 && text.trim().length == 0) {
                $audio.addClass('DescubreQP-LinkAudioBig')
            }
            $audio.show();
            if (mOptions.gameStarted && !mOptions.refreshCard) {
                $eXeDescubre.playSound(audio, instance);
            }
        }
        if (state > 0) {
            $noImage.hide();
        }
    },
    positionPointerCard: function($cursor, x, y) {
        $cursor.hide();
        if(x > 0 || y > 0){
            var parentClass = '.DescubreQP-ImageContain',
                siblingClass ='.DescubreQP-Image',
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
    refreshCards: function (instance) {
        var mOptions = $eXeDescubre.options[instance],
            $flcds = $('#descubreMultimedia-' + instance).find('.DescubreQP-CardContainer')
        if ( mOptions.refreshCard) return;
        mOptions.refreshCard = true;
        $eXeDescubre.setSize(instance);
        $flcds.each(function () { 
            var $card= $(this),
                $imageF = $card.find('.DescubreQP-Image').eq(0),
                $cursorF = $card.find('.DescubreQP-Cursor').eq(0),
                $textF= $card.find('.DescubreQP-EText').eq(0),
                xF = parseFloat($imageF.data('x')) || 0,
                yF = parseFloat($imageF.data('y')) || 0;
            $eXeDescubre.positionPointerCard($cursorF, xF, yF);
            $eXeDescubre.setFontSize($textF, instance);

            });
        mOptions.refreshCard = false;
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeDescubre.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() == $('#descubreCodeAccessE-' + instance).val().toLowerCase()) {
            $('#descubreCodeAccessDiv-' + instance).hide();
            $('#descubreCubierta-' + instance).hide();
            $('#descubreStartLevels-' + instance).show();
        } else {
            $('#descubreMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#descubreCodeAccessE-' + instance).val('');
        }
    },
    activeHover: function ($card, instance) {
        var mOptions = $eXeDescubre.options[instance],
            state = $card.data('state');
        $card.off('mouseenter mouseleave');
        $card.removeClass("DescubreQP-Hover");
        if (state == 0) {
            $card.hover(
                function () {
                    state = $card.data('state');
                    $card.css('cursor', 'default');
                    if (mOptions.gameActived && state == 0) {
                        $card.addClass("DescubreQP-Hover");
                        $card.css('cursor', 'pointer');

                    }
                },
                function () {
                    $card.removeClass("DescubreQP-Hover");
                }
            );
        }

    },
    setSize: function (instance) {
        var mOptions = $eXeDescubre.options[instance],
            numCards = mOptions.cardsGame.length,
            size = "12%",
            msize = "12%",
            sizes = [],
            puntos = [],
            h = screen.height - $('#descubreGameScoreBoard-' + instance).height() - 2 * $('#descubreStartGame0-' + instance).height();

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
        if (mOptions.fullscreen) {
            size = msize;
        }
        if (mOptions.fullscreen) {
            size = msize;
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
        $('#descubreMultimedia-' + instance).find('.DescubreQP-CardContainer').each(function () {
            $(this).css({
                'width': size
            });

        });
    },
    initCards: function (instance) {
        var $cards = $('#descubreMultimedia-' + instance).find('.DescubreQP-CardContainer');
        $cards.each(function () {
            $(this).data('state', '0');
            $eXeDescubre.activeHover($(this), instance);
            $eXeDescubre.showCard($(this), instance);
        });
        $eXeDescubre.updateLatex('descubreMultimedia-' + instance)
    },
    getCardsLevels: function (nivel, instance) {
        var mOptions = $eXeDescubre.options[instance],
            num = mOptions.wordsGameFix.length,
            snivel = mOptions.msgs.msgRookie;
        if (mOptions.gameLevels == 2) {
            if (nivel == 0) {
                num = Math.floor(mOptions.wordsGameFix.length / 2)
            }

        } else if (mOptions.gameLevels == 3) {
            if (nivel == 0) {
                num = Math.floor(mOptions.wordsGameFix.length / 3)
            } else if (nivel == 1) {
                num = Math.floor(mOptions.wordsGameFix.length * 2 / 3)
            }
        }
        num == num > 0 ? num : mOptions.wordsGameFix.length;
        mOptions.wordsGame = mOptions.wordsGameFix.slice(0, num);
        mOptions.numberQuestions = mOptions.wordsGame.length;
        if (nivel == 1) {
            snivel = mOptions.msgs.msgExpert;
        } else if (nivel == 2) {
            snivel = mOptions.msgs.msgMaster;
        }
        $('#descubreInfo-' + instance).text(mOptions.msgs.msgLevel + ': ' + snivel);
        var cardsGame = $eXeDescubre.createCardsData(mOptions.wordsGame, mOptions.gameMode);
        return cardsGame;

    },
    startGame: function (instance, nivel) {
        var mOptions = $eXeDescubre.options[instance];
        if (mOptions.gameStarted) {
            return;
        };
        mOptions.cardsGame = $eXeDescubre.getCardsLevels(nivel, instance);
        $eXeDescubre.addCards(instance, mOptions.cardsGame);
        mOptions.solveds = [];
        mOptions.selecteds = [];
        var msgstar = mOptions.msgs.mgsGameStart;
        if (mOptions.gameMode == 1) {
            msgstar = mOptions.msgs.mgsGameStart3;
        } else if (mOptions.gameMode == 2) {
            msgstar = mOptions.msgs.mgsGameStart4;
        }
        $eXeDescubre.showMessage(3, msgstar, instance, false);
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = true;
        mOptions.counter = mOptions.time * 60;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.obtainedClue = false;
        mOptions.nattempts = mOptions.attempts > 0 ? mOptions.attempts : 0;
        $('#descubrePShowClue-' + instance).text('');
        $('#descubreShowClue-' + instance).hide();
        $('#descubrePHits-' + instance).text(mOptions.hits);
        $('#descubrePErrors-' + instance).text(mOptions.nattempts);
        $('#descubreCubierta-' + instance).hide();
        $('#descubreGameOver-' + instance).hide();
        $('#descubreStartLevels-' + instance).hide();
        $('#descubreMessage-' + instance).show();
        $eXeDescubre.initCards(instance);
        if (mOptions.time == 0) {
            $('#descubrePTime-' + instance).hide();
            $('#descubreImgTime-' + instance).hide();
        }
        if (mOptions.time > 0) {
            mOptions.counterClock = setInterval(function () {
                if (mOptions.gameStarted) {
                    mOptions.counter--;
                    if (mOptions.counter <= 0) {
                        $eXeDescubre.gameOver(2, instance);
                        return;
                    }
                }
                $eXeDescubre.uptateTime(mOptions.counter, instance);
            }, 1000);
            $eXeDescubre.uptateTime(mOptions.time * 60, instance);
        }
        if (mOptions.showCards) {
            $('#descubreMultimedia-' + instance).find('.DescubreQP-Card1').addClass('flipped');
        }
        mOptions.gameStarted = true;
    },
    uptateTime: function (tiempo, instance) {
        var mOptions = $eXeDescubre.options[instance];
        if (mOptions.time == 0) return;
        var mTime = $eXeDescubre.getTimeToString(tiempo);
        $('#descubrePTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeDescubre.options[instance];
        if (!mOptions.gameStarted) {
            return;
        }
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        mOptions.gameOver = true;
        $eXeDescubre.stopSound(instance);
        $('#descubreCubierta-' + instance).show();
        $eXeDescubre.showScoreGame(type, instance);
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeDescubre.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeDescubre.sendScore(instance, true);
                $('#descubreRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeDescubre.initialScore = score;
            }
        }
        $eXeDescubre.saveEvaluation(instance);
        $eXeDescubre.showFeedBack(instance);
    },

    rebootGame: function (instance) {
        var mOptions = $eXeDescubre.options[instance];
        if (!mOptions.gameStarted) {
            return;
        }
        mOptions.gameActived =
            mOptions.gameStarted = false;
        $('#descubreCubierta-' + instance).hide();
        $('#descubreStartLevels-' + instance).show();
        $('#descubreMultimedia-' + instance).find('.DescubreQP-Card1').removeClass('flipped DescubreQP-CardActive');
        mOptions.gameStarted = false;
        mOptions.solveds = [];
        mOptions.selecteds = [];
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.counter = mOptions.time * 60;
        mOptions.obtainedClue = false;
        $eXeDescubre.uptateTime(mOptions.counter, instance);
        mOptions.nattempts = mOptions.attempts > 0 ? mOptions.attempts : 0;
        $('#descubrePShowClue-' + instance).text('');
        $('#descubreShowClue-' + instance).hide();
        $('#descubrePHits-' + instance).text(mOptions.hits);
        $('#descubrePErrors-' + instance).text(mOptions.nattempts);
        $('#descubreCubierta-' + instance).hide();
        $('#descubreGameOver-' + instance).hide();
        $('#descubreStartLevels-' + instance).hide();
        $('#descubreMessage-' + instance).hide();
        clearInterval(mOptions.counterClock);
        $eXeDescubre.stopSound(instance);
        $('#descubreStartLevels-' + instance).show();
        $('#descubreCubierta-' + instance).hide();
        $('#descubreInfo-' + instance).text(mOptions.msgs.msgSelectLevel);
        ('#descubreCubierta-' + instance).show();
    },
    showFeedBack: function (instance) {
        var mOptions = $eXeDescubre.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.wordsGame.length;
        if (mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#descubreGameOver-' + instance).hide();
                $('#descubreDivFeedBack-' + instance).find('.descubre-feedback-game').show();
                $('#descubreDivFeedBack-' + instance).show();
            } else {
                $eXeDescubre.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance, false);
            }
        }
    },
    isMobile: function () {

        return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i))
    },

    showScoreGame: function (type, instance) {
        var mOptions = $eXeDescubre.options[instance],
            msgs = mOptions.msgs,
            $descubreHistGame = $('#descubreHistGame-' + instance),
            $descubreLostGame = $('#descubreLostGame-' + instance),
            $descubreOverNumCards = $('#descubreOverNumCards-' + instance),
            $descubreOverHits = $('#descubreOverHits-' + instance),
            $descubreOverAttemps = $('#descubreOverAttemps-' + instance),
            $descubreCubierta = $('#descubreCubierta-' + instance),
            $descubreGameOver = $('#descubreGameOver-' + instance),
            message = "",
            messageColor = 1;
        $descubreHistGame.hide();
        $descubreLostGame.hide();
        $descubreOverNumCards.show();
        $descubreOverHits.show();
        $descubreOverAttemps.show();
        var mclue = '';
        switch (parseInt(type)) {
            case 0:
                message = msgs.msgCool + ' ' + msgs.mgsAllCards;
                if (mOptions.gameMode == 1) {
                    message = mOptions.msgs.msgCool + ' ' + mOptions.msgs.mgsAllTrios;
                } else if (mOptions.gameMode == 2) {
                    message = mOptions.msgs.msgCool + ' ' + mOptions.msgs.mgsAllQuartets;
                }
                messageColor = 2;
                $descubreHistGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#descubrePShowClue-' + instance).text();
                    if (mOptions.obtainedClue) {
                        mclue = text;
                    } else {
                        mclue = msgs.msgTryAgain.replace('%s', mOptions.itinerary.percentageClue);
                    }
                }
                break;
            case 1:
                messageColor = 3;
                $descubreLostGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#descubrePShowClue-' + instance).text();
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
                $descubreLostGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#descubrePShowClue-' + instance).text();
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
                $descubreLostGame.show();
                if (mOptions.itinerary.showClue) {
                    var text = $('#descubrePShowClue-' + instance).text();
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
        $eXeDescubre.showMessage(messageColor, message, instance, true);
        var game = msgs.msgPairs;
        if (mOptions.gameMode == 1) {
            game = msgs.msgTrios;
        } else if (mOptions.gameMode == 2) {
            game = msgs.msgQuarts;
        }
        $descubreOverNumCards.html(game + ': ' + mOptions.wordsGame.length);
        $descubreOverHits.html(msgs.msgHits + ': ' + mOptions.hits);
        $descubreOverAttemps.html(msgs.msgAttempts + ': ' + attemps);
        $descubreGameOver.show();
        $descubreCubierta.show();
        $('#descubreShowClue-' + instance).hide();
        if (mOptions.itinerary.showClue) {
            $eXeDescubre.showMessage(3, mclue, instance, true)
        }
    },
    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },
    getRetroFeedMessages: function (iHit, instance) {
        var mOptions = $eXeDescubre.options[instance],
            sMessages = iHit ? mOptions.msgs.msgSuccesses : mOptions.msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeDescubre.options[instance],
            message = "",
            obtainedPoints = 0,
            type = 1,
            sscore = 0;
        if (correctAnswer) {
            mOptions.hits++
            obtainedPoints = (10 / mOptions.wordsGame.length);
            type = 2;
        }
        if (mOptions.attempts > 0) {
            mOptions.nattempts--;
        } else {
            mOptions.nattempts++;
        }
        mOptions.score = mOptions.score + obtainedPoints;
        sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#descubrePErrors-' + instance).text(mOptions.nattempts);
        $('#descubrePScore-' + instance).text(sscore);
        $('#descubrePHits-' + instance).text(mOptions.hits);
        message = $eXeDescubre.getMessageAnswer(correctAnswer, instance);
        $eXeDescubre.showMessage(type, message, instance, false);
        if (mOptions.attempts > 0 && mOptions.nattempts == 0 && mOptions.hits < mOptions.wordsGame.length) {
            mOptions.gameActived = false;
            setTimeout(function () {
                $eXeDescubre.gameOver(3, instance)
            }, mOptions.timeShowSolution)
        }
    },
    getMessageAnswer: function (correctAnswer, instance) {
        var message = "";
        if (correctAnswer) {
            message = $eXeDescubre.getMessageCorrectAnswer(instance);
        } else {
            message = $eXeDescubre.getMessageErrorAnswer(instance);
        }
        return message;
    },
    getMessageCorrectAnswer: function (instance) {
        var mOptions = $eXeDescubre.options[instance],
            messageCorrect = $eXeDescubre.getRetroFeedMessages(true, instance),
            message = messageCorrect + ' ' + mOptions.msgs.msgCompletedPair;
        if (mOptions.gameMode == 1) {
            message = messageCorrect + ' ' + mOptions.msgs.msgCompletedTrio;
        } else if (mOptions.gameMode == 2) {
            message = messageCorrect + ' ' + mOptions.msgs.msgCompletedQuartet;
        }
        if (mOptions.customMessages && mOptions.wordsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.wordsGame[mOptions.activeQuestion].msgHit
        }
        return message;
    },
    getMessageErrorAnswer: function (instance) {
        return $eXeDescubre.getRetroFeedMessages(false, instance);
    },
    showMessage: function (type, message, instance, end) {
        var colors = ['#555555', $eXeDescubre.borderColors.red, $eXeDescubre.borderColors.green, $eXeDescubre.borderColors.blue, $eXeDescubre.borderColors.yellow],
            color = colors[type];

        $('#descubreMessage-' + instance).text(message);
        $('#descubreMessage-' + instance).css({
            'color': color
        });
        if (end) {
            $('#descubreMessage-' + instance).hide();
            $('#descubreMesasgeEnd-' + instance).text(message);
            $('#descubreMesasgeEnd-' + instance).css({
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
    $eXeDescubre.init();
});