import List "mo:core/List";
import Order "mo:core/Order";
import Bool "mo:core/Bool";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module BlogPost {
    public func compareByDate(p1 : BlogPost, p2 : BlogPost) : Order.Order {
      Int.compare(p1.date, p2.date);
    };

    public func compareByTitle(p1 : BlogPost, p2 : BlogPost) : Order.Order {
      Text.compare(p1.title, p2.title);
    };

    public func compare(p1 : BlogPost, p2 : BlogPost) : Order.Order {
      switch (Text.compare(p1.category, p2.category)) {
        case (#equal) { Text.compare(p1.title, p2.title) };
        case (other) { other };
      };
    };
  };

  module Quote {
    public func compare(q1 : Quote, q2 : Quote) : Order.Order {
      Text.compare(q1.attribution, q2.attribution);
    };

    public func compareByText(q1 : Quote, q2 : Quote) : Order.Order {
      Text.compare(q1.text, q2.text);
    };
  };

  module BookLink {
    public func compare(l1 : BookLink, l2 : BookLink) : Order.Order {
      Text.compare(l1.storeName, l2.storeName);
    };
  };

  module Book {
    public func compare(b1 : Book, b2 : Book) : Order.Order {
      Text.compare(b1.role, b2.role);
    };

    public func compareByTitle(b1 : Book, b2 : Book) : Order.Order {
      Text.compare(b1.title, b2.title);
    };
  };

  module ContactMessage {
    public func compareByDate(m1 : ContactMessage, m2 : ContactMessage) : Order.Order {
      Int.compare(m1.timestamp, m2.timestamp);
    };
  };

  public type BlogPost = {
    title : Text;
    body : Text;
    category : Text;
    date : Time.Time;
    published : Bool;
  };

  public type Book = {
    title : Text;
    description : Text;
    role : Text;
    bookType : Text;
  };

  public type Quote = {
    text : Text;
    attribution : Text;
    isOwn : Bool;
  };

  public type BookLink = {
    title : Text;
    description : Text;
    storeName : Text;
    url : Text;
  };

  public type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let blogPosts = Map.empty<Text, BlogPost>();
  let books = Map.empty<Text, Book>();
  let quotes = Map.empty<Text, Quote>();
  let bookLinks = Map.empty<Text, BookLink>();
  let subscribers = Map.empty<Text, ()>();
  let messages = Map.empty<Principal, ContactMessage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Blog posts
  public shared ({ caller }) func createOrUpdatePost(post : BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create or update posts");
    };
    blogPosts.add(post.title, post);
  };

  public query ({ caller }) func getPost(title : Text) : async BlogPost {
    switch (blogPosts.get(title)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        // Non-admins can only see published posts
        if (not post.published and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Post not found");
        };
        post;
      };
    };
  };

  public query ({ caller }) func getPublishedPosts() : async [BlogPost] {
    blogPosts.values().toArray().filter(func(p) { p.published }).sort(BlogPost.compareByDate);
  };

  // Books
  public shared ({ caller }) func createOrUpdateBook(book : Book) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create or update books");
    };
    books.add(book.title, book);
  };

  public query ({ caller }) func getBook(title : Text) : async Book {
    switch (books.get(title)) {
      case (null) { Runtime.trap("Book not found") };
      case (?book) { book };
    };
  };

  public query ({ caller }) func getAllBooks() : async [Book] {
    books.values().toArray().sort();
  };

  public query ({ caller }) func getBooksByRole(role : Text) : async [Book] {
    books.values().toArray().filter(func(b) { b.role == role });
  };

  // Quotes
  public shared ({ caller }) func createOrUpdateQuote(quote : Quote) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create or update quotes");
    };
    quotes.add(quote.text, quote);
  };

  public query ({ caller }) func getQuote(text : Text) : async Quote {
    switch (quotes.get(text)) {
      case (null) { Runtime.trap("Quote not found") };
      case (?quote) { quote };
    };
  };

  public query ({ caller }) func getAllQuotes() : async [Quote] {
    quotes.values().toArray().sort();
  };

  public query ({ caller }) func getOwnQuotes() : async [Quote] {
    quotes.values().toArray().filter(func(q) { q.isOwn });
  };

  public query ({ caller }) func getAllBookLinks() : async [BookLink] {
    bookLinks.values().toArray().sort();
  };

  // Book links
  public shared ({ caller }) func createOrUpdateBookLink(link : BookLink) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create or update book links");
    };
    bookLinks.add(link.title, link);
  };

  public query ({ caller }) func getBookLink(title : Text) : async BookLink {
    switch (bookLinks.get(title)) {
      case (null) { Runtime.trap("Book link not found") };
      case (?link) { link };
    };
  };

  // Subscribers
  public shared ({ caller }) func subscribe(email : Text) : async () {
    if (subscribers.containsKey(email)) {
      Runtime.trap("Already subscribed");
    };
    subscribers.add(email, ());
  };

  public shared ({ caller }) func unsubscribe(email : Text) : async () {
    if (not subscribers.containsKey(email)) {
      Runtime.trap("Not subscribed");
    };
    subscribers.remove(email);
  };

  public query ({ caller }) func getSubscriberCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view subscriber count");
    };
    subscribers.size();
  };

  // Contact messages
  public shared ({ caller }) func submitMessage(msg : ContactMessage) : async () {
    messages.add(caller, msg);
  };

  public query ({ caller }) func getMessage(user : Principal) : async ContactMessage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view messages");
    };
    switch (messages.get(user)) {
      case (null) { Runtime.trap("Message not found") };
      case (?msg) { msg };
    };
  };

  public query ({ caller }) func getMessages() : async [ContactMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all messages");
    };
    messages.values().toArray().sort(ContactMessage.compareByDate);
  };
};
