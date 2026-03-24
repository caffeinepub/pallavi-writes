import { BookOpen, Feather, Heart, Star } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-24"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.88 0.07 295 / 0.3) 0%, oklch(0.99 0.01 80) 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="shrink-0"
            >
              <div className="relative">
                <div className="w-64 h-72 md:w-72 md:h-80 rounded-3xl overflow-hidden shadow-soft border-4 border-white">
                  <img
                    src="/assets/generated/pallavi-portrait.dim_400x500.png"
                    alt="Pallavi Giram - Author"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-card border border-border">
                  <p className="font-serif text-sm font-semibold text-foreground">
                    Author &amp; Co-Author
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    4+ Published Works
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3">
                About the Author
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Hello, I&apos;m{" "}
                <span className="italic text-secondary">Pallavi</span>
              </h1>
              <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                I am a writer, dreamer, and storyteller at heart. Words have
                always been my way of making sense of the world — my way of
                reaching out, of feeling less alone, and of creating spaces
                where others feel seen and heard.
              </p>
              <p className="font-sans text-muted-foreground leading-relaxed">
                From journaling late at night as a teenager to publishing my
                first novel, writing has been the one constant thread in my
                life. Every story I tell is an act of love — for language, for
                people, and for the quiet, powerful moments that define us.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 container mx-auto px-4 max-w-4xl">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-12 text-center">
          My Journey
        </h2>
        <div className="space-y-8">
          {[
            {
              icon: <Feather className="h-5 w-5 text-lavender" />,
              year: "The Beginning",
              title: "A Child Who Wrote Everything Down",
              body: "I started writing before I knew I was a writer. Journals filled with dreams, small poems about rain, letters to characters in books I loved. Writing was my first language — more honest than spoken words.",
            },
            {
              icon: <BookOpen className="h-5 w-5 text-blush" />,
              year: "Co-Authoring",
              title: "Finding Community Through Anthologies",
              body: "Joining my first anthology opened doors I didn't know existed. Writing alongside other voices — celebrating shared experiences of womanhood, culture, and resilience — taught me that stories are more powerful when we tell them together.",
            },
            {
              icon: <Star className="h-5 w-5 text-secondary" />,
              year: "Solo Author",
              title: "Whispers of the Soul — My Debut Novel",
              body: "Publishing my first solo novel was the most terrifying and exhilarating moment of my writing life. Seeing characters I'd carried in my heart for years finally breathe on a page was indescribable.",
            },
            {
              icon: <Heart className="h-5 w-5 text-primary" />,
              year: "Today",
              title: "Writing, Always Writing",
              body: "Today I write blogs, stories, quotes, and letters to readers who've become friends. I believe in the power of vulnerable, honest storytelling — and I'll keep writing as long as there are hearts that want to listen.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 items-start"
              data-ocid={`about.item.${i + 1}`}
            >
              <div className="shrink-0 mt-1 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1 pb-8 border-b border-border last:border-0">
                <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-1">
                  {item.year}
                </p>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed text-sm">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10 text-center">
            What Moves Me
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Fiction", emoji: "📖" },
              { label: "Poetry", emoji: "🌸" },
              { label: "Travel Writing", emoji: "✈️" },
              { label: "Personal Essays", emoji: "🖊️" },
              { label: "Feminism", emoji: "💜" },
              { label: "Self-growth", emoji: "🌱" },
              { label: "Mythology", emoji: "🌙" },
              { label: "Chai & Rain", emoji: "☕" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-4 text-center shadow-card border border-border"
                data-ocid={`about.item.${i + 1}`}
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="text-sm font-sans font-medium text-foreground">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
