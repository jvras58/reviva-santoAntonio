"use client"

import { useState } from "react"

interface BuildingInfo {
  longitude: number
  latitude: number
  name: string
  area: string
  price: string
  description: string
  image: string
}

export function useBuildingInfo() {
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null)
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)

  const handleBuildingClick = (event: any, mapRef: any) => {
    const feature = event.features?.[0]
    if (feature && feature.layer.id === "3d-buildings") {
      console.log('🏢 Building clicked!')
      console.log('Feature:', feature)
      console.log('Feature properties:', feature.properties)
      console.log('Feature id:', feature.id)
      console.log('Coordinates:', event.lngLat)

      // Reset previous selection
      setSelectedFeatureId(null)
      setBuildingInfo(null)

      // Always use coordinate-based ID for reliable highlighting
      const coords = event.lngLat
      const uniqueId = `coord_${Math.round(coords.lng * 10000)}_${Math.round(coords.lat * 10000)}`

      console.log('Generated uniqueId:', uniqueId)

      // Mock data - em produção, buscar da API do governo
      const newBuildingInfo = {
        longitude: coords.lng,
        latitude: coords.lat,
        name: "Edifício Empresarial Centro",
        area: "500 m²",
        price: "R$ 2.500.000,00",
        description: "Espaço comercial disponível para locação ou venda. Ideal para escritórios ou lojas.",
        image: "https://via.placeholder.com/300x200?text=Edificio+Exemplo"
      }

      setBuildingInfo(newBuildingInfo)
      setSelectedFeatureId(uniqueId)

      console.log('Building info set:', newBuildingInfo)
      console.log('Selected feature ID set:', uniqueId)

      // Zoom in to the building
      if (mapRef.current) {
        console.log('Zooming to building...')
        mapRef.current.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 18, // Maximum zoom for close-up view
          pitch: 60,
          bearing: -17.6,
          duration: 1000
        })
      }
    }
  }

  const closeBuildingInfo = () => {
    setBuildingInfo(null)
    setSelectedFeatureId(null)
  }

  return { buildingInfo, selectedFeatureId, handleBuildingClick, closeBuildingInfo }
}