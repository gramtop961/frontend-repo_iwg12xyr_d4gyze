import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { supabase } from '../lib/supabase'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [sessionLoading, setSessionLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setSessionLoading(false)
    })()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const submit = async () => {
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        Alert.alert('Check your inbox', 'Confirm your email to complete sign up.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (e: any) {
      Alert.alert('Auth error', e.message)
    }
  }

  if (sessionLoading) return <View style={styles.center}><Text>Loading...</Text></View>
  if (session) return <>{children}</>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Framez</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize='none' />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title={mode === 'login' ? 'Log in' : 'Sign up'} onPress={submit} />
      <Text style={styles.switch} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? "Don't have an account? Sign up" : 'Have an account? Log in'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 },
  switch: { textAlign: 'center', color: '#2563eb', marginTop: 8 }
})
