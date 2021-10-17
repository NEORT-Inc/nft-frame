import { Art, FrameSignInInfo, Playlist } from '~/types/dto'

export interface FirebaseAuthState {
  loading: boolean
  id: string
  token: string
  email: string
  isEmailVerified: boolean
}

export interface FirebaseAnalyticsState {}

export interface AuthState {
  loading: boolean
  emailName: string
}

export interface SignInModalState {
  isModalShowing: boolean
  pendingAction: (() => void) | null
}

export interface SignUpModalState {
  isModalShowing: boolean
  pendingAction: (() => void) | null
}

export interface FrameSignInState {
  loading: boolean
  frameSignInInfo: FrameSignInInfo
  childChangedCallback: any
  errorMessage: string
}

export interface PlaylistState {
  loading: boolean
  arts: Art[]
  currentArtIndex: number
  currentPlaylistId: string
  currentPlaylistName: string
  playlists: Playlist[]
}
