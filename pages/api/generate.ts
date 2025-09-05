import type { NextApiRequest, NextApiResponse } from 'next';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { formatDateUA } from '../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const data = req.body;

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
        </View>
      </Page>
    </Document>
  );

  const pdfBuffer = await pdf(doc).toBuffer();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
  res.send(Buffer.from(pdfBuffer));
}
