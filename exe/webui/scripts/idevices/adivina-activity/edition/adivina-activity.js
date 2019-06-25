/**
 * Advina Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Author: Ricardo Malaga Floriano
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    iDevicePath: "/scripts/idevices/adivina-activity/edition/",
    msgs: {},
    active: 0,
    ci18n: {
        "msgReady": _("Ready?"),
        "msgStartGame": _("Click here to start"),
        "msgHappen": _("Move on"),
        "msgReply": _("Reply"),
        "msgSubmit": _("Submit"),
        "msgEnterCode": _("Enter the access code"),
        "msgErrorCode": _("The access code is not correct"),
        "msgGameOver": _("The game is over!"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
        "msgYouHas": ("You have got %1 correct and %2 uncorrect"),
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
        "msgTime": _("Time"),
        "msgLive": _("Live"),
        "msgFullScreen": _("Fullscreen"),
        "msgExitFullScreen": _("Exit fullscreen"),
        "msgNumQuestions": _("Number of questions"),
        "msgNoImage": _("No picture question"),
        "msgCool": _("Cool!"),
        "msgLoseT": _("Lose 330 points"),
        "msgLoseLive": _("Lose a life"),
        "msgLostLives": _("Lost all your lives!"),
        "mgsAllQuestions": _("Questions completed!"),
        "msgSuccesses": _("Right! | Excellent! | Great! | Very good! | Perfect!"),
        "msgFailures": _("It was not that! | Not well! | Not correct! | Sorry! | Error!"),
        "msgTryAgain": _("Must have %s% of correct answers to get the needed information. Try again!"),
        "msgWrote": _("Write the correct word and click on reply. If you doubt, click on move on"),
        "msgNotNetwork": _("You can only play this game with internet connection. Check out your conecctivity"),
        "msgEndGameScore":_("Please start this activity before saving your score!"),
        "msgScoreScorm":_("Only the score obtained in an SCORM export can be saved")
    },
    init: function () {
        this.setMessagesInfo();
        this.createForm();
        this.addEvents();
    },
    setMessagesInfo() {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("You must provide the definition of the word or the valid URL of an image");
        msgs.msgESelectFile = _("The selected file does not contain a game");
        msgs.msgEURLValid = _("You must indicate the valid URL of an image");
        msgs.msgEProvideWord = _("You must provide one word or phrase");
        msgs.msgEOneQuestion = _("You must provide at least one question");

    },
    loadScriptUI: function (url) {
        $('.adivina-Questions').sortable();
        $('.adivina-Questions').disableSelection();
    },
    getLanguageFields: function () {
        var html = "",
            fields = this.ci18n;
        for (var i in fields) {
            html += '<p class="ci18n"><label for="ci18n_' + i + '">' + fields[i] + '</label> <input type="text" name="ci18n_' + i + '" id="ci18n_' + i + '" value="' + fields[i] + '" /></p>'
        }
        return html;
    },
    createForm: function () {
        var html = '\
			<div id="adivinaIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + _("Instructions") + '</a></legend>\
						<div>\
							<p>\
								<label for="adivinaInstructions" class="sr-av">' + _("Instructions") + ': </label>\
								<textarea id="adivinaInstructions" class="exe-html-editor"\>' + _("Observe the letters, identify and fill in the missing the words.") + ' </textarea>\
							</p>\
						</div>\
					</fieldset>\
					<fieldset class="exe-fieldset">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="adivinaTimeQuestion">' + _("Time per question (seconds)") + '</label>\
                                <input type="number" name="adivinaTimeQuestion" id="adivinaTimeQuestion" value="30" min="10" max="600" step="10" />\
                            </p>\
							<p>\
								<label for="adivinaShowMinimize"><input type="checkbox" id="adivinaShowMinimize"> ' + _("Show minimized.") + ' </label>\
                            </p>\
                            <p>\
                                <label for="adivinaUseLives"><input type="checkbox" checked id="adivinaUseLives"> ' + _("Use lives") + '. </label> \
                                <label for="adivinaNumberLives">' + _("Number of lives") + ': \
                                <input type="number" name="adivinaNumberLives" id="adivinaNumberLives" value="3" min="1" max="5" /> </label>\
                            </p>\
                            <p>\
                               <label for="adivinaOptionsRamdon"><input type="checkbox" id="adivinaOptionsRamdon"> ' + _("Random quextions") + ' </label>\
                            </p>\
                            <p>\
								<label for="adivinaShowSolution"><input type="checkbox" checked id="adivinaShowSolution"> ' + _("Show solutions") + '. </label> \
								<label for="adivinaTimeShowSolution">' + _("Show solution time(seconds)") + ': \
								<input type="number" name="adivinaTimeShowSolution" id="adivinaTimeShowSolution" value="3" min="1" max="9" /> </label>\
                            </p>\
                            <p>\
                                <label for="adivinaPercentageShow">' + _("Percentage of letters to show (%)") + ':\
                                <input type="number" name="adivinaPercentageShow" id="adivinaPercentageShow" value="35" min="0" max="100" step="5" /> </label>\
                            </p>\
                        </div>\
                    </fieldset>\
                    <fieldset class="exe-fieldset">\
						    <legend><a href="#">' + _("Words/Phrases") + '</a></legend>\
                            <div class="adivina-Questions">\
                                <div id="adivinaInitQuestions" class="adivina-InitQuestions"></div>' +
            $exeDevice.getDataWord(0) +
            '</div>\
                  </fieldset>\
                    ' + $exeAuthoring.iDevice.itinerary.getFieldset() + '\
                    ' + $exeDevice.getExportImportGame() + '\
                    ' + $exeDevice.getScorm() + '\
			    </div>\
			    <div class="exe-form-tab" title="' + _('Language settings') + '">\
				    <p>' + _("Custom texts (or use the default ones):") + '</p>\
				    ' + this.getLanguageFields() + '\
			    </div>\
		    </div>\
			';

        var field = $("textarea.jsContentEditor").eq(0),
            jsui = $exeDevice.iDevicePath + 'jquery-ui.min.js';
        field.before(html);
        this.enableTabs("adivinaIdeviceForm");
        this.loadPreviousValues(field);
        if (!window.jQuery.ui) $exeDevice.loadScriptUI()
        else $exe.loadScript(jsui, '$exeDevice.loadScriptUI()');

    },
    enableTabs: function (id) {
        var tabs = $("#" + id + " .exe-form-tab");
        var list = '';
        var tabId;
        var e;
        var txt;
        tabs.each(function (i) {
            var klass = "exe-form-active-tab";
            tabId = id + "Tab" + i;
            e = $(this);
            e.attr("id", tabId);
            txt = e.attr("title");
            if (txt == '') txt = (i + 1);
            if (i > 0) {
                e.hide();
                klass = "";
            }
            list += '<li><a href="#' + tabId + '" class="' + klass + '">' + txt + '</a></li>';
        });
        if (list != "") {
            list = '<ul id="' + id + 'Tabs" class="exe-form-tabs exe-advanced">' + list + '</ul>';
            tabs.eq(0).before(list);
            var as = $("#" + id + "Tabs a");
            as.click(function () {
                as.attr("class", "");
                $(this).addClass("exe-form-active-tab");
                tabs.hide();
                $($(this).attr("href")).show();
                return false;
            });
        }
    },
    getDataWord: function (i) {
        var path = $exeDevice.iDevicePath,
            fileWord = '<div class="adivinaWordMutimediaEdition" >\
                            <div class="adivinaFileWordEdition">\
                                <a href="#" class="adivinaLinkDrop" title="' + _("Drag question") + '"><img src="' + path + "adivinaDrop.png" + '" alt="' + _("Ordenar frases") + '" class="adivinaButtonImage b-drop"/></a>\
                                <a href="#" class="adivinaLinkAdd" title="' + _("Add question") + '"><img src="' + path + "adivinaAdd.png" + '" alt="' + _("Add question") + '" class="adivinaButtonImage b-add"/></a>\
                                <a href="#" class="adivinaLinkCopy" title="' + _("Copy question") + '"><img src="' + path + "adivinaCopy.png" + '" alt="' + _("Copy question") + '" class="adivinaButtonImage b-copy"/></a>\
                                <a href="#" class="adivinaLinkDelete" title="' + _("Delete question") + '"><img src="' + path + "adivinaDelete.png" + '" alt="' + _("Delete question") + '" class="adivinaButtonImage b-delete"/></a>\
                                <input type="text" class="adivinaWordEdition" placeholder="' + _("Word/Phrase") + '">\
                                <input type="text" class="adivinaDefinitionEdition" placeholder="' + _("Definition") + '">\
                                <a href="#" class="adivinaLinkSelect" title="' + _("Select image") + '"><img src="' + path + "adivinaSelectInactive.png" + '" alt="' + _("Delete question") + '" class="adivinaButtonImage adivinaSelectImageEdition"/></a>\
                            </div>\
                            <div class="adivinaImageBarEdition">\
                                <div class="adivinaImageEdition">\
                                    <img src="' + path + "adivinaCursor.gif" + '" class="adivinaCursorEdition" alt="Cursor" /> \
                                    <img src="' + path + "adivinaHomeImage.png" + '" class="adivinaHomeImageEdition" alt="' + _("No image") + '" /> \
                                    <img src="' + path + "adivinaHomeImage.png" + '" class="adivinaNoImageEdition" alt="' + _("No image") + '" /> \
                                </div>\
                                <div class="adivinaBarEdition">\
                                   <label>' + _("Image") + ': </label><input type="text" class="exe-file-picker adivinaURLImageEdition"  id="adivinaURLImage-' + i + '" placeholder="' + _("Indicate a valid URL of an image or select one from your device") + '"/>\
                                   <input type="text" class="adivinaXImageEdition" value="0" readonly />\
                                   <input type="text" class="adivinaYImageEdition" value="0" readonly />\
                                </div>\
                                <div class="adivinaMetaData">\
                                   <label>Alt:</label><input type="text" class="adivinaAlt" />\
                                   <label>' + _("Authorship") + ':</label><input type="text"  class="adivinaAuthorEdition" />\
                                   <a href="#" class="adivinaLinkClose" title="' + _("Hide image") + '"><img src="' + path + "adivinaClose.png" + '" alt="' + _("Minimize") + '" class="adivinaButtonImage"/></a>\
                                </div>\
                            </div>\
                        </div>'
        return fileWord;
    },

    getCuestionDefault: function () {
        var p = new Object();
        p.word = '';
        p.definition = '',
            p.type = 0;
        p.url = '';
        p.x = 0;
        p.y = 0;
        p.author = '';
        p.alt = '';
        return p;
    },
    loadPreviousValues: function (field) {
        var originalHTML = field.val();
        if (originalHTML != '') {
            var wrapper = $("<div></div>");
            wrapper.html(originalHTML);
            var json = $('.adivina-DataGame', wrapper).text(),
                dataGame = $exeDevice.isJsonString(json),
                $imagesLink = $('.adivina-LinkImages', wrapper);
            $imagesLink.each(function (index) {
                dataGame.wordsGame[index].url = $(this).attr('href');
            });
            $exeDevice.updateFieldGame(dataGame);
            var instructions = $(".adivina-instructions", wrapper);
            if (instructions.length == 1) $("#adivinaInstructions").val(instructions.html());
         
        }
    },
    getExportImportGame: function () {
        var msg = _("You can export this game to a JSON file so you can later use it in an iDevice of the same type. You can also use it in %s and you can import games from %s and use then here.");
        msg = msg.replace(/%s/g, '<a href="https://quext.educarex.es/" target="_blank" rel="noopener noreferrer">QuExt</a>');
        var html = '\
			<fieldset class="exe-fieldset exe-fieldset-closed exe-advanced">\
				<legend><a href="#">' + _("Advanced") + '</a></legend>\
				<div>\
					<div class="exe-idevice-info">' + msg + '</div>\
					<div id="adivinaExportImport">\
                        <p>\
                            <label for="adivinaImportGame">' + _("Load game") + ': </label>\
                            <input type="file" name="adivinaImportGame" id="adivinaImportGame" />\
                        </p>\
                        <p>\
                            <label for="adivinaExportGame">' + _("Save game") + ': </label>\
                            <input type="button" name="adivinaExportGame" id="adivinaExportGame" value="' + _("Save") + '" />\
                        </p>\
                    </div>\
				</div>\
			</fieldset>';
        return html;
    },
    getScorm: function () {
        var html = '\
			<fieldset class="exe-fieldset exe-fieldset-closed exe-advanced">\
				<legend><a href="#">' + _("Instructions SCORM") + '</a></legend>\
                   <div>\
                        <p id="adivinaSCORMNoSave">\
                            <label for="adivinaSCORMNoSave"><input type="radio" name="adivinaSCORM" id="adivinaSCORMNoSave"  value="0"  checked /> ' + _("No save score") + '</label>\
                        </p>\
                        <p id="adivinaScormAutomatically">\
                            <label for="adivinaSCORMAutoSave"><input type="radio" name="adivinaSCORM" id="adivinaSCORMAutoSave" value="1"  /> ' + _("Automatically save the result of the game") + '</label>\
                        </p>\
                        <p id="adivinaActivitySCORMblock">\
                        <label for="adivinaSCORMButtonSave"><input type="radio" name="adivinaSCORM" id="adivinaSCORMButtonSave" value="2" /> ' + _("Show save score button") + '</label>\
                        <span id="adivinaSCORMoptions">\
                            <label for="adivinaSCORMbuttonText">' + _("Button text") + ': </label>\
                            <input type="text" max="100" name="adivinaSCORMbuttonText" id="adivinaSCORMbuttonText" value="' + _("Save score") + '" /> \
                        </span>\
                        </p>\
                        <div id="adivinaSCORMinstructionsAuto">\
							<ul>\
								<li>' + _("The score will be automatically saved in each question and at the end of the game.") + '</li>\
								<li>' + _('Include only one Adivina activity with a "save score" in the page.') + '</li>\
								<li>' + _("This activity has to be the last Adivina activity on the page (or it won't work).") + '</li>\
								<li>' + _("Do not include other SCORM idevices on this page.") + '</li>\
							</ul>\
						</div>\
                       <div id="adivinaSCORMinstructionsButton">\
							<ul>\
								<li>' + _("The button will only be displayed when exporting as SCORM and while editing in eXeLearning.") + '</li>\
								<li>' + _('Include only one adivina activity with a "Save score" button in the page.') + '</li>\
								<li>' + _("The activity with button has to be the last adivina activity on the page (or it won't work).") + '</li>\
								<li>' + _('Do not include a "SCORM Quiz" iDevice in the same page.') + '</li>\
							</ul>\
                        </div>\
				   </div>\
			</fieldset>';
        return html;
    },
    save: function () {
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
        if (dataGame.instructions != "") divContent = '<div class="adivina-instructions">' + dataGame.instructions + '</div>';
        var linksImages = $exeDevice.createlinksImage(dataGame.wordsGame);
        var html = '<div class="adivina-IDevice">';
        html += divContent;
        html += '<div class="adivina-DataGame">' + json + '</div>';
        html += linksImages;
        html += '</div>';
        return html;
    },
    createlinksImage: function (wordsGame) {
        var html = '';
        for (var i = 0; i < wordsGame.length; i++) {
            var linkImage = '<a href="' + wordsGame[i].url + '" class="js-hidden adivina-LinkImages">' + i + '</a>';
            html += linkImage;
        }
        return html;
    },
    validateData: function () {
        var clear = $exeDevice.removeTags,
            instructions = tinymce.editors[0].getContent(),
            showMinimize = $('#adivinaShowMinimize').is(':checked'),
            optionsRamdon = $('#adivinaOptionsRamdon').is(':checked'),
            showSolution = $('#adivinaShowSolution').is(':checked'),
            timeShowSolution = parseInt(clear($('#adivinaTimeShowSolution').val())),
            useLives = $('#adivinaUseLives').is(':checked'),
            numberLives = parseInt(clear($('#adivinaNumberLives').val())),
            timeQuestion = clear($.trim($('#adivinaTimeQuestion').val())),
            percentageShow = parseInt(clear($('#adivinaPercentageShow').val())),
            itinerary = $exeAuthoring.iDevice.itinerary.getValues(),
            isScorm = 0,
            textButtonScorm = "";
        if (!itinerary) return false;
        if (showSolution && timeShowSolution.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEProvideTimeSolution);
            return false;
        }
        var words = [];
        $('.adivinaWordEdition').each(function () {
            words.push(clear($(this).val().toUpperCase().trim()));
        })
        var definitions = [];
        $('.adivinaDefinitionEdition').each(function () {
            definitions.push(clear($(this).val().trim()));
        });
        var authors = [];
        $('.adivinaAuthorEdition').each(function () {
            authors.push(clear($(this).val().trim()));
        });
        var alts = [];
        $('.adivinaAlt').each(function () {
            alts.push(clear($(this).val()));
        });
        var urls = [];
        $('.adivinaURLImageEdition').each(function () {
            urls.push($(this).val().trim());
        });
        var xs = [];
        $('.adivinaXImageEdition').each(function () {
            xs.push(parseFloat($(this).val().trim()));
        });
        var ys = [];
        $('.adivinaYImageEdition').each(function () {
            ys.push(parseFloat($(this).val().trim()));
        });
        if (words.length == 0) {
            eXe.app.alert($exeDevice.msgs.msgEOneQuestion);
            return false;
        }
        var types = [];
        for (var i = 0; i < words.length; i++) {
            var word = clear($.trim(words[i]).toUpperCase());
            var definition = clear($.trim(definitions[i]));
            var url = $.trim(urls[i]);
            var mType = 0;
            if (word.length == 0) {
                eXe.app.alert($exeDevice.msgs.msgEProvideWord);
                return false;
            } else if ((definition.length == 0) && (url.length < 10)) {
                eXe.app.alert($exeDevice.msgs.msgEProvideDefinition + ' ' + word);
                return false;
            } else if ((definition.length > 0) && (url.length < 10)) {
                mType = 0;
            } else if ((definition.length == 0) && (url.length > 10)) {
                mType = 1;
            } else if ((definition.length > 0) && (url.length > 10)) {
                mType = 2;
            }
            types.push(mType)
        }
        var wordsGame = [];
        for (var i = 0; i < words.length; i++) {
            var p = new Object();
            p.word = $.trim(words[i]).toUpperCase();
            p.definition = definitions[i];
            p.type = types[i];
            p.author = authors[i];
            p.alt = alts[i];
            p.url = urls[i];
            p.x = xs[i];
            p.y = ys[i];
            if (p.word.length == 0) {
                p.definition = '';
                p.url = '';
                p.x = 0
                p.y = 0;
                p.author = '';
                p.alt = '';
            }
            if (p.url.length < 8) {
                p.x = 0
                p.y = 0;
                p.author = '';
                p.alt = '';
            }
            wordsGame.push(p);
        }
        isScorm=parseInt($("input[type=radio][name='adivinaSCORM']:checked").val());
        if(isScorm==2){
            textButtonScorm = $("#adivinaSCORMbuttonText").val();
            if (textButtonScorm == "") {
                eXe.app.alert(_("Please write the button text."));
                return false;
            }
        }

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
            'isScorm': isScorm,
            'textButtonScorm': textButtonScorm
        }
        return data;
    },
    showImage: function (image, url, x, y, alt, type) {
        var msgs = $exeDevice.msgs,
            $cursor = image.siblings('.adivinaCursorEdition'),
            $noImage = image.siblings('.adivinaNoImageEdition'),
            $iconSelection = image.parents('.adivinaWordMutimediaEdition').find('.adivinaSelectImageEdition');
        $iconSelection.attr('src', $exeDevice.iDevicePath + 'adivinaSelectInactive.png');
        image.attr('alt', '');
        if ($.trim(url).length == 0) {
            $cursor.hide();
            image.hide();
            $noImage.show();
            return false;
        };
        image.prop('src', url)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    $cursor.hide();
                    image.hide();
                    $noImage.show();
                    if (type == 1) {
                        eXe.app.alert(msgs.msgEURLValid);
                    }
                    return false;
                } else {
                    var mData = $exeDevice.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                    $exeDevice.drawImage(this, mData);
                    image.attr('alt', alt);
                    image.show();
                    $cursor.show();
                    $($iconSelection).addClass('active');
                    $noImage.hide();
                    $exeDevice.paintMouse(this, $cursor, x, y);
                    $iconSelection.attr('src', $exeDevice.iDevicePath + 'adivinaSelectActive.png');
                    return true;
                }
            }).on('error', function () {
                $cursor.hide();
                image.hide();
                $noImage.show();
                if (type == 1) {
                    eXe.app.alert(msgs.msgEURLValid);
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
    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
    },
    addEvents: function () {
        var main = this;
        $('.adivina-Questions').on('click', 'a.adivinaLinkSelect', function (e) {
            e.preventDefault();
            var $pater = $(this).parent().siblings('.adivinaImageBarEdition'),
                img = $pater.find('.adivinaHomeImageEdition'),
                url = $pater.find('.adivinaURLImageEdition').val(),
                x = parseFloat($pater.find('.adivinaXImageEdition').val()),
                y = parseFloat($pater.find('.adivinaYImageEdition').val()),
                alt = $pater.find('.adivinaAlt').val();
            $pater.slideToggle();
            main.showImage(img, url, x, y, alt, 0);
        });
        $('#adivinaUseLives').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#adivinaNumberLives').prop('disabled', !marcado);
        });
        $('#adivinaShowSolution').on('change', function () {
            var marcado = $(this).is(':checked');
            $('#adivinaTimeShowSolution').prop('disabled', !marcado);
        });
        $('.adivina-Questions').on('change', 'input.adivinaURLImageEdition', function () {
            var validExt = ['jpg', 'png', 'gif', 'jpeg', 'svg'],
                selectedFile = $(this).val(),
                ext = selectedFile.split('.').pop().toLowerCase();
            if ((selectedFile.indexOf('resources') == 0 || selectedFile.indexOf('/previews/') == 0) && validExt.indexOf(ext) == -1) {
                eXe.app.alert(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
                return false;
            }
            var img = $(this).parent().siblings('.adivinaImageEdition').find('.adivinaHomeImageEdition'),
                url = selectedFile,
                alt = $(this).parent().siblings(".adivinaMetaData").find('.adivinaAlt').val(),
                x = parseFloat($(this).siblings('.adivinaXImageEdition').val()),
                y = parseFloat($(this).siblings('.adivinaYImageEdition').val());
            $exeDevice.showImage(img, url, x, y, alt, 1);
        });
        $('.adivina-Questions').on('click', 'a.adivinaLinkAdd', function (e) {
            e.preventDefault();
            var $parentPanel = $(this).parents('.adivinaWordMutimediaEdition');
            $exeDevice.clone($parentPanel, false);
        });
        $('.adivina-Questions').on('click', 'a.adivinaLinkDrop', function (e) {
            e.preventDefault();
        });
        $('.adivina-Questions').on('click', 'a.adivinaLinkCopy', function (e) {
            e.preventDefault();
            var $parentPanel = $(this).parents('.adivinaWordMutimediaEdition');
            $exeDevice.clone($parentPanel, true);
            $exeDevice.updateCloneQuestion($parentPanel, $parentPanel.next());
        });
        $('.adivina-Questions').on('click', 'a.adivinaLinkDelete', function (e) {
            e.preventDefault();
            var $parentPanel = $(this).parents('.adivinaWordMutimediaEdition');
            if ($('.adivinaWordMutimediaEdition').length === 1) {
                eXe.app.alert($exeDevice.msgs.msgEOneQuestion);
                return;
            }
            $parentPanel.remove();
        });
        $('.adivina-Questions').on('click', 'a.adivinaLinkClose', function (e) {
            e.preventDefault();
            $(this).parents('.adivinaImageBarEdition').slideUp();
        });
        $('.adivina-Questions').on('click', 'img.adivinaHomeImageEdition', function (e) {
            $exeDevice.clickImage(this, e.pageX, e.pageY);
        });
        $('#adivinaTimeQuestion').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#adivinaTimeQuestion').on('focusout', function () {
            this.value = this.value.trim() == '' ? 30 : this.value;
            this.value = this.value > 600 ? 600 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#adivinaNumberLives').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#adivinaNumberLives').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 5 ? 5 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#adivinaTimeShowSolution').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 1);
            this.value = v;
        });
        $('#adivinaTimeShowSolution').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 9 ? 9 : this.value;
            this.value = this.value < 1 ? 1 : this.value;
        });
        $('#').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#adivinaPercentageShow').on('focusout', function () {
            this.value = this.value.trim() == '' ? 3 : this.value;
            this.value = this.value > 100 ? 100 : this.value;
            this.value = this.value < 0 ? 0 : this.value;
        });
        $('input[type=radio][name="adivinaSCORM"]').on('change', function () {
            $("#adivinaSCORMoptions,#adivinaSCORMinstructionsButton,#adivinaSCORMinstructionsAuto").hide();

            switch ($(this).val()) {
                case '0':
                    break;
                case '1':
                    $("#adivinaSCORMinstructionsAuto").hide().css({
                        opacity: 0,
                        visibility: "visible"
                    }).show().animate({
                        opacity: 1
                    }, 500);

                    break;
                case '2':
                    $("#adivinaSCORMoptions,#adivinaSCORMinstructionsButton").hide().css({
                        opacity: 0,
                        visibility: "visible"
                    }).show().animate({
                        opacity: 1
                    }, 500);

                    break;

            }
        });


        $exeAuthoring.iDevice.itinerary.addEvents();
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $('#adivinaExportImport').show();
            $('#adivinaImportGame').on('change', function (e) {
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
            $('#adivinaExportGame').on('click', function () {
                $exeDevice.exportGame();
            })
        } else {
            $('#adivinaExportImport').hide();
        }
    },
    updateFieldGame: function (game) {
        $exeAuthoring.iDevice.itinerary.setValues(game.itinerary);
        $('#adivinaShowMinimize').prop('checked', game.showMinimize);
        $('#adivinaOptionsRamdon').prop('checked', game.optionsRamdon);
        $('#adivinaUseLives').prop('checked', game.useLives);
        $('#adivinaNumberLives').val(game.numberLives);
        $('#adivinaShowSolution').prop('checked', game.showSolution);
        $('#adivinaTimeShowSolution').val(game.timeShowSolution)
        $('#adivinaTimeShowSolution').prop('disabled', !game.showSolution);
        $('#adivinaNumberLives').prop('disabled', !game.useLives);
        $('#adivinaTimeQuestion').val(game.timeQuestion);
        $('#adivinaPercentageShow').val(game.percentageShow);
        $('.adivinaWordMutimediaEdition').remove();
        $exeDevice.loadWords(game);
        $("#adivinaSCORMoptions").css("visibility", "hidden");
        $("#adivinaSCORMinstructionsButton").hide();
        $("#adivinaSCORMinstructionsAuto").hide();
        if (game.isScorm == 0){
            $('#adivinaSCORMNoSave').prop('checked', true);
        }else if (game.isScorm == 1) {
            $('#adivinaSCORMAutoSave').prop('checked', true);
            $('#adivinaSCORMinstructionsAuto').show();
        } if (game.isScorm== 2) {
            $('#adivinaSCORMButtonSave').prop('checked', true);
            $('#adivinaSCORMbuttonText').val(game.textButtonScorm);
            $('#adivinaSCORMoptions').css("visibility", "visible");
            $('#adivinaSCORMinstructionsButton').show();
        } 
        $('.adivina-Questions .adivinaImageBarEdition').slideUp();

    },
    exportGame: function () {
        var dataGame = this.validateData();
        if (!dataGame) {
            return false;
        }
        var blob = JSON.stringify(dataGame);
        var newBlob = new Blob([blob], {
            type: "text/plain"
        })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = _("Game") + "Adivina.json";
        document.getElementById('adivinaIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('adivinaIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game) {
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.updateFieldGame(game);
        tinymce.editors[0].setContent(game.instructions);
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
    updateCloneQuestion: function (parentPanel, clone) {
        var $clonePanel = clone,
            $parentPanel = parentPanel;
        $clonePanel.find('input.adivinaWordEdition').val($parentPanel.find('input.adivinaWordEdition').val());
        $clonePanel.find('input.adivinaDefinitionEdition').val($parentPanel.find('input.adivinaDefinitionEdition').val());
        $clonePanel.find('input.adivinaURLImageEdition').val($parentPanel.find('input.adivinaURLImageEdition').val());
        $clonePanel.find('input.adivinaXImageEdition').val($parentPanel.find('input.adivinaXImageEdition').val());
        $clonePanel.find('input.adivinaYImageEdition').val($parentPanel.find('input.adivinaYImageEdition').val());
        $clonePanel.find('input.adivinaAuthorEdition').val($parentPanel.find('input.adivinaAuthorEdition').val());
        $clonePanel.find('input.adivinaAlt').val($parentPanel.find('input.adivinaAlt').val());

        var $image = $clonePanel.find('img.adivinaHomeImageEdition'),
            x = parseFloat($clonePanel.find('input.adivinaXImageEdition').val()),
            y = parseFloat($clonePanel.find('input.adivinaYImageEdition').val()),
            url = $clonePanel.find('input.adivinaURLImageEdition').val(),
            alt = $clonePanel.find('input.adivinaAlt').val();
        if (url.length > 7) {
            $exeDevice.showImage($image, url, x, y, alt, 0);
        }
    },
    loadWords: function (dataGame) {
        $exeDevice.active = 0;
        if (dataGame.wordsGame.length == 0) {
            var $clon = $($exeDevice.getDataWord($exeDevice.active));
            $clon.insertBefore('#adivinaInitQuestions');
        } else {
            for (var i = 0; i < dataGame.wordsGame.length; i++) {
                $exeDevice.active++;
                var question = dataGame.wordsGame[i],
                    imgSelect = question.url.length > 7 ? $exeDevice.iDevicePath + "adivinaSelectActive.png" : $exeDevice.iDevicePath + "adivinaSelectInactive.png",
                    $clon = $($exeDevice.getDataWord($exeDevice.active));
                $clon.find('input.adivinaWordEdition').val(question.word);
                $clon.find('input.adivinaWordEdition').val(question.word);
                $clon.find('input.adivinaDefinitionEdition').val(question.definition);
                $clon.find('input.adivinaURLImageEdition').val(question.url);
                $clon.find('input.adivinaXImageEdition').val(question.x);
                $clon.find('input.adivinaYImageEdition').val(question.y);
                $clon.find('input.adivinaAuthorEdition').val(question.author);
                $clon.find('input.adivinaAlt').val(question.alt);
                $clon.find('img.adivinaSelectImageEdition').attr('src', imgSelect);
                $clon.insertBefore('#adivinaInitQuestions');
            }
        }
    },
    clone: function (element, type) {
        $exeDevice.active++;
        var clon = $exeDevice.getDataWordClone($exeDevice.active);
        element.after(clon);
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
        var $cursor = $(img).siblings('.adivinaCursorEdition'),
            $x = $(img).parent().siblings('.adivinaBarEdition').find('.adivinaXImageEdition'),
            $y = $(img).parent().siblings('.adivinaBarEdition').find('.adivinaYImageEdition'),
            posX = epx - $(img).offset().left,
            posY = epy - $(img).offset().top,
            wI = $(img).width() > 0 ? $(img).width() : 1,
            hI = $(img).height() > 0 ? $(img).height() : 1,
            lI = $(img).position().left,
            tI = $(img).position().top;
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
    getDataWordClone: function (i) {
        var path = $exeDevice.iDevicePath,
            fileWord = '<div class="adivinaWordMutimediaEdition" >\
                            <div class="adivinaFileWordEdition">\
                                <a href="#" class="adivinaLinkDrop" title="' + _("Drag question") + '"><img src="' + path + "adivinaDrop.png" + '" alt="' + _("Ordenar frases") + '" class="adivinaButtonImage b-drop"/></a>\
                                <a href="#" class="adivinaLinkAdd" title="' + _("Add question") + '"><img src="' + path + "adivinaAdd.png" + '" alt="' + _("Add question") + '" class="adivinaButtonImage b-add"/></a>\
                                <a href="#" class="adivinaLinkCopy" title="' + _("Copy question") + '"><img src="' + path + "adivinaCopy.png" + '" alt="' + _("Copy question") + '" class="adivinaButtonImage b-copy"/></a>\
                                <a href="#" class="adivinaLinkDelete" title="' + _("Delete question") + '"><img src="' + path + "adivinaDelete.png" + '" alt="' + _("Delete question") + '" class="adivinaButtonImage b-delete"/></a>\
                                <input type="text" class="adivinaWordEdition" placeholder="' + _("Word/Phrase") + '">\
                                <input type="text" class="adivinaDefinitionEdition" placeholder="' + _("Definition") + '">\
                                <a href="#" class="adivinaLinkSelect" title="' + _("Select image") + '"><img src="' + path + "adivinaSelectInactive.png" + '" alt="' + _("Delete question") + '" class="adivinaButtonImage adivinaSelectImageEdition"/></a>\
                            </div>\
                            <div class="adivinaImageBarEdition">\
                                <div class="adivinaImageEdition">\
                                    <img src="' + path + "adivinaCursor.gif" + '" class="adivinaCursorEdition" alt="Cursor" /> \
                                    <img src="' + path + "adivinaHomeImage.png" + '" class="adivinaHomeImageEdition" alt="' + _("No image") + '" /> \
                                    <img src="' + path + "adivinaHomeImage.png" + '" class="adivinaNoImageEdition" alt="' + _("No image") + '" /> \
                                </div>\
                                <div class="adivinaBarEdition">\
                                   <label>' + _("Image") + ': </label><input type="text" class="exe-file-picker adivinaURLImageEdition"  id="adivinaURLImage-' + i + '" placeholder="' + _("Indicate a valid URL of an image or select one from your device") + '"/>\
                                   <input type="button" class="exe-pick-any-file" value="Seleccionar un archivo" id="_browseForadivinaURLImage-' + i + '" onclick="$exeAuthoring.iDevice.filePicker.openFilePicker(this)">\
                                   <input type="text" class="adivinaXImageEdition" value="0" readonly />\
                                   <input type="text" class="adivinaYImageEdition" value="0" readonly />\
                                </div>\
                                <div class="adivinaMetaData">\
                                   <label>Alt:</label><input type="text" class="adivinaAlt" />\
                                   <label>' + _("Authorship") + ':</label><input type="text"  class="adivinaAuthorEdition" />\
                                   <a href="#" class="adivinaLinkClose" title="' + _("Hide image") + '"><img src="' + path + "adivinaClose.png" + '" alt="' + _("Minimize") + '" class="adivinaButtonImage"/></a>\
                                </div>\
                            </div>\
                        </div>'
        return fileWord;
    },
}