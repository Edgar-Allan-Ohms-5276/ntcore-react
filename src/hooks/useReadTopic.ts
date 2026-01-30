import type { NetworkTablesTypeInfo } from "ntcore-ts-client";

export function useReadTopic<T extends NetworkTablesTypes>(name: string, typeInfo: NetworkTablesTypeInfo): [T | null] {
    const [ value ] = useTopic<T>(name, typeInfo)
    return [ value ]
}