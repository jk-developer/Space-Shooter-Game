function loadImages(){
    enemyImage = new Image();
    shipImage = new Image();
    
    enemyImage.src = "Images/enemy.png";
    shipImage.src = "Images/player.png";
}


function init(){
    /*
    document.getElementsByTagName('canvas')[0];
    */

    // canvas
    canvas = document.getElementById('mycanvas');
    console.log(canvas);
    
    // pen of our canvas
    pen = canvas.getContext('2d');
    
    W = canvas.width;
    H = canvas.height;
    
    counter = 0;
    prev_counter = 0;
    
    gameover = false;
    
    loadImages();
    
    ship = {
        x: 300,       // initial coordinate of
        y: H - 50,    // the ship
        w: 50,       // width of the ship
        h: 50,       // height of the ship
        speed: 3,    // speed of the ship
        bullets: [],  //empty array for storing the bullets
        
        draw: function(){     // for drawing the image inplace of ship
            //pen.fillStyle = "red";
            //pen.fillRect(ship.x,ship.y,ship.w,ship.h);
            
            
            pen.drawImage(shipImage,ship.x,ship.y,ship.w,ship.h);
        },
        
        update: function(){         // function for moving the ship 
            this.x += this.speed;
            
            // to bounce back between the boundaries
            if(this.x > W-this.w || this.x <= 0){
                this.speed *= -1;
            }
        },
        shoot:function(){        //  function for shooting a bullet from the ship   
            if(counter - prev_counter >=50){ //  means max 50 bullets you can get in one game
                console.log("Shooting a bullet");
                var bull = new bullet(this.x+(this.w)/2,this.y,10);    // store in bull var and used for firing the bullet from mid of the ship

                this.bullets.push(bull);     // push the bullet into the array bullets[]
                prev_counter = counter;                
            }           
        }
    };
    
    
    
    /* Listen for events */
    function buttonGotPressed(e){
        if(e.key == " "){     // means when we press spacebar then a bullet is fired
            ship.shoot();
        }
       // if(e.key == "ArrowLeft"){
            
       // }
    }
    
    document.addEventListener('keydown',buttonGotPressed); // means when the spacebar button is pressed then buttonGotPressed function is called
     enemies = [];     // a new empty array of name enemies is created 
    var e = new enemy(10,20,5);
    
    enemies.push(e);
    

}

function bullet(x,y,speed){
    this.x = x;
    this.y = y;
    this.w = 5;
    this.h = 20;
    this.speed = speed;
    this.state = "active";
    
    this.draw = function(){
        pen.fillStyle = "green";
        pen.fillRect(this.x,this.y,this.w,this.h);
    }
    
    this.update = function(){
        this.y -= this.speed;
        if(this.y<=0){
            this.state = "inactive";
        }
    }
}

function enemy(x,y,speed){
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.speed = speed;
    
    this.draw = function(){
        pen.drawImage(enemyImage,this.x,this.y,this.w,this.h);
    };
    
    this.update = function(){              
            this.x += this.speed;
            
            if(this.x > W-this.w || this.x <= 0){
                this.speed *= -1;
            }     
        this.y++;
    };
}


function draw(){
    // Erase the old screen
    pen.clearRect(0,0,W,H);
    pen.fillStyle = "red";
    
    // Ship Draw
    ship.draw();
    
    // Bullets Draw
    ship.bullets.forEach(function(bullet){
        bullet.draw();
    });
    
    // Enemy Draw
    enemies.forEach(function(enemy){
        enemy.draw();
    });
    
    

}

function update(){
    ship.update();
    
    ship.bullets.forEach(function(bullet){
        bullet.update();
    });
    
    enemies.forEach(function(enemy){
        enemy.update();
    });
    
    var no = Math.random();
    if(no<=0.01){  // 1% probability of enemy generation
        var x = Math.floor(Math.random() * (W-50));
        var y = Math.floor(Math.random() * 100);  // 0 - 100
        
        var speed = Math.random()*10 + 2;  // 2 - 12
        var negative = Math.random();
        if(negative<.5){  // 505 probability
            speed = -speed;
        }
        var e = new enemy(x,y,speed);
        enemies.push(e);
    }
    
    enemies.forEach(function(enemy){
        if(isColliding(ship,enemy)){
            alert("Game Over");
            gameover = true;
        }
    });
}

function isColliding(r1,r2){
    var x_axis = Math.abs(r1.x - r2.x) <= Math.max(r1.w,r2.w);
    var y_axis = Math.abs(r1.y - r2.y) <= Math.max(r1.h,r2.h);
    
    return x_axis && y_axis;
}

function render(){
    draw();
    update();
    console.log("in render");
    counter++;
    
    // for automatic looping
    if(gameover == false){
        window.requestAnimationFrame(render);  //[or we can use setInterval]        
    }
    else{
        startGame();
    }
}

function startGame(){
    init();
    render();
}

startGame();
