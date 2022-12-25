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
        this.squares = [];
        this.color = DEFAULT_COLOR;
        this.x = x;
        this.y = y;
        this.rotation = 0;
    }

    moveDown(){
        this.emptySquares();
        for(var i=0; i<this.squares.length; i++){
            var x=this.squares[i].x, y=this.squares[i].y;
            var newSquare = this.game.getSquare(x, y+1);
            if(newSquare==null || newSquare.filled) {
                this.fillSquares();
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
        }
    }

    emptySquares(){
        for(var i=0; i<this.squares.length; i++){
            this.squares[i].color = DEFAULT_COLOR;
            this.squares[i].filled = false;
        }
    }
}

class StraightPiece extends Piece {
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
        this.emptySquares();
        
        if(rot==1 && this.rotation==0){
            var newX = this.squares[2].x;
            newSquares.push(this.game.getSquare(newX, this.squares[0].y-2));
            newSquares.push(this.game.getSquare(newX, this.squares[0].y-1));
            newSquares.push(this.squares[2]);
            newSquares.push(this.game.getSquare(newX, this.squares[3]))
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

    draw(){
        for(var i=0; i<this.squares.length; i++){
            this.squares[i].draw();
        }
    }

}


function debugDrawTest(){
    var g = new Game(10, 10);
    g.genBoard();
    var p = new StraightPiece(g, 4, 0);
    g.squares[50].color = "pink";
    g.getSquare(1, 1).color = "red";
    g.getSquare(0, 0).color = "blue";
    g.getSquare(1, 0).color = "purple";
    g.getSquare(1, 0).filled = true;
    p.moveLeft();
    p.moveLeft();
    p.moveLeft();
    p.moveLeft();
    p.moveRight();
    p.fillSquares();
    g.draw();
}

debugDrawTest();