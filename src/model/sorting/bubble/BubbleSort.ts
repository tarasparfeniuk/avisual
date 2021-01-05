import { AlgorythmInfo } from '../../AlgorythmInfo';
import { ISortAlgorythm } from '../ISortAlgorythm';
import { createSteps, AlgorythmStep } from '../../AlgorythmStep';

export class BubbleSort<T> implements ISortAlgorythm<T> {

    private readonly _array: T[];
    private readonly _compare: (a: T, b: T) => number;

    private _currentStep?: AlgorythmStep;
    private _isDone: boolean;

    private _i: number;
    private _j: number;

    private _currentOperationNumber: number;

    constructor(array: T[], compare: (a: T, b: T) => number) {

        this._array = [...array];
        this._compare = compare;

        this._isDone = false

        this._i = 0;
        this._j = -1;

        this._currentOperationNumber = 0;
        this._currentStep = createSteps([ this.incrementIndexes.bind(this), this.swapElements.bind(this) ])
    }

    public get currentOperationNumber(): number {

        return this._currentOperationNumber;
    }

    public get info(): AlgorythmInfo {

        return {
            name: "bubble sort",
            link: "https://en.wikipedia.org/wiki/Bubble_sort"
        };
    }

    public get array(): T[] {

        return this._array;
    }

    public sort(): T[] {

        while (!this._isDone) {

            this.executeStep();
        }

        return this._array;
    }

    public get isFinished(): boolean {

        return this._isDone;
    }

    public get currentSelection(): number[] {

        return [ this._j, this._j + 1 ];
    }

    public executeStep(): void {

        this._currentStep?.execute();
        this._currentStep = this._currentStep?.next;
        this._currentOperationNumber++;
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {

        return new BubbleSort<T>(array, this._compare);
    }

    private incrementIndexes(): void  {

        this._j++;

        if (this._j === this._array.length - this._i - 1) {

            this._i++;
            this._j = 0;
        }

        if (this._i === this._array.length - 1) {

            this._isDone = true;
        }
    } 

    private swapElements(): void {

        const a = this._array[this._j];
        const b = this._array[this._j + 1];

        const needSort = this._compare(a, b) > 0;

        if (needSort) {

            this._array[this._j] = b;
            this._array[this._j + 1] = a;
        }
    }
}