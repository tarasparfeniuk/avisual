import React from 'react';
import { Component } from "react";
import { Field } from '../../model/pathfinding/map/Field';
import { IMapCell } from '../../model/pathfinding/map/cells/IMapCell';
import "./Field.css";

type FieldViewProps = {
    value: Field
}

export class FieldView extends Component<FieldViewProps> {

    constructor(props: FieldViewProps) {
        
        super(props);
    }

    render() {
    
        const { value: field } = this.props;
        const rows = [];

        for (let y = 0; y < field.height; y++) {

            const row = [];

            for (let x = 0; x < field.width; x++) {

                row.push(field.getCell(x, y));
            }

            rows.push(row);
        }

        return (
            <div className="field">
                { 
                    rows.map(r => <FieldRow cells={r} />)
                }
            </div>
        );
    }
}

type FieldRowProps = { cells: IMapCell[] };

const FieldRow = (props: FieldRowProps) => {
    return (
        <div className="row">
            { 
                props.cells.map(c => <FieldCell value={c}/>)
            }    
        </div>
    );
}

type FieldCellProps = { value: IMapCell };

const FieldCell = (props: FieldCellProps) => {

    const classNames = ["cell"];
    
    if (props.value.isPassable) classNames.push("passable");

    return (
        <div className={classNames.join(" ")}></div>
    );
}