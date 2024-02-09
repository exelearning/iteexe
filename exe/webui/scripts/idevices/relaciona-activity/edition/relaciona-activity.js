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
        name: _('Relate')
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
    iDevicePath: "/scripts/idevices/relaciona-activity/edition/",
    playerAudio: "",
    version: 1.3,
    id:false,
    ci18n: {
        "msgSubmit": _("Submit"),
        "msgClue": _("Cool! The clue is:"),
        "msgCodeAccess": _("Access code"),
        "msgPlayStart": _("Click here to play"),
        "msgScore": _("Score"),
        "msgErrors": _("Errors"),
        "msgHits": _("Hits"),
        "msgScore": _("Score"),
        "msgMinimize": _("Minimize"),
        "msgMaximize": _("Maximize"),
        "msgFullScreen": _("Full Screen"),
        "msgExitFullScreen": _("Exit Full Screen"),
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
        "msgNumQuestions": _("Number of cards"),
        "msgTryAgain": _("You need at least %s&percnt; of correct answers to get the information. Please try again."),
        "msgEndGameM": _("You finished the game. Your score is %s."),
        "msgUncompletedActivity": _("Not done activity"),
        "msgSuccessfulActivity": _("Activity: Passed. Score: %S"),
        "msgUnsuccessfulActivity": _("Activity: Not passed. Score: %S"),
        "msgTypeGame": _('Relate')


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
        $('#rclETextDiv').hide();
        $('#rclETextDivBack').hide();
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
            <div class="exe-idevice-info">' + _("Create matching games with images, sounds and enriched texts.") + ' <a href="https://youtu.be/ADrG4vz2W0Y" hreflang="es" rel="lightbox"  target="_blank">' + _("Use Instructions") + '</a></div>\
            <div class="exe-form-tab" title="' + _('General settings') + '">\
            ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_('Match each card with its pair.')) + '\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">' + _('Options') + '</a></legend>\
                    <div>\
                        <p>\
                            <span>' + _("Level") + ':</span>\
                            <span class="RLC-EInputType">\
                                <input class="RLC-Type" checked id="rclETypeShow" type="radio" name="flctype" value="0"/>\
                                <label for="rclETypeShow">' + _("Essential") + '</label>\
                                <input class="RLC-Type"  id="rclETypeNavigation" type="radio" name="flctype" value="1"/>\
                                <label for="rclETypeNavigation">' + _("Medium") + '</label>\
                                <input class="RLC-Type"  id="rclETypeIdentify" type="radio" name="flctype" value="2"/>\
                                <label for="rclETypeIdentify">' + _("Advanced") + '</label>\
                            </span>\
                        </p>\
                        <p style="display:none">\
							<label for="rclEShowSolution"><input type="checkbox" checked id="rclEShowSolution"> ' + _("Show solutions") + '. </label> \
							<label for="rclETimeShowSolution">' + _("Show solution time (seconds)") + ':\
							<input type="number" name="rclETimeShowSolution" id="rclETimeShowSolution" value="3" min="1" max="9" /> </label>\
                         </p>\
                         <p id="rclETimeDiv" style="display:none;">\
                            <label for="rclETime">' + _("Time (minutes)") + ':\
                            <input type="number" name="rclETime" id="rclETime" value="3" min="0" max="59" /> </label>\
                        </p>\
                        <p>\
                            <label for="rclEShowMinimize"><input type="checkbox" id="rclEShowMinimize">' + _('Show minimized.') + '</label>\
                        </p>\
                        <p>\
                            <label for="rclEPercentajeCards">% ' + _('Cards') + ':</label><input type="number" name="rclEPercentajeCards" id="rclEPercentajeCards" value="100" min="1" max="100" />\
                            <span id="rclENumeroPercentaje">1/1</span>\
                        </p>\
                        <p>\
                            <label for="rclEAuthory">' + _('Authorship') + ': </label><input id="rclEAuthory" type="text" />\
                        </p>\
                        <p>\
                            <strong class="GameModeLabel"><a href="#rclEEvaluationHelp" id="rclEEvaluationHelpLnk" class="GameModeHelpLink" title="' + _("Help") + '"><img src="' + path + 'quextIEHelp.gif"  width="16" height="16" alt="' + _("Help") + '"/></a></strong>\
							<label for="rclEEvaluation"><input type="checkbox" id="rclEEvaluation"> ' + _("Progress report") + '. </label> \
							<label for="rclEEvaluationID">' + _("Identifier") + ':\
							<input type="text" id="rclEEvaluationID" disabled/> </label>\
                        </p>\
                        <div id="rclEEvaluationHelp" class="RLC-TypeGameHelp">\
                            <p>' +_("You must indicate the identifier. It can be a word, a phrase or a number of more than four characters, which you will use to mark the activities that will be taken into account in this progress report. It must be the same in all iDevices of a report and different in those of each report.") + '</p>\
                        </div>\
                    </div>\
                </fieldset>\
                <fieldset class="exe-fieldset">\
                <legend><a href="#">' + _('Pairs') + '</a></legend>\
                <div class="RLC-EPanel" id="rclEPanel">\
                    <div class="RLC-EPhrase" id="rclEPhrase">\
                        <div class="RLC-EDatosCarta RLC-EFront" id="rclEDatosCarta">\
                            <div class="RLC-EMultimedia">\
                                <div class="RLC-ECard">\
                                    <img class="RLC-EHideRLC-EImage" id="rclEImage"  src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <img class="RLC-ECursor" id="rclECursor" src="' + path + 'quextIECursor.gif" alt="" />\
                                    <img class="RLC-EHideRLC-NoImage" id="rclENoImage" src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <div class="RLC-ETextDiv" id="rclETextDiv"></div>\
                                </div>\
                            </div>\
                            <span class="RLC-ETitleText" id="rclETitleText">' + _('Text') + '</span>\
                            <div class="RLC-EInputText" id="rclEInputText">\
                                <label class="sr-av">' + _('Text') + '</label><input type="text" id="rclEText" class="RLC-EText" />\
                                <label id="rclELblColor" class="RLC-LblColor">' + _('Color') + ': </label><input id="rclEColor"  type="color"  class="RLC-EColor" value="#000000">\
                                <label id="rclELblBgColor"  class="RLC-LblBgColor">' + _('Background') + ': </label><input id="rclEBgColor"  type="color"   class="RLC-EBackColor" value="#ffffff">\
                            </div>\
                            <span class="RLC-ETitleImage" id="rclETitleImage">' + _('Image') + '</span>\
                            <div class="RLC-EInputImage"  id="rclEInputImage">\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="rclEURLImage" class="exe-file-picker RLC-EURLImage"/>\
                                <a href="#" id="rclEPlayImage" class="RLC-ENavigationButton RLC-EPlayVideo" title="' + _('Show') + '"><img src="' + path + 'quextIEPlay.png" alt="' + _('Show') + '" class="RLC-EButtonImage b-play" /></a>\
                                <a href="#" id="rclEShowMore" class="RLC-ENavigationButton RLC-EShowMore" title="' + _('More') + '"><img src="' + path + 'quextEIMore.png" alt="' + _('More') + '" class="RLC-EButtonImage b-play" /></a>\
                            </div>\
                            <div class="RLC-ECoord">\
                                    <label >X:</label>\
                                    <input id="rclEX" class="RLC-EX" type="text" value="0" />\
                                    <label >Y:</label>\
                                    <input id="rclEY" class="RLC-EY" type="text" value="0" />\
                            </div>\
                            <div class="RLC-EAuthorAlt"  id="rclEAuthorAlt">\
                                <div class="RLC-EInputAuthor">\
                                    <label>' + _('Authorship') + '</label><input id="rclEAuthor" type="text"  class="RLC-EAuthor" />\
                                </div>\
                                <div class="RLC-EInputAlt">\
                                    <label>' + _('Alternative text') + '</label><input  id="rclEAlt" type="text" class="RLC-EAlt" />\
                                </div>\
                            </div>\
                            <span >' + _('Audio') + '</span>\
                            <div class="RLC-EInputAudio" >\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="rclEURLAudio" class="exe-file-picker RLC-EURLAudio"  />\
                                <a href="#" id="rclEPlayAudio" class="RLC-ENavigationButton RLC-EPlayVideo" title="' + _('Audio') + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="RLC-EButtonImage b-play" /></a>\
                            </div>\
                        </div>\
                        <div class="RLC-EDatosCarta RLC-EBack" id="rclEDatosCartaBack">\
                            <div class="RLC-EMultimedia">\
                                <div class="RLC-ECard">\
                                    <img class="RLC-EHideRLC-EImage" id="rclEImageBack"  src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <img class="RLC-ECursor" id="rclECursorBack" src="' + path + 'quextIECursor.gif" alt="" />\
                                    <img class="RLC-EHideRLC-NoImage" id="rclENoImageBack" src="' + path + 'quextIEImage.png" alt="' + _('No image') + '" />\
                                    <div class="RLC-ETextDiv" id="rclETextDivBack"></div>\
                                </div>\
                            </div>\
                            <span class="RLC-ETitleText" id="rclETitleTextBack">' + _('Text') + '</span>\
                            <div class="RLC-EInputText" id="rclEInputTextBack">\
                                <label class="sr-av">' + _('Text') + '</label><input type="text" id="rclETextBack" class="RLC-EText" />\
                                <label id="rclELblColorBack class="RLC-LblColor">' + _('Color') + ': </label><input id="rclEColorBack"  type="color"  class="RLC-EColor" value="#000000">\
                                <label id="rclELblBgColorBack"  class="RLC-LblBgColor">' + _('Background') + ': </label><input id="rclEBgColorBack"  type="color"   class="RLC-EBackColor" value="#ffffff">\
                            </div>\
                            <span class="RLC-ETitleImage" id="rclETitleImageBack">' + _('Image') + '</span>\
                            <div class="RLC-EInputImage"  id="rclEInputImageBack">\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="rclEURLImageBack" class="exe-file-picker RLC-EURLImage"/>\
                                <a href="#" id="rclEPlayImageBack" class="RLC-ENavigationButton RLC-EPlayVideo" title="' + _('Show') + '"><img src="' + path + 'quextIEPlay.png" alt="' + _('Show') + '" class="RLC-EButtonImage b-play" /></a>\
                                <a href="#" id="rclEShowMoreBack" class="RLC-ENavigationButton RLC-EShowMore" title="' + _('More') + '"><img src="' + path + 'quextEIMore.png" alt="' + _('More') + '" class="RLC-EButtonImage b-play" /></a>\
                            </div>\
                            <div class="RLC-ECoord">\
                                    <label >X:</label>\
                                    <input id="rclEXBack" class="RLC-EX" type="text" value="0" />\
                                    <label >Y:</label>\
                                    <input id="rclEYBack" class="RLC-EY" type="text" value="0" />\
                            </div>\
                            <div class="RLC-EAuthorAlt"  id="rclEAuthorAltBack">\
                                <div class="RLC-EInputAuthor">\
                                    <label>' + _('Authorship') + '</label><input id="rclEAuthorBack" type="text" class="RLC-EAuthor" />\
                                </div>\
                                <div class="RLC-EInputAlt">\
                                    <label>' + _('Alternative text') + '</label><input id="rclEAltBack" type="text" class="RLC-EAlt" />\
                                </div>\
                            </div>\
                            <span >' + _('Audio') + '</span>\
                            <div class="RLC-EInputAudio" >\
                                <label class="sr-av" >URL</label>\
                                <input type="text" id="rclEURLAudioBack" class="exe-file-picker RLC-EURLAudio"  />\
                                <a href="#" id="rclEPlayAudioBack" class="RLC-ENavigationButton RLC-EPlayVideo" title="' + _('Audio') + '"><img src="' + path + 'quextIEPlay.png" alt="Play" class="RLC-EButtonImage b-play" /></a>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="RLC-EReverseFacces">\
                        <a href="#" id="rclEReverseCard" title="' + _('Flip down the card') + '">' + _('Flip down the card') + '</a>\
                        <a href="#" id="rclEReverseFaces" title="' + _('Flip down all the cards') + '">' + _('Flip down all the cards') + '</a>\
                    </div>\
                    <div class="RLC-ENavigationButtons">\
                        <a href="#" id="rclEAddC" class="RLC-ENavigationButton" title="' + _("Add question") + '"><img src="' + path + 'quextIEAdd.png" alt="' + _("Add question") + '" class="RLC-EButtonImage" /></a>\
                        <a href="#" id="rclEFirstC" class="RLC-ENavigationButton"  title="' + _("First question") + '"><img src="' + path + 'quextIEFirst.png"  alt="' + _("First question") + '" class="RLC-EButtonImage" /></a>\
                        <a href="#" id="rclEPreviousC" class="RLC-ENavigationButton" title="' + _("Previous question") + '"><img src="' + path + 'quextIEPrev.png" alt="' + _("Previous question") + '" class="RLC-EButtonImage" /></a>\
                        <label class="sr-av" for="rclENumberCard">' + _("Question number:") + ':</label><input type="text" class="RLC-NumberCard"  id="rclENumberCard" value="1"/>\
                        <a href="#" id="rclENextC" class="RLC-ENavigationButton"  title="' + _("Next question") + '"><img src="' + path + 'quextIENext.png" alt="' + _("Next question") + '" class="RLC-EButtonImage" /></a>\
                        <a href="#" id="rclELastC" class="RLC-ENavigationButton"  title="' + _("Last question") + '"><img src="' + path + 'quextIELast.png" alt="' + _("Last question") + '" class="RLC-EButtonImage" /></a>\
                        <a href="#" id="rclEDeleteC" class="RLC-ENavigationButton" title="' + _("Delete question") + '"><img src="' + path + 'quextIEDelete.png" alt="' + _("Delete question") + '" class="RLC-EButtonImage" /></a>\
                        <a href="#" id="rclECopyC" class="RLC-ENavigationButton" title="' + _("Copy question") + '"><img src="' + path + 'quextIECopy.png" alt="' + _("Copy question") + '" class="RLC-EButtonImage" /></a>\
                        <a href="#" id="rclECutC" class="RLC-ENavigationButton" title="' + _("Cut question") + '"><img src="' + path + 'quextIECut.png" alt="' + _("Cut question") + '"  class="RLC-EButtonImage" /></a>\
                        <a href="#" id="rclEPasteC" class="RLC-ENavigationButton"  title="' + _("Paste question") + '"><img src="' + path + 'quextIEPaste.png" alt="' + _("Paste question") + '" class="RLC-EButtonImage" /></a>\
                    </div>\
                    <div class="RLC-ENumCardDiv" id="rclENumCardsDiv">\
                        <div class="RLC-ENumCardsIcon"><span class="sr-av">' + _('Cards') + ':</span></div> <span class="RLC-ENumCards" id="rclENumCards">0</span>\
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

        $('#rclEURLImage').val('');
        $('#rclEX').val('0');
        $('#rclEY').val('0');
        $('#rclEAuthor').val('');
        $('#rclEAlt').val('');
        $('#rclEURLAudio').val('');
        $('#rclEText').val('');
        $('#rclETextDiv').val('');
        $('#rclEColor').val('#000000');
        $('#rclEBgColor').val('#ffffff');
        $('#rclETextDiv').hide();
        $('#rclETextDiv').css({
            'background-color': $exeDevice.hexToRgba('#ffffff', 0.7),
            'color': '#000000'
        });

        $exeDevice.showImage(0);

        $('#rclEURLImageBack').val('');
        $('#rclEXBack').val('0');
        $('#rclEYBack').val('0');
        $('#rclEAuthorBack').val('');
        $('#rclEAltBack').val('');
        $('#rclEURLAudioBack').val('');
        $('#rclETextBack').val('');
        $('#rclETextDivBack').val('');
        $('#rclEColorBack').val('#000000');
        $('#rclEBgColorBack').val('#ffffff');
        $('#rclETextDivBack').hide();
        $('#rclETextDivBack').css({
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
        $('#rclEPasteC').hide();
        $('#rclENumCards').text($exeDevice.cardsGame.length);
        $('#rclENumberCard').val($exeDevice.cardsGame.length);
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
            $('#rclEPasteC').hide();
            $('#rclENumCards').text($exeDevice.cardsGame.length);
            $('#rclENumberCard').val($exeDevice.active + 1);
            $exeDevice.updateCardsNumber();
        }
    },
    copyCard: function () {
        if ($exeDevice.validateCard() === false) return;
        $exeDevice.typeEdit = 0;
        $exeDevice.clipBoard = $exeDevice.cardsGame[$exeDevice.active];
        $('#rclEPasteC').show();


    },
    cutCard: function () {
        if ($exeDevice.validateCard() === false) return;
        $exeDevice.numberCutCuestion = $exeDevice.active;
        $exeDevice.typeEdit = 1;
        $('#rclEPasteC').show();


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
            $('#rclEPasteC').hide();
            $exeDevice.typeEdit = -1;
            $exeDevice.arrayMove($exeDevice.cardsGame, $exeDevice.numberCutCuestion, $exeDevice.active);
            $exeDevice.showCard($exeDevice.active);
            $('#rclENumCards').text($exeDevice.cardsGame.length);
            $('#rclENumberCard').val($exeDevice.active + 1);
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
        $('#rclEURLImage').val(p.url);
        $('#rclEX').val(p.x);
        $('#rclEY').val(p.y);
        $('#rclEAuthor').val(p.author);
        $('#rclEAlt').val(p.alt);
        $('#rclETextDiv').html($exeDevice.decodeURIComponentSafe(p.eText));
        $('#rclEText').val($exeDevice.decodeURIComponentSafe(p.eText));
        $('#rclEColor').val(p.color);
        $('#rclEBgColor').val(p.backcolor);
        $('#rclEURLAudio').val(p.audio);


        if (p.eText.length > 0) {
            $('#rclETextDiv').show();
        } else {
            $('#rclETextDiv').hide();
        }
        $('#rclETextDiv').css({
            'color': p.color,
            'background-color': $exeDevice.hexToRgba(p.backcolor, 0.7)
        });

        $exeDevice.showImage(0);
        $('#rclEURLImageBack').val(p.urlBk);
        $('#rclEXBack').val(p.xBk);
        $('#rclEYBack').val(p.yBk);
        $('#rclEAuthorBack').val(p.authorBk);
        $('#rclEAltBack').val(p.altBk);
        $('#rclETextDivBack').html($exeDevice.decodeURIComponentSafe(p.eTextBk));
        $('#rclETextBack').val($exeDevice.decodeURIComponentSafe(p.eTextBk));
        $('#rclEColorBack').val(p.colorBk);
        $('#rclEBgColorBack').val(p.backcolorBk);
        $('#rclEURLAudioBack').val(p.audioBk);

        $exeDevice.showImage(1);
        if (p.eTextBk.length > 0) {
            $('#rclETextDivBack').show();
        } else {
            $('#rclETextDivBack').hide();
        }
        $('#rclETextDivBack').css({
            'color': p.colorBk,
            'background-color': $exeDevice.hexToRgba(p.backcolorBk, 0.7)
        });
        $('#rclENumberCard').val($exeDevice.active + 1);
        $('#rclENumCards').text($exeDevice.cardsGame.length);
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
        p.url = $('#rclEURLImage').val().trim();
        p.x = parseFloat($('#rclEX').val());
        p.y = parseFloat($('#rclEY').val());;
        p.author = $('#rclEAuthor').val();
        p.alt = $('#rclEAlt').val();
        p.audio = $('#rclEURLAudio').val();
        p.color = $('#rclEColor').val();
        p.backcolor = $('#rclEBgColor').val();
        p.eText = $exeDevice.encodeURIComponentSafe($('#rclEText').val());

        p.urlBk = $('#rclEURLImageBack').val().trim();
        p.xBk = parseFloat($('#rclEXBack').val());
        p.yBk = parseFloat($('#rclEYBack').val());;
        p.authorBk = $('#rclEAuthorBack').val();
        p.altBk = $('#rclEAltBack').val();
        p.audioBk = $('#rclEURLAudioBack').val();
        p.colorBk = $('#rclEColorBack').val();
        p.backcolorBk = $('#rclEBgColorBack').val();
        p.eTextBk = $exeDevice.encodeURIComponentSafe($('#rclETextBack').val());

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
        var percentaje = parseInt($exeDevice.removeTags($('#rclEPercentajeCards').val()));
        if (isNaN(percentaje)) {
            return;
        }
        percentaje = percentaje < 1 ? 1 : percentaje;
        percentaje = percentaje > 100 ? 100 : percentaje;
        var num = Math.round((percentaje * $exeDevice.cardsGame.length) / 100);
        num = num == 0 ? 1 : num;
        $('#rclENumeroPercentaje').text(num + "/" + $exeDevice.cardsGame.length)
    },


    addEventCard: function () {
        $('#rclEAuthorAlt').hide();
        $('#rclEAuthorAltBack').hide();
        $('#rclEURLImage').on('change', function () {
            $exeDevice.loadImage(0);
        });
        $('#rclEURLImageBack').on('change', function () {
            $exeDevice.loadImage(1);
        });
        $('#rclEPlayImage').on('click', function (e) {
            e.preventDefault();
            $exeDevice.loadImage(0);
        });
        $('#rclEPlayImageBack').on('click', function (e) {
            e.preventDefault();
            $exeDevice.loadImage(1);
        });
        $('#rclEURLAudio').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#rclEURLAudioBack').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#rclEPlayAudio').on('click', function (e) {
            e.preventDefault();
            var audio = $('#rclEURLAudio').val();
            $exeDevice.loadAudio(audio);
        });
        $('#rclEPlayAudioBack').on('click', function (e) {
            e.preventDefault();
            var audio = $('#rclEURLAudioBack').val();
            $exeDevice.loadAudio(audio);
        });
        $('#rclEShowMore').on('click', function (e) {
            e.preventDefault();
            $('#rclEAuthorAlt').slideToggle();
        });
        $('#rclEShowMoreBack').on('click', function (e) {
            e.preventDefault();
            $('#rclEAuthorAltBack').slideToggle();
        });
        $('#rclEText').on('keyup', function () {
            $('#rclETextDiv').html($(this).val());
            if ($(this).val().trim().length > 0) {
                $('#rclETextDiv').show();
            } else {
                $('#rclETextDiv').hide();
            }
        });

        $('#rclETextBack').on('keyup', function () {
            $('#rclETextDivBack').html($(this).val());
            if ($(this).val().trim().length > 0) {
                $('#rclETextDivBack').show();
            } else {
                $('#rclETextDivBack').hide();
            }
        });

        $('#rclEColor').on('change', function () {
            $('#rclETextDiv').css('color', $(this).val());
        });

        $('#rclEColorBack').on('change', function () {
            $('#rclETextDivBack').css('color', $(this).val());
        });
        $('#rclEBgColor').on('change', function () {
            var bc = $exeDevice.hexToRgba($(this).val(), 0.7);
            $('#rclETextDiv').css({
                'background-color': bc
            });
        });

        $('#rclEBgColorBack').on('change', function () {
            var bc = $exeDevice.hexToRgba($(this).val(), 0.7);
            $('#rclETextDivBack').css({
                'background-color': bc
            });
        });

        $('#rclEImage').on('click', function (e) {
            $exeDevice.clickImage(e.pageX, e.pageY);
        });
        $('#rclECursor').on('click', function (e) {
            $(this).hide();
            $('#rclEX').val(0);
            $('#rclEY').val(0);
        });

        $('#rclEImageBack').on('click', function (e) {
            $exeDevice.clickImageBack(e.pageX, e.pageY);
        });
        $('#rclECursorBack').on('click', function (e) {
            $(this).hide();
            $('#rclEXBack').val(0);
            $('#rclEYBack').val(0);
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
            var json = $('.relaciona-DataGame', wrapper).text(),
                dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.relaciona-LinkImages', wrapper),
                $audiosLink = $('.relaciona-LinkAudios', wrapper),
                $imagesLinkBack = $('.relaciona-LinkImagesBack', wrapper),
                $audiosLinkBack = $('.relaciona-LinkAudiosBack', wrapper);
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
            var instructions = $(".relaciona-instructions", wrapper);
            if (instructions.length == 1) {
                instructions = instructions.html() || ''
                if (tinyMCE.get('eXeGameInstructions')) {
                    tinyMCE.get('eXeGameInstructions').setContent(instructions);
                } else {
                    $("#eXeGameInstructions").val(instructions)
                }
            }

            var textAfter = $(".relaciona-extra-content", wrapper);
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
        if (dataGame.instructions != "") divContent = '<div class="relaciona-instructions gameQP-instructions">' + dataGame.instructions + '</div>';
        var linksMedias = $exeDevice.createlinksIMedias(dataGame.cardsGame),
            html = '<div class="relaciona-IDevice">';
        html += divContent
        html += '<div class="relaciona-DataGame js-hidden">' + json + '</div>';
        html += linksMedias;
        var textAfter = tinyMCE.get('eXeIdeviceTextAfter').getContent();
        if (textAfter != "") {
            html += '<div class="relaciona-extra-content">' + textAfter + '</div>';
        }
        html += '<div class="relaciona-bns js-hidden">' + $exeDevice.msgs.msgNoSuportBrowser + '</div>';
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
                linkImage = '<a href="' + p.url + '" class="js-hidden relaciona-LinkImages">' + i + '</a>';
                html += linkImage;
            }

            if (typeof p.urlBk != "undefined" && p.urlBk.length > 0 && p.urlBk.indexOf('http') != 0) {
                linkImage = '<a href="' + p.urlBk + '" class="js-hidden relaciona-LinkImagesBack">' + i + '</a>';
                html += linkImage;
            }

            if (typeof p.audio != "undefined" && p.audio.length > 0 && p.audio.indexOf('http') != 0) {
                linkImage = '<a href="' + p.audio + '" class="js-hidden relaciona-LinkAudios">' + i + '</a>';
                html += linkImage;
            }
            if (typeof p.audioBk != "undefined" && p.audioBk.length > 0 && p.audioBk.indexOf('http') != 0) {
                linkImage = '<a href="' + p.audioBk + '" class="js-hidden relaciona-LinkAudiosBack">' + i + '</a>';
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
            showMinimize = $('#rclEShowMinimize').is(':checked'),
            showSolution = $('#rclEShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#rclETimeShowSolution').val())),
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues(),
            percentajeCards = parseInt(clear($('#rclEPercentajeCards').val())),
            author = $('#rclEAuthory').val(),
            cardsGame = $exeDevice.cardsGame,
            scorm = $exeAuthoring.iDevice.gamification.scorm.getValues(),
            type = parseInt($('input[name=flctype]:checked').val()),
            time = parseInt($('#rclETime').val()),
            evaluation = $('#rclEEvaluation').is(':checked'),
            evaluationID = $('#rclEEvaluationID').val(),
            id = $exeDevice.id ? $exeDevice.id : $exeDevice.generarID();

        if (evaluation && evaluationID.length < 5) {
            eXe.app.alert($exeDevice.msgs.msgIDLenght);
            return false;
        }

        var data = {
            'typeGame': 'rcl',
            'author': author,
            'randomCards': true,
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
            'id':id,
        }

        return data;
    },
    showImage: function (type) {
        var $cursor = type == 0 ? $('#rclECursor') : $('#rclECursorBack'),
            $image = type == 0 ? $('#rclEImage') : $('#rclEImageBack'),
            $nimage = type == 0 ? $('#rclENoImage') : $('#rclENoImageBack'),
            x = type == 0 ? $('#rclEX').val() : $('#rclEXBack').val(),
            y = type == 0 ? $('#rclEY').val() : $('#rclEYBack').val(),
            alt = type == 0 ? $('#rclEAlt').val() : $('#rclEAltBack').val(),
            url = type == 0 ? $('#rclEURLImage').val() : $('#rclEURLImageBack').val();
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
        $('#rclEPasteC').hide();
        $('#rclEAddC').on('click', function (e) {
            e.preventDefault();
            if ($exeDevice.cardsGame.length > 200) {
                $exeDevice.showMessage($exeDevice.msgs.msgMaxCards.replace('%s', 200));
                return;
            }
            $exeDevice.addCard(true);

        });
        $('#rclEDeleteC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.removeCard();

        });

        $('#rclECopyC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.copyCard();

        });
        $('#rclECutC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.cutCard();

        });
        $('#rclEPasteC').on('click', function (e) {
            e.preventDefault();
            if ($exeDevice.cardsGame.length > 200) {
                $exeDevice.showMessage($exeDevice.msgs.msgMaxCards.replace('%s', 200));
                return;
            }
            $exeDevice.pasteCard();

        });

        $('#rclEFirstC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.firstCard()
        });
        $('#rclEPreviousC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.previousCard()
        });
        $('#rclENextC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.nextCard();
        });
        $('#rclELastC').on('click', function (e) {
            e.preventDefault();
            $exeDevice.lastCard();
        });

        $('#rclEReverseFaces').on('click', function (e) {
            e.preventDefault();
            $exeDevice.reverseFaces();

        });
        $('#rclEReverseCard').on('click', function (e) {
            e.preventDefault();
            $exeDevice.reverseCard();
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
        $('#rclEPercentajeCards').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
            if (this.value > 0 && this.value < 101) {
                $exeDevice.updateCardsNumber();
            }
        });
        $('#rclEPercentajeCards').on('focusout', function () {
            this.value = this.value.trim() == '' ? 100 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
            $exeDevice.updateCardsNumber();
        });


        $('#rclEPercentajeCards').on('click', function () {
            $exeDevice.updateCardsNumber();
        });

        $('#rclEURLAudioDefinition').on('change', function () {
            $exeDevice.loadAudio($(this).val());
        });
        $('#rclENumberCard').keyup(function (e) {
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
        $('#rclETime').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#rclETime').on('focusout', function () {
            this.value = this.value.trim() == '' ? 0 : this.value;
            this.value = this.value > 59 ? 59 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });

        $('#rclEShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#rclETimeShowSolution').prop('disabled', !marcado);
        });

        $('#rclETimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#rclETimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });

        $('#gameIdeviceForm').on('click', 'input.RLC-Type', function (e) {
            var type = parseInt($(this).val());
            $("#rclETimeDiv").hide();
            if (type == 2) {
                $("#rclETimeDiv").show();
            }
        });
        $('#rclEEvaluation').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#rclEEvaluationID').prop('disabled', !marcado);
        });
        $("#rclEEvaluationHelpLnk").click(function () {
            $("#rclEEvaluationHelp").toggle();
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
            url = type == 0 ? $('#rclEURLImage').val() : $('#rclEURLImageBack').val(),
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
        $('#rclEShowMinimize').prop('checked', game.showMinimize);
        $('#rclEPercentajeCards').val(game.percentajeCards);
        $('#rclEAuthory').val(game.author);
        $('#rclEShowSolution').prop('checked', game.showSolution);
        $('#rclETimeShowSolution').val(game.timeShowSolution)
        $('#rclETimeShowSolution').prop('disabled', !game.showSolution);
        $('#rclETime').val(game.time);
        $("input.RLC-Type[name='flctype'][value='" + game.type + "']").prop("checked", true);
        $("#rclETimeDiv").hide();
        $('#rclEEvaluation').prop('checked', game.evaluation);
        $('#rclEEvaluationID').val(game.evaluationID);
        $("#rclEEvaluationID").prop('disabled', (!game.evaluation));
        if (game.type == 2) {
            $("#rclETimeDiv").show();
        }
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm, game.textButtonScorm, game.repeatActivity);
        $exeDevice.cardsGame = game.cardsGame;
        $('#rclENumCards').text($exeDevice.cardsGame.length);
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
        link.download = _("Activity") + "-rcl.json";
        document.getElementById('gameIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('gameIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },

    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame == "undefined") {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        } else if (game.typeGame == 'rcl') {
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

        } else if (game.typeGame == 'rcl') {
            game.cardsGame = $exeDevice.importrcl(game);
        } else if (game.typeGame == 'Rosco') {
            game.cardsGame = $exeDevice.importRosco(game);
        } else if (game.typeGame == 'QuExt') {
            game.cardsGame = $exeDevice.importQuExt(game);
        } else if (game.typeGame == 'Sopa') {
            game.cardsGame = $exeDevice.importSopa(game);
        } else {
            $exeDevice.showMessage($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.cardsGame = game.cardsGame;
        $exeDevice.active = 0;
        $exeDevice.deleteEmptyQuestion();
        $exeDevice.showCard($exeDevice.active);
        $('.exe-form-tabs li:first-child a').click();
    },

    importrcl: function (data) {
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

    deleteEmptyQuestion: function () {
        var url = $('#rclEURLImage').val().trim(),
            audio = $('#rclEURLAudio').val().trim(),
            eText = $('#rclEText').val().trim();
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
        var $cursor = $('#rclECursor'),
            $image = $('#rclEImage'),
            $x = $('#rclEX'),
            $y = $('#rclEY');
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
        var $cursor = $('#rclECursorBack'),
            $image = $('#rclEImageBack'),
            $x = $('#rclEXBack'),
            $y = $('#rclEYCack');
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