import Link from "next/link";

export default function CategoryTabs() {
  const tabs = ["world", "politics", "economy", "technology", "live"];

  return (
    <div style={wrap}>
      {tabs.map(tab => (
        <Link key={tab} href={`/${tab}`}>
          <span style={pill}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
        </Link>
      ))}
    </div>
  );
}

const wrap = {
  display: "flex",
  gap: 12,
  margin: "20px 0"
};

const pill = {
  padding: "10px 18px",
  borderRadius: 999,
  border: "1px solid #ddd",
  cursor: "pointer",
  fontWeight: 600
};
