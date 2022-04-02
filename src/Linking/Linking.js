const config = {
  screen: {
    Home: {
      path: "Home",
    },
    ForgotPassword: {
      path: "ForgotPassword/:id",
      parse: {
        id: (id) => `${id}`,
      },
    },
    ResetPassword: {
      path: "ResetPassword/:id",
      parse: {
        id: (id) => `${id}`,
      },
    },
  },
};
const linking = {
  prefixes: ["http://communav.ikaart.org", "https://communv.page.link"],
  // prefixes: ["  live.ipreservationlive.com"],
  config,
};
export default linking;
