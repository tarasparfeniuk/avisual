export class AlgorythmStepEventStore extends EventTarget {

    private readonly _stepEventName: string;
    private readonly _stepEvent: Event;

    constructor() {
       
        super();

        this._stepEventName = "stepInitiated";
        this._stepEvent = new Event(this._stepEventName);
    }
    
    public onNextStep(listener: EventListener): void {

        this.addEventListenerOnce(this._stepEventName, listener);
    }

    private addEventListenerOnce(type: string, listener: EventListener) {
        const target = this;

        target.addEventListener(type, function fn(event) {
            
            target.removeEventListener(type, fn);
            listener(event);
        });
    }

    public dispatchStepEvent() {

        this.dispatchEvent(this._stepEvent);
    }
}