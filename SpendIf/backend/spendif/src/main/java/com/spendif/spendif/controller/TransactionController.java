package com.spendif.spendif.controller;

import com.spendif.spendif.models.Transaction;
import com.spendif.spendif.models.User;
import com.spendif.spendif.services.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/{userId}")
    public Transaction addTransaction(@PathVariable Long userId, @RequestBody Transaction tx) {
        // Fetches user from DB
        User dummyUser = new User();
        dummyUser.setId(userId);
        dummyUser.setHomeCountry("UAE"); // example
        dummyUser.setAverageTransactionAmount(200); 
        dummyUser.setDormant(false);

        return transactionService.addTransaction(tx, dummyUser);
    }

    @GetMapping("/{userId}")
    public List<Transaction> getUserTransactions(@PathVariable Long userId) {
        return transactionService.getUserTransactions(userId);
    }
}
