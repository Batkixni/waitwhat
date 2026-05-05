import settings from '../../config/settings.json';

export interface ServerConfig {
  name: string;
  ip: string;
  port: number;
  banner: string;
  description: string;
  discordUrl: string;
}

export interface LocaleConfig {
  default: string;
  available: string[];
}

export interface ShopConfig {
  enabled: boolean;
  provider: 'tebex' | 'mcsets';
  tebexUrl: string;
  mcsetsUrl: string;
  currency: {
    default: string;
    available: string[];
  };
}

export interface TeamRank {
  id: string;
  priority: number;
}

export interface TeamConfig {
  ranks: TeamRank[];
  members: Record<string, string[]>;
}

export interface Gamemode {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Partner {
  name: string;
  logo: string;
  url: string;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
}

export interface Settings {
  server: ServerConfig;
  locale: LocaleConfig;
  shop: ShopConfig;
  rules: { lastUpdated: string };
  team: TeamConfig;
  gamemodes: Gamemode[];
  partners: Partner[];
  milestones: Milestone[];
}

export const config: Settings = settings as Settings;

export default config;
