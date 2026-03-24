import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    title: string;
    body: string;
    date: Time;
    published: boolean;
    category: string;
}
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface BookLink {
    url: string;
    title: string;
    description: string;
    storeName: string;
}
export interface Book {
    title: string;
    bookType: string;
    role: string;
    description: string;
}
export interface Quote {
    text: string;
    isOwn: boolean;
    attribution: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateBook(book: Book): Promise<void>;
    createOrUpdateBookLink(link: BookLink): Promise<void>;
    createOrUpdatePost(post: BlogPost): Promise<void>;
    createOrUpdateQuote(quote: Quote): Promise<void>;
    getAllBookLinks(): Promise<Array<BookLink>>;
    getAllBooks(): Promise<Array<Book>>;
    getAllQuotes(): Promise<Array<Quote>>;
    getBook(title: string): Promise<Book>;
    getBookLink(title: string): Promise<BookLink>;
    getBooksByRole(role: string): Promise<Array<Book>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessage(user: Principal): Promise<ContactMessage>;
    getMessages(): Promise<Array<ContactMessage>>;
    getOwnQuotes(): Promise<Array<Quote>>;
    getPost(title: string): Promise<BlogPost>;
    getPublishedPosts(): Promise<Array<BlogPost>>;
    getQuote(text: string): Promise<Quote>;
    getSubscriberCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitMessage(msg: ContactMessage): Promise<void>;
    subscribe(email: string): Promise<void>;
    unsubscribe(email: string): Promise<void>;
}
