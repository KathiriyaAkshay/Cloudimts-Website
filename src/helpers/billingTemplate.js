import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const handleDownloadPDF = (billingData) => {

  let ReportingData = {};

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
          total_report_charge:
            ReportingData[modality].total_report_charge +
            reportingCharge +
            communicationCharge,
          total_midnight_charge:
            ReportingData[modality].total_midnight_charge + midnightCharge
        };
      } else {

        ReportingData[modality] = {
          total_object: 1,
          total_report_charge: reportingCharge + communicationCharge,
          total_midnight_charge: midnightCharge
        };
        
      }

      // ReportingData[modality]['total_amount']
    }
  }

  console.log("Reporting charges information ========>");
  console.log(ReportingData);

  // ===== Get Filter data information 

  let FilterData = localStorage.getItem("BillingFilterValues") ; 
  FilterData = JSON.parse(FilterData) ;
  
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
    <div class="container mt-6 mb-7">
      <div class="row justify-content-center">
          <div class="col-lg-12 col-xl-7">
            <div class="card">
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
                          <strong>Feb/09/20</strong>
                        </div>
                      </div>
                  </div>
                  <div class="border-top border-gray-200 mt-4 py-4">
                      <div class="row">
                        <div class="col-md-6">
                            <div class="text-muted mb-2">Bill To</div>
                            <strong>
                            John McClane
                            </strong>
                            <p class="fs-sm">
                              989 5th Avenue, New York, 55832
                              <br />
                              <a href="#!" class="text-purple">john@email.com
                              </a>
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
                            <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0">No Of Cases</th>
                            <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0">Reporting charge</th>
                            <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0">Midnight <br>charge</th>
                            <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0">Total</th>
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
          <td class="px-0" style = "text-align: center;">${reportStudyData['total_report_charge']}</td>
          <td class="px-0" style = "text-align: center;">${reportStudyData['total_midnight_charge']}</td>
          <td class="px-0" style = "text-align: center; font-weight: bold;">$60.00</td>
        </tr>
      `

    })
    htmlContent = htmlContent + `
               
                      </tbody>
                  </table>
                  <div className='d-flex col justify-content-between'>
                      <div className=''>
                        that text
                      </div>
                      <div class="mt-5">
                        <div class="d-flex justify-content-end">
                            <p class="text-muted me-3">Subtotal:</p>
                            <span>$390.00</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <p class="text-muted me-3">Discount:</p>
                            <span>-$40.00</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <p class="text-muted me-3">Subtotal less discount:</p>
                            <span>-$40.00</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <p class="text-muted me-3">Tax Rate:</p>
                            <span>-$40.00</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <p class="text-muted me-3">Total Tax:</p>
                            <span>-$40.00</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <p class="text-muted me-3">Outstanding:</p>
                            <span>-$40.00</span>
                        </div>
                        <div class="d-flex justify-content-end mt-3">
                            <h5 class="me-3">Balance Due:</h5>
                            <h5 class="text-success">$399.99 USD</h5>
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
};

export const handleExport = (tableData) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  const sheetName = "BillingData";

  console.log("Table data ==========>");
  console.log(tableData);

  // Convert your data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate a blob from the workbook
  const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a blob from the ArrayBuffer
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a unique file name
  const fileName = "billing_data.xlsx";

  // Save the file using file-saver
  saveAs(blob, fileName);
};
