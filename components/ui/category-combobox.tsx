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
import { getAllCategories, searchCategories, checkCategoryExists } from "@/lib/firebase/categories"
import { useDebouncedSearch } from "@/hooks/use-debounced-search"

interface CategoryComboboxProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function CategoryCombobox({ value = [], onChange, placeholder = "Select categories..." }: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [allCategories, setAllCategories] = React.useState<string[]>([])
  
  // Use debounced search for real-time Firebase queries
  const {
    searchTerm,
    setSearchTerm,
    results: searchResults,
    loading,
    error
  } = useDebouncedSearch(searchCategories, 300)

  // Load all categories on component mount
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getAllCategories()
        setAllCategories(categories)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }
    loadCategories()
  }, [])

  // Determine which categories to display
  const displayCategories = React.useMemo(() => {
    if (searchTerm && searchResults) {
      return searchResults
    }
    return allCategories
  }, [searchTerm, searchResults, allCategories])

  const handleSelect = (category: string) => {
    if (value.includes(category)) {
      onChange(value.filter((v) => v !== category))
    } else {
      onChange([...value, category])
    }
  }

  const handleRemove = (category: string) => {
    onChange(value.filter((v) => v !== category))
  }

  const handleAddNew = (newCategory: string) => {
    const normalizedCategory = newCategory.toLowerCase().trim()
    if (normalizedCategory && !value.includes(normalizedCategory)) {
      // Check if category already exists
      const exists = checkCategoryExists(normalizedCategory, allCategories)
      if (!exists) {
        console.log(`Adding new category: ${normalizedCategory}`)
      }
      
      onChange([...value, normalizedCategory])
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
            {value.length > 0 ? `${value.length} category(ies) selected` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Search categories..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {loading ? (
                <div className="p-2 text-sm text-muted-foreground">Searching categories...</div>
              ) : error ? (
                <div className="p-2 text-sm text-red-500">Error: {error}</div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="p-2">
                      <p className="text-sm text-muted-foreground mb-2">No category found.</p>
                      {searchTerm && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddNew(searchTerm)}
                          className="w-full"
                        >
                          Add "{searchTerm.toLowerCase()}" as new category
                        </Button>
                      )}
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {displayCategories.map((category) => (
                      <CommandItem
                        key={category}
                        value={category}
                        onSelect={() => handleSelect(category)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.includes(category) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category}
                      </CommandItem>
                    ))}
                    {searchTerm && !displayCategories.some(category => 
                      category.toLowerCase() === searchTerm.toLowerCase()
                    ) && (
                      <CommandItem
                        value={searchTerm}
                        onSelect={() => handleAddNew(searchTerm)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">+</span>
                          Add "{searchTerm.toLowerCase()}" as new category
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
      
      {/* Selected categories */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
              <button
                type="button"
                onClick={() => handleRemove(category)}
                className="ml-1 h-3 w-3 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {category}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
