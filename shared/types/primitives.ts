import type { H3Event } from "h3";

export type TNull<T> = T | null;

export type HttpEvent = H3Event<Request>;
