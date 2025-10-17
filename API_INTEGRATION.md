# Integração com APIs do Governo de Recife

Este projeto está preparado para integração com APIs reais do governo de Recife e serviços de imagens.

## 🚀 APIs Disponíveis

### 1. Portal de Dados Abertos de Recife
- **URL Base**: `https://dados.recife.pe.gov.br/`
- **Datasets disponíveis**:
  - Imóveis municipais
  - Dados imobiliários
  - Informações urbanísticas

### 2. Google Places API (para fotos)
- **Documentação**: https://developers.google.com/maps/documentation/places/web-service
- **Uso**: Obter fotos reais dos imóveis

## ⚙️ Configuração

### Variáveis de Ambiente

Adicione ao arquivo `.env.local`:

```env
# Recife Government APIs
NEXT_PUBLIC_RECIFE_API_BASE_URL=https://dados.recife.pe.gov.br/api/3/action
NEXT_PUBLIC_RECIFE_DATASET_ID=your-dataset-id

# Google Places API (opcional - para fotos reais)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Mapbox (já configurado)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### Como Encontrar os Datasets

1. Acesse https://dados.recife.pe.gov.br/dataset
2. Procure por datasets relacionados a imóveis:
   - "imóveis municipais"
   - "patrimônio imobiliário"
   - "dados urbanos"

3. Cada dataset tem um ID único que deve ser usado nas chamadas da API

## 🔧 Implementação Técnica

### Estrutura Atual

O código já está preparado para APIs reais:

```typescript
// lib/recife-api.ts - Serviço de API
export class RecifeRealEstateAPI {
  static async getBuildingByCoordinates(lng: number, lat: number): Promise<BuildingData | null> {
    // Implementar chamada real aqui
  }
}
```

### Como Integrar uma API Real

1. **Localizar o endpoint correto** no portal de dados
2. **Atualizar a função** `getBuildingByCoordinates` em `lib/recife-api.ts`
3. **Mapear os campos** da API para a interface `BuildingData`

Exemplo de implementação:

```typescript
static async getBuildingByCoordinates(lng: number, lat: number): Promise<BuildingData | null> {
  try {
    const response = await fetch(
      `${this.baseURL}/datastore_search?resource_id=${process.env.NEXT_PUBLIC_RECIFE_DATASET_ID}&q=${lng},${lat}`
    )

    const data = await response.json()

    if (data.result?.records?.[0]) {
      const record = data.result.records[0]
      return {
        id: record.id,
        name: record.nome || record.descricao,
        address: record.endereco,
        area: record.area,
        price: record.valor,
        coordinates: [lng, lat],
        // ... outros campos
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching from Recife API:', error)
    return null // Fallback para dados mock
  }
}
```

## 📸 Integração com Fotos

### Google Places API

Para obter fotos reais dos imóveis:

1. **Obter Place ID** do endereço usando Geocoding API
2. **Buscar fotos** usando Places API
3. **Armazenar URLs** das fotos no objeto do imóvel

### Alternativas para Fotos

- **Imagens do Google Street View** (se disponível)
- **Fotos de drones** do governo (se disponíveis em APIs)
- **Imagens de satélite** do Mapbox/Google

## 🧪 Testando a Integração

### Modo Desenvolvimento
- O código já tem **fallback para dados mock** quando APIs não estão disponíveis
- Verifique o console do navegador para logs de debug
- Use dados mock realistas para desenvolvimento

### Produção
1. Configure todas as variáveis de ambiente
2. Teste com dados reais
3. Implemente cache para evitar chamadas excessivas às APIs
4. Adicione tratamento de rate limiting

## 📋 Campos de Dados Disponíveis

### Dados Esperados da API de Recife:
- `id`: Identificador único
- `nome`: Nome do imóvel
- `endereco`: Endereço completo
- `area`: Área em metros quadrados
- `valor`: Valor de mercado/aluguel
- `tipo`: Residencial/Comercial/Industrial
- `status`: Disponível/Alugado/Vendido
- `coordenadas`: Latitude/Longitude
- `caracteristicas`: Array de features

### Mapeamento para Interface:
```typescript
interface BuildingData {
  id: string
  name: string
  address: string
  area: number
  price?: number
  description: string
  coordinates: [number, number]
  type: 'residential' | 'commercial' | 'industrial'
  status: 'available' | 'rented' | 'sold'
  images: string[]
  features: string[]
}
```

## 🚨 Considerações Importantes

1. **Rate Limiting**: APIs públicas têm limites de uso
2. **Cache**: Implemente cache para dados frequentemente acessados
3. **Fallback**: Sempre tenha dados mock como fallback
4. **Privacidade**: Não expor dados sensíveis dos imóveis
5. **Atualização**: Dados imobiliários mudam frequentemente

## 🔗 Links Úteis

- [Portal de Dados Abertos Recife](https://dados.recife.pe.gov.br/)
- [Documentação CKAN API](https://docs.ckan.org/en/latest/api/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Mapbox Datasets](https://docs.mapbox.com/data/)