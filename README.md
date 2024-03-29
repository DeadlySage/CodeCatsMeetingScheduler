<h1 align="center">
  <br>
  <a href="https://github.com/DeadlySage/CodeCatsMeetingScheduler"><img src="https://github.com/DeadlySage/CodeCatsMeetingScheduler/blob/main/public/project%20logo.png" alt="MeetingScheduler" width="250"></a>
  <br>
  Meeting Scheduler
  <br>
</h1>

![Demo_application](https://github.com/DeadlySage/CodeCatsMeetingScheduler/assets/80496757/0cfeb2c4-5d25-48c3-bbe6-8c1e3ef35d22)

<h4 align="center">A appointment management web application built using <a href="https://react.dev/" target="_blank">React</a>.</h4>

<p align="center">
  <a href= "#synopsis"><img src="https://img.shields.io/badge/Synopsis--ac67d1?style=for-the-badge&labelColor=2C3E50"></a> 
  <a href= "#features"><img src="https://img.shields.io/badge/Features--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
  <a href= "#preview"><img src="https://img.shields.io/badge/Preview--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
  <a href= "#testing"><img src="https://img.shields.io/badge/Testing--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
  <a href= "#deployment"><img src="https://img.shields.io/badge/Deployment--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
  <a href= "#how-to-use"><img src="https://img.shields.io/badge/How%20To%20Use--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
  <a href= "#project-timeline"><img src="https://img.shields.io/badge/Project%20Timeline--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
  <a href= "#credits"><img src="https://img.shields.io/badge/Credits--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
  <a href= "#contributors"><img src="https://img.shields.io/badge/Contributors--ac67d1?style=for-the-badge&labelColor=2C3E50"></a>
</p>


# Synopsis 

Project Goal: To enable instructors to easily manage appointments with students. 

Current methods of exchanging emails are inefficient and relies on the instructor to see the email and making not of it. With Meeting Scheduler it will be easier for instructors to see how many appointments they have with a quick glance. This will also make it easier for students to set up appointments as they will no longer have to write an email to the instructors. 

# Features

* Ease of Acess
  - Allow students the ability to reserve appointments using any browser.
  - Enables instructors to easily view / manage appointments through the browser.
* Set blocks of appointment for instructors
  - As an instructor you can set blocks of a set duration as appointments available to students.
  - As an instructor you can make specific blocks unavailable to prevent reservation from students.
  - Prioritize certain groups of students over others.
* Calendar view
  - Allows instructors and students to see at a glance how many appointment blocks are available.
  - Multiple calendar views available (month, week, day).
* Database backend for data storage & login system
* Signup & Login
  - Allows students & instructors to create an account and login.
  - Prevent fraudulent appointments from being made.
  - Peace of mind for instructors as the website will only accept student emails provided from university. 
* Note on appointment blocks
  - Allows instructors to add Zoom meeting links on the appointments for ease of use for both students and instructors.
* Cross platform
  - Windows, macOS and Linux ready.

# Preview
![Demo_Calendar](https://github.com/DeadlySage/CodeCatsMeetingScheduler/assets/80496757/1b8be754-0b9c-40c2-a806-b0b7bdf3efb1)
<h4 align="center">Multiview calendar support (Month/week/day/list) to enable ease of viewing for both students and teachers.</h4>
&nbsp;

![Demo_Create_meeting](https://github.com/DeadlySage/CodeCatsMeetingScheduler/assets/80496757/9f7fabe0-2fec-4d21-8e3f-8a755a4efa77)
<h4 align="center">Students and techers are able to create meetings.</h4>
&nbsp;

![Demo_Blocking_Meetings](https://github.com/DeadlySage/CodeCatsMeetingScheduler/assets/80496757/ea53ad77-7550-43aa-99c7-0f5f5c6edc4d)
<h4 align="center">Teachers are able to block-off certain times and days to prevent students from requesting meetings.</h4>
&nbsp;

![Demo_Admin_Dashboard](https://github.com/DeadlySage/CodeCatsMeetingScheduler/assets/80496757/62d9737d-170e-44e2-9ce3-3040f5882771)
<h4 align="center">Admin accounts are able to access the admin dashboard which allows them to delete students and view their accounts.</h4>
&nbsp;

<p align="center">
  <img src="https://github.com/DeadlySage/CodeCatsMeetingScheduler/assets/80496757/9a31edd6-6ddc-4839-aac6-3202501b51cf" alt="animated" />
</p>
<h4 align="center">Aplication is optimized to work on both desktop and mobile devices, enabling ease of use regardless of the device.</h4>
&nbsp;

# Testing
To perform testing simply follow these instructions:

System Requirements: </br>
Operating System: Windows 10/11 </br>
Node Version: 18.17.1 </br>
Npm Version:  9.6.7

```bash
# Install jest
$ npm i -save-dev jest

# Install super test
$ npm i -save-dev supertest

# Install mocha chai
$ npm i -save-dev mocha chai

# Install sinon
$ npm i -save-dev sinon

# Install chai-http
$ npm i -save-dev chai-http

# run all test
$ npm test

```

we use automated testing with Selenium IDE for sanity checks whenever a new build is pushed and the new updated build is live, to do this kind of testing simply download [Selenium IDE](https://www.selenium.dev/selenium-ide/) the testing files are available for download from [here](https://drive.google.com/file/d/1f1_Xsk0m1540XJTTXR8OsOXFdvImjvG7/view?usp=sharing)

Web Browser Environment Requirements: </br>
Microsoft Edge Version 119.0.2151.72 </br>
Chromium Version 119.0.6045.159 </br>
Operating System: Windows 10/11


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
$ node -v

```

# Project Timeline

![](https://github.com/DeadlySage/CodeCatsMeetingScheduler/blob/main/public/Project%20Timeline.jpg)

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
- [![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)](https://www.atlassian.com/software/jira)
- ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
- ![Selenium](https://img.shields.io/badge/-selenium-%43B02A?style=for-the-badge&logo=selenium&logoColor=white)

# Contributors

[![](https://img.shields.io/badge/Adrian%20Tandiono-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/DeadlySage)
[![](https://img.shields.io/badge/Andrew%20Abella-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/andrewabe1)
[![](https://img.shields.io/badge/Rick%20Ammann-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/rickramen)
[![](https://img.shields.io/badge/Derrick%20Seals--Belton-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/dseals0055)
[![](https://img.shields.io/badge/Lam%20Phan-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/lamphancs)
[![](https://img.shields.io/badge/Nick%20Bailey-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/bigboibailey)
[![](https://img.shields.io/badge/Jonathan%20Bui-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/iubs)
[![](https://img.shields.io/badge/Michael%20Lawler-DEV-cyan?style=for-the-badge&labelColor=2C3E50)](https://github.com/lawz4)
