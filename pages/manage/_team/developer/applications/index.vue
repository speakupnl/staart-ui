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
              <th>Access</th>
              <th>Restrictions</th>
              <th>Expiry</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(application, index) in applications.data"
              :key="`${application.id}_${index}`"
            >
              <td>{{ application.name || "Unnamed application" }}</td>
              <td v-if="application.scopes">
                {{ application.scopes.split(",").length }} API{{
                  application.scopes.split(",").length === 1 ? "" : "s"
                }}
              </td>
              <td v-else>No APIs</td>
              <td
                v-if="
                  application.ipRestrictions || application.referrerRestrictions
                "
              >
                {{
                  (application.ipRestrictions || "").split(",").length +
                    (application.referrerRestrictions || "").split(",").length
                }}
                restriction{{
                  (application.ipRestrictions || "").split(",").length +
                    (application.referrerRestrictions || "").split(",")
                      .length ===
                  1
                    ? ""
                    : "s"
                }}
              </td>
              <td v-else>No restrictions</td>
              <td><TimeAgo :date="application.expiresAt" /></td>
              <td class="text text--align-right">
                <router-link
                  :to="
                    `/manage/${$route.params.team}/developer/applications/${application.id}`
                  "
                  aria-label="View"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon class="icon" icon="eye" fixed-width />
                </router-link>
                <router-link
                  :to="
                    `/manage/${$route.params.team}/developer/logs?key=${application.id}`
                  "
                  aria-label="Logs"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="chart-line"
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
      <div
        v-if="loggedInMembership !== 3 && loggedInMembership !== 4"
        class="text text--mt-2"
      >
        <h2>Create application</h2>
        <p>
          You can use applications to programmatically access Staart in your
          applications.
        </p>
        <form @submit.prevent="createApplication">
          <CheckList
            label="API restrictions"
            :options="scopes"
            :value="newScopes"
            placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
            @input="val => (newScopes = val)"
          />
          <p class="text text--color-muted text--size-small">
            You can add IP and referrer restrictions after creating the
            application.
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
  faEye,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import CheckList from "@/components/form/CheckList.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Applications, emptyPagination, Application } from "@/types/manage";
import translations from "@/locales/en";
const scopes = translations.scopes;
library.add(faArrowDown, faSync, faTrash, faEye, faChartLine);

@Component({
  components: {
    Loading,
    Confirm,
    CheckList,
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
  newScopes = "orgRead";
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
        scopes: this.newScopes ? this.newScopes : undefined
      })
      .then(applications => {
        this.applications = { ...applications };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newScopes = "";
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
