import { ISortAlgorythm, ISortAlgorythmFactory } from "../ISortAlgorythm";
import { SelectionSort } from "./SelectionSort";

export class SelectionSortAlgorythmFactory<T> implements ISortAlgorythmFactory<T> {
    
    private readonly _compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {

        this._compare = compare;
    }

    public get algorythmName(): string {

        return "selection sort";
    }
    
    create(array: T[]): ISortAlgorythm<T> {

        return new SelectionSort(array, this._compare);
    }
}