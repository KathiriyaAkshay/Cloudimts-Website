import {
  adminFilterStudyData,
  applyStudySystemFilter,
  fetchSystemFilter,
} from "../apis/studiesApi";
import NotificationMessage from "../components/NotificationMessage";

export const applyMainFilter = async (payload, setStudyData) => {
  await adminFilterStudyData(payload)
    .then((res) => {
      const resData = res?.data?.data?.map((data) => ({
        ...data,
        name: data?.study?.patient_name,
        institution: data?.institution?.name,
        patient_id: data?.study?.patient_id,
        study_id: data?.study?.id,
        key: data?.id,
      }));
      setStudyData(resData);
    })
    .catch((err) => NotificationMessage("warning", err.response.data.message));
};

export const retrieveSystemFilters = async () => {
  const res = await fetchSystemFilter();
  return res.data.data;
};

export const applySystemFilter = async (payload, setStudyData) => {
  await applyStudySystemFilter(payload)
    .then((res) => {
      const resData = res?.data?.data?.map((data) => ({
        ...data,
        name: data?.study?.patient_name,
        institution: data?.institution?.name,
        patient_id: data?.study?.patient_id,
        study_id: data?.study?.id,
        key: data?.id,
      }));
      setStudyData(resData);
    })
    .catch((err) => NotificationMessage("warning", err.response.data.message));
};
