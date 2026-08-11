import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">404</p><h1>This little world isn’t here.</h1><Link className="pill-link" href="/">Back to Just Ours Love</Link></main>;
}
