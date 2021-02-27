import { CommandBarButton, Slider } from "@fluentui/react";
import React from "react";
import './ArraySettings.css';
import { Array } from "./Array";
import { array as config } from "../../config/sorting";
import { ISortingInput } from "../../model/sorting/SortingInput";

type ArraySettingsProps = { 
    model: ISortingInput,
    enabled: boolean
};

type ArraySettingsState = { 
    array: number[],
    arraySize: number
};

export class ArraySettings extends React.Component<ArraySettingsProps, ArraySettingsState> {
    
    constructor(props: ArraySettingsProps) {

        super(props);

        const { model } = props;

        this.updateArray = this.updateArray.bind(this);
        this.regenerateArray = this.regenerateArray.bind(this);

        model.setRandomArray();

        this.state = { 
            arraySize: model.arraySize,
            array: model.array
        };
    }

    render() {

        const { enabled, model } = this.props;
        const { array, arraySize } = this.state;

        return (
            <div className='array-settings-toolbar'>
                <Slider 
                    showValue 
                    label='Array size' 
                    min={config.minSize} 
                    max={config.maxSize} 
                    defaultValue={model.arraySize} 
                    value={arraySize}
                    onChange={this.updateArray}
                    disabled={!enabled}
                />
                <Array array={array} selection={[]} />
                <CommandBarButton 
                    iconProps={{ iconName:"Refresh" }} 
                    onClick={this.regenerateArray} 
                    disabled={!enabled} 
                />
            </div>
        );
    }

    private updateArray(newSize: number): void {

        const { model } = this.props;

        model.setArraySize(newSize);
        model.setRandomArray();

        const stateUpdate = {
            arraySize: model.arraySize,
            array: model.array
        };

        this.setState(stateUpdate);
    }

    private regenerateArray(): void {

        const { model } = this.props;

        model.setRandomArray();

        const stateUpdate = {
            array: model.array
        };

        this.setState(stateUpdate);
    }
}
