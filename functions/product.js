const CATALOGS = [
    "/js/wedding-products.js",
    "/js/corporate-products.js",
    "/js/celebration-products.js"
];

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

async function findProduct(context, id) {

    for (const path of CATALOGS) {

        const catalogUrl = new URL(
            path,
            context.request.url
        );

        const response =
            await context.env.ASSETS.fetch(catalogUrl);

        if (!response.ok) continue;

        const text = await response.text();

        const idRegex = new RegExp(
            `\\bid\\s*:\\s*${id}\\b`
        );

        const match = idRegex.exec(text);

        if (!match) continue;

        const productText =
            text.slice(match.index, match.index + 12000);

        const nameMatch =
            /\bname\s*:\s*"([^"]+)"/.exec(productText);

        const imageMatch =
            /\bimages\s*:\s*\[\s*"([^"]+)"/.exec(productText);

        const descriptionMatch =
            /\bdescription\s*:\s*"([^"]*)"/.exec(productText);

        if (nameMatch && imageMatch) {

            return {
                name: nameMatch[1],
                image: imageMatch[1],
                description:
                    descriptionMatch?.[1] ||
                    "Customized souvenirs and gifts by Philia Gifts"
            };
        }
    }

    return null;
}

export async function onRequestGet(context) {

    const url = new URL(context.request.url);

    const id = Number(
        url.searchParams.get("id")
    );

    const pageUrl = new URL(
        "/product",
        context.request.url
    );

    const response =
        await context.env.ASSETS.fetch(pageUrl);

    if (!id || !response.ok) {
        return response;
    }

    const product =
        await findProduct(context, id);

    if (!product) {
        return response;
    }

    let html = await response.text();

    // Force the image path to start from website root
    const imagePath =
        product.image.startsWith("/")
            ? product.image
            : "/" + product.image;

    // Use the actual production domain
    const imageUrl =
        `https://www.philiagifts.com${imagePath}`;

    const productUrl =
        `https://www.philiagifts.com/product?id=${id}`;

    const title =
        `${product.name} | Philia Gifts`;

    html = html
        .replace(
            /<title>.*?<\/title>/i,
            `<title>${escapeHtml(title)}</title>`
        )
        .replace(
            /<meta property="og:title"[^>]*>/i,
            `<meta property="og:title" content="${escapeHtml(title)}">`
        )
        .replace(
            /<meta property="og:description"[^>]*>/i,
            `<meta property="og:description" content="${escapeHtml(product.description)}">`
        )
        .replace(
            /<meta property="og:image"[^>]*>/i,
            `<meta property="og:image" content="${imageUrl}">`
        )
        .replace(
            /<meta property="og:url"[^>]*>/i,
            `<meta property="og:url" content="${productUrl}">`
        )
        .replace(
            /<meta name="twitter:title"[^>]*>/i,
            `<meta name="twitter:title" content="${escapeHtml(title)}">`
        )
        .replace(
            /<meta name="twitter:description"[^>]*>/i,
            `<meta name="twitter:description" content="${escapeHtml(product.description)}">`
        )
        .replace(
            /<meta name="twitter:image"[^>]*>/i,
            `<meta name="twitter:image" content="${imageUrl}">`
        );

    return new Response(html, {
        status: response.status,
        headers: {
            "content-type":
                "text/html; charset=UTF-8"
        }
    });
}