"use client"

import { X, MapPin, Square, DollarSign, FileText, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BuildingInfo {
  longitude: number
  latitude: number
  name: string
  area: string
  price: string
  description: string
  image: string
}

interface BuildingSidebarProps {
  buildingInfo: BuildingInfo | null
  onClose: () => void
}

export function BuildingSidebar({ buildingInfo, onClose }: BuildingSidebarProps) {
  if (!buildingInfo) return null

  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Informações do Imóvel</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fechar sidebar"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Image */}
        <div className="mb-4">
          <img
            src={buildingInfo.image}
            alt={buildingInfo.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Building Name */}
        <h3 className="text-xl font-bold text-blue-900 mb-4">{buildingInfo.name}</h3>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {buildingInfo.latitude.toFixed(6)}, {buildingInfo.longitude.toFixed(6)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Square className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">{buildingInfo.area}</span>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-semibold text-green-600">{buildingInfo.price}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Descrição</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{buildingInfo.description}</p>
        </div>

        {/* Features (placeholder for future) */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Características</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Comercial</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Centro</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Vista para o mar</span>
          </div>
        </div>
      </div>

      {/* Footer with CTA */}
      <div className="p-4 border-t bg-gray-50">
        <Button className="w-full flex items-center justify-center gap-2" size="lg">
          <Phone className="h-4 w-4" />
          Entrar em contato
        </Button>
      </div>
    </aside>
  )
}