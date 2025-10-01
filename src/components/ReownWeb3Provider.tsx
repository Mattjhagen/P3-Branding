import React from 'react'
import { ReownProvider } from '@/config/reown'

interface ReownWeb3ProviderProps {
  children: React.ReactNode
}

export const ReownWeb3Provider: React.FC<ReownWeb3ProviderProps> = ({ children }) => {
  return (
    <ReownProvider>
      {children}
    </ReownProvider>
  )
}

export default ReownWeb3Provider
