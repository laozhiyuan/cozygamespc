(function () {
  "use strict";

  const SITE_URL = "https://cozygamespc.com";
  const DATA_KEY = "cozygamespc:data:v1";
  const SESSION_KEY = "cozygamespc:session:v1";
  const REMOTE_SESSION_KEY = "cozygamespc:remote-session:v1";
  const RECENT_KEY = "cozygamespc:recent:v1";
  const FIRST_GAME_IFRAME = "https://html5.gamemonetize.games/ztnooa2wmbczll7r6hd4kj6vyym4z6x6/";
  const DEFAULT_OG_ASSET = "assets/img/cozygamespc-og.png";
  const HOME_INTRO_IMAGE_ASSET = "assets/img/cozygamespc-og.webp";
  const DEFAULT_OG_IMAGE = `${SITE_URL}/${DEFAULT_OG_ASSET}`;
  const DEFAULT_GAME_ASPECT_RATIO = "1024 / 512";
  const SHEETJS_URL = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
  const DEFAULT_IFRAME_PERMISSIONS = {
    allowAutoRedirect: false,
    allowPopups: true,
    allowPopupEscape: false,
    allowFullscreen: false,
    allowClickRedirect: false
  };
  const IS_FILE_PREVIEW = window.location.protocol === "file:";
  const FILE_BASE_PATH = IS_FILE_PREVIEW ? decodeURIComponent(window.location.pathname.replace(/\/[^/]*$/, "/")) : "/";
  const API_ENABLED = !IS_FILE_PREVIEW;
  const API_BASE = "/api";

  const seedCategories = [
    { name: "Action", slug: "action", icon: "zap", color: "#007aff" },
    { name: "Arcade", slug: "arcade", icon: "joystick", color: "#af52de" },
    { name: "Mobile", slug: "mobile", icon: "smartphone", iconImage: "/assets/img/category-mobile.ico", color: "#34c759" },
    { name: "Fighting", slug: "fighting", icon: "swords", color: "#ff3b30" },
    { name: "Adventure", slug: "adventure", icon: "compass", color: "#34c759" },
    { name: "Puzzle", slug: "puzzle", icon: "puzzle", color: "#ff9500" },
    { name: "Racing", slug: "racing", icon: "gauge", color: "#ff2d55" },
    { name: "Sports", slug: "sports", icon: "trophy", color: "#30b0c7" },
    { name: "Strategy", slug: "strategy", icon: "brain", color: "#5856d6" },
    { name: "Shooting", slug: "shooting", icon: "crosshair", color: "#ff9f0a" }
  ];

  const seedGames = [
    {
      title: "Stickman Warriors Superhero Fight",
      slug: "stickman-warriors-superhero-fight",
      oneLine: "A fast superhero stickman brawler built around dodges, combos, skills, and smart defense.",
      iframeUrl: FIRST_GAME_IFRAME,
      mobileReady: true,
      categories: ["action", "arcade"],
      tags: ["Arena", "Fighting", "Stickman", "Superhero"],
      description:
        "Stickman Warriors Superhero Fight delivers fast-paced battles where every dodge, combo, and special move creates an exciting action moment. This game brings together intense combat and hero progression, making it a great choice for fans of stickman fighting games. If you enjoy explosive combat, character upgrades, and fast action, this game delivers the excitement fans expect from Superhero action games and intense battle games.",
      instructions:
        "On PC WASD: Move your character. I/U/O: Skill. K: Defense. J: Attack. L: Displacement. Space: Gathering Strength. On Mobile Click the on-screen button: Operate.",
      published: "2026-07-10",
      clicks: 18420,
      initials: "SW",
      poster: ["#ff3b30", "#5856d6"]
    },
    {
      title: "Neon Drift Circuit",
      slug: "neon-drift-circuit",
      oneLine: "Slide through bright city curves and chain clean racing lines for high score runs.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["racing", "arcade"],
      tags: ["Drift", "Racing", "Neon", "Skill"],
      description:
        "Neon Drift Circuit is a quick racing challenge where smooth turns, clean boosts, and sharp timing turn each lap into a polished arcade sprint.",
      instructions: "Use arrow keys or WASD to drive. Tap the on-screen steering controls on mobile.",
      published: "2026-07-09",
      clicks: 14230,
      initials: "ND",
      poster: ["#007aff", "#30b0c7"]
    },
    {
      title: "Cloud Cafe Tiles",
      slug: "cloud-cafe-tiles",
      oneLine: "Match soft cafe tiles, clear trays, and build a relaxed puzzle streak.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["puzzle"],
      tags: ["Match", "Tiles", "Relaxing", "Puzzle"],
      description:
        "Cloud Cafe Tiles blends gentle matching goals with quick rounds, making it easy to play a calm puzzle session between bigger games.",
      instructions: "Click or tap matching tiles to clear the board before the tray fills.",
      published: "2026-07-08",
      clicks: 9800,
      initials: "CT",
      poster: ["#ff9500", "#34c759"]
    },
    {
      title: "Solar Skate Rush",
      slug: "solar-skate-rush",
      oneLine: "Ride rails, collect sparks, and keep your run alive across a sunny arcade course.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["arcade", "sports"],
      tags: ["Skate", "Runner", "Arcade", "Score"],
      description:
        "Solar Skate Rush is a score-focused skating game where each jump, grind, and near miss helps build a brighter combo chain.",
      instructions: "Use arrow keys to move and Space to jump. Swipe on mobile.",
      published: "2026-07-07",
      clicks: 12110,
      initials: "SS",
      poster: ["#ffcc00", "#007aff"]
    },
    {
      title: "Bento Battle Tactics",
      slug: "bento-battle-tactics",
      oneLine: "Place tiny heroes, plan each lane, and win compact tactical battles.",
      iframeUrl: "",
      mobileReady: false,
      categories: ["strategy"],
      tags: ["Tactics", "Defense", "Strategy", "Heroes"],
      description:
        "Bento Battle Tactics turns small maps into clever decisions, asking players to balance placement, upgrades, and timing.",
      instructions: "Use the mouse to place units and trigger upgrades between waves.",
      published: "2026-07-06",
      clicks: 8650,
      initials: "BT",
      poster: ["#5856d6", "#ff9500"]
    },
    {
      title: "Crystal Harbor Quest",
      slug: "crystal-harbor-quest",
      oneLine: "Explore coastal paths, unlock cozy secrets, and collect bright crystal rewards.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["adventure"],
      tags: ["Quest", "Explore", "Collect", "Adventure"],
      description:
        "Crystal Harbor Quest is a friendly adventure game with short routes, collectible goals, and a clean browser-friendly flow.",
      instructions: "Move with WASD or arrow keys. Use E to interact. Tap highlighted controls on mobile.",
      published: "2026-07-05",
      clicks: 10590,
      initials: "CH",
      poster: ["#34c759", "#30b0c7"]
    },
    {
      title: "Metro Keyboard Racer",
      slug: "metro-keyboard-racer",
      oneLine: "Type, dodge, and race through a metro course that rewards quick fingers.",
      iframeUrl: "",
      mobileReady: false,
      categories: ["racing"],
      tags: ["Typing", "Racing", "Keyboard", "Speed"],
      description:
        "Metro Keyboard Racer mixes racing pressure with typing rhythm, creating a focused PC-first challenge for fast players.",
      instructions: "Type the prompted keys to accelerate and use arrow keys to dodge obstacles.",
      published: "2026-07-04",
      clicks: 7600,
      initials: "MR",
      poster: ["#8e8e93", "#007aff"]
    },
    {
      title: "Turbo Block Arena",
      slug: "turbo-block-arena",
      oneLine: "Dash through blocky arenas, grab boosts, and outplay every wave.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["action", "arcade"],
      tags: ["Arena", "Blocks", "Action", "Boost"],
      description:
        "Turbo Block Arena is built for short, energetic browser sessions with readable arenas, quick restarts, and punchy upgrades.",
      instructions: "Move with WASD, aim with the mouse, and click to attack. Use touch controls on mobile.",
      published: "2026-07-03",
      clicks: 15340,
      initials: "TB",
      poster: ["#ff2d55", "#ff9500"]
    },
    {
      title: "Pocket Goal Stars",
      slug: "pocket-goal-stars",
      oneLine: "Take quick shots, bend clean goals, and climb a compact soccer challenge.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["sports", "arcade"],
      tags: ["Soccer", "Goal", "Sports", "Arcade"],
      description:
        "Pocket Goal Stars keeps soccer fast and friendly with simple aiming, short rounds, and satisfying goal effects.",
      instructions: "Drag to aim, release to shoot, and time each shot around defenders.",
      published: "2026-07-02",
      clicks: 11720,
      initials: "PG",
      poster: ["#34c759", "#007aff"]
    },
    {
      title: "Cyber Range Lite",
      slug: "cyber-range-lite",
      oneLine: "Practice clean aim in compact target rooms with quick restart rounds.",
      iframeUrl: "",
      mobileReady: false,
      categories: ["shooting", "action"],
      tags: ["Aim", "Shooting", "Target", "Skill"],
      description:
        "Cyber Range Lite is a browser shooting trainer for players who want short target runs, crisp feedback, and better aim control.",
      instructions: "Move with WASD, aim with the mouse, click to fire, and press R to reload.",
      published: "2026-07-01",
      clicks: 13280,
      initials: "CR",
      poster: ["#30b0c7", "#5856d6"]
    },
    {
      title: "Garden Merge Studio",
      slug: "garden-merge-studio",
      oneLine: "Merge garden pieces, unlock calm upgrades, and shape a tidy little studio.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["puzzle", "strategy"],
      tags: ["Merge", "Garden", "Relaxing", "Upgrade"],
      description:
        "Garden Merge Studio offers a gentle merge loop where planning space and timing upgrades keeps the board blooming.",
      instructions: "Drag matching pieces together to merge them. Tap goals to collect rewards.",
      published: "2026-06-30",
      clicks: 9400,
      initials: "GM",
      poster: ["#34c759", "#ffcc00"]
    },
    {
      title: "Starline Defense Lab",
      slug: "starline-defense-lab",
      oneLine: "Build compact defenses, tune upgrades, and hold the starline wave by wave.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["strategy", "shooting"],
      tags: ["Defense", "Space", "Strategy", "Upgrade"],
      description:
        "Starline Defense Lab gives strategy players clear lanes, tight upgrade choices, and a polished defense rhythm.",
      instructions: "Place towers with the mouse or tap controls. Upgrade between waves.",
      published: "2026-06-29",
      clicks: 10990,
      initials: "SD",
      poster: ["#5856d6", "#30b0c7"]
    },
    {
      title: "Ocean Dash Arcade",
      slug: "ocean-dash-arcade",
      oneLine: "Zip through water lanes, dodge hazards, and chase a breezy arcade score.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["arcade", "adventure"],
      tags: ["Dash", "Ocean", "Arcade", "Collect"],
      description:
        "Ocean Dash Arcade is a colorful quick-play route game with simple controls, short goals, and clean mobile support.",
      instructions: "Use arrow keys or swipe to switch lanes and collect bright tokens.",
      published: "2026-06-28",
      clicks: 10140,
      initials: "OD",
      poster: ["#007aff", "#34c759"]
    },
    {
      title: "Pixel Ninja Rescue",
      slug: "pixel-ninja-rescue",
      oneLine: "Dash through compact stages, rescue allies, and time every jump with clean ninja precision.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["action", "adventure"],
      tags: ["Ninja", "Platform", "Rescue", "Action"],
      description:
        "Pixel Ninja Rescue is a quick action platform game built around sharp jumps, readable hazards, and short rescue missions that fit neatly into browser play.",
      instructions: "Use WASD or arrow keys to move and jump. Tap the on-screen controls on mobile.",
      published: "2026-06-27",
      clicks: 9050,
      initials: "PN",
      poster: ["#1d1d1f", "#34c759"]
    },
    {
      title: "Rocket Basket Sprint",
      slug: "rocket-basket-sprint",
      oneLine: "Boost down the court, dodge defenders, and land fast arcade basketball shots.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["sports", "arcade"],
      tags: ["Basketball", "Sprint", "Sports", "Score"],
      description:
        "Rocket Basket Sprint turns basketball into a bright arcade run where quick movement and clean shot timing decide each round.",
      instructions: "Move with arrow keys or WASD. Press Space to shoot, or tap the shoot button on mobile.",
      published: "2026-06-26",
      clicks: 8300,
      initials: "RB",
      poster: ["#ff9500", "#007aff"]
    },
    {
      title: "Puzzle Bloom Path",
      slug: "puzzle-bloom-path",
      oneLine: "Connect garden paths, open flower gates, and solve calm puzzle boards.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["puzzle"],
      tags: ["Path", "Garden", "Logic", "Puzzle"],
      description:
        "Puzzle Bloom Path is a relaxed logic game where each path connection opens a gentle board goal and rewards tidy planning.",
      instructions: "Click or tap tiles to rotate paths and connect each flower gate.",
      published: "2026-06-25",
      clicks: 7900,
      initials: "PB",
      poster: ["#34c759", "#ffcc00"]
    },
    {
      title: "Mecha Core Duel",
      slug: "mecha-core-duel",
      oneLine: "Pilot a compact mech, chain attacks, and win fast one-on-one arena duels.",
      iframeUrl: "",
      mobileReady: false,
      categories: ["fighting", "action"],
      tags: ["Mecha", "Duel", "Arena", "Fighting"],
      description:
        "Mecha Core Duel focuses on short browser battles with clear attacks, defensive timing, and upgrade-like momentum between rounds.",
      instructions: "Use WASD to move, J to attack, K to guard, and L to dash.",
      published: "2026-06-24",
      clicks: 7200,
      initials: "MC",
      poster: ["#ff3b30", "#8e8e93"]
    },
    {
      title: "Skyline Kart Club",
      slug: "skyline-kart-club",
      oneLine: "Race rooftop tracks, grab boosts, and keep clean lines across city curves.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["racing"],
      tags: ["Kart", "Racing", "Boost", "City"],
      description:
        "Skyline Kart Club delivers compact kart racing with bright routes, boost pickups, and quick restarts for score chasing.",
      instructions: "Use arrow keys or WASD to drive. Tap left and right controls on mobile.",
      published: "2026-06-23",
      clicks: 6800,
      initials: "SK",
      poster: ["#30b0c7", "#5856d6"]
    },
    {
      title: "Astro Shield Command",
      slug: "astro-shield-command",
      oneLine: "Manage shield lanes, stop incoming waves, and protect your tiny orbital station.",
      iframeUrl: "",
      mobileReady: true,
      categories: ["strategy", "shooting"],
      tags: ["Space", "Shield", "Defense", "Strategy"],
      description:
        "Astro Shield Command combines lane defense and shooting pressure, asking players to place shields and react before waves break through.",
      instructions: "Click or tap a lane to place shields. Use upgrades between waves to improve defense.",
      published: "2026-06-22",
      clicks: 6400,
      initials: "AS",
      poster: ["#5856d6", "#007aff"]
    }
  ];

  const seedUsers = [
    { username: "admin", password: "admin", role: "admin" }
  ];

  const defaultSiteSettings = {
    title: "Cozy Games PC - Free Online Browser Games | CozyGamesPC",
    description: "Play cozy games pc favorites at CozyGamesPC. Enjoy free browser games for desktop and mobile, including action, arcade, puzzle, racing, and more.",
    homeHeadline: "Cozy Games PC: Free Online Games for Desktop and Mobile",
    iconImage: "",
    iconText: "CG",
    gameTitlePhrase: "Play Online for Free",
    gameDescriptionPhraseB: "online for free",
    gameDescriptionPhraseC: "Start playing now on CozyGamesPC"
  };

  let state = loadState();
  let browserStateSnapshot = clone(state);
  let lastSearchMatches = [];
  let lastRenderedLocation = "";
  let toastTimer = 0;
  let pendingBulkGames = [];
  let pendingBulkImages = new Map();
  let cloudSyncActive = false;
  let remoteSaveTimer = 0;
  let lastRemoteSaveError = "";
  let sheetJSPromise = null;

  const app = document.getElementById("app");
  const searchWrap = document.getElementById("searchWrap");
  const searchInput = document.getElementById("siteSearch");
  const searchPanel = document.getElementById("searchPanel");
  const searchResults = document.getElementById("searchResults");
  const quickCategories = document.getElementById("quickCategories");

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("submit", handleSubmit);
  document.addEventListener("change", handleChange);
  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);

  if (searchInput) {
    searchInput.addEventListener("focus", showSearchPanel);
    searchInput.addEventListener("input", handleSearchInput);
    searchInput.addEventListener("keydown", handleSearchKeydown);
  }

  document.addEventListener("input", handleDocumentInput);

  render();
  bootstrapRemoteState();

  function loadState() {
    const saved = readJSON(DATA_KEY);
    return normalizeState(saved || createDefaultState());
  }

  function createDefaultState() {
    return clone({
      categories: seedCategories,
      games: seedGames,
      users: seedUsers,
      deletedSeedGames: [],
      deletedGames: [],
      site: defaultSiteSettings
    });
  }

  function normalizeState(saved) {
    const next = {
      categories: Array.isArray(saved.categories) ? saved.categories : [],
      games: Array.isArray(saved.games) ? saved.games : [],
      users: Array.isArray(saved.users) ? saved.users : [],
      deletedSeedGames: Array.isArray(saved.deletedSeedGames) ? saved.deletedSeedGames : [],
      deletedGames: Array.isArray(saved.deletedGames) ? saved.deletedGames : [],
      site: { ...defaultSiteSettings, ...(saved.site || {}) }
    };

    if (next.site.title === "cozygamespc - Free Online Cozy Games for PC and Mobile") {
      next.site.title = defaultSiteSettings.title;
    }
    if (
      next.site.description === "Play cozygamespc games online with fast search, helpful categories, tags, and mobile-ready browser gameplay." ||
      next.site.description === "Play cozygamespc browser games on PC and mobile. Discover action, arcade, puzzle, strategy, racing, and superhero games with fast search and friendly navigation."
    ) {
      next.site.description = defaultSiteSettings.description;
    }

    next.games.forEach(normalizeGameRecord);
    next.deletedGames.forEach(normalizeGameRecord);

    seedCategories.forEach((category) => {
      if (!next.categories.some((item) => item.slug === category.slug)) {
        next.categories.push(clone(category));
      }
    });

    seedGames.forEach((game) => {
      const isDeleted = next.deletedSeedGames.includes(game.slug) || next.deletedGames.some((item) => item.slug === game.slug);
      if (!isDeleted && !next.games.some((item) => item.slug === game.slug)) {
        const clonedGame = clone(game);
        normalizeGameRecord(clonedGame);
        next.games.push(clonedGame);
      }
    });

    if (!next.users.some((user) => user.username === "admin")) {
      next.users.push(clone(seedUsers[0]));
    }

    return next;
  }

  function saveState(options = {}) {
    localStorage.setItem(DATA_KEY, JSON.stringify(state));
    if (!options.localOnly) {
      queueRemoteStateSave();
    }
  }

  async function bootstrapRemoteState() {
    if (!API_ENABLED) return;

    const token = getRemoteToken();
    const endpoint = token ? "/admin/state" : "/state";

    try {
      const response = await apiFetch(endpoint, { token, silent: true });
      if (!response || !response.ok) return;
      const payload = await response.json();
      if (!payload || !payload.state) return;

      cloudSyncActive = true;
      state = normalizeState(payload.state);
      localStorage.setItem(DATA_KEY, JSON.stringify(state));
      render();
    } catch (error) {
      cloudSyncActive = false;
    }
  }

  function queueRemoteStateSave() {
    if (!API_ENABLED || !getRemoteToken()) return;
    window.clearTimeout(remoteSaveTimer);
    remoteSaveTimer = window.setTimeout(syncStateToRemote, 250);
  }

  async function syncStateToRemote() {
    const token = getRemoteToken();
    if (!token) return;

    try {
      const response = await apiFetch("/state", {
        method: "POST",
        token,
        body: { state }
      });

      if (!response || !response.ok) {
        throw new Error("Cloud save failed");
      }

      const payload = await response.json();
      if (payload && payload.state) {
        cloudSyncActive = true;
        state = normalizeState(payload.state);
        localStorage.setItem(DATA_KEY, JSON.stringify(state));
        lastRemoteSaveError = "";
      }
    } catch (error) {
      cloudSyncActive = false;
      const message = "Cloud save failed. This change is only saved in this browser until Cloudflare D1/R2 is configured.";
      if (lastRemoteSaveError !== message) {
        lastRemoteSaveError = message;
        toast(message);
      }
    }
  }

  async function apiFetch(path, options = {}) {
    if (!API_ENABLED) return null;

    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    let body = options.body;
    if (typeof body !== "undefined") {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(body);
    }

    if (options.token) {
      headers.set("Authorization", `Bearer ${options.token}`);
    }

    return fetch(`${API_BASE}${path}`, {
      method: options.method || (typeof body === "undefined" ? "GET" : "POST"),
      headers,
      body
    });
  }

  function getRemoteToken() {
    const session = readJSON(REMOTE_SESSION_KEY);
    return session && session.token ? session.token : "";
  }

  function setRemoteSession(payload) {
    if (!payload || !payload.token || !payload.user) return;
    localStorage.setItem(REMOTE_SESSION_KEY, JSON.stringify({ token: payload.token, user: payload.user }));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: payload.user.username, role: payload.user.role, remote: true }));
  }

  async function fetchRemoteAdminState() {
    const token = getRemoteToken();
    if (!API_ENABLED || !token) return false;

    try {
      const response = await apiFetch("/admin/state", { token });
      if (!response || !response.ok) return false;
      const payload = await response.json();
      if (!payload || !payload.state) return false;
      cloudSyncActive = true;
      state = normalizeState(payload.state);
      localStorage.setItem(DATA_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      return false;
    }
  }

  function readJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getSiteSettings() {
    return { ...defaultSiteSettings, ...(state.site || {}) };
  }

  function render() {
    const legacyRoute = window.location.hash ? parseLegacyHash(window.location.hash) : null;
    if (legacyRoute) {
      navigateTo(legacyRoute.page, legacyRoute.value, { replace: true });
      return;
    }

    const currentLocation = window.location.pathname + window.location.search + window.location.hash;
    const routeChanged = currentLocation !== lastRenderedLocation;
    lastRenderedLocation = currentLocation;

    renderNavigation();
    renderSearchCategories();
    renderStaticLinks();

    const route = parseRoute();
    const html = renderRoute(route);
    app.innerHTML = html;
    app.setAttribute("data-page", route.page);
    setActiveNavigation(route);
    refreshIcons();

    if (route.page !== "admin") {
      document.body.classList.remove("sidebar-open");
    }

    if (routeChanged) {
      scrollToPageTop();
    }
  }

  function scrollToPageTop() {
    const reset = () => {
      const scroller = document.scrollingElement || document.documentElement;
      if (scroller) scroller.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    reset();
    window.requestAnimationFrame(reset);
    [40, 120, 260, 520, 900, 1400].forEach((delay) => window.setTimeout(reset, delay));
    window.setTimeout(() => {
      document.documentElement.style.scrollBehavior = previousBehavior;
    }, 1500);
  }

  function parseRoute() {
    if (window.location.hash) {
      const legacyRoute = parseLegacyHash(window.location.hash);
      if (legacyRoute) return legacyRoute;
    }

    const routeParam = new URLSearchParams(window.location.search).get("route");
    if (routeParam) return parseRouteFromPath(routeParam);

    return parseRouteFromPath(window.location.pathname);
  }

  function parseLegacyHash(hash) {
    const raw = decodeURIComponent((hash || "").replace(/^#\/?/, ""));
    if (!raw || raw === "home") return { page: "home", value: "" };
    if (raw === "recent") return { page: "recent", value: "" };
    if (raw === "latest") return { page: "latest", value: "" };
    if (raw === "popular") return { page: "popular", value: "" };
    if (raw === "admin") return { page: "admin", value: "categories" };
    if (raw === "login") return { page: "login", value: "" };
    if (raw === "tags") return { page: "tags", value: "" };
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return null;
    if (!["category", "tag", "search", "game"].includes(parts[0])) return null;
    return {
      page: parts[0],
      value: parts.slice(1).join("/")
    };
  }

  function parseRouteFromPath(pathname) {
    let path = decodeURIComponent(pathname || "/");
    if (IS_FILE_PREVIEW && path.startsWith(FILE_BASE_PATH)) {
      path = "/" + path.slice(FILE_BASE_PATH.length);
    }

    path = path.replace(/\/index\.html?$/i, "/").replace(/\/+$/, "");
    const parts = path.split("/").filter(Boolean);
    const first = parts[0] || "";
    const second = parts[1] || "";

    if (!first) return { page: "home", value: "" };
    if (first === "recently-played") return { page: "recent", value: "" };
    if (first === "new-games") return { page: "latest", value: "" };
    if (first === "popular-games") return { page: "popular", value: "" };
    if (first === "login") return { page: "login", value: "" };
    if (first === "admin") return { page: "admin", value: second || "categories" };
    if (first === "category") return { page: "category", value: second };
    if (first === "tags") return second ? { page: "tag", value: second } : { page: "tags", value: "" };
    if (first === "search") return { page: "search", value: parts.slice(1).join("/") };
    if (first === "games" && second) return { page: "game", value: second };
    return { page: "game", value: first };
  }

  function pathFor(page, value) {
    switch (page) {
      case "home":
        return "/";
      case "recent":
        return "/recently-played";
      case "latest":
        return "/new-games";
      case "popular":
        return "/popular-games";
      case "category":
        return `/category/${value || ""}`;
      case "tags":
        return "/tags";
      case "tag":
        return `/tags/${value || ""}`;
      case "search":
        return `/search/${encodeURIComponent(value || "")}`;
      case "admin":
        return `/admin/${value || "categories"}`;
      case "login":
        return "/login";
      case "game":
        return `/${value || ""}`;
      default:
        return "/";
    }
  }

  function browserPathFor(page, value) {
    const cleanPath = pathFor(page, value);
    if (!IS_FILE_PREVIEW) return cleanPath;
    return cleanPath === "/" ? "index.html" : `index.html?route=${encodeURIComponent(cleanPath)}`;
  }

  function hrefFor(page, value) {
    return browserPathFor(page, value);
  }

  function assetPath(path) {
    const cleanPath = String(path || "").replace(/^\/+/, "");
    return IS_FILE_PREVIEW ? `${FILE_BASE_PATH}${cleanPath}` : `/${cleanPath}`;
  }

  function displayImageSrc(src) {
    const value = String(src || "").trim();
    if (!value) return "";
    if (IS_FILE_PREVIEW && value.startsWith("/assets/")) {
      return `${FILE_BASE_PATH}${value.replace(/^\/+/, "")}`;
    }
    return value;
  }

  function navigateTo(page, value, options = {}) {
    const nextPath = browserPathFor(page, value);
    if (options.replace) {
      window.history.replaceState({}, "", nextPath);
    } else {
      window.history.pushState({}, "", nextPath);
    }
    scrollToPageTop();
    render();
  }

  function routeFromHref(href) {
    if (!href || href === "#app") return null;
    if (href.startsWith("#")) return parseLegacyHash(href);
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return null;
    if (/^https?:\/\//i.test(href) && !href.startsWith(SITE_URL)) return null;
    const url = new URL(href, window.location.href);
    const routeParam = url.searchParams.get("route");
    if (routeParam) return parseRouteFromPath(routeParam);
    return parseRouteFromPath(url.pathname);
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function adminEditPath(section, key) {
    const separator = browserPathFor("admin", section).includes("?") ? "&" : "?";
    return `${browserPathFor("admin", section)}${separator}edit=${encodeURIComponent(key)}`;
  }

  function appleColors() {
    return [
      { name: "Blue", value: "#007aff" },
      { name: "Green", value: "#34c759" },
      { name: "Indigo", value: "#5856d6" },
      { name: "Orange", value: "#ff9500" },
      { name: "Pink", value: "#ff2d55" },
      { name: "Red", value: "#ff3b30" },
      { name: "Teal", value: "#30b0c7" },
      { name: "Yellow", value: "#ffcc00" },
      { name: "Gray", value: "#8e8e93" }
    ];
  }

  function renderRoute(route) {
    switch (route.page) {
      case "recent":
        return renderListingPage({
          title: "Recently Played Games",
          intro: "Return to the cozygamespc titles you opened most recently. The list is stored locally in this browser.",
          icon: "clock-3",
          games: getRecentlyPlayedGames().slice(0, 60),
          fallback: getLatestGames().slice(0, 60),
          canonicalPath: "/recently-played/"
        });
      case "latest":
        return renderListingPage({
          title: "New Games",
          intro: "Browse the newest games published on cozygamespc, sorted by launch date.",
          icon: "sparkles",
          games: getLatestGames().slice(0, 60),
          canonicalPath: "/new-games/"
        });
      case "popular":
        return renderListingPage({
          title: "Popular Games",
          intro: "The most played cozygamespc games, ordered by total clicks and player interest.",
          icon: "flame",
          games: getPopularGames().slice(0, 60),
          canonicalPath: "/popular-games/"
        });
      case "category":
        return renderCategoryPage(route.value);
      case "tags":
        return renderTagsPage();
      case "tag":
        return renderTagPage(route.value);
      case "search":
        return renderSearchPage(route.value);
      case "game":
        return renderGamePage(route.value);
      case "login":
        return renderLoginPage();
      case "admin":
        return renderAdminPage(route.value || "categories");
      case "home":
      default:
        return renderHomePage();
    }
  }

  function renderHomePage() {
    const latest = getLatestGames();
    const popular = getPopularGames();
    const recent = getRecentlyPlayedGames();
    const recentGames = (recent.length ? recent : latest).slice(0, 12);
    const site = getSiteSettings();

    setMeta({
      title: site.title,
      description: site.description,
      canonical: SITE_URL + "/",
      image: DEFAULT_OG_IMAGE,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Cozy Games PC",
        url: SITE_URL + "/",
        potentialAction: {
          "@type": "SearchAction",
          target: SITE_URL + "/search/{search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    });

    const categorySections = state.categories
      .map((category) => ({
        category,
        games: gamesInCategory(category.slug).slice(0, 8)
      }))
      .filter((section) => section.games.length);

    return `
      <div class="page-shell">
        ${renderHomeIntro()}

        ${renderGameSection({
          title: "Recently Played",
          description: recent.length ? "Your latest cozygamespc game sessions." : "Start with the newest games until your local play history grows.",
          games: recentGames,
          href: hrefFor("recent")
        })}

        ${renderGameSection({
          title: "Recommended Cozy Games",
          description: "Popular browser games selected from click activity and player interest.",
          games: popular.slice(0, 10),
          href: hrefFor("popular"),
          hideHeader: true
        })}

        ${renderCategorySection()}

        ${renderGameSection({
          title: "New Browser Games",
          description: "Freshly published online games on CozyGamesPC.",
          games: latest.slice(0, 10),
          href: hrefFor("latest")
        })}

        ${categorySections
          .map((section) =>
            renderGameSection({
              title: section.category.name,
              description: `${section.category.name} games from the cozygamespc library.`,
              games: section.games,
              href: hrefFor("category", section.category.slug)
            })
          )
          .join("")}

        ${renderHomeSeoContent()}

        <div class="footer-actions">
          <button class="primary-button" type="button" data-action="random-game">${icon("shuffle")} Random game</button>
          <button class="secondary-button" type="button" data-action="back-top">${icon("arrow-up")} Back to top</button>
        </div>
      </div>
    `;
  }

  function renderHomeIntro() {
    const site = getSiteSettings();
    const homeHeadline = site.homeHeadline || defaultSiteSettings.homeHeadline;
    return `
      <section class="home-intro" aria-labelledby="home-title">
        <div class="home-intro-copy">
          <p class="eyebrow">${icon("sparkles")} Free browser games</p>
          <h1 id="home-title">${escapeHTML(homeHeadline)}</h1>
          <p>
            Cozy Games PC is a fast browser game portal for players who want simple access to free online games without heavy downloads.
            Explore quick action rounds, arcade challenges, puzzle boards, racing runs, sports games, strategy titles, and mobile-ready
            games that open directly in your browser.
          </p>
          <p>
            Use search to find a title, browse categories for a specific mood, open the Tags index for themes, or jump into popular games
            ranked by player clicks. Each game page includes a clear description, categories, tags, and an iframe play area.
          </p>
        </div>
        <img class="home-intro-image" src="${escapeAttr(assetPath(HOME_INTRO_IMAGE_ASSET))}" alt="Cozy Games PC free online browser games preview" width="1213" height="600" loading="eager" fetchpriority="high" decoding="async">
      </section>
    `;
  }

  function renderHomeSeoContent() {
    return `
      <section class="home-seo-copy section-block" aria-labelledby="why-play-title">
        <div class="seo-copy-grid">
          <article>
            <h2 id="why-play-title">Why Play Games on CozyGamesPC?</h2>
            <p>
              CozyGamesPC is built for quick discovery. Instead of asking players to install a large client, the site focuses on online games
              that can be opened from a normal browser. That makes it useful when you want a short arcade round, a focused action game, a
              relaxing puzzle board, or a mobile-ready game that can be shared with friends.
            </p>
            <p>
              A good game portal should be easy to scan. Cozy Games PC keeps game cards compact, shows a cover or readable initials, and links
              every title to a dedicated page with the player, description, categories, tags, and related popular games.
            </p>
          </article>
          <article>
            <h2>Browse Cozy Games PC Categories</h2>
            <p>
              Categories help players move from a broad interest to a playable title. Action and arcade pages are useful for fast sessions,
              puzzle and strategy pages suit more thoughtful play, while racing, shooting, sports, adventure, and fighting pages give each
              game type a clear path from the homepage.
            </p>
            <p>
              Tags add another layer of discovery. The alphabetical Tags page connects themes such as stickman, superhero, defense, platform,
              arena, drift, merge, and more, so related games are easier to find even when they sit in different categories.
            </p>
          </article>
          <article>
            <h2>How to Choose the Right Browser Game</h2>
            <p>
              The best game to open depends on how much time you have and which device you are using. Desktop players may prefer games with
              keyboard movement, aiming, or a wider play field. Mobile players usually benefit from simpler touch controls, readable buttons,
              and shorter rounds that fit naturally between other tasks.
            </p>
            <p>
              If you want instant energy, start with action, fighting, shooting, racing, or arcade games. If you want slower thinking, explore
              puzzle, merge, defense, logic, or strategy games. Tags make this choice easier because they describe details that categories alone
              cannot show, including arena battles, stickman heroes, drift tracks, upgrades, rescue missions, or relaxing boards.
            </p>
          </article>
          <article>
            <h2>What Makes a Good Online Game Page?</h2>
            <p>
              A useful game page should answer basic questions before the player presses play. CozyGamesPC keeps the game title, iframe player,
              short summary, categories, tags, and release information close together so players can understand the game quickly.
              Popular games below the player also create a path to the next title without forcing visitors back to the homepage.
            </p>
            <p>
              The site is designed to grow over time. New games can be imported in bulk, categories can be edited, and cover images can be added
              with external URLs while Cloudflare D1 keeps public game data consistent across browsers. That structure helps the library stay
              organized as more online games are added.
            </p>
          </article>
          <article>
            <h2>Desktop and Mobile Play Sessions</h2>
            <p>
              Browser games are often played in short sessions, so the interface needs to stay predictable. On desktop, players can scan more
              cards at once, compare categories, and choose titles that use keyboard controls. On mobile, the same library needs larger touch
              targets, readable cards, and pages that avoid unnecessary steps before the game frame loads.
            </p>
            <p>
              CozyGamesPC marks whether a game is mobile ready and keeps key game details visible on the game page. That detail helps players decide
              whether to open a title on a phone, tablet, laptop, or desktop monitor. It also keeps the browsing experience useful for casual
              players who may switch devices during the day.
            </p>
          </article>
          <article>
            <h2>Search, Recents, and Library Growth</h2>
            <p>
              Search is useful when players already know the title, tag, or category they want. Recently Played helps return visitors reopen games
              they have tried before, while New Games and Popular Games support discovery for visitors who are not sure what to play next.
            </p>
            <p>
              As the library grows, clear internal links become more important. Category pages, tag pages, and game pages give search engines and
              players a simple path through the site. The sitemap also lists public pages so new browser games can be discovered after they are
              added in the admin area.
            </p>
          </article>
        </div>
        <div class="faq-list" aria-label="CozyGamesPC FAQ">
          <h2>Frequently Asked Questions</h2>
          <details open>
            <summary>Are the games free to play?</summary>
            <p>The games listed on CozyGamesPC are browser-based games that can be opened directly from their game pages. Some games are hosted by third-party providers inside an iframe.</p>
          </details>
          <details>
            <summary>Can I play on mobile?</summary>
            <p>Many games are marked mobile ready and work on phones or tablets. Some titles are better on desktop because they use keyboard controls or precise aiming.</p>
          </details>
          <details>
            <summary>How do categories and tags work?</summary>
            <p>Categories describe the main game type, while tags describe specific themes and mechanics. Together they make the game library easier to browse and search.</p>
          </details>
          <details>
            <summary>Do I need to install anything?</summary>
            <p>No installation is required for the site itself. Games open in the browser through their game pages, although a stable internet connection and a modern browser will usually give the best experience.</p>
          </details>
          <details>
            <summary>Why do some games feel different from others?</summary>
            <p>Some games are hosted by different providers and may use different loading screens, save systems, controls, or iframe behavior. The category and tag sections help explain what to expect before playing.</p>
          </details>
          <details>
            <summary>How are popular games ranked?</summary>
            <p>Popular Games are ordered by click activity. Each time a public visitor opens a game page, the click count can increase, which helps the site surface titles that players choose most often.</p>
          </details>
          <details>
            <summary>Can I search by tag or category?</summary>
            <p>Yes. The search bar checks game titles, descriptions, tags, and category names, so players can search for broad terms like puzzle or action as well as specific themes.</p>
          </details>
          <details>
            <summary>Will new games appear on the homepage?</summary>
            <p>Yes. When a game is added through the admin area, it can appear in New Games, its category section, search results, tag pages, and the sitemap used for search engine discovery.</p>
          </details>
          <details>
            <summary>What should I do if a game does not load?</summary>
            <p>Refresh the page, check your browser connection, and try a different device if the game uses desktop controls. Because some games come from external iframe providers, temporary loading issues can happen outside the main site.</p>
          </details>
          <details>
            <summary>How often should I check for new games?</summary>
            <p>New titles can be added whenever the library is updated. Checking the New Games page is the fastest way to find recent additions, while category pages are better when you already know the style of game you want.</p>
          </details>
        </div>
      </section>
    `;
  }

  function renderListingPage(options) {
    const games = options.games.length ? options.games : (options.fallback || []);
    setMeta({
      title: `${options.title} - cozygamespc`,
      description: options.intro,
      canonical: SITE_URL + options.canonicalPath
    });

    return `
      <div class="page-shell">
        <section class="listing-header">
          <div>
            <p class="eyebrow">${icon(options.icon)} cozygamespc</p>
            <h1>${escapeHTML(options.title)}</h1>
            <p>${escapeHTML(options.intro)}</p>
          </div>
          <button class="primary-button" type="button" data-action="random-game">${icon("shuffle")} Random game</button>
        </section>

        ${
          games.length
            ? `
              <section class="section-block">
                <div class="section-header">
                  <div class="section-heading">
                    <h2>Browse up to 60 games</h2>
                    <p>${games.length} game${games.length === 1 ? "" : "s"} available on this page.</p>
                  </div>
                </div>
                <div class="game-grid is-wide">${games.map((game) => gameCard(game)).join("")}</div>
              </section>
            `
            : emptyState("No games yet", "Add a game in the admin dashboard and this page will fill automatically.")
        }
      </div>
    `;
  }

  function renderCategoryPage(slug) {
    const category = findCategory(slug);
    if (!category) {
      setMeta({
        title: "Category Not Found - cozygamespc",
        description: "This cozygamespc category does not exist yet.",
        canonical: SITE_URL + "/category/"
      });
      return notFound("Category not found", "Create this category in the admin dashboard or choose another category from the sidebar.");
    }

    const games = gamesInCategory(category.slug).slice(0, 60);
    setMeta({
      title: `${category.name} Games - cozygamespc`,
      description: `Play ${category.name.toLowerCase()} games on cozygamespc. Browse up to 60 titles in this category.`,
      canonical: SITE_URL + `/category/${category.slug}/`
    });

    return `
      <div class="page-shell">
        <section class="listing-header">
          <div>
            <p class="eyebrow">${icon(category.icon)} Game category</p>
            <h1>${escapeHTML(category.name)} Games</h1>
            <p>Browse ${escapeHTML(category.name.toLowerCase())} games from the cozygamespc library. Each card opens a full game page with iframe play, details, categories, and tags.</p>
          </div>
          <a class="secondary-button" href="${hrefFor("home")}">${icon("home")} Home</a>
        </section>
        ${
          games.length
            ? `<section class="section-block"><div class="section-header"><div class="section-heading"><h2>${escapeHTML(category.name)} game list</h2><p>Showing up to 60 games.</p></div></div><div class="game-grid is-wide">${games.map((game) => gameCard(game)).join("")}</div></section>`
            : emptyState("No games in this category", "Add a game to this category from the admin dashboard.")
        }
      </div>
    `;
  }

  function renderTagPage(tagValue) {
    const tag = normalizeTag(tagValue);
    const games = state.games
      .filter((game) => game.tags.some((item) => item.toLowerCase() === tag.toLowerCase()))
      .slice(0, 60);

    setMeta({
      title: `${tag} Games - cozygamespc`,
      description: `Play cozygamespc games tagged ${tag}.`,
      canonical: SITE_URL + `/tags/${slugify(tag)}/`
    });

    return `
      <div class="page-shell">
        <section class="listing-header">
          <div>
            <p class="eyebrow">${icon("tag")} Tag</p>
            <h1>${escapeHTML(tag)} Games</h1>
            <p>Games connected to the ${escapeHTML(tag)} tag. The full tag index is counted from every game page and sorted alphabetically on the Tags page.</p>
          </div>
          <a class="secondary-button" href="${hrefFor("tags")}">${icon("tags")} All Tags</a>
        </section>
        ${
          games.length
            ? `<section class="section-block"><div class="section-header"><div class="section-heading"><h2>Tagged game list</h2><p>Showing up to 60 matching games.</p></div></div><div class="game-grid is-wide">${games.map((game) => gameCard(game)).join("")}</div></section>`
            : emptyState("No games for this tag", "Add this tag to a game in the admin dashboard and it will appear here.")
        }
      </div>
    `;
  }

  function renderTagsPage() {
    const tags = getTagCounts();
    const tagGroups = groupTagsByInitial(tags);

    setMeta({
      title: "Tags - cozygamespc",
      description: "Browse all cozygamespc game tags alphabetically, with the number of games connected to each tag.",
      canonical: SITE_URL + "/tags/"
    });

    return `
      <div class="page-shell">
        <section class="listing-header">
          <div>
            <p class="eyebrow">${icon("tags")} Tags</p>
            <h1>Tags</h1>
            <p>Browse cozygamespc tags in one clean index. Each tag shows how many game pages include it.</p>
          </div>
          <a class="secondary-button" href="${hrefFor("home")}">${icon("home")} Home</a>
        </section>
        ${
          tags.length
            ? `
              <section class="section-block">
                <div class="section-header">
                  <div class="section-heading">
                    <h2>All Tags</h2>
                    <p>${tags.length} tag${tags.length === 1 ? "" : "s"} grouped by starting letter.</p>
                  </div>
                </div>
                <div class="tag-index">
                  ${tagGroups.map((group) => renderTagGroup(group)).join("")}
                </div>
              </section>
            `
            : emptyState("No tags yet", "Add tags to game pages in the admin dashboard and they will appear here.")
        }
      </div>
    `;
  }

  function groupTagsByInitial(tags) {
    const groups = new Map();
    tags.forEach((tag) => {
      const first = tag.name.trim().charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(first) ? first : "#";
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter).push(tag);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => {
        if (a === "#") return -1;
        if (b === "#") return 1;
        return a.localeCompare(b);
      })
      .map(([letter, items]) => ({ letter, items }));
  }

  function renderTagGroup(group) {
    const letterId = `tag-group-${group.letter === "#" ? "number" : group.letter.toLowerCase()}`;
    return `
      <section class="tag-group" aria-labelledby="${letterId}">
        <h2 class="tag-letter" id="${letterId}">${escapeHTML(group.letter)}</h2>
        <div class="tag-grid">
          ${group.items.map((tag) => tagChip(tag)).join("")}
        </div>
      </section>
    `;
  }

  function renderSearchPage(value) {
    const query = normalizeTag(value || "");
    const games = searchGames(query).slice(0, 60);

    setMeta({
      title: `${query || "Search"} - cozygamespc`,
      description: `Search cozygamespc games by title, category, and tag.`,
      canonical: SITE_URL + `/search/${encodeURIComponent(query)}/`
    });

    return `
      <div class="page-shell">
        <section class="listing-header">
          <div>
            <p class="eyebrow">${icon("search")} Search</p>
            <h1>Search results${query ? ` for ${escapeHTML(query)}` : ""}</h1>
            <p>Search checks game titles, category names, and tags to help players reach the right game page quickly.</p>
          </div>
          <a class="secondary-button" href="${hrefFor("home")}">${icon("home")} Home</a>
        </section>
        ${
          games.length
            ? `<section class="section-block"><div class="section-header"><div class="section-heading"><h2>Matching games</h2><p>Showing up to 60 results.</p></div></div><div class="game-grid is-wide">${games.map((game) => gameCard(game)).join("")}</div></section>`
            : emptyState("No matching games", "Try a title keyword like stickman, superhero, action, arcade, arena, or puzzle.")
        }
      </div>
    `;
  }

  function renderGamePage(slug) {
    const game = state.games.find((item) => item.slug === slug);
    if (!game) {
      setMeta({
        title: "Game Not Found - cozygamespc",
        description: "This cozygamespc game page does not exist yet.",
        canonical: SITE_URL + "/"
      });
      return notFound("Game not found", "Choose a game from the homepage or add a new game in the admin dashboard.");
    }

    recordPlay(game.slug);

    const categoryNames = game.categories.map((catSlug) => findCategory(catSlug)).filter(Boolean);
    const popularGames = getPopularGames().filter((item) => item.slug !== game.slug).slice(0, 18);
    const gameMetaTitle = buildGameMetaTitle(game);
    const gameMetaDescription = buildGameMetaDescription(game);

    setMeta({
      title: gameMetaTitle,
      description: gameMetaDescription,
      canonical: SITE_URL + pathFor("game", game.slug) + "/",
      schema: {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.title,
        url: SITE_URL + pathFor("game", game.slug) + "/",
        applicationCategory: "Game",
        operatingSystem: "Web browser",
        genre: categoryNames.map((category) => category.name),
        keywords: game.tags.join(", "),
        description: gameMetaDescription,
        datePublished: game.published
      }
    });

    return `
      <div class="page-shell">
        <div class="game-layout">
          <div class="game-main-column">
            <section class="game-frame-section" aria-labelledby="play-title">
              <div class="frame-toolbar">
                <strong id="play-title">Play ${escapeHTML(game.title)} online</strong>
                <button class="secondary-button" type="button" data-action="fullscreen-game">${icon("maximize-2")} Fullscreen</button>
              </div>
              ${
                game.iframeUrl
                  ? `<div class="iframe-wrap" id="gameFrameWrap" style="--game-aspect-ratio:${escapeAttr(gameAspectRatio(game))}"><iframe src="${escapeAttr(normalizeProviderIframeUrl(game.iframeUrl))}" title="${escapeAttr(game.title)} online game iframe" loading="eager" ${iframePolicyAttributes(game)}></iframe></div>`
                  : `<div class="iframe-placeholder"><div><h2>Iframe coming soon</h2><p>This sample game page is ready for your iframe URL. Add one in the admin dashboard when the game is live.</p></div></div>`
              }
            </section>

            <section class="content-panel">
              <h2>About ${escapeHTML(game.title)}</h2>
              <p>${escapeHTML(game.description)}</p>
            </section>

            ${renderPopularGamesSection(popularGames)}
          </div>

          <aside class="game-info-sidebar">
            <section class="content-panel game-info-panel">
              <p class="eyebrow">${icon("gamepad-2")} Online game</p>
              <h1>${escapeHTML(game.title)}</h1>
              <p class="game-info-summary">${escapeHTML(game.oneLine || game.description)}</p>
              <button class="secondary-button" type="button" data-action="share-site">${icon("share-2")} Share</button>
              <dl class="detail-list">
                <div class="detail-row"><dt>Mobile Ready</dt><dd>${game.mobileReady ? "Yes" : "No"}</dd></div>
                <div class="detail-row"><dt>Released</dt><dd>${formatDate(game.published)}</dd></div>
                <div class="detail-row"><dt>Clicks</dt><dd>${formatNumber(game.clicks || 0)}</dd></div>
                <div class="detail-row"><dt>Category</dt><dd><div class="pill-list">${categoryNames.map((category) => `<a class="pill" href="${hrefFor("category", category.slug)}">${escapeHTML(category.name)}</a>`).join("")}</div></dd></div>
                <div class="detail-row"><dt>Tags</dt><dd><div class="pill-list">${game.tags.map((tag) => `<a class="pill" href="${hrefFor("tag", slugify(tag))}">${escapeHTML(tag)}</a>`).join("")}</div></dd></div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    `;
  }

  function renderLoginPage() {
    setMeta({
      title: "Login - cozygamespc",
      description: "Sign in to manage cozygamespc games and categories.",
      canonical: SITE_URL + "/login/",
      noindex: true
    });

    return `
      <div class="page-shell">
        <section class="admin-header">
          <div>
            <p class="eyebrow">${icon("shield-check")} Admin</p>
            <h1>cozygamespc Login</h1>
            <p>Use the secure back office entry to manage categories, games, collaborators, and passwords.</p>
          </div>
        </section>
        <div class="admin-layout is-login">
          <section class="admin-card">
            <h2>Sign in</h2>
            <form class="form-grid" id="loginForm">
              <div class="field">
                <label for="loginUsername">Login name</label>
                <input id="loginUsername" name="username" type="text" autocomplete="username" required>
              </div>
              <div class="field">
                <label for="loginPassword">Password</label>
                <input id="loginPassword" name="password" type="password" autocomplete="current-password" required>
              </div>
              <div class="form-actions">
                <button class="primary-button" type="submit">${icon("log-in")} Log in</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    `;
  }

  function renderAdminPage(section = "categories") {
    const user = getCurrentUser();
    if (!user) return renderLoginPage();

    const allowedSections = user.role === "admin" ? ["settings", "categories", "games", "collaborators", "password"] : ["categories", "games"];
    const activeSection = allowedSections.includes(section) ? section : "categories";

    setMeta({
      title: `${adminSectionTitle(activeSection)} - cozygamespc Admin`,
      description: "Manage cozygamespc back office content.",
      canonical: SITE_URL + pathFor("admin", activeSection) + "/",
      noindex: true
    });

    return `
      <div class="page-shell">
        <section class="admin-header">
          <div>
            <p class="eyebrow">${icon("shield-check")} Admin</p>
            <h1>${adminSectionTitle(activeSection)}</h1>
            <p>${user.role === "admin" ? "Initial administrator access" : "Collaborator access"} for the cozygamespc content manager.</p>
          </div>
          <button class="secondary-button" type="button" data-action="logout">${icon("log-out")} Log out</button>
        </section>

        <div class="admin-layout">
          ${renderAdminSidebar(activeSection, user)}
          <section class="admin-main">
            ${activeSection === "settings" ? renderAdminSettingsPage(user) : ""}
            ${activeSection === "categories" ? renderAdminCategoriesPage(user) : ""}
            ${activeSection === "games" ? renderAdminGamesPage(user) : ""}
            ${activeSection === "collaborators" ? renderAdminCollaboratorsPage(user) : ""}
            ${activeSection === "password" ? renderAdminPasswordPage(user) : ""}
          </section>
        </div>
      </div>
    `;
  }

  function adminSectionTitle(section) {
    const titles = {
      settings: "Site Settings",
      categories: "Category Management",
      games: "Game Management",
      collaborators: "Collaborator Management",
      password: "Password Management"
    };
    return titles[section] || titles.categories;
  }

  function renderAdminSidebar(activeSection, user) {
    const links = [
      { key: "categories", label: "Categories", icon: "folder-tree" },
      { key: "games", label: "Games", icon: "gamepad-2" }
    ];

    if (user.role === "admin") {
      links.unshift({ key: "settings", label: "Site Settings", icon: "settings" });
      links.push({ key: "collaborators", label: "Collaborators", icon: "users" });
      links.push({ key: "password", label: "Password", icon: "key-round" });
    }

    return `
      <aside class="admin-sidebar">
        <div class="admin-user">
          <strong>${escapeHTML(user.username)}</strong>
          <span>${user.role === "admin" ? "Admin" : "Collaborator"}</span>
        </div>
        <nav class="admin-menu" aria-label="Admin sections">
          ${links
            .map(
              (item) => `
                <a class="admin-menu-link ${activeSection === item.key ? "is-active" : ""}" href="${hrefFor("admin", item.key)}">
                  ${icon(item.icon)}
                  <span>${escapeHTML(item.label)}</span>
                </a>
              `
            )
            .join("")}
        </nav>
        <div class="status-note">
          Collaborators can add and edit categories and games. Only admin can change site settings, delete content, manage collaborators, or change the admin password.
        </div>
        <div class="status-note">
          Storage: ${cloudSyncActive ? "Cloud sync active" : "Browser-only until Cloudflare D1 is connected"}.
        </div>
        ${
          user.role === "admin" && cloudSyncActive && getRemoteToken()
            ? `<button class="secondary-button full-width-button" type="button" data-action="push-browser-cache">${icon("cloud-upload")} Push browser data to cloud</button>`
            : ""
        }
      </aside>
    `;
  }

  function renderAdminSettingsPage(user) {
    if (user.role !== "admin") return emptyState("Admin only", "Collaborators do not have access to site settings.");
    const site = getSiteSettings();

    return `
      <div class="admin-card">
        <h2>Website Title, Description & Icon</h2>
        <form class="form-grid" id="siteSettingsForm">
          <input id="siteIconImageData" name="iconImageData" type="hidden" value="${escapeAttr(site.iconImage || "")}">
          <div class="field">
            <label for="siteTitle">Website title</label>
            <input id="siteTitle" name="title" type="text" value="${escapeAttr(site.title)}" required>
          </div>
          <div class="field">
            <label for="siteDescription">Website description</label>
            <textarea id="siteDescription" name="description" required>${escapeHTML(site.description)}</textarea>
          </div>
          <div class="field">
            <label for="homeHeadline">Homepage H1 title</label>
            <input id="homeHeadline" name="homeHeadline" type="text" value="${escapeAttr(site.homeHeadline || defaultSiteSettings.homeHeadline)}" required>
          </div>
          <div class="admin-card-note">
            Game page SEO template: [Game Title] | [A] | CozyGamesPC. Description: Play [Game Title] [B]. [First sentence from the game description, up to 60 words]! [C]
          </div>
          <div class="form-grid two">
            <div class="field">
              <label for="gameTitlePhrase">Game title phrase (A)</label>
              <input id="gameTitlePhrase" name="gameTitlePhrase" type="text" value="${escapeAttr(site.gameTitlePhrase || "")}" placeholder="Play Online for Free">
            </div>
            <div class="field">
              <label for="gameDescriptionPhraseB">Game description phrase (B)</label>
              <input id="gameDescriptionPhraseB" name="gameDescriptionPhraseB" type="text" value="${escapeAttr(site.gameDescriptionPhraseB || "")}" placeholder="online for free">
            </div>
          </div>
          <div class="field">
            <label for="gameDescriptionPhraseC">Game description closing phrase (C)</label>
            <input id="gameDescriptionPhraseC" name="gameDescriptionPhraseC" type="text" value="${escapeAttr(site.gameDescriptionPhraseC || "")}" placeholder="Start playing now on CozyGamesPC">
          </div>
          <div class="form-grid two">
            <div class="field">
              <label for="siteIconImage">Upload website icon</label>
              <input id="siteIconImage" name="iconFile" type="file" accept="image/*" data-preview-target="siteIconPreview" data-hidden-target="siteIconImageData" data-upload-folder="site-icons">
              <label for="siteIconUrl">Or paste website icon URL</label>
              <input id="siteIconUrl" name="iconImageUrl" type="url" value="${isInlineImage(site.iconImage) ? "" : escapeAttr(site.iconImage || "")}" placeholder="https://example.com/icon.png">
            </div>
            <div class="upload-preview site-icon-preview" id="siteIconPreview">
              ${site.iconImage ? `<img src="${escapeAttr(displayImageSrc(site.iconImage))}" alt="">` : `<span>${escapeHTML(site.iconText || "CG")}</span>`}
            </div>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">${icon("save")} Save site settings</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderAdminCategoriesPage(user) {
    const editSlug = getQueryParam("edit");
    const editing = editSlug ? findCategory(editSlug) : null;
    const formCategory = editing || { name: "", slug: "", icon: "gamepad-2", iconImage: "", color: "#007aff" };

    return `
      <div class="admin-card">
        <h2>${editing ? "Edit Category" : "Add Category"}</h2>
        <form class="form-grid" id="categoryForm">
          <input type="hidden" name="existingSlug" value="${escapeAttr(editing?.slug || "")}">
          <div class="form-grid two">
            <div class="field">
              <label for="categoryName">Category name</label>
              <input id="categoryName" name="name" type="text" value="${escapeAttr(formCategory.name)}" placeholder="Action" required>
            </div>
            <div class="field">
              <label for="categoryIcon">Fallback icon name</label>
              <input id="categoryIcon" name="icon" type="text" value="${escapeAttr(formCategory.icon || "gamepad-2")}" placeholder="zap">
            </div>
          </div>
          <div class="form-grid two">
            <div class="field">
              <label for="categoryIconImage">Upload category icon</label>
              <input id="categoryIconImage" name="iconFile" type="file" accept="image/*" data-preview-target="categoryIconPreview" data-hidden-target="categoryIconImageData" data-upload-folder="category-icons">
              <input id="categoryIconImageData" name="iconImageData" type="hidden" value="${escapeAttr(formCategory.iconImage || "")}">
              <label for="categoryIconImageUrl">Or paste category icon URL</label>
              <input id="categoryIconImageUrl" name="iconImage" type="url" value="${isInlineImage(formCategory.iconImage) ? "" : escapeAttr(formCategory.iconImage || "")}" placeholder="https://example.com/category.png">
            </div>
            <div class="upload-preview category-preview" id="categoryIconPreview">
              ${formCategory.iconImage ? `<img src="${escapeAttr(displayImageSrc(formCategory.iconImage))}" alt="">` : categoryIconMarkup(formCategory)}
            </div>
          </div>
          <div class="field">
            <label>Apple-style accent color</label>
            <input id="categoryColor" name="color" type="hidden" value="${escapeAttr(formCategory.color || "#007aff")}">
            <div class="color-swatch-list" data-color-field="categoryColor">
              ${appleColors()
                .map(
                  (color) => `
                    <button class="color-swatch ${color.value.toLowerCase() === String(formCategory.color || "#007aff").toLowerCase() ? "is-active" : ""}" type="button" data-action="choose-color" data-color="${escapeAttr(color.value)}" aria-label="${escapeAttr(color.name)}" title="${escapeAttr(color.name)}" style="--swatch:${escapeAttr(color.value)}"></button>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">${icon("save")} ${editing ? "Save category" : "Add category"}</button>
            ${editing ? `<a class="secondary-button" href="${hrefFor("admin", "categories")}">${icon("plus")} Add new</a>` : ""}
          </div>
        </form>
      </div>

      <div class="admin-card">
        <h2>Category List</h2>
        <div class="admin-list">
          ${state.categories
            .map((category) => {
              const count = gamesInCategory(category.slug).length;
              return `
                <div class="admin-list-item">
                  <div class="admin-list-main">
                    ${categoryIconMarkup(category)}
                    <div>
                      <strong>${escapeHTML(category.name)}</strong>
                      <span>${count} game${count === 1 ? "" : "s"} - ${escapeHTML(category.color || "#007aff")}</span>
                    </div>
                  </div>
                  <div class="admin-row-actions">
                    <button class="secondary-button" type="button" data-action="category-top" data-slug="${escapeAttr(category.slug)}" title="Move to top" aria-label="Move ${escapeAttr(category.name)} to top">${icon("chevrons-up")} Top</button>
                    <button class="secondary-button" type="button" data-action="category-up" data-slug="${escapeAttr(category.slug)}" title="Move up" aria-label="Move ${escapeAttr(category.name)} up">${icon("arrow-up")}</button>
                    <button class="secondary-button" type="button" data-action="category-down" data-slug="${escapeAttr(category.slug)}" title="Move down" aria-label="Move ${escapeAttr(category.name)} down">${icon("arrow-down")}</button>
                    <button class="secondary-button" type="button" data-action="edit-category" data-slug="${escapeAttr(category.slug)}">${icon("pencil")} Edit</button>
                    ${user.role === "admin" ? `<button class="danger-button" type="button" data-action="delete-category" data-slug="${escapeAttr(category.slug)}">${icon("trash-2")} Delete</button>` : ""}
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderAdminGamesPage(user) {
    const editSlug = getQueryParam("edit");
    const editing = editSlug ? state.games.find((game) => game.slug === editSlug) : null;
    const deletedGames = Array.isArray(state.deletedGames) ? state.deletedGames : [];
    const game = editing || {
      title: "",
      oneLine: "",
      iframeUrl: "",
      mobileReady: true,
      iframePermissions: { ...DEFAULT_IFRAME_PERMISSIONS },
      categories: [],
      tags: [],
      description: "",
      aspectRatio: "",
      coverImage: ""
    };
    const iframePermissions = normalizeIframePermissions(game);

    return `
      <div class="admin-card">
        <h2>${editing ? "Edit Game" : "Add Game"}</h2>
        <form class="form-grid" id="gameForm">
          <input type="hidden" name="existingSlug" value="${escapeAttr(editing?.slug || "")}">
          <input id="gameCoverImageData" name="coverImageData" type="hidden" value="${escapeAttr(game.coverImage || "")}">
          <div class="form-grid two">
            <div class="field">
              <label for="gameTitle">Game title</label>
              <input id="gameTitle" name="title" type="text" value="${escapeAttr(game.title)}" required>
            </div>
            <div class="field">
              <label for="gameIframe">Iframe URL or iframe code</label>
              <textarea id="gameIframe" name="iframeUrl" placeholder='https://example.com/game or <iframe src="https://example.com/game"></iframe>'>${escapeHTML(game.iframeUrl || "")}</textarea>
            </div>
          </div>
          <div class="field">
            <label for="gameAspectRatio">Game window ratio</label>
            <input id="gameAspectRatio" name="aspectRatio" type="text" value="${escapeAttr(game.aspectRatio || "")}" placeholder="Optional: 16:9, 4:3, 1024x512. Leave blank for 1024x512.">
          </div>
          <div class="field">
            <label for="gameOneLine">One-sentence intro</label>
            <input id="gameOneLine" name="oneLine" type="text" value="${escapeAttr(game.oneLine || "")}" required>
          </div>
          <div class="form-grid two">
            <div class="field">
              <label for="gameCategories">Game type categories</label>
              <select id="gameCategories" name="categories" multiple size="7" required>
                ${state.categories
                  .map((category) => `<option value="${escapeAttr(category.slug)}" ${game.categories?.includes(category.slug) ? "selected" : ""}>${escapeHTML(category.name)}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="field">
              <label for="gameTags">Tags</label>
              <input id="gameTags" name="tags" type="text" value="${escapeAttr((game.tags || []).join(", "))}" placeholder="Arena, Fighting, Stickman, Superhero" required>
              <label class="checkbox-field"><input name="mobileReady" type="checkbox" ${game.mobileReady !== false ? "checked" : ""}> Mobile Ready</label>
              <label>Iframe sandbox controls</label>
              <div class="permission-grid">
                <label class="checkbox-field"><input name="allowIframeAutoRedirect" type="checkbox" ${iframePermissions.allowAutoRedirect ? "checked" : ""}> Allow automatic redirect to game site</label>
                <label class="checkbox-field"><input name="allowIframePopups" type="checkbox" ${iframePermissions.allowPopups ? "checked" : ""}> Allow popup windows</label>
                <label class="checkbox-field"><input name="allowIframePopupEscape" type="checkbox" ${iframePermissions.allowPopupEscape ? "checked" : ""}> Allow popup escape sandbox</label>
                <label class="checkbox-field"><input name="allowIframeFullscreen" type="checkbox" ${iframePermissions.allowFullscreen ? "checked" : ""}> Allow forced fullscreen</label>
                <label class="checkbox-field"><input name="allowIframeClickRedirect" type="checkbox" ${iframePermissions.allowClickRedirect ? "checked" : ""}> Allow click to move whole page</label>
              </div>
              <p class="field-hint">Popup windows stay enabled by default. Use popup escape only for trusted providers, because it lets popup windows leave the iframe sandbox.</p>
            </div>
          </div>
          <div class="form-grid two">
            <div class="field">
              <label for="gameCoverImage">Upload game cover</label>
              <input id="gameCoverImage" name="coverFile" type="file" accept="image/*" data-preview-target="gameCoverPreview" data-hidden-target="gameCoverImageData" data-upload-folder="game-covers">
              <label for="gameCoverImageUrl">Or paste game cover URL</label>
              <input id="gameCoverImageUrl" name="coverImageUrl" type="url" value="${isInlineImage(game.coverImage) ? "" : escapeAttr(game.coverImage || "")}" placeholder="https://example.com/game-cover.jpg">
            </div>
            <div class="upload-preview cover-preview" id="gameCoverPreview">
              ${game.coverImage ? `<img src="${escapeAttr(displayImageSrc(game.coverImage))}" alt="">` : `<span>${icon("image")} Cover preview</span>`}
            </div>
          </div>
          <div class="field">
            <label for="gameDescription">Game description</label>
            <textarea id="gameDescription" name="description" required>${escapeHTML(game.description || "")}</textarea>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">${icon("save")} ${editing ? "Save game" : "Add game page"}</button>
            ${editing ? `<a class="secondary-button" href="${hrefFor("admin", "games")}">${icon("plus")} Add new</a>` : ""}
          </div>
        </form>
      </div>

      ${renderBulkImportCard()}

      <div class="admin-card">
        <h2>Game List</h2>
        ${
          user.role === "admin" && state.games.length
            ? `
              <div class="admin-bulk-actions">
                <label class="checkbox-field"><input type="checkbox" data-action="toggle-list-selection" data-target-list="activeGamesList"> Select all visible games</label>
                <button class="danger-button" type="button" data-action="delete-selected-games">${icon("trash-2")} Move selected to Deleted</button>
              </div>
            `
            : ""
        }
        <div class="admin-list" id="activeGamesList">
          ${state.games
            .map(
              (item) => `
                <div class="admin-list-item">
                  <div class="admin-list-main">
                    ${user.role === "admin" ? `<input class="admin-select" type="checkbox" name="selectedGame" value="${escapeAttr(item.slug)}" aria-label="Select ${escapeAttr(item.title)}">` : ""}
                    <div class="admin-thumb">${item.coverImage ? `<img src="${escapeAttr(displayImageSrc(item.coverImage))}" alt="">` : `<span>${escapeHTML(getInitials(item))}</span>`}</div>
                    <div>
                      <strong>${escapeHTML(item.title)}</strong>
                      <span>${escapeHTML(item.categories.map((slug) => findCategory(slug)?.name || slug).join(", "))} - ${formatDate(item.published)} - Clicks: ${formatNumber(item.clicks || 0)}</span>
                    </div>
                  </div>
                  <div class="admin-row-actions">
                    <button class="secondary-button" type="button" data-action="edit-game" data-slug="${escapeAttr(item.slug)}">${icon("pencil")} Edit</button>
                    <a class="secondary-button" href="${hrefFor("game", item.slug)}">${icon("external-link")} View</a>
                    ${user.role === "admin" ? `<button class="danger-button" type="button" data-action="delete-game" data-slug="${escapeAttr(item.slug)}">${icon("trash-2")} Move to Deleted</button>` : ""}
                  </div>
                </div>
              `
            )
            .join("") || `<div class="empty-state"><div><h2>No active games</h2><p>Add a game above or restore one from Deleted Games.</p></div></div>`}
        </div>
      </div>

      ${
        user.role === "admin"
          ? `
            <div class="admin-card deleted-admin-card">
              <h2>Deleted Games</h2>
              <p class="admin-card-note">Games moved here are hidden from the public site. Restore them, or delete again here to remove them permanently.</p>
              ${
                deletedGames.length
                  ? `
                    <div class="admin-bulk-actions">
                      <label class="checkbox-field"><input type="checkbox" data-action="toggle-list-selection" data-target-list="deletedGamesList"> Select all deleted games</label>
                      <div class="admin-row-actions">
                        <button class="secondary-button" type="button" data-action="restore-selected-games">${icon("rotate-ccw")} Restore selected</button>
                        <button class="danger-button" type="button" data-action="permanent-delete-selected-games">${icon("trash-2")} Delete selected permanently</button>
                      </div>
                    </div>
                    <div class="admin-list" id="deletedGamesList">
                      ${deletedGames
                        .map(
                          (item) => `
                            <div class="admin-list-item">
                              <div class="admin-list-main">
                                <input class="admin-select" type="checkbox" name="selectedDeletedGame" value="${escapeAttr(item.slug)}" aria-label="Select deleted ${escapeAttr(item.title)}">
                                <div class="admin-thumb">${item.coverImage ? `<img src="${escapeAttr(displayImageSrc(item.coverImage))}" alt="">` : `<span>${escapeHTML(getInitials(item))}</span>`}</div>
                                <div>
                                  <strong>${escapeHTML(item.title)}</strong>
                                  <span>Deleted ${formatDate(item.deletedAt || new Date().toISOString().slice(0, 10))}</span>
                                </div>
                              </div>
                              <div class="admin-row-actions">
                                <button class="secondary-button" type="button" data-action="restore-game" data-slug="${escapeAttr(item.slug)}">${icon("rotate-ccw")} Restore</button>
                                <button class="danger-button" type="button" data-action="permanent-delete-game" data-slug="${escapeAttr(item.slug)}">${icon("trash-2")} Delete permanently</button>
                              </div>
                            </div>
                          `
                        )
                        .join("")}
                    </div>
                  `
                  : `<div class="empty-state"><div><h2>No deleted games</h2><p>Deleted games will appear here before permanent removal.</p></div></div>`
              }
            </div>
          `
          : ""
      }
    `;
  }

  function renderBulkImportCard() {
    const rows = pendingBulkGames || [];
    const validRows = rows.filter((row) => !row.errors.length);
    const invalidRows = rows.length - validRows.length;
    const coverSources = rows.filter((row) => pendingBulkImages.has(normalizeImportNo(row.no)) || row.coverImageUrl).length;

    return `
      <div class="admin-card">
        <h2>Bulk Import Games</h2>
        <p class="admin-card-note">Upload a CSV or Excel file with these columns: No, Title, PRELOADER Link, One-sentence intro, Category, Description, and Tags. Optional columns include Ratio, Aspect Ratio, Image URL, Cover URL, Cover Image, Thumbnail, or Poster. If One-sentence intro is blank, it will be generated from the first sentence of Description. Existing game titles are marked red and skipped, so original games are never replaced. After reading the file, you can still upload cover images named with the matching No, such as 1.png or 001.jpg.</p>
        <div class="form-grid two">
          <div class="field">
            <label for="bulkGameFile">Upload CSV or Excel file</label>
            <input id="bulkGameFile" type="file" accept=".csv,.tsv,.xlsx,.xls,.exl" data-bulk-game-file>
          </div>
          <div class="field">
            <label for="bulkGameImages">Upload cover images by No</label>
            <input id="bulkGameImages" type="file" accept="image/*" multiple data-bulk-image-files ${rows.length ? "" : "disabled"}>
          </div>
        </div>
        ${
          rows.length
            ? `
              <div class="bulk-import-summary">
                <span>${rows.length} row${rows.length === 1 ? "" : "s"} read</span>
                <span>${validRows.length} ready</span>
                <span>${invalidRows} need attention</span>
                <span>${coverSources} cover source${coverSources === 1 ? "" : "s"}</span>
              </div>
              <div class="bulk-preview-wrap">
                <table class="bulk-preview-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Title</th>
                      <th>One-sentence intro</th>
                      <th>Iframe URL</th>
                      <th>Ratio</th>
                      <th>Category</th>
                      <th>Tags</th>
                      <th>Cover</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.slice(0, 12).map((row) => renderBulkPreviewRow(row)).join("")}
                  </tbody>
                </table>
              </div>
              ${rows.length > 12 ? `<p class="admin-card-note">Showing the first 12 rows in preview. All valid rows will be imported; red rows will be skipped.</p>` : `<p class="admin-card-note">All valid rows will be imported; red rows will be skipped.</p>`}
              <div class="form-actions">
                <button class="primary-button" type="button" data-action="import-bulk-games">${icon("upload")} Import ${validRows.length} game${validRows.length === 1 ? "" : "s"}</button>
                <button class="secondary-button" type="button" data-action="clear-bulk-import">${icon("x")} Clear import</button>
              </div>
            `
            : `<div class="status-note">CSV works directly. Excel files require the browser to load the SheetJS reader library from CDN.</div>`
        }
      </div>
    `;
  }

  function renderBulkPreviewRow(row) {
    const image = pendingBulkImages.get(normalizeImportNo(row.no)) || row.coverImageUrl;
    return `
      <tr class="${row.errors.length ? "has-errors" : ""}">
        <td>${escapeHTML(row.no)}</td>
        <td>${escapeHTML(row.title)}</td>
        <td><span class="bulk-text-cell">${escapeHTML(row.oneLine)}</span></td>
        <td><a class="bulk-url-cell" href="${escapeAttr(row.iframeUrl)}" target="_blank" rel="noopener">${escapeHTML(row.iframeUrl)}</a></td>
        <td>${escapeHTML(row.aspectRatio || DEFAULT_GAME_ASPECT_RATIO)}</td>
        <td>${escapeHTML(row.categoryNames.join(", "))}</td>
        <td>${escapeHTML(row.tags.join(", "))}</td>
        <td>${image ? `<img class="bulk-preview-cover" src="${escapeAttr(displayImageSrc(image))}" alt="">` : `<span class="bulk-no-cover">No image</span>`}</td>
        <td>${row.errors.length ? escapeHTML(row.errors.join("; ")) : "Ready"}</td>
      </tr>
    `;
  }

  function renderAdminCollaboratorsPage(user) {
    if (user.role !== "admin") return emptyState("Admin only", "Collaborators do not have access to collaborator management.");
    const editUsername = getQueryParam("edit");
    const editing = editUsername ? state.users.find((item) => item.username === editUsername && item.role === "collaborator") : null;

    return `
      <div class="admin-card">
        <h2>${editing ? "Edit Collaborator" : "Add Collaborator"}</h2>
        <form class="form-grid" id="collaboratorForm">
          <input type="hidden" name="existingUsername" value="${escapeAttr(editing?.username || "")}">
          <div class="form-grid two">
            <div class="field">
              <label for="collabUsername">Login name</label>
              <input id="collabUsername" name="username" type="text" value="${escapeAttr(editing?.username || "")}" required>
            </div>
            <div class="field">
              <label for="collabPassword">Password</label>
              <input id="collabPassword" name="password" type="password" value="${escapeAttr(editing?.password || "")}" required>
            </div>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">${icon("save")} ${editing ? "Save collaborator" : "Add collaborator"}</button>
            ${editing ? `<a class="secondary-button" href="${hrefFor("admin", "collaborators")}">${icon("plus")} Add new</a>` : ""}
          </div>
        </form>
      </div>
      <div class="admin-card">
        <h2>Collaborator List</h2>
        <div class="admin-list">
          ${state.users
            .filter((item) => item.role === "collaborator")
            .map(
              (item) => `
                <div class="admin-list-item">
                  <div>
                    <strong>${escapeHTML(item.username)}</strong>
                    <span>Can add and edit categories and games</span>
                  </div>
                  <div class="admin-row-actions">
                    <button class="secondary-button" type="button" data-action="edit-user" data-username="${escapeAttr(item.username)}">${icon("pencil")} Edit</button>
                    <button class="danger-button" type="button" data-action="delete-user" data-username="${escapeAttr(item.username)}">${icon("trash-2")} Delete</button>
                  </div>
                </div>
              `
            )
            .join("") || `<div class="empty-state"><div><h2>No collaborators yet</h2><p>Add a collaborator when you want help managing game content.</p></div></div>`}
        </div>
      </div>
    `;
  }

  function renderAdminPasswordPage(user) {
    if (user.role !== "admin") return emptyState("Admin only", "Collaborators do not have access to password management.");
    return `
      <div class="admin-card">
        <h2>Change Admin Password</h2>
        <form class="form-grid" id="passwordForm">
          <div class="field">
            <label for="currentPassword">Current password</label>
            <input id="currentPassword" name="currentPassword" type="password" autocomplete="current-password" required>
          </div>
          <div class="form-grid two">
            <div class="field">
              <label for="newPassword">New password</label>
              <input id="newPassword" name="newPassword" type="password" autocomplete="new-password" required>
            </div>
            <div class="field">
              <label for="confirmPassword">Confirm new password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" required>
            </div>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">${icon("key-round")} Save password</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderGameSection(options) {
    if (!options.games || !options.games.length) return "";
    const body =
      options.mode === "mini"
        ? `<div class="mini-strip">${options.games.map((game) => miniGameCard(game)).join("")}</div>`
        : `<div class="game-grid">${options.games.map((game) => gameCard(game)).join("")}</div>`;

    return `
      <section class="section-block">
        ${
          options.hideHeader
            ? ""
            : `<div class="section-header">
                <div class="section-heading">
                  <h2>${escapeHTML(options.title)}</h2>
                  <p>${escapeHTML(options.description || "")}</p>
                </div>
                ${options.href ? `<a class="text-button" href="${escapeAttr(options.href)}">Show all ${icon("arrow-right")}</a>` : ""}
              </div>`
        }
        ${body}
      </section>
    `;
  }

  function renderPopularGamesSection(games) {
    if (!games || !games.length) return "";
    return `
      <section class="section-block">
        <div class="section-header">
          <div class="section-heading">
            <h2>Popular Games</h2>
            <p>Ranked by click count.</p>
          </div>
          <a class="text-button" href="${hrefFor("popular")}">Show all ${icon("arrow-right")}</a>
        </div>
        <div class="game-grid popular-three-row">
          ${games.map((game) => gameCard(game)).join("")}
        </div>
      </section>
    `;
  }

  function renderCategorySection() {
    if (!state.categories.length) return "";
    return `
      <section class="section-block">
        <div class="category-grid">
          ${state.categories.map((category) => categoryCard(category)).join("")}
        </div>
      </section>
    `;
  }

  function gameCard(game, variant) {
    const badge = getBadge(game, variant);
    return `
      <a class="game-card ${variant === "featured" ? "featured-game-card" : ""}" href="${hrefFor("game", game.slug)}">
        <div class="poster ${game.coverImage ? "has-image" : ""}" style="${posterStyle(game)}">
          ${badge ? `<span class="badge ${badge.className}">${escapeHTML(badge.label)}</span>` : ""}
          ${posterContent(game)}
        </div>
        <div class="game-card-body">
          <h3>${escapeHTML(game.title)}</h3>
          <p>${escapeHTML(game.oneLine || game.description)}</p>
        </div>
      </a>
    `;
  }

  function miniGameCard(game) {
    return `
      <a class="mini-game" href="${hrefFor("game", game.slug)}" title="${escapeAttr(game.title)}">
        <div class="poster ${game.coverImage ? "has-image" : ""}" style="${posterStyle(game)}">
          ${posterContent(game)}
        </div>
        <div class="mini-game-body">
          <strong>${escapeHTML(game.title)}</strong>
          <span>${game.mobileReady ? "Mobile Ready" : "PC Ready"}</span>
        </div>
      </a>
    `;
  }

  function categoryCard(category) {
    const count = gamesInCategory(category.slug).length;
    return `
      <a class="category-card" href="${hrefFor("category", category.slug)}">
        ${categoryIconMarkup(category)}
        <span>
          <strong>${escapeHTML(category.name)}</strong>
          <span>${count} game${count === 1 ? "" : "s"}</span>
        </span>
      </a>
    `;
  }

  function categoryIconMarkup(category) {
    const color = category.color || "#007aff";
    return `
      <span class="category-icon" style="--category-color:${escapeAttr(color)}; --category-bg:${escapeAttr(hexToSoftBg(color))}">
        ${category.iconImage ? `<img src="${escapeAttr(displayImageSrc(category.iconImage))}" alt="">` : icon(category.icon || "gamepad-2")}
      </span>
    `;
  }

  function posterContent(game) {
    if (game.coverImage) {
      return `<img class="poster-image" src="${escapeAttr(displayImageSrc(game.coverImage))}" alt="${escapeAttr(game.title)} cover" loading="lazy" decoding="async">`;
    }
    return `<span class="poster-initials">${escapeHTML(getInitials(game))}</span>`;
  }

  function tagChip(tag) {
    return `
      <a class="tag-chip" href="${hrefFor("tag", slugify(tag.name))}">
        <span class="tag-name">${escapeHTML(tag.name)}</span>
        <span class="tag-number">${tag.count}</span>
      </a>
    `;
  }

  function renderNavigation() {
    const categoryLinks = document.getElementById("categoryLinks");
    const tagLinks = document.getElementById("tagLinks");
    if (!categoryLinks || !tagLinks) return;

    categoryLinks.innerHTML = state.categories
      .map(
        (category) => `
          <a class="nav-link" href="${hrefFor("category", category.slug)}" data-nav="category:${category.slug}">
            <span class="nav-icon">${category.iconImage ? `<img class="nav-image-icon" src="${escapeAttr(displayImageSrc(category.iconImage))}" alt="">` : icon(category.icon || "gamepad-2")}</span>
            <span class="nav-text">${escapeHTML(category.name)}</span>
          </a>
        `
      )
      .join("");

    const tagTotal = getTagCounts().length;
    tagLinks.innerHTML = `
      <a class="nav-link" href="${hrefFor("tags")}" data-nav="tags">
        <span class="nav-icon">${icon("tags")}</span>
        <span class="nav-text">Tags</span>
        <span class="tag-count">${tagTotal}</span>
      </a>
    `;
  }

  function renderSearchCategories() {
    if (!quickCategories) return;
    quickCategories.innerHTML = state.categories
      .slice(0, 6)
      .map(
        (category) => `
          <a class="quick-category" href="${hrefFor("category", category.slug)}">
            ${category.iconImage ? `<img class="quick-image-icon" src="${escapeAttr(displayImageSrc(category.iconImage))}" alt="">` : icon(category.icon || "gamepad-2")}
            <span>${escapeHTML(category.name)}</span>
          </a>
        `
      )
      .join("");
    updateSearchResults(searchInput ? searchInput.value : "");
  }

  function renderStaticLinks() {
    const site = getSiteSettings();
    const brand = document.querySelector(".brand");
    if (brand) {
      brand.setAttribute("href", hrefFor("home"));
      brand.setAttribute("aria-label", `${site.title} home`);
      const mark = brand.querySelector(".brand-mark");
      if (mark) {
        mark.innerHTML = site.iconImage
          ? `<img class="brand-icon-image" src="${escapeAttr(displayImageSrc(site.iconImage))}" alt="">`
          : `<span class="brand-mark-inner">${escapeHTML(site.iconText || "CG")}</span>`;
      }
    }
    setSiteIcon(site.iconImage);

    const routes = {
      home: ["home", ""],
      recent: ["recent", ""],
      latest: ["latest", ""],
      popular: ["popular", ""],
      tags: ["tags", ""]
    };

    Object.entries(routes).forEach(([nav, route]) => {
      document.querySelectorAll(`[data-nav="${nav}"]`).forEach((link) => {
        link.setAttribute("href", hrefFor(route[0], route[1]));
      });
    });
  }

  function setActiveNavigation(route) {
    document.querySelectorAll("[data-nav]").forEach((link) => link.classList.remove("is-active"));
    let key = route.page;
    if (route.page === "category") key = `category:${route.value}`;
    if (route.page === "tag") key = "tags";
    const active = Array.from(document.querySelectorAll("[data-nav]")).find((link) => link.dataset.nav === key);
    if (active) active.classList.add("is-active");
  }

  function handleDocumentClick(event) {
    const anchor = event.target.closest("a[href]");
    if (anchor) {
      const route = routeFromHref(anchor.getAttribute("href"));
      if (route) {
        event.preventDefault();
        navigateTo(route.page, route.value);
        if (window.matchMedia("(max-width: 760px)").matches) {
          document.body.classList.remove("sidebar-open");
        }
        hideSearchPanel();
        return;
      }
    }

    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      const action = actionTarget.getAttribute("data-action");
      if (action === "toggle-sidebar") {
        document.body.classList.toggle("sidebar-open");
      }
      if (action === "clear-search") {
        clearSearch();
      }
      if (action === "random-game") {
        goRandomGame();
      }
      if (action === "share-site") {
        shareSite();
      }
      if (action === "back-top") {
        goBackToTop();
      }
      if (action === "fullscreen-game") {
        openFullscreen();
      }
      if (action === "logout") {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(REMOTE_SESSION_KEY);
        toast("Logged out.");
        navigateTo("login");
      }
      if (action === "edit-category") {
        window.history.pushState({}, "", adminEditPath("categories", actionTarget.getAttribute("data-slug")));
        render();
      }
      if (action === "edit-game") {
        window.history.pushState({}, "", adminEditPath("games", actionTarget.getAttribute("data-slug")));
        render();
      }
      if (action === "edit-user") {
        window.history.pushState({}, "", adminEditPath("collaborators", actionTarget.getAttribute("data-username")));
        render();
      }
      if (action === "choose-color") {
        chooseColor(actionTarget);
      }
      if (action === "toggle-list-selection") {
        toggleListSelection(actionTarget);
      }
      if (action === "clear-bulk-import") {
        clearBulkImport();
      }
      if (action === "import-bulk-games") {
        importBulkGames();
      }
      if (action === "push-browser-cache") {
        pushBrowserDataToCloud();
      }
      if (action === "category-top") {
        moveCategory(actionTarget.getAttribute("data-slug"), "top");
      }
      if (action === "category-up") {
        moveCategory(actionTarget.getAttribute("data-slug"), "up");
      }
      if (action === "category-down") {
        moveCategory(actionTarget.getAttribute("data-slug"), "down");
      }
      if (action === "delete-category") {
        deleteCategory(actionTarget.getAttribute("data-slug"));
      }
      if (action === "delete-game") {
        deleteGame(actionTarget.getAttribute("data-slug"));
      }
      if (action === "delete-selected-games") {
        deleteSelectedGames();
      }
      if (action === "restore-game") {
        restoreDeletedGames([actionTarget.getAttribute("data-slug")]);
      }
      if (action === "restore-selected-games") {
        restoreDeletedGames(getCheckedValues("selectedDeletedGame"));
      }
      if (action === "permanent-delete-game") {
        permanentlyDeleteGames([actionTarget.getAttribute("data-slug")]);
      }
      if (action === "permanent-delete-selected-games") {
        permanentlyDeleteGames(getCheckedValues("selectedDeletedGame"));
      }
      if (action === "delete-user") {
        deleteUser(actionTarget.getAttribute("data-username"));
      }
    }

    const navLink = event.target.closest(".nav-link, .quick-category, .search-result");
    if (navLink && window.matchMedia("(max-width: 760px)").matches) {
      document.body.classList.remove("sidebar-open");
    }

    if (searchWrap && !searchWrap.contains(event.target)) {
      hideSearchPanel();
    }
  }

  async function handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === "loginForm") {
      event.preventDefault();
      await login(form);
    }

    if (form.id === "categoryForm") {
      event.preventDefault();
      saveCategory(form);
    }

    if (form.id === "siteSettingsForm") {
      event.preventDefault();
      saveSiteSettings(form);
    }

    if (form.id === "gameForm") {
      event.preventDefault();
      addGame(form);
    }

    if (form.id === "collaboratorForm") {
      event.preventDefault();
      addCollaborator(form);
    }

    if (form.id === "passwordForm") {
      event.preventDefault();
      updateAdminPassword(form);
    }
  }

  async function handleChange(event) {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "file") {
      if (target.hasAttribute("data-bulk-game-file")) {
        await handleBulkGameFileUpload(target);
        return;
      }
      if (target.hasAttribute("data-bulk-image-files")) {
        await handleBulkImageUpload(target);
        return;
      }
      await handleImageUpload(target);
      return;
    }

    if (!(target instanceof HTMLSelectElement)) return;
    if (target.name !== "existingSlug") return;

    const form = target.closest("form");
    const category = findCategory(target.value);
    if (!form || !category) {
      if (form) {
        form.elements.name.value = "";
        form.elements.icon.value = "";
        form.elements.color.value = "#007aff";
      }
      return;
    }

    form.elements.name.value = category.name;
    form.elements.icon.value = category.icon;
    form.elements.color.value = category.color || "#007aff";
  }

  function handleDocumentInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!["iconImageUrl", "iconImage", "coverImageUrl"].includes(target.name)) return;

    const value = target.value.trim();
    const form = target.closest("form");
    const hiddenId =
      target.name === "coverImageUrl"
        ? "gameCoverImageData"
        : target.name === "iconImage"
          ? "categoryIconImageData"
          : "siteIconImageData";
    const previewId =
      target.name === "coverImageUrl"
        ? "gameCoverPreview"
        : target.name === "iconImage"
          ? "categoryIconPreview"
          : "siteIconPreview";
    const hidden = form ? form.querySelector(`#${hiddenId}`) : document.getElementById(hiddenId);
    const preview = form ? form.querySelector(`#${previewId}`) : document.getElementById(previewId);

    if (hidden) hidden.value = value;
    if (preview && value) {
      preview.innerHTML = `<img src="${escapeAttr(value)}" alt="">`;
    }
  }

  async function handleImageUpload(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please upload an image file.");
      return;
    }

    const dataUrl = await readCompressedImageAsDataURL(file);
    const imageValue = await uploadImageIfCloudReady(dataUrl, input.dataset.uploadFolder || "uploads", file.name);
    const hidden = document.getElementById(input.dataset.hiddenTarget);
    const preview = document.getElementById(input.dataset.previewTarget);
    if (hidden) hidden.value = imageValue;
    if (preview) preview.innerHTML = `<img src="${escapeAttr(imageValue)}" alt="">`;
  }

  async function handleBulkGameFileUpload(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    try {
      const rows = await readBulkGameFile(file);
      pendingBulkGames = validateBulkImportRows(rows.map((row, index) => normalizeBulkGameRow(row, index + 2)).filter((row) => row.hasContent));
      pendingBulkImages = new Map();
      toast(`${pendingBulkGames.length} row${pendingBulkGames.length === 1 ? "" : "s"} read from ${file.name}.`);
      render();
    } catch (error) {
      toast(error.message || "Could not read this import file.");
    }
  }

  async function handleBulkImageUpload(input) {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    if (!pendingBulkGames.length) {
      toast("Upload and read a game file before adding cover images.");
      return;
    }

    let matched = 0;
    const validNos = new Set(pendingBulkGames.map((row) => normalizeImportNo(row.no)));
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const no = imageNoFromFileName(file.name);
      if (!validNos.has(no)) continue;
      const dataUrl = await readCompressedImageAsDataURL(file);
      const imageValue = await uploadImageIfCloudReady(dataUrl, "game-covers", file.name);
      pendingBulkImages.set(no, imageValue);
      matched += 1;
    }

    toast(`${matched} image${matched === 1 ? "" : "s"} matched by No.`);
    render();
  }

  async function uploadImageIfCloudReady(dataUrl, folder, fileName) {
    if (!API_ENABLED || !getRemoteToken()) return dataUrl;

    try {
      const response = await apiFetch("/upload-image", {
        method: "POST",
        token: getRemoteToken(),
        body: { dataUrl, folder, fileName }
      });

      if (!response || !response.ok) {
        throw new Error("Image upload failed");
      }

      const payload = await response.json();
      if (payload && payload.url) {
        cloudSyncActive = true;
        return payload.url;
      }
    } catch (error) {
      toast("Cloud image upload failed. The image was kept in this browser only.");
    }

    return dataUrl;
  }

  async function pushBrowserDataToCloud() {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      toast("Only admin can push browser data to cloud.");
      return;
    }
    if (!cloudSyncActive || !getRemoteToken()) {
      toast("Connect Cloudflare D1/R2 and log in before pushing browser data.");
      return;
    }
    if (!window.confirm("Push this browser's saved games, categories, settings, and uploaded images to cloud storage? This can overwrite the current cloud data.")) {
      return;
    }

    const next = normalizeState(browserStateSnapshot || state);
    toast("Uploading browser images to cloud...");
    await replaceInlineImagesWithCloudUrls(next);
    state = next;
    localStorage.setItem(DATA_KEY, JSON.stringify(state));
    await syncStateToRemote();
    browserStateSnapshot = clone(state);
    toast("Browser data pushed to cloud.");
    render();
  }

  async function replaceInlineImagesWithCloudUrls(next) {
    if (isInlineImage(next.site?.iconImage)) {
      next.site.iconImage = await uploadImageIfCloudReady(next.site.iconImage, "site-icons", "site-icon.jpg");
    }

    for (const category of next.categories) {
      if (isInlineImage(category.iconImage)) {
        category.iconImage = await uploadImageIfCloudReady(category.iconImage, "category-icons", `${category.slug || category.name || "category"}.jpg`);
      }
    }

    const games = [...next.games, ...next.deletedGames];
    for (const game of games) {
      if (isInlineImage(game.coverImage)) {
        game.coverImage = await uploadImageIfCloudReady(game.coverImage, "game-covers", `${game.slug || game.title || "game"}.jpg`);
      }
    }
  }

  function isInlineImage(value) {
    return /^data:image\//i.test(String(value || ""));
  }

  async function readBulkGameFile(file) {
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension === "csv" || extension === "tsv") {
      const text = await readFileAsText(file);
      return rowsFromDelimitedText(text, extension === "tsv" ? "\t" : null);
    }

    if (extension === "xlsx" || extension === "xls" || extension === "exl") {
      await ensureSheetJS();
      const buffer = await readFileAsArrayBuffer(file);
      const workbook = window.XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("This Excel file has no sheets.");
      return window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
    }

    throw new Error("Please upload a CSV, TSV, XLSX, XLS, or EXL file.");
  }

  async function ensureSheetJS() {
    if (window.XLSX) return;
    if (!sheetJSPromise) {
      sheetJSPromise = loadScript(SHEETJS_URL);
    }
    try {
      await sheetJSPromise;
    } catch (error) {
      sheetJSPromise = null;
      throw new Error("Excel reading library could not load. Please use CSV, or check your internet connection and try again.");
    }
    if (!window.XLSX) {
      throw new Error("Excel reading library could not start. Please use CSV or try again.");
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function rowsFromDelimitedText(text, forcedDelimiter) {
    const cleanText = String(text || "").replace(/^\uFEFF/, "");
    const firstLine = cleanText.split(/\r?\n/, 1)[0] || "";
    const delimiter = forcedDelimiter || ((firstLine.match(/\t/g) || []).length > (firstLine.match(/,/g) || []).length ? "\t" : ",");
    const rows = parseDelimitedRows(cleanText, delimiter).filter((row) => row.some((cell) => String(cell || "").trim()));
    if (!rows.length) return [];
    const headers = rows[0].map((cell) => String(cell || "").trim());
    return rows.slice(1).map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || "";
      });
      return item;
    });
  }

  function parseDelimitedRows(text, delimiter) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"') {
        if (quoted && next === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
        continue;
      }

      if (char === delimiter && !quoted) {
        row.push(cell);
        cell = "";
        continue;
      }

      if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
        continue;
      }

      cell += char;
    }

    row.push(cell);
    rows.push(row);
    return rows;
  }

  function normalizeBulkGameRow(source, rowNumber) {
    const no = cellByAliases(source, ["no", "number", "id"]);
    const title = cellByAliases(source, ["title", "gametitle", "name"]);
    const iframeInput = cellByAliases(source, ["preloaderlink", "preloader", "iframelink", "iframe", "iframecode", "embedcode", "gameurl", "url", "link"]);
    const iframeUrl = normalizeIframeInput(iframeInput);
    const aspectRatio = normalizeAspectRatioInput(cellByAliases(source, ["aspectratio", "ratio", "gamesize", "size", "dimensions", "resolution"])) || extractIframeAspectRatio(iframeInput);
    const oneLineInput = cellByAliases(source, ["onesentenceintro", "onesentence", "oneline", "shortintro", "shortdescription", "summary", "tagline"]);
    const coverImageUrl = cellByAliases(source, ["imageurl", "coverurl", "coverimage", "coverimageurl", "thumbnail", "thumbnailurl", "poster", "posterurl", "picture", "pictureurl"]);
    const categoryNames = splitImportCategories(cellByAliases(source, ["category", "categories", "gametype", "type"]));
    const description = cellByAliases(source, ["description", "desc", "gameintroduction", "intro"]);
    const tags = splitImportTags(cellByAliases(source, ["tags", "keywords", "keyword"]));
    const instructions = cellByAliases(source, ["instructions", "instruction", "controls", "operation"]);
    const hasContent = [no, title, iframeInput, aspectRatio, oneLineInput, coverImageUrl, categoryNames.join(""), description, tags.join(""), instructions].some(Boolean);
    const errors = [];

    if (!no) errors.push("No is missing");
    if (!title) errors.push("Title is missing");
    if (!iframeUrl) errors.push("PRELOADER Link is missing");
    if (iframeInput && !iframeUrl) errors.push("PRELOADER Link must be an http/https URL or iframe code with src");
    if (!categoryNames.length) errors.push("Category is missing");
    if (!description) errors.push("Description is missing");
    if (!tags.length) errors.push("Tags are missing");
    if (coverImageUrl && !isImportImageUrl(coverImageUrl)) errors.push("Image URL must start with http:// or https://");

    return {
      no,
      title,
      iframeUrl,
      aspectRatio,
      coverImageUrl,
      categoryNames,
      description,
      tags,
      instructions,
      oneLine: oneLineInput || firstSentence(description) || `${title || "This game"} is ready to play online on cozygamespc.`,
      rowNumber,
      hasContent,
      errors
    };
  }

  function validateBulkImportRows(rows) {
    const existingTitles = new Set([...state.games, ...(state.deletedGames || [])].map((game) => normalizeTitleKey(game.title)));
    const importTitleCounts = new Map();

    rows.forEach((row) => {
      const key = normalizeTitleKey(row.title);
      if (!key) return;
      importTitleCounts.set(key, (importTitleCounts.get(key) || 0) + 1);
    });

    return rows.map((row) => {
      const errors = [...row.errors];
      const key = normalizeTitleKey(row.title);
      if (key && existingTitles.has(key)) {
        errors.push("Title already exists");
      }
      if (key && importTitleCounts.get(key) > 1) {
        errors.push("Duplicate title in import file");
      }
      return { ...row, errors: uniqueValues(errors) };
    });
  }

  function normalizeTitleKey(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  function isImportImageUrl(value) {
    return /^https?:\/\//i.test(String(value || "").trim());
  }

  function normalizeIframeInput(value) {
    const text = decodeHTMLValue(String(value || "").trim());
    if (!text) return "";
    const directUrl = normalizeURLCandidate(text);
    if (directUrl) return directUrl;

    const src = extractIframeAttribute(text, "src") || extractIframeAttribute(text, "data-src");
    return normalizeURLCandidate(src);
  }

  function extractIframeAspectRatio(value) {
    const text = decodeHTMLValue(String(value || "").trim());
    if (!/<iframe[\s>]/i.test(text)) return "";
    const width = parseDimensionNumber(extractIframeAttribute(text, "width"));
    const height = parseDimensionNumber(extractIframeAttribute(text, "height"));
    return normalizeAspectPair(width, height);
  }

  function normalizeAspectRatioInput(value) {
    const text = decodeHTMLValue(String(value || ""))
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
    if (!text) return "";

    const pair = text.match(/(\d+(?:\.\d+)?)\s*(?:x|×|by|:|\/)\s*(\d+(?:\.\d+)?)/i);
    if (pair) return normalizeAspectPair(Number(pair[1]), Number(pair[2]));

    const decimal = text.match(/^(\d+(?:\.\d+)?)$/);
    if (decimal) return normalizeAspectPair(Number(decimal[1]), 1);

    return "";
  }

  function parseDimensionNumber(value) {
    const text = String(value || "").trim();
    if (!text || /%/.test(text)) return 0;
    const match = text.match(/^(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  }

  function normalizeAspectPair(width, height) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return "";
    return `${formatRatioNumber(width)} / ${formatRatioNumber(height)}`;
  }

  function formatRatioNumber(value) {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
  }

  function normalizeURLCandidate(value) {
    const text = String(value || "").trim();
    if (/^https?:\/\//i.test(text)) return normalizeProviderIframeUrl(text);
    if (/^\/\//.test(text)) return normalizeProviderIframeUrl(`https:${text}`);
    return "";
  }

  function normalizeProviderIframeUrl(value) {
    const text = String(value || "").trim();
    if (!text) return "";

    try {
      const url = new URL(text);
      const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (hostname === "play.famobi.com" && pathParts.length === 1) {
        url.pathname = `/${pathParts[0]}/A-FAMOBI-COM`;
        return url.toString();
      }
    } catch (error) {
      return text;
    }

    return text;
  }

  function isFamobiIframeUrl(value) {
    try {
      const url = new URL(String(value || "").trim());
      return url.hostname.toLowerCase().replace(/^www\./, "") === "play.famobi.com";
    } catch (error) {
      return false;
    }
  }

  function extractIframeAttribute(markup, attribute) {
    const pattern = new RegExp(`(?:^|[\\s<])${escapeRegExp(attribute)}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|([^\\s>]+))`, "i");
    const match = String(markup || "").match(pattern);
    return decodeHTMLValue((match && (match[1] || match[2] || match[3])) || "").trim();
  }

  function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function decodeHTMLValue(value) {
    return String(value || "")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  function cellByAliases(row, aliases) {
    const normalizedAliases = aliases.map(normalizeHeaderName);
    const match = Object.keys(row || {}).find((key) => normalizedAliases.includes(normalizeHeaderName(key)));
    return String(match ? row[match] : "").trim();
  }

  function normalizeHeaderName(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function splitImportCategories(value) {
    return splitImportByExplicitSeparators(value);
  }

  function splitImportTags(value) {
    const text = String(value || "").trim();
    if (!text) return [];
    if (/[\r\n,;\uFF0C\uFF1B|/]/.test(text)) {
      return splitImportByExplicitSeparators(text);
    }
    return text
      .split(/\s+/)
      .map((item) => normalizeTag(item))
      .filter(Boolean);
  }

  function splitImportByExplicitSeparators(value) {
    return String(value || "")
      .split(/[\r\n,;\uFF0C\uFF1B|/]+/)
      .map((item) => normalizeTag(item))
      .filter(Boolean);
  }

  function firstSentence(value) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text) return "";
    const match = text.match(/^(.{1,150}?[.!?])\s/);
    return (match ? match[1] : text.slice(0, 150)).trim();
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function readCompressedImageAsDataURL(file) {
    const dataUrl = await readFileAsDataURL(file);
    try {
      const image = await loadImage(dataUrl);
      const maxWidth = 420;
      const maxHeight = 280;
      const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL("image/jpeg", 0.72);
    } catch (error) {
      return dataUrl;
    }
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  function chooseColor(button) {
    const list = button.closest("[data-color-field]");
    const field = list ? document.getElementById(list.dataset.colorField) : null;
    if (!field) return;
    field.value = button.dataset.color || "#007aff";
    list.querySelectorAll(".color-swatch").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  }

  function moveCategory(slug, direction) {
    const user = getCurrentUser();
    if (!user) {
      toast("Please log in first.");
      return;
    }

    const index = state.categories.findIndex((category) => category.slug === slug);
    if (index < 0) return;

    let targetIndex = index;
    if (direction === "top") targetIndex = 0;
    if (direction === "up") targetIndex = Math.max(0, index - 1);
    if (direction === "down") targetIndex = Math.min(state.categories.length - 1, index + 1);
    if (targetIndex === index) return;

    const [category] = state.categories.splice(index, 1);
    state.categories.splice(targetIndex, 0, category);
    saveState();
    toast("Category order updated.");
    render();
  }

  function toggleListSelection(input) {
    const list = document.getElementById(input.getAttribute("data-target-list"));
    if (!list) return;
    list.querySelectorAll('input[type="checkbox"].admin-select').forEach((checkbox) => {
      checkbox.checked = input.checked;
    });
  }

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
  }

  function clearBulkImport() {
    pendingBulkGames = [];
    pendingBulkImages = new Map();
    toast("Bulk import cleared.");
    render();
  }

  function importBulkGames() {
    const user = getCurrentUser();
    if (!user) {
      toast("Please log in first.");
      return;
    }

    pendingBulkGames = validateBulkImportRows(pendingBulkGames);
    const readyRows = pendingBulkGames.filter((row) => !row.errors.length);
    if (!readyRows.length) {
      toast("No valid rows are ready to import.");
      render();
      return;
    }

    const previousGames = state.games;
    const previousCategories = clone(state.categories);
    const usedSlugs = new Set();
    const importedGames = readyRows.map((row) => {
      const categorySlugs = row.categoryNames.map((name) => ensureCategoryByName(name));
      const title = row.title.trim();
      const slugBase = slugify(title);
      let slug = uniqueGameSlug(slugBase);
      let index = 2;
      while (usedSlugs.has(slug)) {
        slug = `${slugBase}-${index}`;
        index += 1;
      }
      usedSlugs.add(slug);
      return {
        title,
        slug,
        importNo: row.no,
        oneLine: row.oneLine,
        iframeUrl: row.iframeUrl,
        aspectRatio: row.aspectRatio,
        mobileReady: true,
        iframePermissions: { ...DEFAULT_IFRAME_PERMISSIONS },
        categories: categorySlugs,
        tags: row.tags,
        description: row.description,
        instructions: row.instructions,
        published: new Date().toISOString().slice(0, 10),
        clicks: 0,
        initials: getInitials({ title }),
        poster: colorPairFromString(title),
        coverImage: pendingBulkImages.get(normalizeImportNo(row.no)) || row.coverImageUrl || ""
      };
    });

    try {
      state.games = [...importedGames, ...state.games];
      saveState();
    } catch (error) {
      state.games = previousGames;
      state.categories = previousCategories;
      const isQuotaError = error && (error.name === "QuotaExceededError" || String(error.message || "").toLowerCase().includes("quota"));
      toast(isQuotaError ? "Import failed: cover images are still too large for browser storage. Try fewer images or smaller images." : "Import failed while saving. Please try again.");
      return;
    }

    pendingBulkGames = [];
    pendingBulkImages = new Map();
    toast(`${importedGames.length} game${importedGames.length === 1 ? "" : "s"} imported.`);
    render();
  }

  function ensureCategoryByName(name) {
    const normalized = normalizeTag(name);
    const existing = state.categories.find((category) => category.slug === slugify(normalized) || category.name.toLowerCase() === normalized.toLowerCase());
    if (existing) return existing.slug;

    const color = appleColors()[state.categories.length % appleColors().length].value;
    const category = {
      name: normalized,
      slug: uniqueSlug(slugify(normalized), state.categories),
      icon: "gamepad-2",
      iconImage: "",
      color
    };
    state.categories.push(category);
    return category.slug;
  }

  function normalizeImportNo(value) {
    const clean = String(value || "").trim().replace(/\.[^.]+$/, "").toLowerCase();
    if (/^\d+$/.test(clean)) return String(Number(clean));
    return clean.replace(/\s+/g, "");
  }

  function imageNoFromFileName(fileName) {
    const base = String(fileName || "").replace(/\.[^.]+$/, "");
    const direct = normalizeImportNo(base);
    if (pendingBulkGames.some((row) => normalizeImportNo(row.no) === direct)) return direct;
    const numberMatch = base.match(/\d+/);
    return numberMatch ? normalizeImportNo(numberMatch[0]) : direct;
  }

  async function login(form) {
    const data = new FormData(form);
    const username = String(data.get("username") || "").trim();
    const password = String(data.get("password") || "");

    if (API_ENABLED) {
      try {
        const response = await apiFetch("/login", {
          method: "POST",
          body: { username, password }
        });

        if (response && response.status === 401) {
          toast("Invalid username or password.");
          return;
        }

        if (response && response.ok) {
          const payload = await response.json();
          if (payload && payload.token && payload.user) {
            setRemoteSession(payload);
            await fetchRemoteAdminState();
            toast("Welcome back.");
            navigateTo("admin", "categories");
            return;
          }
        }

        toast("Cloud backend is not connected. Check the D1 binding name and redeploy.");
        return;
      } catch (error) {
        cloudSyncActive = false;
        toast("Cloud backend is not connected. Check the D1 binding name and redeploy.");
        return;
      }
    }

    const user = state.users.find((item) => item.username === username && item.password === password);

    if (!user) {
      toast("Invalid username or password.");
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, role: user.role }));
    toast("Welcome back.");
    navigateTo("admin", "categories");
  }

  function saveSiteSettings(form) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      toast("Only admin can update site settings.");
      return;
    }

    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    const description = String(data.get("description") || "").trim();
    const homeHeadline = String(data.get("homeHeadline") || "").trim() || defaultSiteSettings.homeHeadline;
    const iconImage = String(data.get("iconImageUrl") || data.get("iconImageData") || "").trim();
    const gameTitlePhrase = String(data.get("gameTitlePhrase") || "").trim();
    const gameDescriptionPhraseB = String(data.get("gameDescriptionPhraseB") || "").trim();
    const gameDescriptionPhraseC = String(data.get("gameDescriptionPhraseC") || "").trim();

    if (!title || !description) {
      toast("Website title and description are required.");
      return;
    }

    state.site = {
      ...getSiteSettings(),
      title,
      description,
      homeHeadline,
      iconImage,
      gameTitlePhrase,
      gameDescriptionPhraseB,
      gameDescriptionPhraseC
    };
    saveState();
    toast("Site settings updated.");
    render();
  }

  function saveCategory(form) {
    const user = getCurrentUser();
    if (!user) {
      toast("Please log in first.");
      return;
    }

    const data = new FormData(form);
    const existingSlug = String(data.get("existingSlug") || "");
    const name = String(data.get("name") || "").trim();
    const iconName = String(data.get("icon") || "gamepad-2").trim();
    const color = String(data.get("color") || "#007aff").trim();
    const iconImage = String(data.get("iconImage") || data.get("iconImageData") || "").trim();

    if (!name) {
      toast("Category name is required.");
      return;
    }

    if (existingSlug) {
      const category = findCategory(existingSlug);
      if (!category) {
        toast("Category not found.");
        return;
      }
      category.name = name;
      category.icon = iconName;
      category.color = color;
      category.iconImage = iconImage;
      toast("Category updated.");
    } else {
      const slug = uniqueSlug(slugify(name), state.categories);
      state.categories.push({ name, slug, icon: iconName, color, iconImage });
      toast("Category added.");
    }

    saveState();
    navigateTo("admin", "categories", { replace: true });
  }

  function addGame(form) {
    const user = getCurrentUser();
    if (!user) {
      toast("Please log in first.");
      return;
    }

    const data = new FormData(form);
    const existingSlug = String(data.get("existingSlug") || "");
    const title = String(data.get("title") || "").trim();
    const oneLine = String(data.get("oneLine") || "").trim();
    const iframeInput = String(data.get("iframeUrl") || "").trim();
    const iframeUrl = normalizeIframeInput(iframeInput);
    const aspectRatio = normalizeAspectRatioInput(String(data.get("aspectRatio") || "")) || extractIframeAspectRatio(iframeInput);
    const tags = splitList(String(data.get("tags") || ""));
    const description = String(data.get("description") || "").trim();
    const coverImage = String(data.get("coverImageUrl") || data.get("coverImageData") || "").trim();
    const categories = Array.from(form.elements.categories.selectedOptions).map((option) => option.value);
    const iframePermissions = readIframePermissions(data);

    if (!title || !oneLine || !tags.length || !description || !categories.length) {
      toast("Please complete the required game fields.");
      return;
    }

    if (iframeInput && !iframeUrl) {
      toast("Please enter a valid iframe URL or iframe code with an http/https src.");
      return;
    }

    if (existingSlug) {
      const game = state.games.find((item) => item.slug === existingSlug);
      if (!game) {
        toast("Game not found.");
        return;
      }
      game.title = title;
      game.oneLine = oneLine;
      game.iframeUrl = iframeUrl;
      game.aspectRatio = aspectRatio;
      game.mobileReady = Boolean(data.get("mobileReady"));
      game.iframePermissions = iframePermissions;
      delete game.strictIframe;
      game.categories = categories;
      game.tags = tags;
      game.description = description;
      game.coverImage = coverImage;
      saveState();
      toast("Game updated.");
      navigateTo("admin", "games", { replace: true });
      return;
    }

    const slug = uniqueGameSlug(slugify(title));
    const colors = colorPairFromString(title);
    state.games.unshift({
      title,
      slug,
      oneLine,
      iframeUrl,
      aspectRatio,
      mobileReady: Boolean(data.get("mobileReady")),
      iframePermissions,
      categories,
      tags,
      description,
      published: new Date().toISOString().slice(0, 10),
      clicks: 0,
      initials: getInitials({ title }),
      poster: colors,
      coverImage
    });

    saveState();
    toast("Game page added.");
    navigateTo("admin", "games", { replace: true });
  }

  function addCollaborator(form) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      toast("Only the initial administrator can add collaborators.");
      return;
    }

    const data = new FormData(form);
    const existingUsername = String(data.get("existingUsername") || "").trim();
    const username = String(data.get("username") || "").trim();
    const password = String(data.get("password") || "").trim();

    if (!username || !password) {
      toast("Username and password are required.");
      return;
    }

    if (existingUsername) {
      const collaborator = state.users.find((item) => item.username === existingUsername && item.role === "collaborator");
      if (!collaborator) {
        toast("Collaborator not found.");
        return;
      }
      if (username !== existingUsername && state.users.some((item) => item.username === username)) {
        toast("That username already exists.");
        return;
      }
      collaborator.username = username;
      collaborator.password = password;
      saveState();
      toast("Collaborator updated.");
      navigateTo("admin", "collaborators", { replace: true });
      return;
    }

    if (state.users.some((item) => item.username === username)) {
      toast("That username already exists.");
      return;
    }

    state.users.push({ username, password, role: "collaborator" });
    saveState();
    toast("Collaborator added.");
    navigateTo("admin", "collaborators", { replace: true });
  }

  function updateAdminPassword(form) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      toast("Only admin can change the admin password.");
      return;
    }

    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") || "");
    const newPassword = String(data.get("newPassword") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    const admin = state.users.find((item) => item.username === "admin" && item.role === "admin");

    if (!admin || admin.password !== currentPassword) {
      toast("Current password is incorrect.");
      return;
    }
    if (!newPassword || newPassword !== confirmPassword) {
      toast("New passwords do not match.");
      return;
    }

    admin.password = newPassword;
    saveState();
    toast("Admin password updated.");
    form.reset();
  }

  function deleteCategory(slug) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") return;
    const category = findCategory(slug);
    if (!category) return;
    if (!window.confirm(`Delete category "${category.name}"? Games will keep working but this category will be removed from them.`)) return;
    state.categories = state.categories.filter((item) => item.slug !== slug);
    state.games.forEach((game) => {
      game.categories = game.categories.filter((item) => item !== slug);
    });
    saveState();
    toast("Category deleted.");
    render();
  }

  function deleteGame(slug) {
    softDeleteGames([slug]);
  }

  function deleteSelectedGames() {
    softDeleteGames(getCheckedValues("selectedGame"));
  }

  function softDeleteGames(slugs) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") return;
    const targets = uniqueValues(slugs).map((slug) => state.games.find((item) => item.slug === slug)).filter(Boolean);
    if (!targets.length) {
      toast("Select at least one game.");
      return;
    }
    const label = targets.length === 1 ? `"${targets[0].title}"` : `${targets.length} games`;
    if (!window.confirm(`Move ${label} to Deleted Games?`)) return;

    state.deletedGames = Array.isArray(state.deletedGames) ? state.deletedGames : [];
    state.deletedSeedGames = Array.isArray(state.deletedSeedGames) ? state.deletedSeedGames : [];

    targets.forEach((game) => {
      if (seedGames.some((item) => item.slug === game.slug) && !state.deletedSeedGames.includes(game.slug)) {
        state.deletedSeedGames.push(game.slug);
      }
      if (!state.deletedGames.some((item) => item.slug === game.slug)) {
        state.deletedGames.unshift({ ...clone(game), deletedAt: new Date().toISOString().slice(0, 10) });
      }
    });

    const targetSlugs = new Set(targets.map((game) => game.slug));
    state.games = state.games.filter((item) => !targetSlugs.has(item.slug));
    saveState();
    toast(targets.length === 1 ? "Game moved to Deleted Games." : "Selected games moved to Deleted Games.");
    render();
  }

  function restoreDeletedGames(slugs) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") return;
    state.deletedGames = Array.isArray(state.deletedGames) ? state.deletedGames : [];
    const targets = uniqueValues(slugs).map((slug) => state.deletedGames.find((item) => item.slug === slug)).filter(Boolean);
    if (!targets.length) {
      toast("Select at least one deleted game.");
      return;
    }

    const restoreSlugs = new Set();
    const skipped = [];
    targets.forEach((game) => {
      if (state.games.some((item) => item.slug === game.slug)) {
        skipped.push(game.title);
        return;
      }
      const restored = clone(game);
      delete restored.deletedAt;
      state.games.unshift(restored);
      restoreSlugs.add(game.slug);
    });

    if (!restoreSlugs.size) {
      toast("No selected games could be restored.");
      return;
    }

    state.deletedGames = state.deletedGames.filter((item) => !restoreSlugs.has(item.slug));
    state.deletedSeedGames = (state.deletedSeedGames || []).filter((slug) => !restoreSlugs.has(slug));
    saveState();
    toast(skipped.length ? "Some games were restored; duplicates were skipped." : "Deleted game restored.");
    render();
  }

  function permanentlyDeleteGames(slugs) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") return;
    state.deletedGames = Array.isArray(state.deletedGames) ? state.deletedGames : [];
    const targets = uniqueValues(slugs).map((slug) => state.deletedGames.find((item) => item.slug === slug)).filter(Boolean);
    if (!targets.length) {
      toast("Select at least one deleted game.");
      return;
    }
    const label = targets.length === 1 ? `"${targets[0].title}"` : `${targets.length} games`;
    if (!window.confirm(`Permanently delete ${label}? This cannot be undone.`)) return;

    const targetSlugs = new Set(targets.map((game) => game.slug));
    state.deletedGames = state.deletedGames.filter((item) => !targetSlugs.has(item.slug));
    saveState();
    toast(targets.length === 1 ? "Game permanently deleted." : "Selected games permanently deleted.");
    render();
  }

  function deleteUser(username) {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") return;
    if (username === "admin") return;
    if (!window.confirm(`Delete collaborator "${username}"?`)) return;
    state.users = state.users.filter((item) => item.username !== username);
    saveState();
    toast("Collaborator deleted.");
    render();
  }

  function getCurrentUser() {
    const session = readJSON(SESSION_KEY);
    if (!session) return null;
    if (session.remote && session.username && session.role && getRemoteToken()) {
      return { username: session.username, role: session.role };
    }
    if (API_ENABLED) return null;
    return state.users.find((user) => user.username === session.username && user.role === session.role) || null;
  }

  function handleSearchInput() {
    updateSearchResults(searchInput.value);
    searchWrap.classList.toggle("has-value", Boolean(searchInput.value.trim()));
    showSearchPanel();
  }

  function handleSearchKeydown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const query = searchInput.value.trim();
    if (lastSearchMatches[0]) {
      navigateTo("game", lastSearchMatches[0].slug);
    } else if (query) {
      navigateTo("search", query);
    }
    hideSearchPanel();
  }

  function updateSearchResults(query) {
    if (!searchResults) return;
    const matches = (query.trim() ? searchGames(query) : getPopularGames()).slice(0, 8);
    lastSearchMatches = matches;

    if (!matches.length) {
      searchResults.innerHTML = `<div class="search-result"><span>${icon("search-x")}</span><div><strong>No matching games</strong><small>Try another title, tag, or category.</small></div></div>`;
      refreshIcons();
      return;
    }

    searchResults.innerHTML = matches
      .map(
        (game) => `
          <a class="search-result" href="${hrefFor("game", game.slug)}">
            ${icon("gamepad-2")}
            <span>
              <strong>${escapeHTML(game.title)}</strong>
              <small>${escapeHTML(game.tags.slice(0, 4).join(", "))}</small>
            </span>
          </a>
        `
      )
      .join("");
    refreshIcons();
  }

  function showSearchPanel() {
    if (searchPanel) searchPanel.hidden = false;
  }

  function hideSearchPanel() {
    if (searchPanel) searchPanel.hidden = true;
  }

  function clearSearch() {
    if (!searchInput) return;
    searchInput.value = "";
    searchWrap.classList.remove("has-value");
    updateSearchResults("");
    searchInput.focus();
  }

  function searchGames(query) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return [];

    return state.games.filter((game) => {
      const categories = game.categories.map((slug) => findCategory(slug)?.name || slug).join(" ");
      const haystack = [game.title, game.oneLine, game.description, game.tags.join(" "), categories].join(" ").toLowerCase();
      return q.split(/\s+/).every((part) => haystack.includes(part));
    });
  }

  function getLatestGames() {
    return [...state.games].sort((a, b) => {
      const byDate = new Date(b.published) - new Date(a.published);
      return byDate || (b.clicks || 0) - (a.clicks || 0);
    });
  }

  function getPopularGames() {
    return [...state.games].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  }

  function getRecentlyPlayedGames() {
    const recents = readJSON(RECENT_KEY) || [];
    return recents.map((slug) => state.games.find((game) => game.slug === slug)).filter(Boolean);
  }

  function recordPlay(slug) {
    const recents = readJSON(RECENT_KEY) || [];
    const next = [slug, ...recents.filter((item) => item !== slug)].slice(0, 60);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));

    const game = state.games.find((item) => item.slug === slug);
    if (game) {
      game.clicks = Number(game.clicks || 0) + 1;
      saveState({ localOnly: true });
      recordRemoteClick(slug);
    }
  }

  async function recordRemoteClick(slug) {
    if (!API_ENABLED) return;

    try {
      const response = await apiFetch("/click", {
        method: "POST",
        body: { slug }
      });
      if (!response || !response.ok) return;
      const payload = await response.json();
      if (!payload || typeof payload.clicks !== "number") return;
      const game = state.games.find((item) => item.slug === slug);
      if (game) {
        game.clicks = payload.clicks;
        localStorage.setItem(DATA_KEY, JSON.stringify(state));
      }
    } catch (error) {
      // Click tracking should never interrupt play.
    }
  }

  function gamesInCategory(slug) {
    return state.games.filter((game) => game.categories.includes(slug));
  }

  function getTagCounts() {
    const counts = new Map();
    state.games.forEach((game) => {
      game.tags.forEach((tag) => {
        const name = normalizeTag(tag);
        counts.set(name, (counts.get(name) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  }

  function findCategory(slug) {
    return state.categories.find((category) => category.slug === slug);
  }

  function getBadge(game, variant) {
    if (variant === "featured") return { label: "Top", className: "top" };
    const latestSlug = getLatestGames()[0]?.slug;
    const popularSlug = getPopularGames()[0]?.slug;
    if (game.slug === latestSlug) return { label: "New", className: "new" };
    if (game.slug === popularSlug) return { label: "Top", className: "top" };
    if ((game.clicks || 0) > 12000) return { label: "Hot", className: "hot" };
    return null;
  }

  function buildGameMetaTitle(game) {
    const site = getSiteSettings();
    const phrase = site.gameTitlePhrase || defaultSiteSettings.gameTitlePhrase;
    return `${game.title} | ${phrase} | CozyGamesPC`;
  }

  function buildGameMetaDescription(game) {
    const site = getSiteSettings();
    const phraseB = stripEndingPunctuation(site.gameDescriptionPhraseB || defaultSiteSettings.gameDescriptionPhraseB);
    const phraseC = String(site.gameDescriptionPhraseC || defaultSiteSettings.gameDescriptionPhraseC).trim();
    const first = stripEndingPunctuation(firstDescriptionSentence(game.description || game.oneLine || "", 60));
    const firstPart = `Play ${game.title}${phraseB ? ` ${phraseB}` : ""}.`;
    const middlePart = first ? ` ${first}!` : "";
    const lastPart = phraseC ? ` ${phraseC}` : "";
    return `${firstPart}${middlePart}${lastPart}`.replace(/\s+/g, " ").trim();
  }

  function firstDescriptionSentence(value, maxWords) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text) return "";
    const sentence = (text.match(/^.*?[.!?](?:\s|$)/) || [text])[0].trim();
    return limitWords(sentence, maxWords);
  }

  function limitWords(value, maxWords) {
    const words = String(value || "").trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(" ");
    return words.slice(0, maxWords).join(" ");
  }

  function stripEndingPunctuation(value) {
    return String(value || "").trim().replace(/[.!?]+$/g, "").replace(/[\u3002\uFF01\uFF1F]+$/g, "");
  }

  function goRandomGame() {
    if (!state.games.length) return;
    const game = state.games[Math.floor(Math.random() * state.games.length)];
    navigateTo("game", game.slug);
  }

  async function shareSite() {
    const site = getSiteSettings();
    const shareData = {
      title: site.title,
      text: site.description,
      url: SITE_URL + "/"
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      toast("Share link copied.");
    } catch (error) {
      toast("Share this link: " + shareData.url);
    }
  }

  function goBackToTop() {
    const route = parseRoute();
    if (route.page !== "home") {
      navigateTo("home");
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 40);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openFullscreen() {
    const wrap = document.getElementById("gameFrameWrap");
    if (!wrap) return;
    if (wrap.requestFullscreen) {
      wrap.requestFullscreen();
    }
  }

  function setMeta(options) {
    const image = options.image || DEFAULT_OG_IMAGE;
    document.title = options.title;
    setMetaContent("description", options.description);
    setMetaContent("robots", options.noindex ? "noindex,nofollow" : "index,follow");
    setMetaContent("twitter:card", "summary_large_image");
    setMetaContent("twitter:title", options.title);
    setMetaContent("twitter:description", options.description);
    setMetaContent("twitter:image", image);
    setPropertyContent("og:type", options.type || "website");
    setPropertyContent("og:title", options.title);
    setPropertyContent("og:description", options.description);
    setPropertyContent("og:url", options.canonical);
    setPropertyContent("og:image", image);
    setPropertyContent("og:image:width", "1200");
    setPropertyContent("og:image:height", "630");

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", options.canonical);

    const script = document.getElementById("structuredData");
    if (script) {
      script.textContent = JSON.stringify(
        options.schema || {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: options.title,
          url: options.canonical,
          description: options.description
        },
        null,
        2
      );
    }
  }

  function setSiteIcon(iconImage) {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);
    }
    favicon.setAttribute("href", iconImage ? displayImageSrc(iconImage) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23007aff'/%3E%3Ctext x='32' y='39' text-anchor='middle' font-size='22' font-family='Arial' font-weight='800' fill='white'%3ECG%3C/text%3E%3C/svg%3E");
  }

  function setMetaContent(name, value) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", value);
  }

  function setPropertyContent(property, value) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", value);
  }

  function emptyState(title, message) {
    return `
      <section class="empty-state">
        <div>
          <h2>${escapeHTML(title)}</h2>
          <p>${escapeHTML(message)}</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-action="random-game">${icon("shuffle")} Random game</button>
            <a class="secondary-button" href="${hrefFor("home")}">${icon("home")} Home</a>
          </div>
        </div>
      </section>
    `;
  }

  function notFound(title, message) {
    return `<div class="page-shell">${emptyState(title, message)}</div>`;
  }

  function posterStyle(game) {
    const colors = Array.isArray(game.poster) && game.poster.length >= 2 ? game.poster : colorPairFromString(game.title);
    return `--poster-a:${escapeAttr(colors[0])}; --poster-b:${escapeAttr(colors[1])};`;
  }

  function gameAspectRatio(game) {
    return normalizeAspectRatioInput(game?.aspectRatio || "") || DEFAULT_GAME_ASPECT_RATIO;
  }

  function iframePolicyAttributes(game) {
    const iframeUrl = normalizeProviderIframeUrl(game?.iframeUrl || "");
    const isFamobi = isFamobiIframeUrl(iframeUrl);
    const referrer = `referrerpolicy="${isFamobi ? "no-referrer" : "no-referrer-when-downgrade"}"`;
    const permissions = normalizeIframePermissions(game);
    const sandboxTokens = ["allow-scripts", "allow-same-origin", "allow-pointer-lock", "allow-forms"];
    const allowTokens = ["autoplay", "gamepad", "clipboard-read", "clipboard-write"];

    if (permissions.allowAutoRedirect) {
      sandboxTokens.push("allow-top-navigation");
    } else if (permissions.allowClickRedirect) {
      sandboxTokens.push("allow-top-navigation-by-user-activation");
    }

    if (permissions.allowPopups || isFamobi) {
      sandboxTokens.push("allow-popups");
      if (permissions.allowPopupEscape || isFamobi) {
        sandboxTokens.push("allow-popups-to-escape-sandbox");
      }
    }

    if (permissions.allowFullscreen) {
      allowTokens.unshift("fullscreen");
    }

    const fullscreenAttr = permissions.allowFullscreen ? " allowfullscreen" : "";
    return `sandbox="${sandboxTokens.join(" ")}" allow="${allowTokens.join("; ")}"${fullscreenAttr} ${referrer}`;
  }

  function normalizeGameRecord(game) {
    if (!game || typeof game !== "object") return;
    delete game.size;
    if (game.iframeUrl) {
      game.iframeUrl = normalizeProviderIframeUrl(game.iframeUrl);
    }
    game.iframePermissions = normalizeIframePermissions(game);
    if (isFamobiIframeUrl(game.iframeUrl)) {
      game.iframePermissions.allowPopups = true;
      game.iframePermissions.allowPopupEscape = true;
    }
    delete game.strictIframe;
  }

  function normalizeIframePermissions(game) {
    const legacyAllowsEverything = game?.strictIframe === false;
    const fallbackPermissions = legacyAllowsEverything
      ? {
          allowAutoRedirect: true,
          allowPopups: true,
          allowPopupEscape: true,
          allowFullscreen: true,
          allowClickRedirect: true
        }
      : DEFAULT_IFRAME_PERMISSIONS;
    return {
      allowAutoRedirect: Boolean(game?.iframePermissions?.allowAutoRedirect ?? fallbackPermissions.allowAutoRedirect),
      allowPopups: Boolean(game?.iframePermissions?.allowPopups ?? fallbackPermissions.allowPopups),
      allowPopupEscape: Boolean(game?.iframePermissions?.allowPopupEscape ?? fallbackPermissions.allowPopupEscape),
      allowFullscreen: Boolean(game?.iframePermissions?.allowFullscreen ?? fallbackPermissions.allowFullscreen),
      allowClickRedirect: Boolean(game?.iframePermissions?.allowClickRedirect ?? fallbackPermissions.allowClickRedirect)
    };
  }

  function readIframePermissions(data) {
    return {
      allowAutoRedirect: Boolean(data.get("allowIframeAutoRedirect")),
      allowPopups: Boolean(data.get("allowIframePopups")),
      allowPopupEscape: Boolean(data.get("allowIframePopupEscape")),
      allowFullscreen: Boolean(data.get("allowIframeFullscreen")),
      allowClickRedirect: Boolean(data.get("allowIframeClickRedirect"))
    };
  }

  function colorPairFromString(value) {
    const palette = ["#007aff", "#34c759", "#5856d6", "#ff9500", "#ff2d55", "#30b0c7", "#ff3b30"];
    let hash = 0;
    String(value)
      .split("")
      .forEach((char) => {
        hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
      });
    return [palette[hash % palette.length], palette[(hash + 3) % palette.length]];
  }

  function getInitials(game) {
    if (game.initials) return String(game.initials).slice(0, 3).toUpperCase();
    return String(game.title || "CG")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  function splitList(value) {
    return value
      .split(",")
      .map((item) => normalizeTag(item))
      .filter(Boolean);
  }

  function uniqueValues(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }

  function normalizeTag(value) {
    return String(value || "")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function slugify(value) {
    const slug = String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || "item";
  }

  function uniqueSlug(base, collection) {
    let slug = base || "item";
    let index = 2;
    while (collection.some((item) => item.slug === slug)) {
      slug = `${base}-${index}`;
      index += 1;
    }
    return slug;
  }

  function uniqueGameSlug(base) {
    const reserved = ["admin", "category", "games", "new-games", "popular-games", "recently-played", "search", "tags"];
    let slug = base || "game";
    let index = 2;
    while (reserved.includes(slug) || state.games.some((game) => game.slug === slug) || (state.deletedGames || []).some((game) => game.slug === slug)) {
      slug = `${base}-${index}`;
      index += 1;
    }
    return slug;
  }

  function formatDate(value) {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Number(value || 0));
  }

  function hexToSoftBg(hex) {
    const clean = String(hex || "#007aff").replace("#", "");
    if (clean.length !== 6) return "rgba(0, 122, 255, 0.1)";
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }

  function icon(name) {
    return `<i data-lucide="${escapeAttr(name || "circle")}"></i>`;
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function toast(message) {
    const element = document.getElementById("toast");
    if (!element) return;
    window.clearTimeout(toastTimer);
    element.textContent = message;
    element.classList.add("is-visible");
    toastTimer = window.setTimeout(() => element.classList.remove("is-visible"), 2600);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return map[char];
    });
  }

  function escapeAttr(value) {
    return escapeHTML(value).replace(/`/g, "&#96;");
  }

})();
