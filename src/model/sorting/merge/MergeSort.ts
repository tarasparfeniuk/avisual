import { AlgorythmInfo } from "../../AlgorythmInfo";
import { AlgorythmState, AlgorythmStateMachine } from "../../AlgorythmSM";
import { ISortAlgorythm } from "../ISortAlgorythm";

type MergeSortState<T> = AlgorythmState<MergeSortContext<T>>;

type MergeSortContext<T> = {
    left: number, 
    right: number, 
    middle: number,
    leftSubArray: T[],
    rightSubArray: T[],
    leftMergeIdx: number,
    rightMergeIdx: number,
    mergeIdx: number
};

export class MergeSort<T> implements ISortAlgorythm<T> {

    private readonly _array: T[];
    private readonly _compare: (a: T, b: T) => number;
    private readonly _sm: AlgorythmStateMachine<MergeSortContext<T>>;

    constructor(array: T[], compare: (a: T, b: T) => number) {
        
        this._array = [...array];
        this._compare = compare;

        this.setArrayMiddle = this.setArrayMiddle.bind(this);
        this.mergeSortLeft = this.mergeSortLeft.bind(this);
        this.mergeSortRight = this.mergeSortRight.bind(this);
        this.merge = this.merge.bind(this);
        this.mergeNextElement = this.mergeNextElement.bind(this);

        const initialState: MergeSortState<T> = {
            context: {
                left: 0,
                right: array.length - 1,
                leftMergeIdx: -1,
                rightMergeIdx: -1,
                leftSubArray: [],
                rightSubArray: [],
                mergeIdx: -1,
                middle: -1
            },
            isFinished: false,
            transition: this.setArrayMiddle
        }

        this._sm = new AlgorythmStateMachine(initialState);
    }

    public get currentState(): MergeSortState<T> {

        return this._sm.currentState;
    }

    public get currentOperationNumber(): number {

        return this._sm.operationNumber;
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

    public executeStep(): void {

        this._sm.executeStep();
    }

    public sort(): T[] {

        while (!this.currentState.isFinished) {

            this.executeStep();
        }

        return this.array;
    }

    public get isFinished(): boolean {

        return this.currentState.isFinished;
    }

    public get currentSelection(): number[] {

        const { left, right } = this.currentState.context;

        const selection: number[] = [];

        for (let i = left; i <= right; i++) {

            selection.push(i);
        }

        return selection;
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {

        return new MergeSort<T>(array, this._compare);
    }

    private setArrayMiddle(state: MergeSortState<T>): MergeSortState<T>[] {

        const { left, right } = state.context;

        const middle = Math.floor((right + left) / 2);

        const nextState: MergeSortState<T> = {
            ...state,
            context: {
                ...state.context,
                middle
            },
            transition: this.mergeSortLeft
        };

        return [ nextState ];
    }

    private mergeSortLeft(state: MergeSortState<T>): MergeSortState<T>[] {

        const { left, right, middle } = state.context;

        if (right <= left) {

            return [];
        }

        const stateToSave: MergeSortState<T> = {
            ...state,
            transition: this.mergeSortRight
        } ;

        const nextState: MergeSortState<T> = {
            ...state,
            context: {
                ...state.context,
                right: middle
            },
            transition: this.setArrayMiddle
        };

        return [ stateToSave, nextState ];
    }

    private mergeSortRight(state: MergeSortState<T>): MergeSortState<T>[] {
       
        const { left, right, middle } = state.context;

        if (right <= left) {

            return [];
        }

        const stateToSave: MergeSortState<T> = {
            ...state,
            transition: this.merge
        } ;

        const nextState: MergeSortState<T> = {
            ...state,
            context: {
                ...state.context,
                left: middle + 1
            },
            transition: this.setArrayMiddle
        };

        return [ stateToSave, nextState ];
    }

    private merge(state: MergeSortState<T>): MergeSortState<T>[] {

        const { left, right, middle } = state.context;
        
        const nextState: MergeSortState<T> = {
            ...state,
            context: {
                ...state.context,
                leftSubArray: this._array.slice(left, middle + 1),
                rightSubArray: this._array.slice(middle + 1, right + 1),
                leftMergeIdx: 0,
                rightMergeIdx: 0,
                mergeIdx: left,
            },
            transition: this.mergeNextElement
        };
        
        return [ nextState ];
    }

    private mergeNextElement(state: MergeSortState<T>): MergeSortState<T>[] {

        const { 
            left, 
            right,
            leftMergeIdx = -1, 
            leftSubArray = [],
            rightMergeIdx = -1, 
            rightSubArray = [], 
            mergeIdx = -1 
        } = state.context;

        const nextState: MergeSortState<T> = {
            ...state,
            context: {
                ...state.context
            }
        };

        if (leftMergeIdx < leftSubArray.length && rightMergeIdx < rightSubArray.length) {
            
            if (this._compare(leftSubArray[leftMergeIdx], rightSubArray[rightMergeIdx]) <= 0) {
                
                this._array[mergeIdx] = leftSubArray[leftMergeIdx];
                nextState.context.leftMergeIdx = leftMergeIdx + 1;
            }
            else {

                this._array[mergeIdx] = rightSubArray[rightMergeIdx];
                nextState.context.rightMergeIdx = rightMergeIdx + 1;
            }

            nextState.context.mergeIdx = mergeIdx + 1;

            nextState.transition = this.mergeNextElement;

            return [ nextState ];
        }

        if (leftMergeIdx < leftSubArray.length) {

            this._array[mergeIdx] = leftSubArray[leftMergeIdx];

            nextState.context.leftMergeIdx = leftMergeIdx + 1;
            nextState.context.mergeIdx = mergeIdx + 1;

            nextState.transition = this.mergeNextElement;

            return [ nextState ];
        }

        if (rightMergeIdx < rightSubArray.length) {

            this._array[mergeIdx] = rightSubArray[rightMergeIdx];

            nextState.context.rightMergeIdx = leftMergeIdx + 1;
            nextState.context.mergeIdx = mergeIdx + 1;

            nextState.transition = this.mergeNextElement;

            return [ nextState ];
        }

        if (left === 0 && right === this._array.length - 1) {

            nextState.isFinished = true;

            return [ nextState ];
        }

        return [ ];
    }
}