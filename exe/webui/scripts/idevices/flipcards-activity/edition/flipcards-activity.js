/**
/**
 * Tarjetas de meoria Activity iDevice (edition code)
 * Version: 1
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n: {
        category: _('Games'),
        name: _('Memory Cards')
    },
    msgs: {},
    active: 0,
    activeCard: 0,
    activeID: "",
    cardsGame: [],
    typeEdit: -1,
    idPaste: '',
    numberCutCuestion: -1,
    clipBoard: '',
    iDevicePath: "/scripts/idevices/flipcards-activity/edition/",
    playerAudio: "",
    version: 1.3,
    id:false,
    ci18n: {
        "msgSubmit": _("Submit"),
        "msgClue": _("Cool! The clue is:"),
        "msgCodeAccess": _("Access code"),
        "msgPlayAgain": _("Play Again"),
        "msgPlayStart": _("Click here to play"),
        "msgScore": _("Score"),
        "msgErrors": _("Errors"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgCool": _("Cool!"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Incorrect! | Not correct! | Sorry! | Error!"),
        "msgNoImage": _("No picture question"),
        "msgEndGameScore": _("Please start the game before saving your score."),
        "msgScoreScorm": _("The score can't be saved because this page is not part of a SCORM package."),
        "msgOnlySaveScore": _("You can only save the score once!"),
        "msgOnlySave": _("You can only save once"),
        "msgInformation": _("Information"),
        "msgYouScore": _("Your score"),
        "msgAuthor": _("Authorship"),
        "msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore": _("The last score saved is"),
        "msgActityComply": _("You have already done this activity."),
        "msgPlaySeveralTimes": _("You can do this activity as many times as you want"),
        "msgClose": _("Close"),
        "msgAudio": _("Audio"),
        "msgPreviousCard": _("Previous"),
        "msgNextCard": _("Next"),
        "msgNumQuestions": _("Number of cards"),
        "msgTrue": _("True"),
        "msgFalse": _("False"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "mgsAllQuestions": _("Questions completed!"),
        "msgTrue1": _("Right. That's the card."),
        "msgTrue2": _("You're wrong. That's not the card."),
        "msgFalse1": _("Right. That's not the card."),
        "msgFalse2": _("You're wrong. That's the card."),
        "mgsClickCard": _("Click on the card"),
        "msgEndTime": _("Game time is over. Your score is %s."),
        "msgEnd": _("Finish"),
        "msgEndGameM": _("You finished the game. Your score is %s."),
        "msgUncompletedActivity": _("Incomplete activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %s"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %s"),
        "msgTypeGame": _('Memory Cards')


    },
    init: function () {
        this.setMessagesInfo();
        this.createForm();
    },

    initCards: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;", "%"); // Avoid invalid HTML
        if ($exeDevice.cardsGame.length == 0) {
            var card = $exeDevice.getCardDefault();
            $exeDevice.cardsGame.push(card);
        }
        $('#flipcardsETextDiv').hide();
        $('#flipcardsETextDivBack').hide();
        this.active = 0;
    },
    setMessagesInfo: function () {
        var msgs = this.msgs;
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgNoSuportBrowser = _("Your browser is not compatible with this tool.");
        msgs.msgCompleteData = _("Provide an image, text or audio for each card's front side");
        msgs.msgCompleteDataBack = _("Provide an image, text or audio for each card's back side");
        msgs.msgEOneCard = _("Please create at least one card");
        msgs.msgMaxCards = _("Maximum card number: %s.");
        msgs.msgIDLenght = _('The report identifier must have at least 5 characters');

    },
    createForm: function () {
        var path = $exeDevice.iDevicePath,
            html = '\
            <div id="gameIdeviceForm">\
            <div class="exe-idevice-info">' + _("Create card memory games with images, sounds or rich text.") + ' <a href="https://descargas.intef.es/cedec/exe_learning/Manuales/manual_exe29/tarjetas_de_memoria.html" hreflang="es" target="_blank">' + _("Use Instructions") + '</a></div>\
            <div class="exe-form-tab" title="' + _('General settings') + '">\
            ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_('Click on the cards to see what they hide.')) + '\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">' + _('Options') + '</a></legend>\
                    <div>\
                        <p>\
                            <span>' + _("Type") + ':</span>\
                            <span class="FLCRDS-EInputType">\
                                <input class="FLCRDS-Type" checked id="flipcardsETypeShow" type="radio" name="flctype" value="0"/>\
                                <label for="flipcardsETypeShow">' + _("Show") + '</label>\
                                <input class="FLCRDS-Type"  id="flipcardsETypeNavigation" type="radio" name="flctype" value="1"/>\
                                <label for="flipcardsETypeNavigation">' + _("Navigation") + '</label>\
                                <input class="FLCRDS-Type"  id="flipcardsETypeIdentify" type="radio" name="flctype" value="2"/>\
                                <label for="flipcardsETypeIdentify">' + _("Identify") + '</label>\
                                <input class="FLCRDS-Type"  id="flipcardsETypeMemory" type="radio" name="flctype" value="3"/>\
                                <label for="flipcardsETypeMemory">' + _("Memory") + '</label>\
                            </span>\
                        </p>\
                        <p style="display:none">\
							<label for="flipcardsEShowSolution"><input type="checkbox" checked id="flipcardsEShowSolution"> ' + _("Show solutions") + '. </label> \
							<label for="flipcardsETimeShowSolution">' + _("Show solution time (seconds)") + ':\
							<input type="number" name="flipcardsETimeShowSolution" id="flipcardsETimeShowSolution" value="3" min="1" max="9" /> </label>\
                         </p>\
                         <p id="flipcardsETimeDiv" style="display:none;">\
                            <label for="flipcardsETime">' + _("Time (minutes)") + ':\
                            <input type="number" name="flipcardsETime" id="flipcardsETime" value="3" min="0" max="59" /> </label>\
                        </p>\
                        <p>\
                            <label for="flipcardsEShowMinimize"><input type="checkbox" id="flipcardsEShowMinimize">' + _('Show minimized.') + '</label>\
                        </p>\
                        <p>\
                            <label for="flipcardsERandomCards"><input type="checkbox" id="flipcardsERandomCards" checked>' + _('Random') + '</label>\
                        </p>\
                        <p>\
                            <label for="flipcardsEPercentajeCards">% ' + _('Cards') + ':</label><input type="number" name="flipcardsEPercentajeCards" id="flipcardsEPercentajeCards" value="100" min="1" max="100" />\
                            <span id="flipcardsENumeroPercentaje">1/1</span>\
                        </p>\
                        <p>\
                            <label for="flipcardsEAuthory">' + _('Authorship') + ': </label><input id="flipcardsEAuthory" type="text" />\
                        </p>\
                        <p>\
                            <strong class="GameModeLabel"><a href="#flipcardsEEvaluationHelp" id="flipcardsEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
							<label for="flipcardsEEvaluation"><input type="checkbox" id="flipcardsEEvaluation"> ' + _("Progress report") + '. </label> \
							<label for="flipcardsEEvaluationID">' + _("Identifier") + ':\
							<input type="text" id="flipcardsEEvaluationID" disabled/> </label>\
                        </p>\
                        <div id="flipcardsEEvaluationHelp" class="FLCRDS-TypeGameHelp">\
                            <p>' +_("You must indicate the ID. It can be a word, a phrase or a number of more than four characters. You will use this ID to mark the activities covered by this progress report. It must be the same in all iDevices of a report and different in each report.") + '</p>\
                        </div>\
                    </div>\
                </fieldset>\
                <fieldset class="exe-fieldset">\
                <legend><a href="#">' + _('Cards') + '</a></legend>\
                <div class="FLCRDS-EPanel" id="flipcardsEPanel">\
                    <div class="FLCRDS-EPhrase" id="flipcardsEPhrase">\
                        <div class="FLCRDS-EDatosCarta FLCRDS-EFront" id="flipcardsEDatosCarta">\
                            <span class="FLCRDS-ECardType">' + _('Front side') + '</span>\
                            <div class="FLCRDS-EMultimedia">\
                                <div class="FLCRDS-ECard">\
                                    <img class="FLCRDS-EHideFLCRDS-EImage" id="flipcardsEImage"  src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <img class="FLCRDS-ECursor" id="flipcardsECursor" src="' + path + 'quextIECursor.gif" alt="" />\
                                    <img class="FLCRDS-EHideFLCRDS-NoImage" id="flipcardsENoImage" src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <div class="FLCRDS-ETextDiv" id="flipcardsETextDiv"></div>\
                                </div>\
                            </div>\
                            <span class="FLCRDS-ETitleText" id="flipcardsETitleText">' + _('Text') + '</span>\
                            <div class="FLCRDS-EInputText" id="flipcardsEInputText">\
                                <label class="sr-av">' + _('Text') + '</label><input type="text" id="flipcardsEText" class="FLCRDS-EText" />\
                                <label id="flipcardsELblColor" class="FLCRDS-LblColor">' + _('Color') + ': </label><input id="flipcardsEColor"  type="color"  class="FLCRDS-EColor" value="#000000">\
                                <label id="flipcardsELblBgColor"  class="FLCRDS-LblBgColor">' + _('Background') + ': </label><input id="flipcardsEBgColor"  type="color"   class="FLCRDS-EBackColor" value="#ffffff">\
                            </div>\
                            <span class="FLCRDS-ETitleImage" id="flipcardsETitleImage">' + _('Image') + '</span>\
                            <div class="FLCRDS-EInputImage"  id="flipcardsEInputImage">\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="flipcardsEURLImage" class="exe-file-picker FLCRDS-EURLImage"/>\
                                <a href="#" id="flipcardsEPlayImage" class="FLCRDS-ENavigationButton FLCRDS-EPlayVideo" title="' + _('Show') + '"><img src="' + path + 'quextIEPlay.png" alt="' + _('Show') + '" class="FLCRDS-EButtonImage b-play" /></a>\
                                <a href="#" id="flipcardsEShowMore" class="FLCRDS-ENavigationButton FLCRDS-EShowMore" title="' + _('More') + '"><img src="' + path + 'quextEIMore.png" alt="' + _('More') + '" class="FLCRDS-EButtonImage b-play" /></a>\
                            </div>\
                            <div class="FLCRDS-ECoord">\
                                    <label >X:</label>\
                                    <input id="flipcardsEX" class="FLCRDS-EX" type="text" value="0" />\
                                    <label >Y:</label>\
                                    <input id="flipcardsEY" class="FLCRDS-EY" type="text" value="0" />\
                            </div>\
                            <div class="FLCRDS-EAuthorAlt"  id="flipcardsEAuthorAlt">\
                                <div class="FLCRDS-EInputAuthor">\
                                    <label>' + _('Authorship') + '</label><input id="flipcardsEAuthor" type="text"  class="FLCRDS-EAuthor" />\
                                </div>\
                                <div class="FLCRDS-EInputAlt">\
                                    <label>' + _('Alternative text') + '</label><input  id="flipcardsEAlt" type="text" class="FLCRDS-EAlt" />\
                                </div>\
                            </div>\
                            <span >' + _('Audio') + '</span>\
                            <div class="FLCRDS-EInputAudio" >\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="flipcardsEURLAudio" class="exe-file-picker FLCRDS-EURLAudio"  />\
                                <a href="#" id="flipcardsEPlayAudio" class="FLCRDS-ENavigationButton FLCRDS-EPlayVideo" title="' + _('Audio') + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="FLCRDS-EButtonImage b-play" /></a>\
                            </div>\
                        </div>\
                        <div class="FLCRDS-EDatosCarta FLCRDS-EBack" id="flipcardsEDatosCartaBack">\
                            <span class="FLCRDS-ECardType">' + _('Back side') + '</span>\
                            <div class="FLCRDS-EMultimedia">\
                                <div class="FLCRDS-ECard">\
                                    <img class="FLCRDS-EHideFLCRDS-EImage" id="flipcardsEImageBack"  src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <img class="FLCRDS-ECursor" id="flipcardsECursorBack" src="' + path + 'quextIECursor.gif" alt="" />\
                                    <img class="FLCRDS-EHideFLCRDS-NoImage" id="flipcardsENoImageBack" src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <div class="FLCRDS-ETextDiv" id="flipcardsETextDivBack"></div>\
                                </div>\
                            </div>\
                            <span class="FLCRDS-ETitleText" id="flipcardsETitleTextBack">' + _('Text') + '</span>\
                            <div class="FLCRDS-EInputText" id="flipcardsEInputTextBack">\
                                <label class="sr-av">' + _('Text') + '</label><input type="text" id="flipcardsETextBack" class="FLCRDS-EText" />\
                                <label id="flipcardsELblColorBack class="FLCRDS-LblColor">' + _('Color') + ': </label><input id="flipcardsEColorBack"  type="color"  class="FLCRDS-EColor" value="#000000">\
                                <label id="flipcardsELblBgColorBack"  class="FLCRDS-LblBgColor">' + _('Background') + ': </label><input id="flipcardsEBgColorBack"  type="color"   class="FLCRDS-EBackColor" value="#ffffff">\
                            </div>\
                            <span class="FLCRDS-ETitleImage" id="flipcardsETitleImageBack">' + _('Image') + '</span>\
                            <div class="FLCRDS-EInputImage"  id="flipcardsEInputImageBack">\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="flipcardsEURLImageBack" class="exe-file-picker FLCRDS-EURLImage"/>\
                                <a href="#" id="flipcardsEPlayImageBack" class="FLCRDS-ENavigationButton FLCRDS-EPlayVideo" title="' + _('Show') + '"><img src="' + path + 'quextIEPlay.png" alt="' + _('Show') + '" class="FLCRDS-EButtonImage b-play" /></a>\
                                <a href="#" id="flipcardsEShowMoreBack" class="FLCRDS-ENavigationButton FLCRDS-EShowMore" title="' + _('More') + '"><img src="' + path + 'quextEIMore.png" alt="' + _('More') + '" class="FLCRDS-EButtonImage b-play" /></a>\
                            </div>\
                            <div class="FLCRDS-ECoord">\
                                    <label >X:</label>\
                                    <input id="flipcardsEXBack" class="FLCRDS-EX" type="text" value="0" />\
                                    <label >Y:</label>\
                                    <input id="flipcardsEYBack" class="FLCRDS-EY" type="text" value="0" />\
                            </div>\
                            <div class="FLCRDS-EAuthorAlt"  id="flipcardsEAuthorAltBack">\
                                <div class="FLCRDS-EInputAuthor">\
                                    <label>' + _('Authorship') + '</label><input id="flipcardsEAuthorBack" type="text" class="FLCRDS-EAuthor" />\
                                </div>\
                                <div class="FLCRDS-EInputAlt">\
                                    <label>' + _('Alternative text') + '</label><input id="flipcardsEAltBack" type="text" class="FLCRDS-EAlt" />\
                                </div>\
                            </div>\
                            <span >' + _('Audio') + '</span>\
                            <div class="FLCRDS-EInputAudio" >\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="flipcardsEURLAudioBack" class="exe-file-picker FLCRDS-EURLAudio"  />\
                                <a href="#" id="flipcardsEPlayAudioBack" class="FLCRDS-ENavigationButton FLCRDS-EPlayVideo" title="' + _('Audio') + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="FLCRDS-EButtonImage b-play" /></a>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="FLCRDS-EReverseFacces">\
                        <a href="#" id="flipcardsEReverseCard" title="' + _('Flip down the card') + '">' + _('Flip down the card') + '</a>\
                        <a href="#" id="flipcardsEReverseFaces" title="' + _('Flip down all the cards') + '">' + _('Flip down all the cards') + '</a>\
                    </div>\
                    <div class="FLCRDS-ENavigationButtons">\
                        <a href="#" id="flipcardsEAddC" class="FLCRDS-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Add question") + '" class="FLCRDS-EButtonImage" /></a>\
                        <a href="#" id="flipcardsEFirstC" class="FLCRDS-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _("First question") + '" class="FLCRDS-EButtonImage" /></a>\
                        <a href="#" id="flipcardsEPreviousC" class="FLCRDS-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="FLCRDS-EButtonImage" /></a>\
                        <label class="sr-av" for="flipcardsENumberCard">' + _("Question number:") + ':</label><input type="text" class="FLCRDS-NumberCard"  id="flipcardsENumberCard" value="1"/>\
                        <a href="#" id="flipcardsENextC" class="FLCRDS-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="FLCRDS-EButtonImage" /></a>\
                        <a href="#" id="flipcardsELastC" class="FLCRDS-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="FLCRDS-EButtonImage" /></a>\
                        <a href="#" id="flipcardsEDeleteC" class="FLCRDS-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="FLCRDS-EButtonImage" /></a>\
                        <a href="#" id="flipcardsECopyC" class="FLCRDS-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png" alt="' + _("Copy question") + '" class="FLCRDS-EButtonImage" /></a>\
                        <a href="#" id="flipcardsECutC" class="FLCRDS-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" alt="' + _("Cut question") + '"  class="FLCRDS-EButtonImage" /></a>\
                        <a href="#" id="flipcardsEPasteC" class="FLCRDS-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png" alt="' + _("Paste question") + '" class="FLCRDS-EButtonImage" /></a>\
                    </div>\
                    <div class="FLCRDS-ENumCardDiv" id="flipcardsENumCardsDiv">\
                        <div class="FLCRDS-ENumCardsIcon"><span class="sr-av">' + _('Cards') + ':</span></div> <span class="FLCRDS-ENumCards" id="flipcardsENumCards">0</span>\
                    </div>\
                </div>\
                </fieldset>\
                ' + $exeDevice.getTextFieldset("after") + '\
            </div>\
            ' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab() + '\
        </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("gameIdeviceForm");
        $exeAuthoring.iDevice.gamification.scorm.init();
        this.enableForm(field);

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
                    <legend><a href='#'>" + tit + " (" + _('Optional').toLowerCase() + ")</a></legend>\
                    <div>\
                        <p>\
                            <label for='eXeIdeviceText" + id + "' class='sr-av'>" + tit + ":</label>\
                            <textarea id='eXeIdeviceText" + id + "' class='exe-html-editor'\></textarea>\
                        </p>\
                    <div>\
				</fieldset>";
    },

    clearCard: function () {

        $('#flipcardsEURLImage').val('');
        $('#flipcardsEX').val('0');
        $('#flipcardsEY').val('0');
        $('#flipcardsEAuthor').val('');
        $('#flipcardsEAlt').val('');
        $('#flipcardsEURLAudio').val('');
        $('#flipcardsEText').val('');
        $('#flipcardsETextDiv').val('');
        $('#flipcardsEColor').val('#000000');
        $('#flipcardsEBgColor').val('#ffffff');
        $('#flipcardsETextDiv').hide();
        $('#flipcardsETextDiv').css({
            'background-color': $exeDevice.hexToRgba('#ffffff', 0.7),
            'color': '#000000'
        });

        $exeDevice.showImage(0);

        $('#flipcardsEURLImageBack').val('');
        $('#flipcardsEXBack').val('0');
        $('#flipcardsEYBack').val('0');
        $('#flipcardsEAuthorBack').val('');
        $('#flipcardsEAltBack').val('');
        $('#flipcardsEURLAudioBack').val('');
        $('#flipcardsETextBack').val('');
        $('#flipcardsETextDivBack').val('');
        $('#flipcardsEColorBack').val('#000000');
        $('#flipcardsEBgColorBack').val('#ffffff');
        $('#flipcardsETextDivBack').hide();
        $('#flipcardsETextDivBack').css({
            'background-color': $exeDevice.hexToRgba('#ffffff', 0.7),
            'color': '#000000'
        });
        $exeDevice.showImage(1);


    },

    addCard: function () {
        if ($exeDevice.validateCard() === false) return;
        $exeDevice.clearCard();
        $exeDevice.cardsGame.push($exeDevice.getCardDefault());
        $exeDevice.active = $exeDevice.cardsGame.length - 1;
        $exeDevice.typeEdit = -1;
        $('#flipcardsEPasteC').hide();
        $('#flipcardsENumCards').text($exeDevice.cardsGame.length);
        $('#flipcardsENumberCard').val($exeDevice.cardsGame.length);
        $exeDevice.updateCardsNumber();

    },
    removeCard: function () {
        if ($exeDevice.cardsGame.length < 2) {
            $exeDevice.showMessage($exeDevice.msgs.msgEOneCard);
            return;
        } else {
            $exeDevice.cardsGame.splice($exeDevice.active, 1);
            if ($exeDevice.active >= $exeDevice.cardsGame.length - 1) {
                $exeDevice.active = $exeDevice.cardsGame.length - 1;
            }
            $exeDevice.showCard($exeDevice.active);
            $exeDevice.typeEdit = -1;
            $('#flipcardsEPasteC').hide();
            $('#flipcardsENumCards').text($exeDevice.cardsGame.length);
            $('#flipcardsENumberCard').val($exeDevice.active + 1);
            $exeDevice.updateCardsNumber();
        }
    },
    copyCard: function () {
        if ($exeDevice.validateCard() === false) return;
        $exeDevice.typeEdit = 0;
        $exeDevice.clipBoard = $exeDevice.cardsGame[$exeDevice.active];
        $('#flipcardsEPasteC').show();


    },
    cutCard: function () {
        if ($exeDevice.validateCard() === false) return;
        $exeDevice.numberCutCuestion = $exeDevice.active;
        $exeDevice.typeEdit = 1;
        $('#flipcardsEPasteC').show();


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

    pasteCard: function () {
        if ($exeDevice.typeEdit == 0) {
            $exeDevice.active++;
            $exeDevice.cardsGame.splice($exeDevice.active, 0, $exeDevice.clipBoard);
            $exeDevice.showCard($exeDevice.active);
        } else if ($exeDevice.typeEdit == 1) {
            $('#flipcardsEPasteC').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.cardsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showCard($exeDevice.active);
            $('#flipcardsENumCards').text($exeDevice.cardsGame.length);
            $('#flipcardsENumberCard').val($exeDevice.active + 1);
            $exeDevice.updateCardsNumber();
        }
    },
    nextCard: function () {
        if ($exeDevice.validateCard() === false) return;
        if ($exeDevice.active < $exeDevice.cardsGame.length - 1) {
            $exeDevice.active++;
            $exeDevice.showCard($exeDevice.active);
        }

    },
    lastCard: function () {
        if ($exeDevice.validateCard() === false) return;
        if ($exeDevice.active < $exeDevice.cardsGame.length - 1) {
            $exeDevice.active = $exeDevice.cardsGame.length - 1;
            $exeDevice.showCard($exeDevice.active);
        }
    },
    previousCard: function () {
        if ($exeDevice.validateCard() === false) return;
        if ($exeDevice.active > 0) {
            $exeDevice.active--;
            $exeDevice.showCard($exeDevice.active);
        }

    },
    firstCard: function () {
        if ($exeDevice.validateCard() === false) return;
        if ($exeDevice.active > 0) {
            $exeDevice.active = 0;
            $exeDevice.showCard($exeDevice.active);
        }

    },

    showCard: function (i) {
        var num = i < 0 ? 0 : i;
        num = num >= $exeDevice.cardsGame.length ? $exeDevice.cardsGame.length - 1 : num;
        var p = $exeDevice.cardsGame[num];
        $exeDevice.stopSound();
        $('#flipcardsEURLImage').val(p.url);
        $('#flipcardsEX').val(p.x);
        $('#flipcardsEY').val(p.y);
        $('#flipcardsEAuthor').val(p.author);
        $('#flipcardsEAlt').val(p.alt);
        $('#flipcardsETextDiv').html($exeDevice.decodeURIComponentSafe(p.eText));
        $('#flipcardsEText').val($exeDevice.decodeURIComponentSafe(p.eText));
        $('#flipcardsEColor').val(p.color);
        $('#flipcardsEBgColor').val(p.backcolor);
        $('#flipcardsEURLAudio').val(p.audio);


        if (p.eText.length > 0) {
            $('#flipcardsETextDiv').show();
        } else {
            $('#flipcardsETextDiv').hide();
        }
        $('#flipcardsETextDiv').css({
            'color': p.color,
            'background-color': $exeDevice.hexToRgba(p.backcolor, 0.7)
        });

        $exeDevice.showImage(0);
        $('#flipcardsEURLImageBack').val(p.urlBk);
        $('#flipcardsEXBack').val(p.xBk);
        $('#flipcardsEYBack').val(p.yBk);
        $('#flipcardsEAuthorBack').val(p.authorBk);
        $('#flipcardsEAltBack').val(p.altBk);
        $('#flipcardsETextDivBack').html($exeDevice.decodeURIComponentSafe(p.eTextBk));
        $('#flipcardsETextBack').val($exeDevice.decodeURIComponentSafe(p.eTextBk));
        $('#flipcardsEColorBack').val(p.colorBk);
        $('#flipcardsEBgColorBack').val(p.backcolorBk);
        $('#flipcardsEURLAudioBack').val(p.audioBk);

        $exeDevice.showImage(1);
        if (p.eTextBk.length > 0) {
            $('#flipcardsETextDivBack').show();
        } else {
            $('#flipcardsETextDivBack').hide();
        }
        $('#flipcardsETextDivBack').css({
            'color': p.colorBk,
            'background-color': $exeDevice.hexToRgba(p.backcolorBk, 0.7)
        });
        $('#flipcardsENumberCard').val($exeDevice.active + 1);
        $('#flipcardsENumCards').text($exeDevice.cardsGame.length);
    },

    decodeURIComponentSafe: function (s) {
        if (!s) {
            return s;
        }
        return decodeURIComponent(s).replace("&percnt;", "%");

    },

    encodeURIComponentSafe: function (s) {
        if (!s) {
            return s;
        }
        return encodeURIComponent(s.replace("%", "&percnt;"));

    },

    validateCard: function () {
        var message = '',
            msgs = $exeDevice.msgs,
            p = new Object();
        $exeDevice.stopSound();
        p.url = $('#flipcardsEURLImage').val().trim();
        p.x = parseFloat($('#flipcardsEX').val());
        p.y = parseFloat($('#flipcardsEY').val());;
        p.author = $('#flipcardsEAuthor').val();
        p.alt = $('#flipcardsEAlt').val();
        p.audio = $('#flipcardsEURLAudio').val();
        p.color = $('#flipcardsEColor').val();
        p.backcolor = $('#flipcardsEBgColor').val();
        p.eText = $exeDevice.encodeURIComponentSafe($('#flipcardsEText').val());

        p.urlBk = $('#flipcardsEURLImageBack').val().trim();
        p.xBk = parseFloat($('#flipcardsEXBack').val());
        p.yBk = parseFloat($('#flipcardsEYBack').val());;
        p.authorBk = $('#flipcardsEAuthorBack').val();
        p.altBk = $('#flipcardsEAltBack').val();
        p.audioBk = $('#flipcardsEURLAudioBack').val();
        p.colorBk = $('#flipcardsEColorBack').val();
        p.backcolorBk = $('#flipcardsEBgColorBack').val();
        p.eTextBk = $exeDevice.encodeURIComponentSafe($('#flipcardsETextBack').val());
        if (p.eText.length == 0 && p.url.length == 0 && p.audio.length == 0) {
            message = msgs.msgCompleteData;
        }
        if (p.eTextBk.length == 0 && p.urlBk.length == 0 && p.audioBk.length == 0) {
            message = msgs.msgCompleteDataBack;
        }
        if (message.length == 0) {
            $exeDevice.cardsGame[$exeDevice.active] = p;
            message = true;
        } else {
            $exeDevice.showMessage(message);
            message = false;
        }
        return message;

    },

    getID: function () {
        return Math.floor(Math.random() * Date.now())
    },
    enableForm: function (field) {
        $exeDevice.initCards();
        $exeDevice.loadPreviousValues(field);
        $exeDevice.addEvents();
        $exeDevice.addEventCard();
    },
    updateCardsNumber: function () {
        var percentaje = parseInt($exeDevice.removeTags($('#flipcardsEPercentajeCards').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.cardsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#flipcardsENumeroPercentaje').text(num + "/" + $exeDevice.cardsGame.length)
    },


    addEventCard: function () {
        $('#flipcardsEAuthorAlt').hide();
        $('#flipcardsEAuthorAltBack').hide();
        $('#flipcardsEURLImage').on('change', function () {
            $exeDevice.loadImage(0);
        });
        $('#flipcardsEURLImageBack').on('change', function () {
            $exeDevice.loadImage(1);
        });
        $('#flipcardsEPlayImage').on('click', function (e) {
            e.preventDefault();
            $exeDevice.loadImage(0);
        });
        $('#flipcardsEPlayImageBack').on('click', function (e) {
            e.preventDefault();
            $exeDevice.loadImage(1);
        });
        $('#flipcardsEURLAudio').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#flipcardsEURLAudioBack').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#flipcardsEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var audio = $('#flipcardsEURLAudio').val();
            $exeDevice.loadAudio(audio);
        });
        $('#flipcardsEPlayAudioBack').on('click', function (e) {
            e.preventDefault();
            var audio = $('#flipcardsEURLAudioBack').val();
            $exeDevice.loadAudio(audio);
        });
        $('#flipcardsEShowMore').on('click', function (e) {
            e.preventDefault();
            $('#flipcardsEAuthorAlt').slideToggle();
        });
        $('#flipcardsEShowMoreBack').on('click', function (e) {
            e.preventDefault();
            $('#flipcardsEAuthorAltBack').slideToggle();
        });
        $('#flipcardsEText').on('keyup', function () {
            $('#flipcardsETextDiv').html($(this).val());
            if ($(this).val().trim().length > 0) {
                $('#flipcardsETextDiv').show();
            } else {
                $('#flipcardsETextDiv').hide();
            }
        });

        $('#flipcardsETextBack').on('keyup', function () {
            $('#flipcardsETextDivBack').html($(this).val());
            if ($(this).val().trim().length > 0) {
                $('#flipcardsETextDivBack').show();
            } else {
                $('#flipcardsETextDivBack').hide();
            }
        });

        $('#flipcardsEColor').on('change', function () {
            $('#flipcardsETextDiv').css('color', $(this).val());
        });

        $('#flipcardsEColorBack').on('change', function () {
            $('#flipcardsETextDivBack').css('color', $(this).val());
        });
        $('#flipcardsEBgColor').on('change', function () {
            var bc = $exeDevice.hexToRgba($(this).val(), 0.7);
            $('#flipcardsETextDiv').css({
                'background-color': bc
            });
        });

        $('#flipcardsEBgColorBack').on('change', function () {
            var bc = $exeDevice.hexToRgba($(this).val(), 0.7);
            $('#flipcardsETextDivBack').css({
                'background-color': bc
            });
        });

        $('#flipcardsEImage').on('click', function (e) {
            $exeDevice.clickImage(e.pageX, e.pageY);
        });
        $('#flipcardsECursor').on('click', function (e) {
            $(this).hide();
            $('#flipcardsEX').val(0);
            $('#flipcardsEY').val(0);
        });

        $('#flipcardsEImageBack').on('click', function (e) {
            $exeDevice.clickImageBack(e.pageX, e.pageY);
        });
        $('#flipcardsECursorBack').on('click', function (e) {
            $(this).hide();
            $('#flipcardsEXBack').val(0);
            $('#flipcardsEYBack').val(0);
        });
    },


    hexToRgba: function (hex, opacity) {
        return 'rgba(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function (l) {
            return parseInt(hex.length % 2 ? l + l : l, 16)
        }).concat(isFinite(opacity) ? opacity : 1).join(',') + ')';
    },

    getCardDefault: function () {
        var p = new Object();
        p.id = "";
        p.type = 2;
        p.url = '';
        p.audio = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        p.eText = '';
        p.color = '#000000';
        p.backcolor = "#ffffff";
        p.correct = 0
        p.urlBk = '';
        p.audioBk = '';
        p.xBk = 0;
        p.yBk = 0;
        p.authorBk = '';
        p.altBk = '';
        p.eTextBk = '';
        p.colorBk = '#000000';
        p.backcolorBk = "#ffffff";
        return p;
    },

    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.flipcards-DataGame', wrapper).text(),
                dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.flipcards-LinkImages', wrapper),
                $audiosLink = $('.flipcards-LinkAudios', wrapper),
                $imagesLinkBack = $('.flipcards-LinkImagesBack', wrapper),
                $audiosLinkBack = $('.flipcards-LinkAudiosBack', wrapper);
            $imagesLink.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.cardsGame.length) {
                    var flipcard = dataGame.cardsGame[iq];
                    flipcard.url = $(this).attr('href');
                    if (flipcard.url < 4) {
                        flipcard.url = "";
                    }
                }
            });
            $imagesLinkBack.each(function () {
                var iq = parseInt($(this).text());
                if (!isNaN(iq) && iq < dataGame.cardsGame.length) {
                    var flipcard = dataGame.cardsGame[iq];
                    flipcard.urlBk = $(this).attr('href');
                    if (flipcard.urlBk < 4) {
                        flipcard.urlBk = "";
                    }
                }
            });

            $audiosLink.each(function () {
                var iqa = parseInt($(this).text());
                if (!isNaN(iqa) && iqa < dataGame.cardsGame.length) {
                    var flipcard = dataGame.cardsGame[iqa];
                    flipcard.audio = $(this).attr('href');
                    if (flipcard.audio.length < 4) {
                        flipcard.audio = "";
                    }
                }
            });

            $audiosLinkBack.each(function () {
                var iqa = parseInt($(this).text());
                if (!isNaN(iqa) && iqa < dataGame.cardsGame.length) {
                    var flipcard = dataGame.cardsGame[iqa];
                    flipcard.audioBk = $(this).attr('href');
                    if (flipcard.audioBk.length < 4) {
                        flipcard.audioBk = "";
                    }
                }
            });

            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".flipcards-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textAfter = $(".flipcards-extra-content", wrapper);
            if (textAfter.length == 1) {
                textAfter = textAfter.html() || ''
                if (tinyMCE.get('eXeIdeviceTextAfter')) {
                    tinyMCE.get('eXeIdeviceTextAfter').setContent(textAfter);
                } else {
                    $("#eXeIdeviceTextAfter").val(textAfter)
                }
            }
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
            $exeDevice.showCard(0);
        }
    },

    save: function () {
        if (!$exeDevice.validateCard()) {
            return;
        }

        var dataGame = $exeDevice.validateData();
        var fields = this.ci18n,
            i18n = fields;
        for (var i in fields) {
            var fVal = $("#ci18n_" + i).val();
            if (fVal != "") i18n[i] = fVal;
        }
        dataGame.msgs = i18n;
        var json = JSON.stringify(dataGame),
            divContent = "";
        if (dataGame.instructions != "") divContent = '<div class="flipcards-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var linksMedias = $exeDevice.createlinksIMedias(dataGame.cardsGame),
            html = '<div class="flipcards-IDevice">';
        html += divContent
        html += '<div class="flipcards-DataGame js-hidden">' + json + '</div>';
        html += linksMedias;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="flipcards-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="flipcards-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
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

    createlinksIMedias: function (cardsGame) {
        var html = '';
        for (var i = 0; i < cardsGame.length; i++) {
            var p = cardsGame[i],
                linkImage = '';
            if (typeof p.url != "undefined" && p.url.length > 0 && p.url.indexOf('http') != 0) {
                linkImage = '<a href="' + p.url + '" class="js-hidden flipcards-LinkImages">' + i + '</a>';
                html += linkImage;
            }

            if (typeof p.urlBk != "undefined" && p.urlBk.length > 0 && p.urlBk.indexOf('http') != 0) {
                linkImage = '<a href="' + p.urlBk + '" class="js-hidden flipcards-LinkImagesBack">' + i + '</a>';
                html += linkImage;
            }

            if (typeof p.audio != "undefined" && p.audio.length > 0 && p.audio.indexOf('http') != 0) {
                linkImage = '<a href="' + p.audio + '" class="js-hidden flipcards-LinkAudios">' + i + '</a>';
                html += linkImage;
            }
            if (typeof p.audioBk != "undefined" && p.audioBk.length > 0 && p.audioBk.indexOf('http') != 0) {
                linkImage = '<a href="' + p.audioBk + '" class="js-hidden flipcards-LinkAudiosBack">' + i + '</a>';
                html += linkImage;
            }

        }
        return html;
    },


    showMessage: function (msg) {
        eXe.app.alert(msg);
    },

    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = tinyMCE.get('eXeGameInstructions').getContent(),
            textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent(),
            randomCards = $('#flipcardsERandomCards').is(':checked'),
            showMinimize = $('#flipcardsEShowMinimize').is(':checked'),
            showSolution = $('#flipcardsEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#flipcardsETimeShowSolution').val())),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            percentajeCards = parseInt(clear($('#flipcardsEPercentajeCards').val())),
            author = $('#flipcardsEAuthory').val(),
            cardsGame = $exeDevice.cardsGame,
            scorm = $exeAuthoring.iDevice.gamification.scorm.getValues(),
            type = parseInt($('input[name=flctype]:checked').val()),
            time = parseInt($('#flipcardsETime').val()),
            evaluation = $('#flipcardsEEvaluation').is(':checked'),
            evaluationID = $('#flipcardsEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();
        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }

        var data = {
            'typeGame': 'FlipCards',
            'author': author,
            'randomCards': randomCards,
            'instructions': instructions,
            'showMinimize': showMinimize,
            'itinerary': itinerary,
            'cardsGame': cardsGame,
            'isScorm': scorm.isScorm,
            'textButtonScorm': scorm.textButtonScorm,
            'repeatActivity': scorm.repeatActivity,
            'textAfter': escape(textAfter),
            'version': 1,
            'percentajeCards': percentajeCards,
            'version': $exeDevice.version,
            'type': type,
            'showSolution': showSolution,
            'timeShowSolution': timeShowSolution,
            'time': time,
            'evaluation':evaluation,
            'evaluationID':evaluationID,
            'id':id
        }
        return data;
    },
    showImage: function (type) {
        var $cursor = type == 0 ? $('#flipcardsECursor') : $('#flipcardsECursorBack'),
            $image = type == 0 ? $('#flipcardsEImage') : $('#flipcardsEImageBack'),
            $nimage = type == 0 ? $('#flipcardsENoImage') : $('#flipcardsENoImageBack'),
            x = type == 0 ? $('#flipcardsEX').val() : $('#flipcardsEXBack').val(),
            y = type == 0 ? $('#flipcardsEY').val() : $('#flipcardsEYBack').val(),
            alt = type == 0 ? $('#flipcardsEAlt').val() : $('#flipcardsEAltBack').val(),
            url = type == 0 ? $('#flipcardsEURLImage').val() : $('#flipcardsEURLImageBack').val();
        $image.hide();
        $cursor.hide();
        $image.attr('alt', alt);
        $nimage.show();
        $image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    $image.show();
                    $nimage.hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
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
                'z-index': 50
            });
            $(cursor).show();
        }
    },

    drawImage: function (image, mData) {
        $(image).css({
            'position': 'absolute',
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },

    addEvents: function () {
        $('#flipcardsEPasteC').hide();
        $('#flipcardsEAddC').on('click', function (e) {
            e.preventDefault();
            if ($exeDevice.cardsGame.length > 200) {
                $exeDevice.showMessage($exeDevice.msgs.msgMaxCards.replace('%s', 200));
                return;
            }
            $exeDevice.addCard(true);

        });
        $('#flipcardsEDeleteC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeCard();

        });

        $('#flipcardsECopyC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyCard();

        });
        $('#flipcardsECutC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutCard();

        });
        $('#flipcardsEPasteC').on('click', function (e) {
            e.preventDefault();
            if ($exeDevice.cardsGame.length > 200) {
                $exeDevice.showMessage($exeDevice.msgs.msgMaxCards.replace('%s', 200));
                return;
            }
            $exeDevice.pasteCard();

        });

        $('#flipcardsEFirstC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstCard()
        });
        $('#flipcardsEPreviousC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousCard()
        });
        $('#flipcardsENextC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextCard();
        });
        $('#flipcardsELastC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastCard();
        });

        $('#flipcardsEReverseFaces').on('click', function (e) {
            e.preventDefault();
            $exeDevice.reverseFaces();

        });
        $('#flipcardsEReverseCard').on('click', function (e) {
            e.preventDefault();
            $exeDevice.reverseCard();
        });

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $('#eXeGameExportImport .exe-field-instructions').eq(0).text( _("Supported formats") + ': json, txt');
            $('#eXeGameExportImport').show();
            $('#eXeGameImportGame').attr('accept', '.txt, .json, .xml');
            $('#eXeGameImportGame').on('change', function (e) {
                var file = e.target.files[0];
                if (!file) {
                    eXe.app.alert(_("Select a file")  + _( "(txt, json)"));
                    return;
                }
                if (!file.type || !(file.type.match('text/plain') || file.type.match('application/json') || file.type.match('application/xml') || file.type.match('text/xml'))) {
                    eXe.app.alert(_("Select a file")  + _( "(txt, json)"));
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $exeDevice.importGame(e.target.result, file.type);
                };
                reader.readAsText(file);
            });
            $('#eXeGameExportGame').on('click', function () {
                $exeDevice.exportGame();
            })
        } else {
            $('#eXeGameExportImport').hide();
        }
        $('#flipcardsEPercentajeCards').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateCardsNumber();
            }
        });
        $('#flipcardsEPercentajeCards').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateCardsNumber();
        });


        $('#flipcardsEPercentajeCards').on('click', function () {
            $exeDevice.updateCardsNumber();
        });

        $('#flipcardsEURLAudioDefinition').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#flipcardsENumberCard').keyup(function (e) {
            if (e.keyCode == 13) {
                var num = parseInt($(this).val());
                if (!isNaN(num) && num > 0) {
                    if ($exeDevice.validateCard() === false) {
                        $(this).val($exeDevice.active + 1);
                    } else {
                        $exeDevice.active = num < $exeDevice.cardsGame.length ? num - 1 : $exeDevice.cardsGame.length - 1;
                        $exeDevice.showCard($exeDevice.active);
                    }
                } else {
                    $(this).val($exeDevice.active + 1)
                }

            }
        });
        $('#flipcardsETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#flipcardsETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 59 ? 59 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        $('#flipcardsEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#flipcardsETimeShowSolution').prop('disabled', !marcado);
        });

        $('#flipcardsETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#flipcardsETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#gameIdeviceForm').on('click', 'input.FLCRDS-Type', function (e) {
            var type = parseInt($(this).val());
            $("#flipcardsETimeDiv").hide();
            if (type == 3) {
                $("#flipcardsETimeDiv").show();
            }
        });
        $('#flipcardsEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#flipcardsEEvaluationID').prop('disabled', !marcado);
        });
        $("#flipcardsEEvaluationHelpLnk").click(function () {
            $("#flipcardsEEvaluationHelp").toggle();
            return false;

        });

        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },
    reverseFaces: function () {
        if (!$exeDevice.validateCard()) {
            return;
        }
        for (var i = 0; i < $exeDevice.cardsGame.length; i++) {
            var p = $exeDevice.cardsGame[i],
                url = p.url,
                x = p.x,
                y = p.y,
                author = p.author,
                alt = p.alt,
                text = p.eText,
                color = p.color,
                bkcolor = p.backcolor,
                audio = p.audio;
            p.url = p.urlBk;
            p.x = p.xBk;
            p.y = p.yBk;
            p.author = p.authorBk;
            p.alt = p.altBk;
            p.eText = p.eTextBk;
            p.color = p.colorBk;
            p.backcolor = p.backcolorBk;
            p.audio = p.audioBk;
            p.urlBk = url;
            p.xBk = x;
            p.yBk = y;
            p.authorBk = author;
            p.altBk = alt;
            p.eTextBk = text;
            p.colorBk = color;
            p.backcolorBk = bkcolor;
            p.audioBk = audio;

        }
        $exeDevice.showCard($exeDevice.active);
    },
    reverseCard: function () {
        if (!$exeDevice.validateCard()) {
            return;
        }
        var p = $exeDevice.cardsGame[$exeDevice.active],
            url = p.url,
            x = p.x,
            y = p.y,
            author = p.author,
            alt = p.alt,
            text = p.eText,
            color = p.color,
            bkcolor = p.backcolor,
            audio = p.audio;
        p.url = p.urlBk;
        p.x = p.xBk;
        p.y = p.yBk;
        p.author = p.authorBk;
        p.alt = p.altBk;
        p.eText = p.eTextBk;
        p.color = p.colorBk;
        p.backcolor = p.backcolorBk;
        p.audio = p.audioBk;
        p.urlBk = url;
        p.xBk = x;
        p.yBk = y;
        p.authorBk = author;
        p.altBk = alt;
        p.eTextBk = text;
        p.colorBk = color;
        p.backcolorBk = bkcolor;
        p.audioBk = audio;
        $exeDevice.showCard($exeDevice.active);
    },
    nextCard: function () {
        if ($exeDevice.validateCard() != false) {
            if ($exeDevice.active < $exeDevice.cardsGame.length - 1) {
                $exeDevice.active++;
                $exeDevice.showCard($exeDevice.active);
            }
        }
    },
    loadImage: function (type) {
        var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
            url = type == 0 ? $('#flipcardsEURLImage').val() : $('#flipcardsEURLImageBack').val(),
            ext = url.split('.').pop().toLowerCase();
        if ((url.indexOf('resources') == 0 || url.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
            $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
            return false;
        }
        $exeDevice.showImage(type);

    },
    loadAudio: function (url) {
        var validExt = ['mp3', 'ogg', 'waw'],
            ext = url.split('.').pop().toLowerCase();
        if ((url.indexOf('resources') == 0 || url.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
            $exeDevice.showMessage(_("Supported formats") + ": mp3, ogg...");
            return false;
        } else {
            if (url.length > 4) {
                $exeDevice.stopSound();
                $exeDevice.playSound(url);
            }
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
        $exeDevice.active = 0;
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
        game.evaluation = typeof game.evaluation != "undefined" ? game.evaluation : false;
        game.evaluationID = typeof game.evaluationID != "undefined" ? game.evaluationID : '';
        $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
        $('#flipcardsEShowMinimize').prop('checked', game.showMinimize);
        $('#flipcardsEPercentajeCards').val(game.percentajeCards);
        $('#flipcardsEAuthory').val(game.author);
        $('#flipcardsERandomCards').prop('checked', game.randomCards);
        $('#flipcardsEShowSolution').prop('checked', game.showSolution);
        $('#flipcardsETimeShowSolution').val(game.timeShowSolution)
        $('#flipcardsETimeShowSolution').prop('disabled', !game.showSolution);
        $('#flipcardsETime').val(game.time);
        $("input.FLCRDS-Type[name='flctype'][value='" + game.type + "']").prop("checked", true);
        $("#flipcardsETimeDiv").hide();
        $('#flipcardsEEvaluation').prop('checked', game.evaluation);
        $('#flipcardsEEvaluationID').val(game.evaluationID);
        $("#flipcardsEEvaluationID").prop('disabled', (!game.evaluation));
        if (game.type == 3) {
            $("#flipcardsETimeDiv").show();
        }
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.cardsGame = game.cardsGame;
        $('#flipcardsENumCards').text($exeDevice.cardsGame.length);
        $exeDevice.updateCardsNumber();
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
        link.download = _("Activity") + "-Tarjetas.json";
        document.getElementById('gameIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importText: function(content){
        var lines = content.split('\n'),
             lineFormat = /^([^#]+)#([^#]+)(#([^#]+))?(#([^#]+))?$/,
             valids= 0;
         lines.forEach(function(line) {
            var p = $exeDevice.getCardDefault();
            if (lineFormat.test(line)) {
                var linarray = line.trim().split("#")
                p.eText = linarray[0];
                p.eTextBk = linarray[1];
                $exeDevice.cardsGame.push(p);
                valids++;
            }
        });
        return valids > 0 ? $exeDevice.cardsGame : false;
    },
    importCuestionaryXML1: function(xmlText) {
        var parser = new DOMParser(),
            xmlDoc = parser.parseFromString(xmlText, "text/xml");
        if ($(xmlDoc).find("parsererror").length > 0) {
            return false;
        }
        var quiz = $(xmlDoc).find("quiz").first();
        if (quiz.length === 0) {
            return false;
        }
        var questions = quiz.find("question"),
           questionsJson = [];
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i],
                type = $(question).attr('type');
            if (type !== 'shortanswer') continue;
            var questionText = $(question).find("questiontext").first().text(),
                answers = $(question).find("answer"),
                word = '',
                maxFraction = -1; 
                for (var j = 0; j < answers.length; j++) {
                    var answer = answers[j],
                        answerHtml = $(answer).find('text').eq(0).text().trim(), 
                        answerTextParts = answerHtml.split("\n")
                        answerText = answerTextParts[0].trim(),
                        currentFraction = parseInt($(answer).attr('fraction'));  
                    if (currentFraction > maxFraction) { 
                        maxFraction = currentFraction;
                        word = answerText;
                    }
                }

            questionsJson.push({
                definition: $exeDevice.removeTags(questionText.trim()),
                word: word,
            });
        }
        var valids = 0;
        for (var i = 0; i < questionsJson.length; i++){
            var question = questionsJson[i],
            p = $exeDevice.getCardDefault();
            p.eText= question.word;
            p.eTextBk = question.definition;
            if( p.eText &&  p.eText.length > 0  && p.eTextBk && p.eTextBk.length > 0){
                $exeDevice.cardsGame.push(p);
                valids++;
            }

        };
        return valids > 0 ? $exeDevice.cardsGame : false;
    },
    importMoodle(xmlString) {
        var xmlDoc = $.parseXML(xmlString),
            $xml = $(xmlDoc);
        if ($xml.find("GLOSSARY").length > 0) {
            return $exeDevice.importGlosary(xmlString);
        }
        else if ($xml.find("quiz").length > 0) {
            return $exeDevice.importCuestionaryXML(xmlString);
        } else {
            return false;
        }
      },
    importCuestionaryXML: function(xmlText) {
        var parser = new DOMParser(),
            xmlDoc = parser.parseFromString(xmlText, "text/xml"),
            $xml = $(xmlDoc);
        if ($xml.find("parsererror").length > 0) {
            return false;
        }
        var $quiz = $xml.find("quiz").first();
        if ($quiz.length === 0) {
            return false;
        }
        var cardsJson = [];
        $quiz.find("question").each(function() {
            var $question = $(this),
                type = $question.attr('type');
            if (type !== 'shortanswer') {
                return true
            }
            var questionText = $question.find("questiontext").first().text().trim(),
                $answers = $question.find("answer"),
                eText = '',
                maxFraction = -1;
            $answers.each(function() {
                var $answer = $(this),
                    answerText = $answer.find('text').eq(0).text(),
                    currentFraction = parseInt($answer.attr('fraction'));
                if (currentFraction > maxFraction) {
                    maxFraction = currentFraction;
                    eText = answerText;
                }
            });
            if (eText && eText.length > 0 && questionText && questionText.length > 0  ) {
                cardsJson.push({
                    eTextBk: $exeDevice.removeTags(questionText),
                    eText: $exeDevice.removeTags(eText),
                });
            }
        });
        var validQuestions = [];
        cardsJson.forEach(function(card) {
            var p = $exeDevice.getCardDefault();
            p.eTextBk = card.eTextBk;
            p.eText = card.eText;
            if (p.eText.length > 0 && p.eTextBk.length > 0) {
                $exeDevice.cardsGame.push(p);
                validQuestions.push(p);
            }
        });
        return validQuestions.length > 0 ? $exeDevice.cardsGame : false;
    },
    importGlosary: function(xmlText) {
        var parser = new DOMParser(),
            xmlDoc = parser.parseFromString(xmlText, "text/xml"),
            $xml = $(xmlDoc);
        if ($xml.find("parsererror").length > 0) {
            return false;
        }
        var $entries = $xml.find("ENTRIES").first();
        if ($entries.length === 0) {
            return false;
        }
        var cardsJson = [];
        $entries.find("ENTRY").each(function() {
            var $this = $(this),
                concept = $this.find("CONCEPT").text(),
                definition = $this.find("DEFINITION").text().replace(/<[^>]*>/g, '');  // Elimina HTML
            if (concept && definition) {
                cardsJson.push({
                    eText: concept,
                    eTextBk: definition
                });
            }
        });
        var valids = 0;
        cardsJson.forEach(function(card) {
            var p = $exeDevice.getCardDefault();
            p.eTextBk = card.eTextBk;
            p.eText = card.eText;
            if (p.eText.length > 0 && p.eTextBk.length > 0) {
                $exeDevice.cardsGame.push(p);
                valids++;
            }
        });
        return valids > 0 ? $exeDevice.cardsGame : false;
    },

    importGame: function (content, filetype) {
        var game = $exeDevice.isJsonString(content);
        if (content && content.includes('\u0000')){
            $exeDevice.showMessage(_('Sorry, wrong file format'));
            return;
        } else if (!game && content){
            var cards = false;
            if(filetype.match('text/plain')){
                cards = $exeDevice.importText(content);
            }else if(filetype.match('application/xml') || filetype.match('text/xml')){
                cards =  $exeDevice.importMoodle(content);
            }
            if(cards && cards.length > 0){
                $exeDevice.cardsGame = cards;
            }else{
                $exeDevice.showMessage(_('Sorry, wrong file format'));
                return
            }
        } else if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'FlipCards') {
            $exeDevice.active = 0;
            game.id = $exeDevice.generarID();
            $exeDevice.updateFieldGame(game);
            var instructions = game.instructionsExe || game.instructions,
                tAfter = game.textAfter || "";
            if (tinyMCE.get('eXeGameInstructions')) {
                tinyMCE.get('eXeGameInstructions').setContent(unescape(instructions));
            } else {
                $("#eXeGameInstructions").val(unescape(instructions))
            }
            if (tinyMCE.get('eXeIdeviceTextAfter')) {
                tinyMCE.get('eXeIdeviceTextAfter').setContent(unescape(tAfter));
            } else {
                $("#eXeIdeviceTextAfter").val(unescape(tAfter))
            }

        } else if (game.typeGame == 'Rosco') {
            $exeDevice.cardsGame = $exeDevice.importRosco(game);
        } else if (game.typeGame == 'QuExt') {
            $exeDevice.cardsGame = $exeDevice.importQuExt(game);
        } else if (game.typeGame == 'Sopa') {
            $exeDevice.cardsGame = $exeDevice.importSopa(game);
        } else if (game.typeGame == 'Adivina') {
            $exeDevice.cardsGame = $exeDevice.importAdivina(game);
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.active = 0;
        $exeDevice.showCard($exeDevice.active);
        $exeDevice.deleteEmptyQuestion();
        $exeDevice.updateCardsNumber();
        $('.exe-form-tabs li:first-child a').click();
    },
    importRosco: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCardDefault(),
                cuestion = data.wordsGame[i];
            p.eText = cuestion.definition;
            p.url = cuestion.url;
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.solution = '';
            p.eTextBk = cuestion.word;
            if (p.url.length > 3 || p.audio.length > 3 || p.eText.length > 0) {
                $exeDevice.cardsGame.push(p);
            }
        }
        return $exeDevice.cardsGame;
    },


    importSopa: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCardDefault(),
                cuestion = data.wordsGame[i];
            p.eText = cuestion.definition;
            p.url = cuestion.url;
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.solution = '';
            p.eTextBk = cuestion.word;
            if (p.url.length > 3 || p.audio.length > 3 || p.eText.length > 0) {
                $exeDevice.cardsGame.push(p);
            }
        }
        return $exeDevice.cardsGame;
    },
    importQuExt: function (data) {
        for (var i = 0; i < data.questionsGame.length; i++) {
            var p = $exeDevice.getCardDefault(),
                cuestion = data.questionsGame[i];
            p.eText = cuestion.quextion;
            p.url = cuestion.url;
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.solution = '';
            p.eTextBk = '';
            if (typeof cuestion.options != "undefined" && cuestion.options.length > cuestion.solution) {
                p.eTextBk = cuestion.options[cuestion.solution];
            }
            if (p.eText.length > 0) {
                $exeDevice.cardsGame.push(p);
            }
        }
        return $exeDevice.cardsGame;
    },
    importAdivina: function (data) {
        for (var i = 0; i < data.wordsGame.length; i++) {
            var p = $exeDevice.getCardDefault(),
                cuestion = data.wordsGame[i];
            p.eText = cuestion.word;
            p.url = cuestion.url;
            p.audio = typeof cuestion.audio == "undefined" ? "" : cuestion.audio;
            p.x = cuestion.x;
            p.y = cuestion.y;
            p.author = cuestion.author;
            p.alt = cuestion.alt;
            p.solution = '';
            p.eTextBk = cuestion.definition;
            if (p.url.length > 3 || p.audio.length > 3 || p.eText.length > 0) {
                $exeDevice.cardsGame.push(p);
            }
        }
        return $exeDevice.cardsGame;
    },

    deleteEmptyQuestion: function () {
        var url = $('#flipcardsEURLImage').val().trim(),
            audio = $('#flipcardsEURLAudio').val().trim(),
            eText = $('#flipcardsEText').val().trim();
        if ($exeDevice.cardsGame.length > 1) {
            if (url.length == 0 && audio.length == 0 && eText.length == 0) {
                $exeDevice.removeCard();
            }
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
        var time = Math.round(totalSec),
            hours = parseInt(time / 3600) % 24,
            minutes = parseInt(time / 60) % 60,
            seconds = time % 60;
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
        };

    },

    clickImage: function (epx, epy) {
        var $cursor = $('#flipcardsECursor'),
            $image = $('#flipcardsEImage'),
            $x = $('#flipcardsEX'),
            $y = $('#flipcardsEY');
        var posX = epx - $image.offset().left,
            posY = epy - $image.offset().top,
            wI = $image.width() > 0 ? $image.width() : 1,
            hI = $image.height() > 0 ? $image.height() : 1,
            lI = $image.position().left,
            tI = $image.position().top;
        $x.val(posX / wI);
        $y.val(posY / hI);
        $cursor.css({
            left: posX + lI,
            top: posY + tI,
            'z-index': 50
        });
        $cursor.show();
    },
    clickImageBack: function (epx, epy) {
        var $cursor = $('#flipcardsECursorBack'),
            $image = $('#flipcardsEImageBack'),
            $x = $('#flipcardsEXBack'),
            $y = $('#flipcardsEYBack');
        var posX = epx - $image.offset().left,
            posY = epy - $image.offset().top,
            wI = $image.width() > 0 ? $image.width() : 1,
            hI = $image.height() > 0 ? $image.height() : 1,
            lI = $image.position().left,
            tI = $image.position().top;
        $x.val(posX / wI);
        $y.val(posY / hI);
        $cursor.css({
            left: posX + lI,
            top: posY + tI,
            'z-index': 50
        });
        $cursor.show();
    },
    removeTags: function (str) {
        var wrapper = $("<div></div>");
        wrapper.html(str);
        return wrapper.text();
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
        urlmedia = urlmedia || '';
        var sUrl = urlmedia || '';
        if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $exeDevice.getURLAudioMediaTeca(urlmedia)) {
            sUrl = $exeDevice.getURLAudioMediaTeca(urlmedia);
        }
        return sUrl;
    }

}