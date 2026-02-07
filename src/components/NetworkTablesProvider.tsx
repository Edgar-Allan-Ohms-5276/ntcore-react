import { NetworkTables } from "ntcore-ts-client"
import React, { type PropsWithChildren } from "react"
import { NetworkTablesReact } from "../NetworkTablesReact"

export const NetworkTablesContext = React.createContext<NetworkTablesReact | null>(null)

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

export function NetworkTablesProvider(props: PropsWithChildren<Props>) {
    let ntClient = null

    if ('team' in props.config) {
        ntClient = NetworkTables.getInstanceByTeam(props.config.team, props.config.port)
    }
    if ('uri' in props.config) {
        ntClient = NetworkTables.getInstanceByURI(props.config.uri, props.config.port)
    }


    return <NetworkTablesContext value={ntClient && new NetworkTablesReact(ntClient)}>{props.children}</NetworkTablesContext>
}