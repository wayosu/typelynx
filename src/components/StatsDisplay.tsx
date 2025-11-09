// src/components/StatsDisplay.tsx
import { GameSettings } from '../hooks/useTypingGame' // <-- Impor tipe

interface StatsDisplayProps {
  wpm: number
  accuracy: number
  elapsedTime: number
  gameSettings: GameSettings // <-- Terima gameSettings
}

export const StatsDisplay = ({ wpm, accuracy, elapsedTime, gameSettings }: StatsDisplayProps) => {
  
  // Fungsi helper untuk render waktu
  const renderTime = () => {
    if (gameSettings.mode === 'time') {
      // Mode Waktu: Tampilkan sisa waktu (countdown)
      const remainingTime = gameSettings.duration - elapsedTime;
      return <div className="text-green-500">{remainingTime}s</div>
    } else {
      // Mode Kata: Tampilkan waktu berlalu (stopwatch)
      return <div className="text-green-500">{elapsedTime}s</div>
    }
  }

  return (
    <div className="mb-4 flex justify-around rounded-lg bg-gray-700 p-4 text-2xl text-white">
      <div className="text-center">
        <span className="text-gray-400">WPM</span>
        <div className="text-green-500">{Math.round(wpm)}</div>
      </div>

      <div className="text-center">
        <span className="text-gray-400">Waktu</span>
        {renderTime()} {/* Panggil fungsi helper */}
      </div>

      <div className="text-center">
        <span className="text-gray-400">Akurasi</span>
        <div className="text-green-500">{Math.round(accuracy)}%</div>
      </div>
    </div>
  )
}