import { EventEmitter } from "../../common/EventEmitter";
import { disposeSymbol, IDisposible } from "../../common/IDisposible";
import { array as config } from "../../config/sorting";

const SORTING_INPUT_UPDATED_EVENT = "ON_SORTING_INPUT_UPDATED";

export interface ISortingInput {

    array: number[];

    arraySize: number;

    setArraySize(size: number): void;
    
    setRandomArray(): void;

    setArray(array: number[]): void;
}

export class SortingInput implements ISortingInput, IDisposible {

    private readonly _eventEmitter: EventEmitter;

    private _arraySize: number = 10;
    private _array: number[] = [];

    constructor() {

        this._eventEmitter = new EventEmitter();
        this.setRandomArray();
    }

    [disposeSymbol](): void {
        
        this.dispose();
    }

    public get array(): number[] {

        return this._array;
    }

    public get arraySize(): number {

        return this._arraySize;
    }

    public setArraySize(size: number): void {

        if (size <= config.minSize || size >= config.maxSize) {

            return;
        }

        this._arraySize = size;

        this.setRandomArray();
    }

    public setRandomArray(): void {

        this._array = this.createArray(this._arraySize, config.minElement, config.maxElement);

        this._eventEmitter.emit(SORTING_INPUT_UPDATED_EVENT);
    }

    public setArray(array: number[]): void {

        if (array.length >= config.minSize && array.length <= config.maxSize) {

            this._array = array.map(this.trimElement);
            this._arraySize = this._array.length;
        } 

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

    private trimElement(el: number): number {

        if (el > config.maxElement) {

            return config.maxElement;
        }

        if (el < config.minElement) {

            return config.minElement;
        }

        return el;
    }

    public dispose(): void {

        this._eventEmitter.clear();
    }
}

export function withGuard(canUpdateInput: () => boolean, model: ISortingInput): ISortingInput {

    return {
        get array(): number[] { return model.array; },
        get arraySize(): number { return model.arraySize; },
        setArray: (...args) => { if (canUpdateInput()) { model.setArray.bind(model)(...args) }},
        setArraySize: (...args) => { if (canUpdateInput()) { model.setArraySize.bind(model)(...args) } },
        setRandomArray: (...args) => { if (canUpdateInput()) { model.setRandomArray.bind(model)(...args) } }
    };
}
