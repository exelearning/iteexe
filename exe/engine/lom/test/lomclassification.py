#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest
from exe.engine.lom.lomclassification import Classification


class TestLOM(unittest.TestCase):

    def setUp(self):
        pass

    def test_lomClassificationAccesibilidad(self):
        results = [{'10': 'TIPO DE CONTADOR DE EJECUCI\xd3N', '1': 'DECLARACI\xd3N DEL MODO DE ACCESO AL SIGUIENTE NIVEL', '3': 'TRABAJA A PANTALLA COMPLETA', '2': 'DECLARACI\xd3N DEL MODO DE INTERACCI\xd3N EN LA ACTIVIDAD DE APRENDIZAJE', '5': 'PERMITE CAMBIO DE RESOLUCI\xd3N CON AJUSTE DE CONTENIDO', '4': 'RESOLUCI\xd3N DE PANTALLA NATIVA', '7': 'VISUALIZACI\xd3N ADAPTABLE', '6': 'PERMITE ADAPTAR LA VISUALIZACI\xd3N', '9': 'TIENE CONTROL DEL TIEMPO DE EJECUCI\xd3N', '8': 'DECLARACI\xd3N DE ADAPTABILIDAD'},
                  {'1.1': 'Modo de presentaci\xf3n de la informaci\xf3n en el acceso', '1.2': 'Modo de interacci\xf3n para el acceso '},
                  {'1.1.1': 'Auditivo', '1.1.3': 'Textual', '1.1.2': 'T\xe1ctil', '1.1.4': 'Visual'},
                  {'1.1.1.1': 'Informativo', '1.1.1.2': 'Decorativo', '1.1.1.3': 'Motivacional'},
                  {'10': 'TIPO DE CONTADOR DE EJECUCI\xd3N', '1': 'DECLARACI\xd3N DEL MODO DE ACCESO AL SIGUIENTE NIVEL', '3': 'TRABAJA A PANTALLA COMPLETA', '2': 'DECLARACI\xd3N DEL MODO DE INTERACCI\xd3N EN LA ACTIVIDAD DE APRENDIZAJE', '5': 'PERMITE CAMBIO DE RESOLUCI\xd3N CON AJUSTE DE CONTENIDO', '4': 'RESOLUCI\xd3N DE PANTALLA NATIVA', '7': 'VISUALIZACI\xd3N ADAPTABLE', '6': 'PERMITE ADAPTAR LA VISUALIZACI\xd3N', '9': 'TIENE CONTROL DEL TIEMPO DE EJECUCI\xd3N', '8': 'DECLARACI\xd3N DE ADAPTABILIDAD'},
                  {'10': 'TIPO DE CONTADOR DE EJECUCI\xd3N', '1': 'DECLARACI\xd3N DEL MODO DE ACCESO AL SIGUIENTE NIVEL', '3': 'TRABAJA A PANTALLA COMPLETA', '2': 'DECLARACI\xd3N DEL MODO DE INTERACCI\xd3N EN LA ACTIVIDAD DE APRENDIZAJE', '5': 'PERMITE CAMBIO DE RESOLUCI\xd3N CON AJUSTE DE CONTENIDO', '4': 'RESOLUCI\xd3N DE PANTALLA NATIVA', '7': 'VISUALIZACI\xd3N ADAPTABLE', '6': 'PERMITE ADAPTAR LA VISUALIZACI\xd3N', '9': 'TIENE CONTROL DEL TIEMPO DE EJECUCI\xd3N', '8': 'DECLARACI\xd3N DE ADAPTABILIDAD'},
                  {},
                  {},
                  {}]
        cl = Classification('exe/engine/lom/test/sources/PODPL_02_accesibilidad_LOM-ES_es.xml')
        rootLevel = cl.getElementsByIdentifier()
        self.assertEqual(rootLevel, results[0])
        print(rootLevel)
        i = 1
        for v in ['1', '1.1', '1.1.1', False, 0, 1, '1.6', '1.x.y.z']:
            data = cl.getElementsByIdentifier(v)
            self.assertEqual(data, results[i])
            i += 1
            print(data)

    def test_lomClassificationCompetencia(self):
        results = [{'1': 'Competencias Generales y Personales', '3': 'Competencias Sociales y de Trabajo en Equipo', '2': 'Competencias Acad\xe9micas'},
                   {'1.4': 'Autoestima', '1.5': 'Autorreflexi\xf3n y autoevaluaci\xf3n', '1.6': 'B\xfasqueda de empleo', '1.7': 'B\xfasqueda de informaci\xf3n relevante', '1.1': 'Actitud positiva al cambio', '1.2': 'Afectividad', '1.3': 'Autoaprendizaje a lo largo de la vida', '1.8': 'Comunicaci\xf3n en lengua materna (escuchar, hablar, leer y escribir).', '1.9': 'Conocimiento de los principios b\xe1sicos de la naturaleza', '1.16': 'Iniciativa personal', '1.17': 'Inter\xe9s por la expresi\xf3n cultural (literatura, m\xfasica, artes esc\xe9nicas y pl\xe1sticas)', '1.14': 'Formulaci\xf3n de preguntas pertinentes', '1.15': 'Honestidad y \xe9tica personal', '1.12': 'Esp\xedritu de empresa', '1.13': 'Expresi\xf3n y compresi\xf3n b\xe1sica de lengua extranjera', '1.10': 'Conocimiento y aprecio por la cultura y lengua de las Comunidades Aut\xf3nomas', '1.11': 'Conocimiento y pr\xe1ctica deportiva', '1.18': 'Invenci\xf3n y creaci\xf3n', '1.19': 'Motivaci\xf3n intr\xednseca', '1.30': 'Uso b\xe1sico de las TIC', '1.29': 'Uso eficiente de la informaci\xf3n', '1.28': 'Soluci\xf3n de problemas', '1.23': 'Realizaci\xf3n de juicios informados', '1.22': 'Planificaci\xf3n y gesti\xf3n de recursos propios (tiempo, dinero,...)', '1.21': 'Perseverancia', '1.20': 'Pensamiento cr\xedtico', '1.27': 'Responsabilidad', '1.26': 'Resistencia al fracaso', '1.25': 'Resistencia a la ambig\xfcedad', '1.24': 'Reconocimiento y respeto a las diferencias individuales'},
                   {},
                   {},
                   {'1': 'Competencias Generales y Personales', '3': 'Competencias Sociales y de Trabajo en Equipo', '2': 'Competencias Acad\xe9micas'},
                   {'1': 'Competencias Generales y Personales', '3': 'Competencias Sociales y de Trabajo en Equipo', '2': 'Competencias Acad\xe9micas'},
                   {},
                   {},
                   {}]
        cl = Classification('exe/engine/lom/test/sources/PODPL_01_competencia_LOM-ES_es.xml')
        rootLevel = cl.getElementsByIdentifier()
        self.assertEqual(rootLevel, results[0])
        print(rootLevel)
        i = 1
        for v in ['1', '1.1', '1.1.1', False, 0, 1, '1.6', '1.x.y.z']:
            data = cl.getElementsByIdentifier(v)
            self.assertEqual(data, results[i])
            i += 1
            print(data)

# Para que funciones los siguientes test de deben incluir los ficheros de fuentes en el directorio 
#'exe/engine/lom/test/sources/ y descomentarlos
#    def test_lomClassificationNivelEducativo(self):
#        cl = Classification('exe/engine/lom/test/sources/PODPL_01_nivel_educativo_LOM-ES_es.xml')
#        rootLevel = cl.getElementsByIdentifier()
#        print rootLevel
#        for v in ['1', '1.1', '1.1.1', False, 0, 1, '1.6', '1.x.y.z']:
#            data = cl.getElementsByIdentifier(v)
#            print data
#
#    def test_lomClassificationArbolCurricular(self):
#        cl = Classification('exe/engine/lom/test/sources/PODPL_02_Arbol_curricular_LOE_2006_es.xml')
#        rootLevel = cl.getElementsByIdentifier()
#        print rootLevel
#        for v in ['1', '1.1', '1.1.1', False, 0, 1, '1.6', '1.x.y.z']:
#            data = cl.getElementsByIdentifier(v)
#            print data
#
#    def test_lomClassificationDisciplinaETBLRE(self):
#        cl = Classification('exe/engine/lom/test/sources/ETB-LRE MEC-CCAA V.1.0_es.xml')
#        rootLevel = cl.getElementsByIdentifier(stype=2)
#        print rootLevel
#        m50 = cl.getElementsByIdentifier('M50', stype=2)
#        print m50
#        m70 = cl.getElementsByIdentifier('M70', stype=2)
#        print m70
#        s1277 = cl.getElementsByIdentifier('1277', stype=2)
#        print s1277

if __name__ == '__main__':
    unittest.main()
