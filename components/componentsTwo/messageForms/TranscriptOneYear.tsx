import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';
import { EdgeResult } from '@/Domain/schemas/interfaceGraphql';
import { Page, Text, View, Document, StyleSheet, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";


const TranscriptOneYear = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data: any;
  setOpen?: any;
  extra_data?: any;
}) => {

  const idTranscriptRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [results, setResults] = useState<EdgeResult[]>()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>This is a preview of an A4 page.</Text>
        </View>
        <View style={styles.section}>
          <Text>{data}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default TranscriptOneYear


const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 12,
    border: "1px solid #ddd",
  },
});