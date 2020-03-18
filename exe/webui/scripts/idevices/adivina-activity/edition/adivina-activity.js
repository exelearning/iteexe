/**
 * Advina Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez
 * Author: Ricardo Malaga Floriano
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
    i18n : {
		name : _('Word Guessing')
	},
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
        "msgGameOver": _("Game Over!"),
        "msgIndicateWord": _("Provide a word or phrase"),
        "msgClue": _("Cool! The clue is:"),
        "msgNewGame": _("Click here for a new game"),
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
        "msgTime": _("Time"),
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
        "msgAuthor": _("Author"),
		"msgOnlySaveAuto": _("Your score will be saved after each question. You can only play once."),
        "msgSaveAuto": _("Your score will be automatically saved after each question."),
        "msgYouScore": _("Your score"),
        "msgSeveralScore": _("You can save the score as many times as you want"),
        "msgYouLastScore" :_("The last score saved is"),
        "msgActityComply":_("You have already done this activity."),
        "msgPlaySeveralTimes":_("You can do this activity as many times as you want")
    },
    init: function () {
        this.ci18n.msgTryAgain = this.ci18n.msgTryAgain.replace("&percnt;","%"); // Avoid invalid HTML
        this.setMessagesInfo();
        this.createForm();
        this.addEvents();
    },
    setMessagesInfo: function() {
        var msgs = this.msgs;
        msgs.msgEProvideDefinition = _("Please provide the word definition or the valid URL of an image");
        msgs.msgESelectFile = _("The selected file does not contain a valid game");
        msgs.msgEURLValid = _("You must upload or indicate the valid URL of an image");
        msgs.msgEProvideWord = _("Please provide one word or phrase");
        msgs.msgEOneQuestion = _("Please provide at least one question");

    },
    createForm: function () {
        var html = '\
			<div id="adivinaIdeviceForm">\
				<div class="exe-form-tab" title="' + _('General settings') + '">\
                ' + $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Observe the letters, identify and fill in the missing words.")) + '\
					<fieldset class="exe-fieldset exe-fieldset-closed">\
						<legend><a href="#">' + _("Options") + '</a></legend>\
                        <div>\
                            <p>\
                                <label for="adivinaTimeQuestion">' + _("Time to answer(seconds)") + '</label>\
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
                               <label for="adivinaOptionsRamdon"><input type="checkbox" id="adivinaOptionsRamdon"> ' + _("Random questions") + ' </label>\
                            </p>\
                            <p>\
								<label for="adivinaShowSolution"><input type="checkbox" checked id="adivinaShowSolution"> ' + _("Show solutions") + '. </label> \
								<label for="adivinaTimeShowSolution">' + _("Show solution time (seconds)") + ': \
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
                            <div class="adivina-Questions" id="adivinaQuestions">\
                                <div id="adivinaInitQuestions" class="adivina-InitQuestions"></div>\
                                ' + this.getDataWordClone(false,0) + '\
                            </div>\
                    </fieldset>\
                </div>\
				' + $exeAuthoring.iDevice.gamification.itinerary.getTab() + '\
				' + $exeAuthoring.iDevice.gamification.scorm.getTab()+ '\
				' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
				' + $exeAuthoring.iDevice.gamification.share.getTab()+ '\
		    </div>\
			';
        var field = $("textarea.jsContentEditor").eq(0)
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("adivinaIdeviceForm");
		$exeAuthoring.iDevice.gamification.scorm.init();
        this.loadPreviousValues(field);
        $exeDevice.sortableList();
    },

    sortableList:function(){
        var list = $("#adivinaQuestions");
        list.sortable();
    },
    getCuestionDefault: function () {
        var p = new Object();
        p.word = '';
        p.definition = '';
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
            if (instructions.length == 1) $("#eXeGameInstructions").val(instructions.html());
            // i18n
            $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(dataGame.msgs);
        }
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
            itinerary = $exeAuthoring.iDevice.gamification.itinerary.getValues();
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
            var word = clear($.trim(words[i]).toUpperCase()),
                definition = clear($.trim(definitions[i])),
                url = $.trim(urls[i]),
                mType = 0;
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
        var scorm=$exeAuthoring.iDevice.gamification.scorm.getValues();
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
			'repeatActivity':scorm.repeatActivity
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
            $exeDevice.clone($parentPanel);
        });
        $('.adivina-Questions').on('click', 'a.adivinaLinkDrop', function (e) {
            e.preventDefault();
        });
        $('.adivina-Questions').on('click', 'a.adivinaLinkCopy', function (e) {
            e.preventDefault();
            var $parentPanel = $(this).parents('.adivinaWordMutimediaEdition');
            $exeDevice.clone($parentPanel);
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
        $('#adivinaPercentageShow').on('keyup', function () {
            var v = this.value;
            v = v.replace(/\D/g, '');
            v = v.substring(0, 3);
            this.value = v;
        });
        $('#adivinaPercentageShow').on('focusout', function () {
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
        $exeAuthoring.iDevice.gamification.itinerary.addEvents();
    },
    updateFieldGame: function (game) {
        $exeAuthoring.iDevice.gamification.itinerary.setValues(game.itinerary);
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
        $exeAuthoring.iDevice.gamification.scorm.setValues(game.isScorm,game.textButtonScorm,game.repeatActivity);
        $('.adivina-Questions .adivinaImageBarEdition').slideUp();
        $exeDevice.sortableList()
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
        document.getElementById('adivinaIdeviceForm').appendChild(link);
        link.click();
        setTimeout(function () {
            document.getElementById('adivinaIdeviceForm').removeChild(link);
            window.URL.revokeObjectURL(data);
        }, 100);
    },
    importGame: function (content) {
        var game = $exeDevice.isJsonString(content);
        if (!game || typeof game.typeGame=="undefined") {
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        }else if(game.typeGame!=='Adivina'){
            eXe.app.alert($exeDevice.msgs.msgESelectFile);
            return;
        }
        $exeDevice.updateFieldGame(game);
        tinymce.editors[0].setContent(game.instructions);
        $('.exe-form-tabs li:first-child a').click();
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
            var $clon = $($exeDevice.getDataWordClone(false,$exeDevice.active));
            $clon.insertBefore('#adivinaInitQuestions');
        } else {
            for (var i = 0; i < dataGame.wordsGame.length; i++) {
                $exeDevice.active++;
                var question = dataGame.wordsGame[i],
                    imgSelect = question.url.length > 7 ? $exeDevice.iDevicePath + "adivinaSelectActive.png" : $exeDevice.iDevicePath + "adivinaSelectInactive.png",
                    $clon = $($exeDevice.getDataWordClone(false,$exeDevice.active));
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
    clone: function (element) {
        $exeDevice.active++;
        var clon = $exeDevice.getDataWordClone(true,$exeDevice.active);
        element.after(clon);
        $exeDevice.sortableList();
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

    getDataWordClone: function (clone,i) {
        var path = $exeDevice.iDevicePath,
            button='<input type="button" class="exe-pick-any-file" value='+("Select file")+' id="_browseForadivinaURLImage-' + i + '" onclick="$exeAuthoring.iDevice.filePicker.openFilePicker(this)">';
            button=clone?button:'';
            var fileWord = '<div class="adivinaWordMutimediaEdition" >\
                            <div class="adivinaFileWordEdition">\
                                <a href="#" class="adivinaLinkDrop" title="' + _("Drag question") + '"><img src="' + path + "adivinaDrop.png" + '" alt="" class="adivinaButtonImage b-drop"/></a>\
                                <a href="#" class="adivinaLinkAdd" title="' + _("Add question") + '"><img src="' + path + "adivinaAdd.png" + '" alt="" class="adivinaButtonImage b-add"/></a>\
                                <a href="#" class="adivinaLinkCopy" title="' + _("Copy question") + '"><img src="' + path + "adivinaCopy.png" + '" alt="" class="adivinaButtonImage b-copy"/></a>\
                                <a href="#" class="adivinaLinkDelete" title="' + _("Delete question") + '"><img src="' + path + "adivinaDelete.png" + '" alt="" class="adivinaButtonImage b-delete"/></a>\
                                <label class="sr-av">' + _("Word/Phrase") + ': </label><input type="text" class="adivinaWordEdition" placeholder="' + _("Word/Phrase") + '">\
                                <label class="sr-av">' + _("Definition") + ': </label><input type="text" class="adivinaDefinitionEdition" placeholder="' + _("Definition") + '">\
                                <a href="#" class="adivinaLinkSelect" title="' + _("Select image") + '"><img src="' + path + "adivinaSelectInactive.png" + '" alt="' + _("Show/Hide image") + '" class="adivinaButtonImage adivinaSelectImageEdition"/></a>\
                            </div>\
                            <div class="adivinaImageBarEdition">\
                                <div class="adivinaImageEdition">\
                                    <img src="' + path + 'adivinaCursor.gif" class="adivinaCursorEdition" alt="Cursor" /> \
                                    <img src="" class="adivinaHomeImageEdition" alt="' + _("No image") + '" /> \
                                    <img src="' + path + 'adivinaHomeImage.png" class="adivinaNoImageEdition" alt="' + _("No image") + '" /> \
                                </div>\
                                <div class="adivinaBarEdition">\
                                   <label>' + _("Image") + ': </label><input type="text" class="exe-file-picker adivinaURLImageEdition"  id="adivinaURLImage-' + i + '" placeholder="' + _("Indicate a valid URL of an image or select one from your device") + '"/>\
                                   '+button+'\
                                   <label class="sr-av">X: </label><input type="text" class="adivinaXImageEdition" value="0" readonly />\
                                   <label class="sr-av">Y: </label><input type="text" class="adivinaYImageEdition" value="0" readonly />\
                                </div>\
                                <div class="adivinaMetaData">\
                                   <label>Alt:</label><input type="text" class="adivinaAlt" />\
                                   <label>' + _("Authorship") + ':</label><input type="text"  class="adivinaAuthorEdition" />\
                                   <a href="#" class="adivinaLinkClose" title="' + _("Hide image") + '"><img src="' + path + "adivinaClose.png" + '" alt="' + _("Minimize") + '" class="adivinaButtonImage"/></a>\
                                </div>\
                            </div>\
                        </div>';
        return fileWord;
    }
}

/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro> & Lukas Oppermann <lukas@vea.re>
 *
 *
 * Released under the MIT license.
 */
!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports?module.exports=t(require("jquery")):e.sortable=t(e.jQuery)}(this,function(e){"use strict";var t,a,r=e(),n=[],i=function(e){e.off("dragstart.h5s"),e.off("dragend.h5s"),e.off("selectstart.h5s"),e.off("dragover.h5s"),e.off("dragenter.h5s"),e.off("drop.h5s")},o=function(e){e.off("dragover.h5s"),e.off("dragenter.h5s"),e.off("drop.h5s")},d=function(e,t){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text",""),e.dataTransfer.setDragImage&&e.dataTransfer.setDragImage(t.item,t.x,t.y)},s=function(e,t){return t.x||(t.x=parseInt(e.pageX-t.draggedItem.offset().left)),t.y||(t.y=parseInt(e.pageY-t.draggedItem.offset().top)),t},l=function(e){return{item:e[0],draggedItem:e}},f=function(e,t){var a=l(t);a=s(e,a),d(e,a)},h=function(e,t){return"undefined"==typeof e?t:e},g=function(e){e.removeData("opts"),e.removeData("connectWith"),e.removeData("items"),e.removeAttr("aria-dropeffect")},c=function(e){e.removeAttr("aria-grabbed"),e.removeAttr("draggable"),e.removeAttr("role")},u=function(e,t){return e[0]===t[0]?!0:void 0!==e.data("connectWith")?e.data("connectWith")===t.data("connectWith"):!1},p=function(e){var t=e.data("opts")||{},a=e.children(t.items),r=t.handle?a.find(t.handle):a;o(e),g(e),r.off("mousedown.h5s"),i(a),c(a)},m=function(t){var a=t.data("opts"),r=t.children(a.items),n=a.handle?r.find(a.handle):r;t.attr("aria-dropeffect","move"),n.attr("draggable","true");var i=(document||window.document).createElement("span");"function"!=typeof i.dragDrop||a.disableIEFix||n.on("mousedown.h5s",function(){-1!==r.index(this)?this.dragDrop():e(this).parents(a.items)[0].dragDrop()})},v=function(e){var t=e.data("opts"),a=e.children(t.items),r=t.handle?a.find(t.handle):a;e.attr("aria-dropeffect","none"),r.attr("draggable",!1),r.off("mousedown.h5s")},b=function(e){var t=e.data("opts"),a=e.children(t.items),r=t.handle?a.find(t.handle):a;i(a),r.off("mousedown.h5s"),o(e)},x=function(i,o){var s=e(i),l=String(o);return o=e.extend({connectWith:!1,placeholder:null,dragImage:null,
    // The New eXeLearning
    // #305 (disable disableIEFix for IE11)
    // Original code: disableIEFix:!1,
    // / The New eXeLearning
    disableIEFix:(!!window.MSInputMethodContext && !!document.documentMode) == true ? 1 : !1,
    placeholderClass:"sortable-placeholder",draggingClass:"sortable-dragging",hoverClass:!1},o),s.each(function(){var i=e(this);if(/enable|disable|destroy/.test(l))return void x[l](i);o=h(i.data("opts"),o),i.data("opts",o),b(i);var s,g,c,p=i.children(o.items),v=null===o.placeholder?e("<"+(/^ul|ol$/i.test(this.tagName)?"li":"div")+' class="'+o.placeholderClass+'"/>'):e(o.placeholder).addClass(o.placeholderClass);if(!i.attr("data-sortable-id")){var I=n.length;n[I]=i,i.attr("data-sortable-id",I),p.attr("data-item-sortable-id",I)}if(i.data("items",o.items),r=r.add(v),o.connectWith&&i.data("connectWith",o.connectWith),m(i),p.attr("role","option"),p.attr("aria-grabbed","false"),o.hoverClass){var C="sortable-over";"string"==typeof o.hoverClass&&(C=o.hoverClass),p.hover(function(){e(this).addClass(C)},function(){e(this).removeClass(C)})}p.on("dragstart.h5s",function(r){r.stopImmediatePropagation(),o.dragImage?(d(r.originalEvent,{item:o.dragImage,x:0,y:0}),console.log("WARNING: dragImage option is deprecated and will be removed in the future!")):f(r.originalEvent,e(this),o.dragImage),t=e(this),t.addClass(o.draggingClass),t.attr("aria-grabbed","true"),s=t.index(),a=t.height(),g=e(this).parent(),t.parent().triggerHandler("sortstart",{item:t,placeholder:v,startparent:g})}),p.on("dragend.h5s",function(){t&&(t.removeClass(o.draggingClass),t.attr("aria-grabbed","false"),t.show(),r.detach(),c=e(this).parent(),t.parent().triggerHandler("sortstop",{item:t,startparent:g}),(s!==t.index()||g.get(0)!==c.get(0))&&t.parent().triggerHandler("sortupdate",{item:t,index:c.children(c.data("items")).index(t),oldindex:p.index(t),elementIndex:t.index(),oldElementIndex:s,startparent:g,endparent:c}),t=null,a=null)}),e(this).add([v]).on("drop.h5s",function(a){return u(i,e(t).parent())?(a.stopPropagation(),r.filter(":visible").after(t),t.trigger("dragend.h5s"),!1):void 0}),p.add([this]).on("dragover.h5s dragenter.h5s",function(n){if(u(i,e(t).parent())){if(n.preventDefault(),n.originalEvent.dataTransfer.dropEffect="move",p.is(this)){var d=e(this).height();if(o.forcePlaceholderSize&&v.height(a),d>a){var s=d-a,l=e(this).offset().top;if(v.index()<e(this).index()&&n.originalEvent.pageY<l+s)return!1;if(v.index()>e(this).index()&&n.originalEvent.pageY>l+d-s)return!1}t.hide(),v.index()<e(this).index()?e(this).after(v):e(this).before(v),r.not(v).detach()}else r.is(this)||e(this).children(o.items).length||(r.detach(),e(this).append(v));return!1}})})};return x.destroy=function(e){p(e)},x.enable=function(e){m(e)},x.disable=function(e){v(e)},e.fn.sortable=function(e){return x(this,e)},x});