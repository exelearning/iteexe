/**
/**
 * Mapa Activity iDevice (edition code)
 * Version: 1
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Map')
    },
    msgs: {},
    active: 0,
    activeSlide: 0,
    slides: [],
    points: [],
    selectsGame: [],
    qActive: 0,
    youtubeLoaded: false,
    player: '',
    timeUpdateInterval: '',
    timeUpdateVIInterval: '',
    timeVideoFocus: 0,
    timeVIFocus: true,
    timePoint: 30,
    typeEdit: -1,
    typeEditSlide: -1,
    qTypeEdit: -1,
    numberCutCuestion: -1,
    numberCutCuestionSlide: -1,
    clipBoard: '',
    sClipBoard: '',
    qClipBoard: '',
    version: 2,
    iDevicePath: "/scripts/idevices/mapa-activity/edition/",
    playerAudio: "",
    isVideoType: false,
    xA: 0,
    yA: 0,
    iconType: 0,
    iconX: 0,
    iconY: 0,
    levels: [],
    level: 0,
    url: '',
    map: {},
    hasYoutube: false,
    activeMap: {},
    activeSlide: 0,
    parentMap: {},
    ci18n: {
        "msgSubmit": _("Submit"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgClue": _("Cool! The clue is:"),
        "msgErrors": _("Errors"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgFullScreen": _("Full Screen"),
        "msgNoImage": _("No picture question"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgPoint": _("Point"),
        "msgAnswer": _("Answer"),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgClose": _("Close"),
        "msgPoints": _("points"),
        "msgQuestions": _("Questions"),
        "msgAudio": _("Audio"),
        "msgAccept": _("Accept"),
        "msgYes": _("Yes"),
        "msgNo": _("No"),
        "msgShowAreas": _("Show active areas"),
        "msgShowTest": _("Show questionnaire"),
        "msgGoActivity": _("Click here to do this activity"),
        "msgSelectAnswers": _("Select the correct options and click on the 'Reply' button."),
        "msgCheksOptions": _("Mark all the options in the correct order and click on the 'Reply' button."),
        "msgWriteAnswer": _("Mark all the options in the correct order and click on the 'Reply' button."),
        "msgIdentify": _("Identify"),
        "msgSearch": _("Find"),
        "msgClickOn": _("Click on"),
        "msgReviewContents": _("You must review %s&percnt; of the contents of the activity before completing the questionnaire."),
        "msgScore10": _("Everything is perfect! Do you want to repeat this activity?"),
        "msgScore4": _("You have not passed this test. You should review its contents and try again. Do you want to repeat this activity?"),
        "msgScore6": _("Great! You have passed the test, but you can improve it surely. Do you want to repeat this activity?"),
        "msgScore8": _("Almost perfect! You can still do it better. Do you want to repeat this activity?"),
        "msgNotCorrect": _("It is not correct! You have clicked on"),
        "msgNotCorrect1": _("It is not correct! You have clicked on"),
        "msgNotCorrect2": _("and the correct answer is"),
        "msgNotCorrect3": _("Try again!"),
        "msgAllVisited":  _("Great! You have visited the required dots."),
        "msgCompleteTest": _("You can do the test."),
        "msgPlayStart": _("Click here to start"),
        "msgSubtitles": _("Subtitles"),
        "msgSelectSubtitles": _("Select a subtitle file. Supported formats:")
    },
    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%");
        this.ci18n.msgReviewContents = this.ci18n.msgReviewContents.replace("&percnt;", "%");
        this.setMessagesInfo();
        this.createForm();
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("Please provide the word definition");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgECompletePoint = _("You have to complete the question");
        msgs.msgECompleteAllOptions = _("You have to complete all the selected options");
        msgs.msgESelectSolution = _("Choose the right answer");
        msgs.msgECompleteURLYoutube = _("Type the right URL of a Youtube video");
        msgs.msgEStartEndVideo = _("You have to indicate the start and the end of the video that you want to show");
        msgs.msgEStartEndIncorrect = _("The video end value must be higher than the start one");
        msgs.msgWriteText = _("You have to type a text in the editor");
        msgs.msgTypeChoose = _("Please check all the answers in the right order");
        msgs.msgTimeFormat = _("Please check the time format: hh:mm:ss");
        msgs.msgProvideFB = _('Message to display when passing the game');
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEProvideWord = _("Please provide one word or phrase");
        msgs.msgEOneQuestion = _("Please provide at least one question");
        msgs.msgEUnavailableVideo = _("This video is not currently available")
        msgs.msgECompleteQuestion = _("You have to complete the question");
        msgs.msgSilentPoint = _("The silence time is wrong. Check the video duration.");
        msgs.msgProvideSolution = _("Please write the solution");
        msgs.msgEDefintion = _("Please provide the word definition");
        msgs.msgNotHitCuestion = _('The question marked as next in case of success does not exist.');
        msgs.msgNotErrorCuestion = _('The question marked as next in case of error does not exist.');
        msgs.msgProvideTitle = _("You must indicate a title for this point.");
        msgs.msgMarkPoint = _("You must mark a point on the map.");
        msgs.msgDrawArea = _("You must draw an area on the map.");
        msgs.msgTitle = _("Provide a slide title.");
        msgs.msgSelectAudio = _("Select an audio file.");
        msgs.msgErrorPointMap = _("Error in the submap.");
        msgs.msgEOnePoint = _("You must indicate one point at least.");
        msgs.msgCloseMap = _("You must close all the edited maps before saving the activity.");
        msgs.msgCloseSlide = _("You must close the edited presentation before saving the activity.");
        msgs.msgEOneSlide = _("There must be at least one slide in the presentation.");

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
            <div id="gameQEIdeviceForm">\
            <div class="exe-form-tab" title="' + _('General settings') + '">\
            ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Click on the active areas or image icons.")) + '\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">' + _("Options") + '</a></legend>\
                    <div>\
                        <p>\
                            <label for="mapaEShowMinimize"><input type="checkbox" id="mapaEShowMinimize">'+_('Show minimized.')+'</label>\
                        </p>\
                        <p>\
                            <span>' + _("Assessment") + ':</span>\
                            <input class="MQE-TypeEvaluation"  checked id="mapaEEvaluationPoints" type="radio" name="mpevaluation"  value="0" />\
                            <label for="mapaEEvaluationPoints">' + _("Visited points") + '</label>\
                            <input class="MQE-TypeEvaluation" id="mapaEEvaluationSearch" type="radio" name="mpevaluation"  value="2" />\
                            <label for="mapaEEvaluationIdentify">' + _("Identify") + '</label>\
                            <input class="MQE-TypeEvaluation" id="mapaEEvaluationIdentify" type="radio" name="mpevaluation" value="3" />\
                            <label for="mapaEEvaluationSearch">' + _("Find") + '</label>\
                            <input class="MQE-TypeEvaluation" id="mapaEEvaluationTX" type="radio" name="mpevaluation"  value="1" />\
                            <label for="mapaEEvaluationTX">' + _("Test") + '</label>\
                            <input class="MQE-TypeEvaluation" id="mapaEEvaluationTest" type="radio" name="mpevaluation"  value="4" />\
                            <label for="mapaEEvaluationTest">' + _("Questionnaire") + '</label>\
                        </p>\
                        <p class="MQE-EHide" id="mapaSolutionData">\
                            <label for="mapaEShowSolution"><input type="checkbox" checked id="mapaEShowSolution">' + _("Show solutions") + '. </label>\
                            <label for="mapaETimeShowSolution">' + _("Show solution time (seconds)") + ' </label><input type="number" name="mapaETimeShowSolution" id="mapaETimeShowSolution" value="3" min="1" max="9" />\
                        </p>\
                        <div class="MQE-EHide" id="mapaEvaluationData">\
                            <p>\
                                <label for="mapaPercentajeShowQ">' + _("Percentage of visited contents necessary to be able to carry out the activity questionnaire") + ':  </label><input type="number" name="mapaPercentajeShowQ" id="mapaPercentajeShowQ" value="100" min="1" max="100" />\
                                <span id="mapaPShowQuestions">1/1</span>\
                            </p>\
                            <p >\
                                <label for="mapaPercentajeQuestions">' + _("Percentage of questionnaire questions") + ':  <input type="number" name="mapaPercentajeQuestions" id="mapaPercentajeQuestions" value="100" min="1" max="100" /> </label>\
                                <span id="mapaNumberQuestions">1/1</span>\
                            </p>\
                        </div>\
                        <p class="MQE-EHide" id="mapaEvaluationIdentify">\
                            <label for="mapaPercentajeIdentify">' + _("Percentage of questions") + ':  <input type="number" name="mapaPercentajeIdentify" id="mapaPercentajeIdentify" value="100" min="1" max="100" /> </label>\
                            <span id="mapaNumberPercentaje">1/1</span>\
                        </p>\
                        <p class="MQE-EHide" id="mapaEvaluationAudioData">\
                            <label for="mapaEvaluationAudio"><input type="checkbox" id="mapaEvaluationAudio">' + _("Show solutions") + '. </label>\
                        </p>\
                    </div>\
                </fieldset>\
                <fieldset class="exe-fieldset MQE-FieldPanel">\
                    <legend><a href="#">' + _('Map') + '</a></legend>\
                    <div class="MQE-EPanel" id="mapaEPanel">\
                        <div id="mapaImageSelect">\
                            <p class="MQE-CloseDetail" id="mapaCloseDetail">\
                                <a href="#" id="mapaCloseLevel" title="' + _('Close') + '">'+('Close map')+' <img src="' + path + 'mapacerrarventana.svg" class="MQE-ENavigationButton MQE-EActivo " alt=""/></a>\
                            </p>\
                            <p class="MQE-EFlex">\
                                <label for="mapaURLImageMap">' + _('Image') + ':</label>\
                                <input type="text" id="mapaURLImageMap" class="MQE-IURLImage exe-file-picker" />\
                                <a href="#" id="mapaShowImageMap" class="MQE-ENavigationButton MQE-EActivo  MQE-Play" title="' + _('Show Image') + '"></a>\
                                <a href="#" id="mapaMoreImageMap" class="MQE-ENavigationButton MQE-EActivo  MQE-More"  title="' + _('More') + '"></a>\
                            </p>\
                            <p class="MQE-EFlex MQE-EHide" id="mapaMoreImage">\
                                <label for="mapaAuthorImageMap">' + _('Author') + ':</label><input id="mapaAuthorImageMap" type="text" />\
                                <label for="mapaAltImageMap">Alt:</label><input id="mapaAltImageMap" type="text" />\
                            </p>\
                            <p class="MQE-EFlex MQE-EHide">\
                                <label for="mapaX">X:</label><input id="mapaX" type="text" value="0" />\
                                <label for="mapaY">Y:</label><input id="mapaY" type="text" value="0" />\
                                <label for="mapaX1">X1:</label><input id="mapaX1" type="text" value="0" />\
                                <label for="mapaY1">Y1:</label><input id="mapaY1" type="text" value="0" />\
                            </p>\
                        </div>\
                        <div class="MQE-EMultimedias"mapa-activity.js>\
                            <div class="MQE-EMediaContainer">\
                                <div class="MQE-EMultimedia">\
                                    <img id="mapaImage" class="MQE-EImage" src="' + path + 'quextIEImage.png" alt="" />\
                                    <div class="MQE-ECursorPoint" id="mapaCursor"></div>\
                                    <div id="mapaArea" class="MQE-EArea"></div>\
                                    <img id="mapaNoImage" class="MQE-EImageCover" src="' + path + 'quextIEImage.png" alt="" />\
                                     <div id="mapaProtector" class="MQE-EProtector"></div>\
                                </div>\
                            </div>\
                            ' + $exeDevice.getMultimediaPoint(path) + '\
                            ' + $exeDevice.getSlide(path) + '\
                        </div>\
                        <div id="mapaMutimediaType">\
                            <p class="MQE-EFlex">\
                                <label for="mapaTitle">' + _('Title') + ':</label><input id="mapaTitle" type="text" />\
                                <span class="MQE-EFlexN">\
                                    <span>Tipo:</span>\
                                    <input class="MQE-Type" id="mapaEMediaNone" checked type="radio" name="mpmediatype" value="4" />\
                                    <label for="mapaEMediaNone">' + _('None') + '</label>\
                                    <input class="MQE-Type" checked="" id="mapaEMediaImage" type="radio"  name="mpmediatype" value="0" />\
                                    <label for="mapaEMediaImage">' + _('Image') + '</label>\
                                    <input class="MQE-Type" id="mapaEMediaVideo" type="radio" name="mpmediatype" value="1" />\
                                    <label for="mapaEMediaVideo">' + _('Video') + '</label>\
                                    <input class="MQE-Type" id="mapaEMediaText" type="radio" name="mpmediatype" value="2" />\
                                    <label for="mapaEMediaText">' + _('Text') + '</label>\
                                    <input class="MQE-Type" id="mapaEMediaAudio" type="radio" name="mpmediatype" value="3" />\
                                    <label for="mapaEMediaAudio">' + _('Audio') + '</label>\
                                    <input class="MQE-Type" id="mapaEMediaMap" type="radio" name="mpmediatype" value="5" />\
                                    <label for="mapaEMediaMap">' + _('Map') + '</label>\
                                    <a href="#" id="mapaEditPointsMap"  class="MQE-EditPointsMap" title="' + _('Edit map points') + '">' + _('Edit') + '</a>\
                                    <input class="MQE-Type" id="mapaEMediaSlide" type="radio" name="mpmediatype" value="6" />\
                                    <label for="mapaEMediaSlide">' + _('Presentation') + '</label>\
                                    <a href="#" id="mapaEditSlide"  class="MQE-EditPointsMap" title="' + _('Edit presentation points') + '">' + _('Edit') + '</a>\
                                 </span>\
                            </p>\
                        </div>\
                        ' + $exeDevice.getIconType() + '\
                        <div id="mapaDataImage">\
                            <p class="MQE-EFlex">\
                                <label for="mapaURLImage">' + _('Image') + '</label><input type="text" id="mapaURLImage" class="MQE-IURLImage exe-file-picker" />\
                                <a href="#" id="mapaShowImage" class="MQE-ENavigationButton MQE-EActivo  MQE-Play" title="' + _('Show Image') + '"></a>\
                            </p>\
                        </div>\
                        <div id="mapaDataVideo" class="MQE-EHide">\
                            <p class="MQE-EFlex">\
                                <label for="mapaURLYoutube">' + _('Youtube URL') + ': </label><input type="text" id="mapaURLYoutube" class="MQE-IURLImage" />\
                                <a href="#" id="mapaPlayVideo" class="MQE-ENavigationButton MQE-EActivo  MQE-Play"  title="' + _('Play video') + '"></a>\
                            </p>\
                        </div>\
                        <div id="mapaDataAudio" class="MQE-EHide">\
                            <p class="MQE-EFlex">\
                                <label for="mapaURLAudio">' + _('Audio') + ': </label><input type="text" id="mapaURLAudio" class="MQE-IURLImage exe-file-picker" />\
                                <a href="#" id="mapaEPlayAudio" class="MQE-ENavigationButton MQE-EActivo  MQE-Play"  title="' + _('Play audio') + '"></a>\
                            </p>\
                        </div>\
                        <div id="mapaDataFooter" class="MQE-EHide">\
                            <p class="MQE-EFlex">\
                                <label for="mapaFooter">' + _('Footer') + ': </label><input type="text" id="mapaFooter" class="MQE-IURLImage" />\
                            </p>\
                        </div>\
                        <div id="mapaDataText" class="MQE-EHide">\
                            <label for="mapaText">' + _('Text') + ' </label><textarea id="mapaText" class="exe-html-editor MQE-EText"></textarea>\
                        </div>\
                        <div id="mapaDataIdentifica" class="MQE-EHide">\
                            <p class="MQE-EFlex">\
                                <label for="mapaIdentify">' + _('Identify') + ': </label>\
                                <input type="text" id="mapaIdentify" class="MQE-IURLImage" />\
                                <a href="#" id="mapaIdentifyMoreAudio" class="MQE-ENavigationButton MQE-EActivo  MQE-More"  title="' + _('Audio') + '"></a>\
                            </p>\
                            <div id="mapaDataIdentifyAudio"  class="MQE-EHide">\
                                <p class="MQE-EFlex">\
                                    <label for="mapaURLAudioIdentify">' + _('Audio') + ': </label>\
                                    <input type="text" id="mapaURLAudioIdentify" class="MQE-IURLImage exe-file-picker" />\
                                    <a href="#" id="mapaPlayAudioIdentify" class="MQE-ENavigationButton MQE-EActivo  MQE-Play"  title="' + _('Play audio') + '"></a>\
                                </p>\
                            </div>\
                        </div>\
                        <div class="MQE-EContents">\
                            <div class="MQE-ENavigationButtons">\
                                <a href="#" id="mapaEAdd" class="MQE-ENavigationButton MQE-EActivo  MQE-Add" title="' + _('Add point') + '"></a>\
                                <a href="#" id="mapaEFirst" class="MQE-ENavigationButton MQE-EActivo  MQE-First" title="' + _('First point') + '"></a>\
                                <a href="#" id="mapaEPrevious" class="MQE-ENavigationButton MQE-EActivo  MQE-Previous" title="' + _('Previous point') + '"></a>\
                                <label class="sr-av" for="mapaNumberPoint">' + _('Point number') + ':</label>\
                                <input type="text" class="MQE-NumberPoint" id="mapaNumberPoint" value="1" />\
                                <a href="#" id="mapaENext" class="MQE-ENavigationButton MQE-EActivo  MQE-Next" title="' + _('Next Point') + '"></a>\
                                <a href="#" id="mapaELast" class="MQE-ENavigationButton MQE-EActivo  MQE-Last" title="' + _('Last point') + '"></a>\
                                <a href="#" id="mapaEDelete" class="MQE-ENavigationButton MQE-EActivo  MQE-Delete" title="' + _('Delete point') + '"></a>\
                                <a href="#" id="mapaECopy" class="MQE-ENavigationButton MQE-EActivo  MQE-Copy" title="' + _('Copy point') + '"></a>\
                                <a href="#" id="mapaECut" class="MQE-ENavigationButton MQE-EActivo  MQE-Cut" title="' + _('Cut point') + '"></a>\
                                <a href="#" id="mapaEPaste" class="MQE-ENavigationButton MQE-EActivo  MQE-Paste" title="' + _('Paste point') + '"></a>\
                            </div>\
                        </div>\
                        <div class="MQE-ENumQuestionDiv">\
                            <div class="MQE-ENumQ"><span class="sr-av">' + _("Number of points") + ':</span></div>\ <span class="MQE-ENumQuestions" id="mapaENumPoints">1</span>\
                        </div>\
                        <div class="MQE-Cubierta" id="mapaCubierta"></div>\
                    </div>\
                </fieldset>\
                 ' + $exeDevice.getCuestionario() + '\
                 ' + $exeDevice.getTextFieldset("after") + '\
            </div>\
            ' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
            ' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
            ' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
        </div>';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        $exeDevice.enableForm(field);
    },
    getMultimediaPoint: function (path) {
        var html = '<div class="MQE-EPointContainer"  id="mapaPContainer">\
            <div class="MQE-EPointMultimedia">\
                <p class="MQE-EFlex">\
                    <label for="mapaPTitle">' + _("Title") + ':</label><input id="mapaPTitle" type="text" />\
                    <a href="#" id="mapaPClose" class="MQE-ENavigationButton MQE-EActivo  MQE-Close" title="' + _('Close') + '"></a>\
                </p>\
                <div id="mapaPImageContainer" class="MQE-PointImageContainer">\
                    <img id="mapaPImage" class="MQE-EImage" src="' + path + 'quextIEImage.png" alt="" />\
                    <img id="mapaPNoImage" class="MQE-EImageCover" src="' + path + 'quextIEImage.png" alt="" />\
                    <img class="MQE-EImageCover" src="' + path + 'quextIENoVideo.png" id="mapaPNoVideo" alt="" />\
                    <div id="mapaPVideo"  class="MQE-EImageCover"></div>\
                </div>\
                <div id="mapaPDataImage">\
                    <p class="MQE-EFlex">\
                        <label for="mapaPURLImage">' + _("Image") + ':</label>\
                        <input type="text" id="mapaPURLImage" class="MQE-IURLImage exe-file-picker" />\
                        <a href="#" id="mapaPShowImage" class="MQE-ENavigationButton MQE-EActivo  MQE-Play" title="' + _('Show Image') + '"></a>\
                    </p>\
                    <p class="MQE-EFlex">\
                        <label for="mapaPAuthorImage">' + _("Author") + ':</label><input id="mapaPAuthorImage"  type="text" />\
                        <label for="mapaPAltImage">' + _("Alt") + ':</label><input id="mapaPAltImage" type="text" />\
                    </p>\
                </div>\
                <div id="mapaPDataVideo" class="MQE-EHide">\
                    <p class="MQE-EFlex">\
                        <label>' + _("Youtube URL") + '</label>\
                        <input type="text" id="mapaPURLYoutube" class="MQE-IURLImage" />\
                        <a href="#" id="mapaPPlayVideo" class="MQE-ENavigationButton MQE-EActivo  MQE-Play"  title="' + _('Play video') + '"></a>\
                    </p>\
                    <p class="MQE-EFlex" id="mapaEPointInputOptionsVideo">\
                        <label for="mapaPInitVideo">' + _('Start') + ':</label><input id="mapaPInitVideo" type="text"   value="00:00:00" maxlength="8" />\
                        <label for="mapaPEndVideo">' + _('End') + ':</label><input id="mapaPEndVideo" type="text" value="00:00:00" maxlength="8" />\
                        <button class="MQE-EMediaTime" id="mapaPVideoTime" type="button">00:00:00</button>\
                    </p>\
                </div>\
                <div id="mapaPDataFooter">\
                    <p class="MQE-EFlex">\
                        <label for="mapaPFooter">' + _("Footer") + ': </label><input type="text" id="mapaPFooter" class="MQE-IURLImage" />\
                    </p>\
                </div>\
            </div>\
        </div>'
        return html;
    },
    getSlide: function (path) {
        var html = '<div class="MQE-ESlideContainer"  id="mapaSContainer">\
            <div class="MQE-ESlideMultimedia">\
                <p class="MQE-EFlex">\
                    <label for="mapaSTitle">' + _("Title") + ':</label><input id="mapaSTitle" type="text" />\
                    <a href="#" id="mapaSClose" class="MQE-ENavigationButton MQE-EActivo  MQE-Close" title="' + _('Close') + '"></a>\
                </p>\
                <div id="mapaSImageContainer" class="MQE-PointImageContainer">\
                    <img id="mapaSImage" class="MQE-EImage" src="' + path + 'quextIEImage.png" alt="" />\
                    <img id="mapaSNoImage" class="MQE-EImageCover" src="' + path + 'quextIEImage.png" alt="" />\
                </div>\
                <div id="mapaSDataImage">\
                    <p class="MQE-EFlex">\
                        <label for="mapaSURLImage">' + _("Image") + ':</label>\
                        <input type="text" id="mapaSURLImage" class="MQE-IURLImage exe-file-picker" />\
                        <a href="#" id="mapaSShowImage" class="MQE-ENavigationButton MQE-EActivo  MQE-Play" title="' + _('Show Image') + '"></a>\
                    </p>\
                    <p class="MQE-EFlex">\
                        <label for="mapaSAuthorImage">' + _("Author") + ':</label><input id="mapaSAuthorImage"  type="text" />\
                        <label for="mapaSAltImage">' + _("Alt") + ':</label><input id="mapaSAltImage" type="text" />\
                    </p>\
                </div>\
                <div id="mapaSDataFooter">\
                    <p class="MQE-EFlex">\
                        <label for="mapaSFooter">' + _("Footer") + ': </label><input type="text" id="mapaSFooter" class="MQE-IURLImage" />\
                    </p>\
                </div>\
                <div class="MQE-EContents">\
                            <div class="MQE-ENavigationButtons">\
                                <a href="#" id="mapaEAddSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Add" title="' + _('Add a slide') + '"></a>\
                                <a href="#" id="mapaEFirstSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-First" title="' + _('First slide') + '"></a>\
                                <a href="#" id="mapaEPreviousSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Previous" title="' + _('Previous slide') + '"></a>\
                                <label class="sr-av" for="mapaNumberSlide">' + _('Slide number') + ':</label>\
                                <input type="text" class="MQE-NumberPoint" id="mapaNumberSlide" value="1" />\
                                <a href="#" id="mapaENextSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Next" title="' + _('Next slide') + '"></a>\
                                <a href="#" id="mapaELastSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Last" title="' + _('Last slide') + '"></a>\
                                <a href="#" id="mapaEDeleteSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Delete" title="' + _('Delete slide') + '"></a>\
                                <a href="#" id="mapaECopySlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Copy" title="' + _('Copy slide') + '"></a>\
                                <a href="#" id="mapaECutSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Cut" title="' + _('Cut slide') + '"></a>\
                                <a href="#" id="mapaEPasteSlide" class="MQE-ENavigationButton MQE-EActivo  MQE-Paste" title="' + _('Paste slide') + '"></a>\
                            </div>\
                        </div>\
            </div>\
        </div>'
        return html;
    },

    getCuestionario: function () {
        var html = '<fieldset class="exe-fieldset  exe-fieldset-closed" id="mapaFQuestions">\
        <legend><a href="#">' + _('Questionnaire') + '</a></legend>\
        <div class="MQE-EContents">\
            <div id="mapaDataQuestion" class="MQE-EFlexSolution">\
                <div class="MQE-EInputType">\
                    <span>' + _("Type") + ':</span>\
                    <input class="MQE-TypeSelect" checked id="mapaTypeChoose" type="radio" name="mptypeselect"  value="0" />\
                    <label for="mapaTypeSelect">' + _("Select") + '</label>\
                    <input class="MQE-TypeSelect" id="mapaTypeOrders" type="radio" name="mptypeselect" value="1" />\
                    <label for="mapaTypeOrders">' + _("Order") + '</label>\
                    <input class="MQE-TypeSelect" id="mapaTypeWord" type="radio" name="mptypeselect"    value="2" />\
                    <label for="mapaTypeWord">' + _("Word") + '</label>\
                </div>\
                <div id="mapaPercentageLetters">\
                <label for="mapaPercentageShow">' + _("Percentage of letters to show (%)") + ':</label>\
                <input type="number" id="mapaPercentageShow" value="35" min="0" max="100" step="5" />\
                </div>\
                <div id="mapaOptionsNumberA">\
                    <span id="mapaOptionsNumberSpan">' + _("Options Number") + ':</span>\
                    <span class="MQE-EInputNumbers" id="mapaEInputNumbers">\
                        <input class="MQE-Number" id="numQ2" type="radio" name="mpnumber" value="2" />\
                        <label for="numQ2">2</label>\
                        <input class="MQE-Number" id="numQ3" type="radio" name="mpnumber" value="3" />\
                        <label for="numQ3">3</label>\
                        <input class="MQE-Number" id="numQ4" type="radio" name="mpnumber" value="4" checked="checked" />\
                        <label for="numQ4">4</label>\
                    </span>\
                </div>\
                <div id="mapaESolitionOptions"><span>' + _("Solution") + ':</span><span  id="mapaESolutionSelect"></span></div>\
            </div>\
            <div class="MQE-EQuestionDiv" id="mapaEQuestionDiv">\
                <label class="sr-av">' + _("Question") + ':</label><input type="text" class="MQE-EQuestion" id="mapaEQuestion">\
            </div>\
            <div class="MQE-EAnswers" id="mapaEAnswers">\
                <div class="MQE-EOptionDiv">\
                    <label class="sr-av">' + _("Solution") + ' A:</label>\
                    <input type="checkbox"   class="MQE-ESolution" name="mpsolution" id="mapaESolution0" value="A" />\
                    <label>A</label>\
                    <input type="text" class="MQE-EOption0 MQE-EAnwersOptions" id="mapaEOption0">\
                </div>\
                <div class="MQE-EOptionDiv">\
                    <label class="sr-av">' + _("Solution") + ' B:</label>\
                    <input type="checkbox"   class="MQE-ESolution" name="mpsolution" id="mapaESolution1" value="B" />\
                    <label>B</label>\
                    <input type="text" class="MQE-EOption1 MQE-EAnwersOptions" id="mapaEOption1">\
                </div>\
                <div class="MQE-EOptionDiv">\
                    <label class="sr-av">' + _("Solution") + ' C:</label>\
                    <input type="checkbox" class="MQE-ESolution" name="mpsolution" id="mapaESolution2" value="C" />\
                    <label>C</label>\
                    <input type="text" class="MQE-EOption2 MQE-EAnwersOptions"id="mapaEOption2">\
                </div>\
                <div class="MQE-EOptionDiv">\
                    <label class="sr-av">' + _("Solution") + ' D:</label>\
                    <input type="checkbox"  class="MQE-ESolution" name="mpsolution" id="mapaESolution3" value="D" />\
                    <label>D</label>\
                    <input type="text" class="MQE-EOption3 MQE-EAnwersOptions"  id="mapaEOption3">\
                </div>\
            </div>\
            <div class="MQE-EWordDiv MQE-DP" id="mapaEWordDiv">\
                <div class="MQE-ESolutionWord">\
                    <label for="mapaESolutionWord">' + _("Word/Phrase") + ': </label>\
                    <input type="text" id="mapaESolutionWord" />\
                </div>\
                <div class="MQE-ESolutionWord">\
                    <label for="mapaEDefinitionWord">' + _("Definition") + ':</label>\
                    <input type="text" id="mapaEDefinitionWord" />\
                </div>\
            </div>\
        </div>\
        <div class="MQE-EOrders" id="mapaEOrder">\
            <div class="MQE-ECustomMessage">\
                <span class="sr-av">' + _("Hit") + '</span><span class="MQE-EHit"></span>\
                <label for="mapaEMessageOK">' + _("Message") + ':</label>\
                <input type="text" class="" id="mapaEMessageOK">\
            </div>\
            <div class="MQE-ECustomMessage">\
                <span class="sr-av">' + _("Error") + '</span><span class="MQE-EError"></span>\
                <label for="mapaEMessageKO">' + _("Message") + ':</label>\
                <input type="text" class="" id="mapaEMessageKO">\
            </div>\
        </div>\
        <div class="MQE-ENavigationButtons">\
            <a href="#" id="mapaEAddQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Add" title="' + _('Add question') + '"></a>\
            <a href="#" id="mapaEFirstQ" class="MQE-ENavigationButton MQE-EActivo  MQE-First"  title="' + _('First question') + '"></a>\
            <a href="#" id="mapaEPreviousQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Previous" title="' + _('Previous question') + '"></a>\
            <label class="sr-av" for="mapaENumberQuestionQ">' + _('Question number') + ':</label>\
            <input type="text" class="MQE-NumberPoint" id="mapaENumberQuestionQ" value="1" />\
            <a href="#" id="mapaENextQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Next"   title="' + _('Next question') + '"></a>\
            <a href="#" id="mapaELastQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Last"   title="' + _('Last question') + '"></a>\
            <a href="#" id="mapaEDeleteQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Delete" title="' + _('Delete question') + '"></a>\
            <a href="#" id="mapaECopyQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Copy"  title="' + _('Copy question') + '"></a>\
            <a href="#" id="mapaECutQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Cut"   title="' + _('Cut question') + '"></a>\
            <a href="#" id="mapaEPasteQ" class="MQE-ENavigationButton MQE-EActivo  MQE-Paste" title="' + _('Paste question') + '"></a>\
        </div>\
        <div class="MQE-ENumQuestionDiv">\
            <div class="MQE-ENumQ"><span class="sr-av">' + _("Number of questions") + ';</span></div>\ <span class="MQE-ENumQuestions" id="mapaENumQuestions">0</span>\
        </div>\
    </fieldset>';
        return html;
    },
    getTextFieldset: function (position) {
        if (typeof (position) != "string" || (position != "after" && position != "before")) return "";
        var tit = _('Content after');
        var id = "After";
        if (position == "before") {
            tit = _('Content before');
            id = "Before";
        }
        return "<fieldset class='exe-fieldset exe-feedback-fieldset exe-fieldset-closed'>\
                    <legend><a href='#'>" + _('Additional content') + " (" + _('Optional').toLowerCase() + ")</a></legend>\
                    <div>\
                        <p>\
                            <label for='eXeIdeviceText" + id + "' class='sr-av'>" + tit + ":</label>\
                            <textarea id='eXeIdeviceText" + id + "' class='exe-html-editor'\></textarea>\
                        </p>\
                    <div>\
				</fieldset>";
    },
    enableForm: function (field) {
        $exeDevice.initPoints();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.showPoint(0);
        $exeDevice.addEvents();

    },
    initLevels: function (data) {
        $exeDevice.activeMap = {};
        $exeDevice.activeMap.pts = Object.values($.extend(true, {}, data.points));
        $exeDevice.activeMap.url = data.url;
        $exeDevice.activeMap.author = data.authorImage;
        $exeDevice.activeMap.alt = data.altImage;
        $exeDevice.activeMap.active = 0;
        $exeDevice.levels = [];
        $exeDevice.levels.push($.extend(true, {}, $exeDevice.activeMap));
        $exeDevice.level = 0;
        $exeDevice.updateQuestionsNumber();
    },

    getNumberIdentify: function (pts) {
        var m = 0;
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            if (p.type != 5) {
                m++
            } else {
                m += $exeDevice.getNumberIdentify(p.map.pts);
            }
        }
        return m;
    },

    showPoint: function (i) {
        $exeDevice.clearPoint();
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.activeMap.pts.length ? $exeDevice.activeMap.pts.length - 1 : num;
        var p = $exeDevice.activeMap.pts[num];
        $exeDevice.stopVideo();
        $exeDevice.changeTypePoint(p.type);
        $('#mapaX').val(p.x);
        $('#mapaY').val(p.y);
        $('#mapaX1').val(p.x1);
        $('#mapaY1').val(p.y1);
        $('#mapaTitle').val(p.title);
        $('#mapaFooter').val(p.footer);
        $('#mapaPTitle').val(p.title);
        $('#mapaPFooter').val(p.footer);
        $('#mapaIconType').val(p.iconType);
        $('#mapaIdentify').val(p.question);
        $('#mapaURLAudioIdentify').val(p.question_audio);
        if (p.type == 0) {
            $('#mapaURLImage').val(p.url);
            $('#mapaPURLImage').val(p.url);
            $('#mapaPAltImage').val(p.alt);
            $('#mapaPAuthorImage').val(p.author);
        } else if (p.type == 1) {
            $('#mapaURLYoutube').val(p.video);
            $('#mapaPURLYoutube').val(p.video);
            $('#mapaPInitVideo').val($exeDevice.secondsToHour(p.iVideo));
            $('#mapaPEndVideo').val($exeDevice.secondsToHour(p.fVideo));
        } else if (p.type == 2) {
            if (tinyMCE.get('mapaText')) {
                tinyMCE.get('mapaText').setContent(p.eText);
            } else {
                $('#mapaText').val(p.eText);
            }
        }
        $exeDevice.changeIcon(p.iconType, p.x, p.y, p.x1, p.y1);
        $exeDevice.stopSound();
        $('#mapaURLAudio').val(p.audio);
        $('#mapaNumberPoint').val(i + 1);
        $('#mapaENumPoints').text($exeDevice.activeMap.pts.length);
        $("input.MQE-Type[name='mpmediatype'][value='" + p.type + "']").prop("checked", true);
    },

    initPoints: function () {
        $('#mapaEInputVideo').css('display', 'flex');
        $('#mapaEInputImage').css('display', 'flex');
        $('#mapaMoreImage').css('display', 'flex');
        $('#mapaCloseDetail').hide();
        $('#mapaMoreImage').hide();
        $('#mapaFQuestions').hide();
        $('#mapaCubierta').hide();
        $('#mapaEPaste').hide();
        $('#mapaImage').attr('draggable', false);
        $('#mapaNoImage').attr('draggable', false);
        $('#mapaEPasteQ').hide();
        $('#mapaPContainer').hide();
        $('#mapaSContainer').hide();
        this.active = 0;
        this.url = ''
        if ($exeDevice.selectsGame.length == 0) {
            var question = $exeDevice.getDefaultQuestion();
            $exeDevice.selectsGame.push(question);
            this.showOptions(4);
            this.showSolution('');
        }
        this.qActive = 0;
        this.activeMap = {}
        this.activeMap.url = "";
        this.activeMap.author = "";
        this.activeMap.alt = "";
        this.activeMap.active = 0;
        this.activeMap.pts = [];
        this.activeMap.pts.push($exeDevice.getDefaultPoint());
        this.levels = [];
        //this.levels.push(Object.assign({}, this.activeMap));
        this.levels.push($.extend(true, {}, this.activeMap));
        this.level = 0
        this.changeTypePoint(0);
        this.changeIcon(0, 0, 0, 0, 0);
        this.showTypeQuestion(0);
    },



    changeTypePoint: function (type) {
        $('#mapaDataImage').hide();
        $('#mapaDataVideo').hide();
        $('#mapaDataText').hide();
        $('#mapaDataAudio').show();
        $('#mapaDataFooter').show();
        $('#mapaPDataImage').hide();
        $('#mapaPDataVideo').hide();
        $('#mapaPMap').hide();
        $('#mapaEditPointsMap').hide();
        $('#mapaEditSlide').hide();

        $('#mapaEPanel').show();
        switch (type) {
            case 0:
                $('#mapaDataImage').show();
                $('#mapaPDataImage').show();
                break;
            case 1:
                $('#mapaDataVideo').show();
                $('#mapaDataAudio').hide();
                $('#mapaPDataVideo').show();
                break;
            case 2:
                $('#mapaDataText').show();
                $('#mapaDataFooter').hide();
                if (tinyMCE.get('mapaText')) {
                    tinyMCE.get('mapaText').show();
                }
                break;
            case 3:
                $('#mapaDataImage').hide();
                $('#mapaDataVideo').hide();
                $('#mapaDataText').hide();
                break;
            case 4:
                $('#mapaDataAudio').hide();
                $('#mapaDataFooter').hide();
                break;
            case 5:

                $('#mapaDataAudio').hide();
                $('#mapaDataFooter').hide();
                $('#mapaEditPointsMap').show();
                break;
            case 6:
                $('#mapaDataAudio').hide();
                $('#mapaDataFooter').hide();
                $('#mapaEditSlide').show();
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
        $exeDevice.player = new YT.Player('mapaPVideo', {
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
        if ($exeDevice.isVideoType) {
            $exeDevice.showVideoPoint();
        }
    },

    updateTimerDisplay: function () {
        if ($exeDevice.player) {
            if (typeof $exeDevice.player.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.player.getCurrentTime());
                $('#mapaPVideoTime').text(time);
            }
        }
    },
    updateTimerVIDisplay: function () {
        if ($exeDevice.playerIntro) {
            if (typeof $exeDevice.playerIntro.getCurrentTime === "function") {
                var time = $exeDevice.secondsToHour($exeDevice.playerIntro.getCurrentTime());
                $('mapaEVITime').text(time);
            }
        }
        //$('#duration').text(formatTime( player.getDuration() ));
    },
    updateProgressBar: function () {
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
    },
    onPlayerError: function (event) {
        //$exeDevice.showMessage("El video mapaEdo no está disponible")
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

    getID: function () {
        return Math.floor(Math.random() * Date.now())
    },
    getDefaultPoint: function () {
        var p = new Object(),
            id = $exeDevice.getID();
        p.id = 'p' + id;
        p.title = '';
        p.type = 0;
        p.url = '';
        p.video = "";
        p.x = 0;
        p.y = 0;
        p.x1 = 0;
        p.y1 = 0;
        p.footer = "";
        p.author = '';
        p.alt = '';
        p.iVideo = 0;
        p.fVideo = 0;
        p.eText = '';
        p.iconType = 0;
        p.question = '';
        p.question_audio = '';
        p.map = {
            id: 'a' + id,
            url: '',
            alt: '',
            author: '',
            pts: [],
        };
        p.slides = [{
                id: 's' + id,
                title: '',
                url: '',
                author: '',
                alt: '',
                footer: ''
            }],
            p.activeSlide = 0;
        return p;
    },

    getDefaultSlide: function () {
        return {
            id: 's' + this.getID(),
            title: '',
            url: '',
            author: '',
            alt: '',
            footer: ''
        };

    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.mapa-DataGame', wrapper).text(),
                dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.mapa-LinkImagesPoints', wrapper),
                $audiosLink = $('.mapa-LinkAudiosPoints', wrapper),
                $textLink = $('.mapa-LinkTextsPoints', wrapper),
                $imagesMap = $('.mapa-LinkImagesMapas', wrapper),
                $audiosIdentifyLink = $('.mapa-LinkAudiosIdentify', wrapper),
                $imagesSlides = $('.mapa-LinkImagesSlides', wrapper);

            dataGame.url = $('.mapa-ImageMap', wrapper).eq(0).attr('href');
            $exeDevice.setMedias(dataGame.points, $imagesLink, $textLink, $audiosLink, $imagesMap, $audiosIdentifyLink, $imagesSlides)
            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".mapa-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }
            var textAfter = $(".mapa-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            if ($exeDevice.hasYoutube) {
                $exeDevice.loadYoutubeApi();
            }
            $exeDevice.initLevels(dataGame);
            $exeDevice.updateNumberQuestions();
            $exeDevice.updateQuestionsNumber();

        }

    },

    setMedias: function (pts, $images, $texts, $audios, $imgmpas, $audiosIdentifyLink, $imagesSlides) {
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            p.question_audio = p.question_audio || '';
            if (p.type != 5) {
                if (p.type == 0 && typeof p.url != "undefined" && !p.url.indexOf('http') == 0 && p.url.length > 4) {
                    $exeDevice.setImage(p, $images);
                } else if (p.type == 2 && typeof p.eText != "undefined" && p.eText.trim().length > 0) {
                    $exeDevice.setText(p, $texts);
                }
                if (p.type != 1 && typeof p.audio != "undefined" && !p.audio.indexOf('http') == 0 && p.audio.length > 4) {
                    $exeDevice.setAudio(p, $audios);
                }
                if (p.type == 2 && !p.video.length > 4) {
                    $exeDevice.hasYoutube = true;
                }
                if (typeof p.question_audio != "undefined" && !p.question_audio.indexOf('http') == 0 && p.question_audio.length > 4) {
                    $exeDevice.setAudioIdentefy(p, $audiosIdentifyLink);
                }
                if (p.type == 6 && typeof p.slides != "undefined" && p.slides.length > 0) {
                    for (var j = 0; j < p.slides.length; j++) {
                        var s = p.slides[j];
                        $exeDevice.setImageSlide(s, $imagesSlides);
                    }
                } else if (p.type != 6 && (typeof p.slides == "undefined" || p.slides.length == 0)) {
                    p.slides = [];
                    p.slides.push($exeDevice.getDefaultSlide())
                    p.activeSlide = 0;
                }
            } else {
                if (typeof p.map.url != "undefined" && !p.map.url.indexOf('http') == 0 && p.map.url.length > 4) {
                    $exeDevice.setImgMap(p, $imgmpas);
                }
                $exeDevice.setMedias(p.map.pts, $images, $texts, $audios, $imgmpas, $audiosIdentifyLink, $imagesSlides);
            }
        }
    },

    setImageSlide: function (s, $images) {
        $images.each(function () {
            var id = $(this).text();
            if (typeof s.id != "undefined" && typeof id != "undefined" && s.id == id) {
                s.url = $(this).attr('href');
                return;
            }
        });
    },
    setImage: function (p, $images) {
        $images.each(function () {
            var id = $(this).text();
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.url = $(this).attr('href');
                return;
            }
        });
    },


    setAudio: function (p, $audios) {
        $audios.each(function () {
            var id = $(this).text();
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.audio = $(this).attr('href');
                return;
            }
        });
    },
    setAudioIdentefy: function (p, $audios) {
        $audios.each(function () {
            var id = $(this).text();
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.question_audio = $(this).attr('href');
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
        })

    },
    setImgMap: function (p, $imgmap) {
        $imgmap.each(function () {
            var id = $(this).text();
            if (typeof p.id != "undefined" && typeof id != "undefined" && p.id == id) {
                p.map.url = $(this).attr('href');
                return;
            }
        })

    },
    save: function () {

        if ($exeDevice.levels.length > 1) {
            $exeDevice.showMessage($exeDevice.msgs.msgCloseMap)
            return false
        }
        if ($exeDevice.slides.length > 0) {
            $exeDevice.showMessage($exeDevice.msgs.msgCloseSlide)
            return false
        }
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid === false) {
            return false;
        }
        $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
        var evaluation = parseInt($('input[name=mpevaluation]:checked').val());
        if (evaluation == 4 && !$exeDevice.validateQuestion()) {
            return false
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
        if (dataGame.instructions != "") divContent = '<div class="mapa-instructions gameQP-instructions">' + dataGame.instructions + '</div>';

        var medias = $exeDevice.saveMedias(dataGame.points)

        medias = medias.maps + medias.images + medias.audios + medias.texts + medias.slides;
        var html = '<div class="mapa-IDevice">';
        html += '<div class="mapa-version js-hidden">' + $exeDevice.version + '</div>';
        html += divContent;
        html += '<div class="mapa-DataGame js-hidden">' + json + '</div>';
        html += '<a href="' + dataGame.url + '" class="js-hidden mapa-ImageMap" />' + dataGame.url + '</a>';
        html += medias;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="mapa-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="mapa-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
        html += '</div>';
        return html;
    },


    saveMedias: function (pts) {
        var medias = {
            'images': '',
            'audios': '',
            'texts': '',
            'maps': '',
            'slides': ''
        }
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            if (p.type != 5) {
                if (p.type == 0 && typeof p.url != "undefined" && !p.url.indexOf('http') == 0 && p.url.length > 4) {
                    medias.images += '<a href="' + p.url + '" class="js-hidden mapa-LinkImagesPoints">' + p.id + '</a>';
                } else if (p.type == 2 && typeof p.eText != "undefined" && p.eText.length > 0) {
                    medias.texts += '<div class="js-hidden mapa-LinkTextsPoints" data-id="' + p.id + '">' + p.eText + '</div>';
                }
                if (p.type != 1 && typeof p.audio != "undefined" && !p.audio.indexOf('http') == 0 && p.audio.length > 4) {
                    medias.audios += '<a href="' + p.audio + '" class="js-hidden mapa-LinkAudiosPoints">' + p.id + '</a>';

                }
                if (p.question_audio != "undefined" && !p.question_audio.indexOf('http') == 0 && p.question_audio.length > 4) {
                    medias.audios += '<a href="' + p.question_audio + '" class="js-hidden mapa-LinkAudiosIdentify">' + p.id + '</a>';

                }
                if (p.type == 6 && typeof p.slides != "undefined" && p.slides.length > 0) {
                    for (var j = 0; j < p.slides.length; j++) {
                        var s = p.slides[j];
                        medias.slides += '<a href="' + s.url + '" class="js-hidden mapa-LinkImagesSlides">' + s.id + '</a>';
                    }
                }

            } else {
                medias.maps += '<a href="' + p.map.url + '" class="js-hidden mapa-LinkImagesMapas">' + p.id + '</a>';
                var rdata = $exeDevice.saveMedias(p.map.pts);
                medias.images += rdata.images;
                medias.audios += rdata.audios;
                medias.maps += rdata.maps;
                medias.texts += rdata.texts;
                medias.slides += rdata.slides;
            }

        }

        return medias
    },
    validateDataLevel: function () {
        var url = $('#mapaURLImageMap').val(),
            author = $('#mapaAuthorImageMap').val(),
            alt = $('#mapaAltImageMap').val()
        if (url.length < 4) {
            $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
            return false;
        }
        var vpp = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (vpp === false) return false;
        $exeDevice.activeMap.url = url;
        $exeDevice.activeMap.author = author;
        $exeDevice.activeMap.alt = alt;
        $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = vpp
        return true
    },
    validatePoint: function (p) {
        var message = '',
            msgs = $exeDevice.msgs,
            url = $('#mapaURLImageMap').val();
        p.title = $('#mapaTitle').val().trim();
        p.type = parseInt($('input[name=mpmediatype]:checked').val());
        p.x = parseFloat($('#mapaX').val());
        p.y = parseFloat($('#mapaY').val());
        p.x1 = parseFloat($('#mapaX1').val());
        p.y1 = parseFloat($('#mapaY1').val());
        p.footer = $('#mapaFooter').val();
        p.author = $('#mapaPAuthorImage').val();
        p.alt = $('#mapaPAltImage').val();
        p.url = $('#mapaURLImage').val().trim();
        p.video = $('#mapaURLYoutube').val().trim();
        p.iVideo = $exeDevice.hourToSeconds($('#mapaPInitVideo').val());
        p.fVideo = $exeDevice.hourToSeconds($('#mapaPEndVideo').val());
        p.audio = $('#mapaURLAudio').val().trim();
        p.iVideo = isNaN(p.iVideo) ? 0 : p.iVideo;
        p.fVideo = isNaN(p.fVideo) ? 3600 : p.fVideo;
        p.iconType = parseInt($('#mapaIconType').children("option:selected").val());
        p.question = $('#mapaIdentify').val();
        p.question_audio = $('#mapaURLAudioIdentify').val();
        if ($("#mapaPContainer").is(":visible")) {
            p.video = $('#mapaPURLYoutube').val().trim();
            p.url = $('#mapaPURLImage').val().trim();
            p.title = $('#mapaPTitle').val().trim();
            p.footer = $('#mapaPFooter').val();
        }
        if (p.fVideo <= p.iVideo) p.fVideo = 36000;
        $exeDevice.stopSound();
        $exeDevice.stopVideo();
        if (url.length < 4) {
            $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
            return false;
        }
        if (p.type == 1) {
            p.video = $exeDevice.getIDYoutube($('#mapaURLYoutube').val().trim()) ? $('#mapaURLYoutube').val() : '';
        }
        p.eText = tinyMCE.get('mapaText').getContent();
        if (p.x == 0 && p.y == 0) {
            message = msgs.msgMarkPoint;
        }
        if (p.iconType == 1 && (p.x1 == p.x && p.y == p.y1)) {
            message = msgs.msgDrawArea;
        } else if (p.title.length == 0) {
            message = $exeDevice.msgs.msgTitle;
        } else if (p.type == 0 && p.url.length < 5) {
            message = msgs.msgEURLValid;
        } else if (p.type == 1 && p.video.length < 5) {
            message = msgs.msgECompleteURLYoutube;
        } else if (p.type == 1 && (p.iVideo.length == 0 || p.fVideo.length == 0)) {
            message = msgs.msgEStartEndVideo;
        } else if (p.type == 1 && p.iVideo >= p.fVideo) {
            message = msgs.msgEStartEndIncorrect;
        } else if (p.type == 2 && p.eText.length == 0) {
            message = msgs.msgWriteText;
        } else if (p.type == 1 && !$exeDevice.validTime($('#mapaPInitVideo').val()) || !$exeDevice.validTime($('#mapaPEndVideo').val())) {
            message = $exeDevice.msgs.msgTimeFormat
        } else if (p.type == 3 && p.audio.length == 0) {
            message = msgs.msgSelectAudio;
        } else if (p.type == 5) {
            message = $exeDevice.validateMap(p.map);
        }
        if (message.length == 0) {
            $exeDevice.updateQuestionsNumber();

            message = p;

        } else {
            $exeDevice.showMessage(message);
            message = false;
        }

        return message;
    },
    validateMap: function (map) {
        var message = '';
        if (typeof map == "undefined" || typeof map.pts == "undefined" || map.pts.length == 0 || map.active >= map.pts.length) {
            return $exeDevice.msgs.msgErrorPointMap + ': ' + $exeDevice.msgs.msgEOnePoint;;
        }
        var p = map.pts[map.active];
        if (map.url.length < 4) {
            message = $exeDevice.msgs.msgEURLValid;
        } else if (p.x == 0 && p.y == 0) {
            message = $exeDevice.msgs.msgMarkPoint;
        } else if (p.iconType == 1 && (p.x1 == p.x && p.y == p.y1)) {
            message = $exeDevice.msgs.msgDrawArea;
        } else if (p.title.length == 0) {
            message = $exeDevice.msgs.msgTitle;
        } else if (p.type == 0 && p.url.length < 5) {
            message = $exeDevice.msgs.msgEURLValid;
        } else if (p.type == 1 && p.video.length < 5) {
            message = $exeDevice.msgs.msgECompleteURLYoutube;
        } else if (p.type == 1 && (p.iVideo.length == 0 || p.fVideo.length == 0)) {
            message = $exeDevice.msgs.msgEStartEndVideo;
        } else if (p.type == 1 && p.iVideo >= p.fVideo) {
            message = $exeDevice.msgs.msgEStartEndIncorrect;
        } else if (p.type == 3 && p.audio.length == 0) {
            message = $exeDevice.msgs.msgSelectAudio;
        } else if (p.type == 2 && p.eText.length == 0) {
            message = $exeDevice.msgs.msgWriteText;
        }
        if (message.length > 0) {
            message = $exeDevice.msgs.msgErrorPointMap + ': ' + message;
        }
        return message
    },
    clearSavePoints: function () {
        for (var i = 0; i < $exeDevice.activeMap.pts.length; i++) {
            var p = $exeDevice.activeMap.pts[i];

           
            
            var id = p.id.substring(1);
            if (p.type == 0) {
                p.video = "";
                p.eText = "";
                p.iVideo = 0;
                p.fVideo = 0;
                p.map = {};
                p.map.id = 'a' + id;
                p.map.pts = [];
                p.map.pts.push($exeDevice.getDefaultPoint())
                p.map.url = "";
                p.map.alt = '';
                p.map.author = '';
                p.map.active = 0;
            } else if (p.type == 1) {
                p.eText = "";
                p.url = "";
                p.author = '';
                p.alt = '';
                p.map = {};
                p.map.id = 'a' + id;
                p.map.pts = [];
                p.map.pts.push($exeDevice.getDefaultPoint())
                p.map.url = "";
                p.map.alt = '';
                p.map.author = '';
                p.map.active = 0;
            } else if (p.type == 2) {
                p.video = ""
                p.url = "";
                p.author = '';
                p.alt = '';
                p.iVideo = 0;
                p.fVideo = 0;
                p.map = {};
                p.map.id = 'a' + id;
                p.map.pts = [];
                p.map.pts.push($exeDevice.getDefaultPoint())
                p.map.url = "";
                p.map.alt = '';
                p.map.author = '';
                p.map.active = 0;
            } else if (p.type == 3 || p.type == 4) {
                p.eText = "";
                p.video = ""
                p.url = "";
                p.author = '';
                p.alt = '';
                p.iVideo = 0;
                p.fVideo = 0;
                p.map = {};
                p.map.id = 'a' + id;
                p.map.pts = [];
                p.map.pts.push($exeDevice.getDefaultPoint())
                p.map.url = "";
                p.map.alt = '';
                p.map.author = '';
                p.map.active = 0;
            } else if (p.type == 5) {
                p.eText = "";
                p.video = ""
                p.author = '';
                p.alt = '';
                p.iVideo = 0;
                p.fVideo = 0;
                p.url = p.map.url;
                for (var j = 0; j < p.map.pts.length; j++) {
                    var q = $exeDevice.activeMap.pts[i];
                    if (q.type == 0) {
                        q.eText = "";
                        q.video = "";
                    } else if (q.type == 1) {
                        q.eText = "";
                        q.url = "";

                    } else if (q.type == 2) {
                        q.video = ""
                        q.url = "";
                    } else if (q.type == 3) {
                        q.eText = "";
                        q.video = ""
                        q.url = "";
                    } else if (q.type == 4) {
                        q.eText = "";
                        q.video = ""
                        q.url = "";
                    }

                }

            }

        }
        return $exeDevice.activeMap.pts;
    },
    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            showMinimize = $('#mapaEShowMinimize').is(':checked'),
            showActiveAreas = $('#mapaEShowActiveAreas').is(':checked'),
            url = $('#mapaURLImageMap').val(),
            authorImage = $('#mapaAuthorImageMap').val(),
            altImage = $('#mapaAltImageMap').val(),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            evaluation = parseInt($('input[name=mpevaluation]:checked').val()),
            showSolution = $('#mapaEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#mapaETimeShowSolution').val())),
            percentajeIdentify = parseInt(clear($('#mapaPercentajeIdentify').val())),
            percentajeShowQ = parseInt(clear($('#mapaPercentajeShowQ').val())),
            percentajeQuestions = parseInt(clear($('#mapaPercentajeQuestions').val()));
        var points = $exeDevice.activeMap.pts;
        if (points.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEOnePoint);
            return false;
        }
        if (url.length < 4) {
            $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
            return false;
        }
        for (var i = 0; i < points.length; i++) {
            var mpoint = points[i];

            if (mpoint.title.length == 0) {
                $exeDevice.showMessage($exeDevice.msgs.msgProvideTitle);
                return false;
            } else if ((mpoint.type == 0) && (mpoint.url.length < 5)) {
                $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                return false;
            } else if ((mpoint.type == 1) && !($exeDevice.getIDYoutube(mpoint.video))) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return false;
            } else if ((mpoint.type == 2) && (mpoint.eText.trim().length == 0)) {
                $exeDevice.showMessage($exeDevice.msgs.msgWriteText);
                return false;
            } else if (mpoint.type == 5) {
                if (mpoint.map.url.length < 4) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                    return false;
                } else if (typeof mpoint.map.pts == "undefided" || mpoint.map.pts.length == 0) {
                    $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
                    return false;
                }
                for (var j = 0; j < mpoint.map.pts.length; j++) {
                    var vpp = mpoint.map.pts[j];
                    if (vpp.title.length == 0) {
                        $exeDevice.showMessage($exeDevice.msgs.msgProvideTitle);
                        return false;
                    } else if ((vpp.type == 0) && (vpp.url.length < 5)) {
                        $exeDevice.showMessage($exeDevice.msgs.msgEURLValid);
                        return false;
                    } else if ((vpp.type == 1) && !($exeDevice.getIDYoutube(vpp.video))) {
                        $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                        return false;
                    } else if ((vpp.type == 2) && (vpp.eText.trim().length == 0)) {
                        $exeDevice.showMessage($exeDevice.msgs.msgWriteText);
                        return false;
                    } else if ((vpp.type == 3) && (vpp.audio.trim().length == 0)) {
                        $exeDevice.showMessage($exeDevice.msgs.msgSelectAudio);
                        return false;
                    } else if (vpp.x == 0 && vpp.y == 0) {
                        $exeDevice.showMessage($exeDevice.msgs.msgMarkPoint);
                    }
                }
            }
        }
        points = $exeDevice.clearSavePoints();
        var scorm = $exeAuthoring.iDevice.gamification.scorm.getValues();
        var data = {
            'typeGame': 'Mapa',
            'instructions': instructions,
            'showMinimize': showMinimize,
            'showActiveAreas': showActiveAreas,
            'author': '',
            'url': url,
            'authorImage': authorImage,
            'altImage': altImage,
            'itinerary': itinerary,
            'points': points,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textAfter': textAfter,
            'evaluation': evaluation,
            'selectsGame': $exeDevice.selectsGame,
            'isNavigable': true,
            'showSolution': showSolution,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'timeShowSolution': timeShowSolution,
            'version': 2,
            'percentajeIdentify': percentajeIdentify,
            'percentajeShowQ': percentajeShowQ,
            'percentajeQuestions': percentajeQuestions,



        }
        return data;
    },
    showImageMap: function (url, x, y, x1, y1, alt, icontype) {
        var $image = $('#mapaImage'),
            $noImage = $('#mapaNoImage'),
            $protector = $('#mapaProtector');
        $image.hide();
        $protector.hide();
        $image.attr('alt', alt);
        $noImage.show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $noImage.hide();
                    if (icontype == 1) {
                        $exeDevice.paintArea(x, y, x1, y1);
                    } else {
                        $exeDevice.paintMouse(x, y);
                    }
                    $protector.css({
                        'left': mData.x + 'px',
                        'top': mData.y + 'px',
                        'width': mData.w + 'px',
                        'height': mData.h + 'px'
                    })
                    $protector.show();
                    return true;
                }
            }).on('error', function () {
                return false;
            });
    },

    showImage: function (url, alt) {
        var $image = $('#mapaPImage'),
            $noImage = $('#mapaPNoImage'),
            $video = $('#mapaPVideo'),
            $noVideo = $('#mapaPNoVideo');
        $video.hide();
        $noVideo.hide();
        $image.hide();
        $image.attr('alt', alt);
        $noImage.show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $noImage.hide();
                    return true;
                }
            }).on('error', function () {
                return false;
            });
    },
    showImageSlide: function (url, alt) {
        var $image = $('#mapaSImage'),
            $noImage = $('#mapaSNoImage');
        $image.hide();
        $image.attr('alt', alt);
        $noImage.show();
        url = $exeDevice.extractURLGD(url);
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $noImage.hide();
                    return true;
                }
            }).on('error', function () {
                return false;
            });
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

    paintMouse: function (x, y) {
        var $image = $('#mapaImage'),
            $cursor = $('#mapaCursor'),
            $area = $('#mapaArea');
        $area.hide();
        if (x > 0 || y > 0) {
            var wI = $image.width() > 0 ? $image.width() : 1,
                hI = $image.height() > 0 ? $image.height() : 1,
                iw = parseInt($('#mapaCursor').width() * $exeDevice.iconX),
                ih = parseInt($('#mapaCursor').height() * $exeDevice.iconY);
            lI = $image.position().left + (wI * x) - iw,
                tI = $image.position().top + (hI * y) - ih;
            $cursor.css({
                left: lI + 'px',
                top: tI + 'px',
                'z-index': 100
            });
            $cursor.show();
        }
    },


    paintArea: function (x, y, x1, y1) {
        var $image = $('#mapaImage'),
            $cursor = $('#mapaCursor'),
            $area = $('#mapaArea');
        $cursor.hide();
        $area.hide();
        var wI = $image.width() > 0 ? $image.width() : 1,
            hI = $image.height() > 0 ? $image.height() : 1,
            px = x >= x1 ? x1 : x,
            py = y >= y1 ? y1 : y,
            w = Math.abs(x1 - x) * wI,
            h = Math.abs(y1 - y) * hI,
            lI = $image.position().left + (wI * px),
            tI = $image.position().top + (hI * py)
        $area.css({
            left: lI + 'px',
            top: tI + 'px',
            width: w + 'px',
            height: h + 'px',
            'z-index': 99
        });
        $area.show();
    },

    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
        $(image).show();
    },


    addEvents: function () {
        $('#mapaPInitVideo, #mapaPEndVideo').on('focusout', function () {
            if (!$exeDevice.validTime(this.value)) {
                $(this).css({
                    'background-color': 'red',
                    'color': 'white'
                });
            }
        });
        $('#mapaPInitVideo, #mapaPEndVideo').on('click', function () {
            $(this).css({
                'background-color': 'white',
                'color': '#2c6d2c',
            });

        });
        $('.MQE-ESolution').on('change', function (e) {
            var marcado = $(this).is(':checked'),
                value = $(this).val();
            $exeDevice.clickSolution(marcado, value);
        });
        $('#gameQEIdeviceForm').on('click', 'input.MQE-Type', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.changeTypePoint(type);
        });

        $('#mapaEAdd').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addPoint()
        });
        $('#mapaEFirst').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstPoint()
        });
        $('#mapaEPrevious').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousPoint()
        });
        $('#mapaENext').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextPoint()
        });
        $('#mapaELast').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastPoint()
        });
        $('#mapaEDelete').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removePoint()
        });
        $('#mapaECopy').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyPoint()
        });
        $('#mapaECut').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutPoint()
        });
        $('#mapaEPaste').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pastePoint()
        });


        $('#mapaEAddSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addSlide()
        });
        $('#mapaEFirstSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstSlide()
        });
        $('#mapaEPreviousSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousSlide()
        });
        $('#mapaENextSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextSlide()
        });
        $('#mapaELastSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastSlide()
        });
        $('#mapaEDeleteSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeSlide()
        });
        $('#mapaECopySlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copySlide()
        });
        $('#mapaECutSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutSlide()
        });
        $('#mapaEPasteSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteSlide()
        });

        $('#mapaEAddQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addQuestion()
        });
        $('#mapaEFirstQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstQuestion()
        });
        $('#mapaEPreviousQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousQuestion()
        });
        $('#mapaENextQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextQuestion()
        });
        $('#mapaELastQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastQuestion()
        });
        $('#mapaEDeleteQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeQuestion()
        });
        $('#mapaECopyQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyQuestion()
        });
        $('#mapaECutQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutQuestion()
        });
        $('#mapaEPasteQ').on('click', function (e) {
            e.preventDefault();
            $exeDevice.pasteQuestion()
        });
        $('#mapaETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#mapaETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#mapaPercentageShow').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#mapaPercentageShow').on('focusout', function () {
            this.value = this.value.trim() == '' ? 35 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        $('#mapaPercentajeIdentify').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateQuestionsNumber();
            }
        });
        $('#mapaPercentajeIdentify').on('click', function () {
            $exeDevice.updateQuestionsNumber();
        });
        $('#mapaPercentajeIdentify').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateQuestionsNumber();
        });

        $('#mapaPercentajeShowQ').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateShowQ();
            }
        });
        $('#mapaPercentajeShowQ').on('click', function () {
            $exeDevice.updateShowQ();
        });
        $('#mapaPercentajeShowQ').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateShowQ();
        })

        $('#mapaPercentajeQuestions').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateNumberQuestions();
            }
        });
        $('#mapaPercentajeQuestions').on('click', function () {
            $exeDevice.updateNumberQuestions();
        });
        $('#mapaPercentajeQuestions').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateNumberQuestions();
        })
        $('#mapaPInitVideo').css('color', '#2c6d2c');
        $('#mapaPInitVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 0;
            $('#mapaPInitVideo').css('color', '#2c6d2c');
            $('#mapaPEndVideo').css('color', '#333');
        });
        $('#mapaPEndVideo').on('click', function (e) {
            e.preventDefault();
            $exeDevice.timeVideoFocus = 1;
            $('#mapaPEndVideo').css('color', '#2c6d2c');
        });
        $('#mapaPVideoTime').on('click', function (e) {
            e.preventDefault();
            var $timeV = '';
            switch ($exeDevice.timeVideoFocus) {
                case 0:
                    $timeV = $('#mapaPInitVideo');
                    break;
                case 1:
                    $timeV = $('#mapaPEndVideo');
                    break;
                default:
                    break;
            }
            $timeV.val($('#mapaPVideoTime').text());
            $timeV.css({
                'background-color': 'white',
                'color': '#2c6d2c'
            });
        });
        $('#mapaURLImageMap').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#mapaAltImageMap').val(),
                x = parseFloat($('#mapaX').val()),
                y = parseFloat($('#mapaY').val()),
                x1 = parseFloat($('#mapaX').val()),
                y1 = parseFloat($('#mapaY').val()),
                icon = parseInt($('#mapaIconType').children("option:selected").val());
            $exeDevice.showImageMap(url, x, y, x1, y1, alt, icon);
        });
        $('#mapaShowImageMap').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#mapaURLImageMap').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if (selectedFile.length < 5) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            }
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#mapaAltImageMap').val(),
                x = parseFloat($('#mapaX').val()),
                y = parseFloat($('#mapaY').val()),
                x1 = parseFloat($('#mapaX').val()),
                y1 = parseFloat($('#mapaY').val()),
                icon = parseInt($('#mapaIconType').children("option:selected").val());
            $exeDevice.showImageMap(url, x, y, x1, y1, alt, icon);
        });
        $('#mapaShowImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#mapaURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if (selectedFile.length < 5) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            }
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#mapaAltImageMap').val();
            $exeDevice.showImage(url, alt);
            $('#mapaMultimediaPoint').fadeIn();
        });

        $('#mapaSShowImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#mapaSURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if (selectedFile.length < 5) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            }
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var url = selectedFile,
                alt = $('#mapaSAltImage').val();
            $exeDevice.showImageSlide(url, alt);
        });

        $('#mapaSURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var alt = $('#mapaSAltImage').val();
            $exeDevice.showImageSlide(selectedFile, alt);
        });

        $('#mapaMultimediaPoint').on('click', function (e) {
            $(this).fadeOut();
        });
        $('#gameQEIdeviceForm').on('click', 'input.MQE-Number', function (e) {
            var number = parseInt($(this).val());
            $exeDevice.showOptions(number);
        });
        $('#mapaMoreImageMap').on('click', function (e) {
            e.preventDefault()
            $('#mapaMoreImage').slideToggle();
        });
        $('#mapaIdentifyMoreAudio').on('click', function (e) {
            e.preventDefault()
            $('#mapaDataIdentifyAudio').slideToggle();
        });
        $('#mapaProtector').on('mousedown', function (e) {
            var iconType = parseInt($('#mapaIconType').children("option:selected").val()),
                evaluation = evaluation = parseInt($('input[name=mpevaluation]:checked').val());
            if (iconType == 1 && evaluation != 1) {
                $exeDevice.xA = e.pageX;
                $exeDevice.yA = e.pageY;
            } else {
                $exeDevice.clickImage(this, e.pageX, e.pageY);
            }
        });
        $('#mapaProtector').on('mouseup', function (e) {
            var iconType = parseInt($('#mapaIconType').children("option:selected").val()),
                evaluation = evaluation = parseInt($('input[name=mpevaluation]:checked').val());

            if (iconType == 1 && evaluation != 1) {
                $exeDevice.clickArea($exeDevice.xA, $exeDevice.yA, e.pageX, e.pageY)
                $exeDevice.xA = 0;
                $exeDevice.yA = 0
            }
        });
        $('#mapaNumberPoint').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    num = num < $exeDevice.activeMap.pts.length ? num - 1 : $exeDevice.activeMap.pts.length - 1
                    if ($exeDevice.validatePoint($exeDevice.activeMap.pts[num]) !== false) {
                        $exeDevice.activeMap.active = num;
                        $exeDevice.showPoint($exeDevice.activeMap.active);

                    } else {
                        $(this).val($exeDevice.activeMap.active + 1)
                    }
                } else {
                    $(this).val($exeDevice.activeMap.active + 1)
                }
            }
        });
        $('#gameQEIdeviceForm').on('click', 'input.MQE-TypeSelect', function (e) {
            var type = parseInt($(this).val());
            $exeDevice.showTypeQuestion(type);
        });
        $('#gameQEIdeviceForm').on('click', 'input.MQE-TypeEvaluation', function (e) {

            var type = parseInt($(this).val());
            $('#mapaSolutionData').show();
            if (type == 4) {
                $('#mapaFQuestions').show();
                $('#mapaEvaluationData').show();
                $('#mapaEShowSolution').show();
                $('label[for=mapaEShowSolution]').show();
                $('#mapaETimeShowSolution').prop("disabled", !$('#mapaEShowSolution').is(':checked'));
            } else {
                $('#mapaFQuestions').hide();
                $('#mapaEvaluationData').hide();
                $('#mapaEShowSolution').hide();
                $('label[for=mapaEShowSolution]').hide();
                $('#mapaETimeShowSolution').prop("disabled", false);
            }
            if (type == 1 || type == 2 || type == 3) {
                $('#mapaDataIdentifica').show();

            } else {
                $('#mapaDataIdentifica').hide();
            }
            $('#mapaIconTypeDiv').show();
            if (type == 1) {
                $('#mapaIconTypeDiv').hide();
            }
            $('#mapaEvaluationIdentify').hide();
            if (type == 2 || type == 3) {
                $('#mapaEvaluationIdentify').show();
            }
            if (type == 0) {
                $('#mapaSolutionData').hide();
            }
            $exeDevice.loadIcon();

        });
        $('#mapaURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var alt = $('#mapaPAltImage').val();
            $('#mapaPURLImage').val(selectedFile);
            $('#mapaPTitle').val($('#mapaTitle').val());
            $('#mapaPFooter').val($('#mapaFooter').val());
            $('#mapaPContainer').fadeIn();
            $('#mapaCubierta').show();
            $exeDevice.showImage(selectedFile, alt);
        });

        $('#mapaPURLImage').on('change', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var alt = $('#mapaPAltImage').val();
            $('#mapaURLImage').val(selectedFile);
            $('#mapaTitle').val($('#mapaPTitle').val());
            $('#mapaFooter').val($('#mapaPFooter').val());
            $exeDevice.showImage(selectedFile, alt);
        });

        $('#mapaEShowSolution').on('change', function () {
            var checked = $(this).is(':checked');
            $('#mapaETimeShowSolution').prop('disabled', !checked)
        });
        $('#mapaShowImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#mapaURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if (selectedFile.length < 5) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            }
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var alt = $('#mapaPAltImage').val();
            $('#mapaPContainer').fadeIn();
            $('#mapaCubierta').show();
            $('#mapaPURLImage').val(selectedFile);
            $('#mapaPTitle').val($('#mapaTitle').val());
            $('#mapaPFooter').val($('#mapaFooter').val());
            $exeDevice.showImage(selectedFile, alt);
        });
        $('#mapaPShowImage').on('click', function (e) {
            e.preventDefault();
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $('#mapaPURLImage').val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if (selectedFile.length < 5) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            }
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var alt = $('#mapaPAltImage').val();
            $('#mapaURLImage').val(selectedFile);
            $('#mapaTitle').val($('#mapaPTitle').val());
            $('#mapaFooter').val($('#mapaPFooter').val());
            $exeDevice.showImage(selectedFile, alt);
        });
        $('#mapaPClose').on('click', function (e) {
            e.preventDefault();
            $('#mapaURLImage').val($('#mapaPURLImage').val());
            $('#mapaTitle').val($('#mapaPTitle').val());
            $('#mapaFooter').val($('#mapaPFooter').val());
            $('#mapaURLYoutube').val($('#mapaPURLYoutube').val());
            $exeDevice.stopVideo();
            $exeDevice.stopSound();
            $('#mapaPContainer').fadeOut();
            $('#mapaCubierta').hide();
        });


        $('#mapaPlayVideo').on('click', function (e) {
            e.preventDefault();
            if (!$exeDevice.getIDYoutube($('#mapaURLYoutube').val().trim())) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            $('#mapaPURLYoutube').val($('#mapaURLYoutube').val());
            if (typeof YT == "undefined") {
                $exeDevice.isVideoType = true;
                $exeDevice.loadYoutubeApi();
            } else {
                $exeDevice.showVideoPoint();
            }
            $('#mapaPTitle').val($('#mapaTitle').val());
            $('#mapaPFooter').val($('#mapaFooter').val());
        });
        $('#mapaPPlayVideo').on('click', function (e) {
            e.preventDefault();
            if (!$exeDevice.getIDYoutube($('#mapaPURLYoutube').val().trim())) {
                $exeDevice.showMessage($exeDevice.msgs.msgECompleteURLYoutube);
                return;
            }
            $('#mapaURLYoutube').val($('#mapaPURLYoutube').val());
            if (typeof YT == "undefined") {
                $exeDevice.isVideoType = true;
                $exeDevice.loadYoutubeApi();
            } else {
                $exeDevice.showVideoPoint();
            }
            $('#mapaURLYoutube').val($('#mapaPURLYoutube').val());
            $('#mapaTitle').val($('#mapaPTitle').val());
            $('#mapaFooter').val($('#mapaPFooter').val());

        });
        $('#mapaEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#mapaURLAudio').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });
        $('#mapaURLAudio').on('change', function () {
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

        $('#mapaPlayAudioIdentify').on('click', function (e) {
            e.preventDefault();
            var selectedFile = $('#mapaURLAudioIdentify').val().trim();
            if (selectedFile.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(selectedFile);
            }
        });
        $('#mapaURLAudioIdentify').on('change', function () {
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


        $('#mapaIconType').on('change', function () {
            $exeDevice.loadIcon();
        });

        $('#mapaCloseLevel').on('click', function (e) {
            e.preventDefault();
            $exeDevice.closeLevel();
        });

        $('#mapaEditPointsMap').on('click', function (e) {
            e.preventDefault();
            $exeDevice.addLevel();
        });

        $('#mapaEditSlide').on('click', function (e) {
            e.preventDefault();
            $exeDevice.showSlides();
        });

        $('#mapaSClose').on('click', function (e) {
            e.preventDefault();
            $exeDevice.closeSlide();
        });
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();

    },
    showSlides: function () {
        var slide = $exeDevice.getDefaultSlide();
        $exeDevice.slides = $.extend(true, {}, $exeDevice.activeMap.pts[$exeDevice.activeMap.active].slides);
        $exeDevice.slides = Object.values($exeDevice.slides) || [];
        $exeDevice.activeSlide = $exeDevice.activeMap.pts[$exeDevice.activeMap.active].activeSlide;
        if ($exeDevice.slides.length == 0) {
            $exeDevice.slides.push(slide);
            $exeDevice.activeSlide = 0;
        }
        $exeDevice.showSlide($exeDevice.activeSlide);

    },

    showSlide: function (i) {
        $exeDevice.activeSlide = i;
        $('#mapaSTitle').val($exeDevice.slides[i].title);
        $('#mapaSURLImage').val($exeDevice.slides[i].url);
        $('#mapaSAuthorImage').val($exeDevice.slides[i].author);
        $('#mapaSAltImage').val($exeDevice.slides[i].alt);
        $('#mapaSFooter').val($exeDevice.slides[i].footer);
        $('#mapaNumberSlide').val(i + 1);
        $('#mapaCubierta').show();
        $('#mapaSContainer').fadeIn();
        $exeDevice.showImageSlide($('#mapaSURLImage').val(), $('#mapaSAltImage').val());
        $exeDevice.stopSound();
        $exeDevice.stopVideo();
    },


    closeSlide: function () {

        Ext.MessageBox.confirm(_('Close presentation'), _('Do you want to save the changes of this presentation?'), callbackFunction);

        function callbackFunction(btn) {
            if (btn == 'yes') {
                if (!$exeDevice.validateSlide()) {
                    return
                }
                $exeDevice.activeMap.pts[$exeDevice.activeMap.active].slides = Object.values($.extend(true, {}, $exeDevice.slides));
                $exeDevice.slides = [];
                $exeDevice.activeSlide = 0;
                $('#mapaSContainer').fadeOut();
                $('#mapaCubierta').fadeOut();
            } else {
                $exeDevice.slides = [];
                $exeDevice.activeSlide = 0;
                $('#mapaSContainer').fadeOut();
                $('#mapaCubierta').fadeOut();
            }
        };

    },
    validateSlide: function () {
        var msg = '';
        if ($('#mapaSTitle').val().trim().length == 0) {
            msg = $exeDevice.msgs.msgTitle;
        } else if ($('#mapaSURLImage').val().trim().length < 4) {
            msg = $exeDevice.msgs.msgEURLValid;
        }
        if (msg.length > 0) {
            $exeDevice.showMessage(msg)
        } else {
            var slide = $exeDevice.slides[$exeDevice.activeSlide];
            slide.title = $('#mapaSTitle').val();
            slide.url = $('#mapaSURLImage').val();
            slide.author = $('#mapaSAuthorImage').val();
            slide.alt = $('#mapaSAltImage').val();
            slide.footer = $('#mapaSFooter').val();
        }
        return msg == '';

    },


    updateQuestionsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#mapaPercentajeIdentify').val()));
        if (isNaN(percentaje)) {
            return;
        }
        var pts = $exeDevice.activeMap.pts;
        if ($exeDevice.levels.length > 1) {
            pts = $exeDevice.levels[0].pts;
        }
        var nq = $exeDevice.getNumberIdentify(pts)
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * nq) / 100);
        num = num == 0 ? 1 : num;
        $('#mapaNumberPercentaje').text(num + "/" + nq);
        $exeDevice.updateShowQ();
    },

    updateShowQ: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#mapaPercentajeShowQ').val()));
        if (isNaN(percentaje)) {
            return;
        }
        var pts = $exeDevice.activeMap.pts;
        if ($exeDevice.levels.length > 1) {
            pts = $exeDevice.levels[0].pts;
        }
        var nq = $exeDevice.getNumberIdentify(pts)
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * nq) / 100);
        num = num == 0 ? 1 : num;
        $('#mapaPShowQuestions').text(num + "/" + nq);
    },

    updateNumberQuestions: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#mapaPercentajeQuestions').val())),
            nq = $exeDevice.selectsGame.length;
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * nq) / 100);
        num = num == 0 ? 1 : num;
        $('#mapaNumberQuestions').text(num + "/" + nq);
    },

    getIconType: function () {
        var html = '<div class="MQE-IconType" id="mapaIconTypeDiv">\
            <label for="mapaIconType">' + _('Icon') + ': </label>\
            <select name="mapaIconType" id="mapaIconType">\
            <option value="1">' + _('Invisible area') + '</option>\
            <option value="0" selected>' + _('Magnifying glass') + '</option>\
            <option value="7">' + _('Map marker') + '</option>\
            <option value="2">' + _('Audio') + '</option>\
            <option value="3">' + _('Image') + '</option>\
            <option value="4">' + _('Text') + '</option>\
            <option value="5">' + _('Video') + '</option>\
            <option value="6">' + _('Presentation') + '</option>\
            <option value="8">' + _('Pushpin') + ' 1</option>\
            <option value="9">' + _('Pushpin') + ' 2</option>\
            <option value="10">' + _('Pushpin') + ' 3</option>\
            <option value="11">' + _('Arrow') + ' 1</option>\
            <option value="12">' + _('Arrow') + ' 2</option>\
            <option value="13">' + _('Arrow') + ' 3</option>\
            <option value="14">' + _('Arrow') + ' 4</option>\
            <option value="15">' + _('Arrow') + ' 5</option>\
            <option value="16">' + _('Arrow') + ' 6</option>\
            <option value="17">' + _('Arrow') + ' 7</option>\
            <option value="18">' + _('Arrow') + ' 8</option>\
            <option value="19">' + _('Point') + '</option>\
            <option value="20">' + _('Magnifying glass') + '</option>\
            <option value="27">' + _('Map marker') + '</option>\
            <option value="22">' + _('Audio') + '</option>\
            <option value="23">' + _('Image') + '</option>\
            <option value="24">' + _('Text') + '</option>\
            <option value="25">' + _('Video') + '</option>\
            <option value="26">' + _('Presentation') + '</option>\
            <option value="28">' + _('Pushpin') + ' 1</option>\
            <option value="29">' + _('Pushpin') + ' 2</option>\
            <option value="30">' + _('Pushpin') + ' 3</option>\
            <option value="31">' + _('Arrow') + ' 1</option>\
            <option value="32">' + _('Arrow') + ' 2</option>\
            <option value="33">' + _('Arrow') + ' 3</option>\
            <option value="34">' + _('Arrow') + ' 4</option>\
            <option value="35">' + _('Arrow') + ' 5</option>\
            <option value="36">' + _('Arrow') + ' 6</option>\
            <option value="37">' + _('Arrow') + ' 7</option>\
            <option value="38">' + _('Arrow') + ' 8</option>\
            <option value="40">' + _('Magnifying glass') + '</option>\
            <option value="47">' + _('Map marker') + '</option>\
            <option value="42">' + _('Audio') + '</option>\
            <option value="43">' + _('Image') + '</option>\
            <option value="44">' + _('Text') + '</option>\
            <option value="45">' + _('Video') + '</option>\
            <option value="46">' + _('Presentation') + '</option>\
            <option value="48">' + _('Pushpin') + ' 1</option>\
            <option value="49">' + _('Pushpin') + ' 2</option>\
            <option value="50">' + _('Pushpin') + ' 3</option>\
            <option value="51">' + _('Arrow') + ' 1</option>\
            <option value="52">' + _('Arrow') + ' 2</option>\
            <option value="53">' + _('Arrow') + ' 3</option>\
            <option value="54">' + _('Arrow') + ' 4</option>\
            <option value="55">' + _('Arrow') + ' 5</option>\
            <option value="56">' + _('Arrow') + ' 6</option>\
            <option value="57">' + _('Arrow') + ' 7</option>\
            <option value="58">' + _('Arrow') + ' 8</option>\
            <option value="60">' + _('Magnifying glass') + '</option>\
            <option value="67">' + _('Map marker') + '</option>\
            <option value="62">' + _('Audio') + '</option>\
            <option value="63">' + _('Image') + '</option>\
            <option value="64">' + _('Text') + '</option>\
            <option value="65">' + _('Video') + '</option>\
            <option value="66">' + _('Presentation') + '</option>\
            <option value="68">' + _('Pushpin') + ' 1</option>\
            <option value="69">' + _('Pushpin') + ' 2</option>\
            <option value="70">' + _('Pushpin') + ' 3</option>\
            <option value="71">' + _('Arrow') + ' 1</option>\
            <option value="72">' + _('Arrow') + ' 2</option>\
            <option value="73">' + _('Arrow') + ' 3</option>\
            <option value="74">' + _('Arrow') + ' 4</option>\
            <option value="75">' + _('Arrow') + ' 5</option>\
            <option value="76">' + _('Arrow') + ' 6</option>\
            <option value="77">' + _('Arrow') + ' 7</option>\
            <option value="78">' + _('Arrow') + ' 8</option>\
            </select>\
            <span class="MQE-EIconPoint" id="mapaIconPoint"></span>\
        </div>';
        return html;
    },

    loadIcon: function () {
        var icon = parseInt($('#mapaIconType').children("option:selected").val()),
            x = parseFloat($('#mapaX').val()),
            y = parseFloat($('#mapaY').val()),
            x1 = parseFloat($('#mapaX1').val()),
            y1 = parseFloat($('#mapaY1').val());
        $exeDevice.changeIcon(icon, x, y, x1, y1);
    },

    changeIcon: function (icon, x, y, x1, y1) {
        var evaluation = parseInt($('input[name=mpevaluation]:checked').val());
        $('#mapaCursor').hide();
        $('#mapaArea').hide();
        var mI = (icon == 19 || icon == 39 || icon == 59 || icon == 79) ? $exeDevice.iDevicePath + 'mapam' + icon + '.png' : $exeDevice.iDevicePath + 'mapam' + icon + '.svg';
        if (evaluation == 1) {
            mI = $exeDevice.iDevicePath + 'mapam19.png';
            icon = 19;
        }
        var icon1 = 'url(' + mI + ')';
        $('#mapaIconPoint').css({
            'background-image': icon1
        });
        $('#mapaCursor').css({
            'background-image': icon1
        });
        var c = [0, 1, 2, 3, 4, 5, 6, 10, 19, 20, 21, 22, 23, 24, 25, 26, 30, 39, 40, 41, 42, 43, 44, 45, 46, 50, 59, 60, 61, 62, 63, 64, 65, 66, 70, 79],
            uc = [18, 38, 58, 78],
            dc = [7, 9, 15, 27, 29, 35, 47, 49, 55, 67, 69, 75],
            lu = [11, 31, 51, 71],
            lc = [16, 36, 56, 76],
            ld = [8, 14, 28, 34, 48, 54, 68, 74],
            ru = [12, 32, 52, 72],
            rc = [17, 37, 57, 77],
            rd = [13, 33, 53, 73];

        $exeDevice.iconX = 0.5;
        $exeDevice.iconY = 0.5;

        if (c.indexOf(icon) != -1) {
            $exeDevice.iconX = 0.5;
            $exeDevice.iconY = 0.5;

        } else if (uc.indexOf(icon) != -1) {
            $exeDevice.iconX = 0.5;
            $exeDevice.iconY = 0;

        } else if (dc.indexOf(icon) != -1) {
            $exeDevice.iconX = 0.5;
            $exeDevice.iconY = 1;

        } else if (lu.indexOf(icon) != -1) {
            $exeDevice.iconX = 0;
            $exeDevice.iconY = 0;

        } else if (lc.indexOf(icon) != -1) {
            $exeDevice.iconX = 0;
            $exeDevice.iconY = 0.5;

        } else if (ld.indexOf(icon) != -1) {
            $exeDevice.iconX = 0;
            $exeDevice.iconY = 1;

        } else if (ru.indexOf(icon) != -1) {
            $exeDevice.iconX = 1;
            $exeDevice.iconY = 0;

        } else if (rc.indexOf(icon) != -1) {
            $exeDevice.iconX = 1;
            $exeDevice.iconY = 0.5;

        } else if (rd.indexOf(icon) != -1) {
            $exeDevice.iconX = 1;
            $exeDevice.iconY = 1;
        }

        if (x > 0 || y > 0) {
            if (icon == 1 && evaluation != 1) {
                $exeDevice.paintArea(x, y, x1, y1);

            } else {
                $exeDevice.paintMouse(x, y);
            }
        }
    },


    clickSolution: function (checked, value) {
        var solutions = $('#mapaESolutionSelect').text();

        if (checked) {
            if (solutions.indexOf(value) == -1) {
                solutions += value;
            }
        } else {
            solutions = solutions.split(value).join('')
        }
        $('#mapaESolutionSelect').text(solutions);
    },
    addQuestion: function () {
        if ($exeDevice.validateQuestion() !== false) {
            $exeDevice.clearQuestion();
            $exeDevice.selectsGame.push($exeDevice.getDefaultQuestion());
            $exeDevice.qActive = $exeDevice.selectsGame.length - 1;
            $exeDevice.typeEdit = -1;
            $('#mapaEPasteQ').hide();
            $('#mapaENumQuestionsQ').text($exeDevice.selectsGame.length);
            $('#mapaENumberQuestionQ').val($exeDevice.selectsGame.length);
            $exeDevice.updateNumberQuestions();
        }
    },
    getDefaultQuestion: function () {
        var p = new Object();
        p.typeSelect = 0;
        p.numberOptions = 4;
        p.quextion = '';
        p.options = [];
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.options.push('');
        p.solution = '';
        p.solutionWord = '';
        p.percentageShow = 35;
        p.msgError = '';
        p.msgHit = '';
        return p;
    },
    removeQuestion: function () {
        if ($exeDevice.selectsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneQuestion);
            return;
        } else {
            $exeDevice.selectsGame.splice($exeDevice.qActive, 1);
            if ($exeDevice.qActive >= $exeDevice.selectsGame.length - 1) {
                $exeDevice.qActive = $exeDevice.selectsGame.length - 1;
            }
            $exeDevice.showQuestion($exeDevice.qActive);
            $exeDevice.typeEdit = -1;
            $('#mapaEPasteQ').hide();
            $('#mapaENumQuestionsQ').text($exeDevice.selectsGame.length);
            $('#mapaENumberQuestionQ').val($exeDevice.qActive + 1);
            $exeDevice.updateNumberQuestions();
        }
    },
    copyQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            $exeDevice.qTypeEdit = 0;
            $exeDevice.qClipBoard = $exeDevice.selectsGame[$exeDevice.qActive];
            $('#mapaEPasteQ').show();
        }
    },
    cutQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            $exeDevice.numberCutCuestion = $exeDevice.qActive;
            $exeDevice.qTypeEdit = 1;
            $('#mapaEPasteQ').show();
            $exeDevice.updateNumberQuestions();
        }
    },
    pasteQuestion: function () {
        if ($exeDevice.qTypeEdit == 0) {
            $exeDevice.qActive++;
            $exeDevice.selectsGame.splice($exeDevice.qActive, 0, $exeDevice.qClipBoard);
            $exeDevice.showQuestion($exeDevice.qActive);
        } else if ($exeDevice.qTypeEdit == 1) {
            $('#mapaEPasteQ').hide();
            $exeDevice.qTypeEdit = -1;
            $exeDevice.arrayMove($exeDevice.selectsGame, $exeDevice.numberCutCuestion, $exeDevice.qActive);
            $exeDevice.showQuestion($exeDevice.qActive);
            $('#mapaENumQuestionsQ').text($exeDevice.selectsGame.length);
        }
    },
    nextQuestion: function () {

        if ($exeDevice.validateQuestion()) {
            if ($exeDevice.qActive < $exeDevice.selectsGame.length - 1) {
                $exeDevice.qActive++;
                $exeDevice.showQuestion($exeDevice.qActive);
            }
        }
    },
    lastQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            if ($exeDevice.qActive < $exeDevice.selectsGame.length - 1) {
                $exeDevice.qActive = $exeDevice.selectsGame.length - 1;
                $exeDevice.showQuestion($exeDevice.qActive);
            }
        }
    },
    previousQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            if ($exeDevice.qActive > 0) {
                $exeDevice.qActive--;
                $exeDevice.showQuestion($exeDevice.qActive);
            }
        }
    },
    firstQuestion: function () {
        if ($exeDevice.validateQuestion()) {
            if ($exeDevice.qActive > 0) {
                $exeDevice.qActive = 0;
                $exeDevice.showQuestion($exeDevice.qActive);
            }
        }
    },
    validateQuestion: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        p.type = 0;
        p.time = parseInt($('input[name=mptime]:checked').val());
        p.numberOptions = parseInt($('input[name=mpnumber]:checked').val());
        p.typeSelect = parseInt($('input[name=mptypeselect]:checked').val())
        p.customScore = parseFloat($('#mapaEScoreQuestion').val());
        p.msgHit = $('#mapaEMessageOK').val();
        p.msgError = $('#mapaEMessageKO').val();
        p.quextion = $('#mapaEQuestion').val().trim();
        p.options = [];
        p.solution = $('#mapaESolutionSelect').text().trim();
        p.percentageShow = parseInt($('#mapaPercentageShow').val());
        p.solutionQuestion = "";
        if (p.typeSelect == 2) {
            p.quextion = $('#mapaEDefinitionWord').val().trim();
            p.solution = "";
            p.solutionQuestion = $('#mapaESolutionWord').val();
        }
        var optionEmpy = false;
        $('.MQE-EAnwersOptions').each(function (i) {
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
        } else if (p.typeSelect == 2 && p.solutionQuestion.trim().length == 0) {
            message = $exeDevice.msgs.msgEProvideWord;
        } else if (p.typeSelect == 2 && p.quextion.trim().length == 0) {
            message = $exeDevice.msgs.msgEDefintion;
        }
        if (message.length == 0) {
            $exeDevice.selectsGame[$exeDevice.qActive] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;

    },
    showOptions: function (number) {
        $('.MQE-EOptionDiv').each(function (i) {
            $(this).css('display', 'flex')
            $(this).show();
            if (i >= number) {
                $(this).hide();
                $exeDevice.showSolution('');
            }
        });
        $('.MQE-EAnwersOptions').each(function (j) {
            if (j >= number) {
                $(this).val('');
            }
        });
    },
    showSolution: function (solution) {
        $("input.MQE-ESolution[name='mpsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $('.MQE-ESolution')[solution].checked = true;
            $("input.MQE-ESolution[name='mpsolution'][value='" + sol + "']").prop("checked", true)
        }
        $('#mapaESolutionSelect').text(solution);
    },
    clearQuestion: function () {
        $exeDevice.showOptions(4);
        $exeDevice.showSolution('');
        $("input.MQE-ESolution[name='mpsolution']").prop("checked", false);
        $('#mapaESolutionSelect').text('');
        $('#mapaEQuestion').val('');
        $('#mapaESolutionWord').val('');
        $('#mapaEDefinitionWord').val('');
        $('.MQE-EAnwersOptions').each(function () {
            $(this).val('');
        });
        $('#mapaEMessageOK').val('');
        $('#mapaEMessageKO').val('');
    },
    showQuestion: function (i) {
        $exeDevice.clearQuestion();
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.selectsGame.length ? $exeDevice.selectsGame.length - 1 : num;
        var p = $exeDevice.selectsGame[num],
            numOptions = 0;
        if (p.typeSelect != 2) {
            $('.MQE-EAnwersOptions').each(function (j) {
                numOptions++;
                if (p.options[j].trim() !== '') {
                    p.numOptions = numOptions;
                }
                $(this).val(p.options[j]);
            });
        } else {
            $('#mapaESolutionWord').val(p.solutionQuestion);
            $('#mapaEDefinitionWord').val(p.quextion);
            $('#mapaPercentageShow').val(p.percentageShow);
        }
        $exeDevice.showTypeQuestion(p.typeSelect);
        $exeDevice.showOptions(p.numberOptions);
        $('#mapaEQuestion').val(p.quextion);
        $('#mapaENumQuestions').text($exeDevice.selectsGame.length);
        $('.MQE-EAnwersOptions').each(function (j) {
            var option = j < p.numOptions ? p.options[j] : '';
            $(this).val(option);
        });
        $('#mapaEMessageOK').val(p.msgHit);
        $('#mapaEMessageKO').val(p.msgError);
        $('#mapaENumberQuestion').val(i + 1);
        $('#mapaEScoreQuestion').val(1);
        $("input.MQE-Number[name='mpnumber'][value='" + p.numberOptions + "']").prop("checked", true)
        $exeDevice.checkQuestions(p.solution);
        $("input.MQE-Times[name='mptime'][value='" + p.time + "']").prop("checked", true);
        $("input.MQE-TypeSelect[name='mptypeselect'][value='" + p.typeSelect + "']").prop("checked", true);
        $('#mapaENumberQuestionQ').val($exeDevice.qActive + 1);
    },
    checkQuestions: function (solution) {
        $("input.MQE-ESolution[name='mpsolution']").prop("checked", false);
        for (var i = 0; i < solution.length; i++) {
            var sol = solution[i];
            $("input.MQE-ESolution[name='mpsolution'][value='" + sol + "']").prop("checked", true);
        }
        $('#mapaESolutionSelect').text(solution);

    },
    showTypeQuestion: function (type) {
        if (type == 2) {
            $('#mapaEAnswers').hide();
            $('#mapaEQuestionDiv').hide();
            $('#gameQEIdeviceForm .MQE-ESolutionSelect').hide();
            $('#mapaEWordDiv').show();
            $('#mapaOptionsNumberA').hide();
            $('#mapaESolitionOptions').hide();
            $('#mapaPercentageLetters').show();
        } else {
            $('#mapaEAnswers').css('display', 'flex');
            $('#mapaEAnswers').show();
            $('#mapaEQuestionDiv').show();
            $('#gameQEIdeviceForm .MQE-ESolutionSelect').show();
            $('#mapaEWordDiv').hide();
            $('#mapaPercentageLetters').hide();
            $('#mapaESolitionOptions').show();
            $('#mapaOptionsNumberA').show();
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
    showVideoPoint: function () {
        var iVideo = $exeDevice.hourToSeconds($('#mapaPInitVideo').val()),
            fVideo = $exeDevice.hourToSeconds($('#mapaPEndVideo').val()),
            url = $('#mapaPURLYoutube').val().trim(),
            id = $exeDevice.getIDYoutube(url);
        iVideo = isNaN(iVideo) ? 0 : iVideo;
        fVideo = isNaN(fVideo) ? 3600 : fVideo;
        if (fVideo <= iVideo) fVideo = 36000;
        $('#mapaPImage').hide();
        $('#mapaPNoImage').hide();
        $('#mapaPDataImage').hide();
        $('#mapaPNoVideo').show();
        $('#mapaPDataVideo').show();
        $('#mapaPVideo').hide();
        if (id) {
            $exeDevice.startVideo(id, iVideo, fVideo);
            $('#mapaPVideo').show();
            $('#mapaPNoVideo').hide();
        } else {
            $exeDevice.showMessage(_("This video is not currently available"));
        }
        $('#mapaPContainer').fadeIn();
        $('#mapaCubierta').show();
    },


    clearPoint1: function (type) {
        var pre = type == 0 ? '#mapa' : '#pm',
            pt = type == 0 ? 'mapa' : 'pm';
        $(pre + 'Title').val('');
        $(pre + 'Cursor').hide();
        $(pre + 'Area').hide();
        $(pre + 'URLImage').val('');
        $(pre + 'X').val('0');
        $(pre + 'Y').val('0');
        $(pre + 'X1').val('0');
        $(pre + 'Y1').val('0');
        $(pre + 'URLYoutube').val('');
        $(pre + 'URLAudio').val('');
        $(pre + 'Text').text('');
        $(pre + 'Footer').val('');
        $(pre + 'Identify').val('');
        if (tinyMCE.get(pt + 'Text')) {
            tinyMCE.get(pt + 'ext').setContent('');
        }

        $(pre + 'PTitle').val('');
        $(pre + 'PURLImage').val('');
        $(pre + 'PAuthorImage').val('');
        $(pre + 'PAltImage').val('');
        $(pre + 'PURLYoutube').val('');
        $(pre + 'PInitVideo').val('00:00:00');
        $(pre + 'PEndVideo').val('00:00:00');
        $(pre + 'PVideoTime').text('00:00:00');
        $(pre + 'PFooter').val('');

    },

    clearPoint: function () {
        $('#mapaTitle').val('');
        $('#mapaCursor').hide();
        $('#mapaArea').hide();
        $('#mapaURLImage').val('');
        $('#mapaX').val('0');
        $('#mapaY').val('0');
        $('#mapaX1').val('0');
        $('#mapaY1').val('0');
        $('#mapaURLYoutube').val('');
        $('#mapaURLAudio').val('');
        $('#mapaText').text('');
        $('#mapaFooter').val('');
        $('#mapaIdentify').val('');
        $('#mapaURLAudioIdentify').val('');
        if (tinyMCE.get('mapaText')) {
            tinyMCE.get('mapaText').setContent('');
        }

        $('#mapaPTitle').val('');
        $('#mapaPURLImage').val('');
        $('#mapaPAuthorImage').val('');
        $('#mapaPAltImage').val('');
        $('#mapaPURLYoutube').val('');
        $('#mapaPInitVideo').val('00:00:00');
        $('#mapaPEndVideo').val('00:00:00');
        $('#mapaPVideoTime').text('00:00:00');
        $('#mapaPFooter').val('');

    },
    clearSlide: function () {
        $('#mapaSTitle').val('');
        $('#mapaSURLImage').val('');
        $('#mapaSAuthorImage').val('');
        $('#mapaSAltImage').val('');
        $('#mapaSFooter').val('');
    },

    addSlide: function () {
        if ($exeDevice.validateSlide()) {
            $exeDevice.clearSlide();
            $exeDevice.slides.push($exeDevice.getDefaultSlide())
            $exeDevice.activeSlide = $exeDevice.slides.length - 1;
            $('#mapaNumberSlide').val($exeDevice.slides.length);
            $exeDevice.typeEditSlide = -1;
            $('#mapaEPasteSlide').hide();
            $exeDevice.showImageSlide('', '');
        }

    },

    removeSlide: function () {
        if ($exeDevice.slides.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneSlide);
        } else {
            $exeDevice.slides.splice($exeDevice.activeSlide, 1);
            if ($exeDevice.activeSlide >= $exeDevice.slides.length - 1) {
                $exeDevice.activeSlide = $exeDevice.slides.length - 1;
            }
            $exeDevice.showSlide($exeDevice.activeSlide);
            $exeDevice.typeEditSlide = -1;
            $('#mapaEPasteSlide').hide();
            $('#mapaNumberSlide').val($exeDevice, activeSlide + 1);

        }
    },
    copySlide: function () {
        if ($exeDevice.validateSlide()) {
            $exeDevice.typeEditSlide = 0;
            $exeDevice.sClipBoard = $exeDevice.slides[$exeDevice.activeSlide];
            $('#mapaEPasteSlide').show();
        }

    },
    cutSlide: function () {
        if ($exeDevice.validateSlide()) {
            $exeDevice.numberCutCuestionSlide = $exeDevice.activeSlide;
            $exeDevice.typeEditSlide = 1;
            $('#mapaEPasteSlide').show();
        }
    },

    pasteSlide: function () {
        if ($exeDevice.typeEditSlide == 0) {
            $exeDevice.activeSlide++;
            var slide = $.extend(true, {}, $exeDevice.sClipBoard);
            slide.id = 's' + $exeDevice.getID();
            $exeDevice.slides.splice($exeDevice.activeSlide, 0, slide);
            $exeDevice.showSlide($exeDevice.activeSlide);
        } else if ($exeDevice.typeEditSlide == 1) {
            $('#mapaEPasteSlide').hide();
            $exeDevice.typeEditSlide = -1;
            $exeDevice.arrayMove($exeDevice.slides, $exeDevice.numberCutCuestionSlide, $exeDevice.activeSlide);
            $exeDevice.showSlide($exeDevice.activeSlide);

        }
    },

    nextSlide: function () {
        if ($exeDevice.validateSlide()) {
            if ($exeDevice.activeSlide < $exeDevice.slides.length - 1) {
                $exeDevice.activeSlide++;
                $exeDevice.showSlide($exeDevice.activeSlide);
            }
        }
    },
    lastSlide: function () {
        if ($exeDevice.validateSlide()) {
            if ($exeDevice.activeSlide < $exeDevice.slides.length - 1) {
                $exeDevice.activeSlide = $exeDevice.slides.length - 1;
                $exeDevice.showSlide($exeDevice.activeSlide);
            }
        }
    },
    previousSlide: function () {
        if ($exeDevice.validateSlide()) {
            if ($exeDevice.activeSlide > 0) {
                $exeDevice.activeSlide--;
                $exeDevice.showSlide($exeDevice.activeSlide);
            }
        }
    },
    firstSlide: function () {
        if ($exeDevice.validateSlide()) {
            if ($exeDevice.activeSlide > 0) {
                $exeDevice.activeSlide = 0;
                $exeDevice.showSlide($exeDevice.activeSlide);
            }
        }
    },


    addPoint: function () {
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid !== false) {
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            $exeDevice.clearPoint();
            $exeDevice.activeMap.pts.push($exeDevice.getDefaultPoint());
            $exeDevice.activeMap.active = $exeDevice.activeMap.pts.length - 1;
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active].map.pts.push($exeDevice.getDefaultPoint())
            $('#mapaNumberPoint').val($exeDevice.activeMap.pts.length);
            $exeDevice.typeEdit = -1;
            $('#mapaEPaste').hide();
            $('#mapaENumPoints').text($exeDevice.activeMap.pts.length);
            $exeDevice.updateQuestionsNumber();
        }

    },

    removePoint: function () {
        if ($exeDevice.activeMap.pts.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOnePoint);
        } else {
            $exeDevice.activeMap.pts.splice($exeDevice.activeMap.active, 1);
            if ($exeDevice.activeMap.active >= $exeDevice.activeMap.pts.length - 1) {
                $exeDevice.activeMap.active = $exeDevice.activeMap.pts.length - 1;
            }
            $exeDevice.showPoint($exeDevice.activeMap.active);
            $exeDevice.typeEdit = -1;
            $('#mapaEPaste').hide();
            $('#mapaENumPoints').text($exeDevice.activeMap.pts.length);
            $('#mapaNumberPoint').val($exeDevice.activeMap.active + 1);
            $exeDevice.updateQuestionsNumber();
        }
    },
    copyPoint: function () {
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid !== false) {
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            $exeDevice.typeEdit = 0;
            $exeDevice.clipBoard = $exeDevice.activeMap.pts[$exeDevice.activeMap.active];
            $('#mapaEPaste').show();
        }

    },
    cutPoint: function () {
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid !== false) {
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            $exeDevice.numberCutCuestion = $exeDevice.activeMap.active;
            $exeDevice.typeEdit = 1;
            $('#mapaEPaste').show();
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
    pastePoint: function () {
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.activeMap.active++;
            //var p=Object.assign({},$exeDevice.clipBoard);
            var p = $.extend(true, {}, $exeDevice.clipBoard);
            $exeDevice.changeId(p);
            $exeDevice.activeMap.pts.splice($exeDevice.activeMap.active, 0, p);
            $exeDevice.showPoint($exeDevice.activeMap.active);
            $exeDevice.updateQuestionsNumber();
        } else if ($exeDevice.typeEdit == 1) {
            $('#mapaEPaste').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.activeMap.pts, $exeDevice.numberCutCuestion, $exeDevice.activeMap.active);
            $exeDevice.showPoint($exeDevice.activeMap.active);
            $('#mapaENumPoints').text($exeDevice.activeMap.pts.length);
            $exeDevice.updateQuestionsNumber();
        }
    },
    changeId: function (p) {
        var id = $exeDevice.getID();
        p.id = 'p' + id;
        p.map.id = "a" + id;
        for (var i = 0; i < p.map.pts.length; i++) {
            var pi = p.map.pts[i];
            $exeDevice.changeId(pi)
        }

    },
    nextPoint: function () {
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid !== false) {
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            if ($exeDevice.activeMap.active < $exeDevice.activeMap.pts.length - 1) {
                $exeDevice.activeMap.active++;
                $exeDevice.showPoint($exeDevice.activeMap.active);
            }
        }
    },
    lastPoint: function () {
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid !== false) {
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            if ($exeDevice.activeMap.active < $exeDevice.activeMap.pts.length - 1) {
                $exeDevice.activeMap.active = $exeDevice.activeMap.pts.length - 1;
                $exeDevice.showPoint($exeDevice.activeMap.active);
            }
        }
    },
    previousPoint: function () {
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid !== false) {
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            if ($exeDevice.activeMap.active > 0) {
                $exeDevice.activeMap.active--;
                $exeDevice.showPoint($exeDevice.activeMap.active);
            }
        }
    },
    firstPoint: function () {
        var pvalid = $exeDevice.validatePoint($exeDevice.activeMap.pts[$exeDevice.activeMap.active]);
        if (pvalid !== false) {
            $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = pvalid;
            if ($exeDevice.activeMap.active > 0) {
                $exeDevice.activeMap.active = 0;
                $exeDevice.showPoint($exeDevice.activeMap.active);
            }
        }
    },

    updateFieldGame: function (game) {
        $exeDevice.activeMap.active = 0;
        $exeDevice.qActive = 0;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        $('#mapaEShowMinimize').prop('checked', game.showMinimize);
        $('#mapaEShowActiveAreas').prop('checked', game.showActiveAreas);
        $('#mapaURLImageMap').val(game.url);
        $('#mapaAuthorImageMap').val(game.authorImage);
        $('#mapaAltImageMap').val(game.altImage);
        $('#mapaEShowSolution').prop('checked', game.showSolution);
        $('#mapaETimeShowSolution').prop('disabled', !game.showSolution);
        $('#mapaETimeShowSolution').val(game.timeShowSolution);
        $('#mapaPercentajeIdentify').val(game.percentajeIdentify || 100);
        $('#mapaPercentajeShowQ').val(game.percentajeShowQ || 100);
        $('#mapaPercentajeQuestions').val(game.percentajeQuestions || 100);
        $exeDevice.showImageMap(game.url, game.points[0].x, game.points[0].y, game.points[0].x1, game.points[0].y1, game.points[0].alt, game.points[0].iconType)
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.activeMap.pts = game.points;
        $exeDevice.selectsGame = game.selectsGame;
        $("input.MQE-TypeEvaluation[name='mpevaluation'][value='" + game.evaluation + "']").prop("checked", true);
        $('#mapaEvaluationData').hide();
        $('#mapaSolutionData').show();
        if (game.evaluation == 4) {
            $('#mapaFQuestions').show();
            $('#mapaEvaluationData').show();
            $('#mapaEShowSolution').show();
            $('label[for=mapaEShowSolution]').show();
            $('#mapaETimeShowSolution').prop("disabled", !game.showSolution);
        }
        $('#mapaEvaluationIdentify').hide();
        if (game.evaluation == 2 || game.evaluation == 3) {
            $('#mapaEvaluationIdentify').show();
        }
        $exeDevice.showQuestion($exeDevice.qActive);
        $('#mapaDataIdentifica').hide();
        if (game.evaluation == 1 || game.evaluation == 2 || game.evaluation == 3) {
            $('#mapaDataIdentifica').show();
            $('#mapaEShowSolution').hide();
            $('label[for=mapaEShowSolution]').hide();
            $('#mapaETimeShowSolution').prop("disabled", false);

        }
        $('#mapaIconTypeDiv').show();
        if (game.evaluation == 1) {
            $('#mapaIconTypeDiv').hide();
        }
        if (game.evaluation == 0) {
            $('#mapaSolutionData').hide();
        }
        $exeDevice.updateQuestionsNumber();
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
    clickImage: function (div, epx, epy) {
        $('#mapaArea').hide();
        var $cursor = $('#mapaCursor'),
            $div = $(div),
            posX = epx - $div.offset().left,
            posY = epy - $div.offset().top,
            wI = $div.width() > 0 ? $div.width() : 1,
            hI = $div.height() > 0 ? $div.height() : 1,
            lI = $div.position().left,
            tI = $div.position().top,
            iw = parseInt($('#mapaCursor').width() * $exeDevice.iconX),
            ih = parseInt($('#mapaCursor').height() * $exeDevice.iconY);
        $('#mapaX').val(posX / wI);
        $('#mapaY').val(posY / hI);
        $cursor.css({
            left: (posX + lI - iw) + 'px',
            top: (posY + tI - ih) + 'px',
            'z-index': 100
        });
        $cursor.show();
    },

    addLevel: function () {
        $exeDevice.saveLevel();
        //$exeDevice.levels[$exeDevice.levels.length - 1] = Object.assign({}, $exeDevice.activeMap);
        $exeDevice.levels[$exeDevice.levels.length - 1] = $.extend(true, {}, $exeDevice.activeMap);

        //var nlevel = Object.assign({}, $exeDevice.activeMap.pts[$exeDevice.activeMap.active].map);
        var nlevel = $.extend(true, {}, $exeDevice.activeMap.pts[$exeDevice.activeMap.active].map);

        //$exeDevice.activeMap = Object.assign({}, nlevel);
        $exeDevice.activeMap = $.extend(true, {}, nlevel);
        $exeDevice.levels.push(nlevel);
        $exeDevice.showLevel();

    },

    removeLevel: function (save) {
        var parent = $exeDevice.levels[$exeDevice.levels.length - 2];
        if (save) {
            //parent.pts[parent.active].map = Object.assign({}, $exeDevice.activeMap);
            parent.pts[parent.active].map = $.extend(true, {}, $exeDevice.activeMap);

        }
        //$exeDevice.activeMap = Object.assign({}, parent);
        $exeDevice.activeMap = $.extend(true, {}, parent);
        $exeDevice.levels.pop();
        $exeDevice.showLevel();

    },

    saveLevel: function () {
        var p = $exeDevice.activeMap.pts[$exeDevice.activeMap.active],
            url = $('#mapaURLImageMap').val(),
            author = $('#mapaAuthorImageMap').val(),
            alt = $('#mapaAltImageMap').val()
        p.title = $('#mapaTitle').val().trim();
        p.type = parseInt($('input[name=mpmediatype]:checked').val());
        p.x = parseFloat($('#mapaX').val());
        p.y = parseFloat($('#mapaY').val());;
        p.x1 = parseFloat($('#mapaX1').val());
        p.y1 = parseFloat($('#mapaY1').val());
        p.footer = $('#mapaFooter').val();
        p.author = $('#mapaPAuthorImage').val();
        p.alt = $('#mapaPAltImage').val();
        p.url = $('#mapaURLImage').val().trim();
        p.question = $('#mapaIdentify').val();
        p.question_audio = $('#mapaURLAudioIdentify').val();
        p.video = $('#mapaURLYoutube').val().trim();
        p.iVideo = $exeDevice.hourToSeconds($('#mapaPInitVideo').val());
        p.fVideo = $exeDevice.hourToSeconds($('#mapaPEndVideo').val());
        p.audio = $('#mapaURLAudio').val().trim();
        p.iVideo = isNaN(p.iVideo) ? 0 : p.iVideo;
        p.fVideo = isNaN(p.fVideo) ? 3600 : p.fVideo;
        p.iconType = parseInt($('#mapaIconType').children("option:selected").val());
        $exeDevice.activeMap.url = url;
        $exeDevice.activeMap.author = author;
        $exeDevice.activeMap.alt = alt;
        $exeDevice.activeMap.pts[$exeDevice.activeMap.active] = p;
    },

    closeLevel: function () {
        Ext.MessageBox.confirm(_('Close map'), _('Do you want to save the changes of this map?'), callbackFunction);

        function callbackFunction(btn) {
            if (btn == 'yes') {
                if ($exeDevice.validateDataLevel()) {
                    $exeDevice.removeLevel(true);
                    $exeDevice.updateQuestionsNumber();
                }
            } else {
                $exeDevice.removeLevel(false);
                $exeDevice.updateQuestionsNumber();
            }
        };
    },
    showLevel: function () {
        var p = $exeDevice.getDefaultPoint();
        $exeDevice.activeMap.pts = $exeDevice.activeMap.pts || [];
        $exeDevice.activeMap.url = $exeDevice.activeMap.url || '';
        $exeDevice.activeMap.author = $exeDevice.activeMap.author || '';
        $exeDevice.activeMap.alt = $exeDevice.activeMap.alt || '';
        $exeDevice.activeMap.active = $exeDevice.activeMap.active || 0;

        if ($exeDevice.activeMap.pts.length > $exeDevice.activeMap.active) {
            p = $exeDevice.activeMap.pts[$exeDevice.activeMap.active];
        } else {
            $exeDevice.activeMap.pts.push(p)
        }

        $('#mapaURLImageMap').val($exeDevice.activeMap.url);
        $('#mapaAuthorImageMap').val($exeDevice.activeMap.author);
        $('#mapaAltImageMap').val($exeDevice.activeMap.alt);
        $('#mapaCursor').hide();
        $exeDevice.showImageMap($exeDevice.activeMap.url, p.x, p.y, p.x1, p.y1, p.alt, p.icon);
        $exeDevice.showPoint($exeDevice.activeMap.active);
        $('#mapaCloseDetail').hide();
        if ($exeDevice.levels.length > 1) {
            $('#mapaCloseDetail').css('display', 'flex');
            $('#mapaCloseDetail').show();

        }
        $exeDevice.stopSound();
        $exeDevice.stopVideo();

    },


    getPointValues: function () {
        var p = new Object();
        p.title = $('#mapaTitle').val().trim();
        p.type = parseInt($('input[name=mpmediatype]:checked').val());
        p.x = parseFloat($('#mapaX').val());
        p.y = parseFloat($('#mapaY').val());;
        p.x1 = parseFloat($('#mapaX1').val());
        p.y1 = parseFloat($('#mapaY1').val());
        p.footer = $('#mapaFooter').val();
        p.author = $('#mapaPAuthorImage').val();
        p.alt = $('#mapaPAltImage').val();
        p.url = $('#mapaURLImage').val().trim();
        p.video = $('#mapaURLYoutube').val().trim();
        p.iVideo = $exeDevice.hourToSeconds($('#mapaPInitVideo').val());
        p.fVideo = $exeDevice.hourToSeconds($('#mapaPEndVideo').val());
        p.audio = $('#mapaURLAudio').val().trim();
        p.iVideo = isNaN(p.iVideo) ? 0 : p.iVideo;
        p.fVideo = isNaN(p.fVideo) ? 3600 : p.fVideo;
        p.iconType = parseInt($('#mapaIconType').children("option:selected").val());
        p.question = $('#mapaIdentify').val();
        p.question_audio = $('#mapaURLAudioIdentify').val();
        if ($("#mapaPContainer").is(":visible")) {
            p.video = $('#mapaPURLYoutube').val().trim();
            p.url = $('#mapaPURLImage').val().trim();
            p.title = $('#mapaPTitle').val().trim();
            p.footer = $('#mapaPFooter').val();
        }
        if (p.fVideo <= p.iVideo) p.fVideo = 36000;

        if (p.type == 1) {
            p.video = $exeDevice.getIDYoutube($('#mapaURLYoutube').val().trim()) ? $('#mapaURLYoutube').val() : '';
        }
        p.eText = tinyMCE.get('mapaText').getContent();
        return p;
    },
    clickArea: function (epx, epy, epx1, epy1) {
        $('#mapaCursor').hide();
        var $area = $('#mapaArea'),
            $x = $('#mapaX'),
            $y = $('#mapaY'),
            $x1 = $('#mapaX1'),
            $y1 = $('#mapaY1'),
            $div = $('#mapaProtector'),
            posX = Math.round(epx - $div.offset().left),
            posY = Math.round(epy - $div.offset().top),
            posX1 = Math.round(epx1 - $div.offset().left),
            posY1 = Math.round(epy1 - $div.offset().top),
            wI = $div.width() > 0 ? $div.width() : 1,
            hI = $div.height() > 0 ? $div.height() : 1,
            lI = $div.position().left,
            tI = $div.position().top,
            px = posX >= posX1 ? lI + posX1 : lI + posX,
            py = posY >= posY1 ? tI + posY1 : tI + posY,
            w = Math.abs(posX1 - posX),
            h = Math.abs(posY1 - posY);
        $x.val(posX / wI);
        $y.val(posY / hI);
        $x1.val(posX1 / wI);
        $y1.val(posY1 / hI);
        $area.css({
            left: px + 'px',
            top: py + 'px',
            width: w + 'px',
            height: h + 'px',
            'z-index': 99
        });
        $area.show();
    },

    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
    },
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    }

}