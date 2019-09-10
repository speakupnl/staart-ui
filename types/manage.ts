import { subscriptions, invoices, sources } from "stripe";
import { IdRow, Row, Paginated } from "./root";

export interface Group extends IdRow {
  name?: string;
  stripeCustomerId?: string;
  username: string;
  autoJoinDomain: boolean;
  attributes?: {
    [index: string]: (string | number | boolean)[];
  }
  onlyAllowDomain: boolean;
}

export interface Membership extends IdRow {
  group: Group;
}
export interface Application extends IdRow {
  name?: string;
  jwtApplication: string;
  scopes: string;
  ipRestrictions?: string;
  referrerRestrictions?: string;
}
export type ApplicationLogs = any;
export interface Domain extends Row {
  domain: string;
  verificationCode: string;
  isVerified: boolean;
}
export interface Webhook extends Row {
  url: string;
  event: string;
  secret: string;
  contentType: string;
  isActive: boolean;
}

export interface Members extends Paginated {
  data: Membership[];
}
export interface Subscriptions extends Paginated {
  data: subscriptions.ISubscription[];
}
export interface Invoices extends Paginated {
  data: invoices.IInvoice[];
}
export interface Sources extends Paginated {
  data: sources.ISource[];
}
export interface Applications extends Paginated {
  data: Application[];
}
export interface Domains extends Paginated {
  data: Domain[];
}
export interface Webhooks extends Paginated {
  data: Webhook[];
}
export interface Address {
  state: string;
  country: string;
  city: string;
  line1: string;
  line2?: string;
  postal_code: string;
}
export interface Billing {
  name?: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface GroupsKV {
  [index: string]: Group;
}
export interface MembershipsKV {
  [index: string]: Members;
}
export interface BillingKV {
  [index: string]: Billing;
}
export interface SubscriptionsKV {
  [index: string]: Subscriptions;
}
export interface InvoicesKV {
  [index: string]: Invoices;
}
export interface SourcesKV {
  [index: string]: Sources;
}
export interface ApplicationsKV {
  [index: string]: Applications;
}
export interface DomainsKV {
  [index: string]: Domains;
}
export interface WebhooksKV {
  [index: string]: Webhooks;
}

export interface SingleSubscriptionKV {
  [index: string]: {
    [index: string]: subscriptions.ISubscription;
  };
}
export interface SingleInvoiceKV {
  [index: string]: {
    [index: string]: invoices.IInvoice;
  };
}
export interface SingleSourceKV {
  [index: string]: {
    [index: string]: sources.ISource;
  };
}
export interface SingleApplicationKV {
  [index: string]: {
    [index: string]: Application;
  };
}
export interface SingleApplicationLogsKV {
  [index: string]: {
    [index: string]: ApplicationLogs;
  };
}
export interface SingleDomainKV {
  [index: string]: {
    [index: string]: Domain;
  };
}
export interface SingleWebhookKV {
  [index: string]: {
    [index: string]: Webhook;
  };
}
export interface LoggedInMembershipsKV {
  [index: string]: number;
}

export interface RootState {
  membership?: Membership;
  loggedInMembership: LoggedInMembershipsKV;
  groups: GroupsKV;
  memberships: MembershipsKV;
  subscriptions: SubscriptionsKV;
  subscription: SingleSubscriptionKV;
  billing: BillingKV;
  invoices: InvoicesKV;
  invoice: SingleInvoiceKV;
  sources: SourcesKV;
  source: SingleSourceKV;
  applications: ApplicationsKV;
  application: SingleApplicationKV;
  applicationLogs: SingleApplicationLogsKV;
  domains: DomainsKV;
  domain: SingleDomainKV;
  devWebhooks: WebhooksKV;
  devWebhook: SingleWebhookKV;
  pricingPlans?: any;
  recentEvents?: any;
  isDownloading: boolean;
}

export const emptyGroup: Group = {
  id: 0,
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  name: "",
  username: "",
  stripeCustomerId: "",
  autoJoinDomain: false,
  onlyAllowDomain: false
};
export const emptyPagination = {
  data: [],
  hasMore: false
};
export const emptyAddress: Address = {
  state: "",
  country: "",
  line1: "",
  city: "",
  postal_code: ""
};
export const emptyBilling: Billing = {
  email: "",
  address: emptyAddress
};
