import { ISortAlgorythm } from '../ISortAlgorythm';
import { EventBasedSortAlgorythm } from '../EventBasedSortAlgorythm';

export class BubbleSort<T> extends EventBasedSortAlgorythm<T> implements ISortAlgorythm<T> {

    constructor(array: T[], compare: (a: T, b: T) => number) {

         super(array, compare, { name: "bubble sort", link: "https://en.wikipedia.org/wiki/Bubble_sort" });
    }

    protected algorythm(): Promise<void> {
        
        return this.bubbleSort();
    }

    private async bubbleSort(): Promise<void> {

        if (this._array.length < 2) {

            return;
        }

        for (let i = this._array.length; i >= 0; i--) {

            for (let j = 1; j < i; j++) {

                this.setSelection([ j, j - 1 ]);

                await this.waitForNextStep();

                if (this._compare(this._array[j - 1], this._array[j]) > 0) {

                    await this.waitForNextStep();

                    [ this._array[j - 1], this._array[j] ] = [ this._array[j], this._array[j - 1] ];
                }
            }
        }
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {

        return new BubbleSort<T>(array, this._compare);
    }
}