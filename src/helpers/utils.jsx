import moment from 'moment'

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
    file.type === "application/pdf" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
  if (formattedDate == 'Invalid date') return '-'
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

export function generateRandomEmail() {
  const domains = ["example.com", "test.com", "random.com", "mail.com"];
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  // Generate random username
  let username = "";
  for (let i = 0; i < 10; i++) {
    username += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Pick a random domain
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return `${username}@${domain}`;
}

export function removeNullValues(obj) {
  // Create a new object without keys having null values
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== null)
  );
}


export const EmailHeaderContent = `
<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {
          font-family: sans-serif;
        }

        .report-page{
          font-family: "Arial", sans-serif;
          margin: 15px; /* Adds margin to all sides of the report */
          padding-bottom: 10px; /* Adds space at the bottom for the disclaimer */
          background-color: #ffffff; /* White background for the report */
          color: #333; /* Dark gray text for easy readability */
          display: flex;
          flex-direction: column;
          min-height: 100vh; /* Ensures the page covers the full height */
        }

        .report-page{
          .table {
            margin-block-start: 0rem !important;
            margin-inline-start: 0px !important;
            margin-left: 0px !important;
          }
        }

        .report-page {
          table {
            border-collapse: separate; /* Use separate to allow border-radius to work */
            border-spacing: 0; /* Remove spacing between cells */
            width: 95%;
            margin-bottom: 20px;
            margin-left: auto;
            margin-right: auto;
            border-radius: 10px; /* Apply border radius to the table */
            overflow: hidden; /* Ensures content inside respects border radius */
            border: 1px solid #7b7b7f; /* Optional: border around the table */
        }

        th, td {
            border: 1px solid #7b7b7f; /* Apply borders to cells */
            padding-top: 10px;
            padding-botton: 10px; 
            padding-left: 6px;
            padding-right: 6px;
        }

        th, td {
            border-right: none;
            border-bottom: none;
        }

        tr th:last-child, tr td:last-child {
            border-right: 1px solid #7b7b7f; /* Add right border to last cell in the row */
        }

        tr:last-child th, tr:last-child td {
            border-bottom: 1px solid #7b7b7f;
          }

          th {
            background-color: #f2f2f2;
          }

          /* Optional: style for alternating row colors */
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          tr:last-child th,
        tr:last-child td {
            border-bottom: none;
        }

        /* Remove right border from cells in the last column */
        th:last-child,
        td:last-child {
            border-right: none;
        }

        /* Remove top border from cells in the first row */
        tr:first-child th,
        tr:first-child td {
            border-top: none;
        }

        /* Remove left border from cells in the first column */
        th:first-child,
        td:first-child {
            border-left: none;
        }
        td:last-child, th:last-child {
            border-right: none;
          }
        }
        .report-header-div{
          height: 80px; 
          width: "100%" ; 
          border-bottom: 1px solid #d1d1d5;
          margin-bottom: 15px;
        }

        .disclaimer-title {
          font-size: 14px; /* Slightly reduced for subtle emphasis */
          font-weight: bold; /* Use 'bold' for better readability */
          text-transform: uppercase; /* Optional: Makes the title stand out */
          margin-bottom: 8px; /* Adds spacing below the title */
          color: #333; /* Neutral color for professional appearance */
        }
                
        .disclaimer-content {
          font-size: 11px; /* Slightly increased for better readability */
          line-height: 1.5; /* Adds spacing between lines for easier reading */
          color: #555; /* Subtle gray for less visual dominance */
          margin-top: 4px; /* Adds spacing above content */
          text-align: justify; /* Aligns content for a cleaner look */
        }

        .disclaimer-section{
          font-size: 12px; /* Standard font size for disclaimer text */
          text-align: center; /* Center the disclaimer text */
          color: #777; /* Lighter gray text for the disclaimer */
          padding: 15px 0;
          border-top: 1px solid #ccc; /* Adds a subtle divider line above the disclaimer */
          position: relative;
          bottom: 0;
          margin-top: 15px;
        }
    </style>
</head>
<body>
<div class = "report-page">
<div class = "report-header-div"></div>
`

export const ReportDesclamierContent = `
<div class = "disclaimer-section">
  <div class = "disclaimer-title">
    Disclaimer
  </div>
  <div class = "disclaimer-content">
    This medical diagnostic report is generated based on the image and patient information obtained from the source of origin, Cloudimts assumes no responsibility for errors or omission of or in the image, or in the contents of the report, which are a direct interpretation of the image sent from source. In no event shall Cloudimts be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of negligence or other tort, arising out of or in connection with the use of the Cloudimts Service or the contents of the Service. This report does not replace professional medical advice, additional diagnoses, or treatment.
</div>
</div>
`


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


export const states = [
  {
    "label": "Andaman & Nicobar",
    "value": "Andaman & Nicobar"
  },
  {
    "label": "Andhra Pradesh",
    "value": "Andhra Pradesh"
  },
  {
    "label": "Arunachal Pradesh",
    "value": "Arunachal Pradesh"
  },
  {
    "label": "Assam",
    "value": "Assam"
  },
  {
    "label": "Bihar",
    "value": "Bihar"
  },
  {
    "label": "Chandigarh",
    "value": "Chandigarh"
  },
  {
    "label": "Chhattisgarh",
    "value": "Chhattisgarh"
  },
  {
    "label": "Dadra & Nagar Haveli",
    "value": "Dadra & Nagar Haveli"
  },
  {
    "label": "Daman & Diu",
    "value": "Daman & Diu"
  },
  {
    "label": "Delhi",
    "value": "Delhi"
  },
  {
    "label": "Goa",
    "value": "Goa"
  },
  {
    "label": "Gujarat",
    "value": "Gujarat"
  },
  {
    "label": "Haryana",
    "value": "Haryana"
  },
  {
    "label": "Himachal Pradesh",
    "value": "Himachal Pradesh"
  },
  {
    "label": "Jammu & Kashmir",
    "value": "Jammu & Kashmir"
  },
  {
    "label": "Jharkhand",
    "value": "Jharkhand"
  },
  {
    "label": "Karnataka",
    "value": "Karnataka"
  },
  {
    "label": "Kerala",
    "value": "Kerala"
  },
  {
    "label": "Lakshadweep",
    "value": "Lakshadweep"
  },
  {
    "label": "Madhya Pradesh",
    "value": "Madhya Pradesh"
  },
  {
    "label": "Maharashtra",
    "value": "Maharashtra"
  },
  {
    "label": "Manipur",
    "value": "Manipur"
  },
  {
    "label": "Meghalaya",
    "value": "Meghalaya"
  },
  {
    "label": "Mizoram",
    "value": "Mizoram"
  },
  {
    "label": "Nagaland",
    "value": "Nagaland"
  },
  {
    "label": "Orissa",
    "value": "Orissa"
  },
  {
    "label": "Pondicherry",
    "value": "Pondicherry"
  },
  {
    "label": "Punjab",
    "value": "Punjab"
  },
  {
    "label": "Rajasthan",
    "value": "Rajasthan"
  },
  {
    "label": "Sikkim",
    "value": "Sikkim"
  },
  {
    "label": "Tamil Nadu",
    "value": "Tamil Nadu"
  },
  {
    "label": "Tripura",
    "value": "Tripura"
  },
  {
    "label": "Uttar Pradesh",
    "value": "Uttar Pradesh"
  },
  {
    "label": "Uttaranchal",
    "value": "Uttaranchal"
  },
  {
    "label": "West Bengal",
    "value": "West Bengal"
  }
];

export const SUPERADMIN_ROLE_NAME = "SuperAdmin";

export const MODALITY_OPTIONS = [
  { label: "Whatsapp", value: "Whatsapp" },
  { label: "MidNight", value: "MidNight" },
  { label: "CR", value: "CR" },
  { label: "CT", value: "CT" },
  { label: "MR", value: "MR" },
  { label: "DX", value: "DX" },
  { label: "SC", value: "SC" },
  { label: "MG", value: "MG" },
  { label: "US", value: "US" },
  { label: "SEG", value: "SEG" },
  { label: "OT", value: "OT" },
  { label: "ECG", value: "ECG" },
  { label: "EPS", value: "EPS" },
  { label: "TG", value: "TG" },
  { label: "SR", value: "SR" },
  { label: "PR", value: "PR" },
  { label: "XA", value: "XA" },
  { label: "RF", value: "RF" },
  { label: "BI", value: "BI" },
  { label: "CD", value: "CD" },
  { label: "DD", value: "DD" },
  { label: "DG", value: "DG" },
  { label: "ES", value: "ES" },
  { label: "LS", value: "LS" },
  { label: "PT", value: "PT" },
  { label: "RG", value: "RG" },
  { label: "ST", value: "ST" },
  { label: "RTIMAGE", value: "RTIMAGE" },
  { label: "RTDOSE", value: "RTDOSE" },
  { label: "RTSTRUCT", value: "RTSTRUCT" },
  { label: "RTPLAN", value: "RTPLAN" },
  { label: "RTRECORD", value: "RTRECORD" },
  { label: "HC", value: "HC" },
  { label: "NM", value: "NM" },
  { label: "IO", value: "IO" },
  { label: "PX", value: "PX" },
  { label: "GM", value: "GM" },
  { label: "SM", value: "SM" },
  { label: "XC", value: "XC" },
  { label: "AU", value: "AU" },
  { label: "HD", value: "HD" },
  { label: "IVUS", value: "IVUS" },
  { label: "OP", value: "OP" },
  { label: "SMR", value: "SMR" },
  { label: "DEFAULT", value: "DEFAULT" }
];
