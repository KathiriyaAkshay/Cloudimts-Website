import { React } from 'react';
import { Modal, Image } from 'antd' ; 

const ManulImageDrawer = ({ 
        isDrawerOpen, 
        setImageDrawerOpen, 
        imageList,  
    }) => {
    return (
        <Modal
            title='Study Images'
            open={isDrawerOpen}
            onOk={() => setImageDrawerOpen(false)}
            onCancel={() => {setImageDrawerOpen(false)}}
            width={1000}
            footer={null}
            centered
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