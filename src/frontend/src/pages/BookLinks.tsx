import { ExternalLink, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { BookLink } from "../backend";
import { useActor } from "../hooks/useActor";

const SAMPLE_BOOK_LINKS: BookLink[] = [
  {
    title: "The Alchemist",
    description:
      "Paulo Coelho's timeless masterpiece about following your dreams and listening to your heart's language. A book that changed my life.",
    url: "https://www.amazon.in/s?k=the+alchemist",
    storeName: "Amazon",
  },
  {
    title: "Ikigai",
    description:
      "Héctor García and Francesc Miralles explore the Japanese concept of purpose — the reason you wake up every morning. Deeply moving.",
    url: "https://www.flipkart.com/search?q=ikigai",
    storeName: "Flipkart",
  },
  {
    title: "Atomic Habits",
    description:
      "James Clear's brilliant guide to building habits that stick. Practical, profound, and packed with insights that will change how you approach growth.",
    url: "https://www.amazon.in/s?k=atomic+habits",
    storeName: "Amazon",
  },
  {
    title: "The Midnight Library",
    description:
      "Matt Haig's beautiful novel about the lives we could have lived and the one life worth living. I cried and laughed and felt every page.",
    url: "https://www.amazon.in/s?k=midnight+library",
    storeName: "Amazon",
  },
  {
    title: "Women Who Run with the Wolves",
    description:
      "Clarissa Pinkola Estés on feminine psychology and the wild woman archetype. A book every woman should read at least once.",
    url: "https://www.flipkart.com/search?q=women+who+run+with+the+wolves",
    storeName: "Flipkart",
  },
  {
    title: "The God of Small Things",
    description:
      "Arundhati Roy's Booker Prize-winning novel about love and loss in Kerala. Prose so beautiful it feels like music. An all-time favourite.",
    url: "https://www.amazon.in/s?k=god+of+small+things",
    storeName: "Amazon",
  },
];

const storeColors: Record<string, string> = {
  Amazon: "bg-yellow-100 text-yellow-800",
  Flipkart: "bg-blue-100 text-blue-700",
};

export default function BookLinks() {
  const { actor, isFetching } = useActor();
  const [links, setLinks] = useState<BookLink[]>(SAMPLE_BOOK_LINKS);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getAllBookLinks()
      .then((data) => {
        if (data.length > 0) setLinks(data);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3">
            Recommended reads
          </p>
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
            Book Links
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Books I've reviewed, loved, and think you should read. Purchase them
            directly through the links below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, i) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col justify-between hover:shadow-soft transition-shadow"
              data-ocid={`booklinks.item.${i + 1}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium ${storeColors[link.storeName] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {link.storeName}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                  {link.title}
                </h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                  {link.description}
                </p>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary/30 text-foreground text-sm font-sans font-medium hover:bg-secondary/50 transition-colors"
                data-ocid="booklinks.button"
              >
                Purchase <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
