export function CoolLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
        
        {/* Middle rotating ring - opposite direction */}
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-purple-500 border-l-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
