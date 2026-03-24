import { Mail, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

export default function Contact() {
  const { actor } = useActor();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return;
    }
    setStatus("loading");
    try {
      await actor.submitMessage({
        name: form.name,
        email: form.email,
        message: form.message,
        timestamp: BigInt(Date.now()),
      });
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent! I'll get back to you soon. 💜");
    } catch {
      setStatus("idle");
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-3">
            Let's connect
          </p>
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
            Say Hello
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Whether you want to share your thoughts, collaborate, or just send
            some love — my inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="contact.modal"
            >
              <div>
                <label
                  className="block text-sm font-sans font-medium text-foreground mb-1.5"
                  htmlFor="name"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Pallavi"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-lavender transition"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-sans font-medium text-foreground mb-1.5"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-lavender transition"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-sans font-medium text-foreground mb-1.5"
                  htmlFor="message"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me something beautiful…"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-lavender transition resize-none"
                  data-ocid="contact.textarea"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                data-ocid="contact.submit_button"
              >
                {status === "loading" ? (
                  "Sending…"
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </button>
              {status === "success" && (
                <p
                  className="text-center text-sm text-green-600 font-sans"
                  data-ocid="contact.success_state"
                >
                  Message sent! Thank you 💜
                </p>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div
              className="rounded-2xl p-6 border border-border"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.88 0.07 295 / 0.2), oklch(0.92 0.05 5 / 0.2))",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-lavender" />
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Email
                </h3>
              </div>
              <p className="text-sm font-sans text-muted-foreground">
                pallavi@pallavigiram.com
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                Find me on
              </h3>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-white text-sm font-sans font-medium text-foreground hover:border-lavender transition-colors"
                  data-ocid="contact.link"
                >
                  <SiInstagram className="h-4 w-4 text-pink-500" /> Instagram
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-white text-sm font-sans font-medium text-foreground hover:border-border transition-colors"
                  data-ocid="contact.link"
                >
                  <SiX className="h-4 w-4" /> Twitter
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-white text-sm font-sans font-medium text-foreground hover:border-lavender transition-colors"
                  data-ocid="contact.link"
                >
                  <SiFacebook className="h-4 w-4 text-blue-500" /> Facebook
                </a>
              </div>
            </div>

            <blockquote className="border-l-4 border-lavender pl-4">
              <p className="font-serif italic text-muted-foreground leading-relaxed">
                &ldquo;Every connection is a story waiting to be written.&rdquo;
              </p>
              <footer className="mt-2 text-xs text-blush font-sans font-medium">
                — Pallavi Giram
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
