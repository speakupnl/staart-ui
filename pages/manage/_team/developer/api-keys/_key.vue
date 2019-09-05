<template>
  <main>
    <div>
      <div class="row">
        <div>
          <nuxt-link
            :to="`/manage/${$route.params.team}/developer/api-keys`"
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
      <div v-if="apiKey && apiKey.jwtApiKey">
        <h2>Use Application</h2>
        <Input label="Application" :value="apiKey.jwtApiKey" disabled />
        <button class="button" @click="copy(apiKey.jwtApiKey)">
          <font-awesome-icon class="icon icon--mr-1" icon="copy" />
          <span v-if="copied">Copied</span>
          <span v-else>Copy</span>
        </button>
        <button
          v-if="!readOnly"
          type="button"
          class="button button--color-danger"
          style="margin-left: 0.5rem"
          @click.prevent="showDelete = apiKey"
        >
          <font-awesome-icon class="icon icon--mr-1" icon="trash" />
          <span>Delete</span>
        </button>
        <div class="text text--mt-2">
          <h2>Edit Application</h2>
          <form
            v-meta-ctrl-enter="() => (showUpdate = true)"
            @submit.prevent="() => (showUpdate = true)"
          >
            <Input
              label="Name"
              placeholder="Enter a name for this Application"
              :value="apiKey.name"
              :disabled="readOnly"
              @input="val => (apiKey.name = val)"
            />
            <CheckList
              label="API restrictions"
              :options="scopes"
              :value="apiKey.scopes"
              :disabled="readOnly"
              @input="val => (apiKey.scopes = val)"
            />
            <CommaList
              label="IP restrictions"
              :value="apiKey.ipRestrictions"
              placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
              :disabled="readOnly"
              @input="val => (apiKey.ipRestrictions = val)"
            />
            <CommaList
              label="Referrer restrictions"
              :value="apiKey.referrerRestrictions"
              placeholder="Enter a host name without protocol, e.g., example.com"
              :disabled="readOnly"
              @input="val => (apiKey.referrerRestrictions = val)"
            />
            <button v-if="!readOnly" class="button">Update Application</button>
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
          @click="deleteApiKey(showDelete.id)"
        >
          Yes, delete Application
        </button>
        <button type="button" class="button" @click="showDelete = false">
          No, don't delete
        </button>
      </Confirm>
    </transition>
    <transition name="modal">
      <Confirm v-if="showUpdate" :on-close="() => (showUpdate = false)">
        <h2>
          Are you sure you want to update and regenerate this Application?
        </h2>
        <p>
          Updating your Application will generate a new Application, so you'll
          have to update it wherever you're using it.
        </p>
        <p>The current Application will stop working instantly.</p>
        <button
          class="button button--color-primary button--state-cta"
          @click="updateApiKey"
        >
          Yes, regenerate Application
        </button>
        <button type="button" class="button" @click="showUpdate = false">
          No, don't update
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
import { ApiKeys, emptyPagination, ApiKey } from "@/types/manage";
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
  apiKeys: ApiKeys = emptyPagination;
  showDelete = false;
  showUpdate = false;
  loading = "";
  apiKey: ApiKey | undefined = undefined;
  scopes = scopes;
  copied = false;
  loggedInMembership = 3;

  private created() {
    this.apiKey = {
      ...this.$store.getters["manage/apiKey"](
        this.$route.params.team,
        this.$route.params.key
      )
    };
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }

  get readOnly() {
    return this.loggedInMembership === 3 || this.loggedInMembership === 4;
  }

  private load() {
    this.loading = "Loading your Applications";
    this.$store
      .dispatch("manage/getApiKey", {
        team: this.$route.params.team,
        id: this.$route.params.key
      })
      .then(apiKey => {
        this.apiKey = { ...apiKey };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private updateApiKey() {
    this.showUpdate = false;
    this.loading = "Updating your Application";
    const apiKey = { ...this.apiKey };
    if (apiKey) {
      ["jwtApiKey", "groupId", "expiresAt", "createdAt", "updatedAt"].forEach(
        k => delete apiKey[k]
      );
    }
    this.$store
      .dispatch("manage/updateApiKey", {
        team: this.$route.params.team,
        id: this.$route.params.key,
        ...apiKey
      })
      .then(apiKey => {
        this.apiKey = { ...apiKey };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
      });
  }

  private deleteApiKey(key: number) {
    this.showDelete = false;
    this.loading = "Deleting your Application";
    this.$store
      .dispatch("manage/deleteApiKey", {
        team: this.$route.params.team,
        id: key
      })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
        this.$router.push(`/manage/${this.$route.params.team}/api-keys`);
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
