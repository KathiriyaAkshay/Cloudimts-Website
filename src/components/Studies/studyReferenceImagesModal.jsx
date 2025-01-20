import { DownloadOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Image, Button, Tooltip, Flex, Space } from "antd";
import React, {useState, useEffect} from "react";

export default function StudyReferenceImagesModal({isModalOpen, handleClose, imageData}){
    console.log("Image data information");
    console.log(imageData);
    
    const [assignStudyDataImages, setAssignStudyDataImages] = useState([]) ; 
    const [assignStudyDataDocuments, setAssignStudyDataDocuments] = useState([]) ; 

    useEffect(() => {
        if (imageData?.length > 0){
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
            const imageUrls = imageData.filter(url => {
                const extension = url.split('.').pop().toLowerCase(); 
                return imageExtensions.includes(extension); 
            });

            setAssignStudyDataImages(imageUrls) ; 

            const nonImageUrls = imageData.filter(url => {
                const extension = url.split('.').pop().toLowerCase(); 
                return !imageExtensions.includes(extension); 
            });

            setAssignStudyDataDocuments(nonImageUrls) ; 

        }
    }, [imageData])
    
    return(
        <Modal
            title = "Patient Data"
            open = {isModalOpen}
            onClose={handleClose}
            centered
            width={"55vw"}
        >
            <div style={{marginTop: 10, marginBottom: 10}}>
                <div>Reference Images</div>
                <Flex wrap = {"wrap"} gap={8} style={{marginTop: 10}}>
                    {assignStudyDataImages && [...assignStudyDataImages, ...assignStudyDataImages]?.map((element) => {
                        return(
                            <div>
                                <Image
                                    src = {element}
                                    className="patient-data-reference-image"
                                />
                                <Flex className="patient-data-download-div">
                                    <DownloadOutlined/>
                                    <div>Download</div>
                                </Flex>
                            </div>
                        )
                    })}
                </Flex>
            </div>
        </Modal>
    )
}