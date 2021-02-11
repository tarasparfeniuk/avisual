import { ISortAlgorythm, ISortAlgorythmFactory } from "../ISortAlgorythm";
import { MergeSort } from "./MergeSort";

export class MergeSortAlgorythmFactory<T> implements ISortAlgorythmFactory<T> {
    
    private readonly _compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {

        this._compare = compare;
    }

    public get algorythmName(): string {

        return "merge sort";
    }
    
    create(array: T[]): ISortAlgorythm<T> {

        return new MergeSort(array, this._compare);
    }
}