import { ZLICX_LOGO } from "@zlicx/utils";
import { Project } from "@prisma/client";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Footer from "./components/footer";

export default function DomainTransferred({
  email = "panic@thedis.co",
  domain = "zli.cx",
  newWorkspace = { name: "Zlicx", slug: "zlicx" },
  linksCount = 50,
}: {
  email: string;
  domain: string;
  newWorkspace: Pick<Project, "name" | "slug">;
  linksCount: number;
}) {
  return (
    <Html>
      <Head />
      <Preview>Domain Transferred</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={ZLICX_LOGO}
                width="40"
                height="40"
                alt="Zlicx"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Domain Transferred
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Your domain <code className="text-purple-600">{domain}</code>{" "}
              {linksCount > 0 && (
                <>and its {linksCount > 0 ? linksCount : ""} links </>
              )}
              has been transferred to the workspace{" "}
              <Link
                href={`https://app.zlicx.com/${newWorkspace.slug}/domains`}
                className="font-medium text-blue-600 no-underline"
              >
                {newWorkspace.name}↗
              </Link>
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
