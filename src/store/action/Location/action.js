export const setLatitude = (latitude) => {
  return (dispatch) => {
    dispatch({ type: "LATITUDE", latitude });
  };
};
export const setLongitude = (longitude) => {
  return (dispatch) => {
    dispatch({ type: "LONGITUDE", longitude });
  };
};
