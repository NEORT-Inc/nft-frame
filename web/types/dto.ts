/* eslint-disable camelcase */
export interface Art2 {
  id: number
  name: string
  animation_url: string
  image_url: string
}

export interface Art {
  id: string
  media: string
  mediaType: MediaType
  siteTitle: string
  siteFavIconUrl: string
  siteUrl: string
  createdAt: number
}

export interface Media {
  src: string
  type: MediaType
}

export interface Playlist {
  id: string
  name: string
}

export interface User {
  id: string
  currentPlaylistId: string
  currentArtIndex: number
}

export class AppError {
  constructor(
    public message: string,
    public type: ErrorType,
    public code: number = 0
  ) {}
}

export enum MediaType {
  IMG = 'img',
  VIDEO = 'video',
  IFRAME = 'iframe',
}

export enum ErrorType {
  GENERAL = 0,
  FIREBASE_ERROR = 1,
  INVALID_SIGNUP = 2,
  EMPTY_EMAIL_OR_PASSWORD = 3,
}

export enum ButtonStyle {
  FILL_DISABLED = 'fillDisabled',
  FILL_WHITE = 'fillWhite',
  FILL_BLACK = 'fillBlack',
}

export enum Color {
  BLACK = 'black',
  WHITE = 'white',
  YELLOW = 'yellow',
}

export enum GAEventPage {
  TOP = 'top',
  DETAIL = 'detail',
}

export enum GAEventNAME {
  access = 'access',
  changePlaylist = 'change_playlist',
  changeArt = 'change_art',
  artChanged = 'art_changed',
  playlistChanged = 'playlist_changed',
}

export interface FrameSignInInfo {
  email: string
  password: string
}

export const DEFAULT_PLAYLIST = {
  id: 'default',
  name: 'default playlist',
}

export const DAILY_PLAYLIST = {
  id: 'daily',
  name: 'Daily Playlist',
}
