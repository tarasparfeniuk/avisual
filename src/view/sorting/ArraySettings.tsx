import { CommandBarButton, Slider } from "@fluentui/react";
import React from "react";
import './ArraySettings.css';
import { Array } from "./Array";
 
type ArraySettingsProps = { 
    enabled: boolean,
    defaultArraySize: number, 
    updateArray: (newArray: number[]) => void 
};

type ArraySettingsState = { 
    array: number[],
    arraySize: number
};

export class ArraySettings extends React.Component<ArraySettingsProps, ArraySettingsState> {
    
    constructor(props: ArraySettingsProps) {

        super(props);

        this.updateArray = this.updateArray.bind(this);
        this.regenerateArray = this.regenerateArray.bind(this);

        this.state = { 
            arraySize: props.defaultArraySize, 
            array: this.createArray(props.defaultArraySize) 
        };

        props.updateArray(this.state.array);
    }

    render() {

        const { defaultArraySize = 10, enabled } = this.props;
        const { array, arraySize } = this.state;

        return (
            <div className='array-settings-toolbar'>
                <Slider 
                    showValue 
                    label='Array size' 
                    min={2} 
                    max={250} 
                    defaultValue={defaultArraySize} 
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

    private createArray(size: number): number[] {

        const array = [];

        for (let i = 0; i < size; i++) {

            const min = -10;
            const max = 10;
            const val = Math.floor(Math.random() * (max - min + 1)) + min;

            array.push(val);
        }

        return array;
    }

    private updateArray(newSize: number): void {

        const { updateArray } = this.props;

        const array = this.createArray(newSize);

        this.setState({ arraySize: newSize, array });

        updateArray(array);
    }

    private regenerateArray(): void {

        const { updateArray } = this.props;
        const { arraySize } = this.state;

        const array = this.createArray(arraySize);

        this.setState({ array });

        updateArray(array);
    }
}
