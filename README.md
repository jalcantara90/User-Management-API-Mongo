# user-management/API

This is a solution to build your own API to manage users of your application.

### How To Use

1. Install mongodb in your system.
2. Clone this repository.
3. Start mongo service, ( type: mongod in your command terminal ).
4. Open a new terminal, move up to de directory that you clone this project.
5. Run npm install.
6. Run npm start.
7. You just have an API with personal DB working ready to be used.

### Posible Configurations

1. You can set your own port on you want that this API works, set in an environment variable called PORT, per default this API use the port 3050.
2. You can set your own secret key to create a validation tokens, set in environment variable called SECRETKEY, per default this API use the string "Secret-Key-String".

### Database Model Of User

```
const UserSchema = Schema({
    name:String,
    nickname:String,
    bio: String,
    email: String,
    password: String,
    role: String,
    avatarImage: String,
    backgroundImage: String,
    friends: [{ type: Schema.ObjectId, ref: 'Users' }]
});

```

### What Do You Get With This API?

#### *This API provides you methods to:*

1. Create a new User and register the data to mongo database, encripting password.
2. Login validation with JWT, checkin if the user exist in your mongo database.
3. Modify the data user and update the record of your mongo database.
4. Delete an user register of your mongo database.
5. Add/remove friends/contacts of users.
6. List the users data.
7. List friends/contact data of user.
8. Upload a image to Avatar or Background of user.
9. Method to get the images without server routes.

### How To Use The Differents Features

To use all this features you only need to make an request from your front-end to the next endpoints:

>The url of request per default is http://localhost:3050/api/ + the next endpoints ( remember change the port if you are set another by environment variable ).

>The parameters with * means that this parameter is mandatory.

> *TOKEN* means that this method needs send a Authorization Header with the generate token with login method.

* Call using POST method to ` http://localhost:3050/api/user `, this create a new user on your database and encrypt the password, this method wait the next parameters:

    1. name *.
    2. nickname *.
    3. email *.
    4. password *.

*  Call using POST method to ` http://localhost:3050/api/login `, this checks if the email and password are the same that are on database, this method wait the next parameters:

    1. email *.
    2. password *.
    3. gethash.

> If you set something on parameter gethash you obtain the Token that you need to stablish a session and execute the rest of methods, send it with Authorization Header.

* Call using PUT method to ` http://localhost:3050/api/user/:id ` , this update the data of user. *TOKEN*.

    1. name.
    2. email.
    3. password.
    4. nickname.
    5. bio.
    6. role.

* Call using DELETE method to ` http://localhost:3050/api/user/:id `, this delete a user register *TOKEN*.


* Call using PUT method to ` http://localhost:3050/api/add-friend/:id `  this add a friend to user id you put on request *TOKEN*.

    1. id (of user that you want to add) *.

* Call using PUT method to ` http://localhost:3050/api/remove-friend/:id `  this remove a friend to user id you put on request *TOKEN*.

    1. id (of user that you want to add) *.

* Call using GET method to ` http://localhost:3050/api/get-friends/:id ` This let you a list of friends of user send it on the request *TOKEN*.

* Call using GET method to ` http://localhost:3050/api/users/:page? ` this let you a list of users with pagination, if you no set page in the request, the method return the page 1 of this list ( 50 register per page )*TOKEN*.

* Call using POST method to ` http://localhost:3050/api/upload-image-user/:id/:background? `, this method is used to, set an avatar image of user if is called whithout background of background image if this parameter is setted, this method accepts .jpg,.png,.gif extensions.

    1. image * (this needs be a File type)

* To use the image saved on server on src tag, you would use this format: `src='http://localhost:3050/api/get-image-user/' + user.image `