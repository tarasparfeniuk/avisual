import { ISortAlgorythm, ISortAlgorythmFactory } from "../ISortAlgorythm";
import { InsertionSort } from "./InsertionSort";

export class InsertionSortAlgorythmFactory<T> implements ISortAlgorythmFactory<T> {
    
    private readonly _compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {

        this._compare = compare;
    }

    public get algorythmName(): string {

        return "insertion sort";
    }
    
    create(array: T[]): ISortAlgorythm<T> {

        return new InsertionSort(array, this._compare);
    }
}