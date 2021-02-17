import { CommandBar, CommandBarButton, ICommandBarItemProps, Slider } from "@fluentui/react";
import React from "react";
import { BubbleSortAlgorythmFactory } from "../../model/sorting/bubble/BubbleSortAlgorythmFactory";
import { ISortAlgorythm, ISortAlgorythmFactory } from "../../model/sorting/ISortAlgorythm";
import { MergeSortAlgorythmFactory } from "../../model/sorting/merge/MergeSortAlgorythmFactory";
import { QuickSortAlgorythmFactory } from "../../model/sorting/quick/QuickSortAlgorythmFactory";
import { AlgorythmView } from "./Algorythm";
import { ArraySettings } from "./ArraySettings";
import './Demo.css';

type DemoState = "PLAYING" | "PAUSED" | "STOPPED";

const STEP_INTERVAL = 500;
const DEFAULT_ARRAY_SIZE = 10;
const DEFAULT_DEMO_SPEED = 10;

type SortingDemoViewState = {
    demoState?: DemoState,
    sourceArray?: number[],
    algorythms?: ISortAlgorythm<number>[]
}

export class SortingDemoView extends React.Component<{}, SortingDemoViewState> {

    private readonly _availableAlgorythms: ISortAlgorythmFactory<number>[];

    private _stepTimerId: any;

    constructor(props: {}) {

        super(props);

        this.state = {
            demoState: "STOPPED",
            algorythms: [],
            sourceArray: []
        };

        this.addAlgorythm = this.addAlgorythm.bind(this);
        this.executeStep = this.executeStep.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.removeAlgorythm = this.removeAlgorythm.bind(this);
        this.updateSourceArray = this.updateSourceArray.bind(this);
        this.changeDemoSpeed = this.changeDemoSpeed.bind(this);

        this._availableAlgorythms = [
            new BubbleSortAlgorythmFactory((a, b) => a - b),
            new MergeSortAlgorythmFactory((a, b) => a - b),
            new QuickSortAlgorythmFactory((a, b) => a - b)
        ];
    }

    componentDidMount() {

        this._stepTimerId = setInterval(this.executeStep, STEP_INTERVAL / DEFAULT_DEMO_SPEED);
    }

    componentWillUnmount() {

        clearInterval(this._stepTimerId);
    }

    render() {

        const { demoState, algorythms = [], sourceArray = [] } = this.state;

        const addAlgorythmMenuProps = {
            items: this._availableAlgorythms.map(i => ({
                key: `add-algo_${i.algorythmName}`,
                text: i.algorythmName,
                onClick: () => this.addAlgorythm(i.create(sourceArray))
            }))
        };

        const demoControls: ICommandBarItemProps[] = [
            {
                key: 'playDemo',
                iconProps: { iconName: 'Play' },
                disabled: demoState === "PLAYING" || algorythms.length === 0,
                iconOnly: true,
                onClick: this.play
            },
            {
                key: 'pauseDemo',
                iconProps: { iconName: 'Pause' },
                disabled: demoState === "PAUSED" || demoState === "STOPPED",
                iconOnly: true,
                onClick: this.pause
            },
            {
                key: 'stopDemo',
                iconProps: { iconName: 'Stop' },
                disabled: demoState === "STOPPED",
                iconOnly: true,
                onClick: this.stop
            }
        ];

        return (
            <div className='demo-view'>
                <div className='demo-settings-toolbar'>
                    <CommandBarButton text='Add algorythm'
                        iconProps={{ iconName: 'Add' }}
                        disabled={demoState === "PLAYING" || demoState === "PAUSED"}
                        menuProps={addAlgorythmMenuProps} />
                    <CommandBar items={demoControls} />
                    <Slider 
                        showValue 
                        label='Demo speed' 
                        min={1} 
                        max={100} 
                        defaultValue={DEFAULT_DEMO_SPEED} 
                        onChange={this.changeDemoSpeed}
                    />
                </div>
                <ArraySettings
                    enabled={this.canUpdateSourceArray}
                    defaultArraySize={DEFAULT_ARRAY_SIZE}
                    updateArray={this.updateSourceArray}
                />
                <div className='algorythms-container'>
                {
                    algorythms.map((i, idx) => {
                        
                        const isRunning = demoState === "PLAYING" && !i.isFinished;

                        return (
                            <AlgorythmView
                                viewId={idx}
                                array={i.array}
                                selection={i.currentSelection}
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

    private get canUpdateSourceArray(): boolean {

        return this.state.demoState === "STOPPED";
    }

    private play(): void {

        const { demoState, sourceArray = [], algorythms = [] } = this.state;

        if (demoState === "PAUSED") {

            this.setState({ demoState: "PLAYING" })
        }

        if (demoState === "STOPPED") {

            const stateUpdate: SortingDemoViewState = { 
                demoState: "PLAYING",
                algorythms: algorythms.map(i => i.copyWithArray(sourceArray)),
            };

            this.setState(stateUpdate)
        }
    }

    private pause(): void {

        if (this.state.demoState === "PLAYING") {

            this.setState({ demoState: "PAUSED" })
        }
    }

    private stop(): void {

        const { demoState } = this.state;

        if (demoState === "PLAYING" || demoState === "PAUSED") {

            const stateUpdate: SortingDemoViewState = {
                demoState: "STOPPED"
            };

            this.setState(stateUpdate);
        }
    }

    private addAlgorythm(algo: ISortAlgorythm<number>): void {

        const { algorythms = [] } = this.state;

        const stateUpdate: SortingDemoViewState = {
            algorythms: algorythms.concat(algo)
        }

        this.setState(stateUpdate);
    }

    private removeAlgorythm(id: number): void {

        const { algorythms = [] } = this.state;
        
        algorythms.splice(id, 1);
        
        const stateUpdate: SortingDemoViewState = {
            algorythms
        }

        if (algorythms.length === 0) {
            stateUpdate.demoState = "STOPPED";
        }

        this.setState(stateUpdate);
    }

    private updateSourceArray(newArray: number[]) {

        if (this.canUpdateSourceArray) {
            
            const { algorythms = [] } = this.state;

            const stateUpdate: SortingDemoViewState = {
                sourceArray: newArray,
                algorythms: algorythms.map(i => i.copyWithArray(newArray))
            }
    
            this.setState(stateUpdate);
        }
    }

    private changeDemoSpeed(newSpeed: number): void {

        clearInterval(this._stepTimerId);

        this._stepTimerId = setInterval(this.executeStep, STEP_INTERVAL / newSpeed);
    }

    private executeStep(): void {

        if (this.state.demoState === "PLAYING") {

            const { algorythms = [] } = this.state;

            const unfinished = algorythms.filter(a => !a.isFinished);

            if (unfinished.length === 0) {

                this.stop();

                return;
            }

            unfinished.forEach((algo: ISortAlgorythm<number>) => {

                if (!algo.isFinished) {

                    algo.executeStep();
                }
            });

            this.setState({ algorythms })
        }
    }
}
