import { IStepController } from "./IStepController";


export class InstantStepController implements IStepController {

    onStepExecuted(handler: () => void): void {

        return;
    }

    nextStep(): Promise<void> {

        return new Promise<void>((resolve, _) => resolve());
    }

    reset(stepInterval: number): void {

        return;
    }

    start(): void {

        return;
    }

    pause(): void {

        return;
    }

    dispose(): void {

        return;
    }
}
