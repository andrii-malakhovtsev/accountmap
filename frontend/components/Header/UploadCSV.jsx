import React, { useRef } from "react";
import NavButton from "./NavButton";
import SeriousIcons from "../SeriousIcons";
import { parseCSV } from "../../src/utils/csvParser";
import updateDataStore from "../../src/store/updateDataStore";

const UploadCSV = () => {
  const fileInputRef = useRef(null);
  const { uploadBulkAccounts } = updateDataStore();

const sanitizeAndNormalize = (data) => {
  return data.map((row) => {
    const keys = Object.keys(row);

    // --- PRIORITY 1: SERVICE NAME ---
    const nameKeyPriority = ["url", "service", "title", "name", "website"];
    let nameKey = null;

    for (const candidate of nameKeyPriority) {
      nameKey = keys.find(k => k.toLowerCase().trim() === candidate);
      if (nameKey) break;
    }

    // --- PRIORITY 2: USERNAME ---
    const userKeyPriority = ["username", "login", "email", "user", "id"];
    let userKey = null;

    for (const candidate of userKeyPriority) {
      userKey = keys.find(k => k.toLowerCase().trim() === candidate);
      if (userKey) break;
    }

    let finalName = nameKey ? String(row[nameKey]).trim() : "";
    let finalUser = userKey ? String(row[userKey]).trim() : "";

    if (finalName.includes(".") || finalName.startsWith("http")) {
      finalName = finalName
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split(/[/?#]/)[0]
        .replace(/\.(com|net|org|io|gov|edu|me|co|info|biz)$/i, "");
    }

    return {
      name: finalName || "Unknown Service",
      username: finalUser || "No Username",
      categories: [] // Required for backend
    };
  })
  .filter(row => row.name !== "Unknown Service");
};

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      const rawData = await parseCSV(selectedFile);
      const cleanedData = sanitizeAndNormalize(rawData);
      
      if (cleanedData.length === 0) {
        alert("System Error: Could not find columns for 'URL' or 'Name'. Open the Console (F12) to see detected headers.");
        return;
      }

      const result = await uploadBulkAccounts(cleanedData);
      const msg = result?.message ?? `Success! Imported ${result?.count ?? cleanedData.length} items.`;
      alert(msg);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error?.message || "Upload failed. Check format or account limit.");
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
        subtext={
          <>
            <span className="text-slate-500">Safe upload: Passwords are auto-deleted. </span>
            <span className="text-amber-400 font-semibold">Demo shares one account for everyone — don&apos;t upload real data.</span>
          </>
        }
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