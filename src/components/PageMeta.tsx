
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "YŌJU GUITARS | Electric Guitars",
    description:
      "Discover YŌJU GUITARS. Explore distinctive electric guitars, modern designs and exclusive instruments.",
  },
  "/catalog": {
    title: "Catalog | YŌJU GUITARS",
    description:
      "Explore the YŌJU GUITARS catalog and discover electric guitars designed for your individual sound.",
  },
  "/limited": {
    title: "Limited Edition | YŌJU GUITARS",
    description:
      "Discover exclusive limited-edition electric guitars from YŌJU GUITARS.",
  },
  "/about": {
    title: "About Us | YŌJU GUITARS",
    description:
      "Learn about YŌJU GUITARS, our design philosophy and our passion for electric guitars.",
  },
  "/contacts": {
    title: "Contacts | YŌJU GUITARS",
    description:
      "Contact the YŌJU GUITARS team for general inquiries, customer support and other questions.",
  },
  "/reviews": {
    title: "Reviews | YŌJU GUITARS",
    description:
      "Discover customer reviews and experiences with YŌJU GUITARS instruments.",
  },
  "/PersonalCabinet": {
    title: "My Account | YŌJU GUITARS",
    description:
      "Access your YŌJU GUITARS account and manage your personal information and orders.",
  },
  "/registration": {
    title: "Registration | YŌJU GUITARS",
    description:
      "Create your personal YŌJU GUITARS account.",
  },
  "/order": {
    title: "Order | YŌJU GUITARS",
    description:
      "Review and manage your YŌJU GUITARS order.",
  },
};

export default function PageMeta() {
  const location = useLocation();

  useEffect(() => {
    const metadata = pageMetadata[location.pathname] ?? {
      title: "Page Not Found | YŌJU GUITARS",
      description:
        "The requested page could not be found. Explore the YŌJU GUITARS website.",
    };

    document.title = metadata.title;

    let description = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }

    description.content = metadata.description;
  }, [location.pathname]);

  return null;
}
