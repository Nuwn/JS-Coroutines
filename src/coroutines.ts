import Tick from "./tick.js";

/**
 * Waits until the rule is matched.
 * @param rule predicate, boolean statement
 */
export const WaitUntil = function* (rule: () => boolean){
    while (rule() == false) {
        yield null; 
    }
} 

 /**
  * Waits for as long as the rule is true.
  * @param rule predicate, boolean statement
  */
export const WaitWhile = function* (rule: () => boolean)
{
    while(rule()){
        yield null; 
    }
}

/**
 * Wait for seconds waits for specified seconds +- how long a frame takes, so can stop ex. 8 ms before or after specified time.
 * @param seconds how many seconds to wait for
 */
export const WaitForSeconds = function* (seconds: number){
    const time = seconds * 1000; // JS likes miliseconds
    const start = Date.now();

    while(Date.now() - start <= time - (Tick.Instance?.deltaTime ?? 0)){
        yield null;
    }
}

/**
 * Unlike @see WaitForSeconds this waits for x seconds atleast passed. 
 * So if a frame is 8ms, it might be 2sec (2008ms)
 * @param seconds how many seconds to wait for
 */
export const WaitForAleastSeconds = function* (seconds: number){
    const time = seconds * 1000; // JS likes miliseconds
    const start = Date.now();

    while(Date.now() - start < time){
        yield null;
    }
}