import { BlankMapCell } from "./cells/BlankMapCell";
import { DestinationPointMapCell } from "./cells/DestinationPointMapCell";
import { EntryPointMapCell } from "./cells/EntryPointMapCell";
import { IMapCell } from "./cells/IMapCell";
import { WallMapCell } from "./cells/WallMapCell";

export class Field {

    private readonly _height: number;
    private readonly _width: number;
    private readonly _cells: IMapCell[][];
    
    private _entry?: EntryPointMapCell; 
    private _destination?: DestinationPointMapCell; 

    constructor(height: number, width: number) {

        this._height = height;
        this._width = width;

        this._cells = [];

        for (let col = 0; col < width; col++) {
    
            this._cells[col] = [];

            for (let row = 0; row < height; row++) {

                this._cells[col][row] = new BlankMapCell(col, row);
            }
        }
    }
    
    public get height() : number {

        return this._height;
    }

    public get width() : number {

        return this._width;
    }

    public setEntrypoint(x: number, y: number): void {

        if (!!this._entry) {

            this.setBlankCell(this._entry.x, this._entry.y);
        }
        
        const entry = new EntryPointMapCell(x, y);
        
        this.setCell(x, y, entry);
        this._entry = entry;
    }
    
    public setDestinationPoint(x: number, y: number): void {

        if (!!this._destination) {

            this.setBlankCell(this._destination.x, this._destination.y);
        }

        const dest = new DestinationPointMapCell(x, y);
        
        this.setCell(x, y, dest);
        this._destination = dest;
    }

    public setWall(x: number, y: number) {

        this.setCell(x, y, new WallMapCell(x, y));
    }
    
    public setBlankCell(x: number, y: number) {

        this.setCell(x, y, new BlankMapCell(x, y));
    }
    
    public getCell(x: number, y: number): IMapCell {

        return this._cells[x][y];
    }

    public getEntrypoint(): EntryPointMapCell | undefined {

        return this._entry;
    }

    private setCell(x: number, y: number, cell: IMapCell) {

        this._cells[x][y] = cell;
    }
}

export function getFieldArea(field: Field, from: IMapCell, to: IMapCell): Field {

    const area = new Field(to.y - from.y + 1, to.x - from.x + 1);
    for (let x = from.x; x <= to.x; x++) {
        
        for (let y = from.y; y <= to.y; y++) {
            
            const cell = field.getCell(x, y);
            if (cell && !cell.isPassable) area.setWall(x, y);
        }    
    }

    return area;
}
