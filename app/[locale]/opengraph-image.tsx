import { ImageResponse } from "next/og";

export const alt = "Just Ours Love — apps made for two";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ background: "#150d13", color: "#f5eadf", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}><div style={{ fontSize: 34, letterSpacing: 8, textTransform: "uppercase" }}>Just Ours Love</div><div style={{ display: "flex", fontSize: 92, fontFamily: "serif", maxWidth: 930, lineHeight: 1.02 }}>Your love. Your little worlds.</div><div style={{ display: "flex", color: "#d7a2ad", fontSize: 26 }}>Love Mailbox · Paw Love · Unseal</div></div>, size);
}
