import { MutationTree, ActionTree, GetterTree } from "vuex";
import Vue from "vue";
import { RootState, emptyPagination } from "~/types/admin";

export const state = (): RootState => ({
  users: emptyPagination,
  groups: emptyPagination,
  serverLogs: emptyPagination
});

export const mutations: MutationTree<RootState> = {
  setUsers(state: RootState, { users, start, next }): void {
    const currentUsers = { ...state.users } || emptyPagination;
    if (start) {
      currentUsers.data = [
        ...currentUsers.data,
        ...users.data
      ];
    } else {
      currentUsers.data = users.data;
    }
    currentUsers.next = next;
    Vue.set(state, "users", currentUsers);
  },
  setGroups(state: RootState, { groups, start, next }): void {
    const currentGroups = { ...state.groups } || emptyPagination;
    if (start) {
      currentGroups.data = [
        ...currentGroups.data,
        ...groups.data
      ];
    } else {
      currentGroups.data = groups.data;
    }
    currentGroups.next = next;
    Vue.set(state, "groups", currentGroups);
  },
  setServerLogs(state: RootState, { serverLogs, from }): void {
    let currentServerLogs = { ...state.serverLogs } || emptyPagination;
    if (from) {
      currentServerLogs.data = [
        ...currentServerLogs.data,
        ...serverLogs.data
      ];
    } else {
      currentServerLogs = { ...serverLogs };
    }
    Vue.set(state, "serverLogs", currentServerLogs);
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async getUsers({ commit }, { start = 0 }) {
    const users: any = (await this.$axios.get(
      `/admin/users?start=${start}&itemsPerPage=20`
    )).data;
    commit("setUsers", {
      users,
      start,
      next: users.next
    });
    return users;
  },
  async getGroups({ commit }, { start = 0 }) {
    const groups: any = (await this.$axios.get(
      `/admin/groups?start=${start}&itemsPerPage=20`
    )).data;
    commit("setGroups", {
      groups,
      start,
      next: groups.next
    });
    return groups;
  },
  async getServerLogs({ commit }, { range, from }) {
    const serverLogs: any = (await this.$axios.get(
      `/admin/server-logs?range=${range}&from=${from}`
    )).data;
    commit("setServerLogs", {
      serverLogs, range, from
    });
    return serverLogs;
  }
};

export const getters: GetterTree<RootState, RootState> = {
  users: state => () => state.users,
  groups: state => () => state.groups,
  serverLogs: state => () => state.serverLogs
};
