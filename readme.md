# PNGallery
This is a website that lets users upload a .png and a message of a certain amount of characters to this website.

![PNGallery][homepage]

## The webpages
### Home
The homepage is a gallery of images that previous users have uploaded.   
The viewer of this page can sign-up or log-in.   
When they click on any of the images they will be prompted to do so.  

### Signing up
There's a small sign-up form where the user can make an account as well as upload the .png-file of his choice.   
This makes sure that every account contributes!
After they've signed up they're automatically logged in and can enjoy the full site.

### Logging in
When the user is logged in they can see all the images and read the messages that come with it. When they view their own image they can change or delete it.

### Changing
Clicking the 'change' button under the user's own image will take them to a new form. Here they can change their image and message.

## Installing
You can install the full application by for example using git:
```bash
git clone  git@github.com:DanielvandeVelde/be-assessment-2.git
cd be-assessment-2
npm install
```
After that you can log-in using mysql. Instead of 'yourusername' you should of course add your own username.
```sh
mysql -u yourusername -p
##and then enter your password
```
Now you still need to make a database:
```SQL
CREATE DATABASE IF NOT EXISTS PNGallery;
USE PNGallery;
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username TEXT CHARACTER SET utf8,
  hash TEXT CHARACTER SET utf8,
  png TEXT CHARACTER SET utf8,
  message TEXT CHARACTER SET utf8,

  PRIMARY KEY (id)
);
```

So now you have made a database and a table named users.    
A description of that table you just made is here:   

| Field | Type | Default
| --- | --- | ---
| id | int | auto-increments
| username | text | NULL
| hash | text | NULL
| png | text | NULL
| message | text | NULL

Then you need a [`.env`][dotenv] file. In which you will need to add these few lines and change the values on the right to the actual values:  

```text
DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=PNGallery
SESSION_SECRET=yoursecretword
```
After you only have to start the website by being in the folder and using:
```bash
npm start
```
The website will be on localhost:8000 as default.

## Development
### To-do
- [x] Make gitignore
- [x] Make a mysql database for myself
- [x] Add a .env
- [x] Make forms
- [x] Make EJS-files
- [x] Create a patch function and page
- [x] Make a ~~cool database graphic~~ database explanation
- [ ] Fix deleting pictures and their users
- [ ] Lint everything!
- [ ] Server side test for .png (Every png file begins with 89504e47)
- [ ] Server side test for changes/removal so it cant be done by anyone
- [ ] Add more features for a higher grade
- [x] Never give in to the demands of .gif support :persevere: (gifallery is a horrible name)

## License
Original author of the [auth mysql server][original]  
[MIT][] © [Titus Wormer][author]   
The very minor changes by  
[Daniel van de Velde][co-author]  

[homepage]: https://raw.githubusercontent.com/DanielvandeVelde/be-assessment-2/master/Homescreen.png
[dotenv]: https:/www.npmjs.com/package/dotenv
[original]:https://github.com/cmda-be/course-17-18/tree/master/examples/auth-server
[mit]: https://opensource.org/licenses/MIT
[author]: http://wooorm.com
[co-author]: http://DanielvandeVelde.nl
