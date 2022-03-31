/*
interface Artist {
  id: number
  name: string
  picUrl: null
  alias: string[]
  albumSize: number
  picId: number
  img1v1Url: string
  img1v1: number
  trans: null
}


interface Album {
  id: number
  name: string
  artist: Artist
  publishTime: number
  size: number
  copyrightId: number
  status: number
  picId: number
  mark: number
}

export interface Song {
  id: number
  name: string
  artists: Artist[]
  album: Album
  duration: number
  copyrightId: number
  status: number
  alias: string[]
  rtype: number
  ftype: number
  transNames: string[]
  mvid: number
  fee: number
  rUrl: null
  mark: number
}

interface Result {
  songs: Song[]
  hasMore: boolean
  songCount: number
}
*/

interface Artist {
  id: number
  name: string
}

export interface Song {
  name: string
  id: number
  ar: Artist[]
}

interface Result {
  songs: Song[]
  searchQcReminder: null
  songCount: number
}

export interface SongResult {
  code: number
  result: Result
}

interface SongURL {
  url: string | null
  freeTrialInfo: { start: number; end: number } | null
}

export interface SongURLResult {
  data: SongURL[]
}
