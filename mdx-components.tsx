import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold">{children}</h3>,
  p: ({ children }) => <p className="text-base">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-blue-600 hover:underline">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-inside list-disc p-2">{children}</ul>
  ),
  li: ({ children }) => <li className="list-inside list-disc">{children}</li>,
  u: ({ children }) => (
    <span style={{ textDecoration: "underline" }}>{children}</span>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
