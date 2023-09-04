import API from "./getApi";
const token = localStorage.getItem("token");

export const getAllStudyData = async (params) => {
  const getAllStudyData = await API.post(
    "/studies/v1/fetch_studies_list",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getAllStudyData;
};

export const getMoreDetails = async (params) => {
  const getMoreDetails = await API.post(
    "/studies/v1/fetch_particular_study_more_details",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getMoreDetails;
};

export const getStudyData = async (params) => {
  const getStudyData = await API.post(
    "/studies/v1/fetch_particular_study",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getStudyData;
};

export const getStudyLogsData = async (params) => {
  const getStudyLogsData = await API.post(
    "/studies/v1/fetch_studies_logs",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getStudyLogsData;
};

export const getRadiologistList = async (params) => {
  const getRadiologistList = await API.post(
    "/institute/v1/fetch-radiologist-name",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getRadiologistList;
};

export const postAssignStudy = async (params) => {
  const postAssignStudy = await API.post("/studies/v1/assign_study", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return postAssignStudy;
};

export const updateStudyData = async (params) => {
  const updateStudyData = await API.post(
    "/studies/v1/update_study_details",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return updateStudyData;
};

export const getStudyLogs = async (params) => {
  const getStudyLogs = await API.post(
    "/studies/v1/fetch_all_studies_logs",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getStudyLogs;
};

export const updateBlockUsers = async (params) => {
  const updateBlockUsers = await API.post(
    "/institute/v1/institute-blocked-user-update",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return updateBlockUsers;
};

export const updateInHouseUser = async (params) => {
  const updateInHouseUser = await API.post(
    "/institute/v1/institution-inhouse-radiologist-update",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return updateInHouseUser;
};

export const filterInstitutionData = async (params) => {
  const filterInstitutionData = await API.post(
    "/institute/v1/institution_filter",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return filterInstitutionData;
};

export const filterUserData = async (params) => {
  const filterUserData = await API.post(
    "/user/v1/user_filter_data",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return filterUserData;
};

export const getInstitutionLogs = async (params) => {
  const getInstitutionLogs = await API.post(
    "/institute/v1/particular-institution-logs",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getInstitutionLogs;
};

export const getUsersLogs = async (params) => {
  const getUsersLogs = await API.post(
    "/user/v1/fetch-user-logs",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getUsersLogs;
};

export const getParticularUsersLogs = async (params) => {
  const getParticularUsersLogs = await API.post(
    "/user/v1/fetch-particular-user-logs",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getParticularUsersLogs;
};

export const getInitialChatMessages = async (params) => {
  const getInitialChatMessages = await API.post(
    "/chat/v1/fetch_initial_chat_message",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getInitialChatMessages;
};

export const sendChatMessage = async (params) => {
  const sendChatMessage = await API.post(
    "/chat/v1/send_chat",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return sendChatMessage;
};

export const getAllChatList = async (params) => {
  const getAllChatList = await API.post(
    "/chat/v1/fetch_chat_information",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getAllChatList;
};

export const deleteChatMessage = async (params) => {
  const deleteChatMessage = await API.post(
    "/chat/v1/delete_chat",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return deleteChatMessage;
};