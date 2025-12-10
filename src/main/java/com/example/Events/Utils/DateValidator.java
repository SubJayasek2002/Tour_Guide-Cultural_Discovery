package com.example.Events.Utils;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

public class DateValidator {
    // method to validate date
    public static boolean isValidDate(LocalDate date) {
        if (date == null) {
            return false;
        }

        // convert Date to String (yyyy-MM-dd)
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String formatted = sdf.format(date);

        // strict parsing
        sdf.setLenient(false);

        try {
            // if parsing fails → invalid date
            sdf.parse(formatted);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }
}

