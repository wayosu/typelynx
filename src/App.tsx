import { useState, useEffect } from 'react'
import { useWords } from './hooks/useWords'
import { TypingTest } from './components/TypingTest'
import { GameSettings } from './hooks/useTypingGame'
import { GameModeSelector } from './components/GameModeSelector' // <-- Impor komponen baru

function App() {
  const { words, loading, error, fetchWords } = useWords()

  // 1. Hapus 'ACTIVE_GAME_SETTINGS'. Ganti dengan 'state'
  //    'null' berarti "mode belum dipilih"
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null)
  
  // State 'wordsReady' masih kita perlukan
  const [wordsReady, setWordsReady] = useState(false)

  // 2. 'useEffect' ini sekarang akan "mendengarkan" perubahan 'gameSettings'
  useEffect(() => {
    // JANGAN lakukan apa-apa jika 'gameSettings' masih 'null'
    if (gameSettings) {
      setWordsReady(false) // Mulai proses loading
      
      let wordCountToFetch = 0
      if (gameSettings.mode === 'words') {
        wordCountToFetch = gameSettings.wordCount
      } else if (gameSettings.mode === 'time') {
        // Untuk mode waktu, kita tetap ambil 200 kata
        // (Nanti bisa di-improve agar 'infinite')
        wordCountToFetch = 200
      }
      
      // Panggil fetchWords. 'then()' akan berjalan setelah fetch selesai
      fetchWords(wordCountToFetch).then(() => {
        setWordsReady(true) // Tandai kata-kata siap
      })
    }
  }, [gameSettings]) // <-- 'Dependency' kuncinya di sini!

  // 3. Buat fungsi 'handleModeSelect' untuk diberikan ke 'GameModeSelector'
  const handleModeSelect = (settings: GameSettings) => {
    setGameSettings(settings) // Set 'state' gameSettings
    // 'useEffect' di atas akan otomatis terpicu
  }

  // 4. 'handleRestart' sekarang JAUH lebih simpel
  const handleRestart = () => {
    setGameSettings(null) // Cukup set 'gameSettings' ke 'null'
    setWordsReady(false)  // Ini akan membawa kita kembali ke 'GameModeSelector'
  }

  // 5. 'renderContent' menjadi "Router" utama aplikasi kita
  const renderContent = () => {
    
    // === KONDISI 1: Mode belum dipilih ===
    // Jika gameSettings 'null', tampilkan pemilih mode
    if (!gameSettings) {
      return <GameModeSelector onModeSelect={handleModeSelect} />
    }

    // === KONDISI 2: Mode sudah dipilih, tapi kata-kata belum siap ===
    // (Bisa karena 'loading' dari useWords, atau 'wordsReady' false)
    if (loading || !wordsReady) {
      return (
        <div className="text-center text-xl text-green-500">
          Memuat kata-kata...
        </div>
      )
    }

    // === KONDISI 3: Ada error ===
    if (error) {
      return (
        <div className="text-center text-xl text-red-500">
          Error: {error}
          <button 
            onClick={handleRestart} // 'handleRestart' akan kembali ke pemilih mode
            className="ml-4 rounded bg-gray-600 px-2 py-1 text-white hover:bg-gray-500"
          >
            Coba Lagi
          </button>
        </div>
      )
    }

    // === KONDISI 4: Sukses! Mode dipilih & kata-kata siap ===
    // Tampilkan game-nya
    return (
      <TypingTest 
        words={words} 
        onRestart={handleRestart}
        gameSettings={gameSettings} // Berikan 'gameSettings' dari 'state'
      />
    )
  }

  return (
    // 'Container' utama tidak berubah
    <div className="flex h-screen items-center justify-center bg-gray-900">
      {renderContent()}
    </div>
  )
}

export default App