import express from "express";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const [products, categories] = await Promise.all([
            Product.find({}, "_id updatedAt"),
            Category.find({}, "slug updatedAt"),
        ]);
        const baseUrl = "https://superfineboy.co.za";

        // public pages only (the cart needs a login, so search engines can't use it)
        const staticUrls = [
            { loc: "/", priority: "1.0" },
            { loc: "/track-order", priority: "0.5" },
        ];

        // start of categories (follow whatever the admin has added)
        const categoryUrls = categories.map((c) => ({
            loc: `/category/${c.slug}`,
            lastmod: c.updatedAt?.toISOString().split("T")[0],
            priority: "0.7",
        }));
        // end of categories

        const productUrls = products.map((p) => ({
            loc: `/product/${p._id}`,
            lastmod: p.updatedAt?.toISOString().split("T")[0],
            priority: "0.8",
        }));

        const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

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
