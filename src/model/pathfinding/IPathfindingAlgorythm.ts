import { IAlgorythm } from "../IAlgorythm";
import { Field } from "./map/Field";

export interface IPathfindingAlgorythmFactory {

    algorythmName: string;

    create(field: Field): IPathfindingAlgorythm
}

export interface IPathfindingAlgorythm extends IAlgorythm {

    field: Field;
    copyWithInput(field: Field): IPathfindingAlgorythm;
}