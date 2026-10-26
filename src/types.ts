export type AppScreen = 
  | 'lockscreen' 
  | 'homescreen' 
  | 'imessage' 
  | 'gallery' 
  | 'email' 
  | 'notes' 
  | 'contact' 
  | 'instagram'
  | 'spotify'
  | 'safari'
  | 'calendar'
  | 'maps'
  | 'settings'
  | 'camera'
  | 'weather'
  | 'clock'
  | 'reminders'
  | 'files'
  | 'discord'
  | 'twitter'
  | 'facetime'
  | 'phone'

export interface AppIconProps {
  name: string;
  iconPath: string;
  screen: AppScreen;
  onClick: (screen: AppScreen) => void;
}