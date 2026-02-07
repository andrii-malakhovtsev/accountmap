export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvContent = event.target.result;
      const lines = csvContent.split("\n");
      const headers = lines[0].split(",");

      const data = lines
        .slice(1)
        .map((line) => {
          if (!line.trim()) return null;

          const values = line.split(",");
          const obj = {};

          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || "";
          });

          return obj;
        })
        .filter(Boolean);

      resolve(data);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}
