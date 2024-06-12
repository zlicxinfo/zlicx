import { recordClick } from "@/lib/tinybird";
import { formatRedisDomain, redis } from "@/lib/upstash";
import { ZLICX_HEADERS } from "@zlicx/utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getDomainViaEdge } from "../planetscale";
import { RedisDomainProps } from "../types";
import { parse } from "./utils";

export default async function RootMiddleware(
  req: NextRequest,
  ev: NextFetchEvent,
) {
  const { domain } = parse(req);

  if (!domain) {
    return NextResponse.next();
  }

  let link = await redis.hget<RedisDomainProps>(domain, "_root");

  if (!link) {
    const linkData = await getDomainViaEdge(domain);

    if (!linkData) {
      // rewrite to placeholder page if domain doesn't exist
      return NextResponse.rewrite(new URL(`/${domain}`, req.url), {
        headers: {
          ...ZLICX_HEADERS,
        },
      });
    }

    // format link to fit the RedisLinkProps interface
    link = await formatRedisDomain(linkData as any);

    ev.waitUntil(
      redis.hset(domain, {
        _root: link,
      }),
    );
  }

  const { id: linkId, url, rewrite, iframeable, noindex } = link;

  // record clicks on root page
  ev.waitUntil(recordClick({ req, linkId, ...(url && { url }), root: true }));

  if (!url) {
    // rewrite to placeholder page unless the user defines a site to redirect to
    return NextResponse.rewrite(new URL(`/${domain}`, req.url), {
      headers: {
        ...ZLICX_HEADERS,
      },
    });
  }

  if (rewrite) {
    if (iframeable) {
      return NextResponse.rewrite(
        new URL(`/cloaked/${encodeURIComponent(url)}`, req.url),
        {
          headers: {
            ...ZLICX_HEADERS,
            ...(noindex && { "X-Robots-Tag": "googlebot: noindex" }),
          },
        },
      );
    } else {
      // if link is not iframeable, use Next.js rewrite instead
      return NextResponse.rewrite(url, {
        headers: {
          ...ZLICX_HEADERS,
          ...(noindex && { "X-Robots-Tag": "googlebot: noindex" }),
        },
      });
    }
  } else {
    // For root links that have a destination URL, use 301 status code (for SEO purposes)
    return NextResponse.redirect(url, {
      headers: {
        ...ZLICX_HEADERS,
        ...(noindex && { "X-Robots-Tag": "googlebot: noindex" }),
      },
      status: 301,
    });
  }
}
