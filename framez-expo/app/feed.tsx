import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { supabase } from '../lib/supabase'
import PostItem from '../components/PostItem'

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('id, content, image_url, created_at, user_id, profiles!inner(full_name, avatar_url)')
      .order('created_at', { ascending: false })

    if (!error) setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) return (
    <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlashList
        data={posts}
        estimatedItemSize={120}
        renderItem={({ item }) => (
          <PostItem post={item} />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
