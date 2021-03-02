import { EventEmitter } from "../../common/EventEmitter";
import { BubbleSortAlgorythmFactory } from "./bubble/BubbleSortAlgorythmFactory";
import { ISortAlgorythmFactory, ISortAlgorythm } from "./ISortAlgorythm";
import { MergeSortAlgorythmFactory } from "./merge/MergeSortAlgorythmFactory";
import { QuickSortAlgorythmFactory } from "./quick/QuickSortAlgorythmFactory";
import { ISortingInput, SortingInput, withGuard } from "./SortingInput";
import { demo as config } from "../../config/sorting";
import { IDisposible } from "../../common/IDisposible";
import { InsertionSortAlgorythmFactory } from "./insertion/InsertionSortAlgorythmFactory";

const STEP_EXECUTED_EVENT = "ON_STEP_EXECUTED_EVENT";

type DemoState = "PLAYING" | "PAUSED" | "STOPPED";

export class SortingDemoModel implements IDisposible {

    private readonly _compareFunc = (a: number, b: number) => a - b
    private readonly _input: SortingInput;
    private readonly _availableAlgorythms: ISortAlgorythmFactory<number>[];
    private readonly _eventEmitter: EventEmitter;

    private _algorythms: ISortAlgorythm<number>[];
    private _stepTimerId: any;
    private _demoSpeed: number;
    private _state: DemoState;

    constructor() {

        this._input = new SortingInput();
        this._input.onInputUpdated(this.onInputUpdatedHandler.bind(this));

        this._availableAlgorythms = [
            new BubbleSortAlgorythmFactory(this._compareFunc),
            new MergeSortAlgorythmFactory(this._compareFunc),
            new QuickSortAlgorythmFactory(this._compareFunc),
            new InsertionSortAlgorythmFactory(this._compareFunc)
        ];
        this._algorythms = [];
        this._state = "STOPPED";
        this._eventEmitter = new EventEmitter();

        this._demoSpeed = 10;
        this.executeStep = this.executeStep.bind(this);

        this._stepTimerId = setInterval(this.executeStep, config.stepInterval / this._demoSpeed);
    }

    public get input(): ISortingInput {

        return withGuard(() => this.canUpdateArray, this._input);
    }

    public get algorythms(): ISortAlgorythm<number>[] {

        return this._algorythms;
    }

    public get isPlaying(): boolean {

        return this._state === "PLAYING";
    }

    public get canPlay(): boolean {

        return this._algorythms.length > 0 && (this._state === "PAUSED" || this._state === "STOPPED");
    }

    public play(): void {

        if (this.canPlay) {

            if (this._state === "STOPPED") {
    
                this._algorythms = this._algorythms.map(i => i.copyWithArray(this._input.array));
            }

            this._state = "PLAYING";
        }
    }
    
    public get canPause(): boolean {

        return this._state === "PLAYING";
    }

    public pause(): void {

        if (this.canPause) {

            this._state = "PAUSED";
        }
    }
    
    public get canStop(): boolean {

        return this._state === "PLAYING" || this._state === "PAUSED";
    }

    public stop(): void {

        if (this.canStop) {

            this._state = "STOPPED";
        }
    }

    public get canUpdateArray(): boolean {

        return this._state === "STOPPED";
    }

    public get availableAlgorythms(): ISortAlgorythmFactory<number>[] {

        return this._availableAlgorythms;
    }

    public get canAddAlgorythm(): boolean {

        return this._state === "STOPPED";
    }

    public addAlgorythm(factory: ISortAlgorythmFactory<number>): void {

        const algo = factory.create(this._input.array);

        this._algorythms.push(algo);
    }

    public removeAlgorythm(id: number): void {

        this._algorythms.splice(id, 1);

        if (this._algorythms.length === 0) {
            
            this._state = "STOPPED";
        }
    }

    public get demoSpeed(): number {

        return this._demoSpeed;
    }

    public changeDemoSpeed(newSpeed: number): void {

        if (newSpeed > config.minSpeed && newSpeed < config.maxSpeed) {

            this._demoSpeed = newSpeed;

            clearInterval(this._stepTimerId);

            this._stepTimerId = setInterval(this.executeStep, config.stepInterval / this._demoSpeed);
        }
    }
    
    public onStepExecuted(handler: () => void): void {

        this._eventEmitter.on(STEP_EXECUTED_EVENT, handler);
    }

    public onInputUpdated(handler: () => void): void {

        this._input.onInputUpdated(handler);
    }

    private onInputUpdatedHandler(): void {

        this._algorythms = this._algorythms.map(i => i.copyWithArray(this._input.array));
    }

    private executeStep(): void {

        if (this._state === "PLAYING") {

            const unfinished = this._algorythms.filter(a => !a.isFinished);

            if (unfinished.length === 0) {

                this.stop();
            }

            unfinished.forEach((algo: ISortAlgorythm<number>) => {

                if (!algo.isFinished) {

                    algo.executeStep();
                }
            });

            this._eventEmitter.emit(STEP_EXECUTED_EVENT);
        }
    }

    public dispose(): void {

        clearInterval(this._stepTimerId);
        this._eventEmitter.clear();
        this._input.dispose();
    }
}
