import { IMapCell } from "./IMapCell";

export class WallMapCell implements IMapCell {

    public static readonly type = "wall";

    public get type() {

        return WallMapCell.type;
    }

    public get isPassable() {

        return false;
    }
}
