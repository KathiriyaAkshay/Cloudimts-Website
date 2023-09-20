import React, { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { Button, Card, Col, Form, Input, Row } from "antd";
import "../../../ckeditor5/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTemplate, insertNewTemplate } from "../../apis/studiesApi";
import NotificationMessage from "../../components/NotificationMessage";

const AddTemplate = () => {
  const [editorData, setEditorData] = useState("");
  const { changeBreadcrumbs } = useBreadcrumbs();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const crumbs = [{ name: "Reports", to: "/reports" }];
    if (id) {
      crumbs.push({
        name: "Edit",
      });
      retrieveTemplateData();
    } else {
      crumbs.push({
        name: "Add",
      });
    }
    changeBreadcrumbs(crumbs);
  }, []);

  const retrieveTemplateData = () => {
    fetchTemplate({ id })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (values) => {
    if (editorData.trim() !== "") {
      insertNewTemplate({ name: values.name, data: editorData })
        .then((res) => {
          NotificationMessage("success", "Template Created Successfully");
          navigate("/reports");
        })
        .catch((err) => console.log(err));
    } else {
      NotificationMessage("warning", "Please enter valid template");
    }
  };

  return (
    <div>
      <Card className="report-template-card">
        <Form
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={30}>
            <Col lg={12} md={12} sm={12}>
              <Form.Item
                label="Template Name"
                name="name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please Enter Template Name",
                  },
                ]}
              >
                <Input placeholder="Enter Template Name" />
              </Form.Item>
            </Col>
            <Col
              lg={12}
              md={12}
              sm={12}
              style={{ height: "calc(100vh - 300px)", overflow: "auto" }}
            >
              <Form.Item label="Create Template">
                <CKEditor
                  editor={ClassicEditor}
                  data={editorData}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                  }}
                />
              </Form.Item>
            </Col>
            <Form.Item className="btn-div">
              <Button onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddTemplate;
