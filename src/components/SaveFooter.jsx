import { Row, Button } from "antd";
import { useNavigate } from "react-router";

const SaveFooter = (props) => {
  const navigate = useNavigate();

  return (
    <Row type="flex" justify="end" align="middle">
      <Button className="ghost-btn" onClick={() => navigate(-1)}>
        Cancel
      </Button>
      <Button
        type="primary"
        className="btn-standard"
        // loading={props.button}
        htmlType="submit"
        style={{ marginLeft: "1rem" }}
      >
        Save
      </Button>
    </Row>
  );
};

export default SaveFooter;
