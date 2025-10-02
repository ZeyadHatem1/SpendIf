package com.spendif.spendif.services;

import com.spendif.spendif.models.Transaction;
import com.spendif.spendif.models.User;
import com.spendif.spendif.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction addTransaction(Transaction tx, User user) {
        tx.setUser(user);

        
        String reason = FraudChecker.check(tx, user);
        if (reason != null) {
            tx.setFlagged(true);
            tx.setFlagReason(reason);
        }

        return transactionRepository.save(tx);
    }

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
}
