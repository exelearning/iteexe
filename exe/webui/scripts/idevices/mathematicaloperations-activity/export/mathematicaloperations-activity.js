/**
 * Mathematical Operations activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros
 * Author: Manuel Narváez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeMathOperations = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#00a300',
        red: '#b3092f',
        white: '#ffffff',
        yellow: '#f3d55a'
    },
    colors: {
        black: "#1c1b1b",
        blue: '#dfe3f1',
        green: '#caede8',
        red: '#fbd2d6',
        white: '#ffffff',
        yellow: '#fcf4d3'
    },
    defaultSettings: {
        type: "result", // result, operator, operandA, operandB, random (to guess)
        number: 10, // Number or operations
        operations: '1111', // Add, subtract, multiply, divide,
        min: -1000, // Smallest number included
        max: 1000, // Highest number included
        decimalsInOperands: 0, // Allow decimals
        decimalsInResults: 1, // Allow decimals in results
        negative: 1, // Allow negative results
        zero: 1, // Allow zero in results
        mode: 0,
        solution: 1

    },
    options: [],
    hasSCORMbutton: false,
    isInExe: false,
    userName: '',
    previousScore: '',
    initialScore: '',
    hasLATEX: false,
    init: function () {
        this.activities = $('.mathoperations-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeMathOperations.supportedBrowser('mtho')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Word Guessing') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/mathematicaloperations-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeMathOperations.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeMathOperations.enable()');
        else this.enable();
        $eXeMathOperations.mScorm = scorm;
        var callSucceeded = $eXeMathOperations.mScorm.init();
        if (callSucceeded) {
            $eXeMathOperations.userName = $eXeMathOperations.getUserName();
            $eXeMathOperations.previousScore = $eXeMathOperations.getPreviousScore();
            $eXeMathOperations.mScorm.set("cmi.core.score.max", 10);
            $eXeMathOperations.mScorm.set("cmi.core.score.min", 0);
            $eXeMathOperations.initialScore = $eXeMathOperations.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeMathOperations.options[instance],
            text = '';
        $('#mthoSendScore-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgOnlySaveAuto;
            } else if (!repeatActivity && prevScore !== "") {
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            }
        } else if (mOptions.isScorm === 2) {
            $('#mthoSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#mthoSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#mthoRepeatActivity-' + instance).text(text);
        $('#mthoRepeatActivity-' + instance).fadeIn(1000);
    },
    getUserName: function () {
        var user = $eXeMathOperations.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeMathOperations.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeMathOperations.mScorm.quit();
    },
    enable: function () {
        $eXeMathOperations.loadGame();
    },
    loadGame: function () {
        $eXeMathOperations.options = [];
        $eXeMathOperations.activities.each(function (i) {
            var dl = $(".mathoperations-DataGame", this),
                mOption = $eXeMathOperations.loadDataGame(dl, i),
                msg = mOption.msgs.msgPlayStart;
            $eXeMathOperations.options.push(mOption);
            var matho = $eXeMathOperations.createInterfaceMathO(i);
            dl.before(matho).remove();
            $('#mthoGameMinimize-' + i).hide();
            $('#mthoGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#mthoGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#mthoGameContainer-' + i).show();
            }
            $('#mthoMessageMaximize-' + i).text(msg);
            $('#mthoDivFeedBack-' + i).prepend($('.mathoperations-feedback-game', this));
            $eXeMathOperations.addEvents(i);
            $('#mthoDivFeedBack-' + i).hide();
            $eXeMathOperations.createQuestions(i);
        });
        if ($eXeMathOperations.hasLATEX == 1 && typeof (MathJax) == "undefined") {
            $eXeMathOperations.loadMathJax();
        }
    },
    loadDataGame: function (data, instance) {
        var json = data.text(),
            options = $eXeMathOperations.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex || options.mode == 1) {
            $eXeMathOperations.hasLATEX = true;
        }
        options.hits = 0;
        options.errors = 0;
        options.score = 0;
        options.counter = 0;
        options.gameOver = false;
        options.gameStarted = false;
        options.obtainedClue = false;
        options.solution = typeof options.solution == "undefined" ? true : options.solution;
        options.mode = typeof options.mode == "undefined" ? 0 : options.mode;
        options.negativeFractions = typeof options.negativeFractions == "undefined" ? false : options.negativeFractions;
        options.msgs.msgFracctionNoValid = typeof options.msgs.msgFracctionNoValid == "undefined" ? 'Escribe una fracción válida' : options.msgs.msgFracctionNoValid;
        options.errorType = typeof options.errorType == "undefined" ? 0 : options.errorType;
        options.errorRelative = typeof options.errorRelative == "undefined" ? 0 : options.errorRelative;
        options.errorAbsolute = typeof options.errorAbsolute == "undefined" ? 0 : options.errorAbsolute;
        options = $eXeMathOperations.loadQuestions(options, instance);
        options.evaluation = typeof options.evaluation == "undefined" ? false : options.evaluation;
        options.evaluationID = typeof options.evaluationID == "undefined" ? '' : options.evaluationID;
        options.id = typeof options.id == "undefined" ? false : options.id;
        return options;
    },
    reloadGame: function (instance) {
        var options = $eXeMathOperations.options[instance];
        options.hits = 0;
        options.errors = 0;
        options.score = 0;
        options.counter = 0;
        options.gameOver = false;
        options.gameStarted = false;
        options.obtainedClue = false;
        options.solution = typeof options.solution == "undefined" ? true : options.solution;
        options.mode = typeof options.mode == "undefined" ? 0 : options.mode;
        options.negativeFractions = typeof options.negativeFractions == "undefined" ? false : options.negativeFractions;
        options.msgs.msgFracctionNoValid = typeof options.msgs.msgFracctionNoValid == "undefined" ? 'Escribe una fracción válida' : options.msgs.msgFracctionNoValid;
        options.errorType = typeof options.errorType == "undefined" ? 0 : options.errorType;
        options.errorRelative = typeof options.errorRelative == "undefined" ? 0 : options.errorRelative;
        options.errorAbsolute = typeof options.errorAbsolute == "undefined" ? 0 : options.errorAbsolute;
        options = $eXeMathOperations.loadQuestions(options, instance);
        $('#mthoDivFeedBack-' + instance).hide();
        $('#mthoStartGame-' + instance).hide();
        $('#mthoPShowClue-' + instance).hide();
        $eXeMathOperations.createQuestions(instance);
        if ($eXeMathOperations.hasLATEX == 1 && typeof (MathJax) == "undefined") {
            $eXeMathOperations.loadMathJax();
        }

    },
    createQuestions: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        var html = ''
        for (var i = 0; i < mOptions.number; i++) {
            html += $eXeMathOperations.getQuestion(instance, mOptions.type, i, mOptions.components[i][0], mOptions.components[i][1], mOptions.components[i][2], mOptions.components[i][3], mOptions.decimalsInOperands);
        }
        html += '<p class="MTHO-pagination">';
        html += '<a id="MTHO-' + instance + '-prevLink" style="visibility:hidden" href="#" onclick="$mathoQuestions.goTo(-1,' + mOptions.number + ',' + instance + ');return false">' + mOptions.msgs.msgPrevious + '</a>';
        html += '<span id="mathoPage-' + instance + '">1</span>/' + mOptions.number;
        html += ' <a id="MTHO-' + instance + '-nextLink" href="#"';
        if (mOptions.number == 1) html += ' style="visibility:hidden"';
        html += ' onclick="$eXeMathOperations.goTo(1,' + mOptions.number + ',' + instance + ');return false">' + mOptions.msgs.msgNext + '</a> ';
        html += '</p>';
        html += '<table id="mathoResults-' + instance + '">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>' + mOptions.msgs.msgQuestion + ' </th>';
        html += '<th>' + mOptions.msgs.msgCorrect + ' </th>';
        html += '<th>' + mOptions.msgs.msgSolution + ' </th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (var c = 0; c < mOptions.number; c++) {
            html += '<tr>';
            html += '<td><a href="#" onclick="$eXeMathOperations.goTo(' + c + ',' + mOptions.number + ',' + instance + ');return false">' + (c + 1) + '</a> </td>';
            html += '<td> </td>';
            html += '<td> </td>';
            html += '</tr>';
        }
        html += '</tbody>';
        html += '<table>';
        html += '<div class="MTHO-Summary">';
        html += '<ul>';
        html += '<li><strong>' + mOptions.msgs.msgWithoutAnswer + ': </strong><span id="mathoResults-' + instance + '-total">' + mOptions.number + '</span></li>';
        html += '<li><strong>' + mOptions.msgs.msgReplied + ': </strong><span id="mathoResults-' + instance + '-answered">0</span></li>';
        html += '<li><strong>' + mOptions.msgs.msgCorrects + ': </strong><span id="mathoResults-' + instance + '-right-answered">0</span></li>';
        html += '<li><strong>' + mOptions.msgs.msgIncorrects + ': </strong><span id="mathoResults-' + instance + '-wrong-answered">0</span></li>';
        html += '<li><strong>' + mOptions.msgs.msgScore + ': </strong><span id="mathoResults-' + instance + '-result">0</span>%</li>';
        html += '</ul>';
        html += '</div>';
        $('#mthoMultimedia-' + instance).empty();
        $('#mthoMultimedia-' + instance).append(html);
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
    createInterfaceMathO: function (instance) {
        var html = '',
            path = $eXeMathOperations.idevicePath,
            msgs = $eXeMathOperations.options[instance].msgs,
            html = '';
        html += '<div class="MTHO-MainContainer"  id="mthoMainContainer-' + instance + '">\
        <div class="MTHO-GameMinimize" id="mthoGameMinimize-' + instance + '">\
            <a href="#" class="MTHO-LinkMaximize" id="mthoLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + "mthoIcon.png" + '" class="MTHO-IconMinimize MTHO-Activo"  alt="">\
            <div class="MTHO-MessageMaximize" id="mthoMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="MTHO-GameContainer" id="mthoGameContainer-' + instance + '">\
            <div class="MTHO-GameScoreBoard">\
                <div class="MTHO-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="mthoPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="mthoPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="mthoPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="mthoPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="MTHO-LifesGame" id="mthoLifesAdivina-' + instance + '">\
                </div>\
                <div class="MTHO-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
					<div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
                    <p  id="mthoPTime-' + instance + '" class="MTHO-PTime">00:00</p>\
                    <a href="#" class="MTHO-LinkMinimize" id="mthoLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  MTHO-Activo"></div>\
                    </a>\
                    <a href="#" class="MTHO-LinkFullScreen" id="mthoLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  MTHO-Activo" id="mthoFullScreen-' + instance + '"></div>\
					</a>\
				</div>\
            </div>\
            <div class="MTHO-ShowClue" id="mthoShowClue-' + instance + '">\
                <div class="sr-av">' + msgs.msgClue + '</div>\
                <p class=" MTHO-PShowClue MTHO-parpadea" id="mthoPShowClue-' + instance + '"></p>\
           </div>\
           <div class="MTHO-Flex" id="mthoDivImgHome-' + instance + '">\
                <img src="' + path + "mthoHome.svg" + '" class="MTHO-ImagesHome" id="mthoPHome-' + instance + '"  alt="' + msgs.msgNoImage + '" />\
           </div>\
           <div class="MTHO-StartGame"><a href="#" id="mthoStartGame-' + instance + '" style="display:none"></a></div>\
           <div class="MTHO-Multimedia" id="mthoMultimedia-' + instance + '">\
           </div>\
            <div class="MTHO-Cubierta" id="mthoCubierta-' + instance + '">\
                <div class="MTHO-CodeAccessDiv" id="mthoCodeAccessDiv-' + instance + '">\
                    <p class="MTHO-MessageCodeAccessE" id="mthoMesajeAccesCodeE-' + instance + '"></p>\
                    <div class="MTHO-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="MTHO-CodeAccessE"  id="mthoCodeAccessE-' + instance + '">\
                        <a href="#" id="mthoCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                            <div class="exeQuextIcons-Submit MTHO-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="MTHO-DivFeedBack" id="mthoDivFeedBack-' + instance + '">\
                    <input type="button" id="mthoFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
                </div>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },
    loadQuestionsNumbers: function (dataGame) {
        var mOptions = dataGame;
        mOptions.components = [];
        var min = $eXeMathOperations.defaultSettings.min;
        if (!isNaN(mOptions.min)) min = parseFloat(mOptions.min);
        mOptions.min = min;
        var max = $eXeMathOperations.defaultSettings.max;
        if (!isNaN(mOptions.max)) max = parseFloat(mOptions.max);
        mOptions.max = max;
        for (var i = 0; i < mOptions.number; i++) {
            function getOperation(min, max) {
                // Get random operation
                var operators = "+-*/";
                var operationsToDo = "";
                for (var z = 0; z < mOptions.operations.length; z++) {
                    if (mOptions.operations[z] != 0) operationsToDo += operators[z];
                }
                var operation = operationsToDo[$eXeMathOperations.getRandomNo(0, operationsToDo.length, 0)];
                var operandA = $eXeMathOperations.getRandomNo(mOptions.min, mOptions.max, mOptions.decimalsInOperands);
                var operandB = $eXeMathOperations.getRandomNo(mOptions.min, mOptions.max, mOptions.decimalsInOperands);
                var result;
                if (operation == "+") result = operandA + operandB;
                else if (operation == "-") result = operandA - operandB;
                else if (operation == "*") result = operandA * operandB;
                else result = operandA / operandB;

                result = result.toFixed(2);
                result = result.toString().replace(".00", "");
                result = parseFloat(result);
                return [
                    operandA,
                    operation,
                    operandB,
                    result
                ];
            }
            var components = getOperation(mOptions.min, mOptions.max);
            // No decimals, negative results or zero
            if (mOptions.decimalsInResults == false && mOptions.negative == false && mOptions.zero == false) {
                while (components[3] !== parseInt(components[3]) || components[3] <= 0) {
                    components = getOperation(mOptions.min, mOptions.max);
                }
            }
            // No decimals or negative results
            else if (mOptions.decimalsInResults == false && mOptions.negative == false) {
                while (components[3] !== parseInt(components[3]) || components[3] < 0) {
                    components = getOperation(mOptions.min, mOptions.max);
                }
            }
            // No decimals or zero
            else if (mOptions.decimalsInResults == false && mOptions.zero == false) {
                while (components[3] !== parseInt(components[3]) || components[3] == 0) {
                    components = getOperation(mOptions.min, mOptions.max);
                }
            }

            // No negative results or zero
            else if (mOptions.negative == false && mOptions.zero == false) {
                while (components[3] <= 0) {
                    components = getOperation(mOptions.min, mOptions.max);
                }
            }

            // No decimals
            else if (mOptions.decimalsInResults == false) {
                while (components[3] !== parseInt(components[3])) {
                    components = getOperation(mOptions.min, mOptions.max);
                }
            }

            // No negative results
            else if (mOptions.negative == false) {
                while (components[3] < 0) {
                    components = getOperation(mOptions.min, mOptions.max);
                }
            }

            // No zero
            else if (mOptions.zero == false) {
                while (components[3] == 0) {
                    components = getOperation(mOptions.min, mOptions.max);
                }
            }

            // instance, i, operandA, operation, operandB, result
            if (mOptions.type == "random") {
                var options = ["operator", "result", "operandA", "operandB"];
                mOptions.type = options[this.getRandomNo(0, 4, 0)];
            }
            mOptions.components.push(components)
        }
        return mOptions;
    },
    loadQuestions: function (dataGame, instance) {
        var mOptions = {};
        if (dataGame.mode == 1) {
            mOptions = $eXeMathOperations.loadQuestionFractions(dataGame)

        } else {
            mOptions = $eXeMathOperations.loadQuestionsNumbers(dataGame)

        }
        return mOptions;
    },
    showCubiertaOptions(mode, instance) {
        if (mode === false) {
            $('#mthoCubierta-' + instance).fadeOut();
            return;
        }
        $('#mthoCodeAccessDiv-' + instance).hide();
        $('#mthoDivFeedBack-' + instance).hide();
        switch (mode) {
            case 0:
                $('#mthoCodeAccessDiv-' + instance).show();
                break;
            case 1:
                $('#mthoDivFeedBack-' + instance).find('.identifica-feedback-game').show();
                $('#mthoDivFeedBack-' + instance).css('display', 'flex')
                $('#mthoDivFeedBack-' + instance).show();
                break;
            default:
                break;
        }
        $('#mthoCubierta-' + instance).fadeIn();
    },
    goTo: function (target, total, instance) {
        $("form.mathoQuestion-" + instance).hide();
        $("#mathoQuestion-" + instance + "-" + target).fadeIn("normal", function () {
            $("input[type=text]", this).focus();
        });
        // Update the links		
        var counter = (target + 1);
        $("#mathoPage-" + instance).html(counter);
        var visibility = "visible";
        var nextLink = document.getElementById("MTHO-" + instance + "-nextLink");
        if (nextLink) {
            if (counter == total) visibility = "hidden";
            nextLink.style.visibility = visibility;
            nextLink.onclick = function () {
                $eXeMathOperations.goTo(counter, total, instance);
                return false;
            }
        }
        visibility = "visible";
        var prevLink = document.getElementById("MTHO-" + instance + "-prevLink");
        if (prevLink) {
            if (counter == 1) visibility = "hidden";
            prevLink.style.visibility = visibility;
            prevLink.onclick = function () {
                $eXeMathOperations.goTo((target - 1), total, instance);
                return false;
            }
        }
        var html = $('#mthoMultimedia-' + instance).html(),
            latex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMathOperations.updateLatex('mthoMultimedia-' + instance);
        }
    },
    getRandomNo: function (from, to, allowDecimals) {
        if (allowDecimals != 0) return parseFloat(((Math.random() * to) + from).toFixed(allowDecimals));
        else return Math.floor(Math.random() * to) + from
    },
    paginate: function (e, currPos, total, instance, action) {
        // mathoPage-X
        // mathoQuestion-instance-i
        var formToShow;
        var counter = currPos + 1;
        var currentForm = $("#mathoQuestion-" + instance + "-" + currPos);
        if (action == "next") {
            formToShow = $("#mathoQuestion-" + instance + "-" + (currPos + 1));
            counter = counter + 1;
        } else {
            formToShow = $("#mathoQuestion-" + instance + "-" + (currPos - 1));
            counter = counter - 1;
        }
        currentForm.hide();
        formToShow.fadeIn();
        $("#mathoPage-" + instance).html(counter);
        // Update the links		
        var visibility = "visible";
        var nextLink = document.getElementById("MTHO-" + instance + "-nextLink");
        if (nextLink) {
            if (counter == total) visibility = "hidden";
            nextLink.style.visibility = visibility;
            nextLink.onclick = function () {
                $eXeMathOperations.paginate(this, counter - 1, total, instance, 'next');
                return false;
            }
        }
        visibility = "visible";
        var prevLink = document.getElementById("MTHO-" + instance + "-prevLink");
        if (prevLink) {
            if (counter == 1) visibility = "hidden";
            prevLink.style.visibility = visibility;
            prevLink.onclick = function () {
                $eXeMathOperations.paginate(this, counter - 1, total, instance, 'prev');
                return false;
            }
        }
    },
    checkInputContent: function (e, type, mode) {
        var str = e.value;
        var lastCharacter = str.slice(-1);
        if (type == "operator") {
            if (lastCharacter != "+" && lastCharacter != "-" && lastCharacter != "*" && lastCharacter != "x" && lastCharacter != "/" && lastCharacter != ":") {
                e.value = str.substring(0, str.length - 1);
            } else if (lastCharacter == "*") {
                e.value = str.substring(0, str.length - 1) + "x";
            }
        } else {

            if (mode == 1) {
                if (lastCharacter == "/" || lastCharacter == "-") {} else {
                    if (isNaN(parseInt(lastCharacter))) {
                        e.value = str.substring(0, str.length - 1);
                    }
                }
                return;
            }
            if (lastCharacter == "," || lastCharacter == ".") {
                e.value = str.substring(0, str.length - 1);
                if (e.value.indexOf(".") == -1) {
                    if (e.value == "") e.value = 0;
                    e.value = e.value + ".";
                }
            } else if (str.slice(0) == "-") {} else {
                if (isNaN(parseFloat(lastCharacter))) {
                    e.value = str.substring(0, str.length - 1);
                }
            }
        }
    },
    getQuestion: function (instance, type, i, operandA, operation, operandB, result, numberOfDecimals) {
        var mOptions = $eXeMathOperations.options[instance];
        if (operation == "*") operation = "x";
        if (type == "result") result = '<input type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:5em" onkeyup="$eXeMathOperations.checkInputContent(this,\'number\',' + mOptions.mode + ')" />';
        else if (type == "operator") operation = '<input class="operator" type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:1em" onkeyup="$eXeMathOperations.checkInputContent(this,\'operator\',' + mOptions.mode + ')" />';
        else if (type == "operandA") operandA = '<input type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:5em" onkeyup="$eXeMathOperations.checkInputContent(this,\'number\',' + mOptions.mode + ')" />';
        else if (type == "operandB") operandB = '<input type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:5em" onkeyup="$eXeMathOperations.checkInputContent(this,\'number\',' + mOptions.mode + ')" />';
        var css = ' style="display:none"';
        if (i == 0) css = '';
        var html = '<form class="MTHO-Form mathoQuestion-' + instance + '" id="mathoQuestion-' + instance + '-' + i + '" onsubmit="return $eXeMathOperations.checkAnswer(this,\'' + type + '\',\'' + numberOfDecimals + '\',' + mOptions.mode + ')"' + css + '>';
        html += '<p>';
        html += '<label for="mathoQuestion-' + instance + '-' + i + '-answer">';
        html += '<span class="operandA">' + operandA + '</span>';
        html += '<span class="operation">' + operation + '</span>';;
        html += '<span class="operandB">' + operandB + '</span>';
        html += "=";
        html += '<span class="operationResult">' + result + '</span>';
        html += '</label>';
        html += ' <input type="submit" value="' + mOptions.msgs.msgCheck + '" id="mathoQuestion-' + instance + '-' + i + '-submit" /> <span id="mathoQuestion-' + instance + '-' + i + '-warning"></span>';
        html += '</p>';
        html += '</form>';
        return html;
    },
    reduceDecimals: function (value) {
        if (typeof value === 'string' || value instanceof String) {
            // Convierte la cadena en un número de coma flotante
            value = parseFloat(value);
        } else if (typeof value !== 'number' || isNaN(value)) {
            // Devuelve NaN si value no es una cadena ni un número válido
            return NaN;
        }

        // Redondea el número a 2 decimales y elimina los ceros finales
        let result = value.toFixed(2).replace(/\.?0+$/, '');

        // Si el resultado es un número entero, elimina el punto y los ceros finales adicionales
        if (result.indexOf('.') === result.length - 1) {
            result = result.slice(0, result.indexOf('.'));
        }

        // Devuelve el resultado como una cadena
        return String(result);
    },
    removeUnnecessaryDecimals: function (num, fix) {
        var res = num;
        if (fix != false) res = res.toFixed(2);
        var res = res.toString().replace(".00", "");
        var lastCharacter = res.slice(-1);
        if (lastCharacter == '0' && res.indexOf(".") != -1) {
            res = res.substring(0, res.length - 1);
        }
        return res;
    },
    checkAnswer: function (e, type, numberOfDecimals, mode) {
        var result = false;
        if (mode == 1) {
            result = $eXeMathOperations.checkAnswerFranctions(e, type)
        } else {
            result = $eXeMathOperations.checkAnswerNumbers(e, type, numberOfDecimals, )
        }
        return result;
    },
    checkAnswerFranctions: function (e, type) {
        var id = e.id.replace("mathoQuestion-", "").split("-");
        var instance = parseInt(id[0]);
        var mOptions = $eXeMathOperations.options[instance];
        var numf = parseInt(id[1]);
        var opA = mOptions.fractions[numf][0];
        var opO = mOptions.fractions[numf][1];
        var opB = mOptions.fractions[numf][2];
        var opR = mOptions.fractions[numf][3];
        var operandA = $(".operandA", e);
        var operandA_input = $("INPUT", operandA);
        var operandB = $(".operandB", e);
        var operandB_input = $("INPUT", operandB);
        var operation = $(".operation", e);
        var operation_input = $("INPUT", operation);
        var operationResult = $(".operationResult", e);
        var operationResult_input = $("INPUT", operationResult);
        // Not answered
        if ($("INPUT[type=text]", e).val() == "") {
            var msg = $("#" + e.id + "-warning");
            msg.html(mOptions.msgs.msgIncomplete);
            setTimeout(function () {
                msg.html(mOptions.msgs.msgIncomplete);
            }, 2000);
            return false;
        }
        if (operandA_input.length == 1) {
            if (!$eXeMathOperations.isFraction(operandA_input.val())) {
                var msg = $("#" + e.id + "-warning");
                msg.html(mOptions.msgs.msgFracctionNoValid);
                setTimeout(function () {
                    msg.html(mOptions.msgs.msgFracctionNoValid);
                }, 2000);
                return false;
            }
        } else if (operandB_input.length == 1) {
            if (!$eXeMathOperations.isFraction(operandB_input.val())) {
                var msg = $("#" + e.id + "-warning");
                msg.html(mOptions.msgs.msgFracctionNoValid);
                setTimeout(function () {
                    msg.html(mOptions.msgs.msgFracctionNoValid);
                }, 2000);
                return false;
            }
        } else if (operation_input.length == 1) {
            var ops = '+-/*x:';
            var op = operation_input.val().trim().toLowerCase();
            if (ops.indexOf(op) == -1) {
                var msg = $("#" + e.id + "-warning");
                msg.html(mOptions.msgs.msgOperatNotValid);
                setTimeout(function () {
                    msg.html(mOptions.msgs.msgOperatNotValid);
                }, 2000);
                return false;
            }
        } else if (operationResult_input.length == 1) {
            if (!$eXeMathOperations.isFraction(operationResult_input.val())) {
                var msg = $("#" + e.id + "-warning");
                msg.html(mOptions.msgs.msgFracctionNoValid);
                setTimeout(function () {
                    msg.html(mOptions.msgs.msgFracctionNoValid);
                }, 2000);
                return false;
            }
        }
        var table = $("#mathoResults-" + instance);
        var trs = $("tbody tr", table);
        var tr = trs.eq(id[1]);
        if (operandA_input.length == 1) operandA = operandA_input.val();
        else operandA = opA;

        if (operation_input.length == 1) operation = operation_input.val();
        else operation = operation.text();

        if (operandB_input.length == 1) operandB = operandB_input.val();
        else operandB = opB;

        var operationResult = $(".operationResult", e);
        var operationResult_input = $("INPUT", operationResult);
        if (operationResult_input.length == 1) operationResult = operationResult_input.val();
        else operationResult = opR;

        var right = false;
        var rightResult = $eXeMathOperations.operateFractions(operandA, operandB, operation, true);
        if ($eXeMathOperations.compareFractions(operationResult, rightResult, mOptions.solution)) right = true;
        // Include the results in the table
        var tds = $("td", tr);
        var rightTD = tds.eq(1);
        var solutionTD = tds.eq(2);
        var base = "mathoResults-" + instance + "-";

        $("#" + e.id + "-submit").hide();
        e.onsubmit = function () {
            return false;
        }
        $("#" + e.id + "-answer").attr("disabled", "disabled");
        // Go to the next page
        var nextFormId = (parseFloat(e.id.replace("mathoQuestion-" + instance + "-", ""))) + 1;
        var nextForm = document.getElementById("mathoQuestion-" + instance + "-" + nextFormId);
        if (nextForm) {
            $eXeMathOperations.goTo(nextFormId, $("form.mathoQuestion-" + instance).length, instance);
        }
        // Summary
        var total = $("#" + base + "total");
        total.html((parseFloat(total.html()) - 1));
        var answered = $("#" + base + "answered");
        answered.html((parseFloat(answered.html()) + 1));
        var rightAnswered = $("#" + base + "right-answered");

        if (right) {
            tr.attr("class", "MTHO-tr-right");
            rightTD.html('<span class="MTHO-right">1</span> ');
            rightAnswered.html((parseFloat(rightAnswered.html()) + 1));
        } else {
            tr.attr("class", "MTHO-tr-wrong");
            rightTD.html('<span class="MTHO-wrong">0</span> ');
            var wrongAnswered = $("#" + base + "wrong-answered");
            wrongAnswered.html((parseFloat(wrongAnswered.html()) + 1));
        }
        if (type == "operator") {
            rightResult = "";
            if ($eXeMathOperations.operateFractions(operandA, operandB, '+', mOptions.solution) == opR) rightResult += "+ ";
            if ($eXeMathOperations.operateFractions(operandA, operandB, '-', mOptions.solution) == opR) rightResult += "- ";
            if ($eXeMathOperations.operateFractions(operandA, operandB, '*', mOptions.solution) == opR) rightResult += "x ";
            if ($eXeMathOperations.operateFractions(operandA, operandB, ':', mOptions.solution) == opR) rightResult += ": ";
        }
        if (type == "operandA") {
            if (right) rightResult = opA;
            else {
                if (operation == "+") rightResult = opR - opB;
                else if (operation == "-") rightResult = $eXeMathOperations.operateFractions(opR, opB, '+', mOptions.solution);
                else if (operation == "*" || operation == "x") rightResult = $eXeMathOperations.operateFractions(opR, opB, ':', mOptions.solution);
                else rightResult = $eXeMathOperations.operateFractions(opR, opB, '*', mOptions.solution);
            }
        }
        // Type = operandB
        if (type == "operandB") {
            if (right) rightResult = opB;
            else {
                if (operation == "+") rightResult = $eXeMathOperations.operateFractions(opR, opA, '-', mOptions.solution);
                else if (operation == "-") rightResult = $eXeMathOperations.operateFractions(opR, opA, '-', mOptions.solution);
                else if (operation == "*" || operation == "x") rightResult = $eXeMathOperations.operateFractions(opR, opA, ':', mOptions.solution);
                else rightResult = $eXeMathOperations.operateFractions(opR, opA, '*', mOptions.solution);;
            }

        }
        if (type != "operator") {
            rightResult = $eXeMathOperations.createLatex(rightResult);
        }
        solutionTD.html(rightResult);
        // Qualification
        var qualification = this.removeUnnecessaryDecimals(100 * parseFloat(rightAnswered.html()) / trs.length);
        $("#" + base + "result").html(qualification);
        $eXeMathOperations.updateLatex('mthoMultimedia-' + instance);
        $eXeMathOperations.updateScore(right, instance);
        return false;
    },
    createLatex: function (fraction) {
        var [numerator, denominator] = fraction.split('/');
        if (typeof denominator == "undefined" || denominator == "undefined") denominator = 1;
        var signoDenominador = denominator < 0 ? '-' : '';
        if (denominator == '1') {
            return `\\(${numerator}\\)`;
        } else if (denominator == '-1') {
            numerator = -parseInt(numerator);
            return `\\(${numerator}\\)`;
        } else {
            return `\\(\\dfrac{${numerator}}{${signoDenominador}${Math.abs(denominator)}}\\)`;
        }
    },
    checkAnswerNumbers: function (e, type, numberOfDecimals) {
        var id = e.id.replace("mathoQuestion-", "").split("-");
        var instance = id[0];
        var mOptions = $eXeMathOperations.options[instance];
        var pOperationResult = 0;
        var pRightResult = 0;
        // Not answered
        if ($("INPUT[type=text]", e).val() == "") {
            var msg = $("#" + e.id + "-warning");
            msg.html(mOptions.msgs.msgIncomplete);
            setTimeout(function () {
                msg.html(mOptions.msgs.msgIncomplete);
            }, 2000);
            return false;
        }

        var table = $("#mathoResults-" + instance);
        var trs = $("tbody tr", table);
        var tr = trs.eq(id[1]);

        var operandA = $(".operandA", e);
        var operandA_input = $("INPUT", operandA);
        if (operandA_input.length == 1) operandA = operandA_input.val();
        else operandA = operandA.text();
        operandA = parseFloat(operandA);

        var operation = $(".operation", e);
        var operation_input = $("INPUT", operation);
        if (operation_input.length == 1) {
            operation = operation_input.val();
            operation.toLowerCase();
            var operators_a = "x*+-/:"
            if (operation.length > 1 || operators_a.indexOf(operation) == -1) {
                var msg = $("#" + e.id + "-warning");
                msg.html(mOptions.msgs.msgOperatNotValid);
                setTimeout(function () {
                    msg.html(mOptions.msgs.msgOperatNotValid);
                }, 2000);
                return false;
            }
        } else {
            operation = operation.text();
        }


        var operandB = $(".operandB", e);
        var operandB_input = $("INPUT", operandB);
        if (operandB_input.length == 1) operandB = operandB_input.val();
        else operandB = operandB.text();
        operandB = parseFloat(operandB);

        var operationResult = $(".operationResult", e);
        var operationResult_input = $("INPUT", operationResult);
        if (operationResult_input.length == 1) operationResult = operationResult_input.val();
        else operationResult = operationResult.text();
        operationResult = parseFloat(operationResult);
        // operationResult = operationResult.toFixed(numberOfDecimals);

        operationResult = operationResult.toFixed(2);
        operationResult = parseFloat(operationResult);
        pOperationResult = operationResult;

        // Check
        var right = false;
        var rightResult = 0;
        if (operation == "+") rightResult = operandA + operandB;
        else if (operation == "-") rightResult = operandA - operandB;
        else if (operation == "x" || operation == "*") rightResult = operandA * operandB;
        else if (operation == "/" || operation == ":") rightResult = operandA / operandB;

        // rightResult = rightResult.toFixed(numberOfDecimals);
        pRightResult = rightResult;
        rightResult = rightResult.toFixed(2);
        if (rightResult == operationResult) right = true;
        if (mOptions.errorType > 0) {
            var ep = mOptions.errorType == 1 ? pRightResult * mOptions.errorRelative : mOptions.errorAbsolute;
            var errormin = pRightResult - ep;
            errormin = errormin.toFixed(2);
            errormin = parseFloat(errormin);

            var errormax = pRightResult + ep;
            errormax = errormax.toFixed(2);
            errormax = parseFloat(errormax);
            right = (pOperationResult >= errormin) && (pOperationResult <= errormax);
        }
        // Include the results in the table
        var tds = $("td", tr);
        var rightTD = tds.eq(1);
        var solutionTD = tds.eq(2);
        var base = "mathoResults-" + instance + "-";

        // Hide the submit button and disable the form
        $("#" + e.id + "-submit").hide();
        e.onsubmit = function () {
            return false;
        }
        $("#" + e.id + "-answer").attr("disabled", "disabled");

        // Go to the next page
        var nextFormId = (parseFloat(e.id.replace("mathoQuestion-" + instance + "-", ""))) + 1;
        var nextForm = document.getElementById("mathoQuestion-" + instance + "-" + nextFormId);
        if (nextForm) {
            $eXeMathOperations.goTo(nextFormId, $("form.mathoQuestion-" + instance).length, instance);
        }

        // Summary
        var total = $("#" + base + "total");
        total.html((parseFloat(total.html()) - 1));
        var answered = $("#" + base + "answered");
        answered.html((parseFloat(answered.html()) + 1));
        var rightAnswered = $("#" + base + "right-answered");

        if (right) {
            tr.attr("class", "MTHO-tr-right");
            rightTD.html('<span class="MTHO-right">1</span> ');
            rightAnswered.html((parseFloat(rightAnswered.html()) + 1));
        } else {
            tr.attr("class", "MTHO-tr-wrong");
            rightTD.html('<span class="MTHO-wrong">0</span> ');
            var wrongAnswered = $("#" + base + "wrong-answered");
            wrongAnswered.html((parseFloat(wrongAnswered.html()) + 1));
        }

        // Type = operator
        if (type == "operator") {
            rightResult = $eXeMathOperations.getOperatorString(operandA, operandB, operationResult, mOptions.errorType, mOptions.errorRelative, mOptions.errorAbsolute)
        }

        // Type = operandA
        if (type == "operandA") {
            if (right) rightResult = operandA;
            else {
                if (operation == "+") rightResult = operationResult - operandB;
                else if (operation == "-") rightResult = operationResult + operandB;
                else if (operation == "*" || operation == "x") rightResult = operationResult / operandB;
                else rightResult = operationResult * operandB;
            }
        }

        // Type = operandB
        if (type == "operandB") {
            if (right) rightResult = operandB;
            else {
                if (operation == "+") rightResult = operationResult - operandA;
                else if (operation == "-") rightResult = Math.abs(operationResult - operandA);
                else if (operation == "*" || operation == "x") rightResult = operationResult / operandA;
                else rightResult = operationResult * operandA;
            }
        }
        if (type !== 'operator') {
            rightResult = $eXeMathOperations.reduceDecimals(rightResult);
        }

        solutionTD.html(rightResult);
        // Qualification
        var qualification = this.removeUnnecessaryDecimals(100 * parseFloat(rightAnswered.html()) / trs.length);
        $("#" + base + "result").html(qualification);
        $eXeMathOperations.updateScore(right, instance);

        return false;
    },

    getOperatorString: function (oA, oB, oR, etype, er, ea) {
        var soperator = '';
        if (etype == 0) {
            if ((oA + oB).toFixed(2) == oR.toFixed(2)) soperator += "+ ";
            if ((oA - oB).toFixed(2) == oR.toFixed(2)) soperator += "- ";
            if ((oA * oB).toFixed(2) == oR.toFixed(2)) soperator += "x ";
            if ((oA / oB).toFixed(2) == oR.toFixed(2)) soperator += "/ ";
        } else {
            var ep = etype == 1 ? oR * er : ea;
            var errormin = oR - ep;
            var errormax = oR + ep;
            if ((oA + oB) >= errormin && (oA + oB) <= errormax) soperator += "+ ";
            if ((oA - oB) >= errormin && (oA - oB) <= errormax) soperator += "- ";
            if ((oA * oB) >= errormin && (oA * oB) <= errormax) soperator += "x ";
            if ((oA / oB) >= errormin && (oA / oB) <= errormax) soperator += "/ ";

        }
        return soperator;


    },
    checkAnswerNumbers2: function (e, numberOfDecimals, type) {
        var id = e.id.replace("mathoQuestion-", "").split("-");
        var instance = id[0];
        var mOptions = $eXeMathOperations.options[instance];
        var pOperationResult = 0;
        var pRightResult = 0; // Not answered
        if ($("INPUT[type=text]", e).val() == "") {
            var msg = $("#" + e.id + "-warning");
            msg.html(mOptions.msgs.msgIncomplete);
            setTimeout(function () {
                msg.html(mOptions.msgs.msgIncomplete);
            }, 2000);
            return false;
        }
        var table = $("#mathoResults-" + instance);
        var trs = $("tbody tr", table);
        var tr = trs.eq(id[1]);

        var operandA = $(".operandA", e);
        var operandA_input = $("INPUT", operandA);
        if (operandA_input.length == 1) operandA = operandA_input.val();
        else operandA = operandA.text();
        operandA = parseFloat(operandA);

        var operation = $(".operation", e);
        var operation_input = $("INPUT", operation);
        if (operation_input.length == 1) operation = operation_input.val();
        else {
            var operadores = "x*+-/:"
            operation = operation.text();
            operation = operation.toLowerCase();
            if (operation.length > 1 || operadores.indexOf(operation) == -1) {
                var msg = $("#" + e.id + "-warning");
                msg.html(mOptions.msgs.msgOperatNotValid);
                setTimeout(function () {
                    msg.html(mOptions.msgs.msgOperatNotValid);
                }, 2000);
                return false;
            }
        }

        var operandB = $(".operandB", e);
        var operandB_input = $("INPUT", operandB);
        if (operandB_input.length == 1) operandB = operandB_input.val();
        else operandB = operandB.text();
        operandB = parseFloat(operandB);

        var operationResult = $(".operationResult", e);
        var operationResult_input = $("INPUT", operationResult);
        if (operationResult_input.length == 1) operationResult = operationResult_input.val();
        else operationResult = operationResult.text();
        operationResult = parseFloat(operationResult);

        operationResult = operationResult.toFixed(2);
        operationResult = parseFloat(operationResult);
        pOperationResult = operationResult;

        // Check
        var right = false;
        var rightResult;
        if (operation == "+") rightResult = operandA + operandB;
        else if (operation == "-") rightResult = operandA - operandB;
        else if (operation == "x" || operation == "*") rightResult = operandA * operandB;
        else if (operation == "/" || operation == ":") rightResult = operandA / operandB;
        // rightResult = rightResult.toFixed(numberOfDecimals);
        pRightResult = rightResult;
        rightResult = rightResult.toFixed(2);
        if (rightResult == operationResult) right = true;
        if (mOptions.errorType > 0) {
            var ep = mOptions.errorType == 1 ? pRightResult * mOptions.errorRelative : mOptions.errorAbsolute;
            var errormin = pRightResult - ep;
            errormin = errormin.toFixed(2);
            errormin = parseFloat(errormin);
            var errormax = pRightResult + ep;
            errormax = errormax.toFixed(2);
            errormax = parseFloat(errormax);
            right = (pOperationResult >= errormin) && (pOperationResult <= errormax);

        }
        // Include the results in the table
        var tds = $("td", tr);
        var rightTD = tds.eq(1);
        var solutionTD = tds.eq(2);
        var base = "mathoResults-" + instance + "-";

        // Hide the submit button and disable the form
        $("#" + e.id + "-submit").hide();
        e.onsubmit = function () {
            return false;
        }
        $("#" + e.id + "-answer").attr("disabled", "disabled");

        // Go to the next page
        var nextFormId = (parseFloat(e.id.replace("mathoQuestion-" + instance + "-", ""))) + 1;
        var nextForm = document.getElementById("mathoQuestion-" + instance + "-" + nextFormId);
        if (nextForm) {
            $eXeMathOperations.goTo(nextFormId, $("form.mathoQuestion-" + instance).length, instance);
        }
        // Summary
        var total = $("#" + base + "total");
        total.html((parseFloat(total.html()) - 1));
        var answered = $("#" + base + "answered");
        answered.html((parseFloat(answered.html()) + 1));
        var rightAnswered = $("#" + base + "right-answered");

        if (right) {
            tr.attr("class", "MTHO-tr-right");
            rightTD.html('<span class="MTHO-right">1</span> ');
            rightAnswered.html((parseFloat(rightAnswered.html()) + 1));
        } else {
            tr.attr("class", "MTHO-tr-wrong");
            rightTD.html('<span class="MTHO-wrong">0</span> ');
            var wrongAnswered = $("#" + base + "wrong-answered");
            wrongAnswered.html((parseFloat(wrongAnswered.html()) + 1));
        }
        // Type = operator
        if (type == "operator") {
            // if (right) rightResult = operation;
            // else {
            rightResult = "";
            if (operandA + operandB == operationResult) rightResult += "+ ";
            if (operandA - operandB == operationResult) rightResult += "- ";
            if (operandA * operandB == operationResult) rightResult += "x ";
            if (operandA / operandB == operationResult) rightResult += "/ ";
            // }
        }
        // Type = operandA
        if (type == "operandA") {
            if (right) rightResult = operandA;
            else {
                if (operation == "+") rightResult = operationResult - operandB;
                else if (operation == "-") rightResult = operationResult + operandB;
                else if (operation == "*" || operation == "x") rightResult = operationResult / operandB;
                else rightResult = operationResult * operandB;
            }
        }
        // Type = operandB
        if (type == "operandB") {
            if (right) rightResult = operandB;
            else {
                if (operation == "+") rightResult = operationResult - operandA;
                else if (operation == "-") rightResult = Math.abs(operationResult - operandA);
                else if (operation == "*" || operation == "x") rightResult = operationResult / operandA;
                else rightResult = operationResult * operandA;
            }
        }

        rightResult = this.removeUnnecessaryDecimals(rightResult, false);
        solutionTD.html(rightResult);
        // Qualification
        var qualification = this.removeUnnecessaryDecimals(100 * parseFloat(rightAnswered.html()) / trs.length);
        $("#" + base + "result").html(qualification);
        $eXeMathOperations.updateScore(right, instance);
        return false;
    },
    checkClue: function (instance) {
        var mOptions = $eXeMathOperations.options[instance],
            percentageHits = (mOptions.hits / mOptions.number) * 100,
            message = '';
        if (mOptions.number - mOptions.hits - mOptions.errors <= 0) {
            message += mOptions.msgs.msgAllOperations;
        } else if (mOptions.gameOver && mOptions.time > 0) {
            message += mOptions.msgs.msgAllOperations;
        }
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                message += ' ' + mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame
                mOptions.obtainedClue = true;
            }
        }
        $('#mthoPShowClue-' + instance).text(message);
        $('#mthoPShowClue-' + instance).show()
    },
    addButtonScore: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        var butonScore = "";
        var fB = '<div class="MTHO-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="MTHO-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="mthoSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="MTHO-RepeatActivity" id="mthoRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="MTHO-GetScore">';
                fB += '<p><span class="MTHO-RepeatActivity" id="mthoRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
    updateEvaluationIcon: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data = $eXeMathOperations.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                $eXeMathOperations.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
            $eXeMathOperations.showEvaluationIcon(instance, state, score)
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#mthoMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');

        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions = $eXeMathOperations.options[instance];
        var $header = $('#mthoGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
        }
        $('#mthoEvaluationIcon-' + instance).remove();
        var sicon = '<div id="mthoEvaluationIcon-' + instance + '" class="MTHO-EvaluationDivIcon"><img  src="' + $eXeMathOperations.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#mthoEvaluationIcon-' + instance).find('span').eq(0).text(alt)
    },
    updateEvaluation: function (obj1, obj2, id1) {
        if (!obj1) {
            obj1 = {
                id: id1,
                activities: []
            };
        }
        const findObject = obj1.activities.find(
            obj => obj.id === obj2.id && obj.node === obj2.node
        );

        if (findObject) {
            findObject.state = obj2.state;
            findObject.score = obj2.score;
            findObject.name = obj2.name;
            findObject.date = obj2.date;
        } else {
            obj1.activities.push({
                'id': obj2.id,
                'type': obj2.type,
                'node': obj2.node,
                'name': obj2.name,
                'score': obj2.score,
                'date': obj2.date,
                'state': obj2.state,
            });
        }
        return obj1;
    },
    getDateString: function () {
        var currentDate = new Date();
        var formattedDate = currentDate.getDate().toString().padStart(2, '0') + '/' +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
            currentDate.getFullYear().toString().padStart(4, '0') + ' ' +
            currentDate.getHours().toString().padStart(2, '0') + ':' +
            currentDate.getMinutes().toString().padStart(2, '0') + ':' +
            currentDate.getSeconds().toString().padStart(2, '0');
        return formattedDate;

    },

    saveEvaluation: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#mthoGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text(),
                score = ((10 * mOptions.hits) / mOptions.number).toFixed(2)
            var formattedDate = $eXeMathOperations.getDateString();
            var scorm = {
                'id': mOptions.id,
                'type': mOptions.msgs.msgTypeGame,
                'node': node,
                'name': name,
                'score': score,
                'date': formattedDate,
                'state': (parseFloat(score) >= 5 ? 2 : 1)
            }
            var data = $eXeMathOperations.getDataStorage(mOptions.evaluationID);
            data = $eXeMathOperations.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeMathOperations.showEvaluationIcon(instance, scorm.state, scorm.score)
        }
    },
    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data = $eXeMathOperations.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeMathOperations.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.number).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeMathOperations.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.repeatActivity && $eXeMathOperations.previousScore !== '') {
                        message = $eXeMathOperations.userName !== '' ? $eXeMathOperations.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeMathOperations.previousScore = score;
                        $eXeMathOperations.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeMathOperations.userName !== '' ? $eXeMathOperations.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.repeatActivity) {
                            $('#mthoSendScore-' + instance).hide();
                        }
                        $('#mthoRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#mthoRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeMathOperations.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeMathOperations.mScorm.set("cmi.core.score.raw", score);
                    $('#mthoRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#mthoRepeatActivity-' + instance).show();
                    message = "";
                }
            } else {
                message = mOptions.msgs.msgScoreScorm;
            }

        } else {
            var hasClass = $("body").hasClass("exe-scorm");
            message = (hasClass) ? mOptions.msgs.msgEndGameScore : mOptions.msgs.msgScoreScorm;
        }
        if (!auto) alert(message);
    },
    exitFullscreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    },
    getFullscreen: function (element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    toggleFullscreen: function (element, instance) {
        var element = element || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            $eXeMathOperations.getFullscreen(element);
        } else {
            $eXeMathOperations.exitFullscreen(element);
        }
    },
    exitFullscreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    addEvents: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        $('#mthoLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#mthoGameContainer-" + instance).show()
            $("#mthoGameMinimize-" + instance).hide();
        });
        $("#mthoLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#mthoGameContainer-" + instance).hide();
            $("#mthoGameMinimize-" + instance).css('visibility', 'visible').show();
        });

        $("#mthoLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('mthoGameContainer-' + instance);
            $eXeMathOperations.toggleFullscreen(element, instance)
        });

        $('#mthoFeedBackClose-' + instance).on('click', function (e) {
            $eXeMathOperations.showCubiertaOptions(false, instance)

        });
        $('#mthoStartGame-' + instance).show();
        $('#mthoPShowClue-' + instance).hide();
        if (mOptions.itinerary.showCodeAccess) {
            $('#mthoMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $eXeMathOperations.showCubiertaOptions(0, instance);
        }
        $('#mthoCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeMathOperations.enterCodeAccess(instance);
        });
        $('#mthoCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeMathOperations.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#mthoPNumber-' + instance).text(mOptions.number);
        $(window).on('unload', function () {
            if (typeof ($eXeMathOperations.mScorm) != "undefined") {
                $eXeMathOperations.endScorm();
            }
        });
        if (mOptions.isScorm > 0) {
            $eXeMathOperations.updateScorm($eXeMathOperations.previousScore, mOptions.repeatActivity, instance);
        }
        $('#mthoInstructions-' + instance).text(mOptions.instructions);
        $('#mthoSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeMathOperations.sendScore(instance, false);
            $eXeMathOperations.saveEvaluation(instance);

        });

        $('#mthoStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            if (mOptions.gameOver) {
                $eXeMathOperations.reloadGame(instance);
                if (mOptions.time > 0) {
                    mOptions.gameStarted = false;
                    $eXeMathOperations.startGame(instance)
                }
                $eXeMathOperations.updateLatex('mthoMultimedia-' + instance);
            } else {
                $eXeMathOperations.startGame(instance)
            }

        });

        if (mOptions.time > 0) {
            mOptions.gameStarted = false;
            $('#mthoGameContainer-' + instance).find('.exeQuextIcons-Time').show();
            $('#mthoPTime-' + instance).show();
            $('#mthoStartGame-' + instance).show();
            $('#mthoMultimedia-' + instance).hide();
            $('#mthoDivImgHome-' + instance).show();
            $('#mthoStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        } else {
            $('#mthoMultimedia-' + instance).show();
            $('#mthoDivImgHome-' + instance).hide();
            $('#mthoStartGame-' + instance).hide();
            $('#mthoGameContainer-' + instance).find('.exeQuextIcons-Time').hide();
            $('#mthoPTime-' + instance).hide();
            mOptions.gameStarted = true
        }
        $eXeMathOperations.updateEvaluationIcon(instance);
    },

    startGame: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        if (mOptions.gameStarted) {
            return
        }
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.counter = 0;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.obtainedClue = false;
        mOptions.activeCounter = true;
        mOptions.counter = mOptions.time * 60;
        $eXeMathOperations.updateGameBoard(instance)
        if (mOptions.time > 0) {
            $('#mthoMultimedia-' + instance).show();
            $('#mthoDivImgHome-' + instance).hide();
            $('#mthoStartGame-' + instance).hide();
            mOptions.counterClock = setInterval(function () {
                if (mOptions.gameStarted && mOptions.activeCounter) {
                    mOptions.counter--;
                    $eXeMathOperations.uptateTime(mOptions.counter, instance);
                    if (mOptions.counter <= 0) {
                        mOptions.activeCounter = false;
                        $eXeMathOperations.gameOver(0, instance)
                        return;
                    }
                }

            }, 1000);
            $eXeMathOperations.uptateTime(mOptions.time * 60, instance);
        }
        mOptions.gameStarted = true;
    },
    enterCodeAccess: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() == $('#mthoCodeAccessE-' + instance).val().toLowerCase()) {
            $eXeMathOperations.showCubiertaOptions(false, instance);
            if (mOptions.time > 0) {
                mOptions.gameStarted = false;
                $eXeMathOperations.startGame(instance)
            }

        } else {
            $('#mthoMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#mthoCodeAccessE-' + instance).val('');
        }
    },
    uptateTime: function (tiempo, instance) {
        var mTime = $eXeMathOperations.getTimeToString(tiempo);
        $('#mthoPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },
    gameOver: function (type, instance) {
        var mOptions = $eXeMathOperations.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameOver = true;
        mOptions.activeCounter = false;
        if (mOptions.time > 0) {
            clearInterval(mOptions.counterClock);
            $eXeMathOperations.uptateTime(0, instance);
        }
        $('#mthoGameContainer-' + instance).find('.MTHO-Form').find('input').attr('disabled', 'disabled');
        $('#mthoGameContainer-' + instance).find('.MTHO-Form').find('input[type="submit"]').hide();
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeMathOperations.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.number).toFixed(2);
                $eXeMathOperations.sendScore(instance, true);
                $('#mthoRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeMathOperations.initialScore = score;
            }
        }
        $eXeMathOperations.saveEvaluation(instance);
        $eXeMathOperations.checkClue(instance);
        $eXeMathOperations.showFeedBack(instance);
        $('#mthoStartGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#mthoStartGame-' + instance).show();
    },
    showFeedBack: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.number;
        if (mOptions.feedBack) {

            if (puntos >= mOptions.percentajeFB) {
                $('#mthoDivFeedBack-' + instance).find('.mathoperations-feedback-game').show();
                $eXeMathOperations.showCubiertaOptions(1, instance)
            } else {
                $eXeMathOperations.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance);
            }
        }
    },
    loadMathJax: function () {
        if (!window.MathJax) {
            window.MathJax = $exe.math.engineConfig;
        }
        var script = document.createElement('script');
        script.src = $exe.math.engine;
        script.async = true;
        document.head.appendChild(script);
    },
    updateLatex: function (mnodo) {
        setTimeout(function () {
            if (typeof (MathJax) != "undefined") {
                try {
                    if (MathJax.Hub && typeof MathJax.Hub.Queue == "function") {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, '#' + mnodo]);
                    } else if (typeof MathJax.typeset == "function") {
                        var nodo = document.getElementById(mnodo);
                        MathJax.typesetClear([nodo]);
                        MathJax.typeset([nodo]);
                    }
                } catch (error) {
                    console.log('Error al refrescar cuestiones')
                }
            }
        }, 100);
    },
    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeMathOperations.options[instance],
            pendientes = 0;
        if (correctAnswer) {
            mOptions.hits++
            type = 2;
        } else {
            mOptions.errors++;
        }
        pendientes = mOptions.number - mOptions.errors - mOptions.hits;
        mOptions.score = (mOptions.hits / mOptions.number) * 10;
        if (mOptions.isScorm === 1) {
            if (mOptions.repeatActivity || $eXeMathOperations.initialScore === '') {
                var score = mOptions.score.toFixed(2);;
                $eXeMathOperations.sendScore(instance, true);
                $('#mthoRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        $eXeMathOperations.saveEvaluation(instance);
        $eXeMathOperations.checkClue(instance);
        $eXeMathOperations.updateGameBoard(instance);
        if (pendientes == 0) {
            $eXeMathOperations.gameOver(1, instance)
        }
    },
    updateGameBoard(instance) {
        var mOptions = $eXeMathOperations.options[instance],
            pendientes = mOptions.number - mOptions.errors - mOptions.hits,
            sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#mthoPHits-' + instance).text(mOptions.hits);
        $('#mthoPErrors-' + instance).text(mOptions.errors);
        $('#mthoPNumber-' + instance).text(pendientes);
        $('#mthoPScore-' + instance).text(sscore);
    },

    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeMathOperations.borderColors.red, $eXeMathOperations.borderColors.green, $eXeMathOperations.borderColors.blue, $eXeMathOperations.borderColors.yellow],
            color = colors[type];
        $('#mthoPAuthor-' + instance).text(message);
        $('#mthoPAuthor-' + instance).css({
            'color': color
        });
    },

    supportedBrowser: function (idevice) {
        var ua = window.navigator.userAgent,
            msie = ua.indexOf('MSIE '),
            sp = true;
        if (msie > 0) {
            var ie = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            if (ie < 10) {
                var bns = $('.' + idevice + '-bns').eq(0).text() || 'Your browser is not compatible with this tool.';
                $('.' + idevice + '-instructions').text(bns);
                sp = false;
            }
        }
        return sp;
    },
    extractURLGD: function (urlmedia) {
        var sUrl = urlmedia;
        if (typeof urlmedia != "undefined" && urlmedia.length > 0 && urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
            sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
        }
        return sUrl;
    },
    operateFractions: function (f1, f2, operation, type) {
        var fraction1 = $eXeMathOperations.parsearFraccion(f1);
        var fraction2 = $eXeMathOperations.parsearFraccion(f2);
        var resultado;
        operation = typeof operation == 'undefined' ? 'x' : operation;
        operation = operation.toLowerCase().trim();
        switch (operation) {
            case '+':
                resultado = $eXeMathOperations.addFractions(fraction1, fraction2, type);
                break;
            case '-':
                resultado = $eXeMathOperations.subtractFractions(fraction1, fraction2, type);
                break;
            case '*':
                resultado = $eXeMathOperations.multiplyFractions(fraction1, fraction2, type);
                break;
            case '/':
                resultado = $eXeMathOperations.divideFractions(fraction1, fraction2, type);
                break;
            case ':':
                resultado = $eXeMathOperations.divideFractions(fraction1, fraction2, type);
                break;
            case 'x':
                resultado = $eXeMathOperations.multiplyFractions(fraction1, fraction2, type);
                break;
            default:
                throw new Error('Operación no soportada');
        }
        var result = $eXeMathOperations.simplifyFraction(resultado.numerator, resultado.denominator, type)
        return $eXeMathOperations.formatFraction(result.numerator, result.denominator);
    },
    parsearFraccion: function (fraction) {
        var [numerator, denominator] = fraction.split('/').map(Number);
        denominator = typeof denominator == 'undefined' ? 1 : denominator;
        return {
            numerator,
            denominator
        };
    },
    addFractions: function (f1, f2, type) {
        const commonDenominator = f1.denominator * f2.denominator;
        const numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
        return $eXeMathOperations.simplifyFraction(numerator, commonDenominator, type);
    },
    subtractFractions: function (f1, f2, type) {
        const commonDenominator = f1.denominator * f2.denominator;
        const numerator = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
        return $eXeMathOperations.simplifyFraction(numerator, commonDenominator, type);
    },
    multiplyFractions: function (f1, f2, type) {
        const numerator = f1.numerator * f2.numerator;
        const denominator = f1.denominator * f2.denominator;
        return $eXeMathOperations.simplifyFraction(numerator, denominator, type);
    },
    divideFractions: function (f1, f2, type) {
        const numerator = f1.numerator * f2.denominator;
        const denominator = f1.denominator * f2.numerator;
        return $eXeMathOperations.simplifyFraction(numerator, denominator, type);
    },
    simplifyFraction: function (numerator, denominator, type) {
        const mcd = $eXeMathOperations.getLMC(numerator, denominator);
        if (type && denominator < 0) {
            numerator *= -1;
            denominator *= -1;
        }
        return {
            numerator: numerator / mcd,
            denominator: denominator / mcd
        };
    },
    getLMC: function (a, b) {
        // Utilizar el algoritmo de Euclides para calcular el MCD
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    },

    isFraction: function (schain) {
        if (typeof schain !== 'string' || schain.length === 0) {
            return false;
        }
        const parts = schain.split('/');
        if (parts.length == 1) {
            parts.push('1')
        } else if (parts.length !== 2) {
            return false;
        }
        const numerator = parts[0].trim();
        const denominator = parts[1].trim();
        const numeratorIsInteger = /^-?\s?\d+$/.test(numerator);
        const denominatorIsInteger = /^-?\s?\d+$/.test(denominator);
        if (!numeratorIsInteger || !denominatorIsInteger) {
            return false;
        }
        if (denominator === '0') {
            return false;
        }
        return true;
    },
    compareFractions: function (fraction1, fraction2, strict) {
        if (!$eXeMathOperations.isFraction(fraction1) || !$eXeMathOperations.isFraction(fraction1)) {
            return;
        }
        if (strict) {
            return (fraction1.replace(/\s/g, '').toLowerCase() == fraction2.replace(/\s/g, '').toLowerCase())
        }
        var [num1, den1] = fraction1.replace(/\s/g, '').split('/').map(Number);
        var [num2, den2] = fraction2.replace(/\s/g, '').split('/').map(Number);

        if (den1 == 0 || den2 == 0) {
            throw new Error('Los denominadores deben ser distintos de 0');
        }
        den1 = typeof den1 == "undefined" ? 1 : den1;
        den2 = typeof den2 == "undefined" ? 1 : den2;
        const absNum1 = Math.abs(num1);
        const absDen1 = Math.abs(den1);
        const absNum2 = Math.abs(num2);
        const absDen2 = Math.abs(den2);
        return (parseInt(num1) / parseInt(den1) === parseInt(num2) / parseInt(den2));
        // if (strict) {
        //     return (absNum1 === absNum2 && absDen1 === absDen2 && num1 / den1 === num2 / den2);
        // } else {

        // }
    },
    formatFraction: function (numerator, denominator) {
        if (denominator == 1) {
            return `${numerator}`;
        }
        return `${numerator}/${denominator}`;
    },
    loadQuestionFractions: function (dataGame) {
        var mOptions = dataGame;
        mOptions.components = [];
        mOptions.fractions = [];
        var min = $eXeMathOperations.defaultSettings.min;
        if (!isNaN(mOptions.min)) min = parseInt(mOptions.min);
        mOptions.min = Math.round(min);
        var max = $eXeMathOperations.defaultSettings.max;
        if (!isNaN(mOptions.max)) max = parseInt(mOptions.max);
        mOptions.max = Math.round(max);
        for (var i = 0; i < mOptions.number; i++) {
            function getOperation(min, max) {
                var operators = "+-*:";
                var operationsToDo = "";
                for (var z = 0; z < mOptions.operations.length; z++) {
                    if (mOptions.operations[z] != 0) operationsToDo += operators[z];
                }
                var operation = operationsToDo[$eXeMathOperations.getRandomNo(0, operationsToDo.length, 0)];
                var operandA = $eXeMathOperations.generateFraction(mOptions.min, mOptions.max, mOptions.negativeFractions, mOptions.solution);
                var operandB = $eXeMathOperations.generateFraction(mOptions.min, mOptions.max, mOptions.negativeFractions, mOptions.solution);
                if (operation == '-' && !mOptions.negativeFractions) {
                    if ($eXeMathOperations.is_minor(operandA, operandB)) {
                        var aux = operandA;
                        operandA = operandB;
                        operandB = aux;
                    }
                }
                var result = $eXeMathOperations.operateFractions(operandA, operandB, operation, true);
                var oA = $eXeMathOperations.createLatex(operandA);
                var oB = $eXeMathOperations.createLatex(operandB);
                var lresult = $eXeMathOperations.createLatex(result);
                return [
                    [oA, operation, oB, lresult],
                    [operandA, operation, operandB, result]
                ];
            }
            var datos = getOperation(mOptions.min, mOptions.max);
            if (mOptions.type == "random") {
                var options = ["operator", "result", "operandA", "operandB"];
                mOptions.type = options[this.getRandomNo(0, 4, 0)];
            }
            mOptions.components.push(datos[0]);
            mOptions.fractions.push(datos[1])
        }
        return mOptions;
    },
    is_minor: function (fraction1, fraction2) {
        var [num1, den1] = fraction1.split('/').map(Number);
        var [num2, den2] = fraction2.split('/').map(Number);
        den1 = typeof den1 == "undefined" ? 1 : den1;
        den2 = typeof den2 == "undefined" ? 1 : den2;
        const frac1 = num1 / den1;
        const frac2 = num2 / den2;
        return frac2 > frac1;
    },
    generateFraction: function (maximo, minimo, signo, type) {
        if (typeof maximo !== 'number' || typeof minimo !== 'number') {
            throw new Error('Los valores máximo y mínimo deben ser números');
        }
        var numerator = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
        var denominator = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
        if (denominator === 0) {
            denominator = 1;
        }
        if (signo) {
            var aleatorio1 = Math.random();
            if (aleatorio1 < 0.5) {
                numerator *= -1;
            }
            aleatorio1 = Math.random();
            if (aleatorio1 < 0.3) {
                denominator *= -1;
            }

        }
        var fc = $eXeMathOperations.simplifyFraction(numerator, denominator, type);
        if (fc.denominator == 1) {
            return `${fc.numerator}`;
        }
        return `${fc.numerator}/${fc.denominator}`;
    },

}
$(function () {
    $eXeMathOperations.init();
});