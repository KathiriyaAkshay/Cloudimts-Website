import {
  adminFilterStudyData,
  applyStudySystemFilter,
  fetchSystemFilter,
} from "../apis/studiesApi";
import NotificationMessage from "../components/NotificationMessage";

export const applyMainFilter = async (payload, setStudyData) => {
  await adminFilterStudyData(payload)
    .then((res) => {
      setStudyData(res.data.data);
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
      setStudyData(res.data.data);
    })
    .catch((err) => NotificationMessage("warning", err.response.data.message));
};
