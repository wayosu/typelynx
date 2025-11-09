import { useState } from 'react'

const WORD_API_BASE_URL = 'https://random-word-api.herokuapp.com/word?number='

export const useWords = () => {
  const [words, setWords] = useState<string[]>([])
  const [loading, setLoading] = useState(false) // Default-nya false
  const [error, setError] = useState<string | null>(null)

  // Kita ubah 'fetchWords' agar menerima 'wordCount'
  const fetchWords = async (wordCount: number) => {
    try {
      setLoading(true) // Loading HANYA saat dipanggil
      setError(null)

      const response = await fetch(`${WORD_API_BASE_URL}${wordCount}`)
      if (!response.ok) {
        throw new Error('Maaf, API gagal merespon')
      }
      const data: string[] = await response.json()
      setWords(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Terjadi error yang tidak diketahui')
      }
    } finally {
      setLoading(false) // Selesai loading
    }
  }

  // Kita HAPUS 'useEffect' yang memanggil fetchWords secara otomatis.
  // Kita 'return' fetchWords agar App.tsx bisa memanggilnya.

  return { words, loading, error, fetchWords }
}