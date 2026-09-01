"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";

export type IndexEntry = {
  href: string;
  title: string;
  meta: string;
  description: string;
  image: string;
};

/**
 * A list of rows that dims everything except the one under the cursor, and
 * floats a preview of that row's image alongside the pointer.
 *
 * On a page with no background colour this is what carries the design: the
 * type does the work, and the imagery only appears where you are looking.
 *
 * The preview is moved by writing a transform straight onto the node, so
 * pointer movement never re-renders React — only the active index does,
 * and that changes at most once per row.
 */
export function IndexList({ entries }: { entries: IndexEntry[] }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const move = (event: PointerEvent<HTMLElement>) => {
    const node = previewRef.current;
    if (!node) return;
    node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(1)`;
  };

  return (
    <div onPointerMove={move} onPointerLeave={() => setActive(null)}>
      <div className="index-list" onPointerLeave={() => setActive(null)}>
        {entries.map((entry, index) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="index-item group"
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            <span className="stat-value stat-value-sm text-[var(--brand)]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="display-2">{entry.title}</h3>

            <p className="body-copy hidden lg:block">{entry.description}</p>

            <span className="flex items-center gap-2 text-[0.8125rem] font-medium text-[var(--brand)]">
              <span className="hidden sm:inline">{entry.meta}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* One preview node reused for every row — swapping the src beats
          mounting eight absolutely-positioned images. */}
      <div ref={previewRef} className="index-preview" data-visible={active !== null} aria-hidden>
        {active !== null ? (
          <Image
            src={entries[active].image}
            alt=""
            fill
            sizes="320px"
            className="object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}

export default IndexList;
