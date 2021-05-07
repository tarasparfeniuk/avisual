import { IMapCell } from "./IMapCell";
import { MapCellBase } from "./MapCellBase";

export class BlankMapCell extends MapCellBase implements IMapCell {

    static readonly type: string = "blank";

    get isPassable(): boolean {

        return true;
    }

    get type(): string {

        return BlankMapCell.type;
    }
}
