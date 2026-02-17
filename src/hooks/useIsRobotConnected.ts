import { useContext, useEffect, useState } from "react";
import { NetworkTablesContext } from "../components/NetworkTablesProvider.js";

export function useIsRobotConnected(): boolean {
    const handler = useContext(NetworkTablesContext)
    const [isRobotConnectedState, setIsRobotConnectedState] = useState(false)

    useEffect(() => {
        if (handler != null) {
            const connectedCallback = () => setIsRobotConnectedState(true)
            const disconnectedCallback = () => setIsRobotConnectedState(false)

            handler.addListener("onConnect", connectedCallback)
            handler.addListener("onDisconnect", disconnectedCallback)

            return () => {
                handler.removeListener("onConnect", connectedCallback)
                handler.removeListener("onDisconnect", disconnectedCallback)
            }
        }

    }, [handler])

    return isRobotConnectedState
}