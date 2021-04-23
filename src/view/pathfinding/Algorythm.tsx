import { CommandBar, ICommandBarItemProps, Icon, Label, ProgressIndicator } from "@fluentui/react";
import React from "react";
import { AlgorythmInfo } from "../../model/AlgorythmInfo";
import { Field } from "../../model/pathfinding/map/Field";
import './Algorythm.css';
import { FieldView } from "./Field";

type AlgoViewProps = { 
    field: Field,
    viewId: number,
    closeView: (viewId: number) => void,
    isFinished: boolean,
    isRunning: boolean,
    operationsCount: number,
    info: AlgorythmInfo
};

export const AlgorythmView = (props: AlgoViewProps) => {

    const { 
        field,
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

    return (
        <div className='algorythm'>
            <CommandBar items={items} farItems={farItems} />
            <FieldView value={field} />
            <ProgressIndicator progressHidden={!isRunning} />
            {
                isFinished && (
                    <Icon iconName='CheckMark' />
                )
            }
        </div>
    );
} 
