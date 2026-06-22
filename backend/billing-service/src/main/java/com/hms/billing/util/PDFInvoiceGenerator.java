package com.hms.billing.util;

import com.hms.billing.entity.Invoice;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;


public class PDFInvoiceGenerator {

    private PDFInvoiceGenerator() {
    }

    public static void generate(Invoice invoice) {
        try {
            Document document = new Document();

            PdfWriter.getInstance(document, new FileOutputStream("invoice-" + invoice.getId() + ".pdf"));

            document.open();

            document.add(new Paragraph("Hospital Invoice"));

            document.add(new Paragraph("Invoice ID: " + invoice.getId()));

            document.add(new Paragraph("Patient ID: " + invoice.getPatientId()));

            document.add(new Paragraph("Total Amount: " + invoice.getTotalAmount()));

            document.close();

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

}
