import type { NetworkTablesTypeInfo, NetworkTablesTypes } from "ntcore-ts-client"
import useTopic, { type UseTopicOptions } from "./useTopic.js"

type UsePublishTopicOptions<T extends NetworkTablesTypes> = Omit<UseTopicOptions<T>, "publish">

export default function usePublishTopic<T extends NetworkTablesTypes>(name: string, typeInfo: NetworkTablesTypeInfo, options?: UsePublishTopicOptions<T>) {
    const [ value, setValue ] = useTopic(name, typeInfo, { ...options, publish: true })
    return [ value, setValue ]
}