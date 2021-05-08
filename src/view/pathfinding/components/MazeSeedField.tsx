import React from "react";
import { IPathfindingInput } from "../../../model/pathfinding/PathfindingInput"
import { Checkbox, TextField } from "@fluentui/react";
import "./MazeSeedField.css";

type MazeSeedFieldProps = {
    model: IPathfindingInput,
    disabled?: boolean
}

type MazeSeedFieldState = {
    keepValue: boolean,
    seed: number
}

export class MazeSeedField extends React.Component<MazeSeedFieldProps, MazeSeedFieldState> {

    constructor(props: MazeSeedFieldProps) {
        
        super(props);

        this.switchSeedKeeper = this.switchSeedKeeper.bind(this);
        this.setSeedValue = this.setSeedValue.bind(this);
        this.onInputUpdated = this.onInputUpdated.bind(this);

        this.state = { seed: props.model.mazeSeed, keepValue: props.model.keepSeedValue }
    }

    componentDidMount() {

        const { model } = this.props;

        model.onInputUpdated(this.onInputUpdated);
    }

    render() {
        
        const { disabled } = this.props;
        const { seed, keepValue } = this.state;

        return (
            <div className="maze-seed-field-set">
                <TextField 
                    label="Seed"
                    datatype="number" 
                    value={seed.toString()}
                    onChange={this.setSeedValue} 
                    disabled={disabled}
                />
                <Checkbox 
                    label='Keep seed value' 
                    checked={keepValue} 
                    onChange={this.switchSeedKeeper}
                    disabled={disabled} 
                />
            </div>
        );
    }

    private setSeedValue(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) {

        const { model } = this.props;
        const num = Number(newValue);

        if (Number.isSafeInteger(num)) {

            model.setMazeSeed(num);
            this.setState({ seed: model.mazeSeed, keepValue: model.keepSeedValue });
        }
    }

    private switchSeedKeeper(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, checked?: boolean | undefined): void {

        const { model } = this.props;

        model.switchSeedKeeper(checked ?? false);
        this.setState({ keepValue: model.keepSeedValue });
    }

    private onInputUpdated(): void {

        const { model } = this.props;

        this.setState({ seed: model.mazeSeed })
    }
}