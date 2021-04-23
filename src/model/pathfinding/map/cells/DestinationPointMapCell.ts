import { IMapCell } from "./IMapCell";


export class DestinationPointMapCell implements IMapCell {

    static readonly type: string = "destination-point";

    get isPassable(): boolean {

        return true;
    }

    get type(): string {

        return DestinationPointMapCell.type;
    }
}
