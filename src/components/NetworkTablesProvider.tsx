import { NetworkTables } from "ntcore-ts-client"
import React, { type PropsWithChildren } from "react"

export const NetworkTablesContext = React.createContext<NetworkTables | null>(null)

export type NetworkTablesProviderConfigByTeam = {
    team: number,
    port?: number
}

export type NetworkTablesProviderConfigByUri = {
    uri: string,
    port?: number
}

export type NetworkTablesProviderConfig = NetworkTablesProviderConfigByTeam | NetworkTablesProviderConfigByUri

type Props = {
    config: NetworkTablesProviderConfig
}

export default function NetworkTablesProvider(props: PropsWithChildren<Props>) {
    let ntContext = null

    if ('team' in props.config) {
        ntContext = NetworkTables.getInstanceByTeam(props.config.team, props.config.port)
    }
    if ('uri' in props.config) {
        ntContext = NetworkTables.getInstanceByURI(props.config.uri, props.config.port)
    }


    return <NetworkTablesContext value={ntContext}>{props.children}</NetworkTablesContext>
}