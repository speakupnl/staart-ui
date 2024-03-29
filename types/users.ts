import { IdRow, Paginated } from "./root";
import { Group } from "./manage";

export interface User extends IdRow {
  name: string;
  username: string;
  nickname: string;
  primaryEmail: number;
  twoFactorEnabled: boolean;
  countryCode: string;
  timezone: string;
  notificationEmails: number;
  preferredLanguage: string;
  prefersReducedMotion: boolean;
  prefersColorSchemeDark: boolean;
  role: number;
  gender: "m" | "f" | "n" | "x";
  profilePicture: string;
  attributes?: {
    [index: string]: (string | number | boolean)[];
  }
}

export interface AccessToken extends IdRow {
  userId: number;
  jwtApiKey: string;
  scopes: string;
}
export interface Membership extends IdRow {
  userId: number;
  groupId: number;
  group: Group;
  role: "1" | "2" | "3";
}
export interface Email extends IdRow {
  email: string;
  isVerified: boolean;
}
export interface Session extends IdRow {
  jwtToken: string;
  ipAddress: string;
  userAgent: string;
}

export interface AccessTokens extends Paginated {
  data: AccessToken[];
}
export interface Memberships extends Paginated {
  data: Membership[];
}
export interface Emails extends Paginated {
  data: Email[];
}
export interface Sessions extends Paginated {
  data: Session[];
}

export interface UsersKV {
  [index: string]: User;
}
export interface AccessTokensKV {
  [index: string]: AccessTokens;
}
export interface MembershipsKV {
  [index: string]: Memberships;
}
export interface EmailsKV {
  [index: string]: Emails;
}
export interface SessionsKV {
  [index: string]: Sessions;
}

export interface SingleAccessTokenKV {
  [index: string]: {
    [index: string]: AccessToken;
  };
}
export interface SingleMembershipKV {
  [index: string]: {
    [index: string]: Membership;
  };
}
export interface SingleEmailKV {
  [index: string]: {
    [index: string]: Email;
  };
}
export interface SingleSessionKV {
  [index: string]: {
    [index: string]: Session;
  };
}

export interface RootState {
  users: UsersKV;
  accessTokens: AccessTokensKV;
  accessToken: SingleAccessTokenKV;
  memberships: MembershipsKV;
  membership: SingleMembershipKV;
  emails: EmailsKV;
  email: SingleEmailKV;
  sessions: SessionsKV;
  session: SingleSessionKV;
}

export const emptyUser: User = {
  id: 0,
  name: "",
  username: "",
  nickname: "",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  primaryEmail: 0,
  twoFactorEnabled: false,
  countryCode: "",
  timezone: "",
  notificationEmails: 1,
  preferredLanguage: "en",
  prefersColorSchemeDark: false,
  prefersReducedMotion: false,
  profilePicture: "",
  role: 1,
  gender: "x"
};
export const emptyPagination = {
  data: [],
  hasMore: false
};
