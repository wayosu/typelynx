import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react'

// Definisikan tipe untuk pengaturan game
export type GameSettings = 
  | { mode: 'words', wordCount: number }
  | { mode: 'time', duration: number }

// Hook ini akan menerima 'words' sebagai argumen
export const useTypingGame = (words: string[], gameSettings: GameSettings) => {
  // === SEMUA STATE KITA PINDAHKAN KE SINI ===
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState("")
  const [typedHistory, setTypedHistory] = useState<string[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [gameFinished, setGameFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [totalTypedEntries, setTotalTypedEntries] = useState(0)
  const [totalCorrectEntries, setTotalCorrectEntries] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  // === SEMUA REF JUGA PINDAH KE SINI ===
  const inputRef = useRef<HTMLInputElement>(null)
  const prevInput = useRef("")

  // === SEMUA EFEK JUGA PINDAH KE SINI ===

  // Efek untuk reset (saat 'words' berubah)
  useEffect(() => {
    setCurrentWordIndex(0)
    setCurrentInput("")
    setTypedHistory([])
    setGameStarted(false)
    setStartTime(0)
    setGameFinished(false)
    setWpm(0)
    setAccuracy(100)
    setTotalTypedEntries(0)
    setTotalCorrectEntries(0)
    prevInput.current = ""
    setElapsedTime(0)
    inputRef.current?.focus()
  }, [words])

  // Efek untuk kalkulasi WPM & Akurasi
  useEffect(() => {
    if (gameStarted && !gameFinished && startTime > 0) {
      const elapsedTimeInMinutes = (Date.now() - startTime) / 60000
      if (elapsedTimeInMinutes > 0) {
        const newWpm = (totalCorrectEntries / 5) / elapsedTimeInMinutes
        setWpm(newWpm)
      }
      if (totalTypedEntries > 0) {
        const newAccuracy = (totalCorrectEntries / totalTypedEntries) * 100
        setAccuracy(newAccuracy)
      }
    }
  }, [totalTypedEntries, totalCorrectEntries, gameStarted, gameFinished, startTime])

  // Efek untuk logika stats karakter (backspace)
  useEffect(() => {
    if (gameStarted) {
      const currentWord = words[currentWordIndex];
      if (currentInput.length > prevInput.current.length) {
        setTotalTypedEntries(prev => prev + 1);
        const typedCharIndex = currentInput.length - 1;
        const typedChar = currentInput[typedCharIndex];
        if (typedChar === currentWord[typedCharIndex]) {
          setTotalCorrectEntries(prev => prev + 1);
        }
      } else if (currentInput.length < prevInput.current.length) {
        setTotalTypedEntries(prev => prev + 1);
      }
      prevInput.current = currentInput;
    }
  }, [currentInput, gameStarted, words, currentWordIndex]);

  // Efek untuk Timer (Stopwatch)
    useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (gameStarted && !gameFinished) {
        intervalId = setInterval(() => {
        const newElapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(newElapsedTime); // Update stopwatch

        // === LOGIKA BARU UNTUK TIME MODE ===
        // Jika mode-nya 'time', cek apakah waktu sudah habis
        if (gameSettings.mode === 'time') {
            if (newElapsedTime >= gameSettings.duration) {
            setGameFinished(true); // Hentikan game
            setGameStarted(false); // Hentikan kalkulasi
            clearInterval(intervalId!); // Hentikan interval
            }
        }
        // === AKHIR LOGIKA BARU ===

        }, 1000);
    }
    return () => {
        if (intervalId) {
        clearInterval(intervalId);
        }
    };
    // 'deps' harus menyertakan gameSettings
    }, [gameStarted, gameFinished, startTime, gameSettings]);


  // === SEMUA HANDLER JUGA PINDAH KE SINI ===

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (gameFinished) return;
    const value = e.target.value;
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    if (value.includes(' ')) {
      return;
    }
    setCurrentInput(value);
  }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (gameFinished && e.key !== 'Tab') {
            e.preventDefault();
            return;
        }
        
        if (e.key === ' ') {
            e.preventDefault();
            if (currentInput.length === 0) return; 

            // === LOGIKA DIPERBAIKI ADA DI SINI ===

            const isLastWord = currentWordIndex === words.length - 1

            // 1. Update stats (selalu)
            setTotalTypedEntries(prev => prev + 1);
            if (currentInput === words[currentWordIndex]) {
                setTotalCorrectEntries(prev => prev + 1);
            }
            
            // 2. Simpan history (selalu)
            setTypedHistory(prev => [...prev, currentInput]);

            // 3. Cek kondisi game over
            //    (Jika ini kata terakhir, game selesai, tidak peduli mode apa.
            //     Timer akan menghentikan game jika waktu habis LEBIH DULU.)
            if (isLastWord) {
                setGameFinished(true);
                setGameStarted(false);
            } else {
                // 4. Jika game belum selesai, pindah ke kata berikutnya
                setCurrentWordIndex(prev => prev + 1);
            }
            
            // 5. Selalu kosongkan input setelah spasi
            setCurrentInput("");
        }
    }

  // === 'RETURN' SEMUA DATA YANG DIPERLUKAN OLEH 'WAJAH' (UI) ===
  return {
    // State
    currentWordIndex,
    currentInput,
    typedHistory,
    gameStarted,
    gameFinished,
    startTime,
    // Stats
    wpm,
    accuracy,
    elapsedTime,
    // Ref
    inputRef,
    // Handlers
    handleInputChange,
    handleKeyDown
  }
}