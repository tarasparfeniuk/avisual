import { IRandom } from "./IRandom";

export class LinearRandom implements IRandom {

    private readonly _a = 45;
    private readonly _c = 21;
    private readonly _m = Number.MAX_SAFE_INTEGER;

    private _seed: number;

    constructor(seed?: number) {

        this._seed = !!seed 
            ? seed 
            : Math.random() * Number.MAX_SAFE_INTEGER;
    }

    public next(): number {

        const value = (this._a * this._seed + this._c) % this._m;

        this._seed = value;

        return value / this._m;
    }
}