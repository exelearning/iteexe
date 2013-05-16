#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest
import sys
from exe.engine.lom import lomsubs


class TestLOM(unittest.TestCase):

    def setUp(self):
        self.root = lomsubs.parse('exe/engine/lom/test/examplelomes.xml')

    def test_encode_decode(self):
        from exe.engine.persistxml import encodeObjectToXML, decodeObjectFromXML
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
                                            'contribute': [{'role': {'source' :'LOM-ESv1.0', 'value': 'creator'}, 'entity': ['BEGIN:VCARD VERSION:3.0 FN:Centro Nacional de Desarrollo Curricular en Sistemas no Propietarios (CeDeC) EMAIL;TYPE=INTERNET:cedec@ite.educacion.es ORG:CeDeC END:VCARD',
                                                                                                          'BEGIN:VCARD VERSION:3.0 FN:IES "Enrique Díez-Canedo" EMAIL;TYPE=INTERNET:ies.enriquediezcanedo@juntaextremadura.net ORG:IES "Enrique Díez-Canedo" END:VCARD'], 
                                                           'date': {'dateTime': '2013-03-04', 'description': {'string': [{'language': 'es','valueOf_':'Fecha de publicación en Agrega'}]}}}],
                                            'metadataSchema': ['LOM-ESv1.0'],
                                            'language': 'es',                       
                                            },
                           'technical': {'format': ['text/html'],
                                         'location': ['http://agrega.educacion.es/ODE/es/es_2013030412_9152054'],
                                         'requirement': [{'orComposite': [{'type': {'source' :'LOM-ESv1.0', 'value': 'browser'}, 'name': {'source' :'LOM-ESv1.0', 'value': 'any'}}]}],
                                         'duration': {'duration': '12H54M', 'description': {'string': [{'language': 'es','valueOf_':'duration time description'}]}}
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
                                            'typicalLearningTime': {'duration': '12H54M', 'description': {'string': [{'language': 'es','valueOf_':'duration time description'}]}}                                            
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
