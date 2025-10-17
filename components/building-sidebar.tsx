"use client"

import { X, MapPin, Square, DollarSign, FileText, Phone, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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

interface BuildingSidebarProps {
  buildingInfo: BuildingInfo | null
  isLoading?: boolean
  error?: string | null
  onClose: () => void
}

export function BuildingSidebar({ buildingInfo, isLoading = false, error = null, onClose }: BuildingSidebarProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (error) {
    return (
      <aside className="fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Erro</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar sidebar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <Button onClick={onClose} className="mt-4">
              Fechar
            </Button>
          </div>
        </div>
      </aside>
    )
  }

  if (isLoading) {
    return (
      <aside className="fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Carregando...</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar sidebar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </aside>
    )
  }

  if (!buildingInfo) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % buildingInfo.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + buildingInfo.images.length) % buildingInfo.images.length)
  }

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
        {/* Image Gallery */}
        <div className="mb-4 relative">
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src={buildingInfo.images[currentImageIndex] || buildingInfo.image}
              alt={buildingInfo.name}
              className="w-full h-full object-cover"
            />
            {buildingInfo.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  {currentImageIndex + 1} / {buildingInfo.images.length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Building Name */}
        <h3 className="text-xl font-bold text-blue-900 mb-2">{buildingInfo.name}</h3>

        {/* ESIG Number */}
        <p className="text-sm text-gray-500 mb-2">ESIG: {buildingInfo.id}</p>

        {/* Address */}
        <p className="text-sm text-gray-600 mb-4">{buildingInfo.address}</p>

        {/* Status and Owner */}
        <div className="mb-4 space-y-2">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            buildingInfo.status === 'ativo'
              ? 'bg-green-100 text-green-800'
              : buildingInfo.status === 'alienado'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {buildingInfo.status === 'ativo' ? 'Ativo' :
             buildingInfo.status === 'alienado' ? 'Alienado' : 'Inativo'}
          </span>

          <div className="text-xs text-gray-600">
            <strong>Proprietário:</strong> {buildingInfo.proprietario}
          </div>
        </div>

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

        {/* Technical Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Características Técnicas</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de Edificação:</span>
              <span className="font-medium">{buildingInfo.edificacao_tipo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Topografia:</span>
              <span className="font-medium">{buildingInfo.topografia}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado de Conservação:</span>
              <span className="font-medium">{buildingInfo.conservacao_estado}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Regime Tributário:</span>
              <span className="font-medium">{buildingInfo.tributario_regime}</span>
            </div>
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

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Características</h4>
          <div className="flex flex-wrap gap-2">
            {buildingInfo.features.map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Data Source */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Fonte:</strong> Dados oficiais da Prefeitura do Recife via API de Dados Abertos
          </p>
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