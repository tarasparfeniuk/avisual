import { ISortAlgorythm } from '../ISortAlgorythm';
import { EventBasedSortAlgorythm } from '../EventBasedSortAlgorythm';

export class SelectionSort<T> extends EventBasedSortAlgorythm<T> implements ISortAlgorythm<T> {

    constructor(array: T[], compare: (a: T, b: T) => number) {

         super(array, compare, { name: "selection sort", link: "https://en.wikipedia.org/wiki/Selection_sort" });
    }

    protected algorythm(): Promise<void> {
        
        return this.selectionSort();
    }

    private async selectionSort(): Promise<void> {

        if (this._array.length < 2) {

            return;
        }

        for (let i = 0; i < this._array.length; i++) {

            this.setSelection([ i ]);
            await this.waitForNextStep();

            let candidate = i;

            await this.waitForNextStep();

            for (let j = i + 1; j < this._array.length; j++) {
                
                this.setSelection([ i, j, candidate ]);
                await this.waitForNextStep();

                if (this._compare(this._array[j], this._array[candidate]) < 0) {

                    await this.waitForNextStep();
                    candidate = j;
                    this.setSelection([ i, candidate ]);
                }
            }

            await this.waitForNextStep();
            [ this._array[candidate], this._array[i] ] = [ this._array[i], this._array[candidate] ];
        }
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {

        return new SelectionSort<T>(array, this._compare);
    }
}