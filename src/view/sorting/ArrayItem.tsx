import React from "react";

export type ArrayItemParams = { height: number, isHighlighted: boolean, isNegative: boolean }

export const ArrayItem = ({ height = 100, isHighlighted = false, isNegative = false }: ArrayItemParams) => {

    const classNames = [ 'item' ];

    if (isNegative) {

        classNames.push('item-negative')
    } else {

        classNames.push('item-positive')
    }

    if (isHighlighted) {

        classNames.push('highlighted');
    }

    return (
        <div className={classNames.join(' ')}>
            <div style={{ height: height }} />
            <div style={{ height: height }} />
        </div>
    );
}