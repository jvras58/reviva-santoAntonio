// API service for Recife government data and real estate information
export interface BuildingData {
  id: string // esig_num
  name: string
  address: string
  area: number
  price?: number
  description: string
  coordinates: [number, number] // lat, lng from georreferencing
  type: 'residencial' | 'comercial' | 'industrial' | 'publico'
  status: 'ativo' | 'inativo' | 'alienado'
  proprietario: string
  topografia: string
  edificacao_tipo: string
  conservacao_estado: string
  tributario_regime: string
  images: string[]
  features: string[]
}

// CSV Dataset from Recife City Hall
// URL: http://dados.recife.pe.gov.br/dataset/c97d4314-e756-464a-ad86-38759d4c75b5/resource/8a85caee-af0f-4931-8ae0-ea1fa918696b/download/proprios.csv
export class RecifeRealEstateAPI {
  private static csvUrl = 'http://dados.recife.pe.gov.br/dataset/c97d4314-e756-464a-ad86-38759d4c75b5/resource/8a85caee-af0f-4931-8ae0-ea1fa918696b/download/proprios.csv'
  private static cachedData: BuildingData[] | null = null

  // Load CSV data (cached to avoid multiple downloads)
  private static async loadCSVData(): Promise<BuildingData[]> {
    if (this.cachedData) {
      return this.cachedData
    }

    try {
      console.log('📥 Baixando dados CSV da Prefeitura do Recife...')
      const response = await fetch(this.csvUrl)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const csvText = await response.text()
      const lines = csvText.split('\n').filter(line => line.trim())

      if (lines.length < 2) {
        throw new Error('CSV vazio ou mal formatado')
      }

      // Parse CSV (semicolon separated, but handle quoted fields properly)
      const headers = lines[0].split(';').map(h => h.replace(/"/g, '').trim().toLowerCase())
      const rows = lines.slice(1)

      console.log('Headers encontrados:', headers.slice(0, 10), '...')

      const buildings: BuildingData[] = []

      for (const row of rows) {
        if (!row.trim()) continue

        // Simple CSV parser that handles quoted fields
        const values = this.parseCSVRow(row)
        if (values.length !== headers.length) continue

        const data: any = {}
        headers.forEach((header, index) => {
          data[header] = values[index]?.replace(/"/g, '').trim() || ''
        })

        // Only process buildings with coordinates
        if (!data.latitude || !data.longitude || data.latitude === '0' || data.longitude === '0' || data.latitude === '' || data.longitude === '') {
          continue
        }

        // Map CSV fields to our interface using correct field names
        const building: BuildingData = {
          id: data.inscricaoImobiliaria || data.sequencialImovel || `recife_${buildings.length}`,
          name: this.generateBuildingName(data),
          address: this.generateAddress(data),
          area: parseFloat(data.areaTotalConstruidaSimples || data.areaTotalConstruidaMultipla || data.areaLote || '0') || 0,
          price: data.valorVenal ? parseFloat(data.valorVenal) : undefined,
          description: this.generateDescription(data),
          coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)], // Note: CSV has lat,lng but we store as [lng,lat]
          type: this.mapBuildingType(data.tipoEmpreendimentoSimples || data.tipoEmpreendimentoMultipla),
          status: this.mapBuildingStatus(data.situacao),
          proprietario: data.proprietarioPrincipal || 'Prefeitura do Recife',
          topografia: data.topografiaLote || 'Não informado',
          edificacao_tipo: data.tipoEmpreendimentoSimples || data.tipoEmpreendimentoMultipla || 'Não informado',
          conservacao_estado: data.estadoConservacaoSimples || 'Não informado',
          tributario_regime: data.regimeTributacaoIPTU || 'Não informado',
          images: this.generateImages(data),
          features: this.generateFeatures(data)
        }

        buildings.push(building)
      }

      console.log(`✅ Carregados ${buildings.length} imóveis da Prefeitura do Recife`)

      // Debug: show sample of parsed buildings
      if (buildings.length > 0) {
        console.log('📋 Amostra de imóveis parseados:')
        buildings.slice(0, 3).forEach((b, i) => {
          console.log(`  ${i+1}. ID: ${b.id}, Nome: ${b.name}, Coords: [${b.coordinates[0]}, ${b.coordinates[1]}], Área: ${b.area}m²`)
        })
      }

      this.cachedData = buildings
      return buildings

    } catch (error) {
      console.error('❌ Erro ao carregar dados CSV:', error)
      return []
    }
  }

  // Simple CSV row parser that handles quoted fields
  private static parseCSVRow(row: string): string[] {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ';' && !inQuotes) {
        values.push(current)
        current = ''
      } else {
        current += char
      }
    }

    values.push(current) // Add the last value
    return values
  }

  // Generate building name from available data
  private static generateBuildingName(data: any): string {
    if (data.nomeEdificacaoMultipla) return data.nomeEdificacaoMultipla
    if (data.tipoEmpreendimentoSimples) return `${data.tipoEmpreendimentoSimples} - ${data.enderecoImovelNomeLogradouro || 'Centro'}`
    if (data.enderecoImovelNomeLogradouro) return `Imóvel em ${data.enderecoImovelNomeLogradouro}`
    return `Imóvel ${data.sequencialImovel || 'Municipal'}`
  }

  // Generate address from available data
  private static generateAddress(data: any): string {
    const parts = []

    if (data.enderecoImovelNomeLogradouro) parts.push(data.enderecoImovelNomeLogradouro)
    if (data.enderecoImovelNumero) parts.push(data.enderecoImovelNumero)
    if (data.enderecoImovelBairro) parts.push(data.enderecoImovelBairro)
    if (data.enderecoImovelMunicipio) parts.push(data.enderecoImovelMunicipio)
    if (data.enderecoImovelEstado) parts.push(data.enderecoImovelEstado)

    return parts.join(', ') || 'Endereço não informado'
  }

  // Generate description from available data
  private static generateDescription(data: any): string {
    const parts = []

    if (data.nomeEdificacaoMultipla) parts.push(`Nome: ${data.nomeEdificacaoMultipla}`)
    if (data.enderecoImovelNomeLogradouro) parts.push(`Localizado em: ${data.enderecoImovelNomeLogradouro}`)
    if (data.areaTotalConstruidaSimples || data.areaTotalConstruidaMultipla) {
      const area = data.areaTotalConstruidaSimples || data.areaTotalConstruidaMultipla
      parts.push(`Área construída: ${area} m²`)
    }
    if (data.tipoEmpreendimentoSimples || data.tipoEmpreendimentoMultipla) {
      const tipo = data.tipoEmpreendimentoSimples || data.tipoEmpreendimentoMultipla
      parts.push(`Tipo: ${tipo}`)
    }
    if (data.estadoConservacaoSimples) parts.push(`Estado de conservação: ${data.estadoConservacaoSimples}`)
    if (data.regimeTributacaoIPTU) parts.push(`Regime tributário: ${data.regimeTributacaoIPTU}`)

    parts.push('Dados oficiais da Prefeitura do Recife.')

    return parts.join('. ')
  }

  // Map building type from CSV data
  private static mapBuildingType(csvType: string): BuildingData['type'] {
    const type = csvType?.toLowerCase() || ''
    if (type.includes('casa') || type.includes('residencial') || type.includes('apartamento')) return 'residencial'
    if (type.includes('comercial') || type.includes('loja') || type.includes('escritorio') || type.includes('edificacao')) return 'comercial'
    if (type.includes('industrial') || type.includes('galpao') || type.includes('fabrica')) return 'industrial'
    return 'publico'
  }

  // Map building status from CSV data
  private static mapBuildingStatus(csvStatus: string): BuildingData['status'] {
    const status = csvStatus?.toLowerCase() || ''
    if (status.includes('ativo')) return 'ativo'
    if (status.includes('alienado') || status.includes('vendido')) return 'alienado'
    return 'inativo'
  }

  // Generate placeholder images (could be enhanced with real photos later)
  private static generateImages(data: any): string[] {
    const images = []

    // Use building type to select appropriate placeholder
    const type = this.mapBuildingType(data.tipo_edificacao)
    let imageUrl = ''

    switch (type) {
      case 'residencial':
        imageUrl = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
        break
      case 'comercial':
        imageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
        break
      case 'industrial':
        imageUrl = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'
        break
      default:
        imageUrl = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
    }

    images.push(imageUrl)

    // Add variation for gallery
    if (data.area_m2 && parseFloat(data.area_m2) > 500) {
      images.push('https://images.unsplash.com/photo-1497366216548-37526070297c?w=400')
    }

    return images
  }

  // Generate features from available data
  private static generateFeatures(data: any): string[] {
    const features = []

    if (data.topografiaLote) features.push(`Topografia: ${data.topografiaLote}`)
    if (data.estadoConservacaoSimples) features.push(`Conservação: ${data.estadoConservacaoSimples}`)
    if (data.regimeTributacaoIPTU) features.push(`Regime: ${data.regimeTributacaoIPTU}`)
    if (data.areaTotalConstruidaSimples || data.areaTotalConstruidaMultipla) {
      const area = data.areaTotalConstruidaSimples || data.areaTotalConstruidaMultipla
      features.push(`Área: ${area}m²`)
    }
    if (data.valorVenal) features.push(`Valor venal: R$ ${parseFloat(data.valorVenal).toLocaleString('pt-BR')}`)
    if (data.anoConstrucaoMultipla) features.push(`Ano construção: ${data.anoConstrucaoMultipla}`)

    // Add location-based features
    if (data.enderecoImovelBairro?.toLowerCase().includes('centro')) features.push('Centro Histórico')
    if (data.enderecoImovelNomeLogradouro?.toLowerCase().includes('porto')) features.push('Próximo ao Porto')
    if (data.enderecoImovelNomeLogradouro?.toLowerCase().includes('mar')) features.push('Vista para o mar')

    return features
  }

  // Get building data by coordinates (find nearest building)
  static async getBuildingByCoordinates(lng: number, lat: number): Promise<BuildingData | null> {
    try {
      console.log(`🔍 Procurando imóvel em: ${lng.toFixed(6)}, ${lat.toFixed(6)}`)

      const buildings = await this.loadCSVData()

      if (buildings.length === 0) {
        console.warn('Nenhum dado de imóvel carregado')
        return null
      }

      console.log(`📊 Total de imóveis carregados: ${buildings.length}`)
      console.log(`📍 Primeiros 3 imóveis para debug:`)
      buildings.slice(0, 3).forEach((b, i) => {
        console.log(`  ${i+1}. ${b.name} - Coords: [${b.coordinates[0]}, ${b.coordinates[1]}] - ID: ${b.id}`)
      })

      // Find nearest building (simple distance calculation)
      let nearestBuilding: BuildingData | null = null
      let minDistance = Infinity

      for (const building of buildings) {
        const [bLng, bLat] = building.coordinates
        const distance = Math.sqrt(
          Math.pow(lng - bLng, 2) + Math.pow(lat - bLat, 2)
        )

        // Only consider buildings within ~200 meters (0.002 degrees ≈ 220m at Recife latitude)
        if (distance < 0.002 && distance < minDistance) {
          minDistance = distance
          nearestBuilding = building
          console.log(`🎯 Imóvel candidato encontrado: ${building.name} - Distância: ${distance.toFixed(6)} - Coords: [${bLng}, ${bLat}]`)
        }
      }

      if (nearestBuilding) {
        console.log(`✅ Imóvel encontrado: ${nearestBuilding.name} (${nearestBuilding.id}) - Distância: ${minDistance.toFixed(6)}`)
        return nearestBuilding
      } else {
        console.log('❌ Nenhum imóvel encontrado nas proximidades')
        console.log(`📍 Coordenadas clicadas: [${lng}, ${lat}]`)
        console.log(`🔍 Verificando se há imóveis próximos...`)

        // Debug: show closest buildings even if outside threshold
        const closestBuildings = buildings
          .map(b => ({
            building: b,
            distance: Math.sqrt(Math.pow(lng - b.coordinates[0], 2) + Math.pow(lat - b.coordinates[1], 2))
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5)

        console.log('🏠 5 imóveis mais próximos:')
        closestBuildings.forEach((item, i) => {
          console.log(`  ${i+1}. ${item.building.name} - Dist: ${item.distance.toFixed(6)} - Coords: [${item.building.coordinates[0]}, ${item.building.coordinates[1]}]`)
        })

        return null
      }

    } catch (error) {
      console.error('Erro ao buscar imóvel por coordenadas:', error)
      return null
    }
  }

  // Get nearby buildings within radius
  static async getNearbyBuildings(lng: number, lat: number, radiusKm: number = 1): Promise<BuildingData[]> {
    try {
      const buildings = await this.loadCSVData()
      const radiusDegrees = radiusKm / 111 // Rough conversion km to degrees

      return buildings.filter(building => {
        const [bLng, bLat] = building.coordinates
        const distance = Math.sqrt(
          Math.pow(lng - bLng, 2) + Math.pow(lat - bLat, 2)
        )
        return distance <= radiusDegrees
      })
    } catch (error) {
      console.error('Erro ao buscar imóveis próximos:', error)
      return []
    }
  }

  // Search buildings by text query
  static async searchBuildings(query: string): Promise<BuildingData[]> {
    try {
      const buildings = await this.loadCSVData()
      const searchTerm = query.toLowerCase()

      return buildings.filter(building =>
        building.name.toLowerCase().includes(searchTerm) ||
        building.address.toLowerCase().includes(searchTerm) ||
        building.features.some(feature => feature.toLowerCase().includes(searchTerm))
      ).slice(0, 10) // Limit results
    } catch (error) {
      console.error('Erro na busca de imóveis:', error)
      return []
    }
  }

  // Get building by ESIG number
  static async getBuildingByEsig(esigNum: string): Promise<BuildingData | null> {
    try {
      const buildings = await this.loadCSVData()
      return buildings.find(building => building.id === esigNum) || null
    } catch (error) {
      console.error('Erro ao buscar imóvel por ESIG:', error)
      return null
    }
  }
}

// Google Places API for photos (if needed)
export class GooglePlacesAPI {
  private static apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

  static async getPlacePhotos(placeId: string): Promise<string[]> {
    if (!this.apiKey) {
      console.warn('Google Places API key not configured')
      return []
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${this.apiKey}`
      )

      const data = await response.json()

      if (data.result?.photos) {
        return data.result.photos.map((photo: any) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
        )
      }

      return []
    } catch (error) {
      console.error('Error fetching place photos:', error)
      return []
    }
  }
}