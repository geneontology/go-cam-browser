import { Anchor } from "@mantine/core";

const releaseDatePattern = /^\/(\d{4}-\d{2}-\d{2})(?:\/|$)/;

interface GoReleaseProps {
  searchDocsUrl: string;
}

function getReleaseInfo(searchDocsUrl: string): {
  label: string;
  href?: string;
} {
  let url: URL;
  try {
    url = new URL(searchDocsUrl, window.location.origin);
  } catch {
    return { label: "unknown" };
  }

  if (url.hostname === "current.geneontology.org") {
    return {
      label: "current",
      href: "https://current.geneontology.org/",
    };
  }

  if (url.hostname === "release.geneontology.org") {
    const releaseDate = releaseDatePattern.exec(url.pathname)?.[1];
    return releaseDate
      ? {
          label: releaseDate,
          href: `https://release.geneontology.org/${releaseDate}/`,
        }
      : { label: "unknown" };
  }

  return { label: "unknown" };
}

export default function GoRelease({ searchDocsUrl }: GoReleaseProps) {
  const releaseInfo = getReleaseInfo(searchDocsUrl);
  const label = `GO Release: ${releaseInfo.label}`;

  if (!releaseInfo.href) {
    return label;
  }

  return (
    <Anchor
      href={releaseInfo.href}
      inherit
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </Anchor>
  );
}
