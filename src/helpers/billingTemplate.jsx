import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import * as htmlToImage from 'html-to-image';
import { jsPDF } from "jspdf";
import NotificationMessage from "../components/NotificationMessage" ; 
import APIHandler from "../apis/apiHandler";
import html2pdf from 'html2pdf.js';

export const handleDownloadPDF = async (billingData) => {

  // Reporting data 
  let ReportingData = {};

  console.log("Billing data information ==========>");
  console.log(billingData);

  // ====== Filtering data based on Modality information ======= // 

  for (let i = 0; i < billingData.length; i++) {
    let {
      reporting_charge,
      modality_communication_charge,
      midnight_charge,
      modality,
    } = billingData[i];

    console.log("Particular modality inforamtion ==========>");
    console.log(modality);
  
    let reportingCharge = parseInt(reporting_charge); 
    let communicationCharge = parseInt(modality_communication_charge);
    let midnightCharge = parseInt(midnight_charge);
  
    if (reportingCharge !== 0) {

      if (modality in ReportingData) {

        ReportingData[modality] = {
        
          total_object: ReportingData[modality].total_object + 1,
          total_report_charge: reportingCharge + communicationCharge,
          total_midnight_charge: ReportingData[modality].total_midnight_charge + midnightCharge
        };  
        
      } else {

        ReportingData[modality] = {
          total_object: 1,
          total_report_charge: reportingCharge + communicationCharge,
          total_midnight_charge: midnightCharge
        };
        
      }

    }
  } 

  let bill_total_amount_information = 0 ; // Bill total amount information 
  let bill_tax_amount_information = 400 ;  // Bill tax amount information 
  let bill_all_amount_information = 0 ; // Bill final amount information after tax

  // Generate bill total amount 
  Object.keys(ReportingData).forEach((key => {
    ReportingData[key]['total_amount'] = parseInt(parseInt(ReportingData[key]['total_object'])*ReportingData[key]['total_report_charge']) + ReportingData[key]['total_midnight_charge']
    bill_total_amount_information = bill_total_amount_information + ReportingData[key]['total_amount'] ; 
  }))

  bill_all_amount_information = bill_total_amount_information + bill_tax_amount_information ; 

  // Filter data context
  let FilterData = localStorage.getItem("BillingFilterValues") ; 
  FilterData = JSON.parse(FilterData) ;

  if (FilterData?.institution === undefined){
    NotificationMessage("warning", "Not able to generate bill without institution selection") ; 
  } else if (FilterData?.institution.length > 1){
    NotificationMessage("warning", "Not able to generate bill for multiple Institution") ; 
  } else{

    // Fetch Institution Data information 
    let responseData = await APIHandler("POST", {id: FilterData?.institution[0]}, "institute/v1/institution-address" ) ; 
    if (responseData === false){

      NotificationMessage("warning", "Network request failed") ; 
    
    } else if (responseData['status'] !== true){

      NotificationMessage("warning", "Network request failed", responseData['message']) ; 
      
    }

    let BillingStartDate = FilterData['fromdate'] ; 
    let BillingEndDate = FilterData['todate'] ; 
    let ShowBillingEndDate = FilterData['todate'] ; 
    let formattedFutureDate = null ; 
  
    // Convert BillingEndDate to a Date object if it's a string
    if (typeof BillingEndDate === 'string') {
      BillingEndDate = new Date(BillingEndDate);
    }
  
    if (!isNaN(BillingEndDate.getTime())) {
      const futureDate = new Date(BillingEndDate);
      futureDate.setDate(BillingEndDate.getDate() + 30);
  
      const formattedBillingEndDate = BillingEndDate.toISOString().split('T')[0];
      formattedFutureDate = futureDate.toISOString().split('T')[0];
      
    } 
  
    // Create an HTML template with billing data and company logo
    let htmlContent = `
      <html>
      <head>
        <title>Billing</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <style>
  
          body {
            margin-top: 20px;
            background: #87cefa;
          }
  
          .card-footer-btn {
            display: flex;
            align-items: center;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
          }
  
          .text-uppercase-bold-sm {
            text-transform: uppercase !important;
            font-weight: 500 !important;
            letter-spacing: 2px !important;
            font-size: 0.85rem !important;
          }
  
          .hover-lift-light {
            transition: box-shadow 0.25s ease, transform 0.25s ease, color 0.25s ease,
              background-color 0.15s ease-in;
          }
  
          .justify-content-center {
            justify-content: center !important;
          }
  
          .btn-group-lg > .btn,
          .btn-lg {
            padding: 0.8rem 1.85rem;
            font-size: 1.1rem;
            border-radius: 0.3rem;
          }
  
          .btn-dark {
            color: #fff;
            background-color: #1e2e50;
            border-color: #1e2e50;
          }
  
          .card {
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            word-wrap: break-word;
            background-color: #fff;
            background-clip: border-box;
            border: 1px solid rgba(30, 46, 80, 0.09);
            border-radius: 0.25rem;
            box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
          }
  
          .p-5 {
            padding: 3rem !important;
          }
  
          .card-body {
            flex: 1 1 auto;
            padding: 1.5rem 1.5rem;
          }
  
          tbody, td, tfoot, th, thead, tr {
            border-color: inherit;
            border-style: solid;
            border-width: 0;
          }
  
          .table td,
          .table th {
            border-bottom: 0;
            border-top: 1px solid #edf2f9;
          }
  
          .table > :not(caption) > * > * {
            padding: 1rem 1rem;
            background-color: var(--bs-table-bg);
            border-bottom-width: 1px;
            box-shadow: inset 0 0 0 9999px var(--bs-table-accent-bg);
          }
  
          .px-0 {
            padding-right: 0 !important;
            padding-left: 0 !important;
          }
  
          .table thead th,
          tbody td,
          tbody th {
            vertical-align: middle;
          }
  
          tbody,
          td,
          tfoot,
          th,
          thead,
          tr {
            border-color: inherit;
            border-style: solid;
            border-width: 0;
          }
  
          .mt-5 {
            margin-top: 3rem !important;
          }
  
          .icon-circle[class*="text-"] [fill]:not([fill="none"]),
          .icon-circle[class*="text-"] svg:not([fill="none"]),
          .svg-icon[class*="text-"] [fill]:not([fill="none"]),
          .svg-icon[class*="text-"] svg:not([fill="none"]) {
            fill: currentColor !important;
          }
          .svg-icon > svg {
            width: 1.45rem;
            height: 1.45rem;
          }
  
          </style>
      </head>
  
      <body>
      <div id="Billing" class="container mt-6 mb-7">
        <div class="row justify-content-center">
            <div class="col-lg-12 col-xl-7">
              <div id="Billing-information-page" class="card">
                  <div class="card-body p-5">
                    <div className='d-flex col'>
                        <div className='w-75'>
                          <h2>
                            IMAGINET Telesolutions
                          </h2>
                        </div>
                    </div>
                    <div class="border-top border-gray-200 pt-4 mt-4">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="text-muted mb-2" style = "color: #ff3434 !important;">Bill Due date</div>
                            <strong>${formattedFutureDate}</strong>
                          </div>
                          <div class="col-md-3 text-md-end">
                            <div class="text-muted mb-2">Billing Start Date</div>
                            <strong>${BillingStartDate}</strong>
                          </div>
                          <div class="col-md-3 text-md-end">
                            <div class="text-muted mb-2">Billing End Date</div>
                            <strong>${ShowBillingEndDate}</strong>
                          </div>
                        </div>
                        <div class="row" style = "margin-top: 12px;">
                          <div class="col-md-6">
                            <div class="text-muted mb-2">Invoice No.</div>
                          </div>
                        </div>
                    </div>
                    <div class="border-top border-gray-200 mt-4 py-4">
                        <div class="row">
                          <div class="col-md-6">
                              <div class="text-muted mb-2" style="font-weight: bold;">Bill To,</div>
                              <strong>
                              ${responseData?.data?.name},
                              </strong>
                              <p class="fs-sm">
                                ${responseData?.data?.address}, 
                                <br />
                                <span><span style = "font-weight: 600;">Email - </span>${responseData?.data?.email}
                                <span><span style = "font-weight: 600;">Contact  - </span>${responseData?.data?.contact}
                                </span>
                              </p>
                          </div>
                          <div class="col-md-6 text-md-end">
                              <div class="text-muted mb-2">Account Details For Fund Transfer</div>
                              <strong>
                              123454667689
                              </strong>
                              <p class="fs-sm">
                                BARB0ABCX
                                <br />
                                <a href="#!" class="text-purple">themes@email.com
                                </a>
                              </p>
                              <p>KOTAK MAHINDRA</p>
                          </div>
                        </div>
                    </div>
                    <table class="table border-bottom border-gray-200 mt-3">
                        <thead>
                          <tr>
                              <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style = "width: 30%;">Description</th>
                              <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style = "text-align: center;">No Of <br>Cases</th>
                              <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style = "text-align: center;">Reporting <br>charge</th>
                              <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style = "text-align: center;">Total <br>Midnight <br>charge</th>
                              <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style = "text-align: center;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
      `
      Object.keys(ReportingData).forEach(key  => {
        let reportStudyData = ReportingData[key] ; 
        htmlContent = htmlContent + `
          <tr>
            <td class="px-0" style = "width: 30%;">${key} reporting charges repoting charges </td>
            <td class="px-0" style = "text-align: center;">${reportStudyData['total_object']}</td>
            <td class="px-0" style = "text-align: center;">₹${reportStudyData['total_report_charge']}/-</td>
            <td class="px-0" style = "text-align: center;">${reportStudyData['total_midnight_charge']}</td>
            <td class="px-0" style = "text-align: center; font-weight: bold;">₹${reportStudyData['total_amount']}/-</td>
          </tr>
        `
      })
      htmlContent = htmlContent + `
                
                        </tbody>
                    </table>
                    <div className='d-flex col justify-content-between'>
                        <div class="mt-5">
                          <div class="d-flex justify-content-end">
                              <p class="text-muted me-3" style = "font-weight: bold ; ">Subtotal:</p>
                              <span>₹${bill_total_amount_information}/-</span>
                          </div>
                          <div class="d-flex justify-content-end">
                              <p class="text-muted me-3" style = "font-weight: bold; ">Tax:</p>
                              <span>₹${bill_tax_amount_information}/-</span>
                          </div>
                          <div class="d-flex justify-content-end mt-3">
                              <h5 class="me-3">Due amount:</h5>
                              <h5 class="text-success">₹${bill_all_amount_information}/-</h5>
                          </div>
                        </div>
                    </div>
                  </div>
                  <p class="fs-sm" style = "margin-left:auto; margin-right:auto;">
                    Thank You for your Prompt Payment!
                  </p>
              </div>
            </div>
        </div>
      </div>
      </body>
      </html>
    `;
  
    // Create a new window/tab to display the HTML content
    const newWindow = window.open("", "_blank");
    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  
    newWindow.onload = function () {
      htmlToImage.toPng(newWindow.document.getElementById('Billing-information-page'), { quality: 0.95 })
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = 'my-image-name.jpeg';
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save("download.pdf");
        });
    };
  }

};

// Handle data to export option handler 
export const handleExport = (tableData) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  const sheetName = "BillingData";

  const sheetNameValue = prompt("Enter Excel sheet name:"); 
  let excelTempData = [] ; 

  tableData.map((element) => {
    excelTempData.push(
      {
        "Id" : element?.id, 
        "Patient id": element?.patient_id, 
        "Patient name": element?.patient_name, 
        "Reference id": element?.reference_id, 
        "Modality": element?.modality, 
        "Institution": element?.institution, 
        "Study description" : element?.study_description, 
        "Report description": element?.reporting_study_description, 
        "Study Date/Time": element?.study_date, 
        "Reporting Date/Time": element?.reporting_time, 
        "Status": element?.study_status, 
        "Reported by": element?.reported_by, 
        "Reporting charge": element?.reporting_charge, 
        "Communication charge": element?.comunication_charge, 
        "Midnight charge": element?.midnight_charge, 
        "Charge": parseInt(element?.reporting_charge) + parseInt(element?.comunication_charge) + parseInt(element?.midnight_charge)
      }
    )
  })

  // Convert your data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelTempData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate a blob from the workbook
  const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a blob from the ArrayBuffer
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a unique file name
  const fileName = `${sheetNameValue}.xlsx`;

  // Save the file using file-saver
  saveAs(blob, fileName);
};

export const handlePdfExport=(tableData)=>{

  var html=`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple and Good Looking Table</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f2f2f2;
    }

    tr:hover {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>


<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Patient ID</th>
      <th>Patient Name</th>      
      <th>Reference ID</th>
      <th>Modality</th>
      <th>Institution</th>
      <th>Study Description</th>
      <th>Report description</th>
      <th>Study Date/Time</th>
      <th>Reporting Date/Time</th>
      <th>Status</th>
      <th>Reported By</th>
      <th>Reporting Charge</th>
      <th>Communication Charge</th>
      <th>Midnight Charge</th>
      <th>Charge</th>
    </tr>
  </thead>
  <tbody>`

  
  tableData.map((element) => {
    html+=
    `
    <tr>
  <td>${element?.id}</td>
  <td>${element?.patient_id}</td>
  <td>${element?.patient_name}</td>      
  <td>${element?.reference_id}</td>
  <td>${element?.modality}</td>
  <td>${element?.institution}</td>
  <td>${element?.study_description}</td>
  <td>${element?.reporting_study_description}</td>
  <td>${element?.study_date}</td>
  <td>${element?.reporting_time}</td>
  <td>${element?.study_status}</td>
  <td>${element?.reported_by}</td>
  <td>${element?.reporting_charge}</td>
  <td>${element?.comunication_charge}</td>
  <td>${element?.midnight_charge}</td>
  <td>${parseInt(element?.reporting_charge) + parseInt(element?.comunication_charge) + parseInt(element?.midnight_charge)}</td>
</tr>
    `
  })


html+=` </tbody>
</table>

</body>
</html>`


const pdfOptions = {
  filename: 'document.pdf',
  html2canvas: {
    scale: 2,
    logging: false,
    
    scrollY: 0,
    width: 1650
  },
  // jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'portrait' },
};

html2pdf().set(pdfOptions).from(html).save();

  
}