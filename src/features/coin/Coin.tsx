import React from 'react'
import type { RootState } from '../../app/store'
import { useSelector } from 'react-redux'

const Coin = () => {
    const coin = useSelector((state: RootState) => state.counter.value)
    const themeTextColor = useSelector((state: RootState) => state.theme.color)

    return (
        <div>
            <span style={{ color: themeTextColor }} >
                coins are: {coin}
            </span>
        </div>
    )
}
export default Coin;