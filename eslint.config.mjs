import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
    ...nextCoreWebVitals,
    {
        ignores: [".next/**/*", "node_modules/**/*"],
        rules: {
            "react-hooks/set-state-in-effect": "off",
        },
    }
]);
