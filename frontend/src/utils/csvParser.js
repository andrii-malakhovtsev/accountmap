export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvContent = event.target.result;
      // Handle both Windows (\r\n) and Mac/Linux (\n) line endings
      const lines = csvContent.split(/\r?\n/); 
      const headers = lines[0].split(",").map(h => h.trim());

      const data = lines
        .slice(1)
        .map((line) => {
          if (!line.trim()) return null;

          // Standard CSV split (Note: this doesn't handle commas inside quotes, 
          // but it works for standard browser exports)
          const values = line.split(",");
          const obj = {};

          headers.forEach((header, index) => {
            // Store EVERYTHING found in the CSV into the object
            obj[header] = values[index]?.trim() || "";
          });

          return obj; 
        })
        .filter(Boolean);

      resolve(data);
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}