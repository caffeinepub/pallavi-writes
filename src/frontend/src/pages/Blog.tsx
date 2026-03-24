import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { BlogPost } from "../backend";
import { useActor } from "../hooks/useActor";

const SAMPLE_POSTS: BlogPost[] = [
  {
    title: "Finding Peace in Words",
    body: "Writing has always been my sanctuary — a quiet room where I meet myself without pretense. In the act of putting pen to paper, I discover not just sentences, but the beating heart of my own existence. Therapy has many forms; for me, the page is the safest therapist I know.",
    date: BigInt(Date.now()),
    published: true,
    category: "Self-growth",
  },
  {
    title: "The Emotion Behind Every Story",
    body: "Every story I write carries a piece of my soul. Emotions are not accessories to a narrative — they are its architecture. The grief that pools between words, the longing that stretches sentences long, the quiet joy that punctuates an ending. They all have a home within the lines.",
    date: BigInt(Date.now()),
    published: true,
    category: "Emotions",
  },
  {
    title: "Life Between the Lines",
    body: "The most profound stories aren't found in grand events. They live in the ordinary: a cup of chai going cold, the sound of rain on a rooftop, a mother's quiet sigh at the end of a long day. Life is the most generous storyteller — if we are willing to listen.",
    date: BigInt(Date.now()),
    published: true,
    category: "Life",
  },
  {
    title: "Writing Characters Who Breathe",
    body: "A character is only as real as the contradictions you give them. Perfect people don't exist in life — they shouldn't exist in fiction either. The most beloved characters are messy, uncertain, and achingly human.",
    date: BigInt(Date.now()),
    published: true,
    category: "Fiction",
  },
  {
    title: "On Letting Yourself Feel Everything",
    body: "In a world that rewards numbness, choosing to feel deeply is a radical act. As a writer, feeling is not weakness — it is the very raw material of my craft. I've stopped apologizing for crying at sunsets or laughing too loud at old photographs.",
    date: BigInt(Date.now()),
    published: true,
    category: "Emotions",
  },
  {
    title: "The Art of Unbecoming",
    body: "Sometimes growth isn't about adding — it's about shedding. Unbecoming the version of yourself that was shaped by fear, by other people's expectations, by years of saying yes when you meant no. This is the quieter, harder kind of self-growth.",
    date: BigInt(Date.now()),
    published: true,
    category: "Self-growth",
  },
];

const CATEGORIES = ["All", "Self-growth", "Emotions", "Life", "Fiction"];

const categoryColors: Record<string, string> = {
  "Self-growth": "bg-lavender/30 text-foreground",
  Emotions: "bg-blush/30 text-foreground",
  Life: "bg-green-100 text-green-700",
  Fiction: "bg-yellow-100 text-yellow-700",
};

export default function Blog() {
  const { actor, isFetching } = useActor();
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getPublishedPosts()
      .then((data) => {
        if (data.length > 0) setPosts(data);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3">
            From the heart
          </p>
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
            The Blog
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Stories, reflections, and musings — written for anyone who has ever
            felt too much.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all ${activeCategory === cat ? "bg-secondary text-secondary-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-border"}`}
              data-ocid="blog.tab"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length === 0 && (
            <div
              className="col-span-2 text-center py-16 text-muted-foreground font-sans"
              data-ocid="blog.empty_state"
            >
              No posts in this category yet.
            </div>
          )}
          {filtered.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              data-ocid={`blog.item.${i + 1}`}
            >
              <Link
                to="/blog/$slug"
                params={{ slug: encodeURIComponent(post.title) }}
                className="block bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-shadow border border-border group h-full"
                data-ocid="blog.link"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-sans font-medium ${categoryColors[post.category] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {post.category}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-secondary transition-colors leading-snug">
                  {post.title}
                </h2>
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
      </div>
    </div>
  );
}
