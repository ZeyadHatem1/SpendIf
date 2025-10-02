package com.spendif.spendif.services;

import com.spendif.spendif.models.Transaction;
import com.spendif.spendif.models.User;

public class FraudChecker {

    public static String check(Transaction tx, User user) {
        double avg = user.getAverageTransactionAmount(); 

        // Rule 1: Large transaction
        if (tx.getAmount() > 5000) {
            return "Large transaction over $5000";
        }

        // Rule 2: Unusually high compared to users spending habits
        if (avg > 0 && tx.getAmount() > avg * 5) {
            return "Unusually high compared to your normal spending";
        }

        // Rule 3: international transaction
        if (!tx.getCountry().equalsIgnoreCase(user.getHomeCountry())) {
            return "Cross-border transaction";
        }

        // Rule 4: Dormant account suddenly active
        if (user.isDormant() && tx.getAmount() > 1000) {
            return "Dormant account suddenly active";
        }

        return null; // If no fraud detected
    }
}
