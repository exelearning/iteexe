/**
 * Select Activity iDevice (export code)
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Graphic design: Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $eXeOca = {
    idevicePath: "",
    borderColors: {
        black: "#1c1b1b",
        blue: '#5877c6',
        green: '#00a300',
        red: '#b3092f',
        white: '#f9f9f9',
        yellow: '#f3d55a',
        grey: '#777777',
        incorrect: '#d9d9d9',
        correct: '#00ff00'

    },
    colors: {
        black: "#1c1b1b",
        blue: '#dfe3f1',
        green: '#caede8',
        red: '#fbd2d6',
        white: '#f9f9f9',
        yellow: '#fcf4d3',
        correct: '#dcffdc'
    },
    colorsDado: ['#e91e63', '#00bcd4', '#8bc34a', '#ffeb3b'],
    image: '',
    widthImage: 0,
    heightImage: 0,
    options: [],
    videos: [],
    video: {
        player: '',
        duration: 0,
        id: ''
    },
    player: '',
    userName: '',
    scorm: '',
    previousScore: '',
    initialScore: '',
    msgs: '',
    youtubeLoaded: false,
    hasSCORMbutton: false,
    isInExe: false,
    tiradas: [9, 3, 4, 4, 2, 3, 3, 6, 4, 2, 3, 3, 6, 4, 2, 3, 3, 6, 4, 2, 3],
    tirada: 0,

    init: function () {
        this.activities = $('.oca-IDevice');
        if (this.activities.length == 0) return;
        if (typeof ($exeAuthoring) != 'undefined' && $("#exe-submitButton").length > 0) {
            this.activities.hide();
            if (typeof (_) != 'undefined') this.activities.before('<p>' + _('Select Activity') + '</p>');
            return;
        }
        if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
        if (typeof ($exeAuthoring) != 'undefined') this.isInExe = true;
        this.idevicePath = this.isInExe ? "/scripts/idevices/oca-activity/export/" : "";
        if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
        else this.enable();
    },

    loadSCORM_API_wrapper: function () {
        if (typeof (pipwerks) == 'undefined') $exe.loadScript('SCORM_API_wrapper.js', '$eXeOca.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },

    loadSCOFunctions: function () {
        if (typeof (exitPageStatus) == 'undefined') $exe.loadScript('SCOFunctions.js', '$eXeOca.enable()');
        else this.enable();
        $eXeOca.mScorm = scorm;
        var callSucceeded = $eXeOca.mScorm.init();
        if (callSucceeded) {
            $eXeOca.userName = $eXeOca.getUserName();
            $eXeOca.previousScore = $eXeOca.getPreviousScore();
            $eXeOca.mScorm.set("cmi.core.score.max", 10);
            $eXeOca.mScorm.set("cmi.core.score.min", 0);
            $eXeOca.initialScore = $eXeOca.previousScore;
        }
    },

    loadJSCSSFile: function (filename, filetype) {
        if (filetype == "js") { //if filename is a external JavaScript file
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", filename)
        } else if (filetype == "css") { //if filename is an external CSS file
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    },

    enable: function () {
        $eXeOca.loadGame();
    },

    getUserName: function () {
        var user = $eXeOca.mScorm.get("cmi.core.student_name");
        return user
    },

    getPreviousScore: function () {
        var score = $eXeOca.mScorm.get("cmi.core.score.raw");
        return score;
    },

    endScorm: function () {
        if ($eXeOca.mScorm) {
            $eXeOca.mScorm.quit();
        }
    },

    updateScorm: function (prevScore, repeatActivity, instance) {
        var mOptions = $eXeOca.options[instance],
            text = '';
        $('#ocaSendScore-' + instance).hide();
        if (mOptions.isScorm === 1) {
            if (repeatActivity && prevScore !== '') {
                text = mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            } else if (repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveDiceAuto + ' ' + mOptions.msgs.msgPlaySeveralTimes;
            } else if (!repeatActivity && prevScore === "") {
                text = mOptions.msgs.msgSaveDiceAuto + ' ' + mOptions.msgs.msgOnlyFirstGame
            } else if (!repeatActivity && prevScore !== "") {
                text = mOptions.msgs.msgActityComply + ' ' + mOptions.msgs.msgYouLastScore + ': ' + prevScore;
            }
        }
        $('#ocaRepeatActivity-' + instance).text(text);
        $('#ocaRepeatActivity-' + instance).fadeIn(1000);
    },

    sendScore: function (instance) {
        var mOptions = $eXeOca.options[instance],
            score = (((mOptions.gamers[0].casilla + 1) * 10) / mOptions.numeroCasillas).toFixed(2);
        if (mOptions.isScorm !== 1 && mOptions.numeroJugadores !== 1) {
            return;
        }
        if (mOptions.repeatActivity || $eXeOca.initialScore === '') {
            if (mOptions.gameStarted || mOptions.gameOver) {
                if (typeof $eXeOca.mScorm != 'undefined') {
                    $eXeOca.mScorm.set("cmi.core.score.raw", score);
                }
            }
        }
    },

    loadGame: function () {
        $eXeOca.options = [];
        $eXeOca.activities.each(function (i) {
            var dl = $(".oca-DataGame", this),
                imagesLink = $('.oca-LinkImages', this),
                audiosLink = $('.oca-LinkAudios', this),
                mOption = $eXeOca.loadDataGame(dl, imagesLink, audiosLink);
            var msg = mOption.msgs.msgPlayStart;
            $eXeOca.options.push(mOption);
            var oca = $eXeOca.createInterfaceOca(i);
            dl.before(oca).remove();
            $('#ocaGameMinimize-' + i).hide();
            $('#ocaGameContainer-' + i).find('.oca-Message').hide();
            $('#ocaGameContainer-' + i).hide();
            $('#ocaMessageModal-' + i).hide();
            if (mOption.showMinimize) {
                $('#ocaGameMinimize-' + i).css({
                    'cursor': 'pointer'
                }).show();
            } else {
                $('#ocaGameContainer-' + i).show();
            }
            $('#ocaMessageMaximize-' + i).text(msg);
            $eXeOca.addEvents(i);
        });
        if (typeof (MathJax) == "undefined") {
            $eXeOca.loadMathJax();
        }
    },

    loadMathJax: function () {
        var tag = document.createElement('script');
        //tag.src = "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS-MML_CHTML";
        tag.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML";
        tag.async = true;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },

    randomArray: function (length, max) {
        return Array.apply(null, Array(length)).map(function () {
            return Math.round(Math.random() * max) + 1;
        });
    },

    createInterfaceOca: function (instance) {
        var html = '',
            path = $eXeOca.idevicePath,
            msgs = $eXeOca.options[instance].msgs;
        html += '<div class="oca-MainContainer" id="ocaMainContainer-' + instance + '">\
                    <div class="oca-GameMinimize" id="ocaGameMinimize-' + instance + '">\
                        <a href="#" class="oca-LinkMaximize" id="ocaLinkMaximize-' + instance + '" title="' + msgs.msgMaximize + '"><img src="' + path + 'ocaIcon.png" class="oca-Icons oca-IconMinimize oca-Activo" alt="Mostrar actividad">\
                            <div class="oca-MessageMaximize" id="ocaMessageMaximize-' + instance + '"></div>\
                        </a>\
                    </div>\
                    <div class="oca-botones">\
                        <div class="oca-prueba">1</div>\
                        <div class="oca-prueba">2</div>\
                        <div class="oca-prueba">3</div>\
                        <div class="oca-prueba">4</div>\
                        <div class="oca-prueba">5</div>\
                        <div class="oca-prueba">6</div>\
                        <div class="oca-prueba">7</div>\
                        <div class="oca-prueba">8</div>\
                        <div class="oca-prueba">9</div>\
                        <div class="oca-prueba">10</div>\
                        <div class="oca-prueba">12</div>\
                        <div class="oca-prueba">15</div>\
                        <div class="oca-prueba">18</div>\
                        <div class="oca-prueba">19</div>\
                        <div class="oca-prueba">21</div>\
                        <div class="oca-prueba">23</div>\
                        <div class="oca-prueba">26</div>\
                        <div class="oca-prueba">28</div>\
                        <div class="oca-prueba">31</div>\
                        <div class="oca-prueba">33</div>\
                        <div class="oca-prueba">36</div>\
                        <div class="oca-prueba">38</div>\
                        <div class="oca-prueba">40</div>\
                        <div class="oca-prueba">42</div>\
                        <div class="oca-prueba">44</div>\
                        <div class="oca-prueba">46</div>\
                        <div class="oca-prueba">50</div>\
                        <div class="oca-prueba">52</div>\
                        <div class="oca-prueba">55</div>\
                        <div class="oca-prueba">58</div>\
                        <div class="oca-prueba">60</div>\
                        <div class="oca-prueba">63</div>\
                        <div class="oca-sorpresa">0</div>\
                        <div class="oca-sorpresa">1</div>\
                        <div class="oca-sorpresa">2</div>\
                        <div class="oca-sorpresa">3</div>\
                        <div class="oca-sorpresa">4</div>\
                        <div class="oca-sorpresa">5</div>\
                    </div>\
                    <div class="oca-GameContainer" id="ocaGameContainer-' + instance + '">\
                        <div class="oca-Tablero" id="ocaTablero-' + instance + '">\
                            <div class="oca-Tiempo" id="ocaTiempo-' + instance + '">\
                                <p class="oca-PTiempo" id="ocaTiempo-' + instance + '">00:00<p>\
                            </div>\
                            <img class="oca-ImageTablero"  src="' + path + '0_tablero_oca.png" alt="Tablero" />\
                            <a href="#" class="oca-LinkFullScreen" id="ocaLinkFullScreen-' + instance + '" title="' + msgs.msgFullScreen + '">\
                                <strong><span class="sr-av">' + msgs.msgFullScreen + ':</span></strong>\
                                <div class="exeQuextIcons exeQuextIcons-FullScreen oca-Activo" id="ocaFullScreen-' + instance + '">\
                                </div>\
                            </a>\
                            <a href="#" class="oca-LinkMinimize" id="ocaLinkMinimize-' + instance + '" title="Minimizar">\
                                <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                                <div class="exeQuextIcons exeQuextIcons-Minimize oca-Activo"></div>\
                            </a>\
                            <a href="#" class="oca-LinkReboot" id="ocaLinkReboot-' + instance + '" title="Reiniciar">\
                                <strong><span class="sr-av">Reiniciar:</span></strong>\
                                <div class="exeQuextIcons-Reboot oca-Activo" id="ocaReboot-' + instance + '">\
                                </div>\
                            </a>\
                            <div class="oca-Protector"></div>\
                            <div id="ocaFicha0-' + instance + '" class="oca-Ficha oca-FichaRoja"></div>\
                            <div id="ocaFicha1-' + instance + '" class="oca-Ficha oca-FichaAzul"></div>\
                            <div id="ocaFicha2-' + instance + '" class="oca-Ficha oca-FichaVerde"></div>\
                            <div id="ocaFicha3-' + instance + '" class="oca-Ficha oca-FichaAmarilla"></div>\
                            <div class="oca-SelectsGamers" id="ocaSelectsGamers-' + instance + '">\
                                <div class="oca-NumberGamers" id="ocaNumberGamers-' + instance + '">\
                                    <p>' + msgs.msgGamers + ':</p>\
                                    <a href="#" class="oca-NumberIcon oca-Activo" data-number="1"><img src="' + path + 'ocacr1.png" alt="" width="32px"></a>\
                                    <a href="#" class="oca-NumberIcon oca-Activo" data-number="2"><img src="' + path + 'ocacb2.png" alt="" width="32px"></a>\
                                    <a href="#" class="oca-NumberIcon oca-Activo" data-number="3"><img src="' + path + 'ocacb3.png" alt="" width="32px"></a>\
                                    <a href="#" class="oca-NumberIcon oca-Activo" data-number="4"><img src="' + path + 'ocacb4.png" alt="" width="32px"></a>\
                                </div>\
                                <div class="oca-NameGamers" id="ocaNameGamers-' + instance + '">\
                                        <div class="oca-Jugador">\
                                            <div class="oca-FichaJugador oca-JuegadorRojo"></div>\
                                            <label for="inputjugador0"></label><input type="text" name="" class="oca-NameGamer" id="inputjugador0" autocomplete="off">\
                                        </div>\
                                        <div class="oca-Jugador">\
                                            <div class="oca-FichaJugador oca-JuegadorAzul"></div>\
                                            <label for="inputjugador1"></label><input type="text" name=""  class="oca-NameGamer" id="inputjugador1" autocomplete="off">\
                                        </div>\
                                        <div class="oca-Jugador">\
                                            <div class="oca-FichaJugador oca-JuegadorVerde"></div>\
                                            <label for="inputjugador2"></label><input type="text" name=""  class="oca-NameGamer" id="inputjugador2" autocomplete="off">\
                                        </div>\
                                        <div class="oca-Jugador">\
                                            <div class="oca-FichaJugador oca-JuegadorAmarillo"></div>\
                                            <label for="inputjugador3"></label><input type="text" name=""  class="oca-NameGamer" id="inputjugador3" autocomplete="off">\
                                        </div>\
                                </div>\
                                <a href="#" id="ocaStartGame-' + instance + '" class="oca-StartGame">' + msgs.msgPlayStart + '</a>\
                            </div>\
                            <div class="oca-Message" id="ocaMessage-' + instance + '">\
                                <img class="oca-MessageImage" id="ocaMessageImage-' + instance + '" src="' + path + 'ocallave.png" alt="Image" />\
                                <p id="ocaPMessage-' + instance + '"></p>\
                            </div>\
                            <div  class="oca-Dado" id="ocaDado-' + instance + '">\
                                <div class="oca-FondoDado" id="ocaFondoDado-' + instance + '"></div>\
                                <div class="oca-PuntosDado" id="ocaPuntosDado-' + instance + '"></div>\
                                <a href="#" class="ocaClick" id="ocaClickDado-' + instance + '" >\
                                    <div class="oca-ManoDado oca-Activo"></div>\
                                </a>\
                            </div>\
                            <div class="oca-MessageModal" id="ocaMessageModal-' + instance + '">\
                                <div class="oca-MessageModalIcono"></div>\
                                <div class="oca-MessageModalTexto" id="ocaMessageModalTexto-' + instance + '">\
                                    <p id="ocaPMessageModal-' + instance + '">' + msgs.msgReboot + '</p>\
                                    <div class="oca-MessageButtons">\
                                        <a href="#" id="ocaMessageAceptar-' + instance + '" title="' + msgs.msgSubmit + '">\
                                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                                            <div class="oca-AcceptButton"></div>\
                                        </a>\
                                        <a href="#" id="ocaMessageCancelar-' + instance + '" title="' + msgs.msgSubmit + '">\
                                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                                            <div class="oca-CancelButton"></div>\
                                        </a>\
                                    </div>\
                                </div>\
                                <div class="oca-CodeAccessDiv" id="ocaCodeAccessDiv-' + instance + '">\
                                <div class="oca-MessageCodeAccessE" id="ocaMesajeAccesCodeE-' + instance + '"></div>\
                                    <div class="oca-DataCodeAccessE">\
                                        <input type="text" class="oca-CodeAccessE" id="ocaCodeAccessE-' + instance + '">\
                                        <a href="#" id="ocaCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                                            <strong><span class="sr-av">' + msgs.msgSubmit + '</span></strong>\
                                            <div class="exeQuextIcons-Submit"></div>\
                                        </a>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="oca-Mochila"  id="ocaMochila-' + instance + '">\
                            <div class="oca-MochilaJugador ocaj0">\
                                <div class="oca-MochilaRoja oca-MochilaObjeto"></div>\
                                <div class="oca-Llave oca-MochilaObjeto"></div>\
                                <div class="oca-Pocion oca-MochilaObjeto"></div>\
                                <div class="oca-Rayo oca-MochilaObjeto"></div>\
                                <div class="oca-Vida oca-MochilaObjeto"><p>3</p></div>\
                            </div>\
                            <div class="oca-MochilaJugador ocaj1">\
                                <div class="oca-MochilaAzul oca-MochilaObjeto"></div>\
                                <div class="oca-Llave oca-MochilaObjeto"></div>\
                                <div class="oca-Pocion oca-MochilaObjeto"></div>\
                                <div class="oca-Rayo oca-MochilaObjeto"></div>\
                                <div class="oca-Vida oca-MochilaObjeto"><p>3</p></div>\
                            </div>\
                            <div class="oca-MochilaJugador ocaj2">\
                                <div class="oca-MochilaVerde oca-MochilaObjeto"></div>\
                                <div class="oca-Llave oca-MochilaObjeto"></div>\
                                <div class="oca-Pocion oca-MochilaObjeto"></div>\
                                <div class="oca-Rayo oca-MochilaObjeto"></div>\
                                <div class="oca-Vida oca-MochilaObjeto"><p>3</p></div>\
                            </div>\
                            <div class="oca-MochilaJugador ocaj3">\
                                <div class="oca-MochilaAmarilla oca-MochilaObjeto"></div>\
                                <div class="oca-Llave oca-MochilaObjeto"></div>\
                                <div class="oca-Pocion oca-MochilaObjeto"></div>\
                                <div class="oca-Rayo oca-MochilaObjeto"></div>\
                                <div class="oca-Vida oca-MochilaObjeto"><p>3</p></div>\
                            </div>\
                        </div>\
                    </div>\
                    ' + this.createInterfaceQuestion(instance) + '\
                </div>\
                ' + this.addButtonScore(instance);
        return html;
    },

    createInterfaceQuestion: function (instance) {
        var html = '',
            path = $eXeOca.idevicePath,
            msgs = $eXeOca.options[instance].msgs;
        html += '<div class="oca-GameQuestion" id="ocaGameQuestion-' + instance + '">\
        <div class="oca-TimeNumber">\
            <strong><span class="sr-av">' + msgs.msgTime + ':</span></strong>\
            <p id="ocaPTime-' + instance + '" class="oca-PTime">00:00</p>\
        </div>\
        <div class="oca-Multimedia" id="ocaMultimedia-' + instance + '">\
            <img class="oca-Cursor" id="ocaCursor-' + instance + '" src="' + path + 'ocaCursor.gif" alt="Cursor" />\
            <img  src="" class="oca-Images" id="ocaImagen-' + instance + '" alt="' + msgs.msgNoImage + '" />\
            <div class="oca-EText" id="ocaEText-' + instance + '"></div>\
            <img src="' + path + 'ocaHome.png" class="oca-Cover" id="ocaCover-' + instance + '" alt="' + msgs.msImage + '" />\
            <div class="oca-Video" id="ocaVideo-' + instance + '"></div>\
            <div class="oca-Protector1" id="ocaProtector-' + instance + '"></div>\
            <a href="#" class="oca-LinkAudio" id="ocaLinkAudio-' + instance + '" title="' + msgs.msgAudio + '"><img src="' + path + "exequextaudio.png" + '" class="oca-Activo" alt="' + msgs.msgAudio + '">\</a>\
        </div>\
        <div class="oca-AuthorLicence" id="ocaAutorLicence-' + instance + '">\
            <div class="sr-av">' + msgs.msgAuthor + ':</div>\
            <p id="ocaPAuthor-' + instance + '"></p>\
        </div>\
        <div class="oca-QuestionDiv" id="ocaQuestionDiv-' + instance + '">\
            <div class="sr-av">' + msgs.msgQuestion + ':</div>\
            <div class="oca-Question" id="ocaQuestion-' + instance + '"></div>\
            <div class="oca-OptionsDiv" id="ocaOptionsDiv-' + instance + '">\
                <div class="sr-av">' + msgs.msgOption + ' A:</div>\
                <a href="#" class="oca-Option1 oca-Options" id="ocaOption1-' + instance + '" data-number="0"></a>\
                <div class="sr-av">' + msgs.msgOption + ' B:</div>\
                <a href="#" class="oca-Option2 oca-Options" id="ocaOption2-' + instance + '" data-number="1"></a>\
                <div class="sr-av">' + msgs.msgOption + ' C:</div>\
                <a href="#" class="oca-Option3 oca-Options" id="ocaOption3-' + instance + '" data-number="2"></a>\
                <div class="sr-av">' + msgs.msgOption + ' D:</div>\
                <a href="#" class="oca-Option4 oca-Options" id="ocaOption4-' + instance + '" data-number="3"></a>\
            </div>\
        </div>\
        <div class="oca-WordsDiv" id="ocaWordDiv-' + instance + '">\
            <div class="sr-av">' + msgs.msgAnswer + ':</div>\
            <div class="oca-Prhase" id="ocaEPhrase-' + instance + '"></div>\
            <div class="sr-av">' + msgs.msgQuestion + ':</div>\
            <div class="oca-Definition" id="ocaDefinition-' + instance + '"></div>\
            <div class="oca-DivReply" id="ocaDivResponder-' + instance + '">\
                <input type="text" value="" class="oca-EdReply" id="ocaEdAnswer-' + instance + '" autocomplete="off">\
                <a href="#" id="ocaBtnReply-' + instance + '" title="' + msgs.msgReply + '">\
                    <strong><span class="sr-av">' + msgs.msgReply + '</span></strong>\
                    <div class="exeQuextIcons-Submit oca-Activo"></div>\
                </a>\
            </div>\
        </div>\
        <div class="oca-BottonContainerDiv" id="ocaBottonContainer-' + instance + '">\
            <div class="oca-AnswersDiv" id="ocaAnswerDiv-' + instance + '">\
                <div class="oca-Answers" id="ocaAnswers-' + instance + '"></div>\
                <a href="#" id="ocaButtonAnswer-' + instance + '" title="' + msgs.msgAnswer + '">\
                    <strong><span class="sr-av">' + msgs.msgAnswer + '</span></strong>\
                    <div class="exeQuextIcons-Submit oca-Activo"></div>\
                </a>\
            </div>\
        </div>\
    </div>';
        return html;
    },

    addButtonScore: function (instance) {
        var mOptions = $eXeOca.options[instance];
        var butonScore = "";
        var fB = '<div class="oca-BottonContainer">';
        if (mOptions.isScorm == 2) {
            var buttonText = mOptions.textButtonScorm;
            if (buttonText != "") {
                if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                    this.hasSCORMbutton = true;
                    fB += '<div class="oca-GetScore">';
                    if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
                    fB += '<p><input type="button" id="ocaSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="oca-RepeatActivity" id="ocaRepeatActivity-' + instance + '"></span></p>';
                    if (!this.isInExe) fB += '</form>';
                    fB += '</div>';
                    butonScore = fB;
                }
            }
        } else if (mOptions.isScorm == 1) {
            if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
                this.hasSCORMbutton = true;
                fB += '<div class="oca-GetScore">';
                fB += '<p><span class="oca-RepeatActivity" id="ocaRepeatActivity-' + instance + '"></span></p>';
                fB += '</div>';
                butonScore = fB;
            }
        }
        fB = +'</div>';
        return butonScore;
    },

    loadPlayers: function (instance) {
        var mOptions = $eXeOca.options[instance],
            gamers = [],
            validNames = true;
        $('#ocaNameGamers-' + instance).find('input').each(function (i) {
            if (i < mOptions.numeroJugadores) {
                var gamer = new Object();
                gamer.name = $(this).val().trim();
                gamer.score = 0;
                gamer.state = 0;
                gamer.casilla = -1;
                gamer.casillaanterior = -1;
                gamer.number = i;
                gamer.posada = 0;
                gamer.pozo = 0;
                gamer.laberinto = 0;
                gamer.carcel = 0;
                gamer.llave = false;
                gamer.rayo = 1;
                gamer.pocion = false;
                gamer.vidas = 3;
                gamers.push(gamer);
                if (gamer.name.length == 0) {
                    $('#ocaNameGamers-' + instance).find('input').eq(i).focus();
                    validNames = false;
                    return false;
                }
            }

        });
        if (validNames) {
            mOptions.gamers = gamers;
            $('#ocaMochila-' + instance).find('.oca-MochilaJugador').show();
            $('#ocaMochila-' + instance).find('.oca-MochilaJugador').each(function (i) {
                if (i >= mOptions.numeroJugadores) {
                    $(this).hide();
                }
            })
        }
        return validNames;
    },

    rebootGame: function (instance) {
        var mOptions = $eXeOca.options[instance];
        clearInterval(mOptions.relolMueveOcaLibre);
        clearInterval(mOptions.relolMueveOca);
        clearInterval(mOptions.relolMueveOcaRetro);
        clearInterval(mOptions.relojJuego);
        mOptions.contadorJuego = 0;
        $('#ocaSelectsGamers-' + instance).show();
        $('#ocaDado-' + instance).hide();
        $eXeOca.sendScore(instance);
        $eXeOca.initialScore = (((mOptions.gamers[0].casilla + 1) * 10) / mOptions.numeroCasillas).toFixed(2);
        mOptions.gameStarted = false;
        mOptions.jugadorActivo = 4;
        for (var i = 0; i < mOptions.numeroJugadores; i++) {
            mOptions.gamers[i].casilla = -1;
            $eXeOca.placePlayerToken(i, instance);
        }
        $eXeOca.loadGameBoard(instance);
    },

    startGame: function (instance) {
        var mOptions = $eXeOca.options[instance];
        $eXeOca.loadGameBoard(instance);
        if (mOptions.gameStarted) {
            $eXeOca.showGameMessage(mOptions.msgs.msgGameStarted, 4000, 0, instance);
            return;
        };
        if (!$eXeOca.loadPlayers(instance)) {
            $eXeOca.showGameMessage(mOptions.msgs.msgPlayersName, 4000, 0, instance);
            return;
        }
        for (var i = 0; i < mOptions.numeroJugadores; i++) {
            for (var j = 1; j < 4; j++) {
                $eXeOca.changeBackpackIcons(i, j, false, instance);
            }
        }
        $('#ocaSelectsGamers-' + instance).hide();
        $('#ocaDado-' + instance).show();
        mOptions.scoreGame = 0;
        mOptions.obtainedClue = false;
        if ($eXeOca.isVideoQuestion(mOptions.selectsGame)) {
            if (typeof (YT) !== "undefined") {
                if (typeof (mOptions.player) == "undefined") {
                    $eXeOca.youTubeReadyOne(instance);
                }
            } else {
                $eXeOca.loadYoutubeApi();
            }
        }
        mOptions.direccion = 1;
        mOptions.contadorJuego = 0;
        mOptions.jugadorActivo = Math.floor(Math.random() * mOptions.numeroJugadores);
        $eXeOca.changePlayer(instance);
        mOptions.gameStarted = true;
        mOptions.gameActived = false;
    },

    isVideoQuestion: function (questions) {
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].type == 2) {
                return true;
            }
        }
        return false;
    },

    changePlayer: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.jugadorActivo++;
        mOptions.jugadorActivo = mOptions.jugadorActivo >= mOptions.numeroJugadores ? 0 : mOptions.jugadorActivo;
        $('#ocaFondoDado-' + instance).css('background-color', $eXeOca.colorsDado[mOptions.jugadorActivo]);
        $('#ocaClickDado-' + instance).show();

        if (mOptions.gamers[mOptions.jugadorActivo].casilla < 0) {
            $eXeOca.placePlayerToken(mOptions.jugadorActivo, instance);
        }
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + ', ' + mOptions.msgs.msgsYouPlay, 3000, mOptions.jugadorActivo + 12, instance);
        mOptions.moviendo = false;
    },

    movePlayerToken: function (jugador, x, y, instance) {
        var mOptions = $eXeOca.options[instance],
            mjugador = "#ocaFicha" + jugador + '-' + instance,
            $Jugador = $(mjugador);
        $Jugador.css({
            'left': x + 'px',
            'top': y + 'px',
            'width': mOptions.wt,
            'height': mOptions.wt
        });
    },

    placePlayerToken: function (jugador, instance) {
        var mOptions = $eXeOca.options[instance],
            x = 0,
            y = 0;
        if (typeof mOptions.gamers[jugador] == "undefined") {
            return;
        }
        var numcasilla = mOptions.gamers[jugador].casilla;
        if (numcasilla < 0) {
            x = mOptions.casillaIniciales[jugador].x
            y = mOptions.casillaIniciales[jugador].y;
            if (jugador == mOptions.jugadorActivo) {
                x = mOptions.casillaSalida.x
                y = mOptions.casillaSalida.y;
            }
        } else {
            x = mOptions.pT[numcasilla].x
            y = mOptions.pT[numcasilla].y;
        }
        var mjugador = "#ocaFicha" + jugador + '-' + instance,
            $Jugador = $(mjugador);
        $Jugador.css({
            'left': x + 'px',
            'top': y + 'px',
            'width': mOptions.wt + 'px',
            'height': mOptions.wt + 'px',
        });
        $Jugador.show();
        if (numcasilla > -1) {
            $eXeOca.placePlayerTokensSkare(numcasilla, instance);
        }

    },
    movePlayerToken: function (numjugador, valor, instance) {
        var mOptions = $eXeOca.options[instance],
            jugador = mOptions.gamers[numjugador],
            $Jugador = $("#ocaFicha" + numjugador + '-' + instance),
            x = 0,
            y = 0,
            posJugador = jugador.casilla;
        jugador.casillaanterior = jugador.casilla;
        jugador.casilla += valor;
        $('#ocaGameContainer-' + instance).find('.oca-FichaJugador').css('z-index', 20);
        mOptions.relolMueveOca = setInterval(function () {
            if (posJugador < jugador.casilla) {
                posJugador++;
                if (posJugador > mOptions.numeroCasillas - 1) {
                    clearInterval(mOptions.relolMueveOca);
                    var pos = jugador.casilla - (mOptions.numeroCasillas - 1);
                    mOptions.gamers[numjugador].casilla = mOptions.numeroCasillas - 1;
                    $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, pos, instance);
                    return;
                }
                x = mOptions.pT[posJugador].x;
                y = mOptions.pT[posJugador].y;
                $Jugador.css({
                    'left': x + 'px',
                    'top': y + 'px',
                    'width': mOptions.wt,
                    'height': mOptions.wt,
                    'z-index': 21
                });

                if (posJugador == jugador.casilla) {
                    clearInterval(mOptions.relolMueveOca);
                    $eXeOca.getTarget(jugador.casilla, instance);
                    return;
                }
            }

        }, mOptions.velocidad);
    },

    movePlayerTokenFreely: function (numjugador, valor, instance) {
        var mOptions = $eXeOca.options[instance],
            jugador = mOptions.gamers[numjugador],
            $Jugador = $("#ocaFicha" + numjugador + '-' + instance),
            x = 0,
            y = 0,
            posJugador = jugador.casilla;
        jugador.casilla += valor;
        mOptions.relolMueveOcaLibre = setInterval(function () {
            if (posJugador <= jugador.casilla) {
                posJugador++;
                x = mOptions.pT[posJugador].x;
                y = mOptions.pT[posJugador].y;
                $Jugador.css({
                    'left': x + 'px',
                    'top': y + 'px',
                    'width': mOptions.wt,
                    'height': mOptions.wt,
                    'z-index': 21
                });
                if (posJugador == jugador.casilla) {
                    clearInterval(mOptions.relolMueveOcaLibre);
                    $eXeOca.placePlayerTokensSkare(posJugador, instance);
                    setTimeout(function () {
                        $eXeOca.getTarget(jugador.casilla, instance);
                    }, 1000);
                    return;
                }
            }

        }, mOptions.velocidad);
    },

    questionAnswer: function (respuesta, instance) {
        $('#ocaGameQuestion-' + instance).hide();
        $('#ocaGameContainer-' + instance).show();
        $eXeOca.loadGameBoard(instance);
        if (respuesta) {
            $eXeOca.changePlayer(instance);
        } else {
            $eXeOca.updateNumberLives(instance);
        }
    },

    updateNumberLives: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.gamers[mOptions.jugadorActivo].vidas = mOptions.gamers[mOptions.jugadorActivo].vidas - 1;
        $('#ocaMochila-' + instance + ' > .ocaj' + mOptions.jugadorActivo).find('.oca-Vida').find('p').text(mOptions.gamers[mOptions.jugadorActivo].vidas);
        if (mOptions.gamers[mOptions.jugadorActivo].vidas == 0) {
            if (mOptions.gamers[mOptions.jugadorActivo].casilla > 37) {
                mOptions.valorDado = mOptions.gamers[mOptions.jugadorActivo].casilla - 37;
            } else if (mOptions.gamers[mOptions.jugadorActivo].casilla > 20) {
                mOptions.valorDado = mOptions.gamers[mOptions.jugadorActivo].casilla - 20;
            } else {
                mOptions.valorDado = mOptions.gamers[mOptions.jugadorActivo].casilla + 1;
            }
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + ', ' + mOptions.msgs.msgLostLivesH, 3000, mOptions.jugadorActivo + 12, instance);
            mOptions.gamers[mOptions.jugadorActivo].vidas = 3;
        } else {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + ', ' + mOptions.msgs.msgErrorQuestion, 3000, mOptions.jugadorActivo + 12, instance);

        }
        setTimeout(function () {
            $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, mOptions.valorDado, instance);
        }, 3000);
    },

    movePlayerTokenBack: function (numjugador, valor, instance) {
        var mOptions = $eXeOca.options[instance],
            jugador = mOptions.gamers[numjugador],
            $Jugador = $("#ocaFicha" + numjugador + '-' + instance),
            x = 0,
            y = 0,
            posJugador = jugador.casilla;
        jugador.casilla -= valor;
        jugador.casillaanterior = jugador.casilla;
        $('#ocaGameContainer-' + instance).find('.oca-FichaJugador').css('z-index', 20);
        mOptions.relolMueveOcaRetro = setInterval(function () {
            if (posJugador >= jugador.casilla) {
                posJugador--;
                if (posJugador < 0) {
                    x = mOptions.casillaIniciales[mOptions.jugadorActivo].x;
                    y = mOptions.casillaIniciales[mOptions.jugadorActivo].y;

                } else {
                    x = mOptions.pT[posJugador].x;
                    y = mOptions.pT[posJugador].y;
                }
                $Jugador.css({
                    'left': x + 'px',
                    'top': y + 'px',
                    'width': mOptions.wt,
                    'height': mOptions.wt,
                    'z-index': 21
                });
                if (posJugador == jugador.casilla) {
                    clearInterval(mOptions.relolMueveOcaRetro);
                    if (jugador.casilla < 0 || jugador.casilla == 20 || jugador.casilla == 37) {
                        $('#ocaMochila-' + instance + ' > .ocaj' + mOptions.jugadorActivo).find('.oca-Vida').find('p').text(3);
                    }
                    if (posJugador == 57 || posJugador == 59) {
                        $eXeOca.getTarget(jugador.casilla, instance);
                    } else if (mOptions.rebote && (posJugador == 5 || posJugador == 25)) {
                        mOptions.rebote = false;
                        var mensaje = mOptions.gamers[mOptions.jugadorActivo].name + ', ' + mOptions.msgs.msgRoolDice;
                        $eXeOca.placePlayerTokensSkare(posJugador, instance);
                        $eXeOca.showGameMessage(mensaje, 5000, mOptions.jugadorActivo + 12, instance);
                        $eXeOca.activeDice(instance);
                    } else {

                        if (posJugador > -1) {
                            $eXeOca.placePlayerTokensSkare(posJugador, instance);
                        }
                        setTimeout(function () {
                            $eXeOca.changePlayer(instance);
                        }, 2000);
                    }
                    $eXeOca.sendScore(instance);
                    return;
                }
            }

        }, mOptions.velocidad);
    },

    hostal: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mesaje_posada_pocion = ", " + mOptions.msgs.msgHostal0,
            mesaje_posada_one = ", " + mOptions.msgs.msgHostalOne;
        if (mOptions.gamers[mOptions.jugadorActivo].pocion) {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_posada_pocion, 4000, 9, instance);
            mOptions.gamers[mOptions.jugadorActivo].pocion = false;
            $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 2, false, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenFreely(mOptions.jugadorActivo, 1, instance);
            }, 4000);
        } else {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_posada_one, 6000, 3, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, 19, instance);
            }, 3000);
        }

    },

    waterWell: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mesaje_pozo_llave = ", " + mOptions.msgs.msgWaterWell0,
            mesaje_pozo_one = ", " + mOptions.msgs.msgWaterWellOne;
        if (mOptions.gamers[mOptions.jugadorActivo].llave) {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_pozo_llave, 3000, 8, instance);
            mOptions.gamers[mOptions.jugadorActivo].llave = false;
            $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 1, false, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenFreely(mOptions.jugadorActivo, 1, instance);
            }, 4000);
        } else {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_pozo_one, 8000, 4, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, 16, instance);
            }, 3000);
        }
    },

    labyrinth: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mesaje_laberinto_llave = ", " + mOptions.msgs.msgWaterLabyrinth0,
            mesaje_laberinto_one = ", " + mOptions.msgs.msgWaterLabyrinthOne,
            casillasRertono = [11, 17, 24, 32, 36],
            castigo = Math.floor(Math.random() * 5),
            mcasilla = casillasRertono[castigo],
            destino = 42 - mcasilla;
        if (mOptions.gamers[mOptions.jugadorActivo].llave) {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_laberinto_llave, 3000, 8, instance);
            mOptions.gamers[mOptions.jugadorActivo].llave = false;
            $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 1, false, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenFreely(mOptions.jugadorActivo, 1, instance);
            }, 3000);

        } else {
            mesaje_laberinto_one = mesaje_laberinto_one.replace('%1', mcasilla);
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_laberinto_one, 5000, 5, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, destino, instance);
            }, 3000);
        }
    },

    jail: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mesaje_carcel_llave = ", " + mOptions.msgs.msgJail0,
            mesaje_carcel_one = ", " + mOptions.msgs.msgJailOne,
            casillasRertono = [27, 34, 41],
            castigo = Math.floor(Math.random() * 3),
            mcasilla = casillasRertono[castigo],
            destino = 52 - mcasilla;
        if (mOptions.gamers[mOptions.jugadorActivo].llave) {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_carcel_llave, 3000, 8, instance);
            mOptions.gamers[mOptions.jugadorActivo].pocion = false;
            $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 1, false, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenFreely(mOptions.jugadorActivo, 1, instance);
            }, 4000);
        } else {
            mesaje_carcel_one = mesaje_carcel_one.replace('%1', mcasilla);
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_carcel_one, 7000, 6, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, destino, instance);
            }, 3000);
        }
    },

    death: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_muerto = ", " + mOptions.msgs.msgDeath,
            mensaje_muerte_pocion = ", " + mOptions.msgs.msgDeath0;
        if (mOptions.gamers[mOptions.jugadorActivo].pocion) {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mensaje_muerte_pocion, 3000, 9, instance);
            mOptions.gamers[mOptions.jugadorActivo].pocion = false;
            $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 2, false, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenFreely(mOptions.jugadorActivo, 1, instance);
            }, 4000);
        } else {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mensaje_muerto, 10000, 7, instance);
            setTimeout(function () {
                $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, 58, instance);
            }, 3000);
        }

    },

    winGame: function (instance) {
        $eXeOca.gameOver(0, instance);
    },

    fromGoose: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mesaje_tira = ", " + mOptions.msgs.msgRoolDice;
        mOptions.rebote = false;
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_tira, 5000, mOptions.jugadorActivo + 12, instance);
        $eXeOca.activeDice(instance);
    },

    getTarget: function (posicion, instance) {
        var mOptions = $eXeOca.options[instance],
            ocasdados = [2, 11, 22, 32, 39, 49, 59, 43, 25, 5, 14],
            sorpresas = [8, 17, 27, 35, 45, 54];
        $eXeOca.placePlayerTokensSkare(posicion, instance);
        if (mOptions.rebote && ocasdados.indexOf(posicion) != -1) {
            $eXeOca.fromGoose(instance);
        } else if (posicion == 62) {
            $eXeOca.winGame(instance);
        } else if (sorpresas.indexOf(posicion) != -1) {
            $eXeOca.showSurprise(instance);
        } else if (posicion == 2) {
            $eXeOca.goose(9, instance);
        } else if (posicion == 11) {
            $eXeOca.goose(11, instance);
        } else if (posicion == 22) {
            $eXeOca.goose(10, instance);
        } else if (posicion == 32) {
            $eXeOca.goose(7, instance);
        } else if (posicion == 39) {
            $eXeOca.goose(10, instance);
        } else if (posicion == 49) {
            $eXeOca.goose(10, instance);
        } else if (posicion == 59) {
            $eXeOca.goose(3, instance);
        } else if (posicion == 5) {
            $eXeOca.brigge(9, 1, instance);
        } else if (posicion == 14) {
            $eXeOca.brigge(9, -1, instance);
        } else if (posicion == 25) {
            $eXeOca.dice(18, 1, instance);
        } else if (posicion == 43) {
            $eXeOca.dice(18, -1, instance);
        } else if (posicion == 18) {
            $eXeOca.hostal(instance);
        } else if (posicion == 30) {
            $eXeOca.waterWell(instance);
        } else if (posicion == 41) {
            $eXeOca.labyrinth(instance);
        } else if (posicion == 51) {
            $eXeOca.jail(instance);
        } else if (posicion == 57) {
            $eXeOca.death(instance);
        } else if (posicion == 20 || posicion == 37) {
            $eXeOca.hospital(instance);
        } else {
            setTimeout(function () {
                $eXeOca.showGameQuestion(instance)
            }, 1000);
        }
        $eXeOca.loadGameBoard(instance);
        $eXeOca.sendScore(instance);
    },

    throwDice: function (instance) {
        var mOptions = $eXeOca.options[instance],
            posiciones = $eXeOca.randomArray(15, 5),
            valor = posiciones[posiciones.length - 1],
            image = $eXeOca.idevicePath + 'ocapt' + valor + '.png',
            contador = 0,
            vrayo = valor * mOptions.gamers[mOptions.jugadorActivo].rayo;
        if (mOptions.gamers[mOptions.jugadorActivo].rayo == 2) {
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + ", " + mOptions.msgs.msgDoubleSpeed, 5000, 10, instance);
            $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 3, false, instance);

        }
        mOptions.gamers[mOptions.jugadorActivo].rayo = 1;
        mOptions.valorDado = vrayo;
        mOptions.contadorDado = setInterval(function () {
            if (mOptions.gameStarted && contador < posiciones.length) {
                contador++;
                image = $eXeOca.idevicePath + 'ocapt' + posiciones[contador] + '.png';
                if (contador == posiciones.length - 1) {
                    clearInterval(mOptions.contadorDado);
                    $eXeOca.movePlayerToken(mOptions.jugadorActivo, vrayo, instance);
                    image = $eXeOca.idevicePath + 'ocapt' + valor + '.png';
                    $eXeOca.tirada++;
                }
                $('#ocaPuntosDado-' + instance).css({
                    'background': "url(" + image + ")",
                    'background-size': '100% 100%'
                });
            }
        }, 150);
    },

    changeBackpackIcons(jugadorActivo, icon, value, instance) {
        var img = "";
        if (icon == 1) {
            img = value ? 'ocallave1.png' : 'ocallave.png';
            img = $eXeOca.idevicePath + img;
            $('#ocaMochila-' + instance + ' > .ocaj' + jugadorActivo)
                .find('.oca-Llave').css({
                    'background-image': 'url(' + img + ')'
                });
        } else if (icon == 2) {
            img = value ? 'ocapocion1.png' : 'ocapocion.png';
            img = $eXeOca.idevicePath + img;
            $('#ocaMochila-' + instance + ' > .ocaj' + jugadorActivo)
                .find('.oca-Pocion').css({
                    'background-image': 'url(' + img + ')'
                });
        } else if (icon == 3) {
            img = value ? 'ocarayo1.png' : 'ocarayo.png';
            img = $eXeOca.idevicePath + img;
            $('#ocaMochila-' + instance + ' > .ocaj' + jugadorActivo)
                .find('.oca-Rayo').css({
                    'background-image': 'url(' + img + ')'
                });
        }
    },

    hospital: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.gamers[mOptions.jugadorActivo].vidas = 3;
        $('#ocaMochila-' + instance + ' > .ocaj' + mOptions.jugadorActivo).find('.oca-Vida').find('p').text(mOptions.gamers[mOptions.jugadorActivo].vidas);
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + ", " + mOptions.msgs.msgLostLives0, 3000, 16, instance);
        setTimeout(function () {
            $eXeOca.changePlayer(instance);
        }, 3000);
    },

    activeDice: function (instance) {
        var mOptions = $eXeOca.options[instance];
        $('#ocaFondoDado-' + instance).css('background-color', $eXeOca.colorsDado[mOptions.jugadorActivo]);
        $('#ocaClickDado-' + instance).show();
        if (mOptions.gamers[mOptions.jugadorActivo].casilla < 0) {
            //$eXeOca.placePlayerToken(mOptions.jugadorActivo, instance);
        }

        mOptions.moviendo = false;
    },

    showGameQuestion: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.activeCounter = true;
        mOptions.activeQuestion++;
        if (mOptions.activeQuestion >= mOptions.selectsGame.length) {
            mOptions.activeQuestion = 0;
        }
        mOptions.counter = $eXeOca.getTimeSeconds(mOptions.selectsGame[mOptions.activeQuestion].time);
        if (mOptions.selectsGame[mOptions.activeQuestion].type === 2) {
            var durationVideo = mOptions.selectsGame[mOptions.activeQuestion].fVideo - mOptions.selectsGame[mOptions.activeQuestion].iVideo;
            mOptions.counter += durationVideo;
        }
        $('#ocaGameContainer-' + instance).hide();
        $('#ocaGameQuestion-' + instance).show();
        $eXeOca.showQuestion(mOptions.activeQuestion, instance);
        mOptions.counterClock = setInterval(function () {
            if (mOptions.activeCounter) {
                mOptions.counter--;
                $eXeOca.updateTime(mOptions.counter, instance);
                $eXeOca.updateSoundVideo(instance);
                if (mOptions.counter <= 0) {
                    mOptions.activeCounter = false;
                    if (mOptions.showSolution) {
                        if (mOptions.selectsGame[mOptions.activeQuestion].typeSelect != 2) {
                            $eXeOca.drawSolution(instance);
                        } else {
                            $eXeOca.drawPhrase(mOptions.selectsGame[mOptions.activeQuestion].solutionQuestion, mOptions.selectsGame[mOptions.activeQuestion].quextion, 100, 1, false, instance)
                        }
                    }
                    clearInterval(mOptions.counterClock);
                    $eXeOca.stopVideo(instance);
                    var ts = mOptions.showSolution ? mOptions.timeShowSolution * 1000 : 3000;
                    setTimeout(function () {
                        $eXeOca.questionAnswer(false, instance);
                    }, ts);
                    return;
                }
            }
        }, 1000);
    },

    showGameMessage: function (mensaje, time, type, instance) {
        $('#ocaPMessage-' + instance).text(mensaje);
        $('#ocaMessage-' + instance).hide();
        $('#ocaMessage-' + instance).slideDown(100).delay(time).slideUp(100);
        var img = 'ocalanza.png'
        switch (type) {
            case 0:
                img = 'ocaoca.png';
                break;
            case 1:
                img = 'ocadado.png';
                break;
            case 2:
                img = 'ocapuente.png';
                break;
            case 3:
                img = 'ocaposada.png';
                break;

            case 4:
                img = 'ocapozo.png';
                break;

            case 5:
                img = 'ocalaberinto.png';
                break;
            case 6:
                img = 'ocacarcel.png';
                break;

            case 7:
                img = 'ocamuerte.png';
                break;

            case 8:
                img = 'ocallave1.png';
                break;

            case 9:
                img = 'ocapocion1.png';
                break;
            case 10:
                img = 'ocarayo1.png';
                break;
            case 11:
                img = 'ocavolver.png';
                break;
            case 12:
                img = 'ocafr.png';
                break;
            case 13:
                img = 'ocafb.png';
                break;
            case 14:
                img = 'ocafg.png';
                break;
            case 15:
                img = 'ocafy.png';
                break;
            case 16:
                img = 'ocahospital.png';
                break;
            default:
                break;
        }
        img = $eXeOca.idevicePath + img;
        $('#ocaMessage-' + instance).find('img').attr('src', img);
    },

    showSurprise: function (instance) {
        var sorpresas = [0, 1, 1, 2, 3, 4],
            sorpresa = Math.floor(Math.random() * sorpresas.length);
        sorpresa = sorpresas[sorpresa];
        switch (sorpresa) {
            case 0:
                $eXeOca.newDiceRoll(instance);
                break;
            case 1:
                $eXeOca.goBackPreviousBox(instance);
                break;
            case 2:
                $eXeOca.getKey(instance);
                break;
            case 3:
                $eXeOca.faster(instance);
                break;
            case 4:
                $eXeOca.magicPotion(instance);
                break;
            case 5:
                break;

            default:
                break;
        }
    },

    newDiceRoll: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_tira = ", " + mOptions.msgs.msgSurprise0,
            nextGamer = mOptions.jugadorActivo + 1 >= mOptions.numeroJugadores ? 12 : 12 + mOptions.jugadorActivo + 1;
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mensaje_tira, 5000, nextGamer, instance);
        $eXeOca.activeDice(instance);
    },

    goBackPreviousBox: function (instance) {
        var mOptions = $eXeOca.options[instance],
            castigo = Math.floor(Math.random() * 5) + 5,
            mensaje_tira = ", " + mOptions.msgs.msgSurprise1,
            mensaje_tira = mensaje_tira.replace('%1', castigo)
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mensaje_tira, 5000, 11, instance);
        setTimeout(function () {
            $eXeOca.movePlayerTokenBack(mOptions.jugadorActivo, castigo, instance);
        }, 5000)
    },

    getKey: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_llave = ", " + mOptions.msgs.msgSurprise2;
        mOptions.gamers[mOptions.jugadorActivo].llave = true;
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mensaje_llave, 5000, 8, instance);
        $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 1, true, instance);
        setTimeout(function () {
            $eXeOca.changePlayer(instance);
        }, 5000);
    },

    faster: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_llave = ", " + mOptions.msgs.msgSurprise3;
        mOptions.gamers[mOptions.jugadorActivo].rayo = 2;
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mensaje_llave, 5000, 10, instance);
        $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 3, true, instance);
        setTimeout(function () {
            $eXeOca.changePlayer(instance);
        }, 5000);
    },

    magicPotion: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_llave = ", " + mOptions.msgs.msgSurprise4;
        mOptions.gamers[mOptions.jugadorActivo].pocion = true;
        $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mensaje_llave, 5000, 9, instance);
        $eXeOca.changeBackpackIcons(mOptions.jugadorActivo, 2, true, instance);
        setTimeout(function () {
            $eXeOca.changePlayer(instance);
        }, 5000);
    },

    goose: function (dado, instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_oca = mOptions.msgs.msgOcaOca;
        mOptions.direccion = 1;
        mOptions.rebote = true;
        $eXeOca.showGameMessage(mensaje_oca, 5000, 0, instance);
        setTimeout(function () {
            $eXeOca.movePlayerToken(mOptions.jugadorActivo, dado, instance);

        }, 5000);

    },

    brigge: function (dado, direccion, instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_puente = mOptions.msgs.msgsBridge;
        mOptions.rebote = true;
        mOptions.direccion = direccion;
        $eXeOca.showGameMessage(mensaje_puente, 5000, 2, instance);
        var move = direccion == 1 ? $eXeOca.movePlayerToken : $eXeOca.movePlayerTokenBack;
        setTimeout(function () {
            move(mOptions.jugadorActivo, dado, instance);
        }, 3000);

    },

    dice: function (dado, direccion, instance) {
        var mOptions = $eXeOca.options[instance],
            mensaje_dado = mOptions.msgs.msgsDice;
        mOptions.rebote = true;
        mOptions.direccion = direccion;
        $eXeOca.showGameMessage(mensaje_dado, 5000, 1, instance);
        var move = direccion == 1 ? $eXeOca.movePlayerToken : $eXeOca.movePlayerTokenBack;
        setTimeout(function () {
            move(mOptions.jugadorActivo, dado, instance)
        }, 2000);
    },


    loadGameBoard: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.kw = $('#ocaTablero-' + instance).width() / 668;
        $eXeOca.loadPositions(mOptions.kw, instance);
        $('#ocaTablero-' + instance).find('.oca-Ficha').hide();
        for (var i = 0; i < mOptions.numeroJugadores; i++) {
            $eXeOca.placePlayerToken(i, instance);
        }
        $eXeOca.placeElements(instance);
    },

    loadPositions: function (kw, instance) {
        var mOptions = $eXeOca.options[instance],
            punto1 = {
                'x': Math.round(30 * kw),
                'y': Math.round(567 * kw)
            },
            punto2 = {
                'x': Math.round(30 * kw),
                'y': Math.round(603 * kw)
            },
            punto3 = {
                'x': Math.round(66 * kw),
                'y': Math.round(567 * kw)
            },
            punto4 = {
                'x': Math.round(66 * kw),
                'y': Math.round(603 * kw)
            }
        mOptions.numeroCasillas = 63;
        mOptions.wt = Math.round(32 * kw);
        mOptions.anchoNumero = Math.round(16 * kw);
        mOptions.casillaSalida = {
            'x': Math.round(121 * kw),
            'y': Math.round(582 * kw)
        };
        mOptions.casillaIniciales = [punto1, punto2, punto3, punto4];
        mOptions.pT = [];
        for (var i = 0; i < mOptions.numeroCasillas; i++) {
            var posicion = new Object();
            mOptions.pT.push(posicion);
            mOptions.pT[i].x = 0;
            mOptions.pT[i].y = 0;
            mOptions.pT[i].w = mOptions.wt;
            mOptions.pT[i].y = mOptions.wt;
        }
        mOptions.pT[0].x = 170;
        mOptions.pT[0].y = 586;
        mOptions.pT[1].x = 242;
        mOptions.pT[1].y = 586;
        mOptions.pT[2].x = 296;
        mOptions.pT[2].y = 586;
        mOptions.pT[3].x = 350;
        mOptions.pT[3].y = 586;
        mOptions.pT[4].x = 404;
        mOptions.pT[4].y = 586;
        mOptions.pT[5].x = 456;
        mOptions.pT[5].y = 586;
        mOptions.pT[6].x = 505;
        mOptions.pT[6].y = 586;
        mOptions.pT[7].x = 564;
        mOptions.pT[7].y = 598;
        mOptions.pT[8].x = 598;
        mOptions.pT[8].y = 562;
        mOptions.pT[9].x = 588;
        mOptions.pT[9].y = 502;
        mOptions.pT[10].x = 588;
        mOptions.pT[10].y = 453;
        mOptions.pT[11].x = 588;
        mOptions.pT[11].y = 400;
        mOptions.pT[12].x = 586;
        mOptions.pT[12].y = 344;
        mOptions.pT[13].x = 588;
        mOptions.pT[13].y = 291;
        mOptions.pT[14].x = 588;
        mOptions.pT[14].y = 238;
        mOptions.pT[15].x = 588;
        mOptions.pT[15].y = 185;
        mOptions.pT[16].x = 588;
        mOptions.pT[16].y = 135;
        mOptions.pT[17].x = 596;
        mOptions.pT[17].y = 80;
        mOptions.pT[18].x = 558;
        mOptions.pT[18].y = 47;
        mOptions.pT[19].x = 508;
        mOptions.pT[19].y = 50;
        mOptions.pT[20].x = 456;
        mOptions.pT[20].y = 50;
        mOptions.pT[21].x = 401;
        mOptions.pT[21].y = 50;
        mOptions.pT[22].x = 346;
        mOptions.pT[22].y = 50;
        mOptions.pT[23].x = 296;
        mOptions.pT[23].y = 50;
        mOptions.pT[24].x = 238;
        mOptions.pT[24].y = 50;
        mOptions.pT[25].x = 187;
        mOptions.pT[25].y = 50;
        mOptions.pT[26].x = 138;
        mOptions.pT[26].y = 50;
        mOptions.pT[27].x = 80;
        mOptions.pT[27].y = 37;
        mOptions.pT[28].x = 40;
        mOptions.pT[28].y = 78;
        mOptions.pT[29].x = 52;
        mOptions.pT[29].y = 136;
        mOptions.pT[30].x = 52;
        mOptions.pT[30].y = 186;
        mOptions.pT[31].x = 52;
        mOptions.pT[31].y = 238;
        mOptions.pT[32].x = 52;
        mOptions.pT[32].y = 292;
        mOptions.pT[33].x = 50;
        mOptions.pT[33].y = 346;
        mOptions.pT[34].x = 50;
        mOptions.pT[34].y = 398;
        mOptions.pT[35].x = 38;
        mOptions.pT[35].y = 456;
        mOptions.pT[36].x = 82;
        mOptions.pT[36].y = 488;
        mOptions.pT[37].x = 140;
        mOptions.pT[37].y = 484;
        mOptions.pT[38].x = 188;
        mOptions.pT[38].y = 484;
        mOptions.pT[39].x = 240;
        mOptions.pT[39].y = 484;
        mOptions.pT[40].x = 294;
        mOptions.pT[40].y = 484;
        mOptions.pT[41].x = 348;
        mOptions.pT[41].y = 484;
        mOptions.pT[42].x = 398;
        mOptions.pT[42].y = 484;
        mOptions.pT[43].x = 458;
        mOptions.pT[43].y = 490;
        mOptions.pT[44].x = 496;
        mOptions.pT[44].y = 456;
        mOptions.pT[45].x = 480;
        mOptions.pT[45].y = 395;
        mOptions.pT[46].x = 480;
        mOptions.pT[46].y = 346;
        mOptions.pT[47].x = 480;
        mOptions.pT[47].y = 294;
        mOptions.pT[48].x = 480;
        mOptions.pT[48].y = 244;
        mOptions.pT[49].x = 496;
        mOptions.pT[49].y = 182;
        mOptions.pT[50].x = 456;
        mOptions.pT[50].y = 140;
        mOptions.pT[51].x = 400;
        mOptions.pT[51].y = 158;
        mOptions.pT[52].x = 350;
        mOptions.pT[52].y = 158;
        mOptions.pT[53].x = 294;
        mOptions.pT[53].y = 158;
        mOptions.pT[54].x = 245;
        mOptions.pT[54].y = 158;
        mOptions.pT[55].x = 186;
        mOptions.pT[55].y = 146;
        mOptions.pT[56].x = 142;
        mOptions.pT[56].y = 180;
        mOptions.pT[57].x = 156;
        mOptions.pT[57].y = 240;
        mOptions.pT[58].x = 156;
        mOptions.pT[58].y = 291;
        mOptions.pT[59].x = 144;
        mOptions.pT[59].y = 354;
        mOptions.pT[60].x = 184;
        mOptions.pT[60].y = 388;
        mOptions.pT[61].x = 248;
        mOptions.pT[61].y = 374;
        mOptions.pT[62].x = 331;
        mOptions.pT[62].y = 331;
        for (var i = 0; i < mOptions.pT.length; i++) {
            mOptions.pT[i].x = Math.round(mOptions.pT[i].x * kw);
            mOptions.pT[i].y = Math.round(mOptions.pT[i].y * kw);
        }
    },

    placePlayerTokensSkare: function (casilla, instance) {
        var mOptions = $eXeOca.options[instance],
            listaOcupantes = [];
        if (mOptions.numeroJugadores == 1) return;

        for (var i = 0; i < mOptions.gamers.length; i++) {
            if (mOptions.gamers[i].casilla == casilla) {
                listaOcupantes.push(i);
            }
        }
        $eXeOca.setPositionPlayers(casilla, listaOcupantes, instance);
    },

    setPositionPlayers: function (casilla, listaOcupantes, instance) {
        var mOptions = $eXeOca.options[instance],
            posiconesHorizontales = [0, 1, 2, 3, 4, 5, 6, 37, 38, 39, 40, 41, 42, 50, 51, 52, 53, 54, 19, 20, 21, 22, 23, 24, 25, 26, 51, 62, 61, 7, 8, 43, 44, 35, 36, 59, 60, 18],
            posiconesVerticales = [9, 10, 11, 12, 13, 14, 15, 16, 17, 29, 30, 31, 32, 33, 34, 35, 45, 46, 46, 47, 48, 57, 58, 17, 49, 10, 35, 27, 28, 55, 56];
        if (posiconesVerticales.indexOf(casilla) != -1) {
            for (var i = 0; i < listaOcupantes.length; i++) {
                var j = listaOcupantes[i],
                    sposicion = mOptions.gamers[j].casilla,
                    nposX = mOptions.pT[sposicion].x,
                    nposY = mOptions.pT[sposicion].y,
                    nposW = mOptions.wt,
                    nposH = mOptions.wt;
                if (i == 0) {
                    if (listaOcupantes.length > 1) {
                        nposX = nposX - nposW / 2;
                    }
                    if (listaOcupantes.length > 2) {
                        nposY = nposY - nposH / 2;
                    }
                } else if (i == 1) {
                    if (listaOcupantes.length > 2) {
                        nposY = nposY - nposH / 2;
                    }
                    nposX = nposX + nposW / 2;
                } else if (i == 2) {
                    if (listaOcupantes.length == 4) {
                        nposX = nposX - nposW / 2;
                    }
                    nposY = nposY + nposH / 2;
                } else if (i == 3) {
                    nposX = nposX + nposW / 2;
                    nposY = nposY + nposH / 2;
                }
                nposX = Math.round(nposX);
                nposY = Math.round(nposY);
                $eXeOca.movePlayerToken(j, nposX, nposY, instance);
            }
        } else if (posiconesHorizontales.indexOf(casilla) != -1) {
            for (var i = 0; i < listaOcupantes.length; i++) {
                var j = listaOcupantes[i],
                    sposicion = mOptions.gamers[j].casilla,
                    nposX = mOptions.pT[sposicion].x,
                    nposY = mOptions.pT[sposicion].y,
                    nposW = mOptions.wt,
                    nposH = mOptions.wt;
                if (i == 0) {
                    if (listaOcupantes.length > 1) {
                        nposY = nposY + nposH / 2;
                    }
                    if (listaOcupantes.length > 2) {
                        nposX = nposX + nposW / 2;
                    }
                } else if (i == 1) {
                    if (listaOcupantes.length > 2) {
                        nposX = nposX + nposW / 2;
                    }
                    nposY = nposY - nposH / 2;
                } else if (i == 2) {
                    if (listaOcupantes.length == 4) {
                        nposY = nposY + nposH / 2;
                    }
                    nposX = nposX - nposW / 2;

                } else if (i == 3) {
                    nposX = nposX - nposW / 2;
                    nposY = nposY - nposH / 2;
                }
                $eXeOca.movePlayerToken(j, nposX, nposY, instance);
            }
        }
    },

    loadDataGame: function (data, imgsLink, audioLink) {
        var json = {},
            mOptions = {},
            textoJ = data.text();
        if (textoJ.indexOf('Oca') != -1) {
            mOptions = $eXeOca.isJsonString(textoJ);
            mOptions = $eXeOca.Decrypt1(mOptions);
        } else {
            json = $eXeOca.Decrypt(textoJ);
            mOptions = $eXeOca.isJsonString(json);
        }
        mOptions.gameOver = false;
        mOptions.scoreGame = 0;
        mOptions.velocidad = 300;
        mOptions.numeroJugadores = 1;
        for (var i = 0; i < mOptions.selectsGame.length; i++) {
            mOptions.selectsGame[i].audio = typeof mOptions.selectsGame[i].audio == 'undefined' ? '' : mOptions.selectsGame[i].audio
        }
        imgsLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.selectsGame.length) {
                mOptions.selectsGame[iq].url = $(this).prop('href');
                if (mOptions.selectsGame[iq].url.length < 10 && mOptions.selectsGame[iq].type == 1) {
                    mOptions.selectsGame[iq].url = "";
                }
            }
        });
        audioLink.each(function () {
            var iq = parseInt($(this).text());
            if (!isNaN(iq) && iq < mOptions.selectsGame.length) {
                mOptions.selectsGame[iq].audio = $(this).attr('href');
                if (mOptions.selectsGame[iq].audio.length < 4) {
                    mOptions.selectsGame[iq].audio = "";
                }
            }
        });
        var gamers = [],
            gamer = new Object();
        gamer.name = "";
        gamer.score = 0;
        gamer.state = 0;
        gamer.casilla = -1;
        gamer.casillaanterior = -1;
        gamer.number = 0;
        gamer.posada = 0;
        gamer.pozo = 0;
        gamer.laberinto = 0;
        gamer.carcel = 0;
        gamer.llave = false;
        gamer.rayo = 1;
        gamer.pocion = false;
        gamer.vidas = 3;
        gamers.push(gamer);
        mOptions.gamers = gamers;
        mOptions.activeGamer = 0;
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        mOptions.activeQuestion = -1;
        mOptions.scoreTotal = 0;
        for (var i = 0; i < mOptions.selectsGame.length; i++) {
            if (mOptions.customScore) {
                mOptions.scoreTotal += mOptions.selectsGame[i].customScore;
            } else {
                mOptions.selectsGame[i].customScore = 1
                mOptions.scoreTotal += mOptions.selectsGame[i].customScore
            }
        }
        mOptions.selectsGame = mOptions.optionsRamdon ? $eXeOca.shuffleAds(mOptions.selectsGame) : mOptions.selectsGame;
        mOptions.numberQuestions = mOptions.selectsGame.length;
        return mOptions;
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

    shuffleAds: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    },

    youTubeReady: function () {
        for (var i = 0; i < $eXeOca.options.length; i++) {
            var mOptions = $eXeOca.options[i];
            mOptions.player = new YT.Player('ocaVideo-' + i, {
                width: '100%',
                height: '100%',
                videoId: '',
                playerVars: {
                    'color': 'white',
                    'autoplay': 0,
                    'controls': 0
                }
            });
        }
    },

    youTubeReadyOne: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.player = new YT.Player('ocaVideo-' + instance, {
            width: '100%',
            height: '100%',
            videoId: '',
            playerVars: {
                'color': 'white',
                'autoplay': 0,
                'controls': 0
            }
        });
    },

    loadYoutubeApi: function () {
        onYouTubeIframeAPIReady = $eXeOca.youTubeReady;
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    },

    updateTimerDisplay: function () {},
    updateProgressBar: function () {},
    onPlayerError: function (event) {},
    startVideo: function (id, start, end, instance) {
        var mOptions = $eXeOca.options[instance];
        if (mOptions.player) {
            if (typeof mOptions.player.loadVideoById == "function") {
                mOptions.player.loadVideoById({
                    'videoId': id,
                    'startSeconds': start,
                    'endSeconds': end
                });
            }
        }
    },

    playVideo: function (instance) {
        var mOptions = $eXeOca.options[instance];
        if (mOptions.player) {
            if (typeof mOptions.player.playVideo == "function") {
                mOptions.player.playVideo();
            }
        }
    },

    stopVideo: function (instance) {
        var mOptions = $eXeOca.options[instance];
        if (mOptions.player) {
            if (typeof mOptions.player.pauseVideo == "function") {
                mOptions.player.pauseVideo();
            }
        }
    },

    muteVideo: function (mute, instance) {
        var mOptions = $eXeOca.options[instance];
        if (mOptions.player) {
            if (mute) {
                if (typeof mOptions.player.mute == "function") {
                    mOptions.player.mute();
                }
            } else {
                if (typeof mOptions.player.unMute == "function") {
                    mOptions.player.unMute();
                }
            }
        }
    },

    placeElements: function (instance) {
        var anchoTablero = $('#ocaTablero-' + instance).width(),
            anchoIdevice = $('#ocaGameContainer-' + instance).width();
        if (anchoIdevice < 750) {
            $('#ocaMochila-' + instance).css({
                'min-width': anchoTablero + 'px',
                'width': anchoTablero + 'px',
                'justify-content': 'space-around',
                'margin-left': '0'
            });
            $('#ocaGameContainer-' + instance).css({
                'flex-direction': 'column',
                'align-items': 'center'
            });
        } else {
            $('#ocaGameContainer-' + instance).css({
                'flex-direction': 'row',
                'align-items': 'flex-start'
            });
            $('#ocaMochila-' + instance).css({
                'min-width': '10em',
                'width': '10em',
                'justify-content': 'flex-start',
                'margin-left': '0.5em'
            });
        }
        $('.oca-NumberGamers').find('p').css({
            'font-size': $eXeOca.getSize(1, instance),
            'line-height': $eXeOca.getSize(1.5, instance),
            'height': $eXeOca.getSize(1.5, instance),

        });
        $('.oca-NumberGamers').css({
            'padding-bottom': $eXeOca.getSize(1.5, instance),
            'padding': $eXeOca.getSize(1.5, instance),

        });
        var fsize = parseFloat($eXeOca.getSize(1.1, instance), 10) < 0.7 ? '.7rem' : $eXeOca.getSize(1.1, instance),
            fheight = "1.8rem",
            fradiuos = "0.25rem",
            fleft = "0.4rem",
            fpadding = "0.5rem";
        if (fsize == ".7rem") {
            fheight = "1.1rem";
            fradiuos = "0.125rem";
            fleft = "0.3rem";
            fpadding = "0.35rem";
        }

        $('.oca-NameGamer').css({
            'font-size': fsize,
            'height': fheight,
            'line-height': fheight,
            'border-radius': fradiuos
        });
        $('.oca-StartGame').css({
            'font-size': fsize,
            'padding': fpadding
        });
        $('.oca-FichaJugador').css({
            'width': fheight,
            'height': fheight,
        });
        $('.oca-MessageImage').css({
            'width': $eXeOca.getSize(3.5, instance),
            'height': $eXeOca.getSize(3.5, instance),
            'margin-left': $eXeOca.getSize(1, instance)
        });
        $('.oca-NumberIcon').css({
            'width': fheight,
            'height': fheight,
            'margin-left': fleft
        });
        $('.oca-NumberGamers').find('p').css({
            'font-size': fsize,
            'line-height': fheight,
            'height': fheight,
        });
        $('.oca-NumberGamers').css({
            'padding-bottom': fheight,

        });
        $('.oca-NameGamer').css({
            'font-size': fsize,
            'height': fheight,
            'line-height': fheight,
            'border-radius': fradiuos
        });

        var tamanoFont = parseFloat($eXeOca.getSize(1.2, instance), 10) < 0.8 ? '.8rem' : $eXeOca.getSize(1.1, instance);
        $('.oca-Message').find('p').css({
            'font-size': tamanoFont,
            'padding': $eXeOca.getSize(0.3, instance)
        });
        $('.oca-MessageModalTexto').find('p').css({
            'font-size': tamanoFont,
        });
        $('.oca-AcceptButton').css({
            'width': $eXeOca.getSize(1.7, instance),
            'height': $eXeOca.getSize(1.7, instance),
        });
        $('.oca-CancelButton').css({
            'width': $eXeOca.getSize(1.7, instance),
            'height': $eXeOca.getSize(1.7, instance),
        });
        $('.oca-PTiempo').css({
            'height': $eXeOca.getSize(1.5, instance),
            'line-height': $eXeOca.getSize(1.5, instance),
        });

    },

    getSize: function (size, instance) {
        var facTamano = $('#ocaTabllero-' + instance).width() >= 550 ? 1 : $('#ocaTablero-' + instance).width() / 550,
            fs = parseFloat(size * facTamano, 10).toFixed(2);
        return fs + 'rem';
    },

    addEvents: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.kw = $('#ocaTablero-' + instance).width() / 668;
        $eXeOca.loadGameBoard(instance);
        mOptions.respuesta = '';
        window.addEventListener('unload', function () {
            $eXeOca.endScorm();
        });

        window.addEventListener('resize', function () {
            $eXeOca.refreshImageActive(instance);
            $eXeOca.loadGameBoard(instance);
        });
        $('#ocaClickDado-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $(this).hide();
            $eXeOca.throwDice(instance);
        });
        if (mOptions.itinerary.showCodeAccess) {
            $('#ocaMessageModalDiv-' + instance).show();
            $('#ocaMessageModal-' + instance).show();
            $('#ocaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('ocaCodeAccessDiv-' + instance).show();
            $('#ocaSelectsGamers-' + instance).hide();
            $('#ocaMessageModalTexto-' + instance).hide();
            $('#ocaAnswerDiv-' + instance).hide();
        }
        /* pruebas */
        $('.oca-prueba').on('click touchstart', function (e) {
            e.preventDefault();
            var num = parseInt($(this).text()),
                valor = num < 7 ? num : 6,
                image = $eXeOca.idevicePath + 'ocapt' + valor + '.png';
            $('#ocaPuntosDado-' + instance).css({
                'background': "url(" + image + ")",
                'background-size': 'cover'
            });
            $('#ocaClickDado-' + instance).hide();
            mOptions.rebote = false;
            mOptions.valorDado = num;
            $eXeOca.movePlayerToken(mOptions.jugadorActivo, num, instance);

        });
        $('.oca-sorpresa').on('click touchstart', function (e) {
            e.preventDefault();
            var sorpresa = parseInt($(this).text());
            switch (sorpresa) {
                case 0:
                    $eXeOca.newDiceRoll(instance);
                    break;
                case 1:
                    $eXeOca.goBackPreviousBox(instance);
                    break;
                case 2:
                    $eXeOca.getKey(instance);
                    break;
                case 3:
                    $eXeOca.faster(instance);
                    break;
                case 4:
                    $eXeOca.magicPotion(instance);
                    break;
                case 5:
                    break;

                default:
                    break;
            }
        });
        $('#ocaLinkReboot-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            if (!mOptions.gameStarted && !mOptions.gameOver) {
                return
            }
            $('#ocaMessage-' + instance).hide();
            $('#ocaMessageModalDiv-' + instance).show();
            $('#ocaMessageModal-' + instance).show();
            $('#ocaMessageModalTexto-' + instance).css('display', 'flex');
            $('#ocaMessageModalTexto-' + instance).show();
            $eXeOca.loadGameBoard(instance);
        });
        $('#ocaMessageAceptar-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            mOptions.kw = $('#ocaTablero-' + instance).width() / 668;
            $eXeOca.rebootGame(instance);
            $('#ocaMessageModalDiv-' + instance).hide();
            $('#ocaMessageModal-' + instance).hide();
            $eXeOca.loadGameBoard(instance);

        });
        $('#ocaMessageCancelar-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#ocaMessageModalDiv-' + instance).hide();
            $('#ocaMessageModal-' + instance).hide();
        });
        $('#ocaNameGamers-' + instance).find('.oca-Jugador').hide();
        $('#ocaNameGamers-' + instance).find('.oca-Jugador').first().show();
        $('#ocaNumberGamers-' + instance).on('click touchstart', '.oca-NumberIcon', function (e) {
            e.preventDefault();
            var number = $(this).data('number');
            $('#ocaNameGamers-' + instance).find('.oca-Jugador').hide();
            $('#ocaNameGamers-' + instance).find('.oca-Jugador').each(function (i) {
                if (i < number) $(this).show();
            });
            $('#ocaNumberGamers-' + instance).find('.oca-NumberIcon').each(function (i) {
                $(this).find('img').attr('src', $eXeOca.idevicePath + 'ocacb' + (i + 1) + '.png');
            });
            $(this).find('img').attr('src', $eXeOca.idevicePath + 'ocacr' + number + '.png')
            mOptions.numeroJugadores = number;
        });
        $('videoocaGamerOver-' + instance).css('display', 'flex');
        $('#ocaLinkMaximize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#ocaGameContainer-' + instance).show()
            $('#ocaGameMinimize-' + instance).hide();
            $eXeOca.refreshImageActive(instance);
            $eXeOca.loadGameBoard(instance);
        });
        $('#ocaLinkMinimize-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $('#ocaGameContainer-' + instance).hide();
            $('#ocaGameMinimize-' + instance).css('visibility', 'visible').show();
        });
        $('#ocaCodeAccessDiv-' + instance).hide();
        $('#ocaVideo-' + instance).hide();
        $('#ocaImagen-' + instance).hide();
        $('#ocaCursor-' + instance).hide();
        $('#ocaCover-' + instance).show();
        $('#ocaAnswerDiv-' + instance).hide();
        $('#ocaCodeAccessButton-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeOca.enterCodeAccess(instance);
        });
        $('#ocaCodeAccessE-' + instance).on("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                $eXeOca.enterCodeAccess(instance);
                return false;
            }
            return true;
        });
        $('#ocaBtnMoveOn-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeOca.showGameQuestion(instance)
        });
        $('#ocaBtnReply-' + instance).on('click', function (e) {
            e.preventDefault();
            $eXeOca.answerQuestion(instance);
        });
        $('#ocaEdAnswer-' + instance).on("keydown", function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                $eXeOca.answerQuestion(instance);
                return false;
            }
            return true;
        });
        mOptions.livesLeft = mOptions.numberLives;
        $('#ocaStartGame-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeOca.startGame(instance);
        });
        $('#ocaOptionsDiv-' + instance).find('.oca-Options').on('click', function (e) {
            e.preventDefault();
            $eXeOca.changeQuextion(instance, this);
        })
        $('#ocaLinkFullScreen-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            var element = document.getElementById('ocaMainContainer-' + instance);
            $eXeOca.toggleFullscreen(element, instance);
        });
        $('#ocaInstructions-' + instance).text(mOptions.instructions);
        $('#ocaBottonContainer-' + instance).addClass('oca-BottonContainerDivEnd');
        if (mOptions.itinerary.showCodeAccess) {
            $('#ocaAnswerDiv-' + instance).hide();
            $('#ocaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#ocaMesajeAccesCodeE-' + instance).text(mOptions.itinerary.messageCodeAccess);
            $('#ocaCodeAccessDiv-' + instance).show();
        }
        $('#ocaInstruction-' + instance).text(mOptions.instructions);
        $('#ocaSendScore-' + instance).attr('value', mOptions.textButtonScorm);
        $('#ocaSendScore-' + instance).hide();
        if (mOptions.isScorm > 0) {
            $eXeOca.updateScorm($eXeOca.previousScore, mOptions.repeatActivity, instance);
        }
        document.title = mOptions.title;
        $('meta[name=author]').attr('content', mOptions.author);
        $('#ocaButtonAnswer-' + instance).on('click touchstart', function (e) {
            e.preventDefault();
            $eXeOca.answerQuestion(instance);
        });
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                $eXeOca.changeBackpackIcons(i, j, false, instance);
            }
        }
        $('#ocaStartGame-' + i).text(mOptions.msgs.msgStartGame);
        $('#ocaCodeAccessE-' + i).prop('readonly', false);
        $('#ocaLinkAudio-' + instance).on('click', function (e) {
            e.preventDefault();
            var audio = mOptions.selectsGame[mOptions.activeQuestion].audio;
            $eXeOca.stopSound(instance);
            $eXeOca.playSound(audio, instance);
        });
    },

    changeQuextion: function (instance, button) {
        var mOptions = $eXeOca.options[instance];
        var numberButton = parseInt($(button).data("number")),
            letters = 'ABCD',
            letter = letters[numberButton],
            type = false;

        if (mOptions.respuesta.indexOf(letter) === -1) {
            mOptions.respuesta = mOptions.respuesta + letter;
            type = true;
        } else {
            mOptions.respuesta = mOptions.respuesta.replace(letter, '');
        }
        var bordeColors = [$eXeOca.borderColors.red, $eXeOca.borderColors.blue, $eXeOca.borderColors.green, $eXeOca.borderColors.yellow],
            css = {
                'border-size': 1,
                'border-color': bordeColors[numberButton],
                'background-color': "transparent",
                'cursor': 'default',
                'color': $eXeOca.colors.black
            }
        if (type) {
            css = {
                'border-size': 1,
                'border-color': bordeColors[numberButton],
                'background-color': bordeColors[numberButton],
                'cursor': 'pointer',
                'color': '#ffffff'
            }
        }
        $(button).css(css);
        $('#ocaAnswers-' + instance + ' .oca-AnswersOptions').remove();
        for (var i = 0; i < mOptions.respuesta.length; i++) {
            if (mOptions.respuesta[i] === 'A') {
                $('#ocaAnswers-' + instance).append('<div class="oca-AnswersOptions oca-Answer1"></div>');

            } else if (mOptions.respuesta[i] === 'B') {
                $('#ocaAnswers-' + instance).append('<div class="oca-AnswersOptions oca-Answer2"></div>');

            } else if (mOptions.respuesta[i] === 'C') {
                $('#ocaAnswers-' + instance).append('<div class="oca-AnswersOptions oca-Answer3"></div>');

            } else if (mOptions.respuesta[i] === 'D') {
                $('#ocaAnswers-' + instance).append('<div class="oca-AnswersOptions oca-Answer4"></div>');
            }
        }
        $('#ocaNameGamers-' + instance).find('input').eq(0).focus();
    },

    refreshImageActive: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            author = '',
            alt = '';
        if (mOptions.gameOver) {
            return;
        }
        if (typeof mQuextion == "undefined") {
            return;
        }
        if (mQuextion.type === 1) {
            $('#ocaImagen-' + instance).attr('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = mOptions.msgs.msgNoImage;
                        $('#ocaAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeOca.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeOca.drawImage(this, mData);
                        $('#ocaImagen-' + instance).show();
                        $('#ocaCover-' + instance).hide();
                        alt = mQuextion.alt;
                        author = mQuextion.author;
                        $('#ocaImagen-' + instance).prop('alt', alt);
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#ocaCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            $('#ocaCursor-' + instance).show();
                        }
                    }
                    $eXeOca.showMessage(0, author, instance);
                });
            $('#ocaImagen-' + instance).attr('alt', mQuextion.alt);
        }
    },

    enterCodeAccess: function (instance) {
        var mOptions = $eXeOca.options[instance];
        if (mOptions.itinerary.codeAccess === $('#ocaCodeAccessE-' + instance).val()) {
            $('#ocaSelectsGamers-' + instance).show();
            $('#ocaMessageModal-' + instance).hide();
            $('#ocaCodeAccessDiv-' + instance).hide();
            $('#ocaAnswerDiv-' + instance).show();
            $eXeOca.loadGameBoard(instance);
        } else {
            $('#ocaMesajeAccesCodeE-' + instance).fadeOut(300).fadeIn(200).fadeOut(300).fadeIn(200);
            $('#ocaCodeAccessE-' + instance).val('');
        }
    },

    updateSoundVideo: function (instance) {
        var mOptions = $eXeOca.options[instance];
        if (mOptions.activeSilent) {
            if (mOptions.player && typeof mOptions.player.getCurrentTime === "function") {
                var time = Math.round(mOptions.player.getCurrentTime());
                if (time == mOptions.question.silentVideo) {
                    mOptions.player.mute(instance);
                } else if (time == mOptions.endSilent) {
                    mOptions.player.unMute(instance);
                }
            }
        }
    },

    updateTime: function (tiempo, instance) {
        var mTime = $eXeOca.getTimeToString(tiempo);
        $('#ocaPTime-' + instance).text(mTime);
    },

    updateTimeGame(time, instance) {
        var mTime = $eXeOca.getTimeToString(time);
        $('#ocaTiempo-' + instance).text(mTime);
    },

    getTimeToString: function (iTime) {
        var mMinutes = parseInt(iTime / 60) % 60;
        var mSeconds = iTime % 60;
        return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
    },

    gameOver: function (type, instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.gameStarted = false;
        mOptions.gameActived = false;
        clearInterval(mOptions.relojJuego);
        $('#ocaVideo-' + instance).hide();
        $eXeOca.startVideo('', 0, 0, instance);
        $eXeOca.stopVideo(instance)
        $('#ocaImagen-' + instance).hide();
        $('#ocaEText-' + instance).hide();
        $('#ocaCursor-' + instance).hide();
        $('#ocaCover-' + instance).hide();
        $eXeOca.clearQuestions(instance);
        $eXeOca.updateTime(0, instance);
        $('#ocaStartGame-' + instance).text(mOptions.msgs.msgNewGame);
        $('#ocaAnswerDiv-' + instance).hide();
        $('#ocaWordDiv-' + instance).hide();
        mOptions.gameOver = true;
        $('#ocaMessage-' + instance).hide();
        $('#ocaMessageModalDiv-' + instance).show();
        $('#ocaMessageModal-' + instance).show();
        $('#ocaMessageModalTexto-' + instance).css('display', 'flex');
        $('#ocaMessageModalTexto-' + instance).show();
        var winner = mOptions.msgs.msgsWinner.replace('%1', mOptions.gamers[mOptions.jugadorActivo].name);
        $('#ocaPMessageModal-' + instance).text(winner);
        $('#ocaDado-' + instance).hide();
        if (mOptions.itinerary.showClue) {
            $eXeOca.showGameMessage(mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame, 35000, 0, instance);
        } else {
            var mesaje_victoria = ", " + mOptions.msgs.msgWinGame;
            $eXeOca.showGameMessage(mOptions.gamers[mOptions.jugadorActivo].name + mesaje_victoria, 15000, 0, instance);
        }
        $('#ocaLinkAudio-' + instance).hide();
        $eXeOca.sendScore(instance);
        $eXeOca.initialScore = (((mOptions.gamers[0].casilla + 1) * 10) / mOptions.numeroCasillas).toFixed(2);
    },

    drawPhrase: function (phrase, definition, nivel, type, casesensitive, instance) {
        $('#ocaEPhrase-' + instance).find('.oca-Word').remove();
        $('#ocaBtnReply-' + instance).prop('disabled', true);
        $('#ocaBtnMoveOn-' + instance).prop('disabled', true);
        $('#ocaEdAnswer-' + instance).prop('disabled', true);
        $('#ocaQuestionDiv-' + instance).hide();
        $('#ocaWordDiv-' + instance).show();
        $('#ocaAnswerDiv-' + instance).hide();
        if (!casesensitive) {
            phrase = phrase.toUpperCase();
        }
        var cPhrase = $eXeOca.clear(phrase),
            letterShow = $eXeOca.getShowLetter(cPhrase, nivel),
            h = cPhrase.replace(/\s/g, '&'),
            nPhrase = [];
        for (var z = 0; z < h.length; z++) {
            if (h[z] != '&' && letterShow.indexOf(z) == -1) {
                nPhrase.push(' ')
            } else {
                nPhrase.push(h[z]);
            }
        }
        nPhrase = nPhrase.join('');
        var phrase_array = nPhrase.split('&');
        for (var i = 0; i < phrase_array.length; i++) {
            var cleanWord = phrase_array[i];
            if (cleanWord != '') {
                $('<div class="oca-Word"></div>').appendTo('#ocaEPhrase-' + instance);
                for (var j = 0; j < cleanWord.length; j++) {
                    var letter = '<div class="oca-Letter blue">' + cleanWord[j] + '</div>';
                    if (type == 1) {
                        letter = '<div class="oca-Letter red">' + cleanWord[j] + '</div>';
                    } else if (type == 2) {
                        letter = '<div class="oca-Letter green">' + cleanWord[j] + '</div>';
                    }
                    $('#ocaEPhrase-' + instance).find('.oca-Word').last().append(letter);
                }
            }
        }
        $('#ocaDefinition-' + instance).text(definition);
        return cPhrase;
    },

    clear: function (phrase) {
        return phrase.replace(/[&\s\n\r]+/g, " ").trim();
    },

    getShowLetter: function (phrase, nivel) {
        var numberLetter = parseInt(phrase.length * nivel / 100);
        var arrayRandom = [];
        while (arrayRandom.length < numberLetter) {
            var numberRandow = parseInt(Math.random() * phrase.length);

            if (arrayRandom.indexOf(numberRandow) != -1) {
                continue;
            } else {
                arrayRandom.push(numberRandow)
            }
        };
        return arrayRandom.sort()
    },

    drawText: function (texto, color) {},

    showQuestion: function (i, instance) {
        var mOptions = $eXeOca.options[instance],
            mQuextion = mOptions.selectsGame[i],
            q = mQuextion;
        $eXeOca.clearQuestions(instance);
        mOptions.question = mQuextion
        mOptions.respuesta = '';
        var tiempo = $eXeOca.getTimeToString($eXeOca.getTimeSeconds(mQuextion.time)),
            author = '',
            alt = '';
        $('#ocaPTime-' + instance).text(tiempo);
        $('#ocaQuestion-' + instance).text(mQuextion.quextion);
        $('#ocaImagen-' + instance).hide();
        $('#ocaCover-' + instance).show();
        $('#ocaEText-' + instance).hide();
        $('#ocaVideo-' + instance).hide();
        $('#ocaLinkAudio-' + instance).hide();
        $eXeOca.startVideo('', 0, 0, instance);
        $eXeOca.stopVideo(instance)
        $('#ocaCursor-' + instance).hide();
        $eXeOca.showMessage(0, '', instance);
        if (mOptions.answersRamdon) {
            $eXeOca.ramdonOptions(instance);
        }
        mOptions.activeSilent = (q.type == 2) && (q.soundVideo == 1) && (q.tSilentVideo > 0) && (q.silentVideo >= q.iVideo) && (q.iVideo < q.fVideo);
        var endSonido = parseInt(q.silentVideo) + parseInt(q.tSilentVideo);
        mOptions.endSilent = endSonido > q.fVideo ? q.fVideo : endSonido;
        $('#ocaAuthor-' + instance).text('');
        if (mQuextion.type === 1) {
            $('#ocaImagen-' + instance).attr('src', mQuextion.url)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth === 0) {
                        alt = $eXeOca.msgs.msgNoImage;
                        $('#ocaAuthor-' + instance).text('');
                    } else {
                        var mData = $eXeOca.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                        $eXeOca.drawImage(this, mData);
                        $('#ocaImagen-' + instance).show();
                        $('#ocaCover-' + instance).hide();
                        $('#ocaCursor-' + instance).hide();
                        author = mQuextion.author;
                        alt = mQuextion.alt;
                        if (mQuextion.x > 0 || mQuextion.y > 0) {
                            var left = mData.x + (mQuextion.x * mData.w);
                            var top = mData.y + (mQuextion.y * mData.h);
                            $('#ocaCursor-' + instance).css({
                                'left': left + 'px',
                                'top': top + 'px'
                            });
                            $('#ocaCursor-' + instance).show();
                        }
                    }
                    $eXeOca.showMessage(0, author, instance);
                });
            $('#ocaImagen-' + instance).prop('alt', alt);
        } else if (mQuextion.type === 3) {
            var text = unescape(mQuextion.eText);
            $('#ocaEText-' + instance).html(text);
            $('#ocaCover-' + instance).hide();
            $('#ocaEText-' + instance).show();
            $eXeOca.showMessage(0, '', instance);
        } else if (mQuextion.type === 2) {
            $('#ocaVideo-' + instance).show();
            var idVideo = $eXeOca.getIDYoutube(mQuextion.url);
            $eXeOca.startVideo(idVideo, mQuextion.iVideo, mQuextion.fVideo, instance);
            $eXeOca.showMessage(0, '', instance);
            if (mQuextion.imageVideo === 0) {
                $('#ocaVideo-' + instance).hide();
                $('#ocaCover-' + instance).show();

            } else {
                $('#ocaVideo-' + instance).show();
                $('#ocaCover-' + instance).hide();
            }
            if (mQuextion.soundVideo === 0) {
                $eXeOca.muteVideo(true, instance);
            } else {
                $eXeOca.muteVideo(false, instance);
            }
        }
        if (mQuextion.typeSelect != 2) {
            $eXeOca.drawQuestions(instance);
        } else {
            $eXeOca.drawPhrase(mQuextion.solutionQuestion, mQuextion.quextion, mQuextion.percentageShow, 0, false, instance)
            $('#ocaBtnReply-' + instance).prop('disabled', false);
            $('#ocaBtnMoveOn-' + instance).prop('disabled', false);
            $('#ocaEdAnswer-' + instance).prop('disabled', false);
            $('#ocaEdAnswer-' + instance).focus();
            $('#ocaEdAnswer-' + instance).val('');
        }
        if (q.audio.length > 4 && q.type != 2) {
            $('#ocaLinkAudio-' + instance).show();
        }
        $eXeOca.stopSound(instance);
        if (q.type != 2 && q.audio.trim().length > 5) {
            $eXeOca.playSound(q.audio.trim(), instance);
        }
        if (typeof (MathJax) != "undefined") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, '#ocaGameQuestion-' + instance]);
        }
        $('#ocaEdAnswer-' + instance).focus();
    },

    playSound: function (selectedFile, instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
        mOptions.playerAudio.addEventListener("canplaythrough", event => {
            mOptions.playerAudio.play();
        });

    },

    stopSound: function(instance) {
        var mOptions = $eXeOca.options[instance];
        if (mOptions.playerAudio && typeof mOptions.playerAudio.pause == "function") {
            mOptions.playerAudio.pause();
        }
    },

    Decrypt: function (str) {
        if (!str) str = "";
        str = (str == "undefined" || str == "null") ? "" : str;
        str = unescape(str)
        try {
            var key = 146;
            var pos = 0;
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

    Decrypt1: function (game) {
        var selectsGame = []
        for (var i = 0; i < game.selectsGame.length; i++) {
            var mquestion = $eXeOca.getDecrytepQuestion(game.selectsGame[i]);
            selectsGame.push(mquestion);
        }
        var data = {
            'asignatura': '',
            "author": '',
            'authorVideo': '',
            'typeGame': 'Oca',
            'endVideo': game.endVideo,
            'idVideo': game.idVideo,
            'startVideo': game.idVideo,
            'instructionsExe': game.instructionsExe,
            'instructions': game.instructions,
            'showMinimize': game.showMinimize,
            'optionsRamdon': game.optionsRamdon,
            'answersRamdon': game.answersRamdon,
            'showSolution': game.showSolution,
            'timeShowSolution': game.timeShowSolution,
            'useLives': game.useLives,
            'numberLives': game.numberLives,
            'itinerary': game.itinerary,
            'msgs': game.msgs,
            'selectsGame': selectsGame,
            'isScorm': game.isScorm,
            'textButtonScorm': game.textButtonScorm,
            'repeatActivity': game.repeatActivity,
            'title': '',
            'customScore': game.customScore,
            'textAfter': game.textAfter,
            "versionGameOca": game.versionGameOca
        }
        return data;
    },

    getDecrytepQuestion: function (q) {
        var p = new Object(),
            qs = unescape(window.atob(q.s)),
            len = q.q.length.toString();
        len = len.length;
        qs = qs.slice(len);
        p.alt = q.a;
        p.silentVideo = q.b;
        p.typeSelect = q.c;
        p.tSilentVideo = q.d;
        p.iVideo = q.f;
        p.percentageShow = q.g;
        p.author = q.h;
        p.imageVideo = q.i;
        p.soundVideo = q.j;
        p.time = q.m;
        p.numberOptions = q.n;
        p.options = [];
        p.options.push(q.o[0]);
        p.options.push(q.o[1]);
        p.options.push(q.o[2]);
        p.options.push(q.o[3]);
        p.type = q.p;
        p.quextion = q.q;
        p.solutionQuestion = unescape(window.atob(q.r));
        p.solution = qs;
        p.eText = q.t;
        p.url = q.u;
        p.x = q.x;
        p.y = q.y;
        p.fVideo = q.z;
        p.audio = q.ad
        return p;
    },

    getIDYoutube: function (url) {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
            match = url.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        } else {
            return "";
        }
    },

    getTimeSeconds: function (iT) {
        var times = [15, 30, 60, 180, 300, 600]
        return times[iT];
    },

    getRetroFeedMessages: function (iHit, instance) {
        var msgs = $eXeOca.options[instance].msgs;
        var sMessages = iHit ? msgs.msgSuccesses : msgs.msgFailures;
        sMessages = sMessages.split('|');
        return sMessages[Math.floor(Math.random() * sMessages.length)];
    },

    answerQuestion: function (instance) {
        var mOptions = $eXeOca.options[instance],
            quextion = mOptions.selectsGame[mOptions.activeQuestion],
            message = "",
            solution = quextion.solution,
            answer = mOptions.respuesta.toUpperCase(),
            correct = true,
            type = 1;
        if (mOptions.activeCounter == false) {
            return;
        }

        if (quextion.typeSelect === 2) {
            solution = $.trim(quextion.solutionQuestion.toUpperCase()).replace(/\s+/g, " ");
            answer = $.trim($('#ocaEdAnswer-' + instance).val()).toUpperCase().replace(/\s+/g, " ");

            correct = solution == answer;
            if (answer.length == 0) {
                $eXeOca.showMessage(1, mOptions.msgs.msgIndicateWord, instance);
                return;
            }

        } else if (quextion.typeSelect === 1) {
            if (answer.length !== solution.length) {
                $eXeOca.showMessage(1, mOptions.msgs.mgsOrders, instance);
                mOptions.gameActived = true;
                return;
            }
            if (solution !== answer) {
                correct = false;
            }
        } else {
            if (answer.length !== solution.length) {
                correct = false;
            } else {
                for (var i = 0; i < answer.length; i++) {
                    var letter = answer[i];
                    if (solution.indexOf(letter) === -1) {
                        correct = false;
                        break;
                    }
                }
            }
        }
        mOptions.activeCounter = false;
        if (correct) {
            message = $eXeOca.getRetroFeedMessages(true, instance) + " " + mOptions.msgs.msgsGetBox;
            type = 2;
        } else {
            message = $eXeOca.getRetroFeedMessages(false, instance);
        }
        if (mOptions.showSolution) {
            if (quextion.typeSelect != 2) {
                $eXeOca.drawSolution(instance);
            } else {
                $eXeOca.drawPhrase(quextion.solutionQuestion, quextion.quextion, 100, type, false, instance)
            }
        }
        $eXeOca.stopVideo(instance);
        $eXeOca.showMessage(type, message, instance);
        clearInterval(mOptions.counterClock);
        var ts = mOptions.showSolution ? mOptions.timeShowSolution * 1000 : 3000;
        setTimeout(function () {
            $eXeOca.questionAnswer(correct, instance);
        }, ts);

    },

    showMessage: function (type, message, instance) {
        var colors = ['#555555', $eXeOca.borderColors.red, $eXeOca.borderColors.green, $eXeOca.borderColors.blue, $eXeOca.borderColors.yellow];
        color = colors[type];
        var weight = type == 0 ? 'normal' : 'bold';
        $('#ocaPAuthor-' + instance).text(message);
        $('#ocaPAuthor-' + instance).css({
            'color': color,
            'font-weight': weight,
        });
        $('#ocaAutorLicence-' + instance).show();
    },

    drawImage: function (image, mData) {
        $(image).css({
            'left': mData.x + 'px',
            'top': mData.y + 'px',
            'width': mData.w + 'px',
            'height': mData.h + 'px'
        });
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

    ramdonOptions: function (instance) {
        var mOptions = $eXeOca.options[instance],
            l = 0,
            letras = "ABCD";

        if (mOptions.question.typeSelect == 1) {
            return;
        }
        var soluciones = mOptions.question.solution;
        for (var j = 0; j < mOptions.question.options.length; j++) {
            if (!(mOptions.question.options[j].trim() == "")) {
                l++;
            }
        }
        var respuestas = mOptions.question.options;
        var respuestasNuevas = [];
        var respuestaCorrectas = [];
        for (var i = 0; i < soluciones.length; i++) {
            var sol = soluciones.charCodeAt(i) - 65;
            respuestaCorrectas.push(respuestas[sol]);
        }
        var respuestasNuevas = mOptions.question.options.slice(0, l)
        respuestasNuevas = $eXeOca.shuffleAds(respuestasNuevas);
        var solucionesNuevas = "";
        for (var j = 0; j < respuestasNuevas.length; j++) {
            for (var z = 0; z < respuestaCorrectas.length; z++) {
                if (respuestasNuevas[j] == respuestaCorrectas[z]) {
                    solucionesNuevas = solucionesNuevas.concat(letras[j]);
                    break;
                }
            }
        }
        mOptions.question.options = [];
        for (var i = 0; i < 4; i++) {
            if (i < respuestasNuevas.length) {
                mOptions.question.options.push(respuestasNuevas[i])
            } else {
                mOptions.question.options.push('');
            }
        }
        mOptions.question.solution = solucionesNuevas;
    },

    drawQuestions: function (instance) {
        var mOptions = $eXeOca.options[instance],
            bordeColors = [$eXeOca.borderColors.red, $eXeOca.borderColors.blue, $eXeOca.borderColors.green, $eXeOca.borderColors.yellow];
        $('#ocaQuestionDiv-' + instance).show();
        $('#ocaWordDiv-' + instance).hide();
        $('#ocaAnswerDiv-' + instance).show();
        $('#ocaOptionsDiv-' + instance).find('.oca-Options').each(function (index) {
            var option = mOptions.question.options[index]
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer',
                'color': $eXeOca.colors.black
            }).text(option);
            if (option) {
                $(this).show();
            } else {
                $(this).hide()
            }
        });
    },

    drawSolution: function (instance) {
        var mOptions = $eXeOca.options[instance],
            mQuextion = mOptions.selectsGame[mOptions.activeQuestion],
            solution = mQuextion.solution,
            letters = 'ABCD';
        mOptions.gameActived = false;
        $('#ocaOptionsDiv-' + instance).find('.oca-Options').each(function (i) {
            var css = {};
            if (mQuextion.typeSelect === 1) {
                css = {
                    'border-color': $eXeOca.borderColors.correct,
                    'background-color': $eXeOca.colors.correct,
                    'border-size': '1',
                    'cursor': 'pointer',
                    'color': $eXeOca.borderColors.black
                };
                var text = ''
                if (solution[i] === "A") {
                    text = mQuextion.options[0];
                } else if (solution[i] === "B") {
                    text = mQuextion.options[1];
                } else if (solution[i] === "C") {
                    text = mQuextion.options[2];
                } else if (solution[i] === "D") {
                    text = mQuextion.options[3];
                }
                $(this).text(text);
            } else {
                css = {
                    'border-color': $eXeOca.borderColors.incorrect,
                    'border-size': '1',
                    'background-color': 'transparent',
                    'cursor': 'pointer',
                    'color': $eXeOca.borderColors.grey
                };
                if (solution.indexOf(letters[i]) !== -1) {
                    css = {
                        'border-color': $eXeOca.borderColors.correct,
                        'background-color': $eXeOca.colors.correct,
                        'border-size': '1',
                        'cursor': 'pointer',
                        'color': $eXeOca.borderColors.black
                    }
                }
            }
            $(this).css(css);
        });
    },

    clearQuestions: function (instance) {
        var mOptions = $eXeOca.options[instance];
        mOptions.respuesta = "";
        $('#ocaAnswers-' + instance + '> .oca-AnswersOptions').remove();
        var bordeColors = [$eXeOca.borderColors.red, $eXeOca.borderColors.blue, $eXeOca.borderColors.green, $eXeOca.borderColors.yellow];
        $('#ocaOptionsDiv-' + instance).find('.oca-Options').each(function (index) {
            $(this).css({
                'border-color': bordeColors[index],
                'background-color': "transparent",
                'cursor': 'pointer'
            }).text('');
        });
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
            $eXeOca.getFullscreen(element);
        } else {
            $eXeOca.exitFullscreen(element);
        }
        $eXeOca.refreshImageActive(instance);
    }
}
$(function () {
    $eXeOca.init();
});