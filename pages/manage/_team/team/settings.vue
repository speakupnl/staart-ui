<template>
  <main>
    <div class="row">
      <h1>Settings</h1>
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
            fixed-width
          />
        </button>
      </div>
    </div>
    <Loading v-if="loading" :message="loading" />
    <form v-else v-meta-ctrl-enter="save" @submit.prevent="save">
      <Input
        :value="group.name"
        label="Team name"
        placeholder="Enter your group's name"
        required
        @input="val => (group.name = val)"
      />
      <Input
        :value="getAttribute('domain')"
        label="Team domain"
        placeholder="Enter your team's domain name"
        required
        @input="val => setAttribute('domain', val)"
      />
      <Checkbox
        :value="getAttribute('allowDomain')"
        label="Allow people from this domain to join my team automatically"
        @input="val => setAttribute('allowDomain', val)"
      />
      <button class="button">
        Update settings
      </button>
    </form>
    <Domains v-if="loggedInMembership !== 4" style="margin-top: 2rem" />
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Domains from "@/components/team/Domains.vue";
import { User } from "@/types/auth";
import { GroupsKV, Group, emptyGroup } from "@/types/manage";
library.add(faSync);

@Component({
  components: {
    Loading,
    Input,
    Domains,
    FontAwesomeIcon,
    Select,
    ImageInput,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  loading = "";
  group: Group = emptyGroup;
  loggedInMembership = 3;

  private created() {
    this.group = {
      ...this.$store.getters["manage/group"](this.$route.params.team)
    };
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }

  private load() {
    this.loading = "Loading group details";
    this.$store
      .dispatch("manage/getGroup", this.$route.params.team)
      .then(org => {
        this.group = { ...org };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  setAttribute(key: string, value: string) {
    this.group.attributes = this.group.attributes || {};
    if (this.group.attributes[key] && this.group.attributes[key].length) {
      this.group.attributes[key][0] = value;
    } else {
      this.group.attributes[key] = [value];
    }
  }

  getAttribute(key: string) {
    this.group.attributes = this.group.attributes || {};
    if (this.group.attributes[key] && this.group.attributes[key].length) {
      return this.group.attributes[key][0];
    }
  }

  private save() {
    this.loading = "Saving";
    this.$store
      .dispatch("manage/updateGroup", {
        team: this.$route.params.team,
        ...this.group
      })
      .then(org => {
        this.group = { ...org };
        this.$router.replace(`/manage/${this.group.id}/team/settings`);
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
