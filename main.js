
// Select The canvas element in our html5 Document
var canvas = document.querySelector("canvas");

//assign to the canvas the width and the height of our browser windows
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//define canvas context
var c = canvas.getContext("2d");


//global variables..

//stores mouse X and Y position; default value is null
var mouse = {
    x:null,
    y:null
}
var lScore = 0;
var RScore = 0;

//Mouse event listenter. Pushes x and y mouse position to mouse var
window.addEventListener("mousemove", function (e) {
    mouse.y = e.clientY;
    mouse.x = e.clientX
})


//reboot ball to initial state
var reboot = false;
// speed array. I use an array because is i think the only way to get to exact diferent numbers randomly!
var ballSpeedXY = [10, -10];


//this is just a mathematical function for calculating distance bettwen two objects, i use it for collision managment

function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2.3) + Math.pow(yDistance, 2));

}

//Ball object have all the information to spawn the ball
var ball = {
    //X postion in canvas
    x: window.innerWidth / 2,
    //Y position in canvas
    y: window.innerHeight / 2,
    //circle radius
    radius: 20,
    //ball speed picked randomly inside the array over
    dx: ballSpeedXY[Math.floor(Math.random() * ballSpeedXY.length)],
    dy: ballSpeedXY[Math.floor(Math.random() * ballSpeedXY.length)],
    //draws the cirlce
    draw: function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fillStyle = 'white';
        c.fill();
    },

    /*contains all the logic that should be refreshed in each frame. I suggest to "methodise" each logic part to avoid
    crowding in this method
    */
    update: function () {

        //calculates the collision and bounce with screen width and add +1 score to lScore var
        if (this.x > window.innerWidth - this.radius ) {
            this.dx = -this.dx
            reboot = true
            lScore += 1
        }
        //calculates the collision and bounce with negative screen with and add +1 score to RScore var
        else if (this.x - this.radius < 0){
            reboot = true
            RScore += 1
        }
        //calculates the collision and bounce with screen height and negative height
        else if (this.y > window.innerHeight - this.radius
            || this.y - this.radius < 0) {
            this.dy = -this.dy

        }
        //Here i use the getDistance function i create before to calculate the collision betwen the ball and the rackets
        if (getDistance(l.x, l.y, ball.x, ball.y) < ball.radius + l.h) {
            ball.dx = -ball.dx
        }
        //collision for second racket
        if (getDistance(r.x, r.y, ball.x, ball.y) < ball.radius + r.h) {
            ball.dx = -ball.dx
        }
        //If a point is added, this condition will reboot the ball to the center of the screen and throw it at a random direction
        if (reboot == true) {
            this.x = window.innerWidth / 2;
            this.y = window.innerHeight / 2
            ball.dx = ballSpeedXY[Math.floor(Math.random() * ballSpeedXY.length)];
            ball.dy = ballSpeedXY[Math.floor(Math.random() * ballSpeedXY.length)];
            reboot = false

        }

        //Give speed to ball by incrementing dy velocity + Y axis and dx velocity + X axis
        this.y += this.dy;
        this.x += this.dx;

        //calls the draw method
        this.draw()
    }
};

// Creates the dotted net in the middle
var net = {
    //assign X and Y position in the center of the screen
    x: window.innerHeight / 2,
    y: window.innerHeight / 2,
    draw: function () {
        //creates the net
        c.strokeStyle = "white";
        c.beginPath();
        c.setLineDash([5, 10]);
        c.moveTo(window.innerWidth / 2, window.innerHeight / 2);
        c.lineTo(window.innerWidth / 2, -window.innerHeight);
        c.lineWidth = 5;
        c.stroke();

        c.strokeStyle = "white";
        c.beginPath();
        c.setLineDash([5, 10]);
        c.moveTo(window.innerWidth / 2, window.innerHeight / 2);
        c.lineTo(window.innerWidth / 2, window.innerHeight);
        c.lineWidth = 5;
        c.stroke();
    }

}

// left racket
var l = {
    //X position, by default undefined
    x: undefined,
    y: window.innerHeight / 2,
    h: 100,
    w: 20,
    dy: 0,
    //draws the racket
    draw: function () {
        c.fillStyle = "white";
        c.fillRect(this.x, this.y, this.w, this.h);
    },
    // refresh the racket
    update: function () {
        this.x = 70 + this.w
        // Translate Y position into Racket Y position
        this.y = mouse.y;
        this.draw()
    }
}
// Right racket
var r = {
    x: undefined,
    y: window.innerHeight / 2,
    h: 100,
    w: 20,
    dy: 0,

    //Contains the Simple ai pattern
    AI:function () {

        // If ball is at the same height as the racket dont accelerate
        if (ball.x > r.x){
        this.dy = 0;
    }
    /* if the ball is over the racket, pick a random number bettwen 0 and -11 and acelerate upwards
    * unfurtunately i haven´t resolve an issue involving the speed refreshing each frame...*/
    else if (ball.y < r.y){
        r.dy = Math.floor(Math.random() * -12);
        r.y += r.dy;

    }
    // if ball is under the racket pick a random value bettwen 0 and 11 and acelerate downward.
    else if ( ball.y > r.y) {
        r.dy = Math.floor(Math.random() * 12);
        r.y += r.dy;
    }



    },

    //avoids the racket guetting offScreen
    keepInBound:function() {
        //avoid clipping off Bottom screen
        var bottom = window.innerHeight - this.h;
        if (this.y > bottom) {
            this.y = bottom;
        }
        //avoid clipping off top screen
        else if (this.y < 10){
            this.y = 10
        }
    },
    //draw the right racket
    draw: function () {
        c.fillStyle = "white";
        c.fillRect(this.x, this.y, this.w, this.h);
    },


    update: function () {
        //define right racket position
        this.x = window.innerWidth - this.h - 70;

        //Calls the AI MANAGER methot
        this.AI();
        //call the keep in bound methot for usage
        this.keepInBound();
        this.draw()

    }
}
//generates the score text
var score = {
    x: window.innerHeight / 2,
    y: window.innerHeight / 2,
    draw: function () {
        c.font = "70px Arial Black";
        c.textAlign = "center"
        c.fillText(lScore,window.innerWidth / 2 / 1.7, window.innerHeight / 2 / 3);
        c.font = "70px Arial Black";
        c.textAlign = "center"
        c.fillText(RScore,window.innerWidth / 2 * 1.5 , window.innerHeight/ 2 / 3);
    }

}

//main game loop! It loops infinitly all the functions inside it!
function main() {

    //Erase all at the end of each frame
    c.clearRect(0, 0, innerHeight, innerWidth);

    //give bg color
    c.fillStyle = "black";
    c.fillRect(0, 0, innerWidth, innerHeight);


    // call elements to frame!
    l.update();
    r.update();
    ball.update();
    net.draw();
    score.draw();
    requestAnimationFrame(main)
}

main();
