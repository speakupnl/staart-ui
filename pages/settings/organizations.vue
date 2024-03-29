<template>
  <main>
    <h2>Memberships</h2>
    <p>
      You can switch which team you are using Staart as here.
    </p>
    <Loading v-if="loading" :message="loading" />
    <div v-else-if="memberships">
      <div v-if="!memberships.data.length" class="card card--type-padded">
        <LargeMessage
          heading="No teams"
          img="undraw_team_spirit_hrr4.svg"
          text="You're not a member of any teams yet, let's change that."
        />
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Joined</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(membership, index) in memberships.data"
            :key="`${membership.id}_${index}`"
          >
            <td>{{ membership.group.name }}</td>
            <td><TimeAgo :date="membership.createdAt" /></td>
            <td>{{ membershipRoles[membership.role] || membership.role }}</td>
            <td class="text text--align-right">
              <nuxt-link
                aria-label="Dashboard"
                data-balloon-pos="up"
                class="button button--type-icon"
                :to="
                  `/dashboard/${
                    membership.group && membership.group.username
                      ? membership.group.username
                      : membership.groupId
                  }`
                "
              >
                <font-awesome-icon title="Dashboard" icon="eye" fixed-width />
              </nuxt-link>
              <nuxt-link
                aria-label="Settings"
                data-balloon-pos="up"
                class="button button--type-icon"
                :to="
                  `/manage/${
                    membership.group && membership.group.username
                      ? membership.group.username
                      : membership.groupId
                  }/settings`
                "
              >
                <font-awesome-icon title="Settings" icon="cog" fixed-width />
              </nuxt-link>
              <button
                aria-label="Leave group"
                data-balloon-pos="up"
                class="button button--color-danger button--type-icon"
                @click="showDelete = membership"
              >
                <font-awesome-icon
                  title="Leave group"
                  class="icon icon--color-danger"
                  icon="trash"
                  fixed-width
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination text text--align-center">
        <button
          v-if="memberships && memberships.hasMore"
          class="button"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span>Load more memberships</span>
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
    <h2>Create a team</h2>
    <p>
      To invite your team to Staart, get started by creating a new team.
    </p>
    <Loading v-if="isCreating" message="Creating your team" />
    <form v-else v-meta-ctrl-enter="createGroup" @submit.prevent="createGroup">
      <Input
        :value="groupName"
        label="Name"
        placeholder="Enter your team's name"
        required
        @input="val => (groupName = val)"
      />
      <button class="button">
        Create team
      </button>
    </form>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to leave {{ showDelete.group.name }}?</h2>
        <p>
          Leaving a team is not reversible, and you'll have to ask an admin to
          add you again if you change your mind.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteMembership(showDelete.id)"
        >
          Yes, leave {{ showDelete.group.name }}
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't leave
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faEye,
  faCog,
  faSync,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import en from "@/locales/en";
import { Email, Memberships } from "@/types/settings";
library.add(faTrash, faEye, faCog, faSync, faArrowDown);

@Component({
  components: {
    LargeMessage,
    Loading,
    Input,
    TimeAgo,
    FontAwesomeIcon,
    Confirm
  },
  computed: mapGetters({
    memberships: "settings/memberships"
  }),
  middleware: "auth"
})
export default class AccountSettings extends Vue {
  loading = "";
  groupName = "";
  isCreating = false;
  membershipRoles = en.membershipRoles;
  loadingMore = false;
  memberships!: Memberships;
  showDelete = null;

  private mounted() {
    this.loading = "Loading your groups";
    this.$store
      .dispatch("settings/getMemberships")
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch(
        "settings/getMemberships",
        this.$store.state.settings.memberships.start
      )
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loadingMore = false));
  }

  private deleteMembership(id: number) {
    this.showDelete = null;
    this.loading = "Leaving group";
    this.$store
      .dispatch("settings/deleteMembership", id)
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private createGroup() {
    this.isCreating = true;
    this.$store
      .dispatch("settings/createGroup", {
        name: this.groupName
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.isCreating = false));
    this.groupName = "";
  }
}
</script>

<style lang="scss" scoped></style>
