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
        decimals: 0, // Allow decimals
        decimalsInResults: 1, // Allow decimals in results
        negative: 1, // Allow negative results
        zero: 1 // Allow zero in results
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
                mOption = $eXeMathOperations.loadDataGame(dl),
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
        if ($eXeMathOperations.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeMathOperations.loadMathJax();
        }
    },


    loadDataGame: function (data) {
        var json = data.text(),
            options = $eXeMathOperations.isJsonString(json),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
        if (hasLatex) {
            $eXeMathOperations.hasLATEX = true;
        }
        options.hits = 0;
        options.errors = 0;
        options.score = 0;
        options.counter = 0;
        options.gameOver = false;
        options.gameStarted = false;
        options.obtainedClue = false;
        options.gameOver = false;
        options = $eXeMathOperations.loadQuestions(options)
        return options;
    },
    createQuestions: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        var html = ''
        for (var i = 0; i < mOptions.number; i++) {
            c
            html += $eXeMathOperations.getQuestion(instance, mOptions.type, i, mOptions.components[i][0], mOptions.components[i][1], mOptions.components[i][2], mOptions.components[i][3], mOptions.decimalsInOperands);
        }
        html += '<p class="MTHO-pagination">';
        html += '<a id="MTHO-' + instance + '-prevLink" style="visibility:hidden" href="#" onclick="$mathoQuestions.goTo(-1,' + mOptions.number + ',' + instance + ');return false">'+mOptions.msgs.msgPrevious+'</a> ';
        html += '<span id="mathoPage-' + instance + '">1</span>/' + mOptions.number;
        html += ' <a id="MTHO-' + instance + '-nextLink" href="#"';
        if (mOptions.number == 1) html += ' style="visibility:hidden"';
        html += ' onclick="$eXeMathOperations.goTo(1,' + mOptions.number + ',' + instance + ');return false">'+mOptions.msgs.msgNext+'</a> ';
        html += '</p>';

        html += '<table id="mathoResults-' + instance + '">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>'+mOptions.msgs.msgQuestion+' </th>';
        html += '<th>'+mOptions.msgs.msgCorrect+' </th>';
        html += '<th>'+mOptions.msgs.msgSolution+' </th>';
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
        html += '<li><strong>'+mOptions.msgs.msgWithoutAnswer+': </strong><span id="mathoResults-' + instance + '-total">' + mOptions.number + '</span></li>';
        html += '<li><strong>'+mOptions.msgs.msgReplied+': </strong><span id="mathoResults-' + instance + '-answered">0</span></li>';
        html += '<li><strong>'+mOptions.msgs.msgCorrects+': </strong><span id="mathoResults-' + instance + '-right-answered">0</span></li>';
        html += '<li><strong>'+mOptions.msgs.msgIncorrects+': </strong><span id="mathoResults-' + instance + '-wrong-answered">0</span></li>';
        html += '<li><strong>'+mOptions.msgs.msgScore+': </strong><span id="mathoResults-' + instance + '-result">0</span>%</li>';
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
        html += '<div class="MTHO-MainContainer">\
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
           <div class="MTHO-Multimedia" id="mthoMultimedia-' + instance + '">\
           </div>\
           <div class="MTHO-Flex" id="mthoDivImgHome-' + instance + '">\
                <img src="' + path + "mthoHome.svg" + '" class="MTHO-ImagesHome" id="mthoPHome-' + instance + '"  alt="' + msgs.msgNoImage + '" />\
           </div>\
            <div class="MTHO-StartGame"><a href="#" id="mthoStartGame-' + instance + '"></a></div>\
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
    loadQuestions: function (dataGame) {
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
                var operandA = $eXeMathOperations.getRandomNo(mOptions.min, mOptions.max, mOptions.decimals);
                var operandB = $eXeMathOperations.getRandomNo(mOptions.min, mOptions.max, mOptions.decimals);
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
    checkInputContent: function (e, type) {
        var str = e.value;
        var lastCharacter = str.slice(-1);
        if (type == "operator") {
            if (lastCharacter != "+" && lastCharacter != "-" && lastCharacter != "*" && lastCharacter != "x" && lastCharacter != "/") {
                e.value = str.substring(0, str.length - 1);
            } else if (lastCharacter == "*") {
                e.value = str.substring(0, str.length - 1) + "x";
            }
        } else {
            if (lastCharacter == "," || lastCharacter == ".") {
                e.value = str.substring(0, str.length - 1);
                if (e.value.indexOf(".") == -1) {
                    if (e.value == "") e.value = 0;
                    e.value = e.value + ".";
                }
            }else if (str.slice(0) == "-") {
            }else {
                if (isNaN(parseFloat(lastCharacter))) {
                    e.value = str.substring(0, str.length - 1);
                }
            }
        }
    },
    getQuestion: function (instance, type, i, operandA, operation, operandB, result, numberOfDecimals) {
        var mOptions = $eXeMathOperations.options[instance];
        if (operation == "*") operation = "x";
        if (type == "result") result = '<input type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:5em" onkeyup="$eXeMathOperations.checkInputContent(this,\'number\')" />';
        else if (type == "operator") operation = '<input class="operator" type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:1em" onkeyup="$eXeMathOperations.checkInputContent(this,\'operator\')" />';
        else if (type == "operandA") operandA = '<input type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:5em" onkeyup="$eXeMathOperations.checkInputContent(this,\'number\')" />';
        else if (type == "operandB") operandB = '<input type="text" autocomplete="off" id="mathoQuestion-' + instance + '-' + i + '-answer" style="width:5em" onkeyup="$eXeMathOperations.checkInputContent(this,\'number\')" />';
        var css = ' style="display:none"';
        if (i == 0) css = '';
        var html = '<form class="MTHO-Form mathoQuestion-' + instance + '" id="mathoQuestion-' + instance + '-' + i + '" onsubmit="return $eXeMathOperations.checkAnswer(this,\'' + type + '\',\'' + numberOfDecimals + '\')"' + css + '>';
        html += '<p>';
        html += '<label for="mathoQuestion-' + instance + '-' + i + '-answer">';
        html += '<span class="operandA">' + operandA + '</span>';
        html += '<span class="operation">' + operation + '</span>';;
        html += '<span class="operandB">' + operandB + '</span>';
        html += "=";
        html += '<span class="operationResult">' + result + '</span>';
        html += '</label>';
        html += ' <input type="submit" value="'+mOptions.msgs.msgCheck+'" id="mathoQuestion-' + instance + '-' + i + '-submit" /> <span id="mathoQuestion-' + instance + '-' + i + '-warning"></span>';
        html += '</p>';
        html += '</form>';
        return html;
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
    checkAnswer: function (e, type, numberOfDecimals) {
        var id = e.id.replace("mathoQuestion-", "").split("-");
        var instance = id[0];
        var mOptions = $eXeMathOperations.options[instance];
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
        if (operation_input.length == 1) operation = operation_input.val();
        else operation = operation.text();

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

        // Check
        var right = false;
        var rightResult;
        if (operation == "+") rightResult = operandA + operandB;
        else if (operation == "-") rightResult = operandA - operandB;
        else if (operation == "x" || operation == "*") rightResult = operandA * operandB;
        else if (operation == "/") rightResult = operandA / operandB;
        // rightResult = rightResult.toFixed(numberOfDecimals);
        rightResult = rightResult.toFixed(2);
        if (rightResult == operationResult) right = true;

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
           message='';
        if(mOptions.number-mOptions.hits-mOptions.errors<=0){
            message +=mOptions.msgs.msgAllOperations;
        }else if(mOptions.gameOver && mOptions.time>0){
            message +=mOptions.msgs.msgAllOperations;
        }
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                message+=' '+mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame
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
            $eXeMathOperations.showCubiertaOptions(0, instance)

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

        });
        $('#mthoStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMathOperations.startGame(instance)
        });
        if (mOptions.time > 0) {
            mOptions.gameStarted = false;
            $('#mthoGameContainer-' + instance).find('.exeQuextIcons-Time').show();
            $('#mthoPTime-' + instance).show();
            $('#mthoStartGame-' + instance).show();
            $('#mthoMultimedia-' + instance).hide();
            $('#mthoDivImgHome-' + instance).show();
            $('#mthoStartGame-' + instance).text(mOptions.msgs.msgPlayStart);

        }else{
            $('#mthoMultimedia-' + instance).show();
            $('#mthoDivImgHome-' + instance).hide();
            $('#mthoStartGame-' + instance).hide();
            $('#mthoGameContainer-' + instance).find('.exeQuextIcons-Time').hide();
            $('#mthoPTime-' + instance).hide();
            mOptions.gameStarted = true
        }
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
        mOptions.counter = mOptions.time * 10;
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
            $eXeMathOperations.uptateTime(mOptions.time * 10, instance);
        }

        mOptions.gameStarted = true;


    },

    enterCodeAccess: function (instance) {
        var mOptions = $eXeMathOperations.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase()== $('#mthoCodeAccessE-' + instance).val().toLowerCase()) {
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
        if(mOptions.time>0){
            clearInterval(mOptions.counterClock);
            $eXeMathOperations.uptateTime(0, instance);
        }
        $('#mthoGameContainer-'+instance).find('.MTHO-Form').find('input').attr('disabled','disabled');
        $('#mthoGameContainer-'+instance).find('.MTHO-Form').find('input[type="submit"]').hide();
        if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeMathOperations.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.mOptions.number).toFixed(2);
                $eXeMathOperations.sendScore(instance, true);
                $('#mthoRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeMathOperations.initialScore = score;
            }
        }
        $eXeMathOperations.checkClue(instance);
        $eXeMathOperations.showFeedBack(instance);
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
    }
}
$(function () {
    $eXeMathOperations.init();
});