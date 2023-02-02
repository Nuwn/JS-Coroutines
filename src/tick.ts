export default class Tick {
    private static instance: Tick | undefined;
    private previousTimeStamp: number | undefined = undefined;
    private updateCallbacks: (() => void)[] = []; 
    private nextTick: () => void;
    private disposed = false;
    
    public deltaTime: number = Date.now();

    private constructor() {
        Tick.instance = this;

        // this is the most unsure part. we use anim frame for browsers, and timeout for node.
        this.nextTick = (globalThis.window !== undefined) ? 
        () => requestAnimationFrame(this.Tick.bind(this)):
        () => setTimeout(() => this.Tick(Date.now()), 0);

        this.nextTick();
    }

    public static get Instance(){
        if(!this.instance)
            this.instance = new this();

        return this.instance;
    }

    private Tick(timestamp: number): void {
        if(this.previousTimeStamp === undefined) {
            this.previousTimeStamp = timestamp;
        }

        this.deltaTime = timestamp - this.previousTimeStamp!;

        this.Update();

        this.previousTimeStamp = timestamp;

        if(!this.disposed)
            this.nextTick();
    }

    public OnUpdate(action: () => void): void {
        if(!this.disposed)
            this.updateCallbacks.push(action);
    }
    
    /**
     * Unregisters an update event.
     * @param action 
     * @returns boolean, true if unregistered, false if not unregistered.
     */
    public StopUpdate(action: () => void): boolean { 
        const count = this.updateCallbacks.length;
        this.updateCallbacks = this.updateCallbacks.filter(x => x !== action);
        
        if(this.updateCallbacks.length === count)
            return false;

        if(this.updateCallbacks.length === 0){
            this.disposed = true;
            Tick.instance = undefined;
        }

        return true;
    }
    
    private Update(): void {
        if (this.updateCallbacks.length <= 0) return;

        this.updateCallbacks = this.updateCallbacks.filter(x => x != undefined);

        this.updateCallbacks.forEach((target) => {   
            target();
        });
    }
}
