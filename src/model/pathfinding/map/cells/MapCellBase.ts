import { IMapCell } from "./IMapCell";

export abstract class MapCellBase implements IMapCell {
    
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {

        this._x = x;
        this._y = y;
    }

    public get x(): number {

        return this._x;
    }

    public get y(): number {

        return this._y;
    }

    abstract get type(): string;
    abstract get isPassable(): boolean;
}