import React from 'react';
import { Component } from "react";
import { Field } from '../../model/pathfinding/map/Field';
import { IMapCell } from '../../model/pathfinding/map/cells/IMapCell';
import "./Field.css";
import { EntryPointMapCell } from '../../model/pathfinding/map/cells/EntryPointMapCell';
import { DestinationPointMapCell } from '../../model/pathfinding/map/cells/DestinationPointMapCell';

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
    if (props.value.type == EntryPointMapCell.type) classNames.push("entry-point");
    if (props.value.type == DestinationPointMapCell.type) classNames.push("destination-point");

    return (
        <div className={classNames.join(" ")}></div>
    );
}