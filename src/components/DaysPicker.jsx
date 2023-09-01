import { useState } from "react";
import { Checkbox, TimePicker, Row, Col, Form } from "antd";

const DaysPicker = (props) => {
 

  const daysOptions = [
    { label: "Everyday", value: "everyday" },
    {
      label: "Monday",
      value: "monday",
      disabled: props.everydayChecked,
    },
    {
      label: "Tuesday",
      value: "tuesday",
      disabled: props.everydayChecked,
    },
    {
      label: "Wednesday",
      value: "wednesday",
      disabled: props.everydayChecked,
    },
    {
      label: "Thursday",
      value: "thursday",
      disabled: props.everydayChecked,
    },
    {
      label: "Friday",
      value: "friday",
      disabled: props.everydayChecked,
    },
    {
      label: "Saturday",
      value: "saturday",
      disabled: props.everydayChecked,
    },
    {
      label: "Sunday",
      value: "sunday",
      disabled: props.everydayChecked,
    },
  ];

  const handleDaySelection = (checkedValues) => {
    props.setSelectedDays([]);
    if (
      checkedValues != "everyday" &&
      checkedValues !== null &&
      !checkedValues.includes("everyday")
    ) {
      props.setEverydayChecked(false);
      props.setSelectedDays(checkedValues);
    }
    if (checkedValues.includes("everyday")) {
      props.setEverydayChecked(true);
      props.setSelectedDays([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ]);
    }
  };

  return (
    <>
      <Form.Item label="Availability (Day)" name="availabilityOfCategory"  rules={[
          {
            required: true,
            message: "Please enter available days",
          },
        ]}>
        <Checkbox.Group
          options={daysOptions}
          onChange={(checkedValues) => handleDaySelection(checkedValues)}
          value={props.selectedDays}
        />
      </Form.Item>
      <Form.Item
        label="Availability (Time)"
        name="availabilityOfCategoryTime"
        className="category-select"
        rules={[
          {
            required: true,
            message: "Please enter available time",
          },
        ]}
      >
        <TimePicker.RangePicker />
      </Form.Item>
    </>
  );
};

export default DaysPicker;
