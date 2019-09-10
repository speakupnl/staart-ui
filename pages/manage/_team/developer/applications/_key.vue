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
        <div>
          <Input label="Client ID" :value="application.clientId" disabled />
          <button class="button" @click="copy(application.clientId)">
            <font-awesome-icon class="icon icon--mr-1" icon="copy" />
            <span>Copy</span>
          </button>
        </div>
        <div class="text text--mt-1">
          <Input label="Client Secret" :value="secret" disabled />
          <button class="button" @click="copy(secret)">
            <font-awesome-icon class="icon icon--mr-1" icon="copy" />
            <span>Copy</span>
          </button>
          <button class="button" @click="regenerate">
            <span>Regenerate</span>
          </button>
        </div>
        <div class="text text--mt-2">
          <h2>Edit Application</h2>
          <form
            v-meta-ctrl-enter="updateApplication"
            @submit.prevent="updateApplication"
          >
            <Checkbox
              label="Application enabled"
              :value="application.enabled"
              @input="val => (application.enabled = val)"
            />
            <Input
              label="Name"
              placeholder="Enter a name for this Application"
              :value="application.name"
              @input="val => (application.name = val)"
            />
            <TextArea
              label="Description"
              placeholder="Enter details about your application"
              :value="getAttribute('description')"
              @input="val => setAttribute('description', val)"
            />
            <div class="row text text--mb-1">
              <div
                class="column column--type-shrink text text--align-center ai"
              >
                <img
                  class="app-icon"
                  alt="App icon preview"
                  :src="getAttribute('icon') || '/apple-touch-icon.png'"
                />
              </div>
              <Input
                label="Icon"
                placeholder="Enter a URL for your application icon"
                :value="getAttribute('icon')"
                @input="val => setAttribute('icon', val)"
              />
            </div>
            <Input
              label="Application URL"
              placeholder="Enter the URL for your application"
              :value="getAttribute('url')"
              @input="val => setAttribute('url', val)"
            />
            <Checkbox
              label="Service accounts enabled"
              help="Check this if this application will not perform actions for users"
              :value="application.serviceAccountsEnabled"
              @input="val => (application.serviceAccountsEnabled = val)"
            />
            <h3>OAuth settings</h3>
            <ArrayList
              label="Redirect URLs"
              :value="application.redirectUris"
              placeholder="Enter an authorized redirect URL"
              @input="val => (application.redirectUris = val)"
            />
            <ArrayList
              label="Web origins"
              :value="application.webOrigins"
              placeholder="Enter an authorized web origin for CORS"
              @input="val => (application.webOrigins = val)"
            />
            <ArrayCheckList
              label="Default client scopes"
              :value="application.defaultClientScopes"
              :options="clientScopesList"
              @input="val => (application.defaultClientScopes = val)"
            />
            <ArrayCheckList
              label="Optional client scopes"
              :value="application.optionalClientScopes"
              :options="clientScopesList"
              @input="val => (application.optionalClientScopes = val)"
            />
            <button class="button">Update Application</button>
            <button
              type="button"
              class="button button--color-danger"
              style="margin-left: 0.5rem"
              @click.prevent="showDelete = application"
            >
              <font-awesome-icon class="icon icon--mr-1" icon="trash" />
              <span>Delete application</span>
            </button>
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
import TextArea from "@/components/form/TextArea.vue";
import ArrayCheckList from "@/components/form/ArrayCheckList.vue";
import CommaList from "@/components/form/CommaList.vue";
import ArrayList from "@/components/form/ArrayList.vue";
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
    TextArea,
    Input,
    TimeAgo,
    CommaList,
    ArrayList,
    FontAwesomeIcon,
    ArrayCheckList,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  applications: Applications = emptyPagination;
  showDelete = false;
  showSecret = false;
  loading = "";
  application: Application | undefined = undefined;
  scopes = scopes;
  copied = false;
  loggedInMembership = 3;
  secret = "Loading...";
  clientScopesList = {
    role_list: { text: "role_list" },
    profile: { text: "profile" },
    email: { text: "email" },
    address: { text: "address" },
    phone: { text: "phone" },
    offline_access: { text: "offline_access" }
  };

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
    this.getSecret();
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

  private getSecret() {
    this.secret = "Loading...";
    this.$store
      .dispatch("manage/getApplicationSecret", {
        team: this.$route.params.team,
        id: this.$route.params.key
      })
      .then(application => {
        this.secret = application.value;
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  private regenerate() {
    this.secret = "Loading...";
    this.$store
      .dispatch("manage/putApplicationSecret", {
        team: this.$route.params.team,
        id: this.$route.params.key
      })
      .then(application => {
        this.secret = application.value;
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  setAttribute(key: string, value: string) {
    if (!this.application) return;
    const application = JSON.parse(
      JSON.stringify(this.application)
    ) as Application;
    application.attributes = application.attributes || {};
    application.attributes[key] = value;
    this.application = { ...application };
  }

  getAttribute(key: string) {
    if (!this.application) return;
    const application = { ...this.application };
    application.attributes = application.attributes || {};
    return application.attributes[key];
  }
}
</script>

<style lang="scss" scoped>
.app-icon {
  box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 0.2rem;
}
.ai {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
