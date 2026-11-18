import { APIRequestContext, expect } from '@playwright/test';

type MailpitMessageSummary = {
  ID?: string;
  Id?: string;
  id?: string;
};

type MailpitSearchResponse = {
  messages?: MailpitMessageSummary[];
  total?: number;
};

type MailpitMessageResponse = {
  Subject?: string;
  Snippet?: string;
  subject?: string;
  Text?: string;
  text?: string;
  [key: string]: unknown;
};

function getMessageId(message: MailpitMessageSummary): string | undefined {
  return message.ID ?? message.Id ?? message.id;
}

export async function limpiarMailpit(
  request: APIRequestContext,
  mailpitUrl: string,
): Promise<void> {
  const response = await request.delete(
    new URL('/api/v1/messages', mailpitUrl).toString(),
  );

  if (!response.ok()) {
    throw new Error(`No se pudo vaciar Mailpit. HTTP ${response.status()}`);
  }
}

export async function obtenerCodigoMiembro(
  request: APIRequestContext,
  mailpitUrl: string,
  email: string,
): Promise<string> {
  const searchUrl = new URL('/api/v1/search', mailpitUrl);
  searchUrl.searchParams.set('query', `to:${email}`);

  let messageId: string | undefined;

  await expect
    .poll(
      async () => {
        const response = await request.get(searchUrl.toString());
        if (!response.ok()) {
          return undefined;
        }
        const data = (await response.json()) as MailpitSearchResponse;
        const firstMessage = data.messages?.[0];
        messageId = firstMessage ? getMessageId(firstMessage) : undefined;
        return messageId;
      },
      {
        message: `Esperar un mensaje de Mailpit para ${email}`,
        timeout: 30_000,
        intervals: [500, 1_000, 2_000],
      },
    )
    .toBeTruthy();

  if (!messageId) {
    throw new Error(`Mailpit no devolvió un mensaje para ${email}`);
  }

  const messageUrl = new URL(
    `/api/v1/message/${encodeURIComponent(messageId)}`,
    mailpitUrl,
  );
  const messageResponse = await request.get(messageUrl.toString());

  if (!messageResponse.ok()) {
    throw new Error(
      `No se pudo leer el mensaje de Mailpit. HTTP ${messageResponse.status()}`,
    );
  }

  const message = (await messageResponse.json()) as MailpitMessageResponse;

  const subject = message.Subject ?? message.subject ?? '';
  const subjectMatch = subject.match(/code\s+(\d{6})/i);
  if (subjectMatch) {
    return subjectMatch[1];
  }

  const body = [message.Text, message.Snippet].filter(Boolean).join('\n');
  const bodyMatch = body.match(/\b(\d{6})\b/);
  if (!bodyMatch) {
    throw new Error(
      `No se encontró un código de seis dígitos en el mensaje de Mailpit para ${email}`,
    );
  }

  return bodyMatch[1];
}