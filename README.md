
# express-mongoose-jwt-single-login-example
Example of token login system using express and mongodb. Each user is allowed to own one valid token only.


## Requirements

 - MongoDB

## Setup

 1. Set config.mongodb.path to your mongodb path from config.js.
 2. Run `npm install`
 3. Run `npm start`
 
## Usage
 
 - POST /user/register
{"username": String, "password": String}  
A token will be issued upon success registration.  

 - POST /user/login
{"username": String, "password": String}  
A token will be issued upon success login.  
Previous token that mounted with this user will be expired.  

 - GET /user/private
Set req.header('x-jwt') as the token issued above.  
Set req.header('x-user') as the username.  
Status 200 will be returned upon valid token.  

 - GET /user/logout
Set req.header('x-jwt') as the token issued above.  
Set req.header('x-user') as the username.  
Token that mounted with this user will be expired.  

 - GET /loginOnly
Set req.header('x-jwt') as the token issued above.  
Set req.header('x-user') as the username.  
Please refer to routes/loginOnly.js. Authentication is required of all routes under /loginOnly.  

## Details
The authentication process is done by adding middleware (token.verify) in the route that you would like to prevent from unauthorized access.  
And the process is consit of 3 steps:  
 1. Verify if the token is valid with the secret key
 2. Verify expiration time and userId from the payload of the token
 3. Verify the token with the document in the collection called "tokens".

Upon successful authentication, userId will be passed as **req.user_id** to the next function.

