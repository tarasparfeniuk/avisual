import { EventEmitter } from "../../../../common/EventEmitter";
import { BlankMapCell } from "../cells/BlankMapCell";
import { Field } from "../../map/Field";
import { WallMapCell } from "../../map/cells/WallMapCell";
import { MazeGeneratorBase } from "./MazeGeneratorBase";
import { IMazeGenerator } from "./IMazeGenerator";

const STEP_INITIATED_EVENT = "STEP_INITIATED_EVENT";

export class StepByStepMazeGenerator extends MazeGeneratorBase implements IMazeGenerator {

    private readonly _eventEmitter: EventEmitter;
    private readonly _onStepExecuted: (field: Field) => void;

    private _timerId: any;
    private _isFinished: boolean;

    constructor(
        seed: number,
        height: number, 
        width: number, 
        density: number, 
        generations: number, 
        onStepExecuted: (field: Field) => void
    ) {

        super(seed, height, width, density, generations);

        this._isFinished = false;
        this._eventEmitter = new EventEmitter();
        this._onStepExecuted = onStepExecuted;
    }

    public async generate(): Promise<Field> {

        if (!!this._timerId) {

            clearInterval(this._timerId);
        }

        this._field = new Field(this._height, this._width);
        this._timerId = setInterval(() => this.executeStep(), 1);

        await this.algorythm();

        this._isFinished = true;
        clearInterval(this._timerId);

        return this._field;
    }

    public get isFinished(): boolean {

        return this._isFinished;
    }

    private executeStep(): void {

        this._onStepExecuted(this._field);
        this._eventEmitter.emit(STEP_INITIATED_EVENT);
    }

    private async algorythm(): Promise<void> {

        await this.setRandomCells(this._density);

        for (let g = 0; g < this._generations; g++) {

            await this.waitForNextStep();
            await this.setNextGeneration();
        }
    }

    private async waitForNextStep(): Promise<void> {

        const promise = new Promise<void>((resolve, reject) => {

            this._eventEmitter.once(STEP_INITIATED_EVENT, () => resolve());
        });

        return promise;
    }

    private async setNextGeneration(): Promise<void> {

        for (let x = 0; x < this._field.width; x++) {

            await this.waitForNextStep();

            for (let y = 0; y < this._field.height; y++) {

                this.setNextState(x, y);
            }
        }
    }

    private async setRandomCells(density: number): Promise<void> {

        for (let x = 0; x < this._field.width; x++) {

            await this.waitForNextStep();

            for (let y = 0; y < this._field.height; y++) {

                const rand = this._random.next();
                
                if (Math.floor(rand * density) === 1) this._field.setBlankCell(x, y);
                else this._field.setWall(x, y);
            }
        }
    }

    dispose() {
        
        if (!!this._timerId) {

            clearInterval(this._timerId);
        }  
    }
}
