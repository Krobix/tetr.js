var canvas = document.getElementById("canv");
const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;
const DEFAULT_COLOR = "black";

class Square {
    constructor(id, x, y, size){
        this.color = DEFAULT_COLOR;
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.filled = false;
        this.piece = null;
    }

    draw(){
        var ctx = canvas.getContext("2d");
        ctx.clearRect(this.x*this.size, this.y*this.size, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = DEFAULT_COLOR;
        ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size);
        ctx.strokeRect(this.x*this.size, this.y*this.size, this.size, this.size);
    }
}

class Piece {
    constructor(game, x, y){
        this.game = game;
        console.log(this.game);
        this.squares = [];
        this.color = DEFAULT_COLOR;
        this.rotation = 0;
        this.moving = true;
    }

    moveDown(){
        this.emptySquares();
        for(var i=0; i<this.squares.length; i++){
            var x=this.squares[i].x, y=this.squares[i].y;
            var newSquare = this.game.getSquare(x, y+1);
            if(newSquare==null || newSquare.filled) {
                this.fillSquares();
                this.moving = false;
                break;
            }
            this.squares[i] = newSquare;
        }
    }

    moveLeft(){
        this.emptySquares();
        for(var i=0; i<this.squares.length; i++){
            var x=this.squares[i].x, y=this.squares[i].y;
            var newSquare = this.game.getSquare(x-1, y);
            if(newSquare==null || newSquare.filled) {
                this.fillSquares();
                break;
            }
            this.squares[i] = newSquare;
        }
    }

    moveRight(){
        this.emptySquares();
        for(var i=0; i<this.squares.length; i++){
            var x=this.squares[i].x, y=this.squares[i].y;
            var newSquare = this.game.getSquare(x+1, y);
            if(newSquare==null || newSquare.filled) {
                this.fillSquares();
                break;
            }
            this.squares[i] = newSquare;
        }
    }

    moveUp(){
        this.emptySquares();
        for(var i=0; i<this.squares.length; i++){
            var x=this.squares[i].x, y=this.squares[i].y;
            var newSquare = this.game.getSquare(x, y-1);
            if(newSquare==null || newSquare.filled) {
                this.fillSquares();
                break;
            }
            this.squares[i] = newSquare;
        }
    }

    fillSquares(){
        for(var i=0; i<this.squares.length; i++){
            this.squares[i].color = this.color;
            this.squares[i].filled = true;
            this.squares[i].piece = this;
        }
    }

    emptySquares(){
        for(var i=0; i<this.squares.length; i++){
            this.squares[i].color = DEFAULT_COLOR;
            this.squares[i].filled = false;
            this.squares[i].piece = null;
        }
    }

    get x(){
        return this.squares[0].x;
    }

    get y(){
        return this.squares[0].y;
    }
}

class TwoRotationsPiece extends Piece {
    constructor(game, x, y){
        super(game, x, y);
    }

    rotateLeft(){
        if(this.rotation==0) this.setRotation(1);
        else this.setRotation(0);
    }

    rotateRight(){
        this.rotateLeft();
    }
}

class FourRotationsPiece extends Piece {
    constructor(game, x, y){
        super(game, x, y);
    }

    rotateRight(){
        if(this.rotation==0) this.setRotation(1);
        else if(this.rotation==1) this.setRotation(2);
        else if(this.rotation==2) this.setRotation(3);
        else this.setRotation(0);
    }

    rotateLeft(){
        if(this.rotation==0) this.setRotation(3);
        else if(this.rotation==1) this.setRotation(0);
        else if(this.rotation==2) this.setRotation(1);
        else this.setRotation(2);
    }
}

class StraightPiece extends TwoRotationsPiece {
    constructor(game, x, y){
        super(game, x, y);
        this.color = "red";
        this.squares.push(this.game.getSquare(x, y));
        this.squares.push(this.game.getSquare(x+1, y));
        this.squares.push(this.game.getSquare(x+2, y));
        this.squares.push(this.game.getSquare(x+3, y));
    }

    setRotation(rot){
        var newSquares = [];
        var valid = true;
        this.emptySquares();
        
        if(rot==1 && this.rotation==0){
            var newX = this.squares[2].x;
            newSquares.push(this.game.getSquare(newX, this.squares[0].y-2));
            newSquares.push(this.game.getSquare(newX, this.squares[0].y-1));
            newSquares.push(this.squares[2]);
            newSquares.push(this.game.getSquare(newX, this.squares[3].y+1));
            //console.log("rot 1");
            //console.log(newSquares);
        }
        else if(rot==0 && this.rotation==1){
            var newY = this.squares[2].y;
            newSquares.push(this.game.getSquare(this.squares[0].x-2, newY));
            newSquares.push(this.game.getSquare(this.squares[0].x-1, newY));
            newSquares.push(this.game.getSquare(this.squares[0].x, newY));
            newSquares.push(this.game.getSquare(this.squares[0].x+1, newY));
            //console.log("rot 2");
        }
        
        for(var i=0; i<newSquares.length; i++){
            if(newSquares[i]==null || newSquares[i].filled){
                valid = false;
            }
        }
        if(valid && newSquares.length > 0){
            console.log("rot valid");
            this.squares = newSquares;
            this.rotation = rot;
        }
    }
}

class SquarePiece extends TwoRotationsPiece {
    constructor(game, x, y){
        super(game, x, y);
        this.color = "yellow";
        this.squares.push(this.game.getSquare(x, y));
        this.squares.push(this.game.getSquare(x, y+1));
        this.squares.push(this.game.getSquare(x+1, y+1));
        this.squares.push(this.game.getSquare(x+1, y));
    }

    setRotation(rot){
        //square pieces can't rotate
    }
}

class LPiece extends FourRotationsPiece {
    constructor(game, x, y){
        super(game, x, y);
        this.color = "purple";
        this.squares.push(this.game.getSquare(x, y));
        this.squares.push(this.game.getSquare(x+1, y));
        this.squares.push(this.game.getSquare(x+2, y));
        this.squares.push(this.game.getSquare(x+2, y+1));
    }

    setRotation(rot){
        var newSquares = [];
        var valid = true;
        this.emptySquares();

        if(rot==0){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y));
            newSquares.push(this.game.getSquare(this.x+2, this.y));
            newSquares.push(this.game.getSquare(this.x+2, this.y+1));
        }
        else if(rot==1){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y-1));
            newSquares.push(this.game.getSquare(this.x+1, this.y-2));
        }
        else if(rot==2){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x, this.y+1));
            newSquares.push(this.game.getSquare(this.x+1, this.y+1));
            newSquares.push(this.game.getSquare(this.x+2, this.y+1));
        }
        else if(rot==3){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y));
            newSquares.push(this.game.getSquare(this.x, this.y+1));
            newSquares.push(this.game.getSquare(this.x, this.y+2));
        }

        for(var i=0; i<newSquares.length; i++){
            if(newSquares[i]==null || newSquares[i].filled){
                valid = false;
            }
        }
        if(valid && newSquares.length > 0){
            console.log("rot valid");
            this.squares = newSquares;
            this.rotation = rot;
        }
    }
}

class SPiece extends TwoRotationsPiece {
    constructor(game, x, y){
        super(game, x, y);
        this.color = "green";
        this.squares.push(this.game.getSquare(x, y));
        this.squares.push(this.game.getSquare(x, y+1));
        this.squares.push(this.game.getSquare(x-1, y+1));
        this.squares.push(this.game.getSquare(x+1, y));
    }

    setRotation(rot){
        var newSquares = [];
        var valid = true;
        this.emptySquares();

        if(rot==0){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x, this.y+1));
            newSquares.push(this.game.getSquare(this.x-1, this.y+1));
            newSquares.push(this.game.getSquare(this.x+1, this.y));
        }
        else if(rot==1){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x, this.y+1));
            newSquares.push(this.game.getSquare(this.x+1, this.y+1));
            newSquares.push(this.game.getSquare(this.x+1, this.y+2));
        }

        for(var i=0; i<newSquares.length; i++){
            if(newSquares[i]==null || newSquares[i].filled){
                valid = false;
            }
        }
        if(valid && newSquares.length > 0){
            console.log("rot valid");
            this.squares = newSquares;
            this.rotation = rot;
        }
    }
}

class PlusPiece extends FourRotationsPiece {
    constructor(game, x, y){
        super(game, x, y);
        this.color = "blue";
        this.squares.push(this.game.getSquare(x, y));
        this.squares.push(this.game.getSquare(x+1, y));
        this.squares.push(this.game.getSquare(x+2, y));
        this.squares.push(this.game.getSquare(x+1, y+1));
    }

    setRotation(rot){
        var newSquares = [];
        var valid = true;
        this.emptySquares();

        if(rot==0){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y));
            newSquares.push(this.game.getSquare(this.x+2, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y+1));
        }
        else if(rot==1){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y));
            newSquares.push(this.game.getSquare(this.x+1, this.y-1));
            newSquares.push(this.game.getSquare(this.x+1, this.y+1));
        }
        else if(rot==2){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x, this.y+1));
            newSquares.push(this.game.getSquare(this.x+1, this.y+1));
            newSquares.push(this.game.getSquare(this.x-1, this.y+1));
        }
        else if(rot==3){
            newSquares.push(this.game.getSquare(this.x, this.y));
            newSquares.push(this.game.getSquare(this.x, this.y+1));
            newSquares.push(this.game.getSquare(this.x+1, this.y+1));
            newSquares.push(this.game.getSquare(this.x, this.y+2));
        }

        for(var i=0; i<newSquares.length; i++){
            if(newSquares[i]==null || newSquares[i].filled){
                valid = false;
            }
        }
        if(valid && newSquares.length > 0){
            console.log("rot valid");
            this.squares = newSquares;
            this.rotation = rot;
        }
    }
}

class Game {
    constructor(height, width){
        this.height = height; //height in terms of amount of squares
        this.width = width;
        this.squareSize = CANVAS_HEIGHT / height;
        this.squares = [];
        this.pieces = []; //SHOULD NOT INCLUDE CURRENT PIECE
        this.currentPiece = null;
    }

    genBoard(){
        var id=0;
        for(var i=0; i<this.height; i++){
            for(var j=0; j<this.width; j++){
                this.squares.push(new Square(id, j, i, this.squareSize));
                id++;
            }
        }
    }

    getSquare(x, y){
        for(var i=0; i<this.squares.length; i++){
            if(this.squares[i].x==x && this.squares[i].y==y) {
                return this.squares[i];
            }
        }
        return null;
    }

    genPiece(){
        var num = Math.floor(Math.random()*5);
        var x = Math.floor(this.width/3);
        if(num==0) this.currentPiece = new StraightPiece(this, x, 1);
        else if(num==1) this.currentPiece = new SquarePiece(this, x, 1);
        else if(num==2) this.currentPiece = new LPiece(this, x, 1);
        else if(num==3) this.currentPiece = new SPiece(this, x, 1);
        else this.currentPiece = new PlusPiece(this, x, 1);
        this.currentPiece.fillSquares();
    }

    draw(){
        for(var i=0; i<this.squares.length; i++){
            this.squares[i].draw();
        }
    }

    update(){
        if(this.currentPiece==null) this.genPiece();
        console.log(this.currentPiece);
        console.log(this.squares);

        this.currentPiece.moveDown();

        if(!this.currentPiece.moving) {
            this.pieces.push(this.currentPiece)
            this.currentPiece = null;
        }

        this.currentPiece.fillSquares();

        this.draw();
    }

}


function debugDrawTest(){
    var g = new Game(15, 15);
    g.genBoard();
    var p = new StraightPiece(g, 4, 0);
    var p2 = new SquarePiece(g, 0, 0);
    var p3 = new LPiece(g, 10, 0);
    var p4 = new SPiece(g, 8, 8);
    var p5 = new PlusPiece(g, 2, 10);
    p.moveDown();
    p.moveDown();
    p.moveDown();
    p.moveDown();
    p2.moveRight();
    p2.moveDown();
    p3.moveDown();
    p3.moveDown();
    p3.moveDown();
    p3.moveDown();
    p3.setRotation(3);
    p3.setRotation(0);
    p3.setRotation(1);
    p4.moveDown();
    p4.setRotation(1);
    p4.setRotation(0);
    p5.moveDown();
    p5.setRotation(1);
    p5.setRotation(2);
    p5.setRotation(3);
    p5.setRotation(0);
    p.fillSquares();
    p2.fillSquares();
    p3.fillSquares();
    p4.fillSquares();
    p5.fillSquares();
    g.draw();

    function rotateAllLeft(){
        p.rotateLeft();
        p2.rotateLeft();
        p3.rotateLeft();
        p4.rotateLeft();
        p5.rotateLeft();
        p.fillSquares();
        p2.fillSquares();
        p3.fillSquares();
        p4.fillSquares();
        p5.fillSquares();
        g.draw();
    }

    function rotateAllRight(){
        p.rotateRight();
        p2.rotateRight();
        p3.rotateRight();
        p4.rotateRight();
        p5.rotateRight();
        p.fillSquares();
        p2.fillSquares();
        p3.fillSquares();
        p4.fillSquares();
        p5.fillSquares();
        g.draw();
    }

    document.addEventListener('keydown', (event) => {
        if(event.key=="q") rotateAllLeft();
        else if(event.key=="e") rotateAllRight();
    });
}

function regularGame(){
    var game = new Game(20, 10);
    game.genBoard();
    document.addEventListener('keydown', (event) => {
        if(event.key=="q") game.currentPiece.rotateLeft();
        else if(event.key=="e") game.currentPiece.rotateRight();
        else if(event.key=="a") game.currentPiece.moveLeft();
        else if(event.key=="d") game.currentPiece.moveRight();
    });

    setInterval(function(){
        game.update();
    }, 1000);
}

regularGame();