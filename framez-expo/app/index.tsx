import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import { Tabs } from 'expo-router'
import AuthGate from '../components/AuthGate'

export default function Home() {
  return (
    <AuthGate>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
        <Tabs.Screen name="create" options={{ title: 'Create' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </AuthGate>
  )
}
