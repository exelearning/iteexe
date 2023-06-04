/**
 * Mapa activity (Export)
 * Version: 1
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeMapa = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#00a300',
        red: '#b3092f',
        white: '#ffffff',
        yellow: '#f3d55a',
        grey: '#777777',
        incorrect: '#d9d9d9',
        correct: '#00ff00'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#dfe3f1',
        green: '#caede8',
        red: '#fbd2d6',
        white: '#ffffff',
        yellow: '#fcf4d3',
        grey: '#777777',
        incorrect: '#d9d9d9',
        correct: '#00ff00'
    },
    options: [],
    hasSCORMbutton: false,
    isInExe: false,
    userName: '',
    scorm: '',
    previousScore: '',
    initialScore: '',
    hasLATEX: false,
    hasAreas: false,
    init: function () {
        this.activities = $('.mapa-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeMapa.supportedBrowser('mapa')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Mapa') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/mapa-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeMapa.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeMapa.enable()');
        else this.enable();
        $eXeMapa.mScorm = scorm;
        var callSucceeded = $eXeMapa.mScorm.init();
        if (callSucceeded) {
            $eXeMapa.userName = $eXeMapa.getUserName();
            $eXeMapa.previousScore = $eXeMapa.getPreviousScore();
            $eXeMapa.mScorm.set("cmi.core.score.max", 10);
            $eXeMapa.mScorm.set("cmi.core.score.min", 0);
            $eXeMapa.initialScore = $eXeMapa.previousScore;
        }
    },
    getUserName: function () {
        var user = $eXeMapa.mScorm.get("cmi.core.student_name");
        return user;
    },
    getPreviousScore: function () {
        var score = $eXeMapa.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeMapa.mScorm.quit();
    },
    enable: function () {
        $eXeMapa.loadGame();
    },
    loadGame: function () {
        $eXeMapa.options = [];
        $eXeMapa.activities.each(function (i) {
            var dl = $(".mapa-DataGame", this),
                $imagesLink = $('.mapa-LinkImagesPoints', this),
                $audiosLink = $('.mapa-LinkAudiosPoints', this),
                $textLink = $('.mapa-LinkTextsPoints', this),
                $toolTips = $('.mapa-LinkToolTipPoints', this),
                $imagesMap = $('.mapa-LinkImagesMapas', this),
                $imagesSlides = $('.mapa-LinkImagesSlides', this),
                $audiosIdentifyLink = $('.mapa-LinkAudiosIdentify', this),
                $urlmap = $('.mapa-ImageMap', this).eq(0).attr('src');
            $urlmap = typeof $urlmap == "undefined" ? $('.mapa-ImageMap', this).eq(0).attr('href') : $urlmap;
            var mOption = $eXeMapa.loadDataGame(dl, $imagesLink, $textLink, $audiosLink, $imagesMap, $audiosIdentifyLink, $imagesSlides, $urlmap, $toolTips);
            $eXeMapa.options.push(mOption);
            var mapa = $eXeMapa.createInterfaceMapa(i);
            dl.before(mapa).remove();
            $eXeMapa.initElements(i);
            $eXeMapa.addEvents(i);
            $eXeMapa.addPoints(i, mOption.activeMap.pts);
            $eXeMapa.showButtonAreas(mOption.activeMap.pts, i);
            if (mOption.evaluation == 1) {
                $eXeMapa.showImageTest(mOption.url, mOption.altImage, i);
            }
            $eXeMapa.showImage(mOption.url, mOption.altImage, i);
            if (mOption.evaluation == 1 || mOption.evaluation == 2 || mOption.evaluation == 3) {
                $eXeMapa.startFinds(i);
            }
            mOption.localPlayer = document.getElementById('mapaVideoLocal-' + i);
        });
        if ($eXeMapa.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeMapa.loadMathJax();
        }
    },
    showImageTest(url, alt, instance) {
        var $Image = $('#mapaImageRect-' + instance);
        $Image.prop('src', url);
        $Image.attr('alt', alt);
    },
    addPoints: function (instance, points) {
        var mOptions = $eXeMapa.options[instance],
            spoints = "",
            options = "",
            pts = [];
        $('#mapaMultimedia-' + instance).find('.MQP-Point').remove();
        $('#mapaMultimedia-' + instance).find('.MQP-Area').remove();
        $('#mapaOptionsTest-' + instance).find('.MPQ-OptionTest').remove();
        for (var i = 0; i < points.length; i++) {
            var p = points[i],
                title = (mOptions.evaluation != 1 && mOptions.evaluation != 2 && mOptions.evaluation != 3) ? p.title : '',
                point = '<a href="#" class="MQP-Point MQP-Activo" data-number="' + i + '"   data-id="' + p.id + '" title="' + title + '"><span>' + p.title + '</span></a>',
                pt = {
                    'number': i,
                    'title': p.title
                };

            pts.push(pt);

            if (p.iconType == 1 && mOptions.evaluation != 1) {
                point = '<a href="#" class="MQP-Area" data-number="' + i + '"  data-id="' + p.id + '" title="' + title + '"><span>' + p.title + '</span></a>';
            }
            spoints += point;
        }
        if (mOptions.evaluation == 1) {
            pts.sort(function (a, b) {
                var nameA = a.title.toUpperCase();
                var nameB = b.title.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            for (var j = 0; j < pts.length; j++) {
                var option = '<a href="#"class="MPQ-OptionTest"  data-id="' + pts[j].id + '" data-number="' + pts[j].number + '">' + pts[j].title + '</a>';
                options += option;
            }
        }
        $('#mapaMultimedia-' + instance).append(spoints);
        $('#mapaOptionsTest-' + instance).append(options);
    },
    paintPoints: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $('#mapaMultimedia-' + instance).find('.MQP-Point').each(function () {
            var number = parseInt($(this).data('number')),
                icon = mOptions.evaluation == 1 ? 19 : mOptions.activeMap.pts[number].iconType;
            $eXeMapa.paintPoint($('#mapaImage-' + instance), $(this), mOptions.activeMap.pts[number].x, mOptions.activeMap.pts[number].y, icon, instance);
        });
        if (mOptions.evaluation == 1 || mOptions.evaluation == -2) return;
        $('#mapaMultimedia-' + instance).find('.MQP-Area').each(function () {
            var number = parseInt($(this).data('number'));
            $eXeMapa.paintArea($('#mapaImage-' + instance), $(this), mOptions.activeMap.pts[number].x, mOptions.activeMap.pts[number].y, mOptions.activeMap.pts[number].x1, mOptions.activeMap.pts[number].y1);
        });
    },
    paintPoint: function (image, cursor, x, y, icon, instance) {
        var mOptions = $eXeMapa.options[instance];
        var mI = (icon == 19 || icon == 39 || icon == 59 || icon == 79) ? $eXeMapa.idevicePath + 'mapam' + icon + '.png' : $eXeMapa.idevicePath + 'mapam' + icon + '.svg',
            number = $(cursor).data('number');
        if (mOptions.evaluation == 1 || mOptions.evaluation == -2) {
            mI = $eXeMapa.idevicePath + 'mapam19.png';
            if (mOptions.activeMap.pts[number].state == 1) {
                mI = $eXeMapa.idevicePath + 'mapaerror.png';
            } else if (mOptions.activeMap.pts[number].state == 2) {
                mI = $eXeMapa.idevicePath + 'mapahit.png';
            }
        }
        var icon1 = 'url(' + mI + ')';
        $(cursor).css({
            'background-image': icon1
        });
        var p = $eXeMapa.getIconPos(icon),
            w = Math.round($(cursor).width() * p.x),
            h = Math.round($(cursor).height() * p.y);
        $(cursor).hide();
        if (x > 0 || y > 0) {
            var wI = $(image).width() > 0 ? $(image).width() : 1,
                hI = $(image).height() > 0 ? $(image).height() : 1,
                lI = Math.round($(image).position().left + Math.round(wI * x) - w),
                tI = Math.round($(image).position().top + Math.round(hI * y) - h);
            $(cursor).css({
                left: lI + 'px',
                top: tI + 'px',
                'z-index': 3000
            });
            $(cursor).show();
        }
    },
    getIconPos: function (icon) {
        var iconX = 0,
            iconY = 0,
            c = [0, 1, 2, 3, 4, 5, 6, 10, 19, 20, 21, 22, 23, 24, 25, 26, 30, 39, 40, 41, 42, 43, 44, 45, 46, 50, 59, 60, 61, 62, 63, 64, 65, 66, 70, 79],
            uc = [18, 38, 58, 78],
            dc = [7, 9, 15, 27, 29, 35, 47, 49, 55, 67, 69, 75],
            lu = [11, 31, 51, 71],
            lc = [16, 36, 56, 76],
            ld = [8, 14, 28, 34, 48, 54, 68, 74],
            ru = [12, 32, 52, 72],
            rc = [17, 37, 57, 77],
            rd = [13, 33, 53, 73];
        if (c.indexOf(icon) != -1) {
            iconX = 0.5;
            iconY = 0.5;
        } else if (uc.indexOf(icon) != -1) {
            iconX = 0.5;
            iconY = 0;
        } else if (dc.indexOf(icon) != -1) {
            iconX = 0.5;
            iconY = 1;
        } else if (lu.indexOf(icon) != -1) {
            iconX = 0;
            iconY = 0;
        } else if (lc.indexOf(icon) != -1) {
            iconX = 0;
            iconY = 0.5;
        } else if (ld.indexOf(icon) != -1) {
            iconX = 0;
            iconY = 1;
        } else if (ru.indexOf(icon) != -1) {
            iconX = 1;
            iconY = 0;
        } else if (rc.indexOf(icon) != -1) {
            iconX = 1;
            iconY = 0.5;
        } else if (rd.indexOf(icon) != -1) {
            iconX = 1;
            iconY = 1;
        }
        return {
            x: iconX,
            y: iconY
        };

    },
    paintArea: function (image, area, x, y, x1, y1) {
        var $image = $(image),
            $area = $(area);
        $area.hide();
        var wI = $image.width() > 0 ? $image.width() : 1,
            hI = $image.height() > 0 ? $image.height() : 1,
            px = x >= x1 ? x1 : x,
            py = y >= y1 ? y1 : y,
            w = Math.round(Math.abs(x1 - x) * wI),
            h = Math.round(Math.abs(y1 - y) * hI),
            lI = Math.round($image.position().left + (wI * px)),
            tI = Math.round($image.position().top + (hI * py));
        $area.css({
            left: lI + 'px',
            top: tI + 'px',
            width: w + 'px',
            height: h + 'px',
            'z-index': 3000
        });
        $area.show();
    },
    updateSoundVideo: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        if (mOptions.activeSilent) {
            if (mOptions.player && typeof mOptions.player.getCurrentTime === "function") {
                var time = Math.round(mOptions.player.getCurrentTime());
                if (time == mOptions.question.silentVideo) {
                    mOptions.player.mute(instance);
                } else if (time == mOptions.endSilent) {
                    mOptions.player.unMute(instance);
                }
            }
        }
    },
    loadDataGame: function (data, $imagesLink, $textLink, $audiosLink, $imagesMap, $audiosIdentifyLink, $imagesSlides, url, $toolTips) {
        var json = data.text(),
            mOptions = $eXeMapa.isJsonString(json);
        mOptions.url = url;
        mOptions.optionsNumber = typeof mOptions.optionsNumber == "undefined" ? 0 : mOptions.optionsNumber;
        mOptions.hasAreas = false;
        mOptions.waitPlayVideo = false;
        mOptions.gameOver = false;
        mOptions.activeSlide = 0;
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = false;
        mOptions.showData = false;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        mOptions.questionaireStarted = false;
        mOptions.activeQuestion = 0;
        mOptions.obtainedClue = false;
        mOptions.title = {};
        mOptions.activeTitle = 0;
        mOptions.showDetail = false;
        mOptions.visiteds = [];
        mOptions.levels = [];
        mOptions.numLevel = 0;
        mOptions.hasYoutube = $eXeMapa.setMedias(mOptions.points, $imagesLink, $textLink, $audiosLink, $imagesMap, $audiosIdentifyLink, $imagesSlides, false, mOptions.evaluation, $toolTips);
        mOptions.titles = $eXeMapa.getDataGame1(mOptions.points, mOptions.evaluation);
        mOptions.numberQuestions = mOptions.evaluation == 4 ? Math.floor(mOptions.selectsGame.length * (mOptions.percentajeQuestions / 100)) : Math.floor(mOptions.titles.length * (mOptions.percentajeIdentify / 100));
        mOptions.numberQuestions = mOptions.evaluation == 1 ? mOptions.points.length : mOptions.numberQuestions;
        mOptions.numberPoints = $eXeMapa.getNumberPoints(mOptions.points);
        mOptions.activeMap = {};
        mOptions.activeMap.pts = Object.values($.extend(true, {}, mOptions.points));
        mOptions.activeMap.url = mOptions.url;
        mOptions.activeMap.author = mOptions.authorImage;
        mOptions.activeMap.alt = mOptions.altImage;
        mOptions.activeMap.active = 0;
        mOptions.levels = [];
        mOptions.levels.push($.extend(true, {}, mOptions.activeMap));
        mOptions.level = 0;
        if (mOptions.evaluation == 0) {
            mOptions.gameStarted = true;
        } else if (mOptions.evaluation == 4) {
            mOptions.selectsGame = $eXeMapa.shuffleAds(mOptions.selectsGame);
            mOptions.gameStarted = true;
        }
        mOptions.playerAudio = "";
        mOptions.loadingURL = false;
        mOptions.topBBTop = false;
        mOptions.autoShow = typeof mOptions.autoShow == "undefinide" ? false : mOptions.autoShow;
        return mOptions;
    },
    getDataGame1: function (pts, evaluation) {
        var data = [];
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            p.state = -1;
            if (p.type != 5 || p.map.pts.length == 0) {
                data.push({
                    'title': p.title,
                    'question': p.question,
                    'id': p.id,
                    'audio': p.question_audio
                });

                if (p.type == 6 && evaluation == 1 && typeof p.slides != "undefined" && p.slides.length > 0) {
                    p.type = 0;
                    p.url = p.slides[0].url;
                }
            } else {
                if (evaluation == 1) {
                    p.type = 0;
                    p.url = p.map.url;
                }
                var rdata = $eXeMapa.getDataGame1(p.map.pts, evaluation);
                data = data.concat(rdata);
            }
        }
        return data;
    },
    setMedias: function (pts, $images, $texts, $audios, $imgmpas, $audiosIdentifyLink, $imagesSlides, hasYoutube, evaluation, $tooltips) {
        var hasYB = hasYoutube;
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            if (p.type != 5) {
                if (p.type == 0 && typeof p.url != "undefined" && p.url.indexOf('http') != 0 && p.url.length > 4) {
                    $eXeMapa.setImage(p, $images);
                } else if (p.type == 0 && typeof p.url != "undefined" && p.url.indexOf('http') == 0) {
                    p.url = $eXeMapa.extractURLGD(p.url);
                } else if (p.type == 2 && typeof p.eText != "undefined" && p.eText.trim().length > 0) {
                    $eXeMapa.setText(p, $texts);
                } else if (p.type == 7 && typeof p.toolTip != "undefined" && p.toolTip.trim().length > 0) {
                    $eXeMapa.setToolTip(p, $tooltips);
                }
                if (p.type != 1 && typeof p.audio != "undefined" && p.audio.indexOf('http') != 0 && p.audio.length > 4) {
                    $eXeMapa.setAudio(p, $audios);
                }
                if (p.type == 1 && p.video.length > 4) {
                    hasYB = true;
                }
                if (typeof p.question_audio != "undefined" && p.question_audio.indexOf('http') != 0 && p.question_audio.length > 4) {
                    $eXeMapa.setAudioIdentefy(p, $audiosIdentifyLink);
                }
                if (p.type == 6 && typeof p.slides != "undefined" && p.slides.length > 0) {
                    for (var j = 0; j < p.slides.length; j++) {
                        var s = p.slides[j];
                        $eXeMapa.setImageSlide(s, $imagesSlides);
                    }
                } else if (p.type != 6 && (typeof p.slides == "undefined" || p.slides.length == 0)) {
                    p.slides = [];
                    p.slides.push($eXeMapa.getDefaultSlide());
                    p.activeSlide = 0;
                }
            } else {
                if (typeof p.map.url != "undefined" && p.map.url.indexOf('http') != 0 && p.map.url.length > 4) {
                    $eXeMapa.setImgMap(p, $imgmpas);
                }
                hasYB = $eXeMapa.setMedias(p.map.pts, $images, $texts, $audios, $imgmpas, $audiosIdentifyLink, $imagesSlides, hasYB, evaluation, $tooltips);
            }
        }
        return hasYB;
    },
    getDefaultSlide: function () {
        return {
            id: 's' + $eXeMapa.getID(),
            title: '',
            url: '',
            author: '',
            alt: '',
            footer: ''
        };
    },
    getID: function () {
        return Math.floor(Math.random() * Date.now());
    },
    setHasVideo(instance) {
        var mOptions = $eXeMapa.options[instance];
        mOptions.hasYoutube = true;
    },
    setImageSlide: function (s, $images) {
        $images.each(function () {
            var id = $(this).data('id'),
                type = true;
            if (typeof id == "undefined") {
                type = false;
                id = $(this).text();;
            }
            if (typeof s.id != "undefined" && typeof id != "undefined" && s.id == id) {
                s.url = type ? $(this).attr('src') : $(this).attr('href');
                return;
            }
        });
    },
    setImage: function (p, $images) {
        $images.each(function () {
            var id = $(this).data('id'),
                type = true;
            if (typeof id == "undefined") {
                type = false;
                id = $(this).text();;
            }
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.url = type ? $(this).attr('src') : $(this).attr('href');
                return;
            }
        });
    },
    setAudio: function (p, $audios) {
        $audios.each(function () {
            var id = $(this).data('id'),
                type = true;
            if (typeof id == "undefined") {
                type = false;
                id = $(this).text();;
            }
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.audio = type ? $(this).attr('src') : $(this).attr('href');
                return;
            }
        });
    },
    setText: function (p, $texts) {
        $texts.each(function () {
            var id = $(this).data('id');
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.eText = $(this).html();
                return;
            }
        });

    },
    setToolTip: function (p, $tt) {
        $tt.each(function () {
            var id = $(this).data('id');
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.toolTip = $(this).html();
                return;
            }
        });

    },
    setImgMap: function (p, $imgmap) {
        $imgmap.each(function () {
            var id = $(this).data('id'),
                type = true;
            if (typeof id == "undefined") {
                type = false;
                id = $(this).text();
            }
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.map.url = type ? $(this).attr('src') : $(this).attr('href');
                return;
            }
        });
    },
    setAudioIdentefy: function (p, $audios) {
        $audios.each(function () {
            var id = $(this).data('id'),
                type = true;
            if (typeof id == "undefined") {
                type = false;
                id = $(this).text();;
            }
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.question_audio = type ? $(this).attr('src') : $(this).attr('href');

                return;
            }
        });
    },
    getNumberIdentify: function (pts) {
        var m = 0;
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            if (p.type != 5) {
                m++;
            } else {
                m += $eXeMapa.getNumberIdentify(p.map.pts);
            }
        }
        return m;
    },
    rebootGame: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameActived = true;
        mOptions.evaluation = 4;
        mOptions.questionaireStarted = true;
        mOptions.gameOver = false;
        mOptions.activeQuestion = 0;
        mOptions.activeTitle = 0;
        mOptions.obtainedClue = false;
        mOptions.selectsGame = $eXeMapa.shuffleAds(mOptions.selectsGame);
        $('#mapaPNumber-' + instance).text(mOptions.numberQuestions);
        $('#mapaPScore-' + instance).text(0);
        $('#mapaPHits-' + instance).text(0);
        $('#mapaPErrors-' + instance).text(0);
        $('#mapaShowClue-' + instance).hide();
        $('#mapaGameClue-' + instance).hide();
        $eXeMapa.showQuestionaire(instance);
    },
    ramdonOptions: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            l = 0,
            letras = "ABCD";
        if (mOptions.question.typeSelect == 1) {
            return;
        }
        var soluciones = mOptions.question.solution;
        for (var j = 0; j < mOptions.question.options.length; j++) {
            if (mOptions.question.options[j].trim().length > 0) {
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
        respuestasNuevas = mOptions.question.options.slice(0, l);
        respuestasNuevas = $eXeMapa.shuffleAds(respuestasNuevas);
        var solucionesNuevas = "";
        for (var k = 0; k < respuestasNuevas.length; k++) {
            for (var z = 0; z < respuestaCorrectas.length; z++) {
                if (respuestasNuevas[k] == respuestaCorrectas[z]) {
                    solucionesNuevas = solucionesNuevas.concat(letras[k]);
                    break;
                }
            }
        }
        mOptions.question.options = [];
        for (var d = 0; d < 4; d++) {
            if (d < respuestasNuevas.length) {
                mOptions.question.options.push(respuestasNuevas[d]);
            } else {
                mOptions.question.options.push('');
            }
        }
        mOptions.question.solution = solucionesNuevas;
    },
    clearQuestions: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        mOptions.respuesta = "";
        $('#mapaAnswers-' + instance + '> .MQP-AnswersOptions').remove();
        var bordeColors = [$eXeMapa.borderColors.red, $eXeMapa.borderColors.blue, $eXeMapa.borderColors.green, $eXeMapa.borderColors.yellow];
        $('#mapaOptionsDiv-' + instance + '>.MQP-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer'
            }).text('');
        });
    },
    drawQuestions: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            bordeColors = [$eXeMapa.borderColors.red, $eXeMapa.borderColors.blue, $eXeMapa.borderColors.green, $eXeMapa.borderColors.yellow];
        $('#mapaQuestionDiv-' + instance).show();
        $('#mapaWordDiv-' + instance).hide();
        $('#mapaAnswerDiv-' + instance).show();
        $('#mapaOptionsDiv-' + instance + '>.MQP-Options').each(function (index) {
            var option = mOptions.question.options[index];
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer',
                'color': $eXeMapa.colors.black
            }).text(option);
            if (option) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        var html = $('#mapaQuestionDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMapa.updateLatex('mapaFTests-' + instance);
        }
    },
    drawPhrase: function (phrase, definition, nivel, type, casesensitive, instance, solution) {
        $('#mapaEPhrase-' + instance).find('.MQP-Word').remove();
        $('#mapaBtnReply-' + instance).prop('disabled', true);
        $('#mapaBtnMoveOn-' + instance).prop('disabled', true);
        $('#mapaEdAnswer-' + instance).prop('disabled', true);
        $('#mapaQuestionDiv-' + instance).hide();
        $('#mapaWordDiv-' + instance).show();
        $('#mapaAnswerDiv-' + instance).hide();
        if (!casesensitive) {
            phrase = phrase.toUpperCase();
        }
        var cPhrase = $eXeMapa.clear(phrase),
            letterShow = $eXeMapa.getShowLetter(cPhrase, nivel),
            h = cPhrase.replace(/\s/g, '&'),
            nPhrase = [];
        for (var z = 0; z < h.length; z++) {
            if (h[z] != '&' && letterShow.indexOf(z) == -1) {
                nPhrase.push(' ');
            } else {
                nPhrase.push(h[z]);
            }
        }
        nPhrase = nPhrase.join('');
        var phrase_array = nPhrase.split('&');
        for (var i = 0; i < phrase_array.length; i++) {
            var cleanWord = phrase_array[i];
            if (cleanWord != '') {
                $('<div class="MQP-Word"></div>').appendTo('#mapaEPhrase-' + instance);
                for (var j = 0; j < cleanWord.length; j++) {
                    var letter = '<div class="MQP-Letter blue">' + cleanWord[j] + '</div>';
                    if (type == 1) {
                        letter = '<div class="MQP-Letter red">' + cleanWord[j] + '</div>';
                    } else if (type == 2) {
                        letter = '<div class="MQP-Letter green">' + cleanWord[j] + '</div>';
                    }
                    $('#mapaEPhrase-' + instance).find('.MQP-Word').last().append(letter);
                }
            }
        }
        if (!solution) {
            $('#mapaDefinition-' + instance).text(definition);
        }

        var html = $('#mapaWordDiv-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMapa.updateLatex('mapaWordDiv-' + instance)
        }
        return cPhrase;
    },
    drawSolution: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            solution = mQuextion.solution,
            letters = 'ABCD';
        mOptions.gameActived = false;
        $('#mapaOptionsDiv-' + instance).find('.MQP-Options').each(function (i) {
            var css = {};
            if (mQuextion.typeSelect === 1) {
                css = {
                    'border-color': $eXeMapa.borderColors.correct,
                    'background-color': $eXeMapa.colors.correct,
                    'border-size': '1',
                    'cursor': 'pointer',
                    'color': $eXeMapa.borderColors.black
                };
                var text = '';
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
                    'border-color': $eXeMapa.borderColors.incorrect,
                    'border-size': '1',
                    'background-color': 'transparent',
                    'cursor': 'pointer',
                    'color': $eXeMapa.borderColors.grey
                };
                if (solution.indexOf(letters[i]) !== -1) {
                    css = {
                        'border-color': $eXeMapa.borderColors.correct,
                        'background-color': $eXeMapa.colors.correct,
                        'border-size': '1',
                        'cursor': 'pointer',
                        'color': $eXeMapa.borderColors.black
                    };
                }
            }
            $(this).css(css);
        });
    },
    showQuestion: function (i, instance) {
        var mOptions = $eXeMapa.options[instance],
            mQuextion = mOptions.selectsGame[i];
        $eXeMapa.clearQuestions(instance);
        mOptions.gameActived = true;
        mOptions.question = mQuextion;
        mOptions.respuesta = '';
        $('#mapaQuestion-' + instance).text(mQuextion.quextion);
        $eXeMapa.ramdonOptions(instance);
        if (mQuextion.typeSelect == 0) {
            $eXeMapa.drawQuestions(instance);
            $eXeMapa.showMessage(0, mOptions.msgs.msgSelectAnswers, instance);
        } else if (mQuextion.typeSelect == 1) {
            $eXeMapa.showMessage(0, mOptions.msgs.msgCheksOptions, instance);
            $eXeMapa.drawQuestions(instance);
        } else {
            $eXeMapa.showMessage(0, mOptions.msgs.msgWriteAnswer, instance);
            $eXeMapa.drawPhrase(mQuextion.solutionQuestion, mQuextion.quextion, mQuextion.percentageShow, 0, false, instance, false);
            $('#mapaBtnReply-' + instance).prop('disabled', false);
            $('#mapaEdAnswer-' + instance).prop('disabled', false);
            $('#mapaEdAnswer-' + instance).focus();
            $('#mapaEdAnswer-' + instance).val('');
        }
        if (mOptions.evaluation == 4 && mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeMapa.initialScore === '') {
                var score = (mOptions.hits * 10 / mOptions.numberQuestions).toFixed(2);
                $eXeMapa.sendScore(true, instance);
                $('#mapaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
    },
    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },
    sendScore: function (auto, instance) {
        var mOptions = $eXeMapa.options[instance],
            numq = mOptions.numberQuestions,
            message = '',
            score = 0;
        if (mOptions.evaluation == 0) {
            score = $eXeMapa.getScoreVisited(instance);
        } else if (mOptions.evaluation > 0) {
            score = ((mOptions.hits * 10) / numq).toFixed(2);
        }
        if (mOptions.evaluation == 4 && !mOptions.questionaireStarted) return;
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof $eXeMapa.mScorm != 'undefined') {
                if (!auto) {
                    $('#mapaSendScore-' + instance).show();
                    if (!mOptions.repeatActivity && $eXeMapa.previousScore !== '') {
                        message = $eXeMapa.userName !== '' ? $eXeMapa.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeMapa.previousScore = score;
                        $eXeMapa.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeMapa.userName !== '' ? $eXeMapa.userName + '. ' + mOptions.msgs.msgYouScore + ': ' + score : mOptions.msgs.msgYouScore + ': ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#mapaSendScore-' + instance).hide();
                        }
                        $('#mapaRepeatActivity-' + instance).text(message);
                        $('#mapaRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeMapa.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeMapa.mScorm.set("cmi.core.score.raw", score);
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
    playSound: function (selectedFile, instance) {
        $eXeMapa.stopSound(instance);
        var mOptions = $eXeMapa.options[instance];
        selectedFile = $eXeMapa.extractURLGD(selectedFile);
        mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
        mOptions.playerAudio.addEventListener("canplaythrough", function () {
            mOptions.playerAudio.play();
        });
    },
    stopSound: function (instance) {
        var mOptions = $eXeMapa.options[instance];
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
    createInterfaceMapa: function (instance) {
        var html = '',
            path = $eXeMapa.idevicePath,
            msgs = $eXeMapa.options[instance].msgs;
        html += '<div class="MQP-MainContainer" id="mapaMainContainer-' + instance + '">\
        <div class="MQP-GameMinimize" id="mapaGameMinimize-' + instance + '">\
            <a href="#" class="MQP-LinkMaximize" id="mapaLinkMaximize-' + instance + '" title="' + msgs.msgGoActivity + '"><img src="' + path + 'mapaIcon.svg" class="MQP-IconMinimize MQP-Activo"  alt="' + msgs.msgGoActivity + '">\
            <div class="MQP-MessageMaximize" id="mapaMessageMaximize-' + instance + '"></div>\
        </a>\
        </div>\
        <div class="MQP-GameContainer" id="mapaGameContainer-' + instance + '">\
            ' + this.getToolBar(instance) + '\
            <div class="MQP-ShowClue MQP-Parpadea" id="mapaGameClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="MQP-PShowClue" id="mapaPGameClue-' + instance + '"></p>\
            </div>\
            <div class="MQP-MessageFindDiv" id="mapaMessageFind-' + instance + '">\
                <a href="#" class="MQP-MessageFind" id="mapaStartGame-' + instance + '">' + msgs.msgPlayStart + '</a>\
                <span class="MQP-MessageFind" id="mapaMessageFindP-' + instance + '"></span>\
                <a href="#" id="mapaPlayAudioIdenty-' + instance + '" title="' + msgs.msgAudio + '">\
                    <span class="sr-av">' + msgs.msgAudio + ':</span>\
                    <div class="MQP-IconPlayIdentify  MQP-Activo" id="-' + instance + '"></div>\
                </a>\
            </div>\
            <div class="MQP-Multimedia" id="mapaMultimedia-' + instance + '">\
                <img src="" id="mapaImage-' + instance + '" class="MQP-ImageMain" alt="" />\
                <a href="#" class="MQP-LinkCloseDetail" id="mapaLinkCloseDetail-' + instance + '" title="' + msgs.msgReturn + '">\
                    <strong class="sr-av">' + msgs.msgReturn + ':</strong>\
                    <div class="MQP-IconsToolBar exeQuextIcons-CReturn MQP-Activo"></div>\
                </a>\
                <a href="#" class="MQP-LinkCloseHome" id="mapaLinkCloseHome-' + instance + '" title="' + msgs.msgHome + '">\
                    <strong class="sr-av">' + msgs.msgHome + ':</strong>\
                    <div class="MQP-IconsToolBar exeQuextIcons-CHome MQP-Activo"></div>\
                </a>\
                ' + this.getDetailSound(instance) + '\
                ' + this.getToolTip(instance) + '\
                ' + this.getDetailMedia(instance) + '\
                ' + this.getModalMessage(instance) + '\
            </div>\
            ' + this.getDetailTest(instance) + '\
            <div class="MQP-AuthorLicence" id="mapaAutorLicence-' + instance + '"></div>\
            <div class="MQP-Cubierta" id="mapaCubierta-' + instance + '">\
            ' + this.getTestGame(instance) + '\
            </div>\
        </div>\
    ' + this.addButtonScore(instance) + '\
    </div>\
    ';
        return html;
    },
    getToolTip: function (instance) {
        var html = '',
            msgs = $eXeMapa.options[instance].msgs;
        html = '<div class="MQP-ToolTip" id="mapaToolTip-' + instance + '">\
                        <div class="MQP-ToolTipTitle" id="mapaToolTipTitle-' + instance + '"></div>\
                        <a href="#" class="MQP-ToolTipClose" id="mapaToolTipClose-' + instance + '" title="' + msgs.msgClose + '">\
                            <strong class="sr-av">' + msgs.msgClose + ':</strong>\
                            <div class="MQP-IconsToolBar exeQuextIcons-CWGame MQP-Activo"></div>\
                        </a>\
                        <div class="MQP-ToolTipText" id="mapaToolTipText-' + instance + '"></div>\
                    </div>'
        return html;
    },
    getToolBar: function (instance) {
        var html = '',
            msgs = $eXeMapa.options[instance].msgs;
        html = '<div class="MQP-ToolBar" id="mapaToolBar-' + instance + '">\
            <div class="MQP-ToolBarR" id="mapaToolBarL-' + instance + '">\
                <div class="MQP-IconsToolBar  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="mapaPNumberF-' + instance + '">0</span></p>\
                <div class="MQP-IconsToolBar exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="mapaPHitsF-' + instance + '">0</span></p>\
                <div id="mapaIconErrorA-' + instance + '" class="MQP-IconsToolBar  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                <p id="mapaIconErrorB-' + instance + '"><span class="sr-av">' + msgs.msgErrors + ': </span><span id="mapaPErrorsF-' + instance + '">0</span></p>\
                <div class="MQP-IconsToolBar  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="mapaPScoreF-' + instance + '">0</span></p>\
            </div>\
            <span class= "MQP-MesageToolBar" id="mapaMessageToolBar-' + instance + '"></span>\
            <div class="MQP-ToolBarL">\
                    <a href="#" class="MQP-LinkTest" id="mapaLinkTest-' + instance + '" title="' + msgs.msgShowTest + '">\
                        <strong><span class="sr-av">' + msgs.msgShowTest + ':</span></strong>\
                        <div class="MQP-IconsToolBar exeQuextIcons-TXGame  MQP-Activo"></div>\
                    </a>\
                    <a href="#" class="MQP-LinkAreas" id="mapaLinkAreas-' + instance + '" title="' + msgs.msgShowAreas + '">\
                        <strong><span class="sr-av">' + msgs.msgShowAreas + ':</span></strong>\
                        <div class="MQP-IconsToolBar exeQuextIcons-Areas  MQP-Activo"></div>\
                    </a>\
                    <a href="#" class="MQP-LinkMinimize" id="mapaLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="MQP-IconsToolBar exeQuextIcons-MZGame  MQP-Activo"></div>\
                    </a>\
                    <a href="#" class="MQP-LinkFullScreen" id="mapaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                        <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                        <div class="MQP-IconsToolBar exeQuextIcons-FSGame  MQP-Activo" id="mapaFullScreen-' + instance + '"></div>\
                    </a>\
            </div>\
        </div>'
        return html;
    },
    getModalMessage: function (instance) {
        var html = '',
            msgs = $eXeMapa.options[instance].msgs;
        html = '<div id="mapaFMessages-' + instance + '" class="MQP-MessageModal">\
                    <div  class="MQP-FMessageInfo" id="mapaFMessageInfo-' + instance + '">\
                        <div class="MQP-MessageGOScore">\
                            <div class="MQP-MessageGOContent">\
                                <div class="MQP-MessageModalIcono"></div>\
                                <div class="MQP-MessageMoScoreData">\
                                    <p id="mapaMessageInfoText-' + instance + '"></p>\
                                </div>\
                            </div>\
                            <a href="#" class="MQP-ToolTipClose" id="mapaFMessageInfoAccept-' + instance + '" title="' + msgs.msgClose + '">\
                                <strong class="sr-av">' + msgs.msgClose + ':</strong>\
                                <div class="MQP-IconsToolBar exeQuextIcons-CWGame MQP-Activo"></div>\
                            </a>\
                        </div>\
                    </div>\
                    <div id="mapaFMessageOver-' + instance + '" class="MQP-MessageGOScore MQP-FOver" >\
                        <div class="MQP-MessageGOContent">\
                            <div class="MQP-MessageModalIcono"></div>\
                            <div class="MQP-MessageGOScoreData">\
                                <div class="MQP-Flex">\
                                    <span class="sr-av">' + msgs.msgScore + ': </span>\
                                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                                    <span id="mapaGoScore-' + instance + '"></span>\
                                </div>\
                                <div class="MQP-Flex">\
                                <span class="sr-av">' + msgs.msgNumQuestions + ': </span>\
                                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                                    <span id="mapaGONumber-' + instance + '"></span>\
                                </div>\
                                <div class="MQP-Flex">\
                                    <div class="exeQuextIcons  exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                                    <span class="sr-av">' + msgs.msgHits + ': </span>\
                                    <span id="mapaGOHits-' + instance + '"></span>\
                                </div>\
                                <div class="MQP-Flex" id="mapaErrorScore-' + instance + '">\
                                    <span class="sr-av">' + msgs.msgErrors + ': </span>\
                                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                                    <span id="mapaGOErrors-' + instance + '"></span>\
                                </div>\
                            </div>\
                        </div>\
                        <p id="mapaGOMessage-' + instance + '"></p>\
                        <div class="MQP-GOScoreButtons">\
                            <a href="#"  id="mapaMessageGOYes-' + instance + '" title="' + msgs.msgYes + '">' + msgs.msgYes + '</a>\
                            <a href="#"  id="mapaMessageGONo-' + instance + '" title="' + msgs.msgNo + '">' + msgs.msgNo + '</a>\
                        </div>\
                    </div>\
                    <div id="mapaFMessageAccess-' + instance + '" class="MQP-MessageGOScore">\
                        <div class="MQP-MessageGOContent">\
                            <div class="MQP-MessageModalIcono"></div>\
                            <div class="MQP-MessageMoScoreData">\
                                <p id="mapaAccessMessage-' + instance + '"></p>\
                            <div class="MQP-DataCodeAccessE">\
                                    <input type="text" class="MQP-CodeAccessE" id="mapaCodeAccessE-' + instance + '">\
                                    <a href="#" id="mapaCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                                        <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                                        <div class="exeQuextIcons-Submit MQP-Activo"></div>\
                                    </a>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>'
        return html;
    },
    getTestGame: function (instance) {
        var html = '',
            msgs = $eXeMapa.options[instance].msgs;
        html = ' <div class="MQP-TestContainer" id="mapaFTests-' + instance + '">\
            <div class="MQP-GameScoreBoard">\
                <div class="MQP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="mapaPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="mapaPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="mapaPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="mapaPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="MQP-Close">\
                    <a href="#" class="MQP-LinkClose" id="mapaLinkClose-' + instance + '" title="' + msgs.msgClose + '">\
                        <strong class="sr-av">' + msgs.msgClose + ':</strong>\
                        <div class="MQP-IconsToolBar exeQuextIcons-CWGame   MQP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="MQP-ShowClue MQP-Parpadea" id="mapaShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + ':</div>\
                <p class="MQP-PShowClue" id="mapaPShowClue-' + instance + '"></p>\
            </div>\
            <div class="MQP-Message" id="mapaMessage-' + instance + '"></div>\
            <div class="MQP-QuestionDiv" id="mapaQuestionDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="MQP-Question" id="mapaQuestion-' + instance + '"></div>\
                <div class="MQP-OptionsDiv" id="mapaOptionsDiv-' + instance + '">\
                    <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                    <a href="#" class="MQP-Option1 MQP-Options" id="mapaOption1-' + instance + '"  data-number="0"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                    <a href="#" class="MQP-Option2 MQP-Options" id="mapaOption2-' + instance + '"  data-number="1"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                    <a href="#" class="MQP-Option3 MQP-Options" id="mapaOption3-' + instance + '"  data-number="2"></a>\
                    <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                    <a href="#" class="MQP-Option4 MQP-Options" id="mapaOption4-' + instance + '"    data-number="3"></a>\
                </div>\
            </div>\
            <div class="MQP-WordsDiv" id="mapaWordDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgAnswer + ':</div>\
                <div class="MQP-Prhase" id="mapaEPhrase-' + instance + '"></div>\
                <div class="sr-av">' + msgs.msgQuestion + ':</div>\
                <div class="MQP-Definition" id="mapaDefinition-' + instance + '"></div>\
                <div class="MQP-DivReply" id="mapaDivResponder-' + instance + '">\
                    <input type="text" value="" class="MQP-EdReply" id="mapaEdAnswer-' + instance + '"  autocomplete="off">\
                    <a href="#" id="mapaBtnReply-' + instance + '" title="' + msgs.msgAnswer + '">\
                        <strong class="sr-av">' + msgs.msgAnswer + '</strong>\
                        <div class="exeQuextIcons-Submit MQP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
            <div class="MQP-BottonContainerDiv" id="mapaBottonContainer-' + instance + '">\
                <div class="MQP-AnswersDiv" id="mapaAnswerDiv-' + instance + '">\
                    <div class="MQP-Answers" id="mapaAnswers-' + instance + '"></div>\
                    <a href="#" id="mapaButtonAnswer-' + instance + '" title="' + msgs.msgAnswer + '">\
                        <strong class="sr-av">' + msgs.msgAnswer + '</strong>\
                        <div class="exeQuextIcons-Submit MQP-Activo"></div>\
                    </a>\
                </div>\
            </div>\
        </div>';
        return html;
    },
    getDetailMedia: function (instance) {
        var html = '',
            path = $eXeMapa.idevicePath,
            msgs = $eXeMapa.options[instance].msgs;
        html = '<div class="MQP-Detail" id="mapaFDetails-' + instance + '">\
                    <p class= "MQP-MessageDetail" id="mapaMessageDetail-' + instance + '"></p>\
                    <div class="MQP-Flex">\
                        <div class="MQP-TitlePoint" id="mapaTitlePoint-' + instance + '"></div>\
                    </div>\
                    <div class="MQP-MultimediaPoint" id="mapaMultimediaPoint-' + instance + '">\
                        <img src="" class="MQP-Images" id="mapaImagePoint-' + instance + '"  alt="' + msgs.msgNoImage + '" />\
                        <img src="' + path + 'mapaHome.png" class="MQP-Cover" id="mapaCoverPoint-' + instance + '" alt="' + msgs.msgNoImage + '" />\
                        <div class="MQP-Video" id="mapaVideoPoint-' + instance + '"></div>\
                        <video controls class="MQP-VideoLocal" id="mapaVideoLocal-' + instance + '"></video>\
                        <a href="#" class="MQP-LinkAudio MQP-Activo" id="mapaLinkAudio-' + instance + '"   title="' + msgs.msgAudio + '"></a>\
                        <a href="#" class="MQP-LinkSlideLeft MQP-Activo" id="mapaLinkSlideLeft-' + instance + '"   title="' + msgs.msgAudio + '"></a>\
                        <a href="#" class="MQP-LinkSlideRight MQP-Activo" id="mapaLinkSlideRight-' + instance + '"   title="' + msgs.msgAudio + '"></a>\
                    </div>\
                    <div class="MQP-EText" id="mapaTextPoint-' + instance + '"></div>\
                    <div class="MQP-AuthorPoint" id="mapaAuthorPoint-' + instance + '"></div>\
                    <div class="MQP-Footer" id="mapaFooterPoint-' + instance + '"></div>\
                    <a href="#" class="MQP-LinkDetailClose" id="mapaLinkClose1-' + instance + '" title="' + msgs.msgClose + '">\
                        <strong class="sr-av">' + msgs.msgClose + ':</strong>\
                        <div class="MQP-IconsToolBar exeQuextIcons-CWGame MQP-Activo"></div>\
                    </a>\
                </div>';
        return html;
    },
    getDetailSound: function (instance) {
        var html = '',
            path = $eXeMapa.idevicePath,
            msgs = $eXeMapa.options[instance].msgs;
        html = '<div class="MQP-DetailsSound" id="mapaFDetailsSound-' + instance + '">\
                    <p class= "MQP-MessageDetail" id="mapaMessageDetailSound-' + instance + '"></p>\
                    <div class="MQP-ToolTipTitle" id="mapaTitlePointSound-' + instance + '"></div>\
                    <a href="#" class="MQP-ToolTipClose" id="mapaLinkCloseSound-' + instance + '" title="' + msgs.msgClose + '">\
                        <strong class="sr-av">' + msgs.msgClose + ':</strong>\
                        <div class="MQP-IconsToolBar exeQuextIcons-CWGame MQP-Activo"></div>\
                    </a>\
                    <div class="MQP-MultimediaPointSound" >\
                      <a href="#" class="MQP-LinkSound MQP-Activo" id="mapaLinkAudio1-' + instance + '"   title="' + msgs.msgAudio + '">\
                           <img src="' + path + 'mapam2.svg" class="MQP-Images" alt="' + msgs.msgAudio + '" />\
                      </a>\
                    </div>\
                    <div class="MQP-FooterSound" id="mapaFooterPointSound-' + instance + '"></div>\
                </div>';
        return html;
    },
    getDetailTest: function (instance) {
        var html = '',
            path = $eXeMapa.idevicePath,
            msgs = $eXeMapa.options[instance].msgs;
        html = '<div class="MQP-Test" id="mapaTest-' + instance + '">\
            <div class="MQP-MessageFindDiv" id="mapaMessageRect-' + instance + '">\
                <a href="#" id="mapaPlayAudioRect-' + instance + '" title="' + msgs.msgAudio + '">\
                    <span class="sr-av">' + msgs.msgAudio + ':</span>\
                    <div class="MQP-IconPlayIdentify  MQP-Activo" id="-' + instance + '"></div>\
                </a>\
                <span class="MQP-MessageFind" id="mapaMessageRectP-' + instance + '"></span>\
            </div>\
            <div class="MQP-ContentRect" id="mapaContainerRect-' + instance + '">\
                <img src="' + path + 'mapaHome.png" id="mapaImageRect-' + instance + '" class="MQP-ImageRect" alt="" />\
                <div class="MPQ-CursorRect"></div>\
            </div>\
            <div class="MPQ-OptionsTest" id="mapaOptionsTest-' + instance + '"></div>\
            <a href="#" class="MQP-LinkCloseOptions" id="mapaLinkCloseOptions-' + instance + '" title="' + msgs.msgClose + '">\
                <strong class="sr-av">' + msgs.msgClose + ':</strong>\
                <div class="MQP-IconsToolBar exeQuextIcons-CWGame MQP-Activo"></div>\
            </a>\
        </div>'
        return html;
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        var butonScore = "";
        var fB = '<div class="MQP-BottonContainer" id="mapaBottonConatiner-' + instance + '">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="MQP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="mapaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="MQP-RepeatActivity" id="mapaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="MQP-GetScore">';
                fB += '<p><span class="MQP-RepeatActivity" id="mapaRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        return butonScore;
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
        element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $eXeMapa.getFullscreen(element);
        } else {
            $eXeMapa.exitFullscreen(element);
        }
    },
    showImagePoint: function (url, author, alt, instance) {
        var $noImage = $('#mapaCoverPoint-' + instance),
            $Image = $('#mapaImagePoint-' + instance),
            $Author = $('#mapaAuthorPoint-' + instance);
        if ($.trim(url).length == 0) {
            $Image.hide();
            $noImage.show();
            return false;
        }
        $Author.html(author);
        $Image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $Image.hide();
                    $Image.attr('alt', $eXeMapa.options[instance].msgs.msgNoImage);
                    $noImage.show();
                    return false;
                } else {
                    var mData = $eXeMapa.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $eXeMapa.placeImageWindows(this, this.naturalWidth, this.naturalHeight, instance);
                    $eXeMapa.drawImage(this, mData);
                    //$('#mapaMultimediaPoint-' + instance).height(mData.h);
                    $Image.show();
                    $noImage.hide();
                    $Image.attr('alt', alt);
                    return true;
                }
            }).on('error', function () {
                $Image.hide();
                $Image.attr('alt', $eXeMapa.options[instance].msgs.msgNoImage);
                $noImage.show();
                return false;
            });
    },
    getNumberPoints: function (pts) {
        var number = 0;
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            p.state = -1;
            number++;
            if (p.type == 5 && p.map.pts.length != 0) {
                var rnumber = $eXeMapa.getNumberPoints(p.map.pts);
                number += rnumber;
            }
        }
        return number;
    },
    resetPoints: function (pts) {
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            p.state = -1;
            if (p.type == 5 && p.map.pts.length != 0) {
                $eXeMapa.resetPoints(p.map.pts);
            }
        }
    },
    startFinds: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $eXeMapa.resetPoints(mOptions.activeMap.pts);
        $eXeMapa.paintPoints(instance);
        mOptions.titles = $eXeMapa.shuffleAds(mOptions.titles);
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameOver = false;
        mOptions.activeTitle = 0;
        mOptions.obtainedClue = false;
        mOptions.gameActived = false;
        mOptions.gameOver = false;
        mOptions.activeQuestion = 0;
        mOptions.titleRect = "";
        $('#mapaPScoreF-' + instance).text(0);
        $('#mapaPHitsF-' + instance).text(0);
        $('#mapaPErrorsF-' + instance).text(0);
        $('#mapaPScoreF-' + instance).text(0);
        $('#mapaPNumberF-' + instance).text(mOptions.numberQuestions);
        $('#mapaGameClue-' + instance).hide();
    },
    showFind: function (instance, num) {
        var mOptions = $eXeMapa.options[instance],
            msg = mOptions.evaluation == 2 ? mOptions.msgs.msgIdentify : mOptions.msgs.msgSearch;
        mOptions.title = mOptions.titles[num];
        var mt = mOptions.msgs.msgClickOn + ' ' + mOptions.title.title;
        if (typeof mOptions.titles[num].question != 'undefined' && mOptions.titles[num].question.length > 0) {
            mt = mOptions.msgs.msgClickOn + ' "' + mOptions.titles[num].question + '"';
        }
        $('#mapaGameContainer-' + instance).find('a.MQP-Area').attr('title', mt);
        $('#mapaGameContainer-' + instance).find('a.MQP-Point').attr('title', mt);
        var mq = msg + ': ' + mOptions.title.title;
        if (typeof mOptions.titles[num].question != 'undefined' && mOptions.titles[num].question.length > 0) {
            mq = mOptions.titles[num].question;
        }
        $('#mapaMessageFindP-' + instance).text(mq);
        $('#mapaPlayAudioIdenty-' + instance).hide();
        $eXeMapa.stopSound(instance);
        if (typeof mOptions.title.audio != "undefined" && mOptions.title.audio.length > 4) {
            $eXeMapa.playSound(mOptions.title.audio, instance);
            $('#mapaPlayAudioIdenty-' + instance).show();
        }
        mOptions.showDetail = false;
        var html = $('#mapaMainContainer-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMapa.updateLatex('mapaMainContainer-' + instance)
        }
    },
    initElements: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $eXeMapa.hideModalWindows(instance);
        $('#mapaGameMinimize-' + instance).hide();
        $('#mapaGameContainer-' + instance).hide();
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFDetailsSound-' + instance).hide();
        $('#mapaFTests-' + instance).hide();
        $('#mapaToolBarL-' + instance).hide();
        $('#mapaMessageMaximize-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#mapaVideoPoint-' + instance).hide();
        $('#mapaVideoLocal-' + instance).hide();
        $('#mapaGamerOver-' + instance).hide();
        $('#mapaLinkTest-' + instance).hide();
        $('#mapaFMessages-' + instance).hide();
        $('#mapaFMessageAccess-' + instance).hide();
        $('#mapaFMessageOver-' + instance).hide();
        $('#mapaFMessageInfo-' + instance).hide();
        $('#mapaInstructions-' + instance).text(mOptions.instructions);
        $('#mapaShowClue-' + instance).hide();
        $('#mapaGameClue-' + instance).hide();
        $('#mapaPlayAudioIdenty-' + instance).hide();
        $('#mapaPlayAudioRect-' + instance).hide();
        $('#mapaStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $('#mapaMessageFindP-' + instance).hide();
        $('#mapaStartGame-' + instance).hide();
        $('#mapaCubierta-' + instance).hide()
        if (mOptions.evaluation == 1 || mOptions.evaluation == 2 || mOptions.evaluation == 3) {
            $('#mapaStartGame-' + instance).show();
        }
        if (mOptions.showMinimize) {
            $('#mapaGameMinimize-' + instance).css({
                'cursor': 'pointer'
            }).show();
        } else {
            $('#mapaGameContainer-' + instance).show();
        }
        if (mOptions.evaluation == 1) {
            $('#mapaToolBarL-' + instance).show();
        } else if (mOptions.evaluation == 2) {
            $('#mapaToolBarL-' + instance).show();
        } else if (mOptions.evaluation == 3) {
            $('#mapaIconErrorA-' + instance).hide();
            $('#mapaIconErrorB-' + instance).hide();
            $('#mapaToolBarL-' + instance).show();
        } else if (mOptions.evaluation == 4) {
            $('#mapaLinkTest-' + instance).show();
        }
        if (mOptions.itinerary.showCodeAccess) {
            $('#mapaAccessMessage-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#mapaFMessageAccess-' + instance).show();
            $('#mapaCubierta' + instance).show();
            mOptions.showData = true;
            setTimeout(function () {
                $eXeMapa.placePointInWindow($('#mapaFMessages-' + instance), -1, instance)
            }, 500)
        }
        if (!mOptions.hasAreas || !mOptions.showActiveAreas || mOptions.evaluation == 1) {
            $('#mapaLinkAreas-' + instance).hide();
        }
        $('#mapaAutorLicence-' + instance).html(mOptions.authorImage);
        $('#mapaWordDiv-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeMapa.updateScorm($eXeMapa.previousScore, mOptions.repeatActivity, instance);
        }
    },
    addEvents: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $eXeMapa.refreshImageActive(instance);
        $('#mapaLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#mapaGameContainer-" + instance).show();
            $("#mapaGameMinimize-" + instance).hide();
            $eXeMapa.refreshImageActive(instance);
        });
        $("#mapaLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            if (mOptions.showData) return;
            $("#mapaGameContainer-" + instance).hide();
            $("#mapaGameMinimize-" + instance).css('visibility', 'visible').show();
            $("#mapaMainContainer-" + instance).css('height', 'auto').show();
        });
        document.onfullscreenchange = function (event) {
            var id = event.target.id.split('-')[1];
            $eXeMapa.refreshImageActive(id);
        };
        $("#mapaLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            if (mOptions.showData) return;
            var element = document.getElementById('mapaGameContainer-' + instance);
            $eXeMapa.toggleFullscreen(element, instance);
        });
        $('#mapaCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeMapa.enterCodeAccess(instance);
        });
        $('#mapaCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeMapa.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $(window).on('unload', function () {
            if (typeof ($eXeMapa.mScorm) != "undefined") {
                $eXeMapa.endScorm();
            }
        });
        window.addEventListener('resize', function () {
            $eXeMapa.refreshImageActive(instance);
        });
        $('#mapaMultimedia-' + instance).on('mouseenter', '.MQP-Point', function (e) {
            e.preventDefault();
            if (mOptions.showData || !mOptions.gameStarted) {
                return;
            }
            var n = $(this).data('number'),
                id = $(this).data('id');
            if (mOptions.evaluation != 1 && mOptions.evaluation != 2 && mOptions.evaluation != 3 && typeof mOptions.activeMap.pts[n].audio != "undefined" && mOptions.activeMap.pts[n].audio.length > 4) {
                $eXeMapa.playSound(mOptions.activeMap.pts[n].audio, instance);
                if (mOptions.activeMap.pts[n].type == 3) {
                    mOptions.visiteds.push(id);
                }
            }
            if (mOptions.autoShow && (mOptions.evaluation == 0 || mOptions.evaluation == 4)) {
                mOptions.showData = true;
                $eXeMapa.showPoint(n, instance);
            }

        });
        $('#mapaLinkAudio-' + instance).on('click', function (e) {
            e.preventDefault();
            if (typeof mOptions.activeMap.pts[mOptions.activeMap.active].audio != "undefined" && mOptions.activeMap.pts[mOptions.activeMap.active].audio.length > 4) {
                $eXeMapa.playSound(mOptions.activeMap.pts[mOptions.activeMap.active].audio, instance);
            }
        });
        $('#mapaLinkAudio1-' + instance).on('click', function (e) {
            e.preventDefault();
            if (typeof mOptions.activeMap.pts[mOptions.activeMap.active].audio != "undefined" && mOptions.activeMap.pts[mOptions.activeMap.active].audio.length > 4) {
                $eXeMapa.playSound(mOptions.activeMap.pts[mOptions.activeMap.active].audio, instance);
            }
        });
        $('#mapaPlayAudioIdenty-' + instance).on('click', function (e) {
            e.preventDefault();
            if (typeof mOptions.title.audio != "undefined" && mOptions.title.audio.length > 4) {
                $eXeMapa.playSound(mOptions.title.audio, instance);
            }
        });
        $('#mapaPlayAudioRect-' + instance).on('click', function (e) {
            e.preventDefault();
            if (typeof mOptions.activeMap.pts[mOptions.activeMap.activeMap.active] != "undefined" && typeof mOptions.activeMap.pts[mOptions.activeMap.active].question_audio != "undefined" && mOptions.activeMap.pts[mOptions.activeMap.active].question_audio.length > 4) {
                $eXeMapa.playSound(mOptions.activeMap.pts[mOptions.activeMap.active].question_audio, instance);
            }
        });
        $('#mapaMultimedia-' + instance).on('mouseenter', '.MQP-Area', function (e) {
            e.preventDefault();
            if (mOptions.showData || !mOptions.gameStarted) {
                return;
            }
            var n = $(this).data('number'),
                id = $(this).data('id');
            if (mOptions.evaluation != 1 && mOptions.evaluation != 2 && mOptions.evaluation != 3 && typeof mOptions.activeMap.pts[n].audio != "undefined" && mOptions.activeMap.pts[n].audio.length > 4) {
                $eXeMapa.playSound(mOptions.activeMap.pts[n].audio, instance);
                if (mOptions.activeMap.pts[n].type == 3) {
                    mOptions.visiteds.push(id);
                }
            }
            if (mOptions.autoShow && (mOptions.evaluation == 0 || mOptions.evaluation == 4)) {
                mOptions.showData = true;
                $eXeMapa.showPoint(n, instance);
            }
        });
        $('#mapaLinkAreas-' + instance).on('mouseenter click', function (e) {
            e.preventDefault();
            $('#mapaMultimedia-' + instance).find('.MQP-Area').css({
                'background-color': 'rgba(59, 123, 84, 0.4)'
            });
        });
        $('#mapaLinkAreas-' + instance).on('mouseleave', function (e) {
            e.preventDefault();
            $('#mapaMultimedia-' + instance).find('.MQP-Area').css('background-color', 'rgba(59, 123, 84, 0.01)');
        });
        $('#mapaLinkTest-' + instance).on('click', function (e) {
            e.preventDefault();
            if (mOptions.showData) return;
            if (!mOptions.gameOver && mOptions.activeQuestion < mOptions.numberQuestions) {
                $eXeMapa.showQuestionaire(instance);
            } else {
                $eXeMapa.gameOver(instance);
            }
        });
        $('#mapaFMessageInfoAccept-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.closePoint(instance);
        });
        $('#mapaMessageGONo-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.hideCover(instance);
            if (mOptions.evaluation != 0) {
                $eXeMapa.endFind(instance);

            } else {
                mOptions.gameOver = false;
            }
            $('#mapaTest-' + instance).fadeOut(100);
            $('#mapaGameContainer-' + instance).css('height', 'auto');
        });
        $('#mapaMessageGOYes-' + instance).on('click', function (e) {
            e.preventDefault();
            if (mOptions.evaluation == 1 || mOptions.evaluation == 2 || mOptions.evaluation == 3) {
                $eXeMapa.startFinds(instance);
                $eXeMapa.hideCover(instance);
                if (mOptions.evaluation == 2 || mOptions.evaluation == 3) {
                    $eXeMapa.showFind(instance, 0);
                }
            } else if (mOptions.evaluation == 4 || mOptions.evaluation == -4) {
                $eXeMapa.hideCover(instance);
                $eXeMapa.rebootGame(instance);
            }
            mOptions.gameStarted = true;
            $('#mapaTest-' + instance).fadeOut(100);
            $('#mapaGameContainer-' + instance).css('height', 'auto');
        });
        $('#mapaLinkClose-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.stopVideo(instance);
            $eXeMapa.stopSound(instance);
            $eXeMapa.hideCover(instance);

        });
        $('#mapaLinkClose1-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.closePoint(instance);
        });
        $('#mapaLinkCloseSound-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.closePoint(instance);
        });
        $('#mapaLinkCloseOptions-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.closeOptions(instance);
        });
        $('#mapaButtonAnswer-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeMapa.answerQuestion(instance);
        });
        $('#mapaOptionsDiv-' + instance).find('.MQP-Options').on('click', function (e) {
            e.preventDefault();
            $eXeMapa.changeQuextion(instance, this);
        });
        $('#mapaBtnReply-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.answerQuestion(instance);
        });
        $('#mapaEdAnswer-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeMapa.answerQuestion(instance);
                return false;
            }
            return true;
        });
        $('#mapaSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeMapa.sendScore(false, instance);
            return true;
        });
        $('#mapaMultimedia-' + instance).on('click', '.MQP-Point, .MQP-Area ', function (e) {
            e.preventDefault();
            if (mOptions.showData || !mOptions.gameStarted) {
                return;
            }
            mOptions.showData = true;
            var n = $(this).data('number'),
                id = $(this).data('id');
            if (!mOptions.gameOver && (mOptions.evaluation == 1 || mOptions.evaluation == 2 || mOptions.evaluation == 3)) {
                if (mOptions.evaluation == 1) {
                    $eXeMapa.showOptionsRect(instance, n);
                } else if (mOptions.evaluation == 2 || mOptions.evaluation == 3) {
                    if (mOptions.activeMap.pts[n].type == 5 && mOptions.activeMap.pts[n].map.pts.length > 0) {
                        $eXeMapa.showMapDetail(instance, n);
                    } else {
                        $eXeMapa.answerFind(n, id, instance);
                    }
                }
            } else {
                $eXeMapa.showPoint(n, instance);
            }
        });
        $('#mapaToolTip-' + instance).on('mouseleave', function (e) {
            e.preventDefault();
            if (mOptions.autoShow && (mOptions.evaluation == 0 || mOptions.evaluation == 4)) {
                $eXeMapa.closeToolTip(instance)
            }
        });
        $('#mapaFDetails-' + instance).on('mouseleave', function (e) {
            e.preventDefault();
            if (mOptions.autoShow && (mOptions.evaluation == 0 || mOptions.evaluation == 4)) {
                $eXeMapa.closePoint(instance)
            }
        });
        $('#mapaFDetailsSound-' + instance).on('mouseleave', function (e) {
            e.preventDefault();
            if (mOptions.autoShow && (mOptions.evaluation == 0 || mOptions.evaluation == 4)) {
                $eXeMapa.closePoint(instance)
            }
        });
        $('#mapaFMessages-' + instance).on('mouseleave', function (e) {
            e.preventDefault();
            if (mOptions.autoShow && (mOptions.evaluation == 0 || mOptions.evaluation == 4)) {
                $eXeMapa.closePoint(instance)
            }
        });
        $('#mapaTest-' + instance).on('click', '.MPQ-OptionTest', function (e) {
            e.preventDefault();
            var text = $(this).text(),
                num = $(this).data('number');
            if (mOptions.showData) {
                return;
            }
            $eXeMapa.answerRect(instance, text, num);
        });
        $('#mapaLinkCloseDetail-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.hideMapDetail(instance, false);
        });
        $('#mapaLinkCloseHome-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.hideMapDetail(instance, true);
            $('#mapaLinkCloseDetail-' + instance).hide();
            $('#mapaLinkCloseHome-' + instance).hide();
        });
        $('#mapaStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            if ($('#mapaFMessageAccess-' + instance).is(':visible')) {
                return;
            }
            if (mOptions.hasYoutube && (typeof (mOptions.player) == "undefined")) {
                if (typeof (YT) !== "undefined") {
                    $eXeMapa.youTubeReadyOne(instance);
                } else {
                    $eXeMapa.loadYoutubeApi();
                }
            }
            $eXeMapa.startGame(instance);
        });
        $('#mapaLinkSlideLeft-' + instance).on('click', function (e) {
            e.preventDefault();
            mOptions.activeSlide = mOptions.activeSlide > 0 ? mOptions.activeSlide - 1 : 0;
            if (mOptions.activeSlide == 0) {
                $('#mapaLinkSlideLeft-' + instance).hide();
            }
            if (mOptions.activeMap.pts[mOptions.activeMap.active].slides.length > 0) {
                $('#mapaLinkSlideRight-' + instance).show();
            }
            $eXeMapa.showSlide(mOptions.activeSlide, instance);
        });
        $('#mapaLinkSlideRight-' + instance).on('click', function (e) {
            e.preventDefault();
            mOptions.activeSlide++;
            if (mOptions.activeSlide >= mOptions.activeMap.pts[mOptions.activeMap.active].slides.length - 1) {
                mOptions.activeSlide = mOptions.activeMap.pts[mOptions.activeMap.active].slides.length - 1;
                $('#mapaLinkSlideRight-' + instance).hide();
            }
            if (mOptions.activeMap.pts[mOptions.activeMap.active].slides.length > 0) {
                $('#mapaLinkSlideLeft-' + instance).show();
            }
            $eXeMapa.showSlide(mOptions.activeSlide, instance);
        });
        $('#mapaToolTipClose-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMapa.closeToolTip(instance)
        });
        var text = $('#mapaMainContainer-' + instance).parent('.mapa-IDevice').html(),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(text);
        if (hasLatex) {
            $eXeMapa.hasLATEX = true;
        }
    },
    showSlide: function (i, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[mOptions.activeMap.active];
        $eXeMapa.showImagePoint(q.slides[i].url, q.slides[i].author, q.slides[i].alt, instance);
        $('#mapaAuthorPoint-' + instance).html(q.slides[i].author);
        $('#mapaTitlePoint-' + instance).text(q.slides[i].title);
        $('#mapaFooterPoint-' + instance).text(q.slides[i].footer);
        $('#mapaMultimediaPoint-' + instance).show();
        if (q.slides[0].author > 0) {
            $('#mapaAuthorPoint-' + instance).show();
        }
        $('#mapaFooterPoint-' + instance).hide();
        if (q.slides[0].footer.length > 0) {
            $('#mapaFooterPoint-' + instance).show();
        }
        $eXeMapa.placePointInWindow($('#mapaFDetails-' + instance), mOptions.activeMap.active, instance)
    },
    showPointLink: function (num, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[num];
        if (!mOptions.loadingURL) {
            mOptions.loadingURL = true;
            var win = window.open(q.link, '_blank');
            if (win) { //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Permita las ventanas emergentes en este sitio');
            }
            setTimeout(function () {
                mOptions.showData = false;
                mOptions.loadingURL = false;
            }, 1000)
        }
    },
    showToolTip: function (num, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[num],
            $divText = $('#mapaMainContainer-' + instance).parent('.mapa-IDevice').find('.mapa-LinkToolTipPoints[data-id="' + q.id + '"]').eq(0);
        $('#mapaToolTipText-' + instance).empty();
        if ($divText.length == 1) {
            $divText.removeClass('js-hidden');
            $('#mapaToolTipText-' + instance).append($divText);
        }
        var html = $('#mapaToolTipText-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMapa.updateLatex('mapaToolTipText-' + instance);
        }
        $('#mapaToolTipTitle-' + instance).text(q.title);
        $('#mapaToolTipText-' + instance).show();
        $('#mapaFooterPoint-' + instance).hide();
        $('#mapaMultimediaPoint-' + instance).hide();
        $eXeMapa.placePointInWindow($('#mapaToolTip-' + instance), num, instance)
    },
    showPointNone: function (num, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[num];
        if (mOptions.evaluation == 1 || mOptions.evaluation == 2 || mOptions.evaluation == 3) {
            mOptions.activeTitle++;
            if (mOptions.activeTitle > mOptions.numberQuestions) {
                $eXeMapa.gameOver(instance);
            } else if (mOptions.evaluation == 2 || mOptions.evaluation == 3) {
                $eXeMapa.showFind(instance, mOptions.activeTitle);
            }
        } else {
            $eXeMapa.showMessageModal(instance, q.title, 1, 0, num);
        }
        mOptions.visiteds.push(q.id);
        if (mOptions.isScorm == 1 && mOptions.evaluation != 4 && mOptions.evaluation > -1) {
            if (mOptions.repeatActivity || $eXeMapa.initialScore === '') {
                var score = mOptions.evaluation === 0 ? $eXeMapa.getScoreVisited(instance) : $eXeMapa.getScoreFind(instance);
                $eXeMapa.sendScore(true, instance);
                $('#mapaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
        $eXeMapa.messageAllVisited(instance);
    },
    showPointImage: function (num, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[num];
        $eXeMapa.showImagePoint(q.url, q.author, q.alt, instance);
        $('#mapaMultimediaPoint-' + instance).show();
        if (q.author.length > 0) {
            $('#mapaAuthorPoint-' + instance).show();
        }
        $eXeMapa.placePointInWindow($('#mapaFDetails-' + instance), num, instance)
    },
    showPointSound: function (num, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[num];
        $eXeMapa.placePointInWindow($('#mapaFDetailsSound-' + instance), num, instance)
    },
    showPointVideo: function (num, instance) {
        var mOptions = $eXeMapa.options[instance];
        mOptions.waitPlayVideo = true;
        $eXeMapa.playVideo(instance);
        $eXeMapa.placePointInWindow($('#mapaFDetails-' + instance), num, instance)
    },
    showPointText: function (num, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[num],
            $divText = $('#mapaMainContainer-' + instance).parent('.mapa-IDevice').find('.mapa-LinkTextsPoints[data-id="' + q.id + '"]').eq(0);
        $('#mapaTextPoint-' + instance).empty();
        $('#mapaTextPoint-' + instance).show();
        $('#mapaFooterPoint-' + instance).hide();
        $('#mapaMultimediaPoint-' + instance).hide();
        if ($divText.length == 1) {
            $divText.removeClass('js-hidden');
            $('#mapaTextPoint-' + instance).append($divText);
        }
        var html = $('#mapaTextPoint-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMapa.updateLatex('mapaTextPoint-' + instance);
        }
        $eXeMapa.placePointInWindow($('#mapaFDetails-' + instance), num, instance)
    },
    placePointInWindow($window, num, instance) {
        var mOptions = $eXeMapa.options[instance],
            $gamec = $('#mapaGameContainer-' + instance),
            $main = $('#mapaGameContainer-' + instance),
            $multimedia = $('#mapaMultimedia-' + instance),
            isFulls = $eXeMapa.isFullScreen(),
            $tb = $('#mapaToolBar-' + instance),
            htb = $tb.is(':visible') ? $tb.outerHeight(true) : 0,
            $mf = $('#mapaMessageFindP-' + instance),
            hmf = $mf.is(':visible') ? $mf.outerHeight(true) : 0,
            $gc = $('#mapaGameClue-' + instance),
            hgc = $gc.is(':visible') ? $gc.outerHeight(true) : 0,
            mtMulti = parseInt($multimedia.css('marginTop')),
            tMulti = htb + hmf + hgc + mtMulti,
            hMain = $gamec.innerHeight(),
            wMain = $gamec.innerWidth(),
            hWindow = $window.outerHeight(true),
            wWindow = $window.outerWidth(true),
            lWindow = ($multimedia.innerWidth() - wWindow) / 2,
            tWindow = -tMulti + 15;
        if (hWindow >= hMain) {
            hMain = hWindow + 15;
            $gamec.innerHeight(hMain);
            $main.innerHeight($main.outerHeight(true) + 35);
        }
        if (mOptions.gameOver || typeof num == "undefined" || num < 0 || mOptions.evaluation == 1 || $gamec.innerWidth() < 650) {
            if (num < 1) {
                tWindow = -tMulti + 70;
            }
        } else {
            var $button = $multimedia.find("[data-number='" + num + "']").eq(0),
                lMulti = isFulls ? 0 : parseInt($multimedia.css('marginLeft')),
                lWindow = Math.round($button.position().left - (wWindow - $button.innerWidth()) / 2),
                tWindow = Math.round($button.position().top - (hWindow - $button.innerHeight()) / 2),
                tWindow = tWindow < -tMulti ? -tMulti : tWindow;
            //arriba
            tWindow = tWindow < -tMulti ? -tMulti : tWindow;
            //abajo:
            if ((tMulti + tWindow + hWindow) > hMain) {
                hsobra = (tMulti + tWindow + hWindow) - hMain
                tWindow = tWindow - hsobra - 15;
            }
            //izquierda:
            lWindow = lWindow < -lMulti ? -lMulti : lWindow;
            // Derecha
            if ((lMulti + lWindow + wWindow) > wMain) {
                hsobra = (lMulti + lWindow + wWindow) - wMain
                lWindow = lWindow - hsobra - 15;
            }
        }
        $window.css({
            'top': tWindow,
            'left': lWindow
        });
        $window.fadeIn();
    },

    closeToolTip: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[mOptions.activeMap.active];
        $('#mapaGameContainer-' + instance).css('height', 'auto');
        $('#mapaTest-' + instance).hide();
        $('#mapaToolTip-' + instance).fadeOut(function () {
            $eXeMapa.hideModalWindows(instance);
            mOptions.showData = false;
            var $divTool = $('#mapaToolTip-' + instance).find('.mapa-LinkToolTipPoints[data-id="' + q.id + '"]').eq(0)
            if ($divTool.length == 1) {
                $divTool.addClass('js-hidden');
                $('#mapaMainContainer-' + instance).parent('.mapa-IDevice').append($divTool);
            }
            if (mOptions.evaluation == 2 || mOptions.evaluation == 3) {
                $eXeMapa.hideMapDetail(instance, true);
            }
            $eXeMapa.hideCover(instance);
            if (mOptions.evaluation == 1) {
                $eXeMapa.showMessage(0, '', instance);
                if (mOptions.activeMap.pts.length - mOptions.hits - mOptions.errors <= 0) {
                    $eXeMapa.gameOver(instance);
                }
            } else if (mOptions.evaluation == 2) {
                mOptions.activeTitle++;
                if (mOptions.activeTitle >= mOptions.numberQuestions) {
                    $eXeMapa.gameOver(instance);
                } else {
                    $eXeMapa.showFind(instance, mOptions.activeTitle);
                }
            } else if (mOptions.evaluation == 3) {
                mOptions.activeTitle++;
                if (mOptions.hits >= mOptions.numberQuestions) {
                    $eXeMapa.gameOver(instance);
                } else {
                    $eXeMapa.showFind(instance, mOptions.activeTitle);
                }
            }
            $eXeMapa.showClue(instance);
            $eXeMapa.messageAllVisited(instance);
        });
    },
    startGame: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $('#mapaMessageFindP-' + instance).show();
        $('#mapaStartGame-' + instance).hide();

        if (mOptions.evaluation == 2 || mOptions.evaluation == 3) {
            $eXeMapa.showFind(instance, 0);
        }
        mOptions.gameStarted = true;
    },
    showMapDetail: function (instance, num) {
        var mOptions = $eXeMapa.options[instance];
        mOptions.levels[mOptions.levels.length - 1] = $.extend(true, {}, mOptions.activeMap);
        var nlevel = $.extend(true, {}, mOptions.activeMap.pts[num].map);
        mOptions.activeMap = $.extend(true, {}, nlevel);
        mOptions.levels.push(nlevel);
        mOptions.showData = false;
        mOptions.showDetail = true;
        mOptions.numLevel++;
        $eXeMapa.addPoints(instance, mOptions.activeMap.pts);
        $eXeMapa.showImage(mOptions.activeMap.url, mOptions.activeMap.alt, instance);
        $eXeMapa.showButtonAreas(mOptions.activeMap.pts, instance);
        $('#mapaLinkCloseDetail-' + instance).show();
        if (mOptions.levels.length > 2) {
            $('#mapaLinkCloseHome-' + instance).show();
        }
    },
    showButtonAreas: function (pts, instance) {
        $('#mapaLinkAreas-' + instance).hide();
        for (var i = 0; i < pts.length; i++) {
            if (pts[i].iconType == 1) {
                $('#mapaLinkAreas-' + instance).show();
            }
        }
    },
    endFind: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $('#mapaMessageFindP-' + instance).text('');
        $('#mapaMessageDetail-' + instance).hide();
        $('#mapaMessageDetailsSound-' + instance).hide();
        $('#mapaMultimedia-' + instance).find('.MQP-Point').each(function () {
            $(this).attr('title', $(this).text());
        });
        $('#mapaMultimedia-' + instance).find('.MQP-Area').each(function () {
            $(this).attr('title', $(this).text());
        });
        mOptions.gameOver = false;
        mOptions.gameStarted = true;
        if (mOptions.evaluation == 1) {
            mOptions.evaluation = -2;
        } else if (mOptions.evaluation == 4) {
            mOptions.evaluation = -4;
        } else {
            mOptions.evaluation = -1;
        }
        $eXeMapa.stopSound(instance);
    },
    closePoint: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $eXeMapa.hideModalWindows(instance);
        $eXeMapa.stopVideo(instance);
        $eXeMapa.stopVideoText(instance);
        $eXeMapa.stopSound(instance);
        $('#mapaFDetailsSound-' + instance).hide();
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFMessages-' + instance).hide();
        $('#mapaTest-' + instance).hide();
        $('#mapaGameContainer-' + instance).css('height', 'auto');
        $('#mapaText-' + instance).css('height', 'auto');
        if (mOptions.evaluation == 2 || mOptions.evaluation == 3) {
            $eXeMapa.hideMapDetail(instance, true);
        }
        $eXeMapa.hideCover(instance);
        if (mOptions.evaluation == 1) {
            $eXeMapa.showMessage(0, '', instance);
            if (mOptions.activeMap.pts.length - mOptions.hits - mOptions.errors <= 0) {
                $eXeMapa.gameOver(instance);
            }
        } else if (mOptions.evaluation == 2) {
            mOptions.activeTitle++;
            if (mOptions.activeTitle >= mOptions.numberQuestions) {
                $eXeMapa.gameOver(instance);
            } else {
                $eXeMapa.showFind(instance, mOptions.activeTitle);
            }
        } else if (mOptions.evaluation == 3) {
            mOptions.activeTitle++;
            if (mOptions.hits >= mOptions.numberQuestions) {
                $eXeMapa.gameOver(instance);
            } else {
                $eXeMapa.showFind(instance, mOptions.activeTitle);
            }
        }
        $eXeMapa.showClue(instance);
        $eXeMapa.messageAllVisited(instance);
        mOptions.showData = false;
    },
    changeQuextion: function (instance, button) {
        var mOptions = $eXeMapa.options[instance];
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
        var bordeColors = [$eXeMapa.borderColors.red, $eXeMapa.borderColors.blue, $eXeMapa.borderColors.green, $eXeMapa.borderColors.yellow],
            css = {
                'border-size': 1,
                'border-color': bordeColors[numberButton],
                'background-color': "transparent",
                'cursor': 'default',
                'color': $eXeMapa.colors.black
            };
        if (type) {
            css = {
                'border-size': 1,
                'border-color': bordeColors[numberButton],
                'background-color': bordeColors[numberButton],
                'cursor': 'pointer',
                'color': '#ffffff'
            };
        }
        $(button).css(css);
        $('#mapaAnswers-' + instance + ' .MQP-AnswersOptions').remove();
        for (var i = 0; i < mOptions.respuesta.length; i++) {
            if (mOptions.respuesta[i] === 'A') {
                $('#mapaAnswers-' + instance).append('<div class="MQP-AnswersOptions MQP-Answer1"></div>');

            } else if (mOptions.respuesta[i] === 'B') {
                $('#mapaAnswers-' + instance).append('<div class="MQP-AnswersOptions MQP-Answer2"></div>');

            } else if (mOptions.respuesta[i] === 'C') {
                $('#mapaAnswers-' + instance).append('<div class="MQP-AnswersOptions MQP-Answer3"></div>');

            } else if (mOptions.respuesta[i] === 'D') {
                $('#mapaAnswers-' + instance).append('<div class="MQP-AnswersOptions MQP-Answer4"></div>');
            }
        }
    },
    showQuestionaire: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        if ($eXeMapa.getNumberVisited(mOptions.visiteds) < Math.floor(mOptions.numberPoints * (mOptions.percentajeShowQ / 100))) {
            var msg = mOptions.msgs.msgReviewContents.replace('%s', mOptions.percentajeShowQ);
            $eXeMapa.showMessageModal(instance, msg, 0, 0, -1);
            return;
        }
        mOptions.questionaireStarted = true;
        $eXeMapa.stopVideo(instance);
        $eXeMapa.showQuestion(mOptions.activeQuestion, instance);
        $('#mapaFDetailsSound-' + instance).hide();
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFMessages-' + instance).hide();
        $('#mapaFTests-' + instance).show();
        $('#mapaCubierta-' + instance).show();
        $('#mapaPNumber-' + instance).text(mOptions.numberQuestions);
    },
    showMessageModal: function (instance, message, type, color1, num) {
        var mOptions = $eXeMapa.options[instance],
            colors = [$eXeMapa.borderColors.black, $eXeMapa.borderColors.red, $eXeMapa.borderColors.green, $eXeMapa.borderColors.blue, $eXeMapa.borderColors.yellow],
            color = colors[color1];
        mOptions.showData = true;
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFDetailsSound-' + instance).hide();
        $('#mapaFTests-' + instance).hide();
        $('#mapaFMessages-' + instance).show();
        $('#mapaFMessageInfo-' + instance).show();
        $('#mapaFMessageAccess-' + instance).hide();
        $('#mapaFMessageOver-' + instance).hide();
        $('#mapaMessageInfoText-' + instance).text(message);
        $('#mapaFMessageInfo-' + instance).css({
            'color': color,
            'font-size': '1em'
        });
        $('#mapaFMessageInfo-' + instance).find('.MQP-GOScoreButtons').hide();
        $('#mapaFMessageInfoAccept-' + instance).hide();
        if (type != 2) {
            $('#mapaFMessageInfo-' + instance).find('.MQP-GOScoreButtons').show();
            $('#mapaFMessageInfoAccept-' + instance).show();
        }
        $eXeMapa.placePointInWindow($('#mapaFMessages-' + instance), num, instance)
    },
    answerQuestion: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            quextion = mOptions.selectsGame[mOptions.activeQuestion];
        $eXeMapa.stopSound(instance);
        if (!mOptions.gameActived) {
            return;
        }
        mOptions.gameActived = false;
        var solution = quextion.solution,
            answer = mOptions.respuesta.toUpperCase(),
            correct = true;
        if (quextion.typeSelect === 2) {
            solution = quextion.solutionQuestion.toUpperCase();
            answer = $.trim($('#mapaEdAnswer-' + instance).val()).toUpperCase();
            correct = solution == answer;
            if (answer.length == 0) {
                $eXeMapa.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
                mOptions.gameActived = true;
                return;
            }
        } else if (quextion.typeSelect === 1) {
            if (answer.length !== solution.length) {
                $eXeMapa.showMessage(1, mOptions.msgs.msgOrders, instance);
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
        var message = $eXeMapa.updateScore(correct, instance),
            timeShowSolution = 3000,
            type = correct ? 2 : 1;
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
            if (quextion.typeSelect != 2) {
                $eXeMapa.drawSolution(instance);
            } else {
                var mtipe = correct ? 2 : 1;
                $eXeMapa.drawPhrase(quextion.solutionQuestion, quextion.quextion, 100, mtipe, false, instance, true);
            }
        }
        $eXeMapa.showClue(instance);
        $eXeMapa.showMessage(type, message, instance);
        if (mOptions.evaluation == 4 && mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeMapa.initialScore === '') {
                var score = (mOptions.hits * 10 / mOptions.numberQuestions).toFixed(2);
                $eXeMapa.sendScore(true, instance);
                $('#mapaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
        setTimeout(function () {
            $eXeMapa.newQuestion(instance, correct, false);
        }, timeShowSolution);
    },
    showClue: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            percentageHits = 0;
        if (mOptions.evaluation < 0 || mOptions.gameOver) {
            return;
        }
        if (mOptions.evaluation == 0) {
            percentageHits = $eXeMapa.getScoreVisited(instance) * 10;
        } else if (mOptions.evaluation == 1 || mOptions.evaluation == 2 || mOptions.evaluation == 3) {
            percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        } else if (mOptions.evaluation == 4) {
            percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100;
        }
        if (mOptions.itinerary.showClue) {
            if (percentageHits >= mOptions.itinerary.percentageClue) {
                if (!mOptions.obtainedClue) {
                    var msg = mOptions.msgs.msgInformation + ': ' + mOptions.itinerary.clueGame;
                    if (mOptions.evaluation == 4) {
                        $('#mapaPShowClue-' + instance).text(msg);
                        $('#mapaShowClue-' + instance).show();
                    }
                    mOptions.obtainedClue = true;
                    $('#mapaPGameClue-' + instance).text(msg);
                    $('#mapaGameClue-' + instance).show();
                    $eXeMapa.refreshImageActive(instance);
                }
            }
        }
    },
    sameQuestion: function (correct, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.selectsGame[mOptions.activeQuestion];
        return ((correct && q.hits == mOptions.activeQuestion) || (!correct && q.error == mOptions.activeQuestion));
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeMapa.options[instance],
            text = '';
        $('#mapaSendScore-' + instance).hide();
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
            $('#mapaSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgSeveralScore;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#mapaSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#mapaRepeatActivity-' + instance).text(text);
        $('#mapaRepeatActivity-' + instance).fadeIn(1000);
    },
    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeMapa.options[instance],
            message = "",
            obtainedPoints = 0,
            sscore = 0;
        if (correctAnswer) {
            mOptions.hits++;
            obtainedPoints = (10 / mOptions.numberQuestions);
        } else {
            mOptions.errors++;
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        sscore = mOptions.score;
        sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#mapaPScore-' + instance).text(sscore);
        $('#mapaPHits-' + instance).text(mOptions.hits);
        $('#mapaPErrors-' + instance).text(mOptions.errors);
        message = $eXeMapa.getMessageAnswer(correctAnswer, obtainedPoints.toFixed(2), instance);
        return message;
    },
    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeMapa.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    newQuestion: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        mOptions.activeQuestion++;
        if (mOptions.activeQuestion >= mOptions.numberQuestions) {
            $eXeMapa.gameOver(instance);
            return;
        } else {
            $eXeMapa.showQuestion(mOptions.activeQuestion, instance);
            var numQ = mOptions.numberQuestions - mOptions.activeQuestion;
            $('#mapaPNumber-' + instance).text(numQ);
        }
    },
    gameOver: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            puntuacion = 0,
            msg = mOptions.msgs.msgScore10,
            numq = mOptions.numberQuestions;
        mOptions.gameStarted = false;
        mOptions.questionaireStarted = false;
        mOptions.gameActived = false;
        mOptions.gameOver = true;
        puntuacion = (mOptions.hits * 10 / numq).toFixed(2);
        if (puntuacion < 5) {
            msg = mOptions.msgs.msgScore4;
        } else if (puntuacion < 7) {
            msg = mOptions.msgs.msgScore6;
        } else if (puntuacion < 10) {
            msg = mOptions.msgs.msgScore8;
        }
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFDetailsSound-' + instance).hide();
        $('#mapaFTests-' + instance).hide();
        $('#mapaFMessages-' + instance).fadeIn();
        $('#mapaFMessageInfo-' + instance).hide();
        $('#mapaFMessageAccess-' + instance).hide();
        $('#mapaFMessageOver-' + instance).show();
        $('#mapaGOMessage-' + instance).text(msg);
        $('#mapaGONumber-' + instance).text(mOptions.msgs.msgQuestions + ': ' + numq);
        $('#mapaGoScore-' + instance).text(mOptions.msgs.msgScore + ': ' + puntuacion);
        $('#mapaGOHits-' + instance).text(mOptions.msgs.msgHits + ': ' + mOptions.hits);
        $('#mapaGOErrors-' + instance).text(mOptions.msgs.msgErrors + ': ' + mOptions.errors);
        if (mOptions.evaluation == 3) {
            $('#mapaErrorScore-' + instance).hide();
        }
        mOptions.gameOver = true;
        if ((mOptions.evaluation == 1 || mOptions.evaluation == 2 || mOptions.evaluation == 3 || mOptions.evaluation == 4) && mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeMapa.initialScore === '') {
                var score = ((mOptions.hits * 10) / numq).toFixed(2);
                $eXeMapa.sendScore(true, instance);
                $eXeMapa.initialScore = score;
                
            }
        }
        $eXeMapa.hideCover(instance);
        $('#mapaFMessageOver-' + instance).show();
        setTimeout(function () {
            $eXeMapa.placePointInWindow($('#mapaFMessages-' + instance), -1, instance)
        }, 500);
    },
    updateNumberQuestion: function (numq, instance) {
        var mOptions = $eXeMapa.options[instance],
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10;
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },
    getMessageAnswer: function (correctAnswer, npts, instance) {
        var message = "";
        if (correctAnswer) {
            message = $eXeMapa.getMessageCorrectAnswer(npts, instance);
        } else {
            message = $eXeMapa.getMessageErrorAnswer(instance);
        }
        return message;
    },
    getMessageCorrectAnswer: function (npts, instance) {
        var mOptions = $eXeMapa.options[instance],
            messageCorrect = $eXeMapa.getRetroFeedMessages(true, instance),
            message = "";
        if (mOptions.selectsGame[mOptions.activeQuestion].msgHit.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgHit;
        } else {
            message = messageCorrect;
        }
        message = message + ' ' + npts + ' ' + mOptions.msgs.msgPoints;
        return message;
    },
    getMessageErrorAnswer: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            messageError = $eXeMapa.getRetroFeedMessages(false, instance),
            message = "";
        if (mOptions.selectsGame[mOptions.activeQuestion].msgError.length > 0) {
            message = mOptions.selectsGame[mOptions.activeQuestion].msgError;
        } else {
            message = messageError;
        }
        return message;
    },
    closeOptions: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            p = mOptions.activeMap.pts[mOptions.activeMap.active];
        if (p.state != 0) {
            return;
        }
        $('#mapaTest-' + instance).fadeOut(100, function () {
            p.state = -1;
            mOptions.showData = false;
        });
        $eXeMapa.stopSound(instance);
    },
    randomSubset: function (num, k, sol) {
        var copy = [],
            result = []
        for (var i = 0; i < num; i++) {
            copy.push(i);
        }
        copy.splice(sol, 1);
        k = k - 1;
        k = k > copy.length ? copy.length : k;
        while (result.length < k) {
            var index = Math.floor(Math.random() * copy.length);
            result.push(copy[index]);
            copy.splice(index, 1);
        }
        result.push(sol)
        return result;
    },
    showOptionsRect: function (instance, num) {
        var mOptions = $eXeMapa.options[instance],
            p = mOptions.activeMap.pts[num],
            wI = $('#mapaImageRect-' + instance).width(),
            hI = $('#mapaImageRect-' + instance).height(),
            wC = $('#mapaContainerRect-' + instance).width(),
            hC = $('#mapaContainerRect-' + instance).height(),
            lp = Math.round(p.x * wI - wC / 2),
            tp = Math.round(p.y * hI - hC / 2),
            msg = typeof p.question != "undefined" && p.question.length > 0 ? p.question : '';
        if (p.state != -1) {
            mOptions.showData = false;
            return;
        }
        if (typeof mOptions.optionsNumber != 'undefined' && mOptions.optionsNumber > 1) {
            var mostrar = $eXeMapa.randomSubset(mOptions.activeMap.pts.length, mOptions.optionsNumber, num)
            $('#mapaOptionsTest-' + instance).find('.MPQ-OptionTest').hide();
            for (var i = 0; i < mostrar.length; i++) {
                $('#mapaOptionsTest-' + instance).find('.MPQ-OptionTest').filter('[data-number="' + mostrar[i] + '"]').show();
            }
        }
        mOptions.activeMap.active = num;
        $('#mapaMessageRectP-' + instance).text(msg);
        $('#mapaMessageRect-' + instance).show();
        $('#mapaImageRect-' + instance).css({
            'left': -lp + 'px',
            'top': -tp + 'px'
        });
        $eXeMapa.stopSound(instance);
        $('#mapaPlayAudioRect-' + instance).hide();
        if (typeof p.question_audio != "undefined" && p.question_audio.length > 4) {
            $eXeMapa.playSound(p.question_audio, instance);
            $('#mapaPlayAudioRect-' + instance).show();
        }
        $('#mapaTest-' + instance).fadeIn(100);
        mOptions.tilteRect = p.title;
        mOptions.activeMap.active = num;
        p.state = 0;
        var htb = $('#mapaToolBar-' + instance).height(),
            hg = $('#mapaGameContainer-' + instance).height() - htb;

        $('#mapaTest-' + instance).height(hg);
        $('#mapaTest-' + instance).css({
            'top': htb + 'px'
        });
        mOptions.showData = false;
    },
    answerRect: function (instance, answer) {
        var mOptions = $eXeMapa.options[instance],
            solution = mOptions.tilteRect,
            correct = solution == answer,
            message = $eXeMapa.updateScoreFind(correct, instance),
            num = mOptions.activeMap.active;
        $('#mapaFMessages-' + instance).hide();
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFDetailsSound-' + instance).hide();
        if (mOptions.activeMap.pts[mOptions.activeMap.active].type == 5) {
            mOptions.activeMap.pts[mOptions.activeMap.active].type = 0;
            mOptions.activeMap.pts[mOptions.activeMap.active].url = mOptions.activeMap.pts[mOptions.activeMap.active].map.url;
        }
        if (correct) {
            mOptions.activeMap.pts[mOptions.activeMap.active].state = 2;
            if (mOptions.activeMap.pts[mOptions.activeMap.active].type < 4 || mOptions.activeMap.pts[mOptions.activeMap.active].type == 6 || mOptions.activeMap.pts[mOptions.activeMap.active].type == 7) {
                $eXeMapa.hideCover(instance);
                $eXeMapa.showMessageDetail(instance, message, 2);
                $eXeMapa.showPoint(mOptions.activeMap.active, instance);
            } else {
                var num = mOptions.activeMap.active
                if (mOptions.activeMap.pts[num].type == 8) {
                    $eXeMapa.showPointLink(num, instance)
                } else {
                    $eXeMapa.showMessageModal(instance, message + ': ' + mOptions.activeMap.pts[mOptions.activeMap.active].title, 2, 2, -1);
                }
                setTimeout(function () {
                    if (mOptions.activeMap.pts.length - mOptions.hits - mOptions.errors <= 0) {
                        $eXeMapa.gameOver(instance);
                    } else {
                        $('#mapaTest-' + instance).hide();
                    }
                    $eXeMapa.hideCover(instance);
                    mOptions.showData = false;

                }, mOptions.timeShowSolution * 1000);
            }
        } else {
            mOptions.activeMap.pts[mOptions.activeMap.active].state = 1;
            message = mOptions.msgs.msgNotCorrect1 + ' "' + solution + '"';
            $eXeMapa.showMessageModal(instance, message, 2, 0, -1);
            setTimeout(function () {
                $eXeMapa.hideCover(instance);
                if (mOptions.numberQuestions - mOptions.hits - mOptions.errors <= 0) {
                    $eXeMapa.gameOver(instance);
                } else {
                    $('#mapaTest-' + instance).hide();
                } //$('#mapaTest-' + instance).hide();
                $eXeMapa.stopSound(instance);
                mOptions.showData = false;

            }, mOptions.timeShowSolution * 1000);
        }
        $eXeMapa.showClue(instance);
        $eXeMapa.paintPoints(instance);
        var $activ = $('#mapaMultimedia-' + instance).find('.MQP-Point[data-number="' + mOptions.activeMap.active + '"]').eq(0);
        $activ.attr('title', solution);
        if (mOptions.isScorm == 1 && mOptions.evaluation != 4 && mOptions.evaluation > -1) {
            if (mOptions.repeatActivity || $eXeMapa.initialScore === '') {
                var score = mOptions.evaluation === 0 ? $eXeMapa.getScoreVisited(instance) : $eXeMapa.getScoreFind(instance);
                $eXeMapa.sendScore(true, instance);
                $('#mapaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
    },
    answerFind: function (num, id, instance) {
        var mOptions = $eXeMapa.options[instance],
            solution = mOptions.title.id,
            answer = id,
            question = mOptions.activeMap.pts[num].question,
            answert = mOptions.activeMap.pts[num].title,
            correct = solution == answer,
            message = $eXeMapa.updateScoreFind(correct, instance);
        $eXeMapa.showClue(instance);
        $('#mapaFMessages-' + instance).hide();
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFDetailsSound-' + instance).hide();
        $('#mapaLinkCloseDetail-' + instance).hide();
        $('#mapaLinkCloseHome-' + instance).hide();
        if (correct) {
            if (mOptions.activeMap.pts[num].type < 4 || mOptions.activeMap.pts[num].type == 6) {
                $eXeMapa.showMessageDetail(instance, message, 2);
                $eXeMapa.showPoint(num, instance);
            } else if (mOptions.activeMap.pts[num].type == 7) {
                $eXeMapa.showToolTip(num, instance)
            } else {
                if (mOptions.activeMap.pts[num].type == 8) {
                    $eXeMapa.showPointLink(num, instance)
                    setTimeout(function () {
                        if (mOptions.evaluation == 2 || mOptions.evaluation == 3) {
                            mOptions.activeTitle++;
                        }
                        $eXeMapa.hideMapDetail(instance, true);
                        if (mOptions.activeTitle >= mOptions.numberQuestions || mOptions.evaluation == 3 && mOptions.hits >= mOptions.numberQuestions) {
                            $eXeMapa.gameOver(instance);
                        } else {
                            $eXeMapa.showFind(instance, mOptions.activeTitle);
                        }
                        $eXeMapa.hideCover(instance);
                        $eXeMapa.hideMapDetail(instance, true);
                        mOptions.showData = false;
                    }, mOptions.timeShowSolution * 1000);
                } else {
                    $eXeMapa.showMessageModal(instance, message + ': ' + mOptions.title.title, 1, 2, num);
                }
            }
        } else {
            message = mOptions.msgs.msgNotCorrect + ' "' + answert + '"';
            if (mOptions.evaluation == 2 && question.length > 0) {
                message = mOptions.msgs.msgNotCorrect + ' "' + answert + '" ' + mOptions.msgs.msgNotCorrect2 + ' "' + mOptions.title.title + '"';
            }
            if (mOptions.evaluation == 3) {
                message += ' ' + mOptions.msgs.msgNotCorrect3;
            }
            $eXeMapa.showMessageModal(instance, message, 2, 0, num);
            setTimeout(function () {
                if (mOptions.evaluation == 2) {
                    mOptions.activeTitle++;
                }
                $eXeMapa.hideMapDetail(instance, true);
                if (mOptions.activeTitle >= mOptions.numberQuestions) {
                    $eXeMapa.gameOver(instance);
                } else {
                    if (mOptions.evaluation == 2) {
                        $eXeMapa.showFind(instance, mOptions.activeTitle);
                    }
                }
                $eXeMapa.hideCover(instance);
                mOptions.showData = false;

            }, mOptions.timeShowSolution * 1000);
        }
        if (mOptions.isScorm == 1 && mOptions.evaluation != 4 && mOptions.evaluation > -1) {
            if (mOptions.repeatActivity || $eXeMapa.initialScore === '') {
                var score = mOptions.evaluation === 0 ? $eXeMapa.getScoreVisited(instance) : $eXeMapa.getScoreFind(instance);
                $eXeMapa.sendScore(true, instance);
                $('#mapaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
    },
    updateScoreFind: function (correctAnswer, instance) {
        var mOptions = $eXeMapa.options[instance],
            message = "",
            obtainedPoints = 0,
            sscore = 0;
        if (correctAnswer) {
            mOptions.hits++;
            obtainedPoints = (10 / mOptions.numberQuestions);
        } else {
            mOptions.errors++;
        }
        mOptions.score = (mOptions.score + obtainedPoints > 0) ? mOptions.score + obtainedPoints : 0;
        sscore = mOptions.score;
        sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#mapaPScoreF-' + instance).text(sscore);
        $('#mapaPHitsF-' + instance).text(mOptions.hits);
        $('#mapaPErrorsF-' + instance).text(mOptions.errors);
        var nump = mOptions.evaluation == 1 || mOptions.evaluation == 2 ? mOptions.numberQuestions - mOptions.hits - mOptions.errors : mOptions.numberQuestions - mOptions.hits;
        $('#mapaPNumberF-' + instance).text(nump);
        message = $eXeMapa.getMessageAnswer(correctAnswer, obtainedPoints.toFixed(2), instance);
        return message;
    },
    showMessageDetail: function (instance, message, type) {
        var colors = [$eXeMapa.borderColors.black, $eXeMapa.borderColors.red, $eXeMapa.borderColors.green, $eXeMapa.borderColors.blue, $eXeMapa.borderColors.yellow],
            color = colors[type];
        $('#mapaMessageDetail-' + instance).text(message);
        $('#mapaMessageDetail-' + instance).css({
            'color': color
        });
        $('#mapaMessageDetail-' + instance).show();

        $('#mapaMessageDetailsSound-' + instance).text(message);
        $('#mapaMessageDetailsSound-' + instance).css({
            'color': color
        });
        $('#mapaMessageDetailsSound-' + instance).show();
    },
    showPoint: function (i, instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[i],
            urllv = $eXeMapa.getURLVideoMediaTeca(q.video),
            type = urllv ? 1 : 0;
        mOptions.activeMap.active = i;
        if (q.type == 1) {
            $eXeMapa.stopSound(instance);
        }
        $eXeMapa.showClue(instance);
        $eXeMapa.hideModalWindows(instance);
        if (q.type == 4) {
            $eXeMapa.showPointNone(i, instance);
            return;
        }
        mOptions.waitPlayVideo = false;
        if (type == 0) {
            $eXeMapa.startVideo('', 0, 0, instance, type);
        }
        $eXeMapa.stopVideo(instance);
        $eXeMapa.hideModalMessages(instance);
        if (q.type != 5) {
            mOptions.visiteds.push(q.id);
        }
        $('#mapaMultimediaPoint-' + instance).show();
        $('#mapaAuthorPoint-' + instance).html(q.author);
        $('#mapaTitlePoint-' + instance).text(q.title);
        $('#mapaTitlePointSound-' + instance).text(q.title);
        $('#mapaFooterPoint-' + instance).text(q.footer);
        $('#mapaFooterPointSound-' + instance).text(q.footer);
        $('#mapaFooterPoint-' + instance).show();
        $('#mapaTextPoint-' + instance).text(q.title);
        if (q.footer.length > 0 && q.type == 2 && q.type == 7) {
            $('#mapaFooterPoint-' + instance).show();
        }
        if (q.type === 0) {
            $eXeMapa.showPointImage(i, instance);
        } else if (q.type === 1) {
            $eXeMapa.showPointVideo(i, instance);
        } else if (q.type === 2) {
            $eXeMapa.showPointText(i, instance);
        } else if (q.type == 7) {
            $eXeMapa.showToolTip(i, instance);
        } else if (q.type == 8) {
            $eXeMapa.showPointLink(i, instance);
        } else if (q.type === 3) {
            $eXeMapa.showPointSound(i, instance);
        } else if (q.type == 5) {
            $eXeMapa.showMapDetail(instance, i);
        } else if (q.type == 6) {
            mOptions.activeSlide = 0;
            $('#mapaLinkSlideRight-' + instance).show();
            $eXeMapa.showSlide(mOptions.activeSlide, instance, i);
        }
        if (typeof q.audio != "undefined" && q.audio.length > 4) {
            $eXeMapa.playSound(q.audio, instance);
        }
        if (mOptions.isScorm == 1 && mOptions.evaluation != 4 && mOptions.evaluation > -1) {
            if (mOptions.repeatActivity || $eXeMapa.initialScore === '') {
                var score = mOptions.evaluation === 0 ? $eXeMapa.getScoreVisited(instance) : $eXeMapa.getScoreFind(instance);
                $eXeMapa.sendScore(true, instance);
                $('#mapaRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
            }
        }
        var html = $('#mapaFDetails-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMapa.updateLatex('mapaFDetails-' + instance);
        }
    },
    setFontModalMessage: function (size, instance) {
        $('#mapaMessageInfoText-' + instance).css({
            'font-size': size + 'em'
        });
    },
    hideModalWindows(instance) {
        $('#mapaFMessages-' + instance).hide();
        $('#mapaFTests-' + instance).hide();
        $('#mapaFDetails-' + instance).hide();
        $('#mapaToolTip-' + instance).hide();
        $('#mapaFDetailsSound-' + instance).hide();
    },
    hideModalMessages: function (instance) {
        $('#mapaFMessages-' + instance).hide();
        $('#mapaFTests-' + instance).hide();
        $('#mapaFMessageAccess-' + instance).hide();
        $('#mapaVideoPoint-' + instance).hide();
        $('#mapaVideoLocal-' + instance).hide();
        $('#mapaTextPoint-' + instance).hide();
        $('#mapaImagePoint-' + instance).hide();
        $('#mapaCoverPoint-' + instance).hide();
        $('#mapaFooterPoint-' + instance).hide();
        $('#mapaLinkAudio-' + instance).hide();
        $('#mapaLinkSlideLeft-' + instance).hide();
        $('#mapaLinkSlideRight-' + instance).hide();
        $('#mapaAuthorPoint-' + instance).hide();
    },
    getScoreVisited: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        var num = $eXeMapa.getNumberVisited(mOptions.visiteds),
            score = ((num * 10) / mOptions.numberQuestions).toFixed(2);
        return score;
    },
    getNumberVisited: function (a) {
        var visiteds = Object.values($.extend(true, {}, a));
        for (var i = visiteds.length - 1; i >= 0; i--) {
            if (visiteds.indexOf(visiteds[i]) !== i) visiteds.splice(i, 1);
        }
        return visiteds.length;
    },
    messageAllVisited: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        if (mOptions.evaluation == 0) {
            if ($eXeMapa.getScoreVisited(instance) == 10.00) {
                $('#mapaPShowClue-' + instance).text(mOptions.msgs.msgAllVisited);
                $('#mapaShowClue-' + instance).show();
            }
        } else if (mOptions.evaluation == 4) {
            if (mOptions.percentajeShowQ > 0 && $eXeMapa.getNumberVisited(mOptions.visiteds) >= mOptions.numberPoints * (mOptions.percentajeShowQ / 100)) {
                $('#mapaMessageFindP-' + instance).text(mOptions.msgs.msgAllVisited + ' ' + mOptions.msgs.msgCompleteTest);
                $('#mapaMessageFindP-' + instance).show();
            }
        }
    },
    getScoreFind: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        return score;
    },

    hideCover: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            q = mOptions.activeMap.pts[mOptions.activeMap.active];
        $('#mapaFDetails-' + instance).hide();
        $('#mapaFMessages-' + instance).hide();
        $('#mapaFDetailsSound-' + instance).hide();
        if (q.type == 2) {
            var $divText = $('#mapaTextPoint-' + instance).find('.mapa-LinkTextsPoints[data-id="' + q.id + '"]').eq(0)
            if ($divText.length == 1) {
                $divText.addClass('js-hidden');
                $('#mapaMainContainer-' + instance).parent('.mapa-IDevice').append($divText);
                $('#mapaTextPoint-' + instance).empty();
            }

        } else if (q.type == 7) {
            var $divTool = $('#mapaToolTip-' + instance).find('.mapa-LinkToolTipPoints[data-id="' + q.id + '"]').eq(0)
            if ($divTool.length == 1) {
                $divTool.addClass('js-hidden');
                $('#mapaMainContainer-' + instance).parent('.mapa-IDevice').append($divTool);
                $('#mapaToolTip-' + instance).empty();
            }
        }
        $('#mapaFTests-' + instance).hide();
    },
    hideMapDetail: function (instance, start) {
        var mOptions = $eXeMapa.options[instance];
        if (mOptions.levels.length > 1) {
            var parent = mOptions.levels[mOptions.levels.length - 2];
            if (start) {
                mOptions.levels = mOptions.levels.slice(0, 1);
                parent = mOptions.levels[0];
                mOptions.numLevel = 0;
            } else {
                mOptions.numLevel--;
                mOptions.levels.pop();
            }
            mOptions.activeMap = $.extend(true, {}, parent);
            $eXeMapa.addPoints(instance, mOptions.activeMap.pts);
            $eXeMapa.showImage(mOptions.activeMap.url, mOptions.activeMap.alt, instance);
            $eXeMapa.showButtonAreas(mOptions.activeMap.pts, instance);
            $eXeMapa.messageAllVisited(instance);
            mOptions.showData = false;
            if (mOptions.levels.length == 1) {
                mOptions.numLevel = 0;
                mOptions.showDetail = false;
                $('#mapaLinkCloseDetail-' + instance).hide();
            }
            if (mOptions.levels.length < 3) {
                $('#mapaLinkCloseHome-' + instance).hide();
            }
        }
    },
    refreshImageActive: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        $eXeMapa.showImage(mOptions.activeMap.url, mOptions.activeMap.alt, instance);
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() === $('#mapaCodeAccessE-' + instance).val().toLowerCase()) {
            $eXeMapa.hideCover(instance);
            mOptions.showData = false;
        } else {
            $('#mapaMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#mapaCodeAccessE-' + instance).val('');
        }
    },
    uptateTime: function (tiempo, instance) {
        var mTime = $eXeMapa.getTimeToString(tiempo);
        $('#mapaPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600];
        if ((iT) < times.length) {
            return times[iT];
        } else {
            return iT;
        }
    },
    startVideo: function (id, start, end, instance, type) {
        var mOptions = $eXeMapa.options[instance],
            mstart = start < 1 ? 0.1 : start;
        $('#mapaVideoPoint-' + instance).hide();
        $('#mapaVideoLocal-' + instance).hide();
        if (typeof type != "undefided" && type > 0) {
            if (mOptions.localPlayer) {
                mOptions.pointEnd = end;
                mOptions.localPlayer.src = id
                mOptions.localPlayer.currentTime = parseFloat(start)
                if (typeof mOptions.localPlayer.play == "function") {
                    mOptions.localPlayer.play();
                }
            }
            clearInterval(mOptions.timeUpdateInterval);
            mOptions.timeUpdateInterval = setInterval(function () {
                $eXeMapa.updateTimerDisplayLocal(instance);
            }, 1000);
            $('#mapaVideoLocal-' + instance).show();
            return;
        }
        if (mOptions.player) {
            if (typeof mOptions.player.loadVideoById == "function") {
                mOptions.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
        }
        $('#mapaVideoPoint-' + instance).show();
    },
    updateTimerDisplayLocal: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        if (mOptions.localPlayer) {
            var currentTime = mOptions.localPlayer.currentTime;
            if (currentTime) {
                if (Math.ceil(currentTime) == mOptions.pointEnd || Math.ceil(currentTime) == mOptions.durationVideo) {
                    mOptions.localPlayer.pause();
                    mOptions.pointEnd = 100000;
                }
            }
        }
    },
    getIDYoutube: function (url) {
        if (url) {
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    getURLVideoMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;
            if (matc) {
                var id = url.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
                id = 'http://mediateca.educa.madrid.org/streaming.php?id=' + id;
                return id;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    youTubeReady: function () {
        for (var i = 0; i < $eXeMapa.options.length; i++) {
            var mOptions = $eXeMapa.options[i];
            mOptions.player = new YT.Player('mapaVideoPoint-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 1
                },
                events: {
                    'onReady': $eXeMapa.onPlayerReady,
                }
            });
        }
    },
    youTubeReadyOne: function (instance) {
        var mOptions = $eXeMapa.options[instance];
        mOptions.player = new YT.Player('mapaVideoPoint-' + instance, {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 1
            },
            events: {
                'onReady': $eXeMapa.onPlayerReady,
            }
        });
    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeMapa.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    onPlayerReady: function (event) {
        var video = 'mapaVideoPoint-0';
        if ((event.target.h) && (event.target.h.id)) {
            video = event.target.h.id;
        } else if ((event.target.i) && (event.target.i.id)) {
            video = event.target.i.id;
        }else if ((event.target.g) && (event.target.g.id)) {
            video = event.target.g.id;
        }
        video = video.split("-");
        if (video.length == 2 && (video[0] == "mapaVideoPoint")) {
            var instance = parseInt(video[1]);
            if (!isNaN(instance) && instance < $eXeMapa.options.length) {
                var mOptions = $eXeMapa.options[instance];
                if (mOptions.waitPlayVideo) {
                    mOptions.waitPlayVideo = false;
                    var point = mOptions.activeMap.pts[mOptions.activeMap.active],
                        id = $eXeMapa.getIDYoutube(point.video);
                    if (id) {
                        $eXeMapa.startVideo(id, point.iVideo, point.fVideo, instance, 0);
                    }
                }
            }
        }
    },
    playVideo: function (instance) {
        var mOptions = $eXeMapa.options[instance],
            point = mOptions.activeMap.pts[mOptions.activeMap.active],
            urllv = $eXeMapa.getURLVideoMediaTeca(point.video),
            type = urllv ? 1 : 0;
        if (type > 0) {
            //$('#mapaMultimediaPoint-' + instance).css('height', 'auto');
            $eXeMapa.startVideo(urllv, point.iVideo, point.fVideo, instance, type);
            return;
        }
        if (mOptions.hasYoutube && typeof (mOptions.player) == "undefined") {
            if (typeof (YT) !== "undefined") {
                $eXeMapa.youTubeReadyOne(instance);
            } else {
                $eXeMapa.loadYoutubeApi();
            }
        } else {
            var id = $eXeMapa.getIDYoutube(point.video);
            if (id) {
                $eXeMapa.startVideo(id, point.iVideo, point.fVideo, instance, type);
            }
        }
    },
    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    stopVideo: function (i) {
        var mOptions = $eXeMapa.options[i];
        if (mOptions.localPlayer) {
            if (typeof mOptions.localPlayer.pause == "function") {
                mOptions.localPlayer.pause();
            }
        }
        if (mOptions.player) {
            if (typeof mOptions.player.pauseVideo == "function") {
                mOptions.player.pauseVideo();
            }
        }
    },
    stopVideoText: function (i) {
        $('#mapaTextPoint-' + i).find('iframe').each(function () {
            var attr = $(this).attr('src');
            $(this).attr('src', '').attr('src', attr);
        });
        $('#mapaTextPoint-' + i).find('audio').each(function () {
            var atts = $(this).attr('src');
            $(this).attr('src', '').attr('src', atts);
        });
    },
    showImage: function (url, alt, instance) {
        var $Image = $('#mapaImage-' + instance);
        $('#mapaMultimedia-' + instance).find('.MQP-Point').hide();
        $('#mapaMultimedia-' + instance).find('.MQP-Area').hide();
        if ($.trim(url).length == 0) {
            $Image.hide();
            return false;
        }
        $Image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $Image.hide();
                    $Image.attr('alt', $eXeMapa.options[instance].msgs.msgNoImage);
                    return false;
                } else {
                    $eXeMapa.placeImageWindows1(this, this.naturalWidth, this.naturalHeight, instance);
                    $Image.show();
                    $Image.attr('alt', alt);
                    //$eXeMapa.updateHeightGame(instance);
                    $eXeMapa.paintPoints(instance);

                    return true;
                }
            }).on('error', function () {
                $Image.hide();
                $Image.attr('alt', $eXeMapa.options[instance].msgs.msgNoImage);
                return false;
            });
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
                    console.log('Error al refrescar mathjax')
                }
            }

        }, 100);
    },
    showMessage: function (type, message, instance) {
        var colors = [$eXeMapa.borderColors.black, $eXeMapa.borderColors.red, $eXeMapa.borderColors.green, $eXeMapa.borderColors.blue, $eXeMapa.borderColors.yellow],
            color = colors[type];
        $('#mapaMessage-' + instance).html(message);
        $('#mapaMessage-' + instance).css({
            'color': color
        });
    },
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': 0,
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    getShowLetter: function (phrase, nivel) {
        var numberLetter = parseInt(phrase.length * nivel / 100);
        var arrayRandom = [];
        while (arrayRandom.length < numberLetter) {
            var numberRandow = parseInt(Math.random() * phrase.length);
            if (arrayRandom.indexOf(numberRandow) != -1) {
                continue;
            } else {
                arrayRandom.push(numberRandow);
            }
        }
        return arrayRandom.sort();
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
        };
    },
    placeImageWindows1: function (image, naturalWidth, naturalHeight, instance) {
        $('#mapaMultimedia-' + instance).css('height', 'auto');
        var mOptions = $eXeMapa.options[instance],
            wp = $('#mapaMultimedia-' + instance).width(),
            top = $('#mapaToolBar-' + instance).height() + (parseInt($('#mapaMultimedia-' + instance).css('marginTop')) * 2),
            wI = wp,
            hI = Math.round((wI / naturalWidth) * naturalHeight);
        if ($('#mapaMessageFind-' + instance).is(":visible")) {
            top += $('#mapaMessageFind-' + instance).height();
            top += parseInt($('#mapaMessageFind-' + instance).css('marginTop')) * 2;
        }
        if ($('#mapaAutorLicence-' + instance).is(":visible")) {
            top += $('#mapaAutorLicence-' + instance).height();
            top += parseInt($('#mapaAutorLicence-' + instance).css('marginTop'));
        }
        if ($('#mapaGameClue-' + instance).is(":visible")) {
            top += $('#mapaGameClue-' + instance).height();
            top += parseInt($('#mapaGameClue-' + instance).css('marginTop')) * 2;
        }
        if ($eXeMapa.isFullScreen()) {
            $('#mapaMultimedia-' + instance).css({
                'max-width': (window.innerWidth - 30) + 'px'
            });
            wp = window.innerWidth - 30;
            var varW = naturalWidth / window.innerWidth,
                varH = naturalHeight / (window.innerHeight - top);

            if (varW > varH) {
                wI = window.innerWidth - 30;
                hI = naturalHeight / varW;
            } else {
                wI = naturalWidth / varH;
                hI = window.innerHeight - top;
            }
            $('#mapaMultimedia-' + instance).css('height', hI + 'px');
        } else {
            $('#mapaMultimedia-' + instance).css({
                'max-width': '700px'
            });
            wp = $('#mapaMultimedia-' + instance).width();
            wI = wp;
            hI = Math.round((wI / naturalWidth) * naturalHeight);
            if (window.innerWidth > window.innerHeight) {
                if (hI > wp) {
                    var s1 = hI / wp;
                    wI = Math.round(wI / s1);
                    hI = wp;
                }
            }
            $('#mapaMultimedia-' + instance).height(hI);
        }
        var lf = Math.round((wp - wI) / 2);
        $(image).css({
            'top': '0',
            'left': lf + 'px',
            'width': Math.round(wI) + 'px',
            'height': Math.round(hI) + 'px'
        });
        if (mOptions.evaluation == 1) {
            $('#mapaImageRect-' + instance).css({
                'width': Math.round(wI) + 'px',
                'height': Math.round(hI) + 'px'
            });
        }
    },
    setHeightContainer: function (instance) {
        var top = $('#mapaToolBar-' + instance).height() + 16;
        top = $('#mapaMessageFind-' + instance).is(":visible") ? top + $('#mapaMessageFind-' + instance).height() : top;
        top = $('#mapaGameClue-' + instance).is(":visible") ? top + $('#mapaGameClue-' + instance).height() : top;
    },
    isFullScreen: function () {
        var isFull = !(!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement);
        return isFull;
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
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $eXeMapa.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $eXeMapa.getURLAudioMediaTeca(urlmedia);
        }
        return sUrl;
    }
};
$(function () {
    $eXeMapa.init();
});