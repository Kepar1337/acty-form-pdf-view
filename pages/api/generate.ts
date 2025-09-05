import type { NextApiRequest, NextApiResponse } from 'next';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { formatDateUA } from '../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const data = req.body;

  const ukToLatin: Record<string, string> = {
    А: 'A', а: 'a', Б: 'B', б: 'b', В: 'V', в: 'v', Г: 'H', г: 'h', Ґ: 'G', ґ: 'g',
    Д: 'D', д: 'd', Е: 'E', е: 'e', Є: 'Ye', є: 'ie', Ж: 'Zh', ж: 'zh', З: 'Z', з: 'z',
    И: 'Y', и: 'y', І: 'I', і: 'i', Ї: 'Yi', ї: 'i', Й: 'Y', й: 'i', К: 'K', к: 'k',
    Л: 'L', л: 'l', М: 'M', м: 'm', Н: 'N', н: 'n', О: 'O', о: 'o', П: 'P', п: 'p',
    Р: 'R', р: 'r', С: 'S', с: 's', Т: 'T', т: 't', У: 'U', у: 'u', Ф: 'F', ф: 'f',
    Х: 'Kh', х: 'kh', Ц: 'Ts', ц: 'ts', Ч: 'Ch', ч: 'ch', Ш: 'Sh', ш: 'sh',
    Щ: 'Shch', щ: 'shch', Ю: 'Yu', ю: 'iu', Я: 'Ya', я: 'ia', Ь: '', ь: '', "'": ''
  };

  function transliterate(text: string) {
    return text
      .split('')
      .map((ch) => (ukToLatin as any)[ch] ?? ch)
      .join('');
  }

  const signerName = data.transliterate
    ? transliterate(data.signerName || '')
    : data.signerName;

  const styles = StyleSheet.create({
    section: { margin: 10, padding: 10, fontSize: 12 },
  });

  const doc = (
    <Document>
      <Page>
        <View style={styles.section}>
          <Text>Invoice Number: {data.invoiceNumber}</Text>
          <Text>Date: {formatDateUA(data.date)}</Text>
          <Text>Client: {data.clientName}</Text>
          {data.items?.map((item: any, index: number) => (
            <Text key={index}>
              {item.description}: {item.quantity} {item.unit} x {item.price} ={' '}
              {item.quantity * item.price}
            </Text>
          ))}
          <Text>Total: {data.total}</Text>
          {(data.signature || data.stamp) && (
            <View
              style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}
            >
              {data.signature && (
                <Image
                  src={data.signature}
                  style={{ width: 100, height: 50, objectFit: 'contain', marginRight: 20 }}
                />
              )}
              {data.stamp && (
                <Image
                  src={data.stamp}
                  style={{ width: 100, height: 100, objectFit: 'contain' }}
                />
              )}
            </View>
          )}
          {signerName && <Text style={{ marginTop: 10 }}>Signer: {signerName}</Text>}
        </View>
      </Page>
    </Document>
  );

  const pdfBuffer = await pdf(doc).toBuffer();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
  res.send(Buffer.from(pdfBuffer));
}
