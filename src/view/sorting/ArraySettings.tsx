import { CommandBarButton, Slider } from "@fluentui/react";
import React from "react";
import './ArraySettings.css';
import { Array } from "./Array";
import { array as config } from "../../config/sorting";
import { ISortingInput } from "../../model/sorting/SortingInput";
import { ArrayEditorModal } from "./ArrayEditorModal";


type ArraySettingsProps = { 
    model: ISortingInput,
    enabled: boolean
};

type ArraySettingsState = { 
    array: number[],
    arraySize: number,
    showEditor: boolean
};

export class ArraySettings extends React.Component<ArraySettingsProps, ArraySettingsState> {
    
    constructor(props: ArraySettingsProps) {

        super(props);

        const { model } = props;

        this.updateArray = this.updateArray.bind(this);
        this.regenerateArray = this.regenerateArray.bind(this);
        this.hideArrayEditor = this.hideArrayEditor.bind(this);
        this.showArrayEditor = this.showArrayEditor.bind(this);

        model.setRandomArray();

        this.state = { 
            arraySize: model.arraySize,
            array: model.array,
            showEditor: false
        };
    }

    render() {

        const { enabled, model } = this.props;
        const { array, arraySize, showEditor } = this.state;

        const classNames = ['array-settings-toolbar'];
        
        if (!enabled) classNames.push('disabled');
        
        return (
            <div className={classNames.join(' ')}>
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
                <Array array={array} selection={[]} onClick={this.showArrayEditor} />
                <CommandBarButton 
                    iconProps={{ iconName:"Refresh" }} 
                    onClick={this.regenerateArray} 
                    disabled={!enabled} 
                />
                <ArrayEditorModal model={model} isOpen={showEditor} hide={this.hideArrayEditor} />
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

    private hideArrayEditor(): void {

        const { model } = this.props;

        const stateUpdate = {
            arraySize: model.arraySize,
            array: model.array,
            showEditor: false
        };

        this.setState(stateUpdate);
    }

    private showArrayEditor(): void {

        const { enabled } = this.props;

        if (enabled) this.setState({ showEditor: true });
    }
}
