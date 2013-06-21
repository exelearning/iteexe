#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest
from exe.engine.lom.lomclassification import Classification


class TestLOM(unittest.TestCase):

    def setUp(self):
        pass

    def test_lomClassificationAccesibilidad(self):
        results = [{u'10': u'TIPO DE CONTADOR DE EJECUCI\xd3N', u'1': u'DECLARACI\xd3N DEL MODO DE ACCESO AL SIGUIENTE NIVEL', u'3': u'TRABAJA A PANTALLA COMPLETA', u'2': u'DECLARACI\xd3N DEL MODO DE INTERACCI\xd3N EN LA ACTIVIDAD DE APRENDIZAJE', u'5': u'PERMITE CAMBIO DE RESOLUCI\xd3N CON AJUSTE DE CONTENIDO', u'4': u'RESOLUCI\xd3N DE PANTALLA NATIVA', u'7': u'VISUALIZACI\xd3N ADAPTABLE', u'6': u'PERMITE ADAPTAR LA VISUALIZACI\xd3N', u'9': u'TIENE CONTROL DEL TIEMPO DE EJECUCI\xd3N', u'8': u'DECLARACI\xd3N DE ADAPTABILIDAD'},
                  {u'1.1': u'Modo de presentaci\xf3n de la informaci\xf3n en el acceso', u'1.2': u'Modo de interacci\xf3n para el acceso '},
                  {u'1.1.1': u'Auditivo', u'1.1.3': u'Textual', u'1.1.2': u'T\xe1ctil', u'1.1.4': u'Visual'},
                  {u'1.1.1.1': u'Informativo', u'1.1.1.2': u'Decorativo', u'1.1.1.3': u'Motivacional'},
                  {u'10': u'TIPO DE CONTADOR DE EJECUCI\xd3N', u'1': u'DECLARACI\xd3N DEL MODO DE ACCESO AL SIGUIENTE NIVEL', u'3': u'TRABAJA A PANTALLA COMPLETA', u'2': u'DECLARACI\xd3N DEL MODO DE INTERACCI\xd3N EN LA ACTIVIDAD DE APRENDIZAJE', u'5': u'PERMITE CAMBIO DE RESOLUCI\xd3N CON AJUSTE DE CONTENIDO', u'4': u'RESOLUCI\xd3N DE PANTALLA NATIVA', u'7': u'VISUALIZACI\xd3N ADAPTABLE', u'6': u'PERMITE ADAPTAR LA VISUALIZACI\xd3N', u'9': u'TIENE CONTROL DEL TIEMPO DE EJECUCI\xd3N', u'8': u'DECLARACI\xd3N DE ADAPTABILIDAD'},
                  {u'10': u'TIPO DE CONTADOR DE EJECUCI\xd3N', u'1': u'DECLARACI\xd3N DEL MODO DE ACCESO AL SIGUIENTE NIVEL', u'3': u'TRABAJA A PANTALLA COMPLETA', u'2': u'DECLARACI\xd3N DEL MODO DE INTERACCI\xd3N EN LA ACTIVIDAD DE APRENDIZAJE', u'5': u'PERMITE CAMBIO DE RESOLUCI\xd3N CON AJUSTE DE CONTENIDO', u'4': u'RESOLUCI\xd3N DE PANTALLA NATIVA', u'7': u'VISUALIZACI\xd3N ADAPTABLE', u'6': u'PERMITE ADAPTAR LA VISUALIZACI\xd3N', u'9': u'TIENE CONTROL DEL TIEMPO DE EJECUCI\xd3N', u'8': u'DECLARACI\xd3N DE ADAPTABILIDAD'},
                  {},
                  {},
                  {}]
        cl = Classification('exe/engine/lom/test/sources/PODPL_02_accesibilidad_LOM-ES_es.xml')
        rootLevel = cl.getElementsByIdentifier()
        self.assertEqual(rootLevel, results[0])
        print rootLevel
        i = 1
        for v in ['1', '1.1', '1.1.1', False, 0, 1, '1.6', '1.x.y.z']:
            data = cl.getElementsByIdentifier(v)
            self.assertEqual(data, results[i])
            i += 1
            print data

    def test_lomClassificationCompetencia(self):
        results = [{u'1': u'Competencias Generales y Personales', u'3': u'Competencias Sociales y de Trabajo en Equipo', u'2': u'Competencias Acad\xe9micas'},
                   {u'1.4': u'Autoestima', u'1.5': u'Autorreflexi\xf3n y autoevaluaci\xf3n', u'1.6': u'B\xfasqueda de empleo', u'1.7': u'B\xfasqueda de informaci\xf3n relevante', u'1.1': u'Actitud positiva al cambio', u'1.2': u'Afectividad', u'1.3': u'Autoaprendizaje a lo largo de la vida', u'1.8': u'Comunicaci\xf3n en lengua materna (escuchar, hablar, leer y escribir).', u'1.9': u'Conocimiento de los principios b\xe1sicos de la naturaleza', u'1.16': u'Iniciativa personal', u'1.17': u'Inter\xe9s por la expresi\xf3n cultural (literatura, m\xfasica, artes esc\xe9nicas y pl\xe1sticas)', u'1.14': u'Formulaci\xf3n de preguntas pertinentes', u'1.15': u'Honestidad y \xe9tica personal', u'1.12': u'Esp\xedritu de empresa', u'1.13': u'Expresi\xf3n y compresi\xf3n b\xe1sica de lengua extranjera', u'1.10': u'Conocimiento y aprecio por la cultura y lengua de las Comunidades Aut\xf3nomas', u'1.11': u'Conocimiento y pr\xe1ctica deportiva', u'1.18': u'Invenci\xf3n y creaci\xf3n', u'1.19': u'Motivaci\xf3n intr\xednseca', u'1.30': u'Uso b\xe1sico de las TIC', u'1.29': u'Uso eficiente de la informaci\xf3n', u'1.28': u'Soluci\xf3n de problemas', u'1.23': u'Realizaci\xf3n de juicios informados', u'1.22': u'Planificaci\xf3n y gesti\xf3n de recursos propios (tiempo, dinero,...)', u'1.21': u'Perseverancia', u'1.20': u'Pensamiento cr\xedtico', u'1.27': u'Responsabilidad', u'1.26': u'Resistencia al fracaso', u'1.25': u'Resistencia a la ambig\xfcedad', u'1.24': u'Reconocimiento y respeto a las diferencias individuales'},
                   {},
                   {},
                   {u'1': u'Competencias Generales y Personales', u'3': u'Competencias Sociales y de Trabajo en Equipo', u'2': u'Competencias Acad\xe9micas'},
                   {u'1': u'Competencias Generales y Personales', u'3': u'Competencias Sociales y de Trabajo en Equipo', u'2': u'Competencias Acad\xe9micas'},
                   {},
                   {},
                   {}]
        cl = Classification('exe/engine/lom/test/sources/PODPL_01_competencia_LOM-ES_es.xml')
        rootLevel = cl.getElementsByIdentifier()
        self.assertEqual(rootLevel, results[0])
        print rootLevel
        i = 1
        for v in ['1', '1.1', '1.1.1', False, 0, 1, '1.6', '1.x.y.z']:
            data = cl.getElementsByIdentifier(v)
            self.assertEqual(data, results[i])
            i += 1
            print data

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
