import { MutationTree, ActionTree, GetterTree } from "vuex";
import download from "downloadjs";
import Vue from "vue";
import { RootState, Group, emptyPagination } from "~/types/manage";

export const state = (): RootState => ({
  memberships: {},
  isDownloading: false,
  groups: {},
  billing: {},
  loggedInMembership: {},
  subscriptions: {},
  subscription: {},
  invoices: {},
  invoice: {},
  sources: {},
  source: {},
  applications: {},
  application: {},
  domains: {},
  domain: {},
  devWebhooks: {},
  devWebhook: {},
  applicationLogs: {}
});

export const mutations: MutationTree<RootState> = {
  setGroup(state: RootState, group: Group): void {
    const groups = state.groups;
    groups[group.id] = group;
    Vue.set(state, "groups", groups);
  },
  setLoggedInMembership(state: RootState, { team, role }) {
    const loggedInMembership = state.loggedInMembership;
    loggedInMembership[team] = role;
    Vue.set(state, "loggedInMembership", loggedInMembership);
  },
  setMembers(state: RootState, { team, members, start, next }): void {
    const currentMembers = { ...state.memberships };
    currentMembers[team] = currentMembers[team] || emptyPagination;
    if (start) {
      currentMembers[team].data = [
        ...currentMembers[team].data,
        ...members.data
      ];
    } else {
      currentMembers[team].data = members.data;
    }
    currentMembers[team].next = next;
    Vue.set(state, "memberships", currentMembers);
  },
  setBilling(state: RootState, { billing, team }): void {
    const currentBilling = { ...state.billing };
    currentBilling[team] = billing;
    Vue.set(state, "billing", currentBilling);
  },
  setSubscriptions(
    state: RootState,
    { team, subscriptions, start, next }
  ): void {
    const currentSubscriptions = { ...state.subscriptions };
    currentSubscriptions[team] = currentSubscriptions[team] || emptyPagination;
    if (start) {
      currentSubscriptions[team].data = [
        ...currentSubscriptions[team].data,
        ...subscriptions.data
      ];
    } else {
      currentSubscriptions[team].data = subscriptions.data;
    }
    currentSubscriptions[team].next = next;
    Vue.set(state, "subscriptions", currentSubscriptions);
  },
  setSubscription(state: RootState, { team, subscription, id }): void {
    const currentSubscriptions = { ...state.subscription };
    currentSubscriptions[team] = currentSubscriptions[team] || {};
    currentSubscriptions[team][id] = { ...subscription };
    Vue.set(state, "subscription", currentSubscriptions);
  },
  setInvoices(state: RootState, { team, invoices, start, next }): void {
    const currentInvoices = { ...state.invoices };
    currentInvoices[team] = currentInvoices[team] || emptyPagination;
    if (start) {
      currentInvoices[team].data = [
        ...currentInvoices[team].data,
        ...invoices.data
      ];
    } else {
      currentInvoices[team].data = invoices.data;
    }
    currentInvoices[team].next = next;
    Vue.set(state, "invoices", currentInvoices);
  },
  setInvoice(state: RootState, { team, invoice, id }): void {
    const currentInvoices = { ...state.invoice };
    currentInvoices[team] = currentInvoices[team] || {};
    currentInvoices[team][id] = { ...invoice };
    Vue.set(state, "invoice", currentInvoices);
  },
  setSources(state: RootState, { team, sources, start, next }): void {
    const currentSources = { ...state.sources };
    currentSources[team] = currentSources[team] || emptyPagination;
    if (start) {
      currentSources[team].data = [
        ...currentSources[team].data,
        ...sources.data
      ];
    } else {
      currentSources[team].data = sources.data;
    }
    currentSources[team].next = next;
    Vue.set(state, "sources", currentSources);
  },
  setSource(state: RootState, { team, source, id }): void {
    const currentSources = { ...state.source };
    currentSources[team] = currentSources[team] || {};
    currentSources[team][id] = { ...source };
    Vue.set(state, "source", currentSources);
  },
  setApplications(state: RootState, { team, applications, start, next }): void {
    const currentApplications = { ...state.applications };
    currentApplications[team] = currentApplications[team] || emptyPagination;
    if (start) {
      currentApplications[team].data = [
        ...currentApplications[team].data,
        ...applications.data
      ];
    } else {
      currentApplications[team].data = applications.data;
    }
    currentApplications[team].next = next;
    Vue.set(state, "applications", currentApplications);
  },
  setApplication(state: RootState, { team, application, id }): void {
    const currentApplications = { ...state.application };
    currentApplications[team] = currentApplications[team] || {};
    currentApplications[team][id] = { ...application };
    Vue.set(state, "application", currentApplications);
  },
  setApplicationLogs(state: RootState, { team, applicationLogs, id, from }): void {
    const currentApplicationLogs = { ...state.applicationLogs };
    currentApplicationLogs[team] = currentApplicationLogs[team] || {};
    currentApplicationLogs[team][id] = currentApplicationLogs[team][id] || emptyPagination;
    if (from) {
      currentApplicationLogs[team][id].data = [
        ...currentApplicationLogs[team][id].data,
        ...applicationLogs.data
      ];
    } else {
      currentApplicationLogs[team][id] = { ...applicationLogs };
    }
    Vue.set(state, "applicationLogs", currentApplicationLogs);
  },
  setDomains(state: RootState, { team, domains, start, next }): void {
    const currentDomains = { ...state.domains };
    currentDomains[team] = currentDomains[team] || emptyPagination;
    if (start) {
      currentDomains[team].data = [
        ...currentDomains[team].data,
        ...domains.data
      ];
    } else {
      currentDomains[team].data = domains.data;
    }
    currentDomains[team].next = next;
    Vue.set(state, "domains", currentDomains);
  },
  setDomain(state: RootState, { team, domain, id }): void {
    const currentDomains = { ...state.domain };
    currentDomains[team] = currentDomains[team] || {};
    currentDomains[team][id] = { ...domain };
    Vue.set(state, "domain", currentDomains);
  },
  setWebhooks(state: RootState, { team, webhooks, start, next }): void {
    const currentWebhooks = { ...state.devWebhooks };
    currentWebhooks[team] = currentWebhooks[team] || emptyPagination;
    if (start) {
      currentWebhooks[team].data = [
        ...currentWebhooks[team].data,
        ...webhooks.data
      ];
    } else {
      currentWebhooks[team].data = webhooks.data;
    }
    currentWebhooks[team].next = next;
    Vue.set(state, "devWebhooks", currentWebhooks);
  },
  setWebhook(state: RootState, { team, webhook, id }): void {
    const currentWebhooks = { ...state.devWebhook };
    currentWebhooks[team] = currentWebhooks[team] || {};
    currentWebhooks[team][id] = { ...webhook };
    Vue.set(state, "devWebhook", currentWebhooks);
  },
  setPricingPlans(state: RootState, pricingPlans: any): void {
    Vue.set(state, "pricingPlans", pricingPlans);
  },
  setRecentEvents(state: RootState, recentEvents: any): void {
    Vue.set(state, "recentEvents", recentEvents);
  },
  clearAll(state: RootState): void {
    const currentState = { ...state };
    currentState.groups = {};
    currentState.billing = {};
    currentState.memberships = {};
    delete currentState.membership;
    currentState.subscriptions = {};
    currentState.subscription = {};
    currentState.invoices = {};
    currentState.invoice = {};
    currentState.sources = {};
    currentState.source = {};
    currentState.recentEvents = {};
    currentState.pricingPlans = {};
    currentState.applications = {};
    currentState.application = {};
    currentState.domains = {};
    currentState.domain = {};
    currentState.devWebhooks = {};
    currentState.devWebhook = {};
    state = currentState;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async getGroup({ commit }, context) {
    const org: Group = (await this.$axios.get(
      `/groups/${context}`
    )).data;
    commit("setGroup", org);
    return org;
  },
  async updateGroup({ dispatch }, context) {
    const update = { ...context };
    delete update.team;
    await this.$axios.patch(`/groups/${context.team}`, update);
    return dispatch("getGroup", context.username || context.team);
  },
  async deleteGroup({ commit, rootGetters }, { team }) {
    await this.$axios.delete(`/groups/${team}`);
    commit("clearAll");
  },
  async getExport({ commit, rootGetters }, { team }) {
    const data = (await this.$axios.get(`/groups/${team}`)).data;
    download(
      JSON.stringify(data, null, 2),
      `export-${new Date().getTime()}.json`,
      "application/json"
    );
  },
  async getMembers({ commit }, { team, start = 0 }) {
    const members = (await this.$axios.get(
      `/groups/${team}/members?start=${start}`
    )).data;
    commit("setMembers", { team, members, start, next: members.next });
    return members;
  },
  async inviteMember({ dispatch, rootGetters }, context) {
    const toInvite = { ...context };
    delete toInvite.team;
    await this.$axios.put(
      `/groups/${context.team}/members`,
      toInvite
    );
    return dispatch("getMembers", { team: context.team });
  },
  async deleteMembership({ dispatch }, { id, team }) {
    await this.$axios.delete(`/groups/${team}/members/${id}`);
    return dispatch("getMembers", { team });
  },
  async getMembership(actions, { id, team }) {
    return (await this.$axios.get(`/groups/${team}/members/${id}`)).data;
  },
  async updateMembership({ dispatch }, context) {
    const data = { ...context };
    delete data.id;
    delete data.team;
    await this.$axios.patch(`/groups/${context.team}/members/${context.id}`, data);
    return dispatch("getMembership", { team: context.team, id: context.id });
  },
  async getBilling({ commit }, team) {
    const billing: any = (await this.$axios.get(
      `/groups/${team}/billing`
    )).data;
    commit("setBilling", { billing, team });
    return billing;
  },
  async updateBilling({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.patch(`/groups/${context.team}/billing`, data);
    return dispatch("getBilling", context.team);
  },
  async getInvoices({ commit }, { team, start = 0 }) {
    const invoices: any = (await this.$axios.get(
      `/groups/${team}/invoices?start=${start}`
    )).data;
    commit("setInvoices", { team, invoices, start, next: invoices.next });
    return invoices;
  },
  async getInvoice({ commit }, { team, id }) {
    const invoice: any = (await this.$axios.get(
      `/groups/${team}/invoices/${id}`
    )).data;
    commit("setInvoice", { team, invoice, id });
    return invoice;
  },
  async getSubscriptions({ commit }, { team, start = 0 }) {
    const subscriptions: any = (await this.$axios.get(
      `/groups/${team}/subscriptions?start=${start}`
    )).data;
    commit("setSubscriptions", {
      team,
      subscriptions,
      start,
      next: subscriptions.next
    });
    return subscriptions;
  },
  async getSubscription({ commit }, { team, id }) {
    const subscription: any = (await this.$axios.get(
      `/groups/${team}/subscriptions/${id}`
    )).data;
    commit("setSubscription", { team, subscription, id });
    return subscription;
  },
  async editSubscription({ dispatch }, context) {
    const data = { ...context };
    delete data.id;
    delete data.team;
    await this.$axios.patch(
      `/groups/${context.team}/subscriptions/${context.id}`,
      data
    );
    return dispatch("getSubscription", { team: context.team, id: context.id });
  },
  async createSubscription({ dispatch }, { team, plan }) {
    await this.$axios.put(`/groups/${team}/subscriptions`, { plan });
    return dispatch("getSubscriptions", { team });
  },
  async getPricingPlans({ commit }, context) {
    const subscriptions: any = (await this.$axios.get(
      `/groups/${context}/pricing`
    )).data;
    commit("setPricingPlans", subscriptions);
  },
  async getSources({ commit }, { team, start = 0 }) {
    const sources: any = (await this.$axios.get(
      `/groups/${team}/sources?start=${start}`
    )).data;
    commit("setSources", { team, sources, start, next: sources.next });
    return sources;
  },
  async getSource({ commit }, { team, id }) {
    const source: any = (await this.$axios.get(
      `/groups/${team}/sources/${id}`
    )).data;
    commit("setSource", { team, source, id });
    return source;
  },
  async createSource({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/groups/${context.team}/sources`, data);
    return dispatch("getSources", { team: context.team });
  },
  async deleteSource({ dispatch }, context) {
    await this.$axios.delete(
      `/groups/${context.team}/sources/${context.id}`
    );
    return dispatch("getSources", { team: context.team });
  },
  async updateSource({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/groups/${context.team}/sources/${context.id}`,
      data
    );
    return dispatch("getSource", { team: context.team, id: context.id });
  },
  async getApplications({ commit }, { team, start = 0 }) {
    const applications: any = (await this.$axios.get(
      `/groups/${team}/applications?start=${start}`
    )).data;
    commit("setApplications", { team, applications, start, next: applications.next });
    return applications;
  },
  async getApplication({ commit }, { team, id }) {
    const application: any = (await this.$axios.get(
      `/groups/${team}/applications/${id}`
    )).data;
    commit("setApplication", { team, application, id });
    return application;
  },
  async getApplicationLogs({ commit }, { team, id, range, from }) {
    const applicationLogs: any = (await this.$axios.get(
      `/groups/${team}/applications/${id}/logs?range=${range}&from=${from}`
    )).data;
    commit("setApplicationLogs", { team, applicationLogs, range, id, from });
    return applicationLogs;
  },
  async createApplication({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/groups/${context.team}/applications`, data);
    return dispatch("getApplications", { team: context.team });
  },
  async deleteApplication({ dispatch }, context) {
    await this.$axios.delete(
      `/groups/${context.team}/applications/${context.id}`
    );
    return dispatch("getApplications", { team: context.team });
  },
  async updateApplication({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/groups/${context.team}/applications/${context.id}`,
      data
    );
    return dispatch("getApplication", context);
  },
  async getDomains({ commit }, { team, start = 0 }) {
    const domains: any = (await this.$axios.get(
      `/groups/${team}/domains?start=${start}`
    )).data;
    commit("setDomains", { team, domains, start, next: domains.next });
    return domains;
  },
  async getDomain({ commit }, { team, id }) {
    const domain: any = (await this.$axios.get(
      `/groups/${team}/domains/${id}`
    )).data;
    commit("setDomain", { team, domain, id });
    return domain;
  },
  async createDomain({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/groups/${context.team}/domains`, data);
    return dispatch("getDomains", { team: context.team });
  },
  async deleteDomain({ dispatch }, context) {
    await this.$axios.delete(
      `/groups/${context.team}/domains/${context.id}`
    );
    return dispatch("getDomains", { team: context.team });
  },
  async updateDomain({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/groups/${context.team}/domains/${context.id}`,
      data
    );
    return dispatch("getDomain", context);
  },
  async verifyDomain({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.post(
      `/groups/${context.team}/domains/${context.id}/verify`,
      data
    );
    return dispatch("getDomain", context);
  },
  async getWebhooks({ commit }, { team, start = 0 }) {
    const webhooks: any = (await this.$axios.get(
      `/groups/${team}/webhooks?start=${start}`
    )).data;
    commit("setWebhooks", { team, webhooks, start, next: webhooks.next });
    return webhooks;
  },
  async getWebhook({ commit }, { team, id }) {
    const webhook: any = (await this.$axios.get(
      `/groups/${team}/webhooks/${id}`
    )).data;
    commit("setWebhook", { team, webhook, id });
    return webhook;
  },
  async createWebhook({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/groups/${context.team}/webhooks`, data);
    return dispatch("getWebhooks", { team: context.team });
  },
  async deleteWebhook({ dispatch }, context) {
    await this.$axios.delete(
      `/groups/${context.team}/webhooks/${context.id}`
    );
    return dispatch("getWebhooks", { team: context.team });
  },
  async updateWebhook({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/groups/${context.team}/webhooks/${context.id}`,
      data
    );
    return dispatch("getWebhook", context);
  },
  async getEvents({ commit, rootGetters }) {
    const org = rootGetters["auth/activeGroup"];
    const groupId = org.groupId;
    const events: any = (await this.$axios.get(
      `/groups/${groupId}/events`
    )).data;
    commit("setRecentEvents", events);
  }
};

export const getters: GetterTree<RootState, RootState> = {
  membership: state => state.membership,
  pricingPlans: state => state.pricingPlans,
  securityEvents: state => state.recentEvents,
  isDownloading: state => state.isDownloading,
  memberships: state => (team: string) => (state.memberships)[team],
  loggedInMembership: state => (team: string) => (state.loggedInMembership)[team] || 4,
  billing: state => (team: string) => (state.billing)[team],
  subscriptions: state => (team: string) => (state.subscriptions)[team],
  subscription: state => (team: string, subscriptionId: string) =>
    state.subscription[team] && state.subscription[team][subscriptionId],
  invoices: state => (team: string) => (state.invoices)[team],
  invoice: state => (team: string, invoiceId: string) =>
    state.invoice[team] && state.invoice[team][invoiceId],
  sources: state => (team: string) => (state.sources)[team],
  source: state => (team: string, sourceId: string) =>
    state.source[team] && state.source[team][sourceId],
  applications: state => (team: string) => (state.applications)[team],
  application: state => (team: string, application: string) =>
    state.application[team] && state.application[team][application],
  domains: state => (team: string) => (state.domains)[team],
  domain: state => (team: string, domain: string) =>
    state.domain[team] && state.domain[team][domain],
  webhooks: state => (team: string) => (state.devWebhooks)[team],
  webhook: state => (team: string, webhook: string) =>
    state.devWebhook[team] && state.devWebhook[team][webhook],
  applicationLogs: state => (team: string, applicationLogs: string) =>
    state.applicationLogs[team] && state.applicationLogs[team][applicationLogs],
  group: state => (team: string) => (state.groups)[team]
};
