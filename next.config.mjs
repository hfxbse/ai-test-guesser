import { setupDevBindings } from '@cloudflare/next-on-pages/next-dev'

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
    await setupDevBindings({
        bindings: {
            DB: {
                type: "d1",
                id: "DB"
            }
        }
    })
}
