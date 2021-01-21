import { AlgorythmInfo } from '../../AlgorythmInfo';
import { ISortAlgorythm } from '../ISortAlgorythm';
import { AlgorythmState, AlgorythmStateMachine } from '../../AlgorythmSM';

type BubbleSortState = AlgorythmState<BubbleSortContext>;

type BubbleSortContext = {
    i: number;
    j: number;
}

export class BubbleSort<T> implements ISortAlgorythm<T> {

    private readonly _array: T[];
    private readonly _compare: (a: T, b: T) => number;
    private readonly _sm: AlgorythmStateMachine<BubbleSortContext>;

    constructor(array: T[], compare: (a: T, b: T) => number) {

        this._array = [...array];
        this._compare = compare;

        this.incrementIndexes = this.incrementIndexes.bind(this)
        this.swapElements = this.swapElements.bind(this)

        const initialState: BubbleSortState = {
            context: {
                i: 0,
                j: -1
            },
            isFinished: false,
            transition: this.incrementIndexes
        };

        this._sm = new AlgorythmStateMachine<BubbleSortContext>(initialState);
    }

    public get currentOperationNumber(): number {

        return this._sm.operationNumber;
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
    
    public get currentState(): BubbleSortState {

        return this._sm.currentState;
    }

    public sort(): T[] {

        while (!this.isFinished) {

            this.executeStep();
        }

        return this._array;
    }

    public get isFinished(): boolean {

        return this._sm.currentState.isFinished;
    }

    public get currentSelection(): number[] {

        const { j } = this.currentState.context;

        return this.isFinished || this.currentOperationNumber === 0
            ? [] 
            : [ j, j + 1 ];
    }

    public executeStep(): void {

        this._sm.executeStep();
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {

        return new BubbleSort<T>(array, this._compare);
    }

    private incrementIndexes(state: BubbleSortState): BubbleSortState[]  {

        const { i, j } = state.context;

        const nextState: BubbleSortState = { 
            ...state,
            context: {
                ...state.context, j: j + 1 
            },
            transition: this.swapElements
        };

        if (nextState.context.j === this._array.length - i - 1) {

            nextState.context.i = i + 1;
            nextState.context.j = 0;
        }

        if (nextState.context.i === this._array.length - 1) {

            nextState.isFinished = true;
        }

        return [ nextState ];
    } 

    private swapElements(state: BubbleSortState): BubbleSortState[] {

        const { j } = state.context;

        const a = this._array[j];
        const b = this._array[j + 1];

        const needSort = this._compare(a, b) > 0;

        if (needSort) {

            this._array[j] = b;
            this._array[j + 1] = a;
        }

        const nextState: BubbleSortState = {
            ...state,
            transition: this.incrementIndexes
        }

        return [ nextState ];
    }
}