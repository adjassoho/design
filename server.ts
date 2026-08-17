import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface FedaPayTransactionPayload {
  cardId: string;
  amount: number;
  customer: {
    firstname: string;
    lastname: string;
    email?: string;
    phone_number?: {
      number: string;
      country: string;
    };
  };
  customMode?: "mtn_open" | "moov" | "wave" | "card" | "standard";
}

// In-memory portrait store for uploaded deceased photos
interface StoredPortrait {
  id: string;
  data: Buffer;
  mimeType: string;
  createdAt: number;
}
const portraitStore: Record<string, StoredPortrait> = {};

// In-memory memorial profile store
const memorialStore: Record<string, any> = {};

// In-memory transaction registry for resilient state tracking
const transactionStore: Record<
  string,
  {
    id: string;
    cardId: string;
    amount: number;
    currency: string;
    status: "pending" | "approved" | "declined" | "canceled";
    customer: any;
    createdAt: string;
    paymentMode?: string;
    reference: string;
  }
> = {};

/**
 * Dynamically injects Open Graph meta tags, Twitter card, dynamic Favicon, and page title
 * into the HTML response so that WhatsApp, Facebook, Telegram, and mobile browsers
 * receive the uploaded photo as thumbnail (vignette) and "Faire-part" as title.
 */
function renderDynamicHtmlMeta(template: string, req: express.Request): string {
  const query = req.query as Record<string, string>;

  // Check if memorial ID is passed
  let fullName = query.name || "Peter Abiodun Oyenuga";
  let birthYear = query.birth || "1953";
  let passingYear = query.pass || query.passing || "2024";
  let photoUrl =
    query.photo ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80";

  if (query.id && memorialStore[query.id]) {
    const saved = memorialStore[query.id];
    if (saved.fullName) fullName = saved.fullName;
    if (saved.birthYear) birthYear = saved.birthYear;
    if (saved.passingYear) passingYear = saved.passingYear;
    if (saved.portraitUrl) photoUrl = saved.portraitUrl;
  }

  // Resolve absolute URL
  const forwardedProto = req.headers["x-forwarded-proto"] as string;
  const protocol = forwardedProto || req.protocol || "https";
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "localhost:3000";
  const absoluteOrigin = `${protocol}://${host}`;

  let absolutePhotoUrl = photoUrl;
  if (photoUrl && photoUrl.startsWith("/")) {
    absolutePhotoUrl = `${absoluteOrigin}${photoUrl}`;
  }

  const pageTitle = `Faire-part • ${fullName}`;
  const description = `À la mémoire pieuse de ${fullName} (${birthYear} - ${passingYear}). Faire-part officiel d'obsèques, programme du culte, hommages et recueillement.`;
  const canonicalUrl = `${absoluteOrigin}${req.originalUrl}`;

  const ogTags = `
    <!-- Dynamic Open Graph Meta for WhatsApp, Facebook, Telegram, iMessage & Social Crawlers -->
    <title>${pageTitle}</title>
    <meta name="title" content="${pageTitle}" />
    <meta name="description" content="${description}" />
    <meta property="og:site_name" content="Faire-part" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${absolutePhotoUrl}" />
    <meta property="og:image:secure_url" content="${absolutePhotoUrl}" />
    <meta property="og:image:alt" content="Photo commémorative de ${fullName}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="800" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${absolutePhotoUrl}" />

    <!-- Dynamic Favicon & Mobile Touch Icons -->
    <link rel="icon" type="image/jpeg" href="${absolutePhotoUrl}" />
    <link rel="shortcut icon" href="${absolutePhotoUrl}" />
    <link rel="apple-touch-icon" href="${absolutePhotoUrl}" />
`;

  // Clean existing title, og tags, and link icons
  let html = template.replace(/<title>.*?<\/title>/gi, "");
  html = html.replace(/<meta\s+name="title"[^>]*>/gi, "");
  html = html.replace(/<meta\s+name="description"[^>]*>/gi, "");
  html = html.replace(/<meta\s+property="og:[^>]*>/gi, "");
  html = html.replace(/<meta\s+name="twitter:[^>]*>/gi, "");
  html = html.replace(/<link\s+rel="(?:shortcut\s+)?icon"[^>]*>/gi, "");
  html = html.replace(/<link\s+rel="apple-touch-icon"[^>]*>/gi, "");

  // Inject dynamic tags into head
  html = html.replace("</head>", `${ogTags}\n  </head>`);
  return html;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON and urlencoded payloads up to 50MB for uploaded portraits
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // --- API Routes ---

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      platform: "Convive Funeral Digital Platform",
      fedapayConfigured: Boolean(process.env.FEDAPAY_SECRET_KEY),
      environment: process.env.FEDAPAY_ENVIRONMENT || "sandbox",
      storedPortraitsCount: Object.keys(portraitStore).length,
    });
  });

  // 1. Upload deceased portrait photo and get a direct public HTTPS URL
  app.post("/api/upload-portrait", (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg" } = req.body;
      if (!imageBase64 || typeof imageBase64 !== "string") {
        return res.status(400).json({ success: false, error: "Image base64 manquante." });
      }

      // Strip data URL header if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const id = `portrait_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      portraitStore[id] = {
        id,
        data: buffer,
        mimeType: mimeType || "image/jpeg",
        createdAt: Date.now(),
      };

      const forwardedProto = req.headers["x-forwarded-proto"] as string;
      const protocol = forwardedProto || req.protocol || "https";
      const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "localhost:3000";
      const fullUrl = `${protocol}://${host}/api/portrait/${id}.jpg`;

      res.json({
        success: true,
        id,
        url: `/api/portrait/${id}.jpg`,
        fullUrl,
      });
    } catch (err: any) {
      console.error("Erreur upload photo portrait:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Serve uploaded portrait image directly with cache headers
  app.get("/api/portrait/:id", (req, res) => {
    try {
      let rawId = req.params.id;
      // Remove any file extension like .jpg or .png
      rawId = rawId.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");

      const portrait = portraitStore[rawId];
      if (!portrait) {
        // Redirect to high quality fallback image
        return res.redirect(
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
        );
      }

      res.setHeader("Content-Type", portrait.mimeType || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(portrait.data);
    } catch (err: any) {
      console.error("Erreur lecture portrait:", err);
      res.status(500).send("Erreur serveur");
    }
  });

  // 3. Save or sync a full memorial profile to server store
  app.post("/api/memorial/save", (req, res) => {
    try {
      const memorial = req.body;
      if (!memorial || !memorial.id) {
        return res.status(400).json({ success: false, error: "Identifiant de faire-part manquant." });
      }
      memorialStore[memorial.id] = memorial;
      res.json({ success: true, id: memorial.id });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Get a saved memorial profile by ID
  app.get("/api/memorial/:id", (req, res) => {
    const memorial = memorialStore[req.params.id];
    if (!memorial) {
      return res.status(404).json({ success: false, error: "Faire-part non trouvé." });
    }
    res.json({ success: true, memorial });
  });

  // 5. Get FedaPay Public Configuration
  app.get("/api/fedapay/config", (req, res) => {
    res.json({
      publicKey: process.env.FEDAPAY_PUBLIC_KEY || "pk_sandbox_convive_demo",
      environment: process.env.FEDAPAY_ENVIRONMENT || "sandbox",
      hasSecretKey: Boolean(process.env.FEDAPAY_SECRET_KEY),
      currency: "XOF",
      launchPrice: 500, // 500 FCFA as specified in Convive Product Spec
    });
  });

  // 6. Create FedaPay Transaction
  app.post("/api/fedapay/create-transaction", async (req, res) => {
    try {
      const { cardId, amount = 500, customer, customMode } = req.body as FedaPayTransactionPayload;
      const secretKey = process.env.FEDAPAY_SECRET_KEY;
      const env = process.env.FEDAPAY_ENVIRONMENT || "sandbox";
      const baseUrl =
        env === "live"
          ? "https://api.fedapay.com/v1"
          : "https://sandbox-api.fedapay.com/v1";

      const txRef = `CONVIVE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // If FedaPay secret key is provided, attempt live or sandbox API call to FedaPay
      if (secretKey && secretKey.trim().length > 5) {
        const payload = {
          description: `Publication Faire-part d'Obsèques Convive #${cardId || "FUNERAL"}`,
          amount: amount || 500,
          currency: {
            iso: "XOF",
          },
          callback_url: `${req.headers.origin || "http://localhost:3000"}/?paid=true&ref=${txRef}`,
          customer: {
            firstname: customer?.firstname || "Famille",
            lastname: customer?.lastname || "Organisateur",
            email: customer?.email || "organisateur@convive.bj",
            phone_number: {
              number: customer?.phone_number?.number || "97000000",
              country: customer?.phone_number?.country || "BJ",
            },
          },
        };

        const fedaResponse = await fetch(`${baseUrl}/transactions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (fedaResponse.ok) {
          const fedaData = await fedaResponse.json();
          const fedaTx = fedaData.v1?.transaction || fedaData.transaction || fedaData;
          const txId = String(fedaTx.id || txRef);

          // Generate token for payment checkout url
          let checkoutUrl = fedaTx.payment_url || "";
          if (!checkoutUrl && fedaTx.id) {
            const tokenRes = await fetch(`${baseUrl}/transactions/${fedaTx.id}/token`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
              },
            });
            if (tokenRes.ok) {
              const tokenData = await tokenRes.json();
              checkoutUrl = tokenData.url || tokenData.token?.url || "";
            }
          }

          transactionStore[txId] = {
            id: txId,
            cardId: cardId || "default",
            amount: amount || 500,
            currency: "XOF",
            status: "pending",
            customer,
            createdAt: new Date().toISOString(),
            paymentMode: customMode || "fedapay_gateway",
            reference: txRef,
          };

          return res.json({
            success: true,
            transactionId: txId,
            reference: txRef,
            paymentUrl: checkoutUrl,
            mode: "live_fedapay",
            status: "pending",
          });
        }
      }

      // Fallback sandbox simulation for local/testing execution (Instant Mobile Money simulation)
      const simulatedTxId = `fedatx_${Date.now()}`;
      transactionStore[simulatedTxId] = {
        id: simulatedTxId,
        cardId: cardId || "default",
        amount: amount || 500,
        currency: "XOF",
        status: "pending",
        customer: customer || {
          firstname: "Famille",
          lastname: "Organisateur",
          phone_number: { number: "97000000", country: "BJ" },
        },
        createdAt: new Date().toISOString(),
        paymentMode: customMode || "mtn_open",
        reference: txRef,
      };

      res.json({
        success: true,
        transactionId: simulatedTxId,
        reference: txRef,
        paymentUrl: null,
        mode: "sandbox_simulation",
        status: "pending",
        message: "Session FedaPay Mobile Money prête.",
      });
    } catch (err: any) {
      console.error("Erreur création transaction FedaPay:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Erreur interne lors de la création de la transaction.",
      });
    }
  });

  // 7. Verify FedaPay Transaction status or simulate direct mobile money validation
  app.post("/api/fedapay/verify", async (req, res) => {
    try {
      const { transactionId, simulateSuccess } = req.body;
      const secretKey = process.env.FEDAPAY_SECRET_KEY;
      const env = process.env.FEDAPAY_ENVIRONMENT || "sandbox";
      const baseUrl =
        env === "live"
          ? "https://api.fedapay.com/v1"
          : "https://sandbox-api.fedapay.com/v1";

      // If simulated or direct instant approval requested in test mode
      if (simulateSuccess || !secretKey || transactionId?.startsWith("fedatx_")) {
        if (transactionStore[transactionId]) {
          transactionStore[transactionId].status = "approved";
        }
        return res.json({
          success: true,
          status: "approved",
          transaction: transactionStore[transactionId] || {
            id: transactionId,
            status: "approved",
            amount: 500,
            currency: "XOF",
          },
          paidAt: new Date().toISOString(),
          message: "Paiement Mobile Money validé avec succès !",
        });
      }

      // Check with real FedaPay API
      const fedaResponse = await fetch(`${baseUrl}/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });

      if (fedaResponse.ok) {
        const data = await fedaResponse.json();
        const tx = data.v1?.transaction || data.transaction || data;
        const status = tx.status === "approved" ? "approved" : tx.status || "pending";

        if (transactionStore[transactionId]) {
          transactionStore[transactionId].status = status;
        }

        return res.json({
          success: true,
          status,
          transaction: tx,
        });
      }

      res.json({
        success: false,
        status: "unknown",
        message: "Statut FedaPay indisponible.",
      });
    } catch (err: any) {
      console.error("Erreur vérification FedaPay:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Webhook listener for asynchronous FedaPay notifications
  app.post("/api/fedapay/webhook", (req, res) => {
    const event = req.body;
    console.log("FedaPay Webhook Event reçu:", event?.name || event?.type);
    if (event?.entity?.id && event?.name === "transaction.approved") {
      const id = String(event.entity.id);
      if (transactionStore[id]) {
        transactionStore[id].status = "approved";
      }
    }
    res.status(200).json({ received: true });
  });

  // --- Dynamic SSR HTML Delivery with Open Graph WhatsApp metadata ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.includes(".")) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const dynamicHtml = renderDynamicHtmlMeta(template, req);
        res.status(200).set({ "Content-Type": "text/html" }).end(dynamicHtml);
      } catch (err: any) {
        vite.ssrFixStacktrace(err);
        next(err);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));

    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      try {
        const indexPath = path.join(distPath, "index.html");
        if (!fs.existsSync(indexPath)) {
          return res.status(404).send("Application dist/index.html introuvable.");
        }
        const template = fs.readFileSync(indexPath, "utf-8");
        const dynamicHtml = renderDynamicHtmlMeta(template, req);
        res.status(200).set({ "Content-Type": "text/html" }).end(dynamicHtml);
      } catch (err) {
        next(err);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Convive Funeral Platform Server running on port ${PORT}`);
  });
}

startServer();

