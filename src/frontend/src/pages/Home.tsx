import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Feather, Quote } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { BlogPost, Book, Quote as QuoteType } from "../backend";
import { useActor } from "../hooks/useActor";

const SAMPLE_POSTS: BlogPost[] = [
  {
    title: "Finding Peace in Words",
    body: "Writing has always been my sanctuary — a quiet room where I meet myself without pretense. In the act of putting pen to paper, I discover not just sentences, but the beating heart of my own existence.",
    date: BigInt(Date.now()),
    published: true,
    category: "Self-growth",
  },
  {
    title: "The Emotion Behind Every Story",
    body: "Every story I write carries a piece of my soul. Emotions are not accessories to a narrative — they are its architecture. The grief, the longing, the quiet joy — they all have a home within the lines.",
    date: BigInt(Date.now()),
    published: true,
    category: "Emotions",
  },
  {
    title: "Life Between the Lines",
    body: "The most profound stories aren't found in grand events — they live in the ordinary moments: a cup of chai going cold, the way rain sounds on a rooftop, a mother's quiet sigh.",
    date: BigInt(Date.now()),
    published: true,
    category: "Life",
  },
];

const SAMPLE_BOOKS: Book[] = [
  {
    title: "Whispers of the Soul",
    bookType: "Published",
    role: "Author",
    description:
      "A debut novel exploring the quiet inner world of a young woman finding her voice amidst family, loss, and love.",
  },
  {
    title: "Echoes of Tomorrow",
    bookType: "Published",
    role: "Author",
    description:
      "A haunting story about memory, time, and the letters we never send to the people we love the most.",
  },
  {
    title: "Voices Unheard",
    bookType: "Anthology",
    role: "Co-Author",
    description:
      "An anthology of powerful stories from emerging voices across India, celebrating resilience and womanhood.",
  },
];

const SAMPLE_QUOTES: QuoteType[] = [
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
    text: "There is no greater agony than bearing an untold story inside you.",
    isOwn: false,
    attribution: "Maya Angelou",
  },
];

const categoryColors: Record<string, string> = {
  "Self-growth": "bg-lavender/30 text-foreground",
  Emotions: "bg-blush/30 text-foreground",
  Life: "bg-green-100 text-green-700",
  Fiction: "bg-yellow-100 text-yellow-700",
};

export default function Home() {
  const { actor, isFetching } = useActor();
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [quotes, setQuotes] = useState<QuoteType[]>(SAMPLE_QUOTES);

  useEffect(() => {
    if (!actor || isFetching) return;
    Promise.all([
      actor.getPublishedPosts(),
      actor.getAllBooks(),
      actor.getAllQuotes(),
    ])
      .then(([p, b, q]) => {
        if (p.length > 0) setPosts(p);
        if (b.length > 0) setBooks(b);
        if (q.length > 0) setQuotes(q);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const featuredPosts = posts.slice(0, 3);
  const featuredBooks = books.slice(0, 3);
  const featuredQuotes = quotes.slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.88 0.07 295) 0%, oklch(0.92 0.05 5) 50%, oklch(0.97 0.02 80) 100%)",
        }}
      >
        <img
          src="/assets/generated/hero-bg.dim_1400x700.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-sans uppercase tracking-widest text-muted-foreground mb-4"
          >
            Welcome to my little corner
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Pallavi <span className="italic text-secondary">Writes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-sans text-lg md:text-xl text-muted-foreground italic max-w-xl mx-auto mb-10"
          >
            Hi, I am Pallavi — an author and co-author who loves writing
            meaningful stories and quotes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity shadow-soft"
              data-ocid="home.primary_button"
            >
              Read My Blog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-border bg-white/60 text-foreground font-sans font-semibold text-sm hover:bg-white transition-colors"
              data-ocid="home.secondary_button"
            >
              About Me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeader
          icon={<Feather className="h-5 w-5 text-lavender" />}
          title="Latest from the Blog"
          subtitle="Stories, reflections, and musings from my heart to yours."
          linkTo="/blog"
          linkLabel="View all posts"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {featuredPosts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`home.item.${i + 1}`}
            >
              <Link
                to="/blog/$slug"
                params={{ slug: encodeURIComponent(post.title) }}
                className="block bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-shadow border border-border group h-full"
                data-ocid="home.link"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-sans font-medium ${categoryColors[post.category] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3 group-hover:text-secondary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans line-clamp-3 leading-relaxed">
                  {post.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs text-secondary font-sans font-medium">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeader
            icon={<BookOpen className="h-5 w-5 text-blush" />}
            title="My Books"
            subtitle="Worlds I've built with words — from debut novels to collaborative anthologies."
            linkTo="/books"
            linkLabel="View all books"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {featuredBooks.map((book, i) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border"
                data-ocid={`home.item.${i + 1}`}
              >
                <div className="mb-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-sans font-medium ${book.role === "Author" ? "bg-blush/40 text-foreground" : "bg-lavender/40 text-foreground"}`}
                  >
                    {book.role}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-sans mb-3">
                  {book.bookType}
                </p>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed line-clamp-3">
                  {book.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeader
          icon={<Quote className="h-5 w-5 text-secondary" />}
          title="Words That Stay"
          subtitle="A few lines that mean everything."
          linkTo="/quotes"
          linkLabel="See all quotes"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          {featuredQuotes.map((quote, i) => (
            <motion.blockquote
              key={quote.text}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-card rounded-2xl p-8 shadow-card border border-border"
              data-ocid={`home.item.${i + 1}`}
            >
              <span className="absolute top-4 left-5 font-serif text-6xl text-lavender/40 leading-none select-none">
                &ldquo;
              </span>
              <p className="font-serif text-lg italic text-foreground leading-relaxed mt-4 relative z-10">
                {quote.text}
              </p>
              {!quote.isOwn && quote.attribution && (
                <footer className="mt-4 text-xs text-muted-foreground font-sans">
                  — {quote.attribution}
                </footer>
              )}
              {quote.isOwn && (
                <footer className="mt-4 text-xs text-blush font-sans font-medium">
                  — Pallavi Giram
                </footer>
              )}
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.88 0.07 295 / 0.4) 0%, oklch(0.92 0.05 5 / 0.4) 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Let&apos;s Walk This Journey Together
          </motion.h2>
          <p className="text-muted-foreground font-sans mb-8 max-w-md mx-auto">
            Get in touch, share your story, or just say hello. Every connection
            is a new chapter.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity shadow-soft"
            data-ocid="home.primary_button"
          >
            Say Hello <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  linkTo,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  linkTo: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs font-sans uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground font-sans mt-2 text-sm">
          {subtitle}
        </p>
      </div>
      <Link
        to={linkTo as string}
        className="shrink-0 inline-flex items-center gap-1 text-sm font-sans font-medium text-secondary hover:underline"
        data-ocid="home.link"
      >
        {linkLabel} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
