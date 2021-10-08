
# Story App - backend

It is backend/API for  
App link: http://story-read.netlify.app/  
Github repo: https://github.com/Aryak880/story-frontend


## Installation

To run this project on local machine

```bash
  npm run dev

    *Required* dev.env file in root folder, named config ( /config/dev.env ).  
    *In dev.env file*  -> MONGODB_URI(database connection string), JWT(jsonwebtoken secret code) and PORT(for local host)
```

To deploy this project cloud platform like Heroku
```bash
  npm run start
    
    *Required* to set MONGODB_URI and JWT
```





  
## API Reference
## `Story end points`
#### Get all stories

```http
  GET /api/stories
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `none` | `none` | **Required**. nothing |

```
    Return -> Stories of all users
```

#### Create a story

```http
  POST /api/me/story
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**.  Authorization bearer token|

```
    Return -> Posted story
```

#### Get all story of loged in user

```http
  GET /api/me/stories
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**.  Authorization bearer token|

```
    Return -> All story of authorized user
```

#### Delete a story of loged in user

```http
  DELETE /api/me/story/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**.  Authorization bearer token|
| `id`      | `string` | **Required**.  _id( in mongodb data base) of stored story. |

```
    Return -> Deleted story
```

#### Update a story of loged in user

```http
  PATCH /api/me/story/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**.  Authorization bearer token|
| `id`      | `string` | **Required**.  _id( in mongodb data base) of stored story|
| `option`      | `JSON string of Javascript object` | **Required** Alowed update# likes, dislikes, title, story, category, comments. **At least one option required**. |

```
    Return -> Updated story
```

#### Get story by id

```http
  GET /api/read-story/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**.  _id( in mongodb data base) of stored story|

```
    Return -> Required story
```

## `User end points`

#### Create new user(Sign up)

```http
  GET /api/user/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `option` | `JSON string of Javascript object` | Name, email, age, gender, password are **retquired**. instagram user name and facebook user profile link are optional |

```
    Return -> Created user data
```


#### Login of existing user

```http
  POST /api/user/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `option` | `JSON string of Javascript object` | Name and password **retquired**.|

```
    Return -> Data of loged in user
```

#### Find user by id

```http
  GET /api/user/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `_id` | `JSON string of Javascript object` | _id(stored in mongodb database) of user **required**.|

```
    Return -> Data of required User id
```

#### Logout from current device

```http
  POST /api/user/logout
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `Authorization` | Authorization bearer token **required**.|

```
    Return -> Data of loged out user
```

#### Logout from all devices

```http
  POST /api/user/logout
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `Authorization` | Authorization bearer token **required**.|

```
    Return -> Data of loged out user
```

#### Update user information

```http
  PATCH /api/user/me
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `Authorization` | Authorization bearer token **required**.|
| `option` | `Authorization` | **Allowed update** name, email, password, age, gender, instagram user id, facebook profile link. **At least one option required**|

```
    Return -> Data of updated user
```

#### Deleted User

```http
  DELETE /api/user/me
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `Authorization` | Authorization bearer token **required**.|

```
    Return -> Data of deleted user
    **It will also deleted all the story posted by user**
```

#### Get loged in user data

```http
  GET /api/user/me
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `Authorization` | Authorization bearer token **required**.|

```
    Return -> Data of loged in user
```

#### Get all users data **Only for Admin**

```http
  GET /api/users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `Authorization` | Authorization bearer token **required**.|
| `body` | `JSON string of Javascript object of admin profile` | **Required**.|

```
    Return -> Data of all users in database
```

#### Tongle any user to admin **Only for Admin**

```http
  PATCH /api/users/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `Authorization` | Authorization bearer token **required**.|
| `body` | `JSON string of Javascript object of admin profile` | **Required**.|

```
    Return -> Data of all users in database
```

## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [bcryptjs -> for storing cypher password](https://www.npmjs.com/package/bcryptjs)
 - [validator -> for validating](https://www.npmjs.com/package/validator)
 - [mongoose -> for creating data schema and handling data](https://www.npmjs.com/package/mongoose)
 - [jsonwebtoken -> for creating authorization web token](https://www.npmjs.com/package/jsonwebtoken)
 - [cors -> for running .env file in dev mode with nodemon](https://www.npmjs.com/package/jsonwebtoken)
 - [express -> for creating routers](https://www.npmjs.com/package/express)
  
## 🔗 Author
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aryak-singh-chauhan-663a74197/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/aryaksinghchau)
[![instagram](https://img.shields.io/badge/instagram-CB3837?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/aryaksinghchauhan/)

  
## Feedback

If you have any feedback, please reach out to me at aryaksinghchauhan@gmil.com

  
