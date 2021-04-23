import { IMapCell } from "./IMapCell";

export class EntryPointMapCell implements IMapCell {

    static readonly type: string = "entry-point";

    get isPassable(): boolean {

        return true;
    }

    get type(): string {

        return EntryPointMapCell.type;
    }
}


