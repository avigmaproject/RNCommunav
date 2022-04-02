const BASE_URL = "http://icommunav.ikaart.org";

export const API = {
  LOGIN_API: BASE_URL + "/token",
  REGISTRATION_API: BASE_URL + "/token",
  FORGOT_PASSWORD: BASE_URL + "/api/CommunaV/ForGotPassword",
  RESET_PASSWORD: BASE_URL + "/api/CommunaV/ChangePasswordByEmail",
  GET_USER_DATA: BASE_URL + "/api/CommunaV/GetUserMasterData",
  STORE_IMAGE_API: BASE_URL + "/api/PickupPro/AddUserMasterData",
  UPDTAE_USER_DETAIL: BASE_URL + "/api/CommunaV/AddUserMasterData",
  COMPLAINT_REWIEW_FORM: BASE_URL + "/api/CommunaV/Createrating",
  GET_OFFICER: BASE_URL + "/api/CommunaV/GetOfficer",
  UPDTAE_OFFICER: BASE_URL + "/api/CommunaV/CreaterOfficer",
  GET_FILTER_DATA: BASE_URL + "/api/CommunaV/GetFilterData",
  GET_OFFICER_LIST: BASE_URL + "/api/CommunaV/Get_OfficerList",
  POST_FILTER_DATA: BASE_URL + "/api/CommunaV/Get_OfficerList",
  GET_OFFICER_MASTER: BASE_URL + "/api/CommunaV/Get_Officer_Master",
  CALL_LIST: BASE_URL + "/api/CommunaV/Get_Officer_User_Call",
  CRETAE_CALL: BASE_URL + "/api/CommunaV/CreateOfficer_User_Call",
  GETRATING: BASE_URL + "/api/CommunaV/Getrating",
  GET_AGENCY: BASE_URL + "/api/CommunaV/GetAgency",
  ADD_USER_MASTER_DATA: BASE_URL + "/api/CommunaV/AddUserMasterData",
};
