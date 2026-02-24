import { useContext, useEffect, useEffectEvent, useState } from "react";
import { NetworkTablesContext } from "../components/NetworkTablesProvider.js";
import { TopicProperties } from "@2702rebels/ntcore";
import { getTypeStringFromValue, NetworkTablesTypes } from "../NetworkTablesHandler.js";

type WidenLiteral<T> =
    T extends string ? string :
    T extends number ? number :
    T extends boolean ? boolean :
    T;

export type UseTopicOptions = TopicProperties

export function useTopic<T extends NetworkTablesTypes>(
    name: string,
    defaultValue: WidenLiteral<T>,
    options?: UseTopicOptions
): [WidenLiteral<T>, (_: WidenLiteral<T>) => void] {
    const [value, updateValue] = useState<WidenLiteral<T>>(defaultValue)

    const handler = useContext(NetworkTablesContext)

    const onTopicData = useEffectEvent((topic: string, value: WidenLiteral<T>) => {
        if (topic === name) {
            updateValue(value)
        }
    })

    const setupTopicPublish = useEffectEvent(() => {
        if (handler != null) {
            handler.client.publishTopic(name, getTypeStringFromValue(defaultValue), options)
            handler?.client.setDefaultValue(name, defaultValue)
        }
    })

    useEffect(() => {
        if (handler != null) {
            const callback = onTopicData

            handler.addListener("onTopicData", callback)
            const subscription = handler.client.subscribe(name, {})
            setupTopicPublish()

            return () => {
                handler.removeListener("onTopicData", callback)
                handler.client.unpublishTopic(name)
                handler.client.unsubscribe(subscription)
            }
        }

    }, [handler, name])

    const setValue = (value: WidenLiteral<T>) => {
        handler?.client.setValue(name, value)
    }

    return [value, setValue]
}