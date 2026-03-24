import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Book } from "../backend";
import { useActor } from "../hooks/useActor";

const SAMPLE_BOOKS: Book[] = [
  {
    title: "Whispers of the Soul",
    bookType: "Published",
    role: "Author",
    description:
      "A debut novel exploring the quiet inner world of a young woman finding her voice amidst family, loss, and love. Whispers of the Soul is an intimate portrait of silence and the courage it takes to break it.",
  },
  {
    title: "Echoes of Tomorrow",
    bookType: "Published",
    role: "Author",
    description:
      "A haunting story about memory, time, and the letters we never send to the people we love the most. Echoes of Tomorrow asks: what would you say if you had one more chance?",
  },
  {
    title: "Voices Unheard",
    bookType: "Anthology",
    role: "Co-Author",
    description:
      "An anthology of powerful stories from emerging voices across India, celebrating resilience, womanhood, and the courage to speak. Pallavi contributed a short story about generational memory.",
  },
  {
    title: "Tapestry of Tales",
    bookType: "Anthology",
    role: "Co-Author",
    description:
      "A diverse collection of fiction and poetry woven together across cultures and geographies. A celebration of the storytelling tradition and its many forms across the subcontinent.",
  },
];

export default function Books() {
  const { actor, isFetching } = useActor();
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getAllBooks()
      .then((data) => {
        if (data.length > 0) setBooks(data);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const published = books.filter((b) => b.bookType === "Published");
  const anthologies = books.filter((b) => b.bookType === "Anthology");

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3">
            Written with love
          </p>
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
            My Books
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Every book is a world I built from scratch — and an invitation for
            you to step inside.
          </p>
        </motion.div>

        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <span className="w-8 h-0.5 bg-blush inline-block" /> Published Books
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {published.map((book, i) => (
              <BookCard key={book.title} book={book} index={i} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <span className="w-8 h-0.5 bg-lavender inline-block" /> Co-Authored
            Anthologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {anthologies.map((book, i) => (
              <BookCard key={book.title} book={book} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BookCard({ book, index }: { book: Book; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:shadow-soft transition-shadow"
      data-ocid={`books.item.${index + 1}`}
    >
      <div
        className="h-2"
        style={{
          background:
            book.role === "Author"
              ? "linear-gradient(90deg, oklch(0.84 0.07 5), oklch(0.78 0.09 295))"
              : "linear-gradient(90deg, oklch(0.78 0.09 295), oklch(0.88 0.07 295))",
        }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-serif text-xl font-bold text-foreground leading-snug">
            {book.title}
          </h3>
          <span
            className={`shrink-0 text-xs px-3 py-1 rounded-full font-sans font-medium ${book.role === "Author" ? "bg-blush/40 text-foreground" : "bg-lavender/40 text-foreground"}`}
          >
            {book.role}
          </span>
        </div>
        <p className="text-xs font-sans uppercase tracking-wide text-muted-foreground mb-3">
          {book.bookType}
        </p>
        <p className="text-sm font-sans text-muted-foreground leading-relaxed">
          {book.description}
        </p>
      </div>
    </motion.div>
  );
}
