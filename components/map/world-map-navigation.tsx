"use client"

import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWindowSize } from "@/hooks/windowSize"

const geoUrl = "/countries-110m.json"

interface Country {
  code: string
  name: string
}

interface WorldMapNavigationProps {
  countries: Country[]
}

export function WorldMapNavigation({ countries }: WorldMapNavigationProps) {
  const [hoveredCountry, setHoveredCountry] = useState<{name: string} | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter()
  const windowSize = useWindowSize()
  
  // Mobile detection - considering screens smaller than 768px as mobile
  const isMobile = windowSize.width && windowSize.width < 768

  // Mapping between TopoJSON names and ISO country codes
  const countryNameToCodeMapping: { [key: string]: string } = {
    "United States of America": "US",
    "United Kingdom": "GB", 
    "Russia": "RU",
    "Czechia": "CZ", // TopoJSON has "Czechia", which is correct
    "South Korea": "KR", 
    "North Korea": "KP",
    "Bosnia and Herz.": "BA", 
    "Dominican Rep.": "DO",
    "Eq. Guinea": "GQ",
    "Central African Rep.": "CF",
    "S. Sudan": "SS",
    "Solomon Is.": "SB",
    "New Zealand": "NZ",
    "Papua New Guinea": "PG",
    "Puerto Rico": "PR",
    "Cape Verde": "CV",
    "South Africa": "ZA",
    "United Arab Emirates": "AE",
    "Saudi Arabia": "SA",
    // Additional special mappings
    "Congo": "CG",
    "Dem. Rep. Congo": "CD",
    "Côte d'Ivoire": "CI",
    "N. Cyprus": "CY", // Simplified to Cyprus
    "W. Sahara": "EH",
    "Falkland Is.": "FK",
    "New Caledonia": "NC",
    "Timor-Leste": "TL",
    "eSwatini": "SZ",
  }

  // Mapping for better country code recognition
  const getCountryData = (geoProperties: any) => {
    if (!geoProperties || !geoProperties.name) return null
    
    const geoName = geoProperties.name
    
    // First try direct name match
    let countryData = countries.find(country => 
      country.name.toLowerCase() === geoName.toLowerCase()
    )
    
    // If no direct match, try code mapping
    if (!countryData) {
      const mappedCode = countryNameToCodeMapping[geoName]
      if (mappedCode) {
        countryData = countries.find(country => country.code === mappedCode)
      }
    }
    
    return countryData
  }

  // Handle mouse move for tracking position
  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        onMouseMove={handleMouseMove}
        className="relative"
      >
        <ComposableMap
          projection="geoMercator"
          height={500}
          projectionConfig={{
            scale: 120,
            center: [0, 45]
          }}
        >
        <Geographies geography={geoUrl}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => {
              if (!geo?.properties) return null
              
              const countryData = getCountryData(geo.properties)
              const hasData = countryData != null
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    if (hasData && !isMobile) {
                      setHoveredCountry({
                        name: countryData.name
                      })
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHoveredCountry(null)
                    }
                  }}
                  onClick={() => {
                    if (hasData) {
                      if (isMobile) {
                        // On mobile, navigate directly to places page
                        router.push('/places')
                      } else {
                        // On desktop, navigate to specific country
                        router.push(`/places/${countryData.code}`)
                      }
                    }
                  }}
                  style={{
                    default: {
                      fill: hasData ? "#F97316" : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: hasData ? "#EA580C" : "#D1D5DB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: hasData ? "pointer" : "default",
                    },
                    pressed: {
                      fill: hasData ? "#C2410C" : "#D1D5DB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    }
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      
      {/* Tooltip that follows mouse cursor - only on desktop */}
      {hoveredCountry && !isMobile && (
        <div 
          className="fixed z-50 pointer-events-none bg-white border border-gray-200 rounded-lg shadow-lg p-3"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <p className="text-sm font-semibold text-gray-900">{hoveredCountry.name}</p>
          <p className="text-xs text-gray-600">
            Street art available
          </p>
        </div>
      )}
      </div>
    </div>
  )
}
