
import { TetrominoBag } from "/scripts/Tetromino.js";

import { BoardTetris, BoardNext } from "/scripts/boardTetris.js";

export class Game {
    constructor(canvas, rows, columns, cellSize, space, canvasNext) {
        this.boardTetris = new BoardTetris(canvas, rows, columns, cellSize, space);
        this.tetrominoBag = new TetrominoBag(canvas, cellSize);
        this.currentTetromino = this.tetrominoBag.nextTetromino();
        this.keys = {up: false, down: false};
        this.keyboard();

        this.lastTime = 0;
        this.lastTime2 = 0;
        //error arreglado
        this.next = new BoardNext(canvasNext, 8, 4, cellSize, space, this.tetrominoBag.getThreeNextT());
    }
    update() {

        let currentTime = Date.now();
        let deltaTime = currentTime - this.lastTime;
        let deltaTime2 = currentTime - this.lastTime2;
        if (deltaTime > 1000) {
            this.autoMoveTetrominoDown();
            this.lastTime = currentTime;
        }
        if(deltaTime2 > 50) {
            this.boardTetris.draw();
            this.drawghost();
            this.currentTetromino.draw(this.boardTetris);

            this.next.draw2();

            if(this.keys.down) {
                this.moveTetrominoDown();
            }
            this.lastTime2 = currentTime;
        }
        
    }
    /*sucede un error en este metodo autoMoveTetrominoDown
    al parecer no baja el tetromino automaticamente
    tal vez por un error en el tiempo o en la logica del metodo
    */

    autoMoveTetrominoDown() {
        this.currentTetromino.move(1,0);
        if(this.blockedTetromino()){
            this.currentTetromino.move(-1,0);
            this.placeTetromino();

        }
    }
    blockedTetromino() {
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            const row = tetrominoPositions[i].row;
            const column = tetrominoPositions[i].column;
            if (!this.boardTetris.isEmpty(row, column)) {
                return true;
            }
        }
        return false;
    }
    moveTetrominoLeft() {
        this.currentTetromino.move(0,-1);
        if(this.blockedTetromino()) {
            this.currentTetromino.move(0,1);
        }
    }
    moveTetrominoRight() {
        this.currentTetromino.move(0,1);
        if(this.blockedTetromino()) {
            this.currentTetromino.move(0,-1);
        }
    }
    moveTetrominoDown() {
        this.currentTetromino.move(1,0);   
        if(this.blockedTetromino()) {
            this.currentTetromino.move(-1,0);
        }
    }
    rotateTetrominoCW() {
        this.currentTetromino.rotation++;
        if(this.currentTetromino.rotation > this.currentTetromino.shapes.length - 1) {
            this.currentTetromino.rotation = 0;
        }
        if(this.blockedTetromino()) {
            this.rotateTetrominoCCW();
        }
    }
    rotateTetrominoCCW() {
        this.currentTetromino.rotation--;
        if(this.currentTetromino.rotation < 0) {
            this.currentTetromino.rotation = this.currentTetromino.shapes.length - 1;
        }
        if(this.blockedTetromino()) {
            this.rotateTetrominoCW();
        }
    }
    keyboard(){
        window.addEventListener("keydown", (evt) => {
            if(evt.key === "ArrowLeft") {
                this.moveTetrominoLeft();
            }
            if(evt.key === "ArrowRight") {
                this.moveTetrominoRight();
            }
            if(evt.key === "ArrowUp" && !this.keys.up) {
                this.rotateTetrominoCW();
                this.keys.up = true;
            }
            if(evt.key === "ArrowDown") {
                this.moveTetrominoDown();
                this.keys.down = true;
            }
        });
        window.addEventListener("keyup", (evt) => {
            if(evt.key === "ArrowUp") {
                this.keys.up = false;
            }
            if(evt.key === "ArrowDown") {
                this.keys.down = false;
            }
        });
    }
    //me aparece la paantalla pero en negro
    //haay que buscaar el error otra vez :"v"
    
    placeTetromino() {
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            this.boardTetris.matriz
                [tetrominoPositions[i].row]
                [tetrominoPositions[i].column] = this.currentTetromino.id;
        }
        this.boardTetris.clearfullRows();

        if(this.boardTetris.gameOver()) {
            return true
        } else {
            this.currentTetromino = this.tetrominoBag.nextTetromino();
            this.next.listTetrominos = this.tetrominoBag.getThreeNextT();
            this.next.updateMatriz();
        }
    }

    //posiblemente lo deje ya que no afecta en nada
    
    dropdistance(position) {
        let distance = 0;
        while (this.boardTetris.isEmpty(position.row + distance + 1, position.column)) {
            distance++;
        }
        return distance;
    }
    tetrominoDrop() {
        let drop = this.boardTetris.rows;
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            drop = Math.min(drop, this.dropdistance(tetrominoPositions[i]))    
        }
        return drop;
    }


    drawghost() {
        const dropDistance = this.tetrominoDrop();
        const tetrominoPositions = this.currentTetromino.currentPosition();
        for (let i = 0; i < tetrominoPositions.length; i++){
            let position = this.boardTetris.getCoordinates(
                tetrominoPositions[i].column,
                tetrominoPositions[i].row + dropDistance
            );
            //bloque fantasma
            this.boardTetris.drawSquare(position.x, position.y, 
                this.boardTetris.cellSize, "rgba(0,0,0,0.25)", "white", 20);
        }
    }
    dropBlock(){
        this.currentTetromino.move(this.tetrominoDrop(), 0);
        this.placeTetromino();
    }
        
    //Hasta aqui
}