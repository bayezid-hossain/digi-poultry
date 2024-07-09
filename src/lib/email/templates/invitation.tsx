import { APP_TITLE } from "@/lib/constants";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface InvitationEmailTemplateProps {
  senderName: string;
  organizationName: string;
  farmerName?: string;
}

export const InvitationEmailTemplate = ({
  farmerName,
  senderName,
  organizationName,
}: InvitationEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        You're invited to join {farmerName ? `${farmerName}'s cycle under the` : "the"}{" "}
        {organizationName}. org
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>Hi,</Text>
            <Text style={text}>
              {senderName} has invited you to join {organizationName}. Login and check your
              notification panel to accept or reject the Invitation
            </Text>

            <Text style={text}>
              If you don&apos;t want to join or didn&apos;t request this, just ignore and delete
              this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email to anyone.
            </Text>
            <Text style={text}>Looking forward to having you with us!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const title = {
  ...text,
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "32px",
};

const button = {
  backgroundColor: "#09090b",
  borderRadius: "4px",
  color: "#fafafa",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

export default InvitationEmailTemplate;
