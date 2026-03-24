import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BlogPost, Book, BookLink, Quote } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type AdminTab = "posts" | "books" | "quotes" | "booklinks" | "messages";
type ContactMsg = { name: string; email: string; message: string };

export default function Admin() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<AdminTab>("posts");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [bookLinks, setBookLinks] = useState<BookLink[]>([]);
  const [messages, setMessages] = useState<ContactMsg[]>([]);

  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    category: "Self-growth",
    published: true,
  });
  const [newBook, setNewBook] = useState({
    title: "",
    bookType: "Published",
    role: "Author",
    description: "",
  });
  const [newQuote, setNewQuote] = useState({
    text: "",
    isOwn: true,
    attribution: "",
  });
  const [newLink, setNewLink] = useState({
    title: "",
    description: "",
    url: "",
    storeName: "",
  });

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isCallerAdmin()
      .then((admin) => {
        setIsAdmin(admin);
        if (admin) {
          Promise.all([
            actor.getPublishedPosts(),
            actor.getAllBooks(),
            actor.getAllQuotes(),
            actor.getAllBookLinks(),
            actor.getMessages(),
          ])
            .then(([p, b, q, l, m]) => {
              setPosts(p);
              setBooks(b);
              setQuotes(q);
              setBookLinks(l);
              setMessages(m);
            })
            .catch(() => {
              toast.error("Failed to load admin data.");
            });
        }
      })
      .catch(() => {});
  }, [actor, isFetching]);

  if (!identity) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-6">
        <h1 className="font-serif text-4xl font-bold text-foreground">
          Admin Portal
        </h1>
        <p className="text-muted-foreground font-sans">
          Please log in to access the admin panel.
        </p>
        <button
          type="button"
          onClick={login}
          disabled={loginStatus === "logging-in"}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          data-ocid="admin.primary_button"
        >
          {loginStatus === "logging-in" ? "Logging in…" : "Log In"}
        </button>
      </div>
    );
  }

  if (!isAdmin && !isFetching) {
    return (
      <div className="py-32 text-center">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
          Access Denied
        </h1>
        <p className="text-muted-foreground font-sans mb-6">
          You don&apos;t have admin permissions.
        </p>
        <button
          type="button"
          onClick={clear}
          className="px-6 py-2.5 rounded-full border border-border text-sm font-sans hover:bg-muted transition-colors"
          data-ocid="admin.secondary_button"
        >
          Log Out
        </button>
      </div>
    );
  }

  async function savePost() {
    if (!actor) return;
    try {
      await actor.createOrUpdatePost({ ...newPost, date: BigInt(Date.now()) });
      toast.success("Post saved!");
      setNewPost({
        title: "",
        body: "",
        category: "Self-growth",
        published: true,
      });
      const updated = await actor.getPublishedPosts();
      setPosts(updated);
    } catch {
      toast.error("Failed to save post.");
    }
  }

  async function saveBook() {
    if (!actor) return;
    try {
      await actor.createOrUpdateBook(newBook);
      toast.success("Book saved!");
      setNewBook({
        title: "",
        bookType: "Published",
        role: "Author",
        description: "",
      });
      const updated = await actor.getAllBooks();
      setBooks(updated);
    } catch {
      toast.error("Failed to save book.");
    }
  }

  async function saveQuote() {
    if (!actor) return;
    try {
      await actor.createOrUpdateQuote(newQuote);
      toast.success("Quote saved!");
      setNewQuote({ text: "", isOwn: true, attribution: "" });
      const updated = await actor.getAllQuotes();
      setQuotes(updated);
    } catch {
      toast.error("Failed to save quote.");
    }
  }

  async function saveBookLink() {
    if (!actor) return;
    try {
      await actor.createOrUpdateBookLink(newLink);
      toast.success("Book link saved!");
      setNewLink({ title: "", description: "", url: "", storeName: "" });
      const updated = await actor.getAllBookLinks();
      setBookLinks(updated);
    } catch {
      toast.error("Failed to save link.");
    }
  }

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "posts", label: "Blog Posts" },
    { key: "books", label: "Books" },
    { key: "quotes", label: "Quotes" },
    { key: "booklinks", label: "Book Links" },
    { key: "messages", label: "Messages" },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              {identity.getPrincipal().toString().slice(0, 20)}…
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="px-5 py-2 rounded-lg border border-border text-sm font-sans hover:bg-muted transition-colors"
            data-ocid="admin.secondary_button"
          >
            Log Out
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${tab === t.key ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`}
              data-ocid="admin.tab"
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4">
              <h3 className="font-serif text-lg font-semibold">New Post</h3>
              <input
                value={newPost.title}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Post title"
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-lavender"
                data-ocid="admin.input"
              />
              <select
                value={newPost.category}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                data-ocid="admin.select"
              >
                {["Self-growth", "Emotions", "Life", "Fiction"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <textarea
                value={newPost.body}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, body: e.target.value }))
                }
                placeholder="Write your post here…"
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none resize-none"
                data-ocid="admin.textarea"
              />
              <button
                type="button"
                onClick={savePost}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-sans font-semibold hover:opacity-90"
                data-ocid="admin.save_button"
              >
                Save Post
              </button>
            </div>
            <div className="space-y-3">
              {posts.map((post, i) => (
                <div
                  key={post.title}
                  className="bg-card rounded-xl p-4 border border-border"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <p className="font-serif font-semibold text-sm text-foreground">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {post.category}
                  </p>
                </div>
              ))}
              {posts.length === 0 && (
                <p
                  className="text-center text-muted-foreground text-sm font-sans py-6"
                  data-ocid="admin.empty_state"
                >
                  No posts yet.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {tab === "books" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4">
              <h3 className="font-serif text-lg font-semibold">New Book</h3>
              <input
                value={newBook.title}
                onChange={(e) =>
                  setNewBook((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Book title"
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                data-ocid="admin.input"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newBook.bookType}
                  onChange={(e) =>
                    setNewBook((p) => ({ ...p, bookType: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                  data-ocid="admin.select"
                >
                  <option value="Published">Published</option>
                  <option value="Anthology">Anthology</option>
                </select>
                <select
                  value={newBook.role}
                  onChange={(e) =>
                    setNewBook((p) => ({ ...p, role: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                  data-ocid="admin.select"
                >
                  <option value="Author">Author</option>
                  <option value="Co-Author">Co-Author</option>
                </select>
              </div>
              <textarea
                value={newBook.description}
                onChange={(e) =>
                  setNewBook((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Book description…"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none resize-none"
                data-ocid="admin.textarea"
              />
              <button
                type="button"
                onClick={saveBook}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-sans font-semibold hover:opacity-90"
                data-ocid="admin.save_button"
              >
                Save Book
              </button>
            </div>
            <div className="space-y-3">
              {books.map((book, i) => (
                <div
                  key={book.title}
                  className="bg-card rounded-xl p-4 border border-border"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <p className="font-serif font-semibold text-sm text-foreground">
                    {book.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {book.role} · {book.bookType}
                  </p>
                </div>
              ))}
              {books.length === 0 && (
                <p
                  className="text-center text-muted-foreground text-sm font-sans py-6"
                  data-ocid="admin.empty_state"
                >
                  No books yet.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {tab === "quotes" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4">
              <h3 className="font-serif text-lg font-semibold">New Quote</h3>
              <textarea
                value={newQuote.text}
                onChange={(e) =>
                  setNewQuote((p) => ({ ...p, text: e.target.value }))
                }
                placeholder="The quote…"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none resize-none"
                data-ocid="admin.textarea"
              />
              <label className="flex items-center gap-2 text-sm font-sans">
                <input
                  type="checkbox"
                  checked={newQuote.isOwn}
                  onChange={(e) =>
                    setNewQuote((p) => ({ ...p, isOwn: e.target.checked }))
                  }
                  className="accent-lavender"
                  data-ocid="admin.checkbox"
                />
                My own quote
              </label>
              {!newQuote.isOwn && (
                <input
                  value={newQuote.attribution}
                  onChange={(e) =>
                    setNewQuote((p) => ({ ...p, attribution: e.target.value }))
                  }
                  placeholder="Attribution (author name)"
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                  data-ocid="admin.input"
                />
              )}
              <button
                type="button"
                onClick={saveQuote}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-sans font-semibold hover:opacity-90"
                data-ocid="admin.save_button"
              >
                Save Quote
              </button>
            </div>
            <div className="space-y-3">
              {quotes.map((quote, i) => (
                <div
                  key={quote.text}
                  className="bg-card rounded-xl p-4 border border-border"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <p className="font-serif italic text-sm text-foreground line-clamp-2">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground font-sans mt-1">
                    {quote.isOwn ? "Own" : quote.attribution}
                  </p>
                </div>
              ))}
              {quotes.length === 0 && (
                <p
                  className="text-center text-muted-foreground text-sm font-sans py-6"
                  data-ocid="admin.empty_state"
                >
                  No quotes yet.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {tab === "booklinks" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-4">
              <h3 className="font-serif text-lg font-semibold">
                New Book Link
              </h3>
              <input
                value={newLink.title}
                onChange={(e) =>
                  setNewLink((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Book title"
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                data-ocid="admin.input"
              />
              <input
                value={newLink.storeName}
                onChange={(e) =>
                  setNewLink((p) => ({ ...p, storeName: e.target.value }))
                }
                placeholder="Store name"
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                data-ocid="admin.input"
              />
              <input
                value={newLink.url}
                onChange={(e) =>
                  setNewLink((p) => ({ ...p, url: e.target.value }))
                }
                placeholder="Purchase URL"
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none"
                data-ocid="admin.input"
              />
              <textarea
                value={newLink.description}
                onChange={(e) =>
                  setNewLink((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description…"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-sans focus:outline-none resize-none"
                data-ocid="admin.textarea"
              />
              <button
                type="button"
                onClick={saveBookLink}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-sans font-semibold hover:opacity-90"
                data-ocid="admin.save_button"
              >
                Save Link
              </button>
            </div>
            <div className="space-y-3">
              {bookLinks.map((link, i) => (
                <div
                  key={link.title}
                  className="bg-card rounded-xl p-4 border border-border"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <p className="font-serif font-semibold text-sm text-foreground">
                    {link.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {link.storeName}
                  </p>
                </div>
              ))}
              {bookLinks.length === 0 && (
                <p
                  className="text-center text-muted-foreground text-sm font-sans py-6"
                  data-ocid="admin.empty_state"
                >
                  No book links yet.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {tab === "messages" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {messages.map((msg) => (
              <div
                key={`${msg.name}-${msg.email}`}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
                data-ocid="admin.item.1"
              >
                <div className="mb-3">
                  <p className="font-serif font-semibold text-foreground">
                    {msg.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {msg.email}
                  </p>
                </div>
                <p className="text-sm font-sans text-foreground leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
            {messages.length === 0 && (
              <div
                className="text-center py-16 text-muted-foreground font-sans"
                data-ocid="admin.empty_state"
              >
                No messages yet.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
