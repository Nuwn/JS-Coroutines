import { StartCoroutine } from "./dist/index.js";
import { WaitUntil, WaitForSeconds } from "./dist/coroutines.js";


let x = 0;
function* Init(){
    console.log("init");

    yield* WaitUntil(() => x == 1);

    console.log(x);

    yield* WaitForSeconds(2);

    console.log("done");
}

setTimeout(() => {
    x = 1;
}, 1000);

let coroutine = StartCoroutine(Init());


