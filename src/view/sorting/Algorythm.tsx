import { CommandBar, ICommandBarItemProps, Icon, Label, ProgressIndicator } from "@fluentui/react";
import React from "react";
import { AlgorythmInfo } from "../../model/AlgorythmInfo";
import { Array } from "./Array";
import './Algorythm.css';

type AlgoViewProps = { 
    viewId: number,
    closeView: (viewId: number) => void,
    array: number[],
    selection: number[],
    isFinished: boolean,
    isRunning: boolean,
    operationsCount: number,
    info: AlgorythmInfo
};

export const AlgorythmView = (props: AlgoViewProps) => {

    const { 
        array, 
        selection, 
        viewId, 
        closeView, 
        isRunning, 
        operationsCount, 
        isFinished, 
        info 
    } = props;

    const items: ICommandBarItemProps[] = [
        {
            key: 'algoTitle',
            text: info.name,
            href: info.link,
            iconProps: { iconName: 'Info' }
        }
    ];

    const farItems: ICommandBarItemProps[] = [
        {
            key: 'closeBtn',
            onClick: () => closeView(viewId),
            iconProps: {
                iconName: 'ChromeClose'
            },
            iconOnly: true
        }
    ]

    const operationsCountString = operationsCount > 0
        ? `~${operationsCount}`
        : operationsCount;

    return (
        <div className='algorythm'>
            <CommandBar items={items} farItems={farItems} />
            <Array array={array} selection={selection} />
            <ProgressIndicator progressHidden={!isRunning} />
            <Label>Items: {array.length} | Operations: {operationsCountString}</Label>
            {
                isFinished && (
                    <Icon iconName='CheckMark' />
                )
            }
        </div>
    );
} 
