import { React } from 'react';
import { Modal, Image } from 'antd'
const ImageDrawer = ({ isDrawerOpen, setImageDrawerOpen }) => {

    return (
        <Modal
            title='Images'
            open={isDrawerOpen}
            onOk={() => setImageDrawerOpen(false)}
            onCancel={() => {
                setImageDrawerOpen(false)
            }}
            width={1000}
            centered
        >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center",maxWidth:"100%",overflowY:"auto" }}>
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                    <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                    <Image
                        width={200}
                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    />
                    <Image
                        width={200}
                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    /><Image
                        width={200}
                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    /><Image
                        width={200}
                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    /><Image
                        width={200}
                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                    />
                    
                </Image.PreviewGroup>
            </div>

        </Modal>
    )
}

export default ImageDrawer;