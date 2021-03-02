import { ISortAlgorythm } from '../ISortAlgorythm';
import { EventBasedSortAlgorythm } from '../EventBasedSortAlgorythm';

export class InsertionSort<T> extends EventBasedSortAlgorythm<T> implements ISortAlgorythm<T> {

    constructor(array: T[], compare: (a: T, b: T) => number) {

         super(array, compare, { name: "insertion sort", link: "https://en.wikipedia.org/wiki/Insertion_sort" });
    }

    protected algorythm(): Promise<void> {
        
        return this.insertionSort();
    }

    private async insertionSort(): Promise<void> {

        if (this._array.length < 2) {

            return;
        }

        for (let i = 1; i < this._array.length; i++) {

            this.setSelection([ i ]);

            await this.waitForNextStep();
            
            let j = i - 1;

            await this.waitForNextStep();

            while (j >= 0 && this._compare(this._array[j + 1], this._array[j]) < 0) {

                await this.waitForNextStep();

                this.setSelection([ j + 1, j, i ]);

                [ this._array[j + 1], this._array[j] ] = [ this._array[j], this._array[j + 1] ];
                
                await this.waitForNextStep();
                
                j--;
            }
        }
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {

        return new InsertionSort<T>(array, this._compare);
    }
}