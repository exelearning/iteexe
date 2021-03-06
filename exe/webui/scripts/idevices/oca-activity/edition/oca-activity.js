/**
 * Select Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Oca Activity'),
        alt: _('Oca QuExt')
    },
    iDevicePath: "/scripts/idevices/oca-activity/edition/",
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
    ci18n: {
        "msgStartGame": _("Click here to start"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("Game Over!"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
        "msgCodeAccess": _("Access code"),
        "msgInformationLooking": _("Cool! The information you were looking for"),
        "msgPlayStart": _("Click here to play"),
        "msgErrors": _("Errors"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time per question"),
        "msgLive": _("Life"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgCool": _("Cool!"),
        "msgLoseLive": _("You lost one life"),
        "msgLostLives": _("You lost all your lives!"),
        "mgsAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgNotNetwork": _("You can only play this game with internet connection."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Check"),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Author"),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgVideoIntro": _("Video Intro"),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgRickText": _("Rich Text"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Please wait..."),
        "mgsPoints": _("points"),
        "mgsOrders": _("Por favor, ordena todas las opciones"),
        "msgIndicateWord": _("Debes escribir una palabra o  una frase"),
        "msgMoveOne": _("Move on"),
        "msgGameStarted": _("El juego ya ha comenzado"),
        "msgPlayersName": _("Debes indicar un nombre para todos los jugadores seleccionados"),
        "msgReboot": _("¿Deseas reiniciar el juego?"),
        "msgLostLivesH": _("has perdido todas tus vidas. ¡Al hospital más pŕoximo!"),
        "msgLostLives0": _("¡genial! Has recuperado las tres vidas"),
        "msgErrorQuestion": _("has fallado. Vuelves a la casilla anterior"),
        "msgRoolDice": _("lanza el dado"),
        "msgHostalOne": _("la Posada. No tienes dinero para pagar. Vuelves a casa a por la cartera"),
        "msgHostal0": _("la pocion te libra de una indigestión. Pasas a la casilla siguiente"),
        "msgWaterWellOne": _("mala suerte. Las aguas subterraneas bajo el pozo te arrastran hasta el puente"),
        "msgWaterWell0": _("utilizas la llave para salir del pozo. Pasas a la casilla siguiente"),
        "msgWaterLabyrinthOne": _("en el laberinto, descubres un pasadizo secreto te lleva a la casilla %1"),
        "msgWaterLabyrinth0": _("utilizas la llave para evitar el laberinto. Pasas a la casilla siguiente"),
        "msgJailOne": _("te has metido en la cárcel. Encuentras un tunel y sales a casilla %1"),
        "msgJail0": _("utilizas la llave para evitar la carcel. Pasas a la casilla siguiente"),
        "msgDeath": _("vuelves a la casilla de salida"),
        "msgDeath0": _("la poción te ha librado de una muerte segura. Vas a la casilla siguiente"),
        "msgWinGame": _("¡genial! Ganas la partida"),
        "msgDoubleSpeed": _("¡a toda velocidad"),
        "msgSurprise0": _("¡has tenido suerte! Lanza el dado de nuevo"),
        "msgSurprise1": _("¡mala suerte! Retrocedes %1 casillas"),
        "msgSurprise2": _("¡genial! Consigues una llave que podrás usar para salir de la cárcel, pozo y laberinto"),
        "msgSurprise3": _("¡estupendo! En tu próxima tirada irás en doble de lejos"),
        "msgSurprise4": _("¡genial! Este antídoto te librará de la muerte y de una mala digestión"),
        "msgOcaOca": _("De oca a oca y tiras porque te toca"),
        "msgsBridge": _("De puente a puente y tiras porque te lleva la corriente"),
        "msgsDice": _("De dado a dado y tiras porque te ha tocado"),
        "msgsWinner": _("El juego ha terminado el ganador es %1 ¿Deseas volvar a jugar?"),
        "msgsGetBox": _("Consigues la casilla"),
        "msgsYouPlay": _("tú juegas. Lanza el dado"),
        "msgSaveDiceAuto": _("Su puntuación se guardará automaticamente tras cada tirada."),
        "msgOnlyFirstGame": _("Sólo puede jugar una vez."),
        "msgGamers": _("Jugadores"),
        "msgAudio": _("Audio")

    },

    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%"); // Avoid invalid HTML
        this.setMessagesInfo();
        this.createForm();
    },
    enableForm: function (field) {

        $exeDevice.initQuestions();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("Please provide the word definition or the valid URL of an image");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEProvideWord = _("Please provide one word or phrase");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgStartWith = _("Starts with %1");
        msgs.msgContaint = _("Contains letter %1");
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Type the right URL of a Youtube video");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgProvideSolution = _("Please write the solution");
        msgs.msgEDefintion = _("Please provide the word definition");
        msgs.msgSilentPoint = _("El tiempo de silencio es incorrecto. Compruebe la duración del vídeo");
        msgs.msgTypeChoose = _("Por favor, marque todas las opciones en el orden correcto");
        msgs.msgTimeFormat = _("Indique el tiempo en el siguientes formato: hh:mm:ss");
        msgs.msgEOneQuestion = _("Al menos debe haber una pregunta");
        msgs.tooManyQuestions = _("¡Demasiadas preguntas! El juego puede tener un máximo aproximado de unas 800 preguntas, pero este número puede variar mucho dependiendo del tipo de cuestiones y la longitud de sr pregunta,  sus respuestas, urls y textos enriquecidos");
        msgs.msgNoSuportBrowser =_("Your browser is not compatible with this tool.");
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
        $("#ocaMediaVideo").prop("disabled", false);
        $exeDevice.player = new YT.Player('ocaEVideo', {
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
    },
    onPlayerReady: function (event) {
        $exeDevice.youtubeLoaded = true;
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
    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#ocaEVideoTime').text(time);
                $exeDevice.updateSoundVideo();
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },

    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video ocado no está disponible")

    },
    startVideo: function (id, start, end) {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.loadVideoById === "function") {
                $exeDevice.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': start,
                    'endSeconds': end
                });
            }
            clearInterval($exeDevice.timeUpdateInterval);
            $exeDevice.timeUpdateInterval = setInterval(function () {
                $exeDevice.updateTimerDisplay();
            }, 1000);
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
    stopVideo: function () {
        if ($exeDevice.player) {
            clearInterval($exeDevice.timeUpdateInterval);
            if (typeof $exeDevice.player.pauseVideo === "function") {
                $exeDevice.player.pauseVideo();
            }
        }
    },
    muteVideo: function (mute) {
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
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },
    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.selectsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.selectsGame.length - 1;
            $('#ocaNumberQuestion').text($exeDevice.selectsGame.length);
            $exeDevice.typeEdit = -1;
            $('#ocaEPaste').hide();
            $('#ocaENumQuestions').text($exeDevice.selectsGame.length);
        }
    },
    removeQuestion: function (num) {
        if ($exeDevice.selectsGame.length < 2) {
            $exeDevice.showMessage( $exeDevice.msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.selectsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.selectsGame.length - 1) {
                $exeDevice.active = $exeDevice.selectsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#ocaEPaste').hide();
            $('#ocaENumQuestions').text($exeDevice.selectsGame.length);
            $('#ocaNumberQuestion').text($exeDevice.active + 1);
        }

    },
    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.selectsGame[$exeDevice.active];
            $('#ocaEPaste').show();
        }

    },
    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#ocaEPaste').show();

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
            $('#ocaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.selectsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#ocaENumQuestions').text($exeDevice.selectsGame.length);
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
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.selectsGame.length ? $exeDevice.selectsGame.length - 1 : num;
        var p = $exeDevice.selectsGame[num];

        var numOptions = 0;
        p.typeSelect = p.typeSelect ? p.typeSelect : 0;
        p.solutionQuestion = p.solutionQuestion ? p.solutionQuestion : '';
        p.percentageShow = p.percentageShow ? p.percentageShow : 35;
        if (p.typeSelect != 2) {
            $('.gameQE-EAnwersOptions').each(function (j) {
                numOptions++;
                if (p.options[j].trim() !== '') {
                    p.numOptions = numOptions;
                }
                $(this).val(p.options[j]);
            });
        } else {
            $('#ocaESolutionWord').val(p.solutionQuestion);
            $('#ocaPercentageShow').val(p.percentageShow);
            $('#ocaEDefinitionWord').val(p.quextion);
        }
        $exeDevice.stopVideo();
        $exeDevice.showTypeQuestion(p.typeSelect);
        $exeDevice.changeTypeQuestion(p.type);
        $exeDevice.showOptions(p.numberOptions);
        $('#ocaEQuestion').val(p.quextion);
        $('#ocaENumQuestions').text($exeDevice.selectsGame.length);
        if (p.type == 1) {
            $('#ocaEURLImage').val(p.url);
            $('#ocaEXImage').val(p.x);
            $('#ocaEYImage').val(p.y);
            $('#ocaEAuthor').val(p.author);
            $('#ocaEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#ocaECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#ocaECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#ocaEURLYoutube').val(p.url);
            $('#ocaEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#ocaEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $('#ocaESilenceVideo').val($exeDevice.secondsToHour(p.silentVideo));
            $('#ocaETimeSilence').val(p.tSilentVideo);
            $exeDevice.silentVideo = p.silentVideo;
            $exeDevice.tSilentVideo = p.tSilentVideo;
            $exeDevice.activeSilent = (p.soundVideo == 1) && (p.tSilentVideo > 0) && (p.silentVideo >= p.iVideo) && (p.iVideo < p.fVideo);
            $exeDevice.endSilent = p.silentVideo + p.tSilentVideo;
            $exeDevice.showVideoQuestion();
        } else if (p.type == 3) {
            tinyMCE.get('ocaEText').setContent(unescape(p.eText));
        }

        $('.gameQE-EAnwersOptions').each(function (j) {
            var option = j < p.numOptions ? p.options[j] : '';
            $(this).val(option);
        });
        p.audio = p.audio && p.audio != "undefined" ? p.audio : "";
        $exeDevice.stopSound();
        if (p.type != 2 && p.audio.trim().length > 4) {
            $exeDevice.playSound(p.audio.trim());
        }
        $('#ocaEURLAudio').val(p.audio);
        $('#ocaNumberQuestion').text(i + 1);
        $("input.gameQE-Number[name='slcnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.gameQE-Type[name='slcmediatype'][value='" + p.type + "']").prop("checked", true);
        $exeDevice.checkQuestions(p.solution);
        $("input.gameQE-Times[name='slctime'][value='" + p.time + "']").prop("checked", true);
        $("input.gameQE-TypeSelect[name='slctypeselect'][value='" + p.typeSelect + "']").prop("checked", true);
    },
    checkQuestions: function (solution) {
        $("input.gameQE-ESolution[name='slcsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $("input.gameQE-ESolution[name='slcsolution'][value='" + sol + "']").prop("checked", true);
        }
        $('#ocaESolutionSelect').text(solution);

    },
    playSound: function (selectedFile) {
        $exeDevice.playerAudio = new Audio(selectedFile);
        $exeDevice.playerAudio.addEventListener("canplaythrough",function(event){
            $exeDevice.playerAudio.play();
        });
    },

    stopSound: function() {
        if ($exeDevice.playerAudio && typeof $exeDevice.playerAudio.pause == "function") {
            $exeDevice.playerAudio.pause();
        }
    },
    showVideoYoutube: function (quextion) {
        var id = $exeDevice.getIDYoutube(quextion.url);
        $('#ocaEImageVideo').hide();
        $('#ocaENoVideo').hide();
        $('#ocaEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, quextion.iVideo, quextion.fVideo);
            $('#ocaEVideo').show();
            if (quextion.imageVideo == 0) {
                $('#ocaEImageVideo').show();
            }
            if (quextion.soundVideo == 0) {
                $('#ocaEImageVideo').show();
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {

            $exeDevice.showMessage($exeDevice.msgEUnavailableVideo);
            $('#ocaENoVideo').show();
        }
    },
    showVideoQuestion: function () {
        var soundVideo = $('#ocaECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#ocaECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#ocaEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#ocaEEndVideo').val()),
            url = $('#ocaEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        $exeDevice.silentVideo = $exeDevice.hourToSeconds($('#ocaESilenceVideo').val().trim());
        $exeDevice.tSilentVideo = parseInt($('#ocaETimeSilence').val());
        $exeDevice.activeSilent = (soundVideo == 1) && ($exeDevice.tSilentVideo > 0) && ($exeDevice.silentVideo >= iVideo) && (iVideo < fVideo);
        $exeDevice.endSilent = $exeDevice.silentVideo + $exeDevice.tSilentVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#ocaENoImageVideo').hide();
        $('#ocaENoVideo').show();
        $('#ocaEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#ocaEVideo').show();
            $('#ocaENoVideo').hide();
            if (imageVideo == 0) {
                $('#ocaEVideo').hide();
                $('#ocaENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage(_("This video is not currently available"));
            $('#ocaENoVideo').show();
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
        var $image = $('#ocaEImage'),
            $cursor = $('#ocaECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#ocaENoImage').show();
        $image.attr('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    if (type == 1) {
                        $exeDevice.showMessage(msgs.msgEURLValid);
                    }
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $('#ocaENoImage').hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
                    return true;
                }
            }).on('error', function () {
                if (type == 1) {
                    $exeDevice.showMessage(msgs.msgEURLValid);
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
        //$("input.myclass[name='myname'][value='the_value']").prop("checked", true);
        $('.gameQE-Type')[0].checked = true;
        $('.gameQE-Times')[0].checked = true;
        $('.gameQE-Number')[2].checked = true;
        $('#ocaEURLImage').val('');
        $('#ocaEXImage').val('0');
        $('#ocaEYImage').val('0');
        $('#ocaEAuthor').val('');
        $('#ocaEAlt').val('');
        $('#ocaEURLYoutube').val('');
        $('#ocaEInitVideo').val('00:00:00');
        $('#ocaEEndVideo').val('00:00:00');
        $('#ocaECheckSoundVideo').prop('checked', true);
        $('#ocaECheckImageVideo').prop('checked', true);
        $('#ocaESolutionSelect').text('');
        tinyMCE.get('ocaEText').setContent('');
        $('#ocaEQuestion').val('');
        $('#ocaESolutionWord').val('');
        $('#ocaESolutionWord').val('');
        $('#ocaEDefinitionWord').val('');
        $('.gameQE-EAnwersOptions').each(function () {
            $(this).val('');
        });
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

        $('#ocaETitleAltImage').hide();
        $('#ocaEAuthorAlt').hide();
        $('#ocaETitleImage').hide();
        $('#ocaEInputImage').hide();
        $('#ocaETitleVideo').hide();
        $('#ocaEInputVideo').hide();
        $('#ocaEInputOptionsVideo').hide();
        $('#ocaInputOptionsImage').hide();
        $('#ocaEInputAudio').show();
        $('#ocaETitleAudio').show();
        if (tinyMCE.get('ocaEText')) {
            tinyMCE.get('ocaEText').hide();
        }

        $('#ocaEText').hide();
        $('#ocaEVideo').hide();
        $('#ocaEImage').hide();
        $('#ocaENoImage').hide();
        $('#ocaECover').hide();
        $('#ocaECursor').hide();
        $('#ocaENoImageVideo').hide();
        $('#ocaENoVideo').hide();
        switch (type) {
            case 0:
                $('#ocaECover').show();
                break;
            case 1:
                $('#ocaENoImage').show();
                $('#ocaETitleImage').show();
                $('#ocaEInputImage').show();
                $('#ocaEAuthorAlt').show();
                $('#ocaECursor').show();
                $('#ocaInputOptionsImage').show();
                $exeDevice.showImage($('#ocaEURLImage').val(), $('#ocaEXImage').val(), $('#ocaEYImage').val(), $('#ocaEAlt').val(), 0)
                break;
            case 2:
                $('#ocaEImageVideo').show();
                $('#ocaETitleVideo').show();
                $('#ocaEInputVideo').show();
                $('#ocaENoVideo').show();
                $('#ocaEVideo').show();
                $('#ocaEInputOptionsVideo').show();
                $('#ocaEInputAudio').hide();
                $('#ocaETitleAudio').hide();
                break;
            case 3:
                $('#ocaEText').show();
                if (tinyMCE.get('ocaEText')) {
                    tinyMCE.get('ocaEText').show();
                }
                break;
            default:
                break;
        }
    },
    showOptions: function (number) {
        $('.gameQE-EOptionDiv').each(function (i) {
            $(this).show();
            if (i >= number) {
                $(this).hide();
                $exeDevice.showSolution('');
            }

        });
        $('.gameQE-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },
    showSolution: function (solution) {
        $("input.gameQE-ESolution[name='slcsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $('.gameQE-ESolution')[solution].checked = true;
            $("input.gameQE-ESolution[name='slcsolution'][value='" + sol + "']").prop("checked", true)
        }
        $('#ocaESolutionSelect').text(solution);


    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("De oca a oca...")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="ocaEShowMinimize"><input type="checkbox" id="ocaEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="ocaEAnswersRamdon"><input type="checkbox" id="ocaEAnswersRamdon" checked>' + _("Random options") + '</label>\
                            </p>\
                            <p>\
                                <label for="ocaEShowSolution"><input type="checkbox" checked id="ocaEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="ocaETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="ocaETimeShowSolution" id="ocaETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="gameQE-EPanel" id="ocaEPanel">\
                            <div class="gameQE-EOptionsMedia">\
                                <div class="gameQE-EOptionsGame">\
                                    <span>' + _("Type") + ':</span>\
                                    <div class="gameQE-EInputType">\
                                        <input class="gameQE-TypeSelect" checked id="ocaTypeChoose" type="radio" name="slctypeselect" value="0"/>\
                                        <label for="ocaTypeSelect">' + _("Selecciona") + '</label>\
                                        <input class="gameQE-TypeSelect"  id="ocaTypeOrders" type="radio" name="slctypeselect" value="1"/>\
                                        <label for="ocaTypeOrders">' + _("Ordena") + '</label>\
                                        <input class="gameQE-TypeSelect"  id="ocaTypeWord" type="radio" name="slctypeselect" value="2"/>\
                                        <label for="ocaTypeWord">' + _("Word") + '</label>\
                                    </div>\
                                    <span>' + _("Multimedia Type") + ':</span>\
                                    <div class="gameQE-EInputMedias">\
                                        <input class="gameQE-Type" checked="checked" id="ocaMediaNormal" type="radio" name="slcmediatype" value="0" disabled />\
                                        <label for="ocaMediaNormal">' + _("Ninguno") + '</label>\
                                        <input class="gameQE-Type"  id="ocaMediaImage" type="radio" name="slcmediatype" value="1" disabled />\
                                        <label for="ocaMediaImage">' + _("Image") + '</label>\
                                        <input class="gameQE-Type"  id="ocaMediaVideo" type="radio" name="slcmediatype" value="2" disabled />\
                                        <label for="ocaMediaVideo">' + _("Video") + '</label>\
                                        <input class="gameQE-Type"  id="ocaMediaText" type="radio" name="slcmediatype" value="3" disabled />\
                                        <label for="ocaMediaText">' + _("Text") + '</label>\
                                    </div>\
                                    <span id="ocaOptionsNumberSpan">' + _("Options Number") + ':</span>\
                                    <div class="gameQE-EInputNumbers" id="ocaEInputNumbers" >\
                                        <input class="gameQE-Number" id="numQ2" type="radio" name="slcnumber" value="2" />\
                                        <label for="numQ2">2</label>\
                                        <input class="gameQE-Number" id="numQ3" type="radio" name="slcnumber" value="3" />\
                                        <label for="numQ3">3</label>\
                                        <input class="gameQE-Number" id="numQ4" type="radio" name="slcnumber" value="4" checked="checked" />\
                                        <label for="numQ4">4</label>\
                                    </div>\
                                    <span id="ocaPercentageSpan">' + _("Percentage of letters to show (%)") + ':</span>\
                                    <div class="gameQE-EPercentage" id="ocaPercentage">\
                                        <input type="number" name="ocaPercentageShow" id="ocaPercentageShow" value="35" min="0" max="100" step="5" /> </label>\
                                    </div>\
                                    <span>' + _("Time per question") + ':</span>\
                                    <div class="gameQE-EInputTimes">\
                                        <input class="gameQE-Times" checked="checked" id="q15s" type="radio" name="slctime" value="0" />\
                                        <label for="q15s">15s</label>\
                                        <input class="gameQE-Times" id="q30s" type="radio" name="slctime" value="1" />\
                                        <label for="q30s">30s</label>\
                                        <input class="gameQE-Times" id="q1m" type="radio" name="slctime" value="2" />\
                                        <label for="q1m">1m</label>\
                                        <input class="gameQE-Times" id="q3m" type="radio" name="slctime" value="3" />\
                                        <label for="q3m">3m</label>\
                                        <input class="gameQE-Times" id="q5m" type="radio" name="slctime" value="4" />\
                                        <label for="q5m">5m</label>\
                                        <input class="gameQE-Times" id="q10m" type="radio" name="slctime" value="5" />\
                                        <label for="q10m">10m</label>\
                                    </div>\
                                    <span class="gameQE-ETitleImage" id="ocaETitleImage">' + _("Image URL") + '</span>\
                                    <div class="gameQE-Flex gameQE-EInputImage" id="ocaEInputImage">\
                                        <label class="sr-av" for="ocaEURLImage">' + _("Image URL") + '</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLImage"  id="ocaEURLImage"/>\
                                        <a href="#" id="ocaEPlayImage" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="' + _("Play") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsImage" id="quextInputOptionsImage">\
                                        <div class="gameQE-ECoord">\
                                            <label for="ocaEXImage">X:</label>\
                                            <input id="ocaEXImage" type="text" value="0" />\
                                            <label for="ocaEXImage">Y:</label>\
                                            <input id="ocaEYImage" type="text" value="0" />\
                                        </div>\
                                    </div>\
                                    <span class="gameQE-ETitleVideo" id="ocaETitleVideo">' + _("Youtube URL") + '</span>\
                                    <div class="gameQE-Flex gameQE-EInputVideo" id="ocaEInputVideo">\
                                        <label class="sr-av" for="ocaEURLYoutube">' + _("Youtube URL") + '</label>\
                                        <input id="ocaEURLYoutube" type="text" />\
                                        <a href="#" id="ocaEPlayVideo" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="' + _("Play") + '" class="gameQE-EButtonImage" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsVideo" id="ocaEInputOptionsVideo">\
                                        <div>\
                                            <label for="ocaEInitVideo">' + _("Start") + ':</label>\
                                            <input id="ocaEInitVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <label for="ocaEEndVideo">' + _("End") + ':</label>\
                                            <input id="ocaEEndVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <button class="gameQE-EVideoTime" id="ocaEVideoTime" type="button">00:00:00</button>\
                                        </div>\
                                        <div>\
                                            <label for="ocaESilenceVideo">' + _("Silencio") + ':</label>\
                                            <input id="ocaESilenceVideo" type="text" value="00:00:00" maxlength="8"" />\
                                            <label for="ocaETimeSilence">' + _("Time (s)") + ':</label>\
                                            <input type="number" name="ocaETimeSilence" id="ocaETimeSilence" value="0" min="0" max="120" /> \
                                        </div>\
                                        <div>\
                                            <label for="ocaECheckSoundVideo">' + _("Audio") + ':</label>\
                                            <input id="ocaECheckSoundVideo" type="checkbox" checked="checked" />\
                                            <label for="ocaECheckImageVideo">' + _("Image") + ':</label>\
                                            <input id="ocaECheckImageVideo" type="checkbox" checked="checked" />\
                                        </div>\
                                    </div>\
                                    <div class="gameQE-EAuthorAlt" id="ocaEAuthorAlt">\
                                        <div class="gameQE-EInputAuthor" id="ocaInputAuthor">\
                                            <label for="ocaEAuthor">' + _("Author") + '</label>\
                                            <input id="ocaEAuthor" type="text" />\
                                        </div>\
                                        <div class="gameQE-EInputAlt" id="ocaInputAlt">\
                                            <label for="ocaEAlt">' + _("Alternative text") + '</label>\
                                            <input id="ocaEAlt" type="text" />\
                                        </div>\
                                    </div>\
                                    <span id="ocaETitleAudio">' + _("Audio") + '</span>\
                                    <div class="gameQE-EInputAudio" id="ocaEInputAudio">\
                                        <label class="sr-av" for="ocaEURLAudio">' + _("URL") + '</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLAudio"  id="ocaEURLAudio"/>\
                                        <a href="#" id="ocaEPlayAudio" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="' + _("Play") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                </div>\
                                <div class="gameQE-EMultiMediaOption">\
                                    <div class="gameQE-EMultimedia" id="ocaEMultimedia">\
                                        <textarea id="ocaEText"></textarea>\
                                        <img class="gameQE-EMedia" src="' + path + "quextIEImage.png" + '" id="ocaEImage" alt="' + _("Image") + '" />\
                                        <img class="gameQE-EMedia" src="' + path + "quextIEImage.png" + '" id="ocaENoImage" alt="' + _("No image") + '" />\
                                        <div class="gameQE-EMedia" id="ocaEVideo"></div>\
                                        <img class="gameQE-EMedia" src="' + path + "quextIENoImageVideo.png" + '" id="ocaENoImageVideo" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + "quextIENoVideo.png" + '" id="ocaENoVideo" alt="" />\
                                        <img class="gameQE-ECursor" src="' + path + "quextIECursor.gif" + '" id="ocaECursor" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + "quextIECoverOca.png" + '" id="ocaECover" alt="' + _("No image") + '" />\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EContents">\
                                <div <div id="ocaESolitionOptions"><span>' + _("Solution") + ': </span><span id="ocaESolutionSelect"></span></div>\
                                <div class="gameQE-EQuestionDiv" id="ocaEQuestionDiv">\
                                    <label class="sr-av">' + _("Question") + ':</label><input type="text" class="gameQE-EQuestion" id="ocaEQuestion">\
                                </div>\
                                <div class="gameQE-EAnswers" id="ocaEAnswers">\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="checkbox" class="gameQE-ESolution" name="slcsolution" id="ocaESolution0" value="A" />\
                                        <label >A</label><input type="text" class="gameQE-EOption0 gameQE-EAnwersOptions" id="ocaEOption0">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="checkbox" class="gameQE-ESolution" name="slcsolution" id="ocaESolution1" value="B" />\
                                        <label >B</label><input type="text" class="gameQE-EOption1 gameQE-EAnwersOptions"  id="ocaEOption1">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="checkbox" class="gameQE-ESolution" name="slcsolution" id="ocaESolution2" value="C" />\
                                        <label >C</label><input type="text" class="gameQE-EOption2 gameQE-EAnwersOptions"  id="ocaEOption2">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="checkbox"  class="gameQE-ESolution" name="slcsolution" id="ocaESolution3" value="D" />\
                                        <label >D</label><input type="text" class="gameQE-EOption3 gameQE-EAnwersOptions"  id="ocaEOption3">\
                                    </div>\
                                </div>\
                                <div class="gameQE-EWordDiv gameQE-DP" id="ocaEWordDiv">\
                                <div class="gameQE-ESolutionWord"><label for="ocaESolutionWord">' + _("Word/Phrase") + ': </label><input type="text"  id="ocaESolutionWord"/></div>\
                                <div class="gameQE-ESolutionWord"><label for="ocaEDefinitionWord">' + _("Definition") + ': </label><input type="text"  id="ocaEDefinitionWord"/></div>\
                            </div>\
                            </div>\
                            <div class="gameQE-ENavigationButtons">\
                                <a href="#" id="ocaEAdd" class="gameQE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + "quextIEAdd.png" + '"  alt="' + _("Add question") + '" class="gameQE-EButtonImage b-add" /></a>\
                                <a href="#" id="ocaEFirst" class="gameQE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + "quextIEFirst.png" + '"  alt="' + _("First question") + '" class="gameQE-EButtonImage b-first" /></a>\
                                <a href="#" id="ocaEPrevious" class="gameQE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + "quextIEPrev.png" + '"  alt="' + _("Previous question") + '" class="gameQE-EButtonImage b-prev" /></a>\
                                <span class="sr-av">' + _("Question number:") + '</span><span class="gameQE-NumberQuestion" id="ocaNumberQuestion">1</span>\
                                <a href="#" id="ocaENext" class="gameQE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + "quextIENext.png" + '"  alt="' + _("Next question") + '" class="gameQE-EButtonImage b-next" /></a>\
                                <a href="#" id="ocaELast" class="gameQE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + "quextIELast.png" + '"  alt="' + _("Last question") + '" class="gameQE-EButtonImage b-last" /></a>\
                                <a href="#" id="ocaEDelete" class="gameQE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + "quextIEDelete.png" + '"  alt="' + _("Delete question") + '" class="gameQE-EButtonImage b-delete" /></a>\
                                <a href="#" id="ocaECopy" class="gameQE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + "quextIECopy.png" + '"   alt="' + _("Copy question") + '" class="gameQE-EButtonImage b-copy" /></a>\
                                <a href="#" id="ocaECut" class="gameQE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + "quextIECut.png" + '"  alt="' + _("Cut question") + '"  class="gameQE-EButtonImage b-cut" /></a>\
                                <a href="#" id="ocaEPaste" class="gameQE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + "quextIEPaste.png" + '"  alt="' + _("Paste question") + '" class="gameQE-EButtonImage b-paste" /></a>\
                            </div>\
                            <div class="gameQE-ENumQuestionDiv" id="ocaENumQuestionDiv">\
                               <div class="gameQE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="gameQE-ENumQuestions" id="ocaENumQuestions">0</span>\
                            </div>\
                        </div>\
                 </div>\
				' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
		    </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeDevice.loadYoutubeApi();
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        tinymce.init({
            selector: '#ocaEText',
            height: 157,
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
            content_css: "css/tinymce.css",
            setup: function (ed) {
                ed.on('init', function (e) {
                    $exeDevice.enableForm(field);
                });
            }
        });
        $('#eXeGamePercentajeClue option[value=100]').attr('selected', 'selected');
        $('#labelPercentajeClue').hide();
        $('#eXeGamePercentajeClue').hide();
        $('#eXeGameSCORMButtonSave').hide();
        $('label[for="eXeGameSCORMButtonSave"]').hide();
    },
    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
    },
    initQuestions: function () {
        $('#ocaEInputVideo').css('display', 'flex');
        $('#ocaEInputImage').css('display', 'flex');
        $("#ocaMediaNormal").prop("disabled", false);
        $("#ocaMediaImage").prop("disabled", false);
        $("#ocaMediaText").prop("disabled", false);
        if ($exeDevice.selectsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.selectsGame.push(question);
            this.changeTypeQuestion(0)
            this.showOptions(4);
            this.showSolution('');
        }
        $exeDevice.showTypeQuestion(0);
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
        p.solution = '';
        p.silentVideo = 0;
        p.tSilentVideo = 0;
        p.solutionQuestion = '';
        p.percentageShow = 35;
        p.audio = '';
        return p;
    },
    loadPreviousValues: function (field) {

        var originalHTML = field.val();
        if (originalHTML != '') {
            var json = {},
                dataGame = {};
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var textJson = $('.oca-DataGame', wrapper).text();
            if (textJson.indexOf('Oca') != -1) {
                dataGame = $exeDevice.isJsonString(textJson);
                dataGame = $exeDevice.Decrypt1(dataGame);
            } else {
                json = $exeDevice.Decrypt(textJson);
                dataGame = $exeDevice.isJsonString(json);
            }
            var $imagesLink = $('.oca-LinkImages', wrapper),
                $audiosLink = $('.oca-LinkAudios', wrapper);
            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.selectsGame.length) {
                    dataGame.selectsGame[iq].url = $(this).attr('href');
                    if (dataGame.selectsGame[iq].url.length < 4 && dataGame.selectsGame[iq].type == 1) {
                        dataGame.selectsGame[iq].url = "";
                    }
                }
            });
            for (var i = 0; i < dataGame.selectsGame.length; i++) {
                dataGame.selectsGame[i].audio = typeof dataGame.selectsGame[i].audio == "undefined" ? "" : dataGame.selectsGame[i].audio;
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
            for (var i = 0; i < dataGame.selectsGame.length; i++) {
                if (dataGame.selectsGame[i].type == 3) {
                    dataGame.selectsGame[i].eText = unescape(dataGame.selectsGame[i].eText);
                }
            }
            $exeDevice.selectsGame = dataGame.selectsGame;
            var instructions = $(".oca-instructions", wrapper);
            if (instructions.length == 1) tinyMCE.get('eXeGameInstructions').setContent(instructions.html());
            // i18n
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.updateFieldGame(dataGame);

        }
    },
    updateFieldGame: function (game) {

        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        $('#eXeGamePercentajeClue option[value=100]').attr('selected', 'selected');
        $('#eXeGamePercentajeClue').val(100);
        game.answersRamdon = game.answersRamdon || false;
        $('#ocaEShowMinimize').prop('checked', game.showMinimize);
        $('#ocaEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#ocaEShowSolution').prop('checked', game.showSolution);
        $('#ocaETimeShowSolution').prop('disabled', !game.showSolution);
        $('#ocaETimeShowSolution').val(game.timeShowSolution);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.showQuestion($exeDevice.active);

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
        if (!$exeDevice.validateQuestion()) {
            return;
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
        var divContent = "";
        var instructions = tinyMCE.get('eXeGameInstructions').getContent();
        if (instructions != "") divContent = '<div class="oca-instructions">' + instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.selectsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.selectsGame);
        var html = '<div class="oca-IDevice">';
        html += divContent;
        html += '<div class="oca-DataGame js-hidden">' + $exeDevice.Encrypt(dataGame) + '</div>';
        html += linksImages;
        html += linksAudios;
        html += '<div class="oca-bns js-hidden">' +$exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        if (html.length > 650000) {
            $exeDevice.showMessage($exeDevice.msgs.tooManyQuestions);
            return false;
        }

        return html;
    },
    Encrypt: function (game) {
        var quextions = [];
        for (var i = 0; i < game.selectsGame.length; i++) {
            var mquestion = $exeDevice.getCuestionEncriptada(game.selectsGame[i]);
            quextions.push(mquestion);
        }
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Oca',
            'endVideo': game.endVideo,
            'idVideo': game.idVideo,
            'startVideo': game.idVideo,
            'instructionsExe': game.instructionsExe,
            'instructions': game.instructions,
            'showMinimize': game.showMinimize,
            'optionsRamdon': game.optionsRamdon,
            'answersRamdon': game.answersRamdon,
            'showSolution': game.showSolution,
            'timeShowSolution': game.timeShowSolution,
            'useLives': game.useLives,
            'numberLives': game.numberLives,
            'itinerary': game.itinerary,
            'selectsGame': quextions,
            'isScorm': game.isScorm,
            'textButtonScorm': game.textButtonScorm,
            'repeatActivity': game.repeatActivity,
            'title': '',
            'customScore': game.customScore,
            'textAfter': game.textAfter,
            'msgs': game.msgs,
            "versionGameOca": game.versionGameOca
        }

        return JSON.stringify(data);
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

    Decrypt1: function (game) {
        var selectsGame = []
        for (var i = 0; i < game.selectsGame.length; i++) {
            var mquestion = $exeDevice.getCuestionDesEncriptada(game.selectsGame[i]);
            selectsGame.push(mquestion);
        }
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Oca',
            'endVideo': game.endVideo,
            'idVideo': game.idVideo,
            'startVideo': game.idVideo,
            'instructionsExe': game.instructionsExe,
            'instructions': game.instructions,
            'showMinimize': game.showMinimize,
            'optionsRamdon': game.optionsRamdon,
            'answersRamdon': game.answersRamdon,
            'showSolution': game.showSolution,
            'timeShowSolution': game.timeShowSolution,
            'useLives': game.useLives,
            'numberLives': game.numberLives,
            'itinerary': game.itinerary,
            'msgs': game.msgs,
            'selectsGame': selectsGame,
            'isScorm': game.isScorm,
            'textButtonScorm': game.textButtonScorm,
            'repeatActivity': game.repeatActivity,
            'title': '',
            'customScore': game.customScore,
            'textAfter': game.textAfter,
            "versionGameOca": game.versionGameOca
        }

        return data;
    },

    getCuestionEncriptada: function (q) {
        var p = new Object();
        p.a = q.alt;
        p.b = q.silentVideo;
        p.c = q.typeSelect;
        p.d = q.tSilentVideo;
        p.f = q.iVideo;
        p.g = q.percentageShow;
        p.h = q.author;
        p.i = q.imageVideo;
        p.j = q.soundVideo;
        p.m = q.time;
        p.n = q.numberOptions;
        p.o = [];
        p.o.push(q.options[0]);
        p.o.push(q.options[1]);
        p.o.push(q.options[2]);
        p.o.push(q.options[3]);
        p.p = q.type;
        p.q = q.quextion;
        p.r = window.btoa(escape(q.solutionQuestion));
        p.s = window.btoa(escape(q.quextion.length + '' + q.solution));
        p.t = q.eText;
        p.u = q.url;
        p.x = q.x;
        p.y = q.y;
        p.z = q.fVideo;
        p.ad = q.audio;
        return p;
    },

    getCuestionDesEncriptada: function (q) {
        var p = new Object(),
            qs = unescape(window.atob(q.s)),
            len = q.q.length.toString();
        len = len.length;
        qs = qs.slice(len);
        p.alt = q.a;
        p.silentVideo = q.b;
        p.typeSelect = q.c;
        p.tSilentVideo = q.d;
        p.iVideo = q.f;
        p.percentageShow = q.g;
        p.author = q.h;
        p.imageVideo = q.i;
        p.soundVideo = q.j;
        p.time = q.m;
        p.numberOptions = q.n;
        p.options = [];
        p.options.push(q.o[0]);
        p.options.push(q.o[1]);
        p.options.push(q.o[2]);
        p.options.push(q.o[3]);
        p.type = q.p;
        p.quextion = q.q;
        p.solutionQuestion = unescape(window.atob(q.r));
        p.solution = qs;
        p.eText = q.t;
        p.url = q.u;
        p.x = q.x;
        p.y = q.y;
        p.fVideo = q.z;
        p.adudio = q.ad;
        return p;
    },

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.type = parseInt($('input[name=slcmediatype]:checked').val());
        p.time = parseInt($('input[name=slctime]:checked').val());
        p.numberOptions = parseInt($('input[name=slcnumber]:checked').val());
        p.typeSelect = parseInt($('input[name=slctypeselect]:checked').val())
        p.x = parseFloat($('#ocaEXImage').val());
        p.y = parseFloat($('#ocaEYImage').val());;
        p.author = $('#ocaEAuthor').val();
        p.alt = $('#ocaEAlt').val();
        p.customScore = 1;
        p.url = $('#ocaEURLImage').val().trim();
        if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#ocaEURLYoutube').val().trim()) ? $('#ocaEURLYoutube').val() : '';
        }
        p.audio = $('#ocaEURLAudio').val();
        $exeDevice.stopSound();
        $exeDevice.stopVideo()
        p.soundVideo = $('#ocaECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#ocaECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#ocaEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#ocaEEndVideo').val().trim());
        p.silentVideo = $exeDevice.hourToSeconds($('#ocaESilenceVideo').val().trim());
        p.tSilentVideo = parseInt($('#ocaETimeSilence').val());
        p.eText = tinyMCE.get('ocaEText').getContent();
        p.quextion = $('#ocaEQuestion').val().trim();
        p.options = [];
        p.solution = $('#ocaESolutionSelect').text().trim();
        p.solutionQuestion = $('#ocaESolutionWord').val();
        p.percentageShow = parseInt($('#ocaPercentageShow').val());

        var optionEmpy = false;
        var validExt = ['mp3', 'ogg', 'wav'],
            extaudio = p.audio.split('.').pop().toLowerCase();
        $('.gameQE-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            p.options.push(option);
        });
        p.solutionQuestion = "";
        if (p.typeSelect == 2) {
            p.quextion = $('#ocaEDefinitionWord').val().trim();
            p.solution = "";
            p.solutionQuestion = $('#ocaESolutionWord').val();
        }
        if (p.typeSelect == 1 && p.solution.length != p.numberOptions) {
            message = msgs.msgTypeChoose;
        } else if (p.quextion.length == 0) {
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
        } else if (p.type == 2 && !$exeDevice.validTime($('#ocaEInitVideo').val()) || !$exeDevice.validTime($('#ocaEEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        } else if (p.type == 2 && p.tSilentVideo > 0 && !$exeDevice.validTime($('#ocaESilenceVideo').val())) {
            message = msgs.msgTimeFormat;
        } else if (p.type == 2 && p.tSilentVideo > 0 && (p.silentVideo < p.iVideo || p.silentVideo >= p.fVideo)) {
            message = msgs.msgSilentPoint;
        } else if (p.typeSelect == 2 && p.solutionQuestion.trim().length == 0) {
            message = $exeDevice.msgs.msgProvideSolution;
        } else if (p.typeSelect == 2 && p.solutionQuestion.trim().length == 0) {
            message = $exeDevice.msgs.msgEDefintion;
        } else if (p.typeSelect == 2 && p.quextion.trim().length == 0) {
            message = $exeDevice.msgs.msgEProvideWord;
        }

        if (p.audio.length > 0 && validExt.indexOf(extaudio) == -1) {
            message = _("Supported formats") + '. ' + _('Audio') + ": mp3, ogg, wav";
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
                linkImage = '<a href="' + selectsGame[i].url + '" class="js-hidden oca-LinkImages">' + i + '</a>';
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
                linkaudio = '<a href="' + selectsGame[i].audio + '" class="js-hidden oca-LinkAudios">' + i + '</a>';
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
            return false;
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
        link.download = _("Game") + "Oca.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'Oca') {
            $exeDevice.selectsGame = $exeDevice.importSelecciona(game);
            $exeDevice.updateFieldGame(game);
            var instructions = game.instructionsExe || game.instructions;
            tinymce.editors[0].setContent(unescape(instructions));
        } else if (game.typeGame == 'Selecciona') {
            $exeDevice.selectsGame = $exeDevice.importSelecciona(game);
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
    importSelecciona: function (data) {
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
            p.solution = '';
            p.silentVideo = 0;
            p.tSilentVideo = 0;
            p.solutionQuestion = cuestion.word;
            p.percentageShow = cuestion.percentageShow || data.percentageShow;
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
    validateData: function () {
        var clear = $exeDevice.removeTags,
            // instructions = escape($("#eXeGameInstructions").html())
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            textAfter = '',
            showMinimize = $('#ocaEShowMinimize').is(':checked'),
            optionsRamdon = true,
            answersRamdon = $('#ocaEAnswersRamdon').is(':checked'),
            showSolution = $('#ocaEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#ocaETimeShowSolution').val())),
            useLives = false,
            numberLives = 3,
            idVideo = '',
            endVideo = 0,
            startVideo = 0,
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            customScore = false;
        if (!itinerary) return false;
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        var selectsGame = $exeDevice.selectsGame;
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
            if (qt.type == 1 && qt.url.length < 8) {
                qt.x = 0
                qt.y = 0;
                qt.author = '';
                qt.alt = '';
            } else if (qt.type == 2 && qt.url.length < 8) {
                qt.iVideo = 0
                qt.fVideo = 0;
                qt.author = '';
                qt.alt = '';
            } else if (qt.type == 3) {
                qt.eText = escape(qt.eText);
            }
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Oca',
            'endVideo': endVideo,
            'idVideo': idVideo,
            'startVideo': startVideo,
            'instructionsExe': instructionsExe,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'optionsRamdon': optionsRamdon,
            'answersRamdon': answersRamdon,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
            'useLives': useLives,
            'numberLives': numberLives,
            'itinerary': itinerary,
            'selectsGame': selectsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'title': '',
            'customScore': customScore,
            'textAfter': textAfter,
            'versionGameOca': 2
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
            $('#ocaEAnswers').hide();
            $('#ocaEQuestionDiv').hide();
            $('#gameQEIdeviceForm .gameQE-ESolutionSelect').hide();
            $('#ocaOptionsNumberSpan').hide();
            $('#ocaEInputNumbers').hide();
            $('#ocaPercentageSpan').show();
            $('#ocaPercentage').show();
            $('#ocaEWordDiv').show();
            $('#ocaESolitionOptions').hide();
        } else {
            $('#ocaEAnswers').show();
            $('#ocaEQuestionDiv').show();
            $('#gameQEIdeviceForm .gameQE-ESolutionSelect').show();
            $('#ocaOptionsNumberSpan').show();
            $('#ocaEInputNumbers').show();
            $('#ocaPercentageSpan').hide();
            $('#ocaPercentage').hide();
            $('#ocaEWordDiv').hide();
            $('#ocaESolitionOptions').show();
        }
    },
    addEvents: function () {
        $('#ocaEPaste').hide();

        $('#ocaEInitVideo, #ocaEEndVideo, #ocaESilenceVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#ocaEInitVideo, #ocaEEndVideo, #ocaESilenceVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });

        });
        $('#ocaShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#ocaCodeAccess').prop('disabled', !marcado);
            $('#ocaMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-TypeSelect', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.showTypeQuestion(type);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#ocaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#ocaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#ocaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#ocaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#ocaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#ocaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#ocaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#ocaECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#ocaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });

        $('#ocaEPlayVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.showVideoQuestion();
        });

        $(' #ocaECheckSoundVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });
        $('#ocaECheckImageVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });

        $('#ocaETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#ocaETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#ocaETimeSilence').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#ocaPercentageShow').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#ocaPercentageShow').on('focusout', function () {
            this.value = this.value.trim() == '' ? 35 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        $('#ocaECursor').on('click', function (e) {
            $(this).hide();
            $('#ocaEXImage').val(0);
            $('#ocaEYImage').val(0);
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

        $('#ocaEInitVideo').css('color', '#2c6d2c');
        $('#ocaEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#ocaEInitVideo').css('color', '#2c6d2c');
            $('#ocaEEndVideo').css('color', '#000000');
            $('#ocaESilenceVideo').css('color', '#000000');
        });
        $('#ocaEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#ocaEEndVideo').css('color', '#2c6d2c');
            $('#ocaEInitVideo').css('color', '#000000');
            $('#ocaESilenceVideo').css('color', '#000000');
        });
        $('#ocaESilenceVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 2;
            $('#ocaESilenceVideo').css('color', '#2c6d2c');
            $('#ocaEEndVideo').css('color', '#000000');
            $('#ocaEInitVideo').css('color', '#000000');
        });


        $('#ocaEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#ocaEInitVideo');
                    break;
                case 1:
                    $timeV = $('#ocaEEndVideo');
                    break;
                case 2:
                    $timeV = $('#ocaESilenceVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#ocaEVideoTime').text());
            $timeV.css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });

        $('#ocaUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#ocaNumberLives').prop('disabled', !marcado);
        });
        $('#ocaEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#ocaETimeShowSolution').prop('disabled', !marcado);
        });

        $('.gameQE-ESolution').on('change', function (e) {
            var marcado = $(this).is(':checked'),
                value = $(this).val();
            $exeDevice.clickSolution(marcado, value);
        });

        $('#ocaEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#ocaEAlt').val(),
                x = parseFloat($('#ocaEXImage').val()),
                y = parseFloat($('#ocaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#ocaEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#ocaEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#ocaEAlt').val(),
                x = parseFloat($('#ocaEXImage').val()),
                y = parseFloat($('#ocaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#ocaEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });

        $('#ocaEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var validExt = ['mp3', 'ogg', 'wav'],
                selectedFile = $('#ocaEURLAudio').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if (validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": mp3, ogg, wav");
            } else {
                if (selectedFile.length > 4) {
                    $exeDevice.stopSound();
                    $exeDevice.playSound(selectedFile);
                }
            }
        });

        $('#ocaEURLAudio').on('change', function () {
            var validExt = ['mp3', 'ogg', 'wav'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if (this.value.length > 0 && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": mp3, ogg, wav");
            } else {
                if (selectedFile.length > 4) {
                    $exeDevice.stopSound();
                    $exeDevice.playSound(selectedFile);
                }
            }
        });

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

    },
    setInputFilter: function (textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
            textbox.addEventListener(event, function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = "";
                }
            });
        });
    },
    validateScoreQuestion: function (text) {
        var isValid = text.length > 0 && text !== '.' && text !== ',' && /^-?\d*[.,]?\d*$/.test(text);
        return isValid;
    },
    validateHhMm: function (text) {
        var isValid = text.length > 0 && /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(text);
        return isValid;
    },

    clickSolution: function (checked, value) {
        var solutions = $('#ocaESolutionSelect').text();

        if (checked) {
            if (solutions.indexOf(value) == -1) {
                solutions += value;
            }
        } else {
            solutions = solutions.split(value).join('')
        }
        $('#ocaESolutionSelect').text(solutions);
    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#ocaECursor'),
            $x = $('#ocaEXImage'),
            $y = $('#ocaEYImage'),
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
}