<template>
  <main>
    <div class="row">
      <h1>Groups</h1>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon
            class="icon"
            icon="sync"
            :spin="!!loading"
            fixed-width
          />
        </button>
      </div>
    </div>
    <div v-if="groups && groups.data">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(group, index) in groups.data"
            :key="`${group.id}_${index}`"
          >
            <td><Team :team="group" /></td>
            <td><TimeAgo :date="group.createdAt" /></td>
            <td class="text text--align-right">
              <router-link
                :to="`/dashboard/${group.username || group.id}`"
                aria-label="View"
                data-balloon-pos="up"
                class="button button--type-icon"
              >
                <font-awesome-icon class="icon" icon="eye" fixed-width />
              </router-link>
              <router-link
                :to="`/manage/${group.username || group.id}/settings`"
                aria-label="Edit"
                data-balloon-pos="up"
                class="button button--type-icon"
              >
                <font-awesome-icon class="icon" icon="cog" fixed-width />
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination text text--align-center">
        <button
          v-if="groups && groups.hasMore"
          class="button"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span>Load more groups</span>
          <font-awesome-icon
            v-if="!loadingMore"
            class="icon"
            icon="arrow-down"
          />
          <font-awesome-icon
            v-else
            class="icon icon--ml-2 icon--color-light"
            icon="sync"
            spin
          />
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowDown,
  faSync,
  faEye,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import { emptyPagination } from "../../types/admin";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Team from "@/components/Team.vue";
library.add(faArrowDown, faSync, faEye, faCog);

@Component({
  components: {
    Loading,
    TimeAgo,
    Team,
    FontAwesomeIcon
  }
})
export default class AdminGroups extends Vue {
  groups = emptyPagination;
  loading = "";
  loadingMore = false;

  private created() {
    this.groups = { ...this.$store.getters["admin/groups"]() };
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.loading = "Loading your groups";
    this.$store
      .dispatch("admin/getGroups", {})
      .then(groups => {
        this.groups = { ...groups };
      })
      .catch(error => {
        throw new Error(error);
      })
      .then(() => (this.loading = ""));
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("admin/getGroups", {
        start: this.$store.state.admin.groups.next
      })
      .then(() => {
        this.groups = {
          ...this.$store.getters["admin/groups"]()
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }
}
</script>

<style lang="scss" scoped></style>
