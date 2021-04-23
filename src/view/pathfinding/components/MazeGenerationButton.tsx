import React from "react";
import { IPathfindingInput } from "../../../model/pathfinding/PathfindingInput"
import { Checkbox, CommandBarButton } from "@fluentui/react";
import "./MazeGenerationButton.css";

type MazeGenerationButtonProps = {
    model: IPathfindingInput,
    disabled?: boolean
}

type MazeGenerationButtonState = {
    enableStepExecution: boolean    
}

export class MazeGenerationButton extends React.Component<MazeGenerationButtonProps, MazeGenerationButtonState> {

    constructor(props: MazeGenerationButtonProps) {
        
        super(props);

        this.regenerateMaze = this.regenerateMaze.bind(this);
        this.swichStepExecution = this.swichStepExecution.bind(this);

        this.state = { enableStepExecution: props.model.enableStepExecution };
    }

    render() {
        const { disabled } = this.props;
        const { enableStepExecution } = this.state;

        return (
            <div className="maze-gen-btn-set">
                <Checkbox label='Step-by-step' 
                    checked={enableStepExecution} 
                    onChange={this.swichStepExecution} 
                />
                <CommandBarButton 
                    iconProps={{ iconName:"Refresh" }} 
                    onClick={this.regenerateMaze} 
                    disabled={disabled} 
                />
            </div>
        );
    }

    private swichStepExecution(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, checked?: boolean | undefined): void {

        const { model } = this.props;

        model.switchStepExecution(checked ?? false);

        const stateUpdate = {
            enableStepExecution: model.enableStepExecution
        };

        this.setState(stateUpdate);
    }

    private regenerateMaze(): void {

        const { model } = this.props;

        model.setRandomMaze();
    }
}