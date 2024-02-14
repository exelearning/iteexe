/**
 * Math Problems (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros
 * Author: Manuel Narváez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeMathProblems = {
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
        min: 1, // Smallest number included
        max: 100, // Highest number included
        decimals: 0 // Number of decimals
    },
    options: [],
    hasSCORMbutton: false,
    isInExe: false,
    userName: '',
    previousScore: '',
    initialScore: '',
    hasLATEX: false,
    init: function () {
        this.activities = $('.mathproblems-IDevice');
        if (this.activities.length == 0) return;
        if (!$eXeMathProblems.supportedBrowser('mthp')) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Word Guessing') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/mathproblems-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },
    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeMathProblems.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeMathProblems.enable()');
        else this.enable();
        $eXeMathProblems.mScorm = scorm;
        var callSucceeded = $eXeMathProblems.mScorm.init();
        if (callSucceeded) {
            $eXeMathProblems.userName = $eXeMathProblems.getUserName();
            $eXeMathProblems.previousScore = $eXeMathProblems.getPreviousScore();
            $eXeMathProblems.mScorm.set("cmi.core.score.max", 10);
            $eXeMathProblems.mScorm.set("cmi.core.score.min", 0);
            $eXeMathProblems.initialScore = $eXeMathProblems.previousScore;
        }
    },
    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeMathProblems.options[instance],
            text = '';
        $('#mthpSendScore-' + instance).hide();
        if (mOptions.scorm.isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgOnlySaveAuto;
            } else if (!repeatActivity && prevScore !== "") {
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            }
        } else if (mOptions.scorm.isScorm === 2) {
            $('#mthpSendScore-' + instance).show();
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgPlaySeveralTimes + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === '') {
                text = mOptions.msgs.msgOnlySaveScore;
            } else if (!repeatActivity && prevScore !== '') {
                $('#mthpSendScore-' + instance).hide();
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouScore + ': ' + prevScore;
            }
        }
        $('#mthpRepeatActivity-' + instance).text(text);
        $('#mthpRepeatActivity-' + instance).fadeIn(1000);
    },
    getUserName: function () {
        var user = $eXeMathProblems.mScorm.get("cmi.core.student_name");
        return user
    },
    getPreviousScore: function () {
        var score = $eXeMathProblems.mScorm.get("cmi.core.score.raw");
        return score;
    },
    endScorm: function () {
        $eXeMathProblems.mScorm.quit();
    },
    enable: function () {
        $eXeMathProblems.loadGame();
    },
    loadGame: function () {
        $eXeMathProblems.options = [];
        $eXeMathProblems.activities.each(function (i) {
            var dl = $(".mathproblems-DataGame", this),
                $wordings = $('.mathproblems-LinkWordings', this),
                $feedbacks = $('.mathproblems-LinkFeedBacks', this),
                mOption = $eXeMathProblems.loadDataGame(dl, $wordings, $feedbacks),
                msg = mOption.msgs.msgPlayStart;
            $eXeMathProblems.options.push(mOption);
            var mathp = $eXeMathProblems.createInterfaceMathP(i);
            dl.before(mathp).remove();
            $('#mthpGameMinimize-' + i).hide();
            $('#mthpGameContainer-' + i).hide();
            if (mOption.showMinimize) {
                $('#mthpGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#mthpGameContainer-' + i).show();
            }
            $('#mthpMessageMaximize-' + i).text(msg);
            $('#mthpDivFeedBack-' + i).prepend($('.mathproblems-feedback-game', this));
            $eXeMathProblems.addEvents(i);
            $('#mthpDivFeedBack-' + i).hide();
            //$eXeMathProblems.createQuestions(i);
        });
        if ($eXeMathProblems.hasLATEX && typeof (MathJax) == "undefined") {
            $eXeMathProblems.loadMathJax();
        }
    },


    loadDataGame: function (data, $wordings, $feedbacks) {
        var json = data.text(),
            djson = $eXeMathProblems.Decrypt(json);
        options = $eXeMathProblems.isJsonString(djson),
            hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(djson);
        if (hasLatex) {
            $eXeMathProblems.hasLATEX = true;
        }
        options.hits = 0;
        options.errors = 0;
        options.score = 0;
        options.counter = 0;
        options.gameOver = false;
        options.gameStarted = false;
        options.obtainedClue = false;
        options.gameOver = false;
        if (options.version == 1) {
            for (var i = 0; i < options.questions.length; i++) {
                options.questions[i].time = options.questions[i].time * 60;
            }
        }
        options.sortAnswers = typeof options.sortAnswers == "undefined" ? false : true;
        options.errorType = typeof options.errorType == "undefined" ? 0 : options.errorType;
        options.errorRelative = typeof options.errorRelative == "undefined" ? 0 : options.errorRelative;
        options.errorAbsolute = typeof options.errorAbsolute == "undefined" ? 0 : options.errorAbsolute;
        options.errorRelative = options.version == 1 && typeof options.percentajeError != 'undefinided' && options.percentajeError > 0 ? options.percentajeError / 100 : options.errorRelative;
        options.evaluation = typeof options.evaluation == "undefined" ? false : options.evaluation;
        options.evaluationID = typeof options.evaluationID == "undefined" ? '' : options.evaluationID;
        options.id = typeof options.id == "undefined" ? false : options.id;
        $eXeMathProblems.setTexts(options.questions, $wordings, $feedbacks);
        $eXeMathProblems.loadProblems(options)
        options.questions = $eXeMathProblems.getQuestions(options.questions, options.percentajeQuestions);
        return options;
    },
    validateIntervals: function(domain) {
        const allowedCharactersRegex = /^[0-9\s\-!]+$/;
        let dm = domain.replace(/\s+/g, ' ').trim(); 
        if (!allowedCharactersRegex.test(dm)) {
            return false;
        }
        const formatRegex = /^(!?-?\d+)(\s+-\s+!?-?\d+)?$/;
        let isValid = formatRegex.test(dm);
        if (isValid && dm.includes(' - ')) {
            let [start, end] = dm.split(' - ').map(Number); // Convierte los números y compara
            isValid = start <= end;
        }
        return isValid;
    },
    validateIntervalsWithHash: function(domain) {
        const regex = /^-?\d+\s+-\s*-?\d+\s+#\s*\d+$/;
        if (!regex.test(domain.trim())) {
            return false;
        }
        let [interval, hashNumber] = domain.split('#');
        let [start, end] = interval.split('-').map(str => Number(str.trim()));
        let hashNum = Number(hashNumber.trim());
        return start < end && hashNum > 0;
    },

    processSimpleExpression: function(str) {
        const elements = str.split(/\s*,\s*/);
        let definedSet = new Set();
        let disallowed = new Set();
        elements.forEach(el => {
            const exclude = el.startsWith('!');
            const value = exclude ? el.substring(1) : el;
            if (value.includes(' - ')) {
                if(value.includes('#')) {
                    this.processRangedExpression(value).forEach(item => definedSet.add(item));
                } else {
                    let [start, end] = value.split(' - ').map(Number);
                    for (let i = start; i <= end; i++) {
                        exclude ? disallowed.add(i) : definedSet.add(i);
                    }
                }
            } else {
                exclude ? disallowed.add(Number(value)) : definedSet.add(Number(value));
            }
        });
        let allowed = [...definedSet].filter(value => !disallowed.has(value));
        if (!allowed.length) return [1]; 
        return allowed;
    },

    processRangedExpression: function (str) {
        let [range, step] = str.split('#');
        step = Number(step);
        let [start, end] = range.split(' - ').map(Number);
        let result = [];
        for (let i = start; i <= end; i += step) {
            result.push(i);
        }
        if (!result.length) return [1]; 
        return result;
    },

    getRandomAllowedValue: function(str) {
        const elements = str.split(/\s*,\s*/);
        let possibleValuesSet = new Set();
        let disallowedValuesSet = new Set();
        elements.forEach(element => {
            const isDisallowed = element.startsWith('!');
            const value = isDisallowed ? element.substring(1) : element;
            if (value.includes('#')) {
                this.processRangedExpression(value).forEach(val => isDisallowed ? disallowedValuesSet.add(val) : possibleValuesSet.add(val));
            } else {
                this.processSimpleExpression(value).forEach(val => isDisallowed ? disallowedValuesSet.add(val) : possibleValuesSet.add(val));
            }
        });
        const possibleValues = [...possibleValuesSet].filter(value => !disallowedValuesSet.has(value));
        if (!possibleValues.length) return 1;
        const randomIndex = Math.floor(Math.random() * possibleValues.length);
        return possibleValues[randomIndex];
    },
    loadProblems: function (options) {
        var expresion = /\{[a-zA-z]\}/g;
        for (var i = 0; i < options.questions.length; i++) {
            var text = options.questions[i].wordingseg,
                fms = options.questions[i].formula.split('|'),
                fm0 = fms[0],
                values = fm0.match(expresion),
                solutions = [],
                formula = options.questions[i].formula;
                values = $eXeMathProblems.getUniqueElements(values);

            if (values !== null && values.length > 0) {
                var data = $eXeMathProblems.checkValuesFormule(formula, text, values, options, i);
                text = data.text;
                solutions = data.solutions;
            } else {
                var mformula = formula.split('|');
                for (var z = 0; z < mformula.length; z++) {
                    var solution = eval(mformula[z]) * 1.00;
                    solution = parseFloat(solution.toFixed(2))
                    solutions.push(solution);
                }

            }
            var wronganswer = [];
            if (solutions.length == 0) {
                solutions = '0'
            } else {
                for (var j = 0; j < solutions.length; j++) {
                    var option = $eXeMathProblems.getOptionsArray(solutions[j], 4, false);
                    wronganswer.push(option);
                }
                solutions = solutions.join('|')
            }
            options.questions[i].wronganswer = wronganswer;
            options.questions[i].solution = solutions;
            options.questions[i].wording = text;
        }


    },
    getOptionsArray: function (num, numdatos) {
        let array = [num];
        let rango = Math.abs(num) * 0.3;
        while (array.length < numdatos) {
            let valor = Math.random() * (rango * 2) + num - rango;
            valor = parseFloat(valor.toFixed(2));
            if (valor !== num && !array.includes(valor)) {
                array.push(valor);
            }
        }
        let currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array.slice(0, numdatos);
    },
    checkValuesFormule: function (formule, text, values, options, num) {
        var result = {
                'formule': '',
                'text': '',
                'solutions': [],
            },
            solutions = [],
            mtext = text,
            nf = formule,
            isCorrectFormule = true;
        if(typeof options.questions[num].definedVariables != 'undefined' && options.questions[num].definedVariables){
            for (var j = 0; j < values.length; j++) {
                var rg = new RegExp(values[j], 'g'),
                    number = $eXeMathProblems.getDefinidedValue(values[j], options.questions[num].domains);
                    mtext = mtext.replace(rg, number);
                    nf = nf.replace(rg, number);
            }
        }else{
            for (var j = 0; j < values.length; j++) {
                var rg = new RegExp(values[j], 'g'),
                    number = $eXeMathProblems.getRandomNo(options.questions[num].min, options.questions[num].max, options.questions[num].decimals);
                    mtext = mtext.replace(rg, number);
                    nf = nf.replace(rg, number);
                }
        }
        var mformula = nf.split('|'),
            solution = 0;
        for (var z = 0; z < mformula.length; z++) {
            solution = eval(mformula[z]) * 1.00;
            if (isNaN(solution)) {
                isCorrectFormule = false;
                break;
            };
            solution = parseFloat(solution.toFixed(2))
            solutions.push(solution);
        }
        result.formule = formule;
        result.text = mtext;
        result.solutions = [];
        if (isCorrectFormule) {
            result.solutions = solutions
        };
        return result;

    },
    getDefinidedValue: function(value, domains){
        var sval = value.replace(/[{}]/g, "");
        var domain = "1";
        for (const domainObj of domains) {
            if (sval == domainObj.name) {
                domain = domainObj.value;
                break;
            }
        }
        var num = $eXeMathProblems.getRandomAllowedValue(domain);
        return num;
    },
    setTexts: function (questions, $wordings, $feedbacks) {
        for (var i = 0; i < questions.length; i++) {
            var p = questions[i];
            $eXeMathProblems.setWording(p, $wordings, i);
            $eXeMathProblems.setFeedBack(p, $feedbacks, i);
        }
    },

    setWording: function (p, $wordings, number) {
        $wordings.each(function () {
            var id = parseInt($(this).data('id'));
            if (id == number) {
                p.wording = $eXeMathProblems.clearTags($(this).html());
                p.wordingseg = p.wording;
                p.id = id;
                return;
            }
        });
    },

    setFeedBack: function (p, $feedbacks, number) {
        $feedbacks.each(function () {
            var id = parseInt($(this).data('id'));
            if (id == number) {
                p.textFeedBack = $eXeMathProblems.clearTags($(this).html());
                return;
            }
        });
    },

    clearTags: function (text) {
        var txt = text.replace(/\\"/g, '"');
        return txt

    },
    createInterfaceMathP: function (instance) {
        var html = '',
            path = $eXeMathProblems.idevicePath,
            msgs = $eXeMathProblems.options[instance].msgs,
            html = '';
        html += '<div class="MTHP-MainContainer" id="mthpMainContainer-' + instance + '">\
        <div class="MTHP-GameMinimize" id="mthpGameMinimize-' + instance + '">\
            <a href="#" class="MTHP-LinkMaximize" id="mthpLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + "mthpIcon.png" + '" class="MTHP-IconMinimize MTHP-Activo"  alt="">\
            <div class="MTHP-MessageMaximize" id="mthpMessageMaximize-' + instance + '"></div></a>\
        </div>\
        <div class="MTHP-GameContainer" id="mthpGameContainer-' + instance + '">\
            <div class="MTHP-GameScoreBoard">\
                <div class="MTHP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number" title="' + msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' + msgs.msgNumQuestions + ': </span><span id="mthpPNumber-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' + msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="mthpPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' + msgs.msgErrors + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="mthpPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' + msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' + msgs.msgScore + ': </span><span id="mthpPScore-' + instance + '">0</span></p>\
                </div>\
                <div class="MTHP-LifesGame" id="mthpLifesAdivina-' + instance + '">\
                </div>\
                <div class="MTHP-TimeNumber">\
                    <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
					<div class="exeQuextIcons  exeQuextIcons-Time" title="' + msgs.msgTime + '"></div>\
                    <p  id="mthpPTime-' + instance + '" class="MTHP-PTime">00:00</p>\
                    <a href="#" class="MTHP-LinkMinimize" id="mthpLinkMinimize-' + instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  MTHP-Activo"></div>\
                    </a>\
                    <a href="#" class="MTHP-LinkFullScreen" id="mthpLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  MTHP-Activo" id="mthpFullScreen-' + instance + '"></div>\
					</a>\
				</div>\
            </div>\
            <div class="MTHP-ShowClue">\
                <div class="sr-av">' + msgs.msgClue + '</div>\
                <p class="MTHP-PShowClue MTHP-parpadea" id="mthpPShowClue-' + instance + '"></p>\
           </div>\
           <div class="MTHP-Multimedia" id="mthpMultimedia-' + instance + '">\
           </div>\
           <div class="MTHP-Message" id="mthpMessageDiv-' + instance + '">\
            <div class="sr-av">' + msgs.msgAuthor + ':</div>\
            <p id="mthpMessage-' + instance + '"></p>\
            </div>\
           <div class="MTHP-DivReply" id="mthpDivReply-' + instance + '">\
                <a href="#" id="mthpBtnMoveOn-' + instance + '" title="' + msgs.msgMoveOne + '">\
                    <strong><span class="sr-av">' + msgs.msgMoveOne + '</span></strong>\
                    <div class="exeQuextIcons-MoveOne  MTHP-Activo"></div>\
                </a>\
                <input type="text" value="" class="MTHP-EdReply" id="mthpEdAnswer-' + instance + '" autocomplete="off">\
                <a href="#" id="mathBtnReply-' + instance + '" title="' + msgs.msgReply + '">\
                    <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                    <div class="exeQuextIcons-Submit  MTHP-Activo"></div>\
                </a>\
            </div>\
            <div class="MTHP-DivFeedBackQ" id="mthpDivFeedBackQ-' + instance + '" style="display:none" >\
                <input type="button" id="mthpFeedBackLink-' + instance + '" value="' + msgs.msgFeedBack + '" class="feedbackbutton" />\
                <div  id="mthpFeedBackMessage-' + instance + '" style="display:none">\
                </div>\
          </div>\
           <div class="MTHP-Flex" id="mthpDivImgHome-' + instance + '">\
                <img src="' + path + "mthpHome.png" + '" class="MTHP-ImagesHome" id="mthpPHome-' + instance + '"  alt="' + msgs.msgNoImage + '" />\
           </div>\
            <div class="MTHP-StartGame"><a href="#" id="mthpStartGame-' + instance + '"></a></div>\
            <div class="MTHP-Cubierta" id="mthpCubierta-' + instance + '">\
                <div class="MTHP-CodeAccessDiv" id="mthpCodeAccessDiv-' + instance + '">\
                    <p class="MTHP-MessageCodeAccessE" id="mthpMesajeAccesCodeE-' + instance + '"></p>\
                    <div class="MTHP-DataCodeAccessE">\
                        <label class="sr-av">' + msgs.msgCodeAccess + ':</label><input type="text" class="MTHP-CodeAccessE"  id="mthpCodeAccessE-' + instance + '">\
                        <a href="#" id="mthpCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                            <div class="exeQuextIcons-Submit MTHP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="MTHP-DivFeedBack" id="mthpDivFeedBack-' + instance + '">\
                    <input type="button" id="mthpFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
                </div>\
            </div>\
        </div>\
    </div>\
    ' + this.addButtonScore(instance);
        return html;
    },

    showQuestion: function (num, instance) {
        var mOptions = $eXeMathProblems.options[instance],
            q = mOptions.questions[num];

        $('#mthpMultimedia-' + instance).html(q.wording);
        $('#mthpFeedBackMessage-' + instance).html(q.textFeedBack);
        $('#mthpBtnReply-' + instance).prop('disabled', false);
        $('#mthpBtnMoveOn-' + instance).prop('disabled', false);
        $('#mthpEdAnswer-' + instance).prop('disabled', false);
        mOptions.counter = q.time;
        $('#mthpDivFeedBackQ-' + instance).hide();
        if (q.textFeedBack.length > 0) {
            $('#mthpDivFeedBackQ-' + instance).fadeToggle();
        }
        mOptions.activeQuestion = num;
        var html = $('#mthpMainContainer-' + instance).html(),
            latex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(html);
        if (latex) {
            $eXeMathProblems.updateLatex('mthpMainContainer-' + instance);
        }
        mOptions.gameActived = true;
        $eXeMathProblems.showMessage(0, '', instance)

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
    showCubiertaOptions(mode, instance) {
        if (mode === false) {
            $('#mthpCubierta-' + instance).fadeOut();
            return;
        }
        $('#mthpCodeAccessDiv-' + instance).hide();
        $('#mthpDivFeedBack-' + instance).hide();
        switch (mode) {
            case 0:
                $('#mthpCodeAccessDiv-' + instance).show();
                break;
            case 1:
                $('#mthpDivFeedBack-' + instance).find('.identifica-feedback-game').show();
                $('#mthpDivFeedBack-' + instance).css('display', 'flex')
                $('#mthpDivFeedBack-' + instance).show();
                break;
            default:

                break;
        }
        $('#mthpCubierta-' + instance).fadeIn();
    },

    hasDuplicates: function (array) {
        if (array.length == 1) return false;
        let seen = {};
        for (let i = 0; i < array.length; i++) {
            if (seen[array[i]]) {
                return true;
            }
            seen[array[i]] = true;
        }
        return false;
    },
    getUniqueElements: function (arr) {
        return Array.from(new Set(arr));
    },
    hasDuplicatesElements: function (arr) {
        return (new Set(arr)).size !== arr.length;
    },
    answerQuestion: function (instance) {
        var mOptions = $eXeMathProblems.options[instance],
            answord = $('#mthpEdAnswer-' + instance).val(),
            respuestas = [];

        if (answord.length == 0) {
            $eXeMathProblems.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
            return;
        }
        if (!mOptions.gameActived || mOptions.gameOver) {
            return;
        }
        answord = answord.replace(',', '.');
        var answords = answord.split('|');
        for (var j = 0; j < answords.length; j++) {
            var answer = eval(answords[j]) * 1.00;
            answer = parseFloat(answer.toFixed(2))
            respuestas.push(answer)
        }
        if (respuestas.length > 1 && $eXeMathProblems.hasDuplicatesElements(respuestas)) {
            $eXeMathProblems.showMessage(1, mOptions.msgs.msgDuplicateAnswer, instance);
            return;
        }
        answord = respuestas.join('|');

        mOptions.gameActived = false;
        $('#mthpBtnReply-' + instance).prop('disabled', true);
        $('#mthpBtnMoveOn-' + instance).prop('disabled', true);
        $('#mthpEdAnswer-' + instance).prop('disabled', true);

        var correct = $eXeMathProblems.validateAnswers(answord, instance);
        $eXeMathProblems.updateScore(correct, instance);
        mOptions.activeCounter = false;
        var timeShowSolution = 1000;
        if (mOptions.showSolution) {
            timeShowSolution = mOptions.timeShowSolution * 1000;
        }
        setTimeout(function () {
            if (mOptions.numberQuestions - mOptions.hits - mOptions.errors <= 0) {
                $eXeMathProblems.gameOver(0, instance)
            } else {
                $eXeMathProblems.newQuestion(instance)
            }

        }, timeShowSolution);

    },
    validateAnswerUnsort: function (answords, instance) {

        var mOptions = $eXeMathProblems.options[instance],
            sSolutions = mOptions.questions[mOptions.activeQuestion].solution.split('|'),
            sAnswords = answords.split('|'),
            error = 0;
        for (let i = 0; i < sAnswords.length; i++) {
            let found = false;
            for (let j = 0; j < sSolutions.length; j++) {
                if (mOptions.errorType > 0) {
                    error = mOptions.errorType == 1 ? sSolutions[j] * mOptions.errorRelative : mOptions.errorAbsolute;
                }
                if (Math.abs(sAnswords[i] - sSolutions[j]) <= error) {
                    found = true;
                    sSolutions.splice(j, 1);
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    },
    validateAnswerSort: function (answords, instance) {
        var mOptions = $eXeMathProblems.options[instance],
            sAnswords = answords.split('|'),
            sSolutions = Options.questions[mOptions.activeQuestion].solution.split('|'),
            error = 0;
        for (let i = 0; i < sAnswords.length; i++) {
            if (mOptions.errorType > 0) {
                error = mOptions.errorType == 1 ? sSolutions[i] * mOptions.errorRelative : mOptions.errorAbsolute;
            }
            if (Math.abs(sAnswords[i] - sSolutions[i]) > error) {
                return false;
            }
        }
        return true;
    },


    validateAnswers: function (answords, instance) {
        var mOptions = $eXeMathProblems.options[instance];
        return mOptions.sortAnswers ? $eXeMathProblems.validateAnswerSort(answords, instance) : $eXeMathProblems.validateAnswerUnsort(answords, instance)

    },
    getRandomNo: function (from, to, decimals) {
        if (decimals != 0) return parseFloat(((Math.random() * to) + from).toFixed(decimals));
        else return Math.floor(Math.random() * to) + from
    },

    checkClue: function (instance) {

        var mOptions = $eXeMathProblems.options[instance],
            percentageHits = (mOptions.hits / mOptions.numberQuestions) * 100,
            message = '';
        if (mOptions.itinerary.showClue && percentageHits >= mOptions.itinerary.percentageClue) {
            if (!mOptions.obtainedClue) {
                message += ' ' + mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame
                mOptions.obtainedClue = true;
                $('#mthpPShowClue-' + instance).text(message);
            }

        }

    },
    addButtonScore: function (instance) {
        var mOptions = $eXeMathProblems.options[instance];
        var butonScore = "";
        var fB = '<div class="MTHP-BottonContainer">';
        if (mOptions.scorm.isScorm == 2) {
            var buttonText = mOptions.scorm.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="MTHP-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="mthpSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="MTHP-RepeatActivity" id="mthpRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.scorm.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="MTHP-GetScore">';
                fB += '<p><span class="MTHP-RepeatActivity" id="mthpRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },
     updateEvaluationIcon: function (instance) {
        var mOptions = $eXeMathProblems.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var node = $('#nodeTitle').text(),
                data = $eXeMathProblems.getDataStorage(mOptions.evaluationID)
            var score = '',
                state = 0;
            if (!data) {
                $eXeMathProblems.showEvaluationIcon(instance, state, score);
                return;
            }
            const findObject = data.activities.find(
                obj => obj.id == mOptions.id && obj.node === node
            );
            if (findObject) {
                state = findObject.state;
                score = findObject.score;
            }
            $eXeMathProblems.showEvaluationIcon(instance, state, score)
            var ancla = 'ac-' + mOptions.id;
            $('#' + ancla).remove();
            $('#mthpMainContainer-' + instance).parents('article').prepend('<div id="' + ancla + '"></div>');

        }
    },
    showEvaluationIcon: function (instance, state, score) {
        var mOptions = $eXeMathProblems.options[instance];
        var $header = $('#mthpGameContainer-' + instance).parents('article').find('header.iDevice_header');
        var icon = 'exequextsq.png',
            alt = mOptions.msgs.msgUncompletedActivity;
        if (state == 1) {
            icon = 'exequextrerrors.png';
            alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%S', score);

        } else if (state == 2) {
            icon = 'exequexthits.png';
            alt = mOptions.msgs.msgSuccessfulActivity.replace('%S', score);
        }
        $('#mthpEvaluationIcon-' + instance).remove();
        var sicon = '<div id="mthpEvaluationIcon-' + instance + '" class="MTHP-EvaluationDivIcon"><img  src="' + $eXeMathProblems.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + '</span></div>'
        $header.eq(0).append(sicon);
        $('#mthpEvaluationIcon-' + instance).find('span').eq(0).text(alt)
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
        var mOptions = $eXeMathProblems.options[instance];
        if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
            var name = $('#mthpGameContainer-' + instance).parents('article').find('.iDeviceTitle').eq(0).text(),
                node = $('#nodeTitle').text(),
                score =  ((10 * mOptions.hits) / mOptions.numberQuestions).toFixed(2)
            var formattedDate =  $eXeMathProblems.getDateString();
            var scorm = {
                'id': mOptions.id,
                'type': mOptions.msgs.msgTypeGame,
                'node': node,
                'name': name,
                'score': score,
                'date': formattedDate,
                'state': (parseFloat(score) >= 5 ? 2 : 1)
            }
            var data = $eXeMathProblems.getDataStorage(mOptions.evaluationID);
            data = $eXeMathProblems.updateEvaluation(data, scorm);
            data = JSON.stringify(data, mOptions.evaluationID);
            localStorage.setItem('dataEvaluation-' + mOptions.evaluationID, data);
            $eXeMathProblems.showEvaluationIcon(instance, scorm.state, scorm.score)
        }

    },
    getDataStorage: function (id) {
        var id = 'dataEvaluation-' + id,
            data = $eXeMathProblems.isJsonString(localStorage.getItem(id));
        return data;
    },
    sendScore: function (instance, auto) {
        var mOptions = $eXeMathProblems.options[instance],
            message = '',
            score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
        if (mOptions.gameStarted || mOptions.gameOver) {
            if (typeof ($eXeMathProblems.mScorm) != 'undefined') {
                if (!auto) {
                    if (!mOptions.scorm.repeatActivity && $eXeMathProblems.previousScore !== '') {
                        message = $eXeMathProblems.userName !== '' ? $eXeMathProblems.userName + ' ' + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
                    } else {
                        $eXeMathProblems.previousScore = score;
                        $eXeMathProblems.mScorm.set("cmi.core.score.raw", score);
                        message = $eXeMathProblems.userName !== '' ? $eXeMathProblems.userName + ', ' + $exe_i18n.yourScoreIs + ' ' + score : $exe_i18n.yourScoreIs + ' ' + score;
                        if (!mOptions.scorm.repeatActivity) {
                            $('#mthpSendScore-' + instance).hide();
                        }
                        $('#mthpRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                        $('#mthpRepeatActivity-' + instance).show();
                    }
                } else {
                    $eXeMathProblems.previousScore = score;
                    score = score === "" ? 0 : score;
                    $eXeMathProblems.mScorm.set("cmi.core.score.raw", score);
                    $('#mthpRepeatActivity-' + instance).text($exe_i18n.yourScoreIs + ' ' + score)
                    $('#mthpRepeatActivity-' + instance).show();
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
            $eXeMathProblems.getFullscreen(element);
        } else {
            $eXeMathProblems.exitFullscreen(element);
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
        var mOptions = $eXeMathProblems.options[instance];
        $('#mthpLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#mthpGameContainer-" + instance).show()
            $("#mthpGameMinimize-" + instance).hide();
        });
        $("#mthpLinkMinimize-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $("#mthpGameContainer-" + instance).hide();
            $("#mthpGameMinimize-" + instance).css('visibility', 'visible').show();
        });

        $("#mthpLinkFullScreen-" + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('mthpGameContainer-' + instance);
            $eXeMathProblems.toggleFullscreen(element, instance)
        });

        $('#mthpFeedBackClose-' + instance).on('click', function (e) {
            $eXeMathProblems.showCubiertaOptions(false, instance)

        });
        $('#mthpStartGame-' + instance).show();
        $('#mthpPShowClue-' + instance).text('');
        if (mOptions.itinerary.showCodeAccess) {
            $('#mthpMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $eXeMathProblems.showCubiertaOptions(0, instance);

        }
        $('#mthpCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeMathProblems.enterCodeAccess(instance);
        });
        $('#mthpCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeMathProblems.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#mthpPNumber-' + instance).text(mOptions.numberQuestions);
        $(window).on('unload', function () {
            if (typeof ($eXeMathProblems.mScorm) != "undefined") {
                $eXeMathProblems.endScorm();
            }
        });
        if (mOptions.scorm.isScorm > 0) {
            $eXeMathProblems.updateScorm($eXeMathProblems.previousScore, mOptions.scorm.repeatActivity, instance);
        }
        $('#mthpInstructions-' + instance).text(mOptions.instructions);
        $('#mthpSendScore-' + instance).click(function (e) {
            e.preventDefault();
            $eXeMathProblems.sendScore(instance, false);
            $eXeMathProblems.saveEvaluation(instance);

        });
        $('#mthpBtnMoveOn-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMathProblems.newQuestion(instance)
        });
        $('#mathBtnReply-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMathProblems.answerQuestion(instance);
        });
        $('#mthpEdAnswer-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeMathProblems.answerQuestion(instance);
                return false;
            }
            return true;
        });
        $('#mthpStartGame-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeMathProblems.startGame(instance)
        });

        $('#mthpFeedBackLink-' + instance).on('click', function () {

            $('#mthpFeedBackMessage-' + instance).fadeToggle()
        });

        mOptions.gameStarted = false;
        $('#mthpGameContainer-' + instance).find('.exeQuextIcons-Time').show();
        $('#mthpPTime-' + instance).show();
        $('#mthpStartGame-' + instance).show();
        $('#mthpMultimedia-' + instance).hide();
        $('#mthpDivImgHome-' + instance).show();
        $('#mthpStartGame-' + instance).text(mOptions.msgs.msgPlayStart);
        $("#mthpDivReply-" + instance).hide();
        $eXeMathProblems.updateEvaluationIcon(instance);
    },

    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },
    getQuestions: function (questions, percentaje) {
        var mQuestions = questions;
        if (percentaje < 100) {
            var num = Math.round((percentaje * questions.length) / 100);
            num = num < 1 ? 1 : num;
            if (num < questions.length) {
                var array = [];
                for (var i = 0; i < questions.length; i++) {
                    array.push(i);
                }
                array = $eXeMathProblems.shuffleAds(array).slice(0, num).sort(function (a, b) {
                    return a - b;
                });
                mQuestions = [];
                for (var i = 0; i < array.length; i++) {
                    mQuestions.push(questions[array[i]]);
                }
            }
        }
        return mQuestions;
    },
    startGame: function (instance) {
        var mOptions = $eXeMathProblems.options[instance];
        if (mOptions.gameStarted) {
            return
        }
        mOptions.hits = 0;
        mOptions.errors = 0;
        mOptions.score = 0;
        mOptions.gameOver = false;
        mOptions.gameStarted = false;
        mOptions.obtainedClue = false;
        mOptions.activeCounter = true;
        mOptions.counter = 60;
        $eXeMathProblems.updateGameBoard(instance)
        $('#mthpMultimedia-' + instance).show();
        $('#mthpDivImgHome-' + instance).hide();
        $('#mthpStartGame-' + instance).hide();
        mOptions.numberQuestions = mOptions.questions.length;
        mOptions.activeQuestion = -1;
        mOptions.counter = 0;
        mOptions.gameStarted = false;
        $('#mthpPNumber-' + instance).text(mOptions.numberQuestions);
        $("#mthpDivReply-" + instance).show();

        mOptions.counterClock = setInterval(function () {
            if (mOptions.gameStarted && mOptions.activeCounter) {
                mOptions.counter--;
                $eXeMathProblems.uptateTime(mOptions.counter, instance);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    $eXeMathProblems.answerQuestion(instance)
                    var timeShowSolution = 1000;
                    if (mOptions.showSolution) {
                        timeShowSolution = mOptions.timeShowSolution * 1000;
                    }
                    setTimeout(function () {
                        if (mOptions.numberQuestions - mOptions.hits - mOptions.errors <= 0) {
                            $eXeMathProblems.gameOver(0, instance)
                        } else {
                            $eXeMathProblems.newQuestion(instance)
                        }
                    }, timeShowSolution);
                    return;
                }
            }

        }, 1000);
        $eXeMathProblems.uptateTime(0, instance);
        mOptions.gameStarted = true;
        $eXeMathProblems.newQuestion(instance);

    },
    newQuestion: function (instance) {
        var mOptions = $eXeMathProblems.options[instance],
            mActiveQuestion = $eXeMathProblems.updateNumberQuestion(mOptions.activeQuestion, instance),
            $mthpPNumber = $('#mthpPNumber-' + instance);
        $('#mthpEdAnswer-' + instance).val('');
        if (mActiveQuestion == -10) {
            $mthpPNumber.text('0');
            $eXeMathProblems.gameOver(0, instance);
        } else {
            mOptions.counter = mOptions.questions[mActiveQuestion].time;
            $eXeMathProblems.showQuestion(mActiveQuestion, instance);
            mOptions.activeCounter = true;
            $mthpPNumber.text(mOptions.numberQuestions - mActiveQuestion);
        };
        if (mOptions.scorm.isScorm == 1) {
            if (mOptions.scorm.repeatActivity || $eXeMathProblems.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeMathProblems.sendScore(instance, true);
                $('#mthpRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        $eXeMathProblems.saveEvaluation(instance);
    },


    updateNumberQuestion: function (numq, instance) {
        var mOptions = $eXeMathProblems.options[instance],
            numActiveQuestion = numq;
        numActiveQuestion++;
        if (numActiveQuestion >= mOptions.numberQuestions) {
            return -10;
        }
        mOptions.activeQuestion = numActiveQuestion;
        return numActiveQuestion;
    },
    
    gameOver: function (type, instance) {
        var mOptions = $eXeMathProblems.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameOver = true;
        $('#mthpDivModeBoard-' + instance).hide()
        $('#mthpDivFeedBackQ-' + instance).hide()
        clearInterval(mOptions.counterClock);
        //$('#mthpStartGame-' + instance).show();
        //$eXeMathProblems.showScoreGame(type, instance);
        $('#mthpDivReply-' + instance).hide();
        $('#mthpMultimedia-' + instance).hide();
        $eXeMathProblems.uptateTime(0, instance);
        if (mOptions.scorm.isScorm == 1) {
            if (mOptions.scorm.repeatActivity || $eXeMathProblems.initialScore === '') {
                var score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
                $eXeMathProblems.sendScore(instance, true);
                $('#mthpRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);
                $eXeMathProblems.initialScore = score;
            }
        }
        $eXeMathProblems.saveEvaluation(instance);
        $eXeMathProblems.showFeedBack(instance);
        $('#mthpStartGame-' + instance).show();
        var message = mOptions.msgs.msgEndGameM.replace('%s', mOptions.score.toFixed(2)),
            type = mOptions.score >= 5 ? 2 : 1;
        $eXeMathProblems.showMessage(type, message, instance);
        mOptions.questions = mOptions.optionsRamdon ? $eXeMathProblems.shuffleAds(mOptions.questions) : mOptions.questions;
        $eXeMathProblems.loadProblems(mOptions);


    },

    enterCodeAccess: function (instance) {
        var mOptions = $eXeMathProblems.options[instance];
        if (mOptions.itinerary.codeAccess.toLowerCase() == $('#mthpCodeAccessE-' + instance).val().toLowerCase()) {
            $eXeMathProblems.showCubiertaOptions(false, instance);
            mOptions.gameStarted = false;
            $eXeMathProblems.startGame(instance);
        } else {
            $('#mthpMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#mthpCodeAccessE-' + instance).val('');
        }
    },

    uptateTime: function (tiempo, instance) {
        var mTime = $eXeMathProblems.getTimeToString(tiempo);
        $('#mthpPTime-' + instance).text(mTime);
    },
    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },

    showFeedBack: function (instance) {
        var mOptions = $eXeMathProblems.options[instance];
        var puntos = mOptions.hits * 100 / mOptions.numberQuestions;
        if (mOptions.feedBack) {
            if (puntos >= mOptions.percentajeFB) {
                $('#mthpDivFeedBack-' + instance).find('.mathproblems-feedback-game').show();
                $eXeMathProblems.showCubiertaOptions(1, instance)
            } else {
                $eXeMathProblems.showMessage(1, mOptions.msgs.msgTryAgain.replace('%s', mOptions.percentajeFB), instance);
            }
            if ($('#mthpGameContainer-' + instance).height() < $('#mthpCubierta-' + instance).height()) {
                $('#mthpGameContainer-' + instance).height($('#mthpCubierta-' + instance).height() + 80)
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
    Decrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        str = unescape(str)
        try {
            var key = 146,
                pos = 0,
                ostr = '';
            while (pos < str.length) {
                ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
                pos += 1;
            }

            return ostr;
        } catch (ex) {
            return '';
        }
    },

    updateScore: function (correctAnswer, instance) {
        var mOptions = $eXeMathProblems.options[instance],
            message = "",
            type = 1;
        if (correctAnswer) {
            mOptions.hits++
            type = 2;
        } else {
            mOptions.errors++;
        }
        pendientes = mOptions.numberQuestions - mOptions.errors - mOptions.hits;
        message = $eXeMathProblems.getMessageAnswer(correctAnswer, instance);
        mOptions.score = (mOptions.hits / mOptions.numberQuestions) * 10;
        if (mOptions.isScorm === 1) {
            if (mOptions.scorm.repeatActivity || $eXeMathProblems.initialScore === '') {
                var score = mOptions.score.toFixed(2);;
                $eXeMathProblems.sendScore(instance, true);
                $('#mthpRepeatActivity-' + instance).text(mOptions.msgs.msgYouScore + ': ' + score);

            }
        }
        $eXeMathProblems.saveEvaluation(instance);
        $eXeMathProblems.checkClue(instance);
        $eXeMathProblems.updateGameBoard(instance);
        $eXeMathProblems.showMessage(type, message, instance);

    },
    getMessageAnswer: function (correctAnswer, instance) {
        var mOptions = $eXeMathProblems.options[instance],
            message = $eXeMathProblems.getRetroFeedMessages(true, instance),
            q = mOptions.questions[mOptions.activeQuestion];
        if (!correctAnswer) {
            message = $eXeMathProblems.getRetroFeedMessages(false, instance);
        }
        if (mOptions.showSolution) {
            if (correctAnswer) {
                message += ' ' + mOptions.msgs.msgSolution + ': ' + q.solution;
            } else {
                message = ' ' + mOptions.msgs.msgNotCorrect + ' ' + q.solution
            }
        }
        return message;
    },
    getRetroFeedMessages: function (iHit, instance) {
        var mOptions = $eXeMathProblems.options[instance],
            sMessages = iHit ? mOptions.msgs.msgSuccesses : mOptions.msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },
    updateGameBoard(instance) {
        var mOptions = $eXeMathProblems.options[instance],
            pendientes = mOptions.numberQuestions - mOptions.errors - mOptions.hits,
            sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
        $('#mthpPHits-' + instance).text(mOptions.hits);
        $('#mthpPErrors-' + instance).text(mOptions.errors);
        $('#mthpPNumber-' + instance).text(pendientes);
        $('#mthpPScore-' + instance).text(sscore);
    },

    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeMathProblems.borderColors.red, $eXeMathProblems.borderColors.green, $eXeMathProblems.borderColors.blue, $eXeMathProblems.borderColors.yellow],
            color = colors[type];
        $('#mthpMessage-' + instance).text(message);
        $('#mthpMessage-' + instance).css({
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
    $eXeMathProblems.init();
});