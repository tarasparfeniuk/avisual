import { EventEmitter } from "../../../common/EventEmitter";
import { BlankMapCell } from "./cells/BlankMapCell";
import { IMapCell } from "./cells/IMapCell";

export class Field {

    private readonly _height: number;
    private readonly _width: number;
    private readonly _cells: IMapCell[][];

    constructor(height: number, width: number) {

        this._height = height;
        this._width = width;

        this._cells = [];

        for (let col = 0; col < width; col++) {
    
            this._cells[col] = [];

            for (let row = 0; row < height; row++) {

                this._cells[col][row] = new BlankMapCell();
            }
        }
    }
    
    public get height() : number {

        return this._height;
    }

    public get width() : number {

        return this._width;
    }

    setCell(x: number, y: number, cell: IMapCell) {

        this._cells[x][y] = cell;
    }
    
    getCell(x: number, y: number): IMapCell {

        return this._cells[x][y];
    }
}
