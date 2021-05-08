
export interface IStepController {

    nextStep(): Promise<void>;
    onStepExecuted(handler: () => void): void;
    reset(stepInterval: number): void;
    start(): void;
    pause(): void;
}
