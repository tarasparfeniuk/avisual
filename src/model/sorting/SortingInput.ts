import { EventEmitter } from "../../common/EventEmitter";
import { IDisposible } from "../../common/IDisposible";
import { array as config } from "../../config/sorting";

const SORTING_INPUT_UPDATED_EVENT = "ON_SORTING_INPUT_UPDATED";

export interface ISortingInput {

    array: number[];

    arraySize: number;

    setArraySize(size: number): void;
    
    setRandomArray(): void;
}

export class SortingInput implements ISortingInput, IDisposible {

    private readonly _eventEmitter: EventEmitter;

    private _arraySize: number = 10;
    private _array: number[] = [];

    constructor() {

        this._eventEmitter = new EventEmitter();
        this.setRandomArray();
    }

    public get array(): number[] {

        return this._array;
    }

    public get arraySize(): number {

        return this._arraySize;
    }

    public setArraySize(size: number): void {

        if (size < config.minSize || size > config.maxSize) {

            return;
        }

        this._arraySize = size;

        this.setRandomArray();
    }

    public setRandomArray(): void {

        this._array = this.createArray(this._arraySize, config.minElement, config.maxElement);

        this._eventEmitter.emit(SORTING_INPUT_UPDATED_EVENT);
    }

    public onInputUpdated(handler: () => void): void {

        this._eventEmitter.on(SORTING_INPUT_UPDATED_EVENT, handler);
    }

    private createArray(size: number, min: number, max: number): number[] {

        const array = [];

        for (let i = 0; i < size; i++) {

            const val = Math.floor(Math.random() * (max - min + 1)) + min;

            array.push(val);
        }

        return array;
    }

    public dispose(): void {

        this._eventEmitter.clear();
    }
}

export function withGuard(canUpdateInput: () => boolean, model: ISortingInput): ISortingInput {

    return {
        get array(): number[] { return model.array; },
        get arraySize(): number { return model.arraySize; },
        setArraySize: (...args) => { if (canUpdateInput()) { model.setArraySize.bind(model)(...args) } },
        setRandomArray: (...args) => { if (canUpdateInput()) { model.setRandomArray.bind(model)(...args) } }
    };
}
