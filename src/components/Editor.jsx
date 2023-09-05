import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useState } from "react";
import "../../ckeditor5/build/ckeditor"

const Editor = () => {
  const [editorData, setEditorData] = useState("");
  return (
    <>
      <div>
        <CKEditor
          editor={ClassicEditor}
          data={editorData}
          // onReady={(editor) => {
          //   editor.plugins.get("FileRepository").createUploadAdapter = (
          //     loader
          //   ) => {
          //     return new UploadAdapter(loader);
          //   };
          // }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log(data);
            setEditorData(data);
          }}
        />
      </div>
      <div>
        <h3>Editor Output:</h3>
        <div dangerouslySetInnerHTML={{ __html: editorData }} />
      </div>
    </>
  );
};

export default Editor;
