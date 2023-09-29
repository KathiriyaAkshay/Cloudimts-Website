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
  const newWindow = window.open('', '_blank');
  newWindow.document.open();
  newWindow.document.write(htmlContent);
  newWindow.document.close();
};