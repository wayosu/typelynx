// src/components/TypingTest.tsx

import { useTypingGame, GameSettings } from '../hooks/useTypingGame'
import { StatsDisplay } from './StatsDisplay'
import { useRef, useEffect } from 'react'

interface TypingTestProps {
  words: string[]
  onRestart: () => void
  gameSettings: GameSettings
}

export const TypingTest = ({ words, onRestart, gameSettings }: TypingTestProps) => {
  // === Panggil Hook "Otak" (Tidak berubah) ===
  const {
    currentWordIndex,
    currentInput,
    typedHistory,
    gameFinished,
    wpm,
    accuracy,
    elapsedTime,
    inputRef,
    handleInputChange,
    handleKeyDown,
  } = useTypingGame(words, gameSettings)

  // === REF BARU UNTUK AUTO-SCROLL ===
  // 1. Ref untuk 'div' yang membungkus semua kata (scrolling container)
  const wordContainerRef = useRef<HTMLDivElement>(null);
  // 2. Ref untuk menyimpan "KTP" (referensi DOM) dari SETIAP elemen span kata
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // === EFEK BARU UNTUK AUTO-SCROLL ===
  // Efek ini akan berjalan setiap kali 'currentWordIndex' (kata aktif) berubah
  useEffect(() => {
    const container = wordContainerRef.current;
    const activeWord = wordRefs.current[currentWordIndex];

    if (container && activeWord) {
      const containerRect = container.getBoundingClientRect();
      const wordRect = activeWord.getBoundingClientRect();
      
      // Calculate if the word is outside the visible area
      const isWordAbove = wordRect.top < containerRect.top;
      const isWordBelow = wordRect.bottom > containerRect.bottom;
      
      if (isWordAbove || isWordBelow) {
        const scrollToY = activeWord.offsetTop - container.clientHeight / 2 + activeWord.clientHeight / 2;
        
        container.scrollTo({
          top: Math.max(0, scrollToY),
          behavior: 'smooth'
        });
      }
    }
  }, [currentWordIndex]);

  // === FUNGSI HELPER UNTUK RENDER (Tidak berubah) ===
  const getLetterClassName = (word: string, letterIndex: number) => {
    const baseClass = "transition-colors duration-150";
    const typedLetter = currentInput[letterIndex];
    if (typedLetter === undefined) {
      return `${baseClass} text-gray-400`;
    }
    if (typedLetter === word[letterIndex]) {
      return `${baseClass} text-green-500`;
    }
    return `${baseClass} text-red-500`;
  }

  // === RENDER LOGIC ===
  return (
    <div className="relative w-3/4 max-w-4xl">
      
      {/* 1. KOTAK STATS (Tidak berubah) */}
      <StatsDisplay 
        wpm={wpm} 
        accuracy={accuracy} 
        elapsedTime={elapsedTime} 
        gameSettings={gameSettings}
      />
      
      {/* 2. KOTAK KATA (WORD BOX) */}
      <div 
        className="w-full rounded-lg bg-gray-800 p-4 shadow-xl"
        onClick={() => inputRef.current?.focus()}
      >
        {/* --- DIV INNER INI YANG KITA MODIFIKASI ---
           'ref' ditambahkan untuk kontrol scrolling
           'max-h-36' (9rem/144px) memberi tinggi max 3-4 baris
           'overflow-y-hidden' menyembunyikan scrollbar
        */}
        <div 
          ref={wordContainerRef} 
          className="relative flex flex-wrap gap-x-2 gap-y-3 text-2xl max-h-48 overflow-y-auto custom-scrollbar"
        >
          {words.map((word, wordIndex) => {
            
            // Kita tambahkan 'ref' ke SETIAP 'span' kata
            // agar 'useEffect' bisa menemukan posisi 'offsetTop'-nya
            
            if (wordIndex < currentWordIndex) {
              const typedWord = typedHistory[wordIndex]
              const isCorrect = typedWord === word
              return (
                <span 
                  key={wordIndex} 
                  ref={(el) => (wordRefs.current[wordIndex] = el)} // <-- REF
                  className={isCorrect ? "text-green-500" : "text-red-500"}
                >
                  {word}
                </span>
              )
            }
            if (wordIndex === currentWordIndex) {
              const letterElements = word.split('').map((letter, letterIndex) => (
                <span 
                  key={letterIndex} 
                  className={getLetterClassName(word, letterIndex)}
                >
                  {letter}
                </span>
              ));
              letterElements.splice(currentInput.length, 0, (
                <span key="caret" className="blinking-caret">|</span>
              ));
              return (
                <span 
                  key={wordIndex}
                  ref={(el) => (wordRefs.current[wordIndex] = el)} // <-- REF
                >
                  {letterElements}
                </span>
              )
            }
            return (
              <span 
                key={wordIndex} 
                ref={(el) => (wordRefs.current[wordIndex] = el)} // <-- REF
                className="text-gray-400"
              >
                {word}
              </span>
            )
          })}
        </div>
      </div>

      {/* 3. Input & Tombol Restart (Tidak berubah) */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="absolute left-0 top-0 h-0 w-0 p-0 m-0 border-0 opacity-0"
        autoFocus
        disabled={gameFinished}
      />
      
      {gameFinished && (
        <div className="mt-4 text-center">
          <p className="text-xl text-green-500 mb-2">Tes Selesai!</p>
          <button
            onClick={onRestart}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Mulai Lagi
          </button>
        </div>
      )}
    </div>
  )
}