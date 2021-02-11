import { EventBasedSortAlgorythm } from "../EventBasedSortAlgorythm";
import { ISortAlgorythm } from "../ISortAlgorythm";

export class QuickSort<T> extends EventBasedSortAlgorythm<T> implements ISortAlgorythm<T> {
    
    constructor(array: T[], compare: (a: T, b: T) => number) {
        
        super(array, compare, { name: "quick sort", link: "https://en.wikipedia.org/wiki/Quick_sort" });

        this.quickSort = this.quickSort.bind(this);
        this.partition = this.partition.bind(this);
    }

    public copyWithArray(array: T[]): ISortAlgorythm<T> {
        
        return new QuickSort(array, this._compare);
    }

    protected algorythm(): Promise<void> {
        
        return this.quickSort(0, this._array.length - 1);
    }

    private async quickSort(low: number, high: number): Promise<void> {

        if (low < high) 
        { 
            await this.waitForNextStep();

            const pi = await this.partition(low, high); 
            
            await this.waitForNextStep();
            
            await this.quickSort(low, pi - 1); 
            
            await this.waitForNextStep();
            
            await this.quickSort(pi + 1, high); 
        }  
    }

    private async partition(low: number, high: number): Promise<number> { 

        const pivot = this._array[high];  

        this.setSelection([ high ]);

        await this.waitForNextStep();

        let i = (low - 1);  

        await this.waitForNextStep();

        for (let j = low; j < high; j++) { 
  
            this.setSelection([ high, j, i ]);

            await this.waitForNextStep();

            if (this._array[j] < pivot) { 

                await this.waitForNextStep();

                i++; 

                await this.waitForNextStep();

                [ this._array[i], this._array[j] ] = [ this._array[j], this._array[i] ];
            } 
        } 

        await this.waitForNextStep();

        this.setSelection([ high, i + 1 ]);
        [ this._array[i + 1], this._array[high] ] = [ this._array[high], this._array[i + 1] ];

        await this.waitForNextStep();

        return i + 1; 
    } 
}
