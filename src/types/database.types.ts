export type UserRole = 'client' | 'freelancer';

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: UserRole;
  email: string;
  created_at: string;
  updated_at: string;
};

export type UserProfileInsert = Omit<UserProfile, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'created_at'>>;

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: UserProfileInsert;
        Update: UserProfileUpdate;
      };
    };
  };
}
