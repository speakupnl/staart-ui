import Vue from "vue";
import { MutationTree, ActionTree, GetterTree } from "vuex";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AxiosRequestConfig } from "axios";
import decode from "jwt-decode";
import en from "@/locales/en";
import { removeNulls, removeReadOnlyValues } from "~/helpers/crud";
import { RootState } from "~/types/auth";
const messages = en.messages;
const errors = en.errors;

const redirectErrors = ["unapproved-location", "missing-token"];
const ignoredErrors = ["no-customer"];

export default function({
  $axios,
  redirect,
  store
}: {
  $axios: NuxtAxiosInstance;
  redirect: any;
  store: {
    state: {
      auth: RootState;
    };
    dispatch: any;
  };
}) {
  $axios.interceptors.request.use(
    (config: AxiosRequestConfig) =>
      new Promise((resolve, reject) => {
        config.data = removeNulls(removeReadOnlyValues(config.data));
        $axios.setHeader("X-Requested-With", "XMLHttpRequest");

        // Don't worry, this is a public API key and you can see this :)
        if (process.env.NODE_ENV !== "development")
          $axios.setHeader("X-Api-Key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsIm9yZ2FuaXphdGlvbklkIjoxLCJyZWZlcnJlclJlc3RyaWN0aW9ucyI6Im5ldGxpZnkuY29tIiwiaWF0IjoxNTY0OTkyNDY2LCJleHAiOjg4NTAyNTgzMjYwNDcsImlzcyI6InN0YWFydCIsInN1YiI6ImFwaS1rZXkiLCJqdGkiOiIzODdmNWRjZDliN2UifQ.XZquqZTZ9YIZb6WO5AA69FMnvR4pdD9T4dwU0daXSxw");
        try {
          const token = config.headers.common.Authorization.replace(
            "Bearer ",
            ""
          );
          if (decode(token).exp * 1000 < new Date().getTime()) {
            $axios.setHeader("Authorization", undefined);
            store
              .dispatch("auth/refresh")
              .then((newToken: string) => {
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`
                };
              })
              .catch((error: any) => {
                throw new Error(error);
              })
              .then(() => resolve(config));
          } else {
            resolve(config);
          }
        } catch (error) {
          resolve(config);
        }
      })
  );
  $axios.onResponse(response => {
    if (response.data.success === true) {
      if (response.data.message) {
        Vue.notify({
          group: "auth",
          text: messages[response.data.message] || messages.success,
          type: "notification notification--color-success"
        });
      } else {
        Vue.notify({
          group: "auth",
          text: messages.success,
          type: "notification notification--color-success"
        });
      }
    }
  });
  $axios.onError(error => {
    if (!error.response) return;
    if (
      ["revoked-token", "invalid-token", "expired-token"].includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      return redirect("/auth/refresh");
    }
    if (
      ignoredErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
    } else if (
      redirectErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      return redirect(
        `/errors/${error.response.data.code || error.response.data.error}`
      );
    } else if (
      Object.keys(errors).includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      Vue.notify({
        group: "auth",
        text: errors[error.response.data.code || error.response.data.error],
        duration: 5000,
        type: "notification notification--color-danger"
      });
    } else {
      Vue.notify({
        group: "auth",
        text: error.response.data.message || error.response.data.code || error.response.data.error,
        type: "notification notification--color-danger"
      });
    }
  });
}
