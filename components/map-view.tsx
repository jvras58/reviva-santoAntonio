"use client"

import { useState } from "react"
import Map, { Source, Layer, Popup, NavigationControl } from "react-map-gl/mapbox"
import type { MapMouseEvent } from "react-map-gl/mapbox"
import { MapSidebar } from "@/components/map-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import { santoAntonioGeoJSON, maskGeoJSON } from "@/data/santo-antonio"

interface PopupInfo {
  longitude: number
  latitude: number
  properties: {
    EBAIRRNOME: string
    CBAIRRCODI: number
    area: number
  }
}

export function MapView() {
  const [searchValue, setSearchValue] = useState("")
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)

  const onClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0]
    if (feature && feature.properties) {
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        properties: {
          EBAIRRNOME: feature.properties.EBAIRRNOME,
          CBAIRRCODI: feature.properties.CBAIRRCODI,
          area: feature.properties["DB2GSE.ST_Area(SHAPE)"],
        },
      })
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MapSidebar />

      <div className="absolute inset-0 ml-[60px]">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: -34.88,
            latitude: -8.06,
            zoom: 14,
            pitch: 60,
            bearing: -17.6,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          interactiveLayerIds={["santo-antonio-outline"]}
          onClick={onClick}
          onMouseEnter={() => {
            document.body.style.cursor = "pointer"
          }}
          onMouseLeave={() => {
            document.body.style.cursor = ""
          }}
          minZoom={14}
          maxZoom={18}
          maxBounds={[[-34.885, -8.068], [-34.874, -8.059]]}
        >
          <NavigationControl position="top-right" />

          <Source id="mask" type="geojson" data={maskGeoJSON as any}>
            <Layer
              id="mask-fill"
              type="fill"
              paint={{
                "fill-color": "#ffffff",
              }}
            />
          </Source>

          <Source id="santo-antonio" type="geojson" data={santoAntonioGeoJSON as any}>
            <Layer
              id="santo-antonio-outline"
              type="line"
              paint={{
                "line-color": "#1E40AF",
                "line-width": 2,
              }}
            />
          </Source>

          <Layer
            id="3d-buildings"
            source="composite"
            source-layer="building"
            filter={["==", "extrude", "true"]}
            type="fill-extrusion"
            minzoom={15}
            paint={{
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
              "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
              "fill-extrusion-opacity": 0.6,
            }}
          />

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              anchor="bottom"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="p-3 font-sans">
                <h3 className="mb-2 text-base font-semibold text-blue-900">
                  {popupInfo.properties.EBAIRRNOME || "N/A"}
                </h3>
                <p className="my-1 text-sm text-gray-700">
                  <strong>Código:</strong> {popupInfo.properties.CBAIRRCODI || "N/A"}
                </p>
                <p className="my-1 text-sm text-gray-700">
                  <strong>Área:</strong> {popupInfo.properties.area?.toFixed(2) || "N/A"} m²
                </p>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Search bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Digite o endereço"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-white shadow-lg border-0 h-12 rounded-full"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="absolute bottom-6 right-6 z-10">
        <Button size="lg" className="shadow-lg rounded-full px-6 py-6 text-base">
          Entre em contato com um dos nossos agentes
        </Button>
      </div>
    </div>
  )
}
