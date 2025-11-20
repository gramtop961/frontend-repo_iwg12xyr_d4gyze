import { Stack } from 'expo-router'
import { useEffect } from 'react'
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}
