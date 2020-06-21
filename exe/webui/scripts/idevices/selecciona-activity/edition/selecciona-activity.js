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
        name: _('Select Activity'),
        alt: _('Fast Multiple Choice Quiz')
    },
    iDevicePath: "/scripts/idevices/selecciona-activity/edition/",
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
        "msgReady": _("Ready?"),
        "msgStartGame": _("Click here to start"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("Game Over!"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
        "msgYouHas": _("You have got %1 hits and %2 misses"),
        "msgCodeAccess": _("Access code"),
        "msgPlayAgain": _("Play Again"),
        "msgRequiredAccessKey": _("Access code required"),
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
        "msgLoseT": _("You lost 330 points"),
        "msgLoseLive": _("You lost one life"),
        "msgLostLives": _("You lost all your lives!"),
        "mgsAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgNotNetwork": _("You can only play this game with internet connection."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Check"),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Author"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
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
        "mgsOrders": _("Please order the answers"),


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
        msgs.msgTimeFormat=_("Please check the time format: hh:mm:ss");


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
        $("#seleccionaMediaVideo").prop("disabled", false);
        $exeDevice.player = new YT.Player('seleccionaEVideo', {
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
        $exeDevice.playerIntro = new YT.Player('seleccionaEVI', {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 1
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
                $('#seleccionaEVideoTime').text(time);
                $exeDevice.updateSoundVideo();
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },
    updateTimerVIDisplay: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.playerIntro.getCurrentTime());
                $('#seleccionaEVITime').text(time);
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },
    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video seleccionado no está disponible")

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
    startVideoIntro: function (id, start, end) {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.loadVideoById === "function") {
                $exeDevice.playerIntro.loadVideoById({
                    'videoId': id,
                    'startSeconds': start,
                    'endSeconds': end
                });
            }

            clearInterval($exeDevice.timeUpdateVIInterval);
            $exeDevice.timeUpdateVIInterval = setInterval(function () {
                $exeDevice.updateTimerVIDisplay();
            }, 1000);

        }
    },
    stopVideoIntro: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.pauseVideo === "function") {
                $exeDevice.playerIntro.pauseVideo();
            }
            clearInterval($exeDevice.timeUpdateInterval);
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
            $('#seleccionaNumberQuestion').text($exeDevice.selectsGame.length);
            $exeDevice.typeEdit = -1;
            $('#seleccionaEPaste').hide();
            $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
        }
    },
    removeQuestion: function (num) {
        if ($exeDevice.selectsGame.length < 2) {
            $exeDevice.showMessage(msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.selectsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.selectsGame.length - 1) {
                $exeDevice.active = $exeDevice.selectsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#seleccionaEPaste').hide();
            $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
            $('#seleccionaNumberQuestion').text($exeDevice.active + 1);
        }

    },
    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.selectsGame[$exeDevice.active];
            $('#seleccionaEPaste').show();
        }

    },
    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#seleccionaEPaste').show();

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
            $('#seleccionaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.selectsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
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
        $('.selecciona-EAnwersOptions').each(function (j) {
            numOptions++;
            if (p.options[j].trim() !== '') {
                p.numOptions = numOptions;
            }
            $(this).val(p.options[j]);
        });
        $exeDevice.stopVideo();
        $exeDevice.changeTypeQuestion(p.type);
        $exeDevice.showOptions(p.numberOptions);
        $('#seleccionaEQuestion').val(p.quextion);
        $('#seleccionaENumQuestions').text($exeDevice.selectsGame.length);
        if (p.type == 1) {
            $('#seleccionaEURLImage').val(p.url);
            $('#seleccionaEXImage').val(p.x);
            $('#seleccionaEYImage').val(p.y);
            $('#seleccionaEAuthor').val(p.author);
            $('#seleccionaEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#seleccionaECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#seleccionaECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#seleccionaEURLYoutube').val(p.url);
            $('#seleccionaEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#seleccionaEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $('#seleccionaESilenceVideo').val($exeDevice.secondsToHour(p.silentVideo));
            $('#seleccionaETimeSilence').val(p.tSilentVideo);
            $exeDevice.silentVideo = p.silentVideo;
            $exeDevice.tSilentVideo = p.tSilentVideo;
            $exeDevice.activeSilent = (p.soundVideo == 1) && (p.tSilentVideo > 0) && (p.silentVideo >= p.iVideo) && (p.iVideo < p.fVideo);
            $exeDevice.endSilent = p.silentVideo + p.tSilentVideo;
            $exeDevice.showVideoQuestion();
        } else if (p.type == 3) {
            tinyMCE.get('seleccionaEText').setContent(unescape(p.eText));
        }

        $('.selecciona-EAnwersOptions').each(function (j) {
            var option = j < p.numOptions ? p.options[j] : '';
            $(this).val(option);
        });
        $('#seleccionaNumberQuestion').text(i + 1);
        $('#seleccionaEScoreQuestion').val(1);
         if (typeof(p.customScore)!="undefined") {
            $('#seleccionaEScoreQuestion').val(p.customScore);
        }

        $("input.selecciona-Number[name='slcnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.selecciona-Type[name='slcmediatype'][value='" + p.type + "']").prop("checked", true);
        $exeDevice.checkQuestions(p.solution);
        $("input.selecciona-Times[name='slctime'][value='" + p.time + "']").prop("checked", true);
        $("input.selecciona-TypeSelect[name='slctypeselect'][value='" + p.typeSelect + "']").prop("checked", true);
    },
    checkQuestions: function (solution) {
        $("input.selecciona-ESolution[name='slcsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $("input.selecciona-ESolution[name='slcsolution'][value='" + sol + "']").prop("checked", true);
        }
        $('#selecionaESolutionSelect').text(solution);

    },
    showVideoYoutube: function (quextion) {
        var id = $exeDevice.getIDYoutube(quextion.url);
        $('#seleccionaEImageVideo').hide();
        $('#seleccionaENoVideo').hide();
        $('#seleccionaEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, quextion.iVideo, quextion.fVideo);
            $('#seleccionaEVideo').show();
            if (quextion.imageVideo == 0) {
                $('#seleccionaEImageVideo').show();
            }
            if (quextion.soundVideo == 0) {
                $('#seleccionaEImageVideo').show();
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {

            $exeDevice.showMessage($exeDevice.msgEUnavailableVideo);
            $('#seleccionaENoVideo').show();
        }
    },
    showVideoQuestion: function () {
        var soundVideo = $('#seleccionaECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#seleccionaECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#seleccionaEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#seleccionaEEndVideo').val()),
            url = $('#seleccionaEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        $exeDevice.silentVideo = $exeDevice.hourToSeconds($('#seleccionaESilenceVideo').val().trim());
        $exeDevice.tSilentVideo = parseInt($('#seleccionaETimeSilence').val());
        $exeDevice.activeSilent = (soundVideo == 1) && ($exeDevice.tSilentVideo > 0) && ($exeDevice.silentVideo >= iVideo) && (iVideo < fVideo);
        $exeDevice.endSilent = $exeDevice.silentVideo + $exeDevice.tSilentVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#seleccionaENoImageVideo').hide();
        $('#seleccionaENoVideo').show();
        $('#seleccionaEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#seleccionaEVideo').show();
            $('#seleccionaENoVideo').hide();
            if (imageVideo == 0) {
                $('#seleccionaEVideo').hide();
                $('#seleccionaENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage(_("This video is not currently available"));
            $('#seleccionaENoVideo').show();
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
        var $image = $('#seleccionaEImage'),
            $cursor = $('#seleccionaECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#seleccionaENoImage').show();
        $image.prop('src', url)
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
                    $('#seleccionaENoImage').hide();
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
        $('.selecciona-Type')[0].checked = true;
        $('.selecciona-Times')[0].checked = true;
        $('.selecciona-Number')[2].checked = true;
        $('#seleccionaEURLImage').val('');
        $('#seleccionaEXImage').val('0');
        $('#seleccionaEYImage').val('0');
        $('#seleccionaEAuthor').val('');
        $('#seleccionaEAlt').val('');
        $('#seleccionaEURLYoutube').val('');
        $('#seleccionaEInitVideo').val('00:00:00');
        $('#seleccionaEEndVideo').val('00:00:00');
        $('#seleccionaECheckSoundVideo').prop('checked', true);
        $('#seleccionaECheckImageVideo').prop('checked', true);
        $('#selecionaESolutionSelect').text('');
        tinyMCE.get('seleccionaEText').setContent('');
        $('#seleccionaEQuestion').val('');
        $('.selecciona-EAnwersOptions').each(function () {
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

        $('#seleccionaETitleAltImage').hide();
        $('#seleccionaEAuthorAlt').hide();
        $('#seleccionaETitleImage').hide();
        $('#seleccionaEInputImage').hide();
        $('#seleccionaETitleVideo').hide();
        $('#seleccionaEInputVideo').hide();
        $('#seleccionaEInputOptionsVideo').hide();
        $('#seleccionaInputOptionsImage').hide();
        if (tinyMCE.get('seleccionaEText')) {
            tinyMCE.get('seleccionaEText').hide();
        }

        $('#seleccionaEText').hide();
        $('#seleccionaEVideo').hide();
        $('#seleccionaEImage').hide();
        $('#seleccionaENoImage').hide();
        $('#seleccionaECover').hide();
        $('#seleccionaECursor').hide();
        $('#seleccionaENoImageVideo').hide();
        $('#seleccionaENoVideo').hide();
        switch (type) {
            case 0:
                $('#seleccionaECover').show();
                break;
            case 1:
                $('#seleccionaENoImage').show();
                $('#seleccionaETitleImage').show();
                $('#seleccionaEInputImage').show();
                $('#seleccionaEAuthorAlt').show();
                $('#seleccionaECursor').show();
                $('#seleccionaInputOptionsImage').show();
                $exeDevice.showImage($('#seleccionaEURLImage').val(), $('#seleccionaEXImage').val(), $('#seleccionaEYImage').val(), $('#seleccionaEAlt').val(), 0)
                break;
            case 2:
                $('#seleccionaEImageVideo').show();
                $('#seleccionaETitleVideo').show();
                $('#seleccionaEInputVideo').show();
                $('#seleccionaENoVideo').show();
                $('#seleccionaEVideo').show();
                $('#seleccionaEInputOptionsVideo').show();
                break;
            case 3:
                $('#seleccionaEText').show();
                if (tinyMCE.get('seleccionaEText')) {
                    tinyMCE.get('seleccionaEText').show();
                }
                break;
            default:
                break;
        }
    },
    showOptions: function (number) {
        $('.selecciona-EOptionDiv').each(function (i) {
            $(this).show();
            if (i >= number) {
                $(this).hide();
                $exeDevice.showSolution('');
            }

        });
        $('.selecciona-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },
    showSolution: function (solution) {
        $("input.selecciona-ESolution[name='slcsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $('.selecciona-ESolution')[solution].checked = true;
            $("input.selecciona-ESolution[name='slcsolution'][value='" + sol + "']").prop("checked", true)
        }
        $('#selecionaESolutionSelect').text(solution);


    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="seleccionaIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answers and click on the Check button.")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="seleccionaEShowMinimize"><input type="checkbox" id="seleccionaEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="seleccionaEUseLives"><input type="checkbox" checked id="seleccionaEUseLives">' + _("Use lives") + '.</label>\
                                <label for="seleccionaENumberLives">' + _("Number of lives") + ':<input type="number" name="seleccionaENumberLives" id="seleccionaENumberLives" value="3" min="1" max="5" /></label>\
                            </p>\
                            <p>\
                                <label for="seleccionaEQuestionsRamdon"><input type="checkbox" id="seleccionaEQuestionsRamdon">' + _("Random questions") + '</label>\
                                <label for="seleccionaEAnswersRamdon"><input type="checkbox" id="seleccionaEAnswersRamdon">' + _("Random options") + '</label>\
                            </p>\
                            <p>\
                                <label for="seleccionaEShowSolution"><input type="checkbox" checked id="seleccionaEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="seleccionaETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="seleccionaETimeShowSolution" id="seleccionaETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <div class="selecciona-EVideoIntroData">\
                                <label for="seleccionaEVideoIntro">' + _("Video Intro") + '<input type="text" id="seleccionaEVideoIntro" /></label>\
                                <a href="#" id="seleccionaEVideoIntroPlay" class="selecciona-tEVideoIntroPlay"  title="' + _("Play video intro") + '"><img src="' + path + "slcPlay.png" + '"  alt="" class="selecciona-EButtonImage b-play" /></a>\
                            </div>\
                            <p>\
                                <label for="seleccionaECustomScore"><input type="checkbox" id="seleccionaECustomScore">' + _("Custom score") + '. </label>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="selecciona-EPanel" id="seleccionaEPanel">\
                            <div class="selecciona-EOptionsMedia">\
                                <div class="selecciona-EOptionsGame">\
                                    <span>' + _("Type") + ':</span>\
                                    <div class="selecciona-EInputType">\
                                        <input class="selecciona-TypeSelect" checked id="seleccionaTypeChoose" type="radio" name="slctypeselect" value="0"/>\
                                        <label for="seleccionaTypeSelect">' + _("Select") + '</label>\
                                        <input class="selecciona-TypeSelect"  id="seleccionaTypeChoose" type="radio" name="slctypeselect" value="1"/>\
                                        <label for="seleccionaTypeOrders">' + _("Order") + '</label>\
                                    </div>\
                                    <span>' + _("Multimedia Type") + ':</span>\
                                    <div class="selecciona-EInputMedias">\
                                        <input class="selecciona-Type" checked="checked" id="seleccionaMediaNormal" type="radio" name="slcmediatype" value="0" disabled />\
                                        <label for="seleccionaMediaNormal">' + _("None") + '</label>\
                                        <input class="selecciona-Type"  id="seleccionaMediaImage" type="radio" name="slcmediatype" value="1" disabled />\
                                        <label for="seleccionaMediaImage">' + _("Image") + '</label>\
                                        <input class="selecciona-Type"  id="seleccionaMediaVideo" type="radio" name="slcmediatype" value="2" disabled />\
                                        <label for="seleccionaMediaVideo">' + _("Video") + '</label>\
                                        <input class="selecciona-Type"  id="seleccionaMediaText" type="radio" name="slcmediatype" value="3" disabled />\
                                        <label for="seleccionaMediaText">' + _("Text") + '</label>\
                                    </div>\
                                    <span>' + _("Options Number") + ':</span>\
                                    <div class="selecciona-EInputNumbers">\
                                        <input class="selecciona-Number" id="numQ2" type="radio" name="slcnumber" value="2" />\
                                        <label for="numQ2">2</label>\
                                        <input class="selecciona-Number" id="numQ3" type="radio" name="slcnumber" value="3" />\
                                        <label for="numQ3">3</label>\
                                        <input class="selecciona-Number" id="numQ4" type="radio" name="slcnumber" value="4" checked="checked" />\
                                        <label for="numQ4">4</label>\
                                    </div>\
                                    <span>' + _("Time per question") + ':</span>\
                                    <div class="selecciona-EInputTimes">\
                                        <input class="selecciona-Times" checked="checked" id="q15s" type="radio" name="slctime" value="0" />\
                                        <label for="q15s">15s</label>\
                                        <input class="selecciona-Times" id="q30s" type="radio" name="slctime" value="1" />\
                                        <label for="q30s">30s</label>\
                                        <input class="selecciona-Times" id="q1m" type="radio" name="slctime" value="2" />\
                                        <label for="q1m">1m</label>\
                                        <input class="selecciona-Times" id="q3m" type="radio" name="slctime" value="3" />\
                                        <label for="q3m">3m</label>\
                                        <input class="selecciona-Times" id="q5m" type="radio" name="slctime" value="4" />\
                                        <label for="q5m">5m</label>\
                                        <input class="selecciona-Times" id="q10m" type="radio" name="slctime" value="5" />\
                                        <label for="q10m">10m</label>\
                                    </div>\
                                    <span class="selecciona-ETitleImage" id="seleccionaETitleImage">' + _("Image URL") + '</span>\
                                    <div class="selecciona-EInputImage" id="seleccionaEInputImage">\
                                        <label class="sr-av" for="seleccionaEURLImage">' + _("Image URL") + '</label>\
                                        <input type="text" class="exe-file-picker selecciona-EURLImage"  id="seleccionaEURLImage"/>\
                                    </div>\
                                    <div class="selecciona-EInputOptionsImage" id="seleccionaInputOptionsImage">\
                                        <div>\
                                            <label for="seleccionaEXImage">X:</label>\
                                            <input id="seleccionaEXImage" type="text" value="0" />\
                                            <label for="seleccionaEXImage">Y:</label>\
                                            <input id="seleccionaEYImage" type="text" value="0" />\
                                        </div>\
                                    </div>\
                                    <span class="selecciona-ETitleVideo" id="seleccionaETitleVideo">' + _("Youtube URL") + '</span>\
                                    <div class="selecciona-EInputVideo" id="seleccionaEInputVideo">\
                                        <label class="sr-av" for="seleccionaEURLYoutube">' + _("Youtube URL") + '</label>\
                                        <input id="seleccionaEURLYoutube" type="text" />\
                                        <a href="#" id="seleccionaEPlayVideo" class="selecciona-ENavigationButton selecciona-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + "slcPlay.png" + '"  alt="" class="selecciona-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="selecciona-EInputOptionsVideo" id="seleccionaEInputOptionsVideo">\
                                        <div>\
                                            <label for="seleccionaEInitVideo">' + _("Start") + ':</label>\
                                            <input id="seleccionaEInitVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <label for="seleccionaEEndVideo">' + _("End") + ':</label>\
                                            <input id="seleccionaEEndVideo" type="text" value="00:00:00" maxlength="8" />\
                                            <button class="selecciona-EVideoTime" id="seleccionaEVideoTime" type="button">00:00:00</button>\
                                        </div>\
                                        <div>\
                                            <label for="seleccionaESilenceVideo">' + _("Silence") + ':</label>\
                                            <input id="seleccionaESilenceVideo" type="text" value="00:00:00" maxlength="8"" />\
                                            <label for="seleccionaETimeSilence">' + _("Time (s)") + ':</label>\
                                            <input type="number" name="seleccionaETimeSilence" id="seleccionaETimeSilence" value="0" min="0" max="120" /> \
                                        </div>\
                                        <div>\
                                            <label for="seleccionaECheckSoundVideo">' + _("Audio") + ':</label>\
                                            <input id="seleccionaECheckSoundVideo" type="checkbox" checked="checked" />\
                                            <label for="seleccionaECheckImageVideo">' + _("Image") + ':</label>\
                                            <input id="seleccionaECheckImageVideo" type="checkbox" checked="checked" />\
                                        </div>\
                                    </div>\
                                    <div class="selecciona-EAuthorAlt" id="seleccionaEAuthorAlt">\
                                        <div class="selecciona-EInputAuthor" id="seleccionaInputAuthor">\
                                            <label for="seleccionaEAuthor">' + _("Author") + '</label>\
                                            <input id="seleccionaEAuthor" type="text" />\
                                        </div>\
                                        <div class="selecciona-EInputAlt" id="seleccionaInputAlt">\
                                            <label for="seleccionaEAlt">' + _("Alternative text") + '</label>\
                                            <input id="seleccionaEAlt" type="text" />\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="selecciona-EMultiMediaOption">\
                                    <div class="selecciona-EMultimedia" id="seleccionaEMultimedia">\
                                        <textarea id="seleccionaEText"></textarea>\
                                        <img class="selecciona-EImage" src="' + path + "slcEImage.png" + '" id="seleccionaEImage" alt="' + _("Image") + '" />\
                                        <img class="selecciona-ENoImage" src="' + path + "slcEImage.png" + '" id="seleccionaENoImage" alt="' + _("No image") + '" />\
                                        <div class="selecciona-EVideo" id="seleccionaEVideo"></div>\
                                        <img class="selecciona-ENoImageVideo" src="' + path + "slcENoImageVideo.png" + '" id="seleccionaENoImageVideo" alt="" />\
                                        <img class="selecciona-ENoVideo" src="' + path + "slcENoVideo.png" + '" id="seleccionaENoVideo" alt="" />\
                                        <img class="selecciona-ECursor" src="' + path + "slcCursor.gif" + '" id="seleccionaECursor" alt="Cursor" />\
                                        <img class="selecciona-ECover" src="' + path + "slcECover.png" + '" id="seleccionaECover" alt="' + _("No image") + '" />\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="selecciona-EContents">\
                                  <div class="selecciona-ESolutionSelect"> <label for="seleccionaEScoreQuestion">' + _("Score") + ':<input type="number" name="seleccionaEScoreQuestion" id="seleccionaEScoreQuestion" value="1" min="0"  max="100" step="0.05"/></label>\
                                  <p>' + _("Solution") + ': </p><p id="selecionaESolutionSelect"></p></div>\
                                  <div class="selecciona-EQuestionDiv">\
                                        <label class="sr-av">' + _("Question") + ':</label><input type="text" class="selecciona-EQuestion" id="seleccionaEQuestion">\
                                   </div>\
                                   <div class="selecciona-EAnswers">\
                                    <div class="selecciona-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="checkbox" class="selecciona-ESolution" name="slcsolution" id="seleccionaESolution0" value="A" />\
                                        <label >A</label><input type="text" class="selecciona-EOption0 selecciona-EAnwersOptions" id="seleccionaEOption0">\
                                    </div>\
                                    <div class="selecciona-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="checkbox" class="selecciona-ESolution" name="slcsolution" id="seleccionaESolution1" value="B" />\
                                        <label >B</label><input type="text" class="selecciona-EOption1 selecciona-EAnwersOptions"  id="seleccionaEOption1">\
                                    </div>\
                                    <div class="selecciona-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="checkbox" class="selecciona-ESolution" name="slcsolution" id="seleccionaESolution2" value="C" />\
                                        <label >C</label><input type="text" class="selecciona-EOption2 selecciona-EAnwersOptions"  id="seleccionaEOption2">\
                                    </div>\
                                    <div class="selecciona-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="checkbox"  class="selecciona-ESolution" name="slcsolution" id="seleccionaESolution3" value="D" />\
                                        <label >D</label><input type="text" class="selecciona-EOption3 selecciona-EAnwersOptions"  id="seleccionaEOption3">\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="selecciona-ENavigationButtons">\
                                <a href="#" id="seleccionaEAdd" class="selecciona-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + "slcAdd.png" + '"  alt="" class="selecciona-EButtonImage b-add" /></a>\
                                <a href="#" id="seleccionaEFirst" class="selecciona-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + "slcFirst.png" + '"  alt="" class="selecciona-EButtonImage b-first" /></a>\
                                <a href="#" id="seleccionaEPrevious" class="selecciona-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + "slcPrev.png" + '"  alt="" class="selecciona-EButtonImage b-prev" /></a>\
                                <span class="sr-av">' + _("Question number:") + '</span><span class="selecciona-NumberQuestion" id="seleccionaNumberQuestion">1</span>\
                                <a href="#" id="seleccionaENext" class="selecciona-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + "slcNext.png" + '"  alt="" class="selecciona-EButtonImage b-next" /></a>\
                                <a href="#" id="seleccionaELast" class="selecciona-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + "slcLast.png" + '"  alt="" class="selecciona-EButtonImage b-last" /></a>\
                                <a href="#" id="seleccionaEDelete" class="selecciona-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + "slcDelete.png" + '"  alt="" class="selecciona-EButtonImage b-delete" /></a>\
                                <a href="#" id="seleccionaECopy" class="selecciona-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + "slcCopy.png" + '"   alt="" class="selecciona-EButtonImage b-copy" /></a>\
                                <a href="#" id="seleccionaECut" class="selecciona-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + "slcCut.png" + '"  alt=""  class="selecciona-EButtonImage b-cut" /></a>\
                                <a href="#" id="seleccionaEPaste" class="selecciona-ENavigationButton"  title=' + _("Paste question") + '><img src="' + path + "slcPaste.png" + '"  alt="" class="selecciona-EButtonImage b-paste" /></a>\
                            </div>\
                            <div class="selecciona-EVIDiv" id="seleccionaEVIDiv">\
                                <div class="selecciona-EVIV">\
                                    <div class="selecciona-EMVI">\
                                        <div class="selecciona-EVI" id="seleccionaEVI"></div>\
                                        <img class="selecciona-ENoVI" src="' + path + "slcENoVideo.png" + '" id="seleccionaEVINo" alt="" />\
                                    </div>\
                                </div>\
                                <div class="selecciona-EVIOptions">\
                                    <label for="seleccionaEVIURL">' + _("Youtube URL") + ':</label>\
                                    <input id="seleccionaEVIURL" type="text" />\
                                    <a href="#" id="seleccionaEVIPlayI" class="selecciona-ENavigationButton selecciona-EPlayVideo" title="' + _("Play video intro") + '"><img src="' + path + "slcPlay.png" + '" alt="" class="selecciona-EButtonImage b-playintro" /></a>\
                                    <label for="seleccionaEVIStart">' + _("Start") + ':</label>\
                                    <input id="seleccionaEVIStart" type="text" value="00:00:00" readonly />\
                                    <label for="seleccionaEVIEnd">' + _("End") + ':</label>\
                                    <input id="seleccionaEVIEnd" type="text" value="00:00:00" readonly />\
                                    <button class="selecciona-EVideoTime" id="seleccionaEVITime" type="button">00:00:00</button>\
                                </div>\
                                <input type="button" class="selecciona-EVIClose" id="seleccionaEVIClose" value="' + _("Close") + '" />\
                            </div>\
                            <div class="selecciona-ENumQuestionDiv" id="seleccionaENumQuestionDiv">\
                               <div class="selecciona-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="selecciona-ENumQuestions" id="seleccionaENumQuestions">0</span>\
                            </div>\
                        </div>\
                    </fieldset>\
                    '+$exeAuthoring.iDevice.common.getTextFieldset("after")+'\
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
        $exeAuthoring.iDevice.tabs.init("seleccionaIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        tinymce.init({
            selector: '#seleccionaEText',
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

    },
    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
    },
    initQuestions: function () {
        $('#seleccionaEInputOptionsImage').css('display', 'flex');
        $('#seleccionaEInputVideo').css('display', 'flex');
        $('#seleccionaEAuthorAlt').css('display', 'flex');
        $("#seleccionaMediaNormal").prop("disabled", false);
        $("#seleccionaMediaImage").prop("disabled", false);
        $("#seleccionaMediaText").prop("disabled", false);
        if ($exeDevice.selectsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.selectsGame.push(question);
            this.changeTypeQuestion(0)
            this.showOptions(4);
            this.showSolution('');
        }
        this.active = 0;
    },
    getCuestionDefault: function () {
        var p = new Object();
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
        p.options = [],
            p.options.push('');
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.solution = '';
        p.silentVideo = 0;
        p.tSilentVideo = 0;
        return p;
    },
    loadPreviousValues: function (field) {

        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $exeDevice.Decrypt($('.selecciona-DataGame', wrapper).text());
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.selecciona-LinkImages', wrapper);
            $imagesLink.each(function (index) {
                dataGame.selectsGame[index].url = $(this).attr('href');
                if(dataGame.selectsGame[index].url.length<10){
					dataGame.selectsGame[index].url="";
				}
            });
            $exeDevice.active = 0;
            for (var i = 0; i < dataGame.selectsGame.length; i++) {
                if (dataGame.selectsGame[i].type == 3) {
                    dataGame.selectsGame[i].eText = unescape(dataGame.selectsGame[i].eText);
                }
            }
            $exeDevice.selectsGame = dataGame.selectsGame;
            var instructions = $(".selecciona-instructions", wrapper);
            if (instructions.length == 1) tinyMCE.get('eXeGameInstructions').setContent(instructions.html());
            // i18n
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
             // Text after
            var textAfter = $(".selecciona-extra-content",wrapper);
            if (textAfter.length == 1) tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter.html());

            $exeDevice.updateFieldGame(dataGame);

        }
    },
    updateFieldGame: function (game) {

        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.answersRamdon = game.answersRamdon || false;
        $('#seleccionaEShowMinimize').prop('checked', game.showMinimize);
        $('#seleccionaEQuestionsRamdon').prop('checked', game.optionsRamdon);
        $('#seleccionaEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#seleccionaEUseLives').prop('checked', game.useLives);
        $('#seleccionaENumberLives').val(game.numberLives);
        $('#seleccionaEVideoIntro').val(game.idVideo);
        $('#seleccionaEShowSolution').prop('checked', game.showSolution);
        $('#seleccionaETimeShowSolution').prop('disabled', !game.showSolution);
        $('#seleccionaETimeShowSolution').val(game.timeShowSolution);
        $('#seleccionaENumberLives').prop('disabled', !game.useLives);
        $('#seleccionaEVIURL').val(game.idVideo);
        $('#seleccionaEVIEnd').val($exeDevice.secondsToHour(game.endVideo));
        $('#seleccionaEVIStart').val($exeDevice.secondsToHour(game.startVideo));
        $('#seleccionaECustomScore').prop('checked', game.customScore);
        $('label[for=seleccionaEScoreQuestion], input#seleccionaEScoreQuestion').hide();
        if (game.customScore) {
            $('label[for=seleccionaEScoreQuestion], input#seleccionaEScoreQuestion').show();
        }
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
        var json = JSON.stringify(dataGame),
            divContent = "";
        var instructions = tinyMCE.get('eXeGameInstructions').getContent();
        if (instructions != "") divContent = '<div class="selecciona-instructions">' + instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.selectsGame);
        var html = '<div class="selecciona-IDevice">';
        html += divContent;
        html += '<div class="selecciona-DataGame">' + $exeDevice.Encrypt(json) + '</div>';
        html += linksImages;
        html += '</div>';
         // Get the optional text
         var textAfter = tinymce.editors[2].getContent();
         if (textAfter!="") {
             html += '<div class="selecciona-extra-content">'+textAfter+'</div>';
         }
        return html;
    },
    Encrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        try {
            var key = 146;
            var pos = 0;
            ostr = '';
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

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.type = parseInt($('input[name=slcmediatype]:checked').val());
        p.time = parseInt($('input[name=slctime]:checked').val());
        p.numberOptions = parseInt($('input[name=slcnumber]:checked').val());
        p.typeSelect = parseInt($('input[name=slctypeselect]:checked').val())
        p.x = parseFloat($('#seleccionaEXImage').val());
        p.y = parseFloat($('#seleccionaEYImage').val());;
        p.author = $('#seleccionaEAuthor').val();
        p.alt = $('#seleccionaEAlt').val();
        p.customScore = parseFloat($('#seleccionaEScoreQuestion').val());
        p.url = $('#seleccionaEURLImage').val().trim();
        if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#seleccionaEURLYoutube').val().trim()) ? $('#seleccionaEURLYoutube').val() : '';
        }
        p.soundVideo = $('#seleccionaECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#seleccionaECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#seleccionaEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#seleccionaEEndVideo').val().trim());
        p.silentVideo = $exeDevice.hourToSeconds($('#seleccionaESilenceVideo').val().trim());
        p.tSilentVideo = parseInt($('#seleccionaETimeSilence').val());
        p.eText = tinyMCE.get('seleccionaEText').getContent();
        p.quextion = $('#seleccionaEQuestion').val().trim();
        p.options = [];
        p.solution = $('#selecionaESolutionSelect').text().trim();

        var optionEmpy = false;
        $('.selecciona-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            p.options.push(option);
        });
        if (p.typeSelect == 1 && p.solution.length != p.numberOptions) {
            message = msgs.msgTypeChoose;
        } else if (p.quextion.length == 0) {
            message = msgs.msgECompleteQuestion;
        } else if (optionEmpy) {
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
        } else if (p.type == 2 && !$exeDevice.validTime($('#seleccionaEInitVideo').val()) || !$exeDevice.validTime($('#seleccionaEEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        }else if (p.type == 2 && p.tSilentVideo > 0 && !$exeDevice.validTime($('#seleccionaESilenceVideo').val())) {
            message = msgs.msgTimeFormat;
        }else if (p.type == 2 && p.tSilentVideo > 0  && (p.silentVideo < p.iVideo || p.silentVideo >= p.fVideo)) {
            message = msgs.msgSilentPoint;
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
            var linkImage = '<a href="' + selectsGame[i].url + '" class="js-hidden selecciona-LinkImages">' + i + '</a>';
            if(selectsGame[i].url.length<10){
				linkImage='<a href="#" class="js-hidden selecciona-LinkImages">' + i + '</a>';
			}
            html += linkImage;
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
        link.download = _("Game") + "Selecciona.json";
        document.getElementById('seleccionaIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('seleccionaIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'Selecciona') {
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
        var instructions = game.instructionsExe || game.instructions;
        tinymce.editors[0].setContent(unescape(instructions));
        var textAfter = game.textAfter || '';
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(textAfter));
        $('.exe-form-tabs li:first-child a').click();
    },
    validateData: function () {
        var clear = $exeDevice.removeTags,
            // instructions = escape($("#eXeGameInstructions").html())
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            textAfter = escape(tinyMCE.get('eXeIdeviceTextAfter').getContent()),
            showMinimize = $('#seleccionaEShowMinimize').is(':checked'),
            optionsRamdon = $('#seleccionaEQuestionsRamdon').is(':checked'),
            answersRamdon = $('#seleccionaEAnswersRamdon').is(':checked'),
            showSolution = $('#seleccionaEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#seleccionaETimeShowSolution').val())),
            useLives = $('#seleccionaEUseLives').is(':checked'),
            numberLives = parseInt(clear($('#seleccionaENumberLives').val())),
            idVideo = $('#seleccionaEVideoIntro').val(),
            endVideo = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()),
            startVideo = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            customScore = $('#seleccionaECustomScore').is(':checked');
        if (!itinerary) return false;
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        var selectsGame = $exeDevice.selectsGame;
        for (var i = 0; i < selectsGame.length; i++) {
            mquestion = selectsGame[i]
            mquestion.customScore=typeof(mquestion.customScore)=="undefined"?1:mquestion.customScore;
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
            'typeGame': 'Selecciona',
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
            'textAfter': textAfter
        }
        return data;
    },

    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    addEvents: function () {
        $('#seleccionaEPaste').hide();
        $('#seleccionaEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaENumberLives').prop('disabled', !marcado);
        });
        $('#seleccionaEInitVideo, #seleccionaEEndVideo, #seleccionaESilenceVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#seleccionaEInitVideo, #seleccionaEEndVideo, #seleccionaESilenceVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });

        });
       
        $('#seleccionaShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaCodeAccess').prop('disabled', !marcado);
            $('#seleccionaMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.selecciona-EPanel').on('click', 'input.selecciona-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });

        $('.selecciona-EPanel').on('click', 'input.selecciona-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#seleccionaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#seleccionaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#seleccionaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#seleccionaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#seleccionaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#seleccionaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#seleccionaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#seleccionaECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#seleccionaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });

        $('#seleccionaEPlayVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.showVideoQuestion();
        });

        $(' #seleccionaECheckSoundVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });
        $('#seleccionaECheckImageVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });


        $('#seleccionaENumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#seleccionaENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#seleccionaETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#seleccionaETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#seleccionaENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#seleccionaETimeSilence').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });

        $('#seleccionaEScoreQuestion').on('focusout', function () {
            if (!$exeDevice.validateScoreQuestion($(this).val())) {
                $(this).val(1);
            }
        });
        $('#seleccionaIdeviceForm').on('dblclick', '#seleccionaEImage', function () {
            $('#seleccionaECursor').hide();
            $('#seleccionaEXImage').val(0);
            $('#seleccionaEYImage').val(0);
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

        $('#seleccionaEInitVideo').css('color', '#2c6d2c');
        $('#seleccionaEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#seleccionaEInitVideo').css('color', '#2c6d2c');
            $('#seleccionaEEndVideo').css('color', '#000000');
            $('#seleccionaESilenceVideo').css('color', '#000000');
        });
        $('#seleccionaEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#seleccionaEEndVideo').css('color', '#2c6d2c');
            $('#seleccionaEInitVideo').css('color', '#000000');
            $('#seleccionaESilenceVideo').css('color', '#000000');
        });
        $('#seleccionaESilenceVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 2;
            $('#seleccionaESilenceVideo').css('color', '#2c6d2c');
            $('#seleccionaEEndVideo').css('color', '#000000');
            $('#seleccionaEInitVideo').css('color', '#000000');
        });

        $('#seleccionaENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#seleccionaEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#seleccionaEInitVideo');
                    break;
                case 1:
                    $timeV = $('#seleccionaEEndVideo');
                    break;
                case 2:
                    $timeV = $('#seleccionaESilenceVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#seleccionaEVideoTime').text());
            $timeV.css({'background-color':'white','color':'#2c6d2c'});
        });
        $('#seleccionaEVIStart').css('color', '#2c6d2c');
        $('#seleccionaEVIStart').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = true;
            $('#seleccionaEVIStart').css('color', '#2c6d2c');
            $('#seleccionaEVIEnd').css('color', '#000000');
        });
        $('#seleccionaEVIEnd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = false;
            $('#seleccionaEVIEnd').css('color', '#2c6d2c');
            $('#seleccionaEVIStart').css('color', '#000000');
        });
        $('#seleccionaEVITime').on('click', function (e) {
            e.preventDefault();
            var $timeV = $exeDevice.timeVIFocus ? $('#seleccionaEVIStart') : $('#seleccionaEVIEnd');
            $timeV.val($('#seleccionaEVITime').text());
        });
        $('#seleccionaUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaNumberLives').prop('disabled', !marcado);
        });
        $('#seleccionaEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#seleccionaETimeShowSolution').prop('disabled', !marcado);
        });

        $('.selecciona-ESolution').on('change', function (e) {
            var marcado = $(this).is(':checked'),
                value = $(this).val();
            $exeDevice.clickSolution(marcado, value);
        });

        $('#seleccionaECustomScore').on('change', function () {
            var marcado = $(this).is(':checked');
            $('label[for=seleccionaEScoreQuestion], input#seleccionaEScoreQuestion').hide();
            if (marcado) {
                $('label[for=seleccionaEScoreQuestion], input#seleccionaEScoreQuestion').show();
            }
        });

        $('#seleccionaEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#seleccionaEAlt').val(),
                x = parseFloat($('#seleccionaEXImage').val()),
                y = parseFloat($('#seleccionaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });
        $('#seleccionaEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#seleccionaEVideoIntroPlay').on('click', function (e) {
            e.preventDefault();
            var idv = $exeDevice.getIDYoutube($('#seleccionaEVideoIntro').val());
            if (idv) {
                var iVI = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
                    fVI = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) : 9000;
                $('#seleccionaEVIURL').val($('#seleccionaEVideoIntro').val());
                $('#seleccionaEVIDiv').show();
                $('#seleccionaEVI').show();
                $('#seleccionaEVINo').hide();
                $('#seleccionaENumQuestionDiv').hide();
                $exeDevice.startVideoIntro(idv, iVI, fVI);
            } else {
                $('#seleccionaEVINo').show();
                $('#seleccionaEVI').hide();
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            }
        });
        $('#seleccionaEVIPlayI').on('click', function (e) {
            e.preventDefault();
            var idv = $exeDevice.getIDYoutube($('#seleccionaEVIURL').val());
            if (idv) {
                var iVI = $exeDevice.hourToSeconds($('#seleccionaEVIStart').val()),
                    fVI = $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#seleccionaEVIEnd').val()) : 9000;
                if (fVI <= iVI) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                    return;
                }
                $exeDevice.startVideoIntro(idv, iVI, fVI);
            } else {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube)
            }
        });
        $('#seleccionaEVIClose').on('click', function (e) {
            e.preventDefault();
            $('#seleccionaEVideoIntro').val($('#seleccionaEVIURL').val());
            $('#seleccionaEVIDiv').hide();
            $('#seleccionaENumQuestionDiv').show();
            $exeDevice.stopVideoIntro();
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

    /*
    setInputFilter(document.getElementById("intTextBox"), function(value) {
    return /^-?\d*$/.test(value); });
    setInputFilter(document.getElementById("uintTextBox"), function(value) {
    return /^\d*$/.test(value); });
    setInputFilter(document.getElementById("intLimitTextBox"), function(value) {
    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500); });
    setInputFilter(document.getElementById("currencyTextBox"), function(value) {
    return /^-?\d*[.,]?\d{0,2}$/.test(value); });
    setInputFilter(document.getElementById("latinTextBox"), function(value) {
    return /^[a-z]*$/i.test(value); });
    setInputFilter(document.getElementById("hexTextBox"), function(value) {
    return /^[0-9a-f]*$/i.test(value); });

    */
    clickSolution: function (checked, value) {
        var solutions = $('#selecionaESolutionSelect').text();

        if (checked) {
            if (solutions.indexOf(value) == -1) {
                solutions += value;
            }
        } else {
            solutions = solutions.split(value).join('')
        }
        $('#selecionaESolutionSelect').text(solutions);
    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#seleccionaECursor');
        $x = $('#seleccionaEXImage'),
            $y = $('#seleccionaEYImage'),
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