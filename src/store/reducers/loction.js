export const initialState = {
  latitude: null,
  longitude: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LATITUDE": {
      return {
        ...state,
        latitude: action.latitude,
      };
    }
    case "LONGITUDE": {
      return {
        ...state,
        longitude: action.longitude,
      };
    }
    default: {
      return state;
    }
  }
};
export default reducer;
