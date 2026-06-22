package com.hms.billing.util;

import java.math.BigDecimal;

public class TaxCalculator {

    private static final BigDecimal TAX_RATE = new  BigDecimal("0.18");

    public static BigDecimal calculateTax(BigDecimal amount) {

        return  amount.multiply(TAX_RATE);

    }

}
