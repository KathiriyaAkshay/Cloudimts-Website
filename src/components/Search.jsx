
import { SearchOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { useState } from "react";

export function Search() {
  const [search, setSearch] = useState("");

  const onSearch = (value) => {
    console.log(value);
    // const temp = value.replace(/\s+/g, " ").toLowerCase();
    // setPagination({
    //   ...Pagination,
    //   search: temp,
    //   page: 1,
    // });
  };

  return (
    <Input
      suffix={
        <Tooltip title="Search">
          <SearchOutlined onClick={() => onSearch(search)} />
        </Tooltip>
      }
      placeholder="Search"
      allowClear
      onChange={(e) => {
        if (e.target.value === "" || e.target.value === null) {
          onSearch("");
        } else {
          setSearch(e.target.value.replace(/\s+/g, " "));
        }
      }}
      onKeyUp={(event) =>
        event.keyCode === 13 ? onSearch(event.target.value) : null
      }
    />
  );
}
