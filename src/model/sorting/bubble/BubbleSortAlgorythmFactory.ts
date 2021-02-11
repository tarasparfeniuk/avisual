import { ISortAlgorythm, ISortAlgorythmFactory } from "../ISortAlgorythm";
import { BubbleSort } from "./BubbleSort";

export class BubbleSortAlgorythmFactory<T> implements ISortAlgorythmFactory<T> {
    
    private readonly _compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {

        this._compare = compare;
    }

    public get algorythmName(): string {

        return "bubble sort";
    }
    
    create(array: T[]): ISortAlgorythm<T> {

        return new BubbleSort(array, this._compare);
    }
}