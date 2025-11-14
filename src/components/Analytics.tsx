import { config } from "../config.tsx";

/**
 * Analytics component that sets up Google Analytics using the provided googleTagID.
 *
 * It only initializes analytics in production mode and if the googleTagID is set.
 *
 * Note: This component relies on support for document metadata tags introduced in React 19.
 * See also: https://react.dev/reference/react-dom/components/script
 */
const Analytics = () => {
  if (import.meta.env.DEV) {
    console.warn("Skipping analytics setup in development mode");
    return null;
  }
  if (!config.googleTagID) {
    console.warn("Skipping analytics setup because googleTagID is not set");
    return null;
  }
  return (
    <>
      <script
        async={true}
        src={`https://www.googletagmanager.com/gtag/js?id=${config.googleTagID}`}
      />
      <script>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "${config.googleTagID}");
        `}
      </script>
    </>
  );
};

export default Analytics;
