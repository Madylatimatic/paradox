interface MapOptions {
  zoom: number
}

interface MarkerOptions {
  map: IMap
  position: [number, number] | LngLat
}

export interface LngLat {
  KL: number
  className: string
  kT: number
  lat: number
  lng: number
}

export interface AMapEvent {
  pixel: {
    x: number
    y: number
  }
  lnglat: LngLat
}

interface Marker {
  on(type: string, listener: (event: AMapEvent) => void): void
}

export interface IMap {
  lnglat?: LngLat
  on(type: string, listener: (event: AMapEvent) => void): void
}

export interface IAMap {
  LngLat: { new (lng: number, lat: number, noWrap?: boolean): LngLat }
  Map: { new (div: string | HTMLDivElement, opts: MapOptions): IMap }
  Marker: { new (opts: MarkerOptions): Marker }
}
