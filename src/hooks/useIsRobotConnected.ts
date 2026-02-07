import { useContext, useEffect, useState } from "react";
import { NetworkTablesContext } from "../components/NetworkTablesProvider.js";

export function useIsRobotConnected(): boolean {
    const ntReact = useContext(NetworkTablesContext)
    const [isRobotConnectedState, setIsRobotConnectedState] = useState(false)

    useEffect(() => {
        const removeListener = ntReact?.ntClient?.client?.messenger?.socket?.addConnectionListener((status) => {
            setIsRobotConnectedState(status)
        })

        return () => removeListener && removeListener()
    }, [ntReact, setIsRobotConnectedState])

    return isRobotConnectedState
}