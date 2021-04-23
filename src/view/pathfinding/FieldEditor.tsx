import React from 'react';
import { Component } from 'react';
import { IPathfindingInput } from '../../model/pathfinding/PathfindingInput';
import './FieldEditor.css';
import { FieldView } from './Field';
import { Field } from '../../model/pathfinding/map/Field';
import { MazeGenerationButton } from './components/MazeGenerationButton';
import { MazeGenerationsCountSlider } from './components/MazeGenerationsCountSlider';
import { MazeSeedField } from './components/MazeSeedField';

type FieldEditorProps = {
    model: IPathfindingInput
}

type FieldEditorState = {
    field: Field
}

export class FieldEditor extends Component<FieldEditorProps, FieldEditorState> {

    constructor(props: FieldEditorProps) {

        super(props);

        const { model } = props;

        this.state = { 
            field: model.field
        };
    }
    
    componentDidMount() {

        const { model } = this.props;
        
        model.onInputUpdated(() => {
            this.setState({ field: model.field });
        })
    }

    render() {

        const { model } = this.props;
        const { field } = this.state;

        return (
            <div className="field-editor">
                <div className="sidebar">
                    <MazeGenerationsCountSlider model={model} />
                    <MazeGenerationButton model={model} />
                    <MazeSeedField model={model} />
                </div>
                <FieldView value={field} />
            </div>
        );
    }
}
