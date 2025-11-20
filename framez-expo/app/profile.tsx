import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Image, Button, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'
import PostItem from '../components/PostItem'
import { FlashList } from '@shopify/flash-list'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data } = await supabase
        .from('posts')
        .select('id, content, image_url, created_at, user_id, profiles!inner(full_name, avatar_url)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      setPosts(data || [])
    })()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={{ uri: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.avatar} />
        <Text style={styles.name}>{user?.user_metadata?.full_name || user?.email}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Button title="Log out" onPress={signOut} />
      </View>
      <FlashList
        data={posts}
        estimatedItemSize={120}
        renderItem={({ item }) => <PostItem post={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: 8, padding: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  name: { fontSize: 18, fontWeight: '600' },
  email: { color: '#666' }
})
