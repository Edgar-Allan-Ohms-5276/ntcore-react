import { NT4Client, NT4ClientOptions } from "@2702rebels/ntcore"

export class NetworkTablesHandler {

    client: NT4Client

    listeners = {
        onConnect: [] as (() => void)[],
        onDisconnect: [] as (() => void)[]
    }

    constructor(uri: string) {
        const options: NT4ClientOptions = {
            onConnect: () => this.callListeners("onConnect"),
            onDisconnect: () => this.callListeners("onDisconnect")
        }
        this.client = new NT4Client(uri, "edgar-allan-ohms_ntcore-react", options)
    }

    callListeners = (event: keyof typeof this.listeners) => {
        this.listeners[event].forEach((callback) => callback())
    }

    addListener = (event: keyof typeof this.listeners, callback: () => void) => {
        this.listeners[event].push(callback)
    }

    removeListener = (event: keyof typeof this.listeners, callback: () => void) => {
        const index = this.listeners[event].indexOf(callback);
        if (index > -1) {
            this.listeners[event].splice(index, 1);
        }
    }
}