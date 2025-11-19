import { useEffect } from "react";
import { config } from "../config.tsx";

/**
 * Analytics component that sets up Google Analytics using the provided googleTagID.
 *
 * It only initializes analytics in production mode and if the googleTagID is set.
 *
 * Note: This component manually injects <script> tags into the document head to load Google
 *       Analytics. It does not rely on Reach 19's built-in <script> tag handling because that
 *       does not execute inline script content.
 *       See:
 *         - https://react.dev/reference/react-dom/components/script
 *         - https://github.com/facebook/react/issues/34008
 */
const Analytics = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("Skipping analytics setup in development mode");
      return;
    }
    if (!config.googleTagID) {
      console.warn("Skipping analytics setup because googleTagID is not set");
      return;
    }
    const srcScriptElement = document.createElement("script");
    srcScriptElement.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleTagID}`;
    srcScriptElement.async = true;
    document.head.appendChild(srcScriptElement);

    const inlineScriptElement = document.createElement("script");
    inlineScriptElement.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.googleTagID}');
    `;
    document.head.appendChild(inlineScriptElement);

    return () => {
      document.head.removeChild(srcScriptElement);
      document.head.removeChild(inlineScriptElement);
    };
  }, []);

  return null;
};

export default Analytics;
