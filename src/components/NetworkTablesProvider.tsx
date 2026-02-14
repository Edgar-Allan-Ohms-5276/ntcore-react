import React, { useEffect, useMemo, type PropsWithChildren } from "react"
import { NetworkTablesHandler } from "../NetworkTablesHandler"

export const NetworkTablesContext = React.createContext<NetworkTablesHandler>(new NetworkTablesHandler(""))

export type NetworkTablesProviderConfigByTeam = {
    team: number
}

export type NetworkTablesProviderConfigByUri = {
    uri: string
}

export type NetworkTablesProviderConfig = NetworkTablesProviderConfigByTeam | NetworkTablesProviderConfigByUri

type Props = {
    config: NetworkTablesProviderConfig
}

export function NetworkTablesProvider(props: PropsWithChildren<Props>) {
    let uri = null

    if ('team' in props.config) {
        uri = getRobotAddress(props.config.team)
    } else {
        uri = props.config.uri
    }

    const handler = useMemo(() => {
        console.log("making")
        return new NetworkTablesHandler(uri)
    }, [uri])

    useEffect(() => {
        if (handler != null) {
            console.log("connecting")
            handler.client.connect()
            return () => handler.client.disconnect()
        }
    }, [handler])


    return <NetworkTablesContext value={handler}>{props.children}</NetworkTablesContext>
}

function getRobotAddress(team: number): string {
    return `roborio-${team}-frc.local`;
}