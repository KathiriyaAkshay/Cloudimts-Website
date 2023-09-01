
import { Button} from "antd";
import { PlusOutlined } from '@ant-design/icons';

export function AddButton(props) {
  return (
    <Button
      onClick={() => props.push()} 
      className="add-btn "
    >
      <span><PlusOutlined/></span>{props.title}
    </Button>
  );
}
