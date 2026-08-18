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

        // Find this exact product ID
        const idRegex = new RegExp(
            `\\bid\\s*:\\s*${id}\\b`
        );

        const match = idRegex.exec(text);

        if (!match) continue;

        // Read only the product section after the ID
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

    // Get the normal product page
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

    const imageUrl = new URL(
        product.image,
        context.request.url
    ).href;

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
        );

    return new Response(html, {
        status: response.status,
        headers: {
            "content-type":
                "text/html; charset=UTF-8"
        }
    });
}