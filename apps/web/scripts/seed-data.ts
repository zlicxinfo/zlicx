import { nanoid } from "@zlicx/utils";
import "dotenv-flow/config";

const links = [
  {
    id: "clqo10sum0006js08vutzfxt3",
    shortLink: "zli.cx/try",
    url: "https://app.zlicx.com/",
    domain: "zli.cx",
  },
  {
    id: "clvpdmrx40008i19yee46djta",
    shortLink: "zli.cx/brand",
    url: "https://zlicx.com/brand",
    domain: "zli.cx",
  },
  {
    id: "clvl08a4r0001itsl3shc931x",
    shortLink: "zli.cx/gallery",
    url: "https://zlicx.com/blog/product-discovery-platform",
    domain: "zli.cx",
  },
  {
    id: "clu718gfe0001tfinipqgznrz",
    shortLink: "zli.cx/playbook",
    url: "https://zlicx.com/blog/product-hunt",
    domain: "zli.cx",
  },
  {
    id: "clur35t670003ux28e0cgxjjc",
    shortLink: "zli.cx/datetime",
    url: "https://zlicx.com/blog/smart-datetime-picker",
    domain: "zli.cx",
  },
];

const countries = ["US", "IN", "DE", "FR", "GB", "NL", "SG", "CA", "AU", "BR"];

const devices = ["Desktop", "Mobile", "Tablet"];

async function main() {
  // await seedLinkMetadata();
  // await seedClicks();
  // await seedLeads(3269);
  await seedSales(50);
}

// Seed link metadata
async function seedLinkMetadata() {
  for (let i = 0; i < 5; i++) {
    const link = links[i];

    fetch(
      `${process.env.TINYBIRD_API_URL}/v0/events?name=zlicx_links_metadata&wait=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_DEMO_API_KEY}`,
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          link_id: link.id,
          domain: link.domain,
          key: link.shortLink.split("/")[1],
          url: link.url,
          tag_ids: [],
          workspace_id: "ws_cl7pj5kq4006835rbjlt2ofka",
          created_at: new Date().toISOString(),
          deleted: 0,
        }),
      },
    );
  }
}

// Seed click events
async function seedClicks(count = 10000) {
  const data = Array.from({ length: count }).map(() => {
    const link = links[Math.floor(Math.random() * links.length)];

    return {
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      click_id: nanoid(16),
      link_id: link.id,
      url: link.url,
      country: countries[Math.floor(Math.random() * countries.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      alias_link_id: "",
      ip: "63.141.57.109",
      city: "San Francisco",
      region: "CA",
      latitude: "37.7695",
      longitude: "-122.385",
      device_vendor: "Apple",
      device_model: "Macintosh",
      browser: "Chrome",
      browser_version: "124.0.0.0",
      engine: "Blink",
      engine_version: "124.0.0.0",
      os: "Mac OS",
      os_version: "10.15.7",
      cpu_architecture: "Unknown",
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      bot: 0,
      qr: 0,
      referer: "(direct)",
      referer_url: "(direct)",
    };
  });

  const ndjson = data.map((event) => JSON.stringify(event)).join("\n");

  const response = await fetch(
    `${process.env.TINYBIRD_API_URL}/v0/events?name=zlicx_click_events&wait=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_DEMO_API_KEY}`,
      },
      body: ndjson,
    },
  );

  const sent = await response.json();

  console.log("zlicx_click_events", sent);
}

// Seed lead events
async function seedLeads(count = 10) {
  const data = Array.from({ length: count }).map(() => {
    const link = links[Math.floor(Math.random() * links.length)];

    return {
      // random date in the last 30 days
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      event_id: nanoid(16),
      event_name: "Signup",
      customer_id: "xxxx",
      click_id: nanoid(16),
      link_id: link.id,
      url: link.url,
      country: countries[Math.floor(Math.random() * countries.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      metadata: "",
      city: "San Francisco",
      region: "CA",
      latitude: "37.7695",
      longitude: "-122.385",
      device_vendor: "Apple",
      device_model: "Macintosh",
      browser: "Chrome",
      browser_version: "124.0.0.0",
      engine: "Blink",
      engine_version: "124.0.0.0",
      os: "Mac OS",
      os_version: "10.15.7",
      cpu_architecture: "Unknown",
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      bot: 0,
      referer: "(direct)",
      referer_url: "(direct)",
    };
  });

  const ndjson = data.map((event) => JSON.stringify(event)).join("\n");

  const response = await fetch(
    `${process.env.TINYBIRD_API_URL}/v0/events?name=zlicx_lead_events&wait=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_DEMO_API_KEY}`,
      },
      body: ndjson,
    },
  );

  const sent = await response.json();

  console.log("zlicx_lead_events", sent);
}

// Seed sales events
async function seedSales(count = 5) {
  const data = Array.from({ length: count }).map(() => {
    const link = links[Math.floor(Math.random() * links.length)];

    return {
      // random date in the last 30 days
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      event_id: nanoid(16),
      customer_id: "xxxx",
      click_id: nanoid(16),
      link_id: link.id,
      url: link.url,
      country: countries[Math.floor(Math.random() * countries.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      invoice_id: nanoid(16),
      // random amount between $24 and $99
      amount: Math.floor(Math.random() * 75 + 24) * 100,
      currency: "USD",
      payment_processor: "stripe",
      metadata: "",
      city: "San Francisco",
      region: "CA",
      latitude: "37.7695",
      longitude: "-122.385",
      device_vendor: "Apple",
      device_model: "Macintosh",
      browser: "Chrome",
      browser_version: "124.0.0.0",
      engine: "Blink",
      engine_version: "124.0.0.0",
      os: "Mac OS",
      os_version: "10.15.7",
      cpu_architecture: "Unknown",
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      bot: 0,
      referer: "(direct)",
      referer_url: "(direct)",
    };
  });

  const ndjson = data.map((event) => JSON.stringify(event)).join("\n");

  const response = await fetch(
    `${process.env.TINYBIRD_API_URL}/v0/events?name=zlicx_sale_events&wait=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_DEMO_API_KEY}`,
      },
      body: ndjson,
    },
  );

  const sent = await response.json();

  console.log("zlicx_sale_events", sent);
}

main();
