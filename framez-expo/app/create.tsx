import React, { useState } from 'react'
import { View, TextInput, Button, Image, SafeAreaView, StyleSheet, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../lib/supabase'

export default function Create() {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need gallery permission to pick images.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri)
    const blob = await response.blob()
    const fileName = `${Date.now()}.jpg`
    const { data, error } = await supabase.storage.from('post-images').upload(fileName, blob, {
      contentType: 'image/jpeg'
    })
    if (error) throw error
    const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(fileName)
    return urlData.publicUrl
  }

  const createPost = async () => {
    setLoading(true)
    try {
      let imageUrl: string | null = null
      if (image) imageUrl = await uploadImage(image)

      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('posts').insert({
        user_id: user?.id,
        content,
        image_url: imageUrl
      })
      if (error) throw error
      setContent('')
      setImage(null)
      Alert.alert('Success', 'Post created!')
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        style={styles.input}
        multiline
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.row}>
        <Button title="Pick Image" onPress={pickImage} />
        <Button title={loading ? 'Posting...' : 'Post'} onPress={createPost} disabled={loading || (!content && !image)} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, minHeight: 100 },
  image: { width: '100%', height: 220, borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }
})
