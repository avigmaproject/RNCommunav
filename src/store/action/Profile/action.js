export const setProfile = (data) => {
  return (dispatch) => {
    dispatch({ type: "SET_PROFILE", data });
  };
};
