export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const dummyRequest = ({ file, onSuccess, onError }) => {
  if (
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "video/mp4" ||
    file.type === "image/svg+xml"
  ) {
    if (file.size > 1024 * 1024 * 3) {
      onError(null, "Please select image smaller than 3 MB");
    } else {
      onSuccess("ok");
    }
  } else {
    onError(null, "Select Image file only");
  }
};

export function getElapsedTime(dt1) {
  const dt2 = new Date();
  const diff = (dt2.getTime() - dt1.getTime()) / 1000;
  const min = Math.abs(Math.round(diff / 60));
  if (min < 1) {
    return "Now";
  }
  if (min < 60) {
    return `${min}m ago`;
  }
  const hour = Math.abs(Math.round(min / 60));
  if (hour < 24) {
    return `${hour}h ago`;
  }
  const day = Math.abs(Math.round(hour / 24));
  if (day <= 7) {
    return `${day}d ago`;
  }
  if (day > 7) {
    const dateArr = dt1.toDateString().split(" ") || [];
    return `${dateArr[2]} ${dateArr[1]}`;
  }
}

export const chatSettingPopUp = [
  {
    name: "Search",
  },
  {
    name: "Clear History",
  },
  // {
  //   name: "Delete Chat",
  // },
];
