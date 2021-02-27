import { SortingDemoModel } from "./sorting/SortingDemoModel";

export class AppModel {

    private readonly _sorting: SortingDemoModel;

    constructor() {

        this._sorting = new SortingDemoModel();
    }

    public get sorting(): SortingDemoModel {

        return this._sorting;
    } 
} 
