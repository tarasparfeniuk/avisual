import { AlgorythmInfo } from "./AlgorythmInfo";

export interface IAlgorythm {

    info: AlgorythmInfo;

    isFinished: boolean;

    currentOperationNumber: number;

    executeStep(): void;
}
