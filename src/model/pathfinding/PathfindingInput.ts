import { EventEmitter } from "../../common/EventEmitter";
import { disposeSymbol, IDisposible } from "../../common/IDisposible";
import { field as config } from "../../config/pathfinding";
import { Field } from "./map/Field";
import { IMazeGenerator } from "./map/maze/IMazeGenerator";
import { InstantStepController } from "./map/maze/InstantStepController";
import { MazeGenerator } from "./map/maze/MazeGenerator";
import { AsyncStepController } from "./map/maze/AsyncStepController";

const PATHFINDING_INPUT_UPDATED_EVENT = "ON_PATHFINDING_INPUT_UPDATED";

export interface IPathfindingInput {

    field: Field;

    enableStepExecution: boolean;
    generationsCount: number;
    canUpdate: boolean;
    mazeSeed: number;
    keepSeedValue: boolean;

    switchStepExecution(enable: boolean): void;
    switchSeedKeeper(enable: boolean): void;
    setMazeSeed(value: number): void;
    setGenerationsCount(count: number): void;
    setRandomMaze(): void;
    onInputUpdated(handler: () => void): void;
}

export class PathfindingInput implements IPathfindingInput, IDisposible {

    private readonly _eventEmitter: EventEmitter;

    private _generationsCount: number = 2;
    private _initialDensity: number = config.initialDensity;
    private _enableStepExecution: boolean = false;
    private _canUpdate: boolean = true;
    private _field: Field = new Field(config.height, config.width);
    private _mazeGenerator: IMazeGenerator;
    private _mazeSeed: number;
    private _keepMazeSeed: boolean = false;

    constructor() {

        this._eventEmitter = new EventEmitter();
        this._mazeSeed = this.getNextSeed();
        this._mazeGenerator = this.createGenerator(this._mazeSeed);

        this.onStepExecuted = this.onStepExecuted.bind(this);
    }
    
    public setMazeSeed(value: number) {

        if (value > config.maxMazeSeed || value < config.minMazeSeed) return;

        this._mazeSeed = value;
        this._keepMazeSeed = true;
    }

    public get keepSeedValue(): boolean {

        return this._keepMazeSeed;
    }

    public get mazeSeed(): number {

        return this._mazeSeed;
    }
   
    public get field(): Field {

        return this._field;
    }

    public get enableStepExecution(): boolean {

        return this._enableStepExecution;
    }
    
    public get generationsCount(): number {

        return this._generationsCount;
    }

    public get canUpdate(): boolean {
    
        return this._canUpdate;
    }

    public switchStepExecution(enable: boolean): void {

        this._enableStepExecution = enable;

        if (!this._mazeGenerator.isFinished) {

            this.setRandomMaze(this._mazeSeed);
        }
    }

    public switchSeedKeeper(enable: boolean): void {

        this._keepMazeSeed = enable;
    }

    public setGenerationsCount(count: number): void {

        if (count < config.minGenerationsCount || count > config.maxGenerationsCount) {

            return;
        }

        this._generationsCount = count;
    }

    public async setRandomMaze(seed?: number): Promise<void> {

        this._canUpdate = false;

        this._mazeSeed = !!seed 
            ? seed 
            : this.getNextSeed();

        if (!!this._mazeGenerator) {

            this._mazeGenerator.dispose()
        }

        this._mazeGenerator = this.createGenerator(this._mazeSeed);
        this._field = await this._mazeGenerator.generate();

        this._canUpdate = true;
        this._eventEmitter.emit(PATHFINDING_INPUT_UPDATED_EVENT);
    }

    public onInputUpdated(handler: () => void): void {

        this._eventEmitter.on(PATHFINDING_INPUT_UPDATED_EVENT, handler);
    }

    private getNextSeed(): number {

        return this._keepMazeSeed 
            ? this._mazeSeed
            : Math.floor(Math.random() * config.maxMazeSeed);
    }

    private onStepExecuted(field: Field): void {

        this._field = field;
        this._eventEmitter.emit(PATHFINDING_INPUT_UPDATED_EVENT);
    }
    
    private createGenerator(seed: number): IMazeGenerator {

        const stepController = this._enableStepExecution 
            ? new AsyncStepController(1)
            : new InstantStepController();

        return new MazeGenerator(
            seed,
            config.height, 
            config.width, 
            this._initialDensity, 
            this._generationsCount,
            this.onStepExecuted,
            stepController
        );
    }
    
    public [disposeSymbol](): void {
        
        this.dispose();
    }
    
    public dispose(): void {

        this._eventEmitter.clear();
    }
}
