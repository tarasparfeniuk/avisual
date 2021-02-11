import { IAlgorythm } from "../IAlgorythm";

export interface ISortAlgorythmFactory<T> {

    algorythmName: string;

    create(array: T[]): ISortAlgorythm<T>
}

export interface ISortAlgorythm<T> extends IAlgorythm {

    array: T[];

    currentSelection: number[];

    copyWithArray(array: T[]): ISortAlgorythm<T>;
}