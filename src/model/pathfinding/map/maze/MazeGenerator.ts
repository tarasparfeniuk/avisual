import { IRandom } from "../../../../common/IRandom";
import { Field } from "../Field";
import { IMapCell } from "../cells/IMapCell";
import { IMazeGenerator } from "./IMazeGenerator";
import { LinearRandom } from "../../../../common/LinearRandom";
import { disposeSymbol, IDisposible, instanceOfIDisposible } from "../../../../common/IDisposible";
import { IStepController } from "./IStepController";
import { buildGraph, Graph } from "../Graph";

export class MazeGenerator implements IMazeGenerator {

    private readonly _density: number;
    private readonly _generations: number;
    private readonly _random: IRandom;
    private readonly _stepController: IStepController;
    
    private _isFinished: boolean = false;
    private _field: Field;

    constructor
    (
        seed: number, 
        height: number, 
        width: number, 
        density: number, 
        generations: number, 
        onStepExecuted: (field: Field) => void,
        stepController: IStepController
    ) {

        this._field = new Field(height, width);
        this._density = density;
        this._generations = generations;
        this._stepController = stepController;

        this._random = new LinearRandom(seed);

        this._stepController.onStepExecuted(() => onStepExecuted(this._field));
    }

    public async generate(): Promise<Field> {

        this._stepController.reset(1);

        await this.algorythm();

        this._isFinished = true;

        this._stepController.pause();

        return this._field;
    }

    public get isFinished(): boolean {

        return this._isFinished;
    }

    private async algorythm(): Promise<void> {

        await this.setRandomCells(this._density);

        for (let g = 0; g < this._generations; g++) {

            await this.waitForNextStep();
            await this.setNextGeneration();
        }

        this.setEntryPoint();
        this.setDestinationPoint();
    }

    private async waitForNextStep(): Promise<void> {

        await this._stepController.nextStep();
    }

    private async setNextGeneration(): Promise<void> {

        for (let x = 0; x < this._field.width; x++) {

            await this.waitForNextStep();

            for (let y = 0; y < this._field.height; y++) {

                this.setNextState(x, y);
            }
        }
    }

    private async setRandomCells(density: number): Promise<void> {

        for (let x = 0; x < this._field.width; x++) {

            await this.waitForNextStep();

            for (let y = 0; y < this._field.height; y++) {

                const rand = this._random.next();
                
                if (Math.floor(rand * density) === 1) this._field.setBlankCell(x, y);
                else this._field.setWall(x, y);
            }
        }
    }

    private setNextState(x: number, y: number): void {

        const neighbors = this.getNeighbors(x, y);
        const passibleNeighbors = neighbors.filter(c => c.isPassable);

        if (passibleNeighbors.length > 1 && passibleNeighbors.length < 4) {

            this._field.setBlankCell(x, y);
        } else {

            this._field.setWall(x, y);
        }
    }

    private getNeighbors(x: number, y: number): IMapCell[] {

        // TODO: Need to rewrite
        const neighbors = [];

        if (x + 1 < this._field.width)
            neighbors.push(this._field.getCell(x + 1, y));
        else
            neighbors.push(this._field.getCell(0, y));

        if (x - 1 >= 0)
            neighbors.push(this._field.getCell(x - 1, y));
        else
            neighbors.push(this._field.getCell(this._field.width - 1, y));

        if (y + 1 < this._field.height)
            neighbors.push(this._field.getCell(x, y + 1));
        else
            neighbors.push(this._field.getCell(x, 0));

        if (y - 1 >= 0)
            neighbors.push(this._field.getCell(x, y - 1));
        else
            neighbors.push(this._field.getCell(x, this._field.height - 1));

        return neighbors;
    }

    private setEntryPoint(): void {

        const from = this._field.getCell(0, 0);
        const to = this._field.getCell(Math.floor(this._field.width / 2), Math.floor(this._field.height / 2));
        const graph = this.getBiggestSubgraph(from, to);
        const entry = graph.sort((a, b) => a.y - b.y)[0];

        this._field.setEntrypoint(entry.x, entry.y);
    }

    private setDestinationPoint(): void {

        const from = this._field.getCell(Math.floor(this._field.width / 2), Math.floor(this._field.height / 2));
        const to = this._field.getCell(this._field.width - 1, this._field.height - 1)
        const graph = this.getBiggestSubgraph(from, to);
        const dest = graph.sort((a, b) => b.y - a.y)[0];

        this._field.setDestinationPoint(dest.x, dest.y);
    }

    private getBiggestSubgraph(from: IMapCell, to: IMapCell): Graph {

        const graphs = [];

        for (let x = from.x; x <= to.x; x++) {
        
            for (let y = from.y; y <= to.y; y++) {
                
                const graph = buildGraph(this._field, this._field.getCell(x, y), from, to);

                if (graph.length > 30) return graph;
                if (graph.length > 10) graphs.push(graph);
            }    
        }
    
        graphs.sort((a, b) => b.length - a.length);

        return graphs[0];
    }

    public [disposeSymbol](): void {
        
        this.dispose();
    }
    
    public dispose() {

        if (instanceOfIDisposible(this._stepController)) {

            (this._stepController as IDisposible).dispose();
        }
    }
}
