import React, { useRef } from "react";
import NavButton from "./NavButton";
import SeriousIcons from "../SeriousIcons";
import { parseCSV } from "../../src/utils/csvParser";
import updateDataStore from "../../src/store/updateDataStore";

const UploadCSV = () => {
  const fileInputRef = useRef(null);
  const { uploadBulkAccounts } = updateDataStore();

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file");
      event.target.value = "";
      return;
    }

    try {
      const csvData = await parseCSV(selectedFile);
      uploadBulkAccounts(csvData);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Failed to parse CSV file");
    } finally {
      event.target.value = ""; 
    }
  };

  return (
    <>
      <NavButton
        onClick={() => fileInputRef.current?.click()}
        icon={SeriousIcons.Upload}
        label="Upload CSV"
        subtext="We remove passwords before sending to the server!"
        colorClass="bg-white/5 hover:bg-white/10"
        iconColor="text-slate-400"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default UploadCSV;