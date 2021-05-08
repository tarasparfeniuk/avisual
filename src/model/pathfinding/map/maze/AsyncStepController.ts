import { EventEmitter } from "../../../../common/EventEmitter";
import { disposeSymbol, IDisposible } from "../../../../common/IDisposible";
import { IStepController } from "./IStepController";

const STEP_INITIATED_EVENT = "STEP_INITIATED_EVENT";

export class AsyncStepController implements IStepController, IDisposible {

    private readonly _eventEmitter: EventEmitter;
    private _onStepExecuted: (() => void) | undefined;

    private _timerId: any;
    private _stepInterval: number;

    constructor(stepInterval: number) {

        this._eventEmitter = new EventEmitter();
        this._stepInterval = stepInterval;
        this.executeStep = this.executeStep.bind(this);
    }
    
    onStepExecuted(handler: () => void): void {

        this._onStepExecuted = handler;
    }

    public async nextStep(): Promise<void> {

        const promise = new Promise<void>((resolve, _) => {

            this._eventEmitter.once(STEP_INITIATED_EVENT, () => resolve());
        });

        return promise;
    }

    public reset(stepInterval: number) {

        this._stepInterval = stepInterval;

        this.start();
    }

    public start() {

        if (!!this._timerId) {

            clearInterval(this._timerId);
        }

        this._timerId = setInterval(this.executeStep, this._stepInterval);
    }

    public pause() {

        if (!!this._timerId) {

            clearInterval(this._timerId);
        }
    }

    private executeStep(): void {

        if (this._onStepExecuted)
            this._onStepExecuted();

        this._eventEmitter.emit(STEP_INITIATED_EVENT);
    }

    [disposeSymbol](): void {
        throw new Error("Method not implemented.");
    }

    public dispose() {

        this.pause();
    }
}
