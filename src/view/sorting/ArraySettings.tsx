import { Slider } from "@fluentui/react";
import React from "react";
import './ArraySettings.css';

type ArraySettingsProps = { 
    enabled: boolean,
    defaultArraySize: number, 
    updateArray: (newSize: number) => void 
};

export class ArraySettings extends React.Component<ArraySettingsProps> {
    
    render() {

        const { defaultArraySize = 10, updateArray, enabled } = this.props;

        return (
            <div className='array-settings-toolbar'>
                <Slider 
                    showValue 
                    label='Array size' 
                    min={2} 
                    max={100} 
                    defaultValue={defaultArraySize} 
                    onChange={updateArray}
                    disabled={!enabled}
                />
            </div>
        );
    }
}
