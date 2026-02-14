// import { useContext, useEffect, useMemo, useState } from "react";
// import { NetworkTablesContext } from "../components/NetworkTablesProvider.js";
// import type { NetworkTablesTypeInfo, NetworkTablesTypes } from "ntcore-ts-client";
// import { TopicOptions } from "../NetworkTablesReact.js";

// export type UseTopicOptions<T extends NetworkTablesTypes> = TopicOptions<T>

// export function useTopic<T extends NetworkTablesTypes>(
//     name: string,
//     typeInfo: NetworkTablesTypeInfo,
//     options?: UseTopicOptions<T>
// ): [T | null, (_: T) => void] {
//     const ntReact = useContext(NetworkTablesContext)

//     const topic = useMemo(
//         () => ntReact?.getTopic(name, typeInfo, options),
//         [ntReact, name, options, typeInfo]
//     )

//     const [value, updateValue] = useState<T | null>(options?.defaultValue ?? null)

//     useEffect(() => {
//         const uid = topic?.subscribe(updateValue)

//         return () => {
//             if (uid != null) topic?.unsubscribe(uid)
//         }
//     }, [topic, updateValue])

//     const setValue = (value: T) => {
//         topic?.setValue(value)
//     }

//     return [value, setValue]
// }