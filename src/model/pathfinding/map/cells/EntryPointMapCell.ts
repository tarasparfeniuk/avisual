import { IMapCell } from "./IMapCell";
import { MapCellBase } from "./MapCellBase";

export class EntryPointMapCell extends MapCellBase implements IMapCell {

    static readonly type: string = "entry-point";

    get isPassable(): boolean {

        return true;
    }

    get type(): string {

        return EntryPointMapCell.type;
    }
}


