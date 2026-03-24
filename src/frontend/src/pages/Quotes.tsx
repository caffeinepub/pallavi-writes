import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Quote } from "../backend";
import { useActor } from "../hooks/useActor";

const SAMPLE_QUOTES: Quote[] = [
  {
    text: "Every story begins with a heartbeat and ends with a sigh.",
    isOwn: true,
    attribution: "",
  },
  {
    text: "Write what you feel, not what you think they want to read.",
    isOwn: true,
    attribution: "",
  },
  {
    text: "In words, I find the home I've always searched for.",
    isOwn: true,
    attribution: "",
  },
  {
    text: "Silence is not emptiness — it is the holding space where stories are born.",
    isOwn: true,
    attribution: "",
  },
  {
    text: "Read not to escape life, but to understand it more deeply.",
    isOwn: true,
    attribution: "",
  },
  {
    text: "Not all those who wander are lost.",
    isOwn: false,
    attribution: "J.R.R. Tolkien",
  },
  {
    text: "There is no greater agony than bearing an untold story inside you.",
    isOwn: false,
    attribution: "Maya Angelou",
  },
  {
    text: "A reader lives a thousand lives before they die.",
    isOwn: false,
    attribution: "George R.R. Martin",
  },
  {
    text: "The most important thing about art is to work. Nothing else matters except sitting down every day and trying.",
    isOwn: false,
    attribution: "Steven Pressfield",
  },
  {
    text: "We are all just walking each other home.",
    isOwn: false,
    attribution: "Ram Dass",
  },
];

export default function Quotes() {
  const { actor, isFetching } = useActor();
  const [quotes, setQuotes] = useState<Quote[]>(SAMPLE_QUOTES);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getAllQuotes()
      .then((data) => {
        if (data.length > 0) setQuotes(data);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const own = quotes.filter((q) => q.isOwn);
  const curated = quotes.filter((q) => !q.isOwn);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3">
            Words that linger
          </p>
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
            Quotes
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Some words stay with you. Here are the ones that have stayed with
            me.
          </p>
        </motion.div>

        <Tabs defaultValue="own" className="w-full">
          <TabsList className="mx-auto flex w-fit mb-10">
            <TabsTrigger value="own" data-ocid="quotes.tab">
              My Quotes
            </TabsTrigger>
            <TabsTrigger value="curated" data-ocid="quotes.tab">
              Curated
            </TabsTrigger>
          </TabsList>
          <TabsContent value="own">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {own.map((quote, i) => (
                <QuoteCard key={quote.text} quote={quote} index={i} isOwn />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="curated">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curated.map((quote, i) => (
                <QuoteCard
                  key={quote.text}
                  quote={quote}
                  index={i}
                  isOwn={false}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function QuoteCard({
  quote,
  index,
  isOwn,
}: { quote: Quote; index: number; isOwn: boolean }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="relative bg-card rounded-2xl p-8 shadow-card border border-border overflow-hidden"
      data-ocid={`quotes.item.${index + 1}`}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{
          background: isOwn
            ? "linear-gradient(90deg, oklch(0.84 0.07 5), oklch(0.78 0.09 295))"
            : "linear-gradient(90deg, oklch(0.78 0.09 295), oklch(0.84 0.07 5))",
        }}
      />
      <span className="absolute top-3 left-4 font-serif text-7xl text-lavender/20 leading-none select-none">
        &ldquo;
      </span>
      <p className="font-serif text-lg italic text-foreground leading-relaxed mt-6 relative z-10">
        {quote.text}
      </p>
      <footer className="mt-5 text-xs font-sans font-medium">
        {isOwn ? (
          <span className="text-blush">— Pallavi Giram</span>
        ) : (
          <span className="text-muted-foreground">— {quote.attribution}</span>
        )}
      </footer>
    </motion.blockquote>
  );
}
