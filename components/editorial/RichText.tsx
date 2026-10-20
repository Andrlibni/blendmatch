/**
 * Renders plain-text bodies: blank lines split paragraphs, "## " starts a
 * heading and lines starting with "- " become a list.
 */
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className={`prose-lento ${className}`}>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
        const lines = block.split("\n");
        const items = lines.filter((l) => l.startsWith("- "));
        if (items.length === 0) return <p key={i}>{block}</p>;
        const intro = lines.filter((l) => !l.startsWith("- ")).join(" ");
        return (
          <div key={i}>
            {intro && <p>{intro}</p>}
            <ul>
              {items.map((l) => (
                <li key={l}>{l.slice(2)}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
