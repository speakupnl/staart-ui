<template>
  <main>
    <div class="row">
      <h1>Team</h1>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon
            title="Refresh"
            class="icon"
            icon="sync"
            :spin="!!loading"
            fixed-width
          />
        </button>
      </div>
    </div>
    <table v-if="memberships && memberships.data" class="table">
      <thead>
        <th>Name</th>
        <!-- <th>Joined</th>
        <th>Role</th> -->
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="(member, index) in memberships.data"
          :key="`${member.id}_${index}`"
        >
          <td><User :user="member" /></td>
        </tr>
      </tbody>
    </table>
    <Loading v-else-if="loading" :message="loading" />
    <div class="pagination text text--align-center">
      <button
        v-if="memberships && memberships.hasMore"
        class="button"
        :disabled="loadingMore"
        @click="loadMoreMembers"
      >
        <span>Load more members</span>
        <font-awesome-icon v-if="!loadingMore" class="icon" icon="arrow-down" />
        <font-awesome-icon
          v-else
          class="icon icon--ml-2 icon--color-light"
          icon="sync"
          spin
        />
      </button>
    </div>
    <h2>Invite another member</h2>
    <p>
      Use this form to invite another user from your team to this group.
    </p>
    <Loading v-if="inviting" message="Inviting member" />
    <form
      v-else
      v-meta-ctrl-enter="inviteMember"
      @submit.prevent="inviteMember"
    >
      <Input
        :value="newUserName"
        label="Name"
        placeholder="Enter new user's full name"
        required
        @input="val => (newUserName = val)"
      />
      <Input
        :value="newUserEmail"
        type="email"
        label="Email"
        placeholder="Enter new user's email"
        required
        @input="val => (newUserEmail = val)"
      />
      <Select
        :value="newUserRole"
        label="Role"
        label-help="Learn more about roles"
        label-help-to="/"
        :options="membershipRoles"
        required
        @input="val => (newUserRole = val)"
      />
      <button class="button">Send invitation</button>
    </form>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to remove {{ showDelete.user.name }}?</h2>
        <p>
          Removing someone from your group is not reversible, and you'll need to
          invite them again if you change your mind.
        </p>
        <p>
          If they have any group-specific data, that will also be deleted.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteMembership(showDelete.id)"
        >
          Yes, remove {{ showDelete.user.nickname }}
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't remove
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faPencilAlt,
  faArrowDown,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import User from "@/components/User.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Confirm from "@/components/Confirm.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { Email } from "@/types/settings";
import locale from "@/locales/en";
import { Members, emptyPagination } from "@/types/manage";
import { User as UserType } from "@/types/auth";
library.add(faTrash, faPencilAlt, faArrowDown, faSync);

@Component({
  components: {
    TimeAgo,
    User,
    Loading,
    Input,
    Select,
    Checkbox,
    FontAwesomeIcon,
    Confirm
  },
  computed: mapGetters({
    user: "auth/user"
  }),
  middleware: "auth"
})
export default class ManageMembers extends Vue {
  memberships: Members = emptyPagination;
  user!: UserType;
  loading = "";
  inviting = false;
  showDelete = null;
  loadingMore = false;
  membershipRoles = locale.membershipRoles;
  loggedInMembership = 3;

  newUserName = "";
  newUserEmail = "";
  newUserRole = 3;

  private created() {
    this.memberships = {
      ...this.$store.getters["manage/memberships"](this.$route.params.team)
    };
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.loading = "Loading members";
    this.$store
      .dispatch("manage/getMembers", { team: this.$route.params.team })
      .then(memberships => (this.memberships = { ...memberships }))
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
  private loadMoreMembers() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getMembers", {
        team: this.$route.params.team,
        start: this.$store.state.manage.memberships[this.$route.params.team]
          .next
      })
      .then(memberships => {
        this.memberships = {
          ...this.$store.getters["manage/memberships"](this.$route.params.team)
        };
      })
      .catch(() => {})
      .finally(() => (this.loadingMore = false));
  }

  private inviteMember() {
    this.inviting = true;
    this.$store
      .dispatch("manage/inviteMember", {
        name: this.newUserName,
        email: this.newUserEmail,
        role: this.newUserRole,
        team: this.$route.params.team
      })
      .then(memberships => (this.memberships = { ...memberships }))
      .catch(() => {})
      .finally(() => (this.inviting = false));
    this.newUserName = "";
    this.newUserEmail = "";
  }

  private deleteMembership(id: number) {
    this.showDelete = null;
    this.loading = "Deleting membership";
    this.$store
      .dispatch("manage/deleteMembership", {
        id,
        team: this.$route.params.team
      })
      .then(memberships => (this.memberships = { ...memberships }))
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>
