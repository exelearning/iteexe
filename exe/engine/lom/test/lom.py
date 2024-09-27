#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest
import sys
from exe.engine.lom import lomsubs
import exe.jsui.propertiespage as pp


class TestLOM(unittest.TestCase):

    def setUp(self):
        self.root = lomsubs.parse('exe/engine/lom/test/examplelomes.xml')

    def test_getNameNum(self):
        msg = 'Fail'
        n, m = pp.get_nameNum('string1')
        self.assertEqual(n, 'string', msg)
        self.assertEqual(m, '1', msg)
        n, m = pp.get_nameNum('string')
        self.assertEqual(n, 'string', msg)
        self.assertEqual(m, False, msg)
        n, m = pp.get_nameNum('string12345')
        self.assertEqual(n, 'string', msg)
        self.assertEqual(m, '12345', msg)
        n, m = pp.get_nameNum('12345')
        self.assertEqual(n, False, msg)
        self.assertEqual(m, '12345', msg)
        n, m = pp.get_nameNum('')
        self.assertEqual(n, False, msg)
        self.assertEqual(m, False, msg)

    def test_processForm2Lom(self):
        fields = {
        # General
        'lom_general_title_string1': ['Padres...y educadores'],
        'lom_general_title_string1_language': ['es'],
        'lom_general_title_string2': ['title 2'],
        'lom_general_title_string2_language': ['en'],
        'lom_general_identifier1_catalog': ['Plataforma Agrega'],
        'lom_general_identifier1_entry': ['ODE-baa78a92-fd6d-311d-84a6-4eae460cce84'],
        'lom_general_identifier2_catalog': ['Cat'],
        'lom_general_identifier2_entry': ['es_2013030412_9152054'],
        'lom_general_structure_value': ['4'],
        'lom_general_aggregationLevel_value': ['2'],
        #'lom_general_structure_source': ['LOM-ESv1.0'],
        'lom_general_language1': ['es'],
        'lom_general_language2': ['en'],
        'lom_general_description1_string1': ['Descripcion 1'],
        'lom_general_description1_string1_language': ['es'],
        'lom_general_keyword1_string1': ['cedec, rea, padres, estudiar, alumnos, familia, fracaso escolar, escuela, orientación, estudios'],
        'lom_general_keyword1_string1_language': ['es'],
        #LifeCycle
        'lom_lifeCycle_version_string1': ['Final'],
        'lom_lifeCycle_status_value': ['final'],                  
        'lom_lifeCycle_contribute1_role_value': ['publisher'],
        'lom_lifeCycle_contribute1_entity1_name': ['mfuente'],
        'lom_lifeCycle_contribute1_entity1_email': [' '],
        'lom_lifeCycle_contribute1_entity1_organization': ['Plataforma Agrega'],
        'lom_lifeCycle_contribute1_date': ['2013-03-04T15:20:56.212Z'],
        'lom_lifeCycle_contribute1_date_description_string1': ['Fecha de publicación en Agrega'],
        'lom_lifeCycle_contribute2_role_value': ['author'],
        'lom_lifeCycle_contribute2_entity1_name': ['Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC) '],
        'lom_lifeCycle_contribute2_entity1_email': ['cedec@ite.educacion.es'],
        'lom_lifeCycle_contribute2_entity1_organization': ['CeDeC'],
        'lom_lifeCycle_contribute2_entity2_name': ['IES "Enrique Díez-Canedo"'],
        'lom_lifeCycle_contribute2_entity2_email': ['ies.enriquediezcanedo@juntaextremadura.net'],
        'lom_lifeCycle_contribute2_entity2_organization': ['IES "Enrique Díez-Canedo"'],
        'lom_lifeCycle_contribute2_date': ['2013-03-04'],
        'lom_lifeCycle_contribute2_date_description_string1': ['Fecha de publicación en Agrega'],
        #MetaMetadata
        'lom_metaMetadata_identifier1_entry': ['ODE-baa78a92-fd6d-311d-84a6-4eae460cce84'],
        'lom_metaMetadata_identifier1_catalog': ['Plataforma Agrega'],
        'lom_metaMetadata_metadataSchema1': ['LOM-ESv1.0'],
        'lom_metaMetadata_language': ['es'],
        'lom_metaMetadata_contribute2_role_value': ['creator'],
        'lom_metaMetadata_contribute2_entity1_name': ['Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC) '],
        'lom_metaMetadata_contribute2_entity1_email': ['cedec@ite.educacion.es'],
        'lom_metaMetadata_contribute2_entity1_organization': ['CeDeC'],
        'lom_metaMetadata_contribute2_entity2_name': ['IES "Enrique Díez-Canedo"'],
        'lom_metaMetadata_contribute2_entity2_email': ['ies.enriquediezcanedo@juntaextremadura.net'],
        'lom_metaMetadata_contribute2_entity2_organization': ['IES "Enrique Díez-Canedo"'],
        'lom_metaMetadata_contribute2_date': ['2013-03-04'],
        'lom_metaMetadata_contribute2_date_description_string1': ['Fecha de publicación en Agrega'],
        #Technical
        'lom_technical_format1': ['text/html'],
        'lom_technical_location1': ['http://agrega.educacion.es/ODE/es/es_2013030412_9152054'],
        'lom_technical_requirement1_orComposite1_type_value': ['browser'],
        'lom_technical_requirement1_orComposite1_name_value': ['any'],
        'lom_technical_duration_years': ['1'],
        'lom_technical_duration_months': ['2'],
        'lom_technical_duration_days': ['3'],
        'lom_technical_duration_hours': ['4'],
        'lom_technical_duration_minutes': ['5'],
        'lom_technical_duration_seconds': ['6'],                  
        'lom_technical_duration_description_string1': ['duration time description'],
        'lom_technical_duration_description_string1_language': ['es'],
        #Educational
        'lom_educational1_interactivityType_value': ['mixed'],
        'lom_educational1_learningResourceType1_value': ['individual/cooperative/collaborative learning/working management tool'],
        'lom_educational1_interactivityLevel_value': ['medium'],
        'lom_educational1_intendedEndUserRole1_value': ['family'],
        'lom_educational1_intendedEndUserRole2_value': ['learner'],
        'lom_educational1_intendedEndUserRole3_value': ['subject matter expert'],
        'lom_educational1_intendedEndUserRole4_value': ['general public'],
        'lom_educational1_intendedEndUserRole5_value': ['tutor'],
        'lom_educational1_intendedEndUserRole6_value': ['teacher'],
        'lom_educational1_context1_value': ['teacher'],
        'lom_educational1_context2_value': ['home'],
        'lom_educational1_typicalAgeRange1_string1': ['35'],
        'lom_educational1_typicalAgeRange1_string1_language': ['es'],
        'lom_educational1_typicalLearningTime_description_string1': ['duration time description'],
        'lom_educational1_typicalLearningTime_description_string1_language': ['es'],
        'lom_educational1_typicalLearningTime_years': ['1'],
        'lom_educational1_typicalLearningTime_months': ['2'],
        'lom_educational1_typicalLearningTime_days': ['3'],
        'lom_educational1_typicalLearningTime_hours': ['4'],
        'lom_educational1_typicalLearningTime_minutes': ['5'],
        'lom_educational1_typicalLearningTime_seconds': ['6'],
        'lom_educational1_difficulty_value': ['medium'],
        'lom_educational1_language1': ['es'],
        'lom_educational1_language2': ['al'],
        #Rights
        'lom_rights_cost_value': ['no'],
        'lom_rights_copyrightAndOtherRestrictions_value': ['other free software licenses'],
        'lom_rights_description_string1': ['Licencia Creative Commons Reconocimiento Compartir Igual (by sa)'],
        'lom_rights_description_string1_language': ['es'],                    
        'lom_rights_access_accessType_value': ['universal'],
        'lom_rights_access_description_string1': ['es_cnice_20080623,es_{nodo}_20080923,es_clm_20091103121523455,es_murcia_20080422121523455,es_castillayleon_201002241811,es_baleares_200907131205,es_na_90348943,es_canarias_20090114,es_aragon_20080930,es_larioja_20081107,es_cantabria_20081215,es_valencia_201101241416,galicia20091006,es_euskadi_20100423,es_extremadura_20111222,es_andalucia_20090324'],
        'lom_rights_access_description_string1_language': [''],
        #Relation
        'lom_relation1_kind_value': ['ispartof'],
        'lom_relation1_resource_identifier_catalog': ['Plataforma Agrega'],
        'lom_relation1_resource_identifier_entry': ['ODE-baa78a92-fd6d-311d-84a6-4eae460cce84'],
        'lom_relation1_resource_description1_string1_language': ['es'],
        'lom_relation1_resource_description1_string1': ['Licencia Creative Commons Reconocimiento Compartir Igual (by sa)'],
        'lom_relation2_kind_value': ['ispartof 2'],
        'lom_relation2_resource_identifier_catalog': ['Plataforma Agrega 2'],
        'lom_relation2_resource_identifier_entry': ['ODE-baa78a92-fd6d-311d-84a6-4eae460cce84 2'],
        'lom_relation2_resource_description1_string1_language': ['es 2'],
        'lom_relation2_resource_description1_string1': ['Licencia Creative Commons Reconocimiento Compartir Igual (by sa) 2'],
        #Annotation
        'lom_annotation1_entity_name': ['Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC)'],
        'lom_annotation1_entity_email': ['cedec@ite.educacion.es'],
        'lom_annotation1_entity_organization': ['CeDeC'],
        'lom_annotation1_date': ['2013-03-04'],
        'lom_annotation1_date_description_string1_language': ['es'],
        'lom_annotation1_date_description_string1': ['Recurso educativo abierto (REA) que ofrece a los padres orientaciones para apoyar a sus hijos en el estudio. Se incluyen contenidos, recursos de la Red y testimonios de padres, alumnos y profesores de la comunidad educativa del IES "Enrique Díez-Canedo". Este REA forma parte del proyecto "Saber estudiar", desarrollado por el CeDeC.'],
        'lom_annotation1_description_string1_language': ['es'],
        'lom_annotation1_description_string1': ['Recurso educativo abierto (REA) que ofrece a los padres orientaciones para apoyar a sus hijos en el estudio. Se incluyen contenidos, recursos de la Red y testimonios de padres, alumnos y profesores de la comunidad educativa del IES "Enrique Díez-Canedo". Este REA forma parte del proyecto "Saber estudiar", desarrollado por el CeDeC.'],
        'lom_annotation2_entity_name': ['Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC)'],
        'lom_annotation2_entity_email': ['cedec@ite.educacion.es'],
        'lom_annotation2_entity_organization': ['CeDeC'],
        'lom_annotation2_date': ['2013-03-04'],
        'lom_annotation2_date_description_string1_language': ['es'],
        'lom_annotation2_date_description_string1': ['Recurso educativo abierto (REA) que ofrece a los padres orientaciones para apoyar a sus hijos en el estudio. Se incluyen contenidos, recursos de la Red y testimonios de padres, alumnos y profesores de la comunidad educativa del IES "Enrique Díez-Canedo". Este REA forma parte del proyecto "Saber estudiar", desarrollado por el CeDeC.'],
        'lom_annotation2_description_string1_language': ['es'],
        'lom_annotation2_description_string1': ['Recurso educativo abierto (REA) que ofrece a los padres orientaciones para apoyar a sus hijos en el estudio. Se incluyen contenidos, recursos de la Red y testimonios de padres, alumnos y profesores de la comunidad educativa del IES "Enrique Díez-Canedo". Este REA forma parte del proyecto "Saber estudiar", desarrollado por el CeDeC.'],
        #Classification
        'lom_classification1_purpose_value': ['educational level'],
        'lom_classification1_keyword1_string1_language': ['es'],
        'lom_classification1_keyword1_string1': ['cedec, rea, padres, estudiar, alumnos, familia, fracaso escolar, escuela, orientación, estudios'],
        'lom_classification1_taxonPath1_source_string1_language': ['es'],
        'lom_classification1_taxonPath1_source_string1': ['Nivel educativo LOM-ESv1.0'],
        'lom_classification1_taxonPath1_taxon1_id': ['3'],
        'lom_classification1_taxonPath1_taxon1_entry_string1_language': ['es'],
        'lom_classification1_taxonPath1_taxon1_entry_string1': ['Educación Primaria'],
        'lom_classification1_taxonPath2_source_string1_language': ['es'],
        'lom_classification1_taxonPath2_source_string1': ['Nivel educativo LOM-ESv1.0'],
        'lom_classification1_taxonPath2_taxon1_id': ['4'],
        'lom_classification1_taxonPath2_taxon1_entry_string1_language': ['es'],
        'lom_classification1_taxonPath2_taxon1_entry_string1': ['Educación Secundaria Obligatoria'],
        'lom_classification1_taxonPath3_source_string1_language': ['es'],
        'lom_classification1_taxonPath3_source_string1': ['Nivel educativo LOM-ESv1.0'],
        'lom_classification1_taxonPath3_taxon1_id': ['8'],
        'lom_classification1_taxonPath3_taxon1_entry_string1_language': ['es'],
        'lom_classification1_taxonPath3_taxon1_entry_string1': ['Formación Profesional'],                   
    	}
        lom = pp.processForm2Lom(fields, 'lom', 'LOMv1.0')
        rootLom = lomsubs.lomSub.factory()
        rootLom.addChilds(lom)
        rootLom.export(sys.stdout, 0)       
        #print lom
        
    def test_processLom2Form1(self):
        form = [
        #General
        'lom_general_title_string1',
        'lom_general_title_string1_language',
#        'lom_general_title_string2',
#        'lom_general_title_string2_language',
        'lom_general_identifier1_catalog',
        'lom_general_identifier1_entry',
        'lom_general_identifier2_catalog',
        'lom_general_identifier2_entry',
        'lom_general_structure_value',
        'lom_general_aggregationLevel_value',
        'lom_general_language1',
        'lom_general_language2',
        'lom_general_description1_string1',
        'lom_general_description1_string1_language',
        'lom_general_keyword1_string1',
        'lom_general_keyword1_string1_language',
        #LifeCycle
        
         ]
#        val =[]
#        val.append(self.root.getval('lom_general_title_string1'))
#        val.append(self.root.getval('lom_general_title_string1_language'))
#        print val
        value = pp.processLom2Form2(form, self.root)
        print(value)


    def test_proccessLom2Form2(self):
        fields = {
        # General
#        'lom_general_title_string1': ['Padres...y educadores'],
#        'lom_general_title_string1_language': ['es'],
#        'lom_general_title_string2': ['title 2'],
#        'lom_general_title_string2_language': ['en'],
#        'lom_general_identifier1_catalog': ['Plataforma Agrega'],
#        'lom_general_identifier1_entry': ['ODE-baa78a92-fd6d-311d-84a6-4eae460cce84'],
#        'lom_general_identifier2_catalog': ['Cat'],
#        'lom_general_identifier2_entry': ['es_2013030412_9152054'],
#        'lom_general_structure_value': ['4'],
#        'lom_general_aggregationLevel_value': ['2'],
#        'lom_general_language1': ['es'],
#        'lom_general_language2': ['en'],
#        'lom_general_description1_string1': ['Descripcion 1'],
#        'lom_general_description1_string1_language': ['es'],
#        'lom_general_keyword1_string1': ['cedec, rea, padres, estudiar, alumnos, familia, fracaso escolar, escuela, orientación, estudios'],
#        'lom_general_keyword1_string1_language': ['es'],
#        'lom_lifeCycle_contribute2_date': ['2013-03-04'],
#        'lom_lifeCycle_contribute2_date_description_string1': ['Fecha de publicación en Agrega'],
#        'lom_metaMetadata_contribute2_entity1_name': ['Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC) '],
#        'lom_metaMetadata_contribute2_entity1_email': ['cedec@ite.educacion.es'],
#        'lom_metaMetadata_contribute2_entity1_organization': ['CeDeC'],
#        'lom_metaMetadata_contribute2_entity2_name': ['IES "Enrique Díez-Canedo"'],
#        'lom_metaMetadata_contribute2_entity2_email': ['ies.enriquediezcanedo@juntaextremadura.net'],
#        'lom_metaMetadata_contribute2_entity2_organization': ['IES "Enrique Díez-Canedo"'],
#        'lom_technical_duration_years': ['1'],
#        'lom_technical_duration_months': ['2'],
#        'lom_technical_duration_days': ['3'],
#        'lom_technical_duration_hours': ['4'],
#        'lom_technical_duration_minutes': ['5'],
#        'lom_technical_duration_seconds': ['6.5'],                  
#        'lom_technical_duration_description_string1': ['duration time description'],
#        'lom_technical_duration_description_string1_language': ['es'],
        'lom_technical_requirement1_orComposite1_type_value': ['browser'],
        'lom_technical_requirement1_orComposite1_name_value': ['any'],
        }
#        lom = pp.processForm2Lom(fields, 'lom', 'LOMv1.0')
#        rootLom = lomsubs.lomSub.factory()
#        rootLom.addChilds(lom)
        a = {}
        self.root.genForm('lom', self.root, a)
        print(a)
        
                
    def test_encode_decode(self):
        from exe.engine.persistxml import encodeObjectToXML, decodeObjectFromXML
        #self.root = lomsubs.parse('exe/engine/lom/test/examplelomes.xml')
        xml = encodeObjectToXML(self.root)
        root, success = decodeObjectFromXML(xml)
        self.assertTrue(success)
        root.export(sys.stdout, 0, namespacedef_='', pretty_print=True)

    def test_gen_lom(self):
        rootLom = lomsubs.lomSub.factory()
        rootLom.addChilds({'general': {'identifier': [{'catalog': 'Plataforma Agrega', 'entry': 'ODE-baa78a92-fd6d-311d-84a6-4eae460cce84'},
                                                      {'catalog': 'Cat', 'entry': 'es_2013030412_9152054'}],
                                       'title': {'string': [{'language': 'es', 'valueOf_':'Padres...y educadores'}]},
                                       'language': ['es', 'al'],
                                       'description': [{'string': [{'language': 'es', 'valueOf_':'Recurso educativo abierto (REA) que ofrece a los padres orientaciones para apoyar a sus hijos en el estudio. Se incluyen contenidos, recursos de la Red y testimonios de padres, alumnos y profesores de la comunidad educativa del IES "Enrique Díez-Canedo". Este REA forma parte del proyecto "Saber estudiar", desarrollado por el CeDeC.'}]}],
                                       'keyword': [{'string': [{'language': 'es', 'valueOf_':'cedec, rea, padres, estudiar, alumnos, familia, fracaso escolar, escuela, orientación, estudios'}]}],
                                       'aggregationLevel': {'source' :'LOM-ESv1.0', 'value': '2' },
                                       'structure': {'source' :'sourceString', 'value': '222' },
                                       },
                           'lifeCycle': {'version': {'string': [{'language': 'es', 'valueOf_':'Final'}]},
                                         'status': {'source' :'LOM-ESv1.0', 'value': 'final' },
                                         'contribute': [{'role': {'source' :'LOM-ESv1.0', 'value': 'publisher'}, 'entity': ['BEGIN:VCARD VERSION:3.0 FN: mfuente EMAIL;TYPE=INTERNET:  ORG: Plataforma Agrega'], 
                                                         'date': {'dateTime': '2013-03-04T15:20:56.212Z', 'description': {'string': ['Fecha de publicación en Agrega']}}},
                                                        {'role': {'source' :'LOM-ESv1.0', 'value': 'author'}, 'entity': ['BEGIN:VCARD VERSION:3.0 FN:Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC) EMAIL;TYPE=INTERNET:cedec@ite.educacion.es ORG:CeDeC END:VCARD',
                                                                                                                         'BEGIN:VCARD VERSION:3.0 FN:IES "Enrique Díez-Canedo" EMAIL;TYPE=INTERNET:ies.enriquediezcanedo@juntaextremadura.net ORG:IES "Enrique Díez-Canedo" END:VCARD'], 
                                                         'date': {'dateTime': '2013-03-04', 'description': {'string': [{'language': 'es','valueOf_':'Fecha de publicación en Agrega'}]}}},
                                                        ]
                                      },
                           'metaMetadata': {'identifier': [{'catalog': 'Plataforma Agrega', 'entry': 'ODE-baa78a92-fd6d-311d-84a6-4eae460cce84'}],
                                            'contribute': [{'role': {'source' :'LOM-ESv1.0', 'value': 'creator'},
                                                            'entity': ['BEGIN:VCARD VERSION:3.0 FN:Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC) EMAIL;TYPE=INTERNET:cedec@ite.educacion.es ORG:CeDeC END:VCARD',
                                                                       'BEGIN:VCARD VERSION:3.0 FN:IES "Enrique Díez-Canedo" EMAIL;TYPE=INTERNET:ies.enriquediezcanedo@juntaextremadura.net ORG:IES "Enrique Díez-Canedo" END:VCARD'], 
                                                           'date': {'dateTime': '2013-03-04', 'description': {'string': [{'language': 'es','valueOf_':'Fecha de publicación en Agrega'}]}}}],
                                            'metadataSchema': ['LOM-ESv1.0'],
                                            'language': 'es',                       
                                            },
                           'technical': {'format': ['text/html'],
                                         'location': ['http://agrega.educacion.es/ODE/es/es_2013030412_9152054'],
                                         'requirement': [{'orComposite': [{'type': {'source' :'LOM-ESv1.0', 'value': 'browser'}, 'name': {'source' :'LOM-ESv1.0', 'value': 'any'}}]}],
                                         'duration': {'duration': 'PT12H54M', 'description': {'string': [{'language': 'es','valueOf_':'duration time description'}]}}
                                         },
                           'educational': [{'interactivityType': {'source' :'LOM-ESv1.0', 'value': 'mixed'},
                                            'learningResourceType': [{'source' :'LOM-ESv1.0', 'value': 'individual/cooperative/collaborative learning/working management tool'}],
                                            'interactivityLevel': {'source' :'LOM-ESv1.0', 'value': 'medium'},
                                            'intendedEndUserRole': [{'source' :'LOM-ESv1.0', 'value': 'family'},
                                                                    {'source' :'LOM-ESv1.0', 'value': 'learner'},
                                                                    {'source' :'LOM-ESv1.0', 'value': 'subject matter expert'},
                                                                    {'source' :'LOM-ESv1.0', 'value': 'general public'},
                                                                    {'source' :'LOM-ESv1.0', 'value': 'tutor'},
                                                                    {'source' :'LOM-ESv1.0', 'value': 'teacher'}],
                                            'context': [{'source' :'LOM-ESv1.0', 'value': 'teacher'},{'source' :'LOM-ESv1.0', 'value': 'home'}],
                                            'typicalAgeRange': [{'string': [{'language': 'es', 'valueOf_': '35'}]}],
                                            'difficulty': {'source' :'LOM-ESv1.0', 'value': 'medium'},
                                            'language': ['es', 'al'],
                                            'typicalLearningTime': {'duration': 'P5YT12H54M', 'description': {'string': [{'language': 'es','valueOf_':'duration time description'}]}}                                            
                                          }],
                           'rights': {'cost': {'source' :'LOM-ESv1.0', 'value': 'no'},
                                      'copyrightAndOtherRestrictions': {'source' :'LOM-ESv1.0', 'value': 'other free software licenses'},
                                      'description': {'string': [{'language': 'es', 'valueOf_':'Licencia Creative Commons Reconocimiento Compartir Igual (by sa)'}]},
                                      'access': {'accessType': {'source' :'LOM-ESv1.0', 'value': 'universal'},
                                                 'description': {'string': ['es_cnice_20080623,es_{nodo}_20080923,es_clm_20091103121523455,es_murcia_20080422121523455,es_castillayleon_201002241811,es_baleares_200907131205,es_na_90348943,es_canarias_20090114,es_aragon_20080930,es_larioja_20081107,es_cantabria_20081215,es_valencia_201101241416,galicia20091006,es_euskadi_20100423,es_extremadura_20111222,es_andalucia_20090324']}},
                                      },
                           'relation': [{'kind': {'source' :'LOM-ESv1.0', 'value': 'ispartof'},
                                         'resource': {'identifier': {'catalog': 'Plataforma Agrega', 'entry': 'ODE-baa78a92-fd6d-311d-84a6-4eae460cce84'},
                                                       'description': [{'string': [{'language': 'es', 'valueOf_':'Licencia Creative Commons Reconocimiento Compartir Igual (by sa)'}]}]}
                                         }],
                           'annotation': [{'entity': 'BEGIN:VCARD VERSION:3.0 FN:Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC) EMAIL;TYPE=INTERNET:cedec@ite.educacion.es ORG:CeDeC END:VCARD',
                                           'date': {'dateTime': '2013-03-04', 'description': {'string': [{'language': 'es','valueOf_':'Recurso educativo abierto (REA) que ofrece a los padres orientaciones para apoyar a sus hijos en el estudio. Se incluyen contenidos, recursos de la Red y testimonios de padres, alumnos y profesores de la comunidad educativa del IES "Enrique Díez-Canedo". Este REA forma parte del proyecto "Saber estudiar", desarrollado por el CeDeC.'}]}},
                                           'description': {'string': [{'language': 'es','valueOf_':'Recurso educativo abierto (REA) que ofrece a los padres orientaciones para apoyar a sus hijos en el estudio. Se incluyen contenidos, recursos de la Red y testimonios de padres, alumnos y profesores de la comunidad educativa del IES "Enrique Díez-Canedo". Este REA forma parte del proyecto "Saber estudiar", desarrollado por el CeDeC.'}]}
                                           }],
                           'classification': [{'purpose': {'source' :'LOM-ESv1.0', 'value': 'educational level'},
                                               'taxonPath': [{'source': {'string': [{'language': 'es', 'valueOf_':'Nivel educativo LOM-ESv1.0'}]},
                                                              'taxon': [{'id': '3',
                                                                         'entry': {'string': [{'language': 'es', 'valueOf_':'Educación Primaria'}]}
                                                                        }]
                                                              },
                                                             {'source': {'string': [{'language': 'es', 'valueOf_':'Nivel educativo LOM-ESv1.0'}]},
                                                              'taxon': [{'id': '4',
                                                                         'entry': {'string': [{'language': 'es', 'valueOf_':'Educación Secundaria Obligatoria'}]}
                                                                        }]
                                                              },
                                                             {'source': {'string': [{'language': 'es', 'valueOf_':'Nivel educativo LOM-ESv1.0'}]},
                                                              'taxon': [{'id': '8',
                                                                         'entry': {'string': [{'language': 'es', 'valueOf_':'Formación Profesional'}]}
                                                                        }]
                                                              },],
                                               'keyword': [{'string': [{'language': 'es', 'valueOf_':'cedec, rea, padres, estudiar, alumnos, familia, fracaso escolar, escuela, orientación, estudios'}]}]
                                             }]
                          })        
        rootLom.export(sys.stdout, 0)
        

if __name__ == '__main__':
    unittest.main()
