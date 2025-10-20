"use client"

import { useRef } from "react"
import { MapView } from "@/components/map-view"
import { MapSidebar } from "@/components/map-sidebar"
import { SearchBar } from "@/components/search-bar"
import { BuildingSidebar } from "@/components/building-sidebar"
import { useBuildingInfo } from "@/hooks/use-building-info"

export function MapLayout() {
  const mapRef = useRef<any>(null)
  const { buildingInfo, selectedFeatureId, isLoading, error, handleBuildingClick, closeBuildingInfo } = useBuildingInfo()

  const handleSelectLocation = (center: [number, number]) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center,
        zoom: 16,
        pitch: 60,
        bearing: -17.6,
      })
    }
  }

  const onBuildingClick = (event: any) => {
    handleBuildingClick(event, mapRef)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapSidebar />

      <div className={`absolute inset-0 ml-[60px] transition-all duration-300 ${buildingInfo || isLoading ? 'mr-[320px]' : ''}`}>
        <MapView
          selectedFeatureId={selectedFeatureId}
          buildingInfo={buildingInfo}
          onBuildingClick={onBuildingClick}
        />
      </div>

      <SearchBar onSelectLocation={handleSelectLocation} />

      <BuildingSidebar
        buildingInfo={buildingInfo}
        isLoading={isLoading}
        error={error}
        onClose={closeBuildingInfo}
      />
    </div>
  )
}