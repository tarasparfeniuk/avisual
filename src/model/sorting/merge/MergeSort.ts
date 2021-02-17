import { EventBasedSortAlgorythm } from "../EventBasedSortAlgorythm";
import { ISortAlgorythm } from "../ISortAlgorythm";

export class MergeSort<T> extends EventBasedSortAlgorythm<T> implements ISortAlgorythm<T> {

    constructor(array: T[], compare: (a: T, b: T) => number) {
        
        super(array, compare, { name: "merge sort", link: "https://en.wikipedia.org/wiki/Merge_sort" });
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {
        
        return new MergeSort<T>(array, this._compare);
    }

    protected algorythm(): Promise<void> {

        return this.mergeSort(0, this._array.length - 1);
    }

    private async mergeSort(from: number, to: number): Promise<void> {

        if (from < to) {

            await this.waitForNextStep();
            const middle = Math.floor(from + (to - from) / 2);
            this.setSelection([ middle ]);
            
            this.highlightRange(from, middle);
            await this.waitForNextStep();
            await this.mergeSort(from, middle);
            
            this.highlightRange(middle + 1, to);
            await this.waitForNextStep();
            await this.mergeSort(middle + 1, to);

            this.highlightRange(from, to);
            await this.waitForNextStep();
            await this.merge(from, middle, to);
        }
    }

    private async merge(from: number, middle: number, to: number): Promise<void> {

        const leftArray: T[] = [];
        const rightArray: T[] = [];

        for (let i = from; i <= to; i++) {

            await this.waitForNextStep();

            if (i > middle) {
            
                await this.waitForNextStep();
                rightArray.push(this._array[i]);
            } 
            else {

                await this.waitForNextStep();
                leftArray.push(this._array[i]);
            }
        }

        let i = from;
        await this.waitForNextStep();
        while (leftArray.length > 0 || rightArray.length > 0) {

            await this.waitForNextStep();
            const item = this.pickItem(leftArray, rightArray);
                
            if (item !== undefined) {

                this._array[i] = item;
            }

            await this.waitForNextStep();
            i++;
        }
    }

    private pickItem(leftArray: T[], rightArray: T[]): T | undefined {

        if (leftArray.length > 0 && rightArray.length > 0) {

            return this._compare(leftArray[0], rightArray[0]) <= 0
                ? leftArray.shift()
                : rightArray.shift();
        }

        if (leftArray.length < 1) {

            return rightArray.shift();
        }

        return leftArray.shift();
    }

    private highlightRange(from: number, to: number): void {

        const selection = [];

        for (let i = from; i <= to; i++) {

            selection.push(i);
        }

        this.setSelection(selection);
    }
}