export const removeNulls = (value: any) => {
  if (typeof value === "object") {
    Object.keys(value).forEach(key => {
      if (value[key] === null) delete value[key];
    });
  }
  return value;
};

export const removeFalsyValues = (value: any) => {
  if (typeof value === "object") {
    Object.keys(value).forEach(key => {
      if (!value[key]) {
        delete value[key];
      }
    });
  }
  return value;
};

export const removeReadOnlyValues = (value: any) => {
  if (typeof value === "object") {
    Object.keys(value).forEach(key => {
      if (
        [
          "createdAt",
          "id",
          "jwtApiKey",
          "userId",
          "groupId",
          "stripeCustomerId",
          "updatedAt",
          "twoFactorEnabled",
          "lastFiredAt",
          "access",
          "disableableCredentialTypes",
          "enabled",
          "emailVerified",
          "notBefore",
          "requiredActions",
          "createdTimestamp"
        ].includes(key)
      ) {
        delete value[key];
      }
    });
  }
  return value;
};
