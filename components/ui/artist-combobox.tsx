"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getArtists, searchArtists, checkArtistExists } from "@/lib/firebase/artists"
import type { Artist } from "@/lib/models/Artists"
import { useDebouncedSearch } from "@/hooks/use-debounced-search"

interface ArtistComboboxProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function ArtistCombobox({ value = [], onChange, placeholder = "Select artists..." }: ArtistComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [initialArtists, setInitialArtists] = React.useState<(Artist & { id: string })[]>([])
  
  // Use debounced search for real-time Firebase queries
  const {
    searchTerm,
    setSearchTerm,
    results: searchResults,
    loading,
    error
  } = useDebouncedSearch(searchArtists, 300)

  // Load initial artists on component mount
  React.useEffect(() => {
    const loadArtists = async () => {
      try {
        const data = await getArtists()
        if (data?.docs) {
          setInitialArtists(data.docs as (Artist & { id: string })[])
        }
      } catch (error) {
        console.error("Failed to load initial artists:", error)
      }
    }
    loadArtists()
  }, [])

  // Determine which artists to display
  const displayArtists = React.useMemo(() => {
    if (searchTerm && searchResults) {
      return searchResults
    }
    return initialArtists
  }, [searchTerm, searchResults, initialArtists])

  const handleSelect = (artistName: string) => {
    if (value.includes(artistName)) {
      onChange(value.filter((v) => v !== artistName))
    } else {
      onChange([...value, artistName])
    }
  }

  const handleRemove = (artistName: string) => {
    onChange(value.filter((v) => v !== artistName))
  }

  const handleAddNew = async (newArtistName: string) => {
    if (newArtistName && !value.includes(newArtistName)) {
      // Check if artist already exists in database
      const exists = await checkArtistExists(newArtistName)
      if (!exists) {
        // This is a new artist
        console.log(`Adding new artist: ${newArtistName}`)
      }
      
      onChange([...value, newArtistName])
      setOpen(false)
      setSearchTerm("")
    }
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0 ? `${value.length} artist(s) selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Search artists..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {loading ? (
                <div className="p-2 text-sm text-muted-foreground">Searching artists...</div>
              ) : error ? (
                <div className="p-2 text-sm text-red-500">Error: {error}</div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="p-2">
                      <p className="text-sm text-muted-foreground mb-2">No artist found.</p>
                      {searchTerm && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddNew(searchTerm)}
                          className="w-full"
                        >
                          Add &quot;{searchTerm}&quot; as new artist
                        </Button>
                      )}
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {displayArtists.map((artist) => (
                      <CommandItem
                        key={artist.id}
                        value={artist.name}
                        onSelect={() => handleSelect(artist.name)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.includes(artist.name) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {artist.name}
                      </CommandItem>
                    ))}
                    {searchTerm && !displayArtists.some(artist => 
                      artist.name.toLowerCase() === searchTerm.toLowerCase()
                    ) && (
                      <CommandItem
                        value={searchTerm}
                        onSelect={() => handleAddNew(searchTerm)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">+</span>
                          Add &quot;{searchTerm}&quot; as new artist
                        </div>
                      </CommandItem>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Selected artists */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((artistName) => (
            <Badge key={artistName} variant="secondary" className="text-xs">
              {artistName}
              <button
                type="button"
                onClick={() => handleRemove(artistName)}
                className="ml-1 h-3 w-3 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {artistName}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
