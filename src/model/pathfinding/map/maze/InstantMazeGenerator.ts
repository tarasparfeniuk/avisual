import { BlankMapCell } from "../cells/BlankMapCell";
import { Field } from "../../map/Field";
import { WallMapCell } from "../../map/cells/WallMapCell";
import { MazeGeneratorBase } from "./MazeGeneratorBase";
import { IMazeGenerator } from "./IMazeGenerator";

export class InstantMazeGenerator extends MazeGeneratorBase implements IMazeGenerator {

    constructor(seed: number, height: number, width: number, density: number, generations: number) {

        super(seed, height, width, density, generations);
    }

    public get isFinished(): boolean {
        
        return true;
    }

    public generate(): Promise<Field> {

        this._field = new Field(this._height, this._width);

        this.setRandomCells(this._density);

        for (let g = 0; g < this._generations; g++) {

            this.setNextGeneration();
        }

        return Promise.resolve(this._field);
    }

    private setNextGeneration(): void {

        for (let x = 0; x < this._field.width; x++) {

            for (let y = 0; y < this._field.height; y++) {

                this._field.setCell(x, y, this.getNextState(x, y));
            }
        }
    }

    private setRandomCells(density: number): void {

        for (let x = 0; x < this._field.width; x++) {

            for (let y = 0; y < this._field.height; y++) {

                const rand = this._random.next();

                if (Math.floor(rand * density) === 1) {

                    this._field.setCell(x, y, new BlankMapCell());
                } else {

                    this._field.setCell(x, y, new WallMapCell());
                }
            }
        }
    }

    dispose() { }
}
