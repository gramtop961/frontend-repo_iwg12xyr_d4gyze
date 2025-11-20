import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import dayjs from 'dayjs'

type Post = {
  id: string
  content: string
  image_url?: string | null
  created_at: string
  user_id: string
  profiles?: { full_name?: string | null, avatar_url?: string | null }
}

export default function PostItem({ post }: { post: Post }) {
  const name = post.profiles?.full_name || 'Anonymous'
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: post.profiles?.avatar_url || 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <View>
          <Text style={styles.author}>{name}</Text>
          <Text style={styles.time}>{dayjs(post.created_at).fromNow?.() || dayjs(post.created_at).format('MMM D, HH:mm')}</Text>
        </View>
      </View>
      {post.content ? <Text style={styles.content}>{post.content}</Text> : null}
      {post.image_url ? <Image source={{ uri: post.image_url }} style={styles.image} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  author: { fontWeight: '600' },
  time: { color: '#666', fontSize: 12 },
  content: { marginTop: 8, marginBottom: 8 },
  image: { width: '100%', height: 240, borderRadius: 8, backgroundColor: '#eee' }
})
