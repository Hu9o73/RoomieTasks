export interface Household {
    id: number;
    name: string;
    inviteCode?: string;
    ownerId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface HouseholdMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    nickname?: string;
    role: 'owner' | 'admin' | 'member';
  }
  
  export interface HouseholdDetails {
    household: Household;
    members: HouseholdMember[];
  }