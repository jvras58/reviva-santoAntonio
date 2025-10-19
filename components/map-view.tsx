"use client"

import { useRef } from "react"
import Map, { Source, Layer, NavigationControl } from "react-map-gl/mapbox"
import { santoAntonioGeoJSON, maskGeoJSON } from "@/data/santo-antonio"

interface MapViewProps {
  selectedFeatureId?: string | null
  buildingInfo?: any
  onBuildingClick?: (event: any) => void
}

export function MapView({ selectedFeatureId, buildingInfo, onBuildingClick }: MapViewProps) {
  const mapRef = useRef<any>(null)

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0">
        <Map
          ref={mapRef}
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
          interactiveLayerIds={["3d-buildings"]}
          onClick={onBuildingClick}
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

          {/* Selected building highlight */}
          {selectedFeatureId && buildingInfo && (
            <Source
              id="selection-marker"
              type="geojson"
              data={{
                type: "FeatureCollection",
                features: [{
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [buildingInfo.longitude, buildingInfo.latitude]
                  },
                  properties: {}
                }]
              }}
            >
              <Layer
                id="selection-marker-circle"
                type="circle"
                paint={{
                  "circle-radius": 12,
                  "circle-color": "#ff6b35",
                  "circle-stroke-width": 3,
                  "circle-stroke-color": "#ffffff",
                  "circle-opacity": 0.9
                }}
              />
              <Layer
                id="selection-marker-pulse"
                type="circle"
                paint={{
                  "circle-radius": 20,
                  "circle-color": "#ff6b35",
                  "circle-opacity": 0.3,
                  "circle-stroke-width": 0
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  )
}