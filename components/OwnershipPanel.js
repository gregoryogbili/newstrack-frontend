import { useState } from "react";
import { getOwnershipInfo } from "../data/mediaOwnership";

export default function OwnershipPanel({ source, sourceUrl }) {
  const [show, setShow] = useState(false);

  const data = getOwnershipInfo(source, sourceUrl);

  if (!data) return null;

  return (
    <div
      style={{ position: "absolute", top: 8, right: 8 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div
        style={{
          fontSize: 14,
          color: "#c40000",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        ⓘ
      </div>

      {show && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 0,
            width: 220,
            background: "#c40000",
            color: "#ffffff",
            border: "1px solid #900000",
            borderRadius: 8,
            padding: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            fontSize: 12,
            lineHeight: "1.5",
            zIndex: 1000,
          }}
        >
          <strong style={{ display: "block", marginBottom: 6 }}>Source Intelligence</strong>

          <div>Owner: {data.owner}</div>
          <div>Ownership Type: {data.ownerType}</div>
          <div>Country: {data.country}</div>
          <div>Political Lean: {data.politicalLean}</div>
          <div>Founded: {data.founded}</div>
        </div>
      )}
    </div>
  );
}
