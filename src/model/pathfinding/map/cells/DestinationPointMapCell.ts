import { IMapCell } from "./IMapCell";
import { MapCellBase } from "./MapCellBase";


export class DestinationPointMapCell extends MapCellBase implements IMapCell {

    static readonly type: string = "destination-point";

    get isPassable(): boolean {

        return true;
    }

    get type(): string {

        return DestinationPointMapCell.type;
    }
}
