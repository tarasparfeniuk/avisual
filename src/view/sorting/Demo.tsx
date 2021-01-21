import { CommandBar, ICommandBarItemProps } from "@fluentui/react";
import React from "react";
import { BubbleSort } from "../../model/sorting/bubble/BubbleSort";
import { ISortAlgorythm } from "../../model/sorting/ISortAlgorythm";
import { MergeSort } from "../../model/sorting/merge/MergeSort";
import { AlgorythmView } from "./Algorythm";
import { ArraySettings } from "./ArraySettings";
import './Demo.css';

type DemoState = "PLAYING" | "PAUSED" | "STOPPED";

const STEP_INTERVAL = 150;
const DEFAULT_ARRAY_SIZE = 10;

type SortingDemoViewState = {
    demoState?: DemoState,
    sourceArray?: number[],
    algorythms?: ISortAlgorythm<number>[]
}

export class SortingDemoView extends React.Component<{}, SortingDemoViewState> {

    private _stepTimerId: any;

    constructor(props: {}) {

        super(props);

        this.state = {
            demoState: "STOPPED",
            algorythms: [],
            sourceArray: []
        };

        this.addAlgorythm = this.addAlgorythm.bind(this);
        this.addBubbleSort = this.addBubbleSort.bind(this);
        this.addMergeSort = this.addMergeSort.bind(this);
        this.executeStep = this.executeStep.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.removeAlgorythm = this.removeAlgorythm.bind(this);
        this.updateSourceArray = this.updateSourceArray.bind(this);
    }

    componentDidMount() {

        this._stepTimerId = setInterval(this.executeStep, STEP_INTERVAL);
    }

    componentWillUnmount() {

        clearInterval(this._stepTimerId);
    }

    render() {

        const { demoState, algorythms = [] } = this.state;

        const items: ICommandBarItemProps[] = [
            {
                key: 'addAlgo',
                text: 'Add algorythm',
                iconProps: { iconName: 'Add' },
                disabled: demoState === "PLAYING" || demoState === "PAUSED",
                subMenuProps: {
                    items: [
                        {
                            key: 'bubbleSort',
                            text: 'bubble sort',
                            onClick: this.addBubbleSort
                        },
                        {
                            key: 'mergeSort',
                            text: 'merge sort',
                            onClick: this.addMergeSort
                        }
                    ],
                },
            },
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
            },
        ];

        return (
            <div>
                <CommandBar items={items} />
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

    private addBubbleSort(): void {

        const { sourceArray = [] } = this.state;

        const algo = new BubbleSort<number>(sourceArray, (a, b) => a - b);
        
        this.addAlgorythm(algo)
    }

    private addMergeSort(): void {

        const { sourceArray = [] } = this.state;

        const algo = new MergeSort<number>(sourceArray, (a, b) => a - b);
        
        this.addAlgorythm(algo)
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
