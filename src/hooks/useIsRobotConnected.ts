import { useContext, useEffect, useState } from "react";
import { NetworkTablesContext } from "../components/NetworkTablesProvider.js";

export function useIsRobotConnected(): boolean {
    const ntClient = useContext(NetworkTablesContext)
    const [isRobotConnectedState, setIsRobotConnectedState] = useState(false)

    useEffect(() => {
        const removeListener = ntClient?.client?.messenger?.socket?.addConnectionListener((status) => {
            setIsRobotConnectedState(status)
        })

        return () => removeListener && removeListener()
    }, [ntClient, setIsRobotConnectedState])

    return isRobotConnectedState
}