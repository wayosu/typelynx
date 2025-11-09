// src/components/GameModeSelector.tsx

import { GameSettings } from '../hooks/useTypingGame'

// Tentukan 'props' yang diterima: sebuah fungsi callback
interface GameModeSelectorProps {
  onModeSelect: (settings: GameSettings) => void
}

// Opsi yang tersedia
const timeOptions = [15, 30, 60, 120]
const wordOptions = [10, 25, 50, 100]

export const GameModeSelector = ({ onModeSelect }: GameModeSelectorProps) => {
  
  // Style standar untuk tombol
  const buttonClass = 
    "rounded-lg bg-gray-700 px-4 py-2 text-xl text-gray-400 " + 
    "transition-colors duration-150 hover:bg-green-500 hover:text-gray-900 " +
    "focus:outline-none focus:ring-2 focus:ring-green-400"

  return (
    <div className="flex w-3/4 max-w-4xl flex-col gap-8 text-center">
      
      {/* --- Bagian Mode Waktu --- */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-green-500">Mode Waktu (Detik)</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {timeOptions.map((duration) => (
            <button
              key={duration}
              className={buttonClass}
              onClick={() => onModeSelect({ mode: 'time', duration })}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>

      {/* --- Bagian Mode Kata --- */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-green-500">Mode Kata</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {wordOptions.map((wordCount) => (
            <button
              key={wordCount}
              className={buttonClass}
              onClick={() => onModeSelect({ mode: 'words', wordCount })}
            >
              {wordCount}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}