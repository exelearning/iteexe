<?php
/**
 * Authenticate using Google openid connect
 * 07/2014
 * @author Sylvain MEDARD
 * @version $Id$
 */
set_include_path(get_include_path() . PATH_SEPARATOR . dirname(dirname(dirname(dirname(__FILE__)))) . '/extlib/');
require_once 'Exception.php';
require_once 'Pem.php';
require_once 'Utils.php';

 
class sspmod_authgoogle_Auth_Source_Google extends SimpleSAML_Auth_Source {

	/**
	 * The string used to identify our states.
	 */
	const STAGE_INIT = 'authgoogle:init';

	/**
	 * The key of the AuthId field in the state.
	 */
	const AUTHID = 'authgoogle:AuthId';
	
	const ISSUER = 'accounts.google.com';
	
	const federated_signon_certs_url = 'https://www.googleapis.com/oauth2/v1/certs';
	const MAX_TOKEN_LIFETIME_SECS = 3600;
	const CLOCK_SKEW_SECS = 180;
	
	private $state;
	private $stateID;
	
	/**
	 * Client ID & Client secret 
	 * from Google Developper Console : 
	 * https://code.google.com/apis/console
	 */ 
	private $key;
	private $secret;
	
	/** 
	 * Redirect_uri
	 */
	private $linkback; 
	
	/**
	 * Curl operations
	 * 
	 * @param $url       url of the operation
	 * @return           repsonse of the curl operation
	 */
	private function curl_file_get_contents($url)
	{
    		$ch = curl_init();
    		$timeout = 5; // set to zero for no timeout
    		curl_setopt($ch, CURLOPT_URL, $url);
    		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    		$file_contents = curl_exec($ch);
    		curl_close($ch);
    		return $file_contents;
	}


	/**
	 * Constructor for this authentication source.
	 *
	 * @param array $info  Information about this authentication source.
	 * @param array $config  Configuration.
	 */
	public function __construct($info, $config) {
		assert('is_array($info)');
		assert('is_array($config)');

		/* Call the parent constructor first, as required by the interface. */
		parent::__construct($info, $config);

		if (!array_key_exists('key', $config))
			throw new Exception('Google authentication source is not properly configured: missing [key]');

		$this->key = $config['key'];

		if (!array_key_exists('secret', $config))
			throw new Exception('Google authentication source is not properly configured: missing [secret]');

		$this->secret = $config['secret'];
		
		$this->linkback = SimpleSAML_Module::getModuleURL('authgoogle') . '/linkback.php';
		
		// Google Discovery Document
		/*$dd = 'https://accounts.google.com/.well-known/openid-configuration';
		$xmlddresponse =  $this->curl_file_get_contents($dd);
		SimpleSAML_Logger::debug('Google Response: '.$xmlddresponse);*/
	}
	



	/**
	 * Log-in using Google OpenID Connect platform
	 *
	 * @param array &$state  Information about the current authentication.
	 */
	public function authenticate(&$state) {
		assert('is_array($state)');

		/* We are going to need the authId in order to retrieve this authentication source later. */
		$state[self::AUTHID] = $this->authId;

		$stateID = SimpleSAML_Auth_State::saveState($state, self::STAGE_INIT);

		$this->state = $state;
		$this->stateID = $stateID;

		
		
		// Lists of Google scopes : https://developers.google.com/+/api/oauth#login-scopes
		// openid : This scope informs the authorization server that the client is making an OpenID Connect request, and requests access to the authenticated user’s ID.
		// profile : This is the basic login scope. It requests that your app be given access to the authenticated user's basic profile information.
		// email : This scope requests that your app be given access to the user's Google account email address.
		$scopes = 'openid profile email';

		// Authenticate the user
		// https://developers.google.com/accounts/docs/OAuth2Login
		// Lits of Google APIs scopes: https://developers.google.com/+/api/oauth#login-scopes
        $authorizeURL = 'https://accounts.google.com/o/oauth2/auth?'
                                . 'client_id=' . urlencode($this->key)
                                . '&redirect_uri=' . urlencode($this->linkback)
                                . '&scope=' . urlencode($scopes)
                                . '&response_type=code'
                                . '&access_type=online'
                                . '&state=' . urlencode($stateID)
                ;

		
		$session = SimpleSAML_Session::getInstance();
		$session->setData('string', 'authStateId', $stateID);
 
        SimpleSAML_Utilities::redirect($authorizeURL);

	}


	/**
	 * We got authorization code : we can get token
	 * With the token, we can get user's info
	 * 
	 * @param array &$state  Information about the current authentication.
	 */
	public function finalStep(&$state) {
		assert('is_array($state)');

		// Retrieve Access token & id token
		// Documentation at:  
		// https://developers.google.com/accounts/docs/OAuth2Login#exchangecode
		
		$auth_code = $state['authgoogle:code'];
		SimpleSAML_Logger::debug('Google authorization code : ' . $auth_code);
		$fields=array(
    				'code'=>  urlencode($auth_code),
    				'client_id'=>  urlencode($this->key),
    				'client_secret'=>  urlencode($this->secret),
    				'redirect_uri'=>  urlencode($this->linkback),
    				'grant_type'=>  urlencode('authorization_code'),
		);
		$post = '';
		foreach($fields as $key=>$value) { $post .= $key.'='.$value.'&'; }
		$post = rtrim($post,'&');

		$curl = curl_init();
		curl_setopt($curl,CURLOPT_URL,'https://accounts.google.com/o/oauth2/token');
		curl_setopt($curl,CURLOPT_POST,5);
		curl_setopt($curl,CURLOPT_POSTFIELDS,$post);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,TRUE);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
		$result = curl_exec($curl);
		curl_close($curl);
		
		if (!isset($result)) throw new SimpleSAML_Error_AuthSource($this->authId, 'Google Error getting tokens.');
		
		$response =  json_decode($result,true);
		
		$accesstoken = $response['access_token'];
		if (!isset($accesstoken)) 	throw new SimpleSAML_Error_AuthSource($this->authId, 'Google Error : No access token.');
		SimpleSAML_Logger::debug('Google DEBUG : AccessToken: '.$accesstoken);
	
		
		$id_token = $response['id_token'];
		if (!isset($id_token)) throw new SimpleSAML_Error_AuthSource($this->authId, 'Google Error : No id_token');
		SimpleSAML_Logger::debug('Google DEBUG : id_Token: '.$id_token);

	
		// DEBUG only : compare id_token with Google token_endpoint
		// The tokeninfo endpoint is useful for debugging but for production purposes, we recommend that you perform the validation locally
		// https://developers.google.com/accounts/docs/OAuth2Login#validatinganidtoken
		
		/*SimpleSAML_Logger::debug('DEBUG : id_Token encoded: '.$id_token);
		$urlidtoken = 'https://www.googleapis.com/oauth2/v1/tokeninfo?id_token='.$id_token;
		$responseidtoken = $this->curl_file_get_contents($urlidtoken);
		
		if (!isset($responseidtoken)) {
			throw new SimpleSAML_Error_AuthSource($this->authId, 'Error getting id token from Google endpoint.');
		}
		SimpleSAML_Logger::debug('DEBUG :id_token decoded from google endpoint'. $responseidtoken);
		*/
		
		// Decode & Verify id_token
		// http://openid.net/specs/openid-connect-basic-1_0.html#IDToken
		 $this->verifyIdToken($id_token, $this->key);

		// Retrieve user info
		// https://developers.google.com/+/api/latest/people/getOpenIdConnect
		if ($response['expires_in']< time()) {
			$url = ('https://www.googleapis.com/plus/v1/people/me/openIdConnect?access_token='.$accesstoken);
			$xmlresponse =  $this->curl_file_get_contents($url);
			//SimpleSAML_Logger::debug('Google Response: '.$xmlresponse);
			
			if (!isset($xmlresponse)) {
				throw new SimpleSAML_Error_AuthSource($this->authId, 'Error getting user profile.');
			}
		}	
		
		// Getting user's attributes from Google response
		$userinfo = json_decode($xmlresponse, true);
		/*foreach($userinfo as $key => $value)
		{
			SimpleSAML_Logger::debug('Google '.$key.':'.$value);
		}*/
		SimpleSAML_Logger::debug('Google userinfo : ' .  var_export($userinfo, true));
		$attributes = array();
		$attributes['email'] = array($userinfo['email']);
		$attributes['picture'] = array($userinfo['picture']);
		$state['Attributes'] = $attributes;

	}
	
	private function verifyIdToken($id_token, $audience = null)
	  {
		if (!$id_token) {
		  throw new Google_Auth_Exception('No id_token');
		}
		$response =  $this->curl_file_get_contents(self::federated_signon_certs_url);
		$certs = json_decode($response, true);
	   /* foreach($certs as $key => $value){
						SimpleSAML_Logger::debug('certs keys:' . $key . ' value :  ' . $value);
		}*/
		if (!$audience) {
		  $audience = $this->key;
		}

		return $this->verifySignedJwtWithCerts($id_token, $certs, $audience, self::ISSUER);
	  }

	  /**
	* Verifies the id token, returns the verified token contents.
	*
	* @param $jwt the token
	* @param $certs array of certificates
	* @param $required_audience the expected consumer of the token
	* @param [$issuer] the expected issues, defaults to Google
	* @param [$max_expiry] the max lifetime of a token, defaults to MAX_TOKEN_LIFETIME_SECS
	* @return token information if valid, false if not
	*/
	  private function verifySignedJwtWithCerts(
		  $jwt,
		  $certs,
		  $required_audience,
		  $issuer = null,
		  $max_expiry = null
	  ) {
		if (!$max_expiry) {
		  // Set the maximum time we will accept a token for.
		  $max_expiry = self::MAX_TOKEN_LIFETIME_SECS;
		}

		$segments = explode(".", $jwt);
		if (count($segments) != 3) {
		  throw new Google_Auth_Exception("Wrong number of segments in token: $jwt");
		}
		$signed = $segments[0] . "." . $segments[1];
		$signature = Google_Utils::urlSafeB64Decode($segments[2]);

		// Parse envelope.
		$envelope = json_decode(Google_Utils::urlSafeB64Decode($segments[0]), true);
		if (!$envelope) {
		  throw new Google_Auth_Exception("Can't parse token envelope: " . $segments[0]);
		}

		// Parse token
		$json_body = Google_Utils::urlSafeB64Decode($segments[1]);
		$payload = json_decode($json_body, true);
		if (!$payload) {
		  throw new Google_Auth_Exception("Can't parse token payload: " . $segments[1]);
		}

		// Check signature
		$verified = false;
		foreach ($certs as $keyName => $pem) {
		  $public_key = new Google_Verifier_Pem($pem);
		  if ($public_key->verify($signed, $signature)) {
			$verified = true;
			break;
		  }
		}

		if (!$verified) {
		  throw new Google_Auth_Exception("Invalid token signature: $jwt");
		}

		// Check issued-at timestamp
		$iat = 0;
		if (array_key_exists("iat", $payload)) {
		  $iat = $payload["iat"];
		}
		if (!$iat) {
		  throw new Google_Auth_Exception("No issue time in token: $json_body");
		}
		$earliest = $iat - self::CLOCK_SKEW_SECS;

		// Check expiration timestamp
		$now = time();
		$exp = 0;
		if (array_key_exists("exp", $payload)) {
		  $exp = $payload["exp"];
		}
		if (!$exp) {
		  throw new Google_Auth_Exception("No expiration time in token: $json_body");
		}
		SimpleSAML_Logger::debug($now+$max_expiry . ' >= ' . $exp . ' ?');
		if ($exp > $now + $max_expiry) {
		  throw new Google_Auth_Exception(
			  sprintf("Expiration time too far in future: %s", $json_body)
		  );
		}

		$latest = $exp + self::CLOCK_SKEW_SECS;
		if ($now < $earliest) {
		  throw new Google_Auth_Exception(
			  sprintf(
				  "Token used too early, %s < %s: %s",
				  $now,
				  $earliest,
				  $json_body
			  )
		  );
		}
		if ($now > $latest) {
		  throw new Google_Auth_Exception(
			  sprintf(
				  "Token used too late, %s > %s: %s",
				  $now,
				  $latest,
				  $json_body
			  )
		  );
		}

		$iss = $payload['iss'];
		if ($issuer && $iss != $issuer) {
		  throw new Google_Auth_Exception(
			  sprintf(
				  "Invalid issuer, %s != %s: %s",
				  $iss,
				  $issuer,
				  $json_body
			  )
		  );
		}

		// Check audience
		$aud = $payload["aud"];
		if ($aud != $required_audience) {
		  throw new Google_Auth_Exception(
			  sprintf(
				  "Wrong recipient, %s != %s:",
				  $aud,
				  $required_audience,
				  $json_body
			  )
		  );
		}
	  }

}

