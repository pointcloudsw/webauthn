

export function boolState() {
    let bState = $state(false);

    return {
        get() : boolean { return bState; },
        set(v:boolean) : void { bState = v; },
        flip() : void { bState = !bState; }
    }
};
