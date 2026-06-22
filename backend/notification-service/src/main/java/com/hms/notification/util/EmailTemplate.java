package com.hms.notification.util;

public class EmailTemplate {

    public static String appointmentConfirmation(String appointmentId,String doctorId){
        return """
                Your appointment has been confirmed!
                
                Appointment ID: %s
                Doctor ID: %s
                """.formatted(appointmentId,doctorId);
    }

}
