import { IRandom } from "../../../../common/IRandom";
import { BlankMapCell } from "../cells/BlankMapCell";
import { Field } from "../../map/Field";
import { IMapCell } from "../../map/cells/IMapCell";
import { WallMapCell } from "../../map/cells/WallMapCell";
import { IMazeGenerator } from "./IMazeGenerator";
import { LinearRandom } from "../../../../common/LinearRandom";

export abstract class MazeGeneratorBase implements IMazeGenerator {

    protected readonly _density: number;
    protected readonly _generations: number;
    protected readonly _height: number;
    protected readonly _width: number;
    protected readonly _random: IRandom;
    
    protected _field: Field;

    constructor(seed: number, height: number, width: number, density: number, generations: number) {

        this._width = width;
        this._height = height;
        this._field = new Field(height, width);
        this._density = density;
        this._generations = generations;
        
        this._random = new LinearRandom(seed);
    }
    
    abstract get isFinished(): boolean;

    abstract generate(): Promise<Field>;

    protected setNextState(x: number, y: number): void {

        const neighbors = this.getNeighbors(x, y);
        const passibleNeighbors = neighbors.filter(c => c.isPassable);

        if (passibleNeighbors.length > 1 && passibleNeighbors.length < 4) {

            this._field.setBlankCell(x, y);
        } else {

            this._field.setWall(x, y);
        }
    }

    protected getNeighbors(x: number, y: number): IMapCell[] {

        // TODO: Need to rewrite
        const neighbors = [];

        if (x + 1 < this._field.width)
            neighbors.push(this._field.getCell(x + 1, y));
        else
            neighbors.push(this._field.getCell(0, y));

        if (x - 1 >= 0)
            neighbors.push(this._field.getCell(x - 1, y));
        else
            neighbors.push(this._field.getCell(this._field.width - 1, y));

        if (y + 1 < this._field.height)
            neighbors.push(this._field.getCell(x, y + 1));
        else
            neighbors.push(this._field.getCell(x, 0));

        if (y - 1 >= 0)
            neighbors.push(this._field.getCell(x, y - 1));
        else
            neighbors.push(this._field.getCell(x, this._field.height - 1));

        return neighbors;
    }

    abstract dispose(): void;
}
