<template>
  <main>
    <div class="container container--size-small">
      <Loading message="Loading your settings" />
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
      this.$router.replace(`/settings/${team}`);
    } else {
      this.$store
        .dispatch("settings/getMemberships")
        .then(memberships => {
          if (memberships.data && memberships.data.length) {
            if (
              memberships.data[0].group &&
              memberships.data[0].group.username
            ) {
              this.$router.replace(
                `/settings/${memberships.data[0].group.username}`
              );
            } else {
              this.$router.replace(`/settings/${memberships.data[0].groupId}`);
            }
          } else {
            this.$router.replace("/onboarding/group");
          }
        })
        .catch(() => {});
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
