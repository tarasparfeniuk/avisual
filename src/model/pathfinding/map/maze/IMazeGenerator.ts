import { IDisposible } from "../../../../common/IDisposible";
import { Field } from "../Field";

export interface IMazeGenerator extends IDisposible {

    generate(): Promise<Field>;

    isFinished: boolean;
}
