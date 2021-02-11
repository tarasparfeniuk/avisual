import { AlgorythmInfo } from "../AlgorythmInfo";
import { AlgorythmStepEventStore } from "../AlgorythmStepEventStore";
import { ISortAlgorythm } from "./ISortAlgorythm";

export abstract class EventBasedSortAlgorythm<T> implements ISortAlgorythm<T> {

    private readonly _stepEventStore: AlgorythmStepEventStore;
    private readonly _info: AlgorythmInfo;

    private _isFinished: boolean;
    private _operationNumber: number;
    private _selection: number[];

    protected readonly _array: T[];
    protected readonly _compare: (a: T, b: T) => number;
    
    constructor(array: T[], compare: (a: T, b: T) => number, info: AlgorythmInfo) {

        this._array = [...array];
        this._compare = compare;
        this._stepEventStore = new AlgorythmStepEventStore();
        this._isFinished = false;
        this._operationNumber = 0;
        this._selection = [];
        this._info = info;

        this.algorythm()
            .finally(() => { this._isFinished = true; })
    }
    
    
    public abstract copyWithArray(array: T[]): ISortAlgorythm<T>;
    protected abstract algorythm(): Promise<void>;

    public get info(): AlgorythmInfo {

        return {
            name: "quick sort",
            link: "https://en.wikipedia.org/wiki/Quick_sort"
        };
    }

    public get array(): T[] {

        return this._array;
    }
    
    public get currentSelection(): number[] {

        return this._selection;
    }

    public get isFinished(): boolean {

        return this._isFinished;
    }
    
    public get currentOperationNumber(): number {

        return this._operationNumber;
    }

    public executeStep(): void {
        
        this._stepEventStore.dispatchStepEvent();
        this._operationNumber++;
    }

    protected setSelection(indexes: number[]): void {

        this._selection = indexes;
    }

    protected async waitForNextStep(): Promise<void> {

        const promise = new Promise<void>((resolve, reject) => {

            this._stepEventStore.onNextStep(() => resolve());
        });

        return promise;
    }
}
