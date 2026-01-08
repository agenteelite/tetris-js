import { TetrominoBag } from './Tetromino.js';
import { Tetromino } from '/scripts/Tetromino.js';

export class Grid {
    constructor(Canvas, rows, columns, cellSize, space) {
        this.Canvas = Canvas;
        this.ctx = Canvas.getContext("2d");
        this.rows = rows;
        this.columns = columns;
        this.cellSize = cellSize;
        this.space = space;
        //se modifico this.matriz para que se inicializara correctamente
        this.matriz = Array(rows).fill().map(() => Array(columns).fill(0));
        this.restartmatriz(); 

        this.Canvas.width = this.columns * (this.cellSize + this.space);
        this.Canvas.height = this.rows *  (this.cellSize + this.space);

        this.block = new Tetromino(this.Canvas, this.cellSize); 

        
    }
    //se modifico el metodo restartmatriz para que inicializara bien la matriz
    restartmatriz() {
        this.matriz = Array(this.rows).fill().map(() => Array(this.columns).fill(0));
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                this.matriz[r][c] = 0;
            }   
        }
    }
    
    //se agrego el metodo inInside para validar los limites
    inside(row, column) {
        return (row >= 0 && row < this.rows && column >= 0 && column < this.columns);
    }

    /*Se realizo una modificacion aqui
    se grego border y dentro de const borderSize se cambuio 10 por border
    */
    drawSquare(x, y,side, color, borderColor, border) {
        const borderSize = side / border;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,side,side);

        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderSize;
        this.ctx.strokeRect(x+borderSize/2, y+borderSize/2, side - borderSize, side - borderSize);
    }
    getCoordinates(column, row) {
        return {x: column * (this.cellSize + this.space), 
                y: row * (this.cellSize + this.space)};
    }  
    /* Se agrego en else el valor de 10 para laa medida del borde fantasma 
    el cual no funcionaba correctamente
    */
    draw () {
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.columns; c++) {
                const position = this.getCoordinates(c, r);

                if(this.matriz[r][c] !== 0) {
                    this.block.drawBlock(position.x, position.y, this.matriz[r][c]);
                }
                else {
                    this.drawSquare(position.x, position.y, this.cellSize, "#000","#303030", 10);
                }
            }
        }
        this.printMatriz();
    }
    printMatriz() {
        let text = "";
        this.matriz.forEach(row => {
            text += row.join(" ") + "\n";
        });
        console.log(text);
    }
    draw2() {
        this.drawBackground();
         for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.columns; c++) {
                const position = this.getCoordinates(c, r);

                if(this.matriz[r][c] !== 0) {
                    this.block.drawBlock(position.x, position.y, this.matriz[r][c]);
                }
                else {
                    this.drawSquare(position.x, position.y, this.cellSize, "#000","#303030", 10);
                }
            }
        } 
    }
    drawBackground() {
        this.ctx.fillStyle = "Black";
        this.ctx.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
    }
}

 