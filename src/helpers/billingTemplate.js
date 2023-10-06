import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const handleDownloadPDF = () => {
  // Create an HTML template with billing data and company logo
  const htmlContent = `
    <html>
    <head>
      <title>Billing</title>
    </head>
    <body>
      <div>
        <img src="company_logo.png" alt="Company Logo" />
        <h1>Billing Data</h1>
        <!-- Add your billing data here -->
        <p>Invoice Number: 12345</p>
        <p>Customer: John Doe</p>
        <p>Total Amount: $100</p>
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

  // Convert your data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate a blob from the workbook
  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create a blob from the ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create a unique file name
  const fileName = "billing_data.xlsx";

  // Save the file using file-saver
  saveAs(blob, fileName);
};
