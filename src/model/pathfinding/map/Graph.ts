import { IMapCell } from "./cells/IMapCell";
import { Field } from "./Field";

export type Graph = GraphNode[];

class GraphNode { 

    private _neighbors: GraphNode[];

    constructor(public readonly x: number, public readonly y: number) {

        this._neighbors = [];
    }

    public get neighbors(): GraphNode[] {

        return this._neighbors;
    }

    public setNeighbors(nodes: (GraphNode | undefined)[]): void {

        this._neighbors = nodes.filter(n => !!n) as GraphNode[];
    }
}

export function buildGraph(field: Field, entry: IMapCell, from: IMapCell, to: IMapCell): Graph {

    const graph: Graph = [];

    buildGraphNode(field, graph, entry.x, entry.y, from, to);

    return graph;
}

function buildGraphNode(field: Field, nodes: GraphNode[], x: number, y: number, from: IMapCell, to: IMapCell): GraphNode | undefined {

    if (x >= field.width || y >= field.height || x < 0 || y < 0) {

        return undefined;
    }

    if (x < from.x || y < from.y || x > to.x || y > to.y) {

        return undefined;
    }

    const cell = field.getCell(x, y);

    if (!cell.isPassable) return undefined;

    const existingNode = nodes.find(n => n.x === cell.x && n.y === cell.y);

    if (!!existingNode) {

        return existingNode;
    }

    const node = new GraphNode(cell.x, cell.y);

    nodes.push(node);

    node.setNeighbors([
        buildGraphNode(field, nodes, cell.x, cell.y + 1, from, to),
        buildGraphNode(field, nodes, cell.x + 1, cell.y, from, to),
        buildGraphNode(field, nodes, cell.x, cell.y - 1, from, to),
        buildGraphNode(field, nodes, cell.x - 1, cell.y, from, to)
    ]);

    return node;
}
