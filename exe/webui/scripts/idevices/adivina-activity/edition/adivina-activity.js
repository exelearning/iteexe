/**
/**
 * Adivina Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Author: Ricardo Malaga Floriano
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Word Guessing')
    },
    msgs: {},
    active: 0,
    wordsGame: [],
    youtubeLoaded: false,
    player: '',
    timeUpdateInterval: '',
    timeUpdateVIInterval: '',
    timeVideoFocus: 0,
    timeVIFocus: true,
    timeQuestion: 30,
    percentajeShow: 35,
    typeEdit: -1,
    numberCutCuestion: -1,
    clipBoard: '',
    activeSilent: false,
    silentVideo: 0,
    tSilentVideo: 0,
    endSilent: 0,
    version: 2,
    iDevicePath: "/scripts/idevices/adivina-activity/edition/",
    playerAudio: "",
    isVideoType:false,
    ci18n: {
        "msgHappen": _("Move on"),
        "msgReply": _("Reply"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("Game Over!"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgClue": _("Cool! The clue is:"),
        "msgYouHas": _("You have got %1 hits and %2 misses"),
        "msgCodeAccess": _("Access code"),
        "msgPlayAgain": _("Play Again"),
        "msgRequiredAccessKey": _("Access code required"),
        "msgInformationLooking": _("Cool! The information you were looking for"),
        "msgPlayStart": _("Click here to play"),
        "msgErrors": _("Errors"),
        "msgMoveOne": _("Move on"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgTime": _("Time Limit (mm:ss)"),
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
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgWrote": _("Write the correct word and click on Reply. If you hesitate, click on Move on."),
        "msgNotNetwork": _("You can only play this game with internet connection."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgQuestion": _("Question"),
        "msgAnswer": _("Answer"),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Authorship"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgClose": _("Close"),
        "msgLoading": _("Loading. Please wait..."),
        "msgPoints": _("points"),
        "msgAudio": _("Audio"),
		"msgCorrect": _("Correct"),
		"msgIncorrect": _("Incorrect")
    },
    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%"); // Avoid invalid HTML
        this.setMessagesInfo();
        this.createForm();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("Please provide the word definition");
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
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser =_("Your browser is not compatible with this tool.");
    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
			<div id="gameQEIdeviceForm">\
                <div class="exe-idevice-info">'+_("Create activities in which given a definition the student has to complete the word filling in the gaps.")+' <a href="https://youtu.be/aKdBRClanYk" hreflang="es" rel="lightbox" target="_blank">'+_("Use Instructions")+'</a></div>\				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Observe the letters, identify and fill in the missing words.")) + '\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
							<p>\
								<label for="adivinaEShowMinimize"><input type="checkbox" id="adivinaEShowMinimize"> ' + _("Show minimized.") + ' </label>\
                            </p>\
                            <p>\
                                <label for="adivinaEOptionsRamdon"><input type="checkbox" id="adivinaEOptionsRamdon"> ' + _("Random questions") + ' </label>\
                            </p>\
                            <p>\
                                <label for="adivinaECustomMessages"><input type="checkbox" id="adivinaECustomMessages">' + _("Custom messages") + '. </label>\
                            </p>\
                            <p>\
								<label for="adivinaEShowSolution"><input type="checkbox" checked id="adivinaEShowSolution"> ' + _("Show solutions") + '. </label> \
								<label for="adivinaETimeShowSolution">' + _("Show solution time (seconds)") + ':\
								<input type="number" name="adivinaETimeShowSolution" id="adivinaETimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <label for="adivinaECaseSensitive"><input type="checkbox" id="adivinaECaseSensitive"> ' + _("Case sensitive") + ' </label>\
                            </p>\
                            <p>\
                                <strong class="GameModeLabel"><a href="#adivinaEGameModeHelp" id="adivinaEGameModeHelpLnk" class="GameModeHelpLink" title="'+_("Help")+'"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="'+_("Help")+'"/></a> ' + _("Score") + ':</strong>\
                                <input class="gameQE-TypeGame" checked="checked" id="adivinaETypeActivity" type="radio" name="qxtgamemode" value="1" />\
                                <label for="adivinaETypeActivity">' + _("0 to 10") + '</label>\
                                <input class="gameQE-TypeGame" id="adivinaEGameMode" type="radio" name="qxtgamemode" value="0" />\
                                <label for="adivinaEGameMode">' + _("Points and lives") + '</label>\
                                <input class="gameQE-TypeGame"  id="adivinaETypeReto" type="radio" name="qxtgamemode" value="2" />\
                                <label for="adivinaETypeReto">' + _("No score") + '</label>\
                            </p>\
                            <div id="adivinaEGameModeHelp" class="gameQE-TypeGameHelp">\
                                <ul>\
                                    <li><strong>'+_("0 to 10")+': </strong>'+_("No lives, 0 to 10 score, right/wrong answers counter... A more educational context.")+'</li>\
                                    <li><strong>'+_("Points and lives")+': </strong>'+_("Just like a game: Try to get a high score (thousands of points) and not to loose your lives.")+'</li>\
                                    <li><strong>'+_("No score")+': </strong>'+_("No score and no lives. You have to answer right to get some information (a feedback).")+'</li>\
                                </ul>\
                            </div>\
                            <p>\
                                <label for="adivinaEUseLives"><input type="checkbox" checked id="adivinaEUseLives"> ' + _("Use lives") + '. </label> \
                                <label for="adivinaENumberLives">' + _("Number of lives") + ':\
                                <input type="number" name="adivinaENumberLives" id="adivinaENumberLives" value="3" min="1" max="5" /> </label>\
                            </p>\
                            <p>\
                                <label for="adivinaEHasFeedBack"><input type="checkbox"  id="adivinaEHasFeedBack"> ' + _("Feedback") + '. </label> \
                                <label for="adivinaEPercentajeFB"><input type="number" name="adivinaEPercentajeFB" id="adivinaEPercentajeFB" value="100" min="5" max="100" step="5" disabled /> '+_("&percnt; right to see the feedback")+' </label>\
                            </p>\
                            <p id="adivinaEFeedbackP" class="gameQE-EFeedbackP">\
                                <textarea id="adivinaEFeedBackEditor" class="exe-html-editor"\></textarea>\
                            </p>\
                            <p>\
                                <label for="adivinaEPercentajeQuestions">% ' + _("Questions") + ':  <input type="number" name="adivinaEPercentajeQuestions" id="adivinaEPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                                <span id="adivinaENumeroPercentaje">1/1</span>\
                            </p>\
                            <p>\
                                <label for="adivinaModeBoard"><input type="checkbox" id="adivinaModeBoard"> ' + _("Digital blackboard mode") + ' </label>\
                            </p>\
                         </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
                    <legend><a href="#">' + _("Words/Phrases") + '</a></legend>\
                    <div class="gameQE-EPanel" id="adivinaEPanel">\
                        <div class="gameQE-EOptionsMedia">\
                            <div class="gameQE-EOptionsGame">\
                                <p>\
									<span>' + _("Multimedia Type") + ':</span>\
									<span class="gameQE-EInputMedias">\
										<input class="gameQE-Type" checked="checked" id="adivinaEMediaNormal" type="radio" name="qxtmediatype" value="0" disabled />\
										<label for="adivinaEMediaNormal">' + _("None") + '</label>\
										<input class="gameQE-Type"  id="adivinaEMediaImage" type="radio" name="qxtmediatype" value="1" disabled />\
										<label for="adivinaEMediaImage">' + _("Image") + '</label>\
										<input class="gameQE-Type"  id="adivinaEMediaVideo" type="radio" name="qxtmediatype" value="2" disabled />\
										<label for="adivinaEMediaVideo">' + _("Video") + '</label>\
										<input class="gameQE-Type"  id="adivinaEMediaText" type="radio" name="qxtmediatype" value="3" disabled />\
										<label for="adivinaEMediaText">' + _("Text") + '</label>\
									</span>\
								</p>\
                                <p>\
									<span>' + _("Time per question") + ':</span>\
									<span class="gameQE-EInputTimes">\
										<input class="gameQE-Times" checked="checked" id="q15s" type="radio" name="qxttime" value="0" />\
										<label for="q15s">15s</label>\
										<input class="gameQE-Times" id="q30s" type="radio" name="qxttime" value="1" />\
										<label for="q30s">30s</label>\
										<input class="gameQE-Times" id="q1m" type="radio" name="qxttime" value="2" />\
										<label for="q1m">1m</label>\
										<input class="gameQE-Times" id="q3m" type="radio" name="qxttime" value="3" />\
										<label for="q3m">3m</label>\
										<input class="gameQE-Times" id="q5m" type="radio" name="qxttime" value="4" />\
										<label for="q5m">5m</label>\
										<input class="gameQE-Times" id="q10m" type="radio" name="qxttime" value="5" />\
										<label for="q10m">10m</label>\
									</span>\
								</p>\
                                <p class="gameQE-EPercentage" id="adivinaEPercentage">\
                                    <label for="adivinaEPercentageShow">' + _("Percentage of letters to show (%)") + ':</label> <input type="number" name="adivinaEPercentageShow" id="adivinaEPercentageShow" value="35" min="0" max="100" step="5" /> </label>\
                                </p>\
                                <span class="gameQE-ETitleImage" id="adivinaETitleImage">' + _("Image URL") + '</span>\
                                <div class="gameQE-EInputImage" id="adivinaEInputImage">\
                                    <label class="sr-av" for="adivinaEURLImage">' + _("Image URL") + '</label>\
                                    <input type="text" class="exe-file-picker gameQE-EURLImage"  id="adivinaEURLImage"/>\
                                    <a href="#" id="adivinaEPlayImage" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Show") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Show") + '" class="gameQE-EButtonImage b-play" /></a>\
                                </div>\
                                <div class="gameQE-EInputOptionsImage" id="adivinaEInputOptionsImage"></div>\
                                <div class="gameQE-ECoord">\
                                        <label for="adivinaEXImage">X:</label>\
                                        <input id="adivinaEXImage" type="text" value="0" />\
                                        <label for="adivinaEXImage">Y:</label>\
                                        <input id="adivinaEYImage" type="text" value="0" />\
                                </div>\
                                <span class="gameQE-ETitleVideo" id="adivinaETitleVideo">' + _("Youtube URL") + '</span>\
                                <div class="gameQE-Flex gameQE-EInputVideo" id="adivinaEInputVideo">\
                                    <label class="sr-av" for="adivinaEURLYoutube">' + _("Youtube URL") + '</label>\
                                    <input id="adivinaEURLYoutube" type="text" />\
                                    <a href="#" id="adivinaEPlayVideo" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play video") + '"><img src="' + path + 'quextIEPlay.png"  alt="' + _("Play video") + '" class="gameQE-EButtonImage b-play" /></a>\
                                </div>\
                                <div class="gameQE-EInputOptionsVideo" id="adivinaEInputOptionsVideo">\
                                        <div>\
                                            <label for="adivinaEInitVideo">' + _("Start") + ':</label><input id="adivinaEInitVideo" type="text" value="00:00:00" maxlength="8" /><label for="adivinaEEndVideo">' + _("End") + ':</label><input id="adivinaEEndVideo" type="text" value="00:00:00" maxlength="8" /><button class="gameQE-EMediaTime" id="adivinaEVideoTime" type="button">00:00:00</button>\
                                       </div>\
                                        <div>\
                                            <label for="adivinaESilenceVideo">' + _("Silence") + ':</label><input id="adivinaESilenceVideo" type="text" value="00:00:00" maxlength="8" /><label for="adivinaETimeSilence">' + _("Time (s)") + ':</label><input type="number" name="adivinaETimeSilence" id="adivinaETimeSilence" value="0" min="0" max="120" />\
                                        </div>\
                                    <div>\
                                        <label for="adivinaECheckSoundVideo">' + _("Audio") + ':</label><input id="adivinaECheckSoundVideo" type="checkbox" checked="checked" /><label for="adivinaECheckImageVideo">' + _("Image") + ':</label><input id="adivinaECheckImageVideo" type="checkbox" checked="checked" />\
                                    </div>\
                                </div>\
                                <div class="gameQE-EAuthorAlt" id="adivinaEAuthorAlt">\
                                    <div class="gameQE-EInputAuthor" id="adivinaEInputAuthor">\
                                        <label for="adivinaEAuthor">' + _("Authorship") + '</label><input id="adivinaEAuthor" type="text" />\
                                    </div>\
                                    <div class="gameQE-EInputAlt" id="adivinaEInputAlt">\
                                        <label for="adivinaEAlt">' + _("Alternative text") + '</label><input id="adivinaEAlt" type="text" />\
                                    </div>\
                                </div>\
                                <span id="adivinaETitleAudio">' + _("Audio") + '</span>\
                                <div class="gameQE-EInputAudio" id="adivinaEInputAudio">\
                                    <label class="sr-av" for="adivinaEURLAudio">' + _("URL") + '</label>\
                                    <input type="text" class="exe-file-picker gameQE-EURLAudio"  id="adivinaEURLAudio"/>\
                                    <a href="#" id="adivinaEPlayAudio" class="gameQE-ENavigationButton gameQE-EPlayVideo" title="' + _("Play audio") + '"><img src="' + path + 'quextIEPlay.png" alt="' + _("Play audio") + '" class="gameQE-EButtonImage b-play" /></a>\
                                </div>\
                            </div>\
                            <div class="gameQE-EMultiMediaOption">\
                                <div class="gameQE-EMultimedia" id="adivinaEMultimedia">\
                                    <textarea id="adivinaEText"></textarea>\
                                    <img class="gameQE-EMedia" src="' + path + 'quextIEImage.png" id="adivinaEImage" alt="' + _("Image") + '" />\
                                    <img class="gameQE-EMedia" src="' + path + 'quextIEImage.png" id="adivinaENoImage" alt="' + _("No image") + '" />\
                                    <div class="gameQE-EMedia" id="adivinaEVideo"></div>\
                                    <img class="gameQE-EMedia" src="' + path + 'quextIENoImageVideo.png"  id="adivinaENoImageVideo" alt="" />\
                                    <img class="gameQE-EMedia" src="' + path + 'quextIENoVideo.png" id="adivinaENoVideo" alt="" />\
                                    <img class="gameQE-ECursor" src="' + path + 'quextIECursor.gif" id="adivinaECursor" alt="" />\
                                    <img class="gameQE-EMedia" src="' + path + 'quextIECoverAdivina.png" id="adivinaECover" alt="' + _("No image") + '" />\
                                </div>\
                            </div>\
                        </div>\
                        <div class="gameQE-EContents">\
                            <div class="gameQE-EWordDiv" id="selecionaEWordDiv">\
                                <div class="gameQE-ESolutionWord"><label for="adivinaESolutionWord">' + _("Word/Phrase") + ': </label><input type="text"  id="adivinaESolutionWord"/></div>\
                                <div class="gameQE-ESolutionWord"><label for="adivinaEDefinitionWord">' + _("Definition") + ': </label><input type="text"  id="adivinaEDefinitionWord"/></div>\
                            </div>\
                            <div class="gameQE-EOrders" id="adivinaEOrder">\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Hit") + '</span><span class="gameQE-EHit"></span>\
                                    <label for="adivinaEMessageOK">' + _("Message") + ':</label>\
                                        <input type="text" class=""  id="adivinaEMessageOK">\
                                </div>\
                                <div class="gameQE-ECustomMessage">\
                                    <span class="sr-av">' + _("Error") + '</span><span class="gameQE-EError"></span>\
                                    <label for="adivinaEMessageKO">' + _("Message") + ':</label>\
                                    <input type="text" class=""  id="adivinaEMessageKO">\
                                </div>\
                           </div>\
                            <div class="gameQE-ENavigationButtons">\
                                <a href="#" id="adivinaEAdd" class="gameQE-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png"  alt="' + _("Add question") + '" class="gameQE-EButtonImage b-add" /></a>\
                                <a href="#" id="adivinaEFirst" class="gameQE-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _("First question") + '" class="gameQE-EButtonImage b-first" /></a>\
                                <a href="#" id="adivinaEPrevious" class="gameQE-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="gameQE-EButtonImage b-prev" /></a>\
                                <label class="sr-av" for="adivinaENumberQuestion">' + _("Question number:") + ':</label><input type="text" class="gameQE-NumberQuestion"  id="adivinaENumberQuestion" value="1"/>\
                                <a href="#" id="adivinaENext" class="gameQE-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="gameQE-EButtonImage b-next" /></a>\
                                <a href="#" id="adivinaELast" class="gameQE-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="gameQE-EButtonImage b-last" /></a>\
                                <a href="#" id="adivinaEDelete" class="gameQE-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="gameQE-EButtonImage b-delete" /></a>\
                                <a href="#" id="adivinaECopy" class="gameQE-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png" + alt="' + _("Copy question") + '" class="gameQE-EButtonImage b-copy" /></a>\
                                <a href="#" id="adivinaECut" class="gameQE-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" + alt="' + _("Cut question") + '"  class="gameQE-EButtonImage b-cut" /></a>\
                                <a href="#" id="adivinaEPaste" class="gameQE-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png" alt="' + _("Paste question") + '" class="gameQE-EButtonImage b-paste" /></a>\
                            </div>\
                        </div>\
                        <div class="gameQE-ENumQuestionDiv" id="adivinaENumQuestionDiv">\
                            <div class="gameQE-ENumQ"><span class="sr-av">' + _("Number of questions:") + '</span></div>\ <span class="gameQE-ENumQuestions" id="adivinaENumQuestions">0</span>\
                        </div>\
                    </fieldset>\
                    ' + $exeAuthoring.iDevice.common.getTextFieldset("after") + '\
                </div>\
				' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
		    </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
       // $exeDevice.loadYoutubeApi();
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        tinymce.init({
            selector: '#adivinaEText',
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
    },
    enableForm: function (field) {
        $exeDevice.initQuestions();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
    },
    updateQuestionsNumber: function(){
        var percentaje=parseInt($exeDevice.removeTags($('#adivinaEPercentajeQuestions').val()));
        if(isNaN(percentaje)){
            return;
        }
        percentaje=percentaje<1?1:percentaje;
        percentaje=percentaje>100?100:percentaje;
        var num=Math.round((percentaje*$exeDevice.wordsGame.length)/100);
        num=num==0?1:num;
        $('#adivinaENumeroPercentaje').text( num+"/"+$exeDevice.wordsGame.length)
    },
    showQuestion: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.wordsGame.length ? $exeDevice.wordsGame.length - 1 : num;
        var p = $exeDevice.wordsGame[num];
        $exeDevice.stopVideo();
        $exeDevice.changeTypeQuestion(p.type);
        $('#adivinaEDefinitionWord').val(p.definition);
        $('#adivinaENumQuestions').text($exeDevice.wordsGame.length);
        $('#adivinaESolutionWord').val(p.word);
        $('#adivinaEPercentageShow').val(p.percentageShow);
        if (p.type == 1) {
            $('#adivinaEURLImage').val(p.url);
            $('#adivinaEXImage').val(p.x);
            $('#adivinaEYImage').val(p.y);
            $('#adivinaEAuthor').val(p.author);
            $('#adivinaEAlt').val(p.alt);
            $exeDevice.showImage(p.url, p.x, p.y, p.alt);
        } else if (p.type == 2) {
            $('#adivinaECheckSoundVideo').prop('checked', p.soundVideo == 1);
            $('#adivinaECheckImageVideo').prop('checked', p.imageVideo == 1);
            $('#adivinaEURLYoutube').val(p.url);
            $('#adivinaEInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#adivinaEEndVideo').val($exeDevice.secondsToHour(p.fVideo));
            $('#adivinaESilenceVideo').val($exeDevice.secondsToHour(p.silentVideo));
            $('#adivinaETimeSilence').val(p.tSilentVideo);
            $exeDevice.silentVideo = p.silentVideo;
            $exeDevice.tSilentVideo = p.tSilentVideo;
            $exeDevice.activeSilent = (p.soundVideo == 1) && (p.tSilentVideo > 0) && (p.silentVideo >= p.iVideo) && (p.iVideo < p.fVideo);
            $exeDevice.endSilent = p.silentVideo + p.tSilentVideo;
            if( typeof YT =="undefined"){
                $exeDevice.isVideoType=true;
                $exeDevice.loadYoutubeApi();
            }else{
                $exeDevice.showVideoQuestion();
            }
            
        } else if (p.type == 3) {
            tinyMCE.get('adivinaEText').setContent(unescape(p.eText));
        }
        $exeDevice.stopSound();
        if (p.type != 2 && p.audio.trim().length > 4) {
            $exeDevice.playSound(p.audio.trim());
        }
        $('#adivinaEURLAudio').val(p.audio);
        $('#adivinaENumberQuestion').val(i + 1);
        $("input.gameQE-Type[name='qxtmediatype'][value='" + p.type + "']").prop("checked", true);
        $("input.gameQE-Times[name='qxttime'][value='" + p.time + "']").prop("checked", true);
        $('#adivinaEMessageKO').val(p.msgError);
        $('#adivinaEMessageOK').val(p.msgHit);
    },

    initQuestions: function () {
        $('#adivinaEInputVideo').css('display', 'flex');
        $('#adivinaEInputImage').css('display', 'flex');
        $("#adivinaEMediaNormal").prop("disabled", false);
        $("#adivinaEMediaImage").prop("disabled", false);
        $("#adivinaEMediaText").prop("disabled", false);
        $("#adivinaEMediaVideo").prop("disabled", false);
        if ($exeDevice.wordsGame.length == 0) {
            var question = $exeDevice.getCuestionDefault();
            $exeDevice.wordsGame.push(question);
            this.changeTypeQuestion(0)
        }
        this.active = 0;
    },

    changeTypeQuestion: function (type) {
        $('#adivinaETitleAltImage').hide();
        $('#adivinaEAuthorAlt').hide();
        $('#adivinaETitleImage').hide();
        $('#adivinaEInputImage').hide();
        $('#adivinaETitleAudio').show();
        $('#adivinaEInputAudio').show();
        $('#adivinaETitleVideo').hide();
        $('#adivinaEInputVideo').hide();
        $('#adivinaEInputOptionsVideo').hide();
        $('#adivinaEInputOptionsImage').hide();
        if (tinyMCE.get('adivinaEText')) {
            tinyMCE.get('adivinaEText').hide();
        }
        $('#adivinaEText').hide();
        $('#adivinaEVideo').hide();
        $('#adivinaEImage').hide();
        $('#adivinaENoImage').hide();
        $('#adivinaECover').hide();
        $('#adivinaECursor').hide();
        $('#adivinaENoImageVideo').hide();
        $('#adivinaENoVideo').hide();

        switch (type) {
            case 0:
                $('#adivinaECover').show();
                break;
            case 1:
                $('#adivinaENoImage').show();
                $('#adivinaETitleImage').show();
                $('#adivinaEInputImage').show();
                $('#adivinaEAuthorAlt').show();
                $('#adivinaECursor').show();
                $('#adivinaEInputOptionsImage').show();
                $exeDevice.showImage($('#adivinaEURLImage').val(), $('#adivinaEXImage').val(), $('#adivinaEYImage').val(), $('#adivinaEAlt').val())

                break;
            case 2:
                $('#adivinaEImageVideo').show();
                $('#adivinaETitleVideo').show();
                $('#adivinaEInputVideo').show();
                $('#adivinaENoVideo').show();
                $('#adivinaEVideo').show();
                $('#adivinaEInputOptionsVideo').show();
                $('#adivinaEInputAudio').hide();
                $('#adivinaETitleAudio').hide();
                break;
            case 3:
                $('#adivinaEText').show();
                if (tinyMCE.get('adivinaEText')) {
                    tinyMCE.get('adivinaEText').show();
                }
                break;
            default:
                break;
        }
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
        $exeDevice.player = new YT.Player('adivinaEVideo', {
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
        if ($exeDevice.isVideoType){
            $exeDevice.showVideoQuestion();
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
    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#adivinaEVideoTime').text(time);
                $exeDevice.updateSoundVideo();
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },
    updateTimerVIDisplay: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.playerIntro.getCurrentTime());
                $('adivinaEVITime').text(time);
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },
    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video adivinaEdo no está disponible")
    },
    startVideo: function (id, start, end) {
        var mstart = start < 1 ? 0.1 : start;
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

    getCuestionDefault: function () {
        var p = new Object();
        p.word = '';
        p.definition = '';
        p.type = 0;
        p.url = '';
        p.audio = "";
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        p.soundVideo = 1;
        p.imageVideo = 1;
        p.iVideo = 0;
        p.fVideo = 0;
        p.eText = '';
        p.solution = '';
        p.silentVideo = 0;
        p.tSilentVideo = 0;
        p.msgHit = '';
        p.msgError = '';

        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.adivina-DataGame', wrapper).text(),
                version = $('.adivina-version', wrapper).text();

            if (version.length == 1) {
                json = $exeDevice.Decrypt(json);
            }
            var dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.adivina-LinkImages', wrapper),
                $audiosLink = $('.adivina-LinkAudios', wrapper);
            dataGame.modeBoard=typeof dataGame.modeBoard =="undefined"?false:dataGame.modeBoard;
            version = version == '' ? 0 : parseInt(version);
            var hasYoutube=false;
            for (var i = 0; i < dataGame.wordsGame.length; i++) {
                var p = dataGame.wordsGame[i];
                if (version < 2) {
                    p.type = p.type == 2 ? 1 : p.type;
                    p.percentageShow = typeof dataGame.percentageShow == 'undefined' ? 35 : dataGame.percentageShow;
                    p.time = typeof dataGame.timeQuestion == 'undefined' ? 1 : $exeDevice.getIndexTime(dataGame.timeQuestion);
                    p.soundVideo = 1;
                    p.imageVideo = 1;
                    p.iVideo = 0;
                    p.fVideo = 0;
                    p.silentVideo = 0;
                    p.fVideo = 0;
                    p.eText = '';
                    p.audio = '';
                }
                if(i>0 && p.type==2){
                    hasYoutube=true;
                }
                dataGame.wordsGame[i] = p;
                
            }

            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                    dataGame.wordsGame[iq].url = $(this).attr('href');
                    if (dataGame.wordsGame[iq].url.length < 4 && dataGame.wordsGame[iq].type == 1) {
                        dataGame.wordsGame[iq].url = "";
                    }
                }
            });

            $audiosLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.wordsGame.length) {
                    dataGame.wordsGame[iq].audio = $(this).attr('href');
                    if (dataGame.wordsGame[iq].audio.length < 4) {
                        dataGame.wordsGame[iq].audio = "";
                    }
                }
            });
            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".adivina-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textFeedBack = $(".adivina-feedback-game", wrapper);
            if (textFeedBack.length == 1) {
                textFeedBack = textFeedBack.html() || ''
                if (tinyMCE.get('adivinaEFeedBackEditor')) {
                    tinyMCE.get('adivinaEFeedBackEditor').setContent(textFeedBack);
                } else {
                    $("#adivinaEFeedBackEditor").val(textFeedBack)
                }
            }

            var textAfter = $(".adivina-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            if(hasYoutube){
                $exeDevice.loadYoutubeApi();
            }
            $exeDevice.showQuestion(0);
           
        }
    },
    getIndexTime: function(tm) {
        var tms = [15, 30, 60, 180, 300, 600, 900],
            itm = tms.indexOf(tm);
        itm = itm < 0 ? 1 : itm;
        return itm;
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
    save: function () {
        if (!$exeDevice.validateQuestion()) {
            return;
        }
        var dataGame = $exeDevice.validateData();

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
        json = $exeDevice.Encrypt(json);
        var textFeedBack = tinyMCE.get('adivinaEFeedBackEditor').getContent();
        if (dataGame.instructions != "") divContent = '<div class="adivina-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.wordsGame),
            linksAudios = $exeDevice.createlinksAudio(dataGame.wordsGame);
        var html = '<div class="adivina-IDevice">';
        html += '<div class="adivina-version js-hidden">' + $exeDevice.version + '</div>';
        html += '<div class="adivina-feedback-game">' + textFeedBack + '</div>';
        html += divContent;
        html += '<div class="adivina-DataGame js-hidden">' + json + '</div>';
        html += linksImages;
        html += linksAudios;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="adivina-extra-content">' + textAfter + '</div>';        }
        html += '<div class="adivina-bns js-hidden">' +$exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },

    createlinksImage: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var linkImage = '';
            if (wordsGame[i].type == 1 && !wordsGame[i].url.indexOf('http') == 0) {
                linkImage = '<a href="' + wordsGame[i].url + '" class="js-hidden adivina-LinkImages">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },

    createlinksAudio: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var linkImage = '';
            if (wordsGame[i].type != 2 && !wordsGame[i].audio.indexOf('http') == 0 && wordsGame[i].audio.length > 4) {
                linkImage = '<a href="' + wordsGame[i].audio + '" class="js-hidden adivina-LinkAudios">' + i + '</a>';
            }
            html += linkImage;
        }
        return html;
    },

    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.word = $('#adivinaESolutionWord').val().trim();
        p.definition = $('#adivinaEDefinitionWord').val();
        p.type = parseInt($('input[name=qxtmediatype]:checked').val());
        p.time = parseInt($('input[name=qxttime]:checked').val());
        p.x = parseFloat($('#adivinaEXImage').val());
        p.y = parseFloat($('#adivinaEYImage').val());;
        p.author = $('#adivinaEAuthor').val();
        p.alt = $('#adivinaEAlt').val();
        p.url = $('#adivinaEURLImage').val().trim();
        p.audio = $('#adivinaEURLAudio').val();
        p.msgHit = $('#adivinaEMessageOK').val();
        p.msgError = $('#adivinaEMessageKO').val();
        $exeDevice.stopSound();
        $exeDevice.stopVideo();
        if (p.type == 2) {
            p.url = $exeDevice.getIDYoutube($('#adivinaEURLYoutube').val().trim()) ? $('#adivinaEURLYoutube').val() : '';
        }
        p.soundVideo = $('#adivinaECheckSoundVideo').is(':checked') ? 1 : 0;
        p.imageVideo = $('#adivinaECheckImageVideo').is(':checked') ? 1 : 0;
        p.iVideo = $exeDevice.hourToSeconds($('#adivinaEInitVideo').val().trim());
        p.fVideo = $exeDevice.hourToSeconds($('#adivinaEEndVideo').val().trim());
        p.silentVideo = $exeDevice.hourToSeconds($('#adivinaESilenceVideo').val().trim());
        p.tSilentVideo = parseInt($('#adivinaETimeSilence').val());
        p.eText = tinyMCE.get('adivinaEText').getContent();
        p.percentageShow = parseInt($('#adivinaEPercentageShow').val());
        if (p.word.length == 0) {
            message = $exeDevice.msgs.msgEProvideWord;
        } else if (p.definition.length == 0 && p.type != 1) {
            message = $exeDevice.msgs.msgEProvideDefinition;
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
        } else if (p.type == 2 && !$exeDevice.validTime($('#adivinaEInitVideo').val()) || !$exeDevice.validTime($('#adivinaEEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        } else if (p.type == 2 && p.tSilentVideo > 0 && !$exeDevice.validTime($('#adivinaESilenceVideo').val())) {
            message = msgs.msgTimeFormat;
        } else if (p.type == 2 && p.tSilentVideo > 0 && (p.silentVideo < p.iVideo || p.silentVideo >= p.fVideo)) {
            message = msgs.msgSilentPoint;
        }
        if (message.length == 0) {
            $exeDevice.wordsGame[$exeDevice.active] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }

        return message;
    },
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textFeedBack = tinyMCE.get('adivinaEFeedBackEditor').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#adivinaEShowMinimize').is(':checked'),
            optionsRamdon = $('#adivinaEOptionsRamdon').is(':checked'),
            showSolution = $('#adivinaEShowSolution').is(':checked'),
            modeBoard = $('#adivinaModeBoard').is(':checked'),
            timeShowSolution = parseInt(clear($('#adivinaETimeShowSolution').val())),
            useLives = $('#adivinaEUseLives').is(':checked'),
            numberLives = parseInt(clear($('#adivinaENumberLives').val())),
            timeQuestion = $exeDevice.timeQuestion,
            percentageShow = 30,
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            caseSensitive = $('#adivinaECaseSensitive').is(':checked'),
            feedBack = $('#adivinaEHasFeedBack').is(':checked'),
            percentajeFB = parseInt(clear($('#adivinaEPercentajeFB').val())),
            gameMode = parseInt($('input[name=qxtgamemode]:checked').val()),
            customMessages = $('#adivinaECustomMessages').is(':checked'),
            percentajeQuestions=parseInt(clear($('#adivinaEPercentajeQuestions').val()));

        if (showSolution && timeShowSolution.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        if ((gameMode == 2 || feedBack) && textFeedBack.trim().length == 0) {
            eXe.app.alert($exeDevice.msgs.msgProvideFB);
            return false;
        }
        var wordsGame = $exeDevice.wordsGame;
        if (wordsGame.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEOneQuestion);
            return false;
        }
        for (var i = 0; i < wordsGame.length; i++) {
            var mquestion = wordsGame[i];
            if (mquestion.word.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgEProvideWord);
                return false;
            } else if ((mquestion.definition.length == 0) && (mquestion.url.length < 4)) {
                eXe.app.alert($exeDevice.msgs.msgEProvideDefinition + ' ' + mquestion.word);
                return false;
            } else if ((mquestion.type == 1) && (mquestion.url.length < 4)) {
                $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                return false;
            } else if ((mquestion.type == 2) && !($exeDevice.getIDYoutube(mquestion.url))) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return false;
            }
        }
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'Adivina',
            'instructions': instructions,
            'showMinimize': showMinimize,
            'optionsRamdon': optionsRamdon,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
            'useLives': useLives,
            'numberLives': numberLives,
            'timeQuestion': timeQuestion,
            'percentageShow': percentageShow,
            'itinerary': itinerary,
            'wordsGame': wordsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textFeedBack': escape(textFeedBack),
            'textAfter': escape(textAfter),
            'caseSensitive': caseSensitive,
            'gameMode': gameMode,
            'feedBack': feedBack,
            'percentajeFB': percentajeFB,
            'version': 2,
            'customMessages': customMessages,
            'percentajeQuestions':percentajeQuestions,
            'modeBoard':modeBoard
        }
        return data;
    },
    showImage: function (url, x, y, alt, type) {
        var $image = $('#adivinaEImage'),
            $cursor = $('#adivinaECursor');
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $('#adivinaENoImage').show();
        url=$exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $('#adivinaENoImage').hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
                    return true;
                }
            }).on('error', function () {
                return false;
            });
    },

    playSound: function (selectedFile) {
        var selectFile=$exeDevice.extractURLGD(selectedFile);
        $exeDevice.playerAudio = new Audio(selectFile);
        $exeDevice.playerAudio.addEventListener("canplaythrough", function(event){
            $exeDevice.playerAudio.play();
        });
    },

    stopSound() {
        if ($exeDevice.playerAudio && typeof $exeDevice.playerAudio.pause == "function") {
            $exeDevice.playerAudio.pause();
        }
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

    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },

    addEvents: function () {
        $('#adivinaEPaste').hide();

        $('#adivinaEInitVideo, #adivinaEEndVideo, #adivinaESilenceVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#adivinaEInitVideo, #adivinaEEndVideo, #adivinaESilenceVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c',
            });

        });
        $('.gameQE-EPanel').on('click', 'input.gameQE-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypeQuestion(type);
        });
        $('#adivinaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#adivinaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#adivinaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#adivinaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#adivinaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#adivinaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#adivinaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#adivinaECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#adivinaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });
        $('#adivinaEPlayVideo').on('click', function (e) {
            e.preventDefault();
            if (!$exeDevice.getIDYoutube($('#adivinaEURLYoutube').val().trim())){
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if( typeof YT =="undefined"){
                $exeDevice.isVideoType=true;
                $exeDevice.loadYoutubeApi();
            }else{
                $exeDevice.showVideoQuestion();
            }

        });
        $('#adivinaEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#adivinaEURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });
        $(' #adivinaECheckSoundVideo').on('change', function () {
            if (!$exeDevice.getIDYoutube($('#adivinaEURLYoutube').val().trim())){
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if( typeof YT =="undefined"){
                $exeDevice.isVideoType=true;
                $exeDevice.loadYoutubeApi();
            }else{
                $exeDevice.showVideoQuestion();
            }
        });
        $('#adivinaECheckImageVideo').on('change', function () {
            if (!$exeDevice.getIDYoutube($('#adivinaEURLYoutube').val().trim())){
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            if( typeof YT =="undefined"){
                $exeDevice.isVideoType=true;
                $exeDevice.loadYoutubeApi();
            }else{
                $exeDevice.showVideoQuestion();
            }
        });
        $('#adivinaEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#adivinaENumberLives').prop('disabled', !marcado);
        });
        $('#adivinaEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#adivinaETimeShowSolution').prop('disabled', !marcado);
        });

        $('#adivinaETimeQuestion').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#adivinaETimeQuestion').on('focusout', function () {
            this.value = this.value.trim() == '' ? 30 : this.value;
            this.value = this.value > 600 ? 600 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#adivinaENumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#adivinaENumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#adivinaETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#adivinaETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#adivinaEPercentageShow').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#adivinaEPercentageShow').on('focusout', function () {
            this.value = this.value.trim() == '' ? 35 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
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

        $('#adivinaEInitVideo').css('color', '#2c6d2c');
        $('#adivinaEInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#adivinaEInitVideo').css('color', '#2c6d2c');
            $('#adivinaEEndVideo').css('color', '#333');
            $('#adivinaESilenceVideo').css('color', '#333');
        });
        $('#adivinaEEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#adivinaEEndVideo').css('color', '#2c6d2c');
            $('#adivinaEInitVideo').css('color', '#333');
            $('#adivinaESilenceVideo').css('color', '#333');
        });
        $('#adivinaESilenceVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 2;
            $('#adivinaESilenceVideo').css('color', '#2c6d2c');
            $('#adivinaEEndVideo').css('color', '#333');
            $('#adivinaEInitVideo').css('color', '#333');
        });
        $('#adivinaEVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#adivinaEInitVideo');
                    break;
                case 1:
                    $timeV = $('#adivinaEEndVideo');
                    break;
                case 2:
                    $timeV = $('#adivinaESilenceVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#adivinaEVideoTime').text());
            $timeV.css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });

        $('#adivinaEUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#adivinaENumberLives').prop('disabled', !marcado);
        });
        $('#adivinaEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#adivinaETimeShowSolution').prop('disabled', !marcado);
        });


        $('#adivinaEURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#adivinaEAlt').val(),
                x = parseFloat($('#adivinaEXImage').val()),
                y = parseFloat($('#adivinaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#adivinaEPlayImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#adivinaEURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#adivinaEAlt').val(),
                x = parseFloat($('#adivinaEXImage').val()),
                y = parseFloat($('#adivinaEYImage').val());
            $exeDevice.showImage(url, x, y, alt);
        });

        $('#adivinaEImage').on('click', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#adivinaECursor').on('click', function (e) {
            $(this).hide();
            $('#adivinaEXImage').val(0);
            $('#adivinaEYImage').val(0);
        });

        $('#adivinaEURLAudio').on('change', function () {
            var selectedFile = $(this).val().trim();
            if (selectedFile.length==0) {
                $exeDevice.showMessage(_("Supported formats") + ": mp3, ogg, wav");
            } else {
                if (selectedFile.length > 4) {
                    $exeDevice.stopSound();
                    $exeDevice.playSound(selectedFile);
                }
            }
        });
        $('#adivinaEHasFeedBack').on('change', function () {
            var marcado = $(this).is(':checked');
            if (marcado) {
                $('#adivinaEFeedbackP').slideDown();
            } else {
                $('#adivinaEFeedbackP').slideUp();
            }
            $('#adivinaEPercentajeFB').prop('disabled', !marcado);
        });
        $('#gameQEIdeviceForm').on('click', 'input.gameQE-TypeGame', function (e) {
            var gm = parseInt($(this).val()),
                fb = $('#adivinaEHasFeedBack').is(':checked'),
                ul = $('#adivinaEUseLives').is(':checked');
            $exeDevice.updateGameMode(gm, fb, ul);
        });
        $("#adivinaEGameModeHelpLnk").click(function(){
            $("#adivinaEGameModeHelp").toggle();
            return false;

        });
        $('#adivinaECustomMessages').on('change', function () {
            var messages = $(this).is(':checked');
            $exeDevice.showSelectOrder(messages);
        });
        $('#adivinaEPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if(this.value>0 && this.value<101){
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#adivinaEPercentajeQuestions').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#adivinaEPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });
        $('#adivinaENumberQuestion').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    if ($exeDevice.validateQuestion() != false) {
                        $exeDevice.active= num < $exeDevice.wordsGame.length ? num-1 : $exeDevice.wordsGame.length-1;
                        $exeDevice.showQuestion($exeDevice.active);

                    }else{
                        $(this).val($exeDevice.active+1)
                    }
                }else{
                    $(this).val($exeDevice.active+1)
                }

            }
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },
    showSelectOrder: function (messages, custonmScore) {
        if (messages) {
            $('.gameQE-EOrders').slideDown();
        } else {
            $('.gameQE-EOrders').slideUp();
        }
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
    updateGameMode: function (gamemode, feedback, useLives) {

        $("#adivinaEUseLives").prop('disabled', true);
        $("#adivinaENumberLives").prop('disabled', true);
        $('#adivinaEPercentajeFB').prop('disabled', !feedback && gamemode != 2);
        $('#adivinaEHasFeedBack').prop('disabled', gamemode == 2);
        $('#adivinaEHasFeedBack').prop('checked', feedback);
        if (gamemode == 2 || feedback) {
            $('#adivinaEFeedbackP').slideDown();
        }
        if (gamemode != 2 && !feedback) {
            $('#adivinaEFeedbackP').slideUp();
        }
        if (gamemode == 0) {
            $("#adivinaEUseLives").prop('disabled', false);
            $("#adivinaENumberLives").prop('disabled', !useLives);
        }
    },

    showVideoQuestion: function () {    
        var soundVideo = $('#adivinaECheckSoundVideo').is(':checked') ? 1 : 0,
            imageVideo = $('#adivinaECheckImageVideo').is(':checked') ? 1 : 0,
            iVideo = $exeDevice.hourToSeconds($('#adivinaEInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#adivinaEEndVideo').val()),
            url = $('#adivinaEURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        $exeDevice.silentVideo = $exeDevice.hourToSeconds($('#adivinaESilenceVideo').val().trim());
        $exeDevice.tSilentVideo = parseInt($('#adivinaETimeSilence').val());
        $exeDevice.activeSilent = (soundVideo == 1) && ($exeDevice.tSilentVideo > 0) && ($exeDevice.silentVideo >= iVideo) && (iVideo < fVideo);
        $exeDevice.endSilent = $exeDevice.silentVideo + $exeDevice.tSilentVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#adivinaENoImageVideo').hide();
        $('#adivinaENoVideo').show();
        $('#adivinaEVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#adivinaEVideo').show();
            $('#adivinaENoVideo').hide();
            if (imageVideo == 0) {
                $('#adivinaEVideo').hide();
                $('#adivinaENoImageVideo').show();
            }
            if (soundVideo == 0) {
                $exeDevice.muteVideo(true)
            } else {
                $exeDevice.muteVideo(false)
            }
        } else {
            $exeDevice.showMessage(_("This video is not currently available"));
            $('#adivinaENoVideo').show();
        }
    },

    clearQuestion: function () {
        $exeDevice.changeTypeQuestion(0);
        //$("input.myclass[name='myname'][value='the_value']").prop("checked", true);
        $('.gameQE-Type')[0].checked = true;
        $('.gameQE-Times')[0].checked = true;
        $('#adivinaEURLImage').val('');
        $('#adivinaEXImage').val('0');
        $('#adivinaEYImage').val('0');
        $('#adivinaEAuthor').val('');
        $('#adivinaEAlt').val('');
        $('#adivinaEURLYoutube').val('');
        $('#adivinaEInitVideo').val('00:00:00');
        $('#adivinaEEndVideo').val('00:00:00');
        $('#adivinaECheckSoundVideo').prop('checked', true);
        $('#adivinaECheckImageVideo').prop('checked', true);
        tinyMCE.get('adivinaEText').setContent('');
        $('#adivinaEDefinitionWord').val('');
        $('#adivinaESolutionWord').val('');
        $('#adivinaEURLAudio').val('');
    },

    addQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.clearQuestion();
            $exeDevice.wordsGame.push($exeDevice.getCuestionDefault());
            $exeDevice.active = $exeDevice.wordsGame.length - 1;
            $('#adivinaENumberQuestion').val($exeDevice.wordsGame.length);
            $exeDevice.typeEdit = -1;
            $('#adivinaEPaste').hide();
            $('#adivinaENumQuestions').text($exeDevice.wordsGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },

    removeQuestion: function () {
        if ($exeDevice.wordsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
        } else {
            $exeDevice.wordsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.wordsGame.length - 1) {
                $exeDevice.active = $exeDevice.wordsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#adivinaEPaste').hide();
            $('#adivinaENumQuestions').text($exeDevice.wordsGame.length);
            $('#adivinaENumberQuestion').val($exeDevice.active + 1);
            $exeDevice.updateQuestionsNumber();
        }

    },

    copyQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.wordsGame[$exeDevice.active];
            $('#adivinaEPaste').show();
        }

    },

    cutQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            $exeDevice.numberCutCuestion = $exeDevice.active;
            $exeDevice.typeEdit = 1;
            $('#adivinaEPaste').show();

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
            $exeDevice.wordsGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showQuestion($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#adivinaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.wordsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showQuestion($exeDevice.active);
            $('#adivinaENumQuestions').text($exeDevice.wordsGame.length);
            $exeDevice.updateQuestionsNumber();
        }
    },

    nextQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.wordsGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showQuestion($exeDevice.active);
            }
        }
    },

    lastQuestion: function () {
        if ($exeDevice.validateQuestion() != false) {
            if ($exeDevice.active < $exeDevice.wordsGame.length - 1) {
                $exeDevice.active = $exeDevice.wordsGame.length - 1;
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

    updateFieldGame: function (game) {
        $exeDevice.active = 0;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.percentajeFB = typeof game.percentajeFB != "undefined" ? game.percentajeFB : 100;
        game.gameMode = typeof game.gameMode != "undefined" ? game.gameMode : 0;
        game.feedBack = typeof game.feedBack != "undefined" ? game.feedBack : false;
        game.customMessages = typeof game.customMessages == "undefined" ? false : game.customMessages;
        $exeDevice.timeQuestion = typeof game.timeQuestion != "undefined" ? game.timeQuestion : $exeDevice.timeQuestion;
        $exeDevice.percentageShow = typeof game.percentageShow != "undefined" ? game.percentageShow : $exeDevice.timeQuestion;
        game.percentajeQuestions = typeof game.percentajeQuestions == "undefined" ? 100 : game.percentajeQuestions;
        game.timeQuestion = $exeDevice.timeQuestion;
        game.percentageShow = $exeDevice.percentageShow;
        $('#adivinaEShowMinimize').prop('checked', game.showMinimize);
        $('#adivinaEOptionsRamdon').prop('checked', game.optionsRamdon);
        $('#adivinaEUseLives').prop('checked', game.useLives);
        $('#adivinaENumberLives').val(game.numberLives);
        $('#adivinaEShowSolution').prop('checked', game.showSolution);
        $('#adivinaModeBoard').prop("checked", game.modeBoard);
        $('#adivinaETimeShowSolution').val(game.timeShowSolution)
        $('#adivinaETimeShowSolution').prop('disabled', !game.showSolution);
        $('#adivinaECaseSensitive').prop('checked', game.caseSensitive);
        $("#adivinaEHasFeedBack").prop('checked', game.feedBack);
        $("#adivinaEPercentajeFB").val(game.percentajeFB);
        $("input.gameQE-TypeGame[name='qxtgamemode'][value='" + game.gameMode + "']").prop("checked", true);
        $("#adivinaEUseLives").prop('disabled', game.gameMode == 0);
        $("#adivinaENumberLives").prop('disabled', (game.gameMode == 0 && game.useLives));
        $('#adivinaECustomMessages').prop('checked', game.customMessages);
        $('#adivinaEPercentajeQuestions').val(game.percentajeQuestions);
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.updateGameMode(game.gameMode, game.feedBack, game.useLives);
        $exeDevice.showSelectOrder(game.customMessages);
        
        var version = typeof game.version == 'undefined' ? 0 : game.version;
        for (var i = 0; i < game.wordsGame.length; i++) {
            var p = game.wordsGame[i];
            if (version < 2) {
                p.type = p.type == 2 ? 1 : p.type;
                p.percentageShow = typeof game.percentageShow == 'undefined' ? 35 : game.percentageShow;
                p.time = typeof game.timeQuestion == 'undefined' ? 1 : $exeDevice.getIndexTime(game.timeQuestion);
                p.soundVideo = 1;
                p.imageVideo = 1;
                p.iVideo = 0;
                p.fVideo = 0;
                p.silentVideo = 0;
                p.fVideo = 0;
                p.eText = '';
                p.audio = '';
            }
            p.msgHit = typeof p.msgHit == "undefined" ? "" : p.msgHit;
            p.msgError = typeof p.msgError == "undefined" ? "" :p.msgError;
            p.time = p.time < 0 ? 0 : p.time;
            p.audio = typeof p.audio == "undefined" ? '' : p.audio;
            game.wordsGame[i] = p;
        }
        $exeDevice.wordsGame = game.wordsGame;
        if (game.feedBack || game.gameMode == 2) {
            $('#adivinaEFeedbackP').show();
        } else {
            $('#adivinaEFeedbackP').hide();
        }
        $('#adivinaEPercentajeFB').prop('disabled', !game.feedBack);
        $exeDevice.updateQuestionsNumber();
    },
    exportGame: function () {
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
        link.download = _("Game") + "Adivina.json";
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
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame !== 'Adivina') {
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        }
        if ($exeDevice.wordsGame.length > 1) {
            game.wordsGame = $exeDevice.importAdivina(game)
        }
        $exeDevice.updateFieldGame(game);
        var instructions = game.instructionsExe || game.instructions,
            tAfter = game.textAfter || "",
            textFeedBack = game.textFeedBack || "";
        tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
        tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
        tinyMCE.get('adivinaEFeedBackEditor').setContent(unescape(textFeedBack));
        $('.exe-form-tabs li:first-child a').click();
        $exeDevice.active=0;
        $exeDevice.showQuestion($exeDevice.active);
    },
    importAdivina: function (game) {
        var wordsGame = $exeDevice.wordsGame;
        for (var i = 0; i < game.wordsGame.length; i++) {
            var p = game.wordsGame[i];
            p.percentageShow = typeof game.percentageShow == 'undefined' ? 35 : game.percentageShow;
            p.time = typeof p.time == 'undefined' ? 1 : p.time;
            p.audio = typeof p.audio == "undefined" ? "" : p.audio;
            p.hit = typeof p.hit == "undefined" ? -1 : p.hit;
            p.error = typeof p.error == "undefined" ? -1 : p.error;
            p.msgHit = typeof p.msgHit == "undefined" ? "" : p.msgHit;
            p.msgError = typeof p.msgError == "undefined" ? "" : p.msgError;
            wordsGame.push(p);
        }
        return wordsGame;
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

    validTime: function (time) {
        var reg = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
        return (time.length == 8 && reg.test(time))
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

    clickImage: function (img, epx, epy) {
        var $cursor = $('#adivinaECursor'),
            $x = $('#adivinaEXImage'),
            $y = $('#adivinaEYImage'),
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
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    extractURLGD: function (urlmedia) {
        var sUrl=urlmedia;
        if(typeof urlmedia!="undefined" && urlmedia.length>0 && urlmedia.toLowerCase().indexOf("https://drive.google.com")==0 && urlmedia.toLowerCase().indexOf("sharing")!=-1){
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }

}