import { ZLICX_LOGO, ZLICX_THUMBNAIL } from "@zlicx/utils";
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

export default function WelcomeEmail({
  name = "Brendon Urie",
  email = "panic@thedis.co",
}: {
  name: string | null;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to zlicx.com</Preview>
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
              Welcome to zlicx.com
            </Heading>
            <Section className="my-8">
              <Img src={ZLICX_THUMBNAIL} alt="Zlicx" className="max-w-[500px]" />
            </Section>
            <Text className="text-sm leading-6 text-black">
              Thanks for signing up{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              My name is Steven, and I'm the founder of zlicx.com - the modern link
              management platform for you to create marketing campaigns, link
              sharing features, and referral programs. We're excited to have you
              on board!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Here are a few things you can do:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Create a{" "}
              <Link
                href="https://app.zlicx.com?newWorkspace=true"
                className="font-medium text-blue-600 no-underline"
              >
                new workspace
              </Link>{" "}
              and{" "}
              <Link
                href="https://zlicx.com/help/article/how-to-add-custom-domain"
                className="font-medium text-blue-600 no-underline"
              >
                add your custom domain
              </Link>
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Create your first{" "}
              <Link
                href="https://zlicx.com/help/article/how-to-create-link"
                className="font-medium text-blue-600 no-underline"
              >
                short link
              </Link>
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Check out our{" "}
              <Link
                href="https://zlicx.com/api"
                className="font-medium text-blue-600 no-underline"
              >
                API documentation
              </Link>{" "}
              for programmatic link generation
            </Text>
            <Text className="text-sm leading-6 text-black">
              Let me know if you have any questions or feedback. I'm always
              happy to help!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Anandhan from Zlicx
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
