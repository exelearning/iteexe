<?php
$metadata['http://localhost/saml/metadata/'] = array (
  'entityid' => 'http://localhost/saml/metadata/',
  'metadata-set' => 'saml20-sp-remote',
  'expire' => 1425746455,
  'AssertionConsumerService' =>
  array (
    0 =>
    array (
      'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      'Location' => 'http://localhost/saml/acs',
      'index' => 1,
    ),
  ),
  'SingleLogoutService' =>
  array (
    0 =>
    array (
      'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      'Location' => 'http://localhost/saml/sls',
    ),
  ),
  'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:unspecified',
  'validate.authnrequest' => false,
  'saml20.sign.assertion' => false,
);