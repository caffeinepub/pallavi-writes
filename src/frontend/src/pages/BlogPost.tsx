import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { BlogPost as BlogPostType } from "../backend";
import { useActor } from "../hooks/useActor";

const SAMPLE_POSTS: BlogPostType[] = [
  {
    title: "Finding Peace in Words",
    body: `Writing has always been my sanctuary — a quiet room where I meet myself without pretense.

In the act of putting pen to paper, I discover not just sentences, but the beating heart of my own existence. Therapy has many forms; for me, the page is the safest therapist I know.

When life feels too loud, too chaotic, too heavy, I write. Not because it fixes anything — but because it names things. And naming something is the first step toward understanding it.

There is a kind of magic in the way words can hold what the mind cannot. A grief too large to carry becomes a sentence. A love too tender to speak becomes a paragraph.

If you've ever journaled, ever scribbled in the margins of a notebook, ever sent an unsent letter — you know this feeling. You are already a writer.`,
    date: BigInt(Date.now()),
    published: true,
    category: "Self-growth",
  },
  {
    title: "The Emotion Behind Every Story",
    body: `Every story I write carries a piece of my soul. Emotions are not accessories to a narrative — they are its architecture.

The grief that pools between words, the longing that stretches sentences long, the quiet joy that punctuates an ending. They all have a home within the lines.

I've learned that readers don't fall in love with perfect prose. They fall in love with truth. With characters who hurt in familiar ways. With stories that say: I know how this feels.

This is why I write emotion first, plot second. Plot is the skeleton. Emotion is the heartbeat.`,
    date: BigInt(Date.now()),
    published: true,
    category: "Emotions",
  },
  {
    title: "Life Between the Lines",
    body: `The most profound stories aren't found in grand events. They live in the ordinary.

A cup of chai going cold on a window sill. The sound of rain on a rooftop in July. A mother's quiet sigh at the end of a long day.

Life is the most generous storyteller — if we are willing to listen.

I've found that the moments I most want to write about are the small ones. The ones easily overlooked. A child's face at a bookstore. A stranger's laugh on a bus.

These moments are the whole library. All the rest is just shelving.`,
    date: BigInt(Date.now()),
    published: true,
    category: "Life",
  },
];

const categoryColors: Record<string, string> = {
  "Self-growth": "bg-lavender/30 text-foreground",
  Emotions: "bg-blush/30 text-foreground",
  Life: "bg-green-100 text-green-700",
  Fiction: "bg-yellow-100 text-yellow-700",
};

export default function BlogPost() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const title = decodeURIComponent(slug);
  const { actor, isFetching } = useActor();
  const [post, setPost] = useState<BlogPostType | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getPost(title)
      .then((data) => {
        setPost(data);
      })
      .catch(() => {
        const found = SAMPLE_POSTS.find((p) => p.title === title);
        setPost(found ?? SAMPLE_POSTS[0]);
      });
  }, [actor, isFetching, title]);

  // fallback: show sample data immediately if actor not ready yet
  const displayPost =
    post ?? SAMPLE_POSTS.find((p) => p.title === title) ?? SAMPLE_POSTS[0];

  const paragraphs = displayPost.body.split("\n\n");

  return (
    <article className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans mb-8"
            data-ocid="blogpost.link"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span
              className={`text-xs px-3 py-1 rounded-full font-sans font-medium ${categoryColors[displayPost.category] ?? "bg-muted text-muted-foreground"}`}
            >
              {displayPost.category}
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            {displayPost.title}
          </h1>

          <div
            className="h-px mb-10"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.84 0.07 5), oklch(0.78 0.09 295), transparent)",
            }}
          />

          <div className="font-sans text-foreground leading-relaxed text-base space-y-5">
            {paragraphs.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-lavender/40 flex items-center justify-center font-serif font-bold text-foreground">
                P
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-foreground">
                  Pallavi Giram
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  Author &amp; Storyteller
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
