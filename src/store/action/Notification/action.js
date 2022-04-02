export const setNotification = (notification) => {
  return (dispatch) => {
    dispatch({ type: "NOTIFICATIOV", notification });
  };
};
