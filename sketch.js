var bg,bgImage;
var invisibleGround;
var player,playerImg;
var obstacle, obstacle1,obstacle2,obstacle3,obstacle4, obstacleGroup;
var points, point1,point2,point3, pointsGroup;
var startBg,startBgImg;
var resetButton, resetImg;
var count = 0;
var playButton,playButtonImg;
var lifeImg;
var score = 0;
var life = 3;
var gameState  = "start";
var clickSound, hitSound, gameOverSound, pointSound, checkPointSound;

function preload(){
bgImg = loadImage("Background.jpg");

playerImg = loadImage("Player.png");

obstacle1 = loadImage("Obstacle1.png");
obstacle2 = loadImage("Obstacle2.png");
obstacle3 = loadImage("Obstacle3.png");
obstacle4 = loadImage("Obstacle4.png");

point1 = loadImage("Point1.png");
point2 = loadImage("Point2.png");
point3 = loadImage("Point3.png");

playButtonImg = loadImage("PlayButton.png");
resetImg = loadImage("ResetButton.png")
lifeImg = loadImage("Life.png");
startBgImg = loadImage("StartingImg.jpeg");

clickSound = loadSound("Click.wav");
hitSound = loadSound("Hit.wav");
gameOverSound = loadSound("GameOver.wav");
pointSound = loadSound("Point.wav");
checkPointSound = loadSound("Checkpoint.wav")
}

function setup() {
  createCanvas(1000,500);

    bg = createSprite(500,50,1000,500);
    bg.addImage("background",bgImg);
    bg.scale = 3;
    bg.x = bg.width/2

  invisibleGround = createSprite(500,470,1000,10);
  invisibleGround.visible = false;

  player = createSprite(100,400,20,50);
  player.addImage("player",playerImg);
  player.scale = 0.6;

  startBg = createSprite(500,120,1200,550);
  startBg.addImage("startimg",startBgImg);
  startBg.scale = 0.9;

  playButton = createSprite(500,100,200,550);
  playButton.addImage("playButton",playButtonImg);

  resetButton = createSprite(500,300,50,50);
  resetButton.addImage("reset",resetImg);
  resetButton.scale = 0.2

  obstacleGroup = new Group();
  pointsGroup = new Group();

  player.setCollider("rectangle",50,0,200,200)
  player.debug = false;
}

function draw() {
  background(0);
  drawSprites();
 
  if(gameState === "start"){
    fill("darkblue");
    textSize(30)
    textStyle("bold");
    text("CLICK HERE TO START", 350,230);

    bg.visible = false;
    player.visible = false;
    playButton.visible = true;
    startBg.visible = true;
    resetButton.visible = false;

    fill("white");
    textSize (15);
    text("Collect the garbage to win!", 100,30);

    if(mousePressedOver(playButton)){
      gameState = "play";
      clickSound.play()
    }
  }

  if(gameState === "play"){

    fill("white");
    textSize (40);
    text("Score:" + score, 750,70);
  
    bg.visible = true;
    player.visible = true;
    playButton.visible = false;
    startBg.visible = false;
    resetButton.visible = false;
  
    count = count+1
    bg.velocityX = -(5+count/100);

    createObstacle();
    spawnPoints();

    if(keyDown("UP_ARROW")){
      player.y=player.y - 6;
    }

    if(keyDown("DOWN_ARROW")){
      player.y=player.y + 6;
    }


    if(bg.x < 0){
      bg.x = bg.width/2;
   }

    if(score>0 && score%50 === 0 ){
     checkPointSound.play();

     fill("white");
     textSize (50);
     textStyle("bold");
     text("CHECKPOINT", 350,250);

    }

    if(player.isTouching(obstacleGroup)){
      obstacleGroup.destroyEach();
      life = life-1
      hitSound.play()
    }

    if(life === 3){
      image(lifeImg,425,25,50,50);
      image(lifeImg,475,25,50,50);
      image(lifeImg,525,25,50,50);
    }
    if(life === 2){
      image(lifeImg,425,25,50,50);
      image(lifeImg,475,25,50,50); 
    }

    if(life === 1){
      image(lifeImg,425,25,50,50);
    }

    if(life === 0){
      gameState = "end";
      gameOverSound.play()
    }

    if (player.isTouching(pointsGroup)){
      score = score+5;
      pointsGroup.destroyEach();
      pointSound.play()
    }

    if(score === 500){
      gameState = "win";
    }

  }

  else if(gameState === "end"){
    fill("white");
    textSize (40);
    text("Final Score: " + score, 700,50);

     fill("white");
     textSize (50);
     textStyle("bold");
     text("GAME OVER", 350,250);
   resetButton.visible = true;

   if(mousePressedOver(resetButton)){
     restart()
   }

  bg.velocityX = 0;
  player.velocityY = 0;
  obstacleGroup.setVelocityXEach(0);
  pointsGroup.setVelocityXEach(0);

  }

  else if(gameState === "win"){
    fill("white");
    textSize (40);
    text("Final Score: " + score, 700,50);

    fill("white");
    textSize (50);
    textStyle("bold");
    text("YOU WIN!!", 350,250);

    resetButton.visible = true;
    
    if(mousePressedOver(resetButton)){
      restart()
    }

   bg.velocityX = 0;
   player.velocityY = 0;
   obstacleGroup.setVelocityXEach(0);
   pointsGroup.setVelocityXEach(0);
  }

  player.collide(invisibleGround);

  
}

function restart(){
  gameState = "play"
  life = 3;
  score = 0;
  count = 0;
  obstacleGroup.destroyEach()
  pointsGroup.destroyEach()
}

function createObstacle(){
  if(frameCount % 145 === 0){
    obstacle = createSprite(1400,420,30,80)
    obstacle.y = Math.round(random(100,400));
    obstacle.velocityX = -(7+count/100);

    var rand = Math.round(random(1,4));
     switch(rand) {
     
       case 1: obstacle.addImage(obstacle1); 
       break;
       case 2: obstacle.addImage(obstacle2); 
       break;
       case 3: obstacle.addImage(obstacle3);
       break;
       case 4: obstacle.addImage(obstacle4);
       break;
       default: break; 
          }

          obstacle.scale = 0.4;

          obstacleGroup.add(obstacle);
  }
}

function spawnPoints(){
  if(frameCount %140=== 0){
    points = createSprite(1200,320,30,20);
    points.y = Math.round(random(100,400));
    points.velocityX = -(7+count/100);

   var rand = Math.round(random(1,3));
    switch(rand) {
    
      case 1: points.addImage(point1); 
      break;
      case 2: points.addImage(point2); 
      break;
      case 3: points.addImage(point3);
      break;
      default: break; 
         }

         points.scale = 0.2;
    pointsGroup.add(points);
  }
}