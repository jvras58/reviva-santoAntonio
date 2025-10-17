"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Suggestion {
  place_name: string
  center: [number, number]
}

interface SearchBarProps {
  onSelectLocation: (center: [number, number]) => void
}

export function SearchBar({ onSelectLocation }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const selectSuggestion = (suggestion: Suggestion) => {
    setSearchValue(suggestion.place_name)
    setShowSuggestions(false)
    onSelectLocation(suggestion.center)
  }

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (searchValue.length > 2) {
      debounceRef.current = setTimeout(async () => {
        const bbox = "-35,-8.2,-34.7,-7.9"
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchValue)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&bbox=${bbox}&limit=5`
        )
        const data = await response.json()
        setSuggestions(data.features || [])
        setShowSuggestions(true)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchValue])

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Digite o endereço"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 bg-white shadow-lg border-0 h-12 rounded-full"
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}