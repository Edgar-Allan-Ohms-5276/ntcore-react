import React, { useEffect, useState, type PropsWithChildren } from "react"
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
    const [handler, setHandler] = useState<NetworkTablesHandler>(() => new NetworkTablesHandler(""))

    let uri = null

    if ('team' in props.config) {
        uri = getRobotAddress(props.config.team)
    } else {
        uri = props.config.uri
    }

    useEffect(() => {
        const newHandler = new NetworkTablesHandler(uri)
        newHandler.client.connect()
        setTimeout(() => setHandler(newHandler), 0)

        return () => newHandler.client.disconnect()
    }, [uri])


    return <NetworkTablesContext value={handler}>{props.children}</NetworkTablesContext>
}

function getRobotAddress(team: number): string {
    return `roborio-${team}-frc.local`;
}