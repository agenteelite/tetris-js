import { Grid } from '/scripts/grid.js'

export class BoardTetris extends Grid {
    constructor (Canvas, rows, columns, cellSize, space) {
        super(Canvas, rows, columns, cellSize, space);
    }
    inInside(row, column) {
        return (row >= 0 && row < this.rows && column >= 0 && column < this.columns);
    }
    isEmpty(row, column) {
        return this.inInside(row, column) && this.matriz[row][column] === 0;    
    }
    isRowFull(row) {
        return this.matriz[row].every(cell => cell !== 0);
    }
    isRowEmpty(row) {
        return this.matriz[row].every(cell => cell === 0);
    }
    clearRow(row) {
        this.matriz[row].fill(0);
    }
    moveRowDown(row, numRows) {
        this.matriz[row + numRows] = this.matriz[row].slice();
        this.clearRow(row);
    }
    clearfullRows() {
        let cont = 0;
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.isRowFull(row)) {
                this.clearRow(row);
                cont++;
            } else if (cont > 0) {
                this.moveRowDown(row, cont);
            }
        }
        return cont;
    }
    gameOver() {
        return !(this.isRowEmpty(0));
    }
    
}
export class BoardNext extends Grid {
    constructor (canvas, rows, columns, cellSize, space, listTetrominos) {
        super(canvas, rows, columns, cellSize, space);
        this.listTetrominos = listTetrominos;
        this.updateMatriz();
    }
    // Provide inInside here to ensure this.inInside exists for BoardNext instances
    inInside(row, column) {
        if (typeof super.inInside === 'function') {
            return super.inInside(row, column);
        }
        return (row >= 0 && row < this.rows && column >= 0 && column < this.columns);
    }
    //ahora aqui otro error 
    //paarece ser que this.matriz no esta definido muy bien 
    updateMatriz(){
        this.restartmatriz();
        let cont = 0;
        for (let i = 0; i< this.listTetrominos.length; i++){
            const shape = this.listTetrominos[i].currentShape();
            for (let j = 0; j < shape.length; j++){
                const row = shape[j].row + cont;
                const column = shape[j].column + 1; //centrar la pieza
                //ahora me sale error en this.inInside xd
                if (this.inInside(row, column)){ // se utiliza este medoto paraa validar los limites
                this.matriz[row][column] = this.listTetrominos[i].id;
            }
        }
        cont += 3;
        }
    }
}
