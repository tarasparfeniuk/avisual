import { CommandBarButton, Slider, TextField } from '@fluentui/react';
import React from 'react';
import { Component } from 'react';
import { ISortingInput } from '../../model/sorting/SortingInput';
import { Array } from './Array';
import { array as config } from "../../config/sorting";
import './ArrayEditor.css';

type ArrayEditorProps = {
    model: ISortingInput
}

type ArrayEditorState = {
    input?: ArrayElement[],
    arraySize?: number
}

export class ArrayEditor extends Component<ArrayEditorProps, ArrayEditorState> {

    constructor(props: ArrayEditorProps) {

        super(props);

        this.resizeArray = this.resizeArray.bind(this);
        this.generateRandomArray = this.generateRandomArray.bind(this);

        this.state = { 
            input: props.model.array.map(i => new ArrayElement(i.toString())), 
            arraySize: props.model.arraySize 
        };
    }

    render() {

        const { model } = this.props;
        const { input = [], arraySize } = this.state;

        const arrayString = input.map(i => i.toString()).join(",");

        return (
            <div className="array-editor">
                <div className="elements-input">
                    <TextField
                        value={arrayString}
                        onChange={(e, v) => this.onInputChange(e, v)}
                    />
                    <CommandBarButton 
                        iconProps={{ iconName:"Refresh" }} 
                        onClick={this.generateRandomArray}
                    />
                </div>
                <Slider 
                    showValue 
                    min={config.minSize} 
                    max={config.maxSize} 
                    defaultValue={model.arraySize} 
                    value={arraySize}
                    onChange={this.resizeArray}
                />
                <Array array={model.array} selection={[]} />
            </div>
        );
    }

    private onInputChange(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string = ""): void {

        const { model } = this.props;
        
        const arrayElements = newValue.split(",")
            .map(i => new ArrayElement(i))
            .slice(0, config.maxSize);

        model.setArray(arrayElements.map(i => i.value));

        this.setState({ input: arrayElements, arraySize: model.arraySize });
    }

    private resizeArray(newSize: number): void {

        const { model } = this.props;
        const { input = [] } = this.state;

        model.setArraySize(newSize);

        const newArray = [];

        for (let i = 0; i < model.arraySize; i++) {

            if (i < input.length) newArray.push(input[i]);
            else newArray.push(new ArrayElement("0"));
        }

        model.setArray(newArray.map(i => i.value));

        this.setState({ input: newArray, arraySize: model.arraySize });
    }

    private generateRandomArray(): void {

        const { model } = this.props;

        model.setRandomArray();

        const arrayElements = model.array.map(i => new ArrayElement(i.toString()));

        const stateUpdate = {
            input: arrayElements,
        };

        this.setState(stateUpdate);
    }
}

class ArrayElement {
    
    private _value: string;

    constructor (value: string) {

        this._value = value;
    }

    public get value(): number {

        const num = Number(this._value.trim());

        return Number.isNaN(num) ? 0 : num;
    }

    public toString(): string {

        return this._value;
    } 
}