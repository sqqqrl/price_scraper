Commands

1) npm run start --
    options:
        required:
            --suite=path/to/site/config/file
        optional:
            --headless
    Example: npm run start -- -s="./src/coverage/Allo/siteSuite.ts" --headless

2) npm run sitemaps --
    options:
        required:
            --sitemapPath (-p) =path/to/site/config/file
        optional:
            --headless (-h)
    Example: npm run sitemaps -- -p="./src/coverage/Allo/siteSuite.ts" -h