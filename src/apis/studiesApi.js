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
  const filterUserData = await API.post("/user/v1/user_filter_data", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
  const getUsersLogs = await API.post("/user/v1/fetch-user-logs", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
  const sendChatMessage = await API.post("/chat/v1/send_chat", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
  const deleteChatMessage = await API.post("/chat/v1/delete_chat", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return deleteChatMessage;
};

export const emailFilterData = async (params) => {
  const emailFilterData = await API.post("/email/v1/email-filter", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return emailFilterData;
};

export const getInstitutionList = async (params) => {
  const getInstitutionList = await API.get("/user/v1/fetch-institution-list", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return getInstitutionList;
};

export const getModalityList = async (params) => {
  const getModalityList = await API.get("/institute/v1/institute-modality", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return getModalityList;
};

export const createNewFilter = async (params) => {
  const createNewFilter = await API.post(
    "/studies/v1/insert-new-filter",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return createNewFilter;
};

export const getFilterList = async (params) => {
  const getFilterList = await API.post(
    "/studies/v1/fetch-filter-list",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getFilterList;
};

export const filterStudyData = async (params) => {
  const filterStudyData = await API.post(
    "/studies/v1/study-quick-filter",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return filterStudyData;
};

export const getParticularFilter = async (params) => {
  const getParticularFilter = await API.post(
    "/studies/v1/particular-filter-fetch",
    params,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return getParticularFilter;
};

export const updateFilterData = async (params) => {
  const updateFilterData = await API.post("/studies/v1/edit-filter", params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return updateFilterData;
};

export const sendMediaChat = async (params) => {
  const sendMediaChat = await API.post("/chat/v1/send_chat_media", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return sendMediaChat;
};

export const getInstanceData = async (params) => {
  const getInstanceData = await API.post("/studies/v1/getSeriesInfo", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return getInstanceData;
};

export const getStudyImages = async (params) => {
  const getStudyImages = await API.get(
    `/studies/v1/fetch_instance_image/${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return getStudyImages;
};

export const getBillingData = async (params) => {
  const getBillingData = await API.post(
    "/billing/v1/fetch-billing-info",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return getBillingData;
};

export const getReportList = async (params) => {
  const getReportList = await API.post("/report/v1/getReportlist", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return getReportList;
};

export const insertNewTemplate = async (params) => {
  const insertNewTemplate = await API.post("/report/v1/insert-report", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return insertNewTemplate;
};

export const fetchTemplate = async (params) => {
  const fetchTemplate = await API.post(
    "/report/v1/particularReportData",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return fetchTemplate;
};

export const fetchPermissions = async (params) => {
  const fetchPermissions = await API.post(
    "/role/v1/fetch_particular_role_permission",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return fetchPermissions;
};

export const getDashboardData = async (params = {}) => {
  const getDashboardData = await API.post(
    "/dashboard/v1/fetch-dashboard-details",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return getDashboardData;
};

export const getDashboardTableData = async (params = {}) => {
  const getDashboardTableData = await API.post(
    "/dashboard/v1/fetch-dashboard-logs",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return getDashboardTableData;
};

export const updateStudyStatus = async (params = {}) => {
  const updateStudyStatus = await API.post("/studies/v1/view_study", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return updateStudyStatus;
};

export const uploadImage = async (params = {}) => {
  const uploadImage = await API.post("/image/v1/upload", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return uploadImage;
};

export const submitNormalReportFile = async (params = {}) => {
  const submitNormalReportFile = await API.post(
    "/studies/v1/normal-report-file",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return submitNormalReportFile;
};

export const fetchRoleLogs = async (params = {}) => {
  const fetchRoleLogs = await API.post(
    "/role/v1/user_role_logs_filter",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return fetchRoleLogs;
};

export const deleteEmail = async (params = {}) => {
  const deleteEmail = await API.post("/email/v1/delete-email", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return deleteEmail;
};

export const instituteLogsFilter = async (params = {}) => {
  const instituteLogsFilter = await API.post(
    "/institute/v1/filter-institution-logs",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return instituteLogsFilter;
};

export const userLogsFilter = async (params = {}) => {
  console.log(params);
  const userLogsFilter = await API.post("/user/v1/user_logs_filter", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return userLogsFilter;
};

export const fetchAssignStudy = async (params = {}) => {
  const fetchAssignStudy = await API.post(
    "/studies/v1/fetch_assign_study_details",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return fetchAssignStudy;
};

export const updateUserPassword = async (params = {}) => {
  const updateUserPassword = await API.post(
    "/owner/v1/update_password",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return updateUserPassword;
};

export const fetchEmailList = async (params = {}) => {
  const fetchEmailList = await API.post("/email/v1/send-email-list", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return fetchEmailList;
};

export const fetchAuth = async (params = {}) => {
  const fetchAuth = await API.post("/owner/v1/user_details_fetch", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return fetchAuth;
};

export const enableUser = async (params = {}) => {
  const enableUser = await API.post("/user/v1/enable-user", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return enableUser;
};

export const disableUser = async (params = {}) => {
  const disableUser = await API.post("/user/v1/disable-user", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return disableUser;
};

export const downloadBilling = async (params = {}) => {
  const downloadBilling = await API.post(
    "/billing/v1/fetch-billing-info",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return downloadBilling;
};

export const enableInstitution = async (params = {}) => {
  const enableInstitution = await API.post(
    "/institute/v1/institution-enable",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return enableInstitution;
};

export const disableInstitution = async (params = {}) => {
  const disableInstitution = await API.post(
    "/institute/v1/institution-disable",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return disableInstitution;
};

export const updateStudyStatusReported = async (params = {}) => {
  const updateStudyStatusReported = await API.post(
    "/studies/v1/report_study",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return updateStudyStatusReported;
};

export const closeStudy = async (params = {}) => {
  const closeStudy = await API.post("/studies/v1/closed-study", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return closeStudy;
};

export const deleteStudy = async (params = {}) => {
  const deleteStudy = await API.post("/studies/v1/delete_study", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return deleteStudy;
};

export const addSupport = async (params = {}) => {
  const addSupport = await API.post(
    "/support/v1/insert-support-option",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return addSupport;
};

export const fetchSupport = async (params = {}) => {
  const fetchSupport = await API.post(
    "/support/v1/support-details-fetch",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return fetchSupport;
};

export const deleteSupport = async (params = {}) => {
  const deleteSupport = await API.post(
    "/support/v1/support-details-delete",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return deleteSupport;
};

export const updateReport = async (params = {}) => {
  const updateReport = await API.post("/report/v1/updateReportData", params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return updateReport;
};

export const fetchParticularSupport = async (params = {}) => {
  const fetchParticularSupport = await API.post(
    "/support/v1/fetch-particular-support-details",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return fetchParticularSupport;
};

export const updateParticularSupport = async (params = {}) => {
  const updateParticularSupport = await API.post(
    "/support/v1/support-details-edit",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return updateParticularSupport;
};

export const fetchUserSignature = async (params = {}) => {
  const fetchUserSignature = await API.post(
    "/studies/v1/fetch-user-signature",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return fetchUserSignature;
};

export const saveAdvancedFileReport = async (params = {}) => {
  const saveAdvancedFileReport = await API.post(
    "/studies/v1/advanced-file-report",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return saveAdvancedFileReport;
};

export const downloadAdvancedFileReport = async (params = {}) => {
  const downloadAdvancedFileReport = await API.post(
    "/studies/v1/download_report_data",
    params,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return downloadAdvancedFileReport;
};
