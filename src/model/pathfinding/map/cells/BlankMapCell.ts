import { IMapCell } from "./IMapCell";

export class BlankMapCell implements IMapCell {

    static readonly type: string = "blank";

    get isPassable(): boolean {

        return true;
    }

    get type(): string {

        return BlankMapCell.type;
    }
}
