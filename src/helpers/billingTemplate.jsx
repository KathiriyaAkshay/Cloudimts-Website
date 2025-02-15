import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import * as htmlToImage from 'html-to-image';
import { jsPDF } from "jspdf";
import NotificationMessage from "../components/NotificationMessage";
import APIHandler from "../apis/apiHandler";
import logo from "../assets/images/Imageinet-logo.png";
import html2pdf from 'html2pdf.js';

export const handleDownloadPDF = async (billingData) => {

  // Reporting data 
  let ReportingData = {};

  // ====== Filtering data based on Modality information ======= // 

  for (let i = 0; i < billingData.length; i++) {
    let {
      reporting_charge,
      modality_communication_charge,
      midnight_charge,
      modality,
    } = billingData[i];

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

  let bill_total_amount_information = 0; // Bill total amount information 
  let bill_tax_amount_information = 400;  // Bill tax amount information 
  let bill_all_amount_information = 0; // Bill final amount information after tax

  // Generate bill total amount 
  Object.keys(ReportingData).forEach((key => {
    ReportingData[key]['total_amount'] = parseInt(parseInt(ReportingData[key]['total_object']) * ReportingData[key]['total_report_charge']) + ReportingData[key]['total_midnight_charge']
    bill_total_amount_information = bill_total_amount_information + ReportingData[key]['total_amount'];
  }))

  bill_all_amount_information = bill_total_amount_information + bill_tax_amount_information;

  // Filter data context
  let FilterData = localStorage.getItem("BillingFilterValues");
  FilterData = JSON.parse(FilterData);

  if (FilterData?.institution === undefined) {
    NotificationMessage("warning", "Not able to generate bill without institution selection");
  } else if (FilterData?.institution.length > 1) {
    NotificationMessage("warning", "Not able to generate bill for multiple Institution");
  } else {

    // Fetch Institution Data information 
    let responseData = await APIHandler("POST", { id: FilterData?.institution[0] }, "institute/v1/institution-address");
    if (responseData === false) {

      NotificationMessage("warning", "Network request failed");

    } else if (responseData['status'] !== true) {

      NotificationMessage("warning", "Network request failed", responseData['message']);

    }

    let BillingStartDate = FilterData['fromdate'];
    let BillingEndDate = FilterData['todate'];
    let ShowBillingEndDate = FilterData['todate'];
    let formattedFutureDate = null;

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
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
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
    
        .btn-group-lg>.btn,
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
    
        .table td,
        .table th {
          border-bottom: 0;
          border-top: 1px solid #edf2f9;
        }
    
        .table> :not(caption)>*>* {
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
    
        .svg-icon>svg {
          width: 1.45rem;
          height: 1.45rem;
        }
      </style>
    </head>
    
    <body>
      <div id="Billing" class="container mt-6 mb-7">
        <div class="row justify-content-center">
          <div class="col-lg-12 col-xl-9">
            <div id="Billing-information-page" class="card">
              <div class="card-body p-5">
                <div class="d-flex col">
                  <div class="w-100 d-flex flex-row align-items-center">
                    <h5 class="w-75">
                      Service bill for the month of November 2023
                    </h5>
                    <div class="w-25">
                      <img src="${logo}" alt="" height="120px" width="200px">
                    </div>
                  </div>
                </div>
                <div class="border-top border-gray-200 pt-4 mt-4 d-flex flex-row">
                  <div class="w-50" style="color:#000000">
                    <div class="fw-semibold" style="color:#000000">IMAGAEINET TELESOLUTIONS</div>
                    <div>CHENNAI</div>
                    <div>Tamilnadu - India</div>
                    <div>Contact Number - 9500023546</div>
                    <div>abd@gmail.com</div>
                    <div class="fw-semibold" style="color:#000000"> PAN : ARQERF2534</div>
                  </div>
                  <div class="w-50 d-flex flex-column align-items-end justify-content-evenly fw-semibold"
                    style="font-size:0.9rem;">
                    <div class="border-bottom w-100 d-flex flex-row align-items-end justify-content-evenly">
                      <span class="w-50">BILL DATE:</span>
                      <span class="w-50">12/02/2002</span>
                    </div>
                    <div class="border-bottom w-100 d-flex flex-row align-items-end justify-content-evenly">
                      <span class="w-50">INVOICE NUMBER:</span>
                      <span class="w-50">12315</span>
                    </div>
                    <div class="border-bottom w-100 d-flex flex-row align-items-end justify-content-around">
                      <span class="w-50">BILL DATE:</span>
                      <span class="w-50">12/02/2002</span>
                    </div>
                  </div>
                </div>
                <!-- <div class="border-top border-gray-200 pt-4 mt-4">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="text-muted mb-2" style="color: #ff3434 !important;">Bill Due date</div>
                      <strong>2024-03-29</strong>
                    </div>
                    <div class="col-md-3 text-md-end">
                      <div class="text-muted mb-2">Billing Start Date</div>
                      <strong>2000-02-01</strong>
                    </div>
                    <div class="col-md-3 text-md-end">
                      <div class="text-muted mb-2">Billing End Date</div>
                      <strong>2024-02-28</strong>
                    </div>
                  </div>
                  <div class="row" style="margin-top: 12px;">
                    <div class="col-md-6">
                      <div class="text-muted mb-2">Invoice No.</div>
                    </div>
                  </div>
                </div> -->
                <div class="border-gray-200 mt-4 py-4">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="text-muted mb-2 border-bottom" style="font-weight: bold;">Bill To,</div>
                      <strong>
                        ST MARY'S SCAN CENTRE
                      </strong>
                      <div>
                        PULIANGUDI
                      </div>
    
                      <div>
                        TAMILNADU
                      </div>
                      <div>
                        9444109313
                      </div>
                      <div>
                        email@gmail.com
                      </div>
                      <!-- <p class="fs-sm">
                        
                        <br>
                        <span><span style="font-weight: 600;">Email - </span>reports@cloudimts.com
                          <span><span style="font-weight: 600;">Contact - </span>
                          </span>
                        </span>
                      </p> -->
                    </div>
                    <div class="col-md-6 text-md-start " style="font-size:0.9rem;">
                      <div class="text-muted mb-2 border-bottom" style="font-weight: bold;">Account Details For Fund
                        Transfer</div>
                      <div>
                        <strong>
                          Account Details : IMAGEINET TELESOLUTIONS
                        </strong>
                      </div>
                      <div>
                        <strong>
                          A/C No: 39592518111
                        </strong>
                      </div>
                      <div>
                      <strong>
                        IFSC : SBIN0016545
                      </strong>
                      </div>
                      <div>
                      <strong>
                        Branch : Kilkattalai
                      </strong>
                      </div>
                    </div>
                  </div>
                </div>
                <table class="table border-bottom border-gray-200 mt-3">
                  <thead>
                    <tr>
                      <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style="width: 30%;">Description
                      </th>
                      <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style="text-align: center;">No Of
                        <br>Cases
                      </th>
                      <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style="text-align: center;">
                       Price
                  
                      <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0" style="text-align: center;">Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
      `
    Object.keys(ReportingData).forEach(key => {
      let reportStudyData = ReportingData[key];
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

      <div class="d-flex flex-row justify-content-between mt-3 w-100">
      <div class="w-50" style="font-size: small;font-weight: 500;">
        <div>Important Information</div>
        <div>
          1. Imageinet Telesolutuons is only a communication service provider and will not be responsible for the content of the radiologist's Report.
          2. Bill Receipt: You are billed on a monthly basis. In case you do not receive bill on time, please call 9500067654 and we will tell you the amount payable and arrange to send you a duplicate bill. Non - receipt of bill would not affect your obligations to pay the bill before due date.
          3. Variations, if any, should be informed within 48 hours of receipt of electronic invoice; else it would be deemed to have been accepted by the customer and payment will have to be made as per the invoice within the due date.
        </div>
      </div>
      <div class="d-flex w-50 justify-content-between" style="font-size: 0.9rem;">
        <div class="w-100">
          <div class="d-flex justify-content-end">
            <p class="text-muted text-end me-3 w-75" style="font-weight: bold; ">Subtotal:</p>
            <span class="w-25">₹0/-</span>
          </div>
          <div class="d-flex justify-content-end">
            <p class="text-muted text-end me-3 w-75" style="font-weight: bold ; ">Discount:</p>
            <span class="w-25">₹0/-</span>
          </div>
          <div class="d-flex justify-content-end">
            <p class="text-muted text-end me-3 w-75" style="font-weight: bold ; ">Subtotal Less Discount:</p>
            <span class="w-25">₹0/-</span>
          </div>
          <div class="d-flex justify-content-end">
            <p class="text-muted text-end me-3 w-75" style="font-weight: bold; ">Tax Rate:</p>
            <span class="w-25">₹400/-</span>
          </div>
          <div class="d-flex justify-content-end">
            <p class="text-muted text-end me-3 w-75" style="font-weight: bold; ">Total Tax:</p>
            <span class="w-25">₹400/-</span>
          </div>
          <div class="d-flex justify-content-end">
            <p class="text-muted text-end me-3 w-75" style="font-weight: bold; ">Outstanding:</p>
            <span class="w-25">₹400/-</span>
          </div>
          <div class="d-flex justify-content-end mt-3">
            <h5 class="me-3 w-75 text-end">Due amount:</h5>
            <h5 class="text-success w-25">₹400/-</h5>
          </div>
        </div>
      </div>
    </div>

     
    </div>
    <p class="fs-sm" style="margin-left:auto; margin-right:auto;">
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
  let excelTempData = [];

  tableData.map((element) => {
    if (element.study_status != "Deleted")
      excelTempData.push(
        {
          "Id": element?.id,
          "Patient id": element?.patient_id,
          "Patient name": element?.patient_name,
          "Reference id": element?.reference_id,
          "Modality": element?.modality,
          "Institution": element?.institution,
          "Study description": element?.study_description,
          "Clinical history": element?.study_history, 
          "Report description": element?.reporting_study_description,
          "Study Date/Time": element?.study_date,
          "Reporting Date/Time": element?.reporting_time,
          "Status": element?.study_status,
          "Reported by": element?.reported_by,
          "Turn around": element?.turn_around_time, 
          "Charge": ((parseFloat(element?.reporting_charge) || 0) + (parseFloat(element?.comunication_charge) || 0) + (parseFloat(element?.midnight_charge) || 0)).toFixed(2)
        }
      )
  })

  // // Convert your data to worksheet
  // const worksheet = XLSX.utils.json_to_sheet(excelTempData);

  // // Add the worksheet to the workbook
  // XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // // Generate a blob from the workbook
  // const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // // Create a blob from the ArrayBuffer
  // const blob = new Blob([arrayBuffer], {
  //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // });

  // // Create a unique file name
  // const fileName = `${sheetNameValue}.xlsx`;

  // // Save the file using file-saver
  // saveAs(blob, fileName);

  // Convert your data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelTempData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size the columns based on content
  const colSizes = excelTempData.reduce((acc, row) => {
      Object.keys(row).forEach(key => {
          const len = String(row[key]).length;
          acc[key] = Math.max(acc[key] || 0, len);
      });
      return acc;
  }, {});

  Object.keys(colSizes).forEach(col => {
      const width = colSizes[col] + 2; // Add some extra width
      worksheet['!cols'] = worksheet['!cols'] || [];
      worksheet['!cols'].push({ wch: width });
  });

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

export const handlePdfExport = (tableData) => {
  const pdfName = prompt("Enter PDF sheet name:");
  var html = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }

        table {
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        th, td {
          padding: 5px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #33b3e9;
          color: #ffffff; 
        }

        tr:hover {
          background-color: #f2f2f2;
        }

        th:nth-child(1), td:nth-child(1) { width: 8%; } /* Reference ID */
        th:nth-child(2), td:nth-child(2) { width: 10%; } /* Patient ID */
        th:nth-child(3), td:nth-child(3) { width: 10%; } /* Patient Name */
        th:nth-child(4), td:nth-child(4) { width: 5%; } /* Modality */
        th:nth-child(5), td:nth-child(5) { width: 10%; } /* Institution */
        th:nth-child(6), td:nth-child(6) { width: 10%; } /* Study Description */
        th:nth-child(7), td:nth-child(7) { width: 10%; } /* Report Description */
        th:nth-child(8), td:nth-child(8) { width: 10%; } /* Clinical history */

        th:nth-child(9), td:nth-child(9) { width: 5%; } /* Study Date/Time */
        th:nth-child(10), td:nth-child(10) { width: 5%; } /* Reporting Date/Time */
        th:nth-child(11), td:nth-child(11) { width: 4%; } /* Status */
        th:nth-child(12), td:nth-child(12) { width: 5%; } /* Reported By */
        th:nth-child(13), td:nth-child(13) { width: 4%; } /* Turn around */
        th:nth-child(14), td:nth-child(14) { width: 10%; } /* Charge */
        
      </style>
    </head>
    <body>
      <div style="margin-left:auto; margin-right:auto; width: 1400px ;">
        <h2 style="margin:20px 0px;  text-align: center;">Cloudimts</h2>
      </div>
    <table>
      <thead>
        <tr>
          <th>Reference ID</th>
          <th>Patient ID</th>
          <th>Patient Name</th>      
          <th>Modality</th>
          <th>Institution</th>
          <th>Study Description</th>
          <th>Report description</th>
          <th>Clinical history</th>
          <th>Study Date/Time</th>
          <th>Reporting Date/Time</th>
          <th>Status</th>
          <th>Reported By</th>
          <th>Turn around</th>
          <th>Charge</th>
        </tr>
      </thead>
      <tbody>`
        tableData.map((element) => {
          if (element.study_status != "Deleted") {
            html +=
              `
          <tr>
        <td>${element?.reference_id}</td>
        <td>${element?.patient_id}</td>
        <td>${element?.patient_name}</td>      
        <td>${element?.modality}</td>
        <td>${element?.institution}</td>
        <td>${element?.study_description == null?"":element?.study_description}</td>
        <td>${element?.reporting_study_description == null?"":element?.reporting_study_description}</td>
        <td>${element?.study_history == null?"":element?.study_history}</td>
        <td>${element?.study_date}</td>
        <td>${element?.reporting_time == null?"":element?.reporting_time}</td>
        <td>${element?.study_status}</td>
        <td>${element?.reported_by}</td>
        <td>${element?.turn_around_time}</td>
        <td>${((parseFloat(element?.reporting_charge) || 0) + (parseFloat(element?.comunication_charge) || 0) + (parseFloat(element?.midnight_charge) || 0)).toFixed(2)}</td>
      </tr>
      `
    }
  })


  html += ` </tbody>
</table>

</body>
</html>`


  const pdfOptions = {
    filename: pdfName + '.pdf',
    html2canvas: {
      scale: 2,
      logging: false,

      scrollY: 0,
      width: 1400
    },
    jsPDF: { orientation: 'landscape' }

  };

  html2pdf().set(pdfOptions).from(html).save();


}