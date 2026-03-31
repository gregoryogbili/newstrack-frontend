export default async function handler(req, res) {
  try {
    const response = await fetch("https://newstrack-backend-5rzq.onrender.com/health");
    const data = await response.json();
    res.status(200).json({ ok: true, backend: data });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
