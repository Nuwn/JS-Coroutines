import Tick from "./tick.js";

class CoroutineUtility {
    private static instance: CoroutineUtility | undefined;

    public static get Instance(){
        if(!this.instance)
            this.instance = new this();

        return this.instance;
    }
    // Contains ref to all registered coroutines.
    private coroutines: Coroutine[] = [];
    private updateRef: () => void;

    private constructor() {
        this.updateRef = this.Update.bind(this);

        Tick.Instance?.OnUpdate(this.updateRef);
    }

    // Add coroutine to the registered coroutines
    private addCoroutine(coroutine: Coroutine) {
        this.coroutines.push(coroutine);
    }
    // Remove coroutine from the registered coroutines
    private removeCoroutine(coroutine: Coroutine) {
        this.coroutines = this.coroutines.filter((c) => c !== coroutine);
    }

    private Update(){
        this.Invoke();
    }

    private Invoke() {
        this.coroutines = this.coroutines.filter(x => x.isDone === false)    

        if(this.coroutines.length === 0){
            Tick.Instance.StopUpdate(this.updateRef);
            CoroutineUtility.instance = undefined;
            return;
        }

        this.coroutines.forEach((item) => {       
            item.next();
        });
    }   

    public StartCoroutine(generator: any){
        const coroutine = Coroutine.Generate(generator, () => {
            StopCoroutine(coroutine);
        });
        this.addCoroutine(coroutine);
        return coroutine;
    }

    public StopCoroutine(coroutine: Coroutine){
        this.removeCoroutine(coroutine);
    }
}

class Coroutine {
    public isDone: boolean | undefined = false;
    private generator: any;
    private onComplete: () => void;

    private constructor(generator: any, onComplete: () => void){
        this.generator = generator;
        this.onComplete = onComplete;
    }

    // Advances the generator, if is done, trigger oncomplete callback.
    public next(){
        if(!this.isDone)
            this.isDone = this.generator.next().done;
        else
            this.onComplete();
    }

    public static Generate(_action: any, _onComplete: () => void){
        return new Coroutine(_action, _onComplete);
    }
}

export function StartCoroutine(action: any) {
    return CoroutineUtility.Instance.StartCoroutine(action);
}

export function StopCoroutine(coroutine: Coroutine) {
    CoroutineUtility.Instance.StopCoroutine(coroutine);
}




