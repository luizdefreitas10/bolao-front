'use client'

import { useAuthContext } from '@/context/AuthContext'
import React, { useMemo } from 'react'
import Countdown, { CountdownRenderProps, zeroPad } from 'react-countdown'

export default function CountdownComponent() {
  const { handleResendCodeAvailable } = useAuthContext()
  const time = useMemo(() => {
    return Date.now() + 60000
  }, [])
  const renderer = ({ minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      handleResendCodeAvailable(true)
    } else {
      return (
        <span>
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )
    }
  }
  return <Countdown date={time} renderer={renderer} />
}
