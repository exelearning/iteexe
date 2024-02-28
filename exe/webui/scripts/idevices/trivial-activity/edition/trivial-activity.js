/**
 * Select Activity iDevice (edition code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno, Francisco Javier Pulido
 * Testers: Ricardo Málaga Floriano, Francisco Muñoz de la Peña
 * Translator: Antonio Juan Delgado García
 * Versión: 2.0
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    // i18n
    i18n: {
        name: _('Trivia')
    },
    iDevicePath: "/scripts/idevices/trivial-activity/edition/",
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
    numeroTemas: 2,
    nombresTemas: ['Tema 1', 'Tema 2', 'Tema 3', 'Tema 4', 'Tema 5', 'Tema 6'],
    temas: [],
    temasJson: [],
    activeTema: 0,
    activesQuestions: [0, 0, 0, 0, 0, 0],
    trivialID: 0,
    localPlayer: null,
    id: false,
    ci18n: {
        "msgStartGame": _("Click here to start"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("Game Over!"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
        "msgCodeAccess": _("Access code"),
        "msgPlayStart": _("Click here to play"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time per question"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNoImage": _("No picture question"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgNotNetwork": _("You can only play this game with internet connection."),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Check"),
        "msgInformation": _("Information"),
        "msgAuthor": _("Authorship"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgOption": _("Option"),
        "msgImage": _("Image"),
        "msgOrders": _("Please order the answers"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgGameStarted": _("The game has already started."),
        "msgPlayersName": _("You must indicate a name for all the selected players."),
        "msgReboot": _("Do you want to restart the game?"),
        "msgRoolDice": _("roll the dice."),
        "msgsWinner": _("The game has finished. The winner is %1. Do you want to play again?"),
        "msgWinGame": _("Cool! You won the game."),
        "msgsYouPlay": _("you play. Roll the dice."),
        "msgSaveDiceAuto": _("Your score will be automatically saved after each throw."),
        "msgOnlyFirstGame": _("You can only play once."),
        "msgGamers": _("Players"),
        "msgReply": _("Answer"),
        "msgErrorQuestion": _("you have failed."),
        "msgsYouPlay": _("you play. Roll the dice."),
        "msgGetQueso": _("you get the cheese of"),
        "msgRightAnswre": _("One more point."),
        "msgAudio": _("Audio"),
        "msgCorrect": _("Correct"),
        "msgIncorrect": _("Incorrect"),
        "msgUncompletedActivity": _("Incomplete activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %s"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %s"),
        "msgNext": _('Next'),
        "msgTypeGame": _('Trivia')
    },
    getId: function () {
        return Math.round(new Date().getTime() + (Math.random() * 100));
    },
    init: function () {
        this.setMessagesInfo();
        this.createForm();
    },
    enableForm: function (field) {
        $exeDevice.trivialID = $exeDevice.getId();
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
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Please type or paste a valid URL.");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgStartWith = _("Starts with %1");
        msgs.msgContaint = _("Contains letter %1");
        msgs.msgVideoNotAvailable = _("This video is not currently available");
        msgs.msgSilentPoint = _("The silence time is wrong. Check the video duration.");
        msgs.msgTypeChoose = _("Please check all the answers in the right order");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideSolution = _("Please write the solution");
        msgs.msgNameThemes = _('You must indicate a name for all the selected topics.');
        msgs.msgCmpleteAllQuestions = _('You must complete all the questions of all the selected topics correctly.');
        msgs.msgGameIntrunctions = _("Roll the dice and answer the question until you complete all the cheeses.");
        msgs.tooManyQuestions = _("Too many questions! The game can have a maximum of about 800 and 1200 questions. This number can vary a lot depending on the type of questions and the length of the questions, the answers, the URLs and the enriched text.");
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgIDLenght = _('The report identifier must have at least 5 characters');


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
        $("#trivialMediaVideo").prop("disabled", false);
        $exeDevice.player = new YT.Player('trivialEVideo', {
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
                $('#trivialEVideoTime').text(time);
                $exeDevice.updateSoundVideo();
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },

    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video  no está disponible")

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
    updateTimerDisplayLocal: function () {
        if ($exeDevice.localPlayer) {
            var currentTime = $exeDevice.localPlayer.currentTime;
            if (currentTime) {
                var time = $exeDevice.secondsToHour(Math.floor(currentTime));
                $('#trivialEVideoTime').text(time);
                $exeDevice.updateSoundVideoLocal();
                if (Math.ceil(currentTime) == $exeDevice.pointEnd || Math.ceil(currentTime) == $exeDevice.durationVideo) {
                    $exeDevice.localPlayer.pause();
                    $exeDevice.pointEnd = 100000;
                }
            }
        }
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
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },
    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.temas[$exeDevice.activeTema].push($exeDevice.getCuestionDefault());
            $exeDevice.activesQuestions[$exeDevice.activeTema] = $exeDevice.temas[$exeDevice.activeTema].length - 1;
            $('#trivialNumberQuestion').val($exeDevice.temas[$exeDevice.activeTema].length);
            $exeDevice.typeEdit = -1;
            $('#trivialEPaste').hide();
            $('#trivialENumQuestions').val($exeDevice.temas[$exeDevice.activeTema].length);
        }
    },
    removeQuestion: function (num) {
        if ($exeDevice.temas[$exeDevice.activeTema].length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.temas[$exeDevice.activeTema].splice($exeDevice.activesQuestions[$exeDevice.activeTema], 1);
            if ($exeDevice.activesQuestions[$exeDevice.activeTema] >= $exeDevice.temas[$exeDevice.activeTema].length - 1) {
                $exeDevice.activesQuestions[$exeDevice.activeTema] = $exeDevice.temas[$exeDevice.activeTema].length - 1;
            }
            $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
            $exeDevice.typeEdit = -1;
            $('#trivialEPaste').hide();
            $('#trivialENumQuestions').text($exeDevice.temas[$exeDevice.activeTema].length);
            $('#trivialNumberQuestion').text($exeDevice.activesQuestions[$exeDevice.activeTema] + 1);
        }

    },
    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            var active = $exeDevice.activesQuestions[$exeDevice.activeTema];
            $exeDevice.clipBoard = $exeDevice.temas[$exeDevice.activeTema][active];
            $('#trivialEPaste').show();
        }

    },
    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.activesQuestions[$exeDevice.activeTema];
            $exeDevice.typeEdit = 1;
            $('#trivialEPaste').show();

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
            $exeDevice.activesQuestions[$exeDevice.activeTema]++;
            $exeDevice.temas[$exeDevice.activeTema].splice($exeDevice.activesQuestions[$exeDevice.activeTema], 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
        } else if ($exeDevice.typeEdit == 1) {
            $('#trivialEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.temas[$exeDevice.activeTema], $exeDevice.numberCutCuestion, $exeDevice.activesQuestions[$exeDevice.activeTema]);
            $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
            $('#trivialENumQuestions').text($exeDevice.temas[$exeDevice.activeTema].length);
        }
    },
    nextQuestion: function () {

        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.activesQuestions[$exeDevice.activeTema] < $exeDevice.temas[$exeDevice.activeTema].length - 1) {
                $exeDevice.activesQuestions[$exeDevice.activeTema]++;
                $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
            }
        }
    },
    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.activesQuestions[$exeDevice.activeTema] < $exeDevice.temas[$exeDevice.activeTema].length - 1) {
                $exeDevice.activesQuestions[$exeDevice.activeTema] = $exeDevice.temas[$exeDevice.activeTema].length - 1;
                $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
            }
        }
    },
    previousQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.activesQuestions[$exeDevice.activeTema] > 0) {
                $exeDevice.activesQuestions[$exeDevice.activeTema]--;
                $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
            }
        }
    },
    firstQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.activesQuestions[$exeDevice.activeTema] > 0) {
                $exeDevice.activesQuestions[$exeDevice.activeTema] = 0;
                $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
            }
        }
    },
    validarTemas: function () {
        for (var j = 0; j < $exeDevice.numeroTemas; j++) {
            for (var i = 0; i < $exeDevice.temas[j].length; i++) {
                var cuestion = $exeDevice.temas[j][i];
                if (cuestion.pregunta.length == 0) {
                    return false;
                }
                if (cuestion.typeSelect == 0) {
                    for (var z = 0; z < cuestion.numberOptions; z++) {
                        if (cuestion.options[z].length == 0) {
                            return false;
                        }
                    }
                } else if (cuestion.typeSelect == 1) {
                    if (cuestion.solution.length != cuestion.numberOptions) {
                        return false;
                    }
                } else if (cuestion.typeSelect == 2) {
                    if (cuestion.solutionQuestion.length == 0) {
                        return false;
                    }
                }else if (cuestion.typeSelect == 3) {
                    if (cuestion.solutionQuestion.length == 0) {
                        cuestion.solutionQuestion='open'
                    }
                }
            }
        }
        return true;
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.temas[$exeDevice.activeTema].length ? $exeDevice.temas[$exeDevice.activeTema].length - 1 : num;
        var p = $exeDevice.temas[$exeDevice.activeTema][num];
        var numOptions = 0;
        p.typeSelect = p.typeSelect ? p.typeSelect : 0;
        p.solutionQuestion = p.solutionQuestion ? p.solutionQuestion : '';
        p.percentageShow = p.percentageShow ? p.percentageShow : 35;
        if (p.typeSelect < 2) {
            $('.gameQE-EAnwersOptions').each(function (j) {
                numOptions++;
                if (p.options[j].trim() !== '') {
                    p.numOptions = numOptions;
                }
                $(this).val(p.options[j]);
            });
        } else {
            $('#trivialESolutionWord').val(p.solutionQuestion);
            $('#trivialPercentageShow').val(p.percentageShow);
            $('#trivialEDefinitionWord').val(p.quextion);
        }
        $exeDevice.stopVideo();
        $exeDevice.showTypeQuestion(p.typeSelect);
        $exeDevice.changeTypeQuestion(p.type);
        $exeDevice.showOptions(p.numberOptions);
        $('#trivialEQuestion').val(p.quextion);
        $('#trivialENumQuestions').text($exeDevice.temas[$exeDevice.activeTema].length);
        if (p.type == 1) {
            $('#trivialEURLImage').val(p.url);
            $('#trivialEXImage').val(p.x);
            $('#trivialEYImage').val(p.y);
            $('#trivialEAuthor').val(p.author);
            $('#trivialEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#trivialECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#trivialECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#trivialEURLYoutube').val(p.url);
            $('#trivialEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#trivialEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $('#trivialESilenceVideo').val($exeDevice.secondsToHour(p.silentVideo));
            $('#trivialETimeSilence').val(p.tSilentVideo);
            $exeDevice.silentVideo = p.silentVideo;
            $exeDevice.tSilentVideo = p.tSilentVideo;
            $exeDevice.activeSilent = (p.soundVideo == 1) && (p.tSilentVideo > 0) && (p.silentVideo >= p.iVideo) && (p.iVideo < p.fVideo);
            $exeDevice.endSilent = p.silentVideo + p.tSilentVideo;
            if ($exeDevice.getIDYoutube(p.url)) {
                $exeDevice.showVideoQuestion();
            } else if ($exeDevice.getURLVideoMediaTeca(p.url)) {
                $exeDevice.showVideoQuestion();
            }
        } else if (p.type == 3) {
            tinyMCE.get('trivialEText').setContent(unescape(p.eText));
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
        $('#trivialEURLAudio').val(p.audio);
        $('#trivialNumberQuestion').val(i + 1);
        $("input.gameQE-Number[name='tvlnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.gameQE-Type[name='tvlmediatype'][value='" + p.type + "']").prop("checked", true);
        $exeDevice.checkQuestions(p.solution);
        $("input.gameQE-Times[name='tvltime'][value='" + p.time + "']").prop("checked", true);
        $("input.gameQE-TypeSelect[name='tvltypeselect'][value='" + p.typeSelect + "']").prop("checked", true);

    },
    checkQuestions: function (solution) {
        $("input.gameQE-ESolution[name='tvlsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $("input.gameQE-ESolution[name='tvlsolution'][value='" + sol + "']").prop("checked", true);
        }
        $('#trivialESolutionSelect').text(solution);

    },
    showVideoQuestion: function () {
        var soundVideo = $('#trivialECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#trivialECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#trivialEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#trivialEEndVideo').val()),
            url = $('#trivialEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url),
            idLocal = $exeDevice.getURLVideoMediaTeca(url),
            type = id ? 0 : 1;
        $exeDevice.silentVideo = $exeDevice.hourToSeconds($('#trivialESilenceVideo').val().trim());
        $exeDevice.tSilentVideo = parseInt($('#trivialETimeSilence').val());
        $exeDevice.activeSilent = (soundVideo == 1) && ($exeDevice.tSilentVideo > 0) && ($exeDevice.silentVideo >= iVideo) && (iVideo < fVideo);
        $exeDevice.endSilent = $exeDevice.silentVideo + $exeDevice.tSilentVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#trivialENoImageVideo').hide();
        $('#trivialENoVideo').show();
        $('#trivialEVideo').hide();
        $('#trivialEVideoLocal').hide();
        if (id || idLocal) {
            if (id) {
                $exeDevice.startVideo(id, iVideo, fVideo, 0);
            } else {
                $exeDevice.startVideo(idLocal, iVideo, fVideo, 1);
            }
            $('#trivialENoVideo').hide();
            if (imageVideo == 0) {
                $('#trivialENoImageVideo').show();
            } else {
                if (type == 0) {
                    $('#trivialEVideo').show();
                } else {
                    $('#trivialEVideoLocal').show();
                }
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgVideoNotAvailable);
            $('#trivialENoVideo').show();
        }
    },
    playSound: function (selectedFile) {
        var selectFile = $exeDevice.extractURLGD(selectedFile);
        $exeDevice.playerAudio = new Audio(selectFile);
        $exeDevice.playerAudio.addEventListener("canplaythrough", function (event) {
            $exeDevice.playerAudio.play();
        });
    },

    stopSound: function () {
        if ($exeDevice.playerAudio && typeof $exeDevice.playerAudio.pause == "function") {
            $exeDevice.playerAudio.pause();
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
        var $image = $('#trivialEImage'),
            $cursor = $('#trivialECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#trivialENoImage').show();
        url = $exeDevice.extractURLGD(url);
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
                    $('#trivialENoImage').hide();
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
        $('#trivialEURLImage').val('');
        $('#trivialEXImage').val('0');
        $('#trivialEYImage').val('0');
        $('#trivialEAuthor').val('');
        $('#trivialEAlt').val('');
        $('#trivialEURLYoutube').val('');
        $('#trivialEInitVideo').val('00:00:00');
        $('#trivialEEndVideo').val('00:00:00');
        $('#trivialECheckSoundVideo').prop('checked', true);
        $('#trivialECheckImageVideo').prop('checked', true);
        $('#trivialESolutionSelect').text('');
        tinyMCE.get('trivialEText').setContent('');
        $('#trivialEQuestion').val('');
        $('#trivialESolutionWord').val('');
        $('#trivialESolutionWord').val('');
        $('#trivialEDefinitionWord').val('');
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
    changeNumberTemas: function (numt) {
        var value = $('#trivialNumberTema').val();
        $('#trivialNumberTema').prop('max', numt);
        if (value > numt) {
            $exeDevice.showTema(numt - 1);
        }
    },
    showTema: function (tema) {
        $exeDevice.activeTema = tema;
        $('#trivialNumberTema').val(tema + 1);
        $('#trivialNameTema').val($exeDevice.nombresTemas[tema]);
        $('#trivialLoadGame').val('');
        $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);

    },
    changeTypeQuestion: function (type) {

        $('#trivialETitleAltImage').hide();
        $('#trivialEAuthorAlt').hide();
        $('#trivialETitleImage').hide();
        $('#trivialEInputImage').hide();
        $('#trivialETitleVideo').hide();
        $('#trivialEInputVideo').hide();
        $('#trivialEInputOptionsVideo').hide();
        $('#trivialInputOptionsImage').hide();
        $('#trivialEInputAudio').show();
        $('#trivialETitleAudio').show();
        if (tinyMCE.get('trivialEText')) {
            tinyMCE.get('trivialEText').hide();
        }

        $('#trivialEText').hide();
        $('#trivialEVideo').hide();
        $('#trivialEVideoLocal').hide();
        $('#trivialEImage').hide();
        $('#trivialENoImage').hide();
        $('#trivialECover').hide();
        $('#trivialECursor').hide();
        $('#trivialENoImageVideo').hide();
        $('#trivialENoVideo').hide();
        switch (type) {
            case 0:
                $('#trivialECover').show();
                break;
            case 1:
                $('#trivialENoImage').show();
                $('#trivialETitleImage').show();
                $('#trivialEInputImage').show();
                $('#trivialEAuthorAlt').show();
                $('#trivialECursor').show();
                $('#trivialInputOptionsImage').show();
                $exeDevice.showImage($('#trivialEURLImage').val(), $('#trivialEXImage').val(), $('#trivialEYImage').val(), $('#trivialEAlt').val(), 0)
                break;
            case 2:
                $('#trivialEImageVideo').show();
                $('#trivialETitleVideo').show();
                $('#trivialEInputVideo').show();
                $('#trivialENoVideo').show();
                $('#trivialEVideo').show();
                $('#trivialEInputOptionsVideo').show();
                $('#trivialEInputAudio').hide();
                $('#trivialETitleAudio').hide();
                break;
            case 3:
                $('#trivialEText').show();
                if (tinyMCE.get('trivialEText')) {
                    tinyMCE.get('trivialEText').show();
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
        $("input.gameQE-ESolution[name='tvlsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $('.gameQE-ESolution')[solution].checked = true;
            $("input.gameQE-ESolution[name='tvlsolution'][value='" + sol + "']").prop("checked", true)
        }
        $('#trivialESolutionSelect').text(solution);


    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
            <div class="exe-idevice-info">' + _("Create an educational board game with different question types (test, order, definition) of different categories. From 1 to 4 players or teams.") + ' <a href="https://youtu.be/-NuWeVmebnA" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset($exeDevice.msgs.msgGameIntrunctions) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>' + _("Number of topics") + ': \
                                <input class="gameQE-NumeroTemas" checked="checked" id="trivialNG2" type="radio" name="tvlnt" value="2"  />\
                                <label>2</label>\
                                <input class="gameQE-NumeroTemas"  type="radio" name="tvlnt" value="3"  />\
                                <label">3</label>\
                                <input class="gameQE-NumeroTemas"   type="radio" name="tvlnt" value="4"  />\
                                <label>4</label>\
                                <input class="gameQE-NumeroTemas"  type="radio" name="tvlnt" value="5"  />\
                                <label>5</label>\
                                <input class="gameQE-NumeroTemas" type="radio" name="tvlnt" value="6"  />\
                                <label>6</label>\
                            </p>\
                            <p>\
                                <label for="trivialEShowMinimize"><input type="checkbox" id="trivialEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="trivialEShowSolution"><input type="checkbox" checked id="trivialEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="trivialETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="trivialETimeShowSolution" id="trivialETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <label for="trivialModeBoard"><input type="checkbox" id="trivialModeBoard"> ' + _("Digital blackboard mode") + ' </label>\
                            </p>\
                            <p>\
                                <strong class="GameModeLabel"><a href="#trivialEEvaluationHelp" id="trivialEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
								<label for="trivialEEvaluation"><input type="checkbox" id="trivialEEvaluation"> ' + _("Progress report") + '. </label> \
								<label for="trivialEEvaluationID">' + _("Identifier") + ':\
								<input type="text" id="trivialEEvaluationID" disabled/> </label>\
                            </p>\
                            <div id="trivialEEvaluationHelp" class="gameQE-TypeGameHelp">\
                                <p>' +_("You must indicate the ID. It can be a word, a phrase or a number of more than four characters. You will use this ID to mark the activities covered by this progress report. It must be the same in all iDevices of a report and different in each report.") + '</p>\
                            </div>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="gameQE-EPanel" id="trivialEPanel">\
                            <div class="gameQE-EOptionsMedia">\
                                <div class="gameQE-EOptionsGame">\
                                    <span>' + _("Topic") + ':</span>\
                                    <div class="gameQE-Flex gameQE-ENameTema">\
                                        <label class="sr-av">' + _("Topic number") + '</label> <input type="number" name="trivialNumberTema" id="trivialNumberTema" value="1" min="1" max="2" step="1" /> \
                                        <label class="sr-av">' + _("Topic number") + '</label> <input type="text" id="trivialNameTema" />\
                                    </div>\
                                    <span>' + _("Load") + ':</span>\
                                    <div>\
                                        <input type="file" name="trivialLoadGame" id="trivialLoadGame" accept=".json" />\
                                    </div>\
                                    <span>' + _("Type") + ':</span>\
                                    <div class="gameQE-EInputType">\
                                        <input class="gameQE-TypeSelect" checked id="trivialTypeChoose" type="radio" name="tvltypeselect" value="0"/>\
                                        <label for="trivialTypeChoose">' + _("Select") + '</label>\
                                        <input class="gameQE-TypeSelect"  id="trivialTypeOrders" type="radio" name="tvltypeselect" value="1"/>\
                                        <label for="trivialTypeOrders">' + _("Order") + '</label>\
                                        <input class="gameQE-TypeSelect"  id="trivialTypeWord" type="radio" name="tvltypeselect" value="2"/>\
                                        <label for="trivialTypeWord">' + _("Word") + '</label>\
                                        <input class="gameQE-TypeSelect"  id="trivialTypeOpen" type="radio" name="tvltypeselect" value="3"/>\
                                        <label for="trivialTypeOpen">' + _("Open") + '</label>\
                                    </div>\
                                    <span>' + _("Multimedia Type") + ':</span>\
                                    <div class="gameQE-EInputMedias">\
                                        <input class="gameQE-Type" checked="checked" id="trivialMediaNormal" type="radio" name="tvlmediatype" value="0" disabled />\
                                        <label for="trivialMediaNormal">' + _("None") + '</label>\
                                        <input class="gameQE-Type"  id="trivialMediaImage" type="radio" name="tvlmediatype" value="1" disabled />\
                                        <label for="trivialMediaImage">' + _("Image") + '</label>\
                                        <input class="gameQE-Type"  id="trivialMediaVideo" type="radio" name="tvlmediatype" value="2" disabled />\
                                        <label for="trivialMediaVideo">' + _("Video") + '</label>\
                                        <input class="gameQE-Type"  id="trivialMediaText" type="radio" name="tvlmediatype" value="3" disabled />\
                                        <label for="trivialMediaText">' + _("Text") + '</label>\
                                    </div>\
                                    <span id="trivialOptionsNumberSpan">' + _("Options Number") + ':</span>\
                                    <div class="gameQE-EInputNumbers" id="trivialEInputNumbers" >\
                                        <input class="gameQE-Number" id="numQ2" type="radio" name="tvlnumber" value="2" />\
                                        <label for="numQ2">2</label>\
                                        <input class="gameQE-Number" id="numQ3" type="radio" name="tvlnumber" value="3" />\
                                        <label for="numQ3">3</label>\
                                        <input class="gameQE-Number" id="numQ4" type="radio" name="tvlnumber" value="4" checked="checked" />\
                                        <label for="numQ4">4</label>\
                                    </div>\
                                    <span id="trivialPercentageSpan">' + _("Percentage of letters to show (%)") + ':</span>\
                                    <div class="gameQE-EPercentage" id="trivialPercentage">\
                                        <input type="number" name="trivialPercentageShow" id="trivialPercentageShow" value="35" min="0" max="100" step="5" /> </label>\
                                    </div>\
                                    <span>' + _("Time per question") + ':</span>\
                                    <div class="gameQE-EInputTimes">\
                                        <input class="gameQE-Times" checked="checked" id="q15s" type="radio" name="tvltime" value="0" />\
                                        <label for="q15s">15s</label>\
                                        <input class="gameQE-Times" id="q30s" type="radio" name="tvltime" value="1" />\
                                        <label for="q30s">30s</label>\
                                        <input class="gameQE-Times" id="q1m" type="radio" name="tvltime" value="2" />\
                                        <label for="q1m">1m</label>\
                                        <input class="gameQE-Times" id="q3m" type="radio" name="tvltime" value="3" />\
                                        <label for="q3m">3m</label>\
                                        <input class="gameQE-Times" id="q5m" type="radio" name="tvltime" value="4" />\
                                        <label for="q5m">5m</label>\
                                        <input class="gameQE-Times" id="q10m" type="radio" name="tvltime" value="5" />\
                                        <label for="q10m">10m</label>\
                                    </div>\
                                    <span class="gameQE-ETitleImage" id="trivialETitleImage">' + _("Image URL") + '</span>\
                                    <div class="gameQE-Flex gameQE-EInputImage" id="trivialEInputImage">\
                                        <label class="sr-av" for="trivialEURLImage">' + _("Image URL") + '</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLImage"  id="trivialEURLImage"/>\
                                        <a href="#" id="trivialEPlayImage" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="' + _("Play") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsImage" id="quextInputOptionsImage">\
                                        <div class="gameQE-ECoord">\
                                            <label for="trivialEXImage">X:</label>\
                                            <input id="trivialEXImage" type="text" value="0" />\
                                            <label for="trivialEXImage">Y:</label>\
                                            <input id="trivialEYImage" type="text" value="0" />\
                                        </div>\
                                    </div>\
                                    <span class="gameQE-ETitleVideo" id="trivialETitleVideo">' + _("URL") + '</span>\
                                    <div class="gameQE-Flex gameQE-EInputVideo" id="trivialEInputVideo">\
                                        <label class="sr-av" for="trivialEURLYoutube">' + _("URL") + '</label>\
                                        <input id="trivialEURLYoutube" type="text" />\
                                        <a href="#" id="trivialEPlayVideo" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="' + _("Play") + '" class="gameQE-EButtonImage" /></a>\
                                    </div>\
                                    <div class="gameQE-EInputOptionsVideo" id="trivialEInputOptionsVideo">\
                                        <div>\
                                            <label for="trivialEInitVideo">' + _("Start") + ':</label>\
                                            <input id="trivialEInitVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <label for="trivialEEndVideo">' + _("End") + ':</label>\
                                            <input id="trivialEEndVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <button class="gameQE-EVideoTime" id="trivialEVideoTime" type="button">00:00:00</button>\
                                        </div>\
                                        <div>\
                                            <label for="trivialESilenceVideo">' + _("Silence") + ':</label>\
                                            <input id="trivialESilenceVideo" type="text" value="00:00:00" maxlength="8"" />\
                                            <label for="trivialETimeSilence">' + _("Time (s)") + ':</label>\
                                            <input type="number" name="trivialETimeSilence" id="trivialETimeSilence" value="0" min="0" max="120" /> \
                                        </div>\
                                        <div>\
                                            <label for="trivialECheckSoundVideo">' + _("Audio") + ':</label>\
                                            <input id="trivialECheckSoundVideo" type="checkbox" checked="checked" />\
                                            <label for="trivialECheckImageVideo">' + _("Image") + ':</label>\
                                            <input id="trivialECheckImageVideo" type="checkbox" checked="checked" />\
                                        </div>\
                                    </div>\
                                    <div class="gameQE-EAuthorAlt" id="trivialEAuthorAlt">\
                                        <div class="gameQE-EInputAuthor" id="trivialInputAuthor">\
                                            <label for="trivialEAuthor">' + _("Authorship") + '</label>\
                                            <input id="trivialEAuthor" type="text" />\
                                        </div>\
                                        <div class="gameQE-EInputAlt" id="trivialInputAlt">\
                                            <label for="trivialEAlt">' + _("Alternative text") + '</label>\
                                            <input id="trivialEAlt" type="text" />\
                                        </div>\
                                    </div>\
                                    <span id="trivialETitleAudio">' + _("Audio") + '</span>\
                                    <div class="gameQE-EInputAudio" id="trivialEInputAudio">\
                                        <label class="sr-av" for="trivialEURLAudio">' + _("URL") + '</label>\
                                        <input type="text" class="exe-file-picker gameQE-EURLAudio"  id="trivialEURLAudio"/>\
                                        <a href="#" id="trivialEPlayAudio" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Audio") + '"><img src="' + path + "quextIEPlay.png" + '"  alt="' + _("Play") + '" class="gameQE-EButtonImage b-play" /></a>\
                                    </div>\
                                </div>\
                                <div class="gameQE-EMultiMediaOption">\
                                    <div class="gameQE-EMultimedia" id="trivialEMultimedia">\
                                        <textarea id="trivialEText"></textarea>\
                                        <img class="gameQE-EMedia" src="' + path + "quextIEImage.png" + '" id="trivialEImage" alt="' + _("Image") + '" />\
                                        <img class="gameQE-EMedia" src="' + path + "quextIEImage.png" + '" id="trivialENoImage" alt="' + _("No image") + '" />\
                                        <div class="gameQE-EMedia" id="trivialEVideo"></div>\
                                        <video class="gameQE-EMedia" id = "trivialEVideoLocal" preload="auto" controls></video>\
                                        <img class="gameQE-EMedia" src="' + path + "quextIENoImageVideo.png" + '" id="trivialENoImageVideo" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + "quextIENoVideo.png" + '" id="trivialENoVideo" alt="" />\
                                        <img class="gameQE-ECursor" src="' + path + "quextIECursor.gif" + '" id="trivialECursor" alt="" />\
                                        <img class="gameQE-EMedia" src="' + path + "quextIECoverTrivial.png" + '" id="trivialECover" alt="' + _("No image") + '" />\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="gameQE-EContents">\
                            <div id="trivialESolitionOptions" class="gameQE-SolitionOptionsDiv" ><span>' + _("Question") + ':</span><span><span>' + _("Solution") + ': </span><span id="trivialESolutionSelect"></span></span></div>\
                            <div class="gameQE-EQuestionDiv" id="trivialEQuestionDiv">\
                                    <label class="sr-av">' + _("Question") + ':</label><input type="text" class="gameQE-EQuestion" id="trivialEQuestion">\
                                </div>\
                                <div class="gameQE-EAnswers" id="trivialEAnswers">\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="checkbox" class="gameQE-ESolution" name="tvlsolution" id="trivialESolution0" value="A" />\
                                        <label >A</label><input type="text" class="gameQE-EOption0 gameQE-EAnwersOptions" id="trivialEOption0">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="checkbox" class="gameQE-ESolution" name="tvlsolution" id="trivialESolution1" value="B" />\
                                        <label >B</label><input type="text" class="gameQE-EOption1 gameQE-EAnwersOptions"  id="trivialEOption1">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="checkbox" class="gameQE-ESolution" name="tvlsolution" id="trivialESolution2" value="C" />\
                                        <label >C</label><input type="text" class="gameQE-EOption2 gameQE-EAnwersOptions"  id="trivialEOption2">\
                                    </div>\
                                    <div class="gameQE-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="checkbox"  class="gameQE-ESolution" name="tvlsolution" id="trivialESolution3" value="D" />\
                                        <label >D</label><input type="text" class="gameQE-EOption3 gameQE-EAnwersOptions"  id="trivialEOption3">\
                                    </div>\
                                </div>\
                                <div class="gameQE-EWordDiv gameQE-DP" id="trivialEWordDiv">\
                                    <div class="gameQE-ESolutionWord"><label for="trivialESolutionWord">' + _("Word/Phrase") + ': </label><input type="text"  id="trivialESolutionWord"/></div>\
                                    <div class="gameQE-ESolutionWord"><label for="trivialEDefinitionWord">' + _("Definition") + ': </label><input type="text"  id="trivialEDefinitionWord"/></div>\
                                </div>\
                            </div>\
                            <div class="gameQE-ENavigationButtons">\
                                <a href="#" id="trivialEAdd" class="gameQE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + "quextIEAdd.png" + '"  alt="' + _("Add question") + '" class="gameQE-EButtonImage b-add" /></a>\
                                <a href="#" id="trivialEFirst" class="gameQE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + "quextIEFirst.png" + '"  alt="' + _("First question") + '" class="gameQE-EButtonImage b-first" /></a>\
                                <a href="#" id="trivialEPrevious" class="gameQE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + "quextIEPrev.png" + '"  alt="' + _("Previous question") + '" class="gameQE-EButtonImage b-prev" /></a>\
                                <label class="sr-av" for="trivialNumberQuestion">' + _("Question number:") + ':</label><input type="text" class="gameQE-NumberQuestion"  id="trivialNumberQuestion" value="1"/>\
                                <a href="#" id="trivialENext" class="gameQE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + "quextIENext.png" + '"  alt="' + _("Next question") + '" class="gameQE-EButtonImage b-next" /></a>\
                                <a href="#" id="trivialELast" class="gameQE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + "quextIELast.png" + '"  alt="' + _("Last question") + '" class="gameQE-EButtonImage b-last" /></a>\
                                <a href="#" id="trivialEDelete" class="gameQE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + "quextIEDelete.png" + '"  alt="' + _("Delete question") + '" class="gameQE-EButtonImage b-delete" /></a>\
                                <a href="#" id="trivialECopy" class="gameQE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + "quextIECopy.png" + '"   alt="' + _("Copy question") + '" class="gameQE-EButtonImage b-copy" /></a>\
                                <a href="#" id="trivialECut" class="gameQE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + "quextIECut.png" + '"  alt="' + _("Cut question") + '"  class="gameQE-EButtonImage b-cut" /></a>\
                                <a href="#" id="trivialEPaste" class="gameQE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + "quextIEPaste.png" + '"  alt="' + _("Paste question") + '" class="gameQE-EButtonImage b-paste" /></a>\
                            </div>\
                            <div class="gameQE-ENumQuestionDiv" id="trivialENumQuestionDiv">\
                                <div class="gameQE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="gameQE-ENumQuestions" id="trivialENumQuestions">0</span>\
                            </div>\
                        </div>\
                        ' + $exeAuthoring.iDevice.common.getTextFieldset("after") + '\
                    </div>\
				' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
				<div class="exe-idevice-warning">' + _("This game may present accessibility problems for some users. You should provide an accessible alternative if the users need it.") + '</div>\
		    </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeDevice.loadYoutubeApi();
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        tinymce.init({
            selector: '#trivialEText',
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
        $('#trivialEInputVideo').css('display', 'flex');
        $('#trivialEInputImage').css('display', 'flex');
        $("#trivialMediaNormal").prop("disabled", false);
        $("#trivialMediaImage").prop("disabled", false);
        $("#trivialMediaText").prop("disabled", false);
        var temas = [];
        for (var i = 0; i < 6; i++) {
            var tema = [];
            var question = this.getCuestionDefault();
            tema.push(question)
            temas.push(tema);
        }
        $exeDevice.temas = temas;
        $exeDevice.activeTema = 0;
        $exeDevice.activesQuestions = [0, 0, 0, 0, 0, 0];
        $exeDevice.numeroTemas = 2;
        $exeDevice.showTema(0);
        $exeDevice.changeTypeQuestion(0)
        $exeDevice.showOptions(4);
        $exeDevice.showSolution('');
        $exeDevice.showTypeQuestion(0);
        this.localPlayer = document.getElementById('trivialEVideoLocal');

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
        p.audio = q.ad;
        return p;
    },

    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.activesQuestions = [0, 0, 0, 0, 0, 0];
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.trivial-DataGame', wrapper).text(),
                dataGame = $exeDevice.isJsonString(json);
            dataGame = $exeDevice.Decrypt(dataGame);
            dataGame.modeBoard = typeof dataGame.modeBoard == "undefined" ? false : dataGame.modeBoard;
            for (var i = 0; i < dataGame.numeroTemas; i++) {
                var tema = dataGame.temas[i];
                for (var j = 0; j < tema.length; j++) {
                    tema[j].audio = typeof tema[j].audio == "undefined" ? "" : tema[j].audio;
                }
                for (var j = 0; j < tema.length; j++) {
                    if (tema[j].type == 3) {
                        tema[j].eText = unescape(tema[j].eText);
                    }
                }
                var $imagesLink = $('.trivial-LinkImages-' + i, wrapper),
                    $audiosLink = $('.trivial-LinkAudios-' + i, wrapper);
                $imagesLink.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < tema.length) {
                        tema[iq].url = $(this).attr('href');
                        if (tema[iq].url.length < 4 && tema[iq].type == 1) {
                            tema[iq].url = "";
                        }
                    }
                });
                $audiosLink.each(function () {
                    var iq = parseInt($(this).text());
                    if (!isNaN(iq) && iq < tema.length) {
                        tema[iq].audio = $(this).attr('href');
                        if (tema[iq].audio.length < 4) {
                            tema[iq].audio = "";
                        }
                    }
                });
                $exeDevice.temas[i] = tema;
            }
            dataGame.temas = $exeDevice.temas;
            $exeDevice.numeroTemas = dataGame.numeroTemas;
            var instructions = $(".trivial-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }
            var textAfter = $(".trivial-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }

            // i18n
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.changeNumberTemas(dataGame.numeroTemas);
            $exeDevice.updateFieldGame(dataGame);

        }
    },
    generarID: function () {
        var fecha = new Date(),
            a = fecha.getUTCFullYear(),
            m = fecha.getUTCMonth() + 1,
            d = fecha.getUTCDate(),
            h = fecha.getUTCHours(),
            min = fecha.getUTCMinutes(),
            s = fecha.getUTCSeconds(),
            o = fecha.getTimezoneOffset();

        var IDE = `${a}${m}${d}${h}${min}${s}${o}`;
        return IDE;
    },
    updateFieldGame: function (game) {
        $exeDevice.activeTema = 0;
        $exeDevice.activesQuestions = [0, 0, 0, 0, 0, 0];
        $exeDevice.temas = game.temas;
        $exeDevice.nombresTemas = game.nombresTemas;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.trivialID = typeof game.trivialID == "undefined" ? $exeDevice.trivialID : game.trivialID;
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#eXeGamePercentajeClue option[value=100]').attr('selected', 'selected');
        $('#eXeGamePercentajeClue').val(100);
        game.answersRamdon = game.answersRamdon || false;
        $("input.gameQE-NumeroTemas[name='tvlnt'][value='" + game.numeroTemas + "']").prop("checked", true)
        $('#trivialEShowMinimize').prop('checked', game.showMinimize);
        $('#trivialEShowSolution').prop('checked', game.showSolution);
        $('#trivialETimeShowSolution').prop('disabled', !game.showSolution);
        $('#trivialETimeShowSolution').val(game.timeShowSolution);
        $('#trivialModeBoard').prop("checked", game.modeBoard);
        $('#trivialNumberTema').val(1);
        $('#trivialLoadGame').val('');
        $('#trivialNameTema').val(game.nombresTemas[0]);
        $('#trivialEEvaluation').prop('checked', game.evaluation);
        $('#trivialEEvaluationID').val(game.evaluationID);
        $("#trivialEEvaluationID").prop('disabled', (!game.evaluation));

        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);

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
        var instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            divIntrunstion = instructions != "" ? '<div class="trivial-instructions">' + instructions + '</div>' : '',
            linksImages = $exeDevice.createlinksImage(dataGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame);
        var html = '<div class="trivial-IDevice">';
        html += divIntrunstion;
        html += '<div class="trivial-DataGame js-hidden">' + $exeDevice.Encrypt(dataGame) + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="trivial-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="trivial-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        if (html.length > 650000) {
            $exeDevice.showMessage($exeDevice.msgs.tooManyQuestions);
            return false;
        }
        return html;

    },
    Encrypt: function (game) {
        var nombres = [];
        var temas = [];
        for (var z = 0; z < game.numeroTemas; z++) {
            nombres.push(game.nombresTemas[z]);
            var tema = game.temas[z];
            var ntema = [];
            for (var i = 0; i < tema.length; i++) {
                var mquestion = $exeDevice.getCuestionEncriptada(tema[i]);
                ntema.push(mquestion);
            }
            temas.push(ntema)
        }

        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Trivial',
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
            'numeroTemas': game.numeroTemas,
            'nombresTemas': game.nombresTemas,
            'temas': temas,
            'isScorm': game.isScorm,
            'textButtonScorm': game.textButtonScorm,
            'repeatActivity': game.repeatActivity,
            'title': '',
            'customScore': game.customScore,
            'textAfter': game.textAfter,
            'msgs': game.msgs,
            'trivialID': game.trivialID,
            "version": game.version,
            "modeBoard": game.modeBoard,
            "evaluation": game.evaluation,
            "evaluationID": game.evaluationID,
            "id": game.id
        }
        return JSON.stringify(data);
    },

    Decrypt: function (game) {
        var nombres = [];
        var temas = [];
        for (var z = 0; z < game.numeroTemas; z++) {
            nombres.push(game.nombresTemas[z]);
            var tema = game.temas[z];
            var ntema = [];
            for (var i = 0; i < tema.length; i++) {
                var mquestion = $exeDevice.getCuestionDesEncriptada(tema[i]);
                ntema.push(mquestion);
            }
            temas.push(ntema)
        }

        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Trivial',
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
            'numeroTemas': game.numeroTemas,
            'nombresTemas': game.nombresTemas,
            'temas': temas,
            'isScorm': game.isScorm,
            'textButtonScorm': game.textButtonScorm,
            'repeatActivity': game.repeatActivity,
            'title': '',
            'customScore': game.customScore,
            'textAfter': game.textAfter,
            'msgs': game.msgs,
            'trivialID': game.trivialID,
            'version': game.version,
            "modeBoard": game.modeBoard,

            "evaluation": game.evaluation,
            "evaluationID": game.evaluationID,
            "id": game.id
        }

        return data;
    },

    insertSpace: function (encr, index, space) {
        if (index > 0) {
            return encr.substring(0, index) + space + encr.substr(index);
        }

        return encr;
    },
    borrarCuestion: function () {
        var numberOptions = parseInt($('input[name=tvlnumber]:checked').val()),
            typeSelect = parseInt($('input[name=tvltypeselect]:checked').val()),
            quextion = $('#trivialEQuestion').val().trim(),
            options = [],
            optionEmpy = false;
        $('.gameQE-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            options.push(option);
        });
        if (quextion.length > 0) {
            return false;
        } else if (typeSelect < 2 && !optionEmpy) {
            return false
        }
        return true;

    },

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object(),
            nombreTema = $('#trivialNameTema').val();
        if (nombreTema.length == 0) {
            message = "Debes indicar un nombre para este tema"
        }
        p.type = parseInt($('input[name=tvlmediatype]:checked').val());
        p.time = parseInt($('input[name=tvltime]:checked').val());
        p.numberOptions = parseInt($('input[name=tvlnumber]:checked').val());
        p.typeSelect = parseInt($('input[name=tvltypeselect]:checked').val())
        p.x = parseFloat($('#trivialEXImage').val());
        p.y = parseFloat($('#trivialEYImage').val());;
        p.author = $('#trivialEAuthor').val();
        p.alt = $('#trivialEAlt').val();
        p.customScore = 1;
        p.url = $('#trivialEURLImage').val().trim();
        if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#trivialEURLYoutube').val().trim()) ? $('#trivialEURLYoutube').val() : '';
            if (p.url == '') {
                p.url = $exeDevice.getURLVideoMediaTeca($('#trivialEURLYoutube').val().trim()) ? $('#trivialEURLYoutube').val() : '';
            }
        }
        p.audio = $('#trivialEURLAudio').val();
        $exeDevice.stopSound();
        $exeDevice.stopVideo()
        p.soundVideo = $('#trivialECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#trivialECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#trivialEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#trivialEEndVideo').val().trim());
        p.silentVideo = $exeDevice.hourToSeconds($('#trivialESilenceVideo').val().trim());
        p.tSilentVideo = parseInt($('#trivialETimeSilence').val());
        p.eText = tinyMCE.get('trivialEText').getContent();
        p.quextion = $('#trivialEQuestion').val().trim();
        p.options = [];
        p.solution = $('#trivialESolutionSelect').text().trim();
        p.solutionQuestion = $('#trivialESolutionWord').val();
        p.percentageShow = parseInt($('#trivialPercentageShow').val());
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
        if (p.typeSelect >= 2) {
            p.quextion = $('#trivialEDefinitionWord').val().trim();
            p.solution = "";
            p.solutionQuestion = $('#trivialESolutionWord').val();
        }
        if (p.typeSelect == 1 && p.solution.length != p.numberOptions) {
            message = msgs.msgTypeChoose;
        } else if (p.quextion.length == 0) {
            message = msgs.msgECompleteQuestion;
        } else if (p.typeSelect < 2 && optionEmpy) {
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
        } else if (p.type == 2 && !$exeDevice.validTime($('#trivialEInitVideo').val()) || !$exeDevice.validTime($('#trivialEEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        } else if (p.type == 2 && p.tSilentVideo > 0 && !$exeDevice.validTime($('#trivialESilenceVideo').val())) {
            message = msgs.msgTimeFormat;
        } else if (p.type == 2 && p.tSilentVideo > 0 && (p.silentVideo < p.iVideo || p.silentVideo >= p.fVideo)) {
            message = msgs.msgSilentPoint;
        } else if (p.typeSelect == 2 && p.solutionQuestion.trim().length == 0) {
            message = $exeDevice.msgs.msgProvideSolution;
        } else if (p.typeSelect == 3 && p.solutionQuestion.trim().length == 0) {
            p.solutionQuestion='open'
        } else if (p.typeSelect >= 2 && p.quextion.trim().length == 0) {
            message = $exeDevice.msgs.msgEProvideWord;
        }
        if (message.length == 0) {
            var active = $exeDevice.activesQuestions[$exeDevice.activeTema];
            $exeDevice.temas[$exeDevice.activeTema][active] = p;
            $exeDevice.nombresTemas[$exeDevice.activeTema] = nombreTema;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;
    },

    createlinksImage: function (dataGame) {
        var html = '';
        for (var j = 0; j < dataGame.numeroTemas; j++) {
            var selectsGame = $exeDevice.temas[j];
            for (var i = 0; i < selectsGame.length; i++) {
                var quextion = selectsGame[i];
                if (quextion.type == 1 && quextion.url.indexOf('http') != 0) {
                    var linkImage = '<a href="' + quextion.url + '" class="js-hidden trivial-LinkImages-' + j + '">' + i + '</a>';
                    html += linkImage;
                }
            }
        }
        return html;
    },

    createlinksAudio: function (dataGame) {
        var html = '';
        for (var j = 0; j < dataGame.numeroTemas; j++) {
            var selectsGame = $exeDevice.temas[j];
            for (var i = 0; i < selectsGame.length; i++) {
                var quextion = selectsGame[i];
                if (typeof quextion.audio != 'undefined' && quextion.audio.length > 4 && quextion.audio.indexOf('http') != 0) {
                    var linkAudio = '<a href="' + quextion.audio + '" class="js-hidden trivial-LinkAudios-' + j + '">' + i + '</a>';
                    html += linkAudio;
                }
            }
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
        link.download = _("Game") + "TriviEx.json";
        document.getElementById('gameQEIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameQEIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
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
            if (p.type == 3) {
                p.eText = unescape(p.eText);
            }
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
            $exeDevice.temas[$exeDevice.activeTema].push(p);
        }

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
            $exeDevice.temas[$exeDevice.activeTema].push(p);
        }
    },

    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
        } else if (game.typeGame == 'Trivial') {
            game.trivialID = $exeDevice.getId();
            game.id = $exeDevice.generarID();
            var temas = [];
            for (var i = 0; i < 6; i++) {
                var tema = [];
                var question = $exeDevice.getCuestionDefault();
                tema.push(question)

                if (i < game.numeroTemas) {
                    var ntema = game.temas[i];
                    for (var j = 0; j < ntema.length; j++) {
                        var numOpt = 0;
                        var p = ntema[j];
                        for (var z = 0; z < p.options.length; z++) {
                            if (p.options[z].trim().indexOf('<' == 0)) {
                                p.options[z] = p.options[z].replace('<', ' ');
                            }
                            if (p.options[z].trim().length == 0) {
                                p.numberOptions = numOpt;
                                break;
                            }
                            numOpt++;
                        }
                        if (p.type == 3) {
                            p.eText = unescape(p.eText);
                        }
                        ntema[j] = p;
                    }
                    tema = ntema;
                }
                temas.push(tema);
            }
            $exeDevice.temas = temas;
            game.temas = $exeDevice.temas;
            $exeDevice.numeroTemas = game.numeroTemas;
            $exeDevice.nombresTemas = game.nombresTemas;
            $exeDevice.updateFieldGame(game);
            $exeDevice.changeNumberTemas(game.numeroTemas);
            var instructions = game.instructionsExe || game.instructions;

            tinymce.editors[0].setContent(unescape(instructions));
            $('.exe-form-tabs li:first-child a').click();
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
        }
    },
    updateNumberTema: function (tema) {
        for (var i = 0; i < tema.length; i++) {
            var numOpt = 0;
            for (var j = 0; j < tema[i].length; j++) {
                if (tema[i].options[j].trim().length == 0) {
                    tema[i].numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
        }
        return tema;
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
            $exeDevice.temas[$exeDevice.activeTema].push(p);
        }
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
                $exeDevice.temas[$exeDevice.activeTema].push(p);
            }
        }
    },
    validateData: function () {
        $exeDevice.numeroTemas = parseInt($('input[name=tvlnt]:checked').val());
        var clear = $exeDevice.removeTags,
            // instructions = escape($("#eXeGameInstructions").html())
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            textAfter = '',
            showMinimize = $('#trivialEShowMinimize').is(':checked'),
            optionsRamdon = true,
            answersRamdon = true,
            showSolution = $('#trivialEShowSolution').is(':checked'),
            modeBoard = $('#trivialModeBoard').is(':checked'),
            timeShowSolution = parseInt(clear($('#trivialETimeShowSolution').val())),
            useLives = false,
            numberLives = 3,
            numeroTemas = $exeDevice.numeroTemas,
            nombresTemas = $exeDevice.nombresTemas,
            idVideo = '',
            endVideo = 0,
            startVideo = 0,
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            customScore = false,
            temas = [],
            evaluation=$('#trivialEEvaluation').is(':checked'),
            evaluationID=$('#trivialEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
        if (!itinerary) return false;
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }
        for (var z = 0; z < numeroTemas; z++) {
            if (nombresTemas.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgNameThemes);
                return false;
            }
            var tema = $exeDevice.temas[z];
            for (var i = 0; i < tema.length; i++) {
                var mquestion = tema[i]
                mquestion.customScore = typeof (mquestion.customScore) == "undefined" ? 1 : mquestion.customScore;
                if (mquestion.quextion.length == 0) {
                    $exeDevice.showMessage($exeDevice.msgs.msgCmpleteAllQuestions);
                    return false;
                } else if ((mquestion.type == 1) && (mquestion.url.length < 10)) {
                    $exeDevice.showMessage($exeDevice.msgs.msgCmpleteAllQuestions);
                    return false;
                } else if ((mquestion.type == 2) && !($exeDevice.getIDYoutube(mquestion.url)) && !($exeDevice.getURLVideoMediaTeca(mquestion.url))) {
                    $exeDevice.showMessage($exeDevice.msgs.msgCmpleteAllQuestions);
                    return false;
                }
                if (mquestion.typeSelect >= 2) {
                    if (mquestion.solutionQuestion.length == 0) {
                        $exeDevice.showMessage($exeDevice.msgs.msgCmpleteAllQuestions);
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
                        $exeDevice.showMessage($exeDevice.msgs.msgCmpleteAllQuestions);
                        return false;
                    }
                }
            }
            for (var i = 0; i < tema.length; i++) {
                var qt = tema[i]
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
                    qt.eText = escape(qt.eText);
                }

            }
            temas.push(tema);
        }

        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Trivial',
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
            'numeroTemas': numeroTemas,
            'nombresTemas': nombresTemas,
            'temas': temas,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'title': '',
            'customScore': customScore,
            'textAfter': textAfter,
            'trivialID': $exeDevice.trivialID,
            'version': 2,
            'modeBoard': modeBoard,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id': id
            
        }
        return data;
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    showTypeQuestion: function (type) {
        if (type >= 2) {
            $('#trivialEAnswers').hide();
            $('#trivialEQuestionDiv').hide();
            $('#gameQEIdeviceForm .gameQE-ESolutionSelect').hide();
            $('#trivialOptionsNumberSpan').hide();
            $('#trivialEInputNumbers').hide();
            $('#trivialPercentageSpan').show();
            $('#trivialPercentage').show();
            $('#trivialESolutionWord').show();
            $('#trivialEWordDiv').show();
            $('label[for=trivialEDefinitionWord]').text(_('Definition'));
            $('label[for=trivialESolutionWord]').show();
            $('#trivialESolitionOptions').hide();
            $('label[for=trivialEDefinitionWord]').css({'width':'11em'})
            if( type == 3){
                $('label[for=trivialEDefinitionWord]').text(_('Question'));
                $('label[for=trivialESolutionWord]').hide();
                $('label[for=trivialEDefinitionWord]').css({'width':'auto'})
                $('#trivialESolutionWord').hide();
            }
        } else {
            $('#trivialEAnswers').show();
            $('#trivialEQuestionDiv').show();
            $('#gameQEIdeviceForm .gameQE-ESolutionSelect').show();
            $('#trivialOptionsNumberSpan').show();
            $('#trivialEInputNumbers').show();
            $('#trivialPercentageSpan').hide();
            $('#trivialPercentage').hide();
            $('#trivialEWordDiv').hide();
            $('#trivialESolitionOptions').show();
        }
    },
    addEvents: function () {
        $('#trivialEPaste').hide();

        $('#trivialEInitVideo,#trivialEEndVideo,#trivialESilenceVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#trivialEInitVideo,#trivialEEndVideo,#trivialESilenceVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });

        });
        $('#trivialShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#trivialCodeAccess').prop('disabled', !marcado);
            $('#trivialMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });

        $('#gameQEIdeviceForm').on('click', 'input.gameQE-NumeroTemas', function (e) {
            var numt = parseInt($(this).val());
            $exeDevice.numeroTemas = numt;
            $exeDevice.changeNumberTemas(numt);
        });

        $('.gameQE-EPanel').on('click', 'input.gameQE-TypeSelect', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.showTypeQuestion(type);
        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#trivialEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#trivialEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#trivialEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#trivialENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#trivialELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#trivialEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#trivialECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#trivialECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#trivialEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });

        $('#trivialEPlayVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.showVideoQuestion();
        });

        $('#trivialECheckSoundVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });
        $('#trivialECheckImageVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });

        $('#trivialETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#trivialETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#trivialETimeSilence').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#trivialPercentageShow').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#trivialPercentageShow').on('focusout', function () {
            this.value = this.value.trim() == '' ? 35 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        $('#trivialNumberTema').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#trivialNumberTema').on('focusout click', function () {
            var v = this.value;

            v = v.trim() == '' ? 1 : v;
            v = v > $exeDevice.numeroTemas ? $exeDevice.numeroTemas : v;
            v = v < 1 ? 1 : v;
            this.value = v;
            if (!$exeDevice.validateQuestion()) {
                this.value = $exeDevice.activeTema + 1;
            } else {
                $exeDevice.showTema(this.value - 1);
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
            $('#trivialLoadGame').on('change', function (e) {
                var file = e.target.files[0];
                if (!file) {
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $exeDevice.gameAdd(e.target.result);
                };
                reader.readAsText(file);
            });

            $('#eXeGameExportGame').on('click', function () {
                $exeDevice.exportGame();
            })
        } else {
            $('#eXeGameExportImport').hide();
        }

        $('#trivialEInitVideo').css('color', '#2c6d2c');
        $('#trivialEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#trivialEInitVideo').css('color', '#2c6d2c');
            $('#trivialEEndVideo').css('color', '#000000');
            $('#trivialESilenceVideo').css('color', '#000000');
        });
        $('#trivialEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#trivialEEndVideo').css('color', '#2c6d2c');
            $('#trivialEInitVideo').css('color', '#000000');
            $('#trivialESilenceVideo').css('color', '#000000');
        });
        $('#trivialESilenceVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 2;
            $('#trivialESilenceVideo').css('color', '#2c6d2c');
            $('#trivialEEndVideo').css('color', '#000000');
            $('#trivialEInitVideo').css('color', '#000000');
        });


        $('#trivialEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#trivialEInitVideo');
                    break;
                case 1:
                    $timeV = $('#trivialEEndVideo');
                    break;
                case 2:
                    $timeV = $('#trivialESilenceVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#trivialEVideoTime').text());
            $timeV.css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });

        $('#trivialUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#trivialNumberLives').prop('disabled', !marcado);
        });
        $('#trivialEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#trivialETimeShowSolution').prop('disabled', !marcado);
        });


        $('.gameQE-ESolution').on('change', function (e) {
            var marcado = $(this).is(':checked'),
                value = $(this).val();
            $exeDevice.clickSolution(marcado, value);
        });

        $('#trivialEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#trivialEAlt').val(),
                x = parseFloat($('#trivialEXImage').val()),
                y = parseFloat($('#trivialEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#trivialEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#trivialEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#trivialEAlt').val(),
                x = parseFloat($('#trivialEXImage').val()),
                y = parseFloat($('#trivialEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#trivialEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#trivialECursor').on('click', function (e) {
            $(this).hide();
            $('#trivialEXImage').val(0);
            $('#trivialEYImage').val(0);
        });

        $('#trivialEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#trivialEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });

        $('#trivialEURLAudio').on('change', function () {
            var selectedFile = $(this).val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });
        $('#trivialNumberQuestion').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    if ($exeDevice.validateQuestion() != false) {
                        $exeDevice.activesQuestions[$exeDevice.activeTema] = num < $exeDevice.temas[$exeDevice.activeTema].length ? num - 1 : $exeDevice.temas[$exeDevice.activeTema].length - 1;
                        $exeDevice.showQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);

                    } else {
                        $(this).val($exeDevice.activesQuestions[$exeDevice.activeTema] + 1)
                    }
                } else {
                    $(this).val($exeDevice.activesQuestions[$exeDevice.activeTema] + 1)
                }

            }
        });
        $('#trivialEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#trivialEEvaluationID').prop('disabled', !marcado);
        });
        $("#trivialEEvaluationHelpLnk").click(function () {
            $("#trivialEEvaluationHelp").toggle();
            return false;

        });

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

    },
    showModeOpen: function(open){
        $('#trivialTypeChoose').show();
        $('#trivialTypeOrders').show();
        $('label[for=trivialTypeChoose]').show();
        $('label[for=trivialTypeOrders]').show();
        if( open){
            $('#trivialTypeWord').prop('checked', open);
            $('#trivialTypeChoose').hide()
            $('#trivialTypeOrders').hide()
            $('label[for=trivialTypeChoose]').hide();
            $('label[for=trivialTypeOrders]').hide();
        }
    },
    gameAdd: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            $('#trivialLoadGame').val('');
            return;
        } else if (game.typeGame == 'Selecciona') {
            $exeDevice.importSelecciona(game);
        } else if (game.typeGame == 'QuExt') {
            $exeDevice.temas[$exeDevice] = $exeDevice.importQuExt(game);
        } else if (game.typeGame == 'Adivina') {
            $exeDevice.importAdivina(game);
        } else if (game.typeGame == 'Rosco') {
            $exeDevice.importRosco(game);
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            $('#trivialLoadGame').val('');
            return;
        }
        if ($exeDevice.borrarCuestion()) {
            $exeDevice.removeQuestion($exeDevice.activesQuestions[$exeDevice.activeTema]);
        }
        $exeDevice.typeEdit = -1;
        $('#trivialEPaste').hide();
        $('#trivialENumQuestions').text($exeDevice.temas[$exeDevice.activeTema].length);
        $('#trivialNumberQuestion').val($exeDevice.activesQuestions[$exeDevice.activeTema] + 1);

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
        var solutions = $('#trivialESolutionSelect').text();

        if (checked) {
            if (solutions.indexOf(value) == -1) {
                solutions += value;
            }
        } else {
            solutions = solutions.split(value).join('')
        }
        $('#trivialESolutionSelect').text(solutions);
    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#trivialECursor'),
            $x = $('#trivialEXImage'),
            $y = $('#trivialEYImage'),
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
}