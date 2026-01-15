import type { NetworkTablesTypeInfo, NetworkTablesTypes } from "ntcore-ts-client";
import useTopic from "./useTopic.js";

export default function useReadTopic<T extends NetworkTablesTypes>(name: string, typeInfo: NetworkTablesTypeInfo) {
    const [ value ] = useTopic(name, typeInfo)
    return [ value ]
}