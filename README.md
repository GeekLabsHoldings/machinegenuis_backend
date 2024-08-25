# What is Create-express-with-typescript
  ``Create express with typescript`` is a template That is used to create a quick basic template with a typescript application without any configuration. It's easy to use and does not need to headache to install the multiple dependencies which are required every time when you create a new project structure.
  You don't need to set up a command and configuration file.
  


## Installation
  If you want to create a basic structure in ``express app with typescript`` You just run only one command on our terminal. But make sure ``Node js`` is already installed in your system. 
  And also npm version is`` 5.0 `` or later
  

 ## 🚀 Usage

 Run the below command on the terminal and install the Express application Boilerplate code with all the configurations. 

 ```bash 
 npx create-express-with-typescript app-name
 ```
 
 ## How to Start Application.
 If you look up the script section on the package.json file you can get four command `` Start `` ``build`` ``dev`` and ``test`` If you want to start the Server you should run
 
 ```bash
 npm run start
 ```
npm run start or `` npm start`` command starts your app.

## How to Create a build in Typescript-Express
if you want to create a build in the Typescript-Express application you just run only one command, This command generates a build in the dist directory which is presented in your current working directory.
```bash
  npm run build
 ```
 ## How to start a server in development Mode
 
 We are already Handel your development repeatability to ``build``  ``start``  and ``restart`` our server every time. You only need to run one command and start building our application when you save the file application is rebuilt and restarted automatically. 
 ```bash
  npm run dev
 ```




## Configuration Json File

   * You can change our ``name`` As per your requirement
   * You can change `` Version `` as well if you have needed
   * You can remove the ``bin`` command because it's does't need any more when you application successfully generated.
   * You can also change author name


 ```json
{
  "name": "create-express-with-typescript",
  "version": "1.0.0",
  "description": "Create Express app is a tamplate which is use to Create a express app templete api",
  "main": "app.js",
  "bin": {
    "create-express": "./bin/createExpress.js"
  },
  "private": "true",
  "scripts": {
    "start": "npx tsc && nodemon dist/app.js",
    "build": "npx tsc",
    "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/app.js\" ",
    "test": "jest"
  },
  "keywords": [
    "create-express-app",
    "express-app-template"
  ],
  "author": "Aadarsh Singh",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.14",
    "@types/jest": "^29.2.2",
    "@types/node": "^18.11.9",
    "concurrently": "^7.5.0",
    "nodemon": "^2.0.20",
    "supertest": "^6.3.1",
    "ts-jest": "^29.0.3",
    "typescript": "^4.8.4"
  }
}

```
 Above some dev dependency as well as dependency some of the dependency is required to run the express application Like `` express `` `` @types/express `` `` nodemode`` ``Typescript `` and  `` @types/node `` So you can't remove these dependency.
 And other dependency you can remove as per your requirement.
 
 
 
 
 
 
## 📝 License
Copyright © 2019 [Aadarsh Singh](https://github.com/aadarshbabu).<br />
This project is [MIT](https://github.com/codeefi) licensed.


## Author
👤 **Aadarsh Singh**

[Aadarsh Singh](https://codewithsingh.blogspot.com)
[Github](https://github.com/aadarshbabu)
[NPM](https://www.npmjs.com/~aadarshsingh)

