import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { buildStats } from "@/lib/homepage";

/*
 * Every figure here is computed from lib/experience.ts at build time, so the
 * panel cannot quietly go stale or overstate. Adding a role updates the numbers
 * on its own; there is nothing to remember to edit.
 */
export default function Stats({
  technologyCount,
}: {
  technologyCount: number;
}) {
  const stats = buildStats(technologyCount);

  return (
    <Section id="proof" aria-labelledby="proof-heading">
      <Reveal>
        <SectionHeading
          id="proof-heading"
          index="02"
          eyebrow="Proof in numbers"
          title="Shipped, measured."
          lead="Counted from the record on this site rather than rounded up for effect."
          className="mb-12"
        />
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-8">
              <dt className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-4 text-4xl font-semibold tracking-tight text-brand md:text-5xl">
                {stat.value}
              </dd>
              {/* A second <dd>, not a <p>: only dt/dd may sit inside a dl group. */}
              <dd className="mt-3 text-sm text-muted-foreground">
                {stat.detail}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
