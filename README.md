# Gluten Disk
A hologram game with Leap Motion controls. 

Gluten Disk is an arcade style shooter hack where players use the Leap Motion to shoot at a moving target seen through a Pepper's Ghost illusion. We are using Three.js to render a 3D scene and showing that scene and allow players to really see and aim in three dimensions with the Leap Motion.

In the future we would need a larger Prism and screen to increase the view area, and obtain a second leap motion so the other player can be controlled.

# Install
~~~
 // clone the repo
 git clone https://github.com/UpBeet/glutenbrick.git
 cd glutenbrick
 
 // install npm packages
 npm install
 
 // build client and run server 
 npm run start
```

# Commands
```
npm start // build and run server
npm run build // build client js
npm run watch // build and then watch for any changes to rebuild
```

# Dependicies
* Three.js
* Socket.io 
* Express
* Webpack
