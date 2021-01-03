import React from "react";
import { ArrayItem } from "./ArrayItem";
import './Array.css'

type ArrayProps = { array: number[], selection: number[] };

export const Array = ({ array = [], selection = [] }: ArrayProps) => {

    const max = Math.max(...array);
    const min = Math.min(...array);

    const maxHeight = Math.max(Math.abs(max), Math.abs(min));

    return (
        <div className='array-container'>
            {
                array.map((item, idx) => {
                    
                    const height = 100 * Math.abs(item) / maxHeight;
                    const isNegative = item < 0;
                    const isSelected = selection.includes(idx);

                    return (
                        <ArrayItem 
                            key={`array-item-${idx}`}
                            height={height} 
                            isNegative={isNegative} 
                            isHighlighted={isSelected} 
                        />
                    );
                })
            }
        </div>
    )
}
