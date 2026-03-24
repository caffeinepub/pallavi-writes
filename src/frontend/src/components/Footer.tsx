import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="bg-lavender/20 py-10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Follow My Journey
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-sans">
            Subscribe for new stories, poems, and reflections delivered to your
            inbox.
          </p>
          <SubscribeForm />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-serif text-lg font-semibold text-foreground">
              Pallavi Writes
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              An author's corner of meaningful words.
            </p>
          </div>

          <nav className="flex gap-6 flex-wrap justify-center">
            {[
              { to: "/about", label: "About" },
              { to: "/blog", label: "Blog" },
              { to: "/books", label: "Books" },
              { to: "/quotes", label: "Quotes" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-lavender transition-colors"
              aria-label="Instagram"
            >
              <SiInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter / X"
            >
              <SiX className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <SiFacebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-sans">
            &copy; {year}. Built with{" "}
            <Heart className="inline h-3 w-3 text-blush fill-blush" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SubscribeForm() {
  const { actor } = useActor();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !actor) return;
    setStatus("loading");
    try {
      await actor.subscribe(email);
      setStatus("success");
      setEmail("");
      toast.success("You're subscribed!");
    } catch {
      setStatus("idle");
      toast.error("Subscription failed. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-lavender"
        required
        data-ocid="footer.input"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-sans font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
        data-ocid="footer.submit_button"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
