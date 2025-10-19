"use client"

import { useState, useCallback } from "react"

interface BuildingInfo {
  id: string
  longitude: number
  latitude: number
  name: string
  area: string
  price: string
  description: string
  image: string
  images: string[]
  features: string[]
  address: string
  type: string
  status: string
  proprietario: string
  topografia: string
  edificacao_tipo: string
  conservacao_estado: string
  tributario_regime: string
}

interface UseBuildingInfoReturn {
  buildingInfo: BuildingInfo | null
  selectedFeatureId: string | null
  isLoading: boolean
  error: string | null
  handleBuildingClick: (event: any, mapRef: any) => Promise<void>
  closeBuildingInfo: () => void
  searchBuildings: (query: string) => Promise<any[]>
}

export function useBuildingInfo(): UseBuildingInfoReturn {
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null)
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBuildingClick = useCallback(async (event: any, mapRef: any) => {
    const feature = event.features?.[0]
    if (!feature || feature.layer.id !== "3d-buildings") return

    try {
      setIsLoading(true)
      setError(null)

      setSelectedFeatureId(null)
      setBuildingInfo(null)

      const coords = event.lngLat

      const buildingData: BuildingInfo = {
        id: `coord_${Math.round(coords.lng * 10000)}_${Math.round(coords.lat * 10000)}`,
        longitude: coords.lng,
        latitude: coords.lat,
        name: "Edifício Empresarial Centro",
        area: "500 m²",
        price: "R$ 2.500.000,00",
        description: "Espaço comercial disponível para locação ou venda. Ideal para escritórios ou lojas. Dados obtidos de fontes públicas do município.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
        ],
        features: ["Comercial", "Centro", "Vista para o mar"],
        address: "Centro Histórico - Recife/PE",
        type: "comercial",
        status: "ativo",
        proprietario: "Prefeitura do Recife",
        topografia: "Plana",
        edificacao_tipo: "Comercial",
        conservacao_estado: "Bom",
        tributario_regime: "ITBI"
      }

      setBuildingInfo(buildingData)
      setSelectedFeatureId(buildingData.id)

      console.log('Building data loaded:', buildingData)

      if (mapRef.current) {
        console.log('Zooming to building...')
        mapRef.current.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 18,
          pitch: 60,
          bearing: -17.6,
          duration: 1000
        })
      }

    } catch (err) {
      console.error('Error loading building data:', err)
      setError('Erro ao carregar dados do imóvel')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const closeBuildingInfo = useCallback(() => {
    setBuildingInfo(null)
    setSelectedFeatureId(null)
    setError(null)
  }, [])

  const searchBuildings = useCallback(async (query: string): Promise<any[]> => {
    // Return empty array for mock data
    return []
  }, [])

  return {
    buildingInfo,
    selectedFeatureId,
    isLoading,
    error,
    handleBuildingClick,
    closeBuildingInfo,
    searchBuildings
  }
}