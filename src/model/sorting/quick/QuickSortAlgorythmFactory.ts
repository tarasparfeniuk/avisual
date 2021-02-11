import { ISortAlgorythm, ISortAlgorythmFactory } from "../ISortAlgorythm";
import { QuickSort } from "./QuickSort";

export class QuickSortAlgorythmFactory<T> implements ISortAlgorythmFactory<T> {
    
    private readonly _compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {

        this._compare = compare;
    }

    public get algorythmName(): string {

        return "quick sort";
    }
    
    create(array: T[]): ISortAlgorythm<T> {

        return new QuickSort(array, this._compare);
    }
}