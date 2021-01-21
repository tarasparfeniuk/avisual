export type AlgorythmState<TContext> = {
    context: TContext,
    isFinished: boolean,
    transition: AlgorythmStateTransition<TContext>
};

export type AlgorythmStateTransition<TContext> = 
    (state: AlgorythmState<TContext>) => AlgorythmState<TContext>[];

export class AlgorythmStateMachine<TContext> {

    private readonly _stateStack: AlgorythmState<TContext>[];
    
    protected _operationNumber: number;

    constructor(initialState: AlgorythmState<TContext>) {

        this._stateStack = [];
        this._operationNumber = 0;

        this._stateStack.push(initialState);
    }

    public get operationNumber(): number {

        return this._operationNumber;
    }

    public get currentState(): AlgorythmState<TContext> {

        return this._stateStack[this._stateStack.length - 1]
    }

    public executeStep(): void {

        const currentState: AlgorythmState<TContext> | undefined = this.popState();

        if (!currentState) {

            console.log("Can not execute step. Stack is empty.");

            return;
        }

        if (currentState.isFinished) {

            return;
        }

        const nextStates = currentState.transition(currentState);

        this._stateStack.push(...nextStates);

        this._operationNumber++;
    }

    private popState(): AlgorythmState<TContext> | undefined {

        return this._stateStack.pop();
    }
}
