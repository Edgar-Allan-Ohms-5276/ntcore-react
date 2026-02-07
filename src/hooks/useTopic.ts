import { useContext, useEffect, useMemo, useState } from "react";
import { NetworkTablesContext } from "../components/NetworkTablesProvider.js";
import type { NetworkTablesTypeInfo, NetworkTablesTypes } from "ntcore-ts-client";

export type UseTopicOptions<T extends NetworkTablesTypes> = {
    publish?: boolean
    cached?: boolean
    persistent?: boolean
    retained?: boolean
    defaultValue?: T
}

export function useTopic<T extends NetworkTablesTypes>(
    name: string,
    typeInfo: NetworkTablesTypeInfo,
    options?: UseTopicOptions<T>
): [T | null, (_: T) => void] {
    const client = useContext(NetworkTablesContext)

    const topic = useMemo(
        () => client?.createTopic(name, typeInfo, options?.defaultValue) ?? null,
        [client, name, options?.defaultValue, typeInfo]
    )

    useEffect(() => {
        if (topic != null && options?.publish === true) {
            topic.publish({
                cached: options?.cached,
                persistent: options?.persistent,
                retained: options?.retained
            })
        }

        return () => {
            if (topic != null && options?.publish === true) {
                try {
                    topic.unpublish()
                } catch (e) {}
            }
        }
    }, [topic, options])

    const [value, updateValue] = useState<T | null>(options?.defaultValue ?? null)

    useEffect(() => {
        const uid = topic?.subscribe(updateValue)

        return () => {
            if (uid != null) topic?.unsubscribe(uid)
        }
    }, [topic, updateValue])

    const setValue = topic?.setValue ?? (() => { })

    return [value, setValue]
}