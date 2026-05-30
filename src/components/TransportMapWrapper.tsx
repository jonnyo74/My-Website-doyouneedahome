'use client'
import dynamic from 'next/dynamic'

const TransportMap = dynamic(() => import('./TransportMap'), { ssr: false })

export default function TransportMapWrapper(props: { lat: number; lng: number; cityName: string }) {
  return <TransportMap {...props} />
}
