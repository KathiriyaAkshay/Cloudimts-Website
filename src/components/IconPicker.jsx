import { Input, Spin } from "antd";
import React, { useEffect, useState } from "react";
import * as icons from "react-icons/gi";
import { SearchOutlined } from "@ant-design/icons";

const IconPicker = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleIconClick = (iconName) => {
    onSelect(iconName);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = () => {
    const filteredIcons = Object.keys(icons).filter((iconName) => {
      return iconName.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredIcons(filteredIcons);
  };

  useEffect(() => {
    filteredData();
  }, [searchQuery]);

  return (
    <>
      <label style={{ fontSize: "16px", fontWeight: "600" }}>Select Icon</label>
      <Input
        placeholder="Search icons..."
        value={searchQuery}
        className="mb"
        style={{ marginTop: "6px" }}
        allowClear
        onChange={handleSearchChange}
        suffix={<SearchOutlined />}
      />
      <Spin spinning={isLoading}>
        <div
          className="icon-picker mb"
          style={{
            maxHeight: "300px",
            overflow: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {filteredIcons.map((iconName) => {
            const Icon = icons[iconName];
            return (
              <div
                key={iconName}
                className="icon-picker__item"
                style={{
                  cursor: "pointer",
                  border: "1px solid #999",
                  padding: "6px",
                  borderRadius: "10px"
                }}
                onClick={() => handleIconClick(iconName)}
              >
                <Icon size={30} />
                {/* <span>{iconName}</span> */}
              </div>
            );
          })}
        </div>
      </Spin>
    </>
  );
};

export default IconPicker;
