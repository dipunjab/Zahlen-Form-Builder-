import {
  Html,
  Head,
  Font,
  Preview,
  Section,
  Heading,
  Text,
  Row,
  Container,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Use this code to verify your account: {otp}</Preview>

      <Section style={styles.wrapper}>
        <Container style={styles.container}>
          <Heading as="h2" style={styles.heading}>
            Hello {username},
          </Heading>

          <Text style={styles.text}>
            Thanks for registering! Use the following code to verify your account:
          </Text>

          <Row>
            <Text style={styles.otp}>{otp}</Text>
          </Row>

          <Text style={styles.text}>
            If you did not request this code, please ignore this email.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#ffffff",
    padding: "40px 0",
    fontFamily: "Roboto, Verdana, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "480px",
    margin: "0 auto",
    padding: "24px",
    border: "1px solid #eee",
    borderRadius: "12px",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "12px",
    color: "#000",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#333",
    marginBottom: "20px",
  },
  otp: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#FFBF00",
    color: "#000",
    fontWeight: 700,
    fontSize: "20px",
    borderRadius: "8px",
    letterSpacing: "2px",
    textAlign: "center" as const,
    marginBottom: "24px",
  },
};
