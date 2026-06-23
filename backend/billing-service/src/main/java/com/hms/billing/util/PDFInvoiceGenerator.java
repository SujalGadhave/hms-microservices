package com.hms.billing.util;

import com.hms.billing.entity.Invoice;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;

public class PDFInvoiceGenerator {

    private PDFInvoiceGenerator() {
    }

    public static byte[] generate(Invoice invoice) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Hospital Invoice"));
            document.add(new Paragraph("Invoice ID: " + invoice.getId()));
            document.add(new Paragraph("Patient ID: " + invoice.getPatientId()));
            document.add(new Paragraph("Total Amount: " + invoice.getTotalAmount()));
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
