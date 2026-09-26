import React from "react";

// Inline status message used instead of alert(). type: "error" | "success" | "info"
function Message({ type = "info", children }) {
  if (!children) return null;
  return (
    <div className={`message message-${type}`} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

export default Message;
