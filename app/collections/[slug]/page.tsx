"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

export default function CollectionPage() {
  const { slug } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;

        const safe = Array.isArray(data) ? data : [];

        const filtered = safe.filter(
          (p) =>
            p &&
            p.id &&
            !p.isPack &&
            p.category === slug
        );

        setItems(filtered);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div style={{ padding: 40 }}>
      <h1>{slug}</h1>

      {loading && <p>Chargement...</p>}

      <div style={{ display: "grid", gap: 20 }}>
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`}>
            <div>
              <img src={getImageUrl(p.imageUrl)} width={200} />
              <h3>{p.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}