import { NetworkTables, NetworkTablesTopic, NetworkTablesTypeInfo, NetworkTablesTypes } from "ntcore-ts-client";

export type TopicOptions<T extends NetworkTablesTypes> = {
    publish?: boolean
    cached?: boolean
    persistent?: boolean
    retained?: boolean
    defaultValue?: T
}

export class NetworkTablesReact {
    ntClient: NetworkTables
    topics: { [key: string]: { hash: string, topic: NetworkTablesTopic<any> } } = {}

    constructor(ntClient: NetworkTables) {
        this.ntClient = ntClient
    }

    getTopic<T extends NetworkTablesTypes>(name: string, typeInfo: NetworkTablesTypeInfo, options?: TopicOptions<T>): NetworkTablesTopic<T> {
        const attributesHash = JSON.stringify(typeInfo) + JSON.stringify(options)
        const existingTopic = this.topics[name]
        if (existingTopic != null) {
            if (existingTopic.hash != attributesHash) {
                throw new Error("Attempted to get a topic that already exists with different options")
            }
            return existingTopic.topic as NetworkTablesTopic<T>
        } else {
            const newTopic = this.ntClient.createTopic(name, typeInfo, options?.defaultValue)
            this.topics[name] = { hash: attributesHash, topic: newTopic }
            if (options?.publish) {
                newTopic.publish({
                    cached: options?.cached,
                    persistent: options?.persistent,
                    retained: options?.retained
                }).then(console.log).catch(console.log)
            }
            return newTopic
        }
    }
}