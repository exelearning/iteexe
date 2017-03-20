# eXe Learning as a web service

## Development environment

The development environment of eXe Learning is based in 3 docker containers that can be managed using docker-compose.
So, you need latest versions installed of Docker and Docker compose.

After installing docker and docker-compose, you can build the needed containers executing in your root source directory:

`docker-compose build` 

To run the containers, you can execute:

`docker-compose up -d`

Now we have a webserver listening in ports 80 and 443. To test eXe web service with HTTP Basic authentication, visit 
[http://localhost](http://localhost) in a browser. You will be asked for a user name and password. By default, we have 
defined three users at images/apache2/htpasswd all of them with password "open-phoenix".

For the 443 port, we have configured by default to use SAML as authentication using a configured container with
SimpleSAMLphp as IDP (Identy provider). By default the configured IDP uses Google as authentication source, so we need
to create a new credentials of type "Oauth 2.0 client ID" at 
[https://console.developers.google.com/apis/credentials](https://console.developers.google.com/apis/credentials)
(create a new project if needed), setting:

-"Application type": "Web application"
-"Authorised redirect URIs": "http://localhost:8180/simplesamlphp/module.php/authgoogle/linkback.php"  

The resulting ClientID and Client secret values of the new credential created needs to be filled at the file
images/idp/authsources.php:159:160

After that, you need to enable Google+ API project for your project, for example visiting the Dashboard and Enable API
link. Search for "Google+ API" and check Enable.

The default configuration of the sample IDP server has configured front.local as hostname. So, we need to add the next
line to our /etc/hosts file:

`127.0.0.1 front.local`

After restarting our docker containers (`docker-compose kill; docker-compose up -d`) you can visit 
[https://front.local](https://front.local). Google will prompt the first time to allow eXe to access some user data.
After Google authentication success, the web interface of eXe should be showed.

## Pre/Production environments

TBC