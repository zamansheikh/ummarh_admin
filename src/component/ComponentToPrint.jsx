/* eslint-disable react/display-name */
import React from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { data } = props;

  return (
    <div ref={ref}>
      <div
        className="ql-editor"
        style={{ margin: 10 }}
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
});
