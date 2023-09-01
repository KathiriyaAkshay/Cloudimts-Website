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
}

export const getStudyData = async (params) => {
  const getStudyData = await API.post(
    "/studies/v1/fetch_particular_study",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getStudyData;
}

export const getStudyLogsData = async (params) => {
  const getStudyLogsData = await API.post(
    "/studies/v1/fetch_studies_logs",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getStudyLogsData;
}

export const getRadiologistList = async (params) => {
  const getRadiologistList = await API.post(
    "/institute/v1/fetch-radiologist-name",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getRadiologistList;
}

export const postAssignStudy = async (params) => {
  const postAssignStudy = await API.post(
    "/studies/v1/assign_study",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return postAssignStudy;
}

export const updateStudyData = async (params) => {
  const updateStudyData = await API.post(
    "/studies/v1/update_study_details",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return updateStudyData;
}
