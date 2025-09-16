import _APP_ from "@/constants/_APP_";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard/",
    },
    sitemap: `${_APP_.base_url}/sitemap.xml`,
  };
}
