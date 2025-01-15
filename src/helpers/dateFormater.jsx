export const parseDateFormat = (date) => {
    if (!date || typeof date !== 'string') return undefined; // Return undefined for empty or invalid input
  
    let year, month, day;
  
    // Check for `YYYYMMDD` format
    if (/^\d{8}$/.test(date)) {
      year = date.substring(0, 4);
      month = date.substring(4, 6);
      day = date.substring(6, 8);
    }
    // Check for `DD/MM/YYYY` or `MM/DD/YYYY` format
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const parts = date.split('/');
      // Assuming DD/MM/YYYY
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
    // Check for `YYYY-MM-DD` format
    else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const parts = date.split('-');
      year = parts[0];
      month = parts[1];
      day = parts[2];
    }
    // Check for `MM-DD-YYYY` format
    else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const parts = date.split('-');
      day = parts[1];
      month = parts[0];
      year = parts[2];
    } else {
      return undefined; // Return undefined for unrecognized formats
    }
  
    // Validate year, month, and day values
    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      +month < 1 ||
      +month > 12 ||
      +day < 1 ||
      +day > 31
    ) {
      return undefined;
    }
  
    // Return in standard `YYYY-MM-DD` format for consistency
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };