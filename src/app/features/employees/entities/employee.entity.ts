import { AppMetadata } from './app-metadata.entity';
import { UserMetadata } from './user-metadata.entity';

export interface Employee {
  id: string
  aud: string
  role: string
  email: string
  phone: string
  app_metadata: AppMetadata
  user_metadata: UserMetadata
  identities: any
  created_at: string
  updated_at: string
  is_anonymous: boolean
  email_confirmed_at?: string
  confirmed_at?: string
  last_sign_in_at?: string
}
