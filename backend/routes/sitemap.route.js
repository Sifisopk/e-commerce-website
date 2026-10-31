import express from "express";
import Product from "../models/product.model.js";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const products = await Product.find({}, "_id updatedAt");
        const baseUrl = "https://superfineboy.co.za";

        const staticUrls = [
            { loc: "/", priority: "1.0" },
            { loc: "/cart", priority: "0.3" },
            { loc: "/track-order", priority: "0.5" },
        ];

        const productUrls = products.map((p) => ({
            loc: `/product/${p._id}`,
            lastmod: p.updatedAt?.toISOString().split("T")[0],
            priority: "0.8",
        }));

        const allUrls = [...staticUrls, ...productUrls];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
    .map(
        (u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        console.log("Sitemap error:", error.message);
        res.status(500).send("Error generating sitemap");
    }
});

export default router;