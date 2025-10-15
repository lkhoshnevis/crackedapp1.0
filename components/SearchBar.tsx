'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { LiquidGlassInput } from '@/components/ui/liquid-glass-button'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search alumni by name, company, school, or role...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-20" />
        <LiquidGlassInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  )
}

