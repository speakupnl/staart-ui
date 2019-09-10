<template>
  <main>
    <div>
      <div class="row">
        <h1>Applications</h1>
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
      <LargeMessage
        v-if="
          !loading &&
            (!applications || !applications.data || !applications.data.length)
        "
        heading="No applications yet"
        img="undraw_software_engineer_lvl5.svg"
        text="Create an application below"
      />
      <div
        v-else-if="
          applications && applications.data && applications.data.length
        "
      >
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(application, index) in applications.data"
              :key="`${application.id}_${index}`"
            >
              <td>{{ application.name || "Unnamed application" }}</td>
              <td>
                <code>{{ application.clientId }}</code>
              </td>
              <td class="text text--align-right">
                <button
                  aria-label="View secret"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon class="icon" icon="key" fixed-width />
                </button>
                <router-link
                  :to="
                    `/manage/${$route.params.team}/developer/applications/${application.id}`
                  "
                  aria-label="View"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="pencil-alt"
                    fixed-width
                  />
                </router-link>
                <button
                  aria-label="Delete"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = application)"
                >
                  <font-awesome-icon class="icon" icon="trash" fixed-width />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="applications && applications.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more applications</span>
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
      <Loading v-else :message="loading" />
      <div class="text text--mt-2">
        <h2>Create application</h2>
        <p>
          You can use applications to programmatically access Staart in your
          applications.
        </p>
        <form @submit.prevent="createApplication">
          <Input
            label="Application name"
            :value="newName"
            placeholder="Enter a name for your application"
            @input="val => (newName = val)"
          />
          <p class="text text--color-muted text--size-small">
            You can add more details, like redirect URLs and scopes, once you've
            created an application.
          </p>
          <button class="button">Create application</button>
        </form>
      </div>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to delete this application?</h2>
        <p>
          Deleting an application is not reversible, and you'll need to update
          any apps using this key.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteApplication(showDelete.id)"
        >
          Yes, delete application
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't delete
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
  faArrowDown,
  faSync,
  faTrash,
  faPencilAlt,
  faChartLine,
  faKey
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Applications, emptyPagination, Application } from "@/types/manage";
import translations from "@/locales/en";
const scopes = translations.scopes;
library.add(faArrowDown, faKey, faSync, faTrash, faPencilAlt, faChartLine);

@Component({
  components: {
    Loading,
    Confirm,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  applications: Applications = emptyPagination;
  showDelete: Application | null = null;
  loadingMore = false;
  loading = "";
  newName = "";
  scopes = scopes;
  loggedInMembership = 3;

  private created() {
    this.applications = {
      ...this.$store.getters["manage/applications"](this.$route.params.team)
    };
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }

  private load() {
    this.loading = "Loading your applications";
    this.$store
      .dispatch("manage/getApplications", { team: this.$route.params.team })
      .then(applications => {
        this.applications = { ...applications };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getApplications", {
        team: this.$route.params.team,
        start: this.$store.state.manage.applications[this.$route.params.team]
          .next
      })
      .then(() => {
        this.applications = {
          ...this.$store.getters["manage/applications"](this.$route.params.team)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private createApplication() {
    this.loading = "Creating your application";
    this.$store
      .dispatch("manage/createApplication", {
        team: this.$route.params.team,
        name: this.newName ? this.newName : undefined
      })
      .then(applications => {
        this.applications = { ...applications };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newName = "";
      });
  }

  private deleteApplication(key: number) {
    this.showDelete = null;
    this.loading = "Deleting your application";
    this.$store
      .dispatch("manage/deleteApplication", {
        team: this.$route.params.team,
        id: key
      })
      .then(applications => {
        this.applications = { ...applications };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
