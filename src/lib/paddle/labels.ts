import type { LaunchSite } from './types'

// Reader-facing wording for the launch enums. Shared by the interactive
// explorer and the printable chart so the two cannot describe a site differently.

export const KIND_LABEL: Record<LaunchSite['kind'], string> = {
  hand: 'Hand launch',
  ramp: 'Ramp + paddle access',
  'water-only': 'Paddle-in only',
  unconfirmed: 'Confirm before you drive',
}

export const SOURCING_LABEL: Record<LaunchSite['sourcing'], string> = {
  confirmed: 'Confirmed by the managing agency',
  corroborated: 'Corroborated across sources',
  single: 'Single source — verify',
}
