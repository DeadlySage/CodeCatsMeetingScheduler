<h1 align="center">
  <br>
  <a href="https://github.com/DeadlySage/CodeCatsMeetingScheduler"><img src="https://github.com/DeadlySage/CodeCatsMeetingScheduler/blob/main/public/project%20logo%20small%20border.png" alt="MeetingScheduler" width="250"></a>
  <br>
  Meeting Scheduler
  <br>
</h1>

![](https://github.com/DeadlySage/CodeCatsMeetingScheduler/blob/main/public/demo.gif)

<h4 align="center">A appointment management web application built using <a href="https://react.dev/" target="_blank">React</a>.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Synopsis--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#synopsis"> 
  <img src="https://img.shields.io/badge/Features--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#features"> 
  <img src="https://img.shields.io/badge/Testing--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#testing"> 
  <img src="https://img.shields.io/badge/Deployment--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#deployment"> 
  <img src="https://img.shields.io/badge/How%20To%20Use--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#how-to-use"> 
  <img src="https://img.shields.io/badge/Project%20Timeline--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#project-timeline"> 
  <img src="https://img.shields.io/badge/Credits--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#credits"> 
  <img src="https://img.shields.io/badge/Contributors--ac67d1?style=for-the-badge&labelColor=2C3E50" href= "#contributors"> 
</p>


# Synopsis 

the goal of this project is to enable instructors to easily manage appointments with students. current methods of sending emails to instructors / proffesors are ineficient and relies on the instructor to see the email and making not of it. With Meeting Scheduler it will be easier for instructors to see at a glance how many appointments they have with a quick glance. This will also make it easier for students to set up appointments as they will no longer have to write an email to the instructors. 

# Features

* Ease of Acess
  - allow students the ability to reserve appointments using any browser.
  - enables instructors to easily view / manage appointments through the browser.
* Set blocks of appointment for instructors
  - as an instructor you can set blocks of a set duration as appointments available to students.
  - as an instructor you can make specific blocks unavailable to prevent reservation from students.
  - prioritize certain groups of students over others.
* Calendar view
  - allows instructors and students to see at a glance how many appointment blocks are available.
  - multiple calendar views available (month, week, day).
* Database backend for data storage & login system
* Signup & Login
  - allows students & instructors to create an account and login.
  - prevent fraudulent appointments from being made.
  - peace of mind for instructors as website will only accept student emails provided from university. 
* Note on appointment blocks
  - allows instructors to add Zoom meeting links on the appointments for ease of use for both students and instructors.
* Cross platform
  - Windows, macOS and Linux ready.

# Testing

Testing is mainly done visually as the project is currently only working on the front end aspect. We used [Uizard](https://uizard.io/) for our prototyping / wireframe work when first designing the web application. So we use the clickable prototypes and use it as the acceptance criteria. 

# Deployment

Meeting Scheduler will be deployed on [Heroku](https://www.heroku.com/), with the database being managed with [Atlas DB](https://www.mongodb.com/atlas/database).

# How to Use

To clone and run this application, you'll need [Git](https://git-scm.com) or [Github](https://github.com/) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/DeadlySage/CodeCatsMeetingScheduler

# Go into the repository (make sure instalation of NPM is in project repository)
$ cd CodeCatsMeetingScheduler

# Install dependencies
$ npm install

# Install react-scripts
$ npm install react-scripts

# Run the app
$ npm start

```

Optional step: It's a good practice to update [npm](http://npmjs.com) to the latest version after installation. You can do this by typing the following command: npm install -g npm.

```bash
# update npm to latest version
$ npm install -g npm

```

Verify the installation: Once you have installed [Node.js](https://nodejs.org/en), open your terminal/command prompt and type the following command: node -v. This should display the version number of [Node.js](https://nodejs.org/en) that you just installed. You can also type npm -v to check if [npm](http://npmjs.com) is installed. type the following command: 

```bash
# verify NPM is properly installed
$ npm -v

# verify Node is properly installed
$ nnode -v

```

# Project Timeline



# Credits

This web application uses the following open source packages / services / languages:

- ![Javascript](https://img.shields.io/badge/Javascript-F0DB4F?style=for-the-badge&labelColor=black&logo=javascript&logoColor=F0DB4F)
- ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
- [![Nodejs](https://img.shields.io/badge/Nodejs-3C873A?style=for-the-badge&labelColor=black&logo=node.js&logoColor=3C873A)](https://nodejs.org/en)
- [![React](https://img.shields.io/badge/-React-61DBFB?style=for-the-badge&labelColor=black&logo=react&logoColor=61DBFB)](https://react.dev/)
- [![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
- [![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
- [![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)](https://www.heroku.com/)
- [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas/database)
- [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
- [![Visual Studio](https://img.shields.io/badge/Visual%20Studio-5C2D91.svg?style=for-the-badge&logo=visual-studio&logoColor=white)](https://code.visualstudio.com/)

# Contributors

[![](https://img.shields.io/badge/Adrian%20Tandiono-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/DeadlySage)
[![](https://img.shields.io/badge/Andrew%20Abella-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/andrewabe1)
[![](https://img.shields.io/badge/Rick%20Ammann-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/rickramen)
[![](https://img.shields.io/badge/Derrick%20Seals--Belton-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/dseals0055)
[![](https://img.shields.io/badge/Lam%20Phan-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/lamphancs)
[![](https://img.shields.io/badge/Nick%20Bailey-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/bigboibailey)
[![](https://img.shields.io/badge/Jonathan%20Bui-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/iubs)
[![](https://img.shields.io/badge/Michael%20Lawler-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/lawz4)
[![](https://img.shields.io/badge/Albert%20Forbes-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/Albies42)
