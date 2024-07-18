"use client"
import {
    useContext,
    createContext,
    useEffect,
    useCallback,
    useState,
    useMemo,
} from "react"
import { UtilContextType, EthPriceType } from "@/types"
import { Authorization } from "@/authorization"

const UtilContext = createContext<UtilContextType | null>(null)
export const UtilContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


    const [accessToken, setAccessToken] = useState<string>()
    const [ethPrice, setEthPrice] = useState<EthPriceType>()
    const init = async () => {
        const result = await Authorization()
        const _accessToken = result.data.access_token
        setAccessToken(_accessToken)
    }

    const value = useMemo(() => ({
        accessToken: accessToken,
        ethPrice: ethPrice,
        setEthPrice: setEthPrice,
    }), [accessToken, ethPrice, setEthPrice])

    useEffect(() => {
        init();
    }, []);

    return (
        <UtilContext.Provider value={value}>
            {children}
        </UtilContext.Provider>
    )
}

export default UtilContext