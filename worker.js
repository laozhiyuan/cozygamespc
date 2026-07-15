const STATE_KEY = "main";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const fallbackSiteSettings = {
  title: "Cozy Games PC - Free Online Browser Games | CozyGamesPC",
  description: "Play cozy games pc favorites at CozyGamesPC. Enjoy free browser games for desktop and mobile, including action, arcade, puzzle, racing, and more.",
  homeHeadline: "Cozy Games PC: Free Online Games for Desktop and Mobile",
  iconImage: "",
  iconText: "CG",
  gameTitlePhrase: "Play Online for Free",
  gameDescriptionPhraseB: "online for free",
  gameDescriptionPhraseC: "Start playing now on CozyGamesPC"
};

const fallbackCategories = [
  { name: "Mobile", slug: "mobile", icon: "smartphone", iconImage: "/assets/img/category-mobile.ico", color: "#34c759" }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }

    if (url.pathname === "/robots.txt") {
      return handleRobots(request);
    }

    if (url.pathname === "/sitemap.xml") {
      return handleSitemap(request, env);
    }

    if (url.pathname.startsWith("/media/")) {
      return handleMedia(request, env);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Static assets binding is not configured.", { status: 500 });
  }
};

function handleRobots(request) {
  const origin = new URL(request.url).origin;
  return new Response(`User-agent: *\nAllow: /\nDisallow: /login\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  });
}

async function handleSitemap(request, env) {
  const origin = new URL(request.url).origin;
  const state = publicState(await requireState(request, env));
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: "/", priority: "1.0", changefreq: "daily", lastmod: today },
    { loc: "/new-games", priority: "0.8", changefreq: "daily", lastmod: today },
    { loc: "/popular-games", priority: "0.8", changefreq: "daily", lastmod: today },
    { loc: "/recently-played", priority: "0.4", changefreq: "weekly", lastmod: today },
    { loc: "/tags", priority: "0.7", changefreq: "weekly", lastmod: today }
  ];

  state.categories.forEach((category) => {
    if (category.slug) {
      urls.push({
        loc: `/category/${category.slug}`,
        priority: "0.7",
        changefreq: "weekly",
        lastmod: today
      });
    }
  });

  getTagSlugs(state).forEach((slug) => {
    urls.push({
      loc: `/tags/${slug}`,
      priority: "0.5",
      changefreq: "weekly",
      lastmod: today
    });
  });

  state.games.forEach((game) => {
    if (game.slug) {
      urls.push({
        loc: `/${game.slug}`,
        priority: "0.9",
        changefreq: "weekly",
        lastmod: game.published || today
      });
    }
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (item) => `  <url>\n    <loc>${xmlEscape(origin + item.loc)}</loc>\n    <lastmod>${xmlEscape(item.lastmod)}</lastmod>\n    <changefreq>${xmlEscape(item.changefreq)}</changefreq>\n    <priority>${xmlEscape(item.priority)}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=1800"
    }
  });
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "") || "/";

  try {
    if (path === "/state" && request.method === "GET") {
      const state = await requireState(request, env);
      return json({ state: publicState(state) });
    }

    if (path === "/login" && request.method === "POST") {
      return login(request, env);
    }

    if (path === "/admin/state" && request.method === "GET") {
      const user = await requireUser(request, env);
      const state = await requireState(request, env);
      return json({ user, state: user.role === "admin" ? state : collaboratorState(state) });
    }

    if (path === "/state" && request.method === "POST") {
      const user = await requireUser(request, env);
      const body = await readJson(request);
      const incoming = normalizeState(body.state || {});
      const existing = await requireState(request, env);
      const next = user.role === "admin" ? incoming : mergeCollaboratorState(existing, incoming);
      await saveState(env, next);
      return json({ state: user.role === "admin" ? next : collaboratorState(next) });
    }

    if (path === "/click" && request.method === "POST") {
      const body = await readJson(request);
      const slug = String(body.slug || "").trim();
      if (!slug) return json({ error: "Missing game slug." }, 400);
      const state = await requireState(request, env);
      const game = state.games.find((item) => item.slug === slug);
      if (!game) return json({ error: "Game not found." }, 404);
      game.clicks = Number(game.clicks || 0) + 1;
      await saveState(env, state);
      return json({ slug, clicks: game.clicks });
    }

    if (path === "/upload-image" && request.method === "POST") {
      const user = await requireUser(request, env);
      if (!["admin", "collaborator"].includes(user.role)) {
        return json({ error: "Not allowed." }, 403);
      }
      return uploadImage(request, env);
    }

    return json({ error: "API route not found." }, 404);
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: error.message || "Server error." }, 500);
  }
}

async function login(request, env) {
  const body = await readJson(request);
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const state = await requireState(request, env);
  const user = state.users.find((item) => item.username === username && item.password === password);

  if (!user) {
    return json({ error: "Invalid username or password." }, 401);
  }

  const publicUser = { username: user.username, role: user.role };
  const token = await signToken(
    {
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    },
    env
  );

  return json({ token, user: publicUser });
}

async function uploadImage(request, env) {
  const body = await readJson(request);
  const dataUrl = String(body.dataUrl || "");
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return json({ error: "Invalid image data." }, 400);
  if (parsed.bytes.byteLength > MAX_IMAGE_BYTES) return json({ error: "Image is too large." }, 413);

  if (!env.MEDIA) {
    return json({ url: dataUrl, storage: "inline" });
  }

  const folder = safePathPart(body.folder || "uploads");
  const originalName = safePathPart(String(body.fileName || "image").replace(/\.[^.]+$/, ""));
  const extension = extensionForMime(parsed.mime, body.fileName);
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}-${originalName}.${extension}`;

  await env.MEDIA.put(key, parsed.bytes, {
    httpMetadata: {
      contentType: parsed.mime,
      cacheControl: "public, max-age=31536000, immutable"
    }
  });

  return json({ url: `/media/${key}`, storage: "r2" });
}

async function handleMedia(request, env) {
  if (!env.MEDIA) return new Response("Media bucket is not configured.", { status: 404 });
  const url = new URL(request.url);
  const key = decodeURIComponent(url.pathname.replace(/^\/media\//, ""));
  if (!key || key.includes("..")) return new Response("Not found.", { status: 404 });

  const object = await env.MEDIA.get(key);
  if (!object) return new Response("Not found.", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}

async function requireState(request, env) {
  if (!env.DB) {
    throw json({ error: "Cloudflare D1 binding DB is not configured." }, 501);
  }

  await ensureDatabase(env);
  const row = await env.DB.prepare("SELECT value FROM app_state WHERE key = ?1").bind(STATE_KEY).first();
  if (row && row.value) {
    return normalizeState(JSON.parse(row.value));
  }

  const state = await loadDefaultState(request, env);
  await saveState(env, state);
  return state;
}

async function ensureDatabase(env) {
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  ).run();
}

async function saveState(env, state) {
  const normalized = normalizeState(state);
  await ensureDatabase(env);
  await env.DB.prepare(
    "INSERT OR REPLACE INTO app_state (key, value, updated_at) VALUES (?1, ?2, CURRENT_TIMESTAMP)"
  )
    .bind(STATE_KEY, JSON.stringify(normalized))
    .run();
}

async function loadDefaultState(request, env) {
  if (env.ASSETS) {
    try {
      const url = new URL("/assets/data/default-state.json", request.url);
      const response = await env.ASSETS.fetch(new Request(url));
      if (response.ok) {
        return normalizeState(await response.json());
      }
    } catch (error) {
      // Fall through to the minimal fallback below.
    }
  }

  return normalizeState({
    categories: [],
    games: [],
    users: [{ username: "admin", password: "admin", role: "admin" }],
    deletedSeedGames: [],
    deletedGames: [],
    site: fallbackSiteSettings
  });
}

async function requireUser(request, env) {
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw json({ error: "Missing authorization token." }, 401);

  const payload = await verifyToken(token, env);
  if (!payload) throw json({ error: "Invalid authorization token." }, 401);

  const state = await requireState(request, env);
  const user = state.users.find((item) => item.username === payload.username && item.role === payload.role);
  if (!user) throw json({ error: "User no longer exists." }, 401);

  return { username: user.username, role: user.role };
}

function normalizeState(source) {
  const state = source && typeof source === "object" ? source : {};
  const next = {
    categories: Array.isArray(state.categories) ? state.categories : [],
    games: Array.isArray(state.games) ? state.games : [],
    users: Array.isArray(state.users) ? state.users : [],
    deletedSeedGames: Array.isArray(state.deletedSeedGames) ? state.deletedSeedGames : [],
    deletedGames: Array.isArray(state.deletedGames) ? state.deletedGames : [],
    site: { ...fallbackSiteSettings, ...(state.site || {}) }
  };

  if (next.site.title === "cozygamespc - Free Online Cozy Games for PC and Mobile") {
    next.site.title = fallbackSiteSettings.title;
  }
  if (
    next.site.description === "Play cozygamespc games online with fast search, helpful categories, tags, and mobile-ready browser gameplay." ||
    next.site.description === "Play cozygamespc browser games on PC and mobile. Discover action, arcade, puzzle, strategy, racing, and superhero games with fast search and friendly navigation."
  ) {
    next.site.description = fallbackSiteSettings.description;
  }

  next.games.forEach((game) => delete game.size);
  next.deletedGames.forEach((game) => delete game.size);

  fallbackCategories.forEach((category) => {
    if (!next.categories.some((item) => item.slug === category.slug)) {
      next.categories.push(clone(category));
    }
  });

  if (!next.users.some((user) => user.username === "admin")) {
    next.users.push({ username: "admin", password: "admin", role: "admin" });
  }

  return clone(next);
}

function publicState(state) {
  const next = clone(state);
  delete next.users;
  next.deletedGames = [];
  return next;
}

function collaboratorState(state) {
  const next = clone(state);
  next.users = [];
  return next;
}

function mergeCollaboratorState(existing, incoming) {
  const next = normalizeState(existing);
  next.categories = mergeBySlug(next.categories, incoming.categories);
  next.games = mergeBySlug(next.games, incoming.games);
  return next;
}

function mergeBySlug(existing, incoming) {
  const existingBySlug = new Map(existing.map((item) => [item.slug, item]));
  const used = new Set();
  const merged = [];

  incoming.forEach((item) => {
    if (!item || !item.slug) return;
    merged.push(item);
    used.add(item.slug);
  });

  existingBySlug.forEach((item, slug) => {
    if (!used.has(slug)) merged.push(item);
  });

  return merged;
}

function getTagSlugs(state) {
  const tags = new Set();
  state.games.forEach((game) => {
    (game.tags || []).forEach((tag) => {
      const slug = slugify(tag);
      if (slug) tags.add(slug);
    });
  });
  return Array.from(tags).sort();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    throw json({ error: "Invalid JSON body." }, 400);
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseDataUrl(dataUrl) {
  const match = /^data:([a-z0-9.+/-]+);base64,([\s\S]+)$/i.exec(dataUrl);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  if (!mime.startsWith("image/")) return null;

  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return { mime, bytes };
}

function extensionForMime(mime, fileName) {
  const cleanName = String(fileName || "").toLowerCase();
  const fromName = cleanName.match(/\.([a-z0-9]+)$/);
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(fromName[1])) {
    return fromName[1] === "jpeg" ? "jpg" : fromName[1];
  }

  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg"
  };
  return map[mime] || "jpg";
}

function safePathPart(value) {
  const clean = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || "image";
}

async function signToken(payload, env) {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmac(encoded, env);
  return `${encoded}.${signature}`;
}

async function verifyToken(token, env) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) return null;

  const expected = await hmac(encoded, env);
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

async function hmac(value, env) {
  const secret = env.AUTH_SECRET || "change-this-secret-before-production";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function base64UrlEncode(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}
