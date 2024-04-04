import { React } from 'react';
import { Modal, Image } from 'antd' ; 
import { Badge } from 'antd';
const BASE_URL = import.meta.env.VITE_APP_BE_ENDPOINT ; 

const ImageDrawer = ({ 
        isDrawerOpen, 
        setImageDrawerOpen, 
        imageList,  
        studyUID
    }) => {

    const OHIFViewerHandler = () => {

        let url = `https://viewer.cloudimts.com/viewer/${studyUID}`;
        window.open(url, "_blank");
      }

    return (
        <Modal
            title='Study series'
            open={isDrawerOpen}
            onOk={() => setImageDrawerOpen(false)}
            onCancel={() => {setImageDrawerOpen(false)}}
            width={1000}
            footer={null}
            centered
        >   
            <div style={{ display: "flex", 
                justifyContent: "left", 
                alignItems: "center", 
                maxWidth:"100%",
                overflowY:"auto", 
                paddingTop: 15 }}>
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >       
                    {imageList.length !== 0 && imageList.map((element) => {
                        return(
                            <div style={{marginRight: 15}}>
                                <Badge count={element.instances} showZero offset={[-18, 12]}>
                                    <img 
                                        onClick={() => {OHIFViewerHandler()}}
                                        id='imageElement'
                                        src= {`${BASE_URL}studies/v1/fetch_instance_image/${element.seriesInstance}`}
                                        width={90}
                                        height={90}
                                    />
                                </Badge>
                            </div>
                        )

                    })}
                                
                </Image.PreviewGroup>
            </div>

        </Modal>
    )
}

export default ImageDrawer;