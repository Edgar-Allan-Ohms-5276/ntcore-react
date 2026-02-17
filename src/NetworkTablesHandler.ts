import { NT4Client, NT4ClientOptions, NT4Topic } from "@2702rebels/ntcore"

export type NetworkTablesTypes = boolean | number | string | boolean[] | number[] | string[]
export type DataType = "string" | "boolean" | "double" | "int" | "float" | "json" | "raw" | "rpc" | "msgpack" | "protobuf" | "boolean[]" | "double[]" | "int[]" | "float[]" | "string[]"


export function getTypeStringFromValue(value: unknown): DataType {
    if (typeof value === "boolean") return "boolean"
    if (typeof value === "number") {
        if (Number.isInteger(value)) {
            return "int"
        } else {
            return "double"
        }
    }
    if (typeof value === "string") return "string"
    if (Array.isArray(value)) {
        if (value.every((item) => typeof item === "boolean")) return "boolean[]"
        if (value.every((item) => typeof item === "number")) {
            if (value.every((item) => Number.isInteger(item))) { return "int[]" } else { return "double[]" }
        }
        if (value.every((item) => typeof item === "string")) return "string[]"
    }
    throw new TypeError()
}

export class NetworkTablesHandler {

    client: NT4Client

    listeners = {
        onConnect: [] as (() => void)[],
        onDisconnect: [] as (() => void)[],
        onTopicData: [] as ((topic: string, value: unknown) => void)[]
    }

    topicValues: { [key: string]: { name: string, value: unknown, timestamp: number } } = {}

    constructor(uri: string) {
        const options: NT4ClientOptions = {
            onConnect: () => this.callListeners("onConnect"),
            onDisconnect: () => this.callListeners("onDisconnect"),
            onDataReceived: this.onDataReceived

        }
        this.client = new NT4Client(uri, "edgar-allan-ohms_ntcore-react", options)
    }

    callListeners = (event: keyof typeof this.listeners, ...args: unknown[]) => {
        if (event === "onTopicData") {
            const name = args[0]
            const value = args[1]
            if (typeof name !== "string") throw new TypeError()
            this.listeners[event].forEach((callback) => callback(name, value))
        } else {
            this.listeners[event].forEach((callback) => callback())
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addListener = (event: keyof typeof this.listeners, callback: (...args: any[]) => void) => { 
        this.listeners[event].push(callback)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeListener = (event: keyof typeof this.listeners, callback: (...args: any[]) => void) => {
        const index = this.listeners[event].indexOf(callback);
        if (index > -1) {
            this.listeners[event].splice(index, 1);
        }
    }

    onDataReceived = (topic: NT4Topic, value: unknown, timestamp: number) => {
        if (topic.name in Object.keys(this.topicValues)) {
            if (timestamp >= this.topicValues[topic.name].timestamp) {
                this.topicValues[topic.name].value = value
                this.topicValues[topic.name].timestamp = timestamp
                this.callListeners("onTopicData", topic.name, value)
            }
        } else {
            this.topicValues[topic.name] = {
                name: topic.name,
                value,
                timestamp
            }
            this.callListeners("onTopicData", topic.name, value)
        }
    }
}