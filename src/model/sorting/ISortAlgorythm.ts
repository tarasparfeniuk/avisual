import { AlgorythmInfo } from "../AlgorythmInfo";
import { IAlgorythm } from "../IAlgorythm";

export interface ISortAlgorythm<T> extends IAlgorythm {

    array: T[];

    currentSelection: number[];

    copyWithArray(array: T[]): ISortAlgorythm<T>;
}