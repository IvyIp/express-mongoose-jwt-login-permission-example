# express-mongoose-jwt-single-login-example
Example of token login system using express and mongodb. Each user is allowed to own one valid token only.


## Requirements

 - MongoDB

## Setup

 1. Set config.mongodb.path to your mongodb path from config.js.
 2. Run `npm install`
 3. Run `npm start`
 
## Usage
 
 - POST user/register
{"username": String, "password": String}
A token will be issued upon success registration.

 - POST user/login
{"username": String, "password": String}
A token will be issued upon success login.
Previous token that mounted with this user will be expired.

 - GET user/private
Set req.header('x-jwt') as the token issued above.
Set req.header('x-user') as the username.
Status 200 will be returned upon valid token.

 - GET user/logout
Set req.header('x-jwt') as the token issued above.
Set req.header('x-user') as the username.
Token that mounted with this user will be expired.