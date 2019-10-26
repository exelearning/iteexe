/**
 * VideoQuExt Activity iDevice (edition code)
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
        name: _('VideoQuExt Activity'),
    },
    iDevicePath: "/scripts/idevices/videoquext-activity/edition/",
    msgs: {},
    active: 0,
    questionsGame: [],
    youtubeLoaded: false,
    player: '',
    timeUpdateInterval: '',
    timeVideoFocus: 0,
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
        "msgTime": _("Time question"),
        "msgLive": _("Life"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgCool": _("Cool!"),
        "msgLoseT": _("Lose 330 points"),
        "msgLoseLive": _("Lose a life"),
        "msgLostLives": _("Lost all your lives!"),
        "mgsAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Not well! | Not correct! | Sorry! | Error!"),
        "msgNotNetwork": _("You can only play this game with internet connection. Check out your conecctivity"),
        "msgEndGameScore": _("Must start game before saving your score!"),
        "msgScoreScorm": _("Only the score obtained can be saved in an SCORM export"),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Answer"),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Author"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once!"),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgTryAgain": _("Must have %s% of correct answers to get the needed information. Try again!"),
        "msgVideoIntro": _("Video Intro"),
        "msgClose": _("Close"),
        "msgOption": _("Option"),
        "msgRickText": _("Rich Text"),
        "msgUseFulInformation": _("and information that will be very useful"),
        "msgLoading": _("Loading. Wait, please"),
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
        msgs.msgEProvideDefinition = _("You must provide the definition of the word or the valid URL of an image");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEProvideWord = _("You must provide one word or phrase");
        msgs.msgEOneQuestion = _("You must provide at least one question");
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the options selected");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Type the right URL of a Youtube video");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the word processor");
        msgs.msgEPoiIncorrect = _("El punto del vídeo para mostrar la pregunta debe estar comprendido entre el inicio y fin del mismo");
        msgs.msgEPointExist = _("Ya existe una pregunta en este punto del vídeo");


    },
    loadYoutubeApi: function () {

        onYouTubeIframeAPIReady = $exeDevice.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },
    youTubeReady: function () {
        $("#vquextMediaVideo").prop("disabled", false);
        $exeDevice.player = new YT.Player('vquextEVideo', {
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
        var idV=$exeDevice.getIDYoutube($('#vquextEVIURL').val());
        if(idV){
            $('#vquextEVideo').show();
            $('#vquextENoImageVideo').hide();
            $('#vquextECover').hide();
            $('#vquextENoVideo').hide();
            $exeDevice.startVideo(idV,0,1);
        }
    },
    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#vquextEVITime').text(time);
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
            $exeDevice.active++;
            $('#vquextNumberQuestion').text($exeDevice.active + 1);
            $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
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
            $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
            $('#vquextNumberQuestion').text($exeDevice.active + 1);
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
        console.log(p);

        var numOptions = 0;
        $('.vquext-EAnwersOptions').each(function (j) {
            numOptions++;
            if (p.options[j].trim() !== '') {
                p.numOptions = numOptions;
            }
            $(this).val(p.options[j]);
        });

        $exeDevice.stopVideo();
        $exeDevice.showOptions(p.numberOptions);
        $('#vquextEQuestion').val(p.quextion);
        $('#vquextENumQuestions').text($exeDevice.questionsGame.length);
        $('#vquextECheckSoundVideo').prop('checked', p.soundVideo == 1);
        $('#vquextECheckImageVideo').prop('checked', p.imageVideo == 1);
        $('#vquextPoint').val($exeDevice.secondsToHour(p.pointVideo));
        $('.vquext-EAnwersOptions').each(function (j) {
            var option = j < p.numOptions ? p.options[j] : '';
            $(this).val(option);
        });
        $('#vquextNumberQuestion').text(i + 1);
        $("input.vquext-Number[name='vqxnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $("input.vquext-ESolution[name='vqxsolution'][value='" + p.solution + "']").prop("checked", true);


    },
    showVideoYoutube: function (vquextion) {
        var id = $exeDevice.getIDYoutube(vquextion.url);
        $('#vquextEImageVideo').hide();
        $('#vquextENoVideo').hide();
        $('#vquextEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, vquextion.iVideo, vquextion.fVideo);
            $('#vquextEVideo').show();
            if (vquextion.imageVideo == 0) {
                $('#vquextEImageVideo').show();
            }
            if (vquextion.soundVideo == 0) {
                $('#vquextEImageVideo').show();
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {

            $exeDevice.showMessage($exeDevice.msgEUnavailableVideo);
            $('#vquextENoVideo').show();
        }
    },
    showVideoQuestion: function () {
        var soundVideo = $('#vquextECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#vquextECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#vquextEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#vquextEEndVideo').val()),
            url = $('#vquextEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        if (fVideo <= iVideo) fVideo = 36000;
        $('#vquextENoImageVideo').hide();
        $('#vquextENoVideo').show();
        $('#vquextEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#vquextEVideo').show();
            $('#vquextENoVideo').hide();
            if (imageVideo == 0) {
                $('#vquextEVideo').hide();
                $('#vquextENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage(_("Este vídeo no esta actualmente disponible"));
            $('#vquextENoVideo').show();
        }
    },

    clearQuestion: function () {
        $exeDevice.showOptions(4);
        $exeDevice.showSolution(0);
        $('.vquext-Times')[0].checked = true;
        $('.vquext-Number')[2].checked = true;
        $('#vquextEInitVideo').val('00:00:00');
        $('#vquextEEndVideo').val('00:00:00');
        $('#vquextECheckSoundVideo').prop('checked', true);
        $('#vquextECheckImageVideo').prop('checked', true);
        $('#vquextEQuestion').val('');
        $('.vquext-EAnwersOptions').each(function () {
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
    showOptions: function (number) {
        $('.vquext-EOptionDiv').each(function (i) {
            $(this).show();
            if (i >= number) {
                $(this).hide();
                $exeDevice.showSolution(0);
            }

        });
        $('.vquext-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }

        });
    },
    showSolution: function (solution) {
        $('.vquext-ESolution')[solution].checked = true;

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="vquextIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Choose the right answer")) + '\
                    <fieldset class="exe-fieldset exe-fieldset-closed">\
                        <legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="vquextEShowMinimize"><input type="checkbox" id="vquextEShowMinimize">' + _("Show minimized.") + '</label>\
                            </p>\
                            <p>\
                                <label for="vquextEUseLives"><input type="checkbox" checked id="vquextEUseLives">' + _("Use lives") + '.</label>\
                                <label for="vquextENumberLives">' + _("Number of lives") + ':<input type="number" name="vquextENumberLives" id="vquextENumberLives" value="3" min="1" max="5" /></label>\
                            </p>\
                            <p>\
                                <label for="vquextEAnswersRamdon"><input type="checkbox" id="vquextEAnswersRamdon">' + _("Random options") + '</label>\
                            </p>\
                            <p>\
                                <label for="vquextEShowSolution"><input type="checkbox" checked id="vquextEShowSolution">' + _("Show solutions") + '. </label>\
                                <label for="vquextETimeShowSolution">' + _("Show solution time(seconds)") + ' <input type="number" name="vquextETimeShowSolution" id="vquextETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                        <legend><a href="#">' + _("Questions") + '</a></legend>\
                        <div class="vquext-EPanel" id="vquextEPanel">\
                            <span>' + _("Video YouTube") + ':</span>\
                            <div class="vquext-EVIOptions">\
                                <label for="vquextEVIURL"  class="sr-av">' + _("URL") + ':</label>\
                                <input id="vquextEVIURL" type="text" />\
                                <a href="#" id="vquextEVIPlayI" class="vquext-ENavigationButton vquext-EPlayVideo" title="' + _("Play video intro") + '"><img src="' + path + "quextPlay.png" + '" alt="" class="quext-EButtonImage b-playintro" /></a>\
                                <label for="vquextEVIStart">' + _("Start") + ':</label>\
                                <input id="vquextEVIStart" type="text" value="00:00:00" readonly />\
                                <label for="vquextEVIEnd">' + _("End") + ':</label>\
                                <input id="vquextEVIEnd" type="text" value="00:00:00" readonly />\
                                <button class="vquext-EVideoTime" id="vquextEVITime" type="button">00:00:00</button>\
                            </div>\
                            <div class="vquext-EOptionsMedia">\
                                <div class="vquext-EOptionsGame">\
                                     <span>' + _("Point question") + ':</span>\
                                    <div class="vquext-EPointDiv" id="vquextEPointDiv">\
                                        <label class="sr-av" for="vquextPoint">' + _("Point question question ") + '</label>\
                                        <input id="vquextPoint" type="text" value="00:00:00" readonly />\
                                        <a href="#" id="vquextEPlayVideo" class="vquext-ENavigationButton vquext-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + "quextPlay.png" + '"  alt="" class="vquext-EButtonImage b-play" /></a>\
                                    </div>\
                                    <span>' + _("Options Number") + ':</span>\
                                    <div class="vquext-EInputNumbers">\
                                        <input class="vquext-Number" id="numQ2" type="radio" name="vqxnumber" value="2" />\
                                        <label for="numQ2">2</label>\
                                        <input class="vquext-Number" id="numQ3" type="radio" name="vqxnumber" value="3" />\
                                        <label for="numQ3">3</label>\
                                        <input class="vquext-Number" id="numQ4" type="radio" name="vqxnumber" value="4" checked="checked" />\
                                        <label for="numQ4">4</label>\
                                    </div>\
                                    <span>' + _("Time question") + ':</span>\
                                    <div class="vquext-EInputTimes">\
                                        <input class="vquext-Times" checked="checked" id="q15s" type="radio" name="vqxtime" value="0" />\
                                        <label for="q15s">15s</label>\
                                        <input class="vquext-Times" id="q30s" type="radio" name="vqxtime" value="1" />\
                                        <label for="q30s">30s</label>\
                                        <input class="vquext-Times" id="q1m" type="radio" name="vqxtime" value="2" />\
                                        <label for="q1m">1m</label>\
                                        <input class="vquext-Times" id="q3m" type="radio" name="vqxtime" value="3" />\
                                        <label for="q3m">3m</label>\
                                        <input class="vquext-Times" id="q5m" type="radio" name="vqxtime" value="4" />\
                                        <label for="q5m">5m</label>\
                                        <input class="vquext-Times" id="q10m" type="radio" name="vqxtime" value="5" />\
                                        <label for="q10m">10m</label>\
                                    </div>\
                                    <div class="vquext-EInputOptionsVideo" id="vquextEInputOptionsVideo">\
                                        <div>\
                                            <label for="vquextECheckSoundVideo">' + _("Audio") + ':</label>\
                                            <input id="vquextECheckSoundVideo" type="checkbox" checked="checked" />\
                                            <label for="vquextECheckImageVideo">' + _("Image") + ':</label>\
                                            <input id="vquextECheckImageVideo" type="checkbox" checked="checked" />\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="vquext-EMultiMediaOption">\
                                    <div class="vquext-EMultimedia" id="vquextEMultimedia">\
                                        <div class="vquext-EVideo" id="vquextEVideo"></div>\
                                        <img class="vquext-ENoImageVideo" src="' + path + "quextENoImageVideo.png" + '" id="vquextENoImageVideo" alt="" />\
                                        <img class="vquext-ENoVideo" src="' + path + "quextENoVideo.png" + '" id="vquextENoVideo" alt="" />\
                                        <img class="vquext-ECover" src="' + path + "quextECover.png" + '" id="vquextECover" alt="' + _("No image") + '" />\
                                    </div>\
                                    <div class="vquext-ProgressBar" id="vquextProgressBar">\
                                        <div class="vquext-InterBar" id="vquextInterBar"></div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="vquext-EContents">\
                                   <div class="vquext-EQuestionDiv">\
                                        <label class="sr-av">' + _("Question") + ':</label><input type="text" class="vquext-EQuestion" id="vquextEQuestion">\
                                   </div>\
                                   <div class="vquext-EAnswers">\
                                    <div class="vquext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' A:</label><input type="radio" class="vquext-ESolution" name="vqxsolution" id="vquextESolution0" value="0" checked="checked" />\
                                        <label class="sr-av">' + _("Option") + ' A:</label><input type="text" class="vquext-EOption0 vquext-EAnwersOptions" id="vquextEOption0">\
                                    </div>\
                                    <div class="vquext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' B:</label><input type="radio" class="vquext-ESolution" name="vqxsolution" id="vquextESolution1" value="1" />\
                                        <label class="sr-av">' + _("Option") + ' B:</label><input type="text" class="vquext-EOption1 vquext-EAnwersOptions"  id="vquextEOption1">\
                                    </div>\
                                    <div class="vquext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' C:</label><input type="radio" class="vquext-ESolution" name="vqxsolution" id="vquextESolution2" value="2" />\
                                        <label class="sr-av">' + _("Option") + ' C:</label><input type="text" class="vquext-EOption2 vquext-EAnwersOptions"  id="vquextEOption2">\
                                    </div>\
                                    <div class="vquext-EOptionDiv">\
                                        <label class="sr-av">' + _("Solution") + ' D:</label><input type="radio"  class="vquext-ESolution" name="vqxsolution" id="vquextESolution3" value="3" />\
                                        <label class="sr-av">' + _("Option") + ' D:</label><input type="text" class="vquext-EOption3 vquext-EAnwersOptions"  id="vquextEOption3">\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="vquext-ENavigationButtons">\
                                <a href="#" id="vquextEAdd" class="vquext-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + "quextAdd.png" + '"  alt="" class="vquext-EButtonImage b-add" /></a>\
                                <a href="#" id="vquextEFirst" class="vquext-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + "quextFirst.png" + '"  alt="" class="vquext-EButtonImage b-first" /></a>\
                                <a href="#" id="vquextEPrevious" class="vquext-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + "quextPrev.png" + '"  alt="" class="vquext-EButtonImage b-prev" /></a>\
                                <span class="sr-av">' + _("Question number:") + '</span><span class="vquext-NumberQuestion" id="vquextNumberQuestion">1</span>\
                                <a href="#" id="vquextENext" class="vquext-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + "quextNext.png" + '"  alt="" class="vquext-EButtonImage b-next" /></a>\
                                <a href="#" id="vquextELast" class="vquext-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + "quext-last.png" + '"  alt="" class="vquext-EButtonImage b-last" /></a>\
                                <a href="#" id="vquextEDelete" class="vquext-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + "quextDelete.png" + '"  alt="" class="vquext-EButtonImage b-delete" /></a>\
                            </div>\
                            <div class="vquext-ENumQuestionDiv" id="vquextENumQuestionDiv">\
                               <div class="vquext-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="vquext-ENumQuestions" id="vquextENumQuestions">0</span>\
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
        $exeDevice.enableForm(field);
        $exeDevice.loadYoutubeApi();
        $exeAuthoring.iDevice.tabs.init("vquextIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();


    },

    initQuestions: function () {
        $('#vquextEInputOptionsImage').css('display', 'flex');
        $('#vquextEInputVideo').css('display', 'flex');
        $('#vquextEAuthorAlt').css('display', 'flex');
        $("#vquextMediaNormal").prop("disabled", false);
        $("#vquextMediaImage").prop("disabled", false);
        $("#vquextMediaText").prop("disabled", false);
        if ($exeDevice.questionsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.questionsGame.push(question);
            this.showOptions(4);
            this.showSolution(0);
        }
        this.active = 0;
    },
    getCuestionDefault: function () {
        var p = new Object();
        p.type = 2;
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
            var json = $('.vquext-DataGame', wrapper).text();
            var dataGame = $exeDevice.isJsonString(json);
            $exeDevice.active = 0;
            $exeDevice.questionsGame = dataGame.questionsGame;
            var instructions = $(".vquext-instructions", wrapper);
            //if (instructions.length == 1) tinyMCE.get('eXeGameInstructions').setContent(instructions.html());
            $exeDevice.updateFieldGame(dataGame);

        }
    },
    updateFieldGame: function (game) {
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.answersRamdon = game.answersRamdon || false;
        $('#vquextEShowMinimize').prop('checked', game.showMinimize);
        $('#vquextEQuestionsRamdon').prop('checked', game.optionsRamdon);
        $('#vquextEAnswersRamdon').prop('checked', game.answersRamdon);
        $('#vquextEUseLives').prop('checked', game.useLives);
        $('#vquextENumberLives').val(game.numberLives);
        $('#vquextEVideoIntro').val(game.idVideo);
        $('#vquextShowSolutions').prop('checked', game.showSolution);
        $('#vquextTimeShowSolutions').val(game.timeShowSolution)
        $('#vquextETimeShowSolution').prop('disabled', !game.showSolution);
        $('#vquextENumberLives').prop('disabled', !game.useLives);
        $('#vquextEVIURL').val(game.idVideo);
        $('#vquextEVIEnd').val($exeDevice.secondsToHour(game.endVideo));
        $('#vquextEVIStart').val($exeDevice.secondsToHour(game.startVideo));
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
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
        if (instructions != "") divContent = '<div class="vquext-instructions">' + instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.questionsGame);
        var html = '<div class="vquext-IDevice">';
        html += divContent;
        html += '<div class="vquext-DataGame">' + json + '</div>';
        html += linksImages;
        html += '</div>';
        return html;
    },
    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object(),
            idVideo = $('#vquextEVIURL').val(),
            initVideo = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
            endVideo = $exeDevice.hourToSeconds($('#vquextEVIEnd').val());
        if (!$exeDevice.getIDYoutube(idVideo)) {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            return;
        } else if (initVideo >= endVideo) {
            $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
            return;
        }
        p.type = 2
        p.pointVideo = $exeDevice.hourToSeconds($('#vquextPoint').val());
        p.time = parseInt($('input[name=vqxtime]:checked').val());
        p.numberOptions = parseInt($('input[name=vqxnumber]:checked').val());
        p.x = 0
        p.y = 0
        p.author = "";
        p.alt = "";
        p.url = ""
        p.soundVideo = $('#vquextECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#vquextECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = 0;
        p.fVideo = 0;
        p.eText = '';
        p.quextion = $('#vquextEQuestion').val().trim();
        p.options = [];
        p.solution = parseInt($('input[name=vqxsolution]:checked').val());
        var optionEmpy = false;
        $('.vquext-EAnwersOptions').each(function (i) {
            var option = $(this).val().trim();
            if (i < p.numberOptions && option.length == 0) {
                optionEmpy = true;
            }
            p.options.push(option);
        });
        var existPoint=false;
        for (var i=0;i<$exeDevice.questionsGame.length;i++ ){
            if(p.pointVideo==$exeDevice.questionsGame[i].pointVideo){
                existPoint=true;
            }
        }
        if (p.pointVideo <= initVideo || p.pointVideo >= endVideo) {
            message = msgs.msgEPoiIncorrect;
        }else if (p.quextion.length == 0) {
            message = msgs.msgECompleteQuestion;
        } else if (optionEmpy) {
            message = msgs.msgECompleteAllOptions
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
            var linkImage = '<a href="' + questionsGame[i].url + '" class="js-hidden vquext-LinkImages">' + i + '</a>';
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
        link.download = _("Game") + "VideoQuExt.json";
        document.getElementById('vquextIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('vquextIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'VideoQuExt') {
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
        var clear = $exeDevice.removeTags
        instructions = $('#eXeGameInstructions').text(),
            instructionsExe = escape(tinyMCE.get('eXeGameInstructions').getContent()),
            showMinimize = $('#vquextEShowMinimize').is(':checked'),
            optionsRamdon = $('#vquextEQuestionsRamdon').is(':checked'),
            answersRamdon = false,
            showSolution = $('#vquextEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#vquextETimeShowSolution').val())),
            useLives = $('#vquextEUseLives').is(':checked'),
            numberLives = parseInt(clear($('#vquextENumberLives').val())),
            idVideo = $('#vquextEVIURL').val(),
            endVideo = $exeDevice.hourToSeconds($('#vquextEVIEnd').val()),
            startVideo = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues();
        if (!itinerary) return false;
        if (showSolution && timeShowSolution.length == 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        } else if (!$exeDevice.getIDYoutube(idVideo)) {
            $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
            return;
        } else if (startVideo >= endVideo) {
            $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
            return;
        }
        var questionsGame = $exeDevice.questionsGame;
        for (var i = 0; i < questionsGame.length; i++) {
            mquestion = questionsGame[i]
            if (mquestion.quextion.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteQuestion);
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
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'VideoQuExt',
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
        $('#vquextEPaste').hide();
        $('#vquextEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextENumberLives').prop('disabled', !marcado);
        });
        $('#vquextShowSolutions').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextTimeShowSolutions').prop('disabled', !marcado);
        });

        $('#vquextShowCodeAccess').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextCodeAccess').prop('disabled', !marcado);
            $('#vquextMessageCodeAccess').prop('disabled', !marcado);
        });

        $('.vquext-EPanel').on('click', 'input.vquext-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#vquextEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#vquextEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#vquextEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#vquextENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#vquextELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#vquextEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });

        $('#vquextEPlayVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.showVideoQuestion();
        });

        $(' #vquextECheckSoundVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });
        $('#vquextECheckImageVideo').on('change', function () {
            $exeDevice.showVideoQuestion();
        });


        $('#vquextENumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#vquextENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#vquextETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#vquextETimeShowSolution').on('focusout', function () {
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

        $('#vquextPoint').css('color', '#2c6d2c');
        $('#vquextPoint').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = 0;
            $('#vquextPoint').css('color', '#2c6d2c');
            $('#vquextEVIStart').css('color', '#000000');
            $('#vquextEVIEnd').css('color', '#000000');
        });
        $('#vquextEVIStart').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = 1;
            $('#vquextPoint').css('color', '#000000');
            $('#vquextEVIStart').css('color', '#2c6d2c');
            $('#vquextEVIEnd').css('color', '#000000');
        });
        $('#vquextEVIEnd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVIFocus = 2;
            $('#vquextEVIEnd').css('color', '#2c6d2c');
            $('#vquextEVIStart').css('color', '#000000');
            $('#vquextPoint').css('color', '#000000');
        });
        $('#vquextEVITime').on('click', function (e) {
            e.preventDefault();
            if ($exeDevice.timeVIFocus == 0) {
                $('#vquextPoint').val($('#vquextEVITime').text());
            } else if ($exeDevice.timeVIFocus == 1) {
                $('#vquextEVIStart').val($('#vquextEVITime').text());
            } else if ($exeDevice.timeVIFocus == 2) {
                $('#vquextEVIEnd').val($('#vquextEVITime').text());
            }
        });
        $('#vquextUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextNumberLives').prop('disabled', !marcado);
        });
        $('#vquextShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#vquextTimeShowSolution').prop('disabled', !marcado);
        });
        $('#vquextEVIPlayI').on('click', function (e) {
            e.preventDefault();
            var idv = $exeDevice.getIDYoutube($('#vquextEVIURL').val());
            if (idv) {
                var iVI = $exeDevice.hourToSeconds($('#vquextEVIStart').val()),
                    fVI = $exeDevice.hourToSeconds($('#vquextEVIEnd').val()) > 0 ? $exeDevice.hourToSeconds($('#vquextEVIEnd').val()) : 9000;
                if (fVI <= iVI) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEStartEndIncorrect);
                    return;
                }
                $('#vquextEVideo').show();
                $('#vquextENoImageVideo').hide();
                $('#vquextECover').hide();
                $('#vquextENoVideo').hide();
                $exeDevice.startVideo(idv, iVI, fVI);
            } else {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube)
            }
        });
        $('#vquextEVIClose').on('click', function (e) {
            e.preventDefault();
            $('#vquextEVideoIntro').val($('#vquextEVIURL').val());
            $('#vquextEVIDiv').hide();
            $('#vquextENumQuestionDiv').show();
            $exeDevice.stopVideo();
        });
        $('#vquextEVIURL').on('change', function (e) {
            e.preventDefault();
            var id=$exeDevice.getIDYoutube($(this).val());
            if(id){
                $('#vquextEVideo').show();
                $('#vquextENoImageVideo').hide();
                $('#vquextECover').hide();
                $('#vquextENoVideo').hide();
                $exeDevice.startVideo(id,0,1);
            }
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

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
    }
}