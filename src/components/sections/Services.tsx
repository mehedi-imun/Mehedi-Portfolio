import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { services } from "@/lib/homepage";

/*
 * What a visitor can actually buy.
 *
 * A portfolio that only shows past work asks the reader to work out for
 * themselves whether you can help them. Naming the engagements closes that gap,
 * which is why almost every hire-me site that converts leads with it.
 */
export default function Services() {
  return (
    <Section id="services" aria-labelledby="services-heading">
      <Reveal>
        <SectionHeading
          id="services-heading"
          index="01"
          eyebrow="Hire me"
          title="What I can build for you"
          lead="Fixed-scope engagements or a full-time seat. Everything below is work I have shipped to production, not a service I am guessing at."
          className="mb-12"
        />
      </Reveal>

      {/*
       * One-pixel grid gaps over a border-coloured background: the cards read
       * as cells of a single table rather than three floating boxes, which is
       * what keeps the section feeling like one object.
       */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.index} delay={i * 0.08} className="h-full">
            <article className="group flex h-full flex-col bg-background p-8 transition-colors hover:bg-muted/40">
              <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span className="text-brand">Service</span>
                <span aria-hidden>{service.index}</span>
              </p>

              <h3 className="mt-6 text-xl font-semibold tracking-tight md:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 text-muted-foreground">{service.summary}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <Link
                href="#contact"
                /* mt-auto, not mt-8: the cards have different copy lengths, so
                   a fixed margin left the three links on three different
                   baselines. */
                className="mt-auto inline-flex items-center gap-2 self-start pt-8 font-mono text-xs uppercase tracking-[0.22em] text-foreground"
              >
                Discuss scope
                <span className="inline-block h-px w-6 bg-brand transition-all duration-300 group-hover:w-10" />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
