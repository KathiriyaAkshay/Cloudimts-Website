import { React } from 'react';
import { Modal, Image, Flex, Tag } from 'antd' ; 

const ManulImageDrawer = ({ 
        isDrawerOpen, 
        setImageDrawerOpen, 
        imageList,  
    }) => {
    return (
        <Modal
            title={
                <div style={{ display: 'flex', paddingTop: 5, paddingBottom: 3 }}>
                    <Tag color='#2db7f5'>MANUAL Upload</Tag>
                    <div>
                        Study Image
                    </div>
                </div>
            }
            open={isDrawerOpen}
            onOk={() => setImageDrawerOpen(false)}
            onCancel={() => {setImageDrawerOpen(false)}}
            width={1000}
            footer={null}
            centered
            className='image-manual-upload'
        >   
            <div style={{ 
                display: "flex", 
                justifyContent: "left", 
                alignItems: "center", 
                maxWidth:"100%",
                overflowY:"auto", 
                flexWrap: "wrap"
            }}>
                {imageList.length !== 0 && imageList.map((element) => {
                    return(
                        <div style={{marginRight: 15, marginTop: 20}}>
                            <Image 
                                id='imageElement'
                                src= {element?.image}
                                width={102}
                                height={102}
                            />
                        </div>
                    )

                })}
            </div>

        </Modal>
    )
}

export default ManulImageDrawer;