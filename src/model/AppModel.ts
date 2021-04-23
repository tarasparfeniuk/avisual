import { PathfindingDemoModel } from "./pathfinding/PathfindingDemoModel";
import { SortingDemoModel } from "./sorting/SortingDemoModel";

export class AppModel {

    private readonly _sorting: SortingDemoModel;
    private readonly _pathfinding: PathfindingDemoModel;
    
    constructor() {

        this._sorting = new SortingDemoModel();
        this._pathfinding = new PathfindingDemoModel
    }

    public get sorting(): SortingDemoModel {

        return this._sorting;
    } 

    public get pathfinding(): PathfindingDemoModel {

        return this._pathfinding;
    } 
} 
