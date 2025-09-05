import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const data = req.body;

  const styles = StyleSheet.create({
    section: { margin: 10, padding: 10, fontSize: 12 },
  });

  const lineItems = data.items?.map((item: any, index: number) =>
    React.createElement(
      Text,
      { key: index },
      `${item.description}: ${item.quantity} ${item.unit} x ${item.price} = ${item.quantity * item.price}`
    )
  );

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      null,
      React.createElement(
        View,
        { style: styles.section },
        [
          React.createElement(Text, { key: 'invoice' }, `Invoice Number: ${data.invoiceNumber}`),
          React.createElement(Text, { key: 'date' }, `Date: ${data.date}`),
          React.createElement(Text, { key: 'client' }, `Client: ${data.clientName}`),
          ...(lineItems || []),
          React.createElement(Text, { key: 'total' }, `Total: ${data.total}`),
        ]
      )
    )
  );

  const pdfBuffer = await pdf(doc).toBuffer();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
  res.send(Buffer.from(pdfBuffer));
}

