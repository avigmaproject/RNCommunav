export const setOfficer = (officer) => {
  console.log("officerredux", officer);
  return (dispatch) => {
    dispatch({ type: "OFFICER", officer });
  };
};
