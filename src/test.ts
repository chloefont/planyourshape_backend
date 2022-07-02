interface Mdr{
    test:number;
    lol():number;
}

interface Login{
    [key:string]:number;
}

let monLogin:Login = {
    mdr:"10",
    t:8
}



class Test implements Mdr{
    test:number = 10;

    constructor(){
        this.test
    }
    lol(): number {
        throw new Error("Method not implemented.");
    }
}