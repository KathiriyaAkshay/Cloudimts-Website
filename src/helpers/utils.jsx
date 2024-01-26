import moment from 'moment'

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const dummyRequest = ({ file, onSuccess, onError }) => {

  console.log("File type informaiton ========>");
  console.log(file.type);

  if (
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "application/pdf" 
  ) {
    if (file.size > 1024 * 1024 * 5) {
      onError(null, "Please select image smaller than 5 MB");
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
export const convertToDDMMYYYY = time => {
  // Parse the input date and time using moment
  const momentObject = moment(time, 'YYYY-MM-DD HH:mm:ss')

  // Format the moment object to "DD-MM-YYYY" format
  const formattedDate = momentObject.format('DD-MM-YYYY HH: mm: ss')
  if(formattedDate=='Invalid date') return '-'
  return formattedDate
}

export const modifyDate = data => {
  return data.map(item => {
    return {
      ...item,
      created_at: convertToDDMMYYYY(item?.created_at),
      updated_at: convertToDDMMYYYY(item?.updated_at)
    }
  })
}


export const descriptionOptions = [
  { label: "Abdomen", value: "Abdomen" },
  { label: "Abdomen-KUB", value: "Abdomen-KUB" },
  { label: "Abdomen and Pelvis", value: "Abdomen and Pelvis" },
  { label: "Ankle", value: "Ankle" },
  { label: "Ankle RL", value: "Ankle RL" },
  { label: "Arm", value: "Arm" },
  { label: "Barium Studies", value: "Barium Studies" },
  { label: "Brachial Plexus", value: "Brachial Plexus" },
  { label: "Brain", value: "Brain" },
  { label: "Brain Angio", value: "Brain Angio" },
  { label: "Brain MRA MRV", value: "Brain MRA MRV" },
  { label: "Brain with Screening", value: "Brain with Screening" },
  { label: "Breast MRI", value: "Breast MRI" },
  { label: "CHEST-COVID", value: "CHEST-COVID" },
  { label: "CHEST-COVID-NORMAL", value: "CHEST-COVID-NORMAL" },
  { label: "CV Junction", value: "CV Junction" },
  { label: "Cervical Spine", value: "Cervical Spine" },
  {
    label: "Cervical Spine with Screening",
    value: "Cervical Spine with Screening",
  },
  { label: "Chest", value: "Chest" },
  { label: "Chest - PA and Lateral", value: "Chest - PA and Lateral" },
  { label: "Chest - Single View", value: "Chest - Single View" },
  { label: "Elbow", value: "Elbow" },
  { label: "Elbow RL", value: "Elbow RL" },
  { label: "Facial Bones", value: "Facial Bones" },
  { label: "Femal Pelvis", value: "Femal Pelvis" },
  { label: "Femur RL", value: "Femur RL" },
  { label: "Fingers", value: "Fingers" },
  { label: "Fingers RL", value: "Fingers RL" },
  { label: "Fistulogram", value: "Fistulogram" },
  { label: "Foot", value: "Foot" },
  { label: "Foot RL", value: "Foot RL" },
  { label: "Forearm RL", value: "Forearm RL" },
  { label: "HIP RL", value: "HIP RL" },
  { label: "HIP and Pelvis", value: "HIP and Pelvis" },
  { label: "HRCT Lungs", value: "HRCT Lungs" },
  { label: "HSG", value: "HSG" },
  { label: "Hand", value: "Hand" },
  { label: "Hand RL", value: "Hand RL" },
  { label: "Hips", value: "Hips" },
  { label: "Humerus RL", value: "Humerus RL" },
  { label: "IVP", value: "IVP" },
  { label: "Inner Ear", value: "Inner Ear" },
  { label: "Knee", value: "Knee" },
  { label: "Knee RL", value: "Knee RL" },
  { label: "Leg", value: "Leg" },
  { label: "Lower Leg RL", value: "Lower Leg RL" },
  { label: "Lumbar Spine", value: "Lumbar Spine" },
  {
    label: "Lumbar Spine with Screening",
    value: "Lumbar Spine with Screening",
  },
  { label: "MCU", value: "MCU" },
  { label: "MR Angiogram", value: "MR Angiogram" },
  { label: "MR Spectroscopy", value: "MR Spectroscopy" },
  { label: "MR Venogram", value: "MR Venogram" },
  { label: "MRCP", value: "MRCP" },
  { label: "Mammogram", value: "Mammogram" },
  { label: "Mandible", value: "Mandible" },
  { label: "Nasal Bones", value: "Nasal Bones" },
  { label: "Neck", value: "Neck" },
  { label: "Orbits", value: "Orbits" },
  { label: "Pelvic Bones", value: "Pelvic Bones" },
  { label: "Pelvis", value: "Pelvis" },
  { label: "Peripheral Angio", value: "Peripheral Angio" },
  { label: "SL Joints", value: "SL Joints" },
  { label: "Sacrum and Coccyx", value: "Sacrum and Coccyx" },
  { label: "Shoulder", value: "Shoulder" },
  { label: "Shoulder RL", value: "Shoulder RL" },
  { label: "Sinuses", value: "Sinuses" },
  { label: "Skull", value: "Skull" },
  { label: "Skull Base", value: "Skull Base" },
  { label: "TMJ", value: "TMJ" },
  { label: "Temporal Bone", value: "Temporal Bone" },
  { label: "Thigh", value: "Thigh" },
  { label: "Thoracic Spine", value: "Thoracic Spine" },
  {
    label: "Thoracic Spine with Screening",
    value: "Thoracic Spine with Screening",
  },
  { label: "Toes RL", value: "Toes RL" },
  { label: "Whole Spine", value: "Whole Spine" },
  { label: "Whole Spine with Screening", value: "Whole Spine with Screening" },
  { label: "Wrist", value: "Wrist" },
  { label: "Wrist RL", value: "Wrist RL" },
];
