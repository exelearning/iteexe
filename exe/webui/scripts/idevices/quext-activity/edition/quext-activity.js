/**
 * QuExt Activity iDevice (edition code)
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
        name: _('QuExt Activity'),
    },
    iDevicePath: "/scripts/idevices/quext-activity/edition/",
    msgs: {},
    active: 0,
    questionsGame: [],
    youtubeLoaded: false,
    player: '',
    playerIntro: '',
    timeUpdateInterval: '',
    timeUpdateVIInterval: '',
    timeVideoFocus: true,
    timeVIFocus: true,
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
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
        "msgAnswer": _("Answer"),
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
        "msgTryAgain": _("You need at least %s% of correct answers to get the information. Please try again."),
        "msgVideoIntro": _("Video Intro"),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgRickText": _("Rich Text"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Please wait..."),
        "mgsPoints": _("points")
    },

    init: function () {
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

    },
    loadYoutubeApi: function () {

        onYouTubeIframeAPIReady = $exeDevice.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    youTubeReady: function () {
        $("#quextMediaVideo").prop("disabled", false);
        $exeDevice.player = new YT.Player('quextEVideo', {
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
        $exeDevice.playerIntro = new YT.Player('quextEVI', {
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
    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#quextEVideoTime').text(time);
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },
    updateTimerVIDisplay: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.playerIntro.getCurrentTime());
                $('#quextEVITime').text(time);
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
            $exeDevice.questionsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active=$exeDevice.questionsGame.length-1;
            $('#quextNumberQuestion').text($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#quextEPaste').hide();
            $('#quextENumQuestions').text($exeDevice.questionsGame.length);
        }
    },
    removeQuestion: function (num) {
        if ($exeDevice.questionsGame.length < 2) {
            $exeDevice.showMessage(msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.questionsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.questionsGame.length - 1) {
                $exeDevice.active = $exeDevice.questionsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#quextEPaste').hide();
            $('#quextENumQuestions').text($exeDevice.questionsGame.length);
            $('#vquextNumberQuestion').text($exeDevice.active + 1);
        }

    },
    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.questionsGame[$exeDevice.active];
            $('#quextEPaste').show();
        }

    },
    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#quextEPaste').show();

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
            $exeDevice.questionsGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#quextEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.questionsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#quextENumQuestions').text($exeDevice.questionsGame.length);
        }
    },
    nextQuestion: function () {

        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.questionsGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },
    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.questionsGame.length - 1) {
                $exeDevice.active = $exeDevice.questionsGame.length - 1;
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
        num = num >= $exeDevice.questionsGame.length ? $exeDevice.questionsGame.length - 1 : num;
        p = $exeDevice.questionsGame[num];

        var numOptions = 0;
        $('.quext-EAnwersOptions').each(function (j) {
            numOptions++;
            if (p.options[j].trim() !== '') {
                p.numOptions = numOptions;
            }
            $(this).val(p.options[j]);
        });

        $exeDevice.stopVideo();
        $exeDevice.changeTypeQuestion(p.type);
        $exeDevice.showOptions(p.numberOptions);
        $('#quextEQuestion').val(p.quextion);
        $('#quextENumQuestions').text($exeDevice.questionsGame.length);
        if (p.type == 1) {
            $('#quextEURLImage').val(p.url);
            $('#quextEXImage').val(p.x);
            $('#quextEYImage').val(p.y);
            $('#quextEAuthor').val(p.author);
            $('#quextEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#quextECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#quextECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#quextEURLYoutube').val(p.url);
            $('#quextEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#quextEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $exeDevice.showVideoQuestion();
        } else if (p.type == 3) {
            tinyMCE.get('quextEText').setContent(unescape(p.eText));
        }
        $('.quext-EAnwersOptions').each(function (j) {
            var option = j < p.numOptions ? p.options[j] : '';
            $(this).val(option);
        });
        $('#quextNumberQuestion').text(i + 1);
        $("input.quext-Number[name='qxnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.quext-Type[name='qxtype'][value='" + p.type + "']").prop("checked", true);
        $("input.quext-ESolution[name='qxsolution'][value='" + p.solution + "']").prop("checked", true);


    },
    showVideoYoutube: function (quextion) {
        var id = $exeDevice.getIDYoutube(quextion.url);
        $('#quextEImageVideo').hide();
        $('#quextENoVideo').hide();
        $('#quextEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, quextion.iVideo, quextion.fVideo);
            $('#quextEVideo').show();
            if (quextion.imageVideo == 0) {
                $('#quextEImageVideo').show();
            }
            if (quextion.soundVideo == 0) {
                $('#quextEImageVideo').show();
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {

            $exeDevice.showMessage($exeDevice.msgEUnavailableVideo);
            $('#quextENoVideo').show();
        }
    },
    showVideoQuestion: function () {
        var soundVideo = $('#quextECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#quextECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#quextEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#quextEEndVideo').val()),
            url = $('#quextEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        if (fVideo <= iVideo) fVideo = 36000;
        $('#quextENoImageVideo').hide();
        $('#quextENoVideo').show();
        $('#quextEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#quextEVideo').show();
            $('#quextENoVideo').hide();
            if (imageVideo == 0) {
                $('#quextEVideo').hide();
                $('#quextENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage(_("This video is not currently available"));
            $('#quextENoVideo').show();
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
        var $image = $('#quextEImage'),
            $cursor = $('#quextECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#quextENoImage').show();
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
                    $('#quextENoImage').hide();
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
        $exeDevice.showSolution(0);
        //$("input.myclass[name='myname'][value='the_value']").prop("checked", true);
        $('.quext-Type')[0].checked = true;
        $('.quext-Times')[0].checked = true;
        $('.quext-Number')[2].checked = true;
        $('#quextEURLImage').val('');
        $('#quextEXImage').val('0');
        $('#quextEYImage').val('0');
        $('#quextEAuthor').val('');
        $('#quextEAlt').val('');
        $('#quextEURLYoutube').val('');
        $('#quextEInitVideo').val('00:00:00');
        $('#quextEEndVideo').val('00:00:00');
        $('#quextECheckSoundVideo').prop('checked', true);
        $('#quextECheckImageVideo').prop('checked', true);
        tinyMCE.get('quextEText').setContent('');
        $('#quextEQuestion').val('');
        $('.quext-EAnwersOptions').each(function () {
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

        $('#quextETitleAltImage').hide();
        $('#quextEAuthorAlt').hide();
        $('#quextETitleImage').hide();
        $('#quextEInputImage').hide();
        $('#quextETitleVideo').hide();
        $('#quextEInputVideo').hide();
        $('#quextEInputOptionsVideo').hide();
        $('#quextInputOptionsImage').hide();
        if (tinyMCE.get('quextEText')) {
            tinyMCE.get('quextEText').hide();
        }

        $('#quextEText').hide();
        $('#quextEVideo').hide();
        $('#quextEImage').hide();
        $('#quextENoImage').hide();
        $('#quextECover').hide();
        $('#quextECursor').hide();
        $('#quextENoImageVideo').hide();
        $('#quextENoVideo').hide();
        switch (type) {
            case 0:
                $('#quextECover').show();
                break;
            case 1:
                $('#quextENoImage').show();
                $('#quextETitleImage').show();
                $('#quextEInputImage').show();
                $('#quextEAuthorAlt').show();
                $('#quextECursor').show();
                $('#quextInputOptionsImage').show();
                $exeDevice.showImage($('#quextEURLImage').val(), $('#quextEXImage').val(), $('#quextEYImage').val(), $('#quextEAlt').val(), 0)
                break;
            case 2:
                $('#quextEImageVideo').show();
                $('#quextETitleVideo').show();
                $('#quextEInputVideo').show();
                $('#quextENoVideo').show();
                $('#quextEVideo').show();
                $('#quextEInputOptionsVideo').show();
                break;
            case 3:
                $('#quextEText').show();
                if (tinyMCE.get('quextEText')) {
                    tinyMCE.get('quextEText').show();
                }
                break;
            default:
                break;
        }
    },
    showOptions: function (number) {
        $('.quext-EOptionDiv').each(function (i) {
            $(this).show();
            if (i >= number) {
                $(this).hide();
                $exeDevice.showSolution(0);
            }

        });
        $('.quext-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },
    showSolution: function (solution) {
        $('.quext-ESolution')[solution].checked = true;

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="quextIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answer")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="quextEShowMinimize"><input type="checkbox" id="quextEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="quextEUseLives"><input type="checkbox" checked id="quextEUseLives">' + _("Use lives") + '.</label>\
                                <label for="quextENumberLives">' + _("Number of lives") + ':<input type="number" name="quextENumberLives" id="quextENumberLives" value="3" min="1" max="5" /></label>\
                            </p>\
                            <p>\
                                <label for="quextEQuestionsRamdon"><input type="checkbox" id="quextEQuestionsRamdon">' + _("Random questions") + '</label>\
                                <label for="quextEAnswersRamdon"><input type="checkbox" id="quextEAnswersRamdon">' + _("Random options") + '</label>\
                            </p>\
                            <p>\
                                <label for="quextEShowSolution"><input type="checkbox" checked id="quextEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="quextETimeShowSolution">' + _("Show solution time (seconds)") + ' <input type="number" name="quextETimeShowSolution" id="quextETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <div class="quext-EVideoIntroData">\
                                <label for="quextEVideoIntro">' + _("Video Intro") + '<input type="text" id="quextEVideoIntro" /></label>\
                                <a href="#" id="quextEVideoIntroPlay" class="quext-tEVideoIntroPlay"  title="' + _("Play video intro") + '"><img src="' + path + "quextPlay.png" + '"  alt="" class="quext-EButtonImage b-play" /></a>\
                            </div>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="quext-EPanel" id="quextEPanel">\
                            <div class="quext-EOptionsMedia">\
                                <div class="quext-EOptionsGame">\
                                    <span>' + _("Multimedia Type") + ':</span>\
                                    <div class="quext-EInputMedias">\
                                        <input class="quext-Type" checked="checked" id="quextMediaNormal" type="radio" name="qxtype" value="0" disabled />\
                                        <label for="quext-MediaNormal">' + _("None") + '</label>\
                                        <input class="quext-Type"  id="quextMediaImage" type="radio" name="qxtype" value="1" disabled />\
                                        <label for="mediaImagen">' + _("Image") + '</label>\
                                        <input class="quext-Type"  id="quextMediaVideo" type="radio" name="qxtype" value="2" disabled />\
                                        <label for="mediaVideo">' + _("Video") + '</label>\
                                        <input class="quext-Type"  id="quextMediaText" type="radio" name="qxtype" value="3" disabled />\
                                        <label for="mediaTexto">' + _("Text") + '</label>\
                                    </div>\
                                    <span>' + _("Options Number") + ':</span>\
                                    <div class="quext-EInputNumbers">\
                                        <input class="quext-Number" id="numQ2" type="radio" name="qxnumber" value="2" />\
                                        <label for="numQ2">2</label>\
                                        <input class="quext-Number" id="numQ3" type="radio" name="qxnumber" value="3" />\
                                        <label for="numQ3">3</label>\
                                        <input class="quext-Number" id="numQ4" type="radio" name="qxnumber" value="4" checked="checked" />\
                                        <label for="numQ4">4</label>\
                                    </div>\
                                    <span>' + _("Time per question") + ':</span>\
                                    <div class="quext-EInputTimes">\
                                        <input class="quext-Times" checked="checked" id="q15s" type="radio" name="qxtime" value="0" />\
                                        <label for="q15s">15s</label>\
                                        <input class="quext-Times" id="q30s" type="radio" name="qxtime" value="1" />\
                                        <label for="q30s">30s</label>\
                                        <input class="quext-Times" id="q1m" type="radio" name="qxtime" value="2" />\
                                        <label for="q1m">1m</label>\
                                        <input class="quext-Times" id="q3m" type="radio" name="qxtime" value="3" />\
                                        <label for="q3m">3m</label>\
                                        <input class="quext-Times" id="q5m" type="radio" name="qxtime" value="4" />\
                                        <label for="q5m">5m</label>\
                                        <input class="quext-Times" id="q10m" type="radio" name="qxtime" value="5" />\
                                        <label for="q10m">10m</label>\
                                    </div>\
                                    <span class="quext-ETitleImage" id="quextETitleImage">' + _("Image URL") + '</span>\
                                    <div class="quext-EInputImage" id="quextEInputImage">\
                                        <label class="sr-av" for="quextEURLImage">' + _("Image URL") + '</label>\
                                        <input type="text" class="exe-file-picker quext-EURLImage"  id="quextEURLImage"/>\
                                    </div>\
                                    <div class="quext-EInputOptionsImage" id="quextInputOptionsImage">\
                                        <div>\
                                            <label for="quextEXImage">X:</label>\
                                            <input id="quextEXImage" type="text" value="0" />\
                                            <label for="quextEXImage">Y:</label>\
                                            <input id="quextEYImage" type="text" value="0" />\
                                        </div>\
                                    </div>\
                                    <span class="quext-ETitleVideo" id="quextETitleVideo">' + _("Youtube URL") + '</span>\
                                    <div class="quext-EInputVideo" id="quextEInputVideo">\
                                        <label class="sr-av" for="quextEURLYoutube">' + _("Youtube URL") + '</label>\
                                        <input id="quextEURLYoutube" type="text" />\
                                        <a href="#" id="quextEPlayVideo" class="quext-ENavigationButton quext-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + "quextPlay.png" + '"  alt="" class="quext-EButtonImage b-play" /></a>\
                                    </div>\
                                    <div class="quext-EInputOptionsVideo" id="quextEInputOptionsVideo">\
                                        <div>\
                                            <label for="quextEInitVideo">' + _("Start") + ':</label>\
                                            <input id="quextEInitVideo" type="text" value="00:00:00" readonly />\
                                            <label for="quextEEndVideo">' + _("End") + ':</label>\
                                            <input id="quextEEndVideo" type="text" value="00:00:00" readonly />\
                                            <button class="quext-EVideoTime" id="quextEVideoTime" type="button">00:00:00</button>\
                                        </div>\
                                        <div>\
                                            <label for="quextECheckSoundVideo">' + _("Audio") + ':</label>\
                                            <input id="quextECheckSoundVideo" type="checkbox" checked="checked" />\
                                            <label for="quextECheckImageVideo">' + _("Image") + ':</label>\
                                            <input id="quextECheckImageVideo" type="checkbox" checked="checked" />\
                                        </div>\
                                    </div>\
                                    <div class="quext-EAuthorAlt" id="quextEAuthorAlt">\
                                        <div class="quext-EInputAuthor" id="quextInputAuthor">\
                                            <label for="quextEAuthor">' + _("Author") + '</label>\
                                            <input id="quextEAuthor" type="text" />\
                                        </div>\
                                        <div class="quext-EInputAlt" id="quextInputAlt">\
                                            <label for="quextEAlt">' + _("Alternative text") + '</label>\
                                            <input id="quextEAlt" type="text" />\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="quext-EMultiMediaOption">\
                                    <div class="quext-EMultimedia" id="quextEMultimedia">\
                                        <textarea id="quextEText"></textarea>\
                                        <img class="quext-EImage" src="' + path + "quextEImage.png" + '" id="quextEImage" alt="' + _("Image") + '" />\
                                        <img class="quext-ENoImage" src="' + path + "quextEImage.png" + '" id="quextENoImage" alt="' + _("No image") + '" />\
                                        <div class="quext-EVideo" id="quextEVideo"></div>\
                                        <img class="quext-ENoImageVideo" src="' + path + "quextENoImageVideo.png" + '" id="quextENoImageVideo" alt="" />\
                                        <img class="quext-ENoVideo" src="' + path + "quextENoVideo.png" + '" id="quextENoVideo" alt="" />\
                                        <img class="quext-ECursor" src="' + path + "quextCursor.gif" + '" id="quextECursor" alt="Cursor" />\
                                        <img class="quext-ECover" src="' + path + "quextECover.png" + '" id="quextECover" alt="' + _("No image") + '" />\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="quext-EContents">\
                                   <div class="quext-EQuestionDiv">\
                                        <label class="sr-av">' + _("Question") + ':</label><input type="text" class="quext-EQuestion" id="quextEQuestion">\
                                   </div>\
                                   <div class="quext-EAnswers">\
                                    <div class="quext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="radio" class="quext-ESolution" name="qxsolution" id="quextESolution0" value="0" checked="checked" />\
                                        <label class="sr-av">' + _("Option") + ' A:</label><input type="text" class="quext-EOption0 quext-EAnwersOptions" id="quextEOption0">\
                                    </div>\
                                    <div class="quext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="radio" class="quext-ESolution" name="qxsolution" id="quextESolution1" value="1" />\
                                        <label class="sr-av">' + _("Option") + ' B:</label><input type="text" class="quext-EOption1 quext-EAnwersOptions"  id="quextEOption1">\
                                    </div>\
                                    <div class="quext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="radio" class="quext-ESolution" name="qxsolution" id="quextESolution2" value="2" />\
                                        <label class="sr-av">' + _("Option") + ' C:</label><input type="text" class="quext-EOption2 quext-EAnwersOptions"  id="quextEOption2">\
                                    </div>\
                                    <div class="quext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="radio"  class="quext-ESolution" name="qxsolution" id="quextESolution3" value="3" />\
                                        <label class="sr-av">' + _("Option") + ' D:</label><input type="text" class="quext-EOption3 quext-EAnwersOptions"  id="quextEOption3">\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="quext-ENavigationButtons">\
                                <a href="#" id="quextEAdd" class="quext-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + "quextAdd.png" + '"  alt="" class="quext-EButtonImage b-add" /></a>\
                                <a href="#" id="quextEFirst" class="quext-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + "quextFirst.png" + '"  alt="" class="quext-EButtonImage b-first" /></a>\
                                <a href="#" id="quextEPrevious" class="quext-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + "quextPrev.png" + '"  alt="" class="quext-EButtonImage b-prev" /></a>\
                                <span class="sr-av">' + _("Question number:") + '</span><span class="quext-NumberQuestion" id="quextNumberQuestion">1</span>\
                                <a href="#" id="quextENext" class="quext-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + "quextNext.png" + '"  alt="" class="quext-EButtonImage b-next" /></a>\
                                <a href="#" id="quextELast" class="quext-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + "quext-last.png" + '"  alt="" class="quext-EButtonImage b-last" /></a>\
                                <a href="#" id="quextEDelete" class="quext-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + "quextDelete.png" + '"  alt="" class="quext-EButtonImage b-delete" /></a>\
                                <a href="#" id="quextECopy" class="quext-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + "quextCopy.png" + '"   alt="" class="quext-EButtonImage b-copy" /></a>\
                                <a href="#" id="quextECut" class="quext-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + "quextCut.png" + '"  alt=""  class="quext-EButtonImage b-cut" /></a>\
                                <a href="#" id="quextEPaste" class="quext-ENavigationButton"  title=' + _("Paste question") + '><img src="' + path + "quextPaste.png" + '"  alt="" class="quext-EButtonImage b-paste" /></a>\
                            </div>\
                            <div class="quext-EVIDiv" id="quextEVIDiv">\
                                <div class="quext-EVIV">\
                                    <div class="quext-EMVI">\
                                        <div class="quext-EVI" id="quextEVI"></div>\
                                        <img class="quext-ENoVI" src="' + path + "quextENoVideo.png" + '" id="quextEVINo" alt="" />\
                                    </div>\
                                </div>\
                                <div class="quext-EVIOptions">\
                                    <label for="quextEVIURL">' + _("Youtube URL") + ':</label>\
                                    <input id="quextEVIURL" type="text" />\
                                    <a href="#" id="quextEVIPlayI" class="quext-ENavigationButton quext-EPlayVideo" title="' + _("Play video intro") + '"><img src="' + path + "quextPlay.png" + '" alt="" class="quext-EButtonImage b-playintro" /></a>\
                                    <label for="quextEVIStart">' + _("Start") + ':</label>\
                                    <input id="quextEVIStart" type="text" value="00:00:00" readonly />\
                                    <label for="quextEVIEnd">' + _("End") + ':</label>\
                                    <input id="quextEVIEnd" type="text" value="00:00:00" readonly />\
                                    <button class="quext-EVideoTime" id="quextEVITime" type="button">00:00:00</button>\
                                </div>\
                                <input type="button" class="quext-EVIClose" id="quextEVIClose" value="' + _("Close") + '" />\
                            </div>\
                            <div class="quext-ENumQuestionDiv" id="quextENumQuestionDiv">\
                               <div class="quext-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="quext-ENumQuestions" id="quextENumQuestions">0</span>\
                            </div>\
                        </div>\
                    </fieldset>\
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
        $exeAuthoring.iDevice.tabs.init("quextIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        tinymce.init({
            selector: '#quextEText',
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

    initQuestions: function () {
        $('#quextEInputOptionsImage').css('display', 'flex');
        $('#quextEInputVideo').css('display', 'flex');
        $('#quextEAuthorAlt').css('display', 'flex');
        $("#quextMediaNormal").prop("disabled", false);
        $("#quextMediaImage").prop("disabled", false);
        $("#quextMediaText").prop("disabled", false);
        if ($exeDevice.questionsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.questionsGame.push(question);
            this.changeTypeQuestion(0)
            this.showOptions(4);
            this.showSolution(0);
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
        p.solution = 0;
        return p;
    },
    loadPreviousValues: function (field) {

        var originalHTML = field.val();
        if (originalHTML != '') {
            $exeDevice.active = 0;
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.quext-DataGame', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.quext-LinkImages', wrapper);
            $imagesLink.each(function (index) {
                dataGame.questionsGame[index].url = $(this).attr('href');
            });
            $exeDevice.active = 0;
            for (var i = 0; i < dataGame.questionsGame.length; i++) {
                if (dataGame.questionsGame[i].type == 3) {
                    dataGame.questionsGame[i].eText = unescape(dataGame.questionsGame[i].eText);
                }
            }
            $exeDevice.questionsGame = dataGame.questionsGame;
            var instructions = $(".quext-instructions", wrapper);
            if (instructions.length == 1) tinyMCE.get('eXeGameInstructions').setContent(instructions.html());
            $exeDevice.updateFieldGame(dataGame);

        }
    },
    updateFieldGame: function (game) {

        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.answersRamdon = game.answersRamdon || false;
        $('#quextEShowMinimize').prop('checked', game.showMinimize);
        $('#quextEQuestionsRamdon').prop('checked', game.optionsRamdon);
        $('#quextEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#quextEUseLives').prop('checked', game.useLives);
        $('#quextENumberLives').val(game.numberLives);
        $('#quextEVideoIntro').val(game.idVideo);
        $('#quextShowSolutions').prop('checked', game.showSolution);
        $('#quextTimeShowSolutions').val(game.timeShowSolution)
        $('#quextETimeShowSolution').prop('disabled', !game.showSolution);
        $('#quextENumberLives').prop('disabled', !game.useLives);
        $('#quextEVIURL').val(game.idVideo);
        $('#quextEVIEnd').val($exeDevice.secondsToHour(game.endVideo));
        $('#quextEVIStart').val($exeDevice.secondsToHour(game.startVideo));
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
        if (instructions != "") divContent = '<div class="quext-instructions">' + instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.questionsGame);
        var html = '<div class="quext-IDevice">';
        html += divContent;
        html += '<div class="quext-DataGame">' + json + '</div>';
        html += linksImages;
        html += '</div>';
        return html;
    },
    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.type = parseInt($('input[name=qxtype]:checked').val());
        p.time = parseInt($('input[name=qxtime]:checked').val());
        p.numberOptions = parseInt($('input[name=qxnumber]:checked').val());
        p.x = parseFloat($('#quextEXImage').val());
        p.y = parseFloat($('#quextEYImage').val());;
        p.author = $('#quextEAuthor').val();
        p.alt = $('#quextEAlt').val();
        if (p.type == 1) {
            p.url = $('#quextEURLImage').val().trim();
        } else if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#quextEURLYoutube').val().trim()) ? $('#quextEURLYoutube').val() : '';

        }
        p.soundVideo = $('#quextECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#quextECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#quextEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#quextEEndVideo').val().trim());
        p.eText = tinyMCE.get('quextEText').getContent();
        p.quextion = $('#quextEQuestion').val().trim();
        p.options = [];
        p.solution = parseInt($('input[name=qxsolution]:checked').val());
        var optionEmpy = false;
        $('.quext-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            p.options.push(option);
        });
        if (p.quextion.length == 0) {
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
        }

        if (message.length == 0) {
            $exeDevice.questionsGame[$exeDevice.active] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;

    },
    createlinksImage: function (questionsGame) {
        var html = '';
        for (var i = 0; i < questionsGame.length; i++) {
            var linkImage = '<a href="' + questionsGame[i].url + '" class="js-hidden quext-LinkImages">' + i + '</a>';
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
        link.download = _("Game") + "QuExt.json";
        document.getElementById('quextIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('quextIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'QuExt') {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.questionsGame = game.questionsGame;
        for (var i = 0; i < $exeDevice.questionsGame.length; i++) {
            if (game.questionsGame[i].type == 3) {
                game.questionsGame[i].eText = unescape(game.questionsGame[i].eText);
            }
            var numOpt = 0,
                options = $exeDevice.questionsGame[i].options;
            for (var j = 0; j < options.length; j++) {
                if (options[j].trim().length == 0) {
                    $exeDevice.questionsGame[i].numberOptions = numOpt;
                    break;
                }
                numOpt++;
            }
        }
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions;
        tinymce.editors[0].setContent(unescape(instructions));
        $('.exe-form-tabs li:first-child a').click();
    },
    validateData: function () {
        var clear = $exeDevice.removeTags,
            // instructions = escape($("#eXeGameInstructions").html())
            instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            showMinimize = $('#quextEShowMinimize').is(':checked'),
            optionsRamdon = $('#quextEQuestionsRamdon').is(':checked'),
            answersRamdon = $('#quextEAnswersRamdon').is(':checked'),
            showSolution = $('#quextEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#quextETimeShowSolution').val())),
            useLives = $('#quextEUseLives').is(':checked'),
            numberLives = parseInt(clear($('#quextENumberLives').val())),
            idVideo = $('#quextEVideoIntro').val(),
            endVideo = $exeDevice.hourToSeconds($('#quextEVIEnd').val()),
            startVideo = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues();
        if (!itinerary) return false;
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        var questionsGame = $exeDevice.questionsGame;
        for (var i = 0; i < questionsGame.length; i++) {
            mquestion = questionsGame[i]
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
        for (var i = 0; i < questionsGame.length; i++) {
            var qt = questionsGame[i]
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
            'typeGame': 'QuExt',
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
            'questionsGame': questionsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'title': ''
        }
        return data;
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    addEvents: function () {
        $('#quextEPaste').hide();
        $('#quextEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextENumberLives').prop('disabled', !marcado);
        });
        $('#quextShowSolutions').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextTimeShowSolutions').prop('disabled', !marcado);
        });

        $('#quextShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextCodeAccess').prop('disabled', !marcado);
            $('#quextMessageCodeAccess').prop('disabled', !marcado);
        });
        $('.quext-EPanel').on('click', 'input.quext-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });

        $('.quext-EPanel').on('click', 'input.quext-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#quextEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#quextEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#quextEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#quextENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#quextELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#quextEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#quextECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#quextECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#quextEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });

        $('#quextEPlayVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.showVideoQuestion();
        });

        $(' #quextECheckSoundVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });
        $('#quextECheckImageVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });


        $('#quextENumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#quextENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#quextETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#quextETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
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

        $('#quextEInitVideo').css('color', '#2c6d2c');
        $('#quextEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = true;
            $('#quextEInitVideo').css('color', '#2c6d2c');
            $('#quextEEndVideo').css('color', '#000000');
        });
        $('#quextEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = false;
            $('#quextEEndVideo').css('color', '#2c6d2c');
            $('#quextEInitVideo').css('color', '#000000');
        });
        $('#quextEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = $exeDevice.timeVideoFocus ? $('#quextEInitVideo') : $('#quextEEndVideo');
            $timeV.val($('#quextEVideoTime').text());
        });
        $('#quextEVIStart').css('color', '#2c6d2c');
        $('#quextEVIStart').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = true;
            $('#quextEVIStart').css('color', '#2c6d2c');
            $('#quextEVIEnd').css('color', '#000000');
        });
        $('#quextEVIEnd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = false;
            $('#quextEVIEnd').css('color', '#2c6d2c');
            $('#quextEVIStart').css('color', '#000000');
        });
        $('#quextEVITime').on('click', function (e) {
            e.preventDefault();
            var $timeV = $exeDevice.timeVIFocus ? $('#quextEVIStart') : $('#quextEVIEnd');
            $timeV.val($('#quextEVITime').text());
        });
        $('#quextUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextNumberLives').prop('disabled', !marcado);
        });
        $('#quextShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#quextTimeShowSolution').prop('disabled', !marcado);
        });
        $('#quextEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#quextEAlt').val(),
                x = parseFloat($('#quextEXImage').val()),
                y = parseFloat($('#quextEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });
        $('#quextEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#quextEVideoIntroPlay').on('click', function (e) {
            e.preventDefault();
            console.log('video', $('#quextEVIURL').val());
            var idv = $exeDevice.getIDYoutube($('#quextEVideoIntro').val());
            if (idv) {
                console.log('inicio video', $('#quextEVIStart').val());
                var iVI = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
                    fVI = $exeDevice.hourToSeconds($('#quextEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#quextEVIEnd').val()) : 9000;
                $('#quextEVIURL').val($('#quextEVideoIntro').val());
                $('#quextEVIDiv').show();
                $('#quextEVI').show();
                $('#quextEVINo').hide();
                $('#quextENumQuestionDiv').hide();
                $exeDevice.startVideoIntro(idv, iVI, fVI);
            } else {
                $('#quextEVINo').show();
                $('#quextEVI').hide();
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            }
        });
        $('#quextEVIPlayI').on('click', function (e) {
            e.preventDefault();
            var idv = $exeDevice.getIDYoutube($('#quextEVIURL').val());
            if (idv) {
                var iVI = $exeDevice.hourToSeconds($('#quextEVIStart').val()),
                    fVI = $exeDevice.hourToSeconds($('#quextEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#quextEVIEnd').val()) : 9000;
                if (fVI <= iVI) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                    return;
                }
                $exeDevice.startVideoIntro(idv, iVI, fVI);
            } else {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube)
            }
        });
        $('#quextEVIClose').on('click', function (e) {
            e.preventDefault();
            $('#quextEVideoIntro').val($('#quextEVIURL').val());
            $('#quextEVIDiv').hide();
            $('#quextENumQuestionDiv').show();
            $exeDevice.stopVideoIntro();
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

    },
    clickImage: function (img, epx, epy) {
        var $cursor = $('#quextECursor');
        $x = $('#quextEXImage'),
            $y = $('#quextEYImage'),
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