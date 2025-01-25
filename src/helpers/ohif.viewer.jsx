const OHIF_URL = import.meta.env.VITE_APP_OHIF_VIEWER ;

export function handleOHIFViewer(studyInstanceUID){
    let OHIF_VIEWER_URL = `${OHIF_URL}/viewer?StudyInstanceUIDs=${studyInstanceUID}`
    window.open(OHIF_VIEWER_URL, "_blank") ;
}