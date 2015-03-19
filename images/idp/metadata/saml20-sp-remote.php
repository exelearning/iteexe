<?php
$metadata['http://localhost/saml/metadata/'] = array (
  'entityid' => 'http://localhost/saml/metadata/',
  'metadata-set' => 'saml20-sp-remote',
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
  'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  'keys' =>
  array (
    0 =>
    array (
      'encryption' => true,
      'signing' => true,
      'type' => 'X509Certificate',
      'X509Certificate' => '
MIIDYTCCAkmgAwIBAgIJAJiTLubDiBvxMA0GCSqGSIb3DQEBCwUAMEcxCzAJBgNVBAYTAkVTMQ0wCwYDVQQIDARKYWVuMQ8wDQYDVQQHDAZNYXJ0b3MxGDAWBgNVBAoMD09wZW4gUGhvZW5peCBJVDAeFw0xNTAzMDUxNjU1MjJaFw0yNTAzMDQxNjU1MjJaMEcxCzAJBgNVBAYTAkVTMQ0wCwYDVQQIDARKYWVuMQ8wDQYDVQQHDAZNYXJ0b3MxGDAWBgNVBAoMD09wZW4gUGhvZW5peCBJVDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPOKIF8shFmqYDrt7y5vUvgoxPGreacfVpu0X/ruooTt4fKaHSKp0NMghvfw5cSw0nDuDWxzoddf2bzLyCIGN4obKKmeKUIEBCH8LuNsx6dUTSS6iiAi/ciPbQ2KpTnRvXN1k5tMjsbqfvCXWFVjl64qNmWdWGhgQiIaYPoZ7m+D1t/4iEtKm5K2XfENc2RxTJvSvLJGBCu7CgdjhTWre4wkjVMq7crmvl4e8ud2tMiykaIAMRYyi5QKO3pIzMdB/wyQA4b8kifDCc0lO1YQkhij0s6r/3cSGr06fmpjXrOl0hb/Iw66ziN3NQQM4GxKsPS8dzETcTRcM4kiE+iXCH8CAwEAAaNQME4wHQYDVR0OBBYEFMk5uzKf0rq13Qtny3Q1GMhwgGwGMB8GA1UdIwQYMBaAFMk5uzKf0rq13Qtny3Q1GMhwgGwGMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBANQquL7dqsURdwMZyo7jS0sg8MKJAJxCR/D3X6A7vS8ovA0oZY6kLRcHMf4JETFYunszZzXVOGv+AeEwMgZwS4oRpBK8V3XPNwQsDehST2vqG7Qh+cE+6G9w0c1XV939yvx+FCiug4a+EYJWuRr0hOw7zuKkmQBOzi/OWz/StL0xoSS26NWuow195EajiQprqRYJVUbGYBOHig0SvfpBf6qWvOS1T6S7QPaCUgQNL3X8o54RQzkQqq4PQpStt7pyMRy7cZCpo2gKGN+imgzXTTKsY0oL5Kc7M5jsY09jA/WYIehOtLYNy/I+EPDa9AwkU2e15b5LoT6w5DgtQ0jFMec=
',
    ),
  ),
  'nameid.encryption' => true,
  'validate.authnrequest' => true,
  'saml20.sign.assertion' => true,
);
$metadata['https://localhost/saml/metadata/'] = array (
  'entityid' => 'https://localhost/saml/metadata/',
  'metadata-set' => 'saml20-sp-remote',
  'AssertionConsumerService' =>
  array (
    0 =>
    array (
      'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      'Location' => 'https://localhost/saml/acs',
      'index' => 1,
    ),
  ),
  'SingleLogoutService' =>
  array (
    0 =>
    array (
      'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      'Location' => 'https://localhost/saml/sls',
    ),
  ),
  'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  'keys' =>
  array (
    0 =>
    array (
      'encryption' => true,
      'signing' => true,
      'type' => 'X509Certificate',
      'X509Certificate' => '
MIIDYTCCAkmgAwIBAgIJAJiTLubDiBvxMA0GCSqGSIb3DQEBCwUAMEcxCzAJBgNVBAYTAkVTMQ0wCwYDVQQIDARKYWVuMQ8wDQYDVQQHDAZNYXJ0b3MxGDAWBgNVBAoMD09wZW4gUGhvZW5peCBJVDAeFw0xNTAzMDUxNjU1MjJaFw0yNTAzMDQxNjU1MjJaMEcxCzAJBgNVBAYTAkVTMQ0wCwYDVQQIDARKYWVuMQ8wDQYDVQQHDAZNYXJ0b3MxGDAWBgNVBAoMD09wZW4gUGhvZW5peCBJVDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAPOKIF8shFmqYDrt7y5vUvgoxPGreacfVpu0X/ruooTt4fKaHSKp0NMghvfw5cSw0nDuDWxzoddf2bzLyCIGN4obKKmeKUIEBCH8LuNsx6dUTSS6iiAi/ciPbQ2KpTnRvXN1k5tMjsbqfvCXWFVjl64qNmWdWGhgQiIaYPoZ7m+D1t/4iEtKm5K2XfENc2RxTJvSvLJGBCu7CgdjhTWre4wkjVMq7crmvl4e8ud2tMiykaIAMRYyi5QKO3pIzMdB/wyQA4b8kifDCc0lO1YQkhij0s6r/3cSGr06fmpjXrOl0hb/Iw66ziN3NQQM4GxKsPS8dzETcTRcM4kiE+iXCH8CAwEAAaNQME4wHQYDVR0OBBYEFMk5uzKf0rq13Qtny3Q1GMhwgGwGMB8GA1UdIwQYMBaAFMk5uzKf0rq13Qtny3Q1GMhwgGwGMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBANQquL7dqsURdwMZyo7jS0sg8MKJAJxCR/D3X6A7vS8ovA0oZY6kLRcHMf4JETFYunszZzXVOGv+AeEwMgZwS4oRpBK8V3XPNwQsDehST2vqG7Qh+cE+6G9w0c1XV939yvx+FCiug4a+EYJWuRr0hOw7zuKkmQBOzi/OWz/StL0xoSS26NWuow195EajiQprqRYJVUbGYBOHig0SvfpBf6qWvOS1T6S7QPaCUgQNL3X8o54RQzkQqq4PQpStt7pyMRy7cZCpo2gKGN+imgzXTTKsY0oL5Kc7M5jsY09jA/WYIehOtLYNy/I+EPDa9AwkU2e15b5LoT6w5DgtQ0jFMec=
',
    ),
  ),
  'nameid.encryption' => true,
  'validate.authnrequest' => true,
  'sign.logout' => true,
  'redirect.sign' => true,
  'redirect.validate' => true,
  'saml20.sign.assertion' => true,
);