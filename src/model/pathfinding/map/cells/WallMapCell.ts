import { IMapCell } from "./IMapCell";
import { MapCellBase } from "./MapCellBase";

export class WallMapCell extends MapCellBase implements IMapCell {

    public static readonly type = "wall";

    public get type() {

        return WallMapCell.type;
    }

    public get isPassable() {

        return false;
    }
}
