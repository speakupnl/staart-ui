<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="completedRegistration"
      heading="Check your email"
      img="undraw_message_sent_1030.svg"
      text="We've sent you a special link to complete your registration and activate your account."
    />
    <Card v-else>
      <h1>Register</h1>
      <form v-meta-ctrl-enter="register" @submit.prevent="register">
        <div class="row">
          <Input
            v-model="firstName"
            type="text"
            label="First name"
            placeholder="Enter your first name"
            autocomplete="first_name"
            required
            autofocus
          />
          <Input
            v-model="lastName"
            type="text"
            label="Last name"
            placeholder="Enter your last name"
            autocomplete="last_name"
            required
            autofocus
          />
        </div>
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your work email"
          autocomplete="email"
          required
        />
        <button
          class="button button--width-full button--size-large"
          type="submit"
        >
          Register for an account
        </button>
      </form>
    </Card>
    <p v-if="!completedRegistration" class="text text--mt-1">
      Already have an account?
      <nuxt-link to="/auth/login">Login to your account</nuxt-link>
    </p>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Card from "@/components/Card.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Card,
    LargeMessage,
    Input
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Login extends Vue {
  firstName = "";
  lastName = "";
  email = "";
  isAuthenticated!: boolean;
  completedRegistration = false;
  private register() {
    this.$store
      .dispatch("auth/register", {
        email: this.email,
        lastName: this.lastName,
        firstName: this.firstName
      })
      .then(() => {
        this.completedRegistration = true;
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.firstName = "";
        this.lastName = "";
        this.email = "";
      });
  }
  private created() {
    if (this.isAuthenticated) return this.$router.replace("/dashboard");
  }
}
</script>
