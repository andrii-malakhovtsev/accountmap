import React, { useState, useMemo, useEffect } from "react";
import { getIconUrl } from "./../../src/utilities/iconService";
import SidebarView from "./SidebarView";
import SidebarAccountForm from "./SidebarAccountForm";
import SidebarConnectionForm from "./SidebarConnectionForm";
import SidebarLinkView from "./SidebarLinkView";
import useSidebarStore from "./../../src/store/sidebarStore";

const Sidebar = ({
  isOpen,
  onClose,
  viewMode,
  selectedAccount,
  onSelectAccount,
  rawEntities,
}) => {
  console.log("selectedAccount in Sidebar:", selectedAccount);
  const [form, setForm] = useState({
    name: "",
    username: "",
    notes: "",
    type: "mail",
    value: "",
  });
  const [errors, setErrors] = useState({});
  const [isLinking, setIsLinking] = useState(false);
  const [linkTargetId, setLinkTargetId] = useState(null);
  const {
    createAccount,
    createConnection,
    linkConnection,
    loading,
    error,
    success,
    resetState,
  } = useSidebarStore();

  useEffect(() => {
    setForm({ name: "", username: "", notes: "", type: "mail", value: "" });
    setErrors({});
  }, [viewMode, isOpen]);

  useEffect(() => {
    if (!isOpen || viewMode !== "view") {
      setIsLinking(false);
      setLinkTargetId(null);
    }
  }, [isOpen, viewMode, selectedAccount]);

  const validate = (name, value, currentType) => {
    let error = "";
    if (name === "value") {
      if (!value.trim()) {
        error = "Value is required";
      } else if (currentType === "mail" && !value.includes("@")) {
        error = "Invalid email address (missing @)";
      } else if (currentType === "phone") {
        // Must start with + and contain only digits after that
        const phoneRegex = /^\+[0-9]+$/;
        if (!value.startsWith("+")) {
          error = "Phone must start with +";
        } else if (!phoneRegex.test(value)) {
          error = "Digits only after +";
        } else if (value.length < 8) {
          error = "Number too short";
        }
      }
      // Auth type has no parsing/regex, just the "Value is required" check above
    }

    if (name === "name" && !value.trim()) error = "Name is required";
    if (name === "username" && !value.trim()) error = "Username is required";

    return error;
  };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      const error = validate(field, value, newForm.type);
      setErrors((prevErr) => ({ ...prevErr, [field]: error }));
      return newForm;
    });
  };

  const isConnection = !!selectedAccount?.accounts;

  const isValid = useMemo(() => {
    if (viewMode === "createAccount") {
      return form.name && form.username && !errors.name && !errors.username;
    }
    if (viewMode === "createConnection") {
      return form.value && !errors.value;
    }
    return true;
  }, [viewMode, form, errors]);

  const sidebarConnections = useMemo(() => {
    if (!selectedAccount || viewMode !== "view") return [];
    return isConnection
      ? selectedAccount.accounts || []
      : (rawEntities || []).filter((c) =>
          c.accounts?.some((a) => a.id === selectedAccount.id),
        );
  }, [selectedAccount, rawEntities, isConnection, viewMode]);

  const linkTargets = useMemo(() => {
    if (!selectedAccount || viewMode !== "view") return [];
    if (isConnection) {
      const uniqueAccounts = new Map();
      (rawEntities || []).forEach((conn) => {
        (conn.accounts || []).forEach((acc) => {
          if (!uniqueAccounts.has(acc.id)) {
            uniqueAccounts.set(acc.id, acc);
          }
        });
      });
      const linkedAccountIds = new Set(
        (selectedAccount.accounts || []).map((acc) => acc.id),
      );
      return Array.from(uniqueAccounts.values()).filter(
        (acc) => !linkedAccountIds.has(acc.id),
      );
    }

    const linkedConnectionIds = new Set(
      sidebarConnections.map((conn) => conn.id),
    );
    return (rawEntities || []).filter(
      (conn) => !linkedConnectionIds.has(conn.id),
    );
  }, [selectedAccount, rawEntities, isConnection, viewMode, sidebarConnections]);

  const activeIconKey = useMemo(() => {
    if (viewMode === "createAccount") return form.name;
    if (viewMode === "createConnection") return form.type;
    if (!selectedAccount) return "";
    return isConnection ? selectedAccount.type : selectedAccount.name;
  }, [viewMode, form.name, form.type, selectedAccount, isConnection]);

  const linkLabel = isConnection ? "Link to Account" : "Link to Connection";
  const isLinkDisabled = !linkTargetId || loading;

  const headerTitle = useMemo(() => {
    if (viewMode === "view") {
      if (isLinking) return linkLabel;
      return selectedAccount?.name || selectedAccount?.type || "Details";
    }
    if (viewMode === "createAccount") return "New Account";
    return "New Connection";
  }, [viewMode, isLinking, linkLabel, selectedAccount]);

  const handleCreate = async () => {
    try {
      if (viewMode === "createAccount") {
        await createAccount(form);
        setForm({ name: "", username: "", notes: "", type: "mail", value: "" });
      } else if (viewMode === "createConnection") {
        await createConnection(form);
        setForm({ name: "", username: "", notes: "", type: "mail", value: "" });
      }
      onClose();
    } catch (err) {
      console.error("Error creating:", err);
    }
  };

  const handleLink = async () => {
    if (!selectedAccount || !linkTargetId) return;
    const payload = isConnection
      ? { accountId: linkTargetId, identityId: selectedAccount.id }
      : { accountId: selectedAccount.id, identityId: linkTargetId };

    try {
      await linkConnection(payload);
      setIsLinking(false);
      setLinkTargetId(null);
    } catch (err) {
      console.error("Error linking:", err);
    }
  };

  useEffect(() => {
    if (success) {
      resetState();
    }
  }, [success]);

  return (
    <aside
      className={`absolute right-0 top-20 bottom-0 w-80 bg-[#0f0f0f]/95 backdrop-blur-xl border-l border-white/10 flex flex-col z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="flex flex-col items-center mb-8 relative">
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 p-2 text-gray-500 hover:text-white"
          >
            ✕
          </button>

          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-4 mb-4 shadow-2xl overflow-hidden">
            <img
              src={getIconUrl(activeIconKey)}
              className="max-w-full max-h-full object-contain"
              alt=""
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/633/633600.png";
              }}
            />
          </div>
          <h2 className="text-xl font-black text-white uppercase text-center truncate w-full tracking-tighter">
            {headerTitle}
          </h2>
        </div>

        {viewMode === "createAccount" && (
          <SidebarAccountForm
            form={form}
            errors={errors}
            onChange={handleChange}
          />
        )}
        {viewMode === "createConnection" && (
          <SidebarConnectionForm
            form={form}
            errors={errors}
            onChange={handleChange}
          />
        )}
        {viewMode === "view" && selectedAccount && !isLinking && (
          <SidebarView
            selectedAccount={selectedAccount}
            connections={sidebarConnections}
            onSelectAccount={onSelectAccount}
            onStartLink={() => setIsLinking(true)}
          />
        )}
        {viewMode === "view" && selectedAccount && isLinking && (
          <SidebarLinkView
            targets={linkTargets}
            label={isConnection ? "Account" : "Connection"}
            selectedId={linkTargetId}
            onBack={() => setIsLinking(false)}
            onPick={(item) => setLinkTargetId(item.id)}
          />
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
        {viewMode !== "view" ? (
          <>
            <button
              disabled={!isValid || loading}
              onClick={handleCreate}
              className={`w-full py-3 text-[10px] font-black rounded-md uppercase tracking-[0.2em] transition-all duration-300 ${isValid && !loading ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
            >
              {loading ? "Creating..." : "Create"}
            </button>
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
          </>
        ) : isLinking ? (
          <div className="space-y-3">
            <button
              disabled={isLinkDisabled}
              onClick={handleLink}
              className={`w-full py-3 text-[10px] font-black rounded-md uppercase tracking-[0.2em] transition-all duration-300 ${isLinkDisabled ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white cursor-pointer hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"}`}
            >
              {loading ? "Linking..." : "Link"}
            </button>
            <button
              onClick={() => setIsLinking(false)}
              className="w-full py-3 bg-white/5 text-white text-[10px] font-black rounded-md uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
            >
              Back to Details
            </button>
          </div>
        ) : (
          <>
            <button className="w-full py-3 bg-white/5 text-white text-[10px] font-black rounded-md uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
              Save
            </button>
            <button className="w-full py-3 border border-red-900/30 text-red-500/70 text-[10px] font-black rounded-md uppercase tracking-[0.2em] hover:bg-red-900/10 transition-colors">
              Delete
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
