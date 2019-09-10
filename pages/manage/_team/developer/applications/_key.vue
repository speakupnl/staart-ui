<template>
  <main>
    <div>
      <div class="row">
        <div>
          <nuxt-link
            :to="`/manage/${$route.params.team}/developer/applications`"
            aria-label="Back"
            data-balloon-pos="down"
            class="button button--type-icon button--type-back"
          >
            <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
          </nuxt-link>
          <h1>Application</h1>
        </div>
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
      <div v-if="application">
        <h2>Use Application</h2>
        <Input label="Client ID" :value="application.clientId" disabled />
        <button class="button" @click="copy(application.jwtApplication)">
          <font-awesome-icon class="icon icon--mr-1" icon="copy" />
          <span v-if="copied">Copied</span>
          <span v-else>Copy</span>
        </button>
        <button
          type="button"
          class="button button--color-danger"
          style="margin-left: 0.5rem"
          @click.prevent="showDelete = application"
        >
          <font-awesome-icon class="icon icon--mr-1" icon="trash" />
          <span>Delete</span>
        </button>
        <div class="text text--mt-2">
          <h2>Edit Application</h2>
          <form
            v-meta-ctrl-enter="updateApplication"
            @submit.prevent="updateApplication"
          >
            <Input
              label="Name"
              placeholder="Enter a name for this Application"
              :value="application.name"
              @input="val => (application.name = val)"
            />
            <button class="button">Update Application</button>
          </form>
        </div>
      </div>
      <Loading v-else-if="loading" :message="loading" />
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
        <h2>Are you sure you want to delete this Application?</h2>
        <p>
          Deleting an Application is not reversible, and you'll need to update
          any apps using this key.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteApplication(showDelete.id)"
        >
          Yes, delete Application
        </button>
        <button type="button" class="button" @click="showDelete = false">
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
  faPencilAlt,
  faArrowDown,
  faSync,
  faTrash,
  faEye,
  faEyeSlash,
  faArrowLeft,
  faCopy
} from "@fortawesome/free-solid-svg-icons";
import copy from "copy-to-clipboard";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import CheckList from "@/components/form/CheckList.vue";
import CommaList from "@/components/form/CommaList.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Applications, emptyPagination, Application } from "@/types/manage";
import translations from "@/locales/en";
import { removeNulls } from "@/helpers/crud";
const scopes = translations.scopes;
library.add(
  faPencilAlt,
  faArrowDown,
  faSync,
  faTrash,
  faCopy,
  faEye,
  faEyeSlash,
  faArrowLeft
);

@Component({
  components: {
    Loading,
    Confirm,
    Input,
    TimeAgo,
    CommaList,
    FontAwesomeIcon,
    CheckList,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  applications: Applications = emptyPagination;
  showDelete = false;
  loading = "";
  application: Application | undefined = undefined;
  scopes = scopes;
  copied = false;
  loggedInMembership = 3;

  private created() {
    this.application = {
      ...this.$store.getters["manage/application"](
        this.$route.params.team,
        this.$route.params.key
      )
    };
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }

  private load() {
    this.loading = "Loading your Applications";
    this.$store
      .dispatch("manage/getApplication", {
        team: this.$route.params.team,
        id: this.$route.params.key
      })
      .then(application => {
        this.application = { ...application };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private updateApplication() {
    this.loading = "Updating your Application";
    const application = { ...this.application };
    if (application) {
      [
        "jwtApplication",
        "groupId",
        "expiresAt",
        "createdAt",
        "updatedAt"
      ].forEach(k => delete application[k]);
    }
    this.$store
      .dispatch("manage/updateApplication", {
        team: this.$route.params.team,
        id: this.$route.params.key,
        ...application
      })
      .then(application => {
        this.application = { ...application };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
      });
  }

  private deleteApplication(key: number) {
    this.showDelete = false;
    this.loading = "Deleting your Application";
    this.$store
      .dispatch("manage/deleteApplication", {
        team: this.$route.params.team,
        id: key
      })
      .then(applications => {
        this.applications = { ...applications };
        this.$router.push(
          `/manage/${this.$route.params.team}/developer/applications`
        );
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private copy(text: string) {
    copy(text);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 3000);
  }
}
</script>

<style lang="scss" scoped></style>
