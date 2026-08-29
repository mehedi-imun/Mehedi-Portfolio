import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { faqs } from "@/lib/homepage";

/*
 * Native <details> rather than a JS accordion: keyboard operable, works with
 * the browser's find-in-page, and needs no client bundle at all.
 *
 * The FAQPage graph is emitted alongside because these answers are exactly the
 * kind of thing search engines surface directly, and the markup costs nothing.
 */
export default function Faq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <Section id="faq" aria-labelledby="faq-heading">
      <Reveal>
        <SectionHeading
          id="faq-heading"
          index="08"
          eyebrow="FAQ"
          title="What people usually ask"
          lead="The questions that come up before every engagement, answered up front."
          className="mb-12"
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="border-t border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium tracking-tight transition-colors hover:text-brand md:text-xl">
                {faq.question}
                {/*
                 * Two rules forming a plus that loses its vertical stroke when
                 * open -- cheaper than an icon, and it animates for free.
                 */}
                <span aria-hidden className="relative h-4 w-4 shrink-0 text-brand">
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[70ch] pb-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Reveal>

      <JsonLd schema={schema} />
    </Section>
  );
}
