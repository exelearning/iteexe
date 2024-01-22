/**
 * Select Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 * Versión: 3.1
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Itinerary Activity'),
        alt: _('Itinerary')
    },
    iDevicePath: "/scripts/idevices/itinerario-activity/edition/",
    msgs: {},
    active: 0,
    selectsGame: [],
    youtubeLoaded: false,
    player: '',
    playerIntro: '',
    timeUpdateInterval: '',
    timeUpdateVIInterval: '',
    timeVideoFocus: 0,
    timeVIFocus: true,
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    activeSilent: false,
    silentVideo: 0,
    tSilentVideo: 0,
    endSilent: 0,
    isVideoType: false,
    isVideoIntro: 0,
    idevicesTitleState: [],
    collapsedIdi: [],
    activeIti: 0,
    activeEvaluation: 0,
    points: [0, 2.5, 5, 7.5, 10, 10, 10],
    messagesItineraries: ["", "", "", "", "", "", ""],
    activePoint: 0,
    numItineraries: 7,
    elementType: -1,
    ci18n: {
        "msgSubmit": _("Submit"),
        "msgErrors": _("Errors"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time per question"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgCool": _("Cool!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgNotNetwork": _("You can only play this game with internet connection."),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Check"),
        "msgAuthor": _("Author"),
        "msgVideoIntro": _("Video Intro"),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgLoading": _("Loading. Please wait..."),
        "msgOrders": _("Please order the answers"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgMoveOne": _("Move on"),
        "msgPoints": _("points"),
        "msgAudio": _("Audio"),
        "msgFirst": _("First"),
        "msgPrevious": _("Previous"),
        "msgNext": _("Next"),
        "msgLast": _("Last"),
        "msgAccessCode": _("Access code"),
        "msgNode": _("Mensaje para el editor: Este iDevice permite configurar el comportamiento de los iDevices en esta página. En previsualización o exportado no será visible."),
        "msgNotRepeat": _("Ya has realizado esta prueba. No puedes repetirla."),
        "msgRepeat": _("Has completado esta prueba. Puedes repetirla cuando desees."),
        "msgRepeatCode": _("Has completado esta prueba. Para poder repetirla necesitarás un código de acceso."),
        "msgGameOver": _("Has finalizado la actividad"),
        "msgNewGame": _("Pulsa aquí para repetirlo"),
        "msgPlayStart": _("Pulsa aquí para comenzar"),
        "msgAllQuestions": _("¡Has completado el test!")
    },

    init: function () {
        this.setMessagesInfo();
        this.createForm();
    },

    enableForm: function (field) {
        $exeDevice.initQuestions();
        $exeDevice.readIdevicesPage();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.readIdevicesCollapsed();
        $exeDevice.addEvents();
    },
    addDragableToDiv: function () {
        var dt = '.ITNE-IDeviceTitleDiv';
        $('#gameQEIdeviceForm .sortable').each(function () {
            $(this).sortable('destroy');
        });
        $('.ITNE-IDeviceTitleDiv').each(function (i) {
            var $this = $(this);
            $this.css('cursor', 'pointer');
            $this.draggable({
                revert: true,
                placeholder: true,
                droptarget: dt,
                drop: function (evt, droptarget) {
                    $exeDevice.moveTitle($(this), droptarget)
                }
            });
        });

    },

    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("Please provide the word definition or the valid URL of an image");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEProvideWord = _("Please provide one word or phrase");
        msgs.msgStartWith = _("Starts with %1");
        msgs.msgContaint = _("Contains letter %1");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Type the right URL of a Youtube video");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgSilentPoint = _("The silence time is wrong. Check the video duration.");
        msgs.msgTypeChoose = _("Please check all the answers in the right order");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideSolution = _("Please write the solution");
        msgs.msgEDefintion = _("Please provide the word definition");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNotHitCuestion = _('The question marked as next in case of success does not exist.');
        msgs.msgNotErrorCuestion = _('The question marked as next in case of error does not exist.');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgProvideMessageCode = _("Debes proporcionar el código y el mensaje de acceso");
        msgs.msgOnlyOneIdevice = _("Sólo puedes añadir un iDevice tipo Itinerario por página");
    },
    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $exeDevice.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },

    youTubeReady: function () {
        $exeDevice.player = new YT.Player('itnEVideo', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 1,
                'controls': 1
            },
            events: {
                'onReady': $exeDevice.onPlayerReady,
                'onError': $exeDevice.onPlayerError
            }
        });
        $exeDevice.playerIntro = new YT.Player('itnEVI', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 1
            },
            events: {
                'onReady': $exeDevice.onPlayerReady,
                'onError': $exeDevice.onPlayerError
            }

        });
    },

    onPlayerReady: function (event) {
        if ($exeDevice.isVideoType) {
            $exeDevice.showVideoQuestion();
        } else if ($exeDevice.isVideoIntro == 1) {
            $('#itnEVideoIntroPlay').click();
            var idv = $exeDevice.getIDYoutube($('#itnEVideoIntro').val()),
                iVI = $exeDevice.hourToSeconds($('#itnEVIStart').val()),
                fVI = $exeDevice.hourToSeconds($('#itnEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#itnEVIEnd').val()) : 9000;
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            $('#itnEVIURL').val($('#itnEVideoIntro').val());
            $('#itnEVIDiv').show();
            $('#itnEVI').show();
            $('#itnEVINo').hide();
            $('#itnENumQuestionDiv').hide();
            $exeDevice.startVideoIntro(idv, iVI, fVI, 0);
        } else if ($exeDevice.isVideoIntro == 2) {
            var idv = $exeDevice.getIDYoutube($('#itnEVIURL').val()),
                iVI = $exeDevice.hourToSeconds($('#itnEVIStart').val()),
                fVI = $exeDevice.hourToSeconds($('#itnEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#itnEVIEnd').val()) : 9000;
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            $exeDevice.startVideoIntro(idv, iVI, fVI);
        }
    },

    updateSoundVideo: function () {
        if ($exeDevice.activeSilent) {
            if ($exeDevice.player && typeof $exeDevice.player.getCurrentTime === "function") {
                var time = Math.round($exeDevice.player.getCurrentTime());
                if (time == $exeDevice.silentVideo) {
                    $exeDevice.player.mute();
                } else if (time == $exeDevice.endSilent) {
                    $exeDevice.player.unMute();
                }
            }
        }
    },

    updateSoundVideoLocal: function () {
        if ($exeDevice.activeSilent) {
            if ($exeDevice.localPlayer) {
                if ($exeDevice.localPlayer.currentTime) {
                    var time = Math.round($exeDevice.localPlayer.currentTime);
                    if (time == $exeDevice.silentVideo) {
                        $exeDevice.localPlayer.muted = true;
                    } else if (time == $exeDevice.endSilent) {
                        $exeDevice.localPlayer.muted = false;
                    }
                }
            }
        }
    },

    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#itnEVideoTime').text(time);
                $exeDevice.updateSoundVideo();
            }
        }
    },
    updateTimerDisplayLocal: function () {
        if ($exeDevice.localPlayer) {
            var currentTime = $exeDevice.localPlayer.currentTime;
            if (currentTime) {
                var time = $exeDevice.secondsToHour(Math.floor(currentTime));
                $('#itnEVideoTime').text(time);
                $exeDevice.updateSoundVideoLocal();
                if (Math.ceil(currentTime) == $exeDevice.pointEnd || Math.ceil(currentTime) == $exeDevice.durationVideo) {
                    $exeDevice.localPlayer.pause();
                    $exeDevice.pointEnd = 100000;
                }
            }
        }
    },

    updateTimerVIDisplay: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.playerIntro.getCurrentTime());
                $('#itnEVITime').text(time);
            }
        }
    },

    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },

    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video itndo no está disponible")
    },

    startVideo: function (id, start, end, type) {
        var mstart = start < 1 ? 0.1 : start;
        if (type > 0) {
            if ($exeDevice.localPlayer) {
                $exeDevice.pointEnd = end;
                $exeDevice.localPlayer.src = id
                $exeDevice.localPlayer.currentTime = parseFloat(mstart)
                $exeDevice.localPlayer.play();
            }
            clearInterval($exeDevice.timeUpdateInterval);
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplayLocal();
            }, 1000);
            return
        }
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.loadVideoById === "function") {
                $exeDevice.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
            clearInterval($exeDevice.timeUpdateInterval);
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplay();
            }, 1000);
        }

    },

    startVideoIntro: function (id, start, end, type) {
        var mstart = start < 1 ? 0.1 : start;
        $('#itnEVI').hide();
        $('#itnEVILocal').hide();
        if (type > 0) {
            if ($exeDevice.localPlayerIntro) {
                $exeDevice.pointEndIntro = end;
                $exeDevice.localPlayerIntro.src = id
                $exeDevice.localPlayerIntro.currentTime = parseFloat(start)
                $exeDevice.localPlayerIntro.play();
            }
            clearInterval($exeDevice.timeUpdateVIInterval);
            $exeDevice.timeUpdateVIInterval = setInterval(function () {
                $exeDevice.updateTimerDisplayVILocal();
            }, 1000);
            $('#itnEVILocal').show();
            return
        }
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.loadVideoById === "function") {
                $exeDevice.playerIntro.loadVideoById({
                    'videoId': id,
                    'startSeconds': mstart,
                    'endSeconds': end
                });
            }
            clearInterval($exeDevice.timeUpdateVIInterval);
            $exeDevice.timeUpdateVIInterval = setInterval(function () {
                $exeDevice.updateTimerVIDisplay();
            }, 1000);
            $('#itnEVI').show();
        }
    },

    stopVideoIntro: function () {
        if ($exeDevice.localPlayerIntro) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.localPlayerIntro.pause == "function") {
                $exeDevice.localPlayerIntro.pause();
            }
        }
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.pauseVideo === "function") {
                $exeDevice.playerIntro.pauseVideo();
            }
            clearInterval($exeDevice.timeUpdateInterval);
        }
    },
    playVideoQuestion: function () {
        if ($exeDevice.getIDYoutube($('#itnEURLYoutube').val().trim())) {
            if (typeof YT == "undefined") {
                $exeDevice.isVideoType = true;
                $exeDevice.loadYoutubeApi();
            } else {
                $exeDevice.showVideoQuestion();
            }
        } else if ($exeDevice.getURLVideoMediaTeca($('#itnEURLYoutube').val().trim())) {
            $exeDevice.showVideoQuestion();
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
        }
    },
    playVideo: function () {
        if ($exeDevice.player) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.player.playVideo === "function") {
                $exeDevice.player.playVideo();
            }
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplay();
            }, 1000);
        }
    },
    playVideoIntro1: function () {
        var idv = $exeDevice.getIDYoutube($('#itnEVideoIntro').val()),
            idmt = $exeDevice.getURLVideoMediaTeca($('#itnEVideoIntro').val()),
            iVI = $exeDevice.hourToSeconds($('#itnEVIStart').val()),
            fVI = $exeDevice.hourToSeconds($('#itnEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#itnEVIEnd').val()) : 9000;
        if (idv || idmt) {
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            if (idv) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoIntro = 1;
                    $exeDevice.loadYoutubeApi();
                    return;
                } else {
                    $('#itnEVI').show();
                    $exeDevice.startVideoIntro(idv, iVI, fVI, 0);
                }
            } else {
                $exeDevice.startVideoIntro(idmt, iVI, fVI, 1);
            }
            $('#itnEVIURL').val($('#itnEVideoIntro').val());
            $('#itnEVIDiv').show();
            $('#itnEVINo').hide();
            $('#itnENumQuestionDiv').hide();
        } else {
            $('#itnEVINo').show();
            $('#itnEVI').hide();
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
        }
    },
    playVideoIntro2: function () {
        var idv = $exeDevice.getIDYoutube($('#itnEVIURL').val()),
            idmt = $exeDevice.getURLVideoMediaTeca($('#itnEVIURL').val()),
            iVI = $exeDevice.hourToSeconds($('#itnEVIStart').val()),
            fVI = $exeDevice.hourToSeconds($('#itnEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#itnEVIEnd').val()) : 9000;
        if (idv || idmt) {
            if (fVI <= iVI) {
                $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                return;
            }
            if (idv) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoIntro = 1;
                    $exeDevice.loadYoutubeApi();
                    return;
                } else {
                    $exeDevice.startVideoIntro(idv, iVI, fVI, 0);
                }
            } else {
                $exeDevice.startVideoIntro(idmt, iVI, fVI, 1);
            }

        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
        }

    },
    stopVideo: function () {
        if ($exeDevice.localPlayer) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.localPlayer.pause == "function") {
                $exeDevice.localPlayer.pause();
            }
        }
        if ($exeDevice.player) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.player.pauseVideo === "function") {
                $exeDevice.player.pauseVideo();
            }
        }
    },


    muteVideo: function (mute) {
        if ($exeDevice.localPlayer) {
            if (mute) {
                $exeDevice.localPlayer.muted = true;
            } else {
                $exeDevice.localPlayer.muted = false;
            }
        }
        if ($exeDevice.player) {
            if (mute) {
                if (typeof $exeDevice.player.mute === "function") {
                    $exeDevice.player.mute();
                }
            } else {
                if (typeof $exeDevice.player.unMute === "function") {
                    $exeDevice.player.unMute();
                }
            }
        }
    },

    playSound: function (selectedFile) {
        var selectFile = $exeDevice.extractURLGD(selectedFile);
        $exeDevice.playerAudio = new Audio(selectFile);
        $exeDevice.playerAudio.addEventListener("canplaythrough", function (event) {
            $exeDevice.playerAudio.play();
        });
    },

    stopSound() {
        if ($exeDevice.playerAudio && typeof $exeDevice.playerAudio.pause == "function") {
            $exeDevice.playerAudio.pause();
        }
    },

    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.selectsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.selectsGame.length - 1;
            $exeDevice.typeEdit = -1;
            $('#itnEPaste').hide();
            $('#itnENumQuestions').text($exeDevice.selectsGame.length);
            $('#itnENumberQuestion').val($exeDevice.selectsGame.length);

        }
    },

    removeQuestion: function () {
        if ($exeDevice.selectsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.selectsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.selectsGame.length - 1) {
                $exeDevice.active = $exeDevice.selectsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#itnEPaste').hide();
            $('#itnENumQuestions').text($exeDevice.selectsGame.length);
            $('#itnENumberQuestion').val($exeDevice.active + 1);

        }
    },

    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.selectsGame[$exeDevice.active];
            $('#itnEPaste').show();

        }
    },

    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#itnEPaste').show();
        }
    },

    arrayMove: function (arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            var k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    },

    pasteQuestion: function () {
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            $exeDevice.selectsGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#itnEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.selectsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#itnENumQuestions').text($exeDevice.selectsGame.length);
        }

    },

    nextQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.selectsGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.selectsGame.length - 1) {
                $exeDevice.active = $exeDevice.selectsGame.length - 1;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    previousQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active > 0) {
                $exeDevice.active--;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    firstQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active > 0) {
                $exeDevice.active = 0;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#itnEPercentajeQuestions').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.selectsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#itnENumeroPercentaje').text(num + "/" + $exeDevice.selectsGame.length);
    },
    showQuestion: function (i) {
        $exeDevice.clearQuestion();
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.selectsGame.length ? $exeDevice.selectsGame.length - 1 : num;
        var p = $exeDevice.selectsGame[num],
            numOptions = 0;
        if (p.typeSelect != 2) {
            $('.ITNE-EAnwersOptions').each(function (j) {
                numOptions++;
                if (p.options[j].trim() !== '') {
                    p.numOptions = numOptions;
                }
                $(this).val(p.options[j]);
            });
        } else {
            $('#itnESolutionWord').val(p.solutionQuestion);
            $('#itnPercentageShow').val(p.percentageShow);
            $('#itnEDefinitionWord').val(p.quextion);
        }
        $exeDevice.stopVideo();
        $exeDevice.showTypeQuestion(p.typeSelect);
        $exeDevice.changeTypeQuestion(p.type);
        $exeDevice.showOptions(p.numberOptions);
        $('#itnEQuestion').val(p.quextion);
        $('#itnENumQuestions').text($exeDevice.selectsGame.length);
        if (p.type == 1) {
            $('#itnEURLImage').val(p.url);
            $('#itnEXImage').val(p.x);
            $('#itnEYImage').val(p.y);
            $('#itnEAuthor').val(p.author);
            $('#itnEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#itnECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#itnECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#itnEURLYoutube').val(p.url);
            $('#itnEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#itnEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $('#itnESilenceVideo').val($exeDevice.secondsToHour(p.silentVideo));
            $('#itnETimeSilence').val(p.tSilentVideo);
            $exeDevice.silentVideo = p.silentVideo;
            $exeDevice.tSilentVideo = p.tSilentVideo;
            $exeDevice.activeSilent = (p.soundVideo == 1) && (p.tSilentVideo > 0) && (p.silentVideo >= p.iVideo) && (p.iVideo < p.fVideo);
            $exeDevice.endSilent = p.silentVideo + p.tSilentVideo;
            if ($exeDevice.getIDYoutube(p.url)) {
                if (typeof YT == "undefined") {
                    $exeDevice.isVideoType = true;
                    $exeDevice.loadYoutubeApi();
                } else {
                    $exeDevice.showVideoQuestion();
                }
            } else if ($exeDevice.getURLVideoMediaTeca(p.url)) {
                $exeDevice.showVideoQuestion();
            }

        } else if (p.type == 3) {
            if (tinyMCE.get('itnEText')) {
                tinyMCE.get('itnEText').setContent(unescape(p.eText));
            } else {
                $('#itnEText').val(unescape(p.eText))
            }

        }

        $('.ITNE-EAnwersOptions').each(function (j) {
            var option = j < p.numOptions ? p.options[j] : '';
            $(this).val(option);
        });
        p.audio = p.audio && p.audio != "undefined" ? p.audio : "";
        $exeDevice.stopSound();
        if (p.type != 2 && p.audio.trim().length > 4) {
            $exeDevice.playSound(p.audio.trim());
        }
        $('#itnEURLAudio').val(p.audio);
        $('#itnENumberQuestion').val(i + 1);
        $('#itnEScoreQuestion').val(1);
        if (typeof (p.customScore) != "undefined") {
            $('#itnEScoreQuestion').val(p.customScore);
        }
        $("input.ITNE-Number[name='itinumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.ITNE-MediaType[name='itimediatype'][value='" + p.type + "']").prop("checked", true);
        $exeDevice.checkQuestions(p.solution);
        $("input.ITNE-Times[name='ititime'][value='" + p.time + "']").prop("checked", true);
        $("input.ITNE-SelectType[name='itiselecttype'][value='" + p.typeSelect + "']").prop("checked", true);
    },
    checkQuestions: function (solution) {
        $("input.ITNE-ESolution[name='itisolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $("input.ITNE-ESolution[name='itisolution'][value='" + sol + "']").prop("checked", true);
        }
        $('#itnESolutionSelect').text(solution);

    },
    showVideoYoutube: function (quextion) {
        var id = $exeDevice.getIDYoutube(quextion.url);
        $('#itnEImageVideo').hide();
        $('#itnENoVideo').hide();
        $('#itnEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, quextion.iVideo, quextion.fVideo);
            $('#itnEVideo').show();
            if (quextion.imageVideo == 0) {
                $('#itnEImageVideo').show();
            }
            if (quextion.soundVideo == 0) {
                $('#itnEImageVideo').show();
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgEUnavailableVideo);
            $('#itnENoVideo').show();
        }
    },
    showVideoQuestion: function () {
        var soundVideo = $('#itnECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#itnECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#itnEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#itnEEndVideo').val()),
            url = $('#itnEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        $exeDevice.silentVideo = $exeDevice.hourToSeconds($('#itnESilenceVideo').val().trim());
        $exeDevice.tSilentVideo = parseInt($('#itnETimeSilence').val());
        $exeDevice.activeSilent = (soundVideo == 1) && ($exeDevice.tSilentVideo > 0) && ($exeDevice.silentVideo >= iVideo) && (iVideo < fVideo);
        $exeDevice.endSilent = $exeDevice.silentVideo + $exeDevice.tSilentVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#itnENoImageVideo').hide();
        $('#itnENoVideo').show();
        $('#itnEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#itnEVideo').show();
            $('#itnENoVideo').hide();
            if (imageVideo == 0) {
                $('#itnEVideo').hide();
                $('#itnENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgEUnavailableVideo);
            $('#itnENoVideo').show();
        }
    },

    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },

    showImage: function (url, x, y, alt, type) {
        var $image = $('#itnEImage'),
            $cursor = $('#itnECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#itnENoImage').show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    if (type == 1) {
                        $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                    }
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $('#itnENoImage').hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
                    return true;
                }
            }).on('error', function () {
                if (type == 1) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                }
                return false;
            });
    },

    paintMouse: function (image, cursor, x, y) {
        $(cursor).hide();
        if (x > 0 || y > 0) {
            var wI = $(image).width() > 0 ? $(image).width() : 1,
                hI = $(image).height() > 0 ? $(image).height() : 1,
                lI = $(image).position().left + (wI * x),
                tI = $(image).position().top + (hI * y);
            $(cursor).css({
                left: lI + 'px',
                top: tI + 'px',
                'z-index': 3000
            });
            $(cursor).show();
        }
    },
    clearQuestion: function () {
        $exeDevice.changeTypeQuestion(0);
        $exeDevice.showOptions(4);
        $exeDevice.showSolution('');
        $('.ITNE-Times')[0].checked = true;
        $('.ITNE-Number')[2].checked = true;
        $('#itnEURLImage').val('');
        $('#itnEXImage').val('0');
        $('#itnEYImage').val('0');
        $('#itnEAuthor').val('');
        $('#itnEAlt').val('');
        $('#itnEURLAudio').val('');
        $('#itnEURLYoutube').val('');
        $('#itnEInitVideo').val('00:00:00');
        $('#itnEEndVideo').val('00:00:00');
        $('#itnECheckSoundVideo').prop('checked', true);
        $('#itnECheckImageVideo').prop('checked', true);
        $("input.ITNE-ESolution[name='itisolution']").prop("checked", false);
        $('#itnESolutionSelect').text('');
        if (tinyMCE.get('itnEText')) {
            tinyMCE.get('itnEText').setContent('');
        } else {
            $('#itnEText').val('')
        }

        $('#itnEQuestion').val('');
        $('#itnESolutionWord').val('');
        $('#itnEDefinitionWord').val('');
        $('.ITNE-EAnwersOptions').each(function () {
            $(this).val('');
        });
        $('#itnEMessageOK').val('');
        $('#itnEMessageKO').val('');
    },
    hourToSeconds: function (str) {
        var i = str.split(':');
        if (i.length == 0) {
            return 0;
        } else if (i.length == 1) {
            i = '00:00:' + i[0];
            i = i.split(':');
        } else if (i.length == 2) {
            i = '00:' + i[0] + ':' + i[1];
            i = i.split(':');
        }
        return (+i[0]) * 60 * 60 + (+i[1]) * 60 + (+i[2]);
    },
    secondsToHour: function (totalSec) {
        var time = Math.round(totalSec);
        var hours = parseInt(time / 3600) % 24;
        var minutes = parseInt(time / 60) % 60;
        var seconds = time % 60;
        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    },
    changeTypeQuestion: function (type) {

        $('#itnETitleAltImage').hide();
        $('#itnETitleImage').hide();
        $('#itnEInputImage').hide();
        $('#itnETitleVideo').hide();
        $('#itnEInputVideo').hide();
        $('#itnEInputOptionsVideo').hide();
        $('#itnInputOptionsImage').hide();
        if (tinyMCE.get('itnEText')) {
            tinyMCE.get('itnEText').hide();
        }
        $('#itnEText').hide();
        $('#itnEVideo').hide();
        $('#itnEImage').hide();
        $('#itnENoImage').hide();
        $('#itnECover').hide();
        $('#itnECursor').hide();
        $('#itnENoImageVideo').hide();
        $('#itnENoVideo').hide();
        switch (type) {
            case 0:
                $('#itnECover').show();
                break;
            case 1:
                $('#itnENoImage').show();
                $('#itnETitleImage').show();
                $('#itnEInputImage').show();
                $('#itnECursor').show();
                $('#itnInputOptionsImage').show();
                $exeDevice.showImage($('#itnEURLImage').val(), $('#itnEXImage').val(), $('#itnEYImage').val(), $('#itnEAlt').val(), 0)
                break;
            case 2:
                $('#itnEImageVideo').show();
                $('#itnETitleVideo').show();
                $('#itnEInputVideo').show();
                $('#itnENoVideo').show();
                $('#itnEVideo').show();
                $('#itnEInputOptionsVideo').show();
                $('#itnEInputAudio').hide();
                $('#itnETitleAudio').hide();
                break;
            case 3:
                $('#itnEText').show();
                if (tinyMCE.get('itnEText')) {
                    tinyMCE.get('itnEText').show();
                }
                break;
            default:
                break;
        }
    },
    showItinerarys: function (number) {
        $('.ITNE-ItinerarioName').each(function (j) {
            $(this).show();
            $('.ITNE-ItinerarioNameLB').eq(j).show();
            if (j >= number) {
                $(this).hide();
                $('.ITNE-ItinerarioNameLB').eq(j).hide();
            }
        });
    },
    showOptions: function (number) {
        $('.ITNE-EOptionDiv').each(function (i) {
            $(this).show();
            if (i >= number) {
                $(this).hide();
                $exeDevice.showSolution('');
            }

        });
        $('.ITNE-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },
    showSolution: function (solution) {
        $("input.ITNE-ESolution[name='itisolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $('.ITNE-ESolution')[solution].checked = true;
            $("input.ITNE-ESolution[name='itisolution'][value='" + sol + "']").prop("checked", true)
        }
        $('#itnESolutionSelect').text(solution);


    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">' + _("Permite definir itinerarios diferentes dentro de un elp en función de un prueba diagnóstica inicial.") + ' <a href="https://youtu.be/odJq4zF3-QE" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answers and click on the Check button.")) + '\
                        <fieldset class="exe-fieldset">\
                            <legend><a href="#">' + _("Itinerarios") + '</a></legend>\
                            <div>\
                                <p>\
                                    <a href="#" id="itnHelpLink0" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _('Help') + '"/></a><span id="itnEIDeviceType">' + _("Modo") + ':</span>\
                                    <input class="ITNE-IDeviceType" id="itnETest" type="radio" name="itidevicetype" value="1" />\
                                    <label for="itnETest">' + _("Prueba diagnóstica") + '</label>\
                                    <input class="ITNE-IDeviceType"  id="itnENode" type="radio" name="itidevicetype" value="2" />\
                                    <label for="itnENode">' + _("Nodo") + '</label>\
                                    <input class="ITNE-IDeviceType" checked id="itnNone" type="radio" name="itidevicetype" value="0" />\
                                    <label for="itnETest">' + _("Colapsar") + '</label>\
                                    <input class="ITNE-IDeviceType"  id="itnESlide" type="radio" name="itidevicetype" value="3" />\
                                    <label for="itnESlide">' + _("Presentación") + '</label>\
                                </p>\
                                <div id="itnHelp0" class="ITNE-TypeGameHelp">' + $exeDevice.getHelp(0) + '</div>\
                                <div class="ITNE-Flex1">\
                                    <div class="ITNE-PanelLeft" >\
                                        <p style="display:none;">\
                                            <label for="itnEShowMinimize"><input type="checkbox" id="itnEShowMinimize">' + _("Show minimized.") + '</label>\
                                        </p>\
                                        <p style="display:none;">\
                                            <label for="itnEAudioFeedBack"><input type="checkbox" id="itnEAudioFeedBack">' + _("Reproducir audio al mostrar la solución") + '.</label>\
                                        </p>\
                                        <p style="display:none;">\
                                            <label for="itnECustomScore"><input type="checkbox" id="itnECustomScore">' + _("Custom score") + '. </label>\
                                        </p>\
                                        <p id="itnEIEPasswordDiv" style="display:none;">\
                                            <a href="#" id="itnHelpLink1" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _('Help') + '"/></a><label for="itnEIEPassword">' + _('Identificador') + ':<input type="text" id="itnEIEPassword" value="' + $exeDevice.getID() + '"></label>\
                                            <a href="#" id="itnEReload" class="ITNE-ENavigationButton" title="' + _("Generar un nuevo identificador") + '"><img src="' + path + 'itnreload.png"  alt="' + _("Generar un nuevo identificador") + '" class="ITNE-EButtonImage" /></a>\
                                        </p>\
                                        <div id="itnHelp1" class="ITNE-TypeGameHelp">' + $exeDevice.getHelp(1) + '</div>\
                                        <p id="itnENumberDiv" style="display:none;">\
                                            <span id="itnItinerariosNumberSpan">' + _("Número de itinerarios") + ':</span>\
                                            <span class="ITNE-EInputNumbers" id="itnEInputNumbers" >\
                                                <input class="ITNE-NumberIT" id="numIT2" type="radio" name="itinumberite" value="3" />\
                                                <label for="numIT2">2</label>\
                                                <input class="ITNE-NumberIT" id="numIT3" type="radio" name="itinumberite" value="4" />\
                                                <label for="numIT3">3</label>\
                                                <input class="ITNE-NumberIT" id="numIT4" type="radio" name="itinumberite" value="5" checked />\
                                                <label for="numIT4">4</label>\
                                                <input class="ITNE-NumberIT" id="numIT5" type="radio" name="itinumberite" value="6"  />\
                                                <label for="numIT5">5</label>\
                                                <input class="ITNE-NumberIT" id="numIT6" type="radio" name="itinumberite" value="7" />\
                                                <label for="numIT6">6</label>\
                                            </span>\
                                        </p>\
                                        <p id="itnETypeDiv" style="display:none;">\
                                        <a href="#" id="itnHelpLink2" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _('Help') + '"/></a><span id="itnEType">' + _("Tipo de prueba diagnóstica") + ':</span>\
                                            <input class="ITNE-EvaluationType"  id="numOptionsMax" type="radio" name="itievaluation" value="0" />\
                                            <label for="numOptionsMax">' + _("Opción más frecuente") + '</label>\
                                            <input class="ITNE-EvaluationType" checked  id="numPuntuation" type="radio" name="itievaluation" value="1" />\
                                            <label for="numPuntuation">' + _("Score") + '</label>\
                                        </p>\
                                        <div id="itnHelp2" class="ITNE-TypeGameHelp">' + $exeDevice.getHelp(2) + '</div>\
                                        <p id="itnIntineraries" class="ITNE-Itineraries ITNF-Flex" style="display:none;">\
                                            <a href="#" id="itnHelpLink4" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _('Help') + '"/></a>\
                                            <span id="itnEItinerary">' + _("Los iDevices seleccionados se mostrarán") + ':</span>\
                                            <input class="ITNE-ItinerarioName" checked  id="iti0" type="radio" name="itiname" value="0" /><label class="ITNE-ItinerarioNameLB" for="iti0">Antes de la prueba</label> \
                                            <input class="ITNE-ItinerarioName" id="iti1" type="radio" name="itiname" value="1" /><label class="ITNE-ItinerarioNameLB" for="iti1">Itinerario A</label> \
                                            <input class="ITNE-ItinerarioName" id="iti2" type="radio" name="itiname" value="2" /><label class="ITNE-ItinerarioNameLB" for="iti2">Itinerario B</label> \
                                            <input class="ITNE-ItinerarioName" id="iti3" type="radio" name="itiname" value="3" /><label class="ITNE-ItinerarioNameLB" for="iti3">Itinerario C</label> \
                                            <input class="ITNE-ItinerarioName" id="iti4" type="radio" name="itiname" value="4" /><label class="ITNE-ItinerarioNameLB" for="iti4">Itinerario D</label> \
                                            <input class="ITNE-ItinerarioName" id="iti5" type="radio" name="itiname" value="5" /><label class="ITNE-ItinerarioNameLB" for="iti5">Itinerario E</label> \
                                            <input class="ITNE-ItinerarioName" id="iti6" type="radio" name="itiname" value="6" /><label class="ITNE-ItinerarioNameLB" for="iti6">Itinerario F</label> \
                                            <span id="itnPoints"style="display:none;">\
                                                <label for="itnEEPoint"></label><input type="number" name="itnEEPoint" id="itnEEPoint" value="0" min="0" max="10" step="0.1"/>\
                                            </span>\
                                        </p>\
                                        <div id="itnHelp4" class="ITNE-TypeGameHelp">' + $exeDevice.getHelp(4) + '</div>\
                                        <p id="itnMessageItineraries" style="display:none;">\
                                            <a href="#" id="itnHelpLink5" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _('Help') + '"/></a>\
                                            <label for="itnInputMessage">' + _("Mensaje") + ':</label><input type="text" id="itnInputMessage" />\
                                        </p>\
                                        <div id="itnHelp5" class="ITNE-TypeGameHelp">' + $exeDevice.getHelp(5) + '</div>\
                                        <p id="itnEHasFeedBackDiv" style="display:none;">\
                                            <label for="itnEHasFeedBack"><input type="checkbox"  id="itnEHasFeedBack"> ' + _("Feedback") + ': </label> \
                                        </p>\
                                        <p id="itnEFeedBackEditorDiv" class="ITNE-EFeedbackP" style="display:none;">\
                                            <textarea id="itnEFeedBackEditor" class="exe-html-editor"\></textarea>\
                                        </p>\
                                        <p id="itnRepeatDiv" style="display:none;">\
                                            <a href="#" id="itnHelpLink3" class="GameModeHelpLink" title="' + _('Help') + '"><img src="' + path + 'quextIEHelp.gif" width="16" height="16" alt="' + _('Help') + '"/></a><span>' + _("Repetir prueba diagnóstica") + ':</span>\
                                            <span class="ITNE-EInputTimes1">\
                                                <input class="ITNE-RepeatTest" checked="checked" id="itnRepeatNo" type="radio" name="itirepeat" value="0" />\
                                                <label for="ittRepeatNo">' + _("No") + '</label>\
                                                <input class="ITNE-RepeatTest" id="itnRepeatYes" type="radio" name="itirepeat" value="1" />\
                                                <label for="itnRepeatYes">' + _("Yes") + '</label>\
                                                <input class="ITNE-RepeatTest" id="itnRepeatCode" type="radio" name="itirepeat" value="2" />\
                                                <label for="itnRepeatCode">' + _("Código") + '</label>\
                                            </span>\
                                        </p>\
                                        <div id="itnHelp3" class="ITNE-TypeGameHelp ">' + $exeDevice.getHelp(3) + '</div>\
                                        <p class="ITNE-Flex" id="itnCodeTestDiv" style="display:none">\
                                            <label for="itnCodeTest">' + _("Código") + ':</label><input type="text" id="itnCodeTest" /><label for="itnMessageCodeTest">' + _("Mensaje") + ':</label><input type="text" id="itnMessageCodeTest" />\
                                        </p>\
                                        <p id="itnEShowSolutionDiv" style="display:none;">\
                                            <label for="itnEShowSolution"><input type="checkbox" checked id="itnEShowSolution">' + _("Show solutions") + '. </label>\
                                            <label for="itnETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="itnETimeShowSolution" id="itnETimeShowSolution" value="3" min="1" max="9" /> </label>\
                                        </p>\
                                        <p id="itnERandomQuestionsDiv" style="display:none;">\
                                            <label for="itnERandomQuestions"><input type="checkbox" id="itnERandomQuestions">' + _("Preguntas aleatorias") + '</label>\
                                        </p>\
                                        <p id="itnEUseTimeDiv" style="display:none;">\
                                            <label for="itnEUseTime"><input type="checkbox" id="itnEUseTime">' + _("Tiempo en las preguntas") + '. </label>\
                                        </p>\
                                        <p class="ITNE-Flex" id="intVideoIntroDiv" style="display:none;" >\
                                            <label for="itnEVideoIntro">' + _("Video Intro") + ':</label><input type="text" id="itnEVideoIntro" /><a href="#" class="ITNE-ButtonLink" id="itnEVideoIntroPlay"  title="' + _("Play video intro") + '"><img src="' + path + 'quextIEPlay.png"  alt="' + _("Play") + '" class="ITNE-EButtonImage" /></a>\
                                        </p>\
                                    </div>\
                                    <div id="itnPanelRight" class="ITNE-PanelRight" style="display:none;">\
                                      <div class="ITNE-TapsRightDiv" style="display:none;">\
                                           <a href="#" id="itnShowIdevices" class="GameModeHelpLink" title="' + _('Configurar el orden y la visibilidad de los menús') + '">' + _("IDevices") + '</a> \
                                           <a href="#" id="itnShowMenus" class="GameModeHelpLink" title="' + _('Configurar el orden y la visibilidad de los menús') + '">' + _("Menús") + '</a>\
                                      </div>\
                                    <div id="itnMessageIDevices" class="ITNE-MessagesIdevices">' + _("Se mostrarán siempre") + '</div>\
                                      <div id="itnIDevicesPageDiv" class="list ITNE-IDevicesPageDiv"></div>\
                                    </div>\
                                </div>\
                                <div id="itnQuestions" class="ITNE-QuestionsDiv" style="display:none;">\
                                    <div style="text-align:center; border-bottom:2px solid #ccc; padding-bottom:0.3em;">' + _("Questions") + '</div>\
                                    <div class="ITNE-EPanel" id="itnEPanel">\
                                        <div class="ITNE-EOptionsMedia">\
                                            <div class="ITNE-EOptionsGame">\
                                                <p id="itnTypeQuestionDiv">\
                                                    <span>' + _("Type") + ':</span>\
                                                    <span class="ITNE-EInputType">\
                                                        <input class="ITNE-SelectType" checked id="itnTypeChoose" type="radio" name="itiselecttype" value="0"/>\
                                                        <label for="itnSelectType">' + _("Select") + '</label>\
                                                        <input class="ITNE-SelectType"  id="itnTypeOrders" type="radio" name="itiselecttype" value="1"/>\
                                                        <label for="itnTypeOrders">' + _("Order") + '</label>\
                                                        <input class="ITNE-SelectType"  id="itnTypeWord" type="radio" name="itiselecttype" value="2"/>\
                                                        <label for="itnTypeWord">' + _("Word") + '</label>\
                                                    </span>\
                                                </p>\
                                                <p>\
                                                    <span>' + _("Multimedia Type") + ':</span>\
                                                    <span class="ITNE-EInputMedias">\
                                                        <input class="ITNE-MediaType" checked="checked" id="itnMediaNormal" type="radio" name="itimediatype" value="0" disabled />\
                                                        <label for="itnMediaNormal">' + _("None") + '</label>\
                                                        <input class="ITNE-MediaType"  id="itnMediaImage" type="radio" name="itimediatype" value="1" disabled />\
                                                        <label for="itnMediaImage">' + _("Image") + '</label>\
                                                        <input class="ITNE-MediaType"  id="itnMediaVideo" type="radio" name="itimediatype" value="2" disabled />\
                                                        <label for="itnMediaVideo">' + _("Video") + '</label>\
                                                        <input class="ITNE-MediaType"  id="itnMediaText" type="radio" name="itimediatype" value="3" disabled />\
                                                        <label for="itnMediaText">' + _("Text") + '</label>\
                                                    </span>\
                                                </p>\
                                                <p id="itnOptionsNumberDiv">\
                                                    <span id="itnOptionsNumberSpan">' + _("Options Number") + ':</span>\
                                                    <span class="ITNE-EInputNumbers" id="itnEInputNumbers" >\
                                                        <input class="ITNE-Number" id="numQ2" type="radio" name="itinumber" value="2" />\
                                                        <label for="numQ2">2</label>\
                                                        <input class="ITNE-Number" id="numQ3" type="radio" name="itinumber" value="3" />\
                                                        <label for="numQ3">3</label>\
                                                        <input class="ITNE-Number" id="numQ4" type="radio" name="itinumber" value="4" checked="checked" />\
                                                        <label for="numQ4">4</label>\
                                                        <input class="ITNE-Number" id="numQ5" type="radio" name="itinumber" value="5"  />\
                                                        <label for="numQ5">5</label>\
                                                        <input class="ITNE-Number" id="numQ6" type="radio" name="itinumber" value="6" />\
                                                        <label for="numQ6">6</label>\
                                                    </span>\
                                                </p>\
                                                <p id="itnPercentageDiv">\
                                                    <span id="itnPercentageSpan">' + _("Percentage of letters to show (%)") + ':</span>\
                                                    <span class="ITNE-EPercentage" id="itnPercentage">\
                                                        <input type="number" name="itnPercentageShow" id="itnPercentageShow" value="35" min="0" max="100" step="5" /> </label>\
                                                    </span>\
                                                </p>\
                                                <p id="itnEInputTimesDiv" style="display:none">\
                                                    <span>' + _("Time per question") + ':</span>\
                                                    <span class="ITNE-EInputTimes">\
                                                        <input class="ITNE-Times" checked="checked" id="q15s" type="radio" name="ititime" value="0" />\
                                                        <label for="q15s">15s</label>\
                                                        <input class="ITNE-Times" id="q30s" type="radio" name="ititime" value="1" />\
                                                        <label for="q30s">30s</label>\
                                                        <input class="ITNE-Times" id="q1m" type="radio" name="ititime" value="2" />\
                                                        <label for="q1m">1m</label>\
                                                        <input class="ITNE-Times" id="q3m" type="radio" name="ititime" value="3" />\
                                                        <label for="q3m">3m</label>\
                                                        <input class="ITNE-Times" id="q5m" type="radio" name="ititime" value="4" />\
                                                        <label for="q5m">5m</label>\
                                                        <input class="ITNE-Times" id="q10m" type="radio" name="ititime" value="5" />\
                                                        <label for="q10m">10m</label>\
                                                    </span>\
                                                <p>\
                                                <p id="itnEScoreQuestionDiv" class="ITNE-ScoreQuestionDiv">\
                                                    <label for="itnEScoreQuestion"><span>' + _("Score") + '</span>:</label><input type="number" name="itnEScoreQuestion" id="itnEScoreQuestion" value="1" min="0"  max="100" step="0.05"/>\
                                                </p>\
                                                <span class="ITNE-ETitleImage" id="itnETitleImage">' + _("Image URL") + ':</span>\
                                                <div class="ITNE-EInputImage ITNE-Flex" id="itnEInputImage">\
                                                    <label class="sr-av" for="itnEURLImage">' + _("Image URL") + '</label>\
                                                    <input type="text" class="exe-file-picker ITNE-EURLImage"  id="itnEURLImage"/>\
                                                    <a href="#" id="itnEPlayImage" class="ITNE-ENavigationButton ITNE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="ITNE-EButtonImage b-play" /></a>\
                                                    <a href="#" id="itnEShowMore" class="ITNE-ENavigationButton ITNE-EShowMore" title="' + _('More') + '"><img src="' + path + 'quextEIMore.png" alt="' + _('More') + '" class="ITNE-EButtonImage b-play" /></a>\
                                                </div>\
                                                <div class="ITNE-EAuthorAlt"  id="itnEAuthorAlt">\
                                                    <div class="ITNE-EInputAuthor">\
                                                        <label>' + _('Authorship') + '</label><input id="itnEAuthor" type="text"  class="ITNE-EAuthor" />\
                                                    </div>\
                                                    <div class="ITNE-EInputAlt">\
                                                        <label>' + _('Alt') + '</label><input  id="itnEAlt" type="text" class="IDFE-EAlt" />\
                                                    </div>\
                                                </div>\
                                                <div class="ITNE-EInputOptionsImage" id="itnInputOptionsImage">\
                                                    <div class="ITNE-ECoord">\
                                                        <label for="itnEXImage">X:</label>\
                                                        <input id="itnEXImage" type="text" value="0" />\
                                                        <label for="itnEXImage">Y:</label>\
                                                        <input id="itnEYImage" type="text" value="0" />\
                                                    </div>\
                                                </div>\
                                                <span class="ITNE-ETitleVideo" id="itnETitleVideo">' + _("Youtube URL") + ':</span>\
                                                <div class="ITNE-EInputVideo ITNE-Flex" id="itnEInputVideo">\
                                                    <label class="sr-av" for="itnEURLYoutube">' + _("Youtube URL") + '</label>\
                                                    <input id="itnEURLYoutube" type="text" />\
                                                    <a href="#" id="itnEPlayVideo" class="ITNE-ENavigationButton ITNE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play video") + '" class="ITNE-EButtonImage b-play" /></a>\
                                                </div>\
                                                <div class="ITNE-EInputOptionsVideo" id="itnEInputOptionsVideo">\
                                                    <div>\
                                                        <label for="itnEInitVideo">' + _("Start") + ':</label>\
                                                        <input id="itnEInitVideo" type="text" value="00:00:00" maxlength="8" />\
                                                        <label for="itnEEndVideo">' + _("End") + ':</label>\
                                                        <input id="itnEEndVideo" type="text" value="00:00:00" maxlength="8" />\
                                                        <button class="ITNE-EVideoTime" id="itnEVideoTime" type="button">00:00:00</button>\
                                                    </div>\
                                                    <div>\
                                                        <label for="itnESilenceVideo">' + _("Silence") + ':</label>\
                                                        <input id="itnESilenceVideo" type="text" value="00:00:00" maxlength="8" />\
                                                        <label for="itnETimeSilence">' + _("Time (s)") + ':</label>\
                                                        <input type="number" name="itnETimeSilence" id="itnETimeSilence" value="0" min="0" max="120" /> \
                                                    </div>\
                                                    <div>\
                                                        <label for="itnECheckSoundVideo">' + _("Audio") + ':</label>\
                                                        <input id="itnECheckSoundVideo" type="checkbox" checked="checked" />\
                                                        <label for="itnECheckImageVideo">' + _("Image") + ':</label>\
                                                        <input id="itnECheckImageVideo" type="checkbox" checked="checked" />\
                                                    </div>\
                                                </div>\
                                                <span id="itnETitleAudio">' + _("Audio") + ':</span>\
                                                <div class="ITNE-EInputAudio" id="itnEInputAudio">\
                                                    <label class="sr-av" for="itnEURLAudio">' + _("URL") + ':</label>\
                                                    <input type="text" class="exe-file-picker ITNE-EURLAudio"  id="itnEURLAudio"/>\
                                                    <a href="#" id="itnEPlayAudio" class="ITNE-ENavigationButton ITNE-EPlayVideo" title="' + _("Play audio") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play audio") + '" class="ITNE-EButtonImage b-play" /></a>\
                                                </div>\
                                            </div>\
                                            <div class="ITNE-EMultiMediaOption">\
                                                <div class="ITNE-EMultimedia" id="itnEMultimedia">\
                                                    <textarea id="itnEText"></textarea>\
                                                    <img class="ITNE-EMedia" src="' + path + 'quextIEImage.png"  id="itnEImage" alt="' + _("Image") + '" />\
                                                    <img class="ITNE-EMedia" src="' + path + 'quextIEImage.png"  id="itnENoImage" alt="' + _("No image") + '" />\
                                                    <div class="ITNE-EMedia" id="itnEVideo"></div>\
                                                    <img class="ITNE-EMedia" src="' + path + 'quextIENoImageVideo.png" id="itnENoImageVideo" alt="" />\
                                                    <img class="ITNE-EMedia" src="' + path + 'quextIENoVideo.png" id="itnENoVideo" alt="" />\
                                                    <img class="ITNE-ECursor" src="' + path + 'quextIECursor.gif" id="itnECursor" alt="" />\
                                                    <img class="ITNE-EMedia" src="' + path + 'quextIECoverItinerario.png" id="itnECover" alt="' + _("No image") + '" />\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="ITNE-EContents">\
                                            <div id="itnESolitionOptions"><span><span>' + _("Solution") + ':</span> </span><span id="itnESolutionSelect"></span></div>\
                                            <div class="ITNE-EQuestionDiv" id="itnEQuestionDiv">\
                                                    <label class="sr-av">' + _("Question") + ':</label><input type="text"  class="ITNE-EQuestion" id="itnEQuestion">\
                                            </div>\
                                            <div class="ITNE-EAnswers" id="itnEAnswers">\
                                                <div class="ITNE-EOptionDiv">\
                                                    <label class="sr-av">' + _("Solution") + ' A:</label><input type="checkbox" class="ITNE-ESolution" name="itisolution" id="itnESolution0" value="A" />\
                                                    <label >A</label><input type="text"  class="ITNE-EAnwersOptions" id="itnEOption0">\
                                                </div>\
                                                <div class="ITNE-EOptionDiv">\
                                                    <label class="sr-av">' + _("Solution") + ' B:</label><input type="checkbox" class="ITNE-ESolution" name="itisolution" id="itnESolution1" value="B" />\
                                                    <label >B</label><input type="text"  class="ITNE-EAnwersOptions"  id="itnEOption1">\
                                                </div>\
                                                <div class="ITNE-EOptionDiv">\
                                                    <label class="sr-av">' + _("Solution") + ' C:</label><input type="checkbox" class="ITNE-ESolution" name="itisolution" id="itnESolution2" value="C" />\
                                                    <label >C</label><input type="text"  class="ITNE-EAnwersOptions"  id="itnEOption2">\
                                                </div>\
                                                <div class="ITNE-EOptionDiv">\
                                                    <label class="sr-av">' + _("Solution") + ' D:</label><input type="checkbox"  class="ITNE-ESolution" name="itisolution" id="itnESolution3" value="D" />\
                                                    <label >D</label><input type="text" class="ITNE-EAnwersOptions"  id="itnEOption3">\
                                                </div>\
                                                <div class="ITNE-EOptionDiv">\
                                                    <label class="sr-av">' + _("Solution") + ' E:</label><input type="checkbox" class="ITNE-ESolution" name="itisolution" id="itnESolution4" value="E" />\
                                                    <label >E</label><input type="text"  class="ITNE-EAnwersOptions"  id="itnEOption4">\
                                                </div>\
                                                <div class="ITNE-EOptionDiv">\
                                                    <label class="sr-av">' + _("Solution") + ' F:</label><input type="checkbox"  class="ITNE-ESolution" name="itisolution" id="itnESolution5" value="F" />\
                                                    <label >F</label><input type="text"  class="ITNE-EAnwersOptions"  id="itnEOption5">\
                                                </div>\
                                            </div>\
                                            <div class="ITNE-EWordDiv ITNE-DP" id="itnEWordDiv">\
                                                <div class="ITNE-ESolutionWord"><label for="itnESolutionWord"><span>' + _("Word/Phrase") + ':</span> </label><input type="text"  id="itnESolutionWord"/></div>\
                                                <div class="ITNE-ESolutionWord"><label for="itnEDefinitionWord"><span>' + _("Definition") + ':</span> </label><input type="text"  id="itnEDefinitionWord"/></div>\
                                            </div>\
                                        </div>\
                                        <div class="ITNE-ENavigationButtons">\
                                            <a href="#" id="itnEAdd" class="ITNE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Add question") + '" class="ITNE-EButtonImage" /></a>\
                                            <a href="#" id="itnEFirst" class="ITNE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png" alt="' + _("First question") + '" class="ITNE-EButtonImage" /></a>\
                                            <a href="#" id="itnEPrevious" class="ITNE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="ITNE-EButtonImage" /></a>\
                                            <label class="sr-av" for="itnENumberQuestion">' + _("Question number:") + ':</label><input type="text" class="ITNE-NumberQuestion"  id="itnENumberQuestion" value="1"/>\
                                            <a href="#" id="itnENext" class="ITNE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="ITNE-EButtonImage" /></a>\
                                            <a href="#" id="itnELast" class="ITNE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="ITNE-EButtonImage" /></a>\
                                            <a href="#" id="itnEDelete" class="ITNE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png"  alt="' + _("Delete question") + '" class="ITNE-EButtonImage" /></a>\
                                            <a href="#" id="itnECopy" class="ITNE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png"  alt="' + _("Copy question") + '" class="ITNE-EButtonImage" /></a>\
                                            <a href="#" id="itnECut" class="ITNE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" alt="' + _("Cut question") + '"  class="ITNE-EButtonImage" /></a>\
                                            <a href="#" id="itnEPaste" class="ITNE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png"  alt="' + _("Paste question") + '" class="ITNE-EButtonImage" /></a>\
                                        </div>\
                                        <div class="ITNE-EVIDiv" id="itnEVIDiv">\
                                            <div class="ITNE-EVIV">\
                                                <div class="ITNE-EMVI">\
                                                    <div class="ITNE-EVI" id="itnEVI"></div>\
                                                    <img class="ITNE-ENoVI" src="' + path + "quextIENoVideo.png" + '" id="itnEVINo" alt="" />\
                                                </div>\
                                            </div>\
                                            <div class="ITNE-EVIOptions">\
                                                <label for="itnEVIURL">' + _("Youtube URL") + ':</label>\
                                                <input id="itnEVIURL" type="text" />\
                                                <a href="#" id="itnEVIPlayI" class="ITNE-ENavigationButton ITNE-EPlayVideo" title="' + _("Play video intro") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play video intro") + '" class="ITNE-EButtonImage b-playintro" /></a>\
                                                <label for="itnEVIStart">' + _("Start") + ':</label>\
                                                <input id="itnEVIStart" type="text" value="00:00:00" readonly />\
                                                <label for="itnEVIEnd">' + _("End") + ':</label>\
                                                <input id="itnEVIEnd" type="text" value="00:00:00" readonly />\
                                                <button class="ITNE-EVideoTime" id="itnEVITime" type="button">00:00:00</button>\
                                            </div>\
                                            <input type="button" class="ITNE-EVIClose" id="itnEVIClose" value="' + _("Close") + '" />\
                                        </div>\
                                        <div class="ITNE-ENumQuestionDiv" id="itnENumQuestionDiv">\
                                            <div class="ITNE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="ITNE-ENumQuestions" id="itnENumQuestions">0</span>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </fieldset>\
                        <fieldset class="exe-fieldset" id="itnIDevicesCollaseds">\
                            <legend><a href="#">' + _("Colapsados") + '</a></legend>\
                            <div>\
                                <span>' + _('Marca los iDevices que deseas mostrar colapsados en esta página') + '</span>\
                                <div id="itnCollapsedTable" class="ITNE-CollapsedTable">\
                                    <div id="itnCollasedColumn0" class="ITNE-CollasedColumn"></div>\
                                    <div id="itnCollasedColumn1" class="ITNE-CollasedColumn"></div>\
                                    <div id="itnCollasedColumn2" class="ITNE-CollasedColumn"></div>\
                                    <div id="itnCollasedColumn3" class="ITNE-CollasedColumn"></div>\
                                </div>\
                            </div>\
                        </fieldset>\
                    ' + $exeAuthoring.iDevice.common.getTextFieldset("after") + '\
                    </div>\
                    ' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
                    ' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
		        </div>\
			    ';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        //$exeDevice.loadYoutubeApi();
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        tinymce.init({
            selector: '#itnEText',
            height: 137,
            language: "all",
            width: 400,
            plugins: [
                'code paste textcolor'
            ],
            paste_as_text: true,
            entity_encoding: "raw",
            toolbar: 'undo redo | removeformat | fontselect | formatselect | fontsizeselect |  bold italic underline |  alignleft aligncenter alignright alignjustify | forecolor backcolor ',
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
            menubar: false,
            statusbar: false,
            setup: function (ed) {
                ed.on('init', function (e) {

                });
            }
        });

        $exeDevice.enableForm(field);

    },
    getChexboxChecked: function (checkboxes) {
        var checks = checkboxes.filter(':checked').map(function () {
            return $(this).val();
        }).get();
        return checks;
    },
    getChexboxOrder: function (checkboxes) {
        var checks = checkboxes.map(function () {
            return $(this).val();
        }).get();
        return checks;
    },
    getChexboxTitleState: function (checkboxes) {
        var checks = checkboxes.map(function () {
            var obj = {
                'title': $(this).val(),
                'state': $(this).is(':checked')
            }
            return obj;
        }).get();
        return checks;
    },

    updateTitles: function (array1, array2) {
        var result = [];
        $.each(array1, function (index1, obj1) {
            $.each(array2, function (index2, obj2) {
                if (obj1.title === obj2.title) {
                    result.push(obj1);
                    return false;
                }
            });
        });
        $.each(array2, function (index, obj) {
            var match = false;
            $.each(array1, function (index1, obj1) {
                if (obj.title === obj1.title) {
                    match = true;
                    return false;
                }
            });
            if (!match) {
                result.push(obj);
            }
        });
        return result;
    },
    readIdevicesCollapsed: function () {
        var idevices = [],
            nc = 0,
            td = _('Todos'),
            it = [td]
        idevices = $('.iDeviceTitle').map(function () {
            return $(this).text();
        }).get();
        idevices = it.concat(idevices);
        for (var i = 0; i < idevices.length; i++) {
            var itext = idevices[i],
                checkbox1 = '<p><label><input type="checkbox" data-number=' + i + 'name="iticollapsed" class="ITNE-CollapsedTitle" value="' + itext + '"/>' + itext + '<label></p>',
                $CollapsedColumn = $('#itnCollasedColumn' + nc);
            $CollapsedColumn.append(checkbox1);
            nc++;
            if (nc >= 4) {
                nc = 0;
            }
        }
        $exeDevice.updateCheckBoxCollapsed();
    },



    initQuestions: function () {
        $('#itnEInputImage').css('display', 'flex');
        $('#itnEInputVideo').css('display', 'flex');
        $("#itnMediaNormal").prop("disabled", false);
        $("#itnMediaImage").prop("disabled", false);
        $("#itnMediaText").prop("disabled", false);
        $("#itnMediaVideo").prop("disabled", false);
        $('#itnTypeQuestionDiv').hide();
        $('.ITNE-ESolution').hide();
        $('#itnGotoCorrect').hide();
        $('#itnGotoIncorrect').hide();
        $('label[for="itnGotoCorrect"]').hide();
        $('label[for="itnGotoIncorrect"]').hide();
        if ($exeDevice.selectsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.selectsGame.push(question);
            this.changeTypeQuestion(0)
            this.showOptions(4);
            this.showSolution('');
        }
        $exeDevice.showTypeQuestion(0);
        $exeDevice.showItinerarys(4)
        this.active = 0;
    },
    getCuestionDefault: function () {
        var p = new Object();
        p.typeSelect = 0;
        p.type = 0;
        p.time = 0;
        p.numberOptions = 4;
        p.url = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = "";
        p.soundVideo = 1;
        p.imageVideo = 1;
        p.iVideo = 0;
        p.fVideo = 0;
        p.eText = '';
        p.quextion = '';
        p.options = [];
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.solution = '';
        p.silentVideo = 0;
        p.tSilentVideo = 0;
        p.solutionWord = '';
        p.audio = '';
        p.hit = -1;
        p.error = -1;
        p.msgHit = '';
        p.msgError = '';
        return p;
    },
    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
    },
    loadPreviousValues: function (field) {

        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $exeDevice.Decrypt($('.itinerario-DataGame', wrapper).text()),
                version = $('.itinerario-version', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.itinerario-LinkImages', wrapper),
                $audiosLink = $('.itinerario-LinkAudios', wrapper);
            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.selectsGame.length) {
                    dataGame.selectsGame[iq].url = $(this).attr('href');
                    if (dataGame.selectsGame[iq].url.length < 4 && dataGame.selectsGame[iq].type == 1) {
                        dataGame.selectsGame[iq].url = "";
                    }
                }
            });
            var hasYoutube = false;
            for (var i = 0; i < dataGame.selectsGame.length; i++) {
                dataGame.selectsGame[i].audio = typeof dataGame.selectsGame[i].audio == "undefined" ? "" : dataGame.selectsGame[i].audio;
                if (i > 0 && dataGame.selectsGame[i].type == 2) {
                    hasYoutube = true;
                }
            }

            $audiosLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.selectsGame.length) {
                    dataGame.selectsGame[iq].audio = $(this).attr('href');
                    if (dataGame.selectsGame[iq].audio.length < 4) {
                        dataGame.selectsGame[iq].audio = "";
                    }
                }
            });
            $exeDevice.active = 0;
            var instructions = $(".itinerario-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }
            var textFeedBack = $(".itinerario-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('itnEFeedBackEditor')) {
                    tinyMCE.get('itnEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#itnEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".itinerario-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            if (hasYoutube) {
                $exeDevice.loadYoutubeApi();
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.updateFieldGame(dataGame);
        }
    },

    updateFieldGame: function (game) {
        $('#itnEShowMinimize').prop('checked', game.showMinimize);
        $('#itnEVideoIntro').val(game.idVideo);
        $('#itnEVIURL').val(game.idVideo);
        $('#itnEVIEnd').val($exeDevice.secondsToHour(game.endVideo));
        $('#itnEVIStart').val($exeDevice.secondsToHour(game.startVideo));
        $('#itnECustomScore').prop('checked', game.customScore);
        $('#itnEScoreQuestionDiv').hide();
        $("#itnEIEPassword").val(game.itenerayID);
        $('#itnEHasFeedBack').prop('checked', game.feedback);
        $('#itnEUseTime').prop('checked', game.useTime);
        $('#itnERandomQuestions').prop('checked', game.randomQuestions);
        $('#itnEShowSolution').prop('checked', game.showSolution);
        $('#itnETimeShowSolution').val(game.timeShowSolution)
        $('#itnETimeShowSolution').prop('disabled', !game.showSolution);
        $("input.ITNE-IDeviceType[name='itidevicetype'][value='" + game.ideviceType + "']").prop("checked", true)
        $("input.ITNE-NumberIT[name='itinumberite'][value='" + game.numItineraries + "']").prop("checked", true)
        for (var i = 0; i < game.itineraries.length; i++) {
            $exeDevice.idevicesTitleState[i] = $exeDevice.updateTitles(game.itineraries[i].idevices, $exeDevice.idevicesTitleState[i])
            $exeDevice.messagesItineraries[i] = game.itineraries[i].message;
        }

        $exeDevice.points = game.itinerayPoints;
        $exeDevice.activePoint = 0;
        $exeDevice.showRepeatTest(game.repeatTest);
        $exeDevice.active = 0;
        $exeDevice.activeIti = 0;
        $exeDevice.updateCheckBoxIti(0, 0);
        game.collapsedIdi = typeof game.collapsedIdi == "undefined" ? [] : game.collapsedIdi;
        $exeDevice.collapsedIdi = game.collapsedIdi;
        $exeDevice.updateCheckBoxCollapsed();
        $exeDevice.showItinerarys(game.numItineraries);
        $exeDevice.selectsGame = game.selectsGame;
        $("#itnCodeTest").val(game.codeTest);
        $("#itnMessageCodeTest").val(game.messageCodeTest);
        $exeDevice.updateEvaluationType(game.evaluationType, 0, game.ideviceType);
        $exeDevice.updateIDeviceType(game.ideviceType);
        $exeDevice.showTimesQuestions(game.useTime)
        $('#itnEHasFeedBack').prop('checked', game.feedback);
        $exeDevice.showQuestion($exeDevice.active);


    },
    updateIDeviceType: function (idtype) {
        $("input.ITNE-IDeviceType[name='itidevicetype'][value='" + idtype + "']").prop("checked", true);
        $('#itnEIEPasswordDiv').hide();
        $('#itnENumberDiv').hide();
        $('#itnETypeDiv').hide();
        $('#itnIntineraries').hide();
        $('#itnMessageItineraries').hide();
        $('#itnDescription').hide();
        $('#itnPanelRight').hide();
        $('#itnEUseTimeDiv').hide();
        $('#itnERandomQuestionsDiv').hide();
        $('#itnEShowSolutionDiv').hide();
        $('#itnEHasFeedBackDiv').hide();
        $('#itnEFeedBackEditorDiv').hide();
        $('#itnEReload').hide();
        $('#itnRepeatDiv').hide();
        $('#intVideoIntroDiv').hide();
        $('#itnQuestions').hide();
        $("#eXeIdeviceTextAfter").parents("fieldset").hide();
        $("#eXeGameInstructions").parents("fieldset").hide();
        $("#itnIDevicesCollaseds").addClass('exe-fieldset-closed');
        $("#itnIDevicesCollaseds").show();
        if (idtype == 0) {
            $("#itnIDevicesCollaseds").removeClass('exe-fieldset-closed');
        } else if (idtype == 1) {
            $('#itnEIEPasswordDiv').css('display', 'flex');
            $('#itnEIEPasswordDiv').show();
            $('#itnENumberDiv').show();
            $('#itnETypeDiv').show();
            $('#itnIntineraries').show();
            $('#itnDescription').show();
            $('#itnPanelRight').show();
            $('#itnEUseTimeDiv').show();
            $('#itnERandomQuestionsDiv').show();
            $('#itnEShowSolutionDiv').show();
            $('#itnEHasFeedBackDiv').show();
            $('#itnRepeatDiv').show();
            $('#intVideoIntroDiv').css('display', 'flex');
            $('#itnQuestions').show();
            $("#eXeIdeviceTextAfter").parents("fieldset").show();
            $("#eXeGameInstructions").parents("fieldset").show();
            $('#itnEHasFeedBackDiv').hide();
            $('#itnEFeedBackEditorDiv').hide();
            if ($('#itnEHasFeedBack').is(':checked')) {
                $('#itnEFeedBackEditorDiv').show();
            }
            $('#itnEReload').show();
            var repeat = parseInt($('input[name=itirepeat]:checked').val()),
                sm = parseInt($('input[name=itiname]:checked').val());
            if (sm > 0) {
                $('#itnMessageItineraries').css('display', 'flex');
            }
            $exeDevice.showRepeatTest(repeat);
            var et = parseInt($('input[name=itievaluation]:checked').val()),
                num = parseInt($('input[name=itiname]:checked').val());
            $exeDevice.updateEvaluationType(et, num, idtype);
            
        } else if (idtype == 2) {
            $('#itnEIEPasswordDiv').css('display', 'flex');
            $('#itnEIEPasswordDiv').show();
            $('#itnIntineraries').show();
            $('#itnENumberDiv').show();
            $('#itnPanelRight').show();
        } else if (idtype == 3) {
            $("#eXeGameInstructions").parents("fieldset").show();
            $("#itnIDevicesCollaseds").hide();
        }
    },
    updateEvaluationType: function (type, number, idt) {
        $("input.ITNE-EvaluationType[name='itievaluation'][value='" + type + "']").prop("checked", true);
        if (type == 1) {
            $('.ITNE-ESolution').show();
            $('#itnTypeQuestionDiv').show();
            if (number > 0 && idt == 1) {
                $('#itnPoints').show();
            }
        } else {
            $('.ITNE-ESolution').hide();
            $('#itnTypeQuestionDiv').hide();
            $exeDevice.changeTypeQuestion(0);
            $('#itnPoints').hide();
        }
    },
    updateIti: function () {
        var checkbosex = $("input.ITNE-IDeviceTitle");
        $exeDevice.idevicesTitleState[$exeDevice.activeIti] = $exeDevice.getChexboxTitleState(checkbosex);
    },
    updateCollapse: function (all) {
        $exeDevice.collapsedIdi = [];
        $("input.ITNE-CollapsedTitle").each(function (i) {
            if (all) {
                $(this).prop('checked', true)
            } else {
                if ($(this).val() == _('Todos')) {
                    $(this).prop('checked', false)
                }
            }
            if ($(this).is(":checked")) {
                $exeDevice.collapsedIdi.push($(this).val())
            }
        });
    },


    updateCheckBoxIti: function (number, evt, idt) {
        $exeDevice.activePoint = number;
        var tramos = ["Antes", "A", "B", "C", "D", "E", "F"],
            msg2 = _('Selecciona y ordena los idevices que se mostrarán antes de realizar la prueba diagnóstica');
        if (number > 0) {
            msg2 = _('Selecciona y ordena los idevices que se mostrarán en el itinerario %s').replace("%s", tramos[number]);
        }
        $('#itnMessageItineraries').hide();
        var ideviceType = parseInt($('input[name=itidevicetype]:checked').val());
        if (number > 0 && ideviceType==1) {
            $('#itnMessageItineraries').css('display', 'flex');
        }
        $("#itnMessageIDevices").text(msg2);
        $("#itnPoints").hide();
        if (evt == 1 && number > 0) {
            $("#itnPoints").show();
            $("#itnEEPoint").val($exeDevice.points[number]);
            var caption
            if (number >= $exeDevice.points.length) {
                caption = 'Puntuación > ' + $exeDevice.points[$exeDevice.points.length - 1] + ' <=';
            }
            caption = number == 0 ? "Puntuación >= 0 <" : "Puntuación >= " + $exeDevice.points[number - 1] + " <";
            if ($exeDevice.points[number] == 10) {
                caption = number == 0 ? "Puntuación >= 0 <" : "Puntuación >= " + $exeDevice.points[number - 1] + " <=";
            }
            $('label[for="itnEEPoint"]').text(caption);
        }
        $exeDevice.activeIti = number;
        $('#itnInputMessage').val($exeDevice.messagesItineraries[$exeDevice.activeIti])
        $('#itnEEPoint').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 2);
            this.value = v;
        });
        $('#itnEEPoint').on('focusout', function () {
            this.value = this.value.trim() == '' ? 10 : this.value;
            this.value = this.value > 10 ? 10 : this.value;
            this.value = this.value <= 0 ? 1 : this.value;
        });

        $exeDevice.reorganizeIdevices();

    },
    moveTitle: function ($item, target) {
        var $save = $item.prev('.ITNE-IDeviceTitleDiv');
        if ($save.data('order') == $(target).data('order')) {
            $item.insertBefore(target);
        } else {
            $item.insertAfter(target);
            if ($save) {
                $(target).insertAfter($save);
            } else {
                $('#itnIDevicesPageDiv').append($(target))
            }
        }
        var checkbosex = $("input.ITNE-IDeviceTitle");
        $exeDevice.idevicesTitleState[$exeDevice.activeIti] = $exeDevice.getChexboxTitleState(checkbosex);

    },
    reorganizeIdevices: function () {
        var idevices = $exeDevice.idevicesTitleState[$exeDevice.activeIti];
        if (idevices.length <= 0) return;

        var $IDevicePageDiv = $('#itnIDevicesPageDiv');
        $IDevicePageDiv.empty();
        for (var i = 0; i < idevices.length; i++) {
            var itext = idevices[i].title,
                state = idevices[i].state,
                checkbox = '<div class="ITNE-IDeviceTitleDiv" data-order=' + i + '><input type="checkbox" data-number=' + i + 'name="itititle" class="ITNE-IDeviceTitle" value="' + itext + '"/><label class="ITNE-IDeviceTitlelBL" >' + itext + '</label></div>';
            if (state) {
                checkbox = '<div class="ITNE-IDeviceTitleDiv" data-order=' + i + '><input type="checkbox" checked data-number=' + i + 'name="itititle" class="ITNE-IDeviceTitle" value="' + itext + '"/><label class="ITNE-IDeviceTitlelBL" >' + itext + '</label></div>';
            }
            $IDevicePageDiv.append(checkbox);
        }
        $exeDevice.addDragableToDiv()

    },
    readIdevicesPage: function () {
        var idevices = [],
            $IDevicePageDiv = $('#itnIDevicesPageDiv');
        idevices = $('.iDeviceTitle').map(function () {
            return $(this).text();
        }).get();
        if ($exeDevice.idevicesTitleState.length == 0) {
            for (var i = 0; i < $exeDevice.numItineraries; i++) {
                var grupo = [];
                for (var j = 0; j < idevices.length; j++) {
                    var obj = {
                        'title': idevices[j],
                        'state': false
                    }
                    grupo.push(obj)
                }
                $exeDevice.idevicesTitleState[i] = grupo.slice();
            }
        }

        for (var i = 0; i < idevices.length; i++) {
            var itext = idevices[i],
                checkbox = '<div class="ITNE-IDeviceTitleDiv" data-order=' + i + '><input type="checkbox" data-number=' + i + 'name="itititle" class="ITNE-IDeviceTitle" value="' + itext + '"/><label class="ITNE-IDeviceTitlelBL" >' + itext + '</label></div>';
            $IDevicePageDiv.append(checkbox);
        }
        $exeDevice.updateCheckBoxIti(0, 0);
    },
    getHelp: function (number) {
        var help = ''
        if (number == 0) {
            help = '<ul class="ITNE-HelpMessage">\
                <li><strong>' + _("Prueba diagnóstica") + ': </strong>' + _("Muestra un prueba tipo test de repuesta múltiple cuyo resultado definirá los iDevices que se mostrarán en las páginas con nodos de igual identificador.") + '</li>\
                <li><strong>' + _("Nodo") + ': </strong>' + _("Define el comportamiento de los iDevices de esta página en función del resultado obtenido en la prueba diagnóstica de igual identificador.") + '</li>\
                <li><strong>' + _("Colapsar") + ': </strong>' + _("Permite establecer que iDevices se mostrarán minimizados al cargarse la página.") + '</li>\
                <li><strong>' + _("Presentación") + ': </strong>' + _("Proporciona un conjunto de botones que permite controlar la visibilidad de los iDevices de esta página.") + '</li>\
            </ul>';
        } else if (number == 1) {
            help = help = '<p class="ITNE-HelpMessage">' + _("Debes indicar el mismo identificador en la prueba diagnóstica y en sus nodos asociados") + '</p>'
        } else if (number == 2) {
            help = '<ul class="ITNE-HelpMessage">\
                <li><strong>' + _("Opción más frecuente") + ': </strong>' + _("El itinerario dependerá de la opción seleccionada con más frecuencia en las respuestas de la prueba diagnóstica. No hay puntuación") + '</li>\
                <li><strong>' + _("Score") + ': </strong>' + _("El itinerario vendrá determinado por la puntuación obtenida en la prueba. Es necesario definir los intervalos de puntuación") + '</li>\
            </ul>';
        } else if (number == 3) {
            help = '<ul class="ITNE-HelpMessage">\
                <li><strong>' + _("No") + ': </strong>' + _("La prueba diagnóstica sólo se podrá realizar una vez. Una vez definido un itinerario, no se podrá cambiar.") + '</li>\
                <li><strong>' + _("Yes") + ': </strong>' + _("Se podrá realizar la prueba diagnóstica tantas veces como se desee. El itinerario se modificará en función de los nuevos resultados obtenidos.") + '</li>\
                <li><strong>' + _("Código") + ': </strong>' + _("La prueba diagnóstica se podrá repetir mediante la introducción de un código obtenido por medios externos: una pista de un juego.") + '</li>\
            </ul>';
        } else if (number == 4) {
            help = '<p class="ITNE-HelpMessage">' + _("En el panel de la derecha, selecciona los iDevices que se mostrarán en cada caso") + '</p>'
        } else if (number == 5) {
            help = '<p class="ITNE-HelpMessage">' + _("Escribe el mensaje que se mostrará al alumno en cada itinerario") + '</p>'

        }
        return help;
    },
    updateCheckBoxCollapsed: function () {
        $("input.ITNE-CollapsedTitle").each(function (i) {
            var title = $(this).val();
            $(this).prop('checked', false)
            if ($exeDevice.collapsedIdi.indexOf(title) != -1) {
                $(this).prop('checked', true)
            }

        });
    },
    updatePointValue: function (value) {
        if ($exeDevice.activePoint > 0 && $exeDevice.activePoint < $exeDevice.points.length) {
            $exeDevice.points[$exeDevice.activePoint] = value;
        }
    },
    showRepeatTest: function (type) {
        $("input.ITNE-RepeatTest[name='itirepeat'][value='" + type + "']").prop("checked", true);
        $('#itnCodeTestDiv').hide();
        if (type == 2) {
            $('#itnCodeTestDiv').show();
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
    getIDYoutube: function (url) {
        if (url) {
            var match = url.match(regExp);
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

    save: function () {
        var ideviceType = parseInt($('input[name=itidevicetype]:checked').val());
        if (ideviceType == 1 && !$exeDevice.validateQuestion()) {
            return false;
        }
        var dataGame = this.validateData();
        if (!dataGame) {
            return false;
        }
        var fields = this.ci18n,
            i18n = fields;
        for (var i in fields) {
            var fVal = $("#ci18n_" + i).val();
            if (fVal != "") i18n[i] = fVal;
        }
        dataGame.msgs = i18n;
        var json = JSON.stringify(dataGame),
            divContent = "";

        var instructions = $('#eXeGameInstructions').val();

        if (tinyMCE.get('eXeGameInstructions')) {
            instructions = tinyMCE.get('eXeGameInstructions').getContent();
        }
        if (instructions != "") {
            divContent = '<div class="itinerario-instructions gameQP-instructions">' + instructions + '</div>';
            if (ideviceType == 0 || ideviceType == 2 || ideviceType == 3) {
                divContent = '<div class="itinerario-instructions gameQP-instructions js-hidden">' + instructions + '</div>';
            }
        }
        var textFeedBack = $('#itnEFeedBackEditor').val(),
            linksImages = $exeDevice.createlinksImage(dataGame.selectsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.selectsGame),
            html = '<div class="itinerario-IDevice">';
        if (tinyMCE.get('itnEFeedBackEditor')) {
            textFeedBack = tinyMCE.get('itnEFeedBackEditor').getContent();
        }

        html += divContent;
        html += '<div class="itinerario-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="itinerario-feedback-game">' + textFeedBack + '</div>';
        html += '<div class="itinerario-DataGame js-hidden" >' + $exeDevice.Encrypt(json) + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = $('#eXeIdeviceTextAfter').val();
        if (tinyMCE.get('eXeIdeviceTextAfter')) {
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        }
        if (textAfter != "") {
            html += '<div class="itinerario-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="itinerario-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },
    Encrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        try {
            var key = 146;
            var pos = 0;
            var ostr = '';
            while (pos < str.length) {
                ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
                pos += 1;
            }
            return escape(ostr);
        } catch (ex) {
            return '';
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

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.type = parseInt($('input[name=itimediatype]:checked').val());
        p.time = parseInt($('input[name=ititime]:checked').val());
        p.numberOptions = parseInt($('input[name=itinumber]:checked').val());
        p.typeSelect = parseInt($('input[name=itiselecttype]:checked').val())
        p.x = parseFloat($('#itnEXImage').val());
        p.y = parseFloat($('#itnEYImage').val());;
        p.author = $('#itnEAuthor').val();
        p.alt = $('#itnEAlt').val();
        p.customScore = parseFloat($('#itnEScoreQuestion').val());
        p.url = $('#itnEURLImage').val().trim();
        p.audio = $('#itnEURLAudio').val();
        p.hit = parseInt($('#itnGotoCorrect').val());
        p.error = parseInt($('#itnGotoIncorrect').val());
        p.msgHit = $('#itnEMessageOK').val();
        p.msgError = $('#itnEMessageKO').val();
        $exeDevice.stopSound();
        $exeDevice.stopVideo();
        if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#itnEURLYoutube').val().trim()) ? $('#itnEURLYoutube').val() : '';
        }
        p.soundVideo = $('#itnECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#itnECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#itnEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#itnEEndVideo').val().trim());
        p.silentVideo = $exeDevice.hourToSeconds($('#itnESilenceVideo').val().trim());
        p.tSilentVideo = parseInt($('#itnETimeSilence').val());
        if (tinyMCE.get('itnEText')) {
            p.eText = tinyMCE.get('itnEText').getContent();
        } else {
            p.eText = $('#itnEText').val();
        }
        p.eText = tinyMCE.get('itnEText').getContent();
        p.quextion = $('#itnEQuestion').val().trim();
        p.options = [];
        p.solution = $('#itnESolutionSelect').text().trim();
        p.solutionQuestion = "";
        if (p.typeSelect == 2) {
            p.quextion = $('#itnEDefinitionWord').val().trim();
            p.solution = "";
            p.solutionQuestion = $('#itnESolutionWord').val();
        }
        p.percentageShow = parseInt($('#itnPercentageShow').val());
        var optionEmpy = false;
        var validExt = ['mp3', 'ogg', 'wav'],
            extaudio = p.audio.split('.').pop().toLowerCase();
        $('.ITNE-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            if (p.typeSelect == 2) {
                option = "";
            }
            p.options.push(option);
        });

        if (p.typeSelect == 1 && p.solution.length != p.numberOptions) {
            message = msgs.msgTypeChoose;
        } else if (p.typeSelect != 2 && p.quextion.length == 0) {
            message = msgs.msgECompleteQuestion;
        } else if (p.typeSelect != 2 && optionEmpy) {
            message = msgs.msgECompleteAllOptions
        } else if (p.type == 1 && p.url.length < 5) {
            message = msgs.msgEURLValid;
        } else if (p.type == 2 && p.url.length == 0) {
            message = msgs.msgECompleteURLYoutube;
        } else if (p.type == 2 && (p.iVideo.length == 0 || p.fVideo.length == 0)) {
            message = msgs.msgEStartEndVideo;
        } else if (p.type == 2 && p.iVideo >= p.fVideo) {
            message = msgs.msgEStartEndIncorrect;
        } else if (p.type == 3 && p.eText.length == 0) {
            message = msgs.msgWriteText;
        } else if (p.type == 2 && !$exeDevice.validTime($('#itnEInitVideo').val()) || !$exeDevice.validTime($('#itnEEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        } else if (p.type == 2 && p.tSilentVideo > 0 && !$exeDevice.validTime($('#itnESilenceVideo').val())) {
            message = msgs.msgTimeFormat;
        } else if (p.type == 2 && p.tSilentVideo > 0 && (p.silentVideo < p.iVideo || p.silentVideo >= p.fVideo)) {
            message = msgs.msgSilentPoint;
        } else if (p.typeSelect == 2 && p.solutionQuestion.trim().length == 0) {
            message = $exeDevice.msgs.msgEProvideWord;
        } else if (p.typeSelect == 2 && p.quextion.trim().length == 0) {
            message = $exeDevice.msgs.msgEDefintion;
        }

        if (message.length == 0) {
            $exeDevice.selectsGame[$exeDevice.active] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;

    },
    createlinksImage: function (selectsGame) {
        var html = '';
        for (var i = 0; i < selectsGame.length; i++) {
            var linkImage = '';
            if (selectsGame[i].type == 1 && !selectsGame[i].url.indexOf('http') == 0) {
                linkImage = '<a href="' + selectsGame[i].url + '" class="js-hidden itinerario-LinkImages">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },
    createlinksAudio: function (selectsGame) {
        var html = '';
        for (var i = 0; i < selectsGame.length; i++) {
            var linkaudio = '';
            if (selectsGame[i].type != 2 && !selectsGame[i].audio.indexOf('http') == 0 && selectsGame[i].audio.length > 4) {
                linkaudio = '<a href="' + selectsGame[i].audio + '" class="js-hidden itinerario-LinkAudios">' + i + '</a>';
            }
            html += linkaudio;
        }
        return html;
    },
    exportGame: function () {
        if (!$exeDevice.validateQuestion()) {
            return;
        }
        var dataGame = this.validateData();
        if (!dataGame) {
            return;
        }
        var blob = JSON.stringify(dataGame),
            newBlob = new Blob([blob], {
                type: "text/plain"
            });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = _("Game") + "Itinerario.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },

    importGameOld: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'Itinerario') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.selectsGame = game.selectsGame;
        for (var i = 0; i < $exeDevice.selectsGame.length; i++) {
            if (game.selectsGame[i].type == 3) {
                game.selectsGame[i].eText = unescape(game.selectsGame[i].eText);
            }
            var numOpt = 0,
                options = $exeDevice.selectsGame[i].options;
            for (var j = 0; j < options.length; j++) {
                if (options[j].trim().length == 0) {
                    $exeDevice.selectsGame[i].numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
        }
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "";
        tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        $('.exe-form-tabs li:first-child a').click();
    },
    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape($("#eXeGameInstructions").val()),
            textAfter = escape($("#eXeIdeviceTextAfter").val()),
            textFeedBack = escape($("#itnEFeedBackEditor").val()),
            feedback = $('#itnEHasFeedBack').is(':checked'),
            useTime = $('#itnEUseTime').is(':checked'),
            randomQuestions = $('#itnERandomQuestions').is(':checked'),
            showMinimize = $('#itnEShowMinimize').is(':checked'),
            showSolution = $('#itnEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#itnETimeShowSolution').val())),
            idVideo = $('#itnEVideoIntro').val(),
            endVideo = $exeDevice.hourToSeconds($('#itnEVIEnd').val()),
            startVideo = $exeDevice.hourToSeconds($('#itnEVIStart').val()),
            customScore = $('#itnECustomScore').is(':checked'),
            itineraries = [],
            itenerayID = $('#itnEIEPassword').val(),
            evaluationType = parseInt($('input[name=itievaluation]:checked').val()),
            numItineraries = parseInt($('input[name=itinumberite]:checked').val()),
            ideviceType = parseInt($('input[name=itidevicetype]:checked').val()),
            selectsGame = $exeDevice.selectsGame,
            repeatTest = parseInt($('input[name=itirepeat]:checked').val()),
            codeTest = $('#itnCodeTest').val(),
            messageCodeTest = $('#itnMessageCodeTest').val(),
            vali = -1,
            numIti = $('.ItinerarioIdevice').length,
            idevices = [];

        if (numIti > 1) {
            $exeDevice.showMessage($exeDevice.msgs.msgOnlyOneIdevice);
            return;
        }
        if (tinyMCE.get('eXeIdeviceTextAfter')) {
            textAfter = escape(tinyMCE.get('eXeIdeviceTextAfter').getContent())
        }
        if (tinyMCE.get('itnEFeedBackEditor')) {
            textFeedBack = escape(tinyMCE.get('itnEFeedBackEditor').getContent())
        } else {
            $("#itnEFeedBackEditor").val(textAfter)
        }
        if (tinyMCE.get('eXeGameInstructions')) {
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent())
        }
        if (ideviceType == 1 && evaluationType == 1) {
            for (var i = 0; i < $exeDevice.points; i++) {
                if (i < numItineraries) {
                    var val = $exeDevice.points[i]
                    if (val <= vali) {
                        $exeDevice.showMessage(_('Los intervalos de puntuación no son correctos'));
                        return false;
                    }
                    vali = val;
                }
            }
        }
        if (ideviceType == 1) {
            if (showSolution && timeShowSolution.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
                return false;
            }
            if (repeatTest == 2 && (codeTest.length == 0 || messageCodeTest.length == 0)) {
                $exeDevice.showMessage($exeDevice.msgs.msgProvideMessageCode);
                return false;
            }
            for (var i = 0; i < selectsGame.length; i++) {
                var mquestion = selectsGame[i]
                mquestion.customScore = typeof (mquestion.customScore) == "undefined" ? 1 : mquestion.customScore;
                if (mquestion.quextion.length == 0) {
                    $exeDevice.showMessage($exeDevice.msgs.msgECompleteQuestion);
                    return false;
                } else if ((mquestion.type == 1) && (mquestion.url.length < 10)) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                    return false;
                } else if ((mquestion.type == 2) && !($exeDevice.getIDYoutube(mquestion.url))) {
                    $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                    return false;
                }
                if (mquestion.typeSelect == 2) {
                    if (mquestion.solutionQuestion.length == 0) {
                        $exeDevice.showMessage($exeDevice.msgs.msgProvideSolution);
                        return false;
                    }
                } else {
                    var completAnswer = true;
                    for (var j = 0; j < mquestion.numberOptions; j++) {
                        if (mquestion.options[j].length == 0) {
                            completAnswer = false;
                        }
                    }
                    if (!completAnswer) {
                        $exeDevice.showMessage($exeDevice.msgs.msgECompleteAllOptions);
                        return false;
                    }
                }
            }
            for (var i = 0; i < selectsGame.length; i++) {
                var qt = selectsGame[i]
                if (qt.type == 1 && qt.url.length < 4) {
                    qt.x = 0
                    qt.y = 0;
                    qt.author = '';
                    qt.alt = '';
                } else if (qt.type == 2 && qt.url.length < 4) {
                    qt.iVideo = 0
                    qt.fVideo = 0;
                    qt.author = '';
                    qt.alt = '';
                } else if (qt.type == 3) {
                    qt.eText = qt.eText;
                }
            }
        }
        for (var i = 0; i < $exeDevice.idevicesTitleState.length; i++) {
            var point = 0,
                message = ''
            if (i > 0) {
                point = $exeDevice.points[i];
                message = $exeDevice.messagesItineraries[i]
            }
            var it = {
                'itinerary': i,
                'point': point,
                'message': message,
                'idevices': $exeDevice.idevicesTitleState[i]
            }
            itineraries.push(it)
        }
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Itinerario',
            'endVideo': endVideo,
            'idVideo': idVideo,
            'startVideo': startVideo,
            'instructionsExe': instructionsExe,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
            'selectsGame': selectsGame,
            'title': '',
            'customScore': customScore,
            'textAfter': textAfter,
            'version': 1,
            'itineraries': itineraries,
            'itenerayID': itenerayID,
            'textFeedBack': textFeedBack,
            'feedback': feedback,
            'evaluationType': evaluationType,
            'numItineraries': numItineraries,
            'itinerayPoints': $exeDevice.points,
            'ideviceType': ideviceType,
            'repeatTest': repeatTest,
            'codeTest': codeTest,
            'useTime': useTime,
            'messageCodeTest': messageCodeTest,
            'collapsedIdi': $exeDevice.collapsedIdi,
            'randomQuestions': randomQuestions,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
        }
        return data;
    },

    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    showTypeQuestion: function (type) {
        if (type == 2) {
            $('#itnEAnswers').hide();
            $('#itnEQuestionDiv').hide();
            $('#gameQEIdeviceForm .ITNE-ESolutionSelect').hide();
            $('#itnOptionsNumberSpan').hide();
            $('#itnEInputNumbers').hide();
            $('#itnPercentageSpan').show();
            $('#itnPercentage').show();
            $('#itnEWordDiv').show();
            $('#itnESolitionOptions').hide();

        } else {
            $('#itnEAnswers').show();
            $('#itnEQuestionDiv').show();
            $('#gameQEIdeviceForm .ITNE-ESolutionSelect').show();
            $('#itnOptionsNumberSpan').show();
            $('#itnEInputNumbers').show();
            $('#itnPercentageSpan').hide();
            $('#itnPercentage').hide();
            $('#itnEWordDiv').hide();
            $('#itnESolitionOptions').show();
        }
    },
    addEvents: function () {
        $('#itnEPaste').hide();
        $('#itnEAuthorAlt').hide();

        $('#itnEHasFeedBack').on('click', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#itnEFeedBackEditorDiv').slideDown();
            } else {
                $('#itnEFeedBackEditorDiv').slideUp();
            }
        });
        $('#itnEShowMore').on('click', function (e) {
            e.preventDefault();
            $('#itnEAuthorAlt').slideToggle();
        });
        $('#itnEReload').on('click', function (e) {
            e.preventDefault();
            var idn = $exeDevice.getID(),
                oid = 'iteneraryData-' + $('#itnEIEPassword').val();
            $('#itnEIEPassword').val(idn)
            localStorage.removeItem(oid);
        });

        $('#itnEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#itnEInitVideo');
                    break;
                case 1:
                    $timeV = $('#itnEEndVideo');
                    break;
                case 2:
                    $timeV = $('#itnESilenceVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#itnEVideoTime').text());
            $timeV.css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });

        $('#itnEInitVideo, #itnEEndVideo, #itnESilenceVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#itnEInitVideo, #itnEEndVideo, #itnESilenceVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });
        $('#itnShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#itnCodeAccess').prop('disabled', !marcado);
            $('#itnMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.ITNE-EPanel').on('click', 'input.ITNE-MediaType', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });
        $('.ITNE-EPanel').on('click', 'input.ITNE-SelectType', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.showTypeQuestion(type);
        });
        $('.ITNE-EPanel').on('click', 'input.ITNE-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#itnEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion();
        });
        $('#itnEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion();
        });
        $('#itnEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion();
        });
        $('#itnENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion();
        });
        $('#itnELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion();
        });
        $('#itnEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion();
        });
        $('#itnECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#itnECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#itnEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion();
        });
        $('#itnEPlayVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.playVideoQuestion();
        });

        $(' #itnECheckSoundVideo').on('change', function () {
            $exeDevice.playVideoQuestion();
        });
        $('#itnECheckImageVideo').on('change', function () {
            $exeDevice.playVideoQuestion();
        });
        $('#itnETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });

        $('#itnInputMessage').on('keyup', function () {
            $exeDevice.messagesItineraries[$exeDevice.activeIti] = this.value;
        });
        $('#itnETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#itnEScoreQuestion').on('focusout', function () {
            if (!$exeDevice.validateScoreQuestion($(this).val())) {
                $(this).val(1);
            }
        });
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $('#eXeGameExportImport').show();
            $('#eXeGameImportGame').on('change', function (e) {
                var file = e.target.files[0];
                if (!file) {
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $exeDevice.importGame(e.target.result);
                };
                reader.readAsText(file);
            });
            $('#eXeGameExportGame').on('click', function () {
                $exeDevice.exportGame();
            })
        } else {
            $('#eXeGameExportImport').hide();
        }
        $('#itnEInitVideo').css('color', '#2c6d2c');
        $('#itnEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#itnEInitVideo').css('color', '#2c6d2c');
            $('#itnEEndVideo').css('color', '#000000');
            $('#itnESilenceVideo').css('color', '#000000');
        });
        $('#itnEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#itnEEndVideo').css('color', '#2c6d2c');
            $('#itnEInitVideo').css('color', '#000000');
            $('#itnESilenceVideo').css('color', '#000000');
        });
        $('#itnESilenceVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 2;
            $('#itnESilenceVideo').css('color', '#2c6d2c');
            $('#itnEEndVideo').css('color', '#000000');
            $('#itnEInitVideo').css('color', '#000000');
        });

        $('#itnEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#itnETimeShowSolution').prop('disabled', !marcado);
        });
        $('#itnEUseTime').on('change', function () {
            var marcado = $(this).is(':checked');
            $exeDevice.showTimesQuestions(marcado)
        });
        $('.ITNE-ESolution').on('change', function (e) {
            var marcado = $(this).is(':checked'),
                value = $(this).val();
            $exeDevice.clickSolution(marcado, value);
        });
        $('#itnECustomScore').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#itnEScoreQuestionDiv').hide();
            if (marcado) {
                $('#itnEScoreQuestionDiv').show();
            }
        });
        $('#itnEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#itnEAlt').val(),
                x = parseFloat($('#itnEXImage').val()),
                y = parseFloat($('#itnEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#itnEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#itnEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#itnEAlt').val(),
                x = parseFloat($('#itnEXImage').val()),
                y = parseFloat($('#itnEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });
        $('#itnECursor').on('click', function (e) {
            $(this).hide();
            $('#itnEXImage').val(0);
            $('#itnEYImage').val(0);
        });
        $('#itnEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#itnEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });
        $('#itnEURLAudio').on('change', function () {
            var selectedFile = $(this).val().trim();
            if (selectedFile.length == 0) {
                $exeDevice.showMessage(_("Supported formats") + ": mp3, ogg, wav");
            } else {
                if (selectedFile.length > 4) {
                    $exeDevice.stopSound();
                    $exeDevice.playSound(selectedFile);
                }
            }
        });

        $('#itnEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#gameQEIdeviceForm').on('click', 'input.ITNE-EvaluationType', function (e) {
            var type = parseInt($(this).val());
            num = parseInt($('input[name=itiname]:checked').val()),
                idt = parseInt($('input[name=itidevicetype]:checked').val()),
                $exeDevice.updateEvaluationType(type, num, idt);
        });

        $('#gameQEIdeviceForm').on('click', 'input.ITNE-IDeviceTitle', function (e) {
            var checkbosex = $("input.ITNE-IDeviceTitle");
            $exeDevice.idevicesTitleState[$exeDevice.activeIti] = $exeDevice.getChexboxTitleState(checkbosex);
            //$exeDevice.updateIti();
        });
        $('#gameQEIdeviceForm').on('click', 'input.ITNE-CollapsedTitle', function () {
            var title = $(this).val(),
                check = $(this).is(':checked'),
                all = check && title == _('Todos')
            $exeDevice.updateCollapse(all);
        });
        $('#gameQEIdeviceForm').on('click', 'input.ITNE-ItinerarioName', function (e) {
            var number = parseInt($(this).val()),
                etype = parseInt($('input[name=itievaluation]:checked').val()),
                idt = parseInt($('input[name=itidevicetype]:checked').val());

            $exeDevice.updateCheckBoxIti(number, etype);
            if (idt != 1) {
                $('#itnPoints').hide();
            }
        });

        $('#gameQEIdeviceForm').on('click', 'input.ITNE-NumberIT', function (e) {
            var number = parseInt($(this).val()),
                evt = parseInt($('input[name=itievaluation]:checked').val());
            $exeDevice.showItinerarys(number);
            $("input.ITNE-ItinerarioName[name='itiname'][value='0']").prop("checked", true)
            $exeDevice.updateCheckBoxIti(0, evt);
        });

        $('#gameQEIdeviceForm').on('click', 'input.ITNE-IDeviceType', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.updateIDeviceType(number);
            if(number == 1){
                $exeDevice.showQuestion($exeDevice.active)
            }
        });
        $('#gameQEIdeviceForm').on('click', 'input.ITNE-RepeatTest', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.showRepeatTest(type);
        });

        $('#itnEEPoint').on('click', function (e) {
            var value = parseFloat($(this).val());
            $exeDevice.updatePointValue(value);
        });
        $("#itnHelpLink0").click(function () {
            $("#itnHelp0").slideToggle();
            return false;
        });
        $("#itnHelpLink1").click(function () {
            $("#itnHelp1").slideToggle();
            return false;
        });
        $("#itnHelpLink2").click(function () {
            $("#itnHelp2").slideToggle();
            return false;
        });
        $("#itnHelpLink3").click(function () {
            $("#itnHelp3").slideToggle();
            return false;
        });
        $("#itnHelpLink4").click(function () {
            $("#itnHelp4").slideToggle();
            return false;
        });
        $("#itnHelpLink5").click(function () {
            $("#itnHelp5").slideToggle();
            return false;
        });

        $('#itnEIEListInineraries').find('input[type=number]').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 2);
            this.value = v;
        });
        $('#itnEIEList').find('input[type=number]').on('focusout', function () {
            this.value = this.value.trim() == '' ? 10 : this.value;
            this.value = this.value > 10 ? 10 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });
        $("#itnEIE").click(function () {
            $("#itnEIEPoints").toggle();
        });
        $('#itnEVIStart').css('color', '#2c6d2c');
        $('#itnEVIStart').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = true;
            $('#itnEVIStart').css('color', '#2c6d2c');
            $('#itnEVIEnd').css('color', '#000000');
        });
        $('#itnEVIEnd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = false;
            $('#itnEVIEnd').css('color', '#2c6d2c');
            $('#itnEVIStart').css('color', '#000000');
        });
        $('#itnEVITime').on('click', function (e) {
            e.preventDefault();
            var $timeV = $exeDevice.timeVIFocus ? $('#itnEVIStart') : $('#itnEVIEnd');
            $timeV.val($('#itnEVITime').text());
        });

        $('#itnEVideoIntroPlay').on('click', function (e) {
            e.preventDefault();
            $exeDevice.playVideoIntro1();
        });
        $('#itnEVIPlayI').on('click', function (e) {
            e.preventDefault();
            $exeDevice.playVideoIntro2();
        });
        $('#itnEVIClose').on('click', function (e) {
            e.preventDefault();
            $('#itnEVideoIntro').val($('#itnEVIURL').val());
            $('#itnEVIDiv').hide();
            $('#itnENumQuestionDiv').show();
            $exeDevice.stopVideoIntro();
        });
        $('#itnETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#itnETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#itnShowIdevices').on('click', function (e) {
            e.preventDefault();
            //$exeDevice.showElements(0)
        });
        $('#itnShowMenus').on('click', function (e) {
            e.preventDefault();
            //$exeDevice.showElements(1)
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },
    showElements: function (type) {
        if (type == $exeDevice.elementType) return;
        $exeDevice.elementType = type;
        if ($exeDevice.elementType == 0) {
            $('#itnIDevicesPageDiv').show();
            $('#itnMenusPagesDiv').hide();
        } else {
            $('#itnIDevicesPageDiv').hide();
            $('#itnMenusPagesDiv').show();
        }
    },
    getID: function () {
        return Math.floor(Math.random() * Date.now())
    },
    showTimesQuestions: function (show) {
        var ideviceType = parseInt($('input[name=itidevicetype]:checked').val());
        if (show && ideviceType == 1) {
            $('#itnEInputTimesDiv').show();
        } else {
            $('#itnEInputTimesDiv').hide();
        }

    },
    clickSolution: function (checked, value) {
        var solutions = $('#itnESolutionSelect').text();

        if (checked) {
            if (solutions.indexOf(value) == -1) {
                solutions += value;
            }
        } else {
            solutions = solutions.split(value).join('')
        }
        $('#itnESolutionSelect').text(solutions);
    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#itnECursor'),
            $x = $('#itnEXImage'),
            $y = $('#itnEYImage'),
            $img = $(img),
            posX = epx - $img.offset().left,
            posY = epy - $img.offset().top,
            wI = $img.width() > 0 ? $img.width() : 1,
            hI = $img.height() > 0 ? $img.height() : 1,
            lI = $img.position().left,
            tI = $img.position().top;
        $x.val(posX / wI);
        $y.val(posY / hI);
        $cursor.css({
            left: posX + lI,
            top: posY + tI,
            'z-index': 3000
        });
        $cursor.show();
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
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    validateScoreQuestion: function (text) {
        var isValid = text.length > 0 && text !== '.' && text !== ',' && /^-?\d*[.,]?\d*$/.test(text);
        return isValid;
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'Itinerario') {
            game.selectsGame = $exeDevice.importItinerario(game);
            $exeDevice.active = 0;
            $exeDevice.updateFieldGame(game);
            var instructions = game.instructionsExe || game.instructions,
                tAfter = game.textAfter || "";
            if (tinyMCE.get('eXeGameInstructions')) {
                tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
            } else {
                $('#eXeGameInstructions').val(unescape(instructions));
            }
            if (tinyMCE.get('eXeIdeviceTextAfter')) {
                tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(instructions));
            } else {
                $('#eXeIdeviceTextAfter').val(unescape(instructions));
            }

        } else if (game.typeGame == 'Oca') {
            $exeDevice.selectsGame = $exeDevice.importItinerario(game);
        } else if (game.typeGame == 'QuExt') {
            $exeDevice.selectsGame = $exeDevice.importQuExt(game);
        } else if (game.typeGame == 'Adivina') {
            $exeDevice.selectsGame = $exeDevice.importAdivina(game);
        } else if (game.typeGame == 'Rosco') {
            $exeDevice.selectsGame = $exeDevice.importRosco(game);
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.deleteEmptyQuestion();
        $exeDevice.showQuestion($exeDevice.active);
        $('.exe-form-tabs li:first-child a').click();
    },
    importQuExt: function (data) {
        for (var i = 0; i < data.questionsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault();
            var cuestion = data.questionsGame[i],
                solution = 'ABCD';
            p.typeSelect = 0;
            p.type = cuestion.type;
            p.time = cuestion.time;
            p.numberOptions = cuestion.numberOptions;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = cuestion.soundVideo;
            p.imageVideo = cuestion.imageVideo;
            p.iVideo = cuestion.iVideo;
            p.fVideo = cuestion.fVideo;
            p.eText = cuestion.eText;
            p.quextion = cuestion.quextion;
            p.options = [];
            for (var j = 0; j < cuestion.options.length; j++) {
                p.options.push(cuestion.options[j]);
            }
            var numOpt = 0;
            for (var j = 0; j < p.options.length; j++) {
                if (p.options[j].trim().length == 0) {
                    p.numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
            if (p.type == 3) {
                p.eText = unescape(p.eText)
            }
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.options = cuestion.options;
            p.solution = solution.charAt(cuestion.solution);
            p.silentVideo = cuestion.silentVideo;
            p.tSilentVideo = cuestion.tSilentVideo;
            p.solutionQuestion = '';
            p.percentageShow = 35;
            $exeDevice.selectsGame.push(p);
        }
        return $exeDevice.selectsGame;
    },
    deleteEmptyQuestion: function () {
        if ($exeDevice.selectsGame.length > 1) {
            var quextion = $('#itnEQuestion').val().trim(),
                typeSelect = parseInt($('input[name=itiselecttype]:checked').val()),
                solutionQuestion = "";
            if (typeSelect == 2) {
                solutionQuestion = $('#itnESolutionWord').val();
                quextion = $('#itnEDefinitionWord').val().trim();
                if (quextion.length == 0 && solutionQuestion.length == 0) {
                    $exeDevice.removeQuestion();
                }
            } else {
                var empty = true;
                $('.ITNE-EAnwersOptions').each(function (i) {
                    var option = $(this).val().trim();
                    if (option.length > 0) {
                        empty = false;
                    }
                });
                if (quextion.length == 0 && solutionQuestion.length == 0) {
                    $exeDevice.removeQuestion();
                }
            }
        }
    },
    getURLVideoMediaTeca: function (url) {
        if (url) {
            var matc = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;
            if (matc) {
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
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $exeDevice.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $exeDevice.getURLAudioMediaTeca(urlmedia);
        }
        return sUrl;
    },
    importAdivina: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault();
            var cuestion = data.wordsGame[i];
            p.typeSelect = 2;
            p.type = cuestion.url.length > 10 ? 1 : 0;
            p.time = cuestion.time || $exeDevice.getIndexTime(data.timeQuestion);
            p.numberOptions = 4;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = 1;
            p.imageVideo = 1;
            p.iVideo = 0;
            p.fVideo = 0;
            p.eText = '';
            p.quextion = cuestion.definition;
            p.options = [];
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.solution = '';
            p.silentVideo = 0;
            p.tSilentVideo = 0;
            p.solutionQuestion = cuestion.word;
            p.percentageShow = cuestion.percentageShow || data.percentageShow;
            $exeDevice.selectsGame.push(p);
        }
        return $exeDevice.selectsGame;
    },
    importRosco: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault(),
                cuestion = data.wordsGame[i],
                start = cuestion.type = 1 ? $exeDevice.msgs.msgContaint.replace('%1', cuestion.letter) : $exeDevice.msgs.msgStartWith.replace('%1', cuestion.letter);
            p.typeSelect = 2;
            p.type = cuestion.url.length > 10 ? 1 : 0;
            p.time = cuestion.time || $exeDevice.getIndexTime(data.timeQuestion);
            p.numberOptions = 4;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = 1;
            p.imageVideo = 1;
            p.iVideo = 0;
            p.fVideo = 0;
            p.eText = '';
            p.quextion = start + ': ' + cuestion.definition;
            p.options = [];
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.options.push('');
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.solution = '';
            p.silentVideo = 0;
            p.tSilentVideo = 0;
            p.solutionQuestion = cuestion.word;
            p.percentageShow = cuestion.percentageShow || data.percentageShow;
            if (p.solutionQuestion.trim().length > 0) {
                $exeDevice.selectsGame.push(p);
            }
        }
        return $exeDevice.selectsGame;
    },
    importItinerario: function (data) {
        for (var i = 0; i < data.selectsGame.length; i++) {
            var p = $exeDevice.getCuestionDefault();
            var cuestion = data.selectsGame[i];
            p.typeSelect = cuestion.typeSelect;
            p.type = cuestion.type;
            p.time = cuestion.time;
            p.numberOptions = cuestion.numberOptions;
            p.url = cuestion.url;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.soundVideo = cuestion.soundVideo;
            p.imageVideo = cuestion.imageVideo;
            p.iVideo = cuestion.iVideo;
            p.fVideo = cuestion.fVideo;
            p.eText = cuestion.eText;
            p.quextion = cuestion.quextion;
            p.options = [];
            for (var j = 0; j < cuestion.options.length; j++) {
                p.options.push(cuestion.options[j]);
            }
            var numOpt = 0;
            for (var j = 0; j < p.options.length; j++) {
                if (p.options[j].trim().length == 0) {
                    p.numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
            if (p.type == 3) {
                p.eText = unescape(p.eText)
            }
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.hit = typeof cuestion.hit == "undefined" ? -1 : cuestion.hit;
            p.error = typeof cuestion.error == "undefined" ? -1 : cuestion.error;
            p.msgHit = typeof cuestion.msgHit == "undefined" ? "" : cuestion.msgHit;
            p.msgError = typeof cuestion.msgError == "undefined" ? "" : cuestion.msgError;
            p.options = cuestion.options;
            p.solution = cuestion.solution;
            p.silentVideo = cuestion.silentVideo;
            p.tSilentVideo = cuestion.tSilentVideo;
            p.solutionQuestion = cuestion.solutionQuestion;
            p.percentageShow = cuestion.percentageShow;
            $exeDevice.selectsGame.push(p);
        }
        return $exeDevice.selectsGame;
    },
    getIndexTime: function (time) {
        var index = 0;
        switch (time) {
            case 15:
                index = 0;
                break;
            case 30:
                index = 1;
                break;
            case 60:
                index = 2;
                break;
            case 180:
                index = 3;
                break;
            case 300:
                index = 4;
            case 600:
                index = 5;
                break;
            case 900:
                index = 6;
                break;
            default:
                index = time;
                break;
        }
        return index;
    }
}
/*The MIT License (MIT)

Copyright (c) 2015 Ole Trenner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/
function factory($) {
    "use strict";


    function Sortable(el, options) {
        var self = this,
            $sortable = $(el),
            container_type = $sortable[0].nodeName,
            node_type = (container_type == 'OL' || container_type == 'UL') ? 'LI' : 'DIV',
            defaults = {
                //options
                handle: false,
                container: container_type,
                container_type: container_type,
                same_depth: false,
                make_unselectable: false,
                nodes: node_type,
                nodes_type: node_type,
                placeholder_class: null,
                auto_container_class: 'sortable_container',
                autocreate: false,
                group: false,
                scroll: false,
                //callbacks
                update: null
            };

        self.$sortable = $sortable.data('sortable', self);
        self.options = $.extend({}, defaults, options);

        self.init();
    }

    Sortable.prototype.invoke = function (command) {
        var self = this;
        if (command === 'destroy') {
            return self.destroy();
        } else if (command === 'serialize') {
            return self.serialize(self.$sortable);
        }
    };

    Sortable.prototype.init = function () {
        var self = this,
            $clone,
            $placeholder,
            origin;

        if (self.options.make_unselectable) {
            $('html').unselectable();
        }

        self.$sortable
            .addClass('sortable')
            .on('destroy.sortable', function () {
                self.destroy();
            });

        function find_insert_point($node, offset) {
            var containers,
                best,
                depth;

            if (!offset) {
                return;
            }

            containers = self.$sortable
                .add(self.$sortable.find(self.options.container))
                .not($node.find(self.options.container))
                .not($clone.find(self.options.container))
                .not(self.find_nodes());

            if (self.options.same_depth) {
                depth = $node.parent().nestingDepth('ul');
                containers = containers.filter(function () {
                    return $(this).nestingDepth('ul') == depth;
                });
            }

            $placeholder.hide();
            containers.each(function (ix, container) {
                var $trailing = $(self.create_placeholder()).appendTo(container),
                    $children = $(container).children(self.options.nodes).not('.sortable_clone'),
                    $candidate,
                    n,
                    dist;

                for (n = 0; n < $children.length; n++) {
                    $candidate = $children.eq(n);
                    dist = self.square_dist($candidate.offset(), offset);
                    if (!best || best.dist > dist) {
                        best = {
                            container: container,
                            before: $candidate[0],
                            dist: dist
                        };
                    }
                }

                $trailing.remove();
            });
            $placeholder.show();

            return best;
        }

        function insert($element, best) {
            var $container = $(best.container);
            if (best.before && best.before.closest('html')) {
                $element.insertBefore(best.before);
            } else {
                $element.appendTo($container);
            }
        };

        self.$sortable.dragaware($.extend({}, self.options, {
            delegate: self.options.nodes,
            /**
             * drag start - create clone and placeholder, keep drag start origin.
             */
            dragstart: function (evt) {
                var $node = $(this);

                $clone = $node.clone()
                    .removeAttr('id')
                    .addClass('sortable_clone')
                    .css({
                        position: 'absolute'
                    })
                    .insertAfter($node)
                    .offset($node.offset());
                $placeholder = self.create_placeholder()
                    .css({
                        height: $node.outerHeight(),
                        width: $node.outerWidth()
                    })
                    .insertAfter($node);
                $node.hide();

                origin = new PositionHelper($clone.offset());

                if (self.options.autocreate) {
                    self.find_nodes().filter(function (ix, el) {
                        return $(el).find(self.options.container).length == 0;
                    }).append('<' + self.options.container_type + ' class="' + self.options.auto_container_class + '"/>');
                }
            },

            /**
             * drag - reposition clone, check for best insert position, move placeholder in dom accordingly.
             */
            drag: function (evt, pos) {
                var $node = $(this),
                    offset = origin.absolutize(pos),
                    best = find_insert_point($node, offset);

                $clone.offset(offset);
                insert($placeholder, best);
            },

            /**
             * drag stop - clean up.
             */
            dragstop: function (evt, pos) {
                var $node = $(this),
                    offset = origin.absolutize(pos),
                    best = find_insert_point($node, offset);

                if (best) {
                    insert($node, best);
                }
                $node.show();

                if ($clone) {
                    $clone.remove();
                }
                if ($placeholder) {
                    $placeholder.remove();
                }
                $clone = null;
                $placeholder = null;

                if (best && self.options.update) {
                    self.options.update.call(self.$sortable, evt, self);
                }
                self.$sortable.trigger('update');
            }
        }));
    };

    Sortable.prototype.destroy = function () {
        var self = this;

        if (self.options.make_unselectable) {
            $('html').unselectable('destroy');
        }

        self.$sortable
            .removeClass('sortable')
            .off('.sortable')
            .dragaware('destroy');
    };

    Sortable.prototype.serialize = function (container) {
        var self = this;
        return container.children(self.options.nodes).not(self.options.container).map(function (ix, el) {
            var $el = $(el),
                text = $el.clone().children().remove().end().text().trim(), //text only without children
                id = $el.attr('id'),
                node = {
                    id: id || text
                };
            if ($el.find(self.options.nodes).length) {
                node.children = self.serialize($el.children(self.options.container));
            }
            return node;
        }).get();
    };

    Sortable.prototype.find_nodes = function () {
        var self = this;
        return self.$sortable.find(self.options.nodes).not(self.options.container);
    };

    Sortable.prototype.create_placeholder = function () {
        var self = this;
        return $('<' + self.options.nodes_type + '/>')
            .addClass('sortable_placeholder')
            .addClass(self.options.placeholder_class);
    };

    Sortable.prototype.square_dist = function (pos1, pos2) {
        return Math.pow(pos2.left - pos1.left, 2) + Math.pow(pos2.top - pos1.top, 2);
    };




    function Draggable(el, options) {
        var self = this,
            defaults = {
                //options
                handle: false,
                delegate: false,
                revert: false,
                placeholder: false,
                droptarget: false,
                container: false,
                scroll: false,
                //callbacks
                update: null,
                drop: null
            };

        self.$draggable = $(el).data('draggable', self);
        self.options = $.extend({}, defaults, options);

        self.init();
    }

    Draggable.prototype.init = function () {
        var self = this,
            $clone,
            origin;

        self.$draggable
            .addClass('draggable')
            .on('destroy.draggable', function () {
                self.destroy();
            });

        function check_droptarget(pos) {
            var $over;

            $('.hovering').removeClass('hovering');

            $clone.hide();
            $over = $(document.elementFromPoint(pos.clientX, pos.clientY)).closest(self.options.droptarget);
            $clone.show();

            if ($over.length) {
                $over.addClass('hovering');
                return $over;
            }
        }

        self.$draggable.dragaware($.extend({}, self.options, {
            /**
             * drag start - create clone, keep drag start origin.
             */
            dragstart: function (evt) {
                var $this = $(this);
                if (self.options.placeholder || self.options.revert) {
                    $clone = $this.clone()
                        .removeAttr('id')
                        .addClass('draggable_clone')
                        .css({
                            position: 'absolute'
                        })
                        .appendTo(self.options.container || $this.parent())
                        .offset($this.offset());
                    if (!self.options.placeholder) {
                        $(this).invisible();
                    }
                } else {
                    $clone = $this;
                }

                origin = new PositionHelper($clone.offset());
            },

            /**
             * drag - reposition clone.
             */
            drag: function (evt, pos) {
                var $droptarget = check_droptarget(pos);
                $clone.offset(origin.absolutize(pos));
            },

            /**
             * drag stop - clean up.
             */
            dragstop: function (evt, pos) {
                var $this = $(this),
                    $droptarget = check_droptarget(pos);

                if (self.options.revert || self.options.placeholder) {
                    $this.visible();
                    if (!self.options.revert) {
                        $this.offset(origin.absolutize(pos));
                    }
                    $clone.remove();
                }

                $clone = null;

                if (self.options.update) {
                    self.options.update.call($this, evt, self);
                }

                $this.trigger('update');

                if ($droptarget) {
                    if (self.options.drop) {
                        self.options.drop.call($this, evt, $droptarget[0]);
                    }
                    $droptarget.trigger('drop', [$this]);
                    $droptarget.removeClass('hovering');
                } else {
                    if (self.options.onrevert) {
                        self.options.onrevert.call($this, evt);
                    }
                }
            }
        }));
    };

    Draggable.prototype.destroy = function () {
        var self = this;

        self.$draggable
            .dragaware('destroy')
            .removeClass('draggable')
            .off('.draggable');
    };




    function Droppable(el, options) {
        var self = this,
            defaults = {
                //options
                accept: false,
                //callbacks
                drop: null
            };

        self.$droppable = $(el).data('droppable', self);
        self.options = $.extend({}, defaults, options);

        self.init();
    }

    Droppable.prototype.init = function () {
        var self = this;

        self.$droppable
            .addClass('droppable')
            .on('drop', function (evt, $draggable) {
                if (self.options.accept && !$draggable.is(self.options.accept)) {
                    return;
                }
                if (self.options.drop) {
                    self.options.drop.call(self.$droppable, evt, $draggable);
                }
            })
            .on('destroy.droppable', function () {
                self.destroy();
            });
    };

    Droppable.prototype.destroy = function () {
        var self = this;

        self.$droppable
            .removeClass('droppable')
            .off('.droppable');
    };




    function Dragaware(el, options) {
        var $dragaware = $(el),
            $reference = null,
            origin = null,
            lastpos = null,
            defaults = {
                //options
                handle: null,
                delegate: null,
                scroll: false,
                scrollspeed: 15,
                scrolltimeout: 50,
                //callbacks
                dragstart: null,
                drag: null,
                dragstop: null
            },
            scrolltimeout;

        options = $.extend({}, defaults, options);

        /**
         * Returns the event position
         * dX, dY relative to drag start
         * pageX, pageY relative to document
         * clientX, clientY relative to browser window
         */
        function evtpos(evt) {
            evt = window.hasOwnProperty('event') ? window.event : evt;
            //extract touch event if present
            if (evt.type.substr(0, 5) === 'touch') {
                evt = evt.hasOwnProperty('originalEvent') ? evt.originalEvent : evt;
                evt = evt.touches[0];
            }

            return {
                pageX: evt.pageX,
                pageY: evt.pageY,
                clientX: evt.clientX,
                clientY: evt.clientY,
                dX: origin ? evt.pageX - origin.pageX : 0,
                dY: origin ? evt.pageY - origin.pageY : 0
            };
        }

        function autoscroll(pos) {
            //TODO: allow window scrolling
            //TODO: handle nested scroll containers
            var sp = $dragaware.scrollParent(),
                mouse = {
                    x: pos.pageX,
                    y: pos.pageY
                },
                offset = sp.offset(),
                scrollLeft = sp.scrollLeft(),
                scrollTop = sp.scrollTop(),
                width = sp.width(),
                height = sp.height();

            window.clearTimeout(scrolltimeout);

            if (scrollLeft > 0 && mouse.x < offset.left) {
                sp.scrollLeft(scrollLeft - options.scrollspeed);
            } else if (scrollLeft < sp.prop('scrollWidth') - width && mouse.x > offset.left + width) {
                sp.scrollLeft(scrollLeft + options.scrollspeed);
            } else if (scrollTop > 0 && mouse.y < offset.top) {
                sp.scrollTop(scrollTop - options.scrollspeed);
            } else if (scrollTop < sp.prop('scrollHeight') - height && mouse.y > offset.top + height) {
                sp.scrollTop(scrollTop + options.scrollspeed);
            } else {
                return; //so we don't set the next timeout
            }

            scrolltimeout = window.setTimeout(function () {
                autoscroll(pos);
            }, options.scrolltimeout);
        }

        function start(evt) {
            var $target = $(evt.target);

            $reference = options.delegate ? $target.closest(options.delegate) : $dragaware;

            if ($target.closest(options.handle || '*').length && (evt.type == 'touchstart' || evt.button == 0)) {
                origin = lastpos = evtpos(evt);
                if (options.dragstart) {
                    options.dragstart.call($reference, evt, lastpos);
                }

                $reference.addClass('dragging');
                $reference.trigger('dragstart');

                //late binding of event listeners
                $(document)
                    .on('touchend.dragaware mouseup.dragaware click.dragaware', end)
                    .on('touchmove.dragaware mousemove.dragaware', move);
                return false
            }
        }

        function move(evt) {
            lastpos = evtpos(evt);

            if (options.scroll) {
                autoscroll(lastpos);
            }

            $reference.trigger('dragging');

            if (options.drag) {
                options.drag.call($reference, evt, lastpos);
                return false;
            }
        }

        function end(evt) {
            window.clearTimeout(scrolltimeout);

            if (options.dragstop) {
                options.dragstop.call($reference, evt, lastpos);
            }

            $reference.removeClass('dragging');
            $reference.trigger('dragstop');

            origin = false;
            lastpos = false;
            $reference = false;

            //unbinding of event listeners
            $(document)
                .off('.dragaware');

            return false;
        }

        $dragaware
            .addClass('dragaware')
            .on('touchstart.dragaware mousedown.dragaware', options.delegate, start);

        $dragaware.on('destroy.dragaware', function () {
            $dragaware
                .removeClass('dragaware')
                .off('.dragaware');
        });
    }

    function PositionHelper(origin) {
        this.origin = origin;
    }
    PositionHelper.prototype.absolutize = function (pos) {
        if (!pos) {
            return this.origin;
        }
        return {
            top: this.origin.top + pos.dY,
            left: this.origin.left + pos.dX
        };
    };




    // Plugin registration.


    /**
     * Sortable plugin.
     */
    $.fn.sortable = function (options) {
        var filtered = this.not(function () {
            return $(this).is('.sortable') || $(this).closest('.sortable').length;
        });

        if (this.data('sortable') && typeof options === 'string') {
            return this.data('sortable').invoke(options);
        }

        if (filtered.length && options && options.group) {
            new Sortable(filtered, options);
        } else {
            filtered.each(function (ix, el) {
                new Sortable(el, options);
            });
        }
        return this;
    };


    /**
     * Draggable plugin.
     */
    $.fn.draggable = function (options) {
        if (options === 'destroy') {
            this.trigger('destroy.draggable');
        } else {
            this.not('.draggable').each(function (ix, el) {
                new Draggable(el, options);
            });
        }
        return this;
    };


    /**
     * Droppable plugin.
     */
    $.fn.droppable = function (options) {
        if (options === 'destroy') {
            this.trigger('destroy.droppable');
        } else {
            this.not('.droppable').each(function (ix, el) {
                new Droppable(el, options);
            });
        }
        return this;
    };


    /**
     * Dragaware plugin.
     */
    $.fn.dragaware = function (options) {
        if (options === 'destroy') {
            this.trigger('destroy.dragaware');
        } else {
            this.not('.dragaware').each(function (ix, el) {
                new Dragaware(el, options);
            });
        }
        return this;
    };


    /**
     * Disables mouse selection.
     */
    $.fn.unselectable = function (command) {
        function disable() {
            return false;
        }

        if (command == 'destroy') {
            return this
                .removeClass('unselectable')
                .removeAttr('unselectable')
                .off('selectstart.unselectable');
        } else {
            return this
                .addClass('unselectable')
                .attr('unselectable', 'on')
                .on('selectstart.unselectable', disable);
        }
    };


    $.fn.invisible = function () {
        return this.css({
            visibility: 'hidden'
        });
    };


    $.fn.visible = function () {
        return this.css({
            visibility: 'visible'
        });
    };


    $.fn.scrollParent = function () {
        return this.parents().addBack().filter(function () {
            var p = $(this);
            return (/(scroll|auto)/).test(p.css("overflow-x") + p.css("overflow-y") + p.css("overflow"));
        });
    };

    $.fn.nestingDepth = function (selector) {
        var parent = this.parent().closest(selector || '*');
        if (parent.length) {
            return parent.nestingDepth(selector) + 1;
        } else {
            return 0;
        }
    };

    return {
        Sortable,
        Draggable,
        Droppable,
        Dragaware,
        PositionHelper,
    };


}


if (typeof define !== 'undefined') {
    define(['jquery'], factory);
} else {
    factory(jQuery, factory);
}