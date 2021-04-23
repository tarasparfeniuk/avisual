import { CommandBar, CommandBarButton, ICommandBarItemProps, Slider } from "@fluentui/react";
import React from "react";
import { AlgorythmView } from "./Algorythm";
import { FieldSettings } from "./FieldSettings";
import './Demo.css';
import * as config from "../../config/sorting";
import { PathfindingDemoModel } from "../../model/pathfinding/PathfindingDemoModel";
import { IPathfindingAlgorythm, IPathfindingAlgorythmFactory } from "../../model/pathfinding/IPathfindingAlgorythm";

type SortingDemoViewProps = {
    model: PathfindingDemoModel
}

type SortingDemoViewState = {
    canPlay?: boolean,
    canPause?: boolean,
    canStop?: boolean,
    canAddAlgorythm?: boolean, 
    demoSpeed?: number,
    algorythms?: IPathfindingAlgorythm[]
}

export class PathfindingDemoView extends React.Component<SortingDemoViewProps, SortingDemoViewState> {

    constructor(props: SortingDemoViewProps) {

        super(props);

        const model = props.model;

        this.state = {
            algorythms: model.algorythms,
            canPlay: model.canPlay,
            canPause: model.canPause,
            canStop: model.canStop,
            canAddAlgorythm: model.canAddAlgorythm,
            demoSpeed: model.demoSpeed
        };

        this.addAlgorythm = this.addAlgorythm.bind(this);
        this.removeAlgorythm = this.removeAlgorythm.bind(this);
        this.changeDemoSpeed = this.changeDemoSpeed.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
    }

    componentDidMount() {

        const { model } = this.props;

        model.onStepExecuted(() => { 
            
            const stateUpdate: SortingDemoViewState = {
                algorythms: model.algorythms,
                canPlay: model.canPlay,
                canPause: model.canPause,
                canStop: model.canStop,
                canAddAlgorythm: model.canAddAlgorythm
            }
    
            this.setState(stateUpdate);
        });

        model.onInputUpdated(() => {

            const stateUpdate: SortingDemoViewState = {
                algorythms: model.algorythms,
                canPlay: model.canPlay,
                canPause: model.canPause,
                canStop: model.canStop,
                canAddAlgorythm: model.canAddAlgorythm
            };

            this.setState(stateUpdate);
        });
    }

    render() {

        const { model } = this.props;
        const { 
            demoSpeed, 
            canAddAlgorythm, 
            canPlay, 
            canStop, 
            canPause, 
            algorythms = [],
        } = this.state;

        const addAlgorythmMenuProps = {
            items: model.availableAlgorythms.map(i => ({
                key: `add-algo_${i.algorythmName}`,
                text: i.algorythmName,
                onClick: () => this.addAlgorythm(i)
            }))
        };

        const demoControls: ICommandBarItemProps[] = [
            {
                key: 'playDemo',
                iconProps: { iconName: 'Play' },
                disabled: !canPlay,
                iconOnly: true,
                onClick: this.play.bind(model)
            },
            {
                key: 'pauseDemo',
                iconProps: { iconName: 'Pause' },
                disabled: !canPause,
                iconOnly: true,
                onClick: this.pause.bind(model)
            },
            {
                key: 'stopDemo',
                iconProps: { iconName: 'Stop' },
                disabled: !canStop,
                iconOnly: true,
                onClick: this.stop.bind(model)
            }
        ];

        return (
            <div className='demo-view'>
                <div className='demo-settings-toolbar'>
                    <CommandBarButton text='Add algorythm'
                        iconProps={{ iconName: 'Add' }}
                        disabled={!canAddAlgorythm}
                        menuProps={addAlgorythmMenuProps} />
                    <CommandBar items={demoControls} />
                    <Slider 
                        showValue 
                        label='Demo speed' 
                        min={config.demo.minSpeed} 
                        max={config.demo.maxSpeed} 
                        defaultValue={model.demoSpeed} 
                        onChange={this.changeDemoSpeed}
                        value={demoSpeed}
                    />
                </div>
                <FieldSettings
                    enabled={model.canUpdateArray}
                    model={model.input}
                />
                <div className='algorythms-container'>
                {
                    algorythms.map((i, idx) => {
                        
                        const isRunning = model.isPlaying && !i.isFinished;

                        return (
                            <AlgorythmView
                                viewId={idx}
                                field={i.field}
                                isRunning={isRunning}
                                isFinished={i.isFinished}
                                closeView={this.removeAlgorythm}
                                operationsCount={i.currentOperationNumber}
                                info={i.info}
                            />
                        );
                    })
                }
                </div>
            </div>
        );
    }

    private changeDemoSpeed(newSpeed: number): void {

        const { model } = this.props;

        model.changeDemoSpeed(newSpeed);

        const stateUpdate: SortingDemoViewState = {
            demoSpeed: model.demoSpeed
        }

        this.setState(stateUpdate);
    }

    private addAlgorythm(factory: IPathfindingAlgorythmFactory): void {

        const { model } = this.props;

        model.addAlgorythm(factory);

        const stateUpdate: SortingDemoViewState = {
            algorythms: model.algorythms,
            canPlay: model.canPlay,
            canPause: model.canPause,
            canStop: model.canStop,
            canAddAlgorythm: model.canAddAlgorythm
        }

        this.setState(stateUpdate);
    }

    private removeAlgorythm(id: number): void {

        const { model } = this.props;

        model.removeAlgorythm(id);
        
        const stateUpdate: SortingDemoViewState = {
            algorythms: model.algorythms
        }

        this.setState(stateUpdate);
    }

    
    private play(): void {

        const { model } = this.props;

        model.play();
        
        const stateUpdate: SortingDemoViewState = {
            canPlay: model.canPlay,
            canPause: model.canPause,
            canStop: model.canStop,
            canAddAlgorythm: model.canAddAlgorythm
        }

        this.setState(stateUpdate);
    }

    private pause(): void {

        const { model } = this.props;

        model.pause();
        
        const stateUpdate: SortingDemoViewState = {
            canPlay: model.canPlay,
            canPause: model.canPause,
            canStop: model.canStop,
            canAddAlgorythm: model.canAddAlgorythm
        }

        this.setState(stateUpdate);
    }

    private stop(): void {

        const { model } = this.props;

        model.stop();
        
        const stateUpdate: SortingDemoViewState = {
            canPlay: model.canPlay,
            canPause: model.canPause,
            canStop: model.canStop,
            canAddAlgorythm: model.canAddAlgorythm
        }

        this.setState(stateUpdate);
    }
}
