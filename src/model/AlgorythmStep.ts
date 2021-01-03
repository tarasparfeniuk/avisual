export function createSteps(functions: (() => void)[]): AlgorythmStep {

    const head = new AlgorythmStep(functions[0]);

    let current = head;

    for (let i = 1; i < functions.length; i++) {

        current.next = new AlgorythmStep(functions[i]);

        current = current.next;
    }

    current.next = head;

    return head;
}

export class AlgorythmStep {

    private readonly _current: () => void;

    constructor(func: () => void, next?: AlgorythmStep) {

        this.next = next;
        this._current = func;
    }

    public next?: AlgorythmStep;

    public execute() {

        this._current();
    } 
}
