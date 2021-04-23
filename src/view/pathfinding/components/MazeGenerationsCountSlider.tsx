import { field as config } from "../../../config/pathfinding";
import React from "react";
import { IPathfindingInput } from "../../../model/pathfinding/PathfindingInput"
import { Slider } from "@fluentui/react";

type MazeGenerationsCountSliderProps = {
    model: IPathfindingInput,
    disabled?: boolean
}

type MazeGenerationsCountSliderState = {
    value: number
}

export class MazeGenerationsCountSlider extends React.Component<MazeGenerationsCountSliderProps, MazeGenerationsCountSliderState> {

    constructor(props: MazeGenerationsCountSliderProps) {
        
        super(props);

        this.update = this.update.bind(this);

        this.state = { value: props.model.generationsCount };
    }

    render() {
        const { disabled } = this.props;
        const { value } = this.state;

        return (
            <Slider 
                showValue 
                label='Generations count' 
                min={config.minGenerationsCount} 
                max={config.maxGenerationsCount} 
                value={value}
                onChange={this.update}
                disabled={disabled}
            />
        );
    }

    private update(value: number): void {

        const { model } = this.props;

        model.setGenerationsCount(value);
        
        this.setState({ value: model.generationsCount });
    }
}