import Impl, { generateMetadata as generateSourceMetadata, generateStaticParams as generateSourceStaticParams } from "@/app-internal/localized/products/[slug]/page";
import { wrapLocaleMetadata, wrapLocalePage, wrapLocaleStaticParams } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateMetadata = wrapLocaleMetadata("en", generateSourceMetadata);
export const generateStaticParams = wrapLocaleStaticParams("en", generateSourceStaticParams);
export default wrapLocalePage("en", Impl);
