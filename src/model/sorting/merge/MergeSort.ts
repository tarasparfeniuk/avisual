import { AlgorythmInfo } from '../../AlgorythmInfo';
import { ISortAlgorythm } from '../ISortAlgorythm';

type MergeSortContext = { left: number, right: number, middle: number, nextStep: MergeSortStep };
type MergeSortStep = () => void;

export class MergeSort<T> implements ISortAlgorythm<T> {

    private readonly _contextStack: MergeSortContext[];

    private readonly _array: T[];
    private readonly _compare: (a: T, b: T) => number;

    private _nextStep: MergeSortStep;
    private _isDone: boolean;

    private _middle: number;
    private _right: number;
    private _left: number;

    private _leftSubArray: T[];
    private _rightSubArray: T[];

    private _leftMergeIdx: number;
    private _rightMergeIdx: number;
    private _mergeIdx: number;

    private _currentOperationNumber: number;

    constructor(array: T[], compare: (a: T, b: T) => number) {

        this._array = [...array];
        this._compare = compare;

        this._isDone = false

        this._middle = -1;
        this._left = 0;
        this._right = array.length - 1;

        this._currentOperationNumber = 0;
        this._nextStep = this.setArrayMiddle;

        this._mergeIdx = -1;
        this._leftMergeIdx = -1;
        this._rightMergeIdx = -1;

        this._leftSubArray = [];
        this._rightSubArray = [];

        this._contextStack = [];
    }

    public get currentOperationNumber(): number {

        return this._currentOperationNumber;
    }

    public get info(): AlgorythmInfo {

        return {
            name: "merge sort",
            link: "https://en.wikipedia.org/wiki/Merge_sort"
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

        const selection: number[] = [];

        for (let i = this._left; i <= this._right; i++) {

            selection.push(i);
        }

        return selection;
    }

    public executeStep(): void {
        
        this._nextStep();

        this._currentOperationNumber++;
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {

        return new MergeSort<T>(array, this._compare);
    }

    private setArrayMiddle(): void {

        this._middle = Math.floor((this._right + this._left) / 2);

        this._nextStep = this.mergeSortLeft;
    }

    private mergeSortLeft(): void {

        this._nextStep = this.mergeSortRight;
        
        if (this._right <= this._left) {

            this.restoreContext();

            return;
        }

        this.saveContext();

        this._right = this._middle;

        this._nextStep = this.setArrayMiddle;
    }

    private mergeSortRight(): void {
       
        if (this._right <= this._left) {

            this.restoreContext();
            
            return;
        }

        this._nextStep = this.merge;

        this.saveContext();

        this._left = this._middle + 1;

        this._nextStep = this.setArrayMiddle;
    }

    private saveContext(): void {

        this._contextStack.push({ 
            left: this._left, 
            right: this._right, 
            middle: this._middle, 
            nextStep: this._nextStep 
        });
    }

    private restoreContext(): void {

        const context = this._contextStack.pop();

        if (!context) {

            return;
        }

        this._left = context?.left;
        this._right = context?.right;
        this._middle = context?.middle;
        this._nextStep = context.nextStep;
    }

    private merge(): void {

        this._leftSubArray = this._array.slice(this._left, this._middle + 1);
        this._rightSubArray = this._array.slice(this._middle + 1, this._right + 1);
        
        this._leftMergeIdx = 0;
        this._rightMergeIdx = 0;
        this._mergeIdx = this._left;
        
        this._nextStep = this.mergeNextElement;
    }

    private mergeNextElement(): void {

        if (this._leftMergeIdx < this._leftSubArray.length && this._rightMergeIdx < this._rightSubArray.length) {
            
            if (this._leftSubArray[this._leftMergeIdx] <= this._rightSubArray[this._rightMergeIdx]) {
                
                this._array[this._mergeIdx] = this._leftSubArray[this._leftMergeIdx];
                this._leftMergeIdx++;
            }
            else {

                this._array[this._mergeIdx] = this._rightSubArray[this._rightMergeIdx];
                this._rightMergeIdx++;
            }

            this._mergeIdx++;

            this._nextStep = this.mergeNextElement;

            return;
        }

        if (this._leftMergeIdx < this._leftSubArray.length) {

            this._array[this._mergeIdx] = this._leftSubArray[this._leftMergeIdx];

            this._leftMergeIdx++;
            this._mergeIdx++;

            this._nextStep = this.mergeNextElement;

            return;
        }

        if (this._rightMergeIdx < this._rightSubArray.length) {

            this._array[this._mergeIdx] = this._rightSubArray[this._rightMergeIdx];

            this._rightMergeIdx++;
            this._mergeIdx++;

            this._nextStep = this.mergeNextElement;

            return;
        }

        if (this._left === 0 && this._right === this._array.length - 1) {

            this._isDone = true;

            return;
        }

        this.restoreContext();
    }
}