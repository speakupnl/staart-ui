<template>
  <main>
    <div class="container container--size-small">
      <Loading message="Loading your dashboard" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";

@Component({
  middleware: "auth",
  components: {
    Loading
  }
})
export default class Dashboard extends Vue {
  private mounted() {
    const team = this.$store.getters["auth/activeGroup"];
    if (team && team !== "undefined") {
      this.$router.replace(`/dashboard/${team}`);
    } else {
      const user = this.$store.getters["auth/user"];
      if (user.id)
        return this.$store
          .dispatch("users/getMemberships", { slug: user.id })
          .then(memberships => this.continue(memberships))
          .catch(() => {});
    }
  }
  private continue(memberships) {
    if (memberships.data && memberships.data.length) {
      if (memberships.data[0].id) {
        this.$router.replace(`/dashboard/${memberships.data[0].id}`);
      }
    } else {
      this.$router.replace("/onboarding/group");
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 10vh 0;
  margin-bottom: 10vh;
  h1 {
    margin: 0 0 2rem 0;
  }
}
</style>
